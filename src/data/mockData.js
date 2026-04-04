export const partsData = [
  { id: 'TL-2024-8821', batch: 'B-2024-11', material: 'Steel AISI 1018', stage: 'Drilling', stageClass: 'badge-info', operator: 'R. Sharma', time: '14:32', risk: 12, status: 'OK', statusClass: 'badge-success' },
  { id: 'TL-2024-8820', batch: 'B-2024-11', material: 'Aluminum 6061', stage: 'Heat Treat', stageClass: 'badge-warn', operator: 'A. Kumar', time: '14:30', risk: 45, status: 'Delay', statusClass: 'badge-warn' },
  { id: 'TL-2024-8819', batch: 'B-2024-11', material: 'Steel AISI 4140', stage: 'Inspection', stageClass: 'badge-info', operator: 'P. Joshi', time: '14:27', risk: 8, status: 'OK', statusClass: 'badge-success' },
  { id: 'TL-2024-8818', batch: 'B-2024-10', material: 'Steel AISI 4140', stage: 'Cutting', stageClass: 'badge-danger', operator: 'V. Patil', time: '14:28', risk: 97, status: 'Anomaly', statusClass: 'badge-danger' },
  { id: 'TL-2024-8817', batch: 'B-2024-10', material: 'Brass C360', stage: 'Assembly', stageClass: 'badge-accent', operator: 'S. Desai', time: '14:25', risk: 5, status: 'OK', statusClass: 'badge-success' },
  { id: 'TL-2024-8816', batch: 'B-2024-10', material: 'Steel AISI 1018', stage: 'Drilling', stageClass: 'badge-info', operator: 'R. Sharma', time: '14:20', risk: 18, status: 'OK', statusClass: 'badge-success' },
  { id: 'TL-2024-8815', batch: 'B-2024-09', material: 'Aluminum 6061', stage: 'Assembly', stageClass: 'badge-danger', operator: 'M. Singh', time: '13:55', risk: 99, status: 'Anomaly', statusClass: 'badge-danger' },
  { id: 'TL-2024-8814', batch: 'B-2024-09', material: 'Brass C360', stage: 'Cutting', stageClass: 'badge-info', operator: 'R. Sharma', time: '13:40', risk: 22, status: 'OK', statusClass: 'badge-success' },
  { id: 'TL-2024-8813', batch: 'B-2024-09', material: 'Steel AISI 1018', stage: 'Heat Treat', stageClass: 'badge-warn', operator: 'A. Kumar', time: '13:30', risk: 61, status: 'Delay', statusClass: 'badge-warn' },
];

export const scanLogData = [
  { time: '14:32:18', partId: 'TL-2024-8821', stage: 'Drilling Stage', operator: 'OP-0042', name: 'R. Sharma', block: '#10492', hash: '0x4f3e...', status: 'success' },
  { time: '14:30:05', partId: 'TL-2024-8820', stage: 'Heat Treatment', operator: 'OP-0018', name: 'A. Kumar', block: '#10491', hash: '0x9a7b...', status: 'success' },
  { time: '14:28:44', partId: 'TL-2024-8818', stage: 'Cutting', operator: 'OP-0007', name: 'V. Patil', block: '#10490', hash: '0xf2a8...', status: 'danger', message: 'Duplicate scan detected' },
  { time: '14:25:10', partId: 'TL-2024-8817', stage: 'Assembly Stage', operator: 'OP-0031', name: 'S. Desai', block: '#10489', hash: '0x2d1c...', status: 'success' },
];

export const anomalies = [
  { id: 1, severity: 'critical', title: 'Duplicate DMC Scan', description: 'Part TL-2024-8818 scanned twice at Cutting station within 45 seconds. Possible scanner malfunction or unauthorized access.', location: 'Cutting Station 3', operator: 'V. Patil', time: '14:28:44', score: 97 },
  { id: 2, severity: 'critical', title: 'Invalid Process Sequence', description: 'Part TL-2024-8815 jumped from Intake directly to Assembly, skipping Cutting, Drilling, and Heat Treatment stages.', location: 'Assembly Line 1', operator: 'M. Singh', time: '13:55:10', score: 99 },
  { id: 3, severity: 'medium', title: 'Abnormal Time Gap', description: 'Part TL-2024-8810 spent 4.2 hours in Heat Treatment — 280% above normal 1.5-hour baseline.', location: 'Heat Treat Furnace 2', operator: 'A. Kumar', time: '12:14:30', score: 83 },
  { id: 4, severity: 'medium', title: 'Suspicious Operator Activity', description: 'Operator OP-0031 logged 47 scans in 8 minutes — significantly above average.', location: 'Inspection Bay 2', operator: 'S. Desai', time: '11:40:22', score: 76 },
  { id: 5, severity: 'low', title: 'Batch Quality Deviation', description: 'Batch B-2024-11 shows 12% higher rejection rate at inspection vs historical average.', location: 'Inspection Bay 1', operator: 'Multiple', time: '10:00:00 – 14:00:00', score: 62 },
];

export const operators = [
  { initials: 'RS', name: 'Rajesh Sharma', opId: 'OP-0042', level: 'Level 3 Technician', status: 'on', scans: 284, accuracy: 98.2, anomalies: 0 },
  { initials: 'AK', name: 'Amit Kumar', opId: 'OP-0018', level: 'Level 2 Technician', status: 'on', scans: 189, accuracy: 91.3, anomalies: 1 },
  { initials: 'VP', name: 'Vijay Patil', opId: 'OP-0007', level: 'Level 2 Technician', status: 'flagged', scans: 156, accuracy: 78.4, anomalies: 2 },
  { initials: 'SD', name: 'Sanjay Desai', opId: 'OP-0031', level: 'Level 4 Supervisor', status: 'on', scans: 412, accuracy: 97.8, anomalies: 0 },
  { initials: 'PJ', name: 'Priya Joshi', opId: 'OP-0055', level: 'Level 3 Technician', status: 'off', scans: 0, accuracy: 0, anomalies: 0 },
];

export const blocks = [
  { hash: '0x4f3e9a2b...', num: '#10492', time: '14:32:18', partId: 'TL-2024-8821', type: 'scan', status: 'success' },
  { hash: '0x9a7b1c4d...', num: '#10491', time: '14:30:05', partId: 'TL-2024-8820', type: 'scan', status: 'success' },
  { hash: '0xf2a8e3c1...', num: '#10490', time: '14:28:44', partId: 'TL-2024-8818', type: 'alert', status: 'danger' },
  { hash: '0x2d1c7f8e...', num: '#10489', time: '14:25:10', partId: 'TL-2024-8817', type: 'scan', status: 'success' },
  { hash: '0x8e4b2a9c...', num: '#10488', time: '14:22:44', partId: 'TL-2024-8816', type: 'scan', status: 'success' },
];