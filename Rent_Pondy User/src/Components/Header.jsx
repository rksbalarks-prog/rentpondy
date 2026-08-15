
// import React, { useState } from 'react';
// import { Container, Row, Col, Navbar, Nav, Button } from 'react-bootstrap';
// import { FaPhoneAlt, FaGlobe } from 'react-icons/fa';
// import ppclogo from "../Assets/rentpondylogo.png";
// import { Link } from 'react-router-dom';
// import { useNavigate } from "react-router-dom";
// import './Header.css'
// const Header = () => {
//   const [expand, updateExpanded] = useState(false);
//   const navigate = useNavigate();
//   const handleLoginPage = () => {
//     navigate('/login');
//   };
//   const [hovered, setHovered] = useState(false);
//   const [hovered2, setHovered2] = useState(false);

//   const [hoveredLink, setHoveredLink] = useState(null);
//   const [hoveredButton, setHoveredButton] = useState(null);

//   const buttonStyle = (id) => ({
//     backgroundColor: hoveredButton === id ? "#00AF8F" : "#5DB875",
//     color: hoveredButton === id ? "#ffffff" : "#B8DF5E", // Text color change
//     marginRight: "5px",
//     border: "none",
//     transition: "background-color 0.3s ease",
//     fontWeight: 600
//   });
// const linkStyle = (id) => ({
//   color: hoveredLink === id ? "#5DB875" : "#707070",
//   transition: "color 0.3s ease",
//   fontWeight: 600
  
// });
//   return (
//     <header>
     
//     <div className="container-fluid" style={{backgroundColor: "#5DB875"}}>
//   <div className="row">
//     <div className="col-12 col-sm-12 col-md-12 d-flex justify-content-between align-items-center pt-2 pb-2">
   
// <div className="row p-2 align-items-center">
//   {/* First phone block */}
//   <div className="col-auto d-flex align-items-center">
//     <p className="m-0 d-flex align-items-center" style={{ fontSize: "14px" }}>
//       <span className="need-help-text mr-1">Need Help?</span>
//       <FaPhoneAlt
//         className={`mx-1 ${hovered ? "phone-animate" : ""}`}
//         style={{
//           color: "#ffffff",
//           transition: "transform 0.3s ease-in-out"
//         }}
//       />
//       <a
//         href="tel:+9104132914409"
//         style={{
//           textDecoration: "none",
//           color: "#ffffff",
//           cursor: "pointer",
//           fontWeight: hovered ? "bold" : "normal",
//           transition: "font-weight 0.2s ease-in-out",
//           fontSize: "14px"
//         }}
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//       >
//         +91 0413-2914409
//       </a>
//     </p>
//   </div>

//   {/* Second phone block */}
//   <div className="col-auto d-flex align-items-center">
//     <p
//       className="m-0 d-flex align-items-center"
//       style={{ fontSize: "14px" }}
//       onMouseEnter={() => setHovered2(true)}
//       onMouseLeave={() => setHovered2(false)}
//     >
//       <FaPhoneAlt
//         className={`mx-1 ${hovered2 ? "phone-shake phone-pulse" : ""}`}
//         style={{
//           color: "#ffffff",
//           transition: "transform 0.3s ease-in-out"
//         }}
//       />
//       <a
//         href="tel:+919150524409"
//         style={{
//           textDecoration: "none",
//           color: "#ffffff",
//           cursor: "pointer",
//           fontWeight: hovered2 ? "bold" : "normal",
//           transition: "font-weight 0.2s ease-in-out",
//           fontSize: "14px"
//         }}
//       >
//         +91 9150524409
//       </a>
//     </p>
//   </div>

//   <style>
//     {`
//       .phone-animate {
//         animation: shake 0.3s ease-in-out infinite alternate;
//       }
//       .phone-pulse {
//         animation: pulse 0.3s ease-in-out infinite alternate;
//       }

//       @keyframes shake {
//         0% { transform: rotate(0); }
//         25% { transform: rotate(-10deg); }
//         50% { transform: rotate(10deg); }
//         75% { transform: rotate(-5deg); }
//         100% { transform: rotate(5deg); }
//       }

//       @keyframes pulse {
//         0% { transform: scale(1); }
//         50% { transform: scale(1.1); }
//         100% { transform: scale(1); }
//       }

//       @media (max-width: 576px) {
//         .text-left p {
//           font-size: 12px;
//         }
//         .need-help-text {
//           display: none;
//         }
//       }
//     `}
//   </style>
// </div>


//       <div className="text-right">
//         <Button size="sm" className="me-2 weblogin" onClick={handleLoginPage}>Login</Button>
//       </div>
//     </div>
//   </div>
// </div>

    
//   <Navbar style={{ backgroundColor: "#ffffff" }} expand="lg">
//   <Container fluid className="ps-3 pe-1">
//     {/* Logo and Title on the left */}
//     <div className="d-flex align-items-center">
//       <Navbar.Brand href="/" className="text-danger">
//         <img
//           src={ppclogo}
//           alt="Logo"
//           style={{ height: '40px' }}
//           className="rounded-3"
//         />
//       </Navbar.Brand>
//       <h3 className="m-0 fs-3 fs-sm-4 fs-md-5 fs-lg-6" style={{ color: "#5DB875" }}>RENTAL PROPERTY</h3>
//     </div>

//     {/* Navbar.Toggle on the right side */}
//     <Navbar.Toggle
//       aria-controls="responsive-navbar-nav"
//       className="ms-auto" // This moves it to the right
//       onClick={() => {
//         updateExpanded(expand ? false : "expanded");
//       }}
//     >
//       <span></span>
//       <span></span>
//       <span></span>
//     </Navbar.Toggle>

//     <Navbar.Collapse id="basic-navbar-nav">
//       <div className="ms-auto d-flex align-items-center">
//         <Nav className="me-3 d-flex flex-column flex-lg-row w-100">
//           {[{ id: 1, name: "HOME", href: "/" },
//             { id: 2, name: "My Account", href: "/login" },
//             { id: 3, name: "All Property", href: "/login" },
//             { id: 4, name: "Search", href: "/login" },
//             { id: 5, name: "Download", href: "https://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share" },
//             { id: 6, name: "Pondy App", href: "https://play.google.com/store/apps/dev?id=5743868169001839900&hl=en_IN" }].map((item) => (
//               <Nav.Link
//                 key={item.id}
//                 href={item.href}
//                 style={linkStyle(item.id)}
//                 target={item.href.startsWith("http") ? "_blank" : "_self"}
//                 rel="noopener noreferrer"

//                 onMouseEnter={() => setHoveredLink(item.id)}
//                 onMouseLeave={() => setHoveredLink(null)}
//               >
//                 {item.name}
//               </Nav.Link>
//             ))}
//           <div className="d-flex flex-column flex-lg-row">
//             <Link
//               to="/login"
//               className="mb-2 mb-lg-0"
//               onMouseEnter={() => setHoveredButton(1)}
//               onMouseLeave={() => setHoveredButton(null)}
//             >
//               <Button style={buttonStyle(1)}>Add Property</Button>
//             </Link>

//             <Link
//               to="/login"
//               onMouseEnter={() => setHoveredButton(2)}
//               onMouseLeave={() => setHoveredButton(null)}
//             >
//               <Button style={buttonStyle(2)}>TENANT Assistance</Button>
//             </Link>
//           </div>
//         </Nav>
//       </div>
//     </Navbar.Collapse>
//   </Container>
// </Navbar>


//     </header>
//   );
// };

// export default Header;

import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { FaPhoneAlt, FaHeadset } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ppclogo from "../Assets/rentpondylogo.png";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Trigger download animation every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsDownloading(true);
      setDownloadProgress(0);

      // Simulate download progress
      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
              setIsDownloading(false);
              setDownloadProgress(0);
            }, 500);
            return 100;
          }
          return prev + Math.random() * 30;
        });
      }, 200);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className={`lux-navbar ${scrolled ? "lux-navbar-scrolled" : ""}`}
    >
      <style>{`
        .download-btn-wrapper {
          position: relative;
          display: inline-block;
        }

        .download-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #059669 0%, #10B981 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          position: relative;
          overflow: visible;
          margin-bottom: 20px;
        }

        .download-btn:hover:not(.downloading) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(5, 150, 105, 0.3);
        }

        .download-btn.downloading {
          animation: floatingAnimation 2s ease-in-out infinite;
        }

        .download-icon {
          font-size: 16px;
          transition: transform 0.3s ease;
        }

        .download-btn.downloading .download-icon {
          animation: rotateIcon 1s linear infinite;
        }

        @keyframes rotateIcon {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes floatingAnimation {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        /* Expanding ring animation */
        .download-btn.downloading::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border: 2px solid rgba(16, 185, 129, 0.6);
          border-radius: 8px;
          transform: translate(-50%, -50%);
          animation: expandingRing 1.5s ease-out infinite;
          pointer-events: none;
        }

        @keyframes expandingRing {
          0% {
            width: 100%;
            height: 100%;
            opacity: 1;
          }
          100% {
            width: 140%;
            height: 140%;
            opacity: 0;
          }
        }

        /* Glow effect with color shift */
        .download-btn.downloading {
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.5),
                      0 0 50px rgba(16, 185, 129, 0.3),
                      inset 0 0 20px rgba(16, 185, 129, 0.2);
          animation: floatingAnimation 2s ease-in-out infinite, 
                     colorBreathing 3s ease-in-out infinite;
        }

        @keyframes colorBreathing {
          0%, 100% {
            background: linear-gradient(135deg, #059669 0%, #10B981 100%);
          }
          50% {
            background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
          }
        }

        /* Bottom glow effect */
        .download-glow-bottom {
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 120%;
          height: 30px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(8px);
          opacity: 0;
        }

        .download-btn.downloading ~ .download-glow-bottom {
          animation: glowPulse 2s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% {
            background: linear-gradient(90deg, 
              rgba(16, 185, 129, 0) 0%,
              rgba(52, 211, 153, 0.6) 20%,
              rgba(34, 197, 194, 0.8) 50%,
              rgba(52, 211, 153, 0.6) 80%,
              rgba(16, 185, 129, 0) 100%
            );
            opacity: 0;
            bottom: -20px;
          }
          50% {
            background: linear-gradient(90deg, 
              rgba(34, 197, 194, 0) 0%,
              rgba(6, 182, 212, 0.8) 20%,
              rgba(34, 211, 238, 1) 50%,
              rgba(6, 182, 212, 0.8) 80%,
              rgba(34, 197, 194, 0) 100%
            );
            opacity: 1;
            bottom: -10px;
          }
        }

        .download-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 23, 42, 0.95);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          margin-bottom: 8px;
          z-index: 1000;
          opacity: 0;
          transition: all 0.3s ease;
          pointer-events: none;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .download-btn.downloading .download-tooltip {
          opacity: 1;
        }

        .download-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-top-color: rgba(15, 23, 42, 0.95);
        }

        .loading-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #34D399;
          border-radius: 50%;
          animation: spinnerRotate 0.8s linear infinite;
        }

        @keyframes spinnerRotate {
          to {
            transform: rotate(360deg);
          }
        }

        .lux-dropdown .download-btn-wrapper {
          margin: 0 8px;
        }
      `}</style>

      <Container fluid>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" className="lux-brand">
          <img src={ppclogo} alt="logo" className="lux-logo" />
          <span className="lux-brand-name">RENT PONDY</span>
        </Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse className="justify-content-end">
          <Nav className="lux-nav-links align-items-center">

            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/login">Properties</Nav.Link>
            <Nav.Link as={Link} to="/login">Search</Nav.Link>

            {/* Download Button with Animation */}
            <div className="download-btn-wrapper">
              <button
                className={`download-btn ${isDownloading ? 'downloading' : ''}`}
                onClick={() => window.open(
                  'https://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share',
                  '_blank'
                )}
              >
                <div className="download-tooltip">
                  {isDownloading ? (
                    <>
                      <span className="loading-spinner"></span>
                      <span> {Math.round(downloadProgress)}%</span>
                    </>
                  ) : 'Ready to Download'}
                </div>
                <span className="download-icon"></span>
                <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
              </button>
              <div className="download-glow-bottom"></div>
            </div>

            {/* Contact Dropdown */}
            <NavDropdown
              title={
                <span className="lux-contact">
                  <FaHeadset className="me-1" />
                  Contact
                </span>
              }
              id="contact-dropdown"
              className="lux-dropdown"
            >
              <NavDropdown.Item href="tel:+9104132914409">
                <FaPhoneAlt className="me-2 text-success" />
                +91 0413-2914409
              </NavDropdown.Item>

              <NavDropdown.Item href="tel:+919150524409">
                <FaPhoneAlt className="me-2 text-success" />
                +91 9150524409
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item as={Link} to="/support">
                Need Help?
              </NavDropdown.Item>
            </NavDropdown>

            <div className="lux-buttons">
              <Button
                className="lux-primary-btn"
                onClick={() => navigate("/login")}
              >
                Add Property
              </Button>

              <Button
                className="lux-outline-btn"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </div>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
