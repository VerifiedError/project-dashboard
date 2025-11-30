/**
 * FILE-REF: LIB-003-20251129
 *
 * @file neon.ts
 * @description Neon API client for fetching and managing database projects
 * @category Library
 * @created 2025-11-29
 * @modified 2025-11-29
 *
 * @changelog
 * - 2025-11-29 - Initial Neon API client with full management capabilities
 *
 * @dependencies
 * - None
 *
 * @see Related files:
 * - LIB-016 (neon actions - to be created)
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface NeonProject {
  id: string;
  name: string;
  region_id: string;
  pg_version: number;
  proxy_host: string;
  branch_logical_size_limit: number;
  branch_logical_size_limit_bytes: number;
  store_passwords: boolean;
  active_time: number;
  cpu_used_sec: number;
  provisioner: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
  maintenance_starts_at?: string;
  creation_source?: string;
  default_endpoint_settings?: {
    autoscaling_limit_min_cu: number;
    autoscaling_limit_max_cu: number;
    suspend_timeout_seconds: number;
  };
}

export interface NeonBranch {
  id: string;
  project_id: string;
  parent_id?: string;
  parent_lsn?: string;
  parent_timestamp?: string;
  name: string;
  current_state: string;
  pending_state?: string;
  logical_size: number;
  physical_size?: number;
  created_at: string;
  updated_at: string;
  primary: boolean;
  protected: boolean;
  cpu_used_sec: number;
  active_time: number;
}

export interface NeonDatabase {
  id: number;
  branch_id: string;
  name: string;
  owner_name: string;
  created_at: string;
  updated_at: string;
}

export interface NeonEndpoint {
  host: string;
  id: string;
  project_id: string;
  branch_id: string;
  autoscaling_limit_min_cu: number;
  autoscaling_limit_max_cu: number;
  region_id: string;
  type: string;
  current_state: string;
  pending_state?: string;
  settings: {
    pg_settings?: Record<string, string>;
  };
  pooler_enabled: boolean;
  pooler_mode?: string;
  disabled: boolean;
  passwordless_access: boolean;
  creation_source: string;
  created_at: string;
  updated_at: string;
  proxy_host: string;
  suspend_timeout_seconds?: number;
  provisioner: string;
}

export interface NeonRole {
  branch_id: string;
  name: string;
  password?: string;
  protected: boolean;
  created_at: string;
  updated_at: string;
}

export interface NeonOperation {
  id: string;
  project_id: string;
  branch_id?: string;
  endpoint_id?: string;
  action: string;
  status: string;
  failures_count: number;
  created_at: string;
  updated_at: string;
  total_duration_ms?: number;
}

export interface NeonConsumption {
  period_id: string;
  period_start: string;
  period_end: string;
  projects: Array<{
    project_id: string;
    active_time_seconds: number;
    compute_time_seconds: number;
    written_data_bytes: number;
    data_transfer_bytes: number;
  }>;
}

interface NeonProjectsResponse {
  projects: NeonProject[];
  pagination?: {
    cursor?: string;
  };
}

interface NeonBranchesResponse {
  branches: NeonBranch[];
}

interface NeonDatabasesResponse {
  databases: NeonDatabase[];
}

interface NeonEndpointsResponse {
  endpoints: NeonEndpoint[];
}

interface NeonRolesResponse {
  roles: NeonRole[];
}

interface NeonOperationsResponse {
  operations: NeonOperation[];
  pagination?: {
    cursor?: string;
  };
}

// ============================================================================
// API CLIENT
// ============================================================================

/**
 * Get API token from environment or database
 */
async function getNeonToken(): Promise<string | null> {
  // First try environment variable
  if (process.env.NEON_API_KEY) {
    return process.env.NEON_API_KEY;
  }

  // TODO: Get from database API keys table
  return null;
}

/**
 * Make authenticated request to Neon API
 */
async function neonFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const token = await getNeonToken();

  if (!token) {
    throw new Error("Neon API token not configured");
  }

  const baseUrl = "https://console.neon.tech/api/v2";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Neon API error: ${response.status} - ${error}`);
  }

  return response;
}

// ============================================================================
// PROJECTS
// ============================================================================

/**
 * List all Neon projects
 */
export async function listNeonProjects(): Promise<NeonProject[]> {
  try {
    const response = await neonFetch("/projects");
    const data: NeonProjectsResponse = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error("Failed to fetch Neon projects:", error);
    throw error;
  }
}

/**
 * Get a specific Neon project by ID
 */
export async function getNeonProject(projectId: string): Promise<NeonProject> {
  try {
    const response = await neonFetch(`/projects/${projectId}`);
    const data = await response.json();
    return data.project;
  } catch (error) {
    console.error(`Failed to fetch Neon project ${projectId}:`, error);
    throw error;
  }
}

/**
 * Create a new Neon project
 */
export async function createNeonProject(data: {
  name?: string;
  region_id?: string;
  pg_version?: number;
}): Promise<NeonProject> {
  try {
    const response = await neonFetch("/projects", {
      method: "POST",
      body: JSON.stringify({ project: data }),
    });
    const result = await response.json();
    return result.project;
  } catch (error) {
    console.error("Failed to create Neon project:", error);
    throw error;
  }
}

/**
 * Update Neon project
 */
export async function updateNeonProject(
  projectId: string,
  data: {
    name?: string;
    default_endpoint_settings?: {
      autoscaling_limit_min_cu?: number;
      autoscaling_limit_max_cu?: number;
      suspend_timeout_seconds?: number;
    };
  }
): Promise<NeonProject> {
  try {
    const response = await neonFetch(`/projects/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify({ project: data }),
    });
    const result = await response.json();
    return result.project;
  } catch (error) {
    console.error(`Failed to update Neon project ${projectId}:`, error);
    throw error;
  }
}

/**
 * Delete Neon project
 */
export async function deleteNeonProject(projectId: string): Promise<void> {
  try {
    await neonFetch(`/projects/${projectId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(`Failed to delete Neon project ${projectId}:`, error);
    throw error;
  }
}

// ============================================================================
// BRANCHES
// ============================================================================

/**
 * List branches for a project
 */
export async function listNeonBranches(projectId: string): Promise<NeonBranch[]> {
  try {
    const response = await neonFetch(`/projects/${projectId}/branches`);
    const data: NeonBranchesResponse = await response.json();
    return data.branches || [];
  } catch (error) {
    console.error(`Failed to fetch branches for project ${projectId}:`, error);
    throw error;
  }
}

/**
 * Get a specific branch
 */
export async function getNeonBranch(
  projectId: string,
  branchId: string
): Promise<NeonBranch> {
  try {
    const response = await neonFetch(`/projects/${projectId}/branches/${branchId}`);
    const data = await response.json();
    return data.branch;
  } catch (error) {
    console.error(`Failed to fetch branch ${branchId}:`, error);
    throw error;
  }
}

/**
 * Create a new branch
 */
export async function createNeonBranch(
  projectId: string,
  data: {
    name?: string;
    parent_id?: string;
    parent_lsn?: string;
    parent_timestamp?: string;
  }
): Promise<NeonBranch> {
  try {
    const response = await neonFetch(`/projects/${projectId}/branches`, {
      method: "POST",
      body: JSON.stringify({ branch: data }),
    });
    const result = await response.json();
    return result.branch;
  } catch (error) {
    console.error("Failed to create Neon branch:", error);
    throw error;
  }
}

/**
 * Update branch
 */
export async function updateNeonBranch(
  projectId: string,
  branchId: string,
  data: {
    name?: string;
  }
): Promise<NeonBranch> {
  try {
    const response = await neonFetch(`/projects/${projectId}/branches/${branchId}`, {
      method: "PATCH",
      body: JSON.stringify({ branch: data }),
    });
    const result = await response.json();
    return result.branch;
  } catch (error) {
    console.error(`Failed to update branch ${branchId}:`, error);
    throw error;
  }
}

/**
 * Delete branch
 */
export async function deleteNeonBranch(
  projectId: string,
  branchId: string
): Promise<void> {
  try {
    await neonFetch(`/projects/${projectId}/branches/${branchId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(`Failed to delete branch ${branchId}:`, error);
    throw error;
  }
}

// ============================================================================
// DATABASES
// ============================================================================

/**
 * List databases for a branch
 */
export async function listNeonDatabases(
  projectId: string,
  branchId: string
): Promise<NeonDatabase[]> {
  try {
    const response = await neonFetch(
      `/projects/${projectId}/branches/${branchId}/databases`
    );
    const data: NeonDatabasesResponse = await response.json();
    return data.databases || [];
  } catch (error) {
    console.error(`Failed to fetch databases for branch ${branchId}:`, error);
    throw error;
  }
}

/**
 * Create a new database
 */
export async function createNeonDatabase(
  projectId: string,
  branchId: string,
  data: {
    name: string;
    owner_name: string;
  }
): Promise<NeonDatabase> {
  try {
    const response = await neonFetch(
      `/projects/${projectId}/branches/${branchId}/databases`,
      {
        method: "POST",
        body: JSON.stringify({ database: data }),
      }
    );
    const result = await response.json();
    return result.database;
  } catch (error) {
    console.error("Failed to create Neon database:", error);
    throw error;
  }
}

/**
 * Update database
 */
export async function updateNeonDatabase(
  projectId: string,
  branchId: string,
  databaseId: string,
  data: {
    name?: string;
    owner_name?: string;
  }
): Promise<NeonDatabase> {
  try {
    const response = await neonFetch(
      `/projects/${projectId}/branches/${branchId}/databases/${databaseId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ database: data }),
      }
    );
    const result = await response.json();
    return result.database;
  } catch (error) {
    console.error(`Failed to update database ${databaseId}:`, error);
    throw error;
  }
}

/**
 * Delete database
 */
export async function deleteNeonDatabase(
  projectId: string,
  branchId: string,
  databaseId: string
): Promise<void> {
  try {
    await neonFetch(
      `/projects/${projectId}/branches/${branchId}/databases/${databaseId}`,
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    console.error(`Failed to delete database ${databaseId}:`, error);
    throw error;
  }
}

// ============================================================================
// ENDPOINTS
// ============================================================================

/**
 * List endpoints for a branch
 */
export async function listNeonEndpoints(
  projectId: string,
  branchId: string
): Promise<NeonEndpoint[]> {
  try {
    const response = await neonFetch(
      `/projects/${projectId}/branches/${branchId}/endpoints`
    );
    const data: NeonEndpointsResponse = await response.json();
    return data.endpoints || [];
  } catch (error) {
    console.error(`Failed to fetch endpoints for branch ${branchId}:`, error);
    throw error;
  }
}

/**
 * Create a new endpoint
 */
export async function createNeonEndpoint(
  projectId: string,
  branchId: string,
  data: {
    type: string;
    autoscaling_limit_min_cu?: number;
    autoscaling_limit_max_cu?: number;
    suspend_timeout_seconds?: number;
    pooler_enabled?: boolean;
    pooler_mode?: string;
  }
): Promise<NeonEndpoint> {
  try {
    const response = await neonFetch(
      `/projects/${projectId}/branches/${branchId}/endpoints`,
      {
        method: "POST",
        body: JSON.stringify({ endpoint: data }),
      }
    );
    const result = await response.json();
    return result.endpoint;
  } catch (error) {
    console.error("Failed to create Neon endpoint:", error);
    throw error;
  }
}

/**
 * Update endpoint
 */
export async function updateNeonEndpoint(
  projectId: string,
  branchId: string,
  endpointId: string,
  data: {
    autoscaling_limit_min_cu?: number;
    autoscaling_limit_max_cu?: number;
    suspend_timeout_seconds?: number;
    disabled?: boolean;
  }
): Promise<NeonEndpoint> {
  try {
    const response = await neonFetch(
      `/projects/${projectId}/branches/${branchId}/endpoints/${endpointId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ endpoint: data }),
      }
    );
    const result = await response.json();
    return result.endpoint;
  } catch (error) {
    console.error(`Failed to update endpoint ${endpointId}:`, error);
    throw error;
  }
}

/**
 * Delete endpoint
 */
export async function deleteNeonEndpoint(
  projectId: string,
  branchId: string,
  endpointId: string
): Promise<void> {
  try {
    await neonFetch(
      `/projects/${projectId}/branches/${branchId}/endpoints/${endpointId}`,
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    console.error(`Failed to delete endpoint ${endpointId}:`, error);
    throw error;
  }
}

/**
 * Start endpoint
 */
export async function startNeonEndpoint(
  projectId: string,
  branchId: string,
  endpointId: string
): Promise<NeonEndpoint> {
  try {
    const response = await neonFetch(
      `/projects/${projectId}/branches/${branchId}/endpoints/${endpointId}/start`,
      {
        method: "POST",
      }
    );
    const result = await response.json();
    return result.endpoint;
  } catch (error) {
    console.error(`Failed to start endpoint ${endpointId}:`, error);
    throw error;
  }
}

/**
 * Suspend endpoint
 */
export async function suspendNeonEndpoint(
  projectId: string,
  branchId: string,
  endpointId: string
): Promise<NeonEndpoint> {
  try {
    const response = await neonFetch(
      `/projects/${projectId}/branches/${branchId}/endpoints/${endpointId}/suspend`,
      {
        method: "POST",
      }
    );
    const result = await response.json();
    return result.endpoint;
  } catch (error) {
    console.error(`Failed to suspend endpoint ${endpointId}:`, error);
    throw error;
  }
}

// ============================================================================
// ROLES
// ============================================================================

/**
 * List roles for a branch
 */
export async function listNeonRoles(
  projectId: string,
  branchId: string
): Promise<NeonRole[]> {
  try {
    const response = await neonFetch(
      `/projects/${projectId}/branches/${branchId}/roles`
    );
    const data: NeonRolesResponse = await response.json();
    return data.roles || [];
  } catch (error) {
    console.error(`Failed to fetch roles for branch ${branchId}:`, error);
    throw error;
  }
}

/**
 * Create a new role
 */
export async function createNeonRole(
  projectId: string,
  branchId: string,
  data: {
    name: string;
  }
): Promise<NeonRole> {
  try {
    const response = await neonFetch(
      `/projects/${projectId}/branches/${branchId}/roles`,
      {
        method: "POST",
        body: JSON.stringify({ role: data }),
      }
    );
    const result = await response.json();
    return result.role;
  } catch (error) {
    console.error("Failed to create Neon role:", error);
    throw error;
  }
}

/**
 * Delete role
 */
export async function deleteNeonRole(
  projectId: string,
  branchId: string,
  roleName: string
): Promise<void> {
  try {
    await neonFetch(
      `/projects/${projectId}/branches/${branchId}/roles/${roleName}`,
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    console.error(`Failed to delete role ${roleName}:`, error);
    throw error;
  }
}

/**
 * Reset role password
 */
export async function resetNeonRolePassword(
  projectId: string,
  branchId: string,
  roleName: string
): Promise<NeonRole> {
  try {
    const response = await neonFetch(
      `/projects/${projectId}/branches/${branchId}/roles/${roleName}/reset_password`,
      {
        method: "POST",
      }
    );
    const result = await response.json();
    return result.role;
  } catch (error) {
    console.error(`Failed to reset password for role ${roleName}:`, error);
    throw error;
  }
}

// ============================================================================
// OPERATIONS
// ============================================================================

/**
 * List operations for a project
 */
export async function listNeonOperations(
  projectId: string
): Promise<NeonOperation[]> {
  try {
    const response = await neonFetch(`/projects/${projectId}/operations`);
    const data: NeonOperationsResponse = await response.json();
    return data.operations || [];
  } catch (error) {
    console.error(`Failed to fetch operations for project ${projectId}:`, error);
    throw error;
  }
}

/**
 * Get a specific operation
 */
export async function getNeonOperation(
  projectId: string,
  operationId: string
): Promise<NeonOperation> {
  try {
    const response = await neonFetch(
      `/projects/${projectId}/operations/${operationId}`
    );
    const data = await response.json();
    return data.operation;
  } catch (error) {
    console.error(`Failed to fetch operation ${operationId}:`, error);
    throw error;
  }
}

// ============================================================================
// CONSUMPTION / METRICS
// ============================================================================

/**
 * Get consumption metrics
 */
export async function getNeonConsumption(
  from: string,
  to: string
): Promise<NeonConsumption[]> {
  try {
    const response = await neonFetch(
      `/consumption_history/account?from=${from}&to=${to}`
    );
    const data = await response.json();
    return data.periods || [];
  } catch (error) {
    console.error("Failed to fetch Neon consumption:", error);
    throw error;
  }
}

/**
 * Get connection URI for a branch
 */
export async function getNeonConnectionURI(
  projectId: string,
  branchId: string,
  databaseName: string,
  roleName: string
): Promise<string> {
  try {
    const response = await neonFetch(
      `/projects/${projectId}/connection_uri?branch_id=${branchId}&database_name=${databaseName}&role_name=${roleName}`
    );
    const data = await response.json();
    return data.uri;
  } catch (error) {
    console.error("Failed to get connection URI:", error);
    throw error;
  }
}
