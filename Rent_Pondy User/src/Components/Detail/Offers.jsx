


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Tab, Nav, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import {
  FaRupeeSign, FaBed, FaCalendarAlt, FaUserAlt, FaRulerCombined,
  FaCamera, FaEye, FaPhoneAlt
} from "react-icons/fa";
import myImage from '../../Assets/Rectangle 76.png';
import myImage1 from '../../Assets/Rectangle 145.png';
import pic from '../../Assets/Default image_PP-01.png';
import { MdCall } from 'react-icons/md';
import calendar from '../../Assets/Calender-01.png'
import bed from '../../Assets/BHK-01.png'
import totalarea from '../../Assets/total_area.png'
import postedby from '../../Assets/Posted By-01.png'
import indianprice from '../../Assets/Indian Rupee-01.png'
const App = () => {
  const [activeKey, setActiveKey] = useState('All');
  const [removedProperties, setRemovedProperties] = useState([]);
  const [properties, setProperties] = useState([]);

 
// const handleRemoveProperty = async (rentId, phoneNumber, setProperties, setRemovedProperties) => {
//   try {
//       // Send request to delete offer
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/delete-offer`, { rentId, phoneNumber });

//       if (response.status === 200) {
//           toast.success('Offer removed successfully.');

//           // Update properties list (remove the deleted offer)
//           setProperties(prev =>
//               prev.map(property =>
//                   property.rentId === rentId
//                       ? { 
//                           ...property, 
//                           offerRequests: property.offerRequests.map(offer =>
//                               offer.phoneNumber === phoneNumber ? { ...offer, status: 'delete' } : offer
//                           )
//                         }
//                       : property
//               )
//           );

//           // Store removed offers
//           setRemovedProperties(prev => [...prev, response.data.property]);
//       }
//   } catch (error) {
//       console.error("🚨 Error removing offer:", error);
//       toast.error(error.response?.data?.message || 'Error removing offer.');
//   }
// };

// const handleRemoveProperty = async (rentId, setProperties, setRemovedProperties) => {
//   try {
//       // Send request to delete all offers for the given rentId
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/delete-offer`, { rentId });

//       if (response.status === 200) {
//           toast.success('All offers removed successfully.');

//           // Update properties list: Mark all offers as "delete"
//           setProperties(prev =>
//               prev.map(property =>
//                   property.rentId === rentId
//                       ? { 
//                           ...property, 
//                           offerRequests: property.offerRequests.map(offer => ({ ...offer, status: 'delete' }))
//                         }
//                       : property
//               )
//           );

//           // Store removed offers
//           setRemovedProperties(prev => [...prev, response.data.property]);
//       }
//   } catch (error) {
//       console.error("🚨 Error removing offers:", error);
//       toast.error(error.response?.data?.message || 'Error removing offers.');
//   }
// };








// const handleRemoveProperty = async (rentId, setProperties, setRemovedProperties) => {
//   try {
//       // Send request to delete all offers for the given rentId
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/delete-offer`, { rentId });

//       if (response.status === 200) {
//           toast.success('All offers removed successfully.');

//           const { offerRequests, postedPhoneNumber } = response.data;

//           // Update properties list: Mark all offers as "delete"
//           setProperties(prev =>
//               prev.map(property =>
//                   property.rentId === rentId
//                       ? { 
//                           ...property, 
//                           offerRequests: property.offerRequests.map(offer => 
//                               ({ ...offer, status: 'delete' })
//                           ),
//                           postedPhoneNumber // Ensure the posted phone number is updated if needed
//                         }
//                       : property
//               )
//           );

//           // Store removed offers
//           setRemovedProperties(prev => [
//               ...prev, 
//               { rentId, postedPhoneNumber, offerRequests }
//           ]);
//       }
//   } catch (error) {
//       console.error("🚨 Error removing offers:", error);
//       toast.error(error.response?.data?.message || 'Error removing offers.');
//   }
// };

const handleRemoveProperty = async (rentId, setProperties, setRemovedProperties) => {
  try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/delete-offer`, { rentId });

      if (response.status === 200) {
          toast.success('All offers removed successfully.');

          const { offerRequests, postedPhoneNumber } = response.data;

          // Move the property to the Removed tab by filtering it out from properties
          setProperties(prev => prev.filter(property => property.rentId !== rentId));

          // Add to Removed properties list
          setRemovedProperties(prev => [
              ...prev, 
              { rentId, postedPhoneNumber, offerRequests }
          ]);
      }
  } catch (error) {
      console.error("🚨 Error removing offers:", error);
      toast.error(error.response?.data?.message || 'Error removing offers.');
  }
};


  const handleUndoRemove = async (rentId, phoneNumber) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/undo-delete-offer`, { rentId, phoneNumber });
      if (response.status === 200) {
        toast.success('Offer restored successfully!');
        setRemovedProperties(prev => prev.filter(offer => !(offer.rentId === rentId && offer.phoneNumber === phoneNumber)));
        setProperties(prev => [...prev, response.data.property]);
        setActiveKey('All');
      }
    } catch (error) {
      toast.error('Error undoing offer status.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <Tab.Container activeKey={activeKey} onSelect={key => setActiveKey(key)}>
        <Row className="g-3">
          <Col lg={12} className="d-flex flex-column align-items-center">
            <Nav variant="tabs" className="mb-3" style={{ width: '100%' }}>
              <Nav.Item style={{ flex: '1' }}>
                <Nav.Link eventKey="All" style={{ backgroundColor: '#4F4B7E', color: 'white', textAlign: 'center' }}>All</Nav.Link>
              </Nav.Item>
              <Nav.Item style={{ flex: '1' }}>
                <Nav.Link eventKey="removed" style={{ backgroundColor: '#FF0000', color: 'white', textAlign: 'center' }}>Removed</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              {/* <Tab.Pane eventKey="All">
                <OfferOwner properties={properties} onRemove={handleRemoveProperty} setProperties={setProperties} />
              </Tab.Pane>
              <Tab.Pane eventKey="removed">
                <RemovedProperties removedProperties={removedProperties} onUndo={handleUndoRemove} />
              </Tab.Pane> */}

<Tab.Pane eventKey="All">
  <OfferOwner 
    properties={properties.filter(property => 
      Array.isArray(property.offers) && 
      property.offers.some(offer => offer.status !== 'delete')
    )} 
    onRemove={handleRemoveProperty} 
    setProperties={setProperties} 
  />
</Tab.Pane>

{/* <Tab.Pane eventKey="All">
  {properties.length > 0 ? (
    properties.map((property) => (
      <OfferOwner 
        key={property.rentId} 
        property={property} 
        onRemove={handleRemoveProperty} 
        setProperties={setProperties} 
      />
    ))
  ) : (
    <p>No owner properties found.</p>
  )}
</Tab.Pane> */}


<Tab.Pane eventKey="removed">
  <RemovedProperties 
    removedProperties={removedProperties.filter(property =>
      Array.isArray(property.offers) && 
      property.offers.every(offer => offer.status === 'delete')
    )} 
    onUndo={handleUndoRemove} 
  />
</Tab.Pane>



            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

const OfferOwner = ({ properties, onRemove, setProperties }) => {
  const { phoneNumber } = useParams();
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (!phoneNumber) {
  //     toast.error("Phone number is missing.");
  //     setLoading(false);
  //     return;
  //   }
  //   const fetchOfferOwners = async () => {
  //     try {
  //       const response = await axios.get(`${process.env.REACT_APP_API_URL}/offer-request-owner`, { params: { offerUserPhoneNumber: phoneNumber } });
  //       if (response.status === 200) {
  //         setProperties(response.data.ownerData || []);
  //       } else {
  //         toast.error("No owners found for this offer user.");
  //       }
  //     } catch (error) {
  //       toast.error("Error fetching offer owners.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchOfferOwners();
  // }, [phoneNumber]);

  useEffect(() => {
    console.log("useEffect triggered. Phone number:", phoneNumber);
  
    if (!phoneNumber) {
      toast.error("Phone number is missing.");
      setLoading(false);
      return;
    }
  
    console.log("Calling API...");
    fetchOfferOwners();  // Force API call
  
  }, [phoneNumber]);  // ✅ Dependency ensures it runs when `phoneNumber` changes
  
  const fetchOfferOwners = async () => {
    try {
      console.log("Fetching owners for:", phoneNumber);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/offer-request-owner`, { 
        params: { offerUserPhoneNumber: phoneNumber } 
      });
  
      console.log("API Response:", response);
      if (response.status === 200) {
        setProperties(response.data.ownerData || []);
      } else {
        toast.error("No owners found for this offer user.");
      }
    } catch (error) {
      console.error("API Fetch Error:", error);
      toast.error("Error fetching offer owners.");
    } finally {
      setLoading(false);
    }
  };
  

  
  const handleAcceptOffer = async (rentId, buyerPhoneNumber) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-offer-status`,
        { rentId, buyerPhoneNumber, action: "accept" }
      );
  
      if (response.status === 200) {
        toast.success("Offer accepted successfully.");
        setProperties((prevProperties) =>
          prevProperties.map((property) => {
            if (property.rentId === rentId) {
              return {
                ...property,
                offers: (property.offers || []).map((offer) =>
                  offer.buyerPhoneNumber === buyerPhoneNumber
                    ? { ...offer, status: "accept" }
                    : offer
                ),
              };
            }
            return property;
          })
        );
      }
    } catch (error) {
      toast.error("Error accepting offer.");
    }
  };
  
  const handleRejectOffer = async (rentId, buyerPhoneNumber) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-offer-status`,
        { rentId, buyerPhoneNumber, action: "reject" }
      );
  
      if (response.status === 200) {
        toast.success("Offer rejected successfully.");
        setProperties((prevProperties) =>
          prevProperties.map((property) => {
            if (property.rentId === rentId) {
              return {
                ...property,
                offers: (property.offers || []).map((offer) =>
                  offer.buyerPhoneNumber === buyerPhoneNumber
                    ? { ...offer, status: "reject" }
                    : offer
                ),
              };
            }
            return property;
          })
        );
      }
    } catch (error) {
      toast.error("Error rejecting offer.");
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (properties.length === 0) return <p>No owner properties found.</p>;


  return (
    <div className="container" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="row mt-4 rounded-4">
        {properties.map((property, index) => (
        
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
       height: "190px", // Adjust height as needed
       }}
       >
       <div style={{ position: "relative", width: "100%", height:'100%'}}>
       <div className="d-flex justify-content-between w-100" style={{ position: "absolute",
       bottom: "0px"}}>
       <span className="d-flex justify-content-center align-items-center" style={{backgroundSize: "cover", color:'#fff', background:`url(${myImage}) no-repeat center center`, fontSize:'12px', width:'50px' }}>
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
           <p className="mb-0 ps-3 pe-3 text-center pt-1" style={{background:"#FF0000", color:"white", cursor:"pointer" , borderRadius: '0px 0px 0px 15px', fontSize:"12px"}} onClick={() => onRemove(property.rentId, property.postedUserPhoneNumber)}>REMOVED</p>
           </div>
            <p className="fw-bold m-0" style={{ color:'#000000' }}>{property.propertyType || 'N/A'}</p>
            <p className='m-0' style={{ color:'#5E5E5E'}}>{property.city || 'N/A'}</p>
            <div className="card-body ps-2 m-0 pt-0 pe-2 d-flex flex-column justify-content-center">
              <div className="row">
              <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1">
    <img src={Floorr} alt="" width={12} className="me-2"/>
                    <span style={{ fontSize:'13px', color:'#5E5E5E' , fontWeight:500 }}>{property.floorNo
     ? property.floorNo.charAt(0).toUpperCase() + property.floorNo.slice(1)
     : 'N/A'}
                    </span>
 </div>
 <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
   <img src={bed} alt="" width={12} className="me-2"/>
   <span style={{ fontSize:'13px', color:'#5E5E5E' ,fontWeight: 500 }}>{property.bedrooms || 'N/A'} BHK</span>
 </div>
   <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
                 {/* <FaUserAlt className="me-2" color="#4F4B7E"/> */}
                 <img src={totalarea} alt="" width={12} className="me-2"/>
                   <span style={{ fontSize:'13px', color:'#5E5E5E' , fontWeight:500 }}>{property.totalArea || 'N/A'} {property.areaUnit
  ? property.areaUnit.charAt(0).toUpperCase() + property.areaUnit.slice(1)
  : 'N/A'}
                 </span>
               </div>
   <div className="col-6 d-flex align-items-center mt-1 mb-1 ps-1 pe-1">
   <img src={calendar} alt="" width={12} className="me-2" />
   <span style={{ fontSize:'13px', color:'#5E5E5E', fontWeight: 500 }}>
     {
       property.updatedAt && property.updatedAt !== property.createdAt
         ? ` ${new Date(property.updatedAt).toLocaleDateString('en-IN', {
             year: 'numeric',
             month: 'short',
             day: 'numeric'
           })}`
         : ` ${new Date(property.createdAt).toLocaleDateString('en-IN', {
             year: 'numeric',
             month: 'short',
             day: 'numeric'
           })}`
     }
   </span>
 </div>
                   <div className="col-12 d-flex flex-col align-items-center mt-1 mb-1">
                                <h6 className="m-0">
                                <span style={{ fontSize:'17px', color:'#4F4B7E', fontWeight:'bold', letterSpacing:"1px" }}> <img
                src={indianprice}
                alt=""
                width={8}
                className="me-2"
                style={{ marginRight: "6px" }}
              />{property.price ? property.price.toLocaleString('en-IN') : 'N/A'}
                                </span> 
                              <span style={{ color: '#4F4B7E', fontSize: '13px', marginLeft: "5px", fontSize: '11px' }}>
                                           / {property.rentType || "N/A"}
                                          </span>
                                  </h6>
                               </div>
                              
       
   
               </div>
             </div>
             {property.offers.length > 0 && (
                <div className="offers-container">
                  {property.offers.map((offer, idx) => (
                    <div key={idx} className="offer-item">
                 
                      <p className="m-0 ps-2" style={{ color: "#4F4B7E" }}>
     <a href={`tel:${property.interestedUser}`} style={{ textDecoration: 'none', color: '#4F4B7E' }}>
       <MdCall className="me-2" color="#4F4B7E" />{property.postedUserPhoneNumber || "N/A"}
     </a>
   </p>
   <div className='d-flex justify-content-between ps-2 pe-2'>
                    
                    
                      </div>
                      <div className='d-flex justify-content-around ps-2 pe-2 pb-2'>

                      <button className="p-1" style={{background:"#4F4B7E", color:"#fff" , width:"100px"}} onClick={() => handleAcceptOffer(property.rentId, offer.buyerPhoneNumber)}>Yes</button>
                      <button className="p-1" style={{color:"#4F4B7E", border:"2px solid #4F4B7E", width:"100px"}} onClick={() => handleRejectOffer(property.rentId, offer.buyerPhoneNumber)}>No</button>
                      <span style={{ color: offer.status === "accept" ? "green" : "red" }}>
                        {offer.status}
                      </span>
                    </div>
                    </div>

                  ))}
                </div>
              )}
           </div>
           <div style={{border:"2px solid #4F4B7E", borderBottomRightRadius:"18px", borderBottomLeftRadius:"18px"}}>
{/* 
{property.offers.length > 0 && (
                <div className="offers-container mt-2 p-2 rounded" style={{ background: "#FFF", border: "1px solid #ddd" }}>
                  <h6 style={{ fontWeight: "bold", color: "#4F4B7E" }}>Offers</h6>
                  {property.offers.map((offer, idx) => (
                    <div key={idx} className="offer-item d-flex justify-content-between p-2" style={{ borderBottom: "1px solid #ddd" }}>
                      <span>
                        <MdCall className="me-2" color="#4F4B7E" />
                        {offer.buyerPhoneNumber}
                      </span>
                      <span>
                        <FaRupeeSign className="me-2" color="#4F4B7E" />
                        {offer.offerPrice ? offer.offerPrice.toLocaleString("en-IN") : "N/A"}
                      </span>
                      <span style={{ color: offer.status === "accept" ? "green" : "red" }}>
                        {offer.status}
                      </span>
                      <button className="btn btn-success btn-sm" onClick={() => handleAcceptOffer(property.rentId, offer.buyerPhoneNumber)}>Yes</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleRejectOffer(property.rentId, offer.buyerPhoneNumber)}>No</button>
                    </div>
                  ))}
                </div>
              )} */}

{property.offers?.length > 0 && (
  <div className="offers-container">
    {property.offers.map((offer, idx) => (
      <div key={idx} className="offer-item">
        <p className="m-0 ps-2" style={{ color: "#4F4B7E" }}>
          <a href={`tel:${property.interestedUser}`} style={{ textDecoration: 'none', color: '#4F4B7E' }}>
            <MdCall className="me-2" color="#4F4B7E" />{property.postedUserPhoneNumber || "N/A"}
          </a>
        </p>
        <div className="d-flex justify-content-between ps-2 pe-2"></div>
        <div className="d-flex justify-content-around ps-2 pe-2 pb-2">
          <button className="p-1" style={{background:"#4F4B7E", color:"#fff" , width:"100px"}} onClick={() => handleAcceptOffer(property.rentId, offer.buyerPhoneNumber)}>Yes</button>
          <button className="p-1" style={{color:"#4F4B7E", border:"2px solid #4F4B7E", width:"100px"}} onClick={() => handleRejectOffer(property.rentId, offer.buyerPhoneNumber)}>No</button>
          <span style={{ color: offer.status === "accept" ? "green" : "red" }}>
            {offer.status}
          </span>
        </div>
      </div>
    ))}
  </div>
)}

                      </div>
                      </div>

       ))}
    
      </div>

    </div>
  );
};





const RemovedProperties = ({ removedProperties, onUndo, handleAcceptOffer, handleRejectOffer }) => {
  return (
    <div className="container mt-5">
      <div className="row">
        {removedProperties.length > 0 ? (
          removedProperties.map((property) => (
            <div key={property.rentId} className="row g-0 rounded-4" style={{ border: '1px solid #ddd', overflow: "hidden", background: "#EFEFEF" }}>
              <div className="col-md-4 col-4 d-flex flex-column justify-content-between align-items-center">
                <div className="text-white py-1 px-2 text-center" style={{ width: '100%', background: "#4F4B7E" }}>
                  PUC- {property.rentId}
                </div>
                <div
                  style={{
                    backgroundImage: property.photos?.length > 0
                      ? `url("http://localhost:5000/${property.photos[0]}")`
                      : `url("${pic}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "180px",
                  }}
                >
                  <div style={{ position: "relative", width: "100%", height: '180px' }}>
                    <div className="d-flex justify-content-between w-100" style={{ position: "absolute", bottom: "0px" }}>
                      <span className="d-flex justify-content-center align-items-center" style={{ color: '#fff', background: `url(${myImage}) no-repeat center center`, fontSize: '12px', width: '50px' }}>
                        <FaCamera className="me-1" /> 1
                      </span>
                      <span className="d-flex justify-content-center align-items-center" style={{ color: '#fff', background: `url(${myImage1}) no-repeat center center`, fontSize: '12px', width: '50px' }}>
                        <FaEye className="me-1" /> 1
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8 col-8 p-0">
                <div className="d-flex justify-content-between">
                  <p className="mb-1 fw-bold ps-2" style={{ color: '#5E5E5E' }}>{property.propertyMode || 'N/A'}</p>
                  <p className="m-0 ps-3 pe-3" style={{ background: "green", color: "white", cursor: "pointer", borderRadius: '0px 0px 0px 15px' }} onClick={() => onUndo(property.rentId, property.postedUserPhoneNumber)}>UNDO</p>
                </div>
                <p className="fw-bold m-0 ps-2" style={{ color: '#000000' }}>{property.propertyType || 'N/A'}</p>
                <p className="fw-bold ps-2" style={{ color: '#5E5E5E' }}>{property.city || 'N/A'}</p>
                <div className="card-body ps-2 m-0 pt-0 pe-2 d-flex flex-column justify-content-center">
                  <div className="row">
                    <div className="col-6 d-flex align-items-center mt-1 mb-1">
                      <FaRulerCombined className="me-2" color="#4F4B7E" /> <span style={{ fontSize: '13px', color: '#5E5E5E' }}>{property.totalArea || 'N/A'}</span>
                    </div>
                    <div className="col-6 d-flex align-items-center mt-1 mb-1">
                      <FaBed className="me-2" color="#4F4B7E" /> <span style={{ fontSize: '13px', color: '#5E5E5E' }}>{property.bedrooms || 'N/A'}</span>
                    </div>
                    <div className="col-6 d-flex align-items-center mt-1 mb-1">
                      <FaUserAlt className="me-2" color="#4F4B7E" /> <span style={{ fontSize: '13px', color: '#5E5E5E' }}>{property.postedBy || 'N/A'}</span>
                    </div>
                  </div>
                  {/* {property.offers.length > 0 && (
                    <div className="offers-container">
                      {property.offers.map((offer, idx) => (
                        <div key={idx} className="offer-item border p-2 my-1">
                          <p className="m-0 ps-2" style={{ color: "#4F4B7E" }}>
                            <a href={`tel:${property.interestedUser}`} style={{ textDecoration: 'none', color: '#4F4B7E' }}>
                              <MdCall className="me-2" color="#4F4B7E" /> {property.postedUserPhoneNumber || "N/A"}
                            </a>
                          </p>
                          <div className='d-flex justify-content-around ps-2 pe-2 pb-2'>
                            <button className="p-1" style={{ background: "#4F4B7E", color: "#fff", width: "100px" }} onClick={() => handleAcceptOffer(property.rentId, offer.buyerPhoneNumber)}>Yes</button>
                            <button className="p-1" style={{ color: "#4F4B7E", border: "2px solid #4F4B7E", width: "100px" }} onClick={() => handleRejectOffer(property.rentId, offer.buyerPhoneNumber)}>No</button>
                            <span style={{ color: offer.status === "accept" ? "green" : "red" }}>{offer.status}</span>
                          </div>
                          <div className="row text-center mt-2">
                            <span style={{ color: "grey", fontSize: "11px" }}>My Offer Price</span>
                            <FaRupeeSign color='#4F4B7E' />
                            <span style={{ color: "#0F9F2C" }}>{offer.offerPrice ? offer.offerPrice.toLocaleString("en-IN") : "N/A"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )} */}

{property.offers?.length > 0 && (
  <div className="offers-container mt-2 p-2 rounded" style={{ background: "#FFF", border: "1px solid #ddd" }}>
    <h6 style={{ fontWeight: "bold", color: "#4F4B7E" }}>Offers</h6>
    {property.offers.map((offer, idx) => (
      <div key={idx} className="offer-item d-flex justify-content-between p-2" style={{ borderBottom: "1px solid #ddd" }}>
        <span>
          <MdCall className="me-2" color="#4F4B7E" />
          {offer.buyerPhoneNumber}
        </span>
        <span>
          <FaRupeeSign className="me-2" color="#4F4B7E" />
          {offer.offerPrice ? offer.offerPrice.toLocaleString("en-IN") : "N/A"}
        </span>
        <span style={{ color: offer.status === "accept" ? "green" : "red" }}>
          {offer.status}
        </span>
        <button className="btn btn-success btn-sm" onClick={() => handleAcceptOffer(property.rentId, offer.buyerPhoneNumber)}>Yes</button>
        <button className="btn btn-danger btn-sm" onClick={() => handleRejectOffer(property.rentId, offer.buyerPhoneNumber)}>No</button>
      </div>
    ))}
  </div>
)}

                </div>
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
  );
};

export default App;








