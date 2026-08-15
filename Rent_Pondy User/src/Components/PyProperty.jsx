

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
// import totalarea from '../Assets/Total Area-01.png'
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
// const PyProperty = () => {
//     const [imageCounts, setImageCounts] = useState({}); // Store image count for each property
  
//   const [properties, setProperties] = useState([]);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();
//     const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
//     const [clickedProperties, setclickedProperties] = useState([]);
  
//     const [phoneNumber, setPhoneNumber] = useState(storedPhoneNumber);
//   useEffect(() => {
//     const recordDashboardView = async () => {
//       try {
//         await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
//           phoneNumber: phoneNumber,
//           viewedFile: "Py Property",
//           viewTime: new Date().toISOString(),
//         });
//       } catch (err) {
//       }
//     };
  
//     if (phoneNumber) {
//       recordDashboardView();
//     }
//   }, [phoneNumber]);

//   const formatIndianNumber = (x) => {
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



//   // useEffect(() => {
//   //   const fetchProperties = async () => {
//   //     setLoading(true);
//   //     try {
//   //       const [pondyRes, featuredRes] = await Promise.all([
//   //         axios.get(`${process.env.REACT_APP_API_URL}/fetch-Pudhucherry-properties-on-demand-rent`),
//   //         axios.get(`${process.env.REACT_APP_API_URL}/fetch-featured-properties-on-demand-rent`)
//   //       ]);

//   //       const pondy = pondyRes.data.data || [];
//   //       const featured = featuredRes.data.properties?.map((property) => ({
//   //         ...property,
//   //         isFeatured: true
//   //       })) || [];

//   //       const combined = [...pondy, ...featured];
//   //       const sorted = combined.sort(
//   //         (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
//   //       );

//   //       setProperties(sorted);
//   //       // setError("");
//   //     } catch (err) {
//   //       console.error(err);
//   //       // setError("Failed to fetch Pondy or featured properties.");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchProperties();
//   // }, []);

// useEffect(() => {
//   const fetchProperties = async () => {
//     setLoading(true);
//     try {
//       const [pondyRes, featuredRes] = await Promise.all([
//         axios.get(`${process.env.REACT_APP_API_URL}/fetch-Pudhucherry-properties-on-demand-rent`),
//         axios.get(`${process.env.REACT_APP_API_URL}/fetch-featured-properties-on-demand-rent`)
//       ]);

//       const pondy = pondyRes.data.data || [];
//       const featuredRaw = featuredRes.data.properties || [];

//       // Mark featured with isFeatured: true
//       const featured = featuredRaw.map(property => ({
//         ...property,
//         isFeatured: true
//       }));

//       // Create a Set of rentIds in the featured list for fast lookup
//       const featuredRentIds = new Set(featuredRaw.map(prop => prop.rentId));

//       // Filter pondy list: skip if rentId exists in featured
//       const filteredPondy = pondy.filter(prop => !featuredRentIds.has(prop.rentId));

//       // Merge and sort
//       const combined = [...filteredPondy, ...featured];
//       const sorted = combined.sort(
//         (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
//       );

//       setProperties(sorted);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchProperties();
// }, []);

//   const handleCardClick = (rentId, phoneNumber) => {
//       if (!clickedProperties.includes(rentId)) {
//     const updatedClickedProperties = [...clickedProperties, rentId];
//     setclickedProperties(updatedClickedProperties);
//     localStorage.setItem('clickedProperties', JSON.stringify(updatedClickedProperties));
//   }
//     // navigate("/detail", { state: { rentId, phoneNumber } });
//     navigate(`/detail/${rentId}`, { state: {phoneNumber } });

//   };
// useEffect(() => {
//   const stored = JSON.parse(localStorage.getItem('clickedProperties')) || [];
//   setclickedProperties(stored);
// }, []);


//   const fetchImageCount = async (rentId) => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/uploads-count`, {
//         params: { rentId },
//       });
//       return response.data.uploadedImagesCount || 0;
//     } catch (error) {
//       return 0;
//     }
//   };
  
//       // Fetch image counts for all properties
//       useEffect(() => {
//         const fetchAllImageCounts = async () => {
//           const counts = {};
//           await Promise.all(
//             properties.map(async (property) => {
//               const count = await fetchImageCount(property.rentId);
//               counts[property.rentId] = count;
//             })
//           );
//           setImageCounts(counts);
//         };
    
//         if (properties.length > 0) {
//           fetchAllImageCounts();
//         }
//       }, [properties]);
//   const [filters, setFilters] = useState({ 
//     id: '', 
//     minPrice: '', 
//     maxPrice: '', 
//     propertyMode: '', 
//     city: '' ,
//      propertyType: '',
//       rentType: '',
//       bedrooms: '',
//      floorNo: '',
//      state:""
//   });
//         const [hoverSearch, setHoverSearch] = useState(false);
//         const [hoverAdvance, setHoverAdvance] = useState(false);
      
//         const [advancedFilters, setAdvancedFilters] = useState({
//           propertyMode: '', propertyType: '', minPrice: '', maxPrice: '', propertyAge: '', bankLoan: '',
//           negotiation: '', length: '', breadth: '', totalArea: '', minTotalArea: '', ownership: '', bedrooms: '',
//           minBedrooms: '', kitchen: '', kitchenType: '', balconies: '', floorNo: '', areaUnit: '', propertyApproved: '',
//           facing: '', postedBy: '', furnished: '', lift: '', attachedBathrooms: '', minAttachedBathrooms: '',
//           western: '', minWestern: '', rentType: '', carParking: '', city: '', phoneNumber: '', state:""
//         });
//           const activeFilterCount = [
//           ...Object.values(filters),
//           ...Object.values(advancedFilters)
//         ].filter((val) => val !== '').length;
      
//         const shouldShowButton = activeFilterCount >= 2;
      

//         const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
//         const [searchQuery, setSearchQuery] = useState('');
      
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
//           const [dropdownState, setDropdownState] = useState({
//             activeDropdown: null,
//             filterText: "",
//             position: { top: 0, left: 0 },
//           });
//         const toggleDropdown = (field) => {
//           setDropdownState((prevState) => ({
//             activeDropdown: prevState.activeDropdown === field ? null : field,
//             filterText: "",
//           }));
//         };

//         const [dataList, setDataList] = useState({});
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
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prevState) => ({ ...prevState, [name]: value }));

//     // setFilters({ ...filters, [name]: value });
//     setDropdownState((prevState) => ({ ...prevState, filterText: e.target.value }));

//   };
//     const handleAdvancedFilterChange = (e) => {
//       const { name, value } = e.target;
//       setAdvancedFilters((prevState) => ({ ...prevState, [name]: value }));
//       setDropdownState((prevState) => ({ ...prevState, filterText: value }));
//     };
//   const fieldLabels = {
//     propertyMode: "Property Mode",
//     propertyType: "Property Type",
//       rentType: "rent Type",
//     rentalAmount: "rental Amount",
//     propertyAge: "Property Age",
//     bankLoan: "Bank Loan",
//     negotiation: "Negotiation",
//       securityDeposit: "security Deposit",
//     length: "Length",
//     breadth: "Breadth",
//     totalArea: "Total Area",
//     ownership: "Ownership",
//     bedrooms: "Bedrooms",
//     kitchen: "Kitchen",
//       kitchen: "Kitchen",
//     availableDate: "available Date",
//     familyMembers: "family Members",
//     foodHabit: "food Habit",
//     jobType: "job Type",
//     petAllowed: "pet Allowed",
//       wheelChairAvailable:"wheel Chair Available",
//     kitchenType: "Kitchen Type",
//     balconies: "Balconies",
//     floorNo: "Floor No.",
//     areaUnit: "Area Unit",
//     propertyApproved: "Property Approved",
//     postedBy: "Posted By",
//     facing: "Facing",
//     salesMode: "Sales Mode",
//     salesType: "Sales Type",
//     description: "Description",
//     furnished: "Furnished",
//     lift: "Lift",
//     attachedBathrooms: "Attached Bathrooms",
//     western: "Western Toilet",
//     numberOfFloors: "Number of Floors",
//     carParking: "Car Parking",
//     rentalPropertyAddress: "Property Address",
//     country: "Country",
//     state: "State",
//     city: "City",
//     district: "District",
//     area: "Area",
//     streetName: "Street Name",
//     doorNumber: "Door Number",
//     nagar: "Nagar",
//     ownerName: "Owner Name",
//     email: "Email",
//     phoneNumber: "Phone Number",
//     phoneNumberCountryCode: "Phone Country Code",
//     alternatePhone: "Alternate Phone",
//     alternatePhoneCountryCode: "Alternate Phone Country Code",
//     bestTimeToCall: "Best Time to Call",
//   };
    
//       const renderDropdown = (field) => {
//         const options = dataList[field] || [];
//         const filteredOptions = options.filter((option) =>
//           option.toLowerCase().includes(dropdownState.filterText.toLowerCase())
//         );
    
//         return (
//           dropdownState.activeDropdown === field && (
//             <div
//               className="dropdown-popup"
//               style={{
//                 position: 'fixed',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//                 // backgroundColor: '#fff',
//                 backgroundColor: '#E9F7F2',
  
//                 width: '100%',
//                 // maxWidth: '400px',
//                 maxWidth: '350px',
  
//                 padding: '10px',
//                 zIndex: 10,
//                 boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//                 borderRadius: '8px',
//                 overflowY: 'auto',
//                 maxHeight: '50vh',
//                 animation: 'popupOpen 0.3s ease-in-out',
//               }}
//             >
//                         <div
//             style={{
//               fontWeight: "bold",
//               fontSize: "16px",
//               marginBottom: "10px",
//               textAlign: "start",
//               color: "#019988",
//             }}
//           >
//              {fieldLabels[field] || "Property Field"}
//           </div>
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                 }}
//               >
//                 <input
//                   type="text"
//                   placeholder="Filter options..."
//                   value={dropdownState.filterText}
//                   onChange={handleFilterChange}
//                   style={{
//                     width: '80%',
//                     padding: '5px',
//     // marginBottom: '10px',
//     background:"#C0DFDA",
//     border:"none",
//     outline:"none"                }}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => toggleDropdown(field)}
//                   style={{
//                     cursor: 'pointer',
//                     border: 'none',
//                     background: 'none',
//                   }}
//                 >
//                   <FaTimes size={18} color="red" />
//                 </button>
//               </div>
//               <ul
//                 style={{
//                   listStyleType: 'none',
//                   padding: 0,
//                   margin: 0,
//                 }}
//               >
              
//   {filteredOptions.map((option, index) => (
//     <li
//       key={index}
//       onClick={() => {
//         // Update advanced filters
//         setAdvancedFilters((prevState) => ({
//           ...prevState,
//           [field]: option,
//         }));
        
//         // Update the filters state
//         setFilters((prevState) => ({
//           ...prevState,
//           [field]: option,
//         }));
        
//         // Toggle dropdown visibility
//         toggleDropdown(field);
//       }}
//       style={{
//         padding: '5px',
//         cursor: 'pointer',
//         color:"#26794A",
//         marginBottom: '5px',
//       }}
//     >
//       {option}
//     </li>
//   ))}
  
//               </ul>
//             </div>
//           )
//         );
//       };
//     const filteredProperties = properties.filter((property) => { 
//        const basicFilterMatch = 
//          (filters.id ? property.rentId?.toString().includes(filters.id) : true) &&
//          (filters.propertyMode ? property.propertyMode?.toLowerCase().includes(filters.propertyMode.toLowerCase()) : true) &&
//          (filters.propertyType ? property.propertyType?.toLowerCase().includes(filters.propertyType.toLowerCase()) : true) &&
//                  (filters.rentType ? property.rentType?.toLowerCase().includes(filters.rentType.toLowerCase()) : true) &&
//          (filters.bedrooms ? property.bedrooms?.toLowerCase().includes(filters.bedrooms.toLowerCase()) : true) &&
//          (filters.floorNo ? property.floorNo?.toLowerCase().includes(filters.floorNo.toLowerCase()) : true) &&
//          (filters.city ? property.city?.toLowerCase().includes(filters.city.toLowerCase()) : true) &&
//          (filters.state ? property.state?.toLowerCase().includes(filters.state.toLowerCase()) : true);
   
//        const priceMatch = 
//          (filters.minPrice ? property.rentalAmount >= Number(filters.minPrice) : true) &&
//          (filters.maxPrice ? property.rentalAmount <= Number(filters.maxPrice) : true);
     
//        const advancedFilterMatch = Object.keys(advancedFilters).every((key) => {
//          if (!advancedFilters[key]) return true;
     
//          if (key === "minPrice") {
//            return property.price >= Number(advancedFilters[key]);
//          }
//          if (key === "maxPrice") {
//            return property.price <= Number(advancedFilters[key]);
//          }
//          if (key === "minTotalArea") {
//            return property.totalArea >= Number(advancedFilters[key]);
//          }
//          if (key === "minBedrooms") {
//            return property.bedrooms >= Number(advancedFilters[key]);
//          }
//          if (key === "minAttachedBathrooms") {
//            return property.attachedBathrooms >= Number(advancedFilters[key]);
//          }
//          if (key === "minWestern") {
//            return property.western >= Number(advancedFilters[key]);
//          }
     
//          // Default behavior for other fields (string matching)
//          return property[key]?.toString()?.toLowerCase()?.includes(advancedFilters[key]?.toLowerCase());
//        });
     
//        return basicFilterMatch && priceMatch && advancedFilterMatch;
//      });
     
//      useEffect(() => {
//        const backdrop = document.querySelector('.modal-backdrop');
//        if (isFilterPopupOpen && backdrop) {
//          backdrop.style.pointerEvents = 'none';
//        }
//      }, [isFilterPopupOpen]);
        


//   return (
//     <Container fluid className="p-0 w-100 d-flex align-items-center justify-content-center ">
//       <Row className="g-3 w-100 ">
//         <Col lg={12} className="d-flex align-items-center justify-content-center">
           
//          <div
//      className="d-flex flex-column justify-content-center align-items-center"
//      data-bs-toggle="modal"
//      data-bs-target="#propertyModal"
//      style={{
//        height: '50px',
//        width: '50px',
//        background: '#4F4B7E',
//        borderRadius: '50%',
//        position: 'fixed',
//        right: 'calc(50% - 187.5px + 10px)', // Center - half of 375px + some offset
//        bottom: '15%',
//        zIndex: '1',
//      }}
//    >
//      <BiSearchAlt fontSize={24} color="#fff" />
//    </div> 
//     {/* Modal */}
//     <div
//       className="modal fade"
//       id="propertyModal"
//       tabIndex="-1"
//       data-bs-backdrop="false"
//       data-bs-keyboard="false"
//       style={{  backgroundColor: 'rgba(64, 64, 64, 0.9)', // white with 90% opacity
//         backdropFilter: 'blur(1px)', // optional for a frosted-glass effect
//     }}
//     >
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content rounded-5 shadow" 
//          style={{
//           width: "350px",
//           margin: "0 auto", // centers horizontally
         
//         }}    >
//           <div className="modal-body py-4">
//             <div className="d-grid gap-2 mb-2">
//               {/* Search Property - Open another popup */}
//               <button style={{background:"#DFDFDF" , color:"#5E5E5E" , fontWeight:600 , fontSize:"15px"}}
//                 className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
//                 data-bs-toggle="modal"
//                 data-bs-target="#filterPopup" // Nested modal
//               >
//                 <FaHome className="me-2" /> Search Property
//               </button>
    
//               {/* Tenant Search */}
//               <button style={{background:"#DFDFDF" , color:"#5E5E5E" , fontWeight:600 , fontSize:"15px"}}
//               className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
//                     onClick={() => navigate(`/tenant-search`)}
//     >
//                 <FaUsers className="me-2" /> Tenant Search
//               </button>
    
//               {/* Quick Sort */}
//               <button style={{background:"#DFDFDF" , color:"#5E5E5E" , fontWeight:600 , fontSize:"15px"}}
//               className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
//                               onClick={() => navigate(`/Sort-Property`)}
//     >
//                 <FaSortAmountDownAlt className="me-2" /> Quick Sort
//               </button>
    
//               {/* Property Assistance */}
//               <button style={{background:"#DFDFDF" , color:"#5E5E5E" , fontWeight:600 , fontSize:"15px"}}
//               className="btn btn-light border rounded-2 py-2 d-flex align-items-center justify-content-start ps-3 mb-3"
//           onClick={() => navigate(`/buyer-assistance`)}
//           >
//                 <FaHeadset className="me-2" /> Property Assistance
//               </button>
//             </div>
    
//             {/* Cancel */}
//             <div className="text-center" >
//               <button className="btn btn-primary rounded-2 px-4 mt-2" data-bs-dismiss="modal"
//               style={{ fontWeight:500 , fontSize:"10px"}}>
//                 CANCEL
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>  
//  {/* Filter Popup (Nested Modal) */}
//  <div
//    className="modal fade"
//    id="filterPopup"
//    tabIndex="-1"
//    aria-labelledby="filterPopupLabel"
//    aria-hidden="true"
//  >
//    <div className="modal-dialog modal-dialog-centered">
//      <div className="modal-content rounded-4 shadow">
//        <div className="modal-header">
//          <h5 className="modal-title" id="filterPopupLabel">Search Property</h5>
//          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//        </div>
//        <div className="modal-body" style={{
//          padding: '24px',
//          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)'
//        }}>
       
//       <div className="form-group">
//         <div className="input-card p-0 rounded-2" style={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'space-between', 
//           width: '100%',  
//           boxShadow: '0 6px 16px rgba(79, 75, 126, 0.12)',
//           background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
//           paddingRight: "10px",
//           border: '2px solid transparent',
//           transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//           borderRadius: '10px'
//         }}>
          
          
          
//          <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           // boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }}
//       >     
//         <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//       <img src={idcard} alt="" style={{ width: 20, height: 20 }} />  </span>
//             <input
//               type="number"
//               name="id"
//               value={filters.id}
//               onChange={handleFilterChange}
//               className="form-input m-0"
//               placeholder="SEARCH BY RENT ID"
//               style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//             />
//           </div>
//           {filters.id && (
//             <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//           )}
//         </div>
//       </div>
 
 
//       <div className="form-group " >
//      <label style={{width:'100%'}}>
 
//           <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >                    <span      style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}>
//                <img src={minprice} alt="" width={20}/>
//              </span>
//          <div style={{ flex: "1" }}>
//            <select
//              name="minPrice"
//              value={filters.minPrice || ""}
//              onChange={handleFilterChange}
//              className="form-control"
//              style={{ display: "none" }} // Hide the default <select> dropdown
//            >
//              <option value="">Select minPrice</option>
//              {dataList.minPrice?.map((option, index) => (
//                <option key={index} value={option}>
//                  {option}
//                </option>
//              ))}
//            </select>
 
//            <button
//              className="m-0"
//              type="button"
//              onClick={() => toggleDropdown("minPrice")}
//                   style={{
//                       cursor: "pointer",
//                       border:"none",
//                       padding: "12px",
//                       background: "#fff",
//                       borderRadius: "5px",
//                       width: "100%",
//                       textAlign: "left",
//                       color: "grey",
//                        position: "relative",
//                       boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//       }}      
//            >
        
//              {filters.minPrice || "Select minPrice"}
//                 {filters.minPrice && (
//               <GoCheckCircleFill
//                 style={{
//                   position: "absolute",
//                   right: "10px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   color: "green",
//                 }}
//               />
//             )}
//            </button>
 
//            {renderDropdown("minPrice")}
//          </div>
//        </div>
//      </label>
//    </div>
 
//      <div className="form-group " >
//          <label style={{width:'100%'}}>
//         <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >             <span        style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}>
//  <img src={maxprice} alt="" width={20}/></span>
          
//              <div style={{ flex: "1" }}>
//                <select
//                  name="maxPrice"
//                  value={filters.maxPrice || ""}
//                  onChange={handleFilterChange}
//                  className="form-control"
//                  style={{ display: "none" }} // Hide the default <select> dropdown
//                >
//                  <option value="">Select maxPrice</option>
//                  {dataList.maxPrice?.map((option, index) => (
//                    <option key={index} value={option}>
//                      {option}
//                    </option>
//                  ))}
//                </select>
     
//                <button
//                  className="m-0"
//                  type="button"
//                  onClick={() => toggleDropdown("maxPrice")}
//                       style={{
//                       cursor: "pointer",
//                       border:"none",
//                       padding: "12px",
//                       background: "#fff",
//                       borderRadius: "5px",
//                       width: "100%",
//                       textAlign: "left",
//                       color: "grey",
//                        position: "relative",
//                       boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//       }}      
//                >
              
//                  {filters.maxPrice || "Select maxPrice"}
//                    {filters.maxPrice && (
//               <GoCheckCircleFill
//                 style={{
//                   position: "absolute",
//                   right: "10px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   color: "green",
//                 }}
//               />
//             )}
//                </button>
     
//                {renderDropdown("maxPrice")}
//              </div>
//            </div>
//          </label>
//        </div>
//       {/* {currentStep >= 1 && ( */}
//               <div>
      
//         {/* Property Mode */}
//         <div className="form-group">
//           <label style={{ width: '100%'}}>
//           {/* <label>Property Mode <span style={{ color: 'red' }}>* </span></label> */}
      
//             <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >
//         <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//        {fieldIcons.propertyMode}   </span>
      
//         <div style={{ flex: "1" }}>
//           <select
//             name="propertyMode"
//             value={filters.propertyMode || ""}
//             onChange={handleFilterChange}
//             className="form-control"
//             style={{ display: "none" }}
//           >
//             <option value="">Select Property Mode</option>
//             {dataList.propertyMode?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
      
//           <button
//             className="m-0"
//             type="button"
//       onClick={() => toggleDropdown("propertyMode")}                 
//                   style={{
//               cursor: "pointer",
//               padding: "12px",
//               border:"none",
//               background: "#fff",
//               borderRadius: "5px",
//               width: "100%",
//               textAlign: "left",
//               color: "grey",
//               position: "relative",
//               boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//             }}
//           >
//             {filters.propertyMode || "Select Property Mode"}
//             {filters.propertyMode && (
//               <GoCheckCircleFill
//                 style={{
//                   position: "absolute",
//                   right: "10px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   color: "green",
//                 }}
//               />
//             )}
//           </button>
      
//           {renderDropdown("propertyMode")}
//         </div>
//       </div>
      
//           </label>
//         </div>
      
//         <div className="form-group"> 
//         <label style={{ width: '100%' }}>
//           {/* <label>Property Type <span style={{ color: 'red' }}>* </span> </label> */}
      
//             <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >           <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//                   {fieldIcons.propertyType} 
//                 </span>
//             <div style={{ flex: "1" }}>
//               <select
//                 name="propertyType"
//                 value={filters.propertyType || ""}
//                 onChange={handleFilterChange}
//                 className="form-control"
//                 style={{ display: "none" }} 
//               >
//                 <option value="">Select property Type</option>
//                 {dataList.propertyType?.map((option, index) => (
//                   <option key={index} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
      
//               <button
//                 className="m-0"
//                 type="button"
//                onClick={() => toggleDropdown("propertyType")}                    
//                    style={{
//                   cursor: "pointer",
//                   // border: "1px solid #4F4B7E",
//                   border:"none",
//                   padding: "12px",
//                   background: "#fff",
//                   borderRadius: "5px",
//                   width: "100%",
//                   textAlign: "left",
//                   color: "grey",
//                   position: "relative",
//                   boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', 
//                 }}
//               >
          
//                 {filters.propertyType || "Select Property Type"}
      
//                 {filters.propertyType && (
//                   <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                 )}
//               </button>
      
//               {renderDropdown("propertyType")}
//             </div>
//           </div>
//         </label>
//       </div>
      
//       {/* rentType */}
//       <div className="form-group"> 
//         <label style={{ width: '100%' }}>
//           {/* <label>renty Type <span style={{ color: 'red' }}>* </span> </label> */}
      
//             <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >           <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//                   {fieldIcons.rentType} 
//                 </span>
//             <div style={{ flex: "1" }}>
//               <select
//                 name="rentType"
//                 value={filters.rentType || ""}
//                 onChange={handleFilterChange}
//                 className="form-control"
//                 style={{ display: "none" }} 
//               >
//                 <option value="">Select renty Type</option>
//                 {dataList.rentType?.map((option, index) => (
//                   <option key={index} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
      
//               <button
//                 className="m-0"
//                 type="button"
//                 onClick={() => toggleDropdown("rentType")}
//                 style={{
//                   cursor: "pointer",
//                   // border: "1px solid #4F4B7E",
//                   border:"none",
//                   padding: "12px",
//                   background: "#fff",
//                   borderRadius: "5px",
//                   width: "100%",
//                   textAlign: "left",
//                   color: "grey",
//                   position: "relative",
//                   boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', 
//                 }}
//               >
          
//                 {filters.rentType || "Select rent Type"}
      
//                 {filters.rentType && (
//                   <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                 )}
//               </button>
      
//               {renderDropdown("rentType")}
//             </div>
//           </div>
//         </label>
//       </div>
 
//         </div>
      
      
//       {/* {currentStep >= 2 && ( */}
//               <div className="fieldcontent p-0">
//         <h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}> Basic Property Info  </h4>             
      
//         <div className="form-group">
//           <label style={{ width: '100%'}}>
//           {/* <label>Bedrooms </label> */}
      
//             <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >       <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//                     {fieldIcons.bedrooms || <FaHome />}
//                   </span> <div style={{ flex: "1" }}>
//                 <select
//                   name="bedrooms"
//                   value={filters.bedrooms || ""}
//                   onChange={handleFilterChange}
//                   className="form-control"
//                   style={{ display: "none" }} // Hide the default <select> dropdown
//                 >
//                   <option value="">Select bedrooms</option>
//                   {dataList.bedrooms?.map((option, index) => (
//                     <option key={index} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
      
//                 <button
//                   className="m-0"
//                   type="button"
//                   onClick={() => toggleDropdown("bedrooms")}
//                   style={{
//                     cursor: "pointer",
//                     border:"none",
//                     // border: "1px solid #4F4B7E",
//                     padding: "12px",
//                     background: "#fff",
//                     borderRadius: "5px",
//                     width: "100%",
//                     textAlign: "left",
//                     color: "grey",
//                   position: "relative",border:"none",
//                               boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//       }}
//                 >
                   
//                   {filters.bedrooms || "Select bedrooms"}
//        {filters.bedrooms && (
//                   <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                 )}          </button>
      
//                 {renderDropdown("bedrooms")}
//               </div>
//             </div>
//           </label>
//         </div>
      
//           {/* floorNo */}
//           <div className="form-group">
//           <label style={{ width: '100%'}}>
//           {/* <label>FloorNo </label> */}
      
//             <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >       <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//                     {fieldIcons.floorNo}
//                   </span>  <div style={{ flex: "1" }}>
//                 <select
//                   name="floorNo"
//                   value={filters.floorNo || ""}
//                   onChange={handleFilterChange}
//                   className="form-control"
//                   style={{ display: "none" }} // Hide the default <select> dropdown
//                 >
//                   <option value="">Select floorNo</option>
//                   {dataList.floorNo?.map((option, index) => (
//                     <option key={index} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
      
//                 <button
//                   className="m-0"
//                   type="button"
//                   onClick={() => toggleDropdown("floorNo")}
//                   style={{
//                     cursor: "pointer",
//                     border:"none",
//                     // border: "1px solid #4F4B7E",
//                     padding: "12px",
//                     background: "#fff",
//                     borderRadius: "5px",
//                     width: "100%",
//                     textAlign: "left",
//                     color: "grey",
//                   position: "relative",border:"none",
//                               boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//       }}
//                 >
                  
//                   {filters.floorNo || "Select floorNo"}
//        {filters.floorNo && (
//                   <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                 )}          </button>
      
//                 {renderDropdown("floorNo")}
//               </div>
//             </div>
//           </label>
//         </div>
//         </div>
      
    
        
//               <div className="fieldcontent p-0">
//       <div className="form-group">
//         {/* <label>State:</label> */}
//         <div className="input-card p-0 rounded-2" style={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'space-between', 
//           width: '100%',  
//           boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//           background: "#fff",
//           paddingRight: "10px"
//         }}>
          
//          <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//         }}
//       > 
           
//            <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//            <MdLocationCity className="input-icon" style={{color: '#4F4B7E',}} />
//         </span>
//         <input
//             type="text"
//             name="state"
//             value={filters.state}
//             onChange={handleFilterChange}
//             className="form-input m-0"
//             placeholder="State"
//               style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//           />
//         </div>
//          {filters.state && (
//             <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//           )}
//       </div></div>
//         {/* City */}
      
//       <div className="form-group">
//         {/* <label>City:</label> */}
//         <div className="input-card p-0 rounded-2" style={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'space-between', 
//           width: '100%',  
//           boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//           background: "#fff",
//           paddingRight: "10px"
//         }}>
          
        
//           <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//         }}
//       > 
//            <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//            {fieldIcons.city || <FaHome />} 
//         </span>
//         <input
//             type="text"
//             name="city"
//             value={filters.city}
//             onChange={handleFilterChange}
//             className="form-input m-0"
//             placeholder="City"
//               style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//           />
//         </div>
//          {filters.city && (
//             <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//           )}
//       </div></div>
 
 
 
    
      
//         </div>
//       {/* Advance Filter Button */}
//          <div className="text-center mt-3 ">
//          <button  aria-label="Close"  data-bs-dismiss="modal"
//          type="button"
//          className="btn w-100"
//          style={{
//            backgroundColor: hoverSearch ? '#4F4B7E' : '#4F4B7E',
//            color: '#fff',
//            border: 'none',
//            fontWeight: '600',
//            letterSpacing: '0.5px',
//            borderRadius: '8px',
//            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//            textTransform: 'uppercase',
//            fontSize: '13px',
//            padding: '12px 24px',
//            boxShadow: hoverSearch ? '0 12px 28px rgba(79, 75, 126, 0.3)' : '0 4px 12px rgba(79, 75, 126, 0.15)',
//            transform: hoverSearch ? 'translateY(-2px)' : 'translateY(0)'
//          }}
//          onMouseEnter={() => setHoverSearch(true)}
//          onMouseLeave={() => setHoverSearch(false)}
//          // onClick={applyFilters}
//        >
//          SEARCH
//        </button>
 
//        <button
//          type="button"
//          className="btn w-100 mt-3"
//          style={{
//            backgroundColor: hoverAdvance ? '#4F4B7E' : 'transparent',
//            color: hoverAdvance ? '#fff' : '#4F4B7E',
//            border: `2px solid #4F4B7E`,
//            fontWeight: '600',
//            letterSpacing: '0.5px',
//            borderRadius: '8px',
//            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//            textTransform: 'uppercase',
//            fontSize: '13px',
//            padding: '12px 24px',
//            boxShadow: hoverAdvance ? '0 12px 28px rgba(79, 75, 126, 0.25)' : 'none',
//            transform: hoverAdvance ? 'translateY(-2px)' : 'translateY(0)'
//          }}
//          onMouseEnter={() => setHoverAdvance(true)}
//          onMouseLeave={() => setHoverAdvance(false)}
//          data-bs-toggle="modal"
//          data-bs-target="#advancedFilterPopup"
//        >
//          GO TO ADVANCED SEARCH
//        </button>
//          </div>
//    </div>
 
//      </div>
//    </div>
//  </div>
 
//  {/* Advanced Filter Popup */}
//  <div
//    className="modal fade"
//    id="advancedFilterPopup"
//    tabIndex="-1"
//    aria-labelledby="advancedFilterPopupLabel"
//    aria-hidden="true"
//  >
//    <div className="modal-dialog modal-dialog-centered">
//      <div className="modal-content rounded-4 shadow">
//        <div className="modal-header">
//          <h5 className="modal-title" id="advancedFilterPopupLabel">Advanced Search</h5>
//          <button
//            type="button"
//            className="btn-close"
//            data-bs-dismiss="modal"
//            aria-label="Close"
//          ></button>
//        </div>
//    <div className="modal-body">
  
//            <div className="form-group">
//         <div className="input-card p-0 rounded-2" style={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'space-between', 
//           width: '100%',  
//           boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//           background: "#fff",
//           paddingRight: "10px"
//         }}>
          
          
          
//          <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           // boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }}
//       >     
//         <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//       <img src={idcard} alt="" style={{ width: 20, height: 20 }} />  </span>
//             <input
//               type="number"
//               name="id"
//               value={filters.id}
//               onChange={handleFilterChange}
//               className="form-input m-0"
//               placeholder="SEARCH BY RENT ID"
//               style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//             />
//           </div>
//           {filters.id && (
//             <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//           )}
//         </div>
//       </div>
 
      
//       <div className="form-group " >
//      <label style={{width:'100%'}}>
 
//           <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >                    <span      style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}>
//                <img src={minprice} alt="" width={20}/>
//              </span>
//          <div style={{ flex: "1" }}>
//            <select
//              name="minPrice"
//              value={filters.minPrice || ""}
//              onChange={handleFilterChange}
//              className="form-control"
//              style={{ display: "none" }} // Hide the default <select> dropdown
//            >
//              <option value="">Select minPrice</option>
//              {dataList.minPrice?.map((option, index) => (
//                <option key={index} value={option}>
//                  {option}
//                </option>
//              ))}
//            </select>
 
//            <button
//              className="m-0"
//              type="button"
//              onClick={() => toggleDropdown("minPrice")}
//                   style={{
//                       cursor: "pointer",
//                       border:"none",
//                       padding: "12px",
//                       background: "#fff",
//                       borderRadius: "5px",
//                       width: "100%",
//                       textAlign: "left",
//                       color: "grey",
//                        position: "relative",
//                       boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//       }}      
//            >
        
//              {filters.minPrice || "Select minPrice"}
//                 {filters.minPrice && (
//               <GoCheckCircleFill
//                 style={{
//                   position: "absolute",
//                   right: "10px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   color: "green",
//                 }}
//               />
//             )}
//            </button>
 
//            {renderDropdown("minPrice")}
//          </div>
//        </div>
//      </label>
//    </div>
 
//      <div className="form-group " >
//          <label style={{width:'100%'}}>
//         <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >             <span        style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}>
//  <img src={maxprice} alt="" width={20}/></span>
          
//              <div style={{ flex: "1" }}>
//                <select
//                  name="maxPrice"
//                  value={filters.maxPrice || ""}
//                  onChange={handleFilterChange}
//                  className="form-control"
//                  style={{ display: "none" }} // Hide the default <select> dropdown
//                >
//                  <option value="">Select maxPrice</option>
//                  {dataList.maxPrice?.map((option, index) => (
//                    <option key={index} value={option}>
//                      {option}
//                    </option>
//                  ))}
//                </select>
     
//                <button
//                  className="m-0"
//                  type="button"
//                  onClick={() => toggleDropdown("maxPrice")}
//                       style={{
//                       cursor: "pointer",
//                       border:"none",
//                       padding: "12px",
//                       background: "#fff",
//                       borderRadius: "5px",
//                       width: "100%",
//                       textAlign: "left",
//                       color: "grey",
//                        position: "relative",
//                       boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//       }}      
//                >
              
//                  {filters.maxPrice || "Select maxPrice"}
//                    {filters.maxPrice && (
//               <GoCheckCircleFill
//                 style={{
//                   position: "absolute",
//                   right: "10px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   color: "green",
//                 }}
//               />
//             )}
//                </button>
     
//                {renderDropdown("maxPrice")}
//              </div>
//            </div>
//          </label>
//        </div>
//       {/* {currentStep >= 1 && ( */}
//               <div>
      
//         {/* Property Mode */}
//         <div className="form-group">
//           <label style={{ width: '100%'}}>
//           {/* <label>Property Mode <span style={{ color: 'red' }}>* </span></label> */}
      
//             <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >
//         <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//        {fieldIcons.propertyMode}   </span>
      
//         <div style={{ flex: "1" }}>
//           <select
//             name="propertyMode"
//             value={advancedFilters.propertyMode || ""}
//             onChange={handleAdvancedFilterChange}
//             className="form-control"
//             style={{ display: "none" }}
//           >
//             <option value="">Select Property Mode</option>
//             {dataList.propertyMode?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
      
//           <button
//             className="m-0"
//             type="button"
//       onClick={() => toggleDropdown("propertyMode")}                 
//                   style={{
//               cursor: "pointer",
//               padding: "12px",
//               border:"none",
//               background: "#fff",
//               borderRadius: "5px",
//               width: "100%",
//               textAlign: "left",
//               color: "grey",
//               position: "relative",
//               boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//             }}
//           >
//             {advancedFilters.propertyMode || "Select Property Mode"}
//             {advancedFilters.propertyMode && (
//               <GoCheckCircleFill
//                 style={{
//                   position: "absolute",
//                   right: "10px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   color: "green",
//                 }}
//               />
//             )}
//           </button>
      
//           {renderDropdown("propertyMode")}
//         </div>
//       </div>
      
//           </label>
//         </div>
      
//         <div className="form-group"> 
//         <label style={{ width: '100%' }}>
//           {/* <label>Property Type <span style={{ color: 'red' }}>* </span> </label> */}
      
//             <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >           <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//                   {fieldIcons.propertyType} 
//                 </span>
//             <div style={{ flex: "1" }}>
//               <select
//                 name="propertyType"
//                 value={advancedFilters.propertyType || ""}
//                 onChange={handleAdvancedFilterChange}
//                 className="form-control"
//                 style={{ display: "none" }} 
//               >
//                 <option value="">Select property Type</option>
//                 {dataList.propertyType?.map((option, index) => (
//                   <option key={index} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
      
//               <button
//                 className="m-0"
//                 type="button"
//                onClick={() => toggleDropdown("propertyType")}                    
//                    style={{
//                   cursor: "pointer",
//                   // border: "1px solid #4F4B7E",
//                   border:"none",
//                   padding: "12px",
//                   background: "#fff",
//                   borderRadius: "5px",
//                   width: "100%",
//                   textAlign: "left",
//                   color: "grey",
//                   position: "relative",
//                   boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', 
//                 }}
//               >
          
//                 {advancedFilters.propertyType || "Select Property Type"}
      
//                 {advancedFilters.propertyType && (
//                   <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                 )}
//               </button>
      
//               {renderDropdown("propertyType")}
//             </div>
//           </div>
//         </label>
//       </div>
      
//       {/* rentType */}
//       <div className="form-group"> 
//         <label style={{ width: '100%' }}>
//           {/* <label>renty Type <span style={{ color: 'red' }}>* </span> </label> */}
      
//             <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >           <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//                   {fieldIcons.rentType} 
//                 </span>
//             <div style={{ flex: "1" }}>
//               <select
//                 name="rentType"
//                 value={advancedFilters.rentType || ""}
//                 onChange={handleAdvancedFilterChange}
//                 className="form-control"
//                 style={{ display: "none" }} 
//               >
//                 <option value="">Select renty Type</option>
//                 {dataList.rentType?.map((option, index) => (
//                   <option key={index} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
      
//               <button
//                 className="m-0"
//                 type="button"
//                 onClick={() => toggleDropdown("rentType")}
//                 style={{
//                   cursor: "pointer",
//                   // border: "1px solid #4F4B7E",
//                   border:"none",
//                   padding: "12px",
//                   background: "#fff",
//                   borderRadius: "5px",
//                   width: "100%",
//                   textAlign: "left",
//                   color: "grey",
//                   position: "relative",
//                   boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', 
//                 }}
//               >
          
//                 {advancedFilters.rentType || "Select rent Type"}
      
//                 {advancedFilters.rentType && (
//                   <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                 )}
//               </button>
      
//               {renderDropdown("rentType")}
//             </div>
//           </div>
//         </label>
//       </div>
//         </div>
      
      
//       {/* {currentStep >= 2 && ( */}
//               <div className="fieldcontent p-0">
//         <h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}> Basic Property Info  </h4>             
      
//         <div className="form-group">
//           <label style={{ width: '100%'}}>
//           {/* <label>Bedrooms </label> */}
      
//             <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >       <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//                     {fieldIcons.bedrooms || <FaHome />}
//                   </span> <div style={{ flex: "1" }}>
//                 <select
//                   name="bedrooms"
//                   value={advancedFilters.bedrooms || ""}
//                   onChange={handleAdvancedFilterChange}
//                   className="form-control"
//                   style={{ display: "none" }} // Hide the default <select> dropdown
//                 >
//                   <option value="">Select bedrooms</option>
//                   {dataList.bedrooms?.map((option, index) => (
//                     <option key={index} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
      
//                 <button
//                   className="m-0"
//                   type="button"
//                   onClick={() => toggleDropdown("bedrooms")}
//                   style={{
//                     cursor: "pointer",
//                     border:"none",
//                     // border: "1px solid #4F4B7E",
//                     padding: "12px",
//                     background: "#fff",
//                     borderRadius: "5px",
//                     width: "100%",
//                     textAlign: "left",
//                     color: "grey",
//                   position: "relative",border:"none",
//                               boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//       }}
//                 >
                   
//                   {advancedFilters.bedrooms || "Select bedrooms"}
//        {advancedFilters.bedrooms && (
//                   <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                 )}          </button>
      
//                 {renderDropdown("bedrooms")}
//               </div>
//             </div>
//           </label>
//         </div>
      
//           {/* floorNo */}
//           <div className="form-group">
//           <label style={{ width: '100%'}}>
//           {/* <label>FloorNo </label> */}
      
//             <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >       <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//                     {fieldIcons.floorNo}
//                   </span>  <div style={{ flex: "1" }}>
//                 <select
//                   name="floorNo"
//                   value={advancedFilters.floorNo || ""}
//                   onChange={handleAdvancedFilterChange}
//                   className="form-control"
//                   style={{ display: "none" }} // Hide the default <select> dropdown
//                 >
//                   <option value="">Select floorNo</option>
//                   {dataList.floorNo?.map((option, index) => (
//                     <option key={index} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
      
//                 <button
//                   className="m-0"
//                   type="button"
//                   onClick={() => toggleDropdown("floorNo")}
//                   style={{
//                     cursor: "pointer",
//                     border:"none",
//                     // border: "1px solid #4F4B7E",
//                     padding: "12px",
//                     background: "#fff",
//                     borderRadius: "5px",
//                     width: "100%",
//                     textAlign: "left",
//                     color: "grey",
//                   position: "relative",border:"none",
//                               boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//       }}
//                 >
                  
//                   {advancedFilters.floorNo || "Select floorNo"}
//        {advancedFilters.floorNo && (
//                   <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                 )}          </button>
      
//                 {renderDropdown("floorNo")}
//               </div>
//             </div>
//           </label>
//         </div>
      
        
//           {/*attachedBathrooms */}
//             <div className="form-group">
//           <label style={{ width: '100%'}}>
//           {/* <label>Attached Bathrooms</label> */}
      
//             <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >       <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//                     {fieldIcons.attachedBathrooms || <FaHome />}
//                   </span>   <div style={{ flex: "1" }}>
//                 <select
//                   name="attachedBathrooms"
//                   value={advancedFilters.attachedBathrooms || ""}
//                   onChange={handleAdvancedFilterChange}
//                   className="form-control"
//                   style={{ display: "none" }} // Hide the default <select> dropdown
//                 >
//                   <option value="">Select attachedBathrooms</option>
//                   {dataList.attachedBathrooms?.map((option, index) => (
//                     <option key={index} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
      
//                 <button
//                   className="m-0"
//                   type="button"
//                   onClick={() => toggleDropdown("attachedBathrooms")}
//                   style={{
//                     cursor: "pointer",
//                     // border: "1px solid #4F4B7E",
//                     padding: "12px",
//                     background: "#fff",
//                     borderRadius: "5px",
//                     width: "100%",
//                     textAlign: "left",
//                     color: "grey",
//                   position: "relative",border:"none",
//                               boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//       }}
//                 >
                 
//                   {advancedFilters.attachedBathrooms || "Select attachedBathrooms"}
//        {advancedFilters.attachedBathrooms && (
//                   <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                 )}          </button>
      
//                 {renderDropdown("attachedBathrooms")}
//               </div>
//             </div>
//           </label>
//         </div>
      
//             {/* western */}
//           <div className="form-group">
      
//           <label style={{ width: '100%'}}>
//           {/* <label>Western</label> */}
      
//          <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >    
//               <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//                     {fieldIcons.western || <FaHome />}
//                   </span>    <div style={{ flex: "1" }}>
//                 <select
//                   name="western"
//                   value={advancedFilters.western || ""}
//                   onChange={handleAdvancedFilterChange}
//                   className="form-control"
//                   style={{ display: "none" }} // Hide the default <select> dropdown
//                 >
//                   <option value="">Select western</option>
//                   {dataList.western?.map((option, index) => (
//                     <option key={index} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
      
//                 <button
//                   className="m-0"
//                   type="button"
//                   onClick={() => toggleDropdown("western")}
//                   style={{
//                     cursor: "pointer",
//                     // border: "1px solid #4F4B7E",
//                     padding: "12px",
//                     background: "#fff",
//                     borderRadius: "5px",
//                     width: "100%",
//                     textAlign: "left",
//                     color: "grey",
//                   position: "relative",border:"none",
//                               boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//       }}
//                 >
               
//                   {advancedFilters.western || "Select western"}
//        {advancedFilters.western && (
//                   <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                 )}          </button>
      
//                 {renderDropdown("western")}
//               </div>
//             </div>
//           </label>
//         </div>
//           {/* carParking */}
      
//           <div className="form-group">
//           <label style={{ width: '100%'}}>
//           {/* <label>Car Parking</label> */}
      
//             <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >        <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//                     {fieldIcons.carParking || <FaHome />}
//                   </span>    <div style={{ flex: "1" }}>
//                 <select
//                   name="carParking"
//                   value={advancedFilters.carParking || ""}
//                   onChange={handleAdvancedFilterChange}
//                   className="form-control"
//                   style={{ display: "none" }} // Hide the default <select> dropdown
//                 >
//                   <option value="">Select carParking</option>
//                   {dataList.carParking?.map((option, index) => (
//                     <option key={index} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
      
//                 <button
//                   className="m-0"
//                   type="button"
//                   onClick={() => toggleDropdown("carParking")}
//                   style={{
//                     cursor: "pointer",
//                     // border: "1px solid #4F4B7E",
//                     padding: "12px",
//                     background: "#fff",
//                     borderRadius: "5px",
//                     width: "100%",
//                     textAlign: "left",
//                     color: "grey",
//                   position: "relative",border:"none",
//                               boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//       }}
//                 >
               
//                   {advancedFilters.carParking || "Select carParking"}
//        {advancedFilters.carParking && (
//                   <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                 )}          </button>
      
//                 {renderDropdown("carParking")}
//               </div>
//             </div>
//           </label>
//         </div>
//           {/*lift */}
//           <div className="form-group">
//           <label style={{ width: '100%'}}>
//             {/* <label>Lift</label> */}
//             <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >      <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//                     {fieldIcons.lift || <FaHome />}
//                   </span>    <div style={{ flex: "1" }}>
//                 <select
//                   name="lift"
//                   value={advancedFilters.lift || ""}
//                   onChange={handleAdvancedFilterChange}
//                   className="form-control"
//                   style={{ display: "none" }} // Hide the default <select> dropdown
//                 >
//                   <option value="">Select lift</option>
//                   {dataList.lift?.map((option, index) => (
//                     <option key={index} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
      
//                 <button
//                   className="m-0"
//                   type="button"
//                   onClick={() => toggleDropdown("lift")}
//                   style={{
//                     cursor: "pointer",
//                     // border: "1px solid #4F4B7E",
//                     padding: "12px",
//                     background: "#fff",
//                     borderRadius: "5px",
//                     width: "100%",
//                     textAlign: "left",
//                     color: "grey",
//                   position: "relative",border:"none",
//                               boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//       }}
//                 >
                 
//                   {advancedFilters.lift || "Select lift"}
//        {advancedFilters.lift && (
//                   <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                 )}          </button>
      
//                 {renderDropdown("lift")}
//               </div>
//             </div>
//           </label>
//         </div>
    
//           {/* facing */}
//           <div className="form-group">
      
//           <label style={{ width: '100%'}}>
//           {/* <label>Facing</label> */}
      
//             <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >       <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//                     {fieldIcons.facing || <FaHome />}
//                   </span>  <div style={{ flex: "1" }}>
//                 <select
//                   name="facing"
//                   value={advancedFilters.facing || ""}
//                   onChange={handleAdvancedFilterChange}
//                   className="form-control"
//                   style={{ display: "none" }} // Hide the default <select> dropdown
//                 >
//                   <option value="">Select facing</option>
//                   {dataList.facing?.map((option, index) => (
//                     <option key={index} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
      
//                 <button
//                   className="m-0"
//                   type="button"
//                   onClick={() => toggleDropdown("facing")}
//                   style={{
//                     cursor: "pointer",
//                     // border: "1px solid #4F4B7E",
//                     padding: "12px",
//                     background: "#fff",
//                     borderRadius: "5px",
//                     width: "100%",
//                     textAlign: "left",
//                     color: "grey",
//                   position: "relative",border:"none",
//                               boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//       }}
//                 >
                  
//                   {advancedFilters.facing || "Select facing"}
//        {advancedFilters.facing && (
//                   <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                 )}          </button>
      
//                 {renderDropdown("facing")}
//               </div>
//             </div>
//           </label>
//         </div>
//       {/* wheelChairAvailable */}
//         {/* <div className="form-group">
//           <label style={{width:"100%"}}>
      
//             <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >       <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//                     {fieldIcons.wheelChairAvailable || <FaHome />}
//                   </span>    <div style={{ flex: "1" }}>
//                 <select
//                   name="wheelChairAvailable"
//                   value={advancedFilters.wheelChairAvailable || ""}
//                   onChange={handleAdvancedFilterChange}
//                   className="form-control"
//                   style={{ display: "none" }} // Hide the default <select> dropdown
//                 >
//                   <option value="">Select wheelChairAvailable</option>
//                   {dataList.wheelChairAvailable?.map((option, index) => (
//                     <option key={index} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
      
//                 <button
//                   className="m-0"
//                   type="button"
//                   onClick={() => toggleDropdown("wheelChairAvailable")}
//                   style={{
//                     cursor: "pointer",
//                     padding: "12px",
//                     background: "#fff",
//                     borderRadius: "5px",
//                     width: "100%",
//                     textAlign: "left",
//                     color: "grey",
//                   position: "relative",border:"none",
//                               boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//       }}
//                 >
                
//                   {advancedFilters.wheelChairAvailable || "Select wheelChairAvailable"}
//        {advancedFilters.wheelChairAvailable && (
//                   <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                 )}          </button>
      
//                 {renderDropdown("wheelChairAvailable")}
//               </div>
//             </div>
//           </label>
//         </div> */}
      
//          {/* postedBy */}
//          <div className="form-group">
//           <label style={{ width: '100%'}}>
//           {/* <label>PostedBy <span style={{ color: 'red' }}>* </span> </label> */}
      
//             <div 
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//           boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         }} className="rounded-2"
//       >       <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//                     {fieldIcons.postedBy} 
//                   </span>   <div style={{ flex: "1" }}>
//                 <select
//                   name="postedBy"
      
//                   value={advancedFilters.postedBy || ""}
//                   onChange={handleAdvancedFilterChange}
//                   className="form-control"
//                   style={{ display: "none" }} // Hide the default <select> dropdown
//                 >
//                   <option value="">Select postedBy</option>
//                   {dataList.postedBy?.map((option, index) => (
//                     <option key={index} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
      
//                 <button
//                   className="m-0"
//                   type="button"
//                   onClick={() => toggleDropdown("postedBy")}
//                   style={{
//                     cursor: "pointer",
//                     // border: "1px solid #4F4B7E",
//                     padding: "12px",
//                     background: "#fff",
//                     borderRadius: "5px",
//                     width: "100%",
//                     textAlign: "left",
//                     color: "grey",
//                   position: "relative",border:"none",
//                               boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
//       }}
//                 >
                 
//                   {advancedFilters.postedBy || "Select postedBy"}
//        {advancedFilters.postedBy && (
//                   <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//                 )}          </button>
      
//                 {renderDropdown("postedBy")}
//               </div>
//             </div>
//           </label>
//         </div>
//         </div>
//        {/* )} */}
      
      
 
        
      
//       {/* {currentStep >= 4 && ( */}
//               <div className="fieldcontent p-0">
        
//         {/* State */}
      
//       <div className="form-group">
//         {/* <label>State:</label> */}
//         <div className="input-card p-0 rounded-2" style={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'space-between', 
//           width: '100%',  
//           boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//           background: "#fff",
//           paddingRight: "10px"
//         }}>
          
//          <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//         }}
//       > 
           
//            <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//            <MdLocationCity className="input-icon" style={{color: '#4F4B7E',}} />
//         </span>
//         <input
//             type="text"
//             name="state"
//             value={advancedFilters.state}
//             onChange={handleAdvancedFilterChange}
//             className="form-input m-0"
//             placeholder="State"
//               style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//           />
//         </div>
//          {advancedFilters.state && (
//             <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//           )}
//       </div></div>
//         {/* City */}
      
//       <div className="form-group">
//         {/* <label>City:</label> */}
//         <div className="input-card p-0 rounded-2" style={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'space-between', 
//           width: '100%',  
//           boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//           background: "#fff",
//           paddingRight: "10px"
//         }}>
          
        
//           <div
//         style={{
//           display: "flex",
//           alignItems: "stretch", // <- Stretch children vertically
//           width: "100%",
//         }}
//       > 
//            <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "0 14px",
//             borderRight: "1px solid #4F4B7E",
//             background: "#fff", // optional
//           }}
//         >
//            {fieldIcons.city || <FaHome />} 
//         </span>
//         <input
//             type="text"
//             name="city"
//             value={advancedFilters.city}
//             onChange={handleAdvancedFilterChange}
//             className="form-input m-0"
//             placeholder="City"
//               style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//           />
//         </div>
//          {advancedFilters.city && (
//             <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//           )}
//       </div></div>
      
//         </div>
//       {/* )}  */}
      
      
      
//       {/* {currentStep >= 5 && ( */}
//               <div className="fieldcontent p-0" >
      
      
//       <h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}>  Mobile Number   </h4>             
      
//       <div className="form-group">
//       {/* <label>Phone Number:</label> */}
      
//         <div className="input-card p-0 rounded-2" style={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'space-between', 
//           width: '100%',  
//           boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//           background: "#fff",
//           paddingRight: "10px"
//         }}>
          
        
//         <img src={phone} alt="" style={{ width: 20, height: 20 ,marginLeft:"10px"}} />
//            {/* <FaPhone className="input-icon" style={{ color: '#4F4B7E', marginLeft:"10px"}} /> */}
          
 
      
      
//           <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
      
       
//         <input
//             type="text"
//             name="phoneNumber"
//             value={phoneNumber}
//             readOnly
//             className="form-input m-0"
//             placeholder="Phone Number"
//               style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//           />
//         </div>
//             <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//           </div>
//       </div>
   
//         </div>
//        {/* )}  */}
//      <div className="text-center mt-3 ">
//          <button
//                    data-bs-dismiss="modal"
 
//            type="button"
//            className="btn w-100"
//            style={{
//              backgroundColor: hoverSearch ? '#4F4B7E' : '#4F4B7E',
//              color: '#fff',
//              border: 'none',
//            }}
//            onMouseEnter={() => setHoverSearch(true)}
//            onMouseLeave={() => setHoverSearch(false)}          // onClick={applyAdvancedFilters}
//          >
//            SEARCH
//          </button>
//        <button
//            type="button"
//            className="btn w-100 mt-3"
//            style={{
//              backgroundColor: hoverAdvance ? '#4F4B7E' : 'transparent',
//              color: hoverAdvance ? '#fff' : '#4F4B7E',
//              border: `1px solid #4F4B7E`,
//            }}
//            onMouseEnter={() => setHoverAdvance(true)}
//            onMouseLeave={() => setHoverAdvance(false)}          data-bs-toggle="modal"
//            data-bs-target="#filterPopup" // Nested modal
//            >
//            GO TO SIMPLE SEARCH
//          </button>
//          <button 
//          style={{color:"#4F4B7E"}}
//            type="button"
//            className="btn w-100 mt-3"
//            data-bs-dismiss="modal"
//          >
//            HOME
//          </button>
//          </div>
//             </div>
//      </div>
//    </div>
//  </div>

//       <div className="w-100">
//       {/* <h2>Puducherry Properties</h2> */}
//       {error && <p style={{ color: "red" }}>{error}</p>}
   
//       <div style={{ overflowY: 'auto', fontFamily:"Inter, sans-serif" }}>
//       {loading ? (
//   <div className="text-center my-4"
//     style={{
//       position: 'fixed',
//       top: '50%',
//       left: '50%',
//       transform: 'translate(-50%, -50%)',
//       zIndex: 1000
//     }}>
//     <span className="spinner-border text-primary" role="status" />
//     <p className="mt-2">Loading properties...</p>
//   </div>
// ) : filteredProperties.length > 0 ? ( 
//   filteredProperties.map((property) => (
         
//           <div 
//           key={property._id}
//           className="card mb-3 shadow rounded-4"
//           style={{ width: '100%', height: 'auto', background: '#F9F9F9', overflow:'hidden' }}
//           onClick={() => handleCardClick(property.rentId, property.phoneNumber)}
//         >
//            <div className="row g-0 align-items-stretch">
// <div className="col-md-4 col-4 d-flex flex-column align-items-center">

// <div style={{ position: "relative", width: "100%",height: '100%', }}>
// {property.isFeatured && (
//   <span
//     className="m-0 ps-1 pe-2"
//     style={{
//       position: "absolute",
//       top: "0px",
//       right: "0px",
//       fontSize: "12px",
//       background: "linear-gradient(to right,rgba(255, 200, 0, 0.91),rgb(251, 182, 6))",
//       color: "black",
//       cursor: "pointer",
//       borderRadius: "0px 0px 0px 15px",
//       zIndex: 2,
//     }}
//   >
//     <MdOutlineStarOutline /> Featured
//   </span>
// )}


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


// {/* Icons */}
// <div
// style={{
// position: "absolute",
// bottom: "0px",
// width: "100%",
// display: "flex",
// justifyContent: "space-between",
// }}
// >
                             
// <span className="d-flex justify-content-center align-items-center" style={{ color:'#fff', background:`url(${myImage}) no-repeat center center`, backgroundSize:"cover" ,fontSize:'12px', width:'50px' }}>
//           <FaCamera className="me-1"/> {imageCounts[property.rentId] || 0}
//           </span>
//           <span className="d-flex justify-content-center align-items-center" style={{ color:'#fff', background:`url(${myImage1}) no-repeat center center`, backgroundSize:"cover" ,fontSize:'12px', width:'50px' }}>
//           <FaEye className="me-1" />{property.views}
//           </span>
// </div>
// </div>
// </div>
//          <div className="col-md-8 col-8 " style={{paddingLeft:"10px", paddingTop:"7px" , background: clickedProperties.includes(property.rentId) ? "#ffffff" : "#F9F9F9",}}>
//           <div className="d-flex justify-content-start"><p className="m-0" style={{ color:'#5E5E5E' , fontWeight:500 , fontSize:"13px"}}>{property.propertyMode
//   ? property.propertyMode.charAt(0).toUpperCase() + property.propertyMode.slice(1)
//   : 'N/A'}
// </p> 
//           </div>
//          <p className="fw-bold m-0 " style={{ color:clickedProperties.includes(property.rentId) ? "#F76F00" : "#000000", fontSize:"15px" }}>{property.propertyType 
//   ? property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) 
//   : 'N/A'}
// </p>
//    <p
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
// {val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()}         {idx < arr.length - 1 ? ", " : ""}
//       </span>
//     ));
//   })()}
// </p>
//            <div className="card-body ps-2 m-0 pt-0 pe-2 pb-0 d-flex flex-column justify-content-center">
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

//          <span style={{ color: '#4F4B7E', fontSize: '13px', marginLeft: "5px", fontSize: '11px' }}>
//               {property.negotiation ? 'Negotiable' : 'Not Negotiable'}
//             </span>
//                   </h6>
//                </div>
//               </div>
//             </div>
//           </div>
// </div>

//         </div>
//         )) ) : (
//           <div className="text-center my-4 "
//           style={{
//             position: 'fixed',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
        
//           }}>
//         <img src={NoData} alt="" width={100}/>      
//         <p>No properties found.</p>
//         </div>              )}
//       </div>
//       </div>
//       </Col>
//       </Row>
//       </Container>
//   );
// };

// export default PyProperty;


































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
import { BiSearchAlt,  BiWorld} from "react-icons/bi";
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
import FloatingSearchButton from './FloatingSearchButton';
import TenantSearchModal from './TenantSearchModal';
import { getActiveBase } from '../utils/cityBase';
import { chennaiPincodeRows, CHENNAI_DIRECTIONS } from '../chennaiPincodes';
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
import NoPropertyPopup from './NoPropertyPopup';

const PyProperty = () => {
    const [isTenantSearchOpen, setIsTenantSearchOpen] = useState(false);
    const [imageCounts, setImageCounts] = useState({}); // Store image count for each property
  
  const [properties, setProperties] = useState([]);
  // Pincode counts for the area-ticker marquee. Pulled from the same endpoint
  // the admin Search Pincode page uses so the numbers always match.
  const [marqueePincodeCounts, setMarqueePincodeCounts] = useState({});
    const [uploads, setUploads] = useState([]);
  const [mergedData, setMergedData] = useState([]);

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const location = useLocation();
    const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
    const [clickedProperties, setclickedProperties] = useState([]);
  
    const [phoneNumber, setPhoneNumber] = useState(storedPhoneNumber);
  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
          phoneNumber: phoneNumber,
          viewedFile: "Py Property",
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



  // useEffect(() => {
  //   const fetchProperties = async () => {
  //     setLoading(true);
  //     try {
  //       const [pondyRes, featuredRes] = await Promise.all([
  //         axios.get(`${process.env.REACT_APP_API_URL}/fetch-Pudhucherry-properties-on-demand-rent`),
  //         axios.get(`${process.env.REACT_APP_API_URL}/fetch-featured-properties-on-demand-rent`)
  //       ]);

  //       const pondy = pondyRes.data.data || [];
  //       const featured = featuredRes.data.properties?.map((property) => ({
  //         ...property,
  //         isFeatured: true
  //       })) || [];

  //       const combined = [...pondy, ...featured];
  //       const sorted = combined.sort(
  //         (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
  //       );

  //       setProperties(sorted);
  //       // setError("");
  //     } catch (err) {
  //       console.error(err);
  //       // setError("Failed to fetch Pondy or featured properties.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProperties();
  // }, []);

// useEffect(() => {
//   const fetchProperties = async () => {
//     setLoading(true);
//     try {
//       const [pondyRes, featuredRes] = await Promise.all([
//         axios.get(`${process.env.REACT_APP_API_URL}/fetch-Pudhucherry-properties-on-demand-rent`),
//         axios.get(`${process.env.REACT_APP_API_URL}/fetch-featured-properties-on-demand-rent`)
//       ]);

//       const pondy = pondyRes.data.data || [];
//       const featuredRaw = featuredRes.data.properties || [];

//       // Mark featured with isFeatured: true
//       const featured = featuredRaw.map(property => ({
//         ...property,
//         isFeatured: true
//       }));

//       // Create a Set of rentIds in the featured list for fast lookup
//       const featuredRentIds = new Set(featuredRaw.map(prop => prop.rentId));

//       // Filter pondy list: skip if rentId exists in featured
//       const filteredPondy = pondy.filter(prop => !featuredRentIds.has(prop.rentId));

//       // Merge and sort
//       const combined = [...filteredPondy, ...featured];
//       const sorted = combined.sort(
//         (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
//       );

//       setProperties(sorted);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchProperties();
// }, []);
// const fetchProperties = async () => {
//   setLoading(true);
//   try {
//     // Fetch Pondicherry and Featured properties in parallel
//     const [pondyRes, featuredRes] = await Promise.all([
//       axios.get(`${process.env.REACT_APP_API_URL}/fetch-Pudhucherry-properties-on-demand-rent`),
//       axios.get(`${process.env.REACT_APP_API_URL}/fetch-featured-properties-on-demand-rent`)
//     ]);

//     const pondy = pondyRes.data.data || [];
//     const featuredRaw = featuredRes.data.properties || [];

//     // Add isFeatured flag
//     const featured = featuredRaw.map(property => ({
//       ...property,
//       isFeatured: true
//     }));

//     // Avoid duplicate rentId
//     const featuredRentIds = new Set(featuredRaw.map(prop => prop.rentId));
//     const filteredPondy = pondy.filter(prop => !featuredRentIds.has(prop.rentId));

//     // Merge and sort
//     const combined = [...filteredPondy, ...featured];
//     const sorted = combined.sort(
//       (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
//     );

//     // Set the raw property list
//     setProperties(sorted);

//     // If you're filtering, do it here (optional)
//     // const filtered = sorted.filter((p) => p.city?.toLowerCase() === 'puducherry');
//     // setFilteredProperties(filtered);
//   } catch (err) {
//     console.error("Error fetching properties:", err);
//   } finally {
//     setLoading(false);
//   }
// };

// useEffect(() => {
//   const fetchProperties = async () => {
//     try {
//       const [featuredRes, activeRes] = await Promise.all([
//         axios.get(`${process.env.REACT_APP_API_URL}/fetch-featured-properties-on-demand-rent`),
//         axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users-on-demand-rent`)
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
//       console.error("Error fetching property data:", error);
//       // Optionally set error state here
//     }
//   };

//   const fetchUploadedImages = async () => {
//     try {
//       const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-uploadimages-ads`);
//       const sortedUploads = res.data.data.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
//       setUploads(sortedUploads);
//     } catch (err) {
//       console.error('Failed to fetch uploaded images:', err);
//       // setError('Failed to fetch uploaded images');
//     } finally {
//       setLoading(false); // You may want to handle loading for both separately
//     }
//   };

//   // Fetch both
//   setLoading(true);
//   fetchProperties().finally(() => {
//     fetchUploadedImages(); // Chained to ensure loading ends after both
//   });
// }, []);
//   // Fetch all uploaded images from backend
//   const fetchUploadedImages = async () => {
//     try {
//       const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-uploadimages-ads`);
//       const sortedUploads = res.data.data.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
//       setUploads(sortedUploads);
//     } catch (err) {
//       // setError('Failed to fetch uploaded images');
//             console.error('Failed to fetch uploaded images:', err);

//     } finally {
//       setLoading(false);
//     }
//   };
// useEffect(() => {
//   fetchProperties();
//   fetchUploadedImages(); // <-- your ads
// }, []);
useEffect(() => {
  const fetchProperties = async () => {
    try {
      const [featuredRes, activeRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/fetch-featured-properties-on-demand-rent`),
        axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users-on-demand-rent`)
      ]);

      const featuredProperties = featuredRes.data.properties
        .filter((property) => property.propertyMode === "Commercial Lease") // ✅ filter
        .map((property) => ({
          ...property,
          isFeatured: true,
        }));

      const featuredrentIds = new Set(featuredProperties.map((p) => p.rentId));

      const activeProperties = activeRes.data.users
        .filter(
          (property) =>
            !featuredrentIds.has(property.rentId) &&
    (property.propertyMode === "Commercial" || property.rentType === "Lease")
        )
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
    }
  };

  const fetchUploadedImages = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-uploadimages-ads`);
      const sortedUploads = res.data.data.sort(
        (a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)
      );
      setUploads(sortedUploads);
    } catch (err) {
      console.error("Failed to fetch uploaded images:", err);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchProperties(), fetchUploadedImages()]);
    } finally {
      setLoading(false);
    }
  };

  fetchAllData();
}, []);

  const handleCardClick = (rentId, phoneNumber) => {
      if (!clickedProperties.includes(rentId)) {
    const updatedClickedProperties = [...clickedProperties, rentId];
    setclickedProperties(updatedClickedProperties);
    localStorage.setItem('clickedProperties', JSON.stringify(updatedClickedProperties));
  }
    // navigate("/detail", { state: { rentId, phoneNumber } });
    navigate(`/detail/${rentId}`, { state: {phoneNumber } });

  };
useEffect(() => {
  const stored = JSON.parse(localStorage.getItem('clickedProperties')) || [];
  setclickedProperties(stored);
}, []);


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
  const [filters, setFilters] = useState({ 
    id: '', 
    minPrice: '', 
    maxPrice: '', 
    propertyMode: '', 
    city: '' ,
    area: '',
    pinCode: '',
     propertyType: '',
      rentType: '',
      bedrooms: '',
     floorNo: '',
     state:""
  });
  
  // Navbar search box state
  const [navbarSearchValue, setNavbarSearchValue] = useState("");
  const [navbarAreaSuggestions, setNavbarAreaSuggestions] = useState([]);
  const [showNavbarAreaSuggestions, setShowNavbarAreaSuggestions] = useState(false);
  const [navbarKeyboardIndex, setNavbarKeyboardIndex] = useState(-1);
  const navbarSearchInputRef = useRef(null);
  
  // Area to Pincode mapping
  const areaPincodeMap = {
    "Abishegapakkam": "605007",
    "Ariyankuppam": "605007",
    "Arumbarthapuram": "605110",
    "Bahoor": "607402",
    "Bommayarpalayam": "605104",
    "Botanical Garden": "605001",
    "Calapet": "605014",
    "Courivinatham": "607402",
    "Dhanvantry Nagar": "605006",
    "Embalam": "605106",
    "Irumbai": "605111",
    "Karayamputhur": "605106",
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

  // Handle navbar area selection
  const handleNavbarAreaSelect = (selectedArea) => {
    const pincode = areaPincodeMap[selectedArea] || "";
    setNavbarSearchValue(selectedArea);
    setFilters(prev => ({
      ...prev,
      area: selectedArea,
      pinCode: pincode
    }));
    setShowNavbarAreaSuggestions(false);
    setNavbarAreaSuggestions([]);
    setSearchPerformed(true); // Mark search as performed
  };

  // Clear search input, hide suggestions, and reset filters
  const handleClearSearch = () => {
    setNavbarSearchValue('');
    setNavbarAreaSuggestions([]);
    setShowNavbarAreaSuggestions(false);
    setFilters(prev => ({
      ...prev,
      area: '',
      pinCode: ''
    }));
    setSearchPerformed(false);
  };

  // Handle keyboard navigation for search bar suggestions
  const handleNavbarKeyDown = (e) => {
    if (!showNavbarAreaSuggestions) return;
    
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
        if (navbarKeyboardIndex >= 0 && navbarKeyboardIndex < navbarAreaSuggestions.length) {
          handleNavbarAreaSelect(navbarAreaSuggestions[navbarKeyboardIndex]);
          setNavbarKeyboardIndex(-1);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowNavbarAreaSuggestions(false);
        setNavbarKeyboardIndex(-1);
        break;
      default:
        break;
    }
  };

        const [hoverSearch, setHoverSearch] = useState(false);
        const [hoverAdvance, setHoverAdvance] = useState(false);
        const [showNoDataModal, setShowNoDataModal] = useState(false);
        const [searchPerformed, setSearchPerformed] = useState(false);
        const filterPopupTriggerRef = useRef(null);
      
        const [advancedFilters, setAdvancedFilters] = useState({
          propertyMode: '', propertyType: '', minPrice: '', maxPrice: '', propertyAge: '', bankLoan: '',
          negotiation: '', length: '', breadth: '', totalArea: '', minTotalArea: '', ownership: '', bedrooms: '',
          minBedrooms: '', kitchen: '', kitchenType: '', balconies: '', floorNo: '', areaUnit: '', propertyApproved: '',
          facing: '', postedBy: '', furnished: '', lift: '', attachedBathrooms: '', minAttachedBathrooms: '',
          western: '', minWestern: '', rentType: '', carParking: '', city: '', phoneNumber: '', state:""
        });
          const activeFilterCount = [
          ...Object.values(filters),
          ...Object.values(advancedFilters)
        ].filter((val) => val !== '').length;
      
        const shouldShowButton = activeFilterCount >= 2;
      

        const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
        const [searchQuery, setSearchQuery] = useState('');
        const [areaSuggestions, setAreaSuggestions] = useState([]);
        const [showAreaSuggestions, setShowAreaSuggestions] = useState(false);
        const [pincodeSuggestions, setPincodeSuggestions] = useState([]);
        const [showPincodeSuggestions, setShowPincodeSuggestions] = useState(false);
      
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

    // Handle area input with suggestions
    if (name === 'area') {
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
    }

    // Handle pincode input with suggestions
    if (name === 'pinCode') {
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
    }

    // setFilters({ ...filters, [name]: value });
    setDropdownState((prevState) => ({ ...prevState, filterText: e.target.value }));

  };

  // Handle area selection from suggestions
  const handleAreaSelect = (selectedArea) => {
    const pincode = areaPincodeMap[selectedArea] || "";
    setFilters(prev => ({
      ...prev,
      area: selectedArea,
      pinCode: pincode
    }));
    setShowAreaSuggestions(false);
    setAreaSuggestions([]);
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

    const handleAdvancedFilterChange = (e) => {
      const { name, value } = e.target;
      setAdvancedFilters((prevState) => ({ ...prevState, [name]: value }));
      setDropdownState((prevState) => ({ ...prevState, filterText: value }));
    };
  const fieldLabels = {
    propertyMode: "Property Mode",
    propertyType: "Property Type",
      rentType: "rent Type",
            minPrice: "min Rental Amount",
 maxPrice: "max Rental Amount",
    rentalAmount: "rental Amount",
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
            </div>
          )
        );
      };
    const filteredProperties = properties.filter((property) => { 
      const basicFilterMatch = 
        (filters.id ? property.rentId?.toString().includes(filters.id) : true) &&
        (filters.propertyMode ? property.propertyMode?.toLowerCase().includes(filters.propertyMode.toLowerCase()) : true) &&
        (filters.propertyType ? property.propertyType?.toLowerCase().includes(filters.propertyType.toLowerCase()) : true) &&
        (filters.rentType ? property.rentType?.toLowerCase().includes(filters.rentType.toLowerCase()) : true) &&
        (filters.bedrooms ? property.bedrooms?.toString().toLowerCase().includes(filters.bedrooms.toLowerCase()) : true) &&
        (filters.floorNo ? property.floorNo?.toString().toLowerCase().includes(filters.floorNo.toLowerCase()) : true) &&
        (filters.city ? property.city?.toLowerCase().includes(filters.city.toLowerCase()) : true) &&
        (filters.state ? property.state?.toLowerCase().includes(filters.state.toLowerCase()) : true) &&
        // Area OR Pincode filter - match if either area OR pincode matches
        (filters.area || filters.pinCode ? 
          (filters.area ? property.area?.toLowerCase() === filters.area.toLowerCase() : false) ||
          (filters.pinCode ? property.pinCode?.toString().includes(filters.pinCode.toString()) : false)
        : true);
   
       const priceMatch = 
         (filters.minPrice ? property.rentalAmount >= Number(filters.minPrice) : true) &&
         (filters.maxPrice ? property.rentalAmount <= Number(filters.maxPrice) : true);
     
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
     
     // Check if area or pincode search returned no results
     // Using new NoPropertyPopup component for this functionality now
     // useEffect(() => {
     //   if ((filters.area || filters.pinCode) && filteredProperties.length === 0 && properties.length > 0) {
     //     setShowNoPropertiesModal(true);
     //     // Show modal with Bootstrap
     //     const modalElement = document.getElementById('noSearchResultsModalPy');
     //     if (modalElement && window.bootstrap) {
     //       const modal = new window.bootstrap.Modal(modalElement);
     //       modal.show();
     //     }
     //   }
     // }, [filteredProperties, filters.area, filters.pinCode, properties.length]);
     
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

     
// useEffect(() => {
//   if (filteredProperties.length > 0 && uploads.length > 0) {
//     const merged = [];
//     let uploadIndex = 0;

//     // Flatten all upload images with `_id` and type
//     const totalUploads = uploads.flatMap(upload =>
//       (upload.images || []).map(img => ({
//         _id: upload._id,
//         img,
//         type: 'upload'
//       }))
//     );

//     // Merge properties with ads
//     filteredProperties.forEach((property, index) => {
//       merged.push({ ...property, type: 'property' });

//       // Every 8 properties, insert up to 8 upload images
//       if ((index + 1) % 8 === 0 && uploadIndex < totalUploads.length) {
//         const nextUploads = totalUploads.slice(uploadIndex, uploadIndex + 8);
//         merged.push(...nextUploads);
//         uploadIndex += nextUploads.length;
//       }
//     });

//     // Optional: Add any remaining uploads at the end
//     if (uploadIndex < totalUploads.length) {
//       merged.push(...totalUploads.slice(uploadIndex));
//     }

//     setMergedData(merged);
//   }
// }, [filteredProperties, uploads]);
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
  // Avoid running logic if both sources are empty
  if (!filteredProperties?.length && !totalUploads?.length) return;

  const merged = [];
  let propertyCounter = 0;
  let uploadIndex = 0;

  for (let i = 0; i < filteredProperties.length; i++) {
    merged.push({ ...filteredProperties[i], type: 'property' });
    propertyCounter++;

    if (propertyCounter === 8 && uploadIndex < totalUploads.length) {
      merged.push(totalUploads[uploadIndex]);
      uploadIndex++;
      propertyCounter = 0;
    }
  }

  // Append remaining uploads
  if (uploadIndex < totalUploads.length) {
    merged.push(...totalUploads.slice(uploadIndex));
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

     useEffect(() => {
       const backdrop = document.querySelector('.modal-backdrop');
       if (isFilterPopupOpen && backdrop) {
         backdrop.style.pointerEvents = 'none';
       }
     }, [isFilterPopupOpen]);
        
     // Handle BACK button in No Property popup - resets filters
     const handleNoPropertyBack = () => {
       setFilters(prev => ({ ...prev, area: '', pinCode: '' }));
       setNavbarSearchValue('');
     };

  // Fetch pincode counts for the area-ticker marquee from the same endpoint
  // the admin Search Pincode page uses, so the numbers always match.
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
      // pincode -> direction lookup, built once from the bundled Chennai data.
      const pincodeToDirection = {};
      chennaiPincodeRows.forEach((row) => {
        if (!(row.pincode in pincodeToDirection)) {
          pincodeToDirection[row.pincode] = row.direction;
        }
      });

      // Sum counts per direction. Pincodes that aren't tagged in our Chennai
      // data are skipped — they'd usually be Pondy stragglers leaking through.
      const directionTotals = {};
      CHENNAI_DIRECTIONS.forEach((d) => { directionTotals[d] = 0; });
      Object.entries(marqueePincodeCounts).forEach(([code, count]) => {
        const dir = pincodeToDirection[code];
        if (dir) directionTotals[dir] += count;
      });

      const areaList = CHENNAI_DIRECTIONS
        .map((d) => ({ label: d, count: directionTotals[d] }))
        .filter((e) => e.count > 0)
        .sort((a, b) => b.count - a.count)
        .map(({ label, count }) => `${label} - ${count}`);

      return { areaList };
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
      if (total > 0) entries.push({ label, count: total });
    });
    Object.entries(pincodeToAreaName).forEach(([code, name]) => {
      if (combinedSubPincodes.has(code)) return;
      const count = marqueePincodeCounts[code] || 0;
      if (count > 0) entries.push({ label: name, count });
    });

    const areaList = entries
      .sort((a, b) => b.count - a.count)
      .map(({ label, count }) => `${label} - ${count}`);

    return { areaList };
  }, [marqueePincodeCounts]);

  return (
    <Container fluid className="p-0 w-100 d-flex align-items-center justify-content-center ">

      
      <Row className="g-3 w-100 ">
        {/* Exclusive Ticker */}
        <Col lg={12} className="p-0 m-0">
          <div
            style={{
              height: "40px",
              display: "flex",
              alignItems: "center",
              background: "linear-gradient(90deg,#0f2027,#203a43,#2c5364)",
              color: "#fff",
              borderRadius: "8px",
              padding: "0 10px",
              fontWeight: "500",
            }}
          >
            <marquee behavior="scroll" direction="left" scrollamount="6">
              {areaPropertySummary.areaList.length > 0 && (
                <>✨&nbsp; {areaPropertySummary.areaList.join('  |  ')} &nbsp;✨</>
              )}
            </marquee>
          </div>
        </Col>

        {/* Modern Horizontal Search Bar - commented out */}
        {false && (
        <Col lg={12} className="p-0 m-0">
          <div style={{
            width: '100%',
            padding: '2px 2px',
            background: 'linear-gradient(135deg, #f5f6ff 0%, #ffffff 100%)',
            borderBottom: '1px solid #e8e8ff',
            position: 'relative'
          }}>
            <div style={{
              maxWidth: '1000px',
              margin: '0 auto',
              position: 'relative'
            }}>
              {/* Modern Pill-Shaped Search Bar Container */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f2ff 100%)',
                  borderRadius: '50px',
                  boxShadow: '0 8px 32px rgba(79, 75, 126, 0.12)',
                  overflow: 'hidden',
                  border: '2px solid #e0e5ff',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'text',
                  padding: '8px 12px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(79, 75, 126, 0.18)';
                  e.currentTarget.style.borderColor = '#4F4B7E';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f5f7ff 0%, #e8ebff 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(79, 75, 126, 0.12)';
                  e.currentTarget.style.borderColor = '#e0e5ff';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f0f2ff 100%)';
                }}
              >
                {/* Search Icon Left */}
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px 14px',
                    color: '#4F4B7E',
                    transition: 'all 0.3s ease',
                    fontSize: '16px'
                  }}
                >
                  <BiSearchAlt size={20} />
                </span>

                {/* Search Input with Clear Button */}
                <div style={{ flex: '1', position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    ref={navbarSearchInputRef}
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
                    placeholder="🔍 Enter Area Name or Pincode"
                    aria-label="Search properties by area or pincode"
                    style={{
                      flex: '1',
                      padding: '12px 10px',
                      paddingRight: navbarSearchValue ? '36px' : '10px',
                      fontSize: '15px',
                      border: 'none',
                      outline: 'none',
                      color: '#333',
                      background: 'transparent',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.3px'
                    }}
                  />
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
                  {navbarAreaSuggestions.map((areaItem, index) => (
                    <div
                      key={index}
                      onMouseDown={() => handleNavbarAreaSelect(areaItem)}
                      style={{
                        padding: '12px 20px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        borderBottom: index !== navbarAreaSuggestions.length - 1 ? '1px solid #f0f0f5' : 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: navbarKeyboardIndex === index ? '#f8f9ff' : 'transparent',
                        position: 'relative',
                        overflow: 'hidden',
                        paddingLeft: navbarKeyboardIndex === index ? '28px' : '20px'
                      }}
                      onMouseEnter={(e) => {
                        setNavbarKeyboardIndex(index);
                        e.currentTarget.style.background = '#f8f9ff';
                        e.currentTarget.style.paddingLeft = '28px';
                      }}
                      onMouseLeave={(e) => {
                        setNavbarKeyboardIndex(-1);
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.paddingLeft = '20px';
                      }}
                    >
                      <span style={{ color: '#333', fontWeight: 500, fontSize: '13px', letterSpacing: '0.1px' }}>{areaItem}</span>
                      <span style={{ color: '#a8a8d8', fontSize: '11px', marginLeft: '12px', fontWeight: 400 }}>– {areaPincodeMap[areaItem]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Col>
        )}
        <Col lg={12} className="d-flex align-items-center justify-content-center">
           
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

      {/* Area Field */}
      <div className="form-group">
        <label style={{width:'100%'}}>
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              width: "100%",
              boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
              position: "relative",
            }} 
            className="rounded-2"
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 14px",
                borderRight: "1px solid #4F4B7E",
                background: "#fff",
              }}
            >
              {fieldIcons.area}
            </span>
            <input
              type="text"
              name="area"
              value={filters.area}
              onChange={handleFilterChange}
              onFocus={() => {
                if (filters.area && areaSuggestions.length > 0) {
                  setShowAreaSuggestions(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowAreaSuggestions(false), 200);
              }}
              className="form-input m-0"
              placeholder="Select Area"
              style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none', color: "grey" }}
            />
            {filters.area && (
              <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
            )}
            
            {/* Area Suggestions Dropdown */}
            {showAreaSuggestions && areaSuggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#fff',
                  border: '1px solid #e0e5ff',
                  borderRadius: '0 0 10px 10px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 100,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  marginTop: '-1px'
                }}
              >
                {areaSuggestions.map((area, index) => (
                  <div
                    key={index}
                    onMouseDown={() => handleAreaSelect(area)}
                    style={{
                      padding: '10px 12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f5',
                      color: '#333',
                      fontSize: '13px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8f9ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                    }}
                  >
                    {area}
                  </div>
                ))}
              </div>
            )}
          </div>
        </label>
      </div>

      {/* Pincode Field */}
      <div className="form-group">
        <label style={{width:'100%'}}>
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              width: "100%",
              boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
              position: 'relative'
            }} 
            className="rounded-2"
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 14px",
                borderRight: "1px solid #4F4B7E",
                background: "#fff",
              }}
            >
              📮
            </span>
            <input
              type="text"
              name="pinCode"
              value={filters.pinCode}
              onChange={handleFilterChange}
              onFocus={() => {
                if (filters.pinCode && pincodeSuggestions.length > 0) {
                  setShowPincodeSuggestions(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowPincodeSuggestions(false), 200);
              }}
              className="form-input m-0"
              placeholder="Select Pincode"
              style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none', color: "grey" }}
            />
            {filters.pinCode && (
              <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
            )}
            
            {/* Pincode Suggestions Dropdown */}
            {showPincodeSuggestions && pincodeSuggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#fff',
                  border: '1px solid #e0e5ff',
                  borderRadius: '0 0 10px 10px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 100,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  marginTop: '-1px'
                }}
              >
                {pincodeSuggestions.map((pincode, index) => (
                  <div
                    key={index}
                    onMouseDown={() => handlePincodeSelect(pincode)}
                    style={{
                      padding: '10px 12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f5',
                      color: '#333',
                      fontSize: '13px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8f9ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                    }}
                  >
                    {pincode}
                  </div>
                ))}
              </div>
            )}
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
        {/* City */}
      
      <div className="form-group">
        {/* <label>City:</label> */}
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
           {fieldIcons.city || <FaHome />} 
        </span>
        <input
            type="text"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            className="form-input m-0"
            placeholder="City"
              style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
          />
        </div>
         {filters.city && (
            <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
          )}
      </div></div>
 
 
 
    
      
        </div>
      {/* Advance Filter Button */}
         <div className="text-center mt-3 ">
         <button  aria-label="Close"  data-bs-dismiss="modal"
         type="button"
         className="btn w-100"
         style={{
           backgroundColor: hoverSearch ? '#4f4b7e' : '#4F4B7E',
           color: '#fff',
           border: 'none',
         }}
         onMouseEnter={() => setHoverSearch(true)}
         onMouseLeave={() => setHoverSearch(false)}
         // onClick={applyFilters}
       >
         SEARCH
       </button>
 
       <button
         type="button"
         className="btn w-100 mt-3"
         style={{
           backgroundColor: hoverAdvance ? '#4F4B7E' : 'transparent',
           color: hoverAdvance ? '#fff' : '#4F4B7E',
           border: `1px solid #4F4B7E`,
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
        {/* City */}
      
      <div className="form-group">
        {/* <label>City:</label> */}
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
           {fieldIcons.city || <FaHome />} 
        </span>
        <input
            type="text"
            name="city"
            value={advancedFilters.city}
            onChange={handleAdvancedFilterChange}
            className="form-input m-0"
            placeholder="City"
              style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
          />
        </div>
         {advancedFilters.city && (
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
            type="text"
            name="phoneNumber"
            value={phoneNumber}
            readOnly
            className="form-input m-0"
            placeholder="Phone Number"
              style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
          />
        </div>
            <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
          </div>
      </div>
   
        </div>
       {/* )}  */}
     <div className="text-center mt-3 ">
         <button
                   data-bs-dismiss="modal"
 
           type="button"
           className="btn w-100"
           style={{
             backgroundColor: hoverSearch ? '#4F4B7E' : '#4F4B7E',
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

      <div className="w-100">
      {error && <p style={{ color: "red" }}>{error}</p>}   
      <div style={{ overflowY: 'auto', fontFamily:"Inter, sans-serif" }}>
        {loading ? (
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
) : mergedData.length === 0 && !showNoDataModal ? (
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
    <p>No properties available.</p>
  </div>
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
          onClick={() => handleCardClick(property.rentId, property.phoneNumber)}
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
         <div className="col-md-8 col-8 " style={{paddingLeft:"10px", paddingTop:"7px" , background: clickedProperties.includes(property.rentId) ? "#ffffff" : "#F9F9F9",}}>
         <div className="d-flex justify-content-between"><p className="m-0" style={{ color:'#5E5E5E' , fontWeight:500 , fontSize:"13px"}}>{property.propertyMode
  ? property.propertyMode.charAt(0).toUpperCase() + property.propertyMode.slice(1)
  : 'N/A'} 
</p>  
<p className="m-0 pe-5">{property.locationCoordinates ? <img src={maplocation} alt="" width={15} /> : ""}</p>
          </div>
         <p className="fw-bold m-0 " style={{ color:clickedProperties.includes(property.rentId) ? "#F76F00" : "#000000", fontSize:"15px" }}>{property.propertyType 
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
   <img src={indianprice} alt="" width={8} className="me-2" />
  {typeof property.rentalAmount === 'string' && property.rentalAmount === 'On Demand'
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
      <FloatingSearchButton />
      <TenantSearchModal
        isOpen={isTenantSearchOpen}
        onClose={() => setIsTenantSearchOpen(false)}
      />
      <style>{`
        input::placeholder {
          color: #9b94d4 !important;
          opacity: 1 !important;
        }
        input:focus::placeholder {
          color: #b3afd9 !important;
        }
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
      `}</style>
      </Container>
  );
};

export default PyProperty;



      {/* {loading ? (
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
) : filteredProperties.length > 0 ? ( 
  filteredProperties.map((property) => (
         
          <div 
          key={property._id}
          className="card mb-3 shadow rounded-4"
          style={{ width: '100%', height: 'auto', background: '#F9F9F9', overflow:'hidden' }}
          onClick={() => handleCardClick(property.rentId, property.phoneNumber)}
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
      ? `https://rentpondy.com/RENT/${property.photos[0].replace(/\\/g, "/").replace(/^\/+/, "")}`
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
         <div className="col-md-8 col-8 " style={{paddingLeft:"10px", paddingTop:"7px" , background: clickedProperties.includes(property.rentId) ? "#ffffff" : "#F9F9F9",}}>
          <div className="d-flex justify-content-start"><p className="m-0" style={{ color:'#5E5E5E' , fontWeight:500 , fontSize:"13px"}}>{property.propertyMode
  ? property.propertyMode.charAt(0).toUpperCase() + property.propertyMode.slice(1)
  : 'N/A'}
</p> 
          </div>
         <p className="fw-bold m-0 " style={{ color:clickedProperties.includes(property.rentId) ? "#F76F00" : "#000000", fontSize:"15px" }}>{property.propertyType 
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
                 <img src={postedby} alt="" width={12} className="me-2"/>
                 <span style={{ fontSize:'13px', color:'#5E5E5E' ,fontWeight: 500 }}>
                 {property.postedBy
  ? property.postedBy.charAt(0).toUpperCase() + property.postedBy.slice(1)
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
   <img src={indianprice} alt="" width={8} className="me-2" />
  {typeof property.rentalAmount === 'string' && property.rentalAmount === 'On Demand'
    ? 'On Demand'
    : property.rentalAmount
      ? formatPrice(property.rentalAmount)
      : 'N/A'}
</span>

         <span style={{ color: '#4F4B7E', fontSize: '13px', marginLeft: "5px", fontSize: '11px' }}>
              {property.negotiation ? 'Negotiable' : 'Not Negotiable'}
            </span>
                  </h6>
               </div>
              </div>
            </div>
          </div>
</div>

        </div>
        )) ) : (
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

// {loading ? (
//   // Loading spinner
// ) : mergedData.length === 0 && filteredProperties.length === 0 ? (
//   // Show "No properties found"
// ) : (
//   // Render cards
// )}



























