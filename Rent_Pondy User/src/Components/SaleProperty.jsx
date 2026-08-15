







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

const SaleProperty = () => {
  const [properties, setProperties] = useState([]);

  const location = useLocation();
const queryParams = new URLSearchParams(window.location.search);
const storedPhoneNumber = queryParams.get("phoneNumber") || localStorage.getItem("phoneNumber") || "";
const [phoneNumber, setPhoneNumber] = useState(storedPhoneNumber);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    const navigate = useNavigate();
    // const location = useLocation();
    // const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
      const [clickedPropert, setClickedProperty] = useState([]);

    // const [phoneNumber, setPhoneNumber] = useState(storedPhoneNumber);


    useEffect(() => {
  if (storedPhoneNumber) {
    localStorage.setItem("phoneNumber", storedPhoneNumber);
  }
}, [storedPhoneNumber]);

  

useEffect(() => {
  const fetchAllProperties = async () => {
    setLoading(true);
    try {
      const [featuredRes, activeRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/fetch-featured-properties-on-demand-rent`),
        axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users-on-demand-rent`)
      ]);

      // Add isFeatured flag to featured properties
      const featuredProperties = featuredRes.data.properties.map((property) => ({
        ...property,
        isFeatured: true,
      }));

      const featuredrentIds = new Set(featuredProperties.map((p) => p.rentId));

      // Filter out duplicates and mark remaining as non-featured
      const activeProperties = activeRes.data.users
        .filter((property) => !featuredrentIds.has(property.rentId))
        .map((property) => ({
          ...property,
          isFeatured: false,
        }));

      const allProperties = [...featuredProperties, ...activeProperties].sort((a, b) => {
        const aDate = new Date(a.updatedAt || a.createdAt);
        const bDate = new Date(b.updatedAt || b.createdAt);
        return bDate - aDate; // Newest first
      });

      setProperties(allProperties);
    } catch (error) {
      console.error("Error fetching property data:", error);
      // setError("Failed to load property data.");
    } finally {
      setLoading(false);
    }
  };

  fetchAllProperties();
}, []);



// const handleCardClick = async (rentId, phoneNumber) => {
//   if (!clickedPropert.includes(rentId)) {
//     const updatedClickedPropert = [...clickedPropert, rentId];
//     setClickedProperty(updatedClickedPropert);
//     localStorage.setItem('clickedPropert', JSON.stringify(updatedClickedPropert));
//   }

//   // 👉 Log property view to backend
//   try {
//     await axios.post(`${process.env.REACT_APP_API_URL}/save-property-view`, {
//       rentId,
//       userPhoneNumber: phoneNumber,
//     });
//   } catch (err) {
//     console.error("Error recording property view:", err);
//   }

//   // ✅ Try to open the app using intent link (Android only)
//   const appLink = `intent://#Intent;package=com.apps.rentpondy;scheme=https;end`;

//   // Use a timeout fallback to redirect if app is not installed
//   const fallbackTimeout = setTimeout(() => {
//     window.location.href = "https://play.google.com/store/apps/details?id=com.apps.rentpondy&hl=en";
//   }, 1000); // fallback after 1 second

//   // Create and click invisible anchor tag
//   const a = document.createElement('a');
//   a.href = appLink;
//   a.style.display = 'none';
//   document.body.appendChild(a);
//   a.click();

//   // Cleanup
//   setTimeout(() => document.body.removeChild(a), 1500);
// };


const handleCardClick = async (rentId, phoneNumber) => {
  console.log("📤 Sending to /save-property-view:", {
    rentId,
    userPhoneNumber: phoneNumber,
  });

  // ✅ Prevent duplicate view logging
  if (!clickedPropert.includes(rentId)) {
    const updated = [...clickedPropert, rentId];
    setClickedProperty(updated);
    localStorage.setItem("clickedProperty", JSON.stringify(updated));
  }

  // ✅ Send view log to backend
  try {
    await axios.post(`${process.env.REACT_APP_API_URL}/save-property-view`, {
      rentId,
      userPhoneNumber: phoneNumber,
    });
  } catch (err) {
    // console.error("❌ Error recording property view:", err?.response?.data || err.message);
  }

  // ✅ Try to open the Android app via intent (deep link)
  const appIntent = `intent://detail/${rentId}#Intent;scheme=https;package=com.apps.rentpondy;end`;

  // ⏳ Set fallback timeout to redirect to Play Store
  const fallbackTimeout = setTimeout(() => {
    window.location.href = "https://play.google.com/store/apps/details?id=com.apps.rentpondy&hl=en";
  }, 1500); // Fallback after 1.5 seconds

  // 🔗 Create and click invisible anchor
  const link = document.createElement("a");
  link.href = appIntent;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();

  // 🧹 Cleanup
  setTimeout(() => {
    clearTimeout(fallbackTimeout);
    document.body.removeChild(link);
  }, 2000);
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
          viewedFile: "Sale Property",
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
<div className="d-flex justify-content-start"><p className="m-0" style={{ color:'#5E5E5E' , fontWeight:500 , fontSize:"13px"}}>{property.propertyMode
? property.propertyMode.charAt(0).toUpperCase() + property.propertyMode.slice(1)
: 'N/A'}
</p> 
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
 <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1">
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
 {/* <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
   <img src={calendar} alt="" width={12} className="me-2"/>
    <span style={{ fontSize:'13px', color:'#5E5E5E' ,fontWeight: 500 }}>
    {property.createdAt ? new Date(property.createdAt).toLocaleDateString('en-IN', {
                                       year: 'numeric',
                                       month: 'short',
                                       day: 'numeric'
                                     }) : 'N/A'}
    </span>
 </div> */}
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

  {/* <span style={{ fontSize:'15px', color:'#4F4B7E', fontWeight:600, letterSpacing:"1px" }}> 
    <img src={
      indianprice
    } alt="" width={8}  className="me-2"/>
   {property.price
          ? formatPrice(property.price)
          : 'N/A'}  </span>  */}

{/* <span
  style={{
    fontSize: '15px',
    color: property.price === 'On Demand' ? '#8C3C2F' : '#4F4B7E', 
    fontWeight: 600,
    letterSpacing: '1px',
  }}
>
   <img src={indianprice} alt="" width={8} className="me-2" />
  {typeof property.price === 'string' && property.price === 'On Demand'
    ? 'On Demand'
    : property.price
      ? formatPrice(property.price)
      : 'N/A'}
</span> */}

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

export default SaleProperty;


