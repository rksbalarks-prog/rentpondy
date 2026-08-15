









// // import React, { useState, useEffect } from "react";
// // import { useLocation, useNavigate, useParams } from "react-router-dom";
// // import axios from "axios";
// // import { MdCall } from 'react-icons/md';
// // import profil from '../../Assets/xd_profile.png';
// // import { FaCalendarAlt, FaChevronLeft } from "react-icons/fa";
// // import { Button, Modal } from "react-bootstrap";
// // import { FaArrowLeft } from "react-icons/fa";
// // import NoData from "../../Assets/OOOPS-No-Data-Found.png";




// // const ContactBuyer = () => {
// //   const location = useLocation();
// //   const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
// //   const [phoneNumber] = useState(storedPhoneNumber);
// //   const [contactRequests, setContactRequests] = useState([]);
// //   const [removedContacts, setRemovedContacts] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [message, setMessage] = useState({ text: "", type: "" });
// //   const [activeTab, setActiveTab] = useState("all");
// //   const [showFullNumber, setShowFullNumber] = useState({});
// //   const [showPopup, setShowPopup] = useState(false);
// //   const [popupAction, setPopupAction] = useState(null);
// //   const [popupMessage, setPopupMessage] = useState("");
// //   const [paymentStatusMap, setPaymentStatusMap] = useState({});
// //   const [isScrolling, setIsScrolling] = useState(false);
// //   const navigate = useNavigate();

// //   // Scroll handler
// //   useEffect(() => {
// //     let scrollTimeout;
// //     const handleScroll = () => {
// //       setIsScrolling(true);
// //       clearTimeout(scrollTimeout);
// //       scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
// //     };
// //     window.addEventListener("scroll", handleScroll);
// //     return () => {
// //       clearTimeout(scrollTimeout);
// //       window.removeEventListener("scroll", handleScroll);
// //     };
// //   }, []);

// //   // Record view
// //   useEffect(() => {
// //     const recordDashboardView = async () => {
// //       try {
// //         await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
// //           phoneNumber,
// //           viewedFile: "Owner Contact",
// //           viewTime: new Date().toISOString(),
// //         });
// //       } catch (err) {
// //         console.error("Error recording view:", err);
// //       }
// //     };
// //     if (phoneNumber) recordDashboardView();
// //   }, [phoneNumber]);

// //   useEffect(() => {
// //   if (!phoneNumber) {
// //     setLoading(false);
// //     return;
// //   }

// //   const fetchData = async () => {
// //     try {
// //       setLoading(true);

// //       // 1. Fetch contact requests
// //       const contactRes = await axios.get(
// //         `${process.env.REACT_APP_API_URL}/get-contact-buyer-rent`,
// //         { params: { postedPhoneNumber: phoneNumber } }
// //       );

// //       // 2. Fetch payment status
// //       const statusRes = await axios.get(
// //         `${process.env.REACT_APP_API_URL}/payustatus-users`
// //       );

// //       if (contactRes.data && statusRes.data) {
// //         // 🔹 Create payment status map
// //         const newStatusMap = {};
// //         statusRes.data.forEach(({ rentId, status }) => {
// //           if (rentId) newStatusMap[rentId] = status;
// //         });
// //         setPaymentStatusMap(newStatusMap);

// //         // 🔹 Transform contact data and include propertyMessage
// //         const contactData = contactRes.data.contactRequestsData || [];

// //         const transformed = await Promise.all(
// //           contactData.flatMap((property) => {
// //             const phones = property.contactRequestersPhoneNumbers || [];

// //             return phones.map(async (phone) => {
// //               let propertyMessage = null;
// //               try {
// //                 const msgRes = await axios.get(
// //                   `${process.env.REACT_APP_API_URL}/user/property-message/${property.rentId}`
// //                 );
// //                 propertyMessage = msgRes.data?.data?.message || null;
// //               } catch {
// //                 propertyMessage = null;
// //               }

// //               return {
// //                 phoneNumber: phone,
// //                 rentId: property.rentId,
// //                 rentId: property.rentId, // Backward compatibility
// //                 propertyType: property.propertyType,
// //                 city: property.city,
// //                 createdAt: property.createdAt,
// //                 updatedAt: property.updatedAt,
// //                 _id: `${property._id}-${phone}`,
// //                 propertyDetails: property.propertyDetails || {},
// //                 payuStatus: newStatusMap[property.rentId] || "unpaid",
// //                 propertyMessage
// //               };
// //             });
// //           })
// //         );

// //         // 🔹 Sort by updatedAt or createdAt (new to old)
// //         const sorted = transformed
// //           .filter(Boolean)
// //           .sort((a, b) =>
// //             new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
// //           );

// //         setContactRequests(sorted);
// //       }
// //     } catch (error) {
// //       console.error("API Error:", error);
// //       setMessage({
// //         text: error.response?.data?.message || "Failed to load contacts",
// //         type: "error"
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   fetchData();
// // }, [phoneNumber]);

// //   const handleCallClick = async (contact) => {
// //     try {
// //       // Make API call to record the contact
// //       await axios.post(`${process.env.REACT_APP_API_URL}/contact-send-property`, {
// //         userPhone: contact.phoneNumber,
// //         postedUserPhone: phoneNumber,
// //         rentId: contact.rentId,
// //         status: "contactSend"
// //       });

// //       // Open phone dialer
// //       window.location.href = `tel:${contact.phoneNumber}`;
// //     } catch (error) {
// //       console.error("Error recording contact:", error);
// //       // Still allow the call even if API fails
// //       window.location.href = `tel:${contact.phoneNumber}`;
// //     }
// //   };

// //   // Helper functions
// //   const confirmAction = (message, action) => {
// //     setPopupMessage(message);
// //     setPopupAction(() => action);
// //     setShowPopup(true);
// //   };

// //   const handleRemoveContact = (contactId) => {
// //     confirmAction("Are you sure you want to remove this contact request?", () => {
// //       const contact = contactRequests.find(req => req._id === contactId);
// //       if (!contact) return;
      
// //       setRemovedContacts(prev => [...prev, contact]);
// //       setContactRequests(prev => prev.filter(req => req._id !== contactId));
      
// //       setMessage({ text: "Contact request removed", type: "success" });
// //       setShowPopup(false);
// //     });
// //   };

// //   const handleUndoRemove = (contactId) => {
// //     confirmAction("Do you want to restore this contact request?", () => {
// //       const contact = removedContacts.find(req => req._id === contactId);
// //       if (!contact) return;
      
// //       setContactRequests(prev => [...prev, contact]);
// //       setRemovedContacts(prev => prev.filter(req => req._id !== contactId));
      
// //       setMessage({ text: "Contact request restored", type: "success" });
// //       setShowPopup(false);
// //     });
// //   };

// //   const toggleShowNumber = (id) => {
// //     setShowFullNumber(prev => ({ ...prev, [id]: !prev[id] }));
// //   };

// //   const handlePayNow = (rentId, phoneNumber) => {
// //     navigate("/pricing-plans", {
// //       state: {
// //         phoneNumber,
// //         rentId,
// //       },
// //     });
// //   };

// //   // Auto-close messages
// //   useEffect(() => {
// //     if (message.text) {
// //       const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
// //       return () => clearTimeout(timer);
// //     }
// //   }, [message]);






// // return (
// //   <div className="container d-flex align-items-center justify-content-center p-0">
// //     <div className="d-flex flex-column align-items-center justify-content-center m-0"
// //       style={{ maxWidth: '500px', margin: 'auto', width: '100%', background: "#F7F7F7", fontFamily: 'Inter, sans-serif' }}>
      
// //       <div className="row g-2 w-100">

// //         {/* Header */}
// //               <div className="d-flex align-items-center justify-content-start w-100 p-2"      style={{
// //         background: "#EFEFEF",
// //         position: "sticky",
// //         top: 0,
// //         zIndex: 1000,
// //         opacity: isScrolling ? 0 : 1,
// //         pointerEvents: isScrolling ? "none" : "auto",
// //         transition: "opacity 0.3s ease-in-out",
// //       }}>
// //               <button    
// //                className="d-flex align-items-center justify-content-center ps-3 pe-2"

// //       onClick={() => navigate(-1)}
// //       style={{
// //           background: "transparent",
// //       border: "none",
// //       height: "100%",color:"#CDC9F9",
// //         cursor: 'pointer',
// //         transition: 'all 0.3s ease-in-out',
  
// //       }}
// //       onMouseEnter={(e) => {
// //         e.currentTarget.style.color = '#f0f4f5'; // Change background
// //         e.currentTarget.querySelector('svg').style.color = '#4F4B7E'; // Change icon color
// //       }}
// //       onMouseLeave={(e) => {
// //         e.currentTarget.style.color = '#CDC9F9';
// //         e.currentTarget.querySelector('svg').style.color = '#4F4B7E';
// //       }}
// //     >
// //       <FaChevronLeft style={{ color: '#4F4B7E', transition: 'color 0.3s ease-in-out' , background:"transparent"}} />
// //        </button>
// //           <h3 className="m-0 " style={{ fontSize: "18px" }}>CONTACTED TENANT</h3>
// //         </div>

// //         {/* Tab Buttons */}
// //         <div className="col-6 p-0">
// //           <button
// //             style={{
// //               backgroundColor: activeTab === "all" ? '#4F4B7E' : '#FFFFFF',
// //               color: activeTab === "all" ? 'white' : 'grey',
// //               width: "100%", border: "none", padding: "10px", fontWeight: "500"
// //             }}
// //             onClick={() => setActiveTab("all")}
// //           >ALL TENANT</button>
// //         </div>

// //         <div className="col-6 p-0">
// //           <button
// //             style={{
// //               backgroundColor: activeTab === "removed" ? '#4F4B7E' : '#FFFFFF',
// //               color: activeTab === "removed" ? 'white' : 'grey',
// //               width: "100%", border: "none", padding: "10px", fontWeight: "500"
// //             }}
// //             onClick={() => setActiveTab("removed")}
// //           >REMOVED TENANT</button>
// //         </div>

// //         {/* Message Alert */}
// //         {message.text && (
// //           <div className={`alert alert-${message.type === "success" ? "success" : message.type === "error" ? "danger" : "info"} mt-2 p-2 text-center`}>
// //             {message.text}
// //           </div>
// //         )}

// //         {/* Modal */}
// //         <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
// //           <Modal.Body className="text-center">
// //             <p className="mb-3">{popupMessage}</p>
// //             <div className="d-flex justify-content-center">
// //               <Button style={{ background: "#4F4B7E", width: "80px", fontSize: "13px", border: "none" }} onClick={popupAction}>Yes</Button>
// //               <Button className="ms-3" style={{ background: "#FF0000", width: "80px", fontSize: "13px", border: "none" }} onClick={() => setShowPopup(false)}>No</Button>
// //             </div>
// //           </Modal.Body>
// //         </Modal>

// //         {/* Loading Spinner */}
// //         {loading && (
// //           <div className="text-center my-4" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
// //             <span className="spinner-border text-primary" role="status" />
// //             <p className="mt-2">Loading contacts...</p>
// //           </div>
// //         )}

// //         {/* All Contacts */}
// //         {!loading && activeTab === "all" && (
// //           contactRequests.length > 0 ? (
// //             contactRequests.map((contact) => {
// //               const contactId = contact._id;
// //               const isPaid = paymentStatusMap[contact.rentId] === "paid";

// //               return (
// //                 <div key={contactId} className="card p-2 mb-3" onClick={() => navigate(`/detail/${contact.rentId}`)}
// //                   style={{ border: "1px solid #ddd", borderRadius: "10px", fontFamily: "Inter, sans-serif" }}>

// //                   {/* Card Body */}
// //                   <div className="row d-flex align-items-center">
// //                     <div className="col-3 d-flex align-items-center justify-content-center mb-1">
// //                       <img src={profil} alt="Profile" className="rounded-circle mt-2" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
// //                     </div>
// //                     <div className='p-0' style={{ background: "#707070", width: "2px", height: "80px" }}></div>
// //                     <div className="col-7 p-0 ms-4">
// //                       <div className='text-center rounded-1 w-100 mb-1'
// //                         style={{ border: "2px solid #4F4B7E", color: "#4F4B7E", fontSize: "13px" }}>
// //                         TENANT CONTACTED
// //                       </div>
// //                       <p className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "12px" }}>
// //                         Rent Id- {contact.rentId}
// //                       </p>
// //                       {contact.propertyMessage && (
// //     <span 
// //       className="me-2" 
// //       style={{
// //         color: "#FF0000",
// //         fontWeight: "bold",
// //         fontSize: "12px"
// //       }}
// //     >
// //       {contact.propertyMessage}
// //     </span>
// //   )}
// //                       <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "16px" }}>
// //                         {contact.propertyType} | {contact.city}
// //                       </h5>
// //                     </div>
// //                   </div>

// //                   {/* Phone + Date + Buttons */}
// //                   <div className="p-1">
// //                     <div className="d-flex align-items-center mb-2">
// //                       <div className="d-flex flex-row align-items-start justify-content-around w-100">

// //                         {/* Phone */}
// //                         <div className="d-flex align-items-center ms-2">
// //                           <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
// //                           {/* <div>
// //                             <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Buyer Phone</h6>
// //                             <span style={{ color: "#1D1D1D", fontWeight: "500" }}>
// //                               {isPaid ? (
// //                                 showFullNumber[contactId]
// //                                   ? contact.phoneNumber
// //                                   : contact.phoneNumber?.slice(0, 5) + "*****"
// //                               ) : (
// //                                 <span style={{ color: "#999" }}>Hidden</span>
// //                               )}
// //                             </span>
// //                           </div> */}
// //                           <div>
// //   <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Tenant Phone</h6>
// //   <span style={{ color: "#1D1D1D", fontWeight: "500" }}>
// //     {contact.phoneNumber
// //       ? (showFullNumber[contactId] || isPaid
// //           ? contact.phoneNumber
// //           : contact.phoneNumber.slice(0, 5) + "*****")
// //       : "N/A"}
// //   </span>
// // </div>

// //                         </div>

// //                         {/* Date */}
// //                         <div className="d-flex align-items-center me-2">
// //                           <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
// //                           <div>
// //                             <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>CONTACTED DATE</h6>
// //                             <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
// //                               {(contact.updatedAt || contact.createdAt)
// //                                 ? new Date(contact.updatedAt || contact.createdAt).toLocaleDateString("en-IN", {
// //                                   day: "numeric", month: "short", year: "numeric"
// //                                 })
// //                                 : "N/A"}
// //                             </span>
// //                           </div>
// //                         </div>

// //                       </div>
// //                     </div>

// //                     {/* Buttons */}
// //                         {isPaid ? (
// //                         !showFullNumber[contactId] ? (
// //                           <button className='w-100 m-0 p-1'
// //                             onClick={(e) => { e.stopPropagation(); toggleShowNumber(contactId); }}
// //                             style={{ background: "#4F4B7E", color: "white", border: "none", borderRadius: "5px" }}>
// //                             View
// //                           </button>
// //                         ) : (
// //                           <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
// //                             <button className="btn text-white px-3 py-1 flex-grow-1 mx-1"
// //                               style={{ background: "#4F4B7E", fontSize: "13px" }}
// //                               onClick={(e) => { e.stopPropagation(); handleCallClick(contact); }}>
// //                               Call
// //                             </button>
// //                             <button className="btn text-white px-3 py-1 flex-grow-1 mx-1"
// //                               style={{ background: "#FF0000", fontSize: "13px" }}
// //                               onClick={(e) => { e.stopPropagation(); handleRemoveContact(contact._id); }}>
// //                               Remove
// //                             </button>
// //                           </div>
// //                         )
// //                       ) : (
// //                         <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
// //                           <button className="btn text-white px-3 py-1 flex-grow-1 mx-1"
// //                             style={{ background: "#FFB100", fontSize: "13px" }}
// //                             onClick={(e) => { e.stopPropagation(); handlePayNow(contact.rentId, contact.phoneNumber); }}>
// //                             Pay Now
// //                           </button>
// //                           <button className="btn text-white px-3 py-1 flex-grow-1 mx-1"
// //                             style={{ background: "#FF0000", fontSize: "13px" }}
// //                             onClick={(e) => { e.stopPropagation(); handleRemoveContact(contact._id); }}>
// //                             Remove
// //                           </button>
// //                         </div>
// //                       )}
// //                   </div>
// //                 </div>
// //               );
// //             })
// //           ) : (
// //             <div className="text-center my-4"
// //               style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
// //               <img src={NoData} alt="No data" width={100} />
// //               <p className="mt-2">No contact requests found</p>
// //             </div>
// //           )
// //         )}

       



// //                       {/* Removed Requests Tab */}
// //           {!loading && activeTab === "removed" && (
// //             removedContacts.length > 0 ? (
// //               removedContacts.map((contact) => {
// //                 const contactId = `removed-${contact._id}`;
// //                 return (
// //                   <div
// //                     key={contactId}
// //                     className="card p-2 mb-3"
// //                     onClick={() => navigate(`/detail/${contact.rentId}`)}
// //                     style={{
// //                       border: "1px solid #ddd",
// //                       borderRadius: "10px",
// //                       fontFamily: "Inter, sans-serif",
// //                     }}
// //                   >
// //                     <div className="row d-flex align-items-center">
// //                       <div className="col-3 d-flex align-items-center justify-content-center mb-1">
// //                         <img
// //                           src={profil}
// //                           alt="Profile"
// //                           className="rounded-circle mt-2"
// //                           style={{ width: "80px", height: "80px", objectFit: "cover" }}
// //                         />
// //                       </div>
// //                       <div className='p-0' style={{ background: "#707070", width: "2px", height: "80px" }}></div>
// //                       <div className="col-7 p-0 ms-4">
// //                         <div className='text-center rounded-1 w-100 mb-1' 
// //                           style={{ border: "2px solid #4F4B7E", color: "#4F4B7E", fontSize: "14px" }}>
// //                           TENANT CONTACTED
// //                         </div>
// //                         <p className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "12px" }}>
// //                           Rent Id- {contact.rentId}
// //                         </p>
                        
// //                         <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "16px" }}>
// //                           {contact.propertyType} | {contact.city}
// //                         </h5>
// //                       </div>
// //                     </div>
// //                     <div className="p-1 mt-1">
// //                       <div className="d-flex align-items-center mb-2">
// //                         <div className="d-flex flex-row align-items-center justify-content-around w-100">
// //                           <div className="d-flex align-items-center ms-2">
// //                             <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
// //                             <div>
// //                               <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>Tenant Phone</h6>
// //                               <span className="card-text" style={{ fontWeight: "500" }}>
// //                                 {showFullNumber[contactId] ? contact.phoneNumber : contact.phoneNumber?.slice(0, 5) + "*****"}
// //                               </span>
// //                             </div>
// //                           </div>
// //                           <div className="d-flex align-items-center me-2">
// //                             <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
// //                             <div>
// //                               <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>CONTACTED DATE</h6>
// //                               {/* <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
// //                                 {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'N/A'}
// //                               </span> */}
// //                               <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
// //   {(contact.updatedAt || contact.createdAt)
// //     ? new Date(contact.updatedAt || contact.createdAt).toLocaleDateString('en-IN', {
// //         year: 'numeric',
// //         month: 'short',
// //         day: 'numeric'
// //       })
// //     : 'N/A'}
// // </span>

// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>

// //       {/* {!showFullNumber[contactId] ? (
// //                         <button
// //                           className='w-100 m-0 p-1'
// //                           onClick={(e) => {
// //                             e.stopPropagation();
// //                             toggleShowNumber(contactId);
// //                           }}
// //                           style={{
// //                             background: "#4F4B7E",
// //                             color: "white",
// //                             border: "none",
// //                             cursor: "pointer",
// //                             borderRadius: "5px"
// //                           }}
// //                         >
// //                           View
// //                         </button>
// //                       ) : (
// //                         <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
// //                           <button
// //                             className="btn text-white px-3 py-1 flex-grow-1 mx-1"
// //                             style={{ background: "#4F4B7E", fontSize: "13px" }}
// //                             onClick={(e) => {
// //                               e.stopPropagation();
// //                               handleCallClick(contact);
// //                             }}
// //                           >
// //                             Call
// //                           </button> */}
// //                           <button
// //                             className="btn text-white px-3 py-1 flex-grow-1 mx-1"
// //                             style={{ background: "green", fontSize: "13px" }}
// //                             onClick={(e) => {
// //                               e.stopPropagation();
// //                               handleUndoRemove(contact._id);
// //                             }}
// //                           >
// //                             Undo
// //                           </button>
// //                         </div>
// //                       )}

                   
// //                     </div>
// //                   </div>
// //                 );
// //               })
// //           ) : (
// //             <div className="text-center my-4"
// //               style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
// //               <img src={NoData} alt="No data" width={100} />
// //               <p className="mt-2">No removed requests found</p>
// //             </div>
// //           )
// //         )}
// //       </div>
// //     </div>
// //   </div>
// // );


// // };

// // export default ContactBuyer;








// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { MdCall } from 'react-icons/md';
// import profil from '../../Assets/xd_profile.png';
// import { FaCalendarAlt, FaChevronLeft } from "react-icons/fa";
// import { Button, Modal } from "react-bootstrap";
// import NoData from "../../Assets/OOOPS-No-Data-Found.png";

// const ContactBuyer = () => {
//   const location = useLocation();
//   const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
//   const [phoneNumber] = useState(storedPhoneNumber);
//   const [contactRequests, setContactRequests] = useState([]);
//   const [removedContacts, setRemovedContacts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [activeTab, setActiveTab] = useState("all");
//   const [showFullNumber, setShowFullNumber] = useState({});
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupAction, setPopupAction] = useState(null);
//   const [popupMessage, setPopupMessage] = useState("");
//   const [paymentStatusMap, setPaymentStatusMap] = useState({});
//   const [isScrolling, setIsScrolling] = useState(false);
//   const navigate = useNavigate();

//   // Initialize from localStorage
//   useEffect(() => {
//     const savedRemovedContacts = localStorage.getItem("removedContacts");
//     if (savedRemovedContacts) {
//       setRemovedContacts(JSON.parse(savedRemovedContacts));
//     }
//   }, []);

//   // Save removed contacts to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem("removedContacts", JSON.stringify(removedContacts));
//   }, [removedContacts]);

//   // Scroll handler
//   useEffect(() => {
//     let scrollTimeout;
//     const handleScroll = () => {
//       setIsScrolling(true);
//       clearTimeout(scrollTimeout);
//       scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       clearTimeout(scrollTimeout);
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   // Record view
//   useEffect(() => {
//     const recordDashboardView = async () => {
//       try {
//         await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
//           phoneNumber,
//           viewedFile: "Owner Contact",
//           viewTime: new Date().toISOString(),
//         });
//       } catch (err) {
//         console.error("Error recording view:", err);
//       }
//     };
//     if (phoneNumber) recordDashboardView();
//   }, [phoneNumber]);

//   // Fetch data
//   useEffect(() => {
//     if (!phoneNumber) {
//       setLoading(false);
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // 1. Fetch contact requests
//         const contactRes = await axios.get(
//           `${process.env.REACT_APP_API_URL}/get-contact-buyer-rent`,
//           { params: { postedPhoneNumber: phoneNumber } }
//         );

//         // 2. Fetch payment status
//         const statusRes = await axios.get(
//           `${process.env.REACT_APP_API_URL}/payustatus-users`
//         );

//         if (contactRes.data && statusRes.data) {
//           // Create payment status map
//           const newStatusMap = {};
//           statusRes.data.forEach(({ rentId, status }) => {
//             if (rentId) newStatusMap[rentId] = status;
//           });
//           setPaymentStatusMap(newStatusMap);

//           // Transform contact data and include propertyMessage
//           const contactData = contactRes.data.contactRequestsData || [];

//           const transformed = await Promise.all(
//             contactData.flatMap((property) => {
//               const phones = property.contactRequestersPhoneNumbers || [];

//               return phones.map(async (phone) => {
//                 let propertyMessage = null;
//                 try {
//                   const msgRes = await axios.get(
//                     `${process.env.REACT_APP_API_URL}/user/property-message/${property.rentId}`
//                   );
//                   propertyMessage = msgRes.data?.data?.message || null;
//                 } catch {
//                   propertyMessage = null;
//                 }

//                 return {
//                   phoneNumber: phone,
//                   rentId: property.rentId,
//                   propertyType: property.propertyType,
//                   city: property.city,
//                   createdAt: property.createdAt,
//                   updatedAt: property.updatedAt,
//                   _id: `${property.rentId}-${phone}`, // Changed to use rentId in the _id
//                   propertyDetails: property.propertyDetails || {},
//                   payuStatus: newStatusMap[property.rentId] || "unpaid",
//                   propertyMessage
//                 };
//               });
//             })
//           );

//           // Sort by updatedAt or createdAt (new to old)
//           const sorted = transformed
//             .filter(Boolean)
//             .sort((a, b) =>
//               new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
//             );

//           // Filter out contacts that are in removedContacts
//           const filteredContacts = sorted.filter(contact => 
//             !removedContacts.some(removed => removed._id === contact._id)
//           );

//           setContactRequests(filteredContacts);
//         }
//       } catch (error) {
//         console.error("API Error:", error);
//         setMessage({
//           text: error.response?.data?.message || "Failed to load contacts",
//           type: "error"
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [phoneNumber, removedContacts]);

//   const handleCallClick = async (contact) => {
//     try {
//       // Make API call to record the contact
//       await axios.post(`${process.env.REACT_APP_API_URL}/contact-send-property`, {
//         userPhone: contact.phoneNumber,
//         postedUserPhone: phoneNumber,
//         rentId: contact.rentId,
//         status: "contactSend"
//       });

//       // Open phone dialer
//       window.location.href = `tel:${contact.phoneNumber}`;
//     } catch (error) {
//       console.error("Error recording contact:", error);
//       // Still allow the call even if API fails
//       window.location.href = `tel:${contact.phoneNumber}`;
//     }
//   };

//   // Helper functions
//   const confirmAction = (message, action) => {
//     setPopupMessage(message);
//     setPopupAction(() => action);
//     setShowPopup(true);
//   };

//   const handleRemoveContact = (contactId) => {
//     confirmAction("Are you sure you want to remove this contact request?", () => {
//       const contact = contactRequests.find(req => req._id === contactId);
//       if (!contact) return;
      
//       // Add to removed contacts
//       setRemovedContacts(prev => [...prev, contact]);
//       // Remove from active contacts
//       setContactRequests(prev => prev.filter(req => req._id !== contactId));
      
//       setMessage({ text: "Contact request removed", type: "success" });
//       setTimeout(() => setMessage({ text: "", type: "" }), 3000);
//       setShowPopup(false);
//     });
//   };

//   const handleUndoRemove = (contactId) => {
//     confirmAction("Do you want to restore this contact request?", () => {
//       const contact = removedContacts.find(req => req._id === contactId);
//       if (!contact) return;
      
//       // Add back to active contacts
//       setContactRequests(prev => [...prev, contact]);
//       // Remove from removed contacts
//       setRemovedContacts(prev => prev.filter(req => req._id !== contactId));
      
//       setMessage({ text: "Contact request restored", type: "success" });
//       setTimeout(() => setMessage({ text: "", type: "" }), 3000);
//       setShowPopup(false);
//     });
//   };

//   const toggleShowNumber = (id) => {
//     setShowFullNumber(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handlePayNow = (rentId, phoneNumber) => {
//     navigate("/pricing-plans", {
//       state: {
//         phoneNumber,
//         rentId,
//       },
//     });
//   };

//   // Auto-close messages
//   useEffect(() => {
//     if (message.text) {
//       const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   return (
//     <div className="container d-flex align-items-center justify-content-center p-0">
//       <div className="d-flex flex-column align-items-center justify-content-center m-0"
//         style={{ maxWidth: '500px', margin: 'auto', width: '100%', background: "#F7F7F7", fontFamily: 'Inter, sans-serif' }}>
        
//         <div className="row g-2 w-100">

//           {/* Header */}
//           <div className="d-flex align-items-center justify-content-start w-100 p-2" style={{
//             background: "#EFEFEF",
//             position: "sticky",
//             top: 0,
//             zIndex: 1000,
//             opacity: isScrolling ? 0 : 1,
//             pointerEvents: isScrolling ? "none" : "auto",
//             transition: "opacity 0.3s ease-in-out",
//           }}>
//             <button    
//               className="d-flex align-items-center justify-content-center ps-3 pe-2"
//               onClick={() => navigate(-1)}
//               style={{
//                 background: "transparent",
//                 border: "none",
//                 height: "100%",
//                 color:"#CDC9F9",
//                 cursor: 'pointer',
//                 transition: 'all 0.3s ease-in-out',
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.color = '#f0f4f5';
//                 e.currentTarget.querySelector('svg').style.color = '#4F4B7E';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.color = '#CDC9F9';
//                 e.currentTarget.querySelector('svg').style.color = '#4F4B7E';
//               }}
//             >
//               <FaChevronLeft style={{ color: '#4F4B7E', transition: 'color 0.3s ease-in-out', background:"transparent" }} />
//             </button>
//             <h3 className="m-0" style={{ fontSize: "18px" }}>CONTACTED TENANT</h3>
//           </div>

//           {/* Tab Buttons */}
//           <div className="col-6 p-0">
//             <button
//               style={{
//                 backgroundColor: activeTab === "all" ? '#4F4B7E' : '#FFFFFF',
//                 color: activeTab === "all" ? 'white' : 'grey',
//                 width: "100%", border: "none", padding: "10px", fontWeight: "500"
//               }}
//               onClick={() => setActiveTab("all")}
//             >ALL TENANT</button>
//           </div>

//           <div className="col-6 p-0">
//             <button
//               style={{
//                 backgroundColor: activeTab === "removed" ? '#4F4B7E' : '#FFFFFF',
//                 color: activeTab === "removed" ? 'white' : 'grey',
//                 width: "100%", border: "none", padding: "10px", fontWeight: "500"
//               }}
//               onClick={() => setActiveTab("removed")}
//             >REMOVED TENANT</button>
//           </div>

//           {/* Message Alert */}
//           {message.text && (
//             <div className={`alert alert-${message.type === "success" ? "success" : message.type === "error" ? "danger" : "info"} mt-2 p-2 text-center`}>
//               {message.text}
//             </div>
//           )}

//           {/* Modal */}
//           <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
//             <Modal.Body className="text-center">
//               <p className="mb-3">{popupMessage}</p>
//               <div className="d-flex justify-content-center">
//                 <Button style={{ background: "#4F4B7E", width: "80px", fontSize: "13px", border: "none" }} onClick={popupAction}>Yes</Button>
//                 <Button className="ms-3" style={{ background: "#FF0000", width: "80px", fontSize: "13px", border: "none" }} onClick={() => setShowPopup(false)}>No</Button>
//               </div>
//             </Modal.Body>
//           </Modal>

//           {/* Loading Spinner */}
//           {loading && (
//             <div className="text-center my-4" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
//               <span className="spinner-border text-primary" role="status" />
//               <p className="mt-2">Loading contacts...</p>
//             </div>
//           )}

//           {/* All Contacts */}
//           {!loading && activeTab === "all" && (
//             contactRequests.length > 0 ? (
//               contactRequests.map((contact) => {
//                 const contactId = contact._id;
//                 const isPaid = paymentStatusMap[contact.rentId] === "paid";

//                 return (
//                   <div key={contactId} className="card p-2 mb-3" onClick={() => navigate(`/detail/${contact.rentId}`)}
//                     style={{ border: "1px solid #ddd", borderRadius: "10px", fontFamily: "Inter, sans-serif" }}>

//                     {/* Card Body */}
//                     <div className="row d-flex align-items-center">
//                       <div className="col-3 d-flex align-items-center justify-content-center mb-1">
//                         <img src={profil} alt="Profile" className="rounded-circle mt-2" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
//                       </div>
//                       <div className='p-0' style={{ background: "#707070", width: "2px", height: "80px" }}></div>
//                       <div className="col-7 p-0 ms-4">
//                         <div className='text-center rounded-1 w-100 mb-1'
//                           style={{ border: "2px solid #4F4B7E", color: "#4F4B7E", fontSize: "13px" }}>
//                           TENANT CONTACTED
//                         </div>
//                         <p className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "12px" }}>
//                           Rent Id- {contact.rentId}
//                         </p>
//                         {contact.propertyMessage && (
//                           <span 
//                             className="me-2" 
//                             style={{
//                               color: "#FF0000",
//                               fontWeight: "bold",
//                               fontSize: "12px"
//                             }}
//                           >
//                             {contact.propertyMessage}
//                           </span>
//                         )}
//                         <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "16px" }}>
//                           {contact.propertyType} | {contact.city}
//                         </h5>
//                       </div>
//                     </div>

//                     {/* Phone + Date + Buttons */}
//                     <div className="p-1">
//                       <div className="d-flex align-items-center mb-2">
//                         <div className="d-flex flex-row align-items-start justify-content-around w-100">

//                           {/* Phone */}
//                           <div className="d-flex align-items-center ms-2">
//                             <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                             <div>
//                               <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Tenant Phone</h6>
//                               <span style={{ color: "#1D1D1D", fontWeight: "500" }}>
//                                 {contact.phoneNumber
//                                   ? (showFullNumber[contactId] || isPaid
//                                       ? contact.phoneNumber
//                                       : contact.phoneNumber.slice(0, 5) + "*****")
//                                   : "N/A"}
//                               </span>
//                             </div>
//                           </div>

//                           {/* Date */}
//                           <div className="d-flex align-items-center me-2">
//                             <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                             <div>
//                               <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>CONTACTED DATE</h6>
//                               <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
//                                 {(contact.updatedAt || contact.createdAt)
//                                   ? new Date(contact.updatedAt || contact.createdAt).toLocaleDateString("en-IN", {
//                                     day: "numeric", month: "short", year: "numeric"
//                                   })
//                                   : "N/A"}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Buttons */}
//                       {isPaid ? (
//                         !showFullNumber[contactId] ? (
//                           <button className='w-100 m-0 p-1'
//                             onClick={(e) => { e.stopPropagation(); toggleShowNumber(contactId); }}
//                             style={{ background: "#4F4B7E", color: "white", border: "none", borderRadius: "5px" }}>
//                             View
//                           </button>
//                         ) : (
//                           <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
//                             <button className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//                               style={{ background: "#4F4B7E", fontSize: "13px" }}
//                               onClick={(e) => { e.stopPropagation(); handleCallClick(contact); }}>
//                               Call
//                             </button>
//                             <button className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//                               style={{ background: "#FF0000", fontSize: "13px" }}
//                               onClick={(e) => { e.stopPropagation(); handleRemoveContact(contact._id); }}>
//                               Remove
//                             </button>
//                           </div>
//                         )
//                       ) : (
//                         <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
//                           <button className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//                             style={{ background: "#FFB100", fontSize: "13px" }}
//                             onClick={(e) => { e.stopPropagation(); handlePayNow(contact.rentId, contact.phoneNumber); }}>
//                             Pay Now
//                           </button>
//                           <button className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//                             style={{ background: "#FF0000", fontSize: "13px" }}
//                             onClick={(e) => { e.stopPropagation(); handleRemoveContact(contact._id); }}>
//                             Remove
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="text-center my-4"
//                 style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
//                 <img src={NoData} alt="No data" width={100} />
//                 <p className="mt-2">No contact requests found</p>
//               </div>
//             )
//           )}

//           {/* Removed Requests Tab */}
//           {!loading && activeTab === "removed" && (
//             removedContacts.length > 0 ? (
//               removedContacts.map((contact) => {
//                 const contactId = contact._id;
//                 return (
//                   <div
//                     key={`removed-${contactId}`}
//                     className="card p-2 mb-3"
//                     onClick={() => navigate(`/detail/${contact.rentId}`)}
//                     style={{
//                       border: "1px solid #ddd",
//                       borderRadius: "10px",
//                       fontFamily: "Inter, sans-serif",
//                     }}
//                   >
//                     <div className="row d-flex align-items-center">
//                       <div className="col-3 d-flex align-items-center justify-content-center mb-1">
//                         <img
//                           src={profil}
//                           alt="Profile"
//                           className="rounded-circle mt-2"
//                           style={{ width: "80px", height: "80px", objectFit: "cover" }}
//                         />
//                       </div>
//                       <div className='p-0' style={{ background: "#707070", width: "2px", height: "80px" }}></div>
//                       <div className="col-7 p-0 ms-4">
//                         <div className='text-center rounded-1 w-100 mb-1' 
//                           style={{ border: "2px solid #4F4B7E", color: "#4F4B7E", fontSize: "14px" }}>
//                           REMOVED TENANT
//                         </div>
//                         <p className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "12px" }}>
//                           Rent Id- {contact.rentId}
//                         </p>
//                         <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "16px" }}>
//                           {contact.propertyType} | {contact.city}
//                         </h5>
//                       </div>
//                     </div>
//                     <div className="p-1 mt-1">
//                       <div className="d-flex align-items-center mb-2">
//                         <div className="d-flex flex-row align-items-center justify-content-around w-100">
//                           <div className="d-flex align-items-center ms-2">
//                             <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                             <div>
//                               <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>Tenant Phone</h6>
//                               <span className="card-text" style={{ fontWeight: "500" }}>
//                                 {contact.phoneNumber?.slice(0, 5) + "*****"}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="d-flex align-items-center me-2">
//                             <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                             <div>
//                               <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>CONTACTED DATE</h6>
//                               <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
//                                 {(contact.updatedAt || contact.createdAt)
//                                   ? new Date(contact.updatedAt || contact.createdAt).toLocaleDateString('en-IN', {
//                                       year: 'numeric',
//                                       month: 'short',
//                                       day: 'numeric'
//                                     })
//                                   : 'N/A'}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <button
//                         className="btn text-white w-100"
//                         style={{ background: "green", fontSize: "13px" }}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleUndoRemove(contact._id);
//                         }}
//                       >
//                         Undo
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="text-center my-4"
//                 style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
//                 <img src={NoData} alt="No data" width={100} />
//                 <p className="mt-2">No removed requests found</p>
//               </div>
//             )
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactBuyer;








// // import React, { useState, useEffect } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import { MdCall } from 'react-icons/md';
// // import profil from '../../Assets/xd_profile.png';
// // import { FaCalendarAlt, FaChevronLeft } from "react-icons/fa";
// // import { Button, Modal } from "react-bootstrap";
// // import NoData from "../../Assets/OOOPS-No-Data-Found.png";

// // const ContactBuyer = () => {
// //   const location = useLocation();
// //   const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
// //   const [phoneNumber] = useState(storedPhoneNumber);
// //   const [contactRequests, setContactRequests] = useState([]);
// //   const [removedContacts, setRemovedContacts] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [message, setMessage] = useState({ text: "", type: "" });
// //   const [activeTab, setActiveTab] = useState("all");
// //   const [showFullNumber, setShowFullNumber] = useState({});
// //   const [showPopup, setShowPopup] = useState(false);
// //   const [popupAction, setPopupAction] = useState(null);
// //   const [popupMessage, setPopupMessage] = useState("");
// //   const [paymentStatusMap, setPaymentStatusMap] = useState({});
// //   const [isScrolling, setIsScrolling] = useState(false);
// //   const navigate = useNavigate();

// //   // Scroll handler
// //   useEffect(() => {
// //     let scrollTimeout;
// //     const handleScroll = () => {
// //       setIsScrolling(true);
// //       clearTimeout(scrollTimeout);
// //       scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
// //     };
// //     window.addEventListener("scroll", handleScroll);
// //     return () => {
// //       clearTimeout(scrollTimeout);
// //       window.removeEventListener("scroll", handleScroll);
// //     };
// //   }, []);

// //   // Record view
// //   useEffect(() => {
// //     const recordDashboardView = async () => {
// //       try {
// //         await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
// //           phoneNumber,
// //           viewedFile: "Owner Contact",
// //           viewTime: new Date().toISOString(),
// //         });
// //       } catch (err) {
// //         console.error("Error recording view:", err);
// //       }
// //     };
// //     if (phoneNumber) recordDashboardView();
// //   }, [phoneNumber]);

// //   // Fetch data
// //   useEffect(() => {
// //     if (!phoneNumber) {
// //       setLoading(false);
// //       return;
// //     }

// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);

// //         // 1. Fetch contact requests
// //         const contactRes = await axios.get(
// //           `${process.env.REACT_APP_API_URL}/get-contact-buyer-rent`,
// //           { params: { postedPhoneNumber: phoneNumber } }
// //         );

// //         // 2. Fetch payment status
// //         const statusRes = await axios.get(
// //           `${process.env.REACT_APP_API_URL}/payustatus-users`
// //         );

// //         if (contactRes.data && statusRes.data) {
// //           // Create payment status map
// //           const newStatusMap = {};
// //           statusRes.data.forEach(({ rentId, status }) => {
// //             if (rentId) newStatusMap[rentId] = status;
// //           });
// //           setPaymentStatusMap(newStatusMap);

// //           // Transform contact data and include propertyMessage
// //           const contactData = contactRes.data.contactRequestsData || [];

// //           const transformed = await Promise.all(
// //             contactData.flatMap((property) => {
// //               const phones = property.contactRequestersPhoneNumbers || [];

// //               return phones.map(async (phone) => {
// //                 let propertyMessage = null;
// //                 try {
// //                   const msgRes = await axios.get(
// //                     `${process.env.REACT_APP_API_URL}/user/property-message/${property.rentId}`
// //                   );
// //                   propertyMessage = msgRes.data?.data?.message || null;
// //                 } catch {
// //                   propertyMessage = null;
// //                 }

// //                 return {
// //                   phoneNumber: phone,
// //                   rentId: property.rentId,
// //                   propertyType: property.propertyType,
// //                   city: property.city,
// //                   createdAt: property.createdAt,
// //                   updatedAt: property.updatedAt,
// //                   _id: `${property._id}-${phone}`,
// //                   propertyDetails: property.propertyDetails || {},
// //                   payuStatus: newStatusMap[property.rentId] || "unpaid",
// //                   propertyMessage
// //                 };
// //               });
// //             })
// //           );

// //           // Sort by updatedAt or createdAt (new to old)
// //           const sorted = transformed
// //             .filter(Boolean)
// //             .sort((a, b) =>
// //               new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
// //             );

// //           setContactRequests(sorted);
// //         }
// //       } catch (error) {
// //         console.error("API Error:", error);
// //         setMessage({
// //           text: error.response?.data?.message || "Failed to load contacts",
// //           type: "error"
// //         });
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [phoneNumber]);

// //   const handleCallClick = async (contact) => {
// //     try {
// //       // Make API call to record the contact
// //       await axios.post(`${process.env.REACT_APP_API_URL}/contact-send-property`, {
// //         userPhone: contact.phoneNumber,
// //         postedUserPhone: phoneNumber,
// //         rentId: contact.rentId,
// //         status: "contactSend"
// //       });

// //       // Open phone dialer
// //       window.location.href = `tel:${contact.phoneNumber}`;
// //     } catch (error) {
// //       console.error("Error recording contact:", error);
// //       // Still allow the call even if API fails
// //       window.location.href = `tel:${contact.phoneNumber}`;
// //     }
// //   };

// //   // Helper functions
// //   const confirmAction = (message, action) => {
// //     setPopupMessage(message);
// //     setPopupAction(() => action);
// //     setShowPopup(true);
// //   };

// //   const handleRemoveContact = (contactId) => {
// //     confirmAction("Are you sure you want to remove this contact request?", () => {
// //       const contact = contactRequests.find(req => req._id === contactId);
// //       if (!contact) return;
      
// //       setRemovedContacts(prev => [...prev, contact]);
// //       setContactRequests(prev => prev.filter(req => req._id !== contactId));
      
// //       setMessage({ text: "Contact request removed", type: "success" });
// //       setShowPopup(false);
// //     });
// //   };

// //   const handleUndoRemove = (contactId) => {
// //     confirmAction("Do you want to restore this contact request?", () => {
// //       const contact = removedContacts.find(req => req._id === contactId);
// //       if (!contact) return;
      
// //       setContactRequests(prev => [...prev, contact]);
// //       setRemovedContacts(prev => prev.filter(req => req._id !== contactId));
      
// //       setMessage({ text: "Contact request restored", type: "success" });
// //       setShowPopup(false);
// //     });
// //   };

// //   const toggleShowNumber = (id) => {
// //     setShowFullNumber(prev => ({ ...prev, [id]: !prev[id] }));
// //   };

// //   const handlePayNow = (rentId, phoneNumber) => {
// //     navigate("/pricing-plans", {
// //       state: {
// //         phoneNumber,
// //         rentId,
// //       },
// //     });
// //   };

// //   // Auto-close messages
// //   useEffect(() => {
// //     if (message.text) {
// //       const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
// //       return () => clearTimeout(timer);
// //     }
// //   }, [message]);

// //   return (
// //     <div className="container d-flex align-items-center justify-content-center p-0">
// //       <div className="d-flex flex-column align-items-center justify-content-center m-0"
// //         style={{ maxWidth: '500px', margin: 'auto', width: '100%', background: "#F7F7F7", fontFamily: 'Inter, sans-serif' }}>
        
// //         <div className="row g-2 w-100">

// //           {/* Header */}
// //           <div className="d-flex align-items-center justify-content-start w-100 p-2" style={{
// //             background: "#EFEFEF",
// //             position: "sticky",
// //             top: 0,
// //             zIndex: 1000,
// //             opacity: isScrolling ? 0 : 1,
// //             pointerEvents: isScrolling ? "none" : "auto",
// //             transition: "opacity 0.3s ease-in-out",
// //           }}>
// //             <button    
// //               className="d-flex align-items-center justify-content-center ps-3 pe-2"
// //               onClick={() => navigate(-1)}
// //               style={{
// //                 background: "transparent",
// //                 border: "none",
// //                 height: "100%",
// //                 color:"#CDC9F9",
// //                 cursor: 'pointer',
// //                 transition: 'all 0.3s ease-in-out',
// //               }}
// //               onMouseEnter={(e) => {
// //                 e.currentTarget.style.color = '#f0f4f5';
// //                 e.currentTarget.querySelector('svg').style.color = '#4F4B7E';
// //               }}
// //               onMouseLeave={(e) => {
// //                 e.currentTarget.style.color = '#CDC9F9';
// //                 e.currentTarget.querySelector('svg').style.color = '#4F4B7E';
// //               }}
// //             >
// //               <FaChevronLeft style={{ color: '#4F4B7E', transition: 'color 0.3s ease-in-out', background:"transparent" }} />
// //             </button>
// //             <h3 className="m-0" style={{ fontSize: "18px" }}>CONTACTED TENANT</h3>
// //           </div>

// //           {/* Tab Buttons */}
// //           <div className="col-6 p-0">
// //             <button
// //               style={{
// //                 backgroundColor: activeTab === "all" ? '#4F4B7E' : '#FFFFFF',
// //                 color: activeTab === "all" ? 'white' : 'grey',
// //                 width: "100%", border: "none", padding: "10px", fontWeight: "500"
// //               }}
// //               onClick={() => setActiveTab("all")}
// //             >ALL TENANT</button>
// //           </div>

// //           <div className="col-6 p-0">
// //             <button
// //               style={{
// //                 backgroundColor: activeTab === "removed" ? '#4F4B7E' : '#FFFFFF',
// //                 color: activeTab === "removed" ? 'white' : 'grey',
// //                 width: "100%", border: "none", padding: "10px", fontWeight: "500"
// //               }}
// //               onClick={() => setActiveTab("removed")}
// //             >REMOVED TENANT</button>
// //           </div>

// //           {/* Message Alert */}
// //           {message.text && (
// //             <div className={`alert alert-${message.type === "success" ? "success" : message.type === "error" ? "danger" : "info"} mt-2 p-2 text-center`}>
// //               {message.text}
// //             </div>
// //           )}

// //           {/* Modal */}
// //           <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
// //             <Modal.Body className="text-center">
// //               <p className="mb-3">{popupMessage}</p>
// //               <div className="d-flex justify-content-center">
// //                 <Button style={{ background: "#4F4B7E", width: "80px", fontSize: "13px", border: "none" }} onClick={popupAction}>Yes</Button>
// //                 <Button className="ms-3" style={{ background: "#FF0000", width: "80px", fontSize: "13px", border: "none" }} onClick={() => setShowPopup(false)}>No</Button>
// //               </div>
// //             </Modal.Body>
// //           </Modal>

// //           {/* Loading Spinner */}
// //           {loading && (
// //             <div className="text-center my-4" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
// //               <span className="spinner-border text-primary" role="status" />
// //               <p className="mt-2">Loading contacts...</p>
// //             </div>
// //           )}

// //           {/* All Contacts */}
// //           {!loading && activeTab === "all" && (
// //             contactRequests.length > 0 ? (
// //               contactRequests.map((contact) => {
// //                 const contactId = contact._id;
// //                 const isPaid = paymentStatusMap[contact.rentId] === "paid";

// //                 return (
// //                   <div key={contactId} className="card p-2 mb-3" onClick={() => navigate(`/detail/${contact.rentId}`)}
// //                     style={{ border: "1px solid #ddd", borderRadius: "10px", fontFamily: "Inter, sans-serif" }}>

// //                     {/* Card Body */}
// //                     <div className="row d-flex align-items-center">
// //                       <div className="col-3 d-flex align-items-center justify-content-center mb-1">
// //                         <img src={profil} alt="Profile" className="rounded-circle mt-2" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
// //                       </div>
// //                       <div className='p-0' style={{ background: "#707070", width: "2px", height: "80px" }}></div>
// //                       <div className="col-7 p-0 ms-4">
// //                         <div className='text-center rounded-1 w-100 mb-1'
// //                           style={{ border: "2px solid #4F4B7E", color: "#4F4B7E", fontSize: "13px" }}>
// //                           TENANT CONTACTED
// //                         </div>
// //                         <p className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "12px" }}>
// //                           Rent Id- {contact.rentId}
// //                         </p>
// //                           <button className="btn text-white px-3 py-1 flex-grow-1 mx-1"
// //                               style={{ background: "#4F4B7E", fontSize: "13px" }}
// //                               onClick={(e) => { e.stopPropagation(); handleCallClick(contact); }}>
// //                               Call
// //                             </button>
// //                         {contact.propertyMessage && (
// //                           <span 
// //                             className="me-2" 
// //                             style={{
// //                               color: "#FF0000",
// //                               fontWeight: "bold",
// //                               fontSize: "12px"
// //                             }}
// //                           >
// //                             {contact.propertyMessage}
// //                           </span>
// //                         )}
// //                         <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "16px" }}>
// //                           {contact.propertyType} | {contact.city}
// //                         </h5>
// //                       </div>
// //                     </div>

// //                     {/* Phone + Date + Buttons */}
// //                     <div className="p-1">
// //                       <div className="d-flex align-items-center mb-2">
// //                         <div className="d-flex flex-row align-items-start justify-content-around w-100">

// //                           {/* Phone */}
// //                           <div className="d-flex align-items-center ms-2">
// //                             <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
// //                             <div>
// //                               <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Tenant Phone</h6>
// //                               <span style={{ color: "#1D1D1D", fontWeight: "500" }}>
// //                                 {contact.phoneNumber
// //                                   ? (showFullNumber[contactId] || isPaid
// //                                       ? contact.phoneNumber
// //                                       : contact.phoneNumber.slice(0, 5) + "*****")
// //                                   : "N/A"}
// //                               </span>
// //                             </div>
// //                           </div>

// //                           {/* Date */}
// //                           <div className="d-flex align-items-center me-2">
// //                             <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
// //                             <div>
// //                               <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>CONTACTED DATE</h6>
// //                               <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
// //                                 {(contact.updatedAt || contact.createdAt)
// //                                   ? new Date(contact.updatedAt || contact.createdAt).toLocaleDateString("en-IN", {
// //                                     day: "numeric", month: "short", year: "numeric"
// //                                   })
// //                                   : "N/A"}
// //                               </span>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>

// //                       {/* Buttons */}
// //                       {isPaid ? (
// //                         !showFullNumber[contactId] ? (
// //                           <button className='w-100 m-0 p-1'
// //                             onClick={(e) => { e.stopPropagation(); toggleShowNumber(contactId); }}
// //                             style={{ background: "#4F4B7E", color: "white", border: "none", borderRadius: "5px" }}>
// //                             View
// //                           </button>
// //                         ) : (
// //                           <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
// //                             <button className="btn text-white px-3 py-1 flex-grow-1 mx-1"
// //                               style={{ background: "#4F4B7E", fontSize: "13px" }}
// //                               onClick={(e) => { e.stopPropagation(); handleCallClick(contact); }}>
// //                               Call
// //                             </button>
// //                             <button className="btn text-white px-3 py-1 flex-grow-1 mx-1"
// //                               style={{ background: "#FF0000", fontSize: "13px" }}
// //                               onClick={(e) => { e.stopPropagation(); handleRemoveContact(contact._id); }}>
// //                               Remove
// //                             </button>
// //                           </div>
// //                         )
// //                       ) : (
// //                         <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
// //                           <button className="btn text-white px-3 py-1 flex-grow-1 mx-1"
// //                             style={{ background: "#FFB100", fontSize: "13px" }}
// //                             onClick={(e) => { e.stopPropagation(); handlePayNow(contact.rentId, contact.phoneNumber); }}>
// //                             Pay Now
// //                           </button>
// //                           <button className="btn text-white px-3 py-1 flex-grow-1 mx-1"
// //                             style={{ background: "#FF0000", fontSize: "13px" }}
// //                             onClick={(e) => { e.stopPropagation(); handleRemoveContact(contact._id); }}>
// //                             Remove
// //                           </button>
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 );
// //               })
// //             ) : (
// //               <div className="text-center my-4"
// //                 style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
// //                 <img src={NoData} alt="No data" width={100} />
// //                 <p className="mt-2">No contact requests found</p>
// //               </div>
// //             )
// //           )}

// //           {/* Removed Requests Tab */}
// //           {!loading && activeTab === "removed" && (
// //             removedContacts.length > 0 ? (
// //               removedContacts.map((contact) => {
// //                 const contactId = `removed-${contact._id}`;
// //                 return (
// //                   <div
// //                     key={contactId}
// //                     className="card p-2 mb-3"
// //                     onClick={() => navigate(`/detail/${contact.rentId}`)}
// //                     style={{
// //                       border: "1px solid #ddd",
// //                       borderRadius: "10px",
// //                       fontFamily: "Inter, sans-serif",
// //                     }}
// //                   >
// //                     <div className="row d-flex align-items-center">
// //                       <div className="col-3 d-flex align-items-center justify-content-center mb-1">
// //                         <img
// //                           src={profil}
// //                           alt="Profile"
// //                           className="rounded-circle mt-2"
// //                           style={{ width: "80px", height: "80px", objectFit: "cover" }}
// //                         />
// //                       </div>
// //                       <div className='p-0' style={{ background: "#707070", width: "2px", height: "80px" }}></div>
// //                       <div className="col-7 p-0 ms-4">
// //                         <div className='text-center rounded-1 w-100 mb-1' 
// //                           style={{ border: "2px solid #4F4B7E", color: "#4F4B7E", fontSize: "14px" }}>
// //                           TENANT CONTACTED
// //                         </div>
// //                         <p className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "12px" }}>
// //                           Rent Id- {contact.rentId}
// //                         </p>
// //                         <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "16px" }}>
// //                           {contact.propertyType} | {contact.city}
// //                         </h5>
// //                       </div>
// //                     </div>
// //                     <div className="p-1 mt-1">
// //                       <div className="d-flex align-items-center mb-2">
// //                         <div className="d-flex flex-row align-items-center justify-content-around w-100">
// //                           <div className="d-flex align-items-center ms-2">
// //                             <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
// //                             <div>
// //                               <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>Tenant Phone</h6>
// //                               <span className="card-text" style={{ fontWeight: "500" }}>
// //                                 {showFullNumber[contactId] ? contact.phoneNumber : contact.phoneNumber?.slice(0, 5) + "*****"}
// //                               </span>
// //                             </div>
// //                           </div>
// //                           <div className="d-flex align-items-center me-2">
// //                             <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
// //                             <div>
// //                               <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>CONTACTED DATE</h6>
// //                               <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
// //                                 {(contact.updatedAt || contact.createdAt)
// //                                   ? new Date(contact.updatedAt || contact.createdAt).toLocaleDateString('en-IN', {
// //                                       year: 'numeric',
// //                                       month: 'short',
// //                                       day: 'numeric'
// //                                     })
// //                                   : 'N/A'}
// //                               </span>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>
// //                       <button
// //                         className="btn text-white w-100"
// //                         style={{ background: "green", fontSize: "13px" }}
// //                         onClick={(e) => {
// //                           e.stopPropagation();
// //                           handleUndoRemove(contact._id);
// //                         }}
// //                       >
// //                         Undo
// //                       </button>
// //                     </div>
// //                   </div>
// //                 );
// //               })
// //             ) : (
// //               <div className="text-center my-4"
// //                 style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
// //                 <img src={NoData} alt="No data" width={100} />
// //                 <p className="mt-2">No removed requests found</p>
// //               </div>
// //             )
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ContactBuyer;








import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MdCall } from 'react-icons/md';
import profil from '../../Assets/xd_profile.png';
import { FaCalendarAlt, FaChevronLeft } from "react-icons/fa";
import { Button, Modal } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import NoData from "../../Assets/OOOPS-No-Data-Found.png";




const ContactBuyer = () => {
  const location = useLocation();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const [phoneNumber] = useState(storedPhoneNumber);
  const [contactRequests, setContactRequests] = useState([]);
  // const [removedContacts, setRemovedContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("all");
  const [showFullNumber, setShowFullNumber] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupAction, setPopupAction] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [paymentStatusMap, setPaymentStatusMap] = useState({});
  const [isScrolling, setIsScrolling] = useState(false);
  const navigate = useNavigate();

  // Scroll handler
  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Record view
  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
          phoneNumber,
          viewedFile: "Owner Contact",
          viewTime: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Error recording view:", err);
      }
    };
    if (phoneNumber) recordDashboardView();
  }, [phoneNumber]);


  const handleCallClick = async (contact) => {
    try {
      // Make API call to record the contact
      await axios.post(`${process.env.REACT_APP_API_URL}/contact-send-property`, {
        userPhone: contact.phoneNumber,
        postedUserPhone: phoneNumber,
        rentId: contact.rentId,
        status: "contactSend"
      });

      // Open phone dialer
      window.location.href = `tel:${contact.phoneNumber}`;
    } catch (error) {
      console.error("Error recording contact:", error);
      // Still allow the call even if API fails
      window.location.href = `tel:${contact.phoneNumber}`;
    }
  };


// Initialize removedContacts from localStorage at the component level
const [removedContacts, setRemovedContacts] = useState(() => {
  try {
    const saved = localStorage.getItem("removedContacts");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Failed to parse removedContacts:", e);
    return [];
  }
});

// const fetchData = async () => {
//   try {
//     setLoading(true);

//     // 1. Fetch contact requests with cache busting
//     const contactRes = await axios.get(
//       `${process.env.REACT_APP_API_URL}/get-contact-buyer-rent`,
//       { 
//         params: { 
//           postedPhoneNumber: phoneNumber,
//           _: Date.now() // Cache buster
//         } 
//       }
//     );

//     // 2. Fetch payment status with cache busting
//     const statusRes = await axios.get(
//       `${process.env.REACT_APP_API_URL}/payustatus-users`,
//       { params: { _: Date.now() } }
//     );

//     if (contactRes.status === 200 && statusRes.status === 200) {
//       // Create payment status map
//       const newStatusMap = {};
//       statusRes.data.forEach(({ rentId, status }) => {
//         if (rentId) newStatusMap[rentId] = status;
//       });
//       setPaymentStatusMap(newStatusMap);

//       // Transform contact data
//       let contactData = Array.isArray(contactRes.data)
//         ? contactRes.data
//         : contactRes.data.contactRequestsData || [];

//       const transformed = await Promise.all(
//         contactData.flatMap(async (property) => {
//           if (!Array.isArray(property.contactRequestersPhoneNumbers)) return [];
          
//           const phones = [...new Set(property.contactRequestersPhoneNumbers)];
//           let propertyMessage = null;
          
//           try {
//             const msgRes = await axios.get(
//               `${process.env.REACT_APP_API_URL}/user/property-message/${property.rentId}`,
//               // { params: { _: Date.now() } } // Cache buster
//             );
//             propertyMessage = msgRes.data?.data?.message || null;
//           } catch (err) {
//             console.error("Error fetching message:", err);
//             propertyMessage = null;
//           }

//           return phones
//             .filter((phone) => phone && phone !== "undefined" && phone !== "null")
//             .map((phone) => ({
//               phoneNumber: phone,
//               rentId: property.rentId,
//               propertyType: property.propertyType,
//               city: property.city,
//               createdAt: property.createdAt,
//               updatedAt: property.updatedAt,
//               _id: `${property._id}-${phone}`,
//               propertyDetails: property.propertyDetails || {},
//               payuStatus: newStatusMap[property.rentId] || "unpaid",
//               propertyMessage
//             }));
//         })
//       );

//       //  const transformed = await Promise.all(
//       //     contactData.flatMap((property) => {
//       //       const phones = property.contactRequestersPhoneNumbers || [];

//       //       return phones.map(async (phone) => {
//       //         let propertyMessage = null;
//       //         try {
//       //           const msgRes = await axios.get(
//       //             `${process.env.REACT_APP_API_URL}/user/property-message/${property.rentId}`
//       //           );
//       //           propertyMessage = msgRes.data?.data?.message || null;
//       //         } catch {
//       //           propertyMessage = null;
//       //         }

//       //         return {
//       //           phoneNumber: phone,
//       //           rentId: property.rentId,
//       //           rentId: property.rentId, // Backward compatibility
//       //           propertyType: property.propertyType,
//       //           city: property.city,
//       //           createdAt: property.createdAt,
//       //           updatedAt: property.updatedAt,
//       //           _id: `${property._id}-${phone}`,
//       //           propertyDetails: property.propertyDetails || {},
//       //           payuStatus: newStatusMap[property.rentId] || "unpaid",
//       //           propertyMessage
//       //         };
//       //       });
//       //     })
//       //   );
      
//       // Sort by updatedAt or createdAt (new to old)
//       const sorted = transformed
//         .flat()
//         .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
      
//       // Filter out recently removed contacts (last 24 hours)
//       const filteredRequests = sorted.filter(contact => {
//         const removed = removedContacts.find(r => r._id === contact._id);
//         if (!removed) return true;
//         return removed.removedAt < Date.now() - 24 * 60 * 60 * 1000;
//       });

//       setContactRequests(filteredRequests);
//     } else {
//       setMessage({ text: "Unable to load contacts", type: "error" });
//     }
//   } catch (error) {
//     console.error("API Error:", error.response?.data || error.message);
//     setMessage({
//       text: error.response?.data?.message || "Failed to load contacts",
//       type: "error"
//     });
//   } finally {
//     setLoading(false);
//   }
// };

// useEffect(() => {
//   fetchData();
// }, [phoneNumber, removedContacts]);


const fetchData = async () => {
  try {
    setLoading(true);

    // 1. Fetch contact requests with cache busting
    const contactRes = await axios.get(
      `${process.env.REACT_APP_API_URL}/get-contact-buyer-rent`,
      { 
        params: { 
          postedPhoneNumber: phoneNumber,
          _: Date.now() // Cache buster
        } 
      }
    );

    // 2. Fetch payment status with cache busting
    const statusRes = await axios.get(
      `${process.env.REACT_APP_API_URL}/payustatus-users`,
      { params: { _: Date.now() } }
    );

    if (contactRes.status === 200 && statusRes.status === 200) {
      // Create payment status map
      const newStatusMap = {};
      statusRes.data.forEach(({ rentId, status }) => {
        if (rentId) newStatusMap[rentId] = status;
      });
      setPaymentStatusMap(newStatusMap);

      // Transform contact data
      let contactData = Array.isArray(contactRes.data)
        ? contactRes.data
        : contactRes.data.contactRequestsData || [];

      // const transformed = await Promise.all(
      //   contactData.flatMap(async (property) => {
      //     if (!Array.isArray(property.contactRequestersPhoneNumbers)) return [];
          
      //     const phones = [...new Set(property.contactRequestersPhoneNumbers)];
      //     let propertyMessage = null;
          
      //     try {
      //       const msgRes = await axios.get(
      //         `${process.env.REACT_APP_API_URL}/user/property-message/${property.rentId}`,
      //       );
      //       propertyMessage = msgRes.data?.data?.message || null;
      //     } catch (err) {
      //       console.error("Error fetching message:", err);
      //       propertyMessage = null;
      //     }

      //     return phones
      //       .filter((phone) => phone && phone !== "undefined" && phone !== "null")
      //       .map((phone) => ({
      //         phoneNumber: phone,
      //         rentId: property.rentId,
      //         propertyType: property.propertyType,
      //         city: property.city,
      //         createdAt: property.createdAt,
      //         updatedAt: property.updatedAt,
      //         _id: `${property._id}-${phone}`,
      //         propertyDetails: property.propertyDetails || {},
      //         payuStatus: newStatusMap[property.rentId] || "unpaid",
      //         propertyMessage
      //       }));
      //   })
      // );

   const transformed = await Promise.all(
  contactData.flatMap(async (property) => {
    if (!Array.isArray(property.contactRequestersPhoneNumbers)) return [];

    const phones = [...new Set(property.contactRequestersPhoneNumbers)];
    let propertyMessage = null;

    try {
      const msgRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/property-message/${property.rentId}`,
      );
      propertyMessage = msgRes.data?.data?.message || null;
    } catch (err) {
      console.error("Error fetching message:", err);
      propertyMessage = null;
    }

    return (property.fullContactRequests || []).map((req) => ({
      phoneNumber: req.phoneNumber,
      rentId: property.rentId,
      propertyType: property.propertyType,
      city: property.city,
      createdAt: property.createdAt,
      contactDate: req.date,
      _id: req._id,
      propertyDetails: property.propertyDetails || {},
      payuStatus: newStatusMap[property.rentId] || "unpaid",
      propertyMessage,
    }));
  })
);

   
      // Sort by updatedAt or createdAt (new to old)
      const sorted = transformed
        .flat()
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
      
      // Filter out recently removed contacts (last 24 hours)
      const filteredRequests = sorted.filter(contact => {
        const removed = removedContacts.find(r => r._id === contact._id);
        if (!removed) return true;
        return removed.removedAt < Date.now() - 24 * 60 * 60 * 1000;
      });

      setContactRequests(filteredRequests);

    } else {
      setMessage({ text: "Unable to load contacts", type: "error" });
    }

  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    setMessage({
      text: error.response?.data?.message || "Failed to load contacts",
      type: "error"
    });
  } finally {
    setLoading(false);
  }
};

// ⏱ Trigger when phoneNumber or removedContacts changes
useEffect(() => {
  fetchData();
}, [phoneNumber, removedContacts]);


const handleRemoveContact = (contactId) => {
  confirmAction("Are you sure you want to remove this contact request?", () => {
    const contact = contactRequests.find(req => req._id === contactId);
    if (!contact) return;
    
    const contactWithTimestamp = { 
      ...contact, 
      removedAt: Date.now() 
    };
    
    const updatedRemovedContacts = [...removedContacts, contactWithTimestamp];
    setRemovedContacts(updatedRemovedContacts);
    
    try {
      localStorage.setItem("removedContacts", JSON.stringify(updatedRemovedContacts));
    } catch (e) {
      console.error("LocalStorage error:", e);
    }
    
    setContactRequests(prev => prev.filter(req => req._id !== contactId));
    
    setMessage({ 
      text: "Contact request removed", 
      type: "success",
      action: {
        label: "Undo",
        handler: () => handleUndoRemove(contactId)
      }
    });
    setShowPopup(false);
  });
};

const handleUndoRemove = (contactId) => {
  const shouldConfirm = !message.action; // Only confirm if not from undo
  
  const action = () => {
    const contact = removedContacts.find(req => req._id === contactId);
    if (!contact) return;
    
    const updatedRemovedContacts = removedContacts.filter(req => req._id !== contactId);
    setRemovedContacts(updatedRemovedContacts);
    
    try {
      localStorage.setItem("removedContacts", JSON.stringify(updatedRemovedContacts));
    } catch (e) {
      console.error("LocalStorage error:", e);
    }
    
    // Insert back in sorted position
    setContactRequests(prev => {
      const newContacts = [...prev, contact];
      return newContacts.sort(
        (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      );
    });
    
    setMessage({ text: "Contact request restored", type: "success" });
    setShowPopup(false);
  };
  
  if (shouldConfirm) {
    confirmAction("Do you want to restore this contact request?", action);
  } else {
    action();
  }
};
const restoreAllRemovedContacts = () => {
  setRemovedContacts([]);
  try {
    localStorage.removeItem("removedContacts");
  } catch (e) {
    console.error("LocalStorage error:", e);
  }
  fetchData();
  setMessage({ text: "All removed contacts restored", type: "success" });
};
  // Helper functions
  const confirmAction = (message, action) => {
    setPopupMessage(message);
    setPopupAction(() => action);
    setShowPopup(true);
  };
 
  const toggleShowNumber = (id) => {
    setShowFullNumber(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePayNow = (rentId, phoneNumber) => {
    navigate("/pricing-plans", {
      state: {
        phoneNumber,
        rentId,
      },
    });
  };

  // Auto-close messages
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);






return (
  <div className="container d-flex align-items-center justify-content-center p-0">
    <div className="d-flex flex-column align-items-center justify-content-center m-0"
      style={{ maxWidth: '500px', margin: 'auto', width: '100%', background: "#F7F7F7", fontFamily: 'Inter, sans-serif' }}>
      
      <div className="row g-2 w-100">

        {/* Header */}
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
          <h3 className="m-0 " style={{ fontSize: "18px" }}>CONTACTED TENANT</h3>
        </div>

        {/* Tab Buttons */}
        <div className="col-6 p-0">
          <button
            style={{
              backgroundColor: activeTab === "all" ? '#4F4B7E' : '#FFFFFF',
              color: activeTab === "all" ? 'white' : 'grey',
              width: "100%", border: "none", padding: "10px", fontWeight: "500"
            }}
            onClick={() => setActiveTab("all")}
          >ALL TENANT</button>
        </div>

        <div className="col-6 p-0">
          <button
            style={{
              backgroundColor: activeTab === "removed" ? '#4F4B7E' : '#FFFFFF',
              color: activeTab === "removed" ? 'white' : 'grey',
              width: "100%", border: "none", padding: "10px", fontWeight: "500"
            }}
            onClick={() => setActiveTab("removed")}
          >REMOVED TENANT</button>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`alert alert-${message.type === "success" ? "success" : message.type === "error" ? "danger" : "info"} mt-2 p-2 text-center`}>
            {message.text}
          </div>
        )}

        {/* Modal */}
        <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
          <Modal.Body className="text-center">
            <p className="mb-3">{popupMessage}</p>
            <div className="d-flex justify-content-center">
              <Button style={{ background: "#4F4B7E", width: "80px", fontSize: "13px", border: "none" }} onClick={popupAction}>Yes</Button>
              <Button className="ms-3" style={{ background: "#FF0000", width: "80px", fontSize: "13px", border: "none" }} onClick={() => setShowPopup(false)}>No</Button>
            </div>
          </Modal.Body>
        </Modal>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center my-4" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <span className="spinner-border text-primary" role="status" />
            <p className="mt-2">Loading contacts...</p>
          </div>
        )}

        {/* All Contacts */}
        {!loading && activeTab === "all" && (
          contactRequests.length > 0 ? (
            contactRequests.map((contact) => {
              const contactId = contact._id;
              const isPaid = paymentStatusMap[contact.rentId] === "paid";

              return (
                <div key={contactId} className="card p-2 mb-3" onClick={() => navigate(`/detail/${contact.rentId}`)}
                  style={{ border: "1px solid #ddd", borderRadius: "10px", fontFamily: "Inter, sans-serif" }}>

                  {/* Card Body */}
                  <div className="row d-flex align-items-center">
                    <div className="col-3 d-flex align-items-center justify-content-center mb-1">
                      <img src={profil} alt="Profile" className="rounded-circle mt-2" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                    </div>
                    <div className='p-0' style={{ background: "#707070", width: "2px", height: "80px" }}></div>
                    <div className="col-7 p-0 ms-4">
                      <div className='text-center rounded-1 w-100 mb-1'
                        style={{ border: "2px solid #4F4B7E", color: "#4F4B7E", fontSize: "13px" }}>
                        TENANT CONTACTED
                      </div>
                      <p className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "12px" }}>
                        Rent Id- {contact.rentId}
                      </p>
                     
                      {contact.propertyMessage && (
    <span 
      className="me-2" 
      style={{
        color: "#FF0000",
        fontWeight: "bold",
        fontSize: "12px"
      }}
    >
      {contact.propertyMessage}
    </span>
  )}
                      <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "16px" }}>
                        {contact.propertyType} | {contact.city}
                      </h5>
                    </div>
                  </div>

                  {/* Phone + Date + Buttons */}
                  <div className="p-1">
                    <div className="d-flex align-items-center mb-2">
                      <div className="d-flex flex-row align-items-start justify-content-around w-100">

                        {/* Phone */}
                        <div className="d-flex align-items-center ms-2">
                          <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                          {/* <div>
                            <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Buyer Phone</h6>
                            <span style={{ color: "#1D1D1D", fontWeight: "500" }}>
                              {isPaid ? (
                                showFullNumber[contactId]
                                  ? contact.phoneNumber
                                  : contact.phoneNumber?.slice(0, 5) + "*****"
                              ) : (
                                <span style={{ color: "#999" }}>Hidden</span>
                              )}
                            </span>
                          </div> */}
                          <div>
  <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Tenant Phone</h6>
  <span style={{ color: "#1D1D1D", fontWeight: "500" }}>
    {contact.phoneNumber
      ? (showFullNumber[contactId] || isPaid
          ? contact.phoneNumber
          : contact.phoneNumber.slice(0, 5) + "*****")
      : "N/A"}
  </span>
</div>

                        </div>

                        {/* Date */}
                        <div className="d-flex align-items-center me-2">
                          <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                          <div>
                            <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>CONTACTED DATE</h6>
                            <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
                              {(contact.updatedAt || contact.createdAt)
                                ? new Date(contact.updatedAt || contact.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric", month: "short", year: "numeric"
                                })
                                : "N/A"}
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>


                      {isPaid ? (
                        !showFullNumber[contactId] ? (
                          <button className='w-100 m-0 p-1'
                            onClick={(e) => { e.stopPropagation(); toggleShowNumber(contactId); }}
                            style={{ background: "#4F4B7E", color: "white", border: "none", borderRadius: "5px" }}>
                            View
                          </button>
                        ) : (
                          <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
                            <button className="btn text-white px-3 py-1 flex-grow-1 mx-1"
                              style={{ background: "#4F4B7E", fontSize: "13px" }}
                              onClick={(e) => { e.stopPropagation(); handleCallClick(contact); }}>
                              Call
                            </button>
                            <button className="btn text-white px-3 py-1 flex-grow-1 mx-1"
                              style={{ background: "#FF0000", fontSize: "13px" }}
                              onClick={(e) => { e.stopPropagation(); handleRemoveContact(contact._id); }}>
                              Remove
                            </button>
                          </div>
                        )
                      ) : (
                        <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
                          <button className="btn text-white px-3 py-1 flex-grow-1 mx-1"
                            style={{ background: "#FFB100", fontSize: "13px" }}
                            onClick={(e) => { e.stopPropagation(); handlePayNow(contact.rentId, contact.phoneNumber); }}>
                            Pay Now
                          </button>
                          <button className="btn text-white px-3 py-1 flex-grow-1 mx-1"
                            style={{ background: "#FF0000", fontSize: "13px" }}
                            onClick={(e) => { e.stopPropagation(); handleRemoveContact(contact._id); }}>
                            Remove
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center my-4"
              style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <img src={NoData} alt="No data" width={100} />
              <p className="mt-2">No contact requests found</p>
            </div>
          )
        )}

       



                      {/* Removed Requests Tab */}
       {/* Removed Requests Tab */}
{!loading && activeTab === "removed" && (
  removedContacts.length > 0 ? (
    removedContacts.map((contact) => {
      const contactId = `removed-${contact._id}`;
      const isPaid = paymentStatusMap[contact.rentId] === "paid";

      return (
        <div
          key={contactId}
          className="card p-2 mb-3"
          onClick={() => navigate(`/detail/${contact.rentId}`)}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {/* Card content remains the same */}
          <div className="row d-flex align-items-center">
            <div className="col-3 d-flex align-items-center justify-content-center mb-1">
              <img
                src={profil}
                alt="Profile"
                className="rounded-circle mt-2"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
            </div>
            <div className='p-0' style={{ background: "#707070", width: "2px", height: "80px" }}></div>
            <div className="col-7 p-0 ms-4">
              <div className='text-center rounded-1 w-100 mb-1' 
                style={{ border: "2px solid #4F4B7E", color: "#4F4B7E", fontSize: "14px" }}>
                TENANT CONTACTED
              </div>
              <p className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "12px" }}>
                Rent Id- {contact.rentId}
              </p>
              <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "16px" }}>
                {contact.propertyType} | {contact.city}
              </h5>
            </div>
          </div>

          <div className="p-1 mt-1">
            <div className="d-flex align-items-center mb-2">
              <div className="d-flex flex-row align-items-center justify-content-around w-100">
                <div className="d-flex align-items-center ms-2">
                  <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                  <div>
                    <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>Tenant Phone</h6>
                    <span className="card-text" style={{ fontWeight: "500" }}>
                      {isPaid
                        ? (showFullNumber[contactId] 
                            ? contact.phoneNumber 
                            : contact.phoneNumber?.slice(0, 5) + "*****")
                        : "Hidden"}
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center me-2">
                  <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                  <div>
                    <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>CONTACTED DATE</h6>
                    <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
                      {(contact.updatedAt || contact.createdAt)
                        ? new Date(contact.updatedAt || contact.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {isPaid ? (
              !showFullNumber[contactId] ? (
                <button
                  className='w-100 m-0 p-1'
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleShowNumber(contactId);
                  }}
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
                <div className="d-flex justify-content-center w-100 mt-2">
                  <button
                    className="btn text-white px-3 py-1 flex-grow-1 mx-1"
                    style={{ background: "green", fontSize: "13px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUndoRemove(contact._id);
                    }}
                  >
                    Undo
                  </button>
                </div>
              )
            ) : (
              <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
                <button
                  className="btn text-white px-3 py-1 flex-grow-1 mx-1"
                  style={{ background: "#FFB100", fontSize: "13px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePayNow(contact.rentId, contact.phoneNumber);
                  }}
                >
                  Pay Now
                </button>
                <button
                  className="btn text-white px-3 py-1 flex-grow-1 mx-1"
                  style={{ background: "green", fontSize: "13px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUndoRemove(contact._id);
                  }}
                >
                  Undo
                </button>
              </div>
            )}
          </div>
        </div>
      );
    })
  ) : (
    <div className="text-center my-4"
      style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <img src={NoData} alt="No data" width={100} />
      <p className="mt-2">No removed requests found</p>
    </div>
  )
)}
      </div>
    </div>
  </div>
);


};

export default ContactBuyer;