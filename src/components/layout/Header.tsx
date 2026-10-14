import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  Search,
  MapPin,
  Bell,
  ShieldCheck,
  ChevronDown,
  UserCheck,
  RotateCcw,
  Menu,
  CheckCircle2,
  AlertTriangle,
  Radio,
  RefreshCw
} from 'lucide-react';
import { PlatformBridgeModal } from '../modals/PlatformBridgeModal';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    currentAdmin,
    admins,
    setCurrentAdmin,
    searchQuery,
    setSearchQuery,
    kycDocs,
    refunds,
    resetToDefaults,
    setActiveTab,
    connectionHealth,
    isSyncing,
    syncWithMainPlatform
  } = useAdmin();

  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBridgeModal, setShowBridgeModal] = useState(false);

  const pendingKycCount = kycDocs.filter((k) => k.status === 'pending').length;
  const pendingRefundCount = refunds.filter((r) => r.status === 'pending').length;
  const totalAlerts = pendingKycCount + pendingRefundCount;

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onToggleSidebar} aria-label="Toggle navigation">
          <Menu size={20} />
        </button>

        <div className="global-search-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="global-search-input"
            placeholder="Search users, orders, Razorpay IDs, listings, services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="header-right">
        {/* Main Platform Link & Sync Pill */}
        <div className="platform-bridge-actions">
          <button
            className={`platform-bridge-pill ${connectionHealth.connected ? 'connected' : 'standalone'}`}
            onClick={() => setShowBridgeModal(true)}
            title="Click to view Main Website Repository connection and synchronization"
          >
            <span className={`pulse-dot ${connectionHealth.connected ? 'active' : 'warn'}`}></span>
            <Radio size={13} className={connectionHealth.connected ? 'pulse-spin' : ''} />
            <span className="bridge-pill-text">
              {connectionHealth.connected ? 'Platform Linked' : 'Standalone Mode'}
            </span>
            {connectionHealth.connected && (
              <span className="bridge-pill-latency">{connectionHealth.latencyMs}ms</span>
            )}
          </button>

          <button
            className="header-sync-btn"
            onClick={syncWithMainPlatform}
            disabled={isSyncing}
            title="Sync live users, workers & orders with main website"
          >
            <RefreshCw size={13} className={isSyncing ? 'spin-icon' : ''} />
            <span className="sync-text">{isSyncing ? 'Syncing...' : 'Sync'}</span>
          </button>
        </div>

        {/* Geofence Cluster Indicator */}
        <div className="geofence-pills">
          <div className="geofence-pill" title="Kolkata Municipal & EM Bypass Geofence (8km radius active)">
            <span className="pulse-dot active"></span>
            <MapPin size={12} />
            <span>Kolkata Zone</span>
          </div>
          <div className="geofence-pill" title="Nabadwip Circular Operating Sector (8km radius active)">
            <span className="pulse-dot active"></span>
            <MapPin size={12} />
            <span>Nabadwip Zone</span>
          </div>
        </div>

        {/* Notifications Dropdown */}
        <div className="header-action-container">
          <button
            className="header-icon-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowAdminMenu(false);
            }}
            aria-label="View notifications"
          >
            <Bell size={18} />
            {totalAlerts > 0 && <span className="notification-badge">{totalAlerts}</span>}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <h4>System Alerts ({totalAlerts})</h4>
                <span className="badge badge-warning">Live Triage</span>
              </div>
              <div className="notification-list">
                {pendingKycCount > 0 ? (
                  <div
                    className="notification-item alert-clickable"
                    onClick={() => {
                      setActiveTab('users', 'verify');
                      setShowNotifications(false);
                    }}
                  >
                    <div className="notif-icon bg-amber">
                      <UserCheck size={14} />
                    </div>
                    <div>
                      <div className="notif-title">{pendingKycCount} Pro KYC Verifications Pending</div>
                      <div className="notif-desc">Click to inspect ID proofs & trade certificates</div>
                    </div>
                  </div>
                ) : (
                  <div className="notification-item">
                    <CheckCircle2 size={16} className="text-emerald" />
                    <span className="notif-desc">All Pro KYC submissions are up to date!</span>
                  </div>
                )}

                {pendingRefundCount > 0 ? (
                  <div
                    className="notification-item alert-clickable"
                    onClick={() => {
                      setActiveTab('payments', 'refund');
                      setShowNotifications(false);
                    }}
                  >
                    <div className="notif-icon bg-red">
                      <AlertTriangle size={14} />
                    </div>
                    <div>
                      <div className="notif-title">{pendingRefundCount} Refund Claims Awaiting Approval</div>
                      <div className="notif-desc">Customer disputes requiring review & Razorpay resolution</div>
                    </div>
                  </div>
                ) : (
                  <div className="notification-item">
                    <CheckCircle2 size={16} className="text-emerald" />
                    <span className="notif-desc">Zero pending refund claims.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Reset Mock Data */}
        <button
          className="header-reset-btn"
          onClick={() => {
            if (window.confirm('Reset all mock data back to defaults?')) {
              resetToDefaults();
            }
          }}
          title="Reset all demo data and changes"
        >
          <RotateCcw size={14} />
          <span className="reset-text">Reset Demo</span>
        </button>

        {/* Admin User Profile Switcher */}
        <div className="admin-profile-container">
          <button
            className="admin-profile-btn"
            onClick={() => {
              setShowAdminMenu(!showAdminMenu);
              setShowNotifications(false);
            }}
          >
            <img src={currentAdmin.avatarUrl} alt={currentAdmin.name} className="admin-avatar" />
            <div className="admin-info-text">
              <span className="admin-name">{currentAdmin.name}</span>
              <span className="admin-role-badge">
                <ShieldCheck size={11} /> {currentAdmin.roleName}
              </span>
            </div>
            <ChevronDown size={14} className="chevron-icon" />
          </button>

          {showAdminMenu && (
            <div className="admin-switch-menu">
              <div className="menu-header">
                <p className="menu-subtext">Switch Admin Persona for Testing:</p>
              </div>
              {admins.map((adm) => (
                <button
                  key={adm.id}
                  className={`admin-switch-item ${adm.id === currentAdmin.id ? 'selected' : ''}`}
                  onClick={() => {
                    setCurrentAdmin(adm);
                    setShowAdminMenu(false);
                  }}
                >
                  <img src={adm.avatarUrl} alt={adm.name} className="switch-avatar" />
                  <div className="switch-text">
                    <div className="switch-name">{adm.name}</div>
                    <div className="switch-role">{adm.roleName}</div>
                  </div>
                  {adm.id === currentAdmin.id && <span className="current-pill">Current</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Platform Bridge & Sync Modal */}
      <PlatformBridgeModal
        isOpen={showBridgeModal}
        onClose={() => setShowBridgeModal(false)}
      />
    </header>
  );
};
