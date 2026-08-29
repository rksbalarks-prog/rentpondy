//Rent Property Add Router Code



const express = require('express');
const router = express.Router();
const moment = require("moment");

const AddModel = require('./AddModel');
const UserLogin = require('./user/UserModel'); 
const PricingPlans = require('./plans/PricingPlanModel');
const Bill = require('./CreateBill/BillModel');
const FollowUp = require('./FollowUp/FollowUpModel');
const UserViewsModel = require("./ViewsModel");
const PlanLimit = require("./Limit/LimitModel");
const DeletedAddModel = require ('./DeleteModel');
const BuyerAssistView = require ('./BuyerAssistViewModel')
const AddressRequest = require ('./AddressRequest/AddressRequestModel');
const BuyerAssistance = require ('./BuyerAssistance/BuyerAssistanceModel')
const PhotoRequest = require("./Photo/PhotoRequestModel");
const Offer = require('./Offer/OfferModel'); 
const PaymentPayUBuyer =require('./PayuBuyer/PayuBuyerModel')
const SalePropertyView =require('./SalePropertyViewsModel')
const ContactLog = require('./ContactLog'); // import this
const { baseFilter, resolveCreateBase, resolveBaseFromAddress, resolveBaseForSave } = require('./utils/baseFilter'); // city-base (PY/CH) filtering

// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const UserModel = require('./user/UserModel');
// const ViewsModel = require('./ViewsModel');
const PaymentPayU = require('./PayU/PayUModel'); // Include your PayU model
// const PaymentPayUBuyer = require('./PayuBuyer/PayuBuyerModel'); // Include your PayU model
const NotificationUser = require('./Notification/NotificationDetailModel');



// // Set up multer storage configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadDirectory = 'uploads/';
//         if (!fs.existsSync(uploadDirectory)) {
//             fs.mkdirSync(uploadDirectory, { recursive: true });
//         }
//         cb(null, uploadDirectory);
//     },
//     filename: (req, file, cb) => {
//         const fileExtension = path.extname(file.originalname);
//         const fileName = Date.now() + fileExtension; // Unique filename
//         cb(null, fileName);
//     },
// });


// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
//   fileFilter: (req, file, cb) => {
//       const fileTypes = /jpeg|jpg|png|gif|mp4|avi|mov/; // Allowed file types
//       const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//       const mimetype = fileTypes.test(file.mimetype);
//       if (extname && mimetype) {
//           return cb(null, true); // Accept the file
//       } else {
//           return cb(new Error('Only image and video files (JPEG, PNG, GIF, MP4, AVI, MOV) are allowed!'), false);
//       }
//   },
// });

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// // Multer Storage Config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDirectory = 'uploads/';
//     if (!fs.existsSync(uploadDirectory)) {
//       fs.mkdirSync(uploadDirectory, { recursive: true });
//     }
//     cb(null, uploadDirectory);
//   },
//   filename: (req, file, cb) => {
//     const { rentId } = req.body;
//     if (!req.imageIndexMap) req.imageIndexMap = {};
//     if (!req.imageIndexMap[file.fieldname]) {
//       req.imageIndexMap[file.fieldname] = 1;
//     } else {
//       req.imageIndexMap[file.fieldname]++;
//     }

//     const index = req.imageIndexMap[file.fieldname];
//     const ext = path.extname(file.originalname);
//     const newName = `RentId_${rentId}_${index}${ext}`;
//     cb(null, newName);
//   },
// });


// Multer Storage Config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDirectory = 'uploads/';
//     if (!fs.existsSync(uploadDirectory)) {
//       fs.mkdirSync(uploadDirectory, { recursive: true });
//     }
//     cb(null, uploadDirectory);
//   },
//   filename: (req, file, cb) => {
//     const { rentId } = req.body;
//     if (!req.imageIndexMap) req.imageIndexMap = {};
//     if (!req.imageIndexMap[file.fieldname]) {
//       req.imageIndexMap[file.fieldname] = 1;
//     } else {
//       req.imageIndexMap[file.fieldname]++;
//     }

//     const index = req.imageIndexMap[file.fieldname];
//     const ext = path.extname(file.originalname);
//     const newName = `rentId_${rentId}_${index}${ext}`;
//     cb(null, newName);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 100 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     const fileTypes = /jpeg|jpg|png|gif|mp4|avi|mov/;
//     const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = fileTypes.test(file.mimetype);
//     if (extname && mimetype) cb(null, true);
//     else cb(new Error('Only image/video files allowed!'), false);
//   },
// });


// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 100 * 1024 * 1024, // allow up to 100MB per file
//   },
//   fileFilter: (req, file, cb) => {
//     const fileTypes = /jpeg|jpg|png|gif|mp4|avi|mov/;
//     const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = fileTypes.test(file.mimetype);
//     if (extname && mimetype) cb(null, true);
//     else cb(new Error('Only image/video files allowed!'), false);
//  },
// });




// Multer Storage Config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDirectory = 'uploads/';
//     if (!fs.existsSync(uploadDirectory)) {
//       fs.mkdirSync(uploadDirectory, { recursive: true });
//     }
//     cb(null, uploadDirectory);
//   },

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDirectory = path.join(__dirname, 'uploads'); // ✅ absolute path
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

// Multer Upload Config
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB per file
  },
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

// API Route
router.post('/update-rent-property', (req, res) => {
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
    } = req.body;

    if (!rentId) {
      return res.status(400).json({ message: 'Rent ID is required.' });
    }

    try {
      const user = await AddModel.findOne({ rentId });
      if (!user) return res.status(404).json({ message: 'Property not found.' });

      // Update fields
      const fieldsToUpdate = {
        phoneNumber, rentType, rentalAmount, rentalPropertyAddress, state, city, district, area,
        streetName, doorNumber, nagar, ownerName, email, alternatePhone, countryCode,
        alternateCountryCode, propertyMode, propertyType, bankLoan, negotiation, ownership,
        bedrooms, kitchen, kitchenType, balconies, floorNo, areaUnit, propertyApproved,
        propertyAge, postedBy, facing, furnished, lift,
        attachedBathrooms, western, numberOfFloors, carParking, bestTimeToCall, totalArea,
        length, breadth, description, pinCode, locationCoordinates,
        availableDate, familyMembers, foodHabit, jobType, petAllowed,
        securityDeposit, country, wheelChairAvailable
      };

      for (const key in fieldsToUpdate) {
        if (fieldsToUpdate[key] !== undefined && fieldsToUpdate[key] !== '') {
          user[key] = fieldsToUpdate[key];
        }
      }

      // Set addedBy only on first save (don't overwrite on subsequent edits)
      if (addedBy && !user.addedBy) {
        user.addedBy = addedBy;
      }

      // Handle File Uploads
      if (req.files && req.files['video'] && req.files['video'].length > 0) {
        user.video = req.files['video'].map(file => path.join('uploads', file.filename));
      } else if (typeof req.body.existingVideo === 'string' && req.body.existingVideo.trim() !== '') {
        // Preserve the existing video on edit when no new file is uploaded.
        user.video = [req.body.existingVideo.trim()];
      }

      // Photos: support reordering of existing photos and unified new+existing order.
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
        // photoOrder is the unified ordered list. Each entry is either an
        // existing path string or '__NEW__' which consumes one new upload
        // in upload order.
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

      // Keep the city base (PY/CH) in sync. A PY- or CH-scoped admin
      // forces their own city; for an ALL admin (or a user-facing call
      // without scope) we fall back to the property's actual address —
      // not whichever section the owner was browsing.
      user.base = resolveBaseForSave(req.query && req.query.base, user);

      // Completion Status
      const requiredFields = [
        'rentId', 'phoneNumber', 'propertyMode', 'propertyType',
        'postedBy', 'rentType', 'rentalAmount', 'floorNo', 'bedrooms',
        'state', 'city', 'area', 'totalArea', 'areaUnit', 'availableDate'
      ];

      const isComplete = requiredFields.every(field => user[field]);
      user.status = isComplete ? "complete" : "incomplete";

      await user.save();

      // Optional: Notify user
      if ((user.propertyMode && user.propertyType) && (user.rentalAmount || user.price)) {
        try {
          await NotificationUser.create({
            recipientPhoneNumber: user.phoneNumber,
            senderPhoneNumber: user.phoneNumber,
            userPhoneNumber: user.phoneNumber,
            rentId: user.rentId,
            type: "property-Add",
            message: `Your property (${user.rentId}) has been updated successfully.`,
            createdAt: new Date()
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





// In your backend route handler
router.post('/record-buyer-assist-view', async (req, res) => {
  try {
    const { phoneNumber, Ra_Id } = req.body;
    
    // Validate required fields
    if (!phoneNumber || !Ra_Id) {
      return res.status(400).json({
        success: false,
        message: 'phoneNumber and Ra_Id are required fields'
      });
    }
    
    // Create and save the view record
    const viewRecord = new BuyerAssistView({
      phoneNumber,
      Ra_Id
    });
    
    await viewRecord.save();
    
    res.json({
      success: true,
      message: 'View recorded successfully'
    });
  } catch (error) {
    console.error('Error recording view:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});




router.post('/save-property-view', async (req, res) => {
  try {
    const { rentId, userPhoneNumber } = req.body;

    console.log("Incoming view data:", { rentId, userPhoneNumber }); // ✅ Check this in console

    if (!rentId || !userPhoneNumber) {
      return res.status(400).json({ message: 'rentId and userPhoneNumber are required' });
    }

    const newPropertyView = new SalePropertyView({
      rentId,
      userPhoneNumber,
    });

    await newPropertyView.save();

    res.status(200).json({ message: 'Property view saved successfully!' });
  } catch (error) {
    console.error("Error in /save-property-view:", error);
    res.status(500).json({ message: 'Error saving property view data.', error: error.message });
  }
});


// GET all property views
router.get('/get-all-property-views', async (req, res) => {
  try {
    const views = await SalePropertyView.find().sort({ viewedAt: -1 }); // Sort by latest
    res.status(200).json({ message: "All property views fetched successfully!", data: views });
  } catch (error) {
    console.error("Error fetching property views:", error);
    res.status(500).json({ message: "Failed to fetch property views.", error: error.message });
  }
});



router.post('/store-data-rent', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required.' });
  }

  try {
    const existingIncomplete = await AddModel.findOne({
      phoneNumber,
      $or: [
        { propertyMode: { $in: [null, ''] } },
        { propertyType: { $in: [null, ''] } },
        { rentType: { $in: [null, ''] } },
        { rentalAmount: { $in: [null, ''] } },
        { areaUnit: { $in: [null, ''] } },
                { totalArea: { $in: [null, ''] } },
                 { bedrooms: { $in: [null, ''] } },
                { floorNo: { $in: [null, ''] } },
        { postedBy: { $in: [null, ''] } },
        { availableDate: { $in: [null, ''] } },
        
      ]
    });

    if (existingIncomplete) {
      return res.status(200).json({
        message: 'Existing incomplete entry found.',
        rentId: existingIncomplete.rentId
      });
    }

    const latestProperty = await AddModel.findOne().sort({ rentId: -1 });
    const nextRentId = latestProperty ? latestProperty.rentId + 1 : 1001;

    const newUser = new AddModel({
      phoneNumber,
      rentId: nextRentId,
      createdBy: 'User',
      // Tag the property with the city section the owner is currently in.
      base: resolveCreateBase(req.query.base || req.body.base)
    });

    await newUser.save();

    res.status(201).json({ message: 'New Rent ID created.', rentId: nextRentId });
  } catch (error) {
    res.status(500).json({ message: 'Error storing user details.', error });
  }
});


router.post("/store-id-rent", async (req, res) => {
  try {
    const latestProperty = await AddModel.findOne().sort({ rentId: -1 });

    const nextRentId = latestProperty ? latestProperty.rentId + 1 : 1001;

    const newUser = new AddModel({
      rentId: nextRentId,
      createdBy: 'Admin',
      // Tag with the admin's active city section (PY/CH; defaults to PY in ALL mode).
      base: resolveCreateBase(req.query.base || req.body.base)
    });

    const savedUser = await newUser.save();

    res.status(201).json({ message: "Rent ID created and stored successfully!", rentId: nextRentId });
  } catch (error) {
    res.status(500).json({ message: "Error storing Rent ID.", error });
  }
});


// router.post(
//   '/update-rent-property',

//   upload.fields([{ name: 'video', maxCount: 5 }, { name: 'photos', maxCount: 15 }]),
//   async (req, res) => {
//     if (req.fileValidationError) {
//       return res.status(400).json({ message: req.fileValidationError });
//     }

//     if (req.files['video'] && req.files['video'][0].size > 100 * 1024 * 1024) {
//       return res.status(400).json({ message: 'Video file size exceeds 50MB.' });
//     }

  

//     const {
//       rentId,
//       phoneNumber,
//       rentalAmount,
//       rentType,
//       rentalPropertyAddress,
//       state,
//       city,
//       district,
//       area,
//       streetName,
//       doorNumber,
//       nagar,
//       ownerName,
//       email,
//       alternatePhone,
//       countryCode,
//       alternateCountryCode,
//       propertyMode,
//       propertyType,
//       bankLoan,
//       negotiation,
//       ownership,
//       bedrooms,
//       kitchen,
//       kitchenType,
//       balconies,
//       floorNo,
//       areaUnit,
//       propertyApproved,
//       propertyAge,
//       postedBy,
//       facing,
// wheelChairAvailable,
//       furnished,
//       lift,
//       attachedBathrooms,
//       western,
//       numberOfFloors,
//       carParking,
//       bestTimeToCall,
//       totalArea,
//       length,
//       breadth,
//       description,
//       pinCode,
//       locationCoordinates,
//       country,

//       // Extended Fields
//       availableDate,
//       familyMembers,
//       foodHabit,
//       jobType,
//       petAllowed,
//       securityDeposit,
    
//     } = req.body;

//     if (!rentId) {
//       return res.status(400).json({ message: 'Rent ID is required.' });
//     }

//     try {
//       const user = await AddModel.findOne({ rentId });

//       if (!user) {
//         return res.status(404).json({ message: 'User not found.' });
//       }

//       // Dynamic fields to update
//       const fieldsToUpdate = {
//         phoneNumber, rentType, rentalAmount, rentalPropertyAddress, state, city, district, area,
//         streetName, doorNumber, nagar, ownerName, email, alternatePhone, countryCode,
//         alternateCountryCode, propertyMode, propertyType, bankLoan, negotiation, ownership,
//         bedrooms, kitchen, kitchenType, balconies, floorNo, areaUnit, propertyApproved,
//         propertyAge, postedBy, facing, furnished, lift,
//         attachedBathrooms, western, numberOfFloors, carParking, bestTimeToCall, totalArea,
//         length, breadth, description, pinCode, locationCoordinates,
//         availableDate, familyMembers, foodHabit, jobType, petAllowed,
//         securityDeposit, country,wheelChairAvailable
//       };

//       // Use `price` only for sales; use `rentalAmount` for rental properties
//       if (propertyMode === "Rent" || user.propertyMode === "Rent") {
//         fieldsToUpdate.rentalAmount = rentalAmount;
//         user.rentalAmount = undefined; // clear price if it was set earlier
//       } else {
//         fieldsToUpdate.rentalAmount = rentalAmount;
//       }

//       for (const key in fieldsToUpdate) {
//         if (fieldsToUpdate[key] !== undefined && fieldsToUpdate[key] !== '') {
//           user[key] = fieldsToUpdate[key];
//         }
//       }

//       // File uploads
// //       if (req.files) {
// //         if (req.files['video']) {
// //           user.video = req.files['video'][0].path;
// //         }
// //         // if (req.files['photos']) {
// //         //   user.photos = req.files['photos'].map(file => file.path);
// //         // }

        
// //         if (req.files['photos']) {
// //   user.photos = req.files['photos'].map(file => path.basename(file.filename));
// // }
// //       }


// // Example: inside your route (e.g., POST or PUT for saving user/property)
// if (req.files) {
//   // ✅ Save full path for video (uploads/filename.mp4)
//   // if (req.files['video']) {
//   //   const videoFile = req.files['video'][0];
//   //   // Save relative path like 'uploads/ppcId_2409_1.mp4'
//   //   user.video = path.join('uploads', videoFile.filename);
//   // }


  
//   if (req.files['video']) {
//     user.video = req.files['video'].map(file => path.join('uploads', file.filename));
//   }

// //   if (req.files['video']) {
// //   user.video = req.files['video'].map(file => path.join('uploads', file.filename));
// // }


//   // ✅ Save full paths for photos (uploads/ppcId_2409_1.jpg, etc.)
//   if (req.files['photos']) {
//     user.photos = req.files['photos'].map(file => path.join('uploads', file.filename));
//   }
// }

//       // Check if minimum required fields are present
//       const requiredFields = [
//         'rentId', 'phoneNumber', 'propertyMode', 'propertyType',
//         'postedBy', 'rentType', 'rentalAmount', 'floorNo','bedrooms','state','city','area','totalArea','areaUnit','availableDate'
//       ];

//       if (user.propertyMode === 'Rent') {
//         requiredFields.push('rentalAmount');
//       } else {
//         requiredFields.push('rentalAmount');
//       }

//       const isComplete = requiredFields.every(field => user[field]);
//       user.status = isComplete ? "complete" : "incomplete";

//       await user.save();

//       // Send notification if 3 key fields are filled
//       if ((user.propertyMode && user.propertyType) && (user.price || user.rentalAmount)) {
//         try {
//           await NotificationUser.create({
//             recipientPhoneNumber: user.phoneNumber,
//             senderPhoneNumber: user.phoneNumber,
//             userPhoneNumber: user.phoneNumber,
//             rentId: user.rentId,
//             type: "property-Add",
//             message: `Your property (${user.rentId}) has been added successfully.`,
//             createdAt: new Date()
//           });
//         } catch (notifErr) {
//           console.error('Notification error:', notifErr.message);
//         }
//       }

//       res.status(200).json({
//         message: 'Property details updated successfully!',
//         rentId: user.rentId,
//         propertyStatus: user.status,
//         user,
//       });

//     } catch (error) {
//       console.error('Update error:', error.message);
//       res.status(500).json({ message: 'Error updating property details.', error });
//     }
//   }
// );


router.get('/fetch-active-users-on-demand-rent', async (req, res) => {
  try {
    const properties = await AddModel.find({ status: 'active', ...baseFilter(req.query.base) }).lean();
    const plans = await PricingPlans.find();
    const bills = await Bill.find();
    const followups = await FollowUp.find();
    const payments = await PaymentPayU.find();

      const requiredFields = [
        'rentId', 'phoneNumber', 'propertyMode', 'propertyType',
        'postedBy', 'rentType', 'rentalAmount', 'floorNo','bedrooms','state','city','area','totalArea','areaUnit','availableDate'
      ];

    const processedProperties = properties.map((property) => {
      // ✅ Replace rentalAmount with "On Demand" if flagged
      if (property.onDemand) {
        property.rentalAmount = "On Demand";
      }

      // ✅ Field completeness check
      const isComplete = requiredFields.every(
        (field) =>
          property[field] !== undefined &&
          property[field] !== null &&
          String(property[field]).trim() !== ''
      );

      // Plan info
      const matchedPlan = plans.find(plan =>
        Array.isArray(plan.phoneNumber)
          ? plan.phoneNumber.includes(property.phoneNumber)
          : plan.phoneNumber === property.phoneNumber
      );

      let planCreatedAt = 'N/A';
      let planExpiryDate = 'N/A';
      if (matchedPlan?.createdAt && matchedPlan.durationDays) {
        const start = new Date(matchedPlan.createdAt);
        const end = new Date(start.getTime() + (matchedPlan.durationDays - 1) * 86400000);
        planCreatedAt = start.toLocaleDateString();
        planExpiryDate = end.toLocaleDateString();
      }

      // Bill info
      const matchedBill = bills.find(bill =>
        bill.ownerPhone === property.phoneNumber || String(bill.rentId) === String(property.rentId)
      );

      let adminName = 'N/A';
      let billDate = 'N/A';
      let validity = 'N/A';
      let billExpiryDate = 'N/A';

      if (matchedBill) {
        adminName = matchedBill.adminName || 'N/A';
        billDate = matchedBill.billDate || 'N/A';
        validity = matchedBill.validity || 'N/A';

        if (billDate !== 'N/A' && validity !== 'N/A') {
          const billStart = new Date(billDate);
          const billEnd = new Date(billStart.getTime() + (validity - 1) * 86400000);
          billExpiryDate = billEnd.toLocaleDateString();
        }
      }

      // Follow-up
      const propertyFollowUps = followups
        .filter(fu => String(fu.rentId) === String(property.rentId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const followUpAdminName = propertyFollowUps.length > 0
        ? propertyFollowUps[0]?.adminName || 'Unknown Admin'
        : 'N/A';

      // Payment info
      const matchedPayment = payments.find(payment =>
        payment.phone === property.phoneNumber &&
        String(payment.rentId) === String(property.rentId)
      );

      return {
        ...property,
        required: isComplete ? 'yes' : 'no',
        planName: matchedPlan?.name || 'N/A',
        planCreatedAt,
        planExpiryDate,
        packageType: matchedPlan?.packageType || 'N/A',
        planDuration: matchedPlan?.durationDays || 'N/A',
        adminName,
        billDate,
        validity,
        billExpiryDate,
        followUpAdminName,
        setRentId: property.setRentId || false,
        assignedPhoneNumber: property.setRentId ? property.assignedPhoneNumber || null : null,
        setRentIdAssignedAt: property.setRentIdAssignedAt || null,
        paymentData: matchedPayment || null
      };
    });

    // ✅ Return only fully completed properties
    const filteredProperties = processedProperties.filter(p => p.required === 'yes');

    res.status(200).json({
      message: 'Active rent properties with complete info fetched successfully!',
      users: filteredProperties
    });
  } catch (error) {
    console.error("Error in /fetch-active-rent-users-on-demand:", error);
    res.status(500).json({
      message: 'Error fetching rent user details.',
      error: error.message
    });
  }
});


router.get("/fetchd-properties", async (req, res) => {
  try {
    const featuredProperties = await AddModel.find({ featureStatus: "yes" });

    res.status(200).json({
      message: "Featured properties fetched successfully!",
      properties: featuredProperties,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured properties.", error });
  }
});


router.get("/fetch-featured-properties-on-demand-rent", async (req, res) => {
  try {
    const featuredPropertiesRaw = await AddModel.find({
      featureStatus: "yes",
      status: "active", // ✅ Only active properties
      ...baseFilter(req.query.base)
    }).lean();

    const featuredProperties = featuredPropertiesRaw.map((property) => {
      // ✅ Replace rentalAmount with "On Demand" if flagged
      if (property.onDemand) {
        property.rentalAmount = "On Demand";
      }
      return {
        ...property,
        rentalAmount: property.rentalAmount,
        rentId: property.rentId || null // Include rentId explicitly if needed
      };
    });

    res.status(200).json({
      message: "Featured active rental properties fetched successfully!",
      properties: featuredProperties,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured rental properties.", error });
  }
});

router.get("/fetch-Pudhucherry-properties-on-demand-rent", async (req, res) => {
  try {
    // ✅ Match active properties in Puducherry with propertyMode: Rent
    const properties = await AddModel.find({
      status: "active",
      state: {
        $regex: /^(puducherry|pudhucherry|pondicherry|pondicherry town|pudhucherry town|pondi)$/i
      }
    }).lean();

    if (!properties.length) {
      return res.status(404).json({
        success: false,
        message: "No active rent properties found in Puducherry."
      });
    }

    // ✅ Process properties: remove price/ppcId and apply rentalAmount / rentId
    const processedData = properties.map((property) => {
      const {
       
        ...rest
      } = property;

      return {
        ...rest,
        rentId: property.rentId || null,
        rentalAmount: property.onDemand ? "On Demand" : property.rentalAmount || null,
      };
    });

    res.status(200).json({
      success: true,
      message: "Active Puducherry rent properties with on-demand pricing fetched successfully.",
      data: processedData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching Puducherry rent properties.",
      error: error.message,
    });
  }
});

router.get('/uploads-count', async (req, res) => {
  const { rentId } = req.query; // Use query params to pass rentId

  // Ensure `rentId` is provided
  if (!rentId) {
    return res.status(400).json({ message: 'Rent ID (rentId) is required' });
  }

  try {
    // Find the property by `rentId`
    const property = await AddModel.findOne({ rentId });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Count the number of uploaded images
    const uploadedImagesCount = property.photos ? property.photos.length : 0;

    return res.status(200).json({
      message: 'Uploaded images count retrieved successfully',
      uploadedImagesCount,
      uploadedImages: property.photos || [], // Return the array of uploaded image filenames
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// Fetch properties from all Puducherry variants (case-insensitive)
router.get("/fetch-Pudhucherry-properties-rent", async (req, res) => {
  try {
    const pondicherryData = await AddModel.find({
      state: {
        $regex: /^(puducherry|pudhucherry|pondicherry|pondicherry town|pudhucherry town|pondi)$/i
      }
    });

    if (pondicherryData.length === 0) {
      return res.status(404).json({ success: false, message: "No data found for Puducherry" });
    }

    res.json({ success: true, data: pondicherryData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});



router.get('/zero-view-properties', async (req, res) => {
  try {
      const properties = await AddModel.find({ views: { $eq: 0 } });

      if (properties.length === 0) {
          return res.status(404).json({ message: 'No properties with zero views found' });
      }

      return res.status(200).json({
          message: 'Properties with zero views retrieved successfully',
          properties,
      });
  } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


router.get('/zero-view-properties-on-demand-rent', async (req, res) => {
  try {
    // 🔍 Find active properties with 0 views
    const properties = await AddModel.find({
      views: 0,
      status: "active"
    }).lean();

    if (!properties.length) {
      return res.status(404).json({
        success: false,
        message: 'No active properties with zero views found',
      });
    }

    // 🔧 Process: remove ppcId and price, apply rentId and rentalAmount
    const processedProperties = properties.map((property) => {
      const {
     
        ...rest
      } = property;

      return {
        ...rest, 
        rentId: property.rentId || null,
        rentalAmount: property.onDemand ? "On Demand" : property.rentalAmount || null,
      };
    }); 

    return res.status(200).json({
      success: true,
      message: 'Active properties with zero views retrieved successfully',
      properties: processedProperties,
    });
  } catch (error) {
    console.error("Error fetching zero-view properties:", error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

router.get("/property/:rentId", async (req, res) => {
  try {
    const { rentId } = req.params;
    const property = await AddModel.findOne({ rentId });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


router.get('/fetch-data-on-demand-rent', async (req, res) => {
  const { phoneNumber, rentId } = req.query;

  if (!phoneNumber && !rentId) {
    return res.status(400).json({ message: 'Either phoneNumber or rentId is required.' });
  }

  try {
    const normalizedPhoneNumber = phoneNumber
      ? phoneNumber.replace(/[\s-]/g, '').replace(/^(\+91|91|0)/, '').trim()
      : null;

    const query = {};
    if (normalizedPhoneNumber) query.phoneNumber = new RegExp(normalizedPhoneNumber + '$');
    if (rentId) query.rentId = Number(rentId);

    const property = await AddModel.findOne(query).lean(); // .lean() for raw JSON

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // 🔧 Remove ppcId and price
    const {
      ...rest
    } = property;

    // 🔁 Replace rentalAmount with "On Demand" if applicable
    const rentalAmount = property.onDemand ? "On Demand" : property.rentalAmount || null;

    res.status(200).json({
      message: 'User data fetched successfully!',
      user: {
        ...rest,
        rentId: property.rentId || null,
        rentalAmount,
      }
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});



// router.post("/user-view-property-rent", async (req, res) => {
//   try {
//     const { phoneNumber, rentId } = req.body;

//     if (!phoneNumber || !rentId) {
//       return res.status(400).json({ message: "Phone number and Rent ID are required" });
//     }

//     const normalizedPhoneNumber = phoneNumber.replace(/\s+/g, "").replace(/\+/g, "");

//     const userPlan = await PricingPlans.findOne({ phoneNumber: normalizedPhoneNumber });
//     const planName = userPlan?.name?.toUpperCase() || "FREE";
//     const expiryDate = userPlan?.expireDate || null;

//     const planLimit = await PlanLimit.findOne({ planName });
//     const planViewLimitPerDay = planLimit?.planViewLimitPerDay || 30;

//     let userViews = await UserViewsModel.findOne({ phoneNumber: normalizedPhoneNumber });

//     const DEFAULT_VIEW_LIMIT = 30;
//     const effectiveViewLimit = userViews?.viewLimitPerDay ?? planViewLimitPerDay ?? DEFAULT_VIEW_LIMIT;

//     const today = new Date();
//     const startOfToday = new Date(today.setHours(0, 0, 0, 0));

//     let dailyViewsCount = 0;
//     let lastViewDate = null;
//     let viewedProperties = [];
//     let remainingViews = effectiveViewLimit;
//     let canViewToday = true;

//     if (!userViews) {
//       userViews = new UserViewsModel({
//         phoneNumber: normalizedPhoneNumber,
//         dailyViewsCount: 0,
//         lastViewDate: new Date(0),
//         viewedProperties: [],
//         viewLimitPerDay: effectiveViewLimit,
//       });
//     } else {
//       lastViewDate = new Date(userViews.lastViewDate || 0);

//       if (lastViewDate < startOfToday) {
//         userViews.dailyViewsCount = 0;
//         userViews.lastViewDate = new Date();
//         userViews.viewedProperties = [];
//       }

//       dailyViewsCount = userViews.dailyViewsCount;
//       remainingViews = effectiveViewLimit - dailyViewsCount;
//       viewedProperties = userViews.viewedProperties;

//       if (dailyViewsCount >= planViewLimitPerDay) {
//         canViewToday = false;
//         return res.status(429).json({
//           message: `Your plan limit (${planViewLimitPerDay}) is complete for today. Try again tomorrow.`,
//           data: {
//             phoneNumber: normalizedPhoneNumber,
//             planName,
//             expiryDate,
//             planViewLimitPerDay,
//             viewLimitPerDay: effectiveViewLimit,
//             dailyViewsCount,
//             remainingViews,
//             lastViewDate,
//             viewedProperties,
//             canViewToday,
//           },
//         });
//       }

//       const alreadyViewedToday = viewedProperties.some((view) => {
//         return view.rentId === rentId && new Date(view.viewedAt) >= startOfToday;
//       });

//       if (alreadyViewedToday) {
//         return res.status(409).json({ message: "You already viewed this property today." });
//       }
//     }

//     // ✅ Record view
//     userViews.viewedProperties.push({
//       rentId,
//       viewerPhoneNumber: normalizedPhoneNumber,
//       viewedAt: new Date(),
//     });

//     userViews.dailyViewsCount += 1;
//     await userViews.save();

//     // ✅ Send notification
//     try {
//       const property = await AddModel.findOne({ rentId });

//       if (
//         property &&
//         property.propertyMode &&
//         property.propertyType &&
//         property.rentalAmount
//       ) {
//         await NotificationUser.create({
//           recipientPhoneNumber: normalizedPhoneNumber,
//           senderPhoneNumber: normalizedPhoneNumber,
//           userPhoneNumber: normalizedPhoneNumber,
//           rentId: rentId,
//           type: "property-view",
//           message: `You viewed rental property (${rentId}) successfully.`,
//           createdAt: new Date()
//         });
//       }
//     } catch (notifErr) {
//       console.error("Notification error:", notifErr.message);
//     }

//     return res.status(200).json({
//       message: "Rental property view recorded successfully.",
//       data: {
//         phoneNumber: normalizedPhoneNumber,
//         planName,
//         expiryDate,
//         planViewLimitPerDay,
//         viewLimitPerDay: effectiveViewLimit,
//         dailyViewsCount: userViews.dailyViewsCount,
//         remainingViews: effectiveViewLimit - userViews.dailyViewsCount,
//         lastViewDate: userViews.lastViewDate,
//         viewedProperties: userViews.viewedProperties.filter((view) => {
//           return new Date(view.viewedAt) >= startOfToday;
//         }),
//         canViewToday,
//       },
//     });

//   } catch (error) {
//     console.error("Error processing user view limits:", error);
//     return res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// });






router.post("/user-view-property-rent", async (req, res) => {
  try {
    const { phoneNumber, rentId } = req.body;

    if (!phoneNumber || !rentId) {
      return res.status(400).json({ message: "Phone number and Rent ID are required" });
    }

    const normalizedPhoneNumber = phoneNumber.replace(/\s+/g, "").replace(/\+/g, "");

    // Get user plan
    const userPlan = await PricingPlans.findOne({ phoneNumber: normalizedPhoneNumber });
    const planName = userPlan?.name?.toUpperCase() || "FREE";
    const expiryDate = userPlan?.expireDate || null;

    // Get plan limits
    const planLimit = await PlanLimit.findOne({ planName });
    const planViewLimitPerDay = planLimit?.planViewLimitPerDay || 30;
    const DEFAULT_VIEW_LIMIT = 30;
    const effectiveViewLimit = planViewLimitPerDay ?? DEFAULT_VIEW_LIMIT;

    // Get property details
    const property = await AddModel.findOne({ rentId });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    const propertyOwnerPhoneNumber = property.phoneNumber || "";
    const photos = Array.isArray(property.photos) ? property.photos[0] || "" : property.photos || "";

    // Dates
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));

    // Fetch or create userViews record
    let userViews = await UserViewsModel.findOne({ phoneNumber: normalizedPhoneNumber });

    if (!userViews) {
      userViews = new UserViewsModel({
        phoneNumber: normalizedPhoneNumber,
        planName,
        dailyViewsCount: 0,
        lastViewDate: new Date(),
        viewedProperties: [],
        viewLimitPerDay: effectiveViewLimit,
      });
    } else {
      const lastViewDate = new Date(userViews.lastViewDate || 0);

      if (lastViewDate < startOfToday) {
        userViews.dailyViewsCount = 0;
        userViews.viewedProperties = [];
        userViews.lastViewDate = new Date();
      }
    }

    // Clean views to only today’s
    userViews.viewedProperties = userViews.viewedProperties.filter(view =>
      new Date(view.viewedAt) >= startOfToday
    );

    const existingView = userViews.viewedProperties.find(view => view.rentId === rentId);

    if (existingView) {
      // Update timestamp and extra fields
      existingView.viewedAt = new Date();
      existingView.propertyOwnerPhoneNumber = propertyOwnerPhoneNumber;
      existingView.photos = photos;
    } else {
      // Limit check
      if (userViews.dailyViewsCount >= effectiveViewLimit) {
        return res.status(429).json({
          message: `Your plan limit (${effectiveViewLimit}) is complete for today. Try again tomorrow.`,
          data: {
            phoneNumber: normalizedPhoneNumber,
            planName,
            expiryDate,
            planViewLimitPerDay: effectiveViewLimit,
            viewLimitPerDay: effectiveViewLimit,
            dailyViewsCount: userViews.dailyViewsCount,
            remainingViews: 0,
            lastViewDate: userViews.lastViewDate,
            viewedProperties: userViews.viewedProperties,
            canViewToday: false,
          },
        });
      }

      // Add new view entry
      userViews.viewedProperties.push({
        rentId,
        viewerPhoneNumber: normalizedPhoneNumber,
        propertyOwnerPhoneNumber,
        viewedAt: new Date(),
        photos,
      });

      userViews.dailyViewsCount += 1;
    }

    await userViews.save();

    // Send Notification
    try {
      if (
        property.propertyMode &&
        property.propertyType &&
        property.rentalAmount
      ) {
        await NotificationUser.create({
          recipientPhoneNumber: normalizedPhoneNumber,
          senderPhoneNumber: normalizedPhoneNumber,
          userPhoneNumber: normalizedPhoneNumber,
          rentId: rentId,
          type: "property-view",
          message: `You viewed rental property (${rentId}) successfully.`,
          createdAt: new Date(),
        });
      }
      // The owner-facing "someone viewed your property" notification lives in
      // PropertyViewNotify/ instead, so it does not depend on this route (whose
      // plan-limit gate is currently switched off at the call site).
    } catch (notifErr) {
      console.error("Notification error:", notifErr.message);
    }

    // Prepare unique views
    const uniqueViewsMap = new Map();
    userViews.viewedProperties.forEach(view => {
      if (
        !uniqueViewsMap.has(view.rentId) ||
        new Date(uniqueViewsMap.get(view.rentId).viewedAt) < new Date(view.viewedAt)
      ) {
        uniqueViewsMap.set(view.rentId, view);
      }
    });
    const uniqueViewedProperties = Array.from(uniqueViewsMap.values());

    return res.status(200).json({
      message: "Rental property view recorded successfully.",
      data: {
        phoneNumber: normalizedPhoneNumber,
        planName,
        expiryDate,
        planViewLimitPerDay: effectiveViewLimit,
        viewLimitPerDay: effectiveViewLimit,
        dailyViewsCount: uniqueViewedProperties.length,
        remainingViews: effectiveViewLimit - uniqueViewedProperties.length,
        lastViewDate: userViews.lastViewDate,
        viewedProperties: uniqueViewedProperties,
        canViewToday: true,
      },
    });
  } catch (error) {
    console.error("Error processing user view limits:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});



router.get("/get-user-today-viewed-counts", async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const normalizedPhoneNumber = phoneNumber.replace(/\s+/g, "").replace(/\+/g, "");

    const userViews = await UserViewsModel.findOne({ phoneNumber: normalizedPhoneNumber });

    if (!userViews) {
      return res.status(404).json({ message: "User not found" });
    }

    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));

    const todayViews = userViews.viewedProperties.filter(view =>
      new Date(view.viewedAt) >= startOfToday
    );

    const todayContacts = userViews.contactedProperties.filter(contact =>
      new Date(contact.contactedAt || contact.createdAt) >= startOfToday
    );

    return res.status(200).json({
      message: "Today's counts fetched successfully",
      data: {
        phoneNumber: normalizedPhoneNumber,
        viewsToday: todayViews.length,
        contactsToday: todayContacts.length,
      },
    });
  } catch (error) {
    console.error("Error in /get-user-today-counts:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/get-user-today-viewed-details", async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const normalizedPhoneNumber = phoneNumber.replace(/\s+/g, "").replace(/\+/g, "");

    const userViews = await UserViewsModel.findOne({ phoneNumber: normalizedPhoneNumber });

    if (!userViews) {
      return res.status(404).json({ message: "User not found" });
    }

    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));

    const todayViewedProperties = userViews.viewedProperties.filter(view =>
      new Date(view.viewedAt) >= startOfToday
    );

    const todayContactedProperties = userViews.contactedProperties.filter(contact =>
      new Date(contact.contactedAt || contact.createdAt) >= startOfToday
    );

    return res.status(200).json({
      message: "Today's details fetched successfully",
      data: {
        phoneNumber: normalizedPhoneNumber,
        viewedProperties: todayViewedProperties,
        contactedProperties: todayContactedProperties,
      },
    });
  } catch (error) {
    console.error("Error in /get-user-today-details:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


router.get("/get-user-viewed-last-10-days-data", async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const normalizedPhoneNumber = phoneNumber.replace(/\s+/g, "").replace(/\+/g, "");
    const userViews = await UserViewsModel.findOne({ phoneNumber: normalizedPhoneNumber });

    if (!userViews) {
      return res.status(404).json({ message: "User not found" });
    }

    const now = new Date();
    const tenDaysAgo = new Date(now);
    tenDaysAgo.setDate(now.getDate() - 9); // Include today

    const startOfDay = (date) => new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = (date) => new Date(date.setHours(23, 59, 59, 999));

    // Create date map for counts
    const viewCountsByDay = {};
    const contactCountsByDay = {};

    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const key = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      viewCountsByDay[key] = 0;
      contactCountsByDay[key] = 0;
    }

    // Filter and group viewedProperties
    const filteredViews = userViews.viewedProperties.filter((view) => {
      const viewDate = new Date(view.viewedAt);
      return viewDate >= tenDaysAgo && viewDate <= now;
    });

    filteredViews.forEach((view) => {
      const key = new Date(view.viewedAt).toISOString().split("T")[0];
      if (viewCountsByDay[key] !== undefined) viewCountsByDay[key]++;
    });

    // Filter and group contactedProperties
    const filteredContacts = userViews.contactedProperties.filter((contact) => {
      const contactDate = new Date(contact.contactedAt || contact.createdAt);
      return contactDate >= tenDaysAgo && contactDate <= now;
    });

    filteredContacts.forEach((contact) => {
      const key = new Date(contact.contactedAt || contact.createdAt).toISOString().split("T")[0];
      if (contactCountsByDay[key] !== undefined) contactCountsByDay[key]++;
    });

    return res.status(200).json({
      message: "Last 10 days data fetched successfully",
      data: {
        phoneNumber: normalizedPhoneNumber,
        dailyViewCounts: viewCountsByDay,
        dailyContactCounts: contactCountsByDay,
        viewedProperties: filteredViews,
        contactedProperties: filteredContacts,
      },
    });

  } catch (error) {
    console.error("Error in /get-user-last-10-days-data:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});




router.get("/user-viewed-properties-rent", async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "phoneNumber is required" });
    }

    const normalizedPhoneNumber = phoneNumber.replace(/\s+/g, "").replace(/\+/g, "");

    const userViews = await UserViewsModel.findOne({ phoneNumber: normalizedPhoneNumber });

    if (!userViews || userViews.viewedProperties.length === 0) {
      return res.status(404).json({ message: "No viewed properties found" });
    }

    // Sort views by viewedAt descending
    const sortedViews = userViews.viewedProperties.sort(
      (a, b) => new Date(b.viewedAt) - new Date(a.viewedAt)
    );

    // Deduplicate by rentId (instead of ppcId)
    const seen = new Set();
    const uniqueViews = sortedViews.filter((view) => {
      if (!seen.has(view.rentId)) {
        seen.add(view.rentId);
        return true;
      }
      return false;
    });

    // Enrich views with property details
    const enrichedViews = await Promise.all(
      uniqueViews.map(async (view) => {
        const property = await AddModel.findOne({ rentId: view.rentId }).lean();
        return {
          ...view.toObject(),
          propertyDetails: property || null,
        };
      })
    );

    const DEFAULT_VIEW_LIMIT = 30;
    const viewLimitPerDay = userViews.viewLimitPerDay || DEFAULT_VIEW_LIMIT;

    res.status(200).json({
      dailyViewsCount: userViews.dailyViewsCount || 0,
      lastViewDate: userViews.lastViewDate || null,
      viewLimitPerDay,
      viewedProperties: enrichedViews,
    });
  } catch (error) {
    console.error("Error fetching viewed properties:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});



router.get('/fetch-all-datas', async (req, res) => {
  try {
    const users = await AddModel.find({ ...baseFilter(req.query.base) });
    res.status(200).json({
      success: true,                
      data: users,                   
      message: 'All user data fetched successfully!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching all user details.',
      error
    });
  }
});




// router.get('/fetch-status-with-payment-rent', async (req, res) => {
//   const { phoneNumber } = req.query;

//   if (!phoneNumber) {
//     return res.status(400).json({ message: 'Phone number is required.' });
//   }

//   try {
//     const normalizedPhoneNumber = phoneNumber
//       .replace(/[\s-]/g, '')
//       .replace(/^(\+91|91|0)/, '')
//       .trim();

//     const propertyQuery = {
//       phoneNumber: new RegExp(normalizedPhoneNumber + '$'),
//       status: {
//         $in: [
//           'incomplete',
//           'complete',
//           'pending',
//           'active',
//           'sendInterest',
//           'soldOut',
//           'reportProperties',
//           'needHelp',
//           'contact',
//           'favorite'
//         ]
//       }
//     };

//     const properties = await AddModel.find(propertyQuery);

//     if (!properties.length) {
//       return res.status(404).json({ message: 'No properties found for this phone number.' });
//     }

//     const payments = await PaymentPayU.find().sort({ createdAt: -1 });

//     const statusMap = {};
//     for (let payment of payments) {
//       if (!statusMap[payment.rentId]) {
//         statusMap[payment.rentId] = payment.payustatususer?.toLowerCase() || 'pay now';
//       }
//     }

//     // const merged = properties.map((prop) => {
//     //   const payustatususer = statusMap[prop.rentId] || 'pay now';
//     //   return {
//     //     rentId: prop.rentId,
//     //     phoneNumber: prop.phoneNumber,
//     //     propertyMode: prop.propertyMode,
//     //     propertyType: prop.propertyType,
//     //     rentalAmount: prop.rentalAmount,
//     //     ownership: prop.ownership,
//     //     totalArea: prop.totalArea,
//     //     areaUnit: prop.areaUnit,
//     //     postedBy: prop.postedBy,
//     //     salesType: prop.salesType,
//     //     status: prop.status,
//     //     createdAt: prop.createdAt,
//     //     updatedAt: prop.updatedAt,
//     //     payustatususer,
//     //   };
//     // });

//    const merged = properties.map((prop) => {
//   const payustatususer = statusMap[prop.rentId] || 'pay now';
//   return {
//     ...prop._doc, // includes all AddModel fields
//     payustatususer,
//   };
// });

//     return res.status(200).json({
//       message: 'Properties with PayU status fetched successfully!',
//       data: merged,
//     });
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// });


// Delete property endpoint using rentId

router.get('/fetch-status-with-payment-rent', async (req, res) => {
  const { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required.' });
  }

  try {
    // Normalize phone number
    const normalizedPhoneNumber = phoneNumber
      .replace(/[\s-]/g, '')
      .replace(/^(\+91|91|0)/, '')
      .trim();

    // Step 1: Get all properties for that phoneNumber
    const propertyQuery = {
      phoneNumber: new RegExp(normalizedPhoneNumber + '$'),
      status: {
        $in: [
          'incomplete',
          'complete',
          'pending',
          'active',
          'sendInterest',
          'soldOut',
          'reportProperties',
          'needHelp',
          'contact',
          'favorite'
        ]
      }
    };

    const properties = await AddModel.find(propertyQuery);

    if (!properties.length) {
      return res.status(404).json({ message: 'No properties found for this phone number.' });
    }

    // Step 2: Get latest PayU status map per ppcId
    const payments = await PaymentPayU.find().sort({ createdAt: -1 });

    const statusMap = {};
    for (let payment of payments) {
      if (!statusMap[payment.rentId]) {
        statusMap[payment.rentId] = payment.payustatususer.toLowerCase();
      }
    }

    // Step 3: Merge PayU status and display status
    const merged = properties.map((prop) => {
      const rawPayuStatus = statusMap[prop.rentId] || 'pay now';
      let paymentDisplayStatus = '';

      switch (rawPayuStatus) {
        case 'pay now':
        case 'pay later':
          paymentDisplayStatus = 'Payment Pending';
          break;
        case 'pay failed':
          paymentDisplayStatus = 'Payment Failed';
          break;
        case 'paid':
          paymentDisplayStatus = 'Payment Paid';
          break;
        default:
          paymentDisplayStatus = 'Unknown';
      }

      let displayStatus = '';
      switch (prop.status) {
        case 'active':
          displayStatus = 'Approved';
          break;
        case 'complete':
          displayStatus = 'PreApproved';
          break;
           case 'incomplete':
          displayStatus = 'Pending';
          break;
           case 'pending':
          displayStatus = 'Waiting Approved';
          break;
        default:
          displayStatus = prop.status;
      }

      return {
        ...prop._doc,
        payustatususer: rawPayuStatus,
        paymentDisplayStatus,
        displayStatus,
      };
    });

    return res.status(200).json({
      message: 'Properties with PayU status fetched successfully!',
      data: merged,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


router.post('/delete-property-rent', async (req, res) => {
  const { rentId, phoneNumber } = req.body;

  if (!rentId || !phoneNumber) {
    return res.status(400).json({ message: 'rentId and phoneNumber are required.' });
  }

  try {
    // Find the property by rentId
    const property = await AddModel.findOne({ rentId: Number(rentId) });

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Remove user's interest request if exists
    const userInterestIndex = property.interestRequests.findIndex(
      (request) => request.phoneNumber === phoneNumber
    );

    if (userInterestIndex !== -1) {
      property.interestRequests.splice(userInterestIndex, 1); // Remove the user's interest
    }

    // Set status to 'delete' and track who deleted
    property.status = 'delete';
    property.deletedBy = 'User';

    await property.save();

    // Remove ppcId and price before sending response (if they exist in schema)
    const { ppcId, price, ...cleanedProperty } = property.toObject();

    // Include rentalAmount explicitly
    const responseData = {
      ...cleanedProperty,
      rentId: property.rentId,
      rentalAmount: property.rentalAmount,
    };

    res.status(200).json({
      message: 'Property removed successfully.',
      property: responseData,
    });

  } catch (error) {
    console.error('Error removing property:', error);
    res.status(500).json({ message: 'Error removing property.', error: error.message });
  }
});





// Undo delete property by rentId
router.post('/undo-delete-rent', async (req, res) => {
  const { rentId, phoneNumber } = req.body;

  if (!rentId || !phoneNumber) {
    return res.status(400).json({ message: 'rentId and phoneNumber are required.' });
  }

  try {
    // Find the property by rentId
    const property = await AddModel.findOne({ rentId: Number(rentId) });

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Revert status to 'incomplete'
    property.status = 'incomplete';

    // Add the phone number to interestRequests if not already present
    if (!property.interestRequests.some(request => request.phoneNumber === phoneNumber)) {
      property.interestRequests.push({ phoneNumber, date: new Date() });
    }

    await property.save();

    // Remove ppcId and price before sending response (if needed)
    const { ppcId, price, ...cleanedProperty } = property.toObject();

    // Send updated property as response
    const responseData = {
      ...cleanedProperty,
      rentId: property.rentId,
      rentalAmount: property.rentalAmount,
    };

    res.status(200).json({
      message: 'Property status reverted successfully!',
      property: responseData,
    });

  } catch (error) {
    console.error('Error undoing property status:', error);
    res.status(500).json({ message: 'Error undoing property status.', error: error.message });
  }
});


// Fetch all user-deleted properties (no phoneNumber filter)
// router.get('/fetch-delete-status-rent', async (req, res) => {
//   try {
//     const deletedProperties = await AddModel.find({
//       status: 'delete',
//       deletedBy: 'User' // Optional: only fetch those deleted by users
//     }).lean();

//     if (!deletedProperties.length) {
//       return res.status(404).json({ message: 'No deleted properties found.' });
//     }

//     const response = deletedProperties.map(({ ppcId, price, ...rest }) => ({
//       ...rest,
//       rentId: rest.rentId,
//       rentalAmount: rest.rentalAmount,
//     }));

//     res.status(200).json({
//       message: 'Deleted properties fetched successfully!',
//       users: response,
//     });

//   } catch (error) {
//     res.status(500).json({
//       message: 'Error fetching deleted properties.',
//       error: error.message || error
//     });
//   }
// });


router.get('/fetch-delete-status-rent', async (req, res) => {
  const { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required.' });
  }

  try {
    // Normalize phone number
    const normalizedPhoneNumber = phoneNumber
      .replace(/[\s-]/g, '')           // remove spaces and hyphens
      .replace(/^(\+91|91|0)/, '')     // remove country code/prefix
      .trim();

    // Query for deleted properties
    const query = {
      phoneNumber: new RegExp(`(\\+91)?${normalizedPhoneNumber}$`),
      status: 'delete',
    };

    const users = await AddModel.find(query);

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No deleted properties found.' });
    }

    // Prepare final response
    const updatedUsers = users.map(user => ({
      ...user._doc,
      phoneNumber: user.phoneNumber.replace(/^\+91/, ''), // Remove +91 from display
      displayStatus: 'Removed'                            // Custom display label
    }));

    return res.status(200).json({
      message: 'Deleted properties fetched successfully!',
      users: updatedUsers
    });

  } catch (error) {
    console.error('Fetch delete status error:', error);
    return res.status(500).json({
      message: 'Error fetching deleted properties.',
      error: error.message || error
    });
  }
});


// GET /get-location-applied-properties
router.get("/get-location-applied-properties-rent", async (req, res) => {
  try {
    const properties = await AddModel.find({
      locationCoordinates: {
        $regex: /°/, // matches anything containing "°"
        $ne: ""
      }
    });

    res.status(200).json({ properties });
  } catch (err) {
    console.error("Error fetching location-applied properties:", err);
    res.status(500).json({ message: "Server error fetching properties." });
  }
});


//on demand codes

router.put('/admin/set-on-demand-rent', async (req, res) => {
  try {
    const { rentId, onDemand, adminName } = req.body;

    if (!rentId) {
      return res.status(400).json({ message: 'rentId is required' });
    }

    const property = await AddModel.findOne({ rentId });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.onDemand = onDemand;
    property.onDemandSetBy = {
      name: adminName || 'Unknown',
      date: new Date()
    };

    await property.save();

    res.status(200).json({ message: `Rental amount is now ${onDemand ? 'On Demand' : 'Visible'}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/rent/property-by-rentId', async (req, res) => {
  try {
    const { rentId } = req.query;

    if (!rentId) {
      return res.status(400).json({ message: 'rentId is required' });
    }

    const property = await AddModel.findOne({ rentId: Number(rentId) });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const response = {
      rentId: property.rentId,
      onDemand: property.onDemand,
      rentalAmount: property.onDemand ? "On Demand" : property.rentalAmount,
      status: property.status,
      ownerName: property.ownerName
    };

    res.status(200).json({ property: response });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/get-on-demand-properties-rent', async (req, res) => {
  try {
    const properties = await AddModel.find({ onDemand: true }).lean();

    if (properties.length === 0) {
      return res.status(404).json({ message: 'No properties marked as On Demand' });
    }

    const processedProperties = properties.map(property => ({
      ...property,
      rentalAmount: "On Demand"
    }));

    res.status(200).json({
      success: true,
      message: 'Properties with On Demand rental fetched successfully',
      properties: processedProperties,
    });
  } catch (error) {
    console.error('Error fetching On Demand properties:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


router.get('/zero-view-properties-count-rent', async (req, res) => {
  try {
    const count = await AddModel.countDocuments({ views: { $eq: 0 } });

    res.status(200).json({
      message: 'Zero viewed property count fetched successfully',
      count,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching zero viewed property count',
      error: error.message,
    });
  }
});




router.get('/zero-view-properties-rent', async (req, res) => {
  try {
      const properties = await AddModel.find({ views: { $eq: 0 } });

      if (properties.length === 0) {
          return res.status(404).json({ message: 'No properties with zero views found' });
      }

      return res.status(200).json({
          message: 'Properties with zero views retrieved successfully',
          properties,
      });
  } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});



router.get("/user-views-count-rent", async (req, res) => {
  try {
    // Aggregate total number of views from all user documents
    const result = await UserViewsModel.aggregate([
      { $unwind: "$viewedProperties" },
      { $count: "totalViews" }
    ]);

    const totalViews = result[0]?.totalViews || 0;

    res.status(200).json({
      message: "Total user property views fetched successfully",
      count: totalViews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user views count",
      error: error.message,
    });
  }
});


// GET: Count of pending properties
router.get("/pending-properties-count-rent", async (req, res) => {
  try {
    // Count documents where status is 'pending' or 'incomplete'
    const count = await AddModel.countDocuments({
      status: { $in: ["pending","complete"] } // <-- Adjust this based on your business logic
    });

    res.status(200).json({ pendingProperties: count });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/deleted-properties-count-rent', async (req, res) => {
  try {
    // Count the documents with status "delete"
    const count = await AddModel.countDocuments({ status: "delete" });

    // Check if the count is being returned as expected
    if (count >= 0) {
      res.json({ deletedProperties: count });
    } else {
      res.status(404).json({ message: "No deleted properties found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/active-properties-count-rent', async (req, res) => {
  try {
    // Count documents with status "active"
    const count = await AddModel.countDocuments({ status: "active" });

    if (count >= 0) {
      res.json({ activeProperties: count });
    } else {
      res.status(404).json({ message: "No active properties found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/all-properties-count-rent', async (req, res) => {
  try {
      const count = await AddModel.countDocuments();
      res.json({ totalProperties: count });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


// GET: Full property status breakdown in a single aggregation.
// Returns every bucket so the dashboard cards always reconcile to `total`
// (total = approved + deleted + pending + incomplete + expired + soldOut + other).
router.get('/property-status-breakdown-rent', async (req, res) => {
  try {
    const grouped = await AddModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Build a status -> count map and the grand total in one pass.
    const byStatus = {};
    let total = 0;
    grouped.forEach(({ _id, count }) => {
      byStatus[_id || "unknown"] = count;
      total += count;
    });

    const sumOf = (...statuses) =>
      statuses.reduce((sum, s) => sum + (byStatus[s] || 0), 0);

    const approved   = sumOf("active");
    const deleted    = sumOf("delete");
    const pending    = sumOf("pending", "complete"); // awaiting admin approval
    const incomplete = sumOf("incomplete");
    const expired    = sumOf("expired");
    const soldOut    = sumOf("soldOut");

    // Anything left over (interaction-only statuses, unknown values, etc.)
    // so the breakdown always adds up to the total.
    const accounted = approved + deleted + pending + incomplete + expired + soldOut;
    const other = Math.max(total - accounted, 0);

    res.status(200).json({
      total,
      approved,
      deleted,
      pending,
      incomplete,
      expired,
      soldOut,
      other,
      byStatus, // raw per-status counts for transparency
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




  router.get('/total-help-request-count-rent', async (req, res) => {
    try {
      const result = await AddModel.aggregate([
        {
          $project: {
            helpRequestCount: { $size: { $ifNull: ["$helpRequests", []] } }
          }
        },
        {
          $group: {
            _id: null,
            totalHelpRequests: { $sum: "$helpRequestCount" }
          }
        }
      ]);
  
      const totalHelpRequests = result[0]?.totalHelpRequests || 0;
  
      res.status(200).json({ totalHelpRequests });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to get total help request count',
        error: error.message
      });
    }
  });
  



// GET /properties/status-counts
router.get('/properties/status-counts-rent', async (req, res) => {
  try {
    const allStatuses = ['complete', 'incomplete', 'active'];

    // Step 1: Count by individual statuses
    const statusCounts = await Promise.all(
      allStatuses.map(async (status) => {
        const count = await AddModel.countDocuments({ status });
        return { status, count };
      })
    );

    // Step 2: Count of all properties (regardless of status)
    const totalCount = await AddModel.countDocuments();

    // Step 3: Format response
    const response = {
      totalCount,
      counts: statusCounts.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
      }, {})
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching status counts:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// router.get('/fetch-alls-datas-all-rent', async (req, res) => {
//   try {
//     const [properties, plans, bills, followups, payments, otpVerifiedUsers, directVerifiedUsers] = await Promise.all([
//       AddModel.find(),
//       PricingPlans.find(),
//       Bill.find(),
//       FollowUp.find(),
//       PaymentPayU.find(),
//       UserLogin.find({ otpStatus: 'verified' }),
//       UserLogin.find({ directVerified: true })
//     ]);

//     const userStatusMap = new Map();
//     otpVerifiedUsers.forEach(user => userStatusMap.set(user.phone, 'verified'));
//     directVerifiedUsers.forEach(user => {
//       if (!userStatusMap.has(user.phone)) {
//         userStatusMap.set(user.phone, 'direct');
//       }
//     });
//     const verifiedPhones = new Set(userStatusMap.keys());

//     const requiredFields = ['propertyMode', 'propertyType', 'price', 'totalArea', 'areaUnit', 'salesType', 'postedBy'];
//     const adsCountByUser = properties.reduce((acc, property) => {
//       const phone = property.phoneNumber;
//       acc[phone] = (acc[phone] || 0) + 1;
//       return acc;
//     }, {});

//     const completeProperties = properties.filter(property =>
//       requiredFields.every(field =>
//         property[field] !== undefined && property[field] !== null && String(property[field]).trim() !== ''
//       )
//     );

//     const processedProperties = completeProperties.map(property => {
//       const matchedPlan = plans.find(plan =>
//         Array.isArray(plan.phoneNumber)
//           ? plan.phoneNumber.includes(property.phoneNumber)
//           : plan.phoneNumber === property.phoneNumber
//       );

//       const matchedBill = bills.find(bill =>
//         bill.ownerPhone === property.phoneNumber || bill.ppId === property.ppcId
//       );

//       const matchedPayment = payments.find(pay =>
//         pay.phone === property.phoneNumber && pay.ppcId === property.ppcId
//       );

//       const propertyFollowUps = followups
//         .filter(fu => String(fu.ppcId) === String(property.ppcId))
//         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//       const followUpAdminName = propertyFollowUps.length > 0
//         ? propertyFollowUps[0]?.adminName || 'Unknown Admin'
//         : 'N/A';

//       // Bill Info
//       let adminOffice = 'N/A', adminName = 'N/A', billNo = 'N/A', billDate = 'N/A', validity = 'N/A', billExpiryDate = 'N/A';
//       if (matchedBill) {
//         adminOffice = matchedBill.adminOffice || 'N/A';
//         adminName = matchedBill.adminName || 'N/A';
//         billNo = matchedBill.billNo || 'N/A';
//         billDate = matchedBill.billDate || 'N/A';
//         validity = matchedBill.validity || 'N/A';

//         if (billDate !== 'N/A' && validity !== 'N/A') {
//           const billStart = new Date(billDate).getTime();
//           const billExpiry = billStart + (validity * 24 * 60 * 60 * 1000);
//           billExpiryDate = new Date(billExpiry).toLocaleDateString();
//         }
//       }

//       // Plan Info
//       let planCreatedAt = 'N/A', planExpiryDate = 'N/A';
//       if (matchedPlan?.createdAt && matchedPlan?.durationDays) {
//         const expiryDate = new Date(matchedPlan.createdAt).getTime() + matchedPlan.durationDays * 24 * 60 * 60 * 1000;
//         planCreatedAt = new Date(matchedPlan.createdAt).toLocaleDateString();
//         planExpiryDate = new Date(expiryDate).toLocaleDateString();
//       }

//       const otpStatus = userStatusMap.get(property.phoneNumber) || 'not verified';
//       const isVerifiedUser = verifiedPhones.has(property.phoneNumber);

//       return {
//         ...property._doc,
//         required: "yes",
//         adsCount: adsCountByUser[property.phoneNumber] || 0,
//         planName: matchedPlan?.name || 'N/A',
//         planCreatedAt,
//         planExpiryDate,
//         packageType: matchedPlan?.packageType || 'N/A',
//         planDuration: matchedPlan?.durationDays || 'N/A',
//         adminOffice,
//         adminName,
//         billNo,
//         billDate,
//         validity,
//         billExpiryDate,
//         followUpAdminName,
//         isPreApproved: !!matchedPayment,
//         paymentInfo: matchedPayment || null,
//         otpStatus,
//         isVerifiedUser,
//         createdBy: (otpStatus === 'not verified' && !isVerifiedUser) ? 'Admin' : 'User'
//       };
//     });

//     res.status(200).json({
//       message: "Fetched all enriched property data successfully.",
//       users: processedProperties,
//       total: processedProperties.length
//     });
//   } catch (error) {
//     console.error('Error:', error.message);
//     res.status(500).json({
//       message: 'Error fetching all user details.',
//       error: error.message
//     });
//   }
// });





router.get('/fetch-alls-datas-all', async (req, res) => {
  try {
    const properties = await AddModel.find({});
    const plans = await PricingPlans.find();
    const bills = await Bill.find();
    const followups = await FollowUp.find();
    const payments = await PaymentPayU.find();

    // 🔸 Step 1: Get OTP verified and directly verified users
    const otpVerifiedUsers = await UserLogin.find({ otpStatus: 'verified' });
    const directVerifiedUsers = await UserLogin.find({ directVerified: true });

    // 🔹 Map phone => otpStatus
    const userStatusMap = new Map();

    otpVerifiedUsers.forEach(user => {
      userStatusMap.set(user.phone, 'verified');
    });

    directVerifiedUsers.forEach(user => {
      if (!userStatusMap.has(user.phone)) {
        userStatusMap.set(user.phone, 'direct');
      }
    });

    const verifiedPhones = new Set(userStatusMap.keys());

    const requiredFields = [
        'rentId', 'phoneNumber', 'propertyMode', 'propertyType',
        'postedBy', 'rentType', 'rentalAmount', 'floorNo','bedrooms','state','area','totalArea','areaUnit','availableDate'
      ];

    // Count ads posted by phone number
    const adsCountByUser = properties.reduce((acc, property) => {
      const phone = property.phoneNumber;
      acc[phone] = (acc[phone] || 0) + 1;
      return acc;
    }, {});

    const completeProperties = properties.filter((property) =>
      requiredFields.every(
        (field) =>
          property[field] !== undefined &&
          property[field] !== null &&
          String(property[field]).trim() !== ''
      )
    );

    const processedProperties = completeProperties.map((property) => {
      const matchedPlan = plans.find(plan =>
        Array.isArray(plan.phoneNumber)
          ? plan.phoneNumber.includes(property.phoneNumber)
          : plan.phoneNumber === property.phoneNumber
      );

      const matchedBill = bills.find(bill =>
        bill.ownerPhone === property.phoneNumber || bill.ppId === property.ppcId
      );

      const matchedPayment = payments.find(pay =>
        pay.phone === property.phoneNumber && pay.ppcId === property.ppcId
      );

      // Bill details
      let adminOffice = 'N/A';
      let adminName = 'N/A';
      let billNo = 'N/A';
      let billDate = 'N/A';
      let validity = 'N/A';
      let billExpiryDate = 'N/A';

      if (matchedBill) {
        adminOffice = matchedBill.adminOffice || 'N/A';
        adminName = matchedBill.adminName || 'N/A';
        billNo = matchedBill.billNo || 'N/A';
        billDate = matchedBill.billDate || 'N/A';
        validity = matchedBill.validity || 'N/A';

        if (billDate !== 'N/A' && validity !== 'N/A') {
          const billStart = new Date(billDate).getTime();
          const billExpiry = billStart + (validity * 24 * 60 * 60 * 1000);
          billExpiryDate = new Date(billExpiry).toLocaleDateString();
        }
      }

      // Plan details
      let planCreatedAt = 'N/A';
      let planExpiryDate = 'N/A';

      if (matchedPlan && matchedPlan.createdAt && matchedPlan.durationDays) {
        const expiryDate = new Date(matchedPlan.createdAt).getTime() + matchedPlan.durationDays * 24 * 60 * 60 * 1000;
        planCreatedAt = new Date(matchedPlan.createdAt).toLocaleDateString();
        planExpiryDate = new Date(expiryDate).toLocaleDateString();
      }

      // Follow-up admin
      const propertyFollowUps = followups
        .filter(fu => String(fu.ppcId) === String(property.ppcId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const followUpAdminName = propertyFollowUps.length > 0
        ? propertyFollowUps[0]?.adminName || 'Unknown Admin'
        : 'N/A';

      // OTP Status and Verification Check
      const phone = property.phoneNumber;
      const otpStatus = userStatusMap.get(phone) || 'not verified';
      const isVerifiedUser = verifiedPhones.has(phone);

    //   return {
    //     ...property._doc,
    //     required: "yes",
    //     adsCount: adsCountByUser[property.phoneNumber] || 0,
    //     planName: matchedPlan?.name || 'N/A',
    //     planCreatedAt,
    //     planExpiryDate,
    //     packageType: matchedPlan?.packageType || 'N/A',
    //     planDuration: matchedPlan?.durationDays || 'N/A',
    //     adminOffice,
    //     adminName,
    //     billNo,
    //     billDate,
    //     validity,
    //     billExpiryDate,
    //     followUpAdminName,
    //     isPreApproved: !!matchedPayment,
    //     paymentInfo: matchedPayment || null,
    //     otpStatus,
    //     isVerifiedUser
    //   };

    return {
  ...property._doc,
  required: "yes",
  adsCount: adsCountByUser[property.phoneNumber] || 0,
  planName: matchedPlan?.name || 'N/A',
  planCreatedAt,
  planExpiryDate,
  packageType: matchedPlan?.packageType || 'N/A',
  planDuration: matchedPlan?.durationDays || 'N/A',
  adminOffice,
  adminName,
  billNo,
  billDate,
  validity,
  billExpiryDate,
  followUpAdminName,
  isPreApproved: !!matchedPayment,
  paymentInfo: matchedPayment || null,
  otpStatus,
  isVerifiedUser,
  createdBy: (otpStatus === 'not verified' && !isVerifiedUser) ? 'Admin' : 'User', // ✅ This line added
};

    });
    res.status(200).json({
      message: "Only required=YES data fetched successfully (includes pre-approved & approved plans).",
      users: processedProperties,
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching all user details.',
      error: error.message
    });
  }
});



router.put('/admin/set-on-demand-rent', async (req, res) => {
  try {
    const { ppcId, onDemand, adminName } = req.body;

    if (!ppcId) {
      return res.status(400).json({ message: 'ppcId is required' });
    }

    const property = await AddModel.findOne({ ppcId });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.onDemand = onDemand;
    property.onDemandSetBy = {
      name: adminName || 'Unknown',
      date: new Date()
    };

    await property.save();

    res.status(200).json({ message: `Price is now ${onDemand ? 'On Demand' : 'Visible'}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/property-by-rentId', async (req, res) => {
  try {
    const { rentId } = req.query;

    if (!rentId) {
      return res.status(400).json({ message: 'rentId is required' });
    }

    const property = await AddModel.findOne({ rentId: Number(rentId) });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const response = {
      rentId: property.rentId,
      onDemand: property.onDemand,
      rentalAmount: property.onDemand ? "On Demand" : property.rentalAmount,
      status: property.status,
      ownerName: property.ownerName
    };

    res.status(200).json({ property: response });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /admin/get-on-demand-properties
router.get('/get-on-demand-properties-rent', async (req, res) => {
  try {
    const properties = await AddModel.find({ onDemand: true }).lean();

    if (properties.length === 0) {
      return res.status(404).json({ message: 'No properties marked as On Demand' });
    }

    // Optionally mask price as "On Demand" (for frontend)
    const processedProperties = properties.map(property => ({
      ...property,
      price: "On Demand"
    }));

    res.status(200).json({
      success: true,
      message: 'Properties with On Demand pricing fetched successfully',
      properties: processedProperties,
    });
  } catch (error) {
    console.error('Error fetching On Demand properties:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// PUT /delete-free-property/:rentId
router.put('/delete-free-property/:rentId', async (req, res) => {
  try {
    const { rentId } = req.params;
    const property = await AddModel.findOneAndUpdate(
      { rentId },
      { isDeleted: true },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found with the given Rent ID' });
    }

    res.status(200).json({ message: 'Property marked as deleted successfully', property });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// PUT /undo-delete-free-property/:rentId
router.put('/undo-delete-free-property/:rentId', async (req, res) => {
  try {
    const { rentId } = req.params;
    const property = await AddModel.findOneAndUpdate(
      { rentId },
      { isDeleted: false },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found with the given Rent ID' });
    }

    res.status(200).json({ message: 'Property restored successfully', property });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


// DELETE /permanent-delete-property/:rentId
// HARD delete — permanently removes the property document so it never
// reappears. Used by the admin report tables (Customer Care, Reported
// Properties, Sold-Out, Need Help) where a removed row must stay gone.
// NOTE: This is intentionally separate from /delete-free-property (the
// soft-delete + undo endpoint used app-wide). Do NOT merge them.
router.delete('/permanent-delete-property/:rentId', async (req, res) => {
  try {
    const { rentId } = req.params;
    const property = await AddModel.findOneAndDelete({ rentId });

    if (!property) {
      return res.status(404).json({ message: 'Property not found with the given Rent ID' });
    }

    res.status(200).json({ message: 'Property permanently deleted', rentId });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


router.get('/fetch-active-users', async (req, res) => {
  try {
    const properties = await AddModel.find({ status: 'active' });
    const plans = await PricingPlans.find();
    const bills = await Bill.find();
    const followups = await FollowUp.find();
    const payments = await PaymentPayU.find();

    //  const requiredFields = [
    //   'propertyMode', 'propertyType', 'rentalAmount',
    //   'bedrooms', 'numberOfFloors',  'postedBy' , 'rentType','state','city','area'
    // ];


     const requiredFields = [
        'rentId', 'phoneNumber', 'propertyMode', 'propertyType',
        'postedBy', 'rentType', 'rentalAmount', 'floorNo','bedrooms','state','city','area','totalArea','areaUnit','availableDate'
      ];

    const processedProperties = properties.map((property) => {
      // A bulk-uploaded property has already been through admin review — it
      // reached PreApproved, was billed, and only then became active. A
      // newspaper ad never prints every field this form asks for, so holding it
      // back here would mean a listing an admin has approved that no tenant can
      // ever see. Those rows are listed regardless of the completeness gate.
      const isComplete =
        !!property.bulkUploadId ||
        requiredFields.every(
          (field) =>
            property[field] !== undefined &&
            property[field] !== null &&
            String(property[field]).trim() !== ''
        );

      // Find matching plan
      const matchedPlan = plans.find(plan =>
        Array.isArray(plan.phoneNumber)
          ? plan.phoneNumber.includes(property.phoneNumber)
          : plan.phoneNumber === property.phoneNumber
      );

      // Calculate plan created and expiry date
      let planCreatedAt = 'N/A';
      let planExpiryDate = 'N/A';

      if (matchedPlan && matchedPlan.createdAt && matchedPlan.durationDays) {
        const planStart = new Date(matchedPlan.createdAt);
        const planExpiry = new Date(planStart.getTime() + (matchedPlan.durationDays - 1) * 24 * 60 * 60 * 1000);
        planCreatedAt = planStart.toLocaleDateString();
        planExpiryDate = planExpiry.toLocaleDateString();
      }

      // Find matching bill
      const matchedBill = bills.find(bill =>
        bill.ownerPhone === property.phoneNumber || String(bill.ppId) === String(property.ppcId)
      );

      // Extract bill info and calculate bill expiry
      let adminName = 'N/A';
      let billDate = 'N/A';
      let validity = 'N/A';
      let billExpiryDate = 'N/A';

      if (matchedBill) {
        adminName = matchedBill.adminName || 'N/A';
        billDate = matchedBill.billDate || 'N/A';
        validity = matchedBill.validity || 'N/A';

        if (billDate !== 'N/A' && validity !== 'N/A') {
          const billStart = new Date(billDate);
          const billExpiry = new Date(billStart.getTime() + (validity - 1) * 24 * 60 * 60 * 1000);
          billExpiryDate = billExpiry.toLocaleDateString();
        }
      }

      // Find latest follow-up admin for this property
      const propertyFollowUps = followups
        .filter(fu => String(fu.ppcId) === String(property.ppcId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const followUpAdminName = propertyFollowUps.length > 0
        ? propertyFollowUps[0]?.adminName || 'Unknown Admin'
        : 'N/A';

      // Find matching payment
      const matchedPayment = payments.find(payment =>
        payment.phone === property.phoneNumber && String(payment.ppcId) === String(property.ppcId)
      );

      return {
        ...property._doc,
        required: isComplete ? 'yes' : 'no',
        planName: matchedPlan?.name || 'N/A',
        planCreatedAt,
        planExpiryDate,
        packageType: matchedPlan?.packageType || 'N/A',
        planDuration: matchedPlan?.durationDays || 'N/A',
        adminName,
        billDate,
        validity,
        billExpiryDate,
        followUpAdminName,
        setPpcId: property.setPpcId || false,
        assignedPhoneNumber: property.setPpcId ? property.assignedPhoneNumber || null : null,
        setPpcIdAssignedAt: property.setPpcIdAssignedAt || null,
        paymentData: matchedPayment || null
      };
    });

    // Filter only properties with all required fields
    const filteredProperties = processedProperties.filter(p => p.required === 'yes');

    res.status(200).json({
      message: 'Active properties with complete info fetched successfully!',
      users: filteredProperties
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching active user details.',
      error: error.message
    });
  }
});



router.get("/property-buyer-viewed-count", async (req, res) => {
  let { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Owner phone number is required" });
  }

  const normalizedPhone = phoneNumber.replace(/\s+/g, "").replace("+", "");
  const possibleNumbers = [
    normalizedPhone,
    "+" + normalizedPhone,
    normalizedPhone.replace(/^91/, ""),
  ];

  try {
    // 🔁 Changed from AddModel to RentModel
    const ownerProperties = await AddModel.find({ phoneNumber: { $in: possibleNumbers } });

    if (!ownerProperties.length) {
      return res.status(200).json({ buyerViewedCount: 0 });
    }

    const ownerRentIds = ownerProperties.map((property) => property.rentId);

    // Fetch all users who viewed the rental properties
    const viewedUsers = await UserViewsModel.find({
      "viewedProperties.rentId": { $in: ownerRentIds },
    });

    // Count total views across all users for owner's rental properties
    let totalViews = 0;
    viewedUsers.forEach((user) => {
      totalViews += user.viewedProperties.filter((vp) =>
        ownerRentIds.includes(vp.rentId)
      ).length;
    });

    return res.status(200).json({ buyerViewedCount: totalViews });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});




// router.get('/fetch-active-users-datas-all-rent', async (req, res) => {
//   try {
//     // Fetch all necessary collections
//     const properties = await AddModel.find({ status: 'active' });
//     const plans = await PricingPlans.find();
//     const bills = await Bill.find();
//     const followups = await FollowUp.find();
//     const payments = await PaymentPayU.find();

//     // 🔸 Get verified users by OTP or direct verification
//     const otpVerifiedUsers = await UserLogin.find({ otpStatus: 'verified' });
//     const directVerifiedUsers = await UserLogin.find({ directVerified: true });

//     // 🔹 Create phone => status mapping
//     const userStatusMap = new Map();

//     otpVerifiedUsers.forEach(user => {
//       userStatusMap.set(user.phone, 'verified');
//     });

//     directVerifiedUsers.forEach(user => {
//       if (!userStatusMap.has(user.phone)) {
//         userStatusMap.set(user.phone, 'direct');
//       }
//     });

//     const verifiedPhones = new Set(userStatusMap.keys());

//   const requiredFields = [
//         'rentId', 'phoneNumber', 'propertyMode', 'propertyType',
//         'postedBy', 'rentType', 'rentalAmount','bedrooms','totalArea','areaUnit','availableDate'
//       ];

//     const processedProperties = properties.map((property) => {
//       const isComplete = requiredFields.every(
//         (field) =>
//           property[field] !== undefined &&
//           property[field] !== null &&
//           String(property[field]).trim() !== ''
//       );

//       const matchedPlan = plans.find(plan =>
//         Array.isArray(plan.phoneNumber)
//           ? plan.phoneNumber.includes(property.phoneNumber)
//           : plan.phoneNumber === property.phoneNumber
//       );

//       let planCreatedAt = 'N/A';
//       let planExpiryDate = 'N/A';
//       if (matchedPlan && matchedPlan.createdAt && matchedPlan.durationDays) {
//         const planStart = new Date(matchedPlan.createdAt);
//         const planExpiry = new Date(planStart.getTime() + (matchedPlan.durationDays - 1) * 24 * 60 * 60 * 1000);
//         planCreatedAt = planStart.toLocaleDateString();
//         planExpiryDate = planExpiry.toLocaleDateString();
//       }

//       const matchedBill = bills.find(bill =>
//         bill.ownerPhone === property.phoneNumber || String(bill.ppId) === String(property.ppcId)
//       );

//       let adminName = 'N/A';
//       let billDate = 'N/A';
//       let validity = 'N/A';
//       let billExpiryDate = 'N/A';

//       if (matchedBill) {
//         adminName = matchedBill.adminName || 'N/A';
//         billDate = matchedBill.billDate || 'N/A';
//         validity = matchedBill.validity || 'N/A';

//         if (billDate !== 'N/A' && validity !== 'N/A') {
//           const billStart = new Date(billDate);
//           const billExpiry = new Date(billStart.getTime() + (validity - 1) * 24 * 60 * 60 * 1000);
//           billExpiryDate = billExpiry.toLocaleDateString();
//         }
//       }

//       const propertyFollowUps = followups
//         .filter(fu => String(fu.ppcId) === String(property.ppcId))
//         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//       const followUpAdminName = propertyFollowUps.length > 0
//         ? propertyFollowUps[0]?.adminName || 'Unknown Admin'
//         : 'N/A';

//       const matchedPayment = payments.find(payment =>
//         payment.phone === property.phoneNumber && String(payment.ppcId) === String(property.ppcId)
//       );

//       const phone = property.phoneNumber;
//       const otpStatus = userStatusMap.get(phone) || 'not verified';
//       const isVerifiedUser = verifiedPhones.has(phone);
//       const createdBy = !isVerifiedUser && otpStatus === 'not verified' ? 'Admin' : 'User';

//       return {
//         ...property._doc,
//         required: isComplete ? 'yes' : 'no',
//         isVerifiedUser,
//         otpStatus,
//         createdBy,
//         planName: matchedPlan?.name || 'N/A',
//         planCreatedAt,
//         planExpiryDate,
//         packageType: matchedPlan?.packageType || 'N/A',
//         planDuration: matchedPlan?.durationDays || 'N/A',
//         adminName,
//         billDate,
//         validity,
//         billExpiryDate,
//         followUpAdminName,
//         setPpcId: property.setPpcId || false,
//         assignedPhoneNumber: property.setPpcId ? property.assignedPhoneNumber || null : null,
//         setPpcIdAssignedAt: property.setPpcIdAssignedAt || null,
//         paymentData: matchedPayment || null
//       };
//     });

//     // Optional: filter only complete property records
//     const filteredProperties = processedProperties.filter(p => p.required === 'yes');

//     res.status(200).json({
//       message: 'Active properties with complete info fetched successfully!',
//       users: filteredProperties
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: 'Error fetching active user details.',
//       error: error.message
//     });
//   }
// });




router.get('/fetch-active-users-datas-all-rent', async (req, res) => {
  try {
    const properties = await AddModel.find({ status: 'active', ...baseFilter(req.query.base) });
    const plans = await PricingPlans.find();
    const bills = await Bill.find();
    const followups = await FollowUp.find();
    const payments = await PaymentPayU.find();

    const otpVerifiedUsers = await UserLogin.find({ otpStatus: 'verified' });
    const directVerifiedUsers = await UserLogin.find({ directVerified: true });

    const userStatusMap = new Map();
    otpVerifiedUsers.forEach(user => userStatusMap.set(user.phone, 'verified'));
    directVerifiedUsers.forEach(user => {
      if (!userStatusMap.has(user.phone)) userStatusMap.set(user.phone, 'direct');
    });

    const verifiedPhones = new Set(userStatusMap.keys());

    const requiredFields = [
      'rentId', 'phoneNumber', 'propertyMode', 'propertyType',
      'postedBy', 'rentType', 'rentalAmount', 'bedrooms', 'totalArea', 'areaUnit', 'availableDate'
    ];

    const processedProperties = properties.map(property => {
      // Presence, not truthiness. A real 0 is a value: rentalAmount is 0 when no
      // rent was quoted and totalArea is 0 when the area is unknown, and `0 &&`
      // is false — so this page silently hid properties that were active, billed
      // and complete. The identical gate in /bulk-upload-properties and in
      // /properties/pre-approved-all-rent has always tested presence, which is
      // why those pages listed the very rows this one dropped.
      //
      // Bulk-uploaded rows skip the gate outright: they reached PreApproved,
      // were billed, and only then became active, so an admin has already
      // decided they belong here. This matches /fetch-active-users, so the
      // Approved list and what tenants actually see stay in step.
      const isComplete =
        !!property.bulkUploadId ||
        requiredFields.every((field) => {
          const value = property[field];
          return value !== undefined && value !== null && String(value).trim() !== '';
        });

      // 🧩 Step 1: Match plan
      const matchedPlan = plans.find(plan =>
        Array.isArray(plan.phoneNumber)
          ? plan.phoneNumber.includes(property.phoneNumber)
          : plan.phoneNumber === property.phoneNumber
      );

      let planName = 'N/A';
      let planCreatedAt = 'N/A';
      let planExpiryDate = 'N/A';
      let packageType = 'N/A';
      let planDuration = 'N/A';
      let paymentType = 'N/A';

      // 🧠 Step 2: Handle Paid Plan
      if (matchedPlan) {
        planName = matchedPlan.name || 'N/A';
        packageType = matchedPlan.packageType || 'N/A';
        planDuration = matchedPlan.durationDays || 'N/A';
        paymentType = 'Paid';

        if (matchedPlan.createdAt && matchedPlan.durationDays) {
          const planStart = new Date(matchedPlan.createdAt);
          const planExpiry = new Date(planStart.getTime() + (matchedPlan.durationDays - 1) * 86400000);
          planCreatedAt = planStart.toLocaleDateString();
          planExpiryDate = planExpiry.toLocaleDateString();
        }
      }

      // 🧩 Step 3: Handle Free Plan logic
      else if (!matchedPlan) {
        planName = 'Free';
        paymentType = 'Free';

        const planStart = new Date(property.createdAt);
        const freeDurationDays = 30; // default 30 days free plan
        const planExpiry = new Date(planStart.getTime() + (freeDurationDays - 1) * 86400000);
        planCreatedAt = planStart.toLocaleDateString();
        planExpiryDate = planExpiry.toLocaleDateString();
        planDuration = freeDurationDays - 1;
      }

      // 🧩 Step 4: Bill info
      const matchedBill = bills.find(bill =>
        bill.ownerPhone === property.phoneNumber || String(bill.ppId) === String(property.ppcId)
      );

      let adminName = matchedBill?.adminName || 'N/A';
      let billDate = matchedBill?.billDate || 'N/A';
      let validity = matchedBill?.validity || 'N/A';
      let billExpiryDate = 'N/A';

      if (billDate !== 'N/A' && validity !== 'N/A') {
        const billStart = new Date(billDate);
        const billExpiry = new Date(billStart.getTime() + (validity - 1) * 86400000);
        billExpiryDate = billExpiry.toLocaleDateString();
      }

      // 🧩 Step 5: Follow-up info
      const propertyFollowUps = followups
        .filter(fu => String(fu.ppcId) === String(property.ppcId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const followUpAdminName = propertyFollowUps.length > 0
        ? propertyFollowUps[0]?.adminName || 'Unknown Admin'
        : 'N/A';

      // 🧩 Step 6: Payment info
      const matchedPayment = payments.find(payment =>
        payment.phone === property.phoneNumber && String(payment.ppcId) === String(property.ppcId)
      );

      const phone = property.phoneNumber;
      const otpStatus = userStatusMap.get(phone) || 'not verified';
      const isVerifiedUser = verifiedPhones.has(phone);
      const createdBy = !isVerifiedUser && otpStatus === 'not verified' ? 'Admin' : 'User';

      return {
        ...property._doc,
        required: isComplete ? 'yes' : 'no',
        isVerifiedUser,
        otpStatus,
        createdBy,
        planName,
        paymentType,
        planCreatedAt,
        planExpiryDate,
        packageType,
        planDuration,
        adminName,
        billDate,
        validity,
        billExpiryDate,
        followUpAdminName,
        // ✅ Rent uses setRentId (not the PPC setPpcId). Expose the masked/assigned
        //    number so the approved listing can show it in place of the owner number.
        setRentId: property.setRentId || false,
        assignedPhoneNumber: property.setRentId ? property.assignedPhoneNumber || null : null,
        setRentAssignedAt: property.setRentAssignedAt || null,
        paymentData: matchedPayment || null
      };
    });

    const filteredProperties = processedProperties.filter(p => p.required === 'yes');

    res.status(200).json({
      message: 'Active properties with complete info fetched successfully!',
      users: filteredProperties
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching active user details.',
      error: error.message
    });
  }
});





router.get('/properties/pre-approved-all-rent', async (req, res) => {
  try {
    const properties = await AddModel.find({ status: 'complete' }).lean();
    const allPlans = await PricingPlans.find();
    const allPayments = await PaymentPayU.find();
    const allAds = await AddModel.find();
    const otpVerifiedUsers = await UserLogin.find({ otpStatus: 'verified' });
    const directVerifiedUsers = await UserLogin.find({ directVerified: true });

    const userStatusMap = new Map();
    otpVerifiedUsers.forEach(user => userStatusMap.set(user.phone, 'verified'));
    directVerifiedUsers.forEach(user => {
      if (!userStatusMap.has(user.phone)) {
        userStatusMap.set(user.phone, 'direct');
      }
    });

    const verifiedPhones = new Set(userStatusMap.keys());

    const adsCountByPhone = allAds.reduce((acc, ad) => {
      acc[ad.phoneNumber] = (acc[ad.phoneNumber] || 0) + 1;
      return acc;
    }, {});

    const requiredFields = [
      'rentId', 'phoneNumber', 'propertyMode', 'propertyType',
      'postedBy', 'rentType', 'rentalAmount', 'floorNo',
      'bedrooms', 'state', 'city', 'area', 'totalArea',
      'areaUnit', 'availableDate'
    ];

    const enrichedProperties = await Promise.all(properties.map(async (property) => {
      const isComplete = requiredFields.every(field => {
        const value = property[field];
        return value !== undefined && value !== null && String(value).trim() !== '';
      });

      const phone = property.phoneNumber;
      const rentId = property.rentId;

      const otpStatus = userStatusMap.get(phone) || 'not verified';
      const isVerifiedUser = verifiedPhones.has(phone);
      const createdBy = !isVerifiedUser && otpStatus === 'not verified' ? 'Admin' : 'User';

      let selectedPlan = null;
      for (const plan of allPlans) {
        if (!Array.isArray(plan.phoneNumbers)) continue;

        for (const pn of plan.phoneNumbers) {
          if (pn.number === phone && pn.rentId === rentId) {
            const createdDate = pn.createdAt || null;
            let expireDate = null;
            if (createdDate && plan.durationDays) {
              const created = new Date(createdDate);
              expireDate = new Date(created.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
            }

            selectedPlan = {
              planName: plan.name || 'N/A',
              planDuration: plan.durationDays || 'N/A',
              packageType: plan.packageType || 'N/A',
              planCreatedAt: createdDate ? new Date(createdDate).toLocaleDateString() : 'N/A',
              planExpiryDate: expireDate ? new Date(expireDate).toLocaleDateString() : 'N/A',
            };
            break;
          }
        }

        if (selectedPlan) break;
      }

      const matchedPayment = allPayments.find(payment =>
        payment.phone === phone && String(payment.rentId) === String(rentId)
      );

      const paymentInfo = matchedPayment
        ? {
            payUStatus: matchedPayment.payUStatus || 'N/A',
            payustatususer: matchedPayment.payustatususer || 'N/A',
            paymentId: matchedPayment.paymentId || 'N/A',
            transactionId: matchedPayment.transactionId || 'N/A',
            payUCreatedAt: matchedPayment.createdAt || null,
            payUUpdatedAt: matchedPayment.updatedAt || null
          }
        : {
            payUStatus: 'N/A',
            payustatususer: 'N/A',
            paymentId: 'N/A',
            transactionId: 'N/A',
            payUCreatedAt: null,
            payUUpdatedAt: null
          };

      return {
        ...property,
        required: isComplete ? 'yes' : 'no',
        otpStatus,
        isVerifiedUser,
        createdBy,
        adsCount: adsCountByPhone[phone] || 0,
        setPpcId: property.setPpcId || false,
        assignedPhoneNumber: property.setPpcId ? property.assignedPhoneNumber || null : null,
        setPpcIdAssignedAt: property.setPpcIdAssignedAt || null,
        ...(selectedPlan || {
          planName: 'N/A',
          planDuration: 'N/A',
          packageType: 'N/A',
          planCreatedAt: 'N/A',
          planExpiryDate: 'N/A'
        }),
        ...paymentInfo
      };
    }));

    const preApproved = enrichedProperties.filter(p => p.required === 'yes');

    res.status(200).json({
      message: 'Pre-approved rental properties fetched successfully!',
      users: preApproved
    });

  } catch (error) {
    console.error('Error in /properties/pre-approved-all:', error);
    res.status(500).json({
      message: 'Error fetching pre-approved rental properties.',
      error: error.message
    });
  }
});



router.put('/admin-delete-rent', async (req, res) => {
  const { rentId } = req.query;
  const { deletionReason } = req.body;

  // Validate rentId is provided
  if (!rentId) {
    return res.status(400).json({ message: 'Rent ID is required.' });
  }

  // Validate deletion reason is provided
  if (!deletionReason || deletionReason.trim() === '') {
    return res.status(400).json({ message: 'Deletion reason is required.' });
  }

  try {
    // Soft delete with status update
    const updatedItem = await AddModel.findOneAndUpdate(
      { rentId },
      {
        isDeleted: true,
        deletionReason: deletionReason.trim(),
        deletionDate: new Date(),
        status: 'delete'
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found with the provided Rent ID.' });
    }

    res.status(200).json({
      message: 'Item marked as deleted successfully!',
      data: updatedItem
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error marking item as deleted.',
      error: error.message
    });
  }
});


router.put('/admin-undo-delete-rent', async (req, res) => {
  const { rentId } = req.query;

  // Validate rentId is provided
  if (!rentId) {
    return res.status(400).json({ message: 'Rent ID is required.' });
  }

  try {
    // Restore the document by clearing deletion fields
    const restoredItem = await AddModel.findOneAndUpdate(
      { rentId },
      {
        isDeleted: false,
        deletionReason: null,
        deletionDate: null
      },
      { new: true }
    );

    if (!restoredItem) {
      return res.status(404).json({ message: 'Item not found with the provided Rent ID.' });
    }

    res.status(200).json({
      message: 'Item restored successfully!',
      data: restoredItem
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error restoring item.',
      error: error.message
    });
  }
});


router.put("/update-feature-status", async (req, res) => {
  try {
    const { rentId, featureStatus } = req.body;

    await AddModel.updateOne({ rentId }, { $set: { featureStatus } });

    res.status(200).json({ message: "Feature status updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error updating feature status.", error });
  }
});


// Add a remark to a rent property
router.post('/add-rent-remark', async (req, res) => {
  try {
    const { rentId, text, adminName } = req.body;

    if (!rentId) {
      return res.status(400).json({ message: 'Rent ID is required.' });
    }
    if (!text || !String(text).trim()) {
      return res.status(400).json({ message: 'Remark text is required.' });
    }

    const remark = {
      text: String(text).trim(),
      adminName: adminName || 'Admin',
      date: new Date()
    };

    const updated = await AddModel.findOneAndUpdate(
      { rentId },
      { $set: { remarks: [remark] } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Property not found with the provided Rent ID.' });
    }

    res.status(200).json({
      message: 'Remark added successfully!',
      remarks: updated.remarks
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding remark.', error: error.message });
  }
});


// Fetch remarks for a single rent property
router.get('/get-rent-remarks/:rentId', async (req, res) => {
  try {
    const { rentId } = req.params;
    const property = await AddModel.findOne({ rentId }).select('rentId remarks').lean();

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    res.status(200).json({ rentId: property.rentId, remarks: property.remarks || [] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching remarks.', error: error.message });
  }
});


// http://localhost:6006/PPC/permanent-deletes/9865573421

// http://localhost:6006/PPC/fetch-data?phoneNumber=9865573421

router.get('/fetch-data', async (req, res) => {
  const { phoneNumber, rentId } = req.query;

  // Ensure at least one parameter is provided
  if (!phoneNumber && !rentId) {
      return res.status(400).json({ message: 'Either phone number or RENT-ID is required.' });
  }

  try {

      // Normalize phone number (remove spaces, dashes, country code, and ensure consistency)
      const normalizedPhoneNumber = phoneNumber
          ? phoneNumber.replace(/[\s-]/g, '').replace(/^(\+91|91|0)/, '').trim() // Remove country code, spaces, dashes
          : null;

      // Build query dynamically based on the provided parameters
      const query = {};
      if (normalizedPhoneNumber) query.phoneNumber = new RegExp(normalizedPhoneNumber + '$'); // Match phone number ending with the query
      if (rentId) query.rentId = rentId;


      // Fetch user from the database
      const user = await AddModel.findOne(query);

      // Check if user exists
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      res.status(200).json({ message: 'User data fetched successfully!', user });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching user details.', error });
  }
});




// GET /api/cities?search=pu
router.get('/cities', async (req, res) => {
  try {
    const { search = "" } = req.query;
    const cities = await AddModel.distinct('city', {
      city: { $regex: search, $options: 'i' }
    });
    res.json({ success: true, data: cities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching cities', error });
  }
});

// GET /api/areas?search=la
router.get('/areas', async (req, res) => {
  try {
    const { search = "" } = req.query;
    const areas = await AddModel.distinct('area', {
      area: { $regex: search, $options: 'i' }
    });
    res.json({ success: true, data: areas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching areas', error });
  }
});





router.post('/check-user-access-buyer-assistance', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  try {
    // Step 1: Check if user has added rent properties
    const userProperties = await AddModel.find({ phoneNumber, isDeleted: false });
    const hasProperty = userProperties.length > 0;

    // Step 2: Get rentIds from pricing plans
    const userPlans = await PricingPlans.find({ 'phoneNumbers.number': phoneNumber });
    const allRentIds = userPlans.flatMap(plan =>
      plan.phoneNumbers
        .filter(pn => pn.number === phoneNumber)
        .map(pn => pn.rentId)
    );

    // Step 3: Get paid rents
    const paidPayments = await PaymentPayU.find({
      rentId: { $in: allRentIds },
      payustatususer: 'paid',
    });

    const paidRentIds = [...new Set(paidPayments.map(p => p.rentId))];
    const paidCount = paidRentIds.length;

    // Step 4: Get viewed buyer assistance records
    const viewedRecords = await BuyerAssistView.find({ phoneNumber });
    const viewedRaIds = viewedRecords.map(view => view.ra_id);

    // Step 5: Calculate limits
    const allowedViews = paidCount * 10;
    const remainingViews = Math.max(allowedViews - viewedRaIds.length, 0);

    return res.status(200).json({
      success: true,
      message: "Access granted.",
      phoneNumber,
      userHasProperty: hasProperty,
      userIsPaid: paidCount > 0,
      paidPropertiesCount: paidCount,
      allowedBuyerAssistanceViews: allowedViews,
      viewedBuyerAssistances: viewedRaIds,
      remainingViews
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});


router.post('/record-ba-view', async (req, res) => {
  const { phoneNumber, ra_id } = req.body;

  if (!phoneNumber || !ra_id) {
    return res.status(400).json({ success: false, message: 'Missing phone number or ra_id' });
  }

  try {
    const alreadyViewed = await BuyerAssistView.findOne({ phoneNumber, ra_id });
    if (!alreadyViewed) {
      await BuyerAssistView.create({ phoneNumber, ra_id });
    }

    res.status(200).json({ success: true, message: 'View recorded' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});


// router.get('/get-buyer-assist-view-count', async (req, res) => {
//   const { phoneNumber } = req.query;

//   if (!phoneNumber) {
//     return res.status(400).json({ success: false, message: 'Phone number is required' });
//   }

//   try {
//     const count = await BuyerAssistView.countDocuments({ phoneNumber });
//     return res.status(200).json({ success: true, phoneNumber, count });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message,
//     });
//   }
// });

// router.get("/user-most-viewed-properties-rent/:phoneNumber", async (req, res) => {
//   try {
//     const { phoneNumber } = req.params;

//     if (!phoneNumber) {
//       return res.status(400).json({ message: "Phone number is required" });
//     }

//     const digits = phoneNumber.replace(/\D/g, "").slice(-10);
//     const variants = [`+91${digits}`, `91${digits}`, digits];

//     const userViews = await UserViewsModel.findOne({
//       phoneNumber: { $in: variants },
//     });

//     if (!userViews || !Array.isArray(userViews.viewedProperties)) {
//       return res.status(404).json({ message: "No viewed properties found" });
//     }

//     const now = new Date();
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(now.getDate() - 30);

//     const viewCounts = {};
//     const totalCounts = {};

//     for (const view of userViews.viewedProperties) {
//       const rentId = view.rentId || view.ppcId; // Fallback if older records use ppcId
//       const viewedAt = new Date(view.viewedAt);

//       if (!rentId) continue;

//       // All-time count
//       totalCounts[rentId] = totalCounts[rentId]
//         ? { count: totalCounts[rentId].count + 1 }
//         : { count: 1 };

//       // 30-day count
//       if (viewedAt >= thirtyDaysAgo && viewedAt <= now) {
//         if (viewCounts[rentId]) {
//           viewCounts[rentId].count += 1;
//           viewCounts[rentId].latestViewedAt =
//             viewedAt > new Date(viewCounts[rentId].latestViewedAt)
//               ? view.viewedAt
//               : viewCounts[rentId].latestViewedAt;
//         } else {
//           viewCounts[rentId] = { count: 1, latestViewedAt: view.viewedAt };
//         }
//       }
//     }

//     // Only keep rentId with 3+ views in last 30 days
//     const filteredCounts = Object.entries(viewCounts).filter(
//       ([_, info]) => info.count >= 3
//     );

//     if (filteredCounts.length === 0) {
//       return res.status(404).json({
//         message: "No properties with 3+ views in the last 30 days",
//       });
//     }

//     const sortedRentIds = filteredCounts
//       .sort((a, b) => b[1].count - a[1].count)
//       .map(([rentId, info]) => ({
//         rentId,
//         viewCount30Days: info.count,
//         latestViewedAt: info.latestViewedAt,
//         totalViewCount: totalCounts[rentId]?.count || 0,
//       }));

//     const properties = await Promise.all(
//       sortedRentIds.map(async ({ rentId, viewCount30Days, latestViewedAt, totalViewCount }) => {
//         const property = await AddModel.findOne({ rentId });
//         return property
//           ? {
//               ...property.toObject(),
//               viewCount30Days,
//               latestViewedAt,
//               totalViewCount,
//               // Optional: Rename price → rentalAmount
//               rentalAmount: property.rentalAmount,
//             }
//           : null;
//       })
//     );

//     const finalProperties = properties.filter(Boolean);

//     res.status(200).json({
//       message: "Most viewed rental properties (3+ views in last 30 days)",
//       properties: finalProperties,
//     });
//   } catch (error) {
//     console.error("Error fetching most viewed rental properties:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// });


router.get("/user-most-viewed-properties-rent/:phoneNumber", async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const digits = phoneNumber.replace(/\D/g, "").slice(-10);
    const variants = [`+91${digits}`, `91${digits}`, digits];

    const userViews = await UserViewsModel.findOne({
      phoneNumber: { $in: variants },
    });

    if (!userViews || !Array.isArray(userViews.viewedProperties)) {
      return res.status(404).json({ message: "No viewed properties found" });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const viewCounts = {}; // 30-day counts
    const totalCounts = {}; // All-time counts

    for (const view of userViews.viewedProperties) {
      const rentId = view.rentId || view.ppcId; // fallback for older records
      const viewedAt = new Date(view.viewedAt);
      if (!rentId) continue;

      // All-time count
      if (totalCounts[rentId]) {
        totalCounts[rentId].count += 1;
      } else {
        totalCounts[rentId] = { count: 1 };
      }

      // 30-day count
      if (viewedAt >= thirtyDaysAgo && viewedAt <= now) {
        if (viewCounts[rentId]) {
          viewCounts[rentId].count += 1;
          viewCounts[rentId].latestViewedAt =
            viewedAt > new Date(viewCounts[rentId].latestViewedAt)
              ? view.viewedAt
              : viewCounts[rentId].latestViewedAt;
        } else {
          viewCounts[rentId] = { count: 1, latestViewedAt: view.viewedAt };
        }
      }
    }

    // Filter rentIds with 3+ views in the last 30 days
    const filteredCounts = Object.entries(viewCounts).filter(
      ([_, info]) => info.count >= 3
    );

    if (filteredCounts.length === 0) {
      return res.status(404).json({
        message: "No properties with 3+ views in the last 30 days",
      });
    }

    const sortedRentIds = filteredCounts
      .sort((a, b) => b[1].count - a[1].count)
      .map(([rentId, info]) => ({
        rentId,
        viewCount30Days: info.count,
        latestViewedAt: info.latestViewedAt,
        totalViewCount: totalCounts[rentId]?.count || 0,
      }));

    // Fetch matching properties
    const properties = await Promise.all(
      sortedRentIds.map(async ({ rentId, viewCount30Days, latestViewedAt, totalViewCount }) => {
        const property = await AddModel.findOne({ rentId });

        return property
          ? {
              ...property.toObject(),
              viewCount30Days,
              totalViewCount,
              latestViewedAt,
              viewedAt: latestViewedAt, // ✅ include viewedAt in final response
              rentalAmount: property.rentalAmount || property.price, // if fallback needed
            }
          : null;
      })
    );

    const finalProperties = properties.filter(Boolean);

    return res.status(200).json({
      message: "Most viewed rental properties (3+ views in last 30 days)",
      properties: finalProperties,
    });
  } catch (error) {
    console.error("Error fetching most viewed rental properties:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


// GET all views for a phone number
router.get('/get-buyer-assist-views', async (req, res) => {
  const { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  try {
    const views = await BuyerAssistView.find({ phoneNumber }).sort({ viewedAt: -1 }); // recent first
    return res.status(200).json({ success: true, views });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});



// GET count of views for a phone number
router.get('/get-buyer-assist-view-count', async (req, res) => {
  const { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  try {
    const count = await BuyerAssistView.countDocuments({ phoneNumber });
    return res.status(200).json({ success: true, phoneNumber, count });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});


router.post("/request-address-rent", async (req, res) => {
  try {
    const { rentId, requesterPhoneNumber } = req.body;

    if (!rentId || !requesterPhoneNumber) {
      return res.status(400).json({ message: "rentId and requesterPhoneNumber are required." });
    }

    // Check for existing request
    const existingRequest = await AddressRequest.findOne({ rentId, requesterPhoneNumber });
    if (existingRequest) {
      return res.status(409).json({ message: "You have already requested the address for this property." });
    }

    const property = await AddModel.findOne({ rentId });
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    const newRequest = new AddressRequest({
      rentId,
      requesterPhoneNumber,
      postedUserPhoneNumber: property.phoneNumber,
      city: property.city,
      district: property.district,
      area: property.area,
    });

    await newRequest.save();

    // Optional: Send notification to property owner
    try {
      await NotificationUser.create({
        recipientPhoneNumber: property.phoneNumber,
        senderPhoneNumber: requesterPhoneNumber,
        rentId,
        message: `User ${requesterPhoneNumber} requested address details for your property.`,
        createdAt: new Date()
      });
    } catch (err) {
      console.error("Notification error:", err.message);
    }

    res.status(201).json({ message: "Address request submitted successfully.", request: newRequest });
  } catch (error) {
    res.status(500).json({ message: "Error submitting address request.", error: error.message });
  }
});

// router.put('/update-property-status', async (req, res) => {
//   const { rentId, status } = req.body;

//   if (!rentId || !status) {
//     return res.status(400).json({ message: 'Rent ID and status are required.' });
//   }

//   try {
//     const updatedProperty = await AddModel.findOneAndUpdate(
//       { rentId },
//       { status },
//       { new: true }
//     );

//     if (!updatedProperty) {
//       return res.status(404).json({ message: 'Property not found.' });
//     }

//     res.status(200).json({ message: 'Status updated successfully.', updatedProperty });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating property status.', error });
//   }
// });


router.put('/update-property-status', async (req, res) => {
  const { rentId, status } = req.body;

  if (!rentId || !status) {
    return res.status(400).json({ message: 'Rent ID and status are required.' });
  }

  const allowedToOverrideActive = ['delete', 'pending', 'expired'];

  try {
    const property = await AddModel.findOne({ rentId });

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // If trying to overwrite 'active' with other than allowed
    // if (property.status === 'active' && !allowedToOverrideActive.includes(status)) {
    //   return res.status(400).json({
    //     message: `Cannot update status from 'active' to '${status}'. Only allowed: delete, pending, expired.`,
    //   });
    // }

    // Update and save. validateModifiedOnly: only validate the paths we changed
    // (status). Legacy docs may carry stale out-of-enum values in unrelated fields;
    // a status-only update must not be blocked by them.
    property.status = status;
    await property.save({ validateModifiedOnly: true });

    res.status(200).json({
      message: 'Status updated successfully.',
      updatedProperty: property,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating property status.', error });
  }
});


router.delete('/delete-data', async (req, res) => {
  const { phoneNumber, rentId } = req.query;

  // Ensure at least one parameter is provided
  if (!phoneNumber && !rentId) {
    return res.status(400).json({ message: 'Either phone number or Rent ID is required.' });
  }

  try {
    // Normalize phone number (remove spaces, dashes, country code, and ensure consistency)
    const normalizedPhoneNumber = phoneNumber
      ? phoneNumber.replace(/[\s-]/g, '').replace(/^(\+91|91|0)/, '').trim()
      : null;

    // Build query dynamically based on the provided parameters
    const query = {};
    if (normalizedPhoneNumber) query.phoneNumber = new RegExp(normalizedPhoneNumber + '$');
    if (rentId) query.rentId = rentId;

    // Delete user from the database
    const deletedUser = await AddModel.findOneAndDelete(query);

    // Check if user was found and deleted
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Return success response
    res.status(200).json({ message: 'User deleted successfully!', deletedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user.', error });
  }
});


router.put('/delete-datas', async (req, res) => {
  const { phoneNumber, rentId } = req.query;
  const { deletionReason, deletionDate } = req.body;

  // Ensure at least one parameter is provided
  if (!phoneNumber && !rentId) {
    return res.status(400).json({ message: 'Either phone number or Rent ID is required.' });
  }

  // Validate deletion reason is provided
  if (!deletionReason || deletionReason.trim() === '') {
    return res.status(400).json({ message: 'Deletion reason is required.' });
  }

  try {
    // Normalize phone number (remove spaces, dashes, country code, and ensure consistency)
    const normalizedPhoneNumber = phoneNumber
      ? phoneNumber.replace(/[\s-]/g, '').replace(/^(\+91|91|0)/, '').trim()
      : null;

    // Build query dynamically based on the provided parameters
    const query = {};
    if (normalizedPhoneNumber) query.phoneNumber = new RegExp(normalizedPhoneNumber + '$');
    if (rentId) query.rentId = rentId;

    // Update document with deletion information (soft delete)
    const updatedUser = await AddModel.findOneAndUpdate(
      query,
      {
        $set: {
          status: 'delete',
          deletionReason: deletionReason.trim(),
          deletionDate: deletionDate || new Date()
        }
      },
      { new: true } // Return the updated document
    );

    // Check if user was found and updated
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Return success response
    res.status(200).json({ 
      message: 'User marked as deleted successfully!',
      updatedUser 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error marking user as deleted.', 
      error: error.message 
    });
  }
});

router.delete('/delete-rentId-data', async (req, res) => {
  const { rentId } = req.query;
  const { deletedBy } = req.body; // Admin name from request body

  // Validation
  if (!rentId) {
    return res.status(400).json({ message: 'Rent ID is required.' });
  }

  if (!deletedBy) {
    return res.status(400).json({ message: 'Admin name (deletedBy) is required.' });
  }

  try {
    // Step 1: Find the document in AddModel
    const userToDelete = await AddModel.findOne({ rentId });
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Step 2: Save the data to DeletedAddModel
    const deletedRecord = await DeletedAddModel.create({
      ...userToDelete.toObject(),
      deletedAt: new Date(),
      permanentDeletedBy: deletedBy // Add admin name here
    });

    // Step 3: Delete from AddModel
    await AddModel.deleteOne({ rentId });

    // Step 4: Return response
    res.status(200).json({
      message: 'User permanently deleted successfully!',
      deletedUser: deletedRecord
    });

  } catch (error) {
    res.status(500).json({ message: 'Error deleting user.', error });
  }
});

// // Mark property as deleted
// router.put('/admin-delete', async (req, res) => {
//   try {
//     const { rentId } = req.query;
//     const { deletionReason } = req.body;
    
//     const updated = await AddModel.findOneAndUpdate(
//       { rentId },
//       { 
//         status: "delete",  // Changed from "inactive" to "delete"
//         deletionReason,
//         deletionDate: new Date(),
//         isActive: false
//       },
//       { new: true }
//     );
    
//     if (!updated) {
//       return res.status(404).json({ success: false, message: "Property not found" });
//     }
    
//     res.json({ 
//       success: true, 
//       message: "Property marked as deleted", 
//       property: updated 
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // Undo delete action
// router.put('/admin-undo-delete', async (req, res) => {
//   try {
//     const { rentId } = req.query;
    
//     const property = await AddModel.findOne({ rentId });
//     if (!property) {
//       return res.status(404).json({ success: false, message: "Property not found" });
//     }

//     // Determine the appropriate status to revert to
//     let newStatus = "active";
//     if (property.paymentData && property.paymentData.payustatususer === "success") {
//       newStatus = "complete";
//     }

//     const updated = await AddModel.findOneAndUpdate(
//       { rentId },
//       { 
//         status: newStatus,  // Now properly sets to either "active" or "complete"
//         deletionReason: null,
//         deletionDate: null,
//         isActive: true
//       },
//       { new: true }
//     );
    
//     res.json({ 
//       success: true, 
//       message: "Delete action undone", 
//       property: updated 
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });


// // Example backend route (Node.js/Express)
// router.put('/admin-delete', async (req, res) => {
//   try {
//     const { rentId } = req.query;
//     const { deletionReason } = req.body;
    
//     const updated = await AddModel.findOneAndUpdate(
//       { rentId },
//       { 
//         status: "delete",
//         deletionReason,
//         deletionDate: new Date(),
//         isActive: false
//       },
//       { new: true }
//     );
    
//     res.json({ success: true, message: "Property marked as deleted", property: updated });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// router.put('/admin-undo-delete', async (req, res) => {
//   try {
//     const { rentId } = req.query;
    
//     const updated = await AddModel.findOneAndUpdate(
//       { rentId },
//       { 
//         status: "complete",
//         deletionReason: null,
//         deletionDate: null,
//         isActive: true
//       },
//       { new: true }
//     );
    
//     res.json({ success: true, message: "Delete action undone", property: updated });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

router.put('/activate-all-properties', async (req, res) => {
  try {
    await AddModel.updateMany({}, { $set: { status: "active" } });
    res.status(200).json({ message: "All properties activated successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to activate all properties." });
  }
});


  // Delete all properties endpoint
router.delete('/delete-all-properties', async (req, res) => {
  try {
    const result = await AddModel.deleteMany({}); // Deletes all documents in the collection
    res.status(200).json({ message: 'All properties deleted successfully.', deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting all properties.' });
  }
});



router.get('/properties/pending-rent', async (req, res) => {
  try {
    const pendingProperties = await AddModel.find({ status: 'incomplete' }).lean();
    const allPlans = await PricingPlans.find();
    const allAds = await AddModel.find();
    const allPayments = await PaymentPayU.find();

    const adsCountByPhone = allAds.reduce((acc, ad) => {
      acc[ad.phoneNumber] = (acc[ad.phoneNumber] || 0) + 1;
      return acc;
    }, {});

    const requiredFields = [
      'rentId', 'phoneNumber', 'propertyMode', 'propertyType',
      'postedBy', 'rentType', 'rentalAmount', 'floorNo',
      'bedrooms', 'state', 'city', 'area', 'totalArea',
      'areaUnit', 'availableDate'
    ];

    const incompleteUsers = await Promise.all(pendingProperties.map(async (property) => {
      const isComplete = requiredFields.every(field => {
        const value = property[field];
        return value !== undefined && value !== null && String(value).trim() !== '';
      });

      const phone = property.phoneNumber;
      const rentId = property.rentId;

      // Match plan by phone number & rentId
      let selectedPlan = null;
      for (const plan of allPlans) {
        if (!Array.isArray(plan.phoneNumbers)) continue;

        for (const pn of plan.phoneNumbers) {
          if (pn.number === phone && pn.rentId === rentId) {
            const createdDate = pn.createdAt || null;
            let expireDate = null;

            if (createdDate && plan.durationDays) {
              const created = new Date(createdDate);
              expireDate = new Date(created.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
            }

            selectedPlan = {
              planName: plan.name || 'N/A',
              planDuration: plan.durationDays || 'N/A',
              packageType: plan.packageType || 'N/A',
              planCreatedAt: createdDate ? new Date(createdDate).toLocaleDateString() : 'N/A',
              planExpiryDate: expireDate ? new Date(expireDate).toLocaleDateString() : 'N/A',
            };
            break;
          }
        }

        if (selectedPlan) break;
      }

      // Match payment if available
      const matchedPayment = allPayments.find(payment =>
        payment.phone === phone && String(payment.rentId) === String(rentId)
      );

      const paymentInfo = matchedPayment
        ? {
            payUStatus: matchedPayment.payUStatus || 'N/A',
            payustatususer: matchedPayment.payustatususer || 'N/A',
            paymentId: matchedPayment.paymentId || 'N/A',
            transactionId: matchedPayment.transactionId || 'N/A',
            payUCreatedAt: matchedPayment.createdAt || null,
            payUUpdatedAt: matchedPayment.updatedAt || null
          }
        : {
            payUStatus: 'N/A',
            payustatususer: 'N/A',
            paymentId: 'N/A',
            transactionId: 'N/A',
            payUCreatedAt: null,
            payUUpdatedAt: null
          };

      return {
        ...property,
        required: isComplete ? 'yes' : 'no',
        adsCount: adsCountByPhone[phone] || 0,
        ...(selectedPlan || {
          planName: 'N/A',
          planDuration: 'N/A',
          packageType: 'N/A',
          planCreatedAt: 'N/A',
          planExpiryDate: 'N/A'
        }),
        ...paymentInfo
      };
    }));

    const filtered = incompleteUsers.filter(u => u.required === 'no');

    res.status(200).json({
      message: 'Pending properties with incomplete required fields and plan info fetched successfully!',
      users: filtered
    });
  } catch (error) {
    console.error('Error in /properties/pending-rent:', error);
    res.status(500).json({
      message: 'Error fetching pending properties.',
      error: error.message
    });
  }
});


// Soft Delete Route using rentId
router.put('/admin-delete', async (req, res) => {
  const { rentId } = req.query;
  const { deletionReason } = req.body;

  if (!rentId) {
    return res.status(400).json({ message: 'Rent-ID is required.' });
  }

  if (!deletionReason || deletionReason.trim() === '') {
    return res.status(400).json({ message: 'Deletion reason is required.' });
  }

  try {
    // Get current item first
    const currentItem = await AddModel.findOne({ rentId });

    if (!currentItem) {
      return res.status(404).json({ message: 'Item not found with the provided Rent-ID.' });
    }

    const updatedItem = await AddModel.findOneAndUpdate(
      { rentId },
      {
        isDeleted: true,
        deletionReason: deletionReason.trim(),
        deletionDate: new Date(),
        previousStatus: currentItem.status, // ⬅️ Store previous status
        status: 'delete'
      },
      { new: true }
    );

    res.status(200).json({ 
      message: 'Item marked as deleted successfully!',
      data: updatedItem
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error marking item as deleted.', 
      error: error.message 
    });
  }
});

// Undo Delete by rentId
router.put('/admin-undo-delete', async (req, res) => {
  const { rentId } = req.query;

  if (!rentId) {
    return res.status(400).json({ message: 'Rent-ID is required.' });
  }

  try {
    // First get the current item to fetch its previousStatus
    const currentItem = await AddModel.findOne({ rentId });

    if (!currentItem) {
      return res.status(404).json({ message: 'Item not found with the provided Rent-ID.' });
    }

    const restoredItem = await AddModel.findOneAndUpdate(
      { rentId },
      {
        isDeleted: false,
        deletionReason: null,
        deletionDate: null,
        status: currentItem.previousStatus || 'incomplete', // ⬅️ Restore previous status
        previousStatus: null // optional: clear it
      },
      { new: true }
    );

    res.status(200).json({ 
      message: 'Item restored successfully!',
      data: restoredItem
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error restoring item.', 
      error: error.message 
    });
  }
});


router.get('/properties/deleted-rent', async (req, res) => {
  try {
    const deletedProperties = await AddModel.find({ status: 'delete' });
    const plans = await PricingPlans.find();
    const bills = await Bill.find();

    const processedDeleted = await Promise.all(deletedProperties.map(async property => {
      // Match Plan
      const matchedPlan = plans.find(plan =>
        Array.isArray(plan.phoneNumber)
          ? plan.phoneNumber.includes(property.phoneNumber)
          : plan.phoneNumber === property.phoneNumber
      );

      let planCreatedAt = 'N/A';
      let planExpiryDate = 'N/A';

      if (matchedPlan?.createdAt && matchedPlan?.durationDays) {
        const expiry = new Date(matchedPlan.createdAt).getTime() + matchedPlan.durationDays * 24 * 60 * 60 * 1000;
        planCreatedAt = new Date(matchedPlan.createdAt).toLocaleDateString();
        planExpiryDate = new Date(expiry).toLocaleDateString();
      }

      // Match Bill using rentId
      const matchedBill = bills.find(bill =>
        bill.ownerPhone === property.phoneNumber || bill.rentId === property.rentId
      );

      let adminOffice = 'N/A';
      let adminName = 'N/A';
      let billNo = 'N/A';
      let billDate = 'N/A';
      let validity = 'N/A';
      let billExpiryDate = 'N/A';

      if (matchedBill) {
        adminOffice = matchedBill.adminOffice || 'N/A';
        adminName = matchedBill.adminName || 'N/A';
        billNo = matchedBill.billNo || 'N/A';
        billDate = matchedBill.billDate || 'N/A';
        validity = matchedBill.validity || 'N/A';

        if (billDate !== 'N/A' && validity !== 'N/A') {
          const billStart = new Date(billDate).getTime();
          const billExp = billStart + validity * 24 * 60 * 60 * 1000;
          billExpiryDate = new Date(billExp).toLocaleDateString();
        }
      }

      // Count other active ads from same phone number
      const adsCount = await AddModel.countDocuments({
        phoneNumber: property.phoneNumber,
        status: { $ne: 'delete' }
      });

      // Required Fields Check (replacing 'price' with 'rentalAmount')
      const requiredFields = [
        'propertyMode', 'propertyType', 'rentalAmount',
        'totalArea', 'areaUnit',
        'salesType', 'postedBy'
      ];

      const required = requiredFields.every(field =>
        property[field] !== undefined && property[field] !== null && property[field] !== ''
      ) ? 'Yes' : 'No';

      return {
        ...property._doc,
        planName: matchedPlan?.name || 'N/A',
        planCreatedAt,
        planExpiryDate,
        packageType: matchedPlan?.packageType || 'N/A',
        planDuration: matchedPlan?.durationDays || 'N/A',
        adminOffice,
        adminName,
        billNo,
        billDate,
        validity,
        billExpiryDate,
        adsCount,
        required,
        // deletedBy: property.deletedBy || 'User',
        // deletedAt: property.deletedAt ? new Date(property.deletedAt).toLocaleDateString() : 'N/A'
      };
    }));

    res.status(200).json({
      message: 'Deleted properties fetched successfully.',
      data: processedDeleted,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching deleted properties.',
      error: error.message,
    });
  }
});

router.put("/undo-delete-view", async (req, res) => {
  const { rentId, phoneNumber } = req.body;

  if (!rentId || !phoneNumber) {
    return res.status(400).json({ message: "rentId and phoneNumber are required." });
  }

  try {
    const updatedUser = await UserViewsModel.findOneAndUpdate(
      { phoneNumber, "viewedProperties.rentId": rentId },
      { $set: { "viewedProperties.$.status": "active" } }, // Restore
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Property not found for this user." });
    }

    res.status(200).json({ message: "Property restored successfully!", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error restoring property.", error: error.message });
  }
});


router.put("/delete-view-property", async (req, res) => {
  const { rentId, phoneNumber } = req.body;

  if (!rentId || !phoneNumber) {
    return res.status(400).json({ message: "rentId and phoneNumber are required." });
  }

  try {
    const updatedUser = await UserViewsModel.findOneAndUpdate(
      { phoneNumber, "viewedProperties.rentId": rentId },
      { $set: { "viewedProperties.$.status": "deleted" } }, // ✅ use "deleted"
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Property not found for this user." });
    }

    res.status(200).json({ message: "Property removed successfully.", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error removing property.", error: error.message });
  }
});

router.get("/photo-requests-with-payment-status/:phoneNumber", async (req, res) => {
  try {
    let phoneNumber = normalizePhoneNumber(req.params.phoneNumber);

    // 1. Fetch all photo requests where this user is the property owner
    const ownerRequests = await PhotoRequest.find({
      $or: [
        { postedUserPhoneNumber: phoneNumber },
        { postedUserPhoneNumber: `+91${phoneNumber}` },
        { postedUserPhoneNumber: `91${phoneNumber}` }
      ]
    });

    if (ownerRequests.length === 0) {
      return res.status(404).json({ message: "No photo requests found for this owner." });
    }

    // 2. Fetch all PayU payment records and build a rentId ➝ status map
    const payments = await PaymentPayU.find().sort({ createdAt: -1 });
    const payuStatusMap = {};
    for (const payment of payments) {
      const rentId = payment.rentId?.toString();
      if (rentId && !payuStatusMap[rentId]) {
        payuStatusMap[rentId] = payment.payustatususer?.toLowerCase() || "pending";
      }
    }

    // 3. Combine property details with PayU status
    const propertyDetails = await Promise.all(
      ownerRequests.map(async (request) => {
        const property = await Property.findOne({ rentId: request.rentId });

        const rentIdStr = request.rentId?.toString();
        const paymentStatus = payuStatusMap[rentIdStr] || "pending";

        return {
          _id: request._id,
          rentId: request.rentId,
          requesterPhoneNumber: request.requesterPhoneNumber,
          propertyMode: property?.propertyMode || "",
          rentalAmount: property?.rentalAmount || 0,
          propertyType: property?.propertyType || "",
          city: property?.city || "",
          status: request.status,
          photoURL: request.photoURL || null,
          createdAt: request.createdAt || null,
          updatedAt: request.updatedAt || null,
          payuStatus: paymentStatus,
        };
      })
    );

    res.status(200).json(propertyDetails);
  } catch (error) {
    console.error("Error fetching photo requests with PayU status:", error);
    res.status(500).json({
      message: "Error fetching data.",
      error: error.message,
    });
  }
});


const normalizePhoneNumber = (phone) => {
  return phone.replace(/[\s-]/g, '').replace(/^(\+91|91|0)/, '').trim();
};


// router.get("/address-requests-rent/owner/:phoneNumber", async (req, res) => {
//   try {
//     let phoneNumber = normalizePhoneNumber(req.params.phoneNumber);

//     const ownerRequests = await AddressRequest.find({
//       $or: [
//         { postedUserPhoneNumber: phoneNumber },
//         { postedUserPhoneNumber: `+91${phoneNumber}` },
//         { postedUserPhoneNumber: `91${phoneNumber}` },
//       ],
//     });

//     if (ownerRequests.length === 0) {
//       return res.status(404).json({ message: "No address requests found for this owner." });
//     }

//     const propertyDetails = await Promise.all(
//       ownerRequests.map(async (request) => {
//         const property = await AddModel.findOne({ rentId: request.rentId });

//         let responseObj = {
//           _id: request._id,
//           rentId: request.rentId,
//           propertyMode: "N/A",
//           rentalAmount: 0,
//           propertyType: "N/A",
//           totalArea: "N/A",
//           bedrooms: "N/A",
//           ownership: "N/A",
//           bestTimeToCall: "N/A",
//           area: "N/A",
//           areaunit: "N/A",
//           streetName: "N/A",
//           nagar: "N/A",
//           pinCode: "N/A",
//           city: "N/A",
//           district: "N/A",
//           status: request.status || "N/A",
//           requesterPhoneNumber: request.requesterPhoneNumber || "N/A",
//           createdAt: request.createdAt || null,
//           updatedAt: request.updatedAt || null,
//         };

//         if (!property) return responseObj;

//         const { area, streetName, nagar, pinCode } = property;

//         const isAddressFilled =
//           area?.trim() && streetName?.trim() && nagar?.trim();

//         if (isAddressFilled && request.status === "address request pending") {
//           await AddressRequest.findByIdAndUpdate(request._id, {
//             previousStatus: request.status,
//             status: "address sent",
//           });
//           responseObj.status = "address sent";
//         }

//         return {
//           ...responseObj,
//           propertyMode: property.propertyMode || "N/A",
//           rentalAmount: property.rentalAmount || 0,
//           propertyType: property.propertyType || "N/A",
//           totalArea: property.totalArea || "N/A",
//           bedrooms: property.bedrooms || "N/A",
//           ownership: property.ownership || "N/A",
//           bestTimeToCall: property.bestTimeToCall || "N/A",
//           area: area || "N/A",
//           areaunit: property.areaUnit || "N/A",
//           streetName: streetName || "N/A",
//           nagar: nagar || "N/A",
//           pinCode: pinCode || "N/A",
//           city: property.city || "N/A",
//           district: property.district || "N/A",
//         };
//       })
//     );

//     res.status(200).json(propertyDetails);
//   } catch (error) {
//     res.status(500).json({
//       message: "Error fetching owner's address requests.",
//       error: error.message,
//     });
//   }
// });

router.get("/address-requests-rent/owner/:phoneNumber", async (req, res) => {
  try {
    let phoneNumber = normalizePhoneNumber(req.params.phoneNumber);

    const requests = await AddressRequest.find({
      $or: [
        { requesterPhoneNumber: phoneNumber },
        { requesterPhoneNumber: `+91${phoneNumber}` },
        { requesterPhoneNumber: `91${phoneNumber}` },
      ],
    });

    if (requests.length === 0) {
      return res.status(404).json({ message: "No address requests found for this requester." });
    }

    const propertyDetails = await Promise.all(
      requests.map(async (request) => {
        const property = await AddModel.findOne({ rentId: request.rentId });

        const responseObj = {
          _id: request._id,
          rentId: request.rentId,
          requesterPhoneNumber: request.requesterPhoneNumber || "N/A",
          postedUserPhoneNumber: request.postedUserPhoneNumber || "N/A",
          status: request.status || "N/A",
          previousStatus: request.previousStatus || "",
          createdAt: request.createdAt || null,
          updatedAt: request.updatedAt || null,
          propertyMode: "N/A",
          rentalAmount: 0,
          propertyType: "N/A",
          totalArea: "N/A",
          bedrooms: "N/A",
          ownership: "N/A",
          bestTimeToCall: "N/A",
          area: "N/A",
          areaunit: "N/A",
          streetName: "N/A",
          nagar: "N/A",
          pinCode: "N/A",
          city: "N/A",
          district: "N/A",
        };

        if (!property) return responseObj;

        return {
          ...responseObj,
          propertyMode: property.propertyMode || "N/A",
          rentalAmount: property.rentalAmount || 0,
          propertyType: property.propertyType || "N/A",
          totalArea: property.totalArea || "N/A",
          bedrooms: property.bedrooms || "N/A",
          ownership: property.ownership || "N/A",
          bestTimeToCall: property.bestTimeToCall || "N/A",
          area: property.area || "N/A",
          areaunit: property.areaUnit || "N/A",
          streetName: property.streetName || "N/A",
          nagar: property.nagar || "N/A",
          pinCode: property.pinCode || "N/A",
          city: property.city || "N/A",
          district: property.district || "N/A",
           postedBy: property.postedBy || "N/A",
          views: property.views || "N/A",
          floorNo: property.floorNo || "N/A",
          
        };
      })
    );

    res.status(200).json(propertyDetails);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching address requests by requester.",
      error: error.message,
    });
  }
});


router.put("/address-requests-rent/delete/:rentId", async (req, res) => {
  try {
    const request = await AddressRequest.findOne({ rentId: req.params.rentId });

    if (!request) {
      return res.status(404).json({ message: "Address request not found." });
    }

    request.previousStatus = request.status;
    request.status = "deleted";

    await request.save();

    res.status(200).json({ message: "Address request marked as deleted.", request });
  } catch (error) {
    res.status(500).json({ message: "Error deleting address request.", error: error.message });
  }
});

router.put("/address-requests-rent/undo/:rentId", async (req, res) => {
  try {
    const request = await AddressRequest.findOne({ rentId: req.params.rentId });

    if (!request) {
      return res.status(404).json({ message: "Address request not found." });
    }

    if (!request.previousStatus) {
      return res.status(400).json({ message: "No previous status to restore." });
    }

    request.status = request.previousStatus;
    request.previousStatus = "";

    await request.save();

    res.status(200).json({ message: "Address request restored to previous status.", request });
  } catch (error) {
    res.status(500).json({ message: "Error undoing delete.", error: error.message });
  }
});


router.get("/address-requests-rent/buyer/:phoneNumber", async (req, res) => {
  try {
    let phoneNumber = normalizePhoneNumber(req.params.phoneNumber);

    const ownerRequests = await AddressRequest.find({
      $or: [
        { postedUserPhoneNumber: phoneNumber },
        { postedUserPhoneNumber: `+91${phoneNumber}` },
        { postedUserPhoneNumber: `91${phoneNumber}` }
      ]
    });

    if (ownerRequests.length === 0) {
      return res.status(404).json({ message: "No address requests found for this owner." });
    }

    const propertyDetails = await Promise.all(
      ownerRequests.map(async (request) => {
        const property = await AddModel.findOne({ rentId: request.rentId });

        return {
          requestId: request._id,
          requesterPhoneNumber: request.requesterPhoneNumber,
          status: request.status,
          createdAt: request.createdAt,
          updatedAt: request.updatedAt,
          property: property || {}
        };
      })
    );

    res.status(200).json(propertyDetails);
  } catch (error) {
    res.status(500).json({ message: "Error fetching owner's address requests.", error: error.message });
  }
});




router.get("/address-requests/count/buyer/:phoneNumber", async (req, res) => {
  try {
    const phoneNumber = normalizePhoneNumber(req.params.phoneNumber);

    const count = await AddressRequest.countDocuments({
      $or: [
        { requesterPhoneNumber: phoneNumber },
        { requesterPhoneNumber: `+91${phoneNumber}` },
        { requesterPhoneNumber: `91${phoneNumber}` }
      ]
    });

    res.status(200).json({ buyerRequestCount: count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching buyer request count.", error: error.message });
  }
});


router.get("/address-requests/count/owner/:phoneNumber", async (req, res) => {
  try {
    const phoneNumber = normalizePhoneNumber(req.params.phoneNumber);

    const count = await AddressRequest.countDocuments({
      $or: [
        { postedUserPhoneNumber: phoneNumber },
        { postedUserPhoneNumber: `+91${phoneNumber}` },
        { postedUserPhoneNumber: `91${phoneNumber}` }
      ]
    });

    res.status(200).json({ ownerRequestCount: count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching owner request count.", error: error.message });
  }
});




// GET /user-last-30-days-views/:phoneNumber
router.get("/user-last-30-days-views-rent/:phoneNumber", async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Normalize the phone number into different formats
    const digits = phoneNumber.replace(/\D/g, "").slice(-10);
    const variants = [`+91${digits}`, `91${digits}`, digits];

    // Find the user's viewed properties
    const userViews = await UserViewsModel.findOne({
      phoneNumber: { $in: variants },
    });

    if (!userViews || !Array.isArray(userViews.viewedProperties)) {
      return res.status(404).json({ message: "No viewed properties found" });
    }

    // Filter views within the last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const recentViews = userViews.viewedProperties
      .filter((view) => {
        const viewedAt = new Date(view.viewedAt);
        return viewedAt >= thirtyDaysAgo && viewedAt <= now;
      })
      .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))
      .slice(0, 30); // Return only the latest 30 views

    if (recentViews.length === 0) {
      return res
        .status(404)
        .json({ message: "No views in the last 30 days" });
    }

    // Fetch property details
    const properties = await Promise.all(
      recentViews.map(async (view) => {
        const prop = await AddModel.findOne({ rentId: view.rentId });
        return prop
          ? {
              ...prop.toObject(),
              viewedAt: view.viewedAt,
            }
          : null;
      })
    );

    const filteredProperties = properties.filter(Boolean);

    return res.status(200).json({
      message: "Viewed properties in the last 30 days (max 30 results)",
      properties: filteredProperties,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/property-buyer-viewed", async (req, res) => {
  let { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Owner phone number is required" });
  }

  // Normalize phone number and check different possible formats
  const normalizedPhone = phoneNumber.replace(/\s+/g, "").replace("+", "");
  const possibleNumbers = [
    normalizedPhone,
    "+" + normalizedPhone,
    normalizedPhone.replace(/^91/, ""),
  ];


  try {
    // Fetch all properties posted by the owner
    const ownerProperties = await AddModel.find({ phoneNumber: { $in: possibleNumbers } });

    if (!ownerProperties.length) {
      return res.status(404).json({ message: "No properties found for this owner" });
    }

    // Extract all PPC IDs
    const ownerPpcIds = ownerProperties.map((property) => property.ppcId);

    // Fetch users who viewed these properties
    const viewedUsers = await UserViewsModel.find({ "viewedProperties.ppcId": { $in: ownerPpcIds } });

    if (!viewedUsers.length) {
      return res.status(404).json({ message: "No viewed users found for this owner" });
    }


    // Fetch full property details
    const propertyDetails = await AddModel.find({ ppcId: { $in: ownerPpcIds } });

    // Convert property details into a Map for quick lookup
    const propertyMap = new Map();
    propertyDetails.forEach((property) => {
      propertyMap.set(property.ppcId, property.toObject()); // Convert Mongoose doc to plain object
    });

    // Organizing response data
    const response = viewedUsers.map((user) => ({
      viewerPhoneNumber: user.phoneNumber,
      viewedProperties: user.viewedProperties
        .filter((vp) => ownerPpcIds.includes(vp.ppcId)) // Ensure only relevant properties are included
        .map((vp) => ({
          ppcId: vp.ppcId,
          propertyOwnerPhoneNumber: vp.propertyOwnerPhoneNumber,
          viewedAt: vp.viewedAt,
          _id: vp._id,
          propertyDetails: propertyMap.get(vp.ppcId) || null, // Attach full property details
        })),
    }));

    return res.status(200).json({
      message: "Viewed users retrieved successfully",
      ownerPhoneNumber: normalizedPhone,
      viewedUsers: response,
    });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


router.get('/get-soldout-owner-count', async (req, res) => {
  const { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required.' });
  }

  try {
    const cleanPhone = phoneNumber.trim().replace(/[^+\d]/g, ''); // Normalize phone number

    // Fetch all properties where the user has reported sold-out
    const properties = await AddModel.find({
      'soldOutReport.phoneNumber': { $regex: cleanPhone, $options: 'i' }
    });

    // 🧠 Extract unique PPC IDs (safety against duplicates)
    const uniquePpcIds = new Set(properties.map(p => p.rentId));

    return res.status(200).json({
      success: true,
      soldOutOwnersCount: uniquePpcIds.size,
      ppcIds: Array.from(uniquePpcIds) // Optional, for debug
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});


router.get("/fetch-owner-matched-properties/count", async (req, res) => {
  try {
    let { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Buyer Assistance phone number is required" });
    }

    // Normalize phone number
    const normalizedPhone = phoneNumber.replace(/\D/g, "").slice(-10);


    // Fetch all Buyer Assistance Requests for this user
    const buyerRequests = await BuyerAssistance.find({
      phoneNumber: { $regex: new RegExp(`${normalizedPhone}$`, "i") }
    });

    if (!buyerRequests.length) {
      return res.status(404).json({ message: "No Buyer Assistance requests found for this phone number" });
    }


    let matchedPropertyCount = 0;

    for (let buyerRequest of buyerRequests) {
   

      // Count Owner-Matched Properties
      const count = await AddModel.countDocuments({
        propertyMode: buyerRequest.propertyMode,
        propertyType: buyerRequest.propertyType,
        state: buyerRequest.state,
        rentalAmount: { $gte: Number(buyerRequest.minPrice), $lte: Number(buyerRequest.maxPrice) }
      });

      matchedPropertyCount += count;
    }

    res.status(200).json({
      message: "Owner-Matched Property count fetched successfully!",
      matchedPropertyCount
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});



// router.get('/get-contact-buyer-count', async (req, res) => {
//   try {
//     let { postedPhoneNumber } = req.query;

//     if (!postedPhoneNumber) {
//       return res.status(400).json({ message: "Posted user phone number is required." });
//     }

//     // Normalize phone number format
//     postedPhoneNumber = postedPhoneNumber.replace(/\D/g, "");
//     if (postedPhoneNumber.startsWith("91") && postedPhoneNumber.length === 12) {
//       postedPhoneNumber = postedPhoneNumber.slice(2);
//     }

//     // Fetch only 'contact' status properties
//     const properties = await AddModel.find({
//       status: "contact",
//       $or: [
//         { phoneNumber: postedPhoneNumber },
//         { phoneNumber: `+91${postedPhoneNumber}` },
//         { phoneNumber: `91${postedPhoneNumber}` }
//       ]
//     });

//     if (properties.length === 0) {
//       return res.status(200).json({ contactBuyerCount: 0 });
//     }

//     // Count total contact requests only from 'contact' status properties
//     const contactBuyerCount = properties.reduce((total, property) => {
//       return total + (property.contactRequests?.filter(req => req.phoneNumber).length || 0);
//     }, 0);

//     return res.status(200).json({ contactBuyerCount });

//   } catch (error) {
//     return res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// });



// ✅ Fetch Favorite Requests Count



// router.get('/get-contact-buyer-count', async (req, res) => {
//   try {
//     let { postedPhoneNumber } = req.query;

//     if (!postedPhoneNumber) {
//       return res.status(400).json({ message: "Posted user phone number is required." });
//     }

//     // Normalize phone number
//     postedPhoneNumber = postedPhoneNumber.replace(/\D/g, "");
//     if (postedPhoneNumber.startsWith("91") && postedPhoneNumber.length === 12) {
//       postedPhoneNumber = postedPhoneNumber.slice(2);
//     }

//     // Fetch all properties posted by this user (ignore status filter)
//     const properties = await AddModel.find({
//       $or: [
//         { phoneNumber: postedPhoneNumber },
//         { phoneNumber: `+91${postedPhoneNumber}` },
//         { phoneNumber: `91${postedPhoneNumber}` }
//       ]
//     });

//     if (!properties.length) {
//       return res.status(200).json({ contactBuyerCount: 0 });
//     }

//     // Count total contact requests across all matched properties
//     const contactBuyerCount = properties.reduce((total, property) => {
//       const count = Array.isArray(property.contactRequests)
//         ? property.contactRequests.filter(req => req.phoneNumber).length
//         : 0;
//       return total + count;
//     }, 0);

//     return res.status(200).json({ contactBuyerCount });

//   } catch (error) {
//     return res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// });



router.get("/get-favorite-buyer-count", async (req, res) => {
  try {
      let { postedPhoneNumber } = req.query;

      if (!postedPhoneNumber) {
          return res.status(400).json({ message: "Posted user phone number is required." });
      }

      // Normalize phone number format
      postedPhoneNumber = postedPhoneNumber.replace(/\D/g, "");
      if (postedPhoneNumber.startsWith("91") && postedPhoneNumber.length === 12) {
          postedPhoneNumber = postedPhoneNumber.slice(2);
      }

      // Find properties related to the posted phone number
      const properties = await AddModel.find({
          $or: [
              { phoneNumber: postedPhoneNumber },
              { phoneNumber: `+91${postedPhoneNumber}` },
              { phoneNumber: `91${postedPhoneNumber}` }
          ]
      });

      if (properties.length === 0) {
          return res.status(200).json({ favoriteRequestsCount: 0 });
      }

      // Count total number of favorite requests
      const favoriteRequestsCount = properties.reduce((total, property) => {
          return total + (property.favoriteRequests?.filter(req => req.phoneNumber).length || 0);
      }, 0);

      return res.status(200).json({ favoriteRequestsCount });

  } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// GET /get-favorite-owner-count?phoneNumber=9080829754
router.get('/get-favorite-owner-count', async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required." });
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    const regex = new RegExp(`${cleanPhone}$`, 'i'); // Match last 10 digits

    // Count how many properties include this user in favoriteRequests
    const favoriteOwnerCount = await AddModel.countDocuments({
      favoriteRequests: {
        $elemMatch: {
          phoneNumber: { $regex: regex }
        }
      }
    });

    res.status(200).json({
      message: "Favorite owner count fetched successfully.",
      favoriteOwnerCount
    });

  } catch (error) {
    console.error("Error in favorite owner count API:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


// ✅ Count of interested buyers for all properties posted by a user
router.get('/interest-buyers-count/:postedPhoneNumber', async (req, res) => {
  try {
    let { postedPhoneNumber } = req.params;

    if (!postedPhoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Normalize phone number
    postedPhoneNumber = postedPhoneNumber.replace(/\D/g, '');
    if (postedPhoneNumber.startsWith('91') && postedPhoneNumber.length === 12) {
      postedPhoneNumber = postedPhoneNumber.slice(2);
    }

    // Fetch properties posted by the owner
    const properties = await AddModel.find({
      $or: [
        { phoneNumber: postedPhoneNumber },
        { phoneNumber: `91${postedPhoneNumber}` },
        { phoneNumber: `+91${postedPhoneNumber}` }
      ]
    });

    if (!properties.length) {
      return res.status(404).json({ message: 'No properties found for this phone number.' });
    }

    // Count total interested buyers across all properties
    const interestBuyersCount = properties.reduce((total, property) => {
      return total + (property.interestRequests?.length || 0);
    }, 0);

    res.status(200).json({ interestBuyersCount });
  } catch (error) {
    console.error('Error fetching interest buyer count:', error);
    res.status(500).json({ error: error.message });
  }
});



// router.get('/get-interest-sent-count', async (req, res) => {
//   const { phoneNumber } = req.query;

//   if (!phoneNumber) {
//     return res.status(400).json({ success: false, message: 'Phone number is required.' });
//   }

//   try {
//     const normalizedPhone = phoneNumber.replace(/\s/g, "");

//     // Find all properties where this number appears in interestRequests or interestedUserPhoneNumbers
//     const properties = await AddModel.find({
//       $or: [
//         { 'interestRequests.phoneNumber': { $regex: normalizedPhone, $options: "i" } },
//         { interestedUserPhoneNumbers: { $in: [normalizedPhone] } }
//       ]
//     });

//     const ppcIds = properties.map(p => p.ppcId).filter(Boolean);
//     const uniquePpcIds = [...new Set(ppcIds)];

//     return res.status(200).json({
//       success: true,
//       interestSentCount: uniquePpcIds.length,
//       interestedPpcIds: uniquePpcIds
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: 'Internal Server Error',
//       error: error.message
//     });
//   }
// });


router.get('/get-interest-sent-count', async (req, res) => {
  const { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required.' });
  }

  try {
    const normalizedPhone = phoneNumber.replace(/\D/g, "");

    // Step 1: Fetch all properties where interestRequests contain this phone number
    const properties = await AddModel.find({
      interestRequests: {
        $elemMatch: {
          phoneNumber: {
            $in: [
              normalizedPhone,
              `+91${normalizedPhone}`,
              `91${normalizedPhone}`
            ]
          }
        }
      }
    });

    // Step 2: Extract rentId/ppcId and deduplicate
    const rentIds = properties.map(p => p.rentId || p.ppcId).filter(Boolean);
    const uniqueRentIds = [...new Set(rentIds)];

    return res.status(200).json({
      success: true,
      interestSentCount: uniqueRentIds.length,
      interestedRentIds: uniqueRentIds
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
});


// Endpoint to count the views in the last 10 days
router.get("/user-view-count/:phoneNumber", async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const digits = phoneNumber.replace(/\D/g, "").slice(-10);
    const variants = [`+91${digits}`, `91${digits}`, digits];

    // Fetch user views data
    const userViews = await UserViewsModel.findOne({
      phoneNumber: { $in: variants },
    });

    if (!userViews || !Array.isArray(userViews.viewedProperties)) {
      return res.status(404).json({ message: "No viewed properties found" });
    }

    const now = new Date();
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(now.getDate() - 10);

    // Filter views in the last 10 days
    const recentViews = userViews.viewedProperties.filter((view) => {
      const viewedAt = new Date(view.viewedAt);
      return viewedAt >= tenDaysAgo && viewedAt <= now;
    });

    return res.status(200).json({
      message: `View count in the last 10 days for ${phoneNumber}`,
      viewCount: recentViews.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.get('/get-contact-owner-count', async (req, res) => {
  const { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required.' });
  }

  try {
    const cleanPhone = phoneNumber.trim().replace(/[^+\d]/g, '');
    const regex = new RegExp(`${cleanPhone}$`, 'i');

    const propertiesWithContactRequests = await AddModel.find({
      'contactRequests.phoneNumber': { $regex: regex }
    });

    if (!propertiesWithContactRequests.length) {
      return res.status(200).json({
        success: true,
        message: 'No contact requests found.',
        contactRequestsCount: 0,
        contactOwnersCount: 0,
        owners: []
      });
    }

    // This mirrors your `/get-contact-owner-rent` structure
    const contactRequestsData = propertiesWithContactRequests.map(property => ({
      rentId: property.rentId,
      postedUserPhoneNumber: property.phoneNumber,
    }));

    const contactRequestsCount = contactRequestsData.length;
    const uniqueOwners = [...new Set(contactRequestsData.map(item => item.postedUserPhoneNumber))];

    return res.status(200).json({
      success: true,
      message: 'Contact request count fetched successfully',
      contactRequestsCount,
      contactOwnersCount: uniqueOwners.length,
      owners: uniqueOwners
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
});



// GET /get-most-viewed-properties-count?phoneNumber=xxxxxx
router.get("/get-most-viewed-properties-count", async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Normalize phone
    const digits = phoneNumber.replace(/\D/g, "").slice(-10);
    const variants = [`+91${digits}`, `91${digits}`, digits];

    // Find user views
    const userViews = await UserViewsModel.findOne({
      phoneNumber: { $in: variants }
    });

    if (!userViews || !Array.isArray(userViews.viewedProperties)) {
      return res.status(404).json({ message: "No viewed properties found" });
    }

    // Last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // Filter views in range
    const recentViews = userViews.viewedProperties.filter(view => {
      const viewedAt = new Date(view.viewedAt);
      return viewedAt >= thirtyDaysAgo && viewedAt <= now;
    });

    // Count by PPC ID
    const viewCounts = {};
    recentViews.forEach(view => {
      const id = view.ppcId;
      viewCounts[id] = (viewCounts[id] || 0) + 1;
    });

    // Filter only those with >= 3 views
    const mostViewedCount = Object.values(viewCounts).filter(count => count >= 3).length;

    res.status(200).json({
      message: "Most viewed properties count fetched successfully.",
      mostViewedPropertiesCount: mostViewedCount
    });
  } catch (error) {
    console.error("Error fetching most viewed count:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


router.get("/property-buyer-viewed-count", async (req, res) => {
  let { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Owner phone number is required" });
  }

  const normalizedPhone = phoneNumber.replace(/\s+/g, "").replace("+", "");
  const possibleNumbers = [
    normalizedPhone,
    "+" + normalizedPhone,
    normalizedPhone.replace(/^91/, ""),
  ];

  try {
    // 🔁 Changed from AddModel to RentModel
    const ownerProperties = await AddModel.find({ phoneNumber: { $in: possibleNumbers } });

    if (!ownerProperties.length) {
      return res.status(200).json({ buyerViewedCount: 0 });
    }

    const ownerRentIds = ownerProperties.map((property) => property.rentId);

    // Fetch all users who viewed the rental properties
    const viewedUsers = await UserViewsModel.find({
      "viewedProperties.rentId": { $in: ownerRentIds },
    });

    // Count total views across all users for owner's rental properties
    let totalViews = 0;
    viewedUsers.forEach((user) => {
      totalViews += user.viewedProperties.filter((vp) =>
        ownerRentIds.includes(vp.rentId)
      ).length;
    });

    return res.status(200).json({ buyerViewedCount: totalViews });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});



// Route: /get-deleted-properties
router.get('/get-deleted-properties-datas', async (req, res) => {
  try {
    const deletedData = await DeletedAddModel.find(); // or AddModel.find({ isDeleted: true })
    res.status(200).json({ deleted: deletedData });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch deleted properties.', error });
  }
});


router.get('/expired-plan-properties', async (req, res) => {
  try {
    const paidPlans = await PaymentPayU.find({ payustatususer: 'paid' });
    const expiredPlanDetails = [];

    for (const plan of paidPlans) {
      const { rentId } = plan; // ✅ Use rentId only

      // Fetch corresponding plan document
      const planDoc = await PricingPlans.findOne({ rentId }); // ✅ Match using rentId

      if (planDoc && isExpired(planDoc.expireDate)) {
        // Mark as expired
        plan.payustatususer = 'expiredPlan';
        await plan.save();

        // Fetch all properties for the expired plan's rentId
        const properties = await AddModel.find({ rentId }); // ✅ Match using rentId

        const formattedProperties = properties.map(prop => ({
          rentId: prop.rentId,
          phoneNumber: prop.phoneNumber,
          propertyMode: prop.propertyMode,
          propertyType: prop.propertyType,
          rentalAmount: prop.rentalAmount, // ✅ Replaced price
          totalArea: prop.totalArea,
          areaUnit: prop.areaUnit,
          postedBy: prop.postedBy,
          salesType: prop.salesType,
          status: prop.status,
          createdAt: prop.createdAt ? new Date(prop.createdAt).toLocaleDateString() : 'N/A',
          updatedAt: prop.updatedAt ? new Date(prop.updatedAt).toLocaleDateString() : 'N/A',
        }));

        expiredPlanDetails.push({
          rentId, // ✅ Output rentId only
          phone: plan.phone,
          planName: plan.planName,
          expireDate: planDoc.expireDate,
          payustatususer: 'expiredPlan',
          properties: formattedProperties,
        });
      }
    }

    return res.status(200).json({
      message: 'Expired plans and their properties fetched successfully.',
      data: expiredPlanDetails,
    });
  } catch (error) {
    console.error('Error fetching expired plans:', error);
    res.status(500).json({
      message: 'Error fetching expired plans and properties.',
      error: error.message,
    });
  }
});


router.get('/fetch-all-rent-properties', async (req, res) => {
  try {
    const featuredProperties = await AddModel.find({ featureStatus: 'yes' });

    if (!featuredProperties.length) {
      return res.status(404).json({ message: 'No featured properties found.' });
    }

    const requiredFields = [
      'propertyMode',
      'propertyType',
      'rentalAmount', 
      'totalArea',
      'areaUnit',
      'bedrooms',
    ];

    const result = await Promise.all(
      featuredProperties.map(async (property) => {
        const hasRequiredFields = requiredFields.every(field =>
          property[field] !== undefined &&
          property[field] !== null &&
          String(property[field]).trim() !== ''
        );

        if (!hasRequiredFields) return null;

        // Find plan based on phone number
        const plan = await PricingPlans.findOne({ phoneNumber: property.phoneNumber });

        const planName = plan?.name || 'N/A';
        const createdAt = plan?.createdAt || null;
        const durationDays = plan?.durationDays || null;
        const planExpiryDate = createdAt && durationDays
          ? new Date(new Date(createdAt).getTime() + durationDays * 24 * 60 * 60 * 1000)
          : null;

        return {
          user: {
            phoneNumber: property.phoneNumber,
            planName,
            planCreatedAt: createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A',
            planExpiryDate: planExpiryDate ? new Date(planExpiryDate).toLocaleDateString() : 'N/A',
            durationDays: durationDays || 'N/A',
            packageType: plan?.packageType || 'N/A',
            adminName: plan?.adminName || 'N/A',
            billNo: plan?.billNo || 'N/A',
            billCreatedBy: plan?.createdBy || 'N/A',
            billCreatedAt: createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A',
            adsCount: 1,
          },
          properties: [{
            ...property.toObject(),
            rentId: property.rentId || 'N/A', // ✅ Add rentId if exists
            rentalAmount: property.rentalAmount || 'N/A', // ✅ Ensure rentalAmount is shown
            required: 'Yes',
            planName,
          }]
        };
      })
    );

    const filteredResult = result.filter(item => item !== null);

    res.status(200).json({
      message: "Featured properties with user and plan info fetched successfully!",
      data: filteredResult,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching featured properties.',
      error: error.message,
    });
  }
});



router.get('/get-property-count-by-phone', async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    // Validate phone number
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required.' });
    }

    // Count properties for the given phone number
    const propertyCount = await AddModel.countDocuments({ phoneNumber });

    return res.status(200).json({
      message: 'Property count fetched successfully.',
      phoneNumber,
      propertyCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching property count.',
      error: error.message,
    });
  }
});


router.get('/fetch-delete-status-count', async (req, res) => {
  const { phoneNumber } = req.query;

  if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required.' });
  }

  try {
      // Normalize phone number format
      const normalizedPhoneNumber = phoneNumber
          .replace(/[\s-]/g, '') // Remove spaces & hyphens
          .replace(/^(\+91|91|0)/, '') // Remove country code if exists
          .trim();

      const query = {
          phoneNumber: new RegExp(`^(\\+91)?${normalizedPhoneNumber}$`), 
          status: 'delete',
      };

      const userCount = await AddModel.countDocuments(query);

      res.status(200).json({ message: 'Deleted properties count fetched successfully!', count: userCount });

  } catch (error) {
      res.status(500).json({ 
          message: 'Error fetching deleted properties count.', 
          error: error.message || error 
      });
  }
});

 router.get('/property-count', async (req, res) => {
    const { phoneNumber } = req.query;
  
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required.' });
    }
  
    try {
      const normalizedPhoneNumber = phoneNumber
        .replace(/[\s-]/g, '')
        .replace(/^(\+91|91|0)/, '')
        .trim();
  
      const query = {
        phoneNumber: new RegExp(normalizedPhoneNumber + '$'),
        status: { $in: ['incomplete', 'complete','pending','active'] },
      };
  
      const count = await AddModel.countDocuments(query);
  
      res.status(200).json({
        message: 'Property count fetched successfully!',
        count,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching property count.',
        error,
      });
    }
  });




  router.get("/all-viewed-properties", async (req, res) => {
  try {
    // Fetch all user views data
    const allUserViews = await UserViewsModel.find();

    if (!allUserViews.length) {
      return res.status(404).json({ message: "No property views found" });
    }

    // Extract unique rentIds from all user views
    const allRentIds = [
      ...new Set(
        allUserViews.flatMap((user) =>
          user.viewedProperties.map((view) => view.rentId) // changed from ppcId
        )
      ),
    ];

    if (!allRentIds.length) {
      return res.status(404).json({ message: "No viewed properties found" });
    }

    // Fetch property details using the collected rentIds
    const properties = await AddModel.find(
      { rentId: { $in: allRentIds } }, // changed from ppcId
      "rentId rentalAmount propertyType propertyMode city area totalArea areaUnit postedBy phoneNumber" // updated fields
    );

    // Map properties with the users who viewed them
    const viewedPropertiesData = properties.map((property) => {
      const usersWhoViewed = allUserViews
        .filter((user) =>
          user.viewedProperties.some((view) => view.rentId === property.rentId)
        )
        .map((user) => ({
          phoneNumber: user.phoneNumber,
          viewedAt: user.viewedProperties.find(
            (view) => view.rentId === property.rentId
          )?.viewedAt,
        }));

      return {
        ...property.toObject(),
        viewers: usersWhoViewed,
      };
    });

    return res.status(200).json({
      message: "All viewed properties retrieved successfully",
      viewedProperties: viewedPropertiesData,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});



router.get("/user-get-all-last-views", async (req, res) => {
  try {
    const allUserViews = await UserViewsModel.find();

    if (!allUserViews || allUserViews.length === 0) {
      return res.status(404).json({ message: "No user views found" });
    }

    const result = [];

    for (const user of allUserViews) {
      if (user.viewedProperties.length === 0) continue;

      // Return all viewed properties, not just the last one
      for (const viewed of user.viewedProperties) {
        const property = await AddModel.findOne({ rentId: viewed.rentId });

        if (property) {
          result.push({
            phoneNumber: user.phoneNumber,
            property,
            viewedAt: viewed.viewedAt,
          });
        }
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});



router.get("/user-viewed-list", async (req, res) => {
  try {
    const allUserViews = await UserViewsModel.find({}, {
      phoneNumber: 1,
      dailyViewsCount: 1,
      lastViewDate: 1,
      viewLimitPerDay: 1,
      viewedProperties: 1,
    }).sort({ lastViewDate: -1 });

    res.status(200).json(allUserViews);
  } catch (error) {
    console.error("Error fetching user view list:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});
  



router.get("/user-viewed-details/:phoneNumber", async (req, res) => {
  try {
    const rawPhone = req.params.phoneNumber;
    const normalizedPhone = rawPhone.replace(/\s+/g, "").replace(/\+/g, "");

    const userViews = await UserViewsModel.findOne({ phoneNumber: normalizedPhone });

    if (!userViews) {
      return res.status(404).json({ message: "No view data found for this phone number" });
    }

    const enrichedViews = await Promise.all(
      userViews.viewedProperties.map(async (view) => {
        const propertyDetails = await AddModel.findOne({ ppcId: view.ppcId });
        return {
          ...view.toObject(),
          propertyDetails,
        };
      })
    );

    res.status(200).json({
      phoneNumber: userViews.phoneNumber,
      dailyViewsCount: userViews.dailyViewsCount,
      viewLimitPerDay: userViews.viewLimitPerDay,
      lastViewDate: userViews.lastViewDate,
      viewedProperties: enrichedViews,
    });
  } catch (error) {
    console.error("Error fetching user view details:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


router.get('/fetch-all-featured-properties', async (req, res) => {
  try {
    const featuredProperties = await AddModel.find({ featureStatus: 'yes' });

    if (!featuredProperties.length) {
      return res.status(404).json({ message: 'No featured properties found.' });
    }

    const requiredFields = ['propertyMode', 'propertyType', 'rentalAmount', 'totalArea', 'areaUnit', 'postedBy', 'rentId'];

    const result = await Promise.all(featuredProperties.map(async (property) => {
      const hasRequiredFields = requiredFields.every(field =>
        property[field] !== undefined &&
        property[field] !== null &&
        String(property[field]).trim() !== ''
      );

      if (!hasRequiredFields) return null; // Skip if not all required fields present

      // Find plan for this property's phone number
      const plan = await PricingPlans.findOne({ phoneNumber: property.phoneNumber });

      const planName = plan?.name || 'N/A';
      const createdAt = plan?.createdAt || null;
      const durationDays = plan?.durationDays || null;
      const planExpiryDate = createdAt && durationDays
        ? new Date(new Date(createdAt).getTime() + durationDays * 24 * 60 * 60 * 1000)
        : null;

      return {
        user: {
          phoneNumber: property.phoneNumber,
          planName,
          planCreatedAt: createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A',
          planExpiryDate: planExpiryDate ? new Date(planExpiryDate).toLocaleDateString() : 'N/A',
          durationDays: durationDays || 'N/A',
          packageType: plan?.packageType || 'N/A',
          adminName: plan?.adminName || 'N/A',
          billNo: plan?.billNo || 'N/A',
          billCreatedBy: plan?.createdBy || 'N/A',
          billCreatedAt: createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A',
          adsCount: 1,
        },
        properties: [{
          ...property.toObject(),
          required: 'Yes',
          planName,
          // Removed: ppcId, price
          // rentId and rentalAmount already present in the object
        }]
      };
    }));

    const filteredResult = result.filter(item => item !== null);

    res.status(200).json({
      message: "Featured properties with user and plan info fetched successfully!",
      data: filteredResult,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching featured properties.',
      error: error.message,
    });
  }
});

router.get('/fetch-all-paid-plans', async (req, res) => {
  try {
    // ✅ Fetch PAID Bills ONLY (NOT free)
    // Free bills have: paymentType === 'free' OR planName === 'Free'
    // Paid bills have: paymentType in [cash, online-pg, ...] AND paymentType !== 'free'
    const paidPaymentTypes = ['Cash', 'Online-PG', 'Online-PG-Link', 'Online-Bank-Deposit', 'Online-upi-KR', 'Online-upi-others'];
    
     const paidBills = await Bill.find({
      $and: [
        { paymentType: { $in: paidPaymentTypes } },  
        
      ]
    }).sort({ createdAt: -1 });

    if (!paidBills.length) {
      return res.status(404).json({ message: 'No paid bills found.' });
    }

    // ✅ Helper: Function to check property completeness
    const isPropertyComplete = (property, requiredFields) =>
      requiredFields.every(
        (field) =>
          property[field] !== undefined &&
          property[field] !== null &&
          String(property[field]).trim() !== ''
      );

    // ✅ Process Bills data - fetch properties for each bill
    const billData = await Promise.all(
      paidBills.map(async (bill) => {
        const {
          billNo,
          planName,
          billAmount,
          netAmount,
          paymentType,
          validity,
          ownerPhone,
          adminOffice,
          adminName,
          billCreatedBy,
          createdAt,
          rentId,
        } = bill;

        // ✅ Fetch properties for this specific bill using rentId
        const properties = await AddModel.find({ rentId });
        const requiredFields = [
          'propertyMode',
          'propertyType',
          'rentalAmount',
          'totalArea',
          'areaUnit',
          'bedrooms',
          'floorNo',
          'postedBy',
        ];

        const enhancedProperties = properties
          .map((property) => {
            const hasRequired = isPropertyComplete(property, requiredFields);
            return {
              ...property.toObject(),
              required: hasRequired ? 'Yes' : 'No',
              status: hasRequired ? 'complete' : 'incomplete',
              featureStatus: property.featureStatus || 'N/A',
            };
          })
          .filter((p) => p.required === 'Yes');

        const planExpiryDate =
          validity && createdAt
            ? new Date(new Date(createdAt).getTime() + validity * 24 * 60 * 60 * 1000)
            : null;

        return {
          type: 'Bill',
          referenceId: bill._id,
          bill: {
            billNo,
            planName,
            billAmount,
            netAmount,
            paymentType,
            validity,
            ownerPhone,
            adminOffice,
            adminName,
            billCreatedBy,
            billCreatedAt: createdAt,
            planExpiryDate,
            adsCount: enhancedProperties.length,
            rentId,
          },
          properties: enhancedProperties,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Fetched all Paid Bills with associated properties successfully.',
      count: billData.length,
      data: billData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching paid plan properties.',
      error: error.message,
    });
  }
});



// router.get('/fetch-all-paid-plans', async (req, res) => {
//   try {
//     // Fetch all plans that are NOT 'Free'
//     const users = await PricingPlans.find({ name: { $ne: 'Free' } }); // Only paid plans

//     if (!users.length) {
//       return res.status(404).json({ message: 'No users with Paid plans found.' });
//     }

//     const userPlansWithProperties = await Promise.all(users.map(async (user) => {
//       const {
//         name: planName,
//         phoneNumber,
//         createdAt,
//         durationDays,
//         packageType,
//         adminName,
//         billNo,
//         createdBy,
//       } = user;

//       const planExpiryDate = createdAt && durationDays
//         ? new Date(new Date(createdAt).getTime() + durationDays * 24 * 60 * 60 * 1000)
//         : null;

//       const formattedCreatedAt = createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A';
//       const formattedExpiryDate = planExpiryDate ? new Date(planExpiryDate).toLocaleDateString() : 'N/A';

//       const properties = await AddModel.find({
//         phoneNumber: { $in: phoneNumber },
//       });

//       const requiredFields = ['propertyMode', 'propertyType', 'price', 'totalArea', 'areaUnit', 'salesType', 'postedBy'];
 
//       // const enhancedProperties = properties
//       // .map((property) => {
//       //   const hasRequiredFields = requiredFields.every(field =>
//       //     property[field] !== undefined &&
//       //     property[field] !== null &&
//       //     String(property[field]).trim() !== ''
//       //   );
    
//       //   return {
//       //     ...property.toObject(),
//       //     planName,
//       //     planCreatedAt: formattedCreatedAt,
//       //     durationDays,
//       //     planExpiryDate: formattedExpiryDate,
//       //     packageType: packageType || 'N/A',
//       //     adminName:adminName || 'N/A',
//       //     billNo: billNo || 'N/A',
//       //     billCreatedBy: createdBy || 'N/A',
//       //     billCreatedAt: formattedCreatedAt,
//       //     required: hasRequiredFields ? 'Yes' : 'No',
//       //   };
//       // })
//       // .filter(property => property.required === 'Yes'); // ✅ Filter only 'Yes'
    
//          const enhancedProperties = properties
//   .map((property) => {
//     const hasRequiredFields = requiredFields.every(field =>
//       property[field] !== undefined &&
//       property[field] !== null &&
//       String(property[field]).trim() !== ''
//     );

//     const status = hasRequiredFields ? 'complete' : 'incomplete'; // <-- Fix here

//     return {
//       ...property.toObject(),
//       planName,
//       planCreatedAt: formattedCreatedAt,
//       durationDays,
//       planExpiryDate: formattedExpiryDate,
//       packageType: packageType || 'N/A',
//       adminName: adminName || 'N/A',
//       billNo: billNo || 'N/A',
//       billCreatedBy: createdBy || 'N/A',
//       billCreatedAt: formattedCreatedAt,
//       required: hasRequiredFields ? 'Yes' : 'No',
//       status, // <-- Set here
//     };
//   })
//   .filter(property => property.required === 'Yes'); // only return complete records

      
      
//       return {
//         user: {
//           phoneNumber,
//           planName,
//           planCreatedAt: formattedCreatedAt,
//           planExpiryDate: formattedExpiryDate,
//           durationDays,
//           packageType,
//           adminName:adminName || 'N/A',
//           billNo: billNo || 'N/A',
//           billCreatedBy: createdBy || 'N/A',
//           billCreatedAt: formattedCreatedAt,
//           adsCount: properties.length,
//         },
//         properties: enhancedProperties,
//       };
//     }));

//     res.status(200).json({
//       message: "Paid plan properties and user details fetched successfully!",
//       data: userPlansWithProperties,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: 'Error fetching Paid plans and properties.',
//       error: error.message,
//     });
//   }
// });



// Common function to fetch active users by postedBy type
const fetchActiveUsersByType = async (req, res, type) => {
  try {
    const users = await AddModel.find({
      status: 'active',
      postedBy: type
    });

    res.status(200).json({
      message: `${type} users fetched successfully!`,
      users
    });

  } catch (error) {
    res.status(500).json({
      message: `Error fetching ${type} users.`,
      error: error.message || 'Unknown server error'
    });
  }
};

// API for Owner
router.get('/fetch-active-owner', (req, res) => {
  fetchActiveUsersByType(req, res, 'Owner');
});

// API for Agent
router.get('/fetch-active-agent', (req, res) => {
  fetchActiveUsersByType(req, res, 'Agent');
});

// API for Developer
router.get('/fetch-active-developer', (req, res) => {
  fetchActiveUsersByType(req, res, 'Developer');
});

// API for Promotor
router.get('/fetch-active-promotor', (req, res) => {
  fetchActiveUsersByType(req, res, 'Promotor');
});

// ✅ API for Tenant
router.get('/fetch-active-tenant', (req, res) => {
  fetchActiveUsersByType(req, res, 'Tenant');
});

// ✅ API for Friend
router.get('/fetch-active-friend', (req, res) => {
  fetchActiveUsersByType(req, res, 'Friend');
});

// ✅ Fetch Free Plan details by rent_id
router.get('/fetch-all-free-plan/:rent_id', async (req, res) => {
  try {
    const { rent_id } = req.params;

    // 1️⃣ Check if rent_id exists in PaymentType
    const payment = await PaymentType.findById(rent_id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment type not found.' });
    }

    // 2️⃣ Check if rent_id exists in PricingPlans
    const plan = await PricingPlans.findById(rent_id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found.' });
    }

    // 3️⃣ Check if the plan is Free
    if (plan.name !== 'Free') {
      return res.status(400).json({ message: 'This plan is not a Free plan.' });
    }

    // 4️⃣ Fetch all users having Free plan
    const users = await PricingPlans.find({ name: 'Free' });

    if (!users.length) {
      return res.status(404).json({ message: 'No users with Free plan found.' });
    }

    // 5️⃣ Map user details + properties
    const userPlansWithProperties = await Promise.all(users.map(async (user) => {
      const {
        name: planName,
        phoneNumber,
        createdAt,
        durationDays,
        packageType,
        adminName,
        billNo,
        createdBy,
      } = user;

      // Plan expiry date
      const planExpiryDate = createdAt && durationDays
        ? new Date(new Date(createdAt).getTime() + durationDays * 24 * 60 * 60 * 1000)
        : null;

      const formattedCreatedAt = createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A';
      const formattedExpiryDate = planExpiryDate ? new Date(planExpiryDate).toLocaleDateString() : 'N/A';

      // Fetch properties for user's phone number(s)
      const properties = await AddModel.find({
        phoneNumber: { $in: phoneNumber },
      });

      const requiredFields = ['propertyMode', 'propertyType', 'rentType', 'rentalAmount', 'totalArea', 'areaUnit'];

      // Mark completeness
      const enhancedProperties = properties
        .map((property) => {
          const hasRequiredFields = requiredFields.every(field =>
            property[field] !== undefined &&
            property[field] !== null &&
            String(property[field]).trim() !== ''
          );

          const status = hasRequiredFields ? 'complete' : 'incomplete';

          return {
            ...property.toObject(),
            planName,
            planCreatedAt: formattedCreatedAt,
            durationDays,
            planExpiryDate: formattedExpiryDate,
            packageType: packageType || 'N/A',
            adminName: adminName || 'N/A',
            billNo: billNo || 'N/A',
            billCreatedBy: createdBy || 'N/A',
            billCreatedAt: formattedCreatedAt,
            required: hasRequiredFields ? 'Yes' : 'No',
            status,
          };
        })
        .filter(property => property.required === 'Yes');

      return {
        user: {
          phoneNumber,
          planName,
          planCreatedAt: formattedCreatedAt,
          planExpiryDate: formattedExpiryDate,
          durationDays,
          packageType,
          adminName: adminName || 'N/A',
          billNo: billNo || 'N/A',
          billCreatedBy: createdBy || 'N/A',
          billCreatedAt: formattedCreatedAt,
          adsCount: properties.length,
        },
        properties: enhancedProperties,
      };
    }));

    // 6️⃣ Send final response
    res.status(200).json({
      message: "Free plan's properties and full user details fetched successfully!",
      data: userPlansWithProperties,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching Free plan details.',
      error: error.message,
    });
  }
});



// router.get('/fetch-all-free-plans', async (req, res) => {
//   try {
//     const users = await PricingPlans.find({ name: 'Free' }); // Fetch only Free plans

//     if (!users.length) {
//       return res.status(404).json({ message: 'No users with Free plan found.' });
//     }

//     const userPlansWithProperties = await Promise.all(users.map(async (user) => {
//       const {
//         name: planName,
//         phoneNumber,
//         createdAt,
//         durationDays,
//         packageType,
//         adminName,
//         billNo,
//         createdBy, // Assuming this is billCreatedBy
//       } = user;

//       const planExpiryDate = createdAt && durationDays
//         ? new Date(new Date(createdAt).getTime() + durationDays * 24 * 60 * 60 * 1000)
//         : null;

//       const formattedCreatedAt = createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A';
//       const formattedExpiryDate = planExpiryDate ? new Date(planExpiryDate).toLocaleDateString() : 'N/A';

//       // Fetch all properties associated with this user's phone number(s)
//       const properties = await AddModel.find({
//         phoneNumber: { $in: phoneNumber },
//       });

//       const requiredFields = ['propertyMode', 'propertyType','rentType', 'rentalAmount', 'totalArea', 'areaUnit'];

//       // const enhancedProperties = properties
//       // .map((property) => {
//       //   const hasRequiredFields = requiredFields.every(field =>
//       //     property[field] !== undefined &&
//       //     property[field] !== null &&
//       //     String(property[field]).trim() !== ''
//       //   );
    
//       //   return {
//       //     ...property.toObject(),
//       //     planName,
//       //     planCreatedAt: formattedCreatedAt,
//       //     durationDays,
//       //     planExpiryDate: formattedExpiryDate,
//       //     packageType: packageType || 'N/A',
//       //     adminName:adminName || 'N/A',
//       //     billNo: billNo || 'N/A',
//       //     billCreatedBy: createdBy || 'N/A',
//       //     billCreatedAt: formattedCreatedAt,
//       //     required: hasRequiredFields ? 'Yes' : 'No',
//       //   };
//       // })
//       // .filter(property => property.required === 'Yes'); // ✅ Filter only 'Yes'
    


      
// const enhancedProperties = properties
//   .map((property) => {
//     const hasRequiredFields = requiredFields.every(field =>
//       property[field] !== undefined &&
//       property[field] !== null &&
//       String(property[field]).trim() !== ''
//     );

//     const status = hasRequiredFields ? 'complete' : 'incomplete'; // <-- Fix here

//     return {
//       ...property.toObject(),
//       planName,
//       planCreatedAt: formattedCreatedAt,
//       durationDays,
//       planExpiryDate: formattedExpiryDate,
//       packageType: packageType || 'N/A',
//       adminName: adminName || 'N/A',
//       billNo: billNo || 'N/A',
//       billCreatedBy: createdBy || 'N/A',
//       billCreatedAt: formattedCreatedAt,
//       required: hasRequiredFields ? 'Yes' : 'No',
//       status, // <-- Set here
//     };
//   })
//   .filter(property => property.required === 'Yes'); // only return complete records



//       return {
//         user: {
//           phoneNumber,
//           planName,
//           planCreatedAt: formattedCreatedAt,
//           planExpiryDate: formattedExpiryDate,
//           durationDays,
//           packageType,
//           adminName:adminName || 'N/A',
//           billNo: billNo || 'N/A',
//           billCreatedBy: createdBy || 'N/A',
//           billCreatedAt: formattedCreatedAt,
//           adsCount: properties.length,
//         },
//         properties: enhancedProperties,
//       };
//     }));

//     res.status(200).json({
//       message: "Free plan's properties and full user details fetched successfully!",
//       data: userPlansWithProperties,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: 'Error fetching Free plans and properties.',
//       error: error.message,
//     });
//   }
// });



router.get('/fetch-all-free-plans', async (req, res) => {
  try {
    // ✅ Fetch FREE Bills ONLY
    // Free bills have: paymentType === 'Free' OR planName === 'Free'
   const freeBills = await Bill.find({
  
}).sort({ createdAt: -1 });

    if (!freeBills.length) {
      return res.status(404).json({ message: 'No Free bills found.' });
    }

    // 2️⃣ For each bill, fetch related properties and build data
    const billDataWithProperties = await Promise.all(
      freeBills.map(async (bill) => {
        const {
          adminOffice,
          adminName,
          rentId,
          billNo,
          billDate,
          ownerPhone,
          paymentType,
          planName,
          billAmount,
          validity,
          noOfAds,
          featuredAmount,
          featuredValidity,
          featuredMaxAds,
          discount,
          netAmount,
          billCreatedBy,
          createdAt,
        } = bill;

        // Calculate expiry date
        const planExpiryDate = createdAt && validity
          ? new Date(new Date(createdAt).getTime() + validity * 24 * 60 * 60 * 1000)
          : null;

        const formattedCreatedAt = createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A';
        const formattedExpiryDate = planExpiryDate ? new Date(planExpiryDate).toLocaleDateString() : 'N/A';

        // 3️⃣ Fetch all properties related to this specific bill using rentId
        const properties = await AddModel.find({
          rentId: rentId,
        });

        const requiredFields = ['propertyMode', 'propertyType', 'rentType', 'rentalAmount', 'totalArea', 'areaUnit'];

        // 4️⃣ Check completeness for each property
        const enhancedProperties = properties
          .map((property) => {
            const hasRequiredFields = requiredFields.every(field =>
              property[field] !== undefined &&
              property[field] !== null &&
              String(property[field]).trim() !== ''
            );

            const status = hasRequiredFields ? 'complete' : 'incomplete';

            return {
              ...property.toObject(),
              planName,
              paymentType,
              planCreatedAt: formattedCreatedAt,
              planExpiryDate: formattedExpiryDate,
              durationDays: validity,
              adminOffice: adminOffice || 'N/A',
              adminName: adminName || 'N/A',
              billNo: billNo || 'N/A',
              billCreatedBy: billCreatedBy || 'N/A',
              billCreatedAt: formattedCreatedAt,
              required: hasRequiredFields ? 'Yes' : 'No',
              status,
            };
          })
          .filter(property => property.required === 'Yes'); // only include complete ones

        // 5️⃣ Return merged data for this bill
        return {
          billInfo: {
            rentId,
            adminOffice,
            adminName,
            billNo,
            billDate,
            ownerPhone,
            paymentType,
            planName,
            billAmount,
            validity,
            noOfAds,
            featuredAmount,
            featuredValidity,
            featuredMaxAds,
            discount,
            netAmount,
            billCreatedBy,
            billCreatedAt: formattedCreatedAt,
            planExpiryDate: formattedExpiryDate,
            adsCount: properties.length,
          },
          properties: enhancedProperties,
        };
      })
    );

    // 6️⃣ Final response
    res.status(200).json({
      message: "All Free plan bills with user properties fetched successfully!",
      data: billDataWithProperties,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching Free plan bills and properties.',
      error: error.message,
    });
  }
});



router.get('/fetch-all-postby-properties', async (req, res) => {
  try {
    // Only fetch properties where postedBy exists and is not empty
    const properties = await AddModel.find({
      postedBy: { $exists: true, $ne: '' }
    });

    const plans = await PricingPlans.find();
    const bills = await Bill.find();

    const requiredFields = [
      'propertyMode', 'propertyType', 'rentalAmount','rentType',
      'totalArea', 'areaUnit',
       'postedBy'
    ];

    const adsCountByUser = properties.reduce((acc, property) => {
      const phone = property.phoneNumber;
      acc[phone] = (acc[phone] || 0) + 1;
      return acc;
    }, {});

    const completeProperties = properties.filter((property) =>
      requiredFields.every(
        (field) =>
          property[field] !== undefined &&
          property[field] !== null &&
          String(property[field]).trim() !== ''
      )
    );

    const incompleteProperties = properties.filter((property) =>
      !requiredFields.every(
        (field) =>
          property[field] !== undefined &&
          property[field] !== null &&
          String(property[field]).trim() !== ''
      )
    );

    const processedProperties = [...completeProperties, ...incompleteProperties].map((property) => {
      const matchedPlan = plans.find(plan =>
        Array.isArray(plan.phoneNumber)
          ? plan.phoneNumber.includes(property.phoneNumber)
          : plan.phoneNumber === property.phoneNumber
      );

      const matchedBill = bills.find(bill =>
        bill.ownerPhone === property.phoneNumber || bill.ppId === property.ppcId
      );

      const isComplete = completeProperties.includes(property);

      return {
        ...property._doc,
        postedBy: property.postedBy,
        required: isComplete ? "yes" : "no",
        adsCount: adsCountByUser[property.phoneNumber] || 0,
        planName: matchedPlan?.name || 'N/A',
        packageType: matchedPlan?.packageType || 'N/A',
        planDuration: matchedPlan?.durationDays || 'N/A',
        planCreatedAt: matchedPlan?.createdAt ? new Date(matchedPlan.createdAt).toLocaleDateString() : 'N/A',
        planExpiryDate: matchedPlan?.createdAt && matchedPlan?.durationDays
          ? new Date(new Date(matchedPlan.createdAt).getTime() + matchedPlan.durationDays * 24 * 60 * 60 * 1000).toLocaleDateString()
          : 'N/A',
        adminOffice: matchedBill?.adminOffice || 'N/A',
        adminName: matchedBill?.adminName || 'N/A',
        billNo: matchedBill?.billNo || 'N/A',
        billDate: matchedBill?.billDate || 'N/A',
        validity: matchedBill?.validity || 'N/A',
        billExpiryDate: matchedBill?.billDate && matchedBill?.validity
          ? new Date(new Date(matchedBill.billDate).getTime() + matchedBill.validity * 24 * 60 * 60 * 1000).toLocaleDateString()
          : 'N/A'
      };
    });

    res.status(200).json({
      message: "Filtered properties with postedBy fetched successfully.",
      users: processedProperties,
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching all user details.',
      error: error.message
    });
  }
});


router.get('/fetch-address-datas', async (req, res) => {
  try {
    const selectedFields = {
      phoneNumber: 1,
      rentId: 1,
      assignedPhoneNumber: 1,
      setPpcId: 1,
      setPpcIdAssignedAt: 1,
      propertyMode: 1,
      propertyType: 1,
      rentalPropertyAddress: 1,
      rentalAmount: 1,
      country: 1,
      city: 1,
      state: 1,
      district: 1,
      pinCode: 1,
      area: 1,
      streetName: 1,
      doorNumber: 1,
      nagar: 1,
      locationCoordinates: 1,
      ownerName: 1,
      email: 1,
      planName: 1,
      planCreatedAt: 1,
      createdAt: 1,
      updatedAt: 1
    };

    // Sort by latest created or updated
    const users = await AddModel.find({}, selectedFields)
      .sort({ updatedAt: -1, createdAt: -1 }); // Newest first

    res.status(200).json({
      message: 'All selected user data fetched successfully!',
      users
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching user details.',
      error: error.message
    });
  }
});


// DUPLICATE ENDPOINT REMOVED - kept only the updated version at line 8887
// router.get('/bills/free-with-properties', async (req, res) => { ... });


// router.post("/set-contact-limit", async (req, res) => {
//   const { phoneNumber, contactLimitPerDay } = req.body;

//   // Validate input
//   if (!phoneNumber || typeof contactLimitPerDay !== "number") {
//     return res.status(400).json({
//       success: false,
//       message: "Phone number and numeric contactLimitPerDay are required.",
//     });
//   }

//   try {
//     const cleanedPhone = phoneNumber.replace(/\D/g, "").slice(-10); // keep last 10 digits

//     const user = await UserViewsModel.findOneAndUpdate(
//       { phoneNumber: cleanedPhone },
//       { contactLimitPerDay }, // Update this specific field
//       { upsert: true, new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: `Contact limit set to ${contactLimitPerDay} for ${cleanedPhone}`,
//       user,
//     });
//   } catch (error) {
//     console.error("Set contact limit error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while setting contact limit.",
//       error: error.message,
//     });
//   }
// });




router.post("/set-limit", async (req, res) => {
  const { phoneNumbers, viewLimitPerDay } = req.body;

  // Validate input
  if (
    !Array.isArray(phoneNumbers) ||
    phoneNumbers.length === 0 ||
    typeof viewLimitPerDay !== "number"
  ) {
    return res.status(400).json({
      success: false,
      message: "An array of phoneNumbers and numeric viewLimitPerDay are required.",
    });
  }

  try {
    // Clean phone numbers (e.g., strip non-digits, keep last 10)
    const cleanedNumbers = phoneNumbers.map((num) =>
      num.toString().replace(/\D/g, "").slice(-10)
    );

    const bulkOps = cleanedNumbers.map((phoneNumber) => ({
      updateOne: {
        filter: { phoneNumber },
        update: { viewLimitPerDay },
        upsert: true,
      },
    }));

    const result = await UserViewsModel.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: `View limit set to ${viewLimitPerDay} for ${cleanedNumbers.length} users.`,
      totalApplied: cleanedNumbers.length,
      updatedExisting: result.matchedCount,
      newlyCreated: result.upsertedCount,
      modified: result.modifiedCount,
      phoneNumbers: cleanedNumbers,
    });
  } catch (error) {
    console.error("Error setting view limit:", error);
    res.status(500).json({
      success: false,
      message: "Server error while setting view limits.",
      error: error.message,
    });
  }
});




router.post("/set-contact-limit", async (req, res) => {
  const { phoneNumbers, contactLimitPerDay } = req.body;

  if (
    !Array.isArray(phoneNumbers) ||
    phoneNumbers.length === 0 ||
    typeof contactLimitPerDay !== "number"
  ) {
    return res.status(400).json({
      success: false,
      message: "An array of phoneNumbers and numeric contactLimitPerDay are required.",
    });
  }

  try {
    const cleanedNumbers = phoneNumbers.map((num) =>
      num.toString().replace(/\D/g, "").slice(-10)
    );

    const bulkOps = cleanedNumbers.map((cleanedPhone) => ({
      updateOne: {
        filter: { phoneNumber: cleanedPhone },
        update: {
          $set: {
            contactLimitPerDay,
            contactLimitSetDate: new Date(),
          },
        },
        upsert: true,
      },
    }));

    const result = await UserViewsModel.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: `Contact limit set to ${contactLimitPerDay} for ${cleanedNumbers.length} users.`,
      totalApplied: cleanedNumbers.length,
      updatedExisting: result.matchedCount,
      newlyCreated: result.upsertedCount,
      modified: result.modifiedCount,
      phoneNumbers: cleanedNumbers,
    });
  } catch (error) {
    console.error("Set contact limit error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while setting contact limits.",
      error: error.message,
    });
  }
});



function isToday(date) {
  if (!date) return false;
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}



// GET /api/user-views/get-user-stats/:phoneNumber
router.get("/get-user-stats/:phoneNumber", async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const user = await UserViewsModel.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const today = new Date().toDateString();
    const lastViewDateStr = new Date(user.lastViewDate).toDateString();
    const dailyViewsCount = lastViewDateStr === today ? user.dailyViewsCount : 0;

    return res.json({
      success: true,
      user: {
        phoneNumber: user.phoneNumber,
        dailyViewsCount,
        viewLimitPerDay: user.viewLimitPerDay || 20,
      },
    });
  } catch (err) {
    console.error("Error getting user stats:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// POST /api/user-views/view
router.post("/view", async (req, res) => {
  try {
    const { phoneNumber, rentId, propertyOwnerPhoneNumber, photos } = req.body;
    const today = new Date().toDateString();

    let user = await UserViewsModel.findOne({ phoneNumber });

    if (!user) {
      user = new UserViewsModel({
        phoneNumber,
        dailyViewsCount: 1,
        lastViewDate: new Date(),
        viewLimitPerDay: 20, // default if admin hasn't set
        viewedProperties: [
          { rentId, viewerPhoneNumber: phoneNumber, propertyOwnerPhoneNumber, photos },
        ],
      });
      await user.save();
      return res.status(200).json({ success: true, message: "View recorded." });
    }

    const lastViewDateStr = new Date(user.lastViewDate).toDateString();
    if (lastViewDateStr !== today) {
      user.dailyViewsCount = 0;
      user.lastViewDate = new Date();
    }

    if (user.dailyViewsCount >= user.viewLimitPerDay) {
      return res
        .status(403)
        .json({ success: false, message: `Daily view limit (${user.viewLimitPerDay}) reached.` });
    }

    user.viewedProperties.push({
      rentId,
      viewerPhoneNumber: phoneNumber,
      propertyOwnerPhoneNumber,
      photos,
    });

    user.dailyViewsCount += 1;
    await user.save();

    res.status(200).json({ success: true, message: "View recorded." });
  } catch (error) {
    console.error("Error recording view:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});



// PUT /api/user-views/update-limit
router.put("/update-limit", async (req, res) => {
  const { phoneNumber, viewLimitPerDay } = req.body;

  if (!phoneNumber || typeof viewLimitPerDay !== "number") {
    return res.status(400).json({ success: false, message: "Invalid input." });
  }

  try {
    const user = await UserViewsModel.findOneAndUpdate(
      { phoneNumber },
      { viewLimitPerDay },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      message: `View limit updated to ${viewLimitPerDay} for ${phoneNumber}`,
      user,
    });
  } catch (err) {
    console.error("Error updating limit:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});


// DELETE /api/user-views/delete-limit/:phoneNumber
router.delete("/delete-limit/:phoneNumber", async (req, res) => {
  const { phoneNumber } = req.params;

  try {
    const user = await UserViewsModel.findOneAndUpdate(
      { phoneNumber },
      { $unset: { viewLimitPerDay: 1 } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      message: `View limit removed for ${phoneNumber}`,
      user,
    });
  } catch (err) {
    console.error("Error deleting view limit:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});


router.get("/get-all-user-limits", async (req, res) => {
  try {
    const formatDate = (date) => new Date(date).toISOString().slice(0, 10); // YYYY-MM-DD

    // 1. Get all users with view limit
    const viewUsers = await UserViewsModel.find({ viewLimitPerDay: { $exists: true } });
    const phoneList = viewUsers.map((u) => getLast10Digits(u.phoneNumber));

    // 2. Fetch all contact data (even beyond 30 days)
    const contactDocs = await AddModel.find(
      { "contactRequests.phoneNumber": { $exists: true, $ne: null } },
      "rentId contactRequests"
    );

    // 3. Build per-day contact map
    const contactMap = new Map();

    contactDocs.forEach((doc) => {
      const rentId = doc.rentId;

      (doc.contactRequests || []).forEach((req) => {
        const phone = getLast10Digits(req.phoneNumber);
        const date = req.date || req.createdAt;
        if (!phone || !date) return;

        const dateKey = formatDate(date);

        if (!contactMap.has(phone)) contactMap.set(phone, {});

        const userDateMap = contactMap.get(phone);

        if (!userDateMap[dateKey]) {
          userDateMap[dateKey] = [{ rentId, contactedAt: date }];
        } else {
          userDateMap[dateKey].push({ rentId, contactedAt: date });
        }
      });
    });

    // 4. Build final result
    const result = viewUsers.map((user) => {
      const phone = getLast10Digits(user.phoneNumber);
      const contactDetails = contactMap.get(phone) || {};

      // Convert object {date: [...]} to {date: count}
      const contactCountPerDay = {};
      for (const date in contactDetails) {
        contactCountPerDay[date] = contactDetails[date].length;
      }

      return {
        phoneNumber: phone,
        viewLimitPerDay: user.viewLimitPerDay,
        viewsRemaining: user.viewsRemaining,
        lastUpdated: user.updatedAt,
        contactCountPerDay,
        contactedPpcDetailsByDate: contactDetails
      };
    });

    res.status(200).json({ success: true, users: result });
  } catch (err) {
    console.error("Error fetching user limits:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});




// Updated /get-all-contact-limits API
router.get("/get-all-contact-limits", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const users = await UserViewsModel.find(
      { contactLimitPerDay: { $exists: true } },
      {
        phoneNumber: 1,
        contactLimitPerDay: 1,
        contactedProperties: 1,
        _id: 0,
      }
    ).sort({ phoneNumber: 1 });

    const enrichedUsers = users.map((user) => {
      const contactSentCount = user.contactedProperties?.length || 0;

      const contactCountPerDay = {};
      const contactedPpcDetailsByDate = {};

      (user.contactedProperties || []).forEach(({ contactedAt, rentId }) => {
        const dateStr = new Date(contactedAt).toISOString().slice(0, 10);

        contactCountPerDay[dateStr] = (contactCountPerDay[dateStr] || 0) + 1;
        if (!contactedPpcDetailsByDate[dateStr]) {
          contactedPpcDetailsByDate[dateStr] = [];
        }
        contactedPpcDetailsByDate[dateStr].push({ rentId, contactedAt });
      });

      return {
        phoneNumber: user.phoneNumber,
        contactLimitPerDay: user.contactLimitPerDay,
        contactSentCount,
        remainingContacts: user.contactLimitPerDay - contactSentCount,
        contactCountPerDay,
        contactedPpcDetailsByDate,
      };
    });

    res.status(200).json({
      success: true,
      users: enrichedUsers,
    });
  } catch (error) {
    console.error("Fetch contact limits error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching contact limits.",
      error: error.message,
    });
  }
});





router.put("/update-contact-limit", async (req, res) => {
  const { phoneNumber, contactLimitPerDay } = req.body;

  if (!phoneNumber || typeof contactLimitPerDay !== "number") {
    return res.status(400).json({
      success: false,
      message: "Phone number and numeric contactLimitPerDay are required.",
    });
  }

  try {
    const cleanedPhone = phoneNumber.replace(/\D/g, "").slice(-10);

    const updatedUser = await UserViewsModel.findOneAndUpdate(
      { phoneNumber: cleanedPhone },
      { contactLimitPerDay },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: `User not found with phone number: ${cleanedPhone}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Contact limit updated to ${contactLimitPerDay} for ${cleanedPhone}`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update contact limit error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating contact limit.",
      error: error.message,
    });
  }
});


router.delete("/delete-contact-limit/:phoneNumber", async (req, res) => {
  const rawPhone = req.params.phoneNumber;
  const cleanedPhone = rawPhone.replace(/\D/g, "").slice(-10);

  try {
    const user = await UserViewsModel.findOneAndUpdate(
      { phoneNumber: cleanedPhone },
      { $unset: { contactLimitPerDay: "" } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with phone number: ${cleanedPhone}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Contact limit removed for ${cleanedPhone}`,
      user,
    });
  } catch (error) {
    console.error("Delete contact limit error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting contact limit.",
      error: error.message,
    });
  }
});

// GET /get-property-video/:ppcId
router.get('/get-property-video/:rentId', async (req, res) => {
  try {
    const { rentId } = req.params;

    const videoDoc = await AddModel.findOne(
      { rentId, video: { $exists: true, $ne: "" } },
      { video: 1, rentId: 1, _id: 0 }
    );

    if (!videoDoc) {
      return res.status(404).json({ message: 'No video found for this RENT ID' });
    }

    const normalized = {
      rentId: videoDoc.rentId,
      video: videoDoc.video.replace(/\\/g, '/'),
    };

    res.status(200).json({
      message: 'Video fetched successfully',
      video: normalized,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch video', error: error.message });
  }
});



// router.get('/get-property-videos', async (req, res) => {
//   try {
//     const videos = await AddModel.find(
//       {
//         video: { $exists: true, $ne: "" }  // Only properties with non-empty video
//       },
//       {
//         video: 1,
//         rentId: 1, // 🔄 Changed from ppcId to rentId
//         _id: 0
//       }
//     );

//     // Normalize video paths and handle both string or array format
//     const normalized = videos.flatMap(v => {
//       if (typeof v.video === 'string' && v.video.trim()) {
//         return [{ rentId: v.rentId, video: v.video.replace(/\\/g, '/') }];
//       } else if (Array.isArray(v.video)) {
//         return v.video
//           .filter(vid => typeof vid === 'string' && vid.trim())
//           .map(vid => ({
//             rentId: v.rentId,
//             video: vid.replace(/\\/g, '/')
//           }));
//       }
//       return [];
//     });

//     res.status(200).json({
//       message: 'Video list fetched successfully',
//       total: normalized.length,
//       videos: normalized,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch videos', error: error.message });
//   }
// });


router.get('/get-property-videos', async (req, res) => {
  try {
    const videos = await AddModel.find(
      {
        video: { $exists: true, $ne: "" }  // Only properties with non-empty video
      },
      {
        video: 1,
        rentId: 1,
        propertyMode: 1,
        propertyType: 1,
        _id: 0
      }
    );

    // Normalize video paths and handle both string or array format
    const normalized = videos.flatMap(v => {
      if (typeof v.video === 'string' && v.video.trim()) {
        return [{
          rentId: v.rentId,
          video: v.video.replace(/\\/g, '/'),
          propertyMode: v.propertyMode,
          propertyType: v.propertyType
        }];
      } else if (Array.isArray(v.video)) {
        return v.video
          .filter(vid => typeof vid === 'string' && vid.trim())
          .map(vid => ({
            rentId: v.rentId,
            video: vid.replace(/\\/g, '/'),
            propertyMode: v.propertyMode,
            propertyType: v.propertyType
          }));
      }
      return [];
    });

    res.status(200).json({
      message: 'Video list fetched successfully',
      total: normalized.length,
      videos: normalized,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch videos', error: error.message });
  }
});



// PERMANENTLY DELETE ALL USER VIEW DATA
router.delete('/admin/delete-all-user-views', async (req, res) => {
  try {
    const result = await UserViewsModel.deleteMany({});
    res.status(200).json({
      success: true,
      message: 'All user view data permanently deleted.',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting UserViewsModel data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user view data.',
      error: error.message,
    });
  }
});


// Helper: get last 10 digits of phone
function getLast10Digits(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

// Helper: check if a date is within last N days
function isWithinLastNDays(date, n = 30) {
  const now = new Date();
  const target = new Date(date);
  const diffTime = now - target;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= n;
}

// Helper to fetch owner phones for multiple Rent IDs at once
async function getOwnerPhonesForRentIds(rentIds) {
  if (!rentIds.length) return {};
  
  const properties = await AddModel.find(
    { rentId: { $in: rentIds } },
    "rentId phoneNumber"
  );

  const map = {};
  properties.forEach((p) => {
    map[p.rentId] = p.phoneNumber ? getLast10Digits(p.phoneNumber) : null;
  });

  return map;
}



router.get("/get-users-without-posted-properties-plans", async (req, res) => {
  try {
    const logins = await UserLogin.find({}, "phone loginDate updatedAt");
    const allUsers = logins.map((user) => ({
      phoneNumber: getLast10Digits(user.phone),
      loginDate: user.loginDate || null,
      updateDate: user.updatedAt || null,
    }));

    const postedPhones = await AddModel.distinct("phoneNumber");
    const postedPhoneSet = new Set(postedPhones.map(p => getLast10Digits(p)));

    const usersWithoutPosts = allUsers.filter(
      (user) => user.phoneNumber && !postedPhoneSet.has(user.phoneNumber)
    );
    const userPhones = usersWithoutPosts.map((u) => u.phoneNumber);

    const viewData = await UserViewsModel.find({ phoneNumber: { $in: userPhones } });

    const viewMap = new Map();
    viewData.forEach((view) => {
      const phone = getLast10Digits(view.phoneNumber);
      const todayViews = (view.viewedProperties || []).filter((vp) => isToday(vp.viewedAt));
      viewMap.set(phone, {
        dailyViewsCount: todayViews.length,
        viewsRemaining: Math.max(0, 30 - todayViews.length),
        rentIds: todayViews.map((vp) => vp.rentId),
      });
    });

    const contactData = await AddModel.find(
      { "contactRequests.phoneNumber": { $exists: true, $ne: null } },
      "rentId contactRequests"
    );

    const contactMap = new Map();
    for (const doc of contactData) {
      const rentId = doc.rentId;
      for (const req of doc.contactRequests) {
        const phone = getLast10Digits(req.phoneNumber);
        const reqDate = req.date || req.createdAt;
        if (!phone || !isToday(reqDate)) continue;

        if (!contactMap.has(phone)) {
          contactMap.set(phone, { count: 1, rentIds: [rentId] });
        } else {
          const data = contactMap.get(phone);
          if (!data.rentIds.includes(rentId)) data.rentIds.push(rentId);
          data.count += 1;
        }
      }
    }

    const allRentIds = Array.from(new Set([
      ...Array.from(viewMap.values()).flatMap(v => v.rentIds),
      ...Array.from(contactMap.values()).flatMap(c => c.rentIds)
    ]));

    const rentIdToOwnerPhone = await getOwnerPhonesForRentIds(allRentIds); // 👈 update this helper too

    for (const [phone, viewInfo] of viewMap) {
      viewInfo.viewedRentIds = viewInfo.rentIds.map(rentId => ({
        rentId,
        ownerPhone: rentIdToOwnerPhone[rentId] || null
      }));
      delete viewInfo.rentIds;
    }

    for (const [phone, contactInfo] of contactMap) {
      contactInfo.contactedRentIds = contactInfo.rentIds.map(rentId => ({
        rentId,
        ownerPhone: rentIdToOwnerPhone[rentId] || null
      }));
      delete contactInfo.rentIds;
    }

    const plans = await PricingPlans.find({ phoneNumber: { $in: userPhones } });

    const phoneToPlan = new Map();
    plans.forEach(plan => {
      if (Array.isArray(plan.phoneNumber)) {
        plan.phoneNumber.forEach(phone => {
          const duration = plan.durationDays || 0;
          const expiry = calculateExpiryDate(plan.createdAt, duration);
          phoneToPlan.set(phone, {
            planName: plan.name,
            planCreatedDate: plan.createdAt,
            durationDays: duration,
            expiryDate: expiry,
          });
        });
      } else if (typeof plan.phoneNumber === 'string') {
        const phone = getLast10Digits(plan.phoneNumber);
        const duration = plan.durationDays || 0;
        const expiry = calculateExpiryDate(plan.createdAt, duration);
        phoneToPlan.set(phone, {
          planName: plan.name,
          planCreatedDate: plan.createdAt,
          durationDays: duration,
          expiryDate: expiry,
        });
      }
    });

    const result = usersWithoutPosts.map(user => {
      const viewInfo = viewMap.get(user.phoneNumber) || {
        dailyViewsCount: 0,
        viewsRemaining: 30,
        viewedRentIds: [],
      };

      const contactInfo = contactMap.get(user.phoneNumber) || {
        count: 0,
        contactedRentIds: [],
      };

      const plan = phoneToPlan.get(user.phoneNumber) || null;

      return {
        phoneNumber: user.phoneNumber,
        loginDate: user.loginDate,
        updateDate: user.updateDate,
        hasPostedProperty: false,
        planName: plan ? plan.planName : null,
        planCreatedDate: plan ? plan.planCreatedDate : null,
        durationDays: plan ? plan.durationDays : null,
        expiryDate: plan ? plan.expiryDate : null,
        viewsToday: viewInfo.dailyViewsCount,
        viewsRemaining: viewInfo.viewsRemaining,
        viewedRentIds: viewInfo.viewedRentIds,
        contactsToday: contactInfo.count,
        contactsRemaining: Math.max(0, 30 - contactInfo.count),
        contactedRentIds: contactInfo.contactedRentIds,
      };
    });

    res.status(200).json({
      message: "Users without posted properties (with plan info) fetched successfully",
      usersWithoutPostedProperties: result,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});


router.get("/get-users-without-posted-properties-30days", async (req, res) => {
  try {
    // Utility: Check if a date is within the last N days
    const isWithinLastNDays = (date, days = 30) => {
      const now = new Date();
      const d = new Date(date);
      return (
        !isNaN(d) &&
        now - d <= days * 24 * 60 * 60 * 1000 &&
        d <= now
      );
    };

    // 1. Fetch all user logins
    const logins = await UserLogin.find({}, "phone loginDate updatedAt");

    const allUsers = logins.map((user) => ({
      phoneNumber: getLast10Digits(user.phone),
      loginDate: user.loginDate,
      updateDate: user.updatedAt,
    }));

    // 2. Get phones of users who posted properties
    const postedPhones = await AddModel.distinct("phoneNumber");
    const postedPhoneSet = new Set(
      postedPhones.filter(Boolean).map(getLast10Digits)
    );

    // 3. Filter users who haven't posted
    const usersWithoutPosts = allUsers.filter(
      (u) => u.phoneNumber && !postedPhoneSet.has(u.phoneNumber)
    );

    const phoneList = usersWithoutPosts.map((u) => u.phoneNumber);

    // 4. Fetch property views in last 30 days
    const viewsData = await UserViewsModel.find({
      phoneNumber: { $in: phoneList },
    });

    const viewMap = new Map();

    viewsData.forEach((user) => {
      const phone = getLast10Digits(user.phoneNumber);
      const viewsInLast30Days = (user.viewedProperties || []).filter((vp) =>
        isWithinLastNDays(vp.viewedAt)
      ).map((vp) => ({
        rentId: vp.rentId,
        viewedAt: vp.viewedAt,
      }));
      viewMap.set(phone, viewsInLast30Days);
    });

    // 5. Fetch contact requests in last 30 days
    const contactData = await AddModel.find(
      { "contactRequests.phoneNumber": { $exists: true, $ne: null } },
      "rentId contactRequests"
    );

    const contactMap = new Map();

    contactData.forEach((doc) => {
      const rentId = doc.rentId;
      (doc.contactRequests || []).forEach((req) => {
        const phone = getLast10Digits(req.phoneNumber);
        const date = req.date || req.createdAt;
        if (!phone || !isWithinLastNDays(date)) return;

        const contactEntry = {
          rentId,
          contactedAt: date,
        };

        if (!contactMap.has(phone)) {
          contactMap.set(phone, [contactEntry]);
        } else {
          contactMap.get(phone).push(contactEntry);
        }
      });
    });

    // 6. Build final response
    const result = usersWithoutPosts.map((user) => {
      const views = viewMap.get(user.phoneNumber) || [];
      const contacts = contactMap.get(user.phoneNumber) || [];

      return {
        phoneNumber: user.phoneNumber,
        loginDate: user.loginDate,
        updateDate: user.updateDate,
        viewsInLast30Days: views.length,
        viewedRentDetails: views, // includes rentId & viewedAt
        contactsInLast30Days: contacts.length,
        contactedRentDetails: contacts, // includes rentId & contactedAt
      };
    });

    res.status(200).json({
      message: "Users without posted properties (last 30 days) fetched",
      users: result,
    });
  } catch (error) {
    console.error("Error in 30-day fetch:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

router.get("/get-users-viewall-contact-data-30days", async (req, res) => {
  try {
    const THIRTY_DAYS_AGO = new Date();
    THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);

    const logins = await UserLogin.find({}, "phone loginDate updatedAt");

    const allUsers = logins.map((user) => ({
      phoneNumber: getLast10Digits(user.phone),
      loginDate: user.loginDate || null,
      updateDate: user.updatedAt || null,
    }));

    const postedPhones = await AddModel.distinct("phoneNumber");
    const postedPhoneSet = new Set(
      postedPhones.filter(Boolean).map((p) => getLast10Digits(p))
    );

    const categorizedUsers = allUsers.map((user) => ({
      ...user,
      hasPostedProperty: postedPhoneSet.has(user.phoneNumber),
    }));

    const allUserPhones = categorizedUsers.map((u) => u.phoneNumber);

    // View data (last 30 days)
    const viewData = await UserViewsModel.find({
      phoneNumber: { $in: allUserPhones },
    });

    const viewMap = new Map();
    viewData.forEach((view) => {
      const phone = getLast10Digits(view.phoneNumber);
      if (!phone) return;

      const recentViews = (view.viewedProperties || []).filter(
        (vp) => vp.viewedAt && new Date(vp.viewedAt) >= THIRTY_DAYS_AGO
      );

      const views = recentViews.map((vp) => ({
        rentId: vp.rentId,
        viewedAt: vp.viewedAt,
      }));

      viewMap.set(phone, {
        allViews: views,
        viewsRemaining: Math.max(0, 30 - views.length),
      });
    });

    // Contact data (last 30 days)
    const contactData = await AddModel.find(
      { "contactRequests.phoneNumber": { $exists: true, $ne: null } },
      "rentId contactRequests"
    );

    const contactMap = new Map();
    for (const doc of contactData) {
      const rentId = doc.rentId;
      for (const req of doc.contactRequests || []) {
        const phone = getLast10Digits(req.phoneNumber);
        const reqDate = req.date || req.createdAt;
        if (!phone || !rentId || !reqDate) continue;

        if (new Date(reqDate) < THIRTY_DAYS_AGO) continue;

        if (!contactMap.has(phone)) {
          contactMap.set(phone, {
            contactedRentIds: [{ rentId, date: reqDate }],
          });
        } else {
          const data = contactMap.get(phone);
          data.contactedRentIds.push({ rentId, date: reqDate });
          contactMap.set(phone, data);
        }
      }
    }

    // Collect all unique rentIds
    const allRentIdsSet = new Set();
    viewMap.forEach((v) => v.allViews.forEach((vp) => allRentIdsSet.add(vp.rentId)));
    contactMap.forEach((c) => c.contactedRentIds.forEach((cp) => allRentIdsSet.add(cp.rentId)));
    const allRentIds = Array.from(allRentIdsSet);

    // Get owner phone mapping
    const rentIdToOwnerPhone = await getOwnerPhonesForRentIds(allRentIds);

    // Add ownerPhone mapping to viewMap
    for (const [phone, viewInfo] of viewMap) {
      viewInfo.viewedRentIds = viewInfo.allViews.map((vp) => ({
        rentId: vp.rentId,
        viewedAt: vp.viewedAt,
        ownerPhone: rentIdToOwnerPhone[vp.rentId] || null,
      }));
      delete viewInfo.allViews;
    }

    // Add ownerPhone mapping to contactMap
    for (const [phone, contactInfo] of contactMap) {
      contactInfo.contactedRentIds = contactInfo.contactedRentIds.map((cp) => ({
        ...cp,
        ownerPhone: rentIdToOwnerPhone[cp.rentId] || null,
      }));
    }

    // Build final result
    const result = categorizedUsers.map((user) => {
      const viewInfo = viewMap.get(user.phoneNumber) || {
        viewsRemaining: 30,
        viewedRentIds: [],
      };

      const contactInfo = contactMap.get(user.phoneNumber) || {
        contactedRentIds: [],
      };

      return {
        phoneNumber: user.phoneNumber,
        loginDate: user.loginDate,
        updateDate: user.updateDate,
        hasPostedProperty: user.hasPostedProperty,
        viewsToday: viewInfo.viewedRentIds.length,
        viewsRemaining: viewInfo.viewsRemaining,
        viewedRentIds: viewInfo.viewedRentIds,
        contactsToday: contactInfo.contactedRentIds.length,
        contactsRemaining: Math.max(0, 30 - contactInfo.contactedRentIds.length),
        contactedRentIds: contactInfo.contactedRentIds,
      };
    });

    res.status(200).json({
      message: "User view and contact data fetched successfully",
      users: result,
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      message: "Error fetching data",
      error: error.message,
    });
  }
});

router.get('/get-user-no-complete-activity', async (req, res) => {
  try {
    const interestMap = new Map();
    const contactMap = new Map();
    const favoriteMap = new Map();
    const photoRequestMap = new Map();
    const offerMap = new Map();
    const helpRequestMap = new Map();
    const reportMap = new Map();
    const viewMap = new Map();

    // Interests
    const interestProps = await AddModel.find({ interestRequests: { $exists: true, $ne: [] } });
    interestProps.forEach(p => {
      p.interestRequests.forEach(r => {
        const phone = normalizePhone(r.phoneNumber);
        if (phone) interestMap.set(phone, (interestMap.get(phone) || 0) + 1);
      });
    });

    // Contacts
    const contactProps = await AddModel.find({ contactRequests: { $exists: true, $ne: [] } });
    contactProps.forEach(p => {
      p.contactRequests.forEach(r => {
        const phone = normalizePhone(r.phoneNumber);
        if (phone) contactMap.set(phone, (contactMap.get(phone) || 0) + 1);
      });
    });

    // Favorites
    const favoriteProps = await AddModel.find({ favoriteRequests: { $exists: true, $ne: [] } });
    favoriteProps.forEach(p => {
      p.favoriteRequests.forEach(r => {
        const phone = normalizePhone(r.phoneNumber);
        if (phone) favoriteMap.set(phone, (favoriteMap.get(phone) || 0) + 1);
      });
    });

    // Photo Requests
    const photoRequests = await PhotoRequest.find();
    photoRequests.forEach(r => {
      const phone = normalizePhone(r.phoneNumber);
      if (phone) photoRequestMap.set(phone, (photoRequestMap.get(phone) || 0) + 1);
    });

    // Offers
    const offers = await Offer.find();
    offers.forEach(r => {
      const phone = normalizePhone(r.phoneNumber);
      if (phone) offerMap.set(phone, (offerMap.get(phone) || 0) + 1);
    });

    // Help Requests
    const helpProps = await AddModel.find({ "helpRequests.0": { $exists: true } });
    helpProps.forEach(p => {
      p.helpRequests.forEach(r => {
        const phone = normalizePhone(r.phoneNumber);
        if (phone) helpRequestMap.set(phone, (helpRequestMap.get(phone) || 0) + 1);
      });
    });

    // Reports
    const reportProps = await AddModel.find({ reportProperty: { $exists: true, $ne: [] } });
    reportProps.forEach(p => {
      p.reportProperty.forEach(r => {
        const phone = normalizePhone(r.phoneNumber);
        if (phone) reportMap.set(phone, (reportMap.get(phone) || 0) + 1);
      });
    });

    // Views - using rentId instead of ppcId
    const allUserViews = await UserViewsModel.find();
    const allRentIds = [...new Set(allUserViews.flatMap(u => u.viewedProperties.map(v => v.rentId)))];
    const properties = await AddModel.find(
      { rentId: { $in: allRentIds } },
      "rentId price propertyType propertyMode city area totalArea areaUnit ownership phoneNumber"
    );

    allUserViews.forEach(user => {
      const normalizedPhone = normalizePhone(user.phoneNumber);
      if (!normalizedPhone) return;

      const views = user.viewedProperties.map(v => {
        const prop = properties.find(p => p.rentId === v.rentId);
        return prop ? {
          rentId: prop.rentId,
          city: prop.city,
          area: prop.area,
          viewedAt: v.viewedAt
        } : null;
      }).filter(Boolean);

      viewMap.set(normalizedPhone, views);
    });

    const allPhones = new Set([
      ...interestMap.keys(),
      ...contactMap.keys(),
      ...favoriteMap.keys(),
      ...photoRequestMap.keys(),
      ...offerMap.keys(),
      ...helpRequestMap.keys(),
      ...reportMap.keys(),
      ...viewMap.keys()
    ]);

    const cleanPhones = Array.from(allPhones).filter(p => p && p.length === 10);

    const postedUsers = await AddModel.distinct("phoneNumber");
    const postedSet = new Set(
      postedUsers.map(p => normalizePhone(p)).filter(p => p && p.length === 10)
    );

    const nonPostedPhones = cleanPhones.filter(p => !postedSet.has(p));

    const userLogins = await UserLogin.aggregate([
      { $match: { phone: { $in: nonPostedPhones } } },
      { $sort: { loginDate: -1, updatedAt: -1 } },
      {
        $group: {
          _id: "$phone",
          loginDate: { $first: "$loginDate" },
          updateDate: { $first: "$updatedAt" }
        }
      }
    ]);

    const loginMap = new Map();
    userLogins.forEach(u => {
      loginMap.set(u._id, {
        loginDate: u.loginDate,
        updateDate: u.updateDate
      });
    });

    const result = nonPostedPhones.map(phone => {
      const login = loginMap.get(phone) || {};
      const views = viewMap.get(phone) || [];

      return {
        phoneNumber: phone,
        interestCount: interestMap.get(phone) || 0,
        contactCount: contactMap.get(phone) || 0,
        favoriteCount: favoriteMap.get(phone) || 0,
        photoRequestCount: photoRequestMap.get(phone) || 0,
        offerCount: offerMap.get(phone) || 0,
        helpRequestCount: helpRequestMap.get(phone) || 0,
        reportCount: reportMap.get(phone) || 0,
        loginDate: login.loginDate || null,
        updateDate: login.updateDate || null,
        viewedProperties: views,
        viewsCount: views.length
      };
    });

    res.status(200).json({
      message: "User activity data fetched successfully",
      data: result
    });

  } catch (error) {
    console.error("Error fetching user activity:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
});


function normalizePhone(phone) {
  if (typeof phone === 'string') {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 ? digits.slice(-10) : null;
  }
  return null;
}


// router.get('/get-user-complete-activity', async (req, res) => {
//   try {
//     const interestMap = new Map();
//     const contactMap = new Map();
//     const favoriteMap = new Map();
//     const photoRequestMap = new Map();
//     const offerMap = new Map();
//     const helpRequestMap = new Map();
//     const reportMap = new Map();
//     const viewMap = new Map();

//     // Load interests
//     const interestProps = await AddModel.find({ interestRequests: { $exists: true, $ne: [] } });
//     interestProps.forEach(p => {
//       p.interestRequests.forEach(r => {
//         const phone = r.phoneNumber;
//         if (phone) interestMap.set(phone, (interestMap.get(phone) || 0) + 1);
//       });
//     });

//     // Load contacts
//     const contactProps = await AddModel.find({ contactRequests: { $exists: true, $ne: [] } });
//     contactProps.forEach(p => {
//       p.contactRequests.forEach(r => {
//         const phone = r.phoneNumber;
//         if (phone) contactMap.set(phone, (contactMap.get(phone) || 0) + 1);
//       });
//     });

//     // Load favorites
//     const favoriteProps = await AddModel.find({ favoriteRequests: { $exists: true, $ne: [] } });
//     favoriteProps.forEach(p => {
//       p.favoriteRequests.forEach(r => {
//         const phone = r.phoneNumber;
//         if (phone) favoriteMap.set(phone, (favoriteMap.get(phone) || 0) + 1);
//       });
//     });

//     // Load photo requests
//     const photoRequests = await PhotoRequest.find();
//     photoRequests.forEach(r => {
//       const phone = r.phoneNumber;
//       if (phone) photoRequestMap.set(phone, (photoRequestMap.get(phone) || 0) + 1);
//     });

//     // Load offer requests
//     const offers = await Offer.find();
//     offers.forEach(r => {
//       const phone = r.phoneNumber;
//       if (phone) offerMap.set(phone, (offerMap.get(phone) || 0) + 1);
//     });

//     // Load help requests
//     const helpProps = await AddModel.find({ "helpRequests.0": { $exists: true } });
//     helpProps.forEach(p => {
//       p.helpRequests.forEach(r => {
//         const phone = r.phoneNumber;
//         if (phone) helpRequestMap.set(phone, (helpRequestMap.get(phone) || 0) + 1);
//       });
//     });

//     // Load reports
//     const reportProps = await AddModel.find({ reportProperty: { $exists: true, $ne: [] } });
//     reportProps.forEach(p => {
//       p.reportProperty.forEach(r => {
//         const phone = r.phoneNumber;
//         if (phone) reportMap.set(phone, (reportMap.get(phone) || 0) + 1);
//       });
//     });

//     // Load views (by rentId)
//     const allUserViews = await UserViewsModel.find();
//     const allRentIds = [...new Set(allUserViews.flatMap(u => u.viewedProperties.map(v => v.rentId)))];

//     const properties = await AddModel.find(
//       { rentId: { $in: allRentIds } },
//       "rentId price propertyType propertyMode city area totalArea areaUnit ownership phoneNumber"
//     );

//     allUserViews.forEach(user => {
//       const views = user.viewedProperties.map(v => {
//         const prop = properties.find(p => p.rentId === v.rentId);
//         return prop
//           ? {
//               rentId: prop.rentId,
//               city: prop.city,
//               area: prop.area,
//               viewedAt: v.viewedAt
//             }
//           : null;
//       }).filter(Boolean);

//       viewMap.set(user.phoneNumber, views);
//     });

//     // Combine phone numbers
//     const allPhones = new Set([
//       ...interestMap.keys(),
//       ...contactMap.keys(),
//       ...favoriteMap.keys(),
//       ...photoRequestMap.keys(),
//       ...offerMap.keys(),
//       ...helpRequestMap.keys(),
//       ...reportMap.keys(),
//       ...viewMap.keys()
//     ]);

//     const phoneArray = Array.from(allPhones).filter(Boolean);
//     const cleanPhones = phoneArray
//       .map(p => (typeof p === 'string' ? p.replace(/\D/g, '').slice(-10) : ''))
//       .filter(p => p.length === 10);

//     const userLogins = await UserLogin.aggregate([
//       {
//         $match: {
//           phone: { $in: cleanPhones }
//         }
//       },
//       {
//         $sort: { loginDate: -1, updatedAt: -1 }
//       },
//       {
//         $group: {
//           _id: "$phone",
//           loginDate: { $first: "$loginDate" },
//           updateDate: { $first: "$updatedAt" }
//         }
//       }
//     ]);

//     const loginMap = new Map();
//     userLogins.forEach(u => {
//       loginMap.set(u._id, {
//         loginDate: u.loginDate,
//         updateDate: u.updateDate
//       });
//     });

//     const result = phoneArray.map(phone => {
//       const clean = typeof phone === 'string' ? phone.replace(/\D/g, '').slice(-10) : '';
//       const login = loginMap.get(clean) || {};
//       const views = viewMap.get(phone) || [];

//       return {
//         phoneNumber: phone,
//         interestCount: interestMap.get(phone) || 0,
//         contactCount: contactMap.get(phone) || 0,
//         favoriteCount: favoriteMap.get(phone) || 0,
//         photoRequestCount: photoRequestMap.get(phone) || 0,
//         offerCount: offerMap.get(phone) || 0,
//         helpRequestCount: helpRequestMap.get(phone) || 0,
//         reportCount: reportMap.get(phone) || 0,
//         loginDate: login.loginDate || null,
//         updateDate: login.updateDate || null,
//         viewedProperties: views,
//         viewsCount: views.length
//       };
//     });

//     return res.status(200).json({
//       message: "User activity data fetched successfully",
//       data: result
//     });
//   } catch (error) {
//     console.error("Error fetching user activity:", error);
//     return res.status(500).json({
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// });


router.get('/get-user-complete-activity', async (req, res) => {
  try {
    const interestMap = new Map();
    const contactMap = new Map();
    const favoriteMap = new Map();
    const photoRequestMap = new Map();
    const offerMap = new Map();
    const helpRequestMap = new Map();
    const reportMap = new Map();
    const viewMap = new Map();
    const calledListMap = new Map(); // ✅

    // 1. Interest
    const interestProps = await AddModel.find({ interestRequests: { $exists: true, $ne: [] } });
    interestProps.forEach(p => {
      p.interestRequests.forEach(r => {
        const phone = r.phoneNumber;
        if (phone) interestMap.set(phone, (interestMap.get(phone) || 0) + 1);
      });
    });

    // 2. Contact
    const contactProps = await AddModel.find({ contactRequests: { $exists: true, $ne: [] } });
    contactProps.forEach(p => {
      p.contactRequests.forEach(r => {
        const phone = r.phoneNumber;
        if (phone) contactMap.set(phone, (contactMap.get(phone) || 0) + 1);
      });
    });

    // 3. Favorite
    const favoriteProps = await AddModel.find({ favoriteRequests: { $exists: true, $ne: [] } });
    favoriteProps.forEach(p => {
      p.favoriteRequests.forEach(r => {
        const phone = r.phoneNumber;
        if (phone) favoriteMap.set(phone, (favoriteMap.get(phone) || 0) + 1);
      });
    });

    // 4. Photo Requests
    const photoRequests = await PhotoRequest.find();
    photoRequests.forEach(r => {
      const phone = r.phoneNumber;
      if (phone) photoRequestMap.set(phone, (photoRequestMap.get(phone) || 0) + 1);
    });

    // 5. Offers
    const offers = await Offer.find();
    offers.forEach(r => {
      const phone = r.phoneNumber;
      if (phone) offerMap.set(phone, (offerMap.get(phone) || 0) + 1);
    });

    // 6. Help Requests
    const helpProps = await AddModel.find({ "helpRequests.0": { $exists: true } });
    helpProps.forEach(p => {
      p.helpRequests.forEach(r => {
        const phone = r.phoneNumber;
        if (phone) helpRequestMap.set(phone, (helpRequestMap.get(phone) || 0) + 1);
      });
    });

    // 7. Reports
    const reportProps = await AddModel.find({ reportProperty: { $exists: true, $ne: [] } });
    reportProps.forEach(p => {
      p.reportProperty.forEach(r => {
        const phone = r.phoneNumber;
        if (phone) reportMap.set(phone, (reportMap.get(phone) || 0) + 1);
      });
    });

    // 8. Views
    const allUserViews = await UserViewsModel.find();
    const allRentIds = [...new Set(allUserViews.flatMap(u => u.viewedProperties.map(v => v.rentId)))];

    const properties = await AddModel.find(
      { rentId: { $in: allRentIds } },
      "rentId rentalAmount propertyType propertyMode city area totalArea areaUnit ownership phoneNumber"
    );

    allUserViews.forEach(user => {
      const views = user.viewedProperties.map(v => {
        const prop = properties.find(p => p.rentId === v.rentId);
        return prop
          ? {
              rentId: prop.rentId,
              city: prop.city,
              area: prop.area,
              viewedAt: v.viewedAt
            }
          : null;
      }).filter(Boolean);

      viewMap.set(user.phoneNumber, views);
    });

    // 9. Called List (reverse lookup: userPhone who initiated contact)
    const contactLogs = await ContactLog.find();
    contactLogs.forEach(log => {
      const phone = log.userPhone;
      if (phone) calledListMap.set(phone, (calledListMap.get(phone) || 0) + 1);
    });

    // All phones
    const allPhones = new Set([
      ...interestMap.keys(),
      ...contactMap.keys(),
      ...favoriteMap.keys(),
      ...photoRequestMap.keys(),
      ...offerMap.keys(),
      ...helpRequestMap.keys(),
      ...reportMap.keys(),
      ...viewMap.keys(),
      ...calledListMap.keys() // ✅ include phones who called someone
    ]);

    const phoneArray = Array.from(allPhones).filter(Boolean);
    const cleanPhones = phoneArray
      .map(p => (typeof p === 'string' ? p.replace(/\D/g, '').slice(-10) : ''))
      .filter(p => p.length === 10);

    // Login tracking
    const userLogins = await UserLogin.aggregate([
      {
        $match: {
          phone: { $in: cleanPhones }
        }
      },
      {
        $sort: { loginDate: -1, updatedAt: -1 }
      },
      {
        $group: {
          _id: "$phone",
          loginDate: { $first: "$loginDate" },
          updateDate: { $first: "$updatedAt" }
        }
      }
    ]);

    const loginMap = new Map();
    userLogins.forEach(u => {
      loginMap.set(u._id, {
        loginDate: u.loginDate,
        updateDate: u.updateDate
      });
    });

    // Final result
    const result = phoneArray.map(phone => {
      const clean = typeof phone === 'string' ? phone.replace(/\D/g, '').slice(-10) : '';
      const login = loginMap.get(clean) || {};
      const views = viewMap.get(phone) || [];

      return {
        phoneNumber: phone,
        interestCount: interestMap.get(phone) || 0,
        contactCount: contactMap.get(phone) || 0,
        favoriteCount: favoriteMap.get(phone) || 0,
        photoRequestCount: photoRequestMap.get(phone) || 0,
        offerCount: offerMap.get(phone) || 0,
        helpRequestCount: helpRequestMap.get(phone) || 0,
        reportCount: reportMap.get(phone) || 0,
        calledListCount: calledListMap.get(clean) || 0, // ✅ Added
        loginDate: login.loginDate || null,
        updateDate: login.updateDate || null,
        viewedProperties: views,
        viewsCount: views.length
      };
    });

    return res.status(200).json({
      message: "User activity data (Rent) fetched successfully",
      data: result
    });

  } catch (error) {
    console.error("Error fetching user rent activity:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
});



router.get("/get-user-all-data", async (req, res) => {
  try {
    const { phoneNumber } = req.query;
    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // INTEREST REQUESTS
    const interestedProperties = await AddModel.find({
      "interestRequests.phoneNumber": phoneNumber,
    });
    const interestData = interestedProperties.map((property) => ({
      rentId: property.rentId,
      ownerPhone: property.phoneNumber,
      price: property.price,
      area: property.area,
      propertyMode: property.propertyMode,
      propertyType: property.propertyType,
      createdAt: property.createdAt,
    }));

    // CONTACT REQUESTS
    const contactProperties = await AddModel.find({
      "contactRequests.phoneNumber": phoneNumber,
    });
    const contactData = contactProperties.map((property) => ({
      rentId: property.rentId,
      ownerPhone: property.phoneNumber,
      price: property.price,
      area: property.area,
      propertyMode: property.propertyMode,
      propertyType: property.propertyType,
      createdAt: property.createdAt,
    }));

    // FAVORITE REQUESTS
    const favoriteProperties = await AddModel.find({
      "favoriteRequests.phoneNumber": phoneNumber,
    });
    const favoriteData = favoriteProperties.map((property) => ({
      rentId: property.rentId,
      ownerPhone: property.phoneNumber,
      price: property.price,
      area: property.area,
      propertyMode: property.propertyMode,
      propertyType: property.propertyType,
      createdAt: property.createdAt,
    }));

    // OFFERS
    const offerData = await Offer.find({ phoneNumber });

    // PHOTO REQUESTS
    const photoRequestData = await PhotoRequest.find({ phoneNumber });

    // USER VIEWS
    const userViewsDoc = await UserViewsModel.findOne({ phoneNumber });
    const viewedProperties = userViewsDoc?.viewedProperties || [];

    // CALLED LIST DETAILS (calls made TO this user — i.e., where they are the posted user)
    const calledList = await ContactLog.find({
      postedUserPhone: phoneNumber,
    }).select("userPhone postedUserPhone rentId contactedAt");

    // Final response
    return res.status(200).json({
      interestData,
      contactData,
      favoriteData,
      offerData,
      photoRequestData,
      viewedProperties,
      calledList,
    });



    

  } catch (error) {
    console.error("Error in /get-user-all-data:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});



// router.get("/get-user-all-data", async (req, res) => {
//   try {
//     const { phoneNumber } = req.query;
//     if (!phoneNumber) {
//       return res.status(400).json({ message: "Phone number is required" });
//     }

//     // INTEREST REQUESTS
//     const interestedProperties = await AddModel.find({
//       "interestRequests.phoneNumber": phoneNumber,
//     });
//     const interestData = interestedProperties.map((property) => ({
//       rentId: property.rentId,
//       ownerPhone: property.phoneNumber,
//       price: property.price,
//       area: property.area,
//       propertyMode: property.propertyMode,
//       propertyType: property.propertyType,
//       createdAt: property.createdAt,
//     }));

//     // CONTACT REQUESTS
//     const contactProperties = await AddModel.find({
//       "contactRequests.phoneNumber": phoneNumber,
//     });
//     const contactData = contactProperties.map((property) => ({
//       rentId: property.rentId,
//       ownerPhone: property.phoneNumber,
//       price: property.price,
//       area: property.area,
//       propertyMode: property.propertyMode,
//       propertyType: property.propertyType,
//       createdAt: property.createdAt,
//     }));

//     // FAVORITE REQUESTS
//     const favoriteProperties = await AddModel.find({
//       "favoriteRequests.phoneNumber": phoneNumber,
//     });
//     const favoriteData = favoriteProperties.map((property) => ({
//       rentId: property.rentId,
//       ownerPhone: property.phoneNumber,
//       price: property.price,
//       area: property.area,
//       propertyMode: property.propertyMode,
//       propertyType: property.propertyType,
//       createdAt: property.createdAt,
//     }));

//     // OFFERS
//     const offerData = await Offer.find({ phoneNumber });

//     // PHOTO REQUESTS
//     const photoRequestData = await PhotoRequest.find({ phoneNumber });

//     return res.status(200).json({
//       interestData,
//       contactData,
//       favoriteData,
//       offerData,
//       photoRequestData,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// });


router.get('/fetch-all-property-details', async (req, res) => {
  try {
    const properties = await AddModel.find({});

    const requiredFields = [
      'propertyMode', 'propertyType', 'rentalAmount',
      'totalArea', 'areaUnit',
      'rentType','bedrooms','floorNo', 'postedBy'
    ];

    const adsCountByUser = properties.reduce((acc, property) => {
      const phone = property.phoneNumber;
      acc[phone] = (acc[phone] || 0) + 1;
      return acc;
    }, {});

    const filteredProperties = properties.filter(property => {
      const hasReports = Array.isArray(property.reportProperty) && property.reportProperty.length > 0;
      const hasHelps = Array.isArray(property.helpRequests) && property.helpRequests.length > 0;
      return hasReports || hasHelps;
    });

    const combinedData = filteredProperties.map((property, index) => {
      const isComplete = requiredFields.every(field =>
        property[field] !== undefined &&
        property[field] !== null &&
        String(property[field]).trim() !== ''
      );

      const helpDetails = (property.helpRequests || []).map(help => ({
        phoneNumber: help.phoneNumber,
        selectHelpReason: help.selectHelpReason,
        comment: help.comment,
        requestedAt: help.requestedAt
      }));

      const reportDetails = (property.reportProperty || []).map(report => ({
        phoneNumber: report.phoneNumber,
        reason: report.reason,
        selectReasons: report.selectReasons,
        date: report.date
      }));

      return {
        slNo: index + 1,
        rentId: property.rentId,
        image: property.photos && property.photos.length > 0 ? property.photos[0] : null,
        phoneNumber: property.phoneNumber,
        ownerName: property.ownerName,
        propertyMode: property.propertyMode,
        propertyType: property.propertyType,
        rentalAmount: property.rentalAmount,
        area: property.area,
        city: property.city,
        state: property.state,
        createdBy: property.postedBy,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
        required: isComplete ? "yes" : "no",
        adsCount: adsCountByUser[property.phoneNumber] || 0,
        planName: property.planName || "",
        status: property.status || "Active",
        reportDetails,
        totalReports: reportDetails.length,
        helpRequests: helpDetails,
        totalHelpRequests: helpDetails.length
      };
    });

    res.status(200).json({
      success: true,
      message: "Filtered property data fetched successfully!",
      data: combinedData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
});

router.get('/bills/free-with-properties', async (req, res) => {
  try {
    // ✅ Fetch FREE Bills ONLY
    // Free bills have: paymentType === 'Free' OR planName === 'Free'
    const freeBills = await Bill.find({
      $or: [
        { paymentType: 'Free' },
        { planName: 'Free' }
      ]
    }).sort({ createdAt: -1 });

    if (!freeBills.length) {
      return res.status(404).json({ message: 'No Free Plan bills found.' });
    }

    // Step 2: For each bill, fetch associated properties using `rentId`
    const result = await Promise.all(freeBills.map(async (bill) => {
      const {
        billNo,
        planName,
        billAmount,
        netAmount,
        paymentType,
        validity,
        ownerPhone,
        adminOffice,
        adminName,
        billCreatedBy,
        createdAt,
        rentId
      } = bill;

      // ✅ Fetch properties using the correct rentId field
      const properties = await AddModel.find({ rentId: rentId });

      return {
        bill: {
          billNo,
          planName,
          billAmount,
          netAmount,
          paymentType,
          validity,
          ownerPhone,
          adminOffice,
          adminName,
          billCreatedBy,
          billCreatedAt: createdAt,
          rentId
        },
        properties
      };
    }));

    res.status(200).json({
      success: true,
      message: "Fetched Free Plan bills with associated properties using rentId successfully.",
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error while fetching Free Plan bills with properties.',
      error: error.message
    });
  }
});


router.get('/bills/non-free-with-properties', async (req, res) => {
  try {
    // ✅ Fetch PAID Bills ONLY (NOT Free)
    // Explicitly exclude paymentType === 'Free'
    const paidPaymentTypes = ['cash', 'online-pg', 'online-pg-link', 'online-bank-deposit', 'online-upi-kr', 'online-upi-others'];
    const paidBills = await Bill.find({
      $and: [
        { paymentType: { $ne: 'Free' } },  // ✅ Explicit: NOT Free
        { 
          $or: [
            { paymentType: { $in: paidPaymentTypes } },
            { planName: { $ne: 'Free' } }
          ]
        }
      ]
    }).sort({ createdAt: -1 });

    if (!paidBills.length) {
      return res.status(404).json({ message: 'No Paid Plan bills found.' });
    }

    // Step 2: For each bill, fetch associated properties using `rentId`
    const result = await Promise.all(
      paidBills.map(async (bill) => {
        const {
          billNo,
          planName,
          billAmount,
          netAmount,
          paymentType,
          validity,
          ownerPhone,
          adminOffice,
          adminName,
          billCreatedBy,
          createdAt,
          rentId
        } = bill;

        // Fetch associated properties using `rentId`
        const properties = await AddModel.find({ rentId: rentId });

        // Add additional info to each property
        const enhancedProperties = properties.map((property) => {
          return {
            ...property.toObject(),
            required: ['propertyMode', 'propertyType', 'rentalAmount', 'totalArea', 'areaUnit', 'bedrooms','floorNo','postedBy'].every(field =>
              property[field] !== undefined &&
              property[field] !== null &&
              String(property[field]).trim() !== ''
            ) ? 'Yes' : 'No',
            featureStatus: property.featureStatus || 'N/A',
          };
        }).filter(prop => prop.required === 'Yes'); // ✅ Keep only valid properties

        const planExpiryDate = validity
          ? new Date(new Date(createdAt).getTime() + validity * 24 * 60 * 60 * 1000)
          : null;

        return {
          bill: {
            billNo,
            planName,
            billAmount,
            netAmount,
            paymentType,
            validity,
            ownerPhone,
            adminOffice,
            adminName,
            billCreatedBy,
            billCreatedAt: createdAt,
            planExpiryDate,
            adsCount: enhancedProperties.length,
            rentId
          },
          properties: enhancedProperties
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Fetched Paid Plan bills with associated properties successfully.",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error while fetching Paid Plan bills.',
      error: error.message
    });
  }
});


router.get('/expired-buyer-plan-assitant', async (req, res) => {
  try {
    const buyerPlans = await PaymentPayUBuyer.find({ payustatususer: 'paid' });
    const expiredBuyerPlanDetails = [];

    for (const plan of buyerPlans) {
      const { Ra_Id } = plan;

      const planDoc = await PricingPlans.findOne({ rentId: Ra_Id });

      if (planDoc && isExpired(planDoc.expireDate)) {
        // Mark as expired
        plan.payustatususer = 'expiredPlan';
        await plan.save();

        // Fetch BuyerAssistance data related to this ba_id
        const assistanceList = await BuyerAssistance.find({ Ra_Id });

        const formattedAssistances = assistanceList.map(assist => ({
          Ra_Id: assist.Ra_Id,
          raName: assist.raName,
          phoneNumber: assist.phoneNumber,
          altPhoneNumber: assist.altPhoneNumber,
          city: assist.city,
          area: assist.area,
          loanInput: assist.loanInput,
          minPrice: assist.minPrice,
          maxPrice: assist.maxPrice,
          totalArea: assist.totalArea,
          areaUnit: assist.areaUnit,
          bedrooms: assist.bedrooms,
          propertyMode: assist.propertyMode,
          propertyType: assist.propertyType,
         
          state: assist.state,
          ra_status: assist.ra_status,
          ra_postBy: assist.ra_postBy,
          createdAt: assist.createdAt ? new Date(assist.createdAt).toLocaleDateString() : 'N/A',
          updatedAt: assist.updatedAt ? new Date(assist.updatedAt).toLocaleDateString() : 'N/A'
        }));

        expiredBuyerPlanDetails.push({
          Ra_Id,
          phone: plan.phone,
          planName: plan.planName,
          expireDate: planDoc.expireDate,
          payustatususer: 'expiredPlan',
          assistanceRequests: formattedAssistances
        });
      }
    }

    return res.status(200).json({
      message: 'Expired Tenant plans and their assistance requests fetched successfully.',
      data: expiredBuyerPlanDetails,
    });
  } catch (error) {
    console.error('Error fetching expired buyer plans:', error);
    res.status(500).json({
      message: 'Error fetching expired buyer plans and assistance requests.',
      error: error.message,
    });
  }
});


// -***************------


router.get('/get-user-activity-counts', async (req, res) => { 
  try {
    const interestMap = new Map();
    const contactMap = new Map();
    const favoriteMap = new Map();
    const photoRequestMap = new Map();
    const offerMap = new Map();
    const viewedPropertyMap = new Map();  // ✅ added
    const calledListMap = new Map();      // ✅ added

    // Load interestRequests
    const interestProperties = await AddModel.find({ interestRequests: { $exists: true, $ne: [] } });
    interestProperties.forEach(property => {
      property.interestRequests.forEach(req => {
        const phone = req.phoneNumber;
        if (phone) interestMap.set(phone, (interestMap.get(phone) || 0) + 1);
      });
    });

    // Load contactRequests
    const contactProperties = await AddModel.find({ contactRequests: { $exists: true, $ne: [] } });
    contactProperties.forEach(property => {
      property.contactRequests.forEach(req => {
        const phone = req.phoneNumber;
        if (phone) contactMap.set(phone, (contactMap.get(phone) || 0) + 1);
      });
    });

    // Load favoriteRequests
    const favoriteProperties = await AddModel.find({ favoriteRequests: { $exists: true, $ne: [] } });
    favoriteProperties.forEach(property => {
      property.favoriteRequests.forEach(req => {
        const phone = req.phoneNumber;
        if (phone) favoriteMap.set(phone, (favoriteMap.get(phone) || 0) + 1);
      });
    });

    // Load photo requests
    const photoRequests = await PhotoRequest.find();
    photoRequests.forEach(req => {
      const phone = req.phoneNumber;
      if (phone) photoRequestMap.set(phone, (photoRequestMap.get(phone) || 0) + 1);
    });

    // Load offer requests
    const offers = await Offer.find();
    offers.forEach(req => {
      const phone = req.phoneNumber;
      if (phone) offerMap.set(phone, (offerMap.get(phone) || 0) + 1);
    });

    // ✅ Load viewed properties
    const userViews = await UserViewsModel.find();
    userViews.forEach(user => {
      const phone = user.phoneNumber;
      const count = user.viewedProperties?.length || 0;
      if (phone && count > 0) viewedPropertyMap.set(phone, (viewedPropertyMap.get(phone) || 0) + count);
    });

    // ✅ Load called list
    const contactLogs = await ContactLog.find();
    contactLogs.forEach(log => {
      const phone = log.userPhone;
      if (phone) {
        const cleanPhone = phone.replace(/\D/g, '').slice(-10);
        if (cleanPhone.length === 10) {
          calledListMap.set(cleanPhone, (calledListMap.get(cleanPhone) || 0) + 1);
        }
      }
    });

    // ✅ Combine all unique phone numbers
    const allPhoneNumbers = new Set([
      ...interestMap.keys(),
      ...contactMap.keys(),
      ...favoriteMap.keys(),
      ...photoRequestMap.keys(),
      ...offerMap.keys(),
      ...viewedPropertyMap.keys(),
      ...calledListMap.keys()
    ]);

    const phoneArray = Array.from(allPhoneNumbers).filter(Boolean);
    const formattedPhones = phoneArray
      .map(phone => (typeof phone === 'string' ? phone.replace(/\D/g, '').slice(-10) : ''))
      .filter(p => p.length === 10);

    // ✅ Fetch login info
    const userLogins = await UserLogin.aggregate([
      {
        $match: { phone: { $in: formattedPhones } }
      },
      {
        $sort: { loginDate: -1, updatedAt: -1 }
      },
      {
        $group: {
          _id: "$phone",
          loginDate: { $first: "$loginDate" },
          updateDate: { $first: "$updatedAt" }
        }
      }
    ]);

    const loginMap = new Map();
    userLogins.forEach(u => {
      loginMap.set(u._id, {
        loginDate: u.loginDate,
        updateDate: u.updateDate
      });
    });

    // ✅ Final result
    const result = formattedPhones.map(cleanPhone => {
      const loginInfo = loginMap.get(cleanPhone) || {};

      return {
        phoneNumber: cleanPhone,
        interestCount: interestMap.get(cleanPhone) || 0,
        contactCount: contactMap.get(cleanPhone) || 0,
        favoriteCount: favoriteMap.get(cleanPhone) || 0,
        photoRequestCount: photoRequestMap.get(cleanPhone) || 0,
        offerCount: offerMap.get(cleanPhone) || 0,
        viewedPropertyCount: viewedPropertyMap.get(cleanPhone) || 0,
        calledListCount: calledListMap.get(cleanPhone) || 0,
        loginDate: loginInfo.loginDate || null,
        updateDate: loginInfo.updateDate || null
      };
    });

    return res.status(200).json({
      message: "Activity counts fetched successfully",
      data: result
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching activity counts",
      error: error.message
    });
  }
});


// router.get('/get-user-activity-counts', async (req, res) => {
//   try {
//     const interestMap = new Map();
//     const contactMap = new Map();
//     const favoriteMap = new Map();
//     const photoRequestMap = new Map();
//     const offerMap = new Map();

//     // Load interestRequests
//     const interestProperties = await AddModel.find({ interestRequests: { $exists: true, $ne: [] } });
//     interestProperties.forEach(property => {
//       property.interestRequests.forEach(req => {
//         const phone = req.phoneNumber;
//         if (phone) {
//           interestMap.set(phone, (interestMap.get(phone) || 0) + 1);
//         }
//       });
//     });

//     // Load contactRequests
//     const contactProperties = await AddModel.find({ contactRequests: { $exists: true, $ne: [] } });
//     contactProperties.forEach(property => {
//       property.contactRequests.forEach(req => {
//         const phone = req.phoneNumber;
//         if (phone) {
//           contactMap.set(phone, (contactMap.get(phone) || 0) + 1);
//         }
//       });
//     });

//     // Load favoriteRequests
//     const favoriteProperties = await AddModel.find({ favoriteRequests: { $exists: true, $ne: [] } });
//     favoriteProperties.forEach(property => {
//       property.favoriteRequests.forEach(req => {
//         const phone = req.phoneNumber;
//         if (phone) {
//           favoriteMap.set(phone, (favoriteMap.get(phone) || 0) + 1);
//         }
//       });
//     });

//     // Load photo requests
//     const photoRequests = await PhotoRequest.find();
//     photoRequests.forEach(req => {
//       const phone = req.phoneNumber;
//       if (phone) {
//         photoRequestMap.set(phone, (photoRequestMap.get(phone) || 0) + 1);
//       }
//     });

//     // Load offer requests
//     const offers = await Offer.find();
//     offers.forEach(req => {
//       const phone = req.phoneNumber;
//       if (phone) {
//         offerMap.set(phone, (offerMap.get(phone) || 0) + 1);
//       }
//     });

//     // Combine all unique phone numbers
//     const allPhoneNumbers = new Set([
//       ...interestMap.keys(),
//       ...contactMap.keys(),
//       ...favoriteMap.keys(),
//       ...photoRequestMap.keys(),
//       ...offerMap.keys()
//     ]);

//     const phoneArray = Array.from(allPhoneNumbers).filter(Boolean);
//     const formattedPhones = phoneArray
//       .map(phone => (typeof phone === 'string' ? phone.replace(/\D/g, '').slice(-10) : ''))
//       .filter(p => p.length === 10);

//     // Fetch latest loginDate and updateDate from UserLogin
//     const userLogins = await UserLogin.aggregate([
//       {
//         $match: {
//           phone: { $in: formattedPhones }
//         }
//       },
//       {
//         $sort: { loginDate: -1, updatedAt: -1 }
//       },
//       {
//         $group: {
//           _id: "$phone",
//           loginDate: { $first: "$loginDate" },
//           updateDate: { $first: "$updatedAt" }
//         }
//       }
//     ]);

//     const loginMap = new Map();
//     userLogins.forEach(u => {
//       loginMap.set(u._id, {
//         loginDate: u.loginDate,
//         updateDate: u.updateDate
//       });
//     });

//     // Final result build
//     const result = phoneArray.map(phone => {
//       const cleanPhone = typeof phone === 'string' ? phone.replace(/\D/g, '').slice(-10) : '';
//       const loginInfo = loginMap.get(cleanPhone) || {};

//       return {
//         phoneNumber: phone,
//         interestCount: interestMap.get(phone) || 0,
//         contactCount: contactMap.get(phone) || 0,
//         favoriteCount: favoriteMap.get(phone) || 0,
//         photoRequestCount: photoRequestMap.get(phone) || 0,
//         offerCount: offerMap.get(phone) || 0,
//         loginDate: loginInfo.loginDate || null,
//         updateDate: loginInfo.updateDate || null
//       };
//     });

//     return res.status(200).json({
//       message: "Activity counts fetched successfully",
//       data: result
//     });

//   } catch (error) {
//     return res.status(500).json({
//       message: "Error fetching activity counts",
//       error: error.message
//     });
//   }
// });


router.get('/fetch-recent-properties', async (req, res) => {
  try {
    // Calculate date 30 days ago from today
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch and filter required fields, sorted by newest first
    const recentProperties = await AddModel.find(
      { createdAt: { $gte: thirtyDaysAgo } },
      {
        propertyMode: 1,
        propertyType: 1,
        rentalAmount: 1,    // ✅ replaced price
        rentId: 1,          // ✅ replaced ppcId
        phoneNumber: 1,
        createdAt: 1
      }
    ).sort({ createdAt: -1 }); // Sort descending by date

    res.status(200).json({
      message: 'Recent properties added within the last 30 days fetched successfully!',
      properties: recentProperties
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching recent properties.',
      error: error.message
    });
  }
});


router.post('/assign-phone', async (req, res) => {
  try {
    const { rentId, assignedPhoneNumber } = req.body;

    const property = await AddModel.findOneAndUpdate(
      { rentId: rentId.toString() },
      {
        assignedPhoneNumber,
        setRentId: true,
        setRentAssignedAt: new Date()  // ⏰ Store date/time here
      },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json({
      message: 'Phone number assigned successfully',
      property
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/unassign-phone', async (req, res) => {
  try {
    const { rentId } = req.body;

    const property = await AddModel.findOne({ rentId: rentId.toString() });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const updated = await AddModel.findOneAndUpdate(
      { rentId: rentId.toString() },
      {
        previouslyAssignedPhoneNumber: property.assignedPhoneNumber,
        previouslyAssignedAt: property.setRentAssignedAt,
        assignedPhoneNumber: null,
        setRentAssignedAt: null,
        setRentId: false
      },
      { new: true }
    );

    res.status(200).json({ message: 'Assignment temporarily removed', updated });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/undo-unassign-phone', async (req, res) => {
  try {
    const { rentId } = req.body;

    const property = await AddModel.findOne({ rentId: rentId.toString() });

    if (!property || !property.previouslyAssignedPhoneNumber) {
      return res.status(404).json({ error: 'No backup data found for undo' });
    }

    const updated = await AddModel.findOneAndUpdate(
      { rentId: rentId.toString() },
      {
        assignedPhoneNumber: property.previouslyAssignedPhoneNumber,
        setRentAssignedAt: property.previouslyAssignedAt || new Date(),
        setRentId: true,
        previouslyAssignedPhoneNumber: null,
        previouslyAssignedAt: null
      },
      { new: true }
    );

    res.status(200).json({ message: 'Assignment restored', updated });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/get-property-details', async (req, res) => {
  try {
    const properties = await AddModel.find(
      { assignedPhoneNumber: { $exists: true, $ne: '' } },
      {
        rentId: 1,
        assignedPhoneNumber: 1,
        phoneNumber: 1,
        setRentId: 1,
        setRentAssignedAt: 1, // Include timestamp
        _id: 0
      }
    );

    if (!properties || properties.length === 0) {
      return res.status(404).json({ error: 'No assigned phone numbers found' });
    }

    const formatted = properties.map(p => ({
      rentId: p.rentId,
      assignedPhoneNumber: p.assignedPhoneNumber,
      originalPhoneNumber: p.phoneNumber,
      setRentId: p.setRentId || false,
      setRentAssignedAt: p.setRentAssignedAt || null // Format optional
    }));

    res.status(200).json(formatted);

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get("/get-address-requests-all", async (req, res) => {
  try {
    const requests = await AddressRequest.find().sort({ createdAt: -1 });

    // Fetch full property details for each ppcId
    const enrichedRequests = await Promise.all(
      requests.map(async (request) => {
        const property = await AddModel.findOne({ rentId: request.rentId }).lean();
        return {
          ...request.toObject(),
          propertyDetails: property || null,
        };
      })
    );

    res.status(200).json({
      success: true,
      total: enrichedRequests.length,
      requests: enrichedRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching address requests with property data.",
      error: error.message,
    });
  }
});


// ✅ GET: Active Properties Summary (District)
router.get('/active-properties-district', async (req, res) => {
  try {
    const properties = await AddModel.find(
      {
        status: 'active',
        isDeleted: false,
        rentId: { $exists: true, $ne: null },
        phoneNumber: { $exists: true, $ne: null },
        district: { $exists: true, $ne: "" }
      },
      {
        rentId: 1,
        phoneNumber: 1,
        status: 1,
        state: 1,
        district: 1,
        _id: 0
      }
    );

    res.status(200).json({ data: properties });
  } catch (error) {
    console.error("Error fetching active properties by district:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ GET: Active Properties Summary (City)
router.get('/active-properties-city', async (req, res) => {
  try {
    const properties = await AddModel.find(
      {
        status: 'active',
        isDeleted: false,
        rentId: { $exists: true, $ne: null },
        phoneNumber: { $exists: true, $ne: null },
        city: { $exists: true, $ne: "" }
      },
      {
        rentId: 1,
        phoneNumber: 1,
        status: 1,
        state: 1,
        city: 1,
        _id: 0
      }
    );

    res.status(200).json({ data: properties });
  } catch (error) {
    console.error("Error fetching active properties by city:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ GET: Active Properties Summary (Area)
router.get('/active-properties-area', async (req, res) => {
  try {
    const properties = await AddModel.find(
      {
        status: 'active',
        isDeleted: false,
        rentId: { $exists: true, $ne: null },
        phoneNumber: { $exists: true, $ne: null },
        area: { $exists: true, $ne: "" }
      },
      {
        rentId: 1,
        phoneNumber: 1,
        status: 1,
        state: 1,
        area: 1,
        _id: 0
      }
    );

    res.status(200).json({ data: properties });
  } catch (error) {
    console.error("Error fetching active properties by area:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ GET: Active Properties Summary (State)
router.get('/active-properties-state', async (req, res) => {
  try {
    const properties = await AddModel.find(
      {
        status: 'active',
        isDeleted: false,
        rentId: { $exists: true, $ne: null },
        phoneNumber: { $exists: true, $ne: null },
        state: { $exists: true, $ne: "" }
      },
      {
        rentId: 1,
        phoneNumber: 1,
        status: 1,
        state: 1,
        _id: 0
      }
    );

    res.status(200).json({ data: properties });
  } catch (error) {
    console.error("Error fetching active properties by state:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// ✅ GET: All Unique Cities
router.get('/unique-cities', async (req, res) => {
  try {
    const cities = await AddModel.distinct("city", {
      city: { $exists: true, $ne: "" },
      isDeleted: false
    });

    res.status(200).json({ cities });
  } catch (error) {
    console.error("Error fetching unique cities:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ✅ GET: All Unique Areas
router.get('/unique-areas', async (req, res) => {
  try {
    const areas = await AddModel.distinct("area", {
      area: { $exists: true, $ne: "" },
      isDeleted: false
    });

    res.status(200).json({ areas });
  } catch (error) {
    console.error("Error fetching unique areas:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// ✅ GET /expired-plan-properties
router.get('/all-expired-properties', async (req, res) => {
  try {
    const expiredProperties = await AddModel.find({ status: 'expired' }).sort({ updatedAt: -1 });

    res.status(200).json({
      status: 'success',
      expiredCount: expiredProperties.length,
      expiredPlans: expiredProperties,
    });
  } catch (error) {
    console.error('Error fetching all expired properties:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    });
  }
});



// PUT: Change status of an expired property to active or complete using rentId
router.put('/update-expired-property-status', async (req, res) => {
  try {
    const { rentId, newStatus, updatedBy } = req.body;

    // Validate required inputs
    if (!rentId || !newStatus) {
      return res.status(400).json({ message: 'rentId and newStatus are required' });
    }

    // Allow only valid target statuses
    if (!['active', 'complete'].includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid newStatus. Must be "active" or "complete".' });
    }

    // Find and update the property by rentId and status
    const updatedProperty = await AddModel.findOneAndUpdate(
      { rentId: rentId, status: 'expired' }, 
      {
        status: newStatus,
        previousStatus: 'expired',
        updatedAt: new Date(),
        reason: `Manually updated from expired to ${newStatus} by ${updatedBy || 'Admin'}`
      },
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: 'Expired property not found for given Rent ID' });
    }

    res.status(200).json({
      message: `Property status updated to "${newStatus}" successfully`,
      data: updatedProperty,
    });
  } catch (error) {
    console.error('Error updating expired property status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get("/fetch-featured-properties", async (req, res) => {
  try {
    const featuredProperties = await AddModel.find({ featureStatus: "yes" });

    res.status(200).json({
      message: "Featured properties fetched successfully!",
      properties: featuredProperties,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured properties.", error });
  }
});


router.get('/properties-with-bankloan', async (req, res) => {
  try {
    const properties = await AddModel.find({
      bankLoan: { $regex: /^yes$/i } // matches 'yes', 'YES', 'Yes', etc.
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Properties with bank loan YES fetched successfully!',
      count: properties.length,
      data: properties
    });
  } catch (error) {
    console.error('Error fetching bank loan properties:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET: Fetch properties that have "Loan Help" in helpRequests
router.get('/properties-with-loan-help', async (req, res) => {
  try {
    const properties = await AddModel.find({
      helpRequests: {
        $elemMatch: { selectHelpReason: 'Loan Help' }
      }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Properties with Loan Help requests fetched successfully.',
      count: properties.length,
      data: properties
    });
  } catch (error) {
    console.error('Error fetching properties with Loan Help:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/get-rentId-activity-counts', async (req, res) => {
  try {
    const rentMap = new Map();

    // Helper to initialize and increment
    const increment = (rentId, field, status = null) => {
      if (!rentMap.has(rentId)) {
        rentMap.set(rentId, {
          rentId,
          status: status || '',
          interestCount: 0,
          contactCount: 0,
          favoriteCount: 0,
          photoRequestCount: 0,
          offerCount: 0,
          viewCount: 0,
          callCount: 0
        });
      }
      rentMap.get(rentId)[field]++;
    };

    // 1. Interest Requests
    const interestProps = await AddModel.find({ interestRequests: { $exists: true, $ne: [] } });
    interestProps.forEach(prop => {
      const { rentId, interestRequests, status } = prop;
      if (rentId) {
        interestRequests.forEach(() => increment(rentId, 'interestCount', status));
      }
    });

    // 2. Contact Requests
    const contactProps = await AddModel.find({ contactRequests: { $exists: true, $ne: [] } });
    contactProps.forEach(prop => {
      const { rentId, contactRequests, status } = prop;
      if (rentId) {
        contactRequests.forEach(() => increment(rentId, 'contactCount', status));
      }
    });

    // 3. Favorite Requests
    const favoriteProps = await AddModel.find({ favoriteRequests: { $exists: true, $ne: [] } });
    favoriteProps.forEach(prop => {
      const { rentId, favoriteRequests, status } = prop;
      if (rentId) {
        favoriteRequests.forEach(() => increment(rentId, 'favoriteCount', status));
      }
    });

    // 4. Photo Requests
    const photoRequests = await PhotoRequest.find();
    photoRequests.forEach(req => {
      const { rentId } = req;
      if (rentId) increment(rentId, 'photoRequestCount');
    });

    // 5. Offers
    const offers = await Offer.find();
    offers.forEach(req => {
      const { rentId } = req;
      if (rentId) increment(rentId, 'offerCount');
    });

    // 6. Viewed Properties
    const userViews = await UserViewsModel.find();
    userViews.forEach(user => {
      user.viewedProperties?.forEach(view => {
        const { rentId } = view;
        if (rentId) increment(rentId, 'viewCount');
      });
    });

    // 7. Contact Logs (Called List)
    const contactLogs = await ContactLog.find();
    contactLogs.forEach(log => {
      const { rentId } = log;
      if (rentId) increment(rentId, 'callCount');
    });

    // Convert map to array
    const finalData = Array.from(rentMap.values());

    res.status(200).json({
      message: "Activity counts by rentId fetched successfully",
      data: finalData
    });

  } catch (error) {
    console.error("Error fetching rentId activity counts:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

router.get("/fetch-user-all-datas", async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const cleanedPhone = phoneNumber.replace(/\D/g, "").slice(-10);

    // INTEREST REQUESTS
    const interestedProperties = await AddModel.find({
      "interestRequests.phoneNumber": cleanedPhone,
    });
    const interestData = interestedProperties.flatMap((property) =>
      property.interestRequests
        .filter((req) => req.phoneNumber === cleanedPhone)
        .map(() => ({
          rentId: property.rentId,
          ownerPhone: property.phoneNumber,
          rentalAmount: property.rentalAmount,
          area: property.area,
          city: property.city,
          propertyMode: property.propertyMode,
          propertyType: property.propertyType,
          createdAt: property.createdAt,
        }))
    );

    // CONTACT REQUESTS
    const contactProperties = await AddModel.find({
      "contactRequests.phoneNumber": cleanedPhone,
    });
    const contactData = contactProperties.flatMap((property) =>
      property.contactRequests
        .filter((req) => req.phoneNumber === cleanedPhone)
        .map(() => ({
          rentId: property.rentId,
          ownerPhone: property.phoneNumber,
          rentalAmount: property.rentalAmount,
          area: property.area,
          city: property.city,
          propertyMode: property.propertyMode,
          propertyType: property.propertyType,
          createdAt: property.createdAt,
        }))
    );

    // FAVORITE REQUESTS
    const favoriteProperties = await AddModel.find({
      "favoriteRequests.phoneNumber": cleanedPhone,
    });
    const favoriteData = favoriteProperties.flatMap((property) =>
      property.favoriteRequests
        .filter((req) => req.phoneNumber === cleanedPhone)
        .map(() => ({
          rentId: property.rentId,
          ownerPhone: property.phoneNumber,
          rentalAmount: property.rentalAmount,
          area: property.area,
          city: property.city,
          propertyMode: property.propertyMode,
          propertyType: property.propertyType,
          createdAt: property.createdAt,
        }))
    );

    // OFFERS
    const offerData = await Offer.find({ phoneNumber: cleanedPhone });

    // PHOTO REQUESTS
    const photoRequestData = await PhotoRequest.find({ phoneNumber: cleanedPhone });

    // HELP REQUESTS
    const helpProperties = await AddModel.find({
      "helpRequests.phoneNumber": cleanedPhone,
    });
    const helpRequestData = helpProperties.flatMap((property) =>
      property.helpRequests
        .filter((req) => req.phoneNumber === cleanedPhone)
        .map(() => ({
          rentId: property.rentId,
          ownerPhone: property.phoneNumber,
          rentalAmount: property.rentalAmount,
          area: property.area,
          city: property.city,
          propertyMode: property.propertyMode,
          propertyType: property.propertyType,
          createdAt: property.createdAt,
        }))
    );

    // REPORT PROPERTY
    const reportProperties = await AddModel.find({
      "reportProperty.phoneNumber": cleanedPhone,
    });
    const reportData = reportProperties.flatMap((property) =>
      property.reportProperty
        .filter((req) => req.phoneNumber === cleanedPhone)
        .map(() => ({
          rentId: property.rentId,
          ownerPhone: property.phoneNumber,
          rentalAmount: property.rentalAmount,
          area: property.area,
          city: property.city,
          propertyMode: property.propertyMode,
          propertyType: property.propertyType,
          createdAt: property.createdAt,
        }))
    );

    // VIEWED PROPERTIES
    const userViews = await UserViewsModel.findOne({ phoneNumber: cleanedPhone });
    const viewedRentIds = userViews?.viewedProperties.map((v) => v.rentId) || [];

    const viewedProperties = await AddModel.find(
      { rentId: { $in: viewedRentIds } },
      "rentId phoneNumber rentalAmount area city propertyType propertyMode createdAt"
    );

    const viewedData = viewedProperties.map((p) => ({
      rentId: p.rentId,
      ownerPhone: p.phoneNumber,
      rentalAmount: p.rentalAmount,
      area: p.area,
      city: p.city,
      propertyType: p.propertyType,
      propertyMode: p.propertyMode,
      createdAt: p.createdAt,
    }));

    // CALLED LIST DATA
    const calledListRaw = await ContactLog.find({ userPhone: cleanedPhone });
    const calledListData = calledListRaw.map((log) => ({
      rentId: log.rentId,
      userPhone: log.userPhone,
      postedUserPhone: log.postedUserPhone,
      contactedAt: log.contactedAt,
    }));

    // Final Response
    return res.status(200).json({
      message: "User-related data fetched successfully",
      data: {
        interestData,
        contactData,
        favoriteData,
        offerData,
        photoRequestData,
        helpRequestData,
        reportData,
        viewedData,
        calledListData,
      },
    });
  } catch (error) {
    console.error("Error in /fetch-user-all-datas:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});


// // Utility: Get start/end of date
// const getDateRange = (daysAgo = 0) => {
//   const start = new Date();
//   start.setHours(0, 0, 0, 0);
//   start.setDate(start.getDate() - daysAgo);

//   const end = new Date(start);
//   end.setHours(23, 59, 59, 999);

//   return { start, end };
// };

// router.get("/get-rent-stats", async (req, res) => {
//   try {
//     const { start: todayStart, end: todayEnd } = getDateRange(0);
//     const { start: yesterdayStart, end: yesterdayEnd } = getDateRange(1);

//     const selectFields =
//       "rentId phoneNumber createdAt updatedAt propertyMode propertyType rentalAmount status helpRequests reportProperty";

//     // Fetch ALL docs that could possibly have today or yesterday activity
//     const allData = await AddModel.find().select(selectFields).lean();

//     // const filterByActivity = (start, end) => {
//     //   return allData.filter((d) => {
//     //     // Property created in range
//     //     const createdInRange =
//     //       d.createdAt >= start && d.createdAt <= end;

//     //     // Any help request in range
//     //     const helpInRange = (d.helpRequests || []).some(
//     //       (h) => h.requestedAt >= start && h.requestedAt <= end
//     //     );

//     //     // Any report property in range
//     //     const reportInRange = (d.reportProperty || []).some(
//     //       (r) => r.date >= start && r.date <= end
//     //     );

//     //     return createdInRange || helpInRange || reportInRange;
//     //   });
//     // };

//     const filterByActivity = (start, end) => {
//   return allData.filter((d) => {
//     // Created or updated in range
//     const createdOrUpdatedInRange =
//       (d.createdAt >= start && d.createdAt <= end) ||
//       (d.updatedAt >= start && d.updatedAt <= end);

//     // Any help request in range
//     const helpInRange = (d.helpRequests || []).some(
//       (h) => h.requestedAt >= start && h.requestedAt <= end
//     );

//     // Any report property in range
//     const reportInRange = (d.reportProperty || []).some(
//       (r) => r.date >= start && r.date <= end
//     );

//     return createdOrUpdatedInRange || helpInRange || reportInRange;
//   });
// };


//     const summarize = (data, start, end) => {
//       return {
//         total: data.length,
//         statusCounts: {
//           incomplete: data.filter((d) => d.status === "incomplete").length,
//           complete: data.filter((d) => d.status === "complete").length,
//           active: data.filter((d) => d.status === "active").length,
//           delete: data.filter((d) => d.status === "delete").length,
//         },
//         helpRequestsCount: data.reduce(
//           (sum, d) =>
//             sum +
//             (d.helpRequests || []).filter(
//               (h) => h.requestedAt >= start && h.requestedAt <= end
//             ).length,
//           0
//         ),
//         reportPropertyCount: data.reduce(
//           (sum, d) =>
//             sum +
//             (d.reportProperty || []).filter(
//               (r) => r.date >= start && r.date <= end
//             ).length,
//           0
//         ),
//         properties: data.map((d) => ({
//           ppcId: d.rentId,
//           phoneNumber: d.phoneNumber,
//           createdAt: d.createdAt,
//           updatedAt: d.updatedAt,
//           propertyMode: d.propertyMode,
//           propertyType: d.propertyType,
//           price: d.rentalAmount,
//           status: d.status,
//           helpRequests: (d.helpRequests || []).filter(
//             (h) => h.requestedAt >= start && h.requestedAt <= end
//           ),
//           reportProperty: (d.reportProperty || []).filter(
//             (r) => r.date >= start && r.date <= end
//           ),
//         })),
//       };
//     };

//     const todayData = filterByActivity(todayStart, todayEnd);
//     const yesterdayData = filterByActivity(yesterdayStart, yesterdayEnd);

//     res.json({
//       status: "success",
//       today: summarize(todayData, todayStart, todayEnd),
//       yesterday: summarize(yesterdayData, yesterdayStart, yesterdayEnd),
//     });
//   } catch (error) {
//     console.error("Error fetching rent stats:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Server error fetching rent stats",
//     });
//   }
// });




router.get("/get-dashboard-details-datas", async (req, res) => {
  try {
    // 📅 Define date ranges
    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();
    const yesterdayStart = moment().subtract(1, "days").startOf("day").toDate();
    const yesterdayEnd = moment().subtract(1, "days").endOf("day").toDate();

    // 📌 Fetch only today & yesterday records in parallel
    const [
      photoRequests,
      offers,
      addressRequests,
      userLogins
    ] = await Promise.all([
      PhotoRequest.find({
        updatedAt: { $gte: yesterdayStart, $lte: todayEnd }
      }).sort({ updatedAt: -1 }).lean(),

      Offer.find({
        offerDate: { $gte: yesterdayStart, $lte: todayEnd }
      }).sort({ offerDate: -1 }).lean(),

      AddressRequest.find({
        updatedAt: { $gte: yesterdayStart, $lte: todayEnd }
      }).sort({ updatedAt: -1 }).lean(),

      UserLogin.find({
        loginDate: { $gte: yesterdayStart, $lte: todayEnd }
      }).sort({ loginDate: -1 }).lean()
    ]);

    // 🏠 Attach property details to all items
    const enrichWithProperty = async (list) =>
      Promise.all(
        list.map(async (item) => {
          const property = await AddModel.findOne({ rentId: item.rentId }).lean();
          return { ...item, propertyDetails: property || null };
        })
      );

    const enrichedPhotoRequests = await enrichWithProperty(photoRequests);
    const enrichedOffers = await enrichWithProperty(offers);
    const enrichedAddressRequests = await enrichWithProperty(addressRequests);

    // 📊 Count helper
    const getCounts = (data, dateField) => ({
      today: data.filter(
        (item) =>
          item[dateField] >= todayStart &&
          item[dateField] <= todayEnd
      ).length,
      yesterday: data.filter(
        (item) =>
          item[dateField] >= yesterdayStart &&
          item[dateField] <= yesterdayEnd
      ).length,
    });

    // 📤 Final response
    res.status(200).json({
      success: true,
      totalCounts: {
        photoRequests: enrichedPhotoRequests.length,
        offers: enrichedOffers.length,
        addressRequests: enrichedAddressRequests.length,
        userLogins: userLogins.length
      },
      dateWiseCounts: {
        photoRequests: getCounts(enrichedPhotoRequests, "updatedAt"),
        offers: getCounts(enrichedOffers, "offerDate"),
        addressRequests: getCounts(enrichedAddressRequests, "updatedAt"),
        userLogins: getCounts(userLogins, "loginDate")
      },
      data: {
        photoRequests: enrichedPhotoRequests,
        offers: enrichedOffers,
        addressRequests: enrichedAddressRequests,
        userLogins
      }
    });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data.",
      error: error.message
    });
  }
});


router.get("/get-dashboard-detail-data", async (req, res) => {
  try {
    let dates = [];

    // Accept ?dates=YYYY-MM-DD,YYYY-MM-DD or ?date=YYYY-MM-DD
    if (req.query.dates) {
      dates = req.query.dates.split(",").map((d) => d.trim());
    } else if (req.query.date) {
      dates = [req.query.date.trim()];
    } else {
      return res.status(400).json({
        status: "error",
        message: "Please provide date or dates in query params",
      });
    }

    const results = {};

    for (const dateStr of dates) {
      const { start, end } = getDateRangeForDay(dateStr);

      // Fetch data for this date range in parallel
      const [photoRequests, offers, addressRequests, userLogins] =
        await Promise.all([
          PhotoRequest.find({
            updatedAt: { $gte: start, $lte: end },
          })
            .sort({ updatedAt: -1 })
            .lean(),

          Offer.find({
            offerDate: { $gte: start, $lte: end },
          })
            .sort({ offerDate: -1 })
            .lean(),

          AddressRequest.find({
            updatedAt: { $gte: start, $lte: end },
          })
            .sort({ updatedAt: -1 })
            .lean(),

          UserLogin.find({
            loginDate: { $gte: start, $lte: end },
          })
            .sort({ loginDate: -1 })
            .lean(),
        ]);

      // Enrich with property details
      const enrichWithProperty = async (list) =>
        Promise.all(
          list.map(async (item) => {
            const property = await AddModel.findOne({
              rentId: item.rentId,
            }).lean();
            return { ...item, propertyDetails: property || null };
          })
        );

      const enrichedPhotoRequests = await enrichWithProperty(photoRequests);
      const enrichedOffers = await enrichWithProperty(offers);
      const enrichedAddressRequests = await enrichWithProperty(addressRequests);

      // Build summary
      results[formatDateKey(start)] = {
        totalCounts: {
          photoRequests: enrichedPhotoRequests.length,
          offers: enrichedOffers.length,
          addressRequests: enrichedAddressRequests.length,
          userLogins: userLogins.length,
        },
        data: {
          photoRequests: enrichedPhotoRequests,
          offers: enrichedOffers,
          addressRequests: enrichedAddressRequests,
          userLogins,
        },
      };
    }

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data.",
      error: error.message,
    });
  }
});



// Utility: Get start/end of a given date
const getDateRangeForDay = (dateStr) => {
  const start = new Date(dateStr);
  start.setHours(0, 0, 0, 0);
  const end = new Date(dateStr);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// Format date to DD-MM-YYYY
const formatDateKey = (date) => {
  const d = new Date(date);
  return [
    String(d.getDate()).padStart(2, "0"),
    String(d.getMonth() + 1).padStart(2, "0"),
    d.getFullYear(),
  ].join("-");
};

router.get("/get-rent-date", async (req, res) => {
  try {
    let dates = [];

    // Accept ?dates=YYYY-MM-DD,YYYY-MM-DD or ?date=YYYY-MM-DD
    if (req.query.dates) {
      dates = req.query.dates.split(",").map((d) => d.trim());
    } else if (req.query.date) {
      dates = [req.query.date.trim()];
    } else {
      return res.status(400).json({
        status: "error",
        message: "Please provide date or dates in query params",
      });
    }

    const selectFields =
      "rentId phoneNumber createdAt updatedAt propertyMode propertyType rentalAmount status helpRequests reportProperty";

    const results = {};

    for (const dateStr of dates) {
      const { start, end } = getDateRangeForDay(dateStr);

      // Fetch only records with activity in this date
      const dayData = await AddModel.find({
        $or: [
          { createdAt: { $gte: start, $lte: end } },
          { updatedAt: { $gte: start, $lte: end } },
          { "helpRequests.requestedAt": { $gte: start, $lte: end } },
          { "reportProperty.date": { $gte: start, $lte: end } },
        ],
      })
        .select(selectFields)
        .lean();

      const summary = {
        total: dayData.length,
        statusCounts: {
          incomplete: dayData.filter((d) => d.status === "incomplete").length,
          complete: dayData.filter((d) => d.status === "complete").length,
          active: dayData.filter((d) => d.status === "active").length,
          delete: dayData.filter((d) => d.status === "delete").length,
        },
        helpRequestsCount: dayData.reduce(
          (sum, d) =>
            sum +
            (d.helpRequests || []).filter(
              (h) => h.requestedAt >= start && h.requestedAt <= end
            ).length,
          0
        ),
        reportPropertyCount: dayData.reduce(
          (sum, d) =>
            sum +
            (d.reportProperty || []).filter(
              (r) => r.date >= start && r.date <= end
            ).length,
          0
        ),
        properties: dayData.map((d) => ({
          rentId: d.rentId,
          phoneNumber: d.phoneNumber,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
          propertyMode: d.propertyMode,
          propertyType: d.propertyType,
          price: d.rentalAmount,
          status: d.status,
          helpRequests: (d.helpRequests || []).filter(
            (h) => h.requestedAt >= start && h.requestedAt <= end
          ),
          reportProperty: (d.reportProperty || []).filter(
            (r) => r.date >= start && r.date <= end
          ),
        })),
      };

      results[formatDateKey(start)] = summary;
    }

    res.json({
      status: "success",
      data: results,
    });
  } catch (error) {
    console.error("Error fetching rent stats:", error);
    res.status(500).json({
      status: "error",
      message: "Server error fetching rent stats",
    });
  }
});



router.get("/get-rent-dates", async (req, res) => {
  try {
    let dates = [];

    // Accept ?dates=YYYY-MM-DD,YYYY-MM-DD or ?date=YYYY-MM-DD
    if (req.query.dates) {
      dates = req.query.dates.split(",").map((d) => d.trim());
    } else if (req.query.date) {
      dates = [req.query.date.trim()];
    } else {
      return res.status(400).json({
        status: "error",
        message: "Please provide date or dates in query params",
      });
    }

    const selectFields =
      "rentId phoneNumber createdAt updatedAt propertyMode propertyType rentalAmount status helpRequests reportProperty";

    const results = {};

    for (const dateStr of dates) {
      const { start, end } = getDateRangeForDay(dateStr);

      // Fetch records with activity on the given date
      const dayData = await AddModel.find({
        $or: [
          { createdAt: { $gte: start, $lte: end } },
          { updatedAt: { $gte: start, $lte: end } },
          { "helpRequests.requestedAt": { $gte: start, $lte: end } },
          { "reportProperty.date": { $gte: start, $lte: end } },
        ],
      })
        .select(selectFields)
        .lean();

      const summary = {
        total: dayData.length,
        statusCounts: {
          incomplete: dayData.filter((d) => d.status === "incomplete").length,
          complete: dayData.filter((d) => d.status === "complete").length,
          active: dayData.filter((d) => d.status === "active").length,
          delete: dayData.filter((d) => d.status === "delete").length,
        },
        helpRequestsCount: dayData.reduce(
          (sum, d) =>
            sum +
            (d.helpRequests || []).filter(
              (h) => h.requestedAt >= start && h.requestedAt <= end
            ).length,
          0
        ),
        reportPropertyCount: dayData.reduce(
          (sum, d) =>
            sum +
            (d.reportProperty || []).filter(
              (r) => r.date >= start && r.date <= end
            ).length,
          0
        ),
        properties: dayData.map((d) => ({
          rentId: d.rentId,
          phoneNumber: d.phoneNumber,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
          propertyMode: d.propertyMode,
          propertyType: d.propertyType,
          price: d.rentalAmount,
          status: d.status,
          helpRequests: (d.helpRequests || [])
            .filter((h) => h.requestedAt >= start && h.requestedAt <= end)
            .map((h) => ({
                    rentId: d.rentId,

              phoneNumber: h.phoneNumber,
              selectHelpReason: h.selectHelpReason,
              comment: h.comment,
              requestedAt: h.requestedAt,
              _id: h._id,
            })),
          reportProperty: (d.reportProperty || [])
            .filter((r) => r.date >= start && r.date <= end)
            .map((r) => ({
                    rentId: d.rentId,
              phoneNumber: r.phoneNumber,
              reason: r.reason,
              selectReasons: r.selectReasons,
              date: r.date,
              _id: r._id,
            })),
        })),
      };

      results[formatDateKey(start)] = summary;
    }

    res.json({
      status: "success",
      data: results,
    });
  } catch (error) {
    console.error("Error fetching rent stats:", error);
    res.status(500).json({
      status: "error",
      message: "Server error fetching rent stats",
    });
  }
});




// router.delete("/permanent-deletes/:phoneNumber", async (req, res) => {
//   try {
//     const { phoneNumber } = req.params;

//     // Normalize phone number (optional)
//     const formattedNumber = phoneNumber.startsWith("+91")
//       ? phoneNumber
//       : `+91${phoneNumber}`;

//     // Delete from all collections
//     const deletedResults = await Promise.all([
//       AddModel.deleteMany({ phoneNumber: formattedNumber }),
//       AddModel.deleteMany({ phoneNumber: formattedNumber }),
//       AddModel.deleteMany({ phoneNumber: formattedNumber }),
//       PhotoRequest.deleteMany({ phoneNumber: formattedNumber }),
//       UserLogin.deleteMany({ phoneNumber: formattedNumber }),
//         Offer.deleteMany({ phoneNumber: formattedNumber }),
//       PricingPlans.deleteMany({ phoneNumber: formattedNumber }),
//     ]);

//     res.status(200).json({
//       message: `Phone number ${formattedNumber} permanently deleted from all records.`,
//       deletedCounts: {
//         interest: deletedResults[0].deletedCount,
//         contact: deletedResults[1].deletedCount,
//         login: deletedResults[2].deletedCount,
//         photoRequest: deletedResults[3].deletedCount,
//         users: deletedResults[4].deletedCount,
//                 Offer: deletedResults[5].deletedCount,
//         PricingPlans: deletedResults[6].deletedCount,


//       },
//     });
//   } catch (error) {
//     console.error("❌ Error deleting phone number:", error);
//     res.status(500).json({
//       message: "Internal Server Error while deleting phone number",
//       error: error.message,
//     });
//   }
// });







router.get("/payments/summary-data", async (req, res) => {
  try {
    let startDate, endDate;

    // --- Handle date range query ---
    if (req.query.dates) {
      const parts = req.query.dates.split(",");
      if (parts.length !== 2) {
        return res.status(400).json({
          success: false,
          message: "Invalid format. Use ?dates=YYYY-MM-DD,YYYY-MM-DD"
        });
      }
      startDate = moment(parts[0], "YYYY-MM-DD").startOf("day").toDate();
      endDate = moment(parts[1], "YYYY-MM-DD").endOf("day").toDate();
    }
    // --- Handle single day query ---
    else if (req.query.day) {
      if (req.query.day === "today") {
        startDate = moment().startOf("day").toDate();
        endDate = moment().endOf("day").toDate();
      } else if (req.query.day === "yesterday") {
        startDate = moment().subtract(1, "day").startOf("day").toDate();
        endDate = moment().subtract(1, "day").endOf("day").toDate();
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid day. Use 'today', 'yesterday', or dates param."
        });
      }
    }
    // --- Default: all data ---
    else {
      startDate = null;
      endDate = null;
    }

    const dateFilter = startDate && endDate
      ? { createdAt: { $gte: startDate, $lte: endDate } }
      : {};

    const statuses = ["pay now", "pay later", "paid", "pay failed"];
    const summary = {};

    for (const status of statuses) {
      const payments = await PaymentPayU.find({
        payustatususer: status,
        ...dateFilter
      }).sort({ createdAt: -1 });

      summary[status] = {
        count: payments.length,
        data: payments
      };
    }

    res.status(200).json({
      success: true,
      dateRange: startDate && endDate ? { startDate, endDate } : "all",
      total: statuses.reduce((sum, s) => sum + summary[s].count, 0),
      summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching payment summary.",
      error: error.message
    });
  }
});





// ───────────────────────────────────────────────────────────────────────────
// Bulk upload rent properties from an Excel sheet (admin tool).  [ADDITIVE]
//
// The admin app parses the chosen .xlsx client-side (column headers match the
// rent AddProperty form field names), shows a preview, then POSTs the parsed
// rows here as JSON. Every row is inserted as an APPROVED (active) property:
//   - status: 'active'  → it appears immediately in "Approved".
//   - base:   'PY' | 'CH' from the upload checkbox (checked = Pondicherry/PY,
//             unchecked = Chennai/CH). insertMany() does NOT run the pre('save')
//             status guard, so 'active' / base are stored exactly as given.
// These three routes add nothing to existing routes/models behaviour.
// ───────────────────────────────────────────────────────────────────────────
router.post('/bulk-upload-properties', async (req, res) => {
  try {
    const { rows, base, addedBy, addedByRole } = req.body || {};

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: 'No rows received to upload.' });
    }
    if (rows.length > 5000) {
      return res.status(400).json({ message: 'Too many rows in one upload (max 5000).' });
    }

    // Checkbox: 'CH' only when explicitly Chennai; otherwise Pondicherry.
    const targetBase = String(base).trim().toUpperCase() === 'CH' ? 'CH' : 'PY';

    // Whitelist of editable fields (mirrors the rent AddProperty form / AddModel
    // schema). Anything else in the sheet (heading, sourcePage, …) is ignored.
    const STRING_FIELDS = [
      'propertyMode', 'propertyType', 'rentType', 'propertyAge', 'bankLoan',
      'negotiation', 'ownership', 'bedrooms', 'kitchen', 'kitchenType',
      'balconies', 'floorNo', 'areaUnit', 'propertyApproved', 'postedBy',
      'facing', 'salesMode', 'salesType', 'description', 'furnished', 'lift',
      'attachedBathrooms', 'western', 'numberOfFloors', 'carParking',
      'wheelChairAvailable', 'rentalPropertyAddress', 'country', 'city', 'state',
      'district', 'area', 'streetName', 'doorNumber', 'nagar',
      'locationCoordinates', 'ownerName', 'email', 'bestTimeToCall',
      'availableDate', 'familyMembers', 'foodHabit', 'jobType', 'petAllowed',
    ];
    const NUMBER_FIELDS = ['length', 'breadth', 'totalArea', 'pinCode', 'rentalAmount', 'securityDeposit'];

    const cleanPhone = (v) => String(v == null ? '' : v).replace(/[^\d+]/g, '');
    const val = (row, ...keys) => {
      for (const k of keys) {
        if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
          return row[k];
        }
      }
      return undefined;
    };
    const truthy = (v) => ['true', '1', 'yes', 'y'].includes(String(v).trim().toLowerCase());

    // Mandatory fields decide where each row lands. This list and the presence
    // rule are IDENTICAL to the `requiredFields` gate that BOTH admin pages use
    // (/properties/pre-approved-all-rent and /properties/pending-rent), so a
    // bulk row can never fall between them and become invisible:
    //   all present -> status 'complete'   -> PreApproved (status complete + required==='yes')
    //   any missing -> status 'incomplete' -> Pending     (status incomplete + required==='no')
    // NOTE: rentalAmount has a schema default of 0, so the pages always count it
    // as present; we mirror that below (set it to 0 when unset) to stay in sync.
    const MANDATORY_FIELDS = [
      'phoneNumber', 'propertyMode', 'propertyType', 'postedBy', 'rentType',
      'rentalAmount', 'floorNo', 'bedrooms', 'state', 'city', 'area',
      'totalArea', 'areaUnit', 'availableDate',
    ];
    const hasAllMandatory = (doc) =>
      MANDATORY_FIELDS.every((f) => {
        const v = doc[f];
        return v !== undefined && v !== null && String(v).trim() !== '';
      });

    // Reserve a contiguous block of Rent-IDs. Use the raw collection so the
    // max-id lookup is never affected by the city-scope plugin.
    const latestArr = await AddModel.collection
      .find({ rentId: { $ne: null } }).sort({ rentId: -1 }).limit(1).toArray();
    let nextRentId = (latestArr.length && latestArr[0].rentId) ? latestArr[0].rentId + 1 : 1001;

    const now = new Date();
    // One shared batch id for this upload so the whole batch can be reverted.
    const bulkUploadId = `BULK-${now.getTime()}-${Math.floor(Math.random() * 1e6)}`;
    const docs = [];

    for (const row of rows) {
      const doc = {
        rentId: nextRentId++,
        base: targetBase,
        createdBy: 'Admin',
        addedBy: addedBy || 'Admin',
        addedByRole: addedByRole || '',
        bulkUploadId,
        bulkUploadAt: now,
        bulkUploadBy: addedBy || 'Admin',
        countryCode: cleanPhone(val(row, 'phoneNumberCountryCode', 'countryCode')) || '+91',
        alternateCountryCode:
          cleanPhone(val(row, 'alternatePhoneCountryCode', 'alternateCountryCode')) || '+91',
      };

      for (const f of STRING_FIELDS) {
        const v = val(row, f);
        if (v !== undefined) doc[f] = String(v).trim();
      }
      for (const f of NUMBER_FIELDS) {
        const v = val(row, f);
        if (v !== undefined) {
          const n = Number(String(v).replace(/[^\d.]/g, ''));
          if (!Number.isNaN(n)) doc[f] = n;
        }
      }

      const phone = cleanPhone(val(row, 'phoneNumber'));
      if (phone) doc.phoneNumber = phone;
      const alt = cleanPhone(val(row, 'alternatePhone'));
      if (alt) doc.alternatePhone = alt;

      const cfr = val(row, 'callForRent');
      if (cfr !== undefined) doc.callForRent = truthy(cfr);

      // Mirror the schema default (rentalAmount: 0) so this completeness check
      // matches what the PreApproved/Pending pages compute on the stored doc.
      if (doc.rentalAmount == null) doc.rentalAmount = 0;

      // Complete rows wait in PreApproved; incomplete rows drop to Pending.
      doc.status = hasAllMandatory(doc) ? 'complete' : 'incomplete';

      docs.push(doc);
    }

    const preApprovedCount = docs.filter((d) => d.status === 'complete').length;
    const pendingCount = docs.length - preApprovedCount;

    // insertMany bypasses the pre('save') guard, so status/base are stored as-is.
    const inserted = await AddModel.insertMany(docs, { ordered: true });

    return res.status(201).json({
      message: `${inserted.length} properties uploaded — ${preApprovedCount} to PreApproved, ${pendingCount} to Pending.`,
      insertedCount: inserted.length,
      preApprovedCount,
      pendingCount,
      base: targetBase,
      bulkUploadId,
      bulkUploadAt: now,
      fromRentId: inserted.length ? inserted[0].rentId : null,
      toRentId: inserted.length ? inserted[inserted.length - 1].rentId : null,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Bulk upload failed.', error: error.message });
  }
});


// All bulk-upload batches (newest first) so the page can revert ANY previous
// batch, not just the most recent one. Uses the raw collection so the list is
// global (never narrowed by the city-scope plugin).
router.get('/bulk-upload-batches', async (req, res) => {
  try {
    const batches = await AddModel.collection.aggregate([
      { $match: { bulkUploadId: { $ne: null } } },
      { $group: {
          _id: '$bulkUploadId',
          count: { $sum: 1 },
          bulkUploadAt: { $max: '$bulkUploadAt' },
          bulkUploadBy: { $first: '$bulkUploadBy' },
          base: { $first: '$base' },
      } },
      { $sort: { bulkUploadAt: -1 } },
      { $limit: 100 },
    ]).toArray();

    return res.status(200).json({
      batches: batches.map((b) => ({
        bulkUploadId: b._id,
        count: b.count,
        bulkUploadAt: b.bulkUploadAt,
        bulkUploadBy: b.bulkUploadBy,
        base: b.base,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load bulk upload batches.', error: error.message });
  }
});


// Most recent bulk-upload batch (so the page can show "revert last upload" even
// after a refresh). findOne is NOT city-scoped; the count uses the raw
// collection so it is correct regardless of admin scope.
router.get('/bulk-upload-last', async (req, res) => {
  try {
    const last = await AddModel.findOne({ bulkUploadId: { $ne: null } })
      .sort({ bulkUploadAt: -1 });
    if (!last || !last.bulkUploadId) {
      return res.status(200).json({ batch: null });
    }
    const count = await AddModel.collection.countDocuments({ bulkUploadId: last.bulkUploadId });
    return res.status(200).json({
      batch: {
        bulkUploadId: last.bulkUploadId,
        bulkUploadAt: last.bulkUploadAt,
        bulkUploadBy: last.bulkUploadBy,
        base: last.base,
        count,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load last upload.', error: error.message });
  }
});


// Revert (permanently delete) a bulk-upload batch. Pass bulkUploadId to revert
// that exact batch, or { last: true } for the most recent one. Deletion is
// scoped strictly to the batch's bulkUploadId, so nothing else is ever touched.
router.post('/bulk-upload-revert', async (req, res) => {
  try {
    let { bulkUploadId, last } = req.body || {};

    if (!bulkUploadId && last) {
      const lastDoc = await AddModel.findOne({ bulkUploadId: { $ne: null } })
        .sort({ bulkUploadAt: -1 });
      bulkUploadId = lastDoc && lastDoc.bulkUploadId;
    }

    if (!bulkUploadId) {
      return res.status(400).json({ message: 'No bulk upload batch to revert.' });
    }

    const result = await AddModel.deleteMany({ bulkUploadId });

    return res.status(200).json({
      message: `Reverted ${result.deletedCount} uploaded propert${result.deletedCount === 1 ? 'y' : 'ies'}.`,
      deletedCount: result.deletedCount,
      bulkUploadId,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Revert failed.', error: error.message });
  }
});


module.exports = router;
















