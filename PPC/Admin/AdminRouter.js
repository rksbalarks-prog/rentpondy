


// const express = require('express');
// const router = express.Router();
// const officeMobileMap = require('../utils/officeMobileMap');
// const { sendOtpSms } = require('../utils/smsSender'); // ✅ Correct import
// const { generateOTP, isWithinAllowedTime } = require('../utils/helpers');
// const AdminLogin = require('../Admin/AdminModel')
// const bcrypt = require('bcrypt');


// // OTP Store (in-memory)
// const otpStore = {}; // In production, use Redis or DB

// function storeOtp(officeName, otp) {
//   otpStore[officeName] = {
//     otp,
//     expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes from now
//   };
// }

// function verifyOtp(officeName, enteredOtp) {
//   const data = otpStore[officeName];
//   if (!data) return { success: false, message: 'No OTP requested' };

//   if (Date.now() > data.expiresAt) {
//     return { success: false, message: 'OTP expired' };
//   }

//   if (data.otp !== enteredOtp) {
//     return { success: false, message: 'Invalid OTP' };
//   }

//   delete otpStore[officeName]; // Clear OTP after success
//   return { success: true, message: 'OTP verified successfully' };
// }


// router.post('/admin-send-otp-login-rent', async (req, res) => {
//   try {
//     const { officeName } = req.body;

//     if (!officeName) {
//       return res.status(400).json({ success: false, message: 'Office name is required' });
//     }

//     const validNumbers = officeMobileMap[officeName];
//     if (!validNumbers || !Array.isArray(validNumbers)) {
//       return res.status(400).json({ success: false, message: 'Invalid office name' });
//     }

//     if (officeName.startsWith('ARV') && !isWithinAllowedTime()) {
//       return res.status(403).json({
//         success: false,
//         message: 'OTP can only be requested between 9 AM and 8 PM for this office',
//       });
//     }

//     const otp = generateOTP();
//     const results = [];

//     for (const number of validNumbers) {
//       const result = await sendOtpSms(number, otp); // you must have this function
//       results.push({ number, ...result });
//     }

//     const failed = results.filter(r => !r.success);
//     if (failed.length > 0) {
//       return res.status(500).json({
//         success: false,
//         message: 'Failed to send OTP to some or all numbers',
//         details: failed,
//       });
//     }

//     // ✅ Save OTP
//     storeOtp(officeName, otp);

//     return res.json({
//       success: true,
//       message: `OTP sent to ${officeName} numbers`,
//       maskedNumbers: validNumbers.map(n =>
//         n.replace(/(\+\d{2})\d{6}(\d{2})/, '$1******$2')
//       ),
//       otpExpirySeconds: 300,
//     });
//   } catch (error) {
//     console.error('Error sending OTP:', error.message);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// });




// router.post('/verify-otp-login-admin-rent', (req, res) => {
//   const { officeName, otp } = req.body;

//   if (!officeName || !otp) {
//     return res.status(400).json({ success: false, message: 'Office name and OTP are required' });
//   }

//   const result = verifyOtp(officeName, otp);

//   if (result.success) {
//     return res.json({ success: true, message: result.message });
//   } else {
//     return res.status(401).json({ success: false, message: result.message });
//   }
// });
 


// // // Admin login route (POST /adminlogin)
// // router.post('/adminlogin-rent', async (req, res) => {
// //     const { name, password, role, userType } = req.body;
// //     console.log('Received login:', req.body); // 👈 log this

// //     try {
// //         // Find the admin by name only
// //         const admin = await AdminLogin.findOne({ name });
// //         if (!admin) {
// //             return res.status(400).json({ message: 'Invalid credentials' });
// //         }

// //         // Check password, role, and userType
// //         if (
// //             admin.password !== password || 
// //             admin.role !== role || 
// //             admin.userType !== userType
// //         ) {
// //             return res.status(400).json({ message: 'Invalid credentials' });
// //         }

// //         // Success response
// //         return res.status(200).json({ 
// //             message: 'Login successful', 
// //             data: {
// //                 name: admin.name,
// //                 role: admin.role,
// //                 userType: admin.userType
// //             }
// //         });

// //     } catch (error) {
// //               console.error('Login error:', error);

// //         return res.status(500).json({ message: 'Something went wrong', error: error.message });
// //     }
// // });




// router.post('/adminlogin-rent', async (req, res) => {
//     const { name, password, role, userType } = req.body;

//     try {
//         const admin = await AdminLogin.findOne({ name });
//         if (!admin) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }
       
//         const isMatch = await bcrypt.compare(password, admin.password);
      
//         if (!isMatch || admin.role !== role || admin.userType !== userType) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         return res.status(200).json({
//             message: 'Login successful',
//             data: {
//                 name: admin.name,
//                 role: admin.role,
//                 userType: admin.userType
//             }
//         });

//     } catch (error) {
//         return res.status(500).json({ message: 'Something went wrong', error: error.message });
//     }
// });





// router.get('/get-admin-logs', async (req, res) => {
//     const { page = 1, limit = 10 } = req.query; // Set default page and limit

//     try {
//         const logs = await AdminLogin.find()
//             .skip((page - 1) * limit)  // Skip the appropriate number of records based on the page
//             .limit(Number(limit))  // Limit the number of records returned
//             .sort({ date: -1 }); // Sort logs by date in descending order (latest first)

//         const totalLogs = await AdminLogin.countDocuments(); // Get the total number of logs

//         return res.status(200).json({
//             logs,
//             totalLogs,
//             totalPages: Math.ceil(totalLogs / limit),  // Calculate total pages
//             currentPage: page
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: 'Server Error',
//             error: error.message
//         });
//     }
// });


// router.post('/admin-create', async (req, res) => {
//     const newUser = new AdminLogin({
//         name: req.body.name,
//         address: req.body.address,
//         office: req.body.office,
//         jobType: req.body.jobType,
//         targetWeek: req.body.targetWeek,
//         targetMonth: req.body.targetMonth,
//         mobile: req.body.mobile,
//         aadhaarNumber: req.body.aadhaarNumber,
//         userName: req.body.userName,
//         password: req.body.password,
//         role: req.body.role,
//         userType: req.body.userType
//     });

//     try {
//         const savedUser = await newUser.save();
//         res.status(201).json(savedUser);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // Get all users
// router.get('/admin-all', async (req, res) => {
//     try {
//         const users = await AdminLogin.find();
//         res.json(users);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });



// // Update a user by ID
// router.patch('/admin-update/:id', async (req, res) => {
//     try {
//         const user = await AdminLogin.findById(req.params.id);
//         if (user == null) {
//             return res.status(404).json({ message: 'Cannot find user' });
//         }

//         if (req.body.name != null) {
//             user.name = req.body.name;
//         }
//         if (req.body.address != null) {
//             user.address = req.body.address;
//         }
//         if (req.body.office != null) {
//             user.office = req.body.office;
//         }
//         if (req.body.jobType != null) {
//             user.jobType = req.body.jobType;
//         }
//         if (req.body.targetWeek != null) {
//             user.targetWeek = req.body.targetWeek;
//         }
//         if (req.body.targetMonth != null) {
//             user.targetMonth = req.body.targetMonth;
//         }
//         if (req.body.mobile != null) {
//             user.mobile = req.body.mobile;
//         }
//         if (req.body.aadhaarNumber != null) {
//             user.aadhaarNumber = req.body.aadhaarNumber;
//         }
//         if (req.body.userName != null) {
//             user.userName = req.body.userName;
//         }
//         if (req.body.password != null) {
//             user.password = req.body.password;
//         }
//         if (req.body.role != null) {
//             user.role = req.body.role;
//         }
//         if (req.body.userType != null) {
//             user.userType = req.body.userType;
//         }

//         const updatedUser = await user.save();
//         res.json(updatedUser);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });


// router.delete('/admin-delete/:id', async (req, res) => {
//     try {
//         const userId = req.params.id;
        
//         const user = await AdminLogin.findById(userId);
//         if (user == null) {
//             return res.status(404).json({ message: 'Cannot find user' });
//         }

//         // Use findByIdAndDelete() instead of remove()
//         await AdminLogin.findByIdAndDelete(userId);

//         res.json({ message: 'Deleted user' });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });


// module.exports = router;























const express = require('express');
const router = express.Router();
const officeMobileMap = require('../utils/officeMobileMap');
const { getOfficeOtpNumbers } = require('../utils/otpNumbers'); // DB-backed OTP recipients (admin panel), file fallback
const { sendOtpSms } = require('../utils/smsSender'); // ✅ Correct import
const { generateOTP, isWithinAllowedTime } = require('../utils/helpers');
const axios = require('axios');
const AdminLogin = require('../Admin/AdminModel')
const firebaseAdmin = require('../config/firebaseAdmin'); // verifies Firebase ID tokens



// OTP Store (in-memory)
const otpStore = {}; // In production, use Redis or DB

function storeOtp(officeName, otp) {
  otpStore[officeName] = {
    otp,
    expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes from now
  };
}

function verifyOtp(officeName, enteredOtp) {
  const data = otpStore[officeName];
  if (!data) return { success: false, message: 'No OTP requested' };

  if (Date.now() > data.expiresAt) {
    return { success: false, message: 'OTP expired' };
  }

  if (data.otp !== enteredOtp) {
    return { success: false, message: 'Invalid OTP' };
  }

  delete otpStore[officeName]; // Clear OTP after success
  return { success: true, message: 'OTP verified successfully' };
}


router.post('/admin-send-otp-login-rent', async (req, res) => {
  try {
    const { officeName, adminName } = req.body;

    if (!officeName) {
      return res.status(400).json({ success: false, message: 'Office name is required' });
    }

    // OTP recipients are managed from the admin panel (active rows in the
    // OtpNumber collection); falls back to the legacy static officeMobileMap.
    const validNumbers = await getOfficeOtpNumbers(officeName);
    if (!validNumbers || !Array.isArray(validNumbers) || validNumbers.length === 0) {
      return res.status(400).json({ success: false, message: 'No OTP numbers configured for this office' });
    }

    // if (officeName.startsWith('ARV') && !isWithinAllowedTime()) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'OTP can only be requested between 9 AM and 8 PM for this office',
    //   });
    // }

    const otp = generateOTP();
    const results = [];

    for (const number of validNumbers) {
      const result = await sendOtpSms(number, otp, adminName); // you must have this function
      results.push({ number, ...result });
    }

    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP to some or all numbers',
        details: failed,
      });
    }

    // ✅ Save OTP
    storeOtp(officeName, otp);

    return res.json({
      success: true,
      message: `OTP sent to ${officeName} numbers`,
      maskedNumbers: validNumbers.map(n =>
        n.replace(/(\+\d{2})\d{6}(\d{2})/, '$1******$2')
      ),
      otpExpirySeconds: 1800,
    });
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});




router.post('/verify-otp-login-admin-rent', (req, res) => {
  const { officeName, otp } = req.body;

  if (!officeName || !otp) {
    return res.status(400).json({ success: false, message: 'Office name and OTP are required' });
  }

  const result = verifyOtp(officeName, otp);

  if (result.success) {
    return res.json({ success: true, message: result.message });
  } else {
    return res.status(401).json({ success: false, message: result.message });
  }
});


// ===== FIREBASE OTP LOGIN (admin panel) =====
// Used when the admin sets adminProvider = 'firebase'. The browser runs Firebase
// Phone Auth on a phone number the admin types, then posts the Firebase ID token
// here. We verify the token and only allow login if the verified number is one of
// the registered office numbers (officeMobileMap). Mirrors the success shape of
// /verify-otp-login-admin-rent.
router.post('/admin-firebase-login-rent', async (req, res) => {
  const { idToken, officeName = 'ADMIN', adminName } = req.body;

  if (!idToken) {
    return res.status(400).json({ success: false, message: 'idToken is required' });
  }

  try {
    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
    const tokenPhoneDigits = (decoded.phone_number || '').replace(/\D/g, '').slice(-10);

    if (!tokenPhoneDigits) {
      return res.status(401).json({ success: false, message: 'Token has no verified phone number' });
    }

    // OTP recipients are managed from the admin panel (active rows in the
    // OtpNumber collection); falls back to the legacy static officeMobileMap.
    const validNumbers = await getOfficeOtpNumbers(officeName);
    if (!validNumbers || !Array.isArray(validNumbers) || validNumbers.length === 0) {
      return res.status(400).json({ success: false, message: 'No OTP numbers configured for this office' });
    }

    // Only registered office numbers may log in via Firebase.
    const isAllowed = validNumbers.some(
      (n) => String(n).replace(/\D/g, '').slice(-10) === tokenPhoneDigits
    );

    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        message: 'This phone number is not a registered admin number',
      });
    }

    return res.json({
      success: true,
      message: 'OTP verified successfully',
      adminName: adminName || null,
    });
  } catch (error) {
    console.error('Firebase login (admin) error:', error.message);
    return res.status(401).json({ success: false, message: 'Firebase verification failed' });
  }
});



// router.post('/adminlogin', async (req, res) => {
//     const { name, password, role, userType } = req.body;

//     try {
//         const admin = await AdminLogin.findOne({ name });
//         if (!admin) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }
       
//         const isMatch = await bcrypt.compare(password, admin.password);
      
//         if (!isMatch || admin.role !== role || admin.userType !== userType) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         return res.status(200).json({
//             message: 'Login successful',
//             data: {
//                 name: admin.name,
//                 role: admin.role,
//                 userType: admin.userType
//             }
//         });

//     } catch (error) {
//         return res.status(500).json({ message: 'Something went wrong', error: error.message });
//     }
// });






const bcrypt = require('bcrypt');


router.post('/adminlogin-rent', async (req, res) => {
    const { name, password, role, userType, base: selectedBase } = req.body;

    try {
        const admin = await AdminLogin.findOne({ name });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch || admin.role !== role || admin.userType !== userType) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // City check: an 'ALL' user can pick any city at login; a 'PY' / 'CH'
        // user must pick the city they are locked to. Existing accounts that
        // have no `base` field yet are treated as 'ALL' (matches the
        // migrate-admin-base-all.js backfill).
        const userBase = admin.base || 'ALL';
        if (userBase !== 'ALL' && userBase !== selectedBase) {
            return res.status(400).json({
                message: `This account can only sign in to ${userBase === 'PY' ? 'Pondicherry' : 'Chennai'}.`
            });
        }

        // ✅ Update last login date
        admin.lastLogin = new Date();
        await admin.save();

        return res.status(200).json({
            message: 'Login successful',
            data: {
                name: admin.name,
                role: admin.role,
                userType: admin.userType,
                base: admin.base,
                lastLogin: admin.lastLogin   // return date in response
            }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});



// const bcrypt = require('bcrypt');

// router.post('/adminlogin-rent', async (req, res) => {
//     const { name, password, role, userType } = req.body;

//     try {
//         const admin = await AdminLogin.findOne({ name });
//         if (!admin) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         if (!isMatch || admin.role !== role || admin.userType !== userType) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         return res.status(200).json({
//             message: 'Login successful',
//             data: {
//                 name: admin.name,
//                 role: admin.role,
//                 userType: admin.userType
//             }
//         });

//     } catch (error) {
//         return res.status(500).json({ message: 'Something went wrong', error: error.message });
//     }
// });



// ✅ GET: Get all admins (excluding passwords)
router.get('/get-all-admins', async (req, res) => {
  try {
    const admins = await AdminLogin.find({}, '-password'); // exclude password
    res.status(200).json({ data: admins });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// // Admin login route (POST /adminlogin)
// router.post('/adminlogin', async (req, res) => {
//     const { name, password, role, userType } = req.body;

//     try {
//         // Find the admin by name only
//         const admin = await AdminLogin.findOne({ name });
//         if (!admin) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         // Check password, role, and userType
//         if (
//             admin.password !== password || 
//             admin.role !== role || 
//             admin.userType !== userType
//         ) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         // Success response
//         return res.status(200).json({ 
//             message: 'Login successful', 
//             data: {
//                 name: admin.name,
//                 role: admin.role,
//                 userType: admin.userType
//             }
//         });

//     } catch (error) {
//         return res.status(500).json({ message: 'Something went wrong', error: error.message });
//     }
// });


router.get('/get-admin-logs', async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Set default page and limit

    try {
        const logs = await AdminLogin.find()
            .skip((page - 1) * limit)  // Skip the appropriate number of records based on the page
            .limit(Number(limit))  // Limit the number of records returned
            .sort({ date: -1 }); // Sort logs by date in descending order (latest first)

        const totalLogs = await AdminLogin.countDocuments(); // Get the total number of logs

        return res.status(200).json({
            logs,
            totalLogs,
            totalPages: Math.ceil(totalLogs / limit),  // Calculate total pages
            currentPage: page
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
});


router.post('/admin-create', async (req, res) => {
    const newUser = new AdminLogin({
        name: req.body.name,
        address: req.body.address,
        office: req.body.office,
        jobType: req.body.jobType,
        targetWeek: req.body.targetWeek,
        targetMonth: req.body.targetMonth,
        mobile: req.body.mobile,
        aadhaarNumber: req.body.aadhaarNumber,
        userName: req.body.userName,
        password: req.body.password,
        role: req.body.role,
        userType: req.body.userType,
        // City the new staff is locked to ('ALL' / 'PY' / 'CH').
        base: req.body.base
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/admin-creates', async (req, res) => {
  try {
    const newUser = new AdminLogin({
      name: req.body.name,
      address: req.body.address,
      office: req.body.office,
      jobType: req.body.jobType,
      targetWeek: req.body.targetWeek,
      targetMonth: req.body.targetMonth,
      mobile: req.body.mobile,
      aadhaarNumber: req.body.aadhaarNumber,
      userName: req.body.userName,
      password: req.body.password,            // will be auto-hashed by pre('save')
      plainPassword: req.body.password,       // ✅ save raw password (dev only)
      role: req.body.role,
      userType: req.body.userType,
      // City the new staff is locked to ('ALL' / 'PY' / 'CH').
      base: req.body.base
    });

    const savedUser = await newUser.save();

    // ✅ Send WhatsApp notification to all active ADMIN office numbers (Fire & Forget - No await)
    const adminNumbers = await getOfficeOtpNumbers('ADMIN');
    const createdByAdmin = req.body.createdByAdmin || 'System'; // Admin name who created this user
    
    const whatsappMessage = `🎉 New Admin Created\n\n📋 Details:\nName: ${savedUser.name}\nRole: ${savedUser.role}\nOffice: ${savedUser.office}\nMobile: ${savedUser.mobile}\n\n✅ Created by: ${createdByAdmin}\n\n⏰ Created on: ${new Date().toLocaleString()}`;

    // Send message to all ADMIN numbers (Asynchronously - no await to speed up response)
    adminNumbers.forEach((number) => {
      try {
        const phoneWithCountry = number.startsWith('91') || number.startsWith('+') ? number : '91' + number;
        // ─── OneMSG (commented out — replaced by Meta WhatsApp Cloud API) ───
        // axios.post(
        //   'https://app.onemsg.io/api/create-message',
        //   new URLSearchParams({
        //     appkey: process.env.ONEMSG_APPKEY,
        //     authkey: process.env.ONEMSG_AUTHKEY,
        //     to: phoneWithCountry,
        //     message: whatsappMessage
        //   }),
        //   {
        //     headers: {
        //       'Content-Type': 'application/x-www-form-urlencoded'
        //     }
        //   }
        // ).catch(...);
        axios.post(
          `https://graph.facebook.com/${process.env.META_API_VERSION || 'v21.0'}/${process.env.META_PHONE_NUMBER_ID}/messages`,
          {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: String(phoneWithCountry).replace(/\D/g, ''),
            type: 'text',
            text: { preview_url: false, body: whatsappMessage }
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.META_WHATSAPP_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        ).catch((msgErr) => {
          console.error(`Failed to send WhatsApp to ${number}:`, msgErr.message);
        });
      } catch (msgErr) {
        console.error(`Error setting up WhatsApp to ${number}:`, msgErr.message);
      }
    });

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Get all users
router.get('/admin-all', async (req, res) => {
    try {
        const users = await AdminLogin.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ✅ Update Admin
router.post('/admin-updates/:id', async (req, res) => {
  try {
    const user = await AdminLogin.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const fields = [
      'name', 'address', 'office', 'officeName', 'jobType', 'targetWeek', 'targetMonth',
      'mobile', 'aadhaarNumber', 'userName', 'role', 'userType', 'base'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    if (req.body.password) {
      user.password = req.body.password;
      user.plainPassword = req.body.password;
    }

    const updated = await user.save();
    res.status(200).json({ message: 'User updated', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Get One Admin
router.get('/admin/:id', async (req, res) => {
  try {
    const user = await AdminLogin.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user); // will include plainPassword
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
});


// // ✅ GET: Get all admins including plainPassword
// router.get('/admin-lists', async (req, res) => {
//   try {
//     // Explicitly select plainPassword and other fields
//     const admins = await AdminLogin.find({}, 'name userName role userType mobile plainPassword');

//     res.status(200).json({ data: admins });
//   } catch (err) {
//     console.error("❌ Fetch error:", err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });


// ✅ GET: Get all admins (including all fields)
router.get('/admin-lists', async (req, res) => {
  try {
    // Fetch all admin records
    const admins = await AdminLogin.find({}); // No field filter — get everything

    res.status(200).json({ data: admins });
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// // Update a user by ID
// router.patch('/admin-update/:id', async (req, res) => {
//     try {
//         const user = await AdminLogin.findById(req.params.id);
//         if (user == null) {
//             return res.status(404).json({ message: 'Cannot find user' });
//         }

//         if (req.body.name != null) {
//             user.name = req.body.name;
//         }
//         if (req.body.address != null) {
//             user.address = req.body.address;
//         }
//         if (req.body.office != null) {
//             user.office = req.body.office;
//         }
//         if (req.body.jobType != null) {
//             user.jobType = req.body.jobType;
//         }
//         if (req.body.targetWeek != null) {
//             user.targetWeek = req.body.targetWeek;
//         }
//         if (req.body.targetMonth != null) {
//             user.targetMonth = req.body.targetMonth;
//         }
//         if (req.body.mobile != null) {
//             user.mobile = req.body.mobile;
//         }
//         if (req.body.aadhaarNumber != null) {
//             user.aadhaarNumber = req.body.aadhaarNumber;
//         }
//         if (req.body.userName != null) {
//             user.userName = req.body.userName;
//         }
//         if (req.body.password != null) {
//             user.password = req.body.password;
//         }
//         if (req.body.role != null) {
//             user.role = req.body.role;
//         }
//         if (req.body.userType != null) {
//             user.userType = req.body.userType;
//         }

//         const updatedUser = await user.save();
//         res.json(updatedUser);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });




// ✅ PATCH: Update Admin by ID
router.post('/admin-update/:id', async (req, res) => {
  try {
    const user = await AdminLogin.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Cannot find user' });
    }

    // Update fields conditionally
    const fields = [
      'name', 'address', 'office', 'jobType', 'targetWeek', 'targetMonth',
      'mobile', 'aadhaarNumber', 'userName', 'role', 'userType'
    ];

    fields.forEach(field => {
      if (req.body[field] != null) {
        user[field] = req.body[field];
      }
    });

    // ✅ Handle password update with hashing
    if (req.body.password != null) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



router.delete('/admin-delete/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        const user = await AdminLogin.findById(userId);
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }

        // Use findByIdAndDelete() instead of remove()
        await AdminLogin.findByIdAndDelete(userId);

        res.json({ message: 'Deleted user' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;













