import React, { useState, useCallback } from 'react';
import PartsTable from './PartsTable';

const Tracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChip, setActiveChip] = useState('All');
  const [refreshKey, setRefreshKey] = useState(0);

  // Updated chip labels: "Heat Treatment" instead of "Heat Treat"
  const chips = ['All', 'Cutting', 'Drilling', 'Heat Treatment', 'Inspection', 'Assembly', 'Anomaly'];

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleChipClick = useCallback((chip) => {
    setActiveChip(chip);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <>
      <div className="search-bar">
        <span style={{ color: 'var(--text3)', fontSize: '16px' }}>🔍</span>
        <input 
          type="text" 
          placeholder="Search by Part ID, batch, operator, or stage..." 
          value={searchTerm} 
          onChange={handleSearchChange} 
        />
        <button className="btn btn-ghost" style={{ padding: '4px 10px' }}>Filters</button>
      </div>

      <div className="filter-chips">
        {chips.map(chip => (
          <span 
            key={chip} 
            className={`chip ${activeChip === chip ? 'active' : ''}`} 
            onClick={() => handleChipClick(chip)}
          >
            {chip}
          </span>
        ))}
      </div>

      <PartsTable 
        searchTerm={searchTerm} 
        activeChip={activeChip} 
        refreshKey={refreshKey}
        onRefresh={handleRefresh}
      />
    </>
  );
};

export default Tracking;