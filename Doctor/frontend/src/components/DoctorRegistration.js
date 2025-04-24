import React, { useState } from "react";
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

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const contract = await getEthereumContract();
      if (!contract) return alert("Smart contract not found");

      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const doctorAddress = accounts[0];

      const response = await fetch("http://localhost:8081/register-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorAddress, ...formData }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Received non-JSON response:", text);
        throw new Error("Server returned non-JSON response.");
      }

      if (response.ok) {
        setMessage("✅ Doctor registered successfully! Check your email for credentials.");
        setMessageType("success");
      } else {
        setMessage(data.message || "❌ Failed to register doctor.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error registering doctor:", error);
      setMessage("❌ Error registering doctor. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/1.jfif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          padding: "30px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "12px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2 style={{ textAlign: "center", fontSize: "28px", marginBottom: "20px", color: "#2196f3" }}>
          👨‍⚕️ Doctor Registration
        </h2>

        {message && (
          <div
            style={{
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "6px",
              color: messageType === "success" ? "#155724" : "#721c24",
              backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
              border: `1px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"}`,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
          {[
            { name: "name", placeholder: "Full Name" },
            { name: "specialization", placeholder: "Specialization" },
            { name: "email", placeholder: "Email", type: "email" },
            { name: "username", placeholder: "Username" },
            { name: "doctorId", placeholder: "Doctor ID" },
            { name: "licenseNumber", placeholder: "License Number" },
            { name: "yearsOfExperience", placeholder: "Years of Experience", type: "number" },
            { name: "clinicName", placeholder: "Clinic Name" },
            { name: "contactNumber", placeholder: "Contact Number" },
            { name: "addressDetails", placeholder: "Address" },
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              type={field.type || "text"}
              placeholder={field.placeholder}
              required
              onChange={handleChange}
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
                fontSize: "16px",
              }}
            />
          ))}

          <button
            type="submit"
            style={{
              padding: "14px",
              borderRadius: "6px",
              backgroundColor: "#2196f3",
              color: "#fff",
              border: "none",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1976d2")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2196f3")}
          >
            Register Doctor
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegistration;
