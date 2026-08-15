// import React, { useState, useEffect, useRef } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
// import { toast, ToastContainer } from 'react-toastify';
// import { useDispatch, useSelector } from 'react-redux';
// import { setPhoneNumber } from '../red/userSlice';
// import { Helmet } from 'react-helmet';
// import Flag from 'react-world-flags';
// import logo from '../Assets/rentpondylogo.png';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './Login.css';
// import { RiEdit2Fill } from "react-icons/ri";
// import PrivacyPolicyWeb from './PrivacyPolicyWeb';
// import WhatsAppPolicyWeb from './WhatsAppPolicyWeb';
// import AboutMobile from './AboutMobile';
// import { FaArrowLeft, FaChevronLeft } from 'react-icons/fa';
// import bgg from '../Assets/loo.PNG';
// import otpimg from '../Assets/otp_img.jpeg';

// const Login = ({ onLogin }) => {
//   const [phoneNumber, setPhoneNumberState] = useState('');
//   const [otp, setOtp] = useState('');
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [otpTimer, setOtpTimer] = useState(30);
//   const [canResendOtp, setCanResendOtp] = useState(false);
//   const [countryCode, setCountryCode] = useState('+91');
//   const [selectedCountry, setSelectedCountry] = useState('IN');
//   const [isPhoneNumberEntered, setIsPhoneNumberEntered] = useState(false);
//   const [mockOtp, setMockOtp] = useState('');
//   const phoneInputRef = useRef(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
//   const [isChecked, setIsChecked] = useState(true);
//   const [isDisabled, setIsDisabled] = useState(false);
//   const [loginMode, setLoginMode] = useState('web');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showLoginFailPopup, setShowLoginFailPopup] = useState(false);
//   const [failureMessage, setFailureMessage] = useState('');

//   const [isScrolling, setIsScrolling] = useState(false);

//   useEffect(() => {
//     let scrollTimeout;

//     const handleScroll = () => {
//       setIsScrolling(true);

//       clearTimeout(scrollTimeout);
//       scrollTimeout = setTimeout(() => {
//         setIsScrolling(false);
//       }, 150); // Adjust the delay as needed
//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       clearTimeout(scrollTimeout);
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);
//   const storedPhoneNumber = useSelector(state => state.phoneNumber);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Country-specific phone number digit length mapping
//   const countryPhoneDigits = {
//     'IN': 10,  // India
//     'SG': 8,   // Singapore
//     'US': 10,  // United States
//     'CA': 10,  // Canada
//     'GB': 11,  // United Kingdom
//     'AU': 9,   // Australia
//     'NZ': 9,   // New Zealand
//     'MY': 9,   // Malaysia
//     'PH': 10,  // Philippines
//     'TH': 9,   // Thailand
//     'JP': 10,  // Japan
//     'KR': 10,  // South Korea
//     'CN': 11,  // China
//     'BD': 10,  // Bangladesh
//     'PK': 10,  // Pakistan
//     'AE': 9,   // United Arab Emirates
//     'SA': 9,   // Saudi Arabia
//     'BR': 11,  // Brazil
//     'MX': 10,  // Mexico
//     'FR': 9,   // France
//     'DE': 11,  // Germany
//     'IT': 10,  // Italy
//     'ES': 9,   // Spain
//   };

//   const countryCodes = [
//     { code: '+93', country: 'Afghanistan', flag: 'AF' },
//     { code: '+213', country: 'Algeria', flag: 'DZ' },
//     { code: '+54', country: 'Argentina', flag: 'AR' },
//     { code: '+61', country: 'Australia', flag: 'AU' },
//     { code: '+43', country: 'Austria', flag: 'AT' },
//     { code: '+994', country: 'Azerbaijan', flag: 'AZ' },
//     { code: '+973', country: 'Bahrain', flag: 'BH' },
//     { code: '+880', country: 'Bangladesh', flag: 'BD' },
//     { code: '+32', country: 'Belgium', flag: 'BE' },
//     { code: '+975', country: 'Bhutan', flag: 'BT' },
//     { code: '+55', country: 'Brazil', flag: 'BR' },
//     { code: '+1', country: 'Canada', flag: 'CA' },
//     { code: '+56', country: 'Chile', flag: 'CL' },
//     { code: '+86', country: 'China', flag: 'CN' },
//     { code: '+57', country: 'Colombia', flag: 'CO' },
//     { code: '+53', country: 'Cuba', flag: 'CU' },
//     { code: '+45', country: 'Denmark', flag: 'DK' },
//     { code: '+20', country: 'Egypt', flag: 'EG' },
//     { code: '+33', country: 'France', flag: 'FR' },
//     { code: '+995', country: 'Georgia', flag: 'GE' },
//     { code: '+49', country: 'Germany', flag: 'DE' },
//     { code: '+30', country: 'Greece', flag: 'GR' },
//     { code: '+36', country: 'Hungary', flag: 'HU' },
//     { code: '+91', country: 'India', flag: 'IN' },
//     { code: '+62', country: 'Indonesia', flag: 'ID' },
//     { code: '+98', country: 'Iran', flag: 'IR' },
//     { code: '+98', country: 'Iran', flag: 'IR' },
//     { code: '+972', country: 'Israel', flag: 'IL' },
//     { code: '+39', country: 'Italy', flag: 'IT' },
//     { code: '+81', country: 'Japan', flag: 'JP' },
//     { code: '+7', country: 'Kazakhstan', flag: 'KZ' },
//     { code: '+254', country: 'Kenya', flag: 'KE' },
//     { code: '+996', country: 'Kyrgyzstan', flag: 'KG' },
//     { code: '+218', country: 'Libya', flag: 'LY' },
//     { code: '+60', country: 'Malaysia', flag: 'MY' },
//     { code: '+52', country: 'Mexico', flag: 'MX' },
//     { code: '+976', country: 'Mongolia', flag: 'MN' },
//     { code: '+212', country: 'Morocco', flag: 'MA' },
//     { code: '+95', country: 'Myanmar', flag: 'MM' },
//     { code: '+977', country: 'Nepal', flag: 'NP' },
//     { code: '+31', country: 'Netherlands', flag: 'NL' },
//     { code: '+64', country: 'New Zealand', flag: 'NZ' },
//     { code: '+234', country: 'Nigeria', flag: 'NG' },
//     { code: '+47', country: 'Norway', flag: 'NO' },
//     { code: '+968', country: 'Oman', flag: 'OM' },
//     { code: '+92', country: 'Pakistan', flag: 'PK' },
//     { code: '+970', country: 'Palestine', flag: 'PS' },
//     { code: '+51', country: 'Peru', flag: 'PE' },
//     { code: '+63', country: 'Philippines', flag: 'PH' },
//     { code: '+48', country: 'Poland', flag: 'PL' },
//     { code: '+974', country: 'Qatar', flag: 'QA' },
//     { code: '+40', country: 'Romania', flag: 'RO' },
//     { code: '+7', country: 'Russia', flag: 'RU' },
//     { code: '+966', country: 'Saudi Arabia', flag: 'SA' },
//     { code: '+65', country: 'Singapore', flag: 'SG' },
//     { code: '+27', country: 'South Africa', flag: 'ZA' },
//     { code: '+82', country: 'South Korea', flag: 'KR' },
//     { code: '+34', country: 'Spain', flag: 'ES' },
//     { code: '+94', country: 'Sri Lanka', flag: 'LK' },
//     { code: '+94', country: 'Sri Lanka', flag: 'LK' },
//     { code: '+46', country: 'Sweden', flag: 'SE' },
//     { code: '+41', country: 'Switzerland', flag: 'CH' },
//     { code: '+255', country: 'Tanzania', flag: 'TZ' },
//     { code: '+66', country: 'Thailand', flag: 'TH' },
//     { code: '+216', country: 'Tunisia', flag: 'TN' },
//     { code: '+90', country: 'Turkey', flag: 'TR' },
//     { code: '+993', country: 'Turkmenistan', flag: 'TM' },
//     { code: '+971', country: 'United Arab Emirates', flag: 'AE' },
//     { code: '+44', country: 'United Kingdom', flag: 'GB' },
//     { code: '+1', country: 'United States', flag: 'US' },
//     { code: '+998', country: 'Uzbekistan', flag: 'UZ' },
//     { code: '+58', country: 'Venezuela', flag: 'VE' },
//     { code: '+84', country: 'Vietnam', flag: 'VN' },
//   ];
// //   const countryCodes = [
// //   { code: '+93', country: 'Afghanistan', flag: 'AF' },
// //   { code: '+213', country: 'Algeria', flag: 'DZ' },
// //   { code: '+54', country: 'Argentina', flag: 'AR' },
// //   { code: '+61', country: 'Australia', flag: 'AU' },
// //   { code: '+43', country: 'Austria', flag: 'AT' },
// //   { code: '+994', country: 'Azerbaijan', flag: 'AZ' },

// //   { code: '+973', country: 'Bahrain', flag: 'BH' },
// //   { code: '+880', country: 'Bangladesh', flag: 'BD' },
// //   { code: '+32', country: 'Belgium', flag: 'BE' },
// //   { code: '+975', country: 'Bhutan', flag: 'BT' },
// //   { code: '+55', country: 'Brazil', flag: 'BR' },

// //   { code: '+1', country: 'Canada', flag: 'CA' },
// //   { code: '+56', country: 'Chile', flag: 'CL' },
// //   { code: '+86', country: 'China', flag: 'CN' },
// //   { code: '+57', country: 'Colombia', flag: 'CO' },
// //   { code: '+53', country: 'Cuba', flag: 'CU' },

// //   { code: '+45', country: 'Denmark', flag: 'DK' },

// //   { code: '+20', country: 'Egypt', flag: 'EG' },

// //   { code: '+33', country: 'France', flag: 'FR' },

// //   { code: '+995', country: 'Georgia', flag: 'GE' },
// //   { code: '+49', country: 'Germany', flag: 'DE' },
// //   { code: '+30', country: 'Greece', flag: 'GR' },

// //   { code: '+36', country: 'Hungary', flag: 'HU' },

// //   { code: '+91', country: 'India', flag: 'IN' },
// //   { code: '+62', country: 'Indonesia', flag: 'ID' },
// //   { code: '+98', country: 'Iran', flag: 'IR' },
// //   { code: '+98', country: 'Iran', flag: 'IR' },
// //   { code: '+972', country: 'Israel', flag: 'IL' },
// //   { code: '+39', country: 'Italy', flag: 'IT' },

// //   { code: '+81', country: 'Japan', flag: 'JP' },

// //   { code: '+7', country: 'Kazakhstan', flag: 'KZ' },
// //   { code: '+254', country: 'Kenya', flag: 'KE' },
// //   { code: '+996', country: 'Kyrgyzstan', flag: 'KG' },

// //   { code: '+218', country: 'Libya', flag: 'LY' },

// //   { code: '+60', country: 'Malaysia', flag: 'MY' },
// //   { code: '+52', country: 'Mexico', flag: 'MX' },
// //   { code: '+976', country: 'Mongolia', flag: 'MN' },
// //   { code: '+212', country: 'Morocco', flag: 'MA' },
// //   { code: '+95', country: 'Myanmar', flag: 'MM' },

// //   { code: '+977', country: 'Nepal', flag: 'NP' },
// //   { code: '+31', country: 'Netherlands', flag: 'NL' },
// //   { code: '+64', country: 'New Zealand', flag: 'NZ' },
// //   { code: '+234', country: 'Nigeria', flag: 'NG' },
// //   { code: '+47', country: 'Norway', flag: 'NO' },

// //   { code: '+968', country: 'Oman', flag: 'OM' },

// //   { code: '+92', country: 'Pakistan', flag: 'PK' },
// //   { code: '+970', country: 'Palestine', flag: 'PS' },
// //   { code: '+51', country: 'Peru', flag: 'PE' },
// //   { code: '+63', country: 'Philippines', flag: 'PH' },
// //   { code: '+48', country: 'Poland', flag: 'PL' },

// //   { code: '+974', country: 'Qatar', flag: 'QA' },

// //   { code: '+40', country: 'Romania', flag: 'RO' },
// //   { code: '+7', country: 'Russia', flag: 'RU' },

// //   { code: '+966', country: 'Saudi Arabia', flag: 'SA' },
// //   { code: '+65', country: 'Singapore', flag: 'SG' },
// //   { code: '+27', country: 'South Africa', flag: 'ZA' },
// //   { code: '+82', country: 'South Korea', flag: 'KR' },
// //   { code: '+34', country: 'Spain', flag: 'ES' },
// //   { code: '+94', country: 'Sri Lanka', flag: 'LK' },
// //   { code: '+94', country: 'Sri Lanka', flag: 'LK' },
// //   { code: '+46', country: 'Sweden', flag: 'SE' },
// //   { code: '+41', country: 'Switzerland', flag: 'CH' },

// //   { code: '+255', country: 'Tanzania', flag: 'TZ' },
// //   { code: '+66', country: 'Thailand', flag: 'TH' },
// //   { code: '+216', country: 'Tunisia', flag: 'TN' },
// //   { code: '+90', country: 'Turkey', flag: 'TR' },
// //   { code: '+993', country: 'Turkmenistan', flag: 'TM' },

// //   { code: '+971', country: 'United Arab Emirates', flag: 'AE' },
// //   { code: '+44', country: 'United Kingdom', flag: 'GB' },
// //   { code: '+1', country: 'United States', flag: 'US' },
// //   { code: '+998', country: 'Uzbekistan', flag: 'UZ' },

// //   { code: '+58', country: 'Venezuela', flag: 'VE' },
// //   { code: '+84', country: 'Vietnam', flag: 'VN' },
// // ];


//   useEffect(() => {
//     const checkLoggedIn = async () => {
//       const storedPhone = localStorage.getItem('phoneNumber');
      
//       if (storedPhone) {
//         dispatch(setPhoneNumber(storedPhone));
//         navigate('/pondicherry', { state: { phoneNumber: phoneNumber } });
//       }
//     };

//     checkLoggedIn();
//   }, [dispatch, navigate]);

  


//   const handleCheckboxChange = (e) => {
//     const checked = e.target.checked;
//     setIsChecked(checked);
//     setIsDisabled(!checked);
//   };

//   // Get phone digit requirement for selected country
//   const getPhoneDigitRange = (countryFlag) => {
//     const digits = countryPhoneDigits[countryFlag] || 10;
//     return { min: digits - 1, max: digits + 2 }; // Allow slight flexibility
//   };

//   const handleCountryChange = (e) => {
//     const selected = e.target.value;
//     const country = countryCodes.find(c => c.flag === selected);
//     setCountryCode(country.code);
//     setSelectedCountry(selected);
//   };

//   const handlePhoneNumberChange = (e) => {
//     const phone = e.target.value;
//     // Only allow digits
//     const digitsOnly = phone.replace(/\D/g, '');
//     if (digitsOnly.length <= (countryPhoneDigits[selectedCountry] || 15)) {
//       setPhoneNumberState(digitsOnly);
//       setIsPhoneNumberEntered(digitsOnly.length > 0);
//     }
//   };

//   // OTP timer
//   useEffect(() => {
//     if (isOtpSent && otpTimer > 0) {
//       const interval = setInterval(() => {
//         setOtpTimer((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(interval);
//     } else if (otpTimer === 0) {
//       setCanResendOtp(true);
//     }
//   }, [isOtpSent, otpTimer]);



//   // Generate random OTP (6 digits)
//   const generateOtp = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
//   };

//   const handleSendOtp = async (e) => {
//   e.preventDefault();

//   console.log("====== OTP SENDING INITIATED ======");
//   console.log("Selected Country:", selectedCountry);
//   console.log("Country Code:", countryCode);
//   console.log("Phone Number:", phoneNumber);

//   if (!phoneNumber) {
//     toast.error('Please enter a valid phone number.', {
//       position: 'top-center',
//       autoClose: 5000,
//     });
//     return;
//   }

//   // Validate phone number length based on country
//   const requiredDigits = countryPhoneDigits[selectedCountry] || 10;
//   const phoneDigits = phoneNumber.replace(/\D/g, '').length;
//   console.log("Required Digits:", requiredDigits, "Actual Digits:", phoneDigits);
  
//   if (phoneDigits !== requiredDigits) {
//     toast.error(`Please enter a valid ${selectedCountry} phone number (${requiredDigits} digits).`, {
//       position: 'top-center',
//       autoClose: 5000,
//     });
//     return;
//   }

//   setIsLoading(true);

//   try {
//     const fullPhoneNumber = `${phoneNumber}`;
//     const plainPhoneDigits = phoneNumber.replace(/\D/g, '');
//     const mobileNumber = String(fullPhoneNumber).replace(/\D/g, "");
//     const countryCodeDigits = countryCode.replace(/\D/g, "");
//     const to = `${countryCodeDigits}${mobileNumber}`;

//     // 1. Check if user is directly verified
//     const directCheck = await axios.get(`${process.env.REACT_APP_API_URL}/user/direct-verified-users-rent`);
//     const matchedUser = directCheck.data.users.find(
//       (u) => u.phone === plainPhoneDigits && u.directVerified
//     );

//     if (matchedUser) {
//       toast.success('User is directly verified. Logging in...', {
//         position: 'top-center',
//         autoClose: 5000,
//       });

//       localStorage.setItem('phoneNumber', fullPhoneNumber);
//       dispatch(setPhoneNumber(fullPhoneNumber));
//       setIsLoading(false);
//       navigate('/pondicherry');
//       return; // Skip OTP
//     }

//     console.log("======================================");
//     console.log("Country Check - Is INDIA?:", selectedCountry === 'IN');
//     console.log("Country Code Digits:", countryCodeDigits);
//     console.log("Mobile Number:", mobileNumber);
//     console.log("Final WhatsApp Number (to):", to);
//     console.log("======================================");

//     // 2. Check if country is INDIA (IN)
//     if (selectedCountry === 'IN') {
//       console.log("🇮🇳 INDIA FLOW: Calling send-otp-rent API...");
//       // ✅ FOR INDIA: Call send-otp-rent to get OTP from AWS
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-otp-rent`, {
//         phoneNumber: fullPhoneNumber,
//         loginMode: loginMode,
//         countryCode: countryCode
//       });

//       const generatedOtp = response.data.result?.otp;

//       if (generatedOtp) {
//         toast.success('OTP Sent Successfully!', {
//           position: 'top-center',
//           autoClose: 20000,
//         });

//         // ✅ Send WhatsApp OTP Notification for India
//         try {
//           console.log("📱 Sending WhatsApp OTP for India...");
//           console.log("Country Code Digits:", countryCodeDigits);
//           console.log("Mobile Number:", mobileNumber);
//           console.log("To number:", to);
//           console.log("To length:", to.length);

//           const otpMessage = `Hi there, 👋

// Your OTP for Rent Pondy login is: ${generatedOtp}

// ⏱️ This OTP expires in 30 minutes.
// 🔒 Never share this OTP with anyone.

// If you didn't request this OTP, please ignore this message.

// – Team Rent Pondy`;

//           if (to.length >= 8 && phoneDigits >= 10) {
//             console.log("✅ India number is valid, attempting to send message...");
//             console.log("✅ Length:", to.length, ">= 8 ?", to.length >= 8);
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-message`, {
//               to,
//               message: otpMessage,
//             });
//             console.log("✅ WhatsApp OTP message sent successfully to:", to, "Response:", response.data);
//           } else {
//             console.log("❌ India number validation failed:", to, "Length:", to.length, "Digits:", phoneDigits);
//           }
//         } catch (whatsErr) {
//           console.error(
//             "⚠️ WhatsApp OTP message failed (non-blocking):",
//             whatsErr.message,
//             "Error details:",
//             whatsErr.response?.data || whatsErr
//           );
//         }

//         setMockOtp(generatedOtp);
//         setIsOtpSent(true);
//         setOtpTimer(30);
//         setCanResendOtp(false);
//         setOtp('');
//         setIsLoading(false);
//         console.log("======================================");
//         console.log("✅ INDIA FLOW COMPLETED");
//         console.log("OTP from AWS:", generatedOtp);
//         console.log("Awaiting user OTP verification...");
//         console.log("======================================");
//       }
//     } else {
//       console.log("🌍 INTERNATIONAL FLOW: Generating OTP locally and sending via WhatsApp...");
//       // ✅ FOR OTHER COUNTRIES: Generate OTP locally & send via WhatsApp only
//       const localGeneratedOtp = generateOtp();
//       console.log("✅ Generated Local OTP:", localGeneratedOtp);

//       toast.success('OTP Sent Successfully!', {
//         position: 'top-center',
//         autoClose: 20000,
//       });

//       // ✅ Send WhatsApp OTP Message for International Countries
//       try {
//         console.log("📱 Sending WhatsApp OTP for International Country...");
//         console.log("Country Code Digits:", countryCodeDigits);
//         console.log("Mobile Number:", mobileNumber);
//         console.log("To number:", to);
//         console.log("To length:", to.length);
//         console.log("Generated OTP:", localGeneratedOtp);

//         const otpMessage = `Hi there, 👋

// Your OTP for Rent Pondy login is: ${localGeneratedOtp}

// ⏱️ This OTP expires in 30 minutes.
// 🔒 Never share this OTP with anyone.

// If you didn't request this OTP, please ignore this message.

// – Team Rent Pondy`;

//         // Minimum valid WhatsApp number length is 8 digits (e.g., Singapore: +65 + 8 digits = 10)
//         if (to.length >= 8 && phoneDigits >= (countryPhoneDigits[selectedCountry] || 6)) {
//           console.log("✅ Phone number is valid, attempting to send message...");
//           console.log("✅ Length:", to.length, ">=  8 ?", to.length >= 8);
//           console.log("✅ Digits:", phoneDigits, "===", countryPhoneDigits[selectedCountry]);
//           console.log("📤 Sending request to send-message API...");
//           console.log("API Endpoint:", `${process.env.REACT_APP_API_URL}/send-message`);
//           console.log("Request Payload:", { to, message: otpMessage });
          
//           const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-message`, {
//             to,
//             message: otpMessage,
//           });
//           console.log("✅ WhatsApp OTP message sent to international number:", to);
//           console.log("📨 API Response:", response.data);
//           toast.success('OTP sent to WhatsApp!', {
//             position: 'top-center',
//             autoClose: 3000,
//           });
//         } else {
//           console.log("❌ Phone number validation failed:", to, "Length:", to.length);
//           console.log("❌ Required - Length >= 8?", to.length >= 8, "|", "Digits correct?", phoneDigits, "==", countryPhoneDigits[selectedCountry]);
//           toast.error(`Invalid phone number. Expected ${countryPhoneDigits[selectedCountry]} digits.`, {
//             position: 'top-center',
//             autoClose: 5000,
//           });
//           setIsLoading(false);
//           return;
//         }
//       } catch (whatsErr) {
//         console.error(
//           "⚠️ WhatsApp OTP message failed (non-blocking):",
//           whatsErr.message,
//           "Error details:",
//           whatsErr.response?.data || whatsErr
//         );
//         console.error("❌ Full Error Object:", whatsErr);
//         // Still proceed with OTP setup even if WhatsApp fails - it's non-blocking
//       }

//       setMockOtp(localGeneratedOtp);
//       setIsOtpSent(true);
//       setOtpTimer(30);
//       setCanResendOtp(false);
//       setOtp('');
//       setIsLoading(false);
//       console.log("======================================");
//       console.log("✅ INTERNATIONAL FLOW COMPLETED");
//       console.log("OTP Set:", localGeneratedOtp);
//       console.log("Awaiting user OTP verification...");
//       console.log("======================================");
//     }
//   } catch (error) {
//     const errorMessage = error.response?.data?.error || 'Something went wrong!';
//     setFailureMessage(errorMessage);
//     setShowLoginFailPopup(true);
//     setIsLoading(false);
//   }
// };



//   const handleVerifyOtp = async (e) => {
//   e.preventDefault();

//   if (!otp) {
//     toast.error('Please enter the OTP.');
//     return;
//   }

//   setIsLoading(true);

//   try {
//     // ✅ FOR INDIA: Verify OTP against backend
//     // ✅ FOR OTHER COUNTRIES: Verify OTP locally, then call backend verify-otp-rent
//     if (selectedCountry === 'IN') {
//       console.log("🇮🇳 INDIA OTP Verification: Calling verify-otp-rent backend API...");
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/verify-otp-rent`, {
//         phoneNumber: `${phoneNumber}`,
//         otp: otp,
//       });

//       if (response.status !== 200) {
//         throw new Error('OTP verification failed');
//       }
//       console.log("✅ India OTP verified successfully from backend");
//     } else {
//       // ✅ For international countries: First verify locally, then call backend
//       console.log("🌍 INTERNATIONAL OTP Verification: Verifying locally first...");
//       if (otp !== mockOtp) {
//         throw new Error('Invalid OTP');
//       }
//       console.log("✅ International OTP verified locally");
      
//       // ✅ Now call backend verify-otp-rent to register user in system
//       console.log("🌍 Calling verify-otp-rent backend API for international user...");
//       const backendResponse = await axios.post(`${process.env.REACT_APP_API_URL}/verify-otp-rent`, {
//         phoneNumber: `${phoneNumber}`,
//         otp: otp,
//         countryCode: countryCode,
//         country: selectedCountry,
//       });

//       if (backendResponse.status !== 200) {
//         throw new Error('Backend verification failed');
//       }
//       console.log("✅ International user registered in backend system");
//     }

//     toast.success('OTP verified successfully!');
//     const fullPhoneNumber = `${phoneNumber}`;
//     localStorage.setItem('phoneNumber', fullPhoneNumber);
//     dispatch(setPhoneNumber(fullPhoneNumber));

//     // ✅ Log app open after successful OTP verification
//     try {
//       console.log("📊 Logging app open for user:", fullPhoneNumber);
//       const logResponse = await axios.post(`${process.env.REACT_APP_API_URL}/log-app-open`, {
//         phoneNumber: fullPhoneNumber,
//         countryCode: countryCode,
//         country: selectedCountry,
//       });
//       console.log("✅ App open logged successfully:", logResponse.data);
//     } catch (logErr) {
//       console.warn(
//         "⚠️ Failed to log app open (non-blocking):",
//         logErr.message,
//         "Error details:",
//         logErr.response?.data || logErr
//       );
//       // Continue with login even if logging fails
//     }

//     // ✅ Send WhatsApp Welcome Message
//     try {
//       console.log("📱 Sending WhatsApp Welcome Message...");
//       const ownerName = "Owner"; // Default name for login
//       const rawPhone = fullPhoneNumber || "";

//       // ✅ Format phone number (remove symbols, spaces, etc.)
//       const mobileNumber = String(rawPhone).replace(/\D/g, "");

//       // ✅ Use the selected country code for all countries
//       const countryCodeDigits = countryCode.replace(/\D/g, "");
//       const to = `${countryCodeDigits}${mobileNumber}`;

//       console.log("Phone details - Country Code:", countryCodeDigits, "Mobile:", mobileNumber, "To:", to);

//       // ✅ WhatsApp Welcome + Login Success Message
//       const message = `Hi ${ownerName}, 👋
// Welcome to Rent Pondy! 🏡

// ✅ Login Successful

// You can now add, manage, and promote your properties easily.
// We're happy to have you with us!

// – Team Rent Pondy`;

//       // ✅ Send WhatsApp message only if number is valid
//       if (to.length >= 8) {
//         console.log("✅ Welcome message number is valid, attempting to send...");
//         console.log("✅ Length:", to.length, ">= 8 ?", to.length >= 8);
//         const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-message`, {
//           to,
//           message,
//         });

//         console.log("✅ WhatsApp welcome message sent to:", to, "Response:", response.data);
//       } else {
//         console.log("❌ Invalid phone number:", rawPhone, "Length:", to.length);
//       }
//     } catch (whatsErr) {
//       console.error(
//         "⚠️ WhatsApp message failed (non-blocking):",
//         whatsErr.message,
//         "Error details:",
//         whatsErr.response?.data || whatsErr
//       );
//     }

//     navigate('/pondicherry');
//     setIsLoading(false);
//   } catch (error) {
//     let errorMessage = 'OTP verification failed!';
    
//     if (selectedCountry === 'IN') {
//       errorMessage = error.response?.data?.message || 'OTP verification failed!';
//     } else {
//       errorMessage = error.message || 'Invalid OTP';
//     }
    
//     setFailureMessage(errorMessage);
//     setShowLoginFailPopup(true);
//     setIsLoading(false);

//     // ✅ Send WhatsApp Failure Message when OTP is incorrect
//     try {
//       console.log("📱 Sending WhatsApp Failure Message...");
//       const ownerName = "Owner"; // Default name for login
//       const rawPhone = phoneNumber || "";

//       // ✅ Format phone number (remove symbols, spaces, etc.)
//       const mobileNumber = String(rawPhone).replace(/\D/g, "");

//       // ✅ Use the selected country code for all countries
//       const countryCodeDigits = countryCode.replace(/\D/g, "");
//       const to = `${countryCodeDigits}${mobileNumber}`;

//       console.log("Failure message - To number:", to, "Length:", to.length);

//       // ✅ WhatsApp Login Failed Message
//       const failureMessage = `Hi ${ownerName}, 🔔

// ⚠️ Login Attempt Failed

// We noticed an incorrect OTP was entered during login.

// If this wasn't you, please secure your account immediately.

// For assistance, contact our support team:
// 📞 +91-8300622013
// 📧 info.rentpondy@gmail.com

// Stay secure!
// – Team Rent Pondy`;

//       // ✅ Send WhatsApp message only if number is valid
//       if (to.length >= 8) {
//         console.log("✅ Failure message number is valid, attempting to send...");
//         console.log("✅ Length:", to.length, ">= 8 ?", to.length >= 8);
//         const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-message`, {
//           to,
//           message: failureMessage,
//         });

//         console.log("✅ WhatsApp failure message sent to:", to, "Response:", response.data);
//       } else {
//         console.log("❌ Invalid phone number for failure message:", rawPhone, "Length:", to.length);
//       }
//     } catch (whatsErr) {
//       console.error(
//         "⚠️ WhatsApp failure message failed (non-blocking):",
//         whatsErr.message,
//         "Error details:",
//         whatsErr.response?.data || whatsErr
//       );
//     }
//   }
// };


  
//   const handleResendOtp = async () => {
//     if (!canResendOtp) return;

//     try {
//       const mobileNumber = String(phoneNumber).replace(/\D/g, "");
//       const countryCodeDigits = countryCode.replace(/\D/g, "");
//       const to = `${countryCodeDigits}${mobileNumber}`;

//       let newOtp;

//       if (selectedCountry === 'IN') {
//         // ✅ FOR INDIA: Call send-otp-rent to get OTP from AWS
//         const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-otp-rent`, {
//           phoneNumber: `${phoneNumber}`,
//           loginMode: loginMode,
//           countryCode: countryCode
//         });

//         newOtp = response.data.result?.otp;
//       } else {
//         // ✅ FOR OTHER COUNTRIES: Generate OTP locally
//         newOtp = generateOtp();
//       }

//       if (newOtp) {
//         toast.success(`OTP resent!`, {
//           position: 'top-center',
//           autoClose: 20000,
//         });

//         // ✅ Send WhatsApp OTP Resend Notification
//         try {
//           console.log("📱 Resending WhatsApp OTP...");
//           console.log("To number:", to);
//           console.log("OTP:", newOtp);

//           const resendMessage = `Hi there, 👋

// Your resent OTP for Rent Pondy login is: ${newOtp}

// ⏱️ This OTP expires in 30 minutes.
// 🔒 Never share this OTP with anyone.

// – Team Rent Pondy`;

//           if (to.length >= 8) {
//             console.log("✅ Resend number is valid, attempting to send message...");
//             console.log("✅ Length:", to.length, ">= 8 ?", to.length >= 8);
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-message`, {
//               to,
//               message: resendMessage,
//             });
//             console.log("✅ WhatsApp resend OTP message sent to:", to, "Response:", response.data);
//           } else {
//             console.log("❌ Phone number validation failed for resend:", to, "Length:", to.length);
//           }
//         } catch (whatsErr) {
//           console.error(
//             "⚠️ WhatsApp resend OTP message failed (non-blocking):",
//             whatsErr.message,
//             "Error details:",
//             whatsErr.response?.data || whatsErr
//           );
//         }

//         setMockOtp(newOtp);
//         setOtpTimer(30);
//         setCanResendOtp(false);
//         setOtp('');
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || 'Failed to resend OTP.';
//       setFailureMessage(errorMessage);
//       setShowLoginFailPopup(true);
//     }
//   };

//   const handleEdit = () => {
//     setIsOtpSent(false);
//     setTimeout(() => {
//       phoneInputRef.current?.focus();
//     }, 100);
//   };

//   if (storedPhoneNumber) {
//     return null;
//   }


//   return (
//     <>
//       <style>{`
//         .custom-background::placeholder {
//           color: white;
//         }
//       `}</style>
//       {console.log('isOtpSent:', isOtpSent)}

// <Container fluid className="p-0 d-flex align-items-center justify-content-center">
//   <Row className="g-0">
//           <div className="d-flex flex-column justify-content-between align-items-center"
//           style={{
//               maxWidth: "500px",
//               minWidth: "400px",
//               Width: "100%",
//               height: "100vh",
//               backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcuV4KOIIk3EuvX9hVPSTszzfiPqalO5Oipbfm5wXCPVFgtWiFpMEiO3K2GpjuV87G61Y&usqp=CAU')",
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               backgroundRepeat: "no-repeat",
//               color: "white",
//             }}>

//     {!isOtpSent ? (
//       // === SEND OTP VIEW ===
  
//         <div
//           className="d-flex flex-column justify-content-between align-items-center p-2"
//           style={{
//             width: "100%",
//             height: "100%",
//   backgroundImage: `url(${bgg})`, // ← must use url() and template literal
//             backdropFilter: "blur(3px)",
//                  backgroundSize: "cover",
//       backgroundPosition: "center",
//       backgroundRepeat: "no-repeat",
//           }}
//         >
//           <div className="mt-2 text-start w-100">
//                 <h1 className="welcome-title text-white m-0 ps-3 pt-4">Welcome Back</h1>
//                 <p className='ps-3' style={{color:"#989EA0"}}>Login to continue</p>
//           </div>

//           <div className="text-center" style={{ marginBottom: '10px' }}>

//             <img src={logo} alt="Logo" style={{ height: 100, width: 100, borderRadius: 16, boxShadow: '0 4px 16px rgba(79,75,126,0.15)' }} />
//             <div style={{
//               fontFamily: 'Montserrat, Poppins, Inter, Arial, sans-serif',
//               fontWeight: 800,
//               fontSize: 32,
//               color: '#4F4B7E',
//               marginTop: 8,
//               letterSpacing: 1.5,
//               textShadow: '0 2px 8px rgba(79,75,126,0.08)'
//             }}>
//               Rent Pondy
//             </div>
//             <div style={{
//               fontFamily: 'Poppins, Inter, Arial, sans-serif',
//               fontWeight: 500,
//               fontSize: 16,
//               color: '#fff',
//               marginTop: 2,
//               marginBottom: 2
//             }}>
//               Connecting Tenants and Owners Seamlessly
//             </div>

//            <Form onSubmit={handleSendOtp}>
//                     <Form.Group className="mb-3" controlId="phoneInput">
//                       {/* Single row flex container for country code + phone number */}
//                       <div style={{
//                         display: 'flex',
//                         width: '100%',
//                         maxWidth: 360,
//                         margin: '0 auto',
//                         borderRadius: 8,
//                         backgroundColor: "#f5f5f5",
//                         boxShadow: '0 2px 8px rgba(79,75,126,0.07)',
//                         overflow: 'hidden',
//                         alignItems: 'center',
//                         flexWrap: 'nowrap',
//                         border: '2px solid transparent',
//                         transition: 'all 0.3s ease'
//                       }}>
//                         {/* Country Code Section */}
//                         <div style={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '6px',
//                           padding: '0 12px',
//                           borderRight: '1px solid #e0e0e0',
//                           flexShrink: 0,
//                           height: '48px'
//                         }}>
//                           <Flag code={selectedCountry} style={{ width: '20px', height: '14px' }} />
//                           <Form.Select
//                             value={selectedCountry}
//                             onChange={handleCountryChange}
//                             aria-label="Select Country"
//                             style={{
//                               width: 'auto',
//                               backgroundColor: "transparent",
//                               color: '#4F4B7E',
//                               fontWeight: 600,
//                               border: 'none',
//                               outline: 'none',
//                               cursor: 'pointer',
//                               fontFamily: 'Poppins, Inter, Arial, sans-serif',
//                               fontSize: 13,
//                               padding: '4px 0',
//                               whiteSpace: 'nowrap'
//                             }}
//                           >
//                             {countryCodes.map((country) => (
//                               <option className="text-dark" key={country.code} value={country.flag}>
//                                 {country.flag} {country.code}
//                               </option>
//                             ))}
//                           </Form.Select>
//                         </div>

//                         {/* Phone Number Input */}
//                         <Form.Control
//                           type="tel"
//                           placeholder={`Enter ${selectedCountry} Mobile No (${countryPhoneDigits[selectedCountry] || 10} digits)`}
//                           value={phoneNumber}
//                           onChange={handlePhoneNumberChange}
//                           required
//                           ref={phoneInputRef}
//                           style={{
//                             flex: 1,
//                             backgroundColor: "transparent",
//                             color: '#222',
//                             fontWeight: 600,
//                             border: 'none',
//                             fontFamily: 'Poppins, Inter, Arial, sans-serif',
//                             fontSize: 15,
//                             outline: 'none',
//                             boxShadow: 'none',
//                             padding: '12px 16px',
//                             minWidth: 0,
//                             height: '48px',
//                             transition: 'all 0.3s ease'
//                           }}
//                           maxLength={countryPhoneDigits[selectedCountry] || 15}
//                           onFocus={(e) => {
//                             e.target.parentElement.style.borderColor = '#4F4B7E';
//                             e.target.parentElement.style.boxShadow = '0 2px 12px rgba(79,75,126,0.15)';
//                           }}
//                           onBlur={(e) => {
//                             e.target.parentElement.style.borderColor = 'transparent';
//                             e.target.parentElement.style.boxShadow = '0 2px 8px rgba(79,75,126,0.07)';
//                           }}
//                         />
//                       </div>
//                     </Form.Group>
//                     <style>
//                       {`
//                         input[type="tel"]::-webkit-inner-spin-button,
//                         input[type="tel"]::-webkit-outer-spin-button {
//                           -webkit-appearance: none;
//                           margin: 0;
//                         }
//                       `}
//                     </style>
//                     <div className="d-flex justify-content-center">
//                       <Button type="submit"
//                         disabled={isLoading}
//                         style={{ backgroundColor: isLoading ? "#ccc" : "#4F4B7E", border: "2px solid #4F4B7E", fontWeight: 700, fontSize: 16, borderRadius: 8, cursor: isLoading ? 'not-allowed' : 'pointer' }}
//                         className="btn w-50 btn-small mt-2">
//                         {isLoading ? 'LOGGING IN...' : 'LOGIN'}
//                       </Button>
//                     </div>
//                   </Form>
//           </div>
//            <div className='d-flex flex-column align-items-center pb-2'
//   //     style={{
//   //   position: 'absolute',   // or 'fixed' if you want it always at the screen bottom
//   //   bottom: 0,
//   //   width: '100%',
//   //   padding: '10px',        // optional spacing
//   //        // optional background
//   // }}
//   >
//                 <p className="m-0" style={{color:"#fff"}}>
//                   Edit or Add Your Property <span style={{ color: "rgb(22, 198, 22)" }} className="highlight fw-bold ms-2">
//                     Rent Pondy
//                   </span>
//                 </p>
//                 <span style={{ borderBottom: "2px solid orangered", width: "40%", marginTop: "15px" }}></span>

              
//               </div>
             
//         </div>
//     ) : (
//       // === VERIFY OTP VIEW ===

//         <div
//           className="d-flex flex-column align-items-center p-0"
//           style={{
//             width: "100%",
//             height: "100%",
//             background: "#ffffff",
//             // backdropFilter: "blur(3px)",
//           }}
//         >
//           <div className="text-center mb-3 w-100" style={{backgroundColor:"#FEFF7F", height:"300px"}}>
//                     <img
//                       src={otpimg}
//                       alt="otp-banner"
//                       style={{ width: '100%',height:"100%" }}
//                     />

//                   </div>
//                        <div className="text-center mb-2" style={{color:"orangered"}}> Login Number: {phoneNumber} 
//                                    <span
//                                  type="button"
//                                  onClick={handleEdit}
//                                >
//                                  <RiEdit2Fill color="#4F4B7E" size={28} style={{ fontWeight: "bold" }} />
                                 
//                                </span></div>
//           <h6 className="text-center mb-1" style={{color:"grey"}}>OTP Sent to Your Mobile No</h6>

//           <div className="text-center mt-5">
//                   <Form onSubmit={handleVerifyOtp}>
      

//                     <Form.Group className="mb-3" controlId="otp">
//                       <Form.Control
//                         type="number"
//                         placeholder="Enter OTP"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         disabled={isDisabled}
//                         required
//                         className="custom-background small-input fw-normal  rounded-0 otp-input"
//                      style={{
//                           width: '100%',
//                           backgroundColor: "transparent",
//                           outline: "none",
//                           borderLeft: "none",
//                           borderRight: "none",
//                           borderBottom: "1px solid #474747",
//                           background: "transparent",
//                           color: "#474747",
//                           fontWeight: "bold",
//                           borderTop: "none",
//                           cursor: "pointer",
//                           appearance: 'textfield',
//                           MozAppearance: 'textfield',
//                           WebkitAppearance: 'none'
//                         }}
//                         onFocus={(e) =>
//                           Object.assign(e.target.style, {
//                             outline: "none",
//                             boxShadow: "none",
//                             background: "none",
//                             color: "#474747",
//                           })
//                         }
//                       />
//                     </Form.Group>
//                     <style>
//                         {`
//                         .otp-input::placeholder {
//       color: grey;
//       opacity: 1; /* required for Firefox */
//     }

//     .otp-input:-ms-input-placeholder { /* Internet Explorer 10-11 */
//       color: grey;
//     }

//     .otp-input::-ms-input-placeholder { /* Microsoft Edge */
//       color: grey;
//     }
//                         input[type="number"]::-webkit-inner-spin-button,
//                         input[type="number"]::-webkit-outer-spin-button {
//                           -webkit-appearance: none;
//                           margin: 0;
//                         }
//                       `}
//                     </style>

//                     <div className="d-flex justify-content-center mt-1">
//                       <Button type="submit" 
//                         disabled={isLoading}
//                         style={{ backgroundColor: isLoading ? "#ccc" : "#4F4B7E", border: "2px solid #4F4B7E", cursor: isLoading ? 'not-allowed' : 'pointer' }} 
//                         className="btn-small w-100">
//                         {isLoading ? 'VERIFYING...' : 'VERIFY OTP'}
//                       </Button>
//                     </div>
//                     {canResendOtp && (
//                       <div className="d-flex justify-content-center">
//                         <Button style={{ backgroundColor: "white", border: "1px solid #4F4B7E", color: "#4F4B7E" }} onClick={handleResendOtp} className="w-100 mt-2">
//                           RESEND OTP
//                         </Button>
//                       </div>
//                     )}
//                     {otpTimer > 0 && !canResendOtp && (
//                       <p className="text-center mt-2">Resend OTP in {otpTimer} seconds</p>
//                     )}
                 
//                   </Form>
//           </div>
//            <div className='mb-2 mt-2' style={{
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: '8px'
//   }}>
//                       <label style={{ margin: 0 }}>
//                         <input
//                           type="checkbox"
//                           checked={isChecked}
//                           onChange={handleCheckboxChange}
//                           style={{ cursor: 'pointer' }}
//                         />
//                       </label>
//                       <span
//                         onClick={() => setShowPopup(true)}
//                         style={{
//                           cursor: 'pointer',
//                           fontSize: '13px',
//                           color:"#666"
//                         }}
//                       >
//                         I agree with <span style={{ color: '#4F4B7E', textDecoration: 'underline' }}>terms & conditions</span>
//                       </span>

//                       {showPopup && (
//                         <div
//                           style={{
//                             position: 'fixed',
//                             top: '0',
//                             left: '0',
//                             height: '100vh',
//                             backgroundColor: '#fff',
//                             color: 'black',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             zIndex: 1000,
//                             overflow: "hidden"
//                           }}
//                         >
//                           <div
//                             style={{
//                               maxHeight: '100%',
//                               overflowY: 'auto',
//                               width: '100%',
//                               padding: '20px',
//                               borderRadius: '10px',
//                               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
//                               minWidth: '300px',
//                               textAlign: 'center',
//                             }}
//                           >
//                             <PrivacyPolicyWeb />
//                             <button
//                               onClick={() => setShowPopup(false)}
//                               style={{
//                                 position: 'absolute',
//                                 top: '10px',
//                                 left: '10px',
//                                 padding: '6px 12px',
//                                 backgroundColor: '#EFEFEF',
//                                 color: 'black',
//                                 border: 'none',
//                                 borderRadius: '4px',
//                                 cursor: 'pointer',
//                               }}
//                             >
//                               <FaChevronLeft /> <span className="m-0">Back</span>
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     <div className='mb-2 mt-1' style={{
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: '8px'
//   }}>
//                       <label style={{ margin: 0 }}>
//                         <input
//                           type="checkbox"
//                           defaultChecked
//                           style={{ cursor: 'pointer' }}
//                         />
//                       </label>
//                       <span
//                         onClick={() => setShowWhatsAppPopup(true)}
//                         style={{
//                           cursor: 'pointer',
//                           fontSize: '13px',
//                           color:"#666"
//                         }}
//                       >
//                         I agree with <span style={{ color: '#4F4B7E', textDecoration: 'underline' }}>WhatsApp policy</span>
//                       </span>

//                       {showWhatsAppPopup && (
//                         <div
//                           style={{
//                             position: 'fixed',
//                             top: '0',
//                             left: '0',
//                             height: '100vh',
//                             backgroundColor: '#fff',
//                             color: 'black',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             zIndex: 1000,
//                             overflow: "hidden"
//                           }}
//                         >
//                           <div
//                             style={{
//                               maxHeight: '100%',
//                               overflowY: 'auto',
//                               width: '100%',
//                               padding: '20px',
//                               borderRadius: '10px',
//                               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
//                               minWidth: '300px',
//                               textAlign: 'center',
//                             }}
//                           >
//                             <WhatsAppPolicyWeb />
//                             <button
//                               onClick={() => setShowWhatsAppPopup(false)}
//                               style={{
//                                 position: 'absolute',
//                                 top: '10px',
//                                 left: '10px',
//                                 padding: '6px 12px',
//                                 backgroundColor: '#EFEFEF',
//                                 color: 'black',
//                                 border: 'none',
//                                 borderRadius: '4px',
//                                 cursor: 'pointer',
//                               }}
//                             >
//                               <FaChevronLeft /> <span className="m-0">Back</span>
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//         </div>
//     )}
//     </div>
//   </Row>
// </Container>

//     {showLoginFailPopup && (
//       <div
//         style={{
//           position: 'fixed',
//           top: '0',
//           left: '0',
//           right: '0',
//           bottom: '0',
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 2000,
//         }}
//         onClick={() => setShowLoginFailPopup(false)}
//       >
//         <div
//           style={{
//             backgroundColor: '#fff',
//             borderRadius: '12px',
//             padding: '30px',
//             maxWidth: '400px',
//             width: '90%',
//             textAlign: 'center',
//             boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
//           }}
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
//           <h3 style={{ color: '#4F4B7E', marginBottom: '15px', fontWeight: 700 }}>Login Failed</h3>
//           <p style={{ color: '#666', marginBottom: '25px', fontSize: '16px' }}>{failureMessage}</p>
//           <Button
//             onClick={() => setShowLoginFailPopup(false)}
//             style={{
//               backgroundColor: '#4F4B7E',
//               border: 'none',
//               color: 'white',
//               padding: '10px 30px',
//               borderRadius: '6px',
//               fontWeight: 600,
//               cursor: 'pointer',
//             }}
//           >
//             Try Again
//           </Button>
//         </div>
//       </div>
//     )}

//     </>
//   );
// };


// export default Login;



import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setPhoneNumber } from '../red/userSlice';
import { Helmet } from 'react-helmet';
import Flag from 'react-world-flags';
import logo from '../Assets/rentpondylogo.png';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { RiEdit2Fill } from "react-icons/ri";
import PrivacyPolicyWeb from './PrivacyPolicyWeb';
import WhatsAppPolicyWeb from './WhatsAppPolicyWeb';
import AboutMobile from './AboutMobile';
import { FaArrowLeft, FaChevronLeft, FaHome, FaKey, FaExternalLinkAlt } from 'react-icons/fa';
import bgg from '../Assets/loo.PNG';
import otpimg from '../Assets/otp_img.jpeg';
import { setActiveBase, baseToPath, baseToCity } from '../utils/cityBase';
import LocalTouristPopup from './LocalTouristPopup';

const Login = ({ onLogin }) => {
  const [phoneNumber, setPhoneNumberState] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [isPhoneNumberEntered, setIsPhoneNumberEntered] = useState(false);
  const [mockOtp, setMockOtp] = useState('');
  const phoneInputRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loginMode, setLoginMode] = useState('web');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginFailPopup, setShowLoginFailPopup] = useState(false);
  const [failureMessage, setFailureMessage] = useState('');
  // City base chosen on the login screen: 'PY' = Pondicherry, 'CH' = Chennai.
  // No default — user must explicitly pick one before we'll send the OTP.
  const [selectedBase, setSelectedBase] = useState(null);
  const [cityError, setCityError] = useState(false);
  // After a successful login we show the "other products" popup; the city base
  // chosen for this login is remembered so the popup shows the right product set
  // and the Continue button navigates into the correct app.
  const [showProductsPopup, setShowProductsPopup] = useState(false);
  const [pendingBase, setPendingBase] = useState(null);
  // Admin-controlled (Mobile view Leads - Ads → Login Popup Control): whether to
  // show the post-login "other products" popup. Defaults to true so behaviour is
  // unchanged if the setting can't be fetched.
  const popupEnabledRef = useRef(true);

  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      setIsScrolling(true);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150); // Adjust the delay as needed
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const storedPhoneNumber = useSelector(state => state.phoneNumber);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // City from the URL on the city-specific login routes (/login/pondicherry,
  // /login/chennai). null on the plain /login route.
  const { city } = useParams();
  const cityParamToBase = (c) => {
    const v = String(c || '').toLowerCase();
    if (v === 'chennai') return 'CH';
    if (v === 'pondicherry') return 'PY';
    return null;
  };

  // "What do you need?" cards. Rentals (this site) stays on Rent Pondy; Buy & Sell
  // jumps to the sister site (Pondy/Chennai Properties on ppcpondy.com).
  // Labels/link follow the chosen city, falling back to the URL city, then PY.
  const effectiveBase = selectedBase || cityParamToBase(city) || 'PY';
  const isCityCH = effectiveBase === 'CH';
  const rentLabel = isCityCH ? 'Rent Chennai' : 'Rent Pondy';        // this site
  const buyLabel = isCityCH ? 'Chennai Property' : 'Pondy Property';  // other site
  const otherSiteUrl = `https://ppcpondy.com/login/${isCityCH ? 'chennai' : 'pondicherry'}`;

  // Pre-select the city chip when the route carries a city (e.g. /login/chennai),
  // so the user lands with their city already chosen. They can still change it.
  useEffect(() => {
    const base = cityParamToBase(city);
    if (base) {
      setSelectedBase(base);
      setCityError(false);
    }
  }, [city]);

  // Fetch the admin-controlled on/off setting for the post-login popup.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/login-popup-setting`);
        if (!cancelled && res.data && typeof res.data.enabled === 'boolean') {
          popupEnabledRef.current = res.data.enabled;
        }
      } catch (err) {
        // Non-blocking: keep the default (show popup) if the setting can't load.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // After a successful login, show the "other products" popup only when the
  // admin has it enabled; otherwise go straight into the app.
  const proceedAfterLogin = (base) => {
    if (popupEnabledRef.current) {
      setPendingBase(base);
      setShowProductsPopup(true);
    } else {
      navigate(baseToPath(base));
    }
  };

  // Country-specific phone number digit length mapping
  const countryPhoneDigits = {
    'IN': 10,  // India
    'SG': 8,   // Singapore
    'US': 10,  // United States
    'CA': 10,  // Canada
    'GB': 11,  // United Kingdom
    'AU': 9,   // Australia
    'NZ': 9,   // New Zealand
    'MY': 9,   // Malaysia
    'PH': 10,  // Philippines
    'TH': 9,   // Thailand
    'JP': 10,  // Japan
    'KR': 10,  // South Korea
    'CN': 11,  // China
    'BD': 10,  // Bangladesh
    'PK': 10,  // Pakistan
    'AE': 9,   // United Arab Emirates
    'SA': 9,   // Saudi Arabia
    'BR': 11,  // Brazil
    'MX': 10,  // Mexico
    'FR': 9,   // France
    'DE': 11,  // Germany
    'IT': 10,  // Italy
    'ES': 9,   // Spain
  };

  const countryCodes = [
    { code: '+93', country: 'Afghanistan', flag: 'AF' },
    { code: '+213', country: 'Algeria', flag: 'DZ' },
    { code: '+54', country: 'Argentina', flag: 'AR' },
    { code: '+61', country: 'Australia', flag: 'AU' },
    { code: '+43', country: 'Austria', flag: 'AT' },
    { code: '+994', country: 'Azerbaijan', flag: 'AZ' },
    { code: '+973', country: 'Bahrain', flag: 'BH' },
    { code: '+880', country: 'Bangladesh', flag: 'BD' },
    { code: '+32', country: 'Belgium', flag: 'BE' },
    { code: '+975', country: 'Bhutan', flag: 'BT' },
    { code: '+55', country: 'Brazil', flag: 'BR' },
    { code: '+1', country: 'Canada', flag: 'CA' },
    { code: '+56', country: 'Chile', flag: 'CL' },
    { code: '+86', country: 'China', flag: 'CN' },
    { code: '+57', country: 'Colombia', flag: 'CO' },
    { code: '+53', country: 'Cuba', flag: 'CU' },
    { code: '+45', country: 'Denmark', flag: 'DK' },
    { code: '+20', country: 'Egypt', flag: 'EG' },
    { code: '+33', country: 'France', flag: 'FR' },
    { code: '+995', country: 'Georgia', flag: 'GE' },
    { code: '+49', country: 'Germany', flag: 'DE' },
    { code: '+30', country: 'Greece', flag: 'GR' },
    { code: '+36', country: 'Hungary', flag: 'HU' },
    { code: '+91', country: 'India', flag: 'IN' },
    { code: '+62', country: 'Indonesia', flag: 'ID' },
    { code: '+98', country: 'Iran', flag: 'IR' },
    { code: '+98', country: 'Iran', flag: 'IR' },
    { code: '+972', country: 'Israel', flag: 'IL' },
    { code: '+39', country: 'Italy', flag: 'IT' },
    { code: '+81', country: 'Japan', flag: 'JP' },
    { code: '+7', country: 'Kazakhstan', flag: 'KZ' },
    { code: '+254', country: 'Kenya', flag: 'KE' },
    { code: '+996', country: 'Kyrgyzstan', flag: 'KG' },
    { code: '+218', country: 'Libya', flag: 'LY' },
    { code: '+60', country: 'Malaysia', flag: 'MY' },
    { code: '+52', country: 'Mexico', flag: 'MX' },
    { code: '+976', country: 'Mongolia', flag: 'MN' },
    { code: '+212', country: 'Morocco', flag: 'MA' },
    { code: '+95', country: 'Myanmar', flag: 'MM' },
    { code: '+977', country: 'Nepal', flag: 'NP' },
    { code: '+31', country: 'Netherlands', flag: 'NL' },
    { code: '+64', country: 'New Zealand', flag: 'NZ' },
    { code: '+234', country: 'Nigeria', flag: 'NG' },
    { code: '+47', country: 'Norway', flag: 'NO' },
    { code: '+968', country: 'Oman', flag: 'OM' },
    { code: '+92', country: 'Pakistan', flag: 'PK' },
    { code: '+970', country: 'Palestine', flag: 'PS' },
    { code: '+51', country: 'Peru', flag: 'PE' },
    { code: '+63', country: 'Philippines', flag: 'PH' },
    { code: '+48', country: 'Poland', flag: 'PL' },
    { code: '+974', country: 'Qatar', flag: 'QA' },
    { code: '+40', country: 'Romania', flag: 'RO' },
    { code: '+7', country: 'Russia', flag: 'RU' },
    { code: '+966', country: 'Saudi Arabia', flag: 'SA' },
    { code: '+65', country: 'Singapore', flag: 'SG' },
    { code: '+27', country: 'South Africa', flag: 'ZA' },
    { code: '+82', country: 'South Korea', flag: 'KR' },
    { code: '+34', country: 'Spain', flag: 'ES' },
    { code: '+94', country: 'Sri Lanka', flag: 'LK' },
    { code: '+94', country: 'Sri Lanka', flag: 'LK' },
    { code: '+46', country: 'Sweden', flag: 'SE' },
    { code: '+41', country: 'Switzerland', flag: 'CH' },
    { code: '+255', country: 'Tanzania', flag: 'TZ' },
    { code: '+66', country: 'Thailand', flag: 'TH' },
    { code: '+216', country: 'Tunisia', flag: 'TN' },
    { code: '+90', country: 'Turkey', flag: 'TR' },
    { code: '+993', country: 'Turkmenistan', flag: 'TM' },
    { code: '+971', country: 'United Arab Emirates', flag: 'AE' },
    { code: '+44', country: 'United Kingdom', flag: 'GB' },
    { code: '+1', country: 'United States', flag: 'US' },
    { code: '+998', country: 'Uzbekistan', flag: 'UZ' },
    { code: '+58', country: 'Venezuela', flag: 'VE' },
    { code: '+84', country: 'Vietnam', flag: 'VN' },
  ];

  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedPhone = localStorage.getItem('phoneNumber');
      
      if (storedPhone) {
        dispatch(setPhoneNumber(storedPhone));
        // Prefer the city from the URL (/login/chennai etc.) when present;
        // otherwise return the user to whichever city they last used.
        const urlBase = cityParamToBase(city);
        const targetBase = urlBase || (localStorage.getItem('activeBase') === 'CH' ? 'CH' : 'PY');
        if (urlBase) setActiveBase(urlBase);
        navigate(baseToPath(targetBase), { state: { phoneNumber: phoneNumber } });
      }
    };

    checkLoggedIn();
  }, [dispatch, navigate, city]);

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    setIsDisabled(!checked);
  };

  // Get phone digit requirement for selected country
  const getPhoneDigitRange = (countryFlag) => {
    const digits = countryPhoneDigits[countryFlag] || 10;
    return { min: digits - 1, max: digits + 2 }; // Allow slight flexibility
  };

  const handleCountryChange = (e) => {
    const selected = e.target.value;
    const country = countryCodes.find(c => c.flag === selected);
    setCountryCode(country.code);
    setSelectedCountry(selected);
  };

  const handlePhoneNumberChange = (e) => {
    const phone = e.target.value;
    // Only allow digits
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length <= (countryPhoneDigits[selectedCountry] || 15)) {
      setPhoneNumberState(digitsOnly);
      setIsPhoneNumberEntered(digitsOnly.length > 0);
    }
  };

  // OTP timer
  useEffect(() => {
    if (isOtpSent && otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (otpTimer === 0) {
      setCanResendOtp(true);
    }
  }, [isOtpSent, otpTimer]);

  // Generate random OTP (6 digits)
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Persist the user's chosen city base ('PY' / 'CH') to the backend. Non-blocking.
  const recordCitySelection = async (base, phoneForRecord) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/user/select-city`, {
        phoneNumber: phoneForRecord || phoneNumber || null,
        base,
        countryCode,
      });
    } catch (err) {
      console.warn('⚠️ Failed to record city selection (non-blocking):', err.message);
    }
  };

  // Tapping a city chip just selects it locally — the choice is persisted on
  // successful login (so anonymous taps are not recorded as logins).
  const handleCityChipClick = (base) => {
    setSelectedBase(base);
    setCityError(false);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    console.log("====== OTP SENDING INITIATED ======");
    console.log("Selected Country:", selectedCountry);
    console.log("Country Code:", countryCode);
    console.log("Phone Number:", phoneNumber);

    if (!selectedBase) {
      setCityError(true);
      toast.error('Please choose your city before continuing.', {
        position: 'top-center',
        autoClose: 5000,
      });
      return;
    }

    if (!phoneNumber) {
      toast.error('Please enter a valid phone number.', {
        position: 'top-center',
        autoClose: 5000,
      });
      return;
    }

    // Validate phone number length based on country
    const requiredDigits = countryPhoneDigits[selectedCountry] || 10;
    const phoneDigits = phoneNumber.replace(/\D/g, '').length;
    console.log("Required Digits:", requiredDigits, "Actual Digits:", phoneDigits);
    
    if (phoneDigits !== requiredDigits) {
      toast.error(`Please enter a valid ${selectedCountry} phone number (${requiredDigits} digits).`, {
        position: 'top-center',
        autoClose: 5000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const fullPhoneNumber = `${phoneNumber}`;
      const plainPhoneDigits = phoneNumber.replace(/\D/g, '');
      const mobileNumber = String(fullPhoneNumber).replace(/\D/g, "");
      const countryCodeDigits = countryCode.replace(/\D/g, "");
      const to = `${countryCodeDigits}${mobileNumber}`;

      // 1. Check if user is directly verified
      const directCheck = await axios.get(`${process.env.REACT_APP_API_URL}/user/direct-verified-users-rent`);
      const matchedUser = directCheck.data.users.find(
        (u) => u.phone === plainPhoneDigits && u.directVerified
      );

      if (matchedUser) {
        toast.success('User is directly verified. Logging in...', {
          position: 'top-center',
          autoClose: 5000,
        });

        localStorage.setItem('phoneNumber', fullPhoneNumber);
        dispatch(setPhoneNumber(fullPhoneNumber));
        setActiveBase(selectedBase);
        await recordCitySelection(selectedBase, fullPhoneNumber);
        setIsLoading(false);
        // Show the "other products" popup (if admin-enabled), else navigate in.
        proceedAfterLogin(selectedBase);
        return; // Skip OTP
      }

      console.log("======================================");
      console.log("Country Check - Is INDIA?:", selectedCountry === 'IN');
      console.log("Country Code Digits:", countryCodeDigits);
      console.log("Mobile Number:", mobileNumber);
      console.log("Final WhatsApp Number (to):", to);
      console.log("======================================");

      // 2. Check if country is INDIA (IN)
      if (selectedCountry === 'IN') {
        console.log("🇮🇳 INDIA FLOW: Calling send-otp-rent API...");
        // ✅ FOR INDIA: Call send-otp-rent to get OTP from AWS
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-otp-rent`, {
          phoneNumber: fullPhoneNumber,
          loginMode: loginMode,
          countryCode: countryCode
        });

        const generatedOtp = response.data.result?.otp;

        if (generatedOtp) {
          toast.success('OTP Sent Successfully!', {
            position: 'top-center',
            autoClose: 20000,
          });

          // ✅ WhatsApp OTP Notification for India — DISABLED (OTP delivered via SMS/backend only)
          // try {
          //   const otpMessage = `Hi there, 👋\n\nYour OTP for Rent Pondy login is: ${generatedOtp}\n\n⏱️ This OTP expires in 5 minutes.\n🔒 Never share this OTP with anyone.\n\nIf you didn't request this OTP, please ignore this message.\n\n– Team Rent Pondy`;
          //   if (to.length >= 8 && phoneDigits >= 10) {
          //     await axios.post(`${process.env.REACT_APP_API_URL}/send-message`, { to, message: otpMessage });
          //   }
          // } catch (whatsErr) {
          //   console.error("⚠️ WhatsApp OTP message failed (non-blocking):", whatsErr.message);
          // }

          setMockOtp(generatedOtp);
          setIsOtpSent(true);
          setOtpTimer(30);
          setCanResendOtp(false);
          setOtp('');
          setIsLoading(false);
          console.log("======================================");
          console.log("✅ INDIA FLOW COMPLETED");
          console.log("OTP from AWS:", generatedOtp);
          console.log("Awaiting user OTP verification...");
          console.log("======================================");
        }
      } else {
        console.log("🌍 INTERNATIONAL FLOW: Generating OTP locally and sending via WhatsApp...");
        // ✅ FOR OTHER COUNTRIES: Generate OTP locally & store in backend & send via WhatsApp
        const localGeneratedOtp = generateOtp();
        console.log("✅ Generated Local OTP:", localGeneratedOtp);

        // ✅ FIXED: Store OTP in backend so verify-otp-rent can find it
        try {
          console.log("💾 Storing international OTP in backend...");
          await axios.post(`${process.env.REACT_APP_API_URL}/store-otp-international`, {
            phoneNumber: fullPhoneNumber,
            otp: localGeneratedOtp,
            countryCode: countryCode,
            loginMode: loginMode,
          });
          console.log("✅ International OTP stored in backend successfully");
        } catch (storeErr) {
          // If banned/deleted user, surface the error
          if (storeErr.response?.status === 403) {
            const errData = storeErr.response.data;
            setFailureMessage(errData.error || 'Account restricted');
            setShowLoginFailPopup(true);
            setIsLoading(false);
            return;
          }
          console.error("⚠️ Failed to store international OTP in backend:", storeErr.message);
          // Non-blocking: continue with WhatsApp OTP even if storage fails
          // Fallback: verify locally using mockOtp
        }

        toast.success('OTP Sent Successfully!', {
          position: 'top-center',
          autoClose: 20000,
        });

        // ✅ WhatsApp OTP Message for International Countries — DISABLED (OTP stored in backend, no WhatsApp send)
        // try {
        //   const otpMessage = `Hi there, 👋\n\nYour OTP for Rent Pondy login is: ${localGeneratedOtp}\n\n⏱️ This OTP expires in 5 minutes.\n🔒 Never share this OTP with anyone.\n\nIf you didn't request this OTP, please ignore this message.\n\n– Team Rent Pondy`;
        //   if (to.length >= 8 && phoneDigits >= (countryPhoneDigits[selectedCountry] || 6)) {
        //     await axios.post(`${process.env.REACT_APP_API_URL}/send-message`, { to, message: otpMessage });
        //     toast.success('OTP sent to WhatsApp!', { position: 'top-center', autoClose: 3000 });
        //   }
        // } catch (whatsErr) {
        //   console.error("⚠️ WhatsApp OTP message failed (non-blocking):", whatsErr.message);
        // }

        // Validate phone number length (moved outside WhatsApp block so it still works)
        if (to.length < 8 || phoneDigits < (countryPhoneDigits[selectedCountry] || 6)) {
          toast.error(`Invalid phone number. Expected ${countryPhoneDigits[selectedCountry]} digits.`, {
            position: 'top-center',
            autoClose: 5000,
          });
          setIsLoading(false);
          return;
        }

        try {
          // placeholder to keep catch block syntax valid
          console.log("📱 WhatsApp OTP disabled — OTP stored in backend for verification");
        } catch (whatsErr) {
          console.error(
            "⚠️ WhatsApp OTP message failed (non-blocking):",
            whatsErr.message,
            "Error details:",
            whatsErr.response?.data || whatsErr
          );
          console.error("❌ Full Error Object:", whatsErr);
          // Still proceed with OTP setup even if WhatsApp fails - it's non-blocking
        }

        setMockOtp(localGeneratedOtp);
        setIsOtpSent(true);
        setOtpTimer(30);
        setCanResendOtp(false);
        setOtp('');
        setIsLoading(false);
        console.log("======================================");
        console.log("✅ INTERNATIONAL FLOW COMPLETED");
        console.log("OTP Set:", localGeneratedOtp);
        console.log("Awaiting user OTP verification...");
        console.log("======================================");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Something went wrong!';
      setFailureMessage(errorMessage);
      setShowLoginFailPopup(true);
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error('Please enter the OTP.');
      return;
    }

    setIsLoading(true);

    try {
      if (selectedCountry === 'IN') {
        // ✅ FOR INDIA: Verify OTP against backend
        console.log("🇮🇳 INDIA OTP Verification: Calling verify-otp-rent backend API...");
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/verify-otp-rent`, {
          phoneNumber: `${phoneNumber}`,
          otp: otp,
        });

        if (response.status !== 200) {
          throw new Error('OTP verification failed');
        }
        console.log("✅ India OTP verified successfully from backend");
      } else {
        // ✅ FIXED: For international countries — verify against backend (OTP was stored there)
        // Also do local check as fallback for immediate UX
        console.log("🌍 INTERNATIONAL OTP Verification: Verifying against backend...");

        try {
          const backendResponse = await axios.post(`${process.env.REACT_APP_API_URL}/verify-otp-rent`, {
            phoneNumber: `${phoneNumber}`,
            otp: otp,
            countryCode: countryCode,
            country: selectedCountry,
          });

          if (backendResponse.status !== 200) {
            throw new Error('Backend verification failed');
          }
          console.log("✅ International OTP verified from backend");
        } catch (backendErr) {
          // Fallback: if backend fails (e.g. storage failed earlier), verify locally
          console.warn("⚠️ Backend verification failed, falling back to local OTP check:", backendErr.message);
          if (otp !== mockOtp) {
            throw new Error(backendErr.response?.data?.error || 'Invalid OTP');
          }
          console.log("✅ International OTP verified locally (fallback)");
        }
      }

      toast.success('OTP verified successfully!');
      const fullPhoneNumber = `${phoneNumber}`;
      localStorage.setItem('phoneNumber', fullPhoneNumber);
      dispatch(setPhoneNumber(fullPhoneNumber));
      setActiveBase(selectedBase);
      await recordCitySelection(selectedBase, fullPhoneNumber);

      // ✅ Log app open after successful OTP verification
      try {
        console.log("📊 Logging app open for user:", fullPhoneNumber);
        const logResponse = await axios.post(`${process.env.REACT_APP_API_URL}/log-app-open`, {
          phoneNumber: fullPhoneNumber,
          countryCode: countryCode,
          country: selectedCountry,
        });
        console.log("✅ App open logged successfully:", logResponse.data);
      } catch (logErr) {
        console.warn(
          "⚠️ Failed to log app open (non-blocking):",
          logErr.message,
          "Error details:",
          logErr.response?.data || logErr
        );
        // Continue with login even if logging fails
      }

      // ✅ WhatsApp Welcome Message — DISABLED (reduces WhatsApp ban risk)
      // try {
      //   const ownerName = "Owner";
      //   const rawPhone = fullPhoneNumber || "";
      //   const mobileNumber = String(rawPhone).replace(/\D/g, "");
      //   const countryCodeDigits = countryCode.replace(/\D/g, "");
      //   const to = `${countryCodeDigits}${mobileNumber}`;
      //   const message = `Hi ${ownerName}, 👋\nWelcome to Rent Pondy! 🏡\n\n✅ Login Successful\n\nYou can now add, manage, and promote your properties easily.\nWe're happy to have you with us!\n\n– Team Rent Pondy`;
      //   if (to.length >= 8) {
      //     await axios.post(`${process.env.REACT_APP_API_URL}/send-message`, { to, message });
      //     await axios.post(`${process.env.REACT_APP_API_URL}/group-list`, { groupid: "CQwfsKBxOrb1mdsDkhzNtL", message });
      //   }
      // } catch (whatsErr) {
      //   console.error("⚠️ WhatsApp message failed (non-blocking):", whatsErr.message);
      // }

      // Show the "other products" popup (if admin-enabled), else navigate in.
      setIsLoading(false);
      proceedAfterLogin(selectedBase);
    } catch (error) {
      let errorMessage = 'OTP verification failed!';
      
      if (selectedCountry === 'IN') {
        errorMessage = error.response?.data?.message || error.response?.data?.error || 'OTP verification failed!';
      } else {
        errorMessage = error.response?.data?.error || error.message || 'Invalid OTP';
      }
      
      setFailureMessage(errorMessage);
      setShowLoginFailPopup(true);
      setIsLoading(false);

      // ✅ WhatsApp Failure Message — DISABLED (reduces WhatsApp ban risk, also alerts attackers)
      // try {
      //   const ownerName = "Owner";
      //   const rawPhone = phoneNumber || "";
      //   const mobileNumber = String(rawPhone).replace(/\D/g, "");
      //   const countryCodeDigits = countryCode.replace(/\D/g, "");
      //   const to = `${countryCodeDigits}${mobileNumber}`;
      //   const failureMessage = `Hi ${ownerName}, 🔔\n\n⚠️ Login Attempt Failed\n\nWe noticed an incorrect OTP was entered during login.\n\nIf this wasn't you, please secure your account immediately.\n\nFor assistance, contact our support team:\n📞 +91-8300622013\n📧 info.rentpondy@gmail.com\n\nStay secure!\n– Team Rent Pondy`;
      //   if (to.length >= 8) {
      //     await axios.post(`${process.env.REACT_APP_API_URL}/send-message`, { to, message: failureMessage });
      //   }
      // } catch (whatsErr) {
      //   console.error("⚠️ WhatsApp failure message failed (non-blocking):", whatsErr.message);
      // }
    }
  };

  const handleResendOtp = async () => {
    if (!canResendOtp) return;

    try {
      const mobileNumber = String(phoneNumber).replace(/\D/g, "");
      const countryCodeDigits = countryCode.replace(/\D/g, "");
      const to = `${countryCodeDigits}${mobileNumber}`;

      let newOtp;

      if (selectedCountry === 'IN') {
        // ✅ FOR INDIA: Call send-otp-rent to get OTP from AWS
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-otp-rent`, {
          phoneNumber: `${phoneNumber}`,
          loginMode: loginMode,
          countryCode: countryCode
        });

        newOtp = response.data.result?.otp;
      } else {
        // ✅ FOR OTHER COUNTRIES: Generate OTP locally and store in backend
        newOtp = generateOtp();

        // ✅ FIXED: Store resent OTP in backend too
        try {
          console.log("💾 Storing resent international OTP in backend...");
          await axios.post(`${process.env.REACT_APP_API_URL}/store-otp-international`, {
            phoneNumber: `${phoneNumber}`,
            otp: newOtp,
            countryCode: countryCode,
            loginMode: loginMode,
          });
          console.log("✅ Resent international OTP stored in backend successfully");
        } catch (storeErr) {
          console.error("⚠️ Failed to store resent international OTP in backend:", storeErr.message);
          // Non-blocking: continue, fallback to local mockOtp verification
        }
      }

      if (newOtp) {
        toast.success(`OTP resent!`, {
          position: 'top-center',
          autoClose: 20000,
        });

        // ✅ WhatsApp OTP Resend Notification — DISABLED (OTP delivered via SMS/backend only)
        // try {
        //   const resendMessage = `Hi there, 👋\n\nYour resent OTP for Rent Pondy login is: ${newOtp}\n\n⏱️ This OTP expires in 5 minutes.\n🔒 Never share this OTP with anyone.\n\n– Team Rent Pondy`;
        //   if (to.length >= 8) {
        //     await axios.post(`${process.env.REACT_APP_API_URL}/send-message`, { to, message: resendMessage });
        //   }
        // } catch (whatsErr) {
        //   console.error("⚠️ WhatsApp resend OTP message failed (non-blocking):", whatsErr.message);
        // }

        setMockOtp(newOtp);
        setOtpTimer(30);
        setCanResendOtp(false);
        setOtp('');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to resend OTP.';
      setFailureMessage(errorMessage);
      setShowLoginFailPopup(true);
    }
  };

  const handleEdit = () => {
    setIsOtpSent(false);
    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 100);
  };

  // After a successful login, show the Local / Tourist choice popup. This must
  // come before the storedPhoneNumber guard below, because login already
  // dispatched the phone number (so storedPhoneNumber is now truthy).
  //   - Local   → All Property listing for the city used to log in
  //   - Tourist → Tourist Place page (/exclusiveDetail)
  //   - Close   → defaults to the All Property listing (Local)
  if (showProductsPopup) {
    const navBase = pendingBase || effectiveBase;
    return (
      <LocalTouristPopup
        city={baseToCity(navBase)}
        onLocal={() => navigate(baseToPath(navBase))}
        onTourist={() => navigate('/exclusiveDetail')}
        onClose={() => navigate(baseToPath(navBase))}
      />
    );
  }

  if (storedPhoneNumber) {
    return null;
  }

  return (
    <>
      <style>{`
        .custom-background::placeholder {
          color: white;
        }
      `}</style>
      {console.log('isOtpSent:', isOtpSent)}

<Container fluid className="p-0 d-flex align-items-center justify-content-center">
  <Row className="g-0">
          <div className="d-flex flex-column justify-content-between align-items-center"
          style={{
              maxWidth: "500px",
              minWidth: "400px",
              Width: "100%",
              height: "100vh",
              backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcuV4KOIIk3EuvX9hVPSTszzfiPqalO5Oipbfm5wXCPVFgtWiFpMEiO3K2GpjuV87G61Y&usqp=CAU')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              color: "white",
            }}>

    {!isOtpSent ? (
      // === SEND OTP VIEW ===
  
        <div
          className="d-flex flex-column justify-content-between align-items-center p-2"
          style={{
            width: "100%",
            height: "100%",
  backgroundImage: `url(${bgg})`, // ← must use url() and template literal
            backdropFilter: "blur(3px)",
                 backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
          }}
        >
          <div className="mt-2 text-start w-100">
                <h1 className="welcome-title text-white m-0 ps-3 pt-4">Welcome Back</h1>
                <p className='ps-3' style={{color:"#989EA0"}}>Login to continue</p>
          </div>

          <div className="text-center" style={{ marginBottom: '10px' }}>

            <img src={logo} alt="Logo" style={{ height: 100, width: 100, borderRadius: 16, boxShadow: '0 4px 16px rgba(79,75,126,0.15)' }} />
            <div style={{
              fontFamily: 'Montserrat, Poppins, Inter, Arial, sans-serif',
              fontWeight: 800,
              fontSize: 32,
              color: '#4F4B7E',
              marginTop: 8,
              letterSpacing: 1.5,
              textShadow: '0 2px 8px rgba(79,75,126,0.08)'
            }}>
              {rentLabel}
            </div>
            <div style={{
              fontFamily: 'Poppins, Inter, Arial, sans-serif',
              fontWeight: 500,
              fontSize: 16,
              color: '#fff',
              marginTop: 2,
              marginBottom: 2
            }}>
              Connecting Tenants and Owners Seamlessly
            </div>

           <Form onSubmit={handleSendOtp}>
                    {/* On the city-specific routes (/login/pondicherry,
                        /login/chennai) the city is already known from the URL and
                        pre-selected, so hide the "Choose your city" picker entirely
                        and just show the number. Only the plain /login route shows it. */}
                    {!cityParamToBase(city) && (
                      <>
                    <p style={{ color: cityError ? '#ff4d4f' : '#fff', fontSize: 13, marginBottom: 6, fontWeight: 600 }}>
                      Choose your city {cityError && <span style={{ marginLeft: 4 }}>*</span>}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        marginBottom: cityError ? '6px' : '12px',
                        flexWrap: 'wrap',
                      }}
                    >
                      {[
                        { base: 'PY', label: '📍 Pondicherry' },
                        { base: 'CH', label: '📍 Chennai' },
                      ]
                        // On the city-specific routes (/login/chennai,
                        // /login/pondicherry) show only that city's chip; on the
                        // plain /login route show both.
                        .filter(({ base }) => !cityParamToBase(city) || cityParamToBase(city) === base)
                        .map(({ base, label }) => {
                        const active = selectedBase === base;
                        return (
                          <button
                            key={base}
                            type="button"
                            onClick={() => handleCityChipClick(base)}
                            aria-pressed={active}
                            style={{
                              padding: '6px 18px',
                              borderRadius: 999,
                              fontWeight: 700,
                              fontSize: 13,
                              cursor: 'pointer',
                              border: active
                                ? '2px solid #4F4B7E'
                                : cityError
                                  ? '2px solid #ff4d4f'
                                  : '1px solid #c9c5e3',
                              backgroundColor: active ? '#4F4B7E' : '#ffffff',
                              color: active ? '#ffffff' : '#4F4B7E',
                              boxShadow: active
                                ? '0 2px 8px rgba(79,75,126,0.25)'
                                : cityError
                                  ? '0 0 0 2px rgba(255,77,79,0.18)'
                                  : 'none',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    {cityError && (
                      <p
                        role="alert"
                        style={{
                          color: '#ff4d4f',
                          fontSize: 12,
                          fontWeight: 600,
                          textAlign: 'center',
                          marginBottom: 10,
                        }}
                      >
                        Please select a city to continue
                      </p>
                    )}
                      </>
                    )}

                    {/* What do you need? — Rentals stays on Rent Pondy;
                        Buy & Sell opens the sister site (ppcpondy.com) in a new tab. */}
                    {/* "What do you need?" section hidden per request.
                        Wrapped in `false && (...)` so it renders nothing but stays
                        intact — flip to `true &&` (or remove the wrapper) to restore. */}
                    {false && (
                      <>
                    <p style={{ color: '#fff', fontSize: 13, marginBottom: 6, fontWeight: 600 }}>
                      What do you need?
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        marginBottom: 6,
                        flexWrap: 'wrap',
                      }}
                    >
                      {/* This site — Rentals (current) */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => phoneInputRef.current?.focus()}
                        style={{
                          position: 'relative',
                          width: 130,
                          padding: '12px 10px',
                          borderRadius: 12,
                          textAlign: 'center',
                          cursor: 'pointer',
                          color: '#fff',
                          backgroundColor: 'rgba(79,75,126,0.9)',
                          border: '2px solid #4F4B7E',
                          boxShadow: '0 2px 8px rgba(79,75,126,0.35)',
                        }}
                      >
                        <FaKey size={20} />
                        <div style={{ fontWeight: 700, fontSize: 14, marginTop: 6 }}>{rentLabel}</div>
                        <div style={{ fontSize: 11, opacity: 0.85 }}>Rentals</div>
                      </div>

                      {/* Other site — Buy & Sell on ppcpondy.com (opens in a new tab) */}
                      <a
                        href={otherSiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          position: 'relative',
                          width: 130,
                          padding: '12px 10px',
                          borderRadius: 12,
                          textAlign: 'center',
                          textDecoration: 'none',
                          color: '#fff',
                          backgroundColor: 'rgba(255,255,255,0.12)',
                          border: '1px solid rgba(255,255,255,0.45)',
                        }}
                      >
                        <FaExternalLinkAlt
                          size={11}
                          style={{ position: 'absolute', top: 8, right: 8, opacity: 0.9 }}
                        />
                        <FaHome size={20} />
                        <div style={{ fontWeight: 700, fontSize: 14, marginTop: 6 }}>{buyLabel}</div>
                        <div style={{ fontSize: 11, opacity: 0.85 }}>Buy &amp; Sell</div>
                      </a>
                    </div>
                    <p style={{ color: '#cfd8dc', fontSize: 11, textAlign: 'center', marginBottom: 12 }}>
                      Pick one to continue
                    </p>
                      </>
                    )}

                    <Form.Group className="mb-3" controlId="phoneInput">
                      {/* Single row flex container for country code + phone number */}
                      <div style={{
                        display: 'flex',
                        width: '100%',
                        maxWidth: 360,
                        margin: '0 auto',
                        borderRadius: 8,
                        backgroundColor: "#f5f5f5",
                        boxShadow: '0 2px 8px rgba(79,75,126,0.07)',
                        overflow: 'hidden',
                        alignItems: 'center',
                        flexWrap: 'nowrap',
                        border: '2px solid transparent',
                        transition: 'all 0.3s ease'
                      }}>
                        {/* Country Code Section */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '0 12px',
                          borderRight: '1px solid #e0e0e0',
                          flexShrink: 0,
                          height: '48px'
                        }}>
                          <Flag code={selectedCountry} style={{ width: '20px', height: '14px' }} />
                          <Form.Select
                            value={selectedCountry}
                            onChange={handleCountryChange}
                            aria-label="Select Country"
                            style={{
                              width: 'auto',
                              backgroundColor: "transparent",
                              color: '#4F4B7E',
                              fontWeight: 600,
                              border: 'none',
                              outline: 'none',
                              cursor: 'pointer',
                              fontFamily: 'Poppins, Inter, Arial, sans-serif',
                              fontSize: 13,
                              padding: '4px 0',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {countryCodes.map((country) => (
                              <option className="text-dark" key={country.code} value={country.flag}>
                                {country.flag} {country.code}
                              </option>
                            ))}
                          </Form.Select>
                        </div>

                        {/* Phone Number Input */}
                        <Form.Control
                          type="tel"
                          placeholder={`Enter ${selectedCountry} Mobile No (${countryPhoneDigits[selectedCountry] || 10} digits)`}
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                          required
                          ref={phoneInputRef}
                          style={{
                            flex: 1,
                            backgroundColor: "transparent",
                            color: '#222',
                            fontWeight: 600,
                            border: 'none',
                            fontFamily: 'Poppins, Inter, Arial, sans-serif',
                            fontSize: 15,
                            outline: 'none',
                            boxShadow: 'none',
                            padding: '12px 16px',
                            minWidth: 0,
                            height: '48px',
                            transition: 'all 0.3s ease'
                          }}
                          maxLength={countryPhoneDigits[selectedCountry] || 15}
                          onFocus={(e) => {
                            e.target.parentElement.style.borderColor = '#4F4B7E';
                            e.target.parentElement.style.boxShadow = '0 2px 12px rgba(79,75,126,0.15)';
                          }}
                          onBlur={(e) => {
                            e.target.parentElement.style.borderColor = 'transparent';
                            e.target.parentElement.style.boxShadow = '0 2px 8px rgba(79,75,126,0.07)';
                          }}
                        />
                      </div>
                    </Form.Group>
                    <style>
                      {`
                        input[type="tel"]::-webkit-inner-spin-button,
                        input[type="tel"]::-webkit-outer-spin-button {
                          -webkit-appearance: none;
                          margin: 0;
                        }
                      `}
                    </style>
                    <div className="d-flex justify-content-center">
                      <Button type="submit"
                        disabled={isLoading}
                        style={{ backgroundColor: isLoading ? "#ccc" : "#4F4B7E", border: "2px solid #4F4B7E", fontWeight: 700, fontSize: 16, borderRadius: 8, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                        className="btn w-50 btn-small mt-2">
                        {isLoading ? 'LOGGING IN...' : 'LOGIN'}
                      </Button>
                    </div>
                  </Form>
          </div>
           <div className='d-flex flex-column align-items-center pb-2'>
                <p className="m-0" style={{color:"#fff"}}>
                  Edit or Add Your Property <span style={{ color: "rgb(22, 198, 22)" }} className="highlight fw-bold ms-2">
                    {rentLabel}
                  </span>
                </p>
                <span style={{ borderBottom: "2px solid orangered", width: "40%", marginTop: "15px" }}></span>
              </div>
             
        </div>
    ) : (
      // === VERIFY OTP VIEW ===

        <div
          className="d-flex flex-column align-items-center p-0"
          style={{
            width: "100%",
            height: "100%",
            background: "#ffffff",
          }}
        >
          <div className="text-center mb-3 w-100" style={{backgroundColor:"#FEFF7F", height:"300px"}}>
                    <img
                      src={otpimg}
                      alt="otp-banner"
                      style={{ width: '100%',height:"100%" }}
                    />

                  </div>
                       <div className="text-center mb-2" style={{color:"orangered"}}> Login Number: {phoneNumber} 
                                   <span
                                 type="button"
                                 onClick={handleEdit}
                               >
                                 <RiEdit2Fill color="#4F4B7E" size={28} style={{ fontWeight: "bold" }} />
                                 
                               </span></div>
          <h6 className="text-center mb-1" style={{color:"grey"}}>OTP Sent to Your Mobile No</h6>

          <div className="text-center mt-5">
                  <Form onSubmit={handleVerifyOtp}>
      

                    <Form.Group className="mb-3" controlId="otp">
                      <Form.Control
                        type="number"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        disabled={isDisabled}
                        required
                        className="custom-background small-input fw-normal  rounded-0 otp-input"
                     style={{
                          width: '100%',
                          backgroundColor: "transparent",
                          outline: "none",
                          borderLeft: "none",
                          borderRight: "none",
                          borderBottom: "1px solid #474747",
                          background: "transparent",
                          color: "#474747",
                          fontWeight: "bold",
                          borderTop: "none",
                          cursor: "pointer",
                          appearance: 'textfield',
                          MozAppearance: 'textfield',
                          WebkitAppearance: 'none'
                        }}
                        onFocus={(e) =>
                          Object.assign(e.target.style, {
                            outline: "none",
                            boxShadow: "none",
                            background: "none",
                            color: "#474747",
                          })
                        }
                      />
                    </Form.Group>
                    <style>
                        {`
                        .otp-input::placeholder {
      color: grey;
      opacity: 1; /* required for Firefox */
    }

    .otp-input:-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: grey;
    }

    .otp-input::-ms-input-placeholder { /* Microsoft Edge */
      color: grey;
    }
                        input[type="number"]::-webkit-inner-spin-button,
                        input[type="number"]::-webkit-outer-spin-button {
                          -webkit-appearance: none;
                          margin: 0;
                        }
                      `}
                    </style>

                    <div className="d-flex justify-content-center mt-1">
                      <Button type="submit" 
                        disabled={isLoading}
                        style={{ backgroundColor: isLoading ? "#ccc" : "#4F4B7E", border: "2px solid #4F4B7E", cursor: isLoading ? 'not-allowed' : 'pointer' }} 
                        className="btn-small w-100">
                        {isLoading ? 'VERIFYING...' : 'VERIFY OTP'}
                      </Button>
                    </div>
                    {canResendOtp && (
                      <div className="d-flex justify-content-center">
                        <Button style={{ backgroundColor: "white", border: "1px solid #4F4B7E", color: "#4F4B7E" }} onClick={handleResendOtp} className="w-100 mt-2">
                          RESEND OTP
                        </Button>
                      </div>
                    )}
                    {otpTimer > 0 && !canResendOtp && (
                      <p className="text-center mt-2">Resend OTP in {otpTimer} seconds</p>
                    )}
                 
                  </Form>
          </div>
           <div className='mb-2 mt-2' style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px'
  }}>
                      <label style={{ margin: 0 }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                          style={{ cursor: 'pointer' }}
                        />
                      </label>
                      <span
                        onClick={() => setShowPopup(true)}
                        style={{
                          cursor: 'pointer',
                          fontSize: '13px',
                          color:"#666"
                        }}
                      >
                        I agree with <span style={{ color: '#4F4B7E', textDecoration: 'underline' }}>terms & conditions</span>
                      </span>

                      {showPopup && (
                        <div
                          style={{
                            position: 'fixed',
                            top: '0',
                            left: '0',
                            height: '100vh',
                            backgroundColor: '#fff',
                            color: 'black',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            overflow: "hidden"
                          }}
                        >
                          <div
                            style={{
                              maxHeight: '100%',
                              overflowY: 'auto',
                              width: '100%',
                              padding: '20px',
                              borderRadius: '10px',
                              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                              minWidth: '300px',
                              textAlign: 'center',
                            }}
                          >
                            <PrivacyPolicyWeb />
                            <button
                              onClick={() => setShowPopup(false)}
                              style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                padding: '6px 12px',
                                backgroundColor: '#EFEFEF',
                                color: 'black',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              <FaChevronLeft /> <span className="m-0">Back</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className='mb-2 mt-1' style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px'
  }}>
                      <label style={{ margin: 0 }}>
                        <input
                          type="checkbox"
                          defaultChecked
                          style={{ cursor: 'pointer' }}
                        />
                      </label>
                      <span
                        onClick={() => setShowWhatsAppPopup(true)}
                        style={{
                          cursor: 'pointer',
                          fontSize: '13px',
                          color:"#666"
                        }}
                      >
                        I agree with <span style={{ color: '#4F4B7E', textDecoration: 'underline' }}>WhatsApp policy</span>
                      </span>

                      {showWhatsAppPopup && (
                        <div
                          style={{
                            position: 'fixed',
                            top: '0',
                            left: '0',
                            height: '100vh',
                            backgroundColor: '#fff',
                            color: 'black',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            overflow: "hidden"
                          }}
                        >
                          <div
                            style={{
                              maxHeight: '100%',
                              overflowY: 'auto',
                              width: '100%',
                              padding: '20px',
                              borderRadius: '10px',
                              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                              minWidth: '300px',
                              textAlign: 'center',
                            }}
                          >
                            <WhatsAppPolicyWeb />
                            <button
                              onClick={() => setShowWhatsAppPopup(false)}
                              style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                padding: '6px 12px',
                                backgroundColor: '#EFEFEF',
                                color: 'black',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              <FaChevronLeft /> <span className="m-0">Back</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
        </div>
    )}
    </div>
  </Row>
</Container>

    {showLoginFailPopup && (
      <div
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
        }}
        onClick={() => setShowLoginFailPopup(false)}
      >
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
          <h3 style={{ color: '#4F4B7E', marginBottom: '15px', fontWeight: 700 }}>Login Failed</h3>
          <p style={{ color: '#666', marginBottom: '25px', fontSize: '16px' }}>{failureMessage}</p>
          <Button
            onClick={() => setShowLoginFailPopup(false)}
            style={{
              backgroundColor: '#4F4B7E',
              border: 'none',
              color: 'white',
              padding: '10px 30px',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    )}

    </>
  );
};

export default Login;