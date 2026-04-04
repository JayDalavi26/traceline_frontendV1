import React, { useState } from 'react';
import { partsData } from '../../data/mockData';
import { useToast } from '../../hooks/useToast';

const PartsRegistry = () => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParts = partsData.filter(p =>
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.operator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="search-bar">
        <span style={{ color: 'var(--text3)', fontSize: '16px' }}>🔍</span>
        <input type="text" placeholder="Search parts by ID, material, batch, or operator..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Complete Parts Registry</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-ghost" onClick={() => showToast('Parts registry exported', '📊')}>Export CSV</button>
            <button className="btn btn-primary" onClick={() => showToast('Register Part modal opened', '⊕')}>⊕ Register Part</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Part ID</th><th>Material</th><th>Batch</th><th>Created</th><th>Stage</th><th>Operator</th><th>Quality Score</th><th>Blockchain</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredParts.map(part => (
                <tr key={part.id}>
                  <td><span className="mono">{part.id}</span></td>
                  <td>{part.material}</td>
                  <td><span className="mono">{part.batch}</span></td>
                  <td style={{ fontSize: '12px' }}>Apr 3, 2024</td>
                  <td><span className={`badge ${part.stageClass}`}>{part.stage}</span></td>
                  <td>{part.operator}</td>
                  <td><span style={{ color: part.risk > 70 ? 'var(--danger)' : part.risk > 40 ? 'var(--warn)' : 'var(--success)', fontWeight: 600 }}>{100 - part.risk}/100</span></td>
                  <td><span className="mono" style={{ color: 'var(--accent)' }}>#10{492 - (partsData.indexOf(part))}</span></td>
                  <td><button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => showToast(`Viewing details for ${part.id}`, '⚙')}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PartsRegistry;