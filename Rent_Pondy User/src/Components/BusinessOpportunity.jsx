import React, { useEffect, useState } from 'react'
import business from '../Assets/business.png'
import { FaArrowLeft, FaChevronLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';


export default function BusinessOpportunity() {

  const navigate = useNavigate();



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

  return (

   <div
   className="d-flex justify-content-center align-items-center"
   style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
 >
   <div
     style={{
       width: "450px",
       height: "100vh",
       overflow: "auto", // Enables scrolling if content overflows
       border: "1px solid #ccc",
       borderRadius: "10px",
       backgroundColor: "#fff",
     }}
   >

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
    </button> <h3 className="m-0 " style={{fontSize:"18px"}}>Business Opportunity </h3> </div>
    
     <style>
          {`
            /* Hide scrollbar for all browsers */
            div::-webkit-scrollbar {
              width: 0;
              height: 0;
            }

            div {
              -ms-overflow-style: none; /* IE and Edge */
              scrollbar-width: none; /* Firefox */
            }
          `}
        </style>
     <img
        src={business}
        alt="Scrollable"
       style={{ width: "100%", height: "auto" }}
     />
   </div>
 </div>
)
}



