







import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {FaCamera, FaEye , FaRulerCombined, FaBed, FaUserAlt, FaCalendarAlt, FaRupeeSign, FaChevronLeft } from "react-icons/fa";
import { MdCall } from "react-icons/md";
import myImage from '../../Assets/Rectangle 146.png'; // Correct path
import myImage1 from '../../Assets/Rectangle 145.png'; // Correct path
import pic from '../../Assets/Mask Group 3@2x.png'; // Correct path
import { FaArrowLeft } from "react-icons/fa";
import NoData from "../../Assets/OOOPS-No-Data-Found.png";
import calendar from '../../Assets/Calender-01.png'
import bed from '../../Assets/BHK-01.png'
import totalarea from '../../Assets/total_area.png'
import postedby from '../../Assets/Posted By-01.png'
import indianprice from '../../Assets/Indian Rupee-01.png'
import Floorr from '../../Assets/floor.PNG'



const ConfirmationModal = ({ show, onClose, onConfirm, message }) => {
  if (!show) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    },
    modal: {
      background: '#fff',
      padding: '20px 30px',
      borderRadius: '10px',
      textAlign: 'center',
      minWidth: '300px'
    },
    buttons: {
      display: 'flex',
      // justifyContent: 'space-around',
      marginTop: '20px'
    },
    yes: {
      background: '#4F4B7E',
      color: '#fff',
      padding: '8px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    no: {
      background: '#FF4500',
      color: '#fff',
      padding: '8px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginLeft:'10px'
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h5>Confirmation</h5>
        <p>{message}</p>
        <div style={styles.buttons}>
        <button style={styles.yes} onClick={onConfirm} 
          onMouseOver={(e) => {
            e.target.style.background = "#029bb3"; // Brighter neon on hover
            e.target.style.fontWeight = 600; // Brighter neon on hover
            e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
  
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#4F4B7E"; // Original orange
            e.target.style.fontWeight = 400; // Brighter neon on hover
  
          }}
               >Yes</button>
          <button style={styles.no} onClick={onClose}  onMouseOver={(e) => {
          e.target.style.background = "#FF6700"; // Brighter neon on hover
          e.target.style.fontWeight = 600; // Brighter neon on hover
          e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
        }}
        onMouseOut={(e) => {
          e.target.style.background = "#FF4500"; // Original orange
          e.target.style.fontWeight = 400; // Brighter neon on hover

        }}>No</button>
        </div>
      </div>
    </div>
  );
};




const PropertyCard = ({ property, onRemoveClick, onUndoClick }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: "", type: "" });
const location = useLocation();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const [phoneNumber] = useState(storedPhoneNumber);


  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);
    
  const handleCardClick = () => {
    if (property?.rentId) {
      navigate(`/detail/${property.rentId}`);
    }
  };

  const [finalContactNumber, setFinalContactNumber] = useState(null);

      const handleRevealClick = () => {
  setFinalContactNumber(property?.postedUserPhoneNumber); // or whatever field contains the number
};

   const handleContactClick = async (e) => {
    e.stopPropagation();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/contact-send-property`,
        {
          rentId: property.rentId,
          postedUserPhone: property.postedUserPhoneNumber,
          userPhone: phoneNumber,
        }
      );

      const {
        success,
        setrentId,
        assignedPhoneNumber,
        postedUserPhoneNumber,
      } = response.data;

      if (success) {
        const finalContact = setrentId ? assignedPhoneNumber : postedUserPhoneNumber;
        setFinalContactNumber(finalContact);
        setMessage({ text: "Contact saved successfully", type: "success" });
      } else {
        setMessage({ text: "Contact failed", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An error occurred", type: "error" });
    }
  };
  const [imageCounts, setImageCounts] = useState({});

  const fetchImageCount = async (rentId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/uploads-count`, {
        params: { rentId },
      });
      return response.data.uploadedImagesCount || 0;
    } catch (error) {
      return 0;
    }
  };

  useEffect(() => {
    const fetchImageCountForProperty = async () => {
      if (property?.rentId) {
        const count = await fetchImageCount(property.rentId);
        setImageCounts((prev) => ({
          ...prev,
          [property.rentId]: count,
        }));
      }
    };
  
    fetchImageCountForProperty();
  }, [property]);
      
  const formatIndianNumber = (x) => {
    x = x.toString();
    const lastThree = x.slice(-3);
    const otherNumbers = x.slice(0, -3);
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (otherNumbers ? "," : "") + lastThree;
  };

  const formatPrice = (rentalAmount) => {
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
    <div>
      {message && <p style={{ color: message.type === "success" ? "green" : "red" }}>{message.text}</p>}

      <div className="row g-0 rounded-4 mb-2" style={{ border: '1px solid #ddd', overflow: "hidden", background: "#EFEFEF" }}
        onClick={handleCardClick}
      >
        <div className="col-md-4 col-4 d-flex flex-column justify-content-between align-items-center">
          <div className="text-white py-1 px-2 text-center" style={{ width: '100%', background: "#4F4B7E" }}>
            PUC- {property.rentId}
          </div>
          <div style={{ position: "relative", width: "100%", height: '170px' }}>
            <img
             src={
    property.photos && property.photos.length > 0
      ? `https://rentpondy.com/PPC/${property.photos[0].replace(/\\/g, "/").replace(/^\/+/, "")}`
      : pic
  }
  alt={(
    `${property.rentId || 'N/A'}-${property.propertyMode || 'N/A'}-${property.propertyType || 'N/A'}-rs-${property.price || '0'}
    -in-${property.city || ''}-${property.area || ''}-${property.state || ''}`
  )
    .replace(/\s+/g, "-")
    .replace(/,+/g, "-")
    .toLowerCase()
  }
              className="img-fluid"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="d-flex justify-content-between w-100" style={{ position: "absolute", bottom: "0px" }}>
              <span className="d-flex justify-content-center align-items-center" style={{ color:'#fff', background:`url(${myImage}) no-repeat center center`, backgroundSize:"cover" ,fontSize:'12px', width:'50px' }}>
                <FaCamera className="me-1"/> {imageCounts[property.rentId] || 0}
              </span>
              <span className="d-flex justify-content-center align-items-center" style={{ color:'#fff', background:`url(${myImage1}) no-repeat center center`, backgroundSize:"cover" ,fontSize:'12px', width:'50px' }}>
                <FaEye className="me-1" />{property.views}
              </span>
            </div>
          </div>
        </div>

        <div className="col-md-8 col-8" style={{paddingLeft:"10px", background:"#F5F5F5"}}>
          <div className="d-flex justify-content-between">
            <p className="m-0 " style={{ color: '#5E5E5E' , fontSize:"13px"}}>{property.propertyMode || 'N/A'}</p>


 {/* {property.propertyMessage && (
    <span 
      className="me-2 mt-2" 
      style={{
        color: "#FF0000",
        fontWeight: "bold",
        fontSize: "12px"
      }}
    >
      {property.propertyMessage}
    </span>
  )} */}

            {onRemoveClick && (
              <p className="m-0 ps-3 pe-3" 
                style={{
                  fontSize: "12px",
                  background: "#FF4F00",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "0px 0px 0px 15px",
                  transition: "all 0.2s ease-in-out",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#ff7300";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#FF4F00";
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveClick(property);
                }}
              >Remove</p>
            )}

            {onUndoClick && (
              <p className="m-0 ps-3 pe-3"
                style={{
                  background: "green",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "0px 0px 0px 15px",
                  transition: "all 0.2s ease-in-out",
                  fontSize: "12px",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#32cd32";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "green";
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onUndoClick(property);
                }}
              >Undo</p>
            )}
          </div>

          <p className="fw-bold m-0" style={{ color: '#000000' , fontSize:"15px"}}>{property.propertyType || 'N/A'}  {property.propertyMessage && (
    <span 
      className="me-4 mt-0" 
      style={{
        color: "#FF0000",
        fontWeight: "bold",
        fontSize: "12px"
      }}
    >
      {property.propertyMessage}
    </span>
  )}</p>
          <p className="m-0" style={{ color: "#5E5E5E", fontWeight: 500, fontSize: "13px" }}>
            {(() => {
              const locs = [ property.nagar, property.area, property.city, property.district, property.state ]
                .filter((v) => v !== null && v !== undefined && v !== "");

              if (locs.length === 0) {
                return <>N/A, N/A</>;
              }

              return locs.slice(0, 3).map((val, idx, arr) => (
                <span key={idx}>
{val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()}                   {idx < arr.length - 1 ? ", " : ""}
                </span>
              ));
            })()}
          </p>
          <div className="card-body ps-2 m-0 pt-0 pe-2 d-flex flex-column justify-content-center">
            <div className="row">
             <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1">
    <img src={Floorr} alt="" width={12} className="me-2"/>
                    <span style={{ fontSize:'13px', color:'#5E5E5E' , fontWeight:500 }}>{property.floorNo
     ? property.floorNo.charAt(0).toUpperCase() + property.floorNo.slice(1)
     : 'N/A'}
                    </span>
 </div>
 <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
   <img src={bed} alt="" width={12} className="me-2"/>
   <span style={{ fontSize:'13px', color:'#5E5E5E' ,fontWeight: 500 }}>{property.bedrooms || 'N/A'} BHK</span>
 </div>
   <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
                 {/* <FaUserAlt className="me-2" color="#4F4B7E"/> */}
                 <img src={totalarea} alt="" width={12} className="me-2"/>
                   <span style={{ fontSize:'13px', color:'#5E5E5E' , fontWeight:500 }}>{property.totalArea || 'N/A'} {property.areaUnit
  ? property.areaUnit.charAt(0).toUpperCase() + property.areaUnit.slice(1)
  : 'N/A'}
                 </span>
               </div>
   <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
   <img src={calendar} alt="" width={12} className="me-2" />
   <span style={{ fontSize:'13px', color:'#5E5E5E', fontWeight: 500 }}>
     {
       property.updatedAt && property.updatedAt !== property.createdAt
         ? ` ${new Date(property.updatedAt).toLocaleDateString('en-IN', {
             year: 'numeric',
             month: 'short',
             day: 'numeric'
           })}`
         : ` ${new Date(property.createdAt).toLocaleDateString('en-IN', {
             year: 'numeric',
             month: 'short',
             day: 'numeric'
           })}`
     }
   </span>
 </div>
              <div className="col-12 d-flex flex-col align-items-center p-1">
                <h6 className="m-0 ">
                  <span style={{ fontSize: '15px', color: '#4F4B7E', fontWeight: 'bold', letterSpacing: "1px" }}>
<img
                src={indianprice}
                alt=""
                width={8}
                className="me-2"
                style={{ marginRight: "6px" }}
              />                    {property.rentalAmount
                      ? formatPrice(property.rentalAmount)
                      : 'N/A'}
                  </span>
                 <span style={{ color: '#4F4B7E', fontSize: '13px', marginLeft: "5px", fontSize: '11px' }}>
                              / {property.rentType || "N/A"}
                             </span>
                </h6>
              </div>
              {/* <p
                className="p-1"
                onClick={handleContactClick}
                style={{ color: "#2E7480", margin: "0px", cursor: "pointer" }}
              >
                {finalContactNumber ? (
                  <div className="mt-2">
                    <strong><MdCall color="#4F4B7E" /></strong>{" "}
                    <a
                      href={`tel:${finalContactNumber}`}
                      style={{ color: "#4F4B7E", textDecoration: "none" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {finalContactNumber}
                    </a>
                  </div>
                ) : (
                  <div className="mt-2 d-flex align-items-center">
                    <MdCall className="me-2" color="#4F4B7E" />
                    <span style={{ fontSize: "12px" }}>Click to show number</span>
                  </div>
                )}
              </p> */}

{finalContactNumber ? (
  <div className="p-1 mt-2 d-flex align-items-center">
    <MdCall className="me-2" color="#2F747F" />
    <a
      href={`tel:${finalContactNumber}`}
      style={{ color: "#2F747F", textDecoration: "none", fontSize: "14px" }}
      onClick={(e) => {
        e.stopPropagation(); // Prevent card click
        handleContactClick(e); // Log contact API
      }}
    >
      {finalContactNumber}
    </a>
  </div>
) : (
  <p
    className="p-1 mt-2 d-flex align-items-center"
    onClick={(e) => {
      e.stopPropagation(); // Prevent card navigation
      handleRevealClick(); // Show number only
    }}
    style={{ color: "#2E7480", margin: "0px", cursor: "pointer" }}
  >
    <MdCall className="me-2" color="#2F747F" />
    <span style={{ fontSize: "12px" }}>Click to show number</span>
  </p>
)}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertyList = ({ properties, onRemoveClick, onUndoClick }) => {
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
    <div className="row m-0 w-100">
      {properties.map((property) => (
        <PropertyCard 
          key={property.rentId} 
          property={property} 
          onRemoveClick={onRemoveClick} 
          onUndoClick={onUndoClick} 
        />
      ))}
    </div>
  );
};

const App = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState("All");
  const location = useLocation();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const [phoneNumber] = useState(storedPhoneNumber);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [modal, setModal] = useState({ show: false, type: "", property: null });
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
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // const fetchInterestedProperties = useCallback(async () => {
  //   if (!phoneNumber) return;
  //   try {
  //     setLoading(true);
  //     const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/get-interest-owner-rent`, {
  //       params: { phoneNumber }
  //     });
  
  //     // Sort by updatedAt (or createdAt if updatedAt doesn't exist) in descending order
  //     const sortedData = data.interestRequestsData.sort(
  //       (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
  //     );
  
  //     setProperties(sortedData);

  //   } catch {
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [phoneNumber]);
  
  // useEffect(() => {
  //   fetchInterestedProperties();
  // }, [fetchInterestedProperties]);
  


const fetchInterestedProperties = useCallback(async () => {
  if (!phoneNumber) return;

  try {
    setLoading(true);

    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/get-interest-owner-rent`, {
      params: { phoneNumber }
    });

    const interestRequests = Array.isArray(data.interestRequestsData)
      ? data.interestRequestsData
      : [];

    // 🔄 Enrich each property with propertyMessage using rentId
    const enrichedProperties = await Promise.all(
      interestRequests.map(async (property) => {
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
          propertyMessage,
        };
      })
    );

    // 🔁 Sort by updatedAt or createdAt (desc)
    const sortedData = enrichedProperties.sort(
      (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    );

    setProperties(sortedData);
  } catch (error) {
    console.error("Failed to fetch rent interested properties:", error);
  } finally {
    setLoading(false);
  }
}, [phoneNumber]);

useEffect(() => {
  fetchInterestedProperties();
}, [fetchInterestedProperties]);


  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
          phoneNumber: phoneNumber,
          viewedFile: "Interest Owner",
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


  // Update property status in state
  const updatePropertyStatus = (rentId, status) => {
    setProperties(prevProperties => 
      prevProperties.map(p => 
        p.rentId === rentId ? { ...p, status } : p
      )
    );
  };

  // Handle remove confirmation
  const handleRemoveConfirm = async () => {
    const { rentId } = modal.property;
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/delete-detail-property`, { 
        rentId, 
        phoneNumber 
      });
      
      updatePropertyStatus(rentId, "deleted");
      setMessage({ text: "Property removed successfully", type: "success" });
      
      // Refresh the list after successful deletion
      fetchInterestedProperties();
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || "Error removing property", 
        type: "error" 
      });
    } finally {
      setModal({ show: false, type: "", property: null });
    }
  };

  // Handle undo confirmation
  const handleUndoConfirm = async () => {
    const { rentId } = modal.property;
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/undo-delete-detail`, { 
        rentId, 
        phoneNumber 
      });
      
      updatePropertyStatus(rentId, "active");
      setMessage({ text: "Property restored successfully", type: "success" });
      
      // Refresh the list after successful undo
      fetchInterestedProperties();
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || "Error restoring property", 
        type: "error" 
      });
    } finally {
      setModal({ show: false, type: "", property: null });
    }
  };

  // Filter properties based on status
  const activeProperties = properties.filter(p => p.status !== "deleted");
  const removedProperties = properties.filter(p => p.status === "deleted");

  
  const navigate = useNavigate();

  return (
    <div className="container d-flex align-items-center justify-content-center p-0">
      <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', margin: 'auto', width: '100%' ,fontFamily: 'Inter, sans-serif'}}>
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
          <h3 className="m-0" style={{ fontSize: "18px" }}>MY SEND INTEREST</h3>
        </div>

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
              All Properties
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
              Removed Properties
            </button>
          </div>

          {message.text && (
            <div className="col-12">
              <div className={`alert alert-${message.type} w-100`}>{message.text}</div>
            </div>
          )}

          <div className="col-12">
            <div className="w-100 d-flex align-items-center justify-content-center" style={{ maxWidth: '500px' }}>
              {loading ? (
                <div className="text-center my-4"
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}>
                  <span className="spinner-border text-primary" role="status" />
                  <p className="mt-2">Loading properties...</p>
                </div>
              ) : activeKey === "All" ? (
                <PropertyList
                  properties={activeProperties}
                  onRemoveClick={(property) => setModal({ show: true, type: "remove", property })}
                />
              ) : (
                <PropertyList
                  properties={removedProperties}
                  onUndoClick={(property) => setModal({ show: true, type: "undo", property })}
                />
              )}
            </div>
          </div>
        </div>

        <ConfirmationModal
          show={modal.show}
          onClose={() => setModal({ show: false, type: "", property: null })}
          onConfirm={modal.type === "remove" ? handleRemoveConfirm : handleUndoConfirm}
          message={modal.type === "remove" ? "Are you sure you want to remove this property?" : "Do you want to undo the removal of this property?"}
        />
      </div>
    </div>
  );
};

export default App;