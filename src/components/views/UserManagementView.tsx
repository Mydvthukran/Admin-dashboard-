import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import type { User, KYCDocument } from '../../types';
import { Modal } from '../common/Modal';
import {
  Eye,
  ShieldAlert,
  UserCheck,
  UserCog,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  Award,
  FileText,
  ExternalLink,
  Lock,
  Unlock,
  Edit3
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const {
    users,
    kycDocs,
    activeSubtab,
    setActiveSubtab,
    searchQuery,
    blockUser,
    unblockUser,
    verifyKYC,
    updateUser
  } = useAdmin();

  // Filters & State
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'professional'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked' | 'pending_verification'>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  // Selected User for Profile Modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Selected User for Block Modal
  const [blockingUser, setBlockingUser] = useState<User | null>(null);
  const [blockReasonInput, setBlockReasonInput] = useState<string>('');

  // Selected KYC Doc for Verification Modal
  const [inspectingKyc, setInspectingKyc] = useState<KYCDocument | null>(null);
  const [kycRejectionReason, setKycRejectionReason] = useState<string>('');

  // User Edit Modal
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      u.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchesCity = cityFilter === 'all' || u.city === cityFilter;

    return matchesSearch && matchesRole && matchesStatus && matchesCity;
  });

  const blockedUsers = users.filter((u) => u.status === 'blocked');

  const handleStartBlock = (user: User) => {
    setBlockingUser(user);
    setBlockReasonInput(
      user.role === 'professional'
        ? 'Repeated complaints regarding off-platform cash extortion or substandard service.'
        : 'Severe breach of customer safety code or abusive behavior towards service provider.'
    );
  };

  const handleConfirmBlock = () => {
    if (!blockingUser || !blockReasonInput.trim()) return;
    blockUser(blockingUser.id, blockReasonInput.trim());
    setBlockingUser(null);
    setBlockReasonInput('');
  };

  const handleStartEdit = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      city: user.city,
      tier: user.tier || 'Bronze',
      walletBalance: user.walletBalance
    });
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    updateUser(editingUser.id, editFormData);
    setEditingUser(null);
  };

  return (
    <div className="view-container">
      {/* View Header with Subtab Navigation */}
      <div className="view-header">
        <div>
          <div className="section-supertitle">SECTION 1</div>
          <h1 className="view-title">User Management</h1>
          <p className="view-subtitle">
            Inspect accounts, manage pro onboarding, enforce security bans, and verify credentials.
          </p>
        </div>

        {/* Subtabs matching handwritten notes: i. View, ii. Block, iii. Verify, iv. Manage */}
        <div className="subtab-pills">
          <button
            className={`subtab-pill ${activeSubtab === 'view' ? 'active' : ''}`}
            onClick={() => setActiveSubtab('view')}
          >
            <Eye size={15} />
            <span>i. View</span>
            <span className="pill-badge">{users.length}</span>
          </button>
          <button
            className={`subtab-pill ${activeSubtab === 'block' ? 'active' : ''}`}
            onClick={() => setActiveSubtab('block')}
          >
            <ShieldAlert size={15} />
            <span>ii. Block</span>
            {blockedUsers.length > 0 && (
              <span className="pill-badge badge-red">{blockedUsers.length}</span>
            )}
          </button>
          <button
            className={`subtab-pill ${activeSubtab === 'verify' ? 'active' : ''}`}
            onClick={() => setActiveSubtab('verify')}
          >
            <UserCheck size={15} />
            <span>iii. Verify</span>
            {kycDocs.filter((k) => k.status === 'pending').length > 0 && (
              <span className="pill-badge badge-amber">
                {kycDocs.filter((k) => k.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            className={`subtab-pill ${activeSubtab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveSubtab('manage')}
          >
            <UserCog size={15} />
            <span>iv. Manage</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: VIEW */}
      {activeSubtab === 'view' && (
        <div className="subtab-content">
          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="filter-group">
              <label>Role:</label>
              <select
                className="select-input"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
              >
                <option value="all">All Roles ({users.length})</option>
                <option value="customer">
                  Customers ({users.filter((u) => u.role === 'customer').length})
                </option>
                <option value="professional">
                  Professionals ({users.filter((u) => u.role === 'professional').length})
                </option>
              </select>
            </div>

            <div className="filter-group">
              <label>Status:</label>
              <select
                className="select-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Accounts</option>
                <option value="pending_verification">Pending KYC Verification</option>
                <option value="blocked">Suspended / Blocked</option>
              </select>
            </div>

            <div className="filter-group">
              <label>City / Zone:</label>
              <select
                className="select-input"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <option value="all">All Operational Zones</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Nabadwip">Nabadwip</option>
                <option value="Howrah">Howrah</option>
              </select>
            </div>

            <div className="filter-count text-muted">
              Showing {filteredUsers.length} of {users.length} registered profiles
            </div>
          </div>

          {/* User Table */}
          <div className="card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role & Tier</th>
                    <th>Location / Zone</th>
                    <th>Account Status</th>
                    <th>Bookings</th>
                    <th>Wallet Balance</th>
                    <th>Joined</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className={user.status === 'blocked' ? 'row-suspended' : ''}>
                      <td>
                        <div className="user-cell">
                          <div className="avatar-placeholder">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="cell-title font-medium">{user.name}</div>
                            <div className="cell-sub">{user.phone}</div>
                            <div className="cell-sub text-muted">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="role-tag-container">
                          <span
                            className={`badge ${
                              user.role === 'professional' ? 'badge-purple' : 'badge-neutral'
                            }`}
                          >
                            {user.role === 'professional' ? 'Service Pro' : 'Customer'}
                          </span>
                          {user.tier && (
                            <span className={`tier-badge tier-${user.tier.toLowerCase()}`}>
                              <Award size={11} /> {user.tier}
                            </span>
                          )}
                        </div>
                        {user.serviceCategory && (
                          <div className="cell-sub mt-1 text-punch-orange font-medium">
                            {user.serviceCategory}
                          </div>
                        )}
                        {user.rating && (
                          <div className="rating-pill">
                            <Star size={11} className="fill-amber text-amber" />
                            <span>{user.rating.toFixed(2)}</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="cell-title">{user.city}</div>
                        <div className="cell-sub text-muted">{user.location}</div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            user.status === 'active'
                              ? 'badge-success'
                              : user.status === 'pending_verification'
                              ? 'badge-warning'
                              : 'badge-danger'
                          }`}
                        >
                          {user.status === 'pending_verification'
                            ? 'Pending KYC'
                            : user.status === 'blocked'
                            ? 'Suspended'
                            : 'Active'}
                        </span>
                      </td>
                      <td className="font-semibold">{user.totalBookings}</td>
                      <td>
                        <div className="font-semibold">₹{user.walletBalance}</div>
                      </td>
                      <td className="text-muted text-sm">{user.joinedDate}</td>
                      <td className="text-right">
                        <div className="row-actions">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setSelectedUser(user)}
                            title="Inspect Profile"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleStartEdit(user)}
                            title="Edit User"
                          >
                            <Edit3 size={15} />
                          </button>
                          {user.status === 'blocked' ? (
                            <button
                              className="btn btn-sm btn-emerald-dim"
                              onClick={() => unblockUser(user.id)}
                              title="Unblock User"
                            >
                              <Unlock size={14} /> Unblock
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-red-dim"
                              onClick={() => handleStartBlock(user)}
                              title="Block User"
                            >
                              <Lock size={14} /> Block
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: BLOCK (SUSPENSION CENTER) */}
      {activeSubtab === 'block' && (
        <div className="subtab-content">
          <div className="card mb-6">
            <div className="card-header">
              <div>
                <h3 className="card-title text-red">Suspension & Trust Safety Center</h3>
                <p className="card-subtitle">
                  Audit, enforce, or lift platform bans. Suspended accounts are immediately disconnected from accepting or creating service bookings.
                </p>
              </div>
              <span className="badge badge-danger">{blockedUsers.length} Blocked Accounts</span>
            </div>

            {blockedUsers.length === 0 ? (
              <div className="empty-state">
                <CheckCircle2 size={40} className="text-emerald" />
                <h4>No Blocked Accounts</h4>
                <p>All customers and service professionals are currently in good standing.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Blocked User</th>
                      <th>Account Role</th>
                      <th>Reason for Suspension</th>
                      <th>Suspended At</th>
                      <th>Authorized By</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blockedUsers.map((b) => (
                      <tr key={b.id} className="row-suspended">
                        <td>
                          <div className="cell-title font-medium">{b.name}</div>
                          <div className="cell-sub">{b.phone} · {b.city}</div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              b.role === 'professional' ? 'badge-purple' : 'badge-neutral'
                            }`}
                          >
                            {b.role === 'professional' ? 'Service Pro' : 'Customer'}
                          </span>
                        </td>
                        <td>
                          <div className="block-reason-box">
                            <AlertTriangle size={14} className="text-red flex-shrink-0" />
                            <span>{b.blockReason || 'Policy non-compliance'}</span>
                          </div>
                        </td>
                        <td className="text-muted text-sm">{b.blockedAt || 'Recent'}</td>
                        <td className="text-sm font-medium">{b.blockedBy || 'Security Admin'}</td>
                        <td className="text-right">
                          <button
                            className="btn btn-sm btn-emerald"
                            onClick={() => unblockUser(b.id)}
                          >
                            <Unlock size={14} /> Lift Ban
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Suspension Trigger Card */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Initiate User Ban</h3>
                <p className="card-subtitle">Select an active user to suspend access</p>
              </div>
            </div>
            <div className="quick-block-selector">
              <p className="text-sm text-muted mb-3">
                Select an active customer or professional from below to review compliance flags and apply account freeze:
              </p>
              <div className="user-chips-grid">
                {users
                  .filter((u) => u.status !== 'blocked')
                  .slice(0, 6)
                  .map((u) => (
                    <div key={u.id} className="user-chip">
                      <div>
                        <div className="font-semibold text-sm">{u.name}</div>
                        <div className="text-xs text-muted">
                          {u.role} · {u.city}
                        </div>
                      </div>
                      <button
                        className="btn btn-sm btn-red-dim"
                        onClick={() => handleStartBlock(u)}
                      >
                        <Lock size={12} /> Ban
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: VERIFY (PRO KYC STATION) */}
      {activeSubtab === 'verify' && (
        <div className="subtab-content">
          <div className="card mb-6">
            <div className="card-header">
              <div>
                <h3 className="card-title">Professional Verification (KYC) Station</h3>
                <p className="card-subtitle">
                  Verify government identity proofs, trade licenses, and background certificates before assigning local service requests.
                </p>
              </div>
              <div className="badge badge-warning">
                {kycDocs.filter((k) => k.status === 'pending').length} Submissions Pending
              </div>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Professional</th>
                    <th>Category & Exp</th>
                    <th>Document Type</th>
                    <th>ID / Certificate No</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th className="text-right">Review</th>
                  </tr>
                </thead>
                <tbody>
                  {kycDocs.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div className="user-cell">
                          <img src={doc.selfieUrl} alt={doc.userName} className="kyc-avatar" />
                          <div>
                            <div className="cell-title font-medium">{doc.userName}</div>
                            <div className="cell-sub">{doc.userPhone}</div>
                            <div className="cell-sub text-muted">{doc.location}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="font-semibold text-sm">{doc.serviceCategory}</div>
                        <div className="cell-sub">{doc.experienceYears} Years On-Field Experience</div>
                      </td>
                      <td>
                        <span className="badge badge-neutral">
                          <FileText size={12} /> {doc.docType}
                        </span>
                      </td>
                      <td>
                        <code className="text-code">{doc.docNumber}</code>
                      </td>
                      <td className="text-muted text-sm">{doc.submittedAt}</td>
                      <td>
                        <span
                          className={`badge ${
                            doc.status === 'verified'
                              ? 'badge-success'
                              : doc.status === 'pending'
                              ? 'badge-warning'
                              : 'badge-danger'
                          }`}
                        >
                          {doc.status}
                        </span>
                        {doc.reviewedBy && (
                          <div className="cell-sub text-xs mt-1">By {doc.reviewedBy}</div>
                        )}
                      </td>
                      <td className="text-right">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setInspectingKyc(doc);
                            setKycRejectionReason('');
                          }}
                        >
                          <Eye size={14} /> Inspect Proof
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: MANAGE (ACCOUNT CONTROLS & TIERS) */}
      {activeSubtab === 'manage' && (
        <div className="subtab-content">
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Professional Tiers, Wallets & Account Controls</h3>
                <p className="card-subtitle">
                  Configure professional commission privileges, adjust wallet credits, and override credentials.
                </p>
              </div>
            </div>

            <div className="manage-grid">
              {users
                .filter((u) => u.role === 'professional')
                .map((pro) => (
                  <div key={pro.id} className="manage-card">
                    <div className="manage-card-top">
                      <div>
                        <div className="font-bold text-base">{pro.name}</div>
                        <div className="text-sm text-punch-orange font-medium">
                          {pro.serviceCategory}
                        </div>
                        <div className="text-xs text-muted">{pro.location}</div>
                      </div>
                      <span className={`tier-badge tier-${(pro.tier || 'bronze').toLowerCase()}`}>
                        {pro.tier || 'Bronze'} Pro
                      </span>
                    </div>

                    <div className="manage-stats-row">
                      <div>
                        <span className="text-xs text-muted">Wallet Balance</span>
                        <div className="font-bold text-lg text-emerald">₹{pro.walletBalance}</div>
                      </div>
                      <div>
                        <span className="text-xs text-muted">Rating</span>
                        <div className="font-bold text-lg text-amber">
                          ⭐ {pro.rating ? pro.rating.toFixed(2) : '5.0'}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-muted">Jobs Done</span>
                        <div className="font-bold text-lg">{pro.totalBookings}</div>
                      </div>
                    </div>

                    <div className="manage-card-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleStartEdit(pro)}
                      >
                        Adjust Balance / Tier
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setSelectedUser(pro)}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: User Profile Details */}
      {selectedUser && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedUser(null)}
          title={selectedUser.name}
          subtitle={`Account ID: ${selectedUser.id} · ${selectedUser.role.toUpperCase()}`}
        >
          <div className="profile-modal-body">
            <div className="profile-header-card">
              <div className="avatar-placeholder large">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <div className="profile-name">{selectedUser.name}</div>
                <div className="profile-contact">
                  <span>
                    <Phone size={13} /> {selectedUser.phone}
                  </span>
                  <span>
                    <Mail size={13} /> {selectedUser.email}
                  </span>
                </div>
                <div className="profile-contact mt-1">
                  <span>
                    <MapPin size={13} /> {selectedUser.location} ({selectedUser.city})
                  </span>
                  <span>
                    <Calendar size={13} /> Joined {selectedUser.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-stats-grid">
              <div className="modal-stat">
                <span className="text-xs text-muted">Account Status</span>
                <span
                  className={`badge mt-1 ${
                    selectedUser.status === 'active'
                      ? 'badge-success'
                      : selectedUser.status === 'blocked'
                      ? 'badge-danger'
                      : 'badge-warning'
                  }`}
                >
                  {selectedUser.status}
                </span>
              </div>
              <div className="modal-stat">
                <span className="text-xs text-muted">Total Bookings</span>
                <span className="font-bold text-lg">{selectedUser.totalBookings} Completed</span>
              </div>
              <div className="modal-stat">
                <span className="text-xs text-muted">Wallet Balance</span>
                <span className="font-bold text-lg text-emerald">₹{selectedUser.walletBalance}</span>
              </div>
              {selectedUser.tier && (
                <div className="modal-stat">
                  <span className="text-xs text-muted">Pro Tier Level</span>
                  <span className="font-bold text-lg text-punch-orange">{selectedUser.tier}</span>
                </div>
              )}
            </div>

            {selectedUser.blockReason && (
              <div className="banner-alert danger mt-4">
                <AlertTriangle size={18} className="text-red flex-shrink-0" />
                <div>
                  <div className="font-bold text-sm">Suspended Account</div>
                  <div className="text-xs mt-1">{selectedUser.blockReason}</div>
                  <div className="text-xs text-muted mt-1">
                    Banned at {selectedUser.blockedAt} by {selectedUser.blockedBy}
                  </div>
                </div>
              </div>
            )}

            <div className="modal-footer-actions mt-6">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedUser(null);
                  handleStartEdit(selectedUser);
                }}
              >
                <Edit3 size={15} /> Edit Account
              </button>
              {selectedUser.status === 'blocked' ? (
                <button
                  className="btn btn-emerald"
                  onClick={() => {
                    unblockUser(selectedUser.id);
                    setSelectedUser(null);
                  }}
                >
                  <Unlock size={15} /> Restore Access
                </button>
              ) : (
                <button
                  className="btn btn-red"
                  onClick={() => {
                    setSelectedUser(null);
                    handleStartBlock(selectedUser);
                  }}
                >
                  <Lock size={15} /> Block Account
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Block Confirmation */}
      {blockingUser && (
        <Modal
          isOpen={true}
          onClose={() => setBlockingUser(null)}
          title={`Suspend Account: ${blockingUser.name}`}
          subtitle="Enforce platform safety block. User will not be able to log in or take jobs."
        >
          <div className="block-modal-form">
            <div className="banner-alert warning mb-4">
              <AlertTriangle size={18} className="text-amber flex-shrink-0" />
              <span className="text-sm">
                This action is audited and logged in the PunchX Security Registry with your administrator ID.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label font-semibold">Mandatory Suspension Reason:</label>
              <textarea
                className="textarea-input"
                rows={3}
                value={blockReasonInput}
                onChange={(e) => setBlockReasonInput(e.target.value)}
                placeholder="Detail the reason for suspension (complaint reference, violation type)..."
              ></textarea>
            </div>

            <div className="modal-footer-actions mt-6">
              <button className="btn btn-secondary" onClick={() => setBlockingUser(null)}>
                Cancel
              </button>
              <button
                className="btn btn-red"
                onClick={handleConfirmBlock}
                disabled={!blockReasonInput.trim()}
              >
                <Lock size={15} /> Confirm Suspension
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Inspect Pro KYC Proof */}
      {inspectingKyc && (
        <Modal
          isOpen={true}
          onClose={() => setInspectingKyc(null)}
          title={`KYC Verification: ${inspectingKyc.userName}`}
          subtitle={`Submitted on ${inspectingKyc.submittedAt} · Category: ${inspectingKyc.serviceCategory}`}
          maxWidth="760px"
        >
          <div className="kyc-inspect-modal">
            {/* Split Proofs Viewer */}
            <div className="proofs-grid">
              <div className="proof-box">
                <span className="proof-label">Verified Selfie</span>
                <img
                  src={inspectingKyc.selfieUrl}
                  alt="Pro selfie"
                  className="proof-image rounded"
                />
              </div>

              <div className="proof-box">
                <div className="proof-header">
                  <span className="proof-label">Document Proof: {inspectingKyc.docType}</span>
                  <a
                    href={inspectingKyc.docFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-punch-orange flex items-center gap-1"
                  >
                    Open Full <ExternalLink size={11} />
                  </a>
                </div>
                <img
                  src={inspectingKyc.docFileUrl}
                  alt="KYC document"
                  className="proof-image rounded"
                />
              </div>
            </div>

            <div className="kyc-data-summary mt-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted">Document Number:</span>
                  <div className="font-semibold">{inspectingKyc.docNumber}</div>
                </div>
                <div>
                  <span className="text-muted">Contact Phone:</span>
                  <div className="font-semibold">{inspectingKyc.userPhone}</div>
                </div>
                <div>
                  <span className="text-muted">Operating Address:</span>
                  <div className="font-semibold">{inspectingKyc.location}</div>
                </div>
                <div>
                  <span className="text-muted">On-Field Experience:</span>
                  <div className="font-semibold">{inspectingKyc.experienceYears} Years</div>
                </div>
              </div>
            </div>

            {inspectingKyc.status === 'rejected' && inspectingKyc.rejectionReason && (
              <div className="banner-alert danger mt-4">
                <AlertTriangle size={18} className="text-red flex-shrink-0" />
                <div className="text-sm">
                  <strong>Rejection Reason:</strong> {inspectingKyc.rejectionReason}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="kyc-decision-actions mt-6">
              <div className="flex-1">
                <input
                  type="text"
                  className="input-text text-sm w-full"
                  placeholder="Reason if rejecting (e.g. blurred photo, name mismatch)..."
                  value={kycRejectionReason}
                  onChange={(e) => setKycRejectionReason(e.target.value)}
                />
              </div>
              <button
                className="btn btn-red"
                onClick={() => {
                  verifyKYC(
                    inspectingKyc.id,
                    false,
                    kycRejectionReason || 'Document verification failed.'
                  );
                  setInspectingKyc(null);
                }}
              >
                <XCircle size={15} /> Reject
              </button>
              <button
                className="btn btn-emerald"
                onClick={() => {
                  verifyKYC(inspectingKyc.id, true);
                  setInspectingKyc(null);
                }}
              >
                <CheckCircle2 size={15} /> Approve & Activate Pro
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Edit User Details */}
      {editingUser && (
        <Modal
          isOpen={true}
          onClose={() => setEditingUser(null)}
          title={`Edit Profile: ${editingUser.name}`}
          subtitle={`Account ID: ${editingUser.id}`}
        >
          <div className="edit-form-body">
            <div className="form-group mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="input-text"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="input-text"
                  value={editFormData.phone || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="input-text"
                  value={editFormData.email || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="form-group">
                <label className="form-label">City Zone</label>
                <select
                  className="select-input"
                  value={editFormData.city || 'Kolkata'}
                  onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value as any })}
                >
                  <option value="Kolkata">Kolkata</option>
                  <option value="Nabadwip">Nabadwip</option>
                  <option value="Howrah">Howrah</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {editingUser.role === 'professional' && (
                <div className="form-group">
                  <label className="form-label">Tier Level</label>
                  <select
                    className="select-input"
                    value={editFormData.tier || 'Bronze'}
                    onChange={(e) => setEditFormData({ ...editFormData, tier: e.target.value as any })}
                  >
                    <option value="Bronze">Bronze (Standard 15%)</option>
                    <option value="Silver">Silver (12% take-rate)</option>
                    <option value="Gold">Gold (10% take-rate)</option>
                    <option value="Platinum">Platinum (8% VIP take-rate)</option>
                  </select>
                </div>
              )}
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Wallet Balance (₹)</label>
              <input
                type="number"
                className="input-text"
                value={editFormData.walletBalance ?? 0}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, walletBalance: parseFloat(e.target.value) || 0 })
                }
              />
            </div>

            <div className="modal-footer-actions mt-6">
              <button className="btn btn-secondary" onClick={() => setEditingUser(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
