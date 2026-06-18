import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';

const MetricsGrid = () => {
  const [metrics, setMetrics] = useState({ totalParts: 0, trackingAccuracy: 0, anomaliesDetected: 0, blockchainTxs: 0 });

  useEffect(() => {
    dashboardAPI.getMetrics()
      .then(res => {
        const d = res.data || {};
        setMetrics({
          totalParts: d.partsInProduction || 0,
          trackingAccuracy: d.trackingAccuracy || 0,
          anomaliesDetected: d.anomalies || 0,
          blockchainTxs: d.blockchainTXs || 0
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="grid-4">
      <div className="metric teal">
        <div className="metric-label">Parts in Production</div>
        <div className="metric-value teal">{metrics.totalParts.toLocaleString()}</div>
        <div className="metric-change">Total tracked parts</div>
        <div className="metric-icon">⚙</div>
      </div>
      <div className="metric green">
        <div className="metric-label">Tracking Accuracy</div>
        <div className="metric-value green">{metrics.trackingAccuracy}%</div>
        <div className="metric-change">Quality score</div>
        <div className="metric-icon">◎</div>
      </div>
      <div className="metric warn">
        <div className="metric-label">Anomalies Detected</div>
        <div className="metric-value warn">{metrics.anomaliesDetected}</div>
        <div className="metric-change">Active anomalies</div>
        <div className="metric-icon">⚠</div>
      </div>
      <div className="metric blue">
        <div className="metric-label">Blockchain Blocks</div>
        <div className="metric-value blue">{metrics.blockchainTxs.toLocaleString()}</div>
        <div className="metric-change">Total chain records</div>
        <div className="metric-icon">⛓</div>
      </div>
    </div>
  );
};

export default MetricsGrid;