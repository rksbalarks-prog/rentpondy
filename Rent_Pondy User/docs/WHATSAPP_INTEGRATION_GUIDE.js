/**
 * INTEGRATION GUIDE: WhatsApp Property Notification System
 *
 * This file shows how to integrate the WhatsApp property notification service
 * into your application workflow.
 */

// ============================================================================
// 1. SERVER SETUP (in your main server/app.js file)
// ============================================================================

/*
const express = require('express');
const propertyNotificationRoutes = require('./routes/propertyNotification');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/property', propertyNotificationRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/

// ============================================================================
// 2. ENVIRONMENT VARIABLES (.env file)
// ============================================================================

/*
# WhatsApp API Configuration
WHATSAPP_API_URL=http://your-whatsapp-api.com
DEFAULT_PROPERTY_IMAGE=https://rentpondy.com/assets/img1/default-property.jpg

# API Keys (if needed)
WHATSAPP_API_KEY=your_api_key_here
*/

// ============================================================================
// 3. FRONTEND INTEGRATION (in AddProperty.jsx - handleSubmit function)
// ============================================================================

/*
const handleSubmit = async (e) => {
  e.preventDefault();

  const finalFormData = {
    ...formData,
    ownerName: formData.ownerName.trim() === "" ? "Owner" : formData.ownerName,
  };

  if (!rentId) {
    setMessage({ text: "RENT-ID is required. Please refresh or try again.", type: "error" });
    return;
  }

  const formDataToSend = new FormData();
  formDataToSend.append("rentId", rentId);

  Object.keys(finalFormData).forEach((key) => {
    formDataToSend.append(key, finalFormData[key]);
  });

  photos.forEach((photo) => {
    formDataToSend.append("photos", photo);
  });

  videos.forEach(file => {
    formDataToSend.append("video", file);
  });

  try {
    setIsUploading(true);

    // Step 1: Upload property data
    const uploadResponse = await axios.post(
      `${process.env.REACT_APP_API_URL}/update-rent-property`,
      formDataToSend,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setMessage({ text: "Property Added successfully!", type: "success", image: SuccessIcon });

    // Step 2: Send WhatsApp notification with property details
    // Get photo and video URLs from upload response
    const photoUrls = uploadResponse.data.photoUrls || [];
    const videoUrls = uploadResponse.data.videoUrls || [];

    const whatsappPayload = {
      phoneNumber: localStorage.getItem("phoneNumber"),
      propertyData: finalFormData,
      rentId: rentId,
      photoUrls: photoUrls,
      videoUrls: videoUrls,
    };

    // Send WhatsApp notification (non-blocking)
    axios.post(
      `${process.env.REACT_APP_API_URL}/api/property/notify-whatsapp`,
      whatsappPayload
    ).then(() => {
      console.log("✅ WhatsApp notification sent");
    }).catch((err) => {
      console.error("⚠️  WhatsApp notification failed (but property was saved):", err.message);
    });

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 5000);

    setShowConfirmation(true);

  } catch (error) {
    setMessage({
      text: error.response?.data?.message || "Error saving property data.",
      type: "error"
    });
  } finally {
    setIsUploading(false);
  }
};
*/

// ============================================================================
// 4. DIRECT SERVICE USAGE (if not using routes)
// ============================================================================

/*
const { sendPropertyNotification } = require('../services/whatsappPropertyService');

async function notifyPropertySubmission(phoneNumber, propertyData, rentId, photoUrls, videoUrls) {
  try {
    const result = await sendPropertyNotification({
      phoneNumber,
      propertyData,
      rentId,
      photoUrls: photoUrls || [],
      videoUrls: videoUrls || [],
    });

    if (result.success) {
      console.log("✅ Property notification sent:", result);
    } else {
      console.log("⚠️  Failed to send notification:", result.message);
    }
    
    return result;
  } catch (error) {
    console.error("❌ Error:", error.message);
    // Don't rethrow - allow property submission to succeed even if WhatsApp fails
  }
}
*/

// ============================================================================
// 5. COMPLETE REQUEST EXAMPLE
// ============================================================================

/*
POST /api/property/notify-whatsapp
Content-Type: application/json

{
  "phoneNumber": "+91 8610 412 173",
  "rentId": "1842",
  "propertyData": {
    "ownerName": "John Doe",
    "email": "john@example.com",
    "propertyMode": "Residential",
    "propertyType": "Apartment",
    "rentalAmount": "15000",
    "rentType": "Monthly",
    "bedrooms": "2",
    "totalArea": "1200",
    "areaUnit": "Sq.Feet",
    "floorNo": "3",
    "numberOfFloors": "5",
    "carParking": "Yes",
    "lift": "Yes",
    "furnished": "Semi-Furnished",
    "rentalPropertyAddress": "123 Main Street, Bangalore",
    "city": "Bangalore",
    "state": "Karnataka",
    "pinCode": "560001",
    "availableDate": "Immediate"
  },
  "photoUrls": [
    "https://cdn.example.com/photos/prop1/photo1.jpg",
    "https://cdn.example.com/photos/prop1/photo2.jpg"
  ],
  "videoUrls": [
    "https://cdn.example.com/videos/prop1/video1.mp4"
  ]
}

Response:
{
  "success": true,
  "message": "Property notification sent successfully",
  "rentId": "1842",
  "phoneNumber": "918610412173"
}
*/

// ============================================================================
// 6. ERROR HANDLING & LOGGING
// ============================================================================

/*
The service includes comprehensive logging:

✅ Success Logs:
- 📱 === STARTING PROPERTY NOTIFICATION PROCESS ===
- 📸 Sending X photo(s)...
- 🎥 Sending X video(s)...
- ✅ All media sent successfully
- 📱 Sending property details message...
- ✅ PROPERTY NOTIFICATION SENT SUCCESSFULLY

❌ Error Logs:
- ❌ Invalid phone number format
- ❌ Failed to send [photo/video]
- ❌ Error response: [API response]
- ❌ PROPERTY NOTIFICATION FAILED

All timestamps and detailed information are logged for debugging.
*/

// ============================================================================
// 7. KEY FEATURES
// ============================================================================

/*
✅ Phone Number Cleaning:
   - Removes all non-digit characters
   - Adds country code if missing (assumes India: +91)
   - Validates length (12+ digits with country code)

✅ Media Handling:
   - Sends photos sequentially before videos
   - Includes captions for each media file
   - Falls back to default image if no media uploaded
   - Small delays between sends to avoid rate limiting

✅ Message Formatting:
   - Well-structured WhatsApp message with emojis
   - Includes all property details
   - Status marked as "Pre-Approved"
   - Payment link for instant activation
   - Contact information

✅ Error Resilience:
   - WhatsApp failure doesn't block property submission
   - Graceful error handling with detailed logging
   - Non-blocking API calls from frontend

✅ Production Ready:
   - Environment variable configuration
   - Comprehensive error handling
   - Detailed logging for debugging
   - Clean code structure
   - Comment documentation
*/

// ============================================================================
// 8. TESTING THE SERVICE
// ============================================================================

/*
Using cURL:
curl -X POST http://localhost:3001/api/property/notify-whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "8610412173",
    "rentId": "1842",
    "propertyData": {
      "ownerName": "Test User",
      "email": "test@example.com",
      "propertyMode": "Residential",
      "propertyType": "Apartment",
      "rentalAmount": "15000",
      "rentType": "Monthly",
      "bedrooms": "2",
      "totalArea": "1200",
      "areaUnit": "Sq.Feet",
      "city": "Bangalore",
      "state": "Karnataka",
      "pinCode": "560001"
    },
    "photoUrls": ["https://example.com/photo1.jpg"],
    "videoUrls": []
  }'

Using Axios (JavaScript):
const axios = require('axios');

axios.post('http://localhost:3001/api/property/notify-whatsapp', {
  phoneNumber: '8610412173',
  rentId: '1842',
  propertyData: { ... },
  photoUrls: [ ... ],
  videoUrls: [ ... ]
}).then(res => console.log('✅', res.data))
  .catch(err => console.error('❌', err.message));
*/

// ============================================================================
// 9. DEPLOYMENT CHECKLIST
// ============================================================================

/*
Before deploying to production:

□ Set WHATSAPP_API_URL environment variable
□ Set DEFAULT_PROPERTY_IMAGE URL (must be publicly accessible)
□ Ensure WhatsApp API endpoints are properly configured
□ Test with real phone numbers
□ Set up monitoring/alerting for failures
□ Add database logging for all notifications
□ Configure rate limiting if needed
□ Test with various phone number formats
□ Verify media URLs are accessible from server
□ Set up error reporting (e.g., Sentry)
□ Monitor API response times
*/

module.exports = {};
