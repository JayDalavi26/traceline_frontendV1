import React from 'react';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay open" onClick={onCancel}>
      <div className="modal" style={{ width: '400px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{title}<button className="close-btn" onClick={onCancel}>✕</button></div>
        <p style={{ marginBottom: '20px' }}>{message}</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" style={{ flex: 1 }} onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;