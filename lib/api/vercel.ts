/**
 * FILE-REF: LIB-002-20251129
 *
 * @file vercel.ts
 * @description Vercel API client for fetching projects and deployments
 * @category Library
 * @created 2025-11-29
 * @modified 2025-11-29
 *
 * @changelog
 * - 2025-11-29 - Initial Vercel API client
 * - 2025-11-29 - Added management endpoints (env vars, domains, deployments, project settings)
 *
 * @dependencies
 * - None
 *
 * @see Related files:
 * - LIB-015 (vercel actions)
 */

interface VercelProject {
  id: string;
  name: string;
  framework: string | null;
  link?: {
    type: string;
    repo: string;
    org?: string;
    repoId?: number;
  };
  latestDeployments?: Array<{
    id: string;
    url: string;
    state: string;
    ready?: number;
    createdAt: number;
    target: string;
    meta?: {
      githubCommitRef?: string;
      githubCommitSha?: string;
      githubCommitMessage?: string;
    };
  }>;
}

interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  state: string;
  type: string;
  created: number;
  ready?: number;
  buildingAt?: number;
  target: string;
  meta?: {
    githubCommitRef?: string;
    githubCommitSha?: string;
    githubCommitMessage?: string;
  };
}

interface VercelProjectsResponse {
  projects: VercelProject[];
  pagination?: {
    count: number;
    next?: number;
    prev?: number;
  };
}

interface VercelDeploymentsResponse {
  deployments: VercelDeployment[];
  pagination?: {
    count: number;
    next?: number;
    prev?: number;
  };
}

/**
 * Get API token from environment or database
 */
async function getVercelToken(): Promise<string | null> {
  // First try environment variable
  if (process.env.VERCEL_API_TOKEN) {
    return process.env.VERCEL_API_TOKEN;
  }

  // TODO: Get from database API keys table
  return null;
}

/**
 * Make authenticated request to Vercel API
 */
async function vercelFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const token = await getVercelToken();

  if (!token) {
    throw new Error("Vercel API token not configured");
  }

  const baseUrl = "https://api.vercel.com";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Vercel API error: ${response.status} - ${error}`);
  }

  return response;
}

/**
 * List all Vercel projects
 */
export async function listVercelProjects(): Promise<VercelProject[]> {
  try {
    const response = await vercelFetch("/v9/projects");
    const data: VercelProjectsResponse = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error("Failed to fetch Vercel projects:", error);
    throw error;
  }
}

/**
 * Get a specific Vercel project by ID
 */
export async function getVercelProject(projectId: string): Promise<VercelProject> {
  try {
    const response = await vercelFetch(`/v9/projects/${projectId}`);
    const project: VercelProject = await response.json();
    return project;
  } catch (error) {
    console.error(`Failed to fetch Vercel project ${projectId}:`, error);
    throw error;
  }
}

/**
 * List deployments for a specific project
 */
export async function listVercelDeployments(
  projectId: string,
  limit: number = 10
): Promise<VercelDeployment[]> {
  try {
    const response = await vercelFetch(
      `/v6/deployments?projectId=${projectId}&limit=${limit}`
    );
    const data: VercelDeploymentsResponse = await response.json();
    return data.deployments || [];
  } catch (error) {
    console.error(`Failed to fetch deployments for project ${projectId}:`, error);
    throw error;
  }
}

/**
 * Get a specific deployment by ID
 */
export async function getVercelDeployment(deploymentId: string): Promise<VercelDeployment> {
  try {
    const response = await vercelFetch(`/v13/deployments/${deploymentId}`);
    const deployment: VercelDeployment = await response.json();
    return deployment;
  } catch (error) {
    console.error(`Failed to fetch deployment ${deploymentId}:`, error);
    throw error;
  }
}

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

interface VercelEnvVariable {
  id: string;
  key: string;
  value: string;
  type: "encrypted" | "plain" | "secret" | "system";
  target: ("production" | "preview" | "development")[];
  gitBranch?: string;
  createdAt?: number;
  updatedAt?: number;
}

interface VercelEnvResponse {
  envs: VercelEnvVariable[];
}

/**
 * List environment variables for a project
 */
export async function listVercelEnvVars(projectId: string): Promise<VercelEnvVariable[]> {
  try {
    const response = await vercelFetch(`/v9/projects/${projectId}/env`);
    const data: VercelEnvResponse = await response.json();
    return data.envs || [];
  } catch (error) {
    console.error(`Failed to fetch env vars for project ${projectId}:`, error);
    throw error;
  }
}

/**
 * Create environment variable
 */
export async function createVercelEnvVar(
  projectId: string,
  data: {
    key: string;
    value: string;
    target: ("production" | "preview" | "development")[];
    type?: "encrypted" | "plain" | "secret";
    gitBranch?: string;
  }
): Promise<VercelEnvVariable> {
  try {
    const response = await vercelFetch(`/v10/projects/${projectId}/env`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error(`Failed to create env var for project ${projectId}:`, error);
    throw error;
  }
}

/**
 * Delete environment variable
 */
export async function deleteVercelEnvVar(
  projectId: string,
  envId: string
): Promise<void> {
  try {
    await vercelFetch(`/v9/projects/${projectId}/env/${envId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(`Failed to delete env var ${envId}:`, error);
    throw error;
  }
}

// ============================================================================
// DOMAINS
// ============================================================================

interface VercelDomain {
  name: string;
  apexName: string;
  projectId: string;
  redirect?: string;
  redirectStatusCode?: number;
  gitBranch?: string | null;
  updatedAt?: number;
  createdAt?: number;
  verified: boolean;
  verification?: Array<{
    type: string;
    domain: string;
    value: string;
    reason: string;
  }>;
}

interface VercelDomainsResponse {
  domains: VercelDomain[];
  pagination?: {
    count: number;
    next?: number;
    prev?: number;
  };
}

/**
 * List domains for a project
 */
export async function listVercelDomains(projectId: string): Promise<VercelDomain[]> {
  try {
    const response = await vercelFetch(`/v9/projects/${projectId}/domains`);
    const data: VercelDomainsResponse = await response.json();
    return data.domains || [];
  } catch (error) {
    console.error(`Failed to fetch domains for project ${projectId}:`, error);
    throw error;
  }
}

/**
 * Add domain to project
 */
export async function addVercelDomain(
  projectId: string,
  domain: string,
  gitBranch?: string
): Promise<VercelDomain> {
  try {
    const response = await vercelFetch(`/v10/projects/${projectId}/domains`, {
      method: "POST",
      body: JSON.stringify({ name: domain, gitBranch }),
    });
    return await response.json();
  } catch (error) {
    console.error(`Failed to add domain ${domain} to project ${projectId}:`, error);
    throw error;
  }
}

/**
 * Remove domain from project
 */
export async function removeVercelDomain(
  projectId: string,
  domain: string
): Promise<void> {
  try {
    await vercelFetch(`/v9/projects/${projectId}/domains/${domain}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(`Failed to remove domain ${domain} from project ${projectId}:`, error);
    throw error;
  }
}

// ============================================================================
// PROJECT MANAGEMENT
// ============================================================================

interface UpdateProjectData {
  name?: string;
  buildCommand?: string | null;
  devCommand?: string | null;
  installCommand?: string | null;
  outputDirectory?: string | null;
  rootDirectory?: string | null;
  framework?: string | null;
  publicSource?: boolean;
}

/**
 * Update project settings
 */
export async function updateVercelProject(
  projectId: string,
  data: UpdateProjectData
): Promise<VercelProject> {
  try {
    const response = await vercelFetch(`/v9/projects/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error(`Failed to update project ${projectId}:`, error);
    throw error;
  }
}

/**
 * Delete project
 */
export async function deleteVercelProject(projectId: string): Promise<void> {
  try {
    await vercelFetch(`/v9/projects/${projectId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(`Failed to delete project ${projectId}:`, error);
    throw error;
  }
}

// ============================================================================
// DEPLOYMENT MANAGEMENT
// ============================================================================

/**
 * Trigger redeploy of a deployment
 */
export async function redeployVercelDeployment(
  deploymentId: string,
  name: string,
  target?: "production" | "staging"
): Promise<VercelDeployment> {
  try {
    const response = await vercelFetch(`/v13/deployments`, {
      method: "POST",
      body: JSON.stringify({
        deploymentId,
        name,
        target: target || "production",
      }),
    });
    return await response.json();
  } catch (error) {
    console.error(`Failed to redeploy deployment ${deploymentId}:`, error);
    throw error;
  }
}

/**
 * Delete deployment
 */
export async function deleteVercelDeployment(deploymentId: string): Promise<void> {
  try {
    await vercelFetch(`/v13/deployments/${deploymentId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(`Failed to delete deployment ${deploymentId}:`, error);
    throw error;
  }
}

/**
 * Get deployment events (logs)
 */
export async function getVercelDeploymentEvents(deploymentId: string): Promise<any[]> {
  try {
    const response = await vercelFetch(`/v2/deployments/${deploymentId}/events`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch deployment events for ${deploymentId}:`, error);
    throw error;
  }
}
