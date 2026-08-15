import React from 'react';

const NoPropertyPopup = ({ isOpen, onClose, onBack, filters = {} }) => {
  const handleBackClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Back button clicked');
    
    // Call the onBack handler to reset filters
    if (onBack) {
      onBack();
    }
    
    // Close the modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        className="modal-content rounded-4 shadow"
        style={{
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          maxWidth: '400px',
          width: '90%',
          padding: '0',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="modal-header border-0"
          style={{
            paddingTop: '24px',
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingBottom: '0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h5
            className="modal-title"
            style={{
              color: '#4F4B7E',
              fontWeight: 600,
              fontSize: '18px',
              margin: 0,
            }}
          >
            No Property Found
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            style={{
              filter: 'invert(0.5)',
              padding: '0',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
            aria-label="Close"
          />
        </div>

        {/* Modal Body */}
        <div
          className="modal-body text-center"
          style={{
            padding: '24px',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <p
            style={{
              color: '#666',
              fontSize: '15px',
              marginBottom: '8px',
              fontWeight: 500,
            }}
          >
            No properties available for the selected area.
          </p>
          {filters.area && (
            <p
              style={{
                color: '#999',
                fontSize: '13px',
                marginTop: '12px',
              }}
            >
              Area: <span style={{ fontWeight: 600 }}>{filters.area}</span>
            </p>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className="modal-footer border-0"
          style={{
            paddingBottom: '20px',
            paddingLeft: '24px',
            paddingRight: '24px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <button
            type="button"
            onClick={handleBackClick}
            style={{
              background: '#4F4B7E',
              color: 'white',
              border: 'none',
              fontWeight: 500,
              borderRadius: '8px',
              padding: '10px 24px',
              cursor: 'pointer',
              transition: 'background 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.background = '#3d3a5a')}
            onMouseLeave={(e) => (e.target.style.background = '#4F4B7E')}
          >
            BACK
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoPropertyPopup;
