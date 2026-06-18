import React, { useState, useEffect } from 'react';
import { aiAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import AIInspection from './AIInspection';

const AIAnalytics = () => {
  const { showToast } = useToast();
  const [insights, setInsights] = useState({});
  const [bottleneck, setBottleneck] = useState({});
  const [tab, setTab] = useState('overview'); // 'overview' or 'inspect'

  useEffect(() => {
    aiAPI.getInsights()
      .then(res => setInsights(res.data || {}))
      .catch(() => {});
    aiAPI.getBottleneck()
      .then(res => setBottleneck(res.data || {}))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'var(--bg3)', padding: '4px', borderRadius: 'var(--radius)', width: 'fit-content' }}>
        <button className={`btn ${tab === 'overview' ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: '8px 20px', fontSize: '13px' }} onClick={() => setTab('overview')}>📊 Overview</button>
        <button className={`btn ${tab === 'inspect' ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: '8px 20px', fontSize: '13px' }} onClick={() => setTab('inspect')}>🔍 Defect Inspection</button>
      </div>

      {tab === 'inspect' ? <AIInspection /> : (
        <>
          <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="metric purple"><div className="metric-label">Detection Accuracy</div><div className="metric-value purple">{insights.detectionAccuracy || 0}%</div><div className="metric-change"><span className="up">↑ vs manual</span></div></div>
        <div className="metric teal"><div className="metric-label">Predictions Made</div><div className="metric-value teal">{(insights.predictionsMade || 0).toLocaleString()}</div><div className="metric-change">This month</div></div>
        <div className="metric green"><div className="metric-label">Defects Prevented</div><div className="metric-value green">{insights.defectsPrevented || 0}</div><div className="metric-change"><span className="up">↑ Early detection</span></div></div>
        <div className="metric blue"><div className="metric-label">Model Confidence</div><div className="metric-value blue">{insights.modelConfidence || 0}%</div><div className="metric-change">Avg across all models</div></div>
      </div>

      <div className="ai-insight section-gap">
        <div className="ai-tag">✦ AI Recommendation</div>
        <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: '1.7' }}>
          {insights.recommendation || 'Analyzing current production data for recommendations...'}
        </p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button className="btn btn-primary" style={{ padding: '7px 14px', fontSize: '12px' }} onClick={() => showToast('Work order created', '✅')}>Create Work Order</button>
          <button className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: '12px' }}>Dismiss</button>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">Bottleneck Forecast</div><span className="badge badge-accent">AI Model</span></div>
          {Object.keys(bottleneck).length === 0 ?
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text3)' }}>No bottleneck data available</div> :
            Object.entries(bottleneck).map(([stage, risk]) => (
              <div key={stage} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{stage}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{risk}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${risk}%`, background: risk > 70 ? 'var(--danger)' : risk > 40 ? 'var(--warn)' : 'var(--accent)' }}></div>
                </div>
              </div>
            ))
          }
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Performance Improvement</div></div>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '16px', background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}><div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase' }}>Before AI</div><div style={{ fontFamily: 'var(--font-head)', fontSize: '32px', fontWeight: 800, color: 'var(--text2)' }}>70%</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Tracking Acc.</div></div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '24px', color: 'var(--accent)' }}>→</div>
            <div style={{ flex: 1, textAlign: 'center', padding: '16px', background: 'rgba(0,212,170,0.06)', borderRadius: 'var(--radius)', border: '1px solid rgba(0,212,170,0.2)' }}><div style={{ fontSize: '11px', color: 'var(--accent)', marginBottom: '4px', textTransform: 'uppercase' }}>After AI</div><div style={{ fontFamily: 'var(--font-head)', fontSize: '32px', fontWeight: 800, color: 'var(--accent)' }}>{insights.trackingAccuracyAfterAI || 92}%</div><div style={{ fontSize: '11px', color: 'var(--accent)' }}>Tracking Acc.</div></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Error Rate</div><div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--success)' }}>-72%</div></div>
            <div style={{ padding: '12px', background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Response Time</div><div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent2)' }}>-62%</div></div>
            <div style={{ padding: '12px', background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Detection Acc.</div><div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent3)' }}>+38%</div></div>
            <div style={{ padding: '12px', background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Data Integrity</div><div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--success)' }}>+58%</div></div>
          </div>
        </div>
      </div>
        </>
      )}
    </>
  );
};

export default AIAnalytics;