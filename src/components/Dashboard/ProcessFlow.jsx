import React from 'react';

const ProcessFlow = () => {
  const stages = [
    { name: 'Intake', icon: '📥', count: '342 done', status: 'done' },
    { name: 'Cutting', icon: '✂️', count: '298 done', status: 'done' },
    { name: 'Drilling', icon: '🔩', count: '187 active', status: 'active' },
    { name: 'Heat Treat', icon: '🔥', count: '124 active', status: 'active' },
    { name: 'Inspection', icon: '🔬', count: '89 active', status: 'active' },
    { name: 'Assembly', icon: '✅', count: '244 pending', status: 'pending' },
  ];

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
            <div className={`process-stage ${stage.status}`}>
              <div className="stage-icon">{stage.icon}</div>
              <div className="stage-name">{stage.name}</div>
              <div className="stage-count" style={{ color: stage.status === 'active' ? 'var(--accent)' : stage.status === 'done' ? 'var(--success)' : 'inherit' }}>{stage.count}</div>
            </div>
            {idx < stages.length - 1 && <div className="stage-arrow">›</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProcessFlow;