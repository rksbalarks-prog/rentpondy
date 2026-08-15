// FormComponent.js
import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaCity, FaIdCard, FaRegBuilding, FaRupeeSign , FaTimes} from 'react-icons/fa';
import { MdApproval } from 'react-icons/md';
import axios from "axios";
import { PiMapPinAreaLight } from "react-icons/pi";
import { HiOutlineBuildingLibrary } from 'react-icons/hi2';
import { LuBedDouble, LuBuilding } from 'react-icons/lu';
import { GrSteps } from 'react-icons/gr';
import { FcSearch } from 'react-icons/fc';
import minprice from "../Assets/Price Mini-01.png";
import maxprice from "../Assets/Price maxi-01.png";
const dataList = {
  propertyMode: ['Buy', 'Rent', 'Lease'],
};

// Area to Pincode mapping
const areaPincodeMap = {
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

const FormComponent = ({ isModal = false, onClose } = {}) => {
  const [hovered, setHovered] = useState(false);
  const closeOrBack = () => {
    if (isModal && typeof onClose === 'function') {
      onClose();
    } else {
      navigate(-1);
    }
  };

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
  const buttonStyle = {
    marginTop: "20px",
    background: hovered ? "#CDC9F9" : "#4F4B7E", // Darker on hover
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background 0.3s ease",
    with:"100%"
  };
  const [filters, setFilters] = useState({
    id: '',
    minPrice: '',
    maxPrice: '',
    propertyMode: '',
    city: '',
    propertyType: '',
    floorNo: '',
    state: '',
    area: '',
    bedrooms: '',

  });
  
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Area suggestions state
  const [areaSuggestions, setAreaSuggestions] = useState([]);
  const [showAreaSuggestions, setShowAreaSuggestions] = useState(false);
  
  const navigate = useNavigate();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle area input change with suggestions
  const handleAreaInputChange = (e) => {
    const value = e.target.value;
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

  // Handle area selection from suggestions
  const handleAreaSelect = (selectedArea) => {
    setFilters(prev => ({
      ...prev,
      area: selectedArea
    }));
    setShowAreaSuggestions(false);
    setAreaSuggestions([]);
  };

  const toggleDropdown = (field) => {
    setDropdownState((prev) => ({
      ...prev,
      activeDropdown: prev.activeDropdown === field ? null : field,
      filterText: '',
    }));
  };
  const handleDropdownFilterChange = (e) => {
    setDropdownState((prev) => ({
      ...prev,
      filterText: e.target.value,
    }));
  };
 
    const [dropdownState, setDropdownState] = useState({
      activeDropdown: null,
      filterText: "",
      position: { top: 0, left: 0 },
    });
    const fieldLabels = {
      propertyMode: "Property Mode",
      propertyType: "Property Type",
      minPrice: "Min Rental",
            maxPrice: "Max Rental",

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
                    setFilters((prevState) => ({
                      ...prevState,
                      [field]: option,
                    }));
                    toggleDropdown(field);
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
 
             <div className="d-flex justify-content-end p-2">
         


               <button
                 type="button"
                 onClick={() => toggleDropdown(field)}
                 style={{
                   background: '#0B57CF',
                   cursor: 'pointer',
                   border: 'none',
                   color: '#fff',
                   borderRadius: '10px',
                   padding:"5px"
                 }}
               >
                 Close
               </button>
             </div>
 
             {[
               'areaUnit',
               'availableDate',
               'petAllowed',
               'locationCoordinates',
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

  // State for search results
  const [searchResults, setSearchResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [showResultsPopup, setShowResultsPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingResults(true);
    setSearchError("");
    setSearchResults([]);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-buyerAssistances-rent`);
      const allData = response.data.data || [];
      let results = allData.filter((item) => {
        if (filters.id && !item.Ra_Id?.toString().toLowerCase().includes(filters.id.toLowerCase())) return false;
        if (filters.propertyMode && item.propertyMode?.toLowerCase() !== filters.propertyMode.toLowerCase()) return false;
        if (filters.propertyType && item.propertyType?.toLowerCase() !== filters.propertyType.toLowerCase()) return false;
        if (filters.bedrooms && item.bedrooms?.toString() !== filters.bedrooms) return false;
        if (filters.floorNo && item.floorNo?.toString() !== filters.floorNo) return false;
        if (filters.city && item.city?.toLowerCase() !== filters.city.toLowerCase()) return false;
        if (filters.state && item.state?.toLowerCase() !== filters.state.toLowerCase()) return false;
        if (filters.area && item.area?.toLowerCase() !== filters.area.toLowerCase()) return false;
        if (filters.minPrice && Number(item.rentalAmount) < Number(filters.minPrice)) return false;
        if (filters.maxPrice && Number(item.rentalAmount) > Number(filters.maxPrice)) return false;
        return true;
      });
      if (results.length > 0) {
        setSearchResults(results);
        setShowResultsPopup(true);
      } else {
        setSearchError("No matching tenants found.");
      }
    } catch (err) {
      setSearchError("Error fetching data.");
    } finally {
      setLoadingResults(false);
    }
  };

  const handlePageNavigation = () => {
    navigate(-1); // Redirect to the desired path
  };
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

      onClick={closeOrBack}
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
    
        </button> <h3 className="m-0" style={{fontSize:"18px"}}>Tenant Assistance Search  </h3> </div>
           
    <form onSubmit={handleSubmit} 
  className="p-3"  >
      {/* ID */}
      <div className="form-group  mb-3">
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)" }}>
             <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
 <FaIdCard /> </span>
          <input className='m-0'
            type="text"
            name="id"
            value={filters.id}
            onChange={handleFilterChange}
            placeholder="ID"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Min Price */}
      {/* <div className="form-group  mb-3">
        <div className="input-card" style={inputCardStyle}>
          <FaRupeeSign style={iconStyle} />
          <input className='m-0'
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Min Price"
            style={inputStyle}
          />
        </div>
      </div>

      <div className="form-group  mb-3">
        <div className="input-card" style={inputCardStyle}>
          <img src={maxprice} width={20} />
          <input className='m-0'
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Max Price"
            style={inputStyle}
          />
        </div>
      </div> */}
{/* Min Price */}
<div className="form-group mt-2">
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)" }}>
    <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
      <img src={minprice} alt="" width={20}/>
    </span>
    <div style={{ flex: 1, position: 'relative' }}>
      <button
        type="button"
        onClick={() =>
          setDropdownState((prev) => ({
            ...prev,
            activeDropdown: prev.activeDropdown === 'minPrice' ? null : 'minPrice',
            filterText: '',
          }))
        }
        style={{
          cursor: "pointer",
          padding: "12px",
          background: "#fff",
          borderRadius: "5px",
          border: "none",
          width: "100%",
          textAlign: "left",
          color: "grey",
          position: "relative"
        }}
      >
        {filters.minPrice || 'Select Min Rental'}
      </button>
      {renderDropdown('minPrice')}
    </div>
  </div>
</div>

{/* Max Price */}
<div className="form-group mt-2">
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)" }}>
    <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
      <img src={maxprice} alt="" width={20}/>
    </span>
    <div style={{ flex: 1, position: 'relative' }}>
      <button
        type="button"
        onClick={() =>
          setDropdownState((prev) => ({
            ...prev,
            activeDropdown: prev.activeDropdown === 'maxPrice' ? null : 'maxPrice',
            filterText: '',
          }))
        }
        style={{
          cursor: "pointer",
          padding: "12px",
          background: "#fff",
          borderRadius: "5px",
          border: "none",
          width: "100%",
          textAlign: "left",
          color: "grey",
          position: "relative"
        }}
      >
        {filters.maxPrice || 'Select Max Rental'}
      </button>
      {renderDropdown('maxPrice')}
    </div>
  </div>
</div>

      {/* Property Mode */}
   <div className="form-group mt-2">
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)"}}>
    
    {/* Icon section */}
    <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
      <LuBuilding color='#4F4B7E'/>
    </span>

    {/* Button dropdown section */}
    <div style={{ flex: 1, position: 'relative' }}>
      <button
        type="button"
        onClick={() =>
          setDropdownState((prev) => ({
            ...prev,
            activeDropdown: prev.activeDropdown === 'propertyMode' ? null : 'propertyMode',
            filterText: '',
          }))
        }
        style={{
          cursor: "pointer",
          padding: "12px",
          background: "#fff",
          borderRadius: "5px",
          border: "none",
          width: "100%",
          textAlign: "left",
          color: "grey",
          position: "relative",
          
        }}
      >
        {filters.propertyMode || 'Select Property Mode'}
      </button>
      {renderDropdown('propertyMode')}
    </div>
  </div>
</div>



      {/* Property Type */}
{/* Property Type */}
<div className="form-group mt-2">
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)" }}>
    <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
      <FaRegBuilding />
    </span>
    <div style={{ flex: 1, position: 'relative' }}>
      <button
        type="button"
        onClick={() =>
          setDropdownState((prev) => ({
            ...prev,
            activeDropdown: prev.activeDropdown === 'propertyType' ? null : 'propertyType',
            filterText: '',
          }))
        }
        style={{
          cursor: "pointer",
          padding: "12px",
          background: "#fff",
          borderRadius: "5px",
          border: "none",
          width: "100%",
          textAlign: "left",
          color: "grey",
          position: "relative"
        }}
      >
        {filters.propertyType || 'Select Property Type'}
      </button>
      {renderDropdown('propertyType')}
    </div>
  </div>
</div>

{/* Bedrooms */}
<div className="form-group mt-2">
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)" }}>
    <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
      <LuBedDouble />
    </span>
    <div style={{ flex: 1, position: 'relative' }}>
      <button
        type="button"
        onClick={() =>
          setDropdownState((prev) => ({
            ...prev,
            activeDropdown: prev.activeDropdown === 'bedrooms' ? null : 'bedrooms',
            filterText: '',
          }))
        }
        style={{
          cursor: "pointer",
          padding: "12px",
          background: "#fff",
          borderRadius: "5px",
          border: "none",
          width: "100%",
          textAlign: "left",
          color: "grey",
          position: "relative"
        }}
      >
        {filters.bedrooms || 'Select Bedrooms'}
      </button>
      {renderDropdown('bedrooms')}
    </div>
  </div>
</div>

{/* Floor No */}
<div className="form-group mt-2">
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)" }}>
    <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
      <GrSteps />
    </span>
    <div style={{ flex: 1, position: 'relative' }}>
      <button
        type="button"
        onClick={() =>
          setDropdownState((prev) => ({
            ...prev,
            activeDropdown: prev.activeDropdown === 'floorNo' ? null : 'floorNo',
            filterText: '',
          }))
        }
        style={{
          cursor: "pointer",
          padding: "12px",
          background: "#fff",
          borderRadius: "5px",
          border: "none",
          width: "100%",
          textAlign: "left",
          color: "grey",
          position: "relative"
        }}
      >
        {filters.floorNo || 'Select Floor No'}
      </button>
      {renderDropdown('floorNo')}
    </div>
  </div>
</div>

      {/* State */}

      {/* <div className="form-group  mb-3 mt-2">
        <div className="input-card" style={inputCardStyle}>
          <HiOutlineBuildingLibrary  style={iconStyle} />
          <input className='m-0'
            type="text"
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
            placeholder="state"
            style={inputStyle}
          />
        </div>
      </div> */}

         <div className="form-group mt-2">
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)" , boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)"}}>
    
    {/* Icon section */}
    <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
      <HiOutlineBuildingLibrary color='#4F4B7E'/>
    </span>

    {/* Button dropdown section */}
    <div style={{ flex: 1, position: 'relative' }}>
      <button
        type="button"
        onClick={() =>
          setDropdownState((prev) => ({
            ...prev,
            activeDropdown: prev.activeDropdown === 'state' ? null : 'state',
            filterText: '',
          }))
        }
        style={{
          cursor: "pointer",
          padding: "12px",
          background: "#fff",
          borderRadius: "5px",
          border: "none",
          width: "100%",
          textAlign: "left",
          color: "grey",
          position: "relative",
          
        }}
      >
        {filters.state || 'Select state'}
      </button>
      {renderDropdown('state')}
    </div>
  </div>
</div>
      {/* City */}
      <div className="form-group mb-3">
        {/* <label>City</label> */}
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)" }}>
              <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
         <FaCity  />
          </span>
          <input className='m-0'
            type="text"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            placeholder="City"
            style={inputStyle}
          />
        </div>
      </div>

      {/* area */}
      <div className="form-group mb-2">
        {/* <label>Area</label> */}
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)", position: 'relative' }}>
                   <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
    <PiMapPinAreaLight  /></span>
          <div style={{ flex: 1, position: 'relative', width: '100%' }}>
            <input className='m-0'
              type="text"
              name="area"
              value={filters.area}
              onChange={handleAreaInputChange}
              placeholder="area"
              style={inputStyle}
            />
            {showAreaSuggestions && areaSuggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #E8EAED',
                borderRadius: '8px',
                maxHeight: '250px',
                overflowY: 'auto',
                zIndex: 1000,
                marginTop: '4px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
              }}>
                {areaSuggestions.map((area, index) => (
                  <div
                    key={index}
                    onClick={() => handleAreaSelect(area)}
                    style={{
                      padding: '10px 12px',
                      cursor: 'pointer',
                      borderBottom: index < areaSuggestions.length - 1 ? '1px solid #F0F0F0' : 'none',
                      color: '#333',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F9FF'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {area}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <button className='w-100'
      type="submit"
      style={buttonStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      SEARCH TENANT LIST
    </button>    </form>

    {/* Search Results Display */}
    {loadingResults && (
      <div className="text-center my-3">
        <span className="spinner-border text-primary" role="status" />
        <p className="mt-2">Searching...</p>
      </div>
    )}
    {searchError && (
      <div className="alert alert-danger text-center my-3">{searchError}</div>
    )}
    
    {/* Results Popup Modal */}
    {showResultsPopup && searchResults.length > 0 && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease-in-out',
        }}
      >
        <div
          style={{
            position: 'relative',
            backgroundColor: 'white',
            borderRadius: '18px',
            maxHeight: '85vh',
            overflowY: 'auto',
            width: '95%',
            maxWidth: '500px',
            padding: '20px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            animation: 'popupOpen 0.3s ease-in-out',
          }}
        >
          {/* Header with title and close button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#333' }}>
              Found {searchResults.length} Tenant{searchResults.length !== 1 ? 's' : ''}
            </h3>
            <button
              onClick={() => setShowResultsPopup(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#999',
                padding: '0',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>
          
          <div className="my-3 w-100">
        {searchResults.map((result) => {
          const getInitials = (name) => {
            return name ? name.split(' ').map(n => n.charAt(0)).join('').toUpperCase() : "T";
          };
          
          const formatPhoneNumber = (phone) => {
            if (!phone) return "N/A";
            return phone.toString().slice(0, -5) + "*****";
          };

          return (
            <div key={result._id} style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
              borderRadius: '12px',
              border: '2px solid #5B63D9',
              padding: '16px',
              marginBottom: '16px',
              boxShadow: '0 8px 24px rgba(91, 99, 217, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(91, 99, 217, 0.25), 0 4px 12px rgba(0, 0, 0, 0.12)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(91, 99, 217, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              {/* Header with Avatar, Name, RA ID, Date */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                {/* Avatar */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#5B63D9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {getInitials(result.raName)}
                </div>

                {/* Name and Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div>
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#000' }}>
                      {result.raName || "Tenant"}
                    </h5>
                    <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>Tenant</span>
                  </div>
                </div>

                {/* RA ID and Date */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: '500', color: '#666' }}>
                    RA ID: {result.Ra_Id || "N/A"}
                  </p>
                  <p style={{ margin: '0', fontSize: '11px', color: '#999' }}>
                    {result.createdAt ? new Date(result.createdAt).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA')}
                  </p>
                </div>
              </div>

              {/* Budget */}
              <div style={{
                backgroundColor: '#F5F5F5',
                padding: '8px 12px',
                borderRadius: '8px',
                marginBottom: '12px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333'
              }}>
                ₹ {result.minPrice || "N/A"} Lakhs   ₹ {result.maxPrice || "N/A"} Lakhs
              </div>

              {/* Property Details Tags */}
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '12px',
                padding: '12px',
                backgroundColor: '#FAFAFA',
                borderRadius: '8px'
              }}>
                <span style={{
                  backgroundColor: '#E8F0FE',
                  color: '#1F2937',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {result.propertyMode || "N/A"}
                </span>
                <span style={{
                  backgroundColor: '#E8F0FE',
                  color: '#1F2937',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {result.propertyType || "N/A"}
                </span>
                <span style={{
                  backgroundColor: '#E8F0FE',
                  color: '#1F2937',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {result.floorNo || "N/A"}
                </span>
                <span style={{
                  backgroundColor: '#E8F0FE',
                  color: '#1F2937',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {result.bedrooms ? `${result.bedrooms} BHK` : "N/A"}
                </span>
              </div>

              {/* Location */}
              <div style={{ marginBottom: '12px' }}>
                <p style={{ margin: '0', fontSize: '13px', color: '#333', fontWeight: '500' }}>
                  📍 {result.area || "N/A"}, {result.city || "N/A"}
                </p>
              </div>

              {/* Phone Number */}
              <div style={{ marginBottom: '16px' }}>
                <p style={{ margin: '0', fontSize: '13px', color: '#333' }}>
                  📞 Buyer Phone: {formatPhoneNumber(result.phoneNumber)}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '10px'
              }}>
                <button
                  onClick={() => {
                    if (isModal && typeof onClose === 'function') onClose();
                    navigate(`/detail-buyer-assistance/${result.Ra_Id}`);
                  }}
                  style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#5B5FA8',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#4A4A7F';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#5B5FA8';
                }}
                >
                  More
                </button>
              </div>
            </div>
          );
        })}
          </div>
          
          {/* Close Button at bottom */}
          <button
            onClick={() => setShowResultsPopup(false)}
            style={{
              width: '100%',
              padding: '12px',
              background: '#4F4B7E',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '20px',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#3D3A5C'}
            onMouseLeave={(e) => e.target.style.background = '#4F4B7E'}
          >
            Close
          </button>
        </div>
      </div>
    )}
    </div></div></div>
  );
};

const inputCardStyle = {
  display: 'flex',
  alignItems: 'center',
  border: '1px solid #4F4B7E',
  background: '#fff',
  padding: '4px',
  borderRadius: '5px',

};

const inputStyle = {
  flex: 1,
  padding: '8px',
  fontSize: '14px',
  border: 'none',
  outline: 'none',
};

const iconStyle = {
  color: '#4F4B7E',
  marginLeft: '10px',
};

export default FormComponent;
