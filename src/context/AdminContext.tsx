import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  User,
  KYCDocument,
  Banner,
  ServiceCategory,
  ServiceListing,
  StaticContentPage,
  FAQItem,
  PaymentTransaction,
  RefundRequest,
  FailedTransaction,
  CommissionSettlement,
  OfferCoupon,
  Announcement,
  AdminRole,
  AdminUser,
  AuditLog,
  ToastMessage,
  Worker,
  WorkerStatus,
  FieldJob
} from '../types';
import {
  mainPlatformApi,
  getStoredApiConfig,
  saveApiConfig,
  type ApiConfig,
  type ConnectionHealth,
  type DynamicPlatformSettings
} from '../services/apiService';
import {
  INITIAL_USERS,
  INITIAL_KYC_DOCS,
  INITIAL_BANNERS,
  INITIAL_CATEGORIES,
  INITIAL_LISTINGS,
  INITIAL_STATIC_PAGES,
  INITIAL_FAQS,
  INITIAL_PAYMENTS,
  INITIAL_REFUNDS,
  INITIAL_FAILED_TRANSACTIONS,
  INITIAL_COMMISSIONS,
  INITIAL_OFFERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ROLES,
  INITIAL_ADMINS,
  INITIAL_AUDIT_LOGS,
  INITIAL_WORKERS
} from '../data/initialData';

interface AdminContextType {
  users: User[];
  kycDocs: KYCDocument[];
  banners: Banner[];
  categories: ServiceCategory[];
  listings: ServiceListing[];
  staticPages: StaticContentPage[];
  faqs: FAQItem[];
  payments: PaymentTransaction[];
  refunds: RefundRequest[];
  failedTransactions: FailedTransaction[];
  commissions: CommissionSettlement[];
  offers: OfferCoupon[];
  announcements: Announcement[];
  roles: AdminRole[];
  admins: AdminUser[];
  auditLogs: AuditLog[];
  workers: Worker[];
  currentAdmin: AdminUser;
  toasts: ToastMessage[];
  activeTab: string;
  activeSubtab: string;
  searchQuery: string;

  setActiveTab: (tab: string, subtab?: string) => void;
  setActiveSubtab: (subtab: string) => void;
  setSearchQuery: (query: string) => void;
  setCurrentAdmin: (admin: AdminUser) => void;
  addToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Actions
  blockUser: (userId: string, reason: string) => void;
  unblockUser: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  verifyKYC: (docId: string, approve: boolean, reason?: string) => void;

  // Worker Management Actions
  addWorker: (worker: Omit<Worker, 'id' | 'totalJobsDone' | 'completionRate' | 'onTimeRate' | 'todayEarnings' | 'pendingPayout'>) => void;
  updateWorker: (id: string, updates: Partial<Worker>) => void;
  deleteWorker: (id: string) => void;
  setWorkerStatus: (id: string, status: WorkerStatus, reason?: string) => void;
  dispatchJobToWorker: (workerId: string, jobData: Omit<FieldJob, 'id'>) => void;
  completeWorkerJob: (workerId: string) => void;
  cancelWorkerJob: (workerId: string, reason?: string) => void;
  settleWorkerPayout: (workerId: string, amount: number) => void;
  verifyWorkerCompliance: (workerId: string, checkType: 'safetyGear' | 'police' | 'aadhaar', verified: boolean) => void;

  addBanner: (banner: Omit<Banner, 'id' | 'clicks'>) => void;
  updateBanner: (id: string, updates: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;

  addCategory: (category: Omit<ServiceCategory, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<ServiceCategory>) => void;

  addListing: (listing: Omit<ServiceListing, 'id' | 'reviewsCount' | 'rating'>) => void;
  updateListing: (id: string, updates: Partial<ServiceListing>) => void;
  deleteListing: (id: string) => void;

  updateStaticPage: (slug: string, sections: { title: string; content: string }[]) => void;

  processRefund: (refundId: string, approve: boolean, remarks?: string) => void;
  retryFailedTransaction: (txId: string) => void;

  updateCommissionRate: (categoryId: string, newRate: number) => void;
  settleCommissionPayout: (settlementId: string) => void;

  addOffer: (offer: Omit<OfferCoupon, 'id' | 'usageCount'>) => void;
  toggleOffer: (id: string) => void;
  deleteOffer: (id: string) => void;

  sendAnnouncement: (announcement: Omit<Announcement, 'id' | 'sentAt' | 'sentBy' | 'reachCount' | 'readCount'>) => void;

  updateRolePermissions: (roleId: string, permissions: AdminRole['permissions']) => void;
  addAdmin: (admin: Omit<AdminUser, 'id' | 'lastActive'>) => void;
  resetToDefaults: () => void;

  // Platform Bridge & Synchronization
  connectionHealth: ConnectionHealth;
  isSyncing: boolean;
  platformSettings: DynamicPlatformSettings;
  apiBridgeConfig: ApiConfig;
  testConnection: () => Promise<ConnectionHealth>;
  syncWithMainPlatform: () => Promise<void>;
  updatePlatformSettings: (settings: Partial<DynamicPlatformSettings>) => Promise<void>;
  saveApiBridgeConfig: (config: ApiConfig) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const STORAGE_PREFIX = 'punchx_admin_';

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => getStored('users', INITIAL_USERS));
  const [kycDocs, setKycDocs] = useState<KYCDocument[]>(() => getStored('kyc', INITIAL_KYC_DOCS));
  const [banners, setBanners] = useState<Banner[]>(() => getStored('banners', INITIAL_BANNERS));
  const [categories, setCategories] = useState<ServiceCategory[]>(() => getStored('categories', INITIAL_CATEGORIES));
  const [listings, setListings] = useState<ServiceListing[]>(() => getStored('listings', INITIAL_LISTINGS));
  const [staticPages, setStaticPages] = useState<StaticContentPage[]>(() => getStored('pages', INITIAL_STATIC_PAGES));
  const [faqs] = useState<FAQItem[]>(() => getStored('faqs', INITIAL_FAQS));
  const [payments, setPayments] = useState<PaymentTransaction[]>(() => getStored('payments', INITIAL_PAYMENTS));
  const [refunds, setRefunds] = useState<RefundRequest[]>(() => getStored('refunds', INITIAL_REFUNDS));
  const [failedTransactions, setFailedTransactions] = useState<FailedTransaction[]>(() => getStored('failed_tx', INITIAL_FAILED_TRANSACTIONS));
  const [commissions, setCommissions] = useState<CommissionSettlement[]>(() => getStored('commissions', INITIAL_COMMISSIONS));
  const [offers, setOffers] = useState<OfferCoupon[]>(() => getStored('offers', INITIAL_OFFERS));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => getStored('announcements', INITIAL_ANNOUNCEMENTS));
  const [roles, setRoles] = useState<AdminRole[]>(() => getStored('roles', INITIAL_ROLES));
  const [admins, setAdmins] = useState<AdminUser[]>(() => getStored('admins', INITIAL_ADMINS));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getStored('logs', INITIAL_AUDIT_LOGS));
  const [workers, setWorkers] = useState<Worker[]>(() => getStored('workers', INITIAL_WORKERS));
  const [apiBridgeConfig, setApiBridgeConfigState] = useState<ApiConfig>(getStoredApiConfig);
  const [connectionHealth, setConnectionHealth] = useState<ConnectionHealth>({
    connected: false,
    status: 'checking',
    latencyMs: 0,
    lastChecked: null,
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [platformSettings, setPlatformSettingsState] = useState<DynamicPlatformSettings>(() =>
    getStored('platform_settings', {
      convenienceFee: 29,
      emergencySurcharge: 99,
      defaultCommissionRate: 0.15,
      gstRate: 0.18,
      maintenanceMode: false,
      maintenanceNotice: 'Scheduled system maintenance in progress. Services will resume shortly.',
      announcementBanner: 'PunchX Monsoon Coverage Active — 100% On-Time SLA Guarantee across Kolkata & Nabadwip',
      activeGeofences: [
        { id: 'geo_kolkata', name: 'Kolkata Metropolitan & EM Bypass', radiusKm: 8, active: true },
        { id: 'geo_nabadwip', name: 'Nabadwip Circular Sector', radiusKm: 8, active: true },
        { id: 'geo_howrah', name: 'Howrah Central Hub', radiusKm: 6, active: true },
      ],
      updatedAt: new Date().toISOString(),
    })
  );

  const [currentAdmin, setCurrentAdminState] = useState<AdminUser>(INITIAL_ADMINS[0]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeTab, setActiveTabState] = useState<string>('overview');
  const [activeSubtab, setActiveSubtab] = useState<string>('view');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync to localStorage
  useEffect(() => { setStored('users', users); }, [users]);
  useEffect(() => { setStored('kyc', kycDocs); }, [kycDocs]);
  useEffect(() => { setStored('banners', banners); }, [banners]);
  useEffect(() => { setStored('categories', categories); }, [categories]);
  useEffect(() => { setStored('listings', listings); }, [listings]);
  useEffect(() => { setStored('pages', staticPages); }, [staticPages]);
  useEffect(() => { setStored('payments', payments); }, [payments]);
  useEffect(() => { setStored('refunds', refunds); }, [refunds]);
  useEffect(() => { setStored('failed_tx', failedTransactions); }, [failedTransactions]);
  useEffect(() => { setStored('commissions', commissions); }, [commissions]);
  useEffect(() => { setStored('offers', offers); }, [offers]);
  useEffect(() => { setStored('announcements', announcements); }, [announcements]);
  useEffect(() => { setStored('roles', roles); }, [roles]);
  useEffect(() => { setStored('admins', admins); }, [admins]);
  useEffect(() => { setStored('logs', auditLogs); }, [auditLogs]);
  useEffect(() => { setStored('workers', workers); }, [workers]);
  useEffect(() => { setStored('platform_settings', platformSettings); }, [platformSettings]);

  const addToast = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logAction = (action: string, entityType: AuditLog['entityType'], entityId: string, details: string) => {
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      adminName: currentAdmin.name,
      adminEmail: currentAdmin.email,
      action,
      entityType,
      entityId,
      details,
      ipAddress: '103.212.144.' + (Math.floor(Math.random() * 80) + 10)
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const saveApiBridgeConfig = (config: ApiConfig) => {
    saveApiConfig(config);
    setApiBridgeConfigState(config);
    mainPlatformApi.updateConfig(config);
  };

  const testConnection = async (): Promise<ConnectionHealth> => {
    const health = await mainPlatformApi.probeHealth();
    setConnectionHealth(health);
    return health;
  };

  const syncWithMainPlatform = async () => {
    setIsSyncing(true);
    addToast('Sync Started', 'Connecting to PunchX main platform backend...', 'info');

    try {
      const health = await testConnection();
      if (!health.connected) {
        addToast(
          'Standalone Mode Active',
          `Main platform at ${apiBridgeConfig.baseUrl} is not reachable. All changes remain saved in local storage.`,
          'warning'
        );
        setIsSyncing(false);
        return;
      }

      // 1. Fetch remote users
      const usersRes = await mainPlatformApi.fetchUsers();
      if (usersRes.success && usersRes.data?.users && usersRes.data.users.length > 0) {
        const remoteUsers: User[] = usersRes.data.users.map((ru: any) => ({
          id: ru.uid || ru.id,
          name: ru.name || 'PunchX User',
          email: ru.email || '',
          phone: ru.phone || '',
          role: ru.role === 'worker' ? 'professional' : 'customer',
          status: ru.status === 'SUSPENDED' ? 'blocked' : 'active',
          location: ru.address || ru.area || 'Salt Lake, Kolkata',
          city: (ru.area?.includes('Nabadwip') ? 'Nabadwip' : ru.area?.includes('Howrah') ? 'Howrah' : 'Kolkata') as 'Kolkata' | 'Nabadwip' | 'Howrah' | 'Other',
          joinedDate: ru.createdAt ? ru.createdAt.split('T')[0] : '2026-01-10',
          totalBookings: ru.workerCompletedJobs || 0,
          walletBalance: 0,
          serviceCategory: ru.workerSkill || 'General',
          rating: ru.workerRating || 4.8,
          avatarUrl: ru.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        }));

        setUsers((prev) => {
          const map = new Map<string, User>();
          prev.forEach((u) => map.set(u.id, u));
          remoteUsers.forEach((ru) => map.set(ru.id, { ...map.get(ru.id), ...ru }));
          return Array.from(map.values());
        });
      }

      // 2. Fetch remote workers
      const workersRes = await mainPlatformApi.fetchWorkers();
      if (workersRes.success && workersRes.data?.applications) {
        const remoteWorkers: Worker[] = workersRes.data.applications.map((app: any) => ({
          id: app.id || app.uid,
          name: app.legalName || app.name || 'Specialist',
          phone: app.phone || '+91 98765 43210',
          email: app.email || '',
          trade: (app.skill as any) || 'Electrical & Wiring',
          skillLevel: 'Certified Pro',
          zone: app.area?.includes('Nabadwip') ? 'Nabadwip Sector' : app.area?.includes('Howrah') ? 'Howrah Central' : 'Kolkata Metropolitan',
          city: (app.area?.includes('Nabadwip') ? 'Nabadwip' : app.area?.includes('Howrah') ? 'Howrah' : 'Kolkata') as 'Kolkata' | 'Nabadwip' | 'Howrah',
          shift: 'Morning (08:00 - 14:00)',
          status: (app.status === 'APPROVED' ? 'on_duty' : app.status === 'REJECTED' ? 'suspended' : 'off_duty') as any,
          rating: 4.8,
          totalJobsDone: 12,
          completionRate: 98,
          onTimeRate: 95,
          todayEarnings: 0,
          pendingPayout: 0,
          safetyGearVerified: true,
          policeVerificationDone: true,
          aadhaarVerified: true,
          emergencyContact: {
            name: 'Emergency Dispatch Desk',
            phone: '+91 98000 00000',
            relation: 'Company Dispatch',
          },
          joinedDate: app.appliedAt ? app.appliedAt.split('T')[0] : '2026-02-01',
          avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&q=80',
        }));

        setWorkers((prev) => {
          const map = new Map<string, Worker>();
          prev.forEach((w) => map.set(w.id, w));
          remoteWorkers.forEach((rw) => map.set(rw.id, { ...map.get(rw.id), ...rw }));
          return Array.from(map.values());
        });
      }

      // 3. Fetch remote platform settings
      const settingsRes = await mainPlatformApi.fetchSettings();
      if (settingsRes.success && settingsRes.data?.settings) {
        setPlatformSettingsState(settingsRes.data.settings);
      }

      logAction('PLATFORM_SYNCED', 'System', 'main_api', `Reconciled local state with main platform backend (${health.serverInfo?.platform || 'Express Engine'})`);
      addToast('Sync Complete', `Synchronized with main website backend (${health.latencyMs}ms latency).`, 'success');
    } catch (err: any) {
      addToast('Sync Notice', `Sync encountered an issue: ${err.message}. Local state preserved.`, 'warning');
    } finally {
      setIsSyncing(false);
    }
  };

  const updatePlatformSettings = async (updates: Partial<DynamicPlatformSettings>) => {
    const updated = {
      ...platformSettings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setPlatformSettingsState(updated);
    logAction('PLATFORM_SETTINGS_CHANGED', 'System', 'platform_config', `Updated fees and platform parameters: convenienceFee=₹${updated.convenienceFee}, surge=₹${updated.emergencySurcharge}`);
    
    if (connectionHealth.connected) {
      try {
        const res = await mainPlatformApi.updateSettings(updates);
        if (res.success) {
          addToast('Platform Settings Pushed', 'Updated fees and settings live on main PunchX website!', 'success');
          return;
        }
      } catch {
        // fallback
      }
    }
    addToast('Settings Saved Locally', 'Changes saved in admin console. Will sync when main platform is online.', 'info');
  };

  useEffect(() => {
    testConnection();
    const interval = setInterval(() => {
      testConnection();
    }, 30000);
    return () => clearInterval(interval);
  }, [apiBridgeConfig.baseUrl]);

  const setActiveTab = (tab: string, subtab?: string) => {
    setActiveTabState(tab);
    if (subtab) {
      setActiveSubtab(subtab);
    } else {
      // Default subtabs for main categories
      if (tab === 'users') setActiveSubtab('view');
      else if (tab === 'workers') setActiveSubtab('directory');
      else if (tab === 'content') setActiveSubtab('banner');
      else if (tab === 'payments') setActiveSubtab('done');
      else if (tab === 'updates') setActiveSubtab('updates');
      else if (tab === 'reports') setActiveSubtab('overview');
      else if (tab === 'roles') setActiveSubtab('matrix');
      else setActiveSubtab('view');
    }
  };

  const setCurrentAdmin = (admin: AdminUser) => {
    setCurrentAdminState(admin);
    addToast('Admin Context Switched', `Active session as ${admin.name} (${admin.roleName})`, 'info');
  };

  // 1. User Management Actions
  const blockUser = (userId: string, reason: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: 'blocked',
            blockReason: reason,
            blockedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            blockedBy: `${currentAdmin.name} (${currentAdmin.roleName})`
          };
        }
        return u;
      })
    );
    const target = users.find((u) => u.id === userId);
    logAction('USER_BLOCKED', 'User', userId, `Suspended ${target?.name} (${target?.role}): ${reason}`);
    addToast('User Blocked', `${target?.name || 'User'} has been suspended from PunchX.`, 'warning');

    if (connectionHealth.connected) {
      mainPlatformApi.setUserBlockedStatus(userId, true, reason).then((res) => {
        if (res.success) {
          addToast('Main Platform Synced', `Suspension updated on live website database for ${target?.name || userId}.`, 'info');
        }
      }).catch(() => {});
    }
  };

  const unblockUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: 'active',
            blockReason: undefined,
            blockedAt: undefined,
            blockedBy: undefined
          };
        }
        return u;
      })
    );
    const target = users.find((u) => u.id === userId);
    logAction('USER_UNBLOCKED', 'User', userId, `Restored account access for ${target?.name}`);
    addToast('User Unblocked', `${target?.name || 'User'} access has been restored.`, 'success');

    if (connectionHealth.connected) {
      mainPlatformApi.setUserBlockedStatus(userId, false).then((res) => {
        if (res.success) {
          addToast('Main Platform Synced', `Account restored on live website database for ${target?.name || userId}.`, 'info');
        }
      }).catch(() => {});
    }
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updates } : u)));
    logAction('USER_UPDATED', 'User', userId, `Updated details for ${userId}`);
    addToast('User Updated', 'Account details saved successfully.');

    if (connectionHealth.connected) {
      mainPlatformApi.updateUser(userId, updates).catch(() => {});
    }
  };

  const verifyKYC = (docId: string, approve: boolean, reason?: string) => {
    const doc = kycDocs.find((d) => d.id === docId);
    if (!doc) return;

    setKycDocs((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          return {
            ...d,
            status: approve ? 'verified' : 'rejected',
            reviewedBy: currentAdmin.name,
            reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            rejectionReason: approve ? undefined : reason
          };
        }
        return d;
      })
    );

    // If approved, update user's account status
    if (approve) {
      setUsers((prev) =>
        prev.map((u) => (u.id === doc.userId ? { ...u, status: 'active', rating: u.rating || 5.0 } : u))
      );
      logAction('KYC_VERIFIED', 'KYC', docId, `Approved credentials for professional ${doc.userName} (${doc.serviceCategory})`);
      addToast('KYC Approved', `${doc.userName} is now a PunchX Verified Professional!`, 'success');
    } else {
      logAction('KYC_REJECTED', 'KYC', docId, `Rejected verification for ${doc.userName}: ${reason}`);
      addToast('KYC Rejected', `Verification rejected. Notification sent to ${doc.userName}.`, 'error');
    }
  };

  // 2. Content Management Actions
  const addBanner = (bannerData: Omit<Banner, 'id' | 'clicks'>) => {
    const newBanner: Banner = {
      ...bannerData,
      id: 'ban_' + Date.now(),
      clicks: 0
    };
    setBanners((prev) => [newBanner, ...prev]);
    logAction('BANNER_CREATED', 'Content', newBanner.id, `Created banner: ${newBanner.title}`);
    addToast('Banner Published', `"${newBanner.title}" is now active in promotional feed.`);
  };

  const updateBanner = (id: string, updates: Partial<Banner>) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    logAction('BANNER_UPDATED', 'Content', id, `Updated banner properties for ${id}`);
    addToast('Banner Updated', 'Promotional banner updated successfully.');
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    logAction('BANNER_DELETED', 'Content', id, `Removed promotional banner ${id}`);
    addToast('Banner Removed', 'Banner deleted from carousel.');
  };

  const addCategory = (catData: Omit<ServiceCategory, 'id'>) => {
    const newCat: ServiceCategory = {
      ...catData,
      id: 'cat_' + Date.now()
    };
    setCategories((prev) => [...prev, newCat]);
    logAction('CATEGORY_ADDED', 'Content', newCat.id, `Created service category: ${newCat.name}`);
    addToast('Category Created', `${newCat.name} added to marketplace catalog.`);
  };

  const updateCategory = (id: string, updates: Partial<ServiceCategory>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    logAction('CATEGORY_UPDATED', 'Content', id, `Updated category ${id}`);
    addToast('Category Updated', 'Service category updated.');
  };

  const addListing = (listingData: Omit<ServiceListing, 'id' | 'reviewsCount' | 'rating'>) => {
    const newListing: ServiceListing = {
      ...listingData,
      id: 'lst_' + Date.now(),
      rating: 5.0,
      reviewsCount: 0
    };
    setListings((prev) => [newListing, ...prev]);
    logAction('LISTING_CREATED', 'Listing', newListing.id, `Published listing: ${newListing.title}`);
    addToast('Service Listing Added', `${newListing.title} is now bookable.`);
  };

  const updateListing = (id: string, updates: Partial<ServiceListing>) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
    logAction('LISTING_UPDATED', 'Listing', id, `Updated listing ${id}`);
    addToast('Listing Updated', 'Service listing details saved.');
  };

  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
    logAction('LISTING_DELETED', 'Listing', id, `Removed service listing ${id}`);
    addToast('Listing Deleted', 'Service removed from catalog.', 'info');
  };

  const updateStaticPage = (slug: string, sections: { title: string; content: string }[]) => {
    setStaticPages((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          return {
            ...p,
            sections,
            lastUpdated: new Date().toISOString().substring(0, 10),
            updatedBy: `${currentAdmin.name} (${currentAdmin.roleName})`
          };
        }
        return p;
      })
    );
    logAction('CONTENT_PAGE_UPDATED', 'Content', slug, `Updated policy sections for ${slug}`);
    addToast('Page Saved', 'Content and policy terms updated across web & mobile.');
  };

  // 3. Payment & Transaction Actions
  const processRefund = (refundId: string, approve: boolean, remarks?: string) => {
    const refund = refunds.find((r) => r.id === refundId);
    if (!refund) return;

    setRefunds((prev) =>
      prev.map((r) => {
        if (r.id === refundId) {
          return {
            ...r,
            status: approve ? 'approved' : 'rejected',
            processedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            processedBy: currentAdmin.name,
            adminRemarks: remarks || (approve ? 'Approved full refund via payment rail.' : 'Rejected per policy guidelines.')
          };
        }
        return r;
      })
    );

    if (approve) {
      setPayments((prev) =>
        prev.map((p) => (p.razorpayPaymentId === refund.paymentId ? { ...p, status: 'refunded' } : p))
      );
      logAction('REFUND_APPROVED', 'Refund', refundId, `Refunded ₹${refund.amount} for Order #${refund.bookingId}`);
      addToast('Refund Processed', `₹${refund.amount} refund issued to ${refund.customerName} via Razorpay.`, 'success');
    } else {
      logAction('REFUND_REJECTED', 'Refund', refundId, `Rejected refund for Order #${refund.bookingId}: ${remarks}`);
      addToast('Refund Rejected', `Refund claim for ${refund.customerName} was declined.`, 'warning');
    }
  };

  const retryFailedTransaction = (txId: string) => {
    setFailedTransactions((prev) =>
      prev.map((f) => (f.id === txId ? { ...f, retryCount: f.retryCount + 1, resolved: true } : f))
    );
    const tx = failedTransactions.find((f) => f.id === txId);
    logAction('PAYMENT_RETRY_TRIGGERED', 'Payment', txId, `Triggered payment link resend for ${tx?.customerName}`);
    addToast('Payment Link Resent', `SMS and WhatsApp checkout retry link sent to ${tx?.customerPhone}.`, 'info');
  };

  const updateCommissionRate = (categoryId: string, newRate: number) => {
    setCategories((prev) => prev.map((c) => (c.id === categoryId ? { ...c, commissionRate: newRate } : c)));
    const cat = categories.find((c) => c.id === categoryId);
    logAction('COMMISSION_RATE_ADJUSTED', 'Commission', categoryId, `Updated platform rate for ${cat?.name} to ${newRate}%`);
    addToast('Commission Updated', `${cat?.name} platform cut set to ${newRate}%.`);
  };

  const settleCommissionPayout = (settlementId: string) => {
    setCommissions((prev) =>
      prev.map((c) => {
        if (c.id === settlementId) {
          return {
            ...c,
            payoutStatus: 'settled',
            settledAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
        }
        return c;
      })
    );
    const s = commissions.find((c) => c.id === settlementId);
    logAction('PRO_PAYOUT_SETTLED', 'Payment', settlementId, `Disbursed ₹${s?.netPayout} to ${s?.proName}`);
    addToast('Payout Disbursed', `₹${s?.netPayout} transferred to ${s?.proName}'s bank account.`, 'success');
  };

  // 4. Important Updates & Offers Actions
  const addOffer = (offerData: Omit<OfferCoupon, 'id' | 'usageCount'>) => {
    const newOffer: OfferCoupon = {
      ...offerData,
      id: 'off_' + Date.now(),
      usageCount: 0
    };
    setOffers((prev) => [newOffer, ...prev]);
    logAction('OFFER_CREATED', 'Coupon', newOffer.id, `Created coupon code: ${newOffer.code}`);
    addToast('Promo Coupon Created', `Code "${newOffer.code}" is now live!`);
  };

  const toggleOffer = (id: string) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o)));
    const off = offers.find((o) => o.id === id);
    logAction('OFFER_TOGGLED', 'Coupon', id, `Toggled offer status for ${off?.code}`);
    addToast('Offer Status Changed', `Coupon "${off?.code}" status updated.`);
  };

  const deleteOffer = (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    logAction('OFFER_DELETED', 'Coupon', id, `Removed coupon code ${id}`);
    addToast('Offer Deleted', 'Coupon removed from promotions.');
  };

  const sendAnnouncement = (annData: Omit<Announcement, 'id' | 'sentAt' | 'sentBy' | 'reachCount' | 'readCount'>) => {
    const estimatedReach =
      annData.targetAudience === 'all'
        ? users.length * 150
        : annData.targetAudience === 'customers'
        ? users.filter((u) => u.role === 'customer').length * 180
        : users.filter((u) => u.role === 'professional').length * 25;

    const newAnn: Announcement = {
      ...annData,
      id: 'ann_' + Date.now(),
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      sentBy: currentAdmin.name,
      reachCount: Math.max(estimatedReach, 85),
      readCount: 0
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    logAction('ANNOUNCEMENT_BROADCAST', 'Content', newAnn.id, `Sent broadcast: ${newAnn.title} to ${newAnn.targetAudience}`);
    addToast('Broadcast Dispatched', `Announcement delivered to ${newAnn.reachCount} users in real-time.`, 'success');
  };

  // 5. Roles & Permissions Actions
  const updateRolePermissions = (roleId: string, permissions: AdminRole['permissions']) => {
    setRoles((prev) => prev.map((r) => (r.id === roleId ? { ...r, permissions } : r)));
    logAction('ROLE_PERMISSIONS_CHANGED', 'Role', roleId, `Updated permission matrix for role ${roleId}`);
    addToast('Permissions Updated', 'Role permissions saved. Applies immediately across all active admin tokens.');
  };

  const addAdmin = (adminData: Omit<AdminUser, 'id' | 'lastActive'>) => {
    const newAdmin: AdminUser = {
      ...adminData,
      id: 'adm_' + Date.now(),
      lastActive: 'Just invited'
    };
    setAdmins((prev) => [...prev, newAdmin]);
    logAction('ADMIN_INVITED', 'Role', newAdmin.id, `Created admin profile for ${newAdmin.name} (${newAdmin.roleName})`);
    addToast('Admin Team Member Added', `Invitation sent to ${newAdmin.email}.`);
  };

  // 6. Worker Management Actions
  const addWorker = (workerData: Omit<Worker, 'id' | 'totalJobsDone' | 'completionRate' | 'onTimeRate' | 'todayEarnings' | 'pendingPayout'>) => {
    const newWorker: Worker = {
      ...workerData,
      id: 'wrk_' + String(Date.now()).slice(-4) + Math.floor(Math.random() * 90 + 10),
      totalJobsDone: 0,
      completionRate: 100,
      onTimeRate: 100,
      todayEarnings: 0,
      pendingPayout: 0,
      rating: 5.0
    };
    setWorkers((prev) => [newWorker, ...prev]);
    logAction('WORKER_ONBOARDED', 'Worker', newWorker.id, `Onboarded field worker: ${newWorker.name} (${newWorker.trade} - ${newWorker.city})`);
    addToast('Worker Onboarded', `${newWorker.name} added to ${newWorker.zone} roster as ${newWorker.trade}.`, 'success');

    if (connectionHealth.connected) {
      mainPlatformApi.onboardWorker({
        id: newWorker.id,
        name: newWorker.name,
        phone: newWorker.phone,
        email: newWorker.email,
        trade: newWorker.trade,
        zone: newWorker.zone,
        city: newWorker.city,
      } as any).then((res) => {
        if (res.success) {
          addToast('Main Platform Synced', `${newWorker.name} registered on live website database.`, 'info');
        }
      }).catch(() => {});
    }
  };

  const updateWorker = (id: string, updates: Partial<Worker>) => {
    setWorkers((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
    logAction('WORKER_UPDATED', 'Worker', id, `Updated profile details for worker ${id}`);
    addToast('Worker Profile Updated', 'Worker details saved successfully.');
  };

  const deleteWorker = (id: string) => {
    const target = workers.find((w) => w.id === id);
    setWorkers((prev) => prev.filter((w) => w.id !== id));
    logAction('WORKER_DELETED', 'Worker', id, `Removed worker ${target?.name} from active platform`);
    addToast('Worker Removed', `${target?.name || 'Worker'} removed from directory.`, 'info');
  };

  const setWorkerStatus = (id: string, status: WorkerStatus, reason?: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return {
            ...w,
            status,
            suspensionReason: status === 'suspended' ? reason : undefined
          };
        }
        return w;
      })
    );
    const target = workers.find((w) => w.id === id);
    const statusLabels: Record<WorkerStatus, string> = {
      on_duty: 'On Duty & Ready',
      on_job: 'On Job',
      off_duty: 'Off Duty (Offline)',
      on_leave: 'On Leave',
      suspended: 'Suspended'
    };
    logAction('WORKER_STATUS_CHANGED', 'Worker', id, `Changed ${target?.name} status to ${status}${reason ? ` (${reason})` : ''}`);
    addToast('Duty Status Updated', `${target?.name} is now marked ${statusLabels[status]}.`, status === 'suspended' ? 'warning' : 'success');

    if (connectionHealth.connected) {
      const remoteStatus = status === 'suspended' ? 'REJECTED' : 'APPROVED';
      mainPlatformApi.updateWorkerStatus(id, remoteStatus, reason).then((res) => {
        if (res.success) {
          addToast('Main Platform Synced', `Worker duty status updated on live website database.`, 'info');
        }
      }).catch(() => {});
    }
  };

  const dispatchJobToWorker = (workerId: string, jobData: Omit<FieldJob, 'id'>) => {
    const newJob: FieldJob = {
      ...jobData,
      id: 'job_' + Date.now()
    };
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          return {
            ...w,
            status: 'on_job',
            activeJob: newJob,
            lastLocationUpdate: 'Dispatched to ' + newJob.zone
          };
        }
        return w;
      })
    );
    const target = workers.find((w) => w.id === workerId);
    logAction('FIELD_JOB_DISPATCHED', 'Worker', workerId, `Dispatched Order #${newJob.bookingId} (${newJob.serviceTitle}) to ${target?.name}`);
    addToast('Job Dispatched', `Booking #${newJob.bookingId} assigned to ${target?.name}. Client notified.`, 'success');

    if (connectionHealth.connected) {
      mainPlatformApi.dispatchJobToWorker(workerId, jobData).then((res) => {
        if (res.success) {
          addToast('Main Platform Order Created', `Dispatch order created on live website! Order ID: ${res.data?.order?.id || newJob.bookingId}`, 'success');
        }
      }).catch(() => {});
    }
  };

  const completeWorkerJob = (workerId: string) => {
    const target = workers.find((w) => w.id === workerId);
    if (!target || !target.activeJob) return;

    const payout = target.activeJob.payoutAmount || 600;
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          return {
            ...w,
            status: 'on_duty',
            activeJob: undefined,
            totalJobsDone: w.totalJobsDone + 1,
            todayEarnings: w.todayEarnings + payout,
            pendingPayout: w.pendingPayout + payout,
            lastLocationUpdate: 'Job completed in ' + (w.activeJob?.zone || w.zone)
          };
        }
        return w;
      })
    );
    logAction('FIELD_JOB_COMPLETED', 'Worker', workerId, `Completed order #${target.activeJob.bookingId} (${target.activeJob.serviceTitle}) for ₹${payout}`);
    addToast('Job Completed', `Order #${target.activeJob.bookingId} marked complete. ₹${payout} credited to ${target.name}.`, 'success');
  };

  const cancelWorkerJob = (workerId: string, reason?: string) => {
    const target = workers.find((w) => w.id === workerId);
    if (!target || !target.activeJob) return;

    const orderId = target.activeJob.bookingId;
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          return {
            ...w,
            status: 'on_duty',
            activeJob: undefined,
            lastLocationUpdate: 'Available in ' + w.zone
          };
        }
        return w;
      })
    );
    logAction('FIELD_JOB_CANCELLED', 'Worker', workerId, `Cancelled assignment #${orderId} for ${target.name}: ${reason || 'Manual release'}`);
    addToast('Job Assignment Released', `Task #${orderId} unassigned from ${target.name}. Worker returned to available pool.`, 'info');
  };

  const settleWorkerPayout = (workerId: string, amount: number) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          return {
            ...w,
            pendingPayout: Math.max(0, w.pendingPayout - amount)
          };
        }
        return w;
      })
    );
    const target = workers.find((w) => w.id === workerId);
    logAction('WORKER_PAYOUT_DISBURSED', 'Worker', workerId, `Disbursed ₹${amount} wage payout to ${target?.name}`);
    addToast('Payout Disbursed', `₹${amount} transferred to ${target?.name} via direct IMPS rail.`, 'success');
  };

  const verifyWorkerCompliance = (workerId: string, checkType: 'safetyGear' | 'police' | 'aadhaar', verified: boolean) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          if (checkType === 'safetyGear') return { ...w, safetyGearVerified: verified };
          if (checkType === 'police') return { ...w, policeVerificationDone: verified };
          if (checkType === 'aadhaar') return { ...w, aadhaarVerified: verified };
        }
        return w;
      })
    );
    const target = workers.find((w) => w.id === workerId);
    logAction('WORKER_COMPLIANCE_UPDATED', 'Worker', workerId, `Updated ${checkType} compliance status to ${verified} for ${target?.name}`);
    addToast('Compliance Updated', `${target?.name} ${checkType} status updated.`, 'info');
  };

  const resetToDefaults = () => {
    setUsers(INITIAL_USERS);
    setKycDocs(INITIAL_KYC_DOCS);
    setBanners(INITIAL_BANNERS);
    setCategories(INITIAL_CATEGORIES);
    setListings(INITIAL_LISTINGS);
    setStaticPages(INITIAL_STATIC_PAGES);
    setPayments(INITIAL_PAYMENTS);
    setRefunds(INITIAL_REFUNDS);
    setFailedTransactions(INITIAL_FAILED_TRANSACTIONS);
    setCommissions(INITIAL_COMMISSIONS);
    setOffers(INITIAL_OFFERS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setRoles(INITIAL_ROLES);
    setAdmins(INITIAL_ADMINS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setWorkers(INITIAL_WORKERS);
    localStorage.clear();
    addToast('Reset Complete', 'Mock data restored to initial state.', 'info');
  };

  return (
    <AdminContext.Provider
      value={{
        users,
        kycDocs,
        banners,
        categories,
        listings,
        staticPages,
        faqs,
        payments,
        refunds,
        failedTransactions,
        commissions,
        offers,
        announcements,
        roles,
        admins,
        auditLogs,
        workers,
        currentAdmin,
        toasts,
        activeTab,
        activeSubtab,
        searchQuery,
        setActiveTab,
        setActiveSubtab,
        setSearchQuery,
        setCurrentAdmin,
        addToast,
        removeToast,
        blockUser,
        unblockUser,
        updateUser,
        verifyKYC,
        addWorker,
        updateWorker,
        deleteWorker,
        setWorkerStatus,
        dispatchJobToWorker,
        completeWorkerJob,
        cancelWorkerJob,
        settleWorkerPayout,
        verifyWorkerCompliance,
        addBanner,
        updateBanner,
        deleteBanner,
        addCategory,
        updateCategory,
        addListing,
        updateListing,
        deleteListing,
        updateStaticPage,
        processRefund,
        retryFailedTransaction,
        updateCommissionRate,
        settleCommissionPayout,
        addOffer,
        toggleOffer,
        deleteOffer,
        sendAnnouncement,
        updateRolePermissions,
        addAdmin,
        resetToDefaults,
        connectionHealth,
        isSyncing,
        platformSettings,
        apiBridgeConfig,
        testConnection,
        syncWithMainPlatform,
        updatePlatformSettings,
        saveApiBridgeConfig
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
