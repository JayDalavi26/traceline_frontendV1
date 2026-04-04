import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LoginScreen = () => {
  const { login, selectedRole, setSelectedRole } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const success = login(username, password, selectedRole);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div id="loginScreen" style={{ position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,212,170,0.07) 0%, transparent 70%)', top: '-150px', left: '-100px' }}></div>
        <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,153,255,0.06) 0%, transparent 70%)', bottom: '-100px', right: '-100px' }}></div>
      </div>
      
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: '24px', padding: '44px 44px 36px', width: '420px', maxWidth: '94vw', position: 'relative', zIndex: 1, boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 12px', boxShadow: '0 8px 32px rgba(0,212,170,0.25)' }}>⬡</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '26px', fontWeight: 800, background: 'linear-gradient(90deg, var(--accent), var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '4px' }}>TraceLine</div>
          <div style={{ fontSize: '12px', color: 'var(--text3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Industry 4.0 Traceability Platform</div>
        </div>

        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Select Role</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
          <button onClick={() => setSelectedRole('admin')} className={`role-btn ${selectedRole === 'admin' ? 'selected' : ''}`} style={{ padding: '14px 10px', borderRadius: '12px', border: `2px solid ${selectedRole === 'admin' ? 'var(--accent)' : 'var(--border)'}`, background: selectedRole === 'admin' ? 'rgba(0,212,170,0.08)' : 'var(--bg3)', color: selectedRole === 'admin' ? 'var(--accent)' : 'var(--text2)', cursor: 'pointer', textAlign: 'center', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}>
            <span style={{ fontSize: '22px', display: 'block', marginBottom: '6px' }}>🛡️</span>
            Admin
            <div style={{ fontSize: '10px', fontWeight: 400, color: 'inherit', marginTop: '3px', opacity: 0.7 }}>Full access</div>
          </button>
          <button onClick={() => setSelectedRole('operator')} className={`role-btn ${selectedRole === 'operator' ? 'selected' : ''}`} style={{ padding: '14px 10px', borderRadius: '12px', border: `2px solid ${selectedRole === 'operator' ? 'var(--accent)' : 'var(--border)'}`, background: selectedRole === 'operator' ? 'rgba(0,212,170,0.08)' : 'var(--bg3)', color: selectedRole === 'operator' ? 'var(--accent)' : 'var(--text2)', cursor: 'pointer', textAlign: 'center', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}>
            <span style={{ fontSize: '22px', display: 'block', marginBottom: '6px' }}>👷</span>
            Operator
            <div style={{ fontSize: '10px', fontWeight: 400, color: 'inherit', marginTop: '3px', opacity: 0.7 }}>Own pipeline</div>
          </button>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

        <div className="form-group">
          <label className="form-label">Username</label>
          <input type="text" className="form-input" placeholder={selectedRole === 'admin' ? 'admin' : 'op.sharma'} value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-group" style={{ marginBottom: '8px' }}>
          <label className="form-label">Password</label>
          <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
        </div>

        <button className="login-btn" onClick={handleLogin} style={{ width: '100%', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, background: 'linear-gradient(135deg, var(--accent), #00b893)', color: '#000', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s', marginTop: '8px', letterSpacing: '0.02em' }}>Sign In →</button>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--text3)', lineHeight: '1.6' }}>
          <strong style={{ color: 'var(--text2)' }}>Demo credentials</strong><br />
          Admin: <code style={{ color: 'var(--accent)' }}>admin</code> / <code style={{ color: 'var(--accent)' }}>admin123</code><br />
          Operator: <code style={{ color: 'var(--accent2)' }}>op.sharma</code> / <code style={{ color: 'var(--accent2)' }}>op123</code>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;