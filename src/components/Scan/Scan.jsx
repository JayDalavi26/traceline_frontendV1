import React, { useState, useEffect } from 'react';
import { scansAPI } from '../../services/api';
import ScanForm from './ScanForm';
import ScanLog from './ScanLog';

const Scan = () => {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await scansAPI.getRecent();
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const addScanLog = (newLog) => {
    setLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="grid-2">
      <div><ScanForm onScanComplete={addScanLog} /></div>
      <div><ScanLog logs={logs} /></div>
    </div>
  );
};

export default Scan;