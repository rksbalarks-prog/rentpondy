import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Build a printable PDF of a stay (from the Add/Edit Stay form data).
// `mode`: 'print' opens the browser print dialog; 'download' saves the file.

const val = (v) => (v === undefined || v === null || v === '' ? '-' : String(v));

const priceRange = (f) => {
    if (f.priceMin && f.priceMax) return `Rs.${f.priceMin} - Rs.${f.priceMax}`;
    if (f.priceMin) return `Rs.${f.priceMin}`;
    if (f.priceMax) return `Rs.${f.priceMax}`;
    if (f.pricePerNight) return `Rs.${f.pricePerNight}`;
    return '-';
};

const addSection = (doc, title, rows, startY) => {
    let y = startY;
    if (y > 255) { doc.addPage(); y = 20; }
    doc.setFontSize(12);
    doc.setFont('helvetica','bold');
    doc.setTextColor(40, 40, 40);
    doc.text(title, 14, y);
    autoTable(doc, {
        startY: y + 2,
        body: rows,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3, valign: 'top', overflow: 'linebreak' },
        columnStyles: {
            0: { cellWidth: 55, fontStyle: 'bold', fillColor: [243, 244, 246] },
            1: { cellWidth: 121 }
        },
        margin: { left: 14, right: 14 }
    });
    return doc.lastAutoTable.finalY + 8;
};

export const generateStayPDF = (data = {}, mode = 'print') => {
    const { formData: f = {}, amenities = [], roomTypes = [] } = data;
    const doc = new jsPDF('p', 'mm', 'a4');

    // Header banner
    doc.setFillColor(139, 195, 74);
    doc.rect(0, 0, 210, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica','bold');
    doc.text('RENT PONDY  -  Place To Stay', 14, 13);
    doc.setFontSize(10);
    doc.setFont('helvetica','normal');
    doc.text('Stay Listing Details', 14, 19);

    let y = 30;

    y = addSection(doc, 'Basic Details', [
        ['Created By', val(f.createdBy)],
        ['Stay Name', val(f.stayName)],
        ['Website', val(f.websiteLink)],
        ['Stay Type', val(f.stayType)],
        ['Star Rating', f.starRating ? `${f.starRating} Star` : '-'],
        ['Description', val(f.description)]
    ], y);

    y = addSection(doc, 'Pricing & Tariff (per night)', [
        ['Price / Night', priceRange(f)],
        ['Weekend Price', f.weekendPrice ? `Rs.${f.weekendPrice}` : '-'],
        ['Extra Guest Charge', f.extraGuestCharge ? `Rs.${f.extraGuestCharge}` : '-'],
        ['Tax', val(f.taxType)],
        ['Meal Plan', val(f.mealPlan)]
    ], y);

    y = addSection(doc, 'Location', [
        ['Street / Address', val(f.streetName)],
        ['Location / Area', val(f.location)],
        ['City', val(f.city)],
        ['Landmark', val(f.landmark)],
        ['Pincode', val(f.pincode)],
        ['Google Map URL', val(f.url)]
    ], y);

    y = addSection(doc, 'Rooms & Capacity', [
        ['Room Types', roomTypes.length ? roomTypes.join(', ') : '-'],
        ['Total Rooms', val(f.totalRooms)],
        ['Max Guests', val(f.maxGuests)],
        ['Bedrooms', val(f.bedrooms)],
        ['Bathrooms', val(f.bathrooms)],
        ['Check-in Time', val(f.checkInTime)],
        ['Check-out Time', val(f.checkOutTime)]
    ], y);

    y = addSection(doc, 'Features & Amenities', [
        ['Swimming Pool', val(f.swimmingPool)],
        ['Car Park', val(f.carPark)],
        ['Beach View', val(f.beachView)],
        ['Amenities', amenities.length ? amenities.join(', ') : '-']
    ], y);

    y = addSection(doc, 'Policies & Highlights', [
        ['Cancellation Policy', val(f.cancellationPolicy)],
        ['Couple Friendly', f.coupleFriendly ? 'Yes' : 'No'],
        ['House Rules', val(f.houseRules)],
        ['Nearby Attractions', val(f.nearbyAttractions)]
    ], y);

    y = addSection(doc, 'Contact', [
        ['Phone Number', val(f.phoneNumber)],
        ['Alternate Number', val(f.alternateNumber)],
        ['WhatsApp Number', val(f.whatsappNumber)]
    ], y);

    const fileName = `Stay-${(f.stayName || 'Details').replace(/[^a-z0-9]+/gi, '-')}.pdf`;

    if (mode === 'download') {
        doc.save(fileName);
        return;
    }

    // Print: open in a new tab with the print dialog; fall back to download if blocked
    try {
        doc.autoPrint();
        const url = doc.output('bloburl');
        const win = window.open(url, '_blank');
        if (!win) doc.save(fileName);
    } catch (err) {
        doc.save(fileName);
    }
};

// ───────────────────── Blank (fill-by-hand) form PDF ─────────────────────

const PAGE_W = 210;            // A4 portrait width (mm)
const FM = 14;                 // left margin
const FR = PAGE_W - 14;        // right edge
const BOX = '[   ]';           // tick box for handwriting

const DEF_STAY_TYPES = [
    "Guest House", "Resort", "Homestay", "Hotel", "Villa",
    "Cottage", "Service Apartment", "Beach House", "Farm Stay", "Boutique Stay"
];
const DEF_ROOM_TYPES = [
    "Standard Room", "Deluxe Room", "Super Deluxe", "AC Room", "Non-AC Room",
    "Suite", "Family Room", "Dormitory", "Cottage", "Tent"
];
const DEF_AMENITIES = [
    "Free WiFi", "Air Conditioning", "Restaurant", "Room Service", "Power Backup",
    "Hot Water", "Television", "Breakfast", "Pet Friendly", "Beach Access",
    "Garden / Lawn", "Bar / Lounge", "Spa", "Gym", "Laundry", "Airport Pickup",
    "CCTV Security", "Elevator", "Kitchen", "Bonfire", "Wheelchair Access"
];
const DEF_MEAL_PLANS = ["Room Only", "Breakfast Included", "Breakfast + Dinner", "All Meals Included"];
const DEF_CANCELLATION = ["Free Cancellation", "Partial Refund", "Non-Refundable"];

const ensureSpace = (doc, y, need) => (y + need > 286 ? (doc.addPage(), 20) : y);

const fSectionTitle = (doc, title, y) => {
    y = ensureSpace(doc, y, 13);
    doc.setFillColor(139, 195, 74);
    doc.rect(FM, y, FR - FM, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(title, FM + 2, y + 5);
    doc.setTextColor(30, 30, 30);
    return y + 11;
};

const fLine = (doc, label, y, labelW = 42) => {
    y = ensureSpace(doc, y, 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(label, FM, y);
    doc.setDrawColor(160);
    doc.setLineWidth(0.2);
    doc.line(FM + labelW, y + 0.5, FR, y + 0.5);
    return y + 8;
};

const fTwoLines = (doc, l1, l2, y) => {
    y = ensureSpace(doc, y, 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    const half = (FR - FM) / 2;
    doc.setDrawColor(160);
    doc.setLineWidth(0.2);
    doc.text(l1, FM, y);
    doc.line(FM + 32, y + 0.5, FM + half - 4, y + 0.5);
    doc.text(l2, FM + half, y);
    doc.line(FM + half + 32, y + 0.5, FR, y + 0.5);
    return y + 8;
};

const fCheckboxes = (doc, label, opts, y) => {
    y = ensureSpace(doc, y, 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(label, FM, y);
    let x = FM + 42;
    doc.setFont('helvetica', 'normal');
    opts.forEach((opt) => {
        const token = `${BOX} ${opt}`;
        const w = doc.getTextWidth(token) + 5;
        if (x + w > FR) { y = ensureSpace(doc, y + 7, 0); x = FM + 42; }
        doc.text(token, x, y);
        x += w;
    });
    return y + 8;
};

const fTextArea = (doc, label, y, lines = 2) => {
    y = ensureSpace(doc, y, 6 + lines * 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(label, FM, y);
    y += 5;
    doc.setDrawColor(160);
    doc.setLineWidth(0.2);
    for (let i = 0; i < lines; i++) { doc.line(FM, y, FR, y); y += 6; }
    return y + 1;
};

const fChecklist = (doc, label, items, y, cols = 3) => {
    y = ensureSpace(doc, y, 11);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(label, FM, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const colW = (FR - FM) / cols;
    items.forEach((it, i) => {
        const col = i % cols;
        if (col === 0) y = ensureSpace(doc, y, 6);
        doc.text(`${BOX} ${it}`, FM + col * colW, y);
        if (col === cols - 1) y += 6;
    });
    if (items.length % cols !== 0) y += 6;
    return y + 1;
};

// Generate a blank Add-Stay form (to print and fill in by hand).
export const generateBlankStayFormPDF = (options = {}, mode = 'download') => {
    const stayTypes = options.stayTypes && options.stayTypes.length ? options.stayTypes : DEF_STAY_TYPES;
    const roomTypes = options.roomTypes && options.roomTypes.length ? options.roomTypes : DEF_ROOM_TYPES;
    const amenities = options.amenities && options.amenities.length ? options.amenities : DEF_AMENITIES;
    const mealPlans = options.mealPlans && options.mealPlans.length ? options.mealPlans : DEF_MEAL_PLANS;
    const cancellations = options.cancellations && options.cancellations.length ? options.cancellations : DEF_CANCELLATION;

    const doc = new jsPDF('p', 'mm', 'a4');

    // Header
    doc.setFillColor(139, 195, 74);
    doc.rect(0, 0, PAGE_W, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RENT PONDY  -  Add New Stay Form', FM, 8);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Please fill in the details below in CAPITAL letters and tick the boxes.', FM, 13);

    let y = 22;
    y = fTwoLines(doc, 'Date', 'Created By', y);

    y = fSectionTitle(doc, 'Basic Details', y);
    y = fLine(doc, 'Stay Name', y);
    y = fLine(doc, 'Website Link', y);
    y = fCheckboxes(doc, 'Stay Type', stayTypes, y);
    y = fCheckboxes(doc, 'Star Rating', ['1', '2', '3', '4', '5'], y);
    y = fTextArea(doc, 'Description / About the Stay', y, 2);

    y = fSectionTitle(doc, 'Pricing & Tariff (per night)', y);
    y = fTwoLines(doc, 'Price/Night Min (Rs.)', 'Price/Night Max (Rs.)', y);
    y = fTwoLines(doc, 'Weekend Price (Rs.)', 'Extra Guest (Rs.)', y);
    y = fCheckboxes(doc, 'Tax', ['Tax Included', 'Tax Excluded'], y);
    y = fCheckboxes(doc, 'Meal Plan', mealPlans, y);

    y = fSectionTitle(doc, 'Location', y);
    y = fLine(doc, 'Street / Address', y);
    y = fLine(doc, 'Location / Area', y);
    y = fTwoLines(doc, 'City', 'Pincode', y);
    y = fLine(doc, 'Landmark', y);
    y = fLine(doc, 'Google Map URL', y);

    y = fSectionTitle(doc, 'Rooms & Capacity', y);
    y = fTwoLines(doc, 'Total Rooms', 'Max Guests', y);
    y = fTwoLines(doc, 'Bedrooms', 'Bathrooms', y);
    y = fTwoLines(doc, 'Check-in Time', 'Check-out Time', y);
    y = fChecklist(doc, 'Room Types Available', roomTypes, y, 3);

    y = fSectionTitle(doc, 'Features & Amenities', y);
    y = fCheckboxes(doc, 'Swimming Pool', ['Yes', 'No'], y);
    y = fCheckboxes(doc, 'Car Park', ['Yes', 'No'], y);
    y = fCheckboxes(doc, 'Beach View', ['Yes', 'No'], y);
    y = fChecklist(doc, 'Amenities', amenities, y, 3);

    y = fSectionTitle(doc, 'Policies & Highlights', y);
    y = fCheckboxes(doc, 'Cancellation Policy', cancellations, y);
    y = fCheckboxes(doc, 'Couple Friendly', ['Yes', 'No'], y);
    y = fTextArea(doc, 'House Rules', y, 2);
    y = fTextArea(doc, 'Nearby Attractions', y, 2);

    y = fSectionTitle(doc, 'Contact', y);
    y = fTwoLines(doc, 'Phone Number', 'Alternate Number', y);
    y = fLine(doc, 'WhatsApp Number', y);

    const fileName = 'Stay-Add-Form-Blank.pdf';
    if (mode === 'print') {
        try {
            doc.autoPrint();
            const url = doc.output('bloburl');
            const win = window.open(url, '_blank');
            if (!win) doc.save(fileName);
        } catch (err) {
            doc.save(fileName);
        }
        return;
    }
    doc.save(fileName);
};
