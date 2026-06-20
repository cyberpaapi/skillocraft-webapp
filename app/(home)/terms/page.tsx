import { Metadata } from 'next';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions - Skillocraft',
  description: 'Read our terms and conditions to understand the rules and guidelines for using Skillocraft services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
          </div>
          <p className="mt-2 text-sm text-gray-500">Effective Date: October 16, 2025</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="prose max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                  <p className="text-gray-700 mb-4">
                    Welcome to Skillocraft. These Terms and Conditions govern your use of our website and services. By accessing or using our platform, you agree to be bound by these terms.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Account Registration</h2>
                  <p className="text-gray-700 mb-4">
                    To access certain features, you must create an account. You agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Accept responsibility for all activities under your account</li>
                    <li>Be at least 13 years of age or have parental consent</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Course Enrollment and Access</h2>
                  <p className="text-gray-700 mb-4">
                    When you enroll in a course:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>You get a limited, non-exclusive, non-transferable license to access course content</li>
                    <li>Content is for personal, non-commercial use only</li>
                    <li>You may not share your account or course materials with others</li>
                    <li>We reserve the right to revoke access for violations of these terms</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Payments and Refunds</h2>
                  <p className="text-gray-700 mb-4">
                    Payment terms and refund policies:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>All fees are in INR and non-refundable except as required by law</li>
                    <li>We may change our pricing at any time</li>
                    <li>Refund requests must be made within 7 days of purchase</li>
                    <li>We use third-party payment processors for transactions</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. User Conduct</h2>
                  <p className="text-gray-700 mb-4">
                    You agree not to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Post or share harmful, illegal, or offensive content</li>
                    <li>Use our services for any unlawful purpose</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>{`Interfere with or disrupt the platform's operation`}</li>
                    <li>Violate intellectual property rights</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
                  <p className="text-gray-700 mb-4">
                    All content on our platform, including text, graphics, logos, and course materials, is owned by Skillocraft or its content providers and protected by copyright and other intellectual property laws.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
                  <p className="text-gray-700 mb-4">
                    To the maximum extent permitted by law, Skillocraft shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
                  <p className="text-gray-700">
                    {`We may update these terms at any time. We'll notify you of significant changes through our platform or via email. Continued use after changes constitutes acceptance of the new terms.`}
                  </p>
                </section>
              </div>

              <div className="mt-10 border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500 text-center">
                  For questions about these Terms, please contact us at{' '}
                  <a href="mailto:legal@skillocraft.com" className="text-indigo-600 hover:text-indigo-500">
                    legal@skillocraft.com
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