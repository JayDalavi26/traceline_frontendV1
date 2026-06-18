import React, { useState, useEffect } from 'react';
import { partsAPI, assignmentsAPI } from '../../services/api';
import AddPartModal from './AddPartModal';
import { useToast } from '../../hooks/useToast';

const PartsRegistry = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedParts, setSelectedParts] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const { showToast } = useToast();

  const fetchParts = async () => {
    try {
      const res = await partsAPI.getAll();
      console.log('Fetched parts:', res.data);
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
    fetchParts();
    setModalOpen(false);
  };

  const toggleSelect = (partId) => {
    setSelectedParts(prev => 
      prev.includes(partId) ? prev.filter(id => id !== partId) : [...prev, partId]
    );
  };

  const selectAllUnassigned = () => {
    const unassigned = parts.filter(p => !p.operatorId).map(p => p.partId);
    setSelectedParts(unassigned);
  };

  const handleBatchAutoAssign = async () => {
    if (selectedParts.length === 0) {
      showToast('Select parts to auto-assign', '⚠️');
      return;
    }
    setAssigning(true);
    try {
      await assignmentsAPI.batchAssign({ partIds: selectedParts, mode: 'auto' });
      showToast(`${selectedParts.length} parts auto-assigned`, '✅');
      setSelectedParts([]);
      fetchParts();
    } catch (err) {
      showToast('Batch assign failed', '❌');
    } finally {
      setAssigning(false);
    }
  };

  const handleAutoAssignAll = async () => {
    setAssigning(true);
    try {
      const res = await assignmentsAPI.autoAssignAll();
      showToast(`${res.data.length} unassigned parts auto-assigned`, '✅');
      fetchParts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Auto-assign failed', '❌');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Loading parts...</div>;

  const unassignedCount = parts.filter(p => !p.operatorId).length;

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">Complete Parts Registry</div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {unassignedCount > 0 && (
              <button className="btn btn-ghost" onClick={handleAutoAssignAll} disabled={assigning}
                style={{ color: 'var(--accent)', border: '1px solid var(--accent)' }}>
                ⚡ Auto-Assign All ({unassignedCount})
              </button>
            )}
            {selectedParts.length > 0 && (
              <button className="btn btn-ghost" onClick={handleBatchAutoAssign} disabled={assigning}
                style={{ color: 'var(--success)' }}>
                ⚡ Assign Selected ({selectedParts.length})
              </button>
            )}
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
                  <th style={{ width: '30px' }}>
                    <input type="checkbox" onChange={selectAllUnassigned} checked={selectedParts.length > 0 && selectedParts.length === unassignedCount} title="Select all unassigned" />
                  </th>
                  <th>Part ID</th><th>Batch</th><th>Material</th><th>Stage</th><th>Operator</th><th>Quality</th><th>Assignment</th><th>Blockchain</th>
                </tr>
              </thead>
              <tbody>
                {parts.map(part => (
                  <tr key={part.id}>
                    <td>
                      {!part.operatorId && (
                        <input type="checkbox" checked={selectedParts.includes(part.partId)} onChange={() => toggleSelect(part.partId)} />
                      )}
                    </td>
                    <td><span className="mono">{part.partId}</span></td>
                    <td><span className="mono">{part.batch}</span></td>
                    <td>{part.material}</td>
                    <td><span className="badge badge-info">{part.stage}</span></td>
                    <td>{part.operatorName || <span style={{ color: 'var(--text3)', fontStyle: 'italic' }}>Unassigned</span>}</td>
                    <td><span style={{ color: part.qualityScore > 80 ? 'var(--success)' : part.qualityScore > 50 ? 'var(--warn)' : 'var(--danger)' }}>{part.qualityScore}/100</span></td>
                    <td>
                      {part.autoAssigned ? (
                        <span className="badge badge-success" style={{ fontSize: '10px' }}>⚡ Auto</span>
                      ) : part.operatorId ? (
                        <span className="badge badge-neutral" style={{ fontSize: '10px' }}>Manual</span>
                      ) : (
                        <span className="badge badge-warn" style={{ fontSize: '10px' }}>Pending</span>
                      )}
                    </td>
                    <td><span className="mono" style={{ color: 'var(--accent)' }}>#{part.blockchainBlockHash?.slice(0, 6) || 'N/A'}</span></td>
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