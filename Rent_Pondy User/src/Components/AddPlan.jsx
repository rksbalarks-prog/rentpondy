




// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// // import { FaChevronDown, FaPhone } from "react-icons/fa";
// import imge from "../Assets/ppbuyer.png";
// import { RiCloseCircleFill, RiLayoutLine } from 'react-icons/ri';
// import { TbArrowLeftRight, TbMapPinCode, TbWorldLongitude } from 'react-icons/tb';
// import {FaPhoneAlt, FaRulerCombined,  FaBath, FaChartArea, FaPhone ,FaEdit,FaRoad,FaCreditCard,FaLandmark, FaHome, FaUserAlt, FaEnvelope,  FaRupeeSign , FaFileVideo , FaToilet,FaCar,FaBed,  FaCity , FaTimes, FaArrowRight, FaStreetView, FaSearch, FaHandHoldingUsd, FaUsers, FaUtensils, FaBriefcase, FaDog,FaArrowLeft, FaChevronLeft} from 'react-icons/fa';
// import {  FaRegAddressCard, FaChevronDown } from 'react-icons/fa6';
// import { MdLocationOn, MdOutlineMeetingRoom, MdOutlineOtherHouses, MdSchedule , MdStraighten , MdApproval, MdLocationCity , MdAddPhotoAlternate, MdKeyboardDoubleArrowDown, MdOutlineClose} from "react-icons/md";
// import { BsBank, BsBuildingsFill, BsFillHouseCheckFill , BsTextareaT} from "react-icons/bs";
// import { GiKitchenScale, GiMoneyStack , GiResize , GiGears} from "react-icons/gi";
// import { HiUserGroup } from "react-icons/hi";
// import { BiBuildingHouse , BiMap, BiWorld} from "react-icons/bi";
// import {   FaFileAlt, FaGlobeAmericas, FaMapMarkerAlt, FaMapSigns } from "react-icons/fa";
// import {MdElevator ,MdOutlineChair ,MdPhone, MdOutlineAccessTime, MdTimer, MdHomeWork, MdHouseSiding, MdOutlineKitchen, MdEmail, } from "react-icons/md";
// import {  BsBarChart, BsGraphUp } from "react-icons/bs";
// import { BiBuilding, BiStreetView } from "react-icons/bi";
// import { GiStairs, GiForkKnifeSpoon, GiWindow } from "react-icons/gi";
// import { AiOutlineEye, AiOutlineColumnWidth, AiOutlineColumnHeight } from "react-icons/ai";
// import { BiBed, BiBath, BiCar, BiCalendar, BiUser, BiCube } from "react-icons/bi";
// import { useNavigate, useParams } from "react-router-dom";
// import minprice from "../Assets/Price Mini-01.png";
// import maxprice from "../Assets/Price maxi-01.png";
// import { FcSearch } from "react-icons/fc";
// import { toWords } from 'number-to-words';



// const PropertyAssistance = ({  existingData }) => {

//     const {phoneNumber} = useParams();

//     const [hovered, setHovered] = useState(false);
//       const [priceInWords, setPriceInWords] = useState("");
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
//     const [isScrolling, setIsScrolling] = useState(false);
  
//     useEffect(() => {
//       let scrollTimeout;
  
//       const handleScroll = () => {
//         setIsScrolling(true);
  
//         clearTimeout(scrollTimeout);
//         scrollTimeout = setTimeout(() => {
//           setIsScrolling(false);
//         }, 150); // Adjust the delay as needed
//       };
  
//       window.addEventListener("scroll", handleScroll);
  
//       return () => {
//         clearTimeout(scrollTimeout);
//         window.removeEventListener("scroll", handleScroll);
//       };
//     }, []);  
//       const [citySuggestions, setCitySuggestions] = useState([]);
//   const [areaSuggestions, setAreaSuggestions] = useState([]);
//   const cityTimeoutRef = useRef(null);
//   const areaTimeoutRef = useRef(null);
  
//     const baseStyle = {
//       backgroundColor: "#019988",
//       color: "#fff",
//       border: "none",
//       padding: "8px 16px",
//       borderRadius: "5px",
//       cursor: "pointer",
//       transition: "background-color 0.3s ease",
//     };
  
//     const hoverStyle = {
//       backgroundColor: "#017a6e",
//     };
//       const suggestionListStyle = {
//   listStyle: "none",
//   margin: 0,
//   padding: "5px",
//   border: "1px solid #ccc",
//   borderTop: "none",
//   maxHeight: "150px",
//   overflowY: "auto",
//   position: "absolute",
//   width: "100%",
//   background: "#ffffff",
//   zIndex: 1000,
// };

// const suggestionItemStyle = {
//   padding: "8px 10px",
//   cursor: "pointer",
// };

// const suggestionItemHoverStyle = {
//   backgroundColor: "#f0f0f0",
// };
//   // Function to handle price selection
//   const handlePriceSelect = (priceType, price) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       [priceType]: price,
//     }));
//     toggleDropdown(null); // Close the dropdown after selecting an option
//   };

//   const [formData, setFormData] = useState({
//     phoneNumber: phoneNumber || "",
//     altPhoneNumber: "",
//     city: "",
//     area: "",
//     minPrice: "",
//     maxPrice: "",
//     facing:"",
//     // areaUnit: "",
//     bedrooms: "",
//     propertyMode: "",
//     propertyType: "",
//    rentType:"",
//     numberOfFloors:"",
//     requirementType:"",
//      familyMembers:"",
//   foodHabit:"",
//   jobType:"",
//   petAllowed:"",
//     state: "",
//     description: "",
//     raName:"",
//     alternatePhone:""
//   });

//   const [paymentTypes, setPaymentTypes] = useState([]);
//   const fieldIcons = {
//     // Contact Details
//     phoneNumber: <FaPhone color="#4F4B7E" />,
//     alternatePhone: <FaPhone color="#4F4B7E" />,
//     email: <FaEnvelope color="#4F4B7E" />,
//     propertyType: <MdSchedule color="#4F4B7E" />,
    
//     // Property Location
//     rentalPropertyAddress: <MdLocationCity color="#4F4B7E" />,
//     country: <BiWorld color="#4F4B7E" />,
//     state: <MdLocationCity color="#4F4B7E" />,
//     city: <FaCity color="#4F4B7E" />,
//     district: <FaRegAddressCard color="#4F4B7E" />,
//     area: <MdLocationOn color="#4F4B7E" />,
//     streetName: <RiLayoutLine color="#4F4B7E" />,
//     doorNumber: <BiBuildingHouse color="#4F4B7E" />,
//     nagar: <FaRegAddressCard color="#4F4B7E" />,
  
//     // Ownership & Posting Info
//     ownerName: <FaUserAlt color="#4F4B7E" />,
//     postedBy: <FaUserAlt color="#4F4B7E" />,
//     ownership: <HiUserGroup color="#4F4B7E" />,
  
//     // Property Details
//     propertyMode: <MdApproval color="#4F4B7E" />,
//     propertyType: <MdOutlineOtherHouses color="#4F4B7E" />,
//     propertyApproved: <BsFillHouseCheckFill color="#4F4B7E" />,
//     propertyAge: <MdSchedule color="#4F4B7E" />,
//     description: <BsTextareaT color="#4F4B7E" />,
  
//     // Pricing & Financials
//     rentalAmount: <FaRupeeSign color="#4F4B7E" />,
//     bankLoan: <BsBank color="#4F4B7E" />,
//     negotiation: <GiMoneyStack color="#4F4B7E" />,
  
//     // Measurements
//     length: <MdStraighten color="#4F4B7E" />,
//     breadth: <MdStraighten color="#4F4B7E" />,
//     totalArea: <GiResize color="#4F4B7E" />,
//     areaUnit: <FaChartArea color="#4F4B7E" />,

//      rentType: <FaHandHoldingUsd color="#4F4B7E" />,
//   requirementType: <MdApproval color="#4F4B7E" />,
//   familyMembers: <FaUsers color="#4F4B7E" />,
//   foodHabit: <FaUtensils color="#4F4B7E" />,
//   jobType: <FaBriefcase color="#4F4B7E" />,
//   petAllowed: <FaDog color="#4F4B7E" />,
  
//     // Room & Floor Details
//     bedrooms: <FaBed color="#4f4b7e01" />,
//     kitchen: <GiKitchenScale color="#4F4B7E" />,
//     kitchenType: <GiKitchenScale color="#4F4B7E" />,
//     balconies: <MdOutlineMeetingRoom color="#4F4B7E" />,
//     floorNo: <BsBuildingsFill color="#4F4B7E" />,
//     numberOfFloors: <BsBuildingsFill color="#4F4B7E" />,
//     attachedBathrooms: <FaBath color="#4F4B7E" />,
//     western: <FaToilet  color="#4F4B7E" />,
  
//     // Features & Amenities
//     facing: <TbArrowLeftRight color="#4F4B7E" />,
//     salesMode: <GiGears color="#4F4B7E" />,
//     salesType: <MdOutlineOtherHouses color="#4F4B7E" />,
//     furnished: <FaHome color="#4F4B7E" />,
//     lift: <BsBuildingsFill color="#4F4B7E" />,
//     carParking: <FaCar color="#4F4B7E" />,
//   };
//   const fieldLabels = {
//   propertyMode: "Property Mode",
//   propertyType: "Property Type",
//   rentalAmount: "rentalAmount",
//   propertyAge: "Property Age",
//   bankLoan: "Bank Loan",
//   negotiation: "Negotiation",
//   length: "Length",
//   breadth: "Breadth",
//   totalArea: "Total Area",
//   ownership: "Ownership",
//   bedrooms: "Bedrooms",
//   kitchen: "Kitchen",
//   kitchenType: "Kitchen Type",
//   balconies: "Balconies",
//   floorNo: "Floor No.",
//   areaUnit: "Area Unit",
//   propertyApproved: "Property Approved",
//   postedBy: "Posted By",
//   facing: "Facing",
//  rentType:"rentType",
//     requirementType:"requirementType",
//      familyMembers:"familyMembers",
//   foodHabit:"foodHabit",
//   jobType:"jobType",
//   petAllowed:"petAllowed",
//   securityDeposit:"securityDeposit",
//   availableDate:"availableDate",
//   description: "Description",
//   furnished: "Furnished",
//   lift: "Lift",
//   attachedBathrooms: "Attached Bathrooms",
//   western: "Western Toilet",
//   numberOfFloors: "Number of Floors",
//   state: "Car Parking",
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
//     paymentType: "payment Type",

//   email: "Email",
//   phoneNumber: "Phone Number",
//   phoneNumberCountryCode: "Phone Country Code",
//   alternatePhone: "Alternate Phone",
//   alternatePhoneCountryCode: "Alternate Phone Country Code",
// };
// const handleFilterChange = (e) => {
//     setDropdownState((prevState) => ({ ...prevState, filterText: e.target.value }));
//   };

// const renderDropdown = (field) => {
//   const options = dataList[field] || [];
//   const filteredOptions = options.filter((option) =>
//     option.toLowerCase().includes(dropdownState.filterText.toLowerCase())
//   );

//   return (
//     <div data-field={field}>
//       {dropdownState.activeDropdown === field && (
//         <div
//           className="popup-overlay"
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100vw',
//             height: '100vh',
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             zIndex: 1509,
//             animation: 'fadeIn 0.3s ease-in-out',
//           }}
//         >
//           <div
//             className="dropdown-popup"
//             style={{
//               position: 'fixed',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               backgroundColor: 'white',
//               width: '100%',
//               maxWidth: '300px',
//               padding: '10px',
//               zIndex: 10,
//               boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',
//               borderRadius: '18px',
//               animation: 'popupOpen 0.3s ease-in-out',
//             }}
//           >
//             <div
//               className="p-1"
//               style={{
//                 fontWeight: 500,
//                 fontSize: '15px',
//                 marginBottom: '10px',
//                 textAlign: 'start',
//                 color: 'grey',
//               }}
//             >
//               Select or Search{' '}
//               <span style={{ color: '#0B57CF', fontWeight: 500 }}>
//                 {fieldLabels[field] || 'Property Field'}
//               </span>
//             </div>
//             <div
//               className="mb-1"
//               style={{
//                 position: 'relative',
//                 width: '100%',
//                 background: '#EEF4FA',
//                 borderRadius: '25px',
//               }}
//             >
//               <FcSearch
//                 size={16}
//                 style={{
//                   position: 'absolute',
//                   left: '10px',
//                   top: '50%',
//                   transform: 'translateY(-50%)',
//                   pointerEvents: 'none',
//                   color: 'black',
//                 }}
//               />
//               <input
//                 className="m-0 rounded-0 ms-1"
//                 type="text"
//                 placeholder="Filter options..."
//                 value={dropdownState.filterText}
//                 onChange={handleFilterChange}
//                 style={{
//                   width: '100%',
//                   padding: '5px 5px 5px 30px', // left padding for the icon
//                   background: 'transparent',
//                   border: 'none',
//                   outline: 'none',
//                 }}
//               />
//             </div>

//             <ul
//               style={{
//                 listStyleType: 'none',
//                 padding: 0,
//                 margin: 0,
//                 overflowY: 'auto',
//                 maxHeight: '350px',
//               }}
//             >
//               {filteredOptions.map((option, index) => (
//                 <li
//                   key={index}
//                 onClick={() => {
//   setFormData((prevState) => ({
//     ...prevState,
//     [field]: option,
//   }));

//   toggleDropdown(field); // Close current dropdown

//   const currentIndex = dropdownFieldOrder.indexOf(field);
//   if (currentIndex !== -1 && currentIndex < dropdownFieldOrder.length - 1) {
//     const nextField = dropdownFieldOrder[currentIndex + 1];

//     if (nonDropdownFields.includes(nextField)) {
//       // Focus the next input field and scroll to it
//       setTimeout(() => {
//         const nextInput = document.querySelector(`[name="${nextField}"]`);
//         if (nextInput) {
//           nextInput.focus();
//           nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//       }, 150);
//     } else {
//       // Open next dropdown and scroll it into view
//       setTimeout(() => {
//         toggleDropdown(nextField);
//         setTimeout(() => {
//           const el = document.querySelector(`[data-field="${nextField}"]`);
//           if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }, 100);
//       }, 0);
//     }
//   }
// }}

//                   style={{
//                     fontWeight: 300,
//                     padding: '5px',
//                     cursor: 'pointer',
//                     color: 'grey',
//                     marginBottom: '5px',
//                     borderBottom: '1px solid #D0D7DE',
//                   }}
//                 >
//                   {option}
//                 </li>
//               ))}
//             </ul>

//             <div className="d-flex justify-content-end">
//               <button
//                 className="me-1"
//                 type="button"
//                onClick={() => {
//     toggleDropdown(field); // Close current dropdown

//     const currentIndex = dropdownFieldOrder.indexOf(field);

//     if (currentIndex > 0) {
//       const prevField = dropdownFieldOrder[currentIndex - 1];

//       if (nonDropdownFields.includes(prevField)) {
//         setTimeout(() => {
//           const prevInput = document.querySelector(`[name="${prevField}"]`);
//           if (prevInput) {
//             prevInput.focus();
//             prevInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
//           }
//         }, 100);
//       } else {
//         setTimeout(() => {
//           toggleDropdown(prevField); // Open prev dropdown
//           setTimeout(() => {
//             const el = document.querySelector(`[data-field="${prevField}"]`);
//             if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
//           }, 100);
//         }, 0);
//       }
//     }
//   }}
//                 style={{
//                   background: '#EAEAF6',
//                   cursor: 'pointer',
//                   border: 'none',
//                   color: '#0B57CF',
//                   borderRadius: '10px',
//                   padding: '5px 10px',
//                   fontWeight: 500,
//                 }}
//               >
//                 Prev
//               </button>

//               <button
//                 type="button"
//                 onClick={() => toggleDropdown(field)}
//                 style={{
//                   background: '#0B57CF',
//                   cursor: 'pointer',
//                   border: 'none',
//                   color: '#fff',
//                   borderRadius: '10px',
//                 }}
//               >
//                 Close
//               </button>
//             </div>

        
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
//   const nonDropdownFields = ["alternatePhone", "totalArea", "baName", "city", "area", "description",];

// const dropdownFieldOrder = [
//     "minPrice",
//   "maxPrice",
//    "altPhoneNumber",
//   "propertyMode",
//   "propertyType",
//   "bedrooms",
// "facing",
// "rentType",
// "numberOfFloors",
// "requirementType",
// "familyMembers",
// "foodHabit",
// "jobType",
// "petAllowed",
//     // "totalArea",
//   "areaUnit",
//   "raName",
//   "state",
//   "city",
//   "phoneNumber"
// ];

//     const fetchCitySuggestions = (input) => {
//   clearTimeout(cityTimeoutRef.current);
//   cityTimeoutRef.current = setTimeout(async () => {
//     if (!input) return setCitySuggestions([]);
//     try {
//       const res = await axios.get(`${process.env.REACT_APP_API_URL}/cities?search=${input}`);
//       setCitySuggestions(res.data.data);
//     } catch (err) {
//       setCitySuggestions([]);
//     }
//   }, 300);
// };

// const fetchAreaSuggestions = (input) => {
//   clearTimeout(areaTimeoutRef.current);
//   areaTimeoutRef.current = setTimeout(async () => {
//     if (!input) return setAreaSuggestions([]);
//     try {
//       const res = await axios.get(`${process.env.REACT_APP_API_URL}/areas?search=${input}`);
//       setAreaSuggestions(res.data.data);
//     } catch (err) {
//       setAreaSuggestions([]);
//     }
//   }, 300);
// };

//   useEffect(() => {
//     fetchPaymentTypes();
//   }, []);
  
//   const fetchPaymentTypes = async () => {
//     try {
//       const res = await axios.get(`${process.env.REACT_APP_API_URL}/payment-all`);
//       setPaymentTypes(res.data); // Expected format: [{ paymentType: "Online" }, { paymentType: "Cash" }, ...]
//     } catch (error) {
//     }
//   };
// const navigate = useNavigate();
  
//   const [dataList, setDataList] = useState({});
//   const [dropdownState, setDropdownState] = useState({ activeDropdown: null, filterText: "" });

//   const [message, setMessage] = useState("");
// const [showPopup, setShowPopup] = useState(false);
// const [showConfirmPopup, setShowConfirmPopup] = useState(false);


// const handleSubmit = (e) => {
//   e.preventDefault();

//   const errors = [];

//   if (!formData.state) errors.push("State is required");
//   if (!formData.propertyType) errors.push("Property Type is required");
//   if (!formData.propertyMode) errors.push("Property Mode is required");
//   if (!formData.minPrice) errors.push("Min Price is required");
//   if (!formData.maxPrice) errors.push("Max Price is required");

//   if (errors.length > 0) {
//     alert(errors.join("\n"));
//     return;
//   }

//   setShowConfirmPopup(true); // all fields are valid
// };




//   useEffect(() => {
//     fetchDropdownData();
//     if (existingData) {
//       setFormData(existingData);
//     }
//   }, [existingData]);

//   const fetchDropdownData = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-rent-excel`);
//       const groupedData = response.data.data.reduce((acc, item) => {
//         if (!acc[item.field]) acc[item.field] = [];
//         acc[item.field].push(item.value);
//         return acc;
//       }, {});
//       setDataList(groupedData);
//     } catch (error) {
//     }
//   };

//   const toggleDropdown = (field) => {
//     setDropdownState((prevState) => ({ activeDropdown: prevState.activeDropdown === field ? null : field, filterText: "" }));
//   };

//   const handleDropdownSelect = (field, value) => {
//     setFormData((prevState) => ({ ...prevState, [field]: value }));
//     setDropdownState({ activeDropdown: null, filterText: "" });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({ ...prevState, [name]: value }));
//   };

//  const handleInputChanges = (e) => {
//   const { name, value } = e.target;
//   setFormData((prev) => ({ ...prev, [name]: value }));

//   if (name === 'city') {
//     fetchCitySuggestions(value);
//   } else if (name === 'area') {
//     fetchAreaSuggestions(value);
//   }
// };

//     const handleFieldChange = (e) => {
//       const { name, value } = e.target;
//       setFormData((prev) => ({
        
//         ...prev,
//         [name]: name === "description" && value.length > 0 
//           ? value.charAt(0).toUpperCase() + value.slice(1)  // Capitalize only "description"
//           : value,
          
//       }));
//         // Handle price conversion
//     if (name === "rentalAmount") {
//       if (value !== "" && !isNaN(value)) {
//         setPriceInWords(convertToIndianRupees(value));
//       } else {
//         setPriceInWords("");
//       }
//     }
//   };
//      const convertToIndianRupees = (num) => {
//         const number = parseInt(num, 10);
//         if (isNaN(number)) return "";
      
//         if (number >= 10000000) {
//           return (number / 10000000).toFixed(2).replace(/\.00$/, '') + " crores";
//         } else if (number >= 100000) {
//           return (number / 100000).toFixed(2).replace(/\.00$/, '') + " lakhs";
//         } else {
//           return toWords(number).replace(/\b\w/g, l => l.toUpperCase()) + " rupees";
//         }
//       };
  
// // const handleConfirmSubmit = async () => {
// //   setShowConfirmPopup(false); // hide the confirm popup

// //   try {
// //     let response;

// //     if (formData._id) {
// //       // Update existing request
// //       response = await axios.put(
// //         `${process.env.REACT_APP_API_URL}/update-buyerAssistance-rent/${formData._id}`,
// //         formData
// //       );
// //       setMessage("Buyer Assistance request updated successfully!");
// //     } else {
// //       // Create new request
// //       response = await axios.post(
// //         `${process.env.REACT_APP_API_URL}/add-buyerAssistance-rent`,
// //         formData
// //       );
// //       setFormData(response.data.data); // Save returned formData with IDs etc.
// //       setMessage("Buyer Assistance request added successfully!");
// //     }

// //     setShowPopup(true);
     
// //   } catch (error) {
// //     setMessage({ text: "Please fill all required fields correctly.", type: "error" });
// //     setShowPopup(true);
// //     setTimeout(() => {
// //       setShowPopup(false);
// //       setMessage("");
// //     }, 3000);
// //   }
// // };


// const handleConfirmSubmit = async () => {
//   setShowConfirmPopup(false); // hide the confirm popup

//   try {
//     let response;

//     if (formData._id) {
//       // Update existing request
//       response = await axios.put(
//         `${process.env.REACT_APP_API_URL}/update-buyerAssistance-rent/${formData._id}`,
//         formData
//       );
//       setMessage("Buyer Assistance request updated successfully!");
//     } else {
//       // Create new request
//       response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/add-buyerAssistance-rent`,
//         formData
//       );
//       setFormData(response.data.data); // Save returned formData with IDs etc.
//       setMessage("Buyer Assistance request added successfully!");
//     }

//     setShowPopup(true);

//     setTimeout(() => {
//       setShowPopup(false);
//       setMessage("");

//       // Extract ba_id and phoneNumber from response.data.data (backend sends ba_id)
//       const raId = response?.data?.data?.Ra_Id || formData.Ra_Id;
//       const phone = response?.data?.data?.phoneNumber || formData.phoneNumber || phoneNumber;

//       if (raId && phone) {
//         navigate("/buyer-plan", {
//           state: {
//             raId,      // pass buyer assistance ID as baId
//             phoneNumber: phone, // pass phone number
//           },
//         });
//       } else {
//         setMessage({ text: "Missing buyer assistance ID or phone number", type: "error" });
//       }
//     }, 3000);
//   } catch (error) {
//     setMessage({ text: "Please fill all required fields correctly.", type: "error" });
//     setShowPopup(true);
//     setTimeout(() => {
//       setShowPopup(false);
//       setMessage("");
//     }, 3000);
//   }
// };


//   return (
//     <div className="property-form-container p-1" style={{  overflowY: "auto",  position: "relative", scrollbarWidth: "none" ,  fontFamily: "Inter, sans-serif",}}>
//       {/* <img src={imge} alt="" className="header-image"  style={{width:'100%'}}/>
//       <div className="w-100 d-flex justify-content-around align-items-center mt-3">
     
//         <button style={{
//           ...baseStyle,
//           opacity: 0.6,
//           cursor: "not-allowed",
//         }}
//         disabled
//         >Add Buyer Assistant</button>
//         <button   style={{
//           ...baseStyle,
//           ...(hovered ? hoverStyle : {}),
//         }}
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//         onClick={() => navigate(`/Buyer-List-Filter`)}

//    >view Buyer List</button>



//       </div> */}

//         <div className="d-flex flex-column mx-auto custom-scrollbar"
//     style={{
//       maxWidth: '450px',
//       height: '100vh',
//       overflow: 'auto',
//       scrollbarWidth: 'none', 
//       msOverflowStyle: 'none', 
//       fontFamily: 'Inter, sans-serif'
//     }}>

//                 <div className="d-flex align-items-center justify-content-start w-100 p-2"      style={{
//         background: "#EFEFEF",
//         position: "sticky",
//         top: 0,
//         zIndex: 1000,
//         opacity: isScrolling ? 0 : 1,
//         pointerEvents: isScrolling ? "none" : "auto",
//         transition: "opacity 0.3s ease-in-out",
//       }}>
//                   <button
//                        onClick={() => navigate(-1)}
//                className="d-flex align-items-center justify-content-center ps-3 pe-2"
//                        style={{
//           background: "transparent",
//       border: "none",
//       height: "100%",color:"#CDC9F9",
//         cursor: 'pointer',
//         transition: 'all 0.3s ease-in-out',
  
//       }}
//                          onMouseEnter={(e) => {
//         e.currentTarget.style.color = '#f0f4f5'; // Change background
//         e.currentTarget.querySelector('svg').style.color = '#4F4B7E'; // Change icon color
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.color = '#CDC9F9';
//         e.currentTarget.querySelector('svg').style.color = '#CDC9F9';
//       }}
//                      >
//                        <FaChevronLeft style={{ color: '#CDC9F9', transition: 'color 0.3s ease-in-out' , background:"transparent"}} />
//                      </button> <h3 className="m-0 " style={{fontSize:"18px"}}>Buyer Assistance</h3> </div>

//     <img src={imge} alt="" className="header-image"  style={{width:'100%'}}/>
     
//     <div className="w-100 d-flex justify-content-around align-items-center mt-3">
//         <button style={{
//           ...baseStyle,
//           opacity: 0.6,
//           cursor: "not-allowed",
//         }}
//         disabled
//         >Add Buyer Assistant</button>
//         <button   style={{
//           ...baseStyle,
//           ...(hovered ? hoverStyle : {}),
//         }}
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//         onClick={() => navigate(`/Buyer-List-Filter`)}

//    >view Buyer List</button>

//       </div>
//       <h4 className="form-title mt-3" style={{color: '#4F4B7E', fontSize:"15px", fontWeight:"bold"}}>Buyer Assistance</h4>
//       <div>
//       {message && <div className="alert text-success text-bold">{message}</div>}
//       {/* Your existing component structure goes here */}
//     </div>

//       {showConfirmPopup && (
//   <div
//     style={{
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       width: '100vw',
//       height: '100vh',
//       background: 'rgba(0, 0, 0, 0.5)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       zIndex: 999,
//     }}
//   >
//     <div
//       style={{
//         background: 'white',
//         padding: '24px',
//         borderRadius: '8px',
//         width: '320px',
//         textAlign: 'center',
//       }}
//     >
//       <h5>Do you want to create this Buyer Assistance request?</h5>
//       <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-around' }}>
//         <button
//           onClick={handleConfirmSubmit}
//           style={{
//             padding: '8px 16px',
//             backgroundColor: '#6CBAAF',
//             border: 'none',
//             color: '#fff',
//             borderRadius: '4px',
//             cursor: 'pointer',
//           }}
//         >
//           Yes
//         </button>
//         <button
//           onClick={() => setShowConfirmPopup(false)}
//           style={{
//             padding: '8px 16px',
//             backgroundColor: '#ccc',
//             border: 'none',
//             color: '#333',
//             borderRadius: '4px',
//             cursor: 'pointer',
//           }}
//         >
//           No
//         </button>
//       </div>
//     </div>
//   </div>
// )}



//       <form onSubmit={handleSubmit} className="p-3">
  
    

//  <div className="row mb-3 justify-content-around">
 
 
// <div className="form-group col-5 p-0 m-0" >
//     <label style={{width:'100%'}}>
//     <label>minPrice <span style={{ color: 'red' }}>* </span></label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="minPrice"
//             value={formData.minPrice || ""}
//             onChange={handleFieldChange}
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
//             style={{
//               cursor: "pointer",
//               border: "1px solid #4F4B7E",
//               padding: "10px",
//               background: "#fff",
//               borderRadius: "5px",
//               width: "100%",
//               textAlign: "left",
//               color: "#4F4B7E",
//             }}
//           >
//             <span style={{ marginRight: "10px" }}>
//               <img src={minprice} alt="" />
//             </span>
//             {formData.minPrice || "Select minPrice"}
//           </button>

//           {renderDropdown("minPrice")}
//         </div>
//       </div>
//     </label>
//   </div>

//     <div className="form-group col-5 p-0 m-0" >
//         <label style={{width:'100%'}}>
//         <label>maxPrice <span style={{ color: 'red' }}>* </span></label>
    
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <div style={{ flex: "1" }}>
//               <select
//                 name="maxPrice"
//                 value={formData.maxPrice || ""}
//                 onChange={handleFieldChange}
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
//                 style={{
//                   cursor: "pointer",
//                   border: "1px solid #4F4B7E",
//                   padding: "10px",
//                   background: "#fff",
//                   borderRadius: "5px",
//                   width: "100%",
//                   textAlign: "left",
//                   color: "#4F4B7E",
//                 }}
//               >
//                 <span style={{ marginRight: "10px" }}>
//                   {fieldIcons.maxPrice || <FaHome />}
//                 </span>
//                 {formData.maxPrice || "Select maxPrice"}
//               </button>
    
//               {renderDropdown("maxPrice")}
//             </div>
//           </div>
//         </label>
//       </div>
//     </div>

//       <div className="col-12 mb-3">
//         <label  style={{fontWeight:600}}>PhoneNumber</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border: '1px solid #4F4B7E', background: "#fff" }}>
//     <FaPhoneAlt className="input-icon" style={{ color: '#4F4B7E', marginLeft: "10px" }} />
//     <input
//       type="tel"
//       name="phoneNumber"
//       value={formData.phoneNumber}
//       onChange={handleInputChange}
//       className="form-input m-0"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//       />
//   </div>
// </div>


// <div className="col-12 mb-3">
//   <label  style={{fontWeight:600}}>AlternatePhone</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border: '1px solid #4F4B7E', background: "#fff" }}>
//     <FaPhoneAlt className="input-icon" style={{ color: '#4F4B7E', marginLeft: "10px" }} />
//     <input
//       type="number"
//       name="alternatePhone"
//       value={formData.alternatePhone}
//       onChange={handleInputChange}
//       className="form-input m-0"
//       placeholder="Enter Your alternatePhone"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//       />
//   </div>
// </div>

// <div className="row justify-content-center">

//   <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>Property Mode <span style={{ color: 'red' }}>* </span></label>

//       <div style={{ display: "flex", alignItems: "center", width:"100%" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="propertyMode"
//             value={formData.propertyMode || ""}
//             onChange={handleFieldChange}
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
//             // ref={formRefs.propertyMode} // Attach ref here

//             onClick={() => toggleDropdown("propertyMode")}
//             style={{
//               cursor: "pointer",
//               border: "1px solid #4F4B7E",
//               padding: "10px",
//               background: "#fff",
//               borderRadius: "5px",
//               width: "100%",
//               textAlign: "left",
//               color: "#4F4B7E",
//             }}
//           >
//             <span style={{ marginRight: "10px" }}>
//               {fieldIcons.propertyMode || <FaHome />}
//             </span>
//             {formData.propertyMode || "Select Property Mode"}
//           </button>

//           {renderDropdown("propertyMode")}
//         </div>
//       </div>
//     </label>
//   </div>

 
//   <div className="form-group" >
//     <label style={{width:'100%'}}>
//     <label>propertyType</label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="propertyType"
//             value={formData.propertyType || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select propertyType</option>
//             {dataList.propertyType?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("propertyType")}
//             style={{
//               cursor: "pointer",
//               border: "1px solid #4F4B7E",
//               padding: "10px",
//               background: "#fff",
//               borderRadius: "5px",
//               width: "100%",
//               textAlign: "left",
//               color: "#4F4B7E",
//             }}
//           >
//             <span style={{ marginRight: "10px" }}>
//               {fieldIcons.propertyType || <FaHome />}
//             </span>
//             {formData.propertyType || "Select propertyType"}
//           </button>

//           {renderDropdown("propertyType")}
//         </div>
//       </div>
//     </label>
//   </div>
 
// <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>Bedrooms </label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="bedrooms"
//             value={formData.bedrooms || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select bedrooms</option>
//             {dataList.bedrooms?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("bedrooms")}
//             style={{
//               cursor: "pointer",
//               border: "1px solid #4F4B7E",
//               padding: "10px",
//               background: "#fff",
//               borderRadius: "5px",
//               width: "100%",
//               textAlign: "left",
//               color: "#4F4B7E",
//             }}
//           >
//             <span style={{ marginRight: "10px" }}>
//               {fieldIcons.bedrooms || <FaHome />}
//             </span>
//             {formData.bedrooms || "Select bedrooms"}
//           </button>

//           {renderDropdown("bedrooms")}
//         </div>
//       </div>
//     </label>
//   </div>


//   <div className="form-group">

//     <label style={{ width: '100%'}}>
//     <label>Facing</label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="facing"
//             value={formData.facing || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select facing</option>
//             {dataList.facing?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("facing")}
//             style={{
//               cursor: "pointer",
//               border: "1px solid #4F4B7E",
//               padding: "10px",
//               background: "#fff",
//               borderRadius: "5px",
//               width: "100%",
//               textAlign: "left",
//               color: "#4F4B7E",
//             }}
//           >
//             <span style={{ marginRight: "10px" }}>
//               {fieldIcons.facing || <FaHome />}
//             </span>
//             {formData.facing || "Select facing"}
//           </button>

//           {renderDropdown("facing")}
//         </div>
//       </div>
//     </label>
//   </div>


//   <div className="form-group">
//   <label style={{ width: '100%' }}>
//     <label>Rent Type</label>
//     <div style={{ display: "flex", alignItems: "center" }}>
//       <div style={{ flex: "1" }}>
//         <select
//           name="rentType"
//           value={formData.rentType || ""}
//           onChange={handleFieldChange}
//           className="form-control"
//           style={{ display: "none" }}
//         >
//           <option value="">Select rent type</option>
//           {dataList.rentType?.map((option, index) => (
//             <option key={index} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>

//         <button
//           className="m-0"
//           type="button"
//           onClick={() => toggleDropdown("rentType")}
//           style={{
//             cursor: "pointer",
//             border: "1px solid #4F4B7E",
//             padding: "10px",
//             background: "#fff",
//             borderRadius: "5px",
//             width: "100%",
//             textAlign: "left",
//             color: "#4F4B7E",
//           }}
//         >
//           <span style={{ marginRight: "10px" }}>
//             {fieldIcons.rentType || <FaHome />}
//           </span>
//           {formData.rentType || "Select rent type"}
//         </button>

//         {renderDropdown("rentType")}
//       </div>
//     </div>
//   </label>
// </div>


// <div className="form-group">
//   <label style={{ width: '100%' }}>
//     <label>Number Of Floors</label>
//     <div style={{ display: "flex", alignItems: "center" }}>
//       <div style={{ flex: "1" }}>
//         <select
//           name="numberOfFloors"
//           value={formData.numberOfFloors || ""}
//           onChange={handleFieldChange}
//           className="form-control"
//           style={{ display: "none" }}
//         >
//           <option value="">Select Number Of Floors </option>
//           {dataList.numberOfFloors?.map((option, index) => (
//             <option key={index} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>

//         <button
//           className="m-0"
//           type="button"
//           onClick={() => toggleDropdown("numberOfFloors")}
//           style={{
//             cursor: "pointer",
//             border: "1px solid #4F4B7E",
//             padding: "10px",
//             background: "#fff",
//             borderRadius: "5px",
//             width: "100%",
//             textAlign: "left",
//             color: "#4F4B7E",
//           }}
//         >
//           <span style={{ marginRight: "10px" }}>
//             {fieldIcons.numberOfFloors || <FaHome />}
//           </span>
//           {formData.numberOfFloors || "Select Number Of Floors"}
//         </button>

//         {renderDropdown("numberOfFloors")}
//       </div>
//     </div>
//   </label>
// </div>



// <div className="form-group">
//   <label style={{ width: '100%' }}>
//     <label>requirementType</label>
//     <div style={{ display: "flex", alignItems: "center" }}>
//       <div style={{ flex: "1" }}>
//         <select
//           name="requirementType"
//           value={formData.requirementType || ""}
//           onChange={handleFieldChange}
//           className="form-control"
//           style={{ display: "none" }}
//         >
//           <option value="">Select requirementType </option>
//           {dataList.requirementType?.map((option, index) => (
//             <option key={index} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>

//         <button
//           className="m-0"
//           type="button"
//           onClick={() => toggleDropdown("requirementType")}
//           style={{
//             cursor: "pointer",
//             border: "1px solid #4F4B7E",
//             padding: "10px",
//             background: "#fff",
//             borderRadius: "5px",
//             width: "100%",
//             textAlign: "left",
//             color: "#4F4B7E",
//           }}
//         >
//           <span style={{ marginRight: "10px" }}>
//             {fieldIcons.requirementType || <FaHome />}
//           </span>
//           {formData.requirementType || "Select requirementType"}
//         </button>

//         {renderDropdown("requirementType")}
//       </div>
//     </div>
//   </label>
// </div>


// <div className="form-group">
//   <label style={{ width: '100%' }}>
//     <label>familyMembers</label>
//     <div style={{ display: "flex", alignItems: "center" }}>
//       <div style={{ flex: "1" }}>
//         <select
//           name="familyMembers"
//           value={formData.familyMembers || ""}
//           onChange={handleFieldChange}
//           className="form-control"
//           style={{ display: "none" }}
//         >
//           <option value="">Select rent type</option>
//           {dataList.familyMembers?.map((option, index) => (
//             <option key={index} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>

//         <button
//           className="m-0"
//           type="button"
//           onClick={() => toggleDropdown("familyMembers")}
//           style={{
//             cursor: "pointer",
//             border: "1px solid #4F4B7E",
//             padding: "10px",
//             background: "#fff",
//             borderRadius: "5px",
//             width: "100%",
//             textAlign: "left",
//             color: "#4F4B7E",
//           }}
//         >
//           <span style={{ marginRight: "10px" }}>
//             {fieldIcons.familyMembers || <FaHome />}
//           </span>
//           {formData.familyMembers || "Select familyMembers"}
//         </button>

//         {renderDropdown("familyMembers")}
//       </div>
//     </div>
//   </label>
// </div>

// <div className="form-group">
//   <label style={{ width: '100%' }}>
//     <label>petAllowed</label>
//     <div style={{ display: "flex", alignItems: "center" }}>
//       <div style={{ flex: "1" }}>
//         <select
//           name="petAllowed"
//           value={formData.petAllowed || ""}
//           onChange={handleFieldChange}
//           className="form-control"
//           style={{ display: "none" }}
//         >
//           <option value="">Select petAllowed</option>
//           {dataList.petAllowed?.map((option, index) => (
//             <option key={index} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>

//         <button
//           className="m-0"
//           type="button"
//           onClick={() => toggleDropdown("petAllowed")}
//           style={{
//             cursor: "pointer",
//             border: "1px solid #4F4B7E",
//             padding: "10px",
//             background: "#fff",
//             borderRadius: "5px",
//             width: "100%",
//             textAlign: "left",
//             color: "#4F4B7E",
//           }}
//         >
//           <span style={{ marginRight: "10px" }}>
//             {fieldIcons.petAllowed || <FaHome />}
//           </span>
//           {formData.petAllowed || "Select petAllowed"}
//         </button>

//         {renderDropdown("petAllowed")}
//       </div>
//     </div>
//   </label>
// </div>

// <div className="form-group">
//   <label style={{ width: '100%' }}>
//     <label>foodHabit</label>
//     <div style={{ display: "flex", alignItems: "center" }}>
//       <div style={{ flex: "1" }}>
//         <select
//           name="foodHabit"
//           value={formData.foodHabit || ""}
//           onChange={handleFieldChange}
//           className="form-control"
//           style={{ display: "none" }}
//         >
//           <option value="">Select foodHabit</option>
//           {dataList.foodHabit?.map((option, index) => (
//             <option key={index} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>

//         <button
//           className="m-0"
//           type="button"
//           onClick={() => toggleDropdown("foodHabit")}
//           style={{
//             cursor: "pointer",
//             border: "1px solid #4F4B7E",
//             padding: "10px",
//             background: "#fff",
//             borderRadius: "5px",
//             width: "100%",
//             textAlign: "left",
//             color: "#4F4B7E",
//           }}
//         >
//           <span style={{ marginRight: "10px" }}>
//             {fieldIcons.foodHabit || <FaHome />}
//           </span>
//           {formData.foodHabit || "Select foodHabit"}
//         </button>

//         {renderDropdown("foodHabit")}
//       </div>
//     </div>
//   </label>
// </div>

// <div className="form-group">
//   <label style={{ width: '100%' }}>
//     <label>jobType</label>
//     <div style={{ display: "flex", alignItems: "center" }}>
//       <div style={{ flex: "1" }}>
//         <select
//           name="jobType"
//           value={formData.jobType || ""}
//           onChange={handleFieldChange}
//           className="form-control"
//           style={{ display: "none" }}
//         >
//           <option value="">Select jobType</option>
//           {dataList.jobType?.map((option, index) => (
//             <option key={index} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>

//         <button
//           className="m-0"
//           type="button"
//           onClick={() => toggleDropdown("jobType")}
//           style={{
//             cursor: "pointer",
//             border: "1px solid #4F4B7E",
//             padding: "10px",
//             background: "#fff",
//             borderRadius: "5px",
//             width: "100%",
//             textAlign: "left",
//             color: "#4F4B7E",
//           }}
//         >
//           <span style={{ marginRight: "10px" }}>
//             {fieldIcons.jobType || <FaHome />}
//           </span>
//           {formData.jobType || "Select jobType"}
//         </button>

//         {renderDropdown("jobType")}
//       </div>
//     </div>
//   </label>
// </div>


//   {/* <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>Property Approved</label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="propertyApproved"
//             value={formData.propertyApproved || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select propertyApproved</option>
//             {dataList.propertyApproved?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("propertyApproved")}
//             style={{
//               cursor: "pointer",
//               border: "1px solid #4F4B7E",
//               padding: "10px",
//               background: "#fff",
//               borderRadius: "5px",
//               width: "100%",
//               textAlign: "left",
//               color: "#4F4B7E",
//             }}
//           >
//             <span style={{ marginRight: "10px" }}>
//               {fieldIcons.propertyApproved || <FaHome />}
//             </span>
//             {formData.propertyApproved || "Select propertyApproved"}
//           </button>

//           {renderDropdown("propertyApproved")}
//         </div>
//       </div>
//     </label>
//   </div> */}

//    {/* <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>Property Age </label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="propertyAge"
//             value={formData.propertyAge || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select Property Age</option>
//             {dataList.propertyAge?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("propertyAge")}
//             style={{
//               cursor: "pointer",
//               border: "1px solid #4F4B7E",
//               padding: "10px",
//               background: "#fff",
//               borderRadius: "5px",
//               width: "100%",
//               textAlign: "left",
//               color: "#4F4B7E",
//             }}
//           >
//             <span style={{ marginRight: "10px" }}>
//               {fieldIcons.propertyAge || <FaHome />}
//             </span>
//             {formData.propertyAge || "Select Property Age"}
//           </button>

//           {renderDropdown("propertyAge")}
//         </div>
//       </div>
//     </label>
//   </div> */}
  
//   {/* <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>Bank Loan </label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="bankLoan"
//             value={formData.bankLoan || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select Bank Loan</option>
//             {dataList.bankLoan?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("bankLoan")}
//             style={{
//               cursor: "pointer",
//               border: "1px solid #4F4B7E",
//               padding: "10px",
//               background: "#fff",
//               borderRadius: "5px",
//               width: "100%",
//               textAlign: "left",
//               color: "#4F4B7E",
//             }}
//           >
//             <span style={{ marginRight: "10px" }}>
//               {fieldIcons.bankLoan || <FaHome />}
//             </span>
//             {formData.bankLoan || "Select Bank Loan"}
//           </button>

//           {renderDropdown("bankLoan")}
//         </div>
//       </div>
//     </label>
//   </div> */}

// {/* {Total Area} */}
// {/* <div className="col-12 mb-3">
//   <label  style={{fontWeight:600}}>Total Area</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border: '1px solid #4F4B7E', background: "#fff" }}>
//     <FaRulerCombined className="input-icon" style={{ color: '#4F4B7E', marginLeft: "10px" }} />
//     <input
//       type="text"
//       name="totalArea"
//       value={formData.totalArea}
//       onChange={handleInputChange}
//       className="form-input m-0"
//       placeholder="Enter Total Area"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
// </div> */}

// {/* 
//   <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>Area Unit</label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="areaUnit"
//             value={formData.areaUnit || ""}
//             onChange={handleFieldChange}
//             className="form-control"
            
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select areaUnit</option>
//             {dataList.areaUnit?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             // ref={formRefs.areaUnit} // Attach ref here

//             onClick={() => toggleDropdown("areaUnit")}
//             style={{
//               cursor: "pointer",
//               border: "1px solid #4F4B7E",
//               padding: "10px",
//               background: "#fff",
//               borderRadius: "5px",
//               width: "100%",
//               textAlign: "left",
//               color: "#4F4B7E",
//             }}
//           >
//             <span style={{ marginRight: "10px" }}>
//               {fieldIcons.areaUnit || <FaHome />}
//             </span>
//             {formData.areaUnit || "Select areaUnit"}
//           </button>

//           {renderDropdown("areaUnit")}
//         </div>
//       </div>
//     </label>
//   </div> */}
 
//   {/* <div className="form-group" >
//     <label style={{width:'100%'}}>
//     <label>paymentType</label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="paymentType"
//             value={formData.paymentType || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select paymentType</option>
//             {dataList.paymentType?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("paymentType")}
//             style={{
//               cursor: "pointer",
//               border: "1px solid #4F4B7E",
//               padding: "10px",
//               background: "#fff",
//               borderRadius: "5px",
//               width: "100%",
//               textAlign: "left",
//               color: "#4F4B7E",
//             }}
//           >
//             <span style={{ marginRight: "10px" }}>
//               {fieldIcons.paymentType || <FaCreditCard />}
//             </span>
//             {formData.paymentType || "Select paymentType"}
//           </button>

//           {renderDropdown("paymentType")}
//         </div>
//       </div>
//     </label>
//   </div> */}
// </div>
// <div className="col-12 mb-3">
//   <label  style={{fontWeight:600}}>Owner Name</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border: '1px solid #4F4B7E', background: "#fff" }}>
//     <FaUserAlt className="input-icon" style={{ color: '#4F4B7E', marginLeft: "10px" }} />
//     <input
//       type="text"
//       name="raName"
//       value={formData.raName}
//       onChange={handleInputChange}
//       className="form-input m-0"
//       placeholder="Enter Your Name"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
// </div>


//   <div className="form-group">
//       <label style={{ width: '100%'}}>
//       <label>State  <span style={{ color: 'red' }}>* </span></label>
  
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <div style={{ flex: "1" }}>
//             <select
//               name="state"
//               value={formData.state || ""}
//               onChange={handleFieldChange}
//               className="form-control"
//               style={{ display: "none" }} // Hide the default <select> dropdown
//             >
//               <option value="">Select state</option>
//               {dataList.state?.map((option, index) => (
//                 <option key={index} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
  
//             <button
//               className="m-0"
//               type="button"
//               onClick={() => toggleDropdown("state")}
//               style={{
//                 cursor: "pointer",
//                 border: "1px solid #4F4B7E",
//                 padding: "10px",
//                 background: "#fff",
//                 borderRadius: "5px",
//                 width: "100%",
//                 textAlign: "left",
//                 color: "#4F4B7E",
//               }}
//             >
//               <span style={{ marginRight: "10px" }}>
//                 {fieldIcons.state || <FaHome />}
//               </span>
//               {formData.state || "Select state"}
//             </button>
  
//             {renderDropdown("state")}
//           </div>
//         </div>
//       </label>
//     </div>

// <div className="col-12 mb-3" style={{ position: 'relative' }}>
//   <label style={{ fontWeight: 600 }}>City</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', border: '1px solid #4F4B7E', background: "#fff" }}>
//     <FaCity style={{ color: '#4F4B7E', marginLeft: "10px" }} />
//     <input className="m-0"
//       type="text"
//       name="city"
//       value={formData.city}
//       onChange={handleInputChanges}
//       placeholder="Enter City"
//       style={{ flex: '1', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
  
//   {citySuggestions.length > 0 && (
//   <ul style={suggestionListStyle}>
//     {citySuggestions.map((city, index) => (
//       <li
//         key={index}
//         style={{
//           ...suggestionItemStyle,
//           ...(hoveredIndex === index ? suggestionItemHoverStyle : {}),
//         }}
//         onMouseEnter={() => setHoveredIndex(index)}
//         onMouseLeave={() => setHoveredIndex(null)}
//         onClick={() => {
//           setFormData({ ...formData, city: city });
//           setCitySuggestions([]);
//         }}
//       >
//         {city}
//       </li>
//     ))}
//   </ul>
// )}

// </div>


// <div className="col-12 mb-3" style={{ position: 'relative' }}>
//   <label style={{ fontWeight: 600 }}>Area</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', border: '1px solid #4F4B7E', background: "#fff" }}>
//     <FaCity style={{ color: '#4F4B7E', marginLeft: "10px" }} />
//     <input  className="m-0"
//       type="text"
//       name="area"
//       value={formData.area}
//       onChange={handleInputChanges}
//       placeholder="Enter Area"
//       style={{ flex: '1', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
//  {areaSuggestions.length > 0 && (
//   <ul style={suggestionListStyle}>
//     {areaSuggestions.map((area, index) => (
//       <li
//         key={index}
//         style={{
//           ...suggestionItemStyle,
//           ...(hoveredAreaIndex === index ? suggestionItemHoverStyle : {}),
//         }}
//         onMouseEnter={() => setHoveredAreaIndex(index)}
//         onMouseLeave={() => setHoveredAreaIndex(null)}
//         onClick={() => {
//           setFormData({ ...formData, area });
//           setAreaSuggestions([]);
//         }}
//       >
//         {area}
//       </li>
//     ))}
//   </ul>
// )}

// </div>

// <div className="col-12 mb-3">
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border: '1px solid #4F4B7E', background: "#fff" }}>
//     {/* <FaComment className="input-icon" style={{ color: '#4F4B7E', marginLeft: "10px" }} /> */}
//     <textarea
//       name="description"
//       value={formData.description}
//       onChange={handleInputChange}
//       className="form-input m-0"
//       placeholder="Enter Description"
//       style={{
//         flex: '1 0 80%',
//         padding: '8px',
//         fontSize: '14px',
//         border: 'none',
//         outline: 'none',
//         resize: 'none',  // Optional: Prevent resizing of the textarea
//         minHeight: '100px' // Optional: Set a minimum height
//       }}
//     />
//   </div>
// </div>

     
  

//         <button type="submit" className="submit-button" style={{ padding: "10px 20px", cursor: "pointer", background:"#6CBAAF", border:'none', color:'#ffffff'}}
        
//         onMouseOver={(e) => {
//           e.target.style.background = "#017a6e"; // Brighter neon on hover
//           e.target.style.fontWeight = 500; // Brighter neon on hover
//           e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover

//         }}
//         onMouseOut={(e) => {
//           e.target.style.background = "#6CBAAF"; // Original orange
//           e.target.style.fontWeight = 400; // Brighter neon on hover

//         }}>
//           {formData._id ? "UPDATE PROPERTY ASSISTANCE" : "ADD PROPERTY ASSISTANCE"}
//         </button>
//       </form>
//     </div>
//     </div>
//   );
// };





// export default PropertyAssistance;


























































































import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { getActiveBase, baseToPath } from '../utils/cityBase';
import { FaArrowLeft, FaChevronLeft } from 'react-icons/fa';

const cardAnimationStyle = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse-border {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(79, 75, 126, 0.7);
    }
    50% {
      box-shadow: 0 0 0 15px rgba(79, 75, 126, 0);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  @keyframes floating {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  .pricing-card {
    animation: slideUp 0.6s ease-out backwards;
  }

  .pricing-card:nth-child(1) {
    animation-delay: 0.1s;
  }
  .pricing-card:nth-child(2) {
    animation-delay: 0.2s;
  }
  .pricing-card:nth-child(3) {
    animation-delay: 0.3s;
  }

  .pay-button {
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .pay-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }

  .pay-button:hover::before {
    left: 100%;
  }
`;

if (typeof window !== 'undefined' && !document.getElementById('pricing-animation-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'pricing-animation-styles';
  styleSheet.textContent = cardAnimationStyle;
  document.head.appendChild(styleSheet);
}

export default function AddPricingPlans({ phoneNumber: propPhoneNumber, rentId: proprentId, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoverIndex, setHoverIndex] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [cardData, setCardData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState(null);

  // Derive phoneNumber and rentId from props, location or localStorage
  const phoneNumber = propPhoneNumber || location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const rentId = proprentId || location.state?.rentId || "";

  useEffect(() => {
    if (phoneNumber) {
      axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
        phoneNumber,
        viewedFile: "Pricing Plans",
        viewTime: new Date().toISOString(),
      }).catch(() => {});
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    fetchActivePlans();
  }, []);

  // Fetch plans and inject rentId into each plan object
  const fetchActivePlans = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/active-plans`);
      // Add rentId manually into each plan to avoid undefined
      const plansWithrentId = response.data.map(plan => ({
        ...plan,
        rentId: rentId,
      }));
      setCardData(plansWithrentId);
    } catch (err) {
      setMessage({ text: "Failed to load plans", type: "error" });
    }
  };

  const confirmPlanSelection = (card, index) => {
    setSelectedPlan({ card, index });
    setShowPopup(true);
  };


// const handleConfirmPlan = async () => {
//   if (!selectedPlan) return;
//   const { card, index } = selectedPlan;

//   const rentIdNum = Number(card.rentId);
//   if (!phoneNumber || isNaN(rentIdNum)) {
//     setMessage({ text: "Missing or invalid phone number or PPC ID", type: "error" });
//     return;
//   }

//   const planData = {
//     phoneNumber,
//     planId: card._id,
//     rentId: rentIdNum,
//   };

//   setLoadingIndex(index);
//   setShowPopup(false);

//   try {
//     const response = await axios.post(
//       `${process.env.REACT_APP_API_URL}/select-plan`,
//       planData
//     );

//     if (response.data.status === "success") {
//       setMessage({ text: "Plan selected successfully!", type: "success" });

//       setTimeout(() => {
//         if (onClose) onClose();
//         else navigate("/my-plan");
//       }, 2000);
//     }
//   } catch (err) {
//     const msg = err.response?.data?.message || "Failed to select plan";
//     setMessage({ text: msg, type: "error" });
//   } finally {
//     setLoadingIndex(null);
//   }
// };


const handleConfirmPlan = async () => {
  if (!selectedPlan) return;
  const { card, index } = selectedPlan;

  const rentIdNum = Number(card.rentId);
  if (!phoneNumber || isNaN(rentIdNum)) {
    setMessage({ text: "Missing or invalid phone number or rentId", type: "error" });
    return;
  }

  setLoadingIndex(index);
  setShowPopup(false);

  // Navigate to PayUForm and pass data
  navigate("/payu-form", {
    state: {
      phoneNumber,
      rentId: rentIdNum,
      planName: card.name,
      planId: card._id,
    amount: card.price  // ✅ Pass price as amount
    }
  });
};

  const handleBackNavigation = () => {
    navigate(baseToPath(getActiveBase()));
  };

  return (
    <div className="container d-flex align-items-center justify-content-center p-0">
      <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="row g-2 w-100">
                    <div className="d-flex align-items-center w-100 p-2" style={{ background: "#EFEFEF" }}>
                              <button
                                onClick={handleBackNavigation}
                                className="pe-5"
                                style={{
                                  backgroundColor: '#f0f0f0',
                                  border: 'none',
                                  padding: '10px 20px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <FaChevronLeft style={{ color: '#30747F' }} />
                              </button>
                              <h3 className="m-0" style={{ fontSize: "16px" }}>Upgrade Your Plan</h3>
                            </div>

          <h3 className="m-0 ms-3" style={{ fontSize: "20px" }}>Upgrade Membership</h3>
          <div className="mt-2 d-flex justify-content-center px-2">
            <VideoPlayer />
          </div>

          {message && (
            <p className="text-bold mt-2" style={{ color: message.type === "success" ? "green" : "red", textAlign: "center" }}>
              {message.text}
            </p>
          )}

          <div className="text-center mb-3">
            <p className="lead mb-1 pt-3" style={{ fontSize: "20px" }}>All the plan in our Rent Pondy is having validity date for your property to be in live for promotion purpose.</p>
            {/* <p className="lead" style={{ fontSize: "16px" }}>premium subscription plans</p> */}
          </div>

          <div className="row justify-content-center">
            {cardData.map((card, index) => {
              const gradients = [
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
              ];
              return (
              <div key={index} className="col-12 d-flex justify-content-center mb-4 p-0">
                <div
                  className="card shadow-lg rounded-4 border-0 pricing-card"
                  style={{
                    width: '72%',
                    background: gradients[index % gradients.length],
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    boxShadow: hoverIndex === index 
                      ? '0 25px 50px rgba(0, 0, 0, 0.35)' 
                      : '0 10px 30px rgba(0, 0, 0, 0.15)',
                    transform: hoverIndex === index ? 'translateY(-12px) scale(1.03)' : 'translateY(0) scale(1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  {/* Animated top gradient line */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '5px',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
                    opacity: hoverIndex === index ? 1 : 0.5,
                    transition: 'opacity 0.3s ease'
                  }} />

                  <div className="card-body" style={{ background: 'rgba(255, 255, 255, 0.97)', backdropFilter: 'blur(10px)', borderRadius: '20px', margin: '12px', position: 'relative', zIndex: 2, padding: '24px' }}>
                    {/* Premium Badge */}
                    {index === 1 && (
                      <div style={{
                        position: 'absolute',
                        top: '-14px',
                        right: '24px',
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        color: '#fff',
                        padding: '8px 18px',
                        borderRadius: '25px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        boxShadow: '0 6px 20px rgba(255, 165, 0, 0.5)',
                        animation: 'floating 3s ease-in-out infinite'
                      }}>
                        ⭐ MOST POPULAR
                      </div>
                    )}
                    
                    <h4 className="card-title text-start mt-1" style={{ color: '#4F4B7E', fontWeight: 'bold', fontSize: '32px', marginBottom: '8px' }}>
                      {card.name}
                    </h4>
                    <p className="text-start" style={{ fontSize: "17px", color: '#888', marginBottom: '16px', fontWeight: '500' }}>
                      {card.packageType}
                    </p>
                    
                    {/* Price Section */}
                    <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px', gap: '8px' }}>
                      <h2 className="text-start m-0" style={{ fontSize: '3rem', background: 'linear-gradient(135deg, #FF6B6B, #f5576c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' }}>
                        ₹{card.price}
                      </h2>
                      <span style={{ fontSize: '15px', color: '#999', fontWeight: '500', paddingBottom: '8px' }}>per plan</span>
                    </div>
                    
                    <p className="text-start" style={{ fontSize: '14px', color: '#666', marginBottom: '18px', fontWeight: '500', letterSpacing: '0.3px' }}>
                      ✅ Valid for {card.durationDays} Days • {card.numOfCars} Property {card.numOfCars > 1 ? 's' : ''}
                    </p>
                    
                    {/* Featured Ads Section with gradient background */}
                    <div style={{ 
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(245, 87, 108, 0.08))', 
                      padding: '14px', 
                      borderRadius: '14px', 
                      marginBottom: '20px',
                      border: '1px solid rgba(102, 126, 234, 0.15)',
                      transition: 'all 0.3s ease',
                      transform: hoverIndex === index ? 'scale(1.02)' : 'scale(1)'
                    }}>
                      <h5 className="m-0 text-start" style={{ fontSize: '16px', color: '#4F4B7E', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        ✨ Featured Ads
                      </h5>
                      <p className="text-start m-0" style={{ color: '#555', fontSize: '15px', fontWeight: '500', lineHeight: '1.5' }}>
                        {card.description}
                      </p>
                      <p className="text-start m-0 mt-2" style={{ fontSize: '16px', color: '#FF6B6B', fontWeight: '700', letterSpacing: '0.5px' }}>
                        🎯 {card.featuredAds} ADS INCLUDED
                      </p>
                    </div>
                    
                    {/* Call to action button */}
                    <div className="d-flex justify-content-center">
                      <button
                        className="pay-button btn pt-3 pb-3 ps-5 pe-5 rounded-pill"
                        style={{
                          background: 'linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)',
                          color: '#fff',
                          fontSize: "17px",
                          fontWeight: '700',
                          border: 'none',
                          boxShadow: hoverIndex === index && loadingIndex !== index 
                            ? '0 15px 35px rgba(79, 75, 126, 0.6)' 
                            : '0 8px 20px rgba(79, 75, 126, 0.4)',
                          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          cursor: loadingIndex === index ? 'not-allowed' : 'pointer',
                          opacity: loadingIndex === index ? 0.8 : 1,
                          transform: hoverIndex === index && loadingIndex !== index ? 'scale(1.08)' : 'scale(1)',
                          letterSpacing: '0.5px',
                          minWidth: '200px'
                        }}
                        onClick={() => confirmPlanSelection(card, index)}
                        disabled={loadingIndex === index}
                      >
                        {loadingIndex === index ? '⏳ Processing...' : '🚀 PAY NOW'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          {/* Confirmation Modal */}
          <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
            <Modal.Body className="text-center">
              <p>Are you sure you want to select this plan?</p>
              <Button style={{ background: "#4F4B7E", fontSize: "13px", border: "none" }} onClick={handleConfirmPlan}>Yes</Button>
              <Button className="ms-3" style={{ background: "#FF0000", fontSize: "13px", border: "none" }} onClick={() => setShowPopup(false)}>No</Button>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
}


