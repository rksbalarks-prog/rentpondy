




import React, { useEffect, useState } from "react";
import axios from "axios";
import myImage from '../Assets/Rectangle 146.png'; // Correct path
import myImage1 from '../Assets/Rectangle 145.png'; // Correct path
import pic from '../Assets/Mask Group 3@2x.png'; // Correct path
import { MdOutlineStarOutline } from "react-icons/md";
import calendar from '../Assets/Calender-01.png'
import bed from '../Assets/BHK-01.png'
import totalarea from '../Assets/total_area.png'
import postedby from '../Assets/Posted By-01.png'
import indianprice from '../Assets/Indian Rupee-01.png'
import { FaBed, FaCalendarAlt, FaCamera, FaEye, FaRegCalendarAlt, FaRulerCombined, FaRupeeSign, FaUserAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import NoData from "../Assets/OOOPS-No-Data-Found.png";
import Floorr from '../Assets/floor.PNG'
import maplocation from "../Assets/maplocation.png";

const FeaturedProperty = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
      const [clickedPropert, setClickedProperty] = useState([]);

    const [phoneNumber, setPhoneNumber] = useState(storedPhoneNumber);


  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-featured-properties-on-demand-rent`
        );

        const allProperties = response.data.properties || [];

        const sortedProperties = allProperties.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt) -
            new Date(a.updatedAt || a.createdAt)
        );

        setProperties(sortedProperties);
        setError("");
      } catch (err) {
        console.error("Error fetching featured properties:", err);
        setError("Failed to fetch featured properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);


const handleCardClick = (rentId,phoneNumber) => {
  if (!clickedPropert.includes(rentId)) {
    const updatedClickedPropert = [...clickedPropert, rentId];
    setClickedProperty(updatedClickedPropert);
    localStorage.setItem('clickedPropert', JSON.stringify(updatedClickedPropert));
  }
      navigate(`/detail/${rentId}`, { state: { phoneNumber } });
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


  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
          phoneNumber: phoneNumber,
          viewedFile: "Feature Property",
          viewTime: new Date().toISOString(),
        });
      } catch (err) {
      }
    };
  
    if (phoneNumber) {
      recordDashboardView();
    }
  }, [phoneNumber]);
  if (error) return <p className="text-danger text-center">{error}</p>;
  if (properties.length === 0) return       <div className="text-center my-4 "
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
          
                }}>
        <img src={NoData} alt="" width={100}/>      
        <p>No featured properties available.</p>
        </div> ;

  return (
    <div className="container mb-4">
      <div className="row p-1">
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
) : (
  properties.map((property) => (
    <div
    key={property._id}
    className="card mb-3 shadow rounded-4 p-0"
    style={{ width: '100%', height: 'auto', background: '#F9F9F9', overflow:'hidden' }}

onClick={() => handleCardClick(property.rentId)}
  >
    <div className="row g-0 align-items-stretch">
      <div className="col-md-4 col-4 d-flex flex-column align-items-center">
       
        <div style={{ position: "relative", width: "100%", height: '100%', }}>
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
            style={{
              objectFit: "cover",
              objectPosition: "center",
              width: "100%",
              height: "160px",
            }}
          />
            <span   className="m-0 ps-1 pe-2" style={{    position: "absolute",
              top: "0px",
              right:"0px",
             fontSize:"12px",background:" linear-gradient(to right,rgba(255, 200, 0, 0.91),rgb(251, 182, 6))", color:"black", cursor:"pointer", borderRadius: '0px 0px 0px 15px'}}><MdOutlineStarOutline />Featured</span>

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
                fontSize: "8px"
              }}
            >
              <FaCamera className="me-1" size={10} />
              <span style={{ fontSize: "11px" }}>{property.photos.length}</span>
            </span>
            <span
              className="d-flex justify-content-center align-items-center"
              style={{
                color: "#fff",
                backgroundImage: `url(${myImage1})`,
                backgroundSize: "cover",
                width: "45px",
                height: "20px",
                fontSize: "8px"
              }}
            >
              <FaEye className="me-1" size={10} />
              <span style={{ fontSize: "11px" }}>{property.views}</span>
            </span>
          </div>
        </div>
      </div>
         <div className="col-md-8 col-8 " style={{paddingLeft:"10px", paddingTop:"7px" , background: clickedPropert.includes(property.rentId) ? "#ffffff" : "#F9F9F9",}}>
   <div className="d-flex justify-content-between"><p className="m-0" style={{ color:'#5E5E5E' , fontWeight:500 , fontSize:"13px"}}>{property.propertyMode
  ? property.propertyMode.charAt(0).toUpperCase() + property.propertyMode.slice(1)
  : 'N/A'} 
</p>  
<p className="m-0 pe-5">{property.locationCoordinates ? <img src={maplocation} alt="" width={15} /> : ""}</p>
          </div>
        <p className="fw-bold m-0 " style={{ color:clickedPropert.includes(property.rentId) ? "#F76F00" : "#000000", fontSize:"15px" }}>{property.propertyType 
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
{val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()}
        {idx < arr.length - 1 ? ", " : ""}
      </span>
    ));
  })()}
</p>
<div className="card-body ps-2 m-0 pt-0 pe-2 pb-0 d-flex flex-column justify-content-center">
<div className="row">
 {/* <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1">
    <img src={totalarea} alt="" width={12} className="me-2"/>
                    <span style={{ fontSize:'13px', color:'#5E5E5E' , fontWeight:500 }}>{property.totalArea
     ? property.totalArea.charAt(0).toUpperCase() + property.totalArea.slice(1)
     : 'N/A'}
                    </span>
 </div> */}
 {/* {["plot", "land", "agricultural land"].includes((property.propertyType || "").toLowerCase()) ? (
  // Show Total Area
  <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1">
    <img src={totalarea} alt="" width={12} className="me-2" />
    <span style={{ fontSize: '13px', color: '#5E5E5E', fontWeight: 500 }}>
      {property.totalArea || 'N/A'} {property.areaUnit || 'N/A'}
    </span>
  </div>
) : (
  // Show Floor No
  <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1">
    <img src={Floorr} alt="" width={12} className="me-2" />
    <span style={{ fontSize: '13px', color: '#5E5E5E', fontWeight: 500 }}>
      {property.floorNo
        ? property.floorNo.charAt(0).toUpperCase() + property.floorNo.slice(1)
        : 'N/A'}
    </span>
  </div>
)} */}
 <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1">
    <img src={Floorr} alt="" width={12} className="me-2" />
    <span style={{ fontSize: '13px', color: '#5E5E5E', fontWeight: 500 }}>
      {property.floorNo
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
 <div className="col-12 d-flex flex-col align-items-center mt-1 mb-1 ps-1">
  <h6 className="m-0">
  <span
              style={{
                fontSize: "15px",
                color: property.rentalAmount === "On Demand" ? "#8C3C2F" : "#4F4B7E",
                fontWeight: 600,
                letterSpacing: "1px",
              }}
            >
              <img
                src={indianprice}
                alt=""
                width={8}
                className="me-2"
                style={{ marginRight: "6px" }}
              />
              {typeof property.rentalAmount === "string" &&
              property.rentalAmount === "On Demand"
                ? "On Demand"
                : property.rentalAmount
                ? formatPrice(property.rentalAmount)
                : "N/A"}
            </span>

<span style={{ color: '#4F4B7E', fontSize: '13px', marginLeft: "5px", fontSize: '11px' }}>
             / {property.rentType || "N/A"}
            </span>
    </h6>
 </div>
</div>
</div>
</div>
    </div>
  </div> ))
)}
      </div>
    </div>
  );
};

export default FeaturedProperty;

