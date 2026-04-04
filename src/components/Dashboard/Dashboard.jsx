import React from 'react';
import MetricsGrid from './MetricsGrid';
import ProcessFlow from './ProcessFlow';
import RecentScansTable from './RecentScansTable';
import AnomalyFeed from './AnomalyFeed';
import ThroughputChart from './ThroughputChart';

const Dashboard = () => {
  return (
    <>
      <div className="alert-banner warn">
        <span>⚠</span>
        <span>7 anomalies detected in the last 24 hours — 2 critical require immediate attention.</span>
        <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '12px', marginLeft: 'auto' }}>View All</button>
      </div>

      <MetricsGrid />
      <ProcessFlow />
      
      <div className="grid-2">
        <RecentScansTable />
        <AnomalyFeed />
      </div>
      
      <ThroughputChart />
    </>
  );
};

export default Dashboard;