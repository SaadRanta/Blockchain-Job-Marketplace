import React, { useState } from 'react';

const JobMarketplace = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [activeTab, setActiveTab] = useState('registerJobSeeker');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const showError = (err) => {
    setError(err);
    setTimeout(() => setError(''), 3000);
  };

  // Real MetaMask connection
  const connectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        showError('MetaMask is not installed. Please install MetaMask to continue.');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        showMessage('Wallet connected successfully!');
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          } else {
            disconnectWallet();
          }
        });

        // Listen for chain changes
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
      }
    } catch (err) {
      if (err.code === 4001) {
        showError('Connection rejected by user');
      } else {
        showError('Failed to connect wallet: ' + err.message);
      }
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    
    // Remove event listeners
    if (window.ethereum && window.ethereum.removeListener) {
      window.ethereum.removeListener('accountsChanged', () => {});
      window.ethereum.removeListener('chainChanged', () => {});
    }
    
    showMessage('Wallet disconnected');
  };

  // Register Job Seeker Component
  const RegisterJobSeeker = ({ showMessage, showError }) => {
    const [formData, setFormData] = useState({
      name: '',
      contactInfo: '',
      resumeHash: '',
      skills: '',
    });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Simulate API call
        setTimeout(() => {
          showMessage('Job seeker registered successfully!');
          setFormData({ name: '', contactInfo: '', resumeHash: '', skills: '' });
        }, 500);
      } catch (error) {
        showError('Error registering job seeker');
      }
    };

    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Register as Job Seeker</h2>
        <div className="space-y-5">
          {[
            { name: 'name', placeholder: 'Full Name', type: 'text' },
            { name: 'contactInfo', placeholder: 'Contact Info (Email/Phone)', type: 'text' },
            { name: 'resumeHash', placeholder: 'Resume IPFS Hash', type: 'text' },
            { name: 'skills', placeholder: 'Skills (comma-separated)', type: 'text' },
          ].map(({ name, placeholder, type }) => (
            <input
              key={name}
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
          ))}
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium"
          >
            Register
          </button>
        </div>
      </div>
    );
  };

  // Register Employer Component
  const RegisterEmployer = ({ showMessage, showError }) => {
    const [formData, setFormData] = useState({
      companyName: '',
      industry: '',
      contactInfo: '',
      description: '',
    });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setTimeout(() => {
          showMessage('Employer registered successfully!');
          setFormData({ companyName: '', industry: '', contactInfo: '', description: '' });
        }, 500);
      } catch (error) {
        showError('Error registering employer');
      }
    };

    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Register as Employer</h2>
        <div className="space-y-5">
          {[
            { name: 'companyName', placeholder: 'Company Name', type: 'text' },
            { name: 'industry', placeholder: 'Industry', type: 'text' },
            { name: 'contactInfo', placeholder: 'Contact Info', type: 'text' },
          ].map(({ name, placeholder, type }) => (
            <input
              key={name}
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
          ))}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Company Description"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 h-32 resize-none"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium"
          >
            Register
          </button>
        </div>
      </div>
    );
  };

  // Post Job Component
  const PostJob = ({ showMessage, showError }) => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      requiredSkills: '',
      location: '',
      salary: '',
    });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setTimeout(() => {
          showMessage('Job posted successfully!');
          setFormData({ title: '', description: '', requiredSkills: '', location: '', salary: '' });
        }, 500);
      } catch (error) {
        showError('Error posting job');
      }
    };

    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Post a Job</h2>
        <div className="space-y-5">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Job Title"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Job Description"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 h-32 resize-none"
          />
          <input
            type="text"
            name="requiredSkills"
            value={formData.requiredSkills}
            onChange={handleChange}
            placeholder="Required Skills (comma-separated)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Salary"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium"
          >
            Post Job
          </button>
        </div>
      </div>
    );
  };

  // Apply for Job Component
  const ApplyJob = ({ showMessage, showError }) => {
    const [formData, setFormData] = useState({
      jobId: '',
      coverLetterHash: '',
    });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setTimeout(() => {
          showMessage('Application submitted successfully!');
          setFormData({ jobId: '', coverLetterHash: '' });
        }, 500);
      } catch (error) {
        showError('Error applying for job');
      }
    };

    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Apply for a Job</h2>
        <div className="space-y-5">
          <input
            type="number"
            name="jobId"
            value={formData.jobId}
            onChange={handleChange}
            placeholder="Job ID"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
          <input
            type="text"
            name="coverLetterHash"
            value={formData.coverLetterHash}
            onChange={handleChange}
            placeholder="Cover Letter IPFS Hash"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium"
          >
            Apply
          </button>
        </div>
      </div>
    );
  };

  // Job Applications Component
  const JobApplications = ({ showMessage, showError }) => {
    const [jobId, setJobId] = useState('');
    const [applications, setApplications] = useState([]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Simulate fetching applications
        const dummyApplications = [
          { jobSeeker: '0x123...abc', status: 'Pending', applicationTime: Date.now() / 1000 },
          { jobSeeker: '0x456...def', status: 'Reviewed', applicationTime: Date.now() / 1000 - 86400 },
          { jobSeeker: '0x789...ghi', status: 'Approved', applicationTime: Date.now() / 1000 - 172800 },
        ];
        setTimeout(() => {
          setApplications(dummyApplications);
          showMessage('Applications fetched successfully');
        }, 500);
      } catch (error) {
        showError('Error fetching applications');
      }
    };

    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">View Job Applications</h2>
        <div className="space-y-5">
          <input
            type="number"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            placeholder="Job ID"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium"
          >
            Fetch Applications
          </button>
          {applications.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700">Applications:</h3>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                {applications.map((app, index) => (
                  <li key={index} className="text-gray-600">
                    <span className="font-medium">Job Seeker:</span> {app.jobSeeker}, <span className="font-medium">Status:</span> {app.status}, <span className="font-medium">Applied:</span> {new Date(app.applicationTime * 1000).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  // My Applications Component
  const MyApplications = ({ showMessage, showError }) => {
    const [jobIds, setJobIds] = useState([]);

    const handleSubmit = async () => {
      try {
        // Simulate fetching user's applications
        const dummyJobIds = [1, 3, 7, 12, 15];
        setTimeout(() => {
          setJobIds(dummyJobIds);
          showMessage('Applications fetched successfully');
        }, 500);
      } catch (error) {
        showError('Error fetching my applications');
      }
    };

    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">My Applications</h2>
        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium"
        >
          Fetch My Applications
        </button>
        {jobIds.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700">Applied Job IDs:</h3>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              {jobIds.map((id, index) => (
                <li key={index} className="text-gray-600">Job ID: {id}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Update Job Seeker Component
  const UpdateJobSeeker = ({ showMessage, showError }) => {
    const [formData, setFormData] = useState({
      name: '',
      contactInfo: '',
      resumeHash: '',
      skills: '',
    });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setTimeout(() => {
          showMessage('Job seeker profile updated successfully!');
        }, 500);
      } catch (error) {
        showError('Error updating job seeker profile');
      }
    };

    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Update Job Seeker Profile</h2>
        <div className="space-y-5">
          {[
            { name: 'name', placeholder: 'Full Name', type: 'text' },
            { name: 'contactInfo', placeholder: 'Contact Info (Email/Phone)', type: 'text' },
            { name: 'resumeHash', placeholder: 'Resume IPFS Hash', type: 'text' },
            { name: 'skills', placeholder: 'Skills (comma-separated)', type: 'text' },
          ].map(({ name, placeholder, type }) => (
            <input
              key={name}
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
          ))}
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium"
          >
            Update Profile
          </button>
        </div>
      </div>
    );
  };

  // Update Employer Component
  const UpdateEmployer = ({ showMessage, showError }) => {
    const [formData, setFormData] = useState({
      companyName: '',
      industry: '',
      contactInfo: '',
      description: '',
    });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setTimeout(() => {
          showMessage('Employer profile updated successfully!');
        }, 500);
      } catch (error) {
        showError('Error updating employer profile');
      }
    };

    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Update Employer Profile</h2>
        <div className="space-y-5">
          {[
            { name: 'companyName', placeholder: 'Company Name', type: 'text' },
            { name: 'industry', placeholder: 'Industry', type: 'text' },
            { name: 'contactInfo', placeholder: 'Contact Info', type: 'text' },
          ].map(({ name, placeholder, type }) => (
            <input
              key={name}
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
          ))}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Company Description"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 h-32 resize-none"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium"
          >
            Update Profile
          </button>
        </div>
      </div>
    );
  };

  // If not connected, show connection screen
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18-.717-.717-1.254-1.434-1.434C14.897 6.5 12 6.5 12 6.5s-2.897 0-4.128.227c-.717.18-1.254.717-1.434 1.434C6.211 9.392 6.211 12 6.211 12s0 2.608.227 3.839c.18.717.717 1.254 1.434 1.434C9.103 17.5 12 17.5 12 17.5s2.897 0 4.128-.227c.717-.18 1.254-.717 1.434-1.434C17.789 14.608 17.789 12 17.789 12s0-2.608-.227-3.839zM10.5 14.598V9.402L14.598 12 10.5 14.598z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Job Marketplace</h1>
            <p className="text-gray-600 mb-4">Connect your MetaMask wallet to access the platform</p>
            {typeof window !== 'undefined' && typeof window.ethereum === 'undefined' && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                <p className="text-sm">MetaMask is not detected. Please install MetaMask extension first.</p>
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  Download MetaMask
                </a>
              </div>
            )}
          </div>
          
          <button
            onClick={connectWallet}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            Connect MetaMask
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Header with wallet info */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Job Marketplace
        </h1>
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-md">
            <p className="text-sm text-gray-600">Connected:</p>
            <p className="font-mono text-sm text-gray-800">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
          </div>
          <button
            onClick={disconnectWallet}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            Disconnect
          </button>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {[
          { tab: 'registerJobSeeker', label: 'Register Job Seeker' },
          { tab: 'registerEmployer', label: 'Register Employer' },
          { tab: 'postJob', label: 'Post Job' },
          { tab: 'applyJob', label: 'Apply for Job' },
          { tab: 'jobApplications', label: 'Job Applications' },
          { tab: 'myApplications', label: 'My Applications' },
          { tab: 'updateJobSeeker', label: 'Update Job Seeker' },
          { tab: 'updateEmployer', label: 'Update Employer' },
        ].map(({ tab, label }) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg font-medium text-sm md:text-base transition-all duration-200 
              ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'}`}
            onClick={() => setActiveTab(tab)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Messages */}
      {message && (
        <div className="bg-green-500 text-white p-4 rounded-lg mb-6 text-center max-w-2xl mx-auto shadow-md animate-pulse">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6 text-center max-w-2xl mx-auto shadow-md animate-pulse">
          {error}
        </div>
      )}

      {/* Render Active Component */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-2xl transition-all duration-300">
        {activeTab === 'registerJobSeeker' && <RegisterJobSeeker showMessage={showMessage} showError={showError} />}
        {activeTab === 'registerEmployer' && <RegisterEmployer showMessage={showMessage} showError={showError} />}
        {activeTab === 'postJob' && <PostJob showMessage={showMessage} showError={showError} />}
        {activeTab === 'applyJob' && <ApplyJob showMessage={showMessage} showError={showError} />}
        {activeTab === 'jobApplications' && <JobApplications showMessage={showMessage} showError={showError} />}
        {activeTab === 'myApplications' && <MyApplications showMessage={showMessage} showError={showError} />}
        {activeTab === 'updateJobSeeker' && <UpdateJobSeeker showMessage={showMessage} showError={showError} />}
        {activeTab === 'updateEmployer' && <UpdateEmployer showMessage={showMessage} showError={showError} />}
      </div>
    </div>
  );
};

export default JobMarketplace;