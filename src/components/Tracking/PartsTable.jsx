import React, { useState, useEffect } from 'react';
import { partsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';

const PartsTable = ({ refreshKey }) => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const fetchParts = async () => {
    setLoading(true);
    try {
      const res = await partsAPI.getAll();
      let data = res.data;
      // Apply search and chip filters (UI only, no role filtering)
      if (window.searchTerm) {
        const term = window.searchTerm.toLowerCase();
        data = data.filter(p =>
          p.partId?.toLowerCase().includes(term) ||
          p.stage?.toLowerCase().includes(term) ||
          p.operatorName?.toLowerCase().includes(term)
        );
      }
      if (window.activeChip && window.activeChip !== 'All') {
        if (window.activeChip === 'Anomaly') {
          data = data.filter(p => p.status === 'Anomaly');
        } else {
          data = data.filter(p => p.stage === window.activeChip);
        }
      }
      setParts(data);
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
  }, [refreshKey]);

  // Listen for search/chip changes from parent (Tracking.jsx)
  useEffect(() => {
    const handleFilterUpdate = () => fetchParts();
    window.addEventListener('filterUpdate', handleFilterUpdate);
    return () => window.removeEventListener('filterUpdate', handleFilterUpdate);
  }, []);

  if (loading && parts.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading parts...</div>;
  }

  if (parts.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)' }}>No parts found. Click "Register Part" to add one.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Part ID</th><th>Batch</th><th>Material</th><th>Stage</th><th>Operator</th><th>Last Scan</th><th>Risk</th><th>Status</th><th>Actions</th>
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
              <td>{part.lastScanTime ? new Date(part.lastScanTime).toLocaleTimeString() : '-'}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div className="progress-bar" style={{ width: '40px' }}>
                    <div className="progress-fill" style={{ width: `${part.riskScore}%`, background: part.riskScore > 70 ? 'var(--danger)' : part.riskScore > 40 ? 'var(--warn)' : 'var(--success)' }}></div>
                  </div>
                  <span>{part.riskScore}%</span>
                </div>
              </td>
              <td><span className={`badge ${part.status === 'OK' ? 'badge-success' : 'badge-danger'}`}>{part.status}</span></td>
              <td><button className="btn btn-ghost" style={{ padding: '4px 10px' }}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartsTable;