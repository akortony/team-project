import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { getEthereumContract } from "../utils/web3";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddAvailability.css";

function AddAvailability() {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("addAvailability");

  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    if (menu === "addAvailability") navigate("/add-availability");
    else if (menu === "viewAvailability") navigate("/view-availability");
    else if (menu === "profile") navigate("/profile");
    else if (menu === "dashboard") navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    navigate("/");
  };

  const handleAddTimeSlot = () => {
    if (time && !timeSlots.includes(time)) {
      setTimeSlots([...timeSlots, time]);
      setTime("");
    }
  };

  const handleRemoveTimeSlot = (slot) => {
    setTimeSlots(timeSlots.filter((t) => t !== slot));
  };

  const handleSubmit = async () => {
    
    if (!date || timeSlots.length === 0) {
      alert("Please select a date and add at least one time slot.");
      return;
    }

    try {

      /*setLoading(true);
      const contract = await getEthereumContract();
      const formattedDate = date.toISOString().split("T")[0];
      const tx = await contract.setAvailability(formattedDate, timeSlots);
      await tx.wait();

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const doctorAddress = accounts[0];*/

       /* const contract = await getEthereumContract();
        if (!contract) return alert("Smart contract not found");

        const formattedDate = date.toISOString().split("T")[0];
      
        await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }],
        });
      
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        
        const doctorAddress = accounts[0];*/
        const formattedDate = date.toISOString().split("T")[0];

        const doctorAddress = localStorage.getItem("doctorAddress");
        const docId = localStorage.getItem("docId");

        if (!doctorAddress) {
        alert("Doctor address not found. Please login again.");
        navigate("/");
        return;
        }

      await fetch("http://localhost:8081/add-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            docId: docId,
            doctorAddress: doctorAddress, // Or however you're storing it
            availabilityDate: formattedDate,
            timeSlots: timeSlots
        }),
      });

      alert("Availability set successfully!");
      setDate(null);
      setTime("");
      setTimeSlots([]);
    } catch (error) {
      console.error("Error setting availability:", error);
      alert("Failed to set availability.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="left-menu">
        <ul>
          <li
            className={selectedMenu === "dashboard" ? "active" : ""}
            onClick={() => handleMenuClick("dashboard")}
          >
            Dashboard
          </li>
          <li
            className={selectedMenu === "profile" ? "active" : ""}
            onClick={() => handleMenuClick("profile")}
          >
            Profile
          </li>
          <li
            className={
              selectedMenu === "addAvailability" ||
              selectedMenu === "viewAvailability"
                ? "active"
                : ""
            }
          >
            Availability
            <ul>
              <li
                className={selectedMenu === "addAvailability" ? "active" : ""}
                onClick={() => handleMenuClick("addAvailability")}
              >
                Add Availability
              </li>
              <li
                className={selectedMenu === "viewAvailability" ? "active" : ""}
                onClick={() => handleMenuClick("viewAvailability")}
              >
                View Availability
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="main-content">
        <div className="add-availability-form">
          <h2>Add Your Availability</h2>

          <div className="form-group">
            <label>Select Date:</label>
            <DatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
              className="datepicker"
            />
          </div>

          <div className="form-group">
            <label>Enter Time (e.g., 10:00 AM):</label>
            <div className="time-slot-input">
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g., 10:00 AM"
              />
              <button className="btn-secondary" onClick={handleAddTimeSlot}>
                Add
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Time Slots:</label>
            <div className="slots-list">
              {timeSlots.map((slot, index) => (
                <div className="slot-tag" key={index}>
                  {slot}
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveTimeSlot(slot)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Setting..." : "Set Availability"}
          </button>
        </div>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Signout
      </button>
    </div>
  );
}

export default AddAvailability;
