import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddAvailability.css";

function ViewAvailability() {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("viewAvailability");

  const [date, setDate] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");

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

  const handleSubmit = async () => {
    if (!date) {
      alert("Please select a date.");
      return;
    }

    try {
      setLoading(true);
      const formattedDate = date.toISOString().split("T")[0];
      const doctorAddress = localStorage.getItem("doctorAddress");
      const docId = localStorage.getItem("docId");

      const response = await fetch("http://localhost:8081/view-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docId: docId,
          doctorAddress: doctorAddress,
          availabilityDate: formattedDate
        }),
      });

      const result = await response.json();
      console.log("API response:", result);
      
      // Improved handling to filter out 'true' values and extract only time slots
      let processedSlots = [];
      
      if (Array.isArray(result)) {
        // Filter out boolean values and include only string/object time slots
        processedSlots = result.filter(item => typeof item !== 'boolean');
      } else if (result.timeSlots && Array.isArray(result.timeSlots)) {
        processedSlots = result.timeSlots.filter(item => typeof item !== 'boolean');
      } else if (typeof result === 'object') {
        if (result.data && Array.isArray(result.data)) {
          processedSlots = result.data.filter(item => typeof item !== 'boolean');
        } else {
          // Process each property in the object
          for (const key in result) {
            if (Object.hasOwnProperty.call(result, key) && key !== 'message') {
              if (Array.isArray(result[key])) {
                const validSlots = result[key].filter(item => typeof item !== 'boolean');
                processedSlots.push(...validSlots);
              } else if (typeof result[key] !== 'boolean') {
                processedSlots.push(result[key]);
              }
            }
          }
        }
      }
      
      setAvailability(processedSlots);
    } catch (error) {
      console.error("Error fetching availability:", error);
      alert("Failed to fetch availability.");
      setAvailability([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle sort order
  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    
    // Sort the availability array based on time slots
    const sortedAvailability = [...availability].sort((a, b) => {
      const timeA = typeof a === 'object' && a.time_slot ? a.time_slot : String(a);
      const timeB = typeof b === 'object' && b.time_slot ? b.time_slot : String(b);
      
      return newOrder === "asc" 
        ? timeA.localeCompare(timeB)
        : timeB.localeCompare(timeA);
    });
    
    setAvailability(sortedAvailability);
  };

  // Format the date for display
  const formatDisplayDate = (date) => {
    if (!date) return "";
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Function to determine if a value is a valid time slot
  const isValidTimeSlot = (slot) => {
    if (typeof slot === 'boolean') return false;
    if (typeof slot === 'object' && slot.time_slot) return true;
    if (typeof slot === 'string' && slot.includes(':')) return true;
    return false;
  };
  

  const handleDelete = async (slotToDelete) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the slot ?`);
    if (!confirmDelete) return;
  
    try {
      const doctorAddress = localStorage.getItem("doctorAddress");
      const docId = localStorage.getItem("docId");
      const formattedDate = date.toISOString().split("T")[0];

      console.log('ID ',slotToDelete);

      console.log(doctorAddress);
      console.log(docId);
      console.log(formattedDate);
  
      const response = await fetch("http://localhost:8081/delete-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slotToDelete,
          docId,
          doctorAddress,
          availabilityDate: formattedDate,
          timeSlot: slotToDelete,
        }),
      });
  
      const result = await response.json();
      if (result.success || result.message?.toLowerCase().includes("deleted")) {
        // Update UI
        setAvailability((prev) =>
          prev.filter((slot) => {
            const timeSlot = typeof slot === "object" && slot.time_slot ? slot.time_slot : String(slot);
            return timeSlot !== slotToDelete;
          })
        );
        alert("Time slot deleted successfully.");
        handleSubmit();
      } else {
        alert(result.message || "Failed to delete time slot.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the time slot.");
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
          <h2>View Your Availability</h2>

          <div className="form-inline-group">
            <div className="inline-item">
              <label>Select Date:</label>
              <DatePicker
                selected={date}
                onChange={(d) => setDate(d)}
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
                className="datepicker"
              />
            </div>

            <div className="inline-item button-align">
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Loading..." : "View Availability"}
              </button>
            </div>
          </div>
          
          {availability && availability.length > 0 ? (
            <div className="data-table-container">
              <div className="table-header">
                <h3>Available Time Slots for {formatDisplayDate(date)}</h3>
                <div className="table-actions">
                  <span className="results-count">
                    {availability.length} {availability.length === 1 ? 'slot' : 'slots'} found
                  </span>
                  <button 
                    className="sort-button" 
                    onClick={toggleSortOrder}
                    title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </button>
                </div>
              </div>
              
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="column-id">#</th>
                      <th className="column-time">Time Slot</th>
                      <th className="column-status">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availability.map((slot, index) => {
                      const timeSlot = typeof slot === 'object' && slot.time_slot 
                        ? slot.time_slot 
                        : String(slot);
                        
                      return (
                        <tr key={index} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                          <td className="column-id">{index + 1}</td>
                          <td className="column-time">{timeSlot}</td>
                          <td className="column-status">
                          <button
                              className="action-button delete"
                              onClick={() => handleDelete(slot.id)}
                          >
                              Delete
                          </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            !loading && date && (
              <div className="no-results">
                <div className="no-results-icon">📅</div>
                <p>No availability found for {formatDisplayDate(date)}.</p>
                <p className="no-results-hint">Try selecting a different date or adding time slots.</p>
              </div>
            )
          )}
          
          {loading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Loading time slots...</p>
            </div>
          )}
        </div>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Signout
      </button>
      
      <style jsx>{`
        .data-table-container {
          margin-top: 25px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #f8f9fa;
          padding: 15px 20px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .table-header h3 {
          margin: 0;
          color: #333;
          font-size: 16px;
        }
        
        .table-actions {
          display: flex;
          align-items: center;
        }
        
        .results-count {
          margin-right: 15px;
          color: #6c757d;
          font-size: 14px;
        }
        
        .sort-button {
          background: none;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          padding: 5px 10px;
          cursor: pointer;
          color: #495057;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        
        .sort-button:hover {
          background-color: #e9ecef;
        }
        
        .table-wrapper {
          overflow-x: auto;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .data-table th, .data-table td {
          padding: 12px 20px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }
        
        .data-table th {
          background-color: #f8f9fa;
          color: #495057;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
        }
        
        .column-id {
          width: 60px;
          text-align: center;
        }
        
        .column-time {
          width: 60%;
        }
        
        .column-status {
          width: 150px;
          text-align: center;
        }
        
        .row-even {
          background-color: #fff;
        }
        
        .row-odd {
          background-color: #f8f9fa;
        }
        
        .data-table tr:hover {
          background-color: #f1f3f5;
        }
        
        .action-button {
          padding: 5px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        
        .action-button.delete {
          background-color: #ffe3e3;
          color: #e03131;
        }
        
        .action-button.delete:hover {
          background-color: #ffc9c9;
        }
        
        .no-results {
          text-align: center;
          padding: 40px 20px;
          color: #6c757d;
        }
        
        .no-results-icon {
          font-size: 32px;
          margin-bottom: 15px;
        }
        
        .no-results p {
          margin: 5px 0;
        }
        
        .no-results-hint {
          font-size: 14px;
          color: #adb5bd;
          margin-top: 10px;
        }
        
        .loading-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 0;
        }
        
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: #09f;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ViewAvailability;