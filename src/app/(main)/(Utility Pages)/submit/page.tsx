// app/submit/page.tsx
import Banner from '@/components/Common/Banner';
import Link from 'next/link';

const SubmitPage = () => {
  return (
    <section>
      <Banner title={' Article submit'} />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          
          {/* Introduction */}
          <section className="text-center space-y-3">
            <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 tracking-tight">
              Submit Your Article
            </h1>
            <p className="text-lg text-gray-600">
              Share your expertise and contribute to LexWitness by submitting original legal articles, case studies, or resources.
            </p>
          </section>

          {/* Submission Guidelines */}
          <section className="space-y-6">
            <h2 className="text-2xl text-gray-900 border-b border-gray-300 pb-2">
              Guidelines for Submission
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>All submissions must be original content authored by you.</li>
              <li>Articles should be professional, accurate, and informative.</li>
              <li>Include references or citations where applicable.</li>
              <li>Use clear headings, paragraphs, and proper formatting.</li>
              <li>Word count should be at least 500 words.</li>
            </ul>
          </section>

          {/* Submission Form */}
          <section className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-2xl text-gray-900">Submit Your Article</h2>
            <p className="text-gray-700">
              Fill out the form below and attach your article document (PDF, Word) or paste the content directly.
            </p>

            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="title" className="block text-gray-700 font-medium mb-1">Article Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Title of your article"
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-gray-700 font-medium mb-1">Article Content</label>
                <textarea
                  id="content"
                  name="content"
                  rows={6}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste your article content here"
                ></textarea>
              </div>

              <div>
                <label htmlFor="attachment" className="block text-gray-700 font-medium mb-1">Attachment (optional)</label>
                <input
                  type="file"
                  id="attachment"
                  name="attachment"
                  className="w-full text-gray-700"
                  accept=".pdf,.doc,.docx"
                />
              </div>

              <button
                type="submit"
                className="bg-[#c9060a] hover:bg-[#333] text-white px-6 py-2 cursor-pointer transition duration-200"
              >
                Submit Article
              </button>
            </form>
          </section>

          {/* Navigation */}
          <div className="text-center pt-8">
            <Link
              href="/get-involved"
              className="inline-block px-6 py-2 text-gray-800 hover:text-black rounded transition duration-200"
            >
              ← Back to Get Involved
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

export default SubmitPage;

export const metadata = {
  title: 'Submit Your Article - LexWitness',
  description: 'Submit your legal articles, case studies, or resources to LexWitness.',
};