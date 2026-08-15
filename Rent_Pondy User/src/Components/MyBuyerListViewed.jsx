



import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdOutlineCall,
  MdOutlineMapsHomeWork,
  MdCalendarMonth,
  MdOutlineBed,
} from "react-icons/md";
import { RiStairsLine } from "react-icons/ri";
import { GoHome } from "react-icons/go";
import { TfiLocationPin } from "react-icons/tfi";
import profil from "../Assets/xd_profile.png";
import NoData from "../Assets/OOOPS-No-Data-Found.png";
import maxrupe from "../Assets/Price maxi-01.png";
import minrupe from "../Assets/Price Mini-01.png";
import { FaArrowLeft, FaChevronLeft } from "react-icons/fa";


export default function MyBuyerListViewed() {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollContainerRef = useRef(null);
  const iconContainerRef = useRef(null);

  // Grab phoneNumber
  const storedPhoneNumber =
    location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const [phoneNumber] = useState(storedPhoneNumber);

  // Data states
  const [assistanceData, setAssistanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState("");
  const [selectedBaId, setSelectedBaId] = useState("");
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
  // Record dashboard view
  useEffect(() => {
    if (!phoneNumber) return;
    axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
      phoneNumber,
      viewedFile: "Buyer Lists",
      viewTime: new Date().toISOString(),
    });
  }, [phoneNumber]);

  // Fetch viewed BA IDs then their details
  // useEffect(() => {
  //   const fetchViewedAndDetails = async () => {
  //     try {
  //       const viewsRes = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/get-buyer-assist-views`,
  //         { params: { phoneNumber } }
  //       );
  //       if (!viewsRes.data.success) {
  //         setError("Could not load your viewed records.");
  //         return;
  //       }
  //       const viewedList = viewsRes.data.views; // array of { ba_id, viewedAt, ... }
  //       if (viewedList.length === 0) {
  //         setAssistanceData([]);
  //         return;
  //       }
  //       const detailPromises = viewedList.map(v =>
  //         axios.get(
  //           `${process.env.REACT_APP_API_URL}/fetch-buyerAssistance-rent/${v.Ra_Id}`
  //         )
  //       );
  //       const detailResponses = await Promise.all(detailPromises);
  //       const combined = viewedList.map(v => {
  //         const match = detailResponses.find(r => r.data.data.Ra_id === v.Ra_Id);
  //         return { ...match.data.data, viewedAt: v.viewedAt };
  //       });
  //       combined.sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt));
  //       setAssistanceData(combined);
  //     } catch (err) {
  //       console.error(err);
  //       setError("Error loading viewed list.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (phoneNumber) fetchViewedAndDetails();
  //   else {
  //     setLoading(false);
  //     setError("No phone number found.");
  //   }
  // }, [phoneNumber]);
useEffect(() => {
  const fetchViewedAndDetails = async () => {
    try {
      const viewsRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/get-buyer-assist-views`,
        { params: { phoneNumber } }
      );

      if (!viewsRes.data.success) {
        setError("Could not load your viewed records.");
        return;
      }

      const viewedList = viewsRes.data.views; // [{ Ra_Id, viewedAt, ... }]
      if (viewedList.length === 0) {
        setAssistanceData([]);
        return;
      }

      // Fetch details for each viewed item
      const detailPromises = viewedList.map(v =>
        axios
          .get(`${process.env.REACT_APP_API_URL}/fetch-buyerAssistance-rent/${v.Ra_Id}`)
          .catch(() => null)
      );

      const detailResponses = await Promise.all(detailPromises);

      const combined = viewedList.map(v => {
        const match = detailResponses.find(
          r => r && (r.data?.data?.Ra_Id === v.Ra_Id || r.data?.data?.ba_id === v.Ra_Id)
        );
        return match
          ? { ...match.data.data, viewedAt: v.viewedAt }
          : { Ra_Id: v.Ra_Id, viewedAt: v.viewedAt };
      });

      combined.sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt));
      setAssistanceData(combined);
    } catch (err) {
      console.error(err);
      setError("Error loading viewed list.");
    } finally {
      setLoading(false);
    }
  };

  if (phoneNumber) fetchViewedAndDetails();
  else {
    setLoading(false);
    setError("No phone number found.");
  }
}, [phoneNumber]);

  // Confirm Call popup
  const handleConfirmCall = (phone, Ra_Id) => {
    setSelectedPhone(phone);
    setSelectedBaId(Ra_Id);
    setShowPopup(true);
  };
  const handlePopupResponse = async confirmed => {
    setShowPopup(false);
    if (!confirmed) return;
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/contact-buyer-send`, {
        phoneNumber: selectedPhone,
        Ra_Id: selectedBaId,
      });
      setMessage("Contact request sent! Calling now...");
      window.location.href = `tel:${selectedPhone}`;
    } catch {
      setMessage("Failed to send contact request.");
    }
  };

  // Auto-clear message
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(t);
  }, [message]);

  // Scroll handlers
  const handleWheelScroll = e => {
    e.preventDefault();
    scrollContainerRef.current.scrollTop += e.deltaY;
  };
  const handleIconScroll = e => {
    e.preventDefault();
    iconContainerRef.current.scrollLeft += e.deltaX || e.deltaY;
  };

  return (
    <div className="container d-flex align-items-center justify-content-center p-0">
      <div
        className="d-flex flex-column align-items-center justify-content-center m-0"
        style={{
          maxWidth: "500px",
          width: "100%",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Sticky Header with Back Arrow */}
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
          <h3 className="m-0" style={{ fontSize: "18px" }}>
          My Tenant List Viewed 
          </h3>
        </div>

        {/* Main Scrollable List */}
        {/* <div
          className="d-flex flex-column w-100"
          style={{
            padding: "10px",
            gap: "15px",
            overflowY: "auto",
            height: "calc(100vh - 80px)",
          }}
          onWheel={handleWheelScroll}
          ref={scrollContainerRef}
        > */}

         <div
      className="scroll-container d-flex flex-column w-100"
      style={{
        padding: "10px",
        gap: "15px",
        overflowY: "hidden",            // always-on scrollbar
        height: "calc(100vh - 80px)",
      }}
      onWheel={handleWheelScroll}
      ref={scrollContainerRef}
    >

      {/* Inline scrollbar styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Chrome, Safari, Edge, Opera */
            .scroll-container::-webkit-scrollbar {
              width: 8px;
            }
            .scroll-container::-webkit-scrollbar-track {
              background: transparent;
            }
            .scroll-container::-webkit-scrollbar-thumb {
              background-color: #bbb;
              border-radius: 4px;
            }

            /* Firefox */
            .scroll-container {
              scrollbar-width: thin;
              scrollbar-color: #bbb transparent;
            }
          `,
        }}
      />

  
          {message && (
            <div className="alert alert-success text-center">{message}</div>
          )}

          {loading ? (
            // <div className="text-center my-4">
            //   <span className="spinner-border" role="status" />
            //   <p>Loading your viewed list…</p>
            // </div>
                   <div className="text-center my-4"
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000
    }}>
    <span className="spinner-border text-primary" role="status" />
    <p className="mt-2">Loading your viewed list…</p>
  </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : assistanceData.length === 0 ? (
            <div className="text-center my-4"
              style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
          
                }}>
              <img src={NoData} alt="No data" width={100} />
              <p>No viewed Tenant Assistance records.</p>
            </div>
          ) : (
            assistanceData.map(card => (
              <div
                key={card._id}
                className="card p-2"
                style={{ background: "#F9F9F9" }}
              >
                <div className="d-flex align-items-center">
                  <img
                    src={profil}
                    alt="Profile"
                    className="rounded-circle"
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: "cover",
                      marginRight: 12,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">RA ID: {card.Ra_Id}</small>
                      <small className="text-muted">
                        <MdCalendarMonth size={14} />{" "}
                        {new Date(card.viewedAt).toLocaleDateString()}
                      </small>
                    </div>
                    <h5 style={{ fontSize: 16, margin: 0 }}>
                      {card.raName || "N/A"}{" "}
                      <small className="text-muted">| Tenant</small>
                    </h5>
                  </div>
                </div>

                <div className="d-flex mt-2">
                  <small className="me-3 d-flex align-items-center">
                    <img src={minrupe} width={12} className="me-1" />
                    {card.minPrice}
                  </small>
                  <small className="d-flex align-items-center">
                    <img src={maxrupe} width={12} className="me-1" />
                    {card.maxPrice}
                  </small>
                </div>

                <div
                  className="d-flex overflow-auto mt-2 p-1"
                  style={{ border: "1px solid #4F4B7E" }}
                  ref={iconContainerRef}
                  onWheel={handleIconScroll}
                >
                  <div className="me-3 d-flex align-items-center">
                    <GoHome size={14} color="#4F4B7E" className="me-1" />
                    <small>{card.propertyMode}</small>
                  </div>
                  <div className="me-3 d-flex align-items-center">
                    <MdOutlineMapsHomeWork
                      size={14}
                      color="#4F4B7E"
                      className="me-1"
                    />
                    <small>{card.propertyType}</small>
                  </div>
                  <div className="me-3 d-flex align-items-center">
                    <MdCalendarMonth
                      size={14}
                      color="#4F4B7E"
                      className="me-1"
                    />
                    <small>{card.paymentType}</small>
                  </div>
                  <div className="me-3 d-flex align-items-center">
                    <MdOutlineBed size={14} color="#4F4B7E" className="me-1" />
                    <small>{card.bedrooms} BHK</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <RiStairsLine
                      size={14}
                      color="#4F4B7E"
                      className="me-1"
                    />
                    <small>{card.propertyAge}</small>
                  </div>
                </div>

                <p className="mt-2 mb-1" style={{ fontSize: 14 }}>
                  <TfiLocationPin
                    size={16}
                    color="#4F4B7E"
                    className="me-1"
                  />
                  {card.area}, {card.city}
                </p>

                <div className="d-flex align-items-center justify-content-between mt-2">
                  <div className="d-flex align-items-center">
                    <MdOutlineCall
                      color="#4F4B7E"
                      size={16}
                      className="me-1"
                    />
                    <small>{card.phoneNumber || "N/A"}</small>
                  </div>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() =>
                      handleConfirmCall(card.phoneNumber, card.Ra_id)
                    }
                  >
                    Call Tenant
                  </button>
                  
<button
  className="btn text-white px-3 py-1 mx-1"
  style={{ background: "#4F4B7E", fontSize: "13px" }}
  onMouseOver={(e) => {
    e.target.style.background = "#029bb3"; // Brighter neon on hover
    e.target.style.fontWeight = 600; // Brighter neon on hover
    e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover

  }}
  onMouseOut={(e) => {
    e.target.style.background = "#4F4B7E"; // Original orange
    e.target.style.fontWeight = 400; // Brighter neon on hover

  }}
  onClick={() => navigate(`/my-buyer-list-viewed-detail/${card.Ra_Id}`)}

>
  More
</button>
                </div>
              </div>
            ))
          )}

          {showPopup && (
            <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center">
              <div className="bg-white p-4 rounded">
                <h6>Call this Tenant?</h6>
                <div className="d-flex justify-content-between mt-3">
                  <button
                    className="btn btn-success"
                    onClick={() => handlePopupResponse(true)}
                  >
                    Yes
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handlePopupResponse(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
