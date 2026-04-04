import React, { useState, useEffect } from 'react';
import { partsData as initialParts } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

const PartsTable = ({ searchTerm, activeChip }) => {
  const { currentUser } = useAuth();
  const [parts, setParts] = useState([]);

  useEffect(() => {
    let filtered = [...initialParts];
    
    if (currentUser?.role === 'operator' && currentUser.operatorKey) {
      filtered = filtered.filter(p => p.operator === currentUser.operatorKey);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.stage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeChip !== 'All') {
      if (activeChip === 'Anomaly') {
        filtered = filtered.filter(p => p.status === 'Anomaly');
      } else {
        filtered = filtered.filter(p => p.stage === activeChip);
      }
    }
    
    setParts(filtered);
  }, [searchTerm, activeChip, currentUser]);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Parts Registry — Live View</div>
          <div className="card-subtitle">{parts.length} active parts</div>
        </div>
        <button className="btn btn-primary" style={{ padding: '7px 14px' }}>⊕ Register Part</button>
      </div>
      <div className="table-wrap">
        <table id="partsTable">
          <thead>
            <tr>
              <th>Part ID (DMC)</th><th>Batch</th><th>Material</th><th>Current Stage</th><th>Operator</th><th>Last Scan</th><th>Risk Score</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {parts.map(part => (
              <tr key={part.id}>
                <td><span className="mono">{part.id}</span></td>
                <td><span className="mono">{part.batch}</span></td>
                <td style={{ fontSize: '12px', color: 'var(--text2)' }}>{part.material}</td>
                <td><span className={`badge ${part.stageClass}`}>{part.stage}</span></td>
                <td style={{ fontSize: '12px' }}>{part.operator}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text3)' }}>{part.time}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '40px', height: '4px', background: 'var(--bg3)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${part.risk}%`, background: part.risk > 70 ? 'var(--danger)' : part.risk > 40 ? 'var(--warn)' : 'var(--success)' }}></div>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: part.risk > 70 ? 'var(--danger)' : part.risk > 40 ? 'var(--warn)' : 'var(--success)' }}>{part.risk}%</span>
                  </div>
                </td>
                <td><span className={`badge ${part.statusClass}`}>{part.status}</span></td>
                <td><button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '11px' }}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartsTable;