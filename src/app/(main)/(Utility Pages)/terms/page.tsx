// app/terms/page.tsx
import Banner from '@/components/Common/Banner';
import Link from 'next/link';

const TermsPage = () => {
  return (
    <section>
      <Banner title={'Terms and Conditions'} />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-3 tracking-tight">
              Terms and Conditions
            </h1>
            <p className="text-lg text-gray-600">LexWitness.com</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          
          <section className="space-y-4">
            <h2 className="text-2xl text-gray-900 border-b border-gray-300 pb-2">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to LexWitness.com (the "Site"), operated by LexWitness ("Company", "we", "us"). 
              These Terms govern your access to and use of the Site, including all content, services, 
              and functionality offered. By using the Site, you agree to these Terms. If you do not agree, 
              please do not use the Site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl text-gray-900 border-b border-gray-300 pb-2">2. Use of the Site</h2>
            <p className="text-gray-700 leading-relaxed">
              LexWitness.com provides legal news, articles, resources, and consultation services. You agree 
              to use the Site only for lawful purposes and in accordance with these Terms.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>You must be 18 years or older to access certain services.</li>
              <li>Do not use the Site for unauthorized commercial purposes.</li>
              <li>Do not attempt to disrupt or interfere with the Site’s operation or security.</li>
              <li>All content is for informational purposes and is not legal advice.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl text-gray-900 border-b border-gray-300 pb-2">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed">
              Some features require creating an account. You are responsible for the confidentiality 
              of your account credentials. Notify us immediately of unauthorized use.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate accounts for violations of these Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl text-gray-900 border-b border-gray-300 pb-2">4. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on the Site, including text, graphics, logos, and software, is owned 
              by LexWitness or its licensors and protected by copyright and trademark laws.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You may not copy, modify, distribute, or create derivative works without prior 
              written permission.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl text-gray-900 border-b border-gray-300 pb-2">5. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              The Site is provided "as is" without warranties of any kind. We are not liable 
              for any damages arising from your use of the Site, including indirect, incidental, 
              or consequential damages.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl text-gray-900 border-b border-gray-300 pb-2">6. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We may suspend or terminate your access at any time for conduct we believe violates 
              these Terms or is harmful to other users.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl text-gray-900 border-b border-gray-300 pb-2">7. Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Your use of the Site is also governed by our Privacy Policy. We respect your privacy 
              and handle personal information responsibly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl text-gray-900 border-b border-gray-300 pb-2">8. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by the laws of India. Any disputes shall be resolved in 
              the courts located in Delhi, India.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl text-gray-900 border-b border-gray-300 pb-2">9. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms periodically. Changes will be posted on this page. 
              Continued use of the Site after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Contact Section */}
          <section className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h2 className="text-2xl text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-6">Questions regarding these Terms? Reach out to us:</p>
            <div className="grid md:grid-cols-2 gap-6 text-gray-700">
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <p>support@lexwitness.com</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Address</p>
                <p>Hashtsāl, Delhi, India</p>
              </div>
            </div>
          </section>

          {/* Navigation */}
          <div className="text-center pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="inline-block px-6 py-2 text-gray-800 hover:text-black rounded transition duration-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <p className="text-sm text-gray-500">
              © 2026 LexWitness. All rights reserved. |{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default TermsPage;

export const metadata = {
  title: 'Terms and Conditions - LexWitness',
  description: 'Professional Terms and Conditions for LexWitness.com legal platform.',
};