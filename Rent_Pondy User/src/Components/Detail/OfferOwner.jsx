




import React, { useState, useEffect } from "react";
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






const App = () => {
  const [offers, setOffers] = useState([]); // Active properties
  const [removedOffers, setRemovedOffers] = useState([]); // Removed properties
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeKey, setActiveKey] = useState("All");
  const location = useLocation();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const [phoneNumber] = useState(storedPhoneNumber);  const [localProperties, setLocalProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [confirmation, setConfirmation] = useState({
    show: false,
    message: "",
    onConfirm: () => {},
  });

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
            viewedFile: "Offer Owner",
            viewTime: new Date().toISOString(),
          });
        } catch (err) {
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
  
      return () => clearTimeout(timer); // Cleanup timeout when component re-renders
    }
  }, [message]);
  // Load offers and removedOffers from localStorage on page load
  useEffect(() => {
    const storedOffers = JSON.parse(localStorage.getItem("offers")) || [];
    const storedRemovedOffers = JSON.parse(localStorage.getItem("removedOffers")) || [];

    setOffers(storedOffers);
    setRemovedOffers(storedRemovedOffers);
  }, []);

  // Persist changes to localStorage whenever offers or removedOffers change
  useEffect(() => {
    localStorage.setItem("offers", JSON.stringify(offers));
    localStorage.setItem("removedOffers", JSON.stringify(removedOffers));
  }, [offers, removedOffers]);

 
//   useEffect(() => {
//     const fetchOffers = async () => {
//       if (!phoneNumber) return;
  
//       setLoading(true);
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/offers/owner/${phoneNumber}`);
//         if (response.status === 200) {
//           const fetchedOffers = response.data.offers || [];
  
//           // Sort the offers by createdAt (new to old)
//           // const sortedOffers = fetchedOffers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
// const sortedOffers =fetchedOffers.sort(
//   (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
// );


//           setOffers(sortedOffers); // Set sorted offers
//         } else {
//           setMessage({ text: "No owners found for this offer user.", type: "danger" });
//         }
//       } catch (error) {
//         setMessage({ text: "No Offer Properties Found", type: "error" });
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchOffers();
//   }, [phoneNumber]); 
  

useEffect(() => {
  const fetchOffers = async () => {
    if (!phoneNumber) return;

    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/offers/owner/${phoneNumber}`);
      if (response.status === 200) {
        const fetchedOffers = response.data.offers || [];

        // 🔁 Enrich each offer with property message using rentId
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
              propertyMessage,
            };
          })
        );

        // 🔽 Sort by updatedAt or createdAt (desc)
        const sortedOffers = enrichedOffers.sort(
          (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        );

        setOffers(sortedOffers);
      } else {
        setMessage({ text: "No owners found for this offer user.", type: "danger" });
      }
    } catch (error) {
      setMessage({ text: "No Offer Properties Found", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  fetchOffers();
}, [phoneNumber]);



 const handleRemoveProperty = async (rentId, buyerPhoneNumber) => {
    showConfirmation("Are you sure you want to remove this offer?", async () => {
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
      // setShowPopup(false);
    });
  };

  const handleUndoRemove = async (rentId, buyerPhoneNumber) => {
    showConfirmation("Do you want to restore this offer?", async () => {
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
      // setShowPopup(false);
    });
  };


  

  // useEffect(() => {
  //   setProperties([...properties]); // Trigger re-render
  // }, [properties]);
  useEffect(() => {
    setProperties((prev) => [...prev]); // This ensures React detects a change
  }, [localProperties]);
  
  
  const showConfirmation = (message, onConfirm) => {
    setConfirmation({
      show: true,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmation({ ...confirmation, show: false }); // hide after confirm
      },
    });
  };
      
  // Filter active and removed properties
  const activeProperties = offers.filter((property) => property.status !== "delete");
  const removedProperties = removedOffers;
  const navigate = useNavigate();

  
  return (
    <div className="container d-flex align-items-center justify-content-center p-0">
      <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', margin: 'auto', width: '100%' }}>
        {/* Buttons for filtering */}
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
<h3 className="m-0 ms-3" style={{fontSize:"20px"}}>  MY OFFERS</h3> </div>
        <div className="row g-2 w-100">
          <div className="col-6 p-0">
            <button className="w-100 p-2 border-0" style={{ backgroundColor: '#4F4B7E', color: 'white' }} onClick={() => setActiveKey("All")}>
              All Properties
            </button>
          </div>
          <div className="col-6 p-0">
            <button className="w-100 p-2 border-0" style={{ backgroundColor: '#FF0000', color: 'white' }} onClick={() => setActiveKey("Removed")}>
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
      </div>              ) : activeKey === "All" ? (
                <PropertyList properties={activeProperties} onRemove={handleRemoveProperty} 
                    />
              ) : (
                <PropertyList properties={removedProperties} onUndo={handleUndoRemove} />
              )}
            </div>
          </div>
        </div>
        <ConfirmationModal
        show={confirmation.show}
        message={confirmation.message}
        onClose={() => setConfirmation({ ...confirmation, show: false })}
        onConfirm={confirmation.onConfirm}
      />
      </div>
    </div>
  );
};
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
      marginLeft: '10px'
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h5>Confirmation</h5>
        <p>{message}</p>
        <div style={styles.buttons}>
          <button
            style={styles.yes}
            onClick={onConfirm}
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
            Yes
          </button>
          <button
            style={styles.no}
            onClick={onClose}
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
            No
          </button>
        </div>
      </div>
    </div>
  );
};
const PropertyList = ({ properties, onRemove, onUndo, onAccept, onReject }) => {
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
</div>  ) : (
    <div className="row m-0 w-100">
      {properties.map((property) => (
        <div className="col-12 mb-1 p-0" key={property.rentId}>
          <PropertyCard
            property={property}
            onRemove={onRemove}
            onUndo={onUndo}
            onAccept={onAccept}
            onReject={onReject}
          />
        </div>
      ))}
    </div>
  );
};


const PropertyCard = ({ property, onRemove, onUndo, onAccept, onReject }) => {
  const [activeButton, setActiveButton] = useState(property.status || null);
 const navigate = useNavigate();
  const [modal, setModal] = useState({ show: false, type: "", property: null }); 

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
      
  
  const handleCardClick = () => {

    if (property?.rentId) {
      navigate(`/detail/${property.rentId}`);
    }
  };
  
  const [finalContactNumber, setFinalContactNumber] = useState(null);


    
  
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
  


  
  return (
    <div>
    {message && <p style={{ color: message.type === "success" ? "green" : "red" }}>{message.text}</p>}

    <div className="row g-0 rounded-4 mb-2" style={{ border: '1px solid #ddd', overflow: "hidden", background: "#EFEFEF" }}
      onClick={handleCardClick}
    >      {/* Left Column - Image & PUC ID */}
      <div className="col-md-4 col-4 d-flex flex-column align-items-center">
        <div className="text-white py-1 px-2 text-center" style={{ width: "100%", background: "#4F4B7E" }}>
          RENT ID- {property.rentId || "N/A"}
        </div>

      
 <div style={{ position: "relative", width: "100%", height:'190px'}}>
            <img
                                        src={property.photos?.length ? `https://rentpondy.com/PPC/${property.photos[0]}` : pic}
                                        alt="Property"
                                        className="img-fluid"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover',  backgroundSize: "cover",
                                          backgroundPosition: "center",
                                          backgroundRepeat: "no-repeat", }}
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

      {/* Right Column - Property Details */}
      <div className="col-md-8 col-8" style={{paddingLeft:"10px", background:"#F5F5F5"}}>
      <div className="d-flex justify-content-between">
          <p className="m-0" style={{ color: "#5E5E5E" , fontSize:"13px"}}>{property.propertyMode || "N/A"}</p>

         {property.propertyMessage && (
    <span 
      className=" mt-2" 
      style={{
        color: "#FF0000",
        fontWeight: "bold",
        fontSize: "12px"
      }}
    >
      {property.propertyMessage}
    </span>
  )}

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
            }}         
            onClick={(e) => {
              e.stopPropagation(); // 👈 prevents parent click
              onRemove(property.rentId, property.buyerPhoneNumber);
            }}               >Remove</p>
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
            }}          
            onClick={(e) => {
              e.stopPropagation(); // 👈 prevents parent click
              onUndo(property.rentId, property.buyerPhoneNumber);
            }}            >Undo</p>
          )}
        </div>

        <p className="fw-bold m-0" style={{ color: "#000000" , fontSize:"15px"}}>{property.propertyType || "N/A"}</p>
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
</p>
        {/* Icons and Details */}
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
       property.updatedAt && property.updatedAt !== property.offerDate
         ? ` ${new Date(property.updatedAt).toLocaleDateString('en-IN', {
             year: 'numeric',
             month: 'short',
             day: 'numeric'
           })}`
         : ` ${new Date(property.offerDate).toLocaleDateString('en-IN', {
             year: 'numeric',
             month: 'short',
             day: 'numeric'
           })}`
     }
   </span>
 </div>


            {/* Display Property Price */}
            <div className="col-12 d-flex flex-col align-items-center p-1">
            <h6 className="m-0">
                 <span style={{ fontSize: "17px", color: "#4F4B7E", fontWeight: "bold", letterSpacing: "1px" }}>
<img
                src={indianprice}
                alt=""
                width={8}
                className="me-2"
                style={{ marginRight: "6px" }}
              />                                  {property.originalPrice ? property.originalPrice : "N/A"}
                                </span>
<span style={{ color: '#4F4B7E', fontSize: '13px', marginLeft: "5px", fontSize: '11px' }}>
                       / {property.rentType || "N/A"}
                      </span>              </h6>
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

       

          {/* Accept/Reject Buttons */}

 <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
          <span style={{ color: property.status === "accept" ? "green" : "red" }}>{property.status}</span>
       </div>
        </div>
      </div>
      <div className="col-12 " style={{ border:"2px solid #4F4B7E", borderRadius:"0px 0px 50px 50px", overflow:'hidden'}}>   {property.offeredPrice ? (
  <div className="w-100 d-flex flex-col align-items-center justify-content-center">
    <h6 className="m-0">
      <span
        style={{
          fontSize: "17px",
          color: "#4F4B7E",
          fontWeight: "bold",
          letterSpacing: "1px",
        }}
      >
        <FaRupeeSign className="me-2" color="#4F4B7E" />
        {property.offeredPrice.toLocaleString("en-IN")}
      </span>
      <span style={{ color: "#4F4B7E", fontSize: "11px", marginLeft: "5px" }}>
        Offered Price
      </span>
    </h6>
  </div>
) : (
  <div className="w-100 d-flex flex-col align-items-center justify-content-center">
    <h6 className="m-0" style={{ color: "#FF0000" }}>
      Offered Price Not Available
    </h6>
  </div>
)}
</div>
    </div>
    </div>
  );
};

export default App;










