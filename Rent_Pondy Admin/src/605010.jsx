import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './605010.css';
import DefaultImage from './Assets/Defaultimageexclusive.png';
import ValidationPopup from './ValidationPopup';
import { generateStayPDF, generateBlankStayFormPDF } from './stayPdf';

// Default image for stays with no images
const DEFAULT_IMAGE = DefaultImage;

// Stay categories (Agoda / Booking style)
const STAY_TYPES = [
    "Guest House", "Resort", "Homestay", "Hotel", "Villa",
    "Cottage", "Service Apartment", "Beach House", "Farm Stay", "Boutique Stay"
];

// Room configurations a stay can offer (multi-select)
const ROOM_TYPE_OPTIONS = [
    "Standard Room", "Deluxe Room", "Super Deluxe", "AC Room", "Non-AC Room",
    "Suite", "Family Room", "Dormitory", "Cottage", "Tent"
];

// Amenities checklist with icons (multi-select)
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

// Dropdown options for room / bedroom counts
const TOTAL_ROOMS_OPTIONS = Array.from({ length: 50 }, (_, i) => i + 1);
const BEDROOM_OPTIONS = Array.from({ length: 15 }, (_, i) => i + 1);

// Yes / No options for the standalone feature dropdowns
const YES_NO_OPTIONS = ["Yes", "No"];

// Built-in defaults that admins can extend via the "Dropdown change" screen
const DEFAULT_MEAL_PLANS = [
    { value: "Room Only", label: "Room Only (EP)" },
    { value: "Breakfast Included", label: "Breakfast Included (CP)" },
    { value: "Breakfast + Dinner", label: "Breakfast + Dinner (MAP)" },
    { value: "All Meals Included", label: "All Meals Included (AP)" }
];
const DEFAULT_CANCELLATION = ["Free Cancellation", "Partial Refund", "Non-Refundable"];

// Merge built-in defaults with admin-added custom options (dedup, preserve order)
const mergeOptions = (defaults, custom = []) => {
    const seen = new Set();
    const out = [];
    [...defaults, ...custom].forEach(v => {
        const key = String(v);
        if (key && !seen.has(key)) { seen.add(key); out.push(v); }
    });
    return out;
};

const AdminDashboard = () => {
    const [properties, setProperties] = useState([]);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentPropertyId, setCurrentPropertyId] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    
    // Form data (tourist stay listing)
    const [formData, setFormData] = useState({
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
    });

    // Multi-select fields
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    
    // Videos
    const [videos, setVideos] = useState([]);
    const [videoPreviews, setVideoPreviews] = useState([]);
    const [existingVideos, setExistingVideos] = useState([]);
    const [dragActiveVideo, setDragActiveVideo] = useState(false);
    
    // Filters
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        stayType: '',
        location: '',
        search: '',
        createdBy: '',
        createdAt: ''
    });
    const [totalPages, setTotalPages] = useState(1);

    // Redux & Role-Based Access Control
    const reduxAdminName = useSelector((state) => state.admin.name);
    const reduxAdminRole = useSelector((state) => state.admin.role);
    
    const adminName = reduxAdminName || localStorage.getItem("adminName");
    const adminRole = reduxAdminRole || localStorage.getItem("adminRole");
    
    const [allowedRoles, setAllowedRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [phoneNumberCount, setPhoneNumberCount] = useState(0);
    const [tableImageIndices, setTableImageIndices] = useState({});
    const [isCompressing, setIsCompressing] = useState(false);
    const [remarkInputs, setRemarkInputs] = useState({});
    const [savingRemark, setSavingRemark] = useState({});

    // Admin-managed custom dropdown options (merged into the form selects)
    const [customOptions, setCustomOptions] = useState({
        stayType: [], mealPlan: [], roomType: [], totalRooms: [], cancellationPolicy: []
    });

    // Mandatory-field validation popup messages
    const [validationMessages, setValidationMessages] = useState([]);

    const handleRemarkInputChange = (id, value) => {
        setRemarkInputs(prev => ({ ...prev, [id]: value }));
    };

    const handleSaveRemark = async (id) => {
        const text = (remarkInputs[id] || '').trim();
        if (!text) return;
        setSavingRemark(prev => ({ ...prev, [id]: true }));
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/add-whitetown-remark/${id}`,
                {
                    text,
                    adminName: adminName || 'Admin',
                }
            );
            const updatedRemarks = res.data?.remarks || [];

            setProperties(prev => prev.map(p =>
                p._id === id ? { ...p, remarks: updatedRemarks } : p
            ));

            setRemarkInputs(prev => ({ ...prev, [id]: '' }));
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving remark');
        } finally {
            setSavingRemark(prev => ({ ...prev, [id]: false }));
        }
    };

    const fileName = "605010"; // current file
    
    // Sync Redux to localStorage
    useEffect(() => {
        if (reduxAdminName) localStorage.setItem("adminName", reduxAdminName);
        if (reduxAdminRole) localStorage.setItem("adminRole", reduxAdminRole);
    }, [reduxAdminName, reduxAdminRole]);
    
    // Record dashboard view
    useEffect(() => {
        const recordDashboardView = async () => {
            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/record-view`, {
                    userName: adminName,
                    role: adminRole,
                    viewedFile: fileName,
                    viewTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                });
            } catch (err) {
                console.error("Error recording view:", err);
            }
        };
    
        if (adminName && adminRole) {
            recordDashboardView();
        }
    }, [adminName, adminRole]);
    
    // Fetch role-based permissions
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-role-permissions`);
                const rolePermissions = res.data.find((perm) => perm.role === adminRole);
                const viewed = rolePermissions?.viewedFiles?.map(f => f.trim()) || [];
                setAllowedRoles(viewed);
            } catch (err) {
                console.error("Error fetching permissions:", err);
            } finally {
                setLoading(false);
            }
        };
    
        if (adminRole) {
            fetchPermissions();
        }
    }, [adminRole]);

    // Fetch all properties
    const fetchProperties = async () => {
        try {
            setError(null);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/read-prop`, {
                params: {
                    ...filters,
                    isAdmin: true  // Always fetch all properties including hidden ones for admin
                },
                headers: {
                    'x-is-admin': 'true'  // Add admin flag header
                }
            });
            setProperties(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching properties');
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [filters]);

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

    // Auto-cycle images in table view
    useEffect(() => {
        const intervals = {};
        
        properties.forEach(property => {
            if (property.images && property.images.length > 1) {
                intervals[property._id] = setInterval(() => {
                    setTableImageIndices(prev => ({
                        ...prev,
                        [property._id]: ((prev[property._id] || 0) + 1) % property.images.length
                    }));
                }, 3000); // Change image every 3 seconds
            }
        });
        
        return () => {
            Object.values(intervals).forEach(interval => clearInterval(interval));
        };
    }, [properties]);

    // Toggle a value in a multi-select array (amenities / room types)
    const toggleArrayValue = (setter, value) => {
        setter(prev => prev.includes(value)
            ? prev.filter(v => v !== value)
            : [...prev, value]);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
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
        });
        setSelectedAmenities([]);
        setSelectedRoomTypes([]);
        setImages([]);
        setImagePreviews([]);
        setExistingImages([]);
        setVideos([]);
        setVideoPreviews([]);
        setExistingVideos([]);
        setIsEdit(false);
        setCurrentPropertyId(null);
        setShowForm(false);
        setError(null);
        setPhoneNumberCount(0);
        setDragActive(false);
        setDragActiveVideo(false);
    };

    // Handle add new property button
    const handleAddNew = () => {
        resetForm();
        setShowForm(true);
    };

    // Download a printable PDF of the current stay form (saved to Downloads)
    const handlePrintPdf = () => {
        generateStayPDF({
            formData: {
                ...formData,
                createdBy: isEdit ? formData.createdBy : (adminName || formData.createdBy)
            },
            amenities: selectedAmenities,
            roomTypes: selectedRoomTypes
        }, 'download');
    };

    // Handle edit property
    const handleEdit = async (property) => {
        setIsEdit(true);
        setCurrentPropertyId(property._id);
        setFormData({
            createdBy: property.createdBy || '',
            stayName: property.stayName || '',
            websiteLink: property.websiteLink || '',
            stayType: property.stayType || '',
            starRating: property.starRating || '',
            description: property.description || '',
            streetName: property.streetName || '',
            location: property.location || '',
            city: property.city || 'Pondicherry',
            landmark: property.landmark || '',
            pincode: property.pincode || '',
            url: property.url || '',
            priceMin: property.priceMin || '',
            priceMax: property.priceMax || '',
            weekendPrice: property.weekendPrice || '',
            extraGuestCharge: property.extraGuestCharge || '',
            taxType: property.taxType || 'Tax Excluded',
            mealPlan: property.mealPlan || 'Room Only',
            totalRooms: property.totalRooms || '',
            maxGuests: property.maxGuests || '',
            bedrooms: property.bedrooms || '',
            bathrooms: property.bathrooms || '',
            checkInTime: property.checkInTime || '01:00 PM',
            checkOutTime: property.checkOutTime || '11:00 AM',
            swimmingPool: property.swimmingPool || '',
            carPark: property.carPark || '',
            beachView: property.beachView || '',
            coupleFriendly: property.coupleFriendly || false,
            cancellationPolicy: property.cancellationPolicy || 'Free Cancellation',
            houseRules: property.houseRules || '',
            nearbyAttractions: property.nearbyAttractions || '',
            phoneNumber: property.phoneNumber || '',
            alternateNumber: property.alternateNumber || '',
            whatsappNumber: property.whatsappNumber || ''
        });
        setSelectedAmenities(property.amenities || []);
        setSelectedRoomTypes(property.roomTypes || []);
        setExistingImages(property.images || []);
        setExistingVideos(property.videos || []);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle view property details (opens the full detail page)
    const handleView = (property) => {
        setSelectedProperty(property);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Close the detail page and return to the listing
    const handleCloseDetail = () => {
        setSelectedProperty(null);
    };

    // Edit the currently-viewed stay (leaves the detail page for the edit form)
    const handleEditFromDetail = () => {
        if (!selectedProperty) return;
        const prop = selectedProperty;
        setSelectedProperty(null);
        handleEdit(prop);
    };

    // Delete the currently-viewed stay, then return to the listing
    const handleDeleteFromDetail = async () => {
        if (!selectedProperty) return;
        if (!window.confirm('Are you sure you want to delete this stay listing?')) return;
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/delete-prop/${selectedProperty._id}`);
            setSelectedProperty(null);
            fetchProperties();
            alert('Stay listing deleted successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting stay listing');
        }
    };

    // Render a single label / value pair on the detail page
    const detailField = (label, value) => (
        <div className="detail-field">
            <span className="detail-field-label">{label}</span>
            <span className="detail-field-value">
                {value !== undefined && value !== null && value !== '' ? value : '-'}
            </span>
        </div>
    );

    // Handle image click for lightbox gallery
    const handleImageClick = (property, imageIndex = 0) => {
        setSelectedImage(property);
        setSelectedImageIndex(imageIndex);
    };

    // Handle close image modal
    const handleCloseImageModal = () => {
        setSelectedImage(null);
        setSelectedImageIndex(0);
    };

    // Handle next image/video in gallery
    const handleNextImage = () => {
        if (selectedImage) {
            const totalMedia = (selectedImage.images?.length || 0) + (selectedImage.videos?.length || 0);
            if (totalMedia > 0) {
                setSelectedImageIndex((prev) => 
                    prev === totalMedia - 1 ? 0 : prev + 1
                );
            }
        }
    };

    // Handle previous image/video in gallery
    const handlePreviousImage = () => {
        if (selectedImage) {
            const totalMedia = (selectedImage.images?.length || 0) + (selectedImage.videos?.length || 0);
            if (totalMedia > 0) {
                setSelectedImageIndex((prev) => 
                    prev === 0 ? totalMedia - 1 : prev - 1
                );
            }
        }
    };

    // Handle delete property
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this stay listing?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/delete-prop/${id}`);
                fetchProperties();
                alert('Stay listing deleted successfully!');
            } catch (err) {
                alert(err.response?.data?.message || 'Error deleting stay listing');
            }
        }
    };

    // Handle toggle hide/unhide property
    const handleToggleHide = async (property) => {
        try {
            const newStatus = property.isHidden ? 'visible' : 'hidden';
            await axios.patch(`${process.env.REACT_APP_API_URL}/toggle-hide/${property._id}`);
            alert(`Property marked as ${newStatus} successfully!`);
            fetchProperties();
        } catch (err) {
            alert(err.response?.data?.message || `Error toggling property visibility`);
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Check if phone number already exists and count occurrences
        if (name === 'phoneNumber' && value.length === 10) {
            const count = properties.filter(property => property.phoneNumber === value && property._id !== currentPropertyId).length;
            setPhoneNumberCount(count);
        } else if (name === 'phoneNumber') {
            setPhoneNumberCount(0);
        }
    };

    // Generate masked phone number (e.g., 9876543210 -> 98765*****)
    const getMaskedPhoneNumber = (phoneNumber) => {
        if (!phoneNumber || phoneNumber.length < 10) return 'N/A';
        const str = phoneNumber.toString();
        return str.substring(0, 5) + '*****';
    };

    // Display a per-night price range (falls back to legacy pricePerNight)
    const formatPriceRange = (property) => {
        const { priceMin, priceMax, pricePerNight } = property;
        if (priceMin && priceMax) return `₹${priceMin} - ₹${priceMax}`;
        if (priceMin) return `₹${priceMin}`;
        if (priceMax) return `₹${priceMax}`;
        if (pricePerNight) return `₹${pricePerNight}`;
        return '-';
    };

    // Export the currently listed stays to an Excel file
    const exportToExcel = () => {
        if (!properties.length) {
            alert('No stays to export.');
            return;
        }

        const wsData = properties.map((property, index) => {
            const latestRemark = (property.remarks && property.remarks.length > 0)
                ? property.remarks[property.remarks.length - 1]
                : null;

            return {
                "S.I No": (filters.page - 1) * filters.limit + index + 1,
                "Stay ID": property.propertyId || 'N/A',
                "Stay Name": property.stayName || '-',
                "Website": property.websiteLink || '-',
                "Type": property.stayType || '-',
                "Rating": property.starRating ? `${property.starRating} Star` : '-',
                "Price / Night": formatPriceRange(property),
                "Tax": property.taxType || '-',
                "Meal Plan": property.mealPlan || '-',
                "Rooms": property.totalRooms || '-',
                "Max Guests": property.maxGuests || '-',
                "Swimming Pool": property.swimmingPool || '-',
                "Car Park": property.carPark || '-',
                "Beach View": property.beachView || '-',
                "Street": property.streetName || '-',
                "Location": property.location || '-',
                "City": property.city || '-',
                "Pincode": property.pincode || 'N/A',
                "Map URL": property.url || '-',
                "Phone": property.phoneNumber || '-',
                "Alternate Phone": property.alternateNumber || '-',
                "WhatsApp": property.whatsappNumber || '-',
                "Masked Phone": getMaskedPhoneNumber(property.phoneNumber),
                "Created At": property.createdAt ? new Date(property.createdAt).toLocaleString() : 'N/A',
                "Created By": property.createdBy || 'N/A',
                "Visibility": property.isHidden ? 'Hidden' : 'Visible',
                "Remark": latestRemark ? latestRemark.text : '-',
                "Remark By": latestRemark ? `${latestRemark.adminName || ''}${latestRemark.date ? ' • ' + new Date(latestRemark.date).toLocaleString() : ''}` : '-',
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(wsData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Stay Listings");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, `PlaceToStay_${moment().format('YYYY-MM-DD')}.xlsx`);
    };

    // Add watermark to canvas - centered with high opacity
    const addWatermark = (ctx, width, height) => {
        const watermarkText = 'RENT PONDY';
        const fontSize = Math.min(width / 5, height / 5, 80); // Responsive font size, max 80px
        
        ctx.save();
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // White with 50% opacity (increased from 15%)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw watermark once in the center of the image
        ctx.fillText(watermarkText, width / 2, height / 2);
        
        ctx.restore();
    };

    // Compress image to under 500KB with watermark
    const compressImage = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    // Resize if image is too large (max 1200px width)
                    if (width > 1200) {
                        height = (height * 1200) / width;
                        width = 1200;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Add watermark to the image
                    addWatermark(ctx, width, height);
                    
                    // Compress with quality adjustment to ensure < 500KB
                    let quality = 0.8;
                    let blob;
                    
                    const tryCompress = () => {
                        canvas.toBlob((currentBlob) => {
                            if (currentBlob.size > 512000 && quality > 0.3) {
                                // If still > 500KB, reduce quality and try again
                                quality -= 0.1;
                                canvas.toBlob(tryCompress, 'image/jpeg', quality);
                            } else {
                                // Create a new File object with compressed data
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

    // Helper function to read file as data URL
    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    };

    // Handle image selection and drag-drop
    const handleImageChange = async (e) => {
        const files = e.target.files ? Array.from(e.target.files) : Array.from(e.dataTransfer.files);
        const validFiles = files.filter((file) => file.type.startsWith('image/'));
        
        // Limit to 10 images total
        const totalImages = images.length + validFiles.length;
        if (totalImages > 10) {
            alert('Maximum 10 images allowed!');
            return;
        }
        
        setIsCompressing(true);
        
        try {
            // Compress all images and get their data URLs in parallel
            const compressionPromises = validFiles.map(async (file) => {
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
            });
            
            // Wait for all compressions to complete
            const results = await Promise.all(compressionPromises);
            
            // Extract compressed files and previews
            const compressedFilesWithInfo = results.map(r => r.compressedFile);
            const previewsData = results.map(r => r.preview);
            
            // Update state with all images at once
            setImages(prev => [...prev, ...compressedFilesWithInfo]);
            setImagePreviews(prev => [...prev, ...previewsData]);
            setIsCompressing(false);
        } catch (error) {
            console.error('Error compressing images:', error);
            setIsCompressing(false);
            alert('Error compressing images. Please try again.');
        }
    };

    // Remove image by index
    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Remove existing image
    const handleRemoveExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    // Handle video selection
    const handleVideoChange = async (e) => {
        const files = e.target.files ? Array.from(e.target.files) : Array.from(e.dataTransfer.files);
        const validFiles = files.filter((file) => file.type.startsWith('video/'));
        
        // Limit to 5 videos total
        const totalVideos = videos.length + validFiles.length;
        if (totalVideos > 5) {
            alert('Maximum 5 videos allowed!');
            return;
        }
        
        // Check file size (max 100MB per video)
        const invalidFiles = validFiles.filter(file => file.size > 100 * 1024 * 1024);
        if (invalidFiles.length > 0) {
            alert('Video files must be under 100MB!');
            return;
        }
        
        try {
            const videoPrevData = await Promise.all(
                validFiles.map(async (file) => {
                    const dataURL = await readFileAsDataURL(file);
                    return {
                        src: dataURL,
                        name: file.name,
                        size: (file.size / 1024 / 1024).toFixed(2)
                    };
                })
            );
            
            setVideos(prev => [...prev, ...validFiles]);
            setVideoPreviews(prev => [...prev, ...videoPrevData]);
        } catch (error) {
            console.error('Error processing videos:', error);
            alert('Error processing videos. Please try again.');
        }
    };

    // Remove video by index
    const handleRemoveVideo = (index) => {
        setVideos(prev => prev.filter((_, i) => i !== index));
        setVideoPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Remove existing video
    const handleRemoveExistingVideo = (index) => {
        setExistingVideos(prev => prev.filter((_, i) => i !== index));
    };

    // Drag handlers for videos
    const handleDragVideo = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActiveVideo(true);
        } else if (e.type === 'dragleave') {
            setDragActiveVideo(false);
        }
    };

    const handleDropVideo = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActiveVideo(false);
        handleVideoChange(e);
    };

    // Drag handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleImageChange(e);
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Created By is auto-captured from the logged-in admin — block new stays if it's missing
        if (!isEdit && !(adminName || '').trim()) {
            const msg = 'Could not determine the logged-in admin. Please re-login and try again.';
            setError(msg);
            alert(msg);
            return;
        }

        // Validate mandatory fields — show a popup listing anything missing/invalid
        const missingFields = [];
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

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Saving...';

        try {
            const submitData = new FormData();

            // Created By is auto-captured from the logged-in admin for new stays;
            // existing stays keep their original creator.
            const dataToSubmit = {
                ...formData,
                createdBy: isEdit ? (formData.createdBy || adminName || '') : (adminName || ''),
            };

            // Add scalar form fields
            Object.keys(dataToSubmit).forEach(key => {
                if (dataToSubmit[key] !== '' && dataToSubmit[key] !== null && dataToSubmit[key] !== undefined) {
                    submitData.append(key, dataToSubmit[key]);
                }
            });

            // Add multi-select fields (each value appended separately so the
            // backend receives a real array)
            selectedAmenities.forEach(a => submitData.append('amenities', a));
            selectedRoomTypes.forEach(r => submitData.append('roomTypes', r));

            // Add new images and videos together as "files"
            images.forEach(image => {
                submitData.append('files', image);
            });

            videos.forEach(video => {
                submitData.append('files', video);
            });

            // Add existing images and videos URLs (for edit mode)
            if (isEdit) {
                existingImages.forEach(img => {
                    submitData.append('existingImages', img.url);
                });
                
                existingVideos.forEach(vid => {
                    submitData.append('existingVideos', vid.url);
                });
            }

            if (isEdit) {
                await axios.put(`${process.env.REACT_APP_API_URL}/update-prop/${currentPropertyId}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Stay listing updated successfully!');
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/add-prop`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Stay listing created successfully!');
            }
            
            resetForm();
            fetchProperties();
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving property');
            alert(err.response?.data?.message || 'Error saving property');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    };

    // Handle filter change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: 1
        }));
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    // Permission checks
    // if (loading) return <p>Loading...</p>;
    
    // if (!allowedRoles.includes(fileName)) {
    //     return (
    //         <div className="text-center text-red-500 font-semibold text-lg mt-10">
    //             Only admin is allowed to view this file.
    //         </div>
    //     );
    // }

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

    return (
        <div className="admin-dashboard">
            <ValidationPopup messages={validationMessages} onClose={() => setValidationMessages([])} />
            <div className="dashboard-header">
                <h1>🏖️ Place To Stay — Guest Houses & Resorts</h1>
                {!showForm && !selectedProperty && (
                    <button className="btn btn-primary" onClick={handleAddNew}>
                        + Add New Stay
                    </button>
                )}
            </div>

            {/* ADD/EDIT FORM SECTION */}
            {showForm && (
                <div className="form-section">
                    <div className="form-header">
                        <h2>{isEdit ? '✏️ Edit Stay' : '➕ Add New Stay'}</h2>
                        <button className="btn btn-close" onClick={resetForm}>
                            ✕ Cancel
                        </button>
                    </div>

                    {error && <div className="error-message">❌ {error}</div>}

                    <form onSubmit={handleSubmit} className="property-form" noValidate>
                        {/* ───── SECTION: Basic details ───── */}
                        <h3 className="stay-section-title">🏠 Basic Details</h3>
                        <div className="form-row">
                            {/* Created By is auto-captured from the logged-in admin on submit — not shown here */}

                            {/* Stay Name */}
                            <div className="form-group">
                                <label>Stay Name *</label>
                                <input
                                    type="text"
                                    name="stayName"
                                    value={formData.stayName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Sea Breeze Beach Resort"
                                    required
                                />
                            </div>

                            {/* Website Link */}
                            <div className="form-group">
                                <label>Website Link</label>
                                <input
                                    type="url"
                                    name="websiteLink"
                                    value={formData.websiteLink}
                                    onChange={handleInputChange}
                                    placeholder="e.g., https://www.seabreezeresort.com"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            {/* Stay Type */}
                            <div className="form-group">
                                <label>Stay Type *</label>
                                <select
                                    name="stayType"
                                    value={formData.stayType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Stay Type</option>
                                    {stayTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            {/* Star Rating */}
                            <div className="form-group">
                                <label>Star Rating</label>
                                <select
                                    name="starRating"
                                    value={formData.starRating}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Not rated</option>
                                    <option value="1">⭐ 1 Star</option>
                                    <option value="2">⭐⭐ 2 Star</option>
                                    <option value="3">⭐⭐⭐ 3 Star</option>
                                    <option value="4">⭐⭐⭐⭐ 4 Star</option>
                                    <option value="5">⭐⭐⭐⭐⭐ 5 Star</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label>Description / About the Stay</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Describe the property, rooms, surroundings and what makes it special for tourists..."
                            />
                        </div>

                        {/* ───── SECTION: Pricing & tariff ───── */}
                        <h3 className="stay-section-title">💰 Pricing & Tariff (per night)</h3>
                        <div className="form-row">
                            {/* Price per night — minimum */}
                            <div className="form-group">
                                <label>Price / Night Min (₹) *</label>
                                <input
                                    type="number"
                                    name="priceMin"
                                    value={formData.priceMin}
                                    onChange={handleInputChange}
                                    placeholder="Lowest tariff per night"
                                    min="0"
                                    required
                                />
                            </div>

                            {/* Price per night — maximum */}
                            <div className="form-group">
                                <label>Price / Night Max (₹)</label>
                                <input
                                    type="number"
                                    name="priceMax"
                                    value={formData.priceMax}
                                    onChange={handleInputChange}
                                    placeholder="Highest tariff per night"
                                    min="0"
                                />
                            </div>

                            {/* Weekend price */}
                            <div className="form-group">
                                <label>Weekend Price (₹)</label>
                                <input
                                    type="number"
                                    name="weekendPrice"
                                    value={formData.weekendPrice}
                                    onChange={handleInputChange}
                                    placeholder="Fri / Sat tariff"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            {/* Extra guest charge */}
                            <div className="form-group">
                                <label>Extra Guest Charge (₹)</label>
                                <input
                                    type="number"
                                    name="extraGuestCharge"
                                    value={formData.extraGuestCharge}
                                    onChange={handleInputChange}
                                    placeholder="Per extra person"
                                    min="0"
                                />
                            </div>

                            {/* Tax included / excluded */}
                            <div className="form-group">
                                <label>Tax</label>
                                <div className="tax-options">
                                    <label className="switch-row">
                                        <input
                                            type="radio"
                                            name="taxType"
                                            value="Tax Included"
                                            checked={formData.taxType === 'Tax Included'}
                                            onChange={handleInputChange}
                                        />
                                        <span>Tax Included</span>
                                    </label>
                                    <label className="switch-row">
                                        <input
                                            type="radio"
                                            name="taxType"
                                            value="Tax Excluded"
                                            checked={formData.taxType === 'Tax Excluded'}
                                            onChange={handleInputChange}
                                        />
                                        <span>Tax Excluded</span>
                                    </label>
                                </div>
                            </div>

                            {/* Meal plan */}
                            <div className="form-group">
                                <label>Meal Plan</label>
                                <select
                                    name="mealPlan"
                                    value={formData.mealPlan}
                                    onChange={handleInputChange}
                                >
                                    {mealPlanOptions.map(m => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* ───── SECTION: Location ───── */}
                        <h3 className="stay-section-title">📍 Location</h3>
                        <div className="form-row">
                            {/* Street / Address */}
                            <div className="form-group">
                                <label>Street / Address *</label>
                                <input
                                    type="text"
                                    name="streetName"
                                    value={formData.streetName}
                                    onChange={handleInputChange}
                                    placeholder="Building, street, area"
                                    required
                                />
                            </div>

                            {/* Location / Area */}
                            <div className="form-group">
                                <label>Location / Area *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g., White Town, Auroville"
                                    required
                                />
                            </div>

                            {/* City */}
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="City"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            {/* Landmark */}
                            <div className="form-group">
                                <label>Landmark</label>
                                <input
                                    type="text"
                                    name="landmark"
                                    value={formData.landmark}
                                    onChange={handleInputChange}
                                    placeholder="Nearby landmark (e.g., near Promenade Beach)"
                                />
                            </div>

                            {/* Pincode */}
                            <div className="form-group">
                                <label>Pincode *</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    placeholder="Enter 6-digit pincode"
                                    pattern="[0-9]{6}"
                                    maxLength="6"
                                    required
                                />
                            </div>

                            {/* Map URL */}
                            <div className="form-group">
                                <label>Google Map URL</label>
                                <input
                                    type="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleInputChange}
                                    placeholder="Paste Google Map location URL"
                                />
                                <small>e.g., https://maps.google.com/...</small>
                            </div>
                        </div>

                        {/* ───── SECTION: Rooms & capacity ───── */}
                        <h3 className="stay-section-title">🛏️ Rooms & Capacity</h3>
                        <div className="form-row">
                            {/* Room Type (dropdown) */}
                            <div className="form-group">
                                <label>Room Types Available</label>
                                <select
                                    value={selectedRoomTypes[0] || ''}
                                    onChange={(e) => setSelectedRoomTypes(e.target.value ? [e.target.value] : [])}
                                >
                                    <option value="">Select room type</option>
                                    {roomTypeOptions.map(rt => (
                                        <option key={rt} value={rt}>{rt}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Total rooms */}
                            <div className="form-group">
                                <label>Total Rooms</label>
                                <select
                                    name="totalRooms"
                                    value={formData.totalRooms}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select no. of rooms</option>
                                    {totalRoomsOptions.map(n => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Max guests */}
                            <div className="form-group">
                                <label>Max Guests</label>
                                <input
                                    type="number"
                                    name="maxGuests"
                                    value={formData.maxGuests}
                                    onChange={handleInputChange}
                                    placeholder="Max occupancy"
                                    min="1"
                                />
                            </div>

                            {/* Bedrooms */}
                            <div className="form-group">
                                <label>Bedrooms</label>
                                <select
                                    name="bedrooms"
                                    value={formData.bedrooms}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select no. of bedrooms</option>
                                    {BEDROOM_OPTIONS.map(n => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Bathrooms */}
                            <div className="form-group">
                                <label>Bathrooms</label>
                                <input
                                    type="number"
                                    name="bathrooms"
                                    value={formData.bathrooms}
                                    onChange={handleInputChange}
                                    placeholder="No. of bathrooms"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            {/* Check-in */}
                            <div className="form-group">
                                <label>Check-in Time</label>
                                <input
                                    type="text"
                                    name="checkInTime"
                                    value={formData.checkInTime}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 01:00 PM"
                                />
                            </div>

                            {/* Check-out */}
                            <div className="form-group">
                                <label>Check-out Time</label>
                                <input
                                    type="text"
                                    name="checkOutTime"
                                    value={formData.checkOutTime}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 11:00 AM"
                                />
                            </div>
                        </div>

                        {/* ───── SECTION: Amenities ───── */}
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
                                        <button
                                            type="button"
                                            key={am.label}
                                            className={`amenity-item ${active ? 'amenity-selected' : ''}`}
                                            onClick={() => toggleArrayValue(setSelectedAmenities, am.label)}
                                        >
                                            <span className="amenity-icon">{am.icon}</span>
                                            <span className="amenity-label">{am.label}</span>
                                            {active && <span className="amenity-check">✓</span>}
                                        </button>
                                    );
                                })}
                            </div>
                            {selectedAmenities.length > 0 && (
                                <small style={{ marginTop: '6px', color: '#16a34a', fontWeight: 600 }}>
                                    {selectedAmenities.length} amenit{selectedAmenities.length === 1 ? 'y' : 'ies'} selected
                                </small>
                            )}
                        </div>

                        {/* ───── SECTION: Policies & highlights ───── */}
                        <h3 className="stay-section-title">📋 Policies & Highlights</h3>
                        <div className="form-row">
                            {/* Cancellation policy */}
                            <div className="form-group">
                                <label>Cancellation Policy</label>
                                <select
                                    name="cancellationPolicy"
                                    value={formData.cancellationPolicy}
                                    onChange={handleInputChange}
                                >
                                    {cancellationOptions.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Couple friendly */}
                            <div className="form-group">
                                <label>Couple Friendly</label>
                                <label className="switch-row">
                                    <input
                                        type="checkbox"
                                        checked={formData.coupleFriendly}
                                        onChange={(e) => setFormData(prev => ({ ...prev, coupleFriendly: e.target.checked }))}
                                    />
                                    <span>Local IDs / unmarried couples allowed</span>
                                </label>
                            </div>
                        </div>

                        <div className="form-row">
                            {/* House rules */}
                            <div className="form-group">
                                <label>House Rules</label>
                                <textarea
                                    name="houseRules"
                                    value={formData.houseRules}
                                    onChange={handleInputChange}
                                    rows={2}
                                    placeholder="e.g., No smoking indoors, pets on request, ID proof mandatory..."
                                />
                            </div>

                            {/* Nearby attractions */}
                            <div className="form-group">
                                <label>Nearby Attractions</label>
                                <textarea
                                    name="nearbyAttractions"
                                    value={formData.nearbyAttractions}
                                    onChange={handleInputChange}
                                    rows={2}
                                    placeholder="e.g., 500m to Promenade Beach, 10km to Auroville..."
                                />
                            </div>
                        </div>

                        {/* ───── SECTION: Contact ───── */}
                        <h3 className="stay-section-title">📞 Contact</h3>
                        <div className="form-row">
                            {/* Phone Number */}
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="10-digit phone number"
                                    pattern="[0-9]{10}"
                                    required
                                />
                                {phoneNumberCount > 0 && (
                                    <small className="warning-text">⚠️ This phone number already exists in {phoneNumberCount} listing{phoneNumberCount === 1 ? '' : 's'}</small>
                                )}
                            </div>

                            {/* Alternate Number */}
                            <div className="form-group">
                                <label>Alternate Number</label>
                                <input
                                    type="tel"
                                    name="alternateNumber"
                                    value={formData.alternateNumber}
                                    onChange={handleInputChange}
                                    placeholder="10-digit alternate number"
                                    pattern="[0-9]{10}"
                                />
                            </div>

                            {/* WhatsApp Number */}
                            <div className="form-group">
                                <label>WhatsApp Number</label>
                                <input
                                    type="tel"
                                    name="whatsappNumber"
                                    value={formData.whatsappNumber}
                                    onChange={handleInputChange}
                                    placeholder="10-digit WhatsApp number"
                                    pattern="[0-9]{10}"
                                />
                            </div>
                        </div>

                        {/* Existing Images (Edit Mode) */}
                        {isEdit && existingImages.length > 0 && (
                            <div className="form-group">
                                <label>Existing Images</label>
                                <div className="existing-images">
                                    {existingImages.map((img, index) => (
                                        <div key={index} className="image-preview">
                                            <img 
                                                src={`${process.env.REACT_APP_MEDIA_URL}${img.url}`} 
                                                alt={`Property ${index + 1}`}
                                            />
                                            <button
                                                type="button"
                                                className="btn-remove-image"
                                                onClick={() => handleRemoveExistingImage(index)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload New Images - Improved Card */}
                        <div className="form-group">
                            <label>📸 {isEdit ? 'Add More Images' : 'Upload Images'} (Max 10)</label>
                            
                            {/* Drag and Drop Area */}
                            <div
                                className={`upload-card ${dragActive ? 'drag-active' : ''}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="file-input-hidden"
                                    id="imageInput"
                                />
                                <label htmlFor="imageInput" className="upload-label">
                                    <div className="upload-icon">📤</div>
                                    <h3>Drag & drop images here</h3>
                                    <p>or click to browse</p>
                                    <small>Images will be auto-compressed to under 500KB</small>
                                </label>
                            </div>
                            
                            {/* Image Count Badge */}
                            {isCompressing && (
                                <div className="image-count-badge compressing-badge">
                                    🔄 Compressing images...
                                </div>
                            )}
                            
                            {(images.length > 0 || imagePreviews.length > 0) && !isCompressing && (
                                <div className="image-count-badge">
                                    ✅ {images.length} image{images.length !== 1 ? 's' : ''} selected
                                </div>
                            )}
                            
                            {/* Image Previews */}
                            {imagePreviews.length > 0 && (
                                <div className="image-previews-container">
                                    <h4>📷 Preview ({imagePreviews.length})</h4>
                                    <div className="image-preview-grid">
                                        {imagePreviews.map((preview, index) => {
                                            const compressionRatio = ((1 - preview.compressedSize / preview.originalSize) * 100).toFixed(0);
                                            return (
                                                <div key={index} className="preview-item">
                                                    <div className="preview-image-wrapper">
                                                        <img src={preview.src} alt={`Preview ${index + 1}`} />
                                                        <button
                                                            type="button"
                                                            className="btn-remove-preview"
                                                            onClick={() => handleRemoveImage(index)}
                                                            title="Remove image"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                    <div className="preview-info">
                                                        <p className="preview-name">{preview.name.slice(0, 20)}...</p>
                                                        <p className="preview-size">
                                                            {preview.originalSize} MB → {preview.compressedSize} MB
                                                        </p>
                                                        <p className="preview-compression">
                                                            📦 Saved {compressionRatio}%
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Existing Videos (Edit Mode) */}
                        {isEdit && existingVideos.length > 0 && (
                            <div className="form-group">
                                <label>Existing Videos</label>
                                <div className="existing-videos">
                                    {existingVideos.map((vid, index) => (
                                        <div key={index} className="video-preview">
                                            <video 
                                                src={`${process.env.REACT_APP_MEDIA_URL}${vid.url}`}
                                                controls
                                                width="120"
                                                height="120"
                                            />
                                            <button
                                                type="button"
                                                className="btn-remove-image"
                                                onClick={() => handleRemoveExistingVideo(index)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload New Videos */}
                        <div className="form-group">
                            <label>🎬 {isEdit ? 'Add More Videos' : 'Upload Videos'} (Max 5, 100MB each)</label>
                            
                            {/* Drag and Drop Area for Videos */}
                            <div
                                className={`upload-card ${dragActiveVideo ? 'drag-active' : ''}`}
                                onDragEnter={handleDragVideo}
                                onDragLeave={handleDragVideo}
                                onDragOver={handleDragVideo}
                                onDrop={handleDropVideo}
                            >
                                <input
                                    type="file"
                                    accept="video/*"
                                    multiple
                                    onChange={handleVideoChange}
                                    className="file-input-hidden"
                                    id="videoInput"
                                />
                                <label htmlFor="videoInput" className="upload-label">
                                    <div className="upload-icon">📹</div>
                                    <h3>Drag & drop videos here</h3>
                                    <p>or click to browse</p>
                                    <small>Supported formats: MP4, WebM, OGG (Max 100MB per video)</small>
                                </label>
                            </div>
                            
                            {/* Video Count Badge */}
                            {videos.length > 0 && (
                                <div className="image-count-badge">
                                    ✅ {videos.length} video{videos.length !== 1 ? 's' : ''} selected
                                </div>
                            )}
                            
                            {/* Video Previews */}
                            {videoPreviews.length > 0 && (
                                <div className="image-previews-container">
                                    <h4>🎥 Preview ({videoPreviews.length})</h4>
                                    <div className="image-preview-grid">
                                        {videoPreviews.map((preview, index) => (
                                            <div key={index} className="preview-item">
                                                <div className="preview-image-wrapper">
                                                    <video 
                                                        src={preview.src}
                                                        width="140"
                                                        height="140"
                                                        style={{objectFit: 'cover', width: '100%', height: '100%'}}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn-remove-preview"
                                                        onClick={() => handleRemoveVideo(index)}
                                                        title="Remove video"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                                <div className="preview-info">
                                                    <p className="preview-name">{preview.name.slice(0, 20)}...</p>
                                                    <p className="preview-size">
                                                        {preview.size} MB
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-success"
                            >
                                {isEdit ? '💾 Update Stay' : '✅ Create Stay'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handlePrintPdf}
                            >
                                📄 Download PDF
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleBlankFormPdf}
                            >
                                📝 Blank Form PDF
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={resetForm}
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* PROPERTIES LIST SECTION */}
            {!showForm && !selectedProperty && (
                <div className="properties-section">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <h2>📋 Stay Listings</h2>
                        <button
                            className="btn btn-success"
                            onClick={exportToExcel}
                            disabled={properties.length === 0}
                            title="Export the listed stays to an Excel file"
                        >
                            📊 Export to Excel
                        </button>
                    </div>

                    {/* FILTERS SECTION */}
                    <div className="filters-section">
                        <div className="form-row">
                            {/* Stay Type Filter */}
                            <div className="form-group">
                                <label>Stay Type</label>
                                <select
                                    name="stayType"
                                    value={filters.stayType}
                                    onChange={handleFilterChange}
                                    className="filter-select"
                                >
                                    <option value="">All Types</option>
                                    {stayTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            {/* Search Filter */}
                            <div className="form-group">
                                <label>Search</label>
                                <input
                                    type="text"
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    placeholder="Stay ID, name or area"
                                    className="filter-input"
                                />
                            </div>

                            {/* Location Filter */}
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                    placeholder="Enter location"
                                    className="filter-input"
                                />
                            </div>

                            {/* Created By Filter */}
                            <div className="form-group">
                                <label>Created By</label>
                                <input
                                    type="text"
                                    name="createdBy"
                                    value={filters.createdBy}
                                    onChange={handleFilterChange}
                                    placeholder="Enter created by name"
                                    className="filter-input"
                                />
                            </div>

                            {/* Created At */}
                            <div className="form-group">
                                <label>Created At</label>
                                <input
                                    type="date"
                                    name="createdAt"
                                    value={filters.createdAt || ''}
                                    onChange={(e) => {
                                        const newInputValue = e.target.value;
                                        setFilters(prev => ({
                                            ...prev,
                                            createdAt: newInputValue,
                                            page: 1
                                        }));
                                    }}
                                    className="filter-input"
                                />
                            </div>
                        </div>
                    </div>

                    {error && <div className="error-message">❌ {error}</div>}

                    {properties.length === 0 ? (
                        <div className="no-data">
                            <p>📭 No stays found</p>
                        </div>
                    ) : (
                        <div className="properties-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>S.I No</th>
                                        <th>Stay ID</th>
                                        <th>Image</th>
                                        <th>Stay Name</th>
                                        <th>Website</th>
                                        <th>Type</th>
                                        <th>Rating</th>
                                        <th>Price / Night</th>
                                        <th>Tax</th>
                                        <th>Meal Plan</th>
                                        <th>Rooms</th>
                                        <th>Max Guests</th>
                                        <th>Street</th>
                                        <th>Location</th>
                                        <th>City</th>
                                        <th>Pincode</th>
                                        <th>Map URL</th>
                                        <th>Phone</th>
                                        <th>Alt Phone</th>
                                        <th>WhatsApp</th>
                                        <th>Masked Phone</th>
                                        <th>Created At</th>
                                        <th>Created By</th>
                                        <th>Actions</th>
                                        <th>Visibility</th>
                                        <th>Remark</th>
                                        <th>Remark Record</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {properties.map((property, index) => (
                                        <tr key={property._id}>
                                            <td className="serial-number">{(filters.page - 1) * filters.limit + index + 1}</td>
                                            <td>
                                                <span
                                                    className="property-id property-id-link"
                                                    onClick={() => handleView(property)}
                                                    title="View full details"
                                                >
                                                    {property.propertyId || 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                {property.images && property.images.length > 0 && property.images[tableImageIndices[property._id] || 0]?.url ? (
                                                    <div className="table-image-container">
                                                        <img
                                                            src={`${process.env.REACT_APP_MEDIA_URL}${property.images[tableImageIndices[property._id] || 0]?.url}`}
                                                            alt="Property"
                                                            className="table-image table-image-clickable"
                                                            onClick={() => handleImageClick(property, tableImageIndices[property._id] || 0)}
                                                            title="Click to view all images"
                                                        />
                                                        {property.images.length > 1 && (
                                                            <span className="image-counter-badge">
                                                                {(tableImageIndices[property._id] || 0) + 1}/{property.images.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="table-image-container">
                                                        <img
                                                            src={DEFAULT_IMAGE}
                                                            alt="Default Property Image"
                                                            className="table-image"
                                                            title="No images uploaded - Default thumbnail"
                                                        />
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <strong
                                                    className="stay-name-link"
                                                    onClick={() => handleView(property)}
                                                    title="View full details"
                                                >
                                                    {property.stayName || '-'}
                                                </strong>
                                            </td>
                                            <td>
                                                {property.websiteLink ? (
                                                    <a href={property.websiteLink} target="_blank" rel="noopener noreferrer" style={{color: '#007bff', textDecoration: 'underline', cursor: 'pointer'}}>
                                                        🔗 Visit
                                                    </a>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td>
                                                <span className="badge badge-stay">
                                                    {property.stayType || '-'}
                                                </span>
                                            </td>
                                            <td>{property.starRating ? '⭐'.repeat(property.starRating) : '-'}</td>
                                            <td>{formatPriceRange(property)}</td>
                                            <td>{property.taxType || '-'}</td>
                                            <td>{property.mealPlan || '-'}</td>
                                            <td>{property.totalRooms || '-'}</td>
                                            <td>{property.maxGuests || '-'}</td>
                                            <td>{property.streetName}</td>
                                            <td>{property.location}</td>
                                            <td>{property.city || '-'}</td>
                                            <td>{property.pincode || 'N/A'}</td>
                                            <td>
                                                {property.url ? (
                                                    <a href={property.url} target="_blank" rel="noopener noreferrer" style={{color: '#007bff', textDecoration: 'underline', cursor: 'pointer'}}>
                                                        🔗 View
                                                    </a>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td>{property.phoneNumber}</td>
                                            <td>{property.alternateNumber || '-'}</td>
                                            <td>{property.whatsappNumber || '-'}</td>
                                            <td>{getMaskedPhoneNumber(property.phoneNumber)}</td>
                                            <td>{new Date(property.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <span className="created-by-badge">
                                                    {property.createdBy || 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn btn-view"
                                                        onClick={() => handleView(property)}
                                                        title="View details"
                                                    >
                                                        👁️
                                                    </button>
                                                    <button
                                                        className="btn btn-edit"
                                                        onClick={() => handleEdit(property)}
                                                        title="Edit"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button 
                                                        className="btn btn-delete"
                                                        onClick={() => handleDelete(property._id)}
                                                        title="Delete"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <button 
                                                    className={`btn visibility-badge ${property.isHidden ? 'visibility-hidden' : 'visibility-visible'}`}
                                                    onClick={() => handleToggleHide(property)}
                                                    title={property.isHidden ? 'Click to make visible' : 'Click to hide'}
                                                >
                                                    {property.isHidden ? '🔒 Hidden' : '👁️ Visible'}
                                                </button>
                                            </td>
                                            <td style={{ minWidth: '200px' }}>
                                                <textarea
                                                    rows={2}
                                                    placeholder="Enter remark"
                                                    value={remarkInputs[property._id] || ''}
                                                    onChange={(e) => handleRemarkInputChange(property._id, e.target.value)}
                                                    style={{ fontSize: '12px', width: '100%', padding: '4px', border: '1px solid #ced4da', borderRadius: '4px' }}
                                                />
                                                <button
                                                    className="btn"
                                                    style={{ marginTop: '4px', fontSize: '12px', padding: '4px 10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                    disabled={!(remarkInputs[property._id] || '').trim() || savingRemark[property._id]}
                                                    onClick={() => handleSaveRemark(property._id)}
                                                >
                                                    {savingRemark[property._id] ? 'Saving...' : 'Save'}
                                                </button>
                                            </td>
                                            <td style={{ minWidth: '220px', maxWidth: '300px' }}>
                                                {(property.remarks && property.remarks.length > 0) ? (() => {
                                                    const latest = property.remarks[property.remarks.length - 1];
                                                    return (
                                                        <div style={{ fontSize: '12px' }}>
                                                            <div>{latest.text}</div>
                                                            <div style={{ color: '#666', fontSize: '10px' }}>
                                                                {latest.adminName} • {latest.date ? new Date(latest.date).toLocaleString() : ''}
                                                            </div>
                                                        </div>
                                                    );
                                                })() : (
                                                    <span style={{ color: '#999' }}>-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                onClick={() => handlePageChange(filters.page - 1)}
                                disabled={filters.page === 1}
                                className="btn btn-secondary"
                            >
                                ← Previous
                            </button>
                            <span className="page-info">
                                Page {filters.page} of {totalPages}
                            </span>
                            <button 
                                onClick={() => handlePageChange(filters.page + 1)}
                                disabled={filters.page === totalPages}
                                className="btn btn-secondary"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* STAY DETAIL PAGE */}
            {!showForm && selectedProperty && (
                <div className="stay-detail-page">
                    {/* Toolbar */}
                    <div className="detail-toolbar">
                        <button className="btn btn-secondary" onClick={handleCloseDetail}>
                            ← Back to list
                        </button>
                        <div className="detail-toolbar-actions">
                            <button className="btn btn-primary" onClick={handleEditFromDetail}>
                                ✏️ Edit
                            </button>
                            <button className="btn btn-danger" onClick={handleDeleteFromDetail}>
                                🗑️ Delete
                            </button>
                        </div>
                    </div>

                    {/* Title block */}
                    <div className="detail-title-block">
                        <h2 className="detail-stay-name">{selectedProperty.stayName || '-'}</h2>
                        <div className="detail-badges">
                            <span className="property-id">{selectedProperty.propertyId || 'N/A'}</span>
                            <span className="badge badge-stay">{selectedProperty.stayType || '-'}</span>
                            {selectedProperty.starRating ? (
                                <span className="detail-stars">{'⭐'.repeat(selectedProperty.starRating)}</span>
                            ) : null}
                            <span className={`btn visibility-badge ${selectedProperty.isHidden ? 'visibility-hidden' : 'visibility-visible'}`}>
                                {selectedProperty.isHidden ? '🔒 Hidden' : '👁️ Visible'}
                            </span>
                        </div>
                    </div>

                    {/* Media gallery */}
                    <div className="detail-gallery">
                        {(selectedProperty.images?.length > 0 || selectedProperty.videos?.length > 0) ? (
                            <>
                                {selectedProperty.images?.map((img, idx) => (
                                    <img
                                        key={`img-${idx}`}
                                        src={`${process.env.REACT_APP_MEDIA_URL}${img.url}`}
                                        alt={`${selectedProperty.stayName} ${idx + 1}`}
                                        className="detail-gallery-thumb"
                                        onClick={() => handleImageClick(selectedProperty, idx)}
                                        title="Click to view full size"
                                    />
                                ))}
                                {selectedProperty.videos?.map((vid, idx) => (
                                    <div
                                        key={`vid-${idx}`}
                                        className="detail-gallery-thumb detail-gallery-video"
                                        onClick={() => handleImageClick(selectedProperty, (selectedProperty.images?.length || 0) + idx)}
                                        title="Click to play"
                                    >
                                        <video src={`${process.env.REACT_APP_MEDIA_URL}${vid.url}`} />
                                        <span className="detail-video-badge">🎬</span>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <img src={DEFAULT_IMAGE} alt="Default" className="detail-gallery-thumb" />
                        )}
                    </div>

                    {/* Detail sections */}
                    <div className="detail-sections">
                        {/* Basic */}
                        <div className="detail-card">
                            <h3 className="stay-section-title">🏠 Basic Details</h3>
                            <div className="detail-grid">
                                {detailField('Stay Name', selectedProperty.stayName)}
                                {detailField('Stay Type', selectedProperty.stayType)}
                                {detailField('Star Rating', selectedProperty.starRating ? `${selectedProperty.starRating} Star` : '-')}
                                {detailField('Website', selectedProperty.websiteLink
                                    ? <a href={selectedProperty.websiteLink} target="_blank" rel="noopener noreferrer">{selectedProperty.websiteLink}</a>
                                    : '-')}
                            </div>
                            {selectedProperty.description && (
                                <div className="detail-description">
                                    <span className="detail-field-label">Description</span>
                                    <p>{selectedProperty.description}</p>
                                </div>
                            )}
                        </div>

                        {/* Pricing */}
                        <div className="detail-card">
                            <h3 className="stay-section-title">💰 Pricing & Tariff</h3>
                            <div className="detail-grid">
                                {detailField('Price / Night', formatPriceRange(selectedProperty))}
                                {detailField('Weekend Price', selectedProperty.weekendPrice ? `₹${selectedProperty.weekendPrice}` : '-')}
                                {detailField('Extra Guest Charge', selectedProperty.extraGuestCharge ? `₹${selectedProperty.extraGuestCharge}` : '-')}
                                {detailField('Tax', selectedProperty.taxType)}
                                {detailField('Meal Plan', selectedProperty.mealPlan)}
                            </div>
                        </div>

                        {/* Location */}
                        <div className="detail-card">
                            <h3 className="stay-section-title">📍 Location</h3>
                            <div className="detail-grid">
                                {detailField('Street / Address', selectedProperty.streetName)}
                                {detailField('Location / Area', selectedProperty.location)}
                                {detailField('City', selectedProperty.city)}
                                {detailField('Landmark', selectedProperty.landmark)}
                                {detailField('Pincode', selectedProperty.pincode)}
                                {detailField('Google Map', selectedProperty.url
                                    ? <a href={selectedProperty.url} target="_blank" rel="noopener noreferrer">🔗 View on Map</a>
                                    : '-')}
                            </div>
                        </div>

                        {/* Rooms & Capacity */}
                        <div className="detail-card">
                            <h3 className="stay-section-title">🛏️ Rooms & Capacity</h3>
                            <div className="detail-grid">
                                {detailField('Total Rooms', selectedProperty.totalRooms)}
                                {detailField('Max Guests', selectedProperty.maxGuests)}
                                {detailField('Bedrooms', selectedProperty.bedrooms)}
                                {detailField('Bathrooms', selectedProperty.bathrooms)}
                                {detailField('Check-in Time', selectedProperty.checkInTime)}
                                {detailField('Check-out Time', selectedProperty.checkOutTime)}
                            </div>
                            {selectedProperty.roomTypes?.length > 0 && (
                                <div className="detail-chips">
                                    {selectedProperty.roomTypes.map(rt => (
                                        <span key={rt} className="chip chip-selected">{rt}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Amenities & Features */}
                        <div className="detail-card">
                            <h3 className="stay-section-title">✨ Amenities & Facilities</h3>
                            <div className="detail-grid">
                                {detailField('Swimming Pool', selectedProperty.swimmingPool)}
                                {detailField('Car Park', selectedProperty.carPark)}
                                {detailField('Beach View', selectedProperty.beachView)}
                            </div>
                            {selectedProperty.amenities?.length > 0 && (
                                <div className="detail-chips">
                                    {selectedProperty.amenities.map(a => (
                                        <span key={a} className="chip chip-selected">
                                            {(AMENITY_OPTIONS.find(o => o.label === a)?.icon) || '✔️'} {a}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Policies & Highlights */}
                        <div className="detail-card">
                            <h3 className="stay-section-title">📋 Policies & Highlights</h3>
                            <div className="detail-grid">
                                {detailField('Cancellation Policy', selectedProperty.cancellationPolicy)}
                                {detailField('Couple Friendly', selectedProperty.coupleFriendly ? 'Yes' : 'No')}
                            </div>
                            {selectedProperty.houseRules && (
                                <div className="detail-description">
                                    <span className="detail-field-label">House Rules</span>
                                    <p>{selectedProperty.houseRules}</p>
                                </div>
                            )}
                            {selectedProperty.nearbyAttractions && (
                                <div className="detail-description">
                                    <span className="detail-field-label">Nearby Attractions</span>
                                    <p>{selectedProperty.nearbyAttractions}</p>
                                </div>
                            )}
                        </div>

                        {/* Contact */}
                        <div className="detail-card">
                            <h3 className="stay-section-title">📞 Contact</h3>
                            <div className="detail-grid">
                                {detailField('Phone Number', selectedProperty.phoneNumber)}
                                {detailField('Alternate Number', selectedProperty.alternateNumber)}
                                {detailField('WhatsApp Number', selectedProperty.whatsappNumber)}
                                {detailField('Masked Phone', getMaskedPhoneNumber(selectedProperty.phoneNumber))}
                            </div>
                        </div>

                        {/* Record info */}
                        <div className="detail-card">
                            <h3 className="stay-section-title">🗂️ Record Info</h3>
                            <div className="detail-grid">
                                {detailField('Created By', selectedProperty.createdBy)}
                                {detailField('Created At', selectedProperty.createdAt ? new Date(selectedProperty.createdAt).toLocaleString() : '-')}
                                {detailField('Updated At', selectedProperty.updatedAt ? new Date(selectedProperty.updatedAt).toLocaleString() : '-')}
                            </div>
                            {selectedProperty.remarks?.length > 0 && (
                                <div className="detail-description">
                                    <span className="detail-field-label">Remarks</span>
                                    {selectedProperty.remarks.map((r, i) => (
                                        <p key={i}>
                                            {r.text}{' '}
                                            <small style={{ color: '#666' }}>
                                                — {r.adminName}{r.date ? ' • ' + new Date(r.date).toLocaleString() : ''}
                                            </small>
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* IMAGE/VIDEO LIGHTBOX GALLERY MODAL */}
            {selectedImage && (
                <div className="image-lightbox-overlay" onClick={handleCloseImageModal}>
                    <div className="image-lightbox-container" onClick={(e) => e.stopPropagation()}>
                        {/* Close Button */}
                        <button 
                            className="lightbox-close-btn"
                            onClick={handleCloseImageModal}
                            title="Close"
                        >
                            ✕
                        </button>

                        {/* Combined Media Array (Images + Videos) */}
                        {(() => {
                            // Ensure we have arrays, never undefined
                            const images = selectedImage?.images ? (Array.isArray(selectedImage.images) ? selectedImage.images : []) : [];
                            const videos = selectedImage?.videos ? (Array.isArray(selectedImage.videos) ? selectedImage.videos : []) : [];
                            
                            const allMedia = [
                                ...images.map((img, idx) => ({ ...img, type: 'image', originalIndex: idx })),
                                ...videos.map((vid, idx) => ({ ...vid, type: 'video', originalIndex: idx }))
                            ];
                            
                            console.log('Media Debug:', { images: images.length, videos: videos.length, total: allMedia.length, currentIndex: selectedImageIndex });
                            
                            if (allMedia.length === 0) {
                                return (
                                    <div className="lightbox-image-wrapper">
                                        <img 
                                            src={DEFAULT_IMAGE}
                                            alt="Default Property Image"
                                            className="lightbox-image"
                                        />
                                    </div>
                                );
                            }

                            // Ensure selectedImageIndex doesn't exceed total media
                            const safeIndex = Math.min(selectedImageIndex, allMedia.length - 1);
                            const currentMedia = allMedia[safeIndex];
                            const totalMedia = allMedia.length;

                            return (
                                <>
                                    {/* Main Media Display */}
                                    <div className="lightbox-image-wrapper">
                                        {currentMedia?.type === 'video' ? (
                                            <video 
                                                key={`video-${currentMedia.public_id}`}
                                                src={`${process.env.REACT_APP_MEDIA_URL}${currentMedia.url}`}
                                                controls
                                                className="lightbox-video"
                                                autoPlay
                                            />
                                        ) : (
                                            <img 
                                                key={`image-${currentMedia.public_id}`}
                                                src={`${process.env.REACT_APP_MEDIA_URL}${currentMedia.url}`}
                                                alt={`Property ${safeIndex + 1}`}
                                                className="lightbox-image" 
                                            />
                                        )}
                                    </div>

                                    {/* Navigation Arrows (only show if multiple media) */}
                                    {totalMedia > 1 && (
                                        <>
                                            <button
                                                className="lightbox-nav-btn lightbox-prev-btn"
                                                onClick={handlePreviousImage}
                                                title="Previous media"
                                            >
                                                ❮
                                            </button>
                                            <button
                                                className="lightbox-nav-btn lightbox-next-btn"
                                                onClick={handleNextImage}
                                                title="Next media"
                                            >
                                                ❯
                                            </button>
                                        </>
                                    )}

                                    {/* Media Counter */}
                                    {totalMedia > 1 && (
                                        <div className="lightbox-counter">
                                            {safeIndex + 1} / {totalMedia}
                                        </div>
                                    )}

                                    {/* Thumbnail Strip */}
                                    {totalMedia > 1 && (
                                        <div className="lightbox-thumbnails">
                                            {allMedia.map((media, index) => (
                                                <div
                                                    key={`thumb-${media.type}-${media.originalIndex}`}
                                                    className={`lightbox-thumbnail-wrapper ${index === safeIndex ? 'active' : ''}`}
                                                    onClick={() => setSelectedImageIndex(index)}
                                                    title={`${media.type === 'video' ? 'Video' : 'Image'} ${index + 1}`}
                                                >
                                                    {media.type === 'video' ? (
                                                        <>
                                                            <video 
                                                                src={`${process.env.REACT_APP_MEDIA_URL}${media.url}`}
                                                                className="lightbox-thumbnail"
                                                            />
                                                            <span className="media-type-badge">🎬</span>
                                                        </>
                                                    ) : (
                                                        <img
                                                            src={`${process.env.REACT_APP_MEDIA_URL}${media.url}`}
                                                            alt={`Thumbnail ${index + 1}`}
                                                            className="lightbox-thumbnail"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Info Text */}
                                    <div className="lightbox-info">
                                        <p>
                                            {totalMedia > 0 ? `💡 ${currentMedia?.type === 'video' ? '🎬 Video' : '📷 Image'} - Use arrows or click thumbnails to browse • Click ✕ or outside to close` : '📷 Default thumbnail - No media uploaded yet'}
                                        </p>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
