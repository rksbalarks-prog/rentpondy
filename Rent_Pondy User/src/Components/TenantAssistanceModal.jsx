import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import './TenantAssistanceModal.css';

const TenantAssistanceModal = ({ 
  isOpen, 
  onClose, 
  filterData, 
  phoneNumber 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState('');

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    price = Number(price);
    if (isNaN(price)) return 'N/A';
    if (price >= 10000000) {
      return (price / 10000000).toFixed(2) + ' Cr';
    } else if (price >= 100000) {
      return (price / 100000).toFixed(2) + ' L';
    } else {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  };

  const handleYes = async () => {
    setIsLoading(true);
    try {
      // Prepare data matching BuyerAssistance structure
      const assistanceData = {
        phoneNumber: phoneNumber,
        city: filterData.city || '',
        area: filterData.area || '',
        minPrice: filterData.minRent || filterData.minPrice || '',
        maxPrice: filterData.maxRent || filterData.maxPrice || '',
        propertyType: filterData.propertyType || '',
        propertyMode: filterData.propertyMode || '',
        rentType: filterData.rentType || '',
        bedrooms: filterData.bedroom || filterData.bedrooms || '',
        floorNo: filterData.floor || filterData.floorNo || '',
        state: filterData.state || '',
        pinCode: filterData.pincode || filterData.pinCode || '',
        streetName: filterData.street || filterData.streetName || '',
      };

      // Create assistance request
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/add-buyerAssistance-rent`,
        assistanceData
      );

      if (response.data.success || response.data.data) {
        // Send WhatsApp notification
        sendWhatsAppNotification(assistanceData, phoneNumber);
        
        setMessage('✓ Tenant Assistance request created successfully! You will be contacted soon.');
        setShowConfirmation(true);
        
        setTimeout(() => {
          setShowConfirmation(false);
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Error creating tenant assistance:', error);
      setMessage('Error creating assistance request. Please try again.');
      setShowConfirmation(true);
    } finally {
      setIsLoading(false);
    }
  };

  const sendWhatsAppNotification = async (assistanceData, phone) => {
    try {
      const to = phone.replace(/\D/g, '');

      await axios.post(`${process.env.REACT_APP_API_URL}/queue-message`, {
        to,
        category: "tenant-assistance",
        data: {
          propertyType: assistanceData.propertyType,
          propertyMode: assistanceData.propertyMode,
          minPrice: assistanceData.minPrice,
          maxPrice: assistanceData.maxPrice,
          rentType: assistanceData.rentType,
          bedrooms: assistanceData.bedrooms,
          floorNo: assistanceData.floorNo,
          location: assistanceData.area || assistanceData.city,
          pinCode: assistanceData.pinCode,
        },
      });
    } catch (error) {
      console.log('WhatsApp notification failed (non-blocking):', error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="tenant-assistance-overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: isOpen ? 'block' : 'none',
        }}
      />

      {/* Main Modal */}
      <div 
        className="tenant-assistance-modal"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '30px',
          maxWidth: '500px',
          width: '90%',
          zIndex: 1001,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          animation: 'slideIn 0.3s ease-out',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px',
            color: '#666',
          }}
        >
          <FaTimes />
        </button>

        {/* Main Content */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#4F4B7E', marginBottom: '10px', fontSize: '24px' }}>
            🎯 Get Assistance
          </h2>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
            Would you like us to help you find the perfect property based on your search criteria?
          </p>

          {/* Filter Summary */}
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px',
            textAlign: 'left',
          }}>
            <p style={{ margin: '8px 0', color: '#333', fontSize: '14px' }}>
              <strong>Your Requirements:</strong>
            </p>
            {filterData.propertyType && (
              <p style={{ margin: '5px 0', color: '#555', fontSize: '13px' }}>
                • Property Type: <strong>{filterData.propertyType}</strong>
              </p>
            )}
            {filterData.propertyMode && (
              <p style={{ margin: '5px 0', color: '#555', fontSize: '13px' }}>
                • Property Mode: <strong>{filterData.propertyMode}</strong>
              </p>
            )}
            {(filterData.minRent || filterData.minPrice) && (
              <p style={{ margin: '5px 0', color: '#555', fontSize: '13px' }}>
                • Rent Range: <strong>₹{formatPrice(filterData.minRent || filterData.minPrice)} - ₹{formatPrice(filterData.maxRent || filterData.maxPrice)}</strong>
              </p>
            )}
            {filterData.area && (
              <p style={{ margin: '5px 0', color: '#555', fontSize: '13px' }}>
                • Area: <strong>{filterData.area}</strong>
              </p>
            )}
            {filterData.bedrooms && (
              <p style={{ margin: '5px 0', color: '#555', fontSize: '13px' }}>
                • Bedrooms: <strong>{filterData.bedrooms}</strong>
              </p>
            )}
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
          }}>
            <button
              onClick={onClose}
              disabled={isLoading}
              style={{
                padding: '12px 30px',
                borderRadius: '8px',
                border: '2px solid #ddd',
                backgroundColor: 'white',
                color: '#666',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = '#f0f0f0';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
              }}
            >
              No, Thanks
            </button>
            <button
              onClick={handleYes}
              disabled={isLoading}
              style={{
                padding: '12px 30px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isLoading ? '#999' : '#4F4B7E',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = '#3d3a63';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = '#4F4B7E';
                }
              }}
            >
              {isLoading ? '⏳ Creating...' : '✓ Yes, Help Me!'}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Message */}
      {showConfirmation && (
        <div 
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: message.includes('successfully') ? '#4CAF50' : '#f44336',
            color: 'white',
            padding: '20px 30px',
            borderRadius: '8px',
            zIndex: 1002,
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: '600',
            minWidth: '300px',
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          {message}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -60%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
};

export default TenantAssistanceModal;
