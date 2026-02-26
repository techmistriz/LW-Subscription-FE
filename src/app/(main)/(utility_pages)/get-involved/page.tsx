import Banner from "@/components/Common/Banner";
import Link from "next/link";

const GetInvolvedPage = () => {
  return (
    <section className="w-full">
      <Banner title={"Get Involved"} />

      <div className="min-h-screen bg-gray-50">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">

          {/* Intro */}
          <section className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight">
              Get Involved
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Join LexWitness in advancing legal knowledge and making legal resources accessible.
            </p>
          </section>

          {/* Ways to Contribute */}
          <section className="space-y-5 sm:space-y-6 text-gray-700 leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 border-b border-gray-300 pb-2">
              Ways to Contribute
            </h2>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base">
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
  title: "Get Involved - LexWitness",
  description:
    "Learn how to participate, contribute, and engage with LexWitness.",
};