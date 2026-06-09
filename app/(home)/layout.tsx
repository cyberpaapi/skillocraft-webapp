import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from '@/context/AuthContext';
import { ModalProvider } from '@/context/ModalContext';
import AuthModal from '@/components/common/AuthModal';
import { QueryProvider } from '@/lib/QueryProvider';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Skillocraft',
  description: 'Skillocraft Website',
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <QueryProvider>
        <ModalProvider>
          <AuthModal />
          <Navbar />
          {children}
          <Toaster richColors position="bottom-right" />
          <Footer />
        </ModalProvider>
      </QueryProvider>
    </AuthProvider>
  )
}