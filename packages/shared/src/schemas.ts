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

export const listUsersSchema = paginationSchema.extend({
  role: roleSchema.optional(),
  status: userStatusSchema.optional(),
  sort: z.enum(['created_at', 'email', 'full_name', 'role']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});
export type ListUsersInput = z.infer<typeof listUsersSchema>;

export const inviteUserSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  fullName: z.string().trim().min(1).max(120).optional(),
  role: roleSchema.default('user'),
});
export type InviteUserInput = z.infer<typeof inviteUserSchema>;

export const updateUserSchema = z
  .object({
    fullName: z.string().trim().min(1).max(120).nullable().optional(),
    phone: z.string().trim().max(20).nullable().optional(),
    role: roleSchema.optional(),
    status: userStatusSchema.optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'Nothing to update' });
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

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

export const listAuditLogsSchema = paginationSchema.extend({
  action: z.string().trim().max(100).optional(),
  actorId: z.string().uuid().optional(),
});
export type ListAuditLogsInput = z.infer<typeof listAuditLogsSchema>;
