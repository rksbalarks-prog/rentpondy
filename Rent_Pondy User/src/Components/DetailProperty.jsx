




import React, { useEffect, useState , useRef} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getActiveBase, baseToPath } from "../utils/cityBase";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BiBed, BiBath, BiCar, BiMap, BiCalendar, BiUser, BiCube } from "react-icons/bi";
import { AiOutlineEye, AiOutlineColumnWidth, AiOutlineColumnHeight } from "react-icons/ai";
import { MdOutlineCurrencyRupee, MdContactPhone , MdOutlineChair, MdCall, MdOutlineNavigateNext, MdContentCopy } from "react-icons/md";
import { TbArrowLeftRight, TbFileDescription, TbMapPinCode, TbToolsKitchen, TbWheelchair, TbWorldLongitude } from 'react-icons/tb';
import { BsGraphUp, BsBank, BsFilterCircle } from "react-icons/bs";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import { RiLayoutLine } from "react-icons/ri";
import { FaFacebook, FaRegHeart , FaLinkedin, FaPhone, FaRupeeSign, FaShareAlt, FaTwitter, FaUserAlt, FaWhatsapp, FaHeart, FaArrowLeft, FaClock, FaUser, FaEnvelope, FaPhoneAlt, FaRegListAlt, FaChevronLeft } from "react-icons/fa";
import icon1 from '../Assets/ico_interest_xd.png';
import icon2 from '../Assets/ico_report_soldout_xd.png';
import icon4 from '../Assets/Shortlist Bike-01.png';

import icon3 from '../Assets/help1.png';
// import contact from '../Assets/contact.png';
import {  FaBalanceScale, FaFileAlt, FaGlobeAmericas, FaMapMarkerAlt, FaDoorClosed, FaMapSigns } from "react-icons/fa";
import { MdBalcony , MdTimer, MdHomeWork, MdHouseSiding, MdOutlineKitchen, MdEmail, MdLocationCity, MdOutlineAccessTime , MdPhone } from "react-icons/md";
import {  BsBarChart } from "react-icons/bs";
import { BiRuler, BiBuilding, BiStreetView } from "react-icons/bi";
import { GiStairs, GiForkKnifeSpoon, GiWindow } from "react-icons/gi";
import { TiContacts, TiHome } from "react-icons/ti";
import contact from '../Assets/contact.png';
// import { ToWords } from 'to-words';
import { IoIosArrowForward } from "react-icons/io";

import promotion from '../Assets/PUC_App Promotion_2.png'
import { ToWords } from 'to-words';

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from "react-share";
import { Modal, Button, Form } from "react-bootstrap";
import { FiAlertCircle } from "react-icons/fi";
import ConfirmationModal from "./ConfirmationModal";
import { IoChevronBackSharp } from "react-icons/io5";
import { GrFormNext, GrNext } from "react-icons/gr";
import numberToWords from 'number-to-words';
import NoData from "../Assets/OOOPS-No-Data-Found.png";
import moment from "moment";
import { CiShare2 } from "react-icons/ci";
import { FcSearch } from "react-icons/fc";
import PondyIcon from '../Assets/rp50.PNG';
import { PiShareFat } from "react-icons/pi";
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
import pic from '../Assets/Mask Group 3@2x.png'; // Correct path


const AnimatedHeart = ({ filled, onClick }) => {
  const [clicked, setClicked] = useState(false);
  const [startFill, setStartFill] = useState(false);

  // When filled prop changes to true, start animation
  React.useEffect(() => {
    if (filled) {
      setClicked(true);
      setTimeout(() => setStartFill(true), 600);
    } else {
      setClicked(false);
      setStartFill(false);
    }
  }, [filled]);

  // Call onClick passed from parent and also trigger animation reset
  const handleHeartClick = () => {
    if (onClick) onClick();
  };

  const strokeStyle = {
    fill: "none",
    stroke: "red",
    strokeWidth: 2,
    transition: "stroke-dashoffset 0.6s ease-in-out",
  };

  return (
    <svg
      viewBox="0 0 24 24"
      width="30"
      height="30"
      onClick={handleHeartClick}
      style={{ cursor: "pointer" }}
    >
      {/* Fill layer */}
      <path
        d="M12 21s-6-4.35-9-8.6C.6 9.3 2.7 4.5 7.5 4.5c2.1 0 4.2 1.5 4.5 3.3C12.3 6 14.4 4.5 16.5 4.5 21.3 4.5 23.4 9.3 21 12.4 18 16.65 12 21 12 21z"
        fill={startFill ? "red" : "none"}
        style={{
          transition: "fill 0.4s ease-in",
        }}
      />
      {/* Left stroke */}
      <path
        d="M12 21s-6-4.35-9-8.6C.6 9.3 2.7 4.5 7.5 4.5c2.1 0 4.2 1.5 4.5 3.3"
        style={{
          ...strokeStyle,
          strokeDasharray: 100,
          strokeDashoffset: clicked ? 0 : 100,
        }}
      />
      {/* Right stroke */}
      <path
        d="M12 21s6-4.35 9-8.6C23.4 9.3 21.3 4.5 16.5 4.5c-2.1 0-4.2 1.5-4.5 3.3"
        style={{
          ...strokeStyle,
          strokeDasharray: 100,
          strokeDashoffset: clicked ? 0 : 100,
        }}
      />
    </svg>
  );
};

const DetailProperty = () => {
  const [popupType, setPopupType] = useState(""); // "report" or "help"
const [setrentId, setSetrentId] = useState(false);

  const [imageError, setImageError] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [Viewed, setViewed] = useState(false);
const [isRequested, setIsRequested] = useState(false);

  const [popupSubmitHandler, setPopupSubmitHandler] = useState(() => () => {});
  const [popupTitle, setPopupTitle] = useState("Report Rent Property");
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  // const [propertyClicked, setPropertyClicked] = useState(false);
  const mapRef = useRef(null);
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
const [allNearbyPlaces, setAllNearbyPlaces] = useState([]);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isShareMenuVisible, setIsShareMenuVisible] = useState(false);
  const shareMenuRef = useRef(null)
  const [clicked, setClicked] = useState(false);

const [limitPerDay, setLimitPerDay] = useState(null); // <-- new state
  const [copied, setCopied] = useState(false);



const [dailyViewsCount, setDailyViewsCount] = useState(0);
const [remainingViews, setRemainingViews] = useState(0);
const [planName, setPlanName] = useState("");
const [expiryDate, setExpiryDate] = useState(null);
const [canViewToday, setCanViewToday] = useState(true);

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
  const handleOpenPopup = () => {
    setPopupTitle("Report Rent Property");
    setShowPopup(true);
  };



// 🚀 Submit Report
// const ReporthandleSubmit = async () => {
//   const userPhoneNumber = localStorage.getItem("phoneNumber"); // Or from global state
//   const rentId = property?.rentId; // Make sure this comes from selected property

//   if (!userPhoneNumber || !rentId) {
//     setMessage("Phone number and Rent ID are required.");
//     return;
//   }

//   if (!reason) {
//     setMessage("Please select a valid reason.");
//     return;
//   }

//   try {
//     const response = await fetch(`${process.env.REACT_APP_API_URL}/report-property-rent`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         phoneNumber: userPhoneNumber,
//         rentId: rentId,
//         reason: comment,
//         selectReasons: reason,
//       }),
//     });

//     const result = await response.json();

//     if (response.ok && result.status === "reportProperties") {
//       setPropertyClicked(true);
//       setMessage(result.message || "Report submitted successfully.");
//       setShowPopup(false);
//       localStorage.setItem(`propertyReported-${rentId}`, JSON.stringify(true));
//     } else if (result.status === "alreadyReported") {
//       setPropertyClicked(true);
//       setMessage("You have already submitted this report.");
//     } else {
//       setMessage(result.message || "Failed to submit report.");
//     }
//   } catch (error) {
//     setMessage("An error occurred while submitting the report.");
//   } finally {
//     setTimeout(() => setMessage(""), 3000);
//   }
// };
  
const ReporthandleSubmit = async () => { 
  const userPhoneNumber = localStorage.getItem("phoneNumber");
  const rentId = property?.rentId;

  if (!userPhoneNumber || !rentId) {
    setMessage("Phone number and Rent ID are required.");
    return;
  }

  if (!reason) {
    setMessage("Please select a valid reason.");
    return;
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/report-property-rent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber: userPhoneNumber,
        rentId,
        reason: comment,
        selectReasons: reason,
      }),
    });

    const result = await response.json();

    if (response.ok && result.status === "reportProperties") {
      setPropertyClicked(true);
      setMessage(result.message || "Report submitted successfully.");
      setPopup(false);
      setComment(""); // ✅ Reset comment
      localStorage.setItem(`propertyReported-${rentId}`, JSON.stringify(true));
    } else if (result.status === "alreadyReported") {
      setPropertyClicked(true);
      setMessage("You have already submitted this report.");
    } else {
      setMessage(result.message || "Failed to submit report.");
    }
  } catch (error) {
    setMessage("An error occurred while submitting the report.");
  } finally {
    setTimeout(() => setMessage(""), 3000);
  }
};

//   const handleHelpSubmit = async ({ reason, comment }) => {
//   const userPhoneNumber = localStorage.getItem("phoneNumber"); // Get from logged-in user
//   const rentId = property?.rentId; // Replace `property` with your state/prop

//   if (!userPhoneNumber || !rentId) {
//     setMessage("Phone number and Rent ID are required.");
//     return;
//   }

//   if (!reason) {
//     setMessage("Please select a valid help reason.");
//     return;
//   }

//   try {
//     const response = await fetch(`${process.env.REACT_APP_API_URL}/need-help-rent`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         phoneNumber: userPhoneNumber,
//         rentId: rentId,
//         selectHelpReason: reason,
//         comment,
//       }),
//     });

//     const result = await response.json();

//     if (response.ok && result.status === "needHelp") {
//       setHelpClicked(true);
//       setMessage("Help request submitted successfully.");
//       setShowPopup(false);
//       localStorage.setItem(`helpRequested-${rentId}`, "true");
//     } else if (result.status === "alreadyRequested") {
//       setHelpClicked(true);
//       setMessage("You have already submitted this help request.");
//     } else {
//       setMessage(result.message || "Failed to submit help request.");
//     }
//   } catch (error) {
//     setMessage("An error occurred while submitting help request.");
//   } finally {
//     setTimeout(() => setMessage(""), 3000);
//   }
// };


  const handleHelpSubmit = async () => {
  const userPhoneNumber = localStorage.getItem("phoneNumber");
  const rentId = property?.rentId;

  if (!userPhoneNumber || !rentId) {
    setMessage("Phone number and Rent ID are required.");
    return;
  }

  if (!reason) {
    setMessage("Please select a valid help reason.");
    return;
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/need-help-rent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber: userPhoneNumber,
        rentId: rentId,
        selectHelpReason: reason,
        comment,
      }),
    });

    const result = await response.json();

    if (response.ok && result.status === "needHelp") {
      setHelpClicked(true);
      setMessage("Help request submitted successfully.");
      setPopup(false);
      setComment(""); // ✅ Reset comment
      localStorage.setItem(`helpRequested-${rentId}`, "true");
    } else if (result.status === "alreadyRequested") {
      setHelpClicked(true);
      setMessage("You have already submitted this help request.");
    } else {
      setMessage(result.message || "Failed to submit help request.");
    }
  } catch (error) {
    setMessage("An error occurred while submitting help request.");
  } finally {
    setTimeout(() => setMessage(""), 3000);
  }
};



  


  

  const handleImageError = (index) => {
    setImageError((prev) => ({ ...prev, [index]: true }));
  };
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoUrls, setVideoUrls] = useState([]);
  const [showPopup, setShowPopup] = useState(false);  // State for controlling the popup/modal
  const [Popup, setPopup] = useState(false);  // State for controlling the popup/modal
const [ownerDetails, setOwnerDetails] = useState(null);

// toggle based on UI logic (e.g., checkbox or logic on page load)
const [finalContactNumber, setFinalContactNumber] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showOwnerContact, setShowOwnerContact] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [message, setMessage] = React.useState(null);
const [messageType, setMessageType] = React.useState("info"); // can be "error", "success", "info"
  const [userPhoneNumber, setUserPhoneNumber] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [favoritedUserPhoneNumbers, setFavoritedUserPhoneNumbers] = useState([]);
  const [property, setProperty] = useState(null);
  const [viewedProperties, setViewedProperties] = useState([]);

  const [popupMessage, setPopupMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const [imageCount, setImageCount] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  // const [isHeartClicked, setIsHeartClicked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [interestClicked, setInterestClicked] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingOfferData, setPendingOfferData] = useState(null);

  const location = useLocation();
  const { rentId } = useParams();
const contactRef = useRef(null);

// matchedFields may be passed via location.state when navigating from matched/search flows
const matchedFields = location.state?.matchedFields || null;

const [assignedPhoneNumber, setAssignedPhoneNumber] = useState("");
const [postedUserPhoneNumber, setPostedUserPhoneNumber] = useState("");


  const {  phoneNumber } = location.state || {};
  const [offeredPrice,setOfferedPrice] = useState("");
  const [properties, setProperties] = useState([]);
  
  const [photoRequested, setPhotoRequested] = useState(
    JSON.parse(localStorage.getItem(`photoRequested-${property?.rentId}`)) || false
  );
  // const [offerPrice, setofferPrice] = useState("");
  const [viewCount, setViewCount] = useState(0);

  const [isHeartClicked, setIsHeartClicked] = useState(() => {
    // Check if there's a saved state in localStorage for this rentId
    const storedState = localStorage.getItem(`isHeartClicked-${rentId}`);
    return storedState ? JSON.parse(storedState) : false;
  });
  const [startFill, setStartFill] = useState(false);

  const handleHeartAnimationClick = () => {
    setIsHeartClicked(true); // Only enable like once (you can toggle if you prefer)
    setTimeout(() => setStartFill(true), 600); // Wait for stroke animation to finish
  };
  const popupRef = useRef(null);

  const toggleShareOptions = () => {
    setShowShareOptions((prev) => !prev);
  };
 const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 sec
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowShareOptions(false);
      }
    };

    if (showShareOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShareOptions]);
  const strokeStyle = {
    fill: "none",
    stroke: "red",
    strokeWidth: 2,
    transition: "stroke-dashoffset 0.6s ease-in-out",
  };

  const navigate = useNavigate();
  const getGoogleMapsLink = () => {
  const coords = parseCoordinates(propertyDetails?.locationCoordinates);
  if (!coords) return '';
  return `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
};

// useEffect(() => {
//   if (!window.google || !propertyDetails?.locationCoordinates) return;

//   const coords = parseCoordinates(propertyDetails.locationCoordinates);
//   if (!coords) return;

//   const map = new window.google.maps.Map(mapRef.current, {
//     center: coords,
//     zoom: 15,
//   });

//   new window.google.maps.Marker({
//     position: coords,
//     map,
//   });
// }, [propertyDetails?.locationCoordinates]);
  //  useEffect(() => {
  //   if (!window.google || !propertyDetails?.locationCoordinates) return;

  //   const coords = parseCoordinates(propertyDetails.locationCoordinates);
  //   if (!coords) return;

  //   const map = new window.google.maps.Map(mapRef.current, {
  //     center: coords,
  //     zoom: 15,
  //   });

  //   new window.google.maps.Marker({
  //     position: coords,
  //     map,
  //      icon: {
  //         url: PondyIcon ,
  //         scaledSize: new window.google.maps.Size(20, 20),
  //       },
  //     title: "Property Location",
  //   });

  //   const service = new window.google.maps.places.PlacesService(map);
  //   let allPlaces = [];
  // let completedRequests = 0;

  //   placeTypes.forEach((type) => {
  //     const request = {
  //       location: coords,
  //       radius: 2000,
  //       type,
  //     };

  //     service.nearbySearch(request, (results, status) => {
  //       if (status === window.google.maps.places.PlacesServiceStatus.OK) {
  //         allPlaces = [...allPlaces, ...results];
  //         // Deduplicate by place_id
  //         const unique = Object.values(
  //           allPlaces.reduce((acc, place) => {
  //             acc[place.place_id] = place;
  //             return acc;
  //           }, {})
  //         );
  //         setAllNearbyPlaces(unique);

  //         setNearbyPlaces(unique);
  //       }
  //     });
  //   });
  // }, [propertyDetails?.locationCoordinates]);

//   useEffect(() => {
//   if (!window.google || !propertyDetails?.locationCoordinates) return;

//   const coords = parseCoordinates(propertyDetails.locationCoordinates);
//   if (!coords) return;

//   const map = new window.google.maps.Map(mapRef.current, {
//     center: coords,
//     zoom: 15,
//   });

//   new window.google.maps.Marker({
//     position: coords,
//     map,
//     icon: {
//       url: PondyIcon,
//       scaledSize: new window.google.maps.Size(20, 20),
//     },
//     title: "Property Location",
//   });

//   const service = new window.google.maps.places.PlacesService(map);
//   let allPlaces = [];
//   let completedRequests = 0;

//   placeTypes.forEach((type) => {
//     const request = {
//       location: coords,
//       radius: 2000,
//       type,
//     };

//     service.nearbySearch(request, (results, status) => {
//       if (status === window.google.maps.places.PlacesServiceStatus.OK) {
//         allPlaces = [...allPlaces, ...results];
//       }
//       completedRequests++;

//       // When all types have been searched
//       if (completedRequests === placeTypes.length) {
//         // Deduplicate by place_id
//         const unique = Object.values(
//           allPlaces.reduce((acc, place) => {
//             acc[place.place_id] = place;
//             return acc;
//           }, {})
//         );
//         setAllNearbyPlaces(unique);
//         setNearbyPlaces(unique);
//       }
//     });
//   });
// }, [propertyDetails?.locationCoordinates]);

// const parseCoordinates = (coordString) => {
//   const regex = /([+-]?\d+(\.\d+)?)[^\d+-]+([+-]?\d+(\.\d+)?)/;
//   const match = coordString.match(regex);
//   if (!match) return null;

//   return {
//     lat: parseFloat(match[1]),
//     lng: parseFloat(match[3]),
//   };
// };
// const placeTypes = [
//   "restaurant",   // Restaurants and cafes
//   "school",       // Schools
//   "bakery",       // Shopping (alternatively: "store")
//   "park",         // Parks
//   "gym",          // Gyms
//   "atm",          // ATMs
//   "bank",         // Banks
//   "hospital",     // Hospitals
//   "pharmacy"      // Pharmacies
// ];

  useEffect(() => {
    if (!window.google || !propertyDetails?.locationCoordinates || !mapRef.current) return;

    const coords = parseCoordinates(propertyDetails.locationCoordinates);
    if (!coords) return;

    // Clear any previous map content
    mapRef.current.innerHTML = "";

    const map = new window.google.maps.Map(mapRef.current, {
      center: coords,
      zoom: 15,
    });

    new window.google.maps.Marker({
      position: coords,
      map,
      icon: {
        url: PondyIcon,
        scaledSize: new window.google.maps.Size(20, 20),
      },
      title: "Property Location",
    });
  }, [propertyDetails?.locationCoordinates, PondyIcon]);

  const parseCoordinates = (coordString) => {
    if (!coordString) return null;
    const regex = /([+-]?\d+(\.\d+)?)[^\d+-]+([+-]?\d+(\.\d+)?)/;
    const match = coordString.match(regex);
    if (!match) return null;
    return {
      lat: parseFloat(match[1]),
      lng: parseFloat(match[3]),
    };
  };
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setIsShareMenuVisible(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Load interest state from localStorage when the component mounts
  useEffect(() => {
    const interestSaved = localStorage.getItem(`interestSent-${rentId}`);
    if (interestSaved) {
      setInterestClicked(true);
    }
  }, [rentId]);

 

const [soldOutClicked, setSoldOutClicked] = useState(
  JSON.parse(localStorage.getItem(`soldOutReported-${rentId}`)) || false
);
const [propertyClicked, setPropertyClicked] = useState(
  JSON.parse(localStorage.getItem(`propertyReported-${rentId}`)) || false
);
const [helpClicked, setHelpClicked] = useState(
  JSON.parse(localStorage.getItem(`helpRequested-${rentId}`)) || false
);

useEffect(() => {
  if (message) {
    const timer = setTimeout(() => setMessage(""), 5000); // Auto-close after 3 seconds
    return () => clearTimeout(timer); // Cleanup timer
  }
}, [message]);


useEffect(() => {
  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/properties`);
      setProperties(response.data.data);
    } catch (error) {
    }
  };

  fetchProperties();
}, []);


// Fetch image count for the property based on rentId
const fetchImageCount = async () => {
  if (!rentId) {
    return;
  }

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/uploads-count`, 
      { params: { rentId } } // Pass only rentId as the query parameter
    );

    setImageCount(response.data.uploadedImagesCount);
    setUploadedImages(response.data.uploadedImages);
  } catch (error) {
  }
};


  useEffect(() => {
    if (rentId || phoneNumber) {
      fetchImageCount();
    }
  }, [phoneNumber, rentId]);

 

  useEffect(() => {
    const savedState = localStorage.getItem("isHeartClicked");
    if (savedState) {
      setIsHeartClicked(JSON.parse(savedState));
    }

    if (rentId || phoneNumber) {
      fetchImageCount();
    }
  }, [phoneNumber, rentId]);



const fetchPropertyDetails = async (rentId) => {
  try {
    const endpoint = `${process.env.REACT_APP_API_URL}/property/${rentId}`;
    console.log("Fetching from:", endpoint);
    const response = await axios.get(endpoint);
    console.log("Server response:", response.data);
    console.log("Video in response:", response.data?.video || response.data?.videos || "NOT FOUND");
    setProperty(response.data);
    // Also set propertyDetails for video display
    setPropertyDetails(response.data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

 // Fetch property details
 useEffect(() => {
  if (rentId) {
    fetchPropertyDetails(rentId);
  }
}, [rentId]);





// const storeUserViewedProperty = async (phoneNumber, rentId) => {
//   try {
//     const response = await axios.post(
//       `${process.env.REACT_APP_API_URL}/user-view-property-rent`,
//       { phoneNumber, rentId }
//     );

//     console.log("API Response:", response.data); // Debugging response

//     const { data } = response.data;

//     setMessageType("success");
//     // setMessage(response.data.message);

//     // ✅ Extract and apply view limit data from API response
//     setLimitPerDay(data.viewLimitPerDay);
//     setDailyViewsCount(data.dailyViewsCount);
//     setRemainingViews(data.remainingViews);
//     setPlanName(data.planName);
//     setExpiryDate(data.expiryDate);
//     setViewedProperties(data.viewedProperties);
//     setCanViewToday(data.canViewToday);

//   } catch (error) {
//     if (error.response) {
//       console.error("API Error:", error.response.data);
      
//       if (error.response.status === 409) {
//         setMessageType("info");
//         setMessage("You already viewed this property today.");
//       } else if (error.response.status === 429) {
//         setMessageType("error");
//         setMessage(error.response.data.message);

//         // Extract limit number from message
//         const match = error.response.data.message.match(/\((\d+)\)/);
//         if (match) {
//           setLimitPerDay(parseInt(match[1], 10));
//         }
//       } else {
//         setMessageType("error");
//         setMessage(`Error storing view: ${error.response.data.message}`);
//       }
//     } else {
//       setMessageType("error");
//       setMessage(`Network/server error: ${error.message}`);
//     }
//   }
// };



//   const fetchUserViewedProperties = async (userPhoneNumber) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/user-viewed-properties-rent?phoneNumber=${userPhoneNumber}`
//       );
//       setViewedProperties(response.data.viewedProperties || []);
//     } catch (error) {
//       // Optional: handle fetch error (e.g. show message)
//     }
//   };

//   // Load phone number from localStorage on mount
//   useEffect(() => {
//     const storedPhoneNumber = localStorage.getItem("phoneNumber");
//     if (storedPhoneNumber) {
//       setUserPhoneNumber(storedPhoneNumber);
//     }
//   }, []);

//   // When rentId or userPhoneNumber changes, store viewed property
//   useEffect(() => {
//     if (userPhoneNumber && rentId) {
//       storeUserViewedProperty(userPhoneNumber, rentId);
//     }
//   }, [userPhoneNumber, rentId]);

//   // Fetch viewed properties whenever userPhoneNumber changes
//   useEffect(() => {
//     if (userPhoneNumber) {
//       fetchUserViewedProperties(userPhoneNumber);
//     }
//   }, [userPhoneNumber]);





const handleSubmit = async ({ offeredPrice, rentId }) => {
  const storedPhoneNumber = localStorage.getItem("phoneNumber");

  if (!storedPhoneNumber || !rentId || !offeredPrice) {
    setMessage("offeredPrice, Phone Number, and Property ID are required.");
    return;
  }

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/offer-rent`, {
      offeredPrice,
      phoneNumber: storedPhoneNumber,
      rentId,
    });

    const { message, status } = response.data;

    if (status === "offerSaved") {
      setMessage("Offer saved successfully.");
      setOfferedPrice('');
    } else if (status === "offerUpdated") {
      setMessage("Offer updated successfully.");
    } else {
      setMessage(message || "Offer submitted.");
    }
  } catch (error) {
    const errMsg = error.response?.data?.message || "Error saving offer.";
    setMessage(errMsg);
  } finally {
    setPendingOfferData(null);
  }
};


      
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const endpoint = `${process.env.REACT_APP_API_URL}/fetch-data-on-demand-rent?rentId=${rentId}`;
        console.log("Fetching property data from:", endpoint);
        const response = await axios.get(endpoint);
        console.log("Property data response:", response.data);
        console.log("Video in property data:", response.data?.user?.video || response.data?.user?.videos || "NOT FOUND");
        console.log("Complete user object:", response.data?.user);
        setPropertyDetails(response.data.user);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch property details.");
      } finally {
        setLoading(false);
      }
    };

    if (rentId) fetchPropertyData();
  }, [rentId]);



  const handleIncreaserentId = () => {
    const nextrentId = Number(rentId) + 1;
    navigate(`/detail/${nextrentId}`); // navigate to new URL with increased rentId
    window.scrollTo(0, 0); // Scroll to top
  };

  
  const handleGoBack = () => {
    navigate(-1);
    window.scrollTo(0, 0); // Scroll to top
  };
 
  // useEffect(() => {
  //   // Ensure propertyDetails is not null or undefined before accessing `video`
  //   if (propertyDetails?.video) {
  //     setVideoUrl(`https://ppcpondy.com/PPC/${propertyDetails.video}`);
  //   } else {
  //     setVideoUrl("https://ppcpondy.com/PPC/default-video-url.mp4"); // Fallback to a default video
  //   }
  // }, [propertyDetails?.video]);

useEffect(() => {
  // Handle both single video and multiple videos
  const videoData = propertyDetails?.video || propertyDetails?.videos;
  console.log("DetailProperty - propertyDetails:", propertyDetails);
  console.log("DetailProperty - Video data from server:", videoData);
  console.log("DetailProperty - Is array?:", Array.isArray(videoData));
  console.log("DetailProperty - Video type:", typeof videoData);

  if (Array.isArray(videoData)) {
    // Multiple videos (array)
    const urls = videoData
      .filter(v => typeof v === "string" && v.trim() !== "")
      .map(v => {
        const normalizedPath = v.replace(/\\/g, "/").replace(/^\/+/, "").trim();
        return `https://rentpondy.com/PPC/${normalizedPath}`;
      });
    console.log("DetailProperty - Setting multiple video URLs:", urls);
    setVideoUrls(urls);
    setVideoUrl(null);
  } else if (typeof videoData === "string" && videoData.trim() !== "") {
    // Single video (string)
    const normalizedVideoPath = videoData.replace(/\\/g, "/").replace(/^\/+/, "").trim();
    const fullVideoUrl = `https://rentpondy.com/PPC/${normalizedVideoPath}`;
    console.log("DetailProperty - Setting single video URL:", fullVideoUrl);
    setVideoUrl(fullVideoUrl);
    setVideoUrls([]);
  } else {
    console.log("DetailProperty - No video found");
    setVideoUrl(null);
    setVideoUrls([]);
  }
}, [propertyDetails?.video, propertyDetails?.videos]);

  
  // Runs when `propertyDetails.video` changes
  const handleVideoPlay = () => {
    setShowPopup(true);
  };
  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setShowModal(true);
  };

  


  const maxImages = 15;
      const [currentIndex, setCurrentIndex] = useState(1);
    
      const handleSlideChange = (swiper) => {
        setCurrentIndex(swiper.realIndex + 1);
      };
  const closeModal = () => setShowModal(false);



  const toggleContactDetails = () => {
    setShowContactDetails(prevState => !prevState);
  };


  const closeOwnerContactModal = () => {
    setShowOwnerContact(false); 
  };

  if (loading) return   <div className="text-center my-4"
  style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000
  }}>
  <span className="spinner-border text-primary" role="status" />
  <p className="mt-2">Loading properties details...</p>
</div>;
  if (error) return <p>{error}</p>;
  if (!propertyDetails) return   <div className="text-center my-4 "
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
  
    }}>
  <img src={NoData} alt="" width={100}/>      
  <p>No properties details found.</p>
  </div>  ;


 const images = propertyDetails.photos && propertyDetails.photos.length > 0
  ? [...new Set(
      propertyDetails.photos.map(photo =>
        `https://rentpondy.com/PPC/${photo.replace(/\\/g, "/").replace(/^\/+/, "").trim()}`
      )
    )]
  : [];


// const images = propertyDetails.photos && propertyDetails.photos.length > 0
//   ? [...new Set(propertyDetails.photos.map(photo => photo.trim().toLowerCase()))]
//       .map((photo) => `https://ppcpondy.com/PPC/${photo}`)
//   : [];

   
const formattedCreatedAt = Date.now
? moment(propertyDetails.createdAt).format("DD-MM-YYYY") 
: "N/A";


    
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

  const propertyDetailsList = [
    { heading: true, label: "Basic Property Info" }, // Heading 1
    { icon: fieldIcons.propertyMode, label: "Property Mode", value:  propertyDetails.propertyMode},
    { icon: fieldIcons.propertyType, label: "Property Type", value: propertyDetails.propertyType },
    // { icon: <MdOutlineCurrencyRupee />, label: "Price", value: propertyDetails.price },
    // { icon: fieldIcons.email, label: "Length", value: propertyDetails.length },
    // { icon: fieldIcons.email, label: "Breadth", value: propertyDetails.breadth  },
    // // { icon: <RiLayoutLine />, label: "Total Area", value: propertyDetails.totalArea},
    { icon: fieldIcons.rentType, label: "rentType", value: propertyDetails.rentType },
        {
      icon: fieldIcons.totalArea,
      label: "Total Area",
      value: `${propertyDetails.totalArea} ${propertyDetails.areaUnit}`, // Combined value
    },

    { icon: fieldIcons.negotiation, label: "Negotiation", value: propertyDetails.negotiation },

           { icon: fieldIcons.securityDeposit, label: "security Deposit ₹", value: propertyDetails.securityDeposit },
    { icon: <AiOutlineEye />, label: "No.Of.Views", value: propertyDetails.views },

    { heading: true, label: "Property Features" }, // Heading 1

    // { icon: <BiRuler />, label: "Area Unit", value: propertyDetails.areaUnit },
    // { icon: fieldIcons.email, label: "Ownership", value: propertyDetails.ownership },
    // { icon: fieldIcons.email, label: "Property Approved", value: propertyDetails.propertyApproved },
    // { icon: fieldIcons.email, label: "Bank Loan", value: propertyDetails.bankLoan },


    { icon: fieldIcons.bedrooms, label: "Bedrooms", value: propertyDetails.bedrooms },

    { icon: fieldIcons.floorNo, label: "Floor No", value:propertyDetails.floorNo },
    { icon: fieldIcons.kitchen, label: "Kitchen", value: propertyDetails.kitchen},
    // { icon: <MdOutlineKitchen />, label: "Kitchen Type", value: propertyDetails.kitchenType },
    { icon: fieldIcons.balconies, label: "Balconies", value: propertyDetails.balconies},
    // { icon: fieldIcons.email, label: "Floors", value: propertyDetails.numberOfFloors },
{ label: "western", value: propertyDetails.western, icon: fieldIcons.western},
{ label: "Attached", value: propertyDetails.attachedBathrooms, icon:fieldIcons.attachedBathrooms },
    { icon: fieldIcons.wheelChairAvailable, label: "wheel Chair", value: propertyDetails.wheelChairAvailable },

    { icon: fieldIcons.carParking, label: "Car Park", value: propertyDetails.carParking },
    { icon: fieldIcons.lift, label: "Lift", value: propertyDetails.lift },
    // { heading: true, label: "Other details" }, // Heading 2

    { icon: fieldIcons.furnished, label: "Furnished", value: propertyDetails.furnished },
    { icon: fieldIcons.facing, label: "Facing", value: propertyDetails.facing },
    { icon: fieldIcons.propertyAge, label: "Property Age", value: propertyDetails.propertyAge },

    // { icon: fieldIcons.email, label: "Sale Mode", value: propertyDetails.salesMode },
    // { icon: fieldIcons.email, label: "Sales Type", value: propertyDetails.salesType },
    { icon: fieldIcons.postedBy, label: "Posted By", value:propertyDetails.postedBy},
    // { icon: <AiOutlineEye />, label: "No.Of.Views", value: "1200" },
          { icon: fieldIcons.availableDate, label: "availableDate", value: propertyDetails.availableDate },
    { icon: fieldIcons.availableDate, label: "Posted On", value:formattedCreatedAt },

    { heading: true, label: "Property Description" }, // Heading 3
    { icon: fieldIcons.description, label: "Description" ,  value: propertyDetails.description },
      { heading: true, label: "Tenant Prefrence" }, // Heading 4

    { icon: fieldIcons.familyMembers, label: "No. of family Members", value: propertyDetails.familyMembers },
    { icon: fieldIcons.foodHabit, label: "Food Habit", value: propertyDetails.foodHabit },
    { icon: fieldIcons.jobType, label: "Job Type", value: propertyDetails.jobType },
    { icon: fieldIcons.petAllowed, label: "Pet", value: propertyDetails.petAllowed },
    { heading: true, label: "rental Property Address " }, // Heading 3

    // { icon: <BiMap />, label: "Location", value: "New York, USA" },
    { icon: fieldIcons.country, label: "Country", value: propertyDetails.country },
    { icon: fieldIcons.state, label: "State", value: propertyDetails.state },
    { icon: fieldIcons.city, label: "City", value: propertyDetails.city },
    { icon: fieldIcons.district, label: "District", value:  propertyDetails.district},
    { icon: fieldIcons.area, label: "Area", value: propertyDetails.area },
    
    { icon: fieldIcons.nagar, label: "Nagar", value: propertyDetails.nagar },
       { icon: fieldIcons.streetName, label: "Street Name", value: propertyDetails.streetName },
   
    { icon: fieldIcons.doorNumber, label: "Door Number", value: propertyDetails.doorNumber },
    { icon: fieldIcons.pinCode, label: "Pincode", value: propertyDetails.pinCode },
    { icon: fieldIcons.locationCoordinates, label: "lat. & lng.", value: propertyDetails.locationCoordinates },

    // { heading: true, label: "Contact Info" }, // Heading 5
   
    // { icon: fieldIcons.ownerName, label: "Owner Name", value: propertyDetails.ownerName },
    // { icon: fieldIcons.email, label: "Email", value: propertyDetails.email },

    // { icon: fieldIcons.phoneNumber, label: "Phone Number", value: phoneNumber },
    // { icon: fieldIcons.alternatePhone, label: "alternate Phone", value: propertyDetails.alternatePhone },

    // { icon: fieldIcons.bestTimeToCall, label: "Best Time To Call", value: propertyDetails.bestTimeToCall },
 
  ];
const excludedPropertyTypes = ["plot", "land", "agricultural land"];

const filteredDetailsList = propertyDetailsList.filter((item) => {
  const isPropertyFeatureSection =
    item.label === "Tenant Prefrence" ||
    [
      "Bedrooms", "Floor No", "Kitchen", "Balconies",
      "Wheel Chair", "Western", "Attached", "Car Park", "Lift", "Furnished",
      "No. of family Members", "Food Habit", "Job Type", "Pet" , "Door Number"
    ].includes(item.label);

  // Make propertyType lowercase for comparison
  const propertyTypeLower = (propertyDetails.propertyType || "").toLowerCase();

  if (excludedPropertyTypes.includes(propertyTypeLower)) {
    return !isPropertyFeatureSection;
  }

  return true;
});

  const labelToKeyMap  = {
    "Phone Number": "phoneNumber",
    "Alternate Phone": "altPhoneNumber",
    "City": "city",
    "Area": "area",
    "Min Price": "minPrice",
    "Max Price": "maxPrice",
    "Facing": "facing",
    "Bedrooms": "bedrooms",
    "Property Mode": "propertyMode",
    "Property Type": "propertyType",
    "Rent Type": "rentType",
    "Floor No": "floorNo",
    "Requirement Type": "requirementType",
    "Family Members": "familyMembers",
    "Food Habit": "foodHabit",
    "Job Type": "jobType",
    "Pet Allowed": "petAllowed",
    "State": "state",
    "Description": "description",
    "RA Name": "raName",
    "AlternatePhone": "alternatePhone"
  };

const isFieldMatched = (label, value, matchedFieldsParam) => {
  const key = labelToKeyMap[label];
  const mf = matchedFieldsParam || matchedFields;
  if (!key || !mf) return null;

  const matchedValue = mf[key];
  if (matchedValue == null || value == null) return false;

  return matchedValue.toString().toLowerCase() === value.toString().toLowerCase();
};

const scrollToContact = () => {
  if (contactRef.current) {
    const elementTop = contactRef.current.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: elementTop - 100, // 100px above the element
      behavior: 'smooth'
    });

    // Or, to center the element:
    // contactRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};




  const handleAddressRequest = async () => {
  const storedPhoneNumber = localStorage.getItem("phoneNumber");

  if (!storedPhoneNumber || !propertyDetails.rentId) {
    setMessage("Phone number and RENT ID are required.");
    return;
  }

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/request-address-rent`, {
      rentId: propertyDetails.rentId,
      requesterPhoneNumber: storedPhoneNumber
    });

    setMessage(response.data.message);
  } catch (error) {
    setMessage(error.response?.data?.message || "Failed to send address request.");
  }
};



// const handleOwnerContactClick = async () => {
//   const storedPhoneNumber = localStorage.getItem("phoneNumber");
//   setViewed(true);
//   setTimeout(() => setViewed(false), 300);

//   try {
//     if (!storedPhoneNumber || !rentId) {
//       setMessage("Phone number and Rent ID are required.");
//       return;
//     }

//     const response = await axios.post(`${process.env.REACT_APP_API_URL}/contact-rent`, {
//       phoneNumber: storedPhoneNumber,
//       rentId,
//     });

//     const {
//       success,
//       setRentId,
//       assignedPhoneNumber,
//       postedUserPhoneNumber,
//       rentId: returnedRentId,
//       rentalAmount,
//       views,
//       contactRequests,
//       createdAt,
//       updatedAt,
//       ownerName,
//       area,
//       city,
//       photos,
//     } = response.data;

//     if (success) {
//       const finalNumber = setRentId ? assignedPhoneNumber : postedUserPhoneNumber;
//       setSetrentId(setRentId);
//       setAssignedPhoneNumber(assignedPhoneNumber);
//       setPostedUserPhoneNumber(postedUserPhoneNumber);
//       setFinalContactNumber(finalNumber);
//       setOwnerDetails({ ownerName, area, city, rentalAmount, rentId: returnedRentId });
//       setShowContactDetails(true);

//       setTimeout(scrollToContact, 100);
//     }
//   } catch (error) {
//     setMessage(error.response?.data?.message || "Failed to contact owner. Please try again.");
//   }
// };


const handleOwnerContactClick = async () => {
  const storedPhoneNumber = localStorage.getItem("phoneNumber");
  setViewed(true);
  setTimeout(() => setViewed(false), 300);

  try {
    if (!storedPhoneNumber || !rentId) {
      setMessage("Phone number and Rent ID are required.");
      return;
    }

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/contact-rent`,
      {
        phoneNumber: storedPhoneNumber,
        rentId,
      }
    );

    const {
      success,
      setRentId,
      assignedPhoneNumber,
      postedUserPhoneNumber,
      views,
      createdAt,
      updatedAt,
      contactLimitPerDay,
      remainingContacts,
      rentalAmount,
      message,
    } = response.data;

    if (success) {
      const finalNumber = setRentId ? assignedPhoneNumber : postedUserPhoneNumber;

      // ✅ Update states accordingly
      setSetrentId(setRentId);
      setAssignedPhoneNumber(assignedPhoneNumber);
      setPostedUserPhoneNumber(postedUserPhoneNumber);
      setFinalContactNumber(finalNumber);
      setOfferedPrice(offeredPrice);
      setOwnerDetails({ views, createdAt, updatedAt });
      setShowContactDetails(true);

      setMessage(
        `Contact shared. You have ${remainingContacts} / ${contactLimitPerDay} remaining today.`
      );

      setTimeout(scrollToContact, 100);
    }
  } catch (error) {
    if (error?.response?.status === 429) {
      const limit = error.response?.data?.contactLimitPerDay || 0;
      setMessage(`Daily contact limit of ${limit} reached. Try again tomorrow.`);
    } else {
      setMessage("Failed to contact owner. Please try again.");
    }
  }
};


// const handleInterestClick = async () => {
//   const storedPhoneNumber = localStorage.getItem("phoneNumber");

//   if (!storedPhoneNumber || !property?.rentId) {
//     setMessage("Phone number and Rent ID are required.");
//     return;
//   }

//   const rentId = property.rentId;

//   if (interestClicked || localStorage.getItem(`interestSent-${rentId}`)) {
//     setMessage("Interest already recorded for this property.");
//     setInterestClicked(true);
//     return;
//   }

//   try {
//     const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-interests-rent`, {
//       phoneNumber: storedPhoneNumber,
//       rentId,
//     });

//     const { message, status } = response.data;

//     if (status === "sendInterest") {
//       setMessage("Interest sent successfully!");
//       setInterestClicked(true);
//       localStorage.setItem(`interestSent-${rentId}`, JSON.stringify(true));
//     } else if (status === "alreadySaved") {
//       setMessage("Interest already recorded for this property.");
//       setInterestClicked(true);
//     }
//   } catch (error) {
//     const errMsg = error.response?.data?.message || "Something went wrong.";
//     setMessage(errMsg);
//   }
// };

const handleInterestClick = async () => {
  const storedPhoneNumber = localStorage.getItem("phoneNumber");

  if (!storedPhoneNumber || !property?.rentId) {
    setMessage("Phone number and Rent ID are required.");
    return;
  }

  const rentId = property.rentId;
  const interestKey = `interestSent-${rentId}`;

  const alreadySent = interestClicked || localStorage.getItem(interestKey);

  try {
    if (alreadySent) {
      // 🔁 REMOVE INTEREST
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/remove-interest-rent`, {
        phoneNumber: storedPhoneNumber,
        rentId,
      });

      if (response.data.status === "interestRemoved") {
        setMessage("Interest removed successfully.");
        setInterestClicked(false);
        localStorage.removeItem(interestKey);
      } else {
        setMessage("Failed to remove interest.");
      }
    } else {
      // ✅ SEND INTEREST
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-interests-rent`, {
        phoneNumber: storedPhoneNumber,
        rentId,
      });

      const { message, status } = response.data;

      if (status === "sendInterest") {
        setMessage("Interest sent successfully!");
        setInterestClicked(true);
        localStorage.setItem(interestKey, "true");
      } else if (status === "alreadySaved") {
        setMessage("Interest already recorded for this property.");
        setInterestClicked(true);
        localStorage.setItem(interestKey, "true");
      }
    }
  } catch (error) {
    const errMsg = error.response?.data?.message || "Something went wrong.";
    setMessage(errMsg);
  }
};




const handleReportSoldOut = async () => {
    const storedPhoneNumber = localStorage.getItem("phoneNumber");

  if (!storedPhoneNumber || !rentId) {
    setMessage("Phone number and Property ID are required.");
    return;
  }

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/report-sold-out-rent`, {
      phoneNumber:storedPhoneNumber,
      rentId,
    });

    const { message, status, postedUserPhoneNumber } = response.data;

    if (status === "soldOut") {
      setMessage(`Property reported as sold out.`);
      setPostedUserPhoneNumber(postedUserPhoneNumber);
      setSoldOutClicked(true);
      localStorage.setItem(`soldOutReported-${rentId}`, JSON.stringify(true));
    } else if (status === "alreadyReported") {
      setMessage("This property is already reported as sold out.");
    }
  } catch (error) {
    setMessage(error.response?.data?.message || "Failed to report Rent property as sold out.");
  }
};

const handleReportProperty = async () => {
  if (!phoneNumber || !rentId) {
    setMessage("Phone number and Property ID are required.");
    return;
  }

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/report-property`, {
      phoneNumber,
      rentId,
    });

    const { status, message, postedUserPhoneNumber } = response.data;

    if (status === "reportProperties") {
      setMessage(`Property reported. Owner's Phone: ${postedUserPhoneNumber}`);
      setPostedUserPhoneNumber(postedUserPhoneNumber);
      setPropertyClicked(true);
      localStorage.setItem(`propertyReported-${rentId}`, JSON.stringify(true));
    } else if (status === "alreadySaved") {
      setMessage("This property has already been reported.");
    }
  } catch (error) {
    setMessage(error.response?.data?.message || "Failed to report the property.");
  }
};




const handleNeedHelp = async () => {
  try {
    if (!phoneNumber || !rentId) {
      setMessage("Phone number and Property ID are required.");
      return;
    }

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/need-help`, {
      phoneNumber,
      rentId,
    });

    const { status, message, postedUserPhoneNumber } = response.data;

    if (status === "needHelp") {
        setMessage(`NeedHelp request sent.`);
        setPostedUserPhoneNumber(postedUserPhoneNumber);
        setHelpClicked(true);
        localStorage.setItem(`helpRequested-${rentId}`, JSON.stringify(true));
    } else if (status === "alreadySaved") {
      setMessage("This property has already been reported.");

    }
  } catch (error) {
    
  }
};



// Function to handle confirmation
const confirmActionHandler = (actionType, actionMessage) => {
  setPopupMessage(actionMessage);
  setShowPopup(true);
  setConfirmAction(() => () => {
    actionType();
    setShowPopup(false);
  });
};


const cards = [
  // {
  //   img: icon1,
  //   text: interestClicked ? "Interest Sent" : "Send Your Interest",
  //   onClick: () => {
  //     if (interestClicked) {
  //       setMessage("Your interest is already sent.");
  //       return;
  //     }
  //     confirmActionHandler(handleInterestClick, "Are you sure you want to send interest?");
  //   },
  // },
  {
  img: icon1,
  text: interestClicked ? "Undo Interest" : "Send Your Interest",
  onClick: () => {
    const action = interestClicked ? handleInterestClick : handleInterestClick; // same function toggles

    const confirmMessage = interestClicked
      ? "Are you sure you want to undo your interest?"
      : "Are you sure you want to send interest?";

    confirmActionHandler(action, confirmMessage);
  }
},

  {
    img: icon2,
    text: soldOutClicked ? "Sold Out Reported" : "Report Sold Out",
    onClick: () => {
      if (soldOutClicked) {
        setMessage("Sold out report already submitted.");
        return;
      }
      confirmActionHandler(handleReportSoldOut, "Are you sure you want to report this property as sold out?");
    },
  },

{
  img: icon4,
  text: propertyClicked ? "Rent Property Reported" : "Report Rent Property",
  onClick: () => {
    if (propertyClicked) {
      setMessage("This Rent property is already reported.");
      return;
    }
    setPopupTitle("Report Rent Property");
    setPopupType("report");
    setPopup(true);
  },
},
{
  img: icon3,
  text: helpClicked ? "Help Requested" : "Need Help",
  onClick: () => {
    if (helpClicked) {
      setMessage("Help request already submitted.");
      return;
    }
    setPopupTitle("Need Help");
    setPopupType("help");
    setPopup(true);
  },
}

];




const handleHeartClick = async () => {
  const storedPhoneNumber = localStorage.getItem("phoneNumber");
  if (!storedPhoneNumber || !rentId) return;

  const apiEndpoint = isHeartClicked
    ? `${process.env.REACT_APP_API_URL}/remove-favorite-rent`
    : `${process.env.REACT_APP_API_URL}/add-favorite-rent`;

  try {
    const response = await axios.post(apiEndpoint, {
      phoneNumber: storedPhoneNumber,
      rentId,
    });

    const { status, message, postedUserPhoneNumber } = response.data;

    if (status === "favorite") {
      setIsHeartClicked(true);
      setMessage("Favorite request sent.");
      setPostedUserPhoneNumber(postedUserPhoneNumber);
      localStorage.setItem(`isHeartClicked-${rentId}`, "true");
    } else if (status === "favoriteRemoved") {
      setIsHeartClicked(false);
      setMessage("Your favorite was removed.");
      setPostedUserPhoneNumber("");
      localStorage.setItem(`isHeartClicked-${rentId}`, "false");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
    setMessage(errorMessage);
    setIsHeartClicked(isHeartClicked); // Maintain previous state
  }
};

  // const handleShareClick = () => {
  //   setShowShareOptions(!showShareOptions);
  // };


  const toWords = new ToWords({
    localeCode: 'en-IN', // Indian numbering system
    converterOptions: {
      currency: false,
      ignoreDecimal: true,
    }
  });
 


// const formattedPrice = propertyDetails?.price
//   ? new Intl.NumberFormat('en-IN').format(propertyDetails.price)
//   : "N/A";

//   const priceInWords = propertyDetails?.price
//   ? (() => {
//       const price = propertyDetails.price;
//       if (price >= 10000000) {
//         return (price / 10000000).toFixed(2).replace(/\.00$/, '') + " crores";
//       } else if (price >= 100000) {
//         return (price / 100000).toFixed(2).replace(/\.00$/, '') + " lakhs";
//       } else {
//         return numberToWords.toWords(price).replace(/\b\w/g, l => l.toUpperCase()) + " Rupees";
//       }
//     })()
//   : "N/A";


  // Format price with commas (e.g., 14,00,000 or "On Demand"). When callForRent
  // is set, ignore the numeric amount entirely and show the prompt instead.
  const formattedPrice =
    propertyDetails?.callForRent
      ? 'Call Owner'
      : propertyDetails?.rentalAmount && typeof propertyDetails.rentalAmount === 'number'
        ? new Intl.NumberFormat('en-IN').format(propertyDetails.rentalAmount)
        : propertyDetails?.rentalAmount || 'N/A';

  // Convert price to words (e.g., "14 Lakhs"). Skip when callForRent is set.
  const priceInWords =
    propertyDetails?.callForRent
      ? ''
      : propertyDetails?.rentalAmount && typeof propertyDetails.rentalAmount === 'number'
      ? (() => {
          const rentalAmount = propertyDetails.rentalAmount;
          if (rentalAmount >= 10000000) {
            return (rentalAmount / 10000000)
              .toFixed(2)
              .replace(/\.00$/, '') + ' Crores';
          } else if (rentalAmount >= 100000) {
            return (rentalAmount / 100000)
              .toFixed(2)
              .replace(/\.00$/, '') + ' Lakhs';
          } else {
            return (
              numberToWords
                .toWords(rentalAmount)
                .replace(/\b\w/g, (l) => l.toUpperCase()) + ' Rupees'
            );
          }
        })()
      : propertyDetails?.rentalAmount || 'N/A';



const handlePhotoRequest = () => {
  setPopupMessage("Are you sure you want to request a photo?");
  setConfirmAction(() => confirmPhotoRequest); // Store reference to confirm function
  setShowPopup(true);
};


const confirmPhotoRequest = async () => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/photo-request-rent`, {
      rentId: property.rentId,
      requesterPhoneNumber: userPhoneNumber,
    });

    setMessage("Photo request submitted successfully!");
    setPhotoRequested(true);
    localStorage.setItem(`photoRequested-${property.rentId}`, JSON.stringify(true));
  } catch (error) {
    setMessage(error.response?.data?.message || "Failed to submit photo request.");
  } finally {
    setShowPopup(false);
    setTimeout(() => setMessage(""), 3000);
  }
};

const currentUrl = `${window.location.origin}${location.pathname}`; // <- Works for localhost or live

// Filter valid videos
const validVideoUrls = videoUrls.filter(url => url && url.trim() !== "");
const validVideoValue = videoUrl && videoUrl.trim() !== "" ? videoUrl : null;

// Don't include default fallback video - only include real videos from server
const isDefaultFallback = validVideoValue && validVideoValue.includes("default-video-url");

console.log("=== MEDIA DEBUG ===");
console.log("validVideoValue:", validVideoValue);
console.log("isDefaultFallback:", isDefaultFallback);
console.log("validVideoUrls:", validVideoUrls);
console.log("images.length:", images.length);

// Create combined media array (images + videos)
// Only add validVideoValue if it's NOT the default fallback URL and there are no validVideoUrls
const allMedia = [
  ...images.map(img => ({ type: 'image', src: img })),
  ...(!isDefaultFallback && validVideoValue && validVideoUrls.length === 0 ? [{ type: 'video', src: validVideoValue }] : []),
  ...validVideoUrls.map(url => ({ type: 'video', src: url }))
];

console.log("allMedia:", allMedia);

// Navigation functions for modal
const handleNextMedia = () => {
  setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allMedia.length);
};

const handlePrevMedia = () => {
  setCurrentImageIndex((prevIndex) => (prevIndex - 1 + allMedia.length) % allMedia.length);
};

// Calculate total media (images + videos)
const totalMediaCount = images.length + validVideoUrls.length + (validVideoValue ? 1 : 0);

  return (
    <div className="container d-flex align-items-center justify-content-center p-0">


            <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{fontFamily: "Inter, sans-serif", maxWidth: '500px', margin: 'auto', width: '100%' }}>
            <div className="row g-2 w-100">

 <div className="d-flex align-items-center justify-content-start w-100 p-2"
       style={{
        background: "#EFEFEF",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        opacity: isScrolling ? 0 : 1,
        pointerEvents: isScrolling ? "none" : "auto",
        transition: "opacity 0.3s ease-in-out",
      }}
  >
 <button
      onClick={() => navigate(-1)}
               className="d-flex align-items-center justify-content-center ps-3 pe-2"

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
    </button>
<div className="d-flex justify-content-between align-items-center m-0 w-100"
><h3 className="m-0" style={{fontSize:"15px"}}>PROPERTY DETAILS </h3>
<div className="d-flex justify-content-center align-items-center gap-3 position-relative text-center pe-2" style={{height: 'auto'}}>
           <div style={{ position: 'relative' }}>
      <FaShareAlt
        style={{ cursor: 'pointer', fontSize: '20px', color: '#4F4B7E' }}
        onClick={toggleShareOptions}

      />
{showShareOptions && (
<div
  className="d-flex flex-row justify-content-between p-3"
  ref={popupRef}
  style={{
    position: 'absolute',
    top: '30px',
    right: 0,
    backgroundColor: 'white',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    padding: '10px',
    zIndex: 10,
    minWidth: '300px',
    gap: '12px',
  }}
>
  {navigator.share && (
    <button className="p-0"
      onClick={() => {
        const temp = document.createElement('div');
        temp.innerHTML = `<a href="${window.location.href}">${window.location.href}</a>`;
        document.body.appendChild(temp);

        navigator.clipboard
          .writeText(window.location.href)
          .then(() => {
            navigator.share({
              title: document.title,
              url: window.location.href,
            });
          })
          .catch(() => {
            navigator.share({
              title: document.title,
              text: window.location.href,
              url: window.location.href,
            });
          })
          .finally(() => {
            document.body.removeChild(temp);
          });
      }}
        style={{
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
fontSize:"13px",
    // Ensures full text display
    whiteSpace: 'normal',      // Allow text wrapping
    overflow: 'visible',       // Don't hide overflow
    wordBreak: 'break-word',   // Break long words if needed
  }}
    >
      <PiShareFat /> Share via...
    </button>
  )}
    <div className="d-flex justify-content-between align-items-center gap-3">

      <MdContentCopy onClick={handleCopy} style={{ border: 'none', background: 'none', cursor: 'pointer', color:"grey" }}/>
    {copied && (
      <span style={{ color: 'green', fontSize: '14px' }}>Copied!</span>
    )}
</div>
  {(!navigator.share || window.innerWidth > 768) && (
    <div className="d-flex gap-3">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#3b5998', display: 'flex', alignItems: 'center' }}
      >
        <FaFacebook />
      </a>

      <a
        href={`https://${window.innerWidth <= 768 ? 'api' : 'web'}.whatsapp.com/send?text=${encodeURIComponent("View this: " + window.location.href)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#25D366', display: 'flex', alignItems: 'center' }}
      >
        <FaWhatsapp />
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("View this:")}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#1DA1F2', display: 'flex', alignItems: 'center' }}
      >
        <FaTwitter />
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#0077b5', display: 'flex', alignItems: 'center' }}
      >
        <FaLinkedin />
      </a>
    </div>
  )}
</div>

)}
    </div>
          {isHeartClicked ? (
            <AnimatedHeart filled={true} onClick={handleHeartClick} />

) : (
   <svg
          viewBox="0 0 24 24"
          width="30"
          height="30"
          onClick={handleHeartClick}
          style={{ cursor: "pointer" }}
        >
          <path
            d="M12 21s-6-4.35-9-8.6C.6 9.3 2.7 4.5 7.5 4.5c2.1 0 4.2 1.5 4.5 3.3C12.3 6 14.4 4.5 16.5 4.5 21.3 4.5 23.4 9.3 21 12.4 18 16.65 12 21 12 21z"
            fill="none"
            stroke="#4F4B7E"
            strokeWidth={2}
          />
        </svg>
 
)}

        </div></div>
 </div>
    

<div className="mb-0 position-relative">



  <Swiper loop={true} navigation={{
      prevEl: ".swiper-button-prev-custom",
      nextEl: ".swiper-button-next-custom",
    }}  modules={[Navigation]} 
  onSlideChange={handleSlideChange}
  className="swiper-container"
  >
{images.length > 0
    ? images.map((image, index) => (
<SwiperSlide key={`${image}-${index}`}>
          <div
          onClick={() => handleImageClick(index)}
            className="d-flex justify-content-center align-items-center position-relative"
            style={{
              height: "200px",
              width: "100%",
              overflow: "hidden",
              borderRadius: "8px",
              margin: "auto",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <img
              src={image}
              alt={`Property Image ${index + 1}`}
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </SwiperSlide>
      ))
    : // If no images, show default image with button
      [
        <SwiperSlide key="default">
          <div
            className="d-flex justify-content-center align-items-center position-relative"
            style={{
              height: "200px",
              width: "100%",
              overflow: "hidden",
              borderRadius: "8px",
              margin: "auto",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <img
              src={pic}
              alt="Default Property Image"
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
            />
           
<button
  className="btn"
  style={{
    border:"none",
    position: "absolute",
    bottom: "20%",
    right: "10px",
    padding: "5px 10px",
    fontSize: "14px",
    cursor: "pointer",
    zIndex: 10,
    color:"#ffffff",
    background: photoRequested ? "#3F61D8" : "#34ACD6", // Green if already requested
  }}
  onClick={!photoRequested ? handlePhotoRequest : null} // Disable re-clicking
>
  {photoRequested ? "Photo Request Sent" : "Photo Request"}
</button>



          </div>
        

        </SwiperSlide>,
      ]}

      {/* Single Video Slide - Only show if single video exists */}
      {videoUrl && (
      <SwiperSlide>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            height: "200px",
            width: "100%",
            overflow: "hidden",
            borderRadius: "8px",
            margin: "auto",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
          }}
        >
          <video controls style={{ height: "100%", width: "100%", objectFit: "cover" }}>
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl.replace(".mp4", ".webm")} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      </SwiperSlide>
      )}

      {/* Multiple Videos Slides - Show each video in separate slides */}
      {videoUrls.length > 0 && (
        videoUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                height: "200px",
                width: "100%",
                overflow: "hidden",
                borderRadius: "8px",
                margin: "auto",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
            >
              <video controls style={{ height: "100%", width: "100%", objectFit: "cover" }}>
                <source src={url} type="video/mp4" />
                <source src={url.replace(".mp4", ".webm")} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>
          </SwiperSlide>
        ))
      )}
    </Swiper>
  <style>
    {`
      .swiper-button-next, .swiper-button-prev {
        color: white !important;
        font-size: 24px !important;
      }
    `}
  </style>
  {/* <div className="row d-flex align-items-center w-100 position-absolute bottom-0 end-0" style={{ zIndex: 1050}}> */}
    <div className="d-flex w-100 justify-content-end position-absolute bottom-0 end-0" style={{ zIndex: 1050}}>  
      <button className="swiper-button-prev-custom text-center me-1"  style={{
    background: "#4F4B7E",
    height: "30px",
    width: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px", // optional, adjust arrow size
    color: "white",   // optional, arrow color
    border: "none",   // optional, remove border
    borderRadius: "4px" // optional, rounded corners
  }}>❮</button>
      <button className="swiper-button-next-custom" style={{
    background: "#4F4B7E",
    height: "30px",
    width: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px", // optional, adjust arrow size
    color: "white",   // optional, arrow color
    border: "none",   // optional, remove border
    borderRadius: "4px" // optional, rounded corners
  }}>❯</button>
    </div>
  {/* </div> */}
<div className="position-absolute bottom-0 start-50 translate-middle-x text-center mt-2" style={{ zIndex: 1050 , color:"white"}}>
    {currentIndex}/{totalMediaCount > 0 ? totalMediaCount - 1 : 0}
  </div>
</div>
       <span
        className="p-2 mt-3 "
        style={{
          backgroundColor: "#4F4B7E",
                    color: "white",
                    borderRadius: "5px",
                    width: "auto",
                    fontSize:'12px',
                    marginLeft:"10px"
        }}
      >
        Rent_Id : {propertyDetails.rentId}
      </span>



  
      <div className="d-flex justify-content-between align-items-center mt-1" style={{paddingLeft:"10px",
    paddingRight:"10px"}}>
 
 <p className="text-start m-0"style={{
    color: "black",
    fontWeight: 'bold',
    fontSize: "16px",

  }}>
       <strong>{propertyDetails.propertyMode} |  {propertyDetails.propertyType}</strong>  
        </p>
  {/* ({priceInWords})  */}

{/* <div className="d-flex justify-content-center align-items-center gap-3 position-relative text-center" style={{height: 'auto'}}>
           <div style={{ position: 'relative' }}>
      <FaShareAlt
        style={{ cursor: 'pointer', fontSize: '20px', color: '#4F4B7E' }}
        onClick={toggleShareOptions}

      />
{showShareOptions && (
<div
  className="d-flex flex-row justify-content-between p-3"
  ref={popupRef}
  style={{
    position: 'absolute',
    top: '30px',
    right: 0,
    backgroundColor: 'white',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    padding: '10px',
    zIndex: 10,
    minWidth: '300px',
    gap: '12px',
  }}
>
  {navigator.share && (
    <button className="p-0"
      onClick={() => {
        const temp = document.createElement('div');
        temp.innerHTML = `<a href="${window.location.href}">${window.location.href}</a>`;
        document.body.appendChild(temp);

        navigator.clipboard
          .writeText(window.location.href)
          .then(() => {
            navigator.share({
              title: document.title,
              url: window.location.href,
            });
          })
          .catch(() => {
            navigator.share({
              title: document.title,
              text: window.location.href,
              url: window.location.href,
            });
          })
          .finally(() => {
            document.body.removeChild(temp);
          });
      }}
        style={{
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
fontSize:"13px",
    // Ensures full text display
    whiteSpace: 'normal',      // Allow text wrapping
    overflow: 'visible',       // Don't hide overflow
    wordBreak: 'break-word',   // Break long words if needed
  }}
    >
      <PiShareFat /> Share via...
    </button>
  )}
    <div className="d-flex justify-content-between align-items-center gap-3">

      <MdContentCopy onClick={handleCopy} style={{ border: 'none', background: 'none', cursor: 'pointer', color:"grey" }}/>
    {copied && (
      <span style={{ color: 'green', fontSize: '14px' }}>Copied!</span>
    )}
</div>
  {(!navigator.share || window.innerWidth > 768) && (
    <div className="d-flex gap-3">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#3b5998', display: 'flex', alignItems: 'center' }}
      >
        <FaFacebook />
      </a>

      <a
        href={`https://${window.innerWidth <= 768 ? 'api' : 'web'}.whatsapp.com/send?text=${encodeURIComponent("View this: " + window.location.href)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#25D366', display: 'flex', alignItems: 'center' }}
      >
        <FaWhatsapp />
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("View this:")}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#1DA1F2', display: 'flex', alignItems: 'center' }}
      >
        <FaTwitter />
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#0077b5', display: 'flex', alignItems: 'center' }}
      >
        <FaLinkedin />
      </a>
    </div>
  )}
</div>

)}
    </div>
          {isHeartClicked ? (
            <AnimatedHeart filled={true} onClick={handleHeartClick} />

) : (
   <svg
          viewBox="0 0 24 24"
          width="30"
          height="30"
          onClick={handleHeartClick}
          style={{ cursor: "pointer" }}
        >
          <path
            d="M12 21s-6-4.35-9-8.6C.6 9.3 2.7 4.5 7.5 4.5c2.1 0 4.2 1.5 4.5 3.3C12.3 6 14.4 4.5 16.5 4.5 21.3 4.5 23.4 9.3 21 12.4 18 16.65 12 21 12 21z"
            fill="none"
            stroke="#4F4B7E"
            strokeWidth={2}
          />
        </svg>

)}

        </div> */}
      </div>

           <p className="mt-2 mb-0" style={{
    color: "#FF5722",
    fontWeight: 'bold',
    fontSize: "16px",
paddingLeft:"10px"
  }}>
    <MdOutlineCurrencyRupee size={18} /> {formattedPrice}
    <span style={{ fontSize: '14px', color: "#4F4B7E", marginLeft: "10px" }}>
{(propertyDetails.negotiation || '').toString().toLowerCase() === 'yes' ? 'Negotiable' : 'Non-Negotiable'}
    </span>
  </p>
      <p className="mt-1 mb-2" style={{paddingLeft:"10px", paddingRight:"10px", color:"#8B99A9"}}>{priceInWords}</p>

        <h4 className="fw-bold mt-0" style={{fontSize:"15px",paddingLeft:"10px"}}>Make an offer</h4>
        <form
  onSubmit={(e) => {
    e.preventDefault();
    if (!offeredPrice || !phoneNumber || !rentId) {
      setMessage("rentalAmount, Phone number, and Property ID are required.");
      return;
    }
    setPendingOfferData({ offeredPrice, phoneNumber, rentId });
    setShowConfirmModal(true);
  }}
  className="d-flex mb-0"
>
  
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                     <FaRupeeSign style={{ position: 'absolute', left: '10px', color: '#4F4B7E' }} />
                     <input 
                        type="number" 
                        className="w-75 me-2 m-0 ms-2" 
                        placeholder="Make An Offer" 
                        value={offeredPrice}
                        onChange={(e) => setOfferedPrice(e.target.value)}
                        style={{ padding: "8px 12px 8px 30px", borderRadius: "4px", border: "1px solid #4F4B7E", marginRight: "10px", width: "100%" }} 
                    />
                    <button className="m-0"
                        type="submit" 
                        style={{ padding: "8px 12px", borderRadius: "4px", border: "1px solid #4F4B7E", backgroundColor: "#4F4B7E", color: "#fff" }}
                        onMouseOver={(e) => {
                          e.target.style.background = "#CDC9F9"; // Brighter neon on hover
                          e.target.style.fontWeight = 600; // Brighter neon on hover
                          e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
                e.target.style.color = "#4F4B7E";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = "#4F4B7E"; // Original orange
                          e.target.style.fontWeight = 400; // Brighter neon on hover
                 e.target.style.color = "#ffffff";
                        }}
                    >
                        Submit
                    </button>
                </div>
            </form>
            <div className="container d-flex justify-content-center m-0">

      <div className="row g-3 mt-0 w-100">

{/* {propertyDetailsList.map((detail, index) => {
// Check if it's a heading, which should always be full-width (col-12)
if (detail.heading) {
  return (
    <div key={index} className="col-12">
      <h4
        className="m-0 fw-bold"
        style={{ color: "#000000", fontFamily: "Inter, sans-serif", fontSize: "16px" }}
      >
        {detail.label}
      </h4>
    </div>
  );
}

const isDescription = detail.label === "Description";
const columnClass = isDescription ? "col-12" : "col-6";

return (
  <div key={index} className={columnClass}>
    <div
      className="d-flex align-items-center border-0 rounded p-1 mb-1"
      style={{
        width: "100%",
        height: isDescription ? "auto" : "55px",
        wordBreak: "break-word",
      }}
    >
      <span className="me-3 fs-3" style={{ color: "#4F4B7E" }}>
        {detail.icon} 
      </span>
      <div>
      {!isDescription && <span className="mb-1" style={{fontSize:"12px", color:"grey"}}>{detail.label || "N/A"}</span>} 

<p
  className="mb-0 p-0"
  style={{
    fontSize: "14px",
    color: "grey",
    fontWeight: "600",
    padding: "10px",
    borderRadius: "5px",
    width: "100%",
    cursor: "pointer",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }}
  title={
    detail.value
      ? typeof detail.value === "string"
        ? detail.value
        : JSON.stringify(detail.value)
      : "N/A"
  }
>
  {detail.value
    ? ["Country", "State", "City", "District", "Nagar", "Area", "Street Name", "Door Number", "pinCode", "location Coordinates"].includes(detail.label)
      ? typeof detail.value === "string"
        ? `${detail.value.slice(0, 8)}...`
        : JSON.stringify(detail.value)
      : detail.value
    : "N/A"}
</p>


   
      </div>
    </div>
  </div>
);
})} */}

{filteredDetailsList.map((detail, index) => {
  if (detail.heading) {
    return (
      <div key={index} className="col-12">
        <h4 className="m-0 fw-bold" style={{ color: "#000", fontFamily: "Inter, sans-serif", fontSize: "16px" }}>
          {detail.label}
        </h4>
      </div>
    );
  }

  const isDescription = detail.label === "Description";
  const columnClass = isDescription ? "col-12" : "col-6";

const isMatched = isFieldMatched(detail.label, detail.value, matchedFields);

  return (
    <div key={index} className={columnClass}>
      <div className="d-flex align-items-center border-0 rounded p-1 mb-1" style={{
        width: "100%",
        height: isDescription ? "auto" : "55px",
        wordBreak: "break-word"
      }}>
        {/* 🔴🟢 Match Indicator */}
        {isMatched !== null && (
          <span
            className="me-2"
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: isMatched ? "green" : "red",
              display: "inline-block"
            }}
            title={isMatched ? "Matched" : "Mismatched"}
          />
        )}

        {/* Optional Icon */}
        {detail.icon && (
          <span className="me-3 fs-3" style={{ color: "#4F4B7E" }}>
            {detail.icon}
          </span>
        )}

        <div>
          {!isDescription && (
            <span className="mb-1" style={{ fontSize: "12px", color: "grey" }}>
              {detail.label || "N/A"}
            </span>
          )}

          <p className="mb-0 p-0" style={{
            fontSize: "14px",
            color: "grey",
            fontWeight: "600",
            padding: "10px",
            borderRadius: "5px",
            width: "100%",
            cursor: "pointer",
            whiteSpace: isDescription ? "normal" : "normal",
            overflow: "visible",
            textOverflow: "unset",
            wordBreak: "break-word",
            overflowWrap: "break-word"
          }} title={detail.value ? (typeof detail.value === "string" ? detail.value : JSON.stringify(detail.value)) : "N/A"}>
            {detail.value
              ? typeof detail.value === "string"
                ? detail.value
                : JSON.stringify(detail.value)
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
})}

      {/* Contact Info Section */}
      <h5 className="pt-3 fw-bold">Contact Info</h5>
   

<div 
  className="btn rounded-1 p-2 text-center d-flex align-items-center justify-content-center" 
     style={{
        backgroundColor: Viewed ? '#4F4B7E' : 'transparent',
        border: '1px solid #4F4B7E',
        color: Viewed ? 'white' : '#4F4B7E',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        cursor: 'pointer'
      }}  onClick={handleOwnerContactClick}
>
  {/* <img 
    src={contact} 
    alt="Contact Icon" 
    style={{ width: '20px', height: '20px', marginRight: '8px' }} 
  /> */}
  <MdContactPhone size={20} style={{marginRight: '8px', color:"#4F4B7E"}}/>

  View owner contact details
</div>
    {showContactDetails && (
        <div ref={contactRef} className="mt-3">
      
   <div className="row g-3">

{/* Name */}
<div className="col-6 d-flex align-items-center">
  <FaUser style={{ fontSize: "16px", color: "#4F4B7E", marginRight: "10px" }} />
  <div>
    <div style={{ fontSize: "13px", color: "grey" }}>Name</div>
    <div style={{ fontSize: "15px", fontWeight: 600, color: "grey" }}>
      {propertyDetails.ownerName || "N/A"}
    </div>
  </div>
</div>

{/* Email */}
<div className="col-12 d-flex align-items-center">
  <FaEnvelope style={{ fontSize: "16px", color: "#4F4B7E", marginRight: "10px" }} />
  <div>
    <div style={{ fontSize: "13px", color: "grey" }}>Email</div>
    <div style={{ fontSize: "15px", fontWeight: 600, color: "grey" }}>
      {propertyDetails.email || "N/A"}
    </div>
  </div>
</div>

{/* Mobile */}
<div className="col-6 d-flex align-items-center">
  <FaPhoneAlt style={{ fontSize: "16px", color: "#4F4B7E", marginRight: "10px" }} />
  <div>
    <div style={{ fontSize: "13px", color: "grey" }}>Mobile</div>
    <a
      href={`tel:${finalContactNumber}`}
      style={{
        fontSize: "15px",
        fontWeight: 600,
        color: "#4F4B7E",
        cursor: "pointer",
        textDecoration: "none",
        display: "block"
      }}
    >
      {finalContactNumber || "N/A"}
    </a>
  </div>
</div>


{/* Alternate Phone */}
<div className="col-6 d-flex align-items-center">
  <FaPhoneAlt style={{ fontSize: "16px", color: "#4F4B7E", marginRight: "10px" }} />
  <div>
    <div style={{ fontSize: "13px", color: "grey" }}>Alternate Phone</div>
    {propertyDetails.alternatePhone ? (
      <a
        href={`tel:${propertyDetails.alternatePhone}`}
        style={{
          fontSize: "15px",
          fontWeight: 600,
          color: "#4F4B7E",
          textDecoration: "none",
          display: "block",
          cursor: "pointer"
        }}
      >
        {propertyDetails.alternatePhone}
      </a>
    ) : (
      <div style={{ fontSize: "15px", fontWeight: 600, color: "grey" }}>N/A</div>
    )}
  </div>
</div>

{/* Address */}
<div className="col-12 d-flex align-items-center">
  <FaMapMarkerAlt style={{ fontSize: "16px", color: "#4F4B7E", marginRight: "10px" }} />
  <div>
    <div style={{ fontSize: "13px", color: "grey" }}>Address</div>
    <div style={{ fontSize: "15px", fontWeight: 600, color: "grey" }}>
      {propertyDetails.doorNumber} {propertyDetails.streetName} {propertyDetails.nagar} {propertyDetails.area} {propertyDetails.city} {propertyDetails.district} {propertyDetails.state} {propertyDetails.country} {propertyDetails.pinCode}   </div>
  </div>
</div>

{/* Best Time to Call */}
<div className="col-12 d-flex align-items-center">
  <FaClock style={{ fontSize: "16px", color: "#4F4B7E", marginRight: "10px" }} />
  <div>
    <div style={{ fontSize: "13px", color: "grey" }}>Best Time to Call</div>
    <div style={{ fontSize: "15px", fontWeight: 600, color: "grey" }}>
      {propertyDetails.bestTimeToCall || "N/A"}

    </div>
  </div>
</div>
          <span className="d-flex justify-content-end align-items-center">
{!propertyDetails.locationCoordinates && (
  <button
    className="btn btn-primary text-start me-2"
  style={{
      // backgroundColor: isRequested ? "#4F4B7E" : "transparent",
      // color: isRequested ? "#fff" : "#4F4B7E",
      // border: "1px solid #4F4B7E",
      transition: "0.3s"
    }}    onClick={handleAddressRequest}
  >
    Request Address
  </button>
)}

{/* {finalContactNumber && (
  <button
    className="btn btn-outline-#4F4B7E m-0 d-flex align-items-center gap-2"
    style={{
      color: "white",
      backgroundColor: "#4F4B7E",
      border: "1px solid #4F4B7E"
    }}
    onClick={() => window.location.href = `tel:${finalContactNumber}`}
    onMouseOver={(e) => {
      // e.target.style.background = "#029bb3";
      e.target.style.fontWeight = 600;
      e.target.style.transition = "background 0.3s ease";
    }}
    onMouseOut={(e) => {
      e.target.style.background = "#4F4B7E";
      e.target.style.fontWeight = 400;
    }}
  >
    <FaPhoneAlt style={{ transition: 'color 0.3s ease-in-out', background: "none" }} /> Call
  </button>
)} */}

{finalContactNumber && (
  <button
    className="btn btn-outline-#30747F m-0 d-flex align-items-center gap-2"
    style={{
      color: "white",
      backgroundColor: "#30747F",
      border: "1px solid #30747F"
    }}
    onClick={async (e) => {
      e.stopPropagation();
      
      // Make the call to contact-send-property API
      try {
        const storedPhoneNumber = localStorage.getItem("phoneNumber");
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/contact-send-property`,
          {
            userPhone: storedPhoneNumber,
            postedUserPhone: finalContactNumber,
            rentId,
            status: "contactSend"
          }
        );
        
        console.log("Contact send response:", response.data);
         window.location.href = `tel:${finalContactNumber}`;
      } catch (error) {
        console.error("Error recording contact:", error);
        // Still initiate the call even if recording fails
        window.location.href = `tel:${finalContactNumber}`;
      }
    }}
    onMouseOver={(e) => {
      e.target.style.background = "#029bb3";
      e.target.style.fontWeight = 600;
      e.target.style.transition = "background 0.3s ease";
    }}
    onMouseOut={(e) => {
      e.target.style.background = "#2F747F";
      e.target.style.fontWeight = 400;
    }}
  >
    <FaPhoneAlt style={{ transition: 'color 0.3s ease-in-out', background: "none" }} /> 
    Call
  </button>
)}
</span>



<hr></hr>



</div>


        </div>
      )}

{propertyDetails?.locationCoordinates && (
  <div className="mt-1">
    {/* <h6>Property Location on Map:</h6>  */}
   

     <div className="position-relative mt-2" ref={shareMenuRef}>
      {/* Share Icon */}
<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <h6 style={{ margin: 0 }}>Property Location on Map:</h6>
  <span style={{ color: "#014378" }}>Share Property Location</span>
  <CiShare2
    style={{
      color: "#FF4920",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "1.2rem", // optional: adjust icon size
    }}
    onClick={() => setIsShareMenuVisible((prev) => !prev)}
  />
</div>

      {/* <button
        className="btn btn-outline-secondary"
        onClick={() => setIsShareMenuVisible((prev) => !prev)}
      >
        <CiShare2 onClick={() => setIsShareMenuVisible((prev) => !prev)}/> 
      </button> */}

      {/* Share Options Menu */}
      {isShareMenuVisible && (
        <div
          className="position-absolute bg-white p-2 mt-2 rounded shadow"
          style={{ zIndex: 999, minWidth: "200px" }}
        >
          <h6 className="mb-2">Share via:</h6>
          <div className="d-flex flex-row gap-2">
            <a
              href={`https://wa.me/?text=Check out this property: ${getGoogleMapsLink()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-success"
            >
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getGoogleMapsLink())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-primary"
            >
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(getGoogleMapsLink())}&text=Check out this property location!`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-info"
            >
              Twitter
            </a>
            <a
              href={`mailto:?subject=Property Location&body=Here is the location: ${getGoogleMapsLink()}`}
              className="btn btn-sm btn-dark"
            >
              Email
            </a>
          </div>
        </div>
      )}
    </div>
     <div className="mb-2"
      ref={mapRef}
      style={{ width: "100%", height: "300px", borderRadius: "8px", overflow: "hidden" }}
    ></div>
    {/* <div style={{height:"300px", overflowY:"scroll"}}>
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
      className="form-control mb-3"
      type="text"
      placeholder="Search Nearby Places"
      onChange={(e) => {
        const keyword = e.target.value.toLowerCase();
        setNearbyPlaces(
          allNearbyPlaces.filter((p) =>
            p.name.toLowerCase().includes(keyword)
          )
        );
      }}
      style={{
        width: '100%',
        padding: '5px 5px 5px 30px',
        background: 'transparent',
        border: 'none',
        outline: 'none',
      }}
    />
  </div>
     {nearbyPlaces.length > 0 ? (
    nearbyPlaces.map((place) => (
      <div 
        key={place.place_id}
        className="d-flex align-items-center mb-3 border-bottom pb-2"
      >
        <img
          src={
            place.photos?.[0]
              ? place.photos[0].getUrl({ maxWidth: 64, maxHeight: 64 })
              : "https://via.Placeholder.com/64"
          }
          alt={place.name}
          className="me-2 rounded"
          style={{ width: 64, height: 64, objectFit: "cover" }}
        />
        <div>
          <strong>{place.name}</strong>
          <div style={{ fontSize: "14px" }}>
            ⭐ {place.rating || "N/A"} ({place.user_ratings_total || 0})
          </div>
          <div className="text-muted" style={{ fontSize: "13px" }}>
            {place.types?.[0].replace(/_/g, " ")}
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="text-muted text-center py-2">No places found</div>
  )}</div> */}
  </div>
)}
{/* {propertyDetails?.locationCoordinates && (
  <div className="mt-2">
    <a
      href={getGoogleMapsLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-sm btn-outline-primary"
    >
      View in Google Maps
    </a>

    <button
      className="btn btn-sm btn-outline-secondary ms-2"
      onClick={() => {
        navigator.clipboard.writeText(getGoogleMapsLink());
        alert("Location link copied!");
      }}
    >
      Copy Location Link
    </button>
  </div>
)} */}
{/* {propertyDetails?.locationCoordinates && (
  <div className="mt-3">
    <h6>Share Property Location:</h6>
    <div className="d-flex flex-wrap gap-2">
      <a
        href={`https://wa.me/?text=Check out this property location: ${getGoogleMapsLink()}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm btn-success"
      >
        WhatsApp
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getGoogleMapsLink())}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm btn-primary"
      >
        Facebook
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(getGoogleMapsLink())}&text=Check out this property location!`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm btn-info"
      >
        Twitter
      </a>

      <a
        href={`mailto:?subject=Property Location&body=Here is the location: ${getGoogleMapsLink()}`}
        className="btn btn-sm btn-dark"
      >
        Email
      </a>
    </div>
  </div>
)} */}

  
      {/* Image modal */}
      {showModal && (
        <div
  className="modal show d-flex justify-content-center align-items-center"
  style={{
    display: "flex",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1050,
    overflowY: "auto",
  }}
  onClick={closeModal}
>
  <div
    className="modal-dialog modal-dialog-centered"
    style={{
      maxWidth: "90%",
      width: "600px",
      position: "relative",
    }}
    onClick={(e) => e.stopPropagation()}
  >
    <div className="modal-content border-0 rounded-3 shadow-lg">
      <div className="modal-body p-0" style={{ position: "relative" }}>
        {allMedia[currentImageIndex]?.type === 'image' ? (
          <img
            src={allMedia[currentImageIndex]?.src}
            alt="Large Property"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              maxHeight: "80vh",
              objectFit: "contain",
              transition: "opacity 0.3s ease-in-out",
            }}
          />
        ) : (
          <>
            <video
              controls
              crossOrigin="anonymous"
              preload="metadata"
              onLoadedMetadata={() => console.log("Video loaded:", allMedia[currentImageIndex]?.src)}
              onError={(e) => {
                console.error("Video failed to load:", allMedia[currentImageIndex]?.src);
                console.error("Error details:", e.target.error);
              }}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                maxHeight: "80vh",
                objectFit: "contain",
                transition: "opacity 0.3s ease-in-out",
                backgroundColor: "#000",
              }}
            >
              <source src={allMedia[currentImageIndex]?.src} type="video/mp4" />
              <source src={allMedia[currentImageIndex]?.src.replace(".mp4", ".webm")} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </>
        )}

        {/* Left Arrow Button */}
        {allMedia.length > 1 && (
          <button
            onClick={handlePrevMedia}
            style={{
              position: "absolute",
              left: "-50px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "#000",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255, 255, 255, 1)"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(255, 255, 255, 0.7)"}
            title="Previous media"
          >
            ❮
          </button>
        )}

        {/* Right Arrow Button */}
        {allMedia.length > 1 && (
          <button
            onClick={handleNextMedia}
            style={{
              position: "absolute",
              right: "-50px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "#000",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255, 255, 255, 1)"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(255, 255, 255, 0.7)"}
            title="Next media"
          >
            ❯
          </button>
        )}
      </div>

      <div
        className="modal-footer d-flex justify-content-between align-items-center flex-wrap"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
          {currentImageIndex + 1} / {allMedia.length}
        </p>
        <button
          type="button"
          className="btn btn-secondary btn-sm mt-2 mt-sm-0"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  </div>
</div>
      )}



      <div className="container my-3 w-100">
        <div className="row justify-content-center">
          {/* {cards.map((card, index) => (
            <div key={index} className="col-3 d-flex justify-content-center">
              <div
                className="card text-center shadow"
                style={{
                  width: "100px",
                  height: "80px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  border: 'none'
                }}
                onClick={card.onClick}
              >
                <div className="d-flex justify-content-center align-items-center" style={{ height: "50%", width: "100%" }}>
                  <img
                    src={card.img}
                    alt={`Card ${index + 1}`}
                    style={{ width: "30px", height: "30px", objectFit: "cover", marginTop: "5px" }}
                  />
                </div>
                <div className="d-flex justify-content-center align-items-center" style={{ height: "50%", width: "100%", textAlign: "center" }}>
                  <p className="card-text" style={{ fontSize: "10px", margin: "0", wordWrap: "break-word", overflow: "visible" }}>
                    {card.text}
                  </p>
                </div>
              </div>
            </div>
          ))} */}
            {cards.map((card, index) => (
        <div key={index} className="col-3 d-flex justify-content-center">
          <div
            className="card text-center shadow"
            style={{
              width: "100px",
              height: "80px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "none",
              backgroundColor: hoveredIndex === index ? "#F7F2F4" : "#fff",
              transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
              transition: "all 0.3s ease-in-out",
              cursor: "pointer"
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={card.onClick}
          >
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "50%", width: "100%" }}
            >
              <img
                src={card.img}
                alt={`Card ${index + 1}`}
                style={{
                  width: "30px",
                  height: "30px",
                  objectFit: "cover",
                  marginTop: "5px"
                }}
              />
            </div>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                height: "50%",
                width: "100%",
                textAlign: "center"
              }}
            >
              <p
                className="card-text"
                style={{
                  fontSize: "10px",
                  margin: "0",
                  wordWrap: "break-word",
                  overflow: "visible"
                }}
              >
                {card.text}
              </p>
            </div>
          </div>
        </div>
      ))}
        </div>
      </div>
   
{/* {Popup && (
  <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content rounded-5 shadow p-4 border-0">
        <h5 className="text-center mb-4 text-uppercase fw-bold text-secondary">
          {popupTitle}
        </h5>

        <Form.Group className="mb-3 position-relative">
          <BsFilterCircle
            className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
            style={{ fontSize: "1.2rem", zIndex: 1 }}
          />
          <Form.Select
            className="form-select ps-5 fw-bold text-center bg-light border-0 rounded popSelect"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="">Select Reason</option>
            {popupType === "report" ? (
              <>
                <option value="Already Sold">Already Sold</option>
                <option value="Wrong Information">Wrong Information</option>
                <option value="Not Responding">Not Responding</option>
                <option value="Fraud">Fraud</option>
                <option value="Duplicate Ads">Duplicate Ads</option>
                <option value="Other">Other</option>
              </>
            ) : (
              <>
                <option value="Help Me to Buy this Property">Help Me to Buy this Property</option>
                <option value="Book for Property Visit">Book for Property Visit</option>
                <option value="Loan Help">Loan Help</option>
                <option value="Property Valuation">Property Valuation</option>
                <option value="Document Verification">Document Verification</option>
                <option value="Property Surveying">Property Surveying</option>
                <option value="EC">EC</option>
                <option value="Patta Name Change">Patta Name Change</option>
                <option value="Registration Help">Registration Help</option>
                <option value="Others">Others</option>
              </>
            )}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={1}
            placeholder="Add Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="form-control rounded p-3 fw-medium text-secondary"
          />
        </Form.Group>

        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-light flex-fill me-2 fw-medium rounded"
            onClick={() => setPopup(false)}
          >
            CANCEL
          </button>
          <button
            type="button"
            className="btn flex-fill ms-2 fw-medium rounded"
            style={{ backgroundColor: "#4b3aa8", color: "#fff", border: "none" }}
            onClick={popupType === "report" ? ReporthandleSubmit : () => handleHelpSubmit({ reason, comment })}
          >
            SUBMIT
          </button>
        </div>

        {message && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              width: "300px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              zIndex: 1000,
            }}
          >
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  </div>
)} */}
{Popup && (
  <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content rounded-5 shadow p-4 border-0">
        <h5 className="text-center mb-4 text-uppercase fw-bold text-secondary">
          {popupTitle}
        </h5>

        {/* Dropdown reasons */}
        <Form.Group className="mb-3 position-relative">
          <BsFilterCircle
            className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
            style={{ fontSize: "1.2rem", zIndex: 1 }}
          />
          <Form.Select
            className="form-select ps-5 fw-bold text-center bg-light border-0 rounded popSelect"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="">Select Reason</option>
            {popupType === "report" ? (
              <>
                <option value="Already Sold">Already Sold</option>
                <option value="Wrong Information">Wrong Information</option>
                <option value="Not Responding">Not Responding</option>
                <option value="Fraud">Fraud</option>
                <option value="Duplicate Ads">Duplicate Ads</option>
                <option value="Other">Other</option>
              </>
            ) : (
              <>
                <option value="Help Me to Buy this Property">Help Me to Buy this Property</option>
                <option value="Book for Property Visit">Book for Property Visit</option>
                <option value="Loan Help">Loan Help</option>
                <option value="Property Valuation">Property Valuation</option>
                <option value="Document Verification">Document Verification</option>
                <option value="Property Surveying">Property Surveying</option>
                <option value="EC">EC</option>
                <option value="Patta Name Change">Patta Name Change</option>
                <option value="Registration Help">Registration Help</option>
                <option value="Others">Others</option>
              </>
            )}
          </Form.Select>
        </Form.Group>

        {/* Comment box */}
        {/* <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={1}
            placeholder="Add Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="form-control rounded p-3 fw-medium text-secondary"
          />
        </Form.Group> */}
      <Form.Group className="mb-3">
          <Form.Label className="fw-medium text-secondary">Comment (Optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Add Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="form-control rounded p-3 fw-medium text-secondary"
          />
        </Form.Group>
        {/* Buttons */}
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-light flex-fill me-2 fw-medium rounded"
            onClick={() => setPopup(false)}
          >
            CANCEL
          </button>
          <button
            type="button"
            className="btn flex-fill ms-2 fw-medium rounded"
            style={{ backgroundColor: "#4b3aa8", color: "#fff", border: "none" }}
            onClick={popupType === "report" ? ReporthandleSubmit : () => handleHelpSubmit({ reason, comment })}
          >
            SUBMIT
          </button>
        </div>

        {/* Optional message */}
        {message && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              width: "300px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              zIndex: 1000,
            }}
          >
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  </div>
)}


      {showPopup && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.4)", // Dark overlay
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        width: "300px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <p>{popupMessage}</p>
      <button
              className="btn text-white px-3 py-1 flex-grow-1 mx-1"

        onClick={() => {
          confirmAction();
          setShowPopup(false);
        }}
        style={{ background:  "#4F4B7E", width: "80px", fontSize: "13px" }}
        onMouseOver={(e) => {
          e.target.style.background = "#029bb3";
          e.target.style.fontWeight = 600;
          e.target.style.transition = "background 0.3s ease";
        }}
        onMouseOut={(e) => {
          e.target.style.background = "#4F4B7E";
          e.target.style.fontWeight = 400;
        }}

      >
        Yes
      </button>
      <button
              className="btn text-white px-3 py-1 flex-grow-1 mx-1"

        onClick={() => setShowPopup(false)}
        style={{ background:  "#FF0000", width: "80px", fontSize: "13px" }}
        onMouseOver={(e) => {
          e.target.style.background = "#FF6700"; // Brighter neon on hover
          e.target.style.fontWeight = 600; // Brighter neon on hover
          e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
        }}
        onMouseOut={(e) => {
          e.target.style.background = "#FF0000"; // Original orange
          e.target.style.fontWeight = 400; // Brighter neon on hover

        }}

      >
        No
      </button>
    </div>
  </div>
)}


{/* 
{message && (
  <div
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center",
      width: "300px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      zIndex: 1000,
    }}
  >
    <p>{message}</p>
   
  </div>
)} */}


{message && (
  <div
    style={{
        position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: "15px 25px",
      borderRadius: "8px",
      color: "#fff",
      backgroundColor:
        messageType === "success"
          ? "#4CAF50"
          : messageType === "error"
          ? "#f44336"
          : "#2196F3",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      zIndex: 1000,
      cursor: "pointer",
      maxWidth: "300px",
    }}
    onClick={() => setMessage(null)} // Click to close
  >
    {message}
  </div>
)}


<ConfirmationModal
  show={showConfirmModal}
  message="Are you sure you want to submit this offer?"
  onConfirm={() => {
    setShowConfirmModal(false);
    if (pendingOfferData) handleSubmit(pendingOfferData);
  }}
  onCancel={() => {
    setShowConfirmModal(false);
    setPendingOfferData(null);
  }}
/>
    </div>
    </div>
    <div className="d-flex align-items-center justify-content-between w-100 m-0 p-3">
        <button onClick={handleGoBack} className="d-flex align-items-center justify-content-around ps-3  p-2"
        style={{background:"#CDC9F9" , color:"#fff" , borderRadius:"25px" , width:"25%", border:"none"}}
        ><IoChevronBackSharp size={18}/>
 Back</button>
        <button className="d-flex align-items-center justify-content-around ps-3  p-2" onClick={() => navigate(baseToPath(getActiveBase()))}
               style={{background:"#CDC9F9" , color:"#fff" , borderRadius:"25px" , width:"25%", border:"none"}}
        ><TiHome />
Home</button>
        <button className="d-flex align-items-center justify-content-around ps-3 p-2" onClick={handleIncreaserentId} 
                style={{background:"#CDC9F9" , color:"#fff", borderRadius:"25px" , width:"25%", border:"none"}}
        >Next
          <IoIosArrowForward size={18}/>
 </button>
      </div>


   <img src={promotion} alt="" className="p-4 m-0" />
    </div>
    </div>
    </div>

  );
};

export default DetailProperty;






























