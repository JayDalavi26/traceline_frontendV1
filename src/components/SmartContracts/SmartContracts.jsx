import React, { useState, useEffect } from 'react';
import { blockchainAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';

const SmartContracts = () => {
  const { showToast } = useToast();
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const res = await blockchainAPI.getNetworkStatus();
        setNetwork(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNetwork();
  }, []);

  const contracts = [
    {
      name: 'TraceabilityLedger',
      address: network?.contractAddress || 'Deploy via Hardhat',
      status: network?.contractAddress ? 'Active' : 'Not Deployed',
      desc: 'Records every scan event immutably on the Ethereum blockchain. Generates unique data hashes and prevents duplicate entries.',
      functions: ['recordScan(partId, stage, operatorId)', 'verifyScan(dataHash)', 'getPartScanCount(partId)', 'getTotalRecords()']
    },
    {
      name: 'ProcessSequenceValidator',
      address: 'Deploy via Hardhat',
      status: 'Available',
      desc: 'Validates that each part follows the correct manufacturing sequence (Intake → Cutting → Drilling → Heat Treatment → Inspection → Assembly). Rejects out-of-order transitions.',
      functions: ['registerPart(partId)', 'validateStageTransition(partId, targetStage)', 'getPartStage(partId)', 'getStats()']
    },
    {
      name: 'DuplicateScanGuard',
      address: 'Deploy via Hardhat',
      status: 'Available',
      desc: 'Prevents duplicate DMC scan entries for the same part within a configurable time window (default 60 seconds). Blocks suspicious rapid-fire scans.',
      functions: ['checkScan(partId, stage, operatorId)', 'setCooldown(seconds)', 'getStats()']
    },
  ];

  return (
    <div className="grid-2">
      <div>
        {contracts.map(contract => (
          <div key={contract.name} className="card section-gap">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <div className="card-title">{contract.name}</div>
                <div className="card-subtitle" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', marginTop: '4px', color: contract.address.startsWith('0x') ? 'var(--accent)' : 'var(--text3)' }}>
                  {contract.address.startsWith('0x') ? `${contract.address.slice(0, 14)}...${contract.address.slice(-8)}` : contract.address}
                </div>
              </div>
              <span className={`badge ${contract.status === 'Active' ? 'badge-success' : 'badge-warn'}`}>{contract.status}</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '12px' }}>{contract.desc}</p>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '6px' }}>Functions</div>
              {contract.functions.map(fn => (
                <div key={fn} style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent2)', padding: '3px 0' }}>
                  {fn}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>Contract Source — TraceabilityLedger.sol</div>
          <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: '1.8', overflowX: 'auto', border: '1px solid var(--border)' }}>
            <span style={{ color: '#7c3aed' }}>// SPDX-License-Identifier: MIT</span><br />
            <span style={{ color: '#7c3aed' }}>pragma</span> <span style={{ color: 'var(--accent)' }}>solidity</span> ^0.8.20;<br /><br />
            <span style={{ color: '#7c3aed' }}>contract</span> <span style={{ color: 'var(--warn)' }}>TraceabilityLedger</span> {`{`}<br />
            &nbsp;&nbsp;<span style={{ color: '#7c3aed' }}>mapping</span>(<span style={{ color: 'var(--accent2)' }}>bytes32</span> =&gt; <span style={{ color: 'var(--accent2)' }}>bool</span>) <span style={{ color: 'var(--text2)' }}>public verified</span>;<br />
            &nbsp;&nbsp;<span style={{ color: '#7c3aed' }}>uint256</span> <span style={{ color: 'var(--text2)' }}>public totalRecords</span>;<br /><br />
            &nbsp;&nbsp;<span style={{ color: '#7c3aed' }}>event</span> <span style={{ color: 'var(--warn)' }}>ScanRecorded</span>(<span style={{ color: 'var(--accent2)' }}>bytes32</span> dataHash, <span style={{ color: 'var(--accent2)' }}>string</span> partId, <span style={{ color: 'var(--accent2)' }}>string</span> stage);<br /><br />
            &nbsp;&nbsp;<span style={{ color: '#7c3aed' }}>function</span> <span style={{ color: 'var(--accent)' }}>recordScan</span>(<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: 'var(--accent2)' }}>string calldata</span> partId,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: 'var(--accent2)' }}>string calldata</span> stage,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: 'var(--accent2)' }}>string calldata</span> operatorId<br />
            &nbsp;&nbsp;) <span style={{ color: '#7c3aed' }}>external returns</span> (<span style={{ color: 'var(--accent2)' }}>bytes32</span>) {`{`}<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: 'var(--accent2)' }}>bytes32</span> dataHash = <span style={{ color: '#7c3aed' }}>keccak256</span>(<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;abi.encodePacked(partId, stage, operatorId, block.timestamp)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;);<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#7c3aed' }}>require</span>(!verified[dataHash], <span style={{ color: 'var(--warn)' }}>"Duplicate scan"</span>);<br />
            &nbsp;&nbsp;&nbsp;&nbsp;verified[dataHash] = <span style={{ color: 'var(--accent2)' }}>true</span>;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;totalRecords++;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#7c3aed' }}>emit</span> <span style={{ color: 'var(--accent)' }}>ScanRecorded</span>(dataHash, partId, stage);<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#7c3aed' }}>return</span> dataHash;<br />
            &nbsp;&nbsp;{`}`}<br /><br />
            &nbsp;&nbsp;<span style={{ color: '#7c3aed' }}>function</span> <span style={{ color: 'var(--accent)' }}>verifyScan</span>(<span style={{ color: 'var(--accent2)' }}>bytes32</span> dataHash) <span style={{ color: '#7c3aed' }}>external view returns</span> (<span style={{ color: 'var(--accent2)' }}>bool</span>) {`{`}<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#7c3aed' }}>return</span> verified[dataHash];<br />
            &nbsp;&nbsp;{`}`}<br />
            {`}`}
          </div>

          {/* Deployment Info */}
          <div className="card-title" style={{ margin: '20px 0 12px' }}>Deployment Instructions</div>
          <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '14px', fontSize: '12px', lineHeight: '1.8', color: 'var(--text2)' }}>
            <div style={{ marginBottom: '8px', color: 'var(--text3)', fontWeight: 600 }}>Prerequisites:</div>
            <div>1. Install & run <strong style={{ color: 'var(--accent)' }}>Ganache</strong> (port 7545)</div>
            <div>2. Navigate to <code style={{ color: 'var(--accent2)' }}>traceline_backendV1/blockchain/</code></div>
            <div>3. Run <code style={{ color: 'var(--accent2)' }}>npm install</code></div>
            <div>4. Run <code style={{ color: 'var(--accent2)' }}>npx hardhat compile</code></div>
            <div>5. Run <code style={{ color: 'var(--accent2)' }}>npx hardhat run scripts/deploy.js --network ganache</code></div>
            <div>6. Copy contract address to <code style={{ color: 'var(--accent2)' }}>application.properties</code></div>
          </div>

          {/* Network Status */}
          {network && (
            <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg3)', borderRadius: 'var(--radius)', border: `1px solid ${network.connected ? 'rgba(0,212,170,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className={`dot ${network.connected ? 'green' : 'red'}`}></div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: network.connected ? 'var(--success)' : 'var(--danger)' }}>
                  {network.connected ? 'Ethereum Node Connected' : 'Ethereum Node Offline'}
                </span>
              </div>
              {network.connected && (
                <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text3)' }}>
                  Mode: {network.mode === 'smart_contract' ? 'Smart Contract' : 'Raw Transaction'} | Node: {network.nodeVersion}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartContracts;