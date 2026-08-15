const express = require('express');
const router = express.Router();
const FollowUp = require('../FollowUp/FollowUpModel');
const moment = require('moment');
const AddModel = require('../AddModel');
const mongoose = require('mongoose');
const { resolveCreateBase } = require('../utils/baseFilter'); // city-base (PY/CH) tagging

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// PUT: Transfer FollowUp admin
router.put('/transfer-admin', async (req, res) => {
  try {
    const { followupId, fromAdmin, toAdmin } = req.body;

    if (!followupId || !fromAdmin || !toAdmin) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!isValidObjectId(followupId)) {
      return res.status(400).json({ success: false, message: 'Invalid followupId format' });
    }

    const followup = await FollowUp.findById(followupId);

    if (!followup) {
      return res.status(404).json({ success: false, message: 'Follow-up not found' });
    }

    followup.adminName = toAdmin;
    followup.transferHistory.push({
      from: fromAdmin,
      to: toAdmin,
      date: new Date()
    });

    await followup.save();

    res.status(200).json({ success: true, message: 'Follow-up transferred successfully', data: followup });
  } catch (error) {
    console.error("Transfer FollowUp Error:", error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// PUT: Update FollowUp details (Status, Type, Date, Admin Name, Remarks)
router.put('/followup-update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { followupStatus, followupType, followupDate, adminName, remarks } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Follow-up ID is required' });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid follow-up ID format' });
    }

    // Validate remarks length if provided
    if (remarks !== undefined && remarks.length > 50) {
      return res.status(400).json({ success: false, message: 'Remarks cannot exceed 50 characters' });
    }

    const followup = await FollowUp.findById(id);

    if (!followup) {
      return res.status(404).json({ success: false, message: 'Follow-up not found' });
    }

    if (followupStatus) followup.followupStatus = followupStatus;
    if (followupType) followup.followupType = followupType;
    if (followupDate) followup.followupDate = new Date(followupDate);
    if (adminName) followup.adminName = adminName;
    if (remarks !== undefined) followup.remarks = remarks.slice(0, 50); // hard cap

    await followup.save();

    res.status(200).json({ success: true, message: 'Follow-up updated successfully', data: followup });
  } catch (error) {
    console.error("Update FollowUp Error:", error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// POST: Create FollowUp (with remarks)
router.post('/followup-create', async (req, res) => {
  try {
    const {
      rentId,
      phoneNumber,
      followupStatus,
      followupType,
      followupDate,
      adminName,
      remarks
    } = req.body;

    // Validate required fields
    if (!followupStatus || !followupType || !followupDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: followupStatus, followupType, and followupDate are required.'
      });
    }

    // Validate enum values
    const validStatuses = ['Ring', 'Ready To Pay', 'Not Decided', 'No Response', 'Not Interested-Closed', 'Paid Closed'];
    const validTypes = ['Payment Followup', 'Data Followup', 'Enquiry Followup', 'No Response', 'Payment Closed'];
    
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

    // Validate remarks length if provided
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

    // Duplicate guard: reject identical follow-up created within the last 10 seconds
    // (protects against double-click / retry of the Create button)
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
    const existing = await FollowUp.findOne({
      rentId,
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

    const newFollowUp = new FollowUp({
      rentId,
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
    console.error("Create FollowUp Error:", err);
    console.error("Error Details:", {
      name: err.name,
      message: err.message,
      validationErrors: err.errors,
      payload: { rentId, phoneNumber, followupStatus, followupType, followupDate, adminName, remarks }
    });
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      errorDetails: err.message,
      errorType: err.name
    });
  }
});

// GET: Follow-ups with today/past filter
router.get('/followup-list-today-past', async (req, res) => {
  try {
    const { rentId, phoneNumber, dateFilter } = req.query;
    let filter = {};

    if (rentId) filter.rentId = rentId;
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

    const followups = await FollowUp.find(filter).sort({ followupDate: -1, createdAt: -1 });

    // De-duplicate by composite key (keeps newest)
    const seen = new Set();
    const unique = [];
    for (const item of followups) {
      const dateKey = item.followupDate ? new Date(item.followupDate).toISOString() : '';
      const key = `${item.rentId}|${item.phoneNumber}|${dateKey}|${item.followupStatus}|${item.followupType}|${item.adminName}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(item);
    }

    res.status(200).json({ success: true, data: unique });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET: All follow-ups list
router.get('/followup-list', async (req, res) => {
  try {
    const { rentId, phoneNumber } = req.query;
    let filter = {};

    if (rentId) filter.rentId = rentId;
    if (phoneNumber) filter.phoneNumber = phoneNumber;

    // Sorted newest-first so the first occurrence we keep is the latest one
    const followups = await FollowUp.find(filter).sort({ createdAt: -1 });

    // De-duplicate by composite key (rentId + phoneNumber + followupDate +
    // followupStatus + followupType + adminName). Keeps the newest record.
    const seen = new Set();
    const unique = [];
    for (const item of followups) {
      const dateKey = item.followupDate ? new Date(item.followupDate).toISOString() : '';
      const key = `${item.rentId}|${item.phoneNumber}|${dateKey}|${item.followupStatus}|${item.followupType}|${item.adminName}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(item);
    }

    res.status(200).json({ success: true, data: unique });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET: All followups with related AddModel data
router.get('/followups', async (req, res) => {
  try {
    const followups = await FollowUp.find();

    const ppcIds = followups.map(fu => fu.rentId).filter(id => id != null);

    const validPpcIds = ppcIds
      .map(id => Number(id))
      .filter(num => !isNaN(num));

    let properties = [];
    if (validPpcIds.length > 0) {
      properties = await AddModel.find({ rentId: { $in: validPpcIds } });
    }

    res.json({ success: true, followups, properties });
  } catch (err) {
    console.error('Error fetching followups:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST: Bulk create follow-ups — ONE per property for a set of rentIds.  [ADDITIVE]
// Used by the "Bulk Followup" button on the PreApproved/Pending pages to apply
// the same follow-up details to every (bulk-uploaded) property currently shown.
// Honours the one-follow-up-per-property rule: any rentId that already has a
// follow-up is skipped and reported, never duplicated.
router.post('/followup-bulk-create', async (req, res) => {
  try {
    const {
      items,
      followupStatus,
      followupType,
      followupDate,
      adminName,
      remarks,
    } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No properties supplied for bulk follow-up.' });
    }
    if (items.length > 5000) {
      return res.status(400).json({ success: false, message: 'Too many properties in one bulk follow-up (max 5000).' });
    }
    if (!followupStatus || !followupType || !followupDate) {
      return res.status(400).json({ success: false, message: 'followupStatus, followupType and followupDate are required.' });
    }
    if (remarks && remarks.length > 50) {
      return res.status(400).json({ success: false, message: 'Remarks cannot exceed 50 characters.' });
    }

    // De-dupe incoming rentIds and map rentId -> phoneNumber. FollowUp.rentId is
    // a String, so normalise everything to strings to match storage/queries.
    const phoneByRentId = new Map();
    for (const it of items) {
      const ridRaw = it && it.rentId;
      if (ridRaw === undefined || ridRaw === null || String(ridRaw).trim() === '') continue;
      const rid = String(ridRaw).trim();
      if (!phoneByRentId.has(rid)) phoneByRentId.set(rid, it.phoneNumber ? String(it.phoneNumber) : '');
    }
    const rentIds = [...phoneByRentId.keys()];
    if (rentIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid rentIds supplied.' });
    }

    // One follow-up per property: skip rentIds that already have one. Use the
    // raw collection so the check isn't narrowed by the city-scope plugin.
    const existingDocs = await FollowUp.collection.find({ rentId: { $in: rentIds } }).toArray();
    const existingSet = new Set(existingDocs.map(d => String(d.rentId)));

    const base = resolveCreateBase(req.query.base || req.body.base);
    const safeRemarks = remarks ? String(remarks).slice(0, 50) : '';
    const fuDate = new Date(followupDate);

    const docs = [];
    const skippedRentIds = [];
    for (const rid of rentIds) {
      if (existingSet.has(rid)) { skippedRentIds.push(rid); continue; }
      docs.push({
        rentId: rid,
        phoneNumber: phoneByRentId.get(rid),
        followupStatus,
        followupType,
        followupDate: fuDate,
        adminName,
        remarks: safeRemarks,
        base,
      });
    }

    let createdCount = 0;
    if (docs.length) {
      const inserted = await FollowUp.insertMany(docs, { ordered: false });
      createdCount = inserted.length;
    }

    return res.status(201).json({
      success: true,
      message: `Created ${createdCount} follow-up(s); skipped ${skippedRentIds.length} that already had one.`,
      createdCount,
      skippedCount: skippedRentIds.length,
      totalRequested: rentIds.length,
      skippedRentIds,
    });
  } catch (err) {
    console.error('Bulk Create FollowUp Error:', err);
    return res.status(500).json({ success: false, message: 'Server error during bulk follow-up creation.' });
  }
});

module.exports = router;