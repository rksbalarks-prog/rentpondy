








import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { FaEye, FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { getFirstPhotoUrl, DEFAULT_IMAGE } from './utils/mediaHelper';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import PhoneCell from './components/PhoneCell';
import useAdminNames from './hooks/useAdminNames';

// Filters are persisted in sessionStorage so navigating to a detail
// page and back preserves the user's current search/filter context.
// Cleared by the page's Reset button.
const APPROVED_FILTERS_KEY = 'approvedCar:filters';
const loadSavedFilters = () => {
  try {
    const raw = sessionStorage.getItem(APPROVED_FILTERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

const ApprovedCar = () => {
  const savedFilters = loadSavedFilters();

  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [rentIdSearch, setrentIdSearch] = useState(savedFilters.rentIdSearch || '');
  const [startDate, setStartDate] = useState(savedFilters.startDate || '');
  const [endDate, setEndDate] = useState(savedFilters.endDate || '');
  const [monthFilter, setMonthFilter] = useState(savedFilters.monthFilter || ''); // 'YYYY-MM'
  const [statusProperties, setStatusProperties] = useState({});
  // Bulk "Mark as Expired" selection (Approved rows ticked via checkboxes)
  const [selectedRentIds, setSelectedRentIds] = useState([]);
  const [showExpireModal, setShowExpireModal] = useState(false);
  const [expiring, setExpiring] = useState(false);
  // Yearly dashboard (month-wise property counts)
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardYear, setDashboardYear] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentrentId, setCurrentrentId] = useState('');
  const [, setCurrentPhoneNumber] = useState('');
  const [deletionReason, setDeletionReason] = useState('');
  const [phoneNumberSearch, setPhoneNumberSearch] = useState(savedFilters.phoneNumberSearch || '');
  const [pincodeFilter, setPincodeFilter] = useState(savedFilters.pincodeFilter || '');
  const [showMoveToModal, setShowMoveToModal] = useState(false);
  const [selectedPropertyForMove, setSelectedPropertyForMove] = useState(null);
  const [featureStatusFilter, setFeatureStatusFilter] = useState(savedFilters.featureStatusFilter || '');
  const [sortOption, setSortOption] = useState(savedFilters.sortOption || '');
  const [hasLocation, setHasLocation] = useState(savedFilters.hasLocation || '');
  const [hasPhoto, setHasPhoto] = useState(savedFilters.hasPhoto || '');
  const [notViewed, setNotViewed] = useState(savedFilters.notViewed || false);
  const [bankLoan, setBankLoan] = useState(savedFilters.bankLoan || '');
  const [priceFilter, setPriceFilter] = useState(savedFilters.priceFilter || '');
  const [minPrice, setMinPrice] = useState(savedFilters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(savedFilters.maxPrice || '');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState(savedFilters.propertyTypeFilter || '');
  const [propertyModeFilter, setPropertyModeFilter] = useState(savedFilters.propertyModeFilter || '');
  const [baseFilter, setBaseFilter] = useState(savedFilters.baseFilter || '');
  const [furnishedFilter, setFurnishedFilter] = useState(savedFilters.furnishedFilter || '');
  const [floorFilter, setFloorFilter] = useState(savedFilters.floorFilter || '');
  const [billTypeFilter, setBillTypeFilter] = useState(savedFilters.billTypeFilter || '');
  const [otpStatusFilter, setOtpStatusFilter] = useState(savedFilters.otpStatusFilter || '');
  const [planTypeFilter, setPlanTypeFilter] = useState(savedFilters.planTypeFilter || '');
  const [rentTypeFilter, setRentTypeFilter] = useState(savedFilters.rentTypeFilter || '');
  const [approvedByFilter, setApprovedByFilter] = useState(savedFilters.approvedByFilter || '');
  const [billMap, setBillMap] = useState({});
  const [remarkInputs, setRemarkInputs] = useState({});
  const [savingRemark, setSavingRemark] = useState({});

  // Staff names for the "Approved By" filter — sourced from the same staff list
  // as the Create Staff – List (/users) page via GET /admin-all.
  const { names: approvedByOptions } = useAdminNames();

  const handleRemarkInputChange = (rentId, value) => {
    setRemarkInputs(prev => ({ ...prev, [rentId]: value }));
  };

  const handleSaveRemark = async (rentId) => {
    const text = (remarkInputs[rentId] || '').trim();
    if (!text) return;
    setSavingRemark(prev => ({ ...prev, [rentId]: true }));
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/add-rent-remark`,
        {
          rentId,
          text,
          adminName: adminName || 'Admin',
        }
      );
      const updatedRemarks = res.data?.remarks || [];

      setProperties(prev => prev.map(p =>
        p.rentId === rentId ? { ...p, remarks: updatedRemarks } : p
      ));
      setFiltered(prev => prev.map(p =>
        p.rentId === rentId ? { ...p, remarks: updatedRemarks } : p
      ));

      setRemarkInputs(prev => ({ ...prev, [rentId]: '' }));
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving remark');
    } finally {
      setSavingRemark(prev => ({ ...prev, [rentId]: false }));
    }
  };



const navigate = useNavigate();
  
  // Fetch bills and create a map of rentId -> bill data
  const fetchBills = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/bills`);
      const map = {};

      if (res.data.data && Array.isArray(res.data.data)) {
        res.data.data.forEach(bill => {
          // Only add to map if not already exists (first one wins)
          if (!map[bill.rentId]) {
            map[bill.rentId] = {
              billNo: bill.billNo || '',
              createdAt: bill.createdAt || bill.billDate || '',
              validity: bill.validity || '',
              billExpiryDate: bill.billExpiryDate || '',
              adminName: bill.adminName || bill.billCreatedBy || ''
            };
          }
        });
      }

      setBillMap(map);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };
  
  useEffect(() => {
    const fetchPendingProperties = async () => {
      try {
        // Fetch main approved properties
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-active-users-datas-all-rent`);
        
        // Fetch free and paid plans to create a mapping
        const freeRes = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-free-plans`);
        const paidRes = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-all-paid-plans`);
        
        // Fetch follow-up data to map admin names correctly
        const followUpRes = await axios.get(`${process.env.REACT_APP_API_URL}/followup-list`);
        
        // Fetch paid payment data for N/A entries validation
        const paymentsRes = await axios.get(`${process.env.REACT_APP_API_URL}/payments/paid`);
        
        // Create a map of rentId -> follow-up admin name
        const followUpAdminMap = {};
        if (followUpRes.data.data && Array.isArray(followUpRes.data.data)) {
          followUpRes.data.data.forEach(followUp => {
            followUpAdminMap[followUp.rentId] = followUp.adminName;
          });
        }
        
        // Create a map of rentId -> successful payment status
        const paidPaymentMap = {};
        if (paymentsRes.data && paymentsRes.data.payments && Array.isArray(paymentsRes.data.payments)) {
          paymentsRes.data.payments.forEach(payment => {
            if (payment.status === 'success' && payment.rentId) {
              paidPaymentMap[payment.rentId] = true;
            }
          });
        }
        
        // Create a map of rentId -> plan type
        const planTypeMap = {};
        
        // Map free properties
        if (freeRes.data.data && Array.isArray(freeRes.data.data)) {
          freeRes.data.data.forEach(item => {
            if (item.properties && Array.isArray(item.properties)) {
              item.properties.forEach(prop => {
                planTypeMap[prop.rentId] = 'Free';
              });
            }
          });
        }
        
        // Map paid properties
        if (paidRes.data.data && Array.isArray(paidRes.data.data)) {
          paidRes.data.data.forEach(item => {
            if (item.properties && Array.isArray(item.properties)) {
              item.properties.forEach(prop => {
                planTypeMap[prop.rentId] = 'Paid';
              });
            }
          });
        }
        
        // Update properties with correct plan names and follow-up admin names
        const sortedUsers = res.data.users
          .map(prop => {
            // For N/A entries (not in free/paid plans), check if there's a successful payment
            let planName = planTypeMap[prop.rentId];
            if (!planName && paidPaymentMap[prop.rentId]) {
              planName = 'Paid';
            } else if (!planName) {
              planName = 'Free';
            }
            
            return {
              ...prop,
              planName: planName,
              followUpAdminName: followUpAdminMap[prop.rentId] || 'N/A'
            };
          })
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setProperties(sortedUsers);
        setFiltered(sortedUsers);
        
        const statusMap = {};
        sortedUsers.forEach(prop => {
          statusMap[prop.rentId] = prop.isDeleted ? 'delete' : 'active';
        });
        setStatusProperties(statusMap);
        
      } catch (err) {
        console.error('Error fetching properties:', err);
      }
    };
    fetchPendingProperties();
  }, []);

  // Fetch bills after properties are loaded
  useEffect(() => {
    if (properties && properties.length > 0) {
      fetchBills();
    }
  }, [properties]);

      const tableRef = useRef();
    
    const handlePrintt = () => {
      const printContent = tableRef.current.innerHTML;
      const printWindow = window.open("", "", "width=1200,height=800");
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Table</title>
            <style>
              table { border-collapse: collapse; width: 100%; font-size: 12px; }
              th, td { border: 1px solid #000; padding: 6px; text-align: left; }
              th { background: #f0f0f0; }
            </style>
          </head>
          <body>
            <table>${printContent}</table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    };

    const handleExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(
        filtered.map((property, idx) => {
          const bill = billMap[property.rentId];
          
          // Get bill date - first from billMap, then from property itself
          let billDate = '-';
          if (bill && bill.createdAt) {
            billDate = new Date(bill.createdAt).toLocaleDateString();
          } else if (property.billDate) {
            billDate = new Date(property.billDate).toLocaleDateString();
          }
          
          // Get bill expiry date - first from billMap calculation, then from property
          let billExpiryDate = '-';
          if (bill && bill.createdAt && bill.validity) {
            billExpiryDate = calculateBillExpiryDate(bill.createdAt, bill.validity);
          } else if (bill && bill.billExpiryDate) {
            billExpiryDate = bill.billExpiryDate;
          } else if (property.billExpiryDate) {
            billExpiryDate = property.billExpiryDate;
          }
          
          return {
            'S.No': idx + 1,
            'Rent ID': property.rentId,
            'Phone Number': property.phoneNumber,
            'Property Type': property.propertyType,
            'Property Mode': property.propertyMode,
            'Rent Type': property.rentType || 'N/A',
            'Rental Amount': property.callForRent ? 'Call Owner' : property.rentalAmount,
            'City': property.city,
            'Area': property.area || 'N/A',
            'Pincode': property.pinCode || 'N/A',
            'Plan Name': property.planName || 'N/A',
            'Bill Date': billDate,
            'Validity (days)': (bill && bill.validity) ? bill.validity : (property.validity || '-'),
            'Bill Expiry Date': billExpiryDate,
            'Approved Date': (bill && bill.createdAt) ? new Date(bill.createdAt).toLocaleDateString() : '-',
            'Added By': property.addedBy || '-',
            'Approved By': (bill && bill.adminName) ? bill.adminName : '-',
            'Status': statusProperties[property.rentId] || property.status,
            'Created At': moment(property.createdAt).format('YYYY-MM-DD')
          };
        })
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'ApprovedProperties');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, `ApprovedProperties_${new Date().toISOString().slice(0,10)}.xlsx`);
    };

  // Helper functions for property count
  const getTotalMatchedPropertiesCount = () => {
    return properties.length;
  };

  const getFilteredMatchedPropertiesCount = () => {
    return filtered.length;
  };

  // Helper function to calculate bill expiry date
  const calculateBillExpiryDate = (billDate, validityDays) => {
    try {
      // Validate inputs
      if (!billDate || !validityDays) {
        return '-';
      }

      // Convert to number
      const days = Number(validityDays);
      if (isNaN(days) || days <= 0) {
        return '-';
      }

      // Create date object from bill date
      const expiryDate = new Date(billDate);
      
      // Check if date is valid
      if (isNaN(expiryDate.getTime())) {
        return '-';
      }

      // Add validity days
      expiryDate.setDate(expiryDate.getDate() + days);

      // Format and return
      return expiryDate.toLocaleDateString();
    } catch (error) {
      console.error('Error calculating bill expiry date:', error);
      return '-';
    }
  };

  // Helper function to determine bill type
  const getBillType = (rentId) => {
    if (billMap[rentId]) {
      return 'Office Bill';
    }
    return 'Online Bill';
  };

  // Search and filter functionality
const handleSearch = () => {
  let result = [...properties];

  // Rent ID filter
  if (rentIdSearch.trim()) {
    const query = rentIdSearch.trim().toLowerCase();
    result = result.filter((prop) =>
      String(prop.rentId || '').toLowerCase().includes(query)
    );
  }

  // Phone number filter — match either the original owner number or the masked/assigned number
  if (phoneNumberSearch.trim()) {
    const query = phoneNumberSearch.trim().toLowerCase();
    result = result.filter((prop) =>
      String(prop.phoneNumber || '').toLowerCase().includes(query) ||
      String(prop.assignedPhoneNumber || '').toLowerCase().includes(query)
    );
  }

  // Pincode filter
  if (pincodeFilter.trim()) {
    const query = pincodeFilter.trim();
    result = result.filter((prop) => {
      const propPincode = prop.pinCode || prop.pincode || prop.postalCode;
      return String(propPincode || '').includes(query);
    });
  }

  // Date filter
  result = result.filter((prop) => {
    const createdDate = new Date(prop.createdAt).toISOString().split("T")[0];
    const matchStart = !startDate || createdDate >= startDate;
    const matchEnd = !endDate || createdDate <= endDate;
    return matchStart && matchEnd;
  });

  // Month filter (YYYY-MM) — matches the property's Created date month.
  // Kept consistent with the date range filter above (both use createdAt in UTC).
  if (monthFilter) {
    result = result.filter((prop) => {
      if (!prop.createdAt) return false;
      const ym = new Date(prop.createdAt).toISOString().slice(0, 7);
      return ym === monthFilter;
    });
  }

  // Feature status
  if (featureStatusFilter) {
    result = result.filter((prop) => prop.featureStatus === featureStatusFilter);
  }

  // OTP Status filter
  if (otpStatusFilter) {
    if (otpStatusFilter === 'verified') {
      result = result.filter((prop) => prop.otpStatus === 'verified');
    } else if (otpStatusFilter === 'unverified') {
      result = result.filter((prop) => prop.otpStatus !== 'verified');
    }
  }

  // Location filter
  if (hasLocation === 'yes') {
    result = result.filter((prop) => !!prop.locationCoordinates);
  } else if (hasLocation === 'no') {
    result = result.filter((prop) => !prop.locationCoordinates);
  }

  // Photo filter
  if (hasPhoto === 'yes') {
    result = result.filter(
      (prop) =>
        prop.photos &&
        prop.photos.length > 0 &&
        getFirstPhotoUrl(prop.photos) !== DEFAULT_IMAGE
    );
  } else if (hasPhoto === 'no') {
    result = result.filter(
      (prop) =>
        !prop.photos ||
        prop.photos.length === 0 ||
        getFirstPhotoUrl(prop.photos) === DEFAULT_IMAGE
    );
  }

  // Not viewed filter
  if (notViewed) {
    result = result.filter((prop) => !prop.views || prop.views === 0);
  }

  // Bank loan filter
  if (bankLoan === 'yes') {
    result = result.filter((prop) => (prop.bankLoan || '').toLowerCase() === 'yes');
  } else if (bankLoan === 'no') {
    result = result.filter((prop) => (prop.bankLoan || '').toLowerCase() !== 'yes');
  }

  // Price filter
  // if (priceFilter === 'house30') {
  //   result = result.filter((prop) => Number(prop.rentalAmount) < 3000000);
  // } else if (priceFilter === 'house30to50') {
  //   result = result.filter((prop) => Number(prop.rentalAmount) >= 3000000 && Number(prop.rentalAmount) <= 5000000);
  // } 
if (priceFilter === 'house30') {
  result = result.filter(
    (prop) => Number(prop.rentalAmount) < 3000000
  );
} else if (priceFilter === 'house30to50') {
  result = result.filter(
    (prop) =>
      Number(prop.rentalAmount) >= 3000000 &&
      Number(prop.rentalAmount) <= 5000000
  );
} else if (priceFilter === 'commerical10k') {
  result = result.filter(
    (prop) =>
      prop.propertyMode?.toLowerCase() === 'commercial' &&
      Number(prop.rentalAmount) <= 10000
  );
}

  // Min / Max price range filter
  if (minPrice !== '' && !isNaN(Number(minPrice))) {
    result = result.filter(
      (prop) => Number(prop.rentalAmount) >= Number(minPrice)
    );
  }
  if (maxPrice !== '' && !isNaN(Number(maxPrice))) {
    result = result.filter(
      (prop) => Number(prop.rentalAmount) <= Number(maxPrice)
    );
  }

  // Property type filter — 'agri' kept as a back-compat alias for the
  // "Agri Land" quick button; any other value is an exact propertyType match.
  if (propertyTypeFilter && propertyTypeFilter !== '') {
    if (propertyTypeFilter === 'agri') {
      result = result.filter(
        (prop) => String(prop.propertyType) === 'Agricultural Land'
      );
    } else {
      result = result.filter(
        (prop) => String(prop.propertyType) === propertyTypeFilter
      );
    }
  }

  // Property mode filter
  if (propertyModeFilter && propertyModeFilter !== '') {
    result = result.filter(
      (prop) => String(prop.propertyMode) === propertyModeFilter
    );
  }

  // Base (city) filter — records without a base are treated as Pondicherry (PY)
  if (baseFilter && baseFilter !== '') {
    result = result.filter((prop) => (prop.base || 'PY') === baseFilter);
  }

  // Furnishing filter — normalized so "Semi-Furnished" / "Semi Furnished" /
  // "Fully Furnished" etc. all match regardless of spacing/hyphen/case.
  if (furnishedFilter && furnishedFilter !== '') {
    const norm = (v) => String(v || '').toLowerCase().replace(/[^a-z]/g, '');
    result = result.filter((prop) => {
      const f = norm(prop.furnished);
      if (furnishedFilter === 'Semi-Furnished') return f.includes('semi');
      if (furnishedFilter === 'Unfurnished') return f === 'unfurnished' || f === 'unfurnish' || f === 'notfurnished';
      // Furnished (fully): furnished but not semi/un
      return f === 'furnished' || f === 'fullyfurnished';
    });
  }

  // Floor filter — matches the property's floor number exactly.
  if (floorFilter && floorFilter !== '') {
    result = result.filter((prop) => String(prop.floorNo || '') === floorFilter);
  }

  // Bill type filter
  if (billTypeFilter && billTypeFilter !== '') {
    result = result.filter((prop) => getBillType(prop.rentId) === billTypeFilter);
  }

  // Plan type filter
  if (planTypeFilter && planTypeFilter !== '') {
    result = result.filter((prop) => {
      const planType = (prop.planName || '').toLowerCase();
      return planType === planTypeFilter.toLowerCase();
    });
  }

  // Rent type filter
  if (rentTypeFilter && rentTypeFilter !== '') {
    result = result.filter((prop) => String(prop.rentType) === rentTypeFilter);
  }

  // Approved By (staff name) filter — matches the bill's adminName shown in the column
  if (approvedByFilter && approvedByFilter !== '') {
    result = result.filter((prop) => (billMap[prop.rentId]?.adminName || '') === approvedByFilter);
  }

const parseAmount = (val) => Number(String(val).replace(/,/g, '') || 0);

  // Sorting
if (sortOption === 'priceLowHigh') { 
  result.sort((a, b) => parseAmount(a.rentalAmount) - parseAmount(b.rentalAmount));
} 
else if (sortOption === 'priceHighLow') {
  result.sort((a, b) => parseAmount(b.rentalAmount) - parseAmount(a.rentalAmount));
} 
else if (sortOption === 'oldToNew') {
  result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
} 
else if (sortOption === 'newToOld') {
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

  setFiltered(result);
};

// Auto-search when filters change (debounced so typing doesn't refilter on every keystroke)
useEffect(() => {
  const timer = setTimeout(() => {
    handleSearch();
  }, 300);
  return () => clearTimeout(timer);
  // handleSearch is intentionally omitted — it's redefined every render; deps list the actual inputs.
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [
  properties,
  rentIdSearch,
  phoneNumberSearch,
  startDate,
  endDate,
  monthFilter,
  featureStatusFilter,
  sortOption,
  hasLocation,
  hasPhoto,
  notViewed,
  bankLoan,
  priceFilter,
  minPrice,
  maxPrice,
  propertyTypeFilter,
  propertyModeFilter,
  baseFilter,
  furnishedFilter,
  floorFilter,
  billTypeFilter,
  otpStatusFilter,
  pincodeFilter,
  planTypeFilter,
  rentTypeFilter,
  approvedByFilter,
  billMap
]);

// Persist the current filter set to sessionStorage so navigating to a
// detail page and back restores the same view. Cleared by handleReset.
useEffect(() => {
  try {
    sessionStorage.setItem(APPROVED_FILTERS_KEY, JSON.stringify({
      rentIdSearch,
      phoneNumberSearch,
      pincodeFilter,
      startDate,
      endDate,
      monthFilter,
      featureStatusFilter,
      sortOption,
      hasLocation,
      hasPhoto,
      notViewed,
      bankLoan,
      priceFilter,
      minPrice,
      maxPrice,
      propertyTypeFilter,
      propertyModeFilter,
      baseFilter,
      furnishedFilter,
      floorFilter,
      billTypeFilter,
      otpStatusFilter,
      planTypeFilter,
      rentTypeFilter,
      approvedByFilter,
    }));
  } catch (e) { /* sessionStorage may be unavailable in some browsers */ }
}, [
  rentIdSearch, phoneNumberSearch, pincodeFilter, startDate, endDate, monthFilter,
  featureStatusFilter, sortOption, hasLocation, hasPhoto, notViewed,
  bankLoan, priceFilter, minPrice, maxPrice, propertyTypeFilter,
  propertyModeFilter, baseFilter, furnishedFilter, floorFilter, billTypeFilter, otpStatusFilter, planTypeFilter,
  rentTypeFilter, approvedByFilter,
]);

// Reset all filters
const handleReset = () => {
  setrentIdSearch('');
  setPhoneNumberSearch('');
  setPincodeFilter('');
  setStartDate('');
  setEndDate('');
  setMonthFilter('');
  setSelectedRentIds([]);
  setFeatureStatusFilter('');
  setHasLocation('');
  setHasPhoto('');
  setNotViewed(false);
  setBankLoan('');
  setPriceFilter('');
  setMinPrice('');
  setMaxPrice('');
  setPropertyTypeFilter('');
  setPropertyModeFilter('');
  setBaseFilter('');
  setFurnishedFilter('');
  setFloorFilter('');
  setBillTypeFilter('');
  setOtpStatusFilter('');
  setPlanTypeFilter('');
  setRentTypeFilter('');
  setApprovedByFilter('');
  setSortOption('');
  setFiltered(properties);
  try { sessionStorage.removeItem(APPROVED_FILTERS_KEY); } catch (e) { /* ignore */ }
};


  // ----- Bulk "Mark as Expired" selection -----
  // Only non-deleted (active) rows in the current filtered view are selectable.
  const selectableRows = filtered.filter((p) => !p.isDeleted);
  const allShownSelected =
    selectableRows.length > 0 &&
    selectableRows.every((p) => selectedRentIds.includes(p.rentId));

  const toggleSelectAllShown = () => {
    if (allShownSelected) {
      setSelectedRentIds([]);
    } else {
      setSelectedRentIds(selectableRows.map((p) => p.rentId));
    }
  };

  const toggleSelectOne = (rentId) => {
    setSelectedRentIds((prev) =>
      prev.includes(rentId) ? prev.filter((id) => id !== rentId) : [...prev, rentId]
    );
  };

  const handleBulkExpire = async () => {
    if (selectedRentIds.length === 0) return;
    setExpiring(true);

    // Expire each selected property via the existing single-record endpoint
    // (already live on the server). Concurrency is capped so a large batch
    // doesn't fire hundreds of parallel requests at once.
    const ids = [...selectedRentIds];
    const succeeded = [];
    const failed = [];
    const CONCURRENCY = 5;
    let cursor = 0;

    const worker = async () => {
      while (cursor < ids.length) {
        const rentId = ids[cursor++];
        try {
          await axios.put(`${process.env.REACT_APP_API_URL}/update-property-status`, {
            rentId,
            status: 'expired',
          });
          succeeded.push(rentId);
        } catch (e) {
          failed.push(rentId);
        }
      }
    };

    try {
      await Promise.all(
        Array.from({ length: Math.min(CONCURRENCY, ids.length) }, () => worker())
      );

      // Approved page shows only active rows — drop the expired ones from view.
      if (succeeded.length > 0) {
        setProperties((prev) => prev.filter((p) => !succeeded.includes(p.rentId)));
        setFiltered((prev) => prev.filter((p) => !succeeded.includes(p.rentId)));
      }

      setSelectedRentIds(failed); // keep only the ones that failed still selected
      setShowExpireModal(false);

      if (failed.length === 0) {
        alert(`${succeeded.length} propert${succeeded.length === 1 ? 'y' : 'ies'} marked as Expired. They now appear under the Expired section.`);
      } else {
        alert(`Expired ${succeeded.length} of ${ids.length}. ${failed.length} failed — please retry the ones still selected.`);
      }
    } finally {
      setExpiring(false);
    }
  };


  // Delete functionality
  const handleDeleteClick = (rentId, phoneNumber) => {
    setCurrentrentId(rentId);
    setCurrentPhoneNumber(phoneNumber);
    setShowDeleteModal(true);
  };



const handleDeleteConfirm = async () => {
  try {
    await axios.put(`${process.env.REACT_APP_API_URL}/admin-delete-rent`, 
      { deletionReason }, 
      { params: { rentId: currentrentId } }
    );

    // Update properties state to reflect the delete immediately
    const updated = properties.map(prop => 
      prop.rentId === currentrentId
        ? {
            ...prop,
            isDeleted: true,
            deletionReason: deletionReason.trim(),
            deletionDate: new Date().toISOString(),
          }
        : prop
    );
    setProperties(updated); // Immediately reflect the change

    // Update statusProperties to manage status
    setStatusProperties(prev => ({
      ...prev,
      [currentrentId]: 'delete', // Mark as 'delete' in the status
    }));

    // Close modal & reset form
    setShowDeleteModal(false);
    setDeletionReason('');
  } catch (error) {
    alert(error.response?.data?.message || 'Error deleting property');
  }
};


  // Undo delete functionality
  const handleUndo = async (rentId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/admin-undo-delete-rent`, 
        {}, 
        { params: { rentId } }
      );
  
      // Update properties state to reflect the undo action
      const updated = properties.map(prop => 
        prop.rentId === rentId
          ? {
              ...prop,
              isDeleted: false,
              deletionReason: null,
              deletionDate: null,
            }
          : prop
      );
      setProperties(updated);
  
      // Update statusProperties to reflect the change back to 'active'
      setStatusProperties(prev => ({
        ...prev,
        [rentId]: 'active',
      }));
    } catch (error) {
      alert(error.response?.data?.message || 'Error undoing delete');
    }
  };
  
 
  // Feature status toggle
  const handleFeatureStatusChange = async (rentId, currentStatus) => {
    const newStatus = currentStatus === "yes" ? "no" : "yes";
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/update-feature-status`, {
        rentId,
        featureStatus: newStatus,
      });

      setProperties(prev => prev.map(prop =>
        prop.rentId === rentId ? { ...prop, featureStatus: newStatus } : prop
      ));
      setFiltered(prev => prev.map(prop =>
        prop.rentId === rentId ? { ...prop, featureStatus: newStatus } : prop
      ));
    } catch (error) {
    }
  };




const handleCreateBill = (type, rentId) => {
  if (type === 'Bill' && rentId) {
    navigate(`/dashboard/edit-bill/${rentId}`);
  }
};


  
  
    const reduxAdminName = useSelector((state) => state.admin.name);

    const adminName = reduxAdminName || localStorage.getItem("adminName");



// Kept for the (currently commented-out) Permanent Delete button in the Action column.
// eslint-disable-next-line no-unused-vars
const handlePermanentDelete = async (rentId) => {
  const confirmDelete = window.confirm("Are you sure you want to permanently delete this record?");
  if (!confirmDelete) return;

  const adminName = reduxAdminName || localStorage.getItem("adminName");

  if (!adminName) {
    alert("Admin name is missing. Please log in again.");
    return;
  }

  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_URL}/delete-rentId-data`,
      {
        params: { rentId },
        data: {
          deletedBy: adminName
        }
      }
    );

    if (response.status === 200) {
      alert("User permanently deleted successfully!");

      setProperties((prev) => prev.filter((property) => property.rentId !== rentId));

      const updatedStatus = { ...statusProperties };
      delete updatedStatus[rentId];
      setStatusProperties(updatedStatus);
      localStorage.setItem("statusProperties", JSON.stringify(updatedStatus));
    } else {
      alert(response.data.message || "Failed to delete user.");
    }
  } catch (error) {
    alert("An error occurred while deleting.");
    console.error(error);
  }
};

// Move To handler
const handleMoveToClick = (property) => {
  setSelectedPropertyForMove(property);
  setShowMoveToModal(true);
};

const handleMoveToOption = async (targetLabel) => {
  if (!selectedPropertyForMove) return;

  // Map user-facing labels to backend-allowed status values
  // Valid statuses: delete, pending, expired
  const mapping = {
    'preapproved property': 'expired',
    'pending property': 'pending',
    'removed property': 'delete',
  };

  const key = String(targetLabel || '').toLowerCase().trim();
  const backendStatus = mapping[key];

  if (!backendStatus) {
    alert('Invalid target status');
    return;
  }

  try {
    // Call API to update the status
    await axios.put(`${process.env.REACT_APP_API_URL}/update-property-status`, {
      rentId: selectedPropertyForMove.rentId,
      status: backendStatus,
    });

    // Update properties locally
    setProperties(prev => prev.map(prop =>
      prop.rentId === selectedPropertyForMove.rentId 
        ? { ...prop, status: backendStatus } 
        : prop
    ));
    setFiltered(prev => prev.map(prop =>
      prop.rentId === selectedPropertyForMove.rentId 
        ? { ...prop, status: backendStatus } 
        : prop
    ));

    // Close modal
    setShowMoveToModal(false);
    const movedRentId = selectedPropertyForMove.rentId;
    setSelectedPropertyForMove(null);
    alert(`Property moved to ${targetLabel}`);

    // Navigate to the respective page based on selected option
    if (backendStatus === 'expired') {
      navigate('/dashboard/pre-approved-car', { state: { clearedRentIds: [movedRentId] } });
    } else if (backendStatus === 'pending') {
      navigate('/dashboard/pending-property', { state: { clearedRentIds: [movedRentId] } });
    } else if (backendStatus === 'delete') {
      navigate('/dashboard/removed-property', { state: { clearedRentIds: [movedRentId] } });
    }
  } catch (error) {
    alert(error.response?.data?.message || 'Error moving property');
  }
};
    
 
const handlePrint = (prop) => {
  const photoCount = prop.photos?.length || 0;
  const videoCount = prop.videos?.length || 0;

  const printWindow = window.open('', '_blank');
  const content = `
    <html>
    <head>
       <title>RENT Property Detail</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        td, th { border: 1px solid #000; padding: 4px; vertical-align: top; }
        .yellow { background-color: yellow; font-weight: bold; }
        .header { font-weight: bold; font-size: 18px; }
        .sub-header { text-align: right; }
        .full-row { height: 30px; }
@media print {
  .yellow {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

      </style>

    </head>
    <body>
      <table>
        <tr>
          <td colspan="1" rowspan="2" class="header">RENT PONDY</td>
          <td colspan="1" rowspan="2">OFFICE USE ONLY</td>
            <td colspan="1" class="yellow">RENT ID:</td>
          <td colspan="1">${prop.rentId}</td>
        </tr>
        <tr>
          <td colspan="1">PHOTO: ${photoCount}</td>
          <td colspan="1">VIDEO: ${videoCount}</td>
        </tr>
     

        <!-- Property Details -->
        <tr>
          <td class="yellow" colspan="2">prop details</td>
          <td class="yellow" colspan="2">prop features</td>
        </tr>
        <tr><td>Property Mode</td><td>${prop.propertyMode || ''}</td><td>Bedroom</td><td>${prop.bedrooms || ''}</td></tr>
        <tr><td>Property Type</td><td>${prop.propertyType || ''}</td><td>Floor No</td><td>${prop.floorNo || ''}</td></tr>
        <tr><td>Amount</td><td>${prop.callForRent ? 'Call Owner' : (prop.rentalAmount || '')}</td><td>Kitchen</td><td>${prop.kitchen || ''}</td></tr>
        <tr><td>Negotiation</td><td>${prop.negotiation || ''}</td><td>Balconies</td><td>${prop.balconies || ''}</td></tr>
        <tr><td>Rent Type</td><td>${prop.rentType || ''}</td><td>Attached</td><td>${prop.attachedBathrooms || ''}</td></tr>
        <tr><td>Security Deposit</td><td>${prop.securityDeposit || ''}</td><td>Western</td><td>${prop.western || ''}</td></tr>
        <tr><td>Total Area / sq.ft</td><td>${prop.totalArea || ''}</td><td>Car Park</td><td>${prop.carParking || ''}</td></tr>
        <tr><td>Area Unit</td><td>${prop.areaUnit || ''}</td><td>Lift</td><td>${prop.lift || ''}</td></tr>
        <tr><td>Property Age</td><td>${prop.propertyAge || ''}</td><td>Wheel Chair Available</td><td>${prop.wheelChairAvailable || ''}</td></tr>
        <tr><td></td><td></td><td class="yellow">Other Details</td><td></td></tr>
        <tr><td></td><td></td><td>Facing</td><td>${prop.facing || ''}</td></tr>
        <tr><td class="yellow">description</td><td colspan="1"></td><td>Available from</td><td>${prop.availableDate || ''}</td></tr>
        <tr><td rowspan="4" colspan="2">${prop.description || ''}</td><tr><td colspan="1">FURNISHED</td><td>${prop.furnished || ''}</td></tr>
        <tr><td>Posted By</td><td>${prop.postedBy || ''}</td></tr>
        </tr>

        <tr><td>Posted Date</td><td>${new Date(prop.createdAt).toLocaleDateString()}</td></tr>
        <tr><td class="yellow" colspan="4">Tenant Preferences</td></tr>
        <tr><td>Family Members</td><td>${prop.familyMembers || ''}</td><td>Food Habit</td><td>${prop.paymentData?.foodHabit || ''}</td></tr>
        <tr><td>Job Type</td><td>${prop.jobType || ''}</td><td>Pet</td><td>${prop.paymentData?.petAllowed || ''}</td></tr>

        <!-- Location and Owner -->
        <tr><td class="yellow" colspan="2">PROP LOCATION</td><td class="yellow" colspan="2">OWNER details</td></tr>
        <tr><td>COUNTRY</td><td>${prop.country || ''}</td><td>Name</td><td>${prop.paymentData?.ownerName || ''}</td></tr>
        <tr><td>STATE</td><td>${prop.state || ''}</td><td>Email</td><td>${prop.paymentData?.email || ''}</td></tr>
        <tr><td>DISTRICT</td><td>${prop.district || ''}</td><td>Mobile Number</td><td>${prop.phoneNumber}</td></tr>
        <tr><td>CITY</td><td>${prop.city || ''}</td><td>Alternate Number</td><td>${prop.alternatePhone || ''}</td></tr>
        <tr><td>NAGAR</td><td>${prop.nagar || ''}</td><td>Best Time to Call</td><td>${prop.bestTimeToCall || ''}</td></tr>
        <tr><td>AREA</td><td>${prop.area || ''}</td><td class="yellow">MAP</td><td>${prop.mapLocation || ''}</td></tr>
  <tr>
    <td>STREET</td>
    <td>${prop.streetName || ''}</td>
    <td rowspan="7" colspan="2"> 
  <!--     <h6>Property Location on Map:</h6>
<div id="map"></div>
   <img 
              src="https://maps.googleapis.com/maps/api/staticmap?center=${prop.locationCoordinates}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${prop.locationCoordinates}&key=AIzaSyBOSInlVwT7uN2G0J3VndG3dOrCVkGbeEs&libraries=places"
            alt="Property Location Map"
            style="width:100%; max-width:400px; height:auto;"
          /> -->

          <!-- Right block spans all 7 left rows -->
  </tr>
  <tr>
    <td>DOOR NO</td>
    <td>${prop.doorNumber || ''}</td>
  </tr>
  <tr>
    <td>PINCODE</td>
    <td>${prop.pinCode || ''}</td>
  </tr>
  <tr>
    <td>LONG&LAT</td>
    <td>${prop.locationCoordinates || ''}</td>
  </tr>
  <tr rowspan="3">
    <td colspan="2">ADDRESS: ${prop.doorNumber || ''} ${prop.streetName || ''} ${prop.area || ''} ${prop.nagar || ''} ${prop.city || ''} ${prop.district || ''} ${prop.state || ''} ${prop.pinCode || ''}</td></tr>
      <tr>
  
  </tr>

</table>
<table>
<h3 class="yellow">OFFICE USE ONLY</h3>
        <!-- Footer Office Use -->
          <!-- <tr><td class="yellow" colspan="4">OFFICE USE ONLY</td></tr> -->
        <tr><td colspan="1">RENT ID: ${prop.rentId}</td><td  colspan="3">MOB.NO: ${prop.phoneNumber}</td></tr>
        <tr>
        <td colspan="1">APP BY: ${prop.createdBy || ''}</td>
        <td colspan="1">BILL NO: ${prop.billNumber || ''}</td> 
        <td colspan="1">APP.DATE: ${new Date(prop.createdAt).toLocaleDateString()}</td>
        <td colspan="1">AMT: ${prop.paymentData?.amount || ''}</td>
        </tr>
      </table>
      <script>
        window.onload = () => {
          window.print();
        }
      </script>
    </body>
    </html>
  `;
    printWindow.document.open();

  printWindow.document.write(content);
  printWindow.document.close();
};

  // ----- Yearly dashboard data (month-wise counts from createdAt) -----
  // YM extracted in UTC to stay consistent with the Month (Created) filter.
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const toYM = (d) => { try { return new Date(d).toISOString().slice(0, 7); } catch (e) { return ''; } };
  const dashboardYears = Array.from(
    new Set(
      (properties || [])
        .map((p) => (p.createdAt ? new Date(p.createdAt).toISOString().slice(0, 4) : ''))
        .filter(Boolean)
    )
  ).sort((a, b) => b.localeCompare(a));
  const selectedDashboardYear = dashboardYear || dashboardYears[0] || '';
  const dashboardMonthly = Array.from({ length: 12 }, (_, m) => {
    const mm = String(m + 1).padStart(2, '0');
    const ym = `${selectedDashboardYear}-${mm}`;
    const count = selectedDashboardYear
      ? (properties || []).filter((p) => p.createdAt && toYM(p.createdAt) === ym).length
      : 0;
    return { month: m, mm, ym, count };
  });
  const dashboardYearTotal = dashboardMonthly.reduce((sum, x) => sum + x.count, 0);

  // Distinct property types present in the loaded approved properties — drives
  // the Property Type filter dropdown so it always reflects the real data.
  const propertyTypeOptions = Array.from(
    new Set(
      (properties || [])
        .map((p) => p.propertyType)
        .filter((t) => t != null && String(t).trim() !== '')
        .map((t) => String(t).trim())
    )
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div className="container-fluid">
      {/* Search and Filter Controls */}
      <div   style={{ 
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
  padding: '20px', 
  backgroundColor: '#fff' 
}} className="row mb-3">
        <div className="col-md-3">
          <label>Rent ID</label>
          <Form.Control
            type="text"
            placeholder="Search by RENT ID"
            value={rentIdSearch}
            onChange={(e) => setrentIdSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label>Phone Number</label>
          <Form.Control
            type="text"
            placeholder="Search by Phone Number"
            value={phoneNumberSearch}
            onChange={(e) => setPhoneNumberSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label>Pincode {pincodeFilter && <span style={{color: 'green', fontWeight: 'bold'}}>({filtered.filter(p => {
            const propPincode = p.pinCode || p.pincode || p.postalCode;
            return String(propPincode) === pincodeFilter;
          }).length} properties)</span>}</label>
          <Form.Control
            type="text"
            placeholder="Search by Pincode"
            value={pincodeFilter}
            onChange={(e) => setPincodeFilter(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label>Feature Status</label>
          <select className="form-control" value={featureStatusFilter} onChange={(e) => setFeatureStatusFilter(e.target.value)}>
            <option value="">All Feature Status</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="col-md-3">
          <label>OTP Status</label>
          <select className="form-control" value={otpStatusFilter} onChange={(e) => setOtpStatusFilter(e.target.value)}>
            <option value="">All OTP Status</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>

        <div className="col-md-3">
          <label>Property Type</label>
          <select className="form-control" value={propertyTypeFilter} onChange={(e) => setPropertyTypeFilter(e.target.value)}>
            <option value="">All Property Type</option>
            {propertyTypeOptions.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label>Property Mode</label>
          <select className="form-control" value={propertyModeFilter} onChange={(e) => setPropertyModeFilter(e.target.value)}>
            <option value="">All Property Mode</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>
        <div className="col-md-3">
          <label>Base</label>
          <select className="form-control" value={baseFilter} onChange={(e) => setBaseFilter(e.target.value)}>
            <option value="">All Base</option>
            <option value="PY">Pondicherry (PY)</option>
            <option value="CH">Chennai (CH)</option>
          </select>
        </div>
        <div className="col-md-3">
          <label>Furnishing</label>
          <select className="form-control" value={furnishedFilter} onChange={(e) => setFurnishedFilter(e.target.value)}>
            <option value="">All Furnishing</option>
            <option value="Furnished">Furnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
          </select>
        </div>
        <div className="col-md-3">
          <label>Floor</label>
          <select className="form-control" value={floorFilter} onChange={(e) => setFloorFilter(e.target.value)}>
            <option value="">All Floors</option>
            {[...new Set(properties.map((p) => p.floorNo).filter((v) => v !== undefined && v !== null && String(v).trim() !== ''))]
              .sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }))
              .map((floor) => (
                <option key={String(floor)} value={String(floor)}>{String(floor)}</option>
              ))}
          </select>
        </div>
        <div className="col-md-3">
          <label>Bill Type</label>
          <select className="form-control" value={billTypeFilter} onChange={(e) => setBillTypeFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Office Bill">Office Bill</option>
            <option value="Online Bill">Online Bill</option>
          </select>
        </div>
        <div className="col-md-3">
          <label>Plan Type</label>
          <select className="form-control" value={planTypeFilter} onChange={(e) => setPlanTypeFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        <div className="col-md-3">
          <label>Rent Type</label>
          <select className="form-control" value={rentTypeFilter} onChange={(e) => setRentTypeFilter(e.target.value)}>
            <option value="">All Rent Types</option>
            <option value="Monthly">Monthly</option>
            <option value="Weekly">Weekly</option>
            <option value="Fortnightly">Fortnightly</option>
            <option value="Daily">Daily</option>
            <option value="Lease">Lease</option>
            <option value="Rent">Rent</option>
          </select>
        </div>
        <div className="col-md-3">
          <label>Approved By</label>
          <select className="form-control" value={approvedByFilter} onChange={(e) => setApprovedByFilter(e.target.value)}>
            <option value="">All Staff</option>
            {approvedByOptions.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label>Start Date</label>
          <Form.Control
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label>End Date</label>
          <Form.Control
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label>Month (Created)</label>
          <Form.Control
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label>Min Price</label>
          <Form.Control
            type="number"
            min="0"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label>Max Price</label>
          <Form.Control
            type="number"
            min="0"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="col-12 mt-3">
          <div className="d-flex flex-wrap gap-2">
            <Button onClick={() => setSortOption('priceLowHigh')}>Price: Low to High</Button>
            <Button onClick={() => setSortOption('priceHighLow')}>Price: High to Low</Button>
            <Button onClick={() => setSortOption('oldToNew')}>Date: Old to New</Button>
            <Button onClick={() => setSortOption('newToOld')}>Date: New to Old</Button>
            
            <Button onClick={() => setHasLocation('yes')}>With Location</Button>
            <Button onClick={() => setHasLocation('no')}>Without Location</Button>
            
            <Button onClick={() => setHasPhoto('yes')}>With Photo</Button>
            <Button onClick={() => setHasPhoto('no')}>Without Photo</Button>
            
            <Button onClick={() => setNotViewed(true)}>Not Viewed</Button>
            
            <Button onClick={() => setPriceFilter('house30')}>House below 30L</Button>
            <Button onClick={() => setPriceFilter('house30to50')}>House 30L - 50L</Button>
            <Button onClick={() => setPriceFilter('commerical10k')}>Commercial below 10k</Button>
            
            <Button onClick={() => setPropertyTypeFilter('Agricultural Land')}>Agri Land</Button>
          </div>
        </div>

        <div className="col-12 mt-3">
          <Button variant="primary" onClick={handleSearch}>
            Search
          </Button>
          <Button variant="secondary" onClick={handleReset} className="ms-2">
            Reset
          </Button>
        </div>
      </div>
              <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrintt}>
  Print
</button>
              <button className="btn btn-secondary mb-3 mt-2 ms-2" style={{background:"#217346"}} onClick={handleExcel}>
  Excel
</button>
              <button
                className="btn btn-warning mb-3 mt-2 ms-2"
                disabled={selectedRentIds.length === 0}
                onClick={() => setShowExpireModal(true)}
              >
  Mark Selected as Expired ({selectedRentIds.length})
</button>
              <button
                className="btn btn-info mb-3 mt-2 ms-2"
                style={{ color: '#fff' }}
                onClick={() => setShowDashboard(true)}
              >
  Dashboard
</button>
      <div style={{ 
        background: '#6c757d', 
        color: 'white', 
        padding: '8px 16px', 
        borderRadius: '4px', 
        fontWeight: 'bold',
        fontSize: '14px',
        marginBottom: '12px',
        marginLeft: '8px',
        display: 'inline-block'
      }}>
        Total: {getTotalMatchedPropertiesCount()} Records
      </div>
      <div style={{ 
        background: '#007bff', 
        color: 'white', 
        padding: '8px 16px', 
        borderRadius: '4px', 
        fontWeight: 'bold',
        fontSize: '14px',
        marginBottom: '12px',
        marginLeft: '8px',
        display: 'inline-block'
      }}>
        Showing: {getFilteredMatchedPropertiesCount()} Records
      </div>
      {/* Property Table */}
<div ref={tableRef}>        <Table striped bordered hover responsive className="table-sm align-middle">
          <thead className="sticky-top">
            <tr>
              <th title="Select all shown">
                <input
                  type="checkbox"
                  checked={allShownSelected}
                  onChange={toggleSelectAllShown}
                />
              </th>
              <th>S.No</th>
              <th>Image</th>
              <th className="sticky-col sticky-col-1">RENT ID</th>
              <th>Views</th>
              <th className="sticky-col sticky-col-2">Phone Number</th>
              <th className="sticky-col sticky-col-3">Original Phone Number</th>
              <th>Otp Status</th>
              <th>Direct Verified User</th>
              <th>Property Type</th>
              <th>Property Mode</th>
              <th>Rent Type</th>
              <th>BHK</th>
              <th>Floor</th>
              <th>Rental Amount</th>
              <th>City</th>
              <th>Area</th>
              <th>Pincode</th>
              <th>CreatedBy</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Mandatory</th>
              <th>Bulk Upload</th>
              <th>Status</th>
              <th>Set rentId Status</th>
              <th>Set rentId Assigned Date</th>
              <th>Set rentId Assigned PhoneNumber</th>
              <th>Bill no</th>
              <th>Bill Type</th>
              <th>Plan Type</th>
              <th>Plan Name</th>
          <th>Plan Created</th>
                        <th>Plan Expiry</th>
                <th>PayU Status</th>
          <th>Transaction ID</th>
                    <th>Plan Amount</th>

          <th>Plan CreatedBy</th>
          <th>Email</th>
          <th>payU Date</th>
              <th>Deletion Reason</th>
              <th>Deleted At</th>
              <th>Action</th>
              {/* <th>View Details</th> */}
              <th>Create Bill</th>
              <th>Feature Status</th>
              <th>Features Property Status</th>
              <th>Move To</th>
              <th>FollowUp Admin Name</th>
              <th>Bill Date</th>
              <th>Validity (days)</th>
              <th>Bill Expiry Date</th>
              <th>Approved Date</th>
              <th>Added By</th>
              <th>Approved By</th>
              <th>Remark</th>
              <th>Remark Record</th>
               <th>Print  </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="26" className="text-center">
                  No properties found.
                </td>
              </tr>
            ) : (
              filtered.map((prop, idx) => (
                <tr key={prop._id} className={prop.isDeleted ? 'table-danger' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRentIds.includes(prop.rentId)}
                      onChange={() => toggleSelectOne(prop.rentId)}
                      disabled={prop.isDeleted}
                    />
                  </td>
                  <td>{idx + 1}</td>
                  <td>
                    <img
                      src={getFirstPhotoUrl(prop.photos)}
                      alt="Property"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  </td>
                  <td className="sticky-col sticky-col-1"                     style={{
        cursor: "pointer",
      }}    onClick={() =>
                        navigate('/dashboard/detail', {
                          state: { rentId: prop.rentId, phoneNumber: prop.phoneNumber },
                        })
                      }>{prop.rentId}</td>
                  <td><FaEye /> {prop.views}</td>
                   <td className="sticky-col sticky-col-2">
  <PhoneCell phone={prop.phoneNumber} display={prop.assignedPhoneNumber || prop.phoneNumber} type="owner" rentId={prop.rentId} />
</td>
                  {/* Original (real) owner number — the one being masked by the assigned number */}
                  <td className="sticky-col sticky-col-3">{prop.phoneNumber || 'N/A'}</td>
                  <td>{prop.otpStatus}</td>
<td>{prop.isVerifiedUser ? 'True' : 'False'}</td>
                  <td>{prop.propertyType}</td>
                  <td>{prop.propertyMode}</td>
                  <td>{prop.rentType || 'N/A'}</td>
                  <td>{prop.bedrooms || 'N/A'}</td>
                  <td>{prop.floorNo || 'N/A'}</td>
                  <td>{prop.callForRent ? 'Call Owner' : prop.rentalAmount}</td>
                  <td>{prop.city}</td>
                  <td>{prop.area || 'N/A'}</td>
                  <td>{prop.pinCode || 'N/A'}</td>
                  <td>{prop.createdBy}</td>
                  <td>{new Date(prop.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(prop.updatedAt).toLocaleDateString()}</td>
                  <td>{prop.required}</td>
                  <td>{prop.bulkUploadId ? 'Yes' : 'No'}</td>
                  <td>{prop.status}</td>
                    <td>{prop.setrentId ? 'True' : 'False'}</td>
  <td>{prop.assignedPhoneNumber || 'N/A'}</td>
  <td>{prop.setrentIdAssignedAt ? new Date(prop.setrentIdAssignedAt).toLocaleDateString() : 'N/A'}</td>
 
                  <td>{billMap[prop.rentId]?.billNo || '-'}</td>
                  <td>{getBillType(prop.rentId)}</td>
                  <td>{prop.planName}</td>
                  <td>{prop.packageType}</td>
              <td>{new Date(prop.planCreatedAt).toLocaleDateString()}</td>
              <td>{prop.planExpiryDate}</td>
              <td>{prop.paymentData?.payustatususer}</td>
              <td>{prop.paymentData?.txnid }</td>
                <td>{prop.paymentData?.amount}</td>
              <td>{prop.paymentData?.firstname }</td>  
              <td>{prop.paymentData?.email }</td>
                            <td>{prop.paymentData?.payUdate }</td>
                  <td>{prop.deletionReason || '-'}</td>
                  <td>{prop.deletionDate ? new Date(prop.deletionDate).toLocaleString() : '-'}</td>
                  <td>
                    {prop.isDeleted ? (
                      <Button variant="secondary" size="sm" onClick={() => handleUndo(prop.rentId)}>
                        Undo
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="info"
                          size="sm"
                          className="ms-2"
                          onClick={() =>
                            navigate('/dashboard/edit-property', {
                              state: { rentId: prop.rentId, phoneNumber: prop.phoneNumber },
                            })
                          }
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="ms-2 mt-2"
                          onClick={() => handleDeleteClick(prop.rentId, prop.phoneNumber)}
                        >
                          <MdDeleteForever />
                        </Button>
                        {/* <Button
                          variant="danger"
                          size="sm"
                          className="mt-2"
                          onClick={() => handlePermanentDelete(prop.rentId)}
                        >
                          <MdDeleteForever /> Permanent
                        </Button> */}
                      </>
                    )}
                  </td>
         
                  <td>
                    <button
                      className="text-primary"
                      onClick={() => handleCreateBill('Bill', prop.rentId)}
                    >
                      Edit Bill
                    </button>
                  </td>
                  <td>{prop.featureStatus}</td>
                  <td>
                    <Button
                      variant={prop.featureStatus === "yes" ? "danger" : "success"}
                      size="sm"
                      onClick={() => handleFeatureStatusChange(prop.rentId, prop.featureStatus)}
                    >
                      {prop.featureStatus === "yes" ? "Set to No" : "Set to Yes"}
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleMoveToClick(prop)}
                    >
                      Move To
                    </Button>
                  </td>
                  <td>{prop.followUpAdminName}</td>
                  <td>{billMap[prop.rentId] ? new Date(billMap[prop.rentId].createdAt).toLocaleDateString() : '-'}</td>
                  <td>{billMap[prop.rentId]?.validity || prop.validity || '-'}</td>
                  <td>{billMap[prop.rentId] ? calculateBillExpiryDate(billMap[prop.rentId].createdAt, billMap[prop.rentId].validity) : '-'}</td>
                  <td>{billMap[prop.rentId]?.createdAt ? new Date(billMap[prop.rentId].createdAt).toLocaleDateString() : '-'}</td>
                  <td>{prop.addedBy || '-'}</td>
                  <td>{billMap[prop.rentId]?.adminName || '-'}</td>
                  <td style={{ minWidth: '200px' }}>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Enter remark"
                      value={remarkInputs[prop.rentId] || ''}
                      onChange={(e) => handleRemarkInputChange(prop.rentId, e.target.value)}
                      style={{ fontSize: '12px' }}
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-1"
                      disabled={!(remarkInputs[prop.rentId] || '').trim() || savingRemark[prop.rentId]}
                      onClick={() => handleSaveRemark(prop.rentId)}
                    >
                      {savingRemark[prop.rentId] ? 'Saving...' : 'Save'}
                    </Button>
                  </td>
                  <td style={{ minWidth: '220px', maxWidth: '300px' }}>
                    {(prop.remarks && prop.remarks.length > 0) ? (
                      (() => {
                        const latest = prop.remarks[prop.remarks.length - 1];
                        return (
                          <div style={{ fontSize: '12px' }}>
                            <div>{latest.text}</div>
                            <div style={{ color: '#666', fontSize: '10px' }}>
                              {latest.adminName} • {latest.date ? new Date(latest.date).toLocaleString() : ''}
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <span style={{ color: '#999' }}>-</span>
                    )}
                  </td>
                  <td>         <Button
                    variant="secondary"
                    size="sm"
                    className="ms-2"
                    onClick={() => handlePrint(prop)}
                  >
                    Print
                  </Button></td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Move To Modal */}
      <Modal show={showMoveToModal} onHide={() => setShowMoveToModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Move Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Move to Preapproved Property,Sure you want to move:</p>
          <div className="d-flex flex-column gap-2">
            <Button
              variant="primary"
              onClick={() => handleMoveToOption('preapproved property')}
              className="w-100"
            >
              Preapproved Property
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Yearly Dashboard Modal — month-wise property counts for a selected year */}
      <Modal show={showDashboard} onHide={() => setShowDashboard(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Approved Properties — Yearly Dashboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
            <label className="mb-0 fw-bold">Select Year:</label>
            <select
              className="form-control"
              style={{ maxWidth: '160px' }}
              value={selectedDashboardYear}
              onChange={(e) => setDashboardYear(e.target.value)}
            >
              {dashboardYears.length === 0 && <option value="">No data</option>}
              {dashboardYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <span className="badge bg-primary" style={{ fontSize: '13px' }}>
              Total in {selectedDashboardYear || '-'}: {dashboardYearTotal}
            </span>
          </div>

          <div className="row g-3">
            {dashboardMonthly.map((mData) => (
              <div className="col-6 col-sm-4 col-md-3" key={mData.mm}>
                <div
                  onClick={() => {
                    if (mData.count === 0) return;
                    setMonthFilter(mData.ym);
                    setShowDashboard(false);
                  }}
                  style={{
                    cursor: mData.count > 0 ? 'pointer' : 'default',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    background: mData.count > 0 ? '#f0f6ff' : '#f5f5f5',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    opacity: mData.count > 0 ? 1 : 0.55,
                  }}
                  title={mData.count > 0 ? `Click to filter ${MONTH_NAMES[mData.month]} ${selectedDashboardYear}` : 'No properties'}
                >
                  <div style={{ fontSize: '14px', color: '#555', fontWeight: 600 }}>
                    {MONTH_NAMES[mData.month]}
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#0d6efd' }}>
                    {mData.count}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>properties</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-muted mt-3 mb-0" style={{ fontSize: '12px' }}>
            Tip: click any month card to filter the table below to that month.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDashboard(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Bulk Expire Confirmation Modal */}
      <Modal show={showExpireModal} onHide={() => !expiring && setShowExpireModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Mark as Expired</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You are about to mark <strong>{selectedRentIds.length}</strong>{' '}
            propert{selectedRentIds.length === 1 ? 'y' : 'ies'} as <strong>Expired</strong>.
          </p>
          <p className="text-muted" style={{ fontSize: '13px' }}>
            They will be removed from the Approved list and will appear under the Expired section.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExpireModal(false)} disabled={expiring}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleBulkExpire} disabled={expiring}>
            {expiring ? 'Expiring...' : 'Confirm Expire'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="deletionReason">
            <Form.Label>Deletion Reason</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={deletionReason}
              onChange={(e) => setDeletionReason(e.target.value)}
              placeholder="Enter reason for deletion"
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={!deletionReason.trim()}
          >
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ApprovedCar;





































 