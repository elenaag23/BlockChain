// utils/getWeb3.js
import Web3 from 'web3';

const getWeb3 = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    return web3;
  } else if (window.web3) {
    return new Web3(window.web3.currentProvider);
  } else {
    throw new Error('No web3 instance detected. Please install MetaMask extension.');
  }
};

export default getWeb3;
