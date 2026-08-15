




// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import myImage from '../../Assets/Rectangle 146.png'; // Correct path
// import myImage1 from '../../Assets/Rectangle 145.png'; // Correct path
// import pic from '../../Assets/Default image_PP-01.png'; // Correct path
// import { MdCall } from 'react-icons/md';
// import profil from '../../Assets/xd_profile.png'
// import {  FaCalendarAlt } from "react-icons/fa";
// import { Button, Modal } from "react-bootstrap";
// import { FaArrowLeft } from "react-icons/fa";
// import NoData from "../../Assets/OOOPS-No-Data-Found.png";


// const PropertyCard = ({ property, onRemove, onUndo }) => {
//   const [showFullNumber, setShowFullNumber] = useState(false);
//   const navigate = useNavigate();
//   const [message, setMessage] = useState({ text: "", type: "" });



  
//     // 1. Create a handler function to log contact and initiate call
// const handleContactLog = async () => {
//   try {
//     // Call the /contact API
//     await axios.post(`${process.env.REACT_APP_API_URL}/contact-rent`, {
//       rentId: property.rentId,
//       viewerPhoneNumber: property.viewerPhoneNumber,
//       uniqueId: property.uniqueId,
//     });
//     setMessage({ text: "Contact logged successfully", type: "success" });

//     // Open dialer
//     window.location.href = `tel:${property.viewerPhoneNumber}`;
//   } catch (error) {
//     setMessage({ text: "Failed to log contact", type: "error" });
//   }
// };


//   // const handleCallClick = () => {
//   //   handleContactLog();
//   //   window.location.href = `tel:${property.viewerPhoneNumber}`;
//   // };

//   return (
//     <>
//       <div
//         className="card p-2 w-100 w-md-50 w-lg-33"
//         onClick={() => navigate(`/detail/${property.rentId}`)}

//         style={{
//           border: "1px solid #ddd",
//           borderRadius: "10px",
//           overflow: "hidden",
//           marginBottom: "15px",
//           fontFamily: "Inter, sans-serif",
//         }}
//       >
//         <div className="row d-flex align-items-center">
//           <div className="col-3 d-flex align-items-center justify-content-center mb-1">
//             <img
//               src={profil}
//               alt="Placeholder"
//               className="rounded-circle mt-2"
//               style={{ width: "80px", height: "80px", objectFit: "cover" }}
//             />
//           </div>
//           <div className='p-0' style={{ background: "#707070", width: "2px", height: "80px" }}></div>
//           <div className="col-7 p-0 ms-4">
//             <div className='text-center rounded-1 w-100 mb-1' style={{ border: "2px solid #4F4B7E", color: "#4F4B7E", fontSize: "13px" }}>
//               VIEWS RECEIVED BUYER
//             </div>

//             {message && <p style={{ color: message.type === "success" ? "green" : "red" }}>{message.text}</p>}

//             <div className="d-flex">
//               <p className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "12px" }}>
//                 RENT ID - {property.rentId}
//               </p>
//             </div>
//             <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "16px" }}>
//               {property.propertyType || "N/A"} | {property.city || "N/A"}
//             </h5>
//           </div>
//         </div>

//         <div className="p-1">
//           <div className="d-flex align-items-center mb-2">
//             <div className="d-flex flex-row align-items-start justify-content-between ps-3">
//               <div className="d-flex align-items-center">
//                 <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                 <div>
//                   <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>
//                     Buyer Phone
//                   </h6>
//                   {/* <span className="card-text" style={{ fontWeight: "500" }}>
//                     <a
//                       href={`tel:${property.viewerPhoneNumber}`}
//                       onClick={handleContactLog}
//                       style={{ textDecoration: "none", color: "#1D1D1D" }}
//                     >
//                       {showFullNumber
//                         ? property.viewerPhoneNumber
//                         : property.viewerPhoneNumber?.slice(0, 5) + "*****"}
//                     </a>
//                   </span> */}

// <span className="card-text" style={{ fontWeight: "500" }}>
//   <a
//     href={`tel:${property.viewerPhoneNumber}`}
//     onClick={handleContactLog}
//     style={{ textDecoration: "none", color: "#1D1D1D" }}
//   >
//     {showFullNumber
//       ? property.viewerPhoneNumber
//       : property.viewerPhoneNumber?.slice(0, 5) + "*****"}
//   </a>
// </span>

//                 </div>
//               </div>
//               <div className="d-flex align-items-center ms-3">
//                 <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//                 <div>
//                   <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>
//                     Views Received Date
//                   </h6>
//                   {/* <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
//                     {property.viewedAt ? new Date(property.viewedAt).toLocaleDateString(
//                       'en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       }
//                     ) : 'N/A'}
//                   </span> */}




//                         <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
//   {(property.updatedAt || property.viewedAt)
//     ? new Date(property.updatedAt || property.viewedAt).toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       })
//     : 'N/A'}
// </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {!showFullNumber && (
//             <button
//               className='w-100 m-0 p-1'
//               onClick={(e) =>{e.stopPropagation(); setShowFullNumber(true)}}
//               style={{
//                 background: "#4F4B7E",
//                 color: "white",
//                 border: "none",
//                 marginLeft: "10px",
//                 cursor: "pointer",
//                 borderRadius: "5px"
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.background = "#029bb3"; // Brighter neon on hover
//                 e.target.style.fontWeight = 600; // Brighter neon on hover
//                 e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
      
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.background = "#4F4B7E"; // Original orange
//                 e.target.style.fontWeight = 400; // Brighter neon on hover
      
//               }}
//             >
//               View
//             </button>
//           )}

//           {showFullNumber && (
//             <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
//               {/* <button
//                 className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//                 style={{ background: "#4F4B7E", width: "80px", fontSize: "13px" }}
//               >
//                 Call
//               </button> */}

// <button
//   className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//   style={{ background: "#4F4B7E", width: "80px", fontSize: "13px" }}
//   onClick={async (e) => {
//     e.preventDefault();
//     e.stopPropagation(); 
//     try {
//       // Make API call to save contact
//       await axios.post(`${process.env.REACT_APP_API_URL}/contact-rent`, {
//         rentId: property.rentId,  // Replace with actual PPC ID if needed
//         phoneNumber: property.viewerPhoneNumber,
//       });
//       setMessage({ text: "Contact logged successfully", type: "success" });

//       // Open dialer after logging contact
//       window.location.href = `tel:${property.viewerPhoneNumber}`;
//     } catch (error) {
//       setMessage({ text: "Error logging contact", type: "error" });
//     }
//   }}
//   onMouseOver={(e) => {
//     e.target.style.background = "#029bb3"; // Brighter neon on hover
//     e.target.style.fontWeight = 600; // Brighter neon on hover
//     e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover

//   }}
//   onMouseOut={(e) => {
//     e.target.style.background = "#4F4B7E"; // Original orange
//     e.target.style.fontWeight = 400; // Brighter neon on hover

//   }}
// >
//   Call
// </button>

//               {onRemove && (
//                 <button
//                   className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//                   style={{ background: "#FF0000", color: "white", cursor: "pointer" }}
//                   onMouseOver={(e) => {
//                     e.target.style.background = "#FF6700"; // Brighter neon on hover
//                     e.target.style.fontWeight = 600; // Brighter neon on hover
//                     e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
//                   }}
//                   onMouseOut={(e) => {
//                     e.target.style.background = "#FF4500"; // Original orange
//                     e.target.style.fontWeight = 400; // Brighter neon on hover
          
//                   }}
//                   onClick={(e) =>{e.stopPropagation(); onRemove(property.rentId, property.viewerPhoneNumber, property.uniqueId)}}
//                 >
//                   Remove
//                 </button>
//               )}
//               {onUndo && (
//                 <button
//                   className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//                   style={{ background: "green", color: "white", cursor: "pointer" }}
//                   onMouseOver={(e) => {
//                     e.target.style.background = "#32cd32"; // Brighter neon on hover
//                     e.target.style.fontWeight = 600; // Brighter neon on hover
//                     e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
//                   }}
//                   onMouseOut={(e) => {
//                     e.target.style.background = "#39ff14"; // Original orange
//                     e.target.style.fontWeight = 400; // Brighter neon on hover
          
//                   }}
//                   onClick={(e) =>{e.stopPropagation(); onUndo(property.rentId, property.viewerPhoneNumber, property.uniqueId)}}
//                 >
//                   Undo
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };



// const PropertyList = ({ properties, onRemove, onUndo }) => {
//   return properties.length === 0 ? (
// <div className="text-center my-4 "
//     style={{
//       position: 'fixed',
//       top: '50%',
//       left: '50%',
//       transform: 'translate(-50%, -50%)',

//     }}>
// <img src={NoData} alt="" width={100}/>      
// <p>No properties found.</p>
// </div>  ) : (
//     <div className="row mt-4 w-100">
//       {properties.map((property) => (
//         <PropertyCard 
//           key={property.rentId} 
//           property={property} 
//           onRemove={onRemove} 
//           onUndo={onUndo} 
//         />
//       ))}
//     </div>
//   );
// };


// const App = () => {
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const location = useLocation();
//   const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
//   const [phoneNumber] = useState(storedPhoneNumber);  const [activeKey, setActiveKey] = useState("All");

//   const [showPopup, setShowPopup] = useState(false);
//   const [popupAction, setPopupAction] = useState(null);
//   const [popupMessage, setPopupMessage] = useState("");

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
//   const confirmAction = (message, action) => {
//     setPopupMessage(message);
//     setPopupAction(() => action);
//     setShowPopup(true);
//   };

//   // Auto-clear message after 3 seconds
//   useEffect(() => {
//     if (message.text) {
//       const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);
// useEffect(() => {
//     const recordDashboardView = async () => {
//       try {
//         await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
//           phoneNumber: phoneNumber,
//           viewedFile: "Viewed Buyer",
//           viewTime: new Date().toISOString(),
//         });
//       } catch (err) {
//       }
//     };
  
//     if (phoneNumber) {
//       recordDashboardView();
//     }
//   }, [phoneNumber]);

//   // Load properties from localStorage on mount
//   useEffect(() => {
//     const storedProperties = localStorage.getItem("viewedProperties");
//     if (storedProperties) {
//       setProperties(JSON.parse(storedProperties));
//     }
//   }, []);

//   // Save properties to localStorage when they change
//   useEffect(() => {
//     if (properties.length > 0) {
//       localStorage.setItem("viewedProperties", JSON.stringify(properties));
//     }
//   }, [properties]);



// useEffect(() => {
//   if (!phoneNumber) return;

//   const fetchViewedProperties = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/property-buyer-viewed-rent`, { params: { phoneNumber } });
//       const viewedUsers = response.data.viewedUsers || [];

//       const apiProperties = viewedUsers.flatMap((user, index) =>
//   user.viewedProperties.map((property, propIndex) => ({
//     ...property.propertyDetails,                    // Main fix
//     viewerPhoneNumber: user.viewerPhoneNumber,
//     uniqueId: `${index}-${propIndex}`,
//     status: "active",
// viewedAt: property.viewedAt || new Date(),
//     ...property.propertyDetails,                // <-- moved after

//   }))
// );

//           // const sortedApiProperties = apiProperties.sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt));


// const sortedApiProperties =apiProperties.sort(
//   (a, b) => new Date(b.updatedAt || b.viewedAt) - new Date(a.updatedAt || a.viewedAt)
// );


//       // // 🔽 Sort by createdAt (newest first)
//       // const sortedApiProperties = apiProperties.sort(
//       //   (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       // );

//       // Merge with localStorage data
//       const storedProperties = JSON.parse(localStorage.getItem("viewedProperties")) || [];
//       const mergedProperties = sortedApiProperties.map((apiProp) => {
//         const storedProp = storedProperties.find((sp) => sp.uniqueId === apiProp.uniqueId);
//         return storedProp || apiProp; // Use local version if exists
//       });

//       setProperties(mergedProperties);
//       localStorage.setItem("viewedProperties", JSON.stringify(mergedProperties));

//     } catch (err) {
//       // Optionally set error message
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchViewedProperties();
// }, [phoneNumber]);



// const handleRemoveProperty = async (rentId, phoneNumber, uniqueId) => {
//   confirmAction("Are you sure you want to remove this viewd buyer ?", async () => {

//   try {
//     await axios.put(`${process.env.REACT_APP_API_URL}/delete-view-property`, { rentId, phoneNumber });

//     // Update the state
//     const updatedProperties = properties.map((property) =>
//       property.uniqueId === uniqueId
//         ? { ...property, status: "delete" } // Soft delete
//         : property
//     );

//     setProperties(updatedProperties);
//     localStorage.setItem("viewedProperties", JSON.stringify(updatedProperties));

//     setMessage({ text: "Interest removed successfully.", type: "success" });
//   } catch (error) {
//     setMessage({ text: "Error removing interest.", type: "error" });
//   }
//   setShowPopup(false);
// });
// };



// const handleUndoRemove = async (rentId, phoneNumber, uniqueId) => {
//   confirmAction("Do you want to restore this viewed buyer?", async () => {

//   try {
//     await axios.put(`${process.env.REACT_APP_API_URL}/undo-delete-view`, { rentId, phoneNumber });

//     // Restore only the selected property
//     const updatedProperties = properties.map((property) =>
//       property.uniqueId === uniqueId
//         ? { ...property, status: "active" } // Restore it
//         : property
//     );

//     setProperties(updatedProperties);
//     localStorage.setItem("viewedProperties", JSON.stringify(updatedProperties));

//     setMessage({ text: "Interest restored successfully!", type: "success" });
//   } catch (error) {
//     setMessage({ text: "Error restoring interest.", type: "error" });
//   }
//   setShowPopup(false);
// });
// };


//   // Update property status in state and localStorage
//   const updatePropertyStatus = (rentId, status) => {
//     const updatedProperties = properties.map((property) =>
//       property.rentId === rentId ? { ...property, status } : property
//     );
//     setProperties(updatedProperties);
//     localStorage.setItem("viewedProperties", JSON.stringify(updatedProperties)); // Save to localStorage
//   };

//   // Filter properties
//   const activeProperties = properties.filter((property) => property.status !== "delete");
//   const removedProperties = properties.filter((property) => property.status === "delete");
  

//   const navigate = useNavigate();


//   return (
//     <div className="container d-flex align-items-center justify-content-center p-0">
//       <div className="d-flex flex-column align-items-center justify-content-center m-0" 
//         style={{ maxWidth: '500px', margin: 'auto', width: '100%', fontFamily: 'Inter, sans-serif' }}>
//                 <div className="d-flex align-items-center justify-content-start w-100"     style={{
//         background: "#EFEFEF",
//         position: "sticky",
//         top: 0,
//         zIndex: 1000,
//         opacity: isScrolling ? 0 : 1,
//         pointerEvents: isScrolling ? "none" : "auto",
//         transition: "opacity 0.3s ease-in-out",
//       }}>
//                 <button
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
//     </button> <h3 className="m-0 ms-3" style={{fontSize:"20px"}}>VIEWED BUYERS </h3> </div>
//         {/* Filter Buttons */}
//         <div className="row g-2 w-100">
//           <div className="col-6 p-0">
//             <button className="w-100" style={{ backgroundColor: '#4F4B7E', color: 'white' }} 
//               onClick={() => setActiveKey("All")}>
//               All Properties
//             </button>
//           </div>
//           <div className="col-6 p-0">
//             <button className="w-100" style={{ backgroundColor: '#FFFFFF', color: 'grey' }} 
//               onClick={() => setActiveKey("Removed")}>
//               Removed Properties
//             </button>
//           </div>

//           {/* Message Alert */}
//           <div>
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


// {/* Property List */}
// <div className="col-12">
//   <div className="w-100 d-flex align-items-center justify-content-center" style={{ maxWidth: '500px' }}>
//     {loading ? (
//       <div className="text-center my-4 "
//       style={{
//         position: 'fixed',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',

//       }}>
//         <span className="spinner-border text-primary" role="status" />
//         <p className="mt-2">Loading properties...</p>
//       </div>    ) : activeKey === "All" ? (
//       <PropertyList 
//         key="activeProperties" 
//         properties={activeProperties} 
//         onRemove={handleRemoveProperty} 
//       />
//     ) : (
//       <PropertyList 
//         key="removedProperties" 
//         properties={removedProperties} 
//         onUndo={handleUndoRemove} 
//       />
//     )}
//   </div>
// </div>


//         </div>

//       </div>
//     </div>
//   );
// };

// export default App;


































import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import myImage from '../../Assets/Rectangle 146.png'; // Correct path
import myImage1 from '../../Assets/Rectangle 145.png'; // Correct path
import pic from '../../Assets/Default image_PP-01.png'; // Correct path
import { MdCall } from 'react-icons/md';
import profil from '../../Assets/xd_profile.png'
import {  FaCalendarAlt, FaChevronLeft } from "react-icons/fa";
import { Button, Modal } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import NoData from "../../Assets/OOOPS-No-Data-Found.png";


const PropertyCard = ({ property, onRemove, onUndo,isRemovedTab }) => {
  const [showFullNumber, setShowFullNumber] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: "", type: "" });



  
    // 1. Create a handler function to log contact and initiate call
const handleContactLog = async () => {
  try {
    // Call the /contact API
    await axios.post(`${process.env.REACT_APP_API_URL}/contact-rent`, {
      rentId: property.rentId,
      viewerPhoneNumber: property.viewerPhoneNumber,
      uniqueId: property.uniqueId,
    });
    setMessage({ text: "Contact logged successfully", type: "success" });

    // Open dialer
    window.location.href = `tel:${property.viewerPhoneNumber}`;
  } catch (error) {
    setMessage({ text: "Failed to log contact", type: "error" });
  }
};


const handlePayNow = (rentId, user) => {
  navigate("/pricing-plans", {
    state: {
      phoneNumber: user.phoneNumber,
      rentId,
    },
  });
};


return (
  <div
    className="card p-2 w-100 w-md-50 w-lg-33"
    onClick={() => !isRemovedTab && navigate(`/details/${property.rentId}`)}
    style={{
      border: "1px solid #ddd",
      borderRadius: "10px",
      overflow: "hidden",
      marginBottom: "15px",
      fontFamily: "Inter, sans-serif",
    }}
  >
    {/* TOP */}
    <div className="row d-flex align-items-center">
      <div className="col-3 d-flex align-items-center justify-content-center mb-1">
        <img
          src={profil}
          alt="Placeholder"
          className="rounded-circle mt-2"
          style={{ width: "80px", height: "80px", objectFit: "cover" }}
        />
      </div>
      <div className="p-0" style={{ background: "#707070", width: "2px", height: "80px" }}></div>
      <div className="col-7 p-0 ms-4">
        <div className="text-center rounded-1 w-100 mb-1" style={{ border: "2px solid #4F4B7E", color: "#4F4B7E", fontSize: "13px" }}>
          VIEWS RECEIVED BUYER
        </div>
        {message && <p style={{ color: message.type === "success" ? "green" : "red" }}>{message.text}</p>}
        <p className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "12px" }}>Rent Id - {property.rentId}</p>

             {property.propertyMessage && (
    <span 
      className="me-2" 
      style={{
        color: "#FF0000",
        fontWeight: "bold",
        fontSize: "12px"
      }}
    >
      {property.propertyMessage}
    </span>
  )}

        <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "16px" }}>
          {property.propertyType || "N/A"} | {property.city || "N/A"}
        </h5>
      </div>
    </div>

    {/* MIDDLE */}
    <div className="p-1">
      <div className="d-flex align-items-center mb-2">
        <div className="d-flex flex-row align-items-start justify-content-between ps-3">
          <div className="d-flex align-items-center">
            <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
            <div>
              <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Buyer Phone</h6>
              <span className="card-text" style={{ fontWeight: "500" }}>
                {property.payuStatus === "paid" ? (
                  <a
                    href={`tel:${property.viewerPhoneNumber}`}
                    onClick={handleContactLog}
                    style={{ textDecoration: "none", color: "#1D1D1D" }}
                  >
                    {showFullNumber ? property.viewerPhoneNumber : property.viewerPhoneNumber?.slice(0, 5) + "*****"}
                  </a>
                ) : (
                <span style={{ color: "#888" }}>{property.viewerPhoneNumber?.slice(0, 5) + "*****"}</span>
                )}
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center ms-3">
            <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
            <div>
              <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Views Received Date</h6>
              <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
                {(property.updatedAt || property.viewedAt)
                  ? new Date(property.updatedAt || property.viewedAt).toLocaleDateString('en-IN', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BUTTONS */}
      {isRemovedTab ? (
        <div className="d-flex justify-content-end align-items-center ps-2 pe-2 mt-1">
          {onUndo && (
            <button
              className="btn text-white px-3 py-1 flex-grow-1 mx-1"
              style={{ background: "green", fontSize: "13px" }}
              onClick={(e) => {
                e.stopPropagation();
                onUndo(property.rentId, property.viewerPhoneNumber, property.uniqueId);
              }}
            >
              Undo
            </button>
          )}
        </div>
      ) : onUndo ? (
        // ❗ Normal tab but removed (show Undo only)
        <div className="d-flex justify-content-end align-items-center ps-2 pe-2 mt-1">
          <button
            className="btn text-white px-3 py-1 flex-grow-1 mx-1"
            style={{ background: "#39ff14", fontSize: "13px" }}
            onClick={(e) => {
              e.stopPropagation();
              onUndo(property.rentId, property.viewerPhoneNumber, property.uniqueId);
            }}
          >
            Undo
          </button>
        </div>
      ) : property.payuStatus === "paid" ? (
        !showFullNumber ? (
          // 🔓 Show "View" button to reveal phone
          <button
            className="w-100 m-0 p-1"
            onClick={(e) => {
              e.stopPropagation();
              setShowFullNumber(true);
            }}
            style={{
              background: "#4F4B7E",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            View
          </button>
        ) : (
          // ✅ Show Call and Remove
          <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
            <button
              className="btn text-white px-3 py-1 flex-grow-1 mx-1"
              style={{ background: "#4F4B7E", fontSize: "13px" }}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                try {
                  await axios.post(`${process.env.REACT_APP_API_URL}/contact-rent`, {
                    rentId: property.rentId,
                    phoneNumber: property.viewerPhoneNumber,
                  });
                  setMessage({ text: "Contact logged successfully", type: "success" });
                  window.location.href = `tel:${property.viewerPhoneNumber}`;
                } catch {
                  setMessage({ text: "Error logging contact", type: "error" });
                }
              }}
            >
              Call
            </button>
            {onRemove && (
              <button
                className="btn text-white px-3 py-1 flex-grow-1 mx-1"
                style={{ background: "#FF4500", fontSize: "13px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(property.rentId, property.viewerPhoneNumber, property.uniqueId);
                }}
              >
                Remove
              </button>
            )}
          </div>
        )
      ) : (
        // ❗ Not Paid + not removed
        <div className="d-flex flex-row align-items-center mt-2">
          <button
            className="w-50 m-0 p-1"
            onClick={(e) => {
              e.stopPropagation();
              handlePayNow(property.rentId, property.viewerPhoneNumber);
            }}
            style={{
              background: "#FFB100",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "14px"
            }}
          >
            Pay Now to Contact
          </button>

          {onRemove && (
            <button
            className="w-50 m-0 p-1 ms-1"
              style={{ background: "#FF4500", fontSize: "14px", border:"none", borderRadius: "5px",color: "white", }}
              onClick={(e) => {
                e.stopPropagation();
                onRemove(property.rentId, property.viewerPhoneNumber, property.uniqueId);
              }}
            >
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  </div>
);
}
const PropertyList = ({ properties, onRemove, onUndo, isRemovedTab }) => {
  return properties.length === 0 ? (
    <div className="text-center my-4"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
      <img src={NoData} alt="" width={100}/>      
      <p>No properties found.</p>
    </div>
  ) : (
    <div className="row mt-4 w-100">
      {properties.map((property) => (
        <PropertyCard 
          key={property.uniqueId || property.rentId} 
          property={property} 
          onRemove={onRemove} 
          onUndo={onUndo} 
          isRemovedTab={isRemovedTab} // ✅
        />
      ))}
    </div>
  );
};


const App = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
 const location = useLocation();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const [phoneNumber] = useState(storedPhoneNumber);  const [showPopup, setShowPopup] = useState(false);
   const [activeKey, setActiveKey] = useState("All");

  const [popupAction, setPopupAction] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");

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
  const confirmAction = (message, action) => {
    setPopupMessage(message);
    setPopupAction(() => action);
    setShowPopup(true);
  };

  // Auto-clear message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);
useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
          phoneNumber: phoneNumber,
          viewedFile: "Viewed Buyer",
          viewTime: new Date().toISOString(),
        });
      } catch (err) {
      }
    };
  
    if (phoneNumber) {
      recordDashboardView();
    }
  }, [phoneNumber]);

  // Load properties from localStorage on mount
  useEffect(() => {
    const storedProperties = localStorage.getItem("viewedProperties");
    if (storedProperties) {
      setProperties(JSON.parse(storedProperties));
    }
  }, []);

  // Save properties to localStorage when they change
  useEffect(() => {
    if (properties.length > 0) {
      localStorage.setItem("viewedProperties", JSON.stringify(properties));
    }
  }, [properties]);


useEffect(() => {
  if (!phoneNumber) {
    setLoading(false);
    return;
  }

  const fetchViewedProperties = async () => {
    setLoading(true);
    try {
      // 1. Fetch viewed property list
      const propertyRes = await axios.get(`${process.env.REACT_APP_API_URL}/property-buyer-viewed-rent`, {
        params: { phoneNumber },
      });

      // 2. Fetch latest PayU status
      const statusRes = await axios.get(`${process.env.REACT_APP_API_URL}/payustatus-users`);

      const viewedUsers = propertyRes.data.viewedUsers || [];

      // 3. Build PayU status map
      const statusMap = {};
      statusRes.data.forEach(({ rentId, status }) => {
        if (rentId) statusMap[rentId] = status;
      });

      // 4. Flatten & enrich each viewed property
      const allProps = await Promise.all(
        viewedUsers.flatMap((user, index) =>
          user.viewedProperties.map(async (property, propIndex) => {
            const details = property.propertyDetails || {};
            const rentId = details.rentId;

            // 🧠 Fetch property message
            let propertyMessage = null;
            try {
              if (rentId) {
                const msgRes = await axios.get(
                  `${process.env.REACT_APP_API_URL}/user/property-message/${rentId}`
                );
                propertyMessage = msgRes.data?.data?.message || null;
              }
            } catch {
              propertyMessage = null;
            }

            return {
              ...details,
              viewerPhoneNumber: user.viewerPhoneNumber,
              uniqueId: `${index}-${propIndex}`,
              status: "active",
              viewedAt: property.viewedAt || new Date(),
              payuStatus: statusMap[rentId] || "unpaid",
              propertyMessage,
            };
          })
        )
      );

      // 5. Sort by activity
      const sorted = allProps.sort((a, b) =>
        new Date(b.updatedAt || b.viewedAt || b.createdAt) -
        new Date(a.updatedAt || a.viewedAt || a.createdAt)
      );

      // 6. Merge with localStorage
      const storedProperties = JSON.parse(localStorage.getItem("viewedProperties")) || [];
      const merged = sorted.map((apiProp) => {
        const stored = storedProperties.find((sp) => sp.uniqueId === apiProp.uniqueId);
        return stored || apiProp;
      });

      setProperties(merged);
      localStorage.setItem("viewedProperties", JSON.stringify(merged));

    } catch (error) {
      console.error("Error fetching viewed properties or PayU status", error);
    } finally {
      setLoading(false);
    }
  };

  fetchViewedProperties();
}, [phoneNumber]);



// useEffect(() => {
//   if (!phoneNumber) {
//     setLoading(false);
//     return;
//   }

//   const fetchViewedProperties = async () => {
//     setLoading(true);
//     try {
//       // 1. Fetch viewed property list
//       const propertyRes = await axios.get(`${process.env.REACT_APP_API_URL}/property-buyer-viewed-rent`, {
//         params: { phoneNumber },
//       });

//       // 2. Fetch latest PayU status
//       const statusRes = await axios.get(`${process.env.REACT_APP_API_URL}/payustatus-users`);

//       const viewedUsers = propertyRes.data.viewedUsers || [];

//       // 3. Map PayU statuses by rentId
//       const statusMap = {};
//       statusRes.data.forEach(({ rentId, status }) => {
//         statusMap[rentId] = status;
//       });

//       // 4. Flatten viewed properties and enrich with PayU status
//       const apiProperties = viewedUsers.flatMap((user, index) =>
//         user.viewedProperties.map((property, propIndex) => {
//           const details = property.propertyDetails || {};
//           const rentId = details.rentId;

//           return {
//             ...details,
//             viewerPhoneNumber: user.viewerPhoneNumber,
//             uniqueId: `${index}-${propIndex}`,
//             status: "active",
//             viewedAt: property.viewedAt || new Date(),
//             payuStatus: statusMap[rentId] || "unpaid",
//           };
//         })
//       );

//       // 5. Sort by latest activity (updatedAt > viewedAt > createdAt)
//       const sortedApiProperties = apiProperties.sort((a, b) =>
//         new Date(b.updatedAt || b.viewedAt || b.createdAt) -
//         new Date(a.updatedAt || a.viewedAt || a.createdAt)
//       );

//       // 6. Merge with localStorage if needed
//       const storedProperties = JSON.parse(localStorage.getItem("viewedProperties")) || [];
//       const mergedProperties = sortedApiProperties.map((apiProp) => {
//         const storedProp = storedProperties.find((sp) => sp.uniqueId === apiProp.uniqueId);
//         return storedProp || apiProp;
//       });

//       setProperties(mergedProperties);
//       localStorage.setItem("viewedProperties", JSON.stringify(mergedProperties));

//     } catch (error) {
//       console.error("Error fetching viewed properties or PayU status", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchViewedProperties();
// }, [phoneNumber]);


const handleRemoveProperty = async (rentId, phoneNumber, uniqueId) => {
  confirmAction("Are you sure you want to remove this viewd buyer ?", async () => {

  try {
    await axios.put(`${process.env.REACT_APP_API_URL}/delete-view-property`, { rentId, phoneNumber });

    // Update the state
    const updatedProperties = properties.map((property) =>
      property.uniqueId === uniqueId
        ? { ...property, status: "delete" } // Soft delete
        : property
    );

    setProperties(updatedProperties);
    localStorage.setItem("viewedProperties", JSON.stringify(updatedProperties));

    setMessage({ text: "Interest removed successfully.", type: "success" });
  } catch (error) {
    setMessage({ text: "Error removing interest.", type: "error" });
  }
  setShowPopup(false);
});
};



const handleUndoRemove = async (rentId, phoneNumber, uniqueId) => {
  confirmAction("Do you want to restore this viewed buyer?", async () => {

  try {
    await axios.put(`${process.env.REACT_APP_API_URL}/undo-delete-view`, { rentId, phoneNumber });

    // Restore only the selected property
    const updatedProperties = properties.map((property) =>
      property.uniqueId === uniqueId
        ? { ...property, status: "active" } // Restore it
        : property
    );

    setProperties(updatedProperties);
    localStorage.setItem("viewedProperties", JSON.stringify(updatedProperties));

    setMessage({ text: "Interest restored successfully!", type: "success" });
  } catch (error) {
    setMessage({ text: "Error restoring interest.", type: "error" });
  }
  setShowPopup(false);
});
};


  // Update property status in state and localStorage
  const updatePropertyStatus = (rentId, status) => {
    const updatedProperties = properties.map((property) =>
      property.rentId === rentId ? { ...property, status } : property
    );
    setProperties(updatedProperties);
    localStorage.setItem("viewedProperties", JSON.stringify(updatedProperties)); // Save to localStorage
  };

  // Filter properties
  const activeProperties = properties.filter((property) => property.status !== "delete");
  const removedProperties = properties.filter((property) => property.status === "delete");
  

  const navigate = useNavigate();


  return (
    <div className="container d-flex align-items-center justify-content-center p-0">
      <div className="d-flex flex-column align-items-center justify-content-center m-0" 
        style={{ maxWidth: '500px', margin: 'auto', width: '100%', fontFamily: 'Inter, sans-serif' }}>
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
        e.currentTarget.querySelector('svg').style.color = '#CDC9F9';
      }}
    >
      <FaChevronLeft style={{ color: '#CDC9F9', transition: 'color 0.3s ease-in-out' , background:"transparent"}} />
       </button> <h3 className="m-0" style={{fontSize:"18px"}}>VIEWED BUYERS </h3> </div>
        {/* Filter Buttons */}
        <div className="row g-2 w-100">
          <div className="col-6 p-0">
            <button className="w-100 p-2 border-0" style={{ backgroundColor: '#4F4B7E', color: 'white' }} 
              onClick={() => setActiveKey("All")}>
              ALL BUYER
            </button>
          </div>
          <div className="col-6 p-0">
            <button className="w-100 p-2 border-0" style={{ backgroundColor: '#FFFFFF', color: 'grey' }} 
              onClick={() => setActiveKey("Removed")}>
             REMOVED BUYER
            </button>
          </div>

          {/* Message Alert */}
          <div>
      {message && <p style={{ color: message.type === "success" ? "green" : "red" }}>{message.text}</p>}
      <Modal show={showPopup} onHide={() => setShowPopup(false)}>
        <Modal.Body>
          <p>{popupMessage}</p>
          <Button style={{ background:  "#4F4B7E", width: "80px", fontSize: "13px", border:"none" }} onClick={popupAction}
             onMouseOver={(e) => {
              e.target.style.background = "#FF6700"; // Brighter neon on hover
              e.target.style.fontWeight = 600; // Brighter neon on hover
              e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#FF4500"; // Original orange
              e.target.style.fontWeight = 400; // Brighter neon on hover
    
            }}>Yes</Button>
          <Button className="ms-3" style={{ background:  "#FF0000", width: "80px", fontSize: "13px" , border:"none"}} onClick={() => setShowPopup(false)}
              onMouseOver={(e) => {
                e.target.style.background = "#029bb3"; // Brighter neon on hover
                e.target.style.fontWeight = 600; // Brighter neon on hover
                e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
      
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#4F4B7E"; // Original orange
                e.target.style.fontWeight = 400; // Brighter neon on hover
      
              }}>No</Button>
        </Modal.Body>
      </Modal>
    </div>


{/* Property List */}
<div className="col-12">
  <div className="w-100 d-flex align-items-center justify-content-center" style={{ maxWidth: '500px' }}>
    {loading ? (
      <div className="text-center my-4 "
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',

      }}>
        <span className="spinner-border text-primary" role="status" />
        <p className="mt-2">Loading properties...</p>
      </div>    ) : activeKey === "All" ? (
      <PropertyList 
        key="activeProperties" 
        properties={activeProperties} 
        onRemove={handleRemoveProperty} 
      />
    ) : (
      <PropertyList 
        key="removedProperties" 
        properties={removedProperties} 
        onUndo={handleUndoRemove} 
      />
    )}
  </div>
</div>


        </div>

      </div>
    </div>
  );
};

export default App;








