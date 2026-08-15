








import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MdCall } from 'react-icons/md';
import profil from '../../Assets/xd_profile.png'
import {  FaCalendarAlt, FaChevronLeft } from "react-icons/fa";
import { Button, Modal } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import NoData from "../../Assets/OOOPS-No-Data-Found.png";

const FavoriteBuyer = () => {
  const location = useLocation();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const [phoneNumber] = useState(storedPhoneNumber);  const [favorites, setFavorites] = useState([]);
  const [removedFavorites, setRemovedFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("all");
  const [showFullNumber, setShowFullNumber] = useState(false);
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
          viewedFile: "Owner ShortList",
          viewTime: new Date().toISOString(),
        });
      } catch (err) {
      }
    };
  
    if (phoneNumber) {
      recordDashboardView();
    }
  }, [phoneNumber]);

  
const handlePayNow = (rentId, user) => {
  navigate("/pricing-plans", {
    state: {
      phoneNumber: user.phoneNumber,
      rentId,
    },
  });
};


const handleCallClick = async (rentId, userPhone) => {
    try {
      // Make API call to record the contact
      await axios.post(`${process.env.REACT_APP_API_URL}/contact-send-property`, {
        userPhone: userPhone,
        postedUserPhone: phoneNumber,
        rentId: rentId,
        status: "contactSend"
      });

      // Open phone dialer
      window.location.href = `tel:${userPhone}`;
    } catch (error) {
      console.error("Error recording contact:", error);
      // Still allow the call even if API fails
      window.location.href = `tel:${userPhone}`;
    }
  };


  const handleFavoriteCall = async (rentId, favoriteUser) => {
    // confirmAction("Do you want to call this user?", async () => {

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/contact-rent`,{
        rentId,
        phoneNumber: favoriteUser,
      });
      setMessage({ text: "Favorite contact logged.", type: "success" });
    } catch (error) {
      setMessage({ text: "Failed to log favorite contact.", type: "error" });
    }
  //   setShowPopup(false);
  // });
};  

  const confirmAction = (message, action) => {
    setPopupMessage(message);
    setPopupAction(() => action);
    setShowPopup(true);
  };
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteProperties")) || [];
    const storedRemovedFavorites = JSON.parse(localStorage.getItem("removedFavoriteProperties")) || [];
    setFavorites(storedFavorites);
    setRemovedFavorites(storedRemovedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem("favoriteProperties", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("removedFavoriteProperties", JSON.stringify(removedFavorites));
  }, [removedFavorites]);


  useEffect(() => {
  if (!phoneNumber) {
    setLoading(false);
    return;
  }

  const fetchData = async () => {
    try {
      setLoading(true);

      // 🔹 Step 1: Fetch favorite buyer requests
      const favoriteRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/get-favorite-buyer-rent`,
        { params: { postedPhoneNumber: phoneNumber } }
      );

      // 🔹 Step 2: Fetch PayU payment status
      const statusRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/payustatus-users`
      );

      if (favoriteRes.status === 200 && statusRes.status === 200) {
        // 🔹 Step 3: Build PayU status map
        const statusMap = {};
        statusRes.data.forEach(({ rentId, status }) => {
          if (rentId) statusMap[rentId] = status;
        });

        // 🔹 Step 4: Sort favorites by latest updatedAt or createdAt
        const rawFavorites = favoriteRes.data.favoriteRequestsData || [];
        const sortedFavorites = rawFavorites.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt) -
            new Date(a.updatedAt || a.createdAt)
        );

        // 🔹 Step 5: Enrich each favorite with payuStatus + propertyMessage
        const enrichedFavorites = await Promise.all(
          sortedFavorites.map(async (fav) => {
            let propertyMessage = null;
            try {
              const msgRes = await axios.get(
                `${process.env.REACT_APP_API_URL}/user/property-message/${fav.rentId}`
              );
              propertyMessage = msgRes.data?.data?.message || null;
            } catch {
              propertyMessage = null;
            }

            return {
              ...fav,
              payuStatus: statusMap[fav.rentId] || "unpaid",
              propertyMessage,
            };
          })
        );

        // 🔹 Step 6: Update state and cache
        setFavorites(enrichedFavorites);
        localStorage.setItem("favoriteProperties", JSON.stringify(enrichedFavorites));
      }
    } catch (error) {
      console.error("Error fetching favorites or payment statuses:", error);
      // setMessage({ text: "Failed to fetch favorites.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [phoneNumber]);




// useEffect(() => {
//   if (!phoneNumber) {
//     setLoading(false);
//     return;
//   }
//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       // 🔹 Step 1: Fetch favorite buyer requests
//       const favoriteRes = await axios.get(`${process.env.REACT_APP_API_URL}/get-favorite-buyer-rent`, {
//         params: { postedPhoneNumber: phoneNumber },
//       });

//       // 🔹 Step 2: Fetch PayU payment status
//       const statusRes = await axios.get(`${process.env.REACT_APP_API_URL}/payustatus-users`);

//       if (favoriteRes.status === 200 && statusRes.status === 200) {
//         // 🔹 Step 3: Build PayU status map
//         const statusMap = {};
//         statusRes.data.forEach(({ rentId, status }) => {
//           if (rentId) statusMap[rentId] = status;
//         });

//         // 🔹 Step 4: Sort favorites by latest updatedAt or createdAt
//         const rawFavorites = favoriteRes.data.favoriteRequestsData || [];
//         const sortedFavorites = rawFavorites.sort(
//           (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
//         );

//         // 🔹 Step 5: Merge payuStatus into each favorite
//         const finalFavorites = sortedFavorites.map((fav) => ({
//           ...fav,
//           payuStatus: statusMap[fav.rentId] || "unpaid",
//         }));

//         // 🔹 Step 6: Update state and cache
//         setFavorites(finalFavorites);
//         localStorage.setItem("favoriteProperties", JSON.stringify(finalFavorites));
//       }
//     } catch (error) {
//       console.error("Error fetching favorites or payment statuses:", error);
//       // You can setMessage if needed for feedback
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, [phoneNumber]);
  

  const handleRemoveFavorite = async (rentId, favoriteUser) => {
    confirmAction("Are you sure you want to remove this favorite request?", async () => {

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/favorite/delete/${rentId}/${favoriteUser}`);
      const updatedFavorites = favorites.map((property) =>
        property.rentId === rentId
          ? { ...property, favoritedUsersPhoneNumbers: property.favoritedUsersPhoneNumbers.filter((user) => user !== favoriteUser) }
          : property
      );
      setFavorites(updatedFavorites);
      setRemovedFavorites([...removedFavorites, { rentId, favoriteUser }]);
    } catch (error) {
      setMessage({ text: "Error removing favorite request.", type: "error" });
    }
    setShowPopup(false);
  });
  };

  const handleUndoRemove = async (rentId, favoriteUser) => {
    confirmAction("Do you want to restore this favorite request?", async () => {

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/favorite/undo/${rentId}/${favoriteUser}`);
      setRemovedFavorites(removedFavorites.filter((item) => item.favoriteUser !== favoriteUser));
      setFavorites((prev) =>
        prev.map((property) =>
          property.rentId === rentId
            ? { ...property, favoritedUsersPhoneNumbers: [...property.favoritedUsersPhoneNumbers, favoriteUser] }
            : property
        )
      );
      setMessage({ text: "Favorite request restored successfully!", type: "success" });
    } catch (error) {
      setMessage({ text: "Error restoring favorite request.", type: "error" });
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

  const validRemovedFavorites = removedFavorites.filter(property => property.favoriteUser);


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
        <h3 className="m-0" style={{ fontSize: "18px" }}>SHORTLISTED BUYERS</h3>
      </div>

      {/* Tabs */}
      <div className="row g-2 w-100">
        <div className="col-6 p-0">
          <button className="w-100 p-2 border-0"
            style={{ backgroundColor: activeTab === "all" ? '#4F4B7E' : '#FFFFFF', color: activeTab === "all" ? 'white' : 'grey', width: "100%" }}
            onClick={() => setActiveTab("all")}
          >
            All Favorites
          </button>
        </div>
        <div className="col-6 p-0">
          <button className="w-100 p-2 border-0"
            style={{ backgroundColor: activeTab === "removed" ? '#4F4B7E' : '#FFFFFF', color: activeTab === "removed" ? 'white' : 'grey', width: "100%" }}
            onClick={() => setActiveTab("removed")}
          >
            Removed Requests
          </button>
        </div>
      </div>

      {/* Feedback Message */}
      {message && <p style={{ color: message.type === "success" ? "green" : "red" }}>{message.text}</p>}

      {/* Confirmation Modal */}
      <Modal show={showPopup} onHide={() => setShowPopup(false)}>
        <Modal.Body>
          <p>{popupMessage}</p>
          <Button style={{ background: "#4F4B7E", width: "80px", fontSize: "13px", border: "none" }} onClick={popupAction}>Yes</Button>
          <Button className="ms-3" style={{ background: "#FF0000", width: "80px", fontSize: "13px", border: "none" }} onClick={() => setShowPopup(false)}>No</Button>
        </Modal.Body>
      </Modal>

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center my-4" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <span className="spinner-border text-primary" role="status" />
          <p className="mt-2">Loading properties...</p>
        </div>
      ) : activeTab === "all" ? (
        favorites.length > 0 ? (
          favorites.map((property, propertyIndex) => (
            property.favoritedUsersPhoneNumbers.map((user, userIndex) => (
              <div key={`${property.rentId}-${user}`} className="card p-2 w-100 mb-3">
                <div className="row d-flex align-items-center">
                  <div className="col-3 d-flex justify-content-center">
                    <img src={profil} alt="Profile" className="rounded-circle" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                  </div>
                  <div className="p-0" style={{ background: "#707070", width: "2px", height: "80px" }}></div>
                  <div className="col-7 p-0 ms-4">
                    <div className="text-center rounded-1 w-100 mb-1" style={{ border: "2px solid #4F4B7E", color: "#4F4B7E", fontSize: "13px" }}>FAVORITE BUYER</div>
                    <p className="mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>RENT ID : {property.rentId}</p>

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
                    <h5 style={{ fontSize: "16px", fontWeight: "500" }}>{property.propertyType || "N/A"} | {property.state || "N/A"}</h5>
                  </div>
                </div>

                <div className="px-2 mt-2">
                  <div className="d-flex align-items-center mb-2">
                    <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                    {/* <div>
                      <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Buyer Phone</h6>
                      {property.payuStatus === "paid" ? (

                        
                        <span
                          style={{ color: "#1D1D1D", cursor: "pointer" }}
                          onClick={async () => {
                            if (!showFullNumber[`${propertyIndex}-${userIndex}`]) return;
                            await handleFavoriteCall(property.rentId, user);
                            window.location.href = `tel:${user}`;
                          }}
                        >
                          {showFullNumber[`${propertyIndex}-${userIndex}`]
                            ? user
                            : user?.slice(0, 5) + "*****"}
                        </span>
                      ) : (
                        <span style={{ color: "#999" }}>Hidden</span>
                      )}
                    </div> */}
                    <div>
  <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Buyer Phone</h6>

  <span
    style={{
      color: property.payuStatus === "paid" ? "#1D1D1D" : "#999",
      cursor: property.payuStatus === "paid" ? "pointer" : "default"
    }}
    onClick={async () => {
      if (property.payuStatus !== "paid") return;
      if (!showFullNumber[`${propertyIndex}-${userIndex}`]) return;
      await handleFavoriteCall(property.rentId, user); // ⬅️ Updated rentId ➝ rentId if needed
      window.location.href = `tel:${user}`;
    }}
  >
    {property.payuStatus === "paid"
      ? user
      : user?.slice(0, 5) + "*****"}
  </span>
</div>

                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                    <div>
                      <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>Favorite Requested Date</h6>
                     
<span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500"}}>    {
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

         
                    </div>
                  </div>

                  {/* Action Buttons */}
                {property.payuStatus === "paid" ? (
                      !showFullNumber[`${propertyIndex}-${userIndex}`] ? (
                        <button
                          className="w-100 m-0 p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowFullNumber(prev => ({ 
                              ...prev, 
                              [`${propertyIndex}-${userIndex}`]: true 
                            }));
                          }}
                          style={{ 
                            background: "#4F4B7E", 
                            color: "white", 
                            border: "none", 
                            borderRadius: "5px" 
                          }}
                        >
                          View
                        </button>
                      ) : (
                        <div className="d-flex justify-content-between mt-2">
                          <button
                            className="btn text-white px-3 py-1"
                            style={{ background: "#4F4B7E", fontSize: "13px" }}
                            onClick={async (e) => {
                              e.stopPropagation();
                              await handleCallClick(property.rentId, user);
                            }}
                          >
                            Call
                          </button>
                          <button
                            className="btn text-white px-3 py-1"
                            style={{ background: "#FF0000", fontSize: "13px" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFavorite(property.rentId, user);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      )
                    ) : (
                      <div className="d-flex justify-content-between mt-2">
                        <button
                          className="btn text-white px-3 py-1 w-100 me-1"
                          style={{ background: "#FFB100", fontSize: "13px" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePayNow(property.rentId, user);
                          }}
                        >
                          Pay Now
                        </button>
                        <button
                          className="btn text-white px-3 py-1 w-100"
                          style={{ background: "#FF0000", fontSize: "13px" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFavorite(property.rentId, user);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                </div>
              </div>
            ))
          ))
        ) : (
          <div className="text-center my-4" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <img src={NoData} alt="" width={100} />
            <p>No properties found.</p>
          </div>
        )
      ) : (
        validRemovedFavorites.length > 0 ? (
          validRemovedFavorites.map((property, index) => (
            <div key={property.rentId} className="card p-2 w-100 mb-3">
            

  <div
            key={property.rentId}
            className="card p-2 w-100 w-md-50 w-lg-33"
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "15px",
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
                <div className='text-center rounded-1 w-100 mb-1' style={{border:"2px solid #4F4B7E", color:"#4F4B7E", fontSize:"14px"}}>FAVORITE BUYER</div>
                <div className="d-flex">
                  <p className="mb-1" style={{ color: "#474747", fontWeight: "500",fontSize:"12px" }}>
                  Rent Id- {property.rentId}
                  </p>
                </div>    
      
                <h5 className="mb-1" style={{ color: "#474747", fontWeight: "500",fontSize:"16px" }}>
                  {property.propertyMode || "N/A"} |{property.propertyType || "N/A"}
                </h5>
             
              </div>
            </div>
      
            <div className="p-1">
      
              <div className="d-flex align-items-center mb-2">
              <div className="d-flex  flex-column align-items-start justify-content-between ps-3">
      
                <div className="d-flex align-items-center mb-4">
                  <FaCalendarAlt color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                  <div>
                    <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>
                      Favorite Requested Date
                    </h6>
                    <span className="card-text" style={{ color: "#1D1D1D", fontWeight:"500"}}>
                      {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}

                    </span>
         </div>
                </div>
                <div className="d-flex align-items-center mb-1">
                  <MdCall color="#4F4B7E" style={{ fontSize: "20px", marginRight: "8px" }} />
                  <div>
                    <h6 className="m-0 text-muted" style={{ fontSize: "11px" }}>
                       Buyer Phone
                    </h6>
                    <span className="card-text" style={{  fontWeight:"500"}}>
                    <a href={`tel:${property.favoriteUser}`} style={{ textDecoration: "none", color: "#1D1D1D" }}>
          {showFullNumber
            ? property.favoriteUser
            : property.favoriteUser?.slice(0, 5) + "*****"}
        </a>
                    </span>
                  </div>
                </div>
                </div>
                          </div>
              {/* {!showFullNumber && ( */}
          <button className='w-100 m-0 p-1'
            style={{ background:  "#4F4B7E", width: "80px", fontSize: "13px" }}
                   onClick={(e) => 
                   { e.stopPropagation();
                    handleUndoRemove(property.rentId, property.favoriteUser)}}
                   onMouseOver={(e) => {
                    e.target.style.background = "#32cd32"; // Brighter neon on hover
                    e.target.style.fontWeight = 600; // Brighter neon on hover
                    e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#39ff14"; // Original orange
                    e.target.style.fontWeight = 400; // Brighter neon on hover
          
                  }}>
            UNDO
          </button>
      
            </div>
          </div>


            </div>
          ))
        ) : (
          <div className="text-center my-4" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <img src={NoData} alt="" width={100} />
            <p>No removed properties found.</p>
          </div>
        )
      )}
    </div>
  </div>
);

};

export default FavoriteBuyer;



