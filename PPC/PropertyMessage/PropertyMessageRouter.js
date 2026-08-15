

const express = require('express');
const router = express.Router();
const PropertyMessage = require('../PropertyMessage/PropertyMessageModel');



router.post('/admin/property-message', async (req, res) => {
  try {
    let { rentId, enumMessage = null, customMessage = null, setBy = 'Admin' } = req.body;

    // ✅ Convert rentId to a number
    rentId = Number(rentId);

    if (!rentId) {
      return res.status(400).json({ success: false, message: 'ppcId is required and must be a number' });
    }

    if (!enumMessage && !customMessage) {
      return res.status(400).json({ success: false, message: 'Provide either enumMessage or customMessage' });
    }

    const validEnums = ['Sold Out', 'Waiting', 'Available', 'Coming Soon', 'Under Process', 'Blocked', 'Other'];
    if (enumMessage && !validEnums.includes(enumMessage)) {
      return res.status(400).json({ success: false, message: 'Invalid enumMessage value' });
    }

    const updatedMessage = await PropertyMessage.findOneAndUpdate(
      { rentId }, // ✅ rentId is now a number
      {
        enumMessage,
        customMessage,
        setBy,
        setAt: new Date(),
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Property message set successfully', data: updatedMessage });
  } catch (err) {
    console.error('Error setting property message:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


router.get('/get-property-messages', async (req, res) => {
  try {
    const messages = await PropertyMessage.find().sort({ setAt: -1 });

    res.json({
      success: true,
      total: messages.length,
      message: 'All property messages fetched successfully',
      data: messages,
    });
  } catch (err) {
    console.error('Error fetching all property messages:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// GET /user/property-message/:ppcId
router.get('/user/property-message/:rentId', async (req, res) => {
  try {
    const { rentId } = req.params;

    const messageDoc = await PropertyMessage.findOne({ rentId });

    if (!messageDoc) {
      return res.status(404).json({ success: false, message: 'No message found for this property' });
    }

    res.json({
      success: true,
      data: {
        rentId: messageDoc.rentId,
        message: messageDoc.enumMessage || messageDoc.customMessage,
        messageType: messageDoc.enumMessage ? 'enum' : 'custom',
        setAt: messageDoc.setAt,
        setBy: messageDoc.setBy,
      },
    });
  } catch (err) {
    console.error('Error fetching property message:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


router.delete('/admin/property-message/:rentId', async (req, res) => {
  try {
    const { rentId } = req.params;

    const deleted = await PropertyMessage.findOneAndDelete({ rentId });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'No property message found to delete' });
    }

    res.json({ success: true, message: 'Property message deleted successfully', data: deleted });
  } catch (err) {
    console.error('Error deleting property message:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


router.put('/admin/property-message/:rentId', async (req, res) => {
  try {
    const { rentId } = req.params;
    const { enumMessage = null, customMessage = null, setBy = 'Admin' } = req.body;

    if (!enumMessage && !customMessage) {
      return res.status(400).json({ success: false, message: 'Provide either enumMessage or customMessage' });
    }

    const validEnums = ['Sold Out', 'Waiting', 'Available', 'Coming Soon', 'Under Process', 'Blocked', 'Other'];
    if (enumMessage && !validEnums.includes(enumMessage)) {
      return res.status(400).json({ success: false, message: 'Invalid enumMessage value' });
    }

    const updatedMessage = await PropertyMessage.findOneAndUpdate(
      { rentId },
      {
        enumMessage,
        customMessage,
        setBy,
        setAt: new Date(),
      },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ success: false, message: 'Property message not found to update' });
    }

    res.json({ success: true, message: 'Property message updated successfully', data: updatedMessage });
  } catch (err) {
    console.error('Error updating property message:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



module.exports = router;
