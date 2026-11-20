import { z } from 'zod';
import { ROLES } from './roles.js';

export const roleSchema = z.enum(ROLES);
export const userStatusSchema = z.enum(['active', 'invited', 'suspended']);

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(200).optional(),
});
export type PaginationInput = z.infer<typeof paginationSchema>;

/** The signed-in user editing their own profile. */
export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(1).max(120).nullable().optional(),
  phone: z.string().trim().max(20).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const updateSettingSchema = z.object({
  key: z.string().trim().min(1).max(100),
  value: z.unknown(),
});
export type UpdateSettingInput = z.infer<typeof updateSettingSchema>;
