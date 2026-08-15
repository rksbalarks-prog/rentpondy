


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FaArrowLeft, FaChevronLeft } from "react-icons/fa";
// import { GoCheckCircleFill } from "react-icons/go";
// import NoData from "../Assets/OOOPS-No-Data-Found.png";

// const MyBuyerPlan = () => {
//   const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
//   const [phoneNumber] = useState(storedPhoneNumber);
//   const [plans, setPlans] = useState([]); // holds array of {plan, payments}
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();
// const [showPopup, setShowPopup] = useState(false);
// const [selectedPaymentData, setSelectedPaymentData] = useState(null);
//     const [isScrolling, setIsScrolling] = useState(false);
  
//     useEffect(() => {
//       let scrollTimeout;
  
//       const handleScroll = () => {
//         setIsScrolling(true);
  
//         clearTimeout(scrollTimeout);
//         scrollTimeout = setTimeout(() => {
//           setIsScrolling(false);
//         }, 150); // Adjust the delay as needed
//       };
  
//       window.addEventListener("scroll", handleScroll);
  
//       return () => {
//         clearTimeout(scrollTimeout);
//         window.removeEventListener("scroll", handleScroll);
//       };
//     }, []);

// const fetchPlans = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.REACT_APP_API_URL}/get-buyer-plan-by-phone-buyer/${phoneNumber}`
//       );
//       setPlans(res.data.data || []);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to fetch Tenant plans.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (phoneNumber) {
//       fetchPlans();
//     } else {
//       setError("Phone number not found in localStorage.");
//       setLoading(false);
//     }
//   }, [phoneNumber]);

//    useEffect(() => {
//       const recordDashboardView = async () => {
//         try {
//           await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
//             phoneNumber: phoneNumber,
//             viewedFile: "My Buyer Plan",
//             viewTime: new Date().toISOString(),
//           });
//         } catch (err) {
//         }
//       };
    
//       if (phoneNumber) {
//         recordDashboardView();
//       }
//     }, [phoneNumber]);
  

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "N/A";
//     const date = new Date(dateStr);
//     return date.toLocaleDateString("en-GB").replace(/\//g, ".");
//   };

//   const calculateExpireDate = (payUdate, durationDays) => {
//     if (!payUdate || !durationDays) return "N/A";
//     const baseDate = new Date(payUdate);
//     baseDate.setDate(baseDate.getDate() + Number(durationDays));
//     return baseDate.toLocaleDateString("en-GB").replace(/\//g, ".");
//   };

//   const getExpiryMessage = (payUdate, durationDays) => {
//     if (!payUdate || !durationDays) return "N/A";
//     const expireDate = new Date(payUdate);
//     expireDate.setDate(expireDate.getDate() + Number(durationDays));
//     const today = new Date();
//     return today > expireDate
//       ? "Expired"
//       : `Active until ${expireDate.toLocaleDateString("en-GB").replace(/\//g, ".")}`;
//   };

//   const handleBackNavigation = () => {
//     navigate("/pondicherry");
//   };


// // Replace rentId with baId
// const openConfirmationPopup = (planId, raId, amount, planName) => {
//   setSelectedPaymentData({ planId, raId, amount, planName });
//   setShowPopup(true);
// };

// const confirmPayment = () => {
//   const { planId, raId, amount, planName } = selectedPaymentData;
//   navigate("/payu-form-buyer", {
//     state: { planId, raId, amount, phoneNumber, planName },
//   });
//   setShowPopup(false);
//   setSelectedPaymentData(null);
// };


// const cancelPopup = () => {
//   setShowPopup(false);
//   setSelectedPaymentData(null);
// };

//   // if (loading) return <p>Loading plans...</p>;
//   // if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div
//       className="container d-flex align-items-center justify-content-center p-0"
//       style={{ fontFamily: "Inter, sans-serif" }}
//     >
//       <div
//         className="d-flex flex-column align-items-center justify-content-center m-0"
//         style={{ maxWidth: "450px", margin: "auto", width: "100%" }}
//       >
//                    <div className="d-flex align-items-center justify-content-start w-100 p-2"      style={{
//              background: "#EFEFEF",
//              position: "sticky",
//              top: 0,
//              zIndex: 1000,
//              opacity: isScrolling ? 0 : 1,
//              pointerEvents: isScrolling ? "none" : "auto",
//              transition: "opacity 0.3s ease-in-out",
//            }}>
//                    <button    
//                     className="d-flex align-items-center justify-content-center ps-3 pe-2"
     
//            onClick={() => navigate(-1)}
//            style={{
//                background: "transparent",
//            border: "none",
//            height: "100%",color:"#CDC9F9",
//              cursor: 'pointer',
//              transition: 'all 0.3s ease-in-out',
       
//            }}
//            onMouseEnter={(e) => {
//              e.currentTarget.style.color = '#f0f4f5'; // Change background
//              e.currentTarget.querySelector('svg').style.color = '#4F4B7E'; // Change icon color
//            }}
//            onMouseLeave={(e) => {
//              e.currentTarget.style.color = '#CDC9F9';
//              e.currentTarget.querySelector('svg').style.color = '#4F4B7E';
//            }}
//          >
//            <FaChevronLeft style={{ color: '#4F4B7E', transition: 'color 0.3s ease-in-out' , background:"transparent"}} />
//             </button>
//           <h3 className="m-0" style={{ fontSize: "18px" }}>
//             My Tenant Assistant Plan
//           </h3>
//         </div>

     
//         {loading ? (
//   <div
//     className="text-center my-4"
//     style={{
//       position: 'fixed',
//       top: '50%',
//       left: '50%',
//       transform: 'translate(-50%, -50%)',
//     }}
//   >
//     <span className="spinner-border text-primary" role="status" />
//     <p className="mt-2">Loading properties...</p>
//   </div>
// ) : plans.length === 0 ? (
//   <div
//     className="text-center my-4"
//     style={{
//       position: 'fixed',
//       top: '50%',
//       left: '50%',
//       transform: 'translate(-50%, -50%)',
//     }}
//   >
//     <img src={NoData} alt="" width={100} />
//     <p>No properties found.</p>
//   </div>
// ) : (
//   <>
//     <h2
//       className="mb-2"
//       style={{ textAlign: 'center', color: '#009BC5', fontSize: '20px' }}
//     >
//       Current Plans
//     </h2>

//     {message && (
//       <p
//         className="m-0"
//         style={{ textAlign: 'center', color: '#28a745' }}
//       >
//         {message}
//       </p>
//     )}

//       {plans.map((plan, index) => (
//   <div key={index} style={styles.card}>
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         marginBottom: 10,
//       }}
//     >
//       <h4 style={{ color: "#007bff", fontWeight: 600 }}>
//         {plan.paymentData?.planName || "No Plan Name"}
//       </h4>
//       <span style={styles.checkmark}>
//         <GoCheckCircleFill />
//       </span>
//     </div>

//     <p style={styles.planDetail}>
//       <strong>RA_ID:</strong> {plan.Ra_Id}
//     </p>
//     <p style={styles.planDetail}>
//       <strong>Status:</strong> {plan.paymentData?.payustatususer || "N/A"}
//     </p>
//     <p style={styles.planDetail}>
//       <strong>Txn ID:</strong> {plan.paymentData?.txnid || "N/A"}
//     </p>
//     <p style={styles.planDetail}>
//       <strong>Amount:</strong> â‚¹{plan.paymentData?.amount || "N/A"}
//     </p>
//     <p style={styles.planDetail}>
//       <strong>Payment Date:</strong> {formatDate(plan.paymentData?.payUdate)}
//     </p>
//     <p style={styles.planDetail}>
//       <strong>Email:</strong> {plan.paymentData?.email || "N/A"}
//     </p>

//     {plan.paymentData?.payustatususer !== "paid" && (
//       <button
//         onClick={() =>
//           openConfirmationPopup(
//             plan._id,
//             plan.Ra_Id,
//             plan.paymentData?.amount,
//             plan.paymentData?.planName
//           )
//         }
//         style={{
//           backgroundColor: "#007bff",
//           color: "white",
//           border: "none",
//           padding: "8px 16px",
//           borderRadius: 5,
//           cursor: "pointer",
//           marginTop: 10,
//         }}
//       >
//         {plan.paymentData?.status === "pending" ? "Continue to Pay" : "Pay Now"}
//       </button>
//     )}

//     {plan.paymentData?.payustatususer === "paid" && (
//       <p style={{ color: "green", fontWeight: "bold" }}>
//         {plan.paymentData?.expiryMessage
//           ? plan.paymentData.expiryMessage
//           : "Paid"}
//       </p>
//     )}
//   </div>
// ))}

//     {/* Show confirmation popup once per user action */}
//     {showPopup && (
//       <div
//         style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 9999,
//         }}
//       >
//         <div
//           style={{
//             backgroundColor: 'white',
//             padding: 20,
//             borderRadius: 10,
//             width: '90%',
//             maxWidth: 300,
//             textAlign: 'center',
//           }}
//         >
//           <p style={{ fontWeight: 500, marginBottom: 20 }}>
//             Are you sure you want to continue to pay?
//           </p>
//           <div style={{ display: 'flex', justifyContent: 'space-around' }}>
//             <button
//               onClick={confirmPayment}
//               style={{
//                 background: '#0B57CF',
//                 cursor: 'pointer',
//                 border: 'none',
//                 color: '#fff',
//                 borderRadius: '10px',
//                 padding: '5px 12px',
//               }}
//             >
//               Yes
//             </button>
//             <button
//               onClick={cancelPopup}
//               style={{
//                 background: '#EAEAF6',
//                 cursor: 'pointer',
//                 border: 'none',
//                 color: '#0B57CF',
//                 borderRadius: '10px',
//                 padding: '5px 12px',
//               }}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     )}
//   </>
// )}

//       </div>
//     </div>
//   );
// };

// export default MyBuyerPlan;


// const styles = {
//   container: {
//     padding: '20px',
//     backgroundColor: '#F7F9FB',
//     // minHeight: '100vh',
//     fontFamily: 'Arial, sans-serif',
//     width:"100%",
//       overflowY: 'auto',   
//         height: '100vh',  
//    scrollbarWidth: 'none',              // Firefox
//   msOverflowStyle: 'none',             // IE 10+
//   WebkitOverflowScrolling: 'touch', 

//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: '10px',
//     padding: '20px',
//     marginBottom: '20px',
//     boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)'
//   },
//   planTitle: {
//     fontSize: "15px",
//     fontWeight: "bold",
//     color: '#007BFF',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between'
//   },
//   checkmark: {
//     color: 'green',
//     fontSize: '18px'
//   },
//   planDetail: {
//     fontSize: '14px',
//     color: 'grey',
//     margin: '5px 0'
//   },
//   infoRow: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     borderBottom: '1px solid #eee',
//     padding: '10px 0',
//     fontSize: '14px',
//   },
//   infoRows: {
//     display: 'flex',
//     justifyContent: 'space-between',
//   },
//   viewButton: {
//     backgroundColor: '#fff',
//     color: "#007BFF",
//     border: '1px solid #007BFF',
//     padding: '1px 8px',
//     borderRadius: '5px',
//     fontSize: '12px',
//     marginLeft: '10px'
//   },
//   newPrice: {
//     color: '#007BFF',
//     fontWeight: 'bold',
//     fontSize: '14px'
//   },
//   upgradeButton: {
//     width: '100%',
//     backgroundColor: '#007BFF',
//     color: 'white',
//     padding: '12px',
//     fontSize: '16px',
//     border: 'none',
//     borderRadius: '8px',
//     cursor: 'pointer'
//   }

// };




import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { getActiveBase, baseToPath } from "../utils/cityBase";
import { GoCheckCircleFill } from "react-icons/go";
import NoData from "../Assets/OOOPS-No-Data-Found.png";

const MyBuyerPlan = () => {
  const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
  const [phoneNumber] = useState(storedPhoneNumber);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPaymentData, setSelectedPaymentData] = useState(null);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/get-buyer-plan-by-phone-buyer/${phoneNumber}`
      );
      
      // Process the data to ensure all required fields are present
      const processedPlans = res.data.data.map(plan => {
        // Use Ra_Id as the primary ID
        const planId = plan.Ra_Id || `temp-${Math.random().toString(36).substr(2, 9)}`;
        
        return {
          ...plan,
          _id: planId,
          Ra_Id: plan.Ra_Id || 0,
          paymentData: {
            ...plan.paymentData,
            _id: plan.paymentData?._id || planId,
            planName: plan.planInfo?.planName || "Unknown Plan",
            amount: plan.planInfo?.planAmount || "0",
            payustatususer: plan.paymentData?.payustatususer || "unknown",
            payUdate: plan.paymentData?.payUdate,
            expireDate: plan.paymentData?.expireDate,
            expiryMessage: plan.paymentData?.expiryMessage
          }
        };
      });
      
      setPlans(processedPlans || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch buyer plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phoneNumber) {
      fetchPlans();
    } else {
      setError("Phone number not found in localStorage.");
      setLoading(false);
    }
  }, [phoneNumber]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("en-GB").replace(/\//g, ".");
    } catch {
      return "N/A";
    }
  };

  const handleBackNavigation = () => {
    navigate(baseToPath(getActiveBase()));
  };

  // const openConfirmationPopup = (plan) => {
  //   // Validate all required fields before proceeding
  //   const validationErrors = [];
    
  //   if (!plan._id) {
  //     validationErrors.push("Plan ID is missing");
  //   }
    
  //   if (!plan.Ra_Id) {
  //     validationErrors.push("Buyer Assistance ID is missing");
  //   }
    
  //   if (!plan.planInfo?.planAmount) {
  //     validationErrors.push("Amount is missing");
  //   }
    
  //   if (!plan.planInfo?.planName) {
  //     validationErrors.push("Plan name is missing");
  //   }

  //   if (validationErrors.length > 0) {
  //     setMessage(validationErrors.join(", "));
  //     return;
  //   }

  //   setSelectedPaymentData({
  //     planId: plan._id,
  //     Ra_Id: plan.Ra_Id,
  //     amount: plan.planInfo.planAmount,
  //     planName: plan.planInfo.planName
  //   });
  //   setShowPopup(true);
  //   setMessage(""); // Clear any previous messages
  // };

  const openConfirmationPopup = (plan) => {
  // Validate all required fields before proceeding
  const validationErrors = [];
  
  if (!plan.planInfo?.planId) {
    validationErrors.push("Plan ID is missing");
  }
  
  if (!plan.Ra_Id) {
    validationErrors.push("Buyer Assistance ID is missing");
  }
  
  if (!plan.planInfo?.planAmount) {
    validationErrors.push("Amount is missing");
  }
  
  if (!plan.planInfo?.planName) {
    validationErrors.push("Plan name is missing");
  }

  if (validationErrors.length > 0) {
    setMessage(validationErrors.join(", "));
    return;
  }

  setSelectedPaymentData({
    planId: plan.planInfo.planId, // Use the MongoDB _id here
    Ra_Id: plan.Ra_Id,
    amount: plan.planInfo.planAmount,
    planName: plan.planInfo.planName
  });
  setShowPopup(true);
  setMessage(""); // Clear any previous messages
};
  
  const confirmPayment = () => {
    if (!selectedPaymentData) return;
    
    navigate("/payu-form-buyer", {
      state: {
        ...selectedPaymentData,
        phoneNumber: phoneNumber
      }
    });
    setShowPopup(false);
  };

  const cancelPopup = () => {
    setShowPopup(false);
    setSelectedPaymentData(null);
  };

  const styles = {
    card: {
      backgroundColor: "#fff",
      borderRadius: "10px",
      padding: "15px",
      margin: "10px 0",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "450px"
    },
    checkmark: {
      color: "#28a745",
      fontSize: "20px"
    },
    planDetail: {
      margin: "5px 0",
      fontSize: "14px"
    }
  };

  // return (
  //   <div
  //     className="container d-flex align-items-center justify-content-center p-0"
  //     style={{ fontFamily: "Inter, sans-serif" }}
  //   >
  //     <div
  //       className="d-flex flex-column align-items-center justify-content-center m-0"
  //       style={{ maxWidth: "450px", margin: "auto", width: "100%" }}
  //     >
  //       <div className="d-flex align-items-center w-100 p-2" style={{ background: "#EFEFEF" }}>
  //         <button
  //           onClick={handleBackNavigation}
  //           className="pe-5"
  //           style={{
  //             backgroundColor: "#f0f0f0",
  //             border: "none",
  //             padding: "10px 20px",
  //             cursor: "pointer",
  //             display: "flex",
  //             alignItems: "center",
  //           }}
  //         >
  //           <FaArrowLeft style={{ color: "#30747F" }} />
  //         </button>
  //         <h3 className="m-0" style={{ fontSize: "16px" }}>
  //           My Buyer Assistant Plan
  //         </h3>
  //       </div>

  //       {loading ? (
  //         <div
  //           className="text-center my-4"
  //           style={{
  //             position: 'fixed',
  //             top: '50%',
  //             left: '50%',
  //             transform: 'translate(-50%, -50%)',
  //           }}
  //         >
  //           <span className="spinner-border text-primary" role="status" />
  //           <p className="mt-2">Loading plans...</p>
  //         </div>
  //       ) : error ? (
  //         <div
  //           className="text-center my-4"
  //           style={{
  //             position: 'fixed',
  //             top: '50%',
  //             left: '50%',
  //             transform: 'translate(-50%, -50%)',
  //           }}
  //         >
  //           <p style={{ color: "red" }}>{error}</p>
  //         </div>
  //       ) : plans.length === 0 ? (
  //         <div
  //           className="text-center my-4"
  //           style={{
  //             position: 'fixed',
  //             top: '50%',
  //             left: '50%',
  //             transform: 'translate(-50%, -50%)',
  //           }}
  //         >
  //           <img src={NoData} alt="" width={100} />
  //           <p>No plans found.</p>
  //         </div>
  //       ) : (
  //         <>
  //           <h2
  //             className="mb-2"
  //             style={{ textAlign: 'center', color: '#009BC5', fontSize: '20px' }}
  //           >
  //             Current Plans
  //           </h2>

  //           {message && (
  //             <div className="alert alert-warning" style={{ width: '100%', textAlign: 'center' }}>
  //               {message}
  //             </div>
  //           )}

  //           {plans.map((plan, index) => (
  //             <div key={index} style={styles.card}>
  //               <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
  //                 <h4 style={{ color: "#007bff", fontWeight: 600 }}>
  //                   {plan.planInfo?.planName || "No Plan Name"}
  //                 </h4>
  //                 <span style={styles.checkmark}>
  //                   <GoCheckCircleFill />
  //                 </span>
  //               </div>

  //               <p style={styles.planDetail}>
  //                 <strong>Plan ID:</strong> {plan._id || "N/A"}
  //               </p>
  //               <p style={styles.planDetail}>
  //                 <strong>Ra_Id:</strong> {plan.Ra_Id || "N/A"}
  //               </p>
  //               <p style={styles.planDetail}>
  //                 <strong>Status:</strong> {plan.paymentData?.payustatususer || plan.ra_status || "N/A"}
  //               </p>
  //               <p style={styles.planDetail}>
  //                 <strong>Amount:</strong> â‚¹{plan.planInfo?.planAmount || "N/A"}
  //               </p>
  //               <p style={styles.planDetail}>
  //                 <strong>Payment Date:</strong> {formatDate(plan.paymentData?.payUdate)}
  //               </p>
               
  //               {plan.paymentData?.expiryMessage && (
  //                  <p style={styles.planDetail}>
  //                 <strong>Expiry Date:</strong> {formatDate(plan.paymentData?.expireDate)}
  //                   <strong>Status:</strong> {plan.paymentData.expiryMessage}
  //                   </p>
  //               )}

  //               {(plan.paymentData?.payustatususer !== "paid" && plan.paymentData?.payustatususer !== "raExpired") && (
  //                 <button
  //                   onClick={() => openConfirmationPopup(plan)}
  //                   style={{
  //                     backgroundColor: "#007bff",
  //                     color: "white",
  //                     border: "none",
  //                     padding: "8px 16px",
  //                     borderRadius: 5,
  //                     cursor: "pointer",
  //                     marginTop: 10,
  //                   }}
  //                 >
  //                   {plan.paymentData?.payustatususer === "pending" ? "Continue to Pay" : "Pay Now"}
  //                 </button>
  //               )}

  //               {plan.paymentData?.payustatususer === "paid" && (
  //                 <p style={{ color: "green", fontWeight: "bold" }}>
  //                   {plan.paymentData?.expiryMessage || "Paid"}
  //                 </p>
  //               )}

  //               {plan.paymentData?.payustatususer === "raExpired" && (
  //                 <p style={{ color: "red", fontWeight: "bold" }}>
  //                   Plan Expired
  //                 </p>
  //               )}
  //             </div>
  //           ))}

  //           {showPopup && (
  //             <div
  //               style={{
  //                 position: 'fixed',
  //                 top: 0,
  //                 left: 0,
  //                 width: '100%',
  //                 height: '100%',
  //                 backgroundColor: 'rgba(0, 0, 0, 0.5)',
  //                 display: 'flex',
  //                 alignItems: 'center',
  //                 justifyContent: 'center',
  //                 zIndex: 9999,
  //               }}
  //             >
  //               <div
  //                 style={{
  //                   backgroundColor: 'white',
  //                   padding: 20,
  //                   borderRadius: 10,
  //                   width: '90%',
  //                   maxWidth: 300,
  //                   textAlign: 'center',
  //                 }}
  //               >
  //                 <p style={{ fontWeight: 500, marginBottom: 20 }}>
  //                   Are you sure you want to continue to pay?
  //                 </p>
  //                 <div style={{ display: 'flex', justifyContent: 'space-around' }}>
  //                   <button
  //                     onClick={confirmPayment}
  //                     style={{
  //                       background: '#0B57CF',
  //                       cursor: 'pointer',
  //                       border: 'none',
  //                       color: '#fff',
  //                       borderRadius: '10px',
  //                       padding: '5px 12px',
  //                     }}
  //                   >
  //                     Yes
  //                   </button>
  //                   <button
  //                     onClick={cancelPopup}
  //                     style={{
  //                       background: '#EAEAF6',
  //                       cursor: 'pointer',
  //                       border: 'none',
  //                       color: '#0B57CF',
  //                       borderRadius: '10px',
  //                       padding: '5px 12px',
  //                     }}
  //                   >
  //                     Cancel
  //                   </button>
  //                 </div>
  //               </div>
  //             </div>
  //           )}
  //         </>
  //       )}
  //     </div>
  //   </div>
  // );

return (
  <div
    className="container d-flex align-items-center justify-content-center p-0"
    style={{ fontFamily: "Inter, sans-serif" }}
  >
    <div
      className="d-flex flex-column align-items-center justify-content-center m-0"
      style={{ maxWidth: "450px", margin: "auto", width: "100%" }}
    >
      <div className="d-flex align-items-center w-100 p-2" style={{ background: "#EFEFEF" }}>
        <button
          onClick={handleBackNavigation}
          className="pe-5"
          style={{
            backgroundColor: "#f0f0f0",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FaArrowLeft style={{ color: "#30747F" }} />
        </button>
        <h3 className="m-0" style={{ fontSize: "16px" }}>
          My Buyer Assistant Plan
        </h3>
      </div>

      {loading ? (
        <div
          className="text-center my-4"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span className="spinner-border text-primary" role="status" />
          <p className="mt-2">Loading plans...</p>
        </div>
      ) : error ? (
        <div
          className="text-center my-4"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <p style={{ color: "red" }}>{error}</p>
        </div>
      ) : plans.length === 0 ? (
        <div
          className="text-center my-4"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <img src={NoData} alt="" width={100} />
          <p>No plans found.</p>
        </div>
      ) : (
        <>
          <h2
            className="mb-2"
            style={{ textAlign: 'center', color: '#009BC5', fontSize: '20px' }}
          >
            Current Plans
          </h2>

          {message && (
            <div className="alert alert-warning" style={{ width: '100%', textAlign: 'center' }}>
              {message}
            </div>
          )}

          {plans.map((plan, index) => (
            <div key={index} style={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <h4 style={{ color: "#007bff", fontWeight: 600 }}>
                  {plan.planInfo?.planName || "No Plan Name"}
                </h4>
                <span style={styles.checkmark}>
                  <GoCheckCircleFill />
                </span>
              </div>

              <p style={styles.planDetail}>
                <strong>Plan ID:</strong> {plan.planInfo?.planId || "N/A"}
              </p>
              <p style={styles.planDetail}>
                <strong>Ra_Id:</strong> {plan.Ra_Id || "N/A"}
              </p>
              <p style={styles.planDetail}>
                <strong>Status:</strong> {plan.paymentData?.payustatususer || plan.ra_status || "N/A"}
              </p>
              <p style={styles.planDetail}>
                <strong>Amount:</strong> â‚¹{plan.planInfo?.planAmount || "N/A"}
              </p>
              <p style={styles.planDetail}>
                <strong>Payment Date:</strong> {formatDate(plan.paymentData?.payUdate)}
              </p>

              {/* âœ… Always show expiry date & status if paid or expired */}
              {["paid", "raExpired"].includes(plan.paymentData?.payustatususer) && (
                <p style={styles.planDetail}>
                  <strong>Expiry Date:</strong>{" "}
                  {plan.paymentData?.expireDate ? formatDate(plan.paymentData.expireDate) : "N/A"} <br />
                  <strong>Status:</strong>{" "}
                  {plan.paymentData?.expiryMessage ||
                    (plan.paymentData?.payustatususer === "raExpired" ? "Expired" : "Active")}
                </p>
              )}

              {/* Show payment button if not paid or expired */}
              {plan.paymentData?.payustatususer !== "paid" &&
               plan.paymentData?.payustatususer !== "raExpired" && (
                <button
                  onClick={() => openConfirmationPopup(plan)}
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 5,
                    cursor: "pointer",
                    marginTop: 10,
                  }}
                >
                  {plan.paymentData?.payustatususer === "pending" ? "Continue to Pay" : "Pay Now"}
                </button>
              )}

              {plan.paymentData?.payustatususer === "paid" && (
                <p style={{ color: "green", fontWeight: "bold" }}>
                  {plan.paymentData?.expiryMessage || "Paid"}
                </p>
              )}

              {plan.paymentData?.payustatususer === "raExpired" && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Plan Expired
                </p>
              )}
            </div>
          ))}

          {showPopup && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
              }}
            >
              <div
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  borderRadius: 10,
                  width: '90%',
                  maxWidth: 300,
                  textAlign: 'center',
                }}
              >
                <p style={{ fontWeight: 500, marginBottom: 20 }}>
                  Are you sure you want to continue to pay?
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <button
                    onClick={confirmPayment}
                    style={{
                      background: '#0B57CF',
                      cursor: 'pointer',
                      border: 'none',
                      color: '#fff',
                      borderRadius: '10px',
                      padding: '5px 12px',
                    }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={cancelPopup}
                    style={{
                      background: '#EAEAF6',
                      cursor: 'pointer',
                      border: 'none',
                      color: '#0B57CF',
                      borderRadius: '10px',
                      padding: '5px 12px',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  </div>
);


};

export default MyBuyerPlan;