import { Poppins } from 'next/font/google';
import "./globals.css";
import Analytics from '@/components/common/Analytics';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata = {
  title: 'Skillocraft',
  description: 'Skillocraft Website',
};

/**
 * Analytics IDs are managed in the admin panel rather than baked into the
 * build, so they're read at request time and cached briefly — a change in Site
 * Settings takes effect within a few minutes with no redeploy.
 */
async function getAnalyticsIds(): Promise<{ gaId?: string; pixelId?: string }> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(
      `${api}/site-settings?keys=google_analytics_id,facebook_pixel_id`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return {};
    const json = await res.json();
    return {
      gaId: json?.data?.google_analytics_id || undefined,
      pixelId: json?.data?.facebook_pixel_id || undefined,
    };
  } catch {
    // Analytics must never be able to break the page render.
    return {};
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { gaId, pixelId } = await getAnalyticsIds();

  return (
    <html lang="en" className={poppins.className}>
      <body className="overflow-x-hidden">
        {children}
        <Analytics gaId={gaId} pixelId={pixelId} />
      </body>
    </html>
  )
}
