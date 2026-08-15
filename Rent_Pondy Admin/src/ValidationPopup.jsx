import React from 'react';

// Styled validation popup (replaces the native browser alert).
// Renders nothing when there are no messages.
const ValidationPopup = ({ messages, onClose }) => {
    if (!messages || messages.length === 0) return null;

    return (
        <div className="vpopup-overlay" onClick={onClose}>
            <div className="vpopup-card" onClick={(e) => e.stopPropagation()}>
                <div className="vpopup-header">
                    <span className="vpopup-icon">⚠️</span>
                    <h3>Please complete the required fields</h3>
                </div>
                <ul className="vpopup-list">
                    {messages.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
                <div className="vpopup-footer">
                    <button type="button" className="vpopup-btn" onClick={onClose}>OK</button>
                </div>
            </div>
        </div>
    );
};

export default ValidationPopup;
