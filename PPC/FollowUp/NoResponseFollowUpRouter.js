const express = require('express');
const router = express.Router();
const NoResponseFollowUp = require('../FollowUp/NoResponseFollowUpModel');
const mongoose = require('mongoose');
const { resolveCreateBase } = require('../utils/baseFilter'); // city-base (PY/CH) tagging

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// De-duplicate phone-based follow-ups by composite key (keeps newest).
const dedupe = (followups) => {
  const seen = new Set();
  const unique = [];
  for (const item of followups) {
    const dateKey = item.followupDate ? new Date(item.followupDate).toISOString() : '';
    const key = `${item.phoneNumber}|${dateKey}|${item.followupStatus}|${item.followupType}|${item.adminName}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }
  return unique;
};

// POST: Create a No-Response follow-up (phone-based)
router.post('/noresponse-followup-create', async (req, res) => {
  try {
    const {
      phoneNumber,
      followupStatus,
      followupType,
      followupDate,
      adminName,
      remarks
    } = req.body;

    if (!phoneNumber || !followupStatus || !followupType || !followupDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: phoneNumber, followupStatus, followupType and followupDate are required.'
      });
    }

    // Validate enum values
    const validStatuses = ['Ring', 'Ready To Pay', 'Not Decided', 'No Response', 'Not Interested-Closed', 'Paid Closed'];
    const validTypes = ['Payment Followup', 'Data Followup', 'Enquiry Followup', 'No Response', 'Not Interested', 'Payment Closed'];
    
    if (!validStatuses.includes(followupStatus)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid followupStatus: '${followupStatus}'. Valid values: ${validStatuses.join(', ')}`
      });
    }
    
    if (!validTypes.includes(followupType)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid followupType: '${followupType}'. Valid values: ${validTypes.join(', ')}`
      });
    }

    if (remarks && remarks.length > 50) {
      return res.status(400).json({ success: false, message: 'Remarks cannot exceed 50 characters' });
    }

    // Validate and parse followupDate
    let parsedDate;
    try {
      parsedDate = new Date(followupDate);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (e) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid followupDate format. Please use YYYY-MM-DD format. Received: ${followupDate}`
      });
    }

    // Duplicate guard: reject an identical follow-up created within the last
    // 10 seconds (protects against double-click / retry of the Create button).
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
    const existing = await NoResponseFollowUp.findOne({
      phoneNumber,
      followupStatus,
      followupType,
      followupDate: parsedDate,
      adminName,
      createdAt: { $gte: tenSecondsAgo }
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        duplicate: true,
        message: 'Duplicate submission ignored',
        data: existing
      });
    }

    const newFollowUp = new NoResponseFollowUp({
      phoneNumber,
      followupStatus,
      followupType,
      followupDate: parsedDate,
      adminName,
      remarks: remarks ? remarks.slice(0, 50) : '',
      // Tag with the admin's active city scope (PY/CH; ALL defaults to PY).
      base: resolveCreateBase(req.query.base || req.body.base)
    });

    await newFollowUp.save();
    res.status(201).json({ success: true, data: newFollowUp });
  } catch (err) {
    console.error('Create NoResponseFollowUp Error:', err);
    console.error("Error Details:", {
      name: err.name,
      message: err.message,
      validationErrors: err.errors,
      payload: { phoneNumber, followupStatus, followupType, followupDate, adminName, remarks }
    });
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      errorDetails: err.message,
      errorType: err.name
    });
  }
});

// GET: All No-Response follow-ups
router.get('/noresponse-followup-list', async (req, res) => {
  try {
    const { phoneNumber } = req.query;
    let filter = {};
    if (phoneNumber) filter.phoneNumber = phoneNumber;

    const followups = await NoResponseFollowUp.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: dedupe(followups) });
  } catch (err) {
    console.error('List NoResponseFollowUp Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET: No-Response follow-ups with today/past filter
router.get('/noresponse-followup-list-today-past', async (req, res) => {
  try {
    const { phoneNumber, dateFilter } = req.query;
    let filter = {};
    if (phoneNumber) filter.phoneNumber = phoneNumber;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    if (dateFilter === 'today') {
      filter.followupDate = { $gte: todayStart, $lte: todayEnd };
    }
    if (dateFilter === 'past') {
      filter.followupDate = { $lt: todayStart };
    }

    const followups = await NoResponseFollowUp.find(filter).sort({ followupDate: -1, createdAt: -1 });
    res.status(200).json({ success: true, data: dedupe(followups) });
  } catch (err) {
    console.error('Today/Past NoResponseFollowUp Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT: Update a No-Response follow-up (Status, Type, Date, Admin Name, Remarks)
router.put('/noresponse-followup-update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { followupStatus, followupType, followupDate, adminName, remarks } = req.body;

    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid follow-up ID format' });
    }

    if (remarks !== undefined && remarks.length > 50) {
      return res.status(400).json({ success: false, message: 'Remarks cannot exceed 50 characters' });
    }

    const followup = await NoResponseFollowUp.findById(id);
    if (!followup) {
      return res.status(404).json({ success: false, message: 'Follow-up not found' });
    }

    if (followupStatus) followup.followupStatus = followupStatus;
    if (followupType) followup.followupType = followupType;
    if (followupDate) followup.followupDate = new Date(followupDate);
    if (adminName !== undefined) followup.adminName = adminName;
    if (remarks !== undefined) followup.remarks = remarks.slice(0, 50);

    await followup.save();
    res.status(200).json({ success: true, message: 'Follow-up updated successfully', data: followup });
  } catch (err) {
    console.error('Update NoResponseFollowUp Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
