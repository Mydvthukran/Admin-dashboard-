import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import type { PaymentTransaction, RefundRequest } from '../../types';
import { Modal } from '../common/Modal';
import {
  CheckCircle2,
  RefreshCw,
  XCircle,
  Percent,
  Download,
  Eye,
  Send,
  Building,
  ArrowUpRight
} from 'lucide-react';

export const PaymentTransactionView: React.FC = () => {
  const {
    payments,
    refunds,
    failedTransactions,
    commissions,
    categories,
    activeSubtab,
    setActiveSubtab,
    searchQuery,
    processRefund,
    retryFailedTransaction,
    updateCommissionRate,
    settleCommissionPayout,
    addToast
  } = useAdmin();

  // Filters for Completed Payments
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentTransaction | null>(null);

  // Refund Review Modal
  const [reviewingRefund, setReviewingRefund] = useState<RefundRequest | null>(null);
  const [refundRemarks, setRefundRemarks] = useState<string>('');

  // Calculations
  const completedPayments = payments.filter((p) => p.status === 'completed');
  const totalSettledGMV = completedPayments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPlatformCut = completedPayments.reduce((acc, curr) => acc + curr.commissionAmount, 0);
  const totalProEarnings = completedPayments.reduce((acc, curr) => acc + curr.proPayoutAmount, 0);

  // CSV Export for Payments
  const handleExportCSV = () => {
    const headers = 'PaymentID,RazorpayID,Customer,Phone,Pro,Service,Amount,Commission,ProPayout,Method,Status,Date\n';
    const rows = payments
      .map(
        (p) =>
          `"${p.id}","${p.razorpayPaymentId}","${p.customerName}","${p.customerPhone}","${p.proName}","${p.serviceName}",${p.amount},${p.commissionAmount},${p.proPayoutAmount},"${p.method}","${p.status}","${p.createdAt}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `punchx_settlements_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('CSV Exported', 'Downloaded Razorpay settlement logs.', 'success');
  };

  return (
    <div className="view-container">
      {/* View Header with Subtab Navigation */}
      <div className="view-header">
        <div>
          <div className="section-supertitle">SECTION 3</div>
          <h1 className="view-title">Payment and Transactions</h1>
          <p className="view-subtitle">
            Razorpay gateway settlements, customer refund claims, failed transaction diagnosis, and marketplace commissions.
          </p>
        </div>

        {/* Subtabs matching handwritten notes: i. Payment (Done), ii. Refund, iii. Failed Transaction, iv. Commission */}
        <div className="subtab-pills">
          <button
            className={`subtab-pill ${activeSubtab === 'done' ? 'active' : ''}`}
            onClick={() => setActiveSubtab('done')}
          >
            <CheckCircle2 size={15} />
            <span>i. Payment (Done)</span>
            <span className="pill-badge">{payments.length}</span>
          </button>
          <button
            className={`subtab-pill ${activeSubtab === 'refund' ? 'active' : ''}`}
            onClick={() => setActiveSubtab('refund')}
          >
            <RefreshCw size={15} />
            <span>ii. Refund</span>
            {refunds.filter((r) => r.status === 'pending').length > 0 && (
              <span className="pill-badge badge-red">
                {refunds.filter((r) => r.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            className={`subtab-pill ${activeSubtab === 'failed' ? 'active' : ''}`}
            onClick={() => setActiveSubtab('failed')}
          >
            <XCircle size={15} />
            <span>iii. Failed Transaction</span>
            {failedTransactions.filter((f) => !f.resolved).length > 0 && (
              <span className="pill-badge badge-zinc">
                {failedTransactions.filter((f) => !f.resolved).length}
              </span>
            )}
          </button>
          <button
            className={`subtab-pill ${activeSubtab === 'commission' ? 'active' : ''}`}
            onClick={() => setActiveSubtab('commission')}
          >
            <Percent size={15} />
            <span>iv. Commission</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: PAYMENT (DONE) */}
      {activeSubtab === 'done' && (
        <div className="subtab-content">
          {/* Revenue KPI Summary */}
          <div className="stats-grid mb-4">
            <div className="stat-card">
              <span className="stat-label">Gross Settled Amount</span>
              <div className="stat-value text-emerald">₹{totalSettledGMV.toLocaleString('en-IN')}</div>
              <span className="stat-footer text-muted">via Razorpay Rails</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">PunchX Retained Revenue</span>
              <div className="stat-value text-punch-orange">₹{Math.round(totalPlatformCut).toLocaleString('en-IN')}</div>
              <span className="stat-footer text-muted">Net marketplace fees</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Professional Net Payouts</span>
              <div className="stat-value">₹{Math.round(totalProEarnings).toLocaleString('en-IN')}</div>
              <span className="stat-footer text-muted">85.2% paid to local pros</span>
            </div>
          </div>

          {/* Table Filter & Action Bar */}
          <div className="filter-bar mb-4">
            <div className="filter-group">
              <label>Payment Method:</label>
              <select
                className="select-input"
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
              >
                <option value="all">All Payment Rails</option>
                <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Netbanking">Netbanking</option>
              </select>
            </div>

            <button className="btn btn-secondary ml-auto" onClick={handleExportCSV}>
              <Download size={15} /> Export Settlement CSV
            </button>
          </div>

          {/* Payments Table */}
          <div className="card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Razorpay Payment ID</th>
                    <th>Customer</th>
                    <th>Assigned Pro</th>
                    <th>Service Name</th>
                    <th>Gross Amount</th>
                    <th>Commission (Platform)</th>
                    <th>Pro Payout</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th className="text-right">Breakdown</th>
                  </tr>
                </thead>
                <tbody>
                  {payments
                    .filter((p) => methodFilter === 'all' || p.method === methodFilter)
                    .filter(
                      (p) =>
                        p.razorpayPaymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.proName.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((p) => (
                      <tr key={p.id}>
                        <td>
                          <code className="text-code font-bold">{p.razorpayPaymentId}</code>
                          <div className="cell-sub">{p.createdAt}</div>
                        </td>
                        <td>
                          <div className="cell-title font-medium">{p.customerName}</div>
                          <div className="cell-sub text-muted">{p.customerPhone}</div>
                        </td>
                        <td>
                          <div className="cell-title">{p.proName}</div>
                          <div className="cell-sub text-punch-orange font-medium">Verified Pro</div>
                        </td>
                        <td>
                          <div className="cell-title">{p.serviceName}</div>
                          <div className="cell-sub">Order #{p.bookingId}</div>
                        </td>
                        <td>
                          <div className="font-bold text-base">₹{p.amount}</div>
                        </td>
                        <td>
                          <div className="font-semibold text-punch-orange">
                            ₹{p.commissionAmount.toFixed(2)}
                          </div>
                        </td>
                        <td>
                          <div className="font-semibold text-emerald">
                            ₹{p.proPayoutAmount.toFixed(2)}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-neutral">{p.method}</span>
                        </td>
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
                        <td className="text-right">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setSelectedPayment(p)}
                            title="Inspect Breakdown"
                          >
                            <Eye size={15} />
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

      {/* SUBTAB 2: REFUND */}
      {activeSubtab === 'refund' && (
        <div className="subtab-content">
          <div className="card mb-6">
            <div className="card-header">
              <div>
                <h3 className="card-title text-red">Customer Refund & Dispute Queue</h3>
                <p className="card-subtitle">
                  Claims submitted for cancellation, pro no-show, or substandard service. Approved refunds are credited directly back to the original UPI/card via Razorpay Refund API.
                </p>
              </div>
              <span className="badge badge-warning">
                {refunds.filter((r) => r.status === 'pending').length} Pending Triage
              </span>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Claim ID & Order</th>
                    <th>Customer</th>
                    <th>Service Booked</th>
                    <th>Amount Claimed</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Processed By</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {refunds.map((ref) => (
                    <tr key={ref.id} className={ref.status === 'pending' ? 'row-pending-alert' : ''}>
                      <td>
                        <code className="text-code font-bold">{ref.id}</code>
                        <div className="cell-sub">Order #{ref.bookingId}</div>
                        <div className="cell-sub text-muted">{ref.requestedAt}</div>
                      </td>
                      <td>
                        <div className="cell-title font-medium">{ref.customerName}</div>
                        <div className="cell-sub">{ref.customerPhone}</div>
                      </td>
                      <td>
                        <div className="cell-title">{ref.serviceName}</div>
                      </td>
                      <td>
                        <div className="font-bold text-base text-red">₹{ref.amount}</div>
                      </td>
                      <td>
                        <div className="font-semibold text-sm">{ref.reason}</div>
                        <div className="cell-sub text-muted line-clamp-1">{ref.notes}</div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            ref.status === 'approved'
                              ? 'badge-success'
                              : ref.status === 'pending'
                              ? 'badge-warning'
                              : 'badge-danger'
                          }`}
                        >
                          {ref.status}
                        </span>
                      </td>
                      <td>
                        {ref.processedBy ? (
                          <div>
                            <div className="cell-title text-sm">{ref.processedBy}</div>
                            <div className="cell-sub text-xs text-muted">{ref.processedAt}</div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted">Awaiting Review</span>
                        )}
                      </td>
                      <td className="text-right">
                        {ref.status === 'pending' ? (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              setReviewingRefund(ref);
                              setRefundRemarks('');
                            }}
                          >
                            Triage Claim
                          </button>
                        ) : (
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setReviewingRefund(ref)}
                          >
                            View Resolution
                          </button>
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

      {/* SUBTAB 3: FAILED TRANSACTION */}
      {activeSubtab === 'failed' && (
        <div className="subtab-content">
          <div className="card mb-6">
            <div className="card-header">
              <div>
                <h3 className="card-title text-zinc-400">Failed & Aborted Transactions Station</h3>
                <p className="card-subtitle">
                  Real-time diagnosis of gateway drops, bank network timeouts, and customer payment drop-offs.
                </p>
              </div>
              <span className="badge badge-danger">
                {failedTransactions.filter((f) => !f.resolved).length} Unresolved Drops
              </span>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Gateway Error Code</th>
                    <th>Error Diagnostic Details</th>
                    <th>Retried</th>
                    <th>Resolved</th>
                    <th className="text-right">Remediation</th>
                  </tr>
                </thead>
                <tbody>
                  {failedTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>
                        <code className="text-code">{tx.razorpayPaymentId || tx.id}</code>
                        <div className="cell-sub">{tx.createdAt}</div>
                      </td>
                      <td>
                        <div className="cell-title font-medium">{tx.customerName}</div>
                        <div className="cell-sub text-muted">{tx.customerPhone}</div>
                      </td>
                      <td>
                        <div className="font-bold text-base">₹{tx.amount}</div>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{tx.method}</span>
                      </td>
                      <td>
                        <span className="badge badge-danger font-mono text-xs">
                          {tx.errorCode}
                        </span>
                      </td>
                      <td>
                        <div className="cell-sub text-muted">{tx.errorMessage}</div>
                      </td>
                      <td>
                        <span className="font-bold">{tx.retryCount} times</span>
                      </td>
                      <td>
                        <span className={`badge ${tx.resolved ? 'badge-success' : 'badge-warning'}`}>
                          {tx.resolved ? 'Resolved' : 'Pending Drop'}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => retryFailedTransaction(tx.id)}
                          title="Resend WhatsApp & SMS Checkout link"
                        >
                          <Send size={13} /> Resend Link
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

      {/* SUBTAB 4: COMMISSION */}
      {activeSubtab === 'commission' && (
        <div className="subtab-content">
          {/* Platform Revenue Commission Tuning */}
          <div className="card mb-6">
            <div className="card-header">
              <div>
                <h3 className="card-title">Category Commission & Take-Rate Control</h3>
                <p className="card-subtitle">
                  PunchX platform service fee percentage automatically deducted upon booking completion before pro payout.
                </p>
              </div>
            </div>

            <div className="commission-rate-editor-grid">
              {categories.map((c) => (
                <div key={c.id} className="commission-box">
                  <div className="commission-box-header">
                    <span className="font-semibold text-sm">{c.name}</span>
                    <span className="font-bold text-punch-orange text-base">
                      {c.commissionRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    className="slider-range mt-2"
                    value={c.commissionRate}
                    onChange={(e) => updateCommissionRate(c.id, parseFloat(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-muted mt-1">
                    <span>Min 5%</span>
                    <span>Max 30%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Settlement Payout Queue */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Professional Bi-Weekly Settlement Ledger</h3>
                <p className="card-subtitle">
                  Automated net payouts calculated after PunchX take-rate. Disbursed directly to verified bank accounts.
                </p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Professional</th>
                    <th>Category</th>
                    <th>Gross Earnings</th>
                    <th>Commission Cut (%)</th>
                    <th>Platform Fee</th>
                    <th>Net Payout Disbursed</th>
                    <th>Bank Account</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((settlement) => (
                    <tr key={settlement.id}>
                      <td>
                        <div className="cell-title font-medium">{settlement.proName}</div>
                        <div className="cell-sub text-muted">{settlement.settlementPeriod}</div>
                      </td>
                      <td>
                        <span className="badge badge-purple">{settlement.serviceCategory}</span>
                      </td>
                      <td>
                        <div className="font-bold">₹{settlement.totalEarnings.toLocaleString('en-IN')}</div>
                      </td>
                      <td>
                        <span className="font-semibold">{settlement.platformCommissionRate}%</span>
                      </td>
                      <td>
                        <div className="font-semibold text-punch-orange">
                          -₹{settlement.commissionDeducted.toFixed(2)}
                        </div>
                      </td>
                      <td>
                        <div className="font-bold text-base text-emerald">
                          ₹{settlement.netPayout.toFixed(2)}
                        </div>
                      </td>
                      <td>
                        <span className="flex items-center gap-1 text-sm font-mono text-muted">
                          <Building size={13} /> {settlement.bankAccountMasked}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            settlement.payoutStatus === 'settled'
                              ? 'badge-success'
                              : settlement.payoutStatus === 'processing'
                              ? 'badge-warning'
                              : 'badge-purple'
                          }`}
                        >
                          {settlement.payoutStatus}
                        </span>
                      </td>
                      <td className="text-right">
                        {settlement.payoutStatus === 'pending' ? (
                          <button
                            className="btn btn-sm btn-emerald"
                            onClick={() => settleCommissionPayout(settlement.id)}
                          >
                            <ArrowUpRight size={14} /> Disburse Payout
                          </button>
                        ) : (
                          <span className="text-xs text-muted">Disbursed</span>
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

      {/* MODAL: Payment Breakdown */}
      {selectedPayment && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPayment(null)}
          title={`Settlement Breakdown: ${selectedPayment.razorpayPaymentId}`}
          subtitle={`Order #${selectedPayment.bookingId} · Processed ${selectedPayment.createdAt}`}
        >
          <div className="payment-receipt-box">
            <div className="receipt-row">
              <span className="text-muted">Customer Name:</span>
              <span className="font-semibold">{selectedPayment.customerName} ({selectedPayment.customerPhone})</span>
            </div>
            <div className="receipt-row">
              <span className="text-muted">Assigned Professional:</span>
              <span className="font-semibold">{selectedPayment.proName}</span>
            </div>
            <div className="receipt-row">
              <span className="text-muted">Service Rendered:</span>
              <span className="font-semibold">{selectedPayment.serviceName}</span>
            </div>
            <div className="receipt-row">
              <span className="text-muted">Payment Rail:</span>
              <span className="badge badge-neutral">{selectedPayment.method}</span>
            </div>

            <hr className="receipt-divider my-3" />

            <div className="receipt-row">
              <span>Customer Gross Paid:</span>
              <span className="font-bold text-lg">₹{selectedPayment.amount.toFixed(2)}</span>
            </div>
            <div className="receipt-row text-punch-orange">
              <span>PunchX Platform Commission:</span>
              <span className="font-bold">-₹{selectedPayment.commissionAmount.toFixed(2)}</span>
            </div>
            <div className="receipt-row text-emerald font-bold text-lg mt-2">
              <span>Net Pro Payout Credited:</span>
              <span>₹{selectedPayment.proPayoutAmount.toFixed(2)}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Review & Triage Refund */}
      {reviewingRefund && (
        <Modal
          isOpen={true}
          onClose={() => setReviewingRefund(null)}
          title={`Refund Claim: #${reviewingRefund.id}`}
          subtitle={`Customer: ${reviewingRefund.customerName} · Booking #${reviewingRefund.bookingId}`}
        >
          <div className="refund-form-body">
            <div className="refund-meta-grid mb-4">
              <div>
                <span className="text-xs text-muted">Claim Reason</span>
                <div className="font-semibold text-red">{reviewingRefund.reason}</div>
              </div>
              <div>
                <span className="text-xs text-muted">Refund Amount</span>
                <div className="font-bold text-lg text-emerald">₹{reviewingRefund.amount}</div>
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label text-xs">Customer Statement:</label>
              <div className="user-quote-box">{reviewingRefund.notes}</div>
            </div>

            {reviewingRefund.status === 'pending' ? (
              <>
                <div className="form-group mb-4">
                  <label className="form-label font-semibold">Admin Resolution Remarks:</label>
                  <input
                    type="text"
                    className="input-text"
                    placeholder="Enter resolution notes (e.g. approved full refund per clause 3.1)..."
                    value={refundRemarks}
                    onChange={(e) => setRefundRemarks(e.target.value)}
                  />
                </div>

                <div className="modal-footer-actions">
                  <button
                    className="btn btn-red"
                    onClick={() => {
                      processRefund(reviewingRefund.id, false, refundRemarks);
                      setReviewingRefund(null);
                    }}
                  >
                    <XCircle size={15} /> Decline Claim
                  </button>
                  <button
                    className="btn btn-emerald"
                    onClick={() => {
                      processRefund(reviewingRefund.id, true, refundRemarks);
                      setReviewingRefund(null);
                    }}
                  >
                    <CheckCircle2 size={15} /> Approve & Issue Refund (Razorpay)
                  </button>
                </div>
              </>
            ) : (
              <div className="resolution-summary-box">
                <div className="font-semibold text-sm">Resolution Status: {reviewingRefund.status.toUpperCase()}</div>
                <div className="text-xs text-muted mt-1">Processed by {reviewingRefund.processedBy} on {reviewingRefund.processedAt}</div>
                <div className="text-sm mt-2 font-medium">{reviewingRefund.adminRemarks}</div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
