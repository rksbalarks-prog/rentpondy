

import React, { useState, useEffect } from "react";
import { FaRulerCombined, FaBed, FaUserAlt, FaCalendarAlt, FaEye, FaCamera, FaRupeeSign, FaArrowLeft, FaChevronLeft } from "react-icons/fa";
import { Helmet } from "react-helmet";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios"; // Import axios for API requests
import myImage from '../Assets/Rectangle 146.png'; // Correct path
import myImage1 from '../Assets/Rectangle 145.png'; // Correct path
import pic from '../Assets/Mask Group 3@2x.png'; //
import calendar from '../Assets/Calender-01.png'
import bed from '../Assets/BHK-01.png'
import totalarea from '../Assets/total_area.png'
import postedby from '../Assets/Posted By-01.png'
import indianprice from '../Assets/Indian Rupee-01.png'
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import NoData from "../Assets/OOOPS-No-Data-Found.png";
import Floorr from '../Assets/floor.PNG';




const NotViewProperty = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // ✅ use hook only inside component body
  const location = useLocation();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";

  const [phoneNumber, setPhoneNumber] = useState(storedPhoneNumber);

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
  // Fetch properties with zero views
  useEffect(() => {
    const fetchZeroViewProperties = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/zero-view-properties`);
        setProperties(response.data.properties);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };
    fetchZeroViewProperties();
  }, []);
  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
          phoneNumber: phoneNumber,
          viewedFile: "Not view Property",
          viewTime: new Date().toISOString(),
        });
      } catch (err) {
      }
    };
  
    if (phoneNumber) {
      recordDashboardView();
    }
  }, [phoneNumber]);
  
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
     <div className="container d-flex align-items-center justify-content-center p-0">
           <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', margin: 'auto', width: '100%' ,fontFamily: 'Inter, sans-serif'}}>
 
       <div className="row g-2 w-100">
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
        </button> <h3 className="m-0 " style={{fontSize:"18px"}}>Not Viewed Property</h3> </div>
            
           <div className="w-100">
              {loading ? (
                <p>Loading properties...</p>
              ) : error ? (
                <p>{error}</p>
              ) : properties.length > 0 ? (
                properties.map((property) => (
                  <div key={property._id} className="card mb-3 shadow rounded-4" style={{ width: "100%", minWidth: "400px", background: "#F9F9F9" , overflow:'hidden'}}>
               
                                       <div className="row g-0 ">
         <div className="col-md-4 col-4 d-flex flex-column align-items-center">
         <div className="text-white py-1 px-2 text-center" style={{ width: "100%", background: "#4F4B7E", fontSize:"10px" }}>
                          PUC- {property.rentId}
                        </div>
 <div style={{ position: "relative", width: "100%", height: "150px" }}>
    {/* Image */}
    <img
 src={
  property.photos && property.photos.length > 0
    ? `https://rentpondy.com/PPC/${property.photos[0]}`
    : pic // Use the imported local image if no photos are available
  }      alt="Property"
      style={{
        objectFit: "cover",
        objectPosition: "center",
        width: "100%",
        height: "100%",
      }}
    />

    {/* Icons */}
    <div
      style={{
        position: "absolute",
        bottom: "0px",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span
        className="d-flex justify-content-center align-items-center"
        style={{
          color: "#fff",
          backgroundImage: `url(${myImage})`,
          backgroundSize: "cover",
          width: "45px",
          height: "20px",
          fontSize:"8px"
        }}
      >
        <FaCamera className="me-1" size={10}/>  <span style={{fontSize:"11px"}}>{property.photos.length}</span>
      </span>
      <span
        className="d-flex justify-content-center align-items-center"
        style={{
          color: "#fff",
          backgroundImage: `url(${myImage1})`,
          backgroundSize: "cover",
          width: "45px",
          height: "20px",
          fontSize:"8px"

        }}
      >
        <FaEye className="me-1" size={10} /> <span style={{fontSize:"11px"}}>  {property.views}</span>
      </span>
    </div>
  </div>
         </div>
         <div className="col-md-8 col-8 " style={{paddingLeft:"10px", paddingTop:"7px"}}>
          <div className="d-flex justify-content-start"><p className="m-0" style={{ color:'#5E5E5E' , fontWeight:500 }}>{property.propertyMode || 'N/A'}</p> 
          </div>
          <p className="fw-bold m-0 " style={{ color:'#000000' }}>{property.propertyType 
  ? property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) 
  : 'N/A'}
</p>
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
           <div className="card-body ps-2 m-0 pt-0 pe-2 pb-0 d-flex flex-column justify-content-center">
           <div className="row">
               <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1">
                 {/* <FaRulerCombined className="me-2" color="#4F4B7E" /> */}
                 {/* <img src={totalarea} alt="" width={12} className="me-2"/>
                 <span style={{ fontSize:'13px', color:'#5E5E5E' , fontWeight:500 }}>{property.totalArea || 'N/A'} {property.areaUnit
  ? property.areaUnit.charAt(0).toUpperCase() + property.areaUnit.slice(1)
  : 'N/A'}

                 </span> */}
                  <img src={Floorr} alt="" width={12} className="me-2"/>
                                  <span style={{ fontSize:'13px', color:'#5E5E5E' , fontWeight:500 }}>{property.floorNo
                   ? property.floorNo.charAt(0).toUpperCase() + property.floorNo.slice(1)
                   : 'N/A'}
                                  </span>
               </div>
               <div className="col-6 d-flex align-items-center mt-1 mb-1">
                 {/* <FaBed className="me-2" color="#4F4B7E"/> */}
                 <img src={bed} alt="" width={12} className="me-2"/>
                 <span style={{ fontSize:'13px', color:'#5E5E5E' ,fontWeight: 500 }}>{property.bedrooms || 'N/A'}</span>
               </div>
        <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
                 {/* <FaUserAlt className="me-2" color="#4F4B7E"/> */}
                 <img src={totalarea} alt="" width={12} className="me-2"/>
                   <span style={{ fontSize:'13px', color:'#5E5E5E' , fontWeight:500 }}>{property.totalArea || 'N/A'} {property.areaUnit
  ? property.areaUnit.charAt(0).toUpperCase() + property.areaUnit.slice(1)
  : 'N/A'}
                 </span>
               </div>       
               <div className="col-6 d-flex align-items-center mt-1 mb-1">
                 <img src={calendar} alt="" width={12} className="me-2"/>
                 <span style={{ fontSize:'13px', color:'#5E5E5E' ,fontWeight: 500 }}>
                  {property.createdAt ? new Date(property.createdAt).toLocaleDateString('en-IN', {
                                                     year: 'numeric',
                                                     month: 'short',
                                                     day: 'numeric'
                                                   }) : 'N/A'}
                  </span>
               </div>
               <div className="col-12 d-flex flex-col align-items-center mt-1 mb-1 ps-1">
                <h6 className="m-0">
                <span style={{ fontSize:'15px', color:'#4F4B7E', fontWeight:600, letterSpacing:"1px" }}> 
                  {/* <FaRupeeSign className="me-2" color="#4F4B7E"/> */}
                  <img src={
                    indianprice
                  } alt="" width={8}  className="me-2"/>
    {property.rentalAmount
          ? formatPrice(property.rentalAmount)
          : 'N/A'}                 </span> 
        <span style={{ color: '#4F4B7E', fontSize: '13px', marginLeft: "5px", fontSize: '11px' }}>
                     / {property.rentType || "N/A"}
                    </span>
                  </h6>
               </div>
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
                                <p>No properties with zero views found.</p>
                                </div> 
              )}
            </div>
          </div>
          </div>
          </div>

  );
};

export default NotViewProperty;

