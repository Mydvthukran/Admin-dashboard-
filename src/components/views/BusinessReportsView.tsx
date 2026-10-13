import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  TrendingUp,
  Download,
  Calendar,
  Printer,
  CheckCircle2,
  PieChart,
  MapPin,
  ShieldCheck
} from 'lucide-react';

export const BusinessReportsView: React.FC = () => {
  const { payments, users, addToast } = useAdmin();
  const [reportPeriod, setReportPeriod] = useState<'weekly' | 'monthly' | 'quarterly'>('monthly');

  const completedPayments = payments.filter((p) => p.status === 'completed');
  const grossVolume = completedPayments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCommission = completedPayments.reduce((acc, curr) => acc + curr.commissionAmount, 0);

  const handleDownloadFullReport = () => {
    const csvContent =
      'Metric,Value\n' +
      `"Report Generated","${new Date().toISOString()}"\n` +
      `"Platform Cluster","PunchX Kolkata & West Bengal Cluster"\n` +
      `"Gross Merchandise Value (GMV)","₹${grossVolume}"\n` +
      `"Net Commission Retained","₹${totalCommission.toFixed(2)}"\n` +
      `"Total Registered Users","${users.length}"\n` +
      `"Active Service Pros","${users.filter((u) => u.role === 'professional').length}"\n` +
      `"Fulfillment Completion Rate","96.4%"\n` +
      `"Customer CSAT Score","4.82/5.0"\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `punchx_business_report_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Report Exported', 'Business analytics report downloaded as CSV.', 'success');
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="view-container">
      {/* View Header */}
      <div className="view-header">
        <div>
          <div className="section-supertitle">SECTION 5 (FROM NOTES)</div>
          <h1 className="view-title">Business Reports & Marketplace Analytics</h1>
          <p className="view-subtitle">
            Executive revenue breakdown, category performance metrics, geographic demand distribution, and pro retention.
          </p>
        </div>

        <div className="view-header-actions">
          <button className="btn btn-secondary" onClick={handlePrintReport}>
            <Printer size={16} /> Print / Save PDF
          </button>
          <button className="btn btn-primary" onClick={handleDownloadFullReport}>
            <Download size={16} /> Download Comprehensive CSV
          </button>
        </div>
      </div>

      {/* Period Filter Bar */}
      <div className="filter-bar mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-muted" />
          <span className="text-sm font-semibold">Reporting Timeframe:</span>
          <div className="subtab-pills">
            <button
              className={`subtab-pill ${reportPeriod === 'weekly' ? 'active' : ''}`}
              onClick={() => setReportPeriod('weekly')}
            >
              Current Week
            </button>
            <button
              className={`subtab-pill ${reportPeriod === 'monthly' ? 'active' : ''}`}
              onClick={() => setReportPeriod('monthly')}
            >
              Month to Date (April 2026)
            </button>
            <button
              className={`subtab-pill ${reportPeriod === 'quarterly' ? 'active' : ''}`}
              onClick={() => setReportPeriod('quarterly')}
            >
              Q1-Q2 Overview
            </button>
          </div>
        </div>
      </div>

      {/* Key Executive KPI Cards */}
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <span className="stat-label">Gross Merchandise Value (GMV)</span>
          <div className="stat-value text-emerald">₹{grossVolume.toLocaleString('en-IN')}</div>
          <div className="stat-footer text-emerald">
            <TrendingUp size={14} /> +24.6% QoQ Growth
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-label">Net Platform Margin</span>
          <div className="stat-value text-punch-orange">₹{Math.round(totalCommission).toLocaleString('en-IN')}</div>
          <div className="stat-footer text-muted">Effective Take-Rate: 14.8%</div>
        </div>

        <div className="stat-card">
          <span className="stat-label">Order Fulfillment Success</span>
          <div className="stat-value">96.4%</div>
          <div className="stat-footer text-emerald">
            <CheckCircle2 size={14} /> Under 3.6% cancellation rate
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-label">Average Order Value (AOV)</span>
          <div className="stat-value">₹984</div>
          <div className="stat-footer text-muted">+₹142 since AC Jet Service launch</div>
        </div>
      </div>

      {/* Charts & Distributions */}
      <div className="dashboard-grid-layout mb-6">
        {/* Monthly Revenue Trend Visual Bar Graph */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Monthly Platform Revenue Trend</h3>
              <p className="card-subtitle">Gross marketplace billing (Jan - Apr 2026)</p>
            </div>
            <span className="badge badge-success">+142% vs Q4 2025</span>
          </div>

          <div className="report-bar-chart">
            {[
              { month: 'Jan 2026', gmv: '₹1.12L', height: '42%' },
              { month: 'Feb 2026', gmv: '₹1.48L', height: '58%' },
              { month: 'Mar 2026', gmv: '₹2.05L', height: '78%' },
              { month: 'Apr 2026 (MTD)', gmv: '₹2.82L', height: '100%' }
            ].map((col) => (
              <div key={col.month} className="report-col-item">
                <div className="report-col-val">{col.gmv}</div>
                <div className="report-col-track">
                  <div className="report-col-fill" style={{ height: col.height }}></div>
                </div>
                <span className="report-col-label">{col.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Share Distribution */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Category Revenue Contribution</h3>
              <p className="card-subtitle">Share of total completed bookings</p>
            </div>
            <PieChart size={18} className="text-muted" />
          </div>

          <div className="category-share-list">
            {[
              { name: 'Repairs & Installations (AC, RO, Appliances)', percent: 38, color: '#ff6b00' },
              { name: 'Cleaning & Home Care (2BHK, Sofa, Sanitisation)', percent: 26, color: '#10b981' },
              { name: 'Beauty & Personal Care (At-Home Salon, Spa)', percent: 18, color: '#6366f1' },
              { name: 'Electrical & Plumbing (Fans, Wiring, Pipes)', percent: 12, color: '#0ea5e9' },
              { name: 'Events, Moving & Other Services', percent: 6, color: '#94a3b8' }
            ].map((cat) => (
              <div key={cat.name} className="share-row">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-foreground">{cat.name}</span>
                  <span className="font-bold">{cat.percent}%</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geofence Demand Breakdown & Operations Seal */}
      <div className="dashboard-grid-layout">
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Geofence Performance & Arrival Times</h3>
              <p className="card-subtitle">Active circular operational zones</p>
            </div>
          </div>

          <div className="zone-performance-table">
            <div className="zone-perf-row">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-punch-orange" />
                <div>
                  <div className="font-semibold text-sm">Kolkata Municipal Cluster (8km)</div>
                  <div className="text-xs text-muted">Salt Lake, New Town, Ballygunge, Park Street, Behala</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">68% of Total GMV</div>
                <div className="text-xs text-emerald">Avg Arrival: 29 mins</div>
              </div>
            </div>

            <div className="zone-perf-row mt-3">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue" />
                <div>
                  <div className="font-semibold text-sm">Nabadwip Heritage Cluster (8km)</div>
                  <div className="text-xs text-muted">Nabadwip Dham, Mayapur corridor, Nadia District</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">32% of Total GMV</div>
                <div className="text-xs text-emerald">Avg Arrival: 42 mins</div>
              </div>
            </div>
          </div>
        </div>

        {/* Official PunchX Seal & Certificate Card */}
        <div className="card printable-certificate-card">
          <div className="cert-header">
            <ShieldCheck size={28} className="text-punch-orange" />
            <div>
              <h4 className="font-bold text-base">PunchX Operational Audit Verification</h4>
              <p className="text-xs text-muted">Digital Marketplace Security & Compliance</p>
            </div>
          </div>
          <p className="cert-body text-xs text-muted mt-3">
            This executive summary certifies that all transaction settlements, pro KYC validations, Razorpay tokenizations, and RBI payment aggregator mandates have complied with PunchX compliance guidelines.
          </p>
          <div className="cert-signature-row mt-4 flex justify-between items-center text-xs">
            <div>
              <span className="text-muted block">Cluster Ops Director:</span>
              <span className="font-semibold text-foreground">Amitava Sen</span>
            </div>
            <div className="cert-stamp">PUNCHX VERIFIED</div>
          </div>
        </div>
      </div>
    </div>
  );
};
