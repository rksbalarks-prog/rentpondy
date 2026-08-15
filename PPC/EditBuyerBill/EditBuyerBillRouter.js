const express = require('express');
const router = express.Router();
const BuyerBill = require('../CreateBuyerBill/BuyerBillModel'); // Use BuyerBill model from CreateBuyerBill
const BuyerAssistance = require("../BuyerAssistance/BuyerAssistanceModel");

// ✅ GET bill by Ra_Id for editing
router.get('/buyer-get-bill/:ba_id', async (req, res) => {
  try {
    const { ba_id } = req.params;
    
    // Find bill by Ra_Id from BuyerBill collection
    const bill = await BuyerBill.findOne({ Ra_Id: Number(ba_id) });

    if (!bill) {
      return res.status(404).json({ 
        success: false, 
        message: 'Buyer Bill not found for the given Ra_Id' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Bill fetched successfully',
      data: bill 
    });

  } catch (error) {
    console.error('Error fetching bill:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error while fetching bill', 
      error: error.message 
    });
  }
});

// ✅ UPDATE bill by Ra_Id
router.put('/buyer-update-bill/:ba_id', async (req, res) => {
  try {
    const { ba_id } = req.params;
    const updateData = req.body;

    // Find and update bill by Ra_Id in BuyerBill collection
    const updatedBill = await BuyerBill.findOneAndUpdate(
      { Ra_Id: Number(ba_id) },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBill) {
      return res.status(404).json({ 
        success: false, 
        message: 'Buyer Bill not found for update' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Buyer Bill updated successfully',
      data: updatedBill
    });

  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error while updating bill', 
      error: error.message 
    });
  }
});

// ✅ GET all bills for a phone number
router.get('/buyer-bills-by-phone/:phoneNumber', async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    const bills = await BuyerBill.find({ ownerPhone: phoneNumber }).sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      message: 'Bills fetched successfully',
      data: bills 
    });

  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error while fetching bills', 
      error: error.message 
    });
  }
});

// ✅ DELETE bill by Ra_Id
router.delete('/buyer-delete-bill/:ba_id', async (req, res) => {
  try {
    const { ba_id } = req.params;

    const deletedBill = await BuyerBill.findOneAndDelete({ Ra_Id: Number(ba_id) });

    if (!deletedBill) {
      return res.status(404).json({ 
        success: false, 
        message: 'Buyer Bill not found for deletion' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Buyer Bill deleted successfully',
      data: deletedBill
    });

  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error while deleting bill', 
      error: error.message 
    });
  }
});

module.exports = router;
