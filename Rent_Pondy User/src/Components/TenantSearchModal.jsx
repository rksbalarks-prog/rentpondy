import React from 'react';
import FormComponent from './FormComponent';

const TenantSearchModal = ({ isOpen, onClose }) => {
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
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: 1060,
        padding: '20px 0',
        overflowY: 'auto',
        animation: 'fadeIn 0.3s ease-in-out'
      }}
      onClick={onClose}
    >
      <div
        className="rounded-4 shadow"
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: 'calc(100vh - 40px)',
          backgroundColor: '#fff',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <FormComponent isModal={true} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default TenantSearchModal;
