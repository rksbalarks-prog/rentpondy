


import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { FaHome, FaBuilding, FaLightbulb, FaUserCircle, FaRocket, FaCogs, FaInfoCircle, FaRegAddressCard, FaShare, FaStar, FaShieldAlt, FaUsers, FaEnvelope, FaRegBell, FaShippingFast, FaCoins, FaHotel } from 'react-icons/fa';
import logo from "../Assets/rentpondylogo.png";
import { useNavigate, useLocation } from 'react-router-dom';
import { MdClose, MdPolicy, MdRefresh } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { RiApps2AiFill } from 'react-icons/ri';
import { HiDocumentText } from 'react-icons/hi2';
import { BiSolidLogIn } from 'react-icons/bi';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setPhoneNumber } from '../red/userSlice'; // Import your Redux action
import { getActiveBase } from '../utils/cityBase'; // City switch label (Pondy / Chennai)
import './NavbarAnimation.css';




const SidebarApp = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);

  const [hasUnread, setHasUnread] = useState(false);
  const [hasClickedBell, setHasClickedBell] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Points balance chip shown in the top-right header. `null` =
  // unknown (loading / logged-out / API unreachable) so the UI can
  // hide the chip and avoid showing a misleading "0 pts".
  const [pointsBalance, setPointsBalance] = useState(null);

  // Modal that opens when the chip is tapped. Shows current balance
  // and a CTA to /points-plans for top-up.
  const [showBalanceModal, setShowBalanceModal] = useState(false);


  const handleMouseEnter = (linkId) => setHoveredLink(linkId);
  const handleMouseLeave = () => setHoveredLink(null);

  // Function to apply bold styling only to the hovered link
  const getLinkStyle = (linkId) => ({
    color: 'black',
    fontWeight: hoveredLink === linkId ? 'bold' : 'normal',
    transition: 'all 0.3s ease-in-out',
    transform: hoveredLink === linkId ? 'scale(1.1)' : 'scale(1)', // Slightly enlarge the link on hover

  });


  const handleRefresh = () => {
    window.location.reload(); // reloads the page
  };
  // ... inside your component ...

  const dispatch = useDispatch();

  const handleLogout = async () => {
    // ✅ Send WhatsApp Logout Message
    try {
      const ownerName = "Owner"; // Default name for logout
      const rawPhone = phoneNumber || "";

      // ✅ Format phone number (remove symbols, spaces, etc.)
      const mobileNumber = String(rawPhone).replace(/\D/g, "");

      // ✅ Add India country code if number is 10 digits
      const to = mobileNumber.length === 10 ? `91${mobileNumber}` : mobileNumber;

      // ✅ WhatsApp Logout Message
      const message = `Hi ${ownerName}, 👋

You have successfully logged out from Rent Pondy! 🏡

Your account is secure and you can log back in anytime.

Thank you for using Rent Pondy!
We look forward to serving you again soon.

– Team Rent Pondy`;

      // ✅ Send WhatsApp message only if number is valid
      if (to.length >= 12) {
        // await axios.post(`${process.env.REACT_APP_API_URL}/send-message`, {
        //   to,
        //   message,
        // });

        console.log("✅ WhatsApp logout message sent to:", to);
      } else {
        console.log("⚠️ Invalid phone number:", rawPhone);
      }
    } catch (whatsErr) {
      console.log(
        "⚠️ WhatsApp logout message failed (non-blocking):",
        whatsErr.message
      );
    }

    // Clear Redux store
    dispatch(setPhoneNumber(null)); // Or use a dedicated logout action if you have one

    // Clear localStorage
    localStorage.removeItem('phoneNumber');

    // Redirect to login page
    navigate('/login');

    // Optional: Show logout success message
    // toast.success("Logged out successfully!");
  };


  const { phoneNumber: statePhoneNumber, countryCode: stateCountryCode } = location.state || {};
  const storedPhoneNumber = localStorage.getItem('phoneNumber');
  // const storedCountryCode = localStorage.getItem('countryCode');

  const phoneNumber = statePhoneNumber || storedPhoneNumber;
  // const countryCode = stateCountryCode || storedCountryCode;

  const fullPhoneNumber = `${phoneNumber}`;

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);





  const fetchUnreadNotifications = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-unread-notifications`, {
        params: { phoneNumber },
      });
      const unread = res.data.notifications || [];

      setNotifications(unread);
      setHasUnread(unread.length > 0);

    } catch (error) {
    }
  };

  // Compact a points number into chip-friendly form (1.2K / 3.4M / 5B).
  // Below 1,000 we keep the exact value; above that we round to one
  // decimal and strip a trailing ".0" so the chip stays narrow.
  const formatCompactPoints = (n) => {
    const num = Number(n);
    if (!Number.isFinite(num)) return '0';
    const abs = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    const trim = (v) => v.toFixed(1).replace(/\.0$/, '');
    if (abs >= 1e9) return `${sign}${trim(abs / 1e9)}B`;
    if (abs >= 1e6) return `${sign}${trim(abs / 1e6)}M`;
    if (abs >= 1e3) return `${sign}${trim(abs / 1e3)}K`;
    return `${sign}${abs}`;
  };

  const fetchPointsBalance = async (phone) => {
    if (!phone) return;
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/points-balance/${phone}`
      );
      const bal = res?.data?.balance;
      setPointsBalance(typeof bal === 'number' ? bal : 0);
    } catch (err) {
      // Keep balance null on failure so the chip stays hidden rather
      // than misleading the user with a stale number.
      setPointsBalance(null);
    }
  };

  useEffect(() => {
    if (phoneNumber) {
      fetchUnreadNotifications();
      fetchPointsBalance(phoneNumber);
    }
  }, [phoneNumber]);

  // Refresh the balance whenever the user lands back on a page that
  // renders this header (e.g. after a successful PayU top-up or a
  // contact reveal). Using `location.pathname` as the trigger keeps
  // the header in sync without polling.
  useEffect(() => {
    if (phoneNumber) fetchPointsBalance(phoneNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleBellClick = () => {
    setHasClickedBell(true);
    navigate('/notification');

    // You can show the notifications dropdown or modal here
  };


  useEffect(() => {
    if (phoneNumber) {
      localStorage.setItem('phoneNumber', phoneNumber);
      // localStorage.setItem('countryCode', countryCode);
    } else {
    }
  }, [phoneNumber]);

  const handleLinkClick = (path) => {
    navigate(path, { state: { phoneNumber: fullPhoneNumber } });
    closeSidebar();
  };
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isSidebarOpen]);

  // Flag the open sidebar on <body> so unrelated floating UI can get out of the
  // way. The sidebar's own z-index can't win here: Main.jsx wraps <Navbar /> in
  // a `translate-middle-x` div (a transform, so a new stacking context) at
  // z-index 1050, which caps everything inside it — including this sidebar —
  // below the Pay Now button's 1060. Rather than re-tune z-indexes across the
  // app, PayNow.jsx just hides itself while this class is set.
  useEffect(() => {
    document.body.classList.toggle('rp-sidebar-open', isSidebarOpen);
    return () => document.body.classList.remove('rp-sidebar-open');
  }, [isSidebarOpen]);







  return (
    <div className="d-flex" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar */}
     <div
  ref={sidebarRef}
  className={`position-fixed bg-light border-end ${isSidebarOpen ? "d-block" : "d-none"}`}
  style={{
    width: "300px",
    height: "auto",
    transition: "left 0.3s ease",
    zIndex: 2000,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  }}
>
  {/* Close Button */}
  <button
    className="btn position-absolute top-0 end-0 m-0"
    onClick={toggleSidebar}
    aria-label="Close Sidebar"
  >
    <MdClose />
  </button>

  {/* Header Section */}
  <div
    style={{
      background: "#24ad92ff",
      flexShrink: 0,
      padding: "10px",
    }}
    className="d-flex align-items-center w-100"
  >
    <img
      src={logo}
      alt="Logo"
      style={{ height: "80px", width: "80px" }}
      className="mb-2 mb-md-0 rounded-4"
    />

    <div className="ms-md-3 ms-2">
      <h6 style={{ margin: 0 }}>
        <span style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>RENT</span>
        <span style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}> {getActiveBase() === 'CH' ? 'CHENNAI' : 'PONDY'}</span>
      </h6>

      <p style={{ color: "white", fontSize: "13px" }}>
        Find Your dream House Here!
      </p>

      {/* Phone Number as Text only */}
      {phoneNumber && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "-8px" }}>
          <FaPhone style={{ color: "white", fontSize: "14px" }} />
          <p style={{ color: "white", fontSize: "14px", margin: 0 }}>
            {fullPhoneNumber}
          </p>
        </div>
      )}
    </div>
  </div>

  {/* Sidebar Menu */}
  <div
    className="row g-2 mt-1"
    style={{
      background: "#ffffff",
      overflowY: "scroll",
      scrollbarWidth: "none",
      width: "300px",
      height: "75vh",
    }}
  >
    <ul className="nav flex-column pb-5 w-100">

      {/* ⭐ Only ONE My Profile button */}
      <li className="nav-item">
        <a
          className="nav-link"
          style={getLinkStyle("my-profile")}
          onMouseEnter={() => handleMouseEnter("my-profile")}
          onMouseLeave={handleMouseLeave}
          href={`/my-profile/${phoneNumber}`}
          onClick={() => handleLinkClick(`/my-profile/${phoneNumber}`)}
        >
          <FaUserCircle className="me-2" style={{ color: "#4F4B7E" }} /> My Profile
        </a>
      </li>

      {/* ⭐ My Property */}
      <li className="nav-item">
        <a
          className="nav-link"
          style={getLinkStyle("my-property")}
          onMouseEnter={() => handleMouseEnter("my-property")}
          onMouseLeave={handleMouseLeave}
          href="/my-property"
          onClick={() => handleLinkClick("/my-property")}
        >
          <FaBuilding className="me-2" style={{ color: "#4F4B7E" }} /> My Property
        </a>
      </li>
            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('my-plan')}
                onMouseEnter={() => handleMouseEnter('my-plan')}
                onMouseLeave={handleMouseLeave}
                href={`/my-plan`}
                onClick={() => handleLinkClick(`/my-plan`)}
              >
                <FaLightbulb className="me-2" style={{ color: '#4F4B7E' }} /> My Plan
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('stay owners plan')}
                onMouseEnter={() => handleMouseEnter('stay owners plan')}
                onMouseLeave={handleMouseLeave}
                href="/stay-owners-plan"
                onClick={() => handleLinkClick("/stay-owners-plan")}
              >
                <FaHotel className="me-2" style={{ color: '#4F4B7E' }} /> Stay Owners Plan
              </a>
            </li>


            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('plans')}
                onMouseEnter={() => handleMouseEnter('plans')}
                onMouseLeave={handleMouseLeave}
                href="/add-plan"
                onClick={() => handleLinkClick("/add-plan")}
              >
                <FaRocket className="me-2" style={{ color: '#4F4B7E' }} /> Pricing Plans
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('points plans')}
                onMouseEnter={() => handleMouseEnter('points plans')}
                onMouseLeave={handleMouseLeave}
                href="/points-plans"
                onClick={() => handleLinkClick("/points-plans")}
              >
                <FaStar className="me-2" style={{ color: '#4F4B7E' }} /> Points Plans
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('points history')}
                onMouseEnter={() => handleMouseEnter('points history')}
                onMouseLeave={handleMouseLeave}
                href="/points-history"
                onClick={() => handleLinkClick("/points-history")}
              >
                <FaCoins className="me-2" style={{ color: '#4F4B7E' }} /> Points History
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('buyer plans')}
                onMouseEnter={() => handleMouseEnter('buyer plans')}
                onMouseLeave={handleMouseLeave}
                href="/my-buyer-plan"
                onClick={() => handleLinkClick("/my-buyer-plan")}
              >
                <FaRocket className="me-2" style={{ color: '#4F4B7E' }} />My Tenant Assistant Plan
              </a>
            </li>


            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('owner menu')}
                onMouseEnter={() => handleMouseEnter('owner menu')}
                onMouseLeave={handleMouseLeave}
                href="/owner-menu"
                onClick={() => handleLinkClick("/owner-menu")}
              >
                <FaCogs className="me-2" style={{ color: '#4F4B7E' }} /> Owner Menu
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('buyer menu')}
                onMouseEnter={() => handleMouseEnter('buyer menu')}
                onMouseLeave={handleMouseLeave}
                href="/buyer-menu"
                onClick={() => handleLinkClick("/buyer-menu")}
              >
                <FaCogs className="me-2" style={{ color: '#4F4B7E' }} />  Tenant Menu
              </a>
            </li>


            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('more')}
                onMouseEnter={() => handleMouseEnter('more')}
                onMouseLeave={handleMouseLeave}
                href="/more"
                onClick={() => handleLinkClick("/more")}
              >
                <FaCogs className="me-2" style={{ color: '#4F4B7E' }} /> More
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('contactus')}
                onMouseEnter={() => handleMouseEnter('contactus')}
                onMouseLeave={handleMouseLeave}
                href="/contactus"
                onClick={() => handleLinkClick("/contactus")}
              >
                <FaPhone className="me-2" style={{ color: '#4F4B7E' }} /> Contact Us
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('about-us')}
                onMouseEnter={() => handleMouseEnter('about-us')}
                onMouseLeave={handleMouseLeave}
                href="/about-mobile"
                onClick={() => handleLinkClick("/about-mobile")}
              >
                <FaInfoCircle className="me-2" style={{ color: '#4F4B7E' }} /> About Us
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('refund-policy')}
                onMouseEnter={() => handleMouseEnter('refund-policy')}
                onMouseLeave={handleMouseLeave}
                href="/refund-mobile"
                onClick={() => handleLinkClick("/refund-mobile")}
              >
                <MdPolicy className="me-2" style={{ color: '#4F4B7E' }} /> Refund Policy
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('terms-conditions')}
                onMouseEnter={() => handleMouseEnter('terms-conditions')}
                onMouseLeave={handleMouseLeave}
                href="/terms-conditions"
                onClick={() => handleLinkClick("/terms-conditions")}
              >
                <HiDocumentText className="me-2" style={{ color: '#4F4B7E' }} /> Terms And Conditions
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('shiping-delivery')}
                onMouseEnter={() => handleMouseEnter('shiping-delivery')}
                onMouseLeave={handleMouseLeave}
                href="/shiping-delivery-app"
                onClick={() => handleLinkClick("/shiping-delivery-app")}
              >
                <FaShippingFast className="me-2" style={{ color: '#4F4B7E' }} />Shipping & Delivery
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('more-app')}
                onMouseEnter={() => handleMouseEnter('more-app')}
                onMouseLeave={handleMouseLeave}
                href="https://play.google.com/store/apps/dev?id=5743868169001839900&hl=en"
                target="_blank"
                rel="noopener noreferrer"
              // onClick={() => handleLinkClick("https://play.google.com/store/apps/dev?id=5743868169001839900&hl=en")}
              >
                <RiApps2AiFill className="me-2" style={{ color: '#4F4B7E' }} /> More App
              </a>
            </li>
            {/* <li className="nav-item">
  <button
    className="nav-link"
    style={{
      ...getLinkStyle('more-app'),
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    }}
    onMouseEnter={() => handleMouseEnter('more-app')}
    onMouseLeave={handleMouseLeave}
    onClick={() =>
      window.open(
        'https://play.google.com/store/apps/dev?id=5743868169001839900&hl=en',
        '_system' // or '_blank' as fallback
      )
    }
  >
    <FaStar className="me-2" style={{ color: '#4F4B7E' }} /> More App
  </button>
</li> */}

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('share-app')}
                onMouseEnter={() => handleMouseEnter('share-app')}
                onMouseLeave={handleMouseLeave}
                href="https://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
              // onClick={() => handleLinkClick("https://play.google.com/store/apps/dev?id=5743868169001839900&hl=en")}
              >
                <FaShare className="me-2" style={{ color: '#4F4B7E' }} /> Share App
              </a>

            </li>
            {/* <li className="nav-item">
  <button
    className="nav-link"
    style={{
      ...getLinkStyle('share-app'),
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    }}
    onMouseEnter={() => handleMouseEnter('share-app')}
    onMouseLeave={handleMouseLeave}
    onClick={() =>
      window.open(
        'https://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share',
        '_system' // or '_blank' as fallback
      )
    }
  >
    <FaStar className="me-2" style={{ color: '#4F4B7E' }} /> Share App
  </button>
</li> */}

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('rate-app')}
                onMouseEnter={() => handleMouseEnter('rate-app')}
                onMouseLeave={handleMouseLeave}
                href="https://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
              // onClick={() => handleLinkClick("https://play.google.com/store/apps/details?id=com.deepseek.chat&hl=en#review")}
              >
                <FaStar className="me-2" style={{ color: '#4F4B7E' }} /> Rate App
              </a>
            </li>
            {/* <li className="nav-item">
  <button
    className="nav-link"
    style={{
      ...getLinkStyle('rate-app'),
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    }}
    onMouseEnter={() => handleMouseEnter('rate-app')}
    onMouseLeave={handleMouseLeave}
    onClick={() =>
      window.open(
        'https://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share',
        '_system' // or '_blank' as fallback
      )
    }
  >
    <FaStar className="me-2" style={{ color: '#4F4B7E' }} /> Rate App
  </button>
</li> */}

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('business')}
                onMouseEnter={() => handleMouseEnter('business')}
                onMouseLeave={handleMouseLeave}
                href="/business"
                onClick={() => handleLinkClick("/business")}
              >
                <FaShieldAlt className="me-2" style={{ color: '#4F4B7E' }} /> Business Opportunity
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('our-support')}
                onMouseEnter={() => handleMouseEnter('our-support')}
                onMouseLeave={handleMouseLeave}
                href="/our-support"
                onClick={() => handleLinkClick("/our-support")}
              >
                <FaUsers className="me-2" style={{ color: '#4F4B7E' }} /> Our Support
              </a>
            </li>



            {/* <li className="nav-item">
  <button
    className="nav-link border-0 bg-transparent w-100 text-start p-0"
    style={getLinkStyle('logout')}
    onMouseEnter={() => handleMouseEnter('logout')}
    onMouseLeave={handleMouseLeave}
    onClick={handleLogout}
  >
    <BiSolidLogIn className="ms-3 me-2" style={{ color: '#4F4B7E' }} /> 
    Logout
  </button>
</li> */}

            <li className="nav-item">
              <button
                className="nav-link border-0 bg-transparent w-100 text-start p-0"
                style={getLinkStyle('logout')}
                onMouseEnter={() => handleMouseEnter('logout')}
                onMouseLeave={handleMouseLeave}
                onClick={() => setShowConfirm(true)} // show popup
              >
                <BiSolidLogIn className="ms-3 me-2" style={{ color: '#4F4B7E' }} />
                Logout
              </button>
            </li>
            {/* Confirmation Popup */}
            {showConfirm && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  // width: '100vw',
                  height: '100vh',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 3000,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pointerEvents: 'auto',
                  minWidth: '280px',

                }}
              >
                <div
                  style={{
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',

                    textAlign: 'center',
                  }}
                >
                  <h5 className="text-center" style={{ fontSize: "13px" }}>Are you sure you want to logout?</h5>
                  <div className="d-flex justify-content-between gap-3">
                    <button className="btn px-4" style={{ background: "blue", color: "#fff" }} onClick={handleLogout}>Yes</button>
                    <button className="btn px-4" style={{ background: "white", color: "blue", boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)', }} onClick={() => setShowConfirm(false)}>No</button>
                  </div>
                </div>
              </div>
            )}
          </ul>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Navbar */}
        <nav
          className="navbar navbar-light bg-light d-flex align-items-center justify-content-between px-3"
          style={{ width: '100%', height: '60px', display: 'flex', flexWrap: 'nowrap', gap: '10px', position: 'relative' }}
        >
          {/* Left group: hamburger + animated RENT PONDY title sitting
              right next to it on the same baseline. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className="btn"
              onClick={toggleSidebar}
              style={{ color: "black", fontSize: "24px", padding: "0" }}
              aria-label="Toggle Menu"
            >
              ☰
            </button>
            <div className="navbar-intro-container">
              <div className="house">
                <div className="roof"></div>
                <div className="title">
                  <span className="rent">RENT</span>
                  <span className="pondy">{getActiveBase() === 'CH' ? 'CHENNAI' : 'PONDY'}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "10px", marginLeft: "auto", flexShrink: 0 }}>
            {/* Points balance button — only rendered once we know the
                balance. Tapping it jumps to /points-plans (Points Pricing
                page). Light glassy pill with halo, sparkles, shimmering
                text, and a spinning gold coin. Low-balance users get a
                pink-gold variant and a pulsing "!" badge. */}
            {phoneNumber && pointsBalance !== null && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate('/points-history');
                }}
                title="View points history"
                aria-label={`Points balance: ${pointsBalance}. Tap to view history.`}
                className="points-chip"
              >
                <span className="points-chip-shine" aria-hidden="true" style={{ pointerEvents: 'none' }} />

                <span className="points-chip-coin" aria-hidden="true" style={{ pointerEvents: 'none' }}>
                  <span className="points-chip-coin-shine" style={{ pointerEvents: 'none' }} />
                  <FaCoins size={12} color="#B5791A" style={{ pointerEvents: 'none' }} />
                </span>

                <span className="points-chip-value" style={{ pointerEvents: 'none' }}>
                  <span className="points-chip-number">{formatCompactPoints(pointsBalance)}</span>
                  <span className="points-chip-unit">pts</span>
                </span>

                {pointsBalance < 10 && (
                  <span className="points-chip-alert" aria-hidden="true" style={{ pointerEvents: 'none' }}>!</span>
                )}
              </button>
            )}

            {/* Balance preview modal — opens when the chip is tapped.
                Rendered through a portal to <body> because the sidebar
                wrapper uses CSS transforms, and a transformed ancestor
                becomes the containing block for `position: fixed` —
                that was hiding the modal off-canvas. */}
            {showBalanceModal && ReactDOM.createPortal((
              <div
                className="pb-modal-backdrop"
                role="dialog"
                aria-modal="true"
                aria-labelledby="pb-modal-title"
                onClick={() => setShowBalanceModal(false)}
              >
                <div
                  className="pb-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="pb-modal-close"
                    aria-label="Close"
                    onClick={() => setShowBalanceModal(false)}
                  >
                    ×
                  </button>

                  <div className="pb-modal-header">
                    <div className="pb-modal-coin">
                      <FaCoins size={28} color="#fff" />
                    </div>
                    <div id="pb-modal-title" className="pb-modal-title">
                      Your Points Balance
                    </div>
                    <div className="pb-modal-sub">
                      Use points to unlock owner contact details
                    </div>
                  </div>

                  <div className="pb-modal-body">
                    <div className="pb-balance-card">
                      <div className="pb-balance-label">Available balance</div>
                      <div className="pb-balance-value">
                        <span className="pb-balance-num">{pointsBalance}</span>
                        <span className="pb-balance-unit">pts</span>
                      </div>
                      <div className="pb-balance-hint">
                        ≈ <b>{Math.floor((pointsBalance || 0) / 10)}</b> contact
                        reveal{Math.floor((pointsBalance || 0) / 10) === 1 ? '' : 's'}
                        {' · '}10 pts per reveal
                      </div>
                    </div>

                    {pointsBalance < 10 && (
                      <div className="pb-low-banner">
                        You're low on points. Top up to keep revealing owner
                        contacts.
                      </div>
                    )}

                    <button
                      type="button"
                      className="pb-cta"
                      onClick={() => {
                        setShowBalanceModal(false);
                        navigate('/points-plans');
                      }}
                    >
                      <FaCoins size={16} style={{ marginRight: 8 }} />
                      Buy More Points
                    </button>

                    <button
                      type="button"
                      className="pb-cta-history"
                      onClick={() => {
                        setShowBalanceModal(false);
                        navigate('/points-history');
                      }}
                    >
                      View transaction history
                    </button>

                    <button
                      type="button"
                      className="pb-cta-secondary"
                      onClick={() => setShowBalanceModal(false)}
                    >
                      Maybe later
                    </button>
                  </div>
                </div>

                <style>{`
                  @keyframes pb-fade-in {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                  }
                  @keyframes pb-pop-in {
                    0%   { opacity: 0; transform: translateY(20px) scale(0.92); }
                    100% { opacity: 1; transform: translateY(0)     scale(1);    }
                  }

                  .pb-modal-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 12, 35, 0.55);
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 16px;
                    animation: pb-fade-in 0.18s ease-out;
                  }

                  .pb-modal {
                    position: relative;
                    width: 100%;
                    max-width: 360px;
                    border-radius: 22px;
                    background: #fff;
                    overflow: hidden;
                    box-shadow:
                      0 30px 80px rgba(15, 12, 35, 0.45),
                      0 0 0 1px rgba(255,255,255,0.6) inset;
                    animation: pb-pop-in 0.28s cubic-bezier(0.34,1.56,0.64,1);
                  }

                  .pb-modal-close {
                    position: absolute;
                    top: 8px;
                    right: 10px;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    border: none;
                    background: rgba(255,255,255,0.85);
                    color: #4F4B7E;
                    font-size: 22px;
                    line-height: 1;
                    cursor: pointer;
                    z-index: 2;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.15s ease, transform 0.15s ease;
                  }
                  .pb-modal-close:hover {
                    background: #fff;
                    transform: rotate(90deg);
                  }

                  .pb-modal-header {
                    background: linear-gradient(135deg, #4F4B7E 0%, #764ba2 55%, #FFC857 130%);
                    color: #fff;
                    text-align: center;
                    padding: 22px 18px 26px;
                    position: relative;
                  }

                  .pb-modal-coin {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #FFE680 0%, #FFD700 45%, #E09F00 100%);
                    margin: 0 auto 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow:
                      0 8px 18px rgba(0,0,0,0.25),
                      0 0 0 4px rgba(255,255,255,0.18),
                      inset 0 -3px 6px rgba(0,0,0,0.18);
                  }

                  .pb-modal-title {
                    font-size: 17px;
                    font-weight: 800;
                    letter-spacing: 0.2px;
                    margin: 0;
                  }
                  .pb-modal-sub {
                    font-size: 12.5px;
                    opacity: 0.85;
                    margin-top: 4px;
                    font-weight: 500;
                  }

                  .pb-modal-body {
                    padding: 18px 18px 20px;
                  }

                  .pb-balance-card {
                    background:
                      linear-gradient(135deg,
                        rgba(102,126,234,0.08),
                        rgba(245,87,108,0.08));
                    border: 1px solid rgba(79,75,126,0.15);
                    border-radius: 14px;
                    padding: 14px 14px 12px;
                    text-align: center;
                    margin-bottom: 14px;
                  }
                  .pb-balance-label {
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.6px;
                    text-transform: uppercase;
                    color: #888;
                  }
                  .pb-balance-value {
                    display: flex;
                    align-items: baseline;
                    justify-content: center;
                    gap: 6px;
                    margin-top: 4px;
                  }
                  .pb-balance-num {
                    font-size: 36px;
                    font-weight: 900;
                    color: #4F4B7E;
                    line-height: 1.1;
                    letter-spacing: -0.5px;
                  }
                  .pb-balance-unit {
                    font-size: 13px;
                    font-weight: 800;
                    color: #888;
                    letter-spacing: 0.6px;
                    text-transform: uppercase;
                  }
                  .pb-balance-hint {
                    margin-top: 6px;
                    font-size: 12.5px;
                    color: #666;
                  }

                  .pb-low-banner {
                    background: #FFF4D6;
                    border: 1px solid #F5C542;
                    color: #7A5B00;
                    border-radius: 10px;
                    padding: 8px 12px;
                    font-size: 12.5px;
                    margin-bottom: 12px;
                    text-align: center;
                    font-weight: 600;
                  }

                  .pb-cta {
                    width: 100%;
                    padding: 12px 16px;
                    border: none;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #4F4B7E 0%, #764ba2 50%, #f5576c 100%);
                    color: #fff;
                    font-weight: 800;
                    font-size: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.15s ease, box-shadow 0.15s ease;
                    box-shadow: 0 8px 18px rgba(79,75,126,0.35);
                  }
                  .pb-cta:hover {
                    transform: translateY(-1px) scale(1.02);
                    box-shadow: 0 12px 24px rgba(79,75,126,0.45);
                  }

                  .pb-cta-history {
                    width: 100%;
                    padding: 10px 16px;
                    margin-top: 10px;
                    border: 1.5px solid rgba(79,75,126,0.3);
                    border-radius: 12px;
                    background: #fff;
                    color: #4F4B7E;
                    font-weight: 700;
                    font-size: 13px;
                    cursor: pointer;
                    transition: background 0.15s ease, border-color 0.15s ease;
                  }
                  .pb-cta-history:hover {
                    background: #F3EEFA;
                    border-color: #4F4B7E;
                  }

                  .pb-cta-secondary {
                    width: 100%;
                    padding: 8px 16px;
                    margin-top: 6px;
                    border: none;
                    background: transparent;
                    color: #888;
                    font-weight: 600;
                    font-size: 13px;
                    cursor: pointer;
                  }
                  .pb-cta-secondary:hover { color: #555; }
                `}</style>
              </div>
            ), document.body)}
            <style>{`
              @keyframes pc-gradient {
                0%   { background-position:   0% 50%; }
                50%  { background-position: 100% 50%; }
                100% { background-position:   0% 50%; }
              }
              @keyframes pc-shine {
                0%   { transform: translateX(-160%) skewX(-22deg); }
                65%  { transform: translateX(280%)  skewX(-22deg); }
                100% { transform: translateX(280%)  skewX(-22deg); }
              }
              @keyframes pc-coin-spin {
                0%   { transform: rotateY(0deg);   }
                50%  { transform: rotateY(180deg); }
                100% { transform: rotateY(360deg); }
              }
              @keyframes pc-alert-pulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(245,87,108,0.75); transform: scale(1);    }
                50%      { box-shadow: 0 0 0 6px rgba(245,87,108,0);  transform: scale(1.15); }
              }
              @keyframes pc-text-shimmer {
                0%   { background-position: -150% center; }
                100% { background-position:  250% center; }
              }

              .points-chip {
                position: relative;
                display: inline-flex;
                align-items: center;
                gap: 7px;
                height: 34px;
                padding: 0 13px 0 6px;
                border: 1px solid rgba(255,255,255,0.85);
                border-radius: 20px;
                color: #4F4B7E;
                font-weight: 800;
                font-size: 13px;
                line-height: 1;
                cursor: pointer;
                overflow: visible;
                white-space: nowrap;
                letter-spacing: 0.3px;
                background:
                  linear-gradient(135deg,
                    rgba(255,255,255,0.95) 0%,
                    rgba(255,247,220,0.95) 45%,
                    rgba(238,232,255,0.95) 100%);
                background-size: 220% 220%;
                animation: pc-gradient 6s ease infinite;
                box-shadow:
                  0 0 0 1px rgba(255,255,255,0.6) inset,
                  0 2px 6px rgba(79,75,126,0.15);
                backdrop-filter: blur(6px);
                -webkit-backdrop-filter: blur(6px);
                transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1),
                            box-shadow 0.25s ease;
                isolation: isolate;
              }
              .points-chip:hover,
              .points-chip:focus-visible {
                transform: translateY(-1px) scale(1.04);
                box-shadow:
                  0 0 0 1px rgba(255,255,255,0.7) inset,
                  0 4px 10px rgba(79,75,126,0.2);
                outline: none;
              }
              .points-chip:active { transform: translateY(0) scale(0.98); }

              /* Diagonal sheen sliding across the pill */
              .points-chip-shine {
                position: absolute;
                top: 0;
                left: 0;
                width: 42%;
                height: 100%;
                background: linear-gradient(120deg,
                  transparent,
                  rgba(255,255,255,0.85),
                  transparent);
                animation: pc-shine 3s ease-in-out infinite;
                pointer-events: none;
                z-index: 1;
                border-radius: inherit;
              }

              /* Gold coin disc */
              .points-chip-coin {
                position: relative;
                z-index: 2;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background:
                  radial-gradient(circle at 35% 30%, #FFF8CC 0%, #FFE680 30%, #FFC43F 60%, #C88F1F 100%);
                box-shadow:
                  0 0 0 1.5px rgba(255,255,255,0.8) inset,
                  0 1px 2px rgba(0,0,0,0.15);
                animation: pc-coin-spin 4.5s ease-in-out infinite;
                transform-style: preserve-3d;
                overflow: hidden;
              }
              .points-chip-coin-shine {
                position: absolute;
                top: 3px;
                left: 4px;
                width: 8px;
                height: 4px;
                background: rgba(255,255,255,0.85);
                border-radius: 50%;
                filter: blur(1px);
                pointer-events: none;
              }

              /* Number + PTS — gold shimmer on the number */
              .points-chip-value {
                position: relative;
                z-index: 2;
                display: inline-flex;
                align-items: baseline;
                gap: 3px;
              }
              .points-chip-number {
                font-size: 15px;
                font-weight: 900;
                background: linear-gradient(90deg, #6B3FA0 0%, #B5791A 30%, #FFB800 50%, #B5791A 70%, #6B3FA0 100%);
                background-size: 200% 100%;
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: pc-text-shimmer 3s linear infinite;
                letter-spacing: 0.2px;
              }
              .points-chip-unit {
                font-size: 9px;
                font-weight: 800;
                opacity: 0.75;
                letter-spacing: 0.8px;
                text-transform: uppercase;
                color: inherit;
              }

              /* Red pulsing "!" dot on low balance */
              .points-chip-alert {
                position: absolute;
                top: -5px;
                right: -5px;
                z-index: 3;
                width: 17px;
                height: 17px;
                border-radius: 50%;
                background: linear-gradient(135deg, #ff3b4a 0%, #ff6a83 100%);
                color: #fff;
                font-size: 10px;
                font-weight: 900;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border: 2px solid #fff;
                animation: pc-alert-pulse 1.4s ease-in-out infinite;
              }
            `}</style>


            {/* Refresh button hidden — design correction
            <button
              onClick={handleRefresh}
              style={{
                padding: "4px 6px",
                cursor: "pointer",
                background: "#A0A0A0",
                border: "none",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                width: "32px",
                height: "32px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1) rotate(20deg)";
                e.currentTarget.style.background = "#808080";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                e.currentTarget.style.background = "#A0A0A0";
              }}
              title="Refresh Page"
              aria-label="Refresh"
            >
              <MdRefresh size={20} color="white" />
            </button>
            */}
            <button
              className="btn border-0"
              style={{
                fontWeight: "bold",
                padding: 0,
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              onClick={handleBellClick}
            >
              <FaRegBell color="#4F4B7E" size={22} />
            </button>

            {/* Show red badge only if there are unread notifications AND user hasn’t clicked yet */}
            {hasUnread && !hasClickedBell && (
              <span
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "red",
                  borderRadius: "50%",
                  zIndex: 1,
                }}
              ></span>
            )}
          </div>


        </nav>
      </div>
    </div>
  );
};

export default SidebarApp;










// import React, { useState, useEffect, useRef } from 'react';
// import { FaHome, FaBuilding, FaLightbulb, FaUserCircle, FaRocket, FaCogs, FaInfoCircle, FaRegAddressCard, FaShare, FaStar, FaShieldAlt, FaUsers, FaEnvelope, FaRegBell, FaShippingFast } from 'react-icons/fa';
// import logo from "../Assets/rentpondylogo.png";
// import { useNavigate, useLocation } from 'react-router-dom';
// import { MdClose, MdOutlineRefresh, MdPolicy } from "react-icons/md";
// import { FaPhone } from "react-icons/fa6";
// import { RiApps2AiFill } from 'react-icons/ri';
// import { HiDocumentText } from 'react-icons/hi2';
// import { BiSolidLogIn } from 'react-icons/bi';
// import axios from 'axios';
// import { useDispatch } from 'react-redux';
// import { setPhoneNumber } from '../red/userSlice'; // Import your Redux action




// const SidebarApp = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const sidebarRef = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [hoveredLink, setHoveredLink] = useState(null);
//   const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [notifications, setNotifications] = useState([]);

//     const [hasUnread, setHasUnread] = useState(false);
//     const [hasClickedBell, setHasClickedBell] = useState(false);
//     const [showConfirm, setShowConfirm] = useState(false);


//   const handleMouseEnter = (linkId) => setHoveredLink(linkId);
//   const handleMouseLeave = () => setHoveredLink(null);

//   // Function to apply bold styling only to the hovered link
//   const getLinkStyle = (linkId) => ({
//     color: 'black',
//     fontWeight: hoveredLink === linkId ? 'bold' : 'normal',
//     transition: 'all 0.3s ease-in-out',
//     transform: hoveredLink === linkId ? 'scale(1.1)' : 'scale(1)', // Slightly enlarge the link on hover

//   });


//     const handleRefresh = () => {
//     window.location.reload(); // reloads the page
//   };
// // ... inside your component ...

// const dispatch = useDispatch();

// const handleLogout = () => {
//   // Clear Redux store
//   dispatch(setPhoneNumber(null)); // Or use a dedicated logout action if you have one
  
//   // Clear localStorage
//   localStorage.removeItem('phoneNumber');
  
//   // Redirect to login page
//   navigate('/login');
  
//   // Optional: Show logout success message
//   // toast.success("Logged out successfully!");
// };


//   const { phoneNumber: statePhoneNumber, countryCode: stateCountryCode } = location.state || {};
//   const storedPhoneNumber = localStorage.getItem('phoneNumber');
//   // const storedCountryCode = localStorage.getItem('countryCode');

//   const phoneNumber = statePhoneNumber || storedPhoneNumber;
//   // const countryCode = stateCountryCode || storedCountryCode;

//   const fullPhoneNumber = `${phoneNumber}`;

//   const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
//   const closeSidebar = () => setSidebarOpen(false);





//   const fetchUnreadNotifications = async () => {
//     try {
//       const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-unread-notifications`, {
//         params: { phoneNumber },
//       });
//       const unread = res.data.notifications || [];

//       setNotifications(unread);
//       setHasUnread(unread.length > 0);

//     } catch (error) {
//     }
//   };

//   useEffect(() => {
//     if (phoneNumber) {
//       fetchUnreadNotifications();
//     }
//   }, [phoneNumber]);

//   const handleBellClick = () => {
//     setHasClickedBell(true);
//     navigate('/notification');

//     // You can show the notifications dropdown or modal here
//   };


//   useEffect(() => {
//     if (phoneNumber ) {
//       localStorage.setItem('phoneNumber', phoneNumber);
//       // localStorage.setItem('countryCode', countryCode);
//     } else {
//     }
//   }, [phoneNumber]);

//   const handleLinkClick = (path) => {
//     navigate(path, { state: { phoneNumber: fullPhoneNumber } });
//     closeSidebar();
//   };
//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (
//         isSidebarOpen &&
//         sidebarRef.current &&
//         !sidebarRef.current.contains(event.target)
//       ) {
//         closeSidebar();
//       }
//     };

//     document.addEventListener('mousedown', handleOutsideClick);
//     return () => {
//       document.removeEventListener('mousedown', handleOutsideClick);
//     };
//   }, [isSidebarOpen]);







//   return (
// <div className="d-flex" style={{ fontFamily: "Inter, sans-serif" }}>
//   {/* Sidebar */}
//   <div
//     ref={sidebarRef}
//     className={`position-fixed bg-light border-end ${isSidebarOpen ? "d-block" : "d-none"}`}
//     style={{
//       width: "300px",
//       height: "auto", 
//       transition: "left 0.3s ease",
//       zIndex: 2000,
//       display: "flex",
//       flexDirection: "column",
//       overflow: "hidden", // Prevents children from exceeding
//     }}
//   >
//     <button
//       className="btn position-absolute top-0 end-0 m-0"
//       onClick={toggleSidebar}
//       aria-label="Close Sidebar"
//     >
//       <MdClose />
//     </button>

//     {/* Fixed Header */}
//     <div
//       style={{
//         background: "#4F4B7E",
//         flexShrink: 0, // Prevents header from shrinking
//         padding: "10px",
//       }}
//       className="d-flex align-items-center w-100"
//     >
//       <img
//         src={logo}
//         alt="Logo"
//         style={{ height: "80px", width: "80px" }}
//         className="mb-2 mb-md-0 rounded-4"
//       />
//       <div className="ms-md-3 ms-2">
//         <h6 style={{ color: "white" }}>Rent Pondy</h6>
//         <p style={{ color: "white", fontSize: "13px" }}>
// Find Your rental property-Rent your property, Fast.        </p>
//       </div>
//     </div>
//     <div className="row g-2 mt-1"
//      style={{background:"#ffffff", overflowY: "scroll", scrollbarWidth: "none" , width:"300px", height: "75vh", }}>
//     <ul className="nav flex-column pb-5 w-100 ">


//       {/* Phone number in sidebar */}
//       {phoneNumber && (
//         <li className="nav-item">
//           <a
//             className="nav-link"
//             style={getLinkStyle('phone')}
//             onMouseEnter={() => handleMouseEnter('phone')}
//             onMouseLeave={handleMouseLeave}
//             href="/pondicherry"
//             onClick={() => handleLinkClick("/pondicherry")}
//           >
//             <FaPhone className="me-2" style={{ color: '#4F4B7E' }} />
//             {fullPhoneNumber}
//           </a>
//         </li>
//       )}

//       {/* Sidebar links with hover effect */}
    
//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('my-profile')}
//           onMouseEnter={() => handleMouseEnter('my-profile')}
//           onMouseLeave={handleMouseLeave}
//           href={`/my-profile/${phoneNumber}`}
//           onClick={() => handleLinkClick(`/my-profile/${phoneNumber}`)}
//         >
//           <FaUserCircle className="me-2" style={{ color: '#4F4B7E' }} /> My Profile
//         </a>
//       </li>

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('my-property')}
//           onMouseEnter={() => handleMouseEnter('my-property')}
//           onMouseLeave={handleMouseLeave}
//           href="/my-property"
//           onClick={() => handleLinkClick("/my-property")}
//         >
//           <FaBuilding className="me-2" style={{ color: '#4F4B7E' }} /> My Property
//         </a>
//       </li>

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('my-plan')}
//           onMouseEnter={() => handleMouseEnter('my-plan')}
//           onMouseLeave={handleMouseLeave}
//           href={`/my-plan`}
//           onClick={() => handleLinkClick(`/my-plan`)}
//         >
//           <FaLightbulb className="me-2" style={{ color: '#4F4B7E' }} /> My Plan
//         </a>
//       </li>


//     <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('plans')}
//           onMouseEnter={() => handleMouseEnter('plans')}
//           onMouseLeave={handleMouseLeave}
//           href="/add-plan"
//           onClick={() => handleLinkClick("/add-plan")}
//         >
//           <FaRocket className="me-2" style={{ color: '#4F4B7E' }} /> Pricing Plans
//         </a>
//       </li> 

//   <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('buyer plans')}
//           onMouseEnter={() => handleMouseEnter('buyer plans')}
//           onMouseLeave={handleMouseLeave}
//           href="/my-buyer-plan"
//           onClick={() => handleLinkClick("/my-buyer-plan")}
//         >
//           <FaRocket className="me-2" style={{ color: '#4F4B7E' }} />My Tenant Assistant Plan
//         </a>
//       </li>


//  <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('owner menu')}
//           onMouseEnter={() => handleMouseEnter('owner menu')}
//           onMouseLeave={handleMouseLeave}
//           href="/owner-menu"
//           onClick={() => handleLinkClick("/owner-menu")}
//         >
//           <FaCogs className="me-2" style={{ color: '#4F4B7E' }} /> Owner Menu
//         </a>
//       </li> 

//   <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('buyer menu')}
//           onMouseEnter={() => handleMouseEnter('buyer menu')}
//           onMouseLeave={handleMouseLeave}
//           href="/buyer-menu"
//           onClick={() => handleLinkClick("/buyer-menu")}
//         >
//           <FaCogs className="me-2" style={{ color: '#4F4B7E' }} />  Tenant Menu
//         </a>
//       </li>


//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('more')}
//           onMouseEnter={() => handleMouseEnter('more')}
//           onMouseLeave={handleMouseLeave}
//           href="/more"
//           onClick={() => handleLinkClick("/more")}
//         >
//           <FaCogs className="me-2" style={{ color: '#4F4B7E' }} /> More
//         </a>
//       </li>

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('contactus')}
//           onMouseEnter={() => handleMouseEnter('contactus')}
//           onMouseLeave={handleMouseLeave}
//           href="/contactus"
//           onClick={() => handleLinkClick("/contactus")}
//         >
//           <FaPhone className="me-2" style={{ color: '#4F4B7E' }} /> Contact Us
//         </a>
//       </li>

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('about-us')}
//           onMouseEnter={() => handleMouseEnter('about-us')}
//           onMouseLeave={handleMouseLeave}
//           href="/about-mobile"
//           onClick={() => handleLinkClick("/about-mobile")}
//         >
//           <FaInfoCircle className="me-2" style={{ color: '#4F4B7E' }} /> About Us
//         </a>
//       </li>

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('refund-policy')}
//           onMouseEnter={() => handleMouseEnter('refund-policy')}
//           onMouseLeave={handleMouseLeave}
//           href="/refund-mobile"
//           onClick={() => handleLinkClick("/refund-mobile")}
//         >
//           <MdPolicy className="me-2" style={{ color: '#4F4B7E' }} /> Refund Policy
//         </a>
//       </li>

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('terms-conditions')}
//           onMouseEnter={() => handleMouseEnter('terms-conditions')}
//           onMouseLeave={handleMouseLeave}
//           href="/terms-conditions"
//           onClick={() => handleLinkClick("/terms-conditions")}
//         >
//           <HiDocumentText  className="me-2" style={{ color: '#4F4B7E' }} /> Terms And Conditions
//         </a>
//       </li>

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('shiping-delivery')}
//           onMouseEnter={() => handleMouseEnter('shiping-delivery')}
//           onMouseLeave={handleMouseLeave}
//           href="/shiping-delivery-app"
//           onClick={() => handleLinkClick("/shiping-delivery-app")}
//         >
//           <FaShippingFast  className="me-2" style={{ color: '#4F4B7E' }} />Shipping & Delivery
//         </a>
//       </li>

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('more-app')}
//           onMouseEnter={() => handleMouseEnter('more-app')}
//           onMouseLeave={handleMouseLeave}
//           href="https://play.google.com/store/apps/dev?id=5743868169001839900&hl=en"
//             target="_blank"
//   rel="noopener noreferrer"
//           // onClick={() => handleLinkClick("https://play.google.com/store/apps/dev?id=5743868169001839900&hl=en")}
//         >
//           <RiApps2AiFill className="me-2" style={{ color: '#4F4B7E' }} /> More App
//         </a>
//       </li>
// {/* <li className="nav-item">
//   <button
//     className="nav-link"
//     style={{
//       ...getLinkStyle('more-app'),
//       background: 'none',
//       border: 'none',
//       cursor: 'pointer',
//     }}
//     onMouseEnter={() => handleMouseEnter('more-app')}
//     onMouseLeave={handleMouseLeave}
//     onClick={() =>
//       window.open(
//         'https://play.google.com/store/apps/dev?id=5743868169001839900&hl=en',
//         '_system' // or '_blank' as fallback
//       )
//     }
//   >
//     <FaStar className="me-2" style={{ color: '#4F4B7E' }} /> More App
//   </button>
// </li> */}

//       <li className="nav-item">
//       <a
//   className="nav-link"
//   style={getLinkStyle('share-app')}
//   onMouseEnter={() => handleMouseEnter('share-app')}
//   onMouseLeave={handleMouseLeave}
//   href="https://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share"
//   target="_blank"
//   rel="noopener noreferrer"
//   // onClick={() => handleLinkClick("https://play.google.com/store/apps/dev?id=5743868169001839900&hl=en")}
// >
//   <FaShare className="me-2" style={{ color: '#4F4B7E' }} /> Share App
// </a>

//       </li>
// {/* <li className="nav-item">
//   <button
//     className="nav-link"
//     style={{
//       ...getLinkStyle('share-app'),
//       background: 'none',
//       border: 'none',
//       cursor: 'pointer',
//     }}
//     onMouseEnter={() => handleMouseEnter('share-app')}
//     onMouseLeave={handleMouseLeave}
//     onClick={() =>
//       window.open(
//         'https://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share',
//         '_system' // or '_blank' as fallback
//       )
//     }
//   >
//     <FaStar className="me-2" style={{ color: '#4F4B7E' }} /> Share App
//   </button>
// </li> */}

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('rate-app')}
//           onMouseEnter={() => handleMouseEnter('rate-app')}
//           onMouseLeave={handleMouseLeave}
//           href="https://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share"
//           target="_blank"
//   rel="noopener noreferrer"
//           // onClick={() => handleLinkClick("https://play.google.com/store/apps/details?id=com.deepseek.chat&hl=en#review")}
//         >
//           <FaStar className="me-2" style={{ color: '#4F4B7E' }} /> Rate App
//         </a>
//       </li>
// {/* <li className="nav-item">
//   <button
//     className="nav-link"
//     style={{
//       ...getLinkStyle('rate-app'),
//       background: 'none',
//       border: 'none',
//       cursor: 'pointer',
//     }}
//     onMouseEnter={() => handleMouseEnter('rate-app')}
//     onMouseLeave={handleMouseLeave}
//     onClick={() =>
//       window.open(
//         'https://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share',
//         '_system' // or '_blank' as fallback
//       )
//     }
//   >
//     <FaStar className="me-2" style={{ color: '#4F4B7E' }} /> Rate App
//   </button>
// </li> */}

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('business')}
//           onMouseEnter={() => handleMouseEnter('business')}
//           onMouseLeave={handleMouseLeave}
//           href="/business"
//           onClick={() => handleLinkClick("/business")}
//         >
//           <FaShieldAlt className="me-2" style={{ color: '#4F4B7E' }} /> Business Opportunity
//         </a>
//       </li>

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('our-support')}
//           onMouseEnter={() => handleMouseEnter('our-support')}
//           onMouseLeave={handleMouseLeave}
//           href="/our-support"
//           onClick={() => handleLinkClick("/our-support")}
//         >
//           <FaUsers className="me-2" style={{ color: '#4F4B7E' }} /> Our Support
//         </a>
//       </li>



// {/* <li className="nav-item">
//   <button
//     className="nav-link border-0 bg-transparent w-100 text-start p-0"
//     style={getLinkStyle('logout')}
//     onMouseEnter={() => handleMouseEnter('logout')}
//     onMouseLeave={handleMouseLeave}
//     onClick={handleLogout}
//   >
//     <BiSolidLogIn className="ms-3 me-2" style={{ color: '#4F4B7E' }} /> 
//     Logout
//   </button>
// </li> */}

//       <li className="nav-item">
//         <button
//           className="nav-link border-0 bg-transparent w-100 text-start p-0"
//           style={getLinkStyle('logout')}
//           onMouseEnter={() => handleMouseEnter('logout')}
//           onMouseLeave={handleMouseLeave}
//           onClick={() => setShowConfirm(true)} // show popup
//         >
//           <BiSolidLogIn className="ms-3 me-2" style={{ color: '#4F4B7E' }} />
//           Logout
//         </button>
//       </li>
//       {/* Confirmation Popup */}
//      {showConfirm && (
//   <div
//   style={{
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     // width: '100vw',
//     height: '100vh',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     zIndex: 3000,
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     pointerEvents: 'auto',
//                     minWidth: '280px',

//   }}
// >
//   <div
//     style={{
//       backgroundColor: '#fff',
//       padding: '20px',
//       borderRadius: '12px',
//         boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',

//       textAlign: 'center',
//     }}
//   >
//             <h5 className="text-center" style={{fontSize:"13px"}}>Are you sure you want to logout?</h5>
//       <div className="d-flex justify-content-between gap-3">
//               <button className="btn px-4" style={{background:"blue", color:"#fff"}} onClick={handleLogout}>Yes</button>
//               <button className="btn px-4" style={{background:"white", color:"blue",  boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',}} onClick={() => setShowConfirm(false)}>No</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </ul>
//     </div>

//       </div>

//       {/* Main Content */}
//       <div className="flex-grow-1">
//         {/* Navbar */}
//         <nav
//           className="navbar navbar-light bg-light d-flex align-items-center justify-content-between px-3"
//           style={{ width: '100%', height: '60px' }}
//         >
//           <button className="btn" onClick={toggleSidebar}>
//             ☰
//           </button>
//           <span className="navbar-brand mb-0 text-center mx-auto">Rent Pondy</span>
  

// <div style={{ position: "relative" }}>
//    <button onClick={handleRefresh} style={{ padding: "10px 20px", cursor: "pointer", color:"red", background:"none", border:"none" }}>
//        <MdOutlineRefresh size={24}/>
//       </button>
//       <button className="btn border-0" style={{ fontWeight: "bold" }} onClick={handleBellClick}>
//         <FaRegBell color="#4F4B7E" size={24} />
//       </button>

//       {/* Show red badge only if there are unread notifications AND user hasn’t clicked yet */}
//       {hasUnread && !hasClickedBell && (
//         <span
//           style={{
//             position: "absolute",
//             top: "4px",
//             right: "4px",
//             width: "10px",
//             height: "10px",
//             backgroundColor: "red",
//             borderRadius: "50%",
//             zIndex: 1,
//           }}
//         ></span>
//       )}
//     </div>


//         </nav>
//       </div>
//     </div>
//   );
// };

// export default SidebarApp;







