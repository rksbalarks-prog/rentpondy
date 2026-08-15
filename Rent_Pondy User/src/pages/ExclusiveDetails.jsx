// import React from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { FaArrowLeft } from "react-icons/fa";
// import "./ExclusiveDetails.css";

// const ExclusiveDetails = () => {
//   const navigate = useNavigate();
//   const { city } = useParams();

//   // Default placeholder image as SVG data URI
//   const defaultImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='skyGradient' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%231e88e5;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%234fc3f7;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23skyGradient)'/%3E%3Ccircle cx='80' cy='80' r='35' fill='%2366bb6a' opacity='0.3'/%3E%3Ccircle cx='150' cy='60' r='40' fill='%2390caf9'/%3E%3Ccircle cx='220' cy='80' r='35' fill='%2390caf9'/%3E%3Ccircle cx='320' cy='70' r='30' fill='%23ffeb3b'/%3E%3Cpolygon points='50,180 150,80 250,180' fill='%2343a047'/%3E%3Cpolygon points='150,180 250,100 350,180' fill='%2366bb6a'/%3E%3Cpolygon points='250,180 330,120 400,180' fill='%2381c784'/%3E%3C/svg%3E";

//   // Property data - you can replace this with actual data
//   const properties = {
//     reddiyarpalayam: [
//       { id: 1, type: "Residential", name: "Luxury Apartment", location: "Reddiarpalayam, Pondicherry", floor: "2nd Floor", area: "950 Sq.ft", date: "13 Feb 2026", price: "₹45,000", featured: true, image: null },
//       { id: 2, type: "Residential", name: "Spacious Villa", location: "Near Market, Reddiarpalayam", floor: "Ground", area: "1200 Sq.ft", date: "12 Feb 2026", price: "₹65,000", featured: false, image: null },
//       { id: 3, type: "Residential", name: "Modern Studio", location: "Main Road, Reddiarpalayam", floor: "1st Floor", area: "600 Sq.ft", date: "11 Feb 2026", price: "₹25,000", featured: false, image: null }
//     ],
//     moolakulam: [
//       { id: 1, type: "Residential", name: "Beachfront Villa", location: "Near Beach, Moolakulam", floor: "Ground", area: "1500 Sq.ft", date: "13 Feb 2026", price: "₹75,000", featured: true, image: null },
//       { id: 2, type: "Residential", name: "Cozy Apartment", location: "Market Area, Moolakulam", floor: "2nd Floor", area: "800 Sq.ft", date: "12 Feb 2026", price: "₹35,000", featured: false, image: null },
//       { id: 3, type: "Residential", name: "Family Home", location: "Residential Zone, Moolakulam", floor: "Ground", area: "1100 Sq.ft", date: "11 Feb 2026", price: "₹55,000", featured: false, image: null }
//     ],
//     whitetown: [
//       { id: 1, type: "Commercial", name: "Heritage Property", location: "White Town, Pondicherry", floor: "1st Floor", area: "900 Sq.ft", date: "13 Feb 2026", price: "₹50,000", featured: true, image: null },
//       { id: 2, type: "Commercial", name: "Business Space", location: "Main Street, White Town", floor: "Ground", area: "700 Sq.ft", date: "12 Feb 2026", price: "₹40,000", featured: false, image: null },
//       { id: 3, type: "Residential", name: "Premium Flat", location: "Apartment Complex, White Town", floor: "3rd Floor", area: "1000 Sq.ft", date: "11 Feb 2026", price: "₹60,000", featured: false, image: null }
//     ],
//     villianur: [
//       { id: 1, type: "Residential", name: "Suburban Home", location: "Villianur, Pondicherry", floor: "Ground", area: "1050 Sq.ft", date: "13 Feb 2026", price: "₹30,000", featured: false, image: null },
//       { id: 2, type: "Residential", name: "Peaceful Villa", location: "Green Area, Villianur", floor: "Ground", area: "1300 Sq.ft", date: "12 Feb 2026", price: "₹45,000", featured: true, image: null },
//       { id: 3, type: "Residential", name: "Garden Apartment", location: "Tree Zone, Villianur", floor: "1st Floor", area: "750 Sq.ft", date: "11 Feb 2026", price: "₹28,000", featured: false, image: null }
//     ]
//   };

//   const cityData = properties[city?.toLowerCase()] || [];
//   const formattedCity = city?.charAt(0).toUpperCase() + city?.slice(1) || "Unknown";

//   const handleBack = () => {
//     navigate(-1);
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center vh-100" 
//          style={{ minHeight: "100vh", background: '#E5E5E5' }}>
//       <div style={{ 
//         maxWidth: '470px', 
//         width: "100%", 
//         background: 'white', 
//         display: "flex", 
//         flexDirection: "column", 
//         overflow: "hidden",
//         height: "100vh"
//       }}>
//         {/* Header with Back Button */}
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           padding: '16px',
//           background: 'linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)',
//           color: '#fff',
//           boxShadow: '0 2px 8px rgba(79, 75, 126, 0.2)'
//         }}>
//           <button
//             onClick={handleBack}
//             style={{
//               background: 'none',
//               border: 'none',
//               color: '#fff',
//               cursor: 'pointer',
//               fontSize: '24px',
//               padding: '0 10px 0 0',
//               display: 'flex',
//               alignItems: 'center',
//               transition: 'transform 0.2s ease'
//             }}
//             onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
//             onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
//           >
//             <FaArrowLeft />
//           </button>
//           <h2 style={{
//             margin: '0',
//             fontSize: '20px',
//             fontWeight: '700',
//             flex: 1,
//             textAlign: 'center'
//           }}>
//             {formattedCity}
//           </h2>
//           <div style={{ width: '34px' }}></div>
//         </div>

//         {/* Properties List */}
//         <div style={{
//           flex: 1,
//           overflowY: 'auto',
//           padding: '16px'
//         }}>
//           {cityData.length > 0 ? (
//             <div className="exclusive-details-list">
//               {cityData.map((property) => (
//                 <div key={property.id} className="property-card">
//                   {/* Image Left */}
//                   <div className="property-image-wrapper">
//                     <img src={property.image || defaultImage} alt={property.name} className="property-image" />
//                   </div>
                  
//                   {/* Details Right */}
//                   <div className="property-details">
//                     <p className="property-type">{property.type}</p>
//                     <h3 className="property-name">{property.name}</h3>
//                     <p className="property-location">{property.location}</p>
                    
//                     <div className="property-specs">
//                       <span className="spec-item">📍 {property.floor}</span>
//                       <span className="spec-item">📐 {property.area}</span>
//                     </div>
                    
//                     <div className="property-footer">
//                       <p className="property-date">{property.date}</p>
//                       <p className="property-price">{property.price}/Monthly</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div style={{
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               height: '100%',
//               color: '#999'
//             }}>
//               <p>No properties found</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExclusiveDetails;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaTimes, FaSearch, FaPhone, FaHeart, FaRegHeart, FaMapMarkerAlt, FaGlobe, FaBars } from "react-icons/fa";
import DefaultImg from "../Assets/Defaultimg.png";
import "./ExclusiveDetails.css";
import "./StayCard.css";

const areaPincodeMap = {
  "Abishegapakkam": "605007",
  "Ariyankuppam": "605007",
  "Arumbarthapuram": "605110",
  "Bahoor": "607402",
  "Bommayarpalayam": "605104",
  "Botanical Garden": "605001",
  "calapet": "605014",
  "Courivinatham": "607402",
  "Dhanvantry Nagar": "605006",
  "Embalam": "605106",
  "Irumbai": "605111",
  "Karayamputhur": "605106",
  "Karikalambakkam": "605007",
  "Kariyamanikam": "605106",
  "Kijour": "605106",
  "Kilpudupattu": "605014",
  "Kilsirivi": "604301",
  "Kirumambakkam": "607402",
  "Korkadu": "605110",
  "Kottakuppam": "605104",
  "Kuilapalayam": "605101",
  "Lawspet": "605008",
  "Maducore": "605105",
  "Manamedu": "607402",
  "Manapeth": "607402",
  "Mandagapet": "605106",
  "Mangalam": "605110",
  "Mannadipattu": "605501",
  "Morattandi": "605101",
  "Mottoupalayam": "605009",
  "Mouroungapakkam": "605004",
  "Moutrepaleam": "605009",
  "Mudaliarpet": "605004",
  "Muthialpet": "605003",
  "Mutrampattu": "605501",
  "Moolakulam": "605010",
  "Nallavadu": "605007",
  "Nellithoppe": "605005",
  "Nettapakkam": "605106",
  "Odiensalai": "605001",
  "Ozhugarai": "605010",
  "Padmin nagar": "605012",
  "Pakkam": "605106",
  "Pandakkal": "673310",
  "Pillaichavady": "605014",
  "Pillayarkuppam": "607402",
  "Pondicherry": "605001",
  "Pondicherry Bazaar": "605001",
  "Pondicherry Courts": "605001",
  "Pondicherry North": "605001",
  "Pondicherry University": "605014",
  "Pooranankuppam": "605007",
  "Poothurai": "605111",
  "Rayapudupakkam": "605111",
  "Reddiyarpalayam": "605010",
  "Saram(py)": "605013",
  "Sedarapet": "605111",
  "Seliamedu": "607402",
  "Sellipet": "605501",
  "Sri Aurobindo ashram": "605002",
  "Sulthanpet": "605110",
  "Thattanchavadi": "605009",
  "Thengaithittu": "605004",
  "Thimmanaickenpalayam": "605007",
  "Tirukkanur": "605501",
  "Vadhanur": "605501",
  "Veerampattinam": "605007",
  "Venkata Nagar": "605011",
  "Villiyanur": "605110",
  "Vimacoundinpaleam": "605009",
  "Viranam": "605106",
  "Yanam": "533464",
};

// One viewer list (Detail Page Viewers / Contact Viewers).
// When `maskable`, viewer numbers show the last 5 digits hidden until the user
// pays points to reveal them (handled by the parent via onReveal).
const LeadGroup = ({ title, count, accent, bg, rows, maskable, revealed, revealing, onReveal, revealCost }) => (
  <div style={{ marginBottom: "16px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "4px 0 10px" }}>
      <span style={{ fontSize: "14px", fontWeight: 800, color: "#1f2937" }}>{title}</span>
      <span style={{ background: bg, color: accent, borderRadius: "12px", padding: "2px 10px", fontSize: "12px", fontWeight: 800 }}>{count}</span>
    </div>
    {rows.length === 0 ? (
      <div style={{ fontSize: "13px", color: "#94a3b8", padding: "4px 2px 8px" }}>No one yet.</div>
    ) : (
      rows.map((r, i) => {
        const num = r.viewerPhoneNumber || "";
        const hidden = maskable && num && !(revealed && revealed.has(num));
        const display = !num ? "Guest" : hidden ? `${num.slice(0, Math.max(0, num.length - 5))}*****` : num;
        const isRevealing = revealing && revealing.has(num);
        return (
          <div
            key={i}
            style={{ background: "#fff", borderRadius: "10px", padding: "10px 12px", marginBottom: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: accent, letterSpacing: hidden ? "1px" : "normal" }}>{display}</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                {[r.propertyType, r.area].filter(Boolean).join(" · ") || (r.rentId ? `Rent #${r.rentId}` : "")}
              </div>
            </div>
            {hidden ? (
              <button
                onClick={() => onReveal(num)}
                disabled={isRevealing}
                style={{ flexShrink: 0, background: accent, color: "#fff", border: "none", borderRadius: "8px", padding: "7px 12px", fontSize: "12px", fontWeight: 700, cursor: isRevealing ? "default" : "pointer", opacity: isRevealing ? 0.7 : 1 }}
              >
                {isRevealing ? "…" : revealCost ? `Reveal · ${revealCost} pts` : "Reveal"}
              </button>
            ) : r.viewedAt ? (
              <div style={{ fontSize: "11px", color: "#9ca3af", whiteSpace: "nowrap" }}>
                {new Date(r.viewedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </div>
            ) : null}
          </div>
        );
      })
    )}
  </div>
);

const ExclusiveDetails = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [expandedImage, setExpandedImage] = useState(null);
  const [expandedPropertyId, setExpandedPropertyId] = useState(null);
  const [processedImages, setProcessedImages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());
  // Local-only "save" toggle for the heart on each stay card (UI feedback only,
  // no backend persistence).
  const [favorites, setFavorites] = useState(new Set());

  // Recently viewed tourist stays (per-device, persisted in localStorage)
  const [recentStays, setRecentStays] = useState([]);
  const loadRecent = () => {
    try {
      const list = JSON.parse(localStorage.getItem("rp_recent_stays") || "[]");
      setRecentStays(Array.isArray(list) ? list : []);
    } catch {
      setRecentStays([]);
    }
  };
  useEffect(() => { loadRecent(); }, []);

  // Hamburger "Leads" panel — tourist-only, two views of the same data:
  //   "property" → Tourist Property Lead (per-stay breakdown)
  //   "tourist"  → Tourist Lead (all detail + contact viewers combined)
  const [showLeads, setShowLeads] = useState(false);
  const [leadTab, setLeadTab] = useState("recent");
  const [touristStats, setTouristStats] = useState([]);
  const [touristLoading, setTouristLoading] = useState(false);
  const [touristError, setTouristError] = useState("");

  // Tourist Lead tab — ALL detail/contact viewers across every tourist property
  const [allDetail, setAllDetail] = useState([]);
  const [allContact, setAllContact] = useState([]);
  const [allLoading, setAllLoading] = useState(false);
  const [allError, setAllError] = useState("");

  // Tourist Lead contact reveal (points-gated; last 5 digits masked until revealed)
  const [touristRevealCost, setTouristRevealCost] = useState(10);
  const [revealedNums, setRevealedNums] = useState(() => {
    // Numbers already revealed/paid on this device persist across reloads
    try {
      const arr = JSON.parse(localStorage.getItem("rp_revealed_tourist") || "[]");
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  });
  const [revealing, setRevealing] = useState(() => new Set());
  useEffect(() => {
    fetch("https://rentpondy.com/PPC/PPC/points-config-public", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { if (d && d.pointsPerTouristContactReveal) setTouristRevealCost(d.pointsPerTouristContactReveal); })
      .catch(() => {});
  }, []);

  // Persist a revealed number (state + localStorage)
  const markRevealed = (num) => {
    setRevealedNums((prev) => {
      const next = new Set(prev).add(num);
      try { localStorage.setItem("rp_revealed_tourist", JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  // Pre-reveal numbers this user has already paid for (from points history)
  const loadRevealedNums = async (phone) => {
    if (!phone) return;
    try {
      const res = await fetch(`https://rentpondy.com/PPC/PPC/points-transactions/${phone}?limit=200`, { cache: "no-store" });
      const data = await res.json();
      if (data && data.success && Array.isArray(data.transactions)) {
        const nums = [];
        data.transactions.forEach((t) => {
          if (t.reason === "view-tourist-contact" && t.rentId && String(t.rentId).startsWith("tourist-")) {
            nums.push(String(t.rentId).slice(8));
          }
        });
        if (nums.length) {
          setRevealedNums((prev) => {
            const next = new Set([...prev, ...nums]);
            try { localStorage.setItem("rp_revealed_tourist", JSON.stringify([...next])); } catch {}
            return next;
          });
        }
      }
    } catch {
      /* best-effort */
    }
  };

  const LEADS_API = "https://rentpondy.com/PPC/PPC";

  const getViewerPhone = () => {
    try {
      const digits = (localStorage.getItem("phoneNumber") || "").replace(/\D/g, "");
      return digits.length >= 10 ? digits.slice(-10) : "";
    } catch {
      return "";
    }
  };

  // Detail + contact viewers of the tourist stays the user posted
  const loadTouristLeads = async (phone) => {
    if (!phone) {
      setTouristStats([]);
      setTouristError("Please log in to see leads for the stays you posted.");
      return;
    }
    try {
      setTouristError("");
      setTouristLoading(true);
      const res = await fetch(`${LEADS_API}/my-stay-stats?phone=${phone}`, { cache: "no-store" });
      const result = await res.json();
      const data = result.success ? (result.data || []) : [];
      setTouristStats(data);
      setTouristError(data.length ? "" : "No tourist stays found for your number yet.");
    } catch {
      setTouristError("Could not load leads. Please try again.");
    } finally {
      setTouristLoading(false);
    }
  };

  // Tourist Lead — every detail-page / contact viewer across all tourist stays
  const loadAllLeads = async () => {
    loadRevealedNums(getViewerPhone()); // pre-reveal numbers already paid for
    try {
      setAllError("");
      setAllLoading(true);
      const res = await fetch(`${LEADS_API}/stay-view-log`, { cache: "no-store" });
      const result = await res.json();
      const d = result.success ? (result.detail || []) : [];
      const c = result.success ? (result.contact || []) : [];
      setAllDetail(d);
      setAllContact(c);
      setAllError(d.length || c.length ? "" : "No tourist viewers yet.");
    } catch {
      setAllError("Could not load viewers. Please try again.");
    } finally {
      setAllLoading(false);
    }
  };

  // Pay points to reveal a masked Tourist Lead contact number
  const revealTouristContact = async (num) => {
    if (!num || revealedNums.has(num) || revealing.has(num)) return;
    const phone = getViewerPhone();
    if (!phone) {
      alert("Please log in to reveal contact numbers.");
      return;
    }
    const cost = touristRevealCost;
    if (!window.confirm(`Reveal this contact number for ${cost} point${cost === 1 ? "" : "s"}?`)) return;
    setRevealing((prev) => new Set(prev).add(num));
    try {
      const res = await fetch(`${LEADS_API}/points-deduct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone, points: cost, rentId: `tourist-${num}`, reason: "view-tourist-contact" }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        markRevealed(num);
      } else if (res.status === 402) {
        alert(`Insufficient points. You need ${cost} points to reveal this contact.`);
      } else {
        alert(data.message || "Could not reveal contact. Please try again.");
      }
    } catch {
      alert("Could not reveal contact. Please try again.");
    } finally {
      setRevealing((prev) => {
        const n = new Set(prev);
        n.delete(num);
        return n;
      });
    }
  };

  const openLeads = () => {
    setShowLeads(true);
    setLeadTab("recent");
    loadRecent();
  };

  const selectLeadTab = (tab) => {
    setLeadTab(tab);
    if (tab === "tourist") loadAllLeads();
    else if (tab === "recent") loadRecent();
    else loadTouristLeads(getViewerPhone());
  };

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const defaultImage = DefaultImg;
  
  // Fallback SVG if asset image fails to load
  const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23E5E5E5'/%3E%3Ctext x='50%25' y='50%25' font-size='20' text-anchor='middle' fill='%23999' dy='.3em'%3ENo Image Available%3C/text%3E%3C/svg%3E";

  // Show the per-night price as a range (falls back to legacy pricePerNight)
  const formatNightlyPrice = (p) => {
    const { priceMin, priceMax, pricePerNight } = p;
    if (priceMin && priceMax) return `₹${priceMin} - ₹${priceMax}`;
    if (priceMin) return `₹${priceMin}`;
    if (priceMax) return `₹${priceMax}`;
    if (pricePerNight) return `₹${pricePerNight}`;
    return "—";
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Auto-slideshow: change image every 1 second for each property
  useEffect(() => {
    const intervals = [];
    
    if (properties.length > 0) {
      properties.forEach((property) => {
        const images = processedImages[property._id] || [defaultImage];
        
        // Only set interval if property has multiple images
        if (images.length > 1) {
          const interval = setInterval(() => {
            setCurrentImageIndex((prevState) => {
              const currentIdx = prevState[property._id] || 0;
              const nextIdx = (currentIdx + 1) % images.length;
              return {
                ...prevState,
                [property._id]: nextIdx
              };
            });
          }, 1000); // Change image every 1 second
          
          intervals.push(interval);
        }
      });
    }
    
    // Cleanup intervals on unmount or when properties change
    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [properties, processedImages, defaultImage]);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      // Fetch ALL properties from backend API - no location filtering
      const response = await fetch(
        "https://rentpondy.com/PPC/PPC/read-prop?page=1&limit=1000&propertyMode=&location=&search=&createdBy=&createdDate=",
        { cache: "no-store" }
      );

      const result = await response.json();
      console.log("📡 API Response:", result);

      if (result.success && Array.isArray(result.data)) {
        const allProperties = result.data;
        console.log("📦 Total exclusive properties from API:", allProperties.length);
        
        // Process all images upfront - CACHE THEM
        const imagesCache = {};
        allProperties.forEach((prop) => {
          if (prop.images && prop.images.length > 0) {
            const processedImgs = prop.images
              .map(img => {
                // If no URL, use default
                if (!img.url) return defaultImage;
                // If already a full URL, use as is
                if (img.url.startsWith("http")) return img.url;
                // If it's a relative path, construct full URL
                const cleanPath = img.url.startsWith("/") ? img.url : "/" + img.url;
                return `https://rentpondy.com/PPC${cleanPath}`;
              })
              .filter(url => url); // Filter out any empty values
            
            // Ensure at least one image (default if all failed)
            imagesCache[prop._id] = processedImgs.length > 0 ? processedImgs : [defaultImage];
          } else {
            // No images provided, use default
            imagesCache[prop._id] = [defaultImage];
          }
        });
        
        console.log("✅ Images processed and cached for all properties");
        setProcessedImages(imagesCache);
        setProperties(allProperties);
        
        // Initialize current image index for each property
        const indexMap = {};
        allProperties.forEach((prop) => {
          indexMap[prop._id] = 0;
        });
        setCurrentImageIndex(indexMap);
      } else {
        console.warn("⚠️ Invalid API response or no data");
        setProperties([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("❌ API Error:", error);
      setProperties([]);
      setLoading(false);
    }
  };

  const formattedCity = "Tourist - Place To Stay";

  // Get location suggestions (by location name or pincode)
  const getLocationSuggestions = (query) => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return Object.keys(areaPincodeMap).filter(location => {
      const locationMatch = location.toLowerCase().includes(lowerQuery);
      const pincodeMatch = areaPincodeMap[location].includes(query);
      return locationMatch || pincodeMatch;
    }).slice(0, 8); // Show max 8 suggestions
  };

  // Filter properties by location
  const filteredProperties = selectedLocation
    ? properties.filter(prop => {
        const propLocation = prop.location?.toLowerCase() || "";
        return propLocation.includes(selectedLocation.toLowerCase());
      })
    : properties;

  // Handle location selection
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchQuery(location);
    setShowSuggestions(false);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedLocation("");
    setShowSuggestions(false);
  };
  const handleNextImage = (e, property) => {
    e.stopPropagation();
    const images = processedImages[property._id] || [defaultImage];
    const currentIndex = currentImageIndex[property._id] || 0;
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentImageIndex({
      ...currentImageIndex,
      [property._id]: nextIndex
    });
  };

  // Handle previous image
  const handlePrevImage = (e, property) => {
    e.stopPropagation();
    const images = processedImages[property._id] || [defaultImage];
    const currentIndex = currentImageIndex[property._id] || 0;
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentImageIndex({
      ...currentImageIndex,
      [property._id]: prevIndex
    });
  };

  // Handle expanded image navigation
  const handleExpandedPrevImage = () => {
    if (!expandedPropertyId) return;
    const images = processedImages[expandedPropertyId] || [defaultImage];
    const currentIdx = currentImageIndex[expandedPropertyId] || 0;
    const prevIdx = currentIdx === 0 ? images.length - 1 : currentIdx - 1;
    setCurrentImageIndex({
      ...currentImageIndex,
      [expandedPropertyId]: prevIdx
    });
    setExpandedImage({
      url: images[prevIdx],
      currentIndex: prevIdx,
      totalImages: images.length
    });
  };

  // Handle expanded image next navigation
  const handleExpandedNextImage = () => {
    if (!expandedPropertyId) return;
    const images = processedImages[expandedPropertyId] || [defaultImage];
    const currentIdx = currentImageIndex[expandedPropertyId] || 0;
    const nextIdx = (currentIdx + 1) % images.length;
    setCurrentImageIndex({
      ...currentImageIndex,
      [expandedPropertyId]: nextIdx
    });
    setExpandedImage({
      url: images[nextIdx],
      currentIndex: nextIdx,
      totalImages: images.length
    });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ minHeight: "100vh", background: "#E5E5E5" }}
    >
      {/* Expanded Image Modal */}
      {expandedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px"
          }}
          onClick={() => {
            setExpandedImage(null);
            setExpandedPropertyId(null);
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              setExpandedImage(null);
              setExpandedPropertyId(null);
            }}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "#764ba2",
              border: "none",
              color: "#fff",
              fontSize: "28px",
              cursor: "pointer",
              padding: "10px 15px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "50px",
              height: "50px",
              zIndex: 10000
            }}
          >
            <FaTimes />
          </button>

          {/* Previous Arrow */}
          {expandedImage.totalImages > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleExpandedPrevImage();
              }}
              style={{
                position: "absolute",
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(118, 75, 162, 0.8)",
                border: "none",
                color: "#fff",
                fontSize: "32px",
                padding: "15px 18px",
                cursor: "pointer",
                borderRadius: "50%",
                transition: "background 0.2s ease",
                zIndex: 10000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "60px",
                height: "60px"
              }}
              onMouseEnter={(e) => e.target.style.background = "rgba(118, 75, 162, 1)"}
              onMouseLeave={(e) => e.target.style.background = "rgba(118, 75, 162, 0.8)"}
            >
              <FaChevronLeft />
            </button>
          )}

          {/* Next Arrow */}
          {expandedImage.totalImages > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleExpandedNextImage();
              }}
              style={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(118, 75, 162, 0.8)",
                border: "none",
                color: "#fff",
                fontSize: "32px",
                padding: "15px 18px",
                cursor: "pointer",
                borderRadius: "50%",
                transition: "background 0.2s ease",
                zIndex: 10000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "60px",
                height: "60px"
              }}
              onMouseEnter={(e) => e.target.style.background = "rgba(118, 75, 162, 1)"}
              onMouseLeave={(e) => e.target.style.background = "rgba(118, 75, 162, 0.8)"}
            >
              <FaChevronRight />
            </button>
          )}

          {/* Expanded Image */}
          <img
            src={expandedImage.url}
            alt="Expanded Property"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain"
            }}
            onError={(e) => {
              // Cascade fallback: API image -> defaultImage -> fallbackImage
              if (e.target.src === defaultImage) {
                // If default image failed, use fallback SVG
                e.target.src = fallbackImage;
              } else if (!e.target.src.includes("data:image")) {
                // If API image failed, try default image
                e.target.src = defaultImage;
              }
            }}
          />

          {/* Navigation */}
          {expandedImage.totalImages > 1 && (
            <div style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "700",
              background: "rgba(118, 75, 162, 0.7)",
              padding: "10px 20px",
              borderRadius: "20px",
              zIndex: 10000
            }}>
              {expandedImage.currentIndex + 1} / {expandedImage.totalImages}
            </div>
          )}
          {filteredProperties.length === 0 && selectedLocation && (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "#999" }}>
              <div style={{ fontSize: "16px", marginBottom: "8px" }}>No properties found in {selectedLocation}</div>
              <div style={{ fontSize: "13px" }}>Try a different location</div>
            </div>
          )}

          {filteredProperties.length === 0 && !selectedLocation && properties.length === 0 && (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "#999" }}>Loading properties...</div>
          )}        </div>
      )}

      <div
        style={{
          maxWidth: "470px",
          width: "100%",
          background: "white",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px",
            background:
              "linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)",
            color: "#fff",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontSize: "24px",
              paddingRight: "10px",
            }}
          >
            <FaArrowLeft />
          </button>

          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "700",
              flex: 1,
              textAlign: "center",
            }}
          >
            {formattedCity}
          </h2>

          <button
            onClick={openLeads}
            aria-label="My leads"
            title="Property & Tourist leads"
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontSize: "22px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "10px",
            }}
          >
            <FaBars />
          </button>
        </div>

        {/* Leads panel (opened from the hamburger) — Property Lead + Tourist Lead */}
        {showLeads && (
          <div
            onClick={() => setShowLeads(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 60, display: "flex", justifyContent: "center" }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "470px", width: "100%", height: "100vh", background: "#f4f5f8", display: "flex", flexDirection: "column", boxShadow: "0 0 30px rgba(0,0,0,0.3)" }}
            >
              {/* Panel header */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px", background: "linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)", color: "#fff" }}>
                <button onClick={() => setShowLeads(false)} aria-label="Back" style={{ background: "none", border: "none", color: "#fff", fontSize: "22px", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}>
                  <FaArrowLeft />
                </button>
                <h3 style={{ margin: 0, flex: 1, fontSize: "17px", fontWeight: 700, textAlign: "center" }}>My Leads</h3>
                <button onClick={() => setShowLeads(false)} aria-label="Close" style={{ background: "none", border: "none", color: "#fff", fontSize: "20px", cursor: "pointer" }}>
                  <FaTimes />
                </button>
              </div>

              {/* Tab buttons */}
              <div style={{ display: "flex", gap: "10px", padding: "12px 14px", background: "#fff", borderBottom: "1px solid #eee" }}>
                {[
                  { key: "recent", label: "Last Viewed" },
                  { key: "property", label: "Tourist Property Lead" },
                  { key: "tourist", label: "Tourist Lead" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => selectLeadTab(t.key)}
                    style={{
                      flex: 1,
                      padding: "10px 6px",
                      borderRadius: "10px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "12.5px",
                      fontWeight: 700,
                      lineHeight: 1.2,
                      color: leadTab === t.key ? "#fff" : "#4F4B7E",
                      background: leadTab === t.key ? "linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)" : "#eef0f6",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Panel body */}
              <div style={{ flex: 1, overflowY: "auto", padding: "14px" }}>
                {leadTab === "property" ? (
                  /* Tourist Property Lead — per-stay breakdown (the user's own stays) */
                  touristLoading ? (
                    <p style={{ textAlign: "center", color: "#888", marginTop: "40px" }}>Loading…</p>
                  ) : touristError ? (
                    <p style={{ textAlign: "center", color: "#888", marginTop: "40px", padding: "0 20px" }}>{touristError}</p>
                  ) : (
                  touristStats.map((s) => {
                    const detailNums = (s.detailViewerList || []).map((v) => v.viewerPhoneNumber).filter(Boolean);
                    const contactNums = (s.contactViewerList || []).map((v) => v.viewerPhoneNumber).filter(Boolean);
                    return (
                      <div key={s.propertyId} style={{ background: "#fff", borderRadius: "14px", padding: "14px", marginBottom: "12px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                        <div style={{ fontSize: "12px", fontWeight: 800, color: "#764ba2", letterSpacing: "0.5px" }}>PROP #{s.propertyId}</div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#1f2937", margin: "2px 0 10px" }}>{s.stayName || "Tourist Stay"}</div>

                        <div style={{ display: "flex", gap: "10px" }}>
                          <div style={{ flex: 1, background: "#eef2ff", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                            <div style={{ fontSize: "22px", fontWeight: 900, color: "#4338ca" }}>{s.detailViewers}</div>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: "#6b7280" }}>Detail Page Viewers</div>
                          </div>
                          <div style={{ flex: 1, background: "#eafaf0", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                            <div style={{ fontSize: "22px", fontWeight: 900, color: "#15803d" }}>{s.contactViewers}</div>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: "#6b7280" }}>Contact Viewers</div>
                          </div>
                        </div>

                        {detailNums.length > 0 && (
                          <div style={{ marginTop: "10px", fontSize: "12px", color: "#475569" }}>
                            <b>Detail viewers:</b> {detailNums.join(", ")}
                          </div>
                        )}
                        {contactNums.length > 0 && (
                          <div style={{ marginTop: "6px", fontSize: "12px", color: "#475569" }}>
                            <b>Contact viewers:</b> {contactNums.join(", ")}
                          </div>
                        )}
                      </div>
                    );
                  })
                  )
                ) : leadTab === "tourist" ? (
                  /* Tourist Lead — ALL detail + contact viewers across every tourist property (admin data) */
                  allLoading ? (
                    <p style={{ textAlign: "center", color: "#888", marginTop: "40px" }}>Loading…</p>
                  ) : allError ? (
                    <p style={{ textAlign: "center", color: "#888", marginTop: "40px", padding: "0 20px" }}>{allError}</p>
                  ) : (
                    <>
                      <LeadGroup
                        title="Detail Page Viewers"
                        count={allDetail.length}
                        accent="#4338ca"
                        bg="#eef2ff"
                        rows={allDetail.map((r) => ({ viewerPhoneNumber: r.viewerPhoneNumber, propertyType: r.stayName, area: `#${r.propertyId}`, viewedAt: r.viewedAt }))}
                        maskable
                        revealed={revealedNums}
                        revealing={revealing}
                        onReveal={revealTouristContact}
                        revealCost={touristRevealCost}
                      />
                      <LeadGroup
                        title="Contact Viewers"
                        count={allContact.length}
                        accent="#15803d"
                        bg="#eafaf0"
                        rows={allContact.map((r) => ({ viewerPhoneNumber: r.viewerPhoneNumber, propertyType: r.stayName, area: `#${r.propertyId}`, viewedAt: r.viewedAt }))}
                        maskable
                        revealed={revealedNums}
                        revealing={revealing}
                        onReveal={revealTouristContact}
                        revealCost={touristRevealCost}
                      />
                    </>
                  )
                ) : (
                  /* Last Viewed — tourist stays this device recently opened */
                  recentStays.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#888", marginTop: "40px", padding: "0 20px" }}>You haven't viewed any tourist stays yet.</p>
                  ) : (
                    <>
                      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                        <span style={{ fontSize: "14px", fontWeight: 800, color: "#1f2937" }}>🕘 Last Viewed Stays</span>
                      </div>
                      {recentStays.map((s) => (
                        <div
                          key={s._id}
                          onClick={() => { setShowLeads(false); navigate(`/stay/${s._id}`); }}
                          style={{ display: "flex", gap: "12px", alignItems: "center", background: "#fff", borderRadius: "12px", padding: "10px", marginBottom: "10px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", cursor: "pointer" }}
                        >
                          <img src={s.image || defaultImage} alt={s.stayName} onError={(e) => { e.target.src = defaultImage; }} style={{ width: "70px", height: "70px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }} />
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: "12px", fontWeight: 800, color: "#764ba2" }}>PROP #{s.propertyId}</div>
                            <div style={{ fontSize: "14px", fontWeight: 700, color: "#1f2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.stayName}</div>
                            <div style={{ fontSize: "12px", color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.location || s.city}</div>
                            <div style={{ fontSize: "13px", fontWeight: 800, color: "#764ba2", marginTop: "2px" }}>{s.price}</div>
                          </div>
                        </div>
                      ))}
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Property List */}
        <div className="rp-stay-scroll" style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {/* Add Your Stay button */}
          <button
            onClick={() => navigate("/add-stay")}
            style={{
              width: "100%",
              marginBottom: "16px",
              padding: "13px",
              background: "linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(118,75,162,0.25)"
            }}
          >
            ➕ Add Your Property
          </button>

          {/* Professional Search Bar */}
          <div style={{ marginBottom: "20px", position: "relative" }}>
            {/* Search Container */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#fff",
              border: "2px solid #e0e0e0",
              borderRadius: "12px",
              padding: "0 14px",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)"
            }}
            onFocus={() => setShowSuggestions(true)}
            onMouseEnter={(e) => {
              if (searchQuery) {
                e.currentTarget.style.borderColor = "#764ba2";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(118, 75, 162, 0.15)";
              }
            }}
            onMouseLeave={(e) => {
              if (!searchQuery) {
                e.currentTarget.style.borderColor = "#e0e0e0";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
              }
            }}
            >
              <FaSearch style={{ color: "#764ba2", fontSize: "16px" }} />
              <input
                type="text"
                placeholder="Search location or pincode..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  border: "none",
                  fontSize: "16px",
                  fontFamily: "inherit",
                  outline: "none",
                  background: "transparent",
                  color: "#222"
                }}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "18px",
                    cursor: "pointer",
                    color: "#999",
                    padding: "4px 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "color 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.target.style.color = "#764ba2"}
                  onMouseLeave={(e) => e.target.style.color = "#999"}
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Professional Suggestions Dropdown */}
            {showSuggestions && getLocationSuggestions(searchQuery).length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: "0",
                  right: "0",
                  background: "#fff",
                  border: "2px solid #e0e0e0",
                  borderRadius: "12px",
                  maxHeight: "350px",
                  overflowY: "auto",
                  zIndex: 1000,
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                  paddingTop: "8px",
                  paddingBottom: "8px"
                }}
              >
                {getLocationSuggestions(searchQuery).map((location, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleLocationSelect(location)}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      background: selectedLocation === location ? "#f3e5f5" : "transparent",
                      borderLeft: selectedLocation === location ? "4px solid #764ba2" : "4px solid transparent",
                      marginX: "8px",
                      borderRadius: "8px",
                      marginLeft: "8px",
                      marginRight: "8px",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedLocation !== location) {
                        e.currentTarget.style.background = "#f9f9f9";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedLocation !== location) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <div style={{
                      fontWeight: selectedLocation === location ? "700" : "600",
                      color: selectedLocation === location ? "#764ba2" : "#222",
                      fontSize: "15px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      📍 {location}
                    </div>
                    <div style={{
                      fontSize: "13px",
                      color: "#999",
                      marginTop: "4px",
                      marginLeft: "24px",
                      fontWeight: "500"
                    }}>
                      {areaPincodeMap[location]}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Results Badge */}
          {selectedLocation && (
            <div style={{
              marginBottom: "16px",
              padding: "10px 14px",
              background: "linear-gradient(135deg, #f3e5f5 0%, #fce4ec 100%)",
              borderRadius: "8px",
              fontSize: "14px",
              color: "#764ba2",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid rgba(118, 75, 162, 0.2)"
            }}>
              ✓ {filteredProperties.length} stay{filteredProperties.length !== 1 ? "s" : ""} found
            </div>
          )}
          {loading ? (
            <p style={{ textAlign: "center" }}>Loading...</p>
          ) : properties.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filteredProperties.map((property, index) => {
                const images = processedImages[property._id] || [defaultImage];
                const currentIndex = currentImageIndex[property._id] || 0;

                return (
                  <div
                    key={property._id || property.id || index}
                    className="rp-stay-card"
                    onClick={() => navigate(`/stay/${property._id}`, { state: { property } })}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Hero / image slider */}
                    <div
                      className="rp-stay-media"
                      onClick={() => navigate(`/stay/${property._id}`, { state: { property } })}
                    >
                      <img
                        src={images[currentIndex]}
                        alt={property.location || "Property"}
                        className="rp-stay-img"
                        onError={(e) => {
                          // Cascade fallback: API image -> defaultImage -> fallbackImage
                          if (e.target.src === defaultImage) {
                            e.target.src = fallbackImage;
                          } else if (!e.target.src.includes("data:image")) {
                            e.target.src = defaultImage;
                          }
                        }}
                      />

                      {/* Gradient overlay for legibility */}
                      <div className="rp-stay-media-overlay" />

                      {/* Category badge */}
                      <span className="rp-stay-media-cat">{property.stayType || "Stay"}</span>

                      {/* Favorite — local UI toggle only (no backend) */}
                      <button
                        type="button"
                        className={`rp-stay-fav${favorites.has(property._id) ? " is-active" : ""}`}
                        aria-label={favorites.has(property._id) ? "Remove from saved" : "Save"}
                        onClick={(e) => toggleFavorite(e, property._id)}
                      >
                        {favorites.has(property._id) ? <FaHeart /> : <FaRegHeart />}
                      </button>

                      {/* Image counter */}
                      <div className="rp-stay-counter">
                        {currentIndex + 1} / {images.length}
                      </div>

                      {/* Previous / Next */}
                      {images.length > 1 && (
                        <button
                          className="rp-stay-nav rp-stay-nav--prev"
                          onClick={(e) => handlePrevImage(e, property)}
                          aria-label="Previous image"
                        >
                          <FaChevronLeft />
                        </button>
                      )}
                      {images.length > 1 && (
                        <button
                          className="rp-stay-nav rp-stay-nav--next"
                          onClick={(e) => handleNextImage(e, property)}
                          aria-label="Next image"
                        >
                          <FaChevronRight />
                        </button>
                      )}
                    </div>

                    {/* Body */}
                    <div className="rp-stay-body">
                      {/* Top row: ID + category */}
                      <div className="rp-stay-toprow">
                        <div className="rp-stay-idtags">
                          <span className="rp-stay-id">PROP #{property.propertyId}</span>
                          <span className="rp-stay-cat">{property.stayType || "Stay"}</span>
                        </div>
                      </div>

                      {/* Title (click to view full details) */}
                      <h3
                        className="rp-stay-title"
                        onClick={(e) => { e.stopPropagation(); navigate(`/stay/${property._id}`, { state: { property } }); }}
                        title="View full details"
                        style={{ cursor: "pointer" }}
                      >
                        {property.stayName || property.location || "Tourist Stay"}
                      </h3>

                      {/* Location */}
                      <p className="rp-stay-loc">
                        <FaMapMarkerAlt /> {property.location}{property.city ? `, ${property.city}` : ""}
                      </p>

                      {/* Amenity chips */}
                      <div className="rp-stay-chips">
                        <span className="rp-stay-chip">🏨 {property.stayType || "—"}</span>
                        <span className="rp-stay-chip">⭐ {property.starRating ? `${property.starRating} Star` : "—"}</span>
                        <span className="rp-stay-chip">🍽️ {property.mealPlan || "—"}</span>
                        {property.taxType && (
                          <span className="rp-stay-chip">🏷️ {property.taxType}</span>
                        )}
                      </div>

                      {/* Price + Visit Website */}
                      <div className="rp-stay-pricerow">
                        <div className="rp-stay-price">
                          <span className="rp-stay-price-amount">{formatNightlyPrice(property)}</span>
                          <span className="rp-stay-price-unit">per night</span>
                        </div>
                        {property.websiteLink && (
                          <a
                            href={property.websiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rp-stay-website"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaGlobe /> Visit Website
                          </a>
                        )}
                      </div>

                      {/* Meta: posted date */}
                      <div className="rp-stay-meta">
                        <span className="rp-stay-meta-date">
                          📅 Posted {property.createdAt
                            ? new Date(property.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                              })
                            : "N/A"}
                        </span>
                      </div>

                      {/* View full details */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); navigate(`/stay/${property._id}`, { state: { property } }); }}
                        style={{
                          width: "100%",
                          marginTop: "10px",
                          padding: "11px",
                          background: "#764ba2",
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          fontSize: "14px",
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        View Details ›
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#999" }}>
              No tourist places found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExclusiveDetails;




