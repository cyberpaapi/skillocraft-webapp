import { Poppins } from 'next/font/google';
import "./globals.css";
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata = {
  title: 'Skillocraft',
  description: 'Skillocraft Website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}