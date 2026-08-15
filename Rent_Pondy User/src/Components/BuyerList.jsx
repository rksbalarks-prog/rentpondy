


// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import profil from "../Assets/xd_profile.png";
// import NoData from "../Assets/OOOPS-No-Data-Found.png";
// import {
//   MdOutlineCall,
//   MdOutlineMapsHomeWork,
//   MdCalendarMonth,
//   MdOutlineBed,
// } from "react-icons/md";
// import { RiStairsLine } from "react-icons/ri";
// import { GoHome } from "react-icons/go";
// import { TfiLocationPin } from "react-icons/tfi";
// import maxrupe from "../Assets/Price maxi-01.png";
// import minrupe from "../Assets/Price Mini-01.png";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaArrowLeft, FaChevronLeft } from "react-icons/fa";



// const BuyerList = () => {
//   const [assistanceData, setAssistanceData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [message, setMessage] = useState("");
//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedPhone, setSelectedPhone] = useState("");
//   const [selectedPpcId, setSelectedPpcId] = useState("");
//   const [interestData, setInterestData] = useState([]);
//   const [selectedType, setSelectedType] = useState(null);
//     const [hovered, setHovered] = useState(false);
//      const [noMatchMessage, setNoMatchMessage] = useState("");
//     const [matchedProperties, setMatchedProperties] = useState([]);
  
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
//     const baseStyle = {
//       backgroundColor: "#4F4B7E",
//       color: "#fff",
//       border: "none",
//       padding: "8px 16px",
//       borderRadius: "5px",
//       cursor: "pointer",
//       transition: "background-color 0.3s ease",
//     };
  
//     const hoverStyle = {
//       backgroundColor: "#017a6e",
//     };
//   const navigate = useNavigate();
//   const scrollContainerRef = useRef(null);
//   const iconContainerRef = useRef(null);
//   const location = useLocation();
//   const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
//   const [phoneNumber] = useState(storedPhoneNumber);

//   const handleConfirmCall = (type, phone, Ra_Id) => {
//     setSelectedType(type);
//     setSelectedPhone(phone);
//     setSelectedPpcId(Ra_Id);
//     setShowPopup(true);
//   };

  
//     useEffect(() => {
//       if (!phoneNumber) return;
  
//       const fetchMatchedProperties = async () => {
//         try {
//           const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-owner-matched-properties-rent?phoneNumber=${phoneNumber}`);
//           // setMatchedProperties(response.data.properties);
//         } catch (error) {
//           // setError('Failed to load matched properties.');
//         } finally {
//           setLoading(false);
//         }
//       };
  
//       fetchMatchedProperties();
//     }, [phoneNumber]);

//   const handleMatchClick = () => { 
//   if (matchedProperties.length > 0) {
//     const matchData = {
//       type: "match",
//       phoneNumber: matchedProperties[0].phoneNumber,
//       rentId: matchedProperties[0].rentId,
//     };
    
//     // Use matchData as needed (e.g., console.log, send to backend, etc.)
//     console.log("Matched data:", matchData);

//   } else {
//     setNoMatchMessage("There is no matched properties");
//   }
// };


//   const handleSendInterest = async (id) => {
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/update-status-buyer-assistance-rent/${id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             ra_status: "rent-assistance-interest",
//             userPhoneNumber: phoneNumber,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (response.ok) {
//         setMessage("Interest sent successfully!");
//       } else {
//         setMessage(`Failed to send interest: ${data.message}`);
//       }
//     } catch (error) {
//       setMessage("An error occurred. Please try again.");
//     }
//   };

//   const handlePopupResponse = async (confirmed) => {
//     setShowPopup(false);

//     if (!confirmed || !selectedPhone || !selectedType) return;

//     try {
//       if (selectedType === "buyer") {
//         await axios.post(`${process.env.REACT_APP_API_URL}/contact-buyer-send-rent`, {
//           phoneNumber: selectedPhone,
//           Ra_Id: selectedPpcId,
//         });
//       } else {
//         await axios.post(`${process.env.REACT_APP_API_URL}/contact-send`, {
//           phoneNumber: selectedPhone,
//         });
//       }

//       setMessage("Contact request sent successfully!");
//       window.location.href = `tel:${selectedPhone}`;
//     } catch (error) {
//       setMessage("Failed to send contact request.");
//     }
//   };

//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => setMessage(""), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);


//   useEffect(() => {
//     const fetchAllAssistanceData = async () => {
//       try {
//         // Fetch buyer assistance
//         const assistanceResponse = await axios.get(`${process.env.REACT_APP_API_URL}/get-buyerAssistances-rent`);
//         const sortedAssistanceData = assistanceResponse.data.data.sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );
  
//         // const interestResponse = await axios.get(`${process.env.REACT_APP_API_URL}/buyer-assistance-interests-rent`);
//         // const sortedInterestData = interestResponse.data.data.sort(
//         //   (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         // );
  
//         // You can either:
//         // 1. Show both separately (recommended for clarity), or
//         // 2. Combine them into one if needed.
  
//         setAssistanceData(sortedAssistanceData); // regular assistance requests
//         // setInterestData(sortedInterestData); // buyer-assistance-interest entries
  
//       } catch (err) {
//         setError("");
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchAllAssistanceData();
// },[]);

//   const handleWheelScroll = (e) => {
//     if (scrollContainerRef.current) {
//       e.preventDefault();
//       scrollContainerRef.current.scrollTop += e.deltaY;
//     }
//   };
//   useEffect(() => {
//     const recordDashboardView = async () => {
//       try {
//         await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
//           phoneNumber: phoneNumber,
//           viewedFile: "Buyer List",
//           viewTime: new Date().toISOString(),
//         });
//       } catch (err) {
//       }
//     };
  
//     if (phoneNumber) {
//       recordDashboardView();
//     }
//   }, [phoneNumber]);
//   const handleIconScroll = (e) => {
//     if (iconContainerRef.current) {
//       e.preventDefault();
//       const scrollAmount = e.deltaX || e.deltaY;
//       iconContainerRef.current.scrollLeft += scrollAmount;
//     }
//   };


  
//    const formatIndianNumber = (x) => {
//   x = x.toString();
//   const lastThree = x.slice(-3);
//   const otherNumbers = x.slice(0, -3);
//   return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (otherNumbers ? "," : "") + lastThree;
// };

// const formatPrice = (rentalAmount) => {
//   rentalAmount = Number(rentalAmount);
//   if (isNaN(rentalAmount)) return 'N/A';

//   if (rentalAmount >= 10000000) {
//     return (rentalAmount / 10000000).toFixed(2) + ' Cr';
//   } else if (rentalAmount >= 100000) {
//     return (rentalAmount / 100000).toFixed(2) + ' Lakhs';
//   } else {
//     return formatIndianNumber(rentalAmount);
// }
// };


//   return (
//     <div className="container d-flex align-items-center justify-content-center p-0">
//     <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', margin: 'auto', width: '100%',fontFamily: 'Inter, sans-serif'}}>
//     <div className="row g-2 w-100">
//    <div className="d-flex align-items-center justify-content-start w-100 p-2"      style={{
//             background: "#EFEFEF",
//             position: "sticky",
//             top: 0,
//             zIndex: 1000,
//             opacity: isScrolling ? 0 : 1,
//             pointerEvents: isScrolling ? "none" : "auto",
//             transition: "opacity 0.3s ease-in-out",
//           }}>
//                   <button    
//                    className="d-flex align-items-center justify-content-center ps-3 pe-2"
    
//           onClick={() => navigate(-1)}
//           style={{
//               background: "transparent",
//           border: "none",
//           height: "100%",color:"#CDC9F9",
//             cursor: 'pointer',
//             transition: 'all 0.3s ease-in-out',
      
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.color = '#f0f4f5'; // Change background
//             e.currentTarget.querySelector('svg').style.color = '#4F4B7E'; // Change icon color
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.color = '#CDC9F9';
//             e.currentTarget.querySelector('svg').style.color = '#4F4B7E';
//           }}
//         >
//           <FaChevronLeft style={{ color: '#4F4B7E', transition: 'color 0.3s ease-in-out' , background:"transparent"}} />
//           </button>  
//  <h3 className="m-0 " style={{fontSize:"20px"}}>Buyer List </h3> </div>
     
//     <div
//       className="d-flex flex-column justify-content-center align-items-center w-100"
//       style={{ padding: "10px", gap: "15px", borderRadius: "10px", overflowY: "auto" }}
//       onWheel={handleWheelScroll}
//       ref={scrollContainerRef}
//     >
//       {/* <h5>Buyer List Datas</h5> */}
//       <div className="w-100 d-flex justify-content-around align-items-center mt-3">
//         <button style={{
//           ...baseStyle,
//           opacity: 0.6,
//           cursor: "not-allowed",
//         }}
//         disabled
//         >Add Tenant list</button>
//         <button   style={{
//           ...baseStyle,
//           ...(hovered ? hoverStyle : {}),
//         }}
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//         onClick={() => navigate(`/Buyer-List-Filter`)}

//    >view Tenant List</button>

//       </div>
//       {message && <div className="alert text-success fw-bold">{message}</div>}

//       {loading ? (
//   <div className="text-center my-4"
//     style={{
//       position: 'fixed',
//       top: '50%',
//       left: '50%',
//       transform: 'translate(-50%, -50%)',
//       zIndex: 1000
//     }}>
//     <span className="spinner-border text-primary" role="status" />
//     <p className="mt-2">Loading properties...</p>
//   </div>
// ) :assistanceData.length > 0 ? (
//         assistanceData.map((card) => (
  
//           <div
//   key={card._id}
//   className="card p-1"
//   style={{ width: '100%', height: 'auto', background: '#F9F9F9', overflow:'hidden' }}
// >
  

//             <div className="row d-flex align-items-center">
//               <div className="col-3 d-flex align-items-center justify-content-center mb-1">
//                 <img
//                   src={profil}
//                   alt="Profile"
//                   className="rounded-circle mt-2"
//                   style={{ width: "60px", height: "60px", objectFit: "cover" }}
//                 />
//               </div>
//               <div className="p-0" style={{ background: "#707070", width: "1px", height: "80px" }}></div>
//               <div className="col-7 p-0 ms-4">
//                 <div className="d-flex justify-content-between">
//                   <p className="m-0 text-muted" style={{ fontSize: "12px", fontWeight: "500" }}>
//                     RA ID: {card.Ra_Id}
//                   </p>
//                   <p className="m-0 text-muted" style={{ fontSize: "12px", fontWeight: "500" }}>
//                     <MdCalendarMonth size={12} className="me-2" color="#4F4B7E" />
//                     {card.createdAt.slice(0, 10)}
//                   </p>
//                 </div>
//                 <h5 className="mb-1" style={{ fontSize: "16px", color: "#000", fontWeight: "500" }}>
//                   {card.raName || "N/A"}{" "}
//                   <span className="text-muted" style={{ fontSize: "12px" }}>
//                     | Tenant
//                   </span>
//                 </h5>
//                 <div className="d-flex align-items-center justify-content-between col-8">
//                   <p className="mb-0 me-3 d-flex align-items-center" style={{ fontSize: "12px", fontWeight: 500 }}>
//                     <img src={minrupe} alt="min" width={13} className="me-2" />
// {formatPrice(card.minPrice)}
//                   </p>
//                   <p className="mb-0 d-flex align-items-center" style={{ fontSize: "12px", fontWeight: 500 }}>
//                     <img src={maxrupe} alt="max" width={13} className="me-2" />
// {formatPrice(card.maxPrice)}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-1">
//             <div
//                 className="d-flex align-items-center overflow-auto mb-0 p-1 rounded-1"
//                 style={{
//                   whiteSpace: "nowrap",
//                   minWidth: "100%",
//                   overflowX: "auto",
//                   scrollbarWidth: "none", 
//                   msOverflowStyle: "none",
//                   border: "1px solid #4F4B7E",
//                 }}
//                 onWheel={handleIconScroll}
//                 ref={iconContainerRef}
//                 >                <div className="d-flex align-items-center me-3">
//                   <GoHome size={12} className="me-2" color="#4F4B7E" />
//                   <p className="mb-0" style={{ fontSize: "12px" }}>{card.propertyMode || "N/A"}</p>
//                 </div>
//                 <div className="d-flex align-items-center me-3">
//                   <MdOutlineMapsHomeWork size={12} className="me-2" color="#4F4B7E" />
//                   <p className="mb-0" style={{ fontSize: "12px" }}>{card.propertyType || "N/A"}</p>
//                 </div>
//                 <div className="d-flex align-items-center me-3">
//                   <MdCalendarMonth size={12} className="me-2" color="#4F4B7E" />
//                   <p className="mb-0" style={{ fontSize: "12px" }}>{card.paymentType || "N/A"}</p>
//                 </div>
//                 <div className="d-flex align-items-center me-3">
//                   <MdOutlineBed size={12} className="me-2" color="#4F4B7E" />
//                   <p className="mb-0" style={{ fontSize: "12px" }}>{card.bedrooms || "N/A"} BHK</p>
//                 </div>
//                 {/* <div className="d-flex align-items-center me-3">
//                   <RiStairsLine size={12} className="me-2" color="#4F4B7E" />
//                   <p className="mb-0" style={{ fontSize: "12px" }}>{card.propertyAge}</p>
//                 </div> */}
//               </div>

//               <div className="mb-0 mt-1">
//                 <p className="mb-0 fw-semibold" style={{ fontSize: "12px" }}>
//                   <TfiLocationPin size={16} className="me-2" color="#4F4B7E" />
//                   {card.area || "N/A"}, {card.city || "N/A"}
//                 </p>
//               </div>

          

// <div className="d-flex justify-content-between align-items-center mt-2">
//   <div className="d-flex align-items-center">
//     <MdOutlineCall color="#4F4B7E" style={{ fontSize: "12px", marginRight: "8px" }} />
//     <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
//       {card.phoneNumber
//         ? `Buyer Phone: ${card.phoneNumber.slice(0, -5)}*****`
//         : "Phone: N/A"}
//     </h6>
//   </div>
// </div>


//               <div className="d-flex justify-content-end align-items-center m-0">

// <button
//   className="btn text-white px-3 py-1 mx-1"
//   style={{ background: "#3660FF", fontSize: "13px" }}
//   onMouseOver={(e) => {
//     e.target.style.background = "#0739f5"; // Brighter neon on hover
//     e.target.style.fontWeight = 500; // Brighter neon on hover
//     e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover

//   }}
//   onMouseOut={(e) => {
//     e.target.style.background = "#3660FF"; // Original orange
//     e.target.style.fontWeight = 400; // Brighter neon on hover

//   }}  onClick={() => handleSendInterest(card._id)}
// >
//   Send Interest
// </button>

// <button
//   className="btn text-white px-3 py-1 mx-1"
//   style={{ background: "#3660FF", fontSize: "13px" }}
//   onMouseOver={(e) => {
//     e.target.style.background = "#0739f5"; // Brighter neon on hover
//     e.target.style.fontWeight = 600; // Brighter neon on hover
//     e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover

//   }}
//   onMouseOut={(e) => {
//     e.target.style.background = "#3660FF"; // Original orange
//     e.target.style.fontWeight = 400; // Brighter neon on hover

//   }}
//   onClick={() => navigate(`/detail-buyer-assistance/${card.Ra_Id}`)}

// >
//   More
// </button>
//   <button
//         onClick={handleMatchClick}
//         className="btn text-white px-3 py-1 mx-1"
//         style={{ background: "#3660FF", fontSize: "13px" }}
//       >
//         Match Prop
//       </button>
//         {noMatchMessage && (
//         <div
//           style={{
//              position: 'fixed',
//               top: '15%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//             backgroundColor: "#fff0f0",
//             color: "red",
//             border: "1px solid #ffcccc",
//             borderRadius: "4px",
//             padding: "8px 12px",
//             fontSize: "14px",
//             boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
//             zIndex: 999,
//             marginTop: "6px",
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//             width: "max-content",
//           }}
//         >
//           <span>{noMatchMessage}</span>
//           <button
//             onClick={() => setNoMatchMessage(null)}
//             style={{
//               background: "transparent",
//               border: "none",
//               color: "red",
//               cursor: "pointer",
//               fontWeight: "bold",
//               fontSize: "16px",
//               lineHeight: 1,
//             }}
//             aria-label="Close"
//           >
//           </button>
//         </div>
//       )}
// </div>
//             </div>
//           </div>
//         ))
//       ) : (
//         <div className="text-center my-4 "
//         style={{
//           position: 'fixed',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
  
//         }}>
// <img src={NoData} alt="" width={100}/>          <p>No buyer assistance interests found.</p>
//           </div>        )}

//       {showPopup && (
//         <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
//           <div className="bg-white p-4 rounded" style={{ minWidth: "300px" }}>
//             <h6 className="mb-3">Are you sure you want to call this buyer?</h6>
//             <div className="d-flex justify-content-between">
//               <button className="btn btn-success" onClick={() => handlePopupResponse(true)}>Yes</button>
//               <button className="btn btn-danger" onClick={() => handlePopupResponse(false)}>No</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//     </div>
//     </div>
//     </div>
//   );
// };

// export default BuyerList;






// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import profil from "../Assets/xd_profile.png";
// import NoData from "../Assets/OOOPS-No-Data-Found.png";
// import {
//   MdOutlineCall,
//   MdOutlineMapsHomeWork,
//   MdCalendarMonth,
//   MdOutlineBed,
// } from "react-icons/md";
// import { RiStairsLine } from "react-icons/ri";
// import { GoHome } from "react-icons/go";
// import { TfiLocationPin } from "react-icons/tfi";
// import maxrupe from "../Assets/Price maxi-01.png";
// import minrupe from "../Assets/Price Mini-01.png";
// import { useLocation, useNavigate } from "react-router-dom";




// const BuyerLists = () => {
//   const [assistanceData, setAssistanceData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [message, setMessage] = useState("");
//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedPhone, setSelectedPhone] = useState("");
//   const [selectedPpcId, setSelectedPpcId] = useState("");
//   const [interestData, setInterestData] = useState([]);
//   const [selectedType, setSelectedType] = useState(null);
//     const [hovered, setHovered] = useState(false);
//      const [noMatchMessage, setNoMatchMessage] = useState("");
//     const [matchedProperties, setMatchedProperties] = useState([]);
  
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
//   const baseStyle = {
//       backgroundColor: "#4F4B7E",
//       color: "#fff",
//       border: "none",
//       padding: "8px 16px",
//       borderRadius: "5px",
//       cursor: "pointer",
//       transition: "background-color 0.3s ease",
//     };
  
//       const hoverStyle = {
//       backgroundColor: "#CDC9F9",
//     };

//   const navigate = useNavigate();
//   const scrollContainerRef = useRef(null);
//   const iconContainerRef = useRef(null);
//   const location = useLocation();
//   const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
//   const [phoneNumber] = useState(storedPhoneNumber);

//   const handleConfirmCall = (type, phone, Ra_Id) => {
//     setSelectedType(type);
//     setSelectedPhone(phone);
//     setSelectedPpcId(Ra_Id);
//     setShowPopup(true);
//   };

  
//     useEffect(() => {
//       if (!phoneNumber) return;
  
//       const fetchMatchedProperties = async () => {
//         try {
//           const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-owner-matched-properties-rent?phoneNumber=${phoneNumber}`);
//           // setMatchedProperties(response.data.properties);
//         } catch (error) {
//           // setError('Failed to load matched properties.');
//         } finally {
//           setLoading(false);
//         }
//       };
  
//       fetchMatchedProperties();
//     }, [phoneNumber]);

//   const handleMatchClick = () => { 
//   if (matchedProperties.length > 0) {
//     const matchData = {
//       type: "match",
//       phoneNumber: matchedProperties[0].phoneNumber,
//       rentId: matchedProperties[0].rentId,
//     };
    
//     // Use matchData as needed (e.g., console.log, send to backend, etc.)
//     console.log("Matched data:", matchData);

//   } else {
//     setNoMatchMessage("There is no matched properties");
//   }
// };


//   const handleSendInterest = async (id) => {
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/update-status-buyer-assistance-rent/${id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             ra_status: "rent-assistance-interest",
//             userPhoneNumber: phoneNumber,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (response.ok) {
//         setMessage("Interest sent successfully!");
//       } else {
//         setMessage(`Failed to send interest: ${data.message}`);
//       }
//     } catch (error) {
//       setMessage("An error occurred. Please try again.");
//     }
//   };

//   const handlePopupResponse = async (confirmed) => {
//     setShowPopup(false);

//     if (!confirmed || !selectedPhone || !selectedType) return;

//     try {
//       if (selectedType === "buyer") {
//         await axios.post(`${process.env.REACT_APP_API_URL}/contact-buyer-send-rent`, {
//           phoneNumber: selectedPhone,
//           Ra_Id: selectedPpcId,
//         });
//       } else {
//         await axios.post(`${process.env.REACT_APP_API_URL}/contact-send`, {
//           phoneNumber: selectedPhone,
//         });
//       }

//       setMessage("Contact request sent successfully!");
//       window.location.href = `tel:${selectedPhone}`;
//     } catch (error) {
//       setMessage("Failed to send contact request.");
//     }
//   };

//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => setMessage(""), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);


//   useEffect(() => {
//     const fetchAllAssistanceData = async () => {
//       try {
//         // Fetch buyer assistance
//         const assistanceResponse = await axios.get(`${process.env.REACT_APP_API_URL}/get-buyerAssistances-rent`);
//         const sortedAssistanceData = assistanceResponse.data.data.sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );
  
//         // const interestResponse = await axios.get(`${process.env.REACT_APP_API_URL}/buyer-assistance-interests-rent`);
//         // const sortedInterestData = interestResponse.data.data.sort(
//         //   (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         // );
  
//         // You can either:
//         // 1. Show both separately (recommended for clarity), or
//         // 2. Combine them into one if needed.
  
//         setAssistanceData(sortedAssistanceData); // regular assistance requests
//         // setInterestData(sortedInterestData); // buyer-assistance-interest entries
  
//       } catch (err) {
//         setError("");
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchAllAssistanceData();
// },[]);

//   const handleWheelScroll = (e) => {
//     if (scrollContainerRef.current) {
//       e.preventDefault();
//       scrollContainerRef.current.scrollTop += e.deltaY;
//     }
//   };
//   useEffect(() => {
//     const recordDashboardView = async () => {
//       try {
//         await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
//           phoneNumber: phoneNumber,
//           viewedFile: "Buyer List",
//           viewTime: new Date().toISOString(),
//         });
//       } catch (err) {
//       }
//     };
  
//     if (phoneNumber) {
//       recordDashboardView();
//     }
//   }, [phoneNumber]);
//   const handleIconScroll = (e) => {
//     if (iconContainerRef.current) {
//       e.preventDefault();
//       const scrollAmount = e.deltaX || e.deltaY;
//       iconContainerRef.current.scrollLeft += scrollAmount;
//     }
//   };

  

//    const formatIndianNumber = (x) => {
//   x = x.toString();
//   const lastThree = x.slice(-3);
//   const otherNumbers = x.slice(0, -3);
//   return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (otherNumbers ? "," : "") + lastThree;
// };

// const formatPrice = (rentalAmount) => {
//   rentalAmount = Number(rentalAmount);
//   if (isNaN(rentalAmount)) return 'N/A';

//   if (rentalAmount >= 10000000) {
//     return (rentalAmount / 10000000).toFixed(2) + ' Cr';
//   } else if (rentalAmount >= 100000) {
//     return (rentalAmount / 100000).toFixed(2) + ' Lakhs';
//   } else {
//     return formatIndianNumber(rentalAmount);
// }
// };



//   return (
//     <div
//       className="d-flex flex-column justify-content-center align-items-center w-100"
//       style={{ padding: "10px", gap: "15px", borderRadius: "10px", overflowY: "auto" }}
//       onWheel={handleWheelScroll}
//       ref={scrollContainerRef}
//     >
//       {/* <h5>Buyer List Datas</h5> */}
//       <div className="w-100 d-flex justify-content-around align-items-center m-0">
//         <button   style={{
//           ...baseStyle,
//           ...(hovered ? hoverStyle : {}),
//         }}
//          onClick={() => navigate(`/buyer-assistance`)}
        
//         >Add Tenant list</button>
//         <button 
//         style={{
//           ...baseStyle,
//           opacity: 0.6,
//           cursor: "not-allowed",
//         }}
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//         // onClick={() => navigate(`/Buyer-List-Filter`)}
// disabled
//    >view Tenant List</button>

//       </div>
//       {message && <div className="alert text-success fw-bold">{message}</div>}

//       {loading ? (
//   <div className="text-center my-4"
//     style={{
//       position: 'fixed',
//       top: '50%',
//       left: '50%',
//       transform: 'translate(-50%, -50%)',
//       zIndex: 1000
//     }}>
//     <span className="spinner-border text-primary" role="status" />
//     <p className="mt-2">Loading properties...</p>
//   </div>
// ) :assistanceData.length > 0 ? (
//         assistanceData.map((card) => (
  
//           <div
//   key={card._id}
//   className="card p-1"
//   style={{ width: '100%', height: 'auto', background: '#F9F9F9', overflow:'hidden' }}

// >
  

//             <div className="row d-flex align-items-center">
//               <div className="col-3 d-flex align-items-center justify-content-center mb-1">
//                 <img
//                   src={profil}
//                   alt="Profile"
//                   className="rounded-circle mt-2"
//                   style={{ width: "60px", height: "60px", objectFit: "cover" }}
//                 />
//               </div>
//               <div className="p-0" style={{ background: "#707070", width: "1px", height: "80px" }}></div>
//               <div className="col-7 p-0 ms-4">
//                 <div className="d-flex justify-content-between">
//                   <p className="m-0 text-muted" style={{ fontSize: "12px", fontWeight: "500" }}>
//                     RA ID: {card.Ra_Id}
//                   </p>
//                   <p className="m-0 text-muted" style={{ fontSize: "12px", fontWeight: "500" }}>
//                     <MdCalendarMonth size={12} className="me-2" color="#4F4B7E" />
//                     {card.createdAt.slice(0, 10)}
//                   </p>
//                 </div>
//                 <h5 className="mb-1" style={{ fontSize: "16px", color: "#000", fontWeight: "500" }}>
//                   {card.raName || "N/A"}{" "}
//                   <span className="text-muted" style={{ fontSize: "12px" }}>
//                     | Tenant
//                   </span>
//                 </h5>
//                 <div className="d-flex align-items-center justify-content-between col-8">
//                   <p className="mb-0 me-3 d-flex align-items-center" style={{ fontSize: "12px", fontWeight: 500 }}>
//                     <img src={minrupe} alt="min" width={13} className="me-2" />
//                     {formatPrice(card.minPrice)}
//                   </p>
//                   <p className="mb-0 d-flex align-items-center" style={{ fontSize: "12px", fontWeight: 500 }}>
//                     <img src={maxrupe} alt="max" width={13} className="me-2" />
//                     {formatPrice(card.maxPrice)}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-1">
//             <div
//                 className="d-flex align-items-center overflow-auto mb-0 p-1 rounded-1"
//                 style={{
//                   whiteSpace: "nowrap",
//                   minWidth: "100%",
//                   overflowX: "auto",
//                   scrollbarWidth: "none", 
//                   msOverflowStyle: "none",
//                   border: "1px solid #4F4B7E",
//                 }}
//                 onWheel={handleIconScroll}
//                 ref={iconContainerRef}
//                 >                <div className="d-flex align-items-center me-3">
//                   <GoHome size={12} className="me-2" color="#4F4B7E" />
//                   <p className="mb-0" style={{ fontSize: "12px" }}>{card.propertyMode}</p>
//                 </div>
//                 <div className="d-flex align-items-center me-3">
//                   <MdOutlineMapsHomeWork size={12} className="me-2" color="#4F4B7E" />
//                   <p className="mb-0" style={{ fontSize: "12px" }}>{card.propertyType}</p>
//                 </div>
//                 <div className="d-flex align-items-center me-3">
//                   <MdCalendarMonth size={12} className="me-2" color="#4F4B7E" />
//                   <p className="mb-0" style={{ fontSize: "12px" }}>{card.paymentType}</p>
//                 </div>
//                 <div className="d-flex align-items-center me-3">
//                   <MdOutlineBed size={12} className="me-2" color="#4F4B7E" />
//                   <p className="mb-0" style={{ fontSize: "12px" }}>{card.bedrooms} BHK</p>
//                 </div>
//                 <div className="d-flex align-items-center me-3">
//                   <RiStairsLine size={12} className="me-2" color="#4F4B7E" />
//                   <p className="mb-0" style={{ fontSize: "12px" }}>{card.propertyAge}</p>
//                 </div>
//               </div>

//               <div className="mb-0 mt-1">
//                 <p className="mb-0 fw-semibold" style={{ fontSize: "12px" }}>
//                   <TfiLocationPin size={16} className="me-2" color="#4F4B7E" />
//                   {card.area}, {card.city}
//                 </p>
//               </div>


// <div className="d-flex justify-content-between align-items-center mt-2">
//   <div className="d-flex align-items-center">
//     <MdOutlineCall color="#4F4B7E" style={{ fontSize: "12px", marginRight: "8px" }} />
//     <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
//       {card.phoneNumber
//         ? `Buyer Phone: ${card.phoneNumber.slice(0, -5)}*****`
//         : "Phone: N/A"}
//     </h6>
//   </div>
// </div>
// <div className="d-flex justify-content-end align-items-center m-0">


// <button
//   className="btn text-white px-3 py-1 mx-1"
//   style={{ background: "#3660FF", fontSize: "13px" }}
//   onMouseOver={(e) => {
//     e.target.style.background = "#0739f5"; // Brighter neon on hover
//     e.target.style.fontWeight = 500; // Brighter neon on hover
//     e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover

//   }}
//   onMouseOut={(e) => {
//     e.target.style.background = "#3660FF"; // Original orange
//     e.target.style.fontWeight = 400; // Brighter neon on hover

//   }}  onClick={() => handleSendInterest(card._id)}
// >
//   Send Interest
// </button>

// <button
//   className="btn text-white px-3 py-1 mx-1"
//   style={{ background: "#2F747F", fontSize: "13px" }}
//   onMouseOver={(e) => {
//     e.target.style.background = "#CDC9F9"; // Brighter neon on hover
//     e.target.style.fontWeight = 600; // Brighter neon on hover
//     e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover

//   }}
//   onMouseOut={(e) => {
//     e.target.style.background = "#2F747F"; // Original orange
//     e.target.style.fontWeight = 400; // Brighter neon on hover

//   }}
//   // onClick={() => navigate(`/detail-buyer-assistance/${card._id}`)}
//   onClick={() => navigate(`/detail-buyer-assistance/${card.Ra_Id}`)}
// >
//   More
// </button>
//   <button
//         onClick={handleMatchClick}
//         className="btn text-white px-3 py-1 mx-1"
//         style={{ background: "#2F747F", fontSize: "13px" }}
//       >
//         Match Prop
//       </button>
//         {noMatchMessage && (
//         <div
//           style={{
//              position: 'fixed',
//               top: '15%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//             backgroundColor: "#fff0f0",
//             color: "red",
//             border: "1px solid #ffcccc",
//             borderRadius: "4px",
//             padding: "8px 12px",
//             fontSize: "14px",
//             boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
//             zIndex: 999,
//             marginTop: "6px",
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//             width: "max-content",
//           }}
//         >
//           <span>{noMatchMessage}</span>
//           <button
//             onClick={() => setNoMatchMessage(null)}
//             style={{
//               background: "transparent",
//               border: "none",
//               color: "red",
//               cursor: "pointer",
//               fontWeight: "bold",
//               fontSize: "16px",
//               lineHeight: 1,
//             }}
//             aria-label="Close"
//           >
//             ×
//           </button>
//         </div>
//       )}
// </div>
//             </div>
//           </div>
//         ))
//       ) : (
//         <div className="text-center my-4 "
//     style={{
//       position: 'fixed',
//       top: '50%',
//       left: '50%',
//       transform: 'translate(-50%, -50%)',

//     }}>
// <img src={NoData} alt="" width={100}/>      
// <p>No buyer assistance interests found.</p>
// </div>
//       )}

//       {showPopup && (
//         <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
//           <div className="bg-white p-4 rounded" style={{ minWidth: "300px" }}>
//             <h6 className="mb-3">Are you sure you want to call this buyer?</h6>
//             <div className="d-flex justify-content-between">
//               <button className="btn btn-success" onClick={() => handlePopupResponse(true)}>Yes</button>
//               <button className="btn btn-danger" onClick={() => handlePopupResponse(false)}>No</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BuyerLists;


































import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import profil from "../Assets/xd_profile.png";
import NoData from "../Assets/OOOPS-No-Data-Found.png";
import {
  MdOutlineCall,
  MdOutlineMapsHomeWork,
  MdCalendarMonth,
  MdOutlineBed,
} from "react-icons/md";
import { RiStairsLine } from "react-icons/ri";
import { GoHome } from "react-icons/go";
import { TfiLocationPin } from "react-icons/tfi";
import maxrupe from "../Assets/Price maxi-01.png";
import minrupe from "../Assets/Price Mini-01.png";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaChevronLeft } from "react-icons/fa";

const BuyerList = () => {
  const [assistanceData, setAssistanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState("");
  const [selectedPpcId, setSelectedPpcId] = useState("");
  const [interestData, setInterestData] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [noMatchMessage, setNoMatchMessage] = useState("");
  const [matchedProperties, setMatchedProperties] = useState([]);
  const [loadingView, setLoadingView] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const iconContainerRef = useRef(null);
  const location = useLocation();
  
  // ✅ IMPROVED: Better phone number handling
  const getPhoneNumber = () => {
    return location.state?.phoneNumber || 
           localStorage.getItem("phoneNumber") || 
           sessionStorage.getItem("phoneNumber") || 
           "";
  };

  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    // Initialize phone number when component mounts
    const phone = getPhoneNumber();
    setPhoneNumber(phone);
  }, []);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const baseStyle = {
    backgroundColor: "#4F4B7E",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const hoverStyle = {
    backgroundColor: "#CDC9F9",
  };

  const handleConfirmCall = (type, phone, Ra_Id) => {
    setSelectedType(type);
    setSelectedPhone(phone);
    setSelectedPpcId(Ra_Id);
    setShowPopup(true);
  };

  // ✅ FIXED: Fetch matched properties
  useEffect(() => {
    if (!phoneNumber) return;

    const fetchMatchedProperties = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-owner-matched-properties-rent?phoneNumber=${phoneNumber}`);
        setMatchedProperties(response.data.properties || []);
      } catch (error) {
        console.error('Failed to load matched properties:', error);
      }
    };

    fetchMatchedProperties();
  }, [phoneNumber]);

  // ✅ ADDED: Function to record view when "More" button is clicked
  const handleRecordView = async (Ra_Id) => {
    try {
      setLoadingView(true);
      
      // Get current phone number
      const currentPhoneNumber = getPhoneNumber();
      
      if (!currentPhoneNumber) {
        console.warn('Phone number not available for recording view');
        return;
      }

      await axios.post(`${process.env.REACT_APP_API_URL}/record-buyer-assist-view`, {
        Ra_Id: Ra_Id,
        phoneNumber: currentPhoneNumber // ✅ Correct field name
      });
      
      console.log('View recorded successfully for Ra_Id:', Ra_Id);
    } catch (error) {
      console.error('Error recording view:', error);
    } finally {
      setLoadingView(false);
    }
  };

  // ✅ ADDED: Combined function for navigation and recording view
  const handleMoreClick = async (Ra_Id) => {
    // First record the view
    await handleRecordView(Ra_Id);
    // Then navigate to detail page
    navigate(`/detail-buyer-assistance/${Ra_Id}`);
  };

  const handleMatchClick = () => { 
    if (matchedProperties.length > 0) {
      const matchData = {
        type: "match",
        phoneNumber: matchedProperties[0].phoneNumber,
        rentId: matchedProperties[0].rentId,
      };
      console.log("Matched data:", matchData);
    } else {
      setNoMatchMessage("There are no matched properties");
      setTimeout(() => setNoMatchMessage(""), 3000);
    }
  };

  const handleSendInterest = async (id) => {
    try {
      const currentPhoneNumber = getPhoneNumber();
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/update-status-buyer-assistance-rent/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ra_status: "rent-assistance-interest",
            userPhoneNumber: currentPhoneNumber,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Interest sent successfully!");
      } else {
        setMessage(`Failed to send interest: ${data.message}`);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  const handlePopupResponse = async (confirmed) => {
    setShowPopup(false);

    if (!confirmed || !selectedPhone || !selectedType) return;

    try {
      if (selectedType === "buyer") {
        await axios.post(`${process.env.REACT_APP_API_URL}/contact-buyer-send-rent`, {
          phoneNumber: selectedPhone,
          Ra_Id: selectedPpcId,
        });
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/contact-send`, {
          phoneNumber: selectedPhone,
        });
      }

      setMessage("Contact request sent successfully!");
      window.location.href = `tel:${selectedPhone}`;
    } catch (error) {
      setMessage("Failed to send contact request.");
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    const fetchAllAssistanceData = async () => {
      try {
        const assistanceResponse = await axios.get(`${process.env.REACT_APP_API_URL}/get-buyerAssistances-rent`);
        const sortedAssistanceData = assistanceResponse.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAssistanceData(sortedAssistanceData);
      } catch (err) {
        setError("Failed to load data");
        console.error("Error fetching assistance data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAssistanceData();
  }, []);

  const handleWheelScroll = (e) => {
    if (scrollContainerRef.current) {
      e.preventDefault();
      scrollContainerRef.current.scrollTop += e.deltaY;
    }
  };

  // ✅ IMPROVED: Record dashboard view with better error handling
  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        const currentPhoneNumber = getPhoneNumber();
        
        if (!currentPhoneNumber) {
          console.warn('Phone number not available for recording dashboard view');
          return;
        }

        await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
          phoneNumber: currentPhoneNumber,
          viewedFile: "Buyer List",
          viewTime: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Error recording dashboard view:', err);
      }
    };

    recordDashboardView();
  }, []);

  const handleIconScroll = (e) => {
    if (iconContainerRef.current) {
      e.preventDefault();
      const scrollAmount = e.deltaX || e.deltaY;
      iconContainerRef.current.scrollLeft += scrollAmount;
    }
  };

  const formatIndianNumber = (x) => {
    if (!x) return 'N/A';
    x = x.toString();
    const lastThree = x.slice(-3);
    const otherNumbers = x.slice(0, -3);
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (otherNumbers ? "," : "") + lastThree;
  };

  const formatPrice = (rentalAmount) => {
    if (!rentalAmount) return 'N/A';
    
    rentalAmount = Number(rentalAmount);
    if (isNaN(rentalAmount)) return 'N/A';

    if (rentalAmount >= 10000000) {
      return (rentalAmount / 10000000).toFixed(2) + ' Cr';
    } else if (rentalAmount >= 100000) {
      return (rentalAmount / 100000).toFixed(2) + ' Lakhs';
    } else {
      return formatIndianNumber(rentalAmount);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center p-0">
      <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', margin: 'auto', width: '100%', fontFamily: 'Inter, sans-serif' }}>
        
        {/* Header */}
       

        <div className="row g-2 w-100">
          <div
            className="d-flex flex-column justify-content-center align-items-center w-100"
            style={{ padding: "10px", gap: "15px", borderRadius: "10px", overflowY: "auto" }}
            onWheel={handleWheelScroll}
            ref={scrollContainerRef}
          >
            {/* Navigation Buttons */}
            <div className="w-100 d-flex justify-content-around align-items-center mt-3">
              <button style={{
                ...baseStyle,
                opacity: 0.6,
                cursor: "not-allowed",
              }}
              disabled
              >Add Tenant list</button>
              <button style={{
                ...baseStyle,
                ...(hovered ? hoverStyle : {}),
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={() => navigate(`/Buyer-List-Filter`)}
              >View Tenant List</button>
            </div>

            {message && <div className="alert text-success fw-bold">{message}</div>}

            {loading ? (
              <div className="text-center my-4"
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1000
                }}>
                <span className="spinner-border text-primary" role="status" />
                <p className="mt-2">Loading properties...</p>
              </div>
            ) : assistanceData.length > 0 ? (
              assistanceData.map((card) => (
                <div
                  key={card._id}
                  className="card p-1"
                  style={{ width: '100%', height: 'auto', background: '#F9F9F9', overflow: 'hidden' }}
                >
                  <div className="row d-flex align-items-center">
                    <div className="col-3 d-flex align-items-center justify-content-center mb-1">
                      <img
                        src={profil}
                        alt="Profile"
                        className="rounded-circle mt-2"
                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="p-0" style={{ background: "#707070", width: "1px", height: "80px" }}></div>
                    <div className="col-7 p-0 ms-4">
                      <div className="d-flex justify-content-between">
                        <p className="m-0 text-muted" style={{ fontSize: "12px", fontWeight: "500" }}>
                          RA ID: {card.Ra_Id || "N/A"}
                        </p>
                        <p className="m-0 text-muted" style={{ fontSize: "12px", fontWeight: "500" }}>
                          <MdCalendarMonth size={12} className="me-2" color="#4F4B7E" />
                          {card.createdAt ? card.createdAt.slice(0, 10) : "N/A"}
                        </p>
                      </div>
                      <h5 className="mb-1" style={{ fontSize: "16px", color: "#000", fontWeight: "500" }}>
                        {card.raName || "N/A"}{" "}
                        <span className="text-muted" style={{ fontSize: "12px" }}>
                          | Tenant
                        </span>
                      </h5>
                      <div className="d-flex align-items-center justify-content-between col-8">
                        <p className="mb-0 me-3 d-flex align-items-center" style={{ fontSize: "12px", fontWeight: 500 }}>
                          <img src={minrupe} alt="min" width={13} className="me-2" />
                          {formatPrice(card.minPrice)}
                        </p>
                        <p className="mb-0 d-flex align-items-center" style={{ fontSize: "12px", fontWeight: 500 }}>
                          <img src={maxrupe} alt="max" width={13} className="me-2" />
                          {formatPrice(card.maxPrice)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-1">
                    <div
                      className="d-flex align-items-center overflow-auto mb-0 p-1 rounded-1"
                      style={{
                        whiteSpace: "nowrap",
                        minWidth: "100%",
                        overflowX: "auto",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        border: "1px solid #4F4B7E",
                      }}
                      onWheel={handleIconScroll}
                      ref={iconContainerRef}
                    >
                      <div className="d-flex align-items-center me-3">
                        <GoHome size={12} className="me-2" color="#4F4B7E" />
                        <p className="mb-0" style={{ fontSize: "12px" }}>{card.propertyMode || "N/A"}</p>
                      </div>
                      <div className="d-flex align-items-center me-3">
                        <MdOutlineMapsHomeWork size={12} className="me-2" color="#4F4B7E" />
                        <p className="mb-0" style={{ fontSize: "12px" }}>{card.propertyType || "N/A"}</p>
                      </div>
                      <div className="d-flex align-items-center me-3">
                        <MdCalendarMonth size={12} className="me-2" color="#4F4B7E" />
                        <p className="mb-0" style={{ fontSize: "12px" }}>{card.paymentType || "N/A"}</p>
                      </div>
                      <div className="d-flex align-items-center me-3">
                        <MdOutlineBed size={12} className="me-2" color="#4F4B7E" />
                        <p className="mb-0" style={{ fontSize: "12px" }}>{card.bedrooms || "N/A"} BHK</p>
                      </div>
                      {/* <div className="d-flex align-items-center me-3">
                        <RiStairsLine size={12} className="me-2" color="#4F4B7E" />
                        <p className="mb-0" style={{ fontSize: "12px" }}>{card.propertyAge || "N/A"}</p>
                      </div> */}
                    </div>

                    <div className="mb-0 mt-1">
                      <p className="mb-0 fw-semibold" style={{ fontSize: "12px" }}>
                        <TfiLocationPin size={16} className="me-2" color="#4F4B7E" />
                        {card.area || "N/A"}, {card.city || "N/A"}
                      </p>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <div className="d-flex align-items-center">
                        <MdOutlineCall color="#4F4B7E" style={{ fontSize: "12px", marginRight: "8px" }} />
                        <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
                          {card.phoneNumber
                            ? `Buyer Phone: ${card.phoneNumber.slice(0, -5)}*****`
                            : "Phone: N/A"}
                        </h6>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-end align-items-center m-0 mt-2">
                      <button
                        className="btn text-white px-3 py-1 mx-1"
                        style={{ background: "#3660FF", fontSize: "13px" }}
                        onMouseOver={(e) => {
                          e.target.style.background = "#0739f5";
                          e.target.style.fontWeight = 500;
                          e.target.style.transition = "background 0.3s ease";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = "#3660FF";
                          e.target.style.fontWeight = 400;
                        }}
                        onClick={() => handleSendInterest(card._id)}
                      >
                        Send Interest
                      </button>

                      <button
                        className="btn text-white px-3 py-1 mx-1"
                        style={{ background: "#2F747F", fontSize: "13px" }}
                        onMouseOver={(e) => {
                          e.target.style.background = "#029bb3";
                          e.target.style.fontWeight = 600;
                          e.target.style.transition = "background 0.3s ease";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = "#2F747F";
                          e.target.style.fontWeight = 400;
                        }}
                        onClick={() => handleMoreClick(card.Ra_Id)}
                        disabled={loadingView}
                      >
                        {loadingView ? "Loading..." : "More"}
                      </button>

                      <button
                        onClick={handleMatchClick}
                        className="btn text-white px-3 py-1 mx-1"
                        style={{ background: "#2F747F", fontSize: "13px" }}
                      >
                        Match Prop
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center my-4"
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}>
                <img src={NoData} alt="No data" width={100} />
                <p>No buyer assistance interests found.</p>
              </div>
            )}

            {/* No Match Message */}
            {noMatchMessage && (
              <div
                style={{
                  position: 'fixed',
                  top: '15%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: "#fff0f0",
                  color: "red",
                  border: "1px solid #ffcccc",
                  borderRadius: "4px",
                  padding: "8px 12px",
                  fontSize: "14px",
                  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
                  zIndex: 999,
                  marginTop: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "max-content",
                }}
              >
                <span>{noMatchMessage}</span>
                <button
                  onClick={() => setNoMatchMessage(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "red",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px",
                    lineHeight: 1,
                  }}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            )}

            {/* Confirmation Popup */}
            {showPopup && (
              <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
                <div className="bg-white p-4 rounded" style={{ minWidth: "300px" }}>
                  <h6 className="mb-3">Are you sure you want to call this buyer?</h6>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-success" onClick={() => handlePopupResponse(true)}>Yes</button>
                    <button className="btn btn-danger" onClick={() => handlePopupResponse(false)}>No</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerList;