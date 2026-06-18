import React, { useState, useEffect } from 'react';
import { scansAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import ScanForm from './ScanForm';
import ScanLog from './ScanLog';

const Scan = () => {
  const [logs, setLogs] = useState([]);
  const [queue, setQueue] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState([]);
  const [batchScanning, setBatchScanning] = useState(false);
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const fetchLogs = async () => {
    try {
      const res = await scansAPI.getRecent();
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQueue = async () => {
    try {
      const res = await scansAPI.getMyQueue();
      setQueue(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchQueue();
    const interval = setInterval(() => { fetchLogs(); fetchQueue(); }, 5000);
    return () => clearInterval(interval);
  }, []);

  const addScanLog = (newLog) => {
    setLogs(prev => [newLog, ...prev]);
    fetchQueue(); // refresh queue after scan
  };

  const toggleQueueItem = (partId) => {
    setSelectedQueue(prev =>
      prev.includes(partId) ? prev.filter(id => id !== partId) : [...prev, partId]
    );
  };

  const selectAllQueue = () => {
    if (selectedQueue.length === queue.length) {
      setSelectedQueue([]);
    } else {
      setSelectedQueue(queue.map(p => p.partId));
    }
  };

  const handleBatchScan = async () => {
    if (selectedQueue.length === 0) return;
    // All selected parts must be at the same stage for batch scan
    const stages = [...new Set(selectedQueue.map(id => queue.find(p => p.partId === id)?.stage))];
    if (stages.length > 1) {
      showToast('Batch scan requires all parts at the same stage', '⚠️');
      return;
    }
    setBatchScanning(true);
    try {
      const results = await scansAPI.batchScan(selectedQueue, stages[0]);
      showToast(`${results.data.length} parts scanned & reassigned`, '✅');
      setSelectedQueue([]);
      fetchLogs();
      fetchQueue();
    } catch (err) {
      showToast(err.response?.data?.message || 'Batch scan failed', '❌');
    } finally {
      setBatchScanning(false);
    }
  };

  return (
    <div>
      {/* My Work Queue */}
      {currentUser?.role === 'operator' && (
        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="card-header">
            <div className="card-title">📋 My Work Queue ({queue.length} parts)</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {selectedQueue.length > 0 && (
                <button className="btn btn-primary" onClick={handleBatchScan} disabled={batchScanning}>
                  ⚡ Batch Scan ({selectedQueue.length})
                </button>
              )}
              {queue.length > 0 && (
                <button className="btn btn-ghost" onClick={selectAllQueue}>
                  {selectedQueue.length === queue.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>
          </div>
          {queue.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)' }}>No parts assigned to you right now.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '30px' }}><input type="checkbox" checked={selectedQueue.length === queue.length} onChange={selectAllQueue} /></th>
                    <th>Part ID</th><th>Batch</th><th>Stage</th><th>Material</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map(part => (
                    <tr key={part.id} style={{ cursor: 'pointer' }} onClick={() => toggleQueueItem(part.partId)}>
                      <td><input type="checkbox" checked={selectedQueue.includes(part.partId)} onChange={() => toggleQueueItem(part.partId)} /></td>
                      <td><span className="mono">{part.partId}</span></td>
                      <td><span className="mono">{part.batch}</span></td>
                      <td><span className="badge badge-info">{part.stage}</span></td>
                      <td>{part.material}</td>
                      <td><span className={`badge ${part.status === 'OK' ? 'badge-success' : 'badge-warn'}`}>{part.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Admin sees all queue stats */}
      {currentUser?.role === 'admin' && queue.length > 0 && (
        <div className="card" style={{ marginBottom: '16px', padding: '16px' }}>
          <div className="card-title" style={{ marginBottom: '8px' }}>📊 Queue Overview</div>
          <div style={{ fontSize: '13px', color: 'var(--text2)' }}>Total parts in system queues. Use Parts Registry for batch operations.</div>
        </div>
      )}

      <div className="grid-2">
        <div><ScanForm onScanComplete={addScanLog} /></div>
        <div><ScanLog logs={logs} /></div>
      </div>
    </div>
  );
};

export default Scan;