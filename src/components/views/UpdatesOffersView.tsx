import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import type { OfferCoupon, Announcement } from '../../types';
import { Modal } from '../common/Modal';
import {
  BellRing,
  Tag,
  Megaphone,
  PlusCircle,
  Clock,
  Send,
  Trash2,
  Copy
} from 'lucide-react';

export const UpdatesOffersView: React.FC = () => {
  const {
    offers,
    announcements,
    activeSubtab,
    setActiveSubtab,
    addOffer,
    toggleOffer,
    deleteOffer,
    sendAnnouncement,
    addToast
  } = useAdmin();

  // Create Coupon Modal
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponFormData, setCouponFormData] = useState<Partial<OfferCoupon>>({
    code: '',
    title: '',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 499,
    maxDiscount: 200,
    validFrom: '2026-04-14',
    validUntil: '2026-06-30',
    usageLimit: 1000,
    applicableCategories: ['All'],
    isActive: true
  });

  // Create Broadcast Modal
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastFormData, setBroadcastFormData] = useState<Partial<Announcement>>({
    title: '',
    message: '',
    type: 'update',
    targetAudience: 'all',
    priority: 'high'
  });

  const handleSaveCoupon = () => {
    if (!couponFormData.code?.trim() || !couponFormData.title?.trim()) return;
    addOffer({
      code: couponFormData.code.toUpperCase().replace(/\s+/g, ''),
      title: couponFormData.title,
      discountType: couponFormData.discountType || 'percentage',
      discountValue: couponFormData.discountValue || 10,
      minOrderValue: couponFormData.minOrderValue || 0,
      maxDiscount: couponFormData.maxDiscount,
      validFrom: couponFormData.validFrom || '2026-04-14',
      validUntil: couponFormData.validUntil || '2026-12-31',
      usageLimit: couponFormData.usageLimit || 500,
      applicableCategories: couponFormData.applicableCategories || ['All'],
      isActive: true
    });
    setIsCouponModalOpen(false);
  };

  const handleSendBroadcast = () => {
    if (!broadcastFormData.title?.trim() || !broadcastFormData.message?.trim()) return;
    sendAnnouncement({
      title: broadcastFormData.title,
      message: broadcastFormData.message,
      type: broadcastFormData.type || 'update',
      targetAudience: broadcastFormData.targetAudience || 'all',
      priority: broadcastFormData.priority || 'medium'
    });
    setIsBroadcastModalOpen(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    addToast('Coupon Copied', `Code ${code} copied to clipboard!`, 'info');
  };

  return (
    <div className="view-container">
      {/* View Header with Subtab Navigation */}
      <div className="view-header">
        <div>
          <div className="section-supertitle">SECTION 4</div>
          <h1 className="view-title">Updates, Offers & Announcements</h1>
          <p className="view-subtitle">
            Critical operational advisories, promo code marketing campaigns, and real-time user broadcasts.
          </p>
        </div>

        {/* Subtabs matching handwritten notes: i. Important update, ii. Offers, iii. Announcements */}
        <div className="subtab-pills">
          <button
            className={`subtab-pill ${activeSubtab === 'updates' ? 'active' : ''}`}
            onClick={() => setActiveSubtab('updates')}
          >
            <BellRing size={15} />
            <span>i. Important Update</span>
            <span className="pill-badge">{announcements.filter((a) => a.type === 'critical_alert' || a.type === 'maintenance').length}</span>
          </button>
          <button
            className={`subtab-pill ${activeSubtab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveSubtab('offers')}
          >
            <Tag size={15} />
            <span>ii. Offers</span>
            <span className="pill-badge">{offers.length}</span>
          </button>
          <button
            className={`subtab-pill ${activeSubtab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveSubtab('announcements')}
          >
            <Megaphone size={15} />
            <span>iii. Announcements</span>
            <span className="pill-badge">{announcements.length}</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: IMPORTANT UPDATE */}
      {activeSubtab === 'updates' && (
        <div className="subtab-content">
          <div className="subtab-action-header mb-4 flex justify-between items-center">
            <div>
              <h3 className="card-title">Critical System & Weather Protocol Updates</h3>
              <p className="card-subtitle">
                High-priority notifications pinned on provider and consumer dashboards.
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setBroadcastFormData({
                  title: '',
                  message: '',
                  type: 'critical_alert',
                  targetAudience: 'professionals',
                  priority: 'urgent'
                });
                setIsBroadcastModalOpen(true);
              }}
            >
              <PlusCircle size={16} /> Post Operational Update
            </button>
          </div>

          <div className="updates-stream">
            {announcements
              .filter((a) => a.type === 'critical_alert' || a.type === 'maintenance' || a.priority === 'high' || a.priority === 'urgent')
              .map((item) => (
                <div key={item.id} className="update-card-item">
                  <div className="update-card-header">
                    <div className="flex items-center gap-2">
                      <span
                        className={`badge ${
                          item.priority === 'urgent'
                            ? 'badge-danger'
                            : item.priority === 'high'
                            ? 'badge-warning'
                            : 'badge-purple'
                        }`}
                      >
                        {item.priority.toUpperCase()} ADVISORY
                      </span>
                      <span className="badge badge-neutral">Audience: {item.targetAudience.toUpperCase()}</span>
                    </div>
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Clock size={12} /> {item.sentAt}
                    </span>
                  </div>

                  <h3 className="update-title mt-2">{item.title}</h3>
                  <p className="update-text">{item.message}</p>

                  <div className="update-footer mt-3 flex justify-between items-center">
                    <div className="text-xs text-muted">
                      Issued by: <strong>{item.sentBy}</strong>
                    </div>
                    <div className="text-xs text-emerald font-semibold">
                      Delivered to {item.reachCount.toLocaleString('en-IN')} active users
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: OFFERS (PROMO CODES & CAMPAIGNS) */}
      {activeSubtab === 'offers' && (
        <div className="subtab-content">
          <div className="subtab-action-header mb-4 flex justify-between items-center">
            <div>
              <h3 className="card-title">Promotions, Coupons & Discount Campaigns</h3>
              <p className="card-subtitle">
                Create referral codes, seasonal sales, and first-time customer coupons for checkout redemption.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setIsCouponModalOpen(true)}>
              <PlusCircle size={16} /> Create Coupon Code
            </button>
          </div>

          <div className="offers-grid">
            {offers.map((off) => {
              const usagePercent = Math.min(Math.round((off.usageCount / off.usageLimit) * 100), 100);

              return (
                <div key={off.id} className={`offer-card ${!off.isActive ? 'offer-inactive' : ''}`}>
                  <div className="offer-header">
                    <div className="flex items-center gap-2">
                      <div className="coupon-code-badge font-mono" onClick={() => handleCopyCode(off.code)}>
                        {off.code} <Copy size={12} className="inline ml-1 opacity-70" />
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => toggleOffer(off.id)}
                      title={off.isActive ? 'Deactivate Coupon' : 'Activate Coupon'}
                    >
                      {off.isActive ? (
                        <span className="badge badge-success cursor-pointer">Active</span>
                      ) : (
                        <span className="badge badge-neutral cursor-pointer">Paused</span>
                      )}
                    </button>
                  </div>

                  <h4 className="offer-title">{off.title}</h4>

                  <div className="offer-discount-banner">
                    {off.discountType === 'percentage' ? (
                      <span className="font-extrabold text-2xl text-punch-orange">
                        {off.discountValue}% OFF
                      </span>
                    ) : (
                      <span className="font-extrabold text-2xl text-emerald">
                        ₹{off.discountValue} FLAT OFF
                      </span>
                    )}
                    {off.maxDiscount && (
                      <span className="text-xs text-muted block">Max discount: ₹{off.maxDiscount}</span>
                    )}
                  </div>

                  <div className="offer-rules-box">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Min Order Value:</span>
                      <span className="font-semibold">₹{off.minOrderValue}</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-muted">Valid Window:</span>
                      <span>{off.validFrom} to {off.validUntil}</span>
                    </div>
                  </div>

                  {/* Usage Meter */}
                  <div className="usage-progress-container mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted">Redemptions:</span>
                      <span className="font-semibold">
                        {off.usageCount} / {off.usageLimit} ({usagePercent}%)
                      </span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-bar-fill" style={{ width: `${usagePercent}%` }}></div>
                    </div>
                  </div>

                  <div className="offer-card-footer mt-4 flex justify-between items-center">
                    <span className="text-xs text-muted">
                      Target: {off.applicableCategories.join(', ')}
                    </span>
                    <button
                      className="btn btn-ghost btn-sm text-red"
                      onClick={() => deleteOffer(off.id)}
                      title="Delete coupon"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: ANNOUNCEMENTS (BROADCAST DISPATCHER) */}
      {activeSubtab === 'announcements' && (
        <div className="subtab-content">
          <div className="subtab-action-header mb-4 flex justify-between items-center">
            <div>
              <h3 className="card-title">Live Broadcast & Multi-Channel Notifications</h3>
              <p className="card-subtitle">
                Push instant updates to Kolkata and Nabadwip marketplace participants via in-app banners and notifications.
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setBroadcastFormData({
                  title: '',
                  message: '',
                  type: 'promotional',
                  targetAudience: 'all',
                  priority: 'medium'
                });
                setIsBroadcastModalOpen(true);
              }}
            >
              <Send size={15} /> Compose Live Broadcast
            </button>
          </div>

          <div className="card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Broadcast Title</th>
                    <th>Target Audience</th>
                    <th>Notification Type</th>
                    <th>Priority</th>
                    <th>Delivered Reach</th>
                    <th>Dispatched By</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <div className="cell-title font-medium">{a.title}</div>
                        <div className="cell-sub text-muted line-clamp-1">{a.message}</div>
                      </td>
                      <td>
                        <span className="badge badge-purple">{a.targetAudience.toUpperCase()}</span>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{a.type}</span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            a.priority === 'urgent'
                              ? 'badge-danger'
                              : a.priority === 'high'
                              ? 'badge-warning'
                              : 'badge-neutral'
                          }`}
                        >
                          {a.priority}
                        </span>
                      </td>
                      <td>
                        <div className="font-semibold text-emerald">
                          {a.reachCount.toLocaleString('en-IN')} Users
                        </div>
                      </td>
                      <td>
                        <div className="cell-title text-sm">{a.sentBy}</div>
                      </td>
                      <td className="text-muted text-sm">{a.sentAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create Coupon Code */}
      {isCouponModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsCouponModalOpen(false)}
          title="Create Discount Coupon Code"
          subtitle="Set discount values, minimum booking thresholds, and validity dates."
        >
          <div className="coupon-form-body">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="form-group">
                <label className="form-label">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  className="input-text font-mono font-bold"
                  placeholder="e.g. MONSOON30"
                  value={couponFormData.code || ''}
                  onChange={(e) =>
                    setCouponFormData({
                      ...couponFormData,
                      code: e.target.value.toUpperCase()
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Campaign Title</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="e.g. Monsoon Home Prep 30% OFF"
                  value={couponFormData.title || ''}
                  onChange={(e) =>
                    setCouponFormData({ ...couponFormData, title: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="form-group">
                <label className="form-label">Discount Type</label>
                <select
                  className="select-input"
                  value={couponFormData.discountType || 'percentage'}
                  onChange={(e) =>
                    setCouponFormData({
                      ...couponFormData,
                      discountType: e.target.value as any
                    })
                  }
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Cash (₹)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Discount Value {couponFormData.discountType === 'percentage' ? '(%)' : '(₹)'}
                </label>
                <input
                  type="number"
                  className="input-text font-bold"
                  value={couponFormData.discountValue ?? 20}
                  onChange={(e) =>
                    setCouponFormData({
                      ...couponFormData,
                      discountValue: parseFloat(e.target.value) || 0
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="form-group">
                <label className="form-label">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  className="input-text"
                  value={couponFormData.minOrderValue ?? 499}
                  onChange={(e) =>
                    setCouponFormData({
                      ...couponFormData,
                      minOrderValue: parseFloat(e.target.value) || 0
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max Discount Cap (₹)</label>
                <input
                  type="number"
                  className="input-text"
                  placeholder="Optional cap"
                  value={couponFormData.maxDiscount ?? 200}
                  onChange={(e) =>
                    setCouponFormData({
                      ...couponFormData,
                      maxDiscount: parseFloat(e.target.value) || undefined
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="form-group">
                <label className="form-label">Redemption Limit</label>
                <input
                  type="number"
                  className="input-text"
                  value={couponFormData.usageLimit ?? 1000}
                  onChange={(e) =>
                    setCouponFormData({
                      ...couponFormData,
                      usageLimit: parseInt(e.target.value) || 500
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Valid Until</label>
                <input
                  type="date"
                  className="input-text"
                  value={couponFormData.validUntil || '2026-06-30'}
                  onChange={(e) =>
                    setCouponFormData({ ...couponFormData, validUntil: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="modal-footer-actions mt-6">
              <button className="btn btn-secondary" onClick={() => setIsCouponModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveCoupon}
                disabled={!couponFormData.code?.trim()}
              >
                Create Promo Coupon
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Compose Broadcast */}
      {isBroadcastModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsBroadcastModalOpen(false)}
          title="Compose Real-Time Broadcast"
          subtitle="Send push notice to Kolkata & Nabadwip platform users."
        >
          <div className="broadcast-form-body">
            <div className="form-group mb-3">
              <label className="form-label">Broadcast Headline</label>
              <input
                type="text"
                className="input-text"
                placeholder="e.g. Emergency Heatwave Advisory / Festive Discount"
                value={broadcastFormData.title || ''}
                onChange={(e) =>
                  setBroadcastFormData({ ...broadcastFormData, title: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="form-group">
                <label className="form-label">Audience</label>
                <select
                  className="select-input"
                  value={broadcastFormData.targetAudience || 'all'}
                  onChange={(e) =>
                    setBroadcastFormData({
                      ...broadcastFormData,
                      targetAudience: e.target.value as any
                    })
                  }
                >
                  <option value="all">All Users (Pros & Customers)</option>
                  <option value="customers">Customers Only</option>
                  <option value="professionals">Service Pros Only</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Notice Type</label>
                <select
                  className="select-input"
                  value={broadcastFormData.type || 'update'}
                  onChange={(e) =>
                    setBroadcastFormData({
                      ...broadcastFormData,
                      type: e.target.value as any
                    })
                  }
                >
                  <option value="update">Operational Update</option>
                  <option value="critical_alert">Emergency Alert</option>
                  <option value="promotional">Offer / Marketing</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="select-input"
                  value={broadcastFormData.priority || 'medium'}
                  onChange={(e) =>
                    setBroadcastFormData({
                      ...broadcastFormData,
                      priority: e.target.value as any
                    })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Message Content</label>
              <textarea
                className="textarea-input"
                rows={4}
                placeholder="Compose announcement body text..."
                value={broadcastFormData.message || ''}
                onChange={(e) =>
                  setBroadcastFormData({ ...broadcastFormData, message: e.target.value })
                }
              ></textarea>
            </div>

            <div className="modal-footer-actions mt-6">
              <button
                className="btn btn-secondary"
                onClick={() => setIsBroadcastModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSendBroadcast}
                disabled={!broadcastFormData.title?.trim() || !broadcastFormData.message?.trim()}
              >
                <Send size={15} /> Send Broadcast
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
