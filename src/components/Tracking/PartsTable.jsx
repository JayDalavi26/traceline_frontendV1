import React, { useState, useEffect, useCallback } from 'react';
import { partsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';

const PartsTable = ({ searchTerm, activeChip, refreshKey, onRefresh }) => {
  const [parts, setParts] = useState([]);
  const [filteredParts, setFilteredParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const fetchParts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await partsAPI.getAll();
      setParts(res.data);
      return res.data;
    } catch (err) {
      console.error('Error fetching parts:', err);
      showToast('Failed to load parts', '❌');
      return [];
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const applyFilters = useCallback((partsData, search, chip) => {
    if (!partsData || partsData.length === 0) return [];

    let filtered = [...partsData];

    // Apply search filter
    if (search && search.trim() !== '') {
      const term = search.toLowerCase().trim();
      filtered = filtered.filter(part =>
        (part.partId && part.partId.toLowerCase().includes(term)) ||
        (part.batch && part.batch.toLowerCase().includes(term)) ||
        (part.operatorName && part.operatorName.toLowerCase().includes(term)) ||
        (part.stage && part.stage.toLowerCase().includes(term)) ||
        (part.material && part.material.toLowerCase().includes(term))
      );
    }

    // Apply chip filter
    if (chip && chip !== 'All') {
      if (chip === 'Anomaly') {
        filtered = filtered.filter(part => part.status === 'Anomaly');
      } else {
        // For 'Heat Treatment' chip, filter by stage === 'Heat Treatment'
        // Ensure backend stage values match exactly (e.g., "Heat Treatment")
        filtered = filtered.filter(part => part.stage === chip);
      }
    }

    return filtered;
  }, []);

  const filterParts = useCallback(() => {
    const filtered = applyFilters(parts, searchTerm, activeChip);
    setFilteredParts(filtered);
  }, [parts, searchTerm, activeChip, applyFilters]);

  useEffect(() => {
    const loadAndFilter = async () => {
      await fetchParts();
    };
    loadAndFilter();
  }, [refreshKey, fetchParts]);

  useEffect(() => {
    filterParts();
  }, [parts, searchTerm, activeChip, filterParts]);

  useEffect(() => {
    const interval = setInterval(async () => {
      await fetchParts();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [fetchParts]);

  if (loading && filteredParts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '10px', color: 'var(--text3)' }}>Loading parts...</p>
      </div>
    );
  }

  if (filteredParts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>
        <p>No parts found.</p>
        {(searchTerm || activeChip !== 'All') && (
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            Try clearing your search or changing the filter.
          </p>
        )}
        {!searchTerm && activeChip === 'All' && (
          <p>Click "Register Part" to add one.</p>
        )}
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <div style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--text3)' }}>
        Showing {filteredParts.length} of {parts.length} parts
        {(searchTerm || activeChip !== 'All') && (
          <button 
            onClick={() => {
              if (onRefresh) onRefresh();
            }}
            style={{ marginLeft: '12px', fontSize: '12px' }}
            className="btn btn-ghost"
          >
            Clear Filters
          </button>
        )}
      </div>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Part ID</th>
            <th>Batch</th>
            <th>Material</th>
            <th>Stage</th>
            <th>Operator</th>
            <th>Last Scan</th>
            <th>Risk</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredParts.map(part => (
            <tr key={part.id || part.partId}>
              <td>
                <span className="mono">{part.partId}</span>
              </td>
              <td>
                <span className="mono">{part.batch}</span>
              </td>
              <td>{part.material}</td>
              <td>
                <span className="badge badge-info">{part.stage}</span>
              </td>
              <td>{part.operatorName || part.operator || '-'}</td>
              <td>
                {part.lastScanTime 
                  ? new Date(part.lastScanTime).toLocaleTimeString() 
                  : part.updatedAt 
                    ? new Date(part.updatedAt).toLocaleTimeString() 
                    : '-'}
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div className="progress-bar" style={{ width: '60px' }}>
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${part.riskScore || 0}%`, 
                        background: (part.riskScore || 0) > 70 
                          ? 'var(--danger)' 
                          : (part.riskScore || 0) > 40 
                            ? 'var(--warn)' 
                            : 'var(--success)'
                      }}
                    ></div>
                  </div>
                  <span>{part.riskScore || 0}%</span>
                </div>
              </td>
              <td>
                <span className={`badge ${part.status === 'OK' || part.status === 'ok' ? 'badge-success' : 'badge-danger'}`}>
                  {part.status || 'N/A'}
                </span>
              </td>
              <td>
                <button className="btn btn-ghost" style={{ padding: '4px 10px' }}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartsTable;