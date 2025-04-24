const Web3 = require('web3');
const contractABI = [ /* ABI from your compiled contract */ ];
const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your deployed contract address

const web3 = new Web3(Web3.givenProvider || "http://localhost:7545"); // Ganache default port
const patientManagementContract = new web3.eth.Contract(contractABI, contractAddress);

document.getElementById('registrationForm').onsubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const addressDetails = document.getElementById('addressDetails').value;
    const contactNumber = document.getElementById('contactNumber').value;
    const email = document.getElementById('email').value;
    const zipCode = document.getElementBy