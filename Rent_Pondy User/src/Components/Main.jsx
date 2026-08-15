

import React, { useEffect, useState , useRef } from 'react';
import TopBar from './TopBar';
import BottomNavigation from './BottomNavigation';
import AnimatedLogo from './AnimatedLogo';
import { FaHome, FaBuilding, FaPlusSquare, FaUser, FaEllipsisH, FaUmbrellaBeach } from 'react-icons/fa';
import logo from '../Assets/ppc_sentyourinterest.png';
import logo2 from '../Assets/allprop50.png';
import logo3 from '../Assets/bl50.png';
import logo7 from '../Assets/fprop50.png';
import nvprop50 from '../Assets/nvprop50.PNG';
import logo9 from '../Assets/my50.png';
import logo10 from '../Assets/seller50.png';
import logo11 from '../Assets/buyer50.PNG';
import mapicon from '../Assets/locations.png';
import salee from '../Assets/Sale Property-01.png';
import OwnerMenu from './OwnerMenu';
import BuyerMenu from './BuyerMenu';
import Navbar from "./Navbar";
import PyProperty from './PyProperty';
import navBg from '../Assets/bottomimg.png'
import Groom from './Groom';
import Bride from './Bride';
import groom from '../Assets/groom.PNG';
import Nopage from './Nopage';
import NotViewProperty from './NotViewProperty';
import AllProperty from './AllProperty';
import FeatureProperty from './FeatureProperty';
import UsedCars from './UsedCars';
import SaleProperty from './SaleProperty';
import AddProperty from './AddProperty';
import MoreComponent from './MoreComponent';
import { motion, AnimatePresence } from "framer-motion";
import PropertyMap from './PropertyMap';
import BuyerLists from './BuyerLists';
import ZeroView from './ZeroView';
import MyProperty from './MyProperty';
import PropertyVideos from './PropertyVideo';
import SaleAllProperty from './SaleAllProperty';
import PayNow from './PayNow';
import { useLocation, useNavigate } from 'react-router-dom';


const Main = ({ phoneNumber: propPhoneNumber , viewportHeight}) => {
  const [mainPhoneNumber, setMainPhoneNumber] = useState(''); // Renamed to avoid conflict

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get from props or localStorage
    const storedPhone = localStorage.getItem('phoneNumber');
    let phoneDigits = '';

    if (propPhoneNumber) {
      phoneDigits = propPhoneNumber.replace(/\D/g, '').slice(-10);
    } else if (storedPhone) {
      phoneDigits = storedPhone.replace(/\D/g, '').slice(-10);
    }

    if (phoneDigits.length === 10) {
      setMainPhoneNumber(phoneDigits);
    } else {
      navigate('/login');
    }
  }, [propPhoneNumber, navigate]);

  // Get phone number from props, location state, or localStorage
  const { phoneNumber: statePhoneNumber, countryCode: stateCountryCode } = location.state || {};
  const storedPhoneNumber = localStorage.getItem('phoneNumber');
  const storedCountryCode = localStorage.getItem('countryCode');

  // Determine the final phone number to use
  const phoneNumber = propPhoneNumber || statePhoneNumber || storedPhoneNumber;
  const countryCode = stateCountryCode || storedCountryCode || '91'; // Default to India

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

   const [activeContent, setActiveContent] = useState('topAllProperty');
  useEffect(() => {
    localStorage.setItem('lastActiveContent', activeContent);
  }, [activeContent]);
    const previousContent = useRef(activeContent);

    const [direction, setDirection] = useState("right");
useEffect(() => {
  const prevIndex = topBarItems.findIndex(item => item.content === previousContent.current);
  const currentIndex = topBarItems.findIndex(item => item.content === activeContent);

  if (prevIndex !== -1 && currentIndex !== -1) {
    setDirection(currentIndex < prevIndex ? "left" : "right");
    previousContent.current = activeContent;
  }
}, [activeContent]);

  const topBarItems = [
    { icon: logo, text: 'Commercial / Lease', content: 'topPyProperty', isAnimated: false },
    { icon: logo2, text: 'All Property', content: 'topAllProperty', isAnimated: false },
    { iconNode: <FaUmbrellaBeach size={26} color="#FF7043" />, text: 'Tourist Place', route: '/exclusiveDetail', isAnimated: false },
    { icon: logo3, text: 'Tenant List', content: 'topMBuyerList', isAnimated: false },
    { icon: mapicon, text: 'Property Map', content: 'topPropertyMap', isAnimated: false },
    { icon: salee, text: 'sale Property', content: 'topSaleProperty', isAnimated: false },

    { icon: logo7, text: 'Feature Property', content: 'topFeatureProperty', isAnimated: false },

            { icon: groom, text: 'Groom', content: 'topGroom', isAnimated: false },
        { icon: groom, text: 'Bride', content: 'topBride', isAnimated: false },
{ icon: groom, text: 'Rental Property Video', content: 'topPropertyVideo', isAnimated: false },

    { icon: nvprop50, text: 'Not View Property', content: 'topNotViewProperty', isAnimated: false },
    { icon: logo9, text: 'My Property', content: 'topMyProperty', isAnimated: false },
    { icon: logo10, text: 'Owner Menu', content: 'topOwnerMenu', isAnimated: false },
    { icon: logo11, text: 'Tenant Menu', content: 'topBuyerMenu', isAnimated: false },
  ];

  const renderContent = () => {
    switch (activeContent) {
      case 'topPyProperty': return <PyProperty />;
      case 'topAllProperty': return <AllProperty  />;

      case 'topPropertyMap': return <PropertyMap />;
      case 'topSaleProperty': return <SaleAllProperty />;

         case 'topGroom': return <Groom />;
      case 'topBride': return <Bride />;
case 'topPropertyVideo': return <PropertyVideos />;

      case 'topMBuyerList': return <BuyerLists />;
      case 'topFeatureProperty': return <FeatureProperty />;
      case 'topNotViewProperty': return <ZeroView />;
      case 'topMyProperty': return <MyProperty  />;
      case 'topOwnerMenu': return <OwnerMenu />;
      case 'topBuyerMenu': return <BuyerMenu />;
      case 'bottomMore': return <MoreComponent />;
      default: return <Nopage />;
    }
  };

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  
  
useEffect(() => {
    const handleResize = () => {
      const heightRatio = window.innerHeight / window.screen.height;
      const isKeyboardVisible = heightRatio < 0.75;
      const nav = document.getElementById("bottom-nav");
  
      if (nav) {
        nav.style.display = isKeyboardVisible ? "none" : "block";
      }
    };
    if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", handleResize);
  } else {
    window.addEventListener("resize", handleResize);
  }

  return () => {
    if (window.visualViewport) {
      window.visualViewport.removeEventListener("resize", handleResize);
    } else {
      window.removeEventListener("resize", handleResize);
    }
  };
  }, []);


  return (
      <div className="d-flex justify-content-center align-items-center"
         style={{ minHeight: `${viewportHeight}px`, background: '#E5E5E5' }}>
    
<div style={{
        maxWidth: '470px',
        width: "100%",
        background: 'white',
        display: "flex",
        flexDirection: "column",
        height: `${viewportHeight}px`,
        overflow: "hidden",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
      }}
>
  {/* Navbar - fixed top */}
 <div className="position-fixed top-0 start-50 translate-middle-x"
             style={{ width: "100%", maxWidth: "470px", zIndex: 1050 }}>
         
    <Navbar />
  </div>

  {/* TopBar - fixed below navbar */}
        <div className="position-fixed start-50 translate-middle-x"
              style={{ top: "60px", width: "100%", maxWidth: "470px", zIndex: 1040 }}>

    <TopBar
      items={topBarItems}
      setActive={setActiveContent}
      activeItem={activeContent}
    />
  </div>
      <div
        className="flex-grow-1 mx-auto"
             style={{
               width: "100%",
               maxWidth: "470px",
               overflowY: "auto",
               paddingTop: "100px",
               paddingBottom: "90px",
               scrollbarWidth: "none",
               position: "relative"
             }}
      >
        <AnimatePresence mode="wait">
           <motion.div
      key={activeContent}
      initial={{ x: direction === "right" ? "100%" : "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction === "right" ? "-100%" : "100%", opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      //  style={{
      //          width: "100%",
      //          maxWidth: "470px",
      //          overflowY: "auto",
      //          paddingTop: "144px",
      //          paddingBottom: "90px",
      //          scrollbarWidth: "none",
      //          position: "relative"
      //        }}
    >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
  {/* Floating Pay Now button + amount modal */}
  <PayNow phoneNumber={phoneNumber} />
  {/* Bottom Navigation */}
  <div
    // style={{
    //   position: isMobile ? "relative" : "fixed",
    //   bottom: isMobile ? "unset" : 0,
    //   left: isMobile ? "unset" : "50%",
    //   transform: isMobile ? "none" : "translateX(-50%)",
    //   backgroundImage: `url(${navBg})`,
    //   backgroundRepeat: "no-repeat",
    //   backgroundPosition: "center",
    //   backgroundSize: "cover",
    //   width: "100%",
    //   maxWidth: "472px",
    //   zIndex: 1050,
    // }}
    className={isMobile ? "" : "position-fixed bottom-0 start-50 translate-middle-x"}
             style={{
               backgroundImage: `url(${navBg})`,
               backgroundRepeat: 'no-repeat',
               backgroundPosition: 'center',
               backgroundSize: 'cover',
               width: "100%",
               maxWidth: "472px",
               zIndex: 1050,
             }}
    id="bottom-nav"
  >
    <BottomNavigation
      activeItem={activeContent}
      setActive={setActiveContent}
    />
  </div>
</div>

{/* AI assistant is now mounted app-wide in RouterPage.jsx (outside <Routes>) so
    voice mode survives navigation to the detail page and back. */}

</div>


  );
};

export default Main;









































// import React, { useEffect, useState , useRef } from 'react';
// import TopBar from './TopBar';
// import BottomNavigation from './BottomNavigation';
// import { FaHome, FaBuilding, FaPlusSquare, FaUser, FaEllipsisH } from 'react-icons/fa';
// // import MoreComponent from './MoreComponent';
// // import MyProperty from './MyProperty';
// // import PropertyCards from './PropertyCards';
// // import axios from 'axios';
// // import { useLocation, useNavigate } from 'react-router-dom';
// // import AddProps from './AddProps';
// import logo from '../Assets/ppc_sentyourinterest.png';
// import logo2 from '../Assets/allprop50.png';
// import logo3 from '../Assets/bl50.png';
// import logo7 from '../Assets/fprop50.png';
// import nvprop50 from '../Assets/nvprop50.PNG';
// import logo9 from '../Assets/my50.png';
// import logo10 from '../Assets/seller50.png';
// import logo11 from '../Assets/buyer50.PNG';
// import mapicon from '../Assets/locations.png';
// import salee from '../Assets/Sale Property-01.png';

// // import PropertyForm from './PropertyAssistance';
// import OwnerMenu from './OwnerMenu';
// import BuyerMenu from './BuyerMenu';
// // import ZeroView from './ZeroView';
// import Navbar from "./Navbar";
// // import FeaturedProperty from './FeatureProperty';
// // import BuyerLists from './BuyerLists';
// import PyProperty from './PyProperty';
// // import AllProperty from './AllProperty';
// // import PropertyMap from './PropertyMap';
// import navBg from '../Assets/bottomimg.png'
// import Groom from './Groom';
// import Bride from './Bride';
// import groom from '../Assets/groom.PNG';
// import Nopage from './Nopage';
// import NotViewProperty from './NotViewProperty';
// import AllProperty from './AllProperty';
// import FeatureProperty from './FeatureProperty';
// import UsedCars from './UsedCars';
// import SaleProperty from './SaleProperty';
// import AddProperty from './AddProperty';
// import MoreComponent from './MoreComponent';
// import { motion, AnimatePresence } from "framer-motion";
// import PropertyMap from './PropertyMap';
// import BuyerLists from './BuyerLists';
// import ZeroView from './ZeroView';
// import MyProperty from './MyProperty';
// import PropertyVideos from './PropertyVideo';
// import SaleAllProperty from './SaleAllProperty';


// const Main = () => {



//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     document.documentElement.style.overflow = "hidden";

//     return () => {
//       document.body.style.overflow = "";
//       document.documentElement.style.overflow = "";
//     };
//   }, []);




//   // const [activeContent, setActiveContent] = useState(() => {
//   //   return localStorage.getItem('lastActiveContent') || 'topPyProperty';
//   // });
//    const [activeContent, setActiveContent] = useState('topPyProperty');
//   useEffect(() => {
//     localStorage.setItem('lastActiveContent', activeContent);
//   }, [activeContent]);
//     const previousContent = useRef(activeContent);

//     const [direction, setDirection] = useState("right");
// useEffect(() => {
//   const prevIndex = topBarItems.findIndex(item => item.content === previousContent.current);
//   const currentIndex = topBarItems.findIndex(item => item.content === activeContent);

//   if (prevIndex !== -1 && currentIndex !== -1) {
//     setDirection(currentIndex < prevIndex ? "left" : "right");
//     previousContent.current = activeContent;
//   }
// }, [activeContent]);

//   const topBarItems = [
//     { icon: logo, text: 'Py Property', content: 'topPyProperty' },
//     { icon: logo2, text: 'All Property', content: 'topAllProperty' },
//         { icon: mapicon, text: 'Property Map', content: 'topPropertyMap' },
//         { icon: salee, text: 'sale Property', content: 'topSaleProperty' },

//     { icon: logo3, text: 'Tenant List', content: 'topMBuyerList' },
//     { icon: logo7, text: 'Feature Property', content: 'topFeatureProperty' },

//             { icon: groom, text: 'Groom', content: 'topGroom' },
//         { icon: groom, text: 'Bride', content: 'topBride' },
// { icon: groom, text: 'Rental Property Video', content: 'topPropertyVideo' },

//     { icon: nvprop50, text: 'Not View Property', content: 'topNotViewProperty' },
//     { icon: logo9, text: 'My Property', content: 'topMyProperty' },
//     { icon: logo10, text: 'Owner Menu', content: 'topOwnerMenu' },
//     { icon: logo11, text: 'Buyer Menu', content: 'topBuyerMenu' },
//   ];

//   // const bottomNavItems = [
//   //   { icon: <FaHome />, text: 'Home', content: 'bottomHome' },
//   //   { icon: <FaBuilding />, text: 'MyProperty', content: 'bottomProperty' },
//   //   { icon: <FaPlusSquare />, text: 'AddProperty', content: 'bottomAdd' },
//   //   { icon: <FaUser />, text: 'Buyer', content: 'bottomBuyer' },
//   //   { icon: <FaEllipsisH />, text: 'More', content: 'bottomMore' },
//   // ];

//   const renderContent = () => {
//     switch (activeContent) {
//       case 'topPyProperty': return <PyProperty />;
//       case 'topAllProperty': return <AllProperty  />;
//             // case 'topPropertyMap': return <PropertyMap />;

//       case 'topPropertyMap': return <PropertyMap />;
//       case 'topSaleProperty': return <SaleAllProperty />;

//          case 'topGroom': return <Groom />;
//       case 'topBride': return <Bride />;
// case 'topPropertyVideo': return <PropertyVideos />;

//       case 'topMBuyerList': return <BuyerLists />;
//       case 'topFeatureProperty': return <FeatureProperty />;
//       case 'topNotViewProperty': return <ZeroView />;
//       case 'topMyProperty': return <MyProperty  />;
//       case 'topOwnerMenu': return <OwnerMenu />;
//       case 'topBuyerMenu': return <BuyerMenu />;
//       // case 'bottomHome': return <PyProperty  />;
//     //   case 'bottomProperty': return <MyProperty  />;
//     //   case 'bottomAdd': return <AddProps  />;
//     //   case 'bottomBuyer': return <PropertyForm  />;
//       case 'bottomMore': return <MoreComponent />;
//       default: return <Nopage />;
//     }
//   };

//   const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  
  
// useEffect(() => {
//     const handleResize = () => {
//       const heightRatio = window.innerHeight / window.screen.height;
//       const isKeyboardVisible = heightRatio < 0.75;
//       const nav = document.getElementById("bottom-nav");
  
//       if (nav) {
//         nav.style.display = isKeyboardVisible ? "none" : "block";
//       }
//     };
//     if (window.visualViewport) {
//     window.visualViewport.addEventListener("resize", handleResize);
//   } else {
//     window.addEventListener("resize", handleResize);
//   }

//   return () => {
//     if (window.visualViewport) {
//       window.visualViewport.removeEventListener("resize", handleResize);
//     } else {
//       window.removeEventListener("resize", handleResize);
//     }
//   };
//     // window.addEventListener("resize", handleResize);
//     // return () => window.removeEventListener("resize", handleResize);
//   }, []);


//   return (
// <div
//   style={{
//     width: "100%",
//     maxWidth: "470px",
//     background: "white",
//     display: "flex",
//     flexDirection: "column",
//  height: '100vh',
//      overflow: "hidden",
//     boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
//     margin: "0 auto", // centers the Main wrapper horizontally
//     position: "relative",
//   }}
// >
//   {/* Navbar - fixed top */}
//   <div
//     style={{
//       position: "fixed",
//       top: 0,
//       left: "50%",
//       transform: "translateX(-50%)",
//       width: "100%",
//       maxWidth: "470px",
//       zIndex: 1050,
//     }}
//   >
//     <Navbar />
//   </div>

//   {/* TopBar - fixed below navbar */}
//   <div
//     style={{
//       position: "fixed",
//       top: "60px",
//       left: "50%",
//       transform: "translateX(-50%)",
//       width: "100%",
//       maxWidth: "470px",
//       zIndex: 1040,
//     }}
//   >
//     <TopBar
//       items={topBarItems}
//       setActive={setActiveContent}
//       activeItem={activeContent}
//     />
//   </div>

//   {/* Scrollable Content Area */}
//   {/* <div className='ps-2 pe-2'
//     style={{
//       height:"100%",
//       flexGrow: 1,
//       width: "100%",
//       overflowY: "scroll",
//       paddingTop: "135px",
//       paddingBottom: "90px",
//       scrollbarWidth: "none",
//     }}
//   >
//     {renderContent()}
//   </div> */}
//    {/* Animated Content Area */}
//       <div
//         className="ps-2 pe-2"
//         style={{
//           height: "100%",
//           flexGrow: 1,
//           width: "100%",
//           overflowY: "scroll",
//           paddingTop: "135px",
//           paddingBottom: "90px",
//           scrollbarWidth: "none",
//           position: "relative", // Needed for animation positioning
//         }}
//       >
//         <AnimatePresence mode="wait">
//            <motion.div
//       key={activeContent}
//       initial={{ x: direction === "right" ? "100%" : "-100%", opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       exit={{ x: direction === "right" ? "-100%" : "100%", opacity: 0 }}
//       transition={{ duration: 0.3, ease: "easeInOut" }}
//       style={{ width: "100%" }}
//     >
//             {renderContent()}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//   {/* Bottom Navigation */}
//   <div
//     style={{
//       position: isMobile ? "relative" : "fixed",
//       bottom: isMobile ? "unset" : 0,
//       left: isMobile ? "unset" : "50%",
//       transform: isMobile ? "none" : "translateX(-50%)",
//       backgroundImage: `url(${navBg})`,
//       backgroundRepeat: "no-repeat",
//       backgroundPosition: "center",
//       backgroundSize: "cover",
//       width: "100%",
//       maxWidth: "472px",
//       zIndex: 1050,
//     }}
//     id="bottom-nav"
//   >
//     <BottomNavigation
//       activeItem={activeContent}
//       setActive={setActiveContent}
//     />
//   </div>
// </div>




//   );
// };

// export default Main;

















