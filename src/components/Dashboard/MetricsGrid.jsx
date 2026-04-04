import React from 'react';

const MetricsGrid = () => {
  return (
    <div className="grid-4">
      <div className="metric teal">
        <div className="metric-label">Parts in Production</div>
        <div className="metric-value teal">1,284</div>
        <div className="metric-change"><span className="up">↑ 8.3%</span> vs yesterday</div>
        <div className="metric-icon">⚙</div>
      </div>
      <div className="metric green">
        <div className="metric-label">Tracking Accuracy</div>
        <div className="metric-value green">92.4%</div>
        <div className="metric-change"><span className="up">↑ 2.1%</span> this week</div>
        <div className="metric-icon">◎</div>
      </div>
      <div className="metric warn">
        <div className="metric-label">Anomalies Detected</div>
        <div className="metric-value warn">7</div>
        <div className="metric-change"><span className="down">↑ 3</span> since 6 hours ago</div>
        <div className="metric-icon">⚠</div>
      </div>
      <div className="metric blue">
        <div className="metric-label">Blockchain TXs Today</div>
        <div className="metric-value blue">5,831</div>
        <div className="metric-change"><span className="up">↑ 12%</span> throughput</div>
        <div className="metric-icon">⛓</div>
      </div>
    </div>
  );
};

export default MetricsGrid;