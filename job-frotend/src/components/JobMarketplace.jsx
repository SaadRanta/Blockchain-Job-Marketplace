import React, { useState } from 'react';
import axios from 'axios';

const JobMarketplace = () => {
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
        const response = await axios.post('http://localhost:5000/register-job-seeker', {
          ...formData,
          skills: formData.skills.split(',').map(skill => skill.trim()),
        });
        showMessage(response.data.message);
      } catch (error) {
        showError(error.response?.data?.error || 'Error registering job seeker');
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
        const response = await axios.post('http://localhost:5000/register-employer', formData);
        showMessage(response.data.message);
      } catch (error) {
        showError(error.response?.data?.error || 'Error registering employer');
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
        const response = await axios.post('http://localhost:5000/post-job', {
          ...formData,
          requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()),
          salary: parseInt(formData.salary),
        });
        showMessage(response.data.message);
      } catch (error) {
        showError(error.response?.data?.error || 'Error posting job');
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
        const response = await axios.post('http://localhost:5000/apply-job', {
          ...formData,
          jobId: parseInt(formData.jobId),
        });
        showMessage(response.data.message);
      } catch (error) {
        showError(error.response?.data?.error || 'Error applying for job');
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
        const response = await axios.get(`http://localhost:5000/job-applications/${jobId}`);
        setApplications(response.data.applications);
        showMessage('Applications fetched successfully');
      } catch (error) {
        showError(error.response?.data?.error || 'Error fetching applications');
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
        const response = await axios.get('http://localhost:5000/my-applications');
        setJobIds(response.data.jobIds);
        showMessage('Applications fetched successfully');
      } catch (error) {
        showError(error.response?.data?.error || 'Error fetching my applications');
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
        const response = await axios.put('http://localhost:5000/update-job-seeker', {
          ...formData,
          skills: formData.skills.split(',').map(skill => skill.trim()),
        });
        showMessage(response.data.message);
      } catch (error) {
        showError(error.response?.data?.error || 'Error updating job seeker profile');
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
        const response = await axios.put('http://localhost:5000/update-employer', formData);
        showMessage(response.data.message);
      } catch (error) {
        showError(error.response?.data?.error || 'Error updating employer profile');
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

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-gray-50 to-gray-200">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800 tracking-tight">
        Job Marketplace
      </h1>
      
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