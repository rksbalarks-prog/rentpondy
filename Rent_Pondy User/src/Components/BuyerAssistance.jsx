
























import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getChennaiAreaPincodeMap, getDefaultCity } from "../utils/areaPincode";
import { getActiveBase } from "../utils/cityBase";
// import { FaChevronDown, FaPhone } from "react-icons/fa";
import imge from "../Assets/tenant_assist.png";
import { RiCloseCircleFill, RiLayoutLine } from 'react-icons/ri';
import { TbFileDescription , TbMapPinCode, TbWorldLongitude ,TbWheelchair , } from 'react-icons/tb';
import {FaPhoneAlt, FaRulerCombined,  FaBath, FaChartArea, FaPhone ,FaEdit,FaRoad,FaCreditCard,FaLandmark, FaHome, FaUserAlt, FaEnvelope,  FaRupeeSign , FaFileVideo , FaToilet,FaCar,FaBed,  FaCity , FaTimes, FaArrowRight, FaStreetView, FaSearch, FaHandHoldingUsd, FaUsers, FaUtensils, FaBriefcase, FaDog,FaArrowLeft, FaChevronLeft} from 'react-icons/fa';
import {  FaRegAddressCard, FaChevronDown } from 'react-icons/fa6';
import { MdLocationOn, MdOutlineMeetingRoom, MdBalcony , MdSchedule , MdStraighten , MdApproval, MdLocationCity , MdAddPhotoAlternate, MdKeyboardDoubleArrowDown, MdOutlineClose} from "react-icons/md";
import { BsBank, BsBuildingsFill, BsFillHouseCheckFill , BsTextareaT} from "react-icons/bs";
import { GirequirementTypeScale, GiMoneyStack , GiResize , GiGears} from "react-icons/gi";
import { HiUserGroup } from "react-icons/hi";
import { BiBuildingHouse , BiMap, BiWorld} from "react-icons/bi";
import {   FaFileAlt, FaGlobeAmericas, FaMapMarkerAlt, FaMapSigns } from "react-icons/fa";
import {MdElevator ,MdOutlineChair ,MdPhone, MdOutlineAccessTime, MdTimer, MdHomeWork, MdHouseSiding, MdOutlinerequirementType, MdEmail, } from "react-icons/md";
import {  BsBarChart, BsGraphUp } from "react-icons/bs";
import { BiBuilding, BiStreetView } from "react-icons/bi";
import { GiStairs, GiForkKnifeSpoon, GiWindow } from "react-icons/gi";
import { AiOutlineEye, AiOutlineColumnWidth, AiOutlineColumnHeight } from "react-icons/ai";
import { BiBed, BiBath, BiCar, BiCalendar, BiUser, BiCube } from "react-icons/bi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import minprice from "../Assets/Price Mini-01.png";
import maxprice from "../Assets/Price maxi-01.png";
import { FcSearch } from "react-icons/fc";
import { toWords } from 'number-to-words';

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
import requirementType from '../Assets/alt_mob.PNG';
import requirementTypeType from '../Assets/alt_mob.PNG';
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
import { LiaCitySolid } from "react-icons/lia";
import { GoCheckCircleFill } from "react-icons/go";
import { motion } from 'framer-motion';



const BuyerAssistance = ({  existingData, onSuccess }) => {

 const location = useLocation();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const [phoneNumber] = useState(storedPhoneNumber);
    const [hovered, setHovered] = useState(false);
      const [priceInWords, setPriceInWords] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
            const [isScrolling, setIsScrolling] = useState(false);
  
      const [citySuggestions, setCitySuggestions] = useState([]);
  const [areaSuggestions, setAreaSuggestions] = useState([]);
  const cityTimeoutRef = useRef(null);
  const areaTimeoutRef = useRef(null);
  
    const baseStyle = {
      backgroundColor: "#4F4B7E",
      color: "#fff",
      border: "none",
      padding: "8px 16px",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    };
  
    const hoverStyle = {
      backgroundColor: "#CDC9F9",
    };
      const suggestionListStyle = {
  listStyle: "none",
  margin: 0,
  padding: "5px",
  border: "1px solid #ccc",
  borderTop: "none",
  maxHeight: "150px",
  overflowY: "auto",
  position: "absolute",
  width: "100%",
  background: "#ffffff",
  zIndex: 1000,
};

const suggestionItemStyle = {
  padding: "8px 10px",
  cursor: "pointer",
};

const suggestionItemHoverStyle = {
  backgroundColor: "#f0f0f0",
};
  // Function to handle price selection
  const handlePriceSelect = (priceType, price) => {
    setFormData((prevState) => ({
      ...prevState,
      [priceType]: price,
    }));
    toggleDropdown(null); // Close the dropdown after selecting an option
  };

  const [formData, setFormData] = useState({
    phoneNumber: phoneNumber || "",
    altPhoneNumber: "",
    city: getDefaultCity(),
    area: "",
    minPrice: "",
    maxPrice: "",
    facing:"",
    areaUnit: "",
    totalArea:"",
    bedrooms: "",
    propertyMode: "",
    propertyType: "",
   rentType:"",
    floorNo:"",
    requirementType:"",
     familyMembers:"",
  foodHabit:"",
  jobType:"",
  petAllowed:"",
    state: "",
    pinCode: "",
    description: "",
    raName:"",
    alternatePhone:""
  });

  const [paymentTypes, setPaymentTypes] = useState([]);
 const fieldIcons = {
  // Contact Details
  phoneNumber: <img src={phone} alt="" style={{ width: 20, height: 20 }} />,
  alternatePhone: <img src={altphone} alt="" style={{ width: 20, height: 20 }} />,
  email: <img src={email} alt="" style={{ width: 20, height: 20 }} />,
  requirementType: <img src={bestTimeToCall} alt="" style={{ width: 20, height: 20 }} />,
  
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
  balconies: <MdBalcony color="#4F4B7E" size={20}/>,
  floorNo: <img src={floorNo} alt="" style={{ width: 20, height: 20 }} />,
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
const fieldLabels = {
  propertyMode: "Property Mode",
  propertyType: "Property Type",
    rentType: "rent Type",
    minPrice:"Min Rental Amount",
    maxPrice:"Max Rental Amount",
  rentalAmount: "Rental Amount",
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
  availableDate: "available From",
  familyMembers: "No. of family Members",
  foodHabit: "food Habit",
  jobType: "job Type",
  petAllowed: "pet",
    wheelChairAvailable:"wheel Chair",
requirementType:"Requirement Type",
  pinCode: "Pin Code",
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
  tenantName: "Tenant Name",
  phoneNumber: "Phone Number",
  phoneNumberCountryCode: "Phone Country Code",
  alternatePhone: "Alternate Phone",
  alternatePhoneCountryCode: "Alternate Phone Country Code",
  bestTimeToCall: "Best Time to Call",
};
const handleFilterChange = (e) => {
    setDropdownState((prevState) => ({ ...prevState, filterText: e.target.value }));
  };

 const renderDropdown = (field) => {
   let options = dataList[field] || [];
   if (field === 'state') {
     const puducherryMatches = options.filter(
       (opt) => String(opt).trim().toLowerCase() === 'puducherry'
     );
     const others = options.filter(
       (opt) => String(opt).trim().toLowerCase() !== 'puducherry'
     );
     options = [...puducherryMatches, ...others];
   }
   const filteredOptions = options.filter((option) =>
     option.toLowerCase().includes(dropdownState.filterText.toLowerCase())
   );
 
   return (
     <div data-field={field}>
       {dropdownState.activeDropdown === field && (
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
             animation: 'fadeIn 0.3s ease-in-out',
           }}
         >
           <div
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
             <div
               className="p-1"
               style={{
                 fontWeight: 500,
                 fontSize: '15px',
                 marginBottom: '10px',
                 textAlign: 'start',
                 color: 'grey',
               }}
             >
               Select or Search{' '}
               <span style={{ color: '#0B57CF', fontWeight: 500 }}>
                 {fieldLabels[field] || 'Property Field'}
               </span>
             </div>
             <div
               className="mb-1"
               style={{
                 position: 'relative',
                 width: '100%',
                 background: '#EEF4FA',
                 borderRadius: '25px',
               }}
             >
               <FcSearch
                 size={16}
                 style={{
                   position: 'absolute',
                   left: '10px',
                   top: '50%',
                   transform: 'translateY(-50%)',
                   pointerEvents: 'none',
                   color: 'black',
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
                   background: 'transparent',
                   border: 'none',
                   outline: 'none',
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
   setFormData((prevState) => ({
     ...prevState,
     [field]: option,
   }));
 
   toggleDropdown(field); // Close current dropdown
 
   const currentIndex = dropdownFieldOrder.indexOf(field);
   if (currentIndex !== -1 && currentIndex < dropdownFieldOrder.length - 1) {
     const nextField = dropdownFieldOrder[currentIndex + 1];
 
     if (nonDropdownFields.includes(nextField)) {
       // Focus the next input field and scroll to it
       setTimeout(() => {
         const nextInput = document.querySelector(`[name="${nextField}"]`);
         if (nextInput) {
           nextInput.focus();
           nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
         }
       }, 150);
     } else {
       // Open next dropdown and scroll it into view
       setTimeout(() => {
         toggleDropdown(nextField);
         setTimeout(() => {
           const el = document.querySelector(`[data-field="${nextField}"]`);
           if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
         }, 100);
       }, 0);
     }
   }
 }}
 
                   style={{
                     fontWeight: 300,
                     padding: '5px',
                     cursor: 'pointer',
                     color: 'grey',
                     marginBottom: '5px',
                     borderBottom: '1px solid #D0D7DE',
                   }}
                 >
                   {option}
                 </li>
               ))}
             </ul>
 
             <div className="d-flex justify-content-end">
               <button
                 className="me-1"
                 type="button"
                onClick={() => {
     toggleDropdown(field); // Close current dropdown
 
     const currentIndex = dropdownFieldOrder.indexOf(field);
 
     if (currentIndex > 0) {
       const prevField = dropdownFieldOrder[currentIndex - 1];
 
       if (nonDropdownFields.includes(prevField)) {
         setTimeout(() => {
           const prevInput = document.querySelector(`[name="${prevField}"]`);
           if (prevInput) {
             prevInput.focus();
             prevInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
           }
         }, 100);
       } else {
         setTimeout(() => {
           toggleDropdown(prevField); // Open prev dropdown
           setTimeout(() => {
             const el = document.querySelector(`[data-field="${prevField}"]`);
             if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
           }, 100);
         }, 0);
       }
     }
   }}
                 style={{
                   background: '#EAEAF6',
                   cursor: 'pointer',
                   border: 'none',
                   color: '#0B57CF',
                   borderRadius: '10px',
                   padding: '5px 10px',
                   fontWeight: 500,
                 }}
               >
                 Prev
               </button>
  <button
   type="button"
   onClick={() => {
     toggleDropdown(field); // Close current dropdown
 
     const currentIndex = dropdownFieldOrder.indexOf(field);
 
     if (currentIndex !== -1 && currentIndex < dropdownFieldOrder.length - 1) {
       const nextField = dropdownFieldOrder[currentIndex + 1];
 
       if (nonDropdownFields.includes(nextField)) {
         setTimeout(() => {
           const nextInput = document.querySelector(`[name="${nextField}"]`);
           if (nextInput) {
             nextInput.focus();
             nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
           }
         }, 100);
       } else {
         setTimeout(() => {
           toggleDropdown(nextField); // Open next dropdown
           setTimeout(() => {
             const el = document.querySelector(`[data-field="${nextField}"]`);
             if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
           }, 100);
         }, 0);
       }
     }
   }}
  style={{
                    background: '#EAEAF6',
                    cursor: 'pointer',
                    border: 'none',
                    color: '#0B57CF',
                    borderRadius: '10px',
                    padding: '5px 10px',
                    fontWeight: 500,
                    marginRight:"5px"
                  }}
 >
   skip
 </button>
               <button
                 type="button"
                 onClick={() => toggleDropdown(field)}
                 style={{
                   background: '#0B57CF',
                   cursor: 'pointer',
                   border: 'none',
                   color: '#fff',
                   borderRadius: '10px',
                 }}
               >
                 Close
               </button>
             </div>
 
             {/* {[
               'negotiation',
               'ownership',
               'floorNo',
               'postedBy',
               'carParking',
               'bestTimeToCall',
             ].includes(field) && (
               <div
                 style={{
                   marginTop: '10px',
                   paddingTop: '10px',
                   borderTop: '1px solid #ccc',
                   textAlign: 'center',
                 }}
               >
                 <div
                   style={{
                     fontSize: '14px',
                     fontWeight: 400,
                     color: '#555',
                     marginBottom: '8px',
                   }}
                 >
                   Swipe through options to continue
                 </div>
               </div>
             )} */}
           </div>
         </div>
       )}
     </div>
   );
 };
 
  const nonDropdownFields = ["alternatePhone", "totalArea", "baName", "city", "area", "description",];

const dropdownFieldOrder = [
    "minPrice",
  "maxPrice",
   "altPhoneNumber",
  "propertyMode",
  "propertyType",
  "rentType",
  "bedrooms",
  "facing",
   "totalArea",
   
    "areaUnit",

  "floorNo",
"requirementType",
  "state",
  "city",
  "area",
  "description",
"familyMembers",
"foodHabit",
"jobType",
"petAllowed",


    // "totalArea",
  "raName",
  "phoneNumber"
];

    const fetchCitySuggestions = (input) => {
  clearTimeout(cityTimeoutRef.current);
  cityTimeoutRef.current = setTimeout(async () => {
    if (!input) return setCitySuggestions([]);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/cities?search=${input}`);
      setCitySuggestions(res.data.data);
    } catch (err) {
      setCitySuggestions([]);
    }
  }, 300);
};

// Pondicherry area -> pincode list used by the autosuggest.
// CH users get the Chennai list via getAreaMap() below.
const PONDY_AREA_PINCODE_MAP = {
  "Abishegapakkam": "605007",
  "Ariyankuppam": "605007",
  "Arumbarthapuram": "605110",
  "Bahoor": "607402",
  "Bommayarpalayam": "605104",
  "Botanical Garden": "605001",
  "calapet": "605014",
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
  "Thattanchavadi": "605009",
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

// City-aware accessor: CH users get the Chennai map, everyone else
// stays on the Pondicherry map. Called on every use because the active
// scope can change while the module stays loaded.
const getAreaMap = () =>
  getActiveBase() === 'CH' ? getChennaiAreaPincodeMap() : PONDY_AREA_PINCODE_MAP;

// Utility function to capitalize first letter
const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Handle area input change with suggestions
const handleAreaInputChange = (e) => {
  const value = e.target.value;
  setFormData(prev => ({ ...prev, area: value }));

  if (value.length > 0) {
    const filtered = Object.keys(getAreaMap()).filter(area =>
      area.toLowerCase().includes(value.toLowerCase())
    );
    setAreaSuggestions(filtered);
  } else {
    setAreaSuggestions([]);
  }
};

const fetchAreaSuggestions = (input) => {
  clearTimeout(areaTimeoutRef.current);
  areaTimeoutRef.current = setTimeout(async () => {
    if (!input) return setAreaSuggestions([]);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/areas?search=${input}`);
      setAreaSuggestions(res.data.data);
    } catch (err) {
      setAreaSuggestions([]);
    }
  }, 300);
};

  useEffect(() => {
    fetchPaymentTypes();
  }, []);
  
  const fetchPaymentTypes = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/payment-all`);
      setPaymentTypes(res.data); // Expected format: [{ paymentType: "Online" }, { paymentType: "Cash" }, ...]
    } catch (error) {
    }
  };
const navigate = useNavigate();
   const [countryCodes, setCountryCodes] = useState([
      { code: '+1', country: 'USA/Canada' },
      { code: '+44', country: 'UK' },
      { code: '+91', country: 'India' },
      { code: '+61', country: 'Australia' },
      { code: '+81', country: 'Japan' },
      { code: '+49', country: 'Germany' },
      { code: '+33', country: 'France' },
      { code: '+34', country: 'Spain' },
      { code: '+55', country: 'Brazil' },
      { code: '+52', country: 'Mexico' },
      { code: '+86', country: 'China' },
      { code: '+39', country: 'Italy' },
      { code: '+7', country: 'Russia/Kazakhstan' },
      // ... other countries
    ]);
  const [dataList, setDataList] = useState({});
  const [dropdownState, setDropdownState] = useState({ activeDropdown: null, filterText: "" });

  const [message, setMessage] = useState("");
const [showPopup, setShowPopup] = useState(false);
const [showConfirmPopup, setShowConfirmPopup] = useState(false);
const [showValidationError, setShowValidationError] = useState(false);
const [missingFields, setMissingFields] = useState([]);
const [priceValidationError, setPriceValidationError] = useState("");
const [showPaymentConfirmPopup, setShowPaymentConfirmPopup] = useState(false);


const handleSubmit = (e) => {
  e.preventDefault();

  const missingFieldsList = [];

  if (!formData.state) missingFieldsList.push('State');
  if (!formData.propertyType) missingFieldsList.push('Property Type');
  if (!formData.propertyMode) missingFieldsList.push('Property Mode');
  if (!formData.minPrice) missingFieldsList.push('Min Rental Amount');
  if (!formData.maxPrice) missingFieldsList.push('Max Rental Amount');
  if (!phoneNumber) missingFieldsList.push('Phone Number');
  if (!formData.rentType) missingFieldsList.push('Rent Type');
  if (!formData.bedrooms) missingFieldsList.push('Bedrooms');
  if (!formData.floorNo) missingFieldsList.push('Floor No');
  if (!formData.area) missingFieldsList.push('Area');
  if (!formData.pinCode) missingFieldsList.push('Pin Code');

  console.log("Missing fields:", missingFieldsList);
  
  if (missingFieldsList.length > 0) {
    setMissingFields(missingFieldsList);
    setShowValidationError(true);
    console.log("Validation error triggered, showValidationError set to true");
    return;
  }

  // Check if minPrice is greater than maxPrice
  if (parseInt(formData.minPrice) > parseInt(formData.maxPrice)) {
    setPriceValidationError("Min Rental Amount cannot be greater than Max Rental Amount");
    console.log("Price validation error triggered");
    return;
  }

  setPriceValidationError(""); // Clear any previous price errors
  setShowConfirmPopup(true); // all fields are valid
};




  useEffect(() => {
    fetchDropdownData();
    if (existingData) {
      setFormData(existingData);
    }
  }, [existingData]);

  const fetchDropdownData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-rent-excel`);
      const groupedData = response.data.data.reduce((acc, item) => {
        if (!acc[item.field]) acc[item.field] = [];
        acc[item.field].push(item.value);
        return acc;
      }, {});
      setDataList(groupedData);
    } catch (error) {
    }
  };

  const toggleDropdown = (field) => {
    setDropdownState((prevState) => ({ activeDropdown: prevState.activeDropdown === field ? null : field, filterText: "" }));
  };

  const handleDropdownSelect = (field, value) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
    setDropdownState({ activeDropdown: null, filterText: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

 const handleInputChanges = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));

  if (name === 'city') {
    fetchCitySuggestions(value);
  } else if (name === 'area') {
    fetchAreaSuggestions(value);
  }
};

    const handleFieldChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        
        ...prev,
        [name]: name === "description" && value.length > 0 
          ? value.charAt(0).toUpperCase() + value.slice(1)  // Capitalize only "description"
          : value,
          
      }));
        // Handle price conversion
    if (name === "rentalAmount") {
      if (value !== "" && !isNaN(value)) {
        setPriceInWords(convertToIndianRupees(value));
      } else {
        setPriceInWords("");
      }
    }
  };
     const convertToIndianRupees = (num) => {
        const number = parseInt(num, 10);
        if (isNaN(number)) return "";
      
        if (number >= 10000000) {
          return (number / 10000000).toFixed(2).replace(/\.00$/, '') + " crores";
        } else if (number >= 100000) {
          return (number / 100000).toFixed(2).replace(/\.00$/, '') + " lakhs";
        } else {
          return toWords(number).replace(/\b\w/g, l => l.toUpperCase()) + " rupees";
        }
      };
  
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
     
//   } catch (error) {
//     setMessage({ text: "Please fill all required fields correctly.", type: "error" });
//     setShowPopup(true);
//     setTimeout(() => {
//       setShowPopup(false);
//       setMessage("");
//     }, 3000);
//   }
// };
  
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
// Send WhatsApp notification with rental assistance details
const sendWhatsAppNotification = async (formDataToSend) => {
  try {
    const ownerName = formDataToSend?.raName || "User";
    const rawPhone = phoneNumber || formDataToSend?.phoneNumber || "";

    console.log("📱 Starting WhatsApp notification...");
    console.log("🔍 Debug - phoneNumber state:", phoneNumber);
    console.log("🔍 Debug - formDataToSend.phoneNumber:", formDataToSend?.phoneNumber);
    console.log("🔍 Debug - rawPhone:", rawPhone);

    // Format phone number for OneMsg (remove non-digits and add country code if needed)
    const mobileNumber = String(rawPhone).replace(/\D/g, ""); // Remove all non-numeric characters
    console.log("Mobile number (cleaned):", mobileNumber);
    
    const to = mobileNumber.length === 10 ? `91${mobileNumber}` : mobileNumber;
    console.log("Final phone (with country code):", to);

    if (!to || to.length < 11) {
      console.log("⚠️ Invalid phone number format (too short):", to, "Length:", to.length);
      return;
    }

    console.log("📨 Queuing WhatsApp to:", to);

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/queue-message`, {
      to,
      category: "buyer-assistance",
      data: {
        ownerName,
        propertyType: formDataToSend.propertyType,
        propertyMode: formDataToSend.propertyMode,
        minPrice: formDataToSend.minPrice,
        maxPrice: formDataToSend.maxPrice,
        rentType: formDataToSend.rentType,
        bedrooms: formDataToSend.bedrooms,
        floorNo: formDataToSend.floorNo,
        location: formDataToSend.area,
        pinCode: formDataToSend.pinCode,
      },
    });

    console.log("✅ WhatsApp message queued:", response.data);
  } catch (whatsErr) {
    console.log("⚠️ WhatsApp message failed (non-blocking):", whatsErr.message);
    console.log("Full error details:", {
      message: whatsErr.message,
      status: whatsErr.response?.status,
      statusText: whatsErr.response?.statusText,
      data: whatsErr.response?.data,
      config: whatsErr.config?.url
    });
  }
};

const handleConfirmSubmit = async () => {
  console.log("🔔 handleConfirmSubmit called!");
  setShowConfirmPopup(false); // hide the confirm popup

  try {
    let response;

    if (formData._id) {
      // Update existing request
      console.log("📝 Updating existing request...");
      response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-buyerAssistance-rent/${formData._id}`,
        formData
      );
      setMessage("Tenant Assistance request updated successfully!");
    } else {
      // Create new request
      console.log("📝 Creating new request...");
      response = await axios.post(
        `${process.env.REACT_APP_API_URL}/add-buyerAssistance-rent`,
        formData
      );
      console.log("📝 Response from API:", response.data);
      setFormData(response.data.data); // Save returned formData with IDs etc.
      setMessage("Tenant Assistance request added successfully!");
      
      console.log("📝 Form data before WhatsApp:", formData);
      console.log("📝 Phone number state:", phoneNumber);
      console.log("📝 Response data:", response.data.data);
      // Send WhatsApp notification
      console.log("🚀 Calling sendWhatsAppNotification...");
      sendWhatsAppNotification(formData);
    }

    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
      setMessage("");

      // Call onSuccess callback if provided
      if (onSuccess) {
        console.log("🔔 Calling onSuccess callback with data:", response.data.data);
        onSuccess(response.data.data);
      } else {
        // Show payment confirmation popup instead of direct navigation
        setShowPaymentConfirmPopup(true);
      }
    }, 1500);
  } catch (error) {
    setMessage("Please fill all required fields correctly." );
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setMessage("");
    }, 3000);
  }
};

// Handle payment process continuation
const handlePaymentYes = () => {
  setShowPaymentConfirmPopup(false);
  const Ra_Id = formData.Ra_Id || formData._id;
  const phone = formData.phoneNumber || phoneNumber;

  if (Ra_Id && phone) {
    // Show success message
    setMessage("✓ Proceeding to payment process...");
    setShowPopup(true);
    
    setTimeout(() => {
      setShowPopup(false);
      setMessage("");
      navigate("/buyer-plan", {
        state: {
          Ra_Id,
          phoneNumber: phone,
        },
      });
    }, 1500);
  } else {
    setMessage("Missing Tenant assistance ID or phone number");
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setMessage("");
    }, 3000);
  }
};

// Handle payment skip - navigate to buyer assistance
const handlePaymentNo = () => {
  setShowPaymentConfirmPopup(false);
  // Show skip message
  setMessage("Request saved. You can complete payment anytime from your dashboard.");
  setShowPopup(true);
  
  setTimeout(() => {
    setShowPopup(false);
    setMessage("");
    navigate("/buyer-assis-buyer");
  }, 2000);
};



  return (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
    <div className="property-form-container p-1" style={{ position: "relative", scrollbarWidth: "none" , fontFamily: "Inter, sans-serif",}}>
      {/* <img src={imge} alt="" className="header-image"  style={{width:'100%'}}/>
      <div className="w-100 d-flex justify-content-around align-items-center mt-3">
     
        <button style={{
          ...baseStyle,
          opacity: 0.6,
          cursor: "not-allowed",
        }}
        disabled
        >Add Buyer Assistant</button>
        <button   style={{
          ...baseStyle,
          ...(hovered ? hoverStyle : {}),
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => navigate(`/Buyer-List-Filter`)}

   >view Buyer List</button>



      </div> */}

        <div className="d-flex flex-column mx-auto custom-scrollbar"
    style={{
      maxWidth: '450px',
      height: '100vh',
      overflow: 'auto',
      overflowY: 'auto',
      scrollbarWidth: 'none', 
      msOverflowStyle: 'none', 
      fontFamily: 'Inter, sans-serif'
    }}>

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
       </button><h3 className="m-0" style={{fontSize:"18px"}}>RENTAL ASSIATANT</h3> </div>

    <img src={imge} alt="" className="header-image"  style={{width:'100%'}}/>
     
    <div className="w-100 d-flex justify-content-around align-items-center mt-3">
        <button style={{
          ...baseStyle,
          opacity: 0.6,
          cursor: "not-allowed",
        }}
        disabled
        >Add Tenant list</button>
        <button   style={{
          ...baseStyle,
          ...(hovered ? hoverStyle : {}),
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => navigate(`/Buyer-List-Filter`)}

   >view Tenant List</button>

      </div>
      <h4 className="form-title mt-3" style={{color: '#4F4B7E', fontSize:"15px", fontWeight:"bold"}}>Rent Budget</h4>
      <div>
      {message && <div className="alert text-success text-bold">{message}</div>}
      {/* Your existing component structure goes here */}
    </div>

      {/* REQUIRED FIELDS SECTION */}
      <div style={{
        background: '#F8F9FF',
        border: '2px solid #4F4B7E',
        borderRadius: '10px',
        padding: '16px',
        marginBottom: '20px',
        fontFamily: 'Inter, sans-serif'
      }}>
        <h5 style={{ color: '#4F4B7E', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📋 Required Fields ({Object.keys(formData).filter(key => ['state', 'propertyType', 'propertyMode', 'minPrice', 'maxPrice', 'phoneNumber', 'rentType', 'bedrooms', 'floorNo', 'area', 'pinCode'].includes(key) && formData[key]).length}/11)
        </h5>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            {formData.state ? <span style={{ color: '#4CAF50', fontSize: '16px' }}>✓</span> : <span style={{ color: '#d32f2f', fontSize: '16px' }}>✕</span>}
            <span style={{ color: formData.state ? '#4CAF50' : '#999' }}>State</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            {formData.propertyType ? <span style={{ color: '#4CAF50', fontSize: '16px' }}>✓</span> : <span style={{ color: '#d32f2f', fontSize: '16px' }}>✕</span>}
            <span style={{ color: formData.propertyType ? '#4CAF50' : '#999' }}>Property Type</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            {formData.propertyMode ? <span style={{ color: '#4CAF50', fontSize: '16px' }}>✓</span> : <span style={{ color: '#d32f2f', fontSize: '16px' }}>✕</span>}
            <span style={{ color: formData.propertyMode ? '#4CAF50' : '#999' }}>Property Mode</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            {formData.minPrice ? <span style={{ color: '#4CAF50', fontSize: '16px' }}>✓</span> : <span style={{ color: '#d32f2f', fontSize: '16px' }}>✕</span>}
            <span style={{ color: formData.minPrice ? '#4CAF50' : '#999' }}>Min Amount</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            {formData.maxPrice ? <span style={{ color: '#4CAF50', fontSize: '16px' }}>✓</span> : <span style={{ color: '#d32f2f', fontSize: '16px' }}>✕</span>}
            <span style={{ color: formData.maxPrice ? '#4CAF50' : '#999' }}>Max Amount</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            {formData.phoneNumber ? <span style={{ color: '#4CAF50', fontSize: '16px' }}>✓</span> : <span style={{ color: '#d32f2f', fontSize: '16px' }}>✕</span>}
            <span style={{ color: formData.phoneNumber ? '#4CAF50' : '#999' }}>Phone</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            {formData.rentType ? <span style={{ color: '#4CAF50', fontSize: '16px' }}>✓</span> : <span style={{ color: '#d32f2f', fontSize: '16px' }}>✕</span>}
            <span style={{ color: formData.rentType ? '#4CAF50' : '#999' }}>Rent Type</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            {formData.bedrooms ? <span style={{ color: '#4CAF50', fontSize: '16px' }}>✓</span> : <span style={{ color: '#d32f2f', fontSize: '16px' }}>✕</span>}
            <span style={{ color: formData.bedrooms ? '#4CAF50' : '#999' }}>Bedrooms</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            {formData.floorNo ? <span style={{ color: '#4CAF50', fontSize: '16px' }}>✓</span> : <span style={{ color: '#d32f2f', fontSize: '16px' }}>✕</span>}
            <span style={{ color: formData.floorNo ? '#4CAF50' : '#999' }}>Floor No</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            {formData.area ? <span style={{ color: '#4CAF50', fontSize: '16px' }}>✓</span> : <span style={{ color: '#d32f2f', fontSize: '16px' }}>✕</span>}
            <span style={{ color: formData.area ? '#4CAF50' : '#999' }}>Area</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            {formData.pinCode ? <span style={{ color: '#4CAF50', fontSize: '16px' }}>✓</span> : <span style={{ color: '#d32f2f', fontSize: '16px' }}>✕</span>}
            <span style={{ color: formData.pinCode ? '#4CAF50' : '#999' }}>Pin Code</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-3">
  
    

 <div className="row mb-3 justify-content-around">
 
 
{/* <div className="form-group col-5 p-0 m-0" >
    <label style={{width:'100%'}}>
    <label>minPrice <span style={{ color: 'red' }}>* </span></label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
          <select
            name="minPrice"
            value={formData.minPrice || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select minPrice</option>
            {dataList.minPrice?.map((option, index) => (
              <option key={index} value={option}>
                 {formatPrice(option)}
              </option>
            ))}
          </select>

          <button
            className="m-0"
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
              <img src={minprice} alt=""  width={20}/>
            </span>
            {formData.minPrice ? formatPrice(formData.minPrice) : "Select minPrice"}
          </button>

          {renderDropdown("minPrice")}
        </div>
      </div>
    </label>
  </div> */}
<div div className="form-group col-5 p-0 m-0" >
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
<img src={minprice} alt="" width={20}/>
 <sup style={{ color: 'red' }}>*</sup>  </span>

  <div style={{ flex: "1" }}>
    <select
      name="minPrice"
      value={formData.minPrice || ""}
      onChange={handleFieldChange}
      className="form-control"
      style={{ display: "none" }}
    >
      <option value="">Select minPrice</option>
      {dataList.minPrice?.map((option, index) => (
        <option key={index} value={option}>
         {formatPrice(option)}
        </option>
      ))}
    </select>

    <button
      className="m-0"
      type="button"
      onClick={() => toggleDropdown("minPrice")}
      style={{
        border:"none",
        cursor: "pointer",
        padding: "12px",
        background: "#fff",
        borderRadius: "5px",
        width: "100%",
        textAlign: "left",
        color: "grey",
        position: "relative",
        boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
        fontSize:"13px"
      }}
    >
{formData.minPrice ? formatPrice(formData.minPrice) : "Select Min Rental Amount"}
      {formData.minPrice && (
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
    {/* <div className="form-group col-5 p-0 m-0" >
        <label style={{width:'100%'}}>
        <label>maxPrice <span style={{ color: 'red' }}>* </span></label>
    
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: "1" }}>
              <select
                name="maxPrice"
                value={formData.maxPrice || ""}
                onChange={handleFieldChange}
                className="form-control"
                style={{ display: "none" }} // Hide the default <select> dropdown
              >
                <option value="">Select maxPrice</option>
                {dataList.maxPrice?.map((option, index) => (
                  <option key={index} value={option}>
                     {formatPrice(option)}
                  </option>
                ))}
              </select>
    
              <button
                className="m-0"
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
                  <img src={maxprice} alt="" width={20}/>
                </span>
{formData.maxPrice ? formatPrice(formData.maxPrice) : "Select maxPrice"}
              </button>
    
              {renderDropdown("maxPrice")}
            </div>
          </div>
        </label>
      </div> */}
 <div className="form-group col-5 p-0 m-0" >
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
 <img src={maxprice} alt="" width={20}/>
 <sup style={{ color: 'red' }}>*</sup>  </span>

  <div style={{ flex: "1" }}>
    <select
      name="maxPrice"
      value={formData.maxPrice || ""}
      onChange={handleFieldChange}
      className="form-control"
      style={{ display: "none" }}
    >
      <option value="">Select maxPrice</option>
      {dataList.maxPrice?.map((option, index) => (
        <option key={index} value={option}>
          {formatPrice(option)}
        </option>
      ))}
    </select>

    <button
      className="m-0"
      type="button"
      onClick={() => toggleDropdown("maxPrice")}
      style={{
        border:"none",
        cursor: "pointer",
        padding: "12px",
        background: "#fff",
        borderRadius: "5px",
        width: "100%",
        textAlign: "left",
        color: "grey",
        position: "relative",
        boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
        fontSize:"13px"

      }}
    >
{formData.maxPrice ? formatPrice(formData.maxPrice) : "Select Max Rental Amount"}
      {formData.maxPrice && (
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

{formData.minPrice && formData.maxPrice && parseInt(formData.minPrice) > parseInt(formData.maxPrice) && (
  <div style={{
    color: '#d32f2f',
    fontSize: '12px',
    marginTop: '8px',
    padding: '8px 12px',
    backgroundColor: '#ffebee',
    borderLeft: '3px solid #d32f2f',
    borderRadius: '4px'
  }}>
    ⚠️ Min Rental Amount cannot be greater than Max Rental Amount
  </div>
)}

    </label>
  </div>

    </div>

<div className="form-group">
  {/* <label>Tenant Name:</label> */}
  
  <div className="input-card p-0 rounded-2" style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: '100%',  
    boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
    background: "#fff",
    paddingRight: "10px",
    borderRadius: '5px',
  }}>
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
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
          background: "#fff",
        }}
      >
        <img src={ownerName} alt="" style={{ width: 20, height: 20, marginLeft: "10px" }} />
      </span>
      <div style={{ display: 'flex', alignItems: 'center', flex: '1', paddingLeft: '8px' }}>
        <input
          type="text"
          name="tenantName"
          value={formData.tenantName}
          onChange={handleFieldChange}
          className="form-input m-0"
          placeholder="Tenant Name"
          style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none', color: "grey" }}
        />
      </div>
    </div>
    {formData.tenantName && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
  </div>
</div>

      {/* <div className="col-12 mb-3">
        <label  style={{fontWeight:600}}>PhoneNumber</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border: '1px solid #4F4B7E', background: "#fff" }}>
    <FaPhoneAlt className="input-icon" style={{ color: '#4F4B7E', marginLeft: "10px" }} />
    <input
      type="tel"
      name="phoneNumber"
      value={formData.phoneNumber}
      onChange={handleInputChange}
      className="form-input m-0"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
      />
  </div>
</div> */}
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
    
    <div style={{ flex: '0 0 10%' }}>
  <label className="m-0">
    <select
      name="countryCode"
      value={"+91"}
      readOnly
      onChange={handleFieldChange}
      className="form-control m-0 pt-2"
      style={{ width: '100%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    >
      {countryCodes.map((item, index) => (
        <option key={index} value={item.code}>
          {item.code} {item.country}
        </option>
      ))}
    </select>
  </label>
</div>


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

{/* <div className="col-12 mb-3">
  <label  style={{fontWeight:600}}>AlternatePhone</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border: '1px solid #4F4B7E', background: "#fff" }}>
    <FaPhoneAlt className="input-icon" style={{ color: '#4F4B7E', marginLeft: "10px" }} />
    <input
      type="number"
      name="alternatePhone"
      value={formData.alternatePhone}
      onChange={handleInputChange}
      className="form-input m-0"
      placeholder="Enter Your alternatePhone"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
      />
  </div>
</div> */}
<div className="form-group">
{/* <label>Alternate number:</label> */}

  <div className="input-card p-0 rounded-2" style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: '100%',  
    boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
    background: "#fff",
    paddingRight: "10px"
  }}>
    
  <img src={altphone} alt="" style={{ width: 20, height: 20 ,marginLeft:"10px"}} />
     {/* <FaPhone className="input-icon" style={{ color: '#4F4B7E',marginLeft:"10px" }} /> */}
    
    <div style={{ flex: '0 1 10%' }}>
      <label className="m-0">
        <select
          name="countryCode"
          value={"+91"}
          onChange={handleFieldChange}
          className="form-control m-0"
          style={{ width: '100%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
        >
          <option value="">Select Country Code</option>
          {countryCodes.map((item, index) => (
            <option key={index} value={item.code}>
              {item.code} {item.country}
            </option>
          ))}
        </select>
      </label>
    </div>
    <div style={{ display: "flex", alignItems: "center", flex: 1 }}>


  <input
      type="number"
      name="alternatePhone"
      value={formData.alternatePhone}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Alternate Phone Number"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.alternatePhone && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
    </div>
</div>
<div className="row justify-content-center">

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
 {fieldIcons.propertyMode} <sup style={{ color: 'red' }}>*</sup>  </span>

  <div style={{ flex: "1" }}>
    <select
      name="propertyMode"
      value={formData.propertyMode || ""}
      onChange={handleFieldChange}
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
        border:"none",
        cursor: "pointer",
        padding: "12px",
        background: "#fff",
        borderRadius: "5px",
        width: "100%",
        textAlign: "left",
        color: "grey",
        position: "relative",
        boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
      }}
    >
      {formData.propertyMode || "Select Property Mode"}
      {formData.propertyMode && (
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
            {fieldIcons.propertyType} <sup style={{ color: 'red' }}>*</sup>
          </span>
      <div style={{ flex: "1" }}>
        <select
          name="propertyType"
          value={formData.propertyType || ""}
          onChange={handleFieldChange}
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
            border:"none",
            cursor: "pointer",
            // border: "1px solid #4F4B7E",
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
    
          {formData.propertyType || "Select Property Type"}

          {formData.propertyType && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}
        </button>

        {renderDropdown("propertyType")}
      </div>
    </div>
  </label>
</div>

 
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
            {fieldIcons.rentType} <sup style={{ color: 'red' }}>*</sup>
          </span>
      <div style={{ flex: "1" }}>
        <select
          name="rentType"
          value={formData.rentType || ""}
          onChange={handleFieldChange}
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
            border:"none",
            // border: "1px solid #4F4B7E",
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
    
          {formData.rentType || "Select Rent Type"}

          {formData.rentType && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}
        </button>

        {renderDropdown("rentType")}
      </div>
    </div>
  </label>
</div>


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
              {fieldIcons.bedrooms || <FaHome />} <sup style={{ color: 'red' }}>*</sup>
            </span> <div style={{ flex: "1" }}>
          <select
          
            name="bedrooms"
            value={formData.bedrooms || ""}
            onChange={handleFieldChange}
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
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
             
            {formData.bedrooms || "Select Bedrooms"}
 {formData.bedrooms && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("bedrooms")}
        </div>
      </div>
    </label>
  </div>


  {/* <div className="form-group">

    <label style={{ width: '100%'}}>
    <label>Facing</label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
          <select
            name="facing"
            value={formData.facing || ""}
            onChange={handleFieldChange}
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
              {fieldIcons.facing || <FaHome />}
            </span>
            {formData.facing || "Select facing"}
          </button>

          {renderDropdown("facing")}
        </div>
      </div>
    </label>
  </div> */}


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
              {fieldIcons.facing}
            </span>  <div style={{ flex: "1" }}>
          <select
            name="facing"
            value={formData.facing || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select Facing</option>
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
              border:"none",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
            
            {formData.facing || "Select Facing"}
 {formData.facing && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("facing")}
        </div>
      </div>
    </label>
  </div>
   <div className="form-group">
    {/* <label>Total Area: <span style={{ color: 'red' }}>* </span> </label> */}
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
  {fieldIcons.totalArea} 
  </span>
    <input
        type="number"
        name="totalArea"
        value={formData.totalArea}
        onChange={handleFieldChange}
        className="form-input m-0"
        placeholder="Total Area"
        
          style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
      />
    </div>
     {formData.totalArea && (
        <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
      )}
    </div> 
    
    </div>
  
      {/* areaUnit */}
      <div className="form-group">
      <label style={{ width: '100%'}}>
      {/* <label>Area Unit <span style={{ color: 'red' }}>* </span> </label> */}
  
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
                {fieldIcons.areaUnit || <FaHome />}
              </span>
                   <div style={{ flex: "1" }}>
            <select
              name="areaUnit"
              value={formData.areaUnit || ""}
              onChange={handleFieldChange}
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
              className="m-0"
              type="button"  
              onClick={() => toggleDropdown("areaUnit")}
              style={{
                cursor: "pointer",
                // border: "1px solid #4F4B7E",
                padding: "12px",
                border:"none",
                background: "#fff",
                borderRadius: "5px",
                width: "100%",
                textAlign: "left",
                color: "grey",
              position: "relative",
                          boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
  }}
            >
  
              {formData.areaUnit || "Select Area Unit"}
   {formData.areaUnit && (
              <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
            )}          </button>
  
            {renderDropdown("areaUnit")}
          </div>
        </div>
      </label>
    </div>
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
              {fieldIcons.floorNo} <sup style={{ color: 'red' }}>*</sup>
            </span>  <div style={{ flex: "1" }}>
          <select
            name="floorNo"
            value={formData.floorNo || ""}
            onChange={handleFieldChange}
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
              // border: "1px solid #4F4B7E",
              padding: "12px",
              background: "#fff",
              border:"none",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
            
            {formData.floorNo || "Select Floor No"}
 {formData.floorNo && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("floorNo")}
        </div>
      </div>
    </label>
  </div>



  <div className="form-group">
    <label style={{ width: '100%'}}>
    {/* <label>requirementType </label> */}

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
              {fieldIcons.requirementType || <FaHome />}
            </span>  <div style={{ flex: "1" }}>
          <select
            name="requirementType"
            value={formData.requirementType || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select requirementType</option>
            {dataList.requirementType?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("requirementType")}
            style={{
              cursor: "pointer",
              // border: "1px solid #4F4B7E",
              padding: "12px",
              border:"none",
              background: "#fff",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
             
            {formData.requirementType || "Select Requirement Type"}
 {formData.requirementType && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("requirementType")}
        </div>
      </div>
    </label>
  </div>


{/* 
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
     <MdLocationCity className="input-icon" style={{color: '#4F4B7E',}} /><sup style={{ color: 'red' }}>*</sup>
  </span>
  <input
      type="text"
      name="state"
      value={formData.state}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="State"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.state && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div></div> */}

 <div className="form-group">
    <label style={{width:"100%"}}>
    {/* <label>state</label> */}

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
              {fieldIcons.state || <FaHome />} <sup style={{ color: 'red' }}>*</sup>
            </span>    <div style={{ flex: "1" }}>
          <select
            name="state"
            value={formData.state || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
            >
            <option value="">Select state</option>
            {dataList.state?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("state")}
            style={{
              cursor: "pointer",
              // border: "1px solid #4F4B7E",
              padding: "12px",
              background: "#fff",
              border:"none",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
             boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
          
            {formData.state || "Select State"}
 {formData.state && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("state")}
        </div>
      </div>
    </label>
  </div>
{/* <div className="col-12 mb-3" style={{ position: 'relative' }}>
  <label style={{ fontWeight: 600 }}>City</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', border: '1px solid #4F4B7E', background: "#fff" }}>
    <FaCity style={{ color: '#4F4B7E', marginLeft: "10px" }} />
    <input className="m-0"
      type="text"
      name="city"
      value={formData.city}
      onChange={handleInputChanges}
      placeholder="Enter City"
      style={{ flex: '1', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
  
  {citySuggestions.length > 0 && (
  <ul style={suggestionListStyle}>
    {citySuggestions.map((city, index) => (
      <li
        key={index}
        style={{
          ...suggestionItemStyle,
          ...(hoveredIndex === index ? suggestionItemHoverStyle : {}),
        }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={() => {
          setFormData({ ...formData, city: city });
          setCitySuggestions([]);
        }}
      >
        {city}
      </li>
    ))}
  </ul>
)}

</div> */}

<div className="form-group"  style={{ position: 'relative' }}>
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
      value={formData.city}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="City"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.city && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div>
 
  {citySuggestions.length > 0 && (
  <ul style={suggestionListStyle}>
    {citySuggestions.map((city, index) => (
      <li
        key={index}
        style={{
          ...suggestionItemStyle,
          ...(hoveredIndex === index ? suggestionItemHoverStyle : {}),
        }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={() => {
          setFormData({ ...formData, city: city });
          setCitySuggestions([]);
        }}
      >
        {city}
      </li>
    ))}
  </ul>
)}</div>


{/* <div className="col-12 mb-3" style={{ position: 'relative' }}>
  <label style={{ fontWeight: 600 }}>Area</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', border: '1px solid #4F4B7E', background: "#fff" }}>
    <FaCity style={{ color: '#4F4B7E', marginLeft: "10px" }} />
    <input  className="m-0"
      type="text"
      name="area"
      value={formData.area}
      onChange={handleInputChanges}
      placeholder="Enter Area"
      style={{ flex: '1', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
 {areaSuggestions.length > 0 && (
  <ul style={suggestionListStyle}>
    {areaSuggestions.map((area, index) => (
      <li
        key={index}
        style={{
          ...suggestionItemStyle,
          ...(hoveredAreaIndex === index ? suggestionItemHoverStyle : {}),
        }}
        onMouseEnter={() => setHoveredAreaIndex(index)}
        onMouseLeave={() => setHoveredAreaIndex(null)}
        onClick={() => {
          setFormData({ ...formData, area });
          setAreaSuggestions([]);
        }}
      >
        {area}
      </li>
    ))}
  </ul>
)}

</div> */}

  <div className="form-group" style={{ position: 'relative' }}>
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
 {fieldIcons.area} <sup style={{ color: 'red' }}>*</sup></span>
  <input
      type="text"
      name="area"
      value={formData.area}
      onChange={handleAreaInputChange}
      className="form-input m-0"
      placeholder="Area"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.area && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div>

 {areaSuggestions.length > 0 && (
  <ul style={suggestionListStyle}>
    {areaSuggestions.map((area, index) => (
      <li
        key={index}
        style={{
          ...suggestionItemStyle,
          ...(hoveredAreaIndex === index ? suggestionItemHoverStyle : {}),
        }}
        onMouseEnter={() => setHoveredAreaIndex(index)}
        onMouseLeave={() => setHoveredAreaIndex(null)}
        onClick={() => {
          const pincode = getAreaMap()[area] || "";
          setFormData({ ...formData, area: capitalizeFirstLetter(area), pinCode: pincode });
          setAreaSuggestions([]);
        }}
      >
        {capitalizeFirstLetter(area)}
      </li>
    ))}
  </ul>
)}</div>


<div className="form-group" style={{ position: 'relative' }}>
  {/* <label>Pin Code:</label> */}
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
 {fieldIcons.pinCode} <sup style={{ color: 'red' }}>*</sup></span>
  <input
      type="text"
      name="pinCode"
      value={formData.pinCode}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Pin Code"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.pinCode && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div>
</div>

<h6 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}> Description   </h6>             





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
     <textarea
       name="description"
       value={formData.description}
       onChange={(e) => {
         const value = e.target.value;
         // Limit to 200 characters
         if (value.length <= 200) {
           setFormData(prev => ({ ...prev, description: value }));
         }
       }}
       className="form-control"
       placeholder="Enter your Short Requirement"
       maxLength="200"
       style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey", resize: 'none', minHeight: '80px'}}
   
     ></textarea>
   </div>
   <div style={{
     display: 'flex',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginTop: '8px',
     paddingRight: '10px'
   }}>
     <span style={{ fontSize: '12px', color: '#999' }}>Max 200 characters</span>
     <span style={{
       fontSize: '12px',
       fontWeight: '600',
       color: formData.description.length >= 200 ? '#d32f2f' : '#4F4B7E'
     }}>
       {formData.description.length}/200
     </span>
   </div>
   </div>  



<h6 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}> My Family Info   </h6>             



{/* familyMembers */}
  <div className="form-group">
    <label style={{width:"100%"}}>
    {/* <label>familyMembers</label> */}

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
              {fieldIcons.familyMembers || <FaHome />}
            </span>    <div style={{ flex: "1" }}>
          <select
            name="familyMembers"
            value={formData.familyMembers || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select familyMembers</option>
            {dataList.familyMembers?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("familyMembers")}
            style={{
              cursor: "pointer",
              // border: "1px solid #4F4B7E",
              padding: "12px",
              background: "#fff",
              border:"none",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
          
            {formData.familyMembers || "Select No of Family Members"}
 {formData.familyMembers && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("familyMembers")}
        </div>
      </div>
    </label>
  </div>

{/* foodHabit */}
  <div className="form-group">
    <label style={{width:"100%"}}>
    {/* <label>foodHabit</label> */}

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
              {fieldIcons.foodHabit || <FaHome />}
            </span>    <div style={{ flex: "1" }}>
          <select
            name="foodHabit"
            value={formData.foodHabit || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select foodHabit</option>
            {dataList.foodHabit?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("foodHabit")}
            style={{
              cursor: "pointer",
              // border: "1px solid #4F4B7E",
              padding: "12px",
              background: "#fff",
              borderRadius: "5px",
              width: "100%",
              border:"none",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
          
            {formData.foodHabit || "Select Food Habit"}
 {formData.foodHabit && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("foodHabit")}
        </div>
      </div>
    </label>
  </div>
{/* jobType */}
    <div className="form-group">
    <label style={{width:"100%"}}>
    {/* <label>jobType</label> */}

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
              {fieldIcons.jobType || <FaHome />}
            </span>    <div style={{ flex: "1" }}>
          <select
            name="jobType"
            value={formData.jobType || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select jobType</option>
            {dataList.jobType?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("jobType")}
            style={{
              cursor: "pointer",
              // border: "1px solid #4F4B7E",
              padding: "12px",
              background: "#fff",
              border:"none",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
          
            {formData.jobType || "Select Job Type"}
 {formData.jobType && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("jobType")}
        </div>
      </div>
    </label>
  </div>
{/* petAllowed */}
  <div className="form-group">
    <label style={{width:"100%"}}>
    {/* <label>petAllowed</label> */}

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
              {fieldIcons.petAllowed || <FaHome />}
            </span>    <div style={{ flex: "1" }}>
          <select
            name="petAllowed"
            value={formData.petAllowed || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select petAllowed</option>
            {dataList.petAllowed?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("petAllowed")}
            style={{
              cursor: "pointer",
              // border: "1px solid #4F4B7E",
              padding: "12px",
              background: "#fff",
              border:"none",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
          
            {formData.petAllowed || "Select Pet"}
 {formData.petAllowed && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("petAllowed")}
        </div>
      </div>
    </label>
  </div>
  
</div>

  

        <button type="submit" className="submit-button" style={{ padding: "10px 20px", cursor: "pointer", background:"#4F4B7E", border:'none', color:'#ffffff', width:"100%"}}
        
        onMouseOver={(e) => {
          e.target.style.background = "#CDC9F9"; // Brighter neon on hover
          e.target.style.fontWeight = 500; // Brighter neon on hover
          e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover

        }}
        onMouseOut={(e) => {
          e.target.style.background = "#4F4B7E"; // Original orange
          e.target.style.fontWeight = 400; // Brighter neon on hover

        }}>
          {formData._id ? "UPDATE PROPERTY ASSISTANCE" : "ADD PROPERTY ASSISTANCE"}
        </button>
      </form>
    </div>
    </div>

    {showValidationError && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
    }}
  >
    <div
      style={{
        background: 'white',
        padding: '32px',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        zIndex: 10001,
      }}
    >
      <h5 style={{ color: '#4F4B7E', fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
        ⚠️ Please fill mandatory fields
      </h5>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5' }}>
        The following required fields are empty:
      </p>
      <ul style={{
        textAlign: 'left',
        color: '#d32f2f',
        fontSize: '13px',
        marginBottom: '20px',
        paddingLeft: '20px',
        listStyleType: 'disc',
      }}>
        {missingFields.map((field) => (
          <li key={field} style={{ marginBottom: '6px' }}>
            {field}
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          setShowValidationError(false);
          setMissingFields([]);
        }}
        style={{
          marginTop: '20px',
          padding: '10px 24px',
          backgroundColor: '#4F4B7E',
          border: 'none',
          color: '#fff',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        OK
      </button>
    </div>
  </div>
)}

    {priceValidationError && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
    }}
  >
    <div
      style={{
        background: 'white',
        padding: '32px',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        zIndex: 10001,
      }}
    >
      <h5 style={{ color: '#d32f2f', fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
        ⚠️ Invalid Price Range
      </h5>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5' }}>
        {priceValidationError}
      </p>
      <button
        onClick={() => {
          setPriceValidationError("");
        }}
        style={{
          marginTop: '20px',
          padding: '10px 24px',
          backgroundColor: '#4F4B7E',
          border: 'none',
          color: '#fff',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        OK
      </button>
    </div>
  </div>
)}

    {showConfirmPopup && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9998,
    }}
  >
    <div
      style={{
        background: 'white',
        padding: '32px',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        zIndex: 9999,
      }}
    >
      <h5 style={{ color: '#4F4B7E', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
        Confirm Request
      </h5>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
        Do you want to create this Rental Assistance request?
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={handleConfirmSubmit}
          style={{
            padding: '10px 24px',
            backgroundColor: '#6CBAAF',
            border: 'none',
            color: '#fff',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Yes
        </button>
        <button
          onClick={() => setShowConfirmPopup(false)}
          style={{
            padding: '10px 24px',
            backgroundColor: '#ccc',
            border: 'none',
            color: '#333',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          No
        </button>
      </div>
    </div>
  </div>
)}

{showPaymentConfirmPopup && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
    }}
  >
    <div
      style={{
        background: 'white',
        padding: '32px',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '420px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        zIndex: 10001,
      }}
    >
      <h5 style={{ color: '#4F4B7E', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
        💳 Continue Payment Process?
      </h5>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
        Your rental assistance request has been created successfully. Would you like to continue with the payment process to proceed further?
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={handlePaymentYes}
          style={{
            padding: '10px 28px',
            backgroundColor: '#6CBAAF',
            border: 'none',
            color: '#fff',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#5aada3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#6CBAAF'}
        >
          ✓ Yes, Continue
        </button>
        <button
          onClick={handlePaymentNo}
          style={{
            padding: '10px 28px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ddd',
            color: '#333',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e0e0e0';
            e.target.style.borderColor = '#ccc';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f0f0f0';
            e.target.style.borderColor = '#ddd';
          }}
        >
          ✕ Skip for Now
        </button>
      </div>
    </div>
  </div>
)}

    </motion.div>
  );
};





export default BuyerAssistance;
















































































































// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// // import { FaChevronDown, FaPhone } from "react-icons/fa";
// import imge from "../Assets/tenant_assist.png";
// import { RiCloseCircleFill, RiLayoutLine } from 'react-icons/ri';
// import { TbFileDescription , TbMapPinCode, TbWorldLongitude ,TbWheelchair , } from 'react-icons/tb';
// import {FaPhoneAlt, FaRulerCombined,  FaBath, FaChartArea, FaPhone ,FaEdit,FaRoad,FaCreditCard,FaLandmark, FaHome, FaUserAlt, FaEnvelope,  FaRupeeSign , FaFileVideo , FaToilet,FaCar,FaBed,  FaCity , FaTimes, FaArrowRight, FaStreetView, FaSearch, FaHandHoldingUsd, FaUsers, FaUtensils, FaBriefcase, FaDog,FaArrowLeft, FaChevronLeft} from 'react-icons/fa';
// import {  FaRegAddressCard, FaChevronDown } from 'react-icons/fa6';
// import { MdLocationOn, MdOutlineMeetingRoom, MdBalcony , MdSchedule , MdStraighten , MdApproval, MdLocationCity , MdAddPhotoAlternate, MdKeyboardDoubleArrowDown, MdOutlineClose} from "react-icons/md";
// import { BsBank, BsBuildingsFill, BsFillHouseCheckFill , BsTextareaT} from "react-icons/bs";
// import { GirequirementTypeScale, GiMoneyStack , GiResize , GiGears} from "react-icons/gi";
// import { HiUserGroup } from "react-icons/hi";
// import { BiBuildingHouse , BiMap, BiWorld} from "react-icons/bi";
// import {   FaFileAlt, FaGlobeAmericas, FaMapMarkerAlt, FaMapSigns } from "react-icons/fa";
// import {MdElevator ,MdOutlineChair ,MdPhone, MdOutlineAccessTime, MdTimer, MdHomeWork, MdHouseSiding, MdOutlinerequirementType, MdEmail, } from "react-icons/md";
// import {  BsBarChart, BsGraphUp } from "react-icons/bs";
// import { BiBuilding, BiStreetView } from "react-icons/bi";
// import { GiStairs, GiForkKnifeSpoon, GiWindow } from "react-icons/gi";
// import { AiOutlineEye, AiOutlineColumnWidth, AiOutlineColumnHeight } from "react-icons/ai";
// import { BiBed, BiBath, BiCar, BiCalendar, BiUser, BiCube } from "react-icons/bi";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import minprice from "../Assets/Price Mini-01.png";
// import maxprice from "../Assets/Price maxi-01.png";
// import { FcSearch } from "react-icons/fc";
// import { toWords } from 'number-to-words';

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
// import requirementType from '../Assets/alt_mob.PNG';
// import requirementTypeType from '../Assets/alt_mob.PNG';
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
// import { LiaCitySolid } from "react-icons/lia";
// import { GoCheckCircleFill } from "react-icons/go";
// import { motion } from 'framer-motion';



// const BuyerAssistance = ({  existingData }) => {

//  const location = useLocation();
//   const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
//   const [phoneNumber] = useState(storedPhoneNumber);
//     const [hovered, setHovered] = useState(false);
//       const [priceInWords, setPriceInWords] = useState("");
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
//             const [isScrolling, setIsScrolling] = useState(false);
  
//       const [citySuggestions, setCitySuggestions] = useState([]);
//   const [areaSuggestions, setAreaSuggestions] = useState([]);
//   const cityTimeoutRef = useRef(null);
//   const areaTimeoutRef = useRef(null);
  
//     const baseStyle = {
//       backgroundColor: "#4F4B7E",
//       color: "#fff",
//       border: "none",
//       padding: "8px 16px",
//       borderRadius: "5px",
//       cursor: "pointer",
//       transition: "background-color 0.3s ease",
//     };
  
//     const hoverStyle = {
//       backgroundColor: "#CDC9F9",
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
//     floorNo:"",
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
//  const fieldIcons = {
//   // Contact Details
//   phoneNumber: <img src={phone} alt="" style={{ width: 20, height: 20 }} />,
//   alternatePhone: <img src={altphone} alt="" style={{ width: 20, height: 20 }} />,
//   email: <img src={email} alt="" style={{ width: 20, height: 20 }} />,
//   requirementType: <img src={bestTimeToCall} alt="" style={{ width: 20, height: 20 }} />,
  
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
//   balconies: <MdBalcony color="#4F4B7E" size={20}/>,
//   floorNo: <img src={floorNo} alt="" style={{ width: 20, height: 20 }} />,
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
// const fieldLabels = {
//   propertyMode: "Property Mode",
//   propertyType: "Property Type",
//     rentType: "rent Type",
//     minPrice:"Min Rental Amount",
//     maxPrice:"Max Rental Amount",
//   rentalAmount: "Rental Amount",
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
//   availableDate: "available From",
//   familyMembers: "No. of family Members",
//   foodHabit: "food Habit",
//   jobType: "job Type",
//   petAllowed: "pet",
//     wheelChairAvailable:"wheel Chair",

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
// const handleFilterChange = (e) => {
//     setDropdownState((prevState) => ({ ...prevState, filterText: e.target.value }));
//   };

//  const renderDropdown = (field) => {
//    const options = dataList[field] || [];
//    const filteredOptions = options.filter((option) =>
//      option.toLowerCase().includes(dropdownState.filterText.toLowerCase())
//    );
 
//    return (
//      <div data-field={field}>
//        {dropdownState.activeDropdown === field && (
//          <div
//            className="popup-overlay"
//            style={{
//              position: 'fixed',
//              top: 0,
//              left: 0,
//              width: '100vw',
//              height: '100vh',
//              backgroundColor: 'rgba(0, 0, 0, 0.5)',
//              zIndex: 1509,
//              animation: 'fadeIn 0.3s ease-in-out',
//            }}
//          >
//            <div
//              className="dropdown-popup"
//              style={{
//                position: 'fixed',
//                top: '50%',
//                left: '50%',
//                transform: 'translate(-50%, -50%)',
//                backgroundColor: 'white',
//                width: '100%',
//                maxWidth: '300px',
//                padding: '10px',
//                zIndex: 10,
//                boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',
//                borderRadius: '18px',
//                animation: 'popupOpen 0.3s ease-in-out',
//              }}
//            >
//              <div
//                className="p-1"
//                style={{
//                  fontWeight: 500,
//                  fontSize: '15px',
//                  marginBottom: '10px',
//                  textAlign: 'start',
//                  color: 'grey',
//                }}
//              >
//                Select or Search{' '}
//                <span style={{ color: '#0B57CF', fontWeight: 500 }}>
//                  {fieldLabels[field] || 'Property Field'}
//                </span>
//              </div>
//              <div
//                className="mb-1"
//                style={{
//                  position: 'relative',
//                  width: '100%',
//                  background: '#EEF4FA',
//                  borderRadius: '25px',
//                }}
//              >
//                <FcSearch
//                  size={16}
//                  style={{
//                    position: 'absolute',
//                    left: '10px',
//                    top: '50%',
//                    transform: 'translateY(-50%)',
//                    pointerEvents: 'none',
//                    color: 'black',
//                  }}
//                />
//                <input
//                  className="m-0 rounded-0 ms-1"
//                  type="text"
//                  placeholder="Filter options..."
//                  value={dropdownState.filterText}
//                  onChange={handleFilterChange}
//                  style={{
//                    width: '100%',
//                    padding: '5px 5px 5px 30px', // left padding for the icon
//                    background: 'transparent',
//                    border: 'none',
//                    outline: 'none',
//                  }}
//                />
//              </div>
 
//              <ul
//                style={{
//                  listStyleType: 'none',
//                  padding: 0,
//                  margin: 0,
//                  overflowY: 'auto',
//                  maxHeight: '350px',
//                }}
//              >
//                {filteredOptions.map((option, index) => (
//                  <li
//                    key={index}
//                  onClick={() => {
//    setFormData((prevState) => ({
//      ...prevState,
//      [field]: option,
//    }));
 
//    toggleDropdown(field); // Close current dropdown
 
//    const currentIndex = dropdownFieldOrder.indexOf(field);
//    if (currentIndex !== -1 && currentIndex < dropdownFieldOrder.length - 1) {
//      const nextField = dropdownFieldOrder[currentIndex + 1];
 
//      if (nonDropdownFields.includes(nextField)) {
//        // Focus the next input field and scroll to it
//        setTimeout(() => {
//          const nextInput = document.querySelector(`[name="${nextField}"]`);
//          if (nextInput) {
//            nextInput.focus();
//            nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
//          }
//        }, 150);
//      } else {
//        // Open next dropdown and scroll it into view
//        setTimeout(() => {
//          toggleDropdown(nextField);
//          setTimeout(() => {
//            const el = document.querySelector(`[data-field="${nextField}"]`);
//            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
//          }, 100);
//        }, 0);
//      }
//    }
//  }}
 
//                    style={{
//                      fontWeight: 300,
//                      padding: '5px',
//                      cursor: 'pointer',
//                      color: 'grey',
//                      marginBottom: '5px',
//                      borderBottom: '1px solid #D0D7DE',
//                    }}
//                  >
//                    {option}
//                  </li>
//                ))}
//              </ul>
 
//              <div className="d-flex justify-content-end">
//                <button
//                  className="me-1"
//                  type="button"
//                 onClick={() => {
//      toggleDropdown(field); // Close current dropdown
 
//      const currentIndex = dropdownFieldOrder.indexOf(field);
 
//      if (currentIndex > 0) {
//        const prevField = dropdownFieldOrder[currentIndex - 1];
 
//        if (nonDropdownFields.includes(prevField)) {
//          setTimeout(() => {
//            const prevInput = document.querySelector(`[name="${prevField}"]`);
//            if (prevInput) {
//              prevInput.focus();
//              prevInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
//            }
//          }, 100);
//        } else {
//          setTimeout(() => {
//            toggleDropdown(prevField); // Open prev dropdown
//            setTimeout(() => {
//              const el = document.querySelector(`[data-field="${prevField}"]`);
//              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
//            }, 100);
//          }, 0);
//        }
//      }
//    }}
//                  style={{
//                    background: '#EAEAF6',
//                    cursor: 'pointer',
//                    border: 'none',
//                    color: '#0B57CF',
//                    borderRadius: '10px',
//                    padding: '5px 10px',
//                    fontWeight: 500,
//                  }}
//                >
//                  Prev
//                </button>
//   <button
//    type="button"
//    onClick={() => {
//      toggleDropdown(field); // Close current dropdown
 
//      const currentIndex = dropdownFieldOrder.indexOf(field);
 
//      if (currentIndex !== -1 && currentIndex < dropdownFieldOrder.length - 1) {
//        const nextField = dropdownFieldOrder[currentIndex + 1];
 
//        if (nonDropdownFields.includes(nextField)) {
//          setTimeout(() => {
//            const nextInput = document.querySelector(`[name="${nextField}"]`);
//            if (nextInput) {
//              nextInput.focus();
//              nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
//            }
//          }, 100);
//        } else {
//          setTimeout(() => {
//            toggleDropdown(nextField); // Open next dropdown
//            setTimeout(() => {
//              const el = document.querySelector(`[data-field="${nextField}"]`);
//              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
//            }, 100);
//          }, 0);
//        }
//      }
//    }}
//   style={{
//                     background: '#EAEAF6',
//                     cursor: 'pointer',
//                     border: 'none',
//                     color: '#0B57CF',
//                     borderRadius: '10px',
//                     padding: '5px 10px',
//                     fontWeight: 500,
//                     marginRight:"5px"
//                   }}
//  >
//    skip
//  </button>
//                <button
//                  type="button"
//                  onClick={() => toggleDropdown(field)}
//                  style={{
//                    background: '#0B57CF',
//                    cursor: 'pointer',
//                    border: 'none',
//                    color: '#fff',
//                    borderRadius: '10px',
//                  }}
//                >
//                  Close
//                </button>
//              </div>
 
//              {/* {[
//                'negotiation',
//                'ownership',
//                'floorNo',
//                'postedBy',
//                'carParking',
//                'bestTimeToCall',
//              ].includes(field) && (
//                <div
//                  style={{
//                    marginTop: '10px',
//                    paddingTop: '10px',
//                    borderTop: '1px solid #ccc',
//                    textAlign: 'center',
//                  }}
//                >
//                  <div
//                    style={{
//                      fontSize: '14px',
//                      fontWeight: 400,
//                      color: '#555',
//                      marginBottom: '8px',
//                    }}
//                  >
//                    Swipe through options to continue
//                  </div>
//                </div>
//              )} */}
//            </div>
//          </div>
//        )}
//      </div>
//    );
//  };
 
//   const nonDropdownFields = ["alternatePhone", "totalArea", "baName", "city", "area", "description",];

// const dropdownFieldOrder = [
//     "minPrice",
//   "maxPrice",
//    "altPhoneNumber",
//   "propertyMode",
//   "propertyType",
//   "rentType",
//   "bedrooms",
//   "floorNo",
// "requirementType",
//   "state",
//   "city",
//   "area",
//   "description",
// "familyMembers",
// "foodHabit",
// "jobType",
// "petAllowed",
// "facing",

//     // "totalArea",
//   "areaUnit",
//   "raName",
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
//    const [countryCodes, setCountryCodes] = useState([
//       { code: '+1', country: 'USA/Canada' },
//       { code: '+44', country: 'UK' },
//       { code: '+91', country: 'India' },
//       { code: '+61', country: 'Australia' },
//       { code: '+81', country: 'Japan' },
//       { code: '+49', country: 'Germany' },
//       { code: '+33', country: 'France' },
//       { code: '+34', country: 'Spain' },
//       { code: '+55', country: 'Brazil' },
//       { code: '+52', country: 'Mexico' },
//       { code: '+86', country: 'China' },
//       { code: '+39', country: 'Italy' },
//       { code: '+7', country: 'Russia/Kazakhstan' },
//       // ... other countries
//     ]);
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
//       setMessage("Tenant Assistance request updated successfully!");
//     } else {
//       // Create new request
//       response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/add-buyerAssistance-rent`,
//         formData
//       );
//       setFormData(response.data.data); // Save returned formData with IDs etc.
//       setMessage("Tenant Assistance request added successfully!");
//     }

//     setShowPopup(true);

//     setTimeout(() => {
//       setShowPopup(false);
//       setMessage("");

//       // Extract ba_id and phoneNumber from response.data.data (backend sends ba_id)
//       const Ra_Id = response?.data?.data?.Ra_Id || formData.Ra_Id;
//       const phone = response?.data?.data?.phoneNumber || formData.phoneNumber || phoneNumber;

//       if (Ra_Id && phone) {
//         navigate("/buyer-plan", {
//           state: {
//             Ra_Id,      // pass buyer assistance ID as baId
//             phoneNumber: phone, // pass phone number
//           },
//         });
//       } else {
//         setMessage( "Missing Tenant assistance ID or phone number");
//       }
//     }, 3000);
//   } catch (error) {
//     setMessage("Please fill all required fields correctly." );
//     setShowPopup(true);
//     setTimeout(() => {
//       setShowPopup(false);
//       setMessage("");
//     }, 3000);
//   }
// };


//   return (
//         <motion.div
//           initial={{ x: '100%', opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           exit={{ x: '-100%', opacity: 0 }}
//           transition={{ duration: 0.5 }}
//         >
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

//               <div className="d-flex align-items-center justify-content-start w-100 p-2"      style={{
//         background: "#EFEFEF",
//         position: "sticky",
//         top: 0,
//         zIndex: 1000,
//         opacity: isScrolling ? 0 : 1,
//         pointerEvents: isScrolling ? "none" : "auto",
//         transition: "opacity 0.3s ease-in-out",
//       }}>
//               <button    
//                className="d-flex align-items-center justify-content-center ps-3 pe-2"

//       onClick={() => navigate(-1)}
//       style={{
//           background: "transparent",
//       border: "none",
//       height: "100%",color:"#CDC9F9",
//         cursor: 'pointer',
//         transition: 'all 0.3s ease-in-out',
  
//       }}
//       onMouseEnter={(e) => {
//         e.currentTarget.style.color = '#f0f4f5'; // Change background
//         e.currentTarget.querySelector('svg').style.color = '#4F4B7E'; // Change icon color
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.color = '#CDC9F9';
//         e.currentTarget.querySelector('svg').style.color = '#4F4B7E';
//       }}
//     >
//       <FaChevronLeft style={{ color: '#4F4B7E', transition: 'color 0.3s ease-in-out' , background:"transparent"}} />
//        </button><h3 className="m-0" style={{fontSize:"18px"}}>RENTAL ASSIATANT</h3> </div>

//     <img src={imge} alt="" className="header-image"  style={{width:'100%'}}/>
     
//     <div className="w-100 d-flex justify-content-around align-items-center mt-3">
//         <button style={{
//           ...baseStyle,
//           opacity: 0.6,
//           cursor: "not-allowed",
//         }}
//         disabled
//         >Add Tenant list-crash</button>
//         <button   style={{
//           ...baseStyle,
//           ...(hovered ? hoverStyle : {}),
//         }}
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//         onClick={() => navigate(`/Buyer-List-Filter`)}

//    >view Tenant List</button>

//       </div>
//       <h4 className="form-title mt-3" style={{color: '#4F4B7E', fontSize:"15px", fontWeight:"bold"}}>Rent Budget</h4>
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
//       <h5>Do you want to create this Tenant Assistance request?</h5>
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
 
 
// {/* <div className="form-group col-5 p-0 m-0" >
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
//                  {formatPrice(option)}
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
//               <img src={minprice} alt=""  width={20}/>
//             </span>
//             {formData.minPrice ? formatPrice(formData.minPrice) : "Select minPrice"}
//           </button>

//           {renderDropdown("minPrice")}
//         </div>
//       </div>
//     </label>
//   </div> */}
// <div div className="form-group col-5 p-0 m-0" >
//     <label style={{ width: '100%'}}>
//     {/* <label>Property Mode <span style={{ color: 'red' }}>* </span></label> */}

//       <div
//   style={{
//     display: "flex",
//     alignItems: "stretch", // <- Stretch children vertically
//     width: "100%",
//     boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//   }} className="rounded-2"
// >
//   <span
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "0 14px",
//       borderRight: "1px solid #4F4B7E",
//       background: "#fff", // optional
//     }}
//   >
// <img src={minprice} alt="" width={20}/>
//  <sup style={{ color: 'red' }}>*</sup>  </span>

//   <div style={{ flex: "1" }}>
//     <select
//       name="minPrice"
//       value={formData.minPrice || ""}
//       onChange={handleFieldChange}
//       className="form-control"
//       style={{ display: "none" }}
//       required
//     >
//       <option value="">Select minPrice</option>
//       {dataList.minPrice?.map((option, index) => (
//         <option key={index} value={option}>
//          {formatPrice(option)}
//         </option>
//       ))}
//     </select>

//     <button
//       className="m-0"
//       type="button"
//       onClick={() => toggleDropdown("minPrice")}
//       style={{
//         border:"none",
//         cursor: "pointer",
//         padding: "12px",
//         background: "#fff",
//         borderRadius: "5px",
//         width: "100%",
//         textAlign: "left",
//         color: "grey",
//         position: "relative",
//         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         fontSize:"13px"
//       }}
//     >
// {formData.minPrice ? formatPrice(formData.minPrice) : "Select Min Rental Amount"}
//       {formData.minPrice && (
//         <GoCheckCircleFill
//           style={{
//             position: "absolute",
//             right: "10px",
//             top: "50%",
//             transform: "translateY(-50%)",
//             color: "green",
//           }}
//         />
//       )}
//     </button>

//     {renderDropdown("minPrice")}
//   </div>
// </div>

//     </label>
//   </div>
//     {/* <div className="form-group col-5 p-0 m-0" >
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
//                      {formatPrice(option)}
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
//                   <img src={maxprice} alt="" width={20}/>
//                 </span>
// {formData.maxPrice ? formatPrice(formData.maxPrice) : "Select maxPrice"}
//               </button>
    
//               {renderDropdown("maxPrice")}
//             </div>
//           </div>
//         </label>
//       </div> */}
//  <div className="form-group col-5 p-0 m-0" >
//     <label style={{ width: '100%'}}>
//     {/* <label>Property Mode <span style={{ color: 'red' }}>* </span></label> */}

//       <div
//   style={{
//     display: "flex",
//     alignItems: "stretch", // <- Stretch children vertically
//     width: "100%",
//     boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//   }} className="rounded-2"
// >
//   <span
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "0 14px",
//       borderRight: "1px solid #4F4B7E",
//       background: "#fff", // optional
//     }}
//   >
//  <img src={maxprice} alt="" width={20}/>
//  <sup style={{ color: 'red' }}>*</sup>  </span>

//   <div style={{ flex: "1" }}>
//     <select
//       name="maxPrice"
//       value={formData.maxPrice || ""}
//       onChange={handleFieldChange}
//       className="form-control"
//       style={{ display: "none" }}
//     >
//       <option value="">Select maxPrice</option>
//       {dataList.maxPrice?.map((option, index) => (
//         <option key={index} value={option}>
//           {formatPrice(option)}
//         </option>
//       ))}
//     </select>

//     <button
//       className="m-0"
//       type="button"
//       onClick={() => toggleDropdown("maxPrice")}
//       style={{
//         border:"none",
//         cursor: "pointer",
//         padding: "12px",
//         background: "#fff",
//         borderRadius: "5px",
//         width: "100%",
//         textAlign: "left",
//         color: "grey",
//         position: "relative",
//         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//         fontSize:"13px"

//       }}
//     >
// {formData.maxPrice ? formatPrice(formData.maxPrice) : "Select Max Rental Amount"}
//       {formData.maxPrice && (
//         <GoCheckCircleFill
//           style={{
//             position: "absolute",
//             right: "10px",
//             top: "50%",
//             transform: "translateY(-50%)",
//             color: "green",
//           }}
//         />
//       )}
//     </button>

//     {renderDropdown("maxPrice")}
//   </div>
// </div>

//     </label>
//   </div>

//     </div>

//       {/* <div className="col-12 mb-3">
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
// </div> */}
// <div className="form-group">
// {/* <label>Phone Number:</label> */}

//   <div className="input-card p-0 rounded-2" style={{ 
//     display: 'flex', 
//     alignItems: 'center', 
//     justifyContent: 'space-between', 
//     width: '100%',  
//     boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//     background: "#fff",
//     paddingRight: "10px"
//   }}>
    
  
//   <img src={phone} alt="" style={{ width: 20, height: 20 ,marginLeft:"10px"}} />
//      {/* <FaPhone className="input-icon" style={{ color: '#4F4B7E', marginLeft:"10px"}} /> */}
    
//     <div style={{ flex: '0 0 10%' }}>
//   <label className="m-0">
//     <select
//       name="countryCode"
//       value={"+91"}
//       readOnly
//       onChange={handleFieldChange}
//       className="form-control m-0 pt-2"
//       style={{ width: '100%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     >
//       {countryCodes.map((item, index) => (
//         <option key={index} value={item.code}>
//           {item.code} {item.country}
//         </option>
//       ))}
//     </select>
//   </label>
// </div>


//     <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
//   <input
//       type="text"
//       name="phoneNumber"
//       value={phoneNumber}
//       readOnly
//       className="form-input m-0"
//       placeholder="Phone Number"
//         style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//     />
//   </div>
//       <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//     </div>
// </div>

// {/* <div className="col-12 mb-3">
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
// </div> */}
// <div className="form-group">
// {/* <label>Alternate number:</label> */}

//   <div className="input-card p-0 rounded-2" style={{ 
//     display: 'flex', 
//     alignItems: 'center', 
//     justifyContent: 'space-between', 
//     width: '100%',  
//     boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//     background: "#fff",
//     paddingRight: "10px"
//   }}>
    
//   <img src={altphone} alt="" style={{ width: 20, height: 20 ,marginLeft:"10px"}} />
//      {/* <FaPhone className="input-icon" style={{ color: '#4F4B7E',marginLeft:"10px" }} /> */}
    
//     <div style={{ flex: '0 1 10%' }}>
//       <label className="m-0">
//         <select
//           name="countryCode"
//           value={"+91"}
//           onChange={handleFieldChange}
//           className="form-control m-0"
//           style={{ width: '100%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//         >
//           <option value="">Select Country Code</option>
//           {countryCodes.map((item, index) => (
//             <option key={index} value={item.code}>
//               {item.code} {item.country}
//             </option>
//           ))}
//         </select>
//       </label>
//     </div>
//     <div style={{ display: "flex", alignItems: "center", flex: 1 }}>


//   <input
//       type="number"
//       name="alternatePhone"
//       value={formData.alternatePhone}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder="Alternate Phone Number"
//         style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//     />
//   </div>
//    {formData.alternatePhone && (
//       <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//     )}
//     </div>
// </div>
// <div className="row justify-content-center">

//   <div className="form-group">
//     <label style={{ width: '100%'}}>
//     {/* <label>Property Mode <span style={{ color: 'red' }}>* </span></label> */}

//       <div
//   style={{
//     display: "flex",
//     alignItems: "stretch", // <- Stretch children vertically
//     width: "100%",
//     boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//   }} className="rounded-2"
// >
//   <span
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "0 14px",
//       borderRight: "1px solid #4F4B7E",
//       background: "#fff", // optional
//     }}
//   >
//  {fieldIcons.propertyMode} <sup style={{ color: 'red' }}>*</sup>  </span>

//   <div style={{ flex: "1" }}>
//     <select
//       name="propertyMode"
//       value={formData.propertyMode || ""}
//       onChange={handleFieldChange}
//       className="form-control"
//       style={{ display: "none" }}
      
//     >
//       <option value="">Select Property Mode</option>
//       {dataList.propertyMode?.map((option, index) => (
//         <option key={index} value={option}>
//           {option}
//         </option>
//       ))}
//     </select>

//     <button
//       className="m-0"
//       type="button"
//       onClick={() => toggleDropdown("propertyMode")}
//       style={{
//         border:"none",
//         cursor: "pointer",
//         padding: "12px",
//         background: "#fff",
//         borderRadius: "5px",
//         width: "100%",
//         textAlign: "left",
//         color: "grey",
//         position: "relative",
//         boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//       }}
//     >
//       {formData.propertyMode || "Select Property Mode"}
//       {formData.propertyMode && (
//         <GoCheckCircleFill
//           style={{
//             position: "absolute",
//             right: "10px",
//             top: "50%",
//             transform: "translateY(-50%)",
//             color: "green",
//           }}
//         />
//       )}
//     </button>

//     {renderDropdown("propertyMode")}
//   </div>
// </div>

//     </label>
//   </div>

 
//  <div className="form-group"> 
//   <label style={{ width: '100%' }}>
//     {/* <label>Property Type <span style={{ color: 'red' }}>* </span> </label> */}

//       <div
//   style={{
//     display: "flex",
//     alignItems: "stretch", // <- Stretch children vertically
//     width: "100%",
//     boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//   }} className="rounded-2"
// >           <span
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "0 14px",
//       borderRight: "1px solid #4F4B7E",
//       background: "#fff", // optional
//     }}
//   >
//             {fieldIcons.propertyType} <sup style={{ color: 'red' }}>*</sup>
//           </span>
//       <div style={{ flex: "1" }}>
//         <select
//           name="propertyType"
//           value={formData.propertyType || ""}
//           onChange={handleFieldChange}
//           className="form-control"
//           style={{ display: "none" }} 
          
//         >
//           <option value="">Select property Type</option>
//           {dataList.propertyType?.map((option, index) => (
//             <option key={index} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>

//         <button
//           className="m-0"
//           type="button"
//           onClick={() => toggleDropdown("propertyType")}
//           style={{
//             border:"none",
//             cursor: "pointer",
//             // border: "1px solid #4F4B7E",
//             padding: "12px",
//             background: "#fff",
//             borderRadius: "5px",
//             width: "100%",
//             textAlign: "left",
//             color: "grey",
//             position: "relative",
//             boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', 
//           }}
//         >
    
//           {formData.propertyType || "Select Property Type"}

//           {formData.propertyType && (
//             <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//           )}
//         </button>

//         {renderDropdown("propertyType")}
//       </div>
//     </div>
//   </label>
// </div>

 
// <div className="form-group"> 
//   <label style={{ width: '100%' }}>
//     {/* <label>renty Type <span style={{ color: 'red' }}>* </span> </label> */}

//       <div
//   style={{
//     display: "flex",
//     alignItems: "stretch", // <- Stretch children vertically
//     width: "100%",
//     boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//   }} className="rounded-2"
// >           <span
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "0 14px",
//       borderRight: "1px solid #4F4B7E",
//       background: "#fff", // optional
//     }}
//   >
//             {fieldIcons.rentType} 
//           </span>
//       <div style={{ flex: "1" }}>
//         <select
//           name="rentType"
//           value={formData.rentType || ""}
//           onChange={handleFieldChange}
//           className="form-control"
//           style={{ display: "none" }} 
          
//         >
//           <option value="">Select renty Type</option>
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
//             border:"none",
//             // border: "1px solid #4F4B7E",
//             padding: "12px",
//             background: "#fff",
//             borderRadius: "5px",
//             width: "100%",
//             textAlign: "left",
//             color: "grey",
//             position: "relative",
//             boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', 
//           }}
//         >
    
//           {formData.rentType || "Select Rent Type"}

//           {formData.rentType && (
//             <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//           )}
//         </button>

//         {renderDropdown("rentType")}
//       </div>
//     </div>
//   </label>
// </div>


//  <div className="form-group">
//     <label style={{ width: '100%'}}>
//     {/* <label>Bedrooms </label> */}

//       <div
//   style={{
//     display: "flex",
//     alignItems: "stretch", // <- Stretch children vertically
//     width: "100%",
//     boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//   }} className="rounded-2"
// >       <span
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "0 14px",
//       borderRight: "1px solid #4F4B7E",
//       background: "#fff", // optional
//     }}
//   >
//               {fieldIcons.bedrooms || <FaHome />}
//             </span> <div style={{ flex: "1" }}>
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
//               border:"none",
//               // border: "1px solid #4F4B7E",
//               padding: "12px",
//               background: "#fff",
//               borderRadius: "5px",
//               width: "100%",
//               textAlign: "left",
//               color: "grey",
//             position: "relative",
//                         boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
// }}
//           >
             
//             {formData.bedrooms || "Select Bedrooms"}
//  {formData.bedrooms && (
//             <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//           )}          </button>

//           {renderDropdown("bedrooms")}
//         </div>
//       </div>
//     </label>
//   </div>


//   {/* <div className="form-group">

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
//   </div> */}



//     <div className="form-group">
//     <label style={{ width: '100%'}}>
//     {/* <label>FloorNo </label> */}

//       <div
//   style={{
//     display: "flex",
//     alignItems: "stretch", // <- Stretch children vertically
//     width: "100%",
//     boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//   }} className="rounded-2"
// >       <span
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "0 14px",
//       borderRight: "1px solid #4F4B7E",
//       background: "#fff", // optional
//     }}
//   >
//               {fieldIcons.floorNo}
//             </span>  <div style={{ flex: "1" }}>
//           <select
//             name="floorNo"
//             value={formData.floorNo || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select floorNo</option>
//             {dataList.floorNo?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("floorNo")}
//             style={{
//               cursor: "pointer",
//               // border: "1px solid #4F4B7E",
//               padding: "12px",
//               background: "#fff",
//               border:"none",
//               borderRadius: "5px",
//               width: "100%",
//               textAlign: "left",
//               color: "grey",
//             position: "relative",
//                         boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
// }}
//           >
            
//             {formData.floorNo || "Select Floor No"}
//  {formData.floorNo && (
//             <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//           )}          </button>

//           {renderDropdown("floorNo")}
//         </div>
//       </div>
//     </label>
//   </div>



//   <div className="form-group">
//     <label style={{ width: '100%'}}>
//     {/* <label>requirementType </label> */}

//       <div
//   style={{
//     display: "flex",
//     alignItems: "stretch", // <- Stretch children vertically
//     width: "100%",
//     boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//   }} className="rounded-2"
// >      <span
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "0 14px",
//       borderRight: "1px solid #4F4B7E",
//       background: "#fff", // optional
//     }}
//   >
//               {fieldIcons.requirementType || <FaHome />}
//             </span>  <div style={{ flex: "1" }}>
//           <select
//             name="requirementType"
//             value={formData.requirementType || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select requirementType</option>
//             {dataList.requirementType?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("requirementType")}
//             style={{
//               cursor: "pointer",
//               // border: "1px solid #4F4B7E",
//               padding: "12px",
//               border:"none",
//               background: "#fff",
//               borderRadius: "5px",
//               width: "100%",
//               textAlign: "left",
//               color: "grey",
//             position: "relative",
//                         boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
// }}
//           >
             
//             {formData.requirementType || "Select Requirement Type"}
//  {formData.requirementType && (
//             <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//           )}          </button>

//           {renderDropdown("requirementType")}
//         </div>
//       </div>
//     </label>
//   </div>


// {/* 
// <div className="form-group">
//   <div className="input-card p-0 rounded-2" style={{ 
//     display: 'flex', 
//     alignItems: 'center', 
//     justifyContent: 'space-between', 
//     width: '100%',  
//     boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//     background: "#fff",
//     paddingRight: "10px"
//   }}>
    
//    <div
//   style={{
//     display: "flex",
//     alignItems: "stretch", // <- Stretch children vertically
//     width: "100%",
//   }}
// > 
     
//      <span
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "0 14px",
//       borderRight: "1px solid #4F4B7E",
//       background: "#fff", // optional
//     }}
//   >
//      <MdLocationCity className="input-icon" style={{color: '#4F4B7E',}} /><sup style={{ color: 'red' }}>*</sup>
//   </span>
//   <input
//       type="text"
//       name="state"
//       value={formData.state}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder="State"
//         style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//     />
//   </div>
//    {formData.state && (
//       <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//     )}
// </div></div> */}

//  <div className="form-group">
//     <label style={{width:"100%"}}>
//     {/* <label>state</label> */}

//       <div
//   style={{
//     display: "flex",
//     alignItems: "stretch", // <- Stretch children vertically
//     width: "100%",
//     boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//   }} className="rounded-2"
// >       <span
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "0 14px",
//       borderRight: "1px solid #4F4B7E",
//       background: "#fff", // optional
//     }}
//   >
//               {fieldIcons.state || <FaHome />}
//             </span>    <div style={{ flex: "1" }}>
//           <select
//             name="state"
//             value={formData.state || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//             required
//             >
//             <option value="">Select state</option>
//             {dataList.state?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("state")}
//             style={{
//               cursor: "pointer",
//               // border: "1px solid #4F4B7E",
//               padding: "12px",
//               background: "#fff",
//               border:"none",
//               borderRadius: "5px",
//               width: "100%",
//               textAlign: "left",
//               color: "grey",
//             position: "relative",
//              boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
// }}
//           >
          
//             {formData.state || "Select State"}
//  {formData.state && (
//             <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//           )}          </button>

//           {renderDropdown("state")}
//         </div>
//       </div>
//     </label>
//   </div>
// {/* <div className="col-12 mb-3" style={{ position: 'relative' }}>
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

// </div> */}

// <div className="form-group"  style={{ position: 'relative' }}>
//   {/* <label>City:</label> */}
//   <div className="input-card p-0 rounded-2" style={{ 
//     display: 'flex', 
//     alignItems: 'center', 
//     justifyContent: 'space-between', 
//     width: '100%',  
//     boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//     background: "#fff",
//     paddingRight: "10px"
//   }}>
    
  
//     <div
//   style={{
//     display: "flex",
//     alignItems: "stretch", // <- Stretch children vertically
//     width: "100%",
//   }}
// > 
//      <span
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "0 14px",
//       borderRight: "1px solid #4F4B7E",
//       background: "#fff", // optional
//     }}
//   >
//      {fieldIcons.city || <FaHome />}
//   </span>
//   <input
//       type="text"
//       name="city"
//       value={formData.city}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder="City"
//         style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//     />
//   </div>
//    {formData.city && (
//       <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//     )}
// </div>
 
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
// )}</div>


// {/* <div className="col-12 mb-3" style={{ position: 'relative' }}>
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

// </div> */}

//   <div className="form-group" style={{ position: 'relative' }}>
//   {/* <label>Area:</label> */}
//   <div className="input-card p-0 rounded-2" style={{ 
//     display: 'flex', 
//     alignItems: 'center', 
//     justifyContent: 'space-between', 
//     width: '100%',  
//     boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//     background: "#fff",
//     paddingRight: "10px"
//   }}>
    
  
//     <div
//   style={{
//     display: "flex",
//     alignItems: "stretch", // <- Stretch children vertically
//     width: "100%",
//   }}
// > 
//      <span
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "0 14px",
//       borderRight: "1px solid #4F4B7E",
//       background: "#fff", // optional
//     }}
//   >
//  {fieldIcons.area}</span>
//   <input
//       type="text"
//       name="area"
//       value={formData.area}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder="Area"
//         style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
//     />
//   </div>
//    {formData.area && (
//       <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
//     )}
// </div>

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
// )}</div>


// <h6 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}> Description   </h6>             





//    <div className="form-group">
//        <div className="input-card p-0 rounded-2" style={{ 
//        display: 'flex', 
//        alignItems: 'center', 
//        justifyContent: 'space-between', 
//        width: '100%',  
//        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
//        background: "#fff",
//        paddingRight: "10px"
//      }}>
//      <textarea
//        name="description"
//        value={formData.description}
//        onChange={handleFieldChange}
//        className="form-control"
//       placeholder="Enter your Short Requirement"
//        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
   
//      ></textarea>
//    </div>
//    </div>  



// <h6 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}> My Family Info   </h6>             



// {/* familyMembers */}
//   <div className="form-group">
//     <label style={{width:"100%"}}>
//     {/* <label>familyMembers</label> */}

//       <div
//   style={{
//     display: "flex",
//     alignItems: "stretch", // <- Stretch children vertically
//     width: "100%",
//     boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//   }} className="rounded-2"
// >       <span
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "0 14px",
//       borderRight: "1px solid #4F4B7E",
//       background: "#fff", // optional
//     }}
//   >
//               {fieldIcons.familyMembers || <FaHome />}
//             </span>    <div style={{ flex: "1" }}>
//           <select
//             name="familyMembers"
//             value={formData.familyMembers || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select familyMembers</option>
//             {dataList.familyMembers?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("familyMembers")}
//             style={{
//               cursor: "pointer",
//               // border: "1px solid #4F4B7E",
//               padding: "12px",
//               background: "#fff",
//               border:"none",
//               borderRadius: "5px",
//               width: "100%",
//               textAlign: "left",
//               color: "grey",
//             position: "relative",
//                         boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
// }}
//           >
          
//             {formData.familyMembers || "Select No of Family Members"}
//  {formData.familyMembers && (
//             <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//           )}          </button>

//           {renderDropdown("familyMembers")}
//         </div>
//       </div>
//     </label>
//   </div>

// {/* foodHabit */}
//   <div className="form-group">
//     <label style={{width:"100%"}}>
//     {/* <label>foodHabit</label> */}

//       <div
//   style={{
//     display: "flex",
//     alignItems: "stretch", // <- Stretch children vertically
//     width: "100%",
//     boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//   }} className="rounded-2"
// >       <span
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "0 14px",
//       borderRight: "1px solid #4F4B7E",
//       background: "#fff", // optional
//     }}
//   >
//               {fieldIcons.foodHabit || <FaHome />}
//             </span>    <div style={{ flex: "1" }}>
//           <select
//             name="foodHabit"
//             value={formData.foodHabit || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select foodHabit</option>
//             {dataList.foodHabit?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("foodHabit")}
//             style={{
//               cursor: "pointer",
//               // border: "1px solid #4F4B7E",
//               padding: "12px",
//               background: "#fff",
//               borderRadius: "5px",
//               width: "100%",
//               border:"none",
//               textAlign: "left",
//               color: "grey",
//             position: "relative",
//                         boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
// }}
//           >
          
//             {formData.foodHabit || "Select Food Habit"}
//  {formData.foodHabit && (
//             <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//           )}          </button>

//           {renderDropdown("foodHabit")}
//         </div>
//       </div>
//     </label>
//   </div>
// {/* jobType */}
//     <div className="form-group">
//     <label style={{width:"100%"}}>
//     {/* <label>jobType</label> */}

//       <div
//   style={{
//     display: "flex",
//     alignItems: "stretch", // <- Stretch children vertically
//     width: "100%",
//     boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//   }} className="rounded-2"
// >       <span
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "0 14px",
//       borderRight: "1px solid #4F4B7E",
//       background: "#fff", // optional
//     }}
//   >
//               {fieldIcons.jobType || <FaHome />}
//             </span>    <div style={{ flex: "1" }}>
//           <select
//             name="jobType"
//             value={formData.jobType || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select jobType</option>
//             {dataList.jobType?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("jobType")}
//             style={{
//               cursor: "pointer",
//               // border: "1px solid #4F4B7E",
//               padding: "12px",
//               background: "#fff",
//               border:"none",
//               borderRadius: "5px",
//               width: "100%",
//               textAlign: "left",
//               color: "grey",
//             position: "relative",
//                         boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
// }}
//           >
          
//             {formData.jobType || "Select Job Type"}
//  {formData.jobType && (
//             <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//           )}          </button>

//           {renderDropdown("jobType")}
//         </div>
//       </div>
//     </label>
//   </div>
// {/* petAllowed */}
//   <div className="form-group">
//     <label style={{width:"100%"}}>
//     {/* <label>petAllowed</label> */}

//       <div
//   style={{
//     display: "flex",
//     alignItems: "stretch", // <- Stretch children vertically
//     width: "100%",
//     boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
//   }} className="rounded-2"
// >       <span
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "0 14px",
//       borderRight: "1px solid #4F4B7E",
//       background: "#fff", // optional
//     }}
//   >
//               {fieldIcons.petAllowed || <FaHome />}
//             </span>    <div style={{ flex: "1" }}>
//           <select
//             name="petAllowed"
//             value={formData.petAllowed || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select petAllowed</option>
//             {dataList.petAllowed?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("petAllowed")}
//             style={{
//               cursor: "pointer",
//               // border: "1px solid #4F4B7E",
//               padding: "12px",
//               background: "#fff",
//               border:"none",
//               borderRadius: "5px",
//               width: "100%",
//               textAlign: "left",
//               color: "grey",
//             position: "relative",
//                         boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
// }}
//           >
          
//             {formData.petAllowed || "Select Pet"}
//  {formData.petAllowed && (
//             <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
//           )}          </button>

//           {renderDropdown("petAllowed")}
//         </div>
//       </div>
//     </label>
//   </div>
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
// {/* <div className="col-12 mb-3">
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
// </div> */}




// {/* <div className="col-12 mb-3">
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border: '1px solid #4F4B7E', background: "#fff" }}>
//     <textarea
//       name="description"
//       value={formData.description}
//       onChange={handleInputChange}
//       className="form-input m-0"
//       placeholder="Enter your Short Requirement"
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
// </div> */}

  

//         <button type="submit" className="submit-button" style={{ padding: "10px 20px", cursor: "pointer", background:"#4F4B7E", border:'none', color:'#ffffff', width:"100%"}}
        
//         onMouseOver={(e) => {
//           e.target.style.background = "#CDC9F9"; // Brighter neon on hover
//           e.target.style.fontWeight = 500; // Brighter neon on hover
//           e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover

//         }}
//         onMouseOut={(e) => {
//           e.target.style.background = "#4F4B7E"; // Original orange
//           e.target.style.fontWeight = 400; // Brighter neon on hover

//         }}>
//           {formData._id ? "UPDATE PROPERTY ASSISTANCE" : "ADD PROPERTY ASSISTANCE"}
//         </button>
//       </form>
//     </div>
//     </div>
//     </motion.div>
//   );
// };





// export default BuyerAssistance;

























































































