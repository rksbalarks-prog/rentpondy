


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { MdAddPhotoAlternate, MdStraighten } from "react-icons/md";
// import { FaFileVideo } from "react-icons/fa";
// import { Button } from "react-bootstrap";
// import { useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import { FaTimes } from 'react-icons/fa';
// import { FaRupeeSign } from 'react-icons/fa';
// import { MdLocationOn , MdApproval, MdLocationCity, MdOutlineBedroomParent, MdOutlineDescription } from 'react-icons/md';
// import { BsBank } from 'react-icons/bs';
// import { RiLayoutLine } from 'react-icons/ri';
// import { TbArrowLeftRight } from 'react-icons/tb';
// import {FaCouch,FaHandshake,FaTag,FaLocationArrow,FaCalendarAlt,FaArrowUp,FaShower,FaToilet,FaCar,FaCheckCircle,FaUtensils,FaBed, FaMoneyBill,FaPhone, FaRegBuilding, FaCity } from 'react-icons/fa';
// import { FaBuilding , FaHome, FaMapSigns, FaMapMarkerAlt, FaVectorSquare, FaRoad, FaDoorClosed, FaMapPin, FaUserAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

// import { BiWorld} from "react-icons/bi";
// import './AddProperty.css';


// import { FaBath, FaChartArea, } from 'react-icons/fa';
// import { FaKitchenSet } from 'react-icons/fa6';
// import { BsBuildingsFill } from 'react-icons/bs';
// import { GiHouse, GiGears, GiResize } from 'react-icons/gi';
// import { FaClock, FaRegAddressCard } from 'react-icons/fa6';
// import moment from "moment";

// function EditProperty() {
//   const location = useLocation();
//   const { rentId, phoneNumber } = location.state || {};

//   const [formData, setFormData] = useState({
//     phoneNumber: "",
//     rentalPropertyAddress: "",
//     state: "",
//     city: "",
//     district: "",
//     area: "",
//     streetName: "",
//     doorNumber: "",
//     nagar: "",
//     ownerName: "",
//     email: "",
//     alternatePhone: "",
//     countryCode: "+91", // Default value
//     propertyMode: "",
//     propertyType: "",
//     bankLoan: "",
//     negotiation: "",
//     ownership: "",
//     bedrooms: "",
//     kitchen: "",
//     kitchenType: "",
//     balconies: "",
//     floorNo: "",
//     areaUnit: "",
//     propertyApproved: "",
//     propertyAge: "",
//     postedBy: "",
//     facing: "",
//     salesMode: "",
//     salesType: "",
//     furnished: "",
//     lift: "",
//     attachedBathrooms: "",
//     western: "",
//     numberOfFloors: "",
//     carParking: "",
//     bestTimeToCall: "",
//     price:"",
//     length:"",
//     breadth:"",
//     totalArea:"",
//   });

//   const [photos, setPhotos] = useState([]);
//   const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
//   const [video, setVideo] = useState(null);



//   const [countryCodes, setCountryCodes] = useState([
//     { code: "+1", country: "USA/Canada" },
//     { code: "+44", country: "UK" },
//     { code: "+91", country: "India" },
//     { code: "+61", country: "Australia" },
//     { code: "+81", country: "Japan" },
//     { code: "+49", country: "Germany" },
//     { code: "+33", country: "France" },
//     { code: "+34", country: "Spain" },
//     { code: "+55", country: "Brazil" },
//     { code: "+52", country: "Mexico" },
//     { code: "+86", country: "China" },
//     { code: "+39", country: "Italy" },
//     { code: "+7", country: "Russia/Kazakhstan" },
//   ]);
//   const [dropdownState, setDropdownState] = useState({
//       activeDropdown: null,
//       filterText: "",
//     });
  
//     // Toggle dropdown visibility
//     const toggleDropdown = (field) => {
//       setDropdownState((prevState) => ({
//         activeDropdown: prevState.activeDropdown === field ? null : field,
//         filterText: "",
//       }));
//     };
  
//     // Handle dropdown selection
//     const handleDropdownSelect = (field, value) => {
//       setFormData((prevState) => ({ ...prevState, [field]: value }));
//       setDropdownState({ activeDropdown: null, filterText: "" });
//     };
  
//     // Handle filter input change for dropdown
//     const handleFilterChange = (e) => {
//       setDropdownState((prevState) => ({ ...prevState, filterText: e.target.value }));
//     };
//   const [dataList, setDataList] = useState({});

//   // Fetch property data by rentId
//   useEffect(() => {
//     if (!rentId) return;  // Prevent fetching if rentId is not available

//     const fetchPropertyData = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-data?rentId=${rentId}`);
//         const data = response.data.user;

//         setFormData({
//           phoneNumber: data.phoneNumber || "",
//           rentalPropertyAddress: data.rentalPropertyAddress || "",
//           state: data.state || "",
//           city: data.city || "",
//           district: data.district || "",
//           price:data.price || "",
//           area: data.area || "",
//           streetName: data.streetName || "",
//           doorNumber: data.doorNumber || "",
//           nagar: data.nagar || "",
//           ownerName: data.ownerName || "",
//           email: data.email || "",
//           alternatePhone: data.alternatePhone || "",
//           countryCode: data.countryCode || "+91",
//           propertyMode: data.propertyMode || "",
//           propertyType: data.propertyType || "",
//           bankLoan: data.bankLoan || "",
//           negotiation: data.negotiation || "",
//           ownership: data.ownership || "",
//           bedrooms: data.bedrooms || "",
//           kitchen: data.kitchen || "",
//           kitchenType: data.kitchenType || "",
//           balconies: data.balconies || "",
//           floorNo: data.floorNo || "",
//           areaUnit: data.areaUnit || "",
//           propertyApproved: data.propertyApproved || "",
//           propertyAge: data.propertyAge || "",
//           postedBy: data.postedBy || "",
//           facing: data.facing || "",
//           salesMode: data.salesMode || "",
//           salesType: data.salesType || "",
//           furnished: data.furnished || "",
//           lift: data.lift || "",
//           attachedBathrooms: data.attachedBathrooms || "",
//           western: data.western || "",
//           numberOfFloors: data.numberOfFloors || "",
//           carParking: data.carParking || "",
//           bestTimeToCall: data.bestTimeToCall || "",
//           length:data.length || "",
//           breadth:data.breadth || "",
//           totalArea:data.totalArea || "",
//         });

//       } catch (error) {
//         toast.error('Failed to fetch property details');
//       }
//     };

//     fetchPropertyData();
//   }, [rentId]);

//   // Fetch dropdown data for select fields
//   useEffect(() => {
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

//     fetchDropdownData();
//   }, []);

//   // Handle field changes for form data
//   const handleFieldChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };
//   const handleVideoChange = (e) => {
//     const file = e.target.files[0];
//     const maxSize = 50 * 1024 * 1024; // 50MB
//     if (file.size > maxSize) {
//       alert('File size exceeds the 50MB limit');
//       return;
//     }
//     setVideo(file);
//   };
//   const removeVideo = () => {
//     setVideo(null);
//   };
 
  
//   const handlePhotoUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const maxSize = 10 * 1024 * 1024; 
//     for (let file of files) {
//       if (file.size > maxSize) {
//         alert('File size exceeds the 10MB limit');
//         return;
//       }
//     }
//     if (photos.length + files.length <= 15) {
//       setPhotos([...photos, ...files]);
//       setSelectedPhotoIndex(0); 
//     } else {
//       alert('Maximum 15 photos can be uploaded.');
//     }
//   };

//   const removePhoto = (index) => {
//     setPhotos(photos.filter((_, i) => i !== index));
//     if (index === selectedPhotoIndex) {
//       setSelectedPhotoIndex(0); 
//     }
//   };

  
//   const handlePhotoSelect = (index) => {
//     setSelectedPhotoIndex(index); 
//   };


//   // Revoke object URLs when component unmounts or photos change
//   useEffect(() => {
//     return () => {
//       photos.forEach((photo) => {
//         if (photo instanceof Blob) {
//           URL.revokeObjectURL(photo);
//         }
//       });
//     };
//   }, [photos]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!rentId) {
//       alert("PPC-ID is required. Please refresh or try again.");
//       return;
//     }

//     const formDataToSend = new FormData();
//     formDataToSend.append("rentId", rentId);

//     Object.keys(formData).forEach((key) => {
//       formDataToSend.append(key, formData[key]);
//     });

//     photos.forEach((photo) => {
//       formDataToSend.append("photos", photo);
//     });

//     if (video) {
//       formDataToSend.append("video", video);
//     }

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/update-property`,
//         formDataToSend,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       alert(response.data.message);
//     } catch (error) {
//     }
//   };
//      const fieldIcons = {
//         phoneNumber: <FaPhone color="#4F4B7E" />,
//         rentalPropertyAddress: <MdLocationCity color="#4F4B7E" />,
//         state: <MdLocationCity color="#4F4B7E" />,
//         city: <FaCity color="#4F4B7E" />,
//         district: <RiLayoutLine color="#4F4B7E" />,
//         area: <FaCity color="#4F4B7E" />,
//         streetName: <RiLayoutLine color="#4F4B7E" />,
//         doorNumber: <FaRegBuilding color="#4F4B7E" />,
//         nagar: <FaRegAddressCard color="#4F4B7E" />,
//         ownerName: <FaRegBuilding color="#4F4B7E" />,
//         email: <FaEnvelope color="#4F4B7E" />,
//         alternatePhone: <FaPhone color="#4F4B7E" />,
//         propertyMode: <MdApproval color="#4F4B7E" />,
//         propertyType: <FaRegBuilding color="#4F4B7E" />,
//         bankLoan: <BsBank color="#4F4B7E" />,
//         negotiation: <FaRupeeSign color="#4F4B7E" />,
//         ownership: <FaUserAlt color="#4F4B7E" />,
//         bedrooms: <FaBed color="#4F4B7E" />,
//         kitchen: <FaKitchenSet color="#4F4B7E" />,
//         kitchenType: <FaKitchenSet color="#4F4B7E" />,
//         balconies: <FaRegBuilding color="#4F4B7E" />,
//         floorNo: <BsBuildingsFill color="#4F4B7E" />,
//         areaUnit: <FaChartArea color="#4F4B7E" />,
//         propertyApproved: <FaCheckCircle color="#4F4B7E" />,
//         propertyAge: <FaCalendarAlt color="#4F4B7E" />,
//         postedBy: <FaRegBuilding color="#4F4B7E" />,
//         facing: <GiHouse color="#4F4B7E" />,
//         salesMode: <GiGears color="#4F4B7E" />,
//         salesType: <FaRegBuilding color="#4F4B7E" />,
//         furnished: <FaHome color="#4F4B7E" />,
//         lift: <FaRegBuilding color="#4F4B7E" />,
//         attachedBathrooms: <FaBath color="#4F4B7E" />,
//         western: <FaBath color="#4F4B7E" />,
//         numberOfFloors: <BsBuildingsFill color="#4F4B7E" />,
//         carParking: <FaCar color="#4F4B7E" />,
//         bestTimeToCall: <FaClock color="#4F4B7E" />,
//         length: <MdStraighten color="#4F4B7E" />,
//           breadth: <MdStraighten color="#4F4B7E" />,
//           totalArea: <GiResize color="#4F4B7E" />,
//       };

//       const fieldLabels = {
//         propertyMode: "Property Mode",
//         propertyType: "Property Type",
//         price: "Price",
//         propertyAge: "Property Age",
//         bankLoan: "Bank Loan",
//         negotiation: "Negotiation",
//         length: "Length",
//         breadth: "Breadth",
//         totalArea: "Total Area",
//         ownership: "Ownership",
//         bedrooms: "Bedrooms",
//         kitchen: "Kitchen",
//         kitchenType: "Kitchen Type",
//         balconies: "Balconies",
//         floorNo: "Floor No.",
//         areaUnit: "Area Unit",
//         propertyApproved: "Property Approved",
//         postedBy: "Posted By",
//         facing: "Facing",
//         salesMode: "Sales Mode",
//         salesType: "Sales Type",
//         description: "Description",
//         furnished: "Furnished",
//         lift: "Lift",
//         attachedBathrooms: "Attached Bathrooms",
//         western: "Western Toilet",
//         numberOfFloors: "Number of Floors",
//         carParking: "Car Parking",
//         rentalPropertyAddress: "Property Address",
//         country: "Country",
//         state: "State",
//         city: "City",
//         district: "District",
//         area: "Area",
//         streetName: "Street Name",
//         doorNumber: "Door Number",
//         nagar: "Nagar",
//         ownerName: "Owner Name",
//         email: "Email",
//         phoneNumber: "Phone Number",
//         phoneNumberCountryCode: "Phone Country Code",
//         alternatePhone: "Alternate Phone",
//         alternatePhoneCountryCode: "Alternate Phone Country Code",
//         bestTimeToCall: "Best Time to Call",
//       };
      
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
//               backgroundColor: '#fff',
//               width: '100%',
//               maxWidth: '400px',
//               padding: '10px',
//               zIndex: 10,
//               boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//               borderRadius: '8px',
//               overflowY: 'auto',
//               maxHeight: '50vh',
//               animation: 'popupOpen 0.3s ease-in-out',
//             }}
//           >
//                         <div
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
//                   marginBottom: '10px',
//                 }}
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
//               {filteredOptions.map((option, index) => (
//                 <li
//                   key={index}
//                   onClick={() => {
//                     setFormData((prevState) => ({
//                       ...prevState,
//                       [field]: option,
//                     }));
//                     toggleDropdown(field);
//                   }}
//                   style={{
//                     padding: '5px',
//                     cursor: 'pointer',
//                     backgroundColor: '#f9f9f9',
//                     marginBottom: '5px',
//                   }}
//                 >
//                   {option}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )
//       );
//     };
//   return (
//     <div className="d-flex align-items-center justify-content-center">
//     <div style={{
//       width: '100%',
//       maxWidth: '450px',
//       minWidth: '300px',
//       padding: '5px',
//       borderRadius: '8px',
//       margin: '0 5px',
//     }} 
//     >
//       <h1>Edit Property</h1>

//        <form  onSubmit={handleSubmit} className="addForm w-100">
//         <p className="p-3" style={{ color: "white", backgroundColor: "rgb(47,116,127)" }}>PPC-ID: {rentId}</p>


     

// <div className="form-group photo-upload-container mt-2">
//   <input
//     type="file"
//     multiple
//     accept="image/*"
//     onChange={handlePhotoUpload}
//     name="photos"
//     id="photo-upload"
//     className="photo-upload-input"
//     style={{ display: 'none' }} // Hide the input field
//   />
//   <label htmlFor="photo-upload" className="photo-upload-label fw-normal m-0">
//     <MdAddPhotoAlternate
//       style={{
//         color: 'white',
//         backgroundColor: '#2e86e4',
//         padding: '5px',
//         fontSize: '30px',
//         borderRadius: '50%',
//         marginRight: '5px',
//       }}
//     />
//     Upload Your Property Images
//   </label>
// </div>

//         {photos.length > 0 && (
//           <div className="uploaded-photos">
//             <h4>Uploaded Photos</h4>
//             <div className="uploaded-photos-grid">
//               {photos.map((photo, index) => (
//                 <div key={index} className="uploaded-photo-item">
//                   <input
//                     type="radio"
//                     name="selectedPhoto"
//                     className="me-1"
//                     checked={selectedPhotoIndex === index}
//                     onChange={() => handlePhotoSelect(index)}
//                   />
//                   <img
//                     src={URL.createObjectURL(photo)}
//                     alt="Uploaded"
//                     className="uploaded-photo mb-3"
//                   />
//                   <button
//                     className="remove-photo-btn"
//                     onClick={() => removePhoto(index)}
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

// <h4 style={{ color: "rgb(47,116,127)", fontWeight: "bold", marginBottom: "10px" }}> Property Video  </h4>
//         {/* Video Upload Section */}
//         <div className="form-group">
//           <input
//             type="file"
//             name="video"
//             accept="video/*"
//             id="videoUpload"
//             onChange={handleVideoChange}
//             className="d-none"
//           />
//           <label htmlFor="videoUpload" className="file-upload-label fw-normal">
//             <span className=" pt-5">
//               <FaFileVideo
//                 style={{
//                   color: 'white',
//                   backgroundColor: '#2e86e4',
//                   padding: '5px',
//                   fontSize: '30px',
//                   marginRight: '5px',
//                 }}
//               />
//               Upload Property Video
//             </span>
//           </label>

//           {/* Display the selected video */}
//           {video && (
//   <div className="selected-video-container">
//     <h4 className="text-start">Selected Video:</h4>
//     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//       <video width="200" controls>
//         <source src={URL.createObjectURL(video)} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//       <Button
//         variant="danger"
//         // onClick={() => setVideo(null)}
//         // style={{ height: '40px' }}
//         onClick={removeVideo}
//         style={{ height: '40px' }}
//       >
//         Remove
//       </Button>
//     </div>
//   </div>
// )}
// </div>



//   {/* Property Mode */}
//   <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>Property Mode</label>

//       <div style={{ display: "flex", alignItems: "center", width:"100%" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="propertyMode"
//             value={formData.propertyMode || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
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


//   <div className="form-group">
//     <label style={{ width: '100%'}}>
// <label>Property Type</label>
//       <div style={{ display: "flex", alignItems: "center"}}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="propertyType"
//             value={formData.propertyType || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select property Type</option>
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
//             {formData.propertyType || "Select Property Type"}
//           </button>

//           {renderDropdown("propertyType")}
//         </div>
//       </div>
//     </label>
//   </div>
//   {/* Price */}
 
//   <div className="form-group">
//   <label>Price:</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
//     <FaRupeeSign className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
//     <input
//       type="tel"
//       name="price"
//       value={formData.price}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder="price"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
//   </div>




//   {/* Negotiation */}

//   <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>Negotiation </label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="negotiation"
//             value={formData.negotiation || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select negotiation</option>
//             {dataList.negotiation?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("negotiation")}
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
//               {fieldIcons.negotiation || <FaHome />}
//             </span>
//             {formData.negotiation || "Selectnegotiation"}
//           </button>

//           {renderDropdown("negotiation")}
//         </div>
//       </div>
//     </label>
//   </div>

//   {/* Length */} 
//   <div className="form-group">
//   <label>length:</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
//     <MdStraighten className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
//     <input
//       type="text"
//       name="length"
//       value={formData.length}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder="length"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
// </div>
//   {/* Breadth */}
//   <div className="form-group">
//   <label>breadth:</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
//     <MdStraighten className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
//     <input
//       type="text"
//       name="breadth"
//       value={formData.breadth}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder="breadth"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>


//   </div>
//   {/* Total Area */}
//   <div className="form-group">
//   <label>Total Area:</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
//     <GiResize className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
//     <input
//       type="text"
//       name="totalArea"
//       value={formData.totalArea}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder="totalArea"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
//   </div>

//     {/* areaUnit */}
//     <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>area Unit </label>

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
//   </div>

//   {/* Ownership */}
//   <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>Ownership </label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="ownership"
//             value={formData.ownership || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select ownership</option>
//             {dataList.ownership?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("ownership")}
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
//               {fieldIcons.ownership || <FaHome />}
//             </span>
//             {formData.ownership || "Select ownership"}
//           </button>

//           {renderDropdown("ownership")}
//         </div>
//       </div>
//     </label>
//   </div>



//   {/* Bedrooms */}

// <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>bedrooms </label>

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
//   {/* kitchen */}
//   <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>kitchen </label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="kitchen"
//             value={formData.kitchen || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select kitchen</option>
//             {dataList.kitchen?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("kitchen")}
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
//               {fieldIcons.kitchen || <FaHome />}
//             </span>
//             {formData.kitchen || "Select kitchen"}
//           </button>

//           {renderDropdown("kitchen")}
//         </div>
//       </div>
//     </label>
//   </div>
//     {/* kitchenType */}
//     <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>kitchenType </label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="kitchenType"
//             value={formData.kitchenType || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select kitchenType</option>
//             {dataList.kitchenType?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("kitchenType")}
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
//               {fieldIcons.kitchenType || <FaHome />}
//             </span>
//             {formData.kitchenType || "Select kitchenType"}
//           </button>

//           {renderDropdown("kitchenType")}
//         </div>
//       </div>
//     </label>
//   </div>
//     {/* balconies */}
//     <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>balconies </label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="balconies"
//             value={formData.balconies || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select balconies</option>
//             {dataList.balconies?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("balconies")}
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
//               {fieldIcons.balconies || <FaHome />}
//             </span>
//             {formData.balconies || "Select balconies"}
//           </button>

//           {renderDropdown("balconies")}
//         </div>
//       </div>
//     </label>
//   </div>
//     {/* floorNo */}
//     <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>floorNo </label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
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
//               {fieldIcons.floorNo || <FaHome />}
//             </span>
//             {formData.floorNo || "Select floorNo"}
//           </button>

//           {renderDropdown("floorNo")}
//         </div>
//       </div>
//     </label>
//   </div>
  

//     {/* propertyApproved */}

//     <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>property Approved</label>

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
//   </div>

//   {/* Property Age */}
//   <div className="form-group">
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
//   </div>

//   {/* Bank Loan */}

//   <div className="form-group">
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
//   </div>

  
//     {/* facing */}
//     <div className="form-group">

//     <label style={{ width: '100%'}}>
//     <label>facing</label>

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
//     {/* salesMode */}

//     <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>sales Mode</label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="salesMode"
//             value={formData.salesMode || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select salesMode</option>
//             {dataList.salesMode?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("salesMode")}
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
//               {fieldIcons.salesMode || <FaHome />}
//             </span>
//             {formData.salesMode || "Select salesMode"}
//           </button>

//           {renderDropdown("salesMode")}
//         </div>
//       </div>
//     </label>
//   </div>
//     {/* salesType */}
//     <div className="form-group">
//     <label style={{ width: '100%'}}>
//       <label>Sale Type</label>
//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="salesType"
//             value={formData.salesType || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select salesType</option>
//             {dataList.salesType?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("salesType")}
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
//               {fieldIcons.salesType || <FaHome />}
//             </span>
//             {formData.salesType || "Select salesType"}
//           </button>

//           {renderDropdown("salesType")}
//         </div>
//       </div>
//     </label>
//   </div>

//   {/* postedBy */}
//   <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>postedBy</label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="postedBy"
//             value={formData.postedBy || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select postedBy</option>
//             {dataList.postedBy?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("postedBy")}
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
//               {fieldIcons.postedBy || <FaHome />}
//             </span>
//             {formData.postedBy || "Select postedBy"}
//           </button>

//           {renderDropdown("postedBy")}
//         </div>
//       </div>
//     </label>
//   </div>
//   {/* Description */}
//   <div className="form-group">
//     <label>Description:</label>
//     <textarea name="description" onChange={handleFieldChange} className="form-control" placeholder="Enter Description"></textarea>
//   </div>

//   {/* furnished */}
//   <div className="form-group">
//     <label style={{width:"100%"}}>
//     <label>furnished</label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="furnished"
//             value={formData.furnished || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select furnished</option>
//             {dataList.furnished?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("furnished")}
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
//               {fieldIcons.furnished || <FaHome />}
//             </span>
//             {formData.furnished || "Select furnished"}
//           </button>

//           {renderDropdown("furnished")}
//         </div>
//       </div>
//     </label>
//   </div>
//     {/*lift */}
//     <div className="form-group">
//     <label style={{ width: '100%'}}>
//       <label>lift</label>
//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="lift"
//             value={formData.lift || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select lift</option>
//             {dataList.lift?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("lift")}
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
//               {fieldIcons.lift || <FaHome />}
//             </span>
//             {formData.lift || "Select lift"}
//           </button>

//           {renderDropdown("lift")}
//         </div>
//       </div>
//     </label>
//   </div>

//       {/*attachedBathrooms */}
//       <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>attached Bathrooms</label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="attachedBathrooms"
//             value={formData.attachedBathrooms || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select attachedBathrooms</option>
//             {dataList.attachedBathrooms?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("attachedBathrooms")}
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
//               {fieldIcons.attachedBathrooms || <FaHome />}
//             </span>
//             {formData.attachedBathrooms || "Select attachedBathrooms"}
//           </button>

//           {renderDropdown("attachedBathrooms")}
//         </div>
//       </div>
//     </label>
//   </div>
//     {/* western */}
//     <div className="form-group">

//     <label style={{ width: '100%'}}>
//     <label>western</label>

//       <div style={{ display: "flex", alignItems: "center"}}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="western"
//             value={formData.western || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select western</option>
//             {dataList.western?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("western")}
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
//               {fieldIcons.western || <FaHome />}
//             </span>
//             {formData.western || "Select western"}
//           </button>

//           {renderDropdown("western")}
//         </div>
//       </div>
//     </label>
//   </div>
//     {/* numberOfFloors */}
//     <div className="form-group">

//     <label style={{ width: '100%'}}>
//     <label>number Of Floors</label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="numberOfFloors"
//             value={formData.numberOfFloors || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select numberOfFloors</option>
//             {dataList.numberOfFloors?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("numberOfFloors")}
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
//               {fieldIcons.numberOfFloors || <FaHome />}
//             </span>
//             {formData.numberOfFloors || "Select numberOfFloors"}
//           </button>

//           {renderDropdown("numberOfFloors")}
//         </div>
//       </div>
//     </label>
//   </div>
//     {/* carParking */}

//     <div className="form-group">
//     <label style={{ width: '100%'}}>
//     <label>car Parking</label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="carParking"
//             value={formData.carParking || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select carParking</option>
//             {dataList.carParking?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("carParking")}
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
//               {fieldIcons.carParking || <FaHome />}
//             </span>
//             {formData.carParking || "Select carParking"}
//           </button>

//           {renderDropdown("carParking")}
//         </div>
//       </div>
//     </label>
//   </div>


//   {/*   rentalPropertyAddress */}
//   <div className="form-group">
// <label>Property Address:</label>

// <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border: '1px solid #4F4B7E', background:"#fff"}}>
//     <FaHome className="input-icon" 
//     style={{color: '#4F4B7E', marginLeft:"10px"}} />
//     <input
//       type="text"
//       name="rentalPropertyAddress"
//       value={formData.rentalPropertyAddress}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder=" Property Address"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
// </div>


//   {/* country */}

//   <div className="form-group">
//   <label>country:</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
//     <BiWorld className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
//     <input
//       type="text"
//       name="country"
//       value={formData.country}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder="country"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
//   </div>
  
//   {/* State */}

// <div className="form-group">
//   <label>State:</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
//     <MdLocationCity className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
//     <input
//       type="text"
//       name="state"
//       value={formData.state}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder="State"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
// </div>
//   {/* City */}

// <div className="form-group">
//   <label>City:</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
//     <FaCity className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
//     <input
//       type="text"
//       name="city"
//       value={formData.city}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder="City"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
// </div>

//   {/* district */}
//   <div className="form-group">
//   <label>District:</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
//     <FaRegAddressCard className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
//     <input
//       type="text"
//       name="district"
//       value={formData.district}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder="District"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
// </div>
//   {/* area */}
//   <div className="form-group">
//   <label>Area:</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
//     <MdLocationOn className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
//     <input
//       type="text"
//       name="area"
//       value={formData.area}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder="Area"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
// </div>
//   {/* streetName */}
//   <div className="form-group">
//   <label>Street Name:</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
//     <FaRoad className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
//     <input
//       type="text"
//       name="streetName"
//       value={formData.streetName}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder="Street Name"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
// </div>
//   {/* doorNumber */}
//   <div className="form-group">
//   <label>Door Number:</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
//     <FaDoorClosed className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
//     <input
//       type="text"
//       name="doorNumber"
//       value={formData.doorNumber}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder="Door Number"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
//   </div>

//   {/* Nagar */}
//   <div className="form-group">
//   <label>Nagar:</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
//     <FaMapPin className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
//     <input
//       type="text"
//       name="nagar"
//       value={formData.nagar}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder="Nagar"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
// </div>
//   {/* Owner Name */}

  

// <div className="form-group">
//   <label>Owner Name:</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
//     <FaUserAlt className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
//     <input
//       type="text"
//       name="ownerName"
//       value={formData.ownerName}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder="Owner Name"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
// </div>

//   {/* Email */}
//   <div className="form-group">
//   <label>Email:</label>
//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
//     <FaEnvelope className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
//     <input
//       type="email"
//       name="email"
//       value={formData.email}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder="Email"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
// </div>
//   {/* Phone Number */}

// <div className="form-group">
// <label>Phone Number:</label>

//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
//     <FaPhone className="input-icon" style={{ color: '#4F4B7E', marginLeft:"10px" }} />
    
//     <div style={{ flex: '0 0 10%' }}>
//       <label>
//         <select
//           name="countryCode"
//           value={formData.countryCode || ""}
//           onChange={handleFieldChange}
//           className="form-control m-0"
//           style={{ width: '100%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//         >
//           <option value="">Select Country Code</option>
//           {countryCodes.map((item, index) => (
//             <option key={index} value={item.code}>
//               {item.code} - {item.country}
//             </option>
//           ))}
//         </select>
//       </label>
//     </div>

//     <input
//       type="text"
//       name="phoneNumber"
//       value={formData.phoneNumber}
//       readOnly
//       className="form-input m-0"
//       placeholder="Phone Number"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
// </div>
//   {/* Alternate Number */}

// <div className="form-group">
// <label>Alternate number:</label>

//   <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
//     <FaPhone className="input-icon" style={{ color: '#4F4B7E', marginLeft:"10px" }} />
    
//     <div style={{ flex: '0 1 10%' }}>
//       <label>
//         <select
//           name="countryCode"
//           value={formData.countryCode || ""}
//           onChange={handleFieldChange}
//           className="form-control m-0"
//           style={{ width: '100%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//         >
//           <option value="">Select Country Code</option>
//           {countryCodes.map((item, index) => (
//             <option key={index} value={item.code}>
//               {item.code} - {item.country}
//             </option>
//           ))}
//         </select>
//       </label>
//     </div>

//     <input
//       type="tel"
//       name="alternatePhone"
//       value={formData.alternatePhone}
//       onChange={handleFieldChange}
//       className="form-input m-0"
//       placeholder="Alternate Phone Number"
//       style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
//     />
//   </div>
// </div>

//   {/* Best Time to Call */}
//   <div className="form-group" >
//     <label style={{width:'100%'}}>
//     <label>best Time To Call</label>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ flex: "1" }}>
//           <select
//             name="bestTimeToCall"
//             value={formData.bestTimeToCall || ""}
//             onChange={handleFieldChange}
//             className="form-control"
//             style={{ display: "none" }} // Hide the default <select> dropdown
//           >
//             <option value="">Select bestTimeToCall</option>
//             {dataList.bestTimeToCall?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>

//           <button
//             className="m-0"
//             type="button"
//             onClick={() => toggleDropdown("bestTimeToCall")}
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
//               {fieldIcons.bestTimeToCall || <FaHome />}
//             </span>
//             {formData.bestTimeToCall || "Select bestTimeToCall"}
//           </button>

//           {renderDropdown("bestTimeToCall")}
//         </div>
//       </div>
//     </label>
//   </div>


//                 <Button
//                   type="submit"
//                   style={{ marginTop: '15px', backgroundColor: "rgb(47,116,127)", border:"none" }}
//                 >
//                   update property
//                 </Button>
       
//       </form>
//     </div>
//     </div>
//   );
// }

// export default EditProperty;
















import React, { useState, useEffect, useMemo, useRef } from "react";
import { getChennaiAreaPincodeMap, getDefaultCity } from "../utils/areaPincode";
import { getActiveBase } from "../utils/cityBase";
import axios from "axios";
import { MdAddPhotoAlternate, MdOutlineClose, MdStraighten } from "react-icons/md";
import { FaFileVideo } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTimes } from 'react-icons/fa';
import { FaRupeeSign } from 'react-icons/fa';
import { MdLocationOn , MdApproval, MdLocationCity, MdOutlineBedroomParent, MdOutlineDescription } from 'react-icons/md';
import { BsBank } from 'react-icons/bs';
import { RiLayoutLine } from 'react-icons/ri';
import { TbArrowLeftRight, TbWorldLongitude } from 'react-icons/tb';
import {FaCouch,FaHandshake,FaTag,FaLocationArrow,FaCalendarAlt,FaArrowUp,FaShower,FaToilet,FaCar,FaCheckCircle,FaUtensils,FaBed, FaMoneyBill,FaPhone, FaRegBuilding, FaCity } from 'react-icons/fa';
import { FaBuilding , FaHome, FaMapSigns, FaMapMarkerAlt, FaVectorSquare, FaRoad, FaDoorClosed, FaMapPin, FaUserAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { TbMapPinCode } from "react-icons/tb";

import { BiWorld} from "react-icons/bi";
import './AddProperty.css';


import { FaBath, FaChartArea, } from 'react-icons/fa';
import { FaKitchenSet } from 'react-icons/fa6';
import { BsBuildingsFill } from 'react-icons/bs';
import { GiHouse, GiGears, GiResize } from 'react-icons/gi';
import { FaClock, FaRegAddressCard } from 'react-icons/fa6';
import moment from "moment";
import { useSelector } from "react-redux";
import { FcSearch } from "react-icons/fc";
import { toWords } from 'number-to-words';
import { compressImage, applyImageWatermark } from '../utils/propertyUtils';

function EditProperty() {
  const location = useLocation();
  const { rentId, phoneNumber } = location.state || {};
     const inputRef = useRef(null);
          const latRef = useRef(null);
          const lngRef = useRef(null);
          const mapRef = useRef(null);
          const mapInstance = useRef(null);
          const markerRef = useRef(null);
                            const coordRef = useRef(null);
          
           const [priceInWords, setPriceInWords] = useState("");

  const [formData, setFormData] = useState({
    phoneNumber: "",
    rentalPropertyAddress: "",
    state: "",
    city: getDefaultCity(),
    district: "",
    area: "",
    streetName: "",
    doorNumber: "",
    nagar: "",
    ownerName: "",
    email: "",
    alternatePhone: "",
    countryCode: "+91", // Default value
    propertyMode: "",
    propertyType: "",
    bankLoan: "",
    negotiation: "",
    ownership: "",
    bedrooms: "",
    kitchen: "",
    kitchenType: "",
    balconies: "",
    floorNo: "",
    areaUnit: "",
    description:"",
    propertyApproved: "",
    propertyAge: "",
    postedBy: "",
    facing: "",
    salesMode: "",
    salesType: "",
    furnished: "",
    lift: "",
    attachedBathrooms: "",
    western: "",
    numberOfFloors: "",
    carParking: "",
    bestTimeToCall: "",
    rentalAmount:"",
    callForRent: false,
    length:"",
    breadth:"",
    totalArea:"",
    pinCode: "",
locationCoordinates:""
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
    "Shanmugapuram": "605009",
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

  // Cross-city guard: PY user opening a CH record (or vice versa).
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

  const [photos, setPhotos] = useState([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [video, setVideo] = useState(null);
  const [coordinateInput, setCoordinateInput] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressionMessage, setCompressionMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  // Auto-clear message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (!window.google) return;

    const defaultCenter = { lat: 11.9416, lng: 79.8083 };

    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
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
        const component = place.address_components?.find(c => c.types.includes(type));
        return component?.long_name || '';
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
    });
  }, []);

  const updateMap = (lat, lng) => {
    const location = new window.google.maps.LatLng(lat, lng);
    mapInstance.current.setCenter(location);
    mapInstance.current.setZoom(15);

    if (markerRef.current) markerRef.current.setMap(null);

    markerRef.current = new window.google.maps.Marker({
      map: mapInstance.current,
      position: location,
    });
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
            city: getComponent("locality") || getComponent("administrative_area_level_3"),
            area: getComponent("sublocality") || getComponent("sublocality_level_1"),
            streetName: getComponent("route") || getComponent("premise"),
            district: getComponent("administrative_area_level_2"),
            state: getComponent("administrative_area_level_1"),
            country: getComponent("country"),
            doorNumber: getComponent("street_number"), // ✅ added here
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
  
//   const handleLatLngAuto = (e) => {
//     const input = e.target.value.trim();
  
//     // Match format like "11.7540° N, 79.7619° E"
//     const match = input.match(/([-\d.]+)[^\dNS]*([NS]),\s*([-\d.]+)[^\dEW]*([EW])/i);
  
//     if (!match) return; // Don't alert, just wait for correct format
  
//     let lat = parseFloat(match[1]);
//     let latDir = match[2].toUpperCase();
//     let lng = parseFloat(match[3]);
//     let lngDir = match[4].toUpperCase();
  
//     if (latDir === "S") lat = -lat;
//     if (lngDir === "W") lng = -lng;
  
//     if (!isNaN(lat) && !isNaN(lng)) {
//       updateMap(lat, lng);
  
//       const geocoder = new window.google.maps.Geocoder();
//       const latlng = { lat, lng };
  
//       geocoder.geocode({ location: latlng }, (results, status) => {
//         if (status === "OK" && results[0]) {
//           const place = results[0];
  
//           const getComponent = (type) => {
//             const comp = place.address_components.find(c => c.types.includes(type));
//             return comp?.long_name || '';
//           };
  
//           setFormData(prev => ({
//             ...prev,
//             rentalPropertyAddress: place.formatted_address || '',
//             latitude: lat,
//             longitude: lng,
//             pinCode: getComponent("postal_code"),
//             city: getComponent("sublocality_level_1"),
//             area: getComponent("sublocality_level_2"),
//             nagar: getComponent("sublocality"),
//             streetName: getComponent("route") || getComponent("premise"),
//             district: getComponent("administrative_area_level_2") || getComponent("locality"),
//             state: getComponent("administrative_area_level_1"),
//             country: getComponent("country"),
//             doorNumber: getComponent("street_number"),
//                    locationCoordinates: `${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`, // ✅ Add this
//  }));
//         }
//       });
//     }
//   };
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
          rentalPropertyAddress: place.formatted_address || '',
          latitude: lat,
          longitude: lng,
          pinCode: getComponent("postal_code"),
          city: getComponent("sublocality_level_1"),
          area: getComponent("sublocality_level_2"),
          nagar: getComponent("sublocality"),
          streetName: getComponent("route") || getComponent("premise"),
          district: getComponent("administrative_area_level_2") || getComponent("locality"),
          state: getComponent("administrative_area_level_1"),
          country: getComponent("country"),
          doorNumber: getComponent("street_number"),
          locationCoordinates: `${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`,
        }));
      }
    });
  }
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


  const [countryCodes, setCountryCodes] = useState([
    { code: "+1", country: "USA/Canada" },
    { code: "+44", country: "UK" },
    { code: "+91", country: "India" },
    { code: "+61", country: "Australia" },
    { code: "+81", country: "Japan" },
    { code: "+49", country: "Germany" },
    { code: "+33", country: "France" },
    { code: "+34", country: "Spain" },
    { code: "+55", country: "Brazil" },
    { code: "+52", country: "Mexico" },
    { code: "+86", country: "China" },
    { code: "+39", country: "Italy" },
    { code: "+7", country: "Russia/Kazakhstan" },
  ]);
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
  const [dataList, setDataList] = useState({});

  // Fetch property data by rentId
  useEffect(() => {
    if (!rentId) return;  // Prevent fetching if rentId is not available

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

        setFormData({
          phoneNumber: data.phoneNumber || "",
          rentalPropertyAddress: data.rentalPropertyAddress || "",
          state: data.state || "",
          city: data.city || "",
          district: data.district || "",
          rentalAmount:data.rentalAmount || "",
          callForRent: !!data.callForRent,
          area: data.area || "",
          streetName: data.streetName || "",
          doorNumber: data.doorNumber || "",
          nagar: data.nagar || "",
          ownerName: data.ownerName || "",
          email: data.email || "",
          alternatePhone: data.alternatePhone || "",
          countryCode: data.countryCode || "+91",
          propertyMode: data.propertyMode || "",
          propertyType: data.propertyType || "",
          bankLoan: data.bankLoan || "",
          negotiation: data.negotiation || "",
          ownership: data.ownership || "",
          bedrooms: data.bedrooms || "",
          kitchen: data.kitchen || "",
          kitchenType: data.kitchenType || "",
          balconies: data.balconies || "",
          floorNo: data.floorNo || "",
          areaUnit: data.areaUnit || "",
          propertyApproved: data.propertyApproved || "",
          propertyAge: data.propertyAge || "",
          postedBy: data.postedBy || "",
          description:data.description || "",
          facing: data.facing || "",
          salesMode: data.salesMode || "",
          salesType: data.salesType || "",
          furnished: data.furnished || "",
          lift: data.lift || "",
          attachedBathrooms: data.attachedBathrooms || "",
          western: data.western || "",
          numberOfFloors: data.numberOfFloors || "",
          carParking: data.carParking || "",
          bestTimeToCall: data.bestTimeToCall || "",
          length:data.length || "",
          breadth:data.breadth || "",
          totalArea:data.totalArea || "",
          pinCode:data.pinCode || '',

        });
        
        // Debug: log negotiation value returned from backend
        console.log('Negotiation value loaded:', data.negotiation);
        // Load existing photos from server
        if (data.photos && Array.isArray(data.photos)) {
          setPhotos(data.photos);
        }
      } catch (error) {
        toast.error('Failed to fetch property details');
      }
    };

    fetchPropertyData();
  }, [rentId]);

  // Fetch dropdown data for select fields
  useEffect(() => {
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

    fetchDropdownData();
  }, []);
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
  // Handle field changes for form data
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "rentalAmount") {
      if (value !== "" && !isNaN(value)) {
        setPriceInWords(convertToIndianRupees(value));
      } else {
        setPriceInWords("");
      }
    }
  };
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert('File size exceeds the 50MB limit');
      return;
    }
    setVideo(file);
  };
  const removeVideo = () => {
    setVideo(null);
  };
 


  

  
  const handlePhotoUpload = async (e) => {
    console.log('📸 handlePhotoUpload triggered with files:', e.target.files.length);
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (files.length === 0) return;

    for (let file of files) {
      if (file.size > maxSize) {
        alert('File size exceeds the 10MB limit');
        e.target.value = ''; // Reset input
        return;
      }
    }

    if (photos.length + files.length > 15) {
      alert('Maximum 15 photos can be uploaded.');
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
      alert('Error processing photos. Please try again.');
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

  
  const handlePhotoSelect = (index) => {
    setSelectedPhotoIndex(index); 
  };


  // Revoke object URLs when component unmounts or photos change
  useEffect(() => {
    return () => {
      photos.forEach((photo) => {
        if (photo instanceof Blob) {
          URL.revokeObjectURL(photo);
        }
      });
    };
  }, [photos]);

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

    if (video) {
      formDataToSend.append("video", video);
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/update-rent-property`,
        formDataToSend,
        { 
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
              console.log(`Upload progress: ${percentCompleted}%`);
            }
          }
        }
      );

      setUploadProgress(100);
      setMessage({ text: response.data.message, type: "success" });
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        navigate(-1);
      }, 2000);
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      setMessage({ text: "Error saving property data.", type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
    }
  };

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
          setMessage({ text: "", type: "" });
        }, 5000);
        return;
      }

      if (!formData.floorNo || formData.floorNo.trim() === '') {
        setMessage({ text: `Floor No field is required. Please fill this field.`, type: "error" });
        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 5000);
        return;
      }
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
      
      // Keep error message visible longer for user to read
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 8000);
      return;
    }
    
    // If validation passes, proceed with preview (you can add preview modal logic here)
    setMessage({ text: "Preview feature coming soon!", type: "info" });
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 3000);
  };

     const fieldIcons = {
        phoneNumber: <FaPhone color="#4F4B7E" />,
        rentalPropertyAddress: <MdLocationCity color="#4F4B7E" />,
        state: <MdLocationCity color="#4F4B7E" />,
        city: <FaCity color="#4F4B7E" />,
        district: <RiLayoutLine color="#4F4B7E" />,
        area: <FaCity color="#4F4B7E" />,
        streetName: <RiLayoutLine color="#4F4B7E" />,
        doorNumber: <FaRegBuilding color="#4F4B7E" />,
        nagar: <FaRegAddressCard color="#4F4B7E" />,
        ownerName: <FaRegBuilding color="#4F4B7E" />,
        email: <FaEnvelope color="#4F4B7E" />,
        alternatePhone: <FaPhone color="#4F4B7E" />,
        propertyMode: <MdApproval color="#4F4B7E" />,
        propertyType: <FaRegBuilding color="#4F4B7E" />,
        bankLoan: <BsBank color="#4F4B7E" />,
        negotiation: <FaRupeeSign color="#4F4B7E" />,
        ownership: <FaUserAlt color="#4F4B7E" />,
        bedrooms: <FaBed color="#4F4B7E" />,
        kitchen: <FaKitchenSet color="#4F4B7E" />,
        kitchenType: <FaKitchenSet color="#4F4B7E" />,
        balconies: <FaRegBuilding color="#4F4B7E" />,
        floorNo: <BsBuildingsFill color="#4F4B7E" />,
        areaUnit: <FaChartArea color="#4F4B7E" />,
        propertyApproved: <FaCheckCircle color="#4F4B7E" />,
        propertyAge: <FaCalendarAlt color="#4F4B7E" />,
        postedBy: <FaRegBuilding color="#4F4B7E" />,
        facing: <GiHouse color="#4F4B7E" />,
        
        furnished: <FaHome color="#4F4B7E" />,
        lift: <FaRegBuilding color="#4F4B7E" />,
        attachedBathrooms: <FaBath color="#4F4B7E" />,
        western: <FaBath color="#4F4B7E" />,
        numberOfFloors: <BsBuildingsFill color="#4F4B7E" />,
        carParking: <FaCar color="#4F4B7E" />,
        bestTimeToCall: <FaClock color="#4F4B7E" />,
        length: <MdStraighten color="#4F4B7E" />,
          breadth: <MdStraighten color="#4F4B7E" />,
          totalArea: <GiResize color="#4F4B7E" />,
      };

      const fieldLabels = {
        propertyMode: "Property mode",
        propertyType: "Property type",
        rentalAmount: "Rental amount",
        propertyAge: "Property age",
        bankLoan: "Bank loan",
        negotiation: "Negotiation",
        length: "Length",
        breadth: "Breadth",
        totalArea: "Total area",
        ownership: "Ownership",
        bedrooms: "Bedrooms",
        kitchen: "Kitchen",
        kitchenType: "Kitchen type",
        balconies: "Balconies",
        floorNo: "Floor no.",
        areaUnit: "Area unit",
        propertyApproved: "Property approved",
        postedBy: "Posted by",
        facing: "Facing",
      
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
        dropdownState.activeDropdown === field && (
          <div
            className="dropdown-popup"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
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
                    handleDropdownSelect(field, option);
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
    <div className="d-flex align-items-center justify-content-center">
    <div style={{
      width: '100%',
      maxWidth: '450px',
      minWidth: '300px',
      padding: '5px',
      borderRadius: '8px',
      margin: '0 5px',
    }} 
    >
      <h1>Edit Property Rent</h1>

       <form  onSubmit={handleSubmit} className="addForm w-100">
        <p className="p-3" style={{ color: "white", backgroundColor: "rgb(47,116,127)" }}>RENT ID : {rentId}</p>

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


         {/* Upload Photos
         <div className="form-group photo-upload-container mt-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    name="photos"
                    id="photo-upload"
                    className="photo-upload-input"
                  />
                  <label htmlFor="photo-upload " className="photo-upload-label fw-normal m-0">
                    <MdAddPhotoAlternate
                      style={{
                        color: 'white',
                        backgroundColor: '#2e86e4',
                        padding: '5px',
                        fontSize: '30px',
                        borderRadius: '50%',
                        marginRight: '5px',
                      }}
                    />
                    Upload Your Property Images
                  </label>
                </div>

                {photos.length > 0 && (
                  <div className="uploaded-photos">
                    <h4>Uploaded Photos</h4>
                    <div className="uploaded-photos-grid">
                      {photos.map((photo, index) => (
                        <div key={index} className="uploaded-photo-item">
                          <input
                            type="radio"
                            name="selectedPhoto"
                            className='me-1 '
                            checked={selectedPhotoIndex === index}
                            onChange={() => handlePhotoSelect(index)}
                          />
                          <img
                            src={URL.createObjectURL(photo)}
                            alt="Uploaded"
                            className="uploaded-photo mb-3 "
                          />
                          <button
                            className="remove-photo-btn"
                            onClick={() => removePhoto(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}


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
    <MdAddPhotoAlternate
      style={{
        color: 'white',
        backgroundColor: '#2e86e4',
        padding: '5px',
        fontSize: '30px',
        borderRadius: '50%',
        marginRight: '5px',
      }}
    />
    Upload Your Property Images
  </label>
</div>

        {/* Compression Progress Bar - Inline Style */}
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
              {photos.map((photo, index) => (
                <div key={index} className="uploaded-photo-item">
                  <input
                    type="radio"
                    name="selectedPhoto"
                    className="me-1"
                    checked={selectedPhotoIndex === index}
                    onChange={() => handlePhotoSelect(index)}
                  />
                  <img
                    src={
                      typeof photo === 'string'
                        ? photo // URL from server
                        : URL.createObjectURL(photo) // File object (new upload)
                    }
                    alt="Uploaded"
                    className="uploaded-photo mb-3"
                  />
                  <button
                    className="remove-photo-btn"
                    onClick={() => removePhoto(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Negotiation status below photos */}
        {formData.negotiation && (
          (() => {
            const v = String(formData.negotiation || '').toLowerCase().trim();
            const status = (v.includes('non') || v.includes('no'))
              ? 'Non-Negotiable'
              : (v.includes('yes') || v.includes('negotiable'))
                ? 'Negotiable'
                : formData.negotiation;
            return (
              <div style={{
                marginTop: '12px',
                padding: '10px',
                backgroundColor: '#f1f8e9',
                border: '1px solid #c5e1a5',
                borderRadius: '6px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '600',
                color: '#33691e'
              }}>
                Negotiation Status: {status}
              </div>
            );
          })()
        )}

<h4 style={{ color: "rgb(47,116,127)", fontWeight: "bold", marginBottom: "10px" }}> Property Video  </h4>
        {/* Video Upload Section */}
        <div className="form-group">
          <input
            type="file"
            name="video"
            accept="video/*"
            id="videoUpload"
            onChange={handleVideoChange}
            className="d-none"
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
              Upload Property Video
            </span>
          </label>

          {/* Display the selected video */}
          {video && (
  <div className="selected-video-container">
    <h4 className="text-start">Selected Video:</h4>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <video width="200" controls>
        <source
          src={
            typeof video === 'string'
              ? video // URL from server
              : URL.createObjectURL(video) // File object (new upload)
          }
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <Button
        variant="danger"
        onClick={removeVideo}
        style={{ height: '40px' }}
      >
        Remove
      </Button>
    </div>
  </div>
)}
</div>



  {/* Property Mode */}
  <div className="form-group">
    <label style={{ width: '100%'}}>
    <label>Property Mode</label>

      <div style={{ display: "flex", alignItems: "center", width:"100%" }}>
        <div style={{ flex: "1" }}>
          <select
            name="propertyMode"
            value={formData.propertyMode || ""}
            onChange={handleFieldChange}
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
            className="m-0"
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
              {fieldIcons.propertyMode || <FaHome />}
            </span>
            {formData.propertyMode || "Select Property Mode"}
          </button>

          {renderDropdown("propertyMode")}
        </div>
      </div>
    </label>
  </div>


  <div className="form-group">
    <label style={{ width: '100%'}}>
<label>Property Type</label>
      <div style={{ display: "flex", alignItems: "center"}}>
        <div style={{ flex: "1" }}>
          <select
            name="propertyType"
            value={formData.propertyType || ""}
            onChange={handleFieldChange}
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
            className="m-0"
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
              {fieldIcons.propertyType || <FaHome />}
            </span>
            {formData.propertyType || "Select Property Type"}
          </button>

          {renderDropdown("propertyType")}
        </div>
      </div>
    </label>
  </div>
  {/* Price */}
 
  <div className="form-group">
  <label>Rental Amount:</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
    <FaRupeeSign className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
    <input
      type={formData.callForRent ? "text" : "tel"}
      name="rentalAmount"
      value={formData.callForRent ? "Call Owner" : formData.rentalAmount}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="price"
      disabled={!!formData.callForRent}
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>

  {/* Call Owner toggle */}
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
        if (checked && typeof setPriceInWords === 'function') setPriceInWords("");
      }}
    />
    Call Owner (use when price is on request)
  </label>
  </div>
  {priceInWords && !formData.callForRent && (
        <p style={{ fontSize: "14px", color: "#4F4B7E", marginTop: "5px" }}>
          {priceInWords}
        </p>
      )}

  {/* Show Negotiation status near price */}
  {formData.negotiation && (
    (() => {
      const v = String(formData.negotiation || '').toLowerCase().trim();
      const status = (v.includes('non') || v.includes('no'))
        ? 'Non-Negotiable'
        : (v.includes('yes') || v.includes('negotiable'))
          ? 'Negotiable'
          : formData.negotiation;
      return (
        <p style={{ fontSize: "13px", color: status === 'Negotiable' ? '#2e7d32' : '#c62828', marginTop: "6px", fontWeight: '600' }}>
          {status === 'Negotiable' ? 'Negotiable' : 'Non-Negotiable'}
        </p>
      );
    })()
  )}


  {/* Negotiation */}

  <div className="form-group">
    <label style={{ width: '100%'}}>
    <label>Negotiation </label>

      <div style={{ display: "flex", alignItems: "center" }}>
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
              {fieldIcons.negotiation || <FaHome />}
            </span>
            {formData.negotiation || "Select negotiation"}
          </button>

          {renderDropdown("negotiation")}
        </div>
      </div>
    </label>
  </div>

  {/* Length */} 
  <div className="form-group">
  <label>length:</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
    <MdStraighten className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
    <input
      type="text"
      name="length"
      value={formData.length}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="length"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
</div>
  {/* Breadth */}
  <div className="form-group">
  <label>breadth:</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
    <MdStraighten className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
    <input
      type="text"
      name="breadth"
      value={formData.breadth}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="breadth"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>


  </div>
  {/* Total Area */}
  <div className="form-group">
  <label>Total Area:</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
    <GiResize className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
    <input
      type="text"
      name="totalArea"
      value={formData.totalArea}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="totalArea"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
  </div>

    {/* areaUnit */}
    <div className="form-group">
    <label style={{ width: '100%'}}>
    <label>area Unit </label>

      <div style={{ display: "flex", alignItems: "center" }}>
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
              {fieldIcons.areaUnit || <FaHome />}
            </span>
            {formData.areaUnit || "Select areaUnit"}
          </button>

          {renderDropdown("areaUnit")}
        </div>
      </div>
    </label>
  </div>

  {/* Ownership */}
  <div className="form-group">
    <label style={{ width: '100%'}}>
    <label>Ownership </label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
          <select
            name="ownership"
            value={formData.ownership || ""}
            onChange={handleFieldChange}
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
            className="m-0"
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
              {fieldIcons.ownership || <FaHome />}
            </span>
            {formData.ownership || "Select ownership"}
          </button>

          {renderDropdown("ownership")}
        </div>
      </div>
    </label>
  </div>



  {/* Bedrooms */}

<div className="form-group">
    <label style={{ width: '100%'}}>
    <label>bedrooms </label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
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
              {fieldIcons.bedrooms || <FaHome />}
            </span>
            {formData.bedrooms || "Select bedrooms"}
          </button>

          {renderDropdown("bedrooms")}
        </div>
      </div>
    </label>
  </div>
  {/* kitchen */}
  <div className="form-group">
    <label style={{ width: '100%'}}>
    <label>kitchen </label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
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
              {fieldIcons.kitchen || <FaHome />}
            </span>
            {formData.kitchen || "Select kitchen"}
          </button>

          {renderDropdown("kitchen")}
        </div>
      </div>
    </label>
  </div>
    {/* kitchenType */}
    <div className="form-group">
    <label style={{ width: '100%'}}>
    <label>kitchenType </label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
          <select
            name="kitchenType"
            value={formData.kitchenType || ""}
            onChange={handleFieldChange}
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
            className="m-0"
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
              {fieldIcons.kitchenType || <FaHome />}
            </span>
            {formData.kitchenType || "Select kitchenType"}
          </button>

          {renderDropdown("kitchenType")}
        </div>
      </div>
    </label>
  </div>
    {/* balconies */}
    <div className="form-group">
    <label style={{ width: '100%'}}>
    <label>balconies </label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
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
              {fieldIcons.balconies || <FaHome />}
            </span>
            {formData.balconies || "Select balconies"}
          </button>

          {renderDropdown("balconies")}
        </div>
      </div>
    </label>
  </div>
    {/* floorNo */}
    <div className="form-group">
    <label style={{ width: '100%'}}>
    <label>floorNo </label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
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
              {fieldIcons.floorNo || <FaHome />}
            </span>
            {formData.floorNo || "Select floorNo"}
          </button>

          {renderDropdown("floorNo")}
        </div>
      </div>
    </label>
  </div>
  

    {/* propertyApproved */}

    <div className="form-group">
    <label style={{ width: '100%'}}>
    <label>property Approved</label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
          <select
            name="propertyApproved"
            value={formData.propertyApproved || ""}
            onChange={handleFieldChange}
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
            className="m-0"
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
              {fieldIcons.propertyApproved || <FaHome />}
            </span>
            {formData.propertyApproved || "Select propertyApproved"}
          </button>

          {renderDropdown("propertyApproved")}
        </div>
      </div>
    </label>
  </div>

  {/* Property Age */}
  <div className="form-group">
    <label style={{ width: '100%'}}>
    <label>Property Age </label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
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
              {fieldIcons.propertyAge || <FaHome />}
            </span>
            {formData.propertyAge || "Select Property Age"}
          </button>

          {renderDropdown("propertyAge")}
        </div>
      </div>
    </label>
  </div>

  {/* Bank Loan */}

  <div className="form-group">
    <label style={{ width: '100%'}}>
    <label>Bank Loan </label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
          <select
            name="bankLoan"
            value={formData.bankLoan || ""}
            onChange={handleFieldChange}
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
            className="m-0"
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
              {fieldIcons.bankLoan || <FaHome />}
            </span>
            {formData.bankLoan || "Select Bank Loan"}
          </button>

          {renderDropdown("bankLoan")}
        </div>
      </div>
    </label>
  </div>

  
    {/* facing */}
    <div className="form-group">

    <label style={{ width: '100%'}}>
    <label>facing</label>

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
  </div>
    {/* salesMode */}

    <div className="form-group">
    <label style={{ width: '100%'}}>
    <label>sales Mode</label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
          <select
            name="salesMode"
            value={formData.salesMode || ""}
            onChange={handleFieldChange}
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
            className="m-0"
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
              {fieldIcons.salesMode || <FaHome />}
            </span>
            {formData.salesMode || "Select salesMode"}
          </button>

          {renderDropdown("salesMode")}
        </div>
      </div>
    </label>
  </div>
    {/* salesType */}
    <div className="form-group">
    <label style={{ width: '100%'}}>
      <label>Sale Type</label>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
          <select
            name="salesType"
            value={formData.salesType || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select salesType</option>
            {dataList.salesType?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("salesType")}
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
              {fieldIcons.salesType || <FaHome />}
            </span>
            {formData.salesType || "Select salesType"}
          </button>

          {renderDropdown("salesType")}
        </div>
      </div>
    </label>
  </div>

  {/* postedBy */}
  <div className="form-group">
    <label style={{ width: '100%'}}>
    <label>postedBy</label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
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
              {fieldIcons.postedBy || <FaHome />}
            </span>
            {formData.postedBy || "Select postedBy"}
          </button>

          {renderDropdown("postedBy")}
        </div>
      </div>
    </label>
  </div>
  {/* Description */}
  <div className="form-group">
    <label>Description:</label>
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
          value={formData.description || ""} 
          onChange={handleFieldChange} 
          className="form-control" 
          placeholder="Enter Description (Maximum 200 Characters)"
          style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none', color:"grey", width: '100%', boxSizing: 'border-box' }}
        ></textarea>
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '12px',
          fontSize: '12px',
          fontWeight: 'bold',
          color: formData.description.length > 200 ? '#dc3545' : formData.description.length >= 150 ? '#ff9800' : '#28a745'
        }}>
          {formData.description ? formData.description.length : 0}/200
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

  {/* furnished */}
  <div className="form-group">
    <label style={{width:"100%"}}>
    <label>furnished</label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
          <select
            name="furnished"
            value={formData.furnished || ""}
            onChange={handleFieldChange}
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
            className="m-0"
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
              {fieldIcons.furnished || <FaHome />}
            </span>
            {formData.furnished || "Select furnished"}
          </button>

          {renderDropdown("furnished")}
        </div>
      </div>
    </label>
  </div>
    {/*lift */}
    <div className="form-group">
    <label style={{ width: '100%'}}>
      <label>lift</label>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
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
              {fieldIcons.lift || <FaHome />}
            </span>
            {formData.lift || "Select lift"}
          </button>

          {renderDropdown("lift")}
        </div>
      </div>
    </label>
  </div>

      {/*attachedBathrooms */}
      <div className="form-group">
    <label style={{ width: '100%'}}>
    <label>attached Bathrooms</label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
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
              {fieldIcons.attachedBathrooms || <FaHome />}
            </span>
            {formData.attachedBathrooms || "Select attachedBathrooms"}
          </button>

          {renderDropdown("attachedBathrooms")}
        </div>
      </div>
    </label>
  </div>
    {/* western */}
    <div className="form-group">

    <label style={{ width: '100%'}}>
    <label>western</label>

      <div style={{ display: "flex", alignItems: "center"}}>
        <div style={{ flex: "1" }}>
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
              {fieldIcons.western || <FaHome />}
            </span>
            {formData.western || "Select western"}
          </button>

          {renderDropdown("western")}
        </div>
      </div>
    </label>
  </div>
    {/* numberOfFloors */}
    <div className="form-group">

    <label style={{ width: '100%'}}>
    <label>number Of Floors</label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
          <select
            name="numberOfFloors"
            value={formData.numberOfFloors || ""}
            onChange={handleFieldChange}
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
            className="m-0"
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
              {fieldIcons.numberOfFloors || <FaHome />}
            </span>
            {formData.numberOfFloors || "Select numberOfFloors"}
          </button>

          {renderDropdown("numberOfFloors")}
        </div>
      </div>
    </label>
  </div>
    {/* carParking */}

    <div className="form-group">
    <label style={{ width: '100%'}}>
    <label>car Parking</label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
          <select
            name="carParking"
            value={formData.carParking || ""}
            onChange={handleFieldChange}
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
              {fieldIcons.carParking || <FaHome />}
            </span>
            {formData.carParking || "Select carParking"}
          </button>

          {renderDropdown("carParking")}
        </div>
      </div>
    </label>
  </div>


  {/*   rentalPropertyAddress */}
  <div className="form-group">
  {/* <label>Quick Address:</label> */}
  
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border: '1px solid #4F4B7E', background:"#fff"}}>
      <FcSearch  className="input-icon" 
      style={{color: '#4F4B7E', marginLeft:"10px"}} />
      <input
        ref={inputRef}
  
        id="pac-input"
        className="form-input m-0"
        placeholder="Search location"
        style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
      />
    </div>
  </div>
  <div
    ref={mapRef}
    id="map"
    style={{ height: "200px", width: "100%" }}
  ></div>
  {/* <div className="mt-1 w-100 d-flex gap-2 mb-2">
 <input
  ref={coordRef}
  placeholder="Enter coordinates (e.g., 11.7540° N, 79.7619° E)"
  className="form-control m-0"
    onChange={handleLatLngAuto} // 👈 Automatically triggers on input

/>
  <button
    onClick={handleClear}
    type="button"
    className="btn btn-primary m-0 border-0"
    style={{ whiteSpace: 'nowrap', background:"#6CBAAF" ,  }}
  >
    Clear
  </button>
</div> */}
<div className="mt-3 w-100 d-flex gap-2 mb-2">

  <input
  ref={coordRef}
  placeholder="Enter Your Property Coordinates"
  className="form-control m-0"
    onChange={(e) => setCoordinateInput(e.target.value)}

    // onChange={handleLatLngAuto} // 👈 Automatically triggers on input
/>
<button className="btn btn-primary m-0 border-0"
     style={{ whiteSpace: 'nowrap', background:"#6CBAAF" ,  }}
 onClick={() => handleLatLngAuto(coordinateInput)}>
  Go
</button>

  <button
    onClick={handleClear}
    type="button"
    className="btn btn-primary m-0 border-0"
    style={{ whiteSpace: 'nowrap', background:"#B1D3C0" ,  }}
  >
    <MdOutlineClose color="white"/>
  </button>

</div>
  {/* <input value={formData.pinCode || ""} readOnly />
  <input value={formData.city || ""} readOnly />
  <input value={formData.area || ""} readOnly />
  <input value={formData.streetName || ""} readOnly />
   */}
  <p className="mt-1" style={{color:"#0597FF" , fontSize:"13px"}}>IF YOU CAN'T FIND THE ADDRESS PLEASE ENTER MANUALLY</p>
    <div className="form-group">
  <label>Property Address:</label>
  
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border: '1px solid #4F4B7E', background:"#fff"}}>
      <FaHome className="input-icon" 
      style={{color: '#4F4B7E', marginLeft:"10px"}} />
      <input
        type="text"
        name="rentalPropertyAddress"
        value={`${formData.doorNumber || ""} ${formData.streetName || ""} ${formData.area || ""}  ${formData.city || ""}   ${formData.state || ""} ${formData.pinCode || ""}`}
        onChange={handleFieldChange}
        className="form-input m-0"
        placeholder="Property Address"
        style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
      />
    </div>
  </div>
  

  {/* country */}

  <div className="form-group">
  <label>country:</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
    <BiWorld className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
    <input
      type="text"
      name="country"
      value={formData.country}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="country"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
  </div>
  
  {/* State */}

<div className="form-group">
  <label>State:</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
    <MdLocationCity className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
    <input
      type="text"
      name="state"
      value={formData.state}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="State"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
</div>
  {/* City */}

<div className="form-group">
  <label>City:</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
    <FaCity className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
    <input
      type="text"
      name="city"
      value={formData.city}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="City"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
</div>

  {/* district */}
  {/* <div className="form-group">
  <label>District:</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
    <FaRegAddressCard className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
    <input
      type="text"
      name="district"
      value={formData.district}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="District"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
</div> */}
  <div className="form-group" >
    <label style={{width:'100%'}}>
    <label>District</label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
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
              {fieldIcons.district || <FaHome />}
            </span>
            {formData.district || "Select District"}
          </button>

          {renderDropdown("district")}
        </div>
      </div>
    </label>
  </div>
  {/* area */}
  <div className="form-group" style={{ position: 'relative' }}>
  <label>Area:</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
    <MdLocationOn className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
    <input
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
      autoComplete="off"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
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
  {/* streetName */}
  <div className="form-group">
  <label>Street Name:</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
    <FaRoad className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
    <input
      type="text"
      name="streetName"
      value={formData.streetName}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Street Name"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
</div>
  {/* doorNumber */}
  <div className="form-group">
  <label>Door Number:</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
    <FaDoorClosed className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
    <input
      type="text"
      name="doorNumber"
      value={formData.doorNumber}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Door Number"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
  </div>

  {/* Nagar */}
  <div className="form-group">
  <label>Nagar:</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
    <FaMapPin className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
    <input
      type="text"
      name="nagar"
      value={formData.nagar}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Nagar"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
</div>

<div className="form-group">
  <label>pinCode:</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
    <TbMapPinCode  className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
    <input
      type="text"
      name="pinCode"
      value={formData.pinCode}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="pinCode"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
</div>

<div className="form-group">
  <label>location Coordinates:</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
    <TbWorldLongitude  className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
    <input
      type="text"
      name="locationCoordinates"
      value={formData.locationCoordinates}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="location Coordinates"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
</div>
  {/* Owner Name */}

  

<div className="form-group">
  <label>Owner Name:</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
    <FaUserAlt className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
    <input
      type="text"
      name="ownerName"
      value={formData.ownerName}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Owner Name"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
</div>

  {/* Email */}
  <div className="form-group">
  <label>Email:</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
    <FaEnvelope className="input-icon" style={{color: '#4F4B7E', marginLeft:"10px"}} />
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Email"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
</div>
  {/* Phone Number */}

<div className="form-group">
<label>Phone Number:</label>

  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
    <FaPhone className="input-icon" style={{ color: '#4F4B7E', marginLeft:"10px" }} />
    
    <div style={{ flex: '0 0 10%' }}>
      <label>
        <select
          name="countryCode"
          value={formData.countryCode || ""}
          onChange={handleFieldChange}
          className="form-control m-0"
          style={{ width: '100%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
        >
          <option value="">Select Country Code</option>
          {countryCodes.map((item, index) => (
            <option key={index} value={item.code}>
              {item.code} - {item.country}
            </option>
          ))}
        </select>
      </label>
    </div>

    <input
      type="text"
      name="phoneNumber"
      value={formData.phoneNumber}
      readOnly
      className="form-input m-0"
      placeholder="Phone Number"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
</div>
  {/* Alternate Number */}

<div className="form-group">
<label>Alternate number:</label>

  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  border: '1px solid #4F4B7E', background:"#fff" }}>
    <FaPhone className="input-icon" style={{ color: '#4F4B7E', marginLeft:"10px" }} />
    
    <div style={{ flex: '0 1 10%' }}>
      <label>
        <select
          name="countryCode"
          value={formData.countryCode || ""}
          onChange={handleFieldChange}
          className="form-control m-0"
          style={{ width: '100%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
        >
          <option value="">Select Country Code</option>
          {countryCodes.map((item, index) => (
            <option key={index} value={item.code}>
              {item.code} - {item.country}
            </option>
          ))}
        </select>
      </label>
    </div>

    <input
      type="tel"
      name="alternatePhone"
      value={formData.alternatePhone}
      onChange={handleFieldChange}
      className="form-input m-0"
      placeholder="Alternate Phone Number"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
    />
  </div>
</div>

  {/* Best Time to Call */}
  <div className="form-group" >
    <label style={{width:'100%'}}>
    <label>best Time To Call</label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
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
              {fieldIcons.bestTimeToCall || <FaHome />}
            </span>
            {formData.bestTimeToCall || "Select bestTimeToCall"}
          </button>

          {renderDropdown("bestTimeToCall")}
        </div>
      </div>
    </label>
  </div>


                <Button
                  type="button"
                  onClick={handlePreview}
                  style={{ marginTop: '15px', marginRight: '10px', backgroundColor: "#4F4B7E", border:"none", color: "white" }}
                >
                  Preview
                </Button>

                <Button
                  type="submit"
                  style={{ marginTop: '15px', backgroundColor: "rgb(47,116,127)", border:"none" }}
                >
                  update property
                </Button>

                {/* Upload Progress Overlay */}
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
                        {video ? 'Uploading video and images...' : 'Processing...'}
                      </p>
                    </div>
                  </div>
                )}
       
      </form>
    </div>
    </div>
  );
}

export default EditProperty;











