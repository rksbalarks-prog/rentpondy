


import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MdCall } from 'react-icons/md';
import profil from '../../Assets/xd_profile.png'
import {  FaCalendarAlt, FaChevronLeft } from "react-icons/fa";
import { Button, Modal } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import NoData from "../../Assets/OOOPS-No-Data-Found.png";

const App = () => {
  const { phoneNumber } = useParams();
  const [properties, setProperties] = useState([]);
  const [removedProperties, setRemovedProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("all"); // "all" | "removed"
  const [showFullNumber, setShowFullNumber] = useState(false);
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
    const storedProperties = JSON.parse(localStorage.getItem("soldOutProperties")) || [];
    const storedRemovedProperties = JSON.parse(localStorage.getItem("removedSoldOutProperties")) || [];

    setProperties(storedProperties);
    setRemovedProperties(storedRemovedProperties);
  }, []);
useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
          phoneNumber: phoneNumber,
          viewedFile: "Sold Out Buyer Property",
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
    localStorage.setItem("soldOutProperties", JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem("removedSoldOutProperties", JSON.stringify(removedProperties));
  }, [removedProperties]);

  

  useEffect(() => {
    if (!phoneNumber) {
      setLoading(false);
      return;
    }
  
    const fetchSoldOutProperties = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-soldout-buyer`, {
          params: { postedPhoneNumber: phoneNumber },
        });
  
        if (response.status === 200) {
          const transformedProperties = response.data.soldOutRequestsData.map((property) => ({
            ...property,
            soldOutRequesters: property.soldOutRequestersPhoneNumbers.filter(
              (user) => user && user !== "undefined"
            ),
          }));
  
          // 🔽 Sort properties from newest to oldest
          const sortedProperties = transformedProperties.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
  
          setProperties(sortedProperties);
          localStorage.setItem("soldOutProperties", JSON.stringify(sortedProperties));
        }
      } catch (error) {
        setMessage("Failed to fetch sold-out properties.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchSoldOutProperties();
  }, [phoneNumber]);
  


  const handleRemoveProperty = async (rentId, soldOutUser) => {
    // if (!window.confirm("Are you sure you want to remove this sold-out request?")) return;
    confirmAction("Are you sure you want to remove this help request?", async () => {

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/soldout/delete/${rentId}/${soldOutUser}`);

      const updatedProperties = properties.map((property) =>
        property.rentId === rentId
          ? {
              ...property,
              soldOutRequesters: property.soldOutRequesters.filter((user) => user !== soldOutUser),
            }
          : property
      );

      const removedItem = {
        rentId,
        soldOutUser,
      };

      setProperties(updatedProperties);
      setRemovedProperties([...removedProperties, removedItem]);
      setMessage({ text: "Sold-out request removed successfully!", type: "success" });

    } catch (error) {
      setMessage({ text: "Error deleting sold-out request.", type: "error" });
    }
    setShowPopup(false);
  });
  };


  const handleUndoRemove = async (rentId, soldOutUser) => {
    // if (!window.confirm("Do you want to restore this sold-out request?")) return;
    confirmAction("Do you want to restore this help request?", async () => {

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/soldout/undo/${rentId}/${soldOutUser}`);

      const restoredProperty = response.data.property;

      setRemovedProperties(removedProperties.filter((item) => item.soldOutUser !== soldOutUser));

      setProperties((prev) =>
        prev.map((property) =>
          property.rentId === rentId
            ? { ...property, soldOutRequesters: restoredProperty.soldOutReport.map(req => req.phoneNumber) }
            : property
        )
      );

      setMessage({ text: "Sold-out request restored successfully!", type: "success" });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Error restoring sold-out request.", type: "error" });
    }
    setShowPopup(false);
  });
  };
useEffect(() => {
  if (message) {
    const timer = setTimeout(() => setMessage(""), 5000); // Auto-close after 3 seconds
    return () => clearTimeout(timer); // Cleanup timer
  }
}, [message]);
const navigate = useNavigate();


  return (
    <div className="container d-flex align-items-center justify-content-center p-0">
    <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', margin: 'auto', width: '100%'  , fontFamily: 'Inter, sans-serif'}}>
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
      </button> <h3 className="m-0 " style={{fontSize:"18px"}}>SOLD OUT OWNER  </h3> </div>
<div className="row g-2 w-100">

<div className="col-6 p-0">

        <button style={{ backgroundColor: '#4F4B7E', color: 'white' , width:"100%" }} onClick={() => setActiveTab("all")} className={activeTab === "all" ? "active" : ""}>
          All Properties
        </button>
        </div>

        <div className="col-6 p-0">

        <button style={{ backgroundColor: '#FFFFFF', color: 'grey' , width:"100%" }} onClick={() => setActiveTab("removed")} className={activeTab === "removed" ? "active" : ""}>
          Removed Requests
        </button>
      </div>

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
      </div>) : activeTab === "all" ? (
  properties.length > 0 ? (
    properties.map((property) => (
      <div key={property.rentId} className="property-card">
        <div className="buyers-list">
          {Array.isArray(property.soldOutRequesters) &&
          property.soldOutRequesters.length > 0 ? (
            property.soldOutRequesters.map((user, index) => (
              <div
                key={index}
                className="card p-2 w-100  w-md-50 w-lg-33"
                onClick={() => navigate(`/detail/${property.rentId}`)}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  overflow: "hidden",
                  marginBottom: "",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                <div className="row d-flex align-items-center">
                  <div className="col-3 d-flex align-items-center justify-content-center mb-1">
                    <img
                      src={profil}
                      alt="Placeholder"
                      className="rounded-circle mt-2"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div
                    className="p-0"
                    style={{
                      background: "#707070",
                      width: "2px",
                      height: "80px",
                    }}
                  ></div>
                  <div className="col-7 p-0 ms-4">
                    <div
                      className="text-center rounded-1 w-100 mb-1"
                      style={{
                        border: "2px solid #4F4B7E",
                        color: "#4F4B7E",
                        fontSize: "13px",
                      }}
                    >
                      SOLDOUT TENANT
                    </div>
                    <div className="d-flex">
                      <p
                        className="mb-1"
                        style={{
                          color: "#474747",
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >
                        PUC- {property.rentId}
                      </p>
                    </div>

                    <h5
                      className="mb-1"
                      style={{
                        color: "#474747",
                        fontWeight: "500",
                        fontSize: "16px",
                      }}
                    >
                      {property.propertyType || "N/A"} |{property.city || "N/A"}
                    </h5>
                  </div>
                </div>

                <div className="p-1">
                  <div className="d-flex align-items-center mb-2">
                    <div className="d-flex flex-row align-items-start justify-content-between ps-3">
                      <div className="d-flex align-items-center">
                        <MdCall
                          color="#4F4B7E"
                          style={{ fontSize: "20px", marginRight: "8px" }}
                        />
                        <div>
                          <h6
                            className="m-0 text-muted"
                            style={{ fontSize: "11px" }}
                          >
                            Tenant Phone
                          </h6>
                          <span className="card-text" style={{ fontWeight: "500" }}>
                            <a
                              href={`tel:${user}`}
                              style={{
                                textDecoration: "none",
                                color: "#1D1D1D",
                              }}
                            >
                              {showFullNumber ? user : user?.slice(0, 5) + "*****"}
                            </a>
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center ms-3">
                        <FaCalendarAlt
                          color="#4F4B7E"
                          style={{ fontSize: "20px", marginRight: "8px" }}
                        />
                        <div>
                          <h6
                            className="m-0 text-muted"
                            style={{ fontSize: "11px" }}
                          >
                            Soldout Received Date
                          </h6>
               

<span className="card-text" style={{ fontWeight: "500" }}>
  <a
    href={`tel:${user}`}
    style={{
      textDecoration: "none",
      color: "#1D1D1D",
    }}
    onClick={async (e) => {
      e.preventDefault();  // Prevent the default behavior of the link
      try {
        // Make API call before dialing
        await axios.post(`${process.env.REACT_APP_API_URL}/contact`, {
          rentId: property.rentId,  // Replace with actual PPC ID if needed
          phoneNumber: user,
        });
        setMessage({ text: "Contact saved successfully", type: "success" });
      } catch (error) {
        setMessage({ text: "Something went wrong", type: "error" });
      } finally {
        // Open dialer after API call
        window.location.href = `tel:${user}`;
      }
    }}
  >
    {showFullNumber ? user : user?.slice(0, 5) + "*****"}
  </a>
</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!showFullNumber && (
                    <button
                      className="w-100 m-0 p-1"
                      onClick={(e) =>{e.stopPropagation(); setShowFullNumber(true)}}
                      style={{
                        background: "#4F4B7E",
                        color: "white",
                        border: "none",
                        marginLeft: "10px",
                        cursor: "pointer",
                        borderRadius: "5px",
                      }}
                    >
                      View
                    </button>
                  )}
                  {showFullNumber && (
                    <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
       

<button
  className="btn text-white px-3 py-1 flex-grow-1 mx-1"
  style={{
    background: "#4F4B7E",
    width: "80px",
    fontSize: "13px",
  }}
  onClick={async (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    try {
      // Make API call before dialing
      await axios.post(`${process.env.REACT_APP_API_URL}/contact`, {
        rentId: property.rentId,  // Replace with actual PPC ID if needed
        phoneNumber: user,
      });
      setMessage({ text: "Contact saved successfully", type: "success" });
    } catch (error) {
      setMessage({ text: "Something went wrong", type: "error" });
    } finally {
      // Open dialer after API call
      window.location.href = `tel:${user}`;
    }
  }}
>
  Call
</button>
                      <button
                        className="btn text-white px-3 py-1 flex-grow-1 mx-1"
                        style={{
                          background: "#FF0000",
                          width: "80px",
                          fontSize: "13px",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = "#FF6700"; // Brighter neon on hover
                          e.target.style.fontWeight = 600; // Brighter neon on hover
                          e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = "#FF4500"; // Original orange
                          e.target.style.fontWeight = 400; // Brighter neon on hover
                
                        }}
                        onClick={(e) =>{e.stopPropagation(); handleRemoveProperty(property.rentId, user)}}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : null}
        </div>
      </div>
    ))
  ) : (
    <p>No properties found.</p>
  )
) :(
   removedProperties.length > 0 ? (
  removedProperties.map((property, index) => (
   

            <div
            key={index}
            className="card p-2 w-100 w-md-50 w-lg-33"
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "10px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <div className="row d-flex align-items-center">
              <div className="col-3 d-flex align-items-center justify-content-center mb-1">
                <img
                  src={profil}
                  alt="Placeholder"
                  className="rounded-circle mt-2"
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
      
              </div>
              <div className='p-0' style={{background:"#707070", width:"2px", height:"80px"}}></div>
              <div className="col-7 p-0 ms-4">
                <div className='text-center rounded-1 w-100 mb-1' style={{border:"2px solid #4F4B7E", color:"#4F4B7E", fontSize:"14px"}}>SOLDOUT TENANT</div>
                <div className="d-flex">
                  <p className="mb-1" style={{ color: "#474747", fontWeight: "500",fontSize:"12px" }}>
                  PUC- {property.rentId}
                  </p>
                </div>    
      
                <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500",fontSize:"16px" }}>
                  {property.propertyType || "N/A"} |{property.city || "N/A"}
                </h5>
             
              </div>
            </div>
      
            <div className="p-1 mt-1">
      
              <div className="d-flex align-items-center mb-2">
              <div className="d-flex  flex-row align-items-start justify-content-between ps-3">
      
              
                <div className="d-flex align-items-center">
                  <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                  <div>
                    <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
                       Tenant Phone
                    </h6>
                    <span className="card-text" style={{  fontWeight:"500"}}>
                    <a href={`tel:${property.soldOutUser}`} style={{ textDecoration: "none", color: "#1D1D1D" }}>
          {showFullNumber
            ? property.soldOutUser
            : property.soldOutUser?.slice(0, 5) + "*****"}
        </a>
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center  ms-3">
                  <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                  <div>
                    <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
                      Souldout Received Date
                    </h6>
                    <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500"}}>
                    {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
                </div>
                          </div>
              {!showFullNumber && (
          <button className='w-100 m-0 p-1'
            onClick={(e) =>{e.stopPropagation(); setShowFullNumber(true)}}
            style={{
              background: "#4F4B7E", 
              color: "white", 
              border: "none", 
             
              marginLeft: "10px", 
              cursor: "pointer",
              borderRadius: "5px"
            }}>
            View
          </button>
        )}
          {showFullNumber
            ?  <div className="d-flex justify-content-between align-items-center ps-2 pe-2 mt-1">
          
                  <button className="btn text-white px-3 py-1 flex-grow-1 mx-1"
                    style={{ background:  "green", width: "80px", fontSize: "13px" }}
                    onClick={(e) =>{e.stopPropagation(); handleUndoRemove(property.rentId, property.soldOutUser)}}
                    onMouseOver={(e) => {
                      e.target.style.background = "#32cd32"; // Brighter neon on hover
                      e.target.style.fontWeight = 600; // Brighter neon on hover
                      e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "#39ff14"; // Original orange
                      e.target.style.fontWeight = 400; // Brighter neon on hover
            
                    }}> Undo</button>

            </div>
            : ''}
            </div>
          </div>
          ))
        ) : (
     <div className="text-center my-4 "
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
          
                }}>
        <img src={NoData} alt="" width={100}/>      
        <p>No removed properties found.</p>
        </div>         )
      )}
          </div>
          </div>

    </div>
  );
};

export default App;
