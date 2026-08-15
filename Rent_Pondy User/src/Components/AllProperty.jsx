
// import React, { useEffect, useState , useRef} from "react";
// import { Container, Row, Col } from "react-bootstrap";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Helmet } from "react-helmet";
// import { 
//   FaFilter, FaHome, FaCity, FaRupeeSign, FaBed, FaCheck, FaTimes, 
//   FaTools, FaIdCard, FaCalendarAlt, FaUserAlt, FaRulerCombined, FaBath, 
//    FaCar, FaHandshake, FaToilet, 
//   FaCamera,
//   FaEye
// } from "react-icons/fa";
// import { TbFileDescription , TbWheelchair , TbToolsKitchen , TbWorldLongitude , TbMapPinCode  } from "react-icons/tb";
// import { AiOutlineColumnWidth, AiOutlineColumnHeight } from "react-icons/ai";
// import { BsBank } from "react-icons/bs";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { FaKitchenSet, FaPhone } from "react-icons/fa6";
// import myImage from '../Assets/Rectangle 146.png'; // Correct path
// import myImage1 from '../Assets/Rectangle 145.png'; // Correct path
// import pic from '../Assets/Mask Group 3@2x.png'; // Correct path
// import {FaChartArea, FaMapPin, FaDoorClosed , FaRoad ,FaRegAddressCard } from 'react-icons/fa6';
// import { MdBalcony , MdOutlineMeetingRoom, MdOutlineOtherHouses, MdSchedule , MdApproval, MdLocationCity, MdOutlineStarOutline } from "react-icons/md";
// import { BsBuildingsFill, BsFillHouseCheckFill } from "react-icons/bs";
// import { GiKitchenScale,  GiResize , GiGears} from "react-icons/gi";
// import { HiUserGroup } from "react-icons/hi";
// import { BiSearchAlt,  BiWorld} from "react-icons/bi";
// import {  MdElevator   } from "react-icons/md";
// import calendar from '../Assets/Calender-01.png'
// import bed from '../Assets/BHK-01.png'
// import totalarea from '../Assets/total_area.png'
// import postedby from '../Assets/Posted By-01.png'
// import indianprice from '../Assets/Indian Rupee-01.png'
// import {
  
//   FaUsers,
//   FaSortAmountDownAlt,
//   FaHeadset,
// } from 'react-icons/fa';
// import NoData from "../Assets/OOOPS-No-Data-Found.png";
// import maxprice from "../Assets/Price maxi-01.png";
// import Floorr from '../Assets/floor.PNG'
// // icon
// import propertyMode from '../Assets/prop_mode.PNG';
// import propertyType from '../Assets/prop_type.PNG';
// import price from '../Assets/amount.png';
// import propertyAge from '../Assets/age.PNG';
// import bankLoan from '../Assets/alt_mob.PNG';
// import negotiation from '../Assets/nego.PNG';
// import length from '../Assets/alt_mob.PNG';
// import breadth from '../Assets/alt_mob.PNG';
// import totalArea from '../Assets/total_area.png';
// import ownership from '../Assets/alt_mob.PNG';
// import bedrooms from '../Assets/bed.PNG';
// import kitchen from '../Assets/alt_mob.PNG';
// import kitchenType from '../Assets/alt_mob.PNG';
// import balconies from '../Assets/alt_mob.PNG';
// import floorNo from '../Assets/floor.PNG';
// import areaUnit from '../Assets/area_unit.png';
// import propertyApproved from '../Assets/alt_mob.PNG';
// import postedBy from '../Assets/posted_by.png';
// import facing from '../Assets/facing.png';
// import salesMode from '../Assets/alt_mob.PNG';
// import salesType from '../Assets/alt_mob.PNG';
// import description from '../Assets/alt_mob.PNG';
// import furnished from '../Assets/furnish.PNG';
// import lift from '../Assets/lift.PNG';
// import attachedBathrooms from '../Assets/attach.png';
// import western from '../Assets/western.PNG';
// import numberOfFloors from '../Assets/floor.PNG';
// import carParking from '../Assets/parking.png';
// import rentalPropertyAddress from '../Assets/alt_mob.PNG';
// import country from '../Assets/alt_mob.PNG';
// import state from '../Assets/state.png';
// import city from '../Assets/city.PNG';
// import district from '../Assets/alt_mob.PNG';
// import area from '../Assets/area.png';
// import streetName from '../Assets/street.PNG';
// import doorNumber from '../Assets/door.png';
// import nagar from '../Assets/nagar.PNG';
// import ownerName from '../Assets/name.PNG';
// import email from '../Assets/email.PNG';
// import phone from '../Assets/phone.PNG';
// import altphone from '../Assets/alt_mob.PNG';
// import minprice from "../Assets/Price Mini-01.png";

// import bestTimeToCall from '../Assets/best_time.png';
// import pinCode from '../Assets/alt_mob.PNG';
// import locationCoordinates from '../Assets/alt_mob.PNG';
// import rentType from '../Assets/rent_type.PNG';
// import pet from '../Assets/pet.PNG';
// import members from '../Assets/member.PNG';
// import jobType from '../Assets/job.PNG';
// import food from '../Assets/food.png';
// import dateavailable from '../Assets/date.PNG';
// import securityDeposit from '../Assets/advance.PNG';
// import idcard from '../Assets/id.PNG';
// import { LiaCitySolid } from "react-icons/lia";
// import { GoCheckCircleFill } from "react-icons/go";
// import { FcSearch } from "react-icons/fc";



// const FilteredPropertyMap = ({ filteredProperties }) => {
//   const mapRef = useRef(null);


//   useEffect(() => {
//     if (!window.google || !filteredProperties.length) return;

//     const map = new window.google.maps.Map(mapRef.current, {
//       zoom: 13,
//       center: { lat: 0, lng: 0 },
//     });

//     const bounds = new window.google.maps.LatLngBounds();

//     filteredProperties.forEach((property) => {
//       const coords = parseCoordinates(property.locationCoordinates);
//       if (!coords) return;

//       const marker = new window.google.maps.Marker({
//         position: coords,
//         map,
//         icon: {
//           // url:'/mapLocation.jpg',
//           // path: window.google.maps.SymbolPath.CIRCLE,
//           scale: 8,
//           fillColor: '#007BFF',
//           fillOpacity: 1,
//           strokeWeight: 1,
//           strokeColor: 'white',
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
// label.open(map, marker);

//       // Open the label when the marker is clicked (optional)
//       // marker.addListener('click', () => {
//       //   label.open(map, marker);
//       // });

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
//       style={{ width: '100%', height: '300px', marginTop: '20px', borderRadius: '8px' }}
//     />
//   );
// };
// const AllProperty = () => {
//   const [properties, setProperties] = useState([]);
//   // const [filters, setFilters] = useState({ id: '', price: '', propertyMode: '', city: '' });
//   const [filters, setFilters] = useState({ 
//     id: '', 
//     minPrice: '', 
//     maxPrice: '', 
//     propertyMode: '', 
//     city: '' ,
//      propertyType: '',
//       rentType: '',
//      propertyType: '',
//       bedrooms: '',
//      floorNo: '',
//      state:""


//   });
//   const [hoverSearch, setHoverSearch] = useState(false);
//   const [hoverAdvance, setHoverAdvance] = useState(false);
//   const [imageCounts, setImageCounts] = useState({}); // Store image count for each property
//   const [loading, setLoading] = useState(true);
//   const [isPropertyLoading, setIsPropertyLoading] = useState(false); // Loading state when clicking property 


//   const [showMap, setShowMap] = useState(false);

//   const [clickedCar, setClickedCar] = useState([]);
//   const location = useLocation();
  
//     const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";

//       const [phoneNumber, setPhoneNumber] = useState(storedPhoneNumber);
  

//   useEffect(() => {
//     const recordDashboardView = async () => {
//       try {
//         await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
//           phoneNumber: phoneNumber,
//           viewedFile: "All Property",
//           viewTime: new Date().toISOString(),
//         });
//       } catch (err) {
//       }
//     };
  
//     if (phoneNumber) {
//       recordDashboardView();
//     }
//   }, [phoneNumber]);


//   const [advancedFilters, setAdvancedFilters] = useState({
//     propertyMode: '', propertyType: '', minPrice: '', maxPrice: '', propertyAge: '', bankLoan: '',
//     negotiation: '', length: '', breadth: '', totalArea: '', minTotalArea: '', ownership: '', bedrooms: '',
//     minBedrooms: '', kitchen: '', kitchenType: '', balconies: '', floorNo: '', areaUnit: '', propertyApproved: '',
//     facing: '', postedBy: '', furnished: '', lift: '', attachedBathrooms: '', minAttachedBathrooms: '',
//     western: '', minWestern: '', rentType: '', carParking: '', area: '', nagar: '', streetName: '', pinCode: '', phoneNumber: '', state:""
//   });
//     const activeFilterCount = [
//     ...Object.values(filters),
//     ...Object.values(advancedFilters)
//   ].filter((val) => val !== '').length;

//   const shouldShowButton = activeFilterCount >= 2;

//   const [showMinBedroomsOptions, setShowMinBedroomsOptions] = useState(false);
//   const [showMinAttachedBathroomsOptions, setShowMinAttachedBathroomsOptions] = useState(false);
//   const [showMinWesternOptions, setShowMinWesternOptions] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   // Advanced Filter Card State
//   const [advancedFilter, setAdvancedFilter] = useState({
//     propertyType: '',
//     propertyMode: '',
//     rentType: '',
//     bedroom: '',
//     floor: '',
//     minRent: '',
//     maxRent: '',
//     area: '',
//     street: '',
//     state: '',
//     pincode: ''
//   });

//   const [filterCardResults, setFilterCardResults] = useState([]);
//   const [filterCardLoading, setFilterCardLoading] = useState(false);
//   const [filterCardSearched, setFilterCardSearched] = useState(false);

//   // Handle filter card input change
//   const handleAdvancedFilterChange = (field, value) => {
//     setAdvancedFilter(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // Handle advanced filter card search
//   const handleAdvancedFilterSearch = async () => {
//     setFilterCardLoading(true);
//     setFilterCardSearched(true);
//     try {
//       const params = new URLSearchParams();
      
//       if (advancedFilter.propertyType) params.append('propertyType', advancedFilter.propertyType);
//       if (advancedFilter.propertyMode) params.append('propertyMode', advancedFilter.propertyMode);
//       if (advancedFilter.rentType) params.append('rentType', advancedFilter.rentType);
//       if (advancedFilter.bedroom) params.append('bedrooms', advancedFilter.bedroom);
//       if (advancedFilter.floor) params.append('floorNo', advancedFilter.floor);
//       if (advancedFilter.minRent) params.append('minRent', advancedFilter.minRent);
//       if (advancedFilter.maxRent) params.append('maxRent', advancedFilter.maxRent);
//       if (advancedFilter.area) params.append('area', advancedFilter.area);
//       if (advancedFilter.street) params.append('streetName', advancedFilter.street);
//       if (advancedFilter.state) params.append('state', advancedFilter.state);
//       if (advancedFilter.pincode) params.append('pinCode', advancedFilter.pincode);

//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/filter-properties?${params.toString()}`);
//       setFilterCardResults(response.data.properties || []);
//     } catch (error) {
//       console.error('Error fetching filtered properties:', error);
//       setFilterCardResults([]);
//     } finally {
//       setFilterCardLoading(false);
//     }
//   };

//   // Handle filter card reset
//   const handleAdvancedFilterReset = () => {
//     setAdvancedFilter({
//       propertyType: '',
//       propertyMode: '',
//       rentType: '',
//       bedroom: '',
//       floor: '',
//       minRent: '',
//       maxRent: '',
//       area: '',
//       street: '',
//       state: '',
//       pincode: ''
//     });
//     setFilterCardResults([]);
//     setFilterCardSearched(false);
//   };

//   // Handle change for minBedrooms
//   const handleMinBedroomSelect = (value) => {
//     setAdvancedFilters(prevState => ({
//       ...prevState,
//       minBedrooms: value
//     }));
//     setShowMinBedroomsOptions(false);
//   };

//   // Handle change for minAttachedBathrooms
//   const handleMinAttachedBathroomsSelect = (value) => {
//     setAdvancedFilters(prevState => ({
//       ...prevState,
//       minAttachedBathrooms: value
//     }));
//     setShowMinAttachedBathroomsOptions(false);
//   };

//   // Handle change for minWestern
//   const handleMinWesternSelect = (value) => {
//     setAdvancedFilters(prevState => ({
//       ...prevState,
//       minWestern: value
//     }));
//     setShowMinWesternOptions(false);
//   };

//   const closeMinBedroomsOptions = () => {
//     setShowMinBedroomsOptions(false);
//   };

//   const closeMinAttachedBathroomsOptions = () => {
//     setShowMinAttachedBathroomsOptions(false);
//   };

//   const closeMinWesternOptions = () => {
//     setShowMinWesternOptions(false);
//   };

//   const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
//   const [isAdvancedPopupOpen, setIsAdvancedPopupOpen] = useState(false);
//   const navigate = useNavigate();


//     const fetchImageCount = async (rentId) => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/uploads-count`, {
//           params: { rentId },
//         });
//         return response.data.uploadedImagesCount || 0;
//       } catch (error) {
//         return 0;
//       }
//     };
  
//     // Fetch image counts for all properties
//     useEffect(() => {
//       const fetchAllImageCounts = async () => {
//         const counts = {};
//         await Promise.all(
//           properties.map(async (property) => {
//             const count = await fetchImageCount(property.rentId);
//             counts[property.rentId] = count;
//           })
//         );
//         setImageCounts(counts);
//       };
  
//       if (properties.length > 0) {
//         fetchAllImageCounts();
//       }
//     }, [properties]);
  
// const formatIndianNumber = (x) => {
//   x = x.toString();
//   const lastThree = x.slice(-3);
//   const otherNumbers = x.slice(0, -3);
//   return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (otherNumbers ? "," : "") + lastThree;
// };

// const formatPrice = (price) => {
//   price = Number(price);
//   if (isNaN(price)) return 'N/A';

//   if (price >= 10000000) {
//     return (price / 10000000).toFixed(2) + ' Cr';
//   } else if (price >= 100000) {
//     return (price / 100000).toFixed(2) + ' Lakhs';
//   } else {
//     return formatIndianNumber(price);
//   }
// };
//  const fieldIcons = {
//   // Contact Details
//   phoneNumber: <img src={phone} alt="" style={{ width: 20, height: 20 }} />,
//   alternatePhone: <img src={altphone} alt="" style={{ width: 20, height: 20 }} />,
//   email: <img src={email} alt="" style={{ width: 20, height: 20 }} />,
//   bestTimeToCall: <img src={bestTimeToCall} alt="" style={{ width: 20, height: 20 }} />,
  
//   // Property Location
//   rentalPropertyAddress: <img src={price} alt="" style={{ width: 20, height: 20 }} />,
//   country: <img src={country} alt="" style={{ width: 20, height: 20 }} />,
//   state: <img src={state} alt="" style={{ width: 20, height: 20 }} />,
//   city: <img src={city} alt="" style={{ width: 20, height: 20 }} />,
//   district: <LiaCitySolid color="#4F4B7E" size={20}/>,
//   area: <img src={area} alt="" style={{ width: 20, height: 20 }} />,
//   streetName: <img src={streetName} alt="" style={{ width: 20, height: 20 }} />,
//   doorNumber: <img src={doorNumber} alt="" style={{ width: 20, height: 20 }} />,
//   nagar: <img src={nagar} alt="" style={{ width: 20, height: 20 }} />,

//   // Ownership & Posting Info
//   ownerName: <img src={ownerName} alt="" style={{ width: 20, height: 20 }} />,
//   postedBy: <img src={postedBy} alt="" style={{ width: 20, height: 20 }} />,
//   ownership: <img src={ownership} alt="" style={{ width: 20, height: 20 }} />,

//   // Property Details
//   propertyMode: <img src={propertyMode} alt="" style={{ width: 20, height: 20 }} />,
//   propertyType: <img src={propertyType} alt="" style={{ width: 20, height: 20 }} />,
//   propertyApproved: <img src={propertyApproved} alt="" style={{ width: 20, height: 20 }} />,
//   propertyAge: <img src={propertyAge} alt="" style={{ width: 20, height: 20 }} />,
//   description:<TbFileDescription color="#4F4B7E" size={20}/>,
//   rentType: <img src={rentType} alt="" style={{ width: 20, height: 20 }} />,
//   availableDate: <img src={dateavailable} alt="" style={{ width: 20, height: 20 }} />,
//   familyMembers: <img src={members} alt="" style={{ width: 20, height: 20 }} />,
//   foodHabit: <img src={food} alt="" style={{ width: 20, height: 20 }} />,
//   jobType: <img src={jobType} alt="" style={{ width: 20, height: 20 }} />,
//   petAllowed: <img src={pet} alt="" style={{ width: 20, height: 20 }} />,

//   // Pricing & Financials
//   rentalAmount: <img src={price} alt="" style={{ width: 20, height: 20 }} />,
//   bankLoan: <img src={bankLoan} alt="" style={{ width: 20, height: 20 }} />,
//   negotiation: <img src={negotiation} alt="" style={{ width: 20, height: 20 }} />,
//   securityDeposit: <img src={securityDeposit} alt="" style={{ width: 20, height: 20 }} />,
//   wheelChairAvailable: <TbWheelchair color="#4F4B7E" size={20}/>,

//   // Measurements
//   length: <img src={length} alt="" style={{ width: 20, height: 20 }} />,
//   breadth: <img src={breadth} alt="" style={{ width: 20, height: 20 }} />,
//   totalArea: <img src={totalArea} alt="" style={{ width: 20, height: 20 }} />,
//   areaUnit: <img src={areaUnit} alt="" style={{ width: 20, height: 20 }} />,

//   // Room & Floor Details
//   bedrooms: <img src={bedrooms} alt="" style={{ width: 20, height: 20 }} />,
//   kitchen: <TbToolsKitchen color="#4F4B7E" size={20}/>,
//   kitchenType: <img src={kitchenType} alt="" style={{ width: 20, height: 20 }} />,
//   balconies: <MdBalcony color="#4F4B7E" size={20}/>,
//   floorNo: <img src={floorNo} alt="" style={{ width: 20, height: 20 }} />,
//   numberOfFloors: <img src={numberOfFloors} alt="" style={{ width: 20, height: 20 }} />,
//   attachedBathrooms: <img src={attachedBathrooms} alt="" style={{ width: 20, height: 20 }} />,
//   western: <img src={western} alt="" style={{ width: 20, height: 20 }} />,
//   locationCoordinates: <TbWorldLongitude color="#4F4B7E" size={20}/>,
//   pinCode: <TbMapPinCode color="#4F4B7E" size={20}/>,

//   // Features & Amenities
//   facing: <img src={facing} alt="" style={{ width: 20, height: 20 }} />,
//   // salesMode: <img src={salesMode} alt="" style={{ width: 20, height: 20 }} />,
//   // salesType: <img src={salesType} alt="" style={{ width: 20, height: 20 }} />,
//   furnished: <img src={furnished} alt="" style={{ width: 20, height: 20 }} />,
//   lift: <img src={lift} alt="" style={{ width: 20, height: 20 }} />,
//   carParking: <img src={carParking} alt="" style={{ width: 20, height: 20 }} />,
// };
// // useEffect(() => {
// //   const fetchAllProperties = async () => {
// //     setLoading(true);
// //     try {
// //       const [featuredRes, activeRes] = await Promise.all([
// //         axios.get(`${process.env.REACT_APP_API_URL}/fetch-featured-properties`),
// //         axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users`),
// //       ]);

// //       const featuredProperties = featuredRes.data.properties.map((property) => ({
// //         ...property,
// //         isFeatured: true,
// //       }));

// //       const featuredrentIds = new Set(featuredProperties.map((p) => p.rentId));

// //       const activeProperties = activeRes.data.users
// //         .filter((property) => !featuredrentIds.has(property.rentId)) // Skip duplicates
// //         .map((property) => ({
// //           ...property,
// //           isFeatured: false,
// //         }));

// //       // Merge and sort by createdAt (newest first)
// //       const allProperties = [...featuredProperties, ...activeProperties].sort(
// //         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
// //       );

// //       setProperties(allProperties);
// //     } catch (error) {
// //       // setError("Failed to fetch properties.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   fetchAllProperties();
// // }, []);

// // useEffect(() => {
// //   const fetchAllProperties = async () => {
// //     setLoading(true);
// //     try {
// //       const [featuredRes, activeRes] = await Promise.all([
// //         axios.get(`${process.env.REACT_APP_API_URL}/fetch-featured-properties`),
// //         axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users-on-demand`),
// //       ]);

// //       const featuredProperties = featuredRes.data.properties.map((property) => ({
// //         ...property,
// //         isFeatured: true,
// //       }));

// //       const featuredrentIds = new Set(featuredProperties.map((p) => p.rentId));

// //       const activeProperties = activeRes.data.users
// //         .filter((property) => !featuredrentIds.has(property.rentId))
// //         .map((property) => ({
// //           ...property,
// //           isFeatured: false,
// //         }));

// //       const allProperties = [...featuredProperties, ...activeProperties].sort((a, b) => {
// //         const aDate = new Date(a.updatedAt || a.createdAt);
// //         const bDate = new Date(b.updatedAt || b.createdAt);
// //         return bDate - aDate; // Newest first
// //       });

// //       setProperties(allProperties);
// //     } catch (error) {
// //       // handle error
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   fetchAllProperties();
// // }, []);



// useEffect(() => {
//   const fetchAllProperties = async () => {
//     setLoading(true);
//     try {
//       const [featuredRes, activeRes] = await Promise.all([
//         axios.get(`${process.env.REACT_APP_API_URL}/fetch-featured-properties-on-demand-rent`),
//         axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users-on-demand-rent`)
//       ]);

//       // Add isFeatured flag to featured properties
//       const featuredProperties = featuredRes.data.properties.map((property) => ({
//         ...property,
//         isFeatured: true,
//       }));

//       const featuredrentIds = new Set(featuredProperties.map((p) => p.rentId));

//       // Filter out duplicates and mark remaining as non-featured
//       const activeProperties = activeRes.data.users
//         .filter((property) => !featuredrentIds.has(property.rentId))
//         .map((property) => ({
//           ...property,
//           isFeatured: false,
//         }));

//       const allProperties = [...featuredProperties, ...activeProperties].sort((a, b) => {
//         const aDate = new Date(a.updatedAt || a.createdAt);
//         const bDate = new Date(b.updatedAt || b.createdAt);
//         return bDate - aDate; // Newest first
//       });

//       setProperties(allProperties);
//     } catch (error) {
//       console.error("Error fetching property data:", error);
//       // setError("Failed to load property data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchAllProperties();
// }, []);


// // useEffect(() => {
// //   const fetchAllProperties = async () => {
// //     setLoading(true);
// //     try {
// //       const [featuredRes, activeRes] = await Promise.all([
// //         axios.get(`${process.env.REACT_APP_API_URL}/fetch-featured-properties`),
// //         axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users`),
// //       ]);

// //       const featuredProperties = featuredRes.data.properties.map((property) => ({
// //         ...property,
// //         isFeatured: true,
// //       }));

// //       const featuredrentIds = new Set(featuredProperties.map((p) => p.rentId));

// //       const activeProperties = activeRes.data.users
// //         .filter((property) => !featuredrentIds.has(property.rentId))
// //         .map((property) => ({
// //           ...property,
// //           isFeatured: false,
// //         }));

// //       // Combine both arrays
// //       const allProperties = [...featuredProperties, ...activeProperties];

// //       // Sort by latest between createdAt and updatedAt
// //       allProperties.sort((a, b) => {
// //         const dateA = new Date(a.updatedAt || a.createdAt);
// //         const dateB = new Date(b.updatedAt || b.createdAt);
// //         return dateB - dateA; // Descending order
// //       });

// //       setProperties(allProperties);
// //     } catch (error) {
// //       console.error("Failed to fetch properties:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   fetchAllProperties();
// // }, []);



//     const [dropdownState, setDropdownState] = useState({
//       activeDropdown: null,
//       filterText: "",
//       position: { top: 0, left: 0 },
//     });
//   const toggleDropdown = (field) => {
//     setDropdownState((prevState) => ({
//       activeDropdown: prevState.activeDropdown === field ? null : field,
//       filterText: "",
//     }));
//   };


  
//     const [dataList, setDataList] = useState({});
//     const fetchDropdownData = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch`);
//         const groupedData = response.data.data.reduce((acc, item) => {
//           if (!acc[item.field]) acc[item.field] = [];
//           acc[item.field].push(item.value);
//           return acc;
//         }, {});
//         setDataList(groupedData);
//       } catch (error) {
//       }
//     };
  
//     useEffect(() => {
//       fetchDropdownData();
//     }, []);
  
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prevState) => ({ ...prevState, [name]: value }));

//     // setFilters({ ...filters, [name]: value });
//     setDropdownState((prevState) => ({ ...prevState, filterText: e.target.value }));

//   };
//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   // Filter options based on search query
//   const filterOptions = (options) => {
//     return options.filter(option => option.toString().includes(searchQuery));
//   };
//   const handleAdvancedFilterChange = (e) => {
//     const { name, value } = e.target;
//     setAdvancedFilters((prevState) => ({ ...prevState, [name]: value }));
//     setDropdownState((prevState) => ({ ...prevState, filterText: value }));
//   };
// const fieldLabels = {
//   propertyMode: "Property Mode",
//   propertyType: "Property Type",
//     rentType: "rent Type",
//   rentalAmount: "rental Amount",
//   propertyAge: "Property Age",
//   bankLoan: "Bank Loan",
//   negotiation: "Negotiation",
//     securityDeposit: "security Deposit",
//   length: "Length",
//   breadth: "Breadth",
//   totalArea: "Total Area",
//   ownership: "Ownership",
//   bedrooms: "Bedrooms",
//   kitchen: "Kitchen",
//     kitchen: "Kitchen",
//   availableDate: "available Date",
//   familyMembers: "family Members",
//   foodHabit: "food Habit",
//   jobType: "job Type",
//   petAllowed: "pet Allowed",
//     wheelChairAvailable:"wheel Chair Available",

//   kitchenType: "Kitchen Type",
//   balconies: "Balconies",
//   floorNo: "Floor No.",
//   areaUnit: "Area Unit",
//   propertyApproved: "Property Approved",
//   postedBy: "Posted By",
//   facing: "Facing",
//   salesMode: "Sales Mode",
//   salesType: "Sales Type",
//   description: "Description",
//   furnished: "Furnished",
//   lift: "Lift",
//   attachedBathrooms: "Attached Bathrooms",
//   western: "Western Toilet",
//   numberOfFloors: "Number of Floors",
//   carParking: "Car Parking",
//   rentalPropertyAddress: "Property Address",
//   country: "Country",
//   state: "State",
//   city: "City",
//   district: "District",
//   area: "Area",
//   streetName: "Street Name",
//   doorNumber: "Door Number",
//   nagar: "Nagar",
//   ownerName: "Owner Name",
//   email: "Email",
//   phoneNumber: "Phone Number",
//   phoneNumberCountryCode: "Phone Country Code",
//   alternatePhone: "Alternate Phone",
//   alternatePhoneCountryCode: "Alternate Phone Country Code",
//   bestTimeToCall: "Best Time to Call",
// };
  
//     const renderDropdown = (field) => {
//       const options = dataList[field] || [];
//       const filteredOptions = options.filter((option) =>
//         option.toLowerCase().includes(dropdownState.filterText.toLowerCase())
//       );
  
//       return (
//         dropdownState.activeDropdown === field && (
//           <div
//             className="dropdown-popup"
//             style={{
//               position: 'fixed',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               // backgroundColor: '#fff',
//               backgroundColor: '#E9F7F2',

//               width: '100%',
//               // maxWidth: '400px',
//               maxWidth: '350px',

//               padding: '10px',
//               zIndex: 10,
//               boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//               borderRadius: '8px',
//               overflowY: 'auto',
//               maxHeight: '50vh',
//               animation: 'popupOpen 0.3s ease-in-out',
//             }}
//           >
//                       <div
//           style={{
//             fontWeight: "bold",
//             fontSize: "16px",
//             marginBottom: "10px",
//             textAlign: "start",
//             color: "#019988",
//           }}
//         >
//            {fieldLabels[field] || "Property Field"}
//         </div>
//             <div
//               style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//               }}
//             >
//               <input
//                 type="text"
//                 placeholder="Filter options..."
//                 value={dropdownState.filterText}
//                 onChange={handleFilterChange}
//                 style={{
//                   width: '80%',
//                   padding: '5px',
//   // marginBottom: '10px',
//   background:"#C0DFDA",
//   border:"none",
//   outline:"none"                }}
//               />
//               <button
//                 type="button"
//                 onClick={() => toggleDropdown(field)}
//                 style={{
//                   cursor: 'pointer',
//                   border: 'none',
//                   background: 'none',
//                 }}
//               >
//                 <FaTimes size={18} color="red" />
//               </button>
//             </div>
//             <ul
//               style={{
//                 listStyleType: 'none',
//                 padding: 0,
//                 margin: 0,
//               }}
//             >
            
// {filteredOptions.map((option, index) => (
//   <li
//     key={index}
//     onClick={() => {
//       // Update advanced filters
//       setAdvancedFilters((prevState) => ({
//         ...prevState,
//         [field]: option,
//       }));
      
//       // Update the filters state
//       setFilters((prevState) => ({
//         ...prevState,
//         [field]: option,
//       }));
      
//       // Toggle dropdown visibility
//       toggleDropdown(field);
//     }}
//     style={{
//       padding: '5px',
//       cursor: 'pointer',
//       color:"#26794A",
//       marginBottom: '5px',
//     }}
//   >
//     {option}
//   </li>
// ))}

//             </ul>
//           </div>
//         )
//       );
//     };

 

 
//   const filteredProperties = properties.filter((property) => { 
//     const basicFilterMatch = 
//       (filters.id ? property.rentId?.toString().includes(filters.id) : true) &&
//       (filters.propertyMode ? property.propertyMode?.toLowerCase().includes(filters.propertyMode.toLowerCase()) : true) &&
//       (filters.propertyType ? property.propertyType?.toLowerCase().includes(filters.propertyType.toLowerCase()) : true) &&
//       (filters.rentType ? property.rentType?.toLowerCase().includes(filters.rentType.toLowerCase()) : true) &&
//       (filters.bedrooms ? property.bedrooms?.toLowerCase().includes(filters.bedrooms.toLowerCase()) : true) &&
//       (filters.floorNo ? property.floorNo?.toLowerCase().includes(filters.floorNo.toLowerCase()) : true) &&
//       (filters.city ? property.city?.toLowerCase().includes(filters.city.toLowerCase()) : true) &&
//       (filters.state ? property.state?.toLowerCase().includes(filters.state.toLowerCase()) : true);

//     const priceMatch = 
//       (filters.minPrice ? property.rentalAmount >= Number(filters.minPrice) : true) &&
//       (filters.maxPrice ? property.rentalAmount <= Number(filters.maxPrice) : true);
  
//     const advancedFilterMatch = Object.keys(advancedFilters).every((key) => {
//       if (!advancedFilters[key]) return true;
  
//       if (key === "minPrice") {
//         return property.price >= Number(advancedFilters[key]);
//       }
//       if (key === "maxPrice") {
//         return property.price <= Number(advancedFilters[key]);
//       }
//       if (key === "minTotalArea") {
//         return property.totalArea >= Number(advancedFilters[key]);
//       }
//       if (key === "minBedrooms") {
//         return property.bedrooms >= Number(advancedFilters[key]);
//       }
//       if (key === "minAttachedBathrooms") {
//         return property.attachedBathrooms >= Number(advancedFilters[key]);
//       }
//       if (key === "minWestern") {
//         return property.western >= Number(advancedFilters[key]);
//       }
  
//       // Default behavior for other fields (string matching)
//       return property[key]?.toString()?.toLowerCase()?.includes(advancedFilters[key]?.toLowerCase());
//     });
  
//     return basicFilterMatch && priceMatch && advancedFilterMatch;
//   });
  
//   useEffect(() => {
//     const backdrop = document.querySelector('.modal-backdrop');
//     if (isFilterPopupOpen && backdrop) {
//       backdrop.style.pointerEvents = 'none';
//     }
//   }, [isFilterPopupOpen]);
  
// useEffect(() => {
//   const stored = JSON.parse(localStorage.getItem('clickedCar')) || [];
//   setClickedCar(stored);
// }, []);

//   const handleCardClick = (rentId, phoneNumber) => {
//    const stored = JSON.parse(localStorage.getItem('clickedCar')) || [];
//   if (!stored.includes(rentId)) {
//     stored.push(rentId);
//     localStorage.setItem('clickedCar', JSON.stringify(stored));
//   }
//       navigate(`/detail/${rentId}`, { state: { phoneNumber } });

// };

//     // navigate("/detail", { state: { phoneNumber } });
//   // const formattedPrice = new Intl.NumberFormat('en-IN').format(property.price); // Indian-style number format
//   return (
//     <Container fluid className="p-0 w-100 d-flex align-items-center justify-content-center ">
//       <Helmet>
//         <title>Rental Property | Properties</title>
//       </Helmet>
//       <Row className="g-3 w-100 ">
//         <Col lg={12} className="d-flex align-items-center justify-content-center pt-2 m-0">
        
//       <div
//   className="d-flex flex-column justify-content-center align-items-center"
//   data-bs-toggle="modal"
//   data-bs-target="#propertyModal"
//   style={{
//     height: '50px',
//     width: '50px',
//     background: '#4F4B7E',
//     borderRadius: '50%',
//     position: 'fixed',
//     right: 'calc(50% - 187.5px + 10px)', // Center - half of 375px + some offset
//     bottom: '15%',
//     zIndex: '1',
//   }}
// >
//   <BiSearchAlt fontSize={24} color="#fff" />
// </div>

// {/* Modal */}
// <div
//   className="modal fade"
//   id="propertyModal"
//   tabIndex="-1"
//   data-bs-backdrop="false"
//   data-bs-keyboard="false"
//   style={{  backgroundColor: 'rgba(64, 64, 64, 0.9)', // white with 90% opacity
//     backdropFilter: 'blur(1px)', // optional for a frosted-glass effect
// }}
// >
//   <div className="modal-dialog modal-dialog-centered">
//     <div className="modal-content rounded-5 shadow" 
//      style={{
//       width: "350px",
//       margin: "0 auto", // centers horizontally
     
//     }}    >
//       <div className="modal-body py-4">
//         <div className="d-grid gap-2 mb-2">
//           {/* Search Property - Open another popup */}
//           <button style={{background:"#DFDFDF" , color:"#5E5E5E" , fontWeight:600 , fontSize:"15px"}}
//             className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
//             data-bs-toggle="modal"
//             data-bs-target="#filterPopup" // Nested modal
//           >
//             <FaHome className="me-2" /> Search Property
//           </button>

//           {/* Tenant Search */}
//           <button style={{background:"#DFDFDF" , color:"#5E5E5E" , fontWeight:600 , fontSize:"15px"}}
//           className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
//                 onClick={() => navigate(`/tenant-search`)}
// >
//             <FaUsers className="me-2" /> Tenant Search
//           </button>

//           {/* Quick Sort */}
//           <button style={{background:"#DFDFDF" , color:"#5E5E5E" , fontWeight:600 , fontSize:"15px"}}
//           className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
//                           onClick={() => navigate(`/Sort-Property`)}
// >
//             <FaSortAmountDownAlt className="me-2" /> Quick Sort
//           </button>

//           {/* Property Assistance */}
//           <button style={{background:"#DFDFDF" , color:"#5E5E5E" , fontWeight:600 , fontSize:"15px"}}
//           className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
//       onClick={() => navigate(`/buyer-assistance`)}
//       >
//             <FaHeadset className="me-2" /> Property Assistance
//           </button>
//         </div>

//         {/* Cancel */}
//         <div className="text-center" >
//           <button className="btn btn-primary rounded-2 px-4 mt-2" data-bs-dismiss="modal"
//           style={{ fontWeight:500 , fontSize:"10px"}}>
//             CANCEL
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

// {/* Filter Popup (Nested Modal) */}
// <div
//   className="modal fade"
//   id="filterPopup"
//   tabIndex="-1"
//   aria-labelledby="filterPopupLabel"
//   aria-hidden="true"
// >
//   <div className="modal-dialog modal-dialog-centered">
//     <div className="modal-content rounded-4 shadow">
//       <div className="modal-header">
//         <h5 className="modal-title" id="filterPopupLabel">Search Property</h5>
//         <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//       </div>
//       <div className="modal-body">
      
//      <div className="form-group">
//        <div className="input-card p-0 rounded-2" style={{ 
//          display: 'flex', 
//          alignItems: 'center', 
//          justifyContent: 'space-between', 
//          width: '100%',  
//          boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//          background: "#fff",
//          paddingRight: "10px"
//        }}>
         
         
         
//         <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          // boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }}
//      >     
//        <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//      <img src={idcard} alt="" style={{ width: 20, height: 20 }} />  </span>
//            <input
//              type="number"
//              name="id"
//              value={filters.id}
//              onChange={handleFilterChange}
//              className="form-input m-0"
//              placeholder="SEARCH BY RENT ID"
//              style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//            />
//          </div>
//          {filters.id && (
//            <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//          )}
//        </div>
//      </div>


//      <div className="form-group " >
//     <label style={{width:'100%'}}>

//          <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >                    <span      style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}>
//               <img src={minprice} alt="" width={20}/>
//             </span>
//         <div style={{ flex: "1" }}>
//           <select
//             name="minPrice"
//             value={filters.minPrice || ""}
//             onChange={handleFilterChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select minPrice</option>
//             {dataList.minPrice?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("minPrice")}
//                  style={{
//                      cursor: "pointer",
//                      border:"none",
//                      padding: "12px",
//                      background: "#fff",
//                      borderRadius: "5px",
//                      width: "100%",
//                      textAlign: "left",
//                      color: "grey",
//                       position: "relative",
//                      boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//      }}      
//           >
       
//             {filters.minPrice || "Select minPrice"}
//                {filters.minPrice && (
//              <GoCheckCircleFill
//                style={{
//                  position: "absolute",
//                  right: "10px",
//                  top: "50%",
//                  transform: "translateY(-50%)",
//                  color: "green",
//                }}
//              />
//            )}
//           </button>

//           {renderDropdown("minPrice")}
//         </div>
//       </div>
//     </label>
//   </div>

//     <div className="form-group " >
//         <label style={{width:'100%'}}>
//        <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >             <span        style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}>
// <img src={maxprice} alt="" width={20}/></span>
         
//             <div style={{ flex: "1" }}>
//               <select
//                 name="maxPrice"
//                 value={filters.maxPrice || ""}
//                 onChange={handleFilterChange}
//                 className="form-control"
//                 style={{ display: "none" }} // Hide the default <select> dropdown
//               >
//                 <option value="">Select maxPrice</option>
//                 {dataList.maxPrice?.map((option, index) => (
//                   <option key={index} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
    
//               <button
//                 className="m-0"
//                 type="button"
//                 onClick={() => toggleDropdown("maxPrice")}
//                      style={{
//                      cursor: "pointer",
//                      border:"none",
//                      padding: "12px",
//                      background: "#fff",
//                      borderRadius: "5px",
//                      width: "100%",
//                      textAlign: "left",
//                      color: "grey",
//                       position: "relative",
//                      boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//      }}      
//               >
             
//                 {filters.maxPrice || "Select maxPrice"}
//                   {filters.maxPrice && (
//              <GoCheckCircleFill
//                style={{
//                  position: "absolute",
//                  right: "10px",
//                  top: "50%",
//                  transform: "translateY(-50%)",
//                  color: "green",
//                }}
//              />
//            )}
//               </button>
    
//               {renderDropdown("maxPrice")}
//             </div>
//           </div>
//         </label>
//       </div>
//      {/* {currentStep >= 1 && ( */}
//              <div>
     
//        {/* Property Mode */}
//        <div className="form-group">
//          <label style={{ width: '100%'}}>
//          {/* <label>Property Mode <span style={{ color: 'red' }}>* </span></label> */}
     
//            <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >
//        <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//       {fieldIcons.propertyMode}   </span>
     
//        <div style={{ flex: "1" }}>
//          <select
//            name="propertyMode"
//            value={filters.propertyMode || ""}
//            onChange={handleFilterChange}
//            className="form-control"
//            style={{ display: "none" }}
//          >
//            <option value="">Select Property Mode</option>
//            {dataList.propertyMode?.map((option, index) => (
//              <option key={index} value={option}>
//                {option}
//              </option>
//            ))}
//          </select>
     
//          <button
//            className="m-0"
//            type="button"
//      onClick={() => toggleDropdown("propertyMode")}                 
//                  style={{
//              cursor: "pointer",
//              padding: "12px",
//              border:"none",
//              background: "#fff",
//              borderRadius: "5px",
//              width: "100%",
//              textAlign: "left",
//              color: "grey",
//              position: "relative",
//              boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//            }}
//          >
//            {filters.propertyMode || "Select Property Mode"}
//            {filters.propertyMode && (
//              <GoCheckCircleFill
//                style={{
//                  position: "absolute",
//                  right: "10px",
//                  top: "50%",
//                  transform: "translateY(-50%)",
//                  color: "green",
//                }}
//              />
//            )}
//          </button>
     
//          {renderDropdown("propertyMode")}
//        </div>
//      </div>
     
//          </label>
//        </div>
     
//        <div className="form-group"> 
//        <label style={{ width: '100%' }}>
//          {/* <label>Property Type <span style={{ color: 'red' }}>* </span> </label> */}
     
//            <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >           <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//                  {fieldIcons.propertyType} 
//                </span>
//            <div style={{ flex: "1" }}>
//              <select
//                name="propertyType"
//                value={filters.propertyType || ""}
//                onChange={handleFilterChange}
//                className="form-control"
//                style={{ display: "none" }} 
//              >
//                <option value="">Select property Type</option>
//                {dataList.propertyType?.map((option, index) => (
//                  <option key={index} value={option}>
//                    {option}
//                  </option>
//                ))}
//              </select>
     
//              <button
//                className="m-0"
//                type="button"
//               onClick={() => toggleDropdown("propertyType")}                    
//                   style={{
//                  cursor: "pointer",
//                  // border: "1px solid #4F4B7E",
//                  border:"none",
//                  padding: "12px",
//                  background: "#fff",
//                  borderRadius: "5px",
//                  width: "100%",
//                  textAlign: "left",
//                  color: "grey",
//                  position: "relative",
//                  boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', 
//                }}
//              >
         
//                {filters.propertyType || "Select Property Type"}
     
//                {filters.propertyType && (
//                  <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                )}
//              </button>
     
//              {renderDropdown("propertyType")}
//            </div>
//          </div>
//        </label>
//      </div>
     
//      {/* rentType */}
//      <div className="form-group"> 
//        <label style={{ width: '100%' }}>
//          {/* <label>renty Type <span style={{ color: 'red' }}>* </span> </label> */}
     
//            <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >           <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//                  {fieldIcons.rentType} 
//                </span>
//            <div style={{ flex: "1" }}>
//              <select
//                name="rentType"
//                value={filters.rentType || ""}
//                onChange={handleFilterChange}
//                className="form-control"
//                style={{ display: "none" }} 
//              >
//                <option value="">Select renty Type</option>
//                {dataList.rentType?.map((option, index) => (
//                  <option key={index} value={option}>
//                    {option}
//                  </option>
//                ))}
//              </select>
     
//              <button
//                className="m-0"
//                type="button"
//                onClick={() => toggleDropdown("rentType")}
//                style={{
//                  cursor: "pointer",
//                  // border: "1px solid #4F4B7E",
//                  border:"none",
//                  padding: "12px",
//                  background: "#fff",
//                  borderRadius: "5px",
//                  width: "100%",
//                  textAlign: "left",
//                  color: "grey",
//                  position: "relative",
//                  boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', 
//                }}
//              >
         
//                {filters.rentType || "Select rent Type"}
     
//                {filters.rentType && (
//                  <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                )}
//              </button>
     
//              {renderDropdown("rentType")}
//            </div>
//          </div>
//        </label>
//      </div>

//        </div>
     
     
//      {/* {currentStep >= 2 && ( */}
//              <div className="fieldcontent p-0">
//        <h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}> Basic Property Info  </h4>             
     
//        <div className="form-group">
//          <label style={{ width: '100%'}}>
//          {/* <label>Bedrooms </label> */}
     
//            <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >       <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//                    {fieldIcons.bedrooms || <FaHome />}
//                  </span> <div style={{ flex: "1" }}>
//                <select
//                  name="bedrooms"
//                  value={filters.bedrooms || ""}
//                  onChange={handleFilterChange}
//                  className="form-control"
//                  style={{ display: "none" }} // Hide the default <select> dropdown
//                >
//                  <option value="">Select bedrooms</option>
//                  {dataList.bedrooms?.map((option, index) => (
//                    <option key={index} value={option}>
//                      {option}
//                    </option>
//                  ))}
//                </select>
     
//                <button
//                  className="m-0"
//                  type="button"
//                  onClick={() => toggleDropdown("bedrooms")}
//                  style={{
//                    cursor: "pointer",
//                    border:"none",
//                    // border: "1px solid #4F4B7E",
//                    padding: "12px",
//                    background: "#fff",
//                    borderRadius: "5px",
//                    width: "100%",
//                    textAlign: "left",
//                    color: "grey",
//                  position: "relative",border:"none",
//                              boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//      }}
//                >
                  
//                  {filters.bedrooms || "Select bedrooms"}
//       {filters.bedrooms && (
//                  <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                )}          </button>
     
//                {renderDropdown("bedrooms")}
//              </div>
//            </div>
//          </label>
//        </div>
     
//          {/* floorNo */}
//          <div className="form-group">
//          <label style={{ width: '100%'}}>
//          {/* <label>FloorNo </label> */}
     
//            <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >       <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//                    {fieldIcons.floorNo}
//                  </span>  <div style={{ flex: "1" }}>
//                <select
//                  name="floorNo"
//                  value={filters.floorNo || ""}
//                  onChange={handleFilterChange}
//                  className="form-control"
//                  style={{ display: "none" }} // Hide the default <select> dropdown
//                >
//                  <option value="">Select floorNo</option>
//                  {dataList.floorNo?.map((option, index) => (
//                    <option key={index} value={option}>
//                      {option}
//                    </option>
//                  ))}
//                </select>
     
//                <button
//                  className="m-0"
//                  type="button"
//                  onClick={() => toggleDropdown("floorNo")}
//                  style={{
//                    cursor: "pointer",
//                    border:"none",
//                    // border: "1px solid #4F4B7E",
//                    padding: "12px",
//                    background: "#fff",
//                    borderRadius: "5px",
//                    width: "100%",
//                    textAlign: "left",
//                    color: "grey",
//                  position: "relative",border:"none",
//                              boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//      }}
//                >
                 
//                  {filters.floorNo || "Select floorNo"}
//       {filters.floorNo && (
//                  <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                )}          </button>
     
//                {renderDropdown("floorNo")}
//              </div>
//            </div>
//          </label>
//        </div>
//        </div>
     
   
       
//              <div className="fieldcontent p-0">
//      <div className="form-group">
//        {/* <label>State:</label> */}
//        <div className="input-card p-0 rounded-2" style={{ 
//          display: 'flex', 
//          alignItems: 'center', 
//          justifyContent: 'space-between', 
//          width: '100%',  
//          boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//          background: "#fff",
//          paddingRight: "10px"
//        }}>
         
//         <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//        }}
//      > 
          
//           <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//           <MdLocationCity className="input-icon" style={{color: '#4F4B7E',}} />
//        </span>
//        <input
//            type="text"
//            name="state"
//            value={filters.state}
//            onChange={handleFilterChange}
//            className="form-input m-0"
//            placeholder="State"
//              style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//          />
//        </div>
//         {filters.state && (
//            <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//          )}
//      </div></div>
//        {/* City */}
     
//      <div className="form-group">
//        {/* <label>City:</label> */}
//        <div className="input-card p-0 rounded-2" style={{ 
//          display: 'flex', 
//          alignItems: 'center', 
//          justifyContent: 'space-between', 
//          width: '100%',  
//          boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//          background: "#fff",
//          paddingRight: "10px"
//        }}>
         
       
//          <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//        }}
//      > 
//           <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//           {fieldIcons.city || <FaHome />} 
//        </span>
//        <input
//            type="text"
//            name="city"
//            value={filters.city}
//            onChange={handleFilterChange}
//            className="form-input m-0"
//            placeholder="City"
//              style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//          />
//        </div>
//         {filters.city && (
//            <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//          )}
//      </div></div>



   
     
//        </div>
//      {/* Advance Filter Button */}
//         <div className="text-center mt-3 ">
//         <button  aria-label="Close"  data-bs-dismiss="modal"
//         type="button"
//         className="btn w-100"
//         style={{
//           backgroundColor: hoverSearch ? '#4F4B7E' : '#4F4B7E',
//           color: '#fff',
//           border: 'none',
//         }}
//         onMouseEnter={() => setHoverSearch(true)}
//         onMouseLeave={() => setHoverSearch(false)}
//         // onClick={applyFilters}
//       >
//         SEARCH
//       </button>

//       <button
//         type="button"
//         className="btn w-100 mt-3"
//         style={{
//           backgroundColor: hoverAdvance ? '#4F4B7E' : 'transparent',
//           color: hoverAdvance ? '#fff' : '#4F4B7E',
//           border: `1px solid #4F4B7E`,
//         }}
//         onMouseEnter={() => setHoverAdvance(true)}
//         onMouseLeave={() => setHoverAdvance(false)}
//         data-bs-toggle="modal"
//         data-bs-target="#advancedFilterPopup"
//       >
//         GO TO ADVANCED SEARCH
//       </button>
//         </div>
//   </div>

//     </div>
//   </div>
// </div>

// {/* Advanced Filter Popup */}
// <div
//   className="modal fade"
//   id="advancedFilterPopup"
//   tabIndex="-1"
//   aria-labelledby="advancedFilterPopupLabel"
//   aria-hidden="true"
// >
//   <div className="modal-dialog modal-dialog-centered">
//     <div className="modal-content rounded-4 shadow">
//       <div className="modal-header">
//         <h5 className="modal-title" id="advancedFilterPopupLabel">Advanced Search</h5>
//         <button
//           type="button"
//           className="btn-close"
//           data-bs-dismiss="modal"
//           aria-label="Close"
//         ></button>
//       </div>
//   <div className="modal-body">
 
//           <div className="form-group">
//        <div className="input-card p-0 rounded-2" style={{ 
//          display: 'flex', 
//          alignItems: 'center', 
//          justifyContent: 'space-between', 
//          width: '100%',  
//          boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//          background: "#fff",
//          paddingRight: "10px"
//        }}>
         
         
         
//         <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          // boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }}
//      >     
//        <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//      <img src={idcard} alt="" style={{ width: 20, height: 20 }} />  </span>
//            <input
//              type="number"
//              name="id"
//              value={filters.id}
//              onChange={handleFilterChange}
//              className="form-input m-0"
//              placeholder="SEARCH BY RENT ID"
//              style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//            />
//          </div>
//          {filters.id && (
//            <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//          )}
//        </div>
//      </div>

     
//      <div className="form-group " >
//     <label style={{width:'100%'}}>

//          <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >                    <span      style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}>
//               <img src={minprice} alt="" width={20}/>
//             </span>
//         <div style={{ flex: "1" }}>
//           <select
//             name="minPrice"
//             value={filters.minPrice || ""}
//             onChange={handleFilterChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select minPrice</option>
//             {dataList.minPrice?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("minPrice")}
//                  style={{
//                      cursor: "pointer",
//                      border:"none",
//                      padding: "12px",
//                      background: "#fff",
//                      borderRadius: "5px",
//                      width: "100%",
//                      textAlign: "left",
//                      color: "grey",
//                       position: "relative",
//                      boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//      }}      
//           >
       
//             {filters.minPrice || "Select minPrice"}
//                {filters.minPrice && (
//              <GoCheckCircleFill
//                style={{
//                  position: "absolute",
//                  right: "10px",
//                  top: "50%",
//                  transform: "translateY(-50%)",
//                  color: "green",
//                }}
//              />
//            )}
//           </button>

//           {renderDropdown("minPrice")}
//         </div>
//       </div>
//     </label>
//   </div>

//     <div className="form-group " >
//         <label style={{width:'100%'}}>
//        <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >             <span        style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}>
// <img src={maxprice} alt="" width={20}/></span>
         
//             <div style={{ flex: "1" }}>
//               <select
//                 name="maxPrice"
//                 value={filters.maxPrice || ""}
//                 onChange={handleFilterChange}
//                 className="form-control"
//                 style={{ display: "none" }} // Hide the default <select> dropdown
//               >
//                 <option value="">Select maxPrice</option>
//                 {dataList.maxPrice?.map((option, index) => (
//                   <option key={index} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
    
//               <button
//                 className="m-0"
//                 type="button"
//                 onClick={() => toggleDropdown("maxPrice")}
//                      style={{
//                      cursor: "pointer",
//                      border:"none",
//                      padding: "12px",
//                      background: "#fff",
//                      borderRadius: "5px",
//                      width: "100%",
//                      textAlign: "left",
//                      color: "grey",
//                       position: "relative",
//                      boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//      }}      
//               >
             
//                 {filters.maxPrice || "Select maxPrice"}
//                   {filters.maxPrice && (
//              <GoCheckCircleFill
//                style={{
//                  position: "absolute",
//                  right: "10px",
//                  top: "50%",
//                  transform: "translateY(-50%)",
//                  color: "green",
//                }}
//              />
//            )}
//               </button>
    
//               {renderDropdown("maxPrice")}
//             </div>
//           </div>
//         </label>
//       </div>
//      {/* {currentStep >= 1 && ( */}
//              <div>
     
//        {/* Property Mode */}
//        <div className="form-group">
//          <label style={{ width: '100%'}}>
//          {/* <label>Property Mode <span style={{ color: 'red' }}>* </span></label> */}
     
//            <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >
//        <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//       {fieldIcons.propertyMode}   </span>
     
//        <div style={{ flex: "1" }}>
//          <select
//            name="propertyMode"
//            value={advancedFilters.propertyMode || ""}
//            onChange={handleAdvancedFilterChange}
//            className="form-control"
//            style={{ display: "none" }}
//          >
//            <option value="">Select Property Mode</option>
//            {dataList.propertyMode?.map((option, index) => (
//              <option key={index} value={option}>
//                {option}
//              </option>
//            ))}
//          </select>
     
//          <button
//            className="m-0"
//            type="button"
//      onClick={() => toggleDropdown("propertyMode")}                 
//                  style={{
//              cursor: "pointer",
//              padding: "12px",
//              border:"none",
//              background: "#fff",
//              borderRadius: "5px",
//              width: "100%",
//              textAlign: "left",
//              color: "grey",
//              position: "relative",
//              boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//            }}
//          >
//            {advancedFilters.propertyMode || "Select Property Mode"}
//            {advancedFilters.propertyMode && (
//              <GoCheckCircleFill
//                style={{
//                  position: "absolute",
//                  right: "10px",
//                  top: "50%",
//                  transform: "translateY(-50%)",
//                  color: "green",
//                }}
//              />
//            )}
//          </button>
     
//          {renderDropdown("propertyMode")}
//        </div>
//      </div>
     
//          </label>
//        </div>
     
//        <div className="form-group"> 
//        <label style={{ width: '100%' }}>
//          {/* <label>Property Type <span style={{ color: 'red' }}>* </span> </label> */}
     
//            <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >           <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//                  {fieldIcons.propertyType} 
//                </span>
//            <div style={{ flex: "1" }}>
//              <select
//                name="propertyType"
//                value={advancedFilters.propertyType || ""}
//                onChange={handleAdvancedFilterChange}
//                className="form-control"
//                style={{ display: "none" }} 
//              >
//                <option value="">Select property Type</option>
//                {dataList.propertyType?.map((option, index) => (
//                  <option key={index} value={option}>
//                    {option}
//                  </option>
//                ))}
//              </select>
     
//              <button
//                className="m-0"
//                type="button"
//               onClick={() => toggleDropdown("propertyType")}                    
//                   style={{
//                  cursor: "pointer",
//                  // border: "1px solid #4F4B7E",
//                  border:"none",
//                  padding: "12px",
//                  background: "#fff",
//                  borderRadius: "5px",
//                  width: "100%",
//                  textAlign: "left",
//                  color: "grey",
//                  position: "relative",
//                  boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', 
//                }}
//              >
         
//                {advancedFilters.propertyType || "Select Property Type"}
     
//                {advancedFilters.propertyType && (
//                  <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                )}
//              </button>
     
//              {renderDropdown("propertyType")}
//            </div>
//          </div>
//        </label>
//      </div>
     
//      {/* rentType */}
//      <div className="form-group"> 
//        <label style={{ width: '100%' }}>
//          {/* <label>renty Type <span style={{ color: 'red' }}>* </span> </label> */}
     
//            <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >           <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//                  {fieldIcons.rentType} 
//                </span>
//            <div style={{ flex: "1" }}>
//              <select
//                name="rentType"
//                value={advancedFilters.rentType || ""}
//                onChange={handleAdvancedFilterChange}
//                className="form-control"
//                style={{ display: "none" }} 
//              >
//                <option value="">Select renty Type</option>
//                {dataList.rentType?.map((option, index) => (
//                  <option key={index} value={option}>
//                    {option}
//                  </option>
//                ))}
//              </select>
     
//              <button
//                className="m-0"
//                type="button"
//                onClick={() => toggleDropdown("rentType")}
//                style={{
//                  cursor: "pointer",
//                  // border: "1px solid #4F4B7E",
//                  border:"none",
//                  padding: "12px",
//                  background: "#fff",
//                  borderRadius: "5px",
//                  width: "100%",
//                  textAlign: "left",
//                  color: "grey",
//                  position: "relative",
//                  boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', 
//                }}
//              >
         
//                {advancedFilters.rentType || "Select rent Type"}
     
//                {advancedFilters.rentType && (
//                  <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                )}
//              </button>
     
//              {renderDropdown("rentType")}
//            </div>
//          </div>
//        </label>
//      </div>
//        </div>
     
     
//      {/* {currentStep >= 2 && ( */}
//              <div className="fieldcontent p-0">
//        <h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}> Basic Property Info  </h4>             
     
//        <div className="form-group">
//          <label style={{ width: '100%'}}>
//          {/* <label>Bedrooms </label> */}
     
//            <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >       <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//                    {fieldIcons.bedrooms || <FaHome />}
//                  </span> <div style={{ flex: "1" }}>
//                <select
//                  name="bedrooms"
//                  value={advancedFilters.bedrooms || ""}
//                  onChange={handleAdvancedFilterChange}
//                  className="form-control"
//                  style={{ display: "none" }} // Hide the default <select> dropdown
//                >
//                  <option value="">Select bedrooms</option>
//                  {dataList.bedrooms?.map((option, index) => (
//                    <option key={index} value={option}>
//                      {option}
//                    </option>
//                  ))}
//                </select>
     
//                <button
//                  className="m-0"
//                  type="button"
//                  onClick={() => toggleDropdown("bedrooms")}
//                  style={{
//                    cursor: "pointer",
//                    border:"none",
//                    // border: "1px solid #4F4B7E",
//                    padding: "12px",
//                    background: "#fff",
//                    borderRadius: "5px",
//                    width: "100%",
//                    textAlign: "left",
//                    color: "grey",
//                  position: "relative",border:"none",
//                              boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//      }}
//                >
                  
//                  {advancedFilters.bedrooms || "Select bedrooms"}
//       {advancedFilters.bedrooms && (
//                  <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                )}          </button>
     
//                {renderDropdown("bedrooms")}
//              </div>
//            </div>
//          </label>
//        </div>
     
//          {/* floorNo */}
//          <div className="form-group">
//          <label style={{ width: '100%'}}>
//          {/* <label>FloorNo </label> */}
     
//            <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >       <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//                    {fieldIcons.floorNo}
//                  </span>  <div style={{ flex: "1" }}>
//                <select
//                  name="floorNo"
//                  value={advancedFilters.floorNo || ""}
//                  onChange={handleAdvancedFilterChange}
//                  className="form-control"
//                  style={{ display: "none" }} // Hide the default <select> dropdown
//                >
//                  <option value="">Select floorNo</option>
//                  {dataList.floorNo?.map((option, index) => (
//                    <option key={index} value={option}>
//                      {option}
//                    </option>
//                  ))}
//                </select>
     
//                <button
//                  className="m-0"
//                  type="button"
//                  onClick={() => toggleDropdown("floorNo")}
//                  style={{
//                    cursor: "pointer",
//                    border:"none",
//                    // border: "1px solid #4F4B7E",
//                    padding: "12px",
//                    background: "#fff",
//                    borderRadius: "5px",
//                    width: "100%",
//                    textAlign: "left",
//                    color: "grey",
//                  position: "relative",border:"none",
//                              boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//      }}
//                >
                 
//                  {advancedFilters.floorNo || "Select floorNo"}
//       {advancedFilters.floorNo && (
//                  <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                )}          </button>
     
//                {renderDropdown("floorNo")}
//              </div>
//            </div>
//          </label>
//        </div>
     
       
//          {/*attachedBathrooms */}
//            <div className="form-group">
//          <label style={{ width: '100%'}}>
//          {/* <label>Attached Bathrooms</label> */}
     
//            <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >       <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//                    {fieldIcons.attachedBathrooms || <FaHome />}
//                  </span>   <div style={{ flex: "1" }}>
//                <select
//                  name="attachedBathrooms"
//                  value={advancedFilters.attachedBathrooms || ""}
//                  onChange={handleAdvancedFilterChange}
//                  className="form-control"
//                  style={{ display: "none" }} // Hide the default <select> dropdown
//                >
//                  <option value="">Select attachedBathrooms</option>
//                  {dataList.attachedBathrooms?.map((option, index) => (
//                    <option key={index} value={option}>
//                      {option}
//                    </option>
//                  ))}
//                </select>
     
//                <button
//                  className="m-0"
//                  type="button"
//                  onClick={() => toggleDropdown("attachedBathrooms")}
//                  style={{
//                    cursor: "pointer",
//                    // border: "1px solid #4F4B7E",
//                    padding: "12px",
//                    background: "#fff",
//                    borderRadius: "5px",
//                    width: "100%",
//                    textAlign: "left",
//                    color: "grey",
//                  position: "relative",border:"none",
//                              boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//      }}
//                >
                
//                  {advancedFilters.attachedBathrooms || "Select attachedBathrooms"}
//       {advancedFilters.attachedBathrooms && (
//                  <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                )}          </button>
     
//                {renderDropdown("attachedBathrooms")}
//              </div>
//            </div>
//          </label>
//        </div>
     
//            {/* western */}
//          <div className="form-group">
     
//          <label style={{ width: '100%'}}>
//          {/* <label>Western</label> */}
     
//         <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >    
//              <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//                    {fieldIcons.western || <FaHome />}
//                  </span>    <div style={{ flex: "1" }}>
//                <select
//                  name="western"
//                  value={advancedFilters.western || ""}
//                  onChange={handleAdvancedFilterChange}
//                  className="form-control"
//                  style={{ display: "none" }} // Hide the default <select> dropdown
//                >
//                  <option value="">Select western</option>
//                  {dataList.western?.map((option, index) => (
//                    <option key={index} value={option}>
//                      {option}
//                    </option>
//                  ))}
//                </select>
     
//                <button
//                  className="m-0"
//                  type="button"
//                  onClick={() => toggleDropdown("western")}
//                  style={{
//                    cursor: "pointer",
//                    // border: "1px solid #4F4B7E",
//                    padding: "12px",
//                    background: "#fff",
//                    borderRadius: "5px",
//                    width: "100%",
//                    textAlign: "left",
//                    color: "grey",
//                  position: "relative",border:"none",
//                              boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//      }}
//                >
              
//                  {advancedFilters.western || "Select western"}
//       {advancedFilters.western && (
//                  <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                )}          </button>
     
//                {renderDropdown("western")}
//              </div>
//            </div>
//          </label>
//        </div>
//          {/* carParking */}
     
//          <div className="form-group">
//          <label style={{ width: '100%'}}>
//          {/* <label>Car Parking</label> */}
     
//            <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >        <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//                    {fieldIcons.carParking || <FaHome />}
//                  </span>    <div style={{ flex: "1" }}>
//                <select
//                  name="carParking"
//                  value={advancedFilters.carParking || ""}
//                  onChange={handleAdvancedFilterChange}
//                  className="form-control"
//                  style={{ display: "none" }} // Hide the default <select> dropdown
//                >
//                  <option value="">Select carParking</option>
//                  {dataList.carParking?.map((option, index) => (
//                    <option key={index} value={option}>
//                      {option}
//                    </option>
//                  ))}
//                </select>
     
//                <button
//                  className="m-0"
//                  type="button"
//                  onClick={() => toggleDropdown("carParking")}
//                  style={{
//                    cursor: "pointer",
//                    // border: "1px solid #4F4B7E",
//                    padding: "12px",
//                    background: "#fff",
//                    borderRadius: "5px",
//                    width: "100%",
//                    textAlign: "left",
//                    color: "grey",
//                  position: "relative",border:"none",
//                              boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//      }}
//                >
              
//                  {advancedFilters.carParking || "Select carParking"}
//       {advancedFilters.carParking && (
//                  <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                )}          </button>
     
//                {renderDropdown("carParking")}
//              </div>
//            </div>
//          </label>
//        </div>
//          {/*lift */}
//          <div className="form-group">
//          <label style={{ width: '100%'}}>
//            {/* <label>Lift</label> */}
//            <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >      <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//                    {fieldIcons.lift || <FaHome />}
//                  </span>    <div style={{ flex: "1" }}>
//                <select
//                  name="lift"
//                  value={advancedFilters.lift || ""}
//                  onChange={handleAdvancedFilterChange}
//                  className="form-control"
//                  style={{ display: "none" }} // Hide the default <select> dropdown
//                >
//                  <option value="">Select lift</option>
//                  {dataList.lift?.map((option, index) => (
//                    <option key={index} value={option}>
//                      {option}
//                    </option>
//                  ))}
//                </select>
     
//                <button
//                  className="m-0"
//                  type="button"
//                  onClick={() => toggleDropdown("lift")}
//                  style={{
//                    cursor: "pointer",
//                    // border: "1px solid #4F4B7E",
//                    padding: "12px",
//                    background: "#fff",
//                    borderRadius: "5px",
//                    width: "100%",
//                    textAlign: "left",
//                    color: "grey",
//                  position: "relative",border:"none",
//                              boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//      }}
//                >
                
//                  {advancedFilters.lift || "Select lift"}
//       {advancedFilters.lift && (
//                  <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                )}          </button>
     
//                {renderDropdown("lift")}
//              </div>
//            </div>
//          </label>
//        </div>
   
//          {/* facing */}
//          <div className="form-group">
     
//          <label style={{ width: '100%'}}>
//          {/* <label>Facing</label> */}
     
//            <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >       <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//                    {fieldIcons.facing || <FaHome />}
//                  </span>  <div style={{ flex: "1" }}>
//                <select
//                  name="facing"
//                  value={advancedFilters.facing || ""}
//                  onChange={handleAdvancedFilterChange}
//                  className="form-control"
//                  style={{ display: "none" }} // Hide the default <select> dropdown
//                >
//                  <option value="">Select facing</option>
//                  {dataList.facing?.map((option, index) => (
//                    <option key={index} value={option}>
//                      {option}
//                    </option>
//                  ))}
//                </select>
     
//                <button
//                  className="m-0"
//                  type="button"
//                  onClick={() => toggleDropdown("facing")}
//                  style={{
//                    cursor: "pointer",
//                    // border: "1px solid #4F4B7E",
//                    padding: "12px",
//                    background: "#fff",
//                    borderRadius: "5px",
//                    width: "100%",
//                    textAlign: "left",
//                    color: "grey",
//                  position: "relative",border:"none",
//                              boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//      }}
//                >
                 
//                  {advancedFilters.facing || "Select facing"}
//       {advancedFilters.facing && (
//                  <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                )}          </button>
     
//                {renderDropdown("facing")}
//              </div>
//            </div>
//          </label>
//        </div>
//      {/* wheelChairAvailable */}
//        {/* <div className="form-group">
//          <label style={{width:"100%"}}>
     
//            <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >       <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//                    {fieldIcons.wheelChairAvailable || <FaHome />}
//                  </span>    <div style={{ flex: "1" }}>
//                <select
//                  name="wheelChairAvailable"
//                  value={advancedFilters.wheelChairAvailable || ""}
//                  onChange={handleAdvancedFilterChange}
//                  className="form-control"
//                  style={{ display: "none" }} // Hide the default <select> dropdown
//                >
//                  <option value="">Select wheelChairAvailable</option>
//                  {dataList.wheelChairAvailable?.map((option, index) => (
//                    <option key={index} value={option}>
//                      {option}
//                    </option>
//                  ))}
//                </select>
     
//                <button
//                  className="m-0"
//                  type="button"
//                  onClick={() => toggleDropdown("wheelChairAvailable")}
//                  style={{
//                    cursor: "pointer",
//                    padding: "12px",
//                    background: "#fff",
//                    borderRadius: "5px",
//                    width: "100%",
//                    textAlign: "left",
//                    color: "grey",
//                  position: "relative",border:"none",
//                              boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//      }}
//                >
               
//                  {advancedFilters.wheelChairAvailable || "Select wheelChairAvailable"}
//       {advancedFilters.wheelChairAvailable && (
//                  <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                )}          </button>
     
//                {renderDropdown("wheelChairAvailable")}
//              </div>
//            </div>
//          </label>
//        </div> */}
     
//         {/* postedBy */}
//         <div className="form-group">
//          <label style={{ width: '100%'}}>
//          {/* <label>PostedBy <span style={{ color: 'red' }}>* </span> </label> */}
     
//            <div 
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//          boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//        }} className="rounded-2"
//      >       <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//                    {fieldIcons.postedBy} 
//                  </span>   <div style={{ flex: "1" }}>
//                <select
//                  name="postedBy"
     
//                  value={advancedFilters.postedBy || ""}
//                  onChange={handleAdvancedFilterChange}
//                  className="form-control"
//                  style={{ display: "none" }} // Hide the default <select> dropdown
//                >
//                  <option value="">Select postedBy</option>
//                  {dataList.postedBy?.map((option, index) => (
//                    <option key={index} value={option}>
//                      {option}
//                    </option>
//                  ))}
//                </select>
     
//                <button
//                  className="m-0"
//                  type="button"
//                  onClick={() => toggleDropdown("postedBy")}
//                  style={{
//                    cursor: "pointer",
//                    // border: "1px solid #4F4B7E",
//                    padding: "12px",
//                    background: "#fff",
//                    borderRadius: "5px",
//                    width: "100%",
//                    textAlign: "left",
//                    color: "grey",
//                  position: "relative",border:"none",
//                              boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//      }}
//                >
                
//                  {advancedFilters.postedBy || "Select postedBy"}
//       {advancedFilters.postedBy && (
//                  <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                )}          </button>
     
//                {renderDropdown("postedBy")}
//              </div>
//            </div>
//          </label>
//        </div>
//        </div>
//       {/* )} */}
     
     

       
     
//      {/* {currentStep >= 4 && ( */}
//              <div className="fieldcontent p-0">
       
//        {/* State */}
     
//      <div className="form-group">
//        {/* <label>State:</label> */}
//        <div className="input-card p-0 rounded-2" style={{ 
//          display: 'flex', 
//          alignItems: 'center', 
//          justifyContent: 'space-between', 
//          width: '100%',  
//          boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//          background: "#fff",
//          paddingRight: "10px"
//        }}>
         
//         <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//        }}
//      > 
          
//           <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//           <MdLocationCity className="input-icon" style={{color: '#4F4B7E',}} />
//        </span>
//        <input
//            type="text"
//            name="state"
//            value={advancedFilters.state}
//            onChange={handleAdvancedFilterChange}
//            className="form-input m-0"
//            placeholder="State"
//              style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//          />
//        </div>
//         {advancedFilters.state && (
//            <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//          )}
//      </div></div>
//        {/* Area */}
     
//      <div className="form-group">
//        {/* <label>Area:</label> */}
//        <div className="input-card p-0 rounded-2" style={{ 
//          display: 'flex', 
//          alignItems: 'center', 
//          justifyContent: 'space-between', 
//          width: '100%',  
//          boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//          background: "#fff",
//          paddingRight: "10px"
//        }}>
         
       
//          <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//        }}
//      > 
//           <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//           {fieldIcons.area || <FaHome />} 
//        </span>
//        <input
//            type="text"
//            name="area"
//            value={advancedFilters.area}
//            onChange={handleAdvancedFilterChange}
//            className="form-input m-0"
//            placeholder="Area"
//              style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//          />
//        </div>
//         {advancedFilters.area && (
//            <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//          )}
//      </div></div>
//      
//        {/* Nagar */}
     
//      <div className="form-group">
//        {/* <label>Nagar:</label> */}
//        <div className="input-card p-0 rounded-2" style={{ 
//          display: 'flex', 
//          alignItems: 'center', 
//          justifyContent: 'space-between', 
//          width: '100%',  
//          boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//          background: "#fff",
//          paddingRight: "10px"
//        }}>
         
       
//          <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//        }}
//      > 
//           <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//           {fieldIcons.nagar || <FaHome />} 
//        </span>
//        <input
//            type="text"
//            name="nagar"
//            value={advancedFilters.nagar}
//            onChange={handleAdvancedFilterChange}
//            className="form-input m-0"
//            placeholder="Nagar"
//              style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//          />
//        </div>
//         {advancedFilters.nagar && (
//            <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//          )}
//      </div></div>
//      
//        {/* Street Name */}
     
//      <div className="form-group">
//        {/* <label>Street Name:</label> */}
//        <div className="input-card p-0 rounded-2" style={{ 
//          display: 'flex', 
//          alignItems: 'center', 
//          justifyContent: 'space-between', 
//          width: '100%',  
//          boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//          background: "#fff",
//          paddingRight: "10px"
//        }}>
         
       
//          <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//        }}
//      > 
//           <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//           {fieldIcons.streetName || <FaHome />} 
//        </span>
//        <input
//            type="text"
//            name="streetName"
//            value={advancedFilters.streetName}
//            onChange={handleAdvancedFilterChange}
//            className="form-input m-0"
//            placeholder="Street Name"
//              style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//          />
//        </div>
//         {advancedFilters.streetName && (
//            <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//          )}
//      </div></div>
//      
//        {/* Pincode */}
     
//      <div className="form-group">
//        {/* <label>Pincode:</label> */}
//        <div className="input-card p-0 rounded-2" style={{ 
//          display: 'flex', 
//          alignItems: 'center', 
//          justifyContent: 'space-between', 
//          width: '100%',  
//          boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//          background: "#fff",
//          paddingRight: "10px"
//        }}>
         
       
//          <div
//        style={{
//          display: "flex",
//          alignItems: "stretch", // <- Stretch children vertically
//          width: "100%",
//        }}
//      > 
//           <span
//          style={{
//            display: "flex",
//            alignItems: "center",
//            justifyContent: "center",
//            padding: "0 14px",
//            borderRight: "1px solid #4F4B7E",
//            background: "#fff", // optional
//          }}
//        >
//           {fieldIcons.pinCode || <FaHome />} 
//        </span>
//        <input
//            type="text"
//            name="pinCode"
//            value={advancedFilters.pinCode}
//            onChange={handleAdvancedFilterChange}
//            className="form-input m-0"
//            placeholder="Pincode"
//              style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//          />
//        </div>
//         {advancedFilters.pinCode && (
//            <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//          )}
//      </div></div>
     
//        </div>
//      {/* )}  */}
     
     
     
//      {/* {currentStep >= 5 && ( */}
//              <div className="fieldcontent p-0" >
     
     
//      <h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}>  Mobile Number   </h4>             
     
//      <div className="form-group">
//      {/* <label>Phone Number:</label> */}
     
//        <div className="input-card p-0 rounded-2" style={{ 
//          display: 'flex', 
//          alignItems: 'center', 
//          justifyContent: 'space-between', 
//          width: '100%',  
//          boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//          background: "#fff",
//          paddingRight: "10px"
//        }}>
         
       
//        <img src={phone} alt="" style={{ width: 20, height: 20 ,marginLeft:"10px"}} />
//           {/* <FaPhone className="input-icon" style={{ color: '#4F4B7E', marginLeft:"10px"}} /> */}
         

     
     
//          <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
     
      
//        <input
//            type="text"
//            name="phoneNumber"
//            value={phoneNumber}
//            readOnly
//            className="form-input m-0"
//            placeholder="Phone Number"
//              style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//          />
//        </div>
//            <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//          </div>
//      </div>
  
//        </div>
//       {/* )}  */}
//     <div className="text-center mt-3 ">
//         <button
//                   data-bs-dismiss="modal"

//           type="button"
//           className="btn w-100"
//           style={{
//             backgroundColor: hoverSearch ? '#4F4B7E' : '#4F4B7E',
//             color: '#fff',
//             border: 'none',
//           }}
//           onMouseEnter={() => setHoverSearch(true)}
//           onMouseLeave={() => setHoverSearch(false)}          // onClick={applyAdvancedFilters}
//         >
//           SEARCH
//         </button>
//       <button
//           type="button"
//           className="btn w-100 mt-3"
//           style={{
//             backgroundColor: hoverAdvance ? '#4F4B7E' : 'transparent',
//             color: hoverAdvance ? '#fff' : '#4F4B7E',
//             border: `1px solid #4F4B7E`,
//           }}
//           onMouseEnter={() => setHoverAdvance(true)}
//           onMouseLeave={() => setHoverAdvance(false)}          data-bs-toggle="modal"
//           data-bs-target="#filterPopup" // Nested modal
//           >
//           GO TO SIMPLE SEARCH
//         </button>
//         <button 
//         style={{color:"#4F4B7E"}}
//           type="button"
//           className="btn w-100 mt-3"
//           data-bs-dismiss="modal"
//         >
//           HOME
//         </button>
//         </div>
//            </div>
//     </div>
//   </div>
// </div>



//           <div className="w-100">
//             <div style={{ overflowY: 'auto', fontFamily:"Inter, sans-serif" }}>
//             {loading ? (
//       <div className="text-center my-4 "
//       style={{
//         position: 'fixed',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',

//       }}>
//         <span className="spinner-border text-primary" role="status" />
//         <p className="mt-2">Loading properties...</p>
//       </div>
//     ) : 
//               filteredProperties.length > 0 ? (
//                 <> 
//                 {filteredProperties.map((property) => (
//                   <div 
//                     key={property._id}
//                     className="card mb-3 shadow rounded-4"
//                     style={{ width: '100%', height: 'auto', background: '#F9F9F9', overflow:'hidden' }}
//                     onClick={() => handleCardClick(property.rentId, phoneNumber)}
//                   >
//                      <div className="row g-0 align-items-stretch">
//          <div className="col-md-4 col-4 d-flex flex-column align-items-center">
      
//  <div style={{ position: "relative", width: "100%",height: "100%",  }}>
//     {/* Image */}
//     {property.isFeatured && (
//         <span
//           className="m-0 ps-1 pe-2"
//           style={{
//             position: "absolute",
//             top: "0px",
//             right: "0px",
//             fontSize: "12px",
//             background: "linear-gradient(to right,rgba(255, 200, 0, 0.91),rgb(251, 182, 6))",
//             color: "black",
//             cursor: "pointer",
//             borderRadius: "0px 0px 0px 15px",
//             zIndex: 2,
//           }}
//         >
//           <MdOutlineStarOutline /> Featured
//         </span>
//       )}
//     {/* <img
//  src={
//   property.photos && property.photos.length > 0
//   ? `https://ppcpondy.com/PPC/${property.photos[0].replace(/\\/g, "/")}`
//   : "https://d17r9yv50dox9q.cloudfront.net/car_gallery/default.jpg" // Use the imported local image if no photos are available
//   }      
//       style={{
//         objectFit: "cover",
//         objectPosition: "center",
//         width: "100%",
//         height: "160px",
//       }}
//     /> */}

//    <img
//   src={
//     property.photos && property.photos.length > 0
//       ? `https://rentpondy.com/RENT/${property.photos[0].replace(/\\/g, "/").replace(/^\/+/, "")}`
//       : pic
//   }
//   alt={(
//     `${property.rentId || 'N/A'}-${property.propertyMode || 'N/A'}-${property.propertyType || 'N/A'}-rs-${property.price || '0'}
//     -in-${property.city || ''}-${property.area || ''}-${property.state || ''}`
//   )
//     .replace(/\s+/g, "-")
//     .replace(/,+/g, "-")
//     .toLowerCase()
//   }
//   className="img-fluid"
//   style={{
//     objectFit: "cover",
//     objectPosition: "center",
//     width: "100%",
//     height: "160px",
//     borderRadius: "15px",
//   }}
// />

//     {/* Icons */}
//     <div
//       style={{
//         position: "absolute",
//         bottom: "0px",
//         width: "100%",
//         display: "flex",
//         justifyContent: "space-between",
//       }}
//     >
//       <span
//         className="d-flex justify-content-center align-items-center"
//         style={{
//           color: "#fff",
//           backgroundImage: `url(${myImage})`,
//           backgroundSize: "cover",
//           width: "45px",
//           height: "20px",
//         }}
//       >
//         <FaCamera className="me-1" size={13}/>  <span style={{fontSize:"11px"}}>{imageCounts[property.rentId] || 0}</span>
//       </span>
//       <span
//         className="d-flex justify-content-center align-items-center"
//         style={{
//           color: "#fff",
//           backgroundImage: `url(${myImage1})`,
//           backgroundSize: "cover",
//           width: "45px",
//           height: "20px",
//         }}
//       >
//         <FaEye className="me-1" size={15} /> <span style={{fontSize:"11px"}}> {property.views}  </span>
//       </span>
//     </div>
//   </div>
//          </div>
//          <div className="col-md-8 col-8 " style={{paddingLeft:"10px", paddingTop:"7px" , background: clickedCar.includes(property.rentId) ? "#ffffff" : "#F9F9F9",}}>
//           <div className="d-flex justify-content-start"><p className="m-0" style={{ color:'#5E5E5E' , fontWeight:500 , fontSize:"13px"}}>{property.propertyMode
//   ? property.propertyMode.charAt(0).toUpperCase() + property.propertyMode.slice(1)
//   : 'N/A'}
// </p> 
//           </div>
//        <p className="fw-bold m-0 " style={{ color:clickedCar.includes(property.rentId) ? "#F76F00" : "#000000", fontSize:"15px" }}>{property.propertyType 
//   ? property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) 
//   : 'N/A'}
// </p>
// <p
//   className="m-0"
//   style={{ color: "#5E5E5E", fontWeight: 500, fontSize: "13px" }}
// >
//   {(() => {
//     const locs = [ property.nagar, property.area, property.city, property.district, property.state ]
//       .filter((v) => v !== null && v !== undefined && v !== "");

//     if (locs.length === 0) {
//       // All null/empty — show two N/A
//       return <>N/A, N/A</>;
//     }

//     // Show first 3 valid values, capitalized, separated by commas
//     return locs.slice(0, 3).map((val, idx, arr) => (
//       <span key={idx}>
// {val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()}
//         {idx < arr.length - 1 ? ", " : ""}
//       </span>
//     ));
//   })()}
// </p>
//         <div className="card-body ps-2 m-0 pt-0 pe-2 pb-0 d-flex flex-column justify-content-center">
//              <div className="row">
//                <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1">
//                  {/* <FaRulerCombined className="me-2" color="#4F4B7E" /> */}
//                  <img src={Floorr} alt="" width={12} className="me-2"/>
//                  <span style={{ fontSize:'13px', color:'#5E5E5E' , fontWeight:500 }}>{property.floorNo
//   ? property.floorNo.charAt(0).toUpperCase() + property.floorNo.slice(1)
//   : 'N/A'}
//                  </span>
//                </div>
//                <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
//                  {/* <FaBed className="me-2" color="#4F4B7E"/> */}
//                  <img src={bed} alt="" width={12} className="me-2"/>
//                  <span style={{ fontSize:'13px', color:'#5E5E5E' ,fontWeight: 500 }}>{property.bedrooms || 'N/A'} BHK</span>
//                </div>
//                <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
//                  {/* <FaUserAlt className="me-2" color="#4F4B7E"/> */}
//                  <img src={postedby} alt="" width={12} className="me-2"/>
//                  <span style={{ fontSize:'13px', color:'#5E5E5E' ,fontWeight: 500 }}>
//                  {property.postedBy
//   ? property.postedBy.charAt(0).toUpperCase() + property.postedBy.slice(1)
//   : 'N/A'}
//                  </span>
//                </div>
//                {/* <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
//                  <img src={calendar} alt="" width={12} className="me-2"/>
//                   <span style={{ fontSize:'13px', color:'#5E5E5E' ,fontWeight: 500 }}>
//                   {property.createdAt ? new Date(property.createdAt).toLocaleDateString('en-IN', {
//                                                      year: 'numeric',
//                                                      month: 'short',
//                                                      day: 'numeric'
//                                                    }) : 'N/A'}
//                   </span>
//                </div> */}

//                                        <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
//                  <img src={calendar} alt="" width={12} className="me-2" />
//                  <span style={{ fontSize:'13px', color:'#5E5E5E', fontWeight: 500 }}>
//                    {
//                      property.updatedAt && property.updatedAt !== property.createdAt
//                        ? ` ${new Date(property.updatedAt).toLocaleDateString('en-IN', {
//                            year: 'numeric',
//                            month: 'short',
//                            day: 'numeric'
//                          })}`
//                        : ` ${new Date(property.createdAt).toLocaleDateString('en-IN', {
//                            year: 'numeric',
//                            month: 'short',
//                            day: 'numeric'
//                          })}`
//                    }
//                  </span>
//                </div>
//                <div className="col-12 d-flex flex-col align-items-center mt-1 mb-1 ps-1">
//                 <h6 className="m-0">
//                 {/* <span style={{ fontSize:'15px', color:'#4F4B7E', fontWeight:600, letterSpacing:"1px" }}> 
//                   <img src={
//                     indianprice
//                   } alt="" width={8}  className="me-2"/>
//          {property.price
//           ? formatPrice(property.price)
//           : 'N/A'}                </span>  */}


// <span
//   style={{
//     fontSize: '15px',
//     color: property.rentalAmount === 'On Demand' ? '#8C3C2F' : '#4F4B7E', 
//     fontWeight: 600,
//     letterSpacing: '1px',
//   }}
// >
//    <img src={indianprice} alt="" width={8} className="me-2" />
//   {typeof property.rentalAmount === 'string' && property.rentalAmount === 'On Demand'
//     ? 'On Demand'
//     : property.rentalAmount
//       ? formatPrice(property.rentalAmount)
//       : 'N/A'}
// </span>

//                <span style={{ color: '#4F4B7E', fontSize: '13px', marginLeft: "5px", fontSize: '11px' }}>
//               {property.negotiation ? 'Negotiable' : 'Not Negotiable'}
//             </span>
//                   </h6>
//                </div>
//               </div>
//             </div>
//           </div>
//        </div>

//                   </div>
//                 ))}

//       {shouldShowButton && (
//         <button
//           onClick={() => setShowMap(!showMap)}
//           className="btn btn-primary mb-2 w-100"
//             style={{
//     background: 'linear-gradient(90deg, #28a745, #a8e063)',
//     color: 'white',
//     border: 'none',
//     padding: '10px 20px',
//     borderRadius: '5px',
//     fontWeight: 'bold',
//     boxShadow: '0 4px 12px rgba(40, 167, 69, 0.4)',
//     transition: '0.3s',
//     cursor: 'pointer',
//   }}
//         >
//           {showMap ? 'Hide Property Map' : 'View Property Map'}
//         </button>
//       )}

//       {showMap && (
//           <FilteredPropertyMap filteredProperties={filteredProperties} />
//       )}
//           </>
//               ) : (
//                 <div className="text-center my-4 "
//                 style={{
//                   position: 'fixed',
//                   top: '50%',
//                   left: '50%',
//                   transform: 'translate(-50%, -50%)',
          
//                 }}>
//         <img src={NoData} alt="" width={100}/>      
//         <p>No properties found.</p>
//         </div>              )}
//         {/* {filteredProperties.length > 0 && (
//   <div className="mt-4">
//     <FilteredPropertyMap filteredProperties={filteredProperties} />
//   </div>
// )} */}
//             </div>
//           </div>

//         </Col>
//       </Row>

   


//     </Container>
//   );
// };

// export default AllProperty;







































import React, { useEffect, useState , useRef, useMemo} from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { 
  FaFilter, FaHome, FaCity, FaRupeeSign, FaBed, FaCheck, FaTimes, 
  FaTools, FaIdCard, FaCalendarAlt, FaUserAlt, FaRulerCombined, FaBath, 
   FaCar, FaHandshake, FaToilet, 
  FaCamera,
  FaEye
} from "react-icons/fa";
import { TbFileDescription , TbWheelchair , TbToolsKitchen , TbWorldLongitude , TbMapPinCode  } from "react-icons/tb";
import { AiOutlineColumnWidth, AiOutlineColumnHeight } from "react-icons/ai";
import { BsBank } from "react-icons/bs";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaKitchenSet, FaPhone } from "react-icons/fa6";
import myImage from '../Assets/Rectangle 146.png'; // Correct path
import myImage1 from '../Assets/Rectangle 145.png'; // Correct path
import pic from '../Assets/Mask Group 3@2x.png'; // Correct path
import {FaChartArea, FaMapPin, FaDoorClosed , FaRoad ,FaRegAddressCard } from 'react-icons/fa6';
import { MdBalcony , MdOutlineMeetingRoom, MdOutlineOtherHouses, MdSchedule , MdApproval, MdLocationCity, MdOutlineStarOutline } from "react-icons/md";
import { BsBuildingsFill, BsFillHouseCheckFill } from "react-icons/bs";
import { GiKitchenScale,  GiResize , GiGears} from "react-icons/gi";
import { HiUserGroup } from "react-icons/hi";
import { BiSearchAlt,  BiWorld, BiFilterAlt} from "react-icons/bi";
import {  MdElevator   } from "react-icons/md";
import calendar from '../Assets/Calender-01.png'
import bed from '../Assets/BHK-01.png'
import totalarea from '../Assets/total_area.png'
import postedby from '../Assets/Posted By-01.png'
import indianprice from '../Assets/Indian Rupee-01.png'
import {
  
  FaUsers,
  FaSortAmountDownAlt,
  FaHeadset,
} from 'react-icons/fa';
import NoData from "../Assets/OOOPS-No-Data-Found.png";
import maxprice from "../Assets/Price maxi-01.png";
import Floorr from '../Assets/floor.PNG'
// icon
import propertyMode from '../Assets/prop_mode.PNG';
import propertyType from '../Assets/prop_type.PNG';
import price from '../Assets/amount.png';
import propertyAge from '../Assets/age.PNG';
import bankLoan from '../Assets/alt_mob.PNG';
import negotiation from '../Assets/nego.PNG';
import length from '../Assets/alt_mob.PNG';
import breadth from '../Assets/alt_mob.PNG';
import totalArea from '../Assets/total_area.png';
import ownership from '../Assets/alt_mob.PNG';
import bedrooms from '../Assets/bed.PNG';
import kitchen from '../Assets/alt_mob.PNG';
import kitchenType from '../Assets/alt_mob.PNG';
import balconies from '../Assets/alt_mob.PNG';
import floorNo from '../Assets/floor.PNG';
import areaUnit from '../Assets/area_unit.png';
import propertyApproved from '../Assets/alt_mob.PNG';
import postedBy from '../Assets/posted_by.png';
import facing from '../Assets/facing.png';
import salesMode from '../Assets/alt_mob.PNG';
import salesType from '../Assets/alt_mob.PNG';
import description from '../Assets/alt_mob.PNG';
import furnished from '../Assets/furnish.PNG';
import lift from '../Assets/lift.PNG';
import attachedBathrooms from '../Assets/attach.png';
import western from '../Assets/western.PNG';
import numberOfFloors from '../Assets/floor.PNG';
import carParking from '../Assets/parking.png';
import rentalPropertyAddress from '../Assets/alt_mob.PNG';
import country from '../Assets/alt_mob.PNG';
import state from '../Assets/state.png';
import city from '../Assets/city.PNG';
import district from '../Assets/alt_mob.PNG';
import area from '../Assets/area.png';
import streetName from '../Assets/street.PNG';
import doorNumber from '../Assets/door.png';
import nagar from '../Assets/nagar.PNG';
import ownerName from '../Assets/name.PNG';
import email from '../Assets/email.PNG';
import phone from '../Assets/phone.PNG';
import altphone from '../Assets/alt_mob.PNG';
import minprice from "../Assets/Price Mini-01.png";

import bestTimeToCall from '../Assets/best_time.png';
import pinCode from '../Assets/alt_mob.PNG';
import locationCoordinates from '../Assets/alt_mob.PNG';
import rentType from '../Assets/rent_type.PNG';
import pet from '../Assets/pet.PNG';
import members from '../Assets/member.PNG';
import jobType from '../Assets/job.PNG';
import food from '../Assets/food.png';
import dateavailable from '../Assets/date.PNG';
import securityDeposit from '../Assets/advance.PNG';
import idcard from '../Assets/id.PNG';
import { LiaCitySolid } from "react-icons/lia";
import { GoCheckCircleFill } from "react-icons/go";
import { FcSearch } from "react-icons/fc";
import maplocation from "../Assets/maplocation.png";
import AnimatedSearchLogo from "./AnimatedSearchLogo";
import NoPropertyPopup from './NoPropertyPopup';
import TenantAssistanceModal from './TenantAssistanceModal';
import TenantSearchModal from './TenantSearchModal';
import { getActiveBase, baseToPath } from '../utils/cityBase';
import { chennaiPincodeRows, CHENNAI_DIRECTIONS } from '../chennaiPincodes';



const FilteredPropertyMap = ({ filteredProperties }) => {
  const mapRef = useRef(null);


  useEffect(() => {
    if (!window.google || !filteredProperties.length) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 13,
      center: { lat: 0, lng: 0 },
    });

    const bounds = new window.google.maps.LatLngBounds();

    filteredProperties.forEach((property) => {
      const coords = parseCoordinates(property.locationCoordinates);
      if (!coords) return;

      const marker = new window.google.maps.Marker({
        position: coords,
        map,
        icon: {
          // url:'/mapLocation.jpg',
          // path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#007BFF',
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: 'white',
            scaledSize: new window.google.maps.Size(40, 40), // Width x Height in pixels

        },
      });

      // Custom label for property ID, positioned above the marker
      const label = new window.google.maps.InfoWindow({
        content: `<div style="font-size: 11px; font-weight: bold; color: blue;"><span style={{color:"grey"}}>rentId:</span>${property.rentId}</div>`,
        position: {
          lat: coords.lat + 0.0003, // Adjust to move the label vertically
          lng: coords.lng,
        },
      });
label.open(map, marker);

      // Open the label when the marker is clicked (optional)
      // marker.addListener('click', () => {
      //   label.open(map, marker);
      // });

      bounds.extend(coords);
    });

    map.fitBounds(bounds);
  }, [filteredProperties]);

  const parseCoordinates = (coordString) => {
    const regex = /([+-]?\d+(\.\d+)?)[^\d+-]+([+-]?\d+(\.\d+)?)/;
    const match = coordString.match(regex);
    if (!match) return null;

    return {
      lat: parseFloat(match[1]),
      lng: parseFloat(match[3]),
    };
  };
 
  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '300px', marginTop: '20px', borderRadius: '8px' }}
    />
  );
};
const AllProperty = () => {
  const [properties, setProperties] = useState([]);
  // Pincode counts for the area-ticker marquee. Pulled from the same endpoint
  // the admin Search Pincode page uses so the numbers always match.
  const [marqueePincodeCounts, setMarqueePincodeCounts] = useState({});
  // Raw property list used by the property-card details popup.
  const [marqueePropertyList, setMarqueePropertyList] = useState([]);
  // Property card the user tapped on the "Total Rent Property Available" row.
  const [selectedPropertyCard, setSelectedPropertyCard] = useState(null);
  // Chennai-only: which direction card (Central/North/South/West) the user
  // tapped. Opens an area picker modal that drills into selectedPropertyCard.
  const [selectedChennaiDirection, setSelectedChennaiDirection] = useState(null);

  // Browser-back handling for the marquee popups: opening a popup pushes a
  // history entry, hitting back pops the topmost open popup (property card
  // or tenant card first, then the Chennai direction picker). Refs keep the
  // popstate listener from capturing stale state values. Works for PY and
  // CH flows. NOTE: selectedTenantCardRef is wired up below the
  // selectedTenantCard state declaration; declared here for closure capture.
  const selectedPropertyCardRef = useRef(null);
  const selectedChennaiDirectionRef = useRef(null);
  const selectedTenantCardRef = useRef(null);
  useEffect(() => { selectedPropertyCardRef.current = selectedPropertyCard; }, [selectedPropertyCard]);
  useEffect(() => { selectedChennaiDirectionRef.current = selectedChennaiDirection; }, [selectedChennaiDirection]);
  useEffect(() => {
    const onPopState = () => {
      // Close the topmost popup, in reverse-open order.
      if (selectedPropertyCardRef.current) {
        setSelectedPropertyCard(null);
      } else if (selectedTenantCardRef.current) {
        setSelectedTenantCard(null);
      } else if (selectedChennaiDirectionRef.current) {
        setSelectedChennaiDirection(null);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  const openChennaiDirection = (dir) => {
    window.history.pushState({ rpModal: 'chennai-direction' }, '');
    setSelectedChennaiDirection(dir);
  };
  const openPropertyCard = (card) => {
    window.history.pushState({ rpModal: 'property-card' }, '');
    setSelectedPropertyCard(card);
  };
  const openTenantCard = (card) => {
    window.history.pushState({ rpModal: 'tenant-card' }, '');
    setSelectedTenantCard(card);
  };
  // Close helpers — use history.back() so the popstate listener handles the
  // actual state reset, keeping the history stack in sync.
  const closePropertyCard = () => { window.history.back(); };
  const closeChennaiDirection = () => { window.history.back(); };
  const closeTenantCard = () => { window.history.back(); };
  // Per-pincode active tenant-assistance counts for the second ticker.
  const [tenantAssistanceCounts, setTenantAssistanceCounts] = useState({});
  // Raw active tenant-assistance records, used by the details popup.
  const [tenantAssistanceList, setTenantAssistanceList] = useState([]);
  // The pincode card the user tapped (opens the details popup).
  const [selectedTenantCard, setSelectedTenantCard] = useState(null);
  // Keys (Ra_Id/_id) of tenants whose phone number has been revealed.
  const [revealedTenantContacts, setRevealedTenantContacts] = useState([]);
  // Key (Ra_Id/_id) of the tenant whose full details are expanded via "More".
  const [expandedTenant, setExpandedTenant] = useState(null);
  // Sync tenant-card state into the popstate-listener ref (declared earlier).
  useEffect(() => { selectedTenantCardRef.current = selectedTenantCard; }, [selectedTenantCard]);
  // Points charged per tenant-number reveal (admin-tunable, default 20).
  const [tenantContactPoints, setTenantContactPoints] = useState(20);
  // const [filters, setFilters] = useState({ id: '', price: '', propertyMode: '', city: '' });
  const [filters, setFilters] = useState({ 
    id: '', 
    minPrice: '', 
    maxPrice: '', 
    propertyMode: '', 
    area: '' ,
    nagar: '',
    streetName: '',
    pinCode: '',
     propertyType: '',
      rentType: '',
     propertyType: '',
      bedrooms: '',
     floorNo: '',
     state:""


  });
  const [hoverSearch, setHoverSearch] = useState(false);
  const [hoverClear, setHoverClear] = useState(false);
  const [hoverAdvance, setHoverAdvance] = useState(false);
  const [hoverHome, setHoverHome] = useState(false);
  const [showNoDataModal, setShowNoDataModal] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Area suggestions state
  const [areaSuggestions, setAreaSuggestions] = useState([]);
  const [showAreaSuggestions, setShowAreaSuggestions] = useState(false);
  const [pincodeSuggestions, setPincodeSuggestions] = useState([]);
  const [showPincodeSuggestions, setShowPincodeSuggestions] = useState(false);
  
  // Navbar search box state
  const [navbarSearchValue, setNavbarSearchValue] = useState("");
  const [navbarAreaSuggestions, setNavbarAreaSuggestions] = useState([]);
  const [showNavbarAreaSuggestions, setShowNavbarAreaSuggestions] = useState(false);
  const [navbarKeyboardIndex, setNavbarKeyboardIndex] = useState(-1); // For keyboard navigation
  const navbarSearchInputRef = useRef(null);

  // Advanced Filter Card State
  const [advancedFilter, setAdvancedFilter] = useState({
    propertyType: '',
    propertyMode: '',
    rentType: '',
    bedroom: '',
    floor: '',
    minRent: '',
    maxRent: '',
    area: '',
    street: '',
    state: '',
    pincode: ''
  });

  const [filterCardResults, setFilterCardResults] = useState([]);
  const [filterCardLoading, setFilterCardLoading] = useState(false);
  const [filterCardSearched, setFilterCardSearched] = useState(false);

  // Predefined rent amount ranges
  const rentRanges = [
    { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
    { label: '₹2,000 - ₹3,000', min: 2000, max: 3000 },
    { label: '₹3,000 - ₹5,000', min: 3000, max: 5000 },
    { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
    { label: '₹10,000 - ₹20,000', min: 10000, max: 20000 },
    { label: '₹20,000 - ₹30,000', min: 20000, max: 30000 },
    { label: '₹30,000 - ₹40,000', min: 30000, max: 40000 },
    { label: '₹40,000 - ₹50,000', min: 40000, max: 50000 },
    { label: '₹50,000+', min: 50000, max: 1000000000 }
  ];

  // Horizontal Filter Section State
  const [horizontalFilters, setHorizontalFilters] = useState({
    selectedPropertyMode: [],
    selectedPropertyType: [],
    selectedRentRanges: [], // Array of selected range indices
    selectedRentType: [],
    selectedBedroom: [],
    selectedFloor: [],
    selectedArea: '',
    selectedPincode: ''
  });
  
  const [openFilterDropdown, setOpenFilterDropdown] = useState(null);
  // Modal states for each filter
  const [openPropertyModeModal, setOpenPropertyModeModal] = useState(false);
  const [openPropertyTypeModal, setOpenPropertyTypeModal] = useState(false);
  const [openRentAmountModal, setOpenRentAmountModal] = useState(false);
  const [openRentTypeModal, setOpenRentTypeModal] = useState(false);
  const [openBedroomModal, setOpenBedroomModal] = useState(false);
  const [openFloorModal, setOpenFloorModal] = useState(false);
  const [openAreaModal, setOpenAreaModal] = useState(false);
  
  // Filter Navigation States
  const [currentFilterIndex, setCurrentFilterIndex] = useState(0);
  const filtersList = [
    { name: 'Property Mode', state: openPropertyModeModal, setter: setOpenPropertyModeModal },
    { name: 'Property Type', state: openPropertyTypeModal, setter: setOpenPropertyTypeModal },
    { name: 'Rent Amount', state: openRentAmountModal, setter: setOpenRentAmountModal },
    { name: 'Rent Type', state: openRentTypeModal, setter: setOpenRentTypeModal },
    { name: 'Bedroom', state: openBedroomModal, setter: setOpenBedroomModal },
    { name: 'Floor', state: openFloorModal, setter: setOpenFloorModal },
    { name: 'Area', state: openAreaModal, setter: setOpenAreaModal },
  ];

  const goToNextFilter = () => {
    if (currentFilterIndex < filtersList.length - 1) {
      filtersList[currentFilterIndex].setter(false);
      const nextIndex = currentFilterIndex + 1;
      filtersList[nextIndex].setter(true);
      setCurrentFilterIndex(nextIndex);
    }
  };

  const goToPreviousFilter = () => {
    if (currentFilterIndex > 0) {
      filtersList[currentFilterIndex].setter(false);
      const prevIndex = currentFilterIndex - 1;
      filtersList[prevIndex].setter(true);
      setCurrentFilterIndex(prevIndex);
    }
  };

  const closeAllFilters = () => {
    filtersList.forEach(filter => filter.setter(false));
    setCurrentFilterIndex(0);
  };

  const openFilterModal = (index) => {
    setCurrentFilterIndex(index);
    filtersList[index].setter(true);
  };
  
  const [horizontalFilterResults, setHorizontalFilterResults] = useState([]);
  const [horizontalFilterLoading, setHorizontalFilterLoading] = useState(false);
  const [horizontalFilterSearched, setHorizontalFilterSearched] = useState(false);

  // Tenant Assistance Modal States
  const [showTenantAssistanceModal, setShowTenantAssistanceModal] = useState(false);
  const [capturedFilterData, setCapturedFilterData] = useState({});

  // Area to Pincode mapping
  const areaPincodeMap = {
    "Abishegapakkam": "605007",
    "Ariyankuppam": "605007",
    "Arumbarthapuram": "605110",
    "Bahoor": "607402",
    "Bommayarpalayam": "605104",
    "Botanical Garden": "605001",
    "Kalapet": "605014",
    "Courivinatham": "607402",
    "Dhanvantry Nagar": "605006",
    "Embalam": "605106",
    "Irumbai": "605111",
    "Karayamputhur": "605106",
    "Shanmugapuram": "605009",
    "Karikalambakkam": "605007",
    "Kariyamanikam": "605106",
    "Kijour": "605106",
    "Kilpudupattu": "605014",
    "Kilsirivi": "604301",
    "Kirumambakkam": "607402",
    "Korkadu": "605110",
    "Kottakuppam": "605104",
    "Kuilapalayam": "605101",
    "Lawspet": "605008",
    "Maducore": "605105",
    "Manamedu": "607402",
    "Manapeth": "607402",
    "Mandagapet": "605106",
    "Mangalam": "605110",
    "Mannadipattu": "605501",
    "Morattandi": "605101",
    "Mottoupalayam": "605009",
    "Mouroungapakkam": "605004",
    "Moutrepaleam": "605009",
    "Mudaliarpet": "605004",
    "Muthialpet": "605003",
    "Mutrampattu": "605501",
    "Nallavadu": "605007",
    "Nellithoppe": "605005",
    "Nettapakkam": "605106",
    "Odiensalai": "605001",
    "Ozhugarai": "605010",
    "Padmin nagar": "605012",
    "Pakkam": "605106",
    "Pandakkal": "673310",
    "Pillaichavady": "605014",
    "Pillayarkuppam": "607402",
    "Pondicherry": "605001",
    "Pondicherry Bazaar": "605001",
    "Pondicherry Courts": "605001",
    "Pondicherry North": "605001",
    "Pondicherry University": "605014",
    "Pooranankuppam": "605007",
    "Poothurai": "605111",
    "Rayapudupakkam": "605111",
    "Reddiyarpalayam": "605010",
    "Saram(py)": "605013",
    "Sedarapet": "605111",
    "Seliamedu": "607402",
    "Sellipet": "605501",
    "Sri Aurobindo ashram": "605002",
    "Sulthanpet": "605110",
    "Thattanchavady": "605009",
    "Thengaithittu": "605004",
    "Thimmanaickenpalayam": "605007",
    "Tirukkanur": "605501",
    "Vadhanur": "605501",
    "Veerampattinam": "605007",
    "Venkata Nagar": "605011",
    "Villiyanur": "605110",
    "Vimacoundinpaleam": "605009",
    "Viranam": "605106",
    "Yanam": "533464",
  };

  // Handle navbar search box input change
  const handleNavbarSearchChange = (e) => {
    const value = e.target.value;
    setNavbarSearchValue(value);
    setNavbarKeyboardIndex(-1); // Reset keyboard index when typing

    if (value.length > 0) {
      const areaNames = Object.keys(areaPincodeMap);
      // Search in both area names and pincodes (case-insensitive, partial match)
      const filtered = areaNames.filter(area => {
        const areaPincode = areaPincodeMap[area];
        return (
          area.toLowerCase().includes(value.toLowerCase()) ||
          areaPincode.includes(value) // Partial pincode match (e.g., "605" matches "605007")
        );
      });
      setNavbarAreaSuggestions(filtered);
      setShowNavbarAreaSuggestions(filtered.length > 0);
    } else {
      setNavbarAreaSuggestions([]);
      setShowNavbarAreaSuggestions(false);
    }
  };

  // Handle keyboard navigation in suggestions
  const handleNavbarKeyDown = (e) => {
    if (!showNavbarAreaSuggestions || navbarAreaSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setNavbarKeyboardIndex(prev => 
          prev < navbarAreaSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setNavbarKeyboardIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (navbarKeyboardIndex >= 0 && navbarAreaSuggestions[navbarKeyboardIndex]) {
          handleNavbarAreaSelect(navbarAreaSuggestions[navbarKeyboardIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowNavbarAreaSuggestions(false);
        break;
      default:
        break;
    }
  };

  // Handle navbar area selection
  const handleNavbarAreaSelect = (selectedArea) => {
    const pincode = areaPincodeMap[selectedArea] || "";
    setNavbarSearchValue(selectedArea);
    // When selecting an area, set both area and pincode to enable proper filtering
    setFilters(prev => ({
      ...prev,
      area: selectedArea,
      pinCode: pincode
    }));
    // Sync selected area to horizontal filters for the filter section
    setHorizontalFilters(prev => ({
      ...prev,
      selectedArea: selectedArea,
      selectedPincode: pincode
    }));
    setShowNavbarAreaSuggestions(false);
    setNavbarAreaSuggestions([]);
    setSearchPerformed(true); // Mark search as performed
    setHorizontalFilterSearched(false); // Reset filter search state when new area is selected
  };

  // Clear search input, hide suggestions, and reset all filters
  const handleClearSearch = () => {
    setNavbarSearchValue('');
    setNavbarAreaSuggestions([]);
    setShowNavbarAreaSuggestions(false);
    setFilters(prev => ({
      ...prev,
      area: '',
      pinCode: ''
    }));
    // Reset all horizontal filters when user clears area search
    setHorizontalFilters({
      selectedPropertyMode: [],
      selectedPropertyType: [],
      selectedRentRanges: [],
      selectedRentType: [],
      selectedBedroom: [],
      selectedFloor: [],
      selectedArea: '',
      selectedPincode: ''
    });
    setHorizontalFilterResults([]);
    setHorizontalFilterSearched(false);
    setOpenFilterDropdown(null);
    setSearchPerformed(false);
  };

  // Handle filter card input change
  const handleFilterCardChange = (field, value) => {
    setAdvancedFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle advanced filter card search - Client-side filtering
  const handleAdvancedFilterSearch = () => {
    setFilterCardLoading(true);
    setFilterCardSearched(true);

    // Capture filter data for tenant assistance
    setCapturedFilterData({
      propertyType: advancedFilter.propertyType,
      propertyMode: advancedFilter.propertyMode,
      rentType: advancedFilter.rentType,
      bedroom: advancedFilter.bedroom,
      floor: advancedFilter.floor,
      minRent: advancedFilter.minRent,
      maxRent: advancedFilter.maxRent,
      area: advancedFilter.area,
      street: advancedFilter.street,
      state: advancedFilter.state,
      pincode: advancedFilter.pincode
    });

    // Show tenant assistance modal
    setShowTenantAssistanceModal(true);

    // Client-side filtering using already-fetched properties
    const filtered = properties.filter((property) => {
      // Property Type filter - exact match
      const propertyTypeMatch = !advancedFilter.propertyType || 
        property.propertyType?.toLowerCase() === advancedFilter.propertyType.toLowerCase();

      // Property Mode filter - exact match
      const propertyModeMatch = !advancedFilter.propertyMode || 
        property.propertyMode?.toLowerCase() === advancedFilter.propertyMode.toLowerCase();

      // Rent Type filter - exact match
      const rentTypeMatch = !advancedFilter.rentType || 
        property.rentType?.toLowerCase() === advancedFilter.rentType.toLowerCase();

      // Bedroom filter - exact match
      const bedroomMatch = !advancedFilter.bedroom || 
        property.bedrooms?.toString().toLowerCase() === advancedFilter.bedroom.toLowerCase();

      // Floor filter - exact match
      const floorMatch = !advancedFilter.floor || 
        property.floorNo?.toString().toLowerCase() === advancedFilter.floor.toLowerCase();

      // Area filter - exact match
      const areaMatch = !advancedFilter.area || 
        property.area?.toLowerCase() === advancedFilter.area.toLowerCase();

      // Street Name filter - partial match (includes)
      const streetMatch = !advancedFilter.street || 
        property.streetName?.toLowerCase().includes(advancedFilter.street.toLowerCase());

      // State filter - exact match
      const stateMatch = !advancedFilter.state || 
        property.state?.toLowerCase() === advancedFilter.state.toLowerCase();

      // Pincode filter - exact match
      const pincodeMatch = !advancedFilter.pincode || 
        property.pinCode?.toString() === advancedFilter.pincode?.toString();

      // Rent Amount filters - range match
      const minRentMatch = !advancedFilter.minRent || 
        property.rentalAmount >= Number(advancedFilter.minRent);

      const maxRentMatch = !advancedFilter.maxRent || 
        property.rentalAmount <= Number(advancedFilter.maxRent);

      // All filters must pass
      return propertyTypeMatch && propertyModeMatch && rentTypeMatch && 
             bedroomMatch && floorMatch && areaMatch && streetMatch && 
             stateMatch && pincodeMatch && minRentMatch && maxRentMatch;
    });

    setFilterCardResults(filtered);
    setFilterCardLoading(false);
  };

  // Handle filter card reset
  const handleAdvancedFilterReset = () => {
    setAdvancedFilter({
      propertyType: '',
      propertyMode: '',
      rentType: '',
      bedroom: '',
      floor: '',
      minRent: '',
      maxRent: '',
      area: '',
      street: '',
      state: '',
      pincode: ''
    });
    setFilterCardResults([]);
    setFilterCardSearched(false);
  };

  // Horizontal Filter Handlers
  const handleHorizontalFilterChange = (filterType, value) => {
    setHorizontalFilters(prev => {
      const updated = { ...prev };
      const filterKey = `selected${filterType}`;
      
      if (Array.isArray(updated[filterKey])) {
        if (updated[filterKey].includes(value)) {
          updated[filterKey] = updated[filterKey].filter(item => item !== value);
        } else {
          updated[filterKey] = [...updated[filterKey], value];
        }
      }
      return updated;
    });
  };

  const handleAreaInputChange = (e) => {
    const value = e.target.value;
    // Keep both states in sync: the Search Property modal reads `filters.area`,
    // the horizontal filter Area modal reads `horizontalFilters.selectedArea`.
    setHorizontalFilters(prev => ({ ...prev, selectedArea: value }));
    setFilters(prev => ({ ...prev, area: value }));

    if (value.length > 0) {
      const filtered = Object.keys(areaPincodeMap).filter(area =>
        area.toLowerCase().includes(value.toLowerCase())
      );
      setAreaSuggestions(filtered);
      setShowAreaSuggestions(filtered.length > 0);
    } else {
      setAreaSuggestions([]);
      setShowAreaSuggestions(false);
    }
  };

  const handleAreaSelect = (selectedArea) => {
    const pincode = areaPincodeMap[selectedArea] || "";
    setHorizontalFilters(prev => ({
      ...prev,
      selectedArea: selectedArea,
      selectedPincode: pincode
    }));
    // Mirror into `filters` so the Search Property modal's bound input updates.
    setFilters(prev => ({
      ...prev,
      area: selectedArea,
      pinCode: pincode
    }));
    setShowAreaSuggestions(false);
    setAreaSuggestions([]);
  };

  // Handle pincode input with suggestions
  const handlePincodeInputChange = (e) => {
    const { value } = e.target;
    setFilters(prev => ({ ...prev, pinCode: value }));

    if (value.length > 0) {
      // Get all pincodes from areaPincodeMap
      const allPincodes = Object.values(areaPincodeMap);
      // Filter unique pincodes that match partial input
      const filtered = [...new Set(allPincodes)].filter(pincode =>
        pincode.includes(value)
      );
      setPincodeSuggestions(filtered);
      setShowPincodeSuggestions(filtered.length > 0);
    } else {
      setPincodeSuggestions([]);
      setShowPincodeSuggestions(false);
    }
  };

  // Handle pincode selection from suggestions
  const handlePincodeSelect = (selectedPincode) => {
    setFilters(prev => ({
      ...prev,
      pinCode: selectedPincode
    }));
    setShowPincodeSuggestions(false);
    setPincodeSuggestions([]);
  };

  const handleHorizontalFilterSearch = () => {
    // If no filters are selected, just close dropdown
    if (
      horizontalFilters.selectedPropertyMode.length === 0 &&
      horizontalFilters.selectedPropertyType.length === 0 &&
      horizontalFilters.selectedRentRanges.length === 0 &&
      horizontalFilters.selectedRentType.length === 0 &&
      horizontalFilters.selectedBedroom.length === 0 &&
      horizontalFilters.selectedFloor.length === 0 &&
      !horizontalFilters.selectedArea &&
      !horizontalFilters.selectedPincode
    ) {
      setOpenFilterDropdown(null);
      return;
    }
    
    setHorizontalFilterLoading(true);
    setHorizontalFilterSearched(true);
    
    // Log selected filters for debugging
    console.log('🔍 Filter Search Started');
    console.log('Selected Filters:', {
      propertyMode: horizontalFilters.selectedPropertyMode,
      propertyType: horizontalFilters.selectedPropertyType,
      rentRanges: horizontalFilters.selectedRentRanges.map(idx => rentRanges?.[idx]?.label || 'undefined'),
      rentType: horizontalFilters.selectedRentType,
      bedroom: horizontalFilters.selectedBedroom,
      floor: horizontalFilters.selectedFloor,
      area: horizontalFilters.selectedArea,
      pincode: horizontalFilters.selectedPincode
    });
    
    // Client-side filtering - Always filter by the area from navbar if set
    const filtered = properties.filter((property) => {
      // Property Mode filter - match if property mode is in selected modes (exact match)
      const propertyModeMatch = horizontalFilters.selectedPropertyMode.length === 0 || 
        horizontalFilters.selectedPropertyMode.some(mode => 
          property.propertyMode?.toLowerCase() === mode.toLowerCase()
        );

      // Property Type filter - match if property type is in selected types (exact match)
      const propertyTypeMatch = horizontalFilters.selectedPropertyType.length === 0 || 
        horizontalFilters.selectedPropertyType.some(type => 
          property.propertyType?.toLowerCase() === type.toLowerCase()
        );

      // Rent Type filter - match if rent type is in selected types (exact match)
      const rentTypeMatch = horizontalFilters.selectedRentType.length === 0 || 
        horizontalFilters.selectedRentType.some(rentType => 
          property.rentType?.toLowerCase() === rentType.toLowerCase()
        );

      // Bedroom filter - match if bedrooms is in selected bedrooms (exact match)
      // Extract number from '1 BHK', '2 BHK' format
      const bedroomMatch = horizontalFilters.selectedBedroom.length === 0 || 
        horizontalFilters.selectedBedroom.some(bedroom => {
          const selectedNum = bedroom.replace(/\s*BHK.*$/i, '').trim();
          const propertyNum = property.bedrooms?.toString().trim();
          return propertyNum?.toLowerCase() === selectedNum.toLowerCase();
        });

      // Floor filter - match if floor is in selected floors (exact match)
      // Handle floor name mapping
      const floorMatch = horizontalFilters.selectedFloor.length === 0 || 
        horizontalFilters.selectedFloor.some(floor => {
          const propertyFloor = property.floorNo?.toString().toLowerCase().trim() || '';
          const selectedFloor = floor.toLowerCase().trim();
          
          // Direct match
          if (propertyFloor === selectedFloor) return true;
          
          // Handle floor number matching (e.g., "1" matches "1st Floor")
          const floorNum = floor.match(/\d+/)?.[0];
          if (floorNum && propertyFloor === floorNum) return true;
          
          // Handle special cases
          if (selectedFloor.includes('ground') && (propertyFloor === 'ground' || propertyFloor === '0')) return true;
          if (selectedFloor.includes('basement') && propertyFloor.includes('basement')) return true;
          
          return false;
        });

      // Rent Amount filter - match if rental amount matches any selected range
      const rentAmountMatch = horizontalFilters.selectedRentRanges.length === 0 || 
        horizontalFilters.selectedRentRanges.some(rangeIndex => {
          const range = rentRanges?.[rangeIndex];
          // Add null check to prevent "Cannot read properties of undefined"
          if (!range) return false;
          return property.rentalAmount >= range.min && property.rentalAmount <= range.max;
        });

      // Area filter - exact match
      // If area was searched in navbar, always enforce it. If also selected in filter section, use that.
      const effectiveAreaFilter = filters.area || horizontalFilters.selectedArea;
      const areaMatch = !effectiveAreaFilter ||
        property.area?.toLowerCase() === effectiveAreaFilter.toLowerCase();

      // Pincode filter - exact match
      const pincodeMatch = !horizontalFilters.selectedPincode || 
        property.pinCode?.toString() === horizontalFilters.selectedPincode?.toString();

      // All filters must pass (AND logic between different filter types, OR logic within each type)
      return propertyModeMatch && propertyTypeMatch && rentTypeMatch && 
             bedroomMatch && floorMatch && rentAmountMatch && 
             areaMatch && pincodeMatch;
    });

    console.log(`✅ Filter Complete: Found ${filtered.length} matching properties out of ${properties.length}`);
    if (filtered.length > 0) {
      console.log('Sample Results:', filtered.slice(0, 3).map(p => ({
        id: p.rentId,
        mode: p.propertyMode,
        type: p.propertyType,
        rent: p.rentalAmount
      })));
    }

    // Capture filter data for tenant assistance
    setCapturedFilterData({
      propertyMode: horizontalFilters.selectedPropertyMode.join(', '),
      propertyType: horizontalFilters.selectedPropertyType.join(', '),
      rentType: horizontalFilters.selectedRentType.join(', '),
      bedroom: horizontalFilters.selectedBedroom.join(', '),
      floor: horizontalFilters.selectedFloor.join(', '),
      minRent: horizontalFilters.selectedRentRanges.length > 0 ? 
        Math.min(...horizontalFilters.selectedRentRanges.map(idx => rentRanges[idx]?.min || 0)) : '',
      maxRent: horizontalFilters.selectedRentRanges.length > 0 ? 
        Math.max(...horizontalFilters.selectedRentRanges.map(idx => rentRanges[idx]?.max || 0)) : '',
      area: horizontalFilters.selectedArea,
      pincode: horizontalFilters.selectedPincode
    });

    // Show tenant assistance modal
    setShowTenantAssistanceModal(true);

    setHorizontalFilterResults(filtered);
    setOpenFilterDropdown(null);
    setHorizontalFilterLoading(false);
  };

  const handleClearAllHorizontalFilters = () => {
    setHorizontalFilters({
      selectedPropertyMode: [],
      selectedPropertyType: [],
      selectedRentRanges: [],
      selectedRentType: [],
      selectedBedroom: [],
      selectedFloor: [],
      selectedArea: '',
      selectedPincode: ''
    });
    setHorizontalFilterResults([]);
    setHorizontalFilterSearched(false);
    setOpenFilterDropdown(null);
  };

  const getHorizontalFilterCounts = () => ({
    propertyMode: horizontalFilters.selectedPropertyMode.length,
    propertyType: horizontalFilters.selectedPropertyType.length,
    rentAmount: horizontalFilters.selectedRentRanges.length,
    rentType: horizontalFilters.selectedRentType.length,
    bedroom: horizontalFilters.selectedBedroom.length,
    floor: horizontalFilters.selectedFloor.length,
    area: horizontalFilters.selectedArea ? 1 : 0,
    pincode: horizontalFilters.selectedPincode ? 1 : 0
  });

  const [imageCounts, setImageCounts] = useState({}); // Store image count for each property
  const [loading, setLoading] = useState(true);
    const [uploads, setUploads] = useState([]);
  const [mergedData, setMergedData] = useState([]);


  const [showMap, setShowMap] = useState(false);
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);
  const [isTenantSearchOpen, setIsTenantSearchOpen] = useState(false);

  const [clickedCar, setClickedCar] = useState([]);
  const location = useLocation();
  
    const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";

      const [phoneNumber, setPhoneNumber] = useState(storedPhoneNumber);
  

  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
          phoneNumber: phoneNumber,
          viewedFile: "All Property",
          viewTime: new Date().toISOString(),
        });
      } catch (err) {
      }
    };
  
    if (phoneNumber) {
      recordDashboardView();
    }
  }, [phoneNumber]);

  // Auto-close search menu after 5 seconds if user doesn't interact
  useEffect(() => {
    if (isSearchMenuOpen) {
      const timer = setTimeout(() => {
        setIsSearchMenuOpen(false);
      }, 5000); // 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isSearchMenuOpen]);


  const [advancedFilters, setAdvancedFilters] = useState({
    propertyMode: '', propertyType: '', minPrice: '', maxPrice: '', propertyAge: '', bankLoan: '',
    negotiation: '', length: '', breadth: '', totalArea: '', minTotalArea: '', ownership: '', bedrooms: '',
    minBedrooms: '', kitchen: '', kitchenType: '', balconies: '', floorNo: '', areaUnit: '', propertyApproved: '',
    facing: '', postedBy: '', furnished: '', lift: '', attachedBathrooms: '', minAttachedBathrooms: '',
    western: '', minWestern: '', rentType: '', carParking: '', city: '', phoneNumber: '', state: '', wheelChairAvailable: ''
  });
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
  const filterPopupTriggerRef = useRef(null);


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
 const fieldIcons = {
  // Contact Details
  phoneNumber: <img src={phone} alt="" style={{ width: 20, height: 20 }} />,
  alternatePhone: <img src={altphone} alt="" style={{ width: 20, height: 20 }} />,
  email: <img src={email} alt="" style={{ width: 20, height: 20 }} />,
  bestTimeToCall: <img src={bestTimeToCall} alt="" style={{ width: 20, height: 20 }} />,
  
  // Property Location
  rentalPropertyAddress: <img src={price} alt="" style={{ width: 20, height: 20 }} />,
  country: <img src={country} alt="" style={{ width: 20, height: 20 }} />,
  state: <img src={state} alt="" style={{ width: 20, height: 20 }} />,
  city: <img src={city} alt="" style={{ width: 20, height: 20 }} />,
  district: <LiaCitySolid color="#4F4B7E" size={20}/>,
  area: <img src={area} alt="" style={{ width: 20, height: 20 }} />,
  streetName: <img src={streetName} alt="" style={{ width: 20, height: 20 }} />,
  doorNumber: <img src={doorNumber} alt="" style={{ width: 20, height: 20 }} />,
  nagar: <img src={nagar} alt="" style={{ width: 20, height: 20 }} />,

  // Ownership & Posting Info
  ownerName: <img src={ownerName} alt="" style={{ width: 20, height: 20 }} />,
  postedBy: <img src={postedBy} alt="" style={{ width: 20, height: 20 }} />,
  ownership: <img src={ownership} alt="" style={{ width: 20, height: 20 }} />,

  // Property Details
  propertyMode: <img src={propertyMode} alt="" style={{ width: 20, height: 20 }} />,
  propertyType: <img src={propertyType} alt="" style={{ width: 20, height: 20 }} />,
  propertyApproved: <img src={propertyApproved} alt="" style={{ width: 20, height: 20 }} />,
  propertyAge: <img src={propertyAge} alt="" style={{ width: 20, height: 20 }} />,
  description:<TbFileDescription color="#4F4B7E" size={20}/>,
  rentType: <img src={rentType} alt="" style={{ width: 20, height: 20 }} />,
  availableDate: <img src={dateavailable} alt="" style={{ width: 20, height: 20 }} />,
  familyMembers: <img src={members} alt="" style={{ width: 20, height: 20 }} />,
  foodHabit: <img src={food} alt="" style={{ width: 20, height: 20 }} />,
  jobType: <img src={jobType} alt="" style={{ width: 20, height: 20 }} />,
  petAllowed: <img src={pet} alt="" style={{ width: 20, height: 20 }} />,

  // Pricing & Financials
  rentalAmount: <img src={price} alt="" style={{ width: 20, height: 20 }} />,
  bankLoan: <img src={bankLoan} alt="" style={{ width: 20, height: 20 }} />,
  negotiation: <img src={negotiation} alt="" style={{ width: 20, height: 20 }} />,
  securityDeposit: <img src={securityDeposit} alt="" style={{ width: 20, height: 20 }} />,
  wheelChairAvailable: <TbWheelchair color="#4F4B7E" size={20}/>,

  // Measurements
  length: <img src={length} alt="" style={{ width: 20, height: 20 }} />,
  breadth: <img src={breadth} alt="" style={{ width: 20, height: 20 }} />,
  totalArea: <img src={totalArea} alt="" style={{ width: 20, height: 20 }} />,
  areaUnit: <img src={areaUnit} alt="" style={{ width: 20, height: 20 }} />,

  // Room & Floor Details
  bedrooms: <img src={bedrooms} alt="" style={{ width: 20, height: 20 }} />,
  kitchen: <TbToolsKitchen color="#4F4B7E" size={20}/>,
  kitchenType: <img src={kitchenType} alt="" style={{ width: 20, height: 20 }} />,
  balconies: <MdBalcony color="#4F4B7E" size={20}/>,
  floorNo: <img src={floorNo} alt="" style={{ width: 20, height: 20 }} />,
  numberOfFloors: <img src={numberOfFloors} alt="" style={{ width: 20, height: 20 }} />,
  attachedBathrooms: <img src={attachedBathrooms} alt="" style={{ width: 20, height: 20 }} />,
  western: <img src={western} alt="" style={{ width: 20, height: 20 }} />,
  locationCoordinates: <TbWorldLongitude color="#4F4B7E" size={20}/>,
  pinCode: <TbMapPinCode color="#4F4B7E" size={20}/>,

  // Features & Amenities
  facing: <img src={facing} alt="" style={{ width: 20, height: 20 }} />,
  // salesMode: <img src={salesMode} alt="" style={{ width: 20, height: 20 }} />,
  // salesType: <img src={salesType} alt="" style={{ width: 20, height: 20 }} />,
  furnished: <img src={furnished} alt="" style={{ width: 20, height: 20 }} />,
  lift: <img src={lift} alt="" style={{ width: 20, height: 20 }} />,
  carParking: <img src={carParking} alt="" style={{ width: 20, height: 20 }} />,
};
// useEffect(() => {
//   const fetchAllProperties = async () => {
//     setLoading(true);
//     try {
//       const [featuredRes, activeRes] = await Promise.all([
//         axios.get(`${process.env.REACT_APP_API_URL}/fetch-featured-properties`),
//         axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users`),
//       ]);

//       const featuredProperties = featuredRes.data.properties.map((property) => ({
//         ...property,
//         isFeatured: true,
//       }));

//       const featuredrentIds = new Set(featuredProperties.map((p) => p.rentId));

//       const activeProperties = activeRes.data.users
//         .filter((property) => !featuredrentIds.has(property.rentId)) // Skip duplicates
//         .map((property) => ({
//           ...property,
//           isFeatured: false,
//         }));

//       // Merge and sort by createdAt (newest first)
//       const allProperties = [...featuredProperties, ...activeProperties].sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );

//       setProperties(allProperties);
//     } catch (error) {
//       // setError("Failed to fetch properties.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchAllProperties();
// }, []);

// useEffect(() => {
//   const fetchAllProperties = async () => {
//     setLoading(true);
//     try {
//       const [featuredRes, activeRes] = await Promise.all([
//         axios.get(`${process.env.REACT_APP_API_URL}/fetch-featured-properties`),
//         axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users-on-demand`),
//       ]);

//       const featuredProperties = featuredRes.data.properties.map((property) => ({
//         ...property,
//         isFeatured: true,
//       }));

//       const featuredrentIds = new Set(featuredProperties.map((p) => p.rentId));

//       const activeProperties = activeRes.data.users
//         .filter((property) => !featuredrentIds.has(property.rentId))
//         .map((property) => ({
//           ...property,
//           isFeatured: false,
//         }));

//       const allProperties = [...featuredProperties, ...activeProperties].sort((a, b) => {
//         const aDate = new Date(a.updatedAt || a.createdAt);
//         const bDate = new Date(b.updatedAt || b.createdAt);
//         return bDate - aDate; // Newest first
//       });

//       setProperties(allProperties);
//     } catch (error) {
//       // handle error
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchAllProperties();
// }, []);



// useEffect(() => {
//   const fetchAllProperties = async () => {
//     setLoading(true);
//     try {
//       const [featuredRes, activeRes] = await Promise.all([
//         axios.get(`${process.env.REACT_APP_API_URL}/fetch-featured-properties-on-demand-rent`),
//         axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users-on-demand-rent`)
//       ]);

//       // Add isFeatured flag to featured properties
//       const featuredProperties = featuredRes.data.properties.map((property) => ({
//         ...property,
//         isFeatured: true,
//       }));

//       const featuredrentIds = new Set(featuredProperties.map((p) => p.rentId));

//       // Filter out duplicates and mark remaining as non-featured
//       const activeProperties = activeRes.data.users
//         .filter((property) => !featuredrentIds.has(property.rentId))
//         .map((property) => ({
//           ...property,
//           isFeatured: false,
//         }));

//       const allProperties = [...featuredProperties, ...activeProperties].sort((a, b) => {
//         const aDate = new Date(a.updatedAt || a.createdAt);
//         const bDate = new Date(b.updatedAt || b.createdAt);
//         return bDate - aDate; // Newest first
//       });

//       setProperties(allProperties);
//     } catch (error) {
//       console.error("Error fetching property data:", error);
//       // setError("Failed to load property data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // fetchAllProperties();
// }, []);


useEffect(() => {
  const fetchAllProperties = async () => {
    try {
      const [featuredRes, activeRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/fetch-featured-properties-on-demand-rent`),
        axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users-on-demand-rent`)
      ]);

      const featuredProperties = featuredRes.data.properties.map((property) => ({
        ...property,
        isFeatured: true,
      }));

      const featuredrentIds = new Set(featuredProperties.map((p) => p.rentId));

      const activeProperties = activeRes.data.users
        .filter((property) => !featuredrentIds.has(property.rentId))
        .map((property) => ({
          ...property,
          isFeatured: false,
        }));

      const allProperties = [...featuredProperties, ...activeProperties].sort((a, b) => {
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);
        return bDate - aDate; // Newest first
      });

      setProperties(allProperties);
    } catch (error) {
      console.error("Error fetching property data:", error);
      // Optionally set error state here
    }
  };

  const fetchUploadedImages = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-uploadimages-ads`);
      const sortedUploads = res.data.data.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      setUploads(sortedUploads);
    } catch (err) {
      console.error('Failed to fetch uploaded images:', err);
      // setError('Failed to fetch uploaded images');
    } finally {
      setLoading(false); // You may want to handle loading for both separately
    }
  };

  // Fetch both
  setLoading(true);
  fetchAllProperties().finally(() => {
    fetchUploadedImages(); // Chained to ensure loading ends after both
  });
}, []);

// useEffect(() => {
//   const fetchAllProperties = async () => {
//     setLoading(true);
//     try {
//       const [featuredRes, activeRes] = await Promise.all([
//         axios.get(`${process.env.REACT_APP_API_URL}/fetch-featured-properties`),
//         axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users`),
//       ]);

//       const featuredProperties = featuredRes.data.properties.map((property) => ({
//         ...property,
//         isFeatured: true,
//       }));

//       const featuredrentIds = new Set(featuredProperties.map((p) => p.rentId));

//       const activeProperties = activeRes.data.users
//         .filter((property) => !featuredrentIds.has(property.rentId))
//         .map((property) => ({
//           ...property,
//           isFeatured: false,
//         }));

//       // Combine both arrays
//       const allProperties = [...featuredProperties, ...activeProperties];

//       // Sort by latest between createdAt and updatedAt
//       allProperties.sort((a, b) => {
//         const dateA = new Date(a.updatedAt || a.createdAt);
//         const dateB = new Date(b.updatedAt || b.createdAt);
//         return dateB - dateA; // Descending order
//       });

//       setProperties(allProperties);
//     } catch (error) {
//       console.error("Failed to fetch properties:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchAllProperties();
// }, []);



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

  // Handle advanced filter area input change with suggestions
  const handleAdvancedAreaInputChange = (e) => {
    const value = e.target.value;
    setAdvancedFilters(prev => ({ ...prev, area: value }));

    if (value.length > 0) {
      const areaNames = Object.keys(areaPincodeMap);
      const filtered = areaNames.filter(area =>
        area.toLowerCase().includes(value.toLowerCase())
      );
      setAreaSuggestions(filtered);
      setShowAreaSuggestions(filtered.length > 0);
    } else {
      setAreaSuggestions([]);
      setShowAreaSuggestions(false);
    }
  };

  // Handle advanced filter area selection from suggestions
  const handleAdvancedAreaSelect = (selectedArea) => {
    const pincode = areaPincodeMap[selectedArea] || "";
    setAdvancedFilters(prev => ({
      ...prev,
      area: selectedArea,
      pinCode: pincode
    }));
    setShowAreaSuggestions(false);
    setAreaSuggestions([]);
  };

const fieldLabels = {
  propertyMode: "Property Mode",
  propertyType: "Property Type",
    rentType: "rent Type",
  rentalAmount: "rental Amount",
              minPrice: "min Rental Amount",
 maxPrice: "max Rental Amount",
  propertyAge: "Property Age",
  bankLoan: "Bank Loan",
  negotiation: "Negotiation",
    securityDeposit: "security Deposit",
  length: "Length",
  breadth: "Breadth",
  totalArea: "Total Area",
  ownership: "Ownership",
  bedrooms: "Bedrooms",
  kitchen: "Kitchen",
    kitchen: "Kitchen",
  availableDate: "available Date",
  familyMembers: "family Members",
  foodHabit: "food Habit",
  jobType: "job Type",
  petAllowed: "pet Allowed",
    wheelChairAvailable:"wheel Chair Available",

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
  rentalPropertyAddress: "Property Address",
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
            className="dropdown-popup"
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
            }}
          >
                      <div
          style={{
            fontWeight: "bold",
            fontSize: "16px",
            marginBottom: "10px",
            textAlign: "start",
            color: "#019988",
          }}
        >
           {fieldLabels[field] || "Property Field"}
        </div>
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
  // marginBottom: '10px',
  background:"#C0DFDA",
  border:"none",
  outline:"none"                }}
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
      color:"#26794A",
      marginBottom: '5px',
    }}
  >
    {option}
  </li>
))}

            </ul>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px', 
              marginTop: '15px' 
            }}>
              {/* CLEAR and SEARCH buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    setFilters({ id: '', minPrice: '', maxPrice: '', propertyMode: '', city: '', propertyType: '', rentType: '', bedrooms: '', floorNo: '', state: '' });
                    setAdvancedFilters({ propertyMode: '', propertyType: '', minPrice: '', maxPrice: '', propertyAge: '', bankLoan: '', negotiation: '', length: '', breadth: '', totalArea: '', minTotalArea: '', ownership: '', bedrooms: '', minBedrooms: '', kitchen: '', kitchenType: '', balconies: '', floorNo: '', areaUnit: '', propertyApproved: '', facing: '', postedBy: '', furnished: '', lift: '', attachedBathrooms: '', minAttachedBathrooms: '', western: '', minWestern: '', rentType: '', carParking: '', area: '', nagar: '', streetName: '', pinCode: '', phoneNumber: '', state: '' });
                    toggleDropdown(field);
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '2px solid #d32f2f',
                    backgroundColor: '#fff',
                    color: '#d32f2f',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  CLEAR
                </button>
                <button
                  onClick={() => toggleDropdown(field)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '2px solid #4caf50',
                    backgroundColor: '#fff',
                    color: '#4caf50',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  SEARCH
                </button>
              </div>

              {/* GO TO ADVANCED SEARCH button */}
              <button
                onClick={() => {
                  toggleDropdown(field);
                  setIsAdvancedPopupOpen(true);
                }}
                style={{
                  padding: '10px',
                  border: '2px solid #666',
                  backgroundColor: '#fff',
                  color: '#666',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                GO TO ADVANCED SEARCH
              </button>

              {/* HOME button */}
              <button
                onClick={() => {
                  toggleDropdown(field);
                  navigate(baseToPath(getActiveBase()));
                }}
                style={{
                  padding: '10px',
                  border: '2px solid #666',
                  backgroundColor: '#fff',
                  color: '#666',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                HOME
              </button>
            </div>
          </div>
        )
      );
    };

 

 
  const filteredProperties = properties.filter((property) => { 
    // Rent ID filter
    const idMatch = filters.id 
      ? property.rentId?.toString().includes(filters.id) 
      : true;

    // Property Mode filter - exact match
    const propertyModeMatch = filters.propertyMode 
      ? property.propertyMode?.toLowerCase() === filters.propertyMode.toLowerCase() 
      : true;

    // Property Type filter - exact match
    const propertyTypeMatch = filters.propertyType 
      ? property.propertyType?.toLowerCase() === filters.propertyType.toLowerCase() 
      : true;

    // Rent Type filter - exact match
    const rentTypeMatch = filters.rentType 
      ? property.rentType?.toLowerCase() === filters.rentType.toLowerCase() 
      : true;

    // Bedrooms filter - exact match (not includes)
    const bedroomsMatch = filters.bedrooms 
      ? property.bedrooms?.toString().toLowerCase() === filters.bedrooms.toLowerCase() 
      : true;

    // Floor Number filter - exact match (not includes)
    const floorNoMatch = filters.floorNo 
      ? property.floorNo?.toString().toLowerCase() === filters.floorNo.toLowerCase() 
      : true;

    // Nagar filter - exact match
    const nagarMatch = filters.nagar 
      ? property.nagar?.toLowerCase() === filters.nagar.toLowerCase() 
      : true;

    // Street Name filter - partial match (includes)
    const streetNameMatch = filters.streetName 
      ? property.streetName?.toLowerCase().includes(filters.streetName.toLowerCase()) 
      : true;

    // State filter - exact match
    const stateMatch = filters.state 
      ? property.state?.toLowerCase() === filters.state.toLowerCase() 
      : true;

    // Area filter - exact match
    const areaMatch = filters.area 
      ? property.area?.toLowerCase() === filters.area.toLowerCase() 
      : true;

    // Pincode filter - exact match
    const pincodeMatch = filters.pinCode 
      ? property.pinCode?.toString() === filters.pinCode?.toString() 
      : true;

    // Price range filter
    const priceMatch = 
      (filters.minPrice ? property.rentalAmount >= Number(filters.minPrice) : true) &&
      (filters.maxPrice ? property.rentalAmount <= Number(filters.maxPrice) : true);

    // Advanced filters
    const advancedFilterMatch = Object.keys(advancedFilters).every((key) => {
      if (!advancedFilters[key]) return true;
  
      if (key === "minPrice") {
        return property.rentalAmount >= Number(advancedFilters[key]);
      }
      if (key === "maxPrice") {
        return property.rentalAmount <= Number(advancedFilters[key]);
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
  
      // Default behavior for other fields (exact string matching)
      return property[key]?.toString()?.toLowerCase() === advancedFilters[key]?.toString()?.toLowerCase();
    });

    // Combine all filters with AND logic
    return idMatch && propertyModeMatch && propertyTypeMatch && rentTypeMatch && 
           bedroomsMatch && floorNoMatch && nagarMatch && streetNameMatch && 
           stateMatch && areaMatch && pincodeMatch && priceMatch && advancedFilterMatch;
  });
  
  // Show no data modal when results are empty and filters are applied after search
  useEffect(() => {
    const hasActiveFilters = Object.values(filters).some(val => val !== '') || 
                             Object.values(advancedFilters).some(val => val !== '');
    
    // Only show modal if user has performed a search and no results found
    if (searchPerformed && filteredProperties.length === 0 && hasActiveFilters) {
      setShowNoDataModal(true);
    } else {
      setShowNoDataModal(false);
    }
  }, [filteredProperties, filters, advancedFilters, searchPerformed]);
  
  useEffect(() => {
    const backdrop = document.querySelector('.modal-backdrop');
    if (isFilterPopupOpen && backdrop) {
      backdrop.style.pointerEvents = 'none';
    }
  }, [isFilterPopupOpen]);

  // Check if area or pincode search returned no results
  // Using new NoPropertyPopup component for this functionality now
  // useEffect(() => {
  //   if ((filters.area || filters.pinCode) && filteredProperties.length === 0 && properties.length > 0) {
  //     setShowNoSearchResultsModal(true);
  //     // Show modal with Bootstrap
  //     const modalElement = document.getElementById('noSearchResultsModal');
  //     if (modalElement && window.bootstrap) {
  //       const modal = new window.bootstrap.Modal(modalElement);
  //       modal.show();
  //     }
  //   }
  // }, [filteredProperties, filters.area, filters.pinCode, properties.length]);
  
  

useEffect(() => {
  const stored = JSON.parse(localStorage.getItem('clickedCar')) || [];
  setClickedCar(stored);
}, []);

// Close horizontal filter dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (e) => {
    // Check if click is outside the filter dropdown
    const filterSection = document.querySelector('[data-filter-section]');
    if (filterSection && !filterSection.contains(e.target)) {
      setOpenFilterDropdown(null);
    }
  };

  if (openFilterDropdown) {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }
}, [openFilterDropdown]);

const sendPropertyViewWhatsApp = async (property, viewerPhone) => {
  try {
    const ownerPhone = property.phoneNumber || "";
    const cleanOwnerPhone = String(ownerPhone).replace(/\D/g, "");
    const toOwner = cleanOwnerPhone.length === 10 ? `91${cleanOwnerPhone}` : cleanOwnerPhone;

    const cleanViewerPhone = String(viewerPhone).replace(/\D/g, "");
    const toViewer = cleanViewerPhone.length === 10 ? `91${cleanViewerPhone}` : cleanViewerPhone;

    // Message to User (queued - low priority, property view is highest volume action)
    if (toViewer.length >= 12) {
      await axios.post(`${process.env.REACT_APP_API_URL}/queue-message`, {
        to: toViewer,
        category: "property-view-user",
        data: {
          rentId: property.rentId,
          location: property.area || property.city,
          ownerName: property.ownerName || "Owner",
          ownerPhone: ownerPhone,
        },
      });
      console.log("✅ WhatsApp message queued for viewer:", toViewer);
    }

    // Message to Owner (queued - low priority)
    if (toOwner.length >= 12) {
      await axios.post(`${process.env.REACT_APP_API_URL}/queue-message`, {
        to: toOwner,
        category: "property-view-owner",
        data: {
          rentId: property.rentId,
          location: property.area || property.city,
          ownerName: property.ownerName || "Owner",
          viewerPhone: viewerPhone,
          propertyType: property.propertyType,
        },
      });
      console.log("✅ WhatsApp message queued for owner:", toOwner);
    }
  } catch (whatsErr) {
    console.log("⚠️ WhatsApp message failed (non-blocking):", whatsErr.message);
  }
};

const handleCardClick = (rentId, ownerPhoneNumber, property) => {
  const stored = JSON.parse(localStorage.getItem('clickedCar')) || [];
  if (!stored.includes(rentId)) {
    stored.push(rentId);
    localStorage.setItem('clickedCar', JSON.stringify(stored));
  }
  
  // Send WhatsApp messages
  if (phoneNumber && property) {
    sendPropertyViewWhatsApp(property, phoneNumber);
  }
  
  navigate(`/detail/${rentId}`, { state: { phoneNumber } });
};
const totalUploads = useMemo(() => {
  return uploads.flatMap(upload =>
    (upload.images || []).map(img => ({
      _id: upload._id,
      img,
      type: 'upload'
    }))
  );
}, [uploads]);

useEffect(() => {
  const merged = [];
  let propertyCounter = 0;
  let uploadIndex = 0;

  // If both sources are empty, set mergedData to empty array
  if (!filteredProperties?.length && !totalUploads?.length) {
    setMergedData([]);
    return;
  }

  for (let i = 0; i < filteredProperties.length; i++) {
    merged.push({ ...filteredProperties[i], type: 'property' });
    propertyCounter++;

    // Insert ad after every 8 properties and keep repeating (cycle through ads)
    if (propertyCounter === 8 && totalUploads.length > 0) {
      merged.push(totalUploads[uploadIndex % totalUploads.length]); // Use modulo to cycle through ads
      uploadIndex++;
      propertyCounter = 0; // Reset counter to repeat the pattern
    }
  }

  // Handle case where no filteredProperties, just uploads
  if (filteredProperties.length === 0) {
    merged.push(...totalUploads);
  }

  // Only update state if data actually changed
  setMergedData(prev => {
    const isSame = JSON.stringify(prev) === JSON.stringify(merged);
    return isSame ? prev : merged;
  });

}, [filteredProperties, totalUploads]);

    // navigate("/detail", { state: { phoneNumber } });
  // const formattedPrice = new Intl.NumberFormat('en-IN').format(property.price); // Indian-style number format
  
  // Handle BACK button in No Property popup - resets filters
  const handleNoPropertyBack = () => {
    setFilters(prev => ({ ...prev, area: '', pinCode: '' }));
    setNavbarSearchValue('');
  };

  // Keep the marquee live: fetch the full approved-properties set from the
  // same endpoint the admin Search Pincode page uses, then build a
  // pincode → count map. Re-fetches every 30s and whenever the tab regains
  // focus so newly added properties show up without a hard refresh. The
  // page's own `properties` array uses `/fetch-active-users-on-demand-rent`,
  // which may not include every approved record, so it was undercounting
  // some pincodes (e.g. 605104 Kottakuppam) in the marquee.
  useEffect(() => {
    let cancelled = false;

    const fetchMarqueeCounts = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-active-users-datas-all-rent`,
          // Bypass any HTTP / browser cache so the ticker always reflects
          // the latest count.
          { headers: { 'Cache-Control': 'no-cache' }, params: { _t: Date.now() } }
        );
        if (cancelled) return;
        const list = res.data?.users || [];
        const counts = {};
        list.forEach((property) => {
          if (property.isDeleted) return;
          const pinCode =
            property.pinCode ||
            property.pincode ||
            property.postalCode ||
            property.zipCode ||
            property.propertyPincode ||
            (property.address && property.address.pincode) ||
            (property.address && property.address.pinCode);
          if (!pinCode) return;
          const pinStr = String(pinCode).trim();
          counts[pinStr] = (counts[pinStr] || 0) + 1;
        });
        setMarqueePincodeCounts(counts);
        // Also keep the raw (non-deleted) list so the property-card popup
        // can filter by pincode without hitting the API again.
        setMarqueePropertyList(list.filter((p) => !p.isDeleted));
      } catch (err) {
        console.error('Marquee pincode count fetch failed:', err);
      }
    };

    fetchMarqueeCounts();
    const intervalId = setInterval(fetchMarqueeCounts, 30000);
    const onFocus = () => fetchMarqueeCounts();
    window.addEventListener('focus', onFocus);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  // Area-wise approved-property counts (by pincode) used by the marquee ticker.
  // For Pondicherry: same pincode → area mapping as the admin SearchPincode
  // page, with the combined cards (605001+605002, 605006+605009).
  // For Chennai: aggregate counts by direction (Central / North / South /
  // West) so the marquee mirrors the 4 direction cards from the admin's
  // /search-pincode-chennai page.
  const areaPropertySummary = useMemo(() => {
    const activeBase = getActiveBase();

    if (activeBase === 'CH') {
      const pincodeToDirection = {};
      chennaiPincodeRows.forEach((row) => {
        if (!(row.pincode in pincodeToDirection)) {
          pincodeToDirection[row.pincode] = row.direction;
        }
      });

      const directionTotals = {};
      const directionCodes = {};
      CHENNAI_DIRECTIONS.forEach((d) => {
        directionTotals[d] = 0;
        directionCodes[d] = [];
      });
      Object.entries(marqueePincodeCounts).forEach(([code, count]) => {
        const dir = pincodeToDirection[code];
        if (dir) {
          directionTotals[dir] += count;
          directionCodes[dir].push(code);
        }
      });

      // Always show all four direction boxes, even when a direction has
      // zero properties, so the 2x2 grid stays stable for CH users. The
      // drill-down modal handles the empty case gracefully.
      const cards = CHENNAI_DIRECTIONS.map((d) => ({
        pincode: d,
        area: d,
        count: directionTotals[d],
        codes: directionCodes[d],
      }));

      const total = cards.reduce((sum, e) => sum + e.count, 0);
      return { cards, total };
    }

    const pincodeToAreaName = {
      '605001': 'White Town',
      '605002': 'Pondicherry',
      '605003': 'Muthialpet',
      '605004': 'Mudaliarpet',
      '605005': 'Nellithope',
      '605006': 'Gorimedu',
      '605007': 'Ariyankuppam',
      '605008': 'Lawspet',
      '605009': 'Kadirkamam',
      '605010': 'Moolakulam',
      '605011': 'Rainbow Nagar',
      '605013': 'Saram',
      '605104': 'Kottakuppam',
      '605110': 'Villanur',
    };

    // Same combined cards the admin Search Pincode page uses.
    const combinedPairs = [
      { codes: ['605001', '605002'], label: 'White Town & Pondicherry' },
      { codes: ['605006', '605009'], label: 'Gorimedu & Kadirkamam' },
    ];
    const combinedSubPincodes = new Set(
      combinedPairs.flatMap((p) => p.codes)
    );

    const entries = [];
    combinedPairs.forEach(({ codes, label }) => {
      const total = codes.reduce(
        (sum, c) => sum + (marqueePincodeCounts[c] || 0),
        0
      );
      if (total > 0) entries.push({ pincode: codes.join(' & '), area: label, count: total, codes });
    });
    Object.entries(pincodeToAreaName).forEach(([code, name]) => {
      if (combinedSubPincodes.has(code)) return;
      const count = marqueePincodeCounts[code] || 0;
      if (count > 0) entries.push({ pincode: code, area: name, count, codes: [code] });
    });

    const cards = entries.sort((a, b) => b.count - a.count);
    const total = cards.reduce((sum, e) => sum + e.count, 0);

    return { cards, total };
  }, [marqueePincodeCounts]);

  // Pincode counts for the tenant-assistance ticker. Pulled from the same
  // endpoint the admin Active Buyer Assistance page uses.
  useEffect(() => {
    let cancelled = false;

    const fetchTenantAssistanceCounts = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/raActive-buyerAssistance-all-plans-rent`,
          { headers: { 'Cache-Control': 'no-cache' }, params: { _t: Date.now() } }
        );
        if (cancelled) return;
        const list = (res.data?.data || []).filter((item) => !item.isDeleted);
        const counts = {};
        list.forEach((item) => {
          const pinCode =
            item.pinCode ||
            item.pincode ||
            item.postalCode ||
            item.zipCode ||
            (item.address && item.address.pincode) ||
            (item.address && item.address.pinCode);
          if (!pinCode) return;
          const pinStr = String(pinCode).trim();
          counts[pinStr] = (counts[pinStr] || 0) + 1;
        });
        setTenantAssistanceCounts(counts);
        setTenantAssistanceList(list);
      } catch (err) {
        console.error('Tenant-assistance count fetch failed:', err);
      }
    };

    fetchTenantAssistanceCounts();
    const intervalId = setInterval(fetchTenantAssistanceCounts, 30000);
    const onFocus = () => fetchTenantAssistanceCounts();
    window.addEventListener('focus', onFocus);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  // Area-wise active tenant-assistance counts, mapped/combined the same way
  // as areaPropertySummary so both tickers stay consistent.
  const tenantAssistanceSummary = useMemo(() => {
    const pincodeToAreaName = {
      '605001': 'White Town',
      '605002': 'Pondicherry',
      '605003': 'Muthialpet',
      '605004': 'Mudaliarpet',
      '605005': 'Nellithope',
      '605006': 'Gorimedu',
      '605007': 'Ariyankuppam',
      '605008': 'Lawspet',
      '605009': 'Kadirkamam',
      '605010': 'Moolakulam',
      '605011': 'Rainbow Nagar',
      '605013': 'Saram',
      '605104': 'Kottakuppam',
      '605110': 'Villanur',
    };

    const combinedPairs = [
      { codes: ['605001', '605002'], label: 'White Town & Pondicherry' },
      { codes: ['605006', '605009'], label: 'Gorimedu & Kadirkamam' },
    ];
    const combinedSubPincodes = new Set(
      combinedPairs.flatMap((p) => p.codes)
    );

    const entries = [];
    combinedPairs.forEach(({ codes, label }) => {
      const total = codes.reduce(
        (sum, c) => sum + (tenantAssistanceCounts[c] || 0),
        0
      );
      if (total > 0) entries.push({ pincode: codes.join(' & '), area: label, count: total, codes });
    });
    Object.entries(pincodeToAreaName).forEach(([code, name]) => {
      if (combinedSubPincodes.has(code)) return;
      const count = tenantAssistanceCounts[code] || 0;
      if (count > 0) entries.push({ pincode: code, area: name, count, codes: [code] });
    });

    const cards = entries.sort((a, b) => b.count - a.count);
    const total = cards.reduce((sum, e) => sum + e.count, 0);

    return { cards, total };
  }, [tenantAssistanceCounts]);

  // Load the admin-tunable points cost for revealing a tenant number.
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/points-config-public`)
      .then((res) => {
        const v = Number(res.data?.pointsPerTenantContactReveal);
        if (Number.isFinite(v) && v >= 1) setTenantContactPoints(v);
      })
      .catch(() => {});
  }, []);

  // Reveal a tenant's phone number — charges points first.
  const handleViewTenantContact = async (item) => {
    const contactKey = item._id || item.Ra_Id;
    if (revealedTenantContacts.includes(contactKey)) return;

    const storedPhoneNumber = localStorage.getItem('phoneNumber');
    if (!storedPhoneNumber) {
      navigate('/login');
      return;
    }

    try {
      const balanceRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/points-balance/${storedPhoneNumber}`
      );
      const balance = Number(balanceRes.data?.balance ?? 0);
      if (balance < tenantContactPoints) {
        alert(
          `Not enough points. You need ${tenantContactPoints} points to view this contact (balance: ${balance}).`
        );
        return;
      }

      const deductRes = await axios.post(
        `${process.env.REACT_APP_API_URL}/points-deduct`,
        {
          phoneNumber: storedPhoneNumber,
          points: tenantContactPoints,
          rentId: item.Ra_Id,
          reason: 'view-tenant-contact',
        }
      );

      if (deductRes?.data?.success !== true) {
        alert(deductRes?.data?.message || 'Could not deduct points. Please try again.');
        return;
      }

      setRevealedTenantContacts((prev) => [...prev, contactKey]);
    } catch (err) {
      if (err?.response?.status === 402) {
        alert('Not enough points to view this contact.');
      } else {
        console.error('Tenant contact deduct failed:', err);
        alert('Could not view contact. Please try again.');
      }
    }
  };

  return (
    <Container fluid className="p-0 w-100 d-flex align-items-center justify-content-center ">
      <Helmet>
        <title>Rental Property | Properties</title>
      </Helmet>



      {/* Hidden trigger button for filter popup */}
      <button
        ref={filterPopupTriggerRef}
        data-bs-toggle="modal"
        data-bs-target="#filterPopup"
        style={{ display: 'none' }}
      />
      
      
      <Row className="g-3 w-100 ">
        {/* Horizontal Navbar Search Box — top of page */}
        <Col lg={12} className="p-0 m-0">
          <div style={{
            width: '100%',
            padding: '0 2px',
            background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
            borderBottom: 'none',
            position: 'relative'
          }}>
            <div style={{
              maxWidth: '560px',
              margin: '0 auto',
              position: 'relative'
            }}>
              {/* Modern Pill-Shaped Search Bar Container */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f2ff 100%)',
                  borderRadius: '40px',
                  boxShadow: '0 4px 16px rgba(79, 75, 126, 0.10)',
                  overflow: 'hidden',
                  border: '1.5px solid #e0e5ff',
                  cursor: 'text',
                  padding: '4px 10px'
                }}
              >
                {/* Search Icon Left */}
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px 8px',
                    color: '#4F4B7E',
                    transition: 'all 0.3s ease',
                    fontSize: '16px'
                  }}
                >
                  <BiSearchAlt size={16} />
                </span>

                {/* Search Input with Clear Button */}
                <div style={{ flex: '1', position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    ref={navbarSearchInputRef}
                    type="text"
                    value={navbarSearchValue}
                    onChange={handleNavbarSearchChange}
                    onKeyDown={handleNavbarKeyDown}
                    onFocus={() => {
                      if (navbarSearchValue && navbarAreaSuggestions.length > 0) {
                        setShowNavbarAreaSuggestions(true);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowNavbarAreaSuggestions(false), 200);
                    }}
                    placeholder="Enter Area Name or Pincode"
                    aria-label="Search properties by area or pincode"
                    className="rent-pondy-search-input"
                    style={{
                      flex: '1',
                      padding: '6px 8px',
                      paddingRight: navbarSearchValue ? '30px' : '8px',
                      fontSize: '13px',
                      border: 'none',
                      outline: 'none',
                      boxShadow: 'none',
                      color: '#111111',
                      background: 'transparent',
                      backgroundColor: 'transparent',
                      fontWeight: '500',
                      letterSpacing: '0.3px',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      appearance: 'none',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  />
                  <style>{`
                    .rent-pondy-search-input,
                    .rent-pondy-search-input:hover,
                    .rent-pondy-search-input:focus,
                    .rent-pondy-search-input:active,
                    .rent-pondy-search-input:focus-visible {
                      outline: none !important;
                      box-shadow: none !important;
                      border: none !important;
                      background: transparent !important;
                      background-color: transparent !important;
                    }
                    .rent-pondy-search-input:-webkit-autofill,
                    .rent-pondy-search-input:-webkit-autofill:hover,
                    .rent-pondy-search-input:-webkit-autofill:focus {
                      -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
                      -webkit-text-fill-color: #111111 !important;
                      transition: background-color 9999s ease-in-out 0s;
                    }
                  `}</style>
                  {/* Clear Button */}
                  {navbarSearchValue && (
                    <button
                      onClick={handleClearSearch}
                      onMouseDown={(e) => e.preventDefault()}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        color: '#a8a8d8',
                        fontSize: '18px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        fontWeight: 'bold'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#4F4B7E';
                        e.currentTarget.style.transform = 'scale(1.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#a8a8d8';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter Funnel Button */}
                <button
                  onClick={() => setShowFilterPanel((v) => !v)}
                  aria-label="Toggle filters"
                  title="Filters"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '4px',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    background: showFilterPanel
                      ? 'linear-gradient(135deg, #4F4B7E, #6C66A8)'
                      : 'linear-gradient(135deg, #eef0ff, #ffffff)',
                    color: showFilterPanel ? '#fff' : '#4F4B7E',
                    boxShadow: showFilterPanel
                      ? '0 2px 8px rgba(79,75,126,0.35)'
                      : '0 1px 4px rgba(79,75,126,0.18)',
                    transition: 'all 0.2s ease',
                    flex: '0 0 auto',
                  }}
                >
                  <BiFilterAlt size={15} />
                </button>
              </div>

              {/* Modern Suggestions Dropdown */}
              {showNavbarAreaSuggestions && navbarAreaSuggestions.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    right: '0',
                    background: '#ffffff',
                    border: '1.5px solid #e8e8ff',
                    borderTop: 'none',
                    borderRadius: '0 0 20px 20px',
                    maxHeight: '320px',
                    overflowY: 'auto',
                    zIndex: 1001,
                    boxShadow: '0 8px 24px rgba(79, 75, 126, 0.12)',
                    marginTop: '-1px',
                    animation: 'slideDown 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                  }}
                >
                  {navbarAreaSuggestions.map((area, index) => (
                    <div
                      key={index}
                      onMouseDown={() => handleNavbarAreaSelect(area)}
                      onMouseEnter={(e) => {
                        setNavbarKeyboardIndex(index);
                        e.currentTarget.style.background = '#f8f9ff';
                        e.currentTarget.style.paddingLeft = '28px';
                      }}
                      style={{
                        padding: '12px 20px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        borderBottom: index !== navbarAreaSuggestions.length - 1 ? '1px solid #f0f0f5' : 'none',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'baseline',
                        gap: '8px',
                        background: navbarKeyboardIndex === index ? '#f8f9ff' : 'transparent',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = navbarKeyboardIndex === index ? '#f8f9ff' : 'transparent';
                        e.currentTarget.style.paddingLeft = '20px';
                      }}
                    >
                      <span style={{ color: '#333', fontWeight: 500, fontSize: '13px', letterSpacing: '0.1px' }}>{area}</span>
                      <span style={{ color: '#333', fontSize: '12px', fontWeight: 500 }}>– {areaPincodeMap[area]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Col>

        {/* Exclusive Stays running-text banner — sits above "Total Rent
            Property Available" and taps through to the stays page. */}
        <Col lg={12} className="p-0 m-0">
          <div
            onClick={() => navigate('/exclusive-location')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/exclusive-location');
              }
            }}
            title="Tap to explore exclusive places to stay"
            style={{
              cursor: 'pointer',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              background: 'linear-gradient(90deg, #FF7043 0%, #FF9800 100%)',
              borderRadius: '10px',
              margin: '4px 4px 10px',
              padding: '9px 0',
              boxShadow: '0 2px 8px rgba(255, 112, 67, 0.35)',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 'max-content',
                animation: 'exclusiveStayMarquee 18s linear infinite',
              }}
            >
              {[0, 1].map((i) => (
                <span
                  key={i}
                  style={{
                    paddingRight: '48px',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '14px',
                    letterSpacing: '0.3px',
                  }}
                >
                  ✨ Exclusive Place to Stay — Resorts · Hotels · Guest Houses&nbsp;&nbsp;·&nbsp;&nbsp;Tap to explore →
                </span>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes exclusiveStayMarquee {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
          `}</style>
        </Col>

        {/* Rent Property Cards — Chennai gets fixed 4 direction cards
            (Central/North/South/West) with a drill-down to areas; other
            cities keep the horizontal scrolling marquee. */}
        {areaPropertySummary.cards.length > 0 && (
        <Col lg={12} className="p-0 m-0">
          <div style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#203a43',
            padding: '0 4px 4px',
          }}>
            🏠 Total Rent Property Available ({areaPropertySummary.total})
          </div>
          <div
            style={{
              background: 'linear-gradient(135deg, #e6f0f5 0%, #ffffff 100%)',
              borderRadius: '10px',
              padding: '8px',
            }}
          >
            {getActiveBase() === 'CH' ? (
              // Static single-row layout of all four direction cards. No
              // marquee — fixed positions so users can tap a direction
              // without chasing a scroller.
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '6px',
                }}
              >
                {areaPropertySummary.cards.map((card) => (
                  <div
                    key={`ch-dir-${card.area}`}
                    onClick={() => openChennaiDirection(card.area)}
                    style={{
                      padding: '8px 4px',
                      textAlign: 'center',
                      background: '#ffffff',
                      border: '1.5px solid #203a43',
                      borderRadius: '10px',
                      boxShadow: '0 2px 8px rgba(32,58,67,0.18)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#203a43', marginBottom: '4px' }}>
                      {card.area} Chennai
                    </div>
                    <div style={{
                      background: '#e6f0f5',
                      borderRadius: '6px',
                      padding: '4px 2px',
                    }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#203a43', lineHeight: 1 }}>
                        {card.count}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#000', marginTop: '2px', fontWeight: 700 }}>
                        {card.count === 1 ? 'Property' : 'Properties'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ overflow: 'hidden', width: '100%' }}>
                {/* Cards rendered twice so the -50% translate loops seamlessly
                    (no empty gap when the scroll restarts). */}
                <div
                  style={{
                    display: 'flex',
                    width: 'max-content',
                    animation: `propertyCardScroll ${Math.max(areaPropertySummary.cards.length * 6, 24)}s linear infinite`,
                  }}
                >
                {[...areaPropertySummary.cards, ...areaPropertySummary.cards].map((card, idx) => (
                  <div
                    key={`${card.pincode}-${idx}`}
                    onClick={() => openPropertyCard(card)}
                    style={{
                      flex: '0 0 auto',
                      verticalAlign: 'top',
                      width: '88px',
                      margin: '0 4px',
                      padding: '5px 4px',
                      textAlign: 'center',
                      background: '#ffffff',
                      border: '1.5px solid #203a43',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(32,58,67,0.2)',
                      whiteSpace: 'normal',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#203a43', marginBottom: '3px', minHeight: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {card.area}
                    </div>
                    <div style={{
                      background: '#e6f0f5',
                      borderRadius: '5px',
                      padding: '3px 2px',
                    }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#203a43', lineHeight: 1 }}>
                        {card.count}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#000', marginTop: '1px', fontWeight: 700 }}>
                        {card.count === 1 ? 'Property' : 'Properties'}
                      </div>
                    </div>
                  </div>
                ))}
                </div>
                <style>{`
                  @keyframes propertyCardScroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                  }
                `}</style>
              </div>
            )}
          </div>
        </Col>
        )}

        {/* Tenant Assistance Scrolling Cards */}
        {tenantAssistanceSummary.cards.length > 0 && (
        <Col lg={12} className="p-0 m-0">
          <div style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#11998e',
            padding: '0 4px 4px',
          }}>
            🤝 Total Tenants Available ({tenantAssistanceSummary.total})
          </div>
          <div
            style={{
              background: 'linear-gradient(135deg, #eafff4 0%, #ffffff 100%)',
              borderRadius: '10px',
              padding: '8px 0',
            }}
          >
            <div style={{ overflow: 'hidden', width: '100%' }}>
              {/* Cards rendered twice so the -50% translate loops seamlessly
                  (no empty gap when the scroll restarts). */}
              <div
                style={{
                  display: 'flex',
                  width: 'max-content',
                  animation: `tenantCardScroll ${Math.max(tenantAssistanceSummary.cards.length * 6, 24)}s linear infinite`,
                }}
              >
              {[...tenantAssistanceSummary.cards, ...tenantAssistanceSummary.cards].map((card, idx) => (
                <div
                  key={`${card.pincode}-${idx}`}
                  onClick={() => openTenantCard(card)}
                  style={{
                    flex: '0 0 auto',
                    verticalAlign: 'top',
                    width: '88px',
                    margin: '0 4px',
                    padding: '5px 4px',
                    textAlign: 'center',
                    background: '#ffffff',
                    border: '1.5px solid #11998e',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(17,153,142,0.2)',
                    whiteSpace: 'normal',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#11998e', marginBottom: '3px', minHeight: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {card.area}
                  </div>
                  <div style={{
                    background: '#eafff4',
                    borderRadius: '5px',
                    padding: '3px 2px',
                  }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#11998e', lineHeight: 1 }}>
                      {card.count}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#000', marginTop: '1px', fontWeight: 700 }}>
                      {card.count === 1 ? 'Tenant' : 'Tenants'}
                    </div>
                  </div>
                </div>
              ))}
              </div>
              <style>{`
                @keyframes tenantCardScroll {
                  from { transform: translateX(0); }
                  to { transform: translateX(-50%); }
                }
              `}</style>
            </div>
          </div>
        </Col>
        )}

        {/* Chennai area picker — opens after tapping a direction card.
            Lists every area in that direction (one row per area, even when
            the underlying pincode has no properties yet), with the count
            shown on the right. Tapping a row hands off to the existing
            property-list modal below, filtered by the area's pincode. */}
        {selectedChennaiDirection && !selectedPropertyCard && (() => {
          const rows = chennaiPincodeRows
            .filter((row) => row.direction === selectedChennaiDirection)
            .map((row) => ({
              area: row.area,
              pincode: row.pincode,
              count: marqueePincodeCounts[row.pincode] || 0,
            }))
            .sort((a, b) => a.area.localeCompare(b.area));

          return (
            <div
              onClick={() => closeChennaiDirection()}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: '420px',
                  maxHeight: '80vh',
                  background: '#ffffff',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{
                  background: 'linear-gradient(135deg, #0f2027, #2c5364)',
                  color: '#fff',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 800 }}>
                      📍 {selectedChennaiDirection} Chennai
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>
                      {rows.length} {rows.length === 1 ? 'area' : 'areas'}
                    </div>
                  </div>
                  <span
                    onClick={() => closeChennaiDirection()}
                    style={{ fontSize: '22px', cursor: 'pointer', lineHeight: 1, fontWeight: 700 }}
                  >
                    ✕
                  </span>
                </div>

                <div style={{ overflowY: 'auto', padding: '8px 12px' }}>
                  {rows.length === 0 ? (
                    <div style={{ padding: '24px 8px', textAlign: 'center', color: '#666' }}>
                      No areas in {selectedChennaiDirection} Chennai.
                    </div>
                  ) : (
                    rows.map(({ area, pincode, count }, idx) => (
                      <div
                        key={`${area}-${pincode}-${idx}`}
                        onClick={() => {
                          if (count === 0) return;
                          // Don't clear the direction — keep it set so the
                          // browser back button can return the user to the
                          // area picker after closing the property modal.
                          openPropertyCard({
                            pincode,
                            area,
                            count,
                            codes: [pincode],
                          });
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          marginBottom: '8px',
                          borderRadius: '10px',
                          border: '1px solid #d9e2e6',
                          background: count > 0 ? '#f8fbfc' : '#f3f3f3',
                          cursor: count > 0 ? 'pointer' : 'default',
                          opacity: count > 0 ? 1 : 0.6,
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#203a43', whiteSpace: 'normal' }}>
                            {area}
                          </div>
                          <div style={{ fontSize: '11px', color: '#5b7a85', marginTop: '2px' }}>
                            {pincode}
                          </div>
                        </div>
                        <div style={{
                          marginLeft: '10px',
                          background: count > 0 ? '#203a43' : '#9aa9af',
                          color: '#fff',
                          borderRadius: '999px',
                          padding: '2px 10px',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}>
                          {count}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Property Brief Popup — opens when user taps a property card.
            Shows a brief per-property summary (NO contact details) plus a
            "More" button that routes to the full detail page. */}
        {selectedPropertyCard && (() => {
          const recordTs = (item) => {
            // Pick whichever date-ish field exists on the record. Higher = newer.
            const candidates = [
              item.createdAt, item.updatedAt, item.created_at, item.updated_at,
              item.addedDate, item.postedDate, item.uploadedDate, item.date,
            ];
            for (const c of candidates) {
              if (!c) continue;
              const t = new Date(c).getTime();
              if (!isNaN(t)) return t;
            }
            // ObjectId fallback: the first 8 hex chars are the creation timestamp.
            const id = String(item._id || '');
            if (/^[a-f0-9]{24}$/i.test(id)) {
              return parseInt(id.slice(0, 8), 16) * 1000;
            }
            return 0;
          };
          const records = marqueePropertyList
            .filter((item) => {
              const pin = String(
                item.pinCode || item.pincode || item.postalCode ||
                item.zipCode || item.propertyPincode ||
                (item.address && (item.address.pincode || item.address.pinCode)) || ''
              ).trim();
              return selectedPropertyCard.codes.includes(pin);
            })
            .sort((a, b) => recordTs(b) - recordTs(a));
          return (
            <div
              onClick={() => closePropertyCard()}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: '420px',
                  maxHeight: '80vh',
                  background: '#ffffff',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                }}
              >
                {/* Header */}
                <div style={{
                  background: 'linear-gradient(135deg, #0f2027, #2c5364)',
                  color: '#fff',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 800 }}>
                      🏠 {selectedPropertyCard.area}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>
                      Pincode {selectedPropertyCard.pincode} • {records.length}{' '}
                      {records.length === 1 ? 'Property' : 'Properties'}
                    </div>
                  </div>
                  <span
                    onClick={() => closePropertyCard()}
                    style={{ fontSize: '22px', cursor: 'pointer', lineHeight: 1, fontWeight: 700 }}
                  >
                    ✕
                  </span>
                </div>

                {/* Body */}
                <div style={{ overflowY: 'auto', padding: '12px' }}>
                  {records.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                      No properties found.
                    </div>
                  ) : (
                    records.map((item, idx) => {
                      const rentId = item.rentId || item.Rent_Id || item.Ra_Id || item._id;
                      const propertyMode = item.propertyMode || 'Residential';
                      const propertyType = item.propertyType || item.type || 'Property';
                      const bedrooms = item.bedrooms || item.bhk || item.BHK || null;
                      const totalArea = item.totalArea || item.area || item.builtUpArea || null;
                      const areaUnit = item.areaUnit || (totalArea ? 'Sq.ft' : '');
                      const rent = item.rent || item.price || item.monthlyRent || null;
                      const rentType = item.rentType || (rent ? 'Monthly' : '');
                      const locality = item.area || item.locality || item.localityName || '';
                      const city = item.city || item.cityName || '';
                      const pin = item.pinCode || item.pincode || item.postalCode || '';
                      return (
                        <div
                          key={item._id || rentId || idx}
                          style={{
                            border: '1px solid #d6e0e6',
                            borderRadius: '10px',
                            padding: '10px 12px',
                            marginBottom: '10px',
                            background: '#f8fbfd',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontWeight: 800, color: '#203a43', fontSize: '14px' }}>
                              {propertyMode} • {propertyType}
                            </span>
                            {rentId && (
                              <span style={{ fontSize: '11px', color: '#888' }}>
                                ID {String(rentId).slice(-6)}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '13px', color: '#333', lineHeight: 1.6 }}>
                            <div>📍 {locality || 'N/A'}{city ? `, ${city}` : ''}{pin ? ` - ${pin}` : ''}</div>
                            {bedrooms && <div>🛏️ {bedrooms} BHK</div>}
                            {totalArea && <div>📐 {totalArea} {areaUnit}</div>}
                            {rent && (
                              <div>
                                💰 ₹{Number(rent).toLocaleString('en-IN')}
                                {rentType ? ` / ${rentType}` : ''}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              if (rentId) {
                                setSelectedPropertyCard(null);
                                navigate(`/detail/${rentId}`, { state: { phoneNumber } });
                              }
                            }}
                            disabled={!rentId}
                            style={{
                              marginTop: '8px',
                              background: rentId ? '#203a43' : '#aaa',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '5px 14px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: rentId ? 'pointer' : 'not-allowed',
                            }}
                          >
                            More ▸
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Tenant Assistance Details Popup */}
        {selectedTenantCard && (() => {
          const records = tenantAssistanceList.filter((item) => {
            const pin = String(
              item.pinCode || item.pincode || item.postalCode || item.zipCode || ''
            ).trim();
            return selectedTenantCard.codes.includes(pin);
          });
          return (
            <div
              onClick={() => { setExpandedTenant(null); closeTenantCard(); }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: '420px',
                  maxHeight: '80vh',
                  background: '#ffffff',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                }}
              >
                {/* Header */}
                <div style={{
                  background: 'linear-gradient(135deg, #11998e, #38ef7d)',
                  color: '#fff',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 800 }}>
                      🤝 {selectedTenantCard.area}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>
                      Pincode {selectedTenantCard.pincode} • {records.length}{' '}
                      {records.length === 1 ? 'Tenant' : 'Tenants'}
                    </div>
                  </div>
                  <span
                    onClick={() => { setExpandedTenant(null); closeTenantCard(); }}
                    style={{ fontSize: '22px', cursor: 'pointer', lineHeight: 1, fontWeight: 700 }}
                  >
                    ✕
                  </span>
                </div>

                {/* Body */}
                <div style={{ overflowY: 'auto', padding: '12px' }}>
                  {records.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                      No tenant details found.
                    </div>
                  ) : (
                    records.map((item, idx) => (
                      <div
                        key={item._id || item.Ra_Id || idx}
                        style={{
                          border: '1px solid #e0e5ff',
                          borderRadius: '10px',
                          padding: '10px 12px',
                          marginBottom: '10px',
                          background: '#f8fffb',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 800, color: '#11998e', fontSize: '14px' }}>
                            {item.raName || 'Tenant'}
                          </span>
                          <span style={{ fontSize: '12px', color: '#888' }}>
                            RA #{item.Ra_Id || 'N/A'}
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#333', lineHeight: 1.6 }}>
                          {(() => {
                            const contactKey = item._id || item.Ra_Id;
                            const revealed = revealedTenantContacts.includes(contactKey);
                            return revealed ? (
                              <div>
                                📞{' '}
                                <a
                                  href={`tel:${item.phoneNumber}`}
                                  style={{ color: '#11998e', fontWeight: 700, textDecoration: 'none' }}
                                >
                                  {item.phoneNumber || 'N/A'}
                                </a>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleViewTenantContact(item)}
                                style={{
                                  background: '#11998e',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '5px 12px',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  margin: '2px 0 4px',
                                }}
                              >
                                📞 View Contact ({tenantContactPoints} pts)
                              </button>
                            );
                          })()}
                          <div>🏠 {item.propertyMode || 'N/A'} • {item.propertyType || 'N/A'}</div>
                          <div>📍 {item.area || 'N/A'}, {item.city || 'N/A'} - {item.pinCode || item.pincode || 'N/A'}</div>
                          <div>
                            💰 ₹{item.minPrice || 'N/A'} – ₹{item.maxPrice || 'N/A'}
                          </div>

                          {(() => {
                            const tenantKey = item._id || item.Ra_Id || idx;
                            const isExpanded = expandedTenant === tenantKey;
                            return (
                              <>
                                <button
                                  onClick={() =>
                                    setExpandedTenant(isExpanded ? null : tenantKey)
                                  }
                                  style={{
                                    background: 'transparent',
                                    color: '#11998e',
                                    border: '1px solid #11998e',
                                    borderRadius: '6px',
                                    padding: '4px 12px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    marginTop: '8px',
                                  }}
                                >
                                  {isExpanded ? '▲ Less' : '▼ More'}
                                </button>

                                {isExpanded && (
                                  <div
                                    style={{
                                      marginTop: '8px',
                                      paddingTop: '8px',
                                      borderTop: '1px dashed #b9e8d4',
                                    }}
                                  >
                                    <div>🛏️ Bedrooms: {item.bedrooms || 'N/A'} BHK</div>
                                    <div>
                                      📐 Min. Area: {item.totalArea || 'N/A'}{' '}
                                      {item.areaUnit || ''}
                                    </div>
                                    <div>🧭 Facing: {item.facing || 'N/A'}</div>
                                    <div>
                                      🏙️ City: {item.city || 'N/A'} - {item.pinCode || item.pincode || 'N/A'}
                                    </div>
                                    <div>
                                      📋 Plan: {item.planName || item.planType || 'N/A'}
                                    </div>
                                    <div style={{ marginTop: '4px' }}>
                                      📝 Description:
                                    </div>
                                    <div style={{ color: '#555' }}>
                                      {item.description || 'No description available.'}
                                    </div>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Filter Popup — mobile-sized bottom sheet */}
        {showFilterPanel && (
        <div
          data-filter-section
          onClick={() => setShowFilterPanel(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1500,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            overflowY: 'auto',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              background: '#fff',
              borderRadius: '16px 16px 0 0',
              maxWidth: '420px',
              width: '100%',
              padding: '16px 12px 12px',
              boxShadow: '0 -8px 24px rgba(0,0,0,0.18)',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            {/* Drag handle bar */}
            <div
              style={{
                width: '40px',
                height: '4px',
                borderRadius: '4px',
                background: '#d0d0d0',
                margin: '0 auto 10px',
              }}
            />
            <button
              onClick={() => setShowFilterPanel(false)}
              aria-label="Close filters"
              style={{
                position: 'absolute',
                top: '8px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#666',
                lineHeight: 1,
                padding: 0,
              }}
            >
              ×
            </button>
            {/* Filter Header Row */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '14px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              {/* Filters Label and Clear Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', justifyContent: 'center' }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#333',
                  letterSpacing: '0.3px'
                }}>
                  Filters
                </span>
                {/* Display searched area as a badge */}
                {navbarSearchValue && (
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: '#E3F2FD',
                    color: '#1976D2',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: '1px solid #1976D2'
                  }}>
                    📍 {navbarSearchValue}
                  </div>
                )}
                {(horizontalFilters.selectedPropertyMode.length > 0 || 
                  horizontalFilters.selectedPropertyType.length > 0 || 
                  horizontalFilters.selectedRentRanges.length > 0 ||
                  horizontalFilters.selectedRentType.length > 0 ||
                  horizontalFilters.selectedBedroom.length > 0 ||
                  horizontalFilters.selectedFloor.length > 0 ||
                  horizontalFilters.selectedArea) && (
                  <button
                    onClick={handleClearAllHorizontalFilters}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0066CC',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textDecoration: 'none',
                      padding: 0,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.textDecoration = 'underline';
                      e.target.style.color = '#0052A3';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.textDecoration = 'none';
                      e.target.style.color = '#0066CC';
                    }}
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Filter Chips - Equal Distribution */}
              <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                width: '100%'
              }}>
                {/* Property Mode Chip */}
                <button
                  onClick={() => setOpenPropertyModeModal(true)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    border: horizontalFilters.selectedPropertyMode.length > 0 ? '2px solid #0066CC' : '1px solid #ddd',
                    background: horizontalFilters.selectedPropertyMode.length > 0 ? '#E8F0FE' : '#f5f5f5',
                    color: horizontalFilters.selectedPropertyMode.length > 0 ? '#0066CC' : '#333',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 102, 204, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Property Mode({getHorizontalFilterCounts().propertyMode})
                  <span style={{ fontSize: '10px' }}>▼</span>
                </button>

                {/* Property Type Chip */}
                <button
                  onClick={() => setOpenPropertyTypeModal(true)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    border: horizontalFilters.selectedPropertyType.length > 0 ? '2px solid #0066CC' : '1px solid #ddd',
                    background: horizontalFilters.selectedPropertyType.length > 0 ? '#E8F0FE' : '#f5f5f5',
                    color: horizontalFilters.selectedPropertyType.length > 0 ? '#0066CC' : '#333',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 102, 204, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Property Type({getHorizontalFilterCounts().propertyType})
                  <span style={{ fontSize: '10px' }}>▼</span>
                </button>

                {/* Rent Amount Chip */}
                <button
                  onClick={() => setOpenRentAmountModal(true)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    border: getHorizontalFilterCounts().rentAmount > 0 ? '2px solid #0066CC' : '1px solid #ddd',
                    background: getHorizontalFilterCounts().rentAmount > 0 ? '#E8F0FE' : '#f5f5f5',
                    color: getHorizontalFilterCounts().rentAmount > 0 ? '#0066CC' : '#333',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 102, 204, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Rent ({getHorizontalFilterCounts().rentAmount})
                  <span style={{ fontSize: '10px' }}>▼</span>
                </button>

                {/* Rent Type Chip */}
                <button
                  onClick={() => setOpenRentTypeModal(true)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    border: horizontalFilters.selectedRentType.length > 0 ? '2px solid #0066CC' : '1px solid #ddd',
                    background: horizontalFilters.selectedRentType.length > 0 ? '#E8F0FE' : '#f5f5f5',
                    color: horizontalFilters.selectedRentType.length > 0 ? '#0066CC' : '#333',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 102, 204, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Rent Type({getHorizontalFilterCounts().rentType})
                  <span style={{ fontSize: '10px' }}>▼</span>
                </button>

                {/* Bedroom Chip */}
                <button
                  onClick={() => setOpenBedroomModal(true)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    border: horizontalFilters.selectedBedroom.length > 0 ? '2px solid #0066CC' : '1px solid #ddd',
                    background: horizontalFilters.selectedBedroom.length > 0 ? '#E8F0FE' : '#f5f5f5',
                    color: horizontalFilters.selectedBedroom.length > 0 ? '#0066CC' : '#333',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 102, 204, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Bedroom({getHorizontalFilterCounts().bedroom})
                  <span style={{ fontSize: '10px' }}>▼</span>
                </button>

                {/* Floor Chip */}
                <button
                  onClick={() => setOpenFloorModal(true)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    border: horizontalFilters.selectedFloor.length > 0 ? '2px solid #0066CC' : '1px solid #ddd',
                    background: horizontalFilters.selectedFloor.length > 0 ? '#E8F0FE' : '#f5f5f5',
                    color: horizontalFilters.selectedFloor.length > 0 ? '#0066CC' : '#333',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 102, 204, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Floor({getHorizontalFilterCounts().floor})
                  <span style={{ fontSize: '10px' }}>▼</span>
                </button>

                {/* Area Chip */}
                <button
                  onClick={() => setOpenAreaModal(true)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    border: getHorizontalFilterCounts().area > 0 ? '2px solid #0066CC' : '1px solid #ddd',
                    background: getHorizontalFilterCounts().area > 0 ? '#E8F0FE' : '#f5f5f5',
                    color: getHorizontalFilterCounts().area > 0 ? '#0066CC' : '#333',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 102, 204, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Area({getHorizontalFilterCounts().area})
                  <span style={{ fontSize: '10px' }}>▼</span>
                </button>
              </div>
            </div>

            {/* Dropdown Panel - REMOVED, Using Modals Instead */}

            {/* Property Mode Modal */}
            {openPropertyModeModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1509,
                animation: 'fadeIn 0.3s ease-in-out',
              }}>
                <div style={{
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
                }}>
                  <div style={{
                    fontWeight: 500,
                    fontSize: '15px',
                    marginBottom: '10px',
                    textAlign: 'start',
                    color: 'grey',
                  }}>
                    Select or Search <span style={{ color: '#0B57CF', fontWeight: 500 }}>Property Mode</span>
                  </div>
                  <ul style={{
                    listStyleType: 'none',
                    padding: 0,
                    margin: 0,
                    overflowY: 'auto',
                    maxHeight: '250px',
                  }}>
                    {['Residential', 'Commercial'].map((mode) => {
                      const isSelected = horizontalFilters.selectedPropertyMode.includes(mode);
                      return (
                        <li
                          key={mode}
                          onClick={() => handleHorizontalFilterChange('PropertyMode', mode)}
                          style={{
                            fontWeight: 300,
                            padding: '8px 5px',
                            cursor: 'pointer',
                            color: 'grey',
                            borderBottom: '1px solid #D0D7DE',
                            background: isSelected ? '#E8F0FE' : '#fff'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = isSelected ? '#E8F0FE' : '#f5f5f5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isSelected ? '#E8F0FE' : '#fff';
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            style={{
                              cursor: 'pointer',
                              width: '14px',
                              height: '14px',
                              marginRight: '6px',
                              verticalAlign: 'middle'
                            }}
                          />
                          {mode}
                        </li>
                      );
                    })}
                  </ul>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '10px',
                    gap: '8px'
                  }}>
                    <button
                      onClick={goToPreviousFilter}
                      disabled={currentFilterIndex === 0}
                      style={{
                        background: currentFilterIndex === 0 ? '#D0D0D0' : '#EAEAF6',
                        cursor: currentFilterIndex === 0 ? 'not-allowed' : 'pointer',
                        border: 'none',
                        color: currentFilterIndex === 0 ? '#999' : '#0B57CF',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => {
                        if (currentFilterIndex !== 0) {
                          e.currentTarget.style.background = '#DFDdEB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentFilterIndex !== 0) {
                          e.currentTarget.style.background = '#EAEAF6';
                        }
                      }}
                    >
                      Previous
                    </button>
                    <button
                      onClick={closeAllFilters}
                      style={{
                        background: '#FF6B6B',
                        cursor: 'pointer',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#E53E3E'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#FF6B6B'}
                    >
                      Close
                    </button>
                    <button
                      onClick={goToNextFilter}
                      disabled={currentFilterIndex === filtersList.length - 1}
                      style={{
                        background: currentFilterIndex === filtersList.length - 1 ? '#D0D0D0' : '#EAEAF6',
                        cursor: currentFilterIndex === filtersList.length - 1 ? 'not-allowed' : 'pointer',
                        border: 'none',
                        color: currentFilterIndex === filtersList.length - 1 ? '#999' : '#0B57CF',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => {
                        if (currentFilterIndex !== filtersList.length - 1) {
                          e.currentTarget.style.background = '#DFDdEB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentFilterIndex !== filtersList.length - 1) {
                          e.currentTarget.style.background = '#EAEAF6';
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Property Type Modal */}
            {openPropertyTypeModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1509,
                animation: 'fadeIn 0.3s ease-in-out',
              }}>
                <div style={{
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
                }}>
                  <div style={{
                    fontWeight: 500,
                    fontSize: '15px',
                    marginBottom: '10px',
                    textAlign: 'start',
                    color: 'grey',
                  }}>
                    Select or Search <span style={{ color: '#0B57CF', fontWeight: 500 }}>Property Type</span>
                  </div>
                  <ul style={{
                    listStyleType: 'none',
                    padding: 0,
                    margin: 0,
                    overflowY: 'auto',
                    maxHeight: '250px',
                  }}>
                    {[
                      'Apartment', 'House', 'Farmhouse', 'Plot', 'Land', 'Hotel', 'Resorts',
                      'Commercial Building', 'Guest House', 'Godown', 'Industrial Building', 'Shed',
                      'Agricultural Land', 'Other Space', 'Bachelor Room', 'Shop/Office', 'Function Hall',
                      'P/G', 'Hostal', 'Home Stay', 'Dormitory'
                    ].map((type) => {
                      const isSelected = horizontalFilters.selectedPropertyType.includes(type);
                      return (
                        <li
                          key={type}
                          onClick={() => handleHorizontalFilterChange('PropertyType', type)}
                          style={{
                            fontWeight: 300,
                            padding: '8px 5px',
                            cursor: 'pointer',
                            color: 'grey',
                            borderBottom: '1px solid #D0D7DE',
                            background: isSelected ? '#E8F0FE' : '#fff',
                            fontSize: '13px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = isSelected ? '#E8F0FE' : '#f5f5f5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isSelected ? '#E8F0FE' : '#fff';
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            style={{
                              cursor: 'pointer',
                              width: '14px',
                              height: '14px',
                              marginRight: '6px',
                              verticalAlign: 'middle'
                            }}
                          />
                          {type}
                        </li>
                      );
                    })}
                  </ul>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '10px',
                    gap: '8px'
                  }}>
                    <button
                      onClick={goToPreviousFilter}
                      disabled={currentFilterIndex === 0}
                      style={{
                        background: currentFilterIndex === 0 ? '#D0D0D0' : '#EAEAF6',
                        cursor: currentFilterIndex === 0 ? 'not-allowed' : 'pointer',
                        border: 'none',
                        color: currentFilterIndex === 0 ? '#999' : '#0B57CF',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => {
                        if (currentFilterIndex !== 0) {
                          e.currentTarget.style.background = '#DFDdEB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentFilterIndex !== 0) {
                          e.currentTarget.style.background = '#EAEAF6';
                        }
                      }}
                    >
                      Previous
                    </button>
                    <button
                      onClick={closeAllFilters}
                      style={{
                        background: '#FF6B6B',
                        cursor: 'pointer',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#E53E3E'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#FF6B6B'}
                    >
                      Close
                    </button>
                    <button
                      onClick={goToNextFilter}
                      disabled={currentFilterIndex === filtersList.length - 1}
                      style={{
                        background: currentFilterIndex === filtersList.length - 1 ? '#D0D0D0' : '#EAEAF6',
                        cursor: currentFilterIndex === filtersList.length - 1 ? 'not-allowed' : 'pointer',
                        border: 'none',
                        color: currentFilterIndex === filtersList.length - 1 ? '#999' : '#0B57CF',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => {
                        if (currentFilterIndex !== filtersList.length - 1) {
                          e.currentTarget.style.background = '#DFDdEB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentFilterIndex !== filtersList.length - 1) {
                          e.currentTarget.style.background = '#EAEAF6';
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Rent Amount Modal */}
            {openRentAmountModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1509,
                animation: 'fadeIn 0.3s ease-in-out',
              }}>
                <div style={{
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
                }}>
                  <div style={{
                    fontWeight: 500,
                    fontSize: '15px',
                    marginBottom: '10px',
                    textAlign: 'start',
                    color: 'grey',
                  }}>
                    Select or Search <span style={{ color: '#0B57CF', fontWeight: 500 }}>Rent Range</span>
                  </div>
                  <ul style={{
                    listStyleType: 'none',
                    padding: 0,
                    margin: 0,
                    overflowY: 'auto',
                    maxHeight: '250px',
                  }}>
                    {rentRanges.map((range, index) => {
                      const isSelected = horizontalFilters.selectedRentRanges.includes(index);
                      return (
                        <li
                          key={index}
                          onClick={() => {
                            setHorizontalFilters(prev => {
                              const newRanges = prev.selectedRentRanges.includes(index)
                                ? prev.selectedRentRanges.filter(i => i !== index)
                                : [...prev.selectedRentRanges, index];
                              return {
                                ...prev,
                                selectedRentRanges: newRanges
                              };
                            });
                          }}
                          style={{
                            fontWeight: 300,
                            padding: '8px 5px',
                            cursor: 'pointer',
                            color: 'grey',
                            borderBottom: '1px solid #D0D7DE',
                            background: isSelected ? '#E8F0FE' : '#fff'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = isSelected ? '#E8F0FE' : '#f5f5f5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isSelected ? '#E8F0FE' : '#fff';
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            style={{
                              cursor: 'pointer',
                              width: '14px',
                              height: '14px',
                              marginRight: '6px',
                              verticalAlign: 'middle'
                            }}
                          />
                          {range.label}
                        </li>
                      );
                    })}
                  </ul>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '10px',
                    gap: '8px'
                  }}>
                    <button
                      onClick={goToPreviousFilter}
                      disabled={currentFilterIndex === 0}
                      style={{
                        background: currentFilterIndex === 0 ? '#D0D0D0' : '#EAEAF6',
                        cursor: currentFilterIndex === 0 ? 'not-allowed' : 'pointer',
                        border: 'none',
                        color: currentFilterIndex === 0 ? '#999' : '#0B57CF',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => {
                        if (currentFilterIndex !== 0) {
                          e.currentTarget.style.background = '#DFDdEB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentFilterIndex !== 0) {
                          e.currentTarget.style.background = '#EAEAF6';
                        }
                      }}
                    >
                      Previous
                    </button>
                    <button
                      onClick={closeAllFilters}
                      style={{
                        background: '#FF6B6B',
                        cursor: 'pointer',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#E53E3E'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#FF6B6B'}
                    >
                      Close
                    </button>
                    <button
                      onClick={goToNextFilter}
                      disabled={currentFilterIndex === filtersList.length - 1}
                      style={{
                        background: currentFilterIndex === filtersList.length - 1 ? '#D0D0D0' : '#EAEAF6',
                        cursor: currentFilterIndex === filtersList.length - 1 ? 'not-allowed' : 'pointer',
                        border: 'none',
                        color: currentFilterIndex === filtersList.length - 1 ? '#999' : '#0B57CF',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => {
                        if (currentFilterIndex !== filtersList.length - 1) {
                          e.currentTarget.style.background = '#DFDdEB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentFilterIndex !== filtersList.length - 1) {
                          e.currentTarget.style.background = '#EAEAF6';
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Rent Type Modal */}
            {openRentTypeModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1509,
                animation: 'fadeIn 0.3s ease-in-out',
              }}>
                <div style={{
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
                }}>
                  <div style={{
                    fontWeight: 500,
                    fontSize: '15px',
                    marginBottom: '10px',
                    textAlign: 'start',
                    color: 'grey',
                  }}>
                    Select or Search <span style={{ color: '#0B57CF', fontWeight: 500 }}>Rent Type</span>
                  </div>
                  <ul style={{
                    listStyleType: 'none',
                    padding: 0,
                    margin: 0,
                    overflowY: 'auto',
                    maxHeight: '250px',
                  }}>
                    {['Monthly', 'Weekly', 'Fortnightly', 'Daily', 'Lease'].map((type) => {
                      const isSelected = horizontalFilters.selectedRentType.includes(type);
                      return (
                        <li
                          key={type}
                          onClick={() => handleHorizontalFilterChange('RentType', type)}
                          style={{
                            fontWeight: 300,
                            padding: '8px 5px',
                            cursor: 'pointer',
                            color: 'grey',
                            borderBottom: '1px solid #D0D7DE',
                            background: isSelected ? '#E8F0FE' : '#fff'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = isSelected ? '#E8F0FE' : '#f5f5f5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isSelected ? '#E8F0FE' : '#fff';
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            style={{
                              cursor: 'pointer',
                              width: '14px',
                              height: '14px',
                              marginRight: '6px',
                              verticalAlign: 'middle'
                            }}
                          />
                          {type}
                        </li>
                      );
                    })}
                  </ul>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '10px',
                    gap: '8px'
                  }}>
                    <button
                      onClick={goToPreviousFilter}
                      disabled={currentFilterIndex === 0}
                      style={{
                        background: currentFilterIndex === 0 ? '#D0D0D0' : '#EAEAF6',
                        cursor: currentFilterIndex === 0 ? 'not-allowed' : 'pointer',
                        border: 'none',
                        color: currentFilterIndex === 0 ? '#999' : '#0B57CF',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => {
                        if (currentFilterIndex !== 0) {
                          e.currentTarget.style.background = '#DFDdEB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentFilterIndex !== 0) {
                          e.currentTarget.style.background = '#EAEAF6';
                        }
                      }}
                    >
                      Previous
                    </button>
                    <button
                      onClick={closeAllFilters}
                      style={{
                        background: '#FF6B6B',
                        cursor: 'pointer',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#E53E3E'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#FF6B6B'}
                    >
                      Close
                    </button>
                    <button
                      onClick={goToNextFilter}
                      disabled={currentFilterIndex === filtersList.length - 1}
                      style={{
                        background: currentFilterIndex === filtersList.length - 1 ? '#D0D0D0' : '#EAEAF6',
                        cursor: currentFilterIndex === filtersList.length - 1 ? 'not-allowed' : 'pointer',
                        border: 'none',
                        color: currentFilterIndex === filtersList.length - 1 ? '#999' : '#0B57CF',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => {
                        if (currentFilterIndex !== filtersList.length - 1) {
                          e.currentTarget.style.background = '#DFDdEB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentFilterIndex !== filtersList.length - 1) {
                          e.currentTarget.style.background = '#EAEAF6';
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bedroom Modal */}
            {openBedroomModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1509,
                animation: 'fadeIn 0.3s ease-in-out',
              }}>
                <div style={{
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
                }}>
                  <div style={{
                    fontWeight: 500,
                    fontSize: '15px',
                    marginBottom: '10px',
                    textAlign: 'start',
                    color: 'grey',
                  }}>
                    Select or Search <span style={{ color: '#0B57CF', fontWeight: 500 }}>Bedrooms</span>
                  </div>
                  <ul style={{
                    listStyleType: 'none',
                    padding: 0,
                    margin: 0,
                    overflowY: 'auto',
                    maxHeight: '250px',
                  }}>
                    {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6 BHK', '7 BHK', '8 BHK', 'No'].map((bedroom) => {
                      const isSelected = horizontalFilters.selectedBedroom.includes(bedroom);
                      return (
                        <li
                          key={bedroom}
                          onClick={() => handleHorizontalFilterChange('Bedroom', bedroom)}
                          style={{
                            fontWeight: 300,
                            padding: '8px 5px',
                            cursor: 'pointer',
                            color: 'grey',
                            borderBottom: '1px solid #D0D7DE',
                            background: isSelected ? '#E8F0FE' : '#fff'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = isSelected ? '#E8F0FE' : '#f5f5f5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isSelected ? '#E8F0FE' : '#fff';
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            style={{
                              cursor: 'pointer',
                              width: '14px',
                              height: '14px',
                              marginRight: '6px',
                              verticalAlign: 'middle'
                            }}
                          />
                          {bedroom}
                        </li>
                      );
                    })}
                  </ul>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '10px',
                    gap: '8px'
                  }}>
                    <button
                      onClick={goToPreviousFilter}
                      disabled={currentFilterIndex === 0}
                      style={{
                        background: currentFilterIndex === 0 ? '#D0D0D0' : '#EAEAF6',
                        cursor: currentFilterIndex === 0 ? 'not-allowed' : 'pointer',
                        border: 'none',
                        color: currentFilterIndex === 0 ? '#999' : '#0B57CF',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => {
                        if (currentFilterIndex !== 0) {
                          e.currentTarget.style.background = '#DFDdEB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentFilterIndex !== 0) {
                          e.currentTarget.style.background = '#EAEAF6';
                        }
                      }}
                    >
                      Previous
                    </button>
                    <button
                      onClick={closeAllFilters}
                      style={{
                        background: '#FF6B6B',
                        cursor: 'pointer',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#E53E3E'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#FF6B6B'}
                    >
                      Close
                    </button>
                    <button
                      onClick={goToNextFilter}
                      disabled={currentFilterIndex === filtersList.length - 1}
                      style={{
                        background: currentFilterIndex === filtersList.length - 1 ? '#D0D0D0' : '#EAEAF6',
                        cursor: currentFilterIndex === filtersList.length - 1 ? 'not-allowed' : 'pointer',
                        border: 'none',
                        color: currentFilterIndex === filtersList.length - 1 ? '#999' : '#0B57CF',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => {
                        if (currentFilterIndex !== filtersList.length - 1) {
                          e.currentTarget.style.background = '#DFDdEB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentFilterIndex !== filtersList.length - 1) {
                          e.currentTarget.style.background = '#EAEAF6';
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Floor Modal */}
            {openFloorModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1509,
                animation: 'fadeIn 0.3s ease-in-out',
              }}>
                <div style={{
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
                }}>
                  <div style={{
                    fontWeight: 500,
                    fontSize: '15px',
                    marginBottom: '10px',
                    textAlign: 'start',
                    color: 'grey',
                  }}>
                    Select or Search <span style={{ color: '#0B57CF', fontWeight: 500 }}>Floor</span>
                  </div>
                  <ul style={{
                    listStyleType: 'none',
                    padding: 0,
                    margin: 0,
                    overflowY: 'auto',
                    maxHeight: '250px',
                  }}>
                    {['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor', '6th Floor', '7th Floor', '8th Floor', '9th Floor', '10th Floor', 'Basement', 'Lower Basement'].map((floor) => {
                      const isSelected = horizontalFilters.selectedFloor.includes(floor);
                      return (
                        <li
                          key={floor}
                          onClick={() => handleHorizontalFilterChange('Floor', floor)}
                          style={{
                            fontWeight: 300,
                            padding: '8px 5px',
                            cursor: 'pointer',
                            color: 'grey',
                            borderBottom: '1px solid #D0D7DE',
                            background: isSelected ? '#E8F0FE' : '#fff'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = isSelected ? '#E8F0FE' : '#f5f5f5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isSelected ? '#E8F0FE' : '#fff';
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            style={{
                              cursor: 'pointer',
                              width: '14px',
                              height: '14px',
                              marginRight: '6px',
                              verticalAlign: 'middle'
                            }}
                          />
                          {floor}
                        </li>
                      );
                    })}
                  </ul>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '10px',
                    gap: '8px'
                  }}>
                    <button
                      onClick={goToPreviousFilter}
                      disabled={currentFilterIndex === 0}
                      style={{
                        background: currentFilterIndex === 0 ? '#D0D0D0' : '#EAEAF6',
                        cursor: currentFilterIndex === 0 ? 'not-allowed' : 'pointer',
                        border: 'none',
                        color: currentFilterIndex === 0 ? '#999' : '#0B57CF',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => {
                        if (currentFilterIndex !== 0) {
                          e.currentTarget.style.background = '#DFDdEB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentFilterIndex !== 0) {
                          e.currentTarget.style.background = '#EAEAF6';
                        }
                      }}
                    >
                      Previous
                    </button>
                    <button
                      onClick={closeAllFilters}
                      style={{
                        background: '#FF6B6B',
                        cursor: 'pointer',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#E53E3E'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#FF6B6B'}
                    >
                      Close
                    </button>
                    <button
                      onClick={goToNextFilter}
                      disabled={currentFilterIndex === filtersList.length - 1}
                      style={{
                        background: currentFilterIndex === filtersList.length - 1 ? '#D0D0D0' : '#EAEAF6',
                        cursor: currentFilterIndex === filtersList.length - 1 ? 'not-allowed' : 'pointer',
                        border: 'none',
                        color: currentFilterIndex === filtersList.length - 1 ? '#999' : '#0B57CF',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => {
                        if (currentFilterIndex !== filtersList.length - 1) {
                          e.currentTarget.style.background = '#DFDdEB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentFilterIndex !== filtersList.length - 1) {
                          e.currentTarget.style.background = '#EAEAF6';
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Area Modal */}
            {openAreaModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1509,
                animation: 'fadeIn 0.3s ease-in-out',
              }}>
                <div style={{
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
                }}>
                  <div style={{
                    fontWeight: 500,
                    fontSize: '15px',
                    marginBottom: '10px',
                    textAlign: 'start',
                    color: 'grey',
                  }}>
                    Select or Search <span style={{ color: '#0B57CF', fontWeight: 500 }}>Area</span>
                  </div>
                  <div style={{ marginBottom: '10px', position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="Search area..."
                      value={horizontalFilters.selectedArea}
                      onChange={handleAreaInputChange}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid #D0D7DE',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        fontWeight: 300
                      }}
                    />
                    {showAreaSuggestions && areaSuggestions.length > 0 && (
                      <ul style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #D0D7DE',
                        borderRadius: '8px',
                        maxHeight: '150px',
                        overflowY: 'auto',
                        zIndex: 10001,
                        listStyleType: 'none',
                        padding: '0',
                        margin: '5px 0 0 0'
                      }}>
                        {areaSuggestions.map((area) => (
                          <li
                            key={area}
                            onClick={() => handleAreaSelect(area)}
                            style={{
                              padding: '8px 10px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              color: '#666',
                              borderBottom: '1px solid #E8E8E8',
                              fontWeight: 300
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                          >
                            {area}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {horizontalFilters.selectedArea && (
                    <div style={{ marginBottom: '10px', fontSize: '12px', color: '#666', fontWeight: 300 }}>
                      Selected: <strong style={{ color: '#0B57CF' }}>{horizontalFilters.selectedArea}</strong>
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '10px',
                    gap: '8px'
                  }}>
                    <button
                      onClick={goToPreviousFilter}
                      disabled={currentFilterIndex === 0}
                      style={{
                        background: currentFilterIndex === 0 ? '#D0D0D0' : '#EAEAF6',
                        cursor: currentFilterIndex === 0 ? 'not-allowed' : 'pointer',
                        border: 'none',
                        color: currentFilterIndex === 0 ? '#999' : '#0B57CF',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => {
                        if (currentFilterIndex !== 0) {
                          e.currentTarget.style.background = '#DFDdEB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentFilterIndex !== 0) {
                          e.currentTarget.style.background = '#EAEAF6';
                        }
                      }}
                    >
                      Previous
                    </button>
                    <button
                      onClick={closeAllFilters}
                      style={{
                        background: '#FF6B6B',
                        cursor: 'pointer',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#E53E3E'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#FF6B6B'}
                    >
                      Close
                    </button>
                    <button
                      onClick={goToNextFilter}
                      disabled={currentFilterIndex === filtersList.length - 1}
                      style={{
                        background: currentFilterIndex === filtersList.length - 1 ? '#D0D0D0' : '#EAEAF6',
                        cursor: currentFilterIndex === filtersList.length - 1 ? 'not-allowed' : 'pointer',
                        border: 'none',
                        color: currentFilterIndex === filtersList.length - 1 ? '#999' : '#0B57CF',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontWeight: 500,
                        fontSize: '13px',
                        flex: 1
                      }}
                      onMouseEnter={(e) => {
                        if (currentFilterIndex !== filtersList.length - 1) {
                          e.currentTarget.style.background = '#DFDdEB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentFilterIndex !== filtersList.length - 1) {
                          e.currentTarget.style.background = '#EAEAF6';
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            <style>{`
              @keyframes slideDown {
                from {
                  opacity: 0;
                  transform: translateY(-10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }
              @keyframes popupOpen {
                from {
                  opacity: 0;
                  transform: scale(0.9);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
              @keyframes modalSlideUp {
                from {
                  opacity: 0;
                  transform: translateY(30px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        </div>
        )}

        <style>{`
          /* AddProperty icon subtle rise+glow animation, scoped to this file */
          .add-property-anim {
            will-change: transform, filter;
            /* keep layout unaffected */
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          @keyframes addPropertyPulse {
            0% {
              transform: translateY(0);
              filter: drop-shadow(0 0 0 rgba(79,75,126,0));
              box-shadow: none;
            }
            10% {
              transform: translateY(-20px);
              filter: drop-shadow(0 8px 18px rgba(79,75,126,0.14));
              box-shadow: 0 8px 20px rgba(79,75,126,0.08);
            }
            25% {
              transform: translateY(-20px);
              filter: drop-shadow(0 10px 22px rgba(79,75,126,0.18));
              box-shadow: 0 10px 24px rgba(79,75,126,0.10);
            }
            40% {
              transform: translateY(0);
              filter: drop-shadow(0 0 0 rgba(79,75,126,0));
              box-shadow: none;
            }
            100% {
              transform: translateY(0);
              filter: drop-shadow(0 0 0 rgba(79,75,126,0));
              box-shadow: none;
            }
          }

          /* Run animation once every 5s (duration 1.6s + delay) */
          .add-property-anim.animate {
            animation: addPropertyPulse 1.6s ease-in-out infinite;
            animation-iteration-count: infinite;
            animation-delay: 0s;
          }

          /* Search bar placeholder styling */
          input::placeholder {
            color: #9b94d4;
            font-weight: 500;
            font-size: 15px;
          }
          
          input:focus::placeholder {
            color: #b3afd9;
          }
        `}</style>
        <Col lg={12} className="d-flex align-items-center justify-content-center pt-2 m-0">
      <div
  onClick={() => setIsSearchMenuOpen(true)}
  style={{
    height: '70px',
    width: '70px',
    position: 'fixed',
    right: 'calc(50% - 187.5px + 10px)',
    bottom: '8%',
    zIndex: '1',
    cursor: 'pointer',
  }}
>
  <AnimatedSearchLogo />
</div>

{/* Search Menu Modal - Shows for 5 seconds when search button clicked */}
{isSearchMenuOpen && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(64, 64, 64, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050,
      animation: 'fadeIn 0.3s ease-in-out'
    }}
    onClick={() => setIsSearchMenuOpen(false)}
  >
    <div
      className="rounded-5 shadow"
      style={{
        width: "350px",
        backgroundColor: '#fff',
        padding: '30px 20px'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="d-grid gap-2 mb-2">
        {/* Search Property - Open filter popup */}
        <button
          style={{ background: "#DFDFDF", color: "#5E5E5E", fontWeight: 600, fontSize: "15px" }}
          className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
          onClick={() => setIsSearchMenuOpen(false)}
          data-bs-toggle="modal"
          data-bs-target="#filterPopup"
        >
          <FaHome className="me-2" /> Search Property
        </button>

        {/* Tenant Search */}
        <button
          style={{ background: "#DFDFDF", color: "#5E5E5E", fontWeight: 600, fontSize: "15px" }}
          className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
          onClick={() => {
            setIsSearchMenuOpen(false);
            setIsTenantSearchOpen(true);
          }}
        >
          <FaUsers className="me-2" /> Tenant Search
        </button>

        {/* Quick Sort */}
        <button
          style={{ background: "#DFDFDF", color: "#5E5E5E", fontWeight: 600, fontSize: "15px" }}
          className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
          onClick={() => {
            setIsSearchMenuOpen(false);
            navigate(`/Sort-Property`);
          }}
        >
          <FaSortAmountDownAlt className="me-2" /> Quick Sort
        </button>

        {/* Property Assistance */}
        <button
          style={{ background: "#DFDFDF", color: "#5E5E5E", fontWeight: 600, fontSize: "15px" }}
          className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
          onClick={() => {
            setIsSearchMenuOpen(false);
            navigate(`/buyer-assistance`);
          }}
        >
          <FaHeadset className="me-2" /> Property Assistance
        </button>
      </div>

      {/* Cancel */}
      <div className="text-center">
        <button
          className="btn btn-primary rounded-2 px-4 mt-2"
          style={{ fontWeight: 500, fontSize: "10px" }}
          onClick={() => setIsSearchMenuOpen(false)}
        >
          CANCEL
        </button>
      </div>
    </div>
  </div>
)}

{/* Modal */}
<div
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
          {/* Search Property - Open another popup */}
          <button style={{background:"#DFDFDF" , color:"#5E5E5E" , fontWeight:600 , fontSize:"15px"}}
            className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
            data-bs-toggle="modal"
            data-bs-target="#filterPopup" // Nested modal
          >
            <FaHome className="me-2" /> Search Property
          </button>

          {/* Tenant Search */}
          <button style={{background:"#DFDFDF" , color:"#5E5E5E" , fontWeight:600 , fontSize:"15px"}}
          className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
                onClick={() => setIsTenantSearchOpen(true)}
>
            <FaUsers className="me-2" /> Tenant Search
          </button>

          {/* Quick Sort */}
          <button style={{background:"#DFDFDF" , color:"#5E5E5E" , fontWeight:600 , fontSize:"15px"}}
          className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
                          onClick={() => navigate(`/Sort-Property`)}
>
            <FaSortAmountDownAlt className="me-2" /> Quick Sort
          </button>

          {/* Property Assistance */}
          <button style={{background:"#DFDFDF" , color:"#5E5E5E" , fontWeight:600 , fontSize:"15px"}}
          className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
      onClick={() => navigate(`/buyer-assistance`)}
      >
            <FaHeadset className="me-2" /> Property Assistance
          </button>
        </div>

        {/* Cancel */}
        <div className="text-center" >
          <button className="btn btn-primary rounded-2 px-4 mt-2" data-bs-dismiss="modal"
          style={{ fontWeight:500 , fontSize:"10px"}}>
            CANCEL
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

{/* Filter Popup (Nested Modal) */}
<div
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
      
     <div className="form-group">
       <div className="input-card p-0 rounded-2" style={{ 
         display: 'flex', 
         alignItems: 'center', 
         justifyContent: 'space-between', 
         width: '100%',  
         boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
         background: "#fff",
         paddingRight: "10px"
       }}>
         
         
         
        <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         // boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }}
     >     
       <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
     <img src={idcard} alt="" style={{ width: 20, height: 20 }} />  </span>
           <input
             type="number"
             name="id"
             value={filters.id}
             onChange={handleFilterChange}
             className="form-input m-0"
             placeholder="SEARCH BY RENT ID"
             style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
           />
         </div>
         {filters.id && (
           <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
         )}
       </div>
     </div>


     <div className="form-group " >
    <label style={{width:'100%'}}>

         <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >                    <span      style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}>
              <img src={minprice} alt="" width={20}/>
            </span>
        <div style={{ flex: "1" }}>
          <select
            name="minPrice"
            value={filters.minPrice || ""}
            onChange={handleFilterChange}
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
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("minPrice")}
                 style={{
                     cursor: "pointer",
                     border:"none",
                     padding: "12px",
                     background: "#fff",
                     borderRadius: "5px",
                     width: "100%",
                     textAlign: "left",
                     color: "grey",
                      position: "relative",
                     boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
     }}      
          >
       
            {filters.minPrice || "Select minPrice"}
               {filters.minPrice && (
             <GoCheckCircleFill
               style={{
                 position: "absolute",
                 right: "10px",
                 top: "50%",
                 transform: "translateY(-50%)",
                 color: "green",
               }}
             />
           )}
          </button>

          {renderDropdown("minPrice")}
        </div>
      </div>
    </label>
  </div>

    <div className="form-group " >
        <label style={{width:'100%'}}>
       <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >             <span        style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}>
<img src={maxprice} alt="" width={20}/></span>
         
            <div style={{ flex: "1" }}>
              <select
                name="maxPrice"
                value={filters.maxPrice || ""}
                onChange={handleFilterChange}
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
                className="m-0"
                type="button"
                onClick={() => toggleDropdown("maxPrice")}
                     style={{
                     cursor: "pointer",
                     border:"none",
                     padding: "12px",
                     background: "#fff",
                     borderRadius: "5px",
                     width: "100%",
                     textAlign: "left",
                     color: "grey",
                      position: "relative",
                     boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
     }}      
              >
             
                {filters.maxPrice || "Select maxPrice"}
                  {filters.maxPrice && (
             <GoCheckCircleFill
               style={{
                 position: "absolute",
                 right: "10px",
                 top: "50%",
                 transform: "translateY(-50%)",
                 color: "green",
               }}
             />
           )}
              </button>
    
              {renderDropdown("maxPrice")}
            </div>
          </div>
        </label>
      </div>
     {/* {currentStep >= 1 && ( */}
             <div>
     
       {/* Property Mode */}
       <div className="form-group">
         <label style={{ width: '100%'}}>
         {/* <label>Property Mode <span style={{ color: 'red' }}>* </span></label> */}
     
           <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >
       <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
      {fieldIcons.propertyMode}   </span>
     
       <div style={{ flex: "1" }}>
         <select
           name="propertyMode"
           value={filters.propertyMode || ""}
           onChange={handleFilterChange}
           className="form-control"
           style={{ display: "none" }}
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
     onClick={() => toggleDropdown("propertyMode")}                 
                 style={{
             cursor: "pointer",
             padding: "12px",
             border:"none",
             background: "#fff",
             borderRadius: "5px",
             width: "100%",
             textAlign: "left",
             color: "grey",
             position: "relative",
             boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
           }}
         >
           {filters.propertyMode || "Select Property Mode"}
           {filters.propertyMode && (
             <GoCheckCircleFill
               style={{
                 position: "absolute",
                 right: "10px",
                 top: "50%",
                 transform: "translateY(-50%)",
                 color: "green",
               }}
             />
           )}
         </button>
     
         {renderDropdown("propertyMode")}
       </div>
     </div>
     
         </label>
       </div>
     
       <div className="form-group"> 
       <label style={{ width: '100%' }}>
         {/* <label>Property Type <span style={{ color: 'red' }}>* </span> </label> */}
     
           <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >           <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
                 {fieldIcons.propertyType} 
               </span>
           <div style={{ flex: "1" }}>
             <select
               name="propertyType"
               value={filters.propertyType || ""}
               onChange={handleFilterChange}
               className="form-control"
               style={{ display: "none" }} 
             >
               <option value="">Select property Type</option>
               {dataList.propertyType?.map((option, index) => (
                 <option key={index} value={option}>
                   {option}
                 </option>
               ))}
             </select>
     
             <button
               className="m-0"
               type="button"
              onClick={() => toggleDropdown("propertyType")}                    
                  style={{
                 cursor: "pointer",
                 // border: "1px solid #4F4B7E",
                 border:"none",
                 padding: "12px",
                 background: "#fff",
                 borderRadius: "5px",
                 width: "100%",
                 textAlign: "left",
                 color: "grey",
                 position: "relative",
                 boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', 
               }}
             >
         
               {filters.propertyType || "Select Property Type"}
     
               {filters.propertyType && (
                 <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
               )}
             </button>
     
             {renderDropdown("propertyType")}
           </div>
         </div>
       </label>
     </div>
     
     {/* rentType */}
     <div className="form-group"> 
       <label style={{ width: '100%' }}>
         {/* <label>renty Type <span style={{ color: 'red' }}>* </span> </label> */}
     
           <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >           <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
                 {fieldIcons.rentType} 
               </span>
           <div style={{ flex: "1" }}>
             <select
               name="rentType"
               value={filters.rentType || ""}
               onChange={handleFilterChange}
               className="form-control"
               style={{ display: "none" }} 
             >
               <option value="">Select renty Type</option>
               {dataList.rentType?.map((option, index) => (
                 <option key={index} value={option}>
                   {option}
                 </option>
               ))}
             </select>
     
             <button
               className="m-0"
               type="button"
               onClick={() => toggleDropdown("rentType")}
               style={{
                 cursor: "pointer",
                 // border: "1px solid #4F4B7E",
                 border:"none",
                 padding: "12px",
                 background: "#fff",
                 borderRadius: "5px",
                 width: "100%",
                 textAlign: "left",
                 color: "grey",
                 position: "relative",
                 boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', 
               }}
             >
         
               {filters.rentType || "Select rent Type"}
     
               {filters.rentType && (
                 <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
               )}
             </button>
     
             {renderDropdown("rentType")}
           </div>
         </div>
       </label>
     </div>

       </div>
     
     
     {/* {currentStep >= 2 && ( */}
             <div className="fieldcontent p-0">
       <h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}> Basic Property Info  </h4>             
     
       <div className="form-group">
         <label style={{ width: '100%'}}>
         {/* <label>Bedrooms </label> */}
     
           <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >       <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
                   {fieldIcons.bedrooms || <FaHome />}
                 </span> <div style={{ flex: "1" }}>
               <select
                 name="bedrooms"
                 value={filters.bedrooms || ""}
                 onChange={handleFilterChange}
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
                 className="m-0"
                 type="button"
                 onClick={() => toggleDropdown("bedrooms")}
                 style={{
                   cursor: "pointer",
                   border:"none",
                   // border: "1px solid #4F4B7E",
                   padding: "12px",
                   background: "#fff",
                   borderRadius: "5px",
                   width: "100%",
                   textAlign: "left",
                   color: "grey",
                 position: "relative",border:"none",
                             boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
     }}
               >
                  
                 {filters.bedrooms || "Select bedrooms"}
      {filters.bedrooms && (
                 <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
               )}          </button>
     
               {renderDropdown("bedrooms")}
             </div>
           </div>
         </label>
       </div>
     
         {/* floorNo */}
         <div className="form-group">
         <label style={{ width: '100%'}}>
         {/* <label>FloorNo </label> */}
     
           <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >       <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
                   {fieldIcons.floorNo}
                 </span>  <div style={{ flex: "1" }}>
               <select
                 name="floorNo"
                 value={filters.floorNo || ""}
                 onChange={handleFilterChange}
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
                 className="m-0"
                 type="button"
                 onClick={() => toggleDropdown("floorNo")}
                 style={{
                   cursor: "pointer",
                   border:"none",
                   // border: "1px solid #4F4B7E",
                   padding: "12px",
                   background: "#fff",
                   borderRadius: "5px",
                   width: "100%",
                   textAlign: "left",
                   color: "grey",
                 position: "relative",border:"none",
                             boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
     }}
               >
                 
                 {filters.floorNo || "Select floorNo"}
      {filters.floorNo && (
                 <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
               )}          </button>
     
               {renderDropdown("floorNo")}
             </div>
           </div>
         </label>
       </div>
       </div>
     
   
       
             <div className="fieldcontent p-0">
     <div className="form-group">
       {/* <label>State:</label> */}
       <div className="input-card p-0 rounded-2" style={{ 
         display: 'flex', 
         alignItems: 'center', 
         justifyContent: 'space-between', 
         width: '100%',  
         boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
         background: "#fff",
         paddingRight: "10px"
       }}>
         
        <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
       }}
     > 
          
          <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
          <MdLocationCity className="input-icon" style={{color: '#4F4B7E',}} />
       </span>
       <input
           type="text"
           name="state"
           value={filters.state}
           onChange={handleFilterChange}
           className="form-input m-0"
           placeholder="State"
             style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
         />
       </div>
        {filters.state && (
           <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
         )}
     </div></div>
       {/* Area */}
     
     <div className="form-group" style={{ position: "relative" }}>
       {/* <label>Area:</label> */}
       <div className="input-card p-0 rounded-2" style={{ 
         display: 'flex', 
         alignItems: 'center', 
         justifyContent: 'space-between', 
         width: '100%',  
         boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
         background: "#fff",
         paddingRight: "10px"
       }}>
         
       
         <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
       }}
     > 
          <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
          {fieldIcons.area || <FaHome />} 
       </span>
       <input
           type="text"
           name="area"
           value={filters.area}
           onChange={handleAreaInputChange}
           onFocus={() => {
             if (filters.area && areaSuggestions.length > 0) {
               setShowAreaSuggestions(true);
             }
           }}
           onBlur={() => {
             setTimeout(() => setShowAreaSuggestions(false), 200);
           }}
           className="form-input m-0"
           placeholder="Area"
             style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
         />
       </div>
        {filters.area && (
           <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
         )}
     </div>

       {/* Area Suggestions Dropdown */}
       {showAreaSuggestions && areaSuggestions.length > 0 && (
         <div
           style={{
             position: "absolute",
             top: "100%",
             left: 0,
             right: 0,
             backgroundColor: "#fff",
             border: "1px solid #4F4B7E",
             borderRadius: "8px",
             maxHeight: "200px",
             overflowY: "auto",
             zIndex: 1000,
             boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
           }}
         >
           {areaSuggestions.map((area, index) => (
             <div
               key={index}
               onClick={() => handleAreaSelect(area)}
               style={{
                 padding: "10px 15px",
                 cursor: "pointer",
                 borderBottom: index < areaSuggestions.length - 1 ? "1px solid #eee" : "none",
                 display: "flex",
                 justifyContent: "space-between",
                 alignItems: "center",
               }}
               onMouseEnter={(e) => e.target.style.backgroundColor = "#f0f0f0"}
               onMouseLeave={(e) => e.target.style.backgroundColor = "#fff"}
             >
               <span style={{ color: "#333", fontWeight: 500 }}>{area}</span>
               <span style={{ color: "#4F4B7E", fontSize: "12px" }}>{areaPincodeMap[area]}</span>
             </div>
           ))}
         </div>
       )}
     </div>
     
       {/* Pincode */}
     
     <div className="form-group">
       {/* <label>Pincode:</label> */}
       <div className="input-card p-0 rounded-2" style={{ 
         display: 'flex', 
         alignItems: 'center', 
         justifyContent: 'space-between', 
         width: '100%',  
         boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
         background: "#fff",
         paddingRight: "10px",
         position: 'relative'
       }}>
         
       
         <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
       }}
     > 
          <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
          {fieldIcons.pinCode || <FaHome />} 
       </span>
       <input
           type="text"
           name="pinCode"
           value={filters.pinCode}
           onChange={handlePincodeInputChange}
           onFocus={() => {
             if (filters.pinCode && pincodeSuggestions.length > 0) {
               setShowPincodeSuggestions(true);
             }
           }}
           onBlur={() => {
             setTimeout(() => setShowPincodeSuggestions(false), 200);
           }}
           className="form-input m-0"
           placeholder="Pincode"
             style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
         />
       </div>
        {filters.pinCode && (
           <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
         )}

       {/* Pincode Suggestions Dropdown */}
       {showPincodeSuggestions && pincodeSuggestions.length > 0 && (
         <div
           style={{
             position: "absolute",
             top: "100%",
             left: 0,
             right: 0,
             backgroundColor: "#fff",
             border: "1px solid #4F4B7E",
             borderRadius: "8px",
             maxHeight: "200px",
             overflowY: "auto",
             zIndex: 1000,
             boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
             marginTop: "4px"
           }}
         >
           {pincodeSuggestions.map((pincode, index) => (
             <div
               key={index}
               onClick={() => handlePincodeSelect(pincode)}
               style={{
                 padding: "10px 15px",
                 cursor: "pointer",
                 borderBottom: index < pincodeSuggestions.length - 1 ? "1px solid #eee" : "none",
                 color: "#333",
                 fontSize: "13px"
               }}
               onMouseEnter={(e) => e.target.style.backgroundColor = "#f0f0f0"}
               onMouseLeave={(e) => e.target.style.backgroundColor = "#fff"}
             >
               {pincode}
             </div>
           ))}
         </div>
       )}
     </div></div>



   
     
       </div>
     {/* Advance Filter Button */}
        <div className="text-center mt-3 ">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          {/* Clear Button */}
          <button
            type="button"
            onMouseEnter={() => setHoverClear(true)}
            onMouseLeave={() => setHoverClear(false)}
            style={{
              flex: 1,
              backgroundColor: hoverClear ? '#d32f2f' : '#fff',
              color: hoverClear ? '#fff' : '#d32f2f',
              border: `2px solid #d32f2f`,
              padding: '12px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onClick={() => {
              setFilters({
                id: '',
                minPrice: '',
                maxPrice: '',
                propertyMode: '',
                propertyType: '',
                rentType: '',
                bedrooms: '',
                floorNo: '',
                state: '',
                area: '',
                nagar: '',
                streetName: '',
                pinCode: ''
              });
              setAdvancedFilters({
                propertyMode: '', propertyType: '', minPrice: '', maxPrice: '', propertyAge: '', bankLoan: '',
                negotiation: '', length: '', breadth: '', totalArea: '', minTotalArea: '', ownership: '', bedrooms: '',
                minBedrooms: '', kitchen: '', kitchenType: '', balconies: '', floorNo: '', areaUnit: '', propertyApproved: '',
                facing: '', postedBy: '', furnished: '', lift: '', attachedBathrooms: '', minAttachedBathrooms: '',
                western: '', minWestern: '', rentType: '', carParking: '', area: '', nagar: '', streetName: '', pinCode: '', phoneNumber: '', state: ''
              });
            }}
          >
            CLEAR
          </button>

          {/* Search Button */}
          <button
            type="button"
            data-bs-dismiss="modal"
            onMouseEnter={() => setHoverSearch(true)}
            onMouseLeave={() => setHoverSearch(false)}
            onClick={() => setSearchPerformed(true)}
            style={{
              flex: 1,
              backgroundColor: hoverSearch ? '#4caf50' : '#fff',
              color: hoverSearch ? '#fff' : '#4caf50',
              border: `2px solid #4caf50`,
              padding: '12px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
          >
            SEARCH
          </button>
        </div>

      <button
        type="button"
        className="btn w-100 mt-3"
        data-bs-dismiss="modal"
        style={{
          backgroundColor: '#fff',
          color: '#666',
          border: `2px solid #666`,
          padding: '12px 20px',
          borderRadius: '6px',
          fontWeight: 'bold',
          fontSize: '14px'
        }}
        onClick={() => {
          // Keep advanced filter modal open, just switch to it
        }}
        data-bs-toggle="modal"
        data-bs-target="#advancedFilterPopup"
      >
        GO TO ADVANCED SEARCH
      </button>

      <button
        type="button"
        className="btn w-100 mt-3"
        data-bs-dismiss="modal"
        style={{
          backgroundColor: '#fff',
          color: '#666',
          border: `2px solid #666`,
          padding: '12px 20px',
          borderRadius: '6px',
          fontWeight: 'bold',
          fontSize: '14px'
        }}
        onClick={() => {
          navigate(baseToPath(getActiveBase()));
        }}
      >
        HOME
      </button>
        </div>
  </div>

    </div>
  </div>
</div>

{/* Advanced Filter Popup */}
<div
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
  <div className="modal-body" style={{ overflowY: 'auto', maxHeight: '80vh' }}>
 
          <div className="form-group">
       <div className="input-card p-0 rounded-2" style={{ 
         display: 'flex', 
         alignItems: 'center', 
         justifyContent: 'space-between', 
         width: '100%',  
         boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
         background: "#fff",
         paddingRight: "10px"
       }}>
         
         
         
        <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         // boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }}
     >     
       <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
     <img src={idcard} alt="" style={{ width: 20, height: 20 }} />  </span>
           <input
             type="number"
             name="id"
             value={filters.id}
             onChange={handleFilterChange}
             className="form-input m-0"
             placeholder="SEARCH BY RENT ID"
             style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
           />
         </div>
         {filters.id && (
           <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
         )}
       </div>
     </div>

     
     <div className="form-group " >
    <label style={{width:'100%'}}>

         <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >                    <span      style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}>
              <img src={minprice} alt="" width={20}/>
            </span>
        <div style={{ flex: "1" }}>
          <select
            name="minPrice"
            value={filters.minPrice || ""}
            onChange={handleFilterChange}
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
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("minPrice")}
                 style={{
                     cursor: "pointer",
                     border:"none",
                     padding: "12px",
                     background: "#fff",
                     borderRadius: "5px",
                     width: "100%",
                     textAlign: "left",
                     color: "grey",
                      position: "relative",
                     boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
     }}      
          >
       
            {filters.minPrice || "Select minPrice"}
               {filters.minPrice && (
             <GoCheckCircleFill
               style={{
                 position: "absolute",
                 right: "10px",
                 top: "50%",
                 transform: "translateY(-50%)",
                 color: "green",
               }}
             />
           )}
          </button>

          {renderDropdown("minPrice")}
        </div>
      </div>
    </label>
  </div>

    <div className="form-group " >
        <label style={{width:'100%'}}>
       <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >             <span        style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}>
<img src={maxprice} alt="" width={20}/></span>
         
            <div style={{ flex: "1" }}>
              <select
                name="maxPrice"
                value={filters.maxPrice || ""}
                onChange={handleFilterChange}
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
                className="m-0"
                type="button"
                onClick={() => toggleDropdown("maxPrice")}
                     style={{
                     cursor: "pointer",
                     border:"none",
                     padding: "12px",
                     background: "#fff",
                     borderRadius: "5px",
                     width: "100%",
                     textAlign: "left",
                     color: "grey",
                      position: "relative",
                     boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
     }}      
              >
             
                {filters.maxPrice || "Select maxPrice"}
                  {filters.maxPrice && (
             <GoCheckCircleFill
               style={{
                 position: "absolute",
                 right: "10px",
                 top: "50%",
                 transform: "translateY(-50%)",
                 color: "green",
               }}
             />
           )}
              </button>
    
              {renderDropdown("maxPrice")}
            </div>
          </div>
        </label>
      </div>
     {/* {currentStep >= 1 && ( */}
             <div>
     
       {/* Property Mode */}
       <div className="form-group">
         <label style={{ width: '100%'}}>
         {/* <label>Property Mode <span style={{ color: 'red' }}>* </span></label> */}
     
           <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >
       <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
      {fieldIcons.propertyMode}   </span>
     
       <div style={{ flex: "1" }}>
         <select
           name="propertyMode"
           value={advancedFilters.propertyMode || ""}
           onChange={handleAdvancedFilterChange}
           className="form-control"
           style={{ display: "none" }}
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
     onClick={() => toggleDropdown("propertyMode")}                 
                 style={{
             cursor: "pointer",
             padding: "12px",
             border:"none",
             background: "#fff",
             borderRadius: "5px",
             width: "100%",
             textAlign: "left",
             color: "grey",
             position: "relative",
             boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
           }}
         >
           {advancedFilters.propertyMode || "Select Property Mode"}
           {advancedFilters.propertyMode && (
             <GoCheckCircleFill
               style={{
                 position: "absolute",
                 right: "10px",
                 top: "50%",
                 transform: "translateY(-50%)",
                 color: "green",
               }}
             />
           )}
         </button>
     
         {renderDropdown("propertyMode")}
       </div>
     </div>
     
         </label>
       </div>
     
       <div className="form-group"> 
       <label style={{ width: '100%' }}>
         {/* <label>Property Type <span style={{ color: 'red' }}>* </span> </label> */}
     
           <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >           <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
                 {fieldIcons.propertyType} 
               </span>
           <div style={{ flex: "1" }}>
             <select
               name="propertyType"
               value={advancedFilters.propertyType || ""}
               onChange={handleAdvancedFilterChange}
               className="form-control"
               style={{ display: "none" }} 
             >
               <option value="">Select property Type</option>
               {dataList.propertyType?.map((option, index) => (
                 <option key={index} value={option}>
                   {option}
                 </option>
               ))}
             </select>
     
             <button
               className="m-0"
               type="button"
              onClick={() => toggleDropdown("propertyType")}                    
                  style={{
                 cursor: "pointer",
                 // border: "1px solid #4F4B7E",
                 border:"none",
                 padding: "12px",
                 background: "#fff",
                 borderRadius: "5px",
                 width: "100%",
                 textAlign: "left",
                 color: "grey",
                 position: "relative",
                 boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', 
               }}
             >
         
               {advancedFilters.propertyType || "Select Property Type"}
     
               {advancedFilters.propertyType && (
                 <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
               )}
             </button>
     
             {renderDropdown("propertyType")}
           </div>
         </div>
       </label>
     </div>
     
     {/* rentType */}
     <div className="form-group"> 
       <label style={{ width: '100%' }}>
         {/* <label>renty Type <span style={{ color: 'red' }}>* </span> </label> */}
     
           <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >           <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
                 {fieldIcons.rentType} 
               </span>
           <div style={{ flex: "1" }}>
             <select
               name="rentType"
               value={advancedFilters.rentType || ""}
               onChange={handleAdvancedFilterChange}
               className="form-control"
               style={{ display: "none" }} 
             >
               <option value="">Select renty Type</option>
               {dataList.rentType?.map((option, index) => (
                 <option key={index} value={option}>
                   {option}
                 </option>
               ))}
             </select>
     
             <button
               className="m-0"
               type="button"
               onClick={() => toggleDropdown("rentType")}
               style={{
                 cursor: "pointer",
                 // border: "1px solid #4F4B7E",
                 border:"none",
                 padding: "12px",
                 background: "#fff",
                 borderRadius: "5px",
                 width: "100%",
                 textAlign: "left",
                 color: "grey",
                 position: "relative",
                 boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', 
               }}
             >
         
               {advancedFilters.rentType || "Select rent Type"}
     
               {advancedFilters.rentType && (
                 <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
               )}
             </button>
     
             {renderDropdown("rentType")}
           </div>
         </div>
       </label>
     </div>
       </div>
     
     
     {/* {currentStep >= 2 && ( */}
             <div className="fieldcontent p-0">
       <h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}> Basic Property Info  </h4>             
     
       <div className="form-group">
         <label style={{ width: '100%'}}>
         {/* <label>Bedrooms </label> */}
     
           <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >       <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
                   {fieldIcons.bedrooms || <FaHome />}
                 </span> <div style={{ flex: "1" }}>
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
                 className="m-0"
                 type="button"
                 onClick={() => toggleDropdown("bedrooms")}
                 style={{
                   cursor: "pointer",
                   border:"none",
                   // border: "1px solid #4F4B7E",
                   padding: "12px",
                   background: "#fff",
                   borderRadius: "5px",
                   width: "100%",
                   textAlign: "left",
                   color: "grey",
                 position: "relative",border:"none",
                             boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
     }}
               >
                  
                 {advancedFilters.bedrooms || "Select bedrooms"}
      {advancedFilters.bedrooms && (
                 <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
               )}          </button>
     
               {renderDropdown("bedrooms")}
             </div>
           </div>
         </label>
       </div>
     
         {/* floorNo */}
         <div className="form-group">
         <label style={{ width: '100%'}}>
         {/* <label>FloorNo </label> */}
     
           <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >       <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
                   {fieldIcons.floorNo}
                 </span>  <div style={{ flex: "1" }}>
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
                 className="m-0"
                 type="button"
                 onClick={() => toggleDropdown("floorNo")}
                 style={{
                   cursor: "pointer",
                   border:"none",
                   // border: "1px solid #4F4B7E",
                   padding: "12px",
                   background: "#fff",
                   borderRadius: "5px",
                   width: "100%",
                   textAlign: "left",
                   color: "grey",
                 position: "relative",border:"none",
                             boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
     }}
               >
                 
                 {advancedFilters.floorNo || "Select floorNo"}
      {advancedFilters.floorNo && (
                 <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
               )}          </button>
     
               {renderDropdown("floorNo")}
             </div>
           </div>
         </label>
       </div>
     
       
         {/*attachedBathrooms */}
           <div className="form-group">
         <label style={{ width: '100%'}}>
         {/* <label>Attached Bathrooms</label> */}
     
           <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >       <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
                   {fieldIcons.attachedBathrooms || <FaHome />}
                 </span>   <div style={{ flex: "1" }}>
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
                 className="m-0"
                 type="button"
                 onClick={() => toggleDropdown("attachedBathrooms")}
                 style={{
                   cursor: "pointer",
                   // border: "1px solid #4F4B7E",
                   padding: "12px",
                   background: "#fff",
                   borderRadius: "5px",
                   width: "100%",
                   textAlign: "left",
                   color: "grey",
                 position: "relative",border:"none",
                             boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
     }}
               >
                
                 {advancedFilters.attachedBathrooms || "Select attachedBathrooms"}
      {advancedFilters.attachedBathrooms && (
                 <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
               )}          </button>
     
               {renderDropdown("attachedBathrooms")}
             </div>
           </div>
         </label>
       </div>
     
           {/* western */}
         <div className="form-group">
     
         <label style={{ width: '100%'}}>
         {/* <label>Western</label> */}
     
        <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >    
             <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
                   {fieldIcons.western || <FaHome />}
                 </span>    <div style={{ flex: "1" }}>
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
                 className="m-0"
                 type="button"
                 onClick={() => toggleDropdown("western")}
                 style={{
                   cursor: "pointer",
                   // border: "1px solid #4F4B7E",
                   padding: "12px",
                   background: "#fff",
                   borderRadius: "5px",
                   width: "100%",
                   textAlign: "left",
                   color: "grey",
                 position: "relative",border:"none",
                             boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
     }}
               >
              
                 {advancedFilters.western || "Select western"}
      {advancedFilters.western && (
                 <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
               )}          </button>
     
               {renderDropdown("western")}
             </div>
           </div>
         </label>
       </div>
         {/* carParking */}
     
         <div className="form-group">
         <label style={{ width: '100%'}}>
         {/* <label>Car Parking</label> */}
     
           <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >        <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
                   {fieldIcons.carParking || <FaHome />}
                 </span>    <div style={{ flex: "1" }}>
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
                 className="m-0"
                 type="button"
                 onClick={() => toggleDropdown("carParking")}
                 style={{
                   cursor: "pointer",
                   // border: "1px solid #4F4B7E",
                   padding: "12px",
                   background: "#fff",
                   borderRadius: "5px",
                   width: "100%",
                   textAlign: "left",
                   color: "grey",
                 position: "relative",border:"none",
                             boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
     }}
               >
              
                 {advancedFilters.carParking || "Select carParking"}
      {advancedFilters.carParking && (
                 <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
               )}          </button>
     
               {renderDropdown("carParking")}
             </div>
           </div>
         </label>
       </div>
         {/*lift */}
         <div className="form-group">
         <label style={{ width: '100%'}}>
           {/* <label>Lift</label> */}
           <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >      <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
                   {fieldIcons.lift || <FaHome />}
                 </span>    <div style={{ flex: "1" }}>
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
                 className="m-0"
                 type="button"
                 onClick={() => toggleDropdown("lift")}
                 style={{
                   cursor: "pointer",
                   // border: "1px solid #4F4B7E",
                   padding: "12px",
                   background: "#fff",
                   borderRadius: "5px",
                   width: "100%",
                   textAlign: "left",
                   color: "grey",
                 position: "relative",border:"none",
                             boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
     }}
               >
                
                 {advancedFilters.lift || "Select lift"}
      {advancedFilters.lift && (
                 <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
               )}          </button>
     
               {renderDropdown("lift")}
             </div>
           </div>
         </label>
       </div>
   
         {/* facing */}
         <div className="form-group">
     
         <label style={{ width: '100%'}}>
         {/* <label>Facing</label> */}
     
           <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >       <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
                   {fieldIcons.facing || <FaHome />}
                 </span>  <div style={{ flex: "1" }}>
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
                 className="m-0"
                 type="button"
                 onClick={() => toggleDropdown("facing")}
                 style={{
                   cursor: "pointer",
                   // border: "1px solid #4F4B7E",
                   padding: "12px",
                   background: "#fff",
                   borderRadius: "5px",
                   width: "100%",
                   textAlign: "left",
                   color: "grey",
                 position: "relative",border:"none",
                             boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
     }}
               >
                 
                 {advancedFilters.facing || "Select facing"}
      {advancedFilters.facing && (
                 <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
               )}          </button>
     
               {renderDropdown("facing")}
             </div>
           </div>
         </label>
       </div>
     {/* wheelChairAvailable */}
       {/* <div className="form-group">
         <label style={{width:"100%"}}>
     
           <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >       <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
                   {fieldIcons.wheelChairAvailable || <FaHome />}
                 </span>    <div style={{ flex: "1" }}>
               <select
                 name="wheelChairAvailable"
                 value={advancedFilters.wheelChairAvailable || ""}
                 onChange={handleAdvancedFilterChange}
                 className="form-control"
                 style={{ display: "none" }} // Hide the default <select> dropdown
               >
                 <option value="">Select wheelChairAvailable</option>
                 {dataList.wheelChairAvailable?.map((option, index) => (
                   <option key={index} value={option}>
                     {option}
                   </option>
                 ))}
               </select>
     
               <button
                 className="m-0"
                 type="button"
                 onClick={() => toggleDropdown("wheelChairAvailable")}
                 style={{
                   cursor: "pointer",
                   padding: "12px",
                   background: "#fff",
                   borderRadius: "5px",
                   width: "100%",
                   textAlign: "left",
                   color: "grey",
                 position: "relative",border:"none",
                             boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
     }}
               >
               
                 {advancedFilters.wheelChairAvailable || "Select wheelChairAvailable"}
      {advancedFilters.wheelChairAvailable && (
                 <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
               )}          </button>
     
               {renderDropdown("wheelChairAvailable")}
             </div>
           </div>
         </label>
       </div> */}
     
        {/* postedBy */}
        <div className="form-group">
         <label style={{ width: '100%'}}>
         {/* <label>PostedBy <span style={{ color: 'red' }}>* </span> </label> */}
     
           <div 
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
       }} className="rounded-2"
     >       <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
                   {fieldIcons.postedBy} 
                 </span>   <div style={{ flex: "1" }}>
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
                 className="m-0"
                 type="button"
                 onClick={() => toggleDropdown("postedBy")}
                 style={{
                   cursor: "pointer",
                   // border: "1px solid #4F4B7E",
                   padding: "12px",
                   background: "#fff",
                   borderRadius: "5px",
                   width: "100%",
                   textAlign: "left",
                   color: "grey",
                 position: "relative",border:"none",
                             boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
     }}
               >
                
                 {advancedFilters.postedBy || "Select postedBy"}
      {advancedFilters.postedBy && (
                 <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
               )}          </button>
     
               {renderDropdown("postedBy")}
             </div>
           </div>
         </label>
       </div>
       </div>
      {/* )} */}
     
     

       
     
     {/* {currentStep >= 4 && ( */}
             <div className="fieldcontent p-0">
       
       {/* State */}
     
     <div className="form-group">
       {/* <label>State:</label> */}
       <div className="input-card p-0 rounded-2" style={{ 
         display: 'flex', 
         alignItems: 'center', 
         justifyContent: 'space-between', 
         width: '100%',  
         boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
         background: "#fff",
         paddingRight: "10px"
       }}>
         
        <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
       }}
     > 
          
          <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
          <MdLocationCity className="input-icon" style={{color: '#4F4B7E',}} />
       </span>
       <input
           type="text"
           name="state"
           value={advancedFilters.state}
           onChange={handleAdvancedFilterChange}
           className="form-input m-0"
           placeholder="State"
             style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
         />
       </div>
        {advancedFilters.state && (
           <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
         )}
     </div></div>
       {/* Area */}
     
     <div className="form-group" style={{ position: "relative" }}>
       {/* <label>Area:</label> */}
       <div className="input-card p-0 rounded-2" style={{ 
         display: 'flex', 
         alignItems: 'center', 
         justifyContent: 'space-between', 
         width: '100%',  
         boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
         background: "#fff",
         paddingRight: "10px"
       }}>
         
       
         <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
       }}
     > 
          <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
          {fieldIcons.area || <FaHome />} 
       </span>
       <input
           type="text"
           name="area"
           value={advancedFilters.area}
           onChange={handleAdvancedAreaInputChange}
           onFocus={() => {
             if (advancedFilters.area && areaSuggestions.length > 0) {
               setShowAreaSuggestions(true);
             }
           }}
           onBlur={() => {
             setTimeout(() => setShowAreaSuggestions(false), 200);
           }}
           className="form-input m-0"
           placeholder="Area"
             style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
         />
       </div>
        {advancedFilters.area && (
           <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
         )}
     </div>

       {/* Area Suggestions Dropdown */}
       {showAreaSuggestions && areaSuggestions.length > 0 && (
         <div
           style={{
             position: "absolute",
             top: "100%",
             left: 0,
             right: 0,
             backgroundColor: "#fff",
             border: "1px solid #4F4B7E",
             borderRadius: "8px",
             maxHeight: "200px",
             overflowY: "auto",
             zIndex: 1000,
             boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
           }}
         >
           {areaSuggestions.map((area, index) => (
             <div
               key={index}
               onClick={() => handleAdvancedAreaSelect(area)}
               style={{
                 padding: "10px 15px",
                 cursor: "pointer",
                 borderBottom: index < areaSuggestions.length - 1 ? "1px solid #eee" : "none",
                 display: "flex",
                 justifyContent: "space-between",
                 alignItems: "center",
               }}
               onMouseEnter={(e) => e.target.style.backgroundColor = "#f0f0f0"}
               onMouseLeave={(e) => e.target.style.backgroundColor = "#fff"}
             >
               <span style={{ color: "#333", fontWeight: 500 }}>{area}</span>
               <span style={{ color: "#4F4B7E", fontSize: "12px" }}>{areaPincodeMap[area]}</span>
             </div>
           ))}
         </div>
       )}
     </div>
       {/* Pincode */}
     
     <div className="form-group">
       {/* <label>Pincode:</label> */}
       <div className="input-card p-0 rounded-2" style={{ 
         display: 'flex', 
         alignItems: 'center', 
         justifyContent: 'space-between', 
         width: '100%',  
         boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
         background: "#fff",
         paddingRight: "10px"
       }}>
         
       
         <div
       style={{
         display: "flex",
         alignItems: "stretch", // <- Stretch children vertically
         width: "100%",
       }}
     > 
          <span
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "0 14px",
           borderRight: "1px solid #4F4B7E",
           background: "#fff", // optional
         }}
       >
          {fieldIcons.pinCode || <FaHome />} 
       </span>
       <input
           type="text"
           name="pinCode"
           value={advancedFilters.pinCode}
           onChange={handleAdvancedFilterChange}
           className="form-input m-0"
           placeholder="Pincode"
             style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
         />
       </div>
        {advancedFilters.pinCode && (
           <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
         )}
     </div></div>
     
       </div>
     {/* )}  */}
     
     
     
     {/* {currentStep >= 5 && ( */}
             <div className="fieldcontent p-0" >
     
     
     <h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}>  Mobile Number   </h4>             
     
     <div className="form-group">
     {/* <label>Phone Number:</label> */}
     
       <div className="input-card p-0 rounded-2" style={{ 
         display: 'flex', 
         alignItems: 'center', 
         justifyContent: 'space-between', 
         width: '100%',  
         boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
         background: "#fff",
         paddingRight: "10px"
       }}>
         
       
       <img src={phone} alt="" style={{ width: 20, height: 20 ,marginLeft:"10px"}} />
          {/* <FaPhone className="input-icon" style={{ color: '#4F4B7E', marginLeft:"10px"}} /> */}
         

     
     
         <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
     
      
       <input
           type="number"
           name="phoneNumber"
           value={advancedFilters.phoneNumber}
           onChange={handleAdvancedFilterChange}
           className="form-input m-0"
           placeholder="Phone Number"
             style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
         />
       </div>
 {advancedFilters.phoneNumber && (
           <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
         )}         </div>
     </div>
  
       </div>
      {/* )}  */}
    <div className="text-center mt-3 ">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          {/* Clear Button */}
          <button
            type="button"
            style={{
              flex: 1,
              backgroundColor: hoverClear ? '#dc3545' : 'transparent',
              color: hoverClear ? '#fff' : '#dc3545',
              border: `1px solid #dc3545`,
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              pointerEvents: 'auto',
            }}
            onMouseEnter={() => setHoverClear(true)}
            onMouseLeave={() => setHoverClear(false)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setAdvancedFilters({
                propertyMode: '', propertyType: '', minPrice: '', maxPrice: '', propertyAge: '', bankLoan: '',
                negotiation: '', length: '', breadth: '', totalArea: '', minTotalArea: '', ownership: '', bedrooms: '',
                minBedrooms: '', kitchen: '', kitchenType: '', balconies: '', floorNo: '', areaUnit: '', propertyApproved: '',
                facing: '', postedBy: '', furnished: '', lift: '', attachedBathrooms: '', minAttachedBathrooms: '',
                western: '', minWestern: '', rentType: '', carParking: '', city: '', phoneNumber: '', state: '', wheelChairAvailable: ''
              });
              setFilters({
                id: '',
                minPrice: '',
                maxPrice: '',
                propertyMode: '',
                propertyType: '',
                bhk: '',
                facing: '',
                bedrooms: '',
                floorNo: '',
                city: '',
                state: '',
              });
              setDropdownState({ activeDropdown: null, filterText: '', position: { top: 0, left: 0 } });
              // Scroll the modal body to top
              setTimeout(() => {
                const modalBody = document.querySelector('#advancedFilterPopup .modal-body');
                const modalDialog = document.querySelector('#advancedFilterPopup .modal-dialog');
                if (modalBody) {
                  modalBody.scrollTop = 0;
                }
                if (modalDialog) {
                  modalDialog.scrollTop = 0;
                }
              }, 100);
            }}
          >
            CLEAR
          </button>

          {/* Search Button */}
          <button
            data-bs-dismiss="modal"
            type="button"
            style={{
              flex: 1,
              backgroundColor: hoverSearch ? '#28a745' : '#ffffff',
              color: hoverSearch ? '#ffffff' : '#28a745',
              border: '1px solid #28a745',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={() => setHoverSearch(true)}
            onMouseLeave={() => setHoverSearch(false)}
            onClick={() => setSearchPerformed(true)}
          >
            SEARCH
          </button>
        </div>
      <button
          type="button"
          className="btn w-100 mt-3"
          style={{
            backgroundColor: hoverAdvance ? '#4F4B7E' : 'transparent',
            color: hoverAdvance ? '#fff' : '#4F4B7E',
            border: `1px solid #4F4B7E`,
          }}
          onMouseEnter={() => setHoverAdvance(true)}
          onMouseLeave={() => setHoverAdvance(false)}          data-bs-toggle="modal"
          data-bs-target="#filterPopup" // Nested modal
          >
          GO TO SIMPLE SEARCH
        </button>
        <button 
        style={{color:"#4F4B7E"}}
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



          {/* No Data Modal - Show when filters applied but no results */}
          {showNoDataModal && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
              }}
            >
              <div
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '15px',
                  padding: '30px',
                  width: '90%',
                  maxWidth: '400px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
              >
                <div className="text-center mb-3">
                  <img src={NoData} alt="No data" width={80} />
                </div>
                <h5 className="text-center mb-3" style={{ color: '#4F4B7E', fontWeight: 600 }}>
                  No Properties Found
                </h5>
                <p className="text-center text-muted mb-4" style={{ fontSize: '14px' }}>
                  No properties match your search criteria. Would you like to continue searching with different filters?
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <button
                    type="button"
                    className="btn rounded-2 px-4"
                    style={{ backgroundColor: '#4F4B7E', color: '#fff', fontWeight: 500 }}
                    onClick={() => {
                      setShowNoDataModal(false);
                      setSearchPerformed(false);  // Reset search flag
                      // Trigger filter popup after modal closes
                      setTimeout(() => {
                        if (filterPopupTriggerRef.current) {
                          filterPopupTriggerRef.current.click();
                        }
                      }, 300);
                    }}
                  >
                    Yes, Search Again
                  </button>
                  <button
                    type="button"
                    className="btn rounded-2 px-4"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#4F4B7E',
                      border: '1px solid #4F4B7E',
                      fontWeight: 500,
                    }}
                    onClick={() => {
                      setShowNoDataModal(false);
                      setSearchPerformed(false);
                      setFilters({ 
                        id: '', 
                        minPrice: '', 
                        maxPrice: '', 
                        propertyMode: '', 
                        city: '' ,
                        propertyType: '',
                        rentType: '',
                        bedrooms: '',
                        floorNo: '',
                        state:""
                      });
                      setAdvancedFilters({
                        propertyMode: '', propertyType: '', minPrice: '', maxPrice: '', propertyAge: '', bankLoan: '',
                        negotiation: '', length: '', breadth: '', totalArea: '', minTotalArea: '', ownership: '', bedrooms: '',
                        minBedrooms: '', kitchen: '', kitchenType: '', balconies: '', floorNo: '', areaUnit: '', propertyApproved: '',
                        facing: '', postedBy: '', furnished: '', lift: '', attachedBathrooms: '', minAttachedBathrooms: '',
                        western: '', minWestern: '', rentType: '', carParking: '', city: '', phoneNumber: '', state:""
                      });
                      window.scrollTo(0, 0);
                    }}
                  >
                    No, Go Home
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="w-100">
            <div style={{ overflowY: 'auto', fontFamily:"Inter, sans-serif" }}>

            {/* Display filter results if searched, otherwise show original data */}
            {horizontalFilterSearched ? (
              horizontalFilterLoading ? (
                <div
                  className="text-center my-4"
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                  }}
                >
                  <span className="spinner-border text-primary" role="status" />
                  <p className="mt-2">Searching properties...</p>
                </div>
              ) : horizontalFilterResults.length === 0 ? (
                <div
                  className="text-center my-4"
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <img src={NoData} alt="No data" width={100} />
                  <p style={{ color: '#666', fontSize: '16px', marginTop: '10px' }}>No Match Found</p>
                </div>
              ) : (
                <div className="col-12">
                  {horizontalFilterResults.map((property, index) => (
                    <div 
                      key={property._id}
                      className="card mb-3 shadow rounded-4 col-12"
                      style={{ width: '100%', height: 'auto', background: '#F9F9F9', overflow:'hidden', cursor: 'pointer' }}
                      onClick={() => handleCardClick(property.rentId, property.phoneNumber, property)}
                    >
                      <div className="row g-0 align-items-stretch">
                        <div className="col-md-4 col-4 d-flex flex-column align-items-center">
                          <div style={{ position: "relative", width: "100%",height: '100%', }}>
                            {property.isFeatured && (
                              <span
                                className="m-0 ps-1 pe-2"
                                style={{
                                  position: "absolute",
                                  top: "0px",
                                  right: "0px",
                                  fontSize: "12px",
                                  background: "linear-gradient(to right,rgba(255, 200, 0, 0.91),rgb(251, 182, 6))",
                                  color: "black",
                                  cursor: "pointer",
                                  borderRadius: "0px 0px 0px 15px",
                                  zIndex: 2,
                                }}
                              >
                                <MdOutlineStarOutline /> Featured
                              </span>
                            )}
                            <img
                              src={
                                property.photos && property.photos.length > 0
                                  ? `https://rentpondy.com/PPC/${property.photos[0].replace(/\\/g, "/").replace(/^\/+/, "")}`
                                  : pic
                              }
                              alt={property.rentId}
                              className="img-fluid"
                              style={{
                                objectFit: "cover",

                                objectPosition: "center",
                                width: "100%",
                                height: "160px",
                                borderRadius: "15px",
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-md-8 col-8 " style={{paddingLeft:"10px", paddingTop:"7px" , background: clickedCar.includes(property.rentId) ? "#ffffff" : "#F9F9F9",}}>
                          <p className="m-0" style={{ color:'#5E5E5E' , fontWeight:500 , fontSize:"13px"}}>{property.propertyMode ? property.propertyMode.charAt(0).toUpperCase() + property.propertyMode.slice(1) : 'N/A'}</p>
                          <p className="fw-bold m-0 " style={{ color:clickedCar.includes(property.rentId) ? "#F76F00" : "#000000", fontSize:"15px" }}>{property.propertyType ? property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) : 'N/A'}</p>
                          <p className="m-0" style={{ color: "#5E5E5E", fontWeight: 500, fontSize: "13px" }}>
                            {property.area || 'N/A'}, {property.city || ''}, {property.state || ''}
                          </p>
                          <div style={{marginTop: '8px'}}>
                            <span style={{ fontSize:'13px', color:'#5E5E5E', fontWeight: 500, marginRight: '12px' }}>{property.bedrooms || 'N/A'} BHK</span>
                            <span style={{ fontSize:'13px', color:'#5E5E5E' , fontWeight: 500 }}>{property.totalArea || 'N/A'} {property.areaUnit || ''}</span>
                          </div>
                          <h6 className="m-0 mt-2">
                            <span style={{ fontSize: '15px', color: '#4F4B7E', fontWeight: 600 }}>
                              {property.callForRent ? 'Call Owner' : <>₹ {typeof property.rentalAmount === 'string' && property.rentalAmount === 'On Demand' ? 'On Demand' : formatPrice(property.rentalAmount) || 'N/A'}</>}
                            </span>
                            <span style={{ color: '#4F4B7E', fontSize: '12px', marginLeft: "8px" }}>/ {property.rentType || "N/A"}</span>
                          </h6>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : filterCardSearched ? (
              filterCardLoading ? (
                <div
                  className="text-center my-4"
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                  }}
                >
                  <span className="spinner-border text-primary" role="status" />
                  <p className="mt-2">Searching properties...</p>
                </div>
              ) : filterCardResults.length === 0 ? (
                <div
                  className="text-center my-4"
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <img src={NoData} alt="No data" width={100} />
                  <p style={{ color: '#666', fontSize: '16px', marginTop: '10px' }}>No Match Found</p>
                </div>
              ) : (
                <div className="col-12">
                  {filterCardResults.map((property, index) => (
                    <div 
                      key={property._id}
                      className="card mb-3 shadow rounded-4 col-12"
                      style={{ width: '100%', height: 'auto', background: '#F9F9F9', overflow:'hidden', cursor: 'pointer' }}
                      onClick={() => handleCardClick(property.rentId, property.phoneNumber, property)}
                    >
                      <div className="row g-0 align-items-stretch">
                        <div className="col-md-4 col-4 d-flex flex-column align-items-center">
                          <div style={{ position: "relative", width: "100%",height: '100%', }}>
                            {property.isFeatured && (
                              <span
                                className="m-0 ps-1 pe-2"
                                style={{
                                  position: "absolute",
                                  top: "0px",
                                  right: "0px",
                                  fontSize: "12px",
                                  background: "linear-gradient(to right,rgba(255, 200, 0, 0.91),rgb(251, 182, 6))",
                                  color: "black",
                                  cursor: "pointer",
                                  borderRadius: "0px 0px 0px 15px",
                                  zIndex: 2,
                                }}
                              >
                                <MdOutlineStarOutline /> Featured
                              </span>
                            )}
                            <img
                              src={
                                property.photos && property.photos.length > 0
                                  ? `https://rentpondy.com/PPC/${property.photos[0].replace(/\\/g, "/").replace(/^\/+/, "")}`
                                  : pic
                              }
                              alt={property.rentId}
                              className="img-fluid"
                              style={{
                                objectFit: "cover",
                                objectPosition: "center",
                                width: "100%",
                                height: "160px",
                                borderRadius: "15px",
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-md-8 col-8 " style={{paddingLeft:"10px", paddingTop:"7px" , background: clickedCar.includes(property.rentId) ? "#ffffff" : "#F9F9F9",}}>
                          <p className="m-0" style={{ color:'#5E5E5E' , fontWeight:500 , fontSize:"13px"}}>{property.propertyMode ? property.propertyMode.charAt(0).toUpperCase() + property.propertyMode.slice(1) : 'N/A'}</p>
                          <p className="fw-bold m-0 " style={{ color:clickedCar.includes(property.rentId) ? "#F76F00" : "#000000", fontSize:"15px" }}>{property.propertyType ? property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) : 'N/A'}</p>
                          <p className="m-0" style={{ color: "#5E5E5E", fontWeight: 500, fontSize: "13px" }}>
                            {property.area || 'N/A'}, {property.city || ''}, {property.state || ''}
                          </p>
                          <div style={{marginTop: '8px'}}>
                            <span style={{ fontSize:'13px', color:'#5E5E5E', fontWeight: 500, marginRight: '12px' }}>{property.bedrooms || 'N/A'} BHK</span>
                            <span style={{ fontSize:'13px', color:'#5E5E5E' , fontWeight: 500 }}>{property.totalArea || 'N/A'} {property.areaUnit || ''}</span>
                          </div>
                          <h6 className="m-0 mt-2">
                            <span style={{ fontSize: '15px', color: '#4F4B7E', fontWeight: 600 }}>
                              {property.callForRent ? 'Call Owner' : <>₹ {typeof property.rentalAmount === 'string' && property.rentalAmount === 'On Demand' ? 'On Demand' : formatPrice(property.rentalAmount) || 'N/A'}</>}
                            </span>
                            <span style={{ color: '#4F4B7E', fontSize: '12px', marginLeft: "8px" }}>/ {property.rentType || "N/A"}</span>
                          </h6>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : loading ? (
  <div
    className="text-center my-4"
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
    }}
  >
    <span className="spinner-border text-primary" role="status" />
    <p className="mt-2">Loading properties...</p>
  </div>
) : mergedData.length === 0 ? (
  <>
    <div
      className="text-center my-4"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <img src={NoData} alt="No data" width={100} />
      <p>No properties found.</p>
    </div>
  </>
) : (
  <div className="col-12">
    {mergedData.map((property, index) => {
      if (property.type === 'upload') {
        return (
          <div key={`upload-${property._id}-${index}`} className="col-12 p-0 mb-3">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <img
                // src={`${process.env.REACT_APP_IMAGE_URL}/${property.img}`}
                                  src={`https://rentpondy.com/PPC/${property.img.replace(/\\/g, '/')}`}

                alt="Ad"
 style={{
                    height: "180px",
                    width: '100%',
                    objectFit: 'fill',
                    borderRadius: '15px',
                    boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
                    cursor: 'pointer'
                  }}              />
            </div>
          </div>
        );
      } else {
        return (
        <div 
          key={property._id}
          className="card mb-3 shadow rounded-4 col-12"
          style={{ width: '100%', height: 'auto', background: '#F9F9F9', overflow:'hidden' }}
          onClick={() => handleCardClick(property.rentId, property.phoneNumber, property)}
        >
           <div className="row g-0 align-items-stretch">
<div className="col-md-4 col-4 d-flex flex-column align-items-center">

<div style={{ position: "relative", width: "100%",height: '100%', }}>
{property.isFeatured && (
  <span
    className="m-0 ps-1 pe-2"
    style={{
      position: "absolute",
      top: "0px",
      right: "0px",
      fontSize: "12px",
      background: "linear-gradient(to right,rgba(255, 200, 0, 0.91),rgb(251, 182, 6))",
      color: "black",
      cursor: "pointer",
      borderRadius: "0px 0px 0px 15px",
      zIndex: 2,
    }}
  >
    <MdOutlineStarOutline /> Featured
  </span>
)}


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
  className="img-fluid"
  style={{
    objectFit: "cover",
    objectPosition: "center",
    width: "100%",
    height: "160px",
    borderRadius: "15px",
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
                             
<span className="d-flex justify-content-center align-items-center" style={{ color:'#fff', background:`url(${myImage}) no-repeat center center`, backgroundSize:"cover" ,fontSize:'12px', width:'50px' }}>
          <FaCamera className="me-1"/> {imageCounts[property.rentId] || 0}
          </span>
          <span className="d-flex justify-content-center align-items-center" style={{ color:'#fff', background:`url(${myImage1}) no-repeat center center`, backgroundSize:"cover" ,fontSize:'12px', width:'50px' }}>
          <FaEye className="me-1" />{property.views}
          </span>
</div>
</div>
</div>
         <div className="col-md-8 col-8 " style={{paddingLeft:"10px", paddingTop:"7px" , background: clickedCar.includes(property.rentId) ? "#ffffff" : "#F9F9F9",}}>
            <div className="d-flex justify-content-between"><p className="m-0" style={{ color:'#5E5E5E' , fontWeight:500 , fontSize:"13px"}}>{property.propertyMode
  ? property.propertyMode.charAt(0).toUpperCase() + property.propertyMode.slice(1)
  : 'N/A'} 
</p>  
<p className="m-0 pe-5">{property.locationCoordinates ? <img src={maplocation} alt="" width={15} /> : ""}</p>
          </div>
         <p className="fw-bold m-0 " style={{ color:clickedCar.includes(property.rentId) ? "#F76F00" : "#000000", fontSize:"15px" }}>{property.propertyType 
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
                 <img src={Floorr} alt="" width={12} className="me-2"/>
                 <span style={{ fontSize:'13px', color:'#5E5E5E' , fontWeight:500 }}>{property.floorNo
  ? property.floorNo.charAt(0).toUpperCase() + property.floorNo.slice(1)
  : 'N/A'}

                  
                 </span>
               </div>
               <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
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
                                       <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
                 <img src={calendar} alt="" width={12} className="me-2" />
                 <span style={{ fontSize:'13px', color:'#5E5E5E', fontWeight: 500 }}>
                   {property.createdAt ? ` ${new Date(property.createdAt).toLocaleDateString('en-IN', {
                       year: 'numeric',
                       month: 'short',
                       day: 'numeric'
                     })}` : 'N/A'}
                 </span>
               </div>
               <div className="col-12 d-flex flex-col align-items-center mt-1 mb-1 ps-1">
                <h6 className="m-0">
       
<span
  style={{
    fontSize: '15px',
    color: property.rentalAmount === 'On Demand' ? '#8C3C2F' : '#4F4B7E', 
    fontWeight: 600,
    letterSpacing: '1px',
  }}
>
  {property.callForRent ? null : <img src={indianprice} alt="" width={8} className="me-2" />}
  {property.callForRent
    ? 'Call Owner'
    : typeof property.rentalAmount === 'string' && property.rentalAmount === 'On Demand'
      ? 'On Demand'
      : property.rentalAmount
        ? formatPrice(property.rentalAmount)
        : 'N/A'}
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

        </div>
        );
      }
    })}
  </div>
)}
            </div>
          </div>

        </Col>
      </Row>

      {/* Tenant Assistance Modal */}
      <TenantAssistanceModal
        isOpen={showTenantAssistanceModal}
        onClose={() => setShowTenantAssistanceModal(false)}
        filterData={capturedFilterData}
        phoneNumber={phoneNumber}
      />

      {/* Tenant Search Modal */}
      <TenantSearchModal
        isOpen={isTenantSearchOpen}
        onClose={() => setIsTenantSearchOpen(false)}
      />

    </Container>
  );
};

export default AllProperty;



