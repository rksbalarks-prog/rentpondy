// Admin-side routes for AI-assistant owner leads. Mounted under /PPC (same open
// posture as the rest of the admin API — the admin app has no auth layer).
//
//   GET  /PPC/assistant/admin/owner-leads            list (newest first, ?status=)
//   PUT  /PPC/assistant/admin/owner-leads/:id         update follow-up
//   POST /PPC/assistant/admin/owner-leads/:id/preapprove  -> create a PreApproved
//        property (status 'complete', NEVER 'active'/live) and mark the lead.

import express from 'express';
import OwnerLead from './store/OwnerLeadModel.js';
import AddModel from '../AddModel.js'; // CommonJS default export

const router = express.Router();

router.get('/assistant/admin/owner-leads', async (req, res) => {
  try {
    const q = {};
    if (req.query.status) q.status = req.query.status;
    const leads = await OwnerLead.find(q).sort({ createdAt: -1 }).limit(500).lean();
    res.json({ success: true, count: leads.length, leads });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.put('/assistant/admin/owner-leads/:id', async (req, res) => {
  try {
    const patch = {};
    ['status', 'remark', 'calledBy'].forEach((k) => {
      if (req.body[k] !== undefined) patch[k] = String(req.body[k]).slice(0, 500);
    });
    if (req.body.followupDate) patch.followupDate = new Date(req.body.followupDate);
    const lead = await OwnerLead.findByIdAndUpdate(req.params.id, { $set: patch }, { new: true });
    if (!lead) return res.status(404).json({ success: false, error: 'lead_not_found' });
    res.json({ success: true, lead });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Convert a lead into a PreApproved property. status is forced to 'complete' so it
// lands on the PreApproved page; it is NEVER 'active', so it does not go live until
// an admin approves it there. Defaults fill the required fields the chat didn't ask.
router.post('/assistant/admin/owner-leads/:id/preapprove', async (req, res) => {
  try {
    const lead = await OwnerLead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, error: 'lead_not_found' });
    if (lead.rentId) {
      return res.status(409).json({ success: false, error: 'already_preapproved', rentId: lead.rentId });
    }

    const latest = await AddModel.findOne().sort({ rentId: -1 }).select('rentId').lean();
    const rentId = latest && latest.rentId ? latest.rentId + 1 : 1001;

    const phoneNumber = String(lead.contactPhone || lead.phone || '').replace(/\D/g, '').slice(-10);

    // Map lead -> property. Defaults satisfy the 15 requiredFields so the property
    // computes as complete (required='yes') and appears on the PreApproved page.
    const doc = new AddModel({
      rentId,
      phoneNumber,
      countryCode: '+91',
      propertyMode: lead.propertyMode || 'Residential',
      propertyType: lead.propertyType || 'House',
      postedBy: 'Owner',
      rentType: 'Monthly',
      rentalAmount: Number(lead.rentalAmount) || 0,
      securityDeposit: Number(lead.advanceAmount) || 0,
      floorNo: lead.floorNo || 'Ground',
      bedrooms: lead.bedrooms || '1',
      carParking: lead.carParking || 'No',
      lift: lead.lift || 'No',
      totalArea: Number(lead.totalArea) || 500,
      areaUnit: 'Sq.ft',
      area: lead.area || '',
      streetName: lead.streetName || '',
      pinCode: Number(lead.pinCode) || undefined,
      city: lead.city || 'Puducherry',
      district: 'Puducherry',
      state: 'Puducherry',
      availableDate: 'Immediate',
      base: 'PY',
      // Explicitly NOT 'active' — sits in PreApproved until an admin approves it.
      status: 'complete',
      createdBy: 'AI Assistant',
    });
    await doc.save();

    lead.status = 'preapproved';
    lead.rentId = rentId;
    await lead.save();

    res.json({ success: true, rentId, message: 'Lead sent to PreApproved (not live).' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
