



import React, { useState, useEffect } from 'react'; 
import { Tab, Nav, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaChevronLeft } from "react-icons/fa";
import pic from '../../Assets/Mask Group 3@2x.png'; // Correct path
import myImage from '../../Assets/Rectangle 146.png'; // Correct path
import myImage1 from '../../Assets/Rectangle 145.png'; 
import {FaCamera, FaEye , FaRulerCombined, FaBed, FaUserAlt, FaCalendarAlt, FaRupeeSign } from 'react-icons/fa';
import { MdCall } from 'react-icons/md';
import NoData from "../../Assets/OOOPS-No-Data-Found.png";
import calendar from '../../Assets/Calender-01.png'
import bed from '../../Assets/BHK-01.png'
import totalarea from '../../Assets/total_area.png'
import postedby from '../../Assets/Posted By-01.png'
import indianprice from '../../Assets/Indian Rupee-01.png'
import Floorr from '../../Assets/floor.PNG'

const PropertyCard = ({ property , onRemove , onUndo }) => {

 const [message, setMessage] = useState({ text: "", type: "" });


 const location = useLocation();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const [phoneNumber] = useState(storedPhoneNumber);


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

       const handleRevealClick = () => {
  setFinalContactNumber(property?.postedUserPhoneNumber); // or whatever field contains the number
};


  // Auto-clear message after 3 seconds
  useEffect(() => {
   if (message.text) {
     const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
     return () => clearTimeout(timer);
   }
 }, [message]);
    

  const navigate = useNavigate();


  const handleCardClick = () => {
    if (confirmAction) return; // Don't navigate if confirmation is active
    if (property?.rentId) {
      // navigate(`/detail/${property.rentId}`);
      navigate(`/detail/${property.rentId}`, { state: { photoURL: property.photoURL } });

  }
 };
     
  
  const [imageCounts, setImageCounts] = useState({}); // Store image count for each property

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
  
 
  const [finalContactNumber, setFinalContactNumber] = useState(null);


  const [properties, setProperties] = useState([]);

 
  const [confirmAction, setConfirmAction] = useState(null); // 'remove' or 'undo'

  const handleClick = (action) => {
    setConfirmAction(action); // 'remove' or 'undo'
  };

  const handleConfirmYes = () => {
    if (confirmAction === 'remove') {
      onRemove(property.rentId);
    } else if (confirmAction === 'undo') {
      onUndo(property.rentId);
    }
    setConfirmAction(null);
  };

  const handleConfirmNo = () => {
    setConfirmAction(null);
  };
  
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
      {/* {message} */}
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
      
    <div className="row g-0 rounded-4 mb-2" style={{ border: '1px solid #ddd', overflow: "hidden", background: "#EFEFEF" }}
    onClick={handleCardClick}
>
    <div className="col-md-4 col-4 d-flex flex-column justify-content-between align-items-center">
      <div className="text-white py-1 px-2 text-center" style={{ width: '100%', background: "#4F4B7E" }}>
        Rent Id - {property.rentId}
      </div>
   

<div style={{ position: "relative", width: "100%", height:'160px'}}>
            <img
                                        src={property.photoURL ? property.photoURL : pic} // ✅ Use `photoURL`
                                    
                                          alt={
    `${property.rentId || 'N/A'}-${property.propertyMode || 'N/A'}-${property.propertyType || 'N/A'}-rs-${property.price || '0'}
    -in-${property.city || ''}-${property.area || ''}-${property.state || ''}`
      .replace(/\s+/g, "-")
      .replace(/,+/g, "-")
      .toLowerCase()
  }
                                        className="img-fluid"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                      />

          <div >
          <div className="d-flex justify-content-between w-100" style={{ position: "absolute",
          bottom: "0px"}}>
                              
<span className="d-flex justify-content-center align-items-center" style={{ color:'#fff', background:`url(${myImage}) no-repeat center center`, backgroundSize:"cover" ,fontSize:'12px', width:'50px' }}>
          <FaCamera className="me-1"/> {imageCounts[property.rentId] || 0}
          </span>
          <span className="d-flex justify-content-center align-items-center" style={{ color:'#fff', background:`url(${myImage1}) no-repeat center center`, backgroundSize:"cover" ,fontSize:'12px', width:'50px' }}>
          <FaEye className="me-1" />{property.views}
          </span>
          </div>
          </div>
          </div>
    </div>
    <div className="col-md-8 col-8" style={{paddingLeft:"10px", background:"#F5F5F5"}}>
    <div className="d-flex justify-content-between">
        <p className="m-0" style={{ color: '#5E5E5E', fontWeight: 'normal' }}>
          {property.propertyMode || 'N/A'}
        </p>
    
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

{onRemove ? (
        <p
          className="mb-0 ps-3 pe-3 text-center pt-1"
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
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevents card click
            handleClick('remove');
          }}
        >
          REMOVE
        </p>
      ) : (
        <p
          className="mb-0 ps-3 pe-3 text-center pt-1"
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
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevents card click
            handleClick('undo');
          }}        >
          UNDO
        </p>
      )}
      {confirmAction && (
        <div
          style={{
            position: "fixed",
            background: "white",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            width: "400px",
            height:"100px",
            textAlign: "center"
          }}
        >
          <p style={{
            color:"#007C7C", fontSize:"12px"
          }}>Are you sure you want to {confirmAction} this Property?</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <button className='p-1' style={{ background:  "#4F4B7E", width: "80px", fontSize: "13px", border:"none" }} onClick={handleConfirmYes}   onMouseOver={(e) => {
          e.target.style.background = "#029bb3"; // Brighter neon on hover
          e.target.style.fontWeight = 600; // Brighter neon on hover
          e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover

        }}
        onMouseOut={(e) => {
          e.target.style.background = "#4F4B7E"; // Original orange
          e.target.style.fontWeight = 400; // Brighter neon on hover

        }}>Yes</button>
            <button className="ms-3 p-1" style={{ background:  "#FF0000", width: "80px", fontSize: "13px" , border:"none"}} onClick={handleConfirmNo}    onMouseOver={(e) => {
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
      )}
      </div>
      <p className="fw-bold m-0" style={{ color: '#000000', fontSize:"15px" }}>{property.propertyType || 'N/A'}  {property.propertyMessage && (
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
</p>      <div className="card-body ps-2 m-0 pt-0 pe-2 d-flex flex-column justify-content-center">
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
     

        {/* <div className="col-6 d-flex align-items-center  p-1">
        <FaCalendarAlt className="me-2" color="#4F4B7E"/> 
                            <span style={{ fontSize:'13px', color:'#5E5E5E', fontWeight: 500 }}>
                              {property.createdAt ? new Date(property.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) : 'N/A'}
                            </span>     
                            </div>     */}

                            {/* <div className="col-6 d-flex align-items-center p-1">
  <FaCalendarAlt className="me-2" color="#4F4B7E" />
  <span style={{ fontSize: '13px', color: '#5E5E5E', fontWeight: 500 }}>
    {
      property.updatedAt && property.updatedAt !== property.createdAt
        ? new Date(property.updatedAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        : new Date(property.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
    }
  </span>
</div> */}


                            <div className="col-12 d-flex flex-col align-items-center p-1">
                            <h6 className="m-0">
            <span style={{ fontSize: '17px', color: '#4F4B7E', fontWeight: 'bold', letterSpacing: "1px" }}>
<img
                src={indianprice}
                alt=""
                width={8}
                className="me-2"
                style={{ marginRight: "6px" }}
/>    {property.rentalAmount
          ? formatPrice(property.rentalAmount)
          : 'N/A'}             </span>
          <span style={{ color: '#4F4B7E', fontSize: '13px', marginLeft: "5px", fontSize: '11px' }}>
                       / {property.rentType || "N/A"}
                      </span>
          </h6>
        </div>


                  
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
<div className='text-center' style={{border:"2px solid #4F4B7E", borderRadius:"0px 0px 15px 15px",  overflow: "hidden", fontSize:"14px", color:"grey"}}>{property.status || 'N/A'} : <span>  {property.createdAt ? new Date(property.createdAt).toLocaleDateString('en-IN') : 'N/A'} </span></div>
  </div>
  </div>

  
  );
};

const PhotoRequestOwner = ({ properties, onRemove }) => {
  const filteredProperties = properties.filter((property) => property.status !== 'deleted');
  
  return (
    <div className="container">
      <div className="row rounded-4 p-1">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.rentId} property={property} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
};

const RemovedProperties = ({ removedProperties, onUndo }) => {

  return (
    <div className="container">
      <div className="row rounded-4 p-1">
      {removedProperties.map((property) => (
          <PropertyCard key={property.rentId} property={property} onUndo={onUndo} />
        ))}
      </div>
    </div>
  );
};


const App = () => {
  const location = useLocation();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const [phoneNumber] = useState(storedPhoneNumber);  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const [activeKey, setActiveKey] = useState('All');
  const [removedProperties, setRemovedProperties] = useState(() => {
    const storedRemovedProperties = localStorage.getItem('removedProperties');
    return storedRemovedProperties ? JSON.parse(storedRemovedProperties) : [];
  });
  const [properties, setProperties] = useState([]);



    useEffect(() => {
   if (message.text) {
     const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
     return () => clearTimeout(timer);
   }
 }, [message]);


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
          viewedFile: "Photo request Owner Property",
          viewTime: new Date().toISOString(),
        });
      } catch (err) {
      }
    };
  
    if (phoneNumber) {
      recordDashboardView();
    }
  }, [phoneNumber]);

// useEffect(() => {
//   const fetchProperties = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/address-requests-rent/owner/${phoneNumber}`);
      
//       if (response.status === 200) {
//         // Assuming `response.data` contains the properties with a `createdAt` field
//         // const sortedProperties = response.data.sort(
//         //   (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         // );


//         const sortedProperties = response.data.sort(
//   (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
// );


//         setProperties(sortedProperties);  // Set sorted properties
//       } else {
//         setMessage("No properties found.");
//       }
//     } catch (error) {
//       setMessage("Error fetching properties.");
//     }
//   };

//   fetchProperties();
// }, [phoneNumber]); // Trigger effect when `phoneNumber` changes



useEffect(() => {
  const fetchProperties = async () => {
    if (!phoneNumber) return;

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/address-requests-rent/owner/${phoneNumber}`);

      if (response.status === 200) {
        const properties = Array.isArray(response.data) ? response.data : [];

        // 🔁 Enrich each property with propertyMessage using rentId
        const enrichedProperties = await Promise.all(
          properties.map(async (property) => {
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

        // 🔽 Sort by updatedAt or createdAt
        const sortedProperties = enrichedProperties.sort(
          (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        );

        setProperties(sortedProperties);
      } else {
        setMessage("No properties found.");
      }
    } catch (error) {
      setMessage("Error fetching properties.");
    }
  };

  fetchProperties();
}, [phoneNumber]);




const handleRemoveProperty = async (rentId) => {
  if (!rentId) {
    setMessage("Invalid property ID.");
    return;
  }
  try {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/address-requests-rent/delete/${rentId}`);
    if (response.status === 200) {
      setMessage('Address request marked as deleted.');

      setProperties((prev) =>
        prev.map((property) =>
          property.rentId === rentId ? { ...property, status: 'deleted' } : property
        )
      );

      const removedProperty = properties.find((property) => property.rentId === rentId);
      if (removedProperty) {
        const propertyWithOriginalStatus = {
          ...removedProperty,
          originalStatus: removedProperty.status // store original status
        };
        setRemovedProperties((prev) => {
          const updated = [...prev, propertyWithOriginalStatus];
          localStorage.setItem('removedProperties', JSON.stringify(updated));
          return updated;
        });
      }
    }
  } catch (error) {
    setMessage(error.response?.data?.message || 'Error deleting photo request.');
  }
};

const handleUndoRemove = async (rentId) => {
  if (!rentId) {
    setMessage("Invalid property ID.");
    return;
  }
  try {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/address-requests-rent/undo/${rentId}`);
    if (response.status === 200) {
      setMessage("Address request restored.");

      const restoredProperty = removedProperties.find((property) => property.rentId === rentId);
      if (restoredProperty) {
        setProperties((prev) =>
          prev.map((property) =>
            property.rentId === rentId
              ? { ...property, status: restoredProperty.originalStatus || 'active' }
              : property
          )
        );

        const updatedRemoved = removedProperties.filter((p) => p.rentId !== rentId);
        setRemovedProperties(updatedRemoved);
        localStorage.setItem('removedProperties', JSON.stringify(updatedRemoved));
      }
    }
  } catch (error) {
    setMessage("Error restoring photo request.");
  }
};





  const navigate = useNavigate();


  return (
    <div style={{ maxWidth: '500px', margin: 'auto', fontFamily: 'Inter, sans-serif' }}>
      <Tab.Container activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
        <Row className="g-3">
          <Col lg={12} className="d-flex flex-column align-items-center">
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
         </button> <h3 className="m-0" style={{fontSize:"18px"}}>MY ADDRESS REQUESTS </h3> </div>


            <Nav variant="tabs" className="mb-3" style={{ width: '100%' }}>
              <Nav.Item style={{ flex: '1' }}>
                <Nav.Link eventKey="All" style={{ backgroundColor: '#4F4B7E', color: 'white', textAlign: 'center' }}>
                  All
                </Nav.Link>
              </Nav.Item>
              <Nav.Item style={{ flex: '1' }}>
                <Nav.Link eventKey="removed" style={{ backgroundColor: '#FFFFFF', color: 'grey', textAlign: 'center' }}>
                  Removed
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="All">

                
                  {loading ? (
    <div
      className="text-center my-4"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <span className="spinner-border text-primary" role="status" />
      <p className="mt-2">Loading properties...</p>
    </div>
  ) : properties.length > 0 ? (
                <PhotoRequestOwner properties={properties} onRemove={handleRemoveProperty} />

  ) : (
    <div
      className="text-center my-4"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <img src={NoData} alt="No Data" width={100} />
      <p>No properties found.</p>
    </div>
  )
}
                {/* Only show properties with status other than "deleted" */}
              </Tab.Pane>
              <Tab.Pane eventKey="removed">
                {/* Display removed properties */}
                {
  loading ? (
    <div
      className="text-center my-4"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <span className="spinner-border text-primary" role="status" />
      <p className="mt-2">Loading properties...</p>
    </div>
  ) : removedProperties.length > 0 ? (
    <RemovedProperties
      removedProperties={removedProperties}
      onUndo={handleUndoRemove}
    />
  ) : (
    <div
      className="text-center my-4"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <img src={NoData} alt="No Data" width={100} />
      <p>No properties found.</p>
    </div>
  )
}

              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

         {/* Message Alert */}
         {message.text && (
            <div className="col-12">
              <div className={`alert alert-${message.type} w-100`}>{message.text}</div>
            </div>
          )}

    </div>
  );
};

export default App;












