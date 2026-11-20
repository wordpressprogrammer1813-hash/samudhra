import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { hasMinRole, type Role } from '@samudra/shared';
import { supabaseAdmin } from '../supabase.js';
import { HttpError } from '../lib/http.js';
import { toProfile } from '../lib/mappers.js';

function bearerToken(req: Request): string | null {
  const header = req.get('authorization');
  if (header?.toLowerCase().startsWith('bearer ')) {
    const token = header.slice(7).trim();
    return token.length > 0 ? token : null;
  }
  return null;
}

/**
 * Verifies the Supabase access token sent by the browser and attaches the
 * caller's profile (which carries the role) to the request.
 */
export const requireAuth: RequestHandler = async (req, _res, next) => {
  try {
    const token = bearerToken(req);
    if (!token) throw HttpError.unauthorized('Missing bearer token');

    // Asks Supabase Auth to validate signature + expiry for us.
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) throw HttpError.unauthorized('Invalid or expired session');

    const { data: row, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !row) throw HttpError.forbidden('No profile for this account');

    const profile = toProfile(row);
    if (profile.status === 'suspended') throw HttpError.forbidden('This account is suspended');

    req.auth = { user: data.user, profile, accessToken: token };
    next();
  } catch (err) {
    next(err);
  }
};

/** Requires the caller to be at least `minimum` in the role hierarchy. */
export function requireRole(minimum: Role): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) return next(HttpError.unauthorized());
    if (!hasMinRole(req.auth.profile.role, minimum)) {
      return next(HttpError.forbidden(`Requires ${minimum} access`));
    }
    next();
  };
}

/** Convenience guards used by the route files. */
export const requireEditor = requireRole('editor');
export const requireAdmin = requireRole('admin');
export const requireSuperAdmin = requireRole('superadmin');

/** Narrowing helper so route bodies do not repeat the null check. */
export function authOf(req: Request): NonNullable<Request['auth']> {
  if (!req.auth) throw HttpError.unauthorized();
  return req.auth;
}
