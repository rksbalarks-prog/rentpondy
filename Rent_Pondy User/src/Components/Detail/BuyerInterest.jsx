

// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { MdCall } from 'react-icons/md';
// import profil from '../../Assets/xd_profile.png'
// import {  FaCalendarAlt, FaChevronLeft } from "react-icons/fa";
// import { Button, Modal } from "react-bootstrap";
// import { FaArrowLeft } from "react-icons/fa";
// import NoData from "../../Assets/OOOPS-No-Data-Found.png";

// const App = () => {
//   const location = useLocation();
//   const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
//   const [phoneNumber] = useState(storedPhoneNumber);
//     const [properties, setProperties] = useState([]);
//   const [removedProperties, setRemovedProperties] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [activeTab, setActiveTab] = useState("all"); // "all" | "removed"
//   const [showFullNumber, setShowFullNumber] = useState(false);
//    const [showPopup, setShowPopup] = useState(false);
//    const [popupAction, setPopupAction] = useState(null);
//    const [popupMessage, setPopupMessage] = useState("");
//   // Load properties from localStorage on page load

//   const [interestBuyersCount, setInterestBuyersCount] = useState(0);
//   const [callList, setCallList] = useState([]);

//   const [hover, setHover] = useState(false);
//     const [hoverDelete, setHoverDelete] = useState(false);
//     const [hoverEdit, setHoverEdit] = useState(false);
  
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
//   useEffect(() => {
//     if (!phoneNumber) {
//       setLoading(false);
//       return;
//     }

//     const fetchInterestBuyersCount = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/interest-buyers-count/${phoneNumber}`
//         );

//         if (response.status === 200) {
//           setInterestBuyersCount(response.data.interestBuyersCount);
//         }
//       } catch (error) {
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInterestBuyersCount();
//   }, [phoneNumber]);


//    useEffect(() => {
//       const recordDashboardView = async () => {
//         try {
//           await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
//             phoneNumber: phoneNumber,
//             viewedFile: "Buyer Interest",
//             viewTime: new Date().toISOString(),
//           });
//         } catch (err) {
//         }
//       };
    
//       if (phoneNumber) {
//         recordDashboardView();
//       }
//     }, [phoneNumber]);
  
// useEffect(() => {
//   if (message) {
//     const timer = setTimeout(() => setMessage(""), 5000); // Auto-close after 3 seconds
//     return () => clearTimeout(timer); // Cleanup timer
//   }
// }, [message]);

//   useEffect(() => {
//     const storedProperties = JSON.parse(localStorage.getItem("interestProperties")) || [];
//     const storedRemovedProperties = JSON.parse(localStorage.getItem("removedProperties")) || [];

//     setProperties(storedProperties);
//     setRemovedProperties(storedRemovedProperties);
//   }, []);
//   const confirmAction = (message, action) => {
//     setPopupMessage(message);
//     setPopupAction(() => action);
//     setShowPopup(true);
//   };
//   // Sync properties with localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem("interestProperties", JSON.stringify(properties));
//   }, [properties]);

//   useEffect(() => {
//     localStorage.setItem("removedProperties", JSON.stringify(removedProperties));
//   }, [removedProperties]);

//   // // Fetch interested properties from API
//   // useEffect(() => {
//   //   if (!phoneNumber) {
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   const fetchInterestedProperties = async () => {
//   //     try {
//   //       const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-interest-buyers`, {
//   //         params: { postedPhoneNumber: phoneNumber },
//   //       });

//   //       if (response.status === 200) {
//   //         const transformedProperties = response.data.propertiesData.map((property) => ({
//   //           ...property,
//   //           interestedUsers: property.interestedUsers.filter(
//   //             (user) => user && user !== "undefined"
//   //           ),
//   //         }));

//   //         setProperties(transformedProperties);
//   //         localStorage.setItem("interestProperties", JSON.stringify(transformedProperties)); // Save to localStorage
//   //       }
//   //     } catch (error) {
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchInterestedProperties();
//   // }, [phoneNumber]);


// //   useEffect(() => {
// //   if (!phoneNumber) {
// //     setLoading(false);
// //     return;
// //   }

// //   const fetchData = async () => {
// //     try {
// //       // Get property + users
// //       const propertyRes = await axios.get(`${process.env.REACT_APP_API_URL}/get-interest-buyers-rent`, {
// //         params: { postedPhoneNumber: phoneNumber },
// //       });

// //       // Get latest PayU status
// //       const statusRes = await axios.get(`${process.env.REACT_APP_API_URL}/payustatus-users`);

// //       if (propertyRes.status === 200 && statusRes.status === 200) {
// //         const statusMap = {};
// //         statusRes.data.forEach(({ rentId, status }) => {
// //           statusMap[rentId] = status; // status: "paid", "pending", etc.
// //         });

     

// //         // Merge status into property list
// // let transformedProperties = propertyRes.data.propertiesData.map((property) => ({
// //   ...property,
// //   interestedUsers: property.interestedUsers.filter(
// //     (user) => user && user !== "undefined"
// //   ),
// //   payuStatus: statusMap[property.rentId] || "unpaid",
// // }));

// // // ✅ Sort by updatedAt or createdAt (desc)
// // transformedProperties = transformedProperties.sort(
// //   (a, b) =>
// //     new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
// // );



// //         setProperties(transformedProperties);
// //         localStorage.setItem("interestProperties", JSON.stringify(transformedProperties));
// //       }
// //     } catch (error) {
// //       console.error("Error fetching properties or statuses", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   fetchData();
// // }, [phoneNumber]);



// const fetchData = async () => {
//   try {
//     // Step 1: Get property + interested users
//     const propertyRes = await axios.get(`${process.env.REACT_APP_API_URL}/get-interest-buyers-rent`, {
//       params: { postedPhoneNumber: phoneNumber },
//     });

//     // Step 2: Get latest PayU status
//     const statusRes = await axios.get(`${process.env.REACT_APP_API_URL}/payustatus-users`);

//     if (propertyRes.status === 200 && statusRes.status === 200) {
//       const statusMap = {};
//       statusRes.data.forEach(({ rentId, status }) => {
//         if (rentId) statusMap[rentId] = status; // paid/unpaid
//       });

//       // Step 3: Enrich each property with PayU + Property Message
//       const enrichedProperties = await Promise.all(
//         propertyRes.data.propertiesData.map(async (property) => {
//           let propertyMessage = null;
//           try {
//             const msgRes = await axios.get(
//               `${process.env.REACT_APP_API_URL}/user/property-message/${property.rentId}`
//             );
//             propertyMessage = msgRes.data?.data?.message || null;
//           } catch {
//             propertyMessage = null;
//           }

//           return {
//             ...property,
//             interestedUsers: (property.interestedUsers || []).filter(
//               (user) => user && user !== "undefined"
//             ),
//             payuStatus: statusMap[property.rentId] || "unpaid",
//             propertyMessage,
//           };
//         })
//       );

//       // Step 4: Sort by updatedAt or createdAt
//       const sortedProperties = enrichedProperties.sort(
//         (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
//       );

//       setProperties(sortedProperties);
//       localStorage.setItem("interestProperties", JSON.stringify(sortedProperties));
//     }
//   } catch (error) {
//     console.error("Error fetching properties or statuses", error);
//   } finally {
//     setLoading(false);
//   }
// };

// useEffect(() => {
//   if (phoneNumber) {
//     fetchData();
//   }
// }, [phoneNumber]);




//   // ✅ Remove Interest & Move to Removed List
//   const handleRemoveProperty = async (rentId, interestedUser) => {
//     // if (!window.confirm("Are you sure you want to remove this interest?")) return;
//     confirmAction("Are you sure you want to remove this interest?", async () => {

//     try {
//       await axios.put(`${process.env.REACT_APP_API_URL}/interest/delete/${rentId}/${interestedUser}`);

//       const updatedProperties = properties.map((property) =>
//         property.rentId === rentId
//           ? {
//               ...property,
//               interestedUsers: property.interestedUsers.filter((user) => user !== interestedUser),
//             }
//           : property
//       );

//       const removedItem = {
//         rentId,
//         interestedUser,
//       };

//       setProperties(updatedProperties);
//       setMessage({ text: "Interest Deleted successfully!", type: "success" });

//       setRemovedProperties([...removedProperties, removedItem]);
//     } catch (error) {
//       setMessage({ text: "Error deleting interest.", type: "error" });
//     }
//     setShowPopup(false);

//   });
//   };


//   const handleUndoRemove = async (rentId, interestedUser) => {
//     // if (!window.confirm("Do you want to restore this interest?")) return;
//     confirmAction("Do you want to restore this interest?", async () => {

//     try {
//       const response = await axios.put(`${process.env.REACT_APP_API_URL}/interest/undo/${rentId}/${interestedUser}`);

//       const restoredProperty = response.data.property;

//       setRemovedProperties(removedProperties.filter((item) => item.interestedUser !== interestedUser));

//       setProperties((prev) =>
//         prev.map((property) =>
//           property.rentId === rentId
//             ? { ...property, interestedUsers: restoredProperty.interestRequests.map(req => req.phoneNumber) }
//             : property
//         )
//       );

//       setMessage({ text: "Interest restored successfully!", type: "success" });

//     } catch (error) {
//       setMessage({ text: error.response?.data?.message || "Error restoring interest.", type: "error" });
//     }
//     setShowPopup(false);

//   });
// };

// const handleContact = (rentId, userPhone) => {
//   confirmAction("Do you want to call this user?", async () => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/contact-send-rent-property`, {
//         rentId,
//         phoneNumber: userPhone,
//       });

//       if (response.data.success) {
//         setMessage({ text: "Contact saved successfully", type: "success" });
//         window.location.href = `tel:${userPhone}`;
//       } else {
//         setMessage({ text: "Contact failed", type: "error" });
//       }
//     } catch (error) {
//       setMessage({ text: "An error occurred", type: "error" });
//     }
//     setShowPopup(false);
//   });
// };

// const navigate = useNavigate();

// const handlePayNow = (rentId, user) => {
//   navigate("/pricing-plans", {
//     state: {
//       phoneNumber: user.phoneNumber,
//       rentId,
//     },
//   });
// };


//   return (
//     <div className="container d-flex align-items-center justify-content-center p-0" style={{fontFamily:"Inter, sans-serif",}}>
     
//      <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', margin: 'auto', width: '100%', }}>
//               <div className="d-flex align-items-center justify-content-start w-100 p-2"      style={{
//         background: "#EFEFEF",
//         position: "sticky",
//         top: 0,
//         zIndex: 1000,
//         opacity: isScrolling ? 0 : 1,
//         pointerEvents: isScrolling ? "none" : "auto",
//         transition: "opacity 0.3s ease-in-out",
//       }}>
//               <button    
//                className="d-flex align-items-center justify-content-center ps-3 pe-2"

//       onClick={() => navigate(-1)}
//       style={{
//           background: "transparent",
//       border: "none",
//       height: "100%",color:"#CDC9F9",
//         cursor: 'pointer',
//         transition: 'all 0.3s ease-in-out',
  
//       }}
//       onMouseEnter={(e) => {
//         e.currentTarget.style.color = '#f0f4f5'; // Change background
//         e.currentTarget.querySelector('svg').style.color = '#4F4B7E'; // Change icon color
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.color = '#CDC9F9';
//         e.currentTarget.querySelector('svg').style.color = '#CDC9F9';
//       }}
//     >
//       <FaChevronLeft style={{ color: '#CDC9F9', transition: 'color 0.3s ease-in-out' , background:"transparent"}} />
//       </button> <h3 className="m-0 " style={{fontSize:"18px"}}>BUYER INTEREST</h3> </div>

//       {/* Tabs */}
//       <div className="row g-2 w-100">
//       <div className="col-6 p-0">

//         <button style={{ backgroundColor: '#4F4B7E', color: 'white' , width:"100%" ,border:"none", padding:"5px"}} onClick={() => setActiveTab("all")} className={activeTab === "all" ? "active" : ""}>
//           All Properties
//         </button>
//         </div>

//         <div className="col-6 p-0">

//         <button style={{ backgroundColor: '#FFFFFF', color: 'grey' , width:"100%" ,border:"none", padding:"5px" }} onClick={() => setActiveTab("removed")} className={activeTab === "removed" ? "active" : ""}>
//           Removed Properties
//         </button>
//         </div>

      

//       {/* Display Messages */}
//       <div>
//       {message && <p style={{ color: message.type === "success" ? "green" : "red" }}>{message.text}</p>}
//       <Modal show={showPopup} onHide={() => setShowPopup(false)}>
//         <Modal.Body>
//           <p>{popupMessage}</p>
//           <Button style={{ background:  "#4F4B7E", width: "80px", fontSize: "13px", border:"none" }} onClick={popupAction}
//              onMouseOver={(e) => {
//               e.target.style.background = "#FF6700"; // Brighter neon on hover
//               e.target.style.fontWeight = 600; // Brighter neon on hover
//               e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
//             }}
//             onMouseOut={(e) => {
//               e.target.style.background = "#FF4500"; // Original orange
//               e.target.style.fontWeight = 400; // Brighter neon on hover
    
//             }}>Yes</Button>
//           <Button className="ms-3" style={{ background:  "#FF0000", width: "80px", fontSize: "13px" , border:"none"}} onClick={() => setShowPopup(false)}
//               onMouseOver={(e) => {
//                 e.target.style.background = "#029bb3"; // Brighter neon on hover
//                 e.target.style.fontWeight = 600; // Brighter neon on hover
//                 e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
      
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.background = "#4F4B7E"; // Original orange
//                 e.target.style.fontWeight = 400; // Brighter neon on hover
      
//               }}>No</Button>
//         </Modal.Body>
//       </Modal>
//     </div>
//       {loading ? (
//       <div className="text-center my-4 "
//       style={{
//         position: 'fixed',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',

//       }}>
//         <span className="spinner-border text-primary" role="status" />
//         <p className="mt-2">Loading properties...</p>
//       </div>      ) : activeTab === "all" ? (
//         // Show all properties with interested users
//         properties.length > 0 ? (
//           properties.map((property , index) => (
//             <div key={property.rentId}               onClick={() => navigate(`/detail/${property.rentId}`)}
//  className="property-card">
//               <div className="buyers-list">
//                 {Array.isArray(property.interestedUsers) && property.interestedUsers.length > 0 ? (
//                   property.interestedUsers.map((user, index) => (
//                     <div
//             key={index}
//             className="card p-2 w-100 w-md-50 w-lg-33"
//             style={{
//               border: "1px solid #ddd",
//               borderRadius: "10px",
//               overflow: "hidden",
//               marginBottom: "15px",
//               fontFamily: "Inter, sans-serif",
//             }}
//           >
//             <div className="row d-flex align-items-center">
//               <div className="col-3 d-flex align-items-center justify-content-center mb-1">
//                 <img
//                   src={profil}
//                   alt="Placeholder"
//                   className="rounded-circle mt-2"
//                   style={{ width: "80px", height: "80px", objectFit: "cover" }}
//                 />
      
//               </div>
//               <div className='p-0' style={{background:"#707070", width:"2px", height:"80px"}}></div>
//               <div className="col-7 p-0 ms-4">
//                 <div className='text-center rounded-1 w-100 mb-1' style={{border:"2px solid #4F4B7E", color:"#4F4B7E", fontSize:"13px"}}>INTERESTED BUYER</div>
//                 <div className="d-flex">
//                   <p className="mb-1 me-3" style={{ color: "#474747", fontWeight: "500",fontSize:"12px" }}>
//                  RENT ID- {property.rentId}
//                   </p>

//  {property.propertyMessage && (
//     <span 
//       className="me-2" 
//       style={{
//         color: "#FF0000",
//         fontWeight: "bold",
//         fontSize: "12px"
//       }}
//     >
//       {property.propertyMessage}
//     </span>
//   )}

//                 </div>    
      
//                 <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500",fontSize:"16px" }}>
//                   {property.propertyType || "N/A"} |{property.city || "N/A"}
//                 </h5>
             
//               </div>
//             </div>
      
//             <div className="p-1">
      
//               <div className="d-flex align-items-center mb-2">
//               <div className="d-flex  flex-row align-items-start justify-content-between ps-3">
      
               
//                 {/* <div className="d-flex align-items-center ">
//                   <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                   <div>
//                     <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>
//                        Buyer Phone
//                     </h6>
//                     <span className="card-text" style={{ fontWeight: "500" }}>
//           {property.payuStatus === "paid" ? (
//             <a href={`tel:${user}`} style={{ textDecoration: "none", color: "#1D1D1D" }}>
//               {showFullNumber ? user : user.slice(0, 5) + "*****"}
//             </a>
//           ) : (
//             <span style={{ color: "#999" }}>Hidden</span>
//           )}
//         </span>
//                   </div>
//                 </div>
//                 <div className="d-flex align-items-center ms-3">
//                   <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                   <div>
//                     <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>
//                     Interest Received Date
//                     </h6>
//                     <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500"}}>
//                     {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
//                     </span>
//                   </div>
//                 </div> */}
//                 </div>
//                           </div>
// <div className="d-flex align-items-center mb-2">
//   <div className="d-flex  flex-row align-items-start justify-content-between ps-3">

//     {/* 👇 Phone number and interest date */}
//     <div className="d-flex align-items-center ">
//       <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//       <div>
//         <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>
//           Buyer Phone
//         </h6>

//         {/* <span className="card-text" style={{ fontWeight: "500" }}>
//           {property.payuStatus === "paid" ? (
//             <a href={`tel:${user}`} style={{ textDecoration: "none", color: "#1D1D1D" }}>
//               {showFullNumber ? user : user.slice(0, 5) + "*****"}
//             </a>
//           ) : (
//             <span style={{ color: "#999" }}>Hidden</span>
//           )}
//         </span> */}

//         <span className="card-text" style={{ fontWeight: "500" }}>
//   <a
//     href={`tel:${user}`}
//     style={{ textDecoration: "none", color: "#1D1D1D" }}
//   >
//     {property.payuStatus === "paid"
//       ? user
//       : user.slice(0, 5) + "*****"}
//   </a>
// </span>

//       </div>
//     </div>

//     <div className="d-flex align-items-center ms-3">
//       <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//       <div>
//         <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>
//           Interest Received Date
//         </h6>
//         {/* <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
//           {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
//         </span> */}
// <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
//   {(property.updatedAt || property.createdAt)
//     ? new Date(property.updatedAt || property.createdAt).toLocaleDateString('en-IN', {
//         day: 'numeric',
//         month: 'short',
//         year: 'numeric',
//       })
//     : 'N/A'}
// </span>


//       </div>
//     </div>

//   </div>
// </div>

// {/* 👇 Action buttons area based on PayU status */}
// {property.payuStatus === "paid" ? (
//   <>
//     {!showFullNumber && (
//       <button
//         className='w-100 m-0 p-1'
//         onClick={(e) => {
//           e.stopPropagation();
//           setShowFullNumber(true);
//         }}
//         style={{
//           background: "#4F4B7E",
//           color: "white",
//           border: "none",
//           marginLeft: "10px",
//           cursor: "pointer",
//           borderRadius: "5px"
//         }}>
//         View
//       </button>
//     )}

//     {showFullNumber && (
//       <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
//         <button
//           className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//           style={{ background: "#4F4B7E", width: "80px", fontSize: "13px" }}
//           onClick={(e) => {
//             e.stopPropagation();
//             handleContact(property.rentId, user);
//           }}
//         >
//           Call
//         </button>
//         <button
//           className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//           style={{
//             background: hoverDelete ? 'red' : '#FF4500',
//             color: '#fff',
//             width: "80px",
//             fontSize: "13px",
//             transition: 'all 0.3s ease'
//           }}
//           onMouseEnter={() => setHoverDelete(true)}
//           onMouseLeave={() => setHoverDelete(false)}
//           onClick={(e) => {
//             e.stopPropagation();
//             handleRemoveProperty(property.rentId, user);
//           }}
//         >
//           Remove
//         </button>
//       </div>
//     )}
//   </>
// ) : (
//   <>
//     <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
//       <button
//         className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//         style={{ background: "#FFB100", width: "80px", fontSize: "13px" }}
//          onClick={(e) => {
//     e.stopPropagation(); // ✅ prevent parent click
//           handlePayNow(property.rentId,user)
//   }}
      
//       >
//         Pay Now
//       </button>
//       <button
//         className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//         style={{
//           background: hoverDelete ? 'red' : '#FF4500',
//           color: '#fff',
//           width: "80px",
//           fontSize: "13px",
//           transition: 'all 0.3s ease'
//         }}
//         onMouseEnter={() => setHoverDelete(true)}
//         onMouseLeave={() => setHoverDelete(false)}
//         onClick={(e) => {
//           e.stopPropagation();
//           handleRemoveProperty(property.rentId, user);
//         }}
//       >
//         Remove
//       </button>
//     </div>
//   </>
// )}


//               {/* {!showFullNumber && (
//           <button className='w-100 m-0 p-1'
//           onClick={(e) =>{e.stopPropagation(); 
//             setShowFullNumber(true)}}
//           style={{
//               background: "#4F4B7E", 
//               color: "white", 
//               border: "none", 
             
//               marginLeft: "10px", 
//               cursor: "pointer",
//               borderRadius: "5px"
//             }}>
//             View
//           </button>
//         )}
//           {showFullNumber
//             ?  <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
//                       <button
//   className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//   style={{ background: "#4F4B7E", 
//     width: "80px", fontSize: "13px" }}
//                         onClick={(e) =>    { e.stopPropagation();
//                           handleContact(property.rentId, user)}}
//                       >
//                         Call
//                       </button>
// <button
//         className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//         style={{
//           background: hoverDelete ? 'red' : '#FF4500',
//           color: '#fff',
//           width: "80px", fontSize: "13px",
//           transition: 'all 0.3s ease'
//         }}
//         onMouseEnter={() => setHoverDelete(true)}
//         onMouseLeave={() => setHoverDelete(false)}
//         onClick={(e) =>
//       {    e.stopPropagation();
//            handleRemoveProperty(property.rentId, user)}}
//         >
//         Remove
//       </button>
           
//             </div>
//             : ''}
//             */}
//             </div>
//           </div>
//                   ))
//                 ) : (
//                   <p></p>
//                 )}
//               </div>
//             </div>
//           ))
//         ) : (
// <div className="text-center my-4 "
//     style={{
//       position: 'fixed',
//       top: '50%',
//       left: '50%',
//       transform: 'translate(-50%, -50%)',

//     }}>
// <img src={NoData} alt="" width={100}/>      
// <p>No properties found.</p>
// </div>       
//  )
//       ) : (
//         // Show removed properties with Undo button
//         removedProperties.length > 0 ? (
//           removedProperties.map((property, index) => (
//             <div
//             key={property.rentId}
//             className="card p-2 w-100 w-md-50 w-lg-33"
//             style={{
//               border: "1px solid #ddd",
//               borderRadius: "10px",
//               overflow: "hidden",
//               marginBottom: "15px",
//               fontFamily: "Inter, sans-serif",
//             }}
//           >
//             <div className="row d-flex align-items-center">
//               <div className="col-3 d-flex align-items-center justify-content-center mb-1">
//                 <img
//                   src={profil}
//                   alt="Placeholder"
//                   className="rounded-circle mt-2"
//                   style={{ width: "80px", height: "80px", objectFit: "cover" }}
//                 />
      
//               </div>
//               <div className='p-0' style={{background:"#707070", width:"2px", height:"80px"}}></div>
//               <div className="col-7 p-0 ms-4">
//                 <div className='text-center rounded-1 w-100 mb-1' style={{border:"2px solid #4F4B7E", color:"#4F4B7E", fontSize:"14px"}}>Buyer Interest</div>
//                 <div className="d-flex">
//                   <p className="mb-1" style={{ color: "#474747", fontWeight: "500",fontSize:"12px" }}>
//                   Rent Id- {property.rentId}
//                   </p>
//                 </div>    
//         <p className="mb-1" style={{ color: "#474747", fontWeight: "500",fontSize:"12px" }}>
//                    {property.propertyMode}
//                   </p>
//                 <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500",fontSize:"16px" }}>
//                   {property.propertyType || "N/A"} |{property.city || "N/A"}
//                 </h5>
             
//               </div>
//             </div>
      
//             <div className="p-1 mt-1">
      
//               <div className="d-flex align-items-center mb-2">
//               <div className="d-flex  flex-row align-items-start justify-content-between ps-3">
      
              
//                 <div className="d-flex align-items-center">
//                   <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                   <div>
//                     <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
//                        Buyer Phone
//                     </h6>
//                     <span className="card-text" style={{  fontWeight:"500"}}>
//                     <a href={`tel:${property.interestedUser}`} style={{ textDecoration: "none", color: "#1D1D1D" }}>
//           {showFullNumber
//             ? property.interestedUser
//             : property.interestedUser?.slice(0, 5) + "*****"}
//         </a>
//                     </span>
//                   </div>
//                 </div>
//                   {/* <div className="d-flex align-items-center ms-3">
//       <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//       <div>
//         <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>
//           Interest Received Date
//         </h6>
//         <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
//           {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
//         </span>
//       </div>
//     </div> */}
//                 </div>
//                           </div>
//               {!showFullNumber && (
//           <button className='w-100 m-0 p-1'
//             onClick={(e) =>{e.stopPropagation();
//                setShowFullNumber(true)}}
//             style={{
//               background: "#4F4B7E", 
//               color: "white", 
//               border: "none", 
             
//               marginLeft: "10px", 
//               cursor: "pointer",
//               borderRadius: "5px"
//             }}>
//             View
//           </button>
//         )}
//           {showFullNumber
//             ?  <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
          
//                   <button
//               className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//               style={{ background:  "#4F4B7E", width: "80px", fontSize: "13px" }}
//               onClick={(e) =>    {e.stopPropagation();
//                 (window.location.href = `tel:${ property.interestedUser}`)}}

//            >
//               Call
//             </button>   
       
// <button
//       className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//       style={{
//         background: hover ?  'green':'#19575f' , // hover vs default
//         color: hover ? '#e0f7fa' : '#fff',         // text color on hover
//         width: "80px", fontSize: "13px",
//         transition: 'all 0.3s ease'
//       }}
//       onMouseEnter={() => setHover(true)}
//       onMouseLeave={() => setHover(false)}
//       onClick={(e) => {
//         e.stopPropagation();
//         handleUndoRemove(property.rentId, property.interestedUser)}}
//       >
//       Undo
//     </button>

//             </div>
//             : ''}
           
//             </div>
//           </div>
//           ))
//         ) : (
//           <p>No removed properties.</p>
//         )
//       )}
//             </div>

//           </div>

//     </div>
//   );
// };

// export default App;















































import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MdCall } from 'react-icons/md';
import profil from '../../Assets/xd_profile.png';
import { FaCalendarAlt, FaChevronLeft } from "react-icons/fa";
import { Button, Modal } from "react-bootstrap";
import NoData from "../../Assets/OOOPS-No-Data-Found.png";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const [phoneNumber] = useState(storedPhoneNumber);
  const [properties, setProperties] = useState([]);
  const [removedProperties, setRemovedProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("all");
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupAction, setPopupAction] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [isScrolling, setIsScrolling] = useState(false);

  // Handle scroll behavior
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

  // Fetch properties data
  const fetchData = async () => {
    try {
      const propertyRes = await axios.get(`${process.env.REACT_APP_API_URL}/get-interest-buyers-rent`, {
        params: { postedPhoneNumber: phoneNumber },
      });

      const statusRes = await axios.get(`${process.env.REACT_APP_API_URL}/payustatus-users`);

      if (propertyRes.status === 200 && statusRes.status === 200) {
        const statusMap = {};
        statusRes.data.forEach(({ rentId, status }) => {
          if (rentId) statusMap[rentId] = status;
        });

        const enrichedProperties = await Promise.all(
          propertyRes.data.propertiesData.map(async (property) => {
            let propertyMessage = null;
            try {
              const msgRes = await axios.get(
                `${process.env.REACT_APP_API_URL}/user/property-message/${property.rentId}`
              );
              propertyMessage = msgRes.data?.data?.message || null;
            } catch {
              propertyMessage = null;
            }

            return {
              ...property,
              interestedUsers: (property.interestedUsers || []).filter(
                (user) => user && user !== "undefined"
              ),
              payuStatus: statusMap[property.rentId] || "unpaid",
              propertyMessage,
            };
          })
        );

        const sortedProperties = enrichedProperties.sort(
          (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        );

        setProperties(sortedProperties);
        localStorage.setItem("interestProperties", JSON.stringify(sortedProperties));
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phoneNumber) {
      fetchData();
    }
  }, [phoneNumber]);

  // Handle contact confirmation and API call
  const handleContact = async (rentId, userPhone) => {
    confirmAction("Do you want to call this user?", async () => {
      try {
        const property = properties.find(p => p.rentId === rentId);
        if (!property) {
          setMessage({ text: "Property not found", type: "error" });
          return;
        }

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/contact-send-property`,
          {
            userPhone: userPhone,
            postedUserPhone: phoneNumber,
            rentId: rentId,
            status: "contactSend"
          }
        );

        if (response.data.success) {
          setMessage({ 
            text: "Contact saved successfully", 
            type: "success" 
          });
          window.location.href = `tel:${userPhone}`;
        } else {
          setMessage({ 
            text: response.data.message || "Contact failed", 
            type: "error" 
          });
        }
      } catch (error) {
        setMessage({ 
          text: error.response?.data?.message || "An error occurred", 
          type: "error" 
        });
      }
    });
  };


  
  // ✅ Remove Interest & Move to Removed List
  const handleRemoveProperty = async (rentId, interestedUser) => {
    // if (!window.confirm("Are you sure you want to remove this interest?")) return;
    confirmAction("Are you sure you want to remove this interest?", async () => {

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/interest/delete/${rentId}/${interestedUser}`);

      const updatedProperties = properties.map((property) =>
        property.rentId === rentId
          ? {
              ...property,
              interestedUsers: property.interestedUsers.filter((user) => user !== interestedUser),
            }
          : property
      );

      const removedItem = {
        rentId,
        interestedUser,
      };

      setProperties(updatedProperties);
      setMessage({ text: "Interest Deleted successfully!", type: "success" });

      setRemovedProperties([...removedProperties, removedItem]);
    } catch (error) {
      setMessage({ text: "Error deleting interest.", type: "error" });
    }
    setShowPopup(false);

  });
  };


  const handleUndoRemove = async (rentId, interestedUser) => {
    // if (!window.confirm("Do you want to restore this interest?")) return;
    confirmAction("Do you want to restore this interest?", async () => {

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/interest/undo/${rentId}/${interestedUser}`);

      const restoredProperty = response.data.property;

      setRemovedProperties(removedProperties.filter((item) => item.interestedUser !== interestedUser));

      setProperties((prev) =>
        prev.map((property) =>
          property.rentId === rentId
            ? { ...property, interestedUsers: restoredProperty.interestRequests.map(req => req.phoneNumber) }
            : property
        )
      );

      setMessage({ text: "Interest restored successfully!", type: "success" });

    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Error restoring interest.", type: "error" });
    }
    setShowPopup(false);

  });
};

const handlePayNow = (rentId, user) => {
  navigate("/pricing-plans", {
    state: {
      phoneNumber: user.phoneNumber,
      rentId,
    },
  });
};

  // Confirmation dialog helper
  const confirmAction = (message, action) => {
    setPopupMessage(message);
    setPopupAction(() => action);
    setShowPopup(true);
  };

  // Render property cards
  const renderPropertyCard = (property, user, isRemoved = false) => {
    return (
      <div
        key={`${property.rentId}-${user}`}
        className="card p-2 w-100"
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "15px",
          fontFamily: "Inter, sans-serif",
        }}
        onClick={() => navigate(`/detail/${property.rentId}`)}
      >
        <div className="row d-flex align-items-center">
          <div className="col-3 d-flex align-items-center justify-content-center mb-1">
            <img
              src={profil}
              alt="Profile"
              className="rounded-circle mt-2"
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
          </div>
          <div className='p-0' style={{background:"#707070", width:"2px", height:"80px"}}></div>
          <div className="col-7 p-0 ms-4">
            <div className='text-center rounded-1 w-100 mb-1' style={{border:"2px solid #4F4B7E", color:"#4F4B7E", fontSize:"13px"}}>
              {isRemoved ? "REMOVED BUYER" : "INTERESTED BUYER"}
            </div>
            <div className="d-flex">
              <p className="mb-1 me-3" style={{ color: "#474747", fontWeight: "500",fontSize:"12px" }}>
                RENT ID- {property.rentId}
              </p>
              
              {property.propertyMessage && (
                <span className="me-2" style={{ color: "#FF0000", fontWeight: "bold", fontSize: "12px" }}>
                  {property.propertyMessage}
                </span>
              )}
            </div>
            <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500",fontSize:"16px" }}>
              {property.propertyType || "N/A"} | {property.city || "N/A"}
            </h5>
          </div>
        </div>

        <div className="p-1">
          <div className="d-flex align-items-center mb-2">
            <div className="d-flex flex-row align-items-start justify-content-between ps-3">
              <div className="d-flex align-items-center">
                <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                <div>
                  <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Buyer Phone</h6>
                  <span className="card-text" style={{ fontWeight: "500" }}>
                    <a
                      href={`tel:${user}`}
                      style={{ textDecoration: "none", color: "#1D1D1D" }}
                    >
                      {property.payuStatus === "paid" ? user : user.slice(0, 5) + "*****"}
                    </a>
                  </span>
                </div>
              </div>

              <div className="d-flex align-items-center ms-3">
                <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                <div>
                  <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Interest Date</h6>
                  <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
                    {(property.updatedAt || property.createdAt)
                      ? new Date(property.updatedAt || property.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {property.payuStatus === "paid" ? (
            <>
              {!showFullNumber ? (
                <button
                  className='w-100 m-0 p-1'
                  onClick={(e) => { e.stopPropagation(); setShowFullNumber(true); }}
                  style={{
                    background: "#4F4B7E",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "5px"
                  }}
                >
                  View
                </button>
              ) : (
                <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
                  <button
                    className="btn text-white px-3 py-1 flex-grow-1 mx-1"
                    style={{ background: "#4F4B7E", width: "80px", fontSize: "13px" }}
                    onClick={(e) => { e.stopPropagation(); handleContact(property.rentId, user); }}
                  >
                    Call
                  </button>
                  <button
                    className="btn text-white px-3 py-1 flex-grow-1 mx-1"
                    style={{ background: "#FF4500", width: "80px", fontSize: "13px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      isRemoved 
                        ? handleUndoRemove(property.rentId, user)
                        : handleRemoveProperty(property.rentId, user);
                    }}
                  >
                    {isRemoved ? "Undo" : "Remove"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
              <button
                className="btn text-white px-3 py-1 flex-grow-1 mx-1"
                style={{ background: "#FFB100", width: "80px", fontSize: "13px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePayNow(property.rentId, user);
                }}
              >
                Pay Now
              </button>
              <button
                className="btn text-white px-3 py-1 flex-grow-1 mx-1"
                style={{ background: "#FF4500", width: "80px", fontSize: "13px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  isRemoved 
                    ? handleUndoRemove(property.rentId, user)
                    : handleRemoveProperty(property.rentId, user);
                }}
              >
                {isRemoved ? "Undo" : "Remove"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container d-flex align-items-center justify-content-center p-0" style={{fontFamily:"Inter, sans-serif"}}>
      <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', margin: 'auto', width: '100%' }}>
        <div className="d-flex align-items-center justify-content-start w-100 p-2" style={{
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
              height: "100%",
              color:"#CDC9F9",
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <FaChevronLeft style={{ color: '#CDC9F9', transition: 'color 0.3s ease-in-out', background:"transparent"}} />
          </button> 
          <h3 className="m-0" style={{fontSize:"18px"}}>BUYER INTEREST</h3> 
        </div>

        <div className="row g-2 w-100">
          <div className="col-6 p-0">
            <button 
              style={{ backgroundColor: '#4F4B7E', color: 'white', width:"100%", border:"none", padding:"5px" }} 
              onClick={() => setActiveTab("all")}
            >
              All Properties
            </button>
          </div>
          <div className="col-6 p-0">
            <button 
              style={{ backgroundColor: '#FFFFFF', color: 'grey', width:"100%", border:"none", padding:"5px" }} 
              onClick={() => setActiveTab("removed")}
            >
              Removed Properties
            </button>
          </div>

          {message && <div className="col-12"><p style={{ color: message.type === "success" ? "green" : "red" }}>{message.text}</p></div>}

          <Modal show={showPopup} onHide={() => setShowPopup(false)}>
            <Modal.Body>
              <p>{popupMessage}</p>
              <Button 
                style={{ background: "#4F4B7E", width: "80px", fontSize: "13px", border:"none" }} 
                onClick={() => {
                  popupAction();
                  setShowPopup(false);
                }}
              >
                Yes
              </Button>
              <Button 
                className="ms-3" 
                style={{ background: "#FF0000", width: "80px", fontSize: "13px", border:"none"}} 
                onClick={() => setShowPopup(false)}
              >
                No
              </Button>
            </Modal.Body>
          </Modal>

          {loading ? (
            <div className="text-center my-4" style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}>
              <span className="spinner-border text-primary" role="status" />
              <p className="mt-2">Loading properties...</p>
            </div>
          ) : activeTab === "all" ? (
            properties.length > 0 ? (
              properties.map((property) => (
                property.interestedUsers.map((user) => (
                  renderPropertyCard(property, user)
                ))
              ))
            ) : (
              <div className="text-center my-4" style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}>
                <img src={NoData} alt="" width={100}/>      
                <p>No properties found.</p>
              </div>
            )
          ) : (
            removedProperties.length > 0 ? (
              removedProperties.map((property) => (
                renderPropertyCard(property, property.interestedUser, true)
              ))
            ) : (
              <div className="text-center my-4" style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}>
                <img src={NoData} alt="" width={100}/>      
                <p>No removed properties found.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default App;