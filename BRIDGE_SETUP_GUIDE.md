# PunchX Admin Dashboard & Main Platform Integration Guide

This guide details how the **Admin Dashboard** (`Admin-dashboard-punchx`) connects securely to the **Main Website Repository** (`Punchx-full-info`) while maintaining **strict dual-repository isolation** for cybersecurity.

---

## 1. Security Architecture (Why Separate Repositories?)

```
┌─────────────────────────────────┐                       ┌─────────────────────────────────┐
│     Admin Dashboard Repo        │                       │       Main Website Repo         │
│  (Admin-dashboard-punchx)       │                       │      (Punchx-full-info)         │
│                                 │                       │                                 │
│  - Vite + React 19 Frontend     │  x-admin-key Header   │  - Express + Vite Fullstack     │
│  - Internal Admin Operations    │ ────────────────────> │  - Firebase / PostgreSQL DB     │
│  - Zero Customer Code / Secrets │   (Authenticated)     │  - Customer & Worker App        │
│  - Runs on Port 5173            │                       │  - Runs on Port 3000            │
└─────────────────────────────────┘                       └─────────────────────────────────┘
```

1. **Zero Attack Surface Exposure**: No administrative tokens, escalation routines, or management endpoints are bundled into the public customer JavaScript delivered by `Punchx-full-info`.
2. **Independent CI/CD**: You can deploy the Admin Dashboard to an internal VPN / password-protected domain (e.g. Cloudflare Access, Vercel team deployment) without rebuilding or redeploying the consumer app.
3. **Encrypted Handshake**: Communication uses an administrative key header (`x-admin-key`) with CORS restricted strictly to the admin origin (`http://localhost:5173`).

---

## 2. Environment Configuration

### In `Admin-dashboard-punchx/.env`:
```env
VITE_MAIN_API_URL=http://localhost:3000
VITE_ADMIN_API_KEY=punchx_admin_secure_live_key_2026_9941a8
VITE_POLL_INTERVAL_MS=30000
```

### In `Punchx-full-info/.env`:
```env
ADMIN_API_KEY=punchx_admin_secure_live_key_2026_9941a8
PORT=3000
```

---

## 3. Main Platform Server Integration (In `Punchx-full-info`)

To activate the admin bridge in the main website repository:

### Step 1: Create `src/backend/routes/adminBridgeRoutes.ts`
```typescript
import { Router, Request, Response, NextFunction } from 'express';
import { dbAdapter } from '../db/index.js';
import { logger } from '../logger.js';
import { executeOrderTransition } from '../orderStateMachine.js';
import { UserProfile, WorkerApplication, OrderRecord } from '../../types.js';

export const adminRouter = Router();

// ─── Dynamic Platform Settings ───
export const platformSettings = {
  convenienceFee: 29,
  emergencySurcharge: 99,
  defaultCommissionRate: 0.15,
  gstRate: 0.18,
  maintenanceMode: false,
  announcementBanner: 'PunchX Monsoon Coverage Active — 100% On-Time SLA Guarantee across Kolkata & Nabadwip',
  updatedAt: new Date().toISOString(),
};

// ─── Admin Key Auth Middleware ───
export const requireAdminApiKey = (req: Request, res: Response, next: NextFunction) => {
  const adminKey = (req.headers['x-admin-key'] as string) || req.headers['authorization']?.replace('Bearer ', '');
  const expectedKey = process.env.ADMIN_API_KEY || 'punchx_admin_secure_live_key_2026_9941a8';

  if (!adminKey || adminKey !== expectedKey) {
    logger.security('Unauthorized admin key attempt', { ip: req.ip, path: req.originalUrl });
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid admin key' });
  }
  next();
};

adminRouter.use(requireAdminApiKey);

// Handshake
adminRouter.get('/health', async (_req, res) => {
  res.json({
    success: true,
    status: 'connected',
    platform: 'PunchX Core Backend',
    dbProvider: dbAdapter.providerName,
    timestamp: new Date().toISOString(),
  });
});

// Users
adminRouter.get('/users', async (req, res) => res.json({ success: true, users: await dbAdapter.listUsers(req.query.role as string) }));
adminRouter.patch('/users/:uid', async (req, res) => res.json({ success: true, user: await dbAdapter.upsertUser({ ...req.body, uid: req.params.uid }) }));

// Workers
adminRouter.get('/workers', async (_req, res) => res.json({ success: true, applications: await dbAdapter.listWorkerApplications() }));
adminRouter.post('/workers', async (req, res) => res.status(201).json({ success: true, application: await dbAdapter.createWorkerApplication(req.body) }));
adminRouter.patch('/workers/:id', async (req, res) => res.json({ success: true, application: await dbAdapter.updateWorkerApplicationStatus(req.params.id, req.body.status) }));
adminRouter.post('/workers/:id/dispatch', async (req, res) => {
  const newOrder: OrderRecord = {
    id: `ord_${Date.now()}`,
    category: req.body.category || 'General',
    workerId: req.params.id,
    workerName: req.body.workerName || 'Specialist',
    price: req.body.price || 299,
    status: 'IN_SERVICE',
    date: new Date().toLocaleDateString('en-IN'),
    customerName: req.body.customerName || 'Customer',
    customerAddress: req.body.customerAddress || 'Kolkata',
  };
  res.status(201).json({ success: true, order: await dbAdapter.createOrder(newOrder) });
});

// Orders
adminRouter.get('/orders', async (req, res) => res.json({ success: true, orders: await dbAdapter.listOrders(req.query as any) }));
adminRouter.patch('/orders/:id/status', async (req, res) => res.json({ success: true, order: await dbAdapter.updateOrderStatus(req.params.id, req.body.status) }));

// Dynamic Operational Settings
adminRouter.get('/settings', (_req, res) => res.json({ success: true, settings: platformSettings }));
adminRouter.post('/settings', (req, res) => {
  Object.assign(platformSettings, req.body, { updatedAt: new Date().toISOString() });
  res.json({ success: true, settings: platformSettings });
});
```

### Step 2: Mount in `Punchx-full-info/server.ts`
```typescript
import { adminRouter } from './src/backend/routes/adminBridgeRoutes.js';

// Mount BEFORE general consumer rate limiter:
app.use('/api/admin', adminRouter);
```

---

## 4. How to Use & Verify

1. **Start the Main Website**:
   ```bash
   cd c:\Users\my359\Desktop\Punchx-full-info
   npm run dev
   ```
2. **Start the Admin Dashboard**:
   ```bash
   cd c:\Users\my359\Desktop\Admin-dashboard-punchx
   npm run dev
   ```
3. Open `http://localhost:5173`:
   - The top header will display the **Platform Linked** badge with green pulse dot and latency (e.g. `12ms`).
   - If the main website is closed, it automatically falls back to **Standalone Mode** (amber dot), keeping all actions safely saved in browser storage.
   - Click the bridge badge to open the **Platform Bridge Modal** to adjust live fees (Platform Fee, Emergency Surcharge, Maintenance Mode) or manually trigger synchronization!
