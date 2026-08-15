# Web → Flutter pixel-faithful recreation specs

Captured from the React source so the Flutter screens can match the web 1:1.
Shared shell across all three: centered column **max-width 500px** (450 for
Tenant Assistance), font **Inter**, sticky header **#EFEFEF** with a
`FaChevronLeft` back button (icon **#4F4B7E**, button tint **#CDC9F9**) + an
`<h3>` title (15–18px). Primary purple **#4F4B7E**, hover **#CDC9F9**.
Input "cards": white, shadow `0 4px 10px rgba(38,104,190,0.1)`, left icon box
`padding:0 14px` with `borderRight:1px solid #4F4B7E`, input `padding:12px`,
`fontSize:14px`, grey text; green `GoCheckCircleFill` (Icons.check_circle,
#4CAF50) once filled; red `*` for required. Dropdowns = a button that opens a
full-screen picker modal (white card maxWidth 300, radius 18, search box
bg #EEF4FA rounded 25, options list with #D0D7DE dividers).

## 1. Property Detail — DONE (`property_detail_screen.dart`)
Source: `Rent_Pondy User/src/Components/Details.jsx` active render @6549. Built:
header, Swiper (200px, #4F4B7E ❮❯ 60×30 chips, counter), Rent_Id badge, mode |
type, price (#FF5722) + Negotiable, price-in-words (#8B99A9), Make-an-offer
form, sectioned overview grid, points-gated contact reveal, actions.

## 2. Add Property (`add_property_screen.dart`) — TODO
Source: `Components/AddProperty.jsx`, active render @3142. **Progressive-reveal
wizard** (currentStep 1..5; each step appended BELOW previous — long scroll; NO
stepper). Title `<h3>ADD PROPERTY</h3>`. Advance via a **"Swipe To Save &
Continue"** slider (width 80%, height 50, radius 50, knob 40×40 #4F4B7E with
white FaArrowRight; gradient `#CDC9F9→rgb(162,154,249)` when swiped). After
step5 → "Pre View" button (#4F4B7E). Section headers `<h4>` #4F4B7E bold.

Top (always): `<h4>Property Management` (rgb(10,10,10)); RENT-ID banner (p-3,
#fff on #4F4B7E); `<h3>Property Images` (#4F4B7E 24px) + multi file picker with
radio "primary photo"; `<h4>Property Video` + file picker.

- **Step1 "Property OverView"**: propertyMode*, propertyType*, rentType*,
  negotiation, rentalAmount* (number, price-in-words below; `callForRent`
  checkbox → disables amount, stores 0), securityDeposit (number), totalArea*
  (number), areaUnit*.
- **Step2 "Basic Property Info"** (all dropdowns): bedrooms*, floorNo, kitchen,
  balconies, attachedBathrooms, western, carParking, lift, furnished, facing,
  wheelChairAvailable, propertyAge, postedBy*, availableDate*.
- **Step3**: `<h4>Property Description` → description textarea (max 200);
  `<h4>Tenant Preferences` → familyMembers, foodHabit, jobType, petAllowed.
- **Step4 "Property Address"**: "Use Current Location" btn; map (200px, can stub
  a placeholder); lat/lng input; country(India), state(dropdown), district
  (dropdown), city(text), area(autosuggest→pincode), nagar, streetName,
  doorNumber, pinCode, locationCoordinates. Required: state,district,city,area,pinCode.
- **Step5 "Owner Details"**: ownerName, email, phoneNumber(+91 select),
  alternatePhone(+91), bestTimeToCall(dropdown).
- Land/Plot/Agri hide: bedrooms,floorNo,kitchen,balconies,attachedBathrooms,
  western,carParking,lift,furnished,wheelChairAvailable,familyMembers,foodHabit,
  jobType,petAllowed,doorNumber.
- **Preview** step: Swiper + price (FaRupeeSign, #4F4B7E bold 26) + detail rows +
  EDIT (outline #1882F6, radius 25) / Submit (gradient #4a90e2→#007bff).

**Endpoints**: mount → POST `/store-data-rent {phoneNumber}`→rentId; GET
`/fetch`→dropdown options grouped by `field`. Each step swipe → POST
`/update-rent-property` **multipart** (rentId + all formData + photos + video,
onUploadProgress bar). Preview Submit → same multipart, then `step='submitted'`
→ show PricingPlans. Flutter API already has `reserveRentId`, `fetchFieldConfig`,
`submitProperty` — reuse/extend.

Errors modal: overlay `rgba(0,0,0,.5)`, white card radius 12, `border:2px solid
#dc3545`, red Close. Upload overlay: white card, progress track #e0e0e0 8px.

## 3. Tenant Assistance (`tenant_assistance_screen.dart`) — TODO
Source: `Components/BuyerAssistance.jsx`, active 1–3470, main render @1155.
**Single long scrolling form** (NOT a wizard). Column max-width **450px**.
Header `<h3>RENTAL ASSIATANT</h3>` (sic, keep exact) 18px. Then full-width hero
image `tenant_assist.png`; two buttons row ("Add Tenant list" disabled 0.6 /
"view Tenant List" → /Buyer-List-Filter); `<h4>Rent Budget` (#4F4B7E 15 bold);
success alert (green); **"Required Fields (n/11)" card** (bg #F8F9FF, border 2px
#4F4B7E, radius 10): 2-col grid of ✓(#4CAF50)/✕(#d32f2f)+label for State,
Property Type, Property Mode, Min Amount, Max Amount, Phone, Rent Type,
Bedrooms, Floor No, Area, Pin Code.

Fields in order: minPrice* & maxPrice* (dropdowns, 2-col row, inline red error
box if min>max), tenantName, phoneNumber* (readOnly, +91 + green check),
alternatePhone(+91 editable), propertyMode*, propertyType*, rentType*,
bedrooms*, facing, totalArea, areaUnit, floorNo*, requirementType, state*
(Puducherry sorted top), city(autocomplete GET /cities?search=), area*
(autocomplete GET /areas?search=, selecting fills pinCode), pinCode*;
`<h6>Description` → description textarea (max200, char counter n/200);
`<h6>My Family Info` → familyMembers, foodHabit, jobType, petAllowed.
Section headers `<h6>` #4F4B7E bold. Submit btn full-width #4F4B7E, label
"ADD PROPERTY ASSISTANCE" (or "UPDATE …" when editing).

Dropdown options: GET `/fetch-rent-excel` (rows {field,value}). Confirm modal
"Do you want to create this Rental Assistance request?" Yes(#6CBAAF)/No(#ccc).
Submit → POST `/add-buyerAssistance-rent` (whole formData) [or PUT
`/update-buyerAssistance-rent/{_id}`]; then payment modal → /buyer-plan or
/buyer-assis-buyer. Flutter API already has `submitTenantAssistance`,
`fetchCities`, `fetchAreas` — reuse/extend.

Modals share: overlay `rgba(0,0,0,.7)`, white card padding 32, radius 12,
maxWidth 400, textAlign center. Validation modal "⚠️ Please fill mandatory
fields" (#4F4B7E) + red bullet list. Price modal "⚠️ Invalid Price Range".

Extra colors: #F8F9FF (req card), #EEF4FA (search), #0B57CF (picker accents),
#6CBAAF (confirm yes), #d32f2f (errors), #EFEFEF (header).
