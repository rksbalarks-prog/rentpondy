














const express = require('express');
const BuyerPlan = require('../BuyerPlan/BuyerModel');
const router = express.Router();
const mongoose = require('mongoose');  // <-- Add this line

const PaymentPayUBuyer =require('../PayuBuyer/PayuBuyerModel')
const moment = require('moment');


router.get('/payustatus-by-buyer', async (req, res) => {
  try {
    // Step 1: Get all payments sorted by latest
    const payments = await PaymentPayUBuyer.find().sort({ createdAt: -1 });

    // Step 2: Create a map of latest payustatususer by ppcId
    const latestStatusByPpcId = {};
    for (let payment of payments) {
      if (!latestStatusByPpcId[payment.ppcId]) {
        latestStatusByPpcId[payment.ppcId] = payment.payustatususer.toLowerCase();
      }
    }

    // Step 3: Find all buyer plans
    const allPlans = await BuyerPlan.find();

    // Step 4: Map ppcId to ba_id using phoneNumbers array
    const result = [];

    for (let plan of allPlans) {
      for (let phone of plan.phoneNumbers) {
        const ppcId = parseInt(phone.ba_id); // assuming ba_id matches ppcId
        if (latestStatusByPpcId[ppcId]) {
          result.push({
            ba_id: ppcId,
            status: latestStatusByPpcId[ppcId]
          });
        }
      }
    }

    // Remove duplicates (in case multiple entries with same ba_id)
    const uniqueByBaId = {};
    for (let item of result) {
      if (!uniqueByBaId[item.ba_id]) {
        uniqueByBaId[item.ba_id] = item.status;
      }
    }

    const finalResult = Object.entries(uniqueByBaId).map(([ba_id, status]) => ({
      ba_id: parseInt(ba_id),
      status
    }));

    res.json(finalResult);
  } catch (error) {
    console.error('Error fetching PayU statuses by ba_id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/plans-buyer', async (req, res) => {
    try {
        const plans = await BuyerPlan.find(); // Fetch all plans

        // // Filter unique plans based on 'name'
        // const uniquePlans = [];
        // const seenNames = new Set();

        // plans.forEach(plan => {
        //     if (!seenNames.has(plan.name)) {
        //         seenNames.add(plan.name);
        //         uniquePlans.push(plan);
        //     }
        // });
const uniquePlans = [];
const seenNames = new Set();

plans.forEach(plan => {
  if (!seenNames.has(plan.planName)) {
    seenNames.add(plan.planName);
    uniquePlans.push({
      planName: plan.planName,
      planAmount: plan.planAmount,
      planValidity: plan.planValidity,
      serviceType: plan.serviceType
    });
  }
});

        return res.status(200).json(uniquePlans);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving plans.', error: error.message });
    }
});



router.get('/get-buyer-plan-by-phone-buyer/:phoneNumber', async (req, res) => {
  const { phoneNumber } = req.params;

  if (!phoneNumber) {
    return res.status(400).json({
      status: 'error',
      message: 'phoneNumber param is required',
    });
  }

  try {
    // ✅ Get ALL active plans to match with paid payments
    const activePlans = await BuyerPlan.find({ status: 'active' }).sort({ createDate: -1 });
    
    // ✅ Get ALL paid payments for this phone number
    const paidPayments = await PaymentPayUBuyer.find({ 
      phone: phoneNumber,
      payustatususer: 'paid'
    }).sort({ createdAt: -1 }).lean();

    console.log(`Found ${paidPayments.length} paid payments for phone: ${phoneNumber}`);
    console.log(`Found ${activePlans.length} active plans`);

    const now = new Date();
    const result = [];
    const processedRaIds = new Set();

    // ✅ FIX: Process paid payments and match with actual plans
    for (const payment of paidPayments) {
      if (processedRaIds.has(payment.Ra_Id)) continue;

      // Find the actual plan that matches the payment's planName
      let matchingPlan = activePlans.find(plan => 
        plan.planName === payment.planName
      );

      // If no exact match, try to find any plan that has this Ra_Id in phoneNumbers
      if (!matchingPlan) {
        matchingPlan = activePlans.find(plan =>
          plan.phoneNumbers.some(entry => entry.Ra_Id === payment.Ra_Id)
        );
      }

      // If still no match, use the first plan with same name pattern
      if (!matchingPlan) {
        matchingPlan = activePlans.find(plan =>
          plan.planName.toLowerCase().includes(payment.planName.toLowerCase()) ||
          payment.planName.toLowerCase().includes(plan.planName.toLowerCase())
        );
      }

      let matchingEntry = null;
      if (matchingPlan) {
        matchingEntry = matchingPlan.phoneNumbers.find(entry => 
          entry.Ra_Id === payment.Ra_Id
        );
      }

      // If no plan found, use the payment data but try to get real plan info
      if (!matchingPlan) {
        // Try to find any plan that has this phone number
        const phonePlan = activePlans.find(plan =>
          plan.phoneNumbers.some(entry => entry.number === phoneNumber)
        );
        
        if (phonePlan) {
          matchingPlan = phonePlan;
          matchingEntry = phonePlan.phoneNumbers.find(entry => entry.number === phoneNumber);
        } else {
          // Last resort: use first active plan
          matchingPlan = activePlans[0];
        }
      }

      // Use actual plan data instead of virtual plan
      const planInfo = {
        planId: matchingPlan._id,
        planName: matchingPlan.planName,
        planAmount: matchingPlan.planAmount,
        planValidity: matchingPlan.planValidity,
        numberOfAssistants: matchingPlan.numberOfAssistants,
        serviceType: matchingPlan.serviceType,
        status: matchingPlan.status,
        createDate: matchingPlan.createDate,
      };

      // Calculate expiry for paid payments
      const validityDays = parseInt(matchingPlan.planValidity, 10) || 30;
      const calculatedExpireDate = new Date(
        new Date(payment.payUdate).getTime() + validityDays * 24 * 60 * 60 * 1000
      );

      const diffDays = Math.ceil((calculatedExpireDate - now) / (1000 * 60 * 60 * 24));
      let expiryMessage = '';

      if (diffDays <= 0) {
        expiryMessage = 'Expired';
        // Update expired status
        await BuyerAssistance.updateOne(
          { Ra_Id: payment.Ra_Id },
          { $set: { ra_status: 'raExpired' } }
        );
        await PaymentPayUBuyer.updateOne(
          { _id: payment._id },
          { $set: { payustatususer: 'raExpired', updatedAt: new Date() } }
        );
      } else {
        expiryMessage = `Expires in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
      }

      payment.expireDate = calculatedExpireDate.toISOString();
      payment.expiryMessage = expiryMessage;

      result.push({
        Ra_Id: payment.Ra_Id,
        phoneNumber: phoneNumber,
        ra_status: (matchingEntry && matchingEntry.ra_status) || 'active',
        planInfo: {
          ...planInfo,
          expireDate: calculatedExpireDate.toISOString(),
        },
        paymentData: payment,
        paymentStatus: payment.payustatususer,
        isPaid: true,
        planMatch: matchingPlan ? 'exact' : 'fallback'
      });

      processedRaIds.add(payment.Ra_Id);
    }

    // ✅ Process non-paid plans (existing logic)
    for (const plan of activePlans) {
      for (const entry of plan.phoneNumbers) {
        if (entry.number !== phoneNumber) continue;
        if (processedRaIds.has(entry.Ra_Id)) continue; // Skip if already processed as paid

        const Ra_Id = entry.Ra_Id;

        // Get latest payment for this Ra_Id
        const payments = await PaymentPayUBuyer.find({ 
          Ra_Id: Ra_Id,
          phone: phoneNumber 
        }).sort({ createdAt: -1 }).lean();

        const payment = payments.length > 0 ? payments[0] : null;

        if (!payment) continue;

        let planExpireDate = '';
        let expiryMessage = 'Not Paid';

        if (payment.payustatususer === 'pay later') {
          expiryMessage = 'Payment Pending';
        }

        payment.expireDate = '';
        payment.expiryMessage = expiryMessage;

        result.push({
          Ra_Id: Ra_Id,
          phoneNumber: entry.number,
          ra_status: entry.ra_status || 'active',
          planInfo: {
            planId: plan._id,
            planName: plan.planName,
            planAmount: plan.planAmount,
            planValidity: plan.planValidity,
            numberOfAssistants: plan.numberOfAssistants,
            serviceType: plan.serviceType,
            status: plan.status,
            createDate: plan.createDate,
            expireDate: planExpireDate,
          },
          paymentData: payment,
          paymentStatus: payment.payustatususer,
          isPaid: false
        });

        processedRaIds.add(Ra_Id);
      }
    }

    return res.status(200).json({
      status: 'success',
      phoneNumber,
      total: result.length,
      paidCount: result.filter(item => item.isPaid).length,
      data: result,
    });
  } catch (error) {
    console.error('Error in /get-buyer-plan-by-phone-buyer:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    });
  }
});




// router.get('/get-buyer-plan-by-phone-buyer/:phoneNumber', async (req, res) => {
//   const { phoneNumber } = req.params;

//   if (!phoneNumber) {
//     return res.status(400).json({
//       status: 'error',
//       message: 'phoneNumber param is required',
//     });
//   }

//   try {
//     // ✅ FIX 1: Get ALL paid payments for this phone number first
//     const paidPayments = await PaymentPayUBuyer.find({ 
//       phone: phoneNumber,
//       payustatususer: 'paid'
//     }).sort({ createdAt: -1 }).lean();

//     console.log(`Found ${paidPayments.length} paid payments for phone: ${phoneNumber}`);
    
//     // ✅ FIX 2: Get all plans that have this phone number OR match paid payment Ra_Ids
//     const paidRaIds = paidPayments.map(p => p.Ra_Id);
    
//     const plans = await BuyerPlan.find({
//       $or: [
//         { 'phoneNumbers.number': phoneNumber },
//         { 'phoneNumbers.Ra_Id': { $in: paidRaIds } }
//       ]
//     });

//     if (!plans.length && paidPayments.length === 0) {
//       return res.status(404).json({
//         status: 'error',
//         message: 'No buyer plans found for this phone number',
//       });
//     }

//     const now = new Date();
//     const result = [];
//     const processedRaIds = new Set();

//     // ✅ FIX 3: Process paid payments first
//     for (const payment of paidPayments) {
//       if (processedRaIds.has(payment.Ra_Id)) continue;

//       // Find the plan that matches this Ra_Id
//       let matchingPlan = null;
//       let matchingEntry = null;

//       for (const plan of plans) {
//         matchingEntry = plan.phoneNumbers.find(entry => 
//           entry.Ra_Id === payment.Ra_Id
//         );
//         if (matchingEntry) {
//           matchingPlan = plan;
//           break;
//         }
//       }

//       // If no plan found, create a virtual entry
//       if (!matchingPlan) {
//         matchingPlan = {
//           _id: 'virtual-plan',
//           planName: payment.planName || 'Unknown Plan',
//           planAmount: payment.amount || '0',
//           planValidity: '30', // Default validity
//           numberOfAssistants: '1',
//           serviceType: 'Rental',
//           status: 'active',
//           createDate: payment.createdAt || new Date()
//         };
//         matchingEntry = {
//           number: phoneNumber,
//           Ra_Id: payment.Ra_Id,
//           ra_status: 'active'
//         };
//       }

//       // Calculate expiry for paid payments
//       const validityDays = parseInt(matchingPlan.planValidity, 10) || 30;
//       const calculatedExpireDate = new Date(
//         new Date(payment.payUdate).getTime() + validityDays * 24 * 60 * 60 * 1000
//       );

//       const diffDays = Math.ceil((calculatedExpireDate - now) / (1000 * 60 * 60 * 24));
//       let expiryMessage = '';

//       if (diffDays <= 0) {
//         expiryMessage = 'Expired';
//         // Update expired status
//         await BuyerAssistance.updateOne(
//           { Ra_Id: payment.Ra_Id },
//           { $set: { ra_status: 'raExpired' } }
//         );
//         await PaymentPayUBuyer.updateOne(
//           { _id: payment._id },
//           { $set: { payustatususer: 'raExpired', updatedAt: new Date() } }
//         );
//       } else {
//         expiryMessage = `Expires in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
//       }

//       payment.expireDate = calculatedExpireDate.toISOString();
//       payment.expiryMessage = expiryMessage;

//       result.push({
//         Ra_Id: payment.Ra_Id,
//         phoneNumber: phoneNumber,
//         ra_status: matchingEntry.ra_status || 'active',
//         planInfo: {
//           planId: matchingPlan._id,
//           planName: matchingPlan.planName,
//           planAmount: matchingPlan.planAmount,
//           planValidity: matchingPlan.planValidity,
//           numberOfAssistants: matchingPlan.numberOfAssistants,
//           serviceType: matchingPlan.serviceType,
//           status: matchingPlan.status,
//           createDate: matchingPlan.createDate,
//           expireDate: calculatedExpireDate.toISOString(),
//         },
//         paymentData: payment,
//         paymentStatus: payment.payustatususer,
//         isPaid: true
//       });

//       processedRaIds.add(payment.Ra_Id);
//     }

//     // ✅ FIX 4: Process non-paid plans (existing logic)
//     for (const plan of plans) {
//       for (const entry of plan.phoneNumbers) {
//         if (entry.number !== phoneNumber) continue;
//         if (processedRaIds.has(entry.Ra_Id)) continue; // Skip if already processed as paid

//         const Ra_Id = entry.Ra_Id;

//         // Get latest payment for this Ra_Id
//         const payments = await PaymentPayUBuyer.find({ 
//           Ra_Id: Ra_Id,
//           phone: phoneNumber 
//         }).sort({ createdAt: -1 }).lean();

//         const payment = payments.length > 0 ? payments[0] : null;

//         if (!payment) continue;

//         let planExpireDate = '';
//         let expiryMessage = 'Not Paid';

//         if (payment.payustatususer === 'pay later') {
//           expiryMessage = 'Payment Pending';
//         }

//         payment.expireDate = '';
//         payment.expiryMessage = expiryMessage;

//         result.push({
//           Ra_Id: Ra_Id,
//           phoneNumber: entry.number,
//           ra_status: entry.ra_status || 'active',
//           planInfo: {
//             planId: plan._id,
//             planName: plan.planName,
//             planAmount: plan.planAmount,
//             planValidity: plan.planValidity,
//             numberOfAssistants: plan.numberOfAssistants,
//             serviceType: plan.serviceType,
//             status: plan.status,
//             createDate: plan.createDate,
//             expireDate: planExpireDate,
//           },
//           paymentData: payment,
//           paymentStatus: payment.payustatususer,
//           isPaid: false
//         });

//         processedRaIds.add(Ra_Id);
//       }
//     }

//     return res.status(200).json({
//       status: 'success',
//       phoneNumber,
//       total: result.length,
//       paidCount: result.filter(item => item.isPaid).length,
//       data: result,
//     });
//   } catch (error) {
//     console.error('Error in /get-buyer-plan-by-phone-buyer:', error);
//     return res.status(500).json({
//       status: 'error',
//       message: 'Internal server error',
//       error: error.message,
//     });
//   }
// });



// Debug endpoint to check data consistency
router.get('/debug-buyer-data/:phoneNumber', async (req, res) => {
  const { phoneNumber } = req.params;

  try {
    // Check BuyerPlan data
    const buyerPlans = await BuyerPlan.find({ 'phoneNumbers.number': phoneNumber });
    
    // Check Payment data
    const payments = await PaymentPayUBuyer.find({ phone: phoneNumber });
    
    // Check BuyerAssistance data
    const buyerAssistance = await BuyerPlan.find({ phoneNumber: phoneNumber });

    res.json({
      buyerPlans: buyerPlans.map(p => ({
        planName: p.planName,
        phoneNumbers: p.phoneNumbers,
        _id: p._id
      })),
      payments: payments.map(p => ({
        Ra_Id: p.Ra_Id,
        type: typeof p.Ra_Id,
        phone: p.phone,
        payustatususer: p.payustatususer,
        planName: p.planName
      })),
      buyerAssistance: buyerAssistance.map(b => ({
        Ra_Id: b.Ra_Id,
        type: typeof b.Ra_Id,
        phoneNumber: b.phoneNumber,
        ra_status: b.ra_status
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





// router.get('/get-buyer-plan-by-phone-buyer/:phoneNumber', async (req, res) => { 
//   const { phoneNumber } = req.params;

//   if (!phoneNumber) {
//     return res.status(400).json({
//       status: 'error',
//       message: 'phoneNumber param is required',
//     });
//   }

//   try {
//     const plans = await BuyerPlan.find({ 'phoneNumbers.number': phoneNumber });

//     if (!plans.length) {
//       return res.status(404).json({
//         status: 'error',
//         message: 'No buyer plans found for this phone number',
//       });
//     }

//     const now = new Date();
//     const result = [];

//     for (const plan of plans) {
//       for (const entry of plan.phoneNumbers) {
//         if (entry.number !== phoneNumber) continue;

//         const Ra_Id = entry.Ra_Id;

//         // Get latest payment
//         const payment = await PaymentPayUBuyer.findOne({ Ra_Id })
//           .sort({ createdAt: -1 })
//           .lean();

//         if (!payment) continue;

//         // ✅ Calculate expireDate from payUdate + 90 days
//         let expireDate = null;
//         let expiryMessage = '';
//         let diffDays = null;

//         if (payment.payUdate) {
//           expireDate = new Date(
//             new Date(payment.payUdate).getTime() + 90 * 24 * 60 * 60 * 1000
//           );
//           diffDays = Math.ceil((expireDate - now) / (1000 * 60 * 60 * 24));

//           if (diffDays <= 0) {
//             expiryMessage = 'Expired';

//             // Update status in BuyerAssistance if not already "raExpired"
//             const raRecord = await BuyerAssistance.findOne({ Ra_Id });
//             if (raRecord && raRecord.ra_status !== 'raExpired') {
//               await BuyerAssistance.updateOne(
//                 { Ra_Id },
//                 { $set: { ra_status: 'raExpired' } }
//               );
//             }

//             // Update status in payment table
//             await PaymentPayUBuyer.updateOne(
//               { _id: payment._id },
//               {
//                 $set: {
//                   payustatususer: 'raExpired',
//                   updatedAt: new Date(),
//                 },
//               }
//             );
//           } else {
//             expiryMessage = `Expires in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
//           }

//           payment.expireDate = expireDate.toISOString();
//           payment.expiryMessage = expiryMessage;
//         }

//         // ✅ Add planInfo like buyer API
//         result.push({
//           Ra_Id,
//           phoneNumber: entry.number,
//           ra_status: entry.ra_status,
//           planInfo: {
//             planId: plan._id,
//             planName: plan.planName,
//             planAmount: plan.planAmount,
//             planValidity: plan.planValidity,
//             numberOfAssistants: plan.numberOfAssistants,
//             serviceType: plan.serviceType,
//             status: plan.status,
//             createDate: plan.createDate,
//             expireDate: plan.expireDate?.toISOString() || null,
//           },
//           paymentData: payment,
//         });
//       }
//     }

//     return res.status(200).json({
//       status: 'success',
//       phoneNumber,
//       total: result.length,
//       data: result,
//     });
//   } catch (error) {
//     console.error('Error in /get-buyer-plan-by-phone-buyer:', error); 
//     return res.status(500).json({
//       status: 'error',
//       message: 'Internal server error',
//       error: error.message,
//     });
//   }
// });



router.post('/select-buyer-plan', async (req, res) => {
  const { phoneNumber, planId,Ra_Id} = req.body;

  // Validate inputs
  if (!phoneNumber || !planId || !Ra_Id) {
    return res.status(400).json({
      status: 'error',
      message: 'phoneNumber, planId, and Ra_Id are required',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(planId)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid planId format',
    });
  }

  try {
    // Find the BuyerPlan
    const buyerPlan = await BuyerPlan.findById(planId);
    if (!buyerPlan) {
      return res.status(404).json({
        status: 'error',
        message: 'Buyer plan not found',
      });
    }

    // Initialize phoneNumbers array if undefined
    if (!Array.isArray(buyerPlan.phoneNumbers)) {
      buyerPlan.phoneNumbers = [];
    }

    // Check if phoneNumber + ba_id already exists in phoneNumbers
    const existingEntry = buyerPlan.phoneNumbers.find(
      (entry) => entry.number === phoneNumber && entry.Ra_Id === Ra_Id
    );

    if (existingEntry) {
      // Check latest payment status for this ba_id
      const latestPayment = await PaymentPayUBuyer.findOne({ Ra_Id }).sort({ createdAt: -1 });
      const payStatus = latestPayment?.payustatususer;

      if (payStatus === 'paid') {
        return res.status(400).json({
          status: 'error',
          message: 'This phone number is already associated with this Buyer Assistance ID and payment is completed.',
        });
      } else if (
        payStatus === 'expiredPlan' ||
        payStatus === 'pay later' ||
        payStatus === 'pay failed' ||
        payStatus === 'pay now'
      ) {
        return res.status(200).json({
          status: 'pending-payment',
          message: 'Previous plan expired or payment pending. Please complete the payment.',
          selectedPlan: buyerPlan,
        });
      }
    } else {
      // Add new phoneNumber + ba_id to BuyerPlan
      buyerPlan.phoneNumbers.push({ number: phoneNumber, Ra_Id });

      // Update createdAt and expireDate
      buyerPlan.createdAt = new Date();
      buyerPlan.expireDate = moment(buyerPlan.createdAt)
        .add(parseInt(buyerPlan.planValidity, 10), 'days')
        .toDate();

      await buyerPlan.save();
    }

    // Create unique txnid
    const txnid = `Txn_${Date.now()}`;

    // Create new payment record
    const newPayment = new PaymentPayUBuyer({
      txnid,
      status: 'initiated',
      amount: buyerPlan.planAmount,
      productinfo: buyerPlan.serviceType || '',
      firstname: '',
      email: '',
      phone: phoneNumber,
      mihpayid: '',
      payUdate: '',
      payustatususer: 'pay now',
      planName: buyerPlan.planName,
      Ra_Id: parseInt(Ra_Id, 10),
    });

    await newPayment.save();

    return res.status(200).json({
      status: 'success',
      message: 'Plan selected successfully. Proceed to payment.',
      phoneNumber,
      Ra_Id,
      txnid,
      buyerPlan: {
        _id: buyerPlan._id,
        planName: buyerPlan.planName,
        planAmount: buyerPlan.planAmount,
        planValidity: buyerPlan.planValidity,
        numberOfAssistants: buyerPlan.numberOfAssistants,
        serviceType: buyerPlan.serviceType,
        status: buyerPlan.status,
        createDate: buyerPlan.createDate,
        updateDate: buyerPlan.createdAt.toISOString(),
        expireDate: buyerPlan.expireDate.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in /select-buyer-plan:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    });
  }
});



router.get('/selected-buyer-plan-by-phone', async (req, res) => {
  const { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({
      status: 'error',
      message: 'phoneNumber is required',
    });
  }

  try {
    const selectedPlans = await PaymentPayUBuyer.find({ phone: phoneNumber }).sort({ createdAt: -1 });

    if (selectedPlans.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No plans found for this phone number',
      });
    }

    res.status(200).json({
      status: 'success',
      total: selectedPlans.length,
      selectedPlans,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    });
  }
});


// Create a new plan
router.post('/buyer-plan-create-rent', async (req, res) => {
  try {
    const plan = new BuyerPlan(req.body);
    await plan.save();
    res.status(201).send(plan);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all plans
router.get('/buyer-plans-all-rent', async (req, res) => {
  try {
    const plans = await BuyerPlan.find();
    res.status(200).send(plans);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a plan
router.put('/buyer-update-plans/:id', async (req, res) => {
  try {
    const plan = await BuyerPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!plan) {
      return res.status(404).send();
    }
    res.send(plan);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a plan
router.delete('/buyer-plans/:id', async (req, res) => {
  try {
    const plan = await BuyerPlan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).send();
    }
    res.send(plan);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Toggle plan status
router.put('/buyer-plans/:id/status', async (req, res) => {
  try {
    const plan = await BuyerPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).send();
    }
    plan.status = plan.status === 'active' ? 'hide' : 'active';
    await plan.save();
    res.send(plan);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET all buyer plan payments for a given phoneNumber
router.get('/buyer-plans-by-phone', async (req, res) => {
  const { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({
      status: 'error',
      message: 'phoneNumber is required',
    });
  }

  try {
    // Find all payment records for this phoneNumber
    const payments = await PaymentPayUBuyer.find({ phoneNumber });

    if (payments.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No buyer plans found for this phone number',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Found ${payments.length} buyer plan(s) for this phone number`,
      payments,
    });
  } catch (error) {
    console.error('Error in /buyer-plans-by-phone:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    });
  }
});



// Get only active buyer plans
router.get('/buyer-plans-active', async (req, res) => {
  try {
    const activePlans = await BuyerPlan.find({ status: 'active' }).sort({ createDate: -1 });
    res.status(200).json({
      status: 'success',
      total: activePlans.length,
      plans: activePlans,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch active plans',
      error: error.message,
    });
  }
});



// Get only active buyer plans excluding 'FREE'
// router.get('/buyer-plans-active', async (req, res) => {
//   try {
//     const activePlans = await BuyerPlan.find({
//       status: 'active',
//       planName: { $ne: 'FREE' } // 👈 Exclude FREE plan
//     }).sort({ createDate: -1 });

//     res.status(200).json({
//       status: 'success',
//       total: activePlans.length,
//       plans: activePlans,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 'error',
//       message: 'Failed to fetch active plans',
//       error: error.message,
//     });
//   }
// });


module.exports = router;
