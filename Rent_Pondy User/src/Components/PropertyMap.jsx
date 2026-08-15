

import React, { useEffect, useState , useRef} from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { 
  FaFilter, FaHome, FaCity, FaRupeeSign, FaBed, FaCheck, FaTimes, 
  FaTools, FaIdCard, FaCalendarAlt, FaUserAlt, FaRulerCombined, FaBath, 
   FaCar, FaHandshake, FaToilet, 
  FaCamera,
  FaEye,
  FaSearch,
  FaArrowUp
} from "react-icons/fa";
import { TbArrowLeftRight } from "react-icons/tb";
import { AiOutlineColumnWidth, AiOutlineColumnHeight } from "react-icons/ai";
import { BsBank } from "react-icons/bs";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaKitchenSet, FaPhone } from "react-icons/fa6";
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
import totalarea from '../Assets/Total Area-01.png'
import postedby from '../Assets/Posted By-01.png'
import indianprice from '../Assets/Indian Rupee-01.png'
import {
  
  FaUsers,
  FaSortAmountDownAlt,
  FaHeadset,
} from 'react-icons/fa';
import NoData from "../Assets/OOOPS-No-Data-Found.png";
import minprice from "../Assets/Price Mini-01.png";
import maxprice from "../Assets/Price maxi-01.png";
import { FcSearch } from "react-icons/fc";
import { GrPowerReset } from "react-icons/gr";
import PondyIcon from '../Assets/Rent Property-01.png';
import MarkerClusterer from '@googlemaps/markerclustererplus';

// const FilteredPropertyMap = ({ filteredProperties }) => {
//   const mapRef = useRef(null);

//   useEffect(() => {
//     if (!window.google || !filteredProperties.length) return;

//     const map = new window.google.maps.Map(mapRef.current, {
// center: { lat: 11.9416, lng: 79.8083 },
//           zoom: 10,
//     });

//     const bounds = new window.google.maps.LatLngBounds();

//     filteredProperties.forEach((property) => {
//       const coords = parseCoordinates(property.locationCoordinates);
//       if (!coords) return;

//       const marker = new window.google.maps.Marker({
//         position: coords,
//         map,
//         icon: {
//           url:'/PondyMa.png',
//           // url:'/logo.png',
//           // url:'/mapLocation.png',
//           // path: window.google.maps.SymbolPath.CIRCLE,
//           // scale: 8,
//           // fillColor: '#007BFF',
//           // fillOpacity: 1,
//           // strokeWeight: 1,
//           // strokeColor: 'white',
//             scaledSize: new window.google.maps.Size(40, 40), // Width x Height in pixels

//         },
//       });

//       // Custom label for property ID, positioned above the marker
//       const label = new window.google.maps.InfoWindow({
//         content: `<div style="font-size: 11px; font-weight: bold; color: blue;"><span style={{color:"grey"}}>rentId:</span>${property.rentId}</div>`,
//         position: {
//           lat: coords.lat + 0.0003, // Adjust to move the label vertically
//           lng: coords.lng,
//         },
//       });
//       marker.addListener('click', () => {
//         label.open(map, marker);
//       });

//       bounds.extend(coords);
//     });

//     map.fitBounds(bounds);
//   }, [filteredProperties]);

//   const parseCoordinates = (coordString) => {
//     const regex = /([+-]?\d+(\.\d+)?)[^\d+-]+([+-]?\d+(\.\d+)?)/;
//     const match = coordString.match(regex);
//     if (!match) return null;

//     return {
//       lat: parseFloat(match[1]),
//       lng: parseFloat(match[3]),
//     };
//   };
 
//   return (
//     <div
//       ref={mapRef}
//       style={{ width: '100%', height: '800px', marginTop: '20px', borderRadius: '8px' }}
//     />
//   );
// };


const FilteredPropertyMap = ({ filteredProperties , resetSearchFlag }) => {
  const mapRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter logic based on all fields
  const filteredByLocation = filteredProperties.filter((property) => {
    const term = searchTerm.toLowerCase();
    return (
      property.city?.toLowerCase().includes(term) ||
      property.area?.toLowerCase().includes(term) ||
      property.nagar?.toLowerCase().includes(term) ||
      property.streetName?.toLowerCase().includes(term) ||
      property.district?.toLowerCase().includes(term) ||
      property.state?.toLowerCase().includes(term)
    );
  });



 const location = useLocation();
  
    const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";

      const [phoneNumber, setPhoneNumber] = useState(storedPhoneNumber);
  

  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
          phoneNumber: phoneNumber,
          viewedFile: "Property Map",
          viewTime: new Date().toISOString(),
        });
      } catch (err) {
      }
    };
  
    if (phoneNumber) {
      recordDashboardView();
    }
  }, [phoneNumber]);



const loadGoogleMapsScript = (callback) => {
  if (window.google) {
    callback();
    return;
  }

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
  script.async = true;
  script.defer = true;
  script.onload = callback;
  document.head.appendChild(script);
};

// useEffect(() => {
//   loadGoogleMapsScript(() => {
//     if (!mapRef.current) return;

//     const defaultCenter = { lat: 11.9416, lng: 79.8083 };
//     const map = new window.google.maps.Map(mapRef.current, {
//       center: defaultCenter,
//       zoom: 13,
//     });

//     const bounds = new window.google.maps.LatLngBounds();
//     let markersAdded = false;

//     filteredByLocation.forEach((property) => {
//       const coords = parseCoordinates(property.locationCoordinates);
//       if (!coords) return;

//       const marker = new window.google.maps.Marker({
//         position: coords,
//         map,
//         icon: {
//           url: PondyIcon ,
//           scaledSize: new window.google.maps.Size(20, 20),
//         },
//       });

//       // const label = new window.google.maps.InfoWindow({
//       //   content: `<div style="font-size: 11px; font-weight: bold; color: blue;"><span style="color:grey" >rentId:</span> ${property.rentId}</div>`,
//       //   position: {
//       //     lat: coords.lat + 0.0003,
//       //     lng: coords.lng,
//       //   },
//       // });
// const label = new window.google.maps.InfoWindow({
//   content: `
//     <div style="font-size: 12px; font-family: Inter, sans-serif; max-width: 220px;">
//       <div style="font-weight: bold; color: #014378; margin-bottom: 5px;">
//         <span style="color: grey;">rentId:</span> ${property.rentId}
//       </div>
//       <div style="margin-bottom: 4px;">
//         <strong style="color: grey;">Price:</strong> ₹${property.price ? property.price.toLocaleString('en-IN') : 'N/A'}
//       </div>
//       <div style="margin-bottom: 4px;">
//         <strong style="color: grey;">Type:</strong> ${property.propertyType || 'N/A'}
//       </div>
//       <div>
//         <a href="/detail/${property.rentId}" style="color: #FF4920; text-decoration: underline;">More</a>
//       </div>
//     </div>
//   `,
//   position: {
//     lat: coords.lat + 0.0003,
//     lng: coords.lng,
//   },
// });

//       marker.addListener('click', () => {
//         label.open(map, marker);
//       });

//       bounds.extend(coords);
//       markersAdded = true;
//     });

//     if (markersAdded) {
//       map.fitBounds(bounds);
//     } else {
//       map.setCenter(defaultCenter);
//       map.setZoom(13);
//     }
//   });
// }, [filteredByLocation]);
useEffect(() => {
  loadGoogleMapsScript(() => {
    if (!mapRef.current || !window.google) return;

    const defaultCenter = { lat: 11.9416, lng: 79.8083 };
    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 13,
    });

    const bounds = new window.google.maps.LatLngBounds();
    const markers = [];

    filteredByLocation.forEach((property) => {
      const coords = parseCoordinates(property.locationCoordinates);
      if (!coords) return;

      const marker = new window.google.maps.Marker({
        position: coords,
        icon: {
          url: PondyIcon,
          scaledSize: new window.google.maps.Size(20, 20),
        },
      });

      const label = new window.google.maps.InfoWindow({
        content: `
          <div style="font-size: 12px; font-family: Inter, sans-serif; max-width: 220px;">
            <div style="font-weight: bold; color: #014378; margin-bottom: 5px;">
              <span style="color: grey;">rentId:</span> ${property.rentId}
            </div>
            <div style="margin-bottom: 4px;">
              <strong style="color: grey;">Price:</strong> ₹${property.price ? property.price.toLocaleString('en-IN') : 'N/A'}
            </div>
            <div style="margin-bottom: 4px;">
              <strong style="color: grey;">Type:</strong> ${property.propertyType || 'N/A'}
            </div>
            <div>
              <a href="/detail/${property.rentId}" style="color: #FF4920; text-decoration: underline;">More</a>
            </div>
          </div>
        `,
        position: {
          lat: coords.lat + 0.0003,
          lng: coords.lng,
        },
      });

      marker.addListener('click', () => {
        label.open(map, marker);
      });

      markers.push(marker);
      bounds.extend(coords);
    });

    if (markers.length > 0) {
      map.fitBounds(bounds);
    } else {
      map.setCenter(defaultCenter);
      map.setZoom(13);
    }

    // ✅ Add clustering here
    new MarkerClusterer(map, markers, {
      imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    });
  });
}, [filteredByLocation]);

  const parseCoordinates = (coordString) => {
    const regex = /([+-]?\d+(\.\d+)?)[^\d+-]+([+-]?\d+(\.\d+)?)/;
    const match = coordString.match(regex);
    if (!match) return null;

    return {
      lat: parseFloat(match[1]),
      lng: parseFloat(match[3]),
    };
  };

  useEffect(() => {
    setSearchTerm('');
  }, [resetSearchFlag]);
  return (
    <>
      <div style={{ position: 'relative', width: '100%' }}>
        <FcSearch
          size={16}
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color:"black",
          }}
        />
        <input
          className="m-0 rounded-0 ms-1"
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '5px 5px 5px 30px', // left padding for the icon
            background: "#fff",
            border: "none",
            outline: "none",
            borderBottom: '1px solid #D0D7DE'
          }}
        />
      </div>
      <div
        ref={mapRef}
        style={{ width: '100%', height: '400px', marginTop: '20px', borderRadius: '8px' }}
      />
{/* <div style={{ marginTop: '20px', maxHeight: '250px', overflowY: 'auto' }}>
  {filteredByLocation.length === 0 ? (
    <p style={{ color: 'gray' }}>No results found.</p>
  ) : (
    filteredByLocation.map((property, index) => (
 <div
  key={index}
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  }}
  onClick={() => window.open(`/detail/${property.rentId}`, '_blank')}
>
  <div style={{ flex: 1, paddingRight: '10px' }}>
    <h6 style={{ margin: 0, color: '#014378' }}>
      <span style={{ color: 'grey' }}>rentId:</span> {property.rentId}
    </h6>
    <div style={{ fontSize: '14px' }}>
      <strong style={{ color: 'grey' }}>Price:</strong> ₹{property.price?.toLocaleString('en-IN') || 'N/A'}<br />
      <strong style={{ color: 'grey' }}>Type:</strong> {property.propertyType || 'N/A'}<br />
      <strong style={{ color: 'grey' }}>Address:</strong> {property.city || ''}, {property.area || ''}
    </div>
  </div>

  <img
    src={
      property.photos && property.photos.length > 0
        ? `http://localhost:5000/${property.photos[0].replace(/\\/g, "/")}`
        : "https://d17r9yv50dox9q.cloudfront.net/car_gallery/default.jpg"
    }
    alt="Property"
    style={{
      width: '80px',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '6px',
      border: '1px solid #ddd',
    }}
  />
</div>

    ))
  )}
</div> */}

    </>
  );
};


const PropertyMap = ({phoneNumber}) => {
  const [properties, setProperties] = useState([]);
  // const [filters, setFilters] = useState({ id: '', price: '', propertyMode: '', city: '' });
  const [filters, setFilters] = useState({ 
    id: '', 
    minPrice: '', 
    maxPrice: '', 
    propertyMode: '', 
    city: '' ,
     propertyType: ''
  });
  const [hoverSearch, setHoverSearch] = useState(false);
  const [hoverAdvance, setHoverAdvance] = useState(false);
  const [imageCounts, setImageCounts] = useState({}); // Store image count for each property
  const [loading, setLoading] = useState(true); 
  const [resetSearchFlag, setResetSearchFlag] = React.useState(false);


  const [showMap, setShowMap] = useState(false);

  

  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
          phoneNumber: phoneNumber,
          viewedFile: "Property Map",
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
    negotiation: '', length: '', breadth: '', totalArea: '', minTotalArea: '', ownership: '', bedrooms: '',
    minBedrooms: '', kitchen: '', kitchenType: '', balconies: '', floorNo: '', areaUnit: '', propertyApproved: '',
    facing: '', salesMode: '', furnished: '', lift: '', attachedBathrooms: '', minAttachedBathrooms: '',
    western: '', minWestern: '', numberOfFloors: '', carParking: '', city: '', phoneNumber: ''
  });


  const handleReset = () => {
    setAdvancedFilters(prev => Object.fromEntries(Object.keys(prev).map(key => [key, ''])));
    setFilters(prev => Object.fromEntries(Object.keys(prev).map(key => [key, ''])));
    setResetSearchFlag(prev => !prev); // Toggle to notify child to reset search
  };
    const activeFilterCount = [
    ...Object.values(filters),
    ...Object.values(advancedFilters)
  ].filter((val) => val !== '').length;

  const shouldShowButton = activeFilterCount >= 2;

  const [showMinBedroomsOptions, setShowMinBedroomsOptions] = useState(false);
  const [showMinAttachedBathroomsOptions, setShowMinAttachedBathroomsOptions] = useState(false);
  const [showMinWesternOptions, setShowMinWesternOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle change for minBedrooms
  const handleMinBedroomSelect = (value) => {
    setAdvancedFilters(prevState => ({
      ...prevState,
      minBedrooms: value
    }));
    setShowMinBedroomsOptions(false);
  };

  // Handle change for minAttachedBathrooms
  const handleMinAttachedBathroomsSelect = (value) => {
    setAdvancedFilters(prevState => ({
      ...prevState,
      minAttachedBathrooms: value
    }));
    setShowMinAttachedBathroomsOptions(false);
  };

  // Handle change for minWestern
  const handleMinWesternSelect = (value) => {
    setAdvancedFilters(prevState => ({
      ...prevState,
      minWestern: value
    }));
    setShowMinWesternOptions(false);
  };

  const closeMinBedroomsOptions = () => {
    setShowMinBedroomsOptions(false);
  };

  const closeMinAttachedBathroomsOptions = () => {
    setShowMinAttachedBathroomsOptions(false);
  };

  const closeMinWesternOptions = () => {
    setShowMinWesternOptions(false);
  };

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
    setLoading(true); // Start loading
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users`);
      const allProperties = response.data.users;

      // Sort by createdAt in descending order (newest first)
      const sortedProperties = allProperties.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setProperties(sortedProperties);
    } catch (error) {
    } finally {
      setLoading(false); // Stop loading
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

    // setFilters({ ...filters, [name]: value });
    setDropdownState((prevState) => ({ ...prevState, filterText: e.target.value }));

  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter options based on search query
  const filterOptions = (options) => {
    return options.filter(option => option.toString().includes(searchQuery));
  };
  const handleAdvancedFilterChange = (e) => {
    const { name, value } = e.target;
    setAdvancedFilters((prevState) => ({ ...prevState, [name]: value }));
    setDropdownState((prevState) => ({ ...prevState, filterText: value }));
  };
  const fieldLabels = {
    propertyMode: "Property Mode",
    propertyType: "Property Type",
    price: "Price",
    minPrice: 'minPrice', 
    maxPrice: 'maxPrice', 
    propertyAge: "Property Age",
    bankLoan: "Bank Loan",
    negotiation: "Negotiation",
    length: "Length",
    breadth: "Breadth",
    totalArea: "Total Area",
    ownership: "Ownership",
    bedrooms: "Bedrooms",
    kitchen: "Kitchen",
    kitchenType: "Kitchen Type",
    balconies: "Balconies",
    floorNo: "Floor No.",
    areaUnit: "Area Unit",
    propertyApproved: "Property Approved",
    postedBy: "Posted By",
    facing: "Facing",
    salesMode: "Sales Mode",
    salesType: "Sales Type",
    description: "Description",
    furnished: "Furnished",
    lift: "Lift",
    attachedBathrooms: "Attached Bathrooms",
    western: "Western Toilet",
    numberOfFloors: "Number of Floors",
    carParking: "Car Parking",
    country: "Country",
    state: "State",
    city: "City",
    district: "District",
    area: "Area",
    streetName: "Street Name",
    doorNumber: "Door Number",
    nagar: "Nagar",
    ownerName: "Owner Name",
    email: "Email",
    phoneNumber: "Phone Number",
    phoneNumberCountryCode: "Phone Country Code",
    alternatePhone: "Alternate Phone",
    alternatePhoneCountryCode: "Alternate Phone Country Code",
    bestTimeToCall: "Best Time to Call",
  };
  
    
    const renderDropdown = (field) => {
      const options = dataList[field] || [];
      const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(dropdownState.filterText.toLowerCase())
      );
  
      return (
        dropdownState.activeDropdown === field && (
     <div
  className="popup-overlay"
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1509,
    animation: 'fadeIn 0.3s ease-in-out'
  }}
><div
            className="dropdown-popup"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              width: '100%',
              maxWidth: '300px',
              padding: '10px',
              zIndex: 10,
              boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',   
              borderRadius: '18px',
              animation: 'popupOpen 0.3s ease-in-out',
            }}
          >
                <div className="p-1"
          style={{
            fontWeight: 500,
            fontSize: "15px",
            marginBottom: "10px",
            textAlign: "start",
                color: "grey",
          }}
        >
           Select or Search <span style={{color:"black"}}>{fieldLabels[field] || "Property Field"}</span>
        </div>
<div className="mb-1"
 style={{ 
  position: 'relative',
  width: '100%' ,
   background:"#EEF4FA",
    borderRadius:"25px"}}>
  <FcSearch
    size={16}
    style={{
      position: 'absolute',
      left: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color:"black",
    }}
  />
  <input
    className="m-0 rounded-0 ms-1"
    type="text"
    placeholder="Filter options..."
    value={dropdownState.filterText}
    onChange={handleFilterChange}
    style={{
      width: '100%',
      padding: '5px 5px 5px 30px', // left padding for the icon
      background: "transparent",
      border: "none",
      outline: "none",
    }}
  />
</div>

            <ul
              style={{
                listStyleType: 'none',
                padding: 0,
                margin: 0,
                    overflowY: 'auto',
              maxHeight: '350px',
              }}
            >
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
onClick={() => { 
  // Update advanced filters 
   setAdvancedFilters((prevState) => ({ ...prevState, [field]: option, })); 
   // Update the filters state
     setFilters((prevState) => ({ ...prevState, [field]: option, })); 
     // Toggle dropdown visibility
       toggleDropdown(field); }}

                  style={{
                    fontWeight:300,
                    padding: '5px',
                    cursor: 'pointer',
                    color:"grey",
                    marginBottom: '5px',
                    borderBottom:'1px solid #D0D7DE'
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-end">
        
              <button
                type="button"
                onClick={() => toggleDropdown(field)}
                style={{
                  background: '#0B57CF',
                  cursor: 'pointer',
                  border: 'none',
                  color:'#fff',
                  borderRadius:"10px"
                }}
              >Close
              </button>
            </div>
          </div></div>
        )
      );
    };
 

 
  const filteredProperties = properties.filter((property) => { 
    const basicFilterMatch = 
      (filters.id ? property.rentId?.toString().includes(filters.id) : true) &&
      (filters.propertyMode ? property.propertyMode?.toLowerCase().includes(filters.propertyMode.toLowerCase()) : true) &&
      (filters.propertyType ? property.propertyType?.toLowerCase().includes(filters.propertyType.toLowerCase()) : true) &&
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
      if (key === "minTotalArea") {
        return property.totalArea >= Number(advancedFilters[key]);
      }
      if (key === "minBedrooms") {
        return property.bedrooms >= Number(advancedFilters[key]);
      }
      if (key === "minAttachedBathrooms") {
        return property.attachedBathrooms >= Number(advancedFilters[key]);
      }
      if (key === "minWestern") {
        return property.western >= Number(advancedFilters[key]);
      }
  
      // Default behavior for other fields (string matching)
      return property[key]?.toString()?.toLowerCase()?.includes(advancedFilters[key]?.toLowerCase());
    });
  
    return basicFilterMatch && priceMatch && advancedFilterMatch;
  });
  
  useEffect(() => {
    const backdrop = document.querySelector('.modal-backdrop');
    if (isFilterPopupOpen && backdrop) {
      backdrop.style.pointerEvents = 'none';
    }
  }, [isFilterPopupOpen]);
  


  return (
    <Container fluid className="p-0 w-100 d-flex align-items-center justify-content-center ">
      <Helmet>
        <title>Rent Pondy | Properties</title>
      </Helmet>
      <Row className="g-3 w-100 ">
        <Col lg={12} className="d-flex align-items-center justify-content-center pt-2 m-0">
         <div className="suggection m-0"
      style={{
        width:"100%",
      display: 'flex',
    overflowX: 'auto',
    gap: '1rem',
    whiteSpace: 'nowrap',
    marginBottom: '1rem',
      }}
    >
              <style jsx>{`
   .suggection::-webkit-scrollbar {
  height: 3px; 
}

.suggection::-webkit-scrollbar-thumb {
  background-color: #6CBAAF; 
  /* border-radius: 4px;  */
}
.suggection::-webkit-scrollbar-thumb:hover {
  background-color: #6CBAAF; 
  cursor: pointer;
}

.suggection::-webkit-scrollbar-track {
  background-color: rgb(244, 235, 235); 
}
  `}</style>

   <div className="form-group m-0">
          <label style={{ width: '100%'}}>      
            <div style={{ display: "flex", alignItems: "center", width:"100%" }}>
              <div style={{ flex: "1" }}>
      
                <button
                  className="m-0 p-2"
                  type="button"
 onClick={handleReset}                  style={{
                    cursor: "pointer",
                    border: "none",
                    padding: "10px",
                    background: "#4F4B7E",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#fff",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
            <GrPowerReset />
                  </span>
Clear                </button>
                    </div>
            </div>
          </label>
        </div>

        <div className="form-group m-0">
          <label style={{ width: '100%'}}>      
            <div style={{ display: "flex", alignItems: "center", width:"100%" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="propertyMode"
                  value={advancedFilters.propertyMode || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select Property Mode</option>
                  {dataList.propertyMode?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("propertyMode")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
            <MdApproval />
                  </span>
                  {advancedFilters.propertyMode || "Select Property Mode"}
                </button>
      
                {renderDropdown("propertyMode")}
              </div>
            </div>
          </label>
        </div>
      
      
        <div className="form-group m-0">
          <label style={{ width: '100%'}}>
            <div style={{ display: "flex", alignItems: "center"}}>
              <div style={{ flex: "1" }}>
                <select
                  name="propertyType"
                  value={advancedFilters.propertyType || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select property Type</option>
                  {dataList.propertyType?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("propertyType")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
         <MdOutlineOtherHouses />
                  </span>
                  {advancedFilters.propertyType || "Select Property Type"}
                </button>
      
                {renderDropdown("propertyType")}
              </div>
            </div>
          </label>
        </div>
       <div className="form-group m-0">
          <label style={{ width: '100%'}}>
            <div style={{ display: "flex", alignItems: "center"}}>
              <div style={{ flex: "1" }}>
                <select
                  name="minPrice"
                  value={advancedFilters.minPrice || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select minPrice</option>
                  {dataList.minPrice?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("minPrice")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
<img src={minprice} alt="" />                   </span>
                  {advancedFilters.minPrice || "Select minPrice"}
                </button>
      
                {renderDropdown("minPrice")}
              </div>
            </div>
          </label>
        </div>
       
    <div className="form-group m-0">
          <label style={{ width: '100%'}}>
            <div style={{ display: "flex", alignItems: "center"}}>
              <div style={{ flex: "1" }}>
                <select
                  name="minPrice"
                  value={advancedFilters.maxPrice || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select maxPrice</option>
                  {dataList.maxPrice?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("maxPrice")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
 <img src={maxprice} alt="" />                </span>
                  {advancedFilters.maxPrice || "Select maxPrice"}
                </button>
      
                {renderDropdown("maxPrice")}
              </div>
            </div>
          </label>
        </div>
        {/* <div className="form-group m-0">
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <FaRupeeSign className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="tel"
            name="maxPrice"
            value={advancedFilters.maxPrice}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="Max price"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
        </div> */}
        {/* <div className="form-group m-0">
          <label style={{ width: '100%'}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="propertyAge"
                  value={advancedFilters.propertyAge || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select Property Age</option>
                  {dataList.propertyAge?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("propertyAge")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
            <MdSchedule />
                  </span>
                  {advancedFilters.propertyAge || "Select Property Age"}
                </button>
      
                {renderDropdown("propertyAge")}
              </div>
            </div>
          </label>
        </div> */}
{/*       
      
        <div className="form-group m-0">
          <label style={{ width: '100%'}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="bankLoan"
                  value={advancedFilters.bankLoan || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select Bank Loan</option>
                  {dataList.bankLoan?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("bankLoan")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
             <BsBank />
                  </span>
                  {advancedFilters.bankLoan || "Select Bank Loan"}
                </button>
      
                {renderDropdown("bankLoan")}
              </div>
            </div>
          </label>
        </div>
      

      
        <div className="form-group m-0">
          <label style={{ width: '100%'}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="negotiation"
                  value={advancedFilters.negotiation || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select negotiation</option>
                  {dataList.negotiation?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("negotiation")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
           <FaHandshake />
                  </span>
                  {advancedFilters.negotiation || "Selectnegotiation"}
                </button>
      
                {renderDropdown("negotiation")}
              </div>
            </div>
          </label>
        </div>
      
        <div className="form-group m-0">
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <AiOutlineColumnHeight className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="length"
            value={advancedFilters.length}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="length"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
        <div className="form-group m-0">
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <AiOutlineColumnWidth className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="breadth"
            value={advancedFilters.breadth}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="breadth"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
        </div>
        <div className="form-group m-0">
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <GiResize className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="totalArea"
            value={advancedFilters.totalArea}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="totalArea"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
        </div>
        <div className="form-group m-0">
  <div
    className="input-card p-0 rounded-1"
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border: '1px solid #4F4B7E', background: "#fff" }}
  >
    <GiResize className="input-icon" style={{ color: '#4F4B7E', marginLeft: "10px" }} />
    <input
      type="text"
      name="minTotalArea"
      value={advancedFilters.minTotalArea}
      onChange={handleAdvancedFilterChange}
      className="form-input m-0"
      placeholder="Min Total Area"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
</div>

          <div className="form-group m-0">
          <label style={{ width: '100%'}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="areaUnit"
                  value={advancedFilters.areaUnit || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select areaUnit</option>
                  {dataList.areaUnit?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("areaUnit")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                   <FaChartArea />
                  </span>
                  {advancedFilters.areaUnit || "Select areaUnit"}
                </button>
      
                {renderDropdown("areaUnit")}
              </div>
            </div>
          </label>
        </div>
      
        <div className="form-group m-0">
          <label style={{ width: '100%'}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="ownership"
                  value={advancedFilters.ownership || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select ownership</option>
                  {dataList.ownership?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("ownership")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
             <HiUserGroup />
                  </span>
                  {advancedFilters.ownership || "Select ownership"}
                </button>
      
                {renderDropdown("ownership")}
              </div>
            </div>
          </label>
        </div>
      
     
      
      <div className="form-group m-0">
          <label style={{ width: '100%'}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="bedrooms"
                  value={advancedFilters.bedrooms || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select bedrooms</option>
                  {dataList.bedrooms?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("bedrooms")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
          <FaBed />
                  </span>
                  {advancedFilters.bedrooms || "Select bedrooms"}
                </button>
      
                {renderDropdown("bedrooms")}
              </div>
            </div>
          </label>
        </div>

          
        <div className="form-group m-0">
      <label style={{ width: '100%' }}>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: "1", position: "relative" }}>
            <select
              name="minBedrooms"
              value={advancedFilters.minBedrooms || ""}
              onChange={handleAdvancedFilterChange}
              className="form-control"
              style={{ display: "none" }}
            >
              <option value="">Select min bedrooms</option>
              {filterOptions(["1", "2", "3", "4", "5", "6", "10"]).map((value, index) => (
                  <div
                    key={index}
                    style={{ padding: "10px", cursor: "pointer" }}
                    onClick={() => handleMinBedroomSelect(value)}
                  >
                    {value === "5" ? "5+ Bedrooms" :
                     value === "6" ? "6+ Bedrooms" :
                     value === "10" ? "10+ Bedrooms" :
                     `${value} Bedroom${value !== "1" ? "s" : ""}`}
                  </div>
                ))}
            </select>

            <button
              className="m-0"
              type="button"
              onClick={() => setShowMinBedroomsOptions(!showMinBedroomsOptions)}
              style={{
                cursor: "pointer",
                border: "1px solid #4F4B7E",
                padding: "10px",
                background: "#fff",
                borderRadius: "5px",
                width: "100%",
                textAlign: "left",
                color: "#4F4B7E",
              }}
            >
              <span style={{ marginRight: "10px" }}>
                <FaBed />
              </span>
              {advancedFilters.minBedrooms || "Select min bedrooms"}
            </button>

            {showMinBedroomsOptions && (
              <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                // backgroundColor: '#fff',
                backgroundColor: '#E9F7F2',
  
                width: '100%',
                // maxWidth: '400px',
                maxWidth: '350px',
  
                padding: '10px',
                zIndex: 10,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                overflowY: 'auto',
                maxHeight: '50vh',
                animation: 'popupOpen 0.3s ease-in-out',
                 scrollbarWidth:"none"
              }}
              >
                  <label       style={{
            fontWeight: "bold",
            fontSize: "16px",
            marginBottom: "10px",
            textAlign: "start",
            color: "#019988",
          }}> Min Bedrooms </label>
                    <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search options"
                  style={{
                    width: '80%',
                    padding: '5px',
    // marginBottom: '10px',
    background:"#C0DFDA",
    border:"none",
    outline:"none"   
                  }}
                />
                      <button
                type="button"
                onClick={closeMinBedroomsOptions}
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                }}
              >
                <FaTimes size={18} color="red" />
              </button>
              {filterOptions(["1", "2", "3", "4", "5", "6", "10"]).map((value, index) => (
                  <div
                    key={index}
                    style={{ padding: "10px", cursor: "pointer" , scrollbarWidth:"none" }}
                    onClick={() => handleMinBedroomSelect(value)}
                  >
                    {value === "5" ? "5 Bedrooms" :
                     value === "6" ? "6 Bedrooms" :
                     value === "10" ? "10 Bedrooms" :
                     `${value} Bedroom${value !== "1" ? "s" : ""}`}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </label>
    </div>

        <div className="form-group m-0">
          <label style={{ width: '100%'}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="kitchen"
                  value={advancedFilters.kitchen || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select kitchen</option>
                  {dataList.kitchen?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("kitchen")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
               <GiKitchenScale />
                  </span>
                  {advancedFilters.kitchen || "Select kitchen"}
                </button>
      
                {renderDropdown("kitchen")}
              </div>
            </div>
          </label>
        </div>
          <div className="form-group m-0">
          <label style={{ width: '100%'}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="kitchenType"
                  value={advancedFilters.kitchenType || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select kitchenType</option>
                  {dataList.kitchenType?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("kitchenType")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                 <FaKitchenSet />
                  </span>
                  {advancedFilters.kitchenType || "Select kitchenType"}
                </button>
      
                {renderDropdown("kitchenType")}
              </div>
            </div>
          </label>
        </div>
          <div className="form-group m-0">
          <label style={{ width: '100%'}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="balconies"
                  value={advancedFilters.balconies || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select balconies</option>
                  {dataList.balconies?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("balconies")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
              <MdOutlineMeetingRoom />
                  </span>
                  {advancedFilters.balconies || "Select balconies"}
                </button>
      
                {renderDropdown("balconies")}
              </div>
            </div>
          </label>
        </div>
          <div className="form-group m-0">
          <label style={{ width: '100%'}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="floorNo"
                  value={advancedFilters.floorNo || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select floorNo</option>
                  {dataList.floorNo?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("floorNo")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
              <BsBuildingsFill />
                  </span>
                  {advancedFilters.floorNo || "Select floorNo"}
                </button>
      
                {renderDropdown("floorNo")}
              </div>
            </div>
          </label>
        </div>
        
      
               
      
          <div className="form-group m-0">
          <label style={{ width: '100%'}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="propertyApproved"
                  value={advancedFilters.propertyApproved || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select propertyApproved</option>
                  {dataList.propertyApproved?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("propertyApproved")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                    <BsFillHouseCheckFill />
                  </span>
                  {advancedFilters.propertyApproved || "Select propertyApproved"}
                </button>
      
                {renderDropdown("propertyApproved")}
              </div>
            </div>
          </label>
        </div>
      
          <div className="form-group m-0">
          <label style={{ width: '100%'}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="postedBy"
                  value={advancedFilters.postedBy || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select postedBy</option>
                  {dataList.postedBy?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("postedBy")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
              <FaUserAlt />
                  </span>
                  {advancedFilters.postedBy || "Select postedBy"}
                </button>
      
                {renderDropdown("postedBy")}
              </div>
            </div>
          </label>
        </div>
          <div className="form-group m-0">
      
          <label style={{ width: '100%'}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="facing"
                  value={advancedFilters.facing || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select facing</option>
                  {dataList.facing?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("facing")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
               <TbArrowLeftRight />
                  </span>
                  {advancedFilters.facing || "Select facing"}
                </button>
      
                {renderDropdown("facing")}
              </div>
            </div>
          </label>
        </div>
      
          <div className="form-group m-0">
          <label style={{ width: '100%'}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="salesMode"
                  value={advancedFilters.salesMode || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select salesMode</option>
                  {dataList.salesMode?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("salesMode")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                  <GiGears />
                  </span>
                  {advancedFilters.salesMode || "Select salesMode"}
                </button>
      
                {renderDropdown("salesMode")}
              </div>
            </div>
          </label>
        </div>
       
      
      
     
      
        <div className="form-group m-0">
          <label style={{width:"100%"}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="furnished"
                  value={advancedFilters.furnished || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select furnished</option>
                  {dataList.furnished?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("furnished")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                     <FaHome />
                  </span>
                  {advancedFilters.furnished || "Select furnished"}
                </button>
      
                {renderDropdown("furnished")}
              </div>
            </div>
          </label>
        </div>
          <div className="form-group m-0">
          <label style={{ width: '100%'}}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="lift"
                  value={advancedFilters.lift || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select lift</option>
                  {dataList.lift?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("lift")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                    <MdElevator />
                  </span>
                  {advancedFilters.lift || "Select lift"}
                </button>
      
                {renderDropdown("lift")}
              </div>
            </div>
          </label>
        </div>
      
            <div className="form-group m-0">
          <label style={{ width: '100%'}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="attachedBathrooms"
                  value={advancedFilters.attachedBathrooms || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select attachedBathrooms</option>
                  {dataList.attachedBathrooms?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("attachedBathrooms")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                   <FaBath />
                  </span>
                  {advancedFilters.attachedBathrooms || "Select attachedBathrooms"}
                </button>
      
                {renderDropdown("attachedBathrooms")}
              </div>
            </div>
          </label>
        </div>

        <div className="form-group m-0">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: "1", position: "relative" }}>
            <select
              name="minAttachedBathrooms"
              value={advancedFilters.minAttachedBathrooms || ""}
              onChange={(e) => handleMinAttachedBathroomsSelect(e.target.value)}
              className="form-control"
              style={{ display: "none" }}
            >
              <option value="">Select min attached bathrooms</option>
              {filterOptions(["1", "2", "3", "4", "5"]).map((value, index) => (
                <option key={index} value={value}>
                  {value === "5" ? "5+ Bathrooms" : `${value} Bathroom${value !== "1" ? "s" : ""}`}
                </option>
              ))}
            </select>
            <button
              className="m-0"
              type="button"
              onClick={() => setShowMinAttachedBathroomsOptions(!showMinAttachedBathroomsOptions)}
              style={{
                cursor: "pointer",
                border: "1px solid #4F4B7E",
                padding: "10px",
                background: "#fff",
                borderRadius: "5px",
                width: "100%",
                textAlign: "left",
                color: "#4F4B7E",
              }}
            >
              <span style={{ marginRight: "10px" }}>
                <FaBath />
              </span>
              {advancedFilters.minAttachedBathrooms || "Select min attached bathrooms"}
            </button>
            {showMinAttachedBathroomsOptions && (
              <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                // backgroundColor: '#fff',
                backgroundColor: '#E9F7F2',
  
                width: '100%',
                // maxWidth: '400px',
                maxWidth: '350px',
  
                padding: '10px',
                zIndex: 10,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                overflowY: 'auto',
                maxHeight: '50vh',
                animation: 'popupOpen 0.3s ease-in-out',
                 scrollbarWidth:"none"
              }}
              >
                <label       style={{
            fontWeight: "bold",
            fontSize: "16px",
            marginBottom: "10px",
            textAlign: "start",
            color: "#019988",
          }}> Min Attached Bathrooms</label>
                  <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search options"
                  style={{
                    width: '80%',
                    padding: '5px',
    // marginBottom: '10px',
    background:"#C0DFDA",
    border:"none",
    outline:"none"   
                  }}
                />
                    <button
                type="button"
                onClick={closeMinAttachedBathroomsOptions}
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                }}
              >
                <FaTimes size={18} color="red" />
              </button>
               
             {filterOptions(["1", "2", "3", "4", "5"]).map((value, index) => (
                  <div
                    key={index}
                    style={{ padding: "10px", cursor: "pointer" }}
                    onClick={() => handleMinAttachedBathroomsSelect(value)}
                  >
                    {value === "5" ? "5 Bathrooms" : `${value} Bathroom${value !== "1" ? "s" : ""}`}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

          <div className="form-group m-0">
      
          <label style={{ width: '100%'}}>
      
            <div style={{ display: "flex", alignItems: "center"}}>
              <div style={{ flex: "1" }}>
                <select
                  name="western"
                  value={advancedFilters.western || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select western</option>
                  {dataList.western?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("western")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                     <FaToilet />
                  </span>
                  {advancedFilters.western || "Select western"}
                </button>
      
                {renderDropdown("western")}
              </div>
            </div>
          </label>
        </div>
        <div className="form-group m-0">

        <label style={{ width: '100%' }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: "1", position: "relative" }}>
            <select
              name="minWestern"
              value={advancedFilters.minWestern || ""}
              onChange={(e) => handleMinWesternSelect(e.target.value)}
              className="form-control"
              style={{ display: "none" }}
            >
              <option value="">Select min western</option>
              {filterOptions(["1", "2", "3", "4", "5"]).map((value, index) => (
                <option key={index} value={value}>
                  {value === "5" ? "5+ Western" : `${value} Western`}
                </option>
              ))}
            </select>
            <button
              className="m-0"
              type="button"
              onClick={() => setShowMinWesternOptions(!showMinWesternOptions)}
              style={{
                cursor: "pointer",
                border: "1px solid #4F4B7E",
                padding: "10px",
                background: "#fff",
                borderRadius: "5px",
                width: "100%",
                textAlign: "left",
                color: "#4F4B7E",
              }}
            >
              <span style={{ marginRight: "10px" }}>
                <FaBath />
              </span>
              {advancedFilters.minWestern || "Select min western"}
            </button>
            {showMinWesternOptions && (
              <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                // backgroundColor: '#fff',
                backgroundColor: '#E9F7F2',
  
                width: '100%',
                // maxWidth: '400px',
                maxWidth: '350px',
  
                padding: '10px',
                zIndex: 10,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                overflowY: 'auto',
                maxHeight: '50vh',
                animation: 'popupOpen 0.3s ease-in-out',
                scrollbarWidth:"none"
              }}
              >  <label       style={{
                fontWeight: "bold",
                fontSize: "16px",
                marginBottom: "10px",
                textAlign: "start",
                color: "#019988",
              }}> Min Western Bathrooms</label>
                      <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search options"
                  style={{
                    width: '80%',
                    padding: '5px',
    // marginBottom: '10px',
    background:"#C0DFDA",
    border:"none",
    outline:"none"   
                  }}
                />
                    <button
                type="button"
                onClick={closeMinWesternOptions}
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                }}
              >
                <FaTimes size={18} color="red" />
              </button>
             {filterOptions(["1", "2", "3", "4", "5"]).map((value, index) => (
  <div
    key={index}
    style={{ padding: "10px", cursor: "pointer" }}
    onClick={() => handleMinWesternSelect(value)}
  >
    {value === "5" ? "5 Western" : `${value} Western`}
  </div>
))}

              </div>
            )}
          </div>
        </div>
      </label>
      </div>

          <div className="form-group m-0">
      
          <label style={{ width: '100%'}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="numberOfFloors"
                  value={advancedFilters.numberOfFloors || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select numberOfFloors</option>
                  {dataList.numberOfFloors?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("numberOfFloors")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                     <BsBuildingsFill />
                  </span>
                  {advancedFilters.numberOfFloors || "Select numberOfFloors"}
                </button>
      
                {renderDropdown("numberOfFloors")}
              </div>
            </div>
          </label>
        </div>
      
          <div className="form-group m-0">
          <label style={{ width: '100%'}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="carParking"
                  value={advancedFilters.carParking || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select carParking</option>
                  {dataList.carParking?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("carParking")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                    <FaCar />
                  </span>
                  {advancedFilters.carParking || "Select carParking"}
                </button>
      
                {renderDropdown("carParking")}
              </div>
            </div>
          </label>
        </div>
      
      
     
      
      
        <div className="form-group m-0">
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <BiWorld className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="country"
            value={advancedFilters.country}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="country"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
        </div>
        
      
      <div className="form-group m-0">
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <MdLocationCity className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="state"
            value={advancedFilters.state}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="State"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
      
      <div className="form-group m-0">
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <FaCity className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="city"
            value={advancedFilters.city}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="City"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
      
        <div className="form-group m-0">
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <FaRegAddressCard className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="district"
            value={advancedFilters.district}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="District"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
        <div className="form-group m-0">
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <MdLocationOn className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="area"
            value={advancedFilters.area}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="Area"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
        <div className="form-group m-0">
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <FaRoad className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="streetName"
            value={advancedFilters.streetName}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="Street Name"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
        <div className="form-group m-0">
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <FaDoorClosed className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="doorNumber"
            value={advancedFilters.doorNumber}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="Door Number"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
        </div>
      
        <div className="form-group m-0">
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <FaMapPin className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="nagar"
            value={advancedFilters.nagar}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="Nagar"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
      
        
    

        <div className="form-group m-0" >
          <label style={{width:'100%'}}>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="bestTimeToCall"
                  value={advancedFilters.bestTimeToCall || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select bestTimeToCall</option>
                  {dataList.bestTimeToCall?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("bestTimeToCall")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                    <FaHome />
                  </span>
                  {advancedFilters.bestTimeToCall || "Select bestTimeToCall"}
                </button>
      
                {renderDropdown("bestTimeToCall")}
              </div>
            </div>
          </label>
        </div> */}

      </div>
        </Col>
      {/* <div
  className="d-flex flex-column justify-content-center align-items-center"
  data-bs-toggle="modal"
  data-bs-target="#propertyModal"
  style={{
    height: '50px',
    width: '50px',
    background: '#4F4B7E',
    borderRadius: '50%',
    position: 'fixed',
    right: 'calc(50% - 187.5px + 10px)', // Center - half of 375px + some offset
    bottom: '15%',
    zIndex: '1',
  }}
>
  <BiSearchAlt fontSize={24} color="#fff" />
</div> */}

{/* Modal */}
{/* <div
  className="modal fade"
  id="propertyModal"
  tabIndex="-1"
  data-bs-backdrop="false"
  data-bs-keyboard="false"
  style={{  backgroundColor: 'rgba(64, 64, 64, 0.9)', // white with 90% opacity
    backdropFilter: 'blur(1px)', // optional for a frosted-glass effect
}}
>
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content rounded-5 shadow" 
     style={{
      width: "350px",
      margin: "0 auto", // centers horizontally
     
    }}    >
      <div className="modal-body py-4">
        <div className="d-grid gap-2 mb-2">
          <button style={{background:"#DFDFDF" , color:"#5E5E5E" , fontWeight:600 , fontSize:"15px"}}
            className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
            data-bs-toggle="modal"
            data-bs-target="#filterPopup" // Nested modal
          >
            <FaHome className="me-2" /> Search Property
          </button>

          <button style={{background:"#DFDFDF" , color:"#5E5E5E" , fontWeight:600 , fontSize:"15px"}}
          className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
                onClick={() => navigate(`/FormComponent`)}
>
            <FaUsers className="me-2" /> Buyer Search
          </button>

          <button style={{background:"#DFDFDF" , color:"#5E5E5E" , fontWeight:600 , fontSize:"15px"}}
          className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
                          onClick={() => navigate(`/Sort-Property`)}
>
            <FaSortAmountDownAlt className="me-2" /> Quick Sort
          </button>

          <button style={{background:"#DFDFDF" , color:"#5E5E5E" , fontWeight:600 , fontSize:"15px"}}
          className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
      onClick={() => navigate(`/Property-Assistance-Search/${phoneNumber}`)}
      >
            <FaHeadset className="me-2" /> Property Assistance
          </button>
        </div>

        <div className="text-center" >
          <button className="btn btn-primary rounded-2 px-4 mt-2" data-bs-dismiss="modal"
          style={{ fontWeight:500 , fontSize:"10px"}}>
            CANCEL
          </button>
        </div>
      </div>
    </div>
  </div>
</div> */}

{/* Filter Popup (Nested Modal) */}
{/* <div
  className="modal fade"
  id="filterPopup"
  tabIndex="-1"
  aria-labelledby="filterPopupLabel"
  aria-hidden="true"
>
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content rounded-4 shadow">
      <div className="modal-header">
        <h5 className="modal-title" id="filterPopupLabel">Search Property</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <div className="form-group m-0">
          <label>ID</label>
          <div
            className="input-card p-0 rounded-1"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              border: '1px solid #4F4B7E',
              background: '#fff',
            }}
          >
            <FaIdCard className="input-icon" style={{ color: '#4F4B7E', marginLeft: '10px' }} />
            <input
              type="text"
              name="id"
              value={filters.id}
              onChange={handleFilterChange}
              className="form-input m-0"
              placeholder="ID"
              style={{
                flex: '1 0 80%',
                padding: '8px',
                fontSize: '14px',
                border: 'none',
                outline: 'none',
              }}
            />
          </div>
        </div>

       
        <div className="form-group m-0">
          <label>                value={filters.minPrice || ''}
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: '1' }}>
              <select
                name="minPrice"
                value={filters.minPrice || ''}
                onChange={handleFilterChange}
                className="form-control"
                style={{ display: 'none' }}
              >
                <option value="">Select minPrice</option>
                {dataList.minPrice?.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <button
                className="m-0"
                type="button"
                onClick={() => toggleDropdown('minPrice')}
                style={{
                  cursor: 'pointer',
                  border: '1px solid #4F4B7E',
                  padding: '10px',
                  background: '#fff',
                  borderRadius: '5px',
                  width: '100%',
                  textAlign: 'left',
                  color: '#4F4B7E',
                }}
              >
                <span style={{ marginRight: '10px' }}>
                <img src={minprice} alt="" />
                </span>
                {filters.minPrice || 'Select minPrice'}
              </button>

              {renderDropdown('minPrice')}
            </div>
          </div>
        </div>

<div className="form-group m-0">
          <label>maxPrice</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: '1' }}>
              <select
                name="maxPrice"
                value={filters.maxPrice || ''}
                onChange={handleFilterChange}
                className="form-control"
                style={{ display: 'none' }}
              >
                <option value="">Select maxPrice</option>
                {dataList.maxPrice?.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <button
                className="m-0"
                type="button"
                onClick={() => toggleDropdown('maxPrice')}
                style={{
                  cursor: 'pointer',
                  border: '1px solid #4F4B7E',
                  padding: '10px',
                  background: '#fff',
                  borderRadius: '5px',
                  width: '100%',
                  textAlign: 'left',
                  color: '#4F4B7E',
                }}
              >
                <span style={{ marginRight: '10px' }}>
                <img src={maxprice} alt="" />
                </span>
                {filters.maxPrice || 'Select maxPrice'}
              </button>

              {renderDropdown('maxPrice')}
            </div>
          </div>
        </div>
  <div className="form-group m-0">
          <label>Property Mode</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: '1' }}>
              <select
                name="propertyMode"
                value={filters.propertyMode || ''}
                onChange={handleFilterChange}
                className="form-control"
                style={{ display: 'none' }}
              >
                <option value="">Select Property Mode</option>
                {dataList.propertyMode?.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <button
                className="m-0"
                type="button"
                onClick={() => toggleDropdown('propertyMode')}
                style={{
                  cursor: 'pointer',
                  border: '1px solid #4F4B7E',
                  padding: '10px',
                  background: '#fff',
                  borderRadius: '5px',
                  width: '100%',
                  textAlign: 'left',
                  color: '#4F4B7E',
                }}
              >
                <span style={{ marginRight: '10px' }}>
                  <MdApproval />
                </span>
                {filters.propertyMode || 'Select Property Mode'}
              </button>

              {renderDropdown('propertyMode')}
            </div>
          </div>
        </div>
    
      
        <div className="form-group m-0">
          <label style={{ width: '100%'}}>
      <label>Property Type  </label>
            <div style={{ display: "flex", alignItems: "center"}}>
              <div style={{ flex: "1" }}>
                <select
                  name="propertyType"
                  value={advancedFilters.propertyType || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select property Type</option>
                  {dataList.propertyType?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("propertyType")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
         <MdOutlineOtherHouses />
                  </span>
                  {filters.propertyType || "Select Property Type"}
                </button>
      
                {renderDropdown("propertyType")}
              </div>
            </div>
          </label>
        </div>
        <div className="form-group m-0">
          <label>City</label>
          <div
            className="input-card p-0 rounded-1"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              border: '1px solid #4F4B7E',
              background: '#fff',
            }}
          >
            <FaCity className="input-icon" style={{ color: '#4F4B7E', marginLeft: '10px' }} />
            <input
              type="tel"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              className="form-input m-0"
              placeholder="City"
              style={{
                flex: '1 0 80%',
                padding: '8px',
                fontSize: '14px',
                border: 'none',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div className="text-center mt-3 ">
        <button  aria-label="Close"  data-bs-dismiss="modal"
        type="button"
        className="btn w-100"
        style={{
          backgroundColor: hoverSearch ? '#58a09b' : '#6EB7B2',
          color: '#fff',
          border: 'none',
        }}
        onMouseEnter={() => setHoverSearch(true)}
        onMouseLeave={() => setHoverSearch(false)}
      >
        SEARCH
      </button>

      <button
        type="button"
        className="btn w-100 mt-3"
        style={{
          backgroundColor: hoverAdvance ? '#6EB7B2' : 'transparent',
          color: hoverAdvance ? '#fff' : '#6EB7B2',
          border: `1px solid #6EB7B2`,
        }}
        onMouseEnter={() => setHoverAdvance(true)}
        onMouseLeave={() => setHoverAdvance(false)}
        data-bs-toggle="modal"
        data-bs-target="#advancedFilterPopup"
      >
        GO TO ADVANCED SEARCH
      </button>
        </div>
      </div>
    </div>
  </div>
</div> */}

{/* Advanced Filter Popup */}
{/* <div
  className="modal fade"
  id="advancedFilterPopup"
  tabIndex="-1"
  aria-labelledby="advancedFilterPopupLabel"
  aria-hidden="true"
>
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content rounded-4 shadow">
      <div className="modal-header">
        <h5 className="modal-title" id="advancedFilterPopupLabel">Advanced Search</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div className="modal-body">
    <div
      style={{
        display: 'flex',
        overflowX: 'auto',
        padding: '1rem',
        gap: '1rem',
        whiteSpace: 'nowrap',
        border: '1px solid #ccc',
      }}
    >
        <div className="form-group m-0">
  <label>Phone Number:</label>
  <div
    className="input-card p-0 rounded-1"
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border: '1px solid #4F4B7E', background: "#fff" }}
  >
    <FaPhone   className="input-icon" style={{ color: '#4F4B7E', marginLeft: "10px" }} />
    <input
      type="text"
      name="phoneNumber"
      value={advancedFilters.phoneNumber}
      onChange={handleAdvancedFilterChange}
      className="form-input m-0"
      placeholder="Phone Number"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
</div>

        <div className="form-group m-0">
          <label style={{ width: '100%'}}>
          <label>Property Mode  </label>
      
            <div style={{ display: "flex", alignItems: "center", width:"100%" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="propertyMode"
                  value={advancedFilters.propertyMode || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select Property Mode</option>
                  {dataList.propertyMode?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("propertyMode")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
            <MdApproval />
                  </span>
                  {advancedFilters.propertyMode || "Select Property Mode"}
                </button>
      
                {renderDropdown("propertyMode")}
              </div>
            </div>
          </label>
        </div>
      
      
        <div className="form-group m-0">
          <label style={{ width: '100%'}}>
      <label>Property Type  </label>
            <div style={{ display: "flex", alignItems: "center"}}>
              <div style={{ flex: "1" }}>
                <select
                  name="propertyType"
                  value={advancedFilters.propertyType || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select property Type</option>
                  {dataList.propertyType?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("propertyType")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
         <MdOutlineOtherHouses />
                  </span>
                  {advancedFilters.propertyType || "Select Property Type"}
                </button>
      
                {renderDropdown("propertyType")}
              </div>
            </div>
          </label>
        </div>
       
        <div className="form-group m-0">
        <label>Min Price  </label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <FaRupeeSign className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="tel"
            name="minPrice"
            value={advancedFilters.minPrice}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="Min price"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
        </div>

        <div className="form-group m-0">
        <label>Max Price  </label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <FaRupeeSign className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="tel"
            name="maxPrice"
            value={advancedFilters.maxPrice}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="Max price"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
        </div>
        <div className="form-group m-0">
          <label style={{ width: '100%'}}>
          <label>Property Age </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="propertyAge"
                  value={advancedFilters.propertyAge || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select Property Age</option>
                  {dataList.propertyAge?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("propertyAge")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
            <MdSchedule />
                  </span>
                  {advancedFilters.propertyAge || "Select Property Age"}
                </button>
      
                {renderDropdown("propertyAge")}
              </div>
            </div>
          </label>
        </div>
      
      
        <div className="form-group m-0">
          <label style={{ width: '100%'}}>
          <label>Bank Loan </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="bankLoan"
                  value={advancedFilters.bankLoan || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select Bank Loan</option>
                  {dataList.bankLoan?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("bankLoan")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
             <BsBank />
                  </span>
                  {advancedFilters.bankLoan || "Select Bank Loan"}
                </button>
      
                {renderDropdown("bankLoan")}
              </div>
            </div>
          </label>
        </div>
      

      
        <div className="form-group m-0">
          <label style={{ width: '100%'}}>
          <label>Negotiation </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="negotiation"
                  value={advancedFilters.negotiation || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select negotiation</option>
                  {dataList.negotiation?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("negotiation")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
           <FaHandshake />
                  </span>
                  {advancedFilters.negotiation || "Selectnegotiation"}
                </button>
      
                {renderDropdown("negotiation")}
              </div>
            </div>
          </label>
        </div>
      
        <div className="form-group m-0">
        <label>length:</label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <AiOutlineColumnHeight className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="length"
            value={advancedFilters.length}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="length"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
        <div className="form-group m-0">
        <label>breadth:</label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <AiOutlineColumnWidth className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="breadth"
            value={advancedFilters.breadth}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="breadth"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
        </div>
        <div className="form-group m-0">
        <label>Total Area:  </label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <GiResize className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="totalArea"
            value={advancedFilters.totalArea}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="totalArea"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
        </div>
        <div className="form-group m-0">
  <label>Min Total Area:</label>
  <div
    className="input-card p-0 rounded-1"
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border: '1px solid #4F4B7E', background: "#fff" }}
  >
    <GiResize className="input-icon" style={{ color: '#4F4B7E', marginLeft: "10px" }} />
    <input
      type="text"
      name="minTotalArea"
      value={advancedFilters.minTotalArea}
      onChange={handleAdvancedFilterChange}
      className="form-input m-0"
      placeholder="Min Total Area"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
</div>

          <div className="form-group m-0">
          <label style={{ width: '100%'}}>
          <label>Area Unit  </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="areaUnit"
                  value={advancedFilters.areaUnit || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select areaUnit</option>
                  {dataList.areaUnit?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("areaUnit")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                   <FaChartArea />
                  </span>
                  {advancedFilters.areaUnit || "Select areaUnit"}
                </button>
      
                {renderDropdown("areaUnit")}
              </div>
            </div>
          </label>
        </div>
      
        <div className="form-group m-0">
          <label style={{ width: '100%'}}>
          <label>Ownership </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="ownership"
                  value={advancedFilters.ownership || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select ownership</option>
                  {dataList.ownership?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("ownership")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
             <HiUserGroup />
                  </span>
                  {advancedFilters.ownership || "Select ownership"}
                </button>
      
                {renderDropdown("ownership")}
              </div>
            </div>
          </label>
        </div>
      
     
      
      <div className="form-group m-0">
          <label style={{ width: '100%'}}>
          <label>bedrooms </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="bedrooms"
                  value={advancedFilters.bedrooms || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select bedrooms</option>
                  {dataList.bedrooms?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("bedrooms")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
          <FaBed />
                  </span>
                  {advancedFilters.bedrooms || "Select bedrooms"}
                </button>
      
                {renderDropdown("bedrooms")}
              </div>
            </div>
          </label>
        </div>

          
        <div className="form-group m-0">
      <label style={{ width: '100%' }}>
        <label>Min Bedrooms</label>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: "1", position: "relative" }}>
            <select
              name="minBedrooms"
              value={advancedFilters.minBedrooms || ""}
              onChange={handleAdvancedFilterChange}
              className="form-control"
              style={{ display: "none" }}
            >
              <option value="">Select min bedrooms</option>
              {filterOptions(["1", "2", "3", "4", "5", "6", "10"]).map((value, index) => (
                  <div
                    key={index}
                    style={{ padding: "10px", cursor: "pointer" }}
                    onClick={() => handleMinBedroomSelect(value)}
                  >
                    {value === "5" ? "5+ Bedrooms" :
                     value === "6" ? "6+ Bedrooms" :
                     value === "10" ? "10+ Bedrooms" :
                     `${value} Bedroom${value !== "1" ? "s" : ""}`}
                  </div>
                ))}
            </select>

            <button
              className="m-0"
              type="button"
              onClick={() => setShowMinBedroomsOptions(!showMinBedroomsOptions)}
              style={{
                cursor: "pointer",
                border: "1px solid #4F4B7E",
                padding: "10px",
                background: "#fff",
                borderRadius: "5px",
                width: "100%",
                textAlign: "left",
                color: "#4F4B7E",
              }}
            >
              <span style={{ marginRight: "10px" }}>
                <FaBed />
              </span>
              {advancedFilters.minBedrooms || "Select min bedrooms"}
            </button>

            {showMinBedroomsOptions && (
              <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                // backgroundColor: '#fff',
                backgroundColor: '#E9F7F2',
  
                width: '100%',
                // maxWidth: '400px',
                maxWidth: '350px',
  
                padding: '10px',
                zIndex: 10,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                overflowY: 'auto',
                maxHeight: '50vh',
                animation: 'popupOpen 0.3s ease-in-out',
                 scrollbarWidth:"none"
              }}
              >
                  <label       style={{
            fontWeight: "bold",
            fontSize: "16px",
            marginBottom: "10px",
            textAlign: "start",
            color: "#019988",
          }}> Min Bedrooms </label>
                    <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search options"
                  style={{
                    width: '80%',
                    padding: '5px',
    // marginBottom: '10px',
    background:"#C0DFDA",
    border:"none",
    outline:"none"   
                  }}
                />
                      <button
                type="button"
                onClick={closeMinBedroomsOptions}
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                }}
              >
                <FaTimes size={18} color="red" />
              </button>
              {filterOptions(["1", "2", "3", "4", "5", "6", "10"]).map((value, index) => (
                  <div
                    key={index}
                    style={{ padding: "10px", cursor: "pointer" , scrollbarWidth:"none" }}
                    onClick={() => handleMinBedroomSelect(value)}
                  >
                    {value === "5" ? "5 Bedrooms" :
                     value === "6" ? "6 Bedrooms" :
                     value === "10" ? "10 Bedrooms" :
                     `${value} Bedroom${value !== "1" ? "s" : ""}`}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </label>
    </div>

        <div className="form-group m-0">
          <label style={{ width: '100%'}}>
          <label>kitchen </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="kitchen"
                  value={advancedFilters.kitchen || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select kitchen</option>
                  {dataList.kitchen?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("kitchen")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
               <GiKitchenScale />
                  </span>
                  {advancedFilters.kitchen || "Select kitchen"}
                </button>
      
                {renderDropdown("kitchen")}
              </div>
            </div>
          </label>
        </div>
          <div className="form-group m-0">
          <label style={{ width: '100%'}}>
          <label>kitchenType </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="kitchenType"
                  value={advancedFilters.kitchenType || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select kitchenType</option>
                  {dataList.kitchenType?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("kitchenType")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                 <FaKitchenSet />
                  </span>
                  {advancedFilters.kitchenType || "Select kitchenType"}
                </button>
      
                {renderDropdown("kitchenType")}
              </div>
            </div>
          </label>
        </div>
          <div className="form-group m-0">
          <label style={{ width: '100%'}}>
          <label>balconies </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="balconies"
                  value={advancedFilters.balconies || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select balconies</option>
                  {dataList.balconies?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("balconies")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
              <MdOutlineMeetingRoom />
                  </span>
                  {advancedFilters.balconies || "Select balconies"}
                </button>
      
                {renderDropdown("balconies")}
              </div>
            </div>
          </label>
        </div>
          <div className="form-group m-0">
          <label style={{ width: '100%'}}>
          <label>floorNo </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="floorNo"
                  value={advancedFilters.floorNo || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select floorNo</option>
                  {dataList.floorNo?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("floorNo")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
              <BsBuildingsFill />
                  </span>
                  {advancedFilters.floorNo || "Select floorNo"}
                </button>
      
                {renderDropdown("floorNo")}
              </div>
            </div>
          </label>
        </div>
        
      
               
      
          <div className="form-group m-0">
          <label style={{ width: '100%'}}>
          <label>property Approved</label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="propertyApproved"
                  value={advancedFilters.propertyApproved || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select propertyApproved</option>
                  {dataList.propertyApproved?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("propertyApproved")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                    <BsFillHouseCheckFill />
                  </span>
                  {advancedFilters.propertyApproved || "Select propertyApproved"}
                </button>
      
                {renderDropdown("propertyApproved")}
              </div>
            </div>
          </label>
        </div>
      
          <div className="form-group m-0">
          <label style={{ width: '100%'}}>
          <label>postedBy  </label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="postedBy"
                  value={advancedFilters.postedBy || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select postedBy</option>
                  {dataList.postedBy?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("postedBy")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
              <FaUserAlt />
                  </span>
                  {advancedFilters.postedBy || "Select postedBy"}
                </button>
      
                {renderDropdown("postedBy")}
              </div>
            </div>
          </label>
        </div>
          <div className="form-group m-0">
      
          <label style={{ width: '100%'}}>
          <label>facing</label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="facing"
                  value={advancedFilters.facing || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select facing</option>
                  {dataList.facing?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("facing")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
               <TbArrowLeftRight />
                  </span>
                  {advancedFilters.facing || "Select facing"}
                </button>
      
                {renderDropdown("facing")}
              </div>
            </div>
          </label>
        </div>
      
          <div className="form-group m-0">
          <label style={{ width: '100%'}}>
          <label>sales Mode</label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="salesMode"
                  value={advancedFilters.salesMode || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select salesMode</option>
                  {dataList.salesMode?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("salesMode")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                  <GiGears />
                  </span>
                  {advancedFilters.salesMode || "Select salesMode"}
                </button>
      
                {renderDropdown("salesMode")}
              </div>
            </div>
          </label>
        </div>
       
      
      
     
      
        <div className="form-group m-0">
          <label style={{width:"100%"}}>
          <label>furnished</label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="furnished"
                  value={advancedFilters.furnished || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select furnished</option>
                  {dataList.furnished?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("furnished")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                     <FaHome />
                  </span>
                  {advancedFilters.furnished || "Select furnished"}
                </button>
      
                {renderDropdown("furnished")}
              </div>
            </div>
          </label>
        </div>
          <div className="form-group m-0">
          <label style={{ width: '100%'}}>
            <label>lift</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="lift"
                  value={advancedFilters.lift || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select lift</option>
                  {dataList.lift?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("lift")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                    <MdElevator />
                  </span>
                  {advancedFilters.lift || "Select lift"}
                </button>
      
                {renderDropdown("lift")}
              </div>
            </div>
          </label>
        </div>
      
            <div className="form-group m-0">
          <label style={{ width: '100%'}}>
          <label>attached Bathrooms</label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="attachedBathrooms"
                  value={advancedFilters.attachedBathrooms || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select attachedBathrooms</option>
                  {dataList.attachedBathrooms?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("attachedBathrooms")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                   <FaBath />
                  </span>
                  {advancedFilters.attachedBathrooms || "Select attachedBathrooms"}
                </button>
      
                {renderDropdown("attachedBathrooms")}
              </div>
            </div>
          </label>
        </div>

        <div className="form-group m-0">
        <label>Min Attached Bathrooms</label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: "1", position: "relative" }}>
            <select
              name="minAttachedBathrooms"
              value={advancedFilters.minAttachedBathrooms || ""}
              onChange={(e) => handleMinAttachedBathroomsSelect(e.target.value)}
              className="form-control"
              style={{ display: "none" }}
            >
              <option value="">Select min attached bathrooms</option>
              {filterOptions(["1", "2", "3", "4", "5"]).map((value, index) => (
                <option key={index} value={value}>
                  {value === "5" ? "5+ Bathrooms" : `${value} Bathroom${value !== "1" ? "s" : ""}`}
                </option>
              ))}
            </select>
            <button
              className="m-0"
              type="button"
              onClick={() => setShowMinAttachedBathroomsOptions(!showMinAttachedBathroomsOptions)}
              style={{
                cursor: "pointer",
                border: "1px solid #4F4B7E",
                padding: "10px",
                background: "#fff",
                borderRadius: "5px",
                width: "100%",
                textAlign: "left",
                color: "#4F4B7E",
              }}
            >
              <span style={{ marginRight: "10px" }}>
                <FaBath />
              </span>
              {advancedFilters.minAttachedBathrooms || "Select min attached bathrooms"}
            </button>
            {showMinAttachedBathroomsOptions && (
              <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                // backgroundColor: '#fff',
                backgroundColor: '#E9F7F2',
  
                width: '100%',
                // maxWidth: '400px',
                maxWidth: '350px',
  
                padding: '10px',
                zIndex: 10,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                overflowY: 'auto',
                maxHeight: '50vh',
                animation: 'popupOpen 0.3s ease-in-out',
                 scrollbarWidth:"none"
              }}
              >
                <label       style={{
            fontWeight: "bold",
            fontSize: "16px",
            marginBottom: "10px",
            textAlign: "start",
            color: "#019988",
          }}> Min Attached Bathrooms</label>
                  <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search options"
                  style={{
                    width: '80%',
                    padding: '5px',
    // marginBottom: '10px',
    background:"#C0DFDA",
    border:"none",
    outline:"none"   
                  }}
                />
                    <button
                type="button"
                onClick={closeMinAttachedBathroomsOptions}
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                }}
              >
                <FaTimes size={18} color="red" />
              </button>
               
             {filterOptions(["1", "2", "3", "4", "5"]).map((value, index) => (
                  <div
                    key={index}
                    style={{ padding: "10px", cursor: "pointer" }}
                    onClick={() => handleMinAttachedBathroomsSelect(value)}
                  >
                    {value === "5" ? "5 Bathrooms" : `${value} Bathroom${value !== "1" ? "s" : ""}`}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

          <div className="form-group m-0">
      
          <label style={{ width: '100%'}}>
          <label  >western</label>
      
            <div style={{ display: "flex", alignItems: "center"}}>
              <div style={{ flex: "1" }}>
                <select
                  name="western"
                  value={advancedFilters.western || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select western</option>
                  {dataList.western?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("western")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                     <FaToilet />
                  </span>
                  {advancedFilters.western || "Select western"}
                </button>
      
                {renderDropdown("western")}
              </div>
            </div>
          </label>
        </div>
        <div className="form-group m-0">

        <label style={{ width: '100%' }}>
        <label>Min Western</label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: "1", position: "relative" }}>
            <select
              name="minWestern"
              value={advancedFilters.minWestern || ""}
              onChange={(e) => handleMinWesternSelect(e.target.value)}
              className="form-control"
              style={{ display: "none" }}
            >
              <option value="">Select min western</option>
              {filterOptions(["1", "2", "3", "4", "5"]).map((value, index) => (
                <option key={index} value={value}>
                  {value === "5" ? "5+ Western" : `${value} Western`}
                </option>
              ))}
            </select>
            <button
              className="m-0"
              type="button"
              onClick={() => setShowMinWesternOptions(!showMinWesternOptions)}
              style={{
                cursor: "pointer",
                border: "1px solid #4F4B7E",
                padding: "10px",
                background: "#fff",
                borderRadius: "5px",
                width: "100%",
                textAlign: "left",
                color: "#4F4B7E",
              }}
            >
              <span style={{ marginRight: "10px" }}>
                <FaBath />
              </span>
              {advancedFilters.minWestern || "Select min western"}
            </button>
            {showMinWesternOptions && (
              <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                // backgroundColor: '#fff',
                backgroundColor: '#E9F7F2',
  
                width: '100%',
                // maxWidth: '400px',
                maxWidth: '350px',
  
                padding: '10px',
                zIndex: 10,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                overflowY: 'auto',
                maxHeight: '50vh',
                animation: 'popupOpen 0.3s ease-in-out',
                scrollbarWidth:"none"
              }}
              >  <label       style={{
                fontWeight: "bold",
                fontSize: "16px",
                marginBottom: "10px",
                textAlign: "start",
                color: "#019988",
              }}> Min Western Bathrooms</label>
                      <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search options"
                  style={{
                    width: '80%',
                    padding: '5px',
    // marginBottom: '10px',
    background:"#C0DFDA",
    border:"none",
    outline:"none"   
                  }}
                />
                    <button
                type="button"
                onClick={closeMinWesternOptions}
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                }}
              >
                <FaTimes size={18} color="red" />
              </button>
             {filterOptions(["1", "2", "3", "4", "5"]).map((value, index) => (
  <div
    key={index}
    style={{ padding: "10px", cursor: "pointer" }}
    onClick={() => handleMinWesternSelect(value)}
  >
    {value === "5" ? "5 Western" : `${value} Western`}
  </div>
))}

              </div>
            )}
          </div>
        </div>
      </label>
      </div>

          <div className="form-group m-0">
      
          <label style={{ width: '100%'}}>
          <label>number Of Floors</label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="numberOfFloors"
                  value={advancedFilters.numberOfFloors || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select numberOfFloors</option>
                  {dataList.numberOfFloors?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("numberOfFloors")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                     <BsBuildingsFill />
                  </span>
                  {advancedFilters.numberOfFloors || "Select numberOfFloors"}
                </button>
      
                {renderDropdown("numberOfFloors")}
              </div>
            </div>
          </label>
        </div>
      
          <div className="form-group m-0">
          <label style={{ width: '100%'}}>
          <label>car Parking</label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="carParking"
                  value={advancedFilters.carParking || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select carParking</option>
                  {dataList.carParking?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("carParking")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                    <FaCar />
                  </span>
                  {advancedFilters.carParking || "Select carParking"}
                </button>
      
                {renderDropdown("carParking")}
              </div>
            </div>
          </label>
        </div>
      
      
     
      
      
        <div className="form-group m-0">
        <label>country:</label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <BiWorld className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="country"
            value={advancedFilters.country}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="country"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
        </div>
        
      
      <div className="form-group m-0">
        <label>State:</label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <MdLocationCity className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="state"
            value={advancedFilters.state}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="State"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
      
      <div className="form-group m-0">
        <label>City:</label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <FaCity className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="city"
            value={advancedFilters.city}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="City"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
      
        <div className="form-group m-0">
        <label>District:</label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <FaRegAddressCard className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="district"
            value={advancedFilters.district}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="District"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
        <div className="form-group m-0">
        <label>Area:</label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <MdLocationOn className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="area"
            value={advancedFilters.area}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="Area"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
        <div className="form-group m-0">
        <label>Street Name:</label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <FaRoad className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="streetName"
            value={advancedFilters.streetName}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="Street Name"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
        <div className="form-group m-0">
        <label>Door Number:</label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <FaDoorClosed className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="doorNumber"
            value={advancedFilters.doorNumber}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="Door Number"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
        </div>
      
        <div className="form-group m-0">
        <label>Nagar:</label>
        <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
          <FaMapPin className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
          <input
            type="text"
            name="nagar"
            value={advancedFilters.nagar}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="Nagar"
            style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
      
        
    

        <div className="form-group m-0" >
          <label style={{width:'100%'}}>
          <label>best Time To Call</label>
      
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <select
                  name="bestTimeToCall"
                  value={advancedFilters.bestTimeToCall || ""}
                  onChange={handleAdvancedFilterChange}
                  className="form-control"
                  style={{ display: "none" }} // Hide the default <select> dropdown
                >
                  <option value="">Select bestTimeToCall</option>
                  {dataList.bestTimeToCall?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
      
                <button
                  className="m-0 p-2"
                  type="button"
                  onClick={() => toggleDropdown("bestTimeToCall")}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #4F4B7E",
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "5px",
                    width: "100%",
                    textAlign: "left",
                    color: "#4F4B7E",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                    <FaHome />
                  </span>
                  {advancedFilters.bestTimeToCall || "Select bestTimeToCall"}
                </button>
      
                {renderDropdown("bestTimeToCall")}
              </div>
            </div>
          </label>
        </div>

        <div className="text-center mt-3 ">
        <button
                  data-bs-dismiss="modal"

          type="button"
          className="btn w-100"
          style={{
            backgroundColor: hoverSearch ? '#58a09b' : '#6EB7B2',
            color: '#fff',
            border: 'none',
          }}
          onMouseEnter={() => setHoverSearch(true)}
          onMouseLeave={() => setHoverSearch(false)}          // onClick={applyAdvancedFilters}
        >
          SEARCH
        </button>
      <button
          type="button"
          className="btn w-100 mt-3"
          style={{
            backgroundColor: hoverAdvance ? '#6EB7B2' : 'transparent',
            color: hoverAdvance ? '#fff' : '#6EB7B2',
            border: `1px solid #6EB7B2`,
          }}
          onMouseEnter={() => setHoverAdvance(true)}
          onMouseLeave={() => setHoverAdvance(false)}          data-bs-toggle="modal"
          data-bs-target="#filterPopup" // Nested modal
          >
          GO TO SIMPLE SEARCH
        </button>
        <button 
        style={{color:"#019988"}}
          type="button"
          className="btn w-100 mt-3"
          data-bs-dismiss="modal"
        >
          HOME
        </button>
        </div>


      </div>
      </div>
  </div>
</div>

</div> */}

          <div className="w-100 m-0">
            {/* {loading ? (
      <div className="text-center my-4 "
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',

      }}>
        <span className="spinner-border text-primary" role="status" />
        <p className="mt-2">Loading properties...</p>
      </div>
    ) : 
              filteredProperties.length > 0 ? (
                <> 
                {filteredProperties.map((property) => (
                  <div 
                    key={property._id}
                    className="card mb-3 shadow rounded-4"
                    style={{ width: '100%', height: 'auto', background: '#F9F9F9', overflow:'hidden' }}
                    onClick={() => handleCardClick(property.rentId, phoneNumber)}
                  >
                     <div className="row g-0 ">
         <div className="col-md-4 col-4 d-flex flex-column align-items-center">
      
 <div style={{ position: "relative", width: "100%",height: "160px",  }}>
    <img
 src={
  property.photos && property.photos.length > 0
  ? `http://localhost:5000/${property.photos[0].replace(/\\/g, "/")}`
  : "https://d17r9yv50dox9q.cloudfront.net/car_gallery/default.jpg" // Use the imported local image if no photos are available
  }      
      style={{
        objectFit: "cover",
        objectPosition: "center",
        width: "100%",
        height: "100%",
      }}
    />

 

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
          <div className="d-flex justify-content-start"><p className="m-0" style={{ color:'#5E5E5E' , fontWeight:500 , fontSize:"13px"}}>{property.propertyMode
  ? property.propertyMode.charAt(0).toUpperCase() + property.propertyMode.slice(1)
  : 'N/A'}
</p> 
          </div>
           <p className="fw-bold m-0 " style={{ color:'#000000', fontSize:"15px" }}>{property.propertyType 
  ? property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) 
  : 'N/A'}
</p>
           <p className="m-0" style={{ color:'#5E5E5E' , fontWeight:500 , fontSize:"13px"}}>{property.city
  ? property.city.charAt(0).toUpperCase() + property.city.slice(1)
  : 'N/A'} , {property.district
  ? property.district.charAt(0).toUpperCase() + property.district.slice(1)
  : 'N/A'}</p>
           <div className="card-body ps-2 m-0 pt-0 pe-2 pb-0 d-flex flex-column justify-content-center" style={{background:"#FAFAFA"}}>
             <div className="row">
               <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1">
                 <img src={totalarea} alt="" width={12} className="me-2"/>
                 <span style={{ fontSize:'13px', color:'#5E5E5E' , fontWeight:500 }}>{property.totalArea || 'N/A'} {property.areaUnit
  ? property.areaUnit.charAt(0).toUpperCase() + property.areaUnit.slice(1)
  : 'N/A'}

                  
                 </span>
               </div>
               <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
                 <img src={bed} alt="" width={12} className="me-2"/>
                 <span style={{ fontSize:'13px', color:'#5E5E5E' ,fontWeight: 500 }}>{property.bedrooms || 'N/A'} BHK</span>
               </div>
               <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
                 <img src={postedby} alt="" width={12} className="me-2"/>
                 <span style={{ fontSize:'13px', color:'#5E5E5E' ,fontWeight: 500 }}>
                 {property.ownership
  ? property.ownership.charAt(0).toUpperCase() + property.ownership.slice(1)
  : 'N/A'}
                 </span>
               </div>
               <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
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
                  <img src={
                    indianprice
                  } alt="" width={8}  className="me-2"/>
                  {property.price ? property.price.toLocaleString('en-IN') : 'N/A'}
                </span> 
                <span style={{ color:'#4F4B7E', marginLeft:"5px",fontSize:'11px',}}> 
                Negotiable                </span> 
                  </h6>
               </div>
              </div>
            </div>
          </div>
       </div>

                  </div>
                ))}

      {shouldShowButton && (
        <button
          onClick={() => setShowMap(!showMap)}
          className="btn btn-primary mb-2 w-100"
            style={{
    background: 'linear-gradient(90deg, #28a745, #a8e063)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(40, 167, 69, 0.4)',
    transition: '0.3s',
    cursor: 'pointer',
  }}
        >
          {showMap ? 'Hide Property Map' : 'View Property Map'}
        </button>
      )}

      {showMap && (
          <FilteredPropertyMap filteredProperties={filteredProperties} />
       )} 
          </>
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
        </div>              )} */}
        {filteredProperties.length > 0 && (
  <div className="mt-4">
      <FilteredPropertyMap filteredProperties={filteredProperties} resetSearchFlag={resetSearchFlag} />
  </div>
)}
            </div>

      
      </Row>

   


    </Container>
  );
};

export default PropertyMap;
