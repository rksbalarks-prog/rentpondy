import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const PayUPointsForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    planName = '',
    amount = '',
    phoneNumber = '',
    planId = '',
    points = 0,
  } = location.state || {};

  const [form, setForm] = useState({
    txnid: 'points_' + Date.now(),
    amount: '',
    productinfo: 'Points Plan',
    firstname: 'User',
    email: `user${Date.now()}@rentpondy.com`,
    phone: '',
    planName: '',
    planId: '',
    points: 0,
  });

  const [popup, setPopup] = useState({ visible: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [hoverLater, setHoverLater] = useState(false);
  const [hoverNow, setHoverNow] = useState(false);

  const payLaterStyle = {
    flex: 1,
    margin: '0 5px',
    background: hoverLater ? '#F3EEFA' : 'white',
    color: '#4F4B7E',
    border: '1px solid #4F4B7E',
    padding: '10px',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const payNowStyle = {
    flex: 1,
    margin: '0 5px',
    background: hoverNow
      ? 'linear-gradient(135deg, #3d3a66 0%, #5d3c85 100%)'
      : 'linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      planName,
      amount,
      phone: phoneNumber,
      planId,
      points,
    }));
  }, [planName, amount, phoneNumber, planId, points]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const initiatePayUPayment = async () => {
    const postData = { ...form, payustatususer: 'pay now', planType: 'points' };
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/payu/points-payment`,
      postData
    );
    const payuData = response.data;

    const formElement = document.createElement('form');
    formElement.method = 'POST';
    formElement.action = 'https://secure.payu.in/_payment';

    Object.entries(payuData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      formElement.appendChild(input);
    });

    document.body.appendChild(formElement);
    formElement.submit();
  };

  const handlePayNow = async () => {
    if (!form.amount || !form.firstname || !form.email || !form.phone || !form.planId) {
      setPopup({ visible: true, message: 'Please fill all required fields.', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/select-points-plan`, {
        phoneNumber: form.phone,
        planId: form.planId,
        points: form.points,
        amount: form.amount,
      });

      await initiatePayUPayment();
    } catch (error) {
      const errMsg = error?.response?.data?.message || 'Something went wrong.';
      setPopup({ visible: true, message: errMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePayLater = async () => {
    if (!form.planId || !form.phone) {
      setPopup({ visible: true, message: 'Missing planId or phone number.', type: 'error' });
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${process.env.REACT_APP_API_URL}/select-points-plan`, {
        phoneNumber: form.phone,
        planId: form.planId,
        points: form.points,
        amount: form.amount,
      });

      const postData = { ...form, payustatususer: 'pay later', planType: 'points' };
      await axios.post(`${process.env.REACT_APP_API_URL}/payu/points-payment-later`, postData);

      setPopup({
        visible: true,
        message: 'Your request to pay later has been saved successfully.',
        type: 'success',
      });

      setForm((prev) => ({
        ...prev,
        txnid: 'points_' + Date.now(),
        email: `user${Date.now()}@rentpondy.com`,
      }));

      setTimeout(() => {
        navigate('/points-plans');
      }, 3000);
    } catch (error) {
      const errMsg = error?.response?.data?.message || 'Failed to process pay later request.';
      setPopup({ visible: true, message: errMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const rowStyle = { display: 'flex', alignItems: 'center', marginBottom: '12px' };
  const labelStyle = { width: '120px', fontWeight: 600 };
  const inputStyle = { flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '14px' };

  return (
    <div
      style={{
        maxWidth: '440px',
        margin: '50px auto',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(79,75,126,0.15)',
        backgroundColor: '#fff',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)',
          margin: '-30px -30px 24px',
          padding: '24px 30px',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Points Payment</h2>
        <p style={{ margin: '4px 0 0', fontSize: 13, opacity: 0.85 }}>
          Buy points via PayU — securely
        </p>
      </div>

      {form.points > 0 && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(102,126,234,0.08), rgba(245,87,108,0.08))',
            border: '1px solid rgba(79,75,126,0.15)',
            borderRadius: 12,
            padding: '12px 14px',
            marginBottom: 18,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>
              You'll receive
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#4F4B7E' }}>{form.points} pts</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>
              You pay
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#f5576c' }}>₹{form.amount}</div>
          </div>
        </div>
      )}

      <form>
        <div style={rowStyle}>
          <label style={labelStyle}>Plan</label>
          <input type="text" value={form.planName} readOnly style={inputStyle} />
        </div>
        <div style={rowStyle}>
          <label style={labelStyle}>Points</label>
          <input type="number" value={form.points} readOnly style={inputStyle} />
        </div>
        <div style={rowStyle}>
          <label style={labelStyle}>Amount</label>
          <input type="number" value={form.amount} readOnly style={inputStyle} />
        </div>
        <div style={rowStyle}>
          <label style={labelStyle}>Phone</label>
          <input type="tel" value={form.phone} readOnly style={inputStyle} />
        </div>
        <div style={rowStyle}>
          <label style={labelStyle}>Full Name</label>
          <input type="text" name="firstname" value={form.firstname} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={rowStyle}>
          <label style={labelStyle}>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button
            type="button"
            onClick={handlePayLater}
            disabled={loading}
            onMouseEnter={() => setHoverLater(true)}
            onMouseLeave={() => setHoverLater(false)}
            style={payLaterStyle}
          >
            Pay Later
          </button>
          <button
            type="button"
            onClick={handlePayNow}
            disabled={loading}
            onMouseEnter={() => setHoverNow(true)}
            onMouseLeave={() => setHoverNow(false)}
            style={payNowStyle}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </form>

      {popup.visible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: 24,
              borderRadius: 12,
              textAlign: 'center',
              maxWidth: 320,
              color: popup.type === 'error' ? '#DC2626' : '#333',
            }}
          >
            <p style={{ margin: '0 0 16px' }}>{popup.message}</p>
            <button
              onClick={() => setPopup({ visible: false, message: '', type: '' })}
              style={{
                padding: '8px 18px',
                background: 'linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 8,
                border: 'none',
                fontWeight: 600,
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayUPointsForm;
