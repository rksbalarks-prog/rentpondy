



import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { FaArrowLeft, FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function TermsAndCondition() {
    const [type, setType] = useState("terms&conditions"); 
       const [content, setContent] = useState();
   
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
        
       // Fetch existing content when component loads
       useEffect(() => {
           const fetchContent = async () => {
               try {
                   const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-text/${type}`);
                   setContent(response.data?.content || ""); // Set empty string if undefined
               } catch (error) {
                   setContent(""); // Ensure it doesn't break
               }
           };
   
           fetchContent();
       }, [type]); // Runs when `type` changes
   
      const navigate = useNavigate();



  return (
    <div  className="d-flex flex-column mx-auto custom-scrollbar"
    style={{
      maxWidth: '450px',
      height: '100vh',
      overflow: 'auto',
      scrollbarWidth: 'none', /* For Firefox */
      msOverflowStyle: 'none', /* For Internet Explorer */
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
            </button><h3 className="m-0" style={{fontSize:"18px"}}>Terms and Conditions </h3> </div>

    <div>
                <p dangerouslySetInnerHTML={{ __html: content }}></p>  
            </div>

</div> 
 )
}
