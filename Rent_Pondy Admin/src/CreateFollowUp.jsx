import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import useAdminNames from "./hooks/useAdminNames";

function CreateFollowUp() {
  const [formData, setFormData] = useState({
    followupStatus: "",
    followupType: "",
    followupDate: "",
    remarks: "",
  });

  const [existingFollowUp, setExistingFollowUp] = useState(null);
  const [loadingCheck, setLoadingCheck] = useState(true);

  // Live staff list from `Create Staff – List` (GET /admin-all).
  const { names: predefinedAdminNames, loading: adminNamesLoading } = useAdminNames();
  const [showCreateAdminDropdown, setShowCreateAdminDropdown] = useState(false);
  const [selectedAdminNames, setSelectedAdminNames] = useState([]);
  const [customAdminName, setCustomAdminName] = useState('');

  const location = useLocation();
  const { rentId, phoneNumber, bulkMode, items: bulkItems, bulkCount } = location.state || {};

  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");

  const fileName = "CreateFollowUp";

  useEffect(() => {
    if (reduxAdminName) localStorage.setItem("adminName", reduxAdminName);
    if (reduxAdminRole) localStorage.setItem("adminRole", reduxAdminRole);
  }, [reduxAdminName, reduxAdminRole]);

  useEffect(() => {
    const checkFollowUpExists = async () => {
      try {
        if (!rentId) { setLoadingCheck(false); return; }
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/followup-list`);
        const followUps = response.data.data || [];
        const existing = followUps.find(fu => fu.rentId === rentId);
        if (existing) setExistingFollowUp(existing);
      } catch (err) {
        console.error("Error checking existing follow-up:", err);
      } finally {
        setLoadingCheck(false);
      }
    };
    checkFollowUpExists();
  }, [rentId]);

  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-view`, {
          userName: adminName,
          role: adminRole,
          viewedFile: fileName,
          viewTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
      } catch (err) {
        console.error("Error recording dashboard view:", err);
      }
    };
    if (adminName && adminRole) recordDashboardView();
  }, [adminName, adminRole]);

  useEffect(() => {
    if (adminName) {
      setFormData((prev) => ({ ...prev, adminName }));
    }
  }, [adminName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Enforce 50-char cap on remarks
    if (name === "remarks" && value.length > 50) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAdminNameChange = (name) => {
    setSelectedAdminNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const getFinalCreateAdminNames = () => {
    const finalNames = [...selectedAdminNames];
    if (customAdminName.trim()) finalNames.push(customAdminName.trim());
    return finalNames.length > 0 ? finalNames : [adminName];
  };

  const handleAddCustomCreateAdminName = () => {
    if (customAdminName.trim() && !selectedAdminNames.includes(customAdminName.trim())) {
      setSelectedAdminNames((prev) => [...prev, customAdminName.trim()]);
      setCustomAdminName('');
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ── Bulk mode: apply this follow-up once to every supplied property ──
    if (bulkMode) {
      const itemsToSend = Array.isArray(bulkItems) ? bulkItems : [];
      if (itemsToSend.length === 0) {
        alert('No properties to follow up on.');
        return;
      }
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/followup-bulk-create`,
          {
            items: itemsToSend,
            followupStatus: formData.followupStatus,
            followupType: formData.followupType,
            followupDate: formData.followupDate,
            remarks: formData.remarks,
            adminName,
          }
        );
        const { createdCount = 0, skippedCount = 0 } = res.data || {};
        alert(`✅ Bulk follow-up complete.\nCreated: ${createdCount}\nSkipped (already had a follow-up): ${skippedCount}`);
        window.dispatchEvent(new Event('followups-updated'));
        setTimeout(() => navigate(-1), 1500);
      } catch (err) {
        const errorMessage = err.response?.data?.errorDetails || err.response?.data?.message || err.message;
        alert('❌ Failed to create bulk follow-ups!\n' + errorMessage);
        console.error('Bulk follow-up error:', err);
      }
      return;
    }

    // One-follow-up-per-property only applies when we actually have a rentId.
    // Phone-only follow-ups (e.g. opened from a login report) carry no rentId;
    // matching `fu.rentId === undefined` would falsely flag every such phone as
    // a duplicate, so we skip the check entirely in that case.
    if (rentId) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/followup-list`);
        const followUps = response.data.data || [];
        const existing = followUps.find(fu => fu.rentId === rentId);
        if (existing) {
          alert(`❌ Follow-up already exists!\n\nCreated by: ${existing.adminName}\nDate: ${new Date(existing.createdAt).toLocaleString()}`);
          navigate(-1);
          return;
        }
      } catch (err) {
        console.error("Error re-checking follow-up:", err);
        alert("Error verifying follow-up status. Please try again.");
        return;
      }
    }

    try {
      // Always record the currently logged-in admin as the follow-up creator.
      // The manual admin-select UI was removed; admin name is captured from
      // Redux/localStorage above.
      const payload = {
        rentId,
        phoneNumber,
        ...formData,
        adminName,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/followup-create`,
        payload
      );

      if (response.status === 201) {
        alert("✅ Follow-up created successfully!");
        // Notify FollowupContext so PhoneCell instances refresh red→green.
        window.dispatchEvent(new Event('followups-updated'));
        setTimeout(() => { navigate(-1); }, 3000);
      } else {
        throw new Error("Non-200 response");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.errorDetails || err.response?.data?.message || err.message;
      alert("❌ Failed to create follow-up!\n" + errorMessage);
      console.error("Error during follow-up creation:", err);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>{bulkMode ? 'Create Bulk Follow-up' : 'Create Follow-up'}</h2>

      {loadingCheck && (
        <div style={{ padding: '15px', marginBottom: '20px', backgroundColor: '#e7f3ff', border: '1px solid #b3d9ff', borderRadius: '4px', color: '#004085' }}>
          Loading follow-up information...
        </div>
      )}

      {existingFollowUp && !loadingCheck && (
        <div style={{ padding: '15px', marginBottom: '20px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '4px', color: '#155724' }}>
          <h5 style={{ marginTop: 0 }}>✅ Follow-up Already Exists</h5>
          <p style={{ marginBottom: '5px' }}><strong>Created by:</strong> {existingFollowUp.adminName}</p>
          <p style={{ marginBottom: '5px' }}><strong>Date:</strong> {new Date(existingFollowUp.createdAt).toLocaleString()}</p>
          <p style={{ marginBottom: 0, fontSize: '0.9em', color: '#1a4620' }}>Only one follow-up per property is allowed.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ opacity: existingFollowUp ? 0.5 : 1, pointerEvents: existingFollowUp ? 'none' : 'auto' }}>

        {bulkMode ? (
          /* Bulk mode — show how many properties this follow-up will apply to */
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: 'bold' }}>Bulk Upload Count:</label>
            <input
              type="text"
              value={`${bulkCount ?? (bulkItems ? bulkItems.length : 0)} bulk-uploaded propert${(bulkCount ?? (bulkItems ? bulkItems.length : 0)) === 1 ? 'y' : 'ies'}`}
              disabled
              style={{ padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff8e1', fontWeight: 'bold' }} />
            <small style={{ color: '#6c757d' }}>
              This follow-up is created once for each of these properties (any that already have one are skipped).
            </small>
          </div>
        ) : (
          <>
            {/* Rent ID */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold' }}>Rent ID:</label>
              <input type="text" value={rentId || "N/A"} disabled
                style={{ padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>

            {/* Phone Number */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold' }}>Phone Number:</label>
              <input type="text" value={phoneNumber || "N/A"} disabled
                style={{ padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
          </>
        )}

        {/* Follow-up Status */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Follow-up Status:</label>
          <select name="followupStatus" onChange={handleInputChange} disabled={!!existingFollowUp}
            style={{ padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }} required>
            <option value="">Select Reason</option>
            <option value="Ring">Ring</option>
            <option value="Ready To Pay">Ready To Pay</option>
            <option value="Not Decided">Not Decided</option>
            <option value="No Response">No Response</option>
            <option value="Not Interested-Closed">Not Interested-Closed</option>
            <option value="Paid Closed">Paid Closed</option>
          </select>
        </div>

        {/* Follow-up Type */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Follow-up Type:</label>
          <select name="followupType" onChange={handleInputChange} disabled={!!existingFollowUp}
            style={{ padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }} required>
            <option value="">Select</option>
            <option value="Payment Followup">Payment Followup</option>
            <option value="Data Followup">Data Followup</option>
            <option value="Enquiry Followup">Enquiry Followup</option>
            <option value="No Response">No Response</option>
            <option value="Payment Closed">Payment Closed</option>
          </select>
        </div>

        {/* Follow-up Date */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Follow-up Date:</label>
          <input type="date" name="followupDate" onChange={handleInputChange} disabled={!!existingFollowUp}
            style={{ padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }} required />
        </div>

        {/* ── Remarks ── */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Remarks:</span>
            <span style={{
              fontSize: '12px',
              color: formData.remarks.length >= 50 ? '#dc3545' : formData.remarks.length >= 40 ? '#fd7e14' : '#6c757d',
              fontWeight: 'normal'
            }}>
              {formData.remarks.length}/50
            </span>
          </label>
          <input
            type="text"
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            disabled={!!existingFollowUp}
            placeholder="Enter remarks (max 50 characters)"
            maxLength={50}
            style={{
              padding: '8px',
              width: '100%',
              border: `1px solid ${formData.remarks.length >= 50 ? '#dc3545' : '#ccc'}`,
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
          {formData.remarks.length >= 50 && (
            <small style={{ color: '#dc3545', marginTop: '3px', display: 'block' }}>
              Maximum 50 characters reached.
            </small>
          )}
        </div>

        {/* Show the logged-in admin who will be recorded as the follow-up creator. */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Created By:</label>
          <input
            type="text"
            value={adminName || ''}
            disabled
            style={{ padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f5f5f5' }}
          />
        </div>

        {/*
          Admin Names Checkbox Module — disabled. The follow-up now auto-captures
          the logged-in admin name (see payload in handleSubmit). Kept here as
          commented JSX in case manual multi-admin selection needs to be restored.

        <div style={{ marginBottom: '15px', border: '1px solid #e0e0e0', padding: '12px', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>👤 Select Admin Name(s):</label>

          <div style={{ marginBottom: '10px' }}>
            <button type="button" onClick={() => setShowCreateAdminDropdown(!showCreateAdminDropdown)}
              style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', textAlign: 'left' }}
              disabled={!!existingFollowUp}>
              {showCreateAdminDropdown ? '▼ Hide Admin List' : '▶ Show Admin List'}
            </button>
          </div>

          {showCreateAdminDropdown && !existingFollowUp && (
            <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto' }}>
              {adminNamesLoading && predefinedAdminNames.length === 0 ? (
                <div style={{ color: '#6c757d', fontSize: '13px' }}>Loading staff list…</div>
              ) : predefinedAdminNames.length === 0 ? (
                <div style={{ color: '#6c757d', fontSize: '13px' }}>No staff found. Add a custom name below.</div>
              ) : (
                predefinedAdminNames.map((name) => (
                  <div key={name} style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" checked={selectedAdminNames.includes(name)} onChange={() => handleCreateAdminNameChange(name)}
                        style={{ marginRight: '8px', cursor: 'pointer', width: '18px', height: '18px' }} />
                      <span>{name}</span>
                    </label>
                  </div>
                ))
              )}
            </div>
          )}

          {!existingFollowUp && (
            <div style={{ marginBottom: '10px', display: 'flex', gap: '8px' }}>
              <input type="text" value={customAdminName} onChange={(e) => setCustomAdminName(e.target.value)}
                placeholder="Enter custom admin name"
                style={{ padding: '8px', flex: 1, border: '1px solid #ccc', borderRadius: '4px' }} />
              <button type="button" onClick={handleAddCustomCreateAdminName}
                style={{ padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Add
              </button>
            </div>
          )}

          {selectedAdminNames.length > 0 && (
            <div style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#e7f3ff', border: '1px solid #b3d9ff', borderRadius: '4px' }}>
              <strong style={{ fontSize: '0.9em' }}>✓ Selected:</strong>
              <div style={{ fontSize: '0.9em', marginTop: '5px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {selectedAdminNames.map((name) => (
                  <span key={name} style={{ display: 'inline-block', backgroundColor: '#007bff', color: 'white', padding: '4px 8px', borderRadius: '4px' }}>
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        */}

        <button type="submit" disabled={existingFollowUp || loadingCheck}
          style={{ padding: '10px 20px', backgroundColor: existingFollowUp ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: existingFollowUp ? 'not-allowed' : 'pointer', fontSize: '16px' }}>
          {loadingCheck ? 'Checking...' : (bulkMode ? 'Create Bulk Follow-ups' : 'Create Follow-up')}
        </button>
      </form>
    </div>
  );
}

export default CreateFollowUp;