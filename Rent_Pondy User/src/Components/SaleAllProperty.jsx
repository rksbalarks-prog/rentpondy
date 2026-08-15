
// import React from 'react';

// const SaleAllProperty = () => {
//   return (
//     <div style={{ height: '100%', width: '100%' }}>
//       <iframe
//         // src="https://rentpondy.com/sale-property"
//         src="http://localhost:3001/sale-property"
//         title="Sale Property"
//         style={{
//           width: '100%',
//           height: '100vh',
//           border: 'none',
//         }}
//       />
//     </div>
//   );
// };

// export default SaleAllProperty;











import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const SaleAllProperty = () => {
  const location = useLocation();

  // Get phone number from location state or localStorage
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";

  // Set in state
  const [phoneNumber, setPhoneNumber] = useState(storedPhoneNumber);


  return (
  // <iframe
  //   src={`https://ppcpondy.com/sale-property?phoneNumber=${encodeURIComponent(
  //     phoneNumber
  //   )}`}
  //   title="Sale Property"
  //   style={{
  //     width: "100%",
  //     border: "none",
  //              paddingTop: "144px",
  //              paddingBottom: "90px",
  //              scrollbarWidth: "none",
  //   }}
  // />
 <iframe
    src={`https://ppcpondy.com/sale-property?phoneNumber=${encodeURIComponent(phoneNumber)}`}
    title="Sale Property"
    style={{
      width: "100%",
height: "calc(100vh - 230px)",
      border: "none",
      scrollbarWidth: "none"
    }}
  />
 );

};


export default SaleAllProperty;






















// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';

// const SaleAllProperty = () => {
//   const location = useLocation();

//   // Get phone number from route or localStorage
//   const storedPhoneNumber =
//     location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";

//   const [phoneNumber, setPhoneNumber] = useState(storedPhoneNumber);

//   const openPpcPondyAppWithFallback = () => {
//     const phone = phoneNumber || "default";

//     const now = Date.now();

//     // Fallback to Play Store after short delay (if app not installed)
//     setTimeout(() => {
//       if (Date.now() - now < 2000) {
//         // Play Store fallback
//         window.location.href =
//           "https://play.google.com/store/apps/details?id=com.ppcpondy.app";
//       }
//     }, 1500);

//     // Try to open the Android app (via deep link intent)
//     window.location.href = `intent://sale-property?phone=${phone}#Intent;scheme=https;package=com.ppcpondy.app;end`;
//   };

//   return (
//     <div style={{ padding: '20px', textAlign: 'center' }}>
//       <h2>View Sale Property</h2>

//       <button
//         onClick={openPpcPondyAppWithFallback}
//         style={{
//           padding: '12px 24px',
//           fontSize: '16px',
//           borderRadius: '8px',
//           backgroundColor: '#28a745',
//           color: '#fff',
//           border: 'none',
//           cursor: 'pointer',
//         }}
//       >
//         Open PPC Pondy App
//       </button>
//     </div>
//   );
// };

// export default SaleAllProperty;











// // SaleAllProperty.jsx
// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';

// const SaleAllProperty = () => {
//   const location = useLocation();

//   const storedPhoneNumber =
//     location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";

//   const [phoneNumber, setPhoneNumber] = useState(storedPhoneNumber);

//   useEffect(() => {
//     const handleMessage = (event) => {
//       // Optional: You can restrict origin for security
//       // if (event.origin !== "https://ppcpondy.com") return;

//       if (event.data && event.data.action === "cardClicked") {
//         console.log("Property clicked:", event.data.data);
//         alert(`User clicked on property ID: ${event.data.data.id}`);
//       }
//     };

//     window.addEventListener("message", handleMessage);

//     return () => {
//       window.removeEventListener("message", handleMessage);
//     };
//   }, []);

//   return (
//     <div style={{ height: "100%", width: "100%" }}>
//       <iframe
//         src="https://ppcpondy.com/sale-property?phone="  phoneNumber
//         title="Sale Property"
//         style={{
//           width: "100%",
//           height: "100vh",
//           border: "none",
//         }}
//       />
//     </div>
//   );
// };

// export default SaleAllProperty;














// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';

// const SaleAllProperty = () => {
//   const location = useLocation();

//   // Get phone number from location state or localStorage
//   const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";

//   const [phoneNumber, setPhoneNumber] = useState(storedPhoneNumber);

//   useEffect(() => {
//     if (phoneNumber) {
//       localStorage.setItem("phoneNumber", phoneNumber);
//     }
//   }, [phoneNumber]);

//   useEffect(() => {
//     const handleMessage = async (event) => {
//       if (event.data?.type === 'PROPERTY_VIEW') {
//         const { ppcId } = event.data;

//         try {
//           const res = await axios.post(`${process.env.REACT_APP_API_URL}/save-property-view`, {
//             ppcId,
//             userPhoneNumber: phoneNumber,
//           });
//           console.log(res.data.message);
//         } catch (error) {
//           console.error('Error saving property view:', error);
//         }
//       }
//     };

//     window.addEventListener('message', handleMessage);
//     return () => window.removeEventListener('message', handleMessage);
//   }, [phoneNumber]);

//   // Send correct phoneNumber to iframe via postMessage
//   const handleIframeLoad = () => {
//     const iframe = document.getElementById('sale-iframe');
//     if (iframe && phoneNumber) {
//       iframe.contentWindow.postMessage(
//         { type: 'USER_PHONE_NUMBER', phoneNumber },
//         '*'
//       );
//     }
//   };

//   return (
//     <div style={{ height: '100%', width: '100%' }}>
//       <iframe
//         id="sale-iframe"
//         src="http://localhost:3001/sale-property"
//         title="Sale Property"
//         onLoad={handleIframeLoad}
//         style={{
//           width: '100%',
//           height: '100vh',
//           border: 'none',
//         }}
//       />
//     </div>
//   );
// };

// export default SaleAllProperty;
