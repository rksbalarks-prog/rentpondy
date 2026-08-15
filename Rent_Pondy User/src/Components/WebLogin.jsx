
import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setPhoneNumber } from '../red/userSlice';
import { Helmet } from 'react-helmet';
import Flag from 'react-world-flags';
import logo from '../Assets/ppc logo.jpg';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getActiveBase, baseToPath } from '../utils/cityBase';
import './Login.css';
import { RiEdit2Fill } from "react-icons/ri";
import PrivacyPolicyWeb from './PrivacyPolicyWeb';
import WhatsAppPolicyWeb from './WhatsAppPolicyWeb';
import AboutMobile from './AboutMobile';
import { FaArrowLeft, FaChevronLeft } from 'react-icons/fa';
import { MdEmail, MdLock } from 'react-icons/md';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { setupRecaptcha } from '../Firebase';

const WebLogin = ({ onLogin }) => {
  // OTP provider chosen by admin ('smsidea' | 'firebase'); defaults to the
  // current server-side SMS Idea flow until the setting loads / is changed.
  const [otpProvider, setOtpProvider] = useState('smsidea');
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

  const [isScrolling, setIsScrolling] = useState(false);

  // Load the admin-controlled OTP provider for the user app.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/otp-setting`);
        if (!cancelled && res.data && res.data.userProvider) {
          setOtpProvider(res.data.userProvider);
        }
      } catch (err) {
        // keep default 'smsidea' on failure
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

  const countryCodes = [
    { code: '+1', country: 'USA', flag: 'US' },
    { code: '+44', country: 'UK', flag: 'GB' },
    { code: '+91', country: 'IN', flag: 'IN' },
    { code: '+61', country: 'Australia', flag: 'AU' },
    { code: '+81', country: 'Japan', flag: 'JP' },
  ];

  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedPhone = localStorage.getItem('phoneNumber');
      
      if (storedPhone) {
        dispatch(setPhoneNumber(storedPhone));
        navigate(baseToPath(getActiveBase()), { state: { phoneNumber: phoneNumber } });
      }
    };

    checkLoggedIn();
  }, [dispatch, navigate]);

  


  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    setIsDisabled(!checked);
  };

  const handleCountryChange = (e) => {
    const selected = e.target.value;
    const country = countryCodes.find(c => c.flag === selected);
    setCountryCode(country.code);
    setSelectedCountry(selected);
  };

  const handlePhoneNumberChange = (e) => {
    const phone = e.target.value;
    setPhoneNumberState(phone);
    setIsPhoneNumberEntered(phone.length > 0);
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



  // const handleSendOtp = async (e) => {
  //   e.preventDefault();

  //   if (!phoneNumber) {
  //     toast.error('Please enter a valid phone number.', {
  //       position: 'top-center',
  //       autoClose: 5000,
  //     });
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-otp`, {
  //       phoneNumber: `${countryCode}${phoneNumber}`,
  //       loginMode: loginMode,
  //       countryCode: countryCode
  //     });

  //     const generatedOtp = response.data.result?.otp;

  //     if (generatedOtp) {
  //       // toast.success(`OTP sent! Your OTP is: ${generatedOtp}`,
  //               toast.success(`OTP Sent Successfully!`,

  //          {
  //         position: 'top-center',
  //         autoClose: 20000,
  //       });

  //       setMockOtp(generatedOtp);
  //       setIsOtpSent(true);
  //       setOtpTimer(30);
  //       setCanResendOtp(false);
  //       setOtp('');
  //     }
  //   } catch (error) {
  //     const errorMessage = error.response?.data?.error || 'Something went wrong!';
  //     toast.error(errorMessage, {
  //       position: 'top-center',
  //       autoClose: 5000,
  //     });
  //   }
  // };



  const handleSendOtp = async (e) => {
  e.preventDefault();

  if (!phoneNumber) {
    toast.error('Please enter a valid phone number.', {
      position: 'top-center',
      autoClose: 5000,
    });
    return;
  }

  setIsLoading(true);

  try {
    const fullPhoneNumber = `${phoneNumber}`;
    const plainPhoneDigits = phoneNumber.replace(/\D/g, '').slice(-10);

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
      setIsLoading(false);
      navigate(baseToPath(getActiveBase()));
      return; // Skip OTP
    }

    // 2. If not directly verified, send OTP via the active provider
    if (otpProvider === 'firebase') {
      // Firebase Phone Auth: send the SMS from the browser. The verify step
      // confirms the code and posts the resulting ID token to the backend.
      const e164 = `${countryCode}${plainPhoneDigits}`;
      window.confirmationResult = await setupRecaptcha(e164);

      toast.success('OTP Sent Successfully!', {
        position: 'top-center',
        autoClose: 20000,
      });

      setMockOtp('');
      setIsOtpSent(true);
      setOtpTimer(30);
      setCanResendOtp(false);
      setOtp('');
      setIsLoading(false);
      return;
    }

    // SMS Idea (default): backend generates, sends and stores the OTP.
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

      setMockOtp(generatedOtp);
      setIsOtpSent(true);
      setOtpTimer(30);
      setCanResendOtp(false);
      setOtp('');
      setIsLoading(false);
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || error?.message || 'Something went wrong!';
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
    const fullPhoneNumber = `${phoneNumber}`;

    if (otpProvider === 'firebase') {
      // Confirm the code with Firebase, then exchange the ID token at the backend.
      if (!window.confirmationResult) {
        throw new Error('Please request the OTP again.');
      }
      const cred = await window.confirmationResult.confirm(otp);
      const idToken = await cred.user.getIdToken();

      await axios.post(`${process.env.REACT_APP_API_URL}/user/firebase-login-rent`, {
        idToken,
        phoneNumber: fullPhoneNumber,
        loginMode,
        countryCode,
      });

      toast.success('OTP verified successfully!');
      localStorage.setItem('phoneNumber', fullPhoneNumber);
      dispatch(setPhoneNumber(fullPhoneNumber));
      navigate(baseToPath(getActiveBase()));
      setIsLoading(false);
      return;
    }

    // SMS Idea (default): verify against the backend DB record.
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/verify-otp-rent`, {
      phoneNumber: fullPhoneNumber,
      otp: otp,
    });

    if (response.status === 200) {
      toast.success('OTP verified successfully!');
      localStorage.setItem('phoneNumber', fullPhoneNumber);
      dispatch(setPhoneNumber(fullPhoneNumber));
navigate(baseToPath(getActiveBase()));
      setIsLoading(false);

      // navigate('/pondicherry');
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error?.code === 'auth/invalid-verification-code' ? 'Invalid OTP' : null) ||
      error?.message ||
      'OTP verification failed!';
    setFailureMessage(errorMessage);
    setShowLoginFailPopup(true);
    setIsLoading(false);
  }
};


  
  const handleResendOtp = async () => {
    if (!canResendOtp) return;

    try {
      if (otpProvider === 'firebase') {
        const plainPhoneDigits = phoneNumber.replace(/\D/g, '').slice(-10);
        const e164 = `${countryCode}${plainPhoneDigits}`;
        window.confirmationResult = await setupRecaptcha(e164);

        toast.success(`OTP resent!`, {
          position: 'top-center',
          autoClose: 20000,
        });

        setMockOtp('');
        setOtpTimer(30);
        setCanResendOtp(false);
        setOtp('');
        return;
      }

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-otp-rent`, {
        phoneNumber: `${phoneNumber}`,
        loginMode: loginMode,
        countryCode: countryCode
      });

      const newOtp = response.data.result?.otp;

      if (newOtp) {
        toast.success(`OTP resent!`, {
          position: 'top-center',
          autoClose: 20000,
        });

        setMockOtp(newOtp);
        setOtpTimer(30);
        setCanResendOtp(false);
        setOtp('');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error?.message || 'Failed to resend OTP.';
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

  if (storedPhoneNumber) {
    return null;
  }

  return (
    <>
      {/* Invisible reCAPTCHA host for Firebase Phone Auth (used when otpProvider === 'firebase') */}
      <div id="recaptcha-container" />
      <Helmet>
        <title>Rent Pondy | Login</title>
      </Helmet>
      <style>{`
        * {
          font-family: 'Poppins', 'Inter', 'Arial', sans-serif;
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          width: 100%;
          overflow-x: hidden;
        }

        body {
          background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        .modern-login-container {
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
          padding: 5px;
          padding-top: 10px;
          padding-bottom: 5px;
          animation: fadeInContainer 0.8s ease-in;
          min-height: auto;
          width: 100%;
          box-sizing: border-box;
          justify-content: center;
          align-items: center;
        }

        @keyframes fadeInContainer {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .login-card {
          display: flex;
          border-radius: 30px;
          overflow: hidden;
          background: white;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
          width: calc(100% - 10px);
          max-width: 1000px;
          height: auto;
          margin: 0 auto;
          animation: slideUp 0.8s ease-out;
          box-sizing: border-box;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-form-section {
          flex: 1;
          padding: 50px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #ffffff;
          box-sizing: border-box;
          width: 100%;
        }

        .login-welcome-section {
          flex: 1;
          background: linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          padding: 40px;
        }

        /* Wave SVG Styles */
        .wave-top, .wave-bottom {
          position: absolute;
          width: 100%;
          height: 150px;
          opacity: 0.3;
        }

        .wave-top {
          top: 0;
          left: 0;
        }

        .wave-bottom {
          bottom: 0;
          left: 0;
          transform: rotate(180deg);
        }

        .form-heading {
          font-size: 32px;
          font-weight: 800;
          color: #1F2937;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .form-subheading {
          font-size: 15px;
          color: #6B7280;
          margin-bottom: 40px;
          font-weight: 500;
        }

        .modern-input-group {
          position: relative;
          margin-bottom: 20px;
          width: 100%;
          box-sizing: border-box;
        }

        .modern-input {
          width: 100%;
          padding: 14px 16px 14px 45px;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          color: #1F2937;
          background: #F9FAFB;
          transition: all 0.3s ease;
          font-family: 'Poppins', 'Inter', Arial, sans-serif;
          outline: none;
          box-sizing: border-box;
        }

        .modern-input:focus {
          background: white;
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }

        .modern-input::placeholder {
          color: #9CA3AF;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #6B7280;
          font-size: 20px;
          pointer-events: none;
        }

        .input-icon-right {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #6B7280;
          font-size: 20px;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .input-icon-right:hover {
          color: #059669;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
          font-size: 14px;
        }

        .checkbox-group input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #059669;
          cursor: pointer;
          margin-right: 8px;
        }

        .forgot-password {
          color: #059669;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .forgot-password:hover {
          color: #10B981;
        }

        .modern-button {
          width: 100%;
          padding: 14px 24px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          background: linear-gradient(135deg, #059669 0%, #10B981 100%);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 20px;
          font-family: 'Poppins', 'Inter', Arial, sans-serif;
        }

        .modern-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(5, 150, 105, 0.3);
        }

        .modern-button:active {
          transform: translateY(0);
        }

        .form-footer {
          text-align: center;
          font-size: 14px;
          color: #6B7280;
        }

        .form-footer a {
          color: #059669;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .form-footer a:hover {
          color: #10B981;
        }

        .welcome-heading {
          font-size: 42px;
          font-weight: 800;
          margin-bottom: 20px;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .welcome-text {
          font-size: 16px;
          text-align: center;
          line-height: 1.6;
          position: relative;
          z-index: 1;
          opacity: 0.95;
          max-width: 300px;
        }

        .resend-otp-button {
          width: 100%;
          padding: 14px 24px;
          border: 2px solid white;
          background: transparent;
          color: white;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Poppins', 'Inter', Arial, sans-serif;
          margin-bottom: 15px;
        }

        .resend-otp-button:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .otp-timer {
          text-align: center;
          color: #9CA3AF;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .edit-button {
          background: none;
          border: none;
          color: #059669;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.3s ease;
          font-size: 14px;
        }

        .edit-button:hover {
          color: #10B981;
        }

        .phone-display {
          font-size: 15px;
          color: #1F2937;
          margin-bottom: 25px;
          font-weight: 500;
        }

        .terms-text {
          font-size: 14px;
          color: #374151;
          margin-top: 15px;
          padding: 12px;
          background: #F3F4F6;
          border-radius: 8px;
          border-left: 4px solid #059669;
        }

        .terms-text label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          margin-bottom: 0;
        }

        .terms-text input[type="checkbox"] {
          accent-color: #059669;
          cursor: pointer;
          margin-top: 3px;
          width: 18px;
          height: 18px;
        }

        .privacy-link {
          color: #059669;
          cursor: pointer;
          text-decoration: underline;
          font-weight: 700;
          transition: color 0.3s ease;
        }

        .privacy-link:hover {
          color: #10B981;
          text-decoration: underline;
        }

        @media (max-width: 1024px) {
          .login-card {
            width: calc(100% - 10px);
            max-width: 900px;
          }

          .login-form-section {
            padding: 40px 30px;
          }
        }

        @media (max-width: 768px) {
          .modern-login-container {
            padding: 0;
            padding-top: 5px;
            padding-bottom: 0;
            min-height: auto;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .login-card {
            flex-direction: column;
            height: auto;
            width: 100%;
            max-width: 100%;
            border-radius: 0;
            box-shadow: none;
            margin: 0;
          }

          .login-welcome-section {
            display: none !important;
          }

          .login-form-section {
            padding: 30px 20px;
            padding-bottom: 25px;
            flex: 1;
            width: 100%;
          }

          .form-heading {
            font-size: 26px;
            margin-bottom: 10px;
          }

          .form-subheading {
            font-size: 14px;
            margin-bottom: 30px;
          }

          .modern-input-group {
            margin-bottom: 15px;
          }

          .modern-input {
            padding: 12px 14px 12px 40px;
            font-size: 14px;
          }

          .modern-button {
            padding: 12px 20px;
            font-size: 15px;
            margin-bottom: 12px;
          }

          .checkbox-group {
            font-size: 13px;
            margin-bottom: 20px;
          }

          .form-footer {
            font-size: 13px;
            margin-bottom: 0;
          }

          .phone-display {
            font-size: 14px;
            margin-bottom: 20px;
          }

          .edit-button {
            font-size: 12px;
          }

          .resend-otp-button {
            padding: 12px 20px;
            font-size: 14px;
          }

          .otp-timer {
            font-size: 13px;
          }

          .terms-text {
            font-size: 13px;
            padding: 10px;
          }

          .mb-2 {
            margin-bottom: 12px !important;
          }

          .mt-1 {
            margin-top: 8px !important;
          }

          .mt-2 {
            margin-top: 12px !important;
          }
        }

        @media (max-width: 480px) {
          .modern-login-container {
            padding: 0;
            padding-top: 5px;
            padding-bottom: 0;
          }

          .login-card {
            border-radius: 0;
          }

          .login-form-section {
            padding: 25px 15px;
            padding-bottom: 20px;
          }

          .form-heading {
            font-size: 24px;
          }

          .form-subheading {
            font-size: 13px;
          }

          .modern-input-group {
            margin-bottom: 12px;
          }

          .modern-input {
            padding: 11px 12px 11px 38px;
            font-size: 13px;
            border-radius: 10px;
          }

          .input-icon {
            left: 12px;
            font-size: 18px;
          }

          .modern-button {
            padding: 11px 18px;
            font-size: 14px;
            margin-bottom: 12px;
          }

          .form-footer {
            font-size: 12px;
            margin-bottom: 0;
          }

          .form-footer a {
            font-size: 12px;
          }
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="tel"]::-webkit-inner-spin-button,
        input[type="tel"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>

      <div className="modern-login-container">
        <div className="login-card">
          {/* Left Form Section */}
          <div className="login-form-section">
            <h1 className="form-heading">Hello!</h1>
            <p className="form-subheading">Sign in to your account</p>

            {!isOtpSent ? (
              <Form onSubmit={handleSendOtp}>
                {/* Country and Phone Input */}
                <div className="modern-input-group">
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Form.Select
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      aria-label="Select Country"
                      className="modern-input"
                      style={{
                        flex: '0 0 auto',
                        width: '100px',
                        paddingLeft: '12px',
                      }}
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.flag}>
                          {country.code}
                        </option>
                      ))}
                    </Form.Select>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <MdEmail className="input-icon" />
                      <Form.Control
                        type="tel"
                        placeholder="Enter Mobile No"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        required
                        ref={phoneInputRef}
                        className="modern-input"
                        pattern="[0-9]{10,15}"
                        maxLength={15}
                      />
                    </div>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="checkbox-group">
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    <span style={{ marginLeft: '8px' }}>Remember me</span>
                  </label>
                 
                </div>

                {/* Terms & Conditions */}
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
                    I agree with <span style={{ color: '#059669', textDecoration: 'underline' }}>terms & conditions</span>
                  </span>

                  {showPopup && (
                    <div
                      style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        height: '100vh',
                        width: '100vw',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'black',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000,
                        overflow: "hidden"
                      }}
                    >
                      <div
                        style={{
                          maxHeight: '100vh',
                          height: '100%',
                          overflowY: 'auto',
                          width: '100%',
                          padding: '50px 40px 40px 40px',
                          backgroundColor: '#fff',
                          position: 'relative',
                          textAlign: 'center',
                        }}
                      >
                        <button
                          onClick={() => setShowPopup(false)}
                          style={{
                            position: 'fixed',
                            top: '20px',
                            left: '20px',
                            padding: '10px 16px',
                            backgroundColor: '#E5E7EB',
                            color: '#1F2937',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '14px',
                            zIndex: 2002,
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#D1D5DB'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                        >
                          <FaChevronLeft size={16} /> Back
                        </button>
                        <PrivacyPolicyWeb />
                      </div>
                    </div>
                  )}
                </div>

                {/* WhatsApp Policy */}
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
                    I agree with <span style={{ color: '#059669', textDecoration: 'underline' }}>WhatsApp policy</span>
                  </span>

                  {showWhatsAppPopup && (
                    <div
                      style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        height: '100vh',
                        width: '100vw',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'black',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000,
                        overflow: "hidden"
                      }}
                    >
                      <div
                        style={{
                          maxHeight: '100vh',
                          height: '100%',
                          overflowY: 'auto',
                          width: '100%',
                          padding: '50px 40px 40px 40px',
                          backgroundColor: '#fff',
                          position: 'relative',
                          textAlign: 'center',
                        }}
                      >
                        <button
                          onClick={() => setShowWhatsAppPopup(false)}
                          style={{
                            position: 'fixed',
                            top: '20px',
                            left: '20px',
                            padding: '10px 16px',
                            backgroundColor: '#E5E7EB',
                            color: '#1F2937',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '14px',
                            zIndex: 2002,
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#D1D5DB'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                        >
                          <FaChevronLeft size={16} /> Back
                        </button>
                        <WhatsAppPolicyWeb />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="modern-button"
                  disabled={isLoading}
                  style={{
                    opacity: isLoading ? 0.6 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? 'LOGGING IN...' : 'LOGIN'}
                </button>

                {/* Footer */}
                <div className="form-footer">
                  Don't have an account? <a href="https://rentpondy.com/login">Create</a>
                </div>
              </Form>
            ) : (
              <Form onSubmit={handleVerifyOtp}>
                {/* Phone Display */}
                <div className="phone-display">
                  Login Number: <strong>{phoneNumber}</strong>
                  <button
                    type="button"
                    className="edit-button"
                    onClick={handleEdit}
                    style={{ marginLeft: '8px' }}
                  >
                    <RiEdit2Fill size={16} />
                    Edit
                  </button>
                </div>

                {/* OTP Input */}
                <div className="modern-input-group">
                  <MdLock className="input-icon" />
                  <Form.Control
                    type="number"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={isDisabled}
                    required
                    className="modern-input"
                  />
                </div>

                {/* Resend OTP */}
                {canResendOtp && (
                  <button type="button" className="resend-otp-button" onClick={handleResendOtp}>
                    RESEND OTP
                  </button>
                )}

                {otpTimer > 0 && !canResendOtp && (
                  <div className="otp-timer">Resend OTP in {otpTimer} seconds</div>
                )}

                {/* Verify Button */}
                <button 
                  type="submit" 
                  className="modern-button"
                  disabled={isLoading}
                  style={{
                    opacity: isLoading ? 0.6 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? 'VERIFYING...' : 'VERIFY OTP'}
                </button>

                {/* Terms & Conditions */}
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
                    I agree with <span style={{ color: '#059669', textDecoration: 'underline' }}>terms & conditions</span>
                  </span>

                  {showPopup && (
                    <div
                      style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        height: '100vh',
                        width: '100vw',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'black',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000,
                        overflow: "hidden"
                      }}
                    >
                      <div
                        style={{
                          maxHeight: '100vh',
                          height: '100%',
                          overflowY: 'auto',
                          width: '100%',
                          padding: '50px 40px 40px 40px',
                          backgroundColor: '#fff',
                          position: 'relative',
                          textAlign: 'center',
                        }}
                      >
                        <button
                          onClick={() => setShowPopup(false)}
                          style={{
                            position: 'fixed',
                            top: '20px',
                            left: '20px',
                            padding: '10px 16px',
                            backgroundColor: '#E5E7EB',
                            color: '#1F2937',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '14px',
                            zIndex: 2002,
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#D1D5DB'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                        >
                          <FaChevronLeft size={16} /> Back
                        </button>
                        <PrivacyPolicyWeb />
                      </div>
                    </div>
                  )}
                </div>

                {/* WhatsApp Policy */}
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
                    I agree with <span style={{ color: '#059669', textDecoration: 'underline' }}>WhatsApp policy</span>
                  </span>

                  {showWhatsAppPopup && (
                    <div
                      style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        height: '100vh',
                        width: '100vw',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'black',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000,
                        overflow: "hidden"
                      }}
                    >
                      <div
                        style={{
                          maxHeight: '100vh',
                          height: '100%',
                          overflowY: 'auto',
                          width: '100%',
                          padding: '50px 40px 40px 40px',
                          backgroundColor: '#fff',
                          position: 'relative',
                          textAlign: 'center',
                        }}
                      >
                        <button
                          onClick={() => setShowWhatsAppPopup(false)}
                          style={{
                            position: 'fixed',
                            top: '20px',
                            left: '20px',
                            padding: '10px 16px',
                            backgroundColor: '#E5E7EB',
                            color: '#1F2937',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '14px',
                            zIndex: 2002,
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#D1D5DB'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                        >
                          <FaChevronLeft size={16} /> Back
                        </button>
                        <WhatsAppPolicyWeb />
                      </div>
                    </div>
                  )}
                </div>
              </Form>
            )}

            <ToastContainer />
          </div>

          {/* Right Welcome Section */}
          <div className="login-welcome-section">
            <svg className="wave-top" viewBox="0 0 1200 150">
              <path
                d="M0,50 Q300,10 600,50 T1200,50 L1200,0 L0,0 Z"
                fill="white"
                opacity="0.1"
              />
            </svg>

            <img 
              src="data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='40' fill='white' opacity='0.95'/%3E%3Cpath d='M25 55V35L40 22L55 35V55' stroke='%23059669' stroke-width='2.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Crect x='32' y='40' width='16' height='15' stroke='%23059669' stroke-width='2.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Crect x='37' y='45' width='6' height='10' fill='%23059669'/%3E%3C/svg%3E"
              alt="Home Icon"
              style={{
                width: '80px',
                height: '80px',
                marginBottom: '20px',
                animation: 'bounce 2s infinite',
                position: 'relative',
                zIndex: 1
              }}
            />

            <h2 className="welcome-heading">Welcome Back!</h2>
            <p className="welcome-text">
             Find Your Perfect Home in Pondy..
No Brokers. No Stress. Just Easy Rentals.
            </p>

            <svg className="wave-bottom" viewBox="0 0 1200 150">
              <path
                d="M0,50 Q300,10 600,50 T1200,50 L1200,0 L0,0 Z"
                fill="white"
                opacity="0.1"
              />
            </svg>
          </div>
        </div>
      </div>

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
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>âŒ</div>
            <h3 style={{ color: '#059669', marginBottom: '15px', fontWeight: 700 }}>Login Failed</h3>
            <p style={{ color: '#666', marginBottom: '25px', fontSize: '16px' }}>{failureMessage}</p>
            <button
              onClick={() => setShowLoginFailPopup(false)}
              style={{
                backgroundColor: '#059669',
                border: 'none',
                color: 'white',
                padding: '10px 30px',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WebLogin;