import React, { useState } from 'react';

const DeleteModal = ({ isOpen, operator, onClose, onConfirm }) => {
  const [notifyEmail, setNotifyEmail] = useState(operator?.email || '');

  if (!isOpen || !operator) return null;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal" style={{ width: '400px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          Delete Operator – {operator.name}
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <p style={{ marginBottom: '16px' }}>Are you sure you want to permanently delete this operator?</p>
        <div className="form-group">
          <label className="form-label">Notify email (optional)</label>
          <input 
            type="email" 
            className="form-input" 
            value={notifyEmail} 
            onChange={(e) => setNotifyEmail(e.target.value)} 
            placeholder="operator@example.com" 
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => onConfirm(operator.id, notifyEmail)}>Delete Permanently</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;