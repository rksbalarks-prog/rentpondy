

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import VideoPlayer from './VideoPlayer';

// Cache bust - v1.0.1
export default function BuyerPlan({ phoneNumber: propPhoneNumber, Ra_Id: propRa_Id, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [hoverIndex, setHoverIndex] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [cardData, setCardData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState(null);

  // // Get phoneNumber and baId from props, location, or localStorage
  // const phoneNumber = propPhoneNumber || location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  // const baId = propBaId || location.state?.baId || localStorage.getItem("baId") || "";

  const Ra_Id = propRa_Id || location.state?.Ra_Id || "";
const phoneNumber = propPhoneNumber || location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";


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
  // Save fallback to localStorage
  useEffect(() => {
    if (phoneNumber) localStorage.setItem("phoneNumber", phoneNumber);
    if (Ra_Id) localStorage.setItem("Ra_Id", Ra_Id);
  }, [phoneNumber, Ra_Id]);

  // Record views for analytics
  useEffect(() => {
    if (phoneNumber) {
      axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
        phoneNumber,
        viewedFile: "Pricing Plans",
        viewTime: new Date().toISOString(),
      }).catch(() => {});
    }
  }, [phoneNumber]);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch active plans
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/buyer-plans-active`)
      .then((res) => {
        if (res.data.status === "success") {
          setCardData(res.data.plans || []);
        }
      })
      .catch(() => setCardData([]));
  }, []);

  const confirmPlanSelection = (card, index) => {
    setSelectedPlan({ card, index });
    setShowPopup(true);
  };

  const handleConfirmPlan = () => {
    if (!selectedPlan) return;
    const { card, index } = selectedPlan;

    if (!phoneNumber || !Ra_Id) {
      setMessage({ text: "Missing phone number or Tenant assistance ID (Ra_Id)", type: "error" });
      setShowPopup(false);
      return;
    }

    setLoadingIndex(index);
    setShowPopup(false);

    // Navigate to PayU form with required data
    navigate("/payu-form-buyer", {
      state: {
        phoneNumber,
        Ra_Id,
        planName: card.planName,
        planId: card._id,
        amount: card.planAmount,
      },
    });
  };

  const handleBackNavigation = () => {
    navigate(-1);
  };


  return (
    <div className="container d-flex align-items-center justify-content-center p-0">
      <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="row g-2 w-100">
          {/* Header */}
          <div className="d-flex align-items-center w-100 p-2" style={{ background: "#EFEFEF" }}>
            <button
              onClick={handleBackNavigation}
              className="pe-5"
              style={{
                backgroundColor: '#f0f0f0',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.3s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e8e8e8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }}
            >
              <FaChevronLeft style={{ color: '#30747F' }} />
            </button>
            <h3 className="m-0" style={{ fontSize: "16px", fontWeight: '600' }}>Upgrade Your Plan</h3>
          </div>

          {/* Title */}
          <h3 className="m-0 ms-3 mt-2" style={{ fontSize: "24px", fontWeight: '700', color: '#2a2a2a' }}>Upgrade Membership</h3>

          {/* Video Player */}
          <div className="mt-3 d-flex justify-content-center px-2 w-100">
            <VideoPlayer />
          </div>

          {/* Message */}
          {message && (
            <p className="text-bold mt-2 w-100" style={{ color: message.type === "success" ? "green" : "red", textAlign: "center", padding: '0 12px' }}>
              {message.text}
            </p>
          )}

          {/* Description */}
          <div className="text-center mb-3 px-3 w-100">
            <p className="lead mb-1 pt-2" style={{ fontSize: "15px", color: '#666', fontWeight: '500', lineHeight: '1.6' }}>
              All the plans in our Rent Pondy have validity dates for your property to be live for promotion purpose.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="row justify-content-center w-100">
            {cardData.length === 0 ? (
              <p className="text-center">No active plans available.</p>
            ) : (
              cardData.map((card, index) => {
                const gradients = [
                  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                ];
                return (
                  <div key={card._id || index} className="col-12 d-flex justify-content-center mb-4 p-0">
                    <div
                      className="card shadow-lg rounded-4 border-0 pricing-card"
                      style={{
                        width: '72%',
                        background: gradients[index % gradients.length],
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        boxShadow: hoverIndex === index
                          ? '0 25px 50px rgba(0, 0, 0, 0.35)'
                          : '0 10px 30px rgba(0, 0, 0, 0.15)',
                        transform: hoverIndex === index ? 'translateY(-12px) scale(1.03)' : 'translateY(0) scale(1)',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={() => setHoverIndex(index)}
                      onMouseLeave={() => setHoverIndex(null)}
                    >
                      {/* Animated top gradient line */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '5px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
                        opacity: hoverIndex === index ? 1 : 0.5,
                        transition: 'opacity 0.3s ease'
                      }} />

                      <div className="card-body" style={{
                        background: 'rgba(255, 255, 255, 0.97)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        margin: '12px',
                        position: 'relative',
                        zIndex: 2,
                        padding: '24px'
                      }}>
                        {/* Premium Badge */}
                        {index === 1 && (
                          <div style={{
                            position: 'absolute',
                            top: '-14px',
                            right: '24px',
                            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                            color: '#fff',
                            padding: '8px 18px',
                            borderRadius: '25px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            boxShadow: '0 6px 20px rgba(255, 165, 0, 0.5)',
                            animation: 'floating 3s ease-in-out infinite'
                          }}>
                            ⭐ MOST POPULAR
                          </div>
                        )}

                        {/* Plan Name */}
                        <h4 className="card-title text-start mt-1" style={{
                          color: '#4F4B7E',
                          fontWeight: 'bold',
                          fontSize: '28px',
                          marginBottom: '8px'
                        }}>
                          {card.planName}
                        </h4>

                        {/* Service Type */}
                        <p className="text-start" style={{
                          fontSize: "15px",
                          color: '#888',
                          marginBottom: '16px',
                          fontWeight: '500'
                        }}>
                          {card.serviceType || 'Premium Service'}
                        </p>

                        {/* Price Section */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          marginBottom: '8px',
                          gap: '8px'
                        }}>
                          <h2 className="text-start m-0" style={{
                            fontSize: '2.5rem',
                            background: 'linear-gradient(135deg, #FF6B6B, #f5576c)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold'
                          }}>
                            ₹{card.planAmount}
                          </h2>
                          <span style={{
                            fontSize: '14px',
                            color: '#999',
                            fontWeight: '500',
                            paddingBottom: '8px'
                          }}>
                            per plan
                          </span>
                        </div>

                        {/* Validity Info */}
                        <p className="text-start" style={{
                          fontSize: '14px',
                          color: '#666',
                          marginBottom: '18px',
                          fontWeight: '500',
                          letterSpacing: '0.3px'
                        }}>
                          ✅ Valid for {card.planValidity} Days
                        </p>

                        {/* Featured Ads Section */}
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(245, 87, 108, 0.08))',
                          padding: '14px',
                          borderRadius: '14px',
                          marginBottom: '20px',
                          border: '1px solid rgba(102, 126, 234, 0.15)',
                          transition: 'all 0.3s ease',
                          transform: hoverIndex === index ? 'scale(1.02)' : 'scale(1)'
                        }}>
                          <h5 className="m-0 text-start" style={{
                            fontSize: '15px',
                            color: '#4F4B7E',
                            fontWeight: '700',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            ✨ Features
                          </h5>
                          <p className="text-start m-0" style={{
                            color: '#555',
                            fontSize: '14px',
                            fontWeight: '500',
                            lineHeight: '1.5'
                          }}>
                            • {card.numberOfAssistants} Assistant{card.numberOfAssistants > 1 ? 's' : ''} Included
                          </p>
                          <p className="text-start m-0 mt-2" style={{
                            fontSize: '14px',
                            color: '#FF6B6B',
                            fontWeight: '700',
                            letterSpacing: '0.5px'
                          }}>
                            🎯 Premium Support Included
                          </p>
                        </div>

                        {/* Call to Action Button */}
                        <div className="d-flex justify-content-center">
                          <button
                            className="pay-button btn pt-3 pb-3 ps-5 pe-5 rounded-pill"
                            style={{
                              background: 'linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)',
                              color: '#fff',
                              fontSize: "16px",
                              fontWeight: '700',
                              border: 'none',
                              boxShadow: hoverIndex === index && loadingIndex !== index
                                ? '0 15px 35px rgba(79, 75, 126, 0.6)'
                                : '0 8px 20px rgba(79, 75, 126, 0.4)',
                              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              cursor: loadingIndex === index ? 'not-allowed' : 'pointer',
                              opacity: loadingIndex === index ? 0.8 : 1,
                              transform: hoverIndex === index && loadingIndex !== index ? 'scale(1.08)' : 'scale(1)',
                              letterSpacing: '0.5px',
                              minWidth: '200px',
                              width: '100%'
                            }}
                            onClick={() => confirmPlanSelection(card, index)}
                            disabled={loadingIndex === index}
                          >
                            {loadingIndex === index ? '⏳ Processing...' : '🚀 PAY NOW'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Confirmation Modal */}
          <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
            <Modal.Body className="text-center" style={{ padding: '30px' }}>
              <h5 style={{ marginBottom: '16px', color: '#2a2a2a', fontWeight: '600' }}>
                Confirm Plan Selection
              </h5>
              <p style={{ color: '#666', marginBottom: '24px', fontSize: '15px' }}>
                Are you sure you want to select this plan?
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Button
                  style={{
                    background: "linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)",
                    fontSize: "14px",
                    border: "none",
                    fontWeight: '600',
                    padding: '8px 24px'
                  }}
                  onClick={handleConfirmPlan}
                >
                  Yes, Confirm
                </Button>
                <Button
                  style={{
                    background: "#E8E8E8",
                    fontSize: "14px",
                    border: "none",
                    color: '#666',
                    fontWeight: '600',
                    padding: '8px 24px'
                  }}
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </Button>
              </div>
            </Modal.Body>
          </Modal>

          {/* CSS Animations */}
          <style>{`
            @keyframes floating {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            
            .pricing-card {
              cursor: pointer;
            }
            
            .pay-button {
              position: relative;
              overflow: hidden;
            }
            
            .pay-button::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: rgba(255, 255, 255, 0.2);
              transition: left 0.5s ease;
            }
            
            .pay-button:hover::before {
              left: 100%;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}












// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Button, Modal } from 'react-bootstrap';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';
// import hom from "../Assets/addcarimg.png";
// import { FaArrowLeft } from 'react-icons/fa';

// export default function BuyerPlan({ phoneNumber: propPhoneNumber, baId: propBaId, onClose }) {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [hoverIndex, setHoverIndex] = useState(null);
//   const [loadingIndex, setLoadingIndex] = useState(null);
//   const [cardData, setCardData] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [message, setMessage] = useState(null);

//   // // Get phoneNumber and baId from props, location, or localStorage
//   // const phoneNumber = propPhoneNumber || location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
//   // const baId = propBaId || location.state?.baId || localStorage.getItem("baId") || "";

//   const baId = propBaId || location.state?.baId || "";
// const phoneNumber = propPhoneNumber || location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";


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
//   // Save fallback to localStorage
//   useEffect(() => {
//     if (phoneNumber) localStorage.setItem("phoneNumber", phoneNumber);
//     if (baId) localStorage.setItem("baId", baId);
//   }, [phoneNumber, baId]);

//   // Record views for analytics
//   useEffect(() => {
//     if (phoneNumber) {
//       axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
//         phoneNumber,
//         viewedFile: "Pricing Plans",
//         viewTime: new Date().toISOString(),
//       }).catch(() => {});
//     }
//   }, [phoneNumber]);

//   // Clear message after 5 seconds
//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => setMessage(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   // Fetch active plans
//   useEffect(() => {
//     axios.get(`${process.env.REACT_APP_API_URL}/buyer-plans-active`)
//       .then((res) => {
//         if (res.data.status === "success") {
//           setCardData(res.data.plans || []);
//         }
//       })
//       .catch(() => setCardData([]));
//   }, []);

//   const confirmPlanSelection = (card, index) => {
//     setSelectedPlan({ card, index });
//     setShowPopup(true);
//   };

//   const handleConfirmPlan = () => {
//     if (!selectedPlan) return;
//     const { card, index } = selectedPlan;

//     if (!phoneNumber || !baId) {
//       setMessage({ text: "Missing phone number or buyer assistance ID (baId)", type: "error" });
//       setShowPopup(false);
//       return;
//     }

//     setLoadingIndex(index);
//     setShowPopup(false);

//     // Navigate to PayU form with required data
//     navigate("/payu-form-buyer", {
//       state: {
//         phoneNumber,
//         baId,
//         planName: card.planName,
//         planId: card._id,
//         amount: card.planAmount,
//       },
//     });
//   };


//   return (
//     <div className="container d-flex align-items-center justify-content-center p-0">
//       <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', width: '100%' }}>
//       <div className="d-flex align-items-center justify-content-start w-100" 
//          style={{
//         background: "#EFEFEF",
//         position: "sticky",
//         top: 0,
//         zIndex: 1000,
//         opacity: isScrolling ? 0 : 1,
//         pointerEvents: isScrolling ? "none" : "auto",
//         transition: "opacity 0.3s ease-in-out",
//       }}>
//        <button
//             onClick={() => navigate(-1)}
//             className="pe-5"
//             style={{
//               backgroundColor: '#f0f0f0',
//               border: 'none',
//               padding: '10px 20px',
//               cursor: 'pointer',
//               transition: 'all 0.3s ease-in-out',
//               display: 'flex',
//               alignItems: 'center',
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor = '#f0f4f5'; // Change background
//               e.currentTarget.querySelector('svg').style.color = '#00B987'; // Change icon color
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor = '#f0f0f0';
//               e.currentTarget.querySelector('svg').style.color = '#4F4B7E';
//             }}
//           >
//             <FaArrowLeft style={{ color: '#4F4B7E', transition: 'color 0.3s ease-in-out' , background:"transparent"}} />
//       </button>          <h3 className="m-0 " style={{ fontSize: "20px" }}>Upgrade Buyer Membership</h3>
//               </div>
//         <div className="row g-2 w-100">
//           <img src={hom} alt="pricing" className="w-100 mt-2 p-0" />

//           {message && (
//             <p
//               className="text-bold mt-2"
//               style={{ color: message.type === "success" ? "green" : "red", textAlign: "center" }}
//             >
//               {message.text}
//             </p>
//           )}

//           <div className="text-center m-0">
//             <p className="lead mb-1 pt-3" style={{ fontSize: "16px" }}>Start being a celebrity with our</p>
//             <p className="lead" style={{ fontSize: "16px" }}>premium subscription plans</p>
//           </div>

//           <div className="row justify-content-center">
//             {cardData.length === 0 ? (
//               <p className="text-center">No active plans available.</p>
//             ) : (
//               cardData.map((card, index) => (
//                 <div key={card._id || index} className="col-12 d-flex justify-content-center mb-4 p-0">
//                   <div
//                     className="card rounded-3 border-0"
//                     style={{
//                       width: '72%',
//                       backgroundColor: hoverIndex === index ? '#43BFFF' : '#A9D0FF',
//                       transition: 'background-color 0.3s ease',
//                       cursor: 'pointer',
//                       boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',
//                     }}
//                     onMouseEnter={() => setHoverIndex(index)}
//                     onMouseLeave={() => setHoverIndex(null)}
//                   >
//                     <div className="card-body">
//                       <h4 className="card-title text-start text-white"><strong>{card.planName}</strong></h4>
//                       <p className="text-muted text-start" style={{ fontSize: "19px" }}>Service Type: {card.serviceType}</p>
//                       <p className="text-muted text-start" style={{ fontSize: "19px" }}>Includes {card.numberOfAssistants} Assistant{card.numberOfAssistants > 1 ? 's' : ''}</p>
//                       <h3 className="text-start text-danger" style={{ fontSize: '1.5rem' }}>₹ {card.planAmount}</h3>
//                       <p className="text-start text-white mb-4" style={{ fontSize: '14px' }}>
//                         Valid for {card.planValidity} Days
//                       </p>
//                       <h3 className="mb-2 text-start text-dark" style={{ fontSize: '20px' }}>Plan Status</h3>
//                       <p className="text-muted text-start">{card.status}</p>
//                       <h3 className="display-4 mb-4 text-start text-white" style={{ fontSize: '16px' }}>
//                         Created: {new Date(card.createDate).toLocaleDateString()}
//                       </h3>

//                       <div className="d-flex justify-content-center">
//                         <button
//                           className="btn pt-1 pb-1 ps-3 pe-3 rounded-2"
//                           style={{
//                           backgroundColor: hoverIndex === index ? '#ffffff' : '#4F4B7E',
//                           // background: '#4F4B7E',
//                           color: hoverIndex === index ? '#4F4B7E' : '#fff',
//                           //  color: '#fff', 
//                            fontSize: "14px" }}
//                           onClick={() => confirmPlanSelection(card, index)}
//                           disabled={loadingIndex === index}
//                         >
//                           {loadingIndex === index ? 'Posting...' : 'Pay Now'}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Confirmation Modal */}
//           <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
//             <Modal.Body className="text-center">
//               <p>Are you sure you want to select this plan?</p>
//               <Button
//                 style={{ background: "#4F4B7E", fontSize: "13px", border: "none" }}
//                 onClick={handleConfirmPlan}
//               >
//                 Yes
//               </Button>
//               <Button
//                 className="ms-3"
//                 style={{ background: "#FF0000", fontSize: "13px", border: "none" }}
//                 onClick={() => setShowPopup(false)}
//               >
//                 No
//               </Button>
//             </Modal.Body>
//           </Modal>
//         </div>
//       </div>
//     </div>
//   );
// }
