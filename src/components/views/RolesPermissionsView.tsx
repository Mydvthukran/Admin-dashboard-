import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import type { AdminRole } from '../../types';
import { Modal } from '../common/Modal';
import {
  PlusCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Mail,
  UserCheck
} from 'lucide-react';

export const RolesPermissionsView: React.FC = () => {
  const {
    roles,
    admins,
    auditLogs,
    currentAdmin,
    updateRolePermissions,
    addAdmin
  } = useAdmin();

  // Invite Admin Modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteFormData, setInviteFormData] = useState({
    name: '',
    email: '',
    roleId: roles[1]?.id || 'role_ops',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  });

  const handleTogglePermission = (roleId: string, permKey: keyof AdminRole['permissions']) => {
    // Super admin permissions remain fully enabled for safety
    if (roleId === 'role_super' && permKey === 'canManageRoles') return;

    const role = roles.find((r) => r.id === roleId);
    if (!role) return;

    const updatedPermissions = {
      ...role.permissions,
      [permKey]: !role.permissions[permKey]
    };

    updateRolePermissions(roleId, updatedPermissions);
  };

  const handleInviteAdmin = () => {
    if (!inviteFormData.name.trim() || !inviteFormData.email.trim()) return;
    const selectedRole = roles.find((r) => r.id === inviteFormData.roleId);

    addAdmin({
      name: inviteFormData.name,
      email: inviteFormData.email,
      roleId: inviteFormData.roleId,
      roleName: selectedRole?.name || 'Operations Manager',
      avatarUrl: inviteFormData.avatarUrl,
      status: 'active'
    });

    setIsInviteModalOpen(false);
    setInviteFormData({
      name: '',
      email: '',
      roleId: roles[1]?.id || 'role_ops',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
  };

  const permissionLabels: { key: keyof AdminRole['permissions']; label: string; desc: string }[] = [
    { key: 'canViewUsers', label: 'View Users & Profiles', desc: 'Inspect customer and professional contact information and history' },
    { key: 'canBlockUsers', label: 'Enforce Account Suspension', desc: 'Ban or freeze accounts violating safety code' },
    { key: 'canVerifyKYC', label: 'Verify Professional KYC', desc: 'Inspect Aadhaar/ID and trade licenses to certify pros' },
    { key: 'canManageContent', label: 'Manage App Banners & Pages', desc: 'Publish homepage banners and edit legal policies' },
    { key: 'canManageListings', label: 'Manage 40+ Service Listings', desc: 'Edit base pricing, descriptions, and catalog items' },
    { key: 'canProcessRefunds', label: 'Process Razorpay Refunds', desc: 'Authorize or reject customer dispute payouts' },
    { key: 'canViewPayments', label: 'Inspect Financial Transactions', desc: 'View gross booking settlements and payment IDs' },
    { key: 'canAdjustCommission', label: 'Tune Category Take-Rates', desc: 'Adjust platform % commission and disburse pro payouts' },
    { key: 'canSendAnnouncements', label: 'Dispatch Broadcast Alerts', desc: 'Send multi-channel push notifications to users' },
    { key: 'canManageOffers', label: 'Create Discount Promo Codes', desc: 'Build and launch coupon campaigns' },
    { key: 'canExportReports', label: 'Export Executive Reports', desc: 'Download CSV and financial audits' },
    { key: 'canManageRoles', label: 'Configure RBAC & Team Access', desc: 'Modify role matrices and invite new admin team members' }
  ];

  return (
    <div className="view-container">
      {/* View Header */}
      <div className="view-header">
        <div>
          <div className="section-supertitle">SECTION 6 (FROM NOTES)</div>
          <h1 className="view-title">Roles and Permissions (RBAC)</h1>
          <p className="view-subtitle">
            Configure granular access matrices, manage administrative personnel, and review immutable security audit logs.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsInviteModalOpen(true)}>
          <PlusCircle size={16} /> Invite Admin Team Member
        </button>
      </div>

      {/* Admin Personnel List */}
      <div className="card mb-6">
        <div className="card-header">
          <div>
            <h3 className="card-title">Authorized PunchX Administrative Personnel</h3>
            <p className="card-subtitle">Authenticated team members with dashboard access</p>
          </div>
          <span className="badge badge-success">{admins.length} Active Operators</span>
        </div>

        <div className="admin-team-grid">
          {admins.map((adm) => (
            <div key={adm.id} className="admin-member-card">
              <img src={adm.avatarUrl} alt={adm.name} className="admin-member-avatar" />
              <div className="admin-member-details">
                <div className="flex items-center gap-2">
                  <h4 className="admin-member-name">{adm.name}</h4>
                  {adm.id === currentAdmin.id && (
                    <span className="current-user-pill">You</span>
                  )}
                </div>
                <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
                  <Mail size={11} /> {adm.email}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="badge badge-purple">
                    <Shield size={11} /> {adm.roleName}
                  </span>
                  <span className="text-xs text-muted">{adm.lastActive}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Granular Permission Matrix */}
      <div className="card mb-6">
        <div className="card-header">
          <div>
            <h3 className="card-title">Interactive Role-Based Access Control (RBAC) Matrix</h3>
            <p className="card-subtitle">
              Toggle specific privileges per administrative tier. Updates apply across all active sessions instantly.
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table permission-matrix-table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Permission Capability</th>
                {roles.map((r) => (
                  <th key={r.id} className="text-center font-bold">
                    <div className="role-col-header">
                      <span>{r.name}</span>
                      <span className="text-xs font-normal text-muted block">
                        ({r.assignedUsersCount} users)
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissionLabels.map((perm) => (
                <tr key={perm.key}>
                  <td>
                    <div className="font-semibold text-sm text-foreground">{perm.label}</div>
                    <div className="text-xs text-muted">{perm.desc}</div>
                  </td>
                  {roles.map((r) => {
                    const isAllowed = r.permissions[perm.key];
                    const isSuper = r.id === 'role_super';

                    return (
                      <td key={r.id} className="text-center">
                        <button
                          className={`perm-toggle-btn ${isAllowed ? 'allowed' : 'denied'} ${
                            isSuper ? 'super-locked' : ''
                          }`}
                          onClick={() => handleTogglePermission(r.id, perm.key)}
                          title={
                            isSuper
                              ? 'Super Admin permissions are locked'
                              : isAllowed
                              ? 'Click to revoke permission'
                              : 'Click to grant permission'
                          }
                          disabled={isSuper}
                        >
                          {isAllowed ? (
                            <CheckCircle2 size={18} className="text-emerald" />
                          ) : (
                            <XCircle size={18} className="text-zinc-500" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Trail */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Administrative Audit Trail & Security Logs</h3>
            <p className="card-subtitle">
              Immutable chronological record of administrative actions, user bans, KYC reviews, and financial adjustments.
            </p>
          </div>
          <span className="badge badge-neutral">Security Compliant</span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Administrator</th>
                <th>Action Taken</th>
                <th>Target Entity</th>
                <th>Operational Details</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="text-muted text-xs font-mono whitespace-nowrap">
                    <Clock size={12} className="inline mr-1" />
                    {log.timestamp}
                  </td>
                  <td>
                    <div className="cell-title font-medium text-sm">{log.adminName}</div>
                    <div className="cell-sub text-muted">{log.adminEmail}</div>
                  </td>
                  <td>
                    <span className="badge badge-purple font-mono text-xs">{log.action}</span>
                  </td>
                  <td>
                    <span className="badge badge-neutral text-xs">
                      {log.entityType}: {log.entityId}
                    </span>
                  </td>
                  <td className="text-sm max-w-md">{log.details}</td>
                  <td>
                    <code className="text-code text-xs">{log.ipAddress}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Invite Admin */}
      {isInviteModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsInviteModalOpen(false)}
          title="Invite Admin Team Member"
          subtitle="Provision administrative role with specific permissions."
        >
          <div className="invite-form-body">
            <div className="form-group mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="input-text"
                placeholder="e.g. Ananya Sen"
                value={inviteFormData.name}
                onChange={(e) =>
                  setInviteFormData({ ...inviteFormData, name: e.target.value })
                }
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Corporate Email</label>
              <input
                type="email"
                className="input-text"
                placeholder="ananya.sen@punchx.in"
                value={inviteFormData.email}
                onChange={(e) =>
                  setInviteFormData({ ...inviteFormData, email: e.target.value })
                }
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Assigned Administrative Role</label>
              <select
                className="select-input"
                value={inviteFormData.roleId}
                onChange={(e) =>
                  setInviteFormData({ ...inviteFormData, roleId: e.target.value })
                }
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} - {r.description.slice(0, 45)}...
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-footer-actions mt-6">
              <button
                className="btn btn-secondary"
                onClick={() => setIsInviteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleInviteAdmin}
                disabled={!inviteFormData.name.trim() || !inviteFormData.email.trim()}
              >
                <UserCheck size={15} /> Provision Access
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
