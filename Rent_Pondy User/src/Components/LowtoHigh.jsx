
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { 
  FaFilter, FaHome, FaCity, FaRupeeSign, FaBed, FaCheck, FaTimes, 
  FaTools, FaIdCard, FaCalendarAlt, FaUserAlt, FaRulerCombined, FaBath, 
   FaCar, FaHandshake, FaToilet, 
  FaCamera,
  FaEye,
  FaArrowLeft,
  FaChevronLeft
} from "react-icons/fa";
import { TbArrowLeftRight } from "react-icons/tb";
import { AiOutlineColumnWidth, AiOutlineColumnHeight } from "react-icons/ai";
import { BsBank } from "react-icons/bs";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaKitchenSet } from "react-icons/fa6";
import myImage from '../Assets/Rectangle 146.png'; // Correct path
import myImage1 from '../Assets/Rectangle 145.png'; // Correct path
import pic from '../Assets/Mask Group 3@2x.png'; // Correct path
import {FaChartArea, FaMapPin, FaDoorClosed , FaRoad ,FaRegAddressCard } from 'react-icons/fa6';
import { MdLocationOn, MdOutlineMeetingRoom, MdOutlineOtherHouses, MdSchedule , MdApproval, MdLocationCity } from "react-icons/md";
import { BsBuildingsFill, BsFillHouseCheckFill } from "react-icons/bs";
import { GiKitchenScale,  GiResize , GiGears} from "react-icons/gi";
import { HiUserGroup } from "react-icons/hi";
import { BiSearchAlt,  BiWorld} from "react-icons/bi";
import {  MdElevator   } from "react-icons/md";
import calendar from '../Assets/Calender-01.png'
import bed from '../Assets/BHK-01.png'
import totalarea from '../Assets/total_area.png'
import postedby from '../Assets/Posted By-01.png'
import indianprice from '../Assets/Indian Rupee-01.png'
import NoData from "../Assets/OOOPS-No-Data-Found.png";
import Floorr from '../Assets/floor.PNG'

const LowtoHigh = ({phoneNumber}) => {
  const [properties, setProperties] = useState([]);
  // const [filters, setFilters] = useState({ id: '', price: '', propertyMode: '', city: '' });
  const [filters, setFilters] = useState({ 
    id: '', 
    minPrice: '', 
    maxPrice: '', 
    propertyMode: '', 
    city: '' 
  });
      const [loading, setLoading] = useState(true); // Loading state
    
  const [imageCounts, setImageCounts] = useState({}); // Store image count for each property
  
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
    }, []); useEffect(() => {
      const recordDashboardView = async () => {
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
            phoneNumber: phoneNumber,
            viewedFile: "Low to High",
            viewTime: new Date().toISOString(),
          });
        } catch (err) {
        }
      };
    
      if (phoneNumber) {
        recordDashboardView();
      }
    }, [phoneNumber]);

  const [advancedFilters, setAdvancedFilters] = useState({
    propertyMode: '', propertyType: '', minPrice: '', maxPrice: '', propertyAge: '', bankLoan: '',
    negotiation: '', length: '', breadth: '', totalArea: '', ownership: '', bedrooms: '',
    kitchen: '', kitchenType: '', balconies: '', floorNo: '', areaUnit: '', propertyApproved: '',
    facing: '', salesMode: '', salesType: '', furnished: '', lift: '', attachedBathrooms: '',
    western: '', numberOfFloors: '', carParking: '', city: ''
  });
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [isAdvancedPopupOpen, setIsAdvancedPopupOpen] = useState(false);
  const navigate = useNavigate();


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
  
    // Fetch image counts for all properties
    useEffect(() => {
      const fetchAllImageCounts = async () => {
        const counts = {};
        await Promise.all(
          properties.map(async (property) => {
            const count = await fetchImageCount(property.rentId);
            counts[property.rentId] = count;
          })
        );
        setImageCounts(counts);
      };
  
      if (properties.length > 0) {
        fetchAllImageCounts();
      }
    }, [properties]);
  



    useEffect(() => {
      const fetchProperties = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users`);
          const allProperties = response.data.users;
    
          // Sort by createdAt in descending order (newest first)
          const sortedProperties = allProperties.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    
          setProperties(sortedProperties);
        } catch (error) {
        }  finally {
          setLoading(false);
        }
      };
    
      fetchProperties();
    }, []);
    
    
    const [dropdownState, setDropdownState] = useState({
      activeDropdown: null,
      filterText: "",
      position: { top: 0, left: 0 },
    });
  const toggleDropdown = (field) => {
    setDropdownState((prevState) => ({
      activeDropdown: prevState.activeDropdown === field ? null : field,
      filterText: "",
    }));
  };


const formatIndianNumber = (x) => {
  x = x.toString();
  const lastThree = x.slice(-3);
  const otherNumbers = x.slice(0, -3);
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (otherNumbers ? "," : "") + lastThree;
};

const formatPrice = (price) => {
  price = Number(price);
  if (isNaN(price)) return 'N/A';

  if (price >= 10000000) {
    return (price / 10000000).toFixed(2) + ' Cr';
  } else if (price >= 100000) {
    return (price / 100000).toFixed(2) + ' Lakhs';
  } else {
    return formatIndianNumber(price);
  }
};
  
    const [dataList, setDataList] = useState({});
    const fetchDropdownData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch`);
        const groupedData = response.data.data.reduce((acc, item) => {
          if (!acc[item.field]) acc[item.field] = [];
          acc[item.field].push(item.value);
          return acc;
        }, {});
        setDataList(groupedData);
      } catch (error) {
      }
    };
  
    useEffect(() => {
      fetchDropdownData();
    }, []);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevState) => ({ ...prevState, [name]: value }));

    setDropdownState((prevState) => ({ ...prevState, filterText: e.target.value }));

  };

  const handleAdvancedFilterChange = (e) => {
    const { name, value } = e.target;
    setAdvancedFilters((prevState) => ({ ...prevState, [name]: value }));
    setDropdownState((prevState) => ({ ...prevState, filterText: value }));
  };

    const renderDropdown = (field) => {
      const options = dataList[field] || [];
      const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(dropdownState.filterText.toLowerCase())
      );
  
      return (
        dropdownState.activeDropdown === field && (
          <div
            className="dropdown-popup"
            style={{
              backgroundColor: '#fff',
              width: '100%',
              maxWidth: '400px',
              padding: '10px',
              zIndex: 10,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              overflowY: 'auto',
              maxHeight: '50vh',
              animation: 'popupOpen 0.3s ease-in-out',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <input
                type="text"
                placeholder="Filter options..."
                value={dropdownState.filterText}
                onChange={handleFilterChange}
                style={{
                  width: '80%',
                  padding: '5px',
                  marginBottom: '10px',
                }}
              />
              <button
                type="button"
                onClick={() => toggleDropdown(field)}
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                }}
              >
                <FaTimes size={18} color="red" />
              </button>
            </div>
            <ul
              style={{
                listStyleType: 'none',
                padding: 0,
                margin: 0,
              }}
            >
            
{filteredOptions.map((option, index) => (
  <li
    key={index}
    onClick={() => {
      // Update advanced filters
      setAdvancedFilters((prevState) => ({
        ...prevState,
        [field]: option,
      }));
      
      // Update the filters state
      setFilters((prevState) => ({
        ...prevState,
        [field]: option,
      }));
      
      // Toggle dropdown visibility
      toggleDropdown(field);
    }}
    style={{
      padding: '5px',
      cursor: 'pointer',
      backgroundColor: '#f9f9f9',
      marginBottom: '5px',
    }}
  >
    {option}
  </li>
))}

            </ul>
          </div>
        )
      );
    };

 

  const filteredProperties = properties.filter((property) => { 
    const basicFilterMatch = 
      (filters.id ? property.rentId?.toString().includes(filters.id) : true) &&
      (filters.propertyMode ? property.propertyMode?.toLowerCase().includes(filters.propertyMode.toLowerCase()) : true) &&
      (filters.city ? property.city?.toLowerCase().includes(filters.city.toLowerCase()) : true);
  
    const priceMatch = 
      (filters.minPrice ? property.price >= Number(filters.minPrice) : true) &&
      (filters.maxPrice ? property.price <= Number(filters.maxPrice) : true);
  
    const advancedFilterMatch = Object.keys(advancedFilters).every((key) => {
      if (!advancedFilters[key]) return true;
  
      if (key === "minPrice") {
        return property.price >= Number(advancedFilters[key]);
      }
      if (key === "maxPrice") {
        return property.price <= Number(advancedFilters[key]);
      }
  
      return property[key]?.toString()?.toLowerCase()?.includes(advancedFilters[key]?.toLowerCase());
    });
  
    return basicFilterMatch && priceMatch && advancedFilterMatch;
  });
  

  const handleCardClick = (rentId, phoneNumber) => {
    navigate(`/detail/${rentId}`, { state: { phoneNumber } });
  };

    // navigate("/detail", { state: { phoneNumber } });
  // const formattedPrice = new Intl.NumberFormat('en-IN').format(property.price); // Indian-style number format
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
          </button> <h3 className="m-0" style={{fontSize:"18px"}}>Low Price Order </h3> </div>
            
           <div className="w-100">
             <div style={{ overflowY: 'auto', fontFamily:"Inter, sans-serif" }}>
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
</div>              ) : filteredProperties.length > 0 ? (
                 filteredProperties.map((property) => (
                   <div 
                     key={property._id}
                     className="card mb-3 shadow rounded-4"
                     style={{ width: '100%', height: 'auto', background: '#F9F9F9', overflow:'hidden' }}
                     onClick={() => handleCardClick(property.rentId, phoneNumber)}
                   >
                      <div className="row g-0 ">
          <div className="col-md-4 col-4 d-flex flex-column align-items-center">
       
  <div style={{ position: "relative", width: "100%",height: window.innerWidth <= 640 ? "180px" : "170px",  }}>
     {/* Image */}
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
         }}
       >
         <FaCamera className="me-1" size={13}/>  <span style={{fontSize:"11px"}}>{imageCounts[property.rentId] || 0}</span>
       </span>
       <span
         className="d-flex justify-content-center align-items-center"
         style={{
           color: "#fff",
           backgroundImage: `url(${myImage1})`,
           backgroundSize: "cover",
           width: "45px",
           height: "20px",
         }}
       >
         <FaEye className="me-1" size={15} /> <span style={{fontSize:"11px"}}> {property.views}  </span>
       </span>
     </div>
   </div>
          </div>
          <div className="col-md-8 col-8 " style={{paddingLeft:"10px", paddingTop:"7px"}}>
           <div className="d-flex justify-content-start"><p className="m-0" style={{ color:'#5E5E5E' , fontWeight:500 }}>{property.propertyMode
   ? property.propertyMode.charAt(0).toUpperCase() + property.propertyMode.slice(1)
   : 'N/A'}
 </p> 
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
{val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()}        {idx < arr.length - 1 ? ", " : ""}
      </span>
    ));
  })()}
</p>
            <div className="card-body ps-2 m-0 pt-0 pe-2 pb-0 d-flex flex-column justify-content-center" style={{background:"#FAFAFA"}}>
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
          : 'N/A'}                  </span> 
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
        <p>No properties found.</p>
        </div>               )}
             </div>
           </div>
           </div>
           </div>
           </div>
  );
};

export default LowtoHigh;


































