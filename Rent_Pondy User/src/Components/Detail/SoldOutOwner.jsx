





import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {FaCamera, FaEye , FaRulerCombined, FaBed, FaUserAlt, FaCalendarAlt, FaRupeeSign } from "react-icons/fa";
import { MdCall } from "react-icons/md";
import myImage from '../../Assets/Rectangle 146.png'; // Correct path
import myImage1 from '../../Assets/Rectangle 145.png'; // Correct path
import pic from '../../Assets/Default image_PP-01.png'; // Correct path
import { FaArrowLeft } from "react-icons/fa";
import NoData from "../../Assets/OOOPS-No-Data-Found.png";
import Floorr from '../../Assets/floor.PNG'
import calendar from '../../Assets/Calender-01.png';
import bed from '../../Assets/BHK-01.png';
import totalarea from '../../Assets/total_area.png'
import postedby from '../../Assets/Posted By-01.png';
import indianprice from '../../Assets/Indian Rupee-01.png';
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
      background: '#2F747F',
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
        <button style={styles.yes} onClick={onConfirm}   onMouseOver={(e) => {
          e.target.style.background = "#029bb3"; // Brighter neon on hover
          e.target.style.fontWeight = 600; // Brighter neon on hover
          e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover

        }}
        onMouseOut={(e) => {
          e.target.style.background = "#2F747F"; // Original orange
          e.target.style.fontWeight = 400; // Brighter neon on hover

        }}>Yes</button>
          <button style={styles.no} onClick={onClose}    onMouseOver={(e) => {
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



const PropertyCard = ({ property, onRemove, onUndo }) => {

         const navigate = useNavigate();
        
          const handleCardClick = () => {
            if (property?.ppcId) {
              navigate(`/detail/${property.ppcId}`);
            }
          };



 const [message, setMessage] = useState({ text: "", type: "" });


  // Auto-clear message after 3 seconds
  useEffect(() => {
   if (message.text) {
     const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
     return () => clearTimeout(timer);
   }
 }, [message]);
             
         
  const [finalContactNumber, setFinalContactNumber] = useState(null);
const handleContactClick = async (e) => {
  e.stopPropagation();
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/contact`,
      {
        ppcId: property.ppcId,
        phoneNumber: property.postedUserPhoneNumber,
      }
    );

    const {
      success,
      setPpcId,
      assignedPhoneNumber,
      postedUserPhoneNumber,
    } = response.data;

    if (success) {
      const finalContactNumber = setPpcId ? assignedPhoneNumber : postedUserPhoneNumber;

      // setMessage({ text: "Contact saved successfully", type: "success" });

      // You can use finalContactNumber wherever needed
      // Optionally update state to show contact number on UI
      setFinalContactNumber(finalContactNumber);
    } else {
      // setMessage({ text: "Contact failed", type: "error" });
    }
  } catch (error) {
    setMessage({ text: "An error occurred", type: "error" });
  }
};
  
  const [imageCounts, setImageCounts] = useState({}); // Store image count for each property

  const fetchImageCount = async (ppcId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/uploads-count`, {
        params: { ppcId },
      });
      return response.data.uploadedImagesCount || 0;
    } catch (error) {
      return 0;
    }
  };
  useEffect(() => {
    const fetchImageCountForProperty = async () => {
      if (property?.ppcId) {
        const count = await fetchImageCount(property.ppcId);
        setImageCounts((prev) => ({
          ...prev,
          [property.ppcId]: count,
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

const formatPrice = (price) => {
  price = Number(price);
  if (isNaN(price)) return 'N/A';

  if (price >= 10000000) {
    return (price / 10000000).toFixed(2) + ' Cr';
  } else if (price >= 100000) {
    return (price / 100000).toFixed(2) + ' Lakhs';
  } else {
    return formatIndianNumber(price);
  }
};
  return (
    
    <div className="p-0">
    {message && <p style={{ color: message.type === "success" ? "green" : "red" }}>{message.text}</p>}

    <div className="row g-0 rounded-4 mb-2" style={{ border: '1px solid #ddd', overflow: "hidden", background:"#EFEFEF"}}
    onClick={handleCardClick}
>
                  <div className="col-md-4 col-4 d-flex flex-column justify-content-between align-items-center">
                  <div className="text-white py-1 px-2 text-center" style={{ width: '100%', background: "#2F747F" }}>
 PUC- {property.ppcId}
 </div>


 <div style={{ position: "relative", width: "100%", height:'160px'}}>
            <img
                                        src={property.photos?.length ? `https://rentpondy.com/PPC/${property.photos[0]}` : pic }
                                        alt="Property"
                                        className="img-fluid"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                      />
          
          <div >
          <div className="d-flex justify-content-between w-100" style={{ position: "absolute",
          bottom: "0px"}}>
                                    
<span className="d-flex justify-content-center align-items-center" style={{ color:'#fff', background:`url(${myImage}) no-repeat center center`, backgroundSize:"cover" ,fontSize:'12px', width:'50px' }}>
          <FaCamera className="me-1"/> {imageCounts[property.ppcId] || 0}
          </span>
          <span className="d-flex justify-content-center align-items-center" style={{ color:'#fff', background:`url(${myImage1}) no-repeat center center`, backgroundSize:"cover" ,fontSize:'12px', width:'50px' }}>
          <FaEye className="me-1" />{property.views}
          </span>
          </div>
          </div>
          </div>


                 </div>
                 <div className="col-md-8 col-8" style={{paddingLeft:"10px", background:"#F5F5F5"}}>
                  <div className="d-flex justify-content-between"><p className="m-0 " style={{ color:'#5E5E5E' , fontSize:"13px"}}>{property.propertyMode || 'N/A'}</p>
                 
       
                        
{onRemove && (
            <p className="m-0 ps-3 pe-3"
            style={{
              fontSize: "12px",
  
              background: "#FF4F00", // Neon orange
              color: "white",
              cursor: "pointer",
              borderRadius: "0px 0px 0px 15px",
              transition: "all 0.2s ease-in-out",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#ff7300"; // Brighter neon on hover
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#FF4F00"; // Original orange
            }}              onClick={(e) => {
                e.stopPropagation();
                onRemove(property);
              }}
            >Remove</p>
          )}

          {onUndo && (
            <p className="m-0 ps-3 pe-3"
            style={{
              background: "green", // Vibrant green
              color: "white",
              cursor: "pointer",
              borderRadius: "0px 0px 0px 15px",
              transition: "all 0.2s ease-in-out",
              fontSize: "12px",
  
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#32cd32"; // Neon green on hover
            }}
            onMouseOut={(e) => {
              e.target.style.background = "green"; // Original green
            }}              onClick={(e) => {
                e.stopPropagation();
                onUndo(property);
              }}
            >Undo</p>
          )}
                  </div>
                   <p className="fw-bold m-0" style={{ color:'#000000' , fontSize:"15px"}}>{property.propertyType || 'N/A'}</p>
<p
  className="m-0"
  style={{ color: "#5E5E5E", fontWeight: 500, fontSize: "13px" }}
>
  {(() => {
    const locs = [ property.nagar, property.area, property.city, property.district, property.state ]
      .filter((v) => v !== null && v !== undefined && v !== "");

    if (locs.length === 0) {
      // All null/empty — show two N/A
      return <>N/A, N/A</>;
    }

    // Show first 3 valid values, capitalized, separated by commas
    return locs.slice(0, 3).map((val, idx, arr) => (
      <span key={idx}>
{val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()}         {idx < arr.length - 1 ? ", " : ""}
      </span>
    ));
  })()}
</p>                   <div className="card-body ps-2 m-0 pt-0 pe-2 d-flex flex-column justify-content-center">
                     <div className="row">
                 <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1">
                 {/* <FaRulerCombined className="me-2" color="#4F4B7E" /> */}
                 <img src={Floorr} alt="" width={12} className="me-2"/>
                 <span style={{ fontSize:'13px', color:'#5E5E5E' , fontWeight:500 }}>{property.floorNo
  ? property.floorNo.charAt(0).toUpperCase() + property.floorNo.slice(1)
  : 'N/A'}

                  
                 </span>
               </div>
               <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
                 {/* <FaBed className="me-2" color="#4F4B7E"/> */}
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
               <div className="col-12 d-flex flex-col align-items-center mt-1 mb-1 ps-1">
                <h6 className="m-0">
       
<span
  style={{
    fontSize: '15px',
    color: property.rentalAmount === 'On Demand' ? '#8C3C2F' : '#4F4B7E', 
    fontWeight: 600,
    letterSpacing: '1px',
  }}
>
   <img src={indianprice} alt="" width={8} className="me-2" />
  {typeof property.rentalAmount === 'string' && property.rentalAmount === 'On Demand'
    ? 'On Demand'
    : property.rentalAmount
      ? formatPrice(property.rentalAmount)
      : 'N/A'}
</span>

         <span style={{ color: '#4F4B7E', fontSize: '13px', marginLeft: "5px", fontSize: '11px' }}>
             / {property.rentType || "N/A"}
            </span>
                  </h6>
               </div>
                                             <p
                                                          className="p-1"
                                                          onClick={handleContactClick}
                                                          style={{ color: "#2E7480", margin: "0px", cursor: "pointer" }}
                                                        >
                                                          {finalContactNumber ? (
                                                            <div className="mt-2">
                                                              <strong><MdCall color="#2F747F" /></strong>{" "}
                                                              <a
                                                                href={`tel:${finalContactNumber}`}
                                                                style={{ color: "#2F747F", textDecoration: "none" }}
                                                                onClick={(e) => e.stopPropagation()} // Prevent re-triggering contact API
                                                              >
                                                                {finalContactNumber}
                                                              </a>
                                                            </div>
                                                          ) : (
                                                            <div className="mt-2 d-flex align-items-center">
                                                              <MdCall className="me-2" color="#2F747F" />
                                                              <span style={{ fontSize: "12px" }}>Click to show number</span>
                                                            </div>
                                                          )}
                                                        </p>
                      </div>
                    </div>
                  </div>
               </div>
               </div>
  );
};

const PropertyList = ({ properties, onRemove, onUndo }) => {
  return properties.length === 0 ? (
    <div className="text-center my-4 "
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
        <PropertyCard key={property.ppcId} property={property} onRemove={onRemove} onUndo={onUndo} />
      ))}
    </div>
  );
};


const App = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState("All");
  const { phoneNumber } = useParams(); // Getting phoneNumber from URL params
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
      }, 150); // Adjust the delay as needed
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Auto-clear message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
          phoneNumber: phoneNumber,
          viewedFile: "Sold Out Owner ",
          viewTime: new Date().toISOString(),
        });
      } catch (err) {
      }
    };
  
    if (phoneNumber) {
      recordDashboardView();
    }
  }, [phoneNumber]);
// Fetch interested properties
const fetchInterestedProperties = useCallback(async () => {
  if (!phoneNumber) {
    return;
  }

  try {
    setLoading(true);
    const apiUrl = `${process.env.REACT_APP_API_URL}/get-soldOut-owner`;

    const { data } = await axios.get(apiUrl, { params: { phoneNumber } });

    // 🔽 Sort by createdAt (newest first)
    const sortedData = data.soldOutRequestsData.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setProperties(sortedData);
    localStorage.setItem("soldOutProperties", JSON.stringify(sortedData));
  } catch (error) {
    setMessage({ text: "Failed to fetch properties.", type: "error" });
  } finally {
    setLoading(false);
  }
}, [phoneNumber]);

useEffect(() => {
  fetchInterestedProperties();
}, [fetchInterestedProperties]);



  const handleRemoveConfirm = async () => {
    const { ppcId } = modal.property;
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/delete-detail-property`, { ppcId, phoneNumber });
      updatePropertyStatus(ppcId, "delete");
      setMessage({ text: "RemovedFavorite removed successfully.", type: "success" });
    } catch {
      setMessage({ text: "Error removing favorite.", type: "error" });
    } finally {
      setModal({ show: false, type: "", property: null });
    }
  };
  
  const handleUndoConfirm = async () => {
    const { ppcId } = modal.property;
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/undo-delete-detail`, { ppcId, phoneNumber });
      updatePropertyStatus(ppcId, "active");
      setMessage({ text: "RemovedFavorite restored successfully.", type: "success" });
    } catch {
      setMessage({ text: "Error restoring favorite.", type: "error" });
    } finally {
      setModal({ show: false, type: "", property: null });
    }
  };
  

  // Update property status in local state and storage
  const updatePropertyStatus = (ppcId, status) => {
    const updatedProperties = properties.map((property) =>
      property.ppcId === ppcId ? { ...property, status } : property
    );
    setProperties(updatedProperties);
    localStorage.setItem("soldOutProperties", JSON.stringify(updatedProperties));
  };

  // Filter properties
  const activeProperties = properties.filter((property) => property.status !== "delete");
  const removedProperties = properties.filter((property) => property.status === "delete");
  const navigate = useNavigate();



  return (
    <div className="container d-flex align-items-center justify-content-center p-0">
      <div className="d-flex flex-column align-items-center justify-content-center m-0" 
        style={{ maxWidth: '500px', margin: 'auto', width: '100%',  fontFamily: 'Inter, sans-serif'}}>
                <div className="d-flex align-items-center justify-content-start w-100"     style={{
        background: "#EFEFEF",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        opacity: isScrolling ? 0 : 1,
        pointerEvents: isScrolling ? "none" : "auto",
        transition: "opacity 0.3s ease-in-out",
      }}>
                <button
      onClick={() => navigate(-1)}
      className="pe-5"
      style={{
        backgroundColor: '#f0f0f0',
        border: 'none',
        padding: '10px 20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        display: 'flex',
        alignItems: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f0f4f5'; // Change background
        e.currentTarget.querySelector('svg').style.color = '#00B987'; // Change icon color
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#f0f0f0';
        e.currentTarget.querySelector('svg').style.color = '#30747F';
      }}
    >
      <FaArrowLeft style={{ color: '#30747F', transition: 'color 0.3s ease-in-out' , background:"transparent"}} />
    </button><h3 className="m-0 ms-3" style={{fontSize:"20px"}}>SOLD OUT TENANT  </h3> </div>
        {/* Buttons for filtering */}
        <div className="row g-2 w-100">
          <div className="col-6 p-0">
            <button className="w-100" style={{ backgroundColor: '#30747F', color: 'white' }} 
              onClick={() => setActiveKey("All")}>
              All Properties
            </button>
          </div>
          <div className="col-6 p-0">
            <button className="w-100" style={{ backgroundColor: '#FFFFFF', color: 'grey' }} 
              onClick={() => setActiveKey("Removed")}>
              Removed Properties
            </button>
          </div>

          {/* Message Alert */}
          {message.text && (
            <div className="col-12">
              <div className={`alert alert-${message.type} w-100`}>{message.text}</div>
            </div>
          )}

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
      </div>            ) : activeKey === "All" ? (
              <PropertyList
                properties={activeProperties}
                onRemove={(property) => setModal({ show: true, type: "remove", property })}
              />
            ) : (
              <PropertyList
                properties={removedProperties}
                onUndo={(property) => setModal({ show: true, type: "undo", property })}
              />
            )}
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
    </div>
  );
};

export default App;










































