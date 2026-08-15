// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const PropertyVideos = () => {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   const fetchVideos = async () => {
//     try {
//       const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-property-videos`);

//       // Replace backslashes with forward slashes to ensure proper URL formatting
//       const normalizedVideos = res.data.videos.map(video => ({
//         ...video,
//         video: video.video.replace(/\\/g, "/")
//       }));

//       setVideos(normalizedVideos);
//     } catch (error) {
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container py-4">
//       <h4 className="mb-3">Property Videos</h4>

//       {loading ? (
//         <p>Loading videos...</p>
//       ) : videos.length === 0 ? (
//         <p>No videos found.</p>
//       ) : (
//         <div className="row">
//           {videos.map((video, index) => (
//             // <div className="col-md-4 mb-4" key={index}>
//             <div className="col-12 mb-4" key={index}>

//               <div className="card shadow-sm h-100">
//                 <video
//                   controls
//                   preload="metadata"
//                   style={{
//                     width: "100%",
//                     height: "220px",
//                     objectFit:"contain",
//                     borderTopLeftRadius: "5px",
//                     borderTopRightRadius: "5px",
//                     backgroundColor: "#000"
//                   }}
//                 >
//                   {/* <source src={`http://localhost:6006/${video.video}`} type="video/mp4" /> */}
//  <source
//                     src={`https://rentpondy.com/RENT/${video.video}`}
//                     type="video/mp4"
//                   />
//                                     Your browser does not support the video tag.

//                                   </video>
//                 <div className="card-body">
//                   <p className="card-text fw-bold">RENT ID: {video.rentId} <span>{video.propertyType}</span></p>
//                                     <p className="card-text ">Property Type: {video.propertyType} <span>{video.propertyType}</span></p>
//                                     <p className="card-text ">Property Mode: {video.propertyMode} <span>{video.propertyType}</span></p>

//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PropertyVideos;






















import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const PropertyVideos = () => {
  const location = useLocation();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const [phoneNumber, setPhoneNumber] = useState(storedPhoneNumber);

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
const [showPopup, setShowPopup] = useState(false);
const [selectedRentId, setSelectedRentId] = useState(null);


  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-property-videos`);

      const normalizedVideos = res.data.videos.map(video => ({
        ...video,
        video: video.video.replace(/\\/g, "/")
      }));

      setVideos(normalizedVideos);
    } catch (error) {
      console.error("Failed to fetch videos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (rentId) => {
    navigate(`/detail/${rentId}`, { state: { phoneNumber } });
  };

  return (
    <div className="container py-4">
      <h4 className="mb-3">Property Videos</h4>

      {loading ? (
        <p>Loading videos...</p>
      ) : videos.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <div className="row">
          {videos.map((video, index) => (
            <div className="col-12 mb-4" key={index}>
              <div className="card shadow-sm h-100">
                <video
                  controls
                  preload="metadata"
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "contain",
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                    backgroundColor: "#000"
                  }}
                >
                  <source
                    src={`https://rentpondy.com/PPC/${video.video}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                <div className="card-body">
                  <p className="card-text fw-bold">
                    <span
                      style={{ cursor: "pointer", color: "#007bff" }}
                      // onClick={() => handleNavigate(video.rentId)}
                        onClick={() => {
    setSelectedRentId(video.rentId);
    setShowPopup(true);
  }}

                    >
                      RENT ID: {video.rentId}, <strong style={{color:"black"}}>{video.propertyType}</strong>
                    </span>
                  </p>
                  {/* <p className="card-text">
                    Property Type: <strong>{video.propertyType}</strong>
                  </p> */}
                  {/* <p className="card-text">
                    Property Mode: <strong>{video.propertyMode}</strong>
                  </p> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
 
{showPopup && (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999
  }}>
    <div style={{
      background: 'white', padding: '20px', borderRadius: '8px',
      textAlign: 'center', minWidth: '300px'
    }}>
      <p>Do you want to see the property detail?</p>
      <button
        onClick={() => {
          handleNavigate(selectedRentId);
          setShowPopup(false);
        }}
        className="p-2 border-0"
        style={{ marginRight: '10px', background:"#4F4B7E", color:"fff" }}
      >
        Yes
      </button>
      <button className="p-2 border-0" style={{ marginRight: '10px', background:"#e45a09ff", color:"fff" }} onClick={() => setShowPopup(false)}>No</button>
    </div>
  </div>
)}

    </div>
  );
};

export default PropertyVideos;
