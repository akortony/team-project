import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './dashboard.css'; // Ensure you create this CSS file for styling

function Dashboard() {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    alert("Logged out successfully!");
    navigate("/"); // Redirect to Login
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    // You can add routing logic here to navigate to different pages
    if (menu === "addAvailability") {
      navigate("/add-availability"); // For adding availability
    } else if (menu === "viewAvailability") {
      navigate("/view-availability"); // For viewing availability
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
            className={selectedMenu === "availability" ? "active" : ""}
            onClick={() => handleMenuClick("availability")}
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
        {selectedMenu === "dashboard" && <h2>Welcome to Your Dashboard</h2>}
        {selectedMenu === "profile" && <h2>Profile Page</h2>}
        {selectedMenu === "addAvailability" && <h2>Add Your Availability</h2>}
        {selectedMenu === "viewAvailability" && <h2>View Your Availability</h2>}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Signout
      </button>
    </div>
  );
}

export default Dashboard;
