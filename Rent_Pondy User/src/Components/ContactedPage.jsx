













import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaGlobe, FaUser, FaPhone, FaArrowLeft, FaChevronLeft } from 'react-icons/fa';
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import logo from '../Assets/rentpondylogo.png'
import homeup from '../Assets/homeup.jpg'
import { WhatsApp } from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ContactUsApp = () => {
  const [responseMessage, setResponseMessage] = useState("");
const [error, setError] = useState("");


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
useEffect(() => {
  if (responseMessage || error) {
    const timer = setTimeout(() => {
      setResponseMessage("");
      setError("");
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timeout on component unmount
  }
}, [responseMessage, error]);

  const navigate = useNavigate();
const location = useLocation();

// Retrieve phone number from location state or localStorage
const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";

// State to store form input values
const [formData, setFormData] = useState({
  name: "",
  email: "",
  phoneNumber: storedPhoneNumber,
  message: "",
});

// Update phoneNumber in state if it changes in localStorage
useEffect(() => {
  const phoneNumberFromStorage = localStorage.getItem("phoneNumber");
  if (phoneNumberFromStorage) {
    setFormData((prev) => ({ ...prev, phoneNumber: phoneNumberFromStorage }));
  }
}, []);

// Handle input changes
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/contactUs`, formData);

    if (response.status === 201) {
      setResponseMessage("Contact form submitted successfully!");
      setError("");
      setFormData({ name: "", email: "", phoneNumber: storedPhoneNumber, message: "" }); // Reset form
    }
  } catch (error) {
    setError(error.response?.data?.error || "Submission failed");
  }
};


  const cardData = [
    {
      id: 1,
      imgSrc: logo,
      title: 'Rent Pondy',
    //   text: 'This is the content for Card 1.',
    },
    {
      id: 2,
      icon: <FaEnvelope size={50} color='grey' />,
      title: 'Email',
      text: 'inforentpondy@gmail.com',
    },
    {
      id: 3,
      icon: <FaGlobe size={50} color='grey' />,
      title: 'Website',
      text: 'Visit: www.rentpondy.com',
    },
    {
      id: 4,
      imgSrc: homeup,
      title: 'Main Office',
      text: 'No.89, Aurobindo Street, M.G Road Junction, Puducherry-605001',
      title2: 'Branch Office',
      text2: 'No.101, Chetty Street, (M.G Road cutting), Puducherry-605001',
      text3: "Mobile: +91 83000 46066",
    text4: 'WhatsApp : +91 83000 46066',
    text5:'Land Line: 0413 2914409',

    },
  ];

  return (
    <div
      className="d-flex flex-column mx-auto custom-scrollbar"
      style={{
        maxWidth: '450px',
        height: '100vh',
        overflow: 'auto',
        scrollbarWidth: 'none', /* For Firefox */
        msOverflowStyle: 'none', /* For Internet Explorer */
        fontFamily: 'Inter, sans-serif'
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
       </button> <h3 className="m-0 " style={{fontSize:"18px", fontWeight:"bold"}}>CONTACT US</h3> </div>
        {/* <h4>Contact Us</h4> */}
      {/* Cards Section */}
      <div className="mb-4 mt-2">
        {cardData.map((card) => (
          <div className="card mb-3 shadow" key={card.id}>
            <div className="row g-0">
              {/* Image/Icon */}
              <div className="col-4 d-flex justify-content-center align-items-center">
                {card.icon ? (
                  card.icon
                ) : (
                  <img
                    style={{height:'50px'}}               
                    src={card.imgSrc}
                    className="img-fluid rounded-start"
                    alt={`Card ${card.id}`}
                  />
                )}
              </div>
              {/* Content */}
              <div className="col-8">
                <div className="card-body">
                  <h5 className="card-title">{card.title}</h5>
                  <p className="card-text" style={{color:'grey'}}>{card.text}</p>
                  <h5 className="card-title">{card.title2}</h5>
                  <p className="card-text" style={{color:'grey'}}>{card.text2}</p>
                  <p className="card-text" style={{color:'grey'}}>{card.text3}</p>
                  <p className="card-text" style={{color:'grey'}}>{card.text4}</p>
                  <p className="card-text" style={{color:'grey'}}>{card.text5}</p>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


<div className='text-center shadow p-1'><h4>Quick Contact</h4></div>
      
   
      {/* Form Section */}
      <form className="row g-3 p-3" onSubmit={handleSubmit}>
        <div className="col-12">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <FaUser color="#4F4B7E" />
            </span>
            <input
              type="text"
              className="form-control m-0"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-12">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <FaEnvelope color="#4F4B7E" />
            </span>
            <input
              type="email"
              className="form-control m-0"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-12">
          <label htmlFor="phone" className="form-label">
            Phone Number
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <FaPhone color="#4F4B7E" />
            </span>
            <input
              type="tel"
              className="form-control m-0"
              id="phone"
              name="phoneNumber"
              value={formData.phoneNumber}
              readOnly // ✅ Ensure phone number is displayed and not editable
              required
            />
          </div>
        </div>

        <div className="col-12">
          <label htmlFor="message" className="form-label">
            Message
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <BiSolidMessageSquareDetail color="#4F4B7E" />
            </span>
            <textarea
              className="form-control m-0"
              id="message"
              name="message"
              rows="4"
              placeholder="Enter your message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        </div>

        <div className="col-12 text-center">
          <button type="submit" className="btn" style={{ background: "#E74C3C", color: "#fff" }}>
            Submit
          </button>
        </div>
      </form>

    
      {/* Response Messages */}
      {responseMessage && <p className="text-success text-center">{responseMessage}</p>}
      {error && <p className="text-danger text-center">{error}</p>}
    </div>

  );
};

export default ContactUsApp;

