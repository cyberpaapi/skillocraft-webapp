const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const R2 = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';

/**
 * Resolves an image path to a fully-qualified URL.
 * - http/https URLs are returned as-is (Cloudinary, R2 CDN, external)
 * - /uploads/... paths are prefixed with the backend API URL
 * - bare keys (images/creator/...) are R2 object keys — prefix with R2 CDN URL
 * - local public paths (e.g. /courses_1.png) are returned as-is
 * - empty/null falls back to the provided fallback
 */
export function imgSrc(link?: string | null, fallback = '/placeholder-course.jpg'): string {
  if (!link) return fallback;
  if (link.startsWith('http://') || link.startsWith('https://')) return link;
  if (link.startsWith('/uploads/')) return `${API}${link}`;
  if (!link.startsWith('/') && R2) return `${R2.replace(/\/$/, '')}/${link}`;
  return link;
}
