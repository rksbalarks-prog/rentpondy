







// import React, { useState, useEffect } from 'react'; 
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Button, Modal } from 'react-bootstrap';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';
// import hom from "../Assets/addcarimg.png";
// import { FaArrowLeft } from 'react-icons/fa';

// export default function AddPricingPlans({ phoneNumber: propPhoneNumber, rentId: proprentId, onClose }) {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [hoverIndex, setHoverIndex] = useState(null);
//   const [loadingIndex, setLoadingIndex] = useState(null);
//   const [cardData, setCardData] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [message, setMessage] = useState(null);

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
//   // Derive phoneNumber and rentId from props, location or localStorage
//   const phoneNumber = propPhoneNumber || location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
//   const rentId = proprentId || location.state?.rentId || "";

//   useEffect(() => {
//     if (phoneNumber) {
//       axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
//         phoneNumber,
//         viewedFile: "Pricing Plans",
//         viewTime: new Date().toISOString(),
//       }).catch(() => {});
//     }
//   }, [phoneNumber]);

//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => setMessage(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   useEffect(() => {
//     fetchActivePlans();
//   }, []);

//   // Fetch plans and inject rentId into each plan object
//   const fetchActivePlans = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/active-plans`);
//       // Add rentId manually into each plan to avoid undefined
//       const plansWithrentId = response.data.map(plan => ({
//         ...plan,
//         rentId: rentId,
//       }));
//       setCardData(plansWithrentId);
//     } catch (err) {
//       setMessage({ text: "Failed to load plans", type: "error" });
//     }
//   };

//   const confirmPlanSelection = (card, index) => {
//     setSelectedPlan({ card, index });
//     setShowPopup(true);
//   };



// const handleConfirmPlan = async () => {
//   if (!selectedPlan) return;
//   const { card, index } = selectedPlan;

//   const rentIdNum = Number(card.rentId);
//   if (!phoneNumber || isNaN(rentIdNum)) {
//     setMessage({ text: "Missing or invalid phone number or rentId", type: "error" });
//     return;
//   }

//   setLoadingIndex(index);
//   setShowPopup(false);

//   // Navigate to PayUForm and pass data
//   navigate("/payu-form", {
//     state: {
//       phoneNumber,
//       rentId: rentIdNum,
//       planName: card.name,
//       planId: card._id,
//     amount: card.price  // âœ… Pass price as amount
//     }
//   });
// };

//   return (
//     <div className="container d-flex align-items-center justify-content-center p-0">
//       <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', width: '100%' }}>
              
//         <div className="row g-2 w-100">
//               <div className="d-flex align-items-center"
//                   style={{
//         background: "#EFEFEF",
//         position: "sticky",
//         top: 0,
//         zIndex: 1000,
//         opacity: isScrolling ? 0 : 1,
//         pointerEvents: isScrolling ? "none" : "auto",
//         transition: "opacity 0.3s ease-in-out",
//       }}>
//             <button
//               onClick={() => navigate(-1)}
//               style={{
//                 backgroundColor: '#f0f0f0',
//                 border: 'none',
//                 padding: '10px 20px',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.backgroundColor = '#f0f4f5';
//                 e.currentTarget.querySelector('svg').style.color = '#00B987';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = '#f0f0f0';
//                 e.currentTarget.querySelector('svg').style.color = '#4F4B7E';
//               }}
//             >
//               <FaArrowLeft style={{ color: '#4F4B7E' }} />
//             </button>
//             <h3 className="ms-3" style={{ fontSize: "20px" }}>Add Pricing Plans</h3>
//           </div>

//           <img src={hom} alt="pricing" className="w-100 mt-2" />

//           {message && (
//             <p className="text-bold mt-2" style={{ color: message.type === "success" ? "green" : "red", textAlign: "center" }}>
//               {message.text}
//             </p>
//           )}

//           <div className="text-center mb-3">
//             <p className="lead mb-1 pt-3" style={{ fontSize: "16px" }}>Start being a celebrity with our</p>
//             <p className="lead" style={{ fontSize: "16px" }}>premium subscription plans</p>
//           </div>

//           <div className="row justify-content-center">
//             {cardData.map((card, index) => (
//               <div key={index} className="col-12 d-flex justify-content-center mb-4 p-0">
//                 <div
//                   className="card shadow-lg rounded-3 border-0"
//                   style={{
//                     width: '72%',
//                     backgroundColor: '#ADD9E6',
//                     transition: 'background-color 0.3s ease'
//                   }}
//                   onMouseEnter={() => setHoverIndex(index)}
//                   onMouseLeave={() => setHoverIndex(null)}
//                 >
//                   <div className="card-body">
//                     <h4 className="card-title text-start text-white"><strong>{card.name}</strong></h4>
//                     <p className="text-muted text-start" style={{ fontSize: "19px" }}>{card.packageType}</p>
//                     {/* <p className="text-muted text-start" style={{ fontSize: "19px" }}>UNLIMITED Property Leads</p> */}
//                     <h3 className="text-start text-danger" style={{ fontSize: '1.5rem' }}>â‚¹ {card.price}</h3>
//                     <p className="text-start text-white mb-4" style={{ fontSize: '14px' }}>
//                       /{card.durationDays} Days / {card.numOfCars} Car{card.numOfCars > 1 ? 's' : ''}
//                     </p>
//                     <h3 className="mb-2 text-start text-dark" style={{ fontSize: '20px' }}> Featured Ads</h3>
//                     <p className="text-muted text-start">{card.description}</p>
//                     <h3 className="display-4 mb-4 text-start text-white" style={{ fontSize: '16px' }}>{card.featuredAds} FEATURED ADS</h3>
//                     <div className="d-flex justify-content-center">
//                       <button
//                         className="btn pt-1 pb-1 ps-3 pe-3 rounded-2"
//                         style={{ background: '#4F4B7E', color: '#fff', fontSize: "14px" }}
//                         onClick={() => confirmPlanSelection(card, index)}
//                         disabled={loadingIndex === index}
//                       >
//                         {loadingIndex === index ? 'Posting...' : 'Pay Now'}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Confirmation Modal */}
//           <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
//             <Modal.Body className="text-center">
//               <p>Are you sure you want to select this plan?</p>
//               <Button style={{ background: "#4F4B7E", fontSize: "13px", border: "none" }} onClick={handleConfirmPlan}>Yes</Button>
//               <Button className="ms-3" style={{ background: "#FF0000", fontSize: "13px", border: "none" }} onClick={() => setShowPopup(false)}>No</Button>
//             </Modal.Body>
//           </Modal>
//         </div>
//       </div>
//     </div>
//   );
// }





















import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChevronLeft } from 'react-icons/fa';
import { getActiveBase, baseToPath } from '../utils/cityBase';
import VideoPlayer from './VideoPlayer';


export default function AddPricingPlans({ phoneNumber: propPhoneNumber, rentId: proprentId, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoverIndex, setHoverIndex] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [cardData, setCardData] = useState([]);
    const [cardBuyerData, setBuyerCardData] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState(null);

  // Derive phoneNumber and rentId from props, location or localStorage
  const phoneNumber = propPhoneNumber || location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const rentId = proprentId || location.state?.rentId || "";
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
  useEffect(() => {
    if (phoneNumber) {
      axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
        phoneNumber,
        viewedFile: "Pricing Plans",
        viewTime: new Date().toISOString(),
      }).catch(() => {});
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);


// Fetch buyer active plans from API
const fetchBuyerActivePlans = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/buyer-plans-active`);
    if (response.data.status === "success") {
      const plans = response.data.plans || [];
      // Add rentId manually into each plan
      const plansWithrentId = plans.map(plan => ({
        ...plan,
        rentId: rentId,
      }));
      setBuyerCardData(plansWithrentId);
    } else {
      setCardData([]);
      setMessage({ text: "No active plans found", type: "warning" });
    }
  } catch (err) {
    setCardData([]);
    setMessage({ text: "Failed to load Tenant plans", type: "error" });
  }
};


  useEffect(() => {
    fetchActivePlans();
  }, []);

  // Fetch plans and inject rentId into each plan object
  const fetchActivePlans = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/active-plans`);
      // Add rentId manually into each plan to avoid undefined
      const plansWithrentId = response.data.map(plan => ({
        ...plan,
        rentId: rentId,
      }));
      setCardData(plansWithrentId);
    } catch (err) {
      setMessage({ text: "Failed to load plans", type: "error" });
    }
  };

  const confirmPlanSelection = (card, index) => {
    setSelectedPlan({ card, index });
    setShowPopup(true);
  };



const handleConfirmPlan = async () => {
  if (!selectedPlan) return;
  const { card, index } = selectedPlan;

  const rentIdNum = Number(card.rentId);
  if (!phoneNumber || isNaN(rentIdNum)) {
    setMessage({ text: "Missing or invalid phone number or RENT ID", type: "error" });
    return;
  }

  setLoadingIndex(index);
  setShowPopup(false);
};

 const handleBackNavigation = () => {
    navigate(baseToPath(getActiveBase()));
  };

  return (
    <div className="container d-flex align-items-center justify-content-center p-0">
      <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="row g-2 w-100">
          <div className="d-flex align-items-center justify-content-start w-100 p-2"      style={{
            background: "#EFEFEF",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            opacity: isScrolling ? 0 : 1,
            pointerEvents: isScrolling ? "none" : "auto",
            transition: "opacity 0.3s ease-in-out",
          }}>
                  <button    
                   className="d-flex align-items-center justify-content-center ps-3 pe-2"
    
          onClick={() => navigate(-1)}
          style={{
              background: "transparent",
          border: "none",
          height: "100%",color:"#CDC9F9",
            cursor: 'pointer',
            transition: 'all 0.3s ease-in-out',
      
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f0f4f5'; // Change background
            e.currentTarget.querySelector('svg').style.color = '#4F4B7E'; // Change icon color
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#CDC9F9';
            e.currentTarget.querySelector('svg').style.color = '#4F4B7E';
          }}
        >
          <FaChevronLeft style={{ color: '#4F4B7E', transition: 'color 0.3s ease-in-out' , background:"transparent"}} />
          </button>  
                              <h3 className="m-0" style={{ fontSize: "16px" }}> Your Property Plan</h3>
                            </div>


          <h3 className="m-0 ms-3 mt-2" style={{ fontSize: "24px", fontWeight: '700', color: '#2a2a2a' }}>Upgrade Membership</h3>
          <div className="mt-3 d-flex justify-content-center px-2 w-100">
            <VideoPlayer />
          </div>

          {message && (
            <p className="text-bold mt-2 w-100" style={{ color: message.type === "success" ? "green" : "red", textAlign: "center", padding: '0 12px' }}>
              {message.text}
            </p>
          )}

          <div className="text-center mb-3 px-3 w-100">
            <p className="lead mb-1 pt-2" style={{ fontSize: "15px", color: '#666', fontWeight: '500', lineHeight: '1.6' }}>
              All the plans in our Rent Pondy have validity dates for your property to be live for promotion purpose.
            </p>
          </div>

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
                  <div key={index} className="col-12 d-flex justify-content-center mb-4 p-0">
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
                          {card.name}
                        </h4>

                        {/* Package Type */}
                        <p className="text-start" style={{
                          fontSize: "15px",
                          color: '#888',
                          marginBottom: '16px',
                          fontWeight: '500'
                        }}>
                          {card.packageType || 'Premium Service'}
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
                            ₹{card.price}
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
                          ✅ Valid for {card.durationDays} Days • {card.numOfCars} Propert{card.numOfCars > 1 ? 'ies' : 'y'}
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
                            ✨ Featured Ads
                          </h5>
                          <p className="text-start m-0" style={{
                            color: '#555',
                            fontSize: '14px',
                            fontWeight: '500',
                            lineHeight: '1.5'
                          }}>
                            {card.description}
                          </p>
                          <p className="text-start m-0 mt-2" style={{
                            fontSize: '14px',
                            color: '#FF6B6B',
                            fontWeight: '700',
                            letterSpacing: '0.5px'
                          }}>
                            🎯 {card.featuredAds} ADS INCLUDED
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* CSS Animations */}
          <style>{`
            @keyframes floating {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            
            .pricing-card {
              cursor: pointer;
            }
          `}</style>

          {/* Confirmation Modal */}
          <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
            <Modal.Body className="text-center">
              <p>Are you sure you want to select this plan?</p>
              <Button style={{ background: "#4F4B7E", fontSize: "13px", border: "none" }} onClick={handleConfirmPlan}>Yes</Button>
              <Button className="ms-3" style={{ background: "#FF0000", fontSize: "13px", border: "none" }} onClick={() => setShowPopup(false)}>No</Button>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
}



