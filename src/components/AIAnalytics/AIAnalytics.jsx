import React from 'react';
import { useToast } from '../../hooks/useToast';

const AIAnalytics = () => {
  const { showToast } = useToast();

  return (
    <>
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="metric purple"><div className="metric-label">Detection Accuracy</div><div className="metric-value purple">90.2%</div><div className="metric-change"><span className="up">↑ 38%</span> vs manual</div></div>
        <div className="metric teal"><div className="metric-label">Predictions Made</div><div className="metric-value teal">12,841</div><div className="metric-change">This month</div></div>
        <div className="metric green"><div className="metric-label">Defects Prevented</div><div className="metric-value green">234</div><div className="metric-change"><span className="up">↑ Early detection</span></div></div>
        <div className="metric blue"><div className="metric-label">Model Confidence</div><div className="metric-value blue">94%</div><div className="metric-change">Avg across all models</div></div>
      </div>

      <div className="ai-insight section-gap">
        <div className="ai-tag">✦ AI Recommendation</div>
        <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: '1.7' }}>Based on 30-day historical analysis, <strong style={{ color: 'var(--accent)' }}>Batch B-2024-11</strong> has a <strong style={{ color: 'var(--danger)' }}>71% probability of heat treatment defects</strong> if current temperature variance continues. Recommend recalibrating furnace 2 within the next 2 hours.</p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button className="btn btn-primary" style={{ padding: '7px 14px', fontSize: '12px' }} onClick={() => showToast('Work order created for Furnace 2 calibration', '✅')}>Create Work Order</button>
          <button className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: '12px' }}>Dismiss</button>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">Anomaly Detection Breakdown</div><span className="badge badge-accent">AI Model v2.4</span></div>
          <div style={{ marginBottom: '16px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ fontSize: '13px', color: 'var(--text2)' }}>Duplicate Scan Detection</span><span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>30%</span></div><div className="progress-bar"><div className="progress-fill" style={{ width: '30%', background: 'var(--accent)' }}></div></div></div>
          <div style={{ marginBottom: '16px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ fontSize: '13px', color: 'var(--text2)' }}>Process Sequence Validation</span><span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>25%</span></div><div className="progress-bar"><div className="progress-fill" style={{ width: '25%', background: 'var(--accent2)' }}></div></div></div>
          <div style={{ marginBottom: '16px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ fontSize: '13px', color: 'var(--text2)' }}>Operator Behavior Analysis</span><span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>20%</span></div><div className="progress-bar"><div className="progress-fill" style={{ width: '20%', background: 'var(--accent3)' }}></div></div></div>
          <div style={{ marginBottom: '16px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ fontSize: '13px', color: 'var(--text2)' }}>Time Deviation Analysis</span><span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>15%</span></div><div className="progress-bar"><div className="progress-fill" style={{ width: '15%', background: 'var(--warn)' }}></div></div></div>
          <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ fontSize: '13px', color: 'var(--text2)' }}>Predictive Risk Alerts</span><span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>10%</span></div><div className="progress-bar"><div className="progress-fill" style={{ width: '10%', background: 'var(--danger)' }}></div></div></div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Performance Improvement</div></div>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '16px', background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}><div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase' }}>Before AI</div><div style={{ fontFamily: 'var(--font-head)', fontSize: '32px', fontWeight: 800, color: 'var(--text2)' }}>70%</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Tracking Acc.</div></div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '24px', color: 'var(--accent)' }}>→</div>
            <div style={{ flex: 1, textAlign: 'center', padding: '16px', background: 'rgba(0,212,170,0.06)', borderRadius: 'var(--radius)', border: '1px solid rgba(0,212,170,0.2)' }}><div style={{ fontSize: '11px', color: 'var(--accent)', marginBottom: '4px', textTransform: 'uppercase' }}>After AI</div><div style={{ fontFamily: 'var(--font-head)', fontSize: '32px', fontWeight: 800, color: 'var(--accent)' }}>92%</div><div style={{ fontSize: '11px', color: 'var(--accent)' }}>Tracking Acc.</div></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Error Rate</div><div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--success)' }}>-72%</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>18% → 5%</div></div>
            <div style={{ padding: '12px', background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Response Time</div><div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent2)' }}>-62%</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>850ms → 320ms</div></div>
            <div style={{ padding: '12px', background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Detection Acc.</div><div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent3)' }}>+38%</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>65% → 90%</div></div>
            <div style={{ padding: '12px', background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Data Integrity</div><div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--success)' }}>+58%</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>60 → 95 score</div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAnalytics;