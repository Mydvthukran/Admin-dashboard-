# PunchX Admin Dashboard & Command Center

Official administrative command center for the **[PunchX](https://github.com/businressguy-netizen/Punchx-full-info)** hyperlocal services marketplace. Maintained as a private, security-isolated repository separated from consumer-facing repositories.

---

## Architecture & Menu Structure

The admin dashboard directly implements the operational blueprint:

### 1. User Management
- **i. View**: Data table of registered Consumers and Service Professionals. Filter by role, account status, and operational zones (Kolkata, Nabadwip, Howrah). Search by name, phone, or email. Inspect comprehensive user profiles, booking histories, ratings, and wallet balances.
- **ii. Block**: Trust & Safety enforcement center. Active suspension roster with documented ban reasons, timestamps, and issuing administrator logs. Instant ban initiation and account restoration.
- **iii. Verify**: Dedicated Pro KYC and credentialing station. Document inspection viewer for Aadhaar, Voter ID, Trade Licenses, Skill Certificates, and verified selfies with approval/rejection workflows.
- **iv. Manage**: Account tier allocation (Bronze, Silver, Gold, Platinum), wallet balance adjustments, and profile data editor.

### Worker Management (Workforce & Field Dispatch)
- **i. Directory & Roster**: Centralized field technician directory. Filter by trade (AC & Refrigeration, Electrical, Plumbing, Cleaning, Carpentry, Painting, Appliance, Grooming), duty status, operating zone, and shift. Inspect worker dossiers, vehicle types, ratings, and emergency contacts.
- **ii. Live Dispatch & Attendance**: Real-time on-ground operational command. Monitor ongoing field tasks, track technician status (On Duty, En Route, On Site), and trigger 1-click job allocations to nearby available workers.
- **iii. Skills & Safety Gear**: Pre-deployment safety equipment audits (insulated tools, safety harness, sanitized uniform, ID badge), trade skill tiers (Apprentice, Certified Pro, Master Specialist), police clearances, and complete new worker onboarding.
- **iv. Performance & Payouts**: Daily task earnings tracking, completion % and on-time arrival SLA monitoring, and instant direct IMPS wage disbursal with payment reference logging.

### 2. Content Management
- **i. Banner**: Promotional feed and mobile app hero carousel management. Includes an **interactive live mobile screen simulator** to preview banners as seen on the PunchX consumer app, with placement controls and click metrics.
- **ii. Content**: Real-time legal policy and terms editor (Terms of Service, Privacy Policy, Safety Guidelines, FAQs) with live timestamp updates.
- **iii. Listing**: 40+ PunchX services catalog (Split AC Jet Cleaning, Fan Installation, 2BHK Deep Cleaning, RO Purifier Service, Beauty & Grooming) with base rates (₹), estimated durations, and warranty periods.
- **iv. Categories**: 40+ main category grouping engine with platform take-rate percentage tuning and circular GPS geofence zone allocations.

### 3. Payment and Transaction
- **i. Payment (Done)**: Successful Razorpay gateway settlements log with Payment IDs (`pay_xxx`), Order IDs, customer/pro linkage, gross amounts, platform commission deductions, and one-click CSV export.
- **ii. Refund**: Customer dispute and cancellation refund queue. Review claim reasons (pro no-show, substandard work, cancellation within policy) and process instant refunds via simulated Razorpay refund API.
- **iii. Failed Transaction**: Real-time diagnosis of gateway drops, bank timeouts (`PAYMENT_TIMEOUT`, `CARD_DECLINED`, `BANK_GATEWAY_DOWN`), with retry tracking and SMS/WhatsApp payment link resend trigger.
- **iv. Commission**: Marketplace revenue engine. Tracks gross GMV vs retained platform fees (avg 14.8%), bi-weekly pro settlement disbursements, and dynamic category commission sliders.

### 4. Important Updates & Marketing
- **i. Important Update**: Pinned system and weather alerts (e.g. Monsoon emergency protocols, holiday operating schedules, Razorpay gateway maintenance).
- **ii. Offers**: Promo code and coupon campaign builder (`PUNCHXFIRST`, `KOLKATA50`, `CLEANFEST`, `NABADWIP100`) with percentage/flat discounts, minimum order value thresholds, and usage meter tracking.
- **iii. Announcements**: Real-time multi-channel broadcast center delivering push notifications and alerts to pros and customers in active geofenced sectors.

### 5. Business Reports
- Real-time marketplace KPIs: Gross Merchandise Value (GMV), net platform margins, order fulfillment rates (96.4%), and average order values.
- Visual monthly revenue trajectory charts and category volume contribution breakdowns.
- One-click executive report downloads (CSV export & printable audit certificates).

### 6. Roles & Permissions (RBAC)
- Role-Based Access Control matrix for Super Admin, Operations Manager, Finance & Payouts Lead, and Customer Support Lead.
- Granular permission toggles for user management, KYC verification, content editing, refund processing, and role administration.
- Authorized operator directory and immutable security audit log recording every administrative action with timestamp and IP address.

---

## Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Icons**: Lucide React
- **Design System**: Tailored dark glassmorphic UI with PunchX signature accents (`#ff6b00`, `#10b981`, `#0ea5e9`, `#f59e0b`)
- **State & Storage**: React Context with LocalStorage persistence

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/Mydvthukran/Admin-dashboard-punchx.git
cd Admin-dashboard-punchx

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Production Build
```bash
npm run build
```
Build output is generated into the `dist/` directory.
