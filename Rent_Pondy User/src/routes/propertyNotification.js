const express = require('express');
const { sendPropertyNotification } = require('../services/whatsappPropertyService');

const router = express.Router();

/**
 * POST /api/property/notify-whatsapp
 * Send WhatsApp notification after property submission
 *
 * Request Body:
 * {
 *   "phoneNumber": "8610412173",
 *   "propertyData": { ...form data },
 *   "rentId": "1842",
 *   "photoUrls": ["url1", "url2"],  // Optional
 *   "videoUrls": ["videoUrl1"]      // Optional
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Property notification sent successfully",
 *   "rentId": "1842",
 *   "phoneNumber": "918610412173"
 * }
 */
router.post('/notify-whatsapp', async (req, res) => {
  try {
    const { phoneNumber, propertyData, rentId, photoUrls, videoUrls } = req.body;

    // Validate required fields
    if (!phoneNumber || !propertyData || !rentId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: phoneNumber, propertyData, rentId',
      });
    }

    console.log('\n🚀 WhatsApp Notification Request Received');
    console.log(`   Phone: ${phoneNumber}`);
    console.log(`   Rent ID: ${rentId}`);
    console.log(`   Photos: ${photoUrls?.length || 0}`);
    console.log(`   Videos: ${videoUrls?.length || 0}\n`);

    // Send WhatsApp notification
    const result = await sendPropertyNotification({
      phoneNumber,
      propertyData,
      rentId,
      photoUrls: photoUrls || [],
      videoUrls: videoUrls || [],
    });

    // Respond with result (success or failure)
    const statusCode = result.success ? 200 : 500;
    res.status(statusCode).json(result);
  } catch (error) {
    console.error('\n❌ WhatsApp Notification Route Error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to send WhatsApp notification',
      error: error.message,
    });
  }
});

module.exports = router;
