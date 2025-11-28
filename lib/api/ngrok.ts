/**
 * FILE-REF: LIB-001-20251128
 *
 * @file ngrok.ts
 * @description ngrok API client for fetching tunnel data
 * @category Library
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial ngrok API client (CHG-007)
 *
 * @see Related files:
 * - LIB-011 (ngrok server actions)
 * - PAGE-007 (ngrok resource page)
 */

/**
 * ngrok API Client
 *
 * Integrates with ngrok API v2 to fetch tunnel information
 * Docs: https://ngrok.com/docs/api
 */

const NGROK_API_BASE = "https://api.ngrok.com";
const API_KEY = process.env.NGROK_API_KEY;

export interface NgrokTunnel {
  id: string;
  public_url: string;
  proto: string;
  config: {
    addr: string;
    inspect: boolean;
  };
  metrics: {
    conns: {
      count: number;
      gauge: number;
      rate1: number;
      rate5: number;
      rate15: number;
      p50: number;
      p90: number;
      p95: number;
      p99: number;
    };
    http: {
      count: number;
      rate1: number;
      rate5: number;
      rate15: number;
      p50: number;
      p90: number;
      p95: number;
      p99: number;
    };
  };
}

export interface NgrokTunnelSession {
  id: string;
  uri: string;
  public_url: string;
  started_at: string;
  metadata: string;
  expires_at: string | null;
  endpoint: {
    id: string;
    uri: string;
  };
  edge: {
    id: string;
    uri: string;
  } | null;
  tunnel_session: {
    id: string;
    uri: string;
  };
  proto: string;
  forwards_to: string;
  labels: Record<string, string>;
  region: string;
}

export interface NgrokApiResponse<T> {
  tunnels?: T[];
  uri: string;
  next_page_uri: string | null;
}

export interface NgrokEndpoint {
  id: string;
  region: string;
  created_at: string;
  updated_at: string;
  public_url: string;
  proto: string;
  hostport: string;
  type: string;
  metadata: string;
  domain: {
    id: string;
    uri: string;
  } | null;
  tcp_addr: {
    id: string;
    uri: string;
  } | null;
  tunnel: {
    id: string;
    uri: string;
  } | null;
  edge: {
    id: string;
    uri: string;
  } | null;
  upstream: {
    url: string;
  };
  url: string;
}

/**
 * Fetch headers with authentication
 */
function getHeaders(): HeadersInit {
  if (!API_KEY) {
    throw new Error("NGROK_API_KEY environment variable is not set");
  }

  return {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    "Ngrok-Version": "2",
  };
}

/**
 * List all active tunnel sessions
 */
export async function listTunnelSessions(): Promise<NgrokTunnelSession[]> {
  try {
    const response = await fetch(`${NGROK_API_BASE}/tunnel_sessions`, {
      headers: getHeaders(),
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    if (!response.ok) {
      throw new Error(`ngrok API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as NgrokApiResponse<NgrokTunnelSession>;
    return data.tunnels || [];
  } catch (error) {
    console.error("Failed to fetch ngrok tunnel sessions:", error);
    throw error;
  }
}

/**
 * List all endpoints (HTTP/TCP/TLS edges)
 */
export async function listEndpoints(): Promise<NgrokEndpoint[]> {
  try {
    const response = await fetch(`${NGROK_API_BASE}/endpoints`, {
      headers: getHeaders(),
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      throw new Error(`ngrok API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as NgrokApiResponse<NgrokEndpoint>;
    return data.tunnels || [];
  } catch (error) {
    console.error("Failed to fetch ngrok endpoints:", error);
    throw error;
  }
}

/**
 * Get tunnel session by ID
 */
export async function getTunnelSession(id: string): Promise<NgrokTunnelSession | null> {
  try {
    const response = await fetch(`${NGROK_API_BASE}/tunnel_sessions/${id}`, {
      headers: getHeaders(),
      next: { revalidate: 10 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`ngrok API error: ${response.status} ${response.statusText}`);
    }

    return await response.json() as NgrokTunnelSession;
  } catch (error) {
    console.error(`Failed to fetch tunnel session ${id}:`, error);
    throw error;
  }
}

/**
 * Check if ngrok API is configured
 */
export function isNgrokConfigured(): boolean {
  return !!API_KEY && API_KEY.length > 0;
}

/**
 * Test ngrok API connection
 */
export async function testNgrokConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isNgrokConfigured()) {
      return { success: false, error: "NGROK_API_KEY not configured" };
    }

    const response = await fetch(`${NGROK_API_BASE}/tunnel_sessions?limit=1`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `API returned ${response.status}: ${response.statusText}`
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
