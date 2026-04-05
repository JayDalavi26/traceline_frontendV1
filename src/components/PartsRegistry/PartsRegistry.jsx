import React, { useState, useEffect } from 'react';
import { partsAPI } from '../../services/api';
import AddPartModal from './AddPartModal';
import { useToast } from '../../hooks/useToast';

const PartsRegistry = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { showToast } = useToast();

  const fetchParts = async () => {
    try {
      const res = await partsAPI.getAll();
      console.log('Fetched parts:', res.data); // Debug
      setParts(res.data);
    } catch (err) {
      console.error('Error fetching parts:', err);
      showToast('Failed to load parts', '❌');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
    const interval = setInterval(fetchParts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePartAdded = () => {
    fetchParts(); // refresh after adding a part
    setModalOpen(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Loading parts...</div>;

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">Complete Parts Registry</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-ghost" onClick={() => showToast('Export CSV', '📊')}>Export CSV</button>
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>⊕ Register Part</button>
          </div>
        </div>
        <div className="table-wrap">
          {parts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>No parts found. Click "Register Part" to add one.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Part ID</th><th>Batch</th><th>Material</th><th>Stage</th><th>Operator</th><th>Quality Score</th><th>Blockchain</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {parts.map(part => (
                  <tr key={part.id}>
                    <td><span className="mono">{part.partId}</span></td>
                    <td><span className="mono">{part.batch}</span></td>
                    <td>{part.material}</td>
                    <td><span className="badge badge-info">{part.stage}</span></td>
                    <td>{part.operatorName}</td>
                    <td><span style={{ color: part.qualityScore > 80 ? 'var(--success)' : part.qualityScore > 50 ? 'var(--warn)' : 'var(--danger)' }}>{part.qualityScore}/100</span></td>
                    <td><span className="mono" style={{ color: 'var(--accent)' }}>#{part.blockchainBlockHash?.slice(0, 6) || 'N/A'}</span></td>
                    <td><button className="btn btn-ghost" style={{ padding: '4px 10px' }}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <AddPartModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onPartAdded={handlePartAdded} />
    </div>
  );
};

export default PartsRegistry;