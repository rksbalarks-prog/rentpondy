import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';

const TABS = [
  { key: 'actions', label: 'Actions' },
  { key: 'login', label: 'Login' },
  { key: 'property', label: 'Property' },
  { key: 'status', label: 'Property Status' },
  { key: 'payments', label: 'Payments' },
  { key: 'followups', label: 'Follow-ups' },
  { key: 'bills', label: 'Bill Report' },
];

const tabStyle = (active) => ({
  padding: '10px 18px',
  cursor: 'pointer',
  border: 'none',
  borderBottom: active ? '2.5px solid #0d6efd' : '2.5px solid transparent',
  background: 'transparent',
  color: active ? '#0d6efd' : '#495057',
  fontWeight: active ? 600 : 400,
  fontSize: '14px',
  whiteSpace: 'nowrap',
  transition: 'color 0.15s',
});

const tabNavStyle = {
  display: 'flex',
  overflowX: 'auto',
  borderBottom: '1px solid #dee2e6',
  marginBottom: '20px',
  gap: '4px',
  scrollbarWidth: 'none',
};

const SectionHeader = ({ title, colSpan = 3 }) => (
  <tr>
    <td colSpan={colSpan} className="fw-bold text-center" style={{ backgroundColor: '#e9ecef' }}>{title}</td>
  </tr>
);

const AdminAlltimeReport = () => {
  const [activeTab, setActiveTab] = useState('actions');

  const defaultStart = moment().subtract(30, 'days').format('YYYY-MM-DD');
  const defaultEnd = moment().format('YYYY-MM-DD');
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [appliedRange, setAppliedRange] = useState({ start: defaultStart, end: defaultEnd });
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [actionsCounts, setActionsCounts] = useState({
    contactViewed: 0,
    favoriteList: 0,
    photoRequest: 0,
    addressRequests: 0,
    offerRaised: 0,
    viewedProperties: 0,
    sendInterest: 0,
    calledList: 0,
  });

  const [loginCounts, setLoginCounts] = useState({
    totalLogin: 0,
    reported: 0,
    unreported: 0,
    owner: 0,
    tenant: 0,
    visitor: 0,
    conversionPaid: 0,
    conversionFree: 0,
    conversionPending: 0,
  });

  const [propertyCounts, setPropertyCounts] = useState({
    totalCreated: 0,
    freeProperty: 0,
    paidProperty: 0,
    tenantTotal: 0,
    tenantFree: 0,
    tenantPaid: 0,
  });

  const [propertyStatusCounts, setPropertyStatusCounts] = useState({
    preApproved: 0,
    pending: 0,
    deleted: 0,
    expired: 0,
    tenantPending: 0,
    tenantDeleted: 0,
    unreported: 0,
    conversionPending: 0,
  });

  const [paymentCounts, setPaymentCounts] = useState({
    propPayFailed: 0,
    propPayNow: 0,
    propPayLater: 0,
    tenantPayFailed: 0,
    tenantPayNow: 0,
    tenantPayLater: 0,
  });

  const [followupCounts, setFollowupCounts] = useState({
    propertyFollowups: 0,
    tenantFollowups: 0,
  });

  const [billCounts, setBillCounts] = useState({
    propertyBillCount: 0,
    propertyBillAmount: 0,
    tenantBillCount: 0,
    tenantBillAmount: 0,
    totalBillCount: 0,
    totalBillAmount: 0,
  });

  const fetchAlltimeData = useCallback(async (rangeStart, rangeEnd) => {
    const start = moment(rangeStart).startOf('day');
    const end = moment(rangeEnd).endOf('day');

    const inRange = (dateStr) => {
      if (!dateStr) return false;
      const d = moment(dateStr);
      if (!d.isValid()) return false;
      return d.isBetween(start, end, undefined, '[]');
    };

    setIsLoadingData(true);
    // Swallow per-endpoint failures so a single 404 (e.g. /payments-with-plan/pay-failed-buyer
    // returns 404 when there are zero failed payments) doesn't reject the whole Promise.all
    // and leave every count stuck at 0.
    const safeGet = (url) => axios.get(url).catch(() => ({ data: {} }));
    try {
      const [
        contactRes, favoriteRes, photoRes, addressRes, offersRes, viewedRes,
        interestRes, calledRes, loginUsersRes, approvedRes, freePlansRes,
        paidPlansRes, baActiveRes, allBuyerBillsRes, baFreeRes, baPaidRes,
        payuBuyerRes, preApprovedRes, allPropsRes, pendingRes, deletedRes,
        expiredRes, pendingBARes, allBARes, propPayFailedRes, propPayNowRes,
        propPayLaterRes, tenantPayFailedRes, tenantPayNowRes, tenantPayLaterRes,
        propFollowupRes, tenantFollowupRes,
        propBillsRes, tenantBillsRes,
      ] = await Promise.all([
        safeGet(`${process.env.REACT_APP_API_URL}/get-all-contact-requests`),
        safeGet(`${process.env.REACT_APP_API_URL}/get-all-favorite-requests`),
        safeGet(`${process.env.REACT_APP_API_URL}/all-photo-requests`),
        safeGet(`${process.env.REACT_APP_API_URL}/get-address-requests-all`),
        safeGet(`${process.env.REACT_APP_API_URL}/all-offers`),
        safeGet(`${process.env.REACT_APP_API_URL}/user-get-all-last-views`),
        safeGet(`${process.env.REACT_APP_API_URL}/get-all-sendinterest`),
        safeGet(`${process.env.REACT_APP_API_URL}/get-all-contact-sent-properties`),
        safeGet(`${process.env.REACT_APP_API_URL}/user/alls`),
        safeGet(`${process.env.REACT_APP_API_URL}/fetch-active-users-datas-all-rent`),
        safeGet(`${process.env.REACT_APP_API_URL}/fetch-all-free-plans`),
        safeGet(`${process.env.REACT_APP_API_URL}/fetch-all-paid-plans`),
        safeGet(`${process.env.REACT_APP_API_URL}/raActive-buyerAssistance-all-plans-rent`),
        safeGet(`${process.env.REACT_APP_API_URL}/buyer-bills-rent`),
        safeGet(`${process.env.REACT_APP_API_URL}/buyer-bills/free-with-assistance-rent`),
        safeGet(`${process.env.REACT_APP_API_URL}/buyer-bills/non-free-with-assistance-rent`),
        safeGet(`${process.env.REACT_APP_API_URL}/payments-with-plan/paid-buyer`),
        safeGet(`${process.env.REACT_APP_API_URL}/properties/pre-approved-all-rent`),
        safeGet(`${process.env.REACT_APP_API_URL}/fetch-alls-datas-all`),
        safeGet(`${process.env.REACT_APP_API_URL}/properties/pending-rent`),
        safeGet(`${process.env.REACT_APP_API_URL}/properties/deleted-rent`),
        safeGet(`${process.env.REACT_APP_API_URL}/all-expired-properties`),
        safeGet(`${process.env.REACT_APP_API_URL}/fetch-buyerAssistance-pending-rent`),
        safeGet(`${process.env.REACT_APP_API_URL}/fetch-buyer-assistance-rent`),
        safeGet(`${process.env.REACT_APP_API_URL}/payments/pay-failed`),
        safeGet(`${process.env.REACT_APP_API_URL}/payments/pay-now`),
        safeGet(`${process.env.REACT_APP_API_URL}/payments/pay-later`),
        safeGet(`${process.env.REACT_APP_API_URL}/payments-with-plan/pay-failed-buyer`),
        safeGet(`${process.env.REACT_APP_API_URL}/payments-with-plan/pay-now-buyer`),
        safeGet(`${process.env.REACT_APP_API_URL}/payments-with-plan/pay-later-buyer`),
        safeGet(`${process.env.REACT_APP_API_URL}/followup-list`),
        safeGet(`${process.env.REACT_APP_API_URL}/followup-list-buyer`),
        safeGet(`${process.env.REACT_APP_API_URL}/bills`),
        safeGet(`${process.env.REACT_APP_API_URL}/buyer-bills-rent`),
      ]);

      const contactData = contactRes.data.contactRequestsData || [];
      const favoriteData = favoriteRes.data.favoriteRequestsData || [];
      const photoData = Array.isArray(photoRes.data) ? photoRes.data : [];
      const addressData = addressRes.data.requests || [];
      const offersData = offersRes.data.offers || [];
      const viewedData = Array.isArray(viewedRes.data) ? viewedRes.data : [];
      const interestData = interestRes.data.interestRequestsData || [];
      const calledData = calledRes.data.success ? (calledRes.data.properties || []) : [];
      const allUsersRaw = (loginUsersRes.data?.data && Array.isArray(loginUsersRes.data.data)) ? loginUsersRes.data.data : [];

      const userMap = new Map();
      allUsersRaw.forEach((u) => {
        const phone = u.phone || '';
        if (!phone) return;
        const existing = userMap.get(phone);
        if (!existing) { userMap.set(phone, u); return; }
        const pri = (s) => (s === 'verified' ? 2 : s === 'pending' ? 1 : 0);
        if (pri(u.otpStatus) > pri(existing.otpStatus)) { userMap.set(phone, u); return; }
        if (pri(u.otpStatus) === pri(existing.otpStatus)) {
          const ed = existing.loginDate ? new Date(existing.loginDate) : null;
          const cd = u.loginDate ? new Date(u.loginDate) : null;
          if ((!ed && cd) || (ed && cd && cd > ed)) userMap.set(phone, u);
        }
      });
      const allUsers = Array.from(userMap.values());

      const rangeUsers = allUsers.filter(item => inRange(item.loginDate));
      const reported = rangeUsers.filter(u => u.remarks === 'seller' || u.remarks === 'buyer' || u.remarks === 'visitor');
      const unreported = rangeUsers.filter(u => !u.remarks || (u.remarks !== 'seller' && u.remarks !== 'buyer' && u.remarks !== 'visitor'));

      setLoginCounts({
        totalLogin: rangeUsers.length,
        reported: reported.length,
        unreported: unreported.length,
        owner: rangeUsers.filter(u => u.remarks === 'seller').length,
        tenant: rangeUsers.filter(u => u.remarks === 'buyer').length,
        visitor: rangeUsers.filter(u => u.remarks === 'visitor').length,
        conversionPaid: rangeUsers.filter(u => u.conversionStatus === 'paid').length,
        conversionFree: rangeUsers.filter(u => u.conversionStatus === 'free').length,
        conversionPending: rangeUsers.filter(u => !u.conversionStatus || u.conversionStatus === 'pending').length,
      });

      const approvedData = Array.isArray(approvedRes.data?.users) ? approvedRes.data.users : [];
      const freePlansData = Array.isArray(freePlansRes.data?.data) ? freePlansRes.data.data : [];
      const paidPlansData = Array.isArray(paidPlansRes.data?.data) ? paidPlansRes.data.data : [];

      const freeRentIds = new Set();
      freePlansData.forEach(item => {
        if (Array.isArray(item.properties)) {
          item.properties.forEach(p => { if (p.rentId) freeRentIds.add(p.rentId); });
        }
      });
      const paidRentIds = new Set();
      paidPlansData.forEach(item => {
        if (Array.isArray(item.properties)) {
          item.properties.forEach(p => { if (p.rentId) paidRentIds.add(p.rentId); });
        }
      });

      const rangeApproved = approvedData.filter(item => inRange(item.createdAt));
      const rangeFreeProps = rangeApproved.filter(item => freeRentIds.has(item.rentId) && !paidRentIds.has(item.rentId));
      const rangePaidProps = rangeApproved.filter(item => paidRentIds.has(item.rentId));

      const baActiveData = baActiveRes.data?.data || [];
      const allBuyerBills = allBuyerBillsRes.data?.data || [];

      const baFreeIds = new Set((baFreeRes.data.data || []).map(item => item.buyerAssistance?.Ra_Id).filter(Boolean));
      const baPaidIds = new Set((baPaidRes.data.data || []).map(item => item.buyerAssistance?.Ra_Id).filter(Boolean));

      const payuBuyerData = payuBuyerRes.data.data || [];
      payuBuyerData.forEach(p => {
        if (p.Ra_Id) baPaidIds.add(p.Ra_Id);
      });

      allBuyerBills.forEach(bill => {
        const raId = bill.Ra_Id;
        if (raId && !baFreeIds.has(raId) && !baPaidIds.has(raId)) {
          if (bill.paymentType?.toLowerCase() === 'free') baFreeIds.add(raId);
          else baPaidIds.add(raId);
        }
      });

      const rangeBA = baActiveData.filter(item => {
        if (item.isDeleted) return false;
        return inRange(item.createdAt) || inRange(item.planDetails?.planCreatedAt) || inRange(item.updatedAt);
      });
      const rangeBAFree = rangeBA.filter(item => baFreeIds.has(item.Ra_Id) && !baPaidIds.has(item.Ra_Id));
      const rangeBAPaid = rangeBA.filter(item => baPaidIds.has(item.Ra_Id));

      setPropertyCounts({
        totalCreated: rangeApproved.length,
        freeProperty: rangeFreeProps.length,
        paidProperty: rangePaidProps.length,
        tenantTotal: rangeBA.length,
        tenantFree: rangeBAFree.length,
        tenantPaid: rangeBAPaid.length,
      });

      const preApprovedUsers = preApprovedRes.data.users || [];
      const allPropsData = allPropsRes.data.users || [];
      const expiredFromAll = allPropsData.filter(p => p.status === 'expired');
      const mergedPreApproved = new Map();
      preApprovedUsers.forEach(p => mergedPreApproved.set(p.rentId, p));
      expiredFromAll.forEach(p => { if (!mergedPreApproved.has(p.rentId)) mergedPreApproved.set(p.rentId, p); });
      const preApprovedInRange = Array.from(mergedPreApproved.values()).filter(p => inRange(p.createdAt));

      const pendingUsers = pendingRes.data.users || [];
      const pendingInRange = pendingUsers.filter(p => inRange(p.createdAt));

      const deletedData = deletedRes.data.data || [];
      const deletedUsers = deletedData.filter(p => p.status === 'delete');
      const deletedInRange = deletedUsers.filter(p => inRange(p.updatedAt) || inRange(p.deletedAt) || inRange(p.createdAt));

      const expiredPlans = expiredRes.data.expiredPlans || [];
      const expiredInRange = expiredPlans.filter(p => inRange(p.expiredAt) || inRange(p.updatedAt) || inRange(p.createdAt));

      const pendingBAData = pendingBARes.data?.data || [];
      const pendingBAActive = pendingBAData.filter(item => !item.isDeleted);
      const pendingBAInRange = pendingBAActive.filter(p => inRange(p.createdAt));

      const allBAData = allBARes.data?.data || [];
      const deletedBA = allBAData.filter(item => item.isDeleted === true);
      const deletedBAInRange = deletedBA.filter(p => inRange(p.updatedAt) || inRange(p.deletedAt) || inRange(p.createdAt));

      const unreportedInRange = allUsers.filter(u => {
        if (!inRange(u.loginDate)) return false;
        return !u.remarks || (u.remarks !== 'seller' && u.remarks !== 'buyer' && u.remarks !== 'visitor');
      }).length;
      const conversionPendingInRange = allUsers.filter(u => {
        if (!inRange(u.loginDate)) return false;
        return !u.conversionStatus || u.conversionStatus === 'pending';
      }).length;

      setPropertyStatusCounts({
        preApproved: preApprovedInRange.length,
        pending: pendingInRange.length,
        deleted: deletedInRange.length,
        expired: expiredInRange.length,
        tenantPending: pendingBAInRange.length,
        tenantDeleted: deletedBAInRange.length,
        unreported: unreportedInRange,
        conversionPending: conversionPendingInRange,
      });

      const propPayFailedData = propPayFailedRes.data.payments || propPayFailedRes.data.data || [];
      const propPayNowData = propPayNowRes.data.payments || propPayNowRes.data.data || [];
      const propPayLaterData = propPayLaterRes.data.payments || propPayLaterRes.data.data || [];
      const tenantPayFailedData = tenantPayFailedRes.data.data || [];
      const tenantPayNowData = tenantPayNowRes.data.data || [];
      const tenantPayLaterData = tenantPayLaterRes.data.data || [];

      setPaymentCounts({
        propPayFailed: propPayFailedData.filter(p => p.payustatususer !== 'paid' && (inRange(p.createdAt) || inRange(p.updatedAt))).length,
        propPayNow: propPayNowData.filter(p => p.payustatususer !== 'paid' && (inRange(p.createdAt) || inRange(p.updatedAt))).length,
        propPayLater: propPayLaterData.filter(p => p.payustatususer !== 'paid' && (inRange(p.createdAt) || inRange(p.updatedAt))).length,
        tenantPayFailed: tenantPayFailedData.filter(p => inRange(p.createdAt) || inRange(p.updatedAt)).length,
        tenantPayNow: tenantPayNowData.filter(p => inRange(p.createdAt) || inRange(p.updatedAt)).length,
        tenantPayLater: tenantPayLaterData.filter(p => inRange(p.createdAt) || inRange(p.updatedAt)).length,
      });

      setActionsCounts({
        contactViewed: contactData.reduce((sum, item) => sum + (item.contactRequestedUserPhoneNumbers || []).filter(r => inRange(r.date)).length, 0),
        favoriteList: favoriteData.filter(item => inRange(item.updatedAt || item.createdAt)).length,
        photoRequest: photoData.filter(item => inRange(item.createdAt)).length,
        addressRequests: addressData.filter(item => inRange(item.createdAt)).length,
        offerRaised: offersData.filter(item => inRange(item.createdAt)).length,
        viewedProperties: viewedData.filter(item => inRange(item.createdAt || item.viewedAt)).length,
        sendInterest: interestData.filter(item => inRange(item.createdAt)).length,
        calledList: calledData.filter(item => inRange(item.contactedAt)).length,
      });

      const propFollowupData = Array.isArray(propFollowupRes.data?.data) ? propFollowupRes.data.data : [];
      const tenantFollowupData = Array.isArray(tenantFollowupRes.data?.data) ? tenantFollowupRes.data.data : [];
      setFollowupCounts({
        propertyFollowups: propFollowupData.filter(item => inRange(item.createdAt) || inRange(item.followupDate) || inRange(item.updatedAt)).length,
        tenantFollowups: tenantFollowupData.filter(item => inRange(item.createdAt) || inRange(item.followupDate) || inRange(item.updatedAt)).length,
      });

      const propBillsData = Array.isArray(propBillsRes.data?.data) ? propBillsRes.data.data : [];
      const tenantBillsData = Array.isArray(tenantBillsRes.data?.data) ? tenantBillsRes.data.data : [];
      const billAmount = (b) => {
        const v = Number(b.netAmount ?? b.billAmount ?? 0);
        return Number.isFinite(v) ? v : 0;
      };
      const billInRange = (b) => inRange(b.createdAt) || inRange(b.billDate) || inRange(b.updatedAt);

      const propBillsFiltered = propBillsData.filter(billInRange);
      const tenantBillsFiltered = tenantBillsData.filter(billInRange);
      const propertyBillAmount = propBillsFiltered.reduce((sum, b) => sum + billAmount(b), 0);
      const tenantBillAmount = tenantBillsFiltered.reduce((sum, b) => sum + billAmount(b), 0);

      setBillCounts({
        propertyBillCount: propBillsFiltered.length,
        propertyBillAmount,
        tenantBillCount: tenantBillsFiltered.length,
        tenantBillAmount,
        totalBillCount: propBillsFiltered.length + tenantBillsFiltered.length,
        totalBillAmount: propertyBillAmount + tenantBillAmount,
      });
    } catch (error) {
      console.error('Error fetching alltime report data:', error);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchAlltimeData(appliedRange.start, appliedRange.end);
  }, [appliedRange, fetchAlltimeData]);

  const handleApply = () => {
    if (!startDate || !endDate) return;
    if (moment(startDate).isAfter(moment(endDate))) {
      alert('Start date cannot be after end date.');
      return;
    }
    setAppliedRange({ start: startDate, end: endDate });
  };

  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  const adminName = reduxAdminName || localStorage.getItem('adminName');
  const adminRole = reduxAdminRole || localStorage.getItem('adminRole');

  const [allowedRoles, setAllowedRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileName = 'Admin Alltime Report';

  useEffect(() => {
    if (reduxAdminName) localStorage.setItem('adminName', reduxAdminName);
    if (reduxAdminRole) localStorage.setItem('adminRole', reduxAdminRole);
  }, [reduxAdminName, reduxAdminRole]);

  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-view`, {
          userName: adminName,
          role: adminRole,
          viewedFile: fileName,
          viewTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        });
      } catch (err) {
        console.error('Error recording view:', err);
      }
    };
    if (adminName && adminRole) recordDashboardView();
  }, [adminName, adminRole]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-role-permissions`);
        const rolePermissions = res.data.find((perm) => perm.role === adminRole);
        const viewed = rolePermissions?.viewedFiles?.map(f => f.trim()) || [];
        setAllowedRoles(viewed);
      } catch (err) {
        console.error('Error fetching role permissions:', err);
      } finally {
        setLoading(false);
      }
    };
    if (adminRole) fetchPermissions();
  }, [adminRole]);

  if (loading) return <p>Loading...</p>;

  if (!allowedRoles.includes(fileName)) {
    return (
      <div className="text-center text-danger fw-bold mt-4">
        Only admin is allowed to view this file.
      </div>
    );
  }

  const rangeLabel = `${moment(appliedRange.start).format('DD-MM-YYYY')} → ${moment(appliedRange.end).format('DD-MM-YYYY')}`;

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-3">
        <h2 className="mb-1">Rent Pondy Alltime Report - Admin</h2>
        <p className="text-muted mb-0">
          Welcome, <strong>{adminName || 'Admin'}</strong>
          <span className="ms-3 badge bg-light text-secondary border" style={{ fontSize: '12px' }}>
            Range: {rangeLabel}
          </span>
        </p>
      </div>

      {/* Date Range Filter */}
      <div className="card mb-3">
        <div className="card-body py-3">
          <div className="row g-2 align-items-end">
            <div className="col-12 col-md-4">
              <label className="form-label mb-1" style={{ fontSize: '13px' }}>Start Date</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={startDate}
                max={endDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label mb-1" style={{ fontSize: '13px' }}>End Date</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={endDate}
                min={startDate}
                max={moment().format('YYYY-MM-DD')}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4 d-flex gap-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleApply}
                disabled={isLoadingData}
              >
                {isLoadingData ? 'Loading...' : 'Apply Filter'}
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setStartDate(defaultStart);
                  setEndDate(defaultEnd);
                  setAppliedRange({ start: defaultStart, end: defaultEnd });
                }}
                disabled={isLoadingData}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={tabNavStyle}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            style={tabStyle(activeTab === tab.key)}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>

        {/* Tab 1: Actions */}
        {activeTab === 'actions' && (
          <div>
            <h5 className="mb-3 text-muted" style={{ fontSize: '14px' }}>
              Action Summary — {rangeLabel}
            </h5>
            <Table striped bordered hover responsive className="table-sm align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>SL NO</th>
                  <th>DESCRIPTION</th>
                  <th style={{ width: '140px' }}>TOTAL ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1</td><td>CONTACT VIEWED</td><td>{actionsCounts.contactViewed}</td></tr>
                <tr><td>2</td><td>FAVORITE LIST</td><td>{actionsCounts.favoriteList}</td></tr>
                <tr><td>3</td><td>PHOTO REQUEST</td><td>{actionsCounts.photoRequest}</td></tr>
                <tr><td>4</td><td>ADDRESS REQUESTS</td><td>{actionsCounts.addressRequests}</td></tr>
                <tr><td>5</td><td>OFFER RAISED</td><td>{actionsCounts.offerRaised}</td></tr>
                <tr><td>6</td><td>VIEWED PROPERTIES</td><td>{actionsCounts.viewedProperties}</td></tr>
                <tr><td>7</td><td>SEND INTEREST</td><td>{actionsCounts.sendInterest}</td></tr>
                <tr><td>8</td><td>CALLED LIST</td><td>{actionsCounts.calledList}</td></tr>
              </tbody>
            </Table>
          </div>
        )}

        {/* Tab 2: Login */}
        {activeTab === 'login' && (
          <div>
            <h5 className="mb-3 text-muted" style={{ fontSize: '14px' }}>
              Login Summary — {rangeLabel}
            </h5>
            <Table striped bordered hover responsive className="table-sm align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>SL NO</th>
                  <th>DESCRIPTION</th>
                  <th style={{ width: '140px' }}>COUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1</td><td>TOTAL LOGIN</td><td>{loginCounts.totalLogin}</td></tr>
                <tr><td>2</td><td>REPORTED</td><td>{loginCounts.reported}</td></tr>
                <tr><td>3</td><td>UNREPORTED</td><td>{loginCounts.unreported}</td></tr>
                <SectionHeader title="REPORTED BREAKDOWN" />
                <tr><td>4</td><td>OWNER</td><td>{loginCounts.owner}</td></tr>
                <tr><td>5</td><td>TENANT</td><td>{loginCounts.tenant}</td></tr>
                <tr><td>6</td><td>VISITOR</td><td>{loginCounts.visitor}</td></tr>
                <SectionHeader title="CONVERSION BREAKDOWN" />
                <tr><td>7</td><td>PAID</td><td>{loginCounts.conversionPaid}</td></tr>
                <tr><td>8</td><td>FREE</td><td>{loginCounts.conversionFree}</td></tr>
                <tr><td>9</td><td>PENDING</td><td>{loginCounts.conversionPending}</td></tr>
              </tbody>
            </Table>
          </div>
        )}

        {/* Tab 3: Property */}
        {activeTab === 'property' && (
          <div>
            <h5 className="mb-3 text-muted" style={{ fontSize: '14px' }}>
              Property & Tenant Management (Approved) — {rangeLabel}
            </h5>
            <Table striped bordered hover responsive className="table-sm align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>SL NO</th>
                  <th>DESCRIPTION</th>
                  <th style={{ width: '140px' }}>COUNT</th>
                </tr>
              </thead>
              <tbody>
                <SectionHeader title="PROPERTY" />
                <tr><td>1</td><td>NO. OF PROPERTY CREATED</td><td>{propertyCounts.totalCreated}</td></tr>
                <tr><td>2</td><td>FREE PROPERTY</td><td>{propertyCounts.freeProperty}</td></tr>
                <tr><td>3</td><td>PAID PROPERTY</td><td>{propertyCounts.paidProperty}</td></tr>
                <SectionHeader title="TENANT" />
                <tr><td>4</td><td>NO. OF TENANT ASSISTANCE CREATED</td><td>{propertyCounts.tenantTotal}</td></tr>
                <tr><td>5</td><td>FREE TENANT ASSISTANCE</td><td>{propertyCounts.tenantFree}</td></tr>
                <tr><td>6</td><td>PAID TENANT ASSISTANCE</td><td>{propertyCounts.tenantPaid}</td></tr>
              </tbody>
            </Table>
          </div>
        )}

        {/* Tab 4: Property Status */}
        {activeTab === 'status' && (
          <div>
            <h5 className="mb-3 text-muted" style={{ fontSize: '14px' }}>
              Property Status Summary — {rangeLabel}
            </h5>
            <Table striped bordered hover responsive className="table-sm align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>SL NO</th>
                  <th>DESCRIPTION</th>
                  <th style={{ width: '140px' }}>COUNT</th>
                </tr>
              </thead>
              <tbody>
                <SectionHeader title="PROPERTY" />
                <tr><td>1</td><td>PRE-APPROVED</td><td>{propertyStatusCounts.preApproved}</td></tr>
                <tr><td>2</td><td>PENDING</td><td>{propertyStatusCounts.pending}</td></tr>
                <tr><td>3</td><td>DELETED</td><td>{propertyStatusCounts.deleted}</td></tr>
                <tr><td>4</td><td>EXPIRED</td><td>{propertyStatusCounts.expired}</td></tr>
                <SectionHeader title="TENANT" />
                <tr><td>5</td><td>PENDING TENANT ASSISTANCE</td><td>{propertyStatusCounts.tenantPending}</td></tr>
                <tr><td>6</td><td>DELETED TENANT ASSISTANCE</td><td>{propertyStatusCounts.tenantDeleted}</td></tr>
                <SectionHeader title="LOGIN REPORT" />
                <tr><td>7</td><td>UNREPORTED</td><td>{propertyStatusCounts.unreported}</td></tr>
                <tr><td>8</td><td>CONVERSION PENDING</td><td>{propertyStatusCounts.conversionPending}</td></tr>
              </tbody>
            </Table>
          </div>
        )}

        {/* Tab 5: Payments */}
        {activeTab === 'payments' && (
          <div>
            <h5 className="mb-3 text-muted" style={{ fontSize: '14px' }}>
              Payment Management — {rangeLabel}
            </h5>
            <Table striped bordered hover responsive className="table-sm align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>SL NO</th>
                  <th>DESCRIPTION</th>
                  <th style={{ width: '140px' }}>COUNT</th>
                </tr>
              </thead>
              <tbody>
                <SectionHeader title="PROPERTY PAYMENT MANAGEMENT" />
                <tr><td>1</td><td>PAY FAILED</td><td>{paymentCounts.propPayFailed}</td></tr>
                <tr><td>2</td><td>PAY NOW</td><td>{paymentCounts.propPayNow}</td></tr>
                <tr><td>3</td><td>PAY LATER</td><td>{paymentCounts.propPayLater}</td></tr>
                <SectionHeader title="TENANT PAYMENT MANAGEMENT" />
                <tr><td>4</td><td>PAY FAILED</td><td>{paymentCounts.tenantPayFailed}</td></tr>
                <tr><td>5</td><td>PAY NOW</td><td>{paymentCounts.tenantPayNow}</td></tr>
                <tr><td>6</td><td>PAY LATER</td><td>{paymentCounts.tenantPayLater}</td></tr>
              </tbody>
            </Table>
          </div>
        )}

        {/* Tab 6: Follow-ups */}
        {activeTab === 'followups' && (
          <div>
            <h5 className="mb-3 text-muted" style={{ fontSize: '14px' }}>
              Follow-up Data — {rangeLabel}
            </h5>
            <Table striped bordered hover responsive className="table-sm align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>SL NO</th>
                  <th>DESCRIPTION</th>
                  <th style={{ width: '140px' }}>COUNT</th>
                </tr>
              </thead>
              <tbody>
                <SectionHeader title="PROPERTY" />
                <tr><td>1</td><td>PROPERTY FOLLOW-UPS</td><td>{followupCounts.propertyFollowups}</td></tr>
                <SectionHeader title="TENANT" />
                <tr><td>2</td><td>TENANT FOLLOW-UPS</td><td>{followupCounts.tenantFollowups}</td></tr>
              </tbody>
            </Table>
          </div>
        )}

        {/* Tab 7: Bill Report */}
        {activeTab === 'bills' && (
          <div>
            <h5 className="mb-3 text-muted" style={{ fontSize: '14px' }}>
              Bill Report — {rangeLabel}
            </h5>
            <Table striped bordered hover responsive className="table-sm align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>SL NO</th>
                  <th>DESCRIPTION</th>
                  <th style={{ width: '140px' }}>BILL COUNT</th>
                  <th style={{ width: '160px' }}>TOTAL AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                <SectionHeader title="PROPERTY" colSpan={4} />
                <tr>
                  <td>1</td>
                  <td>PROPERTY BILLS</td>
                  <td>{billCounts.propertyBillCount}</td>
                  <td>{billCounts.propertyBillAmount.toLocaleString('en-IN')}</td>
                </tr>
                <SectionHeader title="TENANT" colSpan={4} />
                <tr>
                  <td>2</td>
                  <td>TENANT BILLS</td>
                  <td>{billCounts.tenantBillCount}</td>
                  <td>{billCounts.tenantBillAmount.toLocaleString('en-IN')}</td>
                </tr>
                <tr style={{ fontWeight: 700, backgroundColor: '#fff3cd' }}>
                  <td colSpan="2" className="text-end">GRAND TOTAL</td>
                  <td>{billCounts.totalBillCount}</td>
                  <td>{billCounts.totalBillAmount.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminAlltimeReport;
