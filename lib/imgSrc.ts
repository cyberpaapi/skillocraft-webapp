const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Resolves any image path to a fully-qualified URL.
 * - http/https URLs → returned as-is
 * - /r2/... paths  → proxied through the backend API (new uploads)
 * - /uploads/...   → served as static files from the backend
 * - bare keys (images/..., no leading /) → legacy bare R2 keys, proxy via /r2/
 * - other /... paths → returned as-is (local public assets)
 */
export function imgSrc(link?: string | null, fallback = '/placeholder-course.jpg'): string {
  if (!link) return fallback;
  if (link.startsWith('http://') || link.startsWith('https://')) return link;
  if (link.startsWith('/r2/') || link.startsWith('/uploads/')) return `${API}${link}`;
  if (!link.startsWith('/')) return `${API}/r2/${link}`;
  return link;
}
