const express = require("express");
const Notification = require("../Notification/NotificationModel");

const router = express.Router();

// Utility: Normalize phone number to last 10 digits
function normalizePhoneNumber(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.slice(-10);
}


// router.post("/send-notification", async (req, res) => {
//   try {
//     let { userPhoneNumber, message, type, rentId } = req.body;

//     // Convert single number to array for convenience
//     if (!Array.isArray(userPhoneNumber)) {
//       userPhoneNumber = [userPhoneNumber];
//     }

//     // ✅ Updated limit: 1 to 100 phone numbers
//     if (userPhoneNumber.length < 1 || userPhoneNumber.length > 100) {
//       return res.status(400).json({ error: "You must provide between 1 and 100 phone numbers" });
//     }

//     // Validate message
//     if (!message || typeof message !== "string" || message.trim() === "") {
//       return res.status(400).json({ error: "message is required" });
//     }

//     // Validate type
//     const validTypes = ["message", "warning"];
//     if (!type || !validTypes.includes(type)) {
//       return res.status(400).json({ error: "Invalid notification type" });
//     }

//     // Normalize numbers and validate
//     const normalizedNumbers = userPhoneNumber.map(normalizePhoneNumber);
//     const invalidNumbers = normalizedNumbers.filter(num => num.length !== 10);

//     if (invalidNumbers.length > 0) {
//       return res.status(400).json({
//         error: `Invalid phone numbers (must be 10 digits): ${invalidNumbers.join(', ')}`
//       });
//     }

//     // Prepare and save notifications
//     const notifications = normalizedNumbers.map(phone => ({
//       userPhoneNumber: phone,
//       message,
//       type,
//       rentId
//     }));

//     const result = await Notification.insertMany(notifications);

//     return res.status(201).json({
//       success: true,
//       message: `${result.length} notifications sent successfully`,
//       notifications: result
//     });

//   } catch (error) {
//     return res.status(500).json({
//       error: "Error sending notifications",
//       details: error.message
//     });
//   }
// });

router.post("/send-notification", async (req, res) => {
  try {
    let { userPhoneNumber, message, type, rentId } = req.body;

    // Convert single number to array for convenience
    if (!Array.isArray(userPhoneNumber)) {
      userPhoneNumber = [userPhoneNumber];
    }

    // ✅ Updated limit: 1 to 100 phone numbers
    if (userPhoneNumber.length < 1 || userPhoneNumber.length > 100) {
      return res.status(400).json({ error: "You must provide between 1 and 100 phone numbers" });
    }

    // Validate message
    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ error: "message is required" });
    }

    // Validate type
    const validTypes = ["message", "warning"];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid notification type" });
    }

    // Normalize numbers and validate
    const normalizedNumbers = userPhoneNumber.map(normalizePhoneNumber);
    const invalidNumbers = normalizedNumbers.filter(num => num.length !== 10);

    if (invalidNumbers.length > 0) {
      return res.status(400).json({
        error: `Invalid phone numbers (must be 10 digits): ${invalidNumbers.join(', ')}`
      });
    }

    // Prepare and save notifications
    const notifications = normalizedNumbers.map(phone => ({
      userPhoneNumber: phone,
      message,
      type,
      rentId
    }));

    const result = await Notification.insertMany(notifications);

    return res.status(201).json({
      success: true,
      message: `${result.length} notifications sent successfully`,
      notifications: result
    });

  } catch (error) {
    return res.status(500).json({
      error: "Error sending notifications",
      details: error.message
    });
  }
});

// 🔹 Get all notifications for user
router.get("/notifications/:userPhoneNumber", async (req, res) => {
  try {
    let { userPhoneNumber } = req.params;
    userPhoneNumber = normalizePhoneNumber(userPhoneNumber);

    const notifications = await Notification.find({ userPhoneNumber }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching notifications", details: error.message });
  }
});

// 🔹 Count notifications for user
router.get("/notifications/count/:userPhoneNumber", async (req, res) => {
  try {
    let { userPhoneNumber } = req.params;
    userPhoneNumber = normalizePhoneNumber(userPhoneNumber);

    const count = await Notification.countDocuments({ userPhoneNumber });

    return res.status(200).json({ success: true, count });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching notification count", details: error.message });
  }
});

// 🔹 Get notification by ID
router.get("/notification/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    return res.status(200).json({ success: true, notification });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching notification", details: error.message });
  }
});

// 🔹 Update notification by ID
router.put("/notification/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { message, type, isRead } = req.body;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { message, type, isRead },
      { new: true, runValidators: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    return res.status(200).json({ success: true, notification });
  } catch (error) {
    return res.status(500).json({ error: "Error updating notification", details: error.message });
  }
});

// 🔹 Delete notification by ID
router.delete("/notification/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    return res.status(200).json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Error deleting notification", details: error.message });
  }
});

// 🔹 Delete all notifications for user
router.delete("/notifications/user/:userPhoneNumber", async (req, res) => {
  try {
    let { userPhoneNumber } = req.params;
    userPhoneNumber = normalizePhoneNumber(userPhoneNumber);

    const result = await Notification.deleteMany({ userPhoneNumber });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "No notifications found for this user" });
    }

    return res.status(200).json({ success: true, message: "All notifications deleted for user" });
  } catch (error) {
    return res.status(500).json({ error: "Error deleting notifications", details: error.message });
  }
});

// 🔹 Fetch all notifications
router.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });

    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching notifications", details: error.message });
  }
});

module.exports = router;
