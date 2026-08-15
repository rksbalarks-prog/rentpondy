



import React, { useState, useEffect, useMemo, useRef } from "react";
import { getChennaiAreaPincodeMap, getDefaultCity } from "../utils/areaPincode";
import { getActiveBase, baseToPath } from "../utils/cityBase";
import axios from "axios";
import { Button } from "react-bootstrap";
import {  useLocation, useNavigate, useParams } from "react-router-dom";
import { RiCloseCircleFill, RiLayoutLine } from 'react-icons/ri';
import { TbArrowLeftRight, TbFileDescription, TbMapPinCode, TbToolsKitchen, TbWheelchair, TbWorldLongitude } from 'react-icons/tb';
import {FaArrowRight ,FaBuilding, FaMoneyBillWave,  FaBath, FaChartArea, FaPhone ,FaEdit,FaRoad,FaDoorClosed,FaMapPin, FaHome, FaUserAlt, FaEnvelope,  FaRupeeSign , FaFileVideo , FaToilet,FaCar,FaBed,  FaCity , FaTimes, FaChevronLeft} from 'react-icons/fa';
import {  FaLocationCrosshairs, FaRegAddressCard, FaRegCircleCheck } from 'react-icons/fa6';
import { MdLocationOn, MdOutlineMeetingRoom, MdOutlineOtherHouses, MdSchedule , MdStraighten , MdApproval, MdLocationCity , MdAddPhotoAlternate, MdKeyboardDoubleArrowDown, MdOutlineClose, MdBalcony} from "react-icons/md";
import { BsBank, BsBuildingsFill, BsFillHouseCheckFill , BsTextareaT} from "react-icons/bs";
import { GiKitchenScale, GiMoneyStack , GiResize , GiGears} from "react-icons/gi";
import { HiUserGroup } from "react-icons/hi";
import { BiBuildingHouse , BiMap, BiWorld} from "react-icons/bi";
import {  FaArrowLeft, FaFileAlt, FaGlobeAmericas, FaMapMarkerAlt, FaMapSigns } from "react-icons/fa";
import {MdElevator ,MdOutlineChair ,MdPhone, MdOutlineAccessTime, MdTimer, MdHomeWork, MdHouseSiding, MdOutlineKitchen, MdEmail, } from "react-icons/md";
import {  BsBarChart, BsGraphUp } from "react-icons/bs";
import { BiBuilding, BiStreetView } from "react-icons/bi";
import { GiStairs, GiForkKnifeSpoon, GiWindow } from "react-icons/gi";
import { AiOutlineEye, AiOutlineColumnWidth, AiOutlineColumnHeight } from "react-icons/ai";
import { BiBed, BiBath, BiCar, BiCalendar, BiUser, BiCube } from "react-icons/bi";
import Plans from './PricingPlans';
import PricingPlans from "./PricingPlans";
import { Spinner } from "react-bootstrap"; // Using Bootstrap for loading animation

import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IoCloseCircle } from "react-icons/io5";
import moment from "moment";
import { useSwipeable } from 'react-swipeable';
import SuccessIcon from '../Assets/Success.png';
import { toWords } from 'number-to-words';
import { convertToIndianRupees as utilConvertToIndianRupees, convertToWords as utilConvertToWords, parseLatLngString, applyImageWatermark, compressImage } from '../utils/propertyUtils';
import { FcSearch } from "react-icons/fc";

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




function AddProperty() {
  const location = useLocation();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const [phoneNumber] = useState(storedPhoneNumber);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form"); // "form" -> "preview" -> "submitted"
const [videos, setVideos] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

    const [currentStep, setCurrentStep] = useState(1);
    const [showPlans, setshowPlans] = useState(false);
    const [rentId, setrentId] = useState("");
  const previewRef = useRef(null);
  const [priceInWords, setPriceInWords] = useState("");
    const [selectedFiles, setSelectedFiles] = useState("");

    const [priceInWordss, setPriceInWordss] = useState("");
            const [totalAreaWords, setTotalAreawords] = useState("");

  const fileInputRef = useRef(null); // Ref for input field
 const [fieldErrors, setFieldErrors] = useState({});
        const [swiped, setSwiped] = useState(false);
        const [isProcessing, setIsProcessing] = useState(false);
              const [isSuccess, setIsSuccess] = useState(false);
              const [showCheckmark, setShowCheckmark] = useState(false);
        const [showConfirmation, setShowConfirmation] = useState(false);
    const [coordinateInput, setCoordinateInput] = useState('');
    
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handleCloseAddForm = () => {
      setshowPlans(false); // Close add property form
    };
  const [isVisible, setIsVisible] = useState(false);

    const [isScrolling, setIsScrolling] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Add at top of your component

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
    const handlers = useSwipeable({
      onSwipedRight: () => {
        setSwiped(true);
        handleShowMore();
  
        // Automatically reset after 2 seconds
        setTimeout(() => {
          setSwiped(false);
        }, 2000);
      },
      trackMouse: true,
      delta: 40,
    });
  useEffect(() => {
    // This will trigger the animation when the component is loaded
    const timer = setTimeout(() => {
      setIsVisible(true); // Set to true after a short delay to trigger animation
    }, 100); // Delay before animation starts

    // Clean up the timeout on unmount
    return () => clearTimeout(timer);
  }, []);
  // const [rentId, setrentId] = useState(location.state?.rentId || ""); 
  
  // const mapRef = useRef(null);
  // const inputRef = useRef(null);
  // const [mapLoaded, setMapLoaded] = useState(false);
  const inputRef = useRef(null);
  const latRef = useRef(null);
  const lngRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
    const coordRef = useRef(null);

  const [formData, setFormData] = useState({
    propertyMode: '',
    propertyType: '',
    // price: '',
    propertyAge: '',
    bankLoan: '',
    negotiation: '',
    length: '',
    breadth: '',
    totalArea: '',
    ownership: '',
    bedrooms: '',
    kitchen: '',
    kitchenType: '',
    balconies: '',
    floorNo: '',
    areaUnit: '',
    propertyApproved: '',
    postedBy: '',
    facing: '',
    salesMode: '',
    salesType: '',
    description: '',
    furnished: '',
    lift: '',
    attachedBathrooms: '',
    western: '',
    numberOfFloors: '',
    carParking: '',
    rentalPropertyAddress: '',
    country: 'India',
    state: '',
    city: getDefaultCity(),
    district: '',
    area: '',
    streetName: '',
    doorNumber: '',
    nagar: '',
    ownerName: '',
    email: '',
    countryCode:"+91",
    phoneNumber: "",
  phoneNumberCountryCode: "",
  alternatePhone: "",
  alternatePhoneCountryCode: "+91",
    bestTimeToCall: '',
    pinCode:"",
    locationCoordinates:'',
    rentalAmount:"",
    callForRent: false,
    securityDeposit:"", // input
    availableDate:"",  //date
    familyMembers:"",
    foodHabit:"",
    jobType:"",
    petAllowed:"",
    rentType:"",
    wheelChairAvailable:"",
  });

  // Pondicherry area -> pincode list used by the autosuggest. CH users
  // swap this out for the Chennai list (see useMemo below).
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
    "Shanmugapuram": "605009",
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
  const areaPincodeMap = useMemo(
    () => (getActiveBase() === 'CH' ? getChennaiAreaPincodeMap() : PONDY_AREA_PINCODE_MAP),
    []
  );

  // Area suggestions state
  const [areaSuggestions, setAreaSuggestions] = useState([]);
  const [showAreaSuggestions, setShowAreaSuggestions] = useState(false);

  // Handle area input change with suggestions
  const handleAreaInputChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, area: value }));

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

  // Handle area selection from suggestions
  const handleAreaSelect = (selectedArea) => {
    const pincode = areaPincodeMap[selectedArea] || "";
    setFormData(prev => ({
      ...prev,
      area: selectedArea,
      pinCode: pincode
    }));
    setShowAreaSuggestions(false);
    setAreaSuggestions([]);
  };

  useEffect(() => {
    if (step !== "form" || !window.google) return;
  
    const interval = setInterval(() => {
      if (mapRef.current && inputRef.current) {
        clearInterval(interval);
  
        // Optional: clear any existing map to avoid duplication
        mapRef.current.innerHTML = "";
  
        const map = new window.google.maps.Map(mapRef.current, {
center: { lat: 11.9416, lng: 79.8083 },
          zoom: 10,
        });
  
      mapInstance.current = map;

      // ✅ Add click listener on the map
      const geocoder = new window.google.maps.Geocoder();
      map.addListener("click", (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        updateMap(lat, lng); // optional: show marker

        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results[0]) {
            const place = results[0];

            const getComponent = (type) => {
              const comp = place.address_components?.find(c => c.types.includes(type));
              return comp?.long_name || '';
            };

       setFormData(prev => ({
            ...prev,
            rentalPropertyAddress: place.formatted_address,
            latitude: lat,
            longitude: lng,
            pinCode: getComponent("postal_code"),
            city: getComponent("locality") || getComponent("administrative_area_level_3"),
            area: getComponent("sublocality") || getComponent("sublocality_level_1"),
            streetName: getComponent("route") || getComponent("premise"),
            district: getComponent("administrative_area_level_2"),
            state: getComponent("administrative_area_level_1"),
            country: getComponent("country"),
            doorNumber: getComponent("street_number"), // ✅ added here
          locationCoordinates: `${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`, // ✅ Add this

          }));
          }
        });
      });  
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['geocode'],
        });
  
        autocomplete.bindTo('bounds', map);
  
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) return;
  
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
  
          updateMap(lat, lng);
  
          const getComponent = (type) => {
            const comp = place.address_components?.find(c => c.types.includes(type));
            return comp?.long_name || '';
          };
  
          setFormData(prev => ({
            ...prev,
            rentalPropertyAddress: place.formatted_address || '',
            latitude: lat,
            longitude: lng,
            pinCode: getComponent("postal_code"),
          
            // City is usually in 'locality', fallback to district-level if missing
            city: getComponent("sublocality_level_1"),
          
            // Area is more granular, typically sublocality levels
            area: getComponent("sublocality_level_2"),          
            // Optional: Nagar name, generally from level 1
            nagar: getComponent("sublocality"),
          
            // Street name or building/premise
            streetName: getComponent("route") || getComponent("premise"),
          
            // District is administrative_area_level_2 in most cases
            district: getComponent("administrative_area_level_2") || getComponent("locality"),
          
            state: getComponent("administrative_area_level_1"),
            country: getComponent("country"),
            doorNumber: getComponent("street_number"),
            locationCoordinates: `${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`, // ✅ Add this
 }));
        });
      }
    }, 100);
  
    return () => clearInterval(interval);
  }, [step]); // 👈 critical: this makes map re-init on form re-entry
  
   // Initialize map only once
  // const updateMap = (lat, lng) => {
  //   if (mapRef.current) {
  //     const map = new window.google.maps.Map(mapRef.current, {
  //       center: { lat, lng },
  //       zoom: 12,
  //     });
  //     new window.google.maps.Marker({
  //       position: { lat, lng },
  //       map: map,
  //     });
  //   }
  // };
// const updateMap = (lat, lng) => {
//   const map = mapInstance.current;
//   if (!map) return;

//   map.setCenter({ lat, lng });
//   map.setZoom(12);

//   // Update marker
//   if (markerRef.current) {
//     markerRef.current.setPosition({ lat, lng });
//   } else {
//     markerRef.current = new window.google.maps.Marker({
//       position: { lat, lng },
//       map: map,
//     });
//   }
// };

const updateMap = (lat, lng) => {
  const map = mapInstance.current;
  if (!map) return;

  map.setCenter({ lat, lng });
  map.setZoom(12);

  const position = { lat, lng };

  const geocoder = new window.google.maps.Geocoder();

  if (markerRef.current) {
    markerRef.current.setPosition(position);
  } else {
    markerRef.current = new window.google.maps.Marker({
      position,
      map,
      draggable: true,
    });

    // ✅ Listen to dragend event only once when marker is created
    markerRef.current.addListener('dragend', (e) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();

      // Update map and form on drag end
      geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          const place = results[0];
          const getComponent = (type) => {
            const comp = place.address_components?.find(c => c.types.includes(type));
            return comp?.long_name || '';
          };

          setFormData(prev => ({
            ...prev,
            rentalPropertyAddress: place.formatted_address || '',
            latitude: newLat,
            longitude: newLng,
            pinCode: getComponent("postal_code"),
            city: getComponent("sublocality_level_1"),
            area: getComponent("sublocality_level_2"),
            nagar: getComponent("sublocality"),
            streetName: getComponent("route") || getComponent("premise"),
            district: getComponent("administrative_area_level_2") || getComponent("locality"),
            state: getComponent("administrative_area_level_1"),
            country: getComponent("country"),
            doorNumber: getComponent("street_number"),
            locationCoordinates: `${newLat.toFixed(6)}° N, ${newLng.toFixed(6)}° E`,
          }));
        }
      });
    });
  }
};

  const handleLatLngSearch = (e) => {
    e.preventDefault();

    const lat = parseFloat(latRef.current.value);
    const lng = parseFloat(lngRef.current.value);

    if (!isNaN(lat) && !isNaN(lng)) {
      updateMap(lat, lng);

      const geocoder = new window.google.maps.Geocoder();
      const latlng = { lat, lng };

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const place = results[0];

          const getComponent = (type) => {
            const comp = place.address_components.find(c => c.types.includes(type));
            return comp?.long_name || '';
          };

          // Update formData with address components, excluding latitude/longitude
          setFormData((prev) => ({
            ...prev,
            rentalPropertyAddress: place.formatted_address,
            pinCode: getComponent("postal_code"),
          
            // City is usually in 'locality', fallback to district-level if missing
            city: getComponent("sublocality_level_1"),
          
            // Area is more granular, typically sublocality levels
            area: getComponent("sublocality_level_2"),          
            // Optional: Nagar name, generally from level 1
            nagar: getComponent("sublocality"),
          
            // Street name or building/premise
            streetName: getComponent("route") || getComponent("premise"),
          
            // District is administrative_area_level_2 in most cases
            district: getComponent("administrative_area_level_2") || getComponent("locality"),
          
            state: getComponent("administrative_area_level_1"),
            country: getComponent("country"),
            doorNumber: getComponent("street_number"),
                  locationCoordinates: `${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`, // ✅ Add this
  }));
        } else {
          alert('Reverse geocoding failed: ' + status);
        }
      });
    } else {
      alert("Enter valid coordinates");
    }
  };
  
const [coordValue, setCoordValue] = useState('');

// const handleLatLngAuto = (e) => {
//   const input = e.target.value.trim();

//   // Match format like "11.7540° N, 79.7619° E"
//   const match = input.match(/([-\d.]+)[^\dNS]*([NS]),\s*([-\d.]+)[^\dEW]*([EW])/i);

//   if (!match) return; // Don't alert, just wait for correct format

//   let lat = parseFloat(match[1]);
//   let latDir = match[2].toUpperCase();
//   let lng = parseFloat(match[3]);
//   let lngDir = match[4].toUpperCase();

//   if (latDir === "S") lat = -lat;
//   if (lngDir === "W") lng = -lng;

//   if (!isNaN(lat) && !isNaN(lng)) {
//     updateMap(lat, lng);

//     const geocoder = new window.google.maps.Geocoder();
//     const latlng = { lat, lng };

//     geocoder.geocode({ location: latlng }, (results, status) => {
//       if (status === "OK" && results[0]) {
//         const place = results[0];

//         const getComponent = (type) => {
//           const comp = place.address_components.find(c => c.types.includes(type));
//           return comp?.long_name || '';
//         };

//         setFormData(prev => ({
//           ...prev,
//           rentalPropertyAddress: place.formatted_address || '',
//           latitude: lat,
//           longitude: lng,
//           pinCode: getComponent("postal_code"),
//           city: getComponent("sublocality_level_1"),
//           area: getComponent("sublocality_level_2"),
//           nagar: getComponent("sublocality"),
//           streetName: getComponent("route") || getComponent("premise"),
//           district: getComponent("administrative_area_level_2") || getComponent("locality"),
//           state: getComponent("administrative_area_level_1"),
//           country: getComponent("country"),
//           doorNumber: getComponent("street_number"),
//                           locationCoordinates: `${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`, // ✅ Add this
// }));
//       }
//     });
//   }
// };
const handleLatLngAuto = (input) => {
  if (!input || !parseLatLngString) return;
  const coords = parseLatLngString(input);
  if (!coords) return;

  const { lat, lng } = coords;

  updateMap(lat, lng);

  const geocoder = new window.google.maps.Geocoder();
  const latlng = { lat, lng };

  geocoder.geocode({ location: latlng }, (results, status) => {
    if (status === "OK" && results[0]) {
      const place = results[0];

      const getComponent = (type) => {
        const comp = place.address_components.find(c => c.types.includes(type));
        return comp?.long_name || '';
      };

      setFormData(prev => ({
        ...prev,
        rentalPropertyAddress: place.formatted_address,
        latitude: lat,
        longitude: lng,
        pinCode: getComponent("postal_code"),
        city: getComponent("locality") || getComponent("administrative_area_level_3"),
        area: getComponent("sublocality") || getComponent("sublocality_level_1"),
        streetName: getComponent("route") || getComponent("premise"),
        district: getComponent("administrative_area_level_2"),
        state: getComponent("administrative_area_level_1"),
        country: getComponent("country"),
        doorNumber: getComponent("street_number"),
        locationCoordinates: `${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`,
      }));
    }
  });
};
const yourLocation = () => {
  if (!navigator.geolocation) {
    // alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // update map instantly
      updateMap(lat, lng);

      const geocoder = new window.google.maps.Geocoder();
      const latlng = { lat, lng };

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results[0]) {
          const place = results[0];

          const getComponent = (type) => {
            const comp = place.address_components.find(c => c.types.includes(type));
            return comp?.long_name || '';
          };

          setFormData(prev => ({
            ...prev,
            rentalPropertyAddress: place.formatted_address,
            latitude: lat,
            longitude: lng,
            pinCode: getComponent("postal_code"),
            city: getComponent("locality") || getComponent("administrative_area_level_3"),
            area: getComponent("sublocality") || getComponent("sublocality_level_1"),
            streetName: getComponent("route") || getComponent("premise"),
            district: getComponent("administrative_area_level_2"),
            state: getComponent("administrative_area_level_1"),
            country: getComponent("country"),
            doorNumber: getComponent("street_number"),
            locationCoordinates: `${lat.toFixed(6)}, ${lng.toFixed(6)}`, // simpler format
          }));
        }
      });
    },
    (error) => {
      console.error("Error fetching location:", error);
      alert("Unable to fetch your location. Please enable GPS or permissions.");
    }
  );
};

const handleClear = () => {
  if (coordRef.current) {
    coordRef.current.value = ''; // Clear the actual input field
  }
  setCoordValue(''); // Reset state if needed

  // Reset formData fields
  setFormData(prev => ({
    ...prev,
    rentalPropertyAddress: '',
    latitude: '',
    longitude: '',
    pinCode: '',
    city: getDefaultCity(),
    area: '',
    nagar: '',
    streetName: '',
    district: '',
    state: '',
    country: '',
    doorNumber: '',
        locationCoordinates:'',
  }));
};
  
    useEffect(() => {
      const recordDashboardView = async () => {
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
            phoneNumber: phoneNumber,
            viewedFile: "Add Property",
            viewTime: new Date().toISOString(),
          });
        } catch (err) {
        }
      };
    
      if (phoneNumber) {
        recordDashboardView();
      }
    }, [phoneNumber]);
  
  

  const [photos, setPhotos] = useState([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  // Photo compression states (blue progress bar)
  const [isPhotoCompressing, setIsPhotoCompressing] = useState(false);
  const [photoCompressionProgress, setPhotoCompressionProgress] = useState(0);
  const [photoCompressionMessage, setPhotoCompressionMessage] = useState('');
  // Video compression states (orange progress bar)  
  const [isVideoCompressing, setIsVideoCompressing] = useState(false);
  const [videoCompressionProgress, setVideoCompressionProgress] = useState(0);
  const [videoCompressionStatus, setVideoCompressionStatus] = useState('');
  const [videoloading, setvideoUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [videoError, setVideoError] = useState('');
  const [video, setVideo] = useState(null);
  const [isPreview, setIsPreview] = useState(true);

    const [message, setMessage] = useState({ text: "", type: "" });


  
//         useEffect(() => {
//           if (!phoneNumber) {
//             setMessage({ text: "Missing phone number.", type: "error" });
//             return;
//           }
        
//          const handleAddProperty = async () => {
//   try {
//     const response = await axios.post(`${process.env.REACT_APP_API_URL}/store-data-rent`, {
//       phoneNumber: phoneNumber,
//     });

//     console.log("API Response:", response.data); // Add this to inspect the structure

//     if (response.status === 200 || response.status === 201) {
// setrentId(response.data.rentId);
//       setMessage({ text: `User added successfully! RENT-ID: ${response.data.rentId}`, type: "success" });
//     }
//   } catch (error) {
//     console.error("API Error:", error);
//     setMessage({ text: error.response?.data?.message || "Error adding user.", type: "error" });
//   }
// };

//           handleAddProperty();
//         }, [phoneNumber]); // Runs when phoneNumber changes
        
  useEffect(() => {
  if (!phoneNumber) {
    setMessage({ text: "Missing phone number.", type: "error" });
    return;
  }

  const handleAddProperty = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/store-data-rent`, {
        phoneNumber,
      });

      if (response.status === 200 || response.status === 201) {
        setrentId(response.data.rentId);
        setMessage({ text: `User added successfully! RENT-ID: ${response.data.rentId}`, type: "success" });
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Error adding user.", type: "error" });
    }
  };

  handleAddProperty();
}, [phoneNumber]);


  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("rentId");
    setrentId(id); // Store RENT-ID in state
}, [location.search]); // Runs every time the URL changes

  const formRefs = {
    propertyMode: useRef(null),
    propertyType: useRef(null),
    rentType: useRef(null),
    rentalAmount: useRef(null),
    totalArea: useRef(null),
    areaUnit: useRef(null),
    bedrooms: useRef(null),
    floorNo: useRef(null),
    postedBy: useRef(null),
    availableDate: useRef(null),
    state: useRef(null),
    city: useRef(null),
    area: useRef(null),
  };
  
   
const formattedCreatedAt = Date.now
? moment(formData.createdAt).format("DD-MM-YYYY") 
: "N/A";


  const handlePreview = () => {
    // Validate required fields for ALL property types
    const stepRequiredFields = getRequiredFieldsForStep(currentStep) || [];
    const missingFields = stepRequiredFields.filter(field => !formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === ""));
  
    if (missingFields.length > 0) {
      const errorMap = {};
      missingFields.forEach(field => {
        if (!shouldHideField(field)) {
          errorMap[field] = `${fieldLabels[field] || field} is required`;
        }
      });
      
      if (Object.keys(errorMap).length > 0) {
        setFieldErrors(errorMap);
        setMessage({ text: `Please fill in all required fields before previewing: ${missingFields.join(", ")}`, type: "error" });
        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 5000);
        
        // Focus and scroll to the first missing field
        const firstMissingField = missingFields[0];
        const fieldRef = formRefs[firstMissingField];
        
        if (fieldRef?.current) {
          fieldRef.current.focus();
          setTimeout(() => {
            fieldRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 100);
        }
        return;
      }
    }
  
    setStep("preview");
    setIsPreviewOpen(true);
  
    // Scroll to the preview section
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
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

  const propertyDetailsList = [
    { heading: true, label: "Basic property info" }, // Heading 1
    { icon: fieldIcons.propertyMode, label: "Property mode", value:  formData.propertyMode},
    { icon: fieldIcons.propertyType, label: "Property type", value: formData.propertyType },
    // { icon: <MdOutlineCurrencyRupee />, label: "Price", value: formData.price },
    // { icon: fieldIcons.email, label: "Length", value: formData.length },
    // { icon: fieldIcons.email, label: "Breadth", value: formData.breadth  },
    // // { icon: <RiLayoutLine />, label: "Total Area", value: formData.totalArea},
    { icon: fieldIcons.rentType, label: "Rent type", value: formData.rentType },
           {
      icon: fieldIcons.totalArea,
      label: "Total area",
      value: `${formData.totalArea} ${formData.areaUnit}`, // Combined value
    },
        { icon: fieldIcons.negotiation, label: "Negotiation", value: formData.negotiation },

    { icon: fieldIcons.securityDeposit, label: "Security deposit ₹", value: formData.securityDeposit },


  
    { heading: true, label: "Property features" }, // Heading 1

    // { icon: <BiRuler />, label: "Area unit", value: formData.areaUnit },
    // { icon: fieldIcons.email, label: "Ownership", value: formData.ownership },
    // { icon: fieldIcons.email, label: "Property approved", value: formData.propertyApproved },
    // { icon: fieldIcons.email, label: "Bank loan", value: formData.bankLoan },


    { icon: fieldIcons.bedrooms, label: "Bedrooms", value: formData.bedrooms },

    { icon: fieldIcons.floorNo, label: "Floor no", value:formData.floorNo },
    { icon: fieldIcons.kitchen, label: "Kitchen", value: formData.kitchen},
    // { icon: <MdOutlineKitchen />, label: "Kitchen type", value: formData.kitchenType },
    { icon: fieldIcons.balconies, label: "Balconies", value: formData.balconies},
    // { icon: fieldIcons.email, label: "Floors", value: formData.numberOfFloors },
{ label: "Western", value: formData.western, icon: fieldIcons.western},
{ label: "Attached", value: formData.attachedBathrooms, icon:fieldIcons.attachedBathrooms },
    { icon: fieldIcons.wheelChairAvailable, label: "Wheel chair", value: formData.wheelChairAvailable },

    { icon: fieldIcons.carParking, label: "Car park", value: formData.carParking },
    { icon: fieldIcons.lift, label: "Lift", value: formData.lift },
    // { heading: true, label: "Other details" }, // Heading 2

    { icon: fieldIcons.furnished, label: "Furnished", value: formData.furnished },
    { icon: fieldIcons.facing, label: "Facing", value: formData.facing },
    { icon: fieldIcons.propertyAge, label: "Property age", value: formData.propertyAge },

    // { icon: fieldIcons.email, label: "Sale mode", value: formData.salesMode },
    // { icon: fieldIcons.email, label: "Sales type", value: formData.salesType },
    { icon: fieldIcons.postedBy, label: "Posted by", value:formData.postedBy},
    // { icon: <AiOutlineEye />, label: "No.Of.Views", value: "1200" },
    { icon: fieldIcons.availableDate, label: "Posted on", value:formattedCreatedAt },
          { icon: fieldIcons.availableDate, label: "Available from", value: formData.availableDate },

    { heading: true, label: "Property description" }, // Heading 3
    { icon: fieldIcons.description, label: "Description" ,  value: formData.description },
      { heading: true, label: "Tenant preferences" }, // Heading 4

    { icon: fieldIcons.familyMembers, label: "No. of family members", value: formData.familyMembers },
    { icon: fieldIcons.foodHabit, label: "Food habit", value: formData.foodHabit },
    { icon: fieldIcons.jobType, label: "Job type", value: formData.jobType },
    { icon: fieldIcons.petAllowed, label: "Pet", value: formData.petAllowed },
    { heading: true, label: "Rental property address" }, // Heading 3

    // { icon: <BiMap />, label: "Location", value: "New York, USA" },
    { icon: fieldIcons.country, label: "Country", value: formData.country },
    { icon: fieldIcons.state, label: "State", value: formData.state },
    { icon: fieldIcons.district, label: "District", value:  formData.district},
    { icon: fieldIcons.city, label: "City", value: formData.city },
    { icon: fieldIcons.area, label: "Area", value: formData.area },
    
    { icon: fieldIcons.nagar, label: "Nagar", value: formData.nagar },
       { icon: fieldIcons.streetName, label: "Street name", value: formData.streetName },
   
    { icon: fieldIcons.doorNumber, label: "Door number", value: formData.doorNumber },
    { icon: fieldIcons.pinCode, label: "Pincode", value: formData.pinCode },
    { icon: fieldIcons.locationCoordinates, label: "Lat. & lng.", value: formData.locationCoordinates },

    { heading: true, label: "Contact info" }, // Heading 5
   
    { icon: fieldIcons.ownerName, label: "Owner name", value: formData.ownerName },
    { icon: fieldIcons.email, label: "Email", value: formData.email },

    { icon: fieldIcons.phoneNumber, label: "Phone number", value: phoneNumber },
    { icon: fieldIcons.alternatePhone, label: "Alternate phone", value: formData.alternatePhone },

    { icon: fieldIcons.bestTimeToCall, label: "Best time to call", value: formData.bestTimeToCall },
 
  ];

  const excludedPropertyTypes = ["Plot", "Land", "Agricultural Land"].map(type => type.toLowerCase());

const filteredDetailsList = propertyDetailsList.filter((item) => {
  const isPropertyFeatureSection =
    item.label === "Tenant Prefrences" ||
    [
      "Bedrooms", "Floor No", "Kitchen", "Balconies",
      "Wheel Chair", "Western", "Attached", "Car Park", "Lift", "Furnished",
      "No. of family Members", "Food Habit", "Job Type", "Pet", "Door Number"
    ].includes(item.label);

  const propertyType = (formData?.propertyType || "").toLowerCase();

  // If current propertyType is in the excluded list, hide feature-related fields
  if (excludedPropertyTypes.includes(propertyType)) {
    return !isPropertyFeatureSection;
  }

  return true;
});
  const [dropdownState, setDropdownState] = useState({
    activeDropdown: null,
    filterText: "",
  });

  // Toggle dropdown visibility
  const toggleDropdown = (field) => {
    setDropdownState((prevState) => ({
      activeDropdown: prevState.activeDropdown === field ? null : field,
      filterText: "",
    }));
  };

  // // Handle dropdown selection
  // const handleDropdownSelect = (field, value) => {
  //   setFormData((prevState) => ({ ...prevState, [field]: value }));
  //   setDropdownState({ activeDropdown: null, filterText: "" });
  // };

  // Handle filter input change for dropdown
  const handleFilterChange = (e) => {
    setDropdownState((prevState) => ({ ...prevState, filterText: e.target.value }));
  };
  // const [rentId, setrentId] = useState(null);

 


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
  const [alternateCountryCodes, setAlternateCountryCodes] = useState([
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
  ]);
  
  
  const [dataList, setDataList] = useState({});
  const [disabledFields, setDisabledFields] = useState({
    bedrooms: false,
    floorNo: false
  });

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

  // Handle property type changes - set bedrooms and floor to "Not Applicable" for certain types
  useEffect(() => {
    const nonApplicablePropertyTypes = ['plot', 'land', 'agricultural land'];
    const isNonApplicableType = nonApplicablePropertyTypes.includes(formData.propertyType?.toLowerCase());

    if (isNonApplicableType) {
      // Set fields to "Not Applicable" and disable them
      setFormData(prev => ({
        ...prev,
        bedrooms: 'Not Applicable',
        floorNo: 'Not Applicable'
      }));
      setDisabledFields({
        bedrooms: true,
        floorNo: true
      });
    } else {
      // Enable fields and clear values for other property types
      setDisabledFields({
        bedrooms: false,
        floorNo: false
      });
      // Only clear if they were set to "Not Applicable"
      setFormData(prev => ({
        ...prev,
        bedrooms: prev.bedrooms === 'Not Applicable' ? '' : prev.bedrooms,
        floorNo: prev.floorNo === 'Not Applicable' ? '' : prev.floorNo
      }));
    }
  }, [formData.propertyType]);

  const handleClick = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      fileInputRef.current.click();
      setLoading(false);
    }, 1000);
  };


  // const handlePhotoUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   const maxSize = 10 * 1024 * 1024; // 10MB
  //   for (let file of files) {
  //     if (file.size > maxSize) {
  //       alert('File size exceeds the 10MB limit');
  //       return;
  //     }
  //   }
  //   if (photos.length + files.length <= 15) {
  //     setPhotos([...photos, ...files]);
  //     setSelectedPhotoIndex(0);
  //   } else {
  //     alert('Maximum 15 photos can be uploaded.');
  //   }
  // };
const handlePhotoUpload = async (e) => {
  const files = Array.from(e.target.files);
  const maxSize = 10 * 1024 * 1024; // 10MB

  for (let file of files) {
    if (file.size > maxSize) {
      alert('File size exceeds the 10MB limit');
      return;
    }
  }

  if (photos.length + files.length > 15) {
    alert('Maximum 15 photos can be uploaded.');
    return;
  }

  setIsPhotoCompressing(true);
  setPhotoCompressionProgress(0);
  const totalFiles = files.length;
  let compressedImages = [];

  try {
    for (let i = 0; i < files.length; i++) {
      setPhotoCompressionMessage(`Compressing image ${i + 1} of ${totalFiles}...`);
      try {
        const compressed = await compressImage(files[i], 30);
        compressedImages.push(compressed);
      } catch (err) {
        console.error(`Failed to compress image ${i + 1}`, err);
        compressedImages.push(files[i]); // Fallback to original
      }
      setPhotoCompressionProgress(Math.round(((i + 1) / totalFiles) * 100));
    }

    setPhotoCompressionMessage('Applying watermark...');
    const watermarkedImages = await Promise.all(
      compressedImages.map((file) => applyImageWatermark(file))
    );

    setPhotoCompressionMessage('All images compressed and ready!');
    setPhotos([...photos, ...watermarkedImages]);
    setSelectedFiles(watermarkedImages);
    setSelectedPhotoIndex(0);

    setTimeout(() => {
      setIsPhotoCompressing(false);
      setPhotoCompressionProgress(0);
      setPhotoCompressionMessage('');
    }, 1500);
  } catch (err) {
    console.error('Photo upload error:', err);
    alert('Error processing photos. Please try again.');
    setIsPhotoCompressing(false);
  }
};

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
    if (index === selectedPhotoIndex) {
      setSelectedPhotoIndex(0);
    }
  };

  const handleVideoChange = async (e) => {
  const selectedFiles = Array.from(e.target.files);
  const validFiles = [];

  setVideoError(""); // reset previous error

  for (let file of selectedFiles) {
    // ✅ Compress all videos to ~200KB
    let compressedFile = file;
    try {
      setIsVideoCompressing(true);
      setVideoCompressionProgress(0);
      setVideoCompressionStatus(`Compressing ${file.name}...`);
      compressedFile = await compressVideo(file);
      setVideoCompressionStatus(`Compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024).toFixed(0)}KB`);
    } catch (err) {
      console.warn("Compression failed, using original file", err);
      setVideoCompressionStatus('Compression failed, using original');
    } finally {
      setIsVideoCompressing(false);
      setTimeout(() => setVideoCompressionStatus(''), 2000);
    }

    validFiles.push(compressedFile);
  }

  if (!validFiles.length) return;

  // normal upload flow...
  setvideoUploading(true);
  setProgress(0);
  setUploadSuccess(false);

  // fake progress simulation
  let percent = 0;
  const interval = setInterval(() => {
    percent += 10;
    setProgress(percent);

    if (percent >= 100) {
      clearInterval(interval);

      setVideos((prev) => [...prev, ...validFiles].slice(0, 5));
      setvideoUploading(false);
      setUploadSuccess(true);

      setTimeout(() => setUploadSuccess(false), 2000);
    }
  }, 300);
};

// ⚡ Compress video to ~200KB using canvas-based compression
const compressVideo = async (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = async () => {
      try {
        // Target ~200KB output
        const targetSizeKB = 200;
        const duration = video.duration;
        
        // Calculate target bitrate (in bits per second)
        const targetBitrate = Math.floor((targetSizeKB * 1024 * 8) / duration);
        
        // Determine scale factor based on original resolution
        const originalWidth = video.videoWidth;
        const originalHeight = video.videoHeight;
        
        // Scale down significantly to achieve small file size
        let targetWidth = Math.min(320, originalWidth);
        let targetHeight = Math.round((targetWidth / originalWidth) * originalHeight);
        
        // Ensure even dimensions for encoding
        targetWidth = Math.floor(targetWidth / 2) * 2;
        targetHeight = Math.floor(targetHeight / 2) * 2;

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        // Use MediaRecorder for compression
        const stream = canvas.captureStream(10); // 10 FPS for smaller file
        
        // Try to use VP8 or H264 codec with low bitrate
        let mimeType = 'video/webm;codecs=vp8';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
        }
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/mp4';
        }

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: mimeType,
          videoBitsPerSecond: Math.min(targetBitrate, 100000) // Cap at 100kbps for better quality
        });

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          const compressedFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, '') + '_compressed.webm',
            { type: mimeType }
          );
          
          setVideoCompressionProgress(100);
          resolve(compressedFile);
        };

        mediaRecorder.onerror = (e) => reject(e);

        // Start recording
        mediaRecorder.start();
        video.currentTime = 0;
        video.play();

        let lastProgress = 0;
        const drawFrame = () => {
          if (video.ended || video.paused) {
            mediaRecorder.stop();
            return;
          }

          ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
          
          // Update progress
          const currentProgress = Math.round((video.currentTime / duration) * 100);
          if (currentProgress !== lastProgress) {
            lastProgress = currentProgress;
            setVideoCompressionProgress(currentProgress);
          }

          requestAnimationFrame(drawFrame);
        };

        video.onended = () => {
          mediaRecorder.stop();
        };

        drawFrame();

      } catch (err) {
        reject(err);
      }
    };

    video.onerror = () => reject(new Error('Failed to load video'));
    video.src = URL.createObjectURL(file);
  });
};

 const removeVideo = (indexToRemove) => {
  setVideos(prev => prev.filter((_, index) => index !== indexToRemove));
};

  const handlePhotoSelect = (index) => {
    setSelectedPhotoIndex(index);
  };

   const handleFieldChange = (e) => {
  const { name, value } = e.target;

  // Prevent changes to disabled fields
  if (disabledFields[name]) {
    return;
  }

  let updatedValue = value;

  if (name === "description" && value.length > 0) {
    updatedValue = value.charAt(0).toUpperCase() + value.slice(1);
  }

  if (name === "rentalAmount" && value !== "" && !isNaN(value)) {
    setPriceInWords(convertToIndianRupees(value));
  } else if (name === "rentalAmount" && value === "") {
    setPriceInWords("");
  }

    if (name === "securityDeposit" && value !== "" && !isNaN(value)) {
    setPriceInWordss(convertToIndianRupees(value));
  } else if (name === "securityDeposit" && value === "") {
    setPriceInWordss("");
  }

     if (name === "totalArea" && value !== "" && !isNaN(value)) {
    setTotalAreawords(convertToWords(value));
  } else if (name === "totalArea" && value === "") {
    setTotalAreawords("");
  }
  // Set form data and open next dropdown *after* state updates
 setFormData((prev) => ({
      ...prev,
      [name]: value, // This dynamically updates the correct field (phoneNumberCountryCode or alternatePhoneCountryCode)
}));
};

  const convertToIndianRupees = (num) => utilConvertToIndianRupees(num);


    const convertToWords = (num) => utilConvertToWords(num);


   const nonDropdownFields = ["rentalAmount", "securityDeposit", "totalArea", "description","Your Property", "country", "city",  "area", "alternatePhone"];

const dropdownFieldOrder = [
  "propertyMode",
  "propertyType",
  "rentType",
    "negotiation",
  "rentalAmount",
   "securityDeposit",
  "totalArea",
   "areaUnit",
"bedrooms",
"floorNo",
 "kitchen",
 "balconies",
 "attachedBathrooms",
  "western",
  "carParking",
 "lift",
  "furnished",
 "facing",
  "wheelChairAvailable",
"propertyAge",
"postedBy",
"availableDate",
"description",
"familyMembers",
"foodHabit",
"jobType",
"petAllowed",
"Your Property",
  "country",

  "state",

  "city",

  "district",
    "area",

    "alternatePhone",

  "bestTimeToCall"


    //  "ownership",
  
 
  // "kitchenType",
 
  
  // "propertyApproved",
  
  // "bankLoan",
   
  // "salesMode",
  // "salesType",
  

 
 

  // "numberOfFloors",
  

  // Add only the fields that use toggleDropdown
];




  
  // const convertToIndianRupees = (num) => {
  //   if (!num) return "";
  
  //   const units = [
  //     "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  //     "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  //     "Seventeen", "Eighteen", "Nineteen",
  //   ];
  //   const tens = [
  //     "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy",
  //     "Eighty", "Ninety",
  //   ];
    
  //   const scales = ["", "Thousand", "Lakh", "Crore"];
    
  //   let number = parseInt(num, 10);
  //   let words = "";
  
  //   if (number === 0) return "Zero";
  
  //   // Handle Crores
  //   if (number >= 10000000) {
  //     words += convertToIndianRupees(Math.floor(number / 10000000)) + " Crore ";
  //     number %= 10000000;
  //   }
  //   // Handle Lakhs
  //   if (number >= 100000) {
  //     words += convertToIndianRupees(Math.floor(number / 100000)) + " Lakh ";
  //     number %= 100000;
  //   }
  //   // Handle Thousands
  //   if (number >= 1000) {
  //     words += convertToIndianRupees(Math.floor(number / 1000)) + " Thousand ";
  //     number %= 1000;
  //   }
  //   // Handle Hundreds
  //   if (number >= 100) {
  //     words += units[Math.floor(number / 100)] + " Hundred ";
  //     number %= 100;
  //   }
  //   // Handle last part (0-99)
  //   if (number > 0) {
  //     if (words !== "") words += "and ";
  //     if (number < 20) {
  //       words += units[number];
  //     } else {
  //       words += tens[Math.floor(number / 10)];
  //       if (number % 10 !== 0) words += " " + units[number % 10];
  //     }
  //   }
  
  //   return words.trim();
  // };
  // Define required fields for each step
  const requiredFieldsByStep = {
    1: ['propertyMode', 'propertyType' , 'rentType', 'rentalAmount', 'totalArea', 'areaUnit'],
    2: ['bedrooms', 'postedBy', 'availableDate'],
    4: [ 'state', 'district', 'city', 'area', 'pinCode'],
  };

  // Filter out bedroom requirement for Land/Plot types
  const hiddenPropertyTypes = ['Plot', 'Land', 'Agricultural Land'].map(type => type.toLowerCase());
  const isLandType = hiddenPropertyTypes.includes(formData.propertyType?.toLowerCase());

  // Property types that require validation popup
  const typesRequiringValidation = ['house', 'villa', 'farmhouse', 'commercial building', 'apartment'].map(type => type.toLowerCase());
  const shouldValidate = formData.propertyType && typesRequiringValidation.includes(formData.propertyType.toLowerCase());

  // Define fields to hide for plot/land types (must be before getRequiredFieldsForStep)
  const fieldsToHideForPlot = [
    'bedrooms',
    'floorNo',
    'kitchen',
    'balconies',
    'attachedBathrooms',
    'western',
    'carParking',
    'lift',
    'furnished',
    'wheelChairAvailable',
    'familyMembers',
    'foodHabit',
    'jobType',
    'petAllowed',
    'doorNumber'
  ];

  const getRequiredFieldsForStep = (step) => {
    const baseFields = requiredFieldsByStep[step] || [];
    if (isLandType && step === 2) {
      // Remove all fields that should be hidden for plot/land types
      return baseFields.filter(field => !fieldsToHideForPlot.includes(field));
    }
    return baseFields;
  };

  const shouldHideField = (fieldName) => 
    hiddenPropertyTypes.includes(formData.propertyType?.toLowerCase()) &&
    fieldsToHideForPlot.includes(fieldName);

  const filteredDropdownFieldOrder = dropdownFieldOrder.filter(
    (field) => !shouldHideField(field)
  );

    const stepRefs = {
      1: useRef(null),
      2: useRef(null),
      3: useRef(null),
      4: useRef(null),
      5: useRef(null),
      6: useRef(null),
      // 7: useRef(null), // <-- NEW
    };
    const scrollToStep = (step) => {
      if (stepRefs[step] && stepRefs[step].current) {
        stepRefs[step].current.scrollIntoView({
          behavior: 'smooth',
          block: 'start', // Adjust the scroll position if necessary
        });
      }
    };
  

    // Function to handle moving to the next step
    // const handleNextStep = () => {
    //   if (currentStep < 6) {
    //     setCurrentStep(currentStep + 1);
    //   }
    // };
    const scrollFieldContentUp = () => {
      const fieldContent = document.querySelector(".fieldcontent");
      if (fieldContent) {
        fieldContent.scrollIntoView({
          behavior: "smooth",
          block: "start", // You can adjust "start", "center", or "end"
        });
      }
    };
  // const handleShowMore =async (e) => {
  //   if (e && typeof e.preventDefault === 'function') {
  //     e.preventDefault();
  //   }    const stepRequiredFields = requiredFieldsByStep[currentStep] || [];
  //   const missingFields = stepRequiredFields.filter(field => !formData[field]);
  
  //   if (missingFields.length > 0) {
  //     // alert(`Please fill in the following fields before previewing: ${missingFields.join(", ")}`);
  //     setPopupMessage(`Please fill in the following fields before previewing: ${missingFields.join(", ")}`);
  //     setShowPopup(true);
    
  //     const firstMissingField = missingFields[0];
  //     const fieldRef = formRefs[firstMissingField];
  
  //     if (fieldRef?.current) {
  //       fieldRef.current.focus();
  //       setTimeout(() => {
  //         fieldRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  //       }, 100);
  //     }
  
  //     return;

  //   }

  //   // Ensure `rentId` is available
  //   if (!rentId) {
  //     alert("RENT-ID is required. Please refresh or try again.");
  //     return;
  //   }
  
  //   // Create FormData instance to send photos and video
  //   const formDataToSend = new FormData();
  
  //   // Append RENT-ID first
  //   formDataToSend.append("rentId", rentId);
  
  //   // Append form fields
  //   Object.keys(formData).forEach((key) => {
  //     formDataToSend.append(key, formData[key]);
  //   });
  
  //   // Append photos
  //   photos.forEach((photo) => {
  //     formDataToSend.append("photos", photo);
  //   });
  
  //   // Append video if available
  //  videos.forEach(file => {
  //     formDataToSend.append("video", file);
  //   });
  //   try {
  //     const response = await axios.post(`${process.env.REACT_APP_API_URL}/update-rent-property`, formDataToSend, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data', 
  //       },
  //     });

  //     if (response.status === 200) {
  //       // alert('Property details updated successfully!');
  //     }
  //   } catch (error) {
  //     // alert('Failed to update property details. Please try again.');
  //   }
  //   setCurrentStep(currentStep + 1);
  //   scrollFieldContentUp();

  // };

    // Scroll the field content whenever currentStep changes
   
   const handleShowMore = async (e) => {
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }

  // Check character limit for Property Description (Step 3)
  if (currentStep === 3 && formData.description) {
    const charCount = formData.description.length;
    if (charCount > 200) {
      setMessage({ text: `Property description exceeds 200 characters. Current: ${charCount} characters. Please reduce it before proceeding.`, type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
      return;
    }
  }

  const stepRequiredFields = getRequiredFieldsForStep(currentStep) || [];
  const missingFields = stepRequiredFields.filter(field => !formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === ""));

  // Validate required fields for ALL property types
  if (missingFields.length > 0) {
    const errorMap = {};
    missingFields.forEach(field => {
      // Only set error if field is not hidden
      if (!shouldHideField(field)) {
        errorMap[field] = `${fieldLabels[field] || field} is required`;
      }
    });
    
    // If all missing fields are hidden, proceed without errors
    if (Object.keys(errorMap).length === 0) {
      setFieldErrors({});
    } else {
      setFieldErrors(errorMap);
      const firstMissingField = Object.keys(errorMap)[0];
      const fieldRef = formRefs[firstMissingField];

      if (fieldRef?.current) {
        fieldRef.current.focus();
        setTimeout(() => {
          fieldRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
      return;
    }
  } else {
    setFieldErrors({});
  }

  if (!rentId) {
    setMessage({ text: "RENT-ID is required. Please refresh or try again.", type: "error" });
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 5000);
    return;
  }

  const formDataToSend = new FormData();
  formDataToSend.append("rentId", rentId);

  Object.keys(formData).forEach((key) => {
    formDataToSend.append(key, formData[key]);
  });

  photos.forEach((photo) => {
    formDataToSend.append("photos", photo);
  });

  videos.forEach(file => {
    formDataToSend.append("video", file);
  });

  try {
    setIsUploading(true); // ✅ Start loading indicator
    setUploadProgress(0);

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/update-rent-property`,
      formDataToSend,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        },
      }
    );

    if (response.status === 200) {
      // Successfully uploaded
      setUploadProgress(100);
    }

    // ✅ Send WhatsApp message for completed step
    if (currentStep === 1) {
      setTimeout(() => handleStep1Complete(), 300);
    } else if (currentStep === 2) {
      setTimeout(() => handleStep2Complete(), 300);
    } else if (currentStep === 3) {
      setTimeout(() => handleStep3Complete(), 300);
    } else if (currentStep === 4) {
      setTimeout(() => handleStep4Complete(), 300);
    } else if (currentStep === 5) {
      setTimeout(() => handleStep5Complete(), 300);
    }

    setCurrentStep(currentStep + 1);
    scrollFieldContentUp();

  } catch (error) {
    console.error("Failed to update property details:", error);
    setMessage({ text: "Upload failed. Please check your connection and try again.", type: "error" });
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 5000);
    // Optionally set error message here
  } finally {
    setIsUploading(false); // ✅ Stop loading indicator
    setUploadProgress(0);
  }
};
    useEffect(() => {
      scrollToStep(currentStep);
    }, [currentStep]);






const handleCombinedClick = async (e) => {
  e.preventDefault(); // prevent default once here
  await handleAnim(); // Wait for the animation to complete
  handleSubmit(e);    // call submit function, passing the event
};


// const step3Fields = [
//   'bedrooms',
//   'kitchen',
//   'kitchenType',
//   'balconies',
//   'floorNo'
// ];

// const isStep3AllFieldsHidden = step3Fields.every(shouldHideField);

// useEffect(() => {
//   if (currentStep === 3 && isStep3AllFieldsHidden) {
//     setCurrentStep(4); // Skip directly to step 4
//   }
// }, [currentStep, formData.propertyType]);

// const handleAnim = () => {
//   return new Promise((resolve) => {
//     setIsProcessing(true);
//     setIsSuccess(false);
//     setShowCheckmark(false);

//     setTimeout(() => {
//       setIsProcessing(false);
//       setIsSuccess(true);
//       setTimeout(() => {
//         setShowCheckmark(true);
//         resolve(); // Signal completion to continue in handleCombinedClick
//       }, 100);
//     }, 2000); // 2 seconds animation duration
//   });
// };
const handleAnim = () => {
  return new Promise((resolve) => {
    setIsProcessing(true);
    setIsSuccess(false);
    setShowCheckmark(false);

    // Simulate processing animation
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Small delay before showing the checkmark
      setTimeout(() => {
        setShowCheckmark(true); // Show checkmark and text

        // Wait 2s to let user see the checkmark and text
        setTimeout(() => {
          resolve(); // Now allow submission
        }, 2000);
      }, 100); // Delay before showing checkmark
    }, 2000); // Processing animation duration
  });
};




  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setStep("submitted");
  //   const safeOwnerName = (formData.ownerName || "").trim();

  //   const finalFormData = {
  //     ...formData,
  //     ownerName: safeOwnerName === "" ? "Owner" : safeOwnerName,
  //      };
  
  //   if (!rentId) {
  //     setMessage({ text: "RENT-ID is required. Please refresh or try again.", type: "error" });
  //     return;
  //   }
  
  //   const formDataToSend = new FormData();
  //   formDataToSend.append("rentId", rentId);
  
  //   // ✅ Use finalFormData instead of formData here:
  //   Object.keys(finalFormData).forEach((key) => {
  //     formDataToSend.append(key, finalFormData[key]);
  //   });
  
  //   photos.forEach((photo) => {
  //     formDataToSend.append("photos", photo);
  //   });
  
  //   if (video) {
  //     formDataToSend.append("video", video);
  //   }
  
  //   try {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_API_URL}/update-property`,
  //       formDataToSend,
  //       { headers: { "Content-Type": "multipart/form-data" } }
  //     );
  
  //     setMessage({ text: "Property Added successfully!", type: "success" ,  image: SuccessIcon});
  
  //     setTimeout(() => {
  //       setMessage({ text: "", type: "" });
  //     }, 5000);
  //   } catch (error) {
  //     setMessage({ 
  //       text: error.response?.data?.message || "Error saving property data.", 
  //       type: "error" 
  //     });
  //   }
  // };



//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setStep("submitted");

//   const safeOwnerName = (formData.ownerName || "").trim();
//   const phoneNumber = formData.phoneNumber; // Make sure this exists in formData

//   if (!rentId) {
//     setMessage({ text: "RENT-ID is required. Please refresh or try again.", type: "error" });
//     return;
//   }

//   try {
//     // ✅ 1. Check user plan first
//     const planCheckResponse = await axios.post(`${process.env.REACT_APP_API_URL}/check-user-plan`, {
//       phoneNumber
//     });

//     const { planStatus } = planCheckResponse.data;

//     // ❌ If user has no active plan, redirect to /add-plan
//     if (planStatus === 0) {
//       setMessage({ text: "You must purchase a plan before posting a property.", type: "error" });
//       setTimeout(() => {
//         window.location.href = "/add-plan";
//       }, 2000);
//       return;
//     }

//     // ✅ 2. Proceed to update-property if plan is valid
//     const finalFormData = {
//       ...formData,
//       ownerName: safeOwnerName === "" ? "Owner" : safeOwnerName,
//     };

//     const formDataToSend = new FormData();
//     formDataToSend.append("rentId", rentId);

//     Object.keys(finalFormData).forEach((key) => {
//       formDataToSend.append(key, finalFormData[key]);
//     });

//     photos.forEach((photo) => {
//       formDataToSend.append("photos", photo);
//     });

//     if (video) {
//       formDataToSend.append("video", video);
//     }

//     const response = await axios.post(
//       `${process.env.REACT_APP_API_URL}/update-property`,
//       formDataToSend,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );

//     setMessage({ text: "Property Added successfully!", type: "success", image: SuccessIcon });

//     setTimeout(() => {
//       setMessage({ text: "", type: "" });
//       window.location.href = "/my"; // ✅ Navigate to /my-page
//     }, 1500);

//   } catch (error) {
//     setMessage({
//       text: error.response?.data?.message || "Error saving property data.",
//       type: "error"
//     });
//   }
// };


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setStep("submitted");

//   const safeOwnerName = (formData.ownerName || "").trim();
//   const phoneNumber = localStorage.getItem("phoneNumber"); // ✅ Updated here

//   if (!phoneNumber) {
//     setMessage({ text: "Phone number is missing. Please login again.", type: "error" });
//     return;
//   }

//   if (!rentId) {
//     setMessage({ text: "RENT-ID is required. Please refresh or try again.", type: "error" });
//     return;
//   }

//   try {
//     const planCheckResponse = await axios.post(`${process.env.REACT_APP_API_URL}/check-user-plan`, {
//       phoneNumber
//     });

//     const { planStatus } = planCheckResponse.data;

//     if (planStatus === 0) {
//       setMessage({ text: "You must purchase a plan before posting a property.", type: "error" });
//       setTimeout(() => {
//         window.location.href = "/add-plan";
//       }, 2000);
//       return;
//     }

//     const finalFormData = {
//       ...formData,
//       ownerName: safeOwnerName === "" ? "Owner" : safeOwnerName,
//     };

//     const formDataToSend = new FormData();
//     formDataToSend.append("rentId", rentId);

//     Object.keys(finalFormData).forEach((key) => {
//       formDataToSend.append(key, finalFormData[key]);
//     });

//     photos.forEach((photo) => {
//       formDataToSend.append("photos", photo);
//     });

//     if (video) {
//       formDataToSend.append("video", video);
//     }

//     const response = await axios.post(
//       `${process.env.REACT_APP_API_URL}/update-property`,
//       formDataToSend,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );

//     setMessage({ text: "Property Added successfully!", type: "success", image: SuccessIcon });

//     setTimeout(() => {
//       setMessage({ text: "", type: "" });
//       window.location.href = "/my-property";
//     }, 1500);

//   } catch (error) {
//     setMessage({
//       text: error.response?.data?.message || "Error saving property data.",
//       type: "error"
//     });
//   }
// };


// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const finalFormData = {
//     ...formData,
//     ownerName: formData.ownerName.trim() === "" ? "Owner" : formData.ownerName,
//   };

//   if (!rentId) {
//     setMessage({ text: "RENT-ID is required. Please refresh or try again.", type: "error" });
//     return;
//   }

//   const formDataToSend = new FormData();
//   formDataToSend.append("rentId", rentId);

//   Object.keys(finalFormData).forEach((key) => {
//     formDataToSend.append(key, finalFormData[key]);
//   });

//   photos.forEach((photo) => {
//     formDataToSend.append("photos", photo);
//   });

//   videos.forEach(file => {
//     formDataToSend.append("video", file);
//   });

//   try {
//     const response = await axios.post(
//       `${process.env.REACT_APP_API_URL}/update-rent-property`,
//       formDataToSend,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );

//     setMessage({ text: "Property Added successfully!", type: "success", image: SuccessIcon });

//     setTimeout(() => {
//       setMessage({ text: "", type: "" });
//     }, 5000);

//     // ✅ Show confirmation popup for setStep AFTER successful form submit
//     setShowConfirmation(true);

//   } catch (error) {
//     setMessage({
//       text: error.response?.data?.message || "Error saving property data.",
//       type: "error"
//     });
//   }
// };

// ✅ WhatsApp Message Functions for Each Step
const sendAddPropertyWhatsAppMessage = async (stepNum, stepName, message) => {
  console.log(`📱 === SENDING STEP ${stepNum} MESSAGE ===`);
  try {
    const storedPhone = localStorage.getItem("phoneNumber");
    console.log(`📱 Step ${stepNum} - Phone from localStorage:`, storedPhone);
    
    if (!storedPhone) {
      console.log(`❌ Step ${stepNum} - No phone number found`);
      return;
    }

    // Clean phone number
    let cleanPhone = storedPhone.replace(/\D/g, "");
    console.log(`📱 Step ${stepNum} - Phone after cleaning:`, cleanPhone);
    
    if (cleanPhone.length === 10) {
      cleanPhone = "91" + cleanPhone;
      console.log(`📱 Step ${stepNum} - Phone with country code:`, cleanPhone);
    }

    // Validate phone length
    if (cleanPhone.length < 12) {
      console.log(`❌ Step ${stepNum} - Invalid phone length:`, cleanPhone.length);
      return;
    }

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/queue-message`, {
      to: cleanPhone,
      category: "add-property-step",
      data: {
        stepNum,
        stepName,
        stepMessage: message,
        rentId,
      },
    });

    console.log(`✅ Step ${stepNum} WhatsApp queued:`, stepName);
    console.log(`✅ Response:`, response.data);
  } catch (error) {
    console.error(`❌ Step ${stepNum} WhatsApp error:`, error.message);
    console.error(`❌ Step ${stepNum} Error response:`, error.response?.data);
  }
};

// Step 1: Property Details WhatsApp
const handleStep1Complete = async () => {
  console.log("📍 === STEP 1: PROPERTY DETAILS ===");
  await sendAddPropertyWhatsAppMessage(
    1,
    "Property Details",
    `Mode: ${formData.propertyMode}\nType: ${formData.propertyType}\nRent: ₹${formData.rentalAmount}`
  );
};

// Step 2: Property Features WhatsApp
const handleStep2Complete = async () => {
  console.log("🏢 === STEP 2: PROPERTY FEATURES ===");
  await sendAddPropertyWhatsAppMessage(
    2,
    "Property Features",
    `Bedrooms: ${formData.bedrooms || "N/A"}\nArea: ${formData.totalArea || "N/A"} ${formData.areaUnit || ""}\nFloor: ${formData.floorNo || "N/A"}`
  );
};

// Step 3: Description & Photos WhatsApp
const handleStep3Complete = async () => {
  console.log("📸 === STEP 3: DESCRIPTION & PHOTOS ===");
  await sendAddPropertyWhatsAppMessage(
    3,
    "Description & Photos",
    `Photos Uploaded: ${photos?.length || 0}\nDescription: ${formData.description?.substring(0, 50) || "N/A"}...`
  );
};

// Step 4: Property Location WhatsApp
const handleStep4Complete = async () => {
  console.log("📍 === STEP 4: PROPERTY LOCATION ===");
  await sendAddPropertyWhatsAppMessage(
    4,
    "Property Location",
    `Address: ${formData.rentalPropertyAddress || "N/A"}\nCity: ${formData.city || "N/A"}\nState: ${formData.state || "N/A"}`
  );
};

// Step 5: Contact Details WhatsApp
const handleStep5Complete = async () => {
  console.log("📞 === STEP 5: CONTACT DETAILS ===");
  await sendAddPropertyWhatsAppMessage(
    5,
    "Contact Details",
    `Owner: ${formData.ownerName || "N/A"}\nEmail: ${formData.email || "N/A"}\nAll details saved successfully!`
  );
};

// Final Submission WhatsApp - Complete Property Details
const handlePropertySubmitted = async () => {
  console.log("\n");
  console.log("═══════════════════════════════════════════");
  console.log("✨✨✨ PROPERTY SUBMISSION COMPLETE ✨✨✨");
  console.log("═══════════════════════════════════════════");
  console.log("📋 Function execution started at:", new Date().toLocaleTimeString());
  console.log("📋 Current rentId:", rentId);
  console.log("📋 Current phoneNumber from localStorage:", localStorage.getItem("phoneNumber"));
  console.log("📋 API URL configured:", process.env.REACT_APP_API_URL);
  console.log("📋 Current formData keys:", Object.keys(formData));
  console.log("═══════════════════════════════════════════\n");
  
  try {
    const storedPhone = localStorage.getItem("phoneNumber");
    console.log("[STEP 1] ✓ Attempting to get phone from localStorage");
    console.log("   StoredPhone value:", storedPhone);
    
    if (!storedPhone) {
      console.error("[STEP 1] ✗ FAILED: No phone number found in localStorage");
      console.error("   Available localStorage keys:", Object.keys(localStorage));
      return;
    }

    console.log("[STEP 2] ✓ Phone number found. Starting cleanup...");
    // Clean phone number
    let cleanPhone = storedPhone.replace(/\D/g, "");
    console.log("   Original phone:", storedPhone);
    console.log("   After removing non-digits:", cleanPhone);
    console.log("   Current length:", cleanPhone.length);
    
    if (cleanPhone.length === 10) {
      cleanPhone = "91" + cleanPhone;
      console.log("   Added country code: 91");
    }

    console.log("[STEP 3] ✓ Validating phone number...");
    // Validate phone length
    if (cleanPhone.length < 12) {
      console.error("[STEP 3] ✗ FAILED: Invalid phone length:", cleanPhone.length);
      console.error("   Expected: >= 12 digits, Got:", cleanPhone);
      return;
    }

    console.log("[STEP 4] ✓ Phone number is valid:", cleanPhone);
    console.log("✅ Valid phone number:", cleanPhone);
    console.log("✅ Rent ID to send:", rentId);

    console.log("[STEP 5] ✓ Preparing API request...");
    const apiUrl = `${process.env.REACT_APP_API_URL}/queue-message`;
    const payload = {
      to: cleanPhone,
      category: "add-property",
      data: {
        rentId,
        ownerName: formData.ownerName,
        phone: storedPhone,
        email: formData.email,
        propertyType: formData.propertyType,
        propertyMode: formData.propertyMode,
        rentalAmount: formData.rentalAmount,
        rentType: formData.rentType,
        bedrooms: formData.bedrooms,
        totalArea: formData.totalArea,
        areaUnit: formData.areaUnit,
        floorNo: formData.floorNo,
        numberOfFloors: formData.numberOfFloors,
        carParking: formData.carParking,
        lift: formData.lift,
        furnished: formData.furnished,
        address: formData.rentalPropertyAddress,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        availableDate: formData.availableDate,
      },
    };

    console.log("   API Endpoint:", apiUrl);
    console.log("   Request payload:", JSON.stringify(payload, null, 2));

    console.log("[STEP 6] ✓ Sending axios POST request...");
    console.log("   Timestamp:", new Date().toLocaleTimeString());

    const response = await axios.post(apiUrl, payload, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log("[STEP 9] ✓ Response received!");
    console.log("   Response status:", response.status);
    console.log("   Response data:", response.data);
    
    console.log("\n═══════════════════════════════════════════");
    console.log("✅✅✅ MESSAGE SENT SUCCESSFULLY ✅✅✅");
    console.log("═══════════════════════════════════════════\n");
    
  } catch (error) {
    console.log("\n═══════════════════════════════════════════");
    console.error("❌❌❌ MESSAGE SENDING FAILED ❌❌❌");
    console.log("═══════════════════════════════════════════");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received. Request details:", error.request);
      console.error("This usually means the endpoint is unreachable");
    } else {
      console.error("Request setup error:", error.message);
    }
    
    console.error("Full error object:", error);
    console.log("═══════════════════════════════════════════\n");
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const finalFormData = {
    ...formData,
    ownerName: formData.ownerName.trim() === "" ? "Owner" : formData.ownerName,
  };

  if (!rentId) {
    setMessage({ text: "RENT-ID is required. Please refresh or try again.", type: "error" });
    return;
  }

  const formDataToSend = new FormData();
  formDataToSend.append("rentId", rentId);

  Object.keys(finalFormData).forEach((key) => {
    formDataToSend.append(key, finalFormData[key]);
  });

  photos.forEach((photo) => {
    formDataToSend.append("photos", photo);
  });

  videos.forEach(file => {
    formDataToSend.append("video", file);
  });

  try {
    setIsUploading(true); // ✅ Show loading

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/update-rent-property`,
      formDataToSend,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setMessage({ text: "Property Added successfully!", type: "success", image: SuccessIcon });

    // ✅ Send final submission WhatsApp message (non-blocking)
    console.log("🚀 Triggering WhatsApp notification...");
    handlePropertySubmitted().catch((err) => {
      console.error("⚠️ WhatsApp notification error (non-blocking):", err);
    });

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 5000);

    setShowConfirmation(true); // ✅ Show confirmation after successful submit

  } catch (error) {
    setMessage({
      text: error.response?.data?.message || "Error saving property data.",
      type: "error"
    });
  } finally {
    setIsUploading(false); // ✅ Hide loading
  }
};

const confirmStepSubmit = () => {
  setShowConfirmation(false);
  setStep("submitted"); // ✅ Proceed to next step
};

const cancelStepSubmit = () => {
  setShowConfirmation(false);
  navigate(baseToPath(getActiveBase())); // back to the city the user is browsing
};

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setStep("submitted");

// ;

//   const safeOwnerName = (formData.ownerName || "").trim();

//   const finalFormData = {
//     ...formData,
//     ownerName: safeOwnerName === "" ? "Owner" : safeOwnerName,
//     phoneNumber, // ✅ Ensure phone number is added to backend payload
//   };

//   if (!rentId) {
//     setMessage({
//       text: "RENT-ID is required. Please refresh or try again.",
//       type: "error",
//     });
//     return;
//   }

//   if (!phoneNumber) {
//     setMessage({
//       text: "Phone number is missing from URL. Cannot proceed.",
//       type: "error",
//     });
//     return;
//   }

//   const formDataToSend = new FormData();
//   formDataToSend.append("rentId", rentId);

//   Object.keys(finalFormData).forEach((key) => {
//     formDataToSend.append(key, finalFormData[key]);
//   });

//   photos.forEach((photo) => {
//     formDataToSend.append("photos", photo);
//   });

//   if (video) {
//     formDataToSend.append("video", video);
//   }

//   try {
//     const response = await axios.post(
//       `${process.env.REACT_APP_API_URL}/add-property-plan-with-datas`,
//       formDataToSend,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     // ✅ Show success message and redirect
//     setMessage({
//       text: "Property added successfully!",
//       type: "success",
//       image: SuccessIcon,
//     });

//     setTimeout(() => {
//       setMessage({ text: "", type: "" });
//       navigate("/my");
//     }, 2000);
//   } catch (error) {
//     const errMsg = error.response?.data?.message || "Error saving property data.";

//     setMessage({
//       text: errMsg,
//       type: "error",
//     });

//     // ✅ If plan is missing or exhausted, redirect to pricing page
//     if (
//       error.response?.status === 403 &&
//       (error.response?.data?.planStatus === 0 || error.response?.data?.remainingCars <= 0)
//     ) {
//       setTimeout(() => {
//         navigate("/add-plan");
//       }, 2000);
//     }
//   }
// };




  useEffect(() => {
  if (formData.length && formData.breadth) {
    const total = Number(formData.length) * Number(formData.breadth);
    setFormData(prev => ({
      ...prev,
      totalArea: total
    }));
  }
}, [formData.length, formData.breadth]);

const fieldLabels = {
  propertyMode: "Property mode",
  propertyType: "Property type",
    rentType: "Rent type",
  rentalAmount: "Rental amount",
  propertyAge: "Property age",
  bankLoan: "Bank loan",
  negotiation: "Negotiation",
    securityDeposit: "Security deposit",
  length: "Length",
  breadth: "Breadth",
  totalArea: "Total area",
  ownership: "Ownership",
  bedrooms: "Bedrooms",
  kitchen: "Kitchen",
  availableDate: "Available from",
  familyMembers: "No. of family members",
  foodHabit: "Food habit",
  jobType: "Job type",
  petAllowed: "Pet",
    wheelChairAvailable:"Wheel chair",

  kitchenType: "Kitchen type",
  balconies: "Balconies",
  floorNo: "Floor no.",
  areaUnit: "Area unit",
  propertyApproved: "Property approved",
  postedBy: "Posted by",
  facing: "Facing",
  salesMode: "Sales mode",
  salesType: "Sales type",
  description: "Description",
  furnished: "Furnished",
  lift: "Lift",
  attachedBathrooms: "Attached bathrooms",
  western: "Western toilet",
  numberOfFloors: "Number of floors",
  carParking: "Car parking",
  rentalPropertyAddress: "Property address",
  country: "Country",
  state: "State",
  city: "City",
  district: "District",
  area: "Area",
  streetName: "Street name",
  doorNumber: "Door number",
  nagar: "Nagar",
  ownerName: "Owner name",
  email: "Email",
  phoneNumber: "Phone number",
  phoneNumberCountryCode: "Phone country code",
  alternatePhone: "Alternate phone",
  alternatePhoneCountryCode: "Alternate phone country code",
  bestTimeToCall: "Best time to call",
  pinCode: "Pincode",
  locationCoordinates: "Lat. & lng.",
};

 const renderDropdown = (field) => {
   const options = dataList[field] || [];
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
                 placeholder="Filter Options..."
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
 
   // const currentIndex = dropdownFieldOrder.indexOf(field);
   // if (currentIndex !== -1 && currentIndex < dropdownFieldOrder.length - 1) {
   //   const nextField = dropdownFieldOrder[currentIndex + 1];
 
   //   if (nonDropdownFields.includes(nextField)) {
   //     // Focus the next input field and scroll to it
   //     setTimeout(() => {
   //       const nextInput = document.querySelector(`[name="${nextField}"]`);
   //       if (nextInput) {
   //         nextInput.focus();
   //         nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
   //       }
   //     }, 150);
   //   } else {
   //     // Open next dropdown and scroll it into view
   //     setTimeout(() => {
   //       toggleDropdown(nextField);
   //       setTimeout(() => {
   //         const el = document.querySelector(`[data-field="${nextField}"]`);
   //         if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
   //       }, 100);
   //     }, 0);
   //   }
   // }
   const currentIndex = filteredDropdownFieldOrder.indexOf(field);
 if (currentIndex !== -1 && currentIndex < filteredDropdownFieldOrder.length - 1) {
   const nextField = filteredDropdownFieldOrder[currentIndex + 1];
 
   if (nonDropdownFields.includes(nextField)) {
     // Focus input field
     setTimeout(() => {
       const nextInput = document.querySelector(`[name="${nextField}"]`);
       if (nextInput) {
         nextInput.focus();
         nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
       }
     }, 150);
   } else {
     // Open next dropdown
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
 
     // const currentIndex = dropdownFieldOrder.indexOf(field);
 
     // if (currentIndex > 0) {
     //   const prevField = dropdownFieldOrder[currentIndex - 1];
 
     //   if (nonDropdownFields.includes(prevField)) {
     //     setTimeout(() => {
     //       const prevInput = document.querySelector(`[name="${prevField}"]`);
     //       if (prevInput) {
     //         prevInput.focus();
     //         prevInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
     //       }
     //     }, 100);
     //   } else {
     //     setTimeout(() => {
     //       toggleDropdown(prevField); // Open prev dropdown
     //       setTimeout(() => {
     //         const el = document.querySelector(`[data-field="${prevField}"]`);
     //         if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
     //       }, 100);
     //     }, 0);
     //   }
     // }
     const currentIndex = filteredDropdownFieldOrder.indexOf(field);
 if (currentIndex > 0) {
   const prevField = filteredDropdownFieldOrder[currentIndex - 1];
 
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
       toggleDropdown(prevField);
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
 
     // const currentIndex = dropdownFieldOrder.indexOf(field);
 
     // if (currentIndex !== -1 && currentIndex < dropdownFieldOrder.length - 1) {
     //   const nextField = dropdownFieldOrder[currentIndex + 1];
 
     //   if (nonDropdownFields.includes(nextField)) {
     //     setTimeout(() => {
     //       const nextInput = document.querySelector(`[name="${nextField}"]`);
     //       if (nextInput) {
     //         nextInput.focus();
     //         nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
     //       }
     //     }, 100);
     //   } else {
     //     setTimeout(() => {
     //       toggleDropdown(nextField); // Open next dropdown
     //       setTimeout(() => {
     //         const el = document.querySelector(`[data-field="${nextField}"]`);
     //         if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
     //       }, 100);
     //     }, 0);
     //   }
     // }
     const currentIndex = filteredDropdownFieldOrder.indexOf(field);
 
 if (currentIndex !== -1 && currentIndex < filteredDropdownFieldOrder.length - 1) {
   const nextField = filteredDropdownFieldOrder[currentIndex + 1];
 
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
 
             {[
               'areaUnit',
               'availableDate',
               'petAllowed',
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
                 {/* Optional Continue Button can go here */}
               </div>
             )}
           </div>
         </div>
       )}
     </div>
   );
 };




const fields = [
  { name: "propertyMode", type: "select" },
  { name: "propertyType", type: "select" },
  { name: "rentalAmount", type: "input" },
  { name: "propertyAge", type: "select" },
  { name: "bankLoan", type: "select" },
  { name: "negotiation", type: "select" },
  { name: "length", type: "input" },
  { name: "breadth", type: "input" },
  { name: "totalArea", type: "input" },
  { name: "ownership", type: "select" },
  { name: "bedrooms", type: "select" },
  { name: "kitchen", type: "select" },
  { name: "kitchenType", type: "select" },
  { name: "balconies", type: "select" },
  { name: "floorNo", type: "select" },
  { name: "areaUnit", type: "select" },
  { name: "propertyApproved", type: "select" },
  { name: "postedBy", type: "select" },
  { name: "facing", type: "select" },
  { name: "salesMode", type: "select" },
  { name: "salesType", type: "select" },
  { name: "description", type: "input" },
  { name: "furnished", type: "select" },
  { name: "lift", type: "select" },
  { name: "attachedBathrooms", type: "select" },
  { name: "western", type: "select" },
  { name: "numberOfFloors", type: "select" },
  { name: "carParking", type: "select" },
  { name: "rentalPropertyAddress", type: "input" },
  { name: "country", type: "input" },
  { name: "state", type: "input" },
  { name: "city", type: "input" },
  { name: "district", type: "input" },
  { name: "area", type: "input" },
  { name: "streetName", type: "input" },
  { name: "doorNumber", type: "input" },
  { name: "nagar", type: "input" },
  { name: "ownerName", type: "input" },
  { name: "email", type: "input" },
  { name: "phoneNumber", type: "input" },
  { name: "alternatePhone", type: "input" },
  { name: "bestTimeToCall", type: "select" },
];

const handleEdit = () => {
  // setIsPreview(false);
  setStep("form"); // Go back to form

};

  return (
        <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
    <div className="container-fluid d-flex align-items-center justify-content-center pb-5 p-0" >
           <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', margin: 'auto', width: '100%',  fontFamily: "Inter, sans-serif" , }}>

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
    </button><h3 className="m-0" style={{fontSize:"18px"}}>ADD PROPERTY</h3> </div>
<div className="row w-100 mt-2">
{/* <h4 style={{ color: "rgb(10, 10, 10)", fontWeight: "bold", marginBottom: "10px" }}> Property Management</h4>  */}

{message.text && (
 <div
 style={{
   padding: "12px",
   backgroundColor:
     message.type === "success" ? "lightgreen" :
     message.type === "error" ? "lightcoral" :
     message.type === "warning" ? "khaki" :
     message.type === "info" ? "lightblue" :
     message.type === "update" ? "#d1ecf1" :
     message.type === "deleted" ? "#f8d7da" :
     "white",
   color: "black",
   margin: "10px 0",
   borderRadius: "5px",
   display: "flex",
   flexDirection: "column",  // ⬅️ Stack vertically
   alignItems: "center",      // ⬅️ Center horizontally
   textAlign: "center",       // ⬅️ Center text
   gap: "10px"
 }}
>
 {message.image && (
   <img
     src={message.image}
     alt="icon"
     style={{ width: "40px", height: "40px", objectFit: "contain" }}
   />
 )}
 <span>{message.text}</span>
</div>

)}
     {step === "submitted" ?  (
            <PricingPlans phoneNumber={phoneNumber}  rentId={rentId} onClose={handleCloseAddForm}/>
      
      
    ) : step === "form" ?  (
      <div className="col-12 d-flex align-items-center justify-content-center">

<form onSubmit={handleSubmit} style={{ fontFamily: "Inter, sans-serif", width:"100%"}} >
{isUploading && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    }}
  >
    <div
      style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        minWidth: '300px',
      }}
    >
      <h5 style={{ color: 'blue', fontWeight: 'bold', marginBottom: '15px' }}>
        Uploading Property Data
      </h5>
      <div
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            height: '100%',
            backgroundColor: '#4F4B7E',
            width: `${uploadProgress}%`,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <p style={{ color: 'black', fontWeight: 'bold', margin: '0' }}>
        {uploadProgress}% Complete
      </p>
      <p style={{ color: '#666', fontSize: '12px', margin: '5px 0 0 0' }}>
        {videos.length > 0
          ? `Uploading ${videos.length} video(s)...`
          : 'Processing...'}
      </p>
    </div>
  </div>
)}

<h4 style={{ color: "rgb(10, 10, 10)", fontWeight: "bold", marginBottom: "10px" }}> Property Management</h4>             

        <p className="p-3" style={{ color: "white", backgroundColor: "#4F4B7E" }}>RENT-ID: {rentId}</p>
                        <h3 style={{ color: "#4F4B7E", fontSize: "24px", marginBottom: "10px" }}> Property Images  </h3>

  {/* <div className="form-group photo-upload-container mt-2"
    style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handlePhotoUpload}
        name="photos"
        className="photo-upload-input"
        style={{ display: "none" }}
      />
      <label className="photo-upload-label fw-normal m-0">
        <button className="m-0 p-0"
          type="button"
          onClick={handleClick}
          style={{
            border: "none",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            color:"black"
          }}
        >
          {loading ? (
            <Spinner animation="border" size="sm" style={{ color: "#2e86e4", marginRight: "5px" }} />
          ) : (
            <MdAddPhotoAlternate
              style={{
                color: "white",
                backgroundColor: "#2e86e4",
                padding: "5px",
                fontSize: "30px",
                borderRadius: "50%",
                marginRight: "5px",
              }}
            />
            
          )}
   {loading
            ? "Uploading..."
            : 'Upload Your Property Images' }
 </button>
      </label>
    </div> */}
    <div
  className="form-group photo-upload-container mt-2"
  style={{
    display: "flex",
    justifyContent: "center", // horizontally center content
    alignItems: "center",
    width: "100%",
    borderRadius:"20px"    
    // boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)', 
            // ensure full width of container
  }}
> 
  <input
    ref={fileInputRef}
    type="file"
    multiple
    accept="image/*"
    onChange={handlePhotoUpload}
    name="photos"
    className="photo-upload-input"
    style={{ display: "none" }}
  />
  <label className="photo-upload-label fw-normal m-0"
  style={{borderRadius:"20px"}}>
    <button
      className="m-0 p-0 w-100 text-center"
      type="button"
      onClick={handleClick}
      style={{
        border: "none",
        background: "transparent",
        // display: "flex",
        // alignItems: "center",
        cursor: "pointer",
        color: "grey",
         

      }}
    >
      {loading ? (
        <Spinner
          animation="border"
          size="sm"
          style={{ color: "#2e86e4", marginRight: "5px" }}
        />
      ) : (
        <MdAddPhotoAlternate
          style={{
            color: "white",
            backgroundColor: "#2e86e4",
            padding: "5px",
            fontSize: "30px",
            borderRadius: "50%",
            marginRight: "5px",
          }}
        />
      )}
      {loading ? "Uploading..." : "Upload Your Property Images"}
    </button>
  </label>
</div>

{/* Blue Progress Bar for Photo Compression */}
{isPhotoCompressing && (
  <div style={{ 
    backgroundColor: "#e3f2fd", 
    padding: "15px", 
    borderRadius: "10px", 
    marginTop: "10px",
    marginBottom: "10px"
  }}>
    <div style={{ marginBottom: "5px", color: "#1976d2", fontWeight: "bold" }}>
      📷 {photoCompressionMessage || `Compressing... ${photoCompressionProgress}%`}
    </div>
    <div style={{ 
      width: "100%", 
      height: "10px", 
      backgroundColor: "#bbdefb", 
      borderRadius: "5px",
      overflow: "hidden"
    }}>
      <div style={{ 
        width: `${photoCompressionProgress}%`, 
        height: "100%", 
        background: "linear-gradient(90deg, #2196f3, #1976d2)",
        borderRadius: "5px",
        transition: "width 0.3s ease"
      }}></div>
    </div>
    <div style={{ marginTop: "5px", fontSize: "12px", color: "#1976d2" }}>
      {photoCompressionProgress}%
    </div>
  </div>
)}

        {photos.length > 0 && (
          <div className="uploaded-photos position-relative">
            <h4>Uploaded Photos</h4>
            <div className="uploaded-photos-grid" >
              {photos.map((photo, index) => (
                <div key={index} className="uploaded-photo-item">
                  <input
                    type="radio"
                    name="selectedPhoto"
                    className="position-absolute"
                    style={{ top: '-10px' }}

                    checked={selectedPhotoIndex === index}
                    onChange={() => handlePhotoSelect(index)}
                  />
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="Uploaded"
                    className="uploaded-photo m-2"
                  />
                  <button 
                  style={{border:"none"}}
            className="position-absolute top-0 end-0 btn m-0 p-1"
    onClick={() => removePhoto(index)}
                  >
                    <IoCloseCircle size={20} color="#F22952"/>

                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Property Video Upload and Preview */}
        <h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}>Property Video</h4>
        <div className="form-group">
          <input
            type="file"
            name="video"
            accept="video/*"
            id="videoUpload"
            onChange={handleVideoChange}
            className="d-none"
          />
          <label
            htmlFor="videoUpload"
            className="file-upload-label fw-normal w-100"
            style={{
              borderRadius: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60px",
              padding: "10px",
            }}
          >
            <span style={{ width: "100%", textAlign: "center" }}>
              <FaFileVideo
                style={{
                  color: "white",
                  backgroundColor: "#2e86e4",
                  padding: "5px",
                  fontSize: "30px",
                  marginRight: "5px",
                }}
              />
              {isVideoCompressing ? (
                <div style={{ width: "100%", marginTop: "10px" }}>
                  <div style={{ marginBottom: "5px", color: "#ff9800", fontWeight: "bold" }}>
                    🎬 Compressing... {videoCompressionProgress}%
                  </div>
                  <div style={{ 
                    width: "100%", 
                    height: "10px", 
                    backgroundColor: "#e0e0e0", 
                    borderRadius: "5px",
                    overflow: "hidden"
                  }}>
                    <div style={{ 
                      width: `${videoCompressionProgress}%`, 
                      height: "100%", 
                      background: "linear-gradient(90deg, #ff9800, #ff5722)",
                      borderRadius: "5px",
                      transition: "width 0.3s ease"
                    }}></div>
                  </div>
                  <small style={{ color: "#666", fontSize: "10px", marginTop: "3px", display: "block" }}>
                    {videoCompressionStatus || "Compressing to under 200KB..."}
                  </small>
                </div>
              ) : videoloading ? (
                <>
                  <Spinner animation="border" size="sm" style={{ color: "#2e86e4", marginRight: "5px" }} />
                  Uploading... {progress}%
                </>
              ) : uploadSuccess ? (
                <span style={{ color: "green" }}>✅ Successfully uploaded</span>
              ) : videoError ? (
                <span style={{ color: "red", fontSize: "11px" }}>{videoError}</span>
              ) : (
                "Upload Property Video (Auto-compressed to ~200KB)"
              )}
            </span>
          </label>
          {/* Only show video preview if videos exist */}
          {videos.length > 0 && (
            <div className="selected-video-container mt-3">
              <h5 className="text-start">Selected Videos:</h5>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {videos.map((video, index) => (
                  <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                    <video width="200" height="200" controls>
                      <source src={video instanceof File ? URL.createObjectURL(video) : video} type={video instanceof File ? video.type : "video/mp4"} />
                      Your browser does not support the video tag.
                    </video>
                    <Button
                      variant="danger"
                      onClick={() => removeVideo(index)}
                      style={{ border: 'none', background: "transparent" }}
                      className="position-absolute top-0 end-0 m-1 p-1"
                    >
                      <IoCloseCircle size={20} color="#F22952" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

{currentStep >= 1 && (
        <div
        //  className="fieldcontent p-0" ref={stepRefs[1]}
         >
  <h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}>  Property OverView  </h4>             

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
 {fieldIcons.propertyMode} <sup style={{ color: 'red' }}>*</sup>  </span>

  <div style={{ flex: "1" }}>
    <select
      name="propertyMode"
      value={formData.propertyMode || ""}
      onChange={handleFieldChange}
      className="form-control"
      style={{ display: "none" }}
      required
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
      ref={formRefs.propertyMode}
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
          required
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
          ref={formRefs.propertyType}
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
            {fieldIcons.rentType} <sup style={{ color: 'red' }}>*</sup>
          </span>
      <div style={{ flex: "1" }}>
        <select
          name="rentType"
          value={formData.rentType || ""}
          onChange={handleFieldChange}
          className="form-control"
          style={{ display: "none" }} 
          required
        >
          <option value="">Select rent Type</option>
          {dataList.rentType?.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          className="m-0"
          type="button"
          ref={formRefs.rentType}
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

{/* negotiation */}

  <div className="form-group">
    <label style={{ width: '100%'}}>
    {/* <label>Negotiation  </label> */}

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
              {fieldIcons.negotiation || <FaHome />}
            </span>
              <div style={{ flex: "1" }}>
          <select
            name="negotiation"
            value={formData.negotiation || ""}
            onChange={handleFieldChange}
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
            className="m-0"
            type="button"

            onClick={() => toggleDropdown("negotiation")}
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
            
            {formData.negotiation || "Select Negotiation"}
 {formData.negotiation && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("negotiation")}
        </div>
      </div>
    </label>
  </div>
  {/* rentalAmount */}
 
<div className="form-group">
  {/* <label>rental Amount <span style={{ color: 'red' }}>* </span> </label> */}
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
<img src={price} alt="" style={{ width: 20, height: 20 }} /> <sup style={{ color: 'red' }}>*</sup> </span>
      <input
        type={formData.callForRent ? "text" : "number"}
        name="rentalAmount"
        value={formData.callForRent ? "Call Owner" : formData.rentalAmount}
        onChange={handleFieldChange}
        className="form-input m-0"
        placeholder="Rental Amount"
        required={!formData.callForRent}
        disabled={!!formData.callForRent}
        ref={formRefs.rentalAmount}
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
      />
    </div>
    {(formData.rentalAmount || formData.callForRent) && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
  </div>

  {/* "Call Owner" toggle — when checked, the input displays the text and the
       value is stored as a Boolean flag (callForRent) while rentalAmount stays 0. */}
  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '14px', color: '#4F4B7E', cursor: 'pointer' }}>
    <input
      type="checkbox"
      checked={!!formData.callForRent}
      onChange={(e) => {
        const checked = e.target.checked;
        setFormData(prev => ({
          ...prev,
          callForRent: checked,
          rentalAmount: checked ? 0 : prev.rentalAmount,
        }));
        if (checked) setPriceInWords("");
      }}
    />
    Call Owner (use when price is on request)
  </label>

  {priceInWords && !formData.callForRent && (
    <p style={{ fontSize: "14px", color: "#4F4B7E", marginTop: "5px" }}>
      {priceInWords}
    </p>
  )}
</div>


  {/* securityDeposit */}
  <div className="form-group">
  {/* <label>securityDeposit</label> */}
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
{fieldIcons.securityDeposit}  </span>
  <input
      type="number"
      name="securityDeposit"
      value={formData.securityDeposit}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Security Deposit"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.securityDeposit && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div>
{priceInWordss && (
    <p style={{ fontSize: "14px", color: "#4F4B7E", marginTop: "5px" }}>
      {priceInWordss}
    </p>
  )}</div>

{/* Total Area: */}
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
    
{fieldIcons.totalArea} <sup style={{ color: 'red' }}>*</sup> </span>
  <input
      type="number"
      name="totalArea"
      value={formData.totalArea}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Total Area"
      required
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.totalArea && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
  </div> 
    {setTotalAreawords && (
    <p style={{ fontSize: "14px", color: "#4F4B7E", marginTop: "5px" }}>
      {totalAreaWords}
    </p>
  )} </div>

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
              {fieldIcons.areaUnit || <FaHome />}<sup style={{ color: 'red' }}>*</sup>
            </span>
                 <div style={{ flex: "1" }}>
          <select
            name="areaUnit"
            value={formData.areaUnit || ""}
            onChange={handleFieldChange}
            className="form-control"
            required
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
            ref={formRefs.areaUnit} // Attach ref here

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
  </div>
 )}


{currentStep >= 2 && (
        <div className="fieldcontent p-0" ref={stepRefs[2]}>
  <h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}> Basic Property Info  </h4>             
  {!shouldHideField("bedrooms") && (

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
              {fieldIcons.bedrooms || <FaHome />}<sup style={{ color: 'red' }}>*</sup>
            </span> <div style={{ flex: "1" }}>
          <select
          required
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
            ref={formRefs.bedrooms}
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
  )}
    {!shouldHideField("floorNo") && (

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
              {fieldIcons.floorNo}<sup style={{ color: 'red' }}>*</sup>
            </span>  <div style={{ flex: "1" }}>
          <select required
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
            ref={formRefs.floorNo}
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
  )}
    {/* kitchen */}
   {!shouldHideField("kitchen") && (

  <div className="form-group">
    <label style={{ width: '100%'}}>
    {/* <label>kitchen </label> */}

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
              {fieldIcons.kitchen || <FaHome />}
            </span>  <div style={{ flex: "1" }}>
          <select
            name="kitchen"
            value={formData.kitchen || ""}
            onChange={handleFieldChange}
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
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("kitchen")}
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
             
            {formData.kitchen || "Select kitchen"}
 {formData.kitchen && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("kitchen")}
        </div>
      </div>
    </label>
  </div>
    )}
    {/* balconies */}
        {!shouldHideField("balconies") && (

    <div className="form-group">
    <label style={{ width: '100%'}}>
    {/* <label>Balconies </label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>          <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
              {fieldIcons.balconies || <FaHome />}
            </span>  <div style={{ flex: "1" }}>
          <select
            name="balconies"
            value={formData.balconies || ""}
            onChange={handleFieldChange}
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
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("balconies")}
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
         
            {formData.balconies || "Select Balconies"}
 {formData.balconies && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("balconies")}
        </div>
      </div>
    </label>
  </div>
  )}
    {/*attachedBathrooms */}
          {!shouldHideField("attachedBathrooms") && (

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
            value={formData.attachedBathrooms || ""}
            onChange={handleFieldChange}
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
              border:"none",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
           
            {formData.attachedBathrooms || "Select Attached Bathrooms"}
 {formData.attachedBathrooms && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("attachedBathrooms")}
        </div>
      </div>
    </label>
  </div>
 )}
      {/* western */}
          {!shouldHideField("western") && (

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
            value={formData.western || ""}
            onChange={handleFieldChange}
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
              border:"none",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
         
            {formData.western || "Select Western"}
 {formData.western && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("western")}
        </div>
      </div>
    </label>
  </div>
   )}
    {/* carParking */}
{!shouldHideField("carParking") && (

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
            value={formData.carParking || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select car Park</option>
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
              border:"none",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
         
            {formData.carParking || "Select car Park"}
 {formData.carParking && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("carParking")}
        </div>
      </div>
    </label>
  </div>
   )}
    {/*lift */}
        {!shouldHideField("lift") && (

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
            value={formData.lift || ""}
            onChange={handleFieldChange}
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
              border:"none",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
           
            {formData.lift || "Select lift"}
 {formData.lift && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("lift")}
        </div>
      </div>
    </label>
  </div>
  )}
  {/* furnished */}
    {!shouldHideField("furnished") && (

  <div className="form-group">
    <label style={{width:"100%"}}>
    {/* <label>Furnished</label> */}

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
              {fieldIcons.furnished || <FaHome />}
            </span>    <div style={{ flex: "1" }}>
          <select
            name="furnished"
            value={formData.furnished || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select Furnished</option>
            {dataList.furnished?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("furnished")}
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
          
            {formData.furnished || "Select furnished"}
 {formData.furnished && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("furnished")}
        </div>
      </div>
    </label>
  </div>
   )}
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
            
            {formData.facing || "Select Facing"}
 {formData.facing && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("facing")}
        </div>
      </div>
    </label>
  </div>
{/* wheelChairAvailable */}
    {!shouldHideField("wheelChairAvailable") && (

  <div className="form-group">
    <label style={{width:"100%"}}>
    {/* <label>wheel Chair Available</label> */}

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
            value={formData.wheelChairAvailable || ""}
            onChange={handleFieldChange}
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
          
            {formData.wheelChairAvailable || "Select Wheel Chair"}
 {formData.wheelChairAvailable && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("wheelChairAvailable")}
        </div>
      </div>
    </label>
  </div>
 )}
      {/* Property Age */}
    <div className="form-group">
    <label style={{ width: '100%'}}>
    {/* <label>Property Age </label> */}

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
              {fieldIcons.propertyAge || <FaHome />}
            </span>  <div style={{ flex: "1" }}>
          <select
            name="propertyAge"
            value={formData.propertyAge || ""}
            onChange={handleFieldChange}
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
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("propertyAge")}
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
           
            {formData.propertyAge || "Select Property Age"}
 {formData.propertyAge && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("propertyAge")}
        </div>
      </div>
    </label>
  </div>

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
              {fieldIcons.postedBy} <sup style={{ color: 'red' }}>*</sup>
            </span>   <div style={{ flex: "1" }}>
          <select
            name="postedBy"

            value={formData.postedBy || ""}
            onChange={handleFieldChange}
            className="form-control"
            required
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
            ref={formRefs.postedBy} // Attach ref here

            onClick={() => toggleDropdown("postedBy")}
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
           
            {formData.postedBy || "Select Posted By"}
 {formData.postedBy && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("postedBy")}
        </div>
      </div>
    </label>
  </div>

  {/* availableDate */}

<div className="form-group"> 
  <label style={{ width: '100%' }}>

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
            {fieldIcons.availableDate} <sup style={{ color: 'red' }}>*</sup>
          </span>
      <div style={{ flex: "1" }}>
        <select
          name="availableDate"
          value={formData.availableDate || ""}
          onChange={handleFieldChange}
          className="form-control"
          style={{ display: "none" }} 
          required
        >
          <option value="">Select availableDate</option>
          {dataList.availableDate?.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          className="m-0"
          type="button"
          ref={formRefs.availableDate}
          onClick={() => toggleDropdown("availableDate")}
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
    
          {formData.availableDate || "Select Available From"}

          {formData.availableDate && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}
        </button>

        {renderDropdown("availableDate")}
      </div>
    </div>
  </label>
</div>

  </div>
 )}


 {currentStep >= 3 && ( 
        <div className="fieldcontent p-0" ref={stepRefs[3]}>
<h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}>  Property Description   </h4>             

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
  <div style={{ width: '100%', position: 'relative' }}>
    <textarea
      name="description"
      value={formData.description}
      onChange={handleFieldChange}
      className="form-control"
      placeholder="What Makes You Unique (Maximum 200 Characters)"
      style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey", width: '100%', boxSizing: 'border-box' }}
    ></textarea>
    <div style={{
      position: 'absolute',
      bottom: '8px',
      right: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: formData.description.length > 200 ? '#dc3545' : formData.description.length >= 150 ? '#ff9800' : '#28a745'
    }}>
      {formData.description.length}/200
    </div>
  </div>
</div>
{message.text && message.type === "error" && (
  <div
  style={{
    padding: "10px",
    backgroundColor: "lightcoral",
    color: "black",
    margin: "10px 0",
    borderRadius: "5px"
  }}
>
  {message.text}
</div>
)}
</div>

{/* familyMembers */}
    {!shouldHideField("familyMembers") && (
      <>
<h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}>  Tenant Preferences   </h4>             

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
          
            {formData.familyMembers || "Select No. of Family Members"}
 {formData.familyMembers && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("familyMembers")}
        </div>
      </div>
    </label>
  </div>
  </>
)}
{/* foodHabit */}
    {!shouldHideField("foodHabit") && (

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
  )}
{/* jobType */}
    {!shouldHideField("jobType") && (

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
  )}
{/* petAllowed */}
    {!shouldHideField("petAllowed") && (

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
)}
  </div>
 )}
  

{currentStep >= 4 && (
        <div className="fieldcontent p-0" ref={stepRefs[4]}>


<h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}>  Property Address   </h4>             
<div className="form-group">
<div className="input-card p-0 rounded-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)", background:"#fff" ,}}>
    <FaLocationCrosshairs  className="input-icon" 
    style={{color: '#4F4B7E',marginLeft:"10px"}} />  <button 
          style={{ flex: '1', padding: '12px',fontSize: '14px', border: 'none', outline: 'none' , background:"#fff", color:"grey"}}
 type="button" onClick={yourLocation}>Use Your Current Location</button>

</div>
</div>

<div className="form-group">
{/* <label>Quick Address:</label> */}
<div className="input-card p-0 rounded-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)", background:"#fff" ,}}>
    <FcSearch  className="input-icon" 
    style={{color: '#4F4B7E',marginLeft:"10px"}} />
    <input
      ref={inputRef}
  name="Your Property"

      id="pac-input"
      className="form-input m-0"
      placeholder="Search Enter Your Property"
        style={{ flex: '1', padding: '12px',fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>

</div>
<div
  ref={mapRef}
  id="map"
  style={{ height: "200px", width: "100%" }}
></div>
<div className="mt-3 w-100 d-flex gap-2 mb-2">
  <input 
  ref={coordRef}
  placeholder="Enter Lat & Lng Eg.(11.9416° N, 79.8083° E)"
  className="form-control m-0"
    onChange={(e) => setCoordinateInput(e.target.value)}

    // onChange={handleLatLngAuto} // 👈 Automatically triggers on input
/>
<button className="btn btn-primary m-0 border-0"
     style={{ whiteSpace: 'nowrap', background:"#4F4B7E" ,  }}
 onClick={() => handleLatLngAuto(coordinateInput)}>
  Go
</button>

  <button
    onClick={handleClear}
    type="button"
    className="btn btn-primary m-0 border-0"
    style={{ whiteSpace: 'nowrap', background:"#CDC9F9" ,  }}
  >
    <MdOutlineClose color="white"/>
  </button>

</div>

<p className="mt-1" style={{color:"#0597FF" , fontSize:"13px"}}>IF YOU CAN'T FIND THE ADDRESS PLEASE ENTER MANUALLY</p>


  {/* country */}

  <div className="form-group">
  {/* <label>country:</label> */}
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
     <BiWorld className="input-icon" style={{color: '#4F4B7E',}} />
  </span>
  <input
      type="text"
      name="country"
      value={formData.country}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Country"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.country && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
  </div>  </div>
  
  {/* State */}
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
  required
      type="text"
      name="state"
      value={formData.state}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="State"
      ref={formRefs.state}
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.state && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div></div> */}
 <div className="form-group">
    <label style={{ width: '100%'}}>

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
 {fieldIcons.state} <sup style={{ color: 'red' }}>*</sup>  </span>

  <div style={{ flex: "1" }}>
    <select
      name="state"
      value={formData.state || ""}
      onChange={handleFieldChange}
      className="form-control"
      style={{ display: "none" }}
      required
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
      ref={formRefs.state}
      onClick={() => toggleDropdown("state")}
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
      {formData.state || "Select state"}
      {formData.state && (
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

    {renderDropdown("state")}
  </div>
</div>

    </label>
  </div>
  {/* district */}
   <div className="form-group" >
      <label style={{width:'100%'}}>
      {/* <label>District</label> */}

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
                {fieldIcons.district || <FaHome />} <sup style={{ color: 'red' }}>*</sup>
              </span>     <div style={{ flex: "1" }}>
            <select
              name="district"
              value={formData.district || ""}
              onChange={handleFieldChange}
              className="form-control"
              style={{ display: "none" }} // Hide the default <select> dropdown
            >
              <option value="">Select District</option>
              {dataList.district?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button
              className="m-0"
              type="button"
              onClick={() => toggleDropdown("district")}
              style={{
                cursor: "pointer",
                // border: "1px solid #4F4B7E",
                padding: "12px",
                background: "#fff",
                borderRadius: "5px",
                width: "100%",
                textAlign: "left",
                border:"none",
                color: "grey",
                 position: "relative",
                boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
}}            >

              {formData.district || "Select District"}
               {formData.district && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}
            </button>

            {renderDropdown("district")}
          </div>
        </div>
      </label>
    </div>

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
     {fieldIcons.city || <FaHome />} <sup style={{ color: 'red' }}>*</sup>
  </span>
  <input
  required
      type="text"
      name="city"
      value={formData.city}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="City"
      ref={formRefs.city}
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.city && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div></div>

  {/* area */}
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
 {fieldIcons.area}  <sup style={{ color: 'red' }}>*</sup></span>
  <input
  required
      type="text"
      name="area"
      value={formData.area}
      onChange={handleAreaInputChange}
      onFocus={() => {
        if (formData.area && areaSuggestions.length > 0) {
          setShowAreaSuggestions(true);
        }
      }}
      onBlur={() => {
        // Delay hiding to allow click on suggestion
        setTimeout(() => setShowAreaSuggestions(false), 200);
      }}
      className="form-input m-0"
      placeholder="Area"
      ref={formRefs.area}
      autoComplete="off"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.area && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div>
{/* Area Suggestions Dropdown */}
{showAreaSuggestions && areaSuggestions.length > 0 && (
  <div style={{
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 1000,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  }}>
    {areaSuggestions.map((suggestion, index) => (
      <div
        key={index}
        onClick={() => handleAreaSelect(suggestion)}
        style={{
          padding: '10px 15px',
          cursor: 'pointer',
          borderBottom: '1px solid #eee',
          fontSize: '14px',
          color: '#333'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
      >
        {suggestion} <span style={{ color: '#888', fontSize: '12px' }}>({areaPincodeMap[suggestion]})</span>
      </div>
    ))}
  </div>
)}
</div>
  {/* Nagar */}
  <div className="form-group">
  {/* <label>Nagar:</label> */}
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
 {fieldIcons.nagar}    </span>
  <input
      type="text"
      name="nagar"
      value={formData.nagar}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Nagar"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.nagar && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div></div>
  {/* streetName */}
  <div className="form-group">
  {/* <label>Street Name:</label> */}
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
 {fieldIcons.streetName}      </span>
  <input
      type="text"
      name="streetName"
      value={formData.streetName}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Street Name"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.streetName && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div></div>
  {/* doorNumber */}
      {!shouldHideField("doorNumber") && (

  <div className="form-group">
  {/* <label>Door Number:</label> */}
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
 {fieldIcons.doorNumber}    </span>
  <input
      type="number"
      name="doorNumber"
      value={formData.doorNumber}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Door Number"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.doorNumber && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
  </div></div>
)}



<div className="form-group">
  {/* <label>pinCode:</label> */}
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
     <TbMapPinCode  className="input-icon" style={{color: '#4F4B7E',}} />
     <span style={{ color: "red", fontSize: "18px", fontWeight: "bold", marginLeft: "2px" }}>*</span>
  </span>
  <input
      type="text"
      name="pinCode"
      value={formData.pinCode}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="PinCode"
      required
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.pinCode && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div>
</div>

<div className="form-group">
  {/* <label>location Coordinates:</label> */}
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
     <TbWorldLongitude  className="input-icon" style={{color: '#4F4B7E',}} />
  </span>
  <input
      type="text"
      name="locationCoordinates"
      value={formData.locationCoordinates}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Latitude And Longitude"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.locationCoordinates && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div></div>

  </div>
)} 



{currentStep >= 5 && (
        <div className="fieldcontent p-0" ref={stepRefs[5]}>


<h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}>  Owner Details   </h4>             
  {/* Owner Name */}

<div className="form-group">
  {/* <label>Owner Name:</label> */}
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
 {fieldIcons.ownerName}    </span>
  <input
      type="text"
      name="ownerName"
      value={formData.ownerName}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Owner Name"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    /></div>
 
   {formData.ownerName && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div> </div>

  {/* Email */}
  <div className="form-group">
  {/* <label>Email:</label> */}
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
{fieldIcons.email}   </span>
  <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Email"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.email && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div> </div>
  {/* Phone Number */}

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
  {/* Alternate Number */}

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



  {/* Best Time to Call */}
  <div className="form-group" >
    <label style={{width:'100%'}}>
    {/* <label>Best Time To Call</label> */}

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
              {fieldIcons.bestTimeToCall || <FaHome />}
            </span>   <div style={{ flex: "1" }}>
          <select
            name="bestTimeToCall"
            value={formData.bestTimeToCall || ""}
            onChange={handleFieldChange}
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
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("bestTimeToCall")}
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
          
            {formData.bestTimeToCall || "Select Best Time To Call"}
 {formData.bestTimeToCall && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("bestTimeToCall")}
        </div>
      </div>
    </label>
  </div>
  </div>
 )} 




            {currentStep <= 5 && (

<div className="d-flex justify-content-center align-items-center">
  <style>
    {`
      // @keyframes transformText {
      //   0% {
      //     transform: translateX(-200px) skewX(30deg);
      //   }
      //   50% {
      //     transform: translateX(170px) skewX(30deg);
      //   }
      //   100% {
      //     transform: translateX(-200px) skewX(30deg);
      //   }
      // }

      @keyframes pulseIcon {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.15);
        }
        100% {
          transform: scale(1);
        }
      }
    `}
  </style>

  <div
    {...handlers}
    style={{
width: window.innerWidth < 450 ? '80%' : '70%' ,      height: '50px',
      borderRadius: '50px',
      background: swiped
        ? 'linear-gradient(to right, #CDC9F9,rgb(162, 154, 249))'
        : '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: swiped ? 'flex-end' : 'flex-start',
      padding: '5px',
      cursor: 'pointer',
      transition: 'all 0.4s ease-in-out',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
  <span className={`btn-shine ${swiped ? 'active' : ''}`}
  style={{ userSelect: 'none' }}>
  Swipe To Save & Continue
</span>

<style jsx>{`
  .btn-shine {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 12px 48px;
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
    background: linear-gradient(
      90deg,
      #4d4d4d 0%,
      #4d4d4d 40%,
      #ffffff 50%,
      #4d4d4d 60%,
      #4d4d4d 100%
    );
    background-size: 200% auto;
    color: #fff;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 2s linear infinite;
    text-decoration: none;
  }

 

@media (max-width: 450px) {
    .btn-shine {
      font-size: 13px;
}
      }
  @keyframes shine {
    0% {
          background-position: 100% center;

    }
    100% {
          background-position: -100% center;

    }
  }
`}</style>
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        height: '40px',
        width: '40px',
        borderRadius: '50%',
        backgroundColor: swiped ? '#fff' : '#4F4B7E',
        transition: 'all 0.4s ease-in-out',
        animation: swiped ? 'pulseIcon 1.5s infinite' : 'none',
      }}
    >
      <FaArrowRight
        style={{
          color: swiped ? '#1dd1a1' : '#fff',
          fontSize: '20px',
          margin: 'auto',
          transition: 'all 0.4s ease-in-out',
          animation: 'moveLeftRight 1s infinite',

        }}
      />
        <style jsx>{`
    @keyframes moveLeftRight {
      0% {
        transform: translateX(0);
        color: #ffffff;
      }
      50% {
        transform: translateX(8px);
        // color: rgb(20, 195, 90);
      }
      100% {
        transform: translateX(0);
        color: #ffffff;
      }
    }
  `}</style>

    </div>
  </div>
</div>
)}

  
              {/* Step 3: Submit all data */}
              {currentStep > 5 && (
                              <div className="w-100" ref={stepRefs[6]}>
    
                <Button className="w-100"
                  type="submit"
                  style={{ marginTop: '15px', backgroundColor: "#4F4B7E" , border:"#4F4B7E" }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#CDC9F9"; // Brighter neon on hover
                    e.target.style.fontWeight = 500; // Brighter neon on hover
                    e.target.style.transition = "background 0.3s ease"; // Brighter neon on hover
                    e.target.style.color = "#4F4B7E"; // Brighter neon on hover

                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#4F4B7E"; // Original orange
                    e.target.style.fontWeight = 400; // Brighter neon on hover
                    e.target.style.color = "#fff"; // Brighter neon on hover

                  }}
                  onClick={handlePreview}
                >
                  Pre View
                </Button>
                </div>
           )} 
{fieldErrors && Object.keys(fieldErrors).length > 0 && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}
    onClick={() => setFieldErrors({})}
  >
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "30px",
        maxWidth: "400px",
        width: "90%",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
        border: "2px solid #dc3545",
        position: "relative",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setFieldErrors({})}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "none",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
          color: "#666",
          padding: 0,
          width: "30px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ×
      </button>
      
      <strong style={{ fontSize: "16px", color: "#dc3545", display: "block", marginBottom: "15px" }}>
        Please complete required fields:
      </strong>
      
      <ul style={{ margin: 0, paddingLeft: "20px", color: "#dc3545" }}>
        {Object.entries(fieldErrors)
          .filter(([field]) => !shouldHideField(field))
          .map(([field, error]) => (
            <li key={field} style={{ marginBottom: "8px", fontSize: "14px" }}>
              {error}
            </li>
          ))}
      </ul>
      
      <button
        onClick={() => setFieldErrors({})}
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "10px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  </div>
)}

      </form>
      </div>
      ) :  (

<div  ref={previewRef} className="preview-section">
       
    <div className="mb-4">
          
           <div className="preview-section row d-flex align-items-center justify-content-center">
           {photos.length > 0 || videos.length > 0 ? (
             <Swiper navigation={{
              prevEl: ".swiper-button-prev-custom",
              nextEl: ".swiper-button-next-custom",
            }}  modules={[Navigation]} className="swiper-container">
               {photos.map((photo, index) => (
                 <SwiperSlide key={index}
                 className="d-flex justify-content-center align-items-center"
                 style={{
                   height: "200px",
                   width: "100%",
                   overflow: "hidden",
                   borderRadius: "8px",
                   margin: "auto",
                   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                   cursor: "pointer",
                 }}>
                   <img
                     src={URL.createObjectURL(photo)}
                     alt={`Preview ${index + 1}`}
                     className="preview-image"
                     style={{
                       height: "100%",
                       width: "100%",
                       objectFit: "cover",
                     }}
                   />
                 </SwiperSlide>
               ))}
               {videos.length > 0 && (
                 videos.map((video, index) => (
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
                   <video controls className="preview-video" style={{ width: "100%", height: "200px", objectFit: "cover" }}>
                     <source src={URL.createObjectURL(video)} type={video.type} />
                     Your browser does not support the video tag.
                   </video>
                   </div>
                 </SwiperSlide>
                 ))
               )}
             </Swiper>
           ) : (
             <p>No media uploaded.</p>
           )}
        <style>
          {`
            .swiper-button-next, .swiper-button-prev {
              color: white !important;
              font-size: 24px !important;
            }
              
          `}
        </style>
        <div className="row d-flex align-items-center w-100">
        <div className="d-flex col-12 justify-content-end">  
          <button className="swiper-button-prev-custom m-1 w-30" style={{background:"#4F4B7E", color:"#fff", border:"none"}}>❮</button>
          <button className="swiper-button-next-custom m-1 w-30"style={{background:"#4F4B7E", color:"#fff", border:"none"}}>❯</button>
        </div>
      </div>
      </div>
      </div>
      <div className="row w-100"
       style={{paddingLeft:"10px", paddingRight:"10px"}}
       >
      <p className="m-0" style={{
              color: "#4F4B7E",
              fontWeight: 'bold',
              fontSize: "26px"
            }}>
              <FaRupeeSign size={26} /> {formData.rentalAmount ? Number(formData.rentalAmount).toLocaleString('en-IN') : 'N/A'}
          
              <span style={{ fontSize: '14px', color: "#CDC9F9", marginLeft: "10px" }}>
                 Negotiation: {formData.negotiation || "N/A"}
              </span>
            </p>
  {isUploading && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999, // make sure it appears above everything else
    }}
  >
    <div
      style={{
        backgroundColor: 'white',
        padding: '20px 30px',
        borderRadius: '10px',
        color: 'blue',
        fontWeight: 'bold',
        fontSize: '18px',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
      }}
    >
      Please wait, processing your data...
    </div>
  </div>
)}

      
      {filteredDetailsList.map((detail, index) => {
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
        const isEmail = detail.label === "Email";  // Check if the label is "Email"
        const columnClass = isDescription || isEmail ? "col-12" : "col-6";  // Apply col-12 for both Description and Email
      
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
                {!isDescription && !isEmail && (
                  <span className="mb-1" style={{ fontSize: "12px", color: "grey" }}>
                    {detail.label || "N/A"}
                  </span>
                )}
                <p
                  className="mb-0 p-0"
                  style={{
                    fontSize: "14px",
                    color: "grey",
                    fontWeight: "600",
                    padding: "12px",
                    borderRadius: "5px",
                    width: "100%",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                    textAlign: "justify",
                  }}
                >
                  {detail.value || "N/A"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      </div>
  <div className="col-12"
          style={{paddingLeft:"10px" }}
  >
          <div style={{ textAlign: "start", marginTop: "50px", position: "relative" }}>
              {/* {isProcessing && (
                <div style={{ marginBottom: "10px",marginLeft:"95px", color: "#00e0c6", fontWeight: "bold" }}>
                  loading...
                </div>
              )}
              {isSuccess && !isProcessing && (
                <div style={{ marginBottom: "10px", marginLeft:"95px", color: "green", fontWeight: "bold" }}>
                  It's successfully
                </div>
              )} */}
    
              <style>
                {`
                  @keyframes moveBar {
                    0% { background-position: 0 0; }
                    100% { background-position: 40px 0; }
                  }
        
                  @keyframes slideUp {
                    0% {
                      transform: translateY(20px);
                      opacity: 0;
                    }
                    100% {
                      transform: translateY(0);
                      opacity: 1;
                    }
                  }
                `}
              </style>
            </div>
                 <div style={{ display: 'flex', gap: '20px' }}>
              <button
    // className="edit-button"
    onClick={handleEdit}
    style={{
      fontWeight:500,
      border:"2px solid #1882F6",
      padding: "12px 20px",
      fontSize: "16px",
      borderRadius: "25px",
      color: "#1882F6",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      width: "80px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "none",
      boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.3), 0 4px 6px rgba(0, 0, 0, 0.1)",
    }}
  >
    EDIT
   
  </button>
  
          <button className="submit-button"
          onClick={handleCombinedClick}
                disabled={isProcessing}
                          style={{
                  padding: "12px 20px",
                  fontSize: "16px",
                  borderRadius: "25px",
                   border: "none",
    background: 'linear-gradient(145deg, #4a90e2, #007bff)',
            color: "#ffffff",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  width: "150px",
                  height: "40px",
                    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.3), 0 4px 6px rgba(0, 0, 0, 0.1)',
                }}>
                     {isProcessing ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              overflow: "hidden",
              borderRadius: "25px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: `repeating-linear-gradient(
                  90deg,
                  rgba(0, 224, 198, 0.1) 0px,
                  rgba(0, 224, 198, 0.1) 6px,
                  rgba(0, 224, 198, 0.5) 6px,
                  rgba(0, 224, 198, 0.5) 12px
                )`,
                animation: "moveBar 1s linear infinite",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {showCheckmark ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',  // centers horizontally
          alignItems: 'center',      // centers vertically
          height: '100px'            // or any height you want to center within
        }}>
          <span style={{ animation: "slideUp 0.5s ease", fontSize: "20px" }}>
            <FaRegCircleCheck className="me-1"/> SUBMIT
          </span>
        </div>
            ) : (
              "SUBMIT"
            )}
          </div>
        )}
            <div className="shine-overlay"></div>
          </button>
  
          
        </div>
          {showConfirmation && (
  <div style={{    position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1509,
            animation: 'fadeIn 0.3s ease-in-out',}}>
    <div className="custom-popup"
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
      <h6 style={{ color: '#0B57CF', fontWeight: 500 }}>For instant Approval and Better Response, Pay Now</h6>
      <div className="d-flex justify-content-end gap-2 mt-4">
              <button className="btn btn-danger"   style={{
                  background: '#EAEAF6',
                  cursor: 'pointer',
                  border: 'none',
                  color: '#0B57CF',
                  borderRadius: '10px',
                  padding: '5px 10px',
                  fontWeight: 500,
                }} onClick={cancelStepSubmit}>Cancel</button>

            <button className="btn btn-success"  style={{
                  background: '#0B57CF',
                  cursor: 'pointer',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '10px',
                }} onClick={confirmStepSubmit}>Yes, Continue</button>

      </div>
    </div>
  </div>
)}
        <style>
          {`
            .submit-button,
            .edit-button {
              position: relative;
              border: none;
              border-radius: 12px;
              padding: 12px 24px;
              color: white;
              font-size: 18px;
              font-weight: bold;
              cursor: pointer;
              overflow: hidden;
            }
  
            .submit-button {
              background: linear-gradient(145deg, #4a90e2, #007bff);
              box-shadow: inset 0 0 0 1px rgba(255,255,255,0.3), 0 4px 6px rgba(0,0,0,0.1);
            }
  
            .edit-button {
              background: linear-gradient(145deg, #ffa94d, #ff7f0e);
              box-shadow: inset 0 0 0 1px rgba(255,255,255,0.3), 0 4px 6px rgba(0,0,0,0.1);
            }
  
            .shine-overlay {
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(
                120deg,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.5) 50%,
                rgba(255, 255, 255, 0) 100%
              );
              transform: skewX(-20deg);
              animation: shine 2s infinite;
              pointer-events: none;
            }
  
            @keyframes shine {
              from { left: -100%; }
              to { left: 100%; }
            }
          `}
        </style>
        </div>
      </div>
     
      )
    }
</div>
    </div>
    </div>
</motion.div>
  );
}

export default AddProperty;





















