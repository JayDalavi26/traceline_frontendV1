import React from 'react';
import { blocks } from '../../data/mockData';
import { useToast } from '../../hooks/useToast';

const Blockchain = () => {
  const { showToast } = useToast();

  return (
    <>
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="metric teal"><div className="metric-label">Total Blocks</div><div className="metric-value teal">10,492</div><div className="metric-change">Since genesis block</div></div>
        <div className="metric green"><div className="metric-label">Data Integrity</div><div className="metric-value green">100%</div><div className="metric-change">No tampering detected</div></div>
        <div className="metric blue"><div className="metric-label">Avg Block Time</div><div className="metric-value blue">2.1s</div><div className="metric-change">Transaction finality</div></div>
        <div className="metric purple"><div className="metric-label">Smart Contracts</div><div className="metric-value purple">8</div><div className="metric-change">Active contracts</div></div>
      </div>

      <div className="card section-gap">
        <div className="card-header">
          <div className="card-title">Latest Blocks</div>
          <div className="live-dot" style={{ marginRight: '4px' }}></div>
          <span style={{ fontSize: '12px', color: 'var(--success)' }}>Live</span>
        </div>
        <div className="scroll-h">
          <div className="block-chain">
            {blocks.map((block, idx) => (
              <React.Fragment key={block.num}>
                <div className="block" onClick={() => showToast(`Block ${block.num} — ${block.partId} — ${block.type === 'scan' ? 'Scan Event' : 'Alert'}`, '⬡')}>
                  <div className="block-hash" style={{ color: block.status === 'danger' ? 'var(--danger)' : 'var(--accent)' }}>{block.hash}</div>
                  <div className="block-num" style={{ color: block.status === 'danger' ? 'var(--danger)' : 'var(--text)' }}>{block.num}</div>
                  <div className="block-time" style={{ color: block.status === 'danger' ? 'var(--danger)' : 'var(--text3)' }}>{block.time}</div>
                </div>
                {idx < blocks.length - 1 && <div className="chain-link"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">Blockchain Performance</div></div>
          <div style={{ marginBottom: '14px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ fontSize: '12px', color: 'var(--text2)' }}>Transaction Integrity</span><span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>30% weight — 100% score</span></div><div className="progress-bar"><div className="progress-fill" style={{ width: '100%', background: 'var(--success)' }}></div></div></div>
          <div style={{ marginBottom: '14px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ fontSize: '12px', color: 'var(--text2)' }}>Smart Contract Accuracy</span><span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>25% weight — 98%</span></div><div className="progress-bar"><div className="progress-fill" style={{ width: '98%', background: 'var(--accent)' }}></div></div></div>
          <div style={{ marginBottom: '14px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ fontSize: '12px', color: 'var(--text2)' }}>Data Immutability</span><span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>20% weight — 100%</span></div><div className="progress-bar"><div className="progress-fill" style={{ width: '100%', background: 'var(--success)' }}></div></div></div>
          <div style={{ marginBottom: '14px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ fontSize: '12px', color: 'var(--text2)' }}>Access Control Verification</span><span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>15% weight — 96%</span></div><div className="progress-bar"><div className="progress-fill" style={{ width: '96%', background: 'var(--accent2)' }}></div></div></div>
          <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ fontSize: '12px', color: 'var(--text2)' }}>Consensus Reliability</span><span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>10% weight — 99.8%</span></div><div className="progress-bar"><div className="progress-fill" style={{ width: '99.8%', background: 'var(--success)' }}></div></div></div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Recent Transactions</div></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Block</th><th>Type</th><th>Part</th><th>Status</th></tr></thead>
              <tbody>
                {blocks.slice(0, 5).map(block => (
                  <tr key={block.num}>
                    <td><span className="mono">{block.num}</span></td>
                    <td><span className={`badge ${block.type === 'alert' ? 'badge-danger' : 'badge-accent'}`}>{block.type === 'alert' ? 'Alert' : 'Scan'}</span></td>
                    <td><span className="mono">{block.partId}</span></td>
                    <td><span className={`badge ${block.status === 'danger' ? 'badge-danger' : 'badge-success'}`}>{block.status === 'danger' ? '⚠' : '✓'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blockchain;