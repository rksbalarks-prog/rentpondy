

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import {FaCamera, FaEye , FaRulerCombined, FaBed, FaUserAlt, FaCalendarAlt, FaRupeeSign } from "react-icons/fa";
// import { MdCall } from "react-icons/md";
// import myImage from '../../Assets/Rectangle 766.png'; // Correct path
// import myImage1 from '../../Assets/Rectangle 145.png'; // Correct path
// import pic from '../../Assets/Default image_PP-01.png'; // Correct path
// import profil from '../../Assets/xd_profile.png'
// import { Button, Modal } from "react-bootstrap";
// import { FaArrowLeft } from "react-icons/fa";
// import Swal from "sweetalert2"; // Import SweetAlert2 for better popup messages
// import NoData from "../../Assets/OOOPS-No-Data-Found.png";

// const App = () => {
//   const [offers, setOffers] = useState([]); // Active properties
//   const [removedOffers, setRemovedOffers] = useState([]); // Removed properties
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [activeKey, setActiveKey] = useState("All");
//   const { phoneNumber } = useParams();
//   const [localProperties, setLocalProperties] = useState([]);
//   const [properties, setProperties] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupAction, setPopupAction] = useState(null);
//   const [popupMessage, setPopupMessage] = useState("");

//   const confirmAction = (message, action) => {
//     setPopupMessage(message);
//     setPopupAction(() => action);
//     setShowPopup(true);
//   };

  
  
//     useEffect(() => {
//       const recordDashboardView = async () => {
//         try {
//           await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
//             phoneNumber: phoneNumber,
//             viewedFile: "Owner Offer",
//             viewTime: new Date().toISOString(),
//           });
//         } catch (err) {
//         }
//       };
    
//       if (phoneNumber) {
//         recordDashboardView();
//       }
//     }, [phoneNumber]);
  
  
  
  
  

//   useEffect(() => {
//     if (message.text) {
//       const timer = setTimeout(() => {
//         setMessage({ text: "", type: "" });
//       }, 3000);
  
//       return () => clearTimeout(timer); // Cleanup timeout when component re-renders
//     }
//   }, [message]);
//   // Load offers and removedOffers from localStorage on page load
//   useEffect(() => {
//     const storedOffers = JSON.parse(localStorage.getItem("offers")) || [];
//     const storedRemovedOffers = JSON.parse(localStorage.getItem("removedOffers")) || [];

//     setOffers(storedOffers);
//     setRemovedOffers(storedRemovedOffers);
//   }, []);

//   // Persist changes to localStorage whenever offers or removedOffers change
//   useEffect(() => {
//     localStorage.setItem("offers", JSON.stringify(offers));
//     localStorage.setItem("removedOffers", JSON.stringify(removedOffers));
//   }, [offers, removedOffers]);

  

// //   // Fetch offers based on phoneNumber
// // useEffect(() => {
// //   const fetchOffers = async () => {
// //     if (!phoneNumber) return;

// //     setLoading(true);
// //     try {
// //       const response = await axios.get(`${process.env.REACT_APP_API_URL}/offers/buyer/${phoneNumber}`);
// //       if (response.status === 200) {
// //         const fetchedOffers = response.data.offers || [];
        
// //         // Sort the offers by createdAt (new to old)
// //         const sortedOffers = fetchedOffers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

// //         setOffers(sortedOffers);
// //       } else {
// //         // setMessage({ text: "No buyers found for this offer user.", type: "danger" });
// //       }
// //     } catch (error) {
// //       // setMessage({ text: "Failed to fetch offers. Please try again later.", type: "error" });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   fetchOffers();
// // }, [phoneNumber]);


//   const handleRemoveProperty = async (rentId, buyerPhoneNumber) => {
//      confirmAction("Are you sure you want to remove this offer?", async () => {

//     try {
//       // API call to delete the offer
//       await axios.put(`${process.env.REACT_APP_API_URL}/offers/delete/${rentId}/${buyerPhoneNumber}`);
      
//       // After deletion, update the state and localStorage
//       const updatedOffers = offers.filter(
//         (property) => property.rentId !== rentId || property.buyerPhoneNumber !== buyerPhoneNumber
//       );
      
//       // Find the property being removed to preserve its offeredPrice
//       const propertyToRemove = offers.find(
//         (property) => property.rentId === rentId && property.buyerPhoneNumber === buyerPhoneNumber
//       );
  
//       // If found, add it to removedOffers with the offeredPrice
//       if (propertyToRemove) {
//         const updatedRemovedOffers = [...removedOffers, propertyToRemove];
//         setRemovedOffers(updatedRemovedOffers);
//         localStorage.setItem("removedOffers", JSON.stringify(updatedRemovedOffers));
//       }
      
//       setOffers(updatedOffers);
//       localStorage.setItem("offers", JSON.stringify(updatedOffers));
  
//       // Optionally, show a success message to the user
//       setMessage({ text: "Property removed successfully", type: "success" });
//     } catch (error) {
//       setMessage({ text: "Error removing property", type: "danger" });
//     }
//     setShowPopup(false);
//   });
//   };
  

//   const handleUndoRemove = async (rentId, buyerPhoneNumber) => {
//        confirmAction("Do you want to restore this offer?", async () => {

//     try {
//       // API call to undo the removal of the offer
//       await axios.put(`${process.env.REACT_APP_API_URL}/offers/undo/${rentId}/${buyerPhoneNumber}`);
  
//       // Find the property to undo from removedOffers
//       const propertyToUndo = removedOffers.find(
//         (property) => property.rentId === rentId && property.buyerPhoneNumber === buyerPhoneNumber
//       );
  
//       if (propertyToUndo) {
//         // Example of how you might want to update the offeredPrice on undo
//         const updatedProperty = {
//           ...propertyToUndo,
//           offeredPrice: propertyToUndo.offeredPrice, // Ensure this is the price you want
//         };
  
//         // Update the offers state to include the restored property with the updated price
//         setOffers((prevOffers) => {
//           const updatedOffers = [...prevOffers, updatedProperty];
  
//           // Update localStorage with updated offers
//           localStorage.setItem("offers", JSON.stringify(updatedOffers));
//           return updatedOffers;
//         });
  
//         // Remove the property from removedOffers state
//         setRemovedOffers((prevRemovedOffers) => {
//           const updatedRemovedOffers = prevRemovedOffers.filter(
//             (property) => property.rentId !== rentId || property.buyerPhoneNumber !== buyerPhoneNumber
//           );
  
//           // Update localStorage with updated removedOffers
//           localStorage.setItem("removedOffers", JSON.stringify(updatedRemovedOffers));
  
//           return updatedRemovedOffers;
//         });
  
//         // Optionally, show a success message to the user
//         setMessage({ text: "Property restored successfully", type: "success" });
//       }
//     } catch (error) {
//       setMessage({ text: "Error restoring property", type: "danger" });
//     }
//     setShowPopup(false);
//   });
//   };
//   // useEffect(() => {
//   //   setProperties([...properties]); // Trigger re-render
//   // }, [properties]);

// const [payuStatuses, setPayuStatuses] = useState([]);

// // // Fetch PayU statuses on component mount
// // useEffect(() => {
// //   const fetchStatuses = async () => {
// //     try {
// //       const res = await axios.get(`${process.env.REACT_APP_API_URL}/payustatus-users`);
// //       if (res.data) setPayuStatuses(res.data); // directly from backend array
// //     } catch (err) {
// //       console.error("Failed to load PayU statuses:", err);
// //     }
// //   };
// //   fetchStatuses();
// // }, []);


// useEffect(() => {
//   const fetchOffersAndStatuses = async () => {
//     if (!phoneNumber) return;
//     setLoading(true);

//     try {
//       // Step 1: Fetch offers for the buyer
//       const offerRes = await axios.get(`${process.env.REACT_APP_API_URL}/offers/buyer/${phoneNumber}`);

//       // Step 2: Fetch all PayU statuses
//       const statusRes = await axios.get(`${process.env.REACT_APP_API_URL}/payustatus-users`);

//       if (offerRes.status === 200 && statusRes.status === 200) {
//         const fetchedOffers = offerRes.data.offers || [];

//         // Create map: { rentId: "paid" | "unpaid" | "pending" }
//         const statusMap = {};
//         statusRes.data.forEach(({ rentId, status }) => {
//           statusMap[rentId] = status;
//         });

//         // Merge payuStatus into each offer
//         const enrichedOffers = fetchedOffers.map((offer) => ({
//           ...offer,
//           payuStatus: statusMap[offer.rentId] || "unpaid",
//         }));

//         // Optional: Sort by createdAt descending
//         enrichedOffers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//         setOffers(enrichedOffers);
//       } else {
//         // Optional: Handle no offers found
//         // setMessage({ text: "No offers found.", type: "warning" });
//       }
//     } catch (error) {
//       console.error("Failed to fetch offers or PayU status", error);
//       // setMessage({ text: "Failed to load data.", type: "error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchOffersAndStatuses();
// }, [phoneNumber]);


//   useEffect(() => {
//     setProperties((prev) => {
//         if (prev !== properties) return [...properties]; 
//         return prev; // No update if it's the same
//     });
// }, [properties]);

//   useEffect(() => {
//     setProperties((prev) => [...prev]); // This ensures React detects a change
//   }, [localProperties]);
     
//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => setMessage(""), 5000); // Auto-close after 3 seconds
//       return () => clearTimeout(timer); // Cleanup timer
//     }
//   }, [message]);



// const handleAcceptOffer = async (rentId, buyerPhoneNumber) => {
//   try {
//     let formattedPhoneNumber = buyerPhoneNumber.replace(/\D/g, "");
//     if (formattedPhoneNumber.startsWith("91") && formattedPhoneNumber.length === 12) {
//       formattedPhoneNumber = formattedPhoneNumber.slice(2);
//     }

//     const response = await axios.put(`${process.env.REACT_APP_API_URL}/accept-offer`, {
//       rentId,
//       buyerPhoneNumber: formattedPhoneNumber,
//     });

//     if (response.status === 200) {
//       // Show popup confirmation
//       Swal.fire({
//         title: "Offer Accepted!",
//         text: "The offer has been successfully accepted.",
//         icon: "success",
//         confirmButtonColor: "#2294B1",
//       });

//       // Update the state
//       setOffers((prevOffers) =>
//         prevOffers.map((property) =>
//           property.rentId === rentId ? { ...property, status: "accept" } : property
//         )
//       );

//       setProperties((prevProperties) =>
//         prevProperties.map((property) =>
//           property.rentId === rentId ? { ...property, status: "accept" } : property
//         )
//       );

//       // Fetch updated offers from backend
//       const updatedOffers = await axios.get(`${process.env.REACT_APP_API_URL}/offers/buyer/${phoneNumber}`);
//       setOffers(updatedOffers.data.offers);
//     }
//   } catch (error) {
//     Swal.fire({
//       title: "Error",
//       text: "There was an error accepting the offer.",
//       icon: "error",
//       confirmButtonColor: "#d33",
//     });
//   }
// };

// const handleRejectOffer = async (rentId, buyerPhoneNumber) => {
//   try {
//     let formattedPhoneNumber = buyerPhoneNumber.replace(/\D/g, "");
//     if (formattedPhoneNumber.startsWith("91") && formattedPhoneNumber.length === 12) {
//       formattedPhoneNumber = formattedPhoneNumber.slice(2);
//     }

//     const response = await axios.put(`${process.env.REACT_APP_API_URL}/reject-offer`, {
//       rentId,
//       buyerPhoneNumber: formattedPhoneNumber,
//     });

//     if (response.status === 200) {
//       // Show popup confirmation
//       Swal.fire({
//         title: "Offer Rejected!",
//         text: "The offer has been successfully rejected.",
//         icon: "info",
//         confirmButtonColor: "#2294B1",
//       });

//       // Update the state
//       setOffers((prevOffers) =>
//         prevOffers.map((property) =>
//           property.rentId === rentId ? { ...property, status: "reject" } : property
//         )
//       );

//       setProperties((prevProperties) =>
//         prevProperties.map((property) =>
//           property.rentId === rentId ? { ...property, status: "reject" } : property
//         )
//       );

//       // Fetch updated offers from backend
//       const updatedOffers = await axios.get(`${process.env.REACT_APP_API_URL}/offers/buyer/${phoneNumber}`);
//       setOffers(updatedOffers.data.offers);
//     }
//   } catch (error) {
//     Swal.fire({
//       title: "Error",
//       text: "There was an error rejecting the offer.",
//       icon: "error",
//       confirmButtonColor: "#d33",
//     });
//   }
// };

      
//   // Filter active and removed properties
//   const activeProperties = offers.filter((property) => property.status !== "delete");
//   const removedProperties = removedOffers;
//   const navigate = useNavigate();



//   return (
//     <div className="container d-flex align-items-center justify-content-center p-0">
//       <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', margin: 'auto', width: '100%' , fontFamily: 'Inter, sans-serif' }}>
//         {/* Buttons for filtering */}
//         <div className="d-flex align-items-center justify-content-start w-100" style={{background:"#EFEFEF" }}>
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
//     </button> <h3 className="m-0 ms-3" style={{fontSize:"20px"}}>OFFER FROM BUYERS </h3> </div>
//         <div className="row g-2 w-100">
//           <div className="col-6 p-0">
//             <button className="w-100" style={{ backgroundColor: '#4F4B7E', color: 'white' }} onClick={() => setActiveKey("All")}>
//               All Properties
//             </button>
//           </div>
//           <div className="col-6 p-0">
//             <button className="w-100" style={{ backgroundColor: activeKey === "Removed" ? "#FF4D00" : "#FFFFFF", 
//     color: activeKey === "Removed" ? "#FFFFFF" : "grey" }} onClick={() => setActiveKey("Removed")}>
//               Removed Properties
//             </button>
//           </div>

//           {/* Message Alert */}
//      <div>
//            {message && <p style={{ color: message.type === "success" ? "green" : "red" }}>{message.text}</p>}
//            <Modal show={showPopup} onHide={() => setShowPopup(false)}>
//              <Modal.Body>
//                <p>{popupMessage}</p>
//                <Button style={{ background:  "#4F4B7E", width: "80px", fontSize: "13px", border:"none" }} onClick={popupAction}
//                   onMouseOver={(e) => {
//                     e.target.style.background = "#FF6700"; // Brighter neon on hover
//                     e.target.style.fontWeight = 600; // Brighter neon on hover
//                     e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
//                   }}
//                   onMouseOut={(e) => {
//                     e.target.style.background = "#FF4500"; // Original orange
//                     e.target.style.fontWeight = 400; // Brighter neon on hover
          
//                   }}>Yes</Button>
//                <Button className="ms-3" style={{ background:  "#FF0000", width: "80px", fontSize: "13px" , border:"none"}} onClick={() => setShowPopup(false)}
//                   onMouseOver={(e) => {
//                     e.target.style.background = "#029bb3"; // Brighter neon on hover
//                     e.target.style.fontWeight = 600; // Brighter neon on hover
//                     e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
          
//                   }}
//                   onMouseOut={(e) => {
//                     e.target.style.background = "#4F4B7E"; // Original orange
//                     e.target.style.fontWeight = 400; // Brighter neon on hover
          
//                   }}>No</Button>
//              </Modal.Body>
//            </Modal>
//          </div>

//           {/* Property List */}
//           <div className="col-12">
//             <div className="w-100 d-flex align-items-center justify-content-center" style={{ maxWidth: '500px' }}>
//               {loading ? (
//       <div className="text-center my-4 "
//       style={{
//         position: 'fixed',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',

//       }}>
//         <span className="spinner-border text-primary" role="status" />
//         <p className="mt-2">Loading properties...</p>
//       </div>              ) : activeKey === "All" ? (
//                 <PropertyList properties={activeProperties} onRemove={handleRemoveProperty}  onAccept={handleAcceptOffer} 
//                    onReject={handleRejectOffer}  />
//               ) : (
//                 <PropertyList properties={removedProperties} onUndo={handleUndoRemove} />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const PropertyList = ({ properties, onRemove, onUndo, onAccept, onReject }) => {

//   // const [payuStatuses, setPayuStatuses] = useState([]);

// //   // Helper: check if PPC ID is paid
// // const isPaidrentId = (rentId) => {
// //   const entry = payuStatuses.find((item) => item.rentId === parseInt(rentId));
// //   return entry?.status === "paid";
// // };


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
//       {properties.map((property, index) => (
//         <div className="col-12 mb-1 p-0" key={property.rentId}>
//           <PropertyCard
//             property={property}
//             onRemove={onRemove}
//             onUndo={onUndo}
//             onAccept={onAccept}
//             onReject={onReject}

//           />
//         </div>
//       ))}
//     </div>
//   );
// };


// const PropertyCard = ({ property, onRemove, onUndo, onAccept, onReject }) => {
//   const [activeButton, setActiveButton] = useState(property.status || null);
//     const [showFullNumber, setShowFullNumber] = useState(false);

//       const [message, setMessage] = useState({ text: "", type: "" });
//       const navigate = useNavigate();

//     // 1. Create a handler function to log contact and initiate call
// const handleContactBuyer = async (buyerPhoneNumber, rentId) => {
//   try {
//     // Call the /contact API
//     await axios.post(`${process.env.REACT_APP_API_URL}/contact`, {
//       rentId: rentId,
//       phoneNumber: buyerPhoneNumber,
//     });  
    
//     setMessage({ text: "Contact logged successfully", type: "success" });

//     // Open dialer
//     window.location.href = `tel:${buyerPhoneNumber}`;
//   } catch (error) {
//     setMessage({ text: "Failed to log contact", type: "error" });
//   }
// };

// const formatIndianNumber = (x) => {
//   x = x.toString();
//   const lastThree = x.slice(-3);
//   const otherNumbers = x.slice(0, -3);
//   return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (otherNumbers ? "," : "") + lastThree;
// };

// const formatPrice = (price) => {
//   price = Number(price);
//   if (isNaN(price)) return 'N/A';

//   if (price >= 10000000) {
//     return (price / 10000000).toFixed(2) + ' Cr';
//   } else if (price >= 100000) {
//     return (price / 100000).toFixed(2) + ' Lakhs';
//   } else {
//     return formatIndianNumber(price);
//   }
// };

//  const handlePayNow = (rentId, property) => {
//     navigate("/add-plan", {
//       state: {
//         phoneNumber:  property.phoneNumber,
//         rentId: rentId,
//       },
//     });
//   };
  
//   return (

// <div
// // key={index}
// className="card p-2 w-100 w-md-50 w-lg-33"
// onClick={() => navigate(`/detail/${property.rentId}`)}

// style={{
//   border: "1px solid #ddd",
//   borderRadius: "10px",
//   overflow: "hidden",
//   marginBottom: "15px",
//   fontFamily: "Inter, sans-serif",
// }}
// >
// <div className="row d-flex align-items-center">
//   <div className="col-3 d-flex align-items-center justify-content-center mb-1">
//     <img
//       src={profil}
//       alt="Placeholder"
//       className="rounded-circle mt-2"
//       style={{ width: "80px", height: "80px", objectFit: "cover" }}
//     />

//   </div>
//   <div className='p-0' style={{background:"#707070", width:"2px", height:"80px"}}></div>
//   <div className="col-7 p-0 ms-4">
//     <div className='text-center rounded-1 w-100 mb-1' style={{border:"2px solid #4F4B7E", color:"#4F4B7E", fontSize:"13px"}}>INTERESTED BUYER</div>
//     <div className="d-flex">
//       <p className="mb-1" style={{ color: "#474747", fontWeight: "500",fontSize:"12px" }}>
//       PUC- {property.rentId}
//       </p>
//     </div>    

//     <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500",fontSize:"16px" }}>
//       {property.propertyType || "N/A"} |{property.city || "N/A"}
//     </h5>
 
//   </div>
// </div>

// <div className="p-1">
// <div className="d-flex align-items-center mb-2">
//   <div className="d-flex  flex-row align-items-start justify-content-between">

   
//   <div className="d-flex align-items-center ms-3">
//       <FaRupeeSign color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//       <div>
//         <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>
//         Your Price
//         </h6>
//         <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500"}}>
//     {property.price
//           ? formatPrice(property.price)
//           : 'N/A'}         </span>
//       </div>
//     </div>
//     <div className="d-flex align-items-center ms-3">
//       <FaRupeeSign color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//       <div>
//         <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>
//          Offered Price
//         </h6>
//         <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500"}}>
//         {property.offeredPrice.toLocaleString("en-IN")}     </span>  </div>
//     </div>
//     </div>
//               </div>
//   <div className="d-flex align-items-center mb-2">
//   <div className="d-flex  flex-row align-items-start justify-content-between ps-3">

   
//     <div className="d-flex align-items-center ">
//       <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//       <div>
//         <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>
//            Buyer Phone
//         </h6>
  

// <span className="card-text" style={{ fontWeight: "500" }}>
//   {property.payuStatus === "paid" ? (
//     <span
//       style={{ fontWeight: "500", color: "#1D1D1D", cursor: "pointer" }}
//       onClick={() => handleContactBuyer(property.buyerPhoneNumber, property.rentId)}
//     >
//       {property.buyerPhoneNumber}
//     </span>
//   ) : (
//     property.buyerPhoneNumber?.slice(0, 5) + "*****"
//   )}
// </span>

//       </div>
//     </div>
//     <div className="d-flex align-items-center ms-3">
//       <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//       <div>
//         <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>
//         Buyer Offered Date
//         </h6>
//         <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500"}}>
//         {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
//         </span>
//       </div>
//     </div>
//     </div>
//               </div>
//   {!showFullNumber && (
// <button className='w-100 m-0 p-1'
// onClick={(e) => {e.stopPropagation();
//   setShowFullNumber(true)}}
// style={{
//   background: "#4F4B7E", 
//   color: "white", 
//   border: "none", 
 
//   marginLeft: "10px", 
//   cursor: "pointer",
//   borderRadius: "5px"
// }}
// onMouseOver={(e) => {
//   e.target.style.background = "#029bb3"; // Brighter neon on hover
//   e.target.style.fontWeight = 600; // Brighter neon on hover
//   e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover

// }}
// onMouseOut={(e) => {
//   e.target.style.background = "#4F4B7E"; // Original orange
//   e.target.style.fontWeight = 400; // Brighter neon on hover

// }}>
// View
// </button>
// )}

 
// {/* 👇 Action buttons */}
// <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
//   {property.payuStatus === "paid" ? (
//     <>
//       <button
//         className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//         style={{ background: "#4F4B7E", fontSize: "13px" }}
//         onClick={(e) => {
//           e.stopPropagation();
//           handleContactBuyer(property.buyerPhoneNumber, property.rentId);
//         }}
//       >
//         Call
//       </button>

//       <button
//         className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//         style={{ background: "#4CAF50", fontSize: "11px" }}
//         onClick={(e) => {
//           e.stopPropagation();
//           onAccept(property.rentId, property.buyerPhoneNumber);
//         }}
//       >
//         Accept
//       </button>

//       <button
//         className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//         style={{ background: "#FF5733", fontSize: "11px" }}
//         onClick={(e) => {
//           e.stopPropagation();
//           onReject(property.rentId, property.buyerPhoneNumber);
//         }}
//       >
//         Reject
//       </button>

    

//       {onRemove && (
//             <button className="btn text-white px-3 py-1 flex-grow-1 mx-1" style={{ background:  "#FF0000", width: "80px", fontSize: "13px" }}
//             onClick={(e) => {e.stopPropagation();
//               onRemove(property.rentId, property.buyerPhoneNumber)}}
//             onMouseOver={(e) => {
//               e.target.style.background = "#FF6700"; // Brighter neon on hover
//               e.target.style.fontWeight = 600; // Brighter neon on hover
//               e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
//             }}
//             onMouseOut={(e) => {
//               e.target.style.background = "#FF4500"; // Original orange
//               e.target.style.fontWeight = 400; // Brighter neon on hover
    
//             }}>Remove</button>
//           )}
//           {onUndo && (
//             <button cclassName="btn text-white px-3 py-1 flex-grow-1 mx-1" style={{ background:  "green", width: "80px", fontSize: "13px" }}
//              onClick={(e) =>{e.stopPropagation(); onUndo(property.rentId, property.buyerPhoneNumber)}}
//              onMouseOver={(e) => {
//               e.target.style.background = "#32cd32"; // Brighter neon on hover
//               e.target.style.fontWeight = 600; // Brighter neon on hover
//               e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
//             }}
//             onMouseOut={(e) => {
//               e.target.style.background = "#39ff14"; // Original orange
//               e.target.style.fontWeight = 400; // Brighter neon on hover
    
//             }}>Undo</button>
//           )}
//     </>
//   ) : (
//     <>
    
// <button
//   className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//   style={{ background: "#FFB100", width: "80px", fontSize: "13px" }}
//   onClick={(e) => {
//     e.stopPropagation(); // ✅ prevent parent click
//     handlePayNow(property.rentId, property);
//   }}
// >
//   Pay Now
// </button>



//       {onRemove && (
//         <button
//           className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//           style={{ background: "#FF0000", fontSize: "13px" }}
//           onClick={(e) => {
//             e.stopPropagation();
//             onRemove(property.rentId, property.buyerPhoneNumber);
//           }}
//           onMouseOver={(e) => {
//             e.target.style.background = "#FF6700";
//             e.target.style.fontWeight = 600;
//           }}
//           onMouseOut={(e) => {
//             e.target.style.background = "#FF0000";
//             e.target.style.fontWeight = 400;
//           }}
//         >
//           Remove
//         </button>
//       )}
      
//     </>
//   )}
// </div>

//  {onUndo && (
//             <button cclassName="btn text-white px-3 py-1 flex-grow-1 mx-1" style={{ background:  "green", width: "80px", fontSize: "13px" }}
//              onClick={(e) =>{e.stopPropagation(); onUndo(property.rentId, property.buyerPhoneNumber)}}
//              onMouseOver={(e) => {
//               e.target.style.background = "#32cd32"; // Brighter neon on hover
//               e.target.style.fontWeight = 600; // Brighter neon on hover
//               e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
//             }}
//             onMouseOut={(e) => {
//               e.target.style.background = "#39ff14"; // Original orange
//               e.target.style.fontWeight = 400; // Brighter neon on hover
    
//             }}>Undo</button>
//           )}


// </div>
// </div>

//   );
// };

// export default App;


























import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {FaCamera, FaEye , FaRulerCombined, FaBed, FaUserAlt, FaCalendarAlt, FaRupeeSign, FaChevronLeft } from "react-icons/fa";
import { MdCall } from "react-icons/md";
import myImage from '../../Assets/Rectangle 766.png'; // Correct path
import myImage1 from '../../Assets/Rectangle 145.png'; // Correct path
import pic from '../../Assets/Default image_PP-01.png'; // Correct path
import profil from '../../Assets/xd_profile.png'
import { Button, Modal } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import NoData from "../../Assets/OOOPS-No-Data-Found.png";

const App = () => {
  const [offers, setOffers] = useState([]);
  const [removedOffers, setRemovedOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeKey, setActiveKey] = useState("All");
  const location = useLocation();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const [phoneNumber] = useState(storedPhoneNumber);
    const [showPopup, setShowPopup] = useState(false);
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

  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
          phoneNumber: phoneNumber,
          viewedFile: "Owner Offer",
          viewTime: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Error recording view:", err);
      }
    };
  
    if (phoneNumber) {
      recordDashboardView();
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    const storedOffers = JSON.parse(localStorage.getItem("offers")) || [];
    const storedRemovedOffers = JSON.parse(localStorage.getItem("removedOffers")) || [];

    setOffers(storedOffers);
    setRemovedOffers(storedRemovedOffers);
  }, []);

  useEffect(() => {
    localStorage.setItem("offers", JSON.stringify(offers));
    localStorage.setItem("removedOffers", JSON.stringify(removedOffers));
  }, [offers, removedOffers]);

//   useEffect(() => {
//     const fetchOffersAndStatuses = async () => {
//       if (!phoneNumber) return;
//       setLoading(true);

//       try {
//         const offerRes = await axios.get(`${process.env.REACT_APP_API_URL}/offers/buyer/${phoneNumber}`);
//         const statusRes = await axios.get(`${process.env.REACT_APP_API_URL}/payustatus-users`);

//         if (offerRes.status === 200 && statusRes.status === 200) {
//           const fetchedOffers = offerRes.data.offers || [];
//           const statusMap = {};
          
//           statusRes.data.forEach(({ rentId, status }) => {
//             statusMap[rentId] = status;
//           });

//           const enrichedOffers = fetchedOffers.map((offer) => ({
//             ...offer,
//             payuStatus: statusMap[offer.rentId] || "unpaid",
//           }));
          

//           // enrichedOffers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//           // ✅ Proper sort by updatedAt (fallback to createdAt)
// enrichedOffers.sort(
//   (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
// );

//           setOffers(enrichedOffers);
//         }
//       } catch (error) {
//         console.error("Failed to fetch offers or PayU status", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOffersAndStatuses();
//   }, [phoneNumber]);


useEffect(() => {
  const fetchOffersAndStatuses = async () => {
    if (!phoneNumber) return;
    setLoading(true);

    try {
      const offerRes = await axios.get(`${process.env.REACT_APP_API_URL}/offers/buyer/${phoneNumber}`);
      const statusRes = await axios.get(`${process.env.REACT_APP_API_URL}/payustatus-users`);

      if (offerRes.status === 200 && statusRes.status === 200) {
        const fetchedOffers = offerRes.data.offers || [];

        // 🔹 Build PayU status map
        const statusMap = {};
        statusRes.data.forEach(({ rentId, status }) => {
          statusMap[rentId] = status;
        });

        // 🔹 Enrich each offer with payuStatus and propertyMessage
        const enrichedOffers = await Promise.all(
          fetchedOffers.map(async (offer) => {
            let propertyMessage = null;
            try {
              const msgRes = await axios.get(
                `${process.env.REACT_APP_API_URL}/user/property-message/${offer.rentId}`
              );
              propertyMessage = msgRes.data?.data?.message || null;
            } catch {
              propertyMessage = null;
            }

            return {
              ...offer,
              payuStatus: statusMap[offer.rentId] || "unpaid",
              propertyMessage,
            };
          })
        );

        // 🔹 Sort enriched offers by updatedAt or createdAt
        enrichedOffers.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt) -
            new Date(a.updatedAt || a.createdAt)
        );

        setOffers(enrichedOffers);
      }
    } catch (error) {
      console.error("Failed to fetch offers or PayU status", error);
      // Optional: setMessage({ text: "Failed to load offers", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  fetchOffersAndStatuses();
}, [phoneNumber]);


 const handleRemoveProperty = async (rentId, buyerPhoneNumber) => {
    confirmAction("Are you sure you want to remove this offer?", async () => {
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/offers/delete/${rentId}/${buyerPhoneNumber}`);

        const propertyToRemove = offers.find(p => p.rentId === rentId && p.buyerPhoneNumber === buyerPhoneNumber);

        if (propertyToRemove) {
          setRemovedOffers(prev => [...prev, propertyToRemove]);
          setOffers(prev => prev.filter(p => !(p.rentId === rentId && p.buyerPhoneNumber === buyerPhoneNumber)));
          setMessage({ text: "Offer removed successfully", type: "success" });
        }
      } catch (error) {
        setMessage({ text: "Error removing offer", type: "danger" });
      }
      setShowPopup(false);
    });
  };

  const handleUndoRemove = async (rentId, buyerPhoneNumber) => {
    confirmAction("Do you want to restore this offer?", async () => {
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/offers/undo/${rentId}/${buyerPhoneNumber}`);

        const propertyToUndo = removedOffers.find(p => p.rentId === rentId && p.buyerPhoneNumber === buyerPhoneNumber);

        if (propertyToUndo) {
          setOffers(prev => [...prev, propertyToUndo]);
          setRemovedOffers(prev => prev.filter(p => !(p.rentId === rentId && p.buyerPhoneNumber === buyerPhoneNumber)));
          setMessage({ text: "Offer restored successfully", type: "success" });
        }
      } catch (error) {
        setMessage({ text: "Error restoring offer", type: "danger" });
      }
      setShowPopup(false);
    });
  };

  const handleAcceptOffer = async (rentId, buyerPhoneNumber) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/accept-offer`, {
        rentId,
        buyerPhoneNumber,
      });

      if (response.status === 200) {
        Swal.fire("Offer Accepted!", "The offer has been successfully accepted.", "success");
        setOffers(prev => prev.map(p =>
          p.rentId === rentId && p.buyerPhoneNumber === buyerPhoneNumber
            ? { ...p, status: "accept" }
            : p
        ));
      }
    } catch (error) {
      Swal.fire("Error", "There was an error accepting the offer.", "error");
    }
  };

  const handleRejectOffer = async (rentId, buyerPhoneNumber) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/reject-offer`, {
        rentId,
        buyerPhoneNumber,
      });

      if (response.status === 200) {
        Swal.fire("Offer Rejected!", "The offer has been successfully rejected.", "info");
        setOffers(prev => prev.map(p =>
          p.rentId === rentId && p.buyerPhoneNumber === buyerPhoneNumber
            ? { ...p, status: "reject" }
            : p
        ));
      }
    } catch (error) {
      Swal.fire("Error", "There was an error rejecting the offer.", "error");
    }
  };

  const activeProperties = offers.filter(p => p.status !== "delete");
  const removedProperties = removedOffers;
  const navigate = useNavigate();

  return (
    <div className="container d-flex align-items-center justify-content-center p-0">
      <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', margin: 'auto', width: '100%' , fontFamily: 'Inter, sans-serif' }}>
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
          <h3 className="m-0" style={{fontSize:"18px"}}>OFFER FROM TENANT</h3> 
        </div>
        
        <div className="row g-2 w-100">
          <div className="col-6 p-0">
            <button 
              className="w-100 p-2 border-0" 
              style={{ 
                backgroundColor: activeKey === "All" ? "#4F4B7E" : "#FFFFFF", 
                color: activeKey === "All" ? "#FFFFFF" : "#000000"
              }} 
              onClick={() => setActiveKey("All")}
            >
              All Properties
            </button>
          </div>
          <div className="col-6 p-0">
            <button 
              className="w-100 p-2 border-0" 
              style={{ 
                backgroundColor: activeKey === "Removed" ? "#FF4D00" : "#FFFFFF", 
                color: activeKey === "Removed" ? "#FFFFFF" : "#000000"
              }} 
              onClick={() => setActiveKey("Removed")}
            >
              Removed Properties
            </button>
          </div>

          <div>
            {message.text && (
              <div className={`alert alert-${message.type === "success" ? "success" : "danger"}`}>
                {message.text}
              </div>
            )}
            <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
              <Modal.Body className="text-center">
                <p className="mb-4">{popupMessage}</p>
                <div className="d-flex justify-content-center">
                  <Button 
                    variant="primary" 
                    className="me-2"
                    style={{ 
                      backgroundColor: '#4F4B7E', 
                      border: 'none',
                      minWidth: '80px'
                    }}
                    onClick={popupAction}
                  >
                    Yes
                  </Button>
                  <Button 
                    variant="secondary"
                    style={{ 
                      backgroundColor: '#6c757d', 
                      border: 'none',
                      minWidth: '80px'
                    }}
                    onClick={() => setShowPopup(false)}
                  >
                    No
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
          </div>

          <div className="col-12">
            <div className="w-100 d-flex align-items-center justify-content-center" style={{ maxWidth: '500px' }}>
              {loading ? (
                <div className="text-center my-4" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="mt-2">Loading properties...</p>
                </div>
              ) : activeKey === "All" ? (
                <PropertyList 
                  properties={activeProperties} 
                  onRemove={handleRemoveProperty}  
                  onAccept={handleAcceptOffer} 
                  onReject={handleRejectOffer} 
                  isRemovedTab={false}
                />
              ) : (
                <PropertyList 
                  properties={removedProperties} 
                  onUndo={handleUndoRemove} 
                  isRemovedTab={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertyList = ({ properties, onRemove, onUndo, onAccept, onReject, isRemovedTab }) => {
  const navigate = useNavigate();

  return properties.length === 0 ? (
    <div className="text-center my-4" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <img src={NoData} alt="No data" width={100} />
      <p className="mt-2">No properties found.</p>
    </div>
  ) : (
    <div className="row m-0 w-100">
      {properties.map((property) => (
        <div className="col-12 mb-3 p-0" key={`${property.rentId}-${property.buyerPhoneNumber}`}               onClick={() => navigate(`/detail/${property.rentId}`)}
>
          <PropertyCard
            property={property}
            onRemove={onRemove}
            onUndo={onUndo}
            onAccept={onAccept}
            onReject={onReject}
            isRemovedTab={isRemovedTab}
          />
        </div>
      ))}
    </div>
  );
};



const PropertyCard = ({ property, onRemove, onUndo, onAccept, onReject, isRemovedTab }) => {
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();
 const location = useLocation();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const [phoneNumber] = useState(storedPhoneNumber);
  // const handleContactBuyer = async (buyerPhoneNumber, rentId) => {
  //   try {
  //     await axios.post(`${process.env.REACT_APP_API_URL}/contact-rent`, {
  //       rentId,
  //       phoneNumber: buyerPhoneNumber,
  //     });
  //     setMessage({ text: "Contact logged successfully", type: "success" });
  //     window.location.href = `tel:${buyerPhoneNumber}`;
  //   } catch (error) {
  //     setMessage({ text: "Failed to log contact", type: "error" });
  //   }
  // };

   const handleContactBuyer = async (ppcId, buyerPhoneNumber) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/contact-send-property`, {
        ppcId,
        userPhone: buyerPhoneNumber,
        postedUserPhone: phoneNumber,
      });

      if (response.data.success) {
        setMessage({ text: "Contact saved successfully", type: "success" });
        window.location.href = `tel:${buyerPhoneNumber}`;
      } else {
        setMessage({ text: response.data.message || "Contact failed", type: "error" });
      }
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || "An error occurred", 
        type: "error" 
      });
    }
  };
 
  const formatPrice = (originalPrice) => {
    if (!originalPrice) return 'N/A';
    originalPrice = Number(originalPrice);

    if (originalPrice >= 10000000) {
      return (originalPrice / 10000000).toFixed(2) + ' Cr';
    } else if (originalPrice >= 100000) {
      return (originalPrice / 100000).toFixed(2) + ' Lakhs';
    } else {
      return originalPrice.toLocaleString('en-IN');
    }
  };

  const handlePayNow = (rentId) => {
    navigate("/pricing-plans", {
      state: {
        phoneNumber: property.phoneNumber,
        rentId: rentId,
      },
    });
  };

  return (
    <div className="card p-3 w-100" style={{ borderRadius: "15px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
      {message.text && (
        <div className={`alert alert-${message.type === "success" ? "success" : "danger"} py-1 mb-2`}>
          {message.text}
        </div>
      )}

      <div className="row d-flex align-items-center mb-3">
        <div className="col-3 d-flex justify-content-center">
          <img
            src={profil}
            alt="Profile"
            className="rounded-circle"
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
          />
        </div>
        <div className="col-1 d-flex justify-content-center">
          <div style={{ background: "#707070", width: "2px", height: "80px" }}></div>
        </div>
        <div className="col-8">
          <div className='text-center rounded-1 w-100 mb-2 py-1' style={{ border: "2px solid #4F4B7E", color: "#4F4B7E", fontSize: "13px" }}>
            INTERESTED TENANT
          </div>
          <div className="d-flex">
            <p className="mb-1 me-3" style={{ color: "#474747", fontWeight: "500", fontSize: "12px" }}>
             RENT ID- {property.rentId}
            </p>

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
          </div>
          <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "16px" }}>
            {property.propertyType || "N/A"} | {property.city || "N/A"}
          </h5>
           <p className="mb-1 text-primary" style={{ fontWeight: "500", fontSize: "15px" }}>
             {property.status}
            </p>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-6 d-flex align-items-center">
          <FaRupeeSign color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
          <div>
            <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Your Price</h6>
            <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
              {formatPrice(property.originalPrice)}
            </span>
          </div>
        </div>
        <div className="col-6 d-flex align-items-center">
          <FaRupeeSign color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
          <div>
            <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Offered Price</h6>
            <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
              {property.offeredPrice?.toLocaleString("en-IN") || "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-6 d-flex align-items-center">
          <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
          <div>
            <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Tenant Phone</h6>
            <span className="card-text" style={{ fontWeight: "500" }}>
              {property.payuStatus === "paid" ? (
                <span
                  style={{ color: "#1D1D1D", cursor: "pointer" }}
                  onClick={() => handleContactBuyer(property.buyerPhoneNumber, property.rentId)}
                >
                  {property.buyerPhoneNumber}
                </span>
              ) : (
                property.buyerPhoneNumber?.slice(0, 5) + "*****"
              )}
            </span>
          </div>
        </div>
        <div className="col-6 d-flex align-items-center">
          <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
          <div>
            <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Offered Date</h6>
            {/* <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
              {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
            </span> */}

            <span className="card-text" style={{ color: "#1D1D1D", fontWeight: "500" }}>
  {(property.updatedAt || property.offerDate)
    ? new Date(property.updatedAt || property.offerDate).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'N/A'}
</span>

          </div>
        </div>
      </div>

      {!isRemovedTab && !showFullNumber && (
        <button 
          className='w-100 mb-3 py-2'
          // onClick={() => setShowFullNumber(true)}
           onClick={(e) => {
                e.stopPropagation();
setShowFullNumber(true)}}
          style={{
            background: "#4F4B7E", 
            color: "white", 
            border: "none", 
            borderRadius: "8px",
            fontWeight: "500"
          }}
        >
          View Details
        </button>
      )}

      {(showFullNumber || isRemovedTab) && (
        <div className="d-flex justify-content-between">
          {isRemovedTab ? (
            <button 
              className="btn text-white px-3 py-2 flex-grow-1 me-2"
              style={{ background: "#4CAF50", borderRadius: "8px", fontWeight: "500" }}
              onClick={(e) => {
                e.stopPropagation();
                onUndo(property.rentId, property.buyerPhoneNumber);
              }}
            >
              Undo
            </button>
          ) : (
            <>
              {property.payuStatus === "paid" ? (
                <>
                  <button
                    className="btn text-white px-3 py-2 flex-grow-1 me-2"
                    style={{ background: "#4F4B7E", borderRadius: "8px", fontWeight: "500" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContactBuyer(property.buyerPhoneNumber, property.rentId);
                    }}
                  >
                    Call
                  </button>
                  <button
                    className="btn text-white px-3 py-2 flex-grow-1 me-2"
                    style={{ background: "#4CAF50", borderRadius: "8px", fontWeight: "500" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAccept(property.rentId, property.buyerPhoneNumber);
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="btn text-white px-3 py-2 flex-grow-1 me-2"
                    style={{ background: "#FF5733", borderRadius: "8px", fontWeight: "500" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReject(property.rentId, property.buyerPhoneNumber);
                    }}
                  >
                    Reject
                  </button>
                  <button
                    className="btn text-white px-3 py-2 flex-grow-1"
                    style={{ background: "#FF0000", borderRadius: "8px", fontWeight: "500" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(property.rentId, property.buyerPhoneNumber);
                    }}
                  >
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn text-white px-3 py-2 flex-grow-1 me-2"
                    style={{ background: "#FFB100", borderRadius: "8px", fontWeight: "500" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePayNow(property.rentId);
                    }}
                  >
                    Pay Now
                  </button>
                  <button
                    className="btn text-white px-3 py-2 flex-grow-1"
                    style={{ background: "#FF0000", borderRadius: "8px", fontWeight: "500" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(property.rentId, property.buyerPhoneNumber);
                    }}
                  >
                    Remove
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};


export default App;







