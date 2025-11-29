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
async function vercelFetch(endpoint: string): Promise<Response> {
  const token = await getVercelToken();

  if (!token) {
    throw new Error("Vercel API token not configured");
  }

  const baseUrl = "https://api.vercel.com";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
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
