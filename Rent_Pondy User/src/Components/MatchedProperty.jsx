


// *************************************


// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const MatchedProperty = ({ filters }) => {
//   const [matchedProperties, setMatchedProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchMatchedProperties = async () => {
//       try {
//         console.log("Fetching properties with filters:", filters);

//         const params = new URLSearchParams(filters).toString();
//         const apiUrl = `${process.env.REACT_APP_API_URL}/fetch-matched-properties?${params}`;
//         console.log("API URL:", apiUrl);

//         const response = await axios.get(apiUrl);
//         console.log("API Response:", response.data);

//         setMatchedProperties(response.data.matchedProperties || []);
//       } catch (error) {
//         console.error("Error fetching matched properties:", error);
//         setError("Failed to fetch properties.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMatchedProperties();
//   }, [filters]);

//   if (loading) return <p>Loading properties...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div>
//       <h2>Matched Properties</h2>
//       {matchedProperties.length === 0 ? (
//         <p>No properties matched your criteria.</p>
//       ) : (
//         <ul>
//           {matchedProperties.map((property, index) => (
//             <li key={index}>
//               <h3>{property.propertyType} in {property.area}, {property.city}</h3>
//               <p>Price: ₹{property.price}</p>
//               <p>Mode: {property.propertyMode}</p>
//               <p><strong>Property ID:</strong> {property.rentId}</p>
//               <p><strong>Posted By (Phone):</strong> {property.phoneNumber}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default MatchedProperty;










// ******************





// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const MatchedProperty = ({ filters }) => {
//   const [matchedProperties, setMatchedProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchMatchedProperties = async () => {
//         try {
//           console.log("Fetching properties with filters:", filters);
      
//           const params = new URLSearchParams(filters).toString();
//           const apiUrl = `${process.env.REACT_APP_API_URL}/fetch-matched-properties?${params}`;
//           console.log("API URL:", apiUrl);
      
//           const response = await axios.get(apiUrl);
//           console.log("Full API Response:", response);
      
//           if (response.status !== 200) {
//             console.error("Unexpected response:", response);
//             setError(`Unexpected response: ${response.status}`);
//             return;
//           }
      
//           setMatchedProperties(response.data.matchedProperties || []);
//         } catch (error) {
//           console.error("Error fetching matched properties:", error);
      
//           if (error.response) {
//             console.error("Server responded with:", error.response.status, error.response.data);
//             setError(`Server error: ${error.response.status}`);
//           } else if (error.request) {
//             console.error("No response received from server.");
//             setError("No response from server.");
//           } else {
//             console.error("Request setup error:", error.message);
//             setError("Request setup error.");
//           }
//         } finally {
//           setLoading(false);
//         }
//       };
      

//     fetchMatchedProperties();
//   }, [filters]);

//   if (loading) return <p>Loading properties...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div>
//       <h2>Matched Properties</h2>
//       {matchedProperties.length === 0 ? (
//         <p>No properties matched your criteria.</p>
//       ) : (
//         <ul>
//           {matchedProperties.map((property, index) => (
//             <li key={index}>
//               <h3>{property.propertyType} {property.area}, {property.city}</h3>
//               <p>Price: ₹{property.price}</p>
//               <p>Mode: {property.propertyMode}</p>
//               <p><strong>Property ID:</strong> {property.rentId || "N/A"}</p>
//               <p><strong>Property ID:</strong> {property.rentId || "N/A"}</p>
//               <p><strong>Owner Name:</strong> {property.ownerName || "N/A"}</p>
//               <p><strong>Posted Owner (Phone):</strong> {property.phoneNumber || "Not Available"}</p>
            

//       {/* Display Property Image if available */}
//       {property.photos && property.photos.length > 0 ? (
//         <img
//           src={`http://localhost:5000/${property.photos[0]}`}
//           alt="Property"
//           className="img-fluid"
//           style={{ width: "100%", height: "160px", objectFit: "cover" }}
//         />
//       ) : (
//         <img
//           src="https://d17r9yv50dox9q.cloudfront.net/car_gallery/default.jpg"
//           alt="Default Property"
//           className="img-fluid"
//           style={{ width: "100%", height: "160px", objectFit: "cover" }}
//         />
//       )}


//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default MatchedProperty;











// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const MatchedProperty = () => {
//   const [matchedProperties, setMatchedProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  // const { phoneNumber } = useParams();

//   useEffect(() => {
//     const fetchMatchedProperties = async () => {
//       if (!phoneNumber) {
//         setError("Phone number is required");
//         setLoading(false);
//         return;
//       }

//       try {
//         console.log("Fetching properties for phone number:", phoneNumber);

//         const apiUrl = `${process.env.REACT_APP_API_URL}/fetch-matched-properties?phoneNumber=${encodeURIComponent(phoneNumber)}`;
//         console.log("API URL:", apiUrl);

//         const response = await axios.get(apiUrl);
//         console.log("Full API Response:", response.data);

//         if (response.status === 200 && response.data.matchedProperties) {
//           setMatchedProperties(response.data.matchedProperties);
//         } else {
//           console.error("Invalid response format:", response.data);
//           setError("Invalid response format.");
//         }
//       } catch (error) {
//         console.error("Error fetching matched properties:", error);
//         setError(error.response?.data?.message || "Error fetching properties.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMatchedProperties();
//   }, [phoneNumber]);

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-xl font-bold mb-4">Matched Properties</h2>

//       {loading && <p className="text-gray-500">Loading properties...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {/* Debugging Section */}
//       <div className="mb-4 p-2 bg-gray-200 text-sm">
//         <strong>Debugging Info:</strong>
//         <pre>{JSON.stringify(matchedProperties, null, 2)}</pre>
//       </div>

//       {!loading && matchedProperties.length === 0 && !error && (
//         <p className="text-gray-500">No properties found.</p>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {matchedProperties.map((property) => (
//           <div key={property._id} className="border rounded-lg shadow-md p-4 bg-white">
//             <h3 className="text-lg font-semibold">{property.propertyType}</h3>
//             <p className="text-gray-600"><strong>Mode:</strong> {property.propertyMode}</p>
//             <p className="text-gray-600"><strong>City:</strong> {property.city}</p>
//             <p className="text-gray-600"><strong>Area:</strong> {property.area}</p>
//             <p className="text-gray-600"><strong>Price:</strong> ₹{property.price?.toLocaleString() || "N/A"}</p>
//             <p className="text-gray-600"><strong>Facing:</strong> {property.facing || "N/A"}</p>
//             <p className="text-gray-600"><strong>Property Age:</strong> {property.propertyAge || "N/A"}</p>
//           </div>
//         ))}

        
//       </div>
//     </div>
//   );
// };

// export default MatchedProperty;









// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const MatchedProperty = () => {
//   const [matchedProperties, setMatchedProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  // const { phoneNumber } = useParams();


//   useEffect(() => {
//     const fetchMatchedProperties = async () => {
//       if (!phoneNumber) {
//         setError("Phone number is required");
//         setLoading(false);
//         return;
//       }

//       try {
//         const apiUrl = `${process.env.REACT_APP_API_URL}/fetch-matched-property?phoneNumber=${encodeURIComponent(phoneNumber)}`;
//         const response = await axios.get(apiUrl);

//         if (response.status === 200 && response.data.matchedProperties) {
//           setMatchedProperties(response.data.matchedProperties);
//         } else {
//           setError("Invalid response format.");
//         }
//       } catch (error) {
//         setError(error.response?.data?.message || "Error fetching properties.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMatchedProperties();
//   }, [phoneNumber]);



//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-xl font-bold mb-4">Matched Properties</h2>

//       {loading && <p className="text-gray-500">Loading properties...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {!loading && matchedProperties.length === 0 && !error && (
//         <p className="text-gray-500">No properties found.</p>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {matchedProperties.map((property) => (
//           <div key={property._id} className="border rounded-lg shadow-md p-4 bg-white">
//             <h3 className="text-lg font-semibold">{property.propertyType}</h3>
//             <p className="text-gray-600"><strong>Mode:</strong> {property.propertyMode}</p>
//             <p className="text-gray-600"><strong>City:</strong> {property.city}</p>
//             <p className="text-gray-600"><strong>Area:</strong> {property.area}</p>
//             <p className="text-gray-600"><strong>Price:</strong> ₹{property.price?.toLocaleString() || "N/A"}</p>
//             <p className="text-gray-600"><strong>Facing:</strong> {property.facing || "N/A"}</p>
//             <p className="text-gray-600"><strong>Property Age:</strong> {property.propertyAge || "N/A"}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MatchedProperty;

// -------------------------------------------------------------------------------------------


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const MatchedProperty = () => {
//   const [matchedProperties, setMatchedProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [buyerId, setBuyerId] = useState(null);
  // const { phoneNumber } = useParams();


//   useEffect(() => {
//     const fetchMatchedProperties = async () => {
//       try {
//         if (!phoneNumber) return;

//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/matched-properties-by-phone?phoneNumber=${encodeURIComponent(phoneNumber)}`
//         );

//         if (response.data.success) {
//           setBuyerId(response.data.buyerId);
//           setMatchedProperties(response.data.matchedProperties);
//         } else {
//           setError("No matched properties found.");
//         }
//       } catch (error) {
//         console.error("Error fetching matched properties:", error);
//         setError("Failed to load matched properties.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMatchedProperties();
//   }, [phoneNumber]);

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-xl font-bold mb-4">Matched Properties</h2>

//       {loading && <p>Loading properties...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {!loading && matchedProperties.length === 0 && !error ? (
//         <p>No matched properties found.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {matchedProperties.map((property) => (
//             <div key={property._id} className="border p-4 rounded-lg shadow">
//               <h3 className="text-lg font-semibold">{property.propertyType}</h3>
//               <p className="text-gray-600">
//                 {property.city}, {property.state}
//               </p>
//               <p className="text-gray-800 font-bold">₹ {property.price}</p>
//               <p className="text-gray-600">BHK: {property.bedrooms}</p>
//               <p className="text-gray-600">Facing: {property.facing}</p>
//               {property.photos?.length > 0 && (
//                 <img
//                   src={property.photos[0]}
//                   alt="Property"
//                   className="w-full h-40 object-cover mt-2 rounded"
//                 />
//               )}
//               <p className="text-sm mt-2">{property.description}</p>
//               <button className="mt-2 bg-blue-500 text-white py-1 px-4 rounded">
//                 View Details
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MatchedProperty;






// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const MatchedProperty = () => {
//   const [matchedProperties, setMatchedProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [buyerId, setBuyerId] = useState(null);
//   const { phoneNumber } = useParams();



//   useEffect(() => {
//     const fetchMatchedProperties = async () => {
//       try {
//         if (!phoneNumber) return;
        
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/matched-properties-by-phone/${phoneNumber}`
//         );

//         if (response.data.success) {
//           setBuyerId(response.data.buyerId);
//           setMatchedProperties(response.data.matchedProperties);
//         } else {
//           setError("No matched properties found.");
//         }
//       } catch (error) {
//         console.error("Error fetching matched properties:", error);
//         setError("Failed to load matched properties.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMatchedProperties();
//   }, [phoneNumber]);

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-xl font-bold mb-4">Matched Properties</h2>

//       {loading && <p>Loading properties...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {matchedProperties.length === 0 && !loading ? (
//         <p>No matched properties found.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {matchedProperties.map((property) => (
//             <div key={property._id} className="border p-4 rounded-lg shadow">
//               <h3 className="text-lg font-semibold">{property.propertyType}</h3>
//               <p className="text-gray-600">{property.city}, {property.state}</p>
//               <p className="text-gray-800 font-bold">₹ {property.price}</p>
//               <p className="text-gray-600">BHK: {property.bedrooms}</p>
//               <p className="text-gray-600">Facing: {property.facing}</p>
//               {property.photos?.length > 0 && (
//                 <img src={property.photos[0]} alt="Property" className="w-full h-40 object-cover mt-2 rounded" />
//               )}
//               <p className="text-sm mt-2">{property.description}</p>
//               <button className="mt-2 bg-blue-500 text-white py-1 px-4 rounded">
//                 View Details
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MatchedProperty;







///////////////


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const MatchedProperty = () => {
//   const [matchedProperties, setMatchedProperties] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const { phoneNumber } = useParams();

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!phoneNumber) return;

//       setLoading(true);
//       setError("");

//       try {
//         // 🔹 Step 1: Fetch Buyer ID
//         const buyerResponse = await axios.get(
//           `${process.env.REACT_APP_API_URL}/get-buyer-id/${phoneNumber}`
//         );

//         if (!buyerResponse.data.success) {
//           setError("Buyer not found.");
//           return;
//         }

//         const buyerId = buyerResponse.data.buyerId;

//         // 🔹 Step 2: Fetch Matched Properties using Buyer ID
//         const propertyResponse = await axios.get(
//           `${process.env.REACT_APP_API_URL}/fetch-all-data/${buyerId}`
//         );

//         if (!propertyResponse.data.success) {
//           setError("No matched properties found.");
//           return;
//         }

//         setMatchedProperties(propertyResponse.data.matchedProperties);
//       } catch (error) {
//         console.error("Error fetching matched properties:", error);
//         setError("Failed to load matched properties.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [phoneNumber]);

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-xl font-bold mb-4">Matched Properties</h2>

//       {loading && <p>Loading properties...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {matchedProperties.length === 0 && !loading ? (
//         <p>No matched properties found.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {matchedProperties.map((property) => (
//             <div key={property.rentId} className="border p-4 rounded-lg shadow">
//               <h3 className="text-lg font-semibold">{property.propertyType}</h3>
//               <p className="text-gray-600">
//                 {property.city}, {property.area}
//               </p>
//               <p className="text-gray-800 font-bold">{property.propertyMode}</p>
//               <p className="text-gray-600">Phone: {property.phoneNumber}</p>
//               <button className="mt-2 bg-blue-500 text-white py-1 px-4 rounded">
//                 View Details
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MatchedProperty;





// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const MatchedProperty = () => {
//   const [matchedProperties, setMatchedProperties] = useState([]);
//   const [buyerRequest, setBuyerRequest] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { phoneNumber } = useParams();

//   useEffect(() => {
//     const fetchAndFilterProperties = async () => {
//       if (!phoneNumber) {
//         setError("Phone number is required");
//         setLoading(false);
//         return;
//       }

//       try {
//         // Step 1: Fetch Buyer Request Data
//         const buyerRequestUrl = `${process.env.REACT_APP_API_URL}/fetch-buyer-request?phoneNumber=${encodeURIComponent(phoneNumber)}`;
//         const buyerResponse = await axios.get(buyerRequestUrl);

//         if (!buyerResponse.data.buyerRequest) {
//           setError("Buyer request not found.");
//           setLoading(false);
//           return;
//         }
//         const buyer = buyerResponse.data.buyerRequest;
//         setBuyerRequest(buyer);

//         // Step 2: Fetch All Property Listings
//         const propertyUrl = `${process.env.REACT_APP_API_URL}/fetch-all-data`;
//         const propertyResponse = await axios.get(propertyUrl);
//         const allProperties = propertyResponse.data.matchedProperties || [];

//         // Step 3: Filter Properties Based on Buyer Request
//         const filteredProperties = allProperties.filter((property) => 
//           property.propertyMode === buyer.propertyMode &&
//           property.propertyType === buyer.propertyType &&
//           property.city === buyer.city &&
//           property.area === buyer.area &&
//           property.price >= parseInt(buyer.minPrice) &&
//           property.price <= parseInt(buyer.maxPrice)
//         );

//         setMatchedProperties(filteredProperties);
//       } catch (error) {
//         setError(error.response?.data?.message || "Error fetching data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAndFilterProperties();
//   }, [phoneNumber]);

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-xl font-bold mb-4">Matched Properties</h2>

//       {loading && <p className="text-gray-500">Loading properties...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {!loading && matchedProperties.length === 0 && !error && (
//         <p className="text-gray-500">No properties found.</p>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {matchedProperties.map((property) => (
//           <div key={property._id} className="border rounded-lg shadow-md p-4 bg-white">
//             <h3 className="text-lg font-semibold">{property.propertyType}</h3>
//             <p className="text-gray-600"><strong>Mode:</strong> {property.propertyMode}</p>
//             <p className="text-gray-600"><strong>City:</strong> {property.city}</p>
//             <p className="text-gray-600"><strong>Area:</strong> {property.area}</p>
//             <p className="text-gray-600"><strong>Price:</strong> ₹{property.price?.toLocaleString() || "N/A"}</p>
//             <p className="text-gray-600"><strong>Facing:</strong> {property.facing || "N/A"}</p>
//             <p className="text-gray-600"><strong>Property Age:</strong> {property.propertyAge || "N/A"}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MatchedProperty;




// *******************



import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaRupeeSign, FaBed,  
  FaCalendarAlt, FaUserAlt, FaRulerCombined,
  FaCamera,
  FaEye,
  FaTelegramPlane
} from "react-icons/fa";
import { MdCall } from "react-icons/md";

import myImage from '../Assets/Rectangle 76.png'; // Correct path
import myImage1 from '../Assets/Rectangle 145.png'; // Correct path
import pic from '../Assets/Default image_PP-01.png'; // Correct path

const MatchedProperty = ({ filters }) => {
  const [matchedProperties, setMatchedProperties] = useState([]);
  const [removedProperties, setRemovedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchMatchedProperties = async () => {
      try {
        const params = new URLSearchParams(filters).toString();
        const apiUrl = `${process.env.REACT_APP_API_URL}/fetch-matched-properties?${params}`;
        const response = await axios.get(apiUrl);
        
        if (response.status !== 200) {
          setError(`Unexpected response: ${response.status}`);
          return;
        }
        
        setMatchedProperties(response.data.matchedProperties || []);
      } catch (error) {
        setError(error.response ? `Server error: ${error.response.status}` : "Request error");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatchedProperties();
  }, [filters]);

  const handleDelete = async (property) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/delete-detail-property`, { rentId: property.rentId });
      setRemovedProperties([...removedProperties, property]);
      setMatchedProperties(matchedProperties.filter(p => p.rentId !== property.rentId));
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  const handleUndoDelete = async (property) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/undo-delete-detail`, { rentId: property.rentId });
      setMatchedProperties([...matchedProperties, property]);
      setRemovedProperties(removedProperties.filter(p => p.rentId !== property.rentId));
    } catch (error) {
      console.error("Error undoing delete:", error);
    }
  };

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div  className="container d-flex flex-column align-items-center" style={{ maxWidth: "500px" }}>
      <div className="w-100">
        <button className="w-50" style={{background:"#4F4B7E", color:"#fff"}} onClick={() => setActiveTab("all")}>All Properties</button>
        <button className="w-50" style={{background:"#FF0000", color:"#fff"}} onClick={() => setActiveTab("removed")}>Removed Properties</button>
      </div>
      
      {activeTab === "all" && (
        // <ul>
        //   {matchedProperties.map((property) => (
        //     <li key={property.rentId}>
        //       <h3>{property.propertyType} {property.area}, {property.city}</h3>
        //       <p>Price: ₹{property.price}</p>
        //       <p>Mode: {property.propertyMode}</p>
        //       <p><strong>Property ID:</strong> {property.rentId || "N/A"}</p>
        //       <p><strong>Owner Name:</strong> {property.ownerName || "N/A"}</p>
        //       <p><strong>Phone:</strong> {property.phoneNumber || "Not Available"}</p>
        //       <button onClick={() => handleDelete(property)}>Remove</button>
        //     </li>
        //   ))}
        // </ul>
        <div className="container" style={{fontFamily: "Inter, sans-serif",}}>
        <div className="row mt-4 rounded-4  mb-1">
      {matchedProperties.map((property) => (
           <div className="row g-0 rounded-4 mb-1" style={{ border: '1px solid #ddd', overflow: "hidden", background:"#EFEFEF" }}>
           <div className="col-md-4 col-4 d-flex flex-column justify-content-between align-items-center">
           <div className="text-white py-1 px-2 text-center" style={{ width: '100%', background: "#4F4B7E" }}>
        PUC- {property.rentId}
        </div>
        <div
        style={{
        backgroundImage: property.photos && property.photos.length > 0
        ? `url("http://localhost:5000/${property.photos[0]}")`
        : `url("${pic}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "160px", // Adjust height as needed
        }}
        >
        <div style={{ position: "relative", width: "100%", height:'100%'}}>
        <div className="d-flex justify-content-between w-100" style={{ position: "absolute",
        bottom: "0px"}}>
        <span className="d-flex justify-content-center align-items-center" style={{ color:'#fff', background:`url(${myImage}) no-repeat center center`, fontSize:'12px', width:'50px' }}>
        <FaCamera className="me-1"/> 1
        </span>
        <span className="d-flex justify-content-center align-items-center" style={{ color:'#fff', background:`url(${myImage1}) no-repeat center center`, fontSize:'12px', width:'50px' }}>
        <FaEye className="me-1" />1
        </span>
        </div>
        </div>
        </div>
      
        
           </div>
           <div className="col-md-8 col-8 ps-2">
            <div className="d-flex justify-content-between"><p className="m-0" style={{ color:'#5E5E5E' , fontWeight:'normal' }}>{property.propertyMode || 'N/A'}</p>
            <p className="mb-0 ps-3 pe-3 text-center pt-1" style={{background:"#FF0000", color:"white", cursor:"pointer" , borderRadius: '0px 0px 0px 15px', fontSize:"12px"}} onClick={() => handleDelete(property)}>REMOVED</p>
            </div>
             <p className="fw-bold m-0" style={{ color:'#000000' }}>{property.propertyType || 'N/A'}</p>
             <p className='m-0' style={{ color:'#5E5E5E'}}>{property.city || 'N/A'}</p>
             <div className="card-body ps-2 m-0 pt-0 pe-2 d-flex flex-column justify-content-center">
               <div className="row">
                 <div className="col-6 d-flex align-items-center mt-1 mb-1">
                   <FaRulerCombined className="me-2" color="#4F4B7E" /> <span style={{ fontSize:'13px', color:'#5E5E5E' , fontWeight:'medium' }}>{property.totalArea || 'N/A'}</span>
                 </div>
                 <div className="col-6 d-flex align-items-center mt-1 mb-1">
                   <FaBed className="me-2" color="#4F4B7E"/> <span style={{ fontSize:'13px', color:'#5E5E5E' }}>{property.bedrooms || 'N/A'}</span>
                 </div>
                 <div className="col-6 d-flex align-items-center mt-1 mb-1">
                   <FaUserAlt className="me-2" color="#4F4B7E"/> <span style={{ fontSize:'13px', color:'#5E5E5E' }}>{property.postedBy || 'N/A'}</span>
                 </div>
                 <div className="col-6 d-flex align-items-center mt-1 mb-1">
                   <FaCalendarAlt className="me-2" color="#4F4B7E"/> <span style={{ fontSize:'13px', color:'#5E5E5E' }}>{property.bestTimeToCall || 'N/A'}</span>
                 </div>
             
                    <div className="col-12 d-flex flex-col align-items-center mt-1 mb-1">
                                 <h6 className="m-0">
                                 <span style={{ fontSize:'17px', color:'#4F4B7E', fontWeight:'bold', letterSpacing:"1px" }}> <FaRupeeSign className="me-2" color="#4F4B7E"/>{property.price ? property.price.toLocaleString('en-IN') : 'N/A'}
                                 </span> 
                   <span style={{ color: '#4F4B7E', fontSize: '13px', marginLeft: "5px", fontSize: '11px' }}>
                                / {property.rentType || "N/A"}
                               </span>
                                   </h6>
                                </div>
                                {/* <div className="col-6 d-flex align-items-center mt-1 mb-1">
                                 <MdCall  className="me-2" color="#4F4B7E"/> <span style={{ fontSize:'13px', color:'#2E7480' }}>{property.interestedUser || 'N/A'}</span>
                               </div> */}
                               <p className="m-0 pt-2" style={{ color: "#2E7480" }}>
      <a href={`tel:${property.interestedUser}`} style={{ textDecoration: 'none', color: '#2E7480' }}>
        <MdCall className="me-2" color="#4F4B7E" /> {property.phoneNumber || "N/A"}
      </a>
    </p>
    
                </div>
              </div>
            </div>
            <div style={{border:"2px solid grey", borderBottomRightRadius:"18px", borderBottomLeftRadius:"18px"}}>
                          <div className="row"> <span className="text-center col-9" style={{color:"#0F9F2C"}}>Matched Property to BA ID: 3541 
                          </span><span className="col-3" style={{color:"#4F4B7E"}}>Expand<FaTelegramPlane /></span></div>
                       </div>
         </div>
          ))}
        </div>
        </div>
      )}
      
      {activeTab === "removed" && (
        // <ul>
        //   {removedProperties.map((property) => (
        //     <li key={property.rentId}>
        //       <h3>{property.propertyType} {property.area}, {property.city}</h3>
        //       <p>Price: ₹{property.price}</p>
        //       <button onClick={() => handleUndoDelete(property)}>Undo</button>
        //     </li>
        //   ))}
        // </ul>
        <div className="container mt-5">
        <div className="row">
          {removedProperties.length > 0 ? (
            removedProperties.map((property) => (
        <div className="row g-0 rounded-4 mb-1" style={{ border: '1px solid #ddd', overflow: "hidden", background:"#EFEFEF"}}>
                         <div className="col-md-4 col-4 d-flex flex-column justify-content-between align-items-center">
                         <div className="text-white py-1 px-2 text-center" style={{ width: '100%', background: "#4F4B7E" }}>
        PUC- {property.rentId}
        </div>
       
        <div
        style={{
        backgroundImage: property.photos && property.photos.length > 0
        ? `url("http://localhost:5000/${property.photos[0]}")`
        : `url("${pic}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "160px", // Adjust height as needed
        }}
        >
        <div style={{ position: "relative", width: "100%", height:'100%'}}>
        <div className="d-flex justify-content-between w-100" style={{ position: "absolute",
        bottom: "0px"}}>
        <span className="d-flex justify-content-center align-items-center" style={{ color:'#fff', background:`url(${myImage}) no-repeat center center`, fontSize:'12px', width:'50px' }}>
        <FaCamera className="me-1"/> 1
        </span>
        <span className="d-flex justify-content-center align-items-center" style={{ color:'#fff', background:`url(${myImage1}) no-repeat center center`, fontSize:'12px', width:'50px' }}>
        <FaEye className="me-1" />1
        </span>
        </div>
        </div>
        </div>
        
       
        
                         </div>
                         <div className="col-md-8 col-8 p-0">
                          <div className="d-flex justify-content-between"><p className="mb-1 fw-bold" style={{ color:'#5E5E5E' }}>{property.propertyMode || 'N/A'}</p>
                          <p className="m-0 ps-3 pe-3" style={{background:"green", color:"white", cursor:"pointer", borderRadius: '0px 0px 0px 15px'}} onClick={() => handleUndoDelete(property)}>UNDO</p>
                          </div>
                           <p className="fw-bold m-0" style={{ color:'#000000' }}>{property.propertyType || 'N/A'}</p>
                           <p className=" fw-bold m-0" style={{ color:'#5E5E5E'}}>{property.city || 'N/A'}</p>
                           <div className="card-body ps-2 m-0 pt-0 pe-2 d-flex flex-column justify-content-center">
                             <div className="row">
                               <div className="col-6 d-flex align-items-center mt-1 mb-1">
                                 <FaRulerCombined className="me-2" color="#4F4B7E" /> <span style={{ fontSize:'13px', color:'#5E5E5E' }}>{property.totalArea || 'N/A'}</span>
                               </div>
                               <div className="col-6 d-flex align-items-center mt-1 mb-1">
                                 <FaBed className="me-2" color="#4F4B7E"/> <span style={{ fontSize:'13px', color:'#5E5E5E' }}>{property.bedrooms || 'N/A'}</span>
                               </div>
                               <div className="col-6 d-flex align-items-center mt-1 mb-1">
                                 <FaUserAlt className="me-2" color="#4F4B7E"/> <span style={{ fontSize:'13px', color:'#5E5E5E' }}>{property.postedBy || 'N/A'}</span>
                               </div>
                               <div className="col-6 d-flex align-items-center mt-1 mb-1">
                                 <FaCalendarAlt className="me-2" color="#4F4B7E"/> <span style={{ fontSize:'13px', color:'#5E5E5E' }}>{property.bestTimeToCall || 'N/A'}</span>
                               </div>
                              
                               <div className="col-12 d-flex flex-col align-items-center mt-1 mb-1">
                                 <h6 className="m-0">
                                 <span style={{ fontSize:'17px', color:'#4F4B7E', fontWeight:'bold', letterSpacing:"1px" }}> <FaRupeeSign className="me-2" color="#4F4B7E"/>{property.price ? property.price.toLocaleString('en-IN') : 'N/A'}
                                 </span> 
                                 <span style={{ color:'#4F4B7E', fontSize:'13px', marginLeft:"5px",fontSize:'11px',}}> 
                                 Negotiable                </span> 
                                   </h6>
                                </div>
                               <div className="col-6 d-flex align-items-center mt-1 mb-1">
                                 <MdCall  className="me-2" color="#4F4B7E"/> <span style={{ fontSize:'13px', color:'#2E7480' }}>{property.phoneNumber || 'N/A'}</span>
                               </div>
                              </div>
                            </div>
                          </div>
                          <div style={{border:"2px solid grey", borderBottomRightRadius:"18px", borderBottomLeftRadius:"18px"}}>
                          <div className="row"> <span className="text-center col-9" style={{color:"#0F9F2C"}}>Matched Property to BA ID: 3541 
                          </span><span className="col-3" style={{color:"#4F4B7E"}}>Expand<FaTelegramPlane /></span></div>
                       </div>
                       </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p>No removed properties found.</p>
            </div>
          )}
        </div>
        </div>
      )}
    </div>
  );
};

export default MatchedProperty;
