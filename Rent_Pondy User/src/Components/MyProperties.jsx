



import React, { useState, useEffect } from "react";
import { FaRulerCombined, FaBed, FaCalendarAlt, FaUserAlt, FaRupeeSign, FaArrowLeft, FaChevronLeft } from "react-icons/fa";
import { Button, Nav, Tab, Row, Col, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import './MyProperty.css';
import EditForm from "./EditForm";
import { getActiveBase, baseToPath } from "../utils/cityBase";
import AddProps from "./AddProps"; 
import ConfirmationModal from "./ConfirmationModal";
import calendar from '../Assets/Calender-01.png'
import bed from '../Assets/BHK-01.png'
import Floorr from '../Assets/floor.PNG'
import postedby from '../Assets/Posted By-01.png'
import indianprice from '../Assets/Indian Rupee-01.png'
import NoData from "../Assets/OOOPS-No-Data-Found.png";
import ExpiredPlans from "./ExpiredPlans";
import { motion } from 'framer-motion';
import pic from '../Assets/Mask Group 3@2x.png'; // Correct path
import totalarea from '../Assets/total_area.png'

const MyProperties = () => {
  const location = useLocation();
  const { phoneNumber: statePhoneNumber} = location.state || {};
  const storedPhoneNumber = localStorage.getItem('phoneNumber');
  const [loading, setLoading] = useState(true);

  const phoneNumber = statePhoneNumber || storedPhoneNumber;

  const [activeKey, setActiveKey] = useState("property");
  const [propertyUsers, setPropertyUsers] = useState([]);
  const [removedUsers, setRemovedUsers] = useState([]);
  const [editData, setEditData] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [rentId, setrentId] = useState(null);
  const [message, setMessage] = useState("");
  const [modalData, setModalData] = useState({ show: false, action: null, payload: null, message: "" });
  const [hover, setHover] = useState(false);
  const [hoverDelete, setHoverDelete] = useState(false);
  const [hoverEdit, setHoverEdit] = useState(false);
  const [properties,setProperties]= useState('');
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
// const [payUStatusMap, setPayUStatusMap] = useState({});

// useEffect(() => {
//   const fetchPayUStatuses = async () => {
//     try {
//       const res = await axios.get(`${process.env.REACT_APP_API_URL}/payustatus-users`);
//       const map = {};
//       res.data.forEach(({ rentId, status }) => {
//         map[rentId] = status;
//       });
//       setPayUStatusMap(map);
//     } catch (error) {
//       console.error('Error fetching PayU statuses:', error);
//     }
//   };

//   fetchPayUStatuses();
// }, []);

const fetchPropertyData = async (phone) => {
  setLoading(true);
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-status-with-payment-rent`, {
      params: { phoneNumber: phone }
    });

    const apiData = response.data?.data;
    if (Array.isArray(apiData)) {
      const sorted = apiData.sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      );
      setPropertyUsers(sorted);
    } else {
      setPropertyUsers([]);
    }
  } catch (error) {
    console.error("Error fetching property data:", error);
    setPropertyUsers([]);
  } finally {
    setLoading(false);
  }
};



  // // ✅ Fetch listed properties
  // const fetchPropertyData = async (phone) => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-status-with-payment`, {
  //       params: { phoneNumber: phone }
  //     });

  //     const apiData = response.data?.data;
  //     if (Array.isArray(apiData)) {
  //       const sorted = apiData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  //       setPropertyUsers(sorted);
  //     } else {
  //       setPropertyUsers([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching property data:", error);
  //     setPropertyUsers([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ✅ Fetch removed properties
  // const fetchDeletedProperties = async (phone) => {
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-delete-status`, {
  //       params: { phoneNumber: phone }
  //     });
  //     if (Array.isArray(response.data?.users)) {
  //       setRemovedUsers(response.data.users);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching deleted properties:", error);
  //   }
  // };

  useEffect(() => {
    if (phoneNumber) {
      fetchPropertyData(phoneNumber);
      fetchDeletedProperties(phoneNumber);
    }
  }, [activeKey, phoneNumber]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // const handleModalConfirm = () => {
  //   const { action, payload } = modalData;
  //   // Placeholder logic
  //   setMessage(`Action confirmed: ${action} on ${payload}`);
  //   setModalData({ show: false, action: null, payload: null, message: "" });
  // };

  // const handleModalCancel = () => {
  //   setModalData({ show: false, action: null, payload: null, message: "" });
  // };

  // const confirmDelete = (rentId) => {
  //   setModalData({
  //     show: true,
  //     action: "delete",
  //     payload: rentId,
  //     message: "Are you sure you want to delete this property?"
  //   });
  // };

  // const confirmEdit = (user) => {
  //   setModalData({
  //     show: true,
  //     action: "edit",
  //     payload: user,
  //     message: "Do you want to edit this property?"
  //   });
  // };

const fetchRemovedData = () => {
  if (phoneNumber) {
    fetchDeletedProperties(phoneNumber);
  }
};

useEffect(() => {
  if (activeKey === "removed") {
    fetchRemovedData(); // ✅ Now it will call the actual API
  }
}, [activeKey]);



  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000); // Auto-close after 3 seconds
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [message]);

  const handleModalConfirm = () => {
    const { action, payload } = modalData;
  
    if (action === "delete") handleDelete(payload);
    else if (action === "undo") handleUndo(payload);
    else if (action === "edit") handleEdit(payload);
  
    setModalData({ show: false, action: null, payload: null, message: "" });
  };
  
  const handleModalCancel = () => {
    setModalData({ show: false, action: null, payload: null, message: "" });
  };
  
  const confirmDelete = (rentId) => {
    setModalData({
      show: true,
      action: "delete",
      payload: rentId,
      message: "Are you sure you want to delete this property?"
    });
  };
  
  const confirmUndo = (rentId) => {
    setModalData({
      show: true,
      action: "undo",
      payload: rentId,
      message: "Are you sure you want to undo the deletion?"
    });
  };
  
  const confirmEdit = (user) => {
    setModalData({
      show: true,
      action: "edit",
      payload: user,
      message: "Do you want to edit this property?"
    });
  };
  

  useEffect(() => {
    if (activeKey === "property" && phoneNumber) {
      fetchPropertyData(phoneNumber);
      fetchDeletedProperties(phoneNumber);
    }
  }, [activeKey, phoneNumber]);

  const fetchDeletedProperties = async (phoneNumber) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-delete-status-rent`, {
        params: { phoneNumber },
      });

      if (response.status === 200) {
        setRemovedUsers(response.data.users);
      }
    } catch (error) {
      // setMessage("Error fetching deleted properties.");
    } finally {
      setLoading(false);
    }
  };


  // const fetchPropertyData = async (phoneNumber) => {
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-status`, {
  //       params: { phoneNumber },
  //     });
  
  //     if (response.status === 200) {
  //       const sortedUsers = response.data.users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  //       setPropertyUsers(sortedUsers);
  //     }
  //   } catch (error) {
  //     // setMessage("Error fetching property data.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
          phoneNumber: phoneNumber,
          viewedFile: "MyProperty",
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
  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users`);
      const allProperties = response.data.users;

      // Sort by createdAt in descending order (newest first)
      // const sortedProperties = allProperties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const sortedProperties =allProperties.sort(
  (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
);

      setProperties(sortedProperties);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  fetchProperties();
}, []);

  const handleDelete = async (rentId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/delete-property-rent`, {
        rentId,
        phoneNumber,
      });

      console.log("🔍 Delete Response:", response.data);
      console.log("📊 Response Status:", response.status);
      console.log("📬 Response Message:", response.data.message);

      // Check if response indicates success
      if (response.status === 200 || response.data.success === true || response.data.message?.includes("removed")) {
        setMessage("Property deleted successfully!");
        
        // ✅ Send WhatsApp Property Removal Notification
        try {
          const deletedProperty = response.data.user || { rentId, ownerName: "Owner" };
          const mobileNumber = String(phoneNumber).replace(/\D/g, "");
          const to = mobileNumber.length === 10 ? `91${mobileNumber}` : mobileNumber;

          const location = [deletedProperty.nagar, deletedProperty.area, deletedProperty.city, deletedProperty.district, deletedProperty.state]
            .filter((v) => v !== null && v !== undefined && v !== "")
            .map(val => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase())
            .join(", ") || "N/A";

          console.log("📱 Sending WhatsApp to:", to);

          if (to.length >= 12) {
            const whatsappResponse = await axios.post(`${process.env.REACT_APP_API_URL}/queue-message`, {
              to,
              category: "property-removal",
              data: {
                ownerName: deletedProperty.ownerName || "Owner",
                rentId: deletedProperty.rentId || rentId,
                propertyType: deletedProperty.propertyType,
                location,
                status: deletedProperty.displayStatus,
              },
            });
            console.log("✅ WhatsApp queued:", whatsappResponse.data);
          } else {
            console.log("⚠️ Invalid phone number:", to);
          }
        } catch (whatsErr) {
          console.error("⚠️ WhatsApp error:", whatsErr);
        }

        setPropertyUsers((prev) => prev.filter((user) => user.rentId !== rentId));
        if (response.data.user) {
          setRemovedUsers((prev) => [...prev, { ...response.data.user }]);
        }
      } else {
        const errorMsg = response.data.message || "Failed to remove property. Please try again.";
        setMessage(errorMsg);
        console.error("❌ Property removal failed:", errorMsg);
      }
    } catch (error) {
      console.error("🔴 Full Error Object:", error);
      console.error("🔴 Error Response:", error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || "Error deleting property.";
      setMessage(errorMessage);
      console.error("❌ Error deleting property:", errorMessage);
    }
  };

  const handleUndo = async (rentId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/undo-delete-rent`, {
        rentId,
        phoneNumber,
      });

      console.log("🔍 Undo Response:", response.data);
      console.log("📊 Response Status:", response.status);
      console.log("📬 Response Message:", response.data.message);

      // Check if response indicates success
      if (response.status === 200 || response.data.success === true || response.data.message?.includes("reverted")) {
        setMessage("Property status reverted successfully!");
        
        // ✅ Send WhatsApp Property Restoration Notification
        try {
          const restoredProperty = response.data.user || { rentId, ownerName: "Owner" };
          const mobileNumber = String(phoneNumber).replace(/\D/g, "");
          const to = mobileNumber.length === 10 ? `91${mobileNumber}` : mobileNumber;

          const location = [restoredProperty.nagar, restoredProperty.area, restoredProperty.city, restoredProperty.district, restoredProperty.state]
            .filter((v) => v !== null && v !== undefined && v !== "")
            .map(val => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase())
            .join(", ") || "N/A";

          console.log("📱 Sending WhatsApp to:", to);

          if (to.length >= 12) {
            const whatsappResponse = await axios.post(`${process.env.REACT_APP_API_URL}/queue-message`, {
              to,
              category: "property-undo-removal",
              data: {
                ownerName: restoredProperty.ownerName || "Owner",
                rentId: restoredProperty.rentId || rentId,
                propertyType: restoredProperty.propertyType,
                location,
                status: restoredProperty.displayStatus,
              },
            });
            console.log("✅ WhatsApp queued:", whatsappResponse.data);
          } else {
            console.log("⚠️ Invalid phone number:", to);
          }
        } catch (whatsErr) {
          console.error("⚠️ WhatsApp error:", whatsErr);
        }

        setRemovedUsers((prev) => prev.filter((user) => user.rentId !== rentId));
        if (response.data.user) {
          setPropertyUsers((prev) => [...prev, { ...response.data.user }]);
        }
      } else {
        // Error: Property not restored
        const errorMsg = response.data.message || "Failed to restore property. Please try again.";
        setMessage(errorMsg);
        console.error("❌ Property restoration failed:", errorMsg);
      }
    } catch (error) {
      console.error("🔴 Full Error Object:", error);
      console.error("🔴 Error Response:", error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || "Error undoing property status.";
      setMessage(errorMessage);
      console.error("❌ Error undoing property status:", errorMessage);
    }
  };

  const handleEdit = (user) => {
    setEditData({ 
      rentId: user.rentId || "",  
      phoneNumber: user.phoneNumber || ""  
    }); 
  };

  const handleCloseEditForm = () => {
    setEditData(null); 
  };

 

  const handleAddProperty = async () => {
    if (!phoneNumber) {
      setMessage('Missing phone number or country code.');
      return;
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/store-data`, {
        phoneNumber: `${phoneNumber}`,
      });
  
      if (response.status === 201) {
        setrentId(response.data.rentId);
        setMessage(`User added successfully! RENT-ID: ${response.data.rentId}`);
      }
    } catch (error) {
      setMessage('Error adding user. Please try again.');
    }
  
    // Move this line outside the try-catch block to ensure the form opens
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };
  const navigate = useNavigate();
const handleCardClick = (rentId) => {
  navigate(`/detail/${rentId}`);
};

const handlePayNow = (user) => {
  console.log("Pay Now clicked for:", user.rentId, "Status:", user.status);
  
  try {
    console.log("Navigating to pricing-plans with phoneNumber:", user.phoneNumber, "rentId:", user.rentId);
    navigate("/pricing-plans", {
      state: {
        phoneNumber: user.phoneNumber,
        rentId: user.rentId,
      },
      replace: false
    });
  } catch (error) {
    console.error("Navigation error:", error);
    setMessage("Error navigating to payment page. Please try again.");
  }
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
const itemStyle = {
  flex: 1,
  textAlign: 'center',
  fontWeight: '500',
  border: '1px solid #ddd',
  borderBottom: 'none',
  cursor: 'pointer',
};

  const linkStyle = (key) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    borderRadius: "0px",
    fontSize: "14px",
    padding: "8px",
    backgroundColor: activeKey === key ? '#4F4B7E' : 'transparent', // ✅ Active tab background
    color: activeKey === key ? '#fff' : '#555', // Optional: different text color
  });
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
    <Container fluid className="p-0 m-0 d-flex align-items-center justify-content-center" style={{ width: "100%", overflowY: 'auto'}}>
              <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', margin: 'auto', width: '100%' ,fontFamily: 'Inter, sans-serif'}}>
       <div className="d-flex align-items-center justify-content-start w-100 p-2" 
           style={{
      background: "#EFEFEF",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        opacity: isScrolling ? 0 : 1,
        pointerEvents: isScrolling ? "none" : "auto",
        transition: "opacity 0.3s ease-in-out",
      }}
      >
         <button
               className="d-flex align-items-center justify-content-center ps-3 pe-2"
      onClick={() => navigate(baseToPath(getActiveBase()))}
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
            </button> <h3 className="m-0" style={{fontSize:"18px"}}>MyProperty</h3> </div>
         

      {editData ? (
          (() => {
    navigate(`/edit-property/${editData.rentId}/${editData.phoneNumber}`);
    return null;
  })()
  // <EditForm rentId={editData.rentId} phoneNumber={editData.phoneNumber} onClose={handleCloseEditForm} />
) : showAddForm ? (
  (() => {
    navigate('/add-property');
    return null; // Prevent rendering component
  })()) : (
  // Other content here

       <Tab.Container activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
         
          <Row className="g-3 w-100">
          
            <Col lg={12} className="p-1 d-flex flex-column align-items-center">
            
      <Nav variant="tabs" className="mb-1 d-flex flex-row w-100 flex-nowrap">
        <Nav.Item style={itemStyle}>
          <Nav.Link eventKey="property" style={linkStyle("property")}>
            Property
          </Nav.Link>
        </Nav.Item>
        <Nav.Item style={itemStyle}>
          <Nav.Link eventKey="removed" style={linkStyle("removed")}>
            Removed
          </Nav.Link>
        </Nav.Item>
        <Nav.Item style={itemStyle}>
          <Nav.Link eventKey="expired" style={linkStyle("expired")}>
            Expired
          </Nav.Link>
        </Nav.Item>
        <Nav.Item style={itemStyle}>
          <Nav.Link
            eventKey="add-prop"
            style={linkStyle("add-prop")}
            onClick={() => {
              setActiveKey("add-prop");
              setShowAddForm(true);
            }}
          >
            Add Property
          </Nav.Link>
        </Nav.Item>
      </Nav>


              <div>
      {message && <div className="alert text-success text-bold">{message}</div>}
      {/* Your existing component structure goes here */}
    </div>


    <ConfirmationModal
  show={modalData.show}
  message={modalData.message}
  onConfirm={handleModalConfirm}
  onCancel={handleModalCancel}
/>


 <Tab.Content className="pt-3 w-100">
            <Tab.Pane eventKey="property">
              {loading ? (
                  <div className="text-center my-4"
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000
    }}>
    <span className="spinner-border text-primary" role="status" />
    <p className="mt-2">Loading properties...</p>
  </div>
              ) : propertyUsers.length > 0 ? (
                propertyUsers.map((user) => {
                  const isPaid = user.payustatususer?.toString().toLowerCase() === "paid";
                  return (
                  <div
                    key={user.rentId}
                    className={`row g-0 rounded-4 mb-2 property-card ${isPaid ? "paid-card" : "pending-card"}`}
                    style={{ position: "relative", overflow: "hidden" }}
                    onClick={() => handleCardClick(user.rentId)}
   >
                    {/* Payment Stamp */}
                    <span className={`payment-stamp ${isPaid ? "paid" : "pending"}`}>{isPaid ? "Paid" : "Pending"}</span>
                    {/* Image Column */}
                    <div className="col-md-4 col-4 d-flex flex-column align-items-center">
                      <div className="text-white py-1 px-2 w-100 text-center" style={{ background: "#4F4B7E" }}>
                        Rent_Id- {user.rentId}
                      </div>
                      <div style={{ position: "relative", width: "100%", height: "180px" }}>
                        <img
                         src={
    user.photos && user.photos.length > 0
      ? `https://rentpondy.com/PPC/${user.photos[0].replace(/\\/g, "/").replace(/^\/+/, "")}`
      : pic
  }
  alt={(
    `${user.rentId || 'N/A'}-${user.propertyMode || 'N/A'}-${user.propertyType || 'N/A'}-rs-${user.price || '0'}
    -in-${user.city || ''}-${user.area || ''}-${user.state || ''}`
  )
    .replace(/\s+/g, "-")
    .replace(/,+/g, "-")
    .toLowerCase()
  }
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <div style={{
                          position: "absolute",
                          bottom: 0,
                          width: "100%",
                          background: "#5a52b3",
                          color: "#fff",
                          textAlign: "center"
                        }}>
                          {user.payustatususer === "paid" && 
                           (user.displayStatus?.toLowerCase() === "preapproved" || 
                            user.displayStatus?.toLowerCase() === "pre_approved")
                            ? "Approved"
                            : user.displayStatus || "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Details Column */}
                    <div className="col-md-8 col-8 p-2" style={{ background: "#FAFAFA" }}>
                      {/* <p className="m-0 text-dark fw-bold">{user.propertyType || "N/A"}</p>
                      <p style={{ fontSize: "13px", color: "#5E5E5E" }}>
                        {[user.area, user.city, user.state].filter(Boolean).join(", ") || "N/A, N/A"}
                      </p>

                      <div className="d-flex flex-wrap mt-2">
                        <div className="me-3"><img src={totalarea} width={12} alt="area" /> {user.totalArea || "N/A"} {user.areaUnit || ""}</div>
                        <div className="me-3"><img src={bed} width={12} alt="bed" /> {user.bedrooms || "N/A"}</div>
                        <div className="me-3"><img src={postedby} width={12} alt="posted" /> {user.postedBy || "N/A"}</div>
                        <div><img src={calendar} width={12} alt="calendar" /> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</div>

                      </div>


                      <h6 className="mt-2 text-primary">
                        <img src={indianprice} width={10} alt="price" className="me-1" />
                        ₹{user.price || "N/A"} <small className="text-muted ms-2">Negotiable</small>
                      </h6> */}

                  <div className="d-flex justify-content-start"><p className="m-0" style={{ color:'#5E5E5E' , fontWeight:500 , fontSize:"13px"}}>{user.propertyMode
                   ? user.propertyMode.charAt(0).toUpperCase() + user.propertyMode.slice(1)
                   : 'N/A'}
                 </p> 
                           </div>
                            <p className="fw-bold m-0 " style={{ color: "#000000", fontSize:"15px" }}>{user.propertyType 
                   ? user.propertyType.charAt(0).toUpperCase() + user.propertyType.slice(1) 
                   : 'N/A'}
                 </p>
                  <p
                   className="m-0"
                   style={{ color: "#5E5E5E", fontWeight: 500, fontSize: "13px" }}
                 >
                   {(() => {
                     const locs = [ user.nagar, user.area, user.city, user.district, user.state ]
                       .filter((v) => v !== null && v !== undefined && v !== "");
                 
                     if (locs.length === 0) {
                       // All null/empty — show two N/A
                       return <>N/A, N/A</>;
                     }
                 
                     // Show first 3 valid values, capitalized, separated by commas
                     return locs.slice(0, 3).map((val, idx, arr) => (
                       <span key={idx}>
{val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()}                          {idx < arr.length - 1 ? ", " : ""}
                       </span>
                     ));
                   })()}
                 </p>
                            <div className="card-body ps-2 m-0 pt-0 pe-2 pb-0 d-flex flex-column justify-content-center">
                              <div className="row">
                                <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1">
                                  <img src={Floorr} alt="" width={12} className="me-2"/>
                                  <span style={{ fontSize:'13px', color:'#5E5E5E' , fontWeight:500 }}>
                                    {user.floorNo
                   ? user.floorNo.charAt(0).toUpperCase() + user.floorNo.slice(1)
                   : 'N/A'}
                 
                                   
                                  </span>
                                </div>

                                    
                                <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
                                  {/* <FaBed className="me-2" color="#4F4B7E"/> */}
                                  <img src={bed} alt="" width={12} className="me-2"/>
                                  <span style={{ fontSize:'13px', color:'#5E5E5E' ,fontWeight: 500 }}>{user.bedrooms || 'N/A'} BHK</span>
                                </div>
                                <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
                 {/* <FaUserAlt className="me-2" color="#4F4B7E"/> */}
                 <img src={totalarea} alt="" width={12} className="me-2"/>
                   <span style={{ fontSize:'13px', color:'#5E5E5E' , fontWeight:500 }}>{user.totalArea || 'N/A'} {user.areaUnit
  ? user.areaUnit.charAt(0).toUpperCase() + user.areaUnit.slice(1)
  : 'N/A'}
                 </span>
               </div>
  <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
  <img src={calendar} alt="" width={12} className="me-2" />
  <span style={{ fontSize:'13px', color:'#5E5E5E', fontWeight: 500 }}>
    {/* {
      user.updatedAt && user.updatedAt !== user.createdAt
        ? ` ${new Date(user.updatedAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}`
        : ` ${new Date(user.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}`
    } */}
    {
  user.updatedAt && user.updatedAt !== user.createdAt
    ? ` ${new Date(user.updatedAt).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // shows AM/PM
      })}`
    : ` ${new Date(user.createdAt).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}`
}

  </span>
</div>
                                
                                {/* <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
                                  <img src={calendar} alt="" width={12} className="me-2"/>
                                   <span style={{ fontSize:'13px', color:'#5E5E5E' ,fontWeight: 500 }}>
                                   {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                                                                      year: 'numeric',
                                                                      month: 'short',
                                                                      day: 'numeric'
                                                                    }) : 'N/A'}
                                   </span>
                                </div> */}
                                <div className="col-12 d-flex flex-col align-items-center mt-1 mb-1 ps-1">
                                 <h6 className="m-0">
                                 <span style={{ fontSize:'15px', color:'#4F4B7E', fontWeight:600, letterSpacing:"1px" }}> 
                                   {/* <FaRupeeSign className="me-2" color="#4F4B7E"/> */}
                                   <img src={
                                     indianprice
                                   } alt="" width={8}  className="me-2"/>
                                   {/* {property.price ? property.price.toLocaleString('en-IN') : 'N/A'} */}
                                    {user.rentalAmount
                           ? formatPrice(user.rentalAmount)
                           : 'N/A'}
                                 </span> 
               <span style={{ color: '#4F4B7E', fontSize: '13px', marginLeft: "5px", fontSize: '11px' }}>
                            / {user.rentType || "N/A"}
                           </span>
                                   </h6>
                                </div>          
                                <div className="me-3 mt-2" style={{
                                  color: user.payustatususer === "paid" ? "#0F9F2C" : "#FF0000",
                                  fontWeight: 500
                                }}>
                                  {user.payustatususer === "paid" ? "Payment Paid" : "Payment Pending"}
                                </div>
</div></div>

                      <div className="mt-2 d-flex justify-content-around">
                        <button
                                className="btn btn-sm"

                             style={{
          background: '#FF0000',
          color: '#fff',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.background = "#ff1e00"; // Brighter neon on hover
          e.target.style.fontWeight = 600; // Brighter neon on hover
          e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
        }}
        onMouseOut={(e) => {
          e.target.style.background = "#FF0000"; // Original orange
          e.target.style.fontWeight = 400; // Brighter neon on hover

        }}
                  onClick={(e) => {
        e.stopPropagation(); // prevent card click
        confirmDelete(user.rentId);
      }}
          // onClick={() => confirmDelete(user.rentId)}
          >Remove</button>

         <button
        className="btn btn-sm"
                      style={{
          background: '#3660FF',
          color: '#fff',
          width: '30%',
          transition: 'all 0.3s ease',
          border:"1px solid #3660FF"
        }}
        onMouseOver={(e) => {
           e.target.style.color = "#3660FF";
          e.target.style.background = "white"; // Brighter neon on hover
          e.target.style.fontWeight = 600; // Brighter neon on hover
          e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
        }}
        onMouseOut={(e) => {
          e.target.style.color = "#fff"; 
          e.target.style.background = "#3660FF"; // Original orange
          e.target.style.fontWeight = 400; // Brighter neon on hover
}}
          onClick={(e) => {
        e.stopPropagation(); // prevent card click
        confirmEdit(user);
      }}
        //  onClick={() => confirmEdit(user)}
         >Edit</button>
                        {/* {user.payustatususer !== "paid" && (
                          <button
                            className="btn btn-sm btn-warning text-white"
                            onClick={() => navigate("/add-plan", { state: { phoneNumber: user.phoneNumber, rentId: user.rentId } })}
                          >
                            Pay Now
                          </button>
                        )} */}

                       {(user.displayStatus?.toLowerCase() === "pre_approved" || 
                         user.displayStatus?.toLowerCase() === "preapproved" || 
                         user.displayStatus?.toLowerCase() === "expired") && 
                         user.payustatususer !== "paid" && (
  <button
        className="btn btn-sm"
       style={{
            background: '#0F9F2C',
            color: '#fff',
            width: '30%',
            transition: 'all 0.3s ease',
          }}
           onMouseOver={(e) => {
            e.target.style.background = "#307F4D";
            e.target.style.fontWeight = 600;
            e.target.style.transition = "background 0.3s ease";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#0F9F2C";
            e.target.style.fontWeight = 400;
          }}
    onClick={(e) => {
              e.stopPropagation();
              handlePayNow(user);
    }}
  >
    Pay Now
  </button>
)}


                      </div>
                    </div>
                  </div>
                );})              ) : (
                <div className="text-center my-4"
                 style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                
                  }}>
                  <img src={NoData} width={100} alt="No Data" />
                  <p>No properties found.</p>
                </div>
              )}
            </Tab.Pane>

            
<Tab.Pane eventKey="removed">
                {removedUsers.length > 0 ? (
                  removedUsers.map((user) => (

<div 
className="row g-0 rounded-4 mb-2"
style={{
  border: "1px solid #ddd",
  overflow: "hidden",
  background: "#EFEFEF",
}}
onClick={() => handleCardClick(user.rentId)}

>
<div className="col-md-4 col-4 d-flex flex-column justify-content-between align-items-center">
  <div
    className="text-white py-1 px-2 text-center"
    style={{ width: "100%", background: "#4F4B7E" }}
  >
    RENT_ID- {user.rentId}
  </div>

  <div style={{ position: "relative", width: "100%", height: "180px" }}>
    <img
                          src={
    user.photos && user.photos.length > 0
      ? `https://rentpondy.com/PPC/${user.photos[0].replace(/\\/g, "/").replace(/^\/+/, "")}`
      : pic
  }
  alt={(
    `${user.rentId || 'N/A'}-${user.propertyMode || 'N/A'}-${user.propertyType || 'N/A'}-rs-${user.price || '0'}
    -in-${user.city || ''}-${user.area || ''}-${user.state || ''}`
  )
    .replace(/\s+/g, "-")
    .replace(/,+/g, "-")
    .toLowerCase()
  }
      className="img-fluid"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />

    <div>
    <div className="d-flex justify-content-between w-100 text-center" style={{ position: "absolute",
          bottom: "0px" , background: '#5a52b3', color: '#fff'}}>
        
            <span className="w-100 text-center"> {user.displayStatus}  </span>

      </div>
    </div>
  </div>
</div>

<div className="col-md-8 col-8 " style={{paddingLeft:"10px", paddingTop:"7px" ,background:"#FAFAFA"}}>
          <div className="d-flex justify-content-start"><p className="m-0" style={{ color:'#5E5E5E' , fontWeight:500 }}>{user.propertyMode
  ? user.propertyMode.charAt(0).toUpperCase() + user.propertyMode.slice(1)
  : 'N/A'}
</p> 
          </div>
           <p className="fw-bold m-0 " style={{ color:'#000000' }}>{user.propertyType 
  ? user.propertyType.charAt(0).toUpperCase() + user.propertyType.slice(1) 
  : 'N/A'}
</p>
         <p
  className="m-0"
  style={{ color: "#5E5E5E", fontWeight: 500, fontSize: "13px" }}
>
  {(() => {
    const locs = [ user.nagar, user.area, user.city, user.district, user.state ]
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
           <div className="card-body ps-2 m-0 pt-0 pe-2 pb-0 d-flex flex-column justify-content-center" >
             <div className="row">
               <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1">
                 {/* <FaRulerCombined className="me-2" color="#4F4B7E" /> */}
                 <img src={Floorr} alt="" width={12} className="me-2"/>
                 <span style={{ fontSize:'13px', color:'#5E5E5E' , fontWeight:500 }}>
                  {/* {user.totalArea || 'N/A'} {user.areaUnit
  ? user.areaUnit.charAt(0).toUpperCase() + user.areaUnit.slice(1)
  : 'N/A'} */}
        {user.floorNo
                   ? user.floorNo.charAt(0).toUpperCase() + user.floorNo.slice(1)
                   : 'N/A'}
                  
                 </span>
               </div>
               <div className="col-6 d-flex align-items-center mt-1 mb-1">
                 {/* <FaBed className="me-2" color="#4F4B7E"/> */}
                 <img src={bed} alt="" width={12} className="me-2"/>
                 <span style={{ fontSize:'13px', color:'#5E5E5E' ,fontWeight: 500 }}>{user.bedrooms || 'N/A'} BHK </span>
               </div>
                       <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
                 {/* <FaUserAlt className="me-2" color="#4F4B7E"/> */}
                 <img src={totalarea} alt="" width={12} className="me-2"/>
                   <span style={{ fontSize:'13px', color:'#5E5E5E' , fontWeight:500 }}>{user.totalArea || 'N/A'} {user.areaUnit
  ? user.areaUnit.charAt(0).toUpperCase() + user.areaUnit.slice(1)
  : 'N/A'}
                 </span>
               </div>
               <div className="col-6 d-flex align-items-center mt-1 mb-1">
                 <img src={calendar} alt="" width={12} className="me-2"/>
                  <span style={{ fontSize:'13px', color:'#5E5E5E' ,fontWeight: 500 }}>
                  {/* {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                                                     year: 'numeric',
                                                     month: 'short',
                                                     day: 'numeric'
                                                   }) : 'N/A'} */}
             {
  user.updatedAt && user.updatedAt !== user.createdAt
    ? ` ${new Date(user.updatedAt).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // shows AM/PM
      })}`
    : ` ${new Date(user.createdAt).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}`
}
     </span>
               </div>
               <div className="col-12 d-flex flex-col align-items-center mt-1 mb-1 ps-1">
                <h6 className="m-0">
                <span style={{ fontSize:'15px', color:'#4F4B7E', fontWeight:600, letterSpacing:"1px" }}> 
                  {/* <FaRupeeSign className="me-2" color="#4F4B7E"/> */}
                  <img src={
                    indianprice
                  } alt="" width={8}  className="me-2"/>
     {user.rentalAmount
          ? formatPrice(user.rentalAmount)
          : 'N/A'}                 </span> 
          <span style={{ color: '#4F4B7E', fontSize: '13px', marginLeft: "5px", fontSize: '11px' }}>
                            / {user.rentType || "N/A"}
                           </span>
                  </h6>
               </div>
                                         <div className="d-flex justify-content-center mt-2">

      <button
        className="btn btn-sm"
        style={{
          background: '#4F4B7E',
          color: '#fff',
          width: '40%',
          marginLeft: '8px',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.background = "#413b8a"; // Brighter neon on hover
          e.target.style.fontWeight = 600; // Brighter neon on hover
          e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
        }}
        onMouseOut={(e) => {
          e.target.style.background = "#4F4B7E"; // Original orange
          e.target.style.fontWeight = 400; // Brighter neon on hover

        }}
      onClick={(e) => {
        e.stopPropagation();
        confirmUndo(user.rentId);
      }}
        // onClick={() => confirmUndo(user.rentId)}
      >
        Undo
      </button>


                              </div>
              </div>
            </div>
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
                <p>No Removed Property Data Found.</p>
                </div> 
               
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="expired">
                <ExpiredPlans />

              </Tab.Pane>

              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      )}
      </div>
    </Container>
</motion.div>
  );
};

export default MyProperties;






























