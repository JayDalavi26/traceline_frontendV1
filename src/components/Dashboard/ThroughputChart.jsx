import React from 'react';

const ThroughputChart = () => {
  const hours = ['6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'];
  const heights = [55, 70, 90, 85, 100, 88, 65, 75, 92, 80, 70, 45];
  const colors = ['var(--accent)', 'var(--accent)', 'var(--accent)', 'var(--accent)', 'var(--accent)', 'var(--accent)', 'var(--warn)', 'var(--accent)', 'var(--accent)', 'var(--accent)', 'var(--accent2)', 'var(--accent2)'];

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
            <div className="bar" style={{ height: `${heights[idx]}%`, background: colors[idx], opacity: idx === 6 ? 0.7 : 0.8 }}></div>
            <div className="bar-label">{hour}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '12px', color: 'var(--text3)' }}>
        <span><span style={{ color: 'var(--accent)' }}>■</span> Normal throughput</span>
        <span><span style={{ color: 'var(--warn)' }}>■</span> Below average</span>
        <span><span style={{ color: 'var(--accent2)' }}>■</span> Shift change</span>
      </div>
    </div>
  );
};

export default ThroughputChart;