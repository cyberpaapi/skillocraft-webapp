const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Resolves an image path to a fully-qualified URL.
 * - http/https URLs are returned as-is (Cloudinary, external CDN)
 * - /uploads/... paths are prefixed with the backend API URL
 * - local public paths (e.g. /courses_1.png) are returned as-is
 * - empty/null falls back to the provided fallback
 */
export function imgSrc(link?: string | null, fallback = '/placeholder-course.jpg'): string {
  if (!link) return fallback;
  if (link.startsWith('http://') || link.startsWith('https://')) return link;
  if (link.startsWith('/uploads/')) return `${API}${link}`;
  return link;
}
