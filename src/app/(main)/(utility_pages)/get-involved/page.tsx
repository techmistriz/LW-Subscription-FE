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
        
        </div>     
      </div>
    </section>
  );
};

export default GetInvolvedPage;

export const metadata = {
  title: 'Get Involved - LexWitness',
  description: 'Learn how to participate, contribute, and engage with LexWitness.',
};