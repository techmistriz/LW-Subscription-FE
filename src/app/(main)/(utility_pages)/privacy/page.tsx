// app/privacy/page.tsx
import Banner from '@/components/Common/Banner';
import Link from 'next/link';

const PrivacyPage = () => {
  const effectiveDate = 'February 24, 2026';

  return (
    <section>
<Banner title='privacy policy'/>
    <div className="min-h-screen bg-gray-50">
     
      {/* Main Content - Much tighter spacing */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <section className="space-y-2">
          <h2 className="text-xl text-gray-900 border-b border-gray-300 pb-1 text-lg">1. Introduction</h2>
          <div className="text-gray-700 leading-tight text-sm space-y-2">
            <p>LexWitness.com ("we," "us," "our") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us.</p>
            <p>By using LexWitness.com, you consent to the practices described in this policy.</p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl text-gray-900 border-b border-gray-300 pb-1 text-lg">2. Information We Collect</h2>
          <div className="text-gray-700 leading-tight text-sm space-y-2">
            <p>Personal Information: Name, email address, phone number, billing information when you register, subscribe, or contact us.</p>
            <p>Usage Data: IP address, browser type, pages visited, time spent, referring site.</p>
            <p>Cookies: Track preferences, analyze usage, deliver targeted ads.</p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl text-gray-900 border-b border-gray-300 pb-1 text-lg">3. How We Use Your Information</h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700 text-sm leading-tight">
            <div>
              <p>• Provide and improve our services</p>
              <p>• Send newsletters and updates</p>
              <p>• Process payments and subscriptions</p>
            </div>
            <div>
              <p>• Personalize your experience</p>
              <p>• Comply with legal obligations</p>
              <p>• Analyze website usage</p>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl text-gray-900 border-b border-gray-300 pb-1 text-lg">4. Cookies and Tracking</h2>
          <div className="text-gray-700 leading-tight text-sm space-y-2">
            <p>We use cookies to enhance your experience. You can manage cookie preferences through your browser settings.</p>
            <p>Cookie Types:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Essential: Site functionality</li>
              <li>Analytics: Usage statistics</li>
              <li>Marketing: Targeted advertising</li>
            </ul>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl text-gray-900 border-b border-gray-300 pb-1 text-lg">5. Third Party Sharing</h2>
          <div className="text-gray-700 leading-tight text-sm space-y-2">
            <p>We may share information with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Service providers (hosting, payment processors)</li>
              <li>Legal authorities when required</li>
              <li>Business partners for joint services</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl text-gray-900 border-b border-gray-300 pb-1 text-lg">6. Data Security</h2>
          <div className="text-gray-700 leading-tight text-sm space-y-2">
            <p>We implement reasonable security measures including encryption, firewalls, and access controls to protect your information. However, no system is completely secure.</p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl text-gray-900 border-b border-gray-300 pb-1 text-lg">7. Your Rights</h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700 text-sm leading-tight">
            <div>
              <p>• Access your personal data</p>
              <p>• Request correction or deletion</p>
              <p>• Withdraw consent</p>
            </div>
            <div>
              <p>• Opt-out of marketing emails</p>
              <p>• Object to data processing</p>
              <p>• Data portability</p>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl text-gray-900 border-b border-gray-300 pb-1 text-lg">8. Children's Privacy</h2>
          <div className="text-gray-700 leading-tight text-sm">
            <p>Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl text-gray-900 border-b border-gray-300 pb-1 text-lg">9. International Data Transfers</h2>
          <div className="text-gray-700 leading-tight text-sm">
            <p>Your information may be transferred to and processed in countries outside India, including the United States, where privacy laws may differ.</p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl text-gray-900 border-b border-gray-300 pb-1 text-lg">10. Changes to Policy</h2>
          <div className="text-gray-700 leading-tight text-sm space-y-2">
            <p>We may update this Privacy Policy. Changes will be posted here with the new effective date. Continued use constitutes acceptance.</p>
          </div>
        </section>

      </div>

     
    </div>
    </section>
  );
};

export default PrivacyPage;

export const metadata = {
  title: 'Privacy Policy - LexWitness',
  description: 'Privacy policy for LexWitness.com legal platform.',
};
