import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorRegistration from "./components/DoctorRegistration";
import Login from "./pages/Login"; // Import Login page
import Dashboard from "./pages/Dashboard"; // Import Dashboard page
import AddAvailability from './pages/AddAvailability';
import ViewAvailability from './pages/ViewAvailability';

function App() {
  return(
  <Router>
  <div>
    <Routes>
      <Route path="/" element={<Login />} /> {/* Default route to Login */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register-doctor" element={<DoctorRegistration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/add-availability" element={<AddAvailability />} />
      <Route path="/view-availability" element={<ViewAvailability />} />
    </Routes>
  </div>
</Router>
  );
}

export default App;
