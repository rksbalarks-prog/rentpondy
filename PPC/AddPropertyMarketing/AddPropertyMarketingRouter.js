// Dedicated backend module for src/AddPropertyFormMarketing.jsx.
//
// Endpoints unique to that form (handled here):
//   POST /store-id-rent          → reserve the next sequential rentId
//   POST /update-rent-property   → save/update the marketing add-property submission
//
// The same form also calls two shared endpoints that are intentionally NOT
// duplicated here because they are generic services used by many forms:
//   GET  /fetch         → SendDataAdmin/DataRouter.js
//   POST /send-message  → messageRoutes.js
//
// This router must be mounted in server.js BEFORE AddRouter so it takes
// precedence over the duplicate handlers still living in AddRouter.js.

const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const router = express.Router();

const AddModel = require('../AddModel');
const NotificationUser = require('../Notification/NotificationDetailModel');
const { resolveBaseFromAddress, resolveBaseForSave } = require('../utils/baseFilter'); // city-base (PY/CH) tagging

// ─────────────────────────── Multer config ───────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDirectory = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const { rentId } = req.body;
    if (!req.imageIndexMap) req.imageIndexMap = {};
    if (!req.imageIndexMap[file.fieldname]) {
      req.imageIndexMap[file.fieldname] = 1;
    } else {
      req.imageIndexMap[file.fieldname]++;
    }
    const index = req.imageIndexMap[file.fieldname];
    const ext = path.extname(file.originalname);
    // Include a timestamp so a re-uploaded image never reuses an old image's
    // filename/URL. Reusing the name (rentId_<id>_photos_1) overwrote the file
    // on disk but left the URL identical, so the browser/CDN kept serving the
    // stale cached image after an edit ("old image still shows"). A fresh name
    // gives a fresh URL and defeats that cache. (index disambiguates files that
    // share the same millisecond within one request.)
    const newName = `rentId_${rentId}_${file.fieldname}_${index}_${Date.now()}${ext}`;
    cb(null, newName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB per file
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /\.(jpe?g|png|gif|webp|mp4|webm|avi|mov|mkv|m4v|ogg)$/i;
    const isImageMime = (file.mimetype || '').startsWith('image/');
    const isVideoMime = (file.mimetype || '').startsWith('video/');
    const extOk = allowedExtensions.test(file.originalname || '');
    if ((isImageMime || isVideoMime) && extOk) cb(null, true);
    else cb(new Error('Only image/video files allowed!'), false);
  },
}).fields([
  { name: 'video', maxCount: 5 },
  { name: 'photos', maxCount: 15 },
]);

// ─────────── POST /store-id-rent — reserve a sequential rentId ───────────
router.post('/store-id-rent', async (req, res) => {
  try {
    const latestProperty = await AddModel.findOne().sort({ rentId: -1 });
    const nextRentId = latestProperty ? latestProperty.rentId + 1 : 1001;

    const newUser = new AddModel({
      rentId: nextRentId,
      createdBy: 'Admin',
    });
    await newUser.save();

    res.status(201).json({
      message: 'Rent ID created and stored successfully!',
      rentId: nextRentId,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error storing Rent ID.', error });
  }
});

// ─────────── POST /update-rent-property — save the form submission ───────────
router.post('/update-rent-property', (req, res) => {
  console.log('[marketing-router] /update-rent-property HIT');
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'Upload error', error: err.message });
    } else if (err) {
      return res.status(500).json({ message: 'Unexpected error', error: err.message });
    }

    const {
      rentId,
      phoneNumber,
      rentalAmount,
      rentType,
      rentalPropertyAddress,
      state,
      city,
      district,
      area,
      streetName,
      doorNumber,
      nagar,
      ownerName,
      email,
      alternatePhone,
      countryCode,
      alternateCountryCode,
      propertyMode,
      propertyType,
      bankLoan,
      negotiation,
      ownership,
      bedrooms,
      kitchen,
      kitchenType,
      balconies,
      floorNo,
      areaUnit,
      propertyApproved,
      propertyAge,
      postedBy,
      facing,
      wheelChairAvailable,
      furnished,
      lift,
      attachedBathrooms,
      western,
      numberOfFloors,
      carParking,
      bestTimeToCall,
      totalArea,
      length,
      breadth,
      description,
      pinCode,
      locationCoordinates,
      country,
      availableDate,
      familyMembers,
      foodHabit,
      jobType,
      petAllowed,
      securityDeposit,
      addedBy,
      callForRent,
    } = req.body;

    if (!rentId) {
      return res.status(400).json({ message: 'Rent ID is required.' });
    }

    try {
      const user = await AddModel.findOne({ rentId });
      if (!user) return res.status(404).json({ message: 'Property not found.' });

      const fieldsToUpdate = {
        phoneNumber, rentType, rentalAmount, rentalPropertyAddress, state, city, district, area,
        streetName, doorNumber, nagar, ownerName, email, alternatePhone, countryCode,
        alternateCountryCode, propertyMode, propertyType, bankLoan, negotiation, ownership,
        bedrooms, kitchen, kitchenType, balconies, floorNo, areaUnit, propertyApproved,
        propertyAge, postedBy, facing, furnished, lift,
        attachedBathrooms, western, numberOfFloors, carParking, bestTimeToCall, totalArea,
        length, breadth, description, pinCode, locationCoordinates,
        availableDate, familyMembers, foodHabit, jobType, petAllowed,
        securityDeposit, country, wheelChairAvailable,
      };

      for (const key in fieldsToUpdate) {
        if (fieldsToUpdate[key] !== undefined && fieldsToUpdate[key] !== '') {
          user[key] = fieldsToUpdate[key];
        }
      }

      // callForRent is a Boolean — explicit set (true / false / undefined→untouched)
      if (callForRent !== undefined) {
        user.callForRent = callForRent === true || callForRent === 'true';
      }

      // addedBy is set once on first save and preserved on later edits.
      if (addedBy && !user.addedBy) {
        user.addedBy = addedBy;
      }

      // Pre-approved compatibility: /properties/pre-approved-all-rent in AddRouter.js
      // requires these 15 fields to be non-empty for a property to appear in the
      // Pre-Approved list. Since this form allows partial submissions, fill any
      // blanks with a placeholder so the upload still passes that gate.
      // (rentId is set by /store-id-rent; rentalAmount has a schema default of 0.)
      const preApprovedPlaceholders = {
        phoneNumber: '-', propertyMode: '-', propertyType: '-', postedBy: '-',
        rentType: '-', floorNo: '-', bedrooms: '-', state: '-', city: '-',
        area: '-', areaUnit: '-', availableDate: '-',
        totalArea: 0,
      };
      for (const [field, placeholder] of Object.entries(preApprovedPlaceholders)) {
        const value = user[field];
        if (value === undefined || value === null || String(value).trim() === '') {
          user[field] = placeholder;
        }
      }

      // Video: take new uploads if present, else keep the existing video on edit.
      if (req.files && req.files['video'] && req.files['video'].length > 0) {
        user.video = req.files['video'].map(file => path.join('uploads', file.filename));
      } else if (typeof req.body.existingVideo === 'string' && req.body.existingVideo.trim() !== '') {
        user.video = [req.body.existingVideo.trim()];
      }

      // Photos: support reordering of existing photos and a unified new+existing order.
      const newPhotoPaths = (req.files && req.files['photos'])
        ? req.files['photos'].map(file => path.join('uploads', file.filename))
        : [];

      const parseJsonArray = (raw) => {
        if (raw === undefined || raw === null) return null;
        try {
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          return Array.isArray(parsed) ? parsed : null;
        } catch (e) {
          return null;
        }
      };

      const photoOrder = parseJsonArray(req.body.photoOrder);
      const existingPhotosBody = parseJsonArray(req.body.existingPhotos);

      if (photoOrder) {
        // photoOrder entries are either an existing path string or '__NEW__'
        // which consumes one new upload in upload order.
        let newIdx = 0;
        user.photos = photoOrder
          .map((item) => {
            if (item === '__NEW__') {
              const next = newPhotoPaths[newIdx];
              newIdx += 1;
              return next;
            }
            return item;
          })
          .filter(Boolean);
      } else if (existingPhotosBody) {
        user.photos = [...existingPhotosBody, ...newPhotoPaths];
      } else if (newPhotoPaths.length > 0) {
        user.photos = newPhotoPaths;
      }

      // Tag the city base (PY/CH). A PY- or CH-scoped admin forces their
      // own city; an ALL admin (or a user-facing call without scope) falls
      // back to address-based resolution.
      user.base = resolveBaseForSave(req.query && req.query.base, user);

      // Mandatory-field gating removed: every upload from the marketing form
      // is treated as complete so it lands directly in the pre-approved list.
      user.status = 'complete';

      await user.save();

      if ((user.propertyMode && user.propertyType) && (user.rentalAmount || user.price)) {
        try {
          await NotificationUser.create({
            recipientPhoneNumber: user.phoneNumber,
            senderPhoneNumber: user.phoneNumber,
            userPhoneNumber: user.phoneNumber,
            rentId: user.rentId,
            type: 'property-Add',
            message: `Your property (${user.rentId}) has been updated successfully.`,
            createdAt: new Date(),
          });
        } catch (notifErr) {
          console.error('Notification error:', notifErr.message);
        }
      }

      res.status(200).json({
        message: 'Property details updated successfully!',
        rentId: user.rentId,
        propertyStatus: user.status,
        user,
      });
    } catch (error) {
      console.error('Update error:', error.message);
      res.status(500).json({ message: 'Error updating property.', error: error.message });
    }
  });
});

module.exports = router;
