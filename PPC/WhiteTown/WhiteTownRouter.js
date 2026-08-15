const express = require("express");
const router = express.Router();
const WhiteTown = require("./WhiteTownModel");
const StayDropdown = require("./StayDropdownModel");
const StayView = require("./StayViewModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Allowed categories for admin-managed stay dropdown options
const STAY_DROPDOWN_CATEGORIES = ["stayType", "mealPlan", "roomType", "totalRooms", "cancellationPolicy"];

// Configure multer for image and video upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, "..", "ExclusivePhotos", "properties");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, "ExclusivePhotos/properties/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const prefix = file.mimetype.startsWith('video/') ? 'video-' : 'property-';
        cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Allow both images and videos
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const allowedVideoTypes = /mp4|webm|ogg|quicktime|x-msvideo|x-matroska/;
    const extname = path.extname(file.originalname).toLowerCase().slice(1);
    const isImage = allowedImageTypes.test(extname) && file.mimetype.startsWith('image/');
    const isVideo = allowedVideoTypes.test(extname) && file.mimetype.startsWith('video/');

    if (isImage || isVideo) {
        cb(null, true);
    } else {
        cb(new Error("Only image and video files are allowed!"));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos
    fileFilter: fileFilter
});

// Normalize a multipart/form-data field that may arrive as a single value or an array
const toArray = (val) => {
    if (val === undefined || val === null || val === '') return [];
    return Array.isArray(val) ? val : [val];
};

// Coerce a multipart string ("true"/"false") into a real boolean
const toBool = (val) => val === true || val === 'true' || val === '1';

// Multer error handler
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size exceeds 100MB limit'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Maximum 15 files allowed (images + videos)'
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected file field'
            });
        }
    }
    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'File upload error'
        });
    }
    next();
};

router.get("/test", (req, res) => {
    res.json({ message: "WhiteTown API is working!" });
});
// CREATE - Add new property
router.post("/add-prop", upload.array("files", 15), handleMulterError, async (req, res) => {
    try {
        const {
            createdBy,
            stayName,
            websiteLink,
            stayType,
            starRating,
            description,
            streetName,
            location,
            city,
            landmark,
            pincode,
            url,
            pricePerNight,
            priceMin,
            priceMax,
            weekendPrice,
            extraGuestCharge,
            taxType,
            taxesPercent,
            mealPlan,
            totalRooms,
            maxGuests,
            bedrooms,
            bathrooms,
            checkInTime,
            checkOutTime,
            swimmingPool,
            carPark,
            beachView,
            coupleFriendly,
            cancellationPolicy,
            houseRules,
            nearbyAttractions,
            phoneNumber,
            alternateNumber,
            whatsappNumber
        } = req.body;

        // Generate unique sequential propertyId (EL1000, EL1001, etc.)
        let nextId = 1000;
        
        // Get all properties with propertyId and find highest EL number
        const allProperties = await WhiteTown.find({ propertyId: { $regex: '^EL' } })
            .select('propertyId')
            .lean();
        
        if (allProperties && allProperties.length > 0) {
            const numbers = allProperties
                .map(p => {
                    const num = parseInt(p.propertyId.replace('EL', ''));
                    return !isNaN(num) ? num : 0;
                })
                .sort((a, b) => b - a);
            
            if (numbers.length > 0 && numbers[0] >= 1000) {
                nextId = numbers[0] + 1;
            }
        }
        
        const propertyId = `EL${nextId}`;

        // Create masked phone number (e.g., 9876543210 -> 98765*****)
        const maskedPhoneNumber = phoneNumber 
            ? phoneNumber.toString().substring(0, 5) + '*****'
            : '';

        // Separate images and videos from uploaded files
        const images = [];
        const videos = [];
        
        if (req.files) {
            req.files.forEach(file => {
                const fileObj = {
                    url: `/ExclusivePhotos/properties/${file.filename}`,
                    public_id: file.filename,
                    caption: ""
                };
                
                if (file.mimetype.startsWith('video/')) {
                    videos.push(fileObj);
                } else if (file.mimetype.startsWith('image/')) {
                    images.push(fileObj);
                }
            });
        }

        // Create new stay listing
        const newProperty = new WhiteTown({
            propertyId,
            createdBy,
            stayName,
            websiteLink,
            stayType,
            starRating: starRating || undefined,
            description,
            streetName,
            location,
            city,
            landmark,
            pincode,
            url,
            // Keep pricePerNight populated (from priceMin) for backward-compatible "from" price display
            pricePerNight: pricePerNight || priceMin || undefined,
            priceMin: priceMin || undefined,
            priceMax: priceMax || undefined,
            weekendPrice: weekendPrice || undefined,
            extraGuestCharge: extraGuestCharge || undefined,
            taxType: taxType || "Tax Excluded",
            taxesPercent: taxesPercent || undefined,
            mealPlan,
            totalRooms: totalRooms || undefined,
            maxGuests: maxGuests || undefined,
            bedrooms: bedrooms || undefined,
            bathrooms: bathrooms || undefined,
            roomTypes: toArray(req.body.roomTypes),
            checkInTime,
            checkOutTime,
            amenities: toArray(req.body.amenities),
            swimmingPool: swimmingPool || undefined,
            carPark: carPark || undefined,
            beachView: beachView || undefined,
            coupleFriendly: toBool(coupleFriendly),
            cancellationPolicy,
            houseRules,
            nearbyAttractions,
            phoneNumber,
            alternateNumber: alternateNumber || undefined,
            whatsappNumber: whatsappNumber || undefined,
            maskedPhoneNumber,
            images,
            videos
        });

        const savedProperty = await newProperty.save();

        res.status(201).json({
            success: true,
            message: "Property created successfully",
            data: savedProperty
        });

    } catch (error) {
        console.error("Error creating property:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error creating property"
        });
    }
});

// READ - Get all properties
router.get("/read-prop", async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            stayType,
            location,
            search,
            createdBy,
            createdAt
        } = req.query;

        // Check if request is from admin (via header or query parameter)
        const isAdmin = req.headers['x-is-admin'] === 'true' || req.query.isAdmin === 'true';

        // Build query
        let query = {};

        if (stayType) {
            query.stayType = stayType;
        }

        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        if (search) {
            query.$or = [
                { propertyId: { $regex: search, $options: "i" } },
                { stayName: { $regex: search, $options: "i" } },
                { streetName: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } }
            ];
        }

        if (createdBy) {
            query.createdBy = { $regex: createdBy, $options: "i" };
        }

        // Handle date filtering
        if (createdAt) {
            const selectedDate = new Date(createdAt);
            const nextDay = new Date(selectedDate);
            nextDay.setDate(nextDay.getDate() + 1);
            query.createdAt = {
                $gte: selectedDate,
                $lt: nextDay
            };
        }

        // Filter out hidden properties for non-admin users
        if (!isAdmin) {
            query.isHidden = false;
        }

        const properties = await WhiteTown.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await WhiteTown.countDocuments(query);

        res.status(200).json({
            success: true,
            data: properties,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalProperties: count
        });

    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching properties"
        });
    }
});

// READ - Get single property by ID
router.get("/read-prop/:id", async (req, res) => {
    try {
        const property = await WhiteTown.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        res.status(200).json({
            success: true,
            data: property
        });

    } catch (error) {
        console.error("Error fetching property:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching property"
        });
    }
});

// READ - Get property by Property ID
router.get("/propertyId/:propertyId", async (req, res) => {
    try {
        const property = await WhiteTown.findOne({ 
            propertyId: req.params.propertyId 
        });

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        res.status(200).json({
            success: true,
            data: property
        });

    } catch (error) {
        console.error("Error fetching property:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching property"
        });
    }
});

// UPDATE - Update property
router.put("/update-prop/:id", upload.array("files", 15), handleMulterError, async (req, res) => {
    try {
        const {
            stayName,
            websiteLink,
            stayType,
            starRating,
            description,
            streetName,
            location,
            city,
            landmark,
            pincode,
            url,
            pricePerNight,
            priceMin,
            priceMax,
            weekendPrice,
            extraGuestCharge,
            taxType,
            taxesPercent,
            mealPlan,
            totalRooms,
            maxGuests,
            bedrooms,
            bathrooms,
            checkInTime,
            checkOutTime,
            swimmingPool,
            carPark,
            beachView,
            coupleFriendly,
            cancellationPolicy,
            houseRules,
            nearbyAttractions,
            phoneNumber,
            alternateNumber,
            whatsappNumber,
            existingImages,
            existingVideos
        } = req.body;

        const property = await WhiteTown.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        // Handle images and videos
        let images = [];
        let videos = [];
        
        // Keep existing images if provided
        if (existingImages) {
            const existingImagesArray = Array.isArray(existingImages) 
                ? existingImages 
                : [existingImages];
            
            images = property.images.filter(img => 
                existingImagesArray.includes(img.url)
            );
        }

        // Keep existing videos if provided
        if (existingVideos) {
            const existingVideosArray = Array.isArray(existingVideos) 
                ? existingVideos 
                : [existingVideos];
            
            videos = property.videos.filter(vid => 
                existingVideosArray.includes(vid.url)
            );
        }

        // Add new uploaded files (both images and videos)
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                const fileObj = {
                    url: `/ExclusivePhotos/properties/${file.filename}`,
                    public_id: file.filename,
                    caption: ""
                };
                
                if (file.mimetype.startsWith('video/')) {
                    videos.push(fileObj);
                } else if (file.mimetype.startsWith('image/')) {
                    images.push(fileObj);
                }
            });
        }

        // Create masked phone number if phone number is provided
        const maskedPhoneNumber = phoneNumber 
            ? phoneNumber.toString().substring(0, 5) + '*****'
            : property.maskedPhoneNumber;

        // Update stay fields
        property.stayName = stayName || property.stayName;
        property.websiteLink = websiteLink !== undefined ? websiteLink : property.websiteLink;
        property.stayType = stayType || property.stayType;
        property.starRating = starRating || undefined;
        property.description = description !== undefined ? description : property.description;
        property.streetName = streetName || property.streetName;
        property.location = location || property.location;
        property.city = city || property.city;
        property.landmark = landmark !== undefined ? landmark : property.landmark;
        property.pincode = pincode || property.pincode;
        property.url = url !== undefined ? url : property.url;
        property.priceMin = priceMin || undefined;
        property.priceMax = priceMax || undefined;
        // Keep pricePerNight populated (from priceMin) for backward-compatible "from" price display
        property.pricePerNight = pricePerNight || priceMin || property.pricePerNight;
        property.weekendPrice = weekendPrice || undefined;
        property.extraGuestCharge = extraGuestCharge || undefined;
        property.taxType = taxType || property.taxType;
        property.taxesPercent = taxesPercent || undefined;
        property.mealPlan = mealPlan || property.mealPlan;
        property.totalRooms = totalRooms || undefined;
        property.maxGuests = maxGuests || undefined;
        property.bedrooms = bedrooms || undefined;
        property.bathrooms = bathrooms || undefined;
        property.roomTypes = toArray(req.body.roomTypes);
        property.checkInTime = checkInTime || property.checkInTime;
        property.checkOutTime = checkOutTime || property.checkOutTime;
        property.amenities = toArray(req.body.amenities);
        property.swimmingPool = swimmingPool !== undefined ? swimmingPool : property.swimmingPool;
        property.carPark = carPark !== undefined ? carPark : property.carPark;
        property.beachView = beachView !== undefined ? beachView : property.beachView;
        property.coupleFriendly = toBool(coupleFriendly);
        property.cancellationPolicy = cancellationPolicy || property.cancellationPolicy;
        property.houseRules = houseRules !== undefined ? houseRules : property.houseRules;
        property.nearbyAttractions = nearbyAttractions !== undefined ? nearbyAttractions : property.nearbyAttractions;
        property.phoneNumber = phoneNumber || property.phoneNumber;
        property.alternateNumber = alternateNumber !== undefined ? alternateNumber : property.alternateNumber;
        property.whatsappNumber = whatsappNumber !== undefined ? whatsappNumber : property.whatsappNumber;
        property.maskedPhoneNumber = maskedPhoneNumber;
        property.images = images;
        property.videos = videos;

        const updatedProperty = await property.save();

        res.status(200).json({
            success: true,
            message: "Property updated successfully",
            data: updatedProperty
        });

    } catch (error) {
        console.error("Error updating property:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error updating property"
        });
    }
});

// DELETE - Delete property
router.delete("/delete-prop/:id", async (req, res) => {
    try {
        const property = await WhiteTown.findByIdAndDelete(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        // Optional: Delete associated image and video files from filesystem
        const fs = require("fs");
        
        // Delete all images
        if (property.images && property.images.length > 0) {
            property.images.forEach(image => {
                const imagePath = path.join(__dirname, "..", image.url);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }
        
        // Delete all videos
        if (property.videos && property.videos.length > 0) {
            property.videos.forEach(video => {
                const videoPath = path.join(__dirname, "..", video.url);
                if (fs.existsSync(videoPath)) {
                    fs.unlinkSync(videoPath);
                }
            });
        }

        res.status(200).json({
            success: true,
            message: "Property deleted successfully",
            data: property
        });

    } catch (error) {
        console.error("Error deleting property:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error deleting property"
        });
    }
});

// DELETE - Delete specific image from property
router.delete("/delete-prop/:id/images/:imageIndex", async (req, res) => {
    try {
        const property = await WhiteTown.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        const imageIndex = parseInt(req.params.imageIndex);

        if (imageIndex < 0 || imageIndex >= property.images.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid image index"
            });
        }

        // Optional: Delete file from filesystem
        const fs = require("fs");
        const imagePath = path.join(__dirname, "..", property.images[imageIndex].url);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // Remove image from array
        property.images.splice(imageIndex, 1);
        await property.save();

        res.status(200).json({
            success: true,
            message: "Image deleted successfully",
            data: property
        });

    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error deleting image"
        });
    }
});

// PATCH/PUT - Toggle hide/unhide status of property
router.patch("/toggle-hide/:id", async (req, res) => {
    try {
        const property = await WhiteTown.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        // Toggle the isHidden status
        property.isHidden = !property.isHidden;
        const updatedProperty = await property.save();

        res.status(200).json({
            success: true,
            message: `Property ${updatedProperty.isHidden ? 'hidden' : 'unhidden'} successfully`,
            data: updatedProperty
        });

    } catch (error) {
        console.error("Error toggling property visibility:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error toggling property visibility"
        });
    }
});

// Add/replace remark for a WhiteTown property (replaces previous remark)
router.post("/add-whitetown-remark/:id", async (req, res) => {
    try {
        const { text, adminName } = req.body;

        if (!text || !String(text).trim()) {
            return res.status(400).json({
                success: false,
                message: "Remark text is required."
            });
        }

        const remark = {
            text: String(text).trim(),
            adminName: adminName || "Admin",
            date: new Date()
        };

        const updated = await WhiteTown.findByIdAndUpdate(
            req.params.id,
            { $set: { remarks: [remark] } },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Remark saved successfully",
            remarks: updated.remarks
        });
    } catch (error) {
        console.error("Error saving remark:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error saving remark"
        });
    }
});

// ───────────────────────── Stay dropdown options (admin-managed) ─────────────────────────

// GET all custom dropdown options grouped by category
router.get("/stay-dropdowns", async (req, res) => {
    try {
        const options = await StayDropdown.find().sort({ category: 1, value: 1 }).lean();

        const grouped = {};
        STAY_DROPDOWN_CATEGORIES.forEach(c => { grouped[c] = []; });
        options.forEach(o => {
            if (!grouped[o.category]) grouped[o.category] = [];
            grouped[o.category].push({ _id: o._id, value: o.value });
        });

        res.status(200).json({ success: true, data: grouped });
    } catch (error) {
        console.error("Error fetching stay dropdown options:", error);
        res.status(500).json({ success: false, message: error.message || "Error fetching dropdown options" });
    }
});

// ADD a custom dropdown option
router.post("/stay-dropdowns", async (req, res) => {
    try {
        const { category, value, createdBy } = req.body;

        if (!category || !STAY_DROPDOWN_CATEGORIES.includes(category)) {
            return res.status(400).json({ success: false, message: "Invalid category" });
        }
        if (!value || !String(value).trim()) {
            return res.status(400).json({ success: false, message: "Option value is required" });
        }
        // Total Rooms must stay numeric (the listing stores it as a number)
        if (category === "totalRooms" && !/^[0-9]+$/.test(String(value).trim())) {
            return res.status(400).json({ success: false, message: "Total Rooms option must be a number" });
        }

        const option = await StayDropdown.create({
            category,
            value: String(value).trim(),
            createdBy: createdBy || "Admin"
        });

        res.status(201).json({ success: true, message: "Option added", data: option });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "This option already exists" });
        }
        console.error("Error adding stay dropdown option:", error);
        res.status(500).json({ success: false, message: error.message || "Error adding option" });
    }
});

// DELETE a custom dropdown option
router.delete("/stay-dropdowns/:id", async (req, res) => {
    try {
        const deleted = await StayDropdown.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Option not found" });
        }
        res.status(200).json({ success: true, message: "Option removed", data: deleted });
    } catch (error) {
        console.error("Error removing stay dropdown option:", error);
        res.status(500).json({ success: false, message: error.message || "Error removing option" });
    }
});

// ───────────────────────── Stay view tracking (unique per device) ─────────────────────────

// Record a unique-per-device interaction with a stay.
//  body: { propertyId, deviceId, type: "detail" | "contact" }
router.post("/stay-view", async (req, res) => {
    try {
        const { propertyId, deviceId, type, viewerPhoneNumber } = req.body;

        if (!propertyId || !deviceId || !["detail", "contact"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "propertyId, deviceId and a valid type ('detail' or 'contact') are required"
            });
        }

        // Best-effort link to the stay's _id so the log can reference it
        const stay = await WhiteTown.findOne({ propertyId }).select("_id").lean();

        const setOnInsert = { ...(stay ? { property: stay._id } : {}) };
        const set = { lastViewedAt: new Date() };
        // Capture / refresh the viewer's phone whenever we have one
        if (viewerPhoneNumber) set.viewerPhoneNumber = viewerPhoneNumber;

        await StayView.updateOne(
            { propertyId, deviceId, type },
            {
                ...(Object.keys(setOnInsert).length ? { $setOnInsert: setOnInsert } : {}),
                $set: set,
                $inc: { count: 1 }
            },
            { upsert: true }
        );

        res.status(200).json({ success: true });
    } catch (error) {
        // Duplicate key during a race just means this device already counted
        if (error && error.code === 11000) {
            return res.status(200).json({ success: true });
        }
        console.error("Error recording stay view:", error);
        res.status(500).json({ success: false, message: error.message || "Error recording view" });
    }
});

// User: stats for the stays a given person posted (matched by the stay's contact
// phone). Returns each of their stays with unique detail / contact viewer counts
// and the list of viewer numbers — powers the hamburger panel on the stay list.
router.get("/my-stay-stats", async (req, res) => {
    try {
        const phone = String(req.query.phone || "").replace(/\D/g, "").slice(-10);

        if (phone.length < 10) {
            return res.status(200).json({ success: true, data: [] });
        }

        const stays = await WhiteTown.find({ phoneNumber: phone })
            .select("propertyId stayName phoneNumber createdAt")
            .sort({ createdAt: -1 })
            .lean();

        if (stays.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        const propIds = stays.map(s => s.propertyId);
        const views = await StayView.find({ propertyId: { $in: propIds } })
            .select("propertyId type viewerPhoneNumber lastViewedAt")
            .sort({ lastViewedAt: -1 })
            .lean();

        const map = {};
        propIds.forEach(pid => { map[pid] = { detail: [], contact: [] }; });
        views.forEach(v => {
            // Skip the owner viewing their own stay (viewer == this owner's number)
            if (v.viewerPhoneNumber && v.viewerPhoneNumber === phone) return;
            if (map[v.propertyId] && map[v.propertyId][v.type]) {
                map[v.propertyId][v.type].push({
                    viewerPhoneNumber: v.viewerPhoneNumber || "",
                    viewedAt: v.lastViewedAt
                });
            }
        });

        const data = stays.map(s => ({
            propertyId: s.propertyId,
            stayName: s.stayName,
            phoneNumber: s.phoneNumber,
            createdAt: s.createdAt,
            detailViewers: map[s.propertyId].detail.length,
            contactViewers: map[s.propertyId].contact.length,
            detailViewerList: map[s.propertyId].detail,
            contactViewerList: map[s.propertyId].contact
        }));

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error fetching my stay stats:", error);
        res.status(500).json({ success: false, message: error.message || "Error fetching stats" });
    }
});

// Admin: "Tourist Property Log" — an activity feed of who engaged with each stay.
// Returns two lists: one row per unique visitor who opened a stay's detail page,
// and one row per unique visitor who tapped its "View Contact" button.
router.get("/stay-view-log", async (req, res) => {
    try {
        const views = await StayView.find()
            .sort({ lastViewedAt: -1 })
            .lean();

        if (views.length === 0) {
            return res.status(200).json({ success: true, detail: [], contact: [] });
        }

        // Resolve stay name + phone for the involved properties
        const propIds = [...new Set(views.map(v => v.propertyId))];
        const stays = await WhiteTown.find({ propertyId: { $in: propIds } })
            .select("propertyId stayName phoneNumber")
            .lean();

        const stayMap = {};
        stays.forEach(s => { stayMap[s.propertyId] = s; });

        const toRow = (v) => {
            const s = stayMap[v.propertyId] || {};
            return {
                _id: v._id,
                propertyId: v.propertyId,
                stayName: s.stayName || "—",
                stayPhoneNumber: s.phoneNumber || "—",
                viewerPhoneNumber: v.viewerPhoneNumber || "",
                viewedAt: v.lastViewedAt || v.createdAt
            };
        };

        // Exclude the owner viewing their own stay (viewer number == stay's contact)
        const isOwnerSelfView = (v) => {
            const s = stayMap[v.propertyId];
            return s && v.viewerPhoneNumber && v.viewerPhoneNumber === s.phoneNumber;
        };

        const visible = views.filter(v => !isOwnerSelfView(v));
        const detail = visible.filter(v => v.type === "detail").map(toRow);
        const contact = visible.filter(v => v.type === "contact").map(toRow);

        res.status(200).json({ success: true, detail, contact });
    } catch (error) {
        console.error("Error fetching stay view log:", error);
        res.status(500).json({ success: false, message: error.message || "Error fetching log" });
    }
});

module.exports = router;
