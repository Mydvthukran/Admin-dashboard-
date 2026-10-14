import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  LayoutDashboard,
  Users,
  Eye,
  ShieldAlert,
  UserCheck,
  UserCog,
  FileText,
  Image,
  Layers,
  FolderTree,
  CreditCard,
  CheckCircle2,
  RefreshCw,
  XCircle,
  Percent,
  BellRing,
  Tag,
  Megaphone,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  Flame,
  X,
  HardHat,
  Radio
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { activeTab, activeSubtab, setActiveTab, kycDocs, refunds, failedTransactions, workers } = useAdmin();

  const pendingKycCount = kycDocs.filter((k) => k.status === 'pending').length;
  const pendingRefundCount = refunds.filter((r) => r.status === 'pending').length;
  const failedTxCount = failedTransactions.filter((f) => !f.resolved).length;
  const onDutyWorkerCount = workers.filter((w) => w.status === 'on_duty' || w.status === 'on_job').length;

  const handleNavClick = (tab: string, subtab?: string) => {
    setActiveTab(tab, subtab);
    if (window.innerWidth < 1024) {
      onCloseMobile();
    }
  };

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onCloseMobile}></div>}

      <aside className={`admin-sidebar ${isOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo-container">
            <div className="brand-logo-box">
              <span className="brand-logo-px">P</span>
              <Flame size={14} className="brand-flame" />
            </div>
            <div>
              <div className="brand-title">
                Punch<span className="text-punch-orange">X</span>
              </div>
              <div className="brand-subtitle">ADMIN CONTROL SUITE</div>
            </div>
          </div>
          <button className="mobile-close-btn" onClick={onCloseMobile} aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">COMMAND CENTER</div>

          {/* 0. Dashboard Overview */}
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleNavClick('overview')}
          >
            <div className="nav-item-content">
              <LayoutDashboard size={18} className="nav-icon" />
              <span>Overview & KPIs</span>
            </div>
            <span className="status-pill-live">LIVE</span>
          </button>

          {/* 1. User Management */}
          <div className="nav-group">
            <div
              className={`nav-group-header ${activeTab === 'users' ? 'active-parent' : ''}`}
              onClick={() => handleNavClick('users', activeTab === 'users' ? activeSubtab : 'view')}
            >
              <div className="nav-group-title">
                <span className="nav-number">1</span>
                <Users size={18} className="nav-icon" />
                <span>User Management</span>
              </div>
              <ChevronRight
                size={14}
                className={`nav-arrow ${activeTab === 'users' ? 'expanded' : ''}`}
              />
            </div>

            {activeTab === 'users' && (
              <div className="nav-subitems">
                <button
                  className={`sub-nav-item ${activeSubtab === 'view' ? 'active' : ''}`}
                  onClick={() => handleNavClick('users', 'view')}
                >
                  <Eye size={15} />
                  <span>i. View</span>
                </button>
                <button
                  className={`sub-nav-item ${activeSubtab === 'block' ? 'active' : ''}`}
                  onClick={() => handleNavClick('users', 'block')}
                >
                  <ShieldAlert size={15} />
                  <span>ii. Block</span>
                </button>
                <button
                  className={`sub-nav-item ${activeSubtab === 'verify' ? 'active' : ''}`}
                  onClick={() => handleNavClick('users', 'verify')}
                >
                  <UserCheck size={15} />
                  <span>iii. Verify</span>
                  {pendingKycCount > 0 && (
                    <span className="badge-count badge-amber">{pendingKycCount}</span>
                  )}
                </button>
                <button
                  className={`sub-nav-item ${activeSubtab === 'manage' ? 'active' : ''}`}
                  onClick={() => handleNavClick('users', 'manage')}
                >
                  <UserCog size={15} />
                  <span>iv. Manage</span>
                </button>
              </div>
            )}
          </div>

          {/* Worker Management (Workforce & Field Dispatch) */}
          <div className="nav-group">
            <div
              className={`nav-group-header ${activeTab === 'workers' ? 'active-parent' : ''}`}
              onClick={() => handleNavClick('workers', activeTab === 'workers' ? activeSubtab : 'directory')}
            >
              <div className="nav-group-title">
                <span className="nav-number" style={{ background: 'var(--px-primary-dim)', color: 'var(--px-primary)', border: '1px solid var(--px-primary-border)' }}>W</span>
                <HardHat size={18} className="nav-icon" />
                <span>Worker Management</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {onDutyWorkerCount > 0 && (
                  <span className="badge-count badge-emerald" title={`${onDutyWorkerCount} active field technicians`}>
                    {onDutyWorkerCount}
                  </span>
                )}
                <ChevronRight
                  size={14}
                  className={`nav-arrow ${activeTab === 'workers' ? 'expanded' : ''}`}
                />
              </div>
            </div>

            {activeTab === 'workers' && (
              <div className="nav-subitems">
                <button
                  className={`sub-nav-item ${activeSubtab === 'directory' ? 'active' : ''}`}
                  onClick={() => handleNavClick('workers', 'directory')}
                >
                  <Eye size={15} />
                  <span>i. Directory & Roster</span>
                </button>
                <button
                  className={`sub-nav-item ${activeSubtab === 'dispatch' ? 'active' : ''}`}
                  onClick={() => handleNavClick('workers', 'dispatch')}
                >
                  <Radio size={15} />
                  <span>ii. Live Dispatch</span>
                  {workers.filter((w) => w.status === 'on_job').length > 0 && (
                    <span className="badge-count badge-purple">
                      {workers.filter((w) => w.status === 'on_job').length}
                    </span>
                  )}
                </button>
                <button
                  className={`sub-nav-item ${activeSubtab === 'skills' ? 'active' : ''}`}
                  onClick={() => handleNavClick('workers', 'skills')}
                >
                  <ShieldCheck size={15} />
                  <span>iii. Skills & Safety</span>
                </button>
                <button
                  className={`sub-nav-item ${activeSubtab === 'payouts' ? 'active' : ''}`}
                  onClick={() => handleNavClick('workers', 'payouts')}
                >
                  <Percent size={15} />
                  <span>iv. Payouts & SLA</span>
                </button>
              </div>
            )}
          </div>

          {/* 2. Content Management */}
          <div className="nav-group">
            <div
              className={`nav-group-header ${activeTab === 'content' ? 'active-parent' : ''}`}
              onClick={() => handleNavClick('content', activeTab === 'content' ? activeSubtab : 'banner')}
            >
              <div className="nav-group-title">
                <span className="nav-number">2</span>
                <FileText size={18} className="nav-icon" />
                <span>Content Management</span>
              </div>
              <ChevronRight
                size={14}
                className={`nav-arrow ${activeTab === 'content' ? 'expanded' : ''}`}
              />
            </div>

            {activeTab === 'content' && (
              <div className="nav-subitems">
                <button
                  className={`sub-nav-item ${activeSubtab === 'banner' ? 'active' : ''}`}
                  onClick={() => handleNavClick('content', 'banner')}
                >
                  <Image size={15} />
                  <span>i. Banner</span>
                </button>
                <button
                  className={`sub-nav-item ${activeSubtab === 'content' ? 'active' : ''}`}
                  onClick={() => handleNavClick('content', 'content')}
                >
                  <FileText size={15} />
                  <span>ii. Content</span>
                </button>
                <button
                  className={`sub-nav-item ${activeSubtab === 'listing' ? 'active' : ''}`}
                  onClick={() => handleNavClick('content', 'listing')}
                >
                  <Layers size={15} />
                  <span>iii. Listing</span>
                </button>
                <button
                  className={`sub-nav-item ${activeSubtab === 'categories' ? 'active' : ''}`}
                  onClick={() => handleNavClick('content', 'categories')}
                >
                  <FolderTree size={15} />
                  <span>iv. Categories</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. Payment and Transaction */}
          <div className="nav-group">
            <div
              className={`nav-group-header ${activeTab === 'payments' ? 'active-parent' : ''}`}
              onClick={() => handleNavClick('payments', activeTab === 'payments' ? activeSubtab : 'done')}
            >
              <div className="nav-group-title">
                <span className="nav-number">3</span>
                <CreditCard size={18} className="nav-icon" />
                <span>Payment & Transactions</span>
              </div>
              <ChevronRight
                size={14}
                className={`nav-arrow ${activeTab === 'payments' ? 'expanded' : ''}`}
              />
            </div>

            {activeTab === 'payments' && (
              <div className="nav-subitems">
                <button
                  className={`sub-nav-item ${activeSubtab === 'done' ? 'active' : ''}`}
                  onClick={() => handleNavClick('payments', 'done')}
                >
                  <CheckCircle2 size={15} />
                  <span>i. Payment (Done)</span>
                </button>
                <button
                  className={`sub-nav-item ${activeSubtab === 'refund' ? 'active' : ''}`}
                  onClick={() => handleNavClick('payments', 'refund')}
                >
                  <RefreshCw size={15} />
                  <span>ii. Refund</span>
                  {pendingRefundCount > 0 && (
                    <span className="badge-count badge-red">{pendingRefundCount}</span>
                  )}
                </button>
                <button
                  className={`sub-nav-item ${activeSubtab === 'failed' ? 'active' : ''}`}
                  onClick={() => handleNavClick('payments', 'failed')}
                >
                  <XCircle size={15} />
                  <span>iii. Failed Transaction</span>
                  {failedTxCount > 0 && (
                    <span className="badge-count badge-zinc">{failedTxCount}</span>
                  )}
                </button>
                <button
                  className={`sub-nav-item ${activeSubtab === 'commission' ? 'active' : ''}`}
                  onClick={() => handleNavClick('payments', 'commission')}
                >
                  <Percent size={15} />
                  <span>iv. Commission</span>
                </button>
              </div>
            )}
          </div>

          {/* 4. Important Updates, Offers & Announcements */}
          <div className="nav-group">
            <div
              className={`nav-group-header ${activeTab === 'updates' ? 'active-parent' : ''}`}
              onClick={() => handleNavClick('updates', activeTab === 'updates' ? activeSubtab : 'updates')}
            >
              <div className="nav-group-title">
                <span className="nav-number">4</span>
                <BellRing size={18} className="nav-icon" />
                <span>Updates & Marketing</span>
              </div>
              <ChevronRight
                size={14}
                className={`nav-arrow ${activeTab === 'updates' ? 'expanded' : ''}`}
              />
            </div>

            {activeTab === 'updates' && (
              <div className="nav-subitems">
                <button
                  className={`sub-nav-item ${activeSubtab === 'updates' ? 'active' : ''}`}
                  onClick={() => handleNavClick('updates', 'updates')}
                >
                  <BellRing size={15} />
                  <span>i. Important Update</span>
                </button>
                <button
                  className={`sub-nav-item ${activeSubtab === 'offers' ? 'active' : ''}`}
                  onClick={() => handleNavClick('updates', 'offers')}
                >
                  <Tag size={15} />
                  <span>ii. Offers</span>
                </button>
                <button
                  className={`sub-nav-item ${activeSubtab === 'announcements' ? 'active' : ''}`}
                  onClick={() => handleNavClick('updates', 'announcements')}
                >
                  <Megaphone size={15} />
                  <span>iii. Announcements</span>
                </button>
              </div>
            )}
          </div>

          <div className="nav-section-label">ADMINISTRATION & AUDIT</div>

          {/* 5. Business Reports */}
          <button
            className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => handleNavClick('reports')}
          >
            <div className="nav-item-content">
              <span className="nav-number">5</span>
              <BarChart3 size={18} className="nav-icon" />
              <span>Business Reports</span>
            </div>
            <span className="badge-subtle">PDF/CSV</span>
          </button>

          {/* 6. Roles & Permissions */}
          <button
            className={`nav-item ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => handleNavClick('roles')}
          >
            <div className="nav-item-content">
              <span className="nav-number">6</span>
              <ShieldCheck size={18} className="nav-icon" />
              <span>Roles & Permission</span>
            </div>
            <span className="badge-subtle">RBAC</span>
          </button>
        </nav>

        {/* Sidebar Footer info */}
        <div className="sidebar-footer">
          <div className="server-status-card">
            <div className="status-header">
              <span className="status-ping"></span>
              <span className="status-title">Production Server</span>
            </div>
            <p className="status-meta">Geofence: Kolkata (8km) & Nabadwip (8km)</p>
            <div className="status-repo-link">
              <span>PunchX v2.4.0 Secure</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
