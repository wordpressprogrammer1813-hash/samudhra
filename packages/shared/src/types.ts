import type { Role } from './roles.js';

export type UserStatus = 'active' | 'invited' | 'suspended';

export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  role: Role;
  status: UserStatus;
  lastSeenAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string | null;
  actorEmail: string | null;
  action: string;
  entity: string | null;
  entityId: string | null;
  meta: Record<string, unknown> | null;
  ip: string | null;
  createdAt: string;
}

export interface Setting<T = unknown> {
  key: string;
  value: T;
  updatedBy: string | null;
  updatedAt: string;
}

/** Shape every API route returns, so the client can branch on one field. */
export type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: ApiError };

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
