const express = require('express');
const router = express.Router();
const BuyerBill = require('../CreateBuyerBill/BuyerBillModel');
const AddModel = require('../AddModel');
const BuyerAssistance = require("../BuyerAssistance/BuyerAssistanceModel");

// A buyer bill counts as "Free" when EITHER its payment type or its plan name is
// Free (case-insensitive). The admin "Plan Name" dropdown now offers a "Free"
// option; selecting it classifies the bill as free in the Free/Paid reports.
const FREE_RE = /^\s*free\s*$/i;


router.post('/buyer-create-bill-rent', async (req, res) => {
  try {
    const billData = req.body;

    // Detect source
    const requestSource = req.headers['x-request-source'];
    billData.billCreatedBy = requestSource === 'system' ? 'Admin' : (billData.billCreatedBy || 'User');

    // Validate billDate
    const inputDate = new Date(billData.billDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate < today) {
      return res.status(400).json({
        success: false,
        message: "Past dates are not accepted for the bill date. Please select today or a future date."
      });
    }

    // 1. Create Bill
    const newBill = new BuyerBill(billData);
    await newBill.save();

    // 2. Update ra_status to "raActive"
    const updatedProperty = await BuyerAssistance.findOneAndUpdate(
      { Ra_Id: billData.Ra_Id },
      { $set: { ra_status: 'raActive' } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Buyer Bill created and property activated successfully.",
      data: {
        ...newBill._doc,
        updatedStatus: updatedProperty?.ra_status || 'N/A'
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});


router.get('/buyer-get-bill-rent/:Ra_Id', async (req, res) => {
  try {
    const { Ra_Id } = req.params;

    const bill = await BuyerBill.findOne({ Ra_Id: Number(Ra_Id) });

    if (!bill) {
      return res.status(404).json({ success: false, message: 'Buyer Bill not found' });
    }

    res.status(200).json({ success: true, data: bill });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});


router.put('/buyer-update-bill-rent/:Ra_Id', async (req, res) => {
  try {
    const { Ra_Id } = req.params;
    const updateData = req.body;

    const updatedBill = await BuyerBill.findOneAndUpdate(
      { Ra_Id: Number(Ra_Id) },
      updateData,
      { new: true }
    );

    if (!updatedBill) {
      return res.status(404).json({ success: false, message: 'Buyer Bill not found for update' });
    }

    res.status(200).json({
      success: true,
      message: 'Buyer Bill updated successfully',
      data: updatedBill
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});


router.get('/buyer-bills-by-owner-rent/:phoneNumber', async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    const bills = await BuyerBill.find({ ownerPhone: phoneNumber });

    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

router.get('/buyer-get-default-bill-data-rent', async (req, res) => {
  try {
    const lastBill = await BuyerBill.findOne().sort({ createdAt: -1 });

    let nextBillNo = 'RP - 001';
    if (lastBill?.billNo) {
      const lastNumber = parseInt(lastBill.billNo.split('-')[1]?.trim() || '0', 10);
      const newNumber = (lastNumber + 1).toString().padStart(3, '0');
      nextBillNo = `RP - ${newNumber}`;
    }

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    res.status(200).json({
      success: true,
      data: {
        adminOffice: 'AUROBINDO',
        billNo: nextBillNo,
        billDate: formattedDate
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});


router.post('/buyer-create-bill-rent', async (req, res) => {
  try {
    const billData = req.body;
    const requestSource = req.headers['x-request-source'];
    billData.billCreatedBy = requestSource === 'system' ? 'Admin' : (billData.billCreatedBy || 'User');

    const inputDate = new Date(billData.billDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate < today) {
      return res.status(400).json({
        success: false,
        message: "Past dates are not accepted for the bill date. Please select today or a future date."
      });
    }

    const newBill = new BuyerBill(billData);
    await newBill.save();

    const updatedProperty = await BuyerAssistance.findOneAndUpdate(
      { Ra_Id: billData.Ra_Id },
      { $set: { ra_status: 'raActive' } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Buyer Bill created and property status set to raActive",
      data: {
        ...newBill._doc,
        propertyStatus: updatedProperty?.ra_status || 'N/A'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});


router.get('/buyer-get-bill-rent/:Ra_Id', async (req, res) => {
  try {
    const { Ra_Id } = req.params;
    const bill = await BuyerBill.findOne({ Ra_Id: Number(Ra_Id) });

    if (!bill) {
      return res.status(404).json({ success: false, message: 'Buyer Bill not found' });
    }

    res.status(200).json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});


router.put('/buyer-update-bill-rent/:Ra_Id', async (req, res) => {
  try {
    const { Ra_Id } = req.params;
    const updateData = req.body;

    const updatedBill = await BuyerBill.findOneAndUpdate(
      { Ra_Id: Number(Ra_Id) },
      updateData,
      { new: true }
    );

    if (!updatedBill) {
      return res.status(404).json({ success: false, message: 'Buyer Bill not found for update' });
    }

    res.status(200).json({ success: true, message: 'Buyer Bill updated successfully', data: updatedBill });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});


router.get('/buyer-bills-rent', async (req, res) => {
  try {
    const bills = await BuyerBill.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});


router.get('/buyer-bill-rent/:id', async (req, res) => {
  try {
    const bill = await BuyerBill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Buyer Bill not found' });
    }
    res.status(200).json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

router.get('/buyer-bills-rent/free', async (req, res) => {
  try {
    const bills = await BuyerBill.find({
      $or: [ { planName: FREE_RE }, { paymentType: FREE_RE } ]
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});


router.get('/buyer-bills-rent/non-free', async (req, res) => {
  try {
    const bills = await BuyerBill.find({
      $and: [
        { planName: { $not: FREE_RE } },
        { paymentType: { $not: FREE_RE } },
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});


router.get('/buyer-bills/free-with-assistance-rent', async (req, res) => {
  try {
    // Free = Free payment type OR Free plan name (case-insensitive).
    const freeBills = await BuyerBill.find({
      $or: [ { paymentType: FREE_RE }, { planName: FREE_RE } ]
    }).sort({ createdAt: -1 });

    if (!freeBills.length) {
      return res.status(404).json({ success: false, message: 'No Free Plan buyer bills found.' });
    }

    const result = await Promise.all(freeBills.map(async (bill) => {
      const {
        billNo, planName, billAmount, netAmount, paymentType, validity,
        ownerPhone, adminOffice, adminName, billCreatedBy, createdAt, Ra_Id
      } = bill;

      const buyerAssistance = await BuyerAssistance.findOne({ Ra_Id, isDeleted: false });

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
          Ra_Id,
        },
        buyerAssistance
      };
    }));

    res.status(200).json({
      success: true,
      message: 'Fetched Free Plan buyer bills with associated Buyer Assistance successfully.',
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error while fetching Free Plan buyer bills with assistance.',
      error: error.message
    });
  }
});


router.get('/buyer-bills/non-free-with-assistance-rent', async (req, res) => {
  try {
    // Paid = neither payment type nor plan name is Free (case-insensitive).
    const paidBills = await BuyerBill.find({
      $and: [
        { paymentType: { $not: FREE_RE } },
        { planName: { $not: FREE_RE } },
      ]
    }).sort({ createdAt: -1 });

    if (!paidBills.length) {
      return res.status(404).json({ success: false, message: 'No Paid Plan buyer bills found.' });
    }

    const result = await Promise.all(
      paidBills.map(async (bill) => {
        const {
          billNo, planName, billAmount, netAmount, paymentType, validity,
          ownerPhone, adminOffice, adminName, billCreatedBy, createdAt, Ra_Id
        } = bill;

        const assistance = await BuyerAssistance.findOne({ Ra_Id, isDeleted: false });
        if (!assistance) return null;

        // Check for required fields
        const requiredFields = ['propertyMode', 'propertyType', 'minPrice', 'maxPrice', 'totalArea'];
        const required = requiredFields.every(field =>
          assistance[field] !== undefined &&
          assistance[field] !== null &&
          String(assistance[field]).trim() !== ''
        ) ? 'Yes' : 'No';

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
            Ra_Id,
          },
          buyerAssistance: {
            ...assistance.toObject(),
            required
          }
        };
      })
    );

    const filteredResult = result.filter(entry => entry !== null);

    res.status(200).json({
      success: true,
      message: "Fetched Paid Plan BuyerBills with associated BuyerAssistance successfully.",
      data: filteredResult
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error while fetching Paid Plan buyer bills with assistance.',
      error: error.message
    });
  }
});




module.exports = router;
