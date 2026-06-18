import React, { useState, useEffect } from 'react';
import { partsAPI } from '../../services/api';

const ProcessFlow = () => {
  const stageConfig = [
    { name: 'Cutting', icon: '✂️' },
    { name: 'Drilling', icon: '🔩' },
    { name: 'Milling', icon: '⚙️' },
    { name: 'Grinding', icon: '🔥' },
    { name: 'Assembly', icon: '🔬' },
    { name: 'QC', icon: '✅' },
  ];

  const [stages, setStages] = useState(stageConfig.map(s => ({ ...s, count: 0 })));

  useEffect(() => {
    partsAPI.getAll()
      .then(res => {
        const parts = Array.isArray(res.data) ? res.data : [];
        const updated = stageConfig.map(s => ({
          ...s,
          count: parts.filter(p => p.stage === s.name).length
        }));
        setStages(updated);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="card section-gap">
      <div className="card-header">
        <div>
          <div className="card-title">Manufacturing Pipeline</div>
          <div className="card-subtitle">Live count of parts at each production stage</div>
        </div>
      </div>
      <div className="process-flow">
        {stages.map((stage, idx) => (
          <React.Fragment key={stage.name}>
            <div className={`process-stage ${stage.count > 0 ? 'active' : 'pending'}`}>
              <div className="stage-icon">{stage.icon}</div>
              <div className="stage-name">{stage.name}</div>
              <div className="stage-count" style={{ color: stage.count > 0 ? 'var(--accent)' : 'inherit' }}>{stage.count} parts</div>
            </div>
            {idx < stages.length - 1 && <div className="stage-arrow">›</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProcessFlow;