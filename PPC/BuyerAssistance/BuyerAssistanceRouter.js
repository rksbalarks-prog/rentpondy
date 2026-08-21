const express = require("express");
const router = express.Router();
const BuyerAssistance = require("../BuyerAssistance/BuyerAssistanceModel");
const AddModel = require('../AddModel');
const NotificationUser = require('../Notification/NotificationDetailModel');
const PricingPlans = require('../plans/PricingPlanModel');
const Bill = require('../CreateBill/BillModel');
const FollowUp = require('../FollowUp/FollowUpModel'); // Import your model
const PaymentPayUBuyer =require('../PayuBuyer/PayuBuyerModel')
const BuyerAssistView = require ('../BuyerAssistViewModel')
const BuyerPlan = require('../BuyerPlan/BuyerModel');
const { baseFilter, resolveBaseFromAddress, resolveBaseForSave, normalizeBase } = require('../utils/baseFilter'); // city-base (PY/CH) filtering

//WHATSAPP API TO SEND MATCHED TENANTS AND OWNER
const whatsapp = require("../services/whatsapp"); // SmartGrowth AI campaign API
// Still used by the loopback fetch in /fetch-all-matched-datas-rent (not WhatsApp).
const request = require("request");

// Helper function to mask phone number (e.g., 9108632441 becomes 91086xxxxx41)
const maskPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "xxxxx";
  const cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.length < 4) return "xxxxx";
  const first2 = cleaned.substring(0, 2);
  const last2 = cleaned.substring(cleaned.length - 2);
  const masked = first2 + 'xxxxx' + last2;
  return masked;
};

// Helper function to send a WhatsApp message via the SmartGrowth AI campaign API.
//
// ⚠ Template-only provider: `message` (which carries the masked counterparty
// number) cannot be transmitted — the recipient receives the approved template.
// Point this flow at its own template with SMARTGROWTH_NOTIFY_TEMPLATE_ID once
// a "matched" template that renders the number is approved.
const sendWhatsAppMessage = async (toNumber, message) => {
  console.log(`ℹ️ [BuyerAssistance] body not delivered (template-only): ${String(message).slice(0, 120)}`);
  return whatsapp.sendCampaign({
    phoneNumbers: [toNumber],
    campaignName: "matched",
    templateId: whatsapp.TEMPLATES.notify(),
  });
};

const sendMessage = async () => {
  try {
    console.log("========== WHATSAPP MESSAGE SENDING STARTED  ==========");

    // Fetch all matched properties data
    console.log("🔍 Fetching Buyer Requests from database...");
    const buyerRequests = await BuyerAssistance.find({});
    console.log(`✅ Total Buyer Requests Found: ${buyerRequests.length}`);
    
    for (let buyerRequest of buyerRequests) {
      // Skip if already sent (IMPORTANT: Prevent duplicate messages)
      if (buyerRequest.Whatsappstatus === "Send") {
        continue;
      }

      const matchedProperties = await AddModel.find({
        propertyMode: buyerRequest.propertyMode,
        propertyType: buyerRequest.propertyType,
        state: buyerRequest.state,
        rentalAmount: {
          $gte: Number(buyerRequest.minPrice),
          $lte: Number(buyerRequest.maxPrice),
        },
      });

      if (matchedProperties.length > 0) {
        for (const property of matchedProperties) {
          try {
            // Mask phone numbers
            const maskedTenantPhone = maskPhoneNumber(buyerRequest.phoneNumber);
            const maskedOwnerPhone = maskPhoneNumber(property.phoneNumber);

            // Send message to Tenant (Contact)
            if (buyerRequest.phoneNumber) {
              const tenantMessage = `Tenant Matched successfully and ${maskedOwnerPhone}`;
              const tenantResult = await sendWhatsAppMessage(buyerRequest.phoneNumber, tenantMessage);
              console.log(`✅ Tenant Message Sent: ${buyerRequest.phoneNumber}`);
            }

            // Send message to Owner (RA PHONE)
            if (property.phoneNumber) {
              const ownerMessage = `Owner Matched successfully and ${maskedTenantPhone}`;
              const ownerResult = await sendWhatsAppMessage(property.phoneNumber, ownerMessage);
              console.log(`✅ Owner Message Sent: ${property.phoneNumber}`);
            }

          } catch (error) {
            console.error(`  ❌ Error sending message for Property ${property.rentId}:`, error.message);
          }
        }

        // Update Whatsappstatus to "Send" after processing all matched properties
        const updateResult = await BuyerAssistance.findByIdAndUpdate(
          buyerRequest._id,
          { Whatsappstatus: "Send" },
          { new: true }
        );
        console.log(`✅ Status Updated: Ra_Id=${buyerRequest.Ra_Id} -> Whatsappstatus: ${updateResult?.Whatsappstatus}`);
        
        // Verify the update was saved
        const verifyUpdate = await BuyerAssistance.findById(buyerRequest._id);
        
        if (verifyUpdate?.Whatsappstatus !== "Send") {
          console.error(`❌ ERROR: Status update failed for Ra_Id=${buyerRequest.Ra_Id}`);
        }
      }
    }
    
    console.log("\n========== WHATSAPP MESSAGE SENDING COMPLETED ==========\n");
  } catch (error) {
    console.error("❌ CRITICAL Error in sendMessage:", error.message);
    console.error("Stack:", error.stack);
  }
};






router.post("/add-buyerAssistance-rent", async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).json({ message: "Phone number is required" });

    const formattedPhoneNumber = phoneNumber.replace(/^\+91/, "").trim();

    const lastRecord = await BuyerAssistance.findOne({}, { Ra_Id: 1 }).sort({ Ra_Id: -1 });
    const newRaId = lastRecord?.Ra_Id ? lastRecord.Ra_Id + 1 : 100;

    const newRequest = new BuyerAssistance({
      ...req.body,
      raName: req.body.raName || "Tenant",
      phoneNumber: formattedPhoneNumber,
      Ra_Id: newRaId,
      ra_postBy: "User",
      // `addedBy` is the logged-in admin name passed from the admin panel.
      // It's blank for end-user submissions.
      addedBy: req.body.addedBy || '',
      // A PY/CH-scoped admin forces their own city; otherwise derive
      // from the tenant's own address (city/district).
      base: resolveBaseForSave(req.query && req.query.base, req.body),
    });

    await newRequest.save();

    // Notifications
    await NotificationUser.create({
      recipientPhoneNumber: "admin",
      senderPhoneNumber: formattedPhoneNumber,
      message: `New buyer assistance request submitted by ${formattedPhoneNumber}`,
    });

    const matchedProperties = await AddModel.find({
      propertyMode: newRequest.propertyMode,
      propertyType: newRequest.propertyType,
      city: newRequest.city,
      area: newRequest.area,
      price: {
        $gte: Number(newRequest.minPrice),
        $lte: Number(newRequest.maxPrice)
      },
      // Match only properties in the same city base (PY tenant -> PY properties).
      ...baseFilter(newRequest.base)
    });

    for (const property of matchedProperties) {
      await NotificationUser.create({
        recipientPhoneNumber: property.phoneNumber,
        senderPhoneNumber: formattedPhoneNumber,
        message: `A new buyer request matches your property in ${property.area} (${property.propertyType})`,
      });
    }

    if (matchedProperties.length > 0) {
      await NotificationUser.create({
        recipientPhoneNumber: formattedPhoneNumber,
        senderPhoneNumber: "system",
        message: `We found ${matchedProperties.length} matching properties for your request in ${newRequest.area}.`,
      });
    }

    res.status(201).json({ message: "Buyer Assistance request added successfully!", data: newRequest });

  } catch (error) {
    res.status(500).json({ message: "Error adding Buyer Assistance request", error });
  }
});



router.post("/add-buyerAssistance-rent/admin", async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).json({ message: "Phone number is required" });

    const formattedPhoneNumber = phoneNumber.replace(/^\+91/, "").trim();

    const lastRecord = await BuyerAssistance.findOne({}, { Ra_Id: 1 }).sort({ Ra_Id: -1 });
    const newRaId = lastRecord?.Ra_Id ? lastRecord.Ra_Id + 1 : 100;

    const newRequest = new BuyerAssistance({
      ...req.body,
      raName: req.body.raName || "Tenant",
      phoneNumber: formattedPhoneNumber,
      Ra_Id: newRaId,
      ra_postBy: "Admin",
      addedBy: req.body.addedBy || '',
      // A PY/CH-scoped admin forces their own city; ALL admins fall back
      // to the tenant's actual address (city/district).
      base: resolveBaseForSave(req.query && req.query.base, req.body),
    });

    await newRequest.save();

    // Notifications
    await NotificationUser.create({
      recipientPhoneNumber: "admin",
      senderPhoneNumber: formattedPhoneNumber,
      message: `New buyer assistance request submitted by ${formattedPhoneNumber}`,
    });

    const matchedProperties = await AddModel.find({
      propertyMode: newRequest.propertyMode,
      propertyType: newRequest.propertyType,
      city: newRequest.city,
      area: newRequest.area,
      price: {
        $gte: Number(newRequest.minPrice),
        $lte: Number(newRequest.maxPrice)
      },
      // Match only properties in the same city base (PY tenant -> PY properties).
      ...baseFilter(newRequest.base)
    });

    for (const property of matchedProperties) {
      await NotificationUser.create({
        recipientPhoneNumber: property.phoneNumber,
        senderPhoneNumber: formattedPhoneNumber,
        message: `A new buyer request matches your property in ${property.area} (${property.propertyType})`,
      });
    }

    if (matchedProperties.length > 0) {
      await NotificationUser.create({
        recipientPhoneNumber: formattedPhoneNumber,
        senderPhoneNumber: "system",
        message: `We found ${matchedProperties.length} matching properties for your request in ${newRequest.area}.`,
      });
    }

    res.status(201).json({ message: "Buyer Assistance request added successfully!", data: newRequest });

  } catch (error) {
    res.status(500).json({ message: "Error adding Buyer Assistance request", error });
  }
});

router.put("/update-buyerAssistance-status/:id", async (req, res) => {
  try {
    const updatedRequest = await BuyerAssistance.findByIdAndUpdate(
      req.params.id,
      { ra_status: req.body.newStatus },
      { new: true }
    );

    if (!updatedRequest)
      return res.status(404).json({ message: "Request not found" });

    res.status(200).json({
      message: "Status updated successfully",
      data: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/get-buyerAssistance-all", async (req, res) => {
  try {
    const buyerAssistances = await BuyerAssistance.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json({
      message: "Buyer Assistance data fetched successfully!",
      data: buyerAssistances
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Buyer Assistance data", error });
  }
});


// 📌 1. Get all active buyer assistance grouped by phone number
router.get("/buyer-assistance-summary-rent", async (req, res) => {
  try {
    const records = await BuyerAssistance.find({ isDeleted: false }).sort({ createdAt: -1 });

    const summaryMap = {};

    records.forEach((item) => {
      const phone = item.phoneNumber;
      if (!summaryMap[phone]) {
        summaryMap[phone] = {
          phoneNumber: phone,
          count: 1,
          entries: [{
            Ra_Id: item.Ra_Id,
            raName: item.raName,
            ra_postBy: item.ra_postBy,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          }]
        };
      } else {
        summaryMap[phone].count += 1;
        summaryMap[phone].entries.push({
          Ra_Id: item.Ra_Id,
          raName: item.raName,
          ra_postBy: item.ra_postBy,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        });
      }
    });

    const result = Object.values(summaryMap).map((item) => ({
      ...item,
      entries: item.entries.map(e => ({
        ...e,
        createdAt: new Date(e.createdAt).toLocaleDateString("en-GB"),
        updatedAt: new Date(e.updatedAt).toLocaleDateString("en-GB"),
      }))
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📌 2. Get all entries by phone number
router.get("/buyer-assistance-by-phone-rent/:phoneNumber", async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const records = await BuyerAssistance.find({ phoneNumber, isDeleted: false }).sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📌 3. Get count of buyer assistance entries by phone number
router.get("/buyer-assistance-count-by-user-rent", async (req, res) => {
  try {
    const records = await BuyerAssistance.find({ isDeleted: false });

    const userCounts = records.reduce((acc, item) => {
      acc[item.phoneNumber] = (acc[item.phoneNumber] || 0) + 1;
      return acc;
    }, {});

    const result = Object.entries(userCounts).map(([phoneNumber, count]) => ({
      phoneNumber,
      adsCount: count
    }));

    res.json({
      message: "Buyer assistance ad count per user fetched successfully!",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch buyer assistance ad counts",
      error: error.message
    });
  }
});

// 📌 4. Soft delete a buyer assistance by ID
router.delete("/soft-delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await BuyerAssistance.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date()
    });

    if (!result) {
      return res.status(404).json({ success: false, message: "Buyer assistance not found" });
    }

    res.json({ success: true, message: "Buyer assistance soft-deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📌 5. Restore a soft-deleted record
router.put("/restore/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await BuyerAssistance.findByIdAndUpdate(id, {
      isDeleted: false,
      deletedAt: null
    });

    if (!result) {
      return res.status(404).json({ success: false, message: "Buyer assistance not found" });
    }

    res.json({ success: true, message: "Buyer assistance restored successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.get("/fetch-buyerAssistances-rent", async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    const baQuery = phoneNumber ? { phoneNumber } : {};
    const requests = await BuyerAssistance.find(baQuery);

    const userPhoneNumbers = [...new Set(requests.map(r => r.phoneNumber))];
    const rentIds = [...new Set(requests.map(r => r.rentId))];

    const [properties, plans, bills, followups] = await Promise.all([
      AddModel.find({ rentId: { $in: rentIds } }),
      PricingPlans.find({ phoneNumber: { $in: userPhoneNumbers } }),
      Bill.find({
        $or: [
          { ownerPhone: { $in: userPhoneNumbers } },
          { rentId: { $in: rentIds } }
        ]
      }),
      FollowUp.find({ rentId: { $in: rentIds } })
    ]);

    const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'N/A';
    
    const calculateExpiry = (startDate, durationDays) => {
      if (!startDate || !durationDays) return 'N/A';
      const expiry = new Date(startDate);
      expiry.setDate(expiry.getDate() + Number(durationDays));
      return formatDate(expiry);
    };

    const enhancedRequests = requests.map(request => {
      const property = properties.find(p => p.rentId === request.rentId) || {};
      const userPlan = plans.find(p =>
        Array.isArray(p.phoneNumber)
          ? p.phoneNumber.includes(request.phoneNumber)
          : p.phoneNumber === request.phoneNumber
      );
      const propertyBill = bills.find(b =>
        b.rentId === request.rentId || b.ownerPhone === request.phoneNumber
      );
      const propertyFollowups = followups
        .filter(f => String(f.rentId) === String(request.rentId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const planDetails = userPlan ? {
        planName: userPlan.name || 'N/A',
        planType: userPlan.packageType || 'N/A',
        planCreatedAt: formatDate(userPlan.createdAt),
        planDuration: `${userPlan.durationDays || 0} days`,
        planExpiry: calculateExpiry(userPlan.createdAt, userPlan.durationDays),
        planCreatedBy: userPlan.createdBy || 'System'
      } : {
        planName: 'No Plan',
        planType: 'N/A',
        planCreatedAt: 'N/A',
        planDuration: '0 days',
        planExpiry: 'N/A',
        planCreatedBy: 'N/A'
      };

      const billDetails = propertyBill ? {
        billNo: propertyBill.billNo || 'N/A',
        billAmount: propertyBill.amount || 'N/A',
        billDate: formatDate(propertyBill.billDate),
        billExpiry: calculateExpiry(propertyBill.billDate, propertyBill.validity),
        billCreatedAt: formatDate(propertyBill.createdAt),
        billCreatedBy: propertyBill.createdBy || 'Admin',
        billStatus: propertyBill.status || 'N/A'
      } : {
        billNo: 'N/A',
        billAmount: 'N/A',
        billDate: 'N/A',
        billExpiry: 'N/A',
        billCreatedAt: 'N/A',
        billCreatedBy: 'N/A',
        billStatus: 'N/A'
      };

      const latestFollowup = propertyFollowups[0] || {};
      const followupDetails = {
        lastFollowupAt: formatDate(latestFollowup.createdAt),
        lastFollowupBy: latestFollowup.adminName || 'N/A',
        followupStatus: latestFollowup.status || 'N/A',
        remarks: latestFollowup.remarks || 'N/A'
      };

      return {
        _id: request._id,
        ra_status: request.ra_status,
        createdAt: formatDate(request.createdAt),

        phoneNumber: request.phoneNumber,

        property: {
          rentId: request.rentId,
          type: property.propertyType || 'N/A',
          price: property.price || 'N/A',
          status: property.status || 'N/A'
        },

        plan: planDetails,
        bill: billDetails,
        followup: followupDetails
      };
    });

    const statusCounts = requests.reduce((acc, req) => {
      acc[req.ra_status] = (acc[req.ra_status] || 0) + 1;
      return acc;
    }, {});

    const response = {
      success: true,
      message: phoneNumber
        ? `Buyer assistance data for ${phoneNumber}`
        : "All buyer assistance records",
      stats: {
        total: requests.length,
        ...statusCounts,
        raActive: statusCounts.raActive || 0
      },
      data: enhancedRequests
    };

    res.status(200).json(response);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch buyer assistance data",
      error: error.message
    });
  }
});


router.get("/get-buyerAssistance", async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // 1. Fetch buyer assistance requests
    const requests = await BuyerAssistance.find({ phoneNumber });

    // 2. Get ALL payments for this phone number
    const allPayments = await PaymentPayUBuyer.find({ 
      phone: phoneNumber
    }).sort({ createdAt: -1 }).lean();

    // 3. Get ALL active plans
    const activePlans = await BuyerPlan.find({ status: 'active' }).sort({ createDate: -1 });

    // 4. Process each buyer assistance request
    const requestsWithPlanDetails = await Promise.all(
      requests.map(async (request) => {
        const Ra_Id = request.Ra_Id;
        
        // Find latest payment for this Ra_Id
        const paymentsForRaId = allPayments.filter(payment => payment.Ra_Id === Ra_Id);
        const latestPayment = paymentsForRaId.length > 0 ? paymentsForRaId[0] : null;
        
        let planDetails = {
          planName: "No Plan Selected",
          planCreatedAt: "N/A",
          durationDays: 0,
          planExpiryDate: "N/A",
          packageType: "N/A",
          paymentStatus: "Not Selected",
          isActive: false,
          planAmount: "0",
          numberOfAssistants: "0"
        };

        if (latestPayment) {
          // Find matching plan
          let matchingPlan = activePlans.find(plan => 
            plan.planName === latestPayment.planName
          );

          // If no exact match, try to find any plan that has this Ra_Id
          if (!matchingPlan) {
            matchingPlan = activePlans.find(plan =>
              plan.phoneNumbers.some(entry => entry.Ra_Id === Ra_Id)
            );
          }

          if (matchingPlan) {
            planDetails.planName = matchingPlan.planName;
            planDetails.packageType = matchingPlan.serviceType || "Rental";
            planDetails.planAmount = matchingPlan.planAmount;
            planDetails.numberOfAssistants = matchingPlan.numberOfAssistants;
            planDetails.durationDays = parseInt(matchingPlan.planValidity, 10) || 0;
          } else {
            planDetails.planName = latestPayment.planName || "Unknown Plan";
            planDetails.planAmount = latestPayment.amount || "0";
          }

          // Set payment status and dates for paid payments
          if (latestPayment.payustatususer === 'paid' && latestPayment.payUdate) {
            const validityDays = planDetails.durationDays || 30;
            const payUdate = new Date(latestPayment.payUdate);
            const expiryDate = new Date(payUdate.getTime() + validityDays * 24 * 60 * 60 * 1000);
            const now = new Date();
            const isExpired = expiryDate < now;

            planDetails.planCreatedAt = payUdate.toLocaleDateString();
            planDetails.planExpiryDate = expiryDate.toLocaleDateString();
            planDetails.paymentStatus = isExpired ? "Expired" : "Active";
            planDetails.isActive = !isExpired;
          } else {
            planDetails.paymentStatus = latestPayment.payustatususer === 'pay later' ? "Payment Pending" : "Not Paid";
            planDetails.isActive = false;
          }
        }

        return {
          ...request.toObject(),
          planDetails
        };
      })
    );

    // 5. Response
    res.status(200).json({
      message: `Buyer Assistance requests and Plan details fetched for ${phoneNumber}`,
      summary: {
        totalRequests: requests.length,
        activePlans: requestsWithPlanDetails.filter(req => req.planDetails.isActive).length,
        paidPlans: requestsWithPlanDetails.filter(req => req.planDetails.paymentStatus === "Active").length,
        pendingPlans: requestsWithPlanDetails.filter(req => req.planDetails.paymentStatus === "Payment Pending").length
      },
      data: requestsWithPlanDetails,
    });
  } catch (error) {
    console.error("Error in /get-buyerAssistance:", error);
    res.status(500).json({
      message: "Error fetching Buyer Assistance requests by phone number",
      error: error.message,
    });
  }
});




// ✅ Soft Delete by _id
router.put("/delete-buyer-assistances/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAssistance = await BuyerAssistance.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!deletedAssistance) {
      return res.status(404).json({ message: "Buyer Assistance request not found" });
    }

    res.status(200).json({
      message: "Buyer Assistance request deleted successfully",
      data: deletedAssistance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// ✅ Undo Soft Delete by _id
router.put("/undo-delete-buyer-assistances/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const restoredAssistance = await BuyerAssistance.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!restoredAssistance) {
      return res.status(404).json({ message: "Buyer Assistance request not found" });
    }

    res.status(200).json({
      message: "Buyer Assistance request restored successfully",
      data: restoredAssistance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// ✅ PUT: Update Buyer Assistance by Ra_Id (Number)
router.put("/update-buyer-assistance/:Ra_Id", async (req, res) => {
  try {
    const raId = Number(req.params.Ra_Id); // Convert to Number

    if (isNaN(raId)) {
      return res.status(400).json({ message: "Invalid Ra_Id. Must be a number." });
    }

    const updates = { ...req.body };
    // Keep the city base (PY/CH) in sync. PY/CH-scoped admins force
    // their own city on every save; ALL admins only re-derive from the
    // address if this edit actually changes it.
    const adminScope = normalizeBase(req.query && req.query.base);
    if (adminScope === 'PY' || adminScope === 'CH') {
      updates.base = adminScope;
    } else if (updates.city !== undefined || updates.district !== undefined) {
      updates.base = resolveBaseFromAddress(updates);
    }

    const updatedRequest = await BuyerAssistance.findOneAndUpdate(
      { Ra_Id: raId },      // Match using Ra_Id
      updates,              // Apply updates
      { new: true }         // Return updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Buyer Assistance request not found" });
    }

    res.status(200).json({
      message: "Buyer Assistance request updated successfully!",
      data: updatedRequest
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating Buyer Assistance request", error });
  }
});



// Update Buyer Assistance using Phone Number
router.put("/update-buyerAssistance-phone/:phoneNumber", async (req, res) => {
  try {
    const updatedRequest = await BuyerAssistance.findOneAndUpdate(
      { phoneNumber: req.params.phoneNumber },
      req.body,
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({ message: "Buyer Assistance request updated successfully!", data: updatedRequest });
  } catch (error) {
    res.status(500).json({ message: "Error updating Buyer Assistance request", error });
  }
});

router.post('/contact-buyer-send-rent', async (req, res) => {
  const { phoneNumber, Ra_Id } = req.body;

  try {
    const buyer = await BuyerAssistance.findOne({ Ra_Id });

    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer entry not found' });
    }

    const updatedBuyer = await BuyerAssistance.findOneAndUpdate(
      { Ra_Id },
      {
        $set: { callStatus: 'contacted', updatedAt: new Date() },
        $push: { callLogs: { phoneNumber, createdAt: new Date() } }
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Buyer contacted successfully!',
      buyerDetails: {
        buyerName: updatedBuyer.raName,
        phoneNumber: updatedBuyer.phoneNumber,
        rentId: updatedBuyer.rentId,
        status: updatedBuyer.callStatus
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

router.get("/rent-assistance-interests-phone-rent", async (req, res) => {
  try {
    const { phone } = req.query;
    const filter = { ra_status: "rent-assistance-interest" };
    if (phone) filter.interestedUserPhone = phone;

    const assistanceInterests = await BuyerAssistance.find(filter);

    if (!assistanceInterests.length) {
      return res.status(404).json({ message: "No buyer assistance interests found" });
    }

    res.status(200).json({
      message: "Buyer assistance interests fetched successfully",
      data: assistanceInterests,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/rent-assistance-interests-phone-rent/count", async (req, res) => {
  try {
    const { phone } = req.query;
    const filter = { ra_status: "rent-assistance-interest" };
    if (phone) filter.interestedUserPhone = phone;

    const count = await BuyerAssistance.countDocuments(filter);

    res.status(200).json({
      message: "Buyer assistance interest count fetched successfully",
      count,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


router.get("/fetch-all-data-rent/:buyerId", async (req, res) => {
  try {
    const { buyerId } = req.params;

    const buyerRequest = await BuyerAssistance.findById(buyerId);
    if (!buyerRequest) {
      return res.status(404).json({ success: false, message: "Buyer request not found" });
    }

    let query = {
      propertyType: buyerRequest.propertyType,
      propertyMode: buyerRequest.propertyMode,
      city: buyerRequest.city,
      area: buyerRequest.area,
      rentalAmount: {
        $gte: buyerRequest.minPrice ? parseInt(buyerRequest.minPrice) : 0,
        $lte: buyerRequest.maxPrice ? parseInt(buyerRequest.maxPrice) : Infinity,
      },
    };

    // Clean null/undefined values
    Object.keys(query).forEach((key) => {
      if (!query[key]) delete query[key];
    });

    const matchedProperties = await AddModel.find(query).select(
      "rentId rentalAmount phoneNumber propertyMode propertyType city area"
    );

    return res.json({ success: true, message: "Matched properties fetched successfully!", matchedProperties });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});


router.get("/matched-properties-by-phone-rent/:phoneNumber", async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    // 🔹 Find the buyer's request using phoneNumber
    const buyerRequest = await BuyerAssistance.findOne({ phoneNumber });
    if (!buyerRequest) {
      return res.status(404).json({ success: false, message: "Buyer request not found" });
    }

    // 🔹 Construct search query based on buyer preferences
    const query = {
      propertyType: buyerRequest.propertyType,
      propertyMode: buyerRequest.propertyMode,
      city: buyerRequest.city,
      state: buyerRequest.state,
      area: buyerRequest.area,
      rentalAmount: {
        $gte: buyerRequest.minPrice ? parseInt(buyerRequest.minPrice) : 0,
        $lte: buyerRequest.maxPrice ? parseInt(buyerRequest.maxPrice) : Infinity,
      },
      bedrooms: buyerRequest.bedrooms,
    };

    // 🔹 Remove undefined/null fields
    Object.keys(query).forEach((key) => {
      if (!query[key]) delete query[key];
    });

    // 🔹 Fetch matching properties
    const matchedProperties = await AddModel.find(query);

    return res.json({ success: true, buyerId: buyerRequest._id, matchedProperties });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.post('/get-matched-property-rent', async (req, res) => {
  try {
    const { Ra_Id, phoneNumber } = req.body;

    if (!Ra_Id && !phoneNumber) {
      return res.status(400).json({ success: false, message: "Either Ra_Id or phoneNumber must be provided" });
    }

    // Fetch Buyer Assistance data
    let buyerAssistance = null;
    if (Ra_Id) {
      buyerAssistance = await BuyerAssistance.findOne({ Ra_Id });
    } else if (phoneNumber) {
      buyerAssistance = await BuyerAssistance.findOne({ phoneNumber });
    }

    if (!buyerAssistance) {
      return res.status(404).json({ success: false, message: "Buyer Assistance data not found" });
    }

    // Find matching property posted by the same phone number
    const matchedProperty = await AddModel.findOne({ phoneNumber: buyerAssistance.phoneNumber });

    if (!matchedProperty) {
      return res.status(404).json({ success: false, message: "Property not found for this buyer" });
    }

    return res.status(200).json({
      success: true,
      message: "Matched property found",
      matchedBuyerAssistance: {
        Ra_Id: buyerAssistance.Ra_Id,
        raName: buyerAssistance.raName,
        phoneNumber: buyerAssistance.phoneNumber,
        city: buyerAssistance.city,
        area: buyerAssistance.area,
        minPrice: buyerAssistance.minPrice,
        maxPrice: buyerAssistance.maxPrice,
        propertyType: buyerAssistance.propertyType,
        propertyMode: buyerAssistance.propertyMode,
      },
      matchedProperty: {
        rentId: matchedProperty.rentId,
        rentalAmount: matchedProperty.rentalAmount,
        status: matchedProperty.status,
        // Optional fields (only if exist in AddModel schema)
        areaUnit: matchedProperty.areaUnit,
        totalArea: matchedProperty.totalArea,
        propertyMode: matchedProperty.propertyMode,
        propertyType: matchedProperty.propertyType,
        facing: matchedProperty.facing,
        city: matchedProperty.city,
        district: matchedProperty.district,
        area: matchedProperty.area,
        email: matchedProperty.email,
        phoneNumber: matchedProperty.phoneNumber,
        ownerName: matchedProperty.ownerName,
        photos: matchedProperty.photos,
        video: matchedProperty.video,
        createdAt: matchedProperty.createdAt,
        updatedAt: matchedProperty.updatedAt,
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});


router.get("/buyer-assistance-count-rent", async (req, res) => {
  try {
    const count = await BuyerAssistance.countDocuments();
    res.status(200).json({
      message: "Total buyer assistance count fetched successfully",
      count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching buyer assistance count",
      error: error.message,
    });
  }
});



router.get("/get-buyer-id-rent/:phoneNumber", async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    const buyer = await BuyerAssistance.findOne({ phoneNumber });

    if (!buyer) {
      return res.status(404).json({ success: false, message: "Buyer not found" });
    }

    return res.json({ success: true, buyerId: buyer._id });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/buyer-assistance-with-payment-rent/:phoneNumber", async (req, res) => {
  const { phoneNumber } = req.params;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    const normalizedPhone = phoneNumber
      .replace(/[\s-]/g, "")
      .replace(/^(\+91|91|0)/, "")
      .trim();

    const buyerAssistances = await BuyerAssistance.find({
      phoneNumber: new RegExp(`${normalizedPhone}$`, "i"),
    });

    if (!buyerAssistances.length) {
      return res.status(404).json({ message: "No Buyer Assistance requests found for this phone number" });
    }

    const payments = await PaymentPayUBuyer.find().sort({ createdAt: -1 });

    const latestStatusByRaId = {};
    for (let payment of payments) {
      if (payment.Ra_Id && !latestStatusByRaId[payment.Ra_Id]) {
        latestStatusByRaId[payment.Ra_Id] = payment.payustatususer.toLowerCase();
      }
    }

    const mergedData = buyerAssistances.map((ba) => {
      const status = latestStatusByRaId[ba.Ra_Id] || "pay now";
      return {
        Ra_Id: ba.Ra_Id,
        raName: ba.raName,
        phoneNumber: ba.phoneNumber,
        city: ba.city,
        area: ba.area,
        minPrice: ba.minPrice,
        maxPrice: ba.maxPrice,
        propertyMode: ba.propertyMode,
        propertyType: ba.propertyType,
        facing: ba.facing, // Ensure 'facing' exists in AddModel if used
        ra_status: ba.ra_status,
        createdAt: ba.createdAt,
        updatedAt: ba.updatedAt,
        payustatususer: status,
        showPayNowButton: status !== "paid"
      };
    });

    res.status(200).json({
      message: "Buyer Assistance data with payment status fetched successfully",
      phoneNumber,
      data: mergedData,
    });
  } catch (error) {
    console.error("Error fetching merged Buyer Assistance and payment data:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


router.get("/get-buyerAssistances-rent", async (req, res) => {
  try {
    const requests = await BuyerAssistance.find({ ra_status: "raActive" });

    res.status(200).json({
      message: "All 'raActive' Buyer Assistance requests fetched successfully!",
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Buyer Assistance requests", error });
  }
});

router.get("/get-buyerAssistance-all-plans-rent", async (req, res) => {
  try {
    // 1. Fetch all Buyer Assistance requests
    const requests = await BuyerAssistance.find();

    // 2. Unique phone numbers from BuyerAssistance
    const phoneNumbers = [...new Set(requests.map(req => req.phoneNumber))];

    // 3. Fetch pricing plans by phone numbers
    const plans = await PricingPlans.find({ phoneNumber: { $in: phoneNumbers } });

    // 4. Map of phoneNumber => Plan Details
    const planMap = {};
    plans.forEach(plan => {
      const expiryDate = new Date(plan.createdAt);
      expiryDate.setDate(expiryDate.getDate() + (plan.durationDays || 0));
      planMap[plan.phoneNumber] = {
        planName: plan.name || 'N/A',
        planCreatedAt: plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : 'N/A',
        durationDays: plan.durationDays || 0,
        planExpiryDate: expiryDate.toLocaleDateString(),
        packageType: plan.packageType || 'N/A',
      };
    });

    // 5. Merge plan details into BuyerAssistance
    const enrichedData = requests.map(req => ({
      ...req._doc,
      planDetails: planMap[req.phoneNumber] || {
        planName: 'N/A',
        planCreatedAt: 'N/A',
        durationDays: 0,
        planExpiryDate: 'N/A',
        packageType: 'N/A',
      }
    }));

    res.status(200).json({
      message: "All Buyer Assistance requests with plan details fetched",
      data: enrichedData,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching all Buyer Assistance requests",
      error: error.message,
    });
  }
});

router.get("/get-user-buyerAssistance-count-rent/:phoneNumber", async (req, res) => {
  const { phoneNumber } = req.params;

  try {
    const count = await BuyerAssistance.countDocuments({
      phoneNumber: { $exists: true, $eq: phoneNumber },
    });

    res.status(200).json({
      message: `Buyer Assistance request count fetched for phone number: ${phoneNumber}`,
      count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Buyer Assistance request count by phone number",
      error,
    });
  }
});

router.get("/get-user-buyerAssistance-rent/:phoneNumber", async (req, res) => {
  const { phoneNumber } = req.params;

  try {
    const requests = await BuyerAssistance.find({ phoneNumber });
    res.status(200).json({
      message: `Buyer Assistance requests fetched for phone number: ${phoneNumber}`,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Buyer Assistance requests by phone number",
      error,
    });
  }
});


// ✅ GET: All Buyer Assistance requests with 'raActive' status + plan details
router.get("/raActive-buyerAssistance-all-plans-rent", async (req, res) => {
  try {
    // Step 1: Find all buyer assistance requests with ra_status = "raActive",
    // restricted to the active city base (PY/CH) so the tenant tickers on
    // /pondicherry and /chennai only count that city's tenants.
    const requests = await BuyerAssistance.find({ ra_status: "raActive", ...baseFilter(req.query.base) });

    // Step 2: Extract unique Ra_Ids from the requests
    const raIds = requests.map(req => req.Ra_Id);

    // Step 3: Fetch all paid payments for these Ra_Ids
    const paidPayments = await PaymentPayUBuyer.find({ 
      Ra_Id: { $in: raIds },
      payustatususer: 'paid'
    }).sort({ createdAt: -1 });

    // Step 4: Fetch all active plans to match with paid payments
    const activePlans = await BuyerPlan.find({ status: 'active' });

    // Step 5: Create a map of Ra_Id => latest paid payment
    const paymentMap = {};
    paidPayments.forEach(payment => {
      if (!paymentMap[payment.Ra_Id] || new Date(payment.createdAt) > new Date(paymentMap[payment.Ra_Id].createdAt)) {
        paymentMap[payment.Ra_Id] = payment;
      }
    });

    // Step 6: Create a map of plan names to plan details
    const planDetailsMap = {};
    activePlans.forEach(plan => {
      planDetailsMap[plan.planName] = {
        planName: plan.planName,
        planAmount: plan.planAmount,
        planValidity: plan.planValidity,
        numberOfAssistants: plan.numberOfAssistants,
        serviceType: plan.serviceType
      };
    });

    // Step 7: Merge plan details into each buyer assistance request
    const enrichedData = requests.map(req => {
      const paidPayment = paymentMap[req.Ra_Id];
      
      let planDetails = {
        planName: "No Active Plan",
        planCreatedAt: "N/A",
        durationDays: 0,
        planExpiryDate: "N/A",
        packageType: "N/A",
        paymentStatus: "Not Paid",
        isActive: false
      };

      if (paidPayment) {
        // Find matching plan from active plans
        let matchingPlan = activePlans.find(plan => 
          plan.planName === paidPayment.planName
        );

        // If no exact match, try to find any plan that has this Ra_Id in phoneNumbers
        if (!matchingPlan) {
          matchingPlan = activePlans.find(plan =>
            plan.phoneNumbers.some(entry => entry.Ra_Id === req.Ra_Id)
          );
        }

        if (matchingPlan) {
          const validityDays = parseInt(matchingPlan.planValidity, 10) || 30;
          const payUdate = new Date(paidPayment.payUdate);
          const expiryDate = new Date(payUdate.getTime() + validityDays * 24 * 60 * 60 * 1000);
          const now = new Date();
          const isExpired = expiryDate < now;

          planDetails = {
            planName: matchingPlan.planName,
            planCreatedAt: payUdate.toLocaleDateString(),
            durationDays: validityDays,
            planExpiryDate: expiryDate.toLocaleDateString(),
            packageType: matchingPlan.serviceType || "Rental",
            paymentStatus: isExpired ? "Expired" : "Active",
            isActive: !isExpired,
            planAmount: matchingPlan.planAmount,
            numberOfAssistants: matchingPlan.numberOfAssistants,
            payUdate: paidPayment.payUdate,
            paymentId: paidPayment._id
          };
        } else {
          // Use payment data if no matching plan found
          const validityDays = 30; // Default
          const payUdate = new Date(paidPayment.payUdate);
          const expiryDate = new Date(payUdate.getTime() + validityDays * 24 * 60 * 60 * 1000);
          const now = new Date();
          const isExpired = expiryDate < now;

          planDetails = {
            planName: paidPayment.planName,
            planCreatedAt: payUdate.toLocaleDateString(),
            durationDays: validityDays,
            planExpiryDate: expiryDate.toLocaleDateString(),
            packageType: "Rental",
            paymentStatus: isExpired ? "Expired" : "Active",
            isActive: !isExpired,
            planAmount: paidPayment.amount,
            numberOfAssistants: "1",
            payUdate: paidPayment.payUdate,
            paymentId: paidPayment._id
          };
        }
      }

      return {
        ...req._doc,
        planDetails
      };
    });

    // Step 8: Calculate summary statistics
    const totalRequests = enrichedData.length;
    const activePlansCount = enrichedData.filter(req => req.planDetails.isActive).length;
    const paidPlansCount = enrichedData.filter(req => req.planDetails.paymentStatus === "Active").length;
    const expiredPlansCount = enrichedData.filter(req => req.planDetails.paymentStatus === "Expired").length;

    // Step 9: Respond
    res.status(200).json({
      message: "All 'raActive' Buyer Assistance requests with plan details fetched successfully",
      summary: {
        totalRequests,
        activePlans: activePlansCount,
        paidPlans: paidPlansCount,
        expiredPlans: expiredPlansCount
      },
      data: enrichedData,
    });

  } catch (error) {
    console.error("Error in /raActive-buyerAssistance-all-plans-rent:", error);
    res.status(500).json({
      message: "Error fetching Buyer Assistance requests",
      error: error.message,
    });
  }
});



// Get count of Buyer Assistance Requests by Phone Number
router.get("/count-buyerAssistance/:phoneNumber", async (req, res) => {
  const { phoneNumber } = req.params;

  try {
    const count = await BuyerAssistance.countDocuments({ phoneNumber });
    res.status(200).json({
      message: `Buyer Assistance request count fetched for phone number: ${phoneNumber}`,
      count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Buyer Assistance request count by phone number",
      error,
    });
  }
});

// ✅ GET: Count of Buyer Assistance requests for a phone number
router.get("/count-buyerAssistance-rent/:phoneNumber", async (req, res) => {
  const { phoneNumber } = req.params;

  try {
    const count = await BuyerAssistance.countDocuments({ phoneNumber });

    res.status(200).json({
      message: `Buyer Assistance request count fetched for phone number: ${phoneNumber}`,
      count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Buyer Assistance request count",
      error: error.message,
    });
  }
});

router.put("/update-buyerAssistance-by-RaId-rent/:Ra_Id", async (req, res) => {
  try {
    const raId = Number(req.params.Ra_Id);
    if (isNaN(raId)) {
      return res.status(400).json({ message: "Invalid Ra_Id. Must be a number." });
    }

    const updatedRequest = await BuyerAssistance.findOneAndUpdate(
      { Ra_Id: raId },
      req.body,
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Buyer Assistance request not found by Ra_Id." });
    }

    res.status(200).json({
      message: "Buyer Assistance request updated successfully using Ra_Id.",
      data: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating Buyer Assistance request by Ra_Id",
      error,
    });
  }
});


router.put("/update-buyerAssistance-rent/:id", async (req, res) => {
  try {
    // Preserve the original `addedBy` (who first added the assistance) — edits
    // by other admins shouldn't overwrite the creator credit.
    const { addedBy, ...rest } = req.body;
    // Keep the city base (PY/CH) in sync. PY/CH-scoped admins force
    // their own city on every save; ALL admins only re-derive from the
    // address if this edit actually changes it.
    const adminScopeEdit = normalizeBase(req.query && req.query.base);
    if (adminScopeEdit === 'PY' || adminScopeEdit === 'CH') {
      rest.base = adminScopeEdit;
    } else if (rest.city !== undefined || rest.district !== undefined) {
      rest.base = resolveBaseFromAddress(rest);
    }
    const updatedRequest = await BuyerAssistance.findByIdAndUpdate(
      req.params.id,
      rest,
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Buyer Assistance request not found by ID." });
    }

    res.status(200).json({
      message: "Buyer Assistance request updated successfully using _id.",
      data: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating Buyer Assistance request by ID",
      error,
    });
  }
});

router.delete("/delete-buyerAssistance-rent/:id", async (req, res) => {
  try {
    const deletedRequest = await BuyerAssistance.findByIdAndDelete(req.params.id);

    if (!deletedRequest) {
      return res.status(404).json({ message: "Buyer Assistance request not found for deletion." });
    }

    res.status(200).json({
      message: "Buyer Assistance request deleted successfully.",
      data: deletedRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting Buyer Assistance request",
      error,
    });
  }
});


router.put("/update-buyerAssistance-phone-rent/:phoneNumber", async (req, res) => {
  try {
    const updatedRequest = await BuyerAssistance.findOneAndUpdate(
      { phoneNumber: req.params.phoneNumber },
      req.body,
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: "Buyer Assistance request not found" });
    }
    res.status(200).json({
      message: "Buyer Assistance request updated successfully!",
      data: updatedRequest
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating Buyer Assistance request", error });
  }
});


router.get("/fetch-matched-properties-rent", async (req, res) => {
  try {
    const { Ra_Id } = req.query;

    if (!Ra_Id) {
      return res.status(400).json({ message: "Ra_Id is required" });
    }

    const buyerRequest = await BuyerAssistance.findOne({ Ra_Id: Number(Ra_Id) });

    if (!buyerRequest) {
      return res.status(404).json({ message: "No Buyer Assistance request found for this Ra_Id" });
    }

    const {
      phoneNumber: buyerPhoneNumber,
      propertyMode,
      propertyType,
      minPrice,
      maxPrice,
      state
    } = buyerRequest;

    const priceQuery = {
      $gte: parseInt(minPrice) || 0,
      $lte: parseInt(maxPrice) || 999999999
    };

    // 🔍 Buyer-Matched (properties posted by this buyer)
    const buyerMatchedProperties = await AddModel.find({
      phoneNumber: buyerPhoneNumber,
      propertyMode,
      propertyType,
      state,
      rentalAmount: priceQuery,
      status: { $in: ["active", "incomplete"] }
    });

    // 🔍 Owner-Matched (properties posted by other users)
    const ownerMatchedProperties = await AddModel.find({
      propertyMode,
      propertyType,
      state,
      rentalAmount: priceQuery,
      status: { $in: ["active", "incomplete"] }
    });

    res.status(200).json({
      message: "Matching properties fetched successfully!",
      buyerMatchedProperties,
      ownerMatchedProperties
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


router.get("/fetch-matching-property-rent", async (req, res) => {
  try {
    const { Ra_Id } = req.query;

    if (!Ra_Id) {
      return res.status(400).json({ message: "Ra_Id is required" });
    }

    const buyerRequest = await BuyerAssistance.findOne({ Ra_Id: Number(Ra_Id) });

    if (!buyerRequest) {
      return res.status(404).json({ message: "No Buyer Assistance request found for this Ra_Id" });
    }

    const {
      propertyMode,
      propertyType,
      minPrice,
      maxPrice,
      state
    } = buyerRequest;

    const query = {
      propertyMode,
      propertyType,
      state,
      rentalAmount: {
        $gte: parseInt(minPrice) || 0,
        $lte: parseInt(maxPrice) || 999999999
      }
    };

    const matchingProperties = await AddModel.find(query);

    if (!matchingProperties.length) {
      return res.status(404).json({ message: "No matching properties found" });
    }

    res.status(200).json({
      message: "Matching properties fetched successfully!",
      data: matchingProperties
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/rent-assistance-interests", async (req, res) => {
  try {
    const assistanceInterests = await BuyerAssistance.find({ ra_status: "rent-assistance-interest" });

    if (!assistanceInterests.length) {
      return res.status(404).json({ message: "No buyer assistance interests found" });
    }

    res.status(200).json({
      message: "Buyer assistance interests fetched successfully",
      data: assistanceInterests,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/update-status-buyer-assistance-rent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ra_status, userPhoneNumber } = req.body;

    if (!ra_status || !userPhoneNumber) {
      return res.status(400).json({ message: "Status and user phone number are required" });
    }

    if (!["rent-assistance-interest"].includes(ra_status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const normalizedUserPhone = userPhoneNumber.replace(/\D/g, "").slice(-10);

    // 🔁 Update ra_status and push to interestedUserPhone array
    const updatedAssistance = await BuyerAssistance.findByIdAndUpdate(
      id,
      {
        ra_status,
        $addToSet: { interestedUserPhone: normalizedUserPhone },
      },
      { new: true }
    );

    if (!updatedAssistance) {
      return res.status(404).json({ message: "Buyer Assistance not found" });
    }

    res.status(200).json({
      message: `Buyer Assistance status updated to '${ra_status}' successfully!`,
      data: updatedAssistance,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


router.get("/fetch-buyer-matched-properties-by-phone-rent", async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const normalizedPhone = phoneNumber.replace(/\D/g, "").slice(-10);

    // 🔹 Step 1: Fetch properties posted by the user
    const ownerProperties = await AddModel.find({
      $or: [
        { phoneNumber: normalizedPhone },
        { phoneNumber: `+91${normalizedPhone}` },
      ]
    });

    if (!ownerProperties.length) {
      return res.status(404).json({ message: "No properties found for this user" });
    }

    // 🔹 Step 2: Extract matching criteria from each property
    const propertyConditions = ownerProperties.map(property => ({
      propertyMode: property.propertyMode,
      propertyType: property.propertyType,
      state: property.state,
      minPrice: { $lte: property.rentalAmount },
      maxPrice: { $gte: property.rentalAmount },
    }));

    // 🔹 Step 3: Find Buyer Assistance requests that match and exclude same phone number
    const matchedBuyerRequests = await BuyerAssistance.find({
      $or: propertyConditions,
      phoneNumber: { $ne: normalizedPhone },
    });

    res.status(200).json({
      message: "Buyer-Matched Assistance Requests fetched successfully!",
      matchedBuyerRequests,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


router.get("/fetch-matched-datas-buyer-rent", async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Buyer Assistance phone number is required" });
    }

    const normalizedPhone = phoneNumber.replace(/\D/g, "").slice(-10);

    const buyerRequests = await BuyerAssistance.find({
      phoneNumber: { $regex: new RegExp(`${normalizedPhone}$`, "i") }
    });

    if (!buyerRequests.length) {
      return res.status(404).json({ message: "No Buyer Assistance requests found for this phone number" });
    }

    const matchedData = [];

    for (let buyerRequest of buyerRequests) {
      const {
        Ra_Id,
        raName,
        phoneNumber,
        minPrice,
        maxPrice,
        propertyType,
        propertyMode,
        paymentType,
        state
      } = buyerRequest;

      const matchedProperties = await AddModel.find({
        propertyMode,
        propertyType,
        state,
        rentalAmount: {
          $gte: Number(minPrice),
          $lte: Number(maxPrice),
        },
      });

      if (matchedProperties.length > 0) {
        matchedData.push({
          buyerAssistanceCard: {
            _id: buyerRequest._id,
            Ra_Id,
            name: raName,
            phoneNumber,
            minPrice,
            maxPrice,
            propertyType,
            propertyMode,
            paymentType,
            state
          },
          matchedProperties: matchedProperties.map((property) => ({
            rentId: property.rentId,
            postedByUser: property.phoneNumber,
            rentalAmount: property.rentalAmount,
            state: property.state,
            propertyType: property.propertyType,
            bedrooms: property.bedrooms,
            totalArea: property.totalArea,
            areaUnit: property.areaUnit,
            postedBy: property.postedBy,
            createdAt: property.createdAt
          })),
        });
      }
    }

    if (!matchedData.length) {
      return res.status(404).json({ message: "No matched properties found" });
    }

    res.status(200).json({
      message: "Matched Data Fetched Successfully!",
      totalMatches: matchedData.length,
      data: matchedData,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});



// ✅ Fetch Buyer Assistance request using Ra_Id
router.get("/fetch-buyerAssistance-rent/:Ra_Id", async (req, res) => {
  const { Ra_Id } = req.params; // ✅ Correctly destructure param

  // Validate
  if (!Ra_Id) {
    return res.status(400).json({ message: "RA ID is required" });
  }

  try {
    // ✅ Query by Ra_Id (converted to Number)
    const request = await BuyerAssistance.findOne({ Ra_Id: Number(Ra_Id) });

    if (!request) {
      return res.status(404).json({ message: "Buyer Assistance request not found" });
    }

    // ✅ Success response
    res.status(200).json({
      message: "Buyer Assistance request fetched successfully!",
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Buyer Assistance request",
      error: error.message,
    });
  }
});



// Utility function to normalize phone numbers (if not already defined)
const normalizePhone = (phone) => phone.replace(/\D/g, "").slice(-10);

router.get("/fetch-matched-datas-buyer-payment-rent", async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({
        message: "Buyer Assistance phone number is required",
      });
    }

    const normalizedPhone = normalizePhone(phoneNumber);

    // ✅ Fetch Buyer Assistance requests by normalized phone
    const buyerRequests = await BuyerAssistance.find({
      phoneNumber: { $regex: new RegExp(`${normalizedPhone}$`, "i") },
    });

    if (!buyerRequests.length) {
      return res.status(404).json({
        message: "No Buyer Assistance requests found for this phone number",
      });
    }

    const matchedData = [];

    for (const buyerRequest of buyerRequests) {
      // ✅ Payment status lookup using Ra_Id
      const paymentData = await PaymentPayUBuyer.findOne({ Ra_Id: buyerRequest.Ra_Id });
      const payustatususer = (paymentData?.payustatususer || "unpaid").toLowerCase();

      // ✅ Match AddModel properties using rentalAmount instead of price
      const matchedProperties = await AddModel.find({
        propertyMode: buyerRequest.propertyMode,
        propertyType: buyerRequest.propertyType,
        state: buyerRequest.state,
        rentalAmount: {
          $gte: Number(buyerRequest.minPrice),
          $lte: Number(buyerRequest.maxPrice),
        },
      });

      if (matchedProperties.length > 0) {
        matchedData.push({
          buyerAssistanceCard: {
            _id: buyerRequest._id,
            Ra_Id: buyerRequest.Ra_Id,
            name: buyerRequest.raName,
            phoneNumber: buyerRequest.phoneNumber,
            minPrice: buyerRequest.minPrice,
            maxPrice: buyerRequest.maxPrice,
            propertyType: buyerRequest.propertyType,
            propertyMode: buyerRequest.propertyMode,
            paymentType: buyerRequest.paymentType,
            state: buyerRequest.state,
            payustatususer, // from PayU
          },
          matchedProperties: matchedProperties.map((property) => ({
            rentId: property.rentId, // ✅ changed from ppcId to rentId
            postedByUser: property.phoneNumber,
            rentalAmount: property.rentalAmount,
            state: property.state,
            propertyType: property.propertyType,
            bedrooms: property.bedrooms,
            totalArea: property.totalArea,
            areaUnit: property.areaUnit,
            postedBy: property.postedBy,
            createdAt: property.createdAt,
          })),
        });
      }
    }

    if (!matchedData.length) {
      return res.status(404).json({ message: "No matched properties found" });
    }

    res.status(200).json({
      message: "Matched Data Fetched Successfully!",
      totalMatches: matchedData.length,
      data: matchedData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


router.get("/fetch-buyer-matched-properties-rent/count", async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const normalizedPhone = phoneNumber.replace(/\D/g, "").slice(-10);

    // 1. Fetch Buyer Assistance requests (by buyer phone)
    const buyerRequests = await BuyerAssistance.find({
      phoneNumber: { $regex: new RegExp(`${normalizedPhone}$`, "i") },
    });

    if (!buyerRequests.length) {
      return res.status(404).json({ message: "No Buyer Assistance requests found" });
    }

    // 2. Create a Set to store unique matched rentIds
    const matchedRentIds = new Set();

    // 3. Loop through each buyer request and match AddModel properties
    for (const buyer of buyerRequests) {
      const matchedProperties = await AddModel.find({
        propertyMode: buyer.propertyMode,
        propertyType: buyer.propertyType,
        state: buyer.state,
        rentalAmount: {
          $gte: Number(buyer.minPrice),
          $lte: Number(buyer.maxPrice),
        },
      });

      for (const property of matchedProperties) {
        matchedRentIds.add(property.rentId); // Ensures uniqueness
      }
    }

    return res.status(200).json({
      message: "Buyer Assistance matches counted successfully!",
      matchedPropertiesCount: matchedRentIds.size, // ✅ should now return 2
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});




router.get("/fetch-matched-data-owner-rent", async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Get all properties posted by the owner
    const properties = await AddModel.find({ phoneNumber });

    if (!properties.length) {
      return res.status(404).json({ message: "No properties found for this owner" });
    }

    const matchedData = [];

    for (let property of properties) {
      // Match buyer assistance requests based on property attributes
      const matchedBuyers = await BuyerAssistance.find({
        propertyMode: property.propertyMode,
        propertyType: property.propertyType,
        state: property.state,
        $expr: {
          $and: [
            { $lte: [{ $toDouble: "$minPrice" }, property.rentalAmount] },
            { $gte: [{ $toDouble: "$maxPrice" }, property.rentalAmount] },
          ]
        }
      });

      if (matchedBuyers.length > 0) {
        matchedData.push({
          propertyDetails: {
            rentId: property.rentId,
            postedByUser: property.phoneNumber,
            rentalAmount: property.rentalAmount,
            state: property.state,
            propertyMode: property.propertyMode,
            propertyType: property.propertyType,
            bedrooms: property.bedrooms,
            totalArea: property.totalArea,
            areaUnit: property.areaUnit,
            postedBy: property.postedBy,
            createdAt: property.createdAt,
            floorNo: property.floorNo,
            views: property.views,
          },
          matchedBuyerRequests: matchedBuyers.map((buyer) => ({
            Ra_Id: buyer.Ra_Id,
            name: buyer.name, // ✅ Corrected from raName
            phoneNumber: buyer.phoneNumber,
            priceRange: `${buyer.minPrice} - ${buyer.maxPrice}`,
            propertyType: buyer.propertyType,
            propertyMode: buyer.propertyMode,
            state: buyer.state,
          })),
        });
      }
    }

    if (!matchedData.length) {
      return res.status(404).json({ message: "No matched buyer assistance requests found" });
    }

    res.status(200).json({
      message: "Buyer-Matched Assistance Requests fetched successfully!",
      totalMatches: matchedData.length,
      data: matchedData,
    });
  } catch (error) {
    console.error("Error fetching matched data:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


router.get("/count-matched-data-owner-rent", async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const properties = await AddModel.find({ phoneNumber });

    if (!properties.length) {
      return res.status(200).json({ totalMatches: 0 });
    }

    let count = 0;

    for (let property of properties) {
      const matchedBuyers = await BuyerAssistance.find({
        propertyMode: property.propertyMode,
        propertyType: property.propertyType,
        state: property.state,
        minPrice: { $lte: property.rentalAmount }, // ✅ use rentalAmount
        maxPrice: { $gte: property.rentalAmount },
      });

      if (matchedBuyers.length > 0) {
        count++;
      }
    }

    return res.status(200).json({
      message: "Matched buyer request count fetched successfully",
      totalMatches: count,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});


router.get("/count-matched-datas-buyer-rent", async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Buyer Assistance phone number is required" });
    }

    const normalizedPhone = phoneNumber.replace(/\D/g, "").slice(-10);
    const buyerRequests = await BuyerAssistance.find({
      phoneNumber: { $regex: new RegExp(`${normalizedPhone}$`, "i") },
    });

    if (!buyerRequests.length) {
      return res.status(200).json({ totalMatches: 0 });
    }

    let count = 0;

    for (let buyerRequest of buyerRequests) {
      const matchedProperties = await AddModel.find({
        propertyMode: buyerRequest.propertyMode,
        propertyType: buyerRequest.propertyType,
        state: buyerRequest.state,
        rentalAmount: {
          $gte: Number(buyerRequest.minPrice),
          $lte: Number(buyerRequest.maxPrice),
        },
      });

      if (matchedProperties.length > 0) {
        count++;
      }
    }

    return res.status(200).json({
      message: "Matched buyer property count fetched successfully",
      totalMatches: count,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});


router.get("/fetch-all-matched-datas-rent", async (req, res) => {
  try {
    // Build approved-tenant Ra_Id set — tenants must exist in the "Approved Tenant"
    // (raActive) list used by BuyerAssistanceActive.jsx, and must not be soft-deleted.
    // If the query returns empty (first-run / misconfig), fall back to no filter to avoid
    // breaking the existing workflow.
    const approvedTenantDocs = await BuyerAssistance.find(
      { ra_status: "raActive", isDeleted: { $ne: true } },
      { Ra_Id: 1 }
    ).lean();
    const approvedTenantIds = new Set(approvedTenantDocs.map(t => t.Ra_Id));
    console.log(`[fetch-all-matched-datas-rent] Approved tenants: ${approvedTenantIds.size}`);

    // Build approved-owner rentId set via loopback to /fetch-active-users-datas-all-rent
    // (the endpoint behind ApprovedCar.jsx). If the call fails, skip the owner filter so
    // the table keeps showing data instead of going blank.
    const approvedOwnerRentIds = new Set();
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const ownerPayload = await new Promise((resolve, reject) => {
        request(
          { url: `${baseUrl}/fetch-active-users-datas-all-rent`, json: true, timeout: 15000 },
          (err, response, body) => {
            if (err) return reject(err);
            if (!response || response.statusCode >= 400) {
              return reject(new Error(`HTTP ${response && response.statusCode}`));
            }
            resolve(body);
          }
        );
      });
      const ownerList = Array.isArray(ownerPayload && ownerPayload.data)
        ? ownerPayload.data
        : Array.isArray(ownerPayload)
          ? ownerPayload
          : [];
      ownerList.forEach(p => {
        if (p && p.rentId && !p.isDeleted) approvedOwnerRentIds.add(p.rentId);
      });
      console.log(`[fetch-all-matched-datas-rent] Approved owners: ${approvedOwnerRentIds.size}`);
    } catch (ownerErr) {
      console.warn(
        `[fetch-all-matched-datas-rent] Approved-owner fetch failed, skipping owner filter:`,
        ownerErr.message
      );
    }

    const buyerRequests = await BuyerAssistance.find({ isDeleted: { $ne: true } }).lean();
    const matchedData = [];
    let processedCount = 0;
    let skippedCount = 0;

    console.log(`\n📋 Starting fetch-all-matched-datas-rent with ${buyerRequests.length} buyer requests`);

    for (let buyerRequest of buyerRequests) {
      try {
        // ✅ Step 1: Validate minPrice and maxPrice
        const minPrice = buyerRequest.minPrice;
        const maxPrice = buyerRequest.maxPrice;

        // Check for empty string, null, or undefined
        if (!minPrice || !maxPrice) {
          console.log(
            `⏭️  Skipping BuyerRequest ${buyerRequest._id}: Missing minPrice or maxPrice (minPrice="${minPrice}", maxPrice="${maxPrice}")`
          );
          skippedCount++;
          continue;
        }

        // Convert to float
        const minPriceNum = parseFloat(minPrice);
        const maxPriceNum = parseFloat(maxPrice);

        // Check for NaN
        if (isNaN(minPriceNum) || isNaN(maxPriceNum)) {
          console.log(
            `⏭️  Skipping BuyerRequest ${buyerRequest._id}: Invalid price format (minPrice="${minPrice}" -> ${minPriceNum}, maxPrice="${maxPrice}" -> ${maxPriceNum})`
          );
          skippedCount++;
          continue;
        }

        // Check for valid price range
        if (minPriceNum < 0 || maxPriceNum < 0) {
          console.log(
            `⏭️  Skipping BuyerRequest ${buyerRequest._id}: Negative price values (minPrice=${minPriceNum}, maxPrice=${maxPriceNum})`
          );
          skippedCount++;
          continue;
        }

        if (minPriceNum > maxPriceNum) {
          console.log(
            `⏭️  Skipping BuyerRequest ${buyerRequest._id}: minPrice (${minPriceNum}) > maxPrice (${maxPriceNum})`
          );
          skippedCount++;
          continue;
        }

        // ✅ Approved-tenant gate — only match buyers present in the Approved Tenant list
        if (approvedTenantIds.size > 0 && !approvedTenantIds.has(buyerRequest.Ra_Id)) {
          skippedCount++;
          continue;
        }

        // ✅ Step 2: Check for required fields for matching
        if (!buyerRequest.propertyMode || !buyerRequest.propertyType || !buyerRequest.state) {
          console.log(
            `⏭️  Skipping BuyerRequest ${buyerRequest._id}: Missing required fields (propertyMode="${buyerRequest.propertyMode}", propertyType="${buyerRequest.propertyType}", state="${buyerRequest.state}")`
          );
          skippedCount++;
          continue;
        }

        // ✅ Step 3: Query with validated prices
        const query = {
          propertyMode: buyerRequest.propertyMode,
          propertyType: buyerRequest.propertyType,
          state: buyerRequest.state,
          rentalAmount: {
            $gte: minPriceNum,
            $lte: maxPriceNum,
          },
        };

        console.log(`🔍 Searching for properties for BuyerRequest ${buyerRequest._id} with query:`, query);

        const matchedProperties = await AddModel.find(query).lean();

        console.log(`   Found ${matchedProperties.length} matching properties`);

        // ✅ Approved-owner gate + exclude soft-deleted properties
        const filteredMatchedProperties = matchedProperties.filter(p => {
          if (p.isDeleted === true) return false;
          if (approvedOwnerRentIds.size > 0 && !approvedOwnerRentIds.has(p.rentId)) return false;
          return true;
        });

        if (filteredMatchedProperties.length > 0) {
          const baCreatedMs = buyerRequest.createdAt ? new Date(buyerRequest.createdAt).getTime() : 0;
          matchedData.push({
            buyerAssistanceCard: {
              _id: buyerRequest._id,
              Ra_Id: buyerRequest.Ra_Id,
              name: buyerRequest.raName,
              phoneNumber: buyerRequest.phoneNumber,
              city: buyerRequest.city,
              area: buyerRequest.area,
              minPrice: buyerRequest.minPrice,
              maxPrice: buyerRequest.maxPrice,
              propertyType: buyerRequest.propertyType,
              facing: buyerRequest.facing,
              propertyAge: buyerRequest.propertyAge,
              propertyMode: buyerRequest.propertyMode,
              paymentType: buyerRequest.paymentType,
              bankLoan: buyerRequest.loanInput,
              state: buyerRequest.state,
              isDeleted: buyerRequest.isDeleted,
              Whatsappstatus: buyerRequest.Whatsappstatus,
            },
            matchedProperties: filteredMatchedProperties.map((property) => {
              const propCreatedMs = property.createdAt ? new Date(property.createdAt).getTime() : 0;
              const matchedAtMs = Math.max(baCreatedMs, propCreatedMs);
              return {
                rentId: property.rentId,
                postedByUser: property.phoneNumber,
                postedBy: property.postedBy,
                rentalAmount: property.rentalAmount,
                city: property.city,
                area: property.area,
                state: property.state,
                propertyType: property.propertyType,
                facing: property.facing,
                bedrooms: property.bedrooms,
                totalArea: property.totalArea,
                areaUnit: property.areaUnit,
                createdAt: property.createdAt,
                isDeleted: property.isDeleted,
                Whatsappstatus: property.Whatsappstatus || 'Not Send',
                matchedAt: matchedAtMs ? new Date(matchedAtMs).toISOString() : null,
              };
            }),
          });
          processedCount++;
        }
      } catch (itemError) {
        console.error(
          `❌ Error processing BuyerRequest ${buyerRequest._id}:`,
          itemError.message
        );
        skippedCount++;
        // Continue processing next record
        continue;
      }
    }

    console.log(
      `\n✅ Fetch completed: ${processedCount} processed, ${skippedCount} skipped, ${matchedData.length} matches found\n`
    );

    // ✅ Always return success, even if no matches
    res.status(200).json({
      success: true,
      message: `Fetched ${matchedData.length} matched buyer-property records (${processedCount} buyer requests processed, ${skippedCount} skipped due to invalid data)`,
      totalMatches: matchedData.length,
      processedRequests: processedCount,
      skippedRequests: skippedCount,
      data: matchedData,
    });
  } catch (error) {
    console.error("❌ Fatal error in /fetch-all-matched-datas-rent:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching matched data",
      error: error.message,
      data: [],
    });
  }
});


// // *************** all buyer with matched property ***************

router.get("/fetch-owner-matched-properties-rent", async (req, res) => {
  try {
    const { phoneNumber } = req.query;
    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false,
        message: "Owner phone number is required",
        data: [] 
      });
    }

    const normalizedPhone = phoneNumber.replace(/\D/g, "").slice(-10);
    const buyerRequests = await BuyerAssistance.find({
      phoneNumber: { $regex: new RegExp(`${normalizedPhone}$`, "i") },
    }).lean();

    if (!buyerRequests.length) {
      return res.status(200).json({ 
        success: true,
        message: "No Buyer Assistance requests found",
        total: 0,
        properties: [],
        data: [] 
      });
    }

    let matchedProperties = [];
    let processedCount = 0;
    let skippedCount = 0;

    console.log(`\n🏢 Fetching owner matched properties for phone: ${phoneNumber} (normalized: ${normalizedPhone})`);
    console.log(`   Found ${buyerRequests.length} buyer requests`);

    for (let buyer of buyerRequests) {
      try {
        // ✅ Validate prices
        const minPrice = buyer.minPrice;
        const maxPrice = buyer.maxPrice;

        if (!minPrice || !maxPrice) {
          console.log(`   ⏭️  Skipping buyer ${buyer._id}: Missing price data`);
          skippedCount++;
          continue;
        }

        const minPriceNum = parseFloat(minPrice);
        const maxPriceNum = parseFloat(maxPrice);

        if (isNaN(minPriceNum) || isNaN(maxPriceNum)) {
          console.log(`   ⏭️  Skipping buyer ${buyer._id}: Invalid price format`);
          skippedCount++;
          continue;
        }

        const query = {
          propertyMode: buyer.propertyMode,
          propertyType: buyer.propertyType,
          city: buyer.city,
          area: buyer.area,
          facing: buyer.facing,
          rentalAmount: {
            $gte: minPriceNum,
            $lte: maxPriceNum,
          },
        };

        const properties = await AddModel.find(query).lean();
        console.log(`   Found ${properties.length} properties for buyer ${buyer._id}`);

        matchedProperties.push(...properties);
        processedCount++;
      } catch (itemError) {
        console.error(`   ❌ Error processing buyer ${buyer._id}:`, itemError.message);
        skippedCount++;
      }
    }

    console.log(`\n✅ Owner search completed: ${processedCount} processed, ${skippedCount} skipped, ${matchedProperties.length} total properties\n`);

    res.status(200).json({
      success: true,
      message: `Owner-Matched Properties fetched successfully (${matchedProperties.length} properties)`,
      total: matchedProperties.length,
      processedBuyers: processedCount,
      skippedBuyers: skippedCount,
      properties: matchedProperties.map((p) => ({
        rentId: p.rentId,
        phoneNumber: p.phoneNumber,
        postedBy: p.postedBy,
        rentalAmount: p.rentalAmount,
        city: p.city,
        area: p.area,
        facing: p.facing,
        state: p.state,
        propertyType: p.propertyType,
        propertyMode: p.propertyMode,
      })),
      data: matchedProperties,
    });
  } catch (error) {
    console.error("❌ Error in /fetch-owner-matched-properties-rent:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message,
      data: [] 
    });
  }
});

router.get("/fetch-matched-data-buyer-rent", async (req, res) => {
  try {
    const { phoneNumber } = req.query;
    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false,
        message: "Buyer phone number is required",
        data: [] 
      });
    }

    const normalizedPhone = phoneNumber.replace(/\D/g, "").slice(-10);
    const buyerRequests = await BuyerAssistance.find({
      phoneNumber: { $regex: new RegExp(`${normalizedPhone}$`, "i") },
    }).lean();

    if (!buyerRequests.length) {
      return res.status(200).json({ 
        success: true,
        message: "No Buyer Assistance requests found",
        totalMatches: 0,
        data: [] 
      });
    }

    const matchedData = [];
    let processedCount = 0;
    let skippedCount = 0;

    console.log(`\n👤 Fetching buyer matched data for phone: ${phoneNumber} (normalized: ${normalizedPhone})`);
    console.log(`   Found ${buyerRequests.length} buyer requests`);

    for (let buyer of buyerRequests) {
      try {
        // ✅ Validate prices
        const minPrice = buyer.minPrice;
        const maxPrice = buyer.maxPrice;

        if (!minPrice || !maxPrice) {
          console.log(`   ⏭️  Skipping buyer ${buyer._id}: Missing price data`);
          skippedCount++;
          continue;
        }

        const minPriceNum = parseFloat(minPrice);
        const maxPriceNum = parseFloat(maxPrice);

        if (isNaN(minPriceNum) || isNaN(maxPriceNum)) {
          console.log(`   ⏭️  Skipping buyer ${buyer._id}: Invalid price format`);
          skippedCount++;
          continue;
        }

        const query = {
          propertyMode: buyer.propertyMode,
          propertyType: buyer.propertyType,
          city: buyer.city,
          area: buyer.area,
          facing: buyer.facing,
          rentalAmount: {
            $gte: minPriceNum,
            $lte: maxPriceNum,
          },
        };

        const matchedProperties = await AddModel.find(query).lean();
        console.log(`   Found ${matchedProperties.length} properties for buyer request ${buyer._id}`);

        if (matchedProperties.length > 0) {
          matchedData.push({
            buyerAssistanceCard: {
              _id: buyer._id,
              Ra_Id: buyer.Ra_Id,
              name: buyer.raName,
              phoneNumber: buyer.phoneNumber,
              city: buyer.city,
              area: buyer.area,
              priceRange: `${buyer.minPrice} - ${buyer.maxPrice}`,
              propertyType: buyer.propertyType,
              facing: buyer.facing,
              propertyAge: buyer.propertyAge,
              propertyMode: buyer.propertyMode,
            },
            matchedProperties: matchedProperties.map((property) => ({
              rentId: property.rentId,
              postedBy: property.postedBy,
              postedByUser: property.phoneNumber,
              rentalAmount: property.rentalAmount,
              city: property.city,
              area: property.area,
              state: property.state,
              propertyType: property.propertyType,
              facing: property.facing,
              bedrooms: property.bedrooms,
              totalArea: property.totalArea,
              areaUnit: property.areaUnit,
              createdAt: property.createdAt,
            })),
          });
        }
        processedCount++;
      } catch (itemError) {
        console.error(`   ❌ Error processing buyer ${buyer._id}:`, itemError.message);
        skippedCount++;
      }
    }

    console.log(`\n✅ Buyer search completed: ${processedCount} processed, ${skippedCount} skipped, ${matchedData.length} matches found\n`);

    res.status(200).json({
      success: true,
      message: `Matched Data Fetched Successfully (${matchedData.length} matches)`,
      totalMatches: matchedData.length,
      processedBuyers: processedCount,
      skippedBuyers: skippedCount,
      data: matchedData,
    });
  } catch (error) {
    console.error("❌ Error in /fetch-matched-data-buyer-rent:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message,
      data: [] 
    });
  }
});


router.get("/fetch-matched-buyers-for-owner-rent", async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const properties = await AddModel.find({ phoneNumber });

    if (!properties.length) {
      return res.status(404).json({ message: "No properties found for this owner" });
    }

    let allMatchedBuyers = [];

    for (let property of properties) {
      const conditions = {
        propertyMode: property.propertyMode,
        propertyType: property.propertyType,
        state: property.state,
        // area: property.area,
        // facing: property.facing,
        minPrice: { $lte: property.rentalAmount },
        maxPrice: { $gte: property.rentalAmount }
      };

      const matchedBuyers = await BuyerAssistance.find(conditions);
      allMatchedBuyers.push(...matchedBuyers);
    }

    if (!allMatchedBuyers.length) {
      return res.status(404).json({ message: "No matched buyer assistance requests found" });
    }

    res.status(200).json({
      message: "Matched Buyer Assistance Requests fetched successfully!",
      matchedBuyerRequests: allMatchedBuyers.map(buyer => ({
        Ra_Id: buyer.Ra_Id,
        name: buyer.raName,
        phoneNumber: buyer.phoneNumber,
        city: buyer.city,
        area: buyer.area,
        propertyType: buyer.propertyType,
        propertyMode: buyer.propertyMode,
        state: buyer.state,
        minPrice: buyer.minPrice,
        maxPrice: buyer.maxPrice,
      })),
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


router.get("/fetch-buyer-matched-properties-rent/count", async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const normalizedPhone = phoneNumber.replace(/\D/g, "").slice(-10);

    const property = await AddModel.findOne({
      phoneNumber: { $regex: new RegExp(`${normalizedPhone}$`, "i") }
    });

    if (!property) {
      return res.status(200).json({ matchedPropertiesCount: 0 });
    }

    const matchedBuyerRequestsCount = await BuyerAssistance.countDocuments({
      propertyMode: property.propertyMode,
      propertyType: property.propertyType,
      state: property.state,
      // area: property.area,
      // facing: property.facing,
      minPrice: { $lte: property.rentalAmount },
      maxPrice: { $gte: property.rentalAmount }
    });

    return res.status(200).json({
      message: "Buyer Assistance matches found for owner's property",
      matchedPropertiesCount: matchedBuyerRequestsCount
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

router.get("/fetch-owner-matched-properties-rent/count", async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Buyer Assistance phone number is required" });
    }

    const normalizedPhone = phoneNumber.replace(/\D/g, "").slice(-10);

    const buyerRequests = await BuyerAssistance.find({
      phoneNumber: { $regex: new RegExp(`${normalizedPhone}$`, "i") }
    });

    if (!buyerRequests.length) {
      return res.status(404).json({ message: "No Buyer Assistance requests found" });
    }

    let matchedBuyerRequestCount = 0;

    for (let buyer of buyerRequests) {
      const match = await AddModel.findOne({
        propertyMode: buyer.propertyMode,
        propertyType: buyer.propertyType,
        state: buyer.state,
        rentalAmount: {
          $gte: Number(buyer.minPrice),
          $lte: Number(buyer.maxPrice),
        },
      });

      if (match) {
        matchedBuyerRequestCount++;
      }
    }

    res.status(200).json({
      message: "Buyer-Matched Assistance Requests fetched successfully!",
      ownerMatchedPropertyCount: matchedBuyerRequestCount, // ✅ key updated for frontend
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


router.get("/fetch-buyerAssistance-user-rent", async (req, res) => {
  try {
    let { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // ✅ Normalize input: Remove non-digit characters and keep only the last 10 digits
    let normalizedPhone = phoneNumber.replace(/\D/g, "").slice(-10);


    // ✅ MongoDB Query: Match all variations of the phone number
    const buyerRequests = await BuyerAssistance.find({
      phoneNumber: { $regex: new RegExp(`${normalizedPhone}$`, "i") }
    });

    if (!buyerRequests.length) {
      return res.status(404).json({ message: "No Buyer Assistance request found for this phone number" });
    }

    // ✅ Format phone number in response to always use +91
    const formattedResponse = buyerRequests.map(request => ({
      ...request.toObject(),
      phoneNumber: `+91${request.phoneNumber.replace(/^91/, "").replace(/^\+?/, "")}`
    }));

    res.status(200).json({ 
      message: "Buyer Assistance request(s) fetched successfully!", 
      data: formattedResponse 
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


router.post("/send-interest-rent", async (req, res) => {
  try {
    const { Ra_Id, buyerPhone } = req.body;

    const ba = await BuyerAssistance.findOne({ Ra_Id });
    if (!ba) {
      return res.status(404).json({ message: "Buyer Assistance not found" });
    }

    const plan = await PricingPlans.findOne({ phoneNumber: buyerPhone });

    // Default status
    let statusToSet = "rent-interest-tried";

    // Set full interest if plan is not Free
    if (plan && plan.name && plan.name.toLowerCase() !== "free") {
      statusToSet = "rent-assistance-interest";
    }

    // Add phone to interested users if not already there
    if (!ba.interestedUserPhone.includes(buyerPhone)) {
      ba.interestedUserPhone.push(buyerPhone);
    }

    // Update status
    ba.ra_status = statusToSet;

    await ba.save();

    res.status(200).json({
      success: true,
      message: `Interest ${statusToSet === "rent-assistance-interest" ? "sent" : "tried"} successfully.`,
      data: ba,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process interest request",
      error: error.message,
    });
  }
});

router.post("/send-interest-with-plan-rent", async (req, res) => {
  try {
    const { Ra_Id, buyerPhone } = req.body;

    const ba = await BuyerAssistance.findOne({ Ra_Id });
    if (!ba) {
      return res.status(404).json({ message: "Buyer Assistance not found" });
    }

    const plan = await PricingPlans.findOne({ phoneNumber: buyerPhone });

    let statusToSet = "rent-interest-tried";
    if (plan && plan.name && plan.name.toLowerCase() !== "free") {
      statusToSet = "rent-assistance-interest";
    }

    if (!ba.interestedUserPhone.includes(buyerPhone)) {
      ba.interestedUserPhone.push(buyerPhone);
    }

    ba.ra_status = statusToSet;
    await ba.save();

    // Calculate plan expiry if available
    let expiryDate = null;
    if (plan) {
      const createdAt = new Date(plan.createdAt);
      const duration = plan.durationDays || 0;
      expiryDate = new Date(createdAt);
      expiryDate.setDate(createdAt.getDate() + duration);
    }

    res.status(200).json({
      success: true,
      message: `Interest ${statusToSet === "rent-assistance-interest" ? "sent" : "tried"} successfully.`,
      buyerAssistance: ba,
      plan: plan
        ? {
            phoneNumber: plan.phoneNumber,
            planName: plan.name,
            packageType: plan.packageType,
            durationDays: plan.durationDays,
            price: plan.price,
            createdAt: plan.createdAt,
            expiryDate: expiryDate?.toISOString().split("T")[0],
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process interest request",
      error: error.message,
    });
  }
});


router.get("/fetch-buyer-assistance-rent", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { ra_status: status } : {};

    const buyerAssistanceList = await BuyerAssistance.find(filter);

    const phoneNumbers = [...new Set(buyerAssistanceList.map(r => r.phoneNumber))];
    const plans = await PricingPlans.find({ phoneNumber: { $in: phoneNumbers } });

    const formatDate = (date) =>
      date ? new Date(date).toLocaleDateString("en-GB") : "N/A";

    const calculateExpiry = (startDate, durationDays) => {
      if (!startDate || !durationDays) return "N/A";
      const expiry = new Date(startDate);
      expiry.setDate(expiry.getDate() + Number(durationDays));
      return formatDate(expiry);
    };

    const combinedData = buyerAssistanceList.map((ba) => {
      const plan = plans.find(p =>
        Array.isArray(p.phoneNumber)
          ? p.phoneNumber.includes(ba.phoneNumber)
          : p.phoneNumber === ba.phoneNumber
      );

      return {
        ...ba._doc,
        planName: plan?.name || "No Plan",
        planCreatedAt: formatDate(plan?.createdAt),
        planExpiry: calculateExpiry(plan?.createdAt, plan?.durationDays),
        durationDays: plan?.durationDays || "N/A",
      };
    });

    res.status(200).json({
      success: true,
      message: "Buyer Assistance requests fetched successfully!",
      data: combinedData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch buyer assistance data",
      error: error.message,
    });
  }
});


router.put("/update-buyer-assistance-rent/:id", async (req, res) => {
  try {
    const updatedRequest = await BuyerAssistance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({
      message: "Buyer Assistance request updated successfully!",
      data: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating Buyer Assistance request",
      error: error.message,
    });
  }
});


router.get("/get-buyer-assistance-by-id-rent/:Ra_Id", async (req, res) => {
  try {
    const assistance = await BuyerAssistance.findOne({ Ra_Id: Number(req.params.Ra_Id) });

    if (!assistance) {
      return res.status(404).json({ message: "Buyer Assistance not found" });
    }

    res.status(200).json({ success: true, data: assistance });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/fetch-buyerAssistance-pending-rent", async (req, res) => {
  try {
    const pendingRequests = await BuyerAssistance.find({ ra_status: "raPending" });

    const phoneNumbers = [...new Set(pendingRequests.map(req => req.phoneNumber))];
    const plans = await PricingPlans.find({ phoneNumber: { $in: phoneNumbers } });

    const formatDate = (date) =>
      date ? new Date(date).toLocaleDateString("en-GB") : "N/A";

    const calculateExpiry = (startDate, durationDays) => {
      if (!startDate || !durationDays) return "N/A";
      const expiry = new Date(startDate);
      expiry.setDate(expiry.getDate() + Number(durationDays));
      return formatDate(expiry);
    };

    const enrichedData = pendingRequests.map(req => {
      const plan = plans.find(p => p.phoneNumber === req.phoneNumber);
      return {
        ...req._doc,
        planDetails: plan ? {
          planName: plan.name || 'N/A',
          planCreatedAt: formatDate(plan.createdAt),
          durationDays: plan.durationDays || 0,
          planExpiryDate: calculateExpiry(plan.createdAt, plan.durationDays),
          packageType: plan.packageType || 'N/A',
        } : {
          planName: 'N/A',
          planCreatedAt: 'N/A',
          durationDays: 0,
          planExpiryDate: 'N/A',
          packageType: 'N/A',
        },
      };
    });

    res.status(200).json({
      message: "Pending buyer assistance requests with plan details fetched successfully",
      data: enrichedData,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch enriched pending buyer assistance requests",
      error: error.message,
    });
  }
});

router.delete("/delete-buyerAssistance-rent/:id", async (req, res) => {
  try {
    const deletedRequest = await BuyerAssistance.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({ message: "Buyer Assistance request deleted successfully!" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting Buyer Assistance request",
      error: error.message,
    });
  }
});

router.put("/update-status-buyer-assistance-rent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ra_status, userPhoneNumber } = req.body;

    if (!ra_status || !userPhoneNumber) {
      return res.status(400).json({ message: "Status and user phone number are required" });
    }

    if (!["rent-assistance-interest", "remove-assistance-interest"].includes(ra_status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const normalizedPhone = userPhoneNumber.replace(/\D/g, "").slice(-10);

    const updatedAssistance = await BuyerAssistance.findByIdAndUpdate(
      id,
      {
        ra_status,
        $addToSet: { interestedUserPhone: normalizedPhone },
      },
      { new: true }
    );

    if (!updatedAssistance) {
      return res.status(404).json({ message: "Buyer Assistance not found" });
    }

    res.status(200).json({
      message: `Buyer Assistance status updated to '${ra_status}' successfully!`,
      data: updatedAssistance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


router.get("/buyer-assistance-interests-rent", async (req, res) => {
  try {
    const assistanceInterests = await BuyerAssistance.find({
      ra_status: "rent-assistance-interest",
      isDeleted: false,
    });

    if (!assistanceInterests.length) {
      return res.status(404).json({ message: "No buyer assistance interests found" });
    }

    res.status(200).json({
      message: "Buyer assistance interests fetched successfully",
      data: assistanceInterests,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.put("/status-buyer-assistance-rent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ra_status } = req.body;

    if (!ra_status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedAssistance = await BuyerAssistance.findByIdAndUpdate(
      id,
      { ra_status },
      { new: true }
    );

    if (!updatedAssistance) {
      return res.status(404).json({ message: "Buyer Assistance not found" });
    }

    res.status(200).json({
      message: "Buyer Assistance status updated successfully!",
      data: updatedAssistance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/delete-buyer-assistance-rent/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAssistance = await BuyerAssistance.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!deletedAssistance) {
      return res.status(404).json({ message: "Buyer Assistance request not found" });
    }

    res.status(200).json({
      message: "Buyer Assistance request deleted successfully",
      data: deletedAssistance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.put("/undo-delete-buyer-assistance-rent/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const restoredAssistance = await BuyerAssistance.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!restoredAssistance) {
      return res.status(404).json({ message: "Buyer Assistance request not found" });
    }

    res.status(200).json({
      message: "Buyer Assistance request restored successfully",
      data: restoredAssistance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.put("/undo-delete-buyer-assistance-by-rent/:Ra_Id", async (req, res) => {
  try {
    const { Ra_Id } = req.params;

    const restoredAssistance = await BuyerAssistance.findOneAndUpdate(
      { Ra_Id: Number(Ra_Id) }, // Ensure it's a number
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!restoredAssistance) {
      return res.status(404).json({ message: "Buyer Assistance request not found" });
    }

    res.status(200).json({
      message: "Buyer Assistance request restored successfully",
      data: restoredAssistance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Soft delete by Ra_Id
router.put("/delete-buyer-assistance-rent/:Ra_Id", async (req, res) => {
  try {
    const Ra_Id = parseInt(req.params.Ra_Id);

    if (isNaN(Ra_Id)) {
      return res.status(400).json({ message: "Invalid Ra_Id" });
    }

    const deleted = await BuyerAssistance.findOneAndUpdate(
      { Ra_Id },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: "Buyer Assistance request not found" });
    }

    res.status(200).json({
      message: "Buyer Assistance request soft-deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/delete-buyer-assistance-by-rentId/:rentId", async (req, res) => {
  try {
    const { rentId } = req.params;

    const deletedAssistance = await BuyerAssistance.findOneAndUpdate(
      { rentId },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!deletedAssistance) {
      return res.status(404).json({ message: "Buyer Assistance request not found" });
    }

    res.status(200).json({
      message: "Buyer Assistance request soft-deleted successfully",
      data: deletedAssistance,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


router.put("/undo-delete-buyer-assistance-by-rentId/:rentId", async (req, res) => {
  try {
    const { rentId } = req.params;

    const restoredAssistance = await BuyerAssistance.findOneAndUpdate(
      { rentId },
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!restoredAssistance) {
      return res.status(404).json({ message: "Buyer Assistance request not found" });
    }

    res.status(200).json({
      message: "Buyer Assistance request restored successfully",
      data: restoredAssistance,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


router.put("/undo-delete-buyer-assistance-by-rentId/:rentId", async (req, res) => {
  try {
    const { rentId } = req.params;

    const restoredAssistance = await BuyerAssistance.findOneAndUpdate(
      { rentId },
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!restoredAssistance) {
      return res.status(404).json({ message: "Buyer Assistance request not found" });
    }

    res.status(200).json({
      message: "Buyer Assistance request restored successfully",
      data: restoredAssistance,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});







// ✅ Permanent Delete API
router.delete("/permanent-delete-buyer-assistance/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAssistance = await BuyerAssistance.findByIdAndDelete(id);

    if (!deletedAssistance) {
      return res.status(404).json({ message: "Buyer Assistance request not found" });
    }

    res.status(200).json({ message: "Buyer Assistance request permanently deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});




router.get('/get-buyer-assist-views-all', async (req, res) => {
  try {
    const views = await BuyerAssistView.find().sort({ viewedAt: -1 });

    const enrichedViews = await Promise.all(
      views.map(async (view) => {
        const baData = await BuyerAssistance.findOne({ Ra_Id: view.Ra_Id }).lean();
        return {
          ...view.toObject(),
          ba_details: baData || null,
        };
      })
    );

    // City-base filter: when base is PY/CH, keep only views whose buyer
    // assistance record belongs to that base (legacy/missing base counts as PY).
    const wantBase = normalizeBase(req.query.base);
    const filteredViews = wantBase
      ? enrichedViews.filter((v) => {
          const b = v.ba_details && v.ba_details.base;
          return wantBase === 'CH' ? b === 'CH' : (b === 'PY' || b == null);
        })
      : enrichedViews;

    return res.status(200).json({ success: true, views: filteredViews });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});


router.get("/fetch-buyerAssistance", async (req, res) => {
  try {
    const buyerAssistanceList = await BuyerAssistance.find({ ...baseFilter(req.query.base) });

    const phoneNumbers = [...new Set(buyerAssistanceList.map(r => r.phoneNumber))];
    const plans = await PricingPlans.find({ phoneNumber: { $in: phoneNumbers } });

    const formatDate = (date) =>
      date ? new Date(date).toLocaleDateString("en-GB") : "N/A";

    const calculateExpiry = (startDate, durationDays) => {
      if (!startDate || !durationDays) return "N/A";
      const expiry = new Date(startDate);
      expiry.setDate(expiry.getDate() + Number(durationDays));
      return formatDate(expiry);
    };

    const combinedData = buyerAssistanceList.map((ba) => {
      const plan = plans.find(p =>
        Array.isArray(p.phoneNumber)
          ? p.phoneNumber.includes(ba.phoneNumber)
          : p.phoneNumber === ba.phoneNumber
      );

      return {
        ...ba._doc,
        planName: plan?.name || "No Plan",
        planCreatedAt: formatDate(plan?.createdAt),
        planExpiry: calculateExpiry(plan?.createdAt, plan?.durationDays),
              durationDays: plan?.durationDays || "N/A"

      };
    });

    res.status(200).json({
      success: true,
      message: "Buyer Assistance requests fetched successfully!",
      data: combinedData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch buyer assistance data",
      error: error.message
    });
  }
});


const getBuyerDashboardDatas = async (req, res) => {
  try {
    // Helper to get start/end date for a specific day
    const getDateRange = (daysAgo = 0) => {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - daysAgo);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    };

    const { start: todayStart, end: todayEnd } = getDateRange(0);
    const { start: yesterdayStart, end: yesterdayEnd } = getDateRange(1);

    // ---------------- BuyerAssistance Data ----------------
    const baQuery = {
      ra_status: { $in: ["raActive", "raPending"] },
      isDeleted: false
    };

    const todayBA = await BuyerAssistance.find({
      ...baQuery,
      $or: [
        { createdAt: { $gte: todayStart, $lte: todayEnd } },
        { updatedAt: { $gte: todayStart, $lte: todayEnd } }
      ]
    }).lean();

    const yesterdayBA = await BuyerAssistance.find({
      ...baQuery,
      $or: [
        { createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd } },
        { updatedAt: { $gte: yesterdayStart, $lte: yesterdayEnd } }
      ]
    }).lean();

    // ---------------- Payment Data with Plan Details (only today & yesterday) ----------------
    const statuses = ["pay now", "pay later", "paid", "pay failed"];
    const paymentsByStatus = {};

    // Fetch all plans once for mapping
    const allPlans = await BuyerPlan.find({ status: "active" }).lean();
    const planMap = {};
    allPlans.forEach(plan => {
      planMap[plan.planName.toLowerCase()] = plan;
    });

    // Helper to calculate expiry date
    const parseValidityToDays = (validityStr) => {
      if (!validityStr) return 0;
      const lower = validityStr.toLowerCase();
      if (lower.includes("day")) return parseInt(validityStr) || 0;
      if (lower.includes("month")) return (parseInt(validityStr) || 0) * 30;
      return 0;
    };

    for (const status of statuses) {
      // Payments for TODAY
      const todayPayments = await PaymentPayUBuyer.find({
        payustatususer: status,
        $or: [
          { createdAt: { $gte: todayStart, $lte: todayEnd } },
          { updatedAt: { $gte: todayStart, $lte: todayEnd } }
        ]
      })
        .sort({ createdAt: -1 })
        .lean();

      // Payments for YESTERDAY
      const yesterdayPayments = await PaymentPayUBuyer.find({
        payustatususer: status,
        $or: [
          { createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd } },
          { updatedAt: { $gte: yesterdayStart, $lte: yesterdayEnd } }
        ]
      })
        .sort({ createdAt: -1 })
        .lean();

      // Attach plan details
      const attachPlan = (payment) => {
        const plan = planMap[(payment.planName || "").toLowerCase()];
        let expiryDate = null;

        if (plan) {
          const createdAt = plan.createDate || new Date();
          const validityDays = parseValidityToDays(plan.planValidity);
          const expDate = new Date(createdAt);
          expDate.setDate(expDate.getDate() + validityDays);
          expiryDate = expDate.toISOString().split("T")[0];
        }

        return {
          ...payment,
          planDetails: plan ? {
            planName: plan.planName,
            planAmount: plan.planAmount,
            planValidity: plan.planValidity,
            numberOfAssistants: plan.numberOfAssistants,
            serviceType: plan.serviceType,
            createDate: plan.createDate,
            expiryDate,
            status: plan.status,
            Ra_Id: plan.Ra_Id
          } : null
        };
      };

      paymentsByStatus[status] = {
        today: todayPayments.map(attachPlan),
        yesterday: yesterdayPayments.map(attachPlan)
      };
    }

    // ---------------- Final Response ----------------
    res.json({
      status: "success",
      buyerAssistance: {
        today: todayBA,
        yesterday: yesterdayBA
      },
      payments: paymentsByStatus
    });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message
    });
  }
};

// Single API endpoint
router.get("/buyer-dashboard-datas", getBuyerDashboardDatas);


const getBuyerDashboardData = async (req, res) => {
  try {
    // --- Parse date range from query ---
    let startDate, endDate;
    if (req.query.dates) {
      const dateParts = req.query.dates.split(",");
      if (dateParts.length !== 2) {
        return res.status(400).json({ status: "error", message: "Invalid dates format. Use ?dates=YYYY-MM-DD,YYYY-MM-DD" });
      }
      startDate = new Date(dateParts[0]);
      endDate = new Date(dateParts[1]);
    } else if (req.query.date) {
      startDate = new Date(req.query.date);
      endDate = new Date(req.query.date);
    } else {
      return res.status(400).json({ status: "error", message: "Please provide date(s) in query params" });
    }

    // Normalize start & end times
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // ---------------- Buyer Assistance ----------------
    const baQuery = {
      ra_status: { $in: ["raActive", "raPending"] },
      isDeleted: false
    };

    const buyerAssistanceData = await BuyerAssistance.find({
      ...baQuery,
      $or: [
        { createdAt: { $gte: startDate, $lte: endDate } },
        { updatedAt: { $gte: startDate, $lte: endDate } }
      ]
    }).lean();

    const buyerAssistanceSummary = {
      total: buyerAssistanceData.length,
      statusCounts: {
        raActive: buyerAssistanceData.filter(d => d.ra_status === "raActive").length,
        raPending: buyerAssistanceData.filter(d => d.ra_status === "raPending").length
      },
      list: buyerAssistanceData.map(d => ({
        buyerId: d._id,
        ra_status: d.ra_status,
        phoneNumber: d.phoneNumber,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt
      }))
    };

    // ---------------- Payments ----------------
    const statuses = ["pay now", "pay later", "paid", "pay failed"];
    const paymentsSummary = {};

    const allPlans = await BuyerPlan.find({ status: "active" }).lean();
    const planMap = {};
    allPlans.forEach(plan => {
      planMap[plan.planName.toLowerCase()] = plan;
    });

    const parseValidityToDays = (validityStr) => {
      if (!validityStr) return 0;
      const lower = validityStr.toLowerCase();
      if (lower.includes("day")) return parseInt(validityStr) || 0;
      if (lower.includes("month")) return (parseInt(validityStr) || 0) * 30;
      return 0;
    };

    for (const status of statuses) {
      const payments = await PaymentPayUBuyer.find({
        payustatususer: status,
        createdAt: { $gte: startDate, $lte: endDate }
      }).lean();

      paymentsSummary[status] = {
        total: payments.length,
        list: payments.map(payment => {
          const plan = planMap[(payment.planName || "").toLowerCase()];
          let expiryDate = null;
          if (plan) {
            const createdAt = payment.createdAt || new Date();
            const validityDays = parseValidityToDays(plan.planValidity);
            const expDate = new Date(createdAt);
            expDate.setDate(expDate.getDate() + validityDays);
            expiryDate = expDate.toISOString().split("T")[0];
          }
          return {
            paymentId: payment._id,
            amount: payment.amount,
            planName: payment.planName,
            payStatus: payment.payustatususer,
            createdAt: payment.createdAt,
            expiryDate,
            planDetails: plan || null
          };
        })
      };
    }

    // ---------------- Response ----------------
    res.json({
      status: "success",
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      buyerAssistance: buyerAssistanceSummary,
      payments: paymentsSummary
    });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message
    });
  }
};


// // Single API endpoint
router.get("/buyer-dashboard-data", getBuyerDashboardData);

// ✅ PUT: Update WhatsApp Status for matched property when message is sent
router.put("/update-whatsapp-status-matched-property/:buyerAssistanceId", async (req, res) => {
  try {
    const { buyerAssistanceId } = req.params;
    const { whatsappStatus, rentId } = req.body;

    // Validate required fields
    if (!whatsappStatus) {
      return res.status(400).json({
        success: false,
        status: "error",
        message: "whatsappStatus is required"
      });
    }

    if (!rentId) {
      return res.status(400).json({
        success: false,
        status: "error",
        message: "rentId is required to update the specific property's WhatsApp status"
      });
    }

    console.log(`[WhatsApp Status Update] BA_ID: ${buyerAssistanceId}, rentId: ${rentId}, status: ${whatsappStatus}`);

    // ✅ PRIMARY UPDATE: Update the specific property's Whatsappstatus in AddModel (property-level)
    // strict:false ensures the write succeeds even if AddModel schema doesn't declare Whatsappstatus
    const updatedProperty = await AddModel.findOneAndUpdate(
      { rentId: rentId },
      { $set: { Whatsappstatus: whatsappStatus } },
      { new: true, strict: false }
    );

    if (!updatedProperty) {
      console.error(`[WhatsApp Status Update] Property not found with rentId: ${rentId}`);
      return res.status(404).json({
        success: false,
        status: "error",
        message: `Property with rentId ${rentId} not found`
      });
    }

    console.log(`[WhatsApp Status Update] Property updated: ${updatedProperty.rentId}, new status: ${updatedProperty.Whatsappstatus}`);

    // ✅ SECONDARY UPDATE: Also update BuyerAssistance for backward compatibility
    const updatedBA = await BuyerAssistance.findByIdAndUpdate(
      buyerAssistanceId,
      { Whatsappstatus: whatsappStatus },
      { new: true }
    );

    if (!updatedBA) {
      console.warn(`[WhatsApp Status Update] BuyerAssistance not found: ${buyerAssistanceId}`);
    }

    console.log(`[WhatsApp Status Update] SUCCESS - Property and BA updated`);

    res.status(200).json({
      success: true,
      status: "success",
      message: "WhatsApp status updated successfully for property and buyer assistance",
      data: {
        property: updatedProperty,
        buyerAssistance: updatedBA
      }
    });

  } catch (error) {
    console.error("[WhatsApp Status Update] ERROR:", error);
    res.status(500).json({
      success: false,
      status: "error",
      message: "Error updating WhatsApp status",
      error: error.message
    });
  }
});

// ─── Manual "Mark as Expired" for tenant assistance ──────────────────────────
// Additive. Mirrors the AUTOMATIC expiry in BuyerPlan/BuyerRouter.js, which
// flips BuyerAssistance.ra_status to "raExpired" and the matching PayU record's
// payustatususer alongside it. The only difference here is that an admin
// triggers it, and raExpiredAt / raExpiredBy record who and when — those two
// fields are what separate a hand-expired record from an auto-expired one, and
// they drive the "Manually Expired" section on the Expired screen.
//
//   PUT /mark-buyerAssistance-expired-rent    { raIds: [...], expiredBy }
//   PUT /unmark-buyerAssistance-expired-rent  { raIds: [...] }
//   GET /manually-expired-buyerAssistance-rent

router.put("/mark-buyerAssistance-expired-rent", async (req, res) => {
  try {
    const raIds = Array.isArray(req.body?.raIds) ? req.body.raIds : [];
    const expiredBy = String(req.body?.expiredBy || "").trim() || "Admin";

    if (raIds.length === 0) {
      return res.status(400).json({ success: false, message: '"raIds" must be a non-empty array' });
    }

    const expired = [];
    const notFound = [];

    for (const rawId of raIds) {
      const Ra_Id = Number(rawId);
      if (!Number.isFinite(Ra_Id)) {
        notFound.push(rawId);
        continue;
      }

      const result = await BuyerAssistance.updateOne(
        { Ra_Id },
        { $set: { ra_status: "raExpired", raExpiredAt: new Date(), raExpiredBy: expiredBy } }
      );

      // matchedCount on modern drivers, n on older ones — accept either.
      const matched = result.matchedCount != null ? result.matchedCount : result.n;
      if (!matched) {
        notFound.push(rawId);
        continue;
      }

      // Keep the payment record in step, as the automatic path does. Scoped to
      // 'paid' so a pending or failed payment is never touched.
      //
      // 'expiredPlan' — not the 'raExpired' that BuyerPlan/BuyerRouter.js
      // writes — because payustatususer is an enum of
      // ['pay now','pay later','paid','pay failed','expiredPlan']. That other
      // path only gets away with 'raExpired' because updateOne skips validators
      // by default; there is no reason to add more out-of-enum data here.
      await PaymentPayUBuyer.updateMany(
        { Ra_Id, payustatususer: "paid" },
        { $set: { payustatususer: "expiredPlan", updatedAt: new Date() } }
      );

      expired.push(Ra_Id);
    }

    return res.status(200).json({
      success: true,
      message: `${expired.length} tenant assistance record(s) marked as expired.`,
      expiredCount: expired.length,
      expired,
      notFound,
    });
  } catch (error) {
    console.error("Error marking tenant assistance as expired:", error);
    return res.status(500).json({
      success: false,
      message: "Error marking tenant assistance as expired.",
      error: error.message,
    });
  }
});

router.put("/unmark-buyerAssistance-expired-rent", async (req, res) => {
  try {
    const raIds = Array.isArray(req.body?.raIds) ? req.body.raIds : [];

    if (raIds.length === 0) {
      return res.status(400).json({ success: false, message: '"raIds" must be a non-empty array' });
    }

    const restored = [];
    const skipped = [];

    for (const rawId of raIds) {
      const Ra_Id = Number(rawId);
      if (!Number.isFinite(Ra_Id)) {
        skipped.push(rawId);
        continue;
      }

      // Only records expired BY HAND can be restored. A record the automatic
      // plan-expiry path retired has no raExpiredAt, and putting it back would
      // resurrect a plan whose validity has genuinely run out.
      const doc = await BuyerAssistance.findOne({ Ra_Id, raExpiredAt: { $ne: null } });
      if (!doc) {
        skipped.push(rawId);
        continue;
      }

      await BuyerAssistance.updateOne(
        { Ra_Id },
        { $set: { ra_status: "raActive", raExpiredAt: null, raExpiredBy: "" } }
      );
      await PaymentPayUBuyer.updateMany(
        { Ra_Id, payustatususer: "expiredPlan" },
        { $set: { payustatususer: "paid", updatedAt: new Date() } }
      );

      restored.push(Ra_Id);
    }

    return res.status(200).json({
      success: true,
      message: `${restored.length} tenant assistance record(s) restored to active.`,
      restoredCount: restored.length,
      restored,
      skipped,
    });
  } catch (error) {
    console.error("Error restoring tenant assistance:", error);
    return res.status(500).json({
      success: false,
      message: "Error restoring tenant assistance.",
      error: error.message,
    });
  }
});

router.get("/manually-expired-buyerAssistance-rent", async (req, res) => {
  try {
    // Soft-deleted records are excluded — they belong on the Removed Tenant
    // page, which is where their Undo lives.
    const data = await BuyerAssistance.find({
      ra_status: "raExpired",
      raExpiredAt: { $ne: null },
      isDeleted: { $ne: true },
      ...baseFilter(req.query.base),
    }).sort({ raExpiredAt: -1 });

    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error("Error fetching manually expired tenant assistance:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching manually expired tenant assistance.",
      error: error.message,
    });
  }
});

 module.exports = router;





















































