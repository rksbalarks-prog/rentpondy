import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const API_BASE = "https://rentpondy.com/PPC/PPC";
const PURPLE = "#764ba2";

const STAY_TYPES = ["Guest House", "Resort", "Homestay", "Hotel", "Villa", "Cottage", "Service Apartment", "Beach House", "Farm Stay", "Boutique Stay"];
const ROOM_TYPES = ["Standard Room", "Deluxe Room", "Super Deluxe", "AC Room", "Non-AC Room", "Suite", "Family Room", "Dormitory", "Cottage", "Tent"];
const AMENITIES = ["Free WiFi", "Air Conditioning", "Restaurant", "Room Service", "Power Backup", "Hot Water", "Television", "Breakfast", "Pet Friendly", "Beach Access", "Garden / Lawn", "Bar / Lounge", "Spa", "Gym", "Laundry", "Airport Pickup", "CCTV Security", "Elevator", "Kitchen", "Bonfire", "Wheelchair Access"];
const MEAL_PLANS = [
  { value: "Room Only", label: "Room Only (EP)" },
  { value: "Breakfast Included", label: "Breakfast Included (CP)" },
  { value: "Breakfast + Dinner", label: "Breakfast + Dinner (MAP)" },
  { value: "All Meals Included", label: "All Meals Included (AP)" },
];
const CANCELLATION = ["Free Cancellation", "Partial Refund", "Non-Refundable"];
const TOTAL_ROOMS = Array.from({ length: 50 }, (_, i) => i + 1);
const BEDROOMS = Array.from({ length: 15 }, (_, i) => i + 1);
const YES_NO = ["Yes", "No"];

const merge = (defaults, custom = []) => {
  const seen = new Set();
  const out = [];
  [...defaults, ...custom].forEach((v) => {
    const k = String(v);
    if (k && !seen.has(k)) { seen.add(k); out.push(v); }
  });
  return out;
};

const EMPTY = {
  createdBy: "", stayName: "", websiteLink: "", stayType: "", starRating: "", description: "",
  streetName: "", location: "", city: "Pondicherry", landmark: "", pincode: "", url: "",
  priceMin: "", priceMax: "", weekendPrice: "", extraGuestCharge: "", taxType: "Tax Excluded",
  mealPlan: "Room Only", totalRooms: "", maxGuests: "", bedrooms: "", bathrooms: "",
  checkInTime: "01:00 PM", checkOutTime: "11:00 AM", swimmingPool: "", carPark: "", beachView: "",
  coupleFriendly: false, cancellationPolicy: "Free Cancellation", houseRules: "", nearbyAttractions: "",
  phoneNumber: "", alternateNumber: "", whatsappNumber: "",
};

const AddStay = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...EMPTY });
  const [amenities, setAmenities] = useState([]);
  const [roomType, setRoomType] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [compressing, setCompressing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(null);
  const [showPayPrompt, setShowPayPrompt] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [custom, setCustom] = useState({ stayType: [], mealPlan: [], roomType: [], totalRooms: [], cancellationPolicy: [] });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/stay-dropdowns`, { cache: "no-store" });
        const r = await res.json();
        const d = r?.data || {};
        setCustom({
          stayType: (d.stayType || []).map((o) => o.value),
          mealPlan: (d.mealPlan || []).map((o) => o.value),
          roomType: (d.roomType || []).map((o) => o.value),
          totalRooms: (d.totalRooms || []).map((o) => o.value),
          cancellationPolicy: (d.cancellationPolicy || []).map((o) => o.value),
        });
      } catch (_) { /* fall back to defaults */ }
    };
    load();
  }, []);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const toggleAmenity = (a) => setAmenities((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]));

  // Compress + watermark images before upload
  const compress = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width, h = img.height;
        if (w > 1200) { h = (h * 1200) / w; w = 1200; }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        const fs = Math.min(w / 5, h / 5, 80);
        ctx.font = `bold ${fs}px Arial`;
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("RENT PONDY", w / 2, h / 2);
        let q = 0.8;
        const tryC = () => canvas.toBlob((blob) => {
          if (blob.size > 512000 && q > 0.3) { q -= 0.1; canvas.toBlob(tryC, "image/jpeg", q); }
          else resolve(new File([blob], file.name, { type: "image/jpeg" }));
        }, "image/jpeg", q);
        tryC();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  const onImages = async (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"));
    if (images.length + files.length > 10) { alert("Maximum 10 images allowed!"); return; }
    setCompressing(true);
    try {
      const out = [];
      const prev = [];
      for (const f of files) {
        const c = await compress(f);
        out.push(c);
        prev.push(URL.createObjectURL(c));
      }
      setImages((p) => [...p, ...out]);
      setPreviews((p) => [...p, ...prev]);
    } finally {
      setCompressing(false);
    }
  };

  const removeImage = (i) => {
    setImages((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const onVideos = (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith("video/"));
    if (videos.length + files.length > 5) { alert("Maximum 5 videos allowed!"); return; }
    if (files.some((f) => f.size > 100 * 1024 * 1024)) { alert("Each video must be under 100MB!"); return; }
    const prev = files.map((f) => ({ src: URL.createObjectURL(f), name: f.name, size: (f.size / 1024 / 1024).toFixed(1) }));
    setVideos((p) => [...p, ...files]);
    setVideoPreviews((p) => [...p, ...prev]);
  };

  const removeVideo = (i) => {
    setVideos((p) => p.filter((_, idx) => idx !== i));
    setVideoPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const stayTypeOpts = merge(STAY_TYPES, custom.stayType);
  const roomTypeOpts = merge(ROOM_TYPES, custom.roomType);
  const totalRoomsOpts = merge(TOTAL_ROOMS.map(String), custom.totalRooms.map(String));
  const cancellationOpts = merge(CANCELLATION, custom.cancellationPolicy);
  const mealPlanOpts = merge(MEAL_PLANS.map((m) => m.value), custom.mealPlan)
    .map((v) => MEAL_PLANS.find((m) => m.value === v) || { value: v, label: v });

  const validate = () => {
    const m = [];
    if (!form.createdBy.trim()) m.push("Your Name");
    if (!form.stayName.trim()) m.push("Stay Name");
    if (!form.stayType) m.push("Stay Type");
    if (!String(form.priceMin).trim()) m.push("Price / Night Min");
    if (!form.streetName.trim()) m.push("Street / Address");
    if (!form.location.trim()) m.push("Location / Area");
    if (!/^[0-9]{6}$/.test(String(form.pincode).trim())) m.push("Pincode (6 digits)");
    if (!/^[0-9]{10}$/.test(String(form.phoneNumber).trim())) m.push("Phone Number (10 digits)");
    if (!form.swimmingPool) m.push("Swimming Pool");
    if (!form.carPark) m.push("Car Park");
    if (!form.beachView) m.push("Beach View");
    return m;
  };

  // Validate first, then show a preview of the stay before submitting.
  const onSubmit = (e) => {
    e.preventDefault();
    const m = validate();
    if (m.length) { setErrors(m); return; }
    setErrors([]);
    setShowPreview(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // From the preview → ask whether to buy a plan or just add the stay.
  const handleConfirmPreview = () => {
    setShowPreview(false);
    setShowPayPrompt(true);
  };

  // "Pay Now" → go straight to the Stay Owners Plan payment page.
  const handlePayNow = () => {
    setShowPayPrompt(false);
    navigate("/stay-owners-plan");
  };

  // "Cancel" → skip payment and add the property now.
  const handleCancelPay = () => {
    setShowPayPrompt(false);
    doSubmit();
  };

  // Actual property submission.
  const doSubmit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => {
        if (form[k] !== "" && form[k] !== null && form[k] !== undefined) fd.append(k, form[k]);
      });
      amenities.forEach((a) => fd.append("amenities", a));
      if (roomType) fd.append("roomTypes", roomType);
      images.forEach((img) => fd.append("files", img));
      videos.forEach((v) => fd.append("files", v));

      const res = await fetch(`${API_BASE}/add-prop`, { method: "POST", body: fd });
      const r = await res.json();
      if (r.success) {
        setSuccess({ propertyId: r?.data?.propertyId || "", stayName: form.stayName });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        alert(r.message || "Error submitting stay");
      }
    } catch (err) {
      alert("Error submitting stay. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setForm({ ...EMPTY });
    setAmenities([]); setRoomType("");
    setImages([]); setPreviews([]);
    setVideos([]); setVideoPreviews([]);
    setErrors([]); setSuccess(null);
  };

  // ── styles ──
  const wrap = { minHeight: "100vh", background: "#E5E5E5", display: "flex", justifyContent: "center" };
  const card = { maxWidth: "470px", width: "100%", background: "#fff", minHeight: "100vh", paddingBottom: "30px" };
  const header = { display: "flex", alignItems: "center", padding: "16px", background: "linear-gradient(135deg,#4F4B7E 0%,#764ba2 100%)", color: "#fff", position: "sticky", top: 0, zIndex: 5 };
  const label = { display: "block", fontSize: "13px", fontWeight: 600, color: "#444", margin: "12px 0 5px" };
  const input = { width: "100%", padding: "11px", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" };
  const sectionTitle = { fontSize: "15px", fontWeight: 700, color: PURPLE, margin: "20px 0 4px" };
  const uploadCard = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "26px 16px",
    border: "2px dashed #b9a7d6",
    borderRadius: "12px",
    background: "#faf7ff",
    cursor: "pointer",
    textAlign: "center",
    marginTop: "6px",
  };

  if (success) {
    return (
      <div style={wrap}>
        <div style={card}>
          <div style={header}>
            <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#fff", fontSize: "22px", cursor: "pointer" }}><FaArrowLeft /></button>
            <h2 style={{ margin: 0, flex: 1, textAlign: "center", fontSize: "17px" }}>🏖️ Tourist - Add your Property</h2>
            <div style={{ width: 22 }} />
          </div>
          <div style={{ textAlign: "center", padding: "50px 24px" }}>
            <div style={{ fontSize: "54px" }}>✅</div>
            <h2 style={{ color: "#16a34a" }}>Submitted Successfully!</h2>
            <p style={{ color: "#444", fontSize: "15px" }}>
              Thank you{form.createdBy ? `, ${form.createdBy}` : ""}! Your stay
              {success.stayName ? ` "${success.stayName}"` : ""} has been received
              {success.propertyId ? ` (ID ${success.propertyId})` : ""}.
            </p>
            <p style={{ color: "#888", fontSize: "13px" }}>It will appear once our team reviews and approves it.</p>
            <button onClick={reset} style={{ marginTop: "18px", background: PURPLE, color: "#fff", border: "none", borderRadius: "8px", padding: "12px 22px", fontWeight: 700, cursor: "pointer" }}>➕ Add Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      {/* Validation popup */}
      {errors.length > 0 && (
        <div onClick={() => setErrors([])} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: "14px", maxWidth: "360px", width: "100%", overflow: "hidden" }}>
            <div style={{ padding: "16px 18px", background: "linear-gradient(135deg,#fef3c7,#fde68a)", fontWeight: 700, color: "#92400e" }}>⚠️ Please complete the required fields</div>
            <ul style={{ listStyle: "none", margin: 0, padding: "14px 18px", maxHeight: "50vh", overflowY: "auto" }}>
              {errors.map((m, i) => (
                <li key={i} style={{ padding: "7px 10px", marginBottom: "7px", background: "#fef2f2", borderLeft: "3px solid #ef4444", borderRadius: "6px", fontSize: "13px", color: "#991b1b", fontWeight: 600 }}>{m}</li>
              ))}
            </ul>
            <div style={{ padding: "0 18px 16px", textAlign: "right" }}>
              <button onClick={() => setErrors([])} style={{ background: PURPLE, color: "#fff", border: "none", borderRadius: "8px", padding: "9px 22px", fontWeight: 700, cursor: "pointer" }}>OK</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview screen (shown after Submit, before the Pay/Cancel popup) */}
      {showPreview && (
        <div style={{ position: "fixed", inset: 0, background: "#eceef3", zIndex: 40, overflowY: "auto", overflowX: "hidden" }}>
          <div style={{ maxWidth: "470px", margin: "0 auto", background: "#fff", minHeight: "100vh", paddingBottom: "90px" }}>
            <div style={header}>
              <button onClick={() => setShowPreview(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: "22px", cursor: "pointer" }}><FaArrowLeft /></button>
              <h2 style={{ margin: 0, flex: 1, textAlign: "center", fontSize: "17px", fontWeight: 700 }}>👀 Preview Your Stay</h2>
              <div style={{ width: 22 }} />
            </div>

            {previews.length > 0 && (
              <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "12px 16px" }}>
                {previews.map((src, i) => (
                  <img key={i} src={src} alt={`photo ${i + 1}`} style={{ width: "120px", height: "90px", objectFit: "cover", borderRadius: "10px", flexShrink: 0 }} />
                ))}
              </div>
            )}

            <div style={{ padding: "8px 16px" }}>
              {[
                ["Your Name", form.createdBy],
                ["Stay Name", form.stayName],
                ["Stay Type", form.stayType],
                ["Star Rating", form.starRating ? `${form.starRating} ★` : ""],
                ["Description", form.description],
                ["Location", form.location],
                ["City", form.city],
                ["Street", form.streetName],
                ["Landmark", form.landmark],
                ["Pincode", form.pincode],
                ["Price / night", (form.priceMin || form.priceMax) ? `₹${form.priceMin || "?"} - ₹${form.priceMax || "?"}` : ""],
                ["Weekend Price", form.weekendPrice ? `₹${form.weekendPrice}` : ""],
                ["Tax", form.taxType],
                ["Meal Plan", form.mealPlan],
                ["Total Rooms", form.totalRooms],
                ["Max Guests", form.maxGuests],
                ["Bedrooms", form.bedrooms],
                ["Bathrooms", form.bathrooms],
                ["Check-in", form.checkInTime],
                ["Check-out", form.checkOutTime],
                ["Room Type", roomType],
                ["Amenities", amenities.join(", ")],
                ["Swimming Pool", form.swimmingPool],
                ["Car Park", form.carPark],
                ["Beach View", form.beachView],
                ["Couple Friendly", form.coupleFriendly ? "Yes" : ""],
                ["Cancellation", form.cancellationPolicy],
                ["House Rules", form.houseRules],
                ["Nearby", form.nearbyAttractions],
                ["Phone", form.phoneNumber],
                ["Alternate", form.alternateNumber],
                ["WhatsApp", form.whatsappNumber],
                ["Website", form.websiteLink],
              ]
                .filter(([, v]) => v !== "" && v !== null && v !== undefined)
                .map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "9px 0", borderBottom: "1px solid #f2f2f2" }}>
                    <span style={{ fontSize: "13px", color: "#888", fontWeight: 600, flexShrink: 0 }}>{k}</span>
                    <span style={{ fontSize: "13px", color: "#222", fontWeight: 700, textAlign: "right", maxWidth: "62%", minWidth: 0, overflowWrap: "anywhere", wordBreak: "break-word" }}>{v}</span>
                  </div>
                ))}

              {videoPreviews.length > 0 && (
                <div style={{ marginTop: "12px", fontSize: "13px", color: "#888" }}>🎬 {videoPreviews.length} video(s) attached</div>
              )}
            </div>

            {/* Footer actions */}
            <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
              <div style={{ maxWidth: "470px", width: "100%", display: "flex", gap: "10px", padding: "10px 16px 16px", background: "linear-gradient(to top,#fff 72%,rgba(255,255,255,0))" }}>
                <button onClick={() => setShowPreview(false)} style={{ flex: 1, padding: "13px", border: "1.5px solid #ccc", borderRadius: "12px", background: "#fff", color: "#444", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}>← Edit</button>
                <button onClick={handleConfirmPreview} style={{ flex: 1, padding: "13px", border: "none", borderRadius: "12px", background: "linear-gradient(135deg,#4F4B7E 0%,#764ba2 100%)", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: "15px" }}>Confirm →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pay Now / Cancel prompt after Submit Stay */}
      {showPayPrompt && (
        <div onClick={() => setShowPayPrompt(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "360px", width: "100%", background: "#fff", borderRadius: "18px", padding: "24px 22px", textAlign: "center", boxShadow: "0 14px 44px rgba(0,0,0,0.28)" }}>
            <div style={{ fontSize: "40px", marginBottom: "6px" }}>🏖️</div>
            <h3 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: 800, color: "#1f2937" }}>Promote your stay?</h3>
            <p style={{ margin: "0 0 20px", fontSize: "14px", color: "#6b7280" }}>
              Buy a Stay Owners Plan to list and feature your property, or cancel to just submit it.
            </p>
            <button onClick={handlePayNow} style={{ width: "100%", padding: "13px", border: "none", borderRadius: "12px", cursor: "pointer", background: "linear-gradient(135deg,#4F4B7E 0%,#764ba2 100%)", color: "#fff", fontSize: "15px", fontWeight: 800, marginBottom: "10px" }}>
              💳 Pay Now
            </button>
            <button onClick={handleCancelPay} disabled={submitting} style={{ width: "100%", padding: "13px", border: "1.5px solid #ddd", borderRadius: "12px", cursor: "pointer", background: "#fff", color: "#444", fontSize: "15px", fontWeight: 700, opacity: submitting ? 0.7 : 1 }}>
              {submitting ? "Adding…" : "Cancel"}
            </button>
          </div>
        </div>
      )}

      <div style={card}>
        <div style={header}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#fff", fontSize: "22px", cursor: "pointer" }}><FaArrowLeft /></button>
          <h2 style={{ margin: 0, flex: 1, textAlign: "center", fontSize: "17px", fontWeight: 700 }}>🏖️ Tourist - Add your Property</h2>
          <div style={{ width: 22 }} />
        </div>

        <form onSubmit={onSubmit} noValidate style={{ padding: "4px 16px" }}>
          <p style={{ color: "#888", fontSize: "13px" }}>Submissions are reviewed before they go live.</p>

          <div style={sectionTitle}>🏠 Basic Details</div>
          <label style={label}>Your Name *</label>
          <input style={input} name="createdBy" value={form.createdBy} onChange={onChange} placeholder="Your name" />
          <label style={label}>Stay Name *</label>
          <input style={input} name="stayName" value={form.stayName} onChange={onChange} placeholder="e.g., Sea Breeze Beach Resort" />
          <label style={label}>Website Link</label>
          <input style={input} name="websiteLink" value={form.websiteLink} onChange={onChange} placeholder="https://..." />
          <label style={label}>Stay Type *</label>
          <select style={input} name="stayType" value={form.stayType} onChange={onChange}>
            <option value="">Select Stay Type</option>
            {stayTypeOpts.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <label style={label}>Star Rating</label>
          <select style={input} name="starRating" value={form.starRating} onChange={onChange}>
            <option value="">Not rated</option>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} Star</option>)}
          </select>
          <label style={label}>Description</label>
          <textarea style={{ ...input, minHeight: "70px" }} name="description" value={form.description} onChange={onChange} placeholder="About the stay..." />

          <div style={sectionTitle}>💰 Pricing (per night)</div>
          <label style={label}>Price / Night Min (₹) *</label>
          <input style={input} type="number" name="priceMin" value={form.priceMin} onChange={onChange} placeholder="Lowest tariff" />
          <label style={label}>Price / Night Max (₹)</label>
          <input style={input} type="number" name="priceMax" value={form.priceMax} onChange={onChange} placeholder="Highest tariff" />
          <label style={label}>Weekend Price (₹)</label>
          <input style={input} type="number" name="weekendPrice" value={form.weekendPrice} onChange={onChange} placeholder="Fri / Sat tariff" />
          <label style={label}>Extra Guest Charge (₹)</label>
          <input style={input} type="number" name="extraGuestCharge" value={form.extraGuestCharge} onChange={onChange} placeholder="Per extra person" />
          <label style={label}>Tax</label>
          <div style={{ display: "flex", gap: "16px" }}>
            {["Tax Included", "Tax Excluded"].map((t) => (
              <label key={t} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
                <input type="radio" name="taxType" value={t} checked={form.taxType === t} onChange={onChange} /> {t}
              </label>
            ))}
          </div>
          <label style={label}>Meal Plan</label>
          <select style={input} name="mealPlan" value={form.mealPlan} onChange={onChange}>
            {mealPlanOpts.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>

          <div style={sectionTitle}>📍 Location</div>
          <label style={label}>Street / Address *</label>
          <input style={input} name="streetName" value={form.streetName} onChange={onChange} placeholder="Building, street, area" />
          <label style={label}>Location / Area *</label>
          <input style={input} name="location" value={form.location} onChange={onChange} placeholder="e.g., White Town" />
          <label style={label}>City</label>
          <input style={input} name="city" value={form.city} onChange={onChange} />
          <label style={label}>Landmark</label>
          <input style={input} name="landmark" value={form.landmark} onChange={onChange} placeholder="Nearby landmark" />
          <label style={label}>Pincode *</label>
          <input style={input} name="pincode" value={form.pincode} onChange={onChange} placeholder="6-digit pincode" maxLength={6} />
          <label style={label}>Google Map URL</label>
          <input style={input} name="url" value={form.url} onChange={onChange} placeholder="Map link" />

          <div style={sectionTitle}>🛏️ Rooms & Capacity</div>
          <label style={label}>Room Type</label>
          <select style={input} value={roomType} onChange={(e) => setRoomType(e.target.value)}>
            <option value="">Select room type</option>
            {roomTypeOpts.map((rt) => <option key={rt} value={rt}>{rt}</option>)}
          </select>
          <label style={label}>Total Rooms</label>
          <select style={input} name="totalRooms" value={form.totalRooms} onChange={onChange}>
            <option value="">Select no. of rooms</option>
            {totalRoomsOpts.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <label style={label}>Max Guests</label>
          <input style={input} type="number" name="maxGuests" value={form.maxGuests} onChange={onChange} placeholder="Max occupancy" />
          <label style={label}>Bedrooms</label>
          <select style={input} name="bedrooms" value={form.bedrooms} onChange={onChange}>
            <option value="">Select no. of bedrooms</option>
            {BEDROOMS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <label style={label}>Bathrooms</label>
          <input style={input} type="number" name="bathrooms" value={form.bathrooms} onChange={onChange} placeholder="No. of bathrooms" />
          <label style={label}>Check-in Time</label>
          <input style={input} name="checkInTime" value={form.checkInTime} onChange={onChange} />
          <label style={label}>Check-out Time</label>
          <input style={input} name="checkOutTime" value={form.checkOutTime} onChange={onChange} />

          <div style={sectionTitle}>✨ Features & Amenities</div>
          <label style={label}>Swimming Pool *</label>
          <select style={input} name="swimmingPool" value={form.swimmingPool} onChange={onChange}>
            <option value="">Select</option>{YES_NO.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <label style={label}>Car Park *</label>
          <select style={input} name="carPark" value={form.carPark} onChange={onChange}>
            <option value="">Select</option>{YES_NO.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <label style={label}>Beach View *</label>
          <select style={input} name="beachView" value={form.beachView} onChange={onChange}>
            <option value="">Select</option>{YES_NO.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <label style={label}>Amenities</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {AMENITIES.map((a) => {
              const on = amenities.includes(a);
              return (
                <button type="button" key={a} onClick={() => toggleAmenity(a)} style={{ padding: "6px 10px", borderRadius: "16px", border: on ? "1.5px solid #8BC34A" : "1.5px solid #ddd", background: on ? "#eef6dd" : "#fff", color: on ? "#2f3a1f" : "#555", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>{on ? "✓ " : ""}{a}</button>
              );
            })}
          </div>

          <div style={sectionTitle}>📋 Policies</div>
          <label style={label}>Cancellation Policy</label>
          <select style={input} name="cancellationPolicy" value={form.cancellationPolicy} onChange={onChange}>
            {cancellationOpts.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <label style={{ ...label, display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="checkbox" checked={form.coupleFriendly} onChange={(e) => setForm((p) => ({ ...p, coupleFriendly: e.target.checked }))} /> Couple Friendly
          </label>
          <label style={label}>House Rules</label>
          <textarea style={{ ...input, minHeight: "55px" }} name="houseRules" value={form.houseRules} onChange={onChange} />
          <label style={label}>Nearby Attractions</label>
          <textarea style={{ ...input, minHeight: "55px" }} name="nearbyAttractions" value={form.nearbyAttractions} onChange={onChange} />

          <div style={sectionTitle}>📞 Contact</div>
          <label style={label}>Phone Number *</label>
          <input style={input} type="tel" name="phoneNumber" value={form.phoneNumber} onChange={onChange} placeholder="10-digit number" maxLength={10} />
          <label style={label}>Alternate Number</label>
          <input style={input} type="tel" name="alternateNumber" value={form.alternateNumber} onChange={onChange} maxLength={10} />
          <label style={label}>WhatsApp Number</label>
          <input style={input} type="tel" name="whatsappNumber" value={form.whatsappNumber} onChange={onChange} maxLength={10} />

          <div style={sectionTitle}>📸 Photos</div>
          <label htmlFor="stayImages" style={uploadCard}>
            <div style={{ fontSize: "34px" }}>📤</div>
            <div style={{ fontWeight: 700, color: "#555" }}>Tap to upload photos</div>
            <div style={{ fontSize: "12px", color: "#999" }}>Max 10 images · auto-compressed</div>
          </label>
          <input id="stayImages" type="file" accept="image/*" multiple onChange={onImages} style={{ display: "none" }} />
          {compressing && <p style={{ fontSize: "13px", color: PURPLE }}>🔄 Compressing images…</p>}
          {previews.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
              {previews.map((src, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={src} alt={`p${i}`} style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px" }} />
                  <button type="button" onClick={() => removeImage(i)} style={{ position: "absolute", top: -6, right: -6, background: "#d32f2f", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", fontSize: "11px" }}>✕</button>
                </div>
              ))}
            </div>
          )}

          <div style={sectionTitle}>🎬 Videos</div>
          <label htmlFor="stayVideos" style={uploadCard}>
            <div style={{ fontSize: "34px" }}>🎬</div>
            <div style={{ fontWeight: 700, color: "#555" }}>Tap to upload videos</div>
            <div style={{ fontSize: "12px", color: "#999" }}>Max 5 videos · up to 100MB each</div>
          </label>
          <input id="stayVideos" type="file" accept="video/*" multiple onChange={onVideos} style={{ display: "none" }} />
          {videoPreviews.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
              {videoPreviews.map((v, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <video src={v.src} style={{ width: "90px", height: "70px", objectFit: "cover", borderRadius: "8px", background: "#000" }} />
                  <button type="button" onClick={() => removeVideo(i)} style={{ position: "absolute", top: -6, right: -6, background: "#d32f2f", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", fontSize: "11px" }}>✕</button>
                  <span style={{ position: "absolute", bottom: 2, left: 2, fontSize: "10px", color: "#fff", background: "rgba(0,0,0,0.6)", padding: "1px 4px", borderRadius: "4px" }}>{v.size}MB</span>
                </div>
              ))}
            </div>
          )}

          <button type="submit" disabled={submitting || compressing} style={{ width: "100%", marginTop: "24px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "10px", padding: "14px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
            {submitting ? "⏳ Submitting..." : "✅ Submit Stay"}
          </button>
          <button type="button" onClick={reset} disabled={submitting} style={{ width: "100%", marginTop: "10px", background: "#f1f1f1", color: "#555", border: "none", borderRadius: "10px", padding: "12px", fontWeight: 700, cursor: "pointer" }}>
            ♻️ Reset
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStay;
