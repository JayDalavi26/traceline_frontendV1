import React, { useState, useEffect } from 'react';
import { scansAPI } from '../../services/api';

const ThroughputChart = () => {
  const hours = ['6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'];
  const [heights, setHeights] = useState(Array(12).fill(0));

  useEffect(() => {
    scansAPI.getRecent()
      .then(res => {
        const scans = Array.isArray(res.data) ? res.data : [];
        // Group scans by hour
        const hourCounts = Array(12).fill(0);
        scans.forEach(scan => {
          if (scan.timestamp) {
            const hour = new Date(scan.timestamp).getHours();
            if (hour >= 6 && hour <= 17) {
              hourCounts[hour - 6]++;
            }
          }
        });
        const maxCount = Math.max(...hourCounts, 1);
        setHeights(hourCounts.map(c => Math.round((c / maxCount) * 100)));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Daily Throughput</div>
          <div className="card-subtitle">Parts processed per hour today</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="chip active">Today</span>
          <span className="chip">Week</span>
          <span className="chip">Month</span>
        </div>
      </div>
      <div className="chart-bars" style={{ height: '120px' }}>
        {hours.map((hour, idx) => (
          <div key={hour} className="bar-col">
            <div className="bar" style={{ height: `${heights[idx] || 2}%`, background: heights[idx] > 0 ? 'var(--accent)' : 'var(--border)', opacity: 0.8 }}></div>
            <div className="bar-label">{hour}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '12px', color: 'var(--text3)' }}>
        <span><span style={{ color: 'var(--accent)' }}>■</span> Scans this hour</span>
      </div>
    </div>
  );
};

export default ThroughputChart;