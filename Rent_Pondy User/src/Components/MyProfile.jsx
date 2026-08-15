

// // import { useState, useEffect } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import { FaUserAlt, FaEnvelope, FaPhoneAlt, FaHome, FaArrowLeft } from "react-icons/fa";
// // import logo from '../Assets/Sale Property-01.png'
// // import { useDispatch } from 'react-redux';
// // import { setPhoneNumber } from '../red/userSlice';


// // const MyProfile = () => {
// //   const { phoneNumber } = useParams(); // Get mobile number from URL
// //   const navigate = useNavigate();
// //   const dispatch = useDispatch();
// //   const [profile, setProfile] = useState({ name: "", email: "", mobile: phoneNumber, address: "" });
// //   const [isEditing, setIsEditing] = useState(false); // Track profile existence
// //   const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
// //   const [showModal, setShowModal] = useState(false);
// //   const [actionType, setActionType] = useState("");
// //   const [showSuccess, setShowSuccess] = useState(false);
// //   const [successMessage, setSuccessMessage] = useState("");

// //   const [isScrolling, setIsScrolling] = useState(false);


// // const [showConfirm, setShowConfirm] = useState(false);

// // // const handleLogout = () => {
// // //   dispatch(setPhoneNumber(null));
// // //   localStorage.removeItem('phoneNumber');
// // //   navigate('/login');
// // //   // toast.success("Logged out successfully!");
// // // };


// // const handleLogout = () => {
// //   dispatch(setPhoneNumber(null)); // clear Redux
// //   localStorage.removeItem('phoneNumber'); // clear localStorage

// //   navigate('/login'); // ✅ clean redirect
// //   // toast.success("Logged out successfully!");
// // };


// //   useEffect(() => {
// //     let scrollTimeout;

// //     const handleScroll = () => {
// //       setIsScrolling(true);

// //       clearTimeout(scrollTimeout);
// //       scrollTimeout = setTimeout(() => {
// //         setIsScrolling(false);
// //       }, 150); // Adjust the delay as needed
// //     };

// //     window.addEventListener("scroll", handleScroll);

// //     return () => {
// //       clearTimeout(scrollTimeout);
// //       window.removeEventListener("scroll", handleScroll);
// //     };
// //   }, []);
// //   const handleAction = () => {
// //     switch (actionType) {
// //       case "update":
// //         handleUpdate();
// //         setSuccessMessage("Profile updated successfully!");
// //         break;
// //       case "create":
// //         handleSubmit();
// //         setSuccessMessage("Profile created successfully!");
// //         break;
// //       case "logout":
// //         handleLogout();
// //         setSuccessMessage("Logged out successfully!");
// //         break;
    
// //       default:
// //         break;
// //     }

// //     setShowModal(false);
// //     setShowSuccess(true);

// //     // Hide the success message after 3 seconds
// //     setTimeout(() => {
// //       setShowSuccess(false);
// //       setSuccessMessage("");
// //     }, 3000);
// //   };

// //   const openModal = (type) => {
// //     setActionType(type);
// //     setShowModal(true);
// //   };
// //    useEffect(() => {
// //       const recordDashboardView = async () => {
// //         try {
// //           await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
// //             phoneNumber: phoneNumber,
// //             viewedFile: "My Profile",
// //             viewTime: new Date().toISOString(),
// //           });
// //         } catch (err) {
// //         }
// //       };
    
// //       if (phoneNumber) {
// //         recordDashboardView();
// //       }
// //     }, [phoneNumber]);
// //   const [loading, setLoading] = useState(false);

// // useEffect(() => {
// //   if (phoneNumber) {
// //     setLoading(true);
// //     axios
// //       .get(`${process.env.REACT_APP_API_URL}/profile/mobile/${phoneNumber}`)
// //       .then((res) => {
// //         setProfile(res.data);
// //         setIsEditing(true);
// //         setIsLoggedIn(true);
// //       })
// //       .catch((err) => {
// //         if (err.response?.status === 404) {
// //           setProfile({ name: "", email: "", address: "", mobile: phoneNumber });
// //           setIsEditing(false);
// //           setIsLoggedIn(true);
// //         } else {
// //         }
// //       })
// //       .finally(() => setLoading(false));
// //   }
// // }, [phoneNumber]);


// //   // Handle Input Change
// //   const handleChange = (e) => {
// //     setProfile({ ...profile, [e.target.name]: e.target.value });
// //   };

// //   // Create Profile
// //   const handleSubmit = () => {
// //     if (!profile.name || !profile.email || !profile.address) {
// //       alert("Please fill all fields");
// //       return;
// //     }

// //     axios.post(`${process.env.REACT_APP_API_URL}/profile-create`, profile)
// //       .then((res) => {
// //         alert("Profile created successfully!");
// //         setProfile(res.data);
// //         setIsEditing(true);
// //         setIsLoggedIn(true);
// //       })
// // .catch(() => {});
// //   };

// //   // Update Profile
// //   const handleUpdate = () => {
// //     axios.put(`${process.env.REACT_APP_API_URL}/profile/${profile.mobile}`, {
// //       name: profile.name,
// //       email: profile.email,
// //       address: profile.address,
// //     })
// //       // .then(() => alert("Profile updated successfully!"))
// // .catch(() => {});
// //   };



// //   // Generate Profile Image with First Letter of Name
// //   const getProfileInitial = () => {
// //     return profile.name?.charAt(0)?.toUpperCase() || "?";
// //   };














// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaUserAlt, FaEnvelope, FaPhoneAlt, FaHome, FaArrowLeft } from "react-icons/fa";
// import logo from '../Assets/Sale Property-01.png';
// import { useDispatch } from 'react-redux';
// import { setPhoneNumber } from '../red/userSlice';

// const MyProfile = () => {
//   const { phoneNumber } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [profile, setProfile] = useState({ name: "", email: "", mobile: phoneNumber, address: "" });
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [actionType, setActionType] = useState("");
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isScrolling, setIsScrolling] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleLogout = () => {
//     dispatch(setPhoneNumber(null));
//     localStorage.removeItem('phoneNumber');
//     navigate('/login', { replace: true }); // ✅ fixed clean redirect
//   };

//   const handleAction = () => {
//     switch (actionType) {
//       case "update":
//         handleUpdate();
//         setSuccessMessage("Profile updated successfully!");
//         break;
//       case "create":
//         handleSubmit();
//         setSuccessMessage("Profile created successfully!");
//         break;
//       case "logout":
//         handleLogout();
//         setSuccessMessage("Logged out successfully!");
//         break;
//       default:
//         break;
//     }

//     setShowModal(false);
//     setShowSuccess(true);
//     setTimeout(() => {
//       setShowSuccess(false);
//       setSuccessMessage("");
//     }, 3000);
//   };

//   const openModal = (type) => {
//     setActionType(type);
//     setShowModal(true);
//   };

//   useEffect(() => {
//     const recordDashboardView = async () => {
//       try {
//         await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
//           phoneNumber,
//           viewedFile: "My Profile",
//           viewTime: new Date().toISOString(),
//         });
//       } catch (err) {}
//     };

//     if (phoneNumber) {
//       recordDashboardView();
//     }
//   }, [phoneNumber]);

//   useEffect(() => {
//     if (phoneNumber) {
//       setLoading(true);
//       axios.get(`${process.env.REACT_APP_API_URL}/profile/mobile/${phoneNumber}`)
//         .then((res) => {
//           setProfile(res.data);
//           setIsEditing(true);
//           setIsLoggedIn(true);
//         })
//         .catch((err) => {
//           if (err.response?.status === 404) {
//             setProfile({ name: "", email: "", address: "", mobile: phoneNumber });
//             setIsEditing(false);
//             setIsLoggedIn(true);
//           }
//         })
//         .finally(() => setLoading(false));
//     }
//   }, [phoneNumber]);

//   useEffect(() => {
//     let scrollTimeout;
//     const handleScroll = () => {
//       setIsScrolling(true);
//       clearTimeout(scrollTimeout);
//       scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       clearTimeout(scrollTimeout);
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   const handleChange = (e) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = () => {
//     if (!profile.name || !profile.email || !profile.address) {
//       alert("Please fill all fields");
//       return;
//     }

//     axios.post(`${process.env.REACT_APP_API_URL}/profile-create`, profile)
//       .then((res) => {
//         alert("Profile created successfully!");
//         setProfile(res.data);
//         setIsEditing(true);
//         setIsLoggedIn(true);
//       })
//       .catch(() => {});
//   };

//   const handleUpdate = () => {
//     axios.put(`${process.env.REACT_APP_API_URL}/profile/${profile.mobile}`, {
//       name: profile.name,
//       email: profile.email,
//       address: profile.address,
//     })
//     .catch(() => {});
//   };

//   const getProfileInitial = () => {
//     return profile.name?.charAt(0)?.toUpperCase() || "?";
//   };



//   return (
//     <div className="container d-flex align-items-center justify-content-center p-0">
     
//      <div className="d-flex flex-column align-items-center justify-content-center m-0" 
//         style={{ maxWidth: '450px', margin: 'auto', width: '100%' , fontFamily: 'Inter, sans-serif'}}>        
//         {/* Header */}
//         <div className="d-flex align-items-center justify-content-start w-100"  style={{
//         background: "#EFEFEF",
//         position: "sticky",
//         top: 0,
//         zIndex: 1000,
//         opacity: isScrolling ? 0 : 1,
//         pointerEvents: isScrolling ? "none" : "auto",
//         transition: "opacity 0.3s ease-in-out",
//       }}>
//          <button
//               onClick={() => navigate(-1)}
//               className="pe-5"
//               style={{
//                 backgroundColor: '#f0f0f0',
//                 border: 'none',
//                 padding: '10px 20px',
//                 cursor: 'pointer',
//                 transition: 'all 0.3s ease-in-out',
//                 display: 'flex',
//                 alignItems: 'center',
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.backgroundColor = '#f0f4f5'; // Change background
//                 e.currentTarget.querySelector('svg').style.color = '#00B987'; // Change icon color
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = '#f0f0f0';
//                 e.currentTarget.querySelector('svg').style.color = '#4F4B7E';
//               }}
//             >
//               <FaArrowLeft style={{ color: '#4F4B7E', transition: 'color 0.3s ease-in-out' , background:"transparent"}} />
//             </button>
//           <h3 className="m-0 ms-3" style={{ fontSize: "20px", color: "#4F4B7E" }}>My Profile</h3>
//         </div>
//         <div className="row g-2 w-100">

       
// <div className="text-center my-3 mt-5">
//   {profile && profile.name ? (
//     // 🟢 User has a profile: Show initials inside a circle
//     <div
//       className="rounded-circle d-flex align-items-center justify-content-center"
//       style={{
//         width: "100px",
//         height: "100px",
//         background: "#4F4B7E",
//         color: "#fff",
//         fontSize: "40px",
//         fontWeight: "bold",
//         marginLeft:"35%"
//       }}
//     >
//       {getProfileInitial(profile.name)}
//     </div>
//   ) : (
//     // 🔴 New user: Show default logo image
//     <img
//       src={logo} // Replace with actual default image URL
//       alt="Default Profile"
//       className="img-fluid"
//       width={80}
//     />
//   )}
// </div>


//         {/* Form */}
//         <form className="p-4">
         
// <div className="form-group mb-3">
//   <label htmlFor="name" className="form-label">
//     <FaUserAlt className="me-2" color="#4F4B7E" /> <strong>Name</strong>
//   </label>
//   <input
//     type="text"
//     name="name"
//     value={profile.name}
//     onChange={handleChange}
//     placeholder="Enter your name"
//     required
//     style={{
//       backgroundColor: "transparent",
//       border: "none",
//       borderBottom: "1px solid #ccc",
//       borderRadius: "0",
//       boxShadow: "none",
//       outline: "none",
//       width: "100%",
//     }}
//     onFocus={(e) => (e.target.style.borderBottom = "2px solid #4F4B7E")}
//     onBlur={(e) => (e.target.style.borderBottom = "1px solid #ccc")}
//   />
// </div>

// <div className="form-group mb-3">
//   <label htmlFor="email" className="form-label">
//     <FaEnvelope className="me-2" color="#4F4B7E" /> <strong>Email</strong>
//   </label>
//   <input
//     type="email"
//     name="email"
//     value={profile.email}
//     onChange={handleChange}
//     placeholder="Enter your email"
//     required
//     style={{
//       backgroundColor: "transparent",
//       border: "none",
//       borderBottom: "1px solid #ccc",
//       borderRadius: "0",
//       boxShadow: "none",
//       outline: "none",
//       width: "100%",
//     }}
//     onFocus={(e) => (e.target.style.borderBottom = "2px solid #4F4B7E")}
//     onBlur={(e) => (e.target.style.borderBottom = "1px solid #ccc")}
//   />
// </div>

// <div className="form-group mb-3">
//   <label htmlFor="mobile" className="form-label">
//     <FaPhoneAlt className="me-2" color="#4F4B7E" /> <strong>Mobile Number</strong>
//   </label>
//   <input
//     type="tel"
//     name="mobile"
//     value={profile.mobile}
//     readOnly
//     placeholder="Mobile number"
//     style={{
//       backgroundColor: "transparent",
//       border: "none",
//       borderBottom: "1px solid #ccc",
//       borderRadius: "0",
//       boxShadow: "none",
//       outline: "none",
//       width: "100%",
//     }}
//     onFocus={(e) => (e.target.style.borderBottom = "2px solid #4F4B7E")}
//     onBlur={(e) => (e.target.style.borderBottom = "1px solid #ccc")}
//   />
// </div>

// <div className="form-group mb-3">
//   <label htmlFor="address" className="form-label">
//     <FaHome className="me-2" color="#4F4B7E" /> <strong>Address</strong>
//   </label>
//   <input
//     type="text"
//     name="address"
//     value={profile.address}
//     onChange={handleChange}
//     placeholder="Enter your address"
//     required
//     style={{
//       backgroundColor: "transparent",
//       border: "none",
//       borderBottom: "1px solid #ccc",
//       borderRadius: "0",
//       boxShadow: "none",
//       outline: "none",
//       width: "100%",
//     }}
//     onFocus={(e) => (e.target.style.borderBottom = "2px solid #4F4B7E")}
//     onBlur={(e) => (e.target.style.borderBottom = "1px solid #ccc")}
//   />
// </div>


// {/* <div className="col-12 d-flex align-items-center">
//   <img src={logo} alt="" width={25} className="me-2"/>
//   <div>
//     <div style={{ fontSize: "13px", color: "grey" }}>App Version</div>
//     <div style={{ fontSize: "15px", fontWeight: 600, color: "grey" }}>
// 33    </div>
//   </div>
// </div>
//           */}
// <div className="d-flex flex-column mt-5">
//       {isEditing ? (
//         <button
//           type="button"
//           className="btn w-100 mb-2"
//           style={{ background: "#4F4B7E", color: "#fff", border: "none", fontSize: "14px" }}
//           onClick={() => openModal("update")}
//         >
//           UPDATE PROFILE
//         </button>
//       ) : (
//         <button
//           type="button"
//           className="btn w-100 mb-2"
//           style={{ background: "#00B072", color: "#fff", border: "none", fontSize: "14px" }}
//           onClick={() => openModal("create")}
//         >
//           CREATE PROFILE
//         </button>
//       )}

//            {/* LOGOUT BUTTON */}
//       {isLoggedIn && (
//         <button
//           type="button"
//           className="btn w-100 mb-2"
//           style={{ color: "black", border: "1px solid red", fontSize: "14px", background: "transparent" }}
//           onClick={() => setShowConfirm(true)}
//         >
//           LOGOUT
//         </button>
//       )}

//       {/* CUSTOM CONFIRMATION POPUP */}
//       {showConfirm && (
//         <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
//           <div className="bg-white p-4 rounded shadow" style={{ width: '300px' }}>
//             <h5 className="text-center" style={{ fontSize: "13px" }}>
//               Are you sure you want to logout?
//             </h5>
//             <div className="d-flex justify-content-between gap-3 mt-4">
//               <button
//                 className="btn px-4"
//                 style={{ background: "blue", color: "#fff" }}
//                 onClick={handleLogout}
//               >
//                 Yes
//               </button>
//               <button
//                 className="btn px-4"
//                 style={{
//                   background: "white",
//                   color: "blue",
//                   boxShadow: "0 4px 8px rgba(0, 123, 255, 0.3)",
//                 }}
//                 onClick={() => setShowConfirm(false)}
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MODAL FOR ACTION CONFIRMATION */}
//       {showModal && (
//         <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
//           <div className="modal-dialog">
//             <div className="modal-content animate__animated animate__fadeInDown">
//               <div className="modal-header">
//                 <h5 className="modal-title">Please Confirm</h5>
//                 <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
//               </div>
//               <div className="modal-body">
//                 <p>
//                   {actionType === "update" && "Are you sure you want to update the profile?"}
//                   {actionType === "create" && "Do you want to create the profile?"}
//                   {actionType === "logout" && "Are you sure you want to logout?"}
//                 </p>
//               </div>
//               <div className="modal-footer">
//                 <button className="btn" style={{ background: "#FF0000", color: "#fff" }} onClick={() => setShowModal(false)}>
//                   Cancel
//                 </button>
//                 <button className="btn" style={{ background: "#4F4B7E", color: "#fff" }} onClick={handleAction}>
//                   Confirm
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* SUCCESS MESSAGE */}
//       {showSuccess && (
//         <div className="w-100 p-2"
//           style={{
//             position: "fixed",
//             top: "30px",
//             left: "50%",
//             transform: "translateX(-50%)",
//             backgroundColor: "#ffffff",
//             color: "grey",
//             borderRadius: "8px",
//             fontSize: "14px",
//             boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
//             zIndex: 1050,
//             opacity: 0.95,
//             transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
//           }}
//         >
//           {successMessage}
//         </div>
//       )}
//     </div>
//         </form>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default MyProfile;



// MyProfile.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaUserAlt, FaEnvelope, FaPhoneAlt, FaHome, FaArrowLeft, FaChevronLeft } from "react-icons/fa";
import logo from '../Assets/rentpondylogo.png';
import { useDispatch } from 'react-redux';
import { setPhoneNumber } from '../red/userSlice';

const MyProfile = () => {
  const { phoneNumber } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [profile, setProfile] = useState({ name: "", email: "", mobile: phoneNumber, address: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isScrolling, setIsScrolling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    dispatch(setPhoneNumber(null));
    localStorage.removeItem('phoneNumber');
    navigate('/login', { replace: true });
  };

  const handleAction = () => {
    switch (actionType) {
      case "update":
        handleUpdate();
        setSuccessMessage("Profile updated successfully!");
        break;
      case "create":
        handleSubmit();
        setSuccessMessage("Profile created successfully!");
        break;
      case "logout":
        handleLogout();
        setSuccessMessage("Logged out successfully!");
        break;
      default:
        break;
    }

    setShowModal(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSuccessMessage("");
    }, 3000);
  };

  const openModal = (type) => {
    setActionType(type);
    setShowModal(true);
  };

  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
          phoneNumber,
          viewedFile: "My Profile",
          viewTime: new Date().toISOString(),
        });
      } catch (err) {}
    };

    if (phoneNumber) {
      recordDashboardView();
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (phoneNumber) {
      setLoading(true);
      axios.get(`${process.env.REACT_APP_API_URL}/profile/mobile/${phoneNumber}`)
        .then((res) => {
          setProfile(res.data);
          setIsEditing(true);
          setIsLoggedIn(true);
        })
        .catch((err) => {
          if (err.response?.status === 404) {
            setProfile({ name: "", email: "", address: "", mobile: phoneNumber });
            setIsEditing(false);
            setIsLoggedIn(true);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [phoneNumber]);

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!profile.name || !profile.email || !profile.address) {
      alert("Please fill all fields");
      return;
    }

    axios.post(`${process.env.REACT_APP_API_URL}/profile-create`, profile)
      .then((res) => {
        alert("Profile created successfully!");
        setProfile(res.data);
        setIsEditing(true);
        setIsLoggedIn(true);
      })
      .catch(() => {});
  };

  const handleUpdate = () => {
    axios.put(`${process.env.REACT_APP_API_URL}/profile/${profile.mobile}`, {
      name: profile.name,
      email: profile.email,
      address: profile.address,
    }).catch(() => {});
  };

  const getProfileInitial = () => {
    return profile.name?.charAt(0)?.toUpperCase() || "?";
  };

  // return (
  //   <div>
  //     {/* Add your layout/form rendering logic here */}

  //     {isLoggedIn && (
  //       <button
  //         type="button"
  //         className="btn btn-outline-danger w-100"
  //         onClick={() => setShowConfirm(true)}
  //       >
  //         LOGOUT
  //       </button>
  //     )}

  //     {showConfirm && (
  //       <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
  //         <div className="bg-white p-4 rounded shadow" style={{ width: '300px' }}>
  //           <h5 className="text-center" style={{ fontSize: "13px" }}>
  //             Are you sure you want to logout?
  //           </h5>
  //           <div className="d-flex justify-content-between gap-3 mt-4">
  //             <button
  //               className="btn px-4 btn-primary"
  //               onClick={handleLogout}
  //             >
  //               Yes
  //             </button>
  //             <button
  //               className="btn px-4 btn-light"
  //               onClick={() => setShowConfirm(false)}
  //             >
  //               No
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );

return (
    <div className="container d-flex align-items-center justify-content-center p-0">
     
     <div className="d-flex flex-column align-items-center justify-content-center m-0" 
        style={{ maxWidth: '450px', margin: 'auto', width: '100%' , fontFamily: 'Inter, sans-serif'}}>        
        {/* Header */}
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
           </button>
          <h3 className="m-0" style={{ fontSize: "18px", color: "#4F4B7E" }}>My Profile</h3>
        </div>
        <div className="row g-2 w-100">

       
<div className="text-center my-3 mt-5">
  {profile && profile.name ? (
    // 🟢 User has a profile: Show initials inside a circle
    <div
      className="rounded-circle d-flex align-items-center justify-content-center"
      style={{
        width: "100px",
        height: "100px",
        background: "#4F4B7E",
        color: "#fff",
        fontSize: "40px",
        fontWeight: "bold",
        marginLeft:"35%"
      }}
    >
      {getProfileInitial(profile.name)}
    </div>
  ) : (
    // 🔴 New user: Show default logo image
    <img
      src={logo} // Replace with actual default image URL
      alt="Default Profile"
      className="img-fluid"
      width={80}
    />
  )}
</div>


        {/* Form */}
        <form className="p-4">
         
<div className="form-group mb-3">
  <label htmlFor="name" className="form-label">
    <FaUserAlt className="me-2" color="#4F4B7E" /> <strong>Name</strong>
  </label>
  <input
    type="text"
    name="name"
    value={profile.name}
    onChange={handleChange}
    placeholder="Enter your name"
    required
    style={{
      backgroundColor: "transparent",
      border: "none",
      borderBottom: "1px solid #ccc",
      borderRadius: "0",
      boxShadow: "none",
      outline: "none",
      width: "100%",
    }}
    onFocus={(e) => (e.target.style.borderBottom = "2px solid #4F4B7E")}
    onBlur={(e) => (e.target.style.borderBottom = "1px solid #ccc")}
  />
</div>

<div className="form-group mb-3">
  <label htmlFor="email" className="form-label">
    <FaEnvelope className="me-2" color="#4F4B7E" /> <strong>Email</strong>
  </label>
  <input
    type="email"
    name="email"
    value={profile.email}
    onChange={handleChange}
    placeholder="Enter your email"
    required
    style={{
      backgroundColor: "transparent",
      border: "none",
      borderBottom: "1px solid #ccc",
      borderRadius: "0",
      boxShadow: "none",
      outline: "none",
      width: "100%",
    }}
    onFocus={(e) => (e.target.style.borderBottom = "2px solid #4F4B7E")}
    onBlur={(e) => (e.target.style.borderBottom = "1px solid #ccc")}
  />
</div>

<div className="form-group mb-3">
  <label htmlFor="mobile" className="form-label">
    <FaPhoneAlt className="me-2" color="#4F4B7E" /> <strong>Mobile Number</strong>
  </label>
  <input
    type="tel"
    name="mobile"
    value={profile.mobile}
    readOnly
    placeholder="Mobile number"
    style={{
      backgroundColor: "transparent",
      border: "none",
      borderBottom: "1px solid #ccc",
      borderRadius: "0",
      boxShadow: "none",
      outline: "none",
      width: "100%",
    }}
    onFocus={(e) => (e.target.style.borderBottom = "2px solid #4F4B7E")}
    onBlur={(e) => (e.target.style.borderBottom = "1px solid #ccc")}
  />
</div>

<div className="form-group mb-3">
  <label htmlFor="address" className="form-label">
    <FaHome className="me-2" color="#4F4B7E" /> <strong>Address</strong>
  </label>
  <input
    type="text"
    name="address"
    value={profile.address}
    onChange={handleChange}
    placeholder="Enter your address"
    required
    style={{
      backgroundColor: "transparent",
      border: "none",
      borderBottom: "1px solid #ccc",
      borderRadius: "0",
      boxShadow: "none",
      outline: "none",
      width: "100%",
    }}
    onFocus={(e) => (e.target.style.borderBottom = "2px solid #4F4B7E")}
    onBlur={(e) => (e.target.style.borderBottom = "1px solid #ccc")}
  />
</div>


<div className="col-12 d-flex align-items-center">
  <img src={logo} alt="" width={25} className="me-2"/>
  <div>
    <div style={{ fontSize: "13px", color: "grey" }}>App Version</div>
    <div style={{ fontSize: "15px", fontWeight: 600, color: "grey" }}>
1.29.1    </div>
  </div>
</div>
         
<div className="d-flex flex-column mt-5">
      {isEditing ? (
        <button
          type="button"
          className="btn w-100 mb-2"
          style={{ background: "#4F4B7E", color: "#fff", border: "none", fontSize: "14px" }}
          onClick={() => openModal("update")}
        >
          UPDATE PROFILE
        </button>
      ) : (
        <button
          type="button"
          className="btn w-100 mb-2"
          style={{ background: "#00B072", color: "#fff", border: "none", fontSize: "14px" }}
          onClick={() => openModal("create")}
        >
          CREATE PROFILE
        </button>
      )}

           {/* LOGOUT BUTTON */}
      {isLoggedIn && (
        <button
          type="button"
          className="btn w-100 mb-2"
          style={{ color: "black", border: "1px solid red", fontSize: "14px", background: "transparent" }}
          onClick={() => setShowConfirm(true)}
        >
          DELETE MY ACCOUNT
        </button>
      )}

      {/* CUSTOM CONFIRMATION POPUP */}
      {showConfirm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <div className="bg-white p-4 rounded shadow" style={{ width: '300px' }}>
            <h5 className="text-center" style={{ fontSize: "13px" }}>
              Are you sure you want to DELETE YOUR ACCOUNT?
            </h5>
            <div className="d-flex justify-content-between gap-3 mt-4">
              <button
                className="btn px-4"
                style={{ background: "blue", color: "#fff" }}
                onClick={handleLogout}
              >
                Yes
              </button>
              <button
                className="btn px-4"
                style={{
                  background: "white",
                  color: "blue",
                  boxShadow: "0 4px 8px rgba(0, 123, 255, 0.3)",
                }}
                onClick={() => setShowConfirm(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FOR ACTION CONFIRMATION */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content animate__animated animate__fadeInDown">
              <div className="modal-header">
                <h5 className="modal-title">Please Confirm</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <p>
                  {actionType === "update" && "Are you sure you want to update the profile?"}
                  {actionType === "create" && "Do you want to create the profile?"}
                  {actionType === "logout" && "Are you sure you want to logout?"}
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn" style={{ background: "#FF0000", color: "#fff" }} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn" style={{ background: "#4F4B7E", color: "#fff" }} onClick={handleAction}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {showSuccess && (
        <div className="w-100 p-2"
          style={{
            position: "fixed",
            top: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#ffffff",
            color: "grey",
            borderRadius: "8px",
            fontSize: "14px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            zIndex: 1050,
            opacity: 0.95,
            transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
          }}
        >
          {successMessage}
        </div>
      )}
    </div>
        </form>
        </div>

      </div>
    </div>
  );
};

export default MyProfile;


