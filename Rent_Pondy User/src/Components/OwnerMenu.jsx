

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import imge1 from '../Assets/my_account.png';
import imge2 from '../Assets/owner_menu.png';
import imge3 from '../Assets/buyer_menu.png';
import more2 from '../Assets/bottom.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaChevronLeft } from 'react-icons/fa';
import rangoli from '../Assets/rangoi.png';
import 'bootstrap/dist/css/bootstrap.min.css';



// MenuLink Component
const MenuLink = ({ to, label , count }) => (

    <Link to={to} style={{ textDecoration: "none"}}>
        <li style={{   display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 0',
      borderTop: '1px solid #eee',
      fontSize: '16px',
      color: '#5E5E5E',}}
      >
            <div className="d-flex align-items-center">
            <span style={{fontSize:"14px"}}>{label}</span>        
                </div>
            {/* {count !== undefined && count !== null && ( // This moves to the right
                <span className="badge bg-success rounded-pill">{count}</span>
            )}        */}
    <span
  className="badge rounded-pill"
  style={{ borderRadius: '50rem', padding: '0.35em 0.65em' , background:"#CDC9F9"}}
>
  {count}
</span>

             </li>
    </Link>
    
);


const OwnerMenu = () => {
    const [activeTab, setActiveTab] = useState('ownerMenu');
      const [loading, setLoading] = useState(false);
    
  const location = useLocation();
  const storedPhoneNumber = location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const [phoneNumber] = useState(storedPhoneNumber);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const navigate = useNavigate();
    const [error, setError] = useState(null);
 const [expiredpropertyCount, setExpiredPropertyCount] = useState(0);

    const [buyerViewedCount, setBuyerViewedCount] = useState(0);
      const [interestBuyersCount, setInterestBuyersCount] = useState(0);
      const [helpRequestsCount, setHelpRequestsCount] = useState(0);
      const [contactBuyerCount, setContactBuyerCount] = useState(0);

      const [reportRequestsCount, setReportRequestsCount] = useState(0);
      const [soldOutRequestsCount, setSoldOutRequestsCount] = useState(0);
      const [favoriteRequestsCount, setFavoriteRequestsCount] = useState(0);

        const [mostViewedCount, setMostViewedCount] = useState(0);
      
  const [buyerCount, setBuyerCount] = useState(0);

      const [photoRequestsCount, setPhotoRequestsCount] = useState(0);
      const [matchedPropertiesCount, setMatchedPropertiesCount] = useState(0);
      const [offersCount, setOffersCount] = useState(0);
      const [ownerOfferCount, setOwnerOfferCount] = useState(0);
      const [ownerPhotoRequestCount, setOwnerPhotoRequestCount] = useState(0);
      const [ownerMatchedPropertyCount, setOwnerMatchedPropertyCount] = useState(0);
      const [favoriteCount, setFavoriteCount] = useState(0);
const [favoriteOwnerCount, setFavoriteOwnerCount] = useState(0);
const [favoriteRemovedOwnerCount, setFavoriteRemovedOwnerCount] = useState(0);
const [reportPropertyOwnersCount, setReportPropertyOwnersCount] = useState(0);
const [contactOwnersCount, setContactOwnersCount] = useState(0);
const [helpOwnersCount, setHelpOwnersCount] = useState(0);
const [interestOwnersCount, setInterestOwnersCount] = useState(0);
const [viewedPropertiesCount, setViewedPropertiesCount] = useState(0);

const [totalPlansCount, setTotalPlansCount] = useState(0);

const [userCount, setUserCount] = useState(0);

const [deleteCount,setDeleteCount]= useState(0);

const [notificationCount, setNotificationCount] = useState(0);
const [notificationUserCount, setNotificationUserCount] = useState(0);

  const [planCount, setPlanCount] = useState(0);

  const [callUserCount, setCallUserCount] = useState(0);
  const [buyerAssistanceInterestCount, setBuyerAssistanceInterestCount] = useState(0);
  const [viewCountLast10Days, setViewCountLast10Days] = useState(0);




const [buyerListViewCount, setBuyerListViewCount] = useState(0);


 const [ownerAddressRequestCount, setOwnerAddressRequestCount] = useState(null);

  const [buyerAddressRequestCount, setBuyerAddressRequestCount] = useState(0);



  useEffect(() => {
    const fetchViewCountLast10Days = async () => {
      if (!phoneNumber) return;

      try {
        const normalizedPhone = phoneNumber.replace(/\D/g, "").slice(-10);
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/user-view-count/${normalizedPhone}`
        );
        setViewCountLast10Days(data.viewCount || 0);
        setError(""); // Clear any previous error
      } catch (error) {
        console.error("Error fetching view count:", error.message);
        setError("Failed to fetch view count");
        setViewCountLast10Days(0);
      }
    };

    fetchViewCountLast10Days();
  }, [phoneNumber]);

    useEffect(() => {
    const fetchBuyerRequestCount = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/address-requests/count/buyer/${phoneNumber}`
        );
        setBuyerAddressRequestCount(data.buyerRequestCount);
      } catch (error) {
        console.error("Error fetching address request count:", error.message);
      }
    };

    if (phoneNumber) {
      fetchBuyerRequestCount();
    }
  }, [phoneNumber]);

  useEffect(() => {
    const fetchOwnerAddressRequestCount = async () => {
      if (!phoneNumber) return;

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/address-requests/count/owner/${phoneNumber}`
        );
        setOwnerAddressRequestCount(response.data.ownerRequestCount);
      } catch (err) {
        console.error("Error fetching address request count:", err);
        // setError("Failed to fetch address request count.");
      }
    };

    fetchOwnerAddressRequestCount();
  }, [phoneNumber]);


useEffect(() => {
  const fetchInterestBuyersCount = async () => {
    const storedPhoneNumber = localStorage.getItem("phoneNumber") || phoneNumber || "";
    if (!storedPhoneNumber) {
      setLoading(false);
      return;
    }

    try {
      const normalizedPhone = storedPhoneNumber.replace(/\D/g, "").slice(-10); // Normalize last 10 digits

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/interest-buyers-count/${normalizedPhone}`
      );

      if (response.status === 200 && typeof response.data.interestBuyersCount === "number") {
        setInterestBuyersCount(response.data.interestBuyersCount);
      } else {
        setInterestBuyersCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch interest buyers count:", error);
      setInterestBuyersCount(0);
    } finally {
      setLoading(false);
    }
  };

  fetchInterestBuyersCount();
}, [phoneNumber]);


useEffect(() => {
  const fetchBuyerAssistViewCount = async () => {
    try {
      const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
      if (!storedPhoneNumber) return;

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-buyer-assist-view-count`, {
        params: { phoneNumber: storedPhoneNumber },
      });

      if (res.data.success) {
        setBuyerListViewCount(res.data.count || 0);
      }
    } catch (err) {
      console.error("Failed to fetch buyer assist view count.");
    }
  };

  fetchBuyerAssistViewCount();
}, []);


 
  // useEffect(() => {
  //   const fetchBuyerAssistance = async () => {
  //       if (!phoneNumber) return; // Prevent empty requests

  //       try {
  //         const res = await axios.get(`${process.env.REACT_APP_API_URL}/count-buyerAssistance/${phoneNumber}`);
  //         setBuyerCount(res.data?.count || 0); // Default to 0 if count is undefined
  //       } catch (err) {
  //         setBuyerCount(0); // Set to 0 in case of error
  //       }
  //     };

  //   fetchBuyerAssistance();
  // }, [phoneNumber]);


  useEffect(() => {
  const fetchBuyerAssistance = async () => {
    if (!phoneNumber) return; // Prevent empty requests

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/count-buyerAssistance-rent/${phoneNumber}`
      );
      setBuyerCount(res.data?.count || 0);
    } catch (err) {
      setBuyerCount(0);
    }
  };

  fetchBuyerAssistance();
}, [phoneNumber]);



useEffect(() => {
  const fetchPropertyCount = async () => {
    try {
      const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
      if (!storedPhoneNumber) return;

      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/expired-plan-count-by-phone`,
        {
          params: { phoneNumber: storedPhoneNumber },
        }
      );

      if (data.propertyCount !== undefined) {
        setExpiredPropertyCount(data.expiredpropertyCount);
      }
    } catch (error) {
      console.error("Error fetching property count:", error.message);
    }
  };

  fetchPropertyCount();
}, []);


  
  // useEffect(() => {
  //   const fetchPropertyCount = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/get-property-count-by-phone?phoneNumber`
  //       );
  //       setPropertyCount(data.propertyCount); // ✅ Use correct field name from backend
  //     } catch (err) {
  //     }
  //   };

  //   if (phoneNumber) {
  //     fetchPropertyCount();
  //   }
  // }, [phoneNumber]);

  
  useEffect(() => {
    const fetchBuyerAssistanceInterestCount = async () => {
        if (!phoneNumber) return;

        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API_URL}/rent-assistance-interests-phone-rent/count`,
                {
                    params: { phone: phoneNumber },
                }
            );
            setBuyerAssistanceInterestCount(data.count);
        } catch (error) {
        }
    };

    fetchBuyerAssistanceInterestCount();
}, [phoneNumber]);




useEffect(() => {
  const fetchPlanCount = async () => {
    try {
      const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
      if (!storedPhoneNumber) return;

      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/plans/count`, {
        params: { phoneNumber: storedPhoneNumber },
      });

      if (data.planCount !== undefined) {
        setPlanCount(data.planCount || 0);
      }
    } catch (error) {
    }
  };

  fetchPlanCount();
}, []);




   useEffect(() => {
    const fetchUserCount = async () => {
      if (!phoneNumber) {
        setLoading(false);
        return;
      }

      try {
        const normalizedPhone = phoneNumber.replace(/\D/g, "").slice(-10);

        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-delete-status-count`,
          {
            params: { phoneNumber: normalizedPhone },
          }
        );

        setDeleteCount(data.count || 0);
      } catch (err) {
        console.error("Error fetching deleted property count:", err.message);
        setError("Failed to fetch deleted property count");
        setDeleteCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, [phoneNumber]);


  
useEffect(() => {
  const fetchMostViewedCount = async () => {
    try {
      const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
      if (!storedPhoneNumber) return;

      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/get-most-viewed-properties-count`, {
        params: { phoneNumber: storedPhoneNumber },
      });

      if (data.mostViewedPropertiesCount !== undefined) {
        setMostViewedCount(data.mostViewedPropertiesCount || 0);
      }
    } catch (error) {
    }
  };

  fetchMostViewedCount();
}, []);





  
useEffect(() => {
  const fetchUserCount = async () => {
    try {
      const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
      if (!storedPhoneNumber) return;

      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/property-count`, {
        params: { phoneNumber: storedPhoneNumber },
      });

      if (data.count !== undefined) {
        setUserCount(data.count || 0);
      }
    } catch (error) {
    }
  };

  fetchUserCount();
}, []);




// useEffect(() => {
//   const fetchMostViewedCount = async () => {
//     try {
//       const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/get-most-viewed-properties-count?phoneNumber`);
//       setMostViewedCount(data.mostViewedPropertiesCount);
//     } catch (err) {
//     }
//   };

//   if (phoneNumber) {
//     fetchMostViewedCount();
//   }
// }, [phoneNumber]);


useEffect(() => {
    const fetchHelpOwnersCount = async () => {
        if (!phoneNumber) return;

        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API_URL}/get-help-as-owner-count?phoneNumber`
            );
            setHelpOwnersCount(data.helpPropertiesCount);  // ✅ corrected
        } catch (error) {
        }
    };

    fetchHelpOwnersCount();
}, [phoneNumber]);



  // useEffect(() => {
  //   const fetchCallUserCount = async () => {
  //     if (!phoneNumber) return;

  //     try {
  //       const { data } = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/property-owner/count`
  //       );
  //       setCallUserCount(data.count);
  //     } catch (err) {
  //       setError('Error fetching call user count');
  //     }
  //   };

  //   fetchCallUserCount();
  // }, [phoneNumber]);


  // useEffect(() => {
  //   const fetchNotificationUserCount = async () => {
  //     if (!phoneNumber) return;
  
  //     try {
  //       const { data } = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/notification-user-count?phoneNumber`
  //       );
  //       setNotificationUserCount(data.count);
  //     } catch (error) {
  //       setError("Error fetching notification count");
  //     }
  //   };
  
  //   fetchNotificationUserCount();
  // }, [phoneNumber]);


useEffect(() => {
  const fetchNotificationCount = async () => {
    try {
      const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
      if (!storedPhoneNumber) return;

      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/notification-unread-count`, {
        params: { phoneNumber: storedPhoneNumber },
      });

      if (data.count !== undefined) {
        setNotificationCount(data.count || 0);
      }
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  fetchNotificationCount();
}, []);

  

// useEffect(() => {
//     const fetchNotificationCount = async () => {
//       if (!phoneNumber) return; // Avoid API call if phoneNumber is missing

//       try {
//         const { data } = await axios.get(
//           `${process.env.REACT_APP_API_URL}/notifications/count`
//         );
//         setNotificationCount(data.count);
//       } catch (error) {
//         setError("Error fetching notification count");
//       }
//     };

//     fetchNotificationCount();
//   }, [phoneNumber]);




    useEffect(() => {
        const fetchPlansCount = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/get-all-plan-count`);
                setTotalPlansCount(data.totalPlansCount);
            } catch (error) {
            }
        };

        fetchPlansCount();
    }, []);




useEffect(() => {
  const fetchContactOwnerCount = async () => {
    try {
      const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
      if (!storedPhoneNumber) return;

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-contact-owner-count`, {
        params: { phoneNumber: storedPhoneNumber },
      });

      if (res.data.contactRequestsCount !== undefined) {
        setContactOwnersCount(res.data.contactRequestsCount || 0); // ✅ use the 6 count
      }
    } catch (error) {
      console.error("Failed to fetch contact buyer count:", error);
      setContactOwnersCount(0); // fallback
    }
  };

  fetchContactOwnerCount();
}, []);


    useEffect(() => {
        const fetchReportPropertyOwnersCount = async () => {
            if (!phoneNumber) return; // Ensure phoneNumber exists before making the request

            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/get-reportproperty-owner-count?phoneNumber`);
                setReportPropertyOwnersCount(data.reportPropertyOwnersCount);
            } catch (error) {
            }
        };

        fetchReportPropertyOwnersCount();
    }, [phoneNumber]); 



const [soldOutOwnersCount, setSoldOutOwnersCount] = useState(0);

useEffect(() => {
    const fetchSoldOutOwnersCount = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/get-soldout-owner-count?phoneNumber`);
            setSoldOutOwnersCount(data.soldOutOwnersCount);
        } catch (error) {
        }
    };

    fetchSoldOutOwnersCount();
}, [phoneNumber]);


useEffect(() => {
    const fetchFavoriteRemovedOwnerCount = async () => {
        try {
            if (!phoneNumber) return;

            const { data } = await axios.get(
                `${process.env.REACT_APP_API_URL}/get-favorite-removed-owner-count?phoneNumber`
            );

            setFavoriteRemovedOwnerCount(data.favoriteRemovedOwnerCount);
        } catch (error) {
            setError("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    fetchFavoriteRemovedOwnerCount();
}, [phoneNumber]);


useEffect(() => {
  const fetchBuyerMatchedPropertiesCount = async () => {
    try {
      const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
      if (!storedPhoneNumber) return;

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-buyer-matched-properties-rent/count`,
        {
          params: { phoneNumber: storedPhoneNumber },
        }
      );

      if (res.data.matchedPropertiesCount !== undefined) {
        setMatchedPropertiesCount(res.data.matchedPropertiesCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch matched buyer properties count.", err);
      setMatchedPropertiesCount(0);
    }
  };

  fetchBuyerMatchedPropertiesCount();
}, []);


 
  useEffect(() => {
    const fetchOwnerMatchedPropertyCount = async () => {
      try {
        const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
        if (!storedPhoneNumber) return;

        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-owner-matched-properties-rent/count`,
          {
            params: { phoneNumber: storedPhoneNumber },
          }
        );

        if (res.data.ownerMatchedPropertyCount !== undefined) {
          setOwnerMatchedPropertyCount(res.data.ownerMatchedPropertyCount);
        }
      } catch (err) {
        console.error("Failed to fetch owner matched property count.", err);
        setOwnerMatchedPropertyCount(0); // fallback
      }
    };

    fetchOwnerMatchedPropertyCount();
  }, []);





useEffect(() => {
  const fetchBuyerPhotoRequestCount = async () => {
    try {
      const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
      if (!storedPhoneNumber) return;

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/photo-requests/buyer/count/${storedPhoneNumber}`);

      if (res.data.photoRequestsCount !== undefined) {
        setPhotoRequestsCount(res.data.photoRequestsCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch buyer photo request count.");
    }
  };

  fetchBuyerPhotoRequestCount();
}, []);




useEffect(() => {
  const fetchOwnerPhotoRequestCount = async () => {
    try {
      const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
      if (!storedPhoneNumber) return;

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/photo-requests/owner/count/${storedPhoneNumber}`);

      if (res.data.photoRequestsCount !== undefined) {
        setOwnerPhotoRequestCount(res.data.photoRequestsCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch buyer photo request count.");
    }
  };

  fetchOwnerPhotoRequestCount();
}, []);


useEffect(() => {
  const fetchBuyerOfferCount = async () => {
    try {
      const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
      if (!storedPhoneNumber) return;

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/offers/buyer/count/${storedPhoneNumber}`);
      if (res.data.offersCount !== undefined) {
        setOffersCount(res.data.offersCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch buyer offer count.");
    }
  };

  fetchBuyerOfferCount();
}, []);


useEffect(() => {
  const fetchOwnerOfferCount = async () => {
    try {
      const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
      if (!storedPhoneNumber) return;

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/offers/owner/count/${storedPhoneNumber}`);
      if (res.data.offerCount !== undefined) {
        setOwnerOfferCount(res.data.offerCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch owner offer count.");
    }
  };

  fetchOwnerOfferCount();
}, []);


useEffect(() => {
  const fetchFavoriteRequestsCount = async () => {
    try {
      const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
      if (!storedPhoneNumber) return;

      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/get-favorite-buyer-count`, {
        params: { postedPhoneNumber: storedPhoneNumber },
      });

      if (data.favoriteRequestsCount !== undefined) {
        setFavoriteRequestsCount(data.favoriteRequestsCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch favorite requests count:", error);
    }
  };

  fetchFavoriteRequestsCount();
}, []);



useEffect(() => {
  const fetchFavoriteOwnerCount = async () => {
    try {
      const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
      if (!storedPhoneNumber) return;

      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/get-favorite-owner-count`, {
        params: { phoneNumber: storedPhoneNumber },
      });

      if (data.favoriteOwnerCount !== undefined) {
        setFavoriteOwnerCount(data.favoriteOwnerCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch favorite owner count:", error);
    }
  };

  fetchFavoriteOwnerCount();
}, []);




useEffect(() => {
    const fetchReportRequestsCount = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/get-reportproperty-buyer-count?postedPhoneNumber`);
            setReportRequestsCount(data.reportRequestsCount);
        } catch (error) {
        }
    };

    fetchReportRequestsCount();
}, [phoneNumber]);
    
   

    //   useEffect(() => {
    //     // Fetch buyer viewed count
    //     const fetchBuyerViewedCount = async () => {
    //         try {
    //             const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/property-buyer-viewed-count?phoneNumber`);
    //             setBuyerViewedCount(data.buyerViewedCount);
    //         } catch (error) {
    //         }
    //     };
    
    //     fetchBuyerViewedCount();
    // }, [phoneNumber]);


useEffect(() => {
  const fetchBuyerViewedCount = async () => {
    try {
      const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
      if (!storedPhoneNumber) return;

      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/property-buyer-viewed-count`, {
        params: { phoneNumber: storedPhoneNumber },
      });

      if (data.buyerViewedCount !== undefined) {
        setBuyerViewedCount(data.buyerViewedCount || 0);
      }
    } catch (error) {
    }
  };

  fetchBuyerViewedCount();
}, []);




    useEffect(() => {
    const fetchHelpRequestsCount = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/get-help-as-buyer-count?postedPhoneNumber`);
            setHelpRequestsCount(data.helpRequestsCount);
        } catch (error) {
        }
    };

    fetchHelpRequestsCount();
}, [phoneNumber]);

useEffect(() => {
  const fetchContactBuyerCount = async () => {
    try {
      const storedPhoneNumber = localStorage.getItem("phoneNumber") || "";
      if (!storedPhoneNumber) return;

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-contact-buyer-count`, {
        params: { postedPhoneNumber: storedPhoneNumber },
      });

      if (res.data.contactBuyerCount !== undefined) {
        setContactBuyerCount(res.data.contactBuyerCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch contact buyer count:", error);
      setContactBuyerCount(0); // fallback
    }
  };

  fetchContactBuyerCount();
}, []);


useEffect(() => {
  const fetchInterestOwnersCount = async () => {
    const storedPhoneNumber = localStorage.getItem("phoneNumber") || phoneNumber || "";
    if (!storedPhoneNumber) return;

    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/get-interest-sent-count`, {
        params: { phoneNumber: storedPhoneNumber },
      });

      if (data.success) {
        setInterestOwnersCount(data.interestSentCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch interest sent count:", error);
      setInterestOwnersCount(0); // fallback
    }
  };

  fetchInterestOwnersCount();
}, [phoneNumber]);


    

    const handleAddProperty = async () => {
        if (!phoneNumber) {
            return;
        }
    
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/store-data`,
                { phoneNumber }
            );
    
            if (response.status === 201) {
                const rentId = response.data.rentId;
    
                // Corrected navigation
                // navigate(`/add-property`, { state: { rentId, phoneNumber } });
                navigate(`/add-property?rentId=${rentId}`);

            }
        } catch (error) {
        }
    };
      const styles = {
    container: {
 fontFamily: "Inter, sans-serif",
            width: "100%",
            overflowY: "auto",
            scrollbarWidth:"none",
      background: '#f8f8f8',
    },
    tabs: {
      display: 'flex',
      borderBottom: '1px solid #ddd',
      background: '#ffffff',

    },
    tab: {
      flex: 1,
      textAlign: 'center',
      padding: '12px',
      fontWeight: '500',
      border: '1px solid #ddd',
      borderBottom: 'none',
      cursor: 'pointer',
          },
    activeTab: {
      backgroundColor: '#4B3F72',
      color: 'white',
    },
    card: {
      background: '#fff',
      borderRadius: '10px',
      padding: '16px',
    boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)',
      marginTop: '12px',
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#4B3F72',
    },
    listItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 0',
      borderTop: '1px solid #eee',
      fontSize: '16px',
      color: '#333',
    },
    arrow: {
      fontSize: '20px',
      color: '#aaa',
    },
    badge: {
      background: '#d6cfff',
      color: '#4B3F72',
      borderRadius: '50%',
      padding: '6px 12px',
      fontWeight: 'bold',
      fontSize: '14px',
    },
    switch: {
      position: 'relative',
      display: 'inline-block',
      width: '44px',
      height: '24px',
    },
    slider: {
      position: 'absolute',
      cursor: 'pointer',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#ccc',
      transition: '0.4s',
      borderRadius: '24px',
    },
    sliderBefore: {
      position: 'absolute',
      content: '""',
      height: '18px',
      width: '18px',
      left: '3px',
      bottom: '3px',
      backgroundColor: 'white',
      transition: '0.4s',
      borderRadius: '50%',
    },
    sliderChecked: {
      backgroundColor: '#4B3F72',
    },
    sliderBeforeChecked: {
      transform: 'translateX(20px)',
    },
  
  };

      const tabStyle = (tab) => ({
     zIndex: 2,
    flex: 1,
    padding: '16px 0',
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    backgroundColor: activeTab === tab ? '#4F4B7E' : '#fff',
    color: activeTab === tab ? '#fff' : '#000',
    borderRight: tab !== 'buyerMenu' ? '1px solid #ccc' : 'none',
    cursor: 'pointer',
  });

    return (
      <div className="container-fluid d-flex justify-content-center align-items-center p-0">
               <div style={{width:"500px", overflow:"hidden"}}>
                    <div className="d-flex flex-row w-100" >
                    <div className="col-12">
  {/* <div
    className="d-flex align-items-center p-1 text-center"
    style={{ height: "50px" , backgroundColor:"#F2F2F2" ,}}
  >
    <button
      className="d-flex align-items-center justify-content-center ps-3 pe-2"
      style={{
        background: "transparent",
        border: "none",
        height: "100%",color:"#CDC9F9"
      }}
      onClick={() => navigate(-1)}
    >
      <FaChevronLeft size={20} />
    </button>
    <span className="ms-2 fs-5 fw-bold">More</span>
  </div> */}

<div className="w-100">
            {/* Navigation Tabs */}
          <div className='p-0 m-0' style={styles.tabs}>
           <div style={tabStyle('myAccount')} onClick={() => handleTabClick('myAccount')}>
        MY ACCOUNT
      </div>
      <div style={tabStyle('ownerMenu')} onClick={() => handleTabClick('ownerMenu')}>
        OWNER MENU
      </div>
      <div style={tabStyle('buyerMenu')} onClick={() => handleTabClick('buyerMenu')}>
        TENANT MENU
      </div>
      </div>

            {/* Content for Each Tab */}
           <div className="tab-content mt-3 position-relative">
                        {/* My Account Tab Content */}
           <img src={rangoli} alt="" 
           width={200} 
           style={{
            position:"absolute",
            top: -75 , 
            left:"-50px", 
            zIndex: 0,
            pointerEvents: 'none',  
            opacity: 0.3
            }}/>
        
                     {activeTab === 'myAccount' && (
            <div className="tab-pane active">
                <div style={{paddingLeft:"40px"}}>
        <div style={{
              background: '#fff',
              borderRadius: '10px',
              padding: '16px',
            boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)',
              marginTop: '12px',
              zIndex:2,
              width:"90%"
        }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="m-0" style={{ color: '#4F4B7E', fontSize:"18px" , fontWeight:"bold" }}>My Account</h3>
                    <img src={imge1} alt="My Account" className="rounded" />
                </div>
            <ul className="list-group custom-list-group" >
                    <li 
                    style={{   display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 0',
              fontSize: '16px',
              }}
                        onClick={handleAddProperty} 
                    >
        <span style={{fontSize:"14px" , fontWeight:400 , color:"#5E5E5E" , fontWeight:500}}>ADD PROPERTY</span>                {/* <span className="badge bg-primary rounded-pill">0</span> */}
                    </li>

  <MenuLink 
            to={`/add-property`} 
            label="Add Property "  
            // count={userCount}   
        />

        
                    
                    <MenuLink 
            to={`/my-property`} 
            label="My Property "  
            count={userCount}   
        />
        
        <MenuLink
         to={`/my-profile/${phoneNumber}`} 
         label="My Profile " />
        
        
        <MenuLink 
            to={`/my-plan`} 
            label="My Plan "  
            count={planCount}   
        />
        
        
        
        <MenuLink 
          to="/notification" 
          label="Notifications"  
          count={notificationCount } 
        />
        
        <MenuLink 
            to={`/removed-property`} 
            label="Removed Property "  
            count={deleteCount}   
        />
        
        
        
        <MenuLink 
            to={`/expire-property`} 
            label="Expried Plan "  
            count={expiredpropertyCount}
        />
        
        
        {/* <MenuLink  
            to={`/add-plan`} 
            label="Add Plans Owners"
            count={totalPlansCount}
            badgeClass="bg-success" 
        />
         */}
        
        
        
        
        
                    {/* <MenuLink to={`/my-profile`} label="My Profile " /> */}
                 
        
                </ul> 
            </div>
        </div>
            </div>
        )}
        
          {/* Buyer Menu Tab Content */}
          {activeTab === 'ownerMenu' && (
                            <div className="tab-pane active">
               <div style={{marginLeft:"50px",}}>  
                <div style={{
              background: '#ffffff',
              borderRadius: '10px',
              padding: '16px',
            boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)',
              marginTop: '12px',
        }}>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h3 className="m-0" style={{ color: '#4F4B7E', fontSize:"18px" , fontWeight:"bold"}}>Owner Menu</h3>
                                    <img src={imge3} alt="Tenant Menu" className="rounded" />
                                </div>
                                <ul className="list-group">
                                    {/* Example usage of MenuLink for buyer */}
                                    {/* <MenuLink to={`/interest-buyer`} label="Buyer Interested " /> */}

                                     <MenuLink  
            to={`/Buyer-List-Filter`} 
            label="Tenant List"
            // count={buyerViewedCount}
            badgeClass="bg-success" 
        />

                                    <MenuLink  
            to={`/interest-buyer`} 
            label=" Interested Tenant"
            count={interestBuyersCount}
            badgeClass="bg-primary" 
        />
        
        
        <MenuLink  
            to={`/matched-buyer`} 
            label="Matched Tenant "
            count={matchedPropertiesCount}
            badgeClass="bg-success" 
        />
        
        
        <MenuLink  
            to={`/offer-buyer`} 
            label="Offers From Tenant"
            count={offersCount}
            badgeClass="bg-info" 
        />
        
        
        <MenuLink  
            to={`/contact-buyer`} 
            label="Contacted Tenant "
            count={contactBuyerCount}
            badgeClass="bg-warning" 
        />
        
        
        <MenuLink  
            to={`/photo-request-buyer`} 
            label=" Photo Requested Tenant"
            count={photoRequestsCount}
            badgeClass="bg-info" 
        />
        
          <MenuLink  
            to={`/address-request-buyer`} 
            label=" Address Requested Tenant"
            count={ownerAddressRequestCount}
            badgeClass="bg-info" 
        />

        <MenuLink  
            to={`/favorite-buyer`} 
            label="Shortlisted Tenant"
            count={favoriteRequestsCount}
            badgeClass="bg-primary" 
        />
        
        
        <MenuLink  
            to={`/view-buyer`} 
            label=" Viewed Tenant"
            count={buyerViewedCount}
            badgeClass="bg-success" 
        />
         
     
         {/* <MenuLink  
            to={`/lead-center`} 
            label="Leads Center"
            // count={buyerViewedCount}
            badgeClass="bg-success" 
        /> */}
        
                                </ul>
                            </div>
                                                </div>
        
                                                </div>
        
                        )}
        
        
                        {/* Owner Menu Tab Content */}
                        {activeTab === 'buyerMenu' && (
                            <div className="tab-pane active">
                                        <div style={{marginLeft:"50px"}}
                >
        
              
              
        <div style={{
              background: '#fff',
              borderRadius: '10px',
              padding: '16px',
            boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)',
              marginTop: '12px',
        }}>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h3 className="m-0" style={{ color: '#4F4B7E' , fontSize:"18px" , fontWeight:"bold"}}>Tenant Menu</h3>
                                    <img src={imge2} alt="Owner Menu" className="rounded" />
                                </div>
                                <ul className="list-group">
        
        
                               
                                {/* <MenuLink 
                                to={`/buyer-assistance`}
            label=" Add Buyer Assistance " 
        />
        
        
        <MenuLink 
            to={`/buyer-assistance`}
            label="Buyer Assistance"
            count={buyerCount}   
        
        />
          */}




  
                        <MenuLink 
                        to={`/buyer-assistance`}
    label=" Add Tenant Assistance" 
/>


<MenuLink 
                        to={`/buyer-assis-buyer`}
    label="My Tenant Assistance"
    count={buyerCount}   

/>

       <MenuLink 
    to={`/interest-owner`} 
    label=" My Send Interest  "  
    count={interestOwnersCount}   
/>


        <MenuLink  
            to={`/matched-owner`} 
            label="My Matched Property"
            count={ownerMatchedPropertyCount}
            badgeClass="bg-success" 
        />
        
         <MenuLink  
            to={`/contact-owner`} 
            label="My Contact List "
            count={contactOwnersCount}
            badgeClass="bg-primary" 
        />
                <MenuLink  
            to={`/offer-owner`} 
            label="My Offers "
            count={ownerOfferCount}
            badgeClass="bg-success" 
        />
        
        <MenuLink  
            to={`/photo-request-owner`} 
            label="My Photo Requests"
            count={ownerPhotoRequestCount}
            badgeClass="bg-info" 
        />

          <MenuLink  
            to={`/address-request-owner`} 
            label="My Address Requests"
            count={buyerAddressRequestCount}
            badgeClass="bg-info" 
        />

        
        
           <MenuLink 
            to={`/my-interest-send`} 
            label="My Tenant Sent Interest "  
            count={buyerAssistanceInterestCount}
        
        />
       
        <MenuLink  
            to={`/favorite-owner`} 
            label="My Shortlist Property"
            count={favoriteOwnerCount}
            badgeClass="bg-success" 
        />

        <MenuLink 
            to={`/my-last-property`} 
            label="My Last Viewed Property "  
            count={viewCountLast10Days}
        />



        <MenuLink 
    to={`/most-viewed`} 
    label="My Most Viewed Property "  
    count={mostViewedCount}
/>
        
     <MenuLink 
    to={`/my-buyer-list-viewed`} 
    label="My Tenant List Viewed Datas"  
    count={buyerListViewCount}
/>
        
        <MenuLink 
            to={`/my-buyer-plan`} 
            label="My Tanant Assistant Plan"  
            // count={mostViewedCount}
        />
        
        
          </ul>
                            </div>
                            </div></div>
                        )}
        
                      
                    </div>
        

            {/* Footer Image */}
            <img src={more2} alt="Footer" style={{ width: '100%', marginTop: '20px' }} />
        </div>
        </div>
        </div>
        </div>
        </div>

    );
};

export default OwnerMenu;





