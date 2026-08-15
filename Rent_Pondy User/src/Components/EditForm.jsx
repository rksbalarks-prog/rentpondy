import React, { useState, useEffect, useMemo, useRef } from "react";
import { getChennaiAreaPincodeMap, getDefaultCity } from "../utils/areaPincode";
import { getActiveBase } from "../utils/cityBase";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RiLayoutLine } from 'react-icons/ri';
import { TbArrowLeftRight, TbFileDescription, TbMapPinCode, TbToolsKitchen, TbWheelchair, TbWorldLongitude } from 'react-icons/tb';
import {FaChevronLeft , FaMoneyBillWave,  FaBath, FaChartArea, FaPhone ,FaEdit,FaRoad,FaDoorClosed,FaMapPin, FaHome, FaUserAlt, FaEnvelope,  FaRupeeSign , FaFileVideo , FaToilet,FaCar,FaBed,  FaCity , FaTimes, FaClock, FaMapMarkedAlt, FaExchangeAlt, FaCompass, FaHandshake, FaTag, FaPhoneAlt, FaSpinner} from 'react-icons/fa';
import {  FaLocationCrosshairs, FaRegAddressCard, FaRegCircleCheck } from 'react-icons/fa6';
import { MdLocationOn, MdOutlineMeetingRoom, MdOutlineOtherHouses, MdSchedule , MdStraighten , MdApproval, MdLocationCity , MdAddPhotoAlternate, MdKeyboardDoubleArrowDown, MdOutlineBathroom, MdDoorFront, MdOutlineClose} from "react-icons/md";
import { BsBank, BsBuildingsFill, BsFillHouseCheckFill , BsTextareaT} from "react-icons/bs";
import { GiKitchenScale, GiMoneyStack , GiResize , GiGears} from "react-icons/gi";
import { HiUserGroup } from "react-icons/hi";
import { BiBuildingHouse , BiMap, BiWorld} from "react-icons/bi";
import {   FaFileAlt, FaGlobeAmericas, FaMapMarkerAlt, FaMapSigns } from "react-icons/fa";
import {MdBalcony  , MdElevator ,MdOutlineChair ,MdPhone, MdOutlineAccessTime, MdTimer, MdHomeWork, MdHouseSiding, MdOutlineKitchen, MdEmail, } from "react-icons/md";
import {  BsBarChart, BsGraphUp } from "react-icons/bs";
import { BiBuilding, BiStreetView } from "react-icons/bi";
import { GiStairs, GiForkKnifeSpoon, GiWindow } from "react-icons/gi";
import { AiOutlineEye, AiOutlineColumnWidth, AiOutlineColumnHeight } from "react-icons/ai";
import { BiBed, BiBath, BiCar, BiCalendar, BiUser, BiCube } from "react-icons/bi";
import './AddProperty.css';
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import { IoCloseCircle } from "react-icons/io5";
import { GrSteps } from "react-icons/gr";
import moment from "moment";
import { toWords } from 'number-to-words';
import { FcSearch } from "react-icons/fc";
import { compressImage, applyImageWatermark, compressVideo } from '../utils/propertyUtils';

// icon

import propertyMode from '../Assets/prop_mode.PNG';
import propertyType from '../Assets/prop_type.PNG';
import price from '../Assets/amount.png';
import propertyAge from '../Assets/age.PNG';
import bankLoan from '../Assets/alt_mob.PNG';
import negotiation from '../Assets/nego.PNG';
import length from '../Assets/alt_mob.PNG';
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
// import {launchImageLibrary} from 'react-native-image-picker';

function EditForm() {
    const { rentId, phoneNumber } = useParams(); // ✅ get from URL

    const previewRef = useRef(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [priceInWords, setPriceInWords] = useState("");
        const [priceInWordss, setPriceInWordss] = useState("");
            const [totalAreaWords, setTotalAreawords] = useState("");
    const [selectedFiles, setSelectedFiles] = useState("");

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState("form");
    const [isPreview, setIsPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
      const [isSuccess, setIsSuccess] = useState(false);
      const [showCheckmark, setShowCheckmark] = useState(false);
    const [coordinateInput, setCoordinateInput] = useState('');
              const [videos, setVideos] = useState([]);

  const location = useLocation();
    const [currentStep, setCurrentStep] = useState(1);
        const [isScrolling, setIsScrolling] = useState(false);
      const [isUploading, setIsUploading] = useState(false);
      const [uploadProgress, setUploadProgress] = useState(0);
      const [isVideoCompressing, setIsVideoCompressing] = useState(false);
      const [videoCompressionProgress, setVideoCompressionProgress] = useState(0);
      const [videoCompressionStatus, setVideoCompressionStatus] = useState('');
      const [videoError, setVideoError] = useState('');
      const [isCompressing, setIsCompressing] = useState(false);
      const [compressionProgress, setCompressionProgress] = useState(0);
      const [compressionMessage, setCompressionMessage] = useState('');

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
    const swiperRef = useRef(null);

    const navigate = useNavigate();
      const inputRef = useRef(null);
      const latRef = useRef(null);
      const lngRef = useRef(null);
      const mapRef = useRef(null);
      const mapInstance = useRef(null);
      const markerRef = useRef(null);
        const coordRef = useRef(null);
    
      // const mapRef = useRef(null);
      // const inputRef = useRef(null);
      // const [mapLoaded, setMapLoaded] = useState(false);
      useEffect(() => {
        const recordDashboardView = async () => {
          try {
            await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
              phoneNumber: phoneNumber,
              viewedFile: "Edit Form",
              viewTime: new Date().toISOString(),
            });
          } catch (err) {
          }
        };
      
        if (phoneNumber) {
          recordDashboardView();
        }
      }, [phoneNumber]);
      // const [p
const [formData, setFormData] = useState({
    rentId: "",
    propertyMode: '',
    propertyType: '',
    propertyAge: '',
    bankLoan: '',
    negotiation: '',
    totalArea: '',
    ownership: '',
    bedrooms: '',
    kitchen: '',
    balconies: '',
    floorNo: '',
    areaUnit: '',
    propertyApproved: '',
    postedBy: '',
    facing: '',
    description: '',
    furnished: '',
    lift: '',
    attachedBathrooms: '',
    western: '',
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
    securityDeposit:"", // input
    availableDate:"",  //date
    familyMembers:"",
    foodHabit:"",
    jobType:"",
    petAllowed:"",
    rentType:"", 
    wheelChairAvailable:"",
    createdAt:"",
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
  const areaPincodeMap = useMemo(
    () => (getActiveBase() === 'CH' ? getChennaiAreaPincodeMap() : PONDY_AREA_PINCODE_MAP),
    []
  );

  // Cross-city guard. Shown if the loaded property's base disagrees with
  // the active city scope (PY user opened a CH record, or vice versa).
  const [crossCityBlock, setCrossCityBlock] = useState(null);

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
    if (isPreview || !window.google) return;
  
    const interval = setInterval(() => {
      if (mapRef.current && inputRef.current) {
        clearInterval(interval);
  
        mapRef.current.innerHTML = "";
  
        const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 11.9416, lng: 79.8083 },
          zoom: 10,
        });
  
        mapInstance.current = map;
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
                      locationCoordinates: `${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`, // ✅ Add this

            state: getComponent("administrative_area_level_1"),
            country: getComponent("country"),
            doorNumber: getComponent("street_number"),    }));
            
        });
      }
    }, 100);
  
    return () => clearInterval(interval);
  }, [isPreview]); // 👈 Re-run effect when preview mode changes
  

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
const [coordValue, setCoordValue] = useState('');


const handleLatLngAuto = (input) => {
  input = input.trim();

  // Match format like "11.7540° N, 79.7619° E"
  const match = input.match(/([-\d.]+)[^\dNS]*([NS]),\s*([-\d.]+)[^\dEW]*([EW])/i);

  if (!match) return;

  let lat = parseFloat(match[1]);
  let latDir = match[2].toUpperCase();
  let lng = parseFloat(match[3]);
  let lngDir = match[4].toUpperCase();

  if (latDir === "S") lat = -lat;
  if (lngDir === "W") lng = -lng;

  if (!isNaN(lat) && !isNaN(lng)) {
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
            doorNumber: getComponent("street_number"), // ✅ added here
          locationCoordinates: `${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`, // ✅ Add this

          }));
      }
    });
  }
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
  
          setFormData(prev => ({
            ...prev,
            rentalPropertyAddress: place.formatted_address,
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
            doorNumber: getComponent("street_number"),  }));
        } else {
          alert('Reverse geocoding failed: ' + status);
        }
      });
    } else {
      alert("Enter valid coordinates");
    }
  };
  

  const [photos, setPhotos] = useState([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [video, setVideo] = useState(null);

  // const handlePreview = () => {
  //   setIsPreview(!isPreview);
  // };
  const handlePreview = () => {
    // ✅ Define property types that require bedrooms and floor
    const requiredFieldsPropertyTypes = [
      'apartment', 'house', 'villa', 'farm house', 'hotel', 'resorts',
      'commercial building', 'guest house', 'godown', 'industrial building',
      'shed', 'others', 'space', 'bachelor room', 'shop / office',
      'function hall', 'p/g hostel', 'home stay', 'dormitory'
    ];

    const propertyTypeLC = formData.propertyType?.toLowerCase() || '';
    const isRequiredFieldsType = requiredFieldsPropertyTypes.includes(propertyTypeLC);

    // ✅ Check if bedrooms and floorNo are required and empty
    if (isRequiredFieldsType) {
      if (!formData.bedrooms || formData.bedrooms.trim() === '') {
        setMessage({ text: `Bedrooms field is required. Please fill this field.`, type: "error" });
        setTimeout(() => {
          const bedroomElement = document.querySelector('button[onclick*="bedrooms"]') || 
                                 document.querySelector('[data-field="bedrooms"]')?.parentElement;
          if (bedroomElement) {
            bedroomElement.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
        return;
      }

      if (!formData.floorNo || formData.floorNo.trim() === '') {
        setMessage({ text: `Floor No field is required. Please fill this field.`, type: "error" });
        setTimeout(() => {
          const floorElement = document.querySelector('[data-field="floorNo"]')?.parentElement;
          if (floorElement) {
            floorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
        return;
      }
    }

    // District is required (custom dropdown — no HTML5 `required` to rely on).
    if (!formData.district || String(formData.district).trim() === '') {
      setMessage({ text: `District field is required. Please fill this field.`, type: "error" });
      setTimeout(() => {
        const districtEl = document.querySelector('select[name="district"]')?.closest('.form-group');
        if (districtEl) districtEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      return;
    }

    // Check character limit for Property Description
    if (formData.description && formData.description.length > 200) {
      setMessage({ text: `Property description exceeds 200 characters. Current: ${formData.description.length} characters. Please reduce it before previewing.`, type: "error" });
      
      // Scroll to description field to show error message
      setTimeout(() => {
        const descriptionElement = document.querySelector('textarea[name="description"]');
        if (descriptionElement) {
          descriptionElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return;
    }

    // If validation passes, toggle preview and scroll
    setIsPreview(!isPreview);
    setIsPreviewOpen(true);
  
    // Scroll to the preview section
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };
  


      const [message, setMessage] = useState({ text: "", type: "" });
  
  
       // Auto-clear message after 3 seconds
        useEffect(() => {
          if (message.text) {
            const timer = setTimeout(() => {
              setMessage({ text: "", type: "" });
            }, 3000);
            return () => clearTimeout(timer);
          }
        }, [message]);
      

  
const formattedCreatedAt = Date.now
? moment(formData.createdAt).format("DD-MM-YYYY") 
: "N/A";


const formattedUpdatedAt = formData.updatedAt
  ? moment(formData.updatedAt).format("DD-MM-YYYY")
  : "N/A";


  
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-data?rentId=${rentId}`);
        const data = response.data.user;
        // Block the edit if a PY/CH user opened a record from the other
        // city — show a guard instead of populating the form.
        const activeScope = getActiveBase();
        const recordBase = data && data.base ? data.base : 'PY';
        if (recordBase !== activeScope) {
          setCrossCityBlock({ recordBase, activeScope });
          return;
        }
        setPhotos(
          Array.isArray(data.photos) 
            // ? data.photos.map(photo => (typeof photo === "string" ? photo : photo.photo)) 
            ? data.photos.map(photo => (typeof photo === "string" ? photo : photo.photoUrl)) 

            : []
        ); 
        setVideo(typeof data.video === "string" ? data.video : data.video?.url);

        // setVideo(data.video || null);
        setFormData({
          propertyMode: data.propertyMode || '',
          propertyType: data.propertyType || '',
          // rentalAmount: data.rentalAmount || '',
          propertyAge: data.propertyAge || '',
          bankLoan: data.bankLoan || '',
          negotiation: data.negotiation || '',
          totalArea: data.totalArea || '',
          ownership: data.ownership || '',
          bedrooms: data.bedrooms || '',
          kitchen: data.kitchen || '',
          balconies: data.balconies || '',
          floorNo: data.floorNo || '',
          areaUnit: data.areaUnit || '',
          propertyApproved: data.propertyApproved || '',
          postedBy: data.postedBy || '',
          facing: data.facing || '',
          description: data.description || '',
          furnished: data.furnished || '',
          lift: data.lift || '',
          attachedBathrooms: data.attachedBathrooms || '',
          western: data.western || '',
          carParking: data.carParking || '',
          rentalPropertyAddress: data.rentalPropertyAddress || '',
          country: data.country || 'India',
          state: data.state || '',
          city: data.city || '',
          district: data.district || '',
          area: data.area || '',
          streetName: data.streetName || '',
          doorNumber: data.doorNumber || '',
          nagar: data.nagar || '',
          pinCode:data.pinCode || '',
          ownerName: data.ownerName || '',
          alternatePhone: data.alternatePhone || '',
          email: data.email || '',
          bestTimeToCall: data.bestTimeToCall || '',
          locationCoordinates: data.locationCoordinates || '',
          rentalAmount: data.rentalAmount || '',
          securityDeposit: data.securityDeposit || '',
          availableDate: data.availableDate || '',
          foodHabit: data.foodHabit || '',
          familyMembers: data.familyMembers || '',
          jobType: data.jobType || '',
          petAllowed: data.petAllowed || '',
          rentType: data.rentType || '',
          wheelChairAvailable: data.wheelChairAvailable || '',
        });
        
        setPhotos(data.photos || []);
        setVideo(data.video || null);
      } catch (error) {
      }
    };
    if (rentId) {
      fetchPropertyData();

    }
  }, [rentId]);


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
    { icon: fieldIcons.propertyMode, label: "Property Mode", value:  formData.propertyMode},
    { icon: fieldIcons.propertyType, label: "Property Type", value: formData.propertyType },
    // { icon: <MdOutlineCurrencyRupee />, label: "Price", value: formData.price },
    // { icon: fieldIcons.email, label: "Length", value: formData.length },
    // // { icon: <RiLayoutLine />, label: "Total Area", value: formData.totalArea},
    { icon: fieldIcons.rentType, label: "Rent Type", value: formData.rentType },
           {
      icon: fieldIcons.totalArea,
      label: "Total Area",
      value: `${formData.totalArea} ${formData.areaUnit}`, // Combined value
    },
        { icon: fieldIcons.negotiation, label: "Negotiation", value: formData.negotiation },

    { icon: fieldIcons.securityDeposit, label: "Security Deposit ₹", value: formData.securityDeposit },


  
    { heading: true, label: "Property Features" }, // Heading 1

    // { icon: <BiRuler />, label: "Area Unit", value: formData.areaUnit },
    // { icon: fieldIcons.email, label: "Ownership", value: formData.ownership },
    // { icon: fieldIcons.email, label: "Property Approved", value: formData.propertyApproved },
    // { icon: fieldIcons.email, label: "Bank Loan", value: formData.bankLoan },


    { icon: fieldIcons.bedrooms, label: "Bedrooms", value: formData.bedrooms },

    { icon: fieldIcons.floorNo, label: "Floor No", value:formData.floorNo },
    { icon: fieldIcons.kitchen, label: "Kitchen", value: formData.kitchen},
    // { icon: <MdOutlineKitchen />, label: "Kitchen Type", value: formData.kitchenType },
    { icon: fieldIcons.balconies, label: "Balconies", value: formData.balconies},
    // { icon: fieldIcons.email, label: "Floors", value: formData.numberOfFloors },
{ label: "Western", value: formData.western, icon: fieldIcons.western},
{ label: "Attached", value: formData.attachedBathrooms, icon:fieldIcons.attachedBathrooms },
    { icon: fieldIcons.wheelChairAvailable, label: "Wheel Chair", value: formData.wheelChairAvailable },

    { icon: fieldIcons.carParking, label: "Car Park", value: formData.carParking },
    { icon: fieldIcons.lift, label: "Lift", value: formData.lift },
    // { heading: true, label: "Other details" }, // Heading 2

    { icon: fieldIcons.furnished, label: "Furnished", value: formData.furnished },
    { icon: fieldIcons.facing, label: "Facing", value: formData.facing },
    { icon: fieldIcons.propertyAge, label: "Property Age", value: formData.propertyAge },

    // { icon: fieldIcons.email, label: "Sale Mode", value: formData.salesMode },
    // { icon: fieldIcons.email, label: "Sales Type", value: formData.salesType },
    { icon: fieldIcons.postedBy, label: "Posted By", value:formData.postedBy},
    // { icon: <AiOutlineEye />, label: "No.Of.Views", value: "1200" },
    { icon: fieldIcons.availableDate, label: "Posted On", value:formattedCreatedAt },
          { icon: fieldIcons.availableDate, label: "Available From", value: formData.availableDate },

    { heading: true, label: "Property Description" }, // Heading 3
    { icon: fieldIcons.description, label: "Description" ,  value: formData.description },
      { heading: true, label: "Tenant Prefrences" }, // Heading 4

    { icon: fieldIcons.familyMembers, label: "No. of family Members", value: formData.familyMembers },
    { icon: fieldIcons.foodHabit, label: "Food Habit", value: formData.foodHabit },
    { icon: fieldIcons.jobType, label: "Job Type", value: formData.jobType },
    { icon: fieldIcons.petAllowed, label: "pet", value: formData.petAllowed },
    { heading: true, label: "Rental Property Address " }, // Heading 3

    // { icon: <BiMap />, label: "Location", value: "New York, USA" },
    { icon: fieldIcons.country, label: "Country", value: formData.country },
    { icon: fieldIcons.state, label: "State", value: formData.state },
    { icon: fieldIcons.district, label: "District", value:  formData.district},
    { icon: fieldIcons.city, label: "City", value: formData.city },
    { icon: fieldIcons.area, label: "Area", value: formData.area },
    
    { icon: fieldIcons.nagar, label: "Nagar", value: formData.nagar },
       { icon: fieldIcons.streetName, label: "Street Name", value: formData.streetName },
   
    { icon: fieldIcons.doorNumber, label: "Door Number", value: formData.doorNumber },
    { icon: fieldIcons.pinCode, label: "Pincode", value: formData.pinCode },
    { icon: fieldIcons.locationCoordinates, label: "lat. & lng.", value: formData.locationCoordinates },

    { heading: true, label: "Contact Info" }, // Heading 5
   
    { icon: fieldIcons.ownerName, label: "Owner Name", value: formData.ownerName },
    { icon: fieldIcons.email, label: "Email", value: formData.email },

    { icon: fieldIcons.phoneNumber, label: "Phone Number", value: phoneNumber },
    { icon: fieldIcons.alternatePhone, label: "Alternate Phone", value: formData.alternatePhone },

    { icon: fieldIcons.bestTimeToCall, label: "Best Time To Call", value: formData.bestTimeToCall },
 
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

  // Handle dropdown selection
  const handleDropdownSelect = (field, value) => {
    // ✅ Fields to set as "Not Applicable" for Land/Agricultural Land
    const notApplicableFields = [
      'bedrooms', 'floorNo', 'kitchen', 'balconies', 
      'attachedBathrooms', 'western', 'carParking', 'lift', 
      'furnished', 'wheelChairAvailable'
    ];

    const landPropertyTypes = ['plot', 'land', 'agricultural land'];

    setFormData((prevState) => {
      const updated = { ...prevState, [field]: value };

      // ✅ When propertyType changes to Land/Agri Land, set fields to "Not Applicable"
      if (field === "propertyType" && landPropertyTypes.includes(value?.toLowerCase())) {
        notApplicableFields.forEach(fieldName => {
          updated[fieldName] = 'Not Applicable';
        });
      }
      // ✅ When propertyType changes back to built-up property, clear those fields
      else if (field === "propertyType" && !landPropertyTypes.includes(value?.toLowerCase())) {
        notApplicableFields.forEach(fieldName => {
          updated[fieldName] = '';
        });
      }

      return updated;
    });
    
    setDropdownState({ activeDropdown: null, filterText: "" });
  };

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
    { code: '+82', country: 'South Korea' },
    { code: '+46', country: 'Sweden' },
    { code: '+31', country: 'Netherlands' },
    { code: '+41', country: 'Switzerland' },
    { code: '+32', country: 'Belgium' },
    { code: '+47', country: 'Norway' },
    { code: '+358', country: 'Finland' },
    { code: '+420', country: 'Czech Republic' },
    { code: '+48', country: 'Poland' },
    { code: '+30', country: 'Greece' },
    { code: '+351', country: 'Portugal' },
    { code: '+20', country: 'Egypt' },
    { code: '+27', country: 'South Africa' },
    { code: '+966', country: 'Saudi Arabia' },
    { code: '+971', country: 'UAE' },
    { code: '+90', country: 'Turkey' },
    { code: '+62', country: 'Indonesia' },
    { code: '+63', country: 'Philippines' },
    { code: '+64', country: 'New Zealand' },
    { code: '+856', country: 'Laos' },
    { code: '+66', country: 'Thailand' },
    { code: '+84', country: 'Vietnam' },
    { code: '+92', country: 'Pakistan' },
    { code: '+94', country: 'Sri Lanka' },
    { code: '+880', country: 'Bangladesh' },
    { code: '+972', country: 'Israel' },
    { code: '+56', country: 'Chile' },
    { code: '+54', country: 'Argentina' },
    { code: '+595', country: 'Paraguay' },
    { code: '+57', country: 'Colombia' },
    { code: '+505', country: 'Nicaragua' },
    { code: '+503', country: 'El Salvador' },
    { code: '+509', country: 'Haiti' },
    { code: '+213', country: 'Algeria' },
    { code: '+216', country: 'Tunisia' },
    { code: '+225', country: 'Ivory Coast' },
    { code: '+234', country: 'Nigeria' },
    { code: '+254', country: 'Kenya' },
    { code: '+255', country: 'Tanzania' },
    { code: '+256', country: 'Uganda' },
    { code: '+591', country: 'Bolivia' },
    { code: '+593', country: 'Ecuador' },
    { code: '+375', country: 'Belarus' },
    { code: '+373', country: 'Moldova' },
    { code: '+380', country: 'Ukraine' }
  ]);
 
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

  // const handlePhotoUpload = (e) => {
  //   setLoading(true);
  //   const files = Array.from(e.target.files);
  //   const maxSize = 10 * 1024 * 1024; // 10MB
  
  //   for (let file of files) {
  //     if (file.size > maxSize) {
  //       setMessage('File size exceeds the 10MB limit');
  //       setLoading(false);
  //       return;
  //     }
  //   }
  
  //   if (photos.length + files.length <= 15) {
  //     setPhotos([...photos, ...files]);
  //     setSelectedPhotoIndex(0);
  //   } else {
  //     setMessage('Maximum 15 photos can be uploaded.');
  //   }
  
  //   setTimeout(() => setLoading(false), 1500);
  // };
  
// const handlePhotoUpload = async (e) => {
//   setLoading(true);
//   const files = Array.from(e.target.files);
//   const maxSize = 50 * 1024 * 1024; // 10MB

//   for (let file of files) {
//     if (file.size > maxSize) {
//       setMessage('File size exceeds the 10MB limit');
//       setLoading(false);
//       return;
//     }
//   }

//   if (photos.length + files.length > 15) {
//     setMessage('Maximum 15 photos can be uploaded.');
//     return;
//   }
//  setLoading(true);
//   await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay

//    const watermarkedImages = await Promise.all(
//     files.map((file) => {
//       return new Promise((resolve) => {
//         const reader = new FileReader();

//         reader.onload = (event) => {
//           const img = new Image();
//           img.onload = () => {
//             const canvas = document.createElement("canvas");
//             const ctx = canvas.getContext("2d");

//             canvas.width = img.width;
//             canvas.height = img.height;

//             ctx.drawImage(img, 0, 0);

//             // Watermark settings
//             const watermarkText = "Rent Pondy";
//             const fontSize = Math.max(24, Math.floor(canvas.width / 15));
//             ctx.font = `bold ${fontSize}px Arial`;
//             ctx.textAlign = "center";
//             ctx.textBaseline = "middle";

//             const centerX = canvas.width / 2;
//             const centerY = canvas.height / 2;

//             // White outline
//             ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
//             ctx.lineWidth = 4;
//             ctx.strokeText(watermarkText, centerX, centerY);

//             // Black fill
//             ctx.fillStyle = "rgba(224, 223, 223, 0.9)";
//             ctx.fillText(watermarkText, centerX, centerY);

//             canvas.toBlob((blob) => {
//               const watermarkedFile = new File([blob], file.name, {
//                 type: file.type,
//               });
//               resolve(watermarkedFile);
//             }, file.type);
//           };

//           img.src = event.target.result;
//         };

//         reader.readAsDataURL(file);
//       });
//     })
//   );


//   setPhotos([...photos, ...watermarkedImages]);
//   setSelectedFiles(watermarkedImages);
//   setSelectedPhotoIndex(0);
//   setLoading(false);
// };

const handlePhotoUpload = async (e) => {
  console.log('📸 handlePhotoUpload triggered with files:', e.target.files.length);
  const files = Array.from(e.target.files);
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (files.length === 0) return;

  for (let file of files) {
    if (file.size > maxSize) {
      setMessage({ text: "File size exceeds the 10MB limit", type: "error" });
      e.target.value = ''; // Reset input
      return;
    }
  }

  if (photos.length + files.length > 15) {
    setMessage({ text: "Maximum 15 photos can be uploaded.", type: "error" });
    e.target.value = ''; // Reset input
    return;
  }

  setIsCompressing(true);
  setCompressionProgress(0);
  const totalFiles = files.length;
  let compressedImages = [];

  try {
    console.log('🔄 Starting compression of', totalFiles, 'images');
    for (let i = 0; i < files.length; i++) {
      setCompressionMessage(`Compressing image ${i + 1} of ${totalFiles}...`);
      // Show 0% progress for this image
      setCompressionProgress(Math.round((i / totalFiles) * 100));
      
      try {
        const compressed = await compressImage(files[i], 30);
        console.log(`✅ Image ${i + 1} compressed: ${files[i].size} → ${compressed.size} bytes`);
        compressedImages.push(compressed);
      } catch (err) {
        console.error(`❌ Failed to compress image ${i + 1}`, err);
        compressedImages.push(files[i]); // Fallback to original
      }
      
      // Show 100% progress for this image before moving to next
      setCompressionProgress(Math.round(((i + 1) / totalFiles) * 100));
      
      // Small delay to allow progress bar animation to be visible
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setCompressionMessage('Applying watermark...');
    setCompressionProgress(95); // Show 95% while watermarking
    
    const watermarkedImages = await Promise.all(
      compressedImages.map((file) => applyImageWatermark(file))
    );

    console.log('✨ All images watermarked and ready');
    setCompressionProgress(100); // Show 100% complete
    setCompressionMessage('All images compressed and ready!');
    setPhotos([...photos, ...watermarkedImages]);
    setSelectedFiles(watermarkedImages);
    setSelectedPhotoIndex(0);

    // Reset file input so same file can be uploaded again
    e.target.value = '';

    // Show completion message for longer so user can see progress
    setTimeout(() => {
      setIsCompressing(false);
      setCompressionProgress(0);
      setCompressionMessage('');
    }, 3000);
  } catch (err) {
    console.error('❌ Photo upload error:', err);
    setMessage({ text: 'Error processing photos. Please try again.', type: 'error' });
    setIsCompressing(false);
    e.target.value = ''; // Reset input on error
  }
};


  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
    if (index === selectedPhotoIndex) {
      setSelectedPhotoIndex(0);
    }
  };
  const fileInputRef = useRef(null);



const handleVideoChange = async (e) => {
  const selectedFiles = Array.from(e.target.files);
  const maxSize = 50 * 1024 * 1024; // 50MB
  const intimationSize = 10 * 1024 * 1024; // 10MB
  const validFiles = [];

  setVideoError(""); // reset previous error

  for (let file of selectedFiles) {
    // ⚡ Intimation if >10MB
    if (file.size > intimationSize && file.size <= maxSize) {
      alert(`${file.name} is above 10MB. Large files may take longer to upload.`);
    }

    // ❌ Reject if >50MB
    if (file.size > maxSize) {
      setVideoError(`${file.name} exceeds the 50MB size limit.`);
      continue;
    }

    // ✅ Compress to 200KB before pushing
    let compressedFile = file;
    try {
      setIsVideoCompressing(true);
      setVideoCompressionProgress(0);
      setVideoCompressionStatus(`Compressing ${file.name}...`);
      
      // Use propertyUtils compressVideo with progress callback
      compressedFile = await compressVideo(
        file,
        (progress) => setVideoCompressionProgress(progress),
        200 // Target 200KB
      );
      
      setVideoCompressionStatus(`Compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024).toFixed(0)}KB`);
    } catch (err) {
      console.warn("Compression failed, using original file", err);
      setVideoCompressionStatus(`Compression failed: ${err.message}`);
      setVideoError(`Failed to compress ${file.name}: ${err.message}`);
      compressedFile = file; // Use original as fallback
    } finally {
      setIsVideoCompressing(false);
      setTimeout(() => setVideoCompressionStatus(''), 2000);
    }

    validFiles.push(compressedFile);
  }

  if (!validFiles.length) return;

  const totalCount = videos.length + validFiles.length;
  if (totalCount > 5) {
    alert("You can upload a maximum of 5 videos.");
    return;
  }

  setVideos([...videos, ...validFiles]);
};
  

  const removeVideo = (indexToRemove) => {
  setVideos(prev => prev.filter((_, index) => index !== indexToRemove));
    fileInputRef.current.value = ''; // Reset the file input
  };

  const getMimeType = (filename) => {
  if (!filename || typeof filename !== "string" || !filename.includes(".")) {
    return "video/mp4"; // fallback
  }

  const ext = filename.split('.').pop().toLowerCase();

  switch (ext) {
    case 'mp4': return 'video/mp4';
    case 'webm': return 'video/webm';
    case 'ogg': return 'video/ogg';
    case 'mov': return 'video/quicktime';
    case 'avi': return 'video/x-msvideo';
    case 'mkv': return 'video/x-matroska';
    default: return 'video/mp4';
  }
};

const fileName = typeof video === 'string' ? video : video?.video;
const mimeType = getMimeType(fileName);

  const handlePhotoSelect = (index) => {
    setSelectedPhotoIndex(index);
  };

   const nonDropdownFields = ["rentalAmount", "securityDeposit", "totalArea", "availableDate","description","Your Property", "country", "city",  "area", "alternatePhone"];

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
 

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: name === "description" && value.length > 0 
          ? value.charAt(0).toUpperCase() + value.slice(1)  // Capitalize only "description"
          : value,
      };

      // ✅ Fields to set as "Not Applicable" for Land/Agricultural Land
      const notApplicableFields = [
        'bedrooms', 'floorNo', 'kitchen', 'balconies', 
        'attachedBathrooms', 'western', 'carParking', 'lift', 
        'furnished', 'wheelChairAvailable'
      ];

      const landPropertyTypes = ['plot', 'land', 'agricultural land'];

      // ✅ When switching to Land/Agri Land, set fields to "Not Applicable"
      if (name === "propertyType" && landPropertyTypes.includes(value?.toLowerCase())) {
        notApplicableFields.forEach(field => {
          updated[field] = 'Not Applicable';
        });
      }
      // ✅ When switching back to built-up property, clear those fields
      else if (name === "propertyType" && !landPropertyTypes.includes(value?.toLowerCase())) {
        notApplicableFields.forEach(field => {
          updated[field] = '';
        });
      }

      return updated;
    });

    // Handle price conversion
    if (name === "rentalAmount") {
      if (value !== "" && !isNaN(value)) {
        setPriceInWords(convertToIndianRupees(value));
      } else {
        setPriceInWords("");
      }
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

       const convertToWords = (num) => {
      const number = parseInt(num, 10);
      if (isNaN(number)) return "";
    
      if (number >= 10000000) {
        return (number / 10000000).toFixed(2).replace(/\.00$/, '') + " crores";
      } else if (number >= 100000) {
        return (number / 100000).toFixed(2).replace(/\.00$/, '') + " lakhs";
      } else {
        return toWords(number).replace(/\b\w/g, l => l.toUpperCase());
      }
    };
const handleCombinedClick = async (e) => {
  e.preventDefault(); // prevent default once here
  await handleAnim(); // Wait for the animation to complete
  handleSubmit(e);    // call submit function, passing the event
};

const hiddenPropertyTypes = ['Plot', 'Land', 'Agricultural land'].map(type => type.toLowerCase());

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

const shouldHideField = (fieldName) =>
  hiddenPropertyTypes.includes(formData.propertyType) &&
  fieldsToHideForPlot.includes(fieldName);

  const filteredDropdownFieldOrder = dropdownFieldOrder.filter(
  (field) => !shouldHideField(field)
);
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
  
  //   if (!rentId) {
  //     setMessage("PPC-ID is required. Please refresh or try again.");
  //     return;
  //   }
  
  //   const formDataToSend = new FormData();
  //   formDataToSend.append("rentId", rentId);
  
  //   Object.keys(formData).forEach((key) => {
  //     formDataToSend.append(key, formData[key]);
  //   });
  
  //   photos.forEach((photo) => {
  //     formDataToSend.append("photos", photo);
  //   });
  
  // videos.forEach(file => {
  //   formDataToSend.append("video", file); // ⬅️ matches backend field
  // });
  
  //   try {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_API_URL}/update-rent-property`,
  //       formDataToSend,
  //       { headers: { "Content-Type": "multipart/form-data" } }
  //     );
  
  //     setMessage(response.data.message);
  //     setTimeout(() => {
  //       navigate('/pondicherry');
  //     }, 2000);
  
  //   } catch (error) {
  //     setMessage("Error saving property data.");
  //   }
  // };
  
  

    // const fieldIcons = {
    //   // Contact Details
    //   phoneNumber: <MdPhone color="#4F4B7E" />,
    //   alternatePhone: <MdPhone color="#4F4B7E" />,
    //   email: <FaEnvelope  color="#4F4B7E" />,
    //   bestTimeToCall: <FaClock color="#4F4B7E" />, // Changed from MdSchedule
    
    //   // Property Location
    //   rentalPropertyAddress: <MdLocationOn color="#4F4B7E" />, // Changed from MdLocationCity
    //   country: <BiWorld color="#4F4B7E" />,
    //   state: <FaMapMarkerAlt color="#4F4B7E" />, // Changed from MdLocationCity
    //   city: <FaCity color="#4F4B7E" />,
    //   district: <FaMapMarkedAlt color="#4F4B7E" />, // Changed from FaRegAddressCard
    //   area: <MdLocationOn color="#4F4B7E" />,
    //   streetName: <FaRoad color="#4F4B7E" />, // Changed from RiLayoutLine
    //   doorNumber: <MdDoorFront color="#4F4B7E" />, // Changed from BiBuildingHouse
    //   nagar: <FaMapMarkedAlt color="#4F4B7E" />, // Changed from FaRegAddressCard
    
    //   // Ownership & Posting Info
    //   ownerName: <FaUserAlt color="#4F4B7E" />,
    //   postedBy: <FaUserAlt color="#4F4B7E" />,
    //   ownership: <HiUserGroup color="#4F4B7E" />,
    
    //   // Property Details
    //   propertyMode: <FaExchangeAlt color="#4F4B7E" />, // Changed from MdApproval
    //   propertyType: <MdOutlineOtherHouses color="#4F4B7E" />,
    //   propertyApproved: <BsFillHouseCheckFill color="#4F4B7E" />,
    //   propertyAge: <MdSchedule color="#4F4B7E" />,
    //   description: <BsTextareaT color="#4F4B7E" />,
    
    //   // Pricing & Financials
    //   price: <FaRupeeSign color="#4F4B7E" />,
    //   bankLoan: <BsBank color="#4F4B7E" />,
    //   negotiation: <GiMoneyStack color="#4F4B7E" />,
    
    //   // Measurements
    //   length: <MdStraighten color="#4F4B7E" />,
    //   totalArea: <GiResize color="#4F4B7E" />,
    //   areaUnit: <FaChartArea color="#4F4B7E" />,
    
    //   // Room & Floor Details
    //   bedrooms: <FaBed color="#4F4B7E" />,
    //   kitchen: <GiKitchenScale color="#4F4B7E" />,
    //   kitchenType: <GiKitchenScale color="#4F4B7E" />,
    //   balconies: <GiWindow color="#4F4B7E" />,
    //   floorNo: <GrSteps  color="#4F4B7E" />,
    //   numberOfFloors: <BsBuildingsFill color="#4F4B7E" />,
    //   attachedBathrooms: <FaBath color="#4F4B7E" />,
    //   western: <MdOutlineBathroom color="#4F4B7E" />, // Changed from FaToilet
    
    //   // Features & Amenities
    //   facing: <FaCompass color="#4F4B7E" />, // Changed from TbArrowLeftRight
    //   salesMode: <FaHandshake color="#4F4B7E" />, // Changed from GiGears
    //   salesType: <FaTag color="#4F4B7E" />, // Changed from MdOutlineOtherHouses
    //   furnished: <FaHome color="#4F4B7E" />,
    //   lift: <MdElevator color="#4F4B7E" />,
    //   carParking: <FaCar color="#4F4B7E" />,
    // };

    const handleSubmit = async (e) => {
  e.preventDefault();

  // Check character limit for Property Description
  if (formData.description && formData.description.length > 200) {
    setMessage({ text: `Property description exceeds 200 characters. Current: ${formData.description.length} characters. Please reduce it before proceeding.`, type: "error" });
    
    // Scroll to description field to show error message
    setTimeout(() => {
      const descriptionElement = document.querySelector('textarea[name="description"]');
      if (descriptionElement) {
        descriptionElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
    
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 8000);
    return;
  }

  if (!rentId) {
    setMessage({ text: "RENT-ID is required. Please refresh or try again.", type: "error" });
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
    formDataToSend.append("video", file); // ⬅️ matches backend field
  });

  try {
    setIsUploading(true); // ✅ Show loading message

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/update-rent-property`,
      formDataToSend,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setMessage({ text: response.data.message, type: "success" });

    // ✅ Send WhatsApp Property Update Notification
    try {
      console.log("🔍 Update Response:", response.data);
      const mobileNumber = String(phoneNumber).replace(/\D/g, "");
      const to = mobileNumber.length === 10 ? `91${mobileNumber}` : mobileNumber;

      console.log("📱 Sending WhatsApp to:", to);

      if (to.length >= 12) {
        const whatsappResponse = await axios.post(`${process.env.REACT_APP_API_URL}/queue-message`, {
          to,
          category: "edit-property",
          data: {
            rentId,
            ownerName: formData.ownerName,
            phone: phoneNumber,
            email: formData.email,
            propertyType: formData.propertyType,
            propertyMode: formData.propertyMode,
            rentalAmount: formData.rentalAmount,
            rentType: formData.rentType,
            bedrooms: formData.bedrooms,
            totalArea: formData.totalArea,
            areaUnit: formData.areaUnit,
            floorNo: formData.floorNo,
            city: formData.city,
            state: formData.state,
            pinCode: formData.pinCode,
            status: formData.displayStatus,
          },
        });
        console.log("✅ WhatsApp queued:", whatsappResponse.data);
      } else {
        console.log("⚠️ Invalid phone number:", to);
      }
    } catch (whatsErr) {
      console.error("⚠️ WhatsApp error:", whatsErr);
    }

    setTimeout(() => {
      navigate('/my-property');
    }, 2000);

  } catch (error) {
    setMessage({ text: "Error saving property data.", type: "error" });
    console.error("❌ Error updating property:", error);
  } finally {
    setIsUploading(false); // ✅ Hide loading message
  }
};



const fieldLabels = {
  propertyMode: "Property Mode",
  propertyType: "Property Type",
    rentType: "rent Type",
  rentalAmount: "rental Amount",
  propertyAge: "Property Age",
  bankLoan: "Bank Loan",
  negotiation: "Negotiation",
    securityDeposit: "security Deposit",
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
  balconies: "Balconies",
  floorNo: "Floor No.",
  areaUnit: "Area Unit",
  propertyApproved: "Property Approved",
  postedBy: "Posted By",
  facing: "Facing",
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
   handleDropdownSelect(field, option);
 
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
           </div>
         </div>
       )}
     </div>
   );
 };
const handleEdit = () => {
  setIsPreview(false);
};

const isReadOnly = false; // set true to make it readonly

  // City-scope guard. Shown before the form when the loaded property
  // doesn't belong to the active city scope.
  if (crossCityBlock) {
    const recordCity = crossCityBlock.recordBase === 'CH' ? 'Chennai' : 'Pondicherry';
    const myCity = crossCityBlock.activeScope === 'CH' ? 'Chennai' : 'Pondicherry';
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center shadow-sm" style={{ maxWidth: 520, margin: '40px auto', borderRadius: 12 }}>
          <h4 className="mb-3">Wrong city for this property</h4>
          <p className="mb-2">
            This property belongs to <strong>{recordCity}</strong>, but you
            are browsing <strong>{myCity}</strong>.
          </p>
          <p className="mb-3 text-muted" style={{ fontSize: 14 }}>
            Switch to {recordCity} from the city tabs at the top, then re-open it.
          </p>
          <button className="btn btn-primary" onClick={() => window.history.back()}>
            Go back
          </button>
        </div>
      </div>
    );
  }

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
     </button><h3 className="m-0" style={{fontSize:"18px"}}>EDIT PROPERTY</h3> </div>
 <div className="row w-100 mt-2">
<h4 style={{ color: "rgb(10, 10, 10)", fontWeight: "bold", marginBottom: "10px" }}>Property Management</h4>     

{message.text && (
  <div style={{ 
    padding: "10px", 
    backgroundColor: message.type === "success" ? "lightgreen" : "lightcoral", 
    color: "black", 
    margin: "10px 0",
    borderRadius: "5px"
  }}>
    {message.text}
  </div>
)}


 {!isPreview ? (

     <form onSubmit={handleSubmit} style={{ fontFamily: "Inter, sans-serif"}} >
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

                <div className="form-group photo-upload-container mt-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    name="photos"
                    id="photo-upload"
                    className="photo-upload-input"
                    style={{ display: 'none' }} // Hide the input field
                  />
                  <label htmlFor="photo-upload" className="photo-upload-label fw-normal m-0">
                  {loading ? (
          <FaSpinner className="spinner" style={{ fontSize: "30px", color: "#2e86e4" }} />
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
        {loading ? "Uploading..." : "Upload Your Property Images max-15"}
                  </label>
                </div>

                {/* Compression Progress Bar - Inline Style for Images */}
                {isCompressing && (
                  <div style={{
                    width: '100%',
                    padding: '20px',
                    backgroundColor: '#f0f4f8',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #d0dce6'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '12px',
                      backgroundColor: '#cbd5e0',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        height: '100%',
                        backgroundColor: '#4F4B7E',
                        width: `${compressionProgress}%`,
                        transition: 'width 0.3s ease',
                      }}></div>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <p style={{
                        margin: '0',
                        color: '#4F4B7E',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        {compressionMessage}
                      </p>
                      <p style={{
                        margin: '0',
                        color: '#4F4B7E',
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}>
                        {compressionProgress}%
                      </p>
                    </div>
                  </div>
                )}

       {photos.length > 0 && (
  <div className="uploaded-photos">
    <h4>Uploaded Photos</h4>
    <div className="uploaded-photos-grid">
      {photos.map((photo, index) => {
        let photoUrl = "";

        if (photo instanceof File || photo instanceof Blob) {
          photoUrl = URL.createObjectURL(photo);
        } else if (typeof photo === "string") {
          // photoUrl = photo; // Direct URL from the backend
          photoUrl = `https://rentpondy.com/PPC/${photo}`;

        } else {
          return null;
        }

        return (
          <div key={index} className="uploaded-photo-item  position-relative">
            <input
              type="radio"
              name="selectedPhoto"
              className="position-absolute"
              style={{ top: '-10px' }}
        checked={selectedPhotoIndex === index}
              onChange={() => handlePhotoSelect(index)}
            />
            <img
              src={photoUrl}
              alt="Uploaded"
              className="uploaded-photo m-2"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            <button    style={{border:"none"}}
            className="position-absolute top-0 end-0 btn m-0 p-1"
onClick={() => removePhoto(index)}>
                    <IoCloseCircle size={20} color="#F22952"/>
            </button>
          </div>
        );
      })}
    </div>
  </div>
)}

        <h4 style={{ color: "#4F4B7E", fontWeight: "bold", marginBottom: "10px" }}>Property Video</h4>
             <div className="form-group ">
          <input
            type="file"
            name="video"
            accept="video/*"
            id="videoUpload"
            onChange={handleVideoChange}
            className="d-none"
            ref={fileInputRef} // Assign the ref to the input element

          />
          <label htmlFor="videoUpload" className="file-upload-label fw-normal">
            <span className=" pt-5">
              <FaFileVideo
                style={{
                  color: 'white',
                  backgroundColor: '#2e86e4',
                  padding: '5px',
                  fontSize: '30px',
                  marginRight: '5px',
                }}
              />
              Upload Property Video upto 200KB
            </span>
          </label>

          {/* Orange Progress Bar for Video Compression */}
          {isVideoCompressing && (
            <div style={{ 
              backgroundColor: "#fff3e0", 
              padding: "15px", 
              borderRadius: "10px", 
              marginTop: "10px",
              marginBottom: "10px"
            }}>
              <div style={{ marginBottom: "5px", color: "#ff9800", fontWeight: "bold" }}>
                🎬 {videoCompressionStatus || `Compressing... ${videoCompressionProgress}%`}
              </div>
              <div style={{ 
                width: "100%", 
                height: "10px", 
                backgroundColor: "#ffe0b2", 
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
            </div>
          )}

          {/* Display video error */}
          {videoError && (
            <div style={{ 
              backgroundColor: "#ffebee", 
              padding: "10px", 
              borderRadius: "5px", 
              color: "#c62828", 
              marginTop: "10px",
              marginBottom: "10px"
            }}>
              ⚠️ {videoError}
            </div>
          )}

          {/* Display the selected video */}
 {videos.length > 0 && (
         <div className="selected-video-container mt-3">
           <h4 className="text-start">Selected Videos:</h4>
           <div className="d-flex flex-wrap gap-3">
             {videos.map((video, index) => (
               <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                 <video width="200" height="200" controls>
                   <source  src={video instanceof File ? URL.createObjectURL(video) : video}
               type={video instanceof File ? video.type : "video/mp4"} />
                   Your browser does not support the video tag.
                 </video>
                 <Button
                   onClick={() => removeVideo(index)}
                   style={{ border: 'none', background: 'transparent' }}
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

{/* {currentStep >= 1 && ( */}
        <div>
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
 onClick={() => {
              if (!isReadOnly) toggleDropdown("propertyMode");
            }}                  
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
           onClick={() => {
              if (!isReadOnly) toggleDropdown("propertyType");
            }}                     
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
            position: "relative",border:"none",
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
        type="number"
        name="rentalAmount"
        value={formData.rentalAmount}
        onChange={handleFieldChange}
        className="form-input m-0"
        placeholder="Rental Amount"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
      />
    </div>
    {formData.rentalAmount && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
  </div>

  {priceInWords && (
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
      placeholder="security Deposit"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.securityDeposit && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div>
  {setPriceInWordss && (
    <p style={{ fontSize: "14px", color: "#4F4B7E", marginTop: "5px" }}>
      {priceInWordss}
    </p>
  )}
  </div>

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


        <div className="fieldcontent p-0">
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

    {/* floorNo */}
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
              textAlign: "left",
              color: "grey",
            position: "relative",border:"none",
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
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",border:"none",
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
    {/* <label>availableDate <span style={{ color: 'red' }}>* </span> </label> */}

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


        <div className="fieldcontent p-0" >
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
      placeholder="What Makes Your Property Unique (Maximum 200 Characters)"
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
  

        <div className="fieldcontent p-0">


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
  placeholder="Enter lat & lng eg.(11.9416° N, 79.8083° E)"
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

{/* <div className="form-group">
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
                {fieldIcons.district || <FaHome />}<sup style={{ color: 'red' }}>*</sup>
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
                border:"none",
                padding: "12px",
                background: "#fff",
                borderRadius: "5px",
                width: "100%",
                textAlign: "left",
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
</div></div>

  {/* area */}
  <div className="form-group">
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
    alignItems: "stretch",
    width: "100%",
    position: 'relative'
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
 {fieldIcons.area}  <sup style={{ color: 'red' }}>*</sup></span>
  <input
      type="text"
      name="area"
      value={formData.area}
      onChange={handleAreaInputChange}
      disabled={isReadOnly}
      className="form-input m-0"
      placeholder="Area"
      autoComplete="off"
      style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none', color:"grey"}}
    />
    {showAreaSuggestions && (
      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          maxHeight: '250px',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          marginTop: '4px'
        }}
      >
        {areaSuggestions.map((suggestion, index) => (
          <div
            key={index}
            onClick={() => handleAreaSelect(suggestion)}
            style={{
              padding: '10px 14px',
              cursor: 'pointer',
              borderBottom: '1px solid #f0f0f0',
              backgroundColor: '#fff',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
          >
            {suggestion}
          </div>
        ))}
      </div>
    )}
  </div>
   {formData.area && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div></div>
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
  </span>
  <input
      type="text"
      name="pinCode"
      value={formData.pinCode}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Pincode"
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
      placeholder="latitude and longitude"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.locationCoordinates && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
</div></div>

  </div>



        <div className="fieldcontent p-0" >


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
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "grey",
            position: "relative",border:"none",
                        boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',   
}}
          >
          
            {formData.bestTimeToCall || "Select bestTimeToCall"}
 {formData.bestTimeToCall && (
            <GoCheckCircleFill style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "green" }} />
          )}          </button>

          {renderDropdown("bestTimeToCall")}
        </div>
      </div>
    </label>
  </div>
  </div>

      <Button
                  type="submit"
                  style={{ marginTop: '15px', backgroundColor: "#4F4B7E", width:"100%" }}
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


      </form>

    ) : (
      
        <div ref={previewRef} className="preview-section w-100 d-flex flex-column align-items-center justify-content-center">
         <div className="mb-4">
              <div style={{width:"400px"}}>
  
              
             {(photos.length > 0 || video) ? (
    <Swiper navigation={{
      prevEl: ".swiper-button-prev-custom",
      nextEl: ".swiper-button-next-custom",
    }} 
    ref={swiperRef}
    modules={[Navigation]} className="swiper-container">
      {photos.map((photo, index) => {
        let photoUrl = "";
  
        // Check if the photo is a valid File or Blob
        if (photo instanceof File || photo instanceof Blob) {
          photoUrl = URL.createObjectURL(photo);
        } else if (typeof photo === "string") {
          // photoUrl = photo; // Direct URL from the backend
          photoUrl = `https://rentpondy.com/PPC/${photo}`;
  
        } else {
          return null; // Skip rendering if the format is invalid
        }
  
        return (
          <SwiperSlide key={index} className="d-flex justify-content-center align-items-center"
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
            <img
              src={photoUrl}
              alt={`Preview ${index + 1}`}
              className="preview-image"
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
            />
          </SwiperSlide>
        );
      })}
  
     {Array.isArray(videos) && videos.length > 0 && (
       <>
         <h4 className="text-start mt-3">Selected Videos:</h4>
         <Swiper slidesPerView={1} spaceBetween={20}>
           {videos.map((videoItem, index) => {
             let src = "";
             let type = "video/mp4";
     
             if (videoItem instanceof File) {
               src = URL.createObjectURL(videoItem);
               type = videoItem.type || "video/mp4";
             } else if (typeof videoItem === "string") {
               src = `https://rentpondy.com/PPC/${videoItem}`;
               type = getMimeType(videoItem);
             }
     
             if (!src) return null;


             

     
             return (
               <SwiperSlide key={index}>
                 <div style={{ position: "relative" }}>
                   <video
                     controls
                     style={{
                       width: "100%",
                       height: "200px",
                       objectFit: "cover",
                       borderRadius: "8px",
                       boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                     }}
                   >
                     <source src={src} type={type} />
                     Your browser does not support the video tag.
                   </video>
                 </div>
               </SwiperSlide>
             );
           })}
         </Swiper>
       </>
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
<div className="row w-100">

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
      {priceInWords && (
            <p style={{ fontSize: "14px", color: "#4F4B7E", marginTop: "5px" }}>
              {priceInWords}
            </p>
)}
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

// const isDescription = typeof detail.value === "string" && detail.value.trim() === formData.description.trim();
// const columnClass = isDescription ? "col-12" : "col-6";
const columnClass = isDescription ? "col-12" : "col-6";

// Check if this is an address field that should allow full text wrapping
const isAddressField = ["Country", "State", "City", "District", "Nagar", "Area", "Street Name", "Door Number", "pinCode", "location Coordinates"].includes(detail.label);

return (
  <div key={index} className={columnClass}>
    <div
      className="d-flex align-items-center border-0 rounded p-1 mb-1"
      style={{
        // backgroundColor: "#F9F9F9", // Background for the item
        width: "100%",
        height: isDescription || isAddressField ? "auto" : "55px",
        wordBreak: "break-word",
        // height: detail.label === "Description" || detail.value === formData.description ? "auto" : "100px", // Full height for description
      }}
    >
      <span className="me-3 fs-3" style={{ color: "#4F4B7E" }}>
        {detail.icon} 
      </span>
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {!isDescription && <span className="mb-1" style={{fontSize:"12px", color:"grey"}}>{detail.label || "N/A"}</span>}  {/* ✅ Hide label for description */}

      {/* <h6 className="mb-1">{isDescription ? "Description" : detail.label || "N/A"}</h6> */}
        <p
          className="mb-0 p-0"
          style={{
            fontSize:"14px",
            color:"grey",
            fontWeight:"600",
            padding: "10px",
            borderRadius: "5px",
            width: "100%",
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
{detail.value || "N/A"}        </p>
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
              disabled={isProcessing || isVideoCompressing}
                        style={{
                padding: "12px 20px",
                fontSize: "16px",
                borderRadius: "25px",
                 border: "none",
  background: 'linear-gradient(145deg, #4a90e2, #007bff)',
          color: "#ffffff",
                cursor: isProcessing || isVideoCompressing ? "not-allowed" : "pointer",
                opacity: isProcessing || isVideoCompressing ? 0.6 : 1,
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
      )}

    </div>
    </div>
  </div>
  </motion.div>
  );
}

export default EditForm;





