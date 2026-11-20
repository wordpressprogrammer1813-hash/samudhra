import { isRole, type AuditLog, type Profile, type Setting } from '@samudra/shared';

type Row = Record<string, unknown>;

/** snake_case DB row -> camelCase API shape. */
export function toProfile(row: Row): Profile {
  return {
    id: String(row.id),
    email: String(row.email ?? ''),
    fullName: (row.full_name as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    avatarUrl: (row.avatar_url as string | null) ?? null,
    role: isRole(row.role) ? row.role : 'user',
    status: (row.status as Profile['status']) ?? 'active',
    lastSeenAt: (row.last_seen_at as string | null) ?? null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export function toAuditLog(row: Row): AuditLog {
  return {
    id: String(row.id),
    actorId: (row.actor_id as string | null) ?? null,
    actorEmail: (row.actor_email as string | null) ?? null,
    action: String(row.action),
    entity: (row.entity as string | null) ?? null,
    entityId: (row.entity_id as string | null) ?? null,
    meta: (row.meta as Record<string, unknown> | null) ?? null,
    ip: (row.ip as string | null) ?? null,
    createdAt: String(row.created_at),
  };
}

export function toSetting(row: Row): Setting & { isPublic: boolean } {
  return {
    key: String(row.key),
    value: row.value,
    isPublic: Boolean(row.is_public),
    updatedBy: (row.updated_by as string | null) ?? null,
    updatedAt: String(row.updated_at),
  };
}
