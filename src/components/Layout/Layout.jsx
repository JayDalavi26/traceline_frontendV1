import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Dashboard from '../Dashboard/Dashboard';
import Tracking from '../Tracking/Tracking';
import Scan from '../Scan/Scan';
import AIAnalytics from '../AIAnalytics/AIAnalytics';
import Anomalies from '../Anomalies/Anomalies';
import Predictive from '../Predictive/Predictive';
import Blockchain from '../Blockchain/Blockchain';
import SmartContracts from '../SmartContracts/SmartContracts';
import PartsRegistry from '../PartsRegistry/PartsRegistry';
import Operators from '../Operators/Operators';
import Reports from '../Reports/Reports';
import Settings from '../Settings/Settings';

const Layout = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'tracking': return <Tracking />;
      case 'scan': return <Scan />;
      case 'ai': return <AIAnalytics />;
      case 'anomalies': return <Anomalies />;
      case 'predictive': return <Predictive />;
      case 'blockchain': return <Blockchain />;
      case 'contracts': return <SmartContracts />;
      case 'parts': return <PartsRegistry />;
      case 'operators': return <Operators />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="main">
        <Topbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="content">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default Layout;