
const express = require('express');
const router = express.Router();
const Offer = require('../Offer/OfferModel'); 
const AddModel = require('../AddModel');
const NotificationUser = require('../Notification/NotificationDetailModel');


// router.post('/offer-rent', async (req, res) => {
//     try {
//         const { rentId, phoneNumber, offeredPrice } = req.body;

//         if (!rentId || !phoneNumber || !offeredPrice) {
//             return res.status(400).json({ message: "All fields are required: ppcId, phoneNumber, offeredPrice" });
//         }

//         const numericPrice = Number(offeredPrice);
//         if (isNaN(numericPrice) || numericPrice <= 0) {
//             return res.status(400).json({ message: "Invalid price. It must be a positive number." });
//         }

//         const property = await AddModel.findOne({ rentId });
//         if (!property) {
//             return res.status(404).json({ message: "Property not found" });
//         }

//         const ownerPhone = property.phoneNumber;
// const originalPrice = property.rentalAmount; // ✅ fixed here

//         let offer = await Offer.findOne({ rentId, phoneNumber });

//         if (offer) {
//             offer.offeredPrice = numericPrice;
//             offer.originalPrice = originalPrice;
//             offer.postedUserPhoneNumber = ownerPhone;
//             await offer.save();

//             // 🔔 Send Notification - Offer Updated
//             await NotificationUser.create({
//                 recipientPhoneNumber: ownerPhone,
//                 senderPhoneNumber: phoneNumber,
//                 rentId,
//                 message: `User ${phoneNumber} updated their offer to ₹${numericPrice} for your property.`,
//                 createdAt: new Date()
//             });

//             return res.status(200).json({
//                 message: "Offer updated successfully",
//                 offer
//             });
//         }

//         // New offer
//         offer = new Offer({
//             rentId,
//             phoneNumber,
//             offeredPrice: numericPrice,
//             status: 'pending',
//             originalPrice,
//             postedUserPhoneNumber: ownerPhone
//         });

//         await offer.save();

//         // 🔔 Send Notification - New Offer
//         await NotificationUser.create({
//             recipientPhoneNumber: ownerPhone,
//             senderPhoneNumber: phoneNumber,
//             rentId,
//             message: `User ${phoneNumber} made a new offer of ₹${numericPrice} for your property.`,
//             createdAt: new Date()
//         });

//         res.status(201).json({
//             message: "Offer created successfully",
//             offer
//         });

//     } catch (error) {
//         res.status(500).json({ message: "Error processing offer", error: error.message });
//     }
// });

router.post('/offer-rent', async (req, res) => {
  try {
    const { rentId, phoneNumber, offeredPrice } = req.body;

    if (!rentId || !phoneNumber || !offeredPrice) {
      return res.status(400).json({ message: "All fields are required: rentId, phoneNumber, offeredPrice" });
    }

    const numericPrice = Number(offeredPrice);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: "Invalid price. It must be a positive number." });
    }

    const property = await AddModel.findOne({ rentId });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const ownerPhone = property.phoneNumber;
    const originalPrice = property.rentalAmount;

    let offer = await Offer.findOne({ rentId, phoneNumber });

    if (offer) {
      // Update existing offer
      offer.offeredPrice = numericPrice;
      offer.originalPrice = originalPrice;
      offer.postedUserPhoneNumber = ownerPhone;
      offer.offerDate = new Date(); // ✅ update offer date on edit
      await offer.save();

      await NotificationUser.create({
        recipientPhoneNumber: ownerPhone,
        senderPhoneNumber: phoneNumber,
        rentId,
        message: `User ${phoneNumber} updated their offer to ₹${numericPrice} for your property.`,
        createdAt: new Date()
      });

      return res.status(200).json({
        message: "Offer updated successfully",
        offer
      });
    }

    // Create new offer
    offer = new Offer({
      rentId,
      phoneNumber,
      offeredPrice: numericPrice,
      status: 'pending',
      originalPrice,
      postedUserPhoneNumber: ownerPhone,
      offerDate: new Date() // ✅ explicitly set offer date
    });

    await offer.save();

    await NotificationUser.create({
      recipientPhoneNumber: ownerPhone,
      senderPhoneNumber: phoneNumber,
      rentId,
      message: `User ${phoneNumber} made a new offer of ₹${numericPrice} for your property.`,
      createdAt: new Date()
    });

    res.status(201).json({
      message: "Offer created successfully",
      offer
    });

  } catch (error) {
    res.status(500).json({ message: "Error processing offer", error: error.message });
  }
});


router.get("/offers/owner/:phoneNumber", async (req, res) => {
    try {
        let { phoneNumber } = req.params;
        phoneNumber = phoneNumber.replace(/\D/g, "");

        const phoneVariants = [
            phoneNumber,
            `91${phoneNumber}`,
            `+91${phoneNumber}`
        ];

        const buyerOffers = await Offer.find({ phoneNumber: { $in: phoneVariants } });

        if (!buyerOffers.length) {
            return res.status(404).json({ message: "No offers found for this buyer." });
        }

        const uniquePpcIds = [...new Set(buyerOffers.map((offer) => offer.rentId))];

        const properties = await AddModel.find({ rentId: { $in: uniquePpcIds } }).lean();
        const propertyMap = new Map(properties.map((p) => [p.rentId, p]));

        // const offersData = buyerOffers.map((offer) => {
        //     const property = propertyMap.get(offer.rentId);
        //     return {
        //         rentId: offer.rentId,
        //         offeredPrice: offer.offeredPrice,
        //         buyerPhoneNumber: offer.phoneNumber,
        //         originalPrice: property?.originalPrice || null,
        //         propertyMode: property?.propertyMode || null,
        //         totalArea: property?.totalArea || null,
        //           floorNo: property?.floorNo || null,
        //         views: property?.views || null,
        //         areaUnit:property?.areaUnit || null,
        //         propertyType: property?.propertyType || null,
        //         bedrooms: property?.bedrooms || null,
        //         ownership: property?.ownership || null,
        //         postedUserPhoneNumber: property?.phoneNumber || offer.postedUserPhoneNumber || null,
        //         status: offer.status || "pending",
        //         createdAt: offer.createdAt // ✅ Added this line


        //     };
        // });

const offersData = buyerOffers.map((offer) => {
    const property = propertyMap.get(offer.rentId);
    return {
        rentId: offer.rentId,
        offeredPrice: offer.offeredPrice,
        buyerPhoneNumber: offer.phoneNumber,
        offerDate:offer.offerDate,
        originalPrice: property?.originalPrice ?? offer.originalPrice ?? null,
        propertyMode: property?.propertyMode || null,
        totalArea: property?.totalArea || null,
                postedBy: property?.postedBy || null,

        floorNo: property?.floorNo || null,
        views: property?.views || null,
        areaUnit: property?.areaUnit || null,
        propertyType: property?.propertyType || null,
        bedrooms: property?.bedrooms || null,
        ownership: property?.ownership || null,
        postedUserPhoneNumber: property?.phoneNumber || offer.postedUserPhoneNumber || null,
        status: offer.status || "pending",
        createdAt: offer.createdAt
    };
});


        res.status(200).json({
            message: "Buyer’s offers fetched successfully.",
            offers: offersData
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching buyer offers.",
            error: error.message
        });
    }
});


router.get("/offers/owner/count/:phoneNumber", async (req, res) => {
    try {
        let { phoneNumber } = req.params;

        // Remove non-digits
        phoneNumber = phoneNumber.replace(/\D/g, "");

        // Build multiple formats
        const phoneVariants = [
            phoneNumber,            // 9876543210
            `91${phoneNumber}`,     // 919876543210
            `+91${phoneNumber}`     // +919876543210
        ];

        // 🔍 Match using $in — this is safe, no regex!
        const offerCount = await Offer.countDocuments({ phoneNumber: { $in: phoneVariants } });

        return res.status(200).json({ offerCount });

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching offer count.",
            error: error.message
        });
    }
});





router.get('/offers', async (req, res) => {
    try {
        const { rentId } = req.params;

        // Find the property
        const property = await AddModel.findOne({ rentId });
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        // Find all offers for the property
        const offers = await Offer.find({ ppcId });

        res.status(200).json({
            offers,
            property: {
                originalPrice: property.offeredPrice,
                postedBy: property.phoneNumber
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching offers", error: error.message });
    }
});


// router.get('/all-offers', async (req, res) => {
//     try {
//         // Fetch all offers from the database
//         const offers = await Offer.find();

//         if (offers.length === 0) {
//             return res.status(404).json({ message: "No offers found" });
//         }

//         res.status(200).json({ offers });

//     } catch (error) {
//         res.status(500).json({ message: "Error fetching offers", error: error.message });
//     }
// });



router.get('/all-offers', async (req, res) => {
    try {
        const offers = await Offer.find().select('rentId offeredPrice originalPrice phoneNumber postedUserPhoneNumber offerDate status createdAt');

        if (!offers.length) {
            return res.status(404).json({ message: "No offers found" });
        }

        res.status(200).json({ offers });
    } catch (error) {
        res.status(500).json({ message: "Error fetching offers", error: error.message });
    }
});


/** 🏠 GET ALL OFFERS RECEIVED BY AN OWNER (MULTIPLE BUYERS, MULTIPLE PROPERTIES) **/
router.get('/offers/buyer/:phoneNumber', async (req, res) => {
    try {
        let { phoneNumber } = req.params;

        // Normalize phone number format (removes non-numeric characters)
        phoneNumber = phoneNumber.replace(/\D/g, "");
        if (phoneNumber.startsWith("91") && phoneNumber.length === 12) {
            phoneNumber = phoneNumber.slice(2);
        }

        // Find all properties posted by this owner
        const propertiesByOwner = await AddModel.find({
            $or: [
                { phoneNumber },
                { phoneNumber: `+91${phoneNumber}` },
                { phoneNumber: `91${phoneNumber}` }
            ]
        });

        if (!propertiesByOwner.length) {
            return res.status(404).json({ message: "No properties found for this owner." });
        }

        // Extract property IDs
        const propertyIds = propertiesByOwner.map(property => property.rentId);

        // Fetch all offers on these properties
        const ownerOffers = await Offer.find({ rentId: { $in: propertyIds } });

        if (!ownerOffers.length) {
            return res.status(404).json({ message: "No offers found for properties owned by this user." });
        }

        // Map offer details with property data
        const offersData = ownerOffers.map(offer => {
            const property = propertiesByOwner.find(prop => prop.rentId === offer.rentId);
            return {
          
                rentId: offer.rentId,
                offeredPrice: offer.offeredPrice,
                buyerPhoneNumber: offer.phoneNumber,
                        offerDate:offer.offerDate,

        originalPrice: offer.originalPrice || null,  // ✅ Fixed line
                propertyMode: property?.propertyMode || null,
                totalArea: property?.totalArea || null,
                areaUnit:property?.areaUnit || null,
                propertyType: property?.propertyType || null,
                bedrooms: property?.bedrooms || null,
                ownership: property?.ownership || null,
                postedUserPhoneNumber: property?.phoneNumber || offer.postedUserPhoneNumber || null,
                status: offer.status || "pending",
                createdAt: offer.createdAt // ✅ Added this line

            };
        });

        res.status(200).json({ message: "Owner's property offers fetched successfully.", offers: offersData });

    } catch (error) {
        res.status(500).json({ message: "Error fetching owner offers.", error: error.message });
    }
});


// ✅ Fetch Offers Count for a Property Owner
router.get('/offers/buyer/count/:phoneNumber', async (req, res) => {
    try {
        let { phoneNumber } = req.params;

        // Normalize phone number format (removes non-numeric characters)
        phoneNumber = phoneNumber.replace(/\D/g, "");
        if (phoneNumber.startsWith("91") && phoneNumber.length === 12) {
            phoneNumber = phoneNumber.slice(2);
        }

        // Find all properties posted by this owner
        const propertiesByOwner = await AddModel.find({
            $or: [
                { phoneNumber },
                { phoneNumber: `+91${phoneNumber}` },
                { phoneNumber: `91${phoneNumber}` }
            ]
        });

        if (!propertiesByOwner.length) {
            return res.status(200).json({ offersCount: 0 });
        }

        // Extract property IDs
        const propertyIds = propertiesByOwner.map(property => property.rentId);

        // Count all offers on these properties
        const offersCount = await Offer.countDocuments({ rentId: { $in: propertyIds } });

        return res.status(200).json({ offersCount });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching owner's offer count.", error: error.message });
    }
});

// ✅ UPDATED BACKEND APIs using rentId & rentalAmount instead of ppcId & price

// DELETE offer
router.put('/offers/delete/:rentId/:buyerPhoneNumber', async (req, res) => {
    try {
        const { rentId, buyerPhoneNumber } = req.params;
        let formattedPhone = buyerPhoneNumber.replace(/\D/g, "");
        if (formattedPhone.startsWith("91") && formattedPhone.length === 12) {
            formattedPhone = formattedPhone.slice(2);
        }

        const phoneVariants = [formattedPhone, `91${formattedPhone}`, `+91${formattedPhone}`];

        const offer = await Offer.findOne({ rentId, phoneNumber: { $in: phoneVariants } });
        if (!offer) return res.status(404).json({ message: "No matching offer found." });

        const property = await AddModel.findOne({ rentId });
        const previousStatus = offer.status;

        offer.status = "delete";
        offer.previousStatus = previousStatus;
        await offer.save();

        res.status(200).json({
            message: "Offer marked as deleted.",
            offerDetails: {
                rentId: offer.rentId,
                offeredPrice: offer.offeredPrice,
                buyerPhoneNumber: offer.phoneNumber,
                rentalAmount: property?.rentalAmount || null,
                propertyMode: property?.propertyMode || null,
                propertyType: property?.propertyType || null,
                postedUserPhoneNumber: property?.phoneNumber || null,
                status: offer.status || "pending"
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating offer status.", error: error.message });
    }
});

// UNDO offer
router.put('/offers/undo/:rentId/:buyerPhoneNumber', async (req, res) => {
    try {
        const { rentId, buyerPhoneNumber } = req.params;
        let formattedPhone = buyerPhoneNumber.replace(/\D/g, "");
        if (formattedPhone.startsWith("91") && formattedPhone.length === 12) {
            formattedPhone = formattedPhone.slice(2);
        }

        const phoneVariants = [formattedPhone, `91${formattedPhone}`, `+91${formattedPhone}`];

        const offer = await Offer.findOne({ rentId, phoneNumber: { $in: phoneVariants }, status: "delete" });
        if (!offer) return res.status(404).json({ message: "No deleted offer found to restore." });

        const property = await AddModel.findOne({ rentId });

        offer.status = offer.previousStatus || "pending";
        offer.previousStatus = undefined;
        await offer.save();

        res.status(200).json({
            message: "Offer status restored successfully.",
            restoredOffer: {
                rentId: offer.rentId,
                offeredPrice: offer.price,
                buyerPhoneNumber: offer.phoneNumber,
                rentalAmount: property?.rentalAmount || null,
                propertyMode: property?.propertyMode || null,
                propertyType: property?.propertyType || null,
                postedUserPhoneNumber: property?.phoneNumber || null,
                status: offer.status || "pending"
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error restoring offer status.", error: error.message });
    }
});

// ACCEPT offer
router.put("/accept-offer", async (req, res) => {
    try {
        const { rentId, buyerPhoneNumber } = req.body;
        if (!rentId || !buyerPhoneNumber) return res.status(400).json({ message: "Missing required fields." });

        let formattedPhone = buyerPhoneNumber.replace(/\D/g, "");
        if (formattedPhone.startsWith("91") && formattedPhone.length === 12) {
            formattedPhone = formattedPhone.slice(2);
        }

        const offer = await Offer.findOne({ rentId, phoneNumber: { $regex: `${formattedPhone}$`, $options: "i" } });
        if (!offer) return res.status(404).json({ message: "Offer not found." });

        offer.status = "accept";
        await offer.save();

        res.status(200).json({ message: "Offer accepted successfully.", updatedOffer: offer });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// REJECT offer
router.put("/reject-offer", async (req, res) => {
    try {
        const { rentId, buyerPhoneNumber } = req.body;
        if (!rentId || !buyerPhoneNumber) return res.status(400).json({ message: "Missing required fields." });

        let formattedPhone = buyerPhoneNumber.replace(/\D/g, "");
        if (formattedPhone.startsWith("91") && formattedPhone.length === 12) {
            formattedPhone = formattedPhone.slice(2);
        }

        const offer = await Offer.findOne({ rentId, phoneNumber: { $regex: `${formattedPhone}$`, $options: "i" } });
        if (!offer) return res.status(404).json({ message: "Offer not found." });

        offer.status = "reject";
        await offer.save();

        res.status(200).json({ message: "Offer rejected successfully.", updatedOffer: offer });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});




router.put('/offers/deleted/:ppcId/:buyerPhoneNumber', async (req, res) => {
    try {
        const { ppcId, buyerPhoneNumber } = req.params;

        // Normalize phone number (remove non-numeric characters)
        let formattedPhoneNumber = buyerPhoneNumber.replace(/\D/g, "");

        // Handle cases where the phone number might already have "91" or "+91"
        if (formattedPhoneNumber.startsWith("91") && formattedPhoneNumber.length === 12) {
            formattedPhoneNumber = formattedPhoneNumber.slice(2); // Remove leading "91"
        }

        // Generate possible formats
        const phoneVariants = [
            formattedPhoneNumber,
            `91${formattedPhoneNumber}`,
            `+91${formattedPhoneNumber}`
        ];


        // Find the offer using $in for multiple formats
        const offer = await Offer.findOne({
            ppcId,
            phoneNumber: { $in: phoneVariants }
        });

        if (!offer) {
            return res.status(404).json({ message: "No matching offer found." });
        }

        // Store previous status before updating
        const previousStatus = offer.status;

        // Update offer status to "delete"
        offer.status = "delete";
        offer.previousStatus = previousStatus; // Store old status for undo
        await offer.save();

        res.status(200).json({
            message: "Offer marked as deleted.",
            offerDetails: offer // Sending full offer details in the response
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating offer status.", error: error.message });
    }
});






  
  // Fetch Single Offer by ID
  router.get("/fetch-offer/:id", async (req, res) => {
    try {
      const offer = await Offer.findById(req.params.id);
      if (!offer) {
        return res.status(404).json({ message: "Offer not found" });
      }
      res.status(200).json({ message: "Offer fetched successfully!", data: offer });
    } catch (error) {
      res.status(500).json({ message: "Error fetching offer", error });
    }
  });
  
  // Update Offer by ID
  router.put("/update-offer/:id", async (req, res) => {
    try {
      const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedOffer) {
        return res.status(404).json({ message: "Offer not found" });
      }
      res.status(200).json({ message: "Offer updated successfully!", data: updatedOffer });
    } catch (error) {
      res.status(500).json({ message: "Error updating offer", error });
    }
  });
  
  // Delete Offer by ID
  router.delete("/delete-offer/:id", async (req, res) => {
    try {
      const deletedOffer = await Offer.findByIdAndDelete(req.params.id);
      if (!deletedOffer) {
        return res.status(404).json({ message: "Offer not found" });
      }
      res.status(200).json({ message: "Offer deleted successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting offer", error });
    }
  });

// PUT /delete-offer/:id
router.put('/delete-offer/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const offer = await Offer.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: req.body.deletedBy || null // Optional admin ID if passed
        },
        { new: true }
      );
  
      if (!offer) {
        return res.status(404).json({ message: 'Offer not found' });
      }
  
      res.status(200).json({ message: 'Offer marked as deleted', offer });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

  
// PUT /undo-delete-offer/:id
router.put('/undo-delete-offer/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const offer = await Offer.findByIdAndUpdate(
        id,
        {
          isDeleted: false,
          deletedAt: null,
          deletedBy: null
        },
        { new: true }
      );
  
      if (!offer) {
        return res.status(404).json({ message: 'Offer not found' });
      }
  
      res.status(200).json({ message: 'Offer deletion undone', offer });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
  


  
// Accept Offer by ID
router.put("/accept-offer/:id", async (req, res) => {
    try {
      const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, { status: "accept" }, { new: true });
      if (!updatedOffer) {
        return res.status(404).json({ message: "Offer not found" });
      }
      res.status(200).json({ message: "Offer accepted successfully!", data: updatedOffer });
    } catch (error) {
      res.status(500).json({ message: "Error accepting offer", error });
    }
  });
  
  // Reject Offer by ID
  router.put("/reject-offer/:id", async (req, res) => {
    try {
      const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, { status: "reject" }, { new: true });
      if (!updatedOffer) {
        return res.status(404).json({ message: "Offer not found" });
      }
      res.status(200).json({ message: "Offer rejected successfully!", data: updatedOffer });
    } catch (error) {
      res.status(500).json({ message: "Error rejecting offer", error });
    }
  });
  

module.exports = router;













