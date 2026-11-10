/**
 * PunchX Admin Command Center — Main Platform Bridge API Service
 * 
 * Provides authenticated communication between this Admin Panel repository and the
 * Main Website repository (PunchX Core Backend API).
 * 
 * Security:
 * - Kept strictly isolated in this Admin repository.
 * - Authenticates with the Main Platform using the administrative secret key header (`x-admin-key`).
 * - Supports automatic health probing, latency calculation, and resilient fallback to local storage
 *   when running in standalone mode or during connectivity drops.
 */

import type { User, Worker, FieldJob } from '../types';

export interface ApiConfig {
  baseUrl: string;
  adminApiKey: string;
}

export interface ConnectionHealth {
  connected: boolean;
  status: 'connected' | 'offline' | 'checking' | 'error';
  latencyMs: number;
  lastChecked: string | null;
  serverInfo?: {
    platform?: string;
    version?: string;
    dbProvider?: string;
    dbHealthy?: boolean;
    uptime?: number;
    timestamp?: string;
  };
  errorMessage?: string;
}

export interface DynamicPlatformSettings {
  convenienceFee: number;
  emergencySurcharge: number;
  defaultCommissionRate: number;
  gstRate: number;
  maintenanceMode: boolean;
  maintenanceNotice: string;
  announcementBanner: string;
  activeGeofences: {
    id: string;
    name: string;
    radiusKm: number;
    active: boolean;
  }[];
  updatedAt: string;
}

const STORAGE_KEY_CONFIG = 'punchx_admin_bridge_config';

export function getStoredApiConfig(): ApiConfig {
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.baseUrl && parsed.adminApiKey) {
        // If loaded on HTTPS, auto-migrate legacy localhost URL to prevent browser mixed-content blockage
        if (isHttps && parsed.baseUrl.startsWith('http://localhost')) {
          parsed.baseUrl = 'https://www.punchxapp.co.in';
          saveApiConfig(parsed);
        }
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  const defaultUrl = isHttps
    ? ((import.meta.env.VITE_MAIN_API_URL as string) || 'https://www.punchxapp.co.in')
    : ((import.meta.env.VITE_MAIN_API_URL as string) || 'http://localhost:3000');

  return {
    baseUrl: defaultUrl,
    adminApiKey: (import.meta.env.VITE_ADMIN_API_KEY as string) || 'punchx_admin_secure_live_key_2026_9941a8',
  };
}

export function saveApiConfig(config: ApiConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to store API bridge config:', err);
  }
}

class MainPlatformApiService {
  private config: ApiConfig;

  constructor() {
    this.config = getStoredApiConfig();
  }

  public updateConfig(newConfig: Partial<ApiConfig>): ApiConfig {
    this.config = { ...this.config, ...newConfig };
    // Trim trailing slash from baseUrl
    if (this.config.baseUrl.endsWith('/')) {
      this.config.baseUrl = this.config.baseUrl.slice(0, -1);
    }
    saveApiConfig(this.config);
    return this.config;
  }

  public getConfig(): ApiConfig {
    return { ...this.config };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string; isOffline?: boolean }> {
    const url = `${this.config.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    headers.set('x-admin-key', this.config.adminApiKey);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorBody.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const json = await response.json();
      return { success: true, data: json };
    } catch (err: any) {
      const isAbort = err.name === 'AbortError';
      const isMixedContent = typeof window !== 'undefined' && window.location.protocol === 'https:' && url.startsWith('http://');
      const errorMsg = isMixedContent
        ? 'Mixed Content Block: Browser cannot connect to HTTP from an HTTPS site. Use https://www.punchxapp.co.in'
        : isAbort
        ? 'Request timed out (8s limit)'
        : (err.message || 'Network error');
      return {
        success: false,
        error: errorMsg,
        isOffline: true,
      };
    }
  }

  /**
   * Probes the main platform backend health and returns connection latency
   */
  public async probeHealth(): Promise<ConnectionHealth> {
    if (typeof window !== 'undefined' && window.location.protocol === 'https:' && this.config.baseUrl.startsWith('http://')) {
      return {
        connected: false,
        status: 'error',
        latencyMs: 0,
        lastChecked: new Date().toISOString(),
        errorMessage: 'Mixed Content Block: Modern browsers do not allow HTTPS websites to fetch insecure HTTP endpoints. Please use https://www.punchxapp.co.in or run this admin dashboard locally.',
      };
    }

    const startTime = performance.now();
    try {
      const res = await this.request<any>('/api/admin/health', { method: 'GET' });
      const latencyMs = Math.round(performance.now() - startTime);

      if (res.success && res.data) {
        return {
          connected: true,
          status: 'connected',
          latencyMs,
          lastChecked: new Date().toISOString(),
          serverInfo: res.data,
        };
      }

      return {
        connected: false,
        status: res.isOffline ? 'offline' : 'error',
        latencyMs,
        lastChecked: new Date().toISOString(),
        errorMessage: res.error || 'Server did not return a valid health payload',
      };
    } catch (err: any) {
      return {
        connected: false,
        status: 'offline',
        latencyMs: 0,
        lastChecked: new Date().toISOString(),
        errorMessage: err.message || 'Cannot reach main platform backend',
      };
    }
  }

  /**
   * Fetches full operational metrics from the main platform backend
   */
  public async getOverviewMetrics() {
    return this.request<{
      metrics: {
        totalUsers: number;
        totalWorkers: number;
        activeWorkers: number;
        pendingWorkers: number;
        totalOrders: number;
        completedOrders: number;
        totalGmv: number;
        pendingClaims: number;
        pendingComplaints: number;
      };
      settings: DynamicPlatformSettings;
    }>('/api/admin/overview');
  }

  // ─── USER OPERATIONS ───

  public async fetchUsers(role?: string) {
    const query = role ? `?role=${encodeURIComponent(role)}` : '';
    return this.request<{ count: number; users: any[] }>(`/api/admin/users${query}`);
  }

  public async updateUser(uid: string, updates: Partial<User>) {
    return this.request<{ user: any }>(`/api/admin/users/${encodeURIComponent(uid)}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  public async setUserBlockedStatus(uid: string, isBlocked: boolean, reason?: string) {
    return this.updateUser(uid, {
      status: isBlocked ? 'suspended' : 'active',
      suspendedReason: isBlocked ? reason : undefined,
    } as any);
  }

  // ─── WORKER OPERATIONS ───

  public async fetchWorkers(status?: string) {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return this.request<{ count: number; applications: any[]; workerProfiles: any[] }>(
      `/api/admin/workers${query}`
    );
  }

  public async onboardWorker(workerData: Partial<Worker>) {
    return this.request<{ application: any }>('/api/admin/workers', {
      method: 'POST',
      body: JSON.stringify(workerData),
    });
  }

  public async updateWorkerStatus(workerId: string, status: string, notes?: string) {
    return this.request<{ application: any }>(`/api/admin/workers/${encodeURIComponent(workerId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  }

  public async dispatchJobToWorker(workerId: string, jobData: Omit<FieldJob, 'id'>) {
    return this.request<{ order: any }>(`/api/admin/workers/${encodeURIComponent(workerId)}/dispatch`, {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  // ─── ORDERS OPERATIONS ───

  public async fetchOrders(filters?: { customerId?: string; workerId?: string; status?: string }) {
    const params = new URLSearchParams();
    if (filters?.customerId) params.set('customerId', filters.customerId);
    if (filters?.workerId) params.set('workerId', filters.workerId);
    if (filters?.status) params.set('status', filters.status);
    const queryString = params.toString() ? `?${params.toString()}` : '';

    return this.request<{ count: number; orders: any[] }>(`/api/admin/orders${queryString}`);
  }

  public async updateOrderStatus(orderId: string, status: string, notes?: string) {
    return this.request<{ order: any }>(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note: notes }),
    });
  }

  // ─── CLAIMS & GRIEVANCES ───

  public async fetchWarrantyClaims(status?: string) {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return this.request<{ count: number; claims: any[] }>(`/api/admin/claims${query}`);
  }

  public async updateWarrantyClaim(claimId: string, status: string, notes?: string) {
    return this.request<{ claim: any }>(`/api/admin/claims/${encodeURIComponent(claimId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  }

  // ─── PLATFORM SETTINGS OPERATIONS ───

  public async fetchSettings() {
    return this.request<{ settings: DynamicPlatformSettings }>('/api/admin/settings');
  }

  public async updateSettings(settings: Partial<DynamicPlatformSettings>) {
    return this.request<{ settings: DynamicPlatformSettings }>('/api/admin/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }
}

export const mainPlatformApi = new MainPlatformApiService();
