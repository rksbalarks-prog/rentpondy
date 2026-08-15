const express = require('express');
const AddModel = require('../AddModel');
const NotificationUser = require('../Notification/NotificationDetailModel');
const router = express.Router();
const UserModel = require('../user/UserModel');
const UserViews =require('../ViewsModel')
const PhotoRequest = require('../Photo/PhotoRequestModel')

const ContactLog = require('../ContactLog'); // import this


// router.post('/contact-send-rent-property', async (req, res) => {
//   try {
//     const { phoneNumber, rentId } = req.body;

//     if (!phoneNumber || !rentId) {
//       return res.status(400).json({ success: false, message: 'Phone number and Rent ID required' });
//     }

//     const cleanedPhone = getLast10Digits(phoneNumber);
//     const today = new Date();

//     const property = await AddModel.findOne({ rentId }); // 🔄 Changed from AddModel to RentModel

//     if (!property) {
//       return res.status(404).json({ success: false, message: 'Rental property not found' });
//     }

//     property.views = (property.views || 0) + 1;
//     property.updatedAt = today;
//     await property.save();

//     // ✅ Save to ContactLog
//     await ContactLog.create({
//       rentId, // 🔄 Changed from ppcId
//       userPhone: cleanedPhone,
//       postedUserPhone: property.phoneNumber,
//       contactedAt: today,
//     });

//     // ✅ Send notification
//     try {
//       await NotificationUser.create({
//         recipientPhoneNumber: property.phoneNumber,
//         senderPhoneNumber: cleanedPhone,
//         rentId, // 🔄 Changed from ppcId
//         message: `User ${cleanedPhone} requested contact for your rental property.`,
//         createdAt: today,
//       });
//     } catch (notifErr) {
//       console.error("Notification error:", notifErr);
//     }

//     // ✅ Return response
//     return res.status(200).json({
//       success: true,
//       message: "Contact Send",
//       status: "contact send",
//       views: property.views,
//       updatedAt: property.updatedAt,
//       postedUserPhoneNumber: property.phoneNumber,
//       assignedPhoneNumber: property.assignedPhoneNumber || null,
//       setRentId: Boolean(property.assignedPhoneNumber),
//       rentalAmount: property.rentalAmount || null, // 🔄 Included if needed
//     });

//   } catch (error) {
//     console.error("Contact API error:", error);
//     return res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// });



router.post('/contact-send-property', async (req, res) => {
  try {
    const { userPhone, postedUserPhone, rentId } = req.body;

    if (!userPhone || !postedUserPhone || !rentId) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    // Save contact log
    const newContact = new ContactLog({
      userPhone,
      postedUserPhone,
      rentId,
      status: 'contactSend', // default status
    });

    await newContact.save();

    // Find property to validate ppcId
    const property = await AddModel.findOne({ rentId });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const today = new Date();

    // Create notification
    //
    // This route fires when an OWNER presses "Call" on an interested buyer —
    // the client opens the dialer immediately afterwards. So the person being
    // notified is the buyer, and what they need told is that they were called.
    // The old wording ("Your contact has been sent to the property owner.")
    // described the wrong event and never mentioned the call at all.
    //
    // Every press notifies: a second call on the same day is a real, separate
    // event, and unlike property views the volume here is low.
    await NotificationUser.create({
      recipientPhoneNumber: userPhone,          // the buyer who was called
      senderPhoneNumber: postedUserPhone,       // the owner who called
      userPhoneNumber: userPhone,
      rentId,
      type: 'owner-called-user',
      message: `The owner of property ${rentId} called you.`,
      createdAt: today,
    });


    res.status(200).json({
      success: true,
      message: 'Contact log and notification saved',
      data: newContact,
    });
  } catch (error) {
    console.error('Contact-send-property API error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



const normalizePhoneNumber = (number) => {
  if (!number) return "";
  number = number.replace(/\D/g, ""); // Remove non-digits
  if (number.length === 10) return "+91" + number;
  if (number.length === 12 && number.startsWith("91")) return "+" + number;
  if (number.length === 13 && number.startsWith("+91")) return number;
  return number; // fallback
};




  router.get('/total-contact-count-rent', async (req, res) => {
    try {
      // Aggregate total contact requests for all properties using contactRequests field
      const contactCount = await AddModel.aggregate([
        { $unwind: "$contactRequests" },
        { $group: { _id: null, totalContactRequests: { $sum: 1 } } }
      ]);
  
      // Aggregate total contact-send requests (assuming similar field)
      const contactSendCount = await AddModel.aggregate([
        { $match: { contactRequests: { $ne: [] } } }, // Filter properties with contact requests
        { $project: { contactRequests: 1 } },
        { $unwind: "$contactRequests" },
        { $group: { _id: null, totalContactSendRequests: { $sum: 1 } } }
      ]);
  
      // Get total counts from the result
      const totalContactRequests = contactCount[0]?.totalContactRequests || 0;
      const totalContactSendRequests = contactSendCount[0]?.totalContactSendRequests || 0;
  
      // Calculate total contact count
      const totalContactCount = totalContactRequests + totalContactSendRequests;
  
      res.status(200).json({
        success: true,
        totalContactRequests,
        totalContactSendRequests,
        totalContactCount,
      });
  
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  });
  







router.get("/total-interest-count-rent", async (req, res) => {
  try {
    const properties = await AddModel.find({});
    const totalInterestCount = properties.reduce((total, property) => {
      return total + property.interestRequests.length;
    }, 0);

    return res.status(200).json({
      message: "Total interest count fetched successfully",
      totalInterestCount
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
});

router.get("/get-user-notifications", async (req, res) => {
  let { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  phoneNumber = phoneNumber.replace(/\D/g, "");
  const variants = [
    "+91" + phoneNumber.slice(-10),
    "91" + phoneNumber.slice(-10),
    phoneNumber.slice(-10)
  ];

  try {
    const notifications = await NotificationUser.find({
      recipientPhoneNumber: { $in: variants }
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Notifications fetched successfully",
      notifications
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/get-unread-notifications", async (req, res) => {
  let { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  phoneNumber = phoneNumber.replace(/\D/g, "");
  const variants = [
    "+91" + phoneNumber.slice(-10),
    "91" + phoneNumber.slice(-10),
    phoneNumber.slice(-10)
  ];

  try {
    const notifications = await NotificationUser.find({
      recipientPhoneNumber: { $in: variants },
      isRead: false
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Unread notifications fetched successfully",
      notifications
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/get-read-notifications", async (req, res) => {
  let { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  phoneNumber = phoneNumber.replace(/\D/g, "");
  const variants = [
    "+91" + phoneNumber.slice(-10),
    "91" + phoneNumber.slice(-10),
    phoneNumber.slice(-10)
  ];

  try {
    const notifications = await NotificationUser.find({
      recipientPhoneNumber: { $in: variants },
      isRead: true
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Read notifications fetched successfully",
      notifications
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/get-all-notifications-rent", async (req, res) => {
  try {
    const notifications = await NotificationUser.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      message: "All notifications fetched successfully",
      notifications
    });
  } catch (error) {
    return res.status(500).json();
  }
});

router.get("/get-all-notifications-read", async (req, res) => {
  const { isRead } = req.query;
  const query = isRead !== undefined ? { isRead: isRead === 'true' } : {};

  try {
    const notifications = await NotificationUser.find(query).sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Notifications fetched successfully",
      notifications
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.put("/mark-notifications-read", async (req, res) => {
  let { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  phoneNumber = phoneNumber.replace(/\D/g, "");
  const variants = [
    "+91" + phoneNumber.slice(-10),
    "91" + phoneNumber.slice(-10),
    phoneNumber.slice(-10),
  ];

  try {
    const result = await NotificationUser.updateMany(
      {
        recipientPhoneNumber: { $in: variants },
        isRead: false,
      },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      message: "Notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.put('/mark-single-notification-read/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await NotificationUser.findByIdAndUpdate(id, { isRead: true });
    res.status(200).json({ message: "Notification marked as read." });
  } catch (err) {
    res.status(500).json({ message: "Error marking notification as read." });
  }
});

// DELETE /delete-notification/:id
router.delete('/delete-notification/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotification = await NotificationUser.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json({ message: "Notification deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification.", error: error.message });
  }
});

// DELETE /delete-notification-by-time
router.delete('/delete-notification-by-time', async (req, res) => {
  try {
    const { createdAt } = req.body;

    if (!createdAt) {
      return res.status(400).json({ message: "createdAt timestamp is required." });
    }

    const deletedNotification = await NotificationUser.findOneAndDelete({ createdAt: new Date(createdAt) });

    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found with the given timestamp." });
    }

    res.status(200).json({ message: "Notification deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification.", error: error.message });
  }
});

// GET /notification-unread-count
router.get("/notification-unread-count", async (req, res) => {
  let { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  phoneNumber = phoneNumber.replace(/\D/g, "");
  const variants = [
    "+91" + phoneNumber.slice(-10),
    "91" + phoneNumber.slice(-10),
    phoneNumber.slice(-10)
  ];

  try {
    const unreadNotifications = await NotificationUser.find({
      recipientPhoneNumber: { $in: variants },
      isRead: false,
    });

    // Deduplicate by rentId + message
    const uniqueMap = new Map();
    unreadNotifications.forEach((n) => {
      const key = `${n.rentId}_${n.message}`;
      if (!uniqueMap.has(key)) uniqueMap.set(key, n);
    });

    return res.status(200).json({
      message: "Unique unread notification count fetched successfully",
      count: uniqueMap.size,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// GET /get-interest-owner
router.get('/get-interest-owner-rent', async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required.' });
    }

    const propertiesWithInterestRequests = await AddModel.find({
      'interestRequests.phoneNumber': phoneNumber
    });

    if (propertiesWithInterestRequests.length === 0) {
      return res.status(404).json({ message: 'No properties found for this phone number.' });
    }

    const interestRequestsData = propertiesWithInterestRequests.map(property => ({
      rentId: property.rentId,
      postedUserPhoneNumber: property.phoneNumber,
      interestedUserPhoneNumbers: property.interestRequests?.map(req => req.phoneNumber) || [],
      views: property.views || 0,
      propertyMode: property.propertyMode,
      propertyType: property.propertyType,
      area: property.area,
      city: property.city,
       floorNo: property.floorNo,
                 bedrooms: property.bedrooms,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      rentalAmount: property.rentalAmount,
      status: property.status,
      totalArea: property.totalArea,
      areaUnit: property.areaUnit,
      photos: property.photos || []
    }));

    return res.status(200).json({
      message: 'Interest requests fetched successfully',
      interestRequestsData
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// GET /get-interest-buyers
router.get("/get-interest-buyers-rent", async (req, res) => {
  try {
    let { postedPhoneNumber } = req.query;

    if (!postedPhoneNumber) {
      return res.status(400).json({ message: "Posted user phone number is required." });
    }

    postedPhoneNumber = postedPhoneNumber.replace(/\D/g, "");
    if (postedPhoneNumber.startsWith("91") && postedPhoneNumber.length === 12) {
      postedPhoneNumber = postedPhoneNumber.slice(2);
    }

    const propertiesByOwner = await AddModel.find({
      $or: [
        { phoneNumber: postedPhoneNumber },
        { phoneNumber: `+91${postedPhoneNumber}` },
        { phoneNumber: `91${postedPhoneNumber}` }
      ]
    });

    if (!propertiesByOwner.length) {
      return res.status(404).json({ message: "No properties found for this owner." });
    }

    const propertiesWithInterest = propertiesByOwner
      .filter(property => property.interestRequests?.length > 0)
      .map(property => ({
        rentId: property.rentId,
        _id: property._id,
        status: property.status,
        views: property.views || 0,
        propertyMode: property.propertyMode,
        propertyType: property.propertyType,
        area: property.area,
                state: property.state,

        city: property.city,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
        rentalAmount: property.rentalAmount,
        photos: property.photos || [],
        postedUserPhoneNumber: property.phoneNumber,
        propertyDetails: property.propertyDetails || {},
        interestedUsers: property.interestRequests.map(req => req.phoneNumber),
      }));

    if (!propertiesWithInterest.length) {
      return res.status(404).json({ message: "No interested buyers found for this owner." });
    }

    return res.status(200).json({
      message: "Properties with interested buyers",
      propertiesData: propertiesWithInterest
    });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


router.get('/get-all-owners-and-buyers', async (req, res) => {
  try {
    const allProperties = await AddModel.find({});

    if (allProperties.length === 0) {
      return res.status(404).json({ message: 'No properties found.' });
    }

    const owners = allProperties.map(property => ({
      rentId: property.rentId,
      status: property.status,
      photos: property.photos || [],
      ownerPhoneNumber: property.phoneNumber,
      views: property.views || 0,
      propertyMode: property.propertyMode,
      propertyType: property.propertyType,
      area: property.area,
      city: property.city,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      rentalAmount: property.rentalAmount,
      propertyDetails: property.propertyDetails
    }));

    const buyers = [];

    allProperties.forEach(property => {
      if (property.interestRequests && property.interestRequests.length > 0) {
        property.interestRequests.forEach(request => {
          buyers.push({
            interestedUserPhoneNumber: request.phoneNumber,
            interestedInRentId: property.rentId,
            interestedInOwnerPhoneNumber: property.phoneNumber,
            views: property.views || 0,
            propertyMode: property.propertyMode,
            propertyType: property.propertyType,
            area: property.area,
            city: property.city,
            createdAt: property.createdAt,
            updatedAt: property.updatedAt,
            rentalAmount: property.rentalAmount,
            status: property.status,
            photos: property.photos || []
          });
        });
      }
    });

    return res.status(200).json({ message: 'Owners and Buyers fetched successfully', owners, buyers });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


router.get('/property-reports-count-rent', async (req, res) => {
    try {
      // Get login mode filter from query params (default to 'web' if not provided)
      const { loginMode = 'web' } = req.query;
  
      // Count the total number of properties that have at least one report and filter by loginMode
      const reportCount = await AddModel.aggregate([
        {
          $match: { 'reportProperty.0': { $exists: true } }  // Match properties with at least one report
        },
        {
          $lookup: {
            from: 'userlogins',  // Assuming your collection for user login info is named 'userlogins'
            localField: 'reportProperty.phoneNumber',  // Field from 'AddModel' that refers to the phone number of the reporter
            foreignField: 'phone',  // Field from 'UserLogin' that refers to the phone number
            as: 'reporterDetails'  // Alias for the result of the join
          }
        },
        {
          $unwind: '$reporterDetails'  // Unwind the result to join the documents
        },
        {
          $match: {
            'reporterDetails.loginMode': { $regex: new RegExp(`^${loginMode}$`, 'i') }  // Match by loginMode (either 'web' or 'app')
          }
        },
        {
          $count: 'totalReportedProperties'  // Count the total number of reported properties
        }
      ]);
  
      const totalReportedProperties = reportCount.length > 0 ? reportCount[0].totalReportedProperties : 0;
  
      return res.status(200).json({
        message: 'Total report counts fetched successfully',
        totalReportedProperties
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server Error',
        error: error.message
      });
    }
  });


router.post('/contact-send', async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    // Find the rental property where the owner has the given phone number
    const property = await RentModel.findOne({ phoneNumber }); // 🔁 Changed from AddModel to RentModel

    if (!property) {
      return res.status(404).json({ success: false, message: 'Rental property not found for this phone number' });
    }

    const postedUserPhoneNumber = property.phoneNumber;
    const {
      propertyMode,
      propertyType,
      rentalAmount,
      area,
      email,
      rentId,
      photos = [],
      status,
    } = property;

    // Update the rental property with a new contact request
    const updatedProperty = await RentModel.findOneAndUpdate(
      { phoneNumber },
      {
        $push: { contactRequests: { phoneNumber, createdAt: new Date() } },
        $set: { status: 'contact', updatedAt: new Date() },
        $inc: { views: 1 }
      },
      { new: true }
    );

    // Save a notification to the owner
    try {
      await NotificationUser.create({
        recipientPhoneNumber: postedUserPhoneNumber,
        senderPhoneNumber: phoneNumber,
        rentId, // 🔁 Replaced ppcId with rentId
        message: `User ${phoneNumber} requested contact for your rental property.`,
        createdAt: new Date()
      });
    } catch (notifErr) {
      console.error("Notification error:", notifErr);
    }

    return res.status(200).json({
      success: true,
      message: 'Contact request sent!',
      postedUserPhoneNumber,
      email,
      propertyMode,
      propertyType,
      rentalAmount,
      area,
      status: updatedProperty.status,
      photos,
      views: updatedProperty.views,
      contactRequests: updatedProperty.contactRequests,
      createdAt: new Date(),
      updatedAt: new Date()
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});



router.get('/get-all-contact-sent-properties', async (req, res) => {
  try {
    // 1. Get all contact logs
    const logs = await ContactLog.find().sort({ contactedAt: -1 });

    if (!logs.length) {
      return res.status(200).json({ success: true, message: 'No contact logs found', properties: [] });
    }

    // 2. Get all unique Rent IDs
    const rentIds = [...new Set(logs.map(log => log.rentId))];

    // 3. Fetch matching properties from AddModel
    const properties = await AddModel.find({ rentId: { $in: rentIds } });

    // 4. Merge log and property info
    const merged = logs.map(log => {
      const matched = properties.find(p => p.rentId === log.rentId);
      return {
        rentId: log.rentId,
        contactedAt: log.contactedAt,
        userPhone: log.userPhone,
        postedUserPhone: log.postedUserPhone,
        property: matched || null,
      };
    });

    return res.status(200).json({
      success: true,
      message: 'All contact-sent properties fetched',
      count: merged.length,
      properties: merged,
    });

  } catch (err) {
    console.error('Error fetching all contact-sent properties:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});


router.get('/get-all-favorite-requests', async (req, res) => {
  try {
    // Fetch all properties where favorite requests exist
    const propertiesWithFavorites = await AddModel.find({
      favoriteRequests: { $exists: true, $ne: [] }
    });

    // If no favorite properties are found
    if (propertiesWithFavorites.length === 0) {
      return res.status(404).json({ message: 'No favorite properties found.' });
    }

    // 🔹 Owner-side view
    const favoriteRequestsData = propertiesWithFavorites.map(property => ({
      rentId: property.rentId,
      postedUserPhoneNumber: property.phoneNumber,
      favoritedUserPhoneNumbers: property.favoriteRequests.map(fav => fav.phoneNumber),
      propertyMode: property.propertyMode,
      propertyType: property.propertyType,
      rentalAmount: property.rentalAmount, // ✅ replaced price
      postedBy: property.postedBy,
      totalArea: property.totalArea,
      bedrooms: property.bedrooms,
      areaUnit: property.areaUnit,
      area: property.area,
      views: property.views || 0,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      status: property.status,
      photos: property.photos || [],
    }));

    // 🔹 Buyer-side view
    const propertiesData = propertiesWithFavorites.map(property => ({
      rentId: property.rentId,
      postedUserPhoneNumber: property.phoneNumber,
      propertyDetails: property.propertyDetails || 'No details available',
      favoritedUsers: property.favoriteRequests.map(fav => fav.phoneNumber),
      views: property.views || 0,
      postedBy: property.postedBy,
      totalArea: property.totalArea,
      bedrooms: property.bedrooms,
      areaUnit: property.areaUnit,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      status: property.status,
      photos: property.photos || [],
    }));

    return res.status(200).json({
      message: 'Favorite request data fetched successfully',
      favoriteRequestsData,
      propertiesData
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
});


// ------------------------

















router.post("/send-interests-rent", async (req, res) => {
  const { phoneNumber, rentId } = req.body;

  try {
    const property = await AddModel.findOne({ rentId });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const isAlreadyInterested = property.interestRequests.some(
      (request) => request.phoneNumber === phoneNumber
    );

    if (isAlreadyInterested) {
      return res.status(400).json({
        message: "You have already shown interest in this property.",
        status: "alreadySaved",
        alreadySaved: property.interestRequests.map(req => req.phoneNumber),
      });
    }

    const updatedProperty = await AddModel.findOneAndUpdate(
      { rentId },
      {
        $push: { interestRequests: { phoneNumber, createdAt: new Date() } },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );

    try {
      await NotificationUser.create({
        recipientPhoneNumber: updatedProperty.phoneNumber,
        senderPhoneNumber: phoneNumber,
        rentId,
        message: `One interest has been recorded! Interest sent by user ${phoneNumber}.`,
        createdAt: new Date()
      });
    } catch (notifErr) {}

    return res.status(200).json({
      message: "Your interest has been recorded!",
      status: "sendInterest",
      postedUserPhoneNumber: updatedProperty.phoneNumber,
      ownerName: updatedProperty.ownerName,
      propertyMode: updatedProperty.propertyMode,
      propertyType: updatedProperty.propertyType,
      rentalAmount: updatedProperty.rentalAmount,
      area: updatedProperty.area,
      city: updatedProperty.city,
      createdAt: updatedProperty.createdAt,
      updatedAt: updatedProperty.updatedAt,
      alreadySaved: updatedProperty.interestRequests.map(req => req.phoneNumber),
      views: updatedProperty.views,
      photos: updatedProperty.photos || []
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
});


// 🔁 Remove interest from property
router.post("/remove-interest-rent", async (req, res) => {
  const { phoneNumber, rentId } = req.body;

  if (!phoneNumber || !rentId) {
    return res.status(400).json({ message: "phoneNumber and rentId are required." });
  }

  try {
    const updatedProperty = await AddModel.findOneAndUpdate(
      { rentId },
      {
        $pull: { interestRequests: { phoneNumber } },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found." });
    }

    return res.status(200).json({
      message: "Interest removed successfully.",
      status: "interestRemoved",
      rentId
    });
  } catch (error) {
    return res.status(500).json({ message: "Error removing interest", error: error.message });
  }
});



router.post("/add-favorite-rent", async (req, res) => {
  const { phoneNumber, rentId } = req.body;

  if (!phoneNumber || !rentId) {
    return res.status(400).json({ message: "Phone number and Property ID are required" });
  }

  try {
    const property = await AddModel.findOne({ rentId });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    await property.addFavoriteRequest(phoneNumber); // uses model method

    await NotificationUser.create({
      recipientPhoneNumber: property.phoneNumber,
      senderPhoneNumber: phoneNumber,
      rentId,
      message: `User ${phoneNumber} added your property to favorites.`,
      createdAt: new Date()
    });

    return res.status(200).json({
      message: "Property added to your favorites!",
      status: "favorite",
      postedUserPhoneNumber: property.phoneNumber,
      ownerName: property.ownerName,
      propertyMode: property.propertyMode,
      propertyType: property.propertyType,
      rentalAmount: property.rentalAmount,
      area: property.area,
      city: property.city,
      createdAt: property.createdAt,
      updatedAt: new Date(),
      photos: property.photos || [],
      views: property.views,
      favoriteRequests: property.favoriteRequests.map(fav => ({
        phoneNumber: fav.phoneNumber,
        favoritedAt: fav.date
      })),
      readStatus: "Unread"
    });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});



router.post("/remove-favorite-rent", async (req, res) => {
  const { phoneNumber, rentId } = req.body;

  if (!phoneNumber || !rentId) {
    return res.status(400).json({ message: "Phone number and Property ID are required" });
  }

  try {
    const property = await AddModel.findOne({ rentId });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    await property.removeFavoriteRequest(phoneNumber); // uses model method

    await NotificationUser.create({
      recipientPhoneNumber: property.phoneNumber,
      senderPhoneNumber: phoneNumber,
      rentId,
      message: `User ${phoneNumber} removed your property from favorites.`,
      createdAt: new Date()
    });

    return res.status(200).json({
      message: "Property removed from your favorites!",
      status: "favoriteRemoved",
      postedUserPhoneNumber: property.phoneNumber,
      ownerName: property.ownerName,
      propertyMode: property.propertyMode,
      propertyType: property.propertyType,
      rentalAmount: property.rentalAmount,
      area: property.area,
      city: property.city,
      createdAt: property.createdAt,
      updatedAt: new Date(),
      favoriteRequests: property.favoriteRequests.map(fav => fav.phoneNumber),
      favoriteRemoved: property.favoriteRemoved.map(fav => ({
        phoneNumber: fav.phoneNumber,
        removedAt: fav.removedAt
      }))
    });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.post('/report-sold-out-rent', async (req, res) => {
  const { phoneNumber, rentId } = req.body;

  if (!phoneNumber || !rentId) {
    return res.status(400).json({ message: 'Phone number and Rent ID are required' });
  }

  try {
    const property = await AddModel.findOne({ rentId });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const isAlreadyReported = property.soldOutReport.some(
      (report) => report.phoneNumber === phoneNumber
    );

    if (isAlreadyReported) {
      return res.status(400).json({
        message: "You have already marked this property as sold out.",
        status: "alreadyReported",
        reportedNumbers: property.soldOutReport.map(req => req.phoneNumber),
      });
    }

    // Add to soldOutReport and update status
    const updatedProperty = await AddModel.findOneAndUpdate(
      { rentId },
      {
        $push: { soldOutReport: { phoneNumber, date: new Date() } },
        $set: { status: 'active', updatedAt: new Date() }
      },
      { new: true }
    );

    // Notification to owner
    try {
      await NotificationUser.create({
        recipientPhoneNumber: updatedProperty.phoneNumber,
        senderPhoneNumber: phoneNumber,
        rentId,
        message: `User ${phoneNumber} reported your property as sold out.`,
        createdAt: new Date()
      });
    } catch (notifErr) {
      console.log("Notification failed:", notifErr.message);
    }

    return res.status(200).json({
      message: 'The property has been marked as sold out.',
      status: 'active',
      postedUserPhoneNumber: updatedProperty.phoneNumber,
      ownerName: updatedProperty.ownerName,
      propertyMode: updatedProperty.propertyMode,
      propertyType: updatedProperty.propertyType,
      rentalAmount: updatedProperty.rentalAmount,
      area: updatedProperty.area,
      city: updatedProperty.city,
      views: updatedProperty.views,
      createdAt: updatedProperty.createdAt,
      updatedAt: updatedProperty.updatedAt,
      photos: updatedProperty.photos || [],
      reportedNumbers: updatedProperty.soldOutReport.map(req => ({
        phoneNumber: req.phoneNumber,
        reportedAt: req.date
      }))
    });

  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


router.post('/need-help-rent', async (req, res) => {
  const { phoneNumber, rentId, selectHelpReason, comment } = req.body;

  const allowedHelpReasons = [
    'Help Me to Buy this Property', 'Book for Property Visit', 'Loan Help',
    'Property Valuation', 'Document Verification', 'Property Surveying',
    'EC', 'Patta Name Change', 'Registration Help', 'Others'
  ];

  if (!allowedHelpReasons.includes(selectHelpReason)) {
    return res.status(400).json({ message: `Invalid help reason.` });
  }

  try {
    const property = await AddModel.findOne({ rentId });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const isAlreadyHelped = property.helpRequests?.some(
      (r) => r.phoneNumber === phoneNumber && r.selectHelpReason === selectHelpReason
    );

    if (isAlreadyHelped) {
      return res.status(400).json({
        message: "Help already requested.",
        status: "alreadyRequested"
      });
    }

    const updatedProperty = await AddModel.findOneAndUpdate(
      { rentId },
      {
        $push: {
          helpRequests: {
            phoneNumber,
            selectHelpReason,
            comment,
            requestedAt: new Date()
          }
        },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );

    await NotificationUser.create({
      recipientPhoneNumber: updatedProperty.phoneNumber,
      senderPhoneNumber: phoneNumber,
      rentId,
      message: `User ${phoneNumber} requested help: "${selectHelpReason}"`,
      createdAt: new Date()
    });

    res.status(200).json({
      message: 'Help request recorded!',
      status: 'needHelp',
      postedUserPhoneNumber: updatedProperty.phoneNumber,
        property: updatedProperty

    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


router.post('/report-property-rent', async (req, res) => {
  const { phoneNumber, rentId, reason, selectReasons } = req.body;

  const allowedReasons = [
    'Already Sold', 'Wrong Information', 'Not Responding',
    'Fraud', 'Duplicate Ads', 'Other'
  ];

  if (!allowedReasons.includes(selectReasons)) {
    return res.status(400).json({ message: `Invalid report reason.` });
  }

  try {
    const property = await AddModel.findOne({ rentId });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const alreadyReported = property.reportProperty.some(
      (r) => r.phoneNumber === phoneNumber
    );

    if (alreadyReported) {
      return res.status(400).json({
        message: "Already reported.",
        status: "alreadyReported"
      });
    }

    const updatedProperty = await AddModel.findOneAndUpdate(
      { rentId },
      {
        $push: {
          reportProperty: {
            phoneNumber,
            reason,
            selectReasons,
            date: new Date()
          }
        },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );

    await NotificationUser.create({
      recipientPhoneNumber: updatedProperty.phoneNumber,
      senderPhoneNumber: phoneNumber,
      rentId,
      message: `User ${phoneNumber} reported your property.`,
      createdAt: new Date()
    });

   return res.status(200).json({
  message: "Report submitted.",
  status: "reportProperties",
  postedUserPhoneNumber: updatedProperty.phoneNumber,
  property: updatedProperty
});

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


function getLast10Digits(phone) {
  if (!phone) return null;
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.slice(-10);
}

function isToday(someDate) {
  const today = new Date();
  const date = new Date(someDate);
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}

const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

router.post("/contact-rent", async (req, res) => {
  try {
    const { phoneNumber, rentId } = req.body;

    if (!phoneNumber || !rentId) {
      return res.status(400).json({
        success: false,
        message: "Phone number and Rent ID are required.",
      });
    }

    const cleanedPhone = phoneNumber.replace(/\D/g, "").slice(-10);
    const today = new Date();

    // Get or create user
    let user = await UserViews.findOne({ phoneNumber: cleanedPhone });
    if (!user) {
      user = await UserViews.create({
        phoneNumber: cleanedPhone,
        contactLimitPerDay: 30,
        contactedProperties: [],
      });
    }

    const limit = user.contactLimitPerDay || 30;

    // Filter only today's contacts
    const todayContacts = (user.contactedProperties || []).filter((entry) =>
      isSameDay(new Date(entry.contactedAt), today)
    );

    // Check if already contacted this property
    const alreadyContactedToday = todayContacts.some((entry) => entry.rentId === rentId);

    // Enforce daily contact limit
    if (!alreadyContactedToday && todayContacts.length >= limit) {
      return res.status(429).json({
        success: false,
        message: `Contact limit reached. You can only contact ${limit} unique rental properties per day.`,
        contactLimitPerDay: limit,
        remainingContacts: 0,
      });
    }

    // Add new contact
    if (!alreadyContactedToday) {
      user.contactedProperties.push({ rentId, contactedAt: today });
      await user.save();
    }

    // Find the rental property (use RentModel)
    const property = await AddModel.findOne({ rentId });
    if (!property) {
      return res.status(404).json({ success: false, message: "Rental property not found." });
    }

    // Add to contactRequests
    if (!Array.isArray(property.contactRequests)) {
      property.contactRequests = [];
    }

    property.contactRequests.push({ phoneNumber: cleanedPhone, date: today });
    property.views = (property.views || 0) + 1;
    property.status = "active";
    property.updatedAt = today;

    await property.save();

    // Create notification
    await NotificationUser.create({
      recipientPhoneNumber: property.phoneNumber,
      senderPhoneNumber: cleanedPhone,
      rentId,
      message: `User ${cleanedPhone} requested contact for your rental property.`,
      createdAt: today,
    });

    const assignedPhoneNumber = property.assignedPhoneNumber || property.phoneNumber;
    const remainingContacts = limit - todayContacts.length - (alreadyContactedToday ? 0 : 1);

    return res.status(200).json({
      success: true,
      message: `Contact request sent! You have ${remainingContacts} / ${limit} remaining today.`,
      contactLimitPerDay: limit,
      remainingContacts,
      assignedPhoneNumber,
      postedUserPhoneNumber: property.phoneNumber,
      rentId: property.rentId,
      views: property.views,
      rentalAmount: property.rentalAmount || null,
      setRentId: Boolean(property.assignedPhoneNumber),
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      status: property.status,
        contactRequests: property.contactRequests, // ✅ Add this

    });

  } catch (error) {
    console.error("Contact API error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});



router.post('/contact-rents', async (req, res) => {
  try {
    const { phoneNumber, rentId } = req.body;

    if (!phoneNumber || !rentId) {
      return res.status(400).json({ success: false, message: 'Phone number and Rent ID required' });
    }

    const cleanedPhone = phoneNumber.replace(/\D/g, "").slice(-10);
    const today = new Date();

    // Step 1: Enforce daily contact limit per user
    let userView = await UserModel.findOne({ phoneNumber: cleanedPhone });

    if (userView) {
      if (!isToday(userView.lastViewDate)) {
        userView.dailyViewsCount = 0;
        userView.lastViewDate = today;
      }
      if (userView.dailyViewsCount >= 30) {
        return res.status(429).json({ success: false, message: "Daily contact limit reached" });
      }
      userView.dailyViewsCount += 1;
    } else {
      userView = new UserModel({
        phoneNumber: cleanedPhone,
        dailyViewsCount: 1,
        lastViewDate: today,
      });
    }

    await userView.save();

    // Step 2: Find property by rentId
    const property = await AddModel.findOne({ rentId });

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Step 3: Update property contactRequests, views, status, updatedAt
    property.contactRequests.push({
      phoneNumber: cleanedPhone,
      date: today,
    });

    property.views = (property.views || 0) + 1;
    property.status = 'contact';
    property.updatedAt = today;

    await property.save();

    // Step 4: Send notification to property owner
    try {
      await NotificationUser.create({
        recipientPhoneNumber: property.phoneNumber,
        senderPhoneNumber: cleanedPhone,
        rentId,
        message: `User ${cleanedPhone} requested contact for your rent property.`,
        createdAt: today,
      });
    } catch (notifErr) {
      console.error("Notification error:", notifErr.message);
    }

    // Step 5: Send full response
    const assignedPhoneNumber = property.assignedPhoneNumber || null;
    const postedUserPhoneNumber = property.phoneNumber;
    const setRentId = Boolean(assignedPhoneNumber);

    return res.status(200).json({
      success: true,
      message: "Contact request sent!",
      setRentId,
      assignedPhoneNumber,
      postedUserPhoneNumber,
      rentId: property.rentId,
      rentalAmount: property.rentalAmount,
      views: property.views,
        postedBy:property.postedBy,
          totalArea:property.totalArea,
          areaUnit:property.areaUnit,
                              bedrooms:property.bedrooms,
      contactRequests: property.contactRequests,
      ownerName: property.ownerName,
      area: property.area,
      city: property.city,
      status:property.status,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      photos: property.photos || [],
    });

  } catch (error) {
    console.error("Contact API error:", error.message);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

router.post('/delete-detail-property', async (req, res) => {
  const { rentId, phoneNumber } = req.body;

  try {
    // Find the property by its rentId
    const property = await AddModel.findOne({ rentId });

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Remove user's interest if it exists
    const userInterestIndex = property.interestRequests.findIndex(
      request => request.phoneNumber === phoneNumber
    );

    if (userInterestIndex !== -1) {
      property.interestRequests.splice(userInterestIndex, 1);
    }

    // Mark property as deleted
    property.status = 'delete';
    await property.save();

    res.status(200).json({ message: 'Property removed successfully.', property });
  } catch (error) {
    res.status(500).json({ message: 'Error removing property.', error });
  }
});

router.post('/undo-delete-detail', async (req, res) => {
  const { rentId, phoneNumber } = req.body;

  try {
    // Find the property by its rentId
    const property = await AddModel.findOne({ rentId });

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Restore previous status
    property.status = 'incomplete'; // Or 'complete' if applicable

    // Re-add interest if it doesn't exist
    if (!property.interestRequests.some(request => request.phoneNumber === phoneNumber)) {
      property.interestRequests.push({ phoneNumber, date: new Date() });
    }

    await property.save();

    res.status(200).json({ message: 'Property status reverted successfully!', property });
  } catch (error) {
    res.status(500).json({ message: 'Error undoing property status.', error });
  }
});


router.put("/interest/delete/:rentId/:phoneNumber", async (req, res) => {
  try {
    const { rentId, phoneNumber } = req.params;

    const property = await AddModel.findOne({ rentId });

    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    const interestIndex = property.interestRequests.findIndex(
      (req) => req.phoneNumber === phoneNumber
    );

    if (interestIndex === -1) {
      return res.status(404).json({ message: "Interest request not found." });
    }

    property.interestRequests.splice(interestIndex, 1);

    if (property.interestRequests.length === 0) {
      property.previousStatus = property.status;
      property.status = "delete";
    }

    await property.save();

    res.status(200).json({
      message: "Interest request removed successfully.",
      property,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting interest request.",
      error: error.message,
    });
  }
});


router.put("/interest/undo/:rentId/:phoneNumber", async (req, res) => {
  try {
    const { rentId, phoneNumber } = req.params;

    const property = await AddModel.findOne({ rentId });

    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    const alreadyExists = property.interestRequests.some(
      (req) => req.phoneNumber === phoneNumber
    );

    if (!alreadyExists) {
      property.interestRequests.push({ phoneNumber, date: new Date() });
    }

    if (property.previousStatus) {
      property.status = property.previousStatus;
      property.previousStatus = null;
    } else {
      property.status = "incomplete";
    }

    await property.save();

    res.status(200).json({
      message: "Interest request restored successfully!",
      property,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error restoring interest request.",
      error: error.message,
    });
  }
});



router.get("/get-favorite-buyer-rent", async (req, res) => {
    try {
        let { postedPhoneNumber } = req.query;

        if (!postedPhoneNumber) {
            return res.status(400).json({ message: "Posted user phone number is required." });
        }

        // Normalize phone number
        postedPhoneNumber = postedPhoneNumber.replace(/\D/g, "");
        if (postedPhoneNumber.startsWith("91") && postedPhoneNumber.length === 12) {
            postedPhoneNumber = postedPhoneNumber.slice(2);
        }

        // Fetch only properties listed by the owner and where favoriteRequests is not empty
        const propertiesWithFavoriteRequests = await AddModel.find({
            $and: [
                {
                    $or: [
                        { phoneNumber: postedPhoneNumber },
                        { phoneNumber: `+91${postedPhoneNumber}` },
                        { phoneNumber: `91${postedPhoneNumber}` }
                    ]
                },
                { favoriteRequests: { $exists: true, $ne: [] } }
            ]
        });

        if (propertiesWithFavoriteRequests.length === 0) {
            return res.status(404).json({ message: "No favorite requests found for this user." });
        }

        // Build response data
        const favoriteRequestsData = propertiesWithFavoriteRequests.map(property => ({
            rentId: property.rentId,
            status: property.status,
            propertyMode: property.propertyMode,
            propertyType: property.propertyType,
            postedBy:property.postedBy,
          totalArea:property.totalArea,
          areaUnit:property.areaUnit,
                    bedrooms:property.bedrooms,

            area: property.area,
            city: property.city,
            state:property.state,
            createdAt: property.createdAt,
            updatedAt: property.updatedAt,
            rentalAmount: property.rentalAmount,
            photos: property.photos || [],
            postedUserPhoneNumber: property.phoneNumber,
            propertyDetails: property.propertyDetails || {},
            favoritedUsersPhoneNumbers: (property.favoriteRequests || [])
                .filter(req => req.phoneNumber)
                .map(req => req.phoneNumber)
        }));

        return res.status(200).json({
            message: "Properties with favorite requests fetched successfully.",
            favoriteRequestsData
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

router.get('/get-favorite-owner-rent', async (req, res) => {
    try {
      const { phoneNumber } = req.query;
  
      if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required." });
      }
  
      const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10); // Normalize to last 10 digits
      const regex = new RegExp(`${cleanPhone}$`, 'i');
  
      // Find properties where favoriteRequests includes this user
      const properties = await AddModel.find({
        favoriteRequests: {
          $elemMatch: {
            phoneNumber: { $regex: regex }
          }
        }
      });
  
      if (properties.length === 0) {
        return res.status(404).json({ message: "No favorite properties found for this phone number." });
      }
  
      // Filter favoriteRequests to include only matching phone numbers
      const favoriteRequestsData = properties.map((property) => {
        const matchingFavorites = property.favoriteRequests.filter(fav =>
          regex.test(fav.phoneNumber)
        );
  
        return {
          rentId: property.rentId,
          postedUserPhoneNumber: property.phoneNumber,
          favoritedUserPhoneNumbers: matchingFavorites.map(fav => fav.phoneNumber),
          propertyMode: property.propertyMode,
          propertyType: property.propertyType,
          postedBy:property.postedBy,
          totalArea:property.totalArea,
          areaUnit:property.areaUnit,
                              bedrooms:property.bedrooms,
                               views:property.views,
                              floorNo:property.floorNo,
          area: property.area,
          city: property.city,
          createdAt: property.createdAt,
          updatedAt: property.updatedAt,
          rentalAmount: property.rentalAmount,
          status: property.status,
          photos: property.photos || [],
        };
      });
  
      return res.status(200).json({
        message: "Favorite requests fetched successfully.",
        favoriteRequestsData,
        count: favoriteRequestsData.length
      });
  
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });


router.put("/favorite/delete/:rentId/:favoriteUser", async (req, res) => {
    try {
        const { rentId, favoriteUser } = req.params;

        const property = await AddModel.findOne({ rentId });
        if (!property) {
            return res.status(404).json({ message: "Property not found." });
        }

        // Remove the favorite request from the array
        property.favoriteRequests = property.favoriteRequests.filter(req => req.phoneNumber !== favoriteUser);

        await property.save();

            const updatedProperty = await AddModel.findOne({ rentId: rentId });


        return res.status(200).json({ message: "Favorite request deleted successfully.",
                      property:updatedProperty,

         });

    } catch (error) {
        return res.status(500).json({ message: "Error deleting favorite request.", error: error.message });
    }
});

// 📌 PUT: Undo a Deleted Favorite Buyer Request
router.put("/favorite/undo/:rentId/:favoriteUser", async (req, res) => {
    try {
        const { rentId, favoriteUser } = req.params;

        const property = await AddModel.findOne({ rentId });
        if (!property) {
            return res.status(404).json({ message: "Property not found." });
        }

        // Ensure the favorite request isn't duplicated
        if (!property.favoriteRequests.some(req => req.phoneNumber === favoriteUser)) {
            property.favoriteRequests.push({ phoneNumber: favoriteUser });
        }

        await property.save();

        return res.status(200).json({
            message: "Favorite request restored successfully.",
            property
        });

    } catch (error) {
        return res.status(500).json({ message: "Error restoring favorite request.", error: error.message });
    }
});








router.get("/get-contact-buyer-rent", async (req, res) => {
  try {
    let { postedPhoneNumber } = req.query;

    if (!postedPhoneNumber) {
      return res.status(400).json({ message: "Posted user phone number is required." });
    }

    // 🔄 Normalize phone number
    postedPhoneNumber = postedPhoneNumber.replace(/\D/g, "");
    if (postedPhoneNumber.startsWith("91") && postedPhoneNumber.length === 12) {
      postedPhoneNumber = postedPhoneNumber.slice(2);
    }

    // 🔍 Fetch all properties posted by the user
    const properties = await AddModel.find({
      $or: [
        { phoneNumber: postedPhoneNumber },
        { phoneNumber: `+91${postedPhoneNumber}` },
        { phoneNumber: `91${postedPhoneNumber}` }
      ]
    });


//     const properties = await AddModel.find({
//   $or: [
//     { phoneNumber: postedPhoneNumber },
//     { phoneNumber: `+91${postedPhoneNumber}` },
//     { phoneNumber: `91${postedPhoneNumber}` }
//   ]
// });


    if (!properties.length) {
      return res.status(404).json({ message: "No properties found for this owner." });
    }

    // ✅ Filter properties with at least one valid contact request
    const contactRequestsData = properties
      .filter(property =>
        Array.isArray(property.contactRequests) &&
        property.contactRequests.some(req => req.phoneNumber)
      )
      .map(property => ({
        rentId: property.rentId || null, // 🔁 replaced ppcId
        _id: property._id,
        views: property.views || 0,
        status: property.status,
        propertyMode: property.propertyMode,
        propertyType: property.propertyType,
        area: property.area,
        city: property.city,
        postedBy: property.postedBy,
        totalArea: property.totalArea,
        areaUnit: property.areaUnit,
        bedrooms: property.bedrooms,
        rentalAmount: property.rentalAmount || "", // 🔁 replaced price
        photos: property.photos || [],
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
        postedUserPhoneNumber: property.phoneNumber,
        propertyDetails: property.propertyDetails || {},

        contactRequestersPhoneNumbers: property.contactRequests
          .filter(req => req.phoneNumber)
          .map(req => req.phoneNumber),

        fullContactRequests: property.contactRequests
      }));

    return res.status(200).json({
      message: "Contacted buyer data fetched successfully.",
      contactRequestsData
    });

  } catch (error) {
    console.error("Error in /get-contact-buyer:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
});




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

// Express.js Route




// Get unique count of buyer contacts per rentId (one per rentId + buyerPhone)
router.get("/get-contact-buyer-count", async (req, res) => {
  try {
    let { postedPhoneNumber } = req.query;

    if (!postedPhoneNumber) {
      return res.status(400).json({ message: "Posted phone number is required." });
    }

    postedPhoneNumber = postedPhoneNumber.replace(/\D/g, "");

    const data = await ContactLog.aggregate([
      {
        $match: {
          postedPhoneNumber: postedPhoneNumber
        }
      },
      {
        $group: {
          _id: {
            rentId: "$rentId",
            buyerPhoneNumber: "$buyerPhoneNumber"
          }
        }
      },
      {
        $count: "contactBuyerCount"
      }
    ]);

    const count = data.length > 0 ? data[0].contactBuyerCount : 0;

    return res.status(200).json({ contactBuyerCount: count });
  } catch (error) {
    console.error("Error fetching contactBuyerCount:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});




router.get('/get-contact-owner-rent', async (req, res) => {
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
      return res.status(404).json({
        success: false,
        message: 'No properties found with contact requests for this phone number.'
      });
    }

    const contactRequestsData = propertiesWithContactRequests.map(property => ({
      rentId: property.rentId, // ✅ replaced ppcId
      postedUserPhoneNumber: property.phoneNumber,
      contactRequestedUserPhoneNumbers: property.contactRequests.map(req => req.phoneNumber),
      views: property.views || 0,
      propertyMode: property.propertyMode,
      propertyType: property.propertyType,
      area: property.area,
      city: property.city,
        postedBy:property.postedBy,
          totalArea:property.totalArea,
          areaUnit:property.areaUnit,
                    floorNo:property.floorNo,

                              bedrooms:property.bedrooms,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      rentalAmount: property.rentalAmount, // ✅ replaced price
      bestTimeToCall: property.bestTimeToCall,
      email: property.email,
      status: property.status,
      photos: property.photos || [],
    }));

    return res.status(200).json({
      success: true,
      message: 'Contact requests fetched successfully',
      contactRequestsData
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
});


router.get("/property-buyer-viewed-rent", async (req, res) => {
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

    // Extract all Rent IDs
    const ownerRentIds = ownerProperties.map((property) => property.rentId);

    // Fetch users who viewed these properties
    const viewedUsers = await UserViews.find({ "viewedProperties.rentId": { $in: ownerRentIds } });

    if (!viewedUsers.length) {
      return res.status(404).json({ message: "No viewed users found for this owner" });
    }

    // Fetch full property details
    const propertyDetails = await AddModel.find({ rentId: { $in: ownerRentIds } });

    // Convert property details into a Map for quick lookup
    const propertyMap = new Map();
    propertyDetails.forEach((property) => {
      const plain = property.toObject();
      plain.rentalAmount = property.rentalAmount; // Ensure rentalAmount is available
      propertyMap.set(property.rentId, plain);
    });

    // Organizing response data
    const response = viewedUsers.map((user) => ({
      viewerPhoneNumber: user.phoneNumber,
      viewedProperties: user.viewedProperties
        .filter((vp) => ownerRentIds.includes(vp.rentId)) // filter by rentId
        .map((vp) => ({
          rentId: vp.rentId,
          propertyOwnerPhoneNumber: vp.propertyOwnerPhoneNumber,
          viewedAt: vp.viewedAt,
          _id: vp._id,
          propertyDetails: propertyMap.get(vp.rentId) || null, // include full property details
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


router.get('/get-all-contact-requests', async (req, res) => {
  try {
    // Fetch all properties where contactRequests exist
    const propertiesWithContactRequests = await AddModel.find({
      contactRequests: { $exists: true, $ne: [] }
    });

    if (propertiesWithContactRequests.length === 0) {
      return res.status(404).json({ message: 'No contact requests found.' });
    }

    // 🔹 Owner-side view (who received contact requests)
    const contactRequestsData = propertiesWithContactRequests.map(property => ({
      rentId: property.rentId,
      postedUserPhoneNumber: property.phoneNumber,
      // contactRequestedUserPhoneNumbers: property.contactRequests.map(request => request.phoneNumber),
       contactRequestedUserPhoneNumbers: property.contactRequests.map(request => ({
        phoneNumber: request.phoneNumber,
        date: request.date
      })),
      propertyMode: property.propertyMode,
      propertyType: property.propertyType,
      rentalAmount: property.rentalAmount, // ✅ replaced price
      area: property.area,
      bestTimeToCall: property.bestTimeToCall || 'Not specified',
      email: property.email || 'Not provided',
      views: property.views || 0,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      status: property.status,
      photos: property.photos || [],
    }));

    // 🔹 Buyer-side view (who made contact requests)
    const propertiesData = propertiesWithContactRequests.map(property => ({
      rentId: property.rentId,
      postedUserPhoneNumber: property.phoneNumber,
      propertyDetails: property.propertyDetails || 'No details available',
      // contactRequesters: property.contactRequests.map(request => request.phoneNumber),
        contactRequestedUserPhoneNumbers: property.contactRequests.map(request => ({
        phoneNumber: request.phoneNumber,
        date: request.date
      })),
      bestTimeToCall: property.bestTimeToCall || 'Not specified',
      email: property.email || 'Not provided',
      views: property.views || 0,
      propertyMode: property.propertyMode,
      propertyType: property.propertyType,
      area: property.area,
      city: property.city,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      rentalAmount: property.rentalAmount, // ✅ replaced price
      status: property.status,
      photos: property.photos || [],
    }));

    return res.status(200).json({
      message: 'Contact request data fetched successfully',
      contactRequestsData,
      propertiesData
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
});



router.get('/get-all-sendinterest', async (req, res) => {
  try {
    // Fetch all properties where interest requests exist
    const interestedProperties = await AddModel.find({ interestRequests: { $exists: true, $ne: [] } });

    if (interestedProperties.length === 0) {
      return res.status(404).json({ message: 'No interest requests found.' });
    }

    // Extracting interest request summary data
    const interestRequestsData = interestedProperties.map(property => ({
      rentId: property.rentId,  // Updated from ppcId
      postedUserPhoneNumber: property.phoneNumber,
      interestedUserPhoneNumbers: property.interestRequests.map(request => request.phoneNumber),
      propertyMode: property.propertyMode,
      propertyType: property.propertyType,
      rentalAmount: property.rentalAmount,  // Updated from price
      area: property.area,
      ownerName: property.ownerName || 'Unknown',
      views: property.views || 0,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt
    }));

    // Detailed properties data
    const propertiesData = interestedProperties.map(property => ({
      rentId: property.rentId,  // Updated from ppcId
      postedUserPhoneNumber: property.phoneNumber,
      propertyDetails: property.propertyDetails || 'No details available',
      interestedUsers: property.interestRequests.map(request => request.phoneNumber),
      views: property.views || 0,
      propertyMode: property.propertyMode,
      propertyType: property.propertyType,
      area: property.area,
      city: property.city,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      rentalAmount: property.rentalAmount,  // Updated from price
      status: property.status,
      photos: property.photos || []
    }));

    return res.status(200).json({
      message: 'Interest request data fetched successfully',
      interestRequestsData,
      propertiesData
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


router.get("/get-all-favorite-removed", async (req, res) => {
  try {
    // Fetch all properties where `favoriteRemoved` contains entries
    const properties = await AddModel.find({ "favoriteRemoved.0": { $exists: true } });

    // Format the response data
    const favoriteRemovedData = properties.map((property) => ({
      rentId: property.rentId,  // Changed from ppcId
      postedUserPhoneNumber: property.phoneNumber,
      ownerName: property.ownerName,
      propertyMode: property.propertyMode,
      propertyType: property.propertyType,
      rentalAmount: property.rentalAmount,  // Changed from price
      postedBy: property.postedBy,
      totalArea: property.totalArea,
      bedrooms: property.bedrooms,
      areaUnit: property.areaUnit,
      area: property.area,
      city: property.city,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      favoriteRemoved: property.favoriteRemoved.map((fav) => ({
        phoneNumber: fav.phoneNumber,
        removedAt: fav.removedAt,
      })),
    }));

    res.status(200).json({
      message: "Favorite removed data fetched successfully!",
      data: favoriteRemovedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


router.get('/get-reported-properties', async (req, res) => {
  try {
    // Find properties where at least one report exists
    const reportedProperties = await AddModel.find({
      reportProperty: { $exists: true, $ne: [] }
    });

    if (reportedProperties.length === 0) {
      return res.status(404).json({ message: 'No reported properties found', success: false });
    }

    // Return only necessary fields (customize as needed)
    const formattedData = reportedProperties.map(property => ({
      rentId: property.rentId, // changed from ppcId
      ownerPhoneNumber: property.phoneNumber,
      ownerName: property.ownerName,
      propertyMode: property.propertyMode,
      propertyType: property.propertyType,
      rentalAmount: property.rentalAmount, // changed from price
      area: property.area,
      city: property.city,
      state: property.state,
      photos: property.photos || [],
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      totalReports: property.reportProperty.length,
      reportDetails: property.reportProperty.map(r => ({
        phoneNumber: r.phoneNumber,
        reason: r.reason,
        selectReasons: r.selectReasons,
        date: r.date
      }))
    }));

    res.status(200).json({ success: true, data: formattedData });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});


router.get('/get-all-soldout-requests', async (req, res) => {
  try {
    // Fetch all properties where sold-out requests exist
    const propertiesWithSoldOutRequests = await AddModel.find({
      soldOutReport: { $exists: true, $ne: [] }
    });

    if (propertiesWithSoldOutRequests.length === 0) {
      return res.status(404).json({ message: 'No sold-out requests found.' });
    }

    // Extracting sold-out request details for owners
    const soldOutRequestsData = propertiesWithSoldOutRequests.map(property => ({
      rentId: property.rentId, // changed from ppcId
      postedUserPhoneNumber: property.phoneNumber,
      soldOutRequestedUserPhoneNumbers: property.soldOutReport.map(request => request.phoneNumber),
      views: property.views || 0,
      propertyMode: property.propertyMode,
      propertyType: property.propertyType,
      area: property.area,
      city: property.city,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      rentalAmount: property.rentalAmount, // changed from price
      status: property.status,
      photos: property.photos || [],
    }));

    // Extracting sold-out request details for buyers
    const propertiesData = propertiesWithSoldOutRequests.map(property => ({
      rentId: property.rentId, // changed from ppcId
      postedUserPhoneNumber: property.phoneNumber,
      propertyDetails: property.propertyDetails || 'No details available',
      soldOutRequesters: property.soldOutReport.map(request => request.phoneNumber),
      views: property.views || 0,
      propertyMode: property.propertyMode,
      propertyType: property.propertyType,
      area: property.area,
      city: property.city,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      rentalAmount: property.rentalAmount, // changed from price
      status: property.status,
      photos: property.photos || [],
    }));

    return res.status(200).json({
      message: 'Sold-out request data fetched successfully',
      soldOutRequestsData,
      propertiesData
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});



router.get('/get-help-requests', async (req, res) => {
  try {
    // Only fetch properties that have help requests
    const properties = await AddModel.find({ "helpRequests.0": { $exists: true } });

    const helpRequests = [];

    properties.forEach(property => {
      property.helpRequests.forEach(request => {
        helpRequests.push({
          rentId: property.rentId, // changed from ppcId
          ownerName: property.ownerName,
          ownerPhoneNumber: property.phoneNumber,
          propertyMode: property.propertyMode,
          propertyType: property.propertyType,
          rentalAmount: property.rentalAmount, // changed from price
          area: property.area,
          city: property.city,
          state: property.state,
          createdAt: property.createdAt,
          updatedAt: property.updatedAt,
          phoneNumber: request.phoneNumber,
          selectHelpReason: request.selectHelpReason,
          comment: request.comment,
          requestedAt: request.requestedAt
        });
      });
    });

    return res.status(200).json({
      message: 'Help request data fetched successfully',
      data: helpRequests
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
});




module.exports = router;
