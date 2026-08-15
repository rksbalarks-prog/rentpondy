import express from 'express';
import { sendSms } from '../services/smsGateway.js';
// Property model is CommonJS — default import gives the mongoose model.
import AddModel from '../AddModel.js';

const router = express.Router();

// ── Message template ─────────────────────────────────────────────────────────
// Edit this one function to change what the owner receives. Sent through YOUR
// SIM (self-hosted gateway), so it's plain free-form text — no DLT template.
function buildOwnerViewMessage({ rentId, viewerDigits }) {
  const idPart = rentId != null && rentId !== '' ? ` (ID ${rentId})` : '';
  return `RentPondy: A tenant viewed your property${idPart} and got your contact. Tenant number: ${viewerDigits}`;
}

// ── POST /PPC/notify-owner-contact-view ──────────────────────────────────────
// Fired by the User app when a tenant reveals an owner's contact. Sends the
// owner an SMS (via the SIM gateway) with the viewing tenant's number.
//
// Body: { rentId, viewerPhone, ownerPhone? }
//   - The owner number is looked up authoritatively from the property by rentId
//     (so we always SMS the owner's REAL number, never the masked/assigned one
//     that the tenant sees). `ownerPhone` from the body is only a fallback.
//
// Non-blocking by design: the User app calls this fire-and-forget, so any
// failure here never blocks the contact reveal.
router.post('/notify-owner-contact-view', async (req, res) => {
  try {
    const { rentId, viewerPhone, ownerPhone: ownerPhoneFromClient } = req.body || {};

    if (!viewerPhone) {
      return res.status(400).json({ success: false, message: 'viewerPhone is required' });
    }

    // Resolve the owner's real number. Prefer the DB (source of truth).
    let ownerPhone = ownerPhoneFromClient || '';
    if (rentId !== undefined && rentId !== null && rentId !== '') {
      const prop = await AddModel.findOne({ rentId: Number(rentId) })
        .select('phoneNumber')
        .lean();
      if (prop?.phoneNumber) ownerPhone = prop.phoneNumber;
    }

    if (!ownerPhone) {
      return res.status(404).json({ success: false, message: 'Owner phone number not found' });
    }

    const viewerDigits = String(viewerPhone).replace(/\D/g, '').slice(-10);
    const body = buildOwnerViewMessage({ rentId, viewerDigits });
    const clientRef = rentId ? `view-${rentId}-${viewerDigits}` : `view-${viewerDigits}`;

    const result = await sendSms(ownerPhone, body, clientRef);
    return res.json({ success: true, result });
  } catch (err) {
    // Surface the gateway's error message when present, else the axios/local one.
    const detail = err?.response?.data?.error?.message || err?.response?.data || err.message;
    console.error('notify-owner-contact-view error:', detail);
    return res.status(500).json({ success: false, message: detail });
  }
});

export default router;
