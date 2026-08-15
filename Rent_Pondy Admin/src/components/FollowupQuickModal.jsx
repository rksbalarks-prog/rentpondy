import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

/*
 * <FollowupQuickModal />
 * ----------------------
 * In-place "create follow-up" modal used by the Login (OTP) Report. The row's
 * Remark Status decides which bucket the follow-up is filed into:
 *
 *   remark 'seller'      (Owner)       → POST /followup-create           → All Property Followups Data
 *   remark 'buyer'       (Tenant)      → POST /followup-create-buyer      → All Tenant Followups Data
 *   remark 'noresponse'  (No response) → POST /noresponse-followup-create → No Response Followups Data
 *   remark 'visitor'     (Visitor)     → POST /visitor-followup-create    → Visitor Followups Data
 *
 * Owner/Tenant reuse the existing collections (so they appear in the existing
 * pages); No-Response and Visitor each use their own collection / page.
 * Tenant rows have no Ra_Id here, so 'N/A' is sent (matching the manual
 * "Open RA Follow-Up" create modal).
 */

const REMARK_CONFIG = {
  seller: {
    label: 'Property (Owner)',
    badge: 'bg-primary',
    endpoint: '/followup-create',
    extra: {},
  },
  buyer: {
    label: 'Tenant',
    badge: 'bg-info',
    endpoint: '/followup-create-buyer',
    extra: { Ra_Id: 'N/A' },
  },
  noresponse: {
    label: 'No Response',
    badge: 'bg-dark',
    endpoint: '/noresponse-followup-create',
    extra: {},
  },
  visitor: {
    label: 'Visitor',
    badge: 'bg-warning text-dark',
    endpoint: '/visitor-followup-create',
    extra: {},
  },
};

const STATUS_OPTIONS = ['Ring', 'Ready To Pay', 'Not Decided', 'No Response', 'Not Interested-Closed', 'Paid Closed'];
const TYPE_OPTIONS = ['Payment Followup', 'Data Followup', 'Enquiry Followup', 'No Response', 'Payment Closed'];

const FollowupQuickModal = ({ phone, remark, adminName, onClose, onCreated }) => {
  const config = REMARK_CONFIG[remark];
  const [form, setForm] = useState({
    followupStatus: '',
    followupType: '',
    followupDate: '',
    remarks: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Unknown remark (blank) should never open this modal, but guard anyway.
  if (!config) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'remarks' && value.length > 50) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!form.followupStatus || !form.followupType || !form.followupDate) {
      alert('⚠️ Please fill Status, Type and Date.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        phoneNumber: phone,
        followupStatus: form.followupStatus,
        followupType: form.followupType,
        followupDate: form.followupDate,
        remarks: form.remarks,
        adminName,
        ...config.extra,
      };
      const res = await axios.post(`${process.env.REACT_APP_API_URL}${config.endpoint}`, payload);

      if (res.status === 201 || res.data?.success) {
        if (res.data?.duplicate) {
          alert('ℹ️ Duplicate submission ignored.');
        } else {
          alert(`✅ ${config.label} follow-up created for ${phone}!`);
        }
        // Refresh the red/green PhoneCell indicators across the dashboard.
        window.dispatchEvent(new Event('followups-updated'));
        if (onCreated) onCreated();
        onClose();
      } else {
        throw new Error(res.data?.message || 'Unexpected response');
      }
    } catch (err) {
      alert('❌ Failed to create follow-up!\n' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: '1.1rem' }}>
          Create Follow-up&nbsp;
          <span className={`badge ${config.badge}`}>{config.label}</span>
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="mb-3">
            <label className="fw-bold mb-1">Phone Number:</label>
            <input type="text" value={phone || 'N/A'} disabled
              className="form-control" style={{ backgroundColor: '#f5f5f5' }} />
          </div>

          <div className="mb-3">
            <label className="fw-bold mb-1">Follow-up Status: <span className="text-danger">*</span></label>
            <select name="followupStatus" value={form.followupStatus} onChange={handleChange}
              className="form-select" required>
              <option value="">Select Status</option>
              {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="mb-3">
            <label className="fw-bold mb-1">Follow-up Type: <span className="text-danger">*</span></label>
            <select name="followupType" value={form.followupType} onChange={handleChange}
              className="form-select" required>
              <option value="">Select Type</option>
              {TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="mb-3">
            <label className="fw-bold mb-1">Follow-up Date: <span className="text-danger">*</span></label>
            <input type="date" name="followupDate" value={form.followupDate} onChange={handleChange}
              className="form-control" required />
          </div>

          <div className="mb-3">
            <label className="fw-bold mb-1 d-flex justify-content-between align-items-center">
              <span>Remarks:</span>
              <span style={{ fontSize: 12, fontWeight: 'normal', color: form.remarks.length >= 50 ? '#dc3545' : '#6c757d' }}>
                {form.remarks.length}/50
              </span>
            </label>
            <input type="text" name="remarks" value={form.remarks} onChange={handleChange}
              maxLength={50} placeholder="Enter remarks (max 50 characters)" className="form-control" />
          </div>

          <div className="mb-1">
            <label className="fw-bold mb-1">Created By:</label>
            <input type="text" value={adminName || ''} disabled
              className="form-control" style={{ backgroundColor: '#f5f5f5' }} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create Follow-up'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default FollowupQuickModal;
