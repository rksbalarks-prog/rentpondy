





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { 
//   FaRupeeSign, FaBed,  
//   FaCalendarAlt, FaUserAlt, FaRulerCombined,
//   FaCamera,
//   FaEye,
//   FaPhoneAlt
// } from "react-icons/fa";
// import myImage from '../../Assets/Rectangle 146.png'; // Correct path
// import myImage1 from '../../Assets/Rectangle 145.png'; // Correct path
// import pic from '../../Assets/Default image_PP-01.png'; // Correct path
// import { MdCall } from 'react-icons/md';
// import profil from '../../Assets/xd_profile.png'
// import { TbCameraPlus } from "react-icons/tb";
// import { Button, Modal } from "react-bootstrap";
// import { FaArrowLeft } from "react-icons/fa";
// import NoData from "../../Assets/OOOPS-No-Data-Found.png";


// const App = () => {
//   const [activeKey, setActiveKey] = useState("All");
//   const [removedProperties, setRemovedProperties] = useState(() => {
//     // Load removed properties from localStorage on initial load
//     const storedRemovedProperties = localStorage.getItem("removedProperties");
//     return storedRemovedProperties ? JSON.parse(storedRemovedProperties) : [];
//   });
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ text: "", type: "" });
//    const [showPopup, setShowPopup] = useState(false);
//    const [popupAction, setPopupAction] = useState(null);
//    const [popupMessage, setPopupMessage] = useState("");
//    const navigate = useNavigate();
//   const location = useLocation();
//   const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
//   const [phoneNumber] = useState(storedPhoneNumber);
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
// useEffect(() => {
//     const recordDashboardView = async () => {
//       try {
//         await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
//           phoneNumber: phoneNumber,
//           viewedFile: "Photo request Buyer",
//           viewTime: new Date().toISOString(),
//         });
//       } catch (err) {
//       }
//     };
  
//     if (phoneNumber) {
//       recordDashboardView();
//     }
//   }, [phoneNumber]);
//    const confirmAction = (message, action) => {
//      setPopupMessage(message);
//      setPopupAction(() => action);
//      setShowPopup(true);
//    };
//   const handleRemoveProperty = async (rentId, requesterPhoneNumber) => {

//     confirmAction("Are you sure you want to remove this Photo request?", async () => {

//     try {
//       const response = await axios.put(
//         `${process.env.REACT_APP_API_URL}/photo-requests/delete/${rentId}/${requesterPhoneNumber}`
//       );
  
//       if (response.status === 200) {
//         setMessage("Photo request marked as deleted.");
  
//         const deletedRequest = response.data.request; // Get deleted request details
  
//         // Remove only the deleted property while keeping others with same rentId
//         setProperties((prev) => 
//           prev.filter((prop) => !(prop.rentId === rentId && prop.requesterPhoneNumber === requesterPhoneNumber))
//         );
  
//         // Add deleted property to removedProperties
//         setRemovedProperties((prev) => {
//           const updatedRemovedProperties = [...prev, deletedRequest];
//           localStorage.setItem("removedProperties", JSON.stringify(updatedRemovedProperties));
//           return updatedRemovedProperties;
//         });
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Error deleting photo request.");
//     }
//     setShowPopup(false);
//   });
//   };
  
//   const handleUndoRemove = async (rentId, requesterPhoneNumber) => {
   
//     confirmAction("Do you want to restore this Photo request buyer?", async () => {

//     try {
//       const response = await axios.put(
//         `${process.env.REACT_APP_API_URL}/photo-requests/undo/${rentId}/${requesterPhoneNumber}`
//       );

//       if (response.status === 200) {
//         setMessage("Photo request restored.");

//         // Ensure status is correctly updated
//         const restoredProperty = response.data.request;
//         restoredProperty.status = 'photo request pending'; // Ensure it's set to an appropriate status


//         // Remove from 'removedProperties' and add back to 'properties'
//         setRemovedProperties((prev) => {
//           const updatedRemovedProperties = prev.filter(
//             (prop) => prop.rentId !== rentId
//           );
//           localStorage.setItem(
//             "removedProperties",
//             JSON.stringify(updatedRemovedProperties)
//           );
//           return updatedRemovedProperties;
//         });

//         setProperties((prev) => {
//           // Log properties before and after updating to verify change
//           const updatedProperties = [...prev, restoredProperty];
//           return updatedProperties;
//         });
//       }
//     } catch (error) {
//       setMessage("Error restoring photo request.");
//     }
//     setShowPopup(false);
//   });
//   };



//   useEffect(() => {
//     if (!phoneNumber) {
//       setMessage("Phone number is missing.");
//       setLoading(false);
//       return;
//     }
  
//     const fetchViewedProperties = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/photo-requests/buyer/${phoneNumber}`
//         );
//         if (response.status === 200) {
          
//           // Assuming `response.data` contains the properties with a `createdAt` field
//           // const sortedProperties = response.data.sort(
//           //   (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//           // );

//                   const sortedProperties = response.data.sort(
//   (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
// );
  
//           setProperties(sortedProperties); // Set sorted properties
//         } else {
//           setMessage("No photo requests found.");
//         }
//       } catch (error) {
//         setMessage("Error fetching photo requests.");
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchViewedProperties();
//   }, [phoneNumber]); // Trigger effect when `phoneNumber` changes
  

   
// useEffect(() => {
//   if (message) {
//     const timer = setTimeout(() => setMessage(""), 5000); // Auto-close after 3 seconds
//     return () => clearTimeout(timer); // Cleanup timer
//   }
// }, [message]);

//   // Save removed properties to localStorage whenever removedProperties changes
//   useEffect(() => {
//     localStorage.setItem("removedProperties", JSON.stringify(removedProperties));
//   }, [removedProperties]);

//   // Filter out removed properties from the properties list
//   const availableProperties = properties.filter(
//     (property) =>
//       !removedProperties.some((removed) => removed.rentId === property.rentId)
//   );

//   if (loading) return <p>Loading properties...</p>;


//   const activeProperties = properties.filter(
//     (property) =>
//       ["photo request pending", "photo send", "photo request rejected"].includes(property.status) &&
//       !removedProperties.some(
//         (removed) => removed.rentId === property.rentId && removed.requesterPhoneNumber === property.requesterPhoneNumber
//       )
//   );

     


//   return (
//     <div className="container d-flex align-items-center justify-content-center p-0">
//       <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', margin: 'auto', width: '100%' , fontFamily: 'Inter, sans-serif'}}>
//         {/* Buttons for filtering */}
//         <div className="d-flex align-items-center justify-content-start w-100"     style={{
//         background: "#EFEFEF",
//         position: "sticky",
//         top: 0,
//         zIndex: 1000,
//         opacity: isScrolling ? 0 : 1,
//         pointerEvents: isScrolling ? "none" : "auto",
//         transition: "opacity 0.3s ease-in-out",
//       }}>
//         <button
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
//     </button> <h3 className="m-0" style={{fontSize:"20px"}}>PHOTO REQUESTED BUYERS </h3> </div>
//         <div className="row g-2 w-100">
//           <div className="col-6 p-0">
//             <button className="w-100" style={{ backgroundColor: '#4F4B7E', color: 'white' }} onClick={() => setActiveKey("All")}>
//               All Properties
//             </button>
//           </div>
//           <div className="col-6 p-0">
//             <button className="w-100" style={{ backgroundColor: '#FFFFFF', color: 'grey' }} onClick={() => setActiveKey("Removed")}>
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
//         properties={activeProperties}  // ✅ Show only required statuses
//         onRemove={handleRemoveProperty}
//         setProperties={setProperties}
//         setRemovedProperties={setRemovedProperties}
//       />
//     ) : (
//       <PropertyList
//         properties={removedProperties.filter(property => property.status === "deleted")} // ✅ Show only "deleted" properties
//         onUndo={handleUndoRemove}
//       />
//     )}
//   </div>
// </div>


//           {/* </div> */}
//         </div>
//       </div>
//     </div>
//   );
// };


// const PropertyList = ({ properties, onRemove, onUndo, setProperties , setRemovedProperties , removedProperties}) => {
//   const navigate = useNavigate();

  
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
//         <div className="col-12 mb-1 p-0" key={property.rentId} 
//   onClick={() => navigate(`/detail/${property.rentId}`)}
// >
//           <PropertyCard
//             property={property}
//             onRemove={onRemove}
//             onUndo={onUndo}
//             setProperties={setProperties}
//             setRemovedProperties={setRemovedProperties}
//             removedProperties={removedProperties}
//           />
//         </div>
//       ))}
//     </div>
//   );
// };


// const PropertyCard = ({ property, onRemove, onUndo, setProperties }) => {

//   const [showFullNumber, setShowFullNumber] = useState(false);
//   const [message, setMessage] = useState({ text: "", type: "" });

//  const navigate = useNavigate();
//   const handleUploadPhoto = async (rentId, requesterPhoneNumber, file) => {
//     try {
//       const formData = new FormData();
//       formData.append("photo", file);
  
//       const response = await axios.put(
//         `${process.env.REACT_APP_API_URL}/photos/send/${rentId}/${requesterPhoneNumber}`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
  
//       if (response.status === 200) {
//         setMessage("Photo uploaded successfully.");
  
      
//         setProperties((prevProperties) =>
//           prevProperties.map((prop) =>
//             prop.rentId === rentId && prop.requesterPhoneNumber === requesterPhoneNumber
//               ? { 
//                   ...prop, 
//                   status: "photo send",  // ✅ Ensure status is updated
//                   photos: [...(prop.photos || []), response.data.request.photoPath] 
//                 }
//               : prop
//           )
//         );
  
//       }
//     } catch (error) {
//       setMessage("Error uploading photo.");
//     }
//   };


//   const handleAcceptPhotoRequest = (rentId, requesterPhoneNumber) => {
//     // Your logic to handle accepting the photo request
//     const fileInput = document.createElement("input");
//     fileInput.type = "file";
//     fileInput.accept = "image/*";
//     fileInput.onchange = (event) => {
//       const file = event.target.files[0];
//       if (file) {
//         handleUploadPhoto(rentId, requesterPhoneNumber, file); // Ensure you have handleUploadPhoto defined
//       }
//     };
//     fileInput.click();
//   };

//   const handleRejectPhotoRequest = async (rentId, requesterPhoneNumber) => {
//     // Your logic to handle rejecting the photo request
//     try {
//       const response = await axios.put(
//         `${process.env.REACT_APP_API_URL}/photo-requests/reject/${rentId}`,
//         { requesterPhoneNumber } // Send requesterPhoneNumber in the request body
//       );

//       if (response.status === 200) {
//         setMessage("Photo request rejected.");

//         setProperties((prevProperties) =>
//           prevProperties.map((prop) =>
//             prop.rentId === rentId && prop.requesterPhoneNumber === requesterPhoneNumber
//               ? { ...prop, status: "photo request rejected" }
//               : prop
//           )
//         );
//       }
//     } catch (error) {
//       setMessage("Error rejecting photo request.");
//     }
//   };

//   return (
//     <>

// <div
//       key={property.rentId}
//       className="card p-2 w-100 w-md-50 w-lg-33"
// onClick={(e) => {
//   const tag = e.target.tagName.toLowerCase();
//   if (["button", "svg", "path", "a"].includes(tag)) return; // Prevent from buttons/icons
//   navigate(`/detail/${property.rentId}`);
// }}

//       style={{
//         border: "1px solid #ddd",
//         borderRadius: "10px",
//         overflow: "hidden",
//         marginBottom: "15px",
//         fontFamily: "Inter, sans-serif",
//       }}
//     >
//       <div className="row d-flex align-items-center">
//         <div className="col-3 d-flex align-items-center justify-content-center mb-1">
//           <img
//             src={profil}
//             alt="Placeholder"
//             className="rounded-circle mt-2"
//             style={{ width: "80px", height: "80px", objectFit: "cover" }}
//           />

//         </div>
//         <div className='p-0' style={{background:"#707070", width:"2px", height:"80px"}}></div>
//         <div className="col-7 p-0 ms-4">
//           <div className='text-center rounded-1 w-100 mb-1' style={{border:"2px solid #4F4B7E", color:"#4F4B7E", fontSize:"14px"}}>PHOTO REQUEST</div>
//           <div className="d-flex">
//             <p className="mb-1" style={{ color: "#474747", fontWeight: "500",fontSize:"12px" }}>
//             PUC- {property.rentId}
//             </p>
//           </div>    

//           <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500",fontSize:"16px" }}>
//             {property.propertyType || "N/A"} |{property.city || "N/A"}
//           </h5>
       
//         </div>
//       </div>

//       <div className="p-1">

    
//         <div className="d-flex align-items-center mb-2">

//           <div               onClick={(e) =>{e.stopPropagation(); handleAcceptPhotoRequest(property.rentId, property.requesterPhoneNumber);}}

//           className='d-flex col-4 flex-column justify-content-between align-items-center p-3 rounded-3' style={{border:"2px solid #4F4B7E", color:"#4F4B7E", cursor:"pointer"}}>
//          <span className='rounded-circle p-1 d-flex justify-content-center align-items-center' style={{background:"#4F4B7E",height:'30px', width:"30px"}}><TbCameraPlus color='white'/></span> 
// <p className='m-0'style={{ fontSize: "14px" }}>Add Property</p>
// <p className='m-0'style={{ fontSize: "14px" }}>Image</p>
//           </div>
//         <div className="d-flex  flex-column align-items-start justify-content-between ps-3">

//           <div className="d-flex align-items-center mb-4">
//             <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//             <div>
//               <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>
//                 Photo Requested Date
//               </h6>
//               {/* <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500"}}>
//               {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
//               </span> */}

//                 <span style={{ fontSize: '13px', color: '#5E5E5E', fontWeight: 500 }}>
//     {
//       property.updatedAt && property.updatedAt !== property.createdAt
//         ? new Date(property.updatedAt).toLocaleDateString('en-IN', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//           })
//         : new Date(property.createdAt).toLocaleDateString('en-IN', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//           })
//     }
//   </span>
//             </div>
//           </div>


//           <div className="d-flex align-items-center mb-1">
//             <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//             <div>
//               <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>
//                  Buyer Phone
//               </h6>
        
// <span className="card-text" style={{ fontWeight: "500" }}>
//   <a
//     href={`tel:${property.requesterPhoneNumber}`}
//     style={{ textDecoration: "none", color: "#1D1D1D" }}
//     onClick={async (e) => {
//       e.preventDefault();  // Prevent the default behavior of the link
//       try {
//         await axios.post(`${process.env.REACT_APP_API_URL}/contact`, {
//           rentId: property.rentId,
//           phoneNumber: property.requesterPhoneNumber,
//         });
//         setMessage({ text: "Contact saved successfully", type: "success" });
//       } catch (error) {
//         setMessage({ text: "Something went wrong", type: "error" });
//       } finally {
//         window.location.href = `tel:${property.requesterPhoneNumber}`; // Open dialer after logging
//       }
//     }}
//   >
//     {showFullNumber
//       ? property.requesterPhoneNumber
//       : property.requesterPhoneNumber?.slice(0, 5) + "*****"}
//   </a>
// </span>
//             </div>
//           </div>
//           </div>



          
          
//         </div>
//         {!showFullNumber && (
//     <button className='w-100 m-0 p-1'
//     onClick={(e) => {
//       e.stopPropagation(); setShowFullNumber(true)}}
//       style={{
//         background: "#4F4B7E", 
//         color: "white", 
//         border: "none", 
       
//         marginLeft: "10px", 
//         cursor: "pointer",
//         borderRadius: "5px"
//       }}>
//       View
//     </button>
//   )}
//     {showFullNumber
//       ?  <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
//           {property.status !== "photo request rejected" && (
//             <button
//               className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//               onClick={(e) =>  {e.stopPropagation();
//                 handleRejectPhotoRequest(property.rentId, property.requesterPhoneNumber);}}
//               style={{ background:  "#FF0000", width: "80px", fontSize: "11px" }}

//            >
//               Reject
//             </button>
//           )}
// <button
//   className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//   style={{ background: "#4F4B7E", width: "80px", fontSize: "13px" }}
//   onClick={async (e) => {
//     e.preventDefault();
//     e.stopPropagation(); // add this
//     try {
//       await axios.post(`${process.env.REACT_APP_API_URL}/contact`, {
//         rentId: property.rentId,
//         phoneNumber: property.requesterPhoneNumber,
//       });
//       setMessage({ text: "Contact saved successfully", type: "success" });
//     } catch (error) {
//       setMessage({ text: "Something went wrong", type: "error" });
//     } finally {
//       window.location.href = `tel:${property.requesterPhoneNumber}`; // Open dialer after logging
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
//                  {onRemove && (
//         <button
//         className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//         style={{ background: "#FF0000", color: "white", cursor: "pointer",  fontSize: "13px"}}
//         onMouseOver={(e) => {
//           e.target.style.background = "#FF6700"; // Brighter neon on hover
//           e.target.style.fontWeight = 600; // Brighter neon on hover
//           e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
//         }}
//         onMouseOut={(e) => {
//           e.target.style.background = "#FF4500"; // Original orange
//           e.target.style.fontWeight = 400; // Brighter neon on hover

//         }}
//     onClick={(e) => {
//       e.stopPropagation(); 
//       onRemove(property.rentId, property.requesterPhoneNumber);
//     }}        >
//           Remove
//         </button>
//       )}
//       {onUndo && (
//         <button
//         className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//           style={{ background: "green", color: "white", cursor: "pointer" ,  fontSize: "13px"}}
//           onClick={() => onUndo(property.rentId, property.requesterPhoneNumber)}
//           onMouseOver={(e) => {
//             e.target.style.background = "#32cd32"; // Brighter neon on hover
//             e.target.style.fontWeight = 600; // Brighter neon on hover
//             e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
//           }}
//           onMouseOut={(e) => {
//             e.target.style.background = "#39ff14"; // Original orange
//             e.target.style.fontWeight = 400; // Brighter neon on hover
  
//           }}
//         >
//           Undo
//         </button>
//       )}
//       </div>
//       : ''}
       
//       {/* <p>{property.status || "N/A"}</p> */}
//       </div>
//     </div>
//     </>
//   );
// };


// export default App;
























import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  FaRupeeSign, FaBed,  
  FaCalendarAlt, FaUserAlt, FaRulerCombined,
  FaCamera,
  FaEye,
  FaPhoneAlt,
  FaChevronLeft
} from "react-icons/fa";
import myImage from '../../Assets/Rectangle 146.png'; // Correct path
import myImage1 from '../../Assets/Rectangle 145.png'; // Correct path
import pic from '../../Assets/Default image_PP-01.png'; // Correct path
import { MdCall } from 'react-icons/md';
import profil from '../../Assets/xd_profile.png'
import { TbCameraPlus } from "react-icons/tb";
import { Button, Modal } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import NoData from "../../Assets/OOOPS-No-Data-Found.png";


const App = () => {
    const location = useLocation();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const [phoneNumber] = useState(storedPhoneNumber);  
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const [activeKey, setActiveKey] = useState("All");
  const [removedProperties, setRemovedProperties] = useState(() => {
    const storedRemovedProperties = localStorage.getItem("removedProperties");
    return storedRemovedProperties ? JSON.parse(storedRemovedProperties) : [];
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupAction, setPopupAction] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();
  const [isScrolling, setIsScrolling] = useState(false);


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

  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
          phoneNumber: phoneNumber,
          viewedFile: "Photo request Buyer",
          viewTime: new Date().toISOString(),
        });
      } catch (err) {}
    };
    if (phoneNumber) {
      recordDashboardView();
    }
  }, [phoneNumber]);

  const confirmAction = (message, action) => {
    setPopupMessage(message);
    setPopupAction(() => action);
    setShowPopup(true);
  };

  const handleRemoveProperty = async (rentId, requesterPhoneNumber) => {
    confirmAction("Are you sure you want to remove this Photo request?", async () => {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/photo-requests-rent/delete/${rentId}/${requesterPhoneNumber}`
        );

        if (response.status === 200) {
          setMessage({ text: "Photo request marked as deleted.", type: "success" });

          const deletedRequest = response.data.request;
          setProperties((prev) =>
            prev.filter(
              (prop) =>
                !(prop.rentId === rentId && prop.requesterPhoneNumber === requesterPhoneNumber)
            )
          );

          setRemovedProperties((prev) => {
            const updated = [...prev, deletedRequest];
            localStorage.setItem("removedProperties", JSON.stringify(updated));
            return updated;
          });
        }
      } catch (error) {
        setMessage({ text: error.response?.data?.message || "Error deleting photo request.", type: "error" });
      }
      setShowPopup(false);
    });
  };

  const handleUndoRemove = async (rentId, requesterPhoneNumber) => {
    confirmAction("Do you want to restore this Photo request buyer?", async () => {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/photo-requests-rent/undo/${rentId}/${requesterPhoneNumber}`
        );

        if (response.status === 200) {
          setMessage({ text: "Photo request restored.", type: "success" });
          const restoredProperty = response.data.request;

          setRemovedProperties((prev) => {
            const updated = prev.filter(
              (prop) =>
                !(prop.rentId === rentId && prop.requesterPhoneNumber === requesterPhoneNumber)
            );
            localStorage.setItem("removedProperties", JSON.stringify(updated));
            return updated;
          });

          setProperties((prev) => [...prev, restoredProperty]);
        }
      } catch (error) {
        setMessage({ text: error.response?.data?.message || "Error restoring photo request.", type: "error" });
      }
      setShowPopup(false);
    });
  };

useEffect(() => {
  if (!phoneNumber) {
    setMessage({ text: "Phone number is missing.", type: "error" });
    setLoading(false);
    return;
  }

  const fetchPhotoRequestsWithPayuStatus = async () => {
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      // 🔹 1. Fetch PayU Status
      const statusRes = await axios.get(`${process.env.REACT_APP_API_URL}/payustatus-users`);

      // 🔹 2. Fetch Photo Requests
      const photoRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/photo-requests-rent/buyer/${phoneNumber}`
      );

      if (statusRes.status === 200 && photoRes.status === 200) {
        // 🔹 3. Create PayU Status Map
        const statusMap = {};
        statusRes.data.forEach(({ rentId, status }) => {
          if (rentId) statusMap[rentId] = status;
        });

        const rawData = Array.isArray(photoRes.data) ? photoRes.data : [];

        // 🔹 4. Enrich with payuStatus + propertyMessage
        const enriched = await Promise.all(
          rawData.map(async (property) => {
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
              requesterPhoneNumber: property.requesterPhoneNumber || property.phoneNumber,
              payuStatus: statusMap[property.rentId] || "unpaid",
              propertyMessage,
            };
          })
        );

        // 🔹 5. Sort by latest date
        const sorted = enriched.sort(
          (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        );

        setProperties(sorted);
        localStorage.setItem("photoRequests", JSON.stringify(sorted));
      } else {
        setMessage({ text: "No photo requests found.", type: "info" });
      }
    } catch (error) {
      console.error("Error loading photo request or PayU data:", error);
      setMessage({ text: "Error fetching photo requests.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  fetchPhotoRequestsWithPayuStatus();
}, [phoneNumber]);



  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    localStorage.setItem("removedProperties", JSON.stringify(removedProperties));
  }, [removedProperties]);

  const activeProperties = properties.filter(
    (property) =>
      ["photo request pending", "photo send", "photo request rejected"].includes(property.status) &&
      !removedProperties.some(
        (removed) => removed.rentId === property.rentId && removed.requesterPhoneNumber === property.requesterPhoneNumber
      )
  );

  if (loading) return (
    <div className="text-center my-4" style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }}>
      <span className="spinner-border text-primary" role="status" />
      <p className="mt-2">Loading properties...</p>
    </div>
  );

  return (
    <div className="container d-flex align-items-center justify-content-center p-0">
      <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', margin: 'auto', width: '100%', fontFamily: 'Inter, sans-serif' }}>
        {/* Header with back button */}
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
            </button>
          <h3 className="m-0" style={{ fontSize: "18px" }}>PHOTO REQUESTED TENANT</h3>
        </div>

        {/* Filter buttons */}
        <div className="row g-2 w-100">
          <div className="col-6 p-0 ">
            <button className="w-100 p-2 border-0" style={{ backgroundColor: '#4F4B7E', color: 'white' }} onClick={() => setActiveKey("All")}>
              ALL TENANT
            </button>
          </div>
          <div className="col-6 p-0">
            <button className="w-100 p-2 border-0" style={{ backgroundColor: '#FFFFFF', color: 'grey' }} onClick={() => setActiveKey("Removed")}>
              REMOVED TENANT
            </button>
          </div>

          {/* Message Alert */}
          <div>
            {message.text && (
              <p style={{ color: message.type === "success" ? "green" : message.type === "error" ? "red" : "blue" }}>
                {message.text}
              </p>
            )}
            <Modal show={showPopup} onHide={() => setShowPopup(false)}>
              <Modal.Body>
                <p>{popupMessage}</p>
                <Button
                  style={{ background: "#4F4B7E", width: "80px", fontSize: "13px", border: "none" }}
                  onClick={popupAction}
                  onMouseOver={(e) => {
                    e.target.style.background = "#FF6700";
                    e.target.style.fontWeight = 600;
                    e.target.style.transition = "background 0.3s ease";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#FF4500";
                    e.target.style.fontWeight = 400;
                  }}
                >
                  Yes
                </Button>
                <Button
                  className="ms-3"
                  style={{ background: "#FF0000", width: "80px", fontSize: "13px", border: "none" }}
                  onClick={() => setShowPopup(false)}
                  onMouseOver={(e) => {
                    e.target.style.background = "#029bb3";
                    e.target.style.fontWeight = 600;
                    e.target.style.transition = "background 0.3s ease";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#4F4B7E";
                    e.target.style.fontWeight = 400;
                  }}
                >
                  No
                </Button>
              </Modal.Body>
            </Modal>
          </div>

          {/* Property List */}
          <div className="col-12">
            <div className="w-100 d-flex align-items-center justify-content-center" style={{ maxWidth: '500px' }}>
              {activeKey === "All" ? (
                <PropertyList
                  properties={activeProperties}
                  onRemove={handleRemoveProperty}
                  setProperties={setProperties}
                  setRemovedProperties={setRemovedProperties}
                />
              ) : (
                <PropertyList
                  properties={removedProperties.filter(property => property.status === "deleted")}
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

const PropertyList = ({ properties, onRemove, onUndo, setProperties, setRemovedProperties }) => {
  const navigate = useNavigate();

  return properties.length === 0 ? (
    <div className="text-center my-4" style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }}>
      <img src={NoData} alt="" width={100} />
      <p>No properties found.</p>
    </div>
  ) : (
    <div className="row m-0 w-100">
      {properties.map((property) => (
        <div className="col-12 mb-1 p-0" key={property.rentId}>
          <PropertyCard
            property={property}
            onRemove={onRemove}
            onUndo={onUndo}
            setProperties={setProperties}
          />
        </div>
      ))}
    </div>
  );
};

// const PropertyCard = ({ property, onRemove, onUndo, setProperties }) => {
//   const [showFullNumber, setShowFullNumber] = useState(false);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const navigate = useNavigate();

//   //  const location = useLocation();
//   // const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
//   // const [phoneNumber] = useState(storedPhoneNumber);  
//     // Auto-clear message after 3 seconds
//     useEffect(() => {
//      if (message.text) {
//        const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
//        return () => clearTimeout(timer);
//      }
//    }, [message]);
      

//   const handleUploadPhoto = async (rentId, requesterPhoneNumber, file) => {
//     try {
//       const formData = new FormData();
//       formData.append("photo", file);

//       const response = await axios.put(
//         `${process.env.REACT_APP_API_URL}/photos-rent/send/${rentId}/${requesterPhoneNumber}`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       if (response.status === 200) {
//         setMessage({ text: "Photo uploaded successfully.", type: "success" });

//         setProperties((prevProperties) =>
//           prevProperties.map((prop) =>
//             prop.rentId === rentId && prop.requesterPhoneNumber === requesterPhoneNumber
//               ? {
//                 ...prop,
//                 status: "photo send",
//                 photos: [...(prop.photos || []), response.data.request.photoPath]
//               }
//               : prop
//           )
//         );
//       }
//     } catch (error) {
//       setMessage({ text: "Error uploading photo.", type: "error" });
//     }
//   };


  
//     const handleCallClick = async (e) => {
//       e.preventDefault();
//       e.stopPropagation();
      
//       try {
//         const response = await axios.post(`${process.env.REACT_APP_API_URL}/contact-send-property`, {
//           rentId: property.rentId,
//           userPhone: property.requesterPhoneNumber,
//           postedUserPhone: localStorage.getItem('phoneNumber'),
//           status: "contactSend"
//         });

//         // setApiResponse(response.data);
//         setMessage({ text: "Contact saved successfully", type: "success" });
//         console.log("API Response:", response.data);
        
//         window.location.href = `tel:${property.requesterPhoneNumber}`;
//       } catch (error) {
//         setMessage({ text: "Something went wrong", type: "error" });
//         console.error("API Error:", error);
//       }
//     };

//   const handleAcceptPhotoRequest = (rentId, requesterPhoneNumber) => {
//     const fileInput = document.createElement("input");
//     fileInput.type = "file";
//     fileInput.accept = "image/*";
//     fileInput.onchange = (event) => {
//       const file = event.target.files[0];
//       if (file) {
//         handleUploadPhoto(rentId, requesterPhoneNumber, file);
//       }
//     };
//     fileInput.click();
//   };

//   const handleRejectPhotoRequest = async (rentId, requesterPhoneNumber) => {
//     try {
//       const response = await axios.put(
//         `${process.env.REACT_APP_API_URL}/photo-requests-rent/reject/${rentId}`,
//         { requesterPhoneNumber }
//       );

//       if (response.status === 200) {
//         setMessage({ text: "Photo request rejected.", type: "success" });

//         setProperties((prevProperties) =>
//           prevProperties.map((prop) =>
//             prop.rentId === rentId && prop.requesterPhoneNumber === requesterPhoneNumber
//               ? { ...prop, status: "photo request rejected" }
//               : prop
//           )
//         );
//       }
//     } catch (error) {
//       setMessage({ text: "Error rejecting photo request.", type: "error" });
//     }
//   };

//   const handlePayNow = (rentId, user) => {
//     navigate("/pricing-plans", {
//       state: {
//         phoneNumber: user.phoneNumber,
//         rentId,
//       },
//     });
//   };

//   return (
//     <div
//       className="card p-2 w-100 w-md-50 w-lg-33"
//       onClick={(e) => {
//         const tag = e.target.tagName.toLowerCase();
//         if (["button", "svg", "path", "a"].includes(tag)) return;
//         navigate(`/detail/${property.rentId}`);
//       }}
//       style={{
//         border: "1px solid #ddd",
//         borderRadius: "10px",
//         overflow: "hidden",
//         marginBottom: "15px",
//         fontFamily: "Inter, sans-serif",
//       }}
//     >
//       <div className="row d-flex align-items-center">
//         <div className="col-3 d-flex align-items-center justify-content-center mb-1">
//           <img
//             src={profil}
//             alt="Profile"
//             className="rounded-circle mt-2"
//             style={{ width: "80px", height: "80px", objectFit: "cover" }}
//           />
//         </div>
//         <div className="p-0" style={{ background: "#707070", width: "2px", height: "80px" }}></div>
//         <div className="col-7 p-0 ms-4">
//           <div className="text-center rounded-1 w-100 mb-1" style={{ border: "2px solid #4F4B7E", color: "#4F4B7E", fontSize: "14px" }}>
//             PHOTO REQUEST
//           </div>
//           <p className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "12px" }}>RENT-{property.rentId}</p>
// <button
//   className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//   style={{ background: "#4F4B7E", fontSize: "13px" }}
//   onClick={async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/contact-send-property`,
//         {
//           userPhone: property.requesterPhoneNumber,
//           postedUserPhone: property.phoneNumber, // or whatever field has the owner's number
//           rentId: property.rentId,
//           status: "contactSend"
//         }
//       );
      
//       if (response.status === 200) {
//         setMessage({ text: "Contact saved successfully", type: "success" });
//         window.location.href = `tel:${property.requesterPhoneNumber}`;
//       }
//     } catch (error) {
//       setMessage({ 
//         text: error.response?.data?.message || "Something went wrong", 
//         type: "error" 
//       });
//     }
//   }}
//   onMouseOver={(e) => {
//     e.target.style.background = "#029bb3";
//     e.target.style.fontWeight = 600;
//   }}
//   onMouseOut={(e) => {
//     e.target.style.background = "#4F4B7E";
//     e.target.style.fontWeight = 400;
//   }}
// >
//   Call
// </button>
//    {property.propertyMessage && (
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

//           <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "16px" }}>
//             {property.propertyType || "N/A"} | {property.city || "N/A"}
//           </h5>
//           <p className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "14px" }}>
//             ₹{property.rentalAmount?.toLocaleString() || "0"} <span style={{ color: '#4F4B7E', fontSize: '13px', marginLeft: "5px", fontSize: '11px' }}>
//                          / {property.rentType || "N/A"}
//                         </span>
//           </p>
//         </div>
//       </div>

//       <div className="p-1">
//         <div className="d-flex align-items-center mb-2">
//           <div
//             onClick={(e) => {
//               e.stopPropagation();
//               handleAcceptPhotoRequest(property.rentId, property.requesterPhoneNumber);
//             }}
//             className="d-flex col-4 flex-column justify-content-between align-items-center p-3 rounded-3"
//             style={{ border: "2px solid #4F4B7E", color: "#4F4B7E", cursor: "pointer" }}
//           >
//             <span className="rounded-circle p-1 d-flex justify-content-center align-items-center" style={{ background: "#4F4B7E", height: '30px', width: "30px" }}>
//               <TbCameraPlus color="white" />
//             </span>
//             <p className="m-0" style={{ fontSize: "14px" }}>Add Property</p>
//             <p className="m-0" style={{ fontSize: "14px" }}>Image</p>
//           </div>

//           <div className="d-flex flex-column align-items-start justify-content-between ps-3">
//             <div className="d-flex align-items-center mb-4">
//               <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//               <div>
//                 <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Photo Requested Date</h6>
//                 <span style={{ fontSize: '13px', color: '#5E5E5E', fontWeight: 500 }}>
//                   {new Date(property.updatedAt || property.createdAt).toLocaleDateString('en-IN', {
//                     year: 'numeric',
//                     month: 'short',
//                     day: 'numeric'
//                   })}
//                 </span>
//               </div>
//             </div>

//             <div className="d-flex align-items-center mb-1">
//               <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//               <div>
//                 <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Tenant Phone</h6>
//                 {property.payuStatus === "paid" ? (
//                     <span className="card-text" style={{ fontWeight: "500" }}>
//                       <a
//                         href={`tel:${property.requesterPhoneNumber}`}
//                         style={{ textDecoration: "none", color: "#1D1D1D" }}
//                         onClick={handleCallClick}
//                       >
//                         {showFullNumber
//                           ? property.requesterPhoneNumber
//                           : property.requesterPhoneNumber?.slice(0, 5) + "*****"}
//                       </a>
//                     </span>
//                   ) : (
//                   <span style={{ color: "#888" }}>{property.requesterPhoneNumber?.slice(0, 5) + "*****"}</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {message.text && (
//           <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`} style={{ fontSize: "12px" }}>
//             {message.text}
//           </div>
//         )}

//         {property.payuStatus === "paid" ? (
//           <>
//             {!showFullNumber ? (
//               <button
//                 className="w-100 m-0 p-1"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setShowFullNumber(true);
//                 }}
//                 style={{
//                   background: "#4F4B7E",
//                   color: "white",
//                   border: "none",
//                   cursor: "pointer",
//                   borderRadius: "5px"
//                 }}
//               >
//                 View
//               </button>
//             ) : (
//               <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
//                 {property.status !== "photo request rejected" && (
//                   <button
//                     className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//                     style={{ background: "#FF0000", fontSize: "11px" }}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleRejectPhotoRequest(property.rentId, property.requesterPhoneNumber);
//                     }}
//                   >
//                     Reject
//                   </button>
//                 )}
// {/* 
//                 <button
//                   className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//                   style={{ background: "#4F4B7E", fontSize: "13px" }}
//                   onClick={async (e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     try {
//                       await axios.post(`${process.env.REACT_APP_API_URL}/contact`, {
//                         rentId: property.rentId,
//                         phoneNumber: property.requesterPhoneNumber,
//                       });
//                       setMessage({ text: "Contact saved successfully", type: "success" });
//                     } catch {
//                       setMessage({ text: "Something went wrong", type: "error" });
//                     } finally {
//                       window.location.href = `tel:${property.requesterPhoneNumber}`;
//                     }
//                   }}
//                   onMouseOver={(e) => {
//                     e.target.style.background = "#029bb3";
//                     e.target.style.fontWeight = 600;
//                   }}
//                   onMouseOut={(e) => {
//                     e.target.style.background = "#4F4B7E";
//                     e.target.style.fontWeight = 400;
//                   }}
//                 >
//                   Call
//                 </button> */}

//       <button
//                     className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//                     style={{ background: "#2F747F", fontSize: "13px" }}
//                     onClick={handleCallClick}
//                     onMouseOver={(e) => {
//                       e.target.style.background = "#029bb3";
//                       e.target.style.fontWeight = 600;
//                     }}
//                     onMouseOut={(e) => {
//                       e.target.style.background = "#2F747F";
//                       e.target.style.fontWeight = 400;
//                     }}
//                   >
//                     Call
//                   </button>



//                 {onRemove && (
//                   <button
//                     className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//                     style={{ background: "#FF4500", fontSize: "13px" }}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onRemove(property.rentId, property.requesterPhoneNumber);
//                     }}
//                   >
//                     Remove
//                   </button>
//                 )}

//                 {onUndo && (
//                   <button
//                     className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//                     style={{ background: "green", fontSize: "13px" }}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onUndo(property.rentId, property.requesterPhoneNumber);
//                     }}
//                   >
//                     Undo
//                   </button>
//                 )}
//               </div>
//             )}
//           </>
//         ) : (
//           <>
            // <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1 w-100">
            //   <button
            //     className="btn text-white px-3 py-1 mt-2 me-1 w-100"
            //     onClick={(e) => {
            //       e.stopPropagation();
            //       handlePayNow(property.rentId, property.requesterPhoneNumber);
            //     }}
            //     style={{
            //       background: "#FFB100",
            //       color: "white",
            //       border: "none",
            //       borderRadius: "5px",
            //       fontSize: "14px",
            //       marginTop: "5px"
            //     }}
            //   >
            //     Pay Now to Contact
            //   </button>

            //   {onRemove && (
            //     <button
            //       className="btn text-white px-3 py-1 mt-2 w-100"
            //       style={{ background: "#FF4500", fontSize: "13px" }}
            //       onClick={(e) => {
            //         e.stopPropagation();
            //         onRemove(property.rentId, property.requesterPhoneNumber);
            //       }}
            //     >
            //       Remove
            //     </button>
            //   )}

            //   {onUndo && (
            //     <button
            //       className="btn text-white px-3 py-1 mt-2 w-100"
            //       style={{ background: "green", fontSize: "13px" }}
            //       onClick={(e) => {
            //         e.stopPropagation();
            //         onUndo(property.rentId, property.requesterPhoneNumber);
            //       }}
            //     >
            //       Undo
            //     </button>
            //   )}
            // </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };


const PropertyCard = ({ property, onRemove, onUndo, setProperties }) => {
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const [phoneNumber] = useState(storedPhoneNumber);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleCallClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Calling API with:", {
      rentId: property.rentId,
      userPhone: property.requesterPhoneNumber,
      postedUserPhone: phoneNumber,
      status: "contactSend"
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/contact-send-property`,
        {
          rentId: property.rentId,
          userPhone: property.requesterPhoneNumber,
          postedUserPhone: phoneNumber,
          status: "contactSend"
        }
      );

      if (response.data.success) {
        setMessage({ text: response.data.message || "Contact saved successfully", type: "success" });
        window.location.href = `tel:${property.requesterPhoneNumber}`;
      } else {
        setMessage({ 
          text: response.data.message || "Failed to save contact", 
          type: "error" 
        });
      }
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || "Something went wrong", 
        type: "error" 
      });
      console.error("API Error:", error.response?.data || error);
    }
  };

  const handleUploadPhoto = async (rentId, requesterPhoneNumber, file) => {
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/photos-rent/send/${rentId}/${requesterPhoneNumber}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        setMessage({ text: "Photo uploaded successfully.", type: "success" });
        setProperties(prev => prev.map(prop => 
          prop.rentId === rentId && prop.requesterPhoneNumber === requesterPhoneNumber
            ? { ...prop, status: "photo send", photos: [...(prop.photos || []), response.data.request.photoPath] }
            : prop
        ));
      }
    } catch (error) {
      setMessage({ text: "Error uploading photo.", type: "error" });
    }
  };

  const handleAcceptPhotoRequest = (rentId, requesterPhoneNumber) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => e.target.files[0] && 
      handleUploadPhoto(rentId, requesterPhoneNumber, e.target.files[0]);
    fileInput.click();
  };

  const handleRejectPhotoRequest = async (rentId, requesterPhoneNumber) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/photo-requests-rent/reject/${rentId}`,
        { requesterPhoneNumber }
      );

      if (response.status === 200) {
        setMessage({ text: "Photo request rejected.", type: "success" });
        setProperties(prev => prev.map(prop => 
          prop.rentId === rentId && prop.requesterPhoneNumber === requesterPhoneNumber
            ? { ...prop, status: "photo request rejected" }
            : prop
        ));
      }
    } catch (error) {
      setMessage({ text: "Error rejecting photo request.", type: "error" });
    }
  };

  const handlePayNow = () => {
    navigate("/pricing-plans", {
      state: { phoneNumber: property.requesterPhoneNumber, rentId: property.rentId }
    });
  };

  return (
    <div className="card p-2 w-100 mb-3" style={{ 
      border: "1px solid #ddd", 
      borderRadius: "10px",
      fontFamily: "Inter, sans-serif"
    }}>
      <div className="row d-flex align-items-center">
        <div className="col-3 text-center">
          <img
            src={profil}
            alt="Profile"
            className="rounded-circle"
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
          />
        </div>
        
        <div className="col-8 ms-3">
          <div className="text-center rounded-1 mb-2 p-1" style={{ 
            border: "2px solid #4F4B7E", 
            color: "#4F4B7E", 
            fontSize: "14px" 
          }}>
            PHOTO REQUEST
          </div>
          
          <p className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "12px" }}>
            RENT-{property.rentId}
          </p>
         
          {property.propertyMessage && (
            <p className="text-danger fw-bold mb-1" style={{ fontSize: "12px" }}>
              {property.propertyMessage}
            </p>
          )}
          
          <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "16px" }}>
            {property.propertyType || "N/A"} | {property.city || "N/A"}
          </h5>
          
          <p className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "14px" }}>
            ₹{property.rentalAmount?.toLocaleString() || "0"} 
            <span style={{ color: '#4F4B7E', fontSize: '11px', marginLeft: "5px" }}>
              / {property.rentType || "N/A"}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-2">
        <div className="d-flex align-items-center mb-3">
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleAcceptPhotoRequest(property.rentId, property.requesterPhoneNumber);
            }}
            className="d-flex flex-column align-items-center justify-content-center p-2 rounded-3 me-3"
            style={{ 
              border: "2px solid #4F4B7E", 
              color: "#4F4B7E", 
              cursor: "pointer",
              width: "100px"
            }}
          >
            <span className="rounded-circle p-1 d-flex justify-content-center align-items-center mb-1" 
              style={{ background: "#4F4B7E", width: "30px", height: "30px" }}>
              <TbCameraPlus color="white" size={16} />
            </span>
            <p className="m-0 text-center" style={{ fontSize: "12px" }}>Add Property Image</p>
          </div>

          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-3">
              <FaCalendarAlt color="#4F4B7E" className="me-2" />
              <div>
                <p className="m-0 text-muted" style={{ fontSize: "11px" }}>Request Date</p>
                <span style={{ fontSize: '13px', color: '#5E5E5E', fontWeight: 500 }}>
                  {new Date(property.updatedAt || property.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>

            <div className="d-flex align-items-center">
              <MdCall color="#4F4B7E" className="me-2" />
              <div>
                <p className="m-0 text-muted" style={{ fontSize: "11px" }}>Tenant Phone</p>
                {property.payuStatus === "paid" ? (
                  <a
                    href={`tel:${property.requesterPhoneNumber}`}
                    style={{ 
                      textDecoration: "none", 
                      color: "#1D1D1D",
                      fontWeight: "500"
                    }}
                    onClick={handleCallClick}
                  >
                    {showFullNumber
                      ? property.requesterPhoneNumber
                      : property.requesterPhoneNumber?.slice(0, 5) + "*****"}
                  </a>
                ) : (
                  <span style={{ color: "#888" }}>
                    {property.requesterPhoneNumber?.slice(0, 5) + "*****"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mb-3`}>
            {message.text}
          </div>
        )}

        {property.payuStatus === "paid" ? (
          !showFullNumber ? (
            <button
              className="w-100 btn btn-primary py-2"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullNumber(true);
              }}
            >
              View Contact
            </button>
          ) : (
            <div className="d-flex gap-2">
              <button
                className="btn btn-danger flex-grow-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRejectPhotoRequest(property.rentId, property.requesterPhoneNumber);
                }}
              >
                Reject
              </button>
              
              <button
                className="btn btn-success flex-grow-1"
                onClick={handleCallClick}
              >
                Call Now
              </button>
              
              {onRemove && (
                <button
                  className="btn btn-warning flex-grow-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(property.rentId, property.requesterPhoneNumber);
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          )
        ) : (
           <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1 w-100">
              <button
                className="btn text-white px-3 py-1 mt-2 me-1 w-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePayNow(property.rentId, property.requesterPhoneNumber);
                }}
                style={{
                  background: "#FFB100",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "14px",
                  marginTop: "5px"
                }}
              >
                Pay Now to Contact
              </button>

              {onRemove && (
                <button
                  className="btn text-white px-3 py-1 mt-2 w-100"
                  style={{ background: "#FF4500", fontSize: "13px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(property.rentId, property.requesterPhoneNumber);
                  }}
                >
                  Remove
                </button>
              )}

              {onUndo && (
                <button
                  className="btn text-white px-3 py-1 mt-2 w-100"
                  style={{ background: "green", fontSize: "13px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUndo(property.rentId, property.requesterPhoneNumber);
                  }}
                >
                  Undo
                </button>
              )}
            </div>
        )}
      </div>
    </div>
  );
};


export default App;
