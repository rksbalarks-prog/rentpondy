




import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Admin from "./Admin";
import Dashboard from "./Dashboard";
import EditProperty from "./EditProperty";
import GetForm from "./DataAddAdmin/GetForm";
import AdminSetForm from "./DataAddAdmin/AdminSetForm";
import Plan from "./Plan";
import Detail from "./Detail";
import GetBuyerAssistance from "./GetBuyerAssistance";
import PropertyAssistance from "./PropertyAssistance";
import PMLogin from "./PMLogin";
import PMDashboard from "./PMDashboard";
import PMBulkdashboard from "./PMBulkdashboard";
import AddPropertyFormMarketing from "./AddPropertyFormMarketing";
import KFM from "./KFM";
// Standalone (no-auth) copy of Rent Staff Report — separate file so the
// protected /dashboard/rent-staff-report version stays untouched.
import RentStaffReportStandalone from "./RentStaffReportStandalone";
import RpWfhCallManagement from "./RpWfhCallManagement";
import RpWfhAdmin from "./RpWfhAdmin";
// Standalone (no-auth) public "Add New Stay" form
import AddStayPublic from "./AddStayPublic";
// Microsoft Clarity route tracker (renders nothing; no-op without an ID).
import ClarityTracker from "./ClarityTracker";
 
import { useDispatch } from 'react-redux';
import { setName } from './redux/adminSlice';
import { setRole } from './redux/adminSlice';

// Protected Route - Check if user is authenticated and has completed OTP
const ProtectedDashboard = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const adminName = localStorage.getItem('adminName');
  const adminRole = localStorage.getItem('adminRole');
  const otpVerified = localStorage.getItem('otpVerified');
  
  // Check all required authentication conditions
  if (!isAuthenticated || isAuthenticated !== 'true' || 
      !adminName || !adminRole || 
      !otpVerified || otpVerified !== 'true') {
    // Clear any partial authentication data
    localStorage.clear();
    return <Navigate to="/admin" replace />;
  }
  
  return <Dashboard />;
};

// Protected Route - Check if PM is authenticated (no OTP required)
const ProtectedPM = () => {
  const pmAuthenticated = localStorage.getItem('pmAuthenticated');
  
  if (!pmAuthenticated || pmAuthenticated !== 'true') {
    // Show login page
    return <PMLogin />;
  }
  
  // If authenticated, show the single message dashboard
  return <PMLogin />;
};

// Protected Route - Check if PM is authenticated for bulk messaging
const ProtectedPMBulk = () => {
  return <PMBulkdashboard />;
};

const App = () => {

  
  const dispatch = useDispatch();


  useEffect(() => {
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');

    if (name) {
      dispatch(setName(name));
    }
    if (role) {
      dispatch(setRole(role));
    }
  }, [dispatch]);

  // Stop the mouse wheel from silently changing <input type="number"> values.
  // When a focused number field is scrolled over, blur it so the page scrolls
  // normally and the typed value is left untouched. One global handler covers
  // every form (add/edit property, add/edit tenant, create/edit bill, …).
  useEffect(() => {
    const handleWheel = (e) => {
      const el = document.activeElement;
      if (el && el.tagName === 'INPUT' && el.type === 'number' && e.target === el) {
        el.blur();
      }
    };
    document.addEventListener('wheel', handleWheel, { passive: true });
    return () => document.removeEventListener('wheel', handleWheel);
  }, []);
  


  
  return (
   

    <Router basename="/process">
    <ClarityTracker />
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/kfm" element={<KFM />} />
      {/* Standalone no-auth Rent Staff Report — sits ABOVE the catch-all
          and is intentionally NOT under /dashboard/*, so ProtectedDashboard
          never sees it. The original protected version at
          /dashboard/rent-staff-report keeps working as before. */}
      <Route path="/rent-staff-report" element={<RentStaffReportStandalone />} />
      {/* Standalone no-auth public Add New Stay form — sits ABOVE the catch-all
          and is intentionally NOT under /dashboard/*, so ProtectedDashboard
          never sees it. Anyone can submit a stay (saved hidden for review). */}
      <Route path="/add-stay" element={<AddStayPublic />} />
      <Route path="/dashboard/pm" element={<ProtectedPM />} />
      <Route path="/dashboard/pm-bulk" element={<ProtectedPMBulk />} />
      <Route path="/dashboard/add-property-marketing" element={<AddPropertyFormMarketing />} />
      {/* Standalone Call Management (self-contained login, separate from admin auth). */}
      <Route path="/dashboard/rp.wfh" element={<RpWfhCallManagement />} />
      <Route path="/dashboard/rp.wfh-admin" element={<RpWfhAdmin />} />
      <Route path="/dashboard/*" element={<ProtectedDashboard />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
    </Router>
    
  );
};

export default App;



















