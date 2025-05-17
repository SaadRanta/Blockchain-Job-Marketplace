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

// Get accounts (development only — for real usage, you'd use MetaMask or similar)
let defaultAccount;
web3.eth.getAccounts().then(accounts => {
  defaultAccount = accounts[0];
  web3.eth.defaultAccount = defaultAccount;
  console.log("Default account:", defaultAccount);
});

// Test route
app.get('/', (req, res) => {
  res.send('Blockchain Job Marketplace Backend');
});

// Post a job
app.post('/post-job', async (req, res) => {
  try {
    const { title, description, requiredSkills, location, salary } = req.body;

    const receipt = await contract.methods
      .postJob(title, description, requiredSkills, location, salary)
      .send({ from: defaultAccount });

    res.status(200).json({ message: 'Job posted!', receipt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to post job' });
  }
});
app.post('/register-employer', async (req, res) => {
    try {
      const { companyName, industry, contactInfo, description } = req.body;
  
      const receipt = await contract.methods
        .registerEmployer(companyName, industry, contactInfo, description)
        .send({ from: defaultAccount });
  
      res.status(200).json({ message: 'Employer registered', receipt });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to register employer' });
    }
  });
  
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
