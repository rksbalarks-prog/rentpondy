





// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { FaArrowLeft, FaPhone, FaPhoneAlt, FaRegIdCard, FaRupeeSign } from "react-icons/fa";
// import { BsBuildings, BsBank } from "react-icons/bs";
// import { HiOutlineBuildingOffice2, HiOutlineNewspaper } from "react-icons/hi2";
// import { LiaBedSolid, LiaMoneyCheckSolid } from "react-icons/lia";
// import { RiCompass3Line } from "react-icons/ri";
// import { AiOutlineFileDone } from "react-icons/ai";
// import { RxDimensions } from "react-icons/rx";
// import { IoLocationOutline } from "react-icons/io5";
// import { LuCalendarDays } from "react-icons/lu";
// import imge from "../Assets/xd_profile1.png"
// import axios from "axios";
// import { CgProfile } from "react-icons/cg";

// export default function DetailBuyerAssistance() {
//   const { ba_id } = useParams(); // Extract ba_id from URL
//   const navigate = useNavigate();
//   const [buyerAssistance, setBuyerAssistance] = useState(null);
//   const [matchedProperties, setMatchedProperties] = useState([]);
//     const [noMatchMessage, setNoMatchMessage] = useState("");
// const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const location = useLocation();
//   const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem('phoneNumber') || '';
//   const [phoneNumber, setPhoneNumber] = useState(storedPhoneNumber);
//   const [requestData, setRequestData] = useState(null);
//   const [buyerRequests, setBuyerRequests] = useState([]);

//   const [planDetails, setPlanDetails] = useState(null);
//   const [showConfirm, setShowConfirm] = useState(false);
//     const [actionType, setActionType] = useState(null); // "remove" | "match" | "pay"
//     const [selectedData, setSelectedData] = useState(null);

    
// //  const [message, setMessage] = useState({ text: "", type: "" });
//   const [message, setMessage] = useState('');

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
//   useEffect(() => {
//       const recordDashboardView = async () => {
//         try {
//           await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
//             phoneNumber: phoneNumber,
//             viewedFile: "Detail Buyer Assistance",
//             viewTime: new Date().toISOString(),
//           });
//         } catch (err) {
//         }
//       };
    
//       if (phoneNumber) {
//         recordDashboardView();
//       }
//     }, [phoneNumber]);
//    // Auto-clear message after 3 seconds
//    useEffect(() => {
//     if (message.text) {
//       const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);
// const handleMatchClick = () => {
//     if (matchedProperties.length > 0) {
//       openConfirm("match", {
//         phoneNumber: matchedProperties[0].phoneNumber,
//         rentId: matchedProperties[0].rentId,
//       });
//     } else {
//       setNoMatchMessage("There is no matched properties");
//     }
//   };
//   const openConfirm = (type, data) => {
//     setActionType(type);
//     setSelectedData(data);
//     setShowConfirm(true);
//   };

//   const handleConfirm = () => {
//     if (actionType === "interest" && selectedData) {
//       handleSendInterest(selectedData);
//     } else if (actionType === "match" && selectedData) {
//       handleViewMore(selectedData.phoneNumber, selectedData.rentId);
//     } else if (actionType === "pay" && selectedData) {
//       // handlePay(selectedData);
//     }
//     setShowConfirm(false);
//     setActionType(null);
//     setSelectedData(null);
//   };

//   const handleCancel = () => {
//     setShowConfirm(false);
//     setActionType(null);
//     setSelectedData(null);
//   };

//   useEffect(() => {
//     if (ba_id) {
//       axios
//         .get(`${process.env.REACT_APP_API_URL}/fetch-buyerAssistance/${ba_id}`)
//         .then((response) => {
//           setRequestData(response.data.data);
//           setLoading(false);
//         })
//         .catch((error) => {
//           setError('Failed to load Buyer Assistance data.');
//           setLoading(false);
//         });
//     }
//   }, [ba_id]);


  
//   // const handlePayNow = () => {
//   //   const baId = requestData?.ba_id;
//   //   const phone = requestData?.phoneNumber;

//   //   if (baId && phone) {
//   //     navigate("/buyer-plan", {
//   //       state: {
//   //         baId,
//   //         phoneNumber: phone,
//   //       },
//   //     });
//   //   } else {
//   //     setError("Missing BA ID or Phone Number.");
//   //   }
//   // };

  
//     useEffect(() => {
//       if (!phoneNumber) return;
  
//       const fetchBuyerAssistanceData = async () => {
//         try {
//           const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-buyerAssistance?phoneNumber=${phoneNumber}`);
//           setPlanDetails(response.data.planDetails);
//           setBuyerRequests(response.data.data);
//           setLoading(false);
//         } catch (err) {
//           setError('Failed to load data. Please try again.');
//           setLoading(false);
//         }
//       };
  
//       fetchBuyerAssistanceData();
//     }, [phoneNumber]);
  
  

//   // Fetch matched properties based on the phone number
//   useEffect(() => {
//     if (!phoneNumber) return;

//     const fetchMatchedProperties = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-owner-matched-properties?phoneNumber=${phoneNumber}`);
//         setMatchedProperties(response.data.properties);
//       } catch (error) {
//         // setError('Failed to load matched properties.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMatchedProperties();
//   }, [phoneNumber]);

 
// const handleSendInterest = async (id) => {   // ✅ receive id (not _id)
//   try {
//     const response = await fetch(
//       `${process.env.REACT_APP_API_URL}/update-status-buyer-assistance/${id}`,  // ✅ use id
//       {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ba_status: 'buyer-assistance-interest',
//           userPhoneNumber: phoneNumber,  // ✅ phoneNumber you already have in state
//         }),
//       }
//     );

//     const data = await response.json();
//     if (response.ok) {
//       setMessage('Interest Sent Successfully!');
//     } else {
//       setMessage(`Failed to send interest: ${data.message}`);
//     }
//   } catch (error) {
//     setError('Failed to load matched properties.');

//   }
// };


  
//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error: {error}</p>;
//     if (!requestData) return <p>No data found.</p>;
  
//     const handleViewMore = (phoneNumber, rentId) => {
//       // navigate("/detail", { state: { rentId, phoneNumber } });
//       navigate(`/detail/${rentId}`, { state: {phoneNumber } });

//     };


//   return (
//     <div className='d-flex justify-content-center algin-item-center w-100'>
    
//     <div className='d-flex flex-column ' style={{maxWidth:"500px", width:"100%"}}>
//     <div className="d-flex align-items-center justify-content-start w-100 pt-2 pb-2"  style={{
//         background: "#EFEFEF",
//         position: "sticky",
//         top: 0,
//         zIndex: 1000,
//         opacity: isScrolling ? 0 : 1,
//         pointerEvents: isScrolling ? "none" : "auto",
//         transition: "opacity 0.3s ease-in-out",
//       }}>
//     <button
//       onClick={() => navigate(-1)}
//       className="pe-5"
//       style={{
//         backgroundColor: '#f0f0f0',
//         border: 'none',
//         padding: '10px 20px',
//         cursor: 'pointer',
//         transition: 'all 0.3s ease-in-out',
//         display: 'flex',
//         alignItems: 'center',
//       }}
//       onMouseEnter={(e) => {
//         e.currentTarget.style.backgroundColor = '#f0f4f5'; // Change background
//         e.currentTarget.querySelector('svg').style.color = '#00B987'; // Change icon color
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.backgroundColor = '#f0f0f0';
//         e.currentTarget.querySelector('svg').style.color = '#4F4B7E';
//       }}
//     >
//       <FaArrowLeft style={{ color: '#4F4B7E', transition: 'color 0.3s ease-in-out' , background:"transparent"}} />
//     </button> <h3 className="m-0 ms-3" style={{fontSize:"15px", fontWeight:"bold"}}>DETAILED BUYER ASSISTANT</h3> </div>

//             {message && <div className="alert text-success text-bold">{message}</div>}



//        <div className='d-flex algin-item-center justify-content-center w-100' style={{height:"200px"}}>

//         <img src={imge} alt="" style={{width:"200px"}}/></div>
//         <div className='d-flex algin-item-center justify-content-center w-100 mt-2'>    
//               <div style={{background:"#C5C5C5", height:"2px", width:"90%"}}></div>
//         </div>
//         <div className="d-flex justify-content-center w-100">

//         <div className='row w-100 mt-3 p-0'>
//         <h5 className='ps-3 ms-3' style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px", fontSize:"15px" }}>Buyer Profile</h5>   
//             <div className="d-flex align-items-center mb-3">
//                       <div className="d-flex  flex-row align-items-start w-100 ps-3">
//                       <div className="d-flex align-items-center col-6">
//                           <FaRegIdCard color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                           <div>
//                             <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
//                             BA ID                         </h6>
//                             <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
//                             {requestData.ba_id || "N/A"}
//                             </span>
//                           </div>
//                         </div>  
                     
//       <div className="d-flex align-items-center col-6">
//                           <CgProfile color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                           <div>
//                             <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
//                             NAME                         </h6>
//                             <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
//                             {requestData.baName || "N/A"}
//                             </span>
//                           </div>
//                         </div>  
//                         </div>
//                         </div>

//         <h5 className='ps-3 ms-3' style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px", fontSize:"15px" }}> Budget</h5>   
//             <div className="d-flex align-items-center mb-3">
//                       <div className="d-flex  flex-row align-items-start w-100 ps-3">
//                       <div className="d-flex align-items-center col-6">
//                           <FaRupeeSign color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                           <div>
//                             <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
//                             Minimum Amount                           </h6>
//                             <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
//                             {requestData.minPrice || "N/A"}
//                             </span>
//                           </div>
//                         </div>  
                     
//       <div className="d-flex align-items-center col-6">
//                           <FaRupeeSign color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                           <div>
//                             <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
//                             Maximum Amount                           </h6>
//                             <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
//                             {requestData.maxPrice || "N/A"}
//                             </span>
//                           </div>
//                         </div>  
//                         </div>
//                         </div>
//            {/* Lookin for */}
//            <h5 className='ps-3 ms-3' style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px", fontSize:"15px" }}> Looking for</h5>   
//             <div className="d-flex align-items-center mb-3">
//                       <div className="d-flex  flex-row align-items-start w-100 ps-3">
//                       <div className="d-flex align-items-center col-6">
//                           <BsBuildings   color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                           <div>
//                             <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
//                             Property Mode                           </h6>
//                             <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
//                             {requestData.propertyMode || "N/A"}
//                             </span>
//                           </div>
//                         </div>  
                     
//       <div className="d-flex align-items-center col-6">
//                           <HiOutlineBuildingOffice2 color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                           <div>
//                             <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
//                            Property Type                           </h6>
//                             <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
//                             {requestData.propertyType || "N/A"}
//                             </span>
//                           </div>
//                         </div>  
//                         </div>
//                         </div>
                        
             
//             <div className="d-flex align-items-center mb-3">
//                       <div className="d-flex  flex-row align-items-start w-100 ps-3">
//                       <div className="d-flex align-items-center col-6">
//                           <LiaBedSolid color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                           <div>
//                             <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
//                             Min.Bedroom                           </h6>
//                             <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
//                             {requestData.bedrooms || "N/A"} BHK
//                             </span>
//                           </div>
//                         </div>  
                     
 

//                         <div className="d-flex align-items-center col-6">
//                           <RxDimensions color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                           <div>
//                             <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
//                             Minimum Area                             </h6>
//                             <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
//                             {requestData.totalArea || "N/A" }{requestData.areaUnit || "N/A"}
//                             </span>
//                           </div>
//                         </div>  
//                         </div>
//                         </div>
                        
//             <div className="d-flex align-items-center mb-3">
//                       <div className="d-flex  flex-row align-items-start w-100 ps-3">
//                       <div className="d-flex align-items-center col-6">
//                           <AiOutlineFileDone   color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                           <div>
//                             <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
//                             Approved                         </h6>
//                             <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
//                             {requestData.propertyApproved || "N/A"}
//                             </span>
//                           </div>
//                         </div>  
                     
//       <div className="d-flex align-items-center col-6">
//                           <BsBank color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                           <div>
//                             <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
//                             Bank Loan                         </h6>
//                             <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
//                             {requestData.bankLoan || "N/A"}
//                             </span>
//                           </div>
//                         </div>  
//                         </div>
//                         </div>
                        
                        
//             <div className="d-flex align-items-center mb-3">
//                       <div className="d-flex  flex-row align-items-start w-100 ps-3">
//                       <div className="d-flex align-items-center col-6">
//                           <RiCompass3Line color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                           <div>
//                             <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
//                             Select Facing                          </h6>
//                             <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
//                             {requestData.facing || "N/A"}
//                             </span>
//                           </div>
//                         </div>  
//                         </div>
//                         </div> 
                        
// <div className="d-flex align-items-center mb-3">
//   <div className="d-flex flex-row align-items-start w-100 ps-3">

//     {/* Buyer Phone Number */}
//     <div className="d-flex align-items-center col-6 mt-2" >
//       <FaPhoneAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//       <div>
//         <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
//           Buyer Phone Number
//         </h6>
//         <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
//           {requestData?.phoneNumber || "N/A"}
//         </span>
//       </div>
//     </div>
//     <div className="d-flex align-items-center col-6 mt-2">
//   <FaPhoneAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//   <div>
//     <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
//       Interested User Phone
//     </h6>
//     <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
//       {Array.isArray(requestData?.interestedUserPhone) && requestData?.interestedUserPhone.length > 0
//         ? requestData.interestedUserPhone.join(", ")
//         : "N/A"}
//     </span>
//   </div>
// </div>

//   </div>
// </div>

//                         <h5 className='ps-3 ms-3' style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px", fontSize:"15px" }}> Location Preffered</h5>   
//                         <div className='ps-3 ms-3 mb-2' style={{ display: 'flex', alignItems: 'center' }}>
//   <IoLocationOutline color='#4F4B7E' style={{ fontSize: '24px', flexShrink: 0, marginRight: '8px' }} />
//   <p style={{ margin: 0, flex: 1 }}>{requestData.city || "N/A"}</p>

// </div>


//                         <h5 className='ps-3 ms-3' style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px", fontSize:"15px" }}>Description</h5>   

// <div className=' ms-3 mb-3' style={{ display: 'flex', alignItems: 'center' }}>
//   <HiOutlineNewspaper color='#4F4B7E' style={{ fontSize: '24px', flexShrink: 0, marginRight: '8px' }} />
//   <p style={{ margin: 0, flex: 1 }}>{requestData.description || "No Description Available"}</p>
  
// </div>

         


// <div className="d-flex align-items-center mb-3">
//   <div className="d-flex flex-row align-items-start w-100 ps-3">
//     {/* Plan Name */}
//     <div className="d-flex align-items-center col-6">
//       <LiaMoneyCheckSolid color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//       <div>
//         <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
//           Plan Name
//         </h6>
//         <span
//           className="card-text"
//           style={{ color: "#1D1D1D", fontWeight: "500", fontSize: "14px" }}
//         >
//           {planDetails?.planName || "N/A"}
//         </span>
        
//       </div>
//     </div>

//     {/* Expire Date */}
//     <div className="d-flex align-items-center col-6">
//       <LuCalendarDays color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//       <div>
//         <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
//           Expire Date
//         </h6>
//         <span
//           className="card-text"
//           style={{ color: "#1D1D1D", fontWeight: "500", fontSize: "14px" }}
//         >
//           {planDetails?.planExpiryDate || "N/A"}
//         </span>
//       </div>
//     </div>
//   </div>
// </div>

//                         <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-5 mb-5 col-12">


//   <button
//   className="btn text-white px-3 py-1 mx-1"
//   style={{ background: "#3660FF", fontSize: "13px" }}
//   onMouseOver={(e) => {
//     e.target.style.background = "#CDC9F9"; // Brighter neon on hover
//     e.target.style.fontWeight = 600; // Brighter neon on hover
//     e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover

//   }}
//   onMouseOut={(e) => {
//     e.target.style.background = "#3660FF"; // Original orange
//     e.target.style.fontWeight = 400; // Brighter neon on hover

//   }}  
//   onClick={() => openConfirm("interest", requestData._id)}

// >
//   Send Interest
// </button>


//     <div>
//       <button
//         onClick={handleMatchClick}
//         className="btn text-white px-3 py-1 mx-1"
//         style={{ background: "#4F4B7E", fontSize: "13px" }}
//       >
//         Match Prop
//       </button>

//       {noMatchMessage && (
//         <div style={{ marginTop: "10px", color: "red", fontSize: "14px" }}>
//           {noMatchMessage}
//         </div>
//       )}
//     </div>
//   {/* <button className="btn text-white px-3 py-1 mx-1" style={{ background: "#0F9F2C", fontSize: "13px" }}
//          onClick={() => openConfirm("pay", requestData)}

//  onMouseOver={(e) => {
//       e.target.style.background = "#32cd32"; // Neon green on hover
//     }}
//     onMouseOut={(e) => {
//       e.target.style.background = "green"; // Original green
//     }}>
//     PAY Now
//   </button> */}

//     {/* <button
//         className="btn text-white px-3 py-1 mx-1"
//         style={{ background: "#0F9F2C", fontSize: "13px" }}
//         onClick={handlePayNow}
//         onMouseOver={(e) => {
//           e.target.style.background = "#32cd32"; // Neon green on hover
//         }}
//         onMouseOut={(e) => {
//           e.target.style.background = "#0F9F2C"; // Original green
//         }}
//       >
//         PAY Now
//       </button> */}
// </div>
// {showConfirm && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
//           style={{ background: "rgba(0,0,0,0.5)", zIndex: 9999 }}
//         >
//           <div className="bg-white p-4 rounded shadow" style={{ width: "300px" }}>
//             <h6 className="mb-3">
//               {actionType === "interest" && "Are you sure you want to Send Interest?"}
//               {actionType === "match" && "Do you want to view matching property?"}
//               {actionType === "pay" && "Proceed with payment?"}
//             </h6>
//             <div className="d-flex justify-content-end">
//               <button className="btn btn-secondary me-2" onClick={handleCancel}>
//                 No
//               </button>
//               <button className="btn btn-primary" onClick={handleConfirm}>
//                 Yes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}


//        </div>
//        </div>

//     </div>
// </div>
//   );
// }










import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaChevronLeft, FaPhone, FaPhoneAlt, FaRegIdCard, FaRupeeSign } from "react-icons/fa";
import { BsBuildings, BsBank } from "react-icons/bs";
import { HiOutlineBuildingOffice2, HiOutlineNewspaper } from "react-icons/hi2";
import { LiaBedSolid, LiaMoneyCheckSolid } from "react-icons/lia";
import { RiCompass3Line } from "react-icons/ri";
import { AiOutlineFileDone } from "react-icons/ai";
import { RxDimensions } from "react-icons/rx";
import { IoLocationOutline } from "react-icons/io5";
import { LuCalendarDays } from "react-icons/lu";
import imge from "../Assets/xd_profile1.png"
import axios from "axios";
import { CgProfile } from "react-icons/cg";

export default function DetailBuyerAssistance() {
  const { Ra_Id } = useParams(); // Extract ba_id from URL
  const navigate = useNavigate();
  const [buyerAssistance, setBuyerAssistance] = useState(null);
  const [matchedProperties, setMatchedProperties] = useState([]);
    const [noMatchMessage, setNoMatchMessage] = useState("");
const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem('phoneNumber') || '';
  const [phoneNumber, setPhoneNumber] = useState(storedPhoneNumber);
  const [requestData, setRequestData] = useState(null);
  const [buyerRequests, setBuyerRequests] = useState([]);

  const [planDetails, setPlanDetails] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
    const [actionType, setActionType] = useState(null); // "remove" | "match" | "pay"
    const [selectedData, setSelectedData] = useState(null);

    
  const [accessLoading, setAccessLoading] = useState(false);
  const [showBuyerPhone, setShowBuyerPhone] = useState(false);
//  const [message, setMessage] = useState({ text: "", type: "" });
  const [message, setMessage] = useState('');

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
      const recordDashboardView = async () => {
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
            phoneNumber: phoneNumber,
            viewedFile: "Detail Buyer Assistance",
            viewTime: new Date().toISOString(),
          });
        } catch (err) {
        }
      };
    
      if (phoneNumber) {
        recordDashboardView();
      }
    }, [phoneNumber]);
   // Auto-clear message after 3 seconds
   useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Send WhatsApp upgrade plan notification
  const sendUpgradePlanNotification = async () => {
    try {
      const userName = localStorage.getItem("userName") || "User";
      const raId = requestData?.Ra_Id || "N/A";
      const location = requestData?.area || requestData?.state || "BHARATHIPURAM";
      const ownerName = requestData?.raName || "Tenant";

      console.log("📱 Starting upgrade plan notification...");
      console.log("User phone:", phoneNumber);

      // Format phone number (remove non-digits and add country code if needed)
      const formatPhone = (phone) => {
        const cleaned = String(phone).replace(/\D/g, "");
        return cleaned.length === 10 ? `91${cleaned}` : cleaned;
      };

      const formattedUserPhone = formatPhone(phoneNumber);

      console.log("Formatted user phone:", formattedUserPhone);

      if (!formattedUserPhone || formattedUserPhone.length < 11) {
        console.log("⚠️ Invalid user phone number:", formattedUserPhone);
        return;
      }

      console.log("📨 Queuing upgrade notification to user...");
      try {
        const userResponse = await axios.post(`${process.env.REACT_APP_API_URL}/queue-message`, {
          to: formattedUserPhone,
          category: "upgrade-plan",
          data: {
            userName,
            raId,
            location,
            ownerName,
          },
        });
        console.log("✅ Upgrade notification queued:", userResponse.data);
      } catch (userErr) {
        console.log("⚠️ Upgrade notification failed:", userErr.message);
      }
    } catch (error) {
      console.log("⚠️ Error in upgrade plan notification:", error.message);
    }
  };

  // Send WhatsApp notifications when contact is viewed
  const sendContactViewNotification = async () => {
    try {
      const tenantPhone = requestData?.phoneNumber || "";
      const raId = requestData?.Ra_Id || "N/A";
      const location = requestData?.area || requestData?.state || "BHARATHIPURAM";
      const ownerName = requestData?.raName || "Tenant";
      const userName = localStorage.getItem("userName") || "Guest User";

      console.log("📱 Starting contact view notification...");
      console.log("Tenant phone:", tenantPhone);
      console.log("User phone:", phoneNumber);

      // Format phone number (remove non-digits and add country code if needed)
      const formatPhone = (phone) => {
        const cleaned = String(phone).replace(/\D/g, "");
        return cleaned.length === 10 ? `91${cleaned}` : cleaned;
      };

      const formattedTenantPhone = formatPhone(tenantPhone);
      const formattedUserPhone = formatPhone(phoneNumber);

      console.log("Formatted tenant phone:", formattedTenantPhone);
      console.log("Formatted user phone:", formattedUserPhone);

      if (!formattedTenantPhone || formattedTenantPhone.length < 11) {
        console.log("⚠️ Invalid tenant phone number:", formattedTenantPhone);
        return;
      }

      if (!formattedUserPhone || formattedUserPhone.length < 11) {
        console.log("⚠️ Invalid user phone number:", formattedUserPhone);
        return;
      }

      console.log("📨 Queuing message to user...");
      try {
        const userResponse = await axios.post(`${process.env.REACT_APP_API_URL}/queue-message`, {
          to: formattedUserPhone,
          category: "contact-view-user",
          data: {
            userName,
            raId,
            location,
            ownerName,
            tenantPhone,
          },
        });
        console.log("✅ User message queued:", userResponse.data);
      } catch (userErr) {
        console.log("⚠️ User message failed:", userErr.message);
      }

      console.log("📨 Queuing message to tenant (owner)...");
      try {
        const tenantResponse = await axios.post(`${process.env.REACT_APP_API_URL}/queue-message`, {
          to: formattedTenantPhone,
          category: "contact-view-owner",
          data: {
            userName,
            raId,
            location,
            ownerName,
          },
        });
        console.log("✅ Tenant message queued:", tenantResponse.data);
      } catch (tenantErr) {
        console.log("⚠️ Tenant message failed:", tenantErr.message);
      }
    } catch (error) {
      console.log("⚠️ Error in contact view notification:", error.message);
    }
  };

  // ✅ Handle View Contact Access
  const handleCheckAccess = async () => {
    setAccessLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/check-user-access-buyer-assistance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await res.json();

      if (!data.success) {
        setMessage(data.message || "Access denied.");
        setAccessLoading(false);
        // Send upgrade plan notification
        await sendUpgradePlanNotification();
        return;
      }

      const alreadyViewed = data.viewedBuyerAssistances.includes(Ra_Id);
      const hasAccess = data.userIsPaid && (data.remainingViews > 0 || alreadyViewed);

      if (hasAccess) {
        // Record first-time view
        if (!alreadyViewed) {
          await fetch(`${process.env.REACT_APP_API_URL}/record-ba-view`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber, Ra_Id }),
          });
        }
        setShowBuyerPhone(true);
        
        // Send WhatsApp notifications to both user and tenant
        await sendContactViewNotification();
      } else {
        setMessage("Access denied. Upgrade plan or view limit reached.");
        // Send upgrade plan notification when access is denied
        await sendUpgradePlanNotification();
      }
    } catch (err) {
      setMessage("Server error. Try again.");
    } finally {
      setAccessLoading(false);
    }
  };


const handleMatchClick = () => {
    if (matchedProperties.length > 0) {
      openConfirm("match", {
        phoneNumber: matchedProperties[0].phoneNumber,
        rentId: matchedProperties[0].rentId,
      });
    } else {
      setNoMatchMessage("There is no matched properties");
    }
  };

  const openConfirm = (type, data) => {
    setActionType(type);
    setSelectedData(data);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (actionType === "interest" && selectedData) {
      handleSendInterest(selectedData);
    } else if (actionType === "match" && selectedData) {
      handleViewMore(selectedData.phoneNumber, selectedData.rentId);
    } else if (actionType === "pay" && selectedData) {
      // handlePay(selectedData);
    }
    setShowConfirm(false);
    setActionType(null);
    setSelectedData(null);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setActionType(null);
    setSelectedData(null);
  };

  useEffect(() => {
    if (Ra_Id) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/fetch-buyerAssistance-rent/${Ra_Id}`)
        .then((response) => {
          setRequestData(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          setError('Failed to load Tenant Assistance data.');
          setLoading(false);
        });
    }
  }, [Ra_Id]);


  
  // const handlePayNow = () => {
  //   const baId = requestData?.ba_id;
  //   const phone = requestData?.phoneNumber;

  //   if (baId && phone) {
  //     navigate("/buyer-plan", {
  //       state: {
  //         baId,
  //         phoneNumber: phone,
  //       },
  //     });
  //   } else {
  //     setError("Missing BA ID or Phone Number.");
  //   }
  // };

  
    useEffect(() => {
      if (!phoneNumber) return;
  
      const fetchBuyerAssistanceData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-buyerAssistance?phoneNumber=${phoneNumber}`);
          setPlanDetails(response.data.planDetails);
          setBuyerRequests(response.data.data);
          setLoading(false);
        } catch (err) {
          setError('Failed to load data. Please try again.');
          setLoading(false);
        }
      };
  
      fetchBuyerAssistanceData();
    }, [phoneNumber]);
  
  

  // Fetch matched properties based on the phone number
  useEffect(() => {
    if (!phoneNumber) return;

    const fetchMatchedProperties = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-owner-matched-properties-rent?phoneNumber=${phoneNumber}`);
        setMatchedProperties(response.data.properties);
      } catch (error) {
        // setError('Failed to load matched properties.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedProperties();
  }, [phoneNumber]);

 
// Send WhatsApp notifications when Send Interest is clicked
const sendInterestNotification = async () => {
  try {
    const tenantPhone = requestData?.phoneNumber || "";
    const raId = requestData?.Ra_Id || "N/A";
    const location = requestData?.area || requestData?.state || "BHARATHIPURAM";
    const ownerName = requestData?.raName || "Tenant";
    const userName = localStorage.getItem("userName") || "Guest User";

    console.log("📱 Starting send interest notification...");
    console.log("Tenant phone:", tenantPhone);
    console.log("User phone:", phoneNumber);

    // Format phone number (remove non-digits and add country code if needed)
    const formatPhone = (phone) => {
      const cleaned = String(phone).replace(/\D/g, "");
      return cleaned.length === 10 ? `91${cleaned}` : cleaned;
    };

    const formattedTenantPhone = formatPhone(tenantPhone);
    const formattedUserPhone = formatPhone(phoneNumber);

    console.log("Formatted tenant phone:", formattedTenantPhone);
    console.log("Formatted user phone:", formattedUserPhone);

    if (!formattedTenantPhone || formattedTenantPhone.length < 11) {
      console.log("⚠️ Invalid tenant phone number:", formattedTenantPhone);
      return;
    }

    if (!formattedUserPhone || formattedUserPhone.length < 11) {
      console.log("⚠️ Invalid user phone number:", formattedUserPhone);
      return;
    }

    console.log("📨 Queuing message to user...");
    try {
      const userResponse = await axios.post(`${process.env.REACT_APP_API_URL}/queue-message`, {
        to: formattedUserPhone,
        category: "buyer-interest-user",
        data: {
          userName,
          raId,
          location,
          ownerName,
          ownerPhone: formattedTenantPhone,
        },
      });
      console.log("✅ User message queued:", userResponse.data);
    } catch (userErr) {
      console.log("⚠️ User message failed:", userErr.message);
    }

    console.log("📨 Queuing message to tenant (owner)...");
    try {
      const tenantResponse = await axios.post(`${process.env.REACT_APP_API_URL}/queue-message`, {
        to: formattedTenantPhone,
        category: "buyer-interest-owner",
        data: {
          userName,
          raId,
          location,
          userPhone: formattedUserPhone,
        },
      });
      console.log("✅ Tenant message queued:", tenantResponse.data);
    } catch (tenantErr) {
      console.log("⚠️ Tenant message failed:", tenantErr.message);
    }
  } catch (error) {
    console.log("⚠️ Error in send interest notification:", error.message);
  }
};

const handleSendInterest = async (id) => {   // ✅ receive id (not _id)
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/update-status-buyer-assistance-rent/${id}`,  // ✅ use id
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ra_status: 'rent-assistance-interest',
          userPhoneNumber: phoneNumber,  // ✅ phoneNumber you already have in state
        }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      setMessage('Interest Sent Successfully!');
      
      // Send WhatsApp notifications to both user and tenant for Send Interest
      await sendInterestNotification();
    } else {
      setMessage(`Failed to send interest: ${data.message}`);
    }
  } catch (error) {
    setError('Failed to load matched properties.');
  }
};


  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!requestData) return <p>No data found.</p>;
  
    const handleViewMore = (phoneNumber, rentId) => {
      // navigate("/detail", { state: { rentId, phoneNumber } });
      navigate(`/detail/${rentId}`, { state: {phoneNumber } });

    };


  return (
    <div className='d-flex justify-content-center algin-item-center w-100'>
    
    <div className='d-flex flex-column ' style={{maxWidth:"500px", width:"100%"}}>
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
      </button> <h3 className="m-0" style={{fontSize:"18px", fontWeight:"bold"}}>DETAILED TENANT ASSISTANT</h3> </div>

            {message && <div className="alert text-success text-bold">{message}</div>}



       <div className='d-flex algin-item-center justify-content-center w-100' style={{height:"200px"}}>

        <img src={imge} alt="" style={{width:"200px"}}/></div>
        <div className='d-flex algin-item-center justify-content-center w-100 mt-2'>    
              <div style={{background:"#C5C5C5", height:"2px", width:"90%"}}></div>
        </div>
        <div className="d-flex justify-content-center w-100">

        <div className='row w-100 mt-3 p-0'>
        <h5 className='ps-3 ms-3' style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px", fontSize:"15px" }}>Tenant Profile</h5>   
            <div className="d-flex align-items-center mb-3">
                      <div className="d-flex  flex-row align-items-start w-100 ps-3">
                      <div className="d-flex align-items-center col-6">
                          <FaRegIdCard color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                          <div>
                            <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
                            RA_ID                         </h6>
                            <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
                            {requestData.Ra_Id|| "N/A"}
                            </span>
                          </div>
                        </div>  
                     
      <div className="d-flex align-items-center col-6">
                          <CgProfile color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                          <div>
                            <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
                            NAME                         </h6>
                            <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
                            {requestData.baName || "N/A"}
                            </span>
                          </div>
                        </div>  
                        </div>
                        </div>

        <h5 className='ps-3 ms-3' style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px", fontSize:"15px" }}> Budget</h5>   
            <div className="d-flex align-items-center mb-3">
                      <div className="d-flex  flex-row align-items-start w-100 ps-3">
                      <div className="d-flex align-items-center col-6">
                          <FaRupeeSign color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                          <div>
                            <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
                            Minimum Amount                           </h6>
                            <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
                            {requestData.minPrice || "N/A"}
                            </span>
                          </div>
                        </div>  
                     
      <div className="d-flex align-items-center col-6">
                          <FaRupeeSign color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                          <div>
                            <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
                            Maximum Amount                           </h6>
                            <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
                            {requestData.maxPrice || "N/A"}
                            </span>
                          </div>
                        </div>  
                        </div>
                        </div>
           {/* Lookin for */}
           <h5 className='ps-3 ms-3' style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px", fontSize:"15px" }}> Looking for</h5>   
            <div className="d-flex align-items-center mb-3">
                      <div className="d-flex  flex-row align-items-start w-100 ps-3">
                      <div className="d-flex align-items-center col-6">
                          <BsBuildings   color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                          <div>
                            <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
                            Property Mode                           </h6>
                            <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
                            {requestData.propertyMode || "N/A"}
                            </span>
                          </div>
                        </div>  
                     
      <div className="d-flex align-items-center col-6">
                          <HiOutlineBuildingOffice2 color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                          <div>
                            <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
                           Property Type                           </h6>
                            <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
                            {requestData.propertyType || "N/A"}
                            </span>
                          </div>
                        </div>  
                        </div>
                        </div>
                        
             
            <div className="d-flex align-items-center mb-3">
                      <div className="d-flex  flex-row align-items-start w-100 ps-3">
                      <div className="d-flex align-items-center col-6">
                          <LiaBedSolid color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                          <div>
                            <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
                            Min.Bedroom                           </h6>
                            <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
                            {requestData.bedrooms || "N/A"} BHK
                            </span>
                          </div>
                        </div>  
                     
 

                        <div className="d-flex align-items-center col-6">
                          <RxDimensions color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                          <div>
                            <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
                            Minimum Area                             </h6>
                            <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
                            {requestData.totalArea || "N/A" }{requestData.areaUnit || "N/A"}
                            </span>
                          </div>
                        </div>  
                        </div>
                        </div>
                        
            {/* <div className="d-flex align-items-center mb-3">
                      <div className="d-flex  flex-row align-items-start w-100 ps-3">
                      <div className="d-flex align-items-center col-6">
                          <AiOutlineFileDone   color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                          <div>
                            <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
                            Approved                         </h6>
                            <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
                            {requestData.propertyApproved || "N/A"}
                            </span>
                          </div>
                        </div>  
                     
      <div className="d-flex align-items-center col-6">
                          <BsBank color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                          <div>
                            <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
                            Bank Loan                         </h6>
                            <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
                            {requestData.bankLoan || "N/A"}
                            </span>
                          </div>
                        </div>  
                        </div>
                        </div> */}
                        
                        
            <div className="d-flex align-items-center mb-3">
                      <div className="d-flex  flex-row align-items-start w-100 ps-3">
                      <div className="d-flex align-items-center col-6">
                          <RiCompass3Line color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                          <div>
                            <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
                            Select Facing                          </h6>
                            <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500", fontSize:"14px"}}>
                            {requestData.facing || "N/A"}
                            </span>
                          </div>
                        </div>  
                        </div>
                        </div> 
                        
<div className="d-flex align-items-center mb-3">
  <div className="d-flex flex-row align-items-start w-100 ps-3">

    {/* Buyer Phone Number */}
    {/* <div className="d-flex align-items-center col-6 mt-2" >
      <FaPhoneAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
      <div>
        <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
          Buyer Phone Number
        </h6>
        <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
          {requestData?.phoneNumber || "N/A"}
        </span>
      </div>
    </div> */}

 <div className="d-flex align-items-start col-12 mt-3">
        <FaPhoneAlt style={{ color: "#4F4B7E", fontSize: "20px", marginRight: "8px", marginTop: "6px" }} />
        <div>
          <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
            Tenant Phone Number
          </h6>

          {/* <div style={{ fontWeight: "500", color: "#1D1D1D", fontSize: "16px" }}>
            {showBuyerPhone ? requestData?.phoneNumber : "**********"}
          </div> */}

          <div style={{ fontWeight: "500", color: "#1D1D1D", fontSize: "16px" }}>
  {showBuyerPhone
    ? requestData?.phoneNumber
    : `${requestData?.phoneNumber?.slice(0, 5)}*****`}
</div>


          {/* Show View Contact Button only if phone is hidden */}
          {!showBuyerPhone && (
            <button
              className="btn btn-sm btn-outline-primary mt-2"
              onClick={handleCheckAccess}
              disabled={accessLoading}
            >
              {accessLoading ? "Checking..." : "View Contact"}
            </button>
          )}

          {/* Show Call Button only if phone is visible */}
          {showBuyerPhone && (
            <a
              href={`tel:${requestData?.phoneNumber}`}
              className="btn btn-sm btn-success mt-2 ml-2"
              style={{ marginLeft: "8px" }}
            >
              Call Tenant
            </a>
          )}

          {/* Optional Message */}
          {/* {message && (
            <div className="text-danger mt-2" style={{ fontSize: "14px" }}>
              {message}
            </div>
          )} */}
        </div>
      </div>


    {/* <div className="d-flex align-items-center col-6 mt-2">
  <FaPhoneAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
  <div>
    <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
      Interested User Phone
    </h6>
    <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
      {Array.isArray(requestData?.interestedUserPhone) && requestData?.interestedUserPhone.length > 0
        ? requestData.interestedUserPhone.join(", ")
        : "N/A"}
    </span>
  </div>
</div> */}

  </div>
</div>

                        <h5 className='ps-3 ms-3' style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px", fontSize:"15px" }}> Location Preffered</h5>   
                        <div className='ps-3 ms-3 mb-2' style={{ display: 'flex', alignItems: 'center' }}>
  <IoLocationOutline color='#4F4B7E' style={{ fontSize: '24px', flexShrink: 0, marginRight: '8px' }} />
  <p style={{ margin: 0, flex: 1 }}>{requestData.city ? requestData.city.charAt(0).toUpperCase() + requestData.city.slice(1).toLowerCase() : "N/A"}</p>

</div>


                        <h5 className='ps-3 ms-3' style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px", fontSize:"15px" }}>Description</h5>   

<div className=' ms-3 mb-3' style={{ display: 'flex', alignItems: 'center' }}>
  <HiOutlineNewspaper color='#4F4B7E' style={{ fontSize: '24px', flexShrink: 0, marginRight: '8px' }} />
  <p style={{ margin: 0, flex: 1 }}>{requestData.description || "No Description Available"}</p>
  
</div>

         


{/* <div className="d-flex align-items-center mb-3">
  <div className="d-flex flex-row align-items-start w-100 ps-3">
    <div className="d-flex align-items-center col-6">
      <LiaMoneyCheckSolid color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
      <div>
        <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
          Plan Name
        </h6>
        <span
          className="card-text"
          style={{ color: "#1D1D1D", fontWeight: "500", fontSize: "14px" }}
        >
          {planDetails?.planName || "N/A"}
        </span>
        
      </div>
    </div>

    <div className="d-flex align-items-center col-6">
      <LuCalendarDays color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
      <div>
        <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
          Expire Date
        </h6>
        <span
          className="card-text"
          style={{ color: "#1D1D1D", fontWeight: "500", fontSize: "14px" }}
        >
          {planDetails?.planExpiryDate || "N/A"}
        </span>
      </div>
    </div>
  </div>
</div> */}

                        <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-5 mb-5 col-12">


  <button
  className="btn text-white px-3 py-1 mx-1"
  style={{ background: "#3660FF", fontSize: "13px" }}
  onMouseOver={(e) => {
    e.target.style.background = "#CDC9F9"; // Brighter neon on hover
    e.target.style.fontWeight = 600; // Brighter neon on hover
    e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover

  }}
  onMouseOut={(e) => {
    e.target.style.background = "#3660FF"; // Original orange
    e.target.style.fontWeight = 400; // Brighter neon on hover

  }}  
  onClick={() => openConfirm("interest", requestData._id)}

>
  Send Interest
</button>


    <div>
      <button
        onClick={handleMatchClick}
        className="btn text-white px-3 py-1 mx-1"
        style={{ background: "#4F4B7E", fontSize: "13px" }}
      >
        Match Prop
      </button>

      {noMatchMessage && (
        <div style={{ marginTop: "10px", color: "red", fontSize: "14px" }}>
          {noMatchMessage}
        </div>
      )}
    </div>
  {/* <button className="btn text-white px-3 py-1 mx-1" style={{ background: "#0F9F2C", fontSize: "13px" }}
         onClick={() => openConfirm("pay", requestData)}

 onMouseOver={(e) => {
      e.target.style.background = "#32cd32"; // Neon green on hover
    }}
    onMouseOut={(e) => {
      e.target.style.background = "green"; // Original green
    }}>
    PAY Now
  </button> */}

    {/* <button
        className="btn text-white px-3 py-1 mx-1"
        style={{ background: "#0F9F2C", fontSize: "13px" }}
        onClick={handlePayNow}
        onMouseOver={(e) => {
          e.target.style.background = "#32cd32"; // Neon green on hover
        }}
        onMouseOut={(e) => {
          e.target.style.background = "#0F9F2C"; // Original green
        }}
      >
        PAY Now
      </button> */}
</div>
{showConfirm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 9999 }}
        >
          <div className="bg-white p-4 rounded shadow" style={{ width: "300px" }}>
            <h6 className="mb-3">
              {actionType === "interest" && "Are you sure you want to Send Interest?"}
              {actionType === "match" && "Do you want to view matching property?"}
              {actionType === "pay" && "Proceed with payment?"}
            </h6>
            <div className="d-flex justify-content-end">
              <button className="btn btn-secondary me-2" onClick={handleCancel}>
                No
              </button>
              <button className="btn btn-primary" onClick={handleConfirm}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}


       </div>
       </div>

    </div>
</div>
  );
}


