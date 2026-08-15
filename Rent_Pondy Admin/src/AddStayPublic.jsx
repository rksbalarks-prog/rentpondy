import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './605010.css';
import ValidationPopup from './ValidationPopup';
import { generateStayPDF, generateBlankStayFormPDF } from './stayPdf';

// Standalone (no-login) "Add New Stay" form. Posts to the same /add-prop
// endpoint the admin form uses. New stays save hidden by default, so an admin
// must approve (unhide) them before they appear on the public site.

const STAY_TYPES = [
    "Guest House", "Resort", "Homestay", "Hotel", "Villa",
    "Cottage", "Service Apartment", "Beach House", "Farm Stay", "Boutique Stay"
];

const ROOM_TYPE_OPTIONS = [
    "Standard Room", "Deluxe Room", "Super Deluxe", "AC Room", "Non-AC Room",
    "Suite", "Family Room", "Dormitory", "Cottage", "Tent"
];

const AMENITY_OPTIONS = [
    { label: "Free WiFi", icon: "📶" },
    { label: "Air Conditioning", icon: "❄️" },
    { label: "Restaurant", icon: "🍽️" },
    { label: "Room Service", icon: "🛎️" },
    { label: "Power Backup", icon: "🔋" },
    { label: "Hot Water", icon: "🚿" },
    { label: "Television", icon: "📺" },
    { label: "Breakfast", icon: "🥐" },
    { label: "Pet Friendly", icon: "🐾" },
    { label: "Beach Access", icon: "🏖️" },
    { label: "Garden / Lawn", icon: "🌳" },
    { label: "Bar / Lounge", icon: "🍸" },
    { label: "Spa", icon: "💆" },
    { label: "Gym", icon: "🏋️" },
    { label: "Laundry", icon: "🧺" },
    { label: "Airport Pickup", icon: "🚐" },
    { label: "CCTV Security", icon: "📹" },
    { label: "Elevator", icon: "🛗" },
    { label: "Kitchen", icon: "🍳" },
    { label: "Bonfire", icon: "🔥" },
    { label: "Wheelchair Access", icon: "♿" }
];

const TOTAL_ROOMS_OPTIONS = Array.from({ length: 50 }, (_, i) => i + 1);
const BEDROOM_OPTIONS = Array.from({ length: 15 }, (_, i) => i + 1);

// Yes / No options for the standalone feature dropdowns
const YES_NO_OPTIONS = ["Yes", "No"];

const DEFAULT_MEAL_PLANS = [
    { value: "Room Only", label: "Room Only (EP)" },
    { value: "Breakfast Included", label: "Breakfast Included (CP)" },
    { value: "Breakfast + Dinner", label: "Breakfast + Dinner (MAP)" },
    { value: "All Meals Included", label: "All Meals Included (AP)" }
];
const DEFAULT_CANCELLATION = ["Free Cancellation", "Partial Refund", "Non-Refundable"];

const mergeOptions = (defaults, custom = []) => {
    const seen = new Set();
    const out = [];
    [...defaults, ...custom].forEach(v => {
        const key = String(v);
        if (key && !seen.has(key)) { seen.add(key); out.push(v); }
    });
    return out;
};

const EMPTY_FORM = {
    createdBy: '',
    stayName: '',
    websiteLink: '',
    stayType: '',
    starRating: '',
    description: '',
    streetName: '',
    location: '',
    city: 'Pondicherry',
    landmark: '',
    pincode: '',
    url: '',
    priceMin: '',
    priceMax: '',
    weekendPrice: '',
    extraGuestCharge: '',
    taxType: 'Tax Excluded',
    mealPlan: 'Room Only',
    totalRooms: '',
    maxGuests: '',
    bedrooms: '',
    bathrooms: '',
    checkInTime: '01:00 PM',
    checkOutTime: '11:00 AM',
    swimmingPool: '',
    carPark: '',
    beachView: '',
    coupleFriendly: false,
    cancellationPolicy: 'Free Cancellation',
    houseRules: '',
    nearbyAttractions: '',
    phoneNumber: '',
    alternateNumber: '',
    whatsappNumber: ''
};

const AddStayPublic = () => {
    const [formData, setFormData] = useState({ ...EMPTY_FORM });
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [videos, setVideos] = useState([]);
    const [videoPreviews, setVideoPreviews] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [dragActiveVideo, setDragActiveVideo] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [successInfo, setSuccessInfo] = useState(null);
    const [validationMessages, setValidationMessages] = useState([]);

    const [customOptions, setCustomOptions] = useState({
        stayType: [], mealPlan: [], roomType: [], totalRooms: [], cancellationPolicy: []
    });

    // Fetch admin-managed custom dropdown options (non-fatal — falls back to defaults)
    useEffect(() => {
        const fetchCustomOptions = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/stay-dropdowns`);
                const data = res.data?.data || {};
                setCustomOptions({
                    stayType: (data.stayType || []).map(o => o.value),
                    mealPlan: (data.mealPlan || []).map(o => o.value),
                    roomType: (data.roomType || []).map(o => o.value),
                    totalRooms: (data.totalRooms || []).map(o => o.value),
                    cancellationPolicy: (data.cancellationPolicy || []).map(o => o.value),
                });
            } catch (err) {
                console.error("Error fetching custom dropdown options:", err);
            }
        };
        fetchCustomOptions();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleArrayValue = (setter, value) => {
        setter(prev => prev.includes(value)
            ? prev.filter(v => v !== value)
            : [...prev, value]);
    };

    // ─── Image compression + watermark (mirrors the admin form) ───
    const addWatermark = (ctx, width, height) => {
        const fontSize = Math.min(width / 5, height / 5, 80);
        ctx.save();
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('RENT PONDY', width / 2, height / 2);
        ctx.restore();
    };

    const compressImage = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    if (width > 1200) {
                        height = (height * 1200) / width;
                        width = 1200;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    addWatermark(ctx, width, height);

                    let quality = 0.8;
                    const tryCompress = () => {
                        canvas.toBlob((currentBlob) => {
                            if (currentBlob.size > 512000 && quality > 0.3) {
                                quality -= 0.1;
                                canvas.toBlob(tryCompress, 'image/jpeg', quality);
                            } else {
                                const compressedFile = new File([currentBlob], file.name, {
                                    type: 'image/jpeg',
                                    lastModified: file.lastModified
                                });
                                resolve({
                                    file: compressedFile,
                                    originalSize: file.size,
                                    compressedSize: currentBlob.size
                                });
                            }
                        }, 'image/jpeg', quality);
                    };
                    tryCompress();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const readFileAsDataURL = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });

    const handleImageChange = async (e) => {
        const files = e.target.files ? Array.from(e.target.files) : Array.from(e.dataTransfer.files);
        const validFiles = files.filter((file) => file.type.startsWith('image/'));
        if (images.length + validFiles.length > 10) {
            alert('Maximum 10 images allowed!');
            return;
        }
        setIsCompressing(true);
        try {
            const results = await Promise.all(validFiles.map(async (file) => {
                const { file: compressedFile, originalSize, compressedSize } = await compressImage(file);
                const dataURL = await readFileAsDataURL(compressedFile);
                return {
                    compressedFile,
                    preview: {
                        src: dataURL,
                        name: file.name,
                        originalSize: (originalSize / 1024 / 1024).toFixed(2),
                        compressedSize: (compressedSize / 1024 / 1024).toFixed(2)
                    }
                };
            }));
            setImages(prev => [...prev, ...results.map(r => r.compressedFile)]);
            setImagePreviews(prev => [...prev, ...results.map(r => r.preview)]);
        } catch (err) {
            console.error('Error compressing images:', err);
            alert('Error compressing images. Please try again.');
        } finally {
            setIsCompressing(false);
        }
    };

    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleVideoChange = async (e) => {
        const files = e.target.files ? Array.from(e.target.files) : Array.from(e.dataTransfer.files);
        const validFiles = files.filter((file) => file.type.startsWith('video/'));
        if (videos.length + validFiles.length > 5) {
            alert('Maximum 5 videos allowed!');
            return;
        }
        if (validFiles.some(file => file.size > 100 * 1024 * 1024)) {
            alert('Video files must be under 100MB!');
            return;
        }
        try {
            const previews = await Promise.all(validFiles.map(async (file) => ({
                src: await readFileAsDataURL(file),
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2)
            })));
            setVideos(prev => [...prev, ...validFiles]);
            setVideoPreviews(prev => [...prev, ...previews]);
        } catch (err) {
            console.error('Error processing videos:', err);
            alert('Error processing videos. Please try again.');
        }
    };

    const handleRemoveVideo = (index) => {
        setVideos(prev => prev.filter((_, i) => i !== index));
        setVideoPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleImageChange(e);
    };
    const handleDragVideo = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActiveVideo(true);
        else if (e.type === 'dragleave') setDragActiveVideo(false);
    };
    const handleDropVideo = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActiveVideo(false);
        handleVideoChange(e);
    };

    const resetForm = () => {
        setFormData({ ...EMPTY_FORM });
        setSelectedAmenities([]);
        setSelectedRoomTypes([]);
        setImages([]);
        setImagePreviews([]);
        setVideos([]);
        setVideoPreviews([]);
        setError(null);
        setSuccessInfo(null);
        setDragActive(false);
        setDragActiveVideo(false);
    };

    // Download a printable PDF of the current stay form (saved to Downloads)
    const handlePrintPdf = () => {
        generateStayPDF({
            formData,
            amenities: selectedAmenities,
            roomTypes: selectedRoomTypes
        }, 'download');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validate mandatory fields — show a popup listing anything missing/invalid
        const missingFields = [];
        if (!String(formData.createdBy || '').trim()) missingFields.push('Created By Name');
        if (!String(formData.stayName || '').trim()) missingFields.push('Stay Name');
        if (!String(formData.stayType || '').trim()) missingFields.push('Stay Type');
        if (!String(formData.priceMin || '').trim()) missingFields.push('Price / Night Min');
        if (!String(formData.streetName || '').trim()) missingFields.push('Street / Address');
        if (!String(formData.location || '').trim()) missingFields.push('Location / Area');
        if (!/^[0-9]{6}$/.test(String(formData.pincode || '').trim())) missingFields.push('Pincode (6 digits)');
        if (!/^[0-9]{10}$/.test(String(formData.phoneNumber || '').trim())) missingFields.push('Phone Number (10 digits)');
        if (!String(formData.swimmingPool || '').trim()) missingFields.push('Swimming Pool');
        if (!String(formData.carPark || '').trim()) missingFields.push('Car Park');
        if (!String(formData.beachView || '').trim()) missingFields.push('Beach View');
        if (formData.alternateNumber && !/^[0-9]{10}$/.test(String(formData.alternateNumber).trim())) missingFields.push('Alternate Number must be 10 digits');
        if (formData.whatsappNumber && !/^[0-9]{10}$/.test(String(formData.whatsappNumber).trim())) missingFields.push('WhatsApp Number must be 10 digits');

        if (missingFields.length > 0) {
            setValidationMessages(missingFields);
            return;
        }

        setSubmitting(true);
        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
                    submitData.append(key, formData[key]);
                }
            });
            selectedAmenities.forEach(a => submitData.append('amenities', a));
            selectedRoomTypes.forEach(r => submitData.append('roomTypes', r));
            images.forEach(image => submitData.append('files', image));
            videos.forEach(video => submitData.append('files', video));

            const res = await axios.post(`${process.env.REACT_APP_API_URL}/add-prop`, submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSuccessInfo({
                propertyId: res.data?.data?.propertyId || '',
                stayName: formData.stayName
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting stay. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Merged option lists (built-in defaults + admin-added custom options)
    const stayTypeOptions = mergeOptions(STAY_TYPES, customOptions.stayType);
    const roomTypeOptions = mergeOptions(ROOM_TYPE_OPTIONS, customOptions.roomType);
    const totalRoomsOptions = mergeOptions(TOTAL_ROOMS_OPTIONS.map(String), customOptions.totalRooms.map(String));
    const cancellationOptions = mergeOptions(DEFAULT_CANCELLATION, customOptions.cancellationPolicy);
    const mealPlanOptions = mergeOptions(DEFAULT_MEAL_PLANS.map(m => m.value), customOptions.mealPlan)
        .map(value => DEFAULT_MEAL_PLANS.find(m => m.value === value) || { value, label: value });

    // Download a blank, printable Add-Stay form to fill in by hand
    const handleBlankFormPdf = () => {
        generateBlankStayFormPDF({
            stayTypes: stayTypeOptions,
            roomTypes: roomTypeOptions,
            mealPlans: mealPlanOptions.map(m => m.label),
            cancellations: cancellationOptions,
            amenities: AMENITY_OPTIONS.map(a => a.label)
        });
    };

    // ─── Success screen ───
    if (successInfo) {
        return (
            <div className="admin-dashboard">
                <div className="form-section" style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <div style={{ fontSize: '56px', marginBottom: '12px' }}>✅</div>
                    <h2 style={{ color: '#16a34a' }}>Stay Submitted Successfully!</h2>
                    <p style={{ fontSize: '16px', color: '#334155', marginTop: '10px' }}>
                        Thank you{formData.createdBy ? `, ${formData.createdBy}` : ''}! Your stay
                        {successInfo.stayName ? <strong> "{successInfo.stayName}"</strong> : ''}
                        {successInfo.propertyId ? <> has been received with ID <strong>{successInfo.propertyId}</strong>.</> : ' has been received.'}
                    </p>
                    <p style={{ color: '#64748b', marginTop: '8px' }}>
                        It will be visible on the site once our team reviews and approves it.
                    </p>
                    <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={resetForm}>
                        ➕ Add Another Stay
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <ValidationPopup messages={validationMessages} onClose={() => setValidationMessages([])} />
            <div className="dashboard-header">
                <h1>🏖️ Add Your Stay — Guest Houses & Resorts</h1>
            </div>

            <div className="form-section">
                <div className="form-header">
                    <h2>➕ Add New Stay</h2>
                </div>

                <p style={{ color: '#64748b', marginTop: '-6px', marginBottom: '14px' }}>
                    Fill in your property details below. Submissions are reviewed before they go live.
                </p>

                {error && <div className="error-message">❌ {error}</div>}

                <form onSubmit={handleSubmit} className="property-form" noValidate>
                    {/* ───── Basic details ───── */}
                    <h3 className="stay-section-title">🏠 Basic Details</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Created By Name *</label>
                            <input type="text" name="createdBy" value={formData.createdBy} onChange={handleInputChange} placeholder="Your name" required />
                        </div>
                        <div className="form-group">
                            <label>Stay Name *</label>
                            <input type="text" name="stayName" value={formData.stayName} onChange={handleInputChange} placeholder="e.g., Sea Breeze Beach Resort" required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Website Link</label>
                            <input type="url" name="websiteLink" value={formData.websiteLink} onChange={handleInputChange} placeholder="e.g., https://www.seabreezeresort.com" />
                        </div>
                        <div className="form-group">
                            <label>Stay Type *</label>
                            <select name="stayType" value={formData.stayType} onChange={handleInputChange} required>
                                <option value="">Select Stay Type</option>
                                {stayTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Star Rating</label>
                            <select name="starRating" value={formData.starRating} onChange={handleInputChange}>
                                <option value="">Not rated</option>
                                <option value="1">⭐ 1 Star</option>
                                <option value="2">⭐⭐ 2 Star</option>
                                <option value="3">⭐⭐⭐ 3 Star</option>
                                <option value="4">⭐⭐⭐⭐ 4 Star</option>
                                <option value="5">⭐⭐⭐⭐⭐ 5 Star</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description / About the Stay</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Describe the property, rooms, surroundings and what makes it special for tourists..." />
                    </div>

                    {/* ───── Pricing ───── */}
                    <h3 className="stay-section-title">💰 Pricing & Tariff (per night)</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Price / Night Min (₹) *</label>
                            <input type="number" name="priceMin" value={formData.priceMin} onChange={handleInputChange} placeholder="Lowest tariff per night" min="0" required />
                        </div>
                        <div className="form-group">
                            <label>Price / Night Max (₹)</label>
                            <input type="number" name="priceMax" value={formData.priceMax} onChange={handleInputChange} placeholder="Highest tariff per night" min="0" />
                        </div>
                        <div className="form-group">
                            <label>Weekend Price (₹)</label>
                            <input type="number" name="weekendPrice" value={formData.weekendPrice} onChange={handleInputChange} placeholder="Fri / Sat tariff" min="0" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Extra Guest Charge (₹)</label>
                            <input type="number" name="extraGuestCharge" value={formData.extraGuestCharge} onChange={handleInputChange} placeholder="Per extra person" min="0" />
                        </div>
                        <div className="form-group">
                            <label>Tax</label>
                            <div className="tax-options">
                                <label className="switch-row">
                                    <input type="radio" name="taxType" value="Tax Included" checked={formData.taxType === 'Tax Included'} onChange={handleInputChange} />
                                    <span>Tax Included</span>
                                </label>
                                <label className="switch-row">
                                    <input type="radio" name="taxType" value="Tax Excluded" checked={formData.taxType === 'Tax Excluded'} onChange={handleInputChange} />
                                    <span>Tax Excluded</span>
                                </label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Meal Plan</label>
                            <select name="mealPlan" value={formData.mealPlan} onChange={handleInputChange}>
                                {mealPlanOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* ───── Location ───── */}
                    <h3 className="stay-section-title">📍 Location</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Street / Address *</label>
                            <input type="text" name="streetName" value={formData.streetName} onChange={handleInputChange} placeholder="Building, street, area" required />
                        </div>
                        <div className="form-group">
                            <label>Location / Area *</label>
                            <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g., White Town, Auroville" required />
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Landmark</label>
                            <input type="text" name="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="Nearby landmark (e.g., near Promenade Beach)" />
                        </div>
                        <div className="form-group">
                            <label>Pincode *</label>
                            <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Enter 6-digit pincode" pattern="[0-9]{6}" maxLength="6" required />
                        </div>
                        <div className="form-group">
                            <label>Google Map URL</label>
                            <input type="url" name="url" value={formData.url} onChange={handleInputChange} placeholder="Paste Google Map location URL" />
                        </div>
                    </div>

                    {/* ───── Rooms & capacity ───── */}
                    <h3 className="stay-section-title">🛏️ Rooms & Capacity</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Room Types Available</label>
                            <select value={selectedRoomTypes[0] || ''} onChange={(e) => setSelectedRoomTypes(e.target.value ? [e.target.value] : [])}>
                                <option value="">Select room type</option>
                                {roomTypeOptions.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Total Rooms</label>
                            <select name="totalRooms" value={formData.totalRooms} onChange={handleInputChange}>
                                <option value="">Select no. of rooms</option>
                                {totalRoomsOptions.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Max Guests</label>
                            <input type="number" name="maxGuests" value={formData.maxGuests} onChange={handleInputChange} placeholder="Max occupancy" min="1" />
                        </div>
                        <div className="form-group">
                            <label>Bedrooms</label>
                            <select name="bedrooms" value={formData.bedrooms} onChange={handleInputChange}>
                                <option value="">Select no. of bedrooms</option>
                                {BEDROOM_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Bathrooms</label>
                            <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} placeholder="No. of bathrooms" min="0" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Check-in Time</label>
                            <input type="text" name="checkInTime" value={formData.checkInTime} onChange={handleInputChange} placeholder="e.g., 01:00 PM" />
                        </div>
                        <div className="form-group">
                            <label>Check-out Time</label>
                            <input type="text" name="checkOutTime" value={formData.checkOutTime} onChange={handleInputChange} placeholder="e.g., 11:00 AM" />
                        </div>
                    </div>

                    {/* ───── Amenities ───── */}
                    <h3 className="stay-section-title">✨ Amenities & Facilities</h3>

                    {/* Highlighted features as separate dropdowns */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>🏊 Swimming Pool *</label>
                            <select name="swimmingPool" value={formData.swimmingPool} onChange={handleInputChange} required>
                                <option value="">Select</option>
                                {YES_NO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>🅿️ Car Park *</label>
                            <select name="carPark" value={formData.carPark} onChange={handleInputChange} required>
                                <option value="">Select</option>
                                {YES_NO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>🌅 Beach View *</label>
                            <select name="beachView" value={formData.beachView} onChange={handleInputChange} required>
                                <option value="">Select</option>
                                {YES_NO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="amenities-grid">
                            {AMENITY_OPTIONS.map(am => {
                                const active = selectedAmenities.includes(am.label);
                                return (
                                    <button type="button" key={am.label} className={`amenity-item ${active ? 'amenity-selected' : ''}`} onClick={() => toggleArrayValue(setSelectedAmenities, am.label)}>
                                        <span className="amenity-icon">{am.icon}</span>
                                        <span className="amenity-label">{am.label}</span>
                                        {active && <span className="amenity-check">✓</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ───── Policies ───── */}
                    <h3 className="stay-section-title">📋 Policies & Highlights</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Cancellation Policy</label>
                            <select name="cancellationPolicy" value={formData.cancellationPolicy} onChange={handleInputChange}>
                                {cancellationOptions.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Couple Friendly</label>
                            <label className="switch-row">
                                <input type="checkbox" checked={formData.coupleFriendly} onChange={(e) => setFormData(prev => ({ ...prev, coupleFriendly: e.target.checked }))} />
                                <span>Local IDs / unmarried couples allowed</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>House Rules</label>
                            <textarea name="houseRules" value={formData.houseRules} onChange={handleInputChange} rows={2} placeholder="e.g., No smoking indoors, pets on request, ID proof mandatory..." />
                        </div>
                        <div className="form-group">
                            <label>Nearby Attractions</label>
                            <textarea name="nearbyAttractions" value={formData.nearbyAttractions} onChange={handleInputChange} rows={2} placeholder="e.g., 500m to Promenade Beach, 10km to Auroville..." />
                        </div>
                    </div>

                    {/* ───── Contact ───── */}
                    <h3 className="stay-section-title">📞 Contact</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone Number *</label>
                            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="10-digit phone number" pattern="[0-9]{10}" required />
                        </div>
                        <div className="form-group">
                            <label>Alternate Number</label>
                            <input type="tel" name="alternateNumber" value={formData.alternateNumber} onChange={handleInputChange} placeholder="10-digit alternate number" pattern="[0-9]{10}" />
                        </div>
                        <div className="form-group">
                            <label>WhatsApp Number</label>
                            <input type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange} placeholder="10-digit WhatsApp number" pattern="[0-9]{10}" />
                        </div>
                    </div>

                    {/* ───── Images ───── */}
                    <div className="form-group">
                        <label>📸 Upload Images (Max 10)</label>
                        <div className={`upload-card ${dragActive ? 'drag-active' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="file-input-hidden" id="imageInput" />
                            <label htmlFor="imageInput" className="upload-label">
                                <div className="upload-icon">📤</div>
                                <h3>Drag & drop images here</h3>
                                <p>or click to browse</p>
                                <small>Images will be auto-compressed to under 500KB</small>
                            </label>
                        </div>

                        {isCompressing && <div className="image-count-badge compressing-badge">🔄 Compressing images...</div>}
                        {imagePreviews.length > 0 && !isCompressing && (
                            <div className="image-count-badge">✅ {imagePreviews.length} image{imagePreviews.length !== 1 ? 's' : ''} selected</div>
                        )}

                        {imagePreviews.length > 0 && (
                            <div className="image-previews-container">
                                <h4>📷 Preview ({imagePreviews.length})</h4>
                                <div className="image-preview-grid">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="preview-item">
                                            <div className="preview-image-wrapper">
                                                <img src={preview.src} alt={`Preview ${index + 1}`} />
                                                <button type="button" className="btn-remove-preview" onClick={() => handleRemoveImage(index)} title="Remove image">✕</button>
                                            </div>
                                            <div className="preview-info">
                                                <p className="preview-name">{preview.name.slice(0, 20)}...</p>
                                                <p className="preview-size">{preview.originalSize} MB → {preview.compressedSize} MB</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ───── Videos ───── */}
                    <div className="form-group">
                        <label>🎬 Upload Videos (Max 5, 100MB each)</label>
                        <div className={`upload-card ${dragActiveVideo ? 'drag-active' : ''}`} onDragEnter={handleDragVideo} onDragLeave={handleDragVideo} onDragOver={handleDragVideo} onDrop={handleDropVideo}>
                            <input type="file" accept="video/*" multiple onChange={handleVideoChange} className="file-input-hidden" id="videoInput" />
                            <label htmlFor="videoInput" className="upload-label">
                                <div className="upload-icon">📹</div>
                                <h3>Drag & drop videos here</h3>
                                <p>or click to browse</p>
                                <small>Supported formats: MP4, WebM, OGG (Max 100MB per video)</small>
                            </label>
                        </div>

                        {videoPreviews.length > 0 && (
                            <div className="image-count-badge">✅ {videoPreviews.length} video{videoPreviews.length !== 1 ? 's' : ''} selected</div>
                        )}
                        {videoPreviews.length > 0 && (
                            <div className="image-previews-container">
                                <h4>🎥 Preview ({videoPreviews.length})</h4>
                                <div className="image-preview-grid">
                                    {videoPreviews.map((preview, index) => (
                                        <div key={index} className="preview-item">
                                            <div className="preview-image-wrapper">
                                                <video src={preview.src} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                                                <button type="button" className="btn-remove-preview" onClick={() => handleRemoveVideo(index)} title="Remove video">✕</button>
                                            </div>
                                            <div className="preview-info">
                                                <p className="preview-name">{preview.name.slice(0, 20)}...</p>
                                                <p className="preview-size">{preview.size} MB</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ───── Submit ───── */}
                    <div className="form-actions">
                        <button type="submit" className="btn btn-success" disabled={submitting || isCompressing}>
                            {submitting ? '⏳ Submitting...' : '✅ Submit Stay'}
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handlePrintPdf} disabled={submitting}>
                            📄 Download PDF
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleBlankFormPdf} disabled={submitting}>
                            📝 Blank Form PDF
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={submitting}>
                            ♻️ Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStayPublic;
