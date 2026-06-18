import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';

const AddOperatorModal = ({ isOpen, onClose, onOperatorAdded }) => {
  const { showToast } = useToast();
  const stages = ['Cutting', 'Drilling', 'Welding', 'Assembly', 'Inspection', 'Packaging'];
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    opId: '',
    level: 'Level 1 Technician',
    email: '',
    specializations: []
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSpecialization = (stage) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(stage)
        ? prev.specializations.filter(s => s !== stage)
        : [...prev.specializations, stage]
    }));
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
          <div className="form-group">
            <label className="form-label">Stage Specializations</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {stages.map(stage => (
                <label key={stage} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '12px',
                  padding: '4px 10px', borderRadius: '12px', 
                  background: formData.specializations.includes(stage) ? 'rgba(0,212,170,0.15)' : 'var(--bg3)',
                  border: formData.specializations.includes(stage) ? '1px solid var(--accent)' : '1px solid var(--border)' }}>
                  <input type="checkbox" checked={formData.specializations.includes(stage)} onChange={() => toggleSpecialization(stage)} style={{ display: 'none' }} />
                  {formData.specializations.includes(stage) ? '✓' : '○'} {stage}
                </label>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '6px' }}>
              Leave empty = qualified for all stages. Select specific stages for specialization-based auto-assignment.
            </div>
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