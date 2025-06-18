// utils/web3Utils.js

/**
 * Web3 utility functions for MetaMask integration
 */

export const checkMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

export const requestAccountAccess = async () => {
  if (!checkMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }
  
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    return accounts[0];
  } catch (error) {
    if (error.code === 4001) {
      throw new Error('Please connect to MetaMask');
    } else {
      throw new Error('Failed to connect to MetaMask');
    }
    }
}