import React, { useState, useEffect } from "react";
import { getEthereumContract } from "../utils/web3";


const DoctorRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    email: "",
    username: "",
    doctorId: "",
    licenseNumber: "",
    yearsOfExperience: "",
    clinicName: "",
    contactNumber: "",
    addressDetails: "",
  });

  const [message, setMessage] = useState(""); // State to store success/error messages
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const contract = await getEthereumContract();
      if (!contract) return alert("Smart contract not found");
  
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const doctorAddress = accounts[0];

      console.log(doctorAddress);
  
      // Attempt to register the doctor
      const tx = await contract.registerDoctor(
        doctorAddress,
        formData.name,
        formData.specialization,
        formData.email,
        formData.username,
        formData.doctorId,
        formData.licenseNumber,
        parseInt(formData.yearsOfExperience),
        formData.clinicName,
        formData.contactNumber,
        formData.addressDetails
      );
  
      // Wait for the transaction to be mined and get the receipt
      const receipt = await tx.wait();

      // Check if the transaction was successful and emitted the event
      if (receipt.status === 1) {
        alert("Doctor registered successfully!");
      } else {
        alert("Transaction failed!");
      }
    } catch (error) {
      console.error(error);

      // Check for specific revert error messages from the smart contract
      if (error.message.includes("Doctor already registered")) {
        alert("The doctor is already registered.");
      } else if (error.message.includes("Username already taken")) {
        alert("The username is already taken. Please choose a different one.");
      } else if (error.message.includes("Doctor ID already exists")) {
        alert("The Doctor ID is already registered. Please use a unique Doctor ID.");
      } else {
        // Default error message for other errors
        alert("Error registering doctor: " + error.message);
      }
    }
  };*/

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const contract = await getEthereumContract();
      if (!contract) return alert("Smart contract not found");
  
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const doctorAddress = accounts[0];
  
      console.log(doctorAddress);
  
      // Register doctor in the smart contract
      const tx = await contract.registerDoctor(
        doctorAddress,
        formData.name,
        formData.specialization,
        formData.email,
        formData.username,
        formData.doctorId,
        formData.licenseNumber,
        parseInt(formData.yearsOfExperience),
        formData.clinicName,
        formData.contactNumber,
        formData.addressDetails
      );
  
      await tx.wait();
  
      // Send doctor details to backend for MySQL insertion
      const response = await fetch("http://localhost:8081/register-doctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorAddress,
          ...formData
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert("Doctor registered successfully!");
      } else {
        alert("Error registering doctor in database: " + data.message);
      }
  
    } catch (error) {
      console.error(error);
      alert("Error registering doctor: " + error.message);
    }
  };*/
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const contract = await getEthereumContract();
        if (!contract) return alert("Smart contract not found");

        // Force user to switch accounts
        await window.ethereum.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] });

        // Fetch active account
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const doctorAddress = accounts[0];

        console.log("Using account:", doctorAddress);

        const response = await fetch("http://localhost:8081/register-doctor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ doctorAddress, ...formData }),
        });

        const data = await response.json();

        if (response.ok) {
            setMessage("Doctor registered successfully!");
            setMessageType("success");
        } else {
            setMessage(data.message || "Failed to register doctor");
            setMessageType("error");
        }

    } catch (error) {
        console.error("Error registering doctor:", error);
        setMessage("Error registering doctor. Please try again.");
        setMessageType("error");
    }
};

  
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: "url('/images/1.jfif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", fontSize: "24px", marginBottom: "20px", color: "rgb(54 181 244)" }}>
          Doctor Registration
        </h2>
        {message && (
          <div style={{ 
            color: messageType === "success" ? "green" : "red", 
            fontWeight: "bold", 
            marginBottom: "10px" 
          }}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          />
          <input
            type="text"
            name="specialization"
            placeholder="Specialization"
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          />
          <input
            type="text"
            name="doctorId"
            placeholder="Doctor ID"
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          />
          <input
            type="text"
            name="licenseNumber"
            placeholder="License Number"
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          />
          <input
            type="number"
            name="yearsOfExperience"
            placeholder="Years of Experience"
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          />
          <input
            type="text"
            name="clinicName"
            placeholder="Clinic Name"
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          />
          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          />
          <input
            type="text"
            name="addressDetails"
            placeholder="Address"
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px",
              borderRadius: "4px",
              backgroundColor: "rgb(64 174 213)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "rgb(64 174 213)"}
            onMouseOut={(e) => e.target.style.backgroundColor = "rgb(64 174 213)"}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegistration;
