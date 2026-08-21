import 'dotenv/config.js';
import express from 'express';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { generateOTP, storeOTP, verifyOTP } from './otpUtils.js';
import axios from 'axios';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// City-base (PY/CH) helper. Default-imported because the helper is CommonJS.
import baseUtil from './utils/baseFilter.js';
// Per-request city-base scope (AsyncLocalStorage). CommonJS — default import.
import baseScope from './utils/baseScope.js';
// Firebase Admin SDK (CommonJS) — verifies Firebase Phone Auth ID tokens for
// the Firebase OTP login path. Default-imported because the module is CommonJS.
import firebaseAdmin from './config/firebaseAdmin.js';

// WhatsApp (SmartGrowth AI campaign API) — internal send routes
import whatsappCloudRoutes from "./routes/whatsappWebhook.js";
// WhatsApp bulk-send test console (additive, passcode-gated, self-contained)
import whatsappTestRoutes from "./WhatsappTest/WhatsappTestRouter.js";

// Import all your routers
import AddRouters from './AddRouters.js';
import AddRouter from './AddRouter.js';
import AddPropertyMarketingRouter from './AddPropertyMarketing/AddPropertyMarketingRouter.js';
import PricingPlanRouter from './plans/PricingPlanRouter.js';
import AdminRouter from './Admin/AdminRouter.js';
import OfficeRouter from './Office/OfficeRouter.js';
import BuyerRouter from './BuyerPlan/BuyerRouter.js';
import AreaRouter from './Places/AreaRouter.js';
import CityRouter from './Places/CityRouter.js';
import StateRouter from './Places/StateRouter.js';
import DistrictRouter from './Places/DistrictRouter.js';
import RollRouter from './Roll/RollRouter.js';
import DetailRouter from './Details/DetailRouter.js';
import OfferRouter from './Offer/OfferRouter.js';
import DataRouter from './SendDataAdmin/DataRouter.js';
import UserRouter from './user/UserRouter.js';
import BuyerAssistanceRouter from './BuyerAssistance/BuyerAssistanceRouter.js';
import PhotoRequestRouter from './Photo/PhotoRequestRouter.js';
import ProfileRouter from './MyProfile/ProfileRouter.js';
import ContactUsRouter from './ContactUs/ContactUsRouter.js';
import TextRouter from './TextEdider/TextRouter.js';
import NotificationRouter from './Notification/NotificationRouter.js';
import FcmTokenRouter from './fcm/FcmTokenRouter.js'; // FCM push (additive)
import VisitAdminRouter from './visit/VisitAdminRouter.js';
import AdminRollRouter from './AdminRolls/AdminRollRouter.js';
import PaymentTypeRouter from './Payment/PaymentTypeRouter.js';
import FollowUpRouter from './FollowUp/FollowUpRouter.js';
import BillRouter from './CreateBill/BillRouter.js';
import FollowUpBuyerRouter from './FollowUp/FollowUpBuyerRouter.js';
import NoResponseFollowUpRouter from './FollowUp/NoResponseFollowUpRouter.js';
import VisitorFollowUpRouter from './FollowUp/VisitorFollowUpRouter.js';
import LimitRouter from './Limit/LimitRouter.js';
import UploadImageRouter from './UploadImageRouter.js';
import BrideImageRouter from './BrideImageRouter.js';
import payuRoutes from './PayU/payu.routes.js';
import propertyRoutes from './controllers/propertyRoutes.js';
import payuBuyerRoutes from './PayuBuyer/payu.buyer.routes.js';
import payuDirectRoutes from './PayuDirect/payu.direct.routes.js';
import PointsRouter from './Points/PointsRouter.js';
import PayUPointsRouter from './Points/PayUPointsRouter.js';
import PointsPricingRouter from './PointsPricing/PointsPricingRouter.js';
import StayPlanRouter from './StayPlan/StayPlanRouter.js';
import PayUStayRouter from './StayPlan/PayUStayRouter.js';
import BuyerBillRouter from './CreateBuyerBill/BuyerBillRouter.js';
import EditBuyerBillRouter from './EditBuyerBill/EditBuyerBillRouter.js';
import PropertyMessageRouter from './PropertyMessage/PropertyMessageRouter.js'
import AdsRouter from './Ads/AdsRouter.js'
import AdsDetailRouter from './AdsDetail/AdsDetailRouter.js'
import LoginPopupSettingRouter from './LoginPopupSetting/LoginPopupSettingRouter.js'
import OtpSettingRouter from './OtpSetting/OtpSettingRouter.js'
import OtpNumberRouter from './Otp/OtpNumberRouter.js'
import messageRoutes from './messageRoutes.js';
// Self-hosted SIM SMS gateway: notify owner when a tenant views their contact.
import SmsGatewayRouter from './SmsGateway/SmsGatewayRouter.js';
// Live User Activity — user-app action trail read by the admin live-tracking screen.
import LiveActivityRouter from './LiveActivity/LiveActivityRouter.js';
// "Someone viewed your property" owner notification (once per viewer/day).
import PropertyViewNotifyRouter from './PropertyViewNotify/PropertyViewNotifyRouter.js';
// Data Added — month-wise report of properties entered, grouped by "Added By".
import DataAddedRouter from './DataAdded/DataAddedRouter.js';
// Scheduled e-mail of that same Data Added report (see ./DataAddedMail/).
import dataAddedMail from './DataAddedMail/index.js';
// Daily PDF e-mail of the Overall Report - Admin page (see ./AdminReportMail/).
import adminReportMail from './AdminReportMail/index.js';
// Daily Excel e-mail of the SAME report's underlying rows, phone numbers
// included — a separate mail from the PDF (see ./AdminExcelMail/).
import adminExcelMail from './AdminExcelMail/index.js';
import UserLogin from './user/UserModel.js'; // Import your UserLogin model

import whiteTownRoutes from "./WhiteTown/WhiteTownRouter.js"; //WhiteTown routes
import SingleSendRoutes from "./SingleSendWhatsapp/Singlesendmsgrouter.js"; // Single Send Whatsapp routes
import PMRouter from "./PmWhatsapp/PMRouter.js"; // PM WhatsApp Credentials & Message routes
import PmBulkRouter from "./PmBulkWhatsapp/PmBulkRouter.js"; // PM Bulk WhatsApp routes
import BulkWhatsappRouter from "./BulkWhatsapp/BulkWhatsappRouter.js"; // Admin Bulk WhatsApp (Wasender) routes
import RcmRouter from "./Rcm/RcmRouter.js"; // Call Management (/process/dashboard/rp.wfh) routes
// import RoleAccessRouter from './RoleAccess/RoleAccessRouter.js'; // Role Access routes

// AI voice + chat assistant (additive layer — see ./assistant/).
import assistant from './assistant/index.js';
// Crawler-facing SEO layer: sitemaps + server-rendered property / landing pages
// (additive layer — see ./Seo/).
import seo from './Seo/index.js';



const app = express();
const PORT = process.env.PORT || 5005;
const mongoURI = process.env.MONGO_URI;

// Configure AWS SNS client
const snsClient = new SNSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Validate critical environment variables
const requiredEnvVars = [
  'AWS_REGION',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'SENDER_ID',
  'DLT_ENTITY_ID',
  'DLT_TEMPLATE_ID',
  'MONGO_URI'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.warn('⚠️ Missing environment variables:', missingEnvVars);
  console.warn('OTP sending may fail without these variables');
}

// Connect to MongoDB
// mongoose.connect(mongoURI)
//   .then(() => console.log("Database connected successfully"))
//   .catch((err) => console.error("Database connection failed:", err));

// Suppress Mongoose duplicate index warnings
process.removeAllListeners('warning');
process.on('warning', (warning) => {
  if (warning.code === 'MONGOOSE_DUPLICATE_INDEX_WARNING' || 
      warning.message?.includes('Duplicate schema index') ||
      warning.message?.includes('MONGOOSE')) {
    return; // Suppress duplicate index warnings silently
  }
  console.warn(warning);
});

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection failed:", err));

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit:'100mb'}));

// City-base scope: bind this request's ?base= (ALL/PY/CH, sent by the admin
// and user apps) to the async context so the city-scope mongoose plugin can
// filter every list/count/aggregate query automatically. No base or 'ALL'
// means no restriction, so this is backwards-compatible.
app.use((req, res, next) => {
  baseScope.runWithBase(req.query && req.query.base, next);
});

app.use('/ExclusivePhotos', express.static(path.join(__dirname, 'ExclusivePhotos')));
// Serve property photos and videos uploaded via multer.
// In production this is typically fronted by nginx; this line keeps local dev
// working and does no harm in production.
app.use('/PPC/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/PPC/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    awsSnsConfig: {
      region: process.env.AWS_REGION ? 'configured' : 'missing',
      credentials: process.env.AWS_ACCESS_KEY_ID ? 'configured' : 'missing'
    }
  });
});

app.get('/abc', (req, res) => {
  res.send('Hello World!')
  console.log("test");
})

// OTP Endpoints with full UserLogin integration - PLACED BEFORE OTHER ROUTERS
// app.post('/PPC/send-otp-rent', async (req, res) => {
//   let { phoneNumber, loginMode = 'app', version, countryCode } = req.body;
  
//   console.log("otp");

//   if (!phoneNumber) {
//     return res.status(400).json({ error: 'Phone number is required' });
//   }

//   // Normalize phone number
//   phoneNumber = phoneNumber.replace(/\D/g, '');
  
//   if (phoneNumber.startsWith('91') && phoneNumber.length === 12) {
//     phoneNumber = `+${phoneNumber}`;
//   } else if (phoneNumber.length === 10) {
//     phoneNumber = `+91${phoneNumber}`;
//   } else if (!phoneNumber.startsWith('+91')) {
//     return res.status(400).json({ error: 'Invalid Indian phone number format' });
//   }

//   // Check if user is banned or deleted
//   try {
//     const phoneDigits = phoneNumber.replace(/\D/g, '').slice(-10);
//     const existingUser = await UserLogin.findOne({ 
//       phone: phoneDigits,
//       status: { $in: ['banned', 'deleted'] }
//     }).sort({ loginDate: -1 });

//     if (existingUser) {
//       if (existingUser.status === 'banned') {
//         return res.status(403).json({ 
//           error: 'Account banned',
//           bannedDate: existingUser.bannedDate,
//           bannedReason: existingUser.bannedReason,
//           staffName: existingUser.staffName
//         });
//       }
//       if (existingUser.status === 'deleted') {
//         return res.status(403).json({ 
//           error: 'Account deleted',
//           deletedDate: existingUser.deletedDate
//         });
//       }
//     }
//   } catch (error) {
//     return res.status(500).json({ error: 'Error checking account status' });
//   }

//   // Generate new OTP
//   const otp = generateOTP();
//   const message = `Your OTP is: ${otp}. Thanks for using PPC Pondy`;

//   try {
//     const params = {
//       Message: message,
//       PhoneNumber: phoneNumber,
//       MessageAttributes: {
//         'AWS.SNS.SMS.SMSType': {
//           DataType: 'String',
//           StringValue: 'Transactional'
//         },
//         'AWS.SNS.SMS.SenderID': {
//           DataType: 'String',
//           StringValue: process.env.SENDER_ID || 'PONDYY'
//         },
//         'AWS.MM.SMS.EntityId': {
//           DataType: 'String',
//           StringValue: process.env.DLT_ENTITY_ID
//         },
//         'AWS.MM.SMS.TemplateId': {
//           DataType: 'String',
//           StringValue: process.env.DLT_TEMPLATE_ID
//         }
//       }
//     };

//     const command = new PublishCommand(params);
//     const result = await snsClient.send(command);
    
//     await UserLogin.create({
//       phone: phoneNumber.replace(/\D/g, '').slice(-10),
//       otp,
//       loginDate: new Date(),
//       otpStatus: 'pending',
//       countryCode: countryCode || '+91',
//       loginMode,
//       version,
//       status: 'active'
//     });
    
//     res.status(200).json({ 
//       message: 'OTP sent successfully',
//       result: {
//         messageId: result.MessageId,
//         otp: process.env.NODE_ENV === 'development' ? otp : undefined
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       error: 'Failed to send OTP',
//       details: error.message
//     });
//   }
// });




// OTP Endpoints with full UserLogin integration
app.post('/PPC/send-otp-rent', async (req, res) => {
  let { phoneNumber, loginMode = 'app', version, countryCode } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Normalize phone number
  phoneNumber = phoneNumber.replace(/\D/g, '');
  
  if (phoneNumber.startsWith('91') && phoneNumber.length === 12) {
    phoneNumber = `+${phoneNumber}`;
  } else if (phoneNumber.length === 10) {
    phoneNumber = `+91${phoneNumber}`;
  } else if (!phoneNumber.startsWith('+91')) {
    return res.status(400).json({ error: 'Invalid Indian phone number format' });
  }

  // Check if user is banned or deleted
  try {
    const phoneDigits = phoneNumber.replace(/\D/g, '').slice(-10);
    const existingUser = await UserLogin.findOne({ 
      phone: phoneDigits,
      status: { $in: ['banned', 'deleted'] }
    }).sort({ loginDate: -1 });

    if (existingUser) {
      if (existingUser.status === 'banned') {
        return res.status(403).json({ 
          error: 'Account banned',
          bannedDate: existingUser.bannedDate,
          bannedReason: existingUser.bannedReason,
          staffName: existingUser.staffName
        });
      }
      if (existingUser.status === 'deleted') {
        return res.status(403).json({ 
          error: 'Account deleted',
          deletedDate: existingUser.deletedDate
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error checking account status' });
  }

  // Generate new OTP
  const otp = generateOTP();
//   const message = `Your OTP is: ${otp}. Thanks for using PPC Pondy`;
  const message = `Your OTP is: ${otp}. Thanks for using Rent Pondy`;


  try {
    // const params = {
    //   Message: message,
    //   PhoneNumber: phoneNumber,
    //   MessageAttributes: {
    //     'SMSType': {
    //       DataType: 'String',
    //       StringValue: 'Transactional'
    //     },
    //     'SenderID': {
    //       DataType: 'String',
    //       StringValue: process.env.SENDER_ID || 'PONDYY'
    //     },
    //     'EntityId': {
    //       DataType: 'String',
    //       StringValue: process.env.DLT_ENTITY_ID
    //     },
    //     'TemplateId': {
    //       DataType: 'String',
    //       StringValue: process.env.DLT_TEMPLATE_ID
    //     }
    //   }
    // };
    
    // ===== AWS SNS (DISABLED — credentials invalid: "InvalidClientTokenId").
    //       Switched user-login OTP to SMS Idea, the working provider used by
    //       admin-send-otp-login-rent. To revert: uncomment this block and
    //       remove the SMS Idea block below. =====
    // const params = {
    //   Message: message,
    //   PhoneNumber: phoneNumber,
    //   MessageAttributes: {
    //     'AWS.SNS.SMS.SMSType': {
    //       DataType: 'String',
    //       StringValue: 'Transactional'
    //     },
    //     'AWS.SNS.SMS.SenderID': {
    //       DataType: 'String',
    //       StringValue: process.env.SENDER_ID || 'PONDYY'
    //     },
    //     'AWS.MM.SMS.EntityId': {
    //       DataType: 'String',
    //       StringValue: process.env.DLT_ENTITY_ID
    //     },
    //     'AWS.MM.SMS.TemplateId': {
    //       DataType: 'String',
    //       StringValue: process.env.DLT_TEMPLATE_ID
    //     }
    //   }
    // };
    // const command = new PublishCommand(params);
    // const result = await snsClient.send(command);
    // ===== END AWS SNS =====

    // ===== SMS IDEA (active) — same provider/gateway as admin-send-otp-login-rent =====
    const smsTo = phoneNumber.replace(/\D/g, ''); // digits only -> 91XXXXXXXXXX
    const smsUrl = `${process.env.SMS_BASE_URL || 'https://www.smsidea.co.in'}/smsstatuswithid.aspx`;
    const smsParams = {
      mobile: process.env.SMS_USERNAME,
      pass: process.env.SMS_PASSWORD,
      senderid: process.env.SMS_SENDER_ID,
      to: smsTo.startsWith('91') ? smsTo : `91${smsTo}`,
      msg: message,
      route: 1,
      msgtype: 'text',
      format: 'json',
      tempid: process.env.DLT_TEMPLATE_ID, // Working DLT template for User Login OTP
    };

    const smsResponse = await axios.get(smsUrl, { params: smsParams });
    const smsData = smsResponse.data;

    const smsOk =
      (typeof smsData === 'string' && smsData.includes('Message Id')) ||
      (smsData && smsData.status && String(smsData.status).toLowerCase() === 'success');

    if (!smsOk) {
      throw new Error(`SMS Idea rejected the request: ${JSON.stringify(smsData)}`);
    }

    const result = { MessageId: (smsData && smsData.messageid) || 'sms-idea' };
    // ===== END SMS IDEA =====
    
     await UserLogin.create({
      phone: phoneNumber.replace(/\D/g, '').slice(-10),
      otp,
      loginDate: new Date(),
      otpStatus: 'pending',
      countryCode: countryCode || '+91',
      loginMode, // Ensure loginMode is saved
      version,
      status: 'active'
    });
    
    res.status(200).json({ 
      message: 'OTP sent successfully',
      result: {
        messageId: result.MessageId,
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      }
    });
  } catch (error) {
    console.error('OTP Send Error:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack,
      phoneNumber: phoneNumber.slice(-4)
    });
    
    res.status(500).json({ 
      error: 'Failed to send OTP',
      details: error.message,
      code: error.code
    });
  }
});


app.post('/PPC/verify-otp-rent', async (req, res) => {
  const { phoneNumber, otp } = req.body;
  
  if (!phoneNumber || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required' });
  }

  try {
    // Normalize phone number
    const phoneDigits = phoneNumber.replace(/\D/g, '').slice(-10);
    
    // Find the most recent OTP for this phone number
    const userLogin = await UserLogin.findOne({
      phone: phoneDigits,
      otpStatus: 'pending'
    }).sort({ loginDate: -1 });

    if (!userLogin) {
      return res.status(404).json({ error: 'No pending OTP found for this number' });
    }

    // Check if OTP matches and is not expired (5 minute expiry)
    const isOtpValid = userLogin.otp === otp;
    const isOtpExpired = new Date() - userLogin.loginDate > 5 * 60 * 1000;

    if (!isOtpValid) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    if (isOtpExpired) {
      return res.status(401).json({ error: 'OTP expired' });
    }

    // Update the record to mark as verified
    userLogin.otpStatus = 'verified';
    await userLogin.save();

    res.status(200).json({ 
      message: 'OTP verified successfully',
      user: {
        phone: userLogin.phone,
        countryCode: userLogin.countryCode,
        status: userLogin.status,
        loginDate: userLogin.loginDate,
        loginMode: userLogin.loginMode,
        version: userLogin.version,
        otpStatus: userLogin.otpStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error verifying OTP',
      details: error.message
    });
  }
});


// ===== FIREBASE OTP LOGIN (user app) =====
// Used when the admin sets userProvider = 'firebase'. The browser runs Firebase
// Phone Auth (sends + verifies the SMS itself), then posts the resulting Firebase
// ID token here. We verify the token server-side, confirm the phone matches, run
// the same banned/deleted guard as send-otp-rent, and upsert the UserLogin record
// (marking it verified) so the rest of the app behaves exactly like verify-otp-rent.
app.post('/PPC/user/firebase-login-rent', async (req, res) => {
  const { idToken, phoneNumber, loginMode = 'app', version, countryCode } = req.body;

  if (!idToken || !phoneNumber) {
    return res.status(400).json({ error: 'idToken and phoneNumber are required' });
  }

  try {
    // 1. Verify the Firebase ID token (throws if invalid/expired/forged).
    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);

    // 2. The token must be for the same phone number the client claims.
    const tokenPhoneDigits = (decoded.phone_number || '').replace(/\D/g, '').slice(-10);
    const phoneDigits = phoneNumber.replace(/\D/g, '').slice(-10);
    if (!tokenPhoneDigits || tokenPhoneDigits !== phoneDigits) {
      return res.status(401).json({ error: 'Phone number does not match verified token' });
    }

    // 3. Same banned/deleted guard as send-otp-rent.
    const blockedUser = await UserLogin.findOne({
      phone: phoneDigits,
      status: { $in: ['banned', 'deleted'] }
    }).sort({ loginDate: -1 });

    if (blockedUser) {
      if (blockedUser.status === 'banned') {
        return res.status(403).json({
          error: 'Account banned',
          bannedDate: blockedUser.bannedDate,
          bannedReason: blockedUser.bannedReason,
          staffName: blockedUser.staffName
        });
      }
      if (blockedUser.status === 'deleted') {
        return res.status(403).json({
          error: 'Account deleted',
          deletedDate: blockedUser.deletedDate
        });
      }
    }

    // 4. Upsert the login record as verified (no server OTP for the Firebase path).
    const userLogin = await UserLogin.findOneAndUpdate(
      { phone: phoneDigits },
      {
        $set: {
          phone: phoneDigits,
          otpStatus: 'verified',
          loginDate: new Date(),
          countryCode: countryCode || '+91',
          loginMode,
          version: version || null,
          status: 'active'
        },
        $unset: { otp: 1 }
      },
      { new: true, upsert: true, runValidators: false }
    );

    // 5. Same response shape as verify-otp-rent so the frontend proceeds unchanged.
    res.status(200).json({
      message: 'OTP verified successfully',
      user: {
        phone: userLogin.phone,
        countryCode: userLogin.countryCode,
        status: userLogin.status,
        loginDate: userLogin.loginDate,
        loginMode: userLogin.loginMode,
        version: userLogin.version,
        otpStatus: userLogin.otpStatus
      }
    });
  } catch (error) {
    console.error('Firebase login (user) error:', error.message);
    res.status(401).json({
      error: 'Firebase verification failed',
      details: error.message
    });
  }
});

// Record the city base (PY = Pondicherry / CH = Chennai) a user selected on
// the login screen. This stores the user's HOME base; it is set at login only
// and is not meant to be overwritten by in-app city switching.
// If a UserLogin record exists for the phone, the most recent one is updated;
// otherwise a minimal record is created so the choice is not lost.
app.post('/PPC/user/select-city', async (req, res) => {
  const { phoneNumber, base, countryCode } = req.body;
  const normBase = baseUtil.normalizeBase(base);

  if (!normBase) {
    return res.status(400).json({ error: "base is required and must be 'PY' or 'CH'" });
  }

  try {
    const phoneDigits = phoneNumber ? String(phoneNumber).replace(/\D/g, '').slice(-10) : null;

    let user = null;
    if (phoneDigits) {
      user = await UserLogin.findOneAndUpdate(
        { phone: phoneDigits },
        { base: normBase, baseSelectedDate: new Date() },
        { new: true, sort: { loginDate: -1 } }
      );

      if (!user) {
        user = await UserLogin.create({
          phone: phoneDigits,
          phoneNumber: phoneDigits,
          countryCode: countryCode || '+91',
          base: normBase,
          baseSelectedDate: new Date(),
          otpStatus: 'pending'
        });
      }
    } else {
      // anonymous click: store as a phoneless record so we still capture the signal
      user = await UserLogin.create({
        base: normBase,
        baseSelectedDate: new Date(),
        countryCode: countryCode || '+91',
        otpStatus: 'pending'
      });
    }

    res.status(200).json({
      message: 'Base recorded',
      base: user.base,
      phone: user.phone || null,
      baseSelectedDate: user.baseSelectedDate
    });
  } catch (error) {
    res.status(500).json({ error: 'Error recording base', details: error.message });
  }
});

// Admin endpoint to ban a user
app.post('/PPC/admin/ban-user', async (req, res) => {
  const { phoneNumber, reason, staffName } = req.body;
  
  if (!phoneNumber || !reason || !staffName) {
    return res.status(400).json({ error: 'Phone number, reason and staff name are required' });
  }

  try {
    const phoneDigits = phoneNumber.replace(/\D/g, '').slice(-10);
    const user = await UserLogin.findOneAndUpdate(
      { phone: phoneDigits },
      {
        status: 'banned',
        bannedDate: new Date(),
        bannedReason: reason,
        staffName,
        remarks: `Banned by ${staffName} for: ${reason}`,
        reportDate: new Date()
      },
      { new: true, sort: { loginDate: -1 } }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ 
      message: 'User banned successfully',
      user: {
        phone: user.phone,
        status: user.status,
        bannedDate: user.bannedDate,
        bannedReason: user.bannedReason,
        staffName: user.staffName
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error banning user' });
  }
});

// Endpoint to get user login history
app.get('/PPC/user-login-history/:phoneNumber', async (req, res) => {
  try {
    const phoneDigits = req.params.phoneNumber.replace(/\D/g, '').slice(-10);
    const history = await UserLogin.find({ phone: phoneDigits })
      .sort({ loginDate: -1 })
      .limit(10);

    res.status(200).json({
      count: history.length,
      history: history.map(record => ({
        loginDate: record.loginDate,
        loginMode: record.loginMode,
        status: record.status,
        version: record.version,
        otpStatus: record.otpStatus
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching login history' });
  }
});

// Mount all routers under /PPC prefix - PLACED AFTER THE SPECIFIC ROUTES
// AddPropertyMarketingRouter is mounted FIRST so its /store-id-rent and
// /update-rent-property handlers take precedence over the duplicates still
// living in AddRouter.js (kept for now — safe to delete once verified).
app.use("/PPC", AddPropertyMarketingRouter);
app.use("/PPC", AddRouter);
app.use("/PPC", AddRouters);
app.use("/PPC", PricingPlanRouter);
app.use("/PPC", AdminRouter);
app.use("/PPC", OfficeRouter);
app.use("/PPC", BuyerRouter);
app.use("/PPC", CityRouter);
app.use("/PPC", AreaRouter);
app.use("/PPC", DistrictRouter);
app.use("/PPC", StateRouter);
app.use("/PPC", RollRouter);
app.use("/PPC", DetailRouter);
app.use("/PPC", OfferRouter);
app.use('/PPC', DataRouter);
app.use('/PPC', UserRouter);
app.use('/PPC', BuyerAssistanceRouter);
app.use('/PPC', PhotoRequestRouter);
app.use('/PPC', ProfileRouter);
app.use('/PPC', ContactUsRouter);
app.use('/PPC', FcmTokenRouter); // FCM push (additive)
app.use('/PPC', TextRouter);
app.use('/PPC', NotificationRouter);
app.use('/PPC', VisitAdminRouter);
app.use('/PPC', AdminRollRouter);
app.use('/PPC', PaymentTypeRouter);
app.use('/PPC', FollowUpRouter);
app.use('/PPC', FollowUpBuyerRouter);
app.use('/PPC', NoResponseFollowUpRouter);
app.use('/PPC', VisitorFollowUpRouter);
app.use('/PPC', BillRouter);
app.use('/PPC', LimitRouter);
app.use("/PPC", UploadImageRouter);
app.use("/PPC", BrideImageRouter);
app.use('/PPC', payuRoutes);
app.use('/PPC', propertyRoutes);
app.use('/PPC', payuBuyerRoutes);
app.use('/PPC', payuDirectRoutes);
app.use('/PPC', PointsRouter);
app.use('/PPC', PayUPointsRouter);
app.use('/PPC', PointsPricingRouter);
app.use('/PPC', StayPlanRouter);
app.use('/PPC', PayUStayRouter);
app.use('/PPC', BuyerBillRouter);
app.use('/PPC', EditBuyerBillRouter);
app.use('/PPC', PropertyMessageRouter);
app.use('/PPC', AdsRouter);
app.use('/PPC', AdsDetailRouter);
app.use('/PPC', LoginPopupSettingRouter);
app.use('/PPC', OtpSettingRouter);
app.use('/PPC', OtpNumberRouter);
app.use('/PPC', messageRoutes);
app.use('/PPC', SmsGatewayRouter); // SIM SMS: /notify-owner-contact-view
app.use('/PPC', LiveActivityRouter); // Live user activity: /track-activity, /live-activity
app.use('/PPC', PropertyViewNotifyRouter); // Owner notification: /notify-property-viewed
app.use('/PPC', DataAddedRouter); // Data Added report: /data-added/summary, /data-added/list
app.use('/PPC', dataAddedMail.router); // Data Added e-mail: /data-added-mail/status, /send-now
app.use('/PPC', adminReportMail.router); // Admin report PDF e-mail: /admin-report-mail/status, /send-now
app.use('/PPC', adminExcelMail.router); // Admin detail Excel e-mail: /admin-excel-mail/status, /send-now
app.use('/PPC/', whiteTownRoutes);
app.use('/PPC', SingleSendRoutes);
app.use("/PPC", PMRouter); // PM WhatsApp: /send-text, /pm-history, /pm-stats
app.use("/PPC", PmBulkRouter); // PM Bulk WhatsApp routes
app.use("/PPC/api/bulk-whatsapp", BulkWhatsappRouter); // Admin Bulk WhatsApp (campaign API + large file uploads)
app.use("/PPC", RcmRouter); // Call Management (/process/dashboard/rp.wfh) routes
// app.use("/PPC", RoleAccessRouter); // Roles Access routes

// ── WhatsApp (SmartGrowth AI campaign API) ───────────────────────────────────
// Mounted at BOTH root and /PPC so the routes resolve no matter how nginx
// forwards the path:
//   http://localhost:5005/api/send-whatsapp       (root, for local curl test)
//   https://rentpondy.com/PPC/api/send-whatsapp   (public, via nginx)
// Both send routes enforce their own x-api-key (WA_INTERNAL_API_KEY).
app.use(whatsappCloudRoutes);
app.use("/PPC", whatsappCloudRoutes);

// WhatsApp bulk-send TEST console — /whatsapp-test (page), /whatsapp-test/config,
// /whatsapp-test/send. Passcode-gated (WHATSAPP_TEST_KEY). Mounted at both root
// and /PPC for the same reason as the routes above.
//   https://rentpondy.com/PPC/whatsapp-test
app.use(whatsappTestRoutes);
app.use("/PPC", whatsappTestRoutes);

// AI voice + chat assistant: mounts /api/assistant + the lean search endpoint.
assistant.mount(app);

// SEO layer: /robots.txt, /sitemap*.xml and the server-rendered /property + /rent
// pages. Mounted last so it can never shadow an existing API route.
seo.mount(app);

// 404 Error Handling Middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Arm the scheduled Data Added e-mail. Logs and stays asleep when the SMTP
  // settings are absent, so a missing credential can never block the boot.
  dataAddedMail.start();
  // Same for the daily admin-report PDF and the detail spreadsheet.
  adminReportMail.start();
  adminExcelMail.start();
});