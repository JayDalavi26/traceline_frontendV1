import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';

const AddOperatorModal = ({ isOpen, onClose, onOperatorAdded }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    opId: '',
    level: 'Level 1 Technician',
    email: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAPI.registerOperator(formData);
      showToast('Operator added and email sent successfully', '✅');
      onOperatorAdded();  // refresh list
      onClose();
    } catch (err) {
      showToast('Failed to add operator', '❌');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal" style={{ width: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          Add New Operator
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" name="username" className="form-input" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="text" name="password" className="form-input" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-input" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Operator ID</label>
            <input type="text" name="opId" className="form-input" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Level</label>
            <select name="level" className="form-input" onChange={handleChange}>
              <option>Level 1 Technician</option>
              <option>Level 2 Technician</option>
              <option>Level 3 Technician</option>
              <option>Level 4 Supervisor</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Email (to send credentials)</label>
            <input type="email" name="email" className="form-input" required onChange={handleChange} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Operator</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOperatorModal;