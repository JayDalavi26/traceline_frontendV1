import React, { useState, useEffect } from 'react';
import { operatorsAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import AddOperatorModal from './AddOperatorModal';
import DeleteModal from './DeleteModal';

const Operators = () => {
  const [operators, setOperators] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, operator: null });
  const { showToast } = useToast();

  const fetchOperators = async () => {
    try {
      const res = await operatorsAPI.getAll();
      setOperators(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  const handleDelete = async (id, email) => {
    try {
      await operatorsAPI.delete(id, email);
      showToast('Operator deleted and notified', '🗑️');
      fetchOperators();
    } catch (err) {
      showToast('Delete failed', '❌');
    }
    setDeleteModal({ open: false, operator: null });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': return <span className="badge badge-success">Active</span>;
      case 'suspended': return <span className="badge badge-danger">Suspended</span>;
      case 'flagged': return <span className="badge badge-warn">⚠ Flagged</span>;
      default: return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">Operator Directory</div>
          <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>⊕ Add Operator</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Level</th><th>Status</th><th>Scans Today</th><th>Accuracy</th><th>Anomalies</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {operators.map(op => (
                <tr key={op.id}>
                  <td><span className="mono">{op.opId}</span></td>
                  <td>{op.name}</td>
                  <td>{op.level}</td>
                  <td>{getStatusBadge(op.status)}</td>
                  <td>{op.totalScansToday}</td>
                  <td>{op.accuracy}%</td>
                  <td>{op.anomalyCount}</td>
                  <td>
                    <button className="btn btn-danger" style={{ padding: '4px 10px' }}
                      onClick={() => setDeleteModal({ open: true, operator: op })}>
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddOperatorModal 
        isOpen={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        onOperatorAdded={fetchOperators} 
      />

      <DeleteModal
        isOpen={deleteModal.open}
        operator={deleteModal.operator}
        onClose={() => setDeleteModal({ open: false, operator: null })}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Operators;