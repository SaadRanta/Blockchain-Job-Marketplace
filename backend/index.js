// backend/index.js

const express = require('express');
const cors = require('cors');
const Web3 = require('web3');
const dotenv = require('dotenv');
const contractABI = require('./JobMarketplaceABI.json');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const web3 = new Web3(process.env.PROVIDER_URL);
const contract = new web3.eth.Contract(contractABI.abi, process.env.CONTRACT_ADDRESS);

let defaultAccount;
web3.eth.getAccounts().then(accounts => {
  defaultAccount = accounts[0];
  web3.eth.defaultAccount = defaultAccount;
  console.log("Default account:", defaultAccount);
});

// Register Employer
app.post('/register-employer', async (req, res) => {
  try {
    const { companyName, industry, contactInfo, description } = req.body;
    const receipt = await contract.methods
      .registerEmployer(companyName, industry, contactInfo, description)
      .send({ from: defaultAccount });
    res.status(200).json({ message: 'Employer registered', receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register Job Seeker
app.post('/register-job-seeker', async (req, res) => {
  try {
    const { name, contactInfo, resumeHash, skills } = req.body;
    const receipt = await contract.methods
      .registerJobSeeker(name, contactInfo, resumeHash, skills)
      .send({ from: defaultAccount });
    res.status(200).json({ message: 'Job seeker registered', receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post Job
app.post('/post-job', async (req, res) => {
  try {
    const { title, description, requiredSkills, location, salary } = req.body;
    const receipt = await contract.methods
      .postJob(title, description, requiredSkills, location, salary)
      .send({ from: defaultAccount });
    res.status(200).json({ message: 'Job posted!', receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply for Job
app.post('/apply-job', async (req, res) => {
  try {
    const { jobId, coverLetterHash } = req.body;
    const receipt = await contract.methods
      .applyForJob(jobId, coverLetterHash)
      .send({ from: defaultAccount });
    res.status(200).json({ message: 'Applied successfully', receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Job Applications for a Job
app.get('/job-applications/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const applications = await contract.methods.getJobApplications(jobId).call({ from: defaultAccount });
    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get My Applications (as job seeker)
app.get('/my-applications', async (req, res) => {
  try {
    const jobIds = await contract.methods.getMyApplications().call({ from: defaultAccount });
    res.status(200).json({ jobIds });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Job Seeker Profile
app.put('/update-job-seeker', async (req, res) => {
  try {
    const { name, contactInfo, resumeHash, skills } = req.body;
    const receipt = await contract.methods
      .updateJobSeekerProfile(name, contactInfo, resumeHash, skills)
      .send({ from: defaultAccount });
    res.status(200).json({ message: 'Job seeker profile updated', receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Employer Profile
app.put('/update-employer', async (req, res) => {
  try {
    const { companyName, industry, contactInfo, description } = req.body;
    const receipt = await contract.methods
      .updateEmployerProfile(companyName, industry, contactInfo, description)
      .send({ from: defaultAccount });
    res.status(200).json({ message: 'Employer profile updated', receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
