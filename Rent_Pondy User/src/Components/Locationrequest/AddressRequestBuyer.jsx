







// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';
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
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupAction, setPopupAction] = useState(null);
//   const [popupMessage, setPopupMessage] = useState("");
//   const navigate = useNavigate();
//   const { phoneNumber } = useParams();

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
//     const recordDashboardView = async () => {
//       try {
//         await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
//           phoneNumber: phoneNumber,
//           viewedFile: "Address request Buyer",
//           viewTime: new Date().toISOString(),
//         });
//       } catch (err) {
//       }
//     };
  
//     if (phoneNumber) {
//       recordDashboardView();
//     }
//   }, [phoneNumber]);

//   const confirmAction = (message, action) => {
//     setPopupMessage(message);
//     setPopupAction(() => action);
//     setShowPopup(true);
//   };

//   const handleRemoveProperty = async (rentId) => {
//     confirmAction("Are you sure you want to remove this Address request?", async () => {
//       try {
//         const response = await axios.put(
//           `${process.env.REACT_APP_API_URL}/address-requests/delete/${rentId}`
//         );

//         if (response.status === 200) {
//           setMessage("Address request marked as deleted.");

//           const deletedRequest = response.data.request;

//           // Remove it from main list
//           setProperties((prev) =>
//             prev.filter((prop) => prop.rentId !== rentId)
//           );

//           // Add to removed list & persist in localStorage
//           setRemovedProperties((prev) => {
//             const updated = [...prev, deletedRequest];
//             localStorage.setItem("removedProperties", JSON.stringify(updated));
//             return updated;
//           });
//         }
//       } catch (error) {
//         setMessage(error.response?.data?.message || "Error deleting address request.");
//       }
//       setShowPopup(false);
//     });
//   };

//   const handleUndoRemove = async (rentId) => {
//     confirmAction("Do you want to restore this Address request buyer?", async () => {
//       try {
//         const response = await axios.put(
//           `${process.env.REACT_APP_API_URL}/address-requests/undo/${rentId}`
//         );

//         if (response.status === 200) {
//           setMessage("Address request restored.");

//           const restoredProperty = response.data.request;

//           // Remove from removed list
//           setRemovedProperties((prev) => {
//             const updated = prev.filter((prop) => prop.rentId !== rentId);
//             localStorage.setItem("removedProperties", JSON.stringify(updated));
//             return updated;
//           });

//           // Add back to properties list
//           setProperties((prev) => [...prev, restoredProperty]);
//         }
//       } catch (error) {
//         setMessage(error.response?.data?.message || "Error restoring address request.");
//       }
//       setShowPopup(false);
//     });
//   };

//   useEffect(() => {
//     if (!phoneNumber) {
//       setMessage("Phone number is missing.");
//       setLoading(false);
//       return;
//     }

//     const fetchAddressRequests = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/address-requests/buyer/${phoneNumber}`
//         );

//         if (response.status === 200) {
//           const rawData = Array.isArray(response.data) ? response.data : [];
          
//           // Map the response to match the expected property structure
//           const enriched = rawData.map(item => ({
//             ...item.property,
//             rentId: item.property?.rentId,
//             status: item.status,
//             requesterPhoneNumber: item.requesterPhoneNumber,
//             createdAt: item.createdAt,
//             updatedAt: item.updatedAt
//           }));

//           // Sort by updatedAt or createdAt (desc)
//           const sorted = enriched.sort(
//             (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
//           );

//           setProperties(sorted);
//           localStorage.setItem("addressRequests", JSON.stringify(sorted));
//         } else {
//           setMessage("No address requests found.");
//         }
//       } catch (error) {
//         console.error("Error loading address requests:", error);
//         setMessage("Error fetching address requests.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAddressRequests();
//   }, [phoneNumber]);

//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => setMessage(""), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   // Save removed properties to localStorage whenever removedProperties changes
//   useEffect(() => {
//     localStorage.setItem("removedProperties", JSON.stringify(removedProperties));
//   }, [removedProperties]);

//   // Filter out removed properties from the properties list
//   const availableProperties = properties.filter(
//     (property) => !removedProperties.some((removed) => removed.rentId === property.rentId)
//   );

//   if (loading) return <p>Loading properties...</p>;

//   const activeProperties = properties.filter(
//     (property) => !removedProperties.some((removed) => removed.rentId === property.rentId)
//   );

//   return (
//     <div className="container d-flex align-items-center justify-content-center p-0">
//       <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', margin: 'auto', width: '100%' , fontFamily: 'Inter, sans-serif'}}>
//         {/* Buttons for filtering */}
//         <div className="d-flex align-items-center justify-content-start w-100" style={{
//           background: "#EFEFEF",
//           position: "sticky",
//           top: 0,
//           zIndex: 1000,
//           opacity: isScrolling ? 0 : 1,
//           pointerEvents: isScrolling ? "none" : "auto",
//           transition: "opacity 0.3s ease-in-out",
//         }}>
//           <button
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
//               e.currentTarget.style.backgroundColor = '#f0f4f5';
//               e.currentTarget.querySelector('svg').style.color = '#00B987';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor = '#f0f0f0';
//               e.currentTarget.querySelector('svg').style.color = '#4F4B7E';
//             }}
//           >
//             <FaArrowLeft style={{ color: '#4F4B7E', transition: 'color 0.3s ease-in-out' , background:"transparent"}} />
//           </button> 
//           <h3 className="m-0" style={{fontSize:"20px"}}>ADDRESS REQUESTED BUYERS</h3> 
//         </div>
//         <div className="row g-2 w-100">
//           <div className="col-6 p-0">
//             <button className="w-100" style={{ backgroundColor: '#4F4B7E', color: 'white' }} onClick={() => setActiveKey("All")}>
//               ALL BUYER
//             </button>
//           </div>
//           <div className="col-6 p-0">
//             <button className="w-100" style={{ backgroundColor: '#FFFFFF', color: 'grey' }} onClick={() => setActiveKey("Removed")}>
//               REMOVED BUYER
//             </button>
//           </div>

//           {/* Message Alert */}
//           <div>
//             {message && <p style={{ color: message.type === "success" ? "green" : "red" }}>{message.text}</p>}
//             <Modal show={showPopup} onHide={() => setShowPopup(false)}>
//               <Modal.Body>
//                 <p>{popupMessage}</p>
//                 <Button 
//                   style={{ background: "#4F4B7E", width: "80px", fontSize: "13px", border:"none" }} 
//                   onClick={popupAction}
//                   onMouseOver={(e) => {
//                     e.target.style.background = "#FF6700";
//                     e.target.style.fontWeight = 600;
//                     e.target.style.transition = "background 0.3s ease";
//                   }}
//                   onMouseOut={(e) => {
//                     e.target.style.background = "#FF4500";
//                     e.target.style.fontWeight = 400;
//                   }}
//                 >
//                   Yes
//                 </Button>
//                 <Button 
//                   className="ms-3" 
//                   style={{ background: "#FF0000", width: "80px", fontSize: "13px", border:"none"}} 
//                   onClick={() => setShowPopup(false)}
//                   onMouseOver={(e) => {
//                     e.target.style.background = "#029bb3";
//                     e.target.style.fontWeight = 600;
//                     e.target.style.transition = "background 0.3s ease";
//                   }}
//                   onMouseOut={(e) => {
//                     e.target.style.background = "#4F4B7E";
//                     e.target.style.fontWeight = 400;
//                   }}
//                 >
//                   No
//                 </Button>
//               </Modal.Body>
//             </Modal>
//           </div>

//           {/* Property List */}
//           <div className="col-12">
//             <div className="w-100 d-flex align-items-center justify-content-center" style={{ maxWidth: '500px' }}>
//               {loading ? (
//                 <div className="text-center my-4" style={{
//                   position: 'fixed',
//                   top: '50%',
//                   left: '50%',
//                   transform: 'translate(-50%, -50%)',
//                 }}>
//                   <span className="spinner-border text-primary" role="status" />
//                   <p className="mt-2">Loading properties...</p>
//                 </div>
//               ) : activeKey === "All" ? (
//                 <PropertyList
//                   properties={activeProperties}
//                   onRemove={handleRemoveProperty}
//                   setProperties={setProperties}
//                   setRemovedProperties={setRemovedProperties}
//                 />
//               ) : (
//                 <PropertyList
//                   properties={removedProperties.filter(property => property.status === "deleted")}
//                   onUndo={handleUndoRemove}
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const PropertyList = ({ properties, onRemove, onUndo, setProperties, setRemovedProperties, removedProperties }) => {
//   const navigate = useNavigate();

//   return properties.length === 0 ? (
//     <div className="text-center my-4" style={{
//       position: 'fixed',
//       top: '50%',
//       left: '50%',
//       transform: 'translate(-50%, -50%)',
//     }}>
//       <img src={NoData} alt="" width={100}/>      
//       <p>No properties found.</p>
//     </div>
//   ) : (
//     <div className="row mt-4 w-100">
//       {properties.map((property) => (
//         <div className="col-12 mb-1 p-0" key={property.rentId} onClick={() => navigate(`/detail/${property.rentId}`)}>
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
//   const navigate = useNavigate();

//   const handleSendAddress = async (rentId) => {
//     try {
//       const response = await axios.put(
//         `${process.env.REACT_APP_API_URL}/address-requests/send/${rentId}`
//       );

//       if (response.status === 200) {
//         setMessage("Address sent successfully.");
//         setProperties((prevProperties) =>
//           prevProperties.map((prop) =>
//             prop.rentId === rentId
//               ? { ...prop, status: "address sent" }
//               : prop
//           )
//         );
//       }
//     } catch (error) {
//       setMessage("Error sending address.");
//     }
//   };

//   const handleAddAddress = (rentId) => {
//     navigate(`/edit-prop`, { state: { rentId } });
//   };

//   return (
//     <div
//       key={property.rentId}
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
//             ADDRESS REQUEST
//           </div>
//           <p className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "12px" }}>PUC- {property.rentId}</p>
//           <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "16px" }}>
//             {property.propertyType || "N/A"} | {property.city || "N/A"}
//           </h5>
//         </div>
//       </div>

//       <div className="p-1">
//         <div className="d-flex align-items-center mb-2">
//           <div
//             onClick={(e) => {
//               e.stopPropagation();
//               if (property.address) {
//                 handleSendAddress(property.rentId);
//               } else {
//                 handleAddAddress(property.rentId);
//               }
//             }}
//             className="d-flex col-4 flex-column justify-content-between align-items-center p-3 rounded-3"
//             style={{ border: "2px solid #4F4B7E", color: "#4F4B7E", cursor: "pointer" }}
//           >
//             <span className="rounded-circle p-1 d-flex justify-content-center align-items-center" style={{ background: "#4F4B7E", height: '30px', width: "30px" }}>
//               <TbCameraPlus color="white" />
//             </span>
//             <p className="m-0" style={{ fontSize: "14px" }}>
//               {property.address ? "Send Address" : "Add Address"}
//             </p>
//           </div>

//           <div className="d-flex flex-column align-items-start justify-content-between ps-3">
//             <div className="d-flex align-items-center mb-4">
//               <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
//               <div>
//                 <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Address Requested Date</h6>
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
//                 <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Buyer Phone</h6>
//                 <span className="card-text" style={{ fontWeight: "500" }}>
//                   <a
//                     href={`tel:${property.requesterPhoneNumber}`}
//                     style={{ textDecoration: "none", color: "#1D1D1D" }}
//                     onClick={async (e) => {
//                       e.preventDefault();
//                       try {
//                         await axios.post(`${process.env.REACT_APP_API_URL}/contact`, {
//                           rentId: property.rentId,
//                           phoneNumber: property.requesterPhoneNumber,
//                         });
//                         setMessage({ text: "Contact saved successfully", type: "success" });
//                       } catch {
//                         setMessage({ text: "Something went wrong", type: "error" });
//                       } finally {
//                         window.location.href = `tel:${property.requesterPhoneNumber}`;
//                       }
//                     }}
//                   >
//                     {showFullNumber
//                       ? property.requesterPhoneNumber
//                       : property.requesterPhoneNumber?.slice(0, 5) + "*****"}
//                   </a>
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {!showFullNumber ? (
//           <button
//             className="w-100 m-0 p-1"
//             onClick={(e) => {
//               e.stopPropagation();
//               setShowFullNumber(true);
//             }}
//             style={{
//               background: "#4F4B7E",
//               color: "white",
//               border: "none",
//               cursor: "pointer",
//               borderRadius: "5px"
//             }}
//           >
//             View
//           </button>
//         ) : (
//           <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
//             <button
//               className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//               style={{ background: "#4F4B7E", fontSize: "13px" }}
//               onClick={async (e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 try {
//                   await axios.post(`${process.env.REACT_APP_API_URL}/contact`, {
//                     rentId: property.rentId,
//                     phoneNumber: property.requesterPhoneNumber,
//                   });
//                   setMessage({ text: "Contact saved successfully", type: "success" });
//                 } catch {
//                   setMessage({ text: "Something went wrong", type: "error" });
//                 } finally {
//                   window.location.href = `tel:${property.requesterPhoneNumber}`;
//                 }
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.background = "#029bb3";
//                 e.target.style.fontWeight = 600;
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.background = "#4F4B7E";
//                 e.target.style.fontWeight = 400;
//               }}
//             >
//               Call
//             </button>

//             {onRemove && (
//               <button
//                 className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//                 style={{ background: "#FF4500", fontSize: "13px" }}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onRemove(property.rentId);
//                 }}
//               >
//                 Remove
//               </button>
//             )}

//             {onUndo && (
//               <button
//                 className="btn text-white px-3 py-1 flex-grow-1 mx-1"
//                 style={{ background: "green", fontSize: "13px" }}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onUndo(property.rentId);
//                 }}
//               >
//                 Undo
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default App;



















import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaCalendarAlt, FaChevronLeft } from "react-icons/fa";
import { MdCall } from 'react-icons/md';
import profil from '../../Assets/xd_profile.png'
import { TbCameraPlus } from "react-icons/tb";
import { Button, Modal } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import NoData from "../../Assets/OOOPS-No-Data-Found.png";
import { FaLocationDot } from 'react-icons/fa6';

const App = () => {
  const [activeKey, setActiveKey] = useState("All");
  const [removedProperties, setRemovedProperties] = useState(() => {
    const storedRemovedProperties = localStorage.getItem("removedProperties");
    return storedRemovedProperties ? JSON.parse(storedRemovedProperties) : [];
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPopup, setShowPopup] = useState(false);
  const [popupAction, setPopupAction] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const [phoneNumber] = useState(storedPhoneNumber);  const [isScrolling, setIsScrolling] = useState(false);
  const [showFullNumber, setShowFullNumber] = useState({});

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
          viewedFile: "Address request Buyer",
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

  const confirmAction = (message, action) => {
    setPopupMessage(message);
    setPopupAction(() => action);
    setShowPopup(true);
  };

  const handleRemoveProperty = async (rentId) => {
    confirmAction("Are you sure you want to remove this Address request?", async () => {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/address-requests-rent/delete/${rentId}`
        );

        if (response.status === 200) {
          setMessage({ text: "Address request marked as deleted.", type: "success" });

          const deletedRequest = response.data.request;
          setProperties((prev) => prev.filter((prop) => prop.rentId !== rentId));
          setRemovedProperties((prev) => {
            const updated = [...prev, deletedRequest];
            localStorage.setItem("removedProperties", JSON.stringify(updated));
            return updated;
          });
        }
      } catch (error) {
        setMessage({ text: error.response?.data?.message || "Error deleting address request.", type: "error" });
      }
      setShowPopup(false);
    });
  };

  const handleUndoRemove = async (rentId) => {
    confirmAction("Do you want to restore this Address request buyer?", async () => {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/address-requests-rent/undo/${rentId}`
        );

        if (response.status === 200) {
          setMessage({ text: "Address request restored.", type: "success" });
          const restoredProperty = response.data.request;
          setRemovedProperties((prev) => {
            const updated = prev.filter((prop) => prop.rentId !== rentId);
            localStorage.setItem("removedProperties", JSON.stringify(updated));
            return updated;
          });
          setProperties((prev) => [...prev, restoredProperty]);
        }
      } catch (error) {
        setMessage({ text: error.response?.data?.message || "Error restoring address request.", type: "error" });
      }
      setShowPopup(false);
    });
  };

  const handlePayNow = (rentId, phoneNumber) => {
    navigate("/pricing-plans", {
      state: {
        phoneNumber,
        rentId,
      },
    });
  };




  useEffect(() => {
  if (!phoneNumber) {
    setMessage({ text: "Phone number is missing.", type: "error" });
    setLoading(false);
    return;
  }

  const fetchAddressRequestsWithPayuStatus = async () => {
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      // Step 1: Fetch PayU Status
      const statusRes = await axios.get(`${process.env.REACT_APP_API_URL}/payustatus-users`);

      // Step 2: Fetch Address Requests
      const addressRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/address-requests-rent/buyer/${phoneNumber}`
      );

      if (statusRes.status === 200 && addressRes.status === 200) {
        // Step 3: Create PayU Status Map
        const statusMap = {};
        statusRes.data.forEach(({ rentId, status }) => {
          if (rentId) statusMap[rentId] = status;
        });

        const rawData = Array.isArray(addressRes.data) ? addressRes.data : [];

        // Step 4: Enrich with PayU + property message
        const enriched = await Promise.all(
          rawData.map(async (item) => {
            const property = item.property || {};
            const rentId = property.rentId;

            // Fetch property message
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
              ...property,
              rentId,
              status: item.status,
              requesterPhoneNumber: item.requesterPhoneNumber,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
              payuStatus: statusMap[rentId] || "unpaid",
              propertyMessage,
            };
          })
        );

        // Step 5: Sort by latest date
        const sorted = enriched.sort(
          (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        );

        setProperties(sorted);
        localStorage.setItem("addressRequests", JSON.stringify(sorted));
      }
    } catch (error) {
      console.error("Error loading address requests:", error);
      setMessage({ text: "Failed to fetch address requests.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  fetchAddressRequestsWithPayuStatus();
}, [phoneNumber]);


  // useEffect(() => {
  //   if (!phoneNumber) {
  //     setMessage({ text: "Phone number is missing.", type: "error" });
  //     setLoading(false);
  //     return;
  //   }

  //   const fetchAddressRequestsWithPayuStatus = async () => {
  //     try {
  //       setLoading(true);
  //       setMessage({ text: "", type: "" });

  //       // Step 1: Fetch PayU Status
  //       const statusRes = await axios.get(`${process.env.REACT_APP_API_URL}/payustatus-users`);
        
  //       // Step 2: Fetch Address Requests
  //       const addressRes = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/address-requests-rent/buyer/${phoneNumber}`
  //       );

  //       if (statusRes.status === 200 && addressRes.status === 200) {
  //         // Step 3: Create PayU Status Map
  //         const statusMap = {};
  //         statusRes.data.forEach(({ rentId, status }) => {
  //           if (rentId) statusMap[rentId] = status;
  //         });

  //         // Step 4: Extract and enrich address request data
  //         const rawData = Array.isArray(addressRes.data) ? addressRes.data : [];
          
  //         const enriched = rawData.map(item => ({
  //           ...item.property,
  //           rentId: item.property?.rentId,
  //           status: item.status,
  //           requesterPhoneNumber: item.requesterPhoneNumber,
  //           createdAt: item.createdAt,
  //           updatedAt: item.updatedAt,
  //           payuStatus: statusMap[item.property?.rentId] || "unpaid"
  //         }));

  //         // Step 5: Sort by updatedAt or createdAt (desc)
  //         const sorted = enriched.sort(
  //           (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
  //         );

  //         setProperties(sorted);
  //         localStorage.setItem("addressRequests", JSON.stringify(sorted));
  //       } else {
  //       }
  //     } catch (error) {
  //       console.error("Error loading address requests:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAddressRequestsWithPayuStatus();
  // }, [phoneNumber]);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    localStorage.setItem("removedProperties", JSON.stringify(removedProperties));
  }, [removedProperties]);

  const availableProperties = properties.filter(
    (property) => !removedProperties.some((removed) => removed.rentId === property.rentId)
  );

  const toggleShowFullNumber = (rentId) => {
    setShowFullNumber(prev => ({
      ...prev,
      [rentId]: !prev[rentId]
    }));
  };

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
             e.currentTarget.querySelector('svg').style.color = '#CDC9F9';
           }}
         >
           <FaChevronLeft style={{ color: '#CDC9F9', transition: 'color 0.3s ease-in-out' , background:"transparent"}} />
           </button> 
          <h3 className="m-0" style={{fontSize:"18px"}}>ADDRESS REQUESTED BUYERS</h3> 
        </div>

        {/* Filter Buttons */}
        <div className="row g-2 w-100">
          <div className="col-6 p-0">
            <button 
              className="w-100 p-2 border-0" 
              style={{ 
                backgroundColor: activeKey === "All" ? '#4F4B7E' : '#FFFFFF', 
                color: activeKey === "All" ? 'white' : 'grey' 
              }} 
              onClick={() => setActiveKey("All")}
            >
              ALL BUYER
            </button>
          </div>
          <div className="col-6 p-0">
            <button 
              className="w-100 p-2 border-0" 
              style={{ 
                backgroundColor: activeKey === "Removed" ? '#4F4B7E' : '#FFFFFF', 
                color: activeKey === "Removed" ? 'white' : 'grey' 
              }} 
              onClick={() => setActiveKey("Removed")}
            >
              REMOVED BUYER
            </button>
          </div>

          {/* Message Alert */}
          {message.text && (
            <div className={`alert alert-${message.type === "error" ? "danger" : message.type === "success" ? "success" : "info"}`}>
              {message.text}
            </div>
          )}

          <Modal show={showPopup} onHide={() => setShowPopup(false)}>
            <Modal.Body>
              <p>{popupMessage}</p>
              <Button 
                style={{ background: "#4F4B7E", width: "80px", fontSize: "13px", border:"none" }} 
                onClick={popupAction}
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

          {/* Property List */}
          <div className="col-12">
            <div className="w-100 d-flex align-items-center justify-content-center" style={{ maxWidth: '500px' }}>
              {activeKey === "All" ? (
                <PropertyList
                  properties={availableProperties}
                  onRemove={handleRemoveProperty}
                  onUndo={null}
                  showFullNumber={showFullNumber}
                  toggleShowFullNumber={toggleShowFullNumber}
                  handlePayNow={handlePayNow}
                />
              ) : (
                <PropertyList
                  properties={removedProperties}
                  onRemove={null}
                  onUndo={handleUndoRemove}
                  showFullNumber={showFullNumber}
                  toggleShowFullNumber={toggleShowFullNumber}
                  handlePayNow={handlePayNow}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertyList = ({ properties, onRemove, onUndo, showFullNumber, toggleShowFullNumber, handlePayNow }) => {
  const navigate = useNavigate();

  if (properties.length === 0) {
    return (
      <div className="text-center my-4" style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
        <img src={NoData} alt="" width={100}/>      
        <p>No properties found.</p>
      </div>
    );
  }

  return (
    <div className="row mt-4 w-100">
      {properties.map((property) => (
        <PropertyCard
          key={property.rentId}
          property={property}
          onRemove={onRemove}
          onUndo={onUndo}
          showFullNumber={showFullNumber[property.rentId] || false}
          toggleShowFullNumber={() => toggleShowFullNumber(property.rentId)}
          handlePayNow={handlePayNow}
        />
      ))}
    </div>
  );
};


const PropertyCard = ({ property, onRemove, onUndo, showFullNumber, toggleShowFullNumber, handlePayNow }) => {
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const navigate = useNavigate();
  const [localMessage, setLocalMessage] = useState({ text: "", type: "" });

  const handleSendAddress = async (rentId) => {
    try {
      setMessage({ text: "Sending address...", type: "info" });
      
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/address-requests/send/${rentId}`,
        {}, // empty body if not needed
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200) {
        setMessage({ text: "Address sent successfully!", type: "success" });
      } else {
        throw new Error(response.data.message || "Failed to send address");
      }
    } catch (error) {
      console.error("Error sending address:", error);
      setMessage({ 
        text: error.response?.data?.message || "Error sending address", 
        type: "error" 
      });
    }
  };

 const handleCallClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/contact-send-property`, {
        rentId: property.rentId,
        userPhone: property.requesterPhoneNumber,
        postedUserPhone: localStorage.getItem('phoneNumber'),
        status: "contactSend"
      });

      // Store the API response
      // setApiResponse(response.data);
      setMessage({ text: "Contact saved successfully", type: "success" });
      setLocalMessage({ text: "Contact saved successfully", type: "success" });
      
      console.log("API Response:", response.data);
      
      // Initiate phone call
      window.location.href = `tel:${property.requesterPhoneNumber}`;
    } catch (error) {
      setMessage({ text: "Something went wrong", type: "error" });
      setLocalMessage({ text: "Something went wrong", type: "error" });
      console.error("API Error:", error);
    }
  };


  const handleAddAddress = (rentId) => {
    navigate(`/address-edit-form`, { state: { rentId } });
  };

  const handleAddressAction = (e, rentId) => {
    e.stopPropagation();
    if (property.address) {
      // For sending address
      handleSendAddress(rentId);
    } else {
      // For adding address - show confirmation
      setPendingAction(() => () => handleAddAddress(rentId));
      setShowConfirmation(true);
    }
  };

  const handleConfirmation = (confirmed) => {
    setShowConfirmation(false);
    if (confirmed && pendingAction) {
      pendingAction();
    }
    setPendingAction(null);
  };

  return (
    <div
      className="card p-2 w-100 w-md-50 w-lg-33"
      onClick={(e) => {
        const tag = e.target.tagName.toLowerCase();
        if (["button", "svg", "path", "a"].includes(tag)) return;
        navigate(`/detail/${property.rentId}`);
      }}
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        overflow: "hidden",
        marginBottom: "15px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Confirmation Modal */}
      <Modal show={showConfirmation} onHide={() => handleConfirmation(false)} centered>
        <Modal.Body className="text-center">
          <p>Are you sure you want to add an address?</p>
          <div className="d-flex justify-content-center">
            <Button 
              variant="primary" 
              className="me-2"
              onClick={() => handleConfirmation(true)}
              style={{ background: "#4F4B7E", border: "none" }}
            >
              Yes
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => handleConfirmation(false)}
              style={{ background: "#FF4500", border: "none" }}
            >
              No
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Message display */}
      {message.text && (
        <div 
          className={`alert alert-${message.type} p-2 mb-2 text-center`}
          style={{
            backgroundColor: message.type === "success" ? "#d4edda" : 
                           message.type === "error" ? "#f8d7da" : "#e2e3e5",
            color: message.type === "success" ? "#155724" : 
                  message.type === "error" ? "#721c24" : "#383d41",
            fontSize: "12px"
          }}
        >
          {message.text}
        </div>
      )}

      {/* Rest of your component remains the same */}
      <div className="row d-flex align-items-center">
        <div className="col-3 d-flex align-items-center justify-content-center mb-1">
          <img
            src={profil}
            alt="Profile"
            className="rounded-circle mt-2"
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
          />
        </div>
        <div className="p-0" style={{ background: "#707070", width: "2px", height: "80px" }}></div>
        <div className="col-7 p-0 ms-4">
          <div className="text-center rounded-1 w-100 mb-1" style={{ border: "2px solid #4F4B7E", color: "#4F4B7E", fontSize: "14px" }}>
            ADDRESS REQUEST
          </div>
          <p className="mb-1" style={{ color: "#474747", fontWeight: "500", fontSize: "12px" }}>RENT ID- {property.rentId}</p>
  <button
                  className="btn text-white px-3 py-1 flex-grow-1 mx-1"
                  style={{ background: "#2F747F", fontSize: "13px" }}
                  onClick={handleCallClick}
                >
                  Call
                </button>
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

      <div className="p-1">
        <div className="d-flex align-items-center mb-2">
          <div
            onClick={(e) => handleAddressAction(e, property.rentId)}
            className="d-flex col-4 flex-column justify-content-between align-items-center p-3 rounded-3"
            style={{ 
              border: "2px solid #4F4B7E", 
              color: "#4F4B7E", 
              cursor: "pointer",
              backgroundColor: property.address ? "#e8f4f8" : "white"
            }}
          >
            <span className="rounded-circle p-1 d-flex justify-content-center align-items-center" style={{ background: "#4F4B7E", height: '30px', width: "30px" }}>
              <FaLocationDot color="white" />
            </span>
            <p className="m-0" style={{ fontSize: "14px" }}>
              {property.address ? "Send Address" : "Add Address"}
            </p>
            {property.address && (
              <p className="m-0 text-muted" style={{ fontSize: "10px" }}>
                Click to send
              </p>
            )}
          </div>

          {/* Rest of your component remains the same */}
          <div className="d-flex flex-column align-items-start justify-content-between ps-3">
            <div className="d-flex align-items-center mb-4">
              <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
              <div>
                <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Address Requested Date</h6>
                <span style={{ fontSize: '13px', color: '#5E5E5E', fontWeight: 500 }}>
                  {new Date(property.updatedAt || property.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <div className="d-flex align-items-center mb-1">
              <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
              <div>
                <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Buyer Phone</h6>
                <span className="card-text" style={{ fontWeight: "500" }}>
                  {property.payuStatus === "paid" ? (
                    <a
                      href={`tel:${property.requesterPhoneNumber}`}
                      style={{ textDecoration: "none", color: "#1D1D1D" }}
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
                </span>
              </div>
            </div>
          </div>
        </div>

        {property.payuStatus === "paid" ? (
          <>
            {!showFullNumber ? (
              <button
                className="w-100 m-0 p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleShowFullNumber();
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
              <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
                 <button
                  className="btn text-white px-3 py-1 flex-grow-1 mx-1"
                  style={{ background: "#2F747F", fontSize: "13px" }}
                  onClick={handleCallClick}
                >
                  Call
                </button>


                {onRemove && (
                  <button
                    className="btn text-white px-3 py-1 flex-grow-1 mx-1"
                    style={{ background: "#FF4500", fontSize: "13px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(property.rentId);
                    }}
                  >
                    Remove
                  </button>
                )}

                {onUndo && (
                  <button
                    className="btn text-white px-3 py-1 flex-grow-1 mx-1"
                    style={{ background: "green", fontSize: "13px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUndo(property.rentId);
                    }}
                  >
                    Undo
                  </button>
                )}
              </div>
            )}
          </>
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
                  onRemove(property.rentId);
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
                  onUndo(property.rentId);
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