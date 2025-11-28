/**
 * FILE-REF: LIB-023-20251128
 *
 * @file validation.ts
 * @description Zod validation schemas for all data models
 * @category Library
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial validation schemas (CHG-005)
 *
 * @dependencies
 * - zod
 *
 * @see Related files:
 * - LIB-010 (projects.ts)
 */

import { z } from "zod";
import { ProjectStatus } from "@prisma/client";

// Project validation schema
export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .nullable(),
  repository: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .nullable()
    .or(z.literal("")),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.ACTIVE),
  tags: z
    .array(z.string())
    .max(10, "Maximum 10 tags allowed")
    .default([]),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  id: z.string().cuid(),
});

export const deleteProjectSchema = z.object({
  id: z.string().cuid(),
});

// Type inference from schemas
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;
