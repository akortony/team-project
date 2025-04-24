import { ethers } from "ethers";

import healthcareSystemAbi from "../contracts/HealthcareSystem.json";

const contractABI = healthcareSystemAbi.abi;

// Replace with your deployed contract address
const contractAddress = "0xF22069074b4178b95e57d8A4172146813cC8eaa3";

export const getEthereumContract = async () => {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    //const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    return contract;
  } else {
    console.error("Ethereum wallet not found");
    return null;
  }
};
