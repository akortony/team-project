import { ethers } from "ethers";

// Contract ABI (Replace with your contract's ABI)
/*const contractABI = [
  {
    "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "doctorAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "username",
          "type": "string"
        }
      ],
    "name": "registerDoctor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];*/

import healthcareSystemAbi from "../contracts/HealthcareSystem.json";

const contractABI = healthcareSystemAbi.abi;

// Replace with your deployed contract address
const contractAddress = "0xA5766D3B3BCF76BF01432306800061a397EF09a0";

export const getEthereumContract = async () => {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    return contract;
  } else {
    console.error("Ethereum wallet not found");
    return null;
  }
};
