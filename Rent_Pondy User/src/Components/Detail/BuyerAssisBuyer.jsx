
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import profil from "../../Assets/xd_profile.png";
import {
  MdOutlineCall,
  MdOutlineMapsHomeWork,
  MdCalendarMonth,
  MdOutlineBed,
} from "react-icons/md";
import { RiStairsLine } from "react-icons/ri";
import { GoHome } from "react-icons/go";
import { TfiLocationPin } from "react-icons/tfi";
import maxrupe from "../../Assets/Price maxi-01.png";
import minrupe from "../../Assets/Price Mini-01.png";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaTrash, FaUndoAlt } from "react-icons/fa";
import NoData from "../../Assets/OOOPS-No-Data-Found.png";
import { Modal, Button } from "react-bootstrap";
import BuyerAssistance from "../BuyerAssistance";

const BuyerAssisBuyer = () => {
  const [allAssistanceData, setAllAssistanceData] = useState([]);
  const [removedData, setRemovedData] = useState([]);
  const [expiredData, setExpiredData] = useState([]);
  const [addedData, setAddedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("myTenant");
  const [isScrolling, setIsScrolling] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalAction, setModalAction] = useState("remove"); // "remove" or "undo"

  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const iconContainerRef = useRef(null);
  const location = useLocation();
  const storedPhoneNumber =
    location.state?.phoneNumber ||
    localStorage.getItem("phoneNumber") ||
    "";
  const [phoneNumber] = useState(storedPhoneNumber);

  // Hide header while scrolling
  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Record dashboard view
  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
          phoneNumber,
          viewedFile: "Buyer Assis Buyer",
          viewTime: new Date().toISOString(),
        });
      } catch (err) {}
    };
    if (phoneNumber) recordDashboardView();
  }, [phoneNumber]);

  // Fetch Buyer Assistance + Payment data
  useEffect(() => {
    const fetchAllAssistanceData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/buyer-assistance-with-payment-rent/${phoneNumber}`
        );

        const data = response.data.data || [];
        const sortedData = data.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt) -
            new Date(a.updatedAt || a.createdAt)
        );

        // Separate expired tenants
        const expired = sortedData.filter((item) => item.ra_status === "expired" || item.ra_status === "Expired");
        const active = sortedData.filter((item) => item.ra_status !== "expired" && item.ra_status !== "Expired");

        setAllAssistanceData(active);
        setExpiredData(expired);
      } catch (err) {
        setError("Error fetching assistance data");
      } finally {
        setLoading(false);
      }
    };
    if (phoneNumber) fetchAllAssistanceData();
  }, [phoneNumber]);

  const handlePayNow = (Ra_Id, phoneNumber) => {
    if (!Ra_Id || !phoneNumber) {
      setError("Missing Ra_Id or Phone Number");
      return;
    }
    navigate("/buyer-plan", {
      state: {
        Ra_Id,
        phoneNumber,
      },
    });
  };

  const handleEditCard = (Ra_Id) => {
    navigate(`/detail-buyer-assis/${Ra_Id}`);
  };

  const handleRemoveClick = (card) => {
    setSelectedCard(card);
    setModalAction("remove");
    setShowModal(true);
  };

  const handleUndoClick = (card) => {
    setSelectedCard(card);
    setModalAction("undo");
    setShowModal(true);
  };

  const handleAddTenantSuccess = (newTenantData) => {
    // Generate a unique Ra_Id for new tenant if not present
    const tenantWithId = {
      ...newTenantData,
      Ra_Id: newTenantData.Ra_Id || `NEW-${Date.now()}`,
      _id: `added-${Date.now()}`,
      ra_status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add to addedData state
    setAddedData((prevData) => [tenantWithId, ...prevData]);
    
    // Also add to main allAssistanceData
    setAllAssistanceData((prevData) => [tenantWithId, ...prevData]);
    
    setMessage("New tenant added successfully");
    setTimeout(() => setMessage(""), 3000);
    
    // Switch to My Tenant tab to show newly added tenant
    setActiveTab("myTenant");
  };

  const handleConfirmRemove = () => {
    if (selectedCard) {
      if (modalAction === "remove") {
        setAllAssistanceData((prevData) =>
          prevData.filter((card) => card.Ra_Id !== selectedCard.Ra_Id)
        );
        setRemovedData((prevData) => [...prevData, selectedCard]);
        setMessage("Tenant removed successfully");
      } else if (modalAction === "undo") {
        setRemovedData((prevData) =>
          prevData.filter((item) => item.Ra_Id !== selectedCard.Ra_Id)
        );
        setAllAssistanceData((prevData) => [...prevData, selectedCard]);
        setMessage("Tenant restored successfully");
      }
      setTimeout(() => setMessage(""), 3000);
    }
    setShowModal(false);
    setSelectedCard(null);
    setModalAction("remove");
  };

  const handleUndoRemove = (card) => {
    setRemovedData((prevData) =>
      prevData.filter((item) => item.Ra_Id !== card.Ra_Id)
    );
    setAllAssistanceData((prevData) => [...prevData, card]);
    setMessage("Tenant restored successfully");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleWheelScroll = (e) => {
    if (scrollContainerRef.current) {
      e.preventDefault();
      scrollContainerRef.current.scrollTop += e.deltaY;
    }
  };

  const handleIconScroll = (e) => {
    if (iconContainerRef.current) {
      e.preventDefault();
      const scrollAmount = e.deltaX || e.deltaY;
      iconContainerRef.current.scrollLeft += scrollAmount;
    }
  };

  const formatIndianNumber = (x) => {
    x = x.toString();
    const lastThree = x.slice(-3);
    const otherNumbers = x.slice(0, -3);
    return (
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
      (otherNumbers ? "," : "") +
      lastThree
    );
  };

  const formatPrice = (price) => {
    price = Number(price);
    if (isNaN(price)) return "N/A";

    if (price >= 10000000) {
      return (price / 10000000).toFixed(2) + " Cr";
    } else if (price >= 100000) {
      return (price / 100000).toFixed(2) + " Lakhs";
    } else {
      return formatIndianNumber(price);
    }
  };

  const TenantCard = ({ card, isRemoved = false }) => (
    <div
      className="card p-1 mt-1 mb-3"
      style={{ width: "100%", background: "#F9F9F9", overflow: "hidden" }}
    >
      <div className="row d-flex align-items-center">
        <div className="col-3 d-flex flex-column align-items-center justify-content-center mb-1">
          <img
            src={profil}
            alt="Profile"
            className="rounded-circle mt-2"
            style={{ width: "60px", height: "60px", objectFit: "cover" }}
          />
          <span
            className="text-center"
            style={{ color: "blue", fontSize: "11px", fontWeight: 500 }}
          >
            {card.ra_status}
          </span>
        </div>

        <div
          className="p-0"
          style={{ background: "#707070", width: "1px", height: "80px" }}
        ></div>

        <div className="col-7 p-0 ms-4">
          <div className="d-flex justify-content-between">
            <p className="m-0 text-muted" style={{ fontSize: "12px", fontWeight: "500" }}>
              RA ID: {card.Ra_Id}
            </p>
            <p className="m-0 text-muted" style={{ fontSize: "12px", fontWeight: "500" }}>
              <MdCalendarMonth size={12} className="me-2" color="#019988" />
              {new Date(card.updatedAt || card.createdAt).toLocaleDateString(
                "en-IN",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              )}
            </p>
          </div>

          <h5 className="mb-1" style={{ fontSize: "16px", color: "#000", fontWeight: "500" }}>
            {card.raName || "N/A"}{" "}
            <span className="text-muted" style={{ fontSize: "12px" }}>
              | {card.propertyMode || "Tenant"}
            </span>
          </h5>

          <div className="d-flex align-items-center justify-content-between col-8">
            <p
              className="mb-0 me-3 d-flex align-items-center"
              style={{ fontSize: "12px", fontWeight: 500 }}
            >
              <img src={minrupe} alt="min" width={13} className="me-2" />
              {formatPrice(card.minPrice)}
            </p>
            <p
              className="mb-0 d-flex align-items-center"
              style={{ fontSize: "12px", fontWeight: 500 }}
            >
              <img src={maxrupe} alt="max" width={13} className="me-2" />
              {formatPrice(card.maxPrice)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-1">
        <div
          className="d-flex align-items-center overflow-auto mb-0 p-1 rounded-1"
          style={{
            whiteSpace: "nowrap",
            minWidth: "100%",
            overflowX: "auto",
            border: "1px solid #019988",
          }}
          onWheel={handleIconScroll}
          ref={iconContainerRef}
        >
          <div className="d-flex align-items-center me-3">
            <GoHome size={12} className="me-2" color="#019988" />
            <p className="mb-0" style={{ fontSize: "12px" }}>
              {card.propertyMode || "N/A"}
            </p>
          </div>
          <div className="d-flex align-items-center me-3">
            <MdOutlineMapsHomeWork size={12} className="me-2" color="#019988" />
            <p className="mb-0" style={{ fontSize: "12px" }}>
              {card.propertyType || "N/A"}
            </p>
          </div>
          <div className="d-flex align-items-center me-3">
            <MdCalendarMonth size={12} className="me-2" color="#019988" />
            <p className="mb-0" style={{ fontSize: "12px" }}>
              {card.paymentType || "N/A"}
            </p>
          </div>
          <div className="d-flex align-items-center me-3">
            <MdOutlineBed size={12} className="me-2" color="#019988" />
            <p className="mb-0" style={{ fontSize: "12px" }}>
              {card.bedrooms || "N/A"} BHK
            </p>
          </div>
          <div className="d-flex align-items-center me-3">
            <RiStairsLine size={12} className="me-2" color="#019988" />
            <p className="mb-0" style={{ fontSize: "12px" }}>
              {card.propertyAge || "N/A"}
            </p>
          </div>
        </div>

        <div className="mb-0 mt-1">
          <p className="mb-0 fw-semibold" style={{ fontSize: "12px" }}>
            <TfiLocationPin size={16} className="me-2" color="#019988" />
            {card.area || "N/A"}, {card.city || "N/A"}
          </p>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="d-flex align-items-center">
            <MdOutlineCall color="#019988" style={{ fontSize: "12px", marginRight: "8px" }} />
            <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
              {card.phoneNumber
                ? `Buyer Phone: ${card.phoneNumber.slice(0, -5)}*****`
                : "Phone: N/A"}
            </h6>
          </div>

          <div className="d-flex gap-1">
            {!isRemoved && (
              <>
                <button
                  className="btn btn-sm text-white px-2 py-1"
                  style={{ background: "#007BFF", fontSize: "12px" }}
                  onClick={() => handleEditCard(card.Ra_Id)}
                  title="Edit tenant"
                >
                  <FaEdit size={12} className="me-1" /> Edit
                </button>

                {card.showPayNowButton && card.Ra_Id && card.phoneNumber && (
                  <button
                    className="btn btn-sm text-white px-2 py-1"
                    style={{ background: "#28A745", fontSize: "12px" }}
                    onClick={() => handlePayNow(card.Ra_Id, card.phoneNumber)}
                  >
                    <FaArrowLeft size={12} className="me-1" /> Pay Now
                  </button>
                )}

                <button
                  className="btn btn-sm text-white px-2 py-1"
                  style={{ background: "#DC3545", fontSize: "12px" }}
                  onClick={() => handleRemoveClick(card)}
                  title="Remove tenant"
                >
                  <FaTrash size={12} className="me-1" /> Remove
                </button>
              </>
            )}

            {isRemoved && (
              <button
                className="btn btn-sm text-white px-2 py-1"
                style={{ background: "#6C757D", fontSize: "12px" }}
                onClick={() => handleUndoClick(card)}
                title="Restore tenant"
              >
                <FaUndoAlt size={12} className="me-1" /> Undo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div
      className="text-center my-4"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <img src={NoData} alt="No Data" width={100} />
      <p>No data found.</p>
    </div>
  );

  const RemovalConfirmationModal = () => (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {modalAction === "remove" ? "Confirm Removal" : "Confirm Restore"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalAction === "remove" ? (
          <>
            <p>Are you sure you want to remove this tenant?</p>
            <p className="text-muted">
              <strong>{selectedCard?.raName || "N/A"}</strong> will be moved to the
              "Removed" tab and can be restored later.
            </p>
          </>
        ) : (
          <>
            <p>Are you sure you want to restore this tenant?</p>
            <p className="text-muted">
              <strong>{selectedCard?.raName || "N/A"}</strong> will be moved back to the
              "My Tenant" tab.
            </p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          No
        </Button>
        <Button 
          variant={modalAction === "remove" ? "danger" : "success"} 
          onClick={handleConfirmRemove}
        >
          {modalAction === "remove" ? "Yes, Remove" : "Yes, Restore"}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  if (loading)
    return (
      <div className="text-center my-4">
        <span className="spinner-border text-primary" role="status" />
        <p className="mt-2">Loading tenants...</p>
      </div>
    );

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center p-0"
      style={{ padding: "10px", gap: "15px", borderRadius: "10px" }}
      onWheel={handleWheelScroll}
      ref={scrollContainerRef}
    >
      <div className="d-flex flex-column" style={{ maxWidth: "500px", width: "100%" }}>
        {/* Header with Back Button */}
        <div
          className="d-flex align-items-center justify-content-start w-100 pt-2 pb-2"
          style={{
            background: "#EFEFEF",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            opacity: isScrolling ? 0 : 1,
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="pe-5"
            style={{
              backgroundColor: "#f0f0f0",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaArrowLeft style={{ color: "#30747F" }} />
          </button>
          <h3 className="m-0 ms-3" style={{ fontSize: "15px", fontWeight: "bold" }}>
            MY TENANT
          </h3>
        </div>

        {/* Tab Navigation */}
        <div
          className="d-flex"
          style={{
            background: "#F5F5F5",
            padding: "8px",
            borderRadius: "8px",
            marginTop: "10px",
            marginBottom: "15px",
            gap: "0",
            width: "100%",
          }}
        >
          <button
            onClick={() => setActiveTab("myTenant")}
            className="btn btn-sm flex-fill"
            style={{
              background: activeTab === "myTenant" ? "#4F4B7E" : "#E0E0E0",
              color: activeTab === "myTenant" ? "#fff" : "#333",
              border: "none",
              fontWeight: 500,
              transition: "all 0.3s ease",
              borderRadius: "6px 0 0 6px",
              padding: "8px 4px",
              fontSize: "12px",
            }}
          >
            My Tenant
          </button>

          <button
            onClick={() => setActiveTab("removed")}
            className="btn btn-sm flex-fill"
            style={{
              background: activeTab === "removed" ? "#4F4B7E" : "#E0E0E0",
              color: activeTab === "removed" ? "#fff" : "#333",
              border: "none",
              fontWeight: 500,
              transition: "all 0.3s ease",
              borderRadius: "0",
              padding: "8px 4px",
              fontSize: "12px",
            }}
          >
            Removed ({removedData.length})
          </button>

          <button
            onClick={() => setActiveTab("expired")}
            className="btn btn-sm flex-fill"
            style={{
              background: activeTab === "expired" ? "#4F4B7E" : "#E0E0E0",
              color: activeTab === "expired" ? "#fff" : "#333",
              border: "none",
              fontWeight: 500,
              transition: "all 0.3s ease",
              borderRadius: "0",
              padding: "8px 4px",
              fontSize: "12px",
            }}
          >
            Expired ({expiredData.length})
          </button>

          <button
            onClick={() => setActiveTab("addTenant")}
            className="btn btn-sm flex-fill"
            style={{
              background: activeTab === "addTenant" ? "#28A745" : "#E0E0E0",
              color: activeTab === "addTenant" ? "#fff" : "#333",
              border: "none",
              fontWeight: 500,
              transition: "all 0.3s ease",
              borderRadius: "0 6px 6px 0",
              padding: "8px 4px",
              fontSize: "12px",
            }}
          >
            Add Tenant
          </button>
        </div>

        {/* Message Alert */}
        {message && (
          <div className="alert alert-success fw-bold" style={{ marginBottom: "15px" }}>
            {message}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "myTenant" && (
          <>
            {allAssistanceData.length > 0 ? (
              allAssistanceData.map((card) => (
                <TenantCard key={card.Ra_Id} card={card} isRemoved={false} />
              ))
            ) : (
              <EmptyState />
            )}
          </>
        )}

        {activeTab === "removed" && (
          <>
            {removedData.length > 0 ? (
              removedData.map((card) => (
                <TenantCard key={card.Ra_Id} card={card} isRemoved={true} />
              ))
            ) : (
              <EmptyState />
            )}
          </>
        )}

        {activeTab === "expired" && (
          <>
            {expiredData.length > 0 ? (
              expiredData.map((card) => (
                <TenantCard key={card.Ra_Id} card={card} isRemoved={false} />
              ))
            ) : (
              <EmptyState />
            )}
          </>
        )}

        {activeTab === "addTenant" && (
          <div style={{ width: "100%" }}>
            <BuyerAssistance onSuccess={handleAddTenantSuccess} />
          </div>
        )}
      </div>

      {/* Removal Confirmation Modal */}
      <RemovalConfirmationModal />
    </div>
  );
};

export default BuyerAssisBuyer;
