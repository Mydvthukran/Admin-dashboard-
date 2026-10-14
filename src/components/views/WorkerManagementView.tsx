import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import type { Worker, WorkerStatus, WorkerTrade, SkillLevel, WorkerShift, FieldJob } from '../../types';
import { Modal } from '../common/Modal';
import {
  HardHat,
  Radio,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  Award,
  PlusCircle,
  Send,
  Check,
  Edit3,
  Trash2,
  Zap,
  Eye,
  Truck,
  RotateCcw,
  DollarSign
} from 'lucide-react';

export const WorkerManagementView: React.FC = () => {
  const {
    workers,
    activeSubtab,
    setActiveSubtab,
    searchQuery,
    addWorker,
    updateWorker,
    deleteWorker,
    setWorkerStatus,
    dispatchJobToWorker,
    completeWorkerJob,
    cancelWorkerJob,
    settleWorkerPayout,
    verifyWorkerCompliance,
    addToast
  } = useAdmin();

  // Filters & Search
  const [tradeFilter, setTradeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [shiftFilter, setShiftFilter] = useState<string>('all');

  // Modals state
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Worker>>({});
  const [showOnboardModal, setShowOnboardModal] = useState<boolean>(false);
  const [dispatchModalWorker, setDispatchModalWorker] = useState<Worker | null>(null);
  const [payoutModalWorker, setPayoutModalWorker] = useState<Worker | null>(null);
  const [statusModalWorker, setStatusModalWorker] = useState<Worker | null>(null);
  const [targetStatus, setTargetStatus] = useState<WorkerStatus>('on_duty');
  const [statusReason, setStatusReason] = useState<string>('');
  const [payoutAmountInput, setPayoutAmountInput] = useState<string>('');
  const [payoutReference, setPayoutReference] = useState<string>('');

  // Dispatch Job Form State
  const [dispatchForm, setDispatchForm] = useState({
    bookingId: '',
    customerName: '',
    customerPhone: '',
    address: '',
    zone: 'Salt Lake & New Town',
    serviceTitle: 'Split AC Deep Foam Jet Service',
    scheduledTime: 'Immediate (Within 45 mins)',
    payoutAmount: 750,
    customerOtpRequired: true
  });

  // Onboard New Worker Form State
  const [onboardForm, setOnboardForm] = useState<{
    name: string;
    phone: string;
    email: string;
    trade: WorkerTrade;
    secondaryTrades: WorkerTrade[];
    skillLevel: SkillLevel;
    city: 'Kolkata' | 'Nabadwip' | 'Howrah';
    zone: string;
    shift: WorkerShift;
    vehicleType: 'Two-Wheeler (Motorcycle)' | 'Bicycle' | 'Public Transit' | 'Van/Tempo';
    emergencyName: string;
    emergencyPhone: string;
    emergencyRelation: string;
    safetyGearVerified: boolean;
    policeVerificationDone: boolean;
    aadhaarVerified: boolean;
    notes: string;
  }>({
    name: '',
    phone: '',
    email: '',
    trade: 'AC & Refrigeration',
    secondaryTrades: [],
    skillLevel: 'Certified Pro',
    city: 'Kolkata',
    zone: 'Salt Lake, Sector V',
    shift: 'Full Day (08:00 - 20:00)',
    vehicleType: 'Two-Wheeler (Motorcycle)',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: 'Family Member',
    safetyGearVerified: true,
    policeVerificationDone: true,
    aadhaarVerified: true,
    notes: ''
  });

  // Filtered Workers
  const filteredWorkers = workers.filter((w) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      w.name.toLowerCase().includes(query) ||
      w.phone.includes(query) ||
      w.email.toLowerCase().includes(query) ||
      w.zone.toLowerCase().includes(query) ||
      w.trade.toLowerCase().includes(query);

    const matchesTrade = tradeFilter === 'all' || w.trade === tradeFilter;
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    const matchesCity = cityFilter === 'all' || w.city === cityFilter;
    const matchesShift = shiftFilter === 'all' || w.shift === shiftFilter;

    return matchesSearch && matchesTrade && matchesStatus && matchesCity && matchesShift;
  });

  // Summary Counts
  const onDutyCount = workers.filter((w) => w.status === 'on_duty').length;
  const onJobCount = workers.filter((w) => w.status === 'on_job').length;
  const offDutyCount = workers.filter((w) => w.status === 'off_duty').length;
  const suspendedCount = workers.filter((w) => w.status === 'suspended').length;
  const totalPendingPayouts = workers.reduce((acc, curr) => acc + curr.pendingPayout, 0);

  // Handlers
  const handleOpenEdit = (w: Worker) => {
    setEditingWorker(w);
    setEditFormData({
      name: w.name,
      phone: w.phone,
      email: w.email,
      trade: w.trade,
      skillLevel: w.skillLevel,
      city: w.city,
      zone: w.zone,
      shift: w.shift,
      vehicleType: w.vehicleType,
      notes: w.notes
    });
  };

  const handleSaveEdit = () => {
    if (!editingWorker) return;
    updateWorker(editingWorker.id, editFormData);
    setEditingWorker(null);
  };

  const handleOpenStatusModal = (w: Worker) => {
    setStatusModalWorker(w);
    setTargetStatus(w.status);
    setStatusReason('');
  };

  const handleConfirmStatusChange = () => {
    if (!statusModalWorker) return;
    setWorkerStatus(statusModalWorker.id, targetStatus, statusReason);
    setStatusModalWorker(null);
  };

  const handleOpenDispatch = (w?: Worker) => {
    if (w) {
      setDispatchModalWorker(w);
      setDispatchForm((prev) => ({
        ...prev,
        bookingId: 'BK_' + Math.floor(1000 + Math.random() * 9000),
        zone: w.zone
      }));
    } else {
      const available = workers.find((item) => item.status === 'on_duty');
      setDispatchModalWorker(available || workers[0]);
      setDispatchForm((prev) => ({
        ...prev,
        bookingId: 'BK_' + Math.floor(1000 + Math.random() * 9000)
      }));
    }
  };

  const handleConfirmDispatch = () => {
    if (!dispatchModalWorker || !dispatchForm.customerName || !dispatchForm.address) {
      addToast('Missing Details', 'Please enter customer name, contact, and address.', 'warning');
      return;
    }
    const newJob: Omit<FieldJob, 'id'> = {
      bookingId: dispatchForm.bookingId || 'BK_' + Math.floor(1000 + Math.random() * 9000),
      customerName: dispatchForm.customerName,
      customerPhone: dispatchForm.customerPhone || '+91 98301 00000',
      address: dispatchForm.address,
      zone: dispatchForm.zone,
      serviceTitle: dispatchForm.serviceTitle,
      status: 'in_progress',
      scheduledTime: dispatchForm.scheduledTime,
      payoutAmount: Number(dispatchForm.payoutAmount) || 600,
      customerOtpRequired: dispatchForm.customerOtpRequired
    };
    dispatchJobToWorker(dispatchModalWorker.id, newJob);
    setDispatchModalWorker(null);
  };

  const handleOpenPayout = (w: Worker) => {
    setPayoutModalWorker(w);
    setPayoutAmountInput(String(w.pendingPayout));
    setPayoutReference('IMPS_' + Math.floor(100000 + Math.random() * 900000));
  };

  const handleConfirmPayout = () => {
    if (!payoutModalWorker) return;
    const amt = parseFloat(payoutAmountInput);
    if (isNaN(amt) || amt <= 0) {
      addToast('Invalid Amount', 'Please specify a valid payout figure.', 'warning');
      return;
    }
    settleWorkerPayout(payoutModalWorker.id, amt);
    setPayoutModalWorker(null);
  };

  const handleConfirmOnboard = () => {
    if (!onboardForm.name.trim() || !onboardForm.phone.trim()) {
      addToast('Validation Failed', 'Worker Name and Phone are required.', 'error');
      return;
    }

    addWorker({
      name: onboardForm.name.trim(),
      phone: onboardForm.phone.trim(),
      email: onboardForm.email.trim() || `${onboardForm.name.toLowerCase().replace(/\s+/g, '.')}.pro@punchxpro.in`,
      trade: onboardForm.trade,
      secondaryTrades: onboardForm.secondaryTrades,
      skillLevel: onboardForm.skillLevel,
      city: onboardForm.city,
      zone: onboardForm.zone,
      status: 'on_duty',
      shift: onboardForm.shift,
      rating: 5.0,
      safetyGearVerified: onboardForm.safetyGearVerified,
      policeVerificationDone: onboardForm.policeVerificationDone,
      aadhaarVerified: onboardForm.aadhaarVerified,
      emergencyContact: {
        name: onboardForm.emergencyName || 'Family Contact',
        phone: onboardForm.emergencyPhone || '+91 98300 00000',
        relation: onboardForm.emergencyRelation || 'Family'
      },
      vehicleType: onboardForm.vehicleType,
      joinedDate: new Date().toISOString().substring(0, 10),
      lastLocationUpdate: 'Newly Registered (Ready for check-in)',
      notes: onboardForm.notes
    });

    setShowOnboardModal(false);
    // Reset form
    setOnboardForm({
      name: '',
      phone: '',
      email: '',
      trade: 'AC & Refrigeration',
      secondaryTrades: [],
      skillLevel: 'Certified Pro',
      city: 'Kolkata',
      zone: 'Salt Lake, Sector V',
      shift: 'Full Day (08:00 - 20:00)',
      vehicleType: 'Two-Wheeler (Motorcycle)',
      emergencyName: '',
      emergencyPhone: '',
      emergencyRelation: 'Family Member',
      safetyGearVerified: true,
      policeVerificationDone: true,
      aadhaarVerified: true,
      notes: ''
    });
  };

  const getStatusBadge = (status: WorkerStatus) => {
    switch (status) {
      case 'on_duty':
        return (
          <span className="badge badge-success flex items-center gap-1">
            <span className="pulse-dot active" style={{ width: '6px', height: '6px' }}></span>
            On Duty & Ready
          </span>
        );
      case 'on_job':
        return (
          <span className="badge badge-purple flex items-center gap-1">
            <Radio size={12} className="animate-spin" />
            On Job (In Field)
          </span>
        );
      case 'off_duty':
        return <span className="badge badge-neutral">Off Duty (Offline)</span>;
      case 'on_leave':
        return <span className="badge badge-warning">On Leave</span>;
      case 'suspended':
        return <span className="badge badge-danger">Suspended</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div className="view-container">
      {/* View Header with Subtabs */}
      <div className="view-header">
        <div>
          <div className="section-supertitle">WORKFORCE OPERATIONS</div>
          <h1 className="view-title">Worker Management & Field Dispatch</h1>
          <p className="view-subtitle">
            Coordinate field technicians, monitor real-time job dispatch, inspect trade qualifications, and disburse daily task payouts.
          </p>
        </div>

        <div className="view-header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => handleOpenDispatch()}
            title="Instant job allocation to nearby on-duty technician"
          >
            <Send size={15} />
            <span>Dispatch Job</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowOnboardModal(true)}
            title="Register a new certified technician into the workforce roster"
          >
            <PlusCircle size={15} />
            <span>Onboard New Worker</span>
          </button>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="subtab-pills mb-4">
        <button
          className={`subtab-pill ${activeSubtab === 'directory' ? 'active' : ''}`}
          onClick={() => setActiveSubtab('directory')}
        >
          <HardHat size={15} />
          <span>i. Directory & Roster</span>
          <span className="pill-badge">{workers.length}</span>
        </button>
        <button
          className={`subtab-pill ${activeSubtab === 'dispatch' ? 'active' : ''}`}
          onClick={() => setActiveSubtab('dispatch')}
        >
          <Radio size={15} />
          <span>ii. Live Dispatch & Attendance</span>
          {onJobCount > 0 && <span className="pill-badge badge-purple">{onJobCount} Active Jobs</span>}
        </button>
        <button
          className={`subtab-pill ${activeSubtab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveSubtab('skills')}
        >
          <ShieldCheck size={15} />
          <span>iii. Skills & Safety Gear</span>
        </button>
        <button
          className={`subtab-pill ${activeSubtab === 'payouts' ? 'active' : ''}`}
          onClick={() => setActiveSubtab('payouts')}
        >
          <DollarSign size={15} />
          <span>iv. Performance & Payouts</span>
          {totalPendingPayouts > 0 && (
            <span className="pill-badge badge-amber">₹{totalPendingPayouts.toLocaleString('en-IN')}</span>
          )}
        </button>
      </div>

      {/* Quick Metrics Bar */}
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Total Field Workforce</span>
            <div className="stat-icon-wrapper bg-orange-dim">
              <HardHat size={18} className="text-punch-orange" />
            </div>
          </div>
          <div className="stat-value">{workers.length} Workers</div>
          <div className="stat-footer text-muted">
            <span>{onDutyCount} Ready · {onJobCount} On Job · {offDutyCount} Offline</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Live Active Field Jobs</span>
            <div className="stat-icon-wrapper bg-indigo-dim">
              <Radio size={18} className="text-indigo" />
            </div>
          </div>
          <div className="stat-value">{onJobCount} In Progress</div>
          <div className="stat-footer text-emerald">
            <Zap size={14} />
            <span>Avg dispatch response: 3.4 mins</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Avg Technician Rating</span>
            <div className="stat-icon-wrapper bg-amber-dim">
              <Star size={18} className="text-amber fill-amber" />
            </div>
          </div>
          <div className="stat-value">
            {(workers.reduce((acc, curr) => acc + curr.rating, 0) / (workers.length || 1)).toFixed(2)} / 5.0
          </div>
          <div className="stat-footer text-muted">
            <span>Based on 1,480+ customer reviews</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Pending Payout Settlements</span>
            <div className="stat-icon-wrapper bg-emerald-dim">
              <DollarSign size={18} className="text-emerald" />
            </div>
          </div>
          <div className="stat-value">₹{totalPendingPayouts.toLocaleString('en-IN')}</div>
          <div className="stat-footer text-muted">
            <span>Next settlement run: Today 18:00</span>
          </div>
        </div>
      </div>

      {/* SUBTAB 1: DIRECTORY & ROSTER */}
      {activeSubtab === 'directory' && (
        <div className="subtab-content">
          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="filter-group">
              <label>Trade:</label>
              <select
                className="select-input"
                value={tradeFilter}
                onChange={(e) => setTradeFilter(e.target.value)}
              >
                <option value="all">All Trades ({workers.length})</option>
                <option value="AC & Refrigeration">AC & Refrigeration</option>
                <option value="Electrical & Wiring">Electrical & Wiring</option>
                <option value="Plumbing & Sanitation">Plumbing & Sanitation</option>
                <option value="Deep Cleaning & Sanitization">Deep Cleaning & Sanitization</option>
                <option value="Carpentry & Woodwork">Carpentry & Woodwork</option>
                <option value="Painting & Waterproofing">Painting & Waterproofing</option>
                <option value="Appliance Repair">Appliance Repair</option>
                <option value="Beauty & Grooming">Beauty & Grooming</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Duty Status:</label>
              <select
                className="select-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="on_duty">On Duty & Ready ({onDutyCount})</option>
                <option value="on_job">On Job ({onJobCount})</option>
                <option value="off_duty">Off Duty / Offline ({offDutyCount})</option>
                <option value="on_leave">On Leave</option>
                <option value="suspended">Suspended ({suspendedCount})</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Zone / Sector:</label>
              <select
                className="select-input"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <option value="all">All Operational Zones</option>
                <option value="Kolkata">Kolkata Cluster</option>
                <option value="Nabadwip">Nabadwip Cluster</option>
                <option value="Howrah">Howrah Sector</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Shift:</label>
              <select
                className="select-input"
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
              >
                <option value="all">All Shifts</option>
                <option value="Morning (08:00 - 14:00)">Morning (08:00 - 14:00)</option>
                <option value="Evening (14:00 - 20:00)">Evening (14:00 - 20:00)</option>
                <option value="Full Day (08:00 - 20:00)">Full Day (08:00 - 20:00)</option>
                <option value="Emergency On-Call">Emergency On-Call</option>
              </select>
            </div>

            <div className="filter-count text-muted">
              Showing {filteredWorkers.length} of {workers.length} registered technicians
            </div>
          </div>

          {/* Table */}
          <div className="card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Technician / Worker</th>
                    <th>Trade & Skill Level</th>
                    <th>Zone & Vehicle</th>
                    <th>Duty Status</th>
                    <th>Shift</th>
                    <th>Rating & Jobs</th>
                    <th>Pending Payout</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkers.map((w) => (
                    <tr key={w.id} className={w.status === 'suspended' ? 'row-suspended' : ''}>
                      <td>
                        <div className="user-cell">
                          {w.avatarUrl ? (
                            <img src={w.avatarUrl} alt={w.name} className="kyc-avatar" />
                          ) : (
                            <div className="avatar-placeholder">{w.name.charAt(0)}</div>
                          )}
                          <div>
                            <div className="cell-title font-medium flex items-center gap-1">
                              {w.name}
                              {w.safetyGearVerified && w.policeVerificationDone && (
                                <span title="Fully Verified Compliance">
                                  <ShieldCheck size={14} className="text-emerald" />
                                </span>
                              )}
                            </div>
                            <div className="cell-sub">{w.phone}</div>
                            <div className="cell-sub text-muted">{w.email}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="font-semibold text-sm text-punch-orange">{w.trade}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <span
                            className={`badge text-xs ${
                              w.skillLevel === 'Master Specialist'
                                ? 'badge-purple'
                                : w.skillLevel === 'Certified Pro'
                                ? 'badge-success'
                                : 'badge-neutral'
                            }`}
                          >
                            <Award size={10} /> {w.skillLevel}
                          </span>
                        </div>
                        {w.secondaryTrades && w.secondaryTrades.length > 0 && (
                          <div className="cell-sub text-xs text-muted mt-1">
                            Also: {w.secondaryTrades.join(', ')}
                          </div>
                        )}
                      </td>

                      <td>
                        <div className="cell-title">{w.city}</div>
                        <div className="cell-sub text-muted">{w.zone}</div>
                        {w.vehicleType && (
                          <div className="cell-sub text-xs text-indigo mt-1 flex items-center gap-1">
                            <Truck size={11} /> {w.vehicleType}
                          </div>
                        )}
                      </td>

                      <td>
                        {getStatusBadge(w.status)}
                        {w.activeJob && (
                          <div className="cell-sub text-xs text-indigo font-medium mt-1">
                            Order #{w.activeJob.bookingId} ({w.activeJob.status})
                          </div>
                        )}
                        {w.lastLocationUpdate && (
                          <div className="cell-sub text-xs text-muted mt-0.5">
                            {w.lastLocationUpdate}
                          </div>
                        )}
                      </td>

                      <td>
                        <div className="text-sm font-medium">{w.shift.split(' ')[0]}</div>
                        <div className="cell-sub text-xs text-muted">
                          {w.shift.includes('(') ? w.shift.substring(w.shift.indexOf('(')) : ''}
                        </div>
                      </td>

                      <td>
                        <div className="rating-pill">
                          <Star size={11} className="fill-amber text-amber" />
                          <span>{w.rating.toFixed(2)}</span>
                        </div>
                        <div className="cell-sub mt-1">{w.totalJobsDone} completed</div>
                        <div className="cell-sub text-xs text-emerald">{w.onTimeRate}% on-time</div>
                      </td>

                      <td>
                        <div className="font-bold text-sm text-emerald">
                          ₹{w.pendingPayout.toLocaleString('en-IN')}
                        </div>
                        <div className="cell-sub text-xs text-muted">
                          Today: ₹{w.todayEarnings}
                        </div>
                      </td>

                      <td className="text-right">
                        <div className="row-actions">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setSelectedWorker(w)}
                            title="Inspect Worker Dossier"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleOpenEdit(w)}
                            title="Edit Details"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleOpenStatusModal(w)}
                            title="Change Duty Status"
                          >
                            <RotateCcw size={15} />
                          </button>

                          {w.status === 'on_duty' && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleOpenDispatch(w)}
                              title="Assign Task"
                            >
                              <Send size={13} /> Dispatch
                            </button>
                          )}

                          {w.pendingPayout > 0 && (
                            <button
                              className="btn btn-sm btn-emerald-dim"
                              onClick={() => handleOpenPayout(w)}
                              title="Disburse Payout"
                            >
                              <DollarSign size={13} /> Settle
                            </button>
                          )}

                          <button
                            className="btn btn-ghost btn-sm text-red"
                            onClick={() => deleteWorker(w.id)}
                            title="Remove from fleet"
                          >
                            <Trash2 size={14} />
                          </button>
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

      {/* SUBTAB 2: LIVE DISPATCH & ATTENDANCE */}
      {activeSubtab === 'dispatch' && (
        <div className="subtab-content">
          {/* Live Dispatch Header Bar */}
          <div className="card mb-6" style={{ background: 'linear-gradient(180deg, rgba(18,24,38,0.95) 0%, rgba(13,18,28,0.98) 100%)' }}>
            <div className="card-header">
              <div>
                <h3 className="card-title flex items-center gap-2">
                  <Radio size={18} className="text-punch-orange" />
                  Real-Time Field Dispatch & Task Allocations
                </h3>
                <p className="card-subtitle">
                  Live geofence tracking across Kolkata, Nabadwip, and Howrah. Assign incoming customer bookings to nearby technicians.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm" onClick={() => handleOpenDispatch()}>
                  <Send size={14} /> Dispatch Booking Now
                </button>
              </div>
            </div>

            {/* Geofence Status Strip */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded bg-card-alt border border-subtle">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Kolkata Municipal Sector</span>
                  <span className="badge badge-success">8km GPS Active</span>
                </div>
                <div className="text-xs text-muted mt-1">
                  {workers.filter((w) => w.city === 'Kolkata' && (w.status === 'on_duty' || w.status === 'on_job')).length} Active Field Technicians On-Duty
                </div>
              </div>

              <div className="p-3 rounded bg-card-alt border border-subtle">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Nabadwip Operational Sector</span>
                  <span className="badge badge-success">8km GPS Active</span>
                </div>
                <div className="text-xs text-muted mt-1">
                  {workers.filter((w) => w.city === 'Nabadwip' && (w.status === 'on_duty' || w.status === 'on_job')).length} Active Field Technicians On-Duty
                </div>
              </div>

              <div className="p-3 rounded bg-card-alt border border-subtle">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Howrah Sector</span>
                  <span className="badge badge-success">Active</span>
                </div>
                <div className="text-xs text-muted mt-1">
                  {workers.filter((w) => w.city === 'Howrah' && (w.status === 'on_duty' || w.status === 'on_job')).length} Active Field Technicians On-Duty
                </div>
              </div>
            </div>

            {/* Active Live Jobs in Progress */}
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted mb-3">
              Ongoing Field Jobs ({workers.filter((w) => w.activeJob).length})
            </h4>

            <div className="manage-grid">
              {workers
                .filter((w) => w.activeJob)
                .map((w) => {
                  const job = w.activeJob!;
                  return (
                    <div key={w.id} className="manage-card" style={{ borderLeft: '4px solid var(--color-purple)' }}>
                      <div className="manage-card-top">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="badge badge-purple">Order #{job.bookingId}</span>
                            <span className="badge badge-neutral text-xs">{job.scheduledTime}</span>
                          </div>
                          <div className="font-bold text-base mt-1.5">{job.serviceTitle}</div>
                          <div className="text-xs text-punch-orange font-medium mt-0.5">{w.trade}</div>
                        </div>
                        <span className="badge badge-success">₹{job.payoutAmount} payout</span>
                      </div>

                      <div className="p-3 my-2 rounded bg-app border border-subtle text-xs space-y-1">
                        <div>
                          <strong className="text-secondary">Customer:</strong> {job.customerName} ({job.customerPhone})
                        </div>
                        <div>
                          <strong className="text-secondary">Destination:</strong> {job.address}
                        </div>
                        <div className="text-muted flex items-center gap-1 mt-1">
                          <MapPin size={11} /> {job.zone} · {w.city}
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-t border-subtle">
                        <div className="flex items-center gap-2">
                          <div className="avatar-placeholder" style={{ width: '28px', height: '28px', fontSize: '11px' }}>
                            {w.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-semibold">{w.name}</div>
                            <div className="text-xs text-muted">{w.phone}</div>
                          </div>
                        </div>

                        <span className="badge badge-warning text-xs">
                          {job.status === 'traveling' ? 'En Route' : 'Working on site'}
                        </span>
                      </div>

                      <div className="manage-card-actions mt-3">
                        <button
                          className="btn btn-emerald btn-sm flex-1"
                          onClick={() => completeWorkerJob(w.id)}
                          title="Verify customer OTP and mark job completed"
                        >
                          <CheckCircle2 size={14} /> Mark Job Done
                        </button>
                        <button
                          className="btn btn-red-dim btn-sm"
                          onClick={() => cancelWorkerJob(w.id, 'Administrative release / client request')}
                          title="Release worker from this job"
                        >
                          <XCircle size={14} /> Reassign
                        </button>
                      </div>
                    </div>
                  );
                })}

              {workers.filter((w) => w.activeJob).length === 0 && (
                <div className="empty-state w-full text-center py-6">
                  <CheckCircle2 size={36} className="text-emerald mx-auto mb-2" />
                  <h4>No Jobs Currently In Progress</h4>
                  <p className="text-sm text-muted">All assigned customer tasks have been fulfilled. Ready for fresh dispatches.</p>
                </div>
              )}
            </div>
          </div>

          {/* Standby Available Technicians */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Available Technicians on Standby ({onDutyCount})</h3>
                <p className="card-subtitle">Technicians currently checked-in, verified, and awaiting assignment within operational zones</p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Technician</th>
                    <th>Specialty Trade</th>
                    <th>Base Sector</th>
                    <th>Current Shift</th>
                    <th>Rating</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {workers
                    .filter((w) => w.status === 'on_duty')
                    .map((w) => (
                      <tr key={w.id}>
                        <td>
                          <div className="user-cell">
                            <div className="avatar-placeholder">{w.name.charAt(0)}</div>
                            <div>
                              <div className="font-semibold text-sm">{w.name}</div>
                              <div className="cell-sub">{w.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-neutral text-punch-orange font-medium">
                            {w.trade}
                          </span>
                        </td>
                        <td>
                          <div className="cell-title">{w.zone}</div>
                          <div className="cell-sub text-muted">{w.city}</div>
                        </td>
                        <td>
                          <span className="text-xs text-secondary">{w.shift}</span>
                        </td>
                        <td>
                          <div className="rating-pill">
                            <Star size={11} className="fill-amber text-amber" />
                            <span>{w.rating.toFixed(2)}</span>
                          </div>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleOpenDispatch(w)}
                          >
                            <Send size={13} /> Dispatch to Task
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

      {/* SUBTAB 3: SKILLS & SAFETY */}
      {activeSubtab === 'skills' && (
        <div className="subtab-content">
          <div className="card mb-6">
            <div className="card-header">
              <div>
                <h3 className="card-title flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald" />
                  Trade Qualifications, Safety Kits & Background Checks
                </h3>
                <p className="card-subtitle">
                  Verify mandated safety equipment (insulated tools, harness, sanitized uniform, ID badge) and regulatory clearances before field deployment.
                </p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setShowOnboardModal(true)}>
                <PlusCircle size={14} /> Onboard New Worker
              </button>
            </div>

            {/* Compliance Matrix Table */}
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Worker</th>
                    <th>Trade & Skill Tier</th>
                    <th>Safety Tool-Kit & PPE</th>
                    <th>Police Background Check</th>
                    <th>Aadhaar KYC</th>
                    <th>Emergency Contact</th>
                    <th className="text-right">Compliance Audit</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((w) => (
                    <tr key={w.id}>
                      <td>
                        <div className="user-cell">
                          <div className="avatar-placeholder">{w.name.charAt(0)}</div>
                          <div>
                            <div className="font-semibold text-sm">{w.name}</div>
                            <div className="cell-sub">{w.phone}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="font-medium text-sm text-punch-orange">{w.trade}</div>
                        <span className="badge badge-neutral text-xs mt-1">
                          {w.skillLevel}
                        </span>
                      </td>

                      <td>
                        <button
                          className={`btn btn-sm ${w.safetyGearVerified ? 'btn-emerald-dim' : 'btn-red-dim'}`}
                          onClick={() => verifyWorkerCompliance(w.id, 'safetyGear', !w.safetyGearVerified)}
                          title="Click to toggle safety gear verification"
                        >
                          {w.safetyGearVerified ? (
                            <>
                              <CheckCircle2 size={13} /> Kit Verified
                            </>
                          ) : (
                            <>
                              <XCircle size={13} /> Gear Missing
                            </>
                          )}
                        </button>
                      </td>

                      <td>
                        <button
                          className={`btn btn-sm ${w.policeVerificationDone ? 'btn-emerald-dim' : 'btn-red-dim'}`}
                          onClick={() => verifyWorkerCompliance(w.id, 'police', !w.policeVerificationDone)}
                          title="Click to toggle police clearance verification"
                        >
                          {w.policeVerificationDone ? (
                            <>
                              <ShieldCheck size={13} /> Clearance Clear
                            </>
                          ) : (
                            <>
                              <AlertTriangle size={13} /> Action Pending
                            </>
                          )}
                        </button>
                      </td>

                      <td>
                        <button
                          className={`btn btn-sm ${w.aadhaarVerified ? 'btn-emerald-dim' : 'btn-red-dim'}`}
                          onClick={() => verifyWorkerCompliance(w.id, 'aadhaar', !w.aadhaarVerified)}
                          title="Click to toggle Aadhaar verification"
                        >
                          {w.aadhaarVerified ? (
                            <>
                              <CheckCircle2 size={13} /> Verified
                            </>
                          ) : (
                            <>
                              <XCircle size={13} /> Unverified
                            </>
                          )}
                        </button>
                      </td>

                      <td>
                        <div className="text-xs font-semibold">{w.emergencyContact.name}</div>
                        <div className="cell-sub text-xs text-muted">
                          {w.emergencyContact.phone} ({w.emergencyContact.relation})
                        </div>
                      </td>

                      <td className="text-right">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setSelectedWorker(w)}
                        >
                          <Eye size={14} /> Dossier
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

      {/* SUBTAB 4: PERFORMANCE & PAYOUTS */}
      {activeSubtab === 'payouts' && (
        <div className="subtab-content">
          <div className="card mb-6">
            <div className="card-header">
              <div>
                <h3 className="card-title flex items-center gap-2">
                  <DollarSign size={18} className="text-emerald" />
                  Worker Wage Settlements & SLA Performance
                </h3>
                <p className="card-subtitle">
                  Daily task earnings, incentive bonuses, customer satisfaction scores, and one-click direct IMPS wage disbursals.
                </p>
              </div>
              <div className="badge badge-success text-sm">
                Total Unsettled Wages: ₹{totalPendingPayouts.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Technician</th>
                    <th>Trade & Sector</th>
                    <th>Lifetime Jobs</th>
                    <th>Completion %</th>
                    <th>On-Time Arrival</th>
                    <th>Today's Task Earnings</th>
                    <th>Pending Wage Balance</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((w) => (
                    <tr key={w.id}>
                      <td>
                        <div className="user-cell">
                          <div className="avatar-placeholder">{w.name.charAt(0)}</div>
                          <div>
                            <div className="font-semibold text-sm">{w.name}</div>
                            <div className="cell-sub">{w.phone}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="font-medium text-sm text-punch-orange">{w.trade}</div>
                        <div className="cell-sub text-muted">{w.zone}</div>
                      </td>

                      <td className="font-bold">{w.totalJobsDone}</td>

                      <td>
                        <span className="font-semibold text-emerald">{w.completionRate}%</span>
                      </td>

                      <td>
                        <span className="font-semibold text-indigo">{w.onTimeRate}%</span>
                      </td>

                      <td>
                        <span className="font-semibold">₹{w.todayEarnings}</span>
                      </td>

                      <td>
                        <div className="font-bold text-base text-emerald">
                          ₹{w.pendingPayout.toLocaleString('en-IN')}
                        </div>
                      </td>

                      <td className="text-right">
                        {w.pendingPayout > 0 ? (
                          <button
                            className="btn btn-emerald btn-sm"
                            onClick={() => handleOpenPayout(w)}
                          >
                            <DollarSign size={14} /> Disburse ₹{w.pendingPayout}
                          </button>
                        ) : (
                          <span className="badge badge-neutral text-xs">All Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Worker Profile Inspection */}
      {selectedWorker && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedWorker(null)}
          title={`Worker Dossier: ${selectedWorker.name}`}
          subtitle={`Technician ID: ${selectedWorker.id} · ${selectedWorker.trade}`}
          maxWidth="700px"
        >
          <div className="profile-modal-body">
            <div className="profile-header-card">
              <div className="avatar-placeholder large">
                {selectedWorker.name.charAt(0)}
              </div>
              <div>
                <div className="profile-name flex items-center gap-2">
                  {selectedWorker.name}
                  {getStatusBadge(selectedWorker.status)}
                </div>
                <div className="profile-contact">
                  <span>
                    <Phone size={13} /> {selectedWorker.phone}
                  </span>
                  <span>
                    <Mail size={13} /> {selectedWorker.email}
                  </span>
                </div>
                <div className="profile-contact mt-1">
                  <span>
                    <MapPin size={13} /> {selectedWorker.zone} ({selectedWorker.city})
                  </span>
                  <span>
                    <Calendar size={13} /> Joined {selectedWorker.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-stats-grid mt-4">
              <div className="modal-stat">
                <span className="text-xs text-muted">Primary Trade</span>
                <span className="font-bold text-sm text-punch-orange mt-1">{selectedWorker.trade}</span>
              </div>
              <div className="modal-stat">
                <span className="text-xs text-muted">Skill Tier</span>
                <span className="font-bold text-sm text-indigo mt-1">{selectedWorker.skillLevel}</span>
              </div>
              <div className="modal-stat">
                <span className="text-xs text-muted">Customer Rating</span>
                <span className="font-bold text-sm text-amber mt-1">⭐ {selectedWorker.rating.toFixed(2)} / 5.0</span>
              </div>
              <div className="modal-stat">
                <span className="text-xs text-muted">Pending Payout</span>
                <span className="font-bold text-sm text-emerald mt-1">₹{selectedWorker.pendingPayout}</span>
              </div>
            </div>

            {selectedWorker.activeJob && (
              <div className="card mt-4 p-3 bg-card-alt border border-subtle">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-purple flex items-center gap-1.5">
                    <Radio size={14} /> Currently On Job: #{selectedWorker.activeJob.bookingId}
                  </span>
                  <span className="badge badge-success">₹{selectedWorker.activeJob.payoutAmount} payout</span>
                </div>
                <div className="text-sm font-semibold">{selectedWorker.activeJob.serviceTitle}</div>
                <div className="text-xs text-secondary mt-1">
                  Client: {selectedWorker.activeJob.customerName} ({selectedWorker.activeJob.customerPhone})
                </div>
                <div className="text-xs text-muted">Location: {selectedWorker.activeJob.address}</div>
              </div>
            )}

            <div className="card mt-4 p-3 border border-subtle text-sm">
              <h4 className="font-bold text-xs uppercase tracking-wider text-muted mb-2">
                Compliance & Emergency Details
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted">Vehicle Type:</span>
                  <div className="font-semibold">{selectedWorker.vehicleType || 'Not specified'}</div>
                </div>
                <div>
                  <span className="text-muted">Assigned Shift:</span>
                  <div className="font-semibold">{selectedWorker.shift}</div>
                </div>
                <div>
                  <span className="text-muted">Emergency Contact:</span>
                  <div className="font-semibold">
                    {selectedWorker.emergencyContact.name} ({selectedWorker.emergencyContact.relation})
                  </div>
                  <div className="text-muted">{selectedWorker.emergencyContact.phone}</div>
                </div>
                <div>
                  <span className="text-muted">Compliance Badges:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`badge ${selectedWorker.safetyGearVerified ? 'badge-success' : 'badge-danger'}`}>
                      Safety Gear
                    </span>
                    <span className={`badge ${selectedWorker.policeVerificationDone ? 'badge-success' : 'badge-danger'}`}>
                      Police Clear
                    </span>
                  </div>
                </div>
              </div>

              {selectedWorker.notes && (
                <div className="mt-3 text-xs text-muted border-t border-subtle pt-2">
                  <strong>Notes:</strong> {selectedWorker.notes}
                </div>
              )}
            </div>

            <div className="modal-footer-actions mt-6">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedWorker(null);
                  handleOpenEdit(selectedWorker);
                }}
              >
                <Edit3 size={15} /> Edit Worker Profile
              </button>
              {selectedWorker.status === 'on_duty' && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectedWorker(null);
                    handleOpenDispatch(selectedWorker);
                  }}
                >
                  <Send size={15} /> Dispatch Job
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Onboard New Worker */}
      {showOnboardModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowOnboardModal(false)}
          title="Onboard New Field Worker"
          subtitle="Register a vetted service technician into the PunchX operational fleet"
          maxWidth="680px"
        >
          <div className="edit-form-body">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="e.g. Debabrata Mondal"
                  value={onboardForm.name}
                  onChange={(e) => setOnboardForm({ ...onboardForm, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="+91 98300 00000"
                  value={onboardForm.phone}
                  onChange={(e) => setOnboardForm({ ...onboardForm, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="form-group">
                <label className="form-label">Primary Trade Specialty *</label>
                <select
                  className="select-input w-full"
                  value={onboardForm.trade}
                  onChange={(e) => setOnboardForm({ ...onboardForm, trade: e.target.value as WorkerTrade })}
                >
                  <option value="AC & Refrigeration">AC & Refrigeration</option>
                  <option value="Electrical & Wiring">Electrical & Wiring</option>
                  <option value="Plumbing & Sanitation">Plumbing & Sanitation</option>
                  <option value="Deep Cleaning & Sanitization">Deep Cleaning & Sanitization</option>
                  <option value="Carpentry & Woodwork">Carpentry & Woodwork</option>
                  <option value="Painting & Waterproofing">Painting & Waterproofing</option>
                  <option value="Appliance Repair">Appliance Repair</option>
                  <option value="Beauty & Grooming">Beauty & Grooming</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Skill Certification Tier</label>
                <select
                  className="select-input w-full"
                  value={onboardForm.skillLevel}
                  onChange={(e) => setOnboardForm({ ...onboardForm, skillLevel: e.target.value as SkillLevel })}
                >
                  <option value="Apprentice">Apprentice (Entry Level)</option>
                  <option value="Certified Pro">Certified Pro (Licensed)</option>
                  <option value="Master Specialist">Master Specialist (Senior)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="form-group">
                <label className="form-label">City Zone</label>
                <select
                  className="select-input w-full"
                  value={onboardForm.city}
                  onChange={(e) => setOnboardForm({ ...onboardForm, city: e.target.value as any })}
                >
                  <option value="Kolkata">Kolkata</option>
                  <option value="Nabadwip">Nabadwip</option>
                  <option value="Howrah">Howrah</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Base Operating Sector / Area</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="e.g. Salt Lake & Sector V"
                  value={onboardForm.zone}
                  onChange={(e) => setOnboardForm({ ...onboardForm, zone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="form-group">
                <label className="form-label">Assigned Shift</label>
                <select
                  className="select-input w-full"
                  value={onboardForm.shift}
                  onChange={(e) => setOnboardForm({ ...onboardForm, shift: e.target.value as WorkerShift })}
                >
                  <option value="Full Day (08:00 - 20:00)">Full Day (08:00 - 20:00)</option>
                  <option value="Morning (08:00 - 14:00)">Morning (08:00 - 14:00)</option>
                  <option value="Evening (14:00 - 20:00)">Evening (14:00 - 20:00)</option>
                  <option value="Emergency On-Call">Emergency On-Call</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Commute / Vehicle</label>
                <select
                  className="select-input w-full"
                  value={onboardForm.vehicleType}
                  onChange={(e) => setOnboardForm({ ...onboardForm, vehicleType: e.target.value as any })}
                >
                  <option value="Two-Wheeler (Motorcycle)">Two-Wheeler (Motorcycle)</option>
                  <option value="Bicycle">Bicycle</option>
                  <option value="Public Transit">Public Transit</option>
                  <option value="Van/Tempo">Van/Tempo</option>
                </select>
              </div>
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Emergency Contact (Name & Phone)</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  className="input-text"
                  placeholder="Contact Name (e.g. Spouse/Parent)"
                  value={onboardForm.emergencyName}
                  onChange={(e) => setOnboardForm({ ...onboardForm, emergencyName: e.target.value })}
                />
                <input
                  type="text"
                  className="input-text"
                  placeholder="Emergency Phone Number"
                  value={onboardForm.emergencyPhone}
                  onChange={(e) => setOnboardForm({ ...onboardForm, emergencyPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label font-semibold">Pre-Deployment Verification Checklist</label>
              <div className="grid grid-cols-3 gap-2">
                <label className="flex items-center gap-2 text-xs p-2 bg-card-alt rounded border border-subtle cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onboardForm.safetyGearVerified}
                    onChange={(e) => setOnboardForm({ ...onboardForm, safetyGearVerified: e.target.checked })}
                  />
                  <span>Safety Kit & Uniform</span>
                </label>
                <label className="flex items-center gap-2 text-xs p-2 bg-card-alt rounded border border-subtle cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onboardForm.policeVerificationDone}
                    onChange={(e) => setOnboardForm({ ...onboardForm, policeVerificationDone: e.target.checked })}
                  />
                  <span>Police Clearance</span>
                </label>
                <label className="flex items-center gap-2 text-xs p-2 bg-card-alt rounded border border-subtle cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onboardForm.aadhaarVerified}
                    onChange={(e) => setOnboardForm({ ...onboardForm, aadhaarVerified: e.target.checked })}
                  />
                  <span>Aadhaar ID Verified</span>
                </label>
              </div>
            </div>

            <div className="modal-footer-actions">
              <button className="btn btn-secondary" onClick={() => setShowOnboardModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleConfirmOnboard}>
                <PlusCircle size={15} /> Confirm & Deploy to Fleet
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Dispatch Job to Worker */}
      {dispatchModalWorker && (
        <Modal
          isOpen={true}
          onClose={() => setDispatchModalWorker(null)}
          title={`Dispatch Field Job: ${dispatchModalWorker.name}`}
          subtitle={`Assign task directly to ${dispatchModalWorker.name} (${dispatchModalWorker.trade} · ${dispatchModalWorker.zone})`}
          maxWidth="640px"
        >
          <div className="edit-form-body">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="form-group">
                <label className="form-label">Booking / Order ID</label>
                <input
                  type="text"
                  className="input-text font-mono"
                  value={dispatchForm.bookingId}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, bookingId: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Service Required</label>
                <input
                  type="text"
                  className="input-text"
                  value={dispatchForm.serviceTitle}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, serviceTitle: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="form-group">
                <label className="form-label">Customer Full Name *</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="e.g. Sourav Mukherjee"
                  value={dispatchForm.customerName}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, customerName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Customer Phone *</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="+91 98300 12345"
                  value={dispatchForm.customerPhone}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, customerPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Service Destination Address *</label>
              <textarea
                className="textarea-input"
                rows={2}
                placeholder="e.g. Flat 4B, Tower 2, Hiland Park, EM Bypass, Kolkata"
                value={dispatchForm.address}
                onChange={(e) => setDispatchForm({ ...dispatchForm, address: e.target.value })}
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="form-group">
                <label className="form-label">Scheduled Time Window</label>
                <select
                  className="select-input w-full"
                  value={dispatchForm.scheduledTime}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, scheduledTime: e.target.value })}
                >
                  <option value="Immediate (Within 45 mins)">Immediate (Within 45 mins)</option>
                  <option value="Today 14:00 - 16:00">Today 14:00 - 16:00</option>
                  <option value="Today 16:00 - 18:00">Today 16:00 - 18:00</option>
                  <option value="Tomorrow Morning 09:00">Tomorrow Morning 09:00</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Worker Task Payout (₹)</label>
                <input
                  type="number"
                  className="input-text font-bold text-emerald"
                  value={dispatchForm.payoutAmount}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, payoutAmount: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="modal-footer-actions">
              <button className="btn btn-secondary" onClick={() => setDispatchModalWorker(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleConfirmDispatch}>
                <Send size={15} /> Confirm Dispatch & Transmit Task
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Settle Worker Payout */}
      {payoutModalWorker && (
        <Modal
          isOpen={true}
          onClose={() => setPayoutModalWorker(null)}
          title={`Disburse Worker Payout: ${payoutModalWorker.name}`}
          subtitle={`Current Unsettled Earnings: ₹${payoutModalWorker.pendingPayout.toLocaleString('en-IN')}`}
        >
          <div className="edit-form-body">
            <div className="banner-alert success mb-4">
              <CheckCircle2 size={18} className="text-emerald flex-shrink-0" />
              <div className="text-sm">
                Disbursements are processed directly via instant IMPS to the worker's linked bank account.
              </div>
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Disbursal Amount (₹) *</label>
              <input
                type="number"
                className="input-text font-bold text-lg text-emerald"
                value={payoutAmountInput}
                onChange={(e) => setPayoutAmountInput(e.target.value)}
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Payment Channel</label>
              <select className="select-input w-full" defaultValue="IMPS">
                <option value="IMPS">Direct IMPS Instant Rail (PunchX Corporate)</option>
                <option value="UPI">UPI Auto-Disburse</option>
                <option value="NEFT">NEFT Batch Settlement</option>
              </select>
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Transaction Reference Code</label>
              <input
                type="text"
                className="input-text font-mono"
                value={payoutReference}
                onChange={(e) => setPayoutReference(e.target.value)}
              />
            </div>

            <div className="modal-footer-actions">
              <button className="btn btn-secondary" onClick={() => setPayoutModalWorker(null)}>
                Cancel
              </button>
              <button className="btn btn-emerald" onClick={handleConfirmPayout}>
                <Check size={15} /> Approve & Disburse ₹{payoutAmountInput}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Change Worker Status / Suspension */}
      {statusModalWorker && (
        <Modal
          isOpen={true}
          onClose={() => setStatusModalWorker(null)}
          title={`Update Duty Status: ${statusModalWorker.name}`}
          subtitle="Change operational duty state or enforce disciplinary hold"
        >
          <div className="edit-form-body">
            <div className="form-group mb-3">
              <label className="form-label">New Duty State *</label>
              <select
                className="select-input w-full"
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value as WorkerStatus)}
              >
                <option value="on_duty">On Duty & Ready (Available for dispatch)</option>
                <option value="off_duty">Off Duty (Offline / Checked Out)</option>
                <option value="on_leave">On Approved Leave</option>
                <option value="suspended">Suspended (Disciplinary Freeze)</option>
              </select>
            </div>

            {targetStatus === 'suspended' && (
              <div className="form-group mb-4">
                <label className="form-label font-semibold text-red">Mandatory Suspension Reason *</label>
                <textarea
                  className="textarea-input"
                  rows={3}
                  placeholder="State reason for suspension (complaints, safety violations, no-show)..."
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                ></textarea>
              </div>
            )}

            <div className="modal-footer-actions">
              <button className="btn btn-secondary" onClick={() => setStatusModalWorker(null)}>
                Cancel
              </button>
              <button
                className={`btn ${targetStatus === 'suspended' ? 'btn-red' : 'btn-primary'}`}
                onClick={handleConfirmStatusChange}
              >
                Update Status
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Edit Worker Profile */}
      {editingWorker && (
        <Modal
          isOpen={true}
          onClose={() => setEditingWorker(null)}
          title={`Edit Profile: ${editingWorker.name}`}
          subtitle={`Worker ID: ${editingWorker.id}`}
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
                <label className="form-label">Phone</label>
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
                <label className="form-label">Trade</label>
                <select
                  className="select-input w-full"
                  value={editFormData.trade}
                  onChange={(e) => setEditFormData({ ...editFormData, trade: e.target.value as WorkerTrade })}
                >
                  <option value="AC & Refrigeration">AC & Refrigeration</option>
                  <option value="Electrical & Wiring">Electrical & Wiring</option>
                  <option value="Plumbing & Sanitation">Plumbing & Sanitation</option>
                  <option value="Deep Cleaning & Sanitization">Deep Cleaning & Sanitization</option>
                  <option value="Carpentry & Woodwork">Carpentry & Woodwork</option>
                  <option value="Painting & Waterproofing">Painting & Waterproofing</option>
                  <option value="Appliance Repair">Appliance Repair</option>
                  <option value="Beauty & Grooming">Beauty & Grooming</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Skill Tier</label>
                <select
                  className="select-input w-full"
                  value={editFormData.skillLevel}
                  onChange={(e) => setEditFormData({ ...editFormData, skillLevel: e.target.value as SkillLevel })}
                >
                  <option value="Apprentice">Apprentice</option>
                  <option value="Certified Pro">Certified Pro</option>
                  <option value="Master Specialist">Master Specialist</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="form-group">
                <label className="form-label">Operating Zone</label>
                <input
                  type="text"
                  className="input-text"
                  value={editFormData.zone || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, zone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <select
                  className="select-input w-full"
                  value={editFormData.vehicleType}
                  onChange={(e) => setEditFormData({ ...editFormData, vehicleType: e.target.value as any })}
                >
                  <option value="Two-Wheeler (Motorcycle)">Two-Wheeler (Motorcycle)</option>
                  <option value="Bicycle">Bicycle</option>
                  <option value="Public Transit">Public Transit</option>
                  <option value="Van/Tempo">Van/Tempo</option>
                </select>
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Administrative Notes</label>
              <textarea
                className="textarea-input"
                rows={2}
                value={editFormData.notes || ''}
                onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
              ></textarea>
            </div>

            <div className="modal-footer-actions">
              <button className="btn btn-secondary" onClick={() => setEditingWorker(null)}>
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
