import { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Skillocraft',
  description: 'Learn how we protect and manage your personal information at Skillocraft.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="mt-2 text-sm text-gray-500">Last updated: October 16, 2025</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="prose max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                  <p className="text-gray-700 mb-4">
                    We collect information that you provide directly to us when you register, make a purchase, or communicate with us. This may include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Personal information (name, email, contact details)</li>
                    <li>Payment and billing information</li>
                    <li>Course progress and activity data</li>
                    <li>Communication preferences</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                  <p className="text-gray-700 mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Respond to your comments, questions, and requests</li>
                    <li>Send you technical notices and security alerts</li>
                    <li>Monitor and analyze trends and usage</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
                  <p className="text-gray-700 mb-4">
                    We do not share your personal information with third parties except as described in this policy. We may share information with:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Instructors for the courses you enroll in</li>
                    <li>Service providers who perform services on our behalf</li>
                    <li>When required by law or to protect rights and safety</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                  <p className="text-gray-700 mb-4">
                    We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Choices</h2>
                  <p className="text-gray-700 mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                    <li>Access, update, or delete your information</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Request data portability</li>
                    <li>Withdraw consent where applicable</li>
                  </ul>
                  <p className="text-gray-700">
                    To exercise these rights, please contact us at privacy@skillocraft.com
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Changes to This Policy</h2>
                  <p className="text-gray-700">
                    {`We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.`}
                  </p>
                </section>
              </div>

              <div className="mt-10 border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500 text-center">
                  If you have any questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:privacy@skillocraft.com" className="text-indigo-600 hover:text-indigo-500">
                    privacy@skillocraft.com
                  </a>
                </p>
                <div className="mt-6 flex justify-center">
                  <Button asChild variant="outline">
                    <Link href="/">
                      Back to Home
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}