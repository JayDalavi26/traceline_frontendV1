import React, { useState } from 'react';
import PartsTable from './PartsTable';

const Tracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChip, setActiveChip] = useState('All');

  const chips = ['All', 'Cutting', 'Drilling', 'Heat Treat', 'Inspection', 'Assembly', 'Anomaly'];

  return (
    <>
      <div className="search-bar">
        <span style={{ color: 'var(--text3)', fontSize: '16px' }}>🔍</span>
        <input type="text" placeholder="Search by Part ID, batch, operator, or stage..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button className="btn btn-ghost" style={{ padding: '4px 10px' }}>Filters</button>
      </div>

      <div className="filter-chips">
        {chips.map(chip => (
          <span key={chip} className={`chip ${activeChip === chip ? 'active' : ''}`} onClick={() => setActiveChip(chip)}>{chip}</span>
        ))}
      </div>

      <PartsTable searchTerm={searchTerm} activeChip={activeChip} />
    </>
  );
};

export default Tracking;