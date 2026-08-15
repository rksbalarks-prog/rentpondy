const axios = require('axios');
const path = require('path');

/**
 * WhatsApp Property Notification Service
 * Sends property details with media (photos/videos) to user via WhatsApp
 * @module whatsappPropertyService
 */

const WHATSAPP_API_BASE = process.env.WHATSAPP_API_URL || 'http://localhost:3001';
const DEFAULT_PROPERTY_IMAGE = process.env.DEFAULT_PROPERTY_IMAGE || 'https://rentpondy.com/assets/img1/default-property.jpg';

/**
 * Clean and validate phone number
 * @param {string} phone - Phone number to clean
 * @returns {string|null} - Cleaned phone number or null if invalid
 */
const cleanPhoneNumber = (phone) => {
  if (!phone) return null;

  // Remove all non-digit characters
  let cleanPhone = phone.replace(/\D/g, '');

  // Add country code if not present
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone; // India country code
  }

  // Validate length (should be 12+ with country code)
  if (cleanPhone.length < 12) {
    console.error(`❌ Invalid phone length: ${cleanPhone.length}`);
    return null;
  }

  return cleanPhone;
};

/**
 * Send media file via WhatsApp (photo or video)
 * @param {string} toPhone - Recipient phone number
 * @param {string} mediaUrl - URL of media file
 * @param {string} mediaType - Type of media ('image' or 'video')
 * @param {string} caption - Optional caption for media
 * @returns {Promise<boolean>} - Success status
 */
const sendMediaToWhatsApp = async (toPhone, mediaUrl, mediaType, caption = '') => {
  try {
    console.log(`📤 Sending ${mediaType} to ${toPhone}...`);

    const response = await axios.post(`${WHATSAPP_API_BASE}/send-media`, {
      to: toPhone,
      type: mediaType, // 'image' or 'video'
      mediaUrl: mediaUrl,
      caption: caption,
    });

    console.log(`✅ ${mediaType} sent successfully`);
    console.log(`   Response status: ${response.status}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send ${mediaType}:`, error.message);
    console.error(`   Error response:`, error.response?.data);
    return false;
  }
};

/**
 * Send multiple media files sequentially
 * @param {string} toPhone - Recipient phone number
 * @param {Array<string>} photoUrls - Array of photo URLs
 * @param {Array<string>} videoUrls - Array of video URLs
 * @returns {Promise<void>}
 */
const sendMediaFiles = async (toPhone, photoUrls = [], videoUrls = []) => {
  try {
    // Send photos first
    if (photoUrls && photoUrls.length > 0) {
      console.log(`📸 Sending ${photoUrls.length} photo(s)...`);
      for (let i = 0; i < photoUrls.length; i++) {
        await sendMediaToWhatsApp(toPhone, photoUrls[i], 'image', `📸 Photo ${i + 1}`);
        // Small delay between media sends to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Send videos
    if (videoUrls && videoUrls.length > 0) {
      console.log(`🎥 Sending ${videoUrls.length} video(s)...`);
      for (let i = 0; i < videoUrls.length; i++) {
        await sendMediaToWhatsApp(toPhone, videoUrls[i], 'video', `🎥 Video ${i + 1}`);
        // Small delay between media sends
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log('✅ All media sent successfully');
  } catch (error) {
    console.error('❌ Error sending media files:', error.message);
    throw error;
  }
};

/**
 * Send default property image when no media is uploaded
 * @param {string} toPhone - Recipient phone number
 * @returns {Promise<boolean>} - Success status
 */
const sendDefaultPropertyImage = async (toPhone) => {
  try {
    console.log('📸 Sending default property image...');
    const success = await sendMediaToWhatsApp(
      toPhone,
      DEFAULT_PROPERTY_IMAGE,
      'image',
      '🏠 Property Image'
    );
    return success;
  } catch (error) {
    console.error('❌ Failed to send default image:', error.message);
    return false;
  }
};

/**
 * Format property details as WhatsApp message
 * @param {Object} propertyData - Property form data
 * @param {string} rentId - Rent ID
 * @param {string} storedPhone - Owner phone number
 * @returns {string} - Formatted WhatsApp message
 */
const formatPropertyMessage = (propertyData, rentId, storedPhone) => {
  const message = `🎉 *YOUR PROPERTY ADDED SUCCESSFULLY!*
For instant Approval and Better Response, Pay Now

*Status:* ✅ Pre-Approved
*Rent ID:* 🆔 ${rentId || 'Processing'}
━━━━━━━━━━━━━━━━━━━━━━

*OWNER INFO*
📛 Name: ${propertyData.ownerName || 'N/A'} ⚡
📱 Phone: ${storedPhone || 'N/A'} ⚡
✉️ Email: ${propertyData.email || 'N/A'} ⚡

━━━━━━━━━━━━━━━━━━━━━━
*PROPERTY INFO*
🏢 Mode: ${propertyData.propertyMode || 'N/A'} ⚡
🏠 Type: ${propertyData.propertyType || 'N/A'} ⚡
💰 Rent: ₹${propertyData.rentalAmount || 'N/A'}/mo ⚡
🔑 Lease: ${propertyData.rentType || 'N/A'} ⚡

━━━━━━━━━━━━━━━━━━━━━━
*SPECIFICATIONS*
🛏️ Bedrooms: ${propertyData.bedrooms || 'N/A'} ⚡
📏 Area: ${propertyData.totalArea || 'N/A'} ${propertyData.areaUnit || ''} ⚡
🏗️ Floor: ${propertyData.floorNo || 'N/A'}/${propertyData.numberOfFloors || 'N/A'} ⚡
🚗 Parking: ${propertyData.carParking || 'N/A'}
🛗 Elevator: ${propertyData.lift || 'N/A'}
🛋️ Furnished: ${propertyData.furnished || 'N/A'} ⚡

━━━━━━━━━━━━━━━━━━━━━━
*LOCATION*
📍 Address: ${propertyData.rentalPropertyAddress || 'N/A'} ⚡
🌆 City: ${propertyData.city || 'N/A'} ⚡
📌 State: ${propertyData.state || 'N/A'} ⚡
🔢 Pincode: ${propertyData.pinCode || 'N/A'} ⚡

━━━━━━━━━━━━━━━━━━━━━━
*AVAILABLE FROM:* ${propertyData.availableDate || 'N/A'} ⚡

━━━━━━━━━━━━━━━━━━━━━━
*💳 PAYMENT LINK*
To activate your property immediately and increase visibility, click below:
https://u.payu.in/PAYUMN/Krxi1bgDHM45?rentId=${rentId}
━━━━━━━━━━━━━━━━━━━━━━

⚡ Mandatory Fields
📸 Verification may be requested
Thank you for choosing Rent Pondy! 🙏

For queries, visit: www.rentpondy.com`;

  return message;
};

/**
 * Send property details message via WhatsApp
 * @param {string} toPhone - Recipient phone number
 * @param {string} message - Formatted message text
 * @returns {Promise<boolean>} - Success status
 */
const sendPropertyMessage = async (toPhone, message) => {
  try {
    console.log('📱 Sending property details message...');
    console.log(`   Message length: ${message.length} characters`);

    const response = await axios.post(`${WHATSAPP_API_BASE}/send-message`, {
      to: toPhone,
      message: message,
    });

    console.log('✅ Property message sent successfully');
    console.log(`   Response status: ${response.status}`);
    console.log(`   Response data:`, response.data);
    return true;
  } catch (error) {
    console.error('❌ Failed to send property message:', error.message);
    console.error(`   Error response:`, error.response?.data);
    return false;
  }
};

/**
 * Main function: Send complete property notification with media and details
 * @param {Object} options - Configuration options
 * @param {string} options.phoneNumber - User's phone number
 * @param {Object} options.propertyData - Property form data
 * @param {string} options.rentId - Rent ID
 * @param {Array<string>} options.photoUrls - Array of uploaded photo URLs (optional)
 * @param {Array<string>} options.videoUrls - Array of uploaded video URLs (optional)
 * @returns {Promise<{success: boolean, message: string}>}
 */
const sendPropertyNotification = async (options) => {
  const { phoneNumber, propertyData, rentId, photoUrls = [], videoUrls = [] } = options;

  try {
    // Validate and clean phone number
    const cleanedPhone = cleanPhoneNumber(phoneNumber);
    if (!cleanedPhone) {
      throw new Error('Invalid phone number format');
    }

    console.log('\n📱 ═══════════════════════════════════════════════');
    console.log('   STARTING PROPERTY NOTIFICATION PROCESS');
    console.log('═══════════════════════════════════════════════\n');

    console.log(`📞 Recipient: ${cleanedPhone}`);
    console.log(`🆔 Rent ID: ${rentId}`);
    console.log(`📸 Photos: ${photoUrls.length || 0}`);
    console.log(`🎥 Videos: ${videoUrls.length || 0}\n`);

    // Step 1: Send media files (if available)
    if (photoUrls.length > 0 || videoUrls.length > 0) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('STEP 1: Sending Media Files');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      await sendMediaFiles(cleanedPhone, photoUrls, videoUrls);
    } else {
      // Send default image if no media uploaded
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('STEP 1: No Media Uploaded - Sending Default Image');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      await sendDefaultPropertyImage(cleanedPhone);
    }

    // Step 2: Send property details message
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 2: Sending Property Details Message');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const formattedMessage = formatPropertyMessage(propertyData, rentId, phoneNumber);
    const messageSent = await sendPropertyMessage(cleanedPhone, formattedMessage);

    if (!messageSent) {
      throw new Error('Failed to send property message');
    }

    console.log('\n✨ ═══════════════════════════════════════════════');
    console.log('   ✅ PROPERTY NOTIFICATION SENT SUCCESSFULLY');
    console.log('═══════════════════════════════════════════════\n');

    return {
      success: true,
      message: 'Property notification sent successfully',
      rentId,
      phoneNumber: cleanedPhone,
    };
  } catch (error) {
    console.error('\n❌ ═══════════════════════════════════════════════');
    console.error('   PROPERTY NOTIFICATION FAILED');
    console.error('═══════════════════════════════════════════════');
    console.error('Error:', error.message);
    console.error('═══════════════════════════════════════════════\n');

    return {
      success: false,
      message: `Failed to send property notification: ${error.message}`,
      error: error.message,
    };
  }
};

module.exports = {
  sendPropertyNotification,
  cleanPhoneNumber,
  formatPropertyMessage,
  sendMediaFiles,
  sendDefaultPropertyImage,
  sendPropertyMessage,
};
