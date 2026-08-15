import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUsers,
  FaSortAmountDownAlt,
  FaHeadset
} from 'react-icons/fa';
import AnimatedSearchLogo from './AnimatedSearchLogo';
import TenantSearchModal from './TenantSearchModal';

const FloatingSearchButton = () => {
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);
  const [isTenantSearchOpen, setIsTenantSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchProperty = () => {
    setIsSearchMenuOpen(false);
    const filterButton = document.querySelector('[data-bs-target="#filterPopup"]');
    if (filterButton) {
      filterButton.click();
    }
  };

  const handleTenantSearch = () => {
    setIsSearchMenuOpen(false);
    setIsTenantSearchOpen(true);
  };

  const handleQuickSort = () => {
    setIsSearchMenuOpen(false);
    navigate('/Sort-Property');
  };

  const handlePropertyAssistance = () => {
    setIsSearchMenuOpen(false);
    navigate('/buyer-assistance');
  };

  return (
    <>
      {/* Floating Search Button */}
      <div
        onClick={() => setIsSearchMenuOpen(true)}
        style={{
          height: '70px',
          width: '70px',
          position: 'fixed',
          right: 'calc(50% - 187.5px + 10px)',
          bottom: '15%',
          zIndex: '1',
          cursor: 'pointer',
        }}
      >
        <AnimatedSearchLogo />
      </div>

      {/* Search Menu Modal */}
      {isSearchMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(64, 64, 64, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            animation: 'fadeIn 0.3s ease-in-out'
          }}
          onClick={() => setIsSearchMenuOpen(false)}
        >
          <style>
            {`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }
            `}
          </style>

          {/* Modal Box */}
          <div
            className="rounded-5 shadow"
            style={{
              width: '350px',
              backgroundColor: '#fff',
              padding: '30px 20px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Grid */}
            <div className="d-grid gap-2 mb-2">
              {/* Search Property Button */}
              <button
                style={{
                  background: '#DFDFDF',
                  color: '#5E5E5E',
                  fontWeight: 600,
                  fontSize: '15px',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingLeft: '16px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#C0C0C0';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#DFDFDF';
                  e.target.style.transform = 'translateX(0)';
                }}
                onClick={handleSearchProperty}
              >
                <FaHome style={{ marginRight: '12px', fontSize: '18px' }} />
                Search Property
              </button>

              {/* Tenant Search Button */}
              <button
                style={{
                  background: '#DFDFDF',
                  color: '#5E5E5E',
                  fontWeight: 600,
                  fontSize: '15px',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingLeft: '16px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#C0C0C0';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#DFDFDF';
                  e.target.style.transform = 'translateX(0)';
                }}
                onClick={handleTenantSearch}
              >
                <FaUsers style={{ marginRight: '12px', fontSize: '18px' }} />
                Tenant Search
              </button>

              {/* Quick Sort Button */}
              <button
                style={{
                  background: '#DFDFDF',
                  color: '#5E5E5E',
                  fontWeight: 600,
                  fontSize: '15px',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingLeft: '16px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#C0C0C0';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#DFDFDF';
                  e.target.style.transform = 'translateX(0)';
                }}
                onClick={handleQuickSort}
              >
                <FaSortAmountDownAlt style={{ marginRight: '12px', fontSize: '18px' }} />
                Quick Sort
              </button>

              {/* Property Assistance Button */}
              <button
                style={{
                  background: '#DFDFDF',
                  color: '#5E5E5E',
                  fontWeight: 600,
                  fontSize: '15px',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingLeft: '16px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#C0C0C0';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#DFDFDF';
                  e.target.style.transform = 'translateX(0)';
                }}
                onClick={handlePropertyAssistance}
              >
                <FaHeadset style={{ marginRight: '12px', fontSize: '18px' }} />
                Property Assistance
              </button>
            </div>

            {/* Close Button */}
            <div className="text-center mt-4">
              <button
                style={{
                  fontWeight: 500,
                  fontSize: '12px',
                  backgroundColor: '#DFDFDF',
                  color: '#5E5E5E',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 30px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#C0C0C0';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#DFDFDF';
                }}
                onClick={() => setIsSearchMenuOpen(false)}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      <TenantSearchModal
        isOpen={isTenantSearchOpen}
        onClose={() => setIsTenantSearchOpen(false)}
      />
    </>
  );
};

export default FloatingSearchButton;
