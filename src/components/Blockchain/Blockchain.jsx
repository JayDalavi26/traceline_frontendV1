import React, { useState, useEffect } from 'react';
import { blockchainAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';

const Blockchain = () => {
  const { showToast } = useToast();
  const [blocks, setBlocks] = useState([]);
  const [stats, setStats] = useState(null);
  const [network, setNetwork] = useState(null);
  const [verifyHash, setVerifyHash] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [blocksRes, statsRes, networkRes] = await Promise.all([
        blockchainAPI.getBlocks(),
        blockchainAPI.getStats(),
        blockchainAPI.getNetworkStatus()
      ]);
      setBlocks(blocksRes.data);
      setStats(statsRes.data);
      setNetwork(networkRes.data);
    } catch (err) {
      console.error('Failed to fetch blockchain data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (txHash) => {
    if (!txHash) return;
    try {
      const res = await blockchainAPI.verifyTransaction(txHash);
      setVerifyResult(res.data);
      if (res.data.verified) {
        showToast('Transaction verified on Ethereum blockchain', '⛓');
      } else {
        showToast('Transaction NOT found on chain', '⚠️');
      }
    } catch (err) {
      showToast('Verification failed', '❌');
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)' }}>Loading blockchain data...</div>;
  }

  return (
    <>
      {/* Metrics */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="metric teal">
          <div className="metric-label">Total Blocks</div>
          <div className="metric-value teal">{stats?.totalBlocks?.toLocaleString() || 0}</div>
          <div className="metric-change">Since genesis block</div>
        </div>
        <div className="metric green">
          <div className="metric-label">On-Chain (ETH)</div>
          <div className="metric-value green">{stats?.onChainBlocks?.toLocaleString() || 0}</div>
          <div className="metric-change">Recorded on Ethereum</div>
        </div>
        <div className="metric blue">
          <div className="metric-label">Data Integrity</div>
          <div className="metric-value blue">{stats?.integrity?.integrityPercent ? Math.round(stats.integrity.integrityPercent) + '%' : '—'}</div>
          <div className="metric-change">{stats?.integrity?.brokenLinks === 0 ? 'No tampering detected' : `${stats?.integrity?.brokenLinks} broken links`}</div>
        </div>
        <div className="metric purple">
          <div className="metric-label">Network</div>
          <div className="metric-value purple">{network?.connected ? 'Live' : 'Offline'}</div>
          <div className="metric-change">{network?.mode === 'smart_contract' ? 'Smart Contract Mode' : network?.connected ? 'Raw TX Mode' : 'MongoDB Only'}</div>
        </div>
      </div>

      {/* Ethereum Network Status */}
      {network?.connected && (
        <div className="card section-gap" style={{ borderLeft: '3px solid var(--accent)' }}>
          <div className="card-header">
            <div className="card-title">Ethereum Network (Ganache)</div>
            <div className="live-dot" style={{ marginRight: '4px' }}></div>
            <span style={{ fontSize: '12px', color: 'var(--success)' }}>Connected</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '12px' }}>
            <div style={{ background: 'var(--bg3)', padding: '12px', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>Wallet</div>
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text)', marginTop: '4px', wordBreak: 'break-all' }}>{network?.walletAddress ? `${network.walletAddress.slice(0, 10)}...${network.walletAddress.slice(-8)}` : '—'}</div>
            </div>
            <div style={{ background: 'var(--bg3)', padding: '12px', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>Balance</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)', marginTop: '4px' }}>{network?.balanceEth ? parseFloat(network.balanceEth).toFixed(2) + ' ETH' : '—'}</div>
            </div>
            <div style={{ background: 'var(--bg3)', padding: '12px', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>Latest Block</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>#{network?.latestBlock || 0}</div>
            </div>
            <div style={{ background: 'var(--bg3)', padding: '12px', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>Chain ID</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>{network?.chainId || '—'}</div>
            </div>
            {network?.contractAddress && (
              <div style={{ background: 'var(--bg3)', padding: '12px', borderRadius: 'var(--radius)', gridColumn: 'span 2' }}>
                <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>Smart Contract</div>
                <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginTop: '4px' }}>{network.contractAddress}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Block Chain Visual */}
      <div className="card section-gap">
        <div className="card-header">
          <div className="card-title">Latest Blocks</div>
          <div className="live-dot" style={{ marginRight: '4px' }}></div>
          <span style={{ fontSize: '12px', color: 'var(--success)' }}>Live</span>
        </div>
        <div className="scroll-h">
          <div className="block-chain">
            {blocks.map((block, idx) => (
              <React.Fragment key={block.blockNumber || idx}>
                <div
                  className="block"
                  onClick={() => {
                    if (block.txHash) {
                      handleVerify(block.txHash);
                    } else {
                      showToast(`Block #${block.blockNumber} — ${block.partId} — ${block.type === 'scan' ? 'Scan Event' : 'Alert'}`, '⬡');
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="block-hash" style={{ color: block.onChain ? 'var(--accent)' : 'var(--text3)' }}>
                    {block.txHash ? `${block.txHash.slice(0, 10)}...` : `${block.hash?.slice(0, 10)}...`}
                  </div>
                  <div className="block-num" style={{ color: block.type === 'alert' ? 'var(--danger)' : 'var(--text)' }}>
                    #{block.blockNumber}
                  </div>
                  <div className="block-time" style={{ color: 'var(--text3)', fontSize: '10px' }}>
                    {block.onChain ? '⛓ On-Chain' : '📦 Local'}
                  </div>
                </div>
                {idx < blocks.length - 1 && <div className="chain-link"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Verify Transaction */}
        <div className="card">
          <div className="card-header"><div className="card-title">Verify Transaction</div></div>
          <p style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '12px' }}>
            Enter an Ethereum transaction hash to verify it exists on-chain and is immutable.
          </p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="0x transaction hash..."
              value={verifyHash}
              onChange={(e) => setVerifyHash(e.target.value)}
              style={{ flex: 1, fontSize: '12px', fontFamily: 'var(--font-mono)' }}
            />
            <button className="btn btn-primary" onClick={() => handleVerify(verifyHash)}>Verify</button>
          </div>
          {verifyResult && (
            <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '14px', border: `1px solid ${verifyResult.verified ? 'rgba(0,212,170,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '16px' }}>{verifyResult.verified ? '✅' : '❌'}</span>
                <span style={{ fontWeight: 600, color: verifyResult.verified ? 'var(--success)' : 'var(--danger)' }}>
                  {verifyResult.verified ? 'Verified on Blockchain' : 'Not Found'}
                </span>
              </div>
              {verifyResult.verified && (
                <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.8' }}>
                  <div><strong>Block:</strong> #{verifyResult.blockNumber}</div>
                  <div><strong>From:</strong> <span className="mono">{verifyResult.from}</span></div>
                  <div><strong>Status:</strong> {verifyResult.confirmed ? 'Confirmed' : 'Pending'}</div>
                  <div><strong>Gas Used:</strong> {verifyResult.gasUsed}</div>
                  {verifyResult.decodedData && (
                    <div style={{ marginTop: '8px' }}><strong>Data:</strong> <code style={{ fontSize: '11px', background: 'var(--bg)', padding: '4px 8px', borderRadius: '4px', display: 'block', marginTop: '4px', overflowX: 'auto' }}>{verifyResult.decodedData}</code></div>
                  )}
                </div>
              )}
              {!verifyResult.verified && verifyResult.reason && (
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{verifyResult.reason}</div>
              )}
            </div>
          )}
        </div>

        {/* Recent Transactions Table */}
        <div className="card">
          <div className="card-header"><div className="card-title">Recent Transactions</div></div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Block</th><th>Type</th><th>Part</th><th>Chain</th><th>TX Hash</th></tr>
              </thead>
              <tbody>
                {blocks.slice(0, 6).map(block => (
                  <tr key={block.blockNumber}>
                    <td><span className="mono">#{block.blockNumber}</span></td>
                    <td>
                      <span className={`badge ${block.type === 'alert' ? 'badge-danger' : 'badge-accent'}`}>
                        {block.type === 'alert' ? 'Alert' : 'Scan'}
                      </span>
                    </td>
                    <td><span className="mono">{block.partId}</span></td>
                    <td>
                      <span className={`badge ${block.onChain ? 'badge-success' : 'badge-neutral'}`}>
                        {block.onChain ? '⛓ ETH' : 'Local'}
                      </span>
                    </td>
                    <td>
                      {block.txHash ? (
                        <span
                          className="mono"
                          style={{ cursor: 'pointer', color: 'var(--accent)', fontSize: '11px' }}
                          onClick={() => { setVerifyHash(block.txHash); handleVerify(block.txHash); }}
                        >
                          {block.txHash.slice(0, 10)}...
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text3)', fontSize: '11px' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Chain Integrity */}
      {stats?.integrity && (
        <div className="card section-gap">
          <div className="card-header"><div className="card-title">Blockchain Integrity Audit</div></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'var(--bg3)', padding: '14px', borderRadius: 'var(--radius)', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>Valid Links</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-head)' }}>{stats.integrity.validBlocks}</div>
            </div>
            <div style={{ background: 'var(--bg3)', padding: '14px', borderRadius: 'var(--radius)', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>Broken Links</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: stats.integrity.brokenLinks > 0 ? 'var(--danger)' : 'var(--success)', fontFamily: 'var(--font-head)' }}>{stats.integrity.brokenLinks}</div>
            </div>
            <div style={{ background: 'var(--bg3)', padding: '14px', borderRadius: 'var(--radius)', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>Integrity</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-head)' }}>{Math.round(stats.integrity.integrityPercent)}%</div>
            </div>
            <div style={{ background: 'var(--bg3)', padding: '14px', borderRadius: 'var(--radius)', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>On-Chain</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent2)', fontFamily: 'var(--font-head)' }}>{stats.integrity.onChainBlocks}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Blockchain;