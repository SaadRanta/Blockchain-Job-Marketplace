// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title JobMarketplace
 * @dev Main contract for the Blockchain-based Job Marketplace
 */
contract JobMarketplace {
    // Structs
    struct JobSeeker {
        address id;
        string name;
        string contactInfo;
        string resumeHash; // IPFS hash of the resume
        string[] skills;
        uint256 registrationTime;
        bool isActive;
    }

    struct Employer {
        address id;
        string companyName;
        string industry;
        string contactInfo;
        string description;
        uint256 registrationTime;
        bool isActive;
    }

    struct JobListing {
        uint256 id;
        address employer;
        string title;
        string description;
        string[] requiredSkills;
        string location;
        uint256 salary;
        uint256 postingTime;
        bool isActive;
    }

    struct Application {
        uint256 jobId;
        address jobSeeker;
        uint256 applicationTime;
        string coverLetterHash; // IPFS hash of cover letter
        ApplicationStatus status;
    }

    enum ApplicationStatus { Applied, Reviewing, Interviewed, Accepted, Rejected }

    // State variables
    mapping(address => JobSeeker) public jobSeekers;
    mapping(address => Employer) public employers;
    mapping(uint256 => JobListing) public jobListings;
    mapping(uint256 => Application[]) public jobApplications;
    mapping(address => uint256[]) public jobSeekerApplications;

    uint256 public nextJobId = 1;

    // Events
    event JobSeekerRegistered(address indexed id, string name);
    event EmployerRegistered(address indexed id, string companyName);
    event JobPosted(uint256 indexed id, address indexed employer, string title);
    event JobApplicationSubmitted(uint256 indexed jobId, address indexed jobSeeker);
    event ApplicationStatusUpdated(uint256 indexed jobId, address indexed jobSeeker, ApplicationStatus status);

    // Modifiers
    modifier onlyJobSeeker() {
        require(jobSeekers[msg.sender].isActive, "Only registered job seekers can perform this action");
        _;
    }

    modifier onlyEmployer() {
        require(employers[msg.sender].isActive, "Only registered employers can perform this action");
        _;
    }

    modifier jobExists(uint256 _jobId) {
        require(_jobId > 0 && _jobId < nextJobId, "Job does not exist");
        require(jobListings[_jobId].isActive, "Job is not active");
        _;
    }

    modifier isJobOwner(uint256 _jobId) {
        require(jobListings[_jobId].employer == msg.sender, "Not the job owner");
        _;
    }

    // Functions
    /**
     * @dev Register as a job seeker
     * @param _name Full name of the job seeker
     * @param _contactInfo Contact information (email, phone)
     * @param _resumeHash IPFS hash of the resume
     * @param _skills Array of skills
     */
    function registerJobSeeker(
        string memory _name, 
        string memory _contactInfo, 
        string memory _resumeHash, 
        string[] memory _skills
    ) public {
        require(!jobSeekers[msg.sender].isActive, "Job seeker already registered");
        
        jobSeekers[msg.sender] = JobSeeker({
            id: msg.sender,
            name: _name,
            contactInfo: _contactInfo,
            resumeHash: _resumeHash,
            skills: _skills,
            registrationTime: block.timestamp,
            isActive: true
        });
        
        emit JobSeekerRegistered(msg.sender, _name);
    }

    /**
     * @dev Register as an employer
     * @param _companyName Name of the company
     * @param _industry Industry of the company
     * @param _contactInfo Contact information
     * @param _description Company description
     */
    function registerEmployer(
        string memory _companyName, 
        string memory _industry,
        string memory _contactInfo, 
        string memory _description
    ) public {
        require(!employers[msg.sender].isActive, "Employer already registered");
        
        employers[msg.sender] = Employer({
            id: msg.sender,
            companyName: _companyName,
            industry: _industry,
            contactInfo: _contactInfo,
            description: _description,
            registrationTime: block.timestamp,
            isActive: true
        });
        
        emit EmployerRegistered(msg.sender, _companyName);
    }

    /**
     * @dev Post a new job listing
     * @param _title Job title
     * @param _description Job description
     * @param _requiredSkills Required skills for the job
     * @param _location Job location
     * @param _salary Job salary
     */
    function postJob(
        string memory _title,
        string memory _description,
        string[] memory _requiredSkills,
        string memory _location,
        uint256 _salary
    ) public onlyEmployer {
        uint256 jobId = nextJobId;
        
        jobListings[jobId] = JobListing({
            id: jobId,
            employer: msg.sender,
            title: _title,
            description: _description,
            requiredSkills: _requiredSkills,
            location: _location,
            salary: _salary,
            postingTime: block.timestamp,
            isActive: true
        });
        
        nextJobId++;
        emit JobPosted(jobId, msg.sender, _title);
    }

    /**
     * @dev Apply for a job
     * @param _jobId ID of the job
     * @param _coverLetterHash IPFS hash of the cover letter
     */
    function applyForJob(
        uint256 _jobId, 
        string memory _coverLetterHash
    ) public onlyJobSeeker jobExists(_jobId) {
        // Check if already applied
        Application[] storage applications = jobApplications[_jobId];
        for (uint i = 0; i < applications.length; i++) {
            require(applications[i].jobSeeker != msg.sender, "Already applied for this job");
        }
        
        Application memory newApplication = Application({
            jobId: _jobId,
            jobSeeker: msg.sender,
            applicationTime: block.timestamp,
            coverLetterHash: _coverLetterHash,
            status: ApplicationStatus.Applied
        });
        
        jobApplications[_jobId].push(newApplication);
        jobSeekerApplications[msg.sender].push(_jobId);
        
        emit JobApplicationSubmitted(_jobId, msg.sender);
    }

    /**
     * @dev Update the status of a job application
     * @param _jobId ID of the job
     * @param _jobSeeker Address of the job seeker
     * @param _status New status of the application
     */
    function updateApplicationStatus(
        uint256 _jobId,
        address _jobSeeker,
        ApplicationStatus _status
    ) public onlyEmployer isJobOwner(_jobId) {
        Application[] storage applications = jobApplications[_jobId];
        bool found = false;
        
        for (uint i = 0; i < applications.length; i++) {
            if (applications[i].jobSeeker == _jobSeeker) {
                applications[i].status = _status;
                found = true;
                break;
            }
        }
        
        require(found, "Application not found");
        emit ApplicationStatusUpdated(_jobId, _jobSeeker, _status);
    }

    /**
     * @dev Deactivate a job listing
     * @param _jobId ID of the job
     */
    function deactivateJob(uint256 _jobId) public onlyEmployer isJobOwner(_jobId) {
        jobListings[_jobId].isActive = false;
    }

    /**
     * @dev Get job applications for a specific job
     * @param _jobId ID of the job
     * @return Array of applications
     */
    function getJobApplications(uint256 _jobId) 
        public 
        view 
        isJobOwner(_jobId) 
        returns (Application[] memory) 
    {
        return jobApplications[_jobId];
    }

    /**
     * @dev Get job applications submitted by a job seeker
     * @return Array of job IDs
     */
    function getMyApplications() 
        public 
        view 
        onlyJobSeeker 
        returns (uint256[] memory) 
    {
        return jobSeekerApplications[msg.sender];
    }

    /**
     * @dev Update job seeker profile
     * @param _name Full name of the job seeker
     * @param _contactInfo Contact information
     * @param _resumeHash IPFS hash of the resume
     * @param _skills Array of skills
     */
    function updateJobSeekerProfile(
        string memory _name,
        string memory _contactInfo,
        string memory _resumeHash,
        string[] memory _skills
    ) public onlyJobSeeker {
        JobSeeker storage seeker = jobSeekers[msg.sender];
        
        seeker.name = _name;
        seeker.contactInfo = _contactInfo;
        seeker.resumeHash = _resumeHash;
        seeker.skills = _skills;
    }

    /**
     * @dev Update employer profile
     * @param _companyName Name of the company
     * @param _industry Industry of the company
     * @param _contactInfo Contact information
     * @param _description Company description
     */
    function updateEmployerProfile(
        string memory _companyName,
        string memory _industry,
        string memory _contactInfo,
        string memory _description
    ) public onlyEmployer {
        Employer storage employer = employers[msg.sender];
        
        employer.companyName = _companyName;
        employer.industry = _industry;
        employer.contactInfo = _contactInfo;
        employer.description = _description;
    }
}
