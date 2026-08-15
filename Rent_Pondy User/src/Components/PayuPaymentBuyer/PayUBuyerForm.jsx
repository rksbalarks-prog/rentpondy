// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';

// const PayUBuyerForm = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const {
//     planName = '',
//     amount = '',
//     phoneNumber = '',
//     planId = '',
//     Ra_Id = ''
//   } = location.state || {};

//   const [form, setForm] = useState({
//     txnid: 'txn_' + Date.now(),
//     amount: '',
//     productinfo: 'Subscription Plan',
//     firstname: 'Buyer',
//     email: `buyer${Date.now()}@gmail.com`,
//     phone: '',
//     planName: '',
//     planId: '',
//     Ra_Id: ''
//   });

//   const [popup, setPopup] = useState({ visible: false, message: '', type: '', planName: '' });
//   const [loading, setLoading] = useState(false);

//   const [hoverLater, setHoverLater] = useState(false);
//   const [hoverNow, setHoverNow] = useState(false);

//   const payLaterStyle = {
//     flex: 1,
//     margin: '0 5px',
//     background: hoverLater ? '#E6F7FF' : 'white',
//     color: '#00ADF2',
//     border: '1px solid #00ADF2',
//     padding: '10px',
//     borderRadius: '8px',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease'
//   };

//   const payNowStyle = {
//     flex: 1,
//     margin: '0 5px',
//     background: hoverNow ? '#0095C5' : '#00ADF2',
//     color: 'white',
//     padding: '10px',
//     borderRadius: '8px',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease'
//   };


//   useEffect(() => {
//     setForm((prev) => ({
//       ...prev,
//       planName,
//       amount,
//       phone: phoneNumber,
//       planId,
//       Ra_Id
//     }));
//   }, [planName, amount, phoneNumber, planId, Ra_Id]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const initiatePayUPayment = async () => {
//     const postData = {
//       ...form,
//       Ra_Id: form.Ra_Id,
//       payustatususer: 'pay now'
//     };
//     delete postData.Ra_Id;

//     const response = await axios.post(`${process.env.REACT_APP_API_URL}/payu/payment-buyer`, postData);
//     const payuData = response.data;

//     const formElement = document.createElement('form');
//     formElement.method = 'POST';
//     formElement.action = 'https://secure.payu.in/_payment';

//     Object.entries(payuData).forEach(([key, value]) => {
//       const input = document.createElement('input');
//       input.type = 'hidden';
//       input.name = key;
//       input.value = value;
//       formElement.appendChild(input);
//     });

//     document.body.appendChild(formElement);
//     formElement.submit();
//   };

//   const handlePayNow = async () => {
//     if (!form.amount || !form.firstname || !form.email || !form.phone || !form.planName || !form.planId || !form.Ra_Id) {
//       setPopup({ visible: true, message: 'Please fill all required fields.', type: 'error' });
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.post(`${process.env.REACT_APP_API_URL}/select-buyer-plan`, {
//         phoneNumber: form.phone,
//         planId: form.planId,
//         Ra_Id: form.Ra_Id
//       });
//       await initiatePayUPayment();
//     } catch (error) {
//       const errMsg = error?.response?.data?.message || 'Something went wrong.';
//       if (errMsg.includes('already selected')) {
//         setPopup({
//           visible: true,
//           message: `You have already selected ${form.planName} plan. Please complete payment.`,
//           planName: form.planName,
//           type: 'info'
//         });
//       } else {
//         setPopup({ visible: true, message: errMsg, type: 'error' });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayLater = async () => {
//     if (!form.planId || !form.Ra_Id || !form.phone) {
//       setPopup({ visible: true, message: 'Missing planId, Ra_Id or phone.', type: 'error' });
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.post(`${process.env.REACT_APP_API_URL}/select-buyer-plan`, {
//         phoneNumber: form.phone,
//         planId: form.planId,
//         Ra_Id: form.Ra_Id
//       });

//       const postData = {
//         ...form,
//         Ra_Id: form.Ra_Id,
//         payustatususer: 'pay later'
//       };
//       delete postData.Ra_Id;

//       await axios.post(`${process.env.REACT_APP_API_URL}/payu/payment-later-buyer`, postData);

//       setPopup({
//         visible: true,
//         message: 'Your request to pay later has been saved successfully.',
//         type: 'success'
//       });

//       setForm((prev) => ({
//         ...prev,
//         txnid: 'txn_' + Date.now(),
//         email: `buyer${Date.now()}@gmail.com`
//       }));

//       setTimeout(() => {
//         navigate('/pondicherry');
//       }, 3000);
//     } catch (error) {
//       const errMsg = error?.response?.data?.message || 'Failed to process pay later request.';
//       setPopup({ visible: true, message: errMsg, type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleContinue = async () => {
//     setPopup({ visible: false, message: '', type: '', planName: '' });
//     await initiatePayUPayment();
//   };

//   const handleRemove = async () => {
//     try {
//       await axios.put(`${process.env.REACT_APP_API_URL}/plans/remove-phone/${form.phone}`);
//       setPopup({ visible: true, message: 'Phone number removed from selected plan.', type: 'success', planName: '' });
//       setTimeout(() => {
//         navigate('/Buyer-List-Filter');
//       }, 2500);
//     } catch (err) {
//       setPopup({ visible: true, message: 'Failed to remove phone number. Please try again.', type: 'error' });
//     }
//   };

//   const labelStyle = { fontWeight: 'bold', marginBottom: 5, display: 'block', fontSize: '14px', color: '#333' };

//   const inputStyle = {
//     width: '100%',
//     padding: '10px',
//     marginBottom: '18px',
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     fontSize: '14px'
//   };

//   return (
//     <div style={{
//       maxWidth: '420px',
//       margin: '50px auto',
//       padding: '30px',
//       borderRadius: '12px',
//       boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//       backgroundColor: '#ffffff',
//       fontFamily: 'Segoe UI, sans-serif'
//     }}>
//       <h2 style={{
//         textAlign: 'center',
//         marginBottom: '25px',
//         color: 'rgb(47,116,127)',
//         fontSize: '24px',
//         fontWeight: 'bold'
//       }}>PayU Buyer Payment</h2>

//       <form>
//         <label style={labelStyle}>Plan</label>
//         <input type="text" value={form.planName} readOnly style={inputStyle} />

//         <label style={labelStyle}>Amount (INR)</label>
//         <input type="number" value={form.amount} readOnly style={inputStyle} />

//         <label style={labelStyle}>Buyer Assistance ID</label>
//         <input type="text" value={form.Ra_Id} readOnly style={inputStyle} />

//         <label style={labelStyle}>Phone</label>
//         <input type="tel" value={form.phone} readOnly style={inputStyle} />

//         <label style={labelStyle}>Full Name</label>
//         <input type="text" name="firstname" value={form.firstname} onChange={handleChange} style={inputStyle} />

//         <label style={labelStyle}>Email</label>
//         <input type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle} />

//         {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//           <button type="button" onClick={handlePayLater} disabled={loading}
//             style={{
//               flex: 1, margin: '0 5px', background: 'white', color: '#00ADF2',
//               border: '1px solid #00ADF2', padding: '10px', borderRadius: '8px', fontWeight: '600'
//             }}>
//             Pay Later
//           </button>
//           <button type="button" onClick={handlePayNow} disabled={loading}
//             style={{
//               flex: 1, margin: '0 5px', background: '#00ADF2', color: 'white',
//               padding: '10px', borderRadius: '8px', fontWeight: '600'
//             }}>
//             {loading ? 'Processing...' : 'Pay Now'}
//           </button>
//         </div> */}

//   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
//         <button
//           type="button"
//           onClick={handlePayLater}
//           disabled={loading}
//           onMouseEnter={() => setHoverLater(true)}
//           onMouseLeave={() => setHoverLater(false)}
//           style={payLaterStyle}
//         >
//           Pay Later
//         </button>
//         <button
//           type="button"
//           onClick={handlePayNow}
//           disabled={loading}
//           onMouseEnter={() => setHoverNow(true)}
//           onMouseLeave={() => setHoverNow(false)}
//           style={payNowStyle}
//         >
//           {loading ? 'Processing...' : 'Pay Now'}
//         </button>
//       </div>

//       </form>

//       {popup.visible && (
//         <div style={{
//           position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
//           backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
//           justifyContent: 'center', alignItems: 'center', zIndex: 9999
//         }}>
//           <div style={{
//             backgroundColor: '#fff', padding: 20, borderRadius: 10,
//             textAlign: 'center', maxWidth: 320, color: popup.type === 'error' ? 'red' : 'black'
//           }}>
//             <p>{popup.message}</p>
//             {popup.planName ? (
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
//                 <button onClick={handleContinue}
//                   style={{ background: 'blue', color: 'white', padding: '6px 10px', borderRadius: 6 }}>
//                   Continue to Pay
//                 </button>
//                 <button onClick={handleRemove}
//                   style={{
//                     background: 'white', color: 'blue', boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',
//                     padding: '6px 10px', borderRadius: 6
//                   }}>
//                   Remove
//                 </button>
//               </div>
//             ) : (
//               <button onClick={() => setPopup({ visible: false, message: '', type: '', planName: '' })}
//                 style={{
//                   marginTop: 10, padding: '6px 12px', background: '#00ADF2',
//                   color: 'white', borderRadius: '6px', border: 'none'
//                 }}>
//                 OK
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PayUBuyerForm;








import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { getActiveBase, baseToPath } from '../../utils/cityBase';

const PayUBuyerForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    planName = '',
    amount = '',
    phoneNumber = '',
    planId = '',
    Ra_Id = ''  // Changed from Ra_Id to Ra_Id to match the API
  } = location.state || {};

  const [form, setForm] = useState({
    txnid: 'txn_' + Date.now(),
    amount: amount || '',
    productinfo: 'Subscription Plan',
    firstname: 'Buyer',
    email: `buyer${Date.now()}@gmail.com`,
    phone: phoneNumber || '',
    planName: planName || '',
    planId: planId || '',
    Ra_Id: Ra_Id || ''  // Changed from Ra_Id to Ra_Id
  });

  const [popup, setPopup] = useState({ visible: false, message: '', type: '', planName: '' });
  const [loading, setLoading] = useState(false);
  const [hoverLater, setHoverLater] = useState(false);
  const [hoverNow, setHoverNow] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      planName,
      amount,
      phone: phoneNumber,
      planId,
      Ra_Id  // Updated this line
    }));
  }, [planName, amount, phoneNumber, planId, Ra_Id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const initiatePayUPayment = async () => {
    const postData = {
      ...form,
      payustatususer: 'pay now'
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/payu/payment-buyer`, postData);
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
    } catch (error) {
      setPopup({ 
        visible: true, 
        message: 'Failed to initiate payment. Please try again.', 
        type: 'error' 
      });
    }
  };

  // const handlePayNow = async () => {
  //   if (!form.amount || !form.firstname || !form.email || !form.phone || !form.planName || !form.planId || !form.Ra_Id) {
  //     setPopup({ visible: true, message: 'Please fill all required fields.', type: 'error' });
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     await axios.post(`${process.env.REACT_APP_API_URL}/select-buyer-plan`, {
  //       phoneNumber: form.phone,
  //       planId: form.planId,
  //       Ra_Id: form.Ra_Id
  //     });
  //     await initiatePayUPayment();
  //   } catch (error) {
  //     const errMsg = error?.response?.data?.message || 'Something went wrong.';
  //     if (errMsg.includes('already selected')) {
  //       setPopup({
  //         visible: true,
  //         message: `You have already selected ${form.planName} plan. Please complete payment.`,
  //         planName: form.planName,
  //         type: 'info'
  //       });
  //     } else {
  //       setPopup({ visible: true, message: errMsg, type: 'error' });
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };



    const handlePayNow = async () => {
    if (!form.amount || !form.firstname || !form.email || !form.phone || !form.planName || !form.planId || !form.Ra_Id) {
      setPopup({ visible: true, message: 'Please fill all required fields.', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/select-buyer-plan`, {
        phoneNumber: form.phone,
        planId: form.planId, // This is now the correct MongoDB _id
        Ra_Id: form.Ra_Id
      });
      await initiatePayUPayment();
    } 
    catch (error) {
      const errMsg = error?.response?.data?.message || 'Something went wrong.';
      if (errMsg.includes('already selected')) {
        setPopup({
          visible: true,
          message: `You have already selected ${form.planName} plan. Please complete payment.`,
          planName: form.planName,
          type: 'info'
        });
      } else {
        setPopup({ visible: true, message: errMsg, type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayLater = async () => {
    if (!form.planId || !form.Ra_Id || !form.phone) {
      setPopup({ visible: true, message: 'Missing planId, Ra_Id or phone.', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/select-buyer-plan`, {
        phoneNumber: form.phone,
        planId: form.planId,
        Ra_Id: form.Ra_Id
      });

      const postData = {
        ...form,
        payustatususer: 'pay later'
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/payu/payment-later-buyer`, postData);

      setPopup({
        visible: true,
        message: 'Your request to pay later has been saved successfully.',
        type: 'success'
      });

      setTimeout(() => {
        navigate(baseToPath(getActiveBase()));
      }, 3000);
    } catch (error) {
      const errMsg = error?.response?.data?.message || 'Failed to process pay later request.';
      setPopup({ visible: true, message: errMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    setPopup({ visible: false, message: '', type: '', planName: '' });
    await initiatePayUPayment();
  };

  const handleRemove = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/plans/remove-phone/${form.phone}`);
      setPopup({ visible: true, message: 'Phone number removed from selected plan.', type: 'success', planName: '' });
      setTimeout(() => {
        navigate('/Buyer-List-Filter');
      }, 2500);
    } catch (err) {
      setPopup({ visible: true, message: 'Failed to remove phone number. Please try again.', type: 'error' });
    }
  };

  // const labelStyle = { 
  //   fontWeight: 'bold', 
  //   marginBottom: 5, 
  //   display: 'block', 
  //   fontSize: '14px', 
  //   color: '#333' 
  // };

  // const inputStyle = {
  //   width: '100%',
  //   padding: '10px',
  //   marginBottom: '18px',
  //   border: '1px solid #ccc',
  //   borderRadius: '8px',
  //   fontSize: '14px',
  //   backgroundColor: '#f9f9f9'
  // };
const rowStyle = { display: 'flex', alignItems: 'center', marginBottom: '12px' };
const labelStyle = { width: '120px', fontWeight: 600 }; // fixed width for alignment
const inputStyle = { flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '14px' };

  const payLaterStyle = {
    flex: 1,
    margin: '0 5px',
    background: hoverLater ? '#E6F7FF' : 'white',
    color: '#00ADF2',
    border: '1px solid #00ADF2',
    padding: '10px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const payNowStyle = {
    flex: 1,
    margin: '0 5px',
    background: hoverNow ? '#0095C5' : '#00ADF2',
    color: 'white',
    padding: '10px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{
      maxWidth: '420px',
      margin: '20px auto',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#ffffff',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '25px',
        color: 'rgb(47, 116, 127)',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>PayU Buyer Payment</h2>

      <form>
          <div style={rowStyle}>

        <label style={labelStyle}>Plan</label>
        <input 
          type="text" 
          value={form.planName} 
          readOnly 
          style={inputStyle} 
        />
          </div>

  <div style={rowStyle}>

        <label style={labelStyle}>Amount (INR)</label>
        <input 
          type="number" 
          value={form.amount} 
          readOnly 
          style={inputStyle} 
        />
          </div>

  <div style={rowStyle}>

         <label style={labelStyle}>Plan ID</label>
      <input 
        type="text" 
        value={form.planId} 
        readOnly 
        style={inputStyle} 
      />
        </div>

        <div style={rowStyle}>

      <label style={labelStyle}>Tenant Assistance ID</label>
      <input 
        type="text" 
        value={form.Ra_Id} 
        readOnly 
        style={inputStyle} 
      />
  </div>

        {/* <label style={labelStyle}>Buyer Assistance ID</label>
        <input 
          type="text" 
          name="Ra_Id"
          value={form.Ra_Id} 
          readOnly 
          style={inputStyle} 
        /> */}
  <div style={rowStyle}>

        <label style={labelStyle}>Phone</label>
        <input 
          type="tel" 
          value={form.phone} 
          readOnly 
          style={inputStyle} 
        />
          </div>

  <div style={rowStyle}>

        <label style={labelStyle}>Full Name</label>
        <input 
          type="text" 
          name="firstname" 
          value={form.firstname} 
          onChange={handleChange} 
          style={inputStyle} 
        />
          </div>

  <div style={rowStyle}>

        <label style={labelStyle}>Email</label>
        <input 
          type="email" 
          name="email" 
          value={form.email} 
          onChange={handleChange} 
          style={inputStyle} 
        />
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
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 10,
            textAlign: 'center',
            maxWidth: 320,
            color: popup.type === 'error' ? 'red' : 'black'
          }}>
            <p>{popup.message}</p>
            {popup.planName ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                <button onClick={handleContinue}
                  style={{ 
                    background: 'blue', 
                    color: 'white', 
                    padding: '6px 10px', 
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer'
                  }}>
                  Continue to Pay
                </button>
                <button onClick={handleRemove}
                  style={{
                    background: 'white', 
                    color: 'blue', 
                    boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',
                    padding: '6px 10px', 
                    borderRadius: 6,
                    border: '1px solid blue',
                    cursor: 'pointer'
                  }}>
                  Remove
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setPopup({ visible: false, message: '', type: '', planName: '' })}
                style={{
                  marginTop: 10, 
                  padding: '6px 12px', 
                  background: '#00ADF2',
                  color: 'white', 
                  borderRadius: '6px', 
                  border: 'none',
                  cursor: 'pointer'
                }}>
                OK
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PayUBuyerForm;