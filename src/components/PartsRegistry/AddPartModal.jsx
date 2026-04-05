import React, { useState, useEffect } from 'react';
import { partsAPI, operatorsAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';

const AddPartModal = ({ isOpen, onClose, onPartAdded }) => {
  const { showToast } = useToast();
  const [operators, setOperators] = useState([]);
  const [formData, setFormData] = useState({
    partId: '',
    batch: '',
    material: '',
    stage: 'Intake',
    operatorId: '',
    operatorName: '',
    riskScore: 0,
    status: 'OK',
    qualityScore: 100
  });
  const [loading, setLoading] = useState(false);

  // Fetch operators for dropdown when modal opens
  useEffect(() => {
    if (isOpen) {
      operatorsAPI.getAll()
        .then(res => setOperators(res.data))
        .catch(err => console.error(err));
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // If operator selected, auto-fill operatorName
    if (name === 'operatorId') {
      const selectedOp = operators.find(op => op.opId === value);
      if (selectedOp) {
        setFormData(prev => ({ ...prev, operatorName: selectedOp.name }));
      }
    }
  };

  const generatePartId = () => {
    const randomNum = Math.floor(8800 + Math.random() * 200);
    const newId = `TL-2024-${randomNum}`;
    setFormData(prev => ({ ...prev, partId: newId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.partId || !formData.batch || !formData.material || !formData.operatorId) {
      showToast('Please fill all required fields', '⚠️');
      return;
    }
    setLoading(true);
    try {
      await partsAPI.create(formData);
      showToast(`Part ${formData.partId} registered successfully`, '✅');
      onPartAdded(); // refresh parent table
      onClose();
      // Reset form
      setFormData({
        partId: '',
        batch: '',
        material: '',
        stage: 'Intake',
        operatorId: '',
        operatorName: '',
        riskScore: 0,
        status: 'OK',
        qualityScore: 100
      });
    } catch (err) {
      showToast('Registration failed', '❌');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal" style={{ width: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          Register New Part
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Part ID (DMC)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" name="partId" className="form-input" value={formData.partId} onChange={handleChange} required />
              <button type="button" className="btn btn-ghost" onClick={generatePartId}>Generate</button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Batch ID</label>
            <input type="text" name="batch" className="form-input" value={formData.batch} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Material</label>
            <select name="material" className="form-input" value={formData.material} onChange={handleChange} required>
              <option value="">Select material</option>
              <option>Steel AISI 1018</option>
              <option>Steel AISI 4140</option>
              <option>Aluminum 6061</option>
              <option>Brass C360</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Initial Stage</label>
            <select name="stage" className="form-input" value={formData.stage} onChange={handleChange}>
              <option>Intake</option>
              <option>Cutting</option>
              <option>Drilling</option>
              <option>Heat Treatment</option>
              <option>Inspection</option>
              <option>Assembly</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Assign Operator</label>
            <select name="operatorId" className="form-input" value={formData.operatorId} onChange={handleChange} required>
              <option value="">Select operator</option>
              {operators.map(op => (
                <option key={op.id} value={op.opId}>{op.name} ({op.opId})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Quality Score (0-100)</label>
            <input type="number" name="qualityScore" className="form-input" min="0" max="100" value={formData.qualityScore} onChange={handleChange} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Registering...' : 'Register Part'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPartModal;