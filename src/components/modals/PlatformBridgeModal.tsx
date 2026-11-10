import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  Radio,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  X,
  Copy,
  Check,
  Sliders,
  Code2,
  Globe,
  Zap,
  Lock
} from 'lucide-react';

interface PlatformBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlatformBridgeModal: React.FC<PlatformBridgeModalProps> = ({ isOpen, onClose }) => {
  const {
    connectionHealth,
    isSyncing,
    testConnection,
    syncWithMainPlatform,
    platformSettings,
    updatePlatformSettings,
    apiBridgeConfig,
    saveApiBridgeConfig,
    addToast
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'status' | 'controls' | 'security' | 'snippet'>('status');
  const [copied, setCopied] = useState<string | null>(null);

  // Edit config state
  const [baseUrlInput, setBaseUrlInput] = useState(apiBridgeConfig.baseUrl);
  const [apiKeyInput, setApiKeyInput] = useState(apiBridgeConfig.adminApiKey);
  const [isTesting, setIsTesting] = useState(false);

  // Edit dynamic settings state
  const [convFee, setConvFee] = useState(platformSettings.convenienceFee);
  const [surgeFee, setSurgeFee] = useState(platformSettings.emergencySurcharge);
  const [commRate, setCommRate] = useState(Math.round(platformSettings.defaultCommissionRate * 100));
  const [maintenance, setMaintenance] = useState(platformSettings.maintenanceMode);
  const [announcement, setAnnouncement] = useState(platformSettings.announcementBanner);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    addToast('Copied to Clipboard', 'Configuration snippet ready to paste.', 'info');
    setTimeout(() => setCopied(null), 2500);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    saveApiBridgeConfig({
      baseUrl: baseUrlInput.trim(),
      adminApiKey: apiKeyInput.trim(),
    });
    addToast('Bridge Config Saved', 'API Endpoint updated. Re-probing connection...', 'success');
    setIsTesting(true);
    await testConnection();
    setIsTesting(false);
  };

  const handleSavePlatformSettings = async () => {
    await updatePlatformSettings({
      convenienceFee: Number(convFee),
      emergencySurcharge: Number(surgeFee),
      defaultCommissionRate: Number(commRate) / 100,
      maintenanceMode: maintenance,
      announcementBanner: announcement.trim(),
    });
  };

  const expressSnippet = `// c:\\Users\\my359\\Desktop\\Punchx-full-info\\src\\backend\\routes\\adminBridgeRoutes.ts
import { Router } from 'express';
import { dbAdapter } from '../db/index.js';
import { logger } from '../logger.js';

export const adminRouter = Router();

// Middleware: Verify Administrative Secret
adminRouter.use((req, res, next) => {
  const key = req.headers['x-admin-key'] || req.headers['authorization']?.replace('Bearer ', '');
  const expected = process.env.ADMIN_API_KEY || 'punchx_admin_secure_live_key_2026_9941a8';
  if (!key || key !== expected) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid admin key' });
  }
  next();
});

// Health & Handshake
adminRouter.get('/health', async (req, res) => {
  res.json({
    success: true,
    status: 'connected',
    platform: 'PunchX Core Production Backend',
    dbProvider: dbAdapter.providerName,
    timestamp: new Date().toISOString()
  });
});

// User & Worker Management
adminRouter.get('/users', async (req, res) => res.json({ success: true, users: await dbAdapter.listUsers() }));
adminRouter.patch('/users/:uid', async (req, res) => res.json({ success: true, user: await dbAdapter.upsertUser({ ...req.body, uid: req.params.uid }) }));
adminRouter.get('/workers', async (req, res) => res.json({ success: true, applications: await dbAdapter.listWorkerApplications() }));
adminRouter.post('/workers', async (req, res) => res.json({ success: true, application: await dbAdapter.createWorkerApplication(req.body) }));
adminRouter.patch('/workers/:id', async (req, res) => res.json({ success: true, application: await dbAdapter.updateWorkerApplicationStatus(req.params.id, req.body.status) }));
adminRouter.get('/orders', async (req, res) => res.json({ success: true, orders: await dbAdapter.listOrders() }));
adminRouter.patch('/orders/:id/status', async (req, res) => res.json({ success: true, order: await dbAdapter.updateOrderStatus(req.params.id, req.body.status) }));`;

  return (
    <div className="modal-backdrop">
      <div className="modal-container bridge-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <div className={`bridge-status-avatar ${connectionHealth.connected ? 'connected' : 'standalone'}`}>
              <Radio size={20} className={connectionHealth.connected ? 'pulse-spin' : ''} />
            </div>
            <div>
              <div className="modal-title-with-badge">
                <h3>Main Platform Repository Connection</h3>
                <span className={`connection-status-pill ${connectionHealth.connected ? 'connected' : 'standalone'}`}>
                  <span className={`pulse-dot ${connectionHealth.connected ? 'active' : 'warn'}`}></span>
                  {connectionHealth.connected ? 'Connected to Main Website' : 'Standalone / Local Mode'}
                </span>
              </div>
              <p className="modal-subtitle">
                Dual-Repository Architecture: Admin Dashboard &rarr; Main PunchX Service Platform via authenticated API bridge.
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bridge-modal-tabs">
          <button
            className={`bridge-tab-btn ${activeTab === 'status' ? 'active' : ''}`}
            onClick={() => setActiveTab('status')}
          >
            <Radio size={15} />
            <span>Connection & Sync</span>
          </button>
          <button
            className={`bridge-tab-btn ${activeTab === 'controls' ? 'active' : ''}`}
            onClick={() => setActiveTab('controls')}
          >
            <Sliders size={15} />
            <span>Live Platform Controls</span>
          </button>
          <button
            className={`bridge-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <ShieldCheck size={15} />
            <span>Security Architecture</span>
          </button>
          <button
            className={`bridge-tab-btn ${activeTab === 'snippet' ? 'active' : ''}`}
            onClick={() => setActiveTab('snippet')}
          >
            <Code2 size={15} />
            <span>Backend Integration Code</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bridge-modal-content">
          {/* TAB 1: Status & Sync */}
          {activeTab === 'status' && (
            <div className="bridge-tab-pane">
              <div className="bridge-health-cards">
                <div className="bridge-metric-card">
                  <div className="metric-label">Backend URL</div>
                  <div className="metric-val url-val">{apiBridgeConfig.baseUrl}</div>
                  <div className="metric-sub">
                    Port: {apiBridgeConfig.baseUrl.split(':').pop() || '80/443'}
                  </div>
                </div>

                <div className="bridge-metric-card">
                  <div className="metric-label">Handshake Status</div>
                  <div className={`metric-val ${connectionHealth.connected ? 'text-success' : 'text-warning'}`}>
                    {connectionHealth.connected ? '200 OK' : 'Offline / Standalone'}
                  </div>
                  <div className="metric-sub">
                    {connectionHealth.connected
                      ? `Latency: ${connectionHealth.latencyMs} ms`
                      : connectionHealth.errorMessage
                      ? connectionHealth.errorMessage.slice(0, 40) + '...'
                      : 'N/A'}
                  </div>
                </div>

                <div className="bridge-metric-card">
                  <div className="metric-label">Active DB Provider</div>
                  <div className="metric-val">
                    {connectionHealth.serverInfo?.dbProvider || 'Local Storage Cache'}
                  </div>
                  <div className="metric-sub">
                    Health: {connectionHealth.serverInfo?.dbHealthy !== false ? 'Operational' : 'Degraded'}
                  </div>
                </div>

                <div className="bridge-metric-card">
                  <div className="metric-label">Auth Protocol</div>
                  <div className="metric-val text-accent">x-admin-key</div>
                  <div className="metric-sub">Encrypted Secret Header</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bridge-actions-bar">
                <button
                  className="btn btn-outline"
                  onClick={async () => {
                    setIsTesting(true);
                    await testConnection();
                    setIsTesting(false);
                  }}
                  disabled={isTesting}
                >
                  <RefreshCw size={14} className={isTesting ? 'spin-icon' : ''} />
                  <span>{isTesting ? 'Pinging Handshake...' : 'Ping Main Backend'}</span>
                </button>

                <button
                  className="btn btn-primary"
                  onClick={syncWithMainPlatform}
                  disabled={isSyncing}
                >
                  <RefreshCw size={14} className={isSyncing ? 'spin-icon' : ''} />
                  <span>{isSyncing ? 'Synchronizing Live Database...' : 'Sync with Main Platform Now'}</span>
                </button>
              </div>

              {/* Bridge Endpoint Form */}
              <div className="bridge-config-section">
                <h4>Bridge Endpoint Configuration</h4>
                <p className="section-help-text">
                  Point this Admin Console to the main platform backend. Supports production live API or local development.
                </p>

                {/* Quick Presets */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                    onClick={() => {
                      setBaseUrlInput('https://www.punchxapp.co.in');
                      addToast('Preset Selected', 'Set to PunchX Production API (https://www.punchxapp.co.in)', 'info');
                    }}
                  >
                    <Globe size={13} />
                    <span>PunchX Live API (https://www.punchxapp.co.in)</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                    onClick={() => {
                      setBaseUrlInput('http://localhost:3000');
                      addToast('Preset Selected', 'Set to Local Backend (http://localhost:3000)', 'info');
                    }}
                  >
                    <Code2 size={13} />
                    <span>Local Dev API (http://localhost:3000)</span>
                  </button>
                </div>

                {typeof window !== 'undefined' && window.location.protocol === 'https:' && baseUrlInput.startsWith('http://') && (
                  <div className="alert-banner warning" style={{ marginBottom: '14px' }}>
                    <Lock size={16} />
                    <div>
                      <strong>Mixed Content Warning:</strong> Browsers block insecure HTTP requests from HTTPS sites. Use <code>https://www.punchxapp.co.in</code> for production.
                    </div>
                  </div>
                )}

                <form onSubmit={handleSaveConfig} className="bridge-config-form">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Main Platform API Base URL</label>
                      <input
                        type="url"
                        className="form-input"
                        value={baseUrlInput}
                        onChange={(e) => setBaseUrlInput(e.target.value)}
                        placeholder="http://localhost:3000"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Administrative Secret Key (x-admin-key)</label>
                      <input
                        type="password"
                        className="form-input"
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder="punchx_admin_secure_live_key_..."
                        required
                      />
                    </div>
                  </div>

                  <div className="form-actions-right">
                    <button type="submit" className="btn btn-secondary">
                      Update Bridge Endpoint
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: Live Platform Controls */}
          {activeTab === 'controls' && (
            <div className="bridge-tab-pane">
              <div className="alert-banner info">
                <Sliders size={18} />
                <div>
                  <strong>Direct Platform Impact:</strong> Changes applied here dynamically update fee calculations,
                  emergency dispatch surcharges, and customer app alerts on the main PunchX website!
                </div>
              </div>

              <div className="bridge-controls-grid">
                <div className="control-card">
                  <label>Customer Platform Convenience Fee (₹)</label>
                  <div className="input-with-symbol">
                    <span className="currency-symbol">₹</span>
                    <input
                      type="number"
                      className="form-input"
                      value={convFee}
                      onChange={(e) => setConvFee(Number(e.target.value))}
                      min="0"
                      max="199"
                    />
                  </div>
                  <span className="field-note">Charged on every consumer booking invoice.</span>
                </div>

                <div className="control-card">
                  <label>Emergency 15-Min Surge Surcharge (₹)</label>
                  <div className="input-with-symbol">
                    <span className="currency-symbol">₹</span>
                    <input
                      type="number"
                      className="form-input"
                      value={surgeFee}
                      onChange={(e) => setSurgeFee(Number(e.target.value))}
                      min="0"
                      max="499"
                    />
                  </div>
                  <span className="field-note">Applied when consumer toggles Priority Emergency Dispatch.</span>
                </div>

                <div className="control-card">
                  <label>Default Marketplace Commission Rate (%)</label>
                  <div className="input-with-symbol">
                    <span className="currency-symbol">%</span>
                    <input
                      type="number"
                      className="form-input"
                      value={commRate}
                      onChange={(e) => setCommRate(Number(e.target.value))}
                      min="5"
                      max="50"
                    />
                  </div>
                  <span className="field-note">PunchX take rate on service technician earnings.</span>
                </div>

                <div className="control-card">
                  <label>Emergency Maintenance Switch</label>
                  <div className="toggle-container-row">
                    <span className={`toggle-label ${maintenance ? 'active text-error' : 'text-success'}`}>
                      {maintenance ? 'MAINTENANCE MODE ACTIVE' : 'MARKETPLACE LIVE'}
                    </span>
                    <button
                      type="button"
                      className={`switch-toggle-btn ${maintenance ? 'active' : ''}`}
                      onClick={() => setMaintenance(!maintenance)}
                    >
                      <span className="switch-slider"></span>
                    </button>
                  </div>
                  <span className="field-note">Temporarily halts new customer checkouts during deployments.</span>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Top Platform Announcement Banner (Customer App Broadcast)</label>
                <input
                  type="text"
                  className="form-input"
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="e.g. PunchX Monsoon SLA Guarantee Active across Kolkata & Nabadwip..."
                />
              </div>

              <div className="form-actions-right" style={{ marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSavePlatformSettings}
                >
                  <Zap size={14} />
                  <span>Push Changes to Main Website</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Security Architecture */}
          {activeTab === 'security' && (
            <div className="bridge-tab-pane">
              <div className="security-architecture-diagram">
                <div className="arch-node admin-node">
                  <div className="node-icon"><ShieldCheck size={24} /></div>
                  <h5>Admin Panel Repo</h5>
                  <code>Admin-dashboard-punchx</code>
                  <span className="node-tag">Port 5173 / Admin Origin</span>
                  <p className="node-desc">Isolated control center. No public customer access.</p>
                </div>

                <div className="arch-arrow">
                  <div className="arrow-line"></div>
                  <div className="arrow-badge">
                    <Lock size={12} />
                    <span>x-admin-key</span>
                  </div>
                  <div className="arrow-line"></div>
                </div>

                <div className="arch-node main-node">
                  <div className="node-icon"><Globe size={24} /></div>
                  <h5>Main Website Repo</h5>
                  <code>Punchx-full-info</code>
                  <span className="node-tag">Port 3000 / Core API</span>
                  <p className="node-desc">Customer & Worker facing marketplace engine.</p>
                </div>
              </div>

              <div className="security-points-list">
                <div className="security-point-item">
                  <CheckCircle2 size={18} className="text-success" />
                  <div>
                    <h6>Zero Secret Exposure in Consumer Bundles</h6>
                    <p>
                      Because the Admin Dashboard is in a separate repository, no admin code, credentials, or administrative
                      escalation routes exist inside the client bundles delivered to standard website visitors.
                    </p>
                  </div>
                </div>

                <div className="security-point-item">
                  <CheckCircle2 size={18} className="text-success" />
                  <div>
                    <h6>Strict Origin Allowlist & Pre-Flight CORS</h6>
                    <p>
                      The main platform Express server strictly restricts CORS headers to approved origins:
                      <code>http://localhost:5173</code>, <code>https://admin.punchxapp.co.in</code>, blocking unauthorized domains.
                    </p>
                  </div>
                </div>

                <div className="security-point-item">
                  <CheckCircle2 size={18} className="text-success" />
                  <div>
                    <h6>Graceful Offline & Standalone Fallback</h6>
                    <p>
                      If the main website is temporarily offline for maintenance, the Admin Console remains fully functional
                      using its resilient local cache and logs all actions to be synchronized upon reconnection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Backend Snippet */}
          {activeTab === 'snippet' && (
            <div className="bridge-tab-pane">
              <div className="snippet-header">
                <div>
                  <h5>Express Router Bridge for Punchx-full-info</h5>
                  <p className="section-help-text">
                    This router receives administrative commands from this dashboard and executes them against the main website database.
                  </p>
                </div>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleCopy(expressSnippet, 'snippet')}
                >
                  {copied === 'snippet' ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  <span>{copied === 'snippet' ? 'Copied!' : 'Copy Router Code'}</span>
                </button>
              </div>

              <pre className="code-block-preview">
                <code>{expressSnippet}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="footer-status-pill">
            <span className={`pulse-dot ${connectionHealth.connected ? 'active' : 'warn'}`}></span>
            <span>
              {connectionHealth.connected
                ? `Handshake Active (${connectionHealth.latencyMs}ms)`
                : 'Standalone Local Cache Mode'}
            </span>
          </div>

          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
