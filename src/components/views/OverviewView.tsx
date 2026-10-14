import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  Users,
  UserCheck,
  CreditCard,
  Percent,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Megaphone,
  PlusCircle,
  Eye,
  AlertTriangle,
  HardHat,
  Radio
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const {
    users,
    kycDocs,
    payments,
    refunds,
    workers,
    setActiveTab
  } = useAdmin();

  // Calculations
  const totalUsers = users.length;
  const verifiedPros = users.filter((u) => u.role === 'professional' && u.status === 'active').length;
  const pendingKyc = kycDocs.filter((k) => k.status === 'pending');
  const pendingRefunds = refunds.filter((r) => r.status === 'pending');
  const completedPayments = payments.filter((p) => p.status === 'completed');
  const activeWorkersOnDuty = workers.filter((w) => w.status === 'on_duty' || w.status === 'on_job').length;
  const ongoingFieldJobs = workers.filter((w) => w.activeJob).length;

  const totalGMV = completedPayments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCommission = completedPayments.reduce((acc, curr) => acc + curr.commissionAmount, 0);

  return (
    <div className="view-container">
      {/* Page Title & Subtitle */}
      <div className="view-header">
        <div>
          <h1 className="view-title">Marketplace Command Center</h1>
          <p className="view-subtitle">
            Real-time operations, provider verification, transactions, and geofence monitoring.
          </p>
        </div>
        <div className="view-header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setActiveTab('updates', 'announcements');
            }}
          >
            <Megaphone size={16} />
            <span>Send Broadcast</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setActiveTab('content', 'banner');
            }}
          >
            <PlusCircle size={16} />
            <span>New Banner / Offer</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Total Platform Volume (GMV)</span>
            <div className="stat-icon-wrapper bg-emerald-dim">
              <CreditCard size={18} className="text-emerald" />
            </div>
          </div>
          <div className="stat-value">₹{totalGMV.toLocaleString('en-IN')}</div>
          <div className="stat-footer text-emerald">
            <TrendingUp size={14} />
            <span>+18.4% vs last week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Platform Commission Earned</span>
            <div className="stat-icon-wrapper bg-orange-dim">
              <Percent size={18} className="text-punch-orange" />
            </div>
          </div>
          <div className="stat-value">₹{Math.round(totalCommission).toLocaleString('en-IN')}</div>
          <div className="stat-footer text-muted">
            <span>Avg take-rate: 14.8%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Active & Verified Pros</span>
            <div className="stat-icon-wrapper bg-indigo-dim">
              <UserCheck size={18} className="text-indigo" />
            </div>
          </div>
          <div className="stat-value">{verifiedPros} Pros</div>
          <div className="stat-footer text-emerald">
            <CheckCircle2 size={14} />
            <span>Across Kolkata & Nabadwip</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Total Registered Users</span>
            <div className="stat-icon-wrapper bg-blue-dim">
              <Users size={18} className="text-blue" />
            </div>
          </div>
          <div className="stat-value">{totalUsers} Accounts</div>
          <div className="stat-footer text-muted">
            <span>{users.filter((u) => u.role === 'customer').length} Customers · {users.filter((u) => u.role === 'professional').length} Pros</span>
          </div>
        </div>
      </div>

      {/* Workforce Live Field Status Card */}
      <div
        className="card mb-6 p-4 flex items-center justify-between"
        style={{
          background: 'linear-gradient(90deg, rgba(255,107,0,0.12) 0%, rgba(18,24,38,0.95) 100%)',
          borderLeft: '4px solid var(--px-primary)',
          borderRight: '1px solid var(--border-subtle)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="stat-icon-wrapper bg-orange-dim" style={{ width: '42px', height: '42px' }}>
            <HardHat size={22} className="text-punch-orange" />
          </div>
          <div>
            <div className="font-bold text-base flex items-center gap-2">
              Hyperlocal Field Workforce: {activeWorkersOnDuty} of {workers.length} Technicians On-Duty
              <span className="badge badge-success text-xs">Live Operations</span>
            </div>
            <div className="text-xs text-muted mt-0.5">
              {ongoingFieldJobs} active tasks in field · 98.1% on-time arrival rate · Avg response time: 3.4 mins across Kolkata & Nabadwip
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-secondary btn-sm flex items-center gap-1.5"
            onClick={() => setActiveTab('workers', 'dispatch')}
          >
            <Radio size={14} className="text-purple animate-pulse" />
            <span>Live Dispatch</span>
          </button>
          <button
            className="btn btn-primary btn-sm flex items-center gap-1.5"
            onClick={() => setActiveTab('workers', 'directory')}
          >
            <span>Worker Operations</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>

      {/* Immediate Attention Callouts if any */}
      {(pendingKyc.length > 0 || pendingRefunds.length > 0) && (
        <div className="action-banners-grid">
          {pendingKyc.length > 0 && (
            <div className="action-banner warning-banner">
              <div className="action-banner-content">
                <div className="action-icon bg-amber">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="action-title">{pendingKyc.length} Service Professionals Awaiting KYC Verification</h4>
                  <p className="action-desc">
                    Review submitted Aadhaar, trade licenses, and skill certifications to activate their accounts.
                  </p>
                </div>
              </div>
              <button
                className="btn btn-sm btn-amber"
                onClick={() => {
                  setActiveTab('users', 'verify');
                }}
              >
                Inspect Submissions
              </button>
            </div>
          )}

          {pendingRefunds.length > 0 && (
            <div className="action-banner danger-banner">
              <div className="action-banner-content">
                <div className="action-icon bg-red">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="action-title">{pendingRefunds.length} Refund Dispute Awaiting Review</h4>
                  <p className="action-desc">
                    Customer claims pending triage against PunchX cancellation policy.
                  </p>
                </div>
              </div>
              <button
                className="btn btn-sm btn-red"
                onClick={() => {
                  setActiveTab('payments', 'refund');
                }}
              >
                Resolve Refunds
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Live Operating Zones + Weekly Trends */}
      <div className="dashboard-grid-layout">
        {/* Geofence & Service Coverage Status */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">GPS Geofence Coverage & Operational Zones</h3>
              <p className="card-subtitle">Server-side geofencing configured via environment</p>
            </div>
            <span className="badge badge-success">Enforced</span>
          </div>

          <div className="geofence-zones-display">
            <div className="zone-box">
              <div className="zone-box-header">
                <div className="zone-icon-box bg-orange-dim text-punch-orange">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="zone-name">Kolkata Municipal & EM Bypass</div>
                  <div className="zone-coords">Radius: 8.0 km · Circular Sector</div>
                </div>
                <span className="zone-status active">LIVE</span>
              </div>
              <p className="zone-info">
                Full coverage across Salt Lake (Sec I-V), New Town, Ballygunge, Park Street, Behala, and Jadavpur.
              </p>
              <div className="zone-meta-tags">
                <span className="tag">40 Services Live</span>
                <span className="tag">Avg Arrival: 32 mins</span>
              </div>
            </div>

            <div className="zone-box">
              <div className="zone-box-header">
                <div className="zone-icon-box bg-blue-dim text-blue">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="zone-name">Nabadwip Heritage Sector</div>
                  <div className="zone-coords">Radius: 8.0 km · Circular Sector</div>
                </div>
                <span className="zone-status active">LIVE</span>
              </div>
              <p className="zone-info">
                Covers Nabadwip Dham, Mayapur approach corridor, Prachin Mayapur, and Nadia district border.
              </p>
              <div className="zone-meta-tags">
                <span className="tag">22 Services Live</span>
                <span className="tag">Avg Arrival: 45 mins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Weekly Booking Trends */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Service Demand Trend</h3>
              <p className="card-subtitle">Daily completed bookings in current week</p>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setActiveTab('reports')}
            >
              Full Report <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="mini-chart-container">
            <div className="chart-bar-group">
              {[
                { day: 'Mon', count: 28, height: '56%' },
                { day: 'Tue', count: 34, height: '68%' },
                { day: 'Wed', count: 42, height: '84%' },
                { day: 'Thu', count: 39, height: '78%' },
                { day: 'Fri', count: 48, height: '96%' },
                { day: 'Sat', count: 50, height: '100%' },
                { day: 'Sun', count: 45, height: '90%' }
              ].map((b) => (
                <div key={b.day} className="chart-bar-item">
                  <div className="chart-bar-tooltip">{b.count} jobs</div>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill" style={{ height: b.height }}></div>
                  </div>
                  <span className="chart-bar-label">{b.day}</span>
                </div>
              ))}
            </div>
            <div className="chart-summary">
              <div>
                <span className="text-muted">Peak Category:</span>
                <span className="font-semibold text-punch-orange"> Split AC Servicing</span>
              </div>
              <div>
                <span className="text-muted">Pro Satisfaction:</span>
                <span className="font-semibold text-emerald"> 4.88 / 5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions & Rapid Action Queue */}
      <div className="dashboard-grid-layout mt-6">
        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Recent Razorpay Settlements</h3>
              <p className="card-subtitle">Real-time payment captures</p>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setActiveTab('payments', 'done');
              }}
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 4).map((p) => (
                  <tr key={p.id}>
                    <td>
                      <code className="text-code">{p.razorpayPaymentId}</code>
                    </td>
                    <td>
                      <div className="cell-title">{p.customerName}</div>
                      <div className="cell-sub">{p.method}</div>
                    </td>
                    <td>
                      <div className="cell-title">{p.serviceName}</div>
                      <div className="cell-sub">Pro: {p.proName}</div>
                    </td>
                    <td className="font-semibold">₹{p.amount}</td>
                    <td>
                      <span
                        className={`badge ${
                          p.status === 'completed'
                            ? 'badge-success'
                            : p.status === 'refunded'
                            ? 'badge-purple'
                            : 'badge-warning'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Verification Quick Queue */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">KYC Document Inspection Queue</h3>
              <p className="card-subtitle">Service professionals awaiting approval</p>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setActiveTab('users', 'verify');
              }}
            >
              Inspect All <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="kyc-preview-list">
            {kycDocs.slice(0, 3).map((k) => (
              <div key={k.id} className="kyc-preview-item">
                <img src={k.selfieUrl} alt={k.userName} className="kyc-avatar" />
                <div className="kyc-meta">
                  <div className="kyc-name">{k.userName}</div>
                  <div className="kyc-category">{k.serviceCategory} · {k.experienceYears}y exp</div>
                  <div className="kyc-doc-tag">
                    <span className="doc-pill">{k.docType}: {k.docNumber}</span>
                  </div>
                </div>
                <div className="kyc-actions">
                  <span
                    className={`badge ${
                      k.status === 'verified'
                        ? 'badge-success'
                        : k.status === 'pending'
                        ? 'badge-warning'
                        : 'badge-danger'
                    }`}
                  >
                    {k.status}
                  </span>
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => {
                      setActiveTab('users', 'verify');
                    }}
                    title="Inspect document"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
