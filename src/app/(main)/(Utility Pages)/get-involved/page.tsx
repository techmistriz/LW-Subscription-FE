import Banner from '@/components/Common/Banner';
import Link from 'next/link';

const GetInvolvedPage = () => {
  return (
    <section>
      <Banner title={'Get Involved'} />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

          {/* Intro */}
          <section className="text-center space-y-3">
            <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 tracking-tight">
              Get Involved
            </h1>
            <p className="text-lg text-gray-600">
              Join LexWitness in advancing legal knowledge and making legal resources accessible.
            </p>
          </section>

          {/* Ways to Contribute */}
          <section className="space-y-6 text-gray-700 leading-relaxed">
            <h2 className="text-2xl text-gray-900 border-b border-gray-300 pb-2">
              Ways to Contribute
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Write articles, case studies, or legal analyses.</li>
              <li>Share legal resources and references.</li>
              <li>Participate in discussions or forums.</li>
              <li>Subscribe to newsletters and spread awareness.</li>
            </ul>
          </section>

          {/* Call to Submit Article */}
          <section className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm text-center">
            <h2 className="text-2xl text-gray-900 mb-4">Submit Your Article</h2>
            <p className="text-gray-700 mb-6">
              Share your expertise with the LexWitness community. Click below to submit your article.
            </p>
            <Link
              href="/submit"
              className="inline-block bg-[#c9060a] hover:bg-[#333] text-white px-6 py-2  transition duration-200"
            >
              Submit Article
            </Link>
          </section>

          {/* Contact */}
          <section className="space-y-4 text-gray-700">
            <h2 className="text-2xl text-gray-900 border-b border-gray-300 pb-2">
              Contact
            </h2>
            <p>Email: contribute@lexwitness.com</p>
            <p>Address: Hashtsāl, Delhi, India</p>
          </section>

          {/* Navigation */}
          <div className="text-center pt-8">
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

export default GetInvolvedPage;

export const metadata = {
  title: 'Get Involved - LexWitness',
  description: 'Learn how to participate, contribute, and engage with LexWitness.',
};