// app/about/page.tsx
"use client";

import Banner from "@/components/Common/Banner";
import Link from "next/link";

export default function AboutUsPage() {
  return (
    <section>
      <Banner title={"About Us"} />

      <div className="bg-gray-100 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <h1 className="text-5xl font-semibold text-gray-800 mb-6">About Us</h1>

          {/* Intro Text */}
          <p className="text-lg font-medium text-gray-700 mb-12">
            LexWitness is a premier legal news and analysis platform dedicated to delivering accurate, timely, and insightful content. 
            We aim to simplify complex legal developments for professionals, students, and anyone interested in the law.
          </p>

          {/* Our Story */}
          <div className="mb-12 text-left">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-700 text-md leading-relaxed">
              Founded in 2023, LexWitness was born out of a passion for bridging the gap between legal experts and the public. 
              Our team noticed the lack of accessible, reliable, and well-analyzed legal content, so we created a platform that empowers our readers 
              with clarity, context, and insight into the legal world.
            </p>
          </div>

          {/* Mission */}
          <div className="mb-12 text-left">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-700 text-md leading-relaxed">
              Our mission is to make legal information understandable, reliable, and actionable. 
              We provide news, in-depth analysis, and expert commentary so our audience can stay informed and make confident decisions.
            </p>
          </div>

          {/* Vision */}
          <div className="mb-12 text-left">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-700 text-md leading-relaxed">
              We envision a world where legal knowledge is transparent and accessible to everyone. 
              By simplifying legal complexities, we help our readers navigate the legal landscape with confidence.
            </p>
          </div>

          {/* Values */}
          <div className="mb-12 text-left">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Values</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 text-md">
              <li>Accuracy: We deliver fact-checked and trustworthy content.</li>
              <li>Clarity: We break down complex legal topics into simple insights.</li>
              <li>Integrity: We maintain independence and impartiality in all reporting.</li>
              <li>Accessibility: Legal knowledge should be available to everyone.</li>
            </ul>
          </div>

          {/* Team */}
          <div className="mb-12 text-left">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Team</h2>
            <div className="space-y-4 text-md text-gray-800">
              <p>
                John Doe | CEO | <span className="text-red-600">john@example.com</span>
              </p>
              <p>
                Jane Smith | CTO | <span className="text-red-600">jane@example.com</span>
              </p>
              <p>
                Alex Johnson | COO | <span className="text-red-600">alex@example.com</span>
              </p>
              <p>
                Priya Sharma | Editor-in-Chief | <span className="text-red-600">priya@example.com</span>
              </p>
            </div>
          </div>

       
        </div>
      </div>
    </section>
  );
}

// export const metadata = {
//   title: 'About Us - LexWitness',
//   description: 'Learn about LexWitness, our mission, vision, values, and team delivering reliable legal news and analysis.',
// };