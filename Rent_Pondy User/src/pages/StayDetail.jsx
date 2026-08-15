import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaPhone, FaWhatsapp, FaGlobe, FaMapMarkerAlt, FaTimes, FaAddressCard } from "react-icons/fa";
import DefaultImg from "../Assets/Defaultimg.png";

const API_BASE = "https://rentpondy.com/PPC/PPC";
const MEDIA_BASE = "https://rentpondy.com/PPC";
const PURPLE = "#764ba2";

const AMENITY_ICONS = {
  "Free WiFi": "📶", "Air Conditioning": "❄️", "Swimming Pool": "🏊", "Free Parking": "🅿️",
  "Restaurant": "🍽️", "Room Service": "🛎️", "Power Backup": "🔋", "Hot Water": "🚿",
  "Television": "📺", "Breakfast": "🥐", "Pet Friendly": "🐾", "Beach Access": "🏖️",
  "Garden / Lawn": "🌳", "Bar / Lounge": "🍸", "Spa": "💆", "Gym": "🏋️", "Laundry": "🧺",
  "Airport Pickup": "🚐", "CCTV Security": "📹", "Elevator": "🛗", "Kitchen": "🍳",
  "Balcony / Sea View": "🌅", "Bonfire": "🔥", "Wheelchair Access": "♿",
};

const processImages = (prop, fallback) => {
  if (prop?.images && prop.images.length > 0) {
    const imgs = prop.images.map((img) => {
      if (!img.url) return fallback;
      if (img.url.startsWith("http")) return img.url;
      const cleanPath = img.url.startsWith("/") ? img.url : "/" + img.url;
      return `${MEDIA_BASE}${cleanPath}`;
    });
    return imgs.length ? imgs : [fallback];
  }
  return [fallback];
};

const priceRange = (p) => {
  if (p?.priceMin && p?.priceMax) return `₹${p.priceMin} - ₹${p.priceMax}`;
  if (p?.priceMin) return `₹${p.priceMin}`;
  if (p?.priceMax) return `₹${p.priceMax}`;
  if (p?.pricePerNight) return `₹${p.pricePerNight}`;
  return "—";
};

// Stable per-browser id so the admin "Tourist Property Log" can count unique viewers
const getDeviceId = () => {
  try {
    let id = localStorage.getItem("rp_device_id");
    if (!id) {
      id = (window.crypto && window.crypto.randomUUID)
        ? window.crypto.randomUUID()
        : `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem("rp_device_id", id);
    }
    return id;
  } catch {
    return "anon";
  }
};

// Logged-in visitor's phone (normalised to last 10 digits); "" when not logged in
const getViewerPhone = () => {
  try {
    const raw = localStorage.getItem("phoneNumber") || "";
    const digits = raw.replace(/\D/g, "");
    return digits.length >= 10 ? digits.slice(-10) : "";
  } catch {
    return "";
  }
};

// Remember this stay in the per-device "recently viewed" list (most recent first, max 10)
const addRecentStay = (p) => {
  if (!p || !p._id) return;
  try {
    const slim = {
      _id: p._id,
      propertyId: p.propertyId,
      stayName: p.stayName || p.location || "Tourist Stay",
      location: p.location || "",
      city: p.city || "",
      stayType: p.stayType || "",
      image: processImages(p, "")[0] || "",
      price: priceRange(p),
      viewedAt: Date.now(),
    };
    const key = "rp_recent_stays";
    let list = [];
    try { list = JSON.parse(localStorage.getItem(key) || "[]"); } catch { list = []; }
    if (!Array.isArray(list)) list = [];
    list = list.filter((x) => x && x._id !== p._id);
    list.unshift(slim);
    localStorage.setItem(key, JSON.stringify(list.slice(0, 10)));
  } catch {
    /* best-effort only */
  }
};

// Fire-and-forget view record (type: "detail" = page open, "contact" = View Contact tap).
// The owner viewing their OWN stay (viewer number == stay's contact number) is not
// counted as a lead.
const recordStayView = (propertyId, type, stayPhone) => {
  if (!propertyId) return;
  const viewer = getViewerPhone();
  const ownerPhone = stayPhone ? String(stayPhone).replace(/\D/g, "").slice(-10) : "";
  if (viewer && ownerPhone && viewer === ownerPhone) return; // owner's own view — skip
  try {
    fetch(`${API_BASE}/stay-view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId,
        deviceId: getDeviceId(),
        viewerPhoneNumber: viewer,
        type,
      }),
    }).catch(() => {});
  } catch {
    /* tracking is best-effort; never block the UI */
  }
};

const StayDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [property, setProperty] = useState(location.state?.property || null);
  const [loading, setLoading] = useState(!location.state?.property);
  const [imgIndex, setImgIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);

  const defaultImage = DefaultImg;

  const openContact = () => {
    setShowContact(true);
    recordStayView(property.propertyId, "contact", property.phoneNumber);
  };

  useEffect(() => {
    if (property) return;
    const fetchOne = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/read-prop/${id}`, { cache: "no-store" });
        const result = await res.json();
        if (result.success && result.data) setProperty(result.data);
      } catch (err) {
        console.error("Error loading stay:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOne();
  }, [id, property]);

  // Record a (unique-per-device) detail-page view once the stay id is known,
  // and remember it in the device's "recently viewed" list.
  useEffect(() => {
    if (property?.propertyId) {
      recordStayView(property.propertyId, "detail", property.phoneNumber);
      addRecentStay(property);
    }
  }, [property?.propertyId]);

  // Lock background scroll while the contact sheet is open and restore the
  // exact scroll position on close (prevents the page jumping to the top).
  useEffect(() => {
    if (!showContact) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";
    return () => {
      style.position = "";
      style.top = "";
      style.left = "";
      style.right = "";
      style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [showContact]);

  // ── styles ──
  const wrap = { minHeight: "100vh", background: "#eceef3", display: "flex", justifyContent: "center" };
  const shell = { maxWidth: "470px", width: "100%", background: "#eceef3", minHeight: "100vh", paddingBottom: "90px" };
  const header = {
    display: "flex", alignItems: "center", padding: "16px",
    background: "linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)", color: "#fff",
    position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 10px rgba(79,75,126,0.25)",
  };
  const panel = { background: "#fff", borderRadius: "16px", margin: "12px", padding: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" };
  const secTitle = { fontSize: "12px", fontWeight: 800, color: PURPLE, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "7px" };

  const Section = ({ icon, title, children, style }) => (
    <div style={{ ...panel, ...style }}>
      <div style={secTitle}><span style={{ fontSize: "15px" }}>{icon}</span>{title}</div>
      {children}
    </div>
  );

  const Stat = ({ icon, value, label }) => (
    <div style={{ flex: "1 1 28%", minWidth: "84px", background: "#f7f6fb", borderRadius: "12px", padding: "12px 8px", textAlign: "center" }}>
      <div style={{ fontSize: "20px" }}>{icon}</div>
      <div style={{ fontSize: "16px", fontWeight: 800, color: "#222", marginTop: "2px" }}>{value || "—"}</div>
      <div style={{ fontSize: "11px", color: "#888", fontWeight: 600 }}>{label}</div>
    </div>
  );

  const Feature = ({ icon, label, value }) => {
    const yes = value === "Yes";
    const set = value === "Yes" || value === "No";
    return (
      <div style={{
        flex: "1 1 30%", minWidth: "92px", textAlign: "center", padding: "12px 6px", borderRadius: "14px",
        background: yes ? "#eafaf0" : set ? "#fdeeee" : "#f5f5f5",
        border: `1.5px solid ${yes ? "#a7e3bf" : set ? "#f3c2c2" : "#e5e5e5"}`,
      }}>
        <div style={{ fontSize: "24px" }}>{icon}</div>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "#444", margin: "4px 0 2px" }}>{label}</div>
        <div style={{ fontSize: "12px", fontWeight: 800, color: yes ? "#15803d" : set ? "#b91c1c" : "#999" }}>
          {yes ? "✓ Available" : set ? "✗ No" : "—"}
        </div>
      </div>
    );
  };

  const Row = ({ label, value }) => (
    value ? (
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "9px 0", borderBottom: "1px solid #f2f2f2" }}>
        <span style={{ fontSize: "13px", color: "#888", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: "13px", color: "#222", fontWeight: 700, textAlign: "right" }}>{value}</span>
      </div>
    ) : null
  );

  if (loading) {
    return <div style={wrap}><div style={shell}><p style={{ textAlign: "center", marginTop: "60px", color: "#888" }}>Loading…</p></div></div>;
  }

  if (!property) {
    return (
      <div style={wrap}>
        <div style={shell}>
          <div style={header}>
            <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#fff", fontSize: "22px", cursor: "pointer" }}><FaArrowLeft /></button>
            <h2 style={{ margin: 0, flex: 1, textAlign: "center", fontSize: "18px" }}>Stay Details</h2>
            <div style={{ width: 22 }} />
          </div>
          <p style={{ textAlign: "center", marginTop: "60px", color: "#999" }}>Stay not found.</p>
        </div>
      </div>
    );
  }

  const images = processImages(property, defaultImage);
  const amenities = Array.isArray(property.amenities) ? property.amenities : [];
  const roomTypes = Array.isArray(property.roomTypes) ? property.roomTypes : [];
  const fullAddress = [property.streetName, property.location, property.landmark, property.city, property.pincode]
    .filter(Boolean).join(", ");

  return (
    <div style={wrap}>
      <div style={shell}>
        {/* Header */}
        <div style={header}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#fff", fontSize: "22px", cursor: "pointer" }}><FaArrowLeft /></button>
          <h2 style={{ margin: 0, flex: 1, textAlign: "center", fontSize: "18px", fontWeight: 700 }}>Stay Details</h2>
          <div style={{ width: 22 }} />
        </div>

        {/* Image gallery */}
        <div style={{ position: "relative", width: "100%", height: "270px", background: "#222", overflow: "hidden" }}>
          <img src={images[imgIndex]} alt={property.stayName || "Stay"} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.src = defaultImage; }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)" }} />
          <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(118,75,162,0.92)", color: "#fff", padding: "5px 12px", borderRadius: "16px", fontSize: "12px", fontWeight: 700 }}>
            {imgIndex + 1} / {images.length}
          </div>
          {property.stayType && (
            <span style={{ position: "absolute", top: 12, left: 12, background: "#fff", color: PURPLE, padding: "5px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 800, boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>{property.stayType}</span>
          )}
          {images.length > 1 && (
            <>
              <button onClick={() => setImgIndex((i) => (i === 0 ? images.length - 1 : i - 1))} style={navBtn("left")}><FaChevronLeft /></button>
              <button onClick={() => setImgIndex((i) => (i + 1) % images.length)} style={navBtn("right")}><FaChevronRight /></button>
              <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", justifyContent: "center", gap: "6px" }}>
                {images.map((_, i) => (
                  <span key={i} onClick={() => setImgIndex(i)} style={{ width: i === imgIndex ? "18px" : "7px", height: "7px", borderRadius: "4px", background: i === imgIndex ? "#fff" : "rgba(255,255,255,0.6)", transition: "all 0.2s", cursor: "pointer" }} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Title panel */}
        <div style={{ ...panel, marginTop: "-26px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: PURPLE, letterSpacing: "0.5px" }}>PROP #{property.propertyId}</span>
            {property.starRating ? <span style={{ fontSize: "15px", color: "#f5a623" }}>{"★".repeat(property.starRating)}</span> : null}
          </div>
          <h1 style={{ margin: "8px 0 4px", fontSize: "21px", fontWeight: 800, color: "#1f2937", lineHeight: 1.25 }}>{property.stayName || property.location}</h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#6b7280", display: "flex", alignItems: "center", gap: "6px" }}>
            <FaMapMarkerAlt style={{ color: "#e53935" }} /> {property.location}{property.city ? `, ${property.city}` : ""}
          </p>

          {/* Price band */}
          <div style={{ marginTop: "14px", padding: "14px 16px", borderRadius: "14px", background: "linear-gradient(135deg,#f3e9ff 0%,#fde9f3 100%)", borderLeft: `5px solid ${PURPLE}` }}>
            <div style={{ fontSize: "24px", fontWeight: 900, color: PURPLE }}>{priceRange(property)}</div>
            <div style={{ fontSize: "11px", color: "#8b6fb0", textTransform: "uppercase", letterSpacing: "0.6px", fontWeight: 700 }}>
              Per Night{property.weekendPrice ? ` · Weekend ₹${property.weekendPrice}` : ""}
            </div>
          </div>

          {/* Quick chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
            {property.mealPlan && <span style={chip}>🍽️ {property.mealPlan}</span>}
            {property.taxType && <span style={chip}>🏷️ {property.taxType}</span>}
            {property.cancellationPolicy && <span style={chip}>↩️ {property.cancellationPolicy}</span>}
          </div>
        </div>

        {/* Highlights */}
        <Section icon="✨" title="Highlights">
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Feature icon="🏊" label="Swimming Pool" value={property.swimmingPool} />
            <Feature icon="🅿️" label="Car Park" value={property.carPark} />
            <Feature icon="🌅" label="Beach View" value={property.beachView} />
          </div>
        </Section>

        {/* About */}
        {property.description && (
          <Section icon="📝" title="About the Stay">
            <p style={{ margin: 0, fontSize: "14px", color: "#444", lineHeight: 1.6 }}>{property.description}</p>
          </Section>
        )}

        {/* Rooms & Capacity */}
        <Section icon="🛏️" title="Rooms & Capacity">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <Stat icon="🛏️" value={property.totalRooms} label="Rooms" />
            <Stat icon="👥" value={property.maxGuests} label="Max Guests" />
            <Stat icon="🚪" value={property.bedrooms} label="Bedrooms" />
            <Stat icon="🛁" value={property.bathrooms} label="Bathrooms" />
            <Stat icon="🕐" value={property.checkInTime} label="Check-in" />
            <Stat icon="🕚" value={property.checkOutTime} label="Check-out" />
          </div>
          {roomTypes.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
              {roomTypes.map((rt) => <span key={rt} style={{ ...chip, background: "#eef2ff", color: "#4338ca" }}>{rt}</span>)}
            </div>
          )}
        </Section>

        {/* Amenities */}
        {amenities.length > 0 && (
          <Section icon="🧰" title="Amenities">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {amenities.map((a) => (
                <span key={a} style={{ ...chip, background: "#eef6dd", color: "#33401f" }}>
                  {AMENITY_ICONS[a] || "✔️"} {a}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Policies & Location */}
        <Section icon="📍" title="Policies & Location">
          <Row label="Couple Friendly" value={property.coupleFriendly ? "Yes" : "No"} />
          <Row label="House Rules" value={property.houseRules} />
          <Row label="Nearby" value={property.nearbyAttractions} />
          <Row label="Street" value={property.streetName} />
          <Row label="Landmark" value={property.landmark} />
          <Row label="Pincode" value={property.pincode} />
          <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
            {property.url && <a href={property.url} target="_blank" rel="noopener noreferrer" style={{ ...chip, color: PURPLE, textDecoration: "none", border: `1px solid ${PURPLE}33` }}><FaMapMarkerAlt /> Open Map</a>}
            {property.websiteLink && <a href={property.websiteLink} target="_blank" rel="noopener noreferrer" style={{ ...chip, color: PURPLE, textDecoration: "none", border: `1px solid ${PURPLE}33` }}><FaGlobe /> Website</a>}
          </div>
        </Section>

        {/* Sticky contact bar */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ maxWidth: "470px", width: "100%", display: "flex", gap: "10px", padding: "10px 12px 16px", background: "linear-gradient(to top, #fff 70%, rgba(255,255,255,0))", pointerEvents: "auto" }}>
            <button type="button" onClick={openContact} style={ctaBtn("#15803d")}>
              <FaAddressCard /> View Contact
            </button>
            {property.whatsappNumber && (
              <a href={`https://wa.me/91${property.whatsappNumber}`} target="_blank" rel="noopener noreferrer" style={ctaBtn("#25D366")}><FaWhatsapp /> WhatsApp</a>
            )}
          </div>
        </div>

        {/* Contact details popup */}
        {showContact && (
          <div onClick={() => setShowContact(false)} style={overlay}>
            <div onClick={(e) => e.stopPropagation()} style={contactSheet}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#1f2937", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaAddressCard style={{ color: PURPLE }} /> Contact Details
                </h3>
                <button type="button" onClick={() => setShowContact(false)} aria-label="Close" style={{ background: "none", border: "none", fontSize: "20px", color: "#999", cursor: "pointer", lineHeight: 1 }}><FaTimes /></button>
              </div>

              {/* Phone Number */}
              <a href={`tel:${property.phoneNumber}`} style={contactRow}>
                <span style={contactIcon("#e8f5e9", "#2e7d32")}><FaPhone /></span>
                <span style={{ flex: 1 }}>
                  <span style={contactLabel}>Phone Number</span>
                  <span style={contactValue}>{property.phoneNumber || "—"}</span>
                </span>
              </a>

              {/* Alternate Number */}
              {property.alternateNumber && (
                <a href={`tel:${property.alternateNumber}`} style={contactRow}>
                  <span style={contactIcon("#fff3e0", "#e65100")}><FaPhone /></span>
                  <span style={{ flex: 1 }}>
                    <span style={contactLabel}>Alternate Number</span>
                    <span style={contactValue}>{property.alternateNumber}</span>
                  </span>
                </a>
              )}

              {/* Location */}
              <div style={{ ...contactRow, cursor: "default" }}>
                <span style={contactIcon("#f3e9ff", PURPLE)}><FaMapMarkerAlt /></span>
                <span style={{ flex: 1 }}>
                  <span style={contactLabel}>Location</span>
                  <span style={contactValue}>{fullAddress || "—"}</span>
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const chip = { background: "#f0f0f0", padding: "6px 12px", borderRadius: "16px", fontSize: "12.5px", fontWeight: 600, color: "#333", display: "inline-flex", alignItems: "center", gap: "5px" };

const navBtn = (side) => ({
  position: "absolute", [side]: 10, top: "50%", transform: "translateY(-50%)",
  background: "rgba(118,75,162,0.85)", border: "none", color: "#fff", borderRadius: "50%",
  width: 38, height: 38, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
});

const ctaBtn = (bg) => ({
  flex: 1, background: bg, color: "#fff", textAlign: "center", padding: "14px", borderRadius: "12px",
  fontWeight: 800, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center",
  gap: "8px", fontSize: "15px", boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
  border: "none", cursor: "pointer", fontFamily: "inherit",
});

// ── Contact popup styles ──
const overlay = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50,
  display: "flex", alignItems: "flex-end", justifyContent: "center",
};

const contactSheet = {
  maxWidth: "470px", width: "100%", background: "#fff",
  borderRadius: "20px 20px 0 0", padding: "20px 18px calc(22px + env(safe-area-inset-bottom))",
  boxShadow: "0 -6px 24px rgba(0,0,0,0.18)",
};

const contactRow = {
  display: "flex", alignItems: "center", gap: "12px", padding: "12px 0",
  borderBottom: "1px solid #f2f2f2", textDecoration: "none", color: "inherit",
};

const contactIcon = (bg, color) => ({
  width: 40, height: 40, flexShrink: 0, borderRadius: "12px", background: bg, color,
  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
});

const contactLabel = { display: "block", fontSize: "12px", color: "#888", fontWeight: 600, marginBottom: "2px" };
const contactValue = { display: "block", fontSize: "15px", color: "#1f2937", fontWeight: 700 };

export default StayDetail;
