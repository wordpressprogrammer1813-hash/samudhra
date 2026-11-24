const SAFE_HREF_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/**
 * Sanitizes a link href to prevent `javascript:`, `data:`, or `vbscript:` XSS.
 * Allows relative paths (`/`), hash anchors (`#`), and safe web/contact protocols.
 */
export function sanitizeHref(url: string | null | undefined, fallback = '#'): string {
  if (!url) return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;

  if (trimmed.startsWith('#') || (trimmed.startsWith('/') && !trimmed.startsWith('//'))) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (SAFE_HREF_PROTOCOLS.has(parsed.protocol)) {
      return trimmed;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

/**
 * Sanitizes an image URL before rendering in `src` or CSS `url(...)`.
 * Blocks `javascript:`/`data:` payloads and characters that can break out of CSS `url('...')`.
 */
export function sanitizeImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Reject characters that can escape CSS url('...') or inject style rules
  if (/['"()\\\r\n]/.test(trimmed)) {
    return '';
  }

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return trimmed;
    }
  } catch {
    return '';
  }

  return '';
}
