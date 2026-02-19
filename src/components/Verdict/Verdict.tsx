// components/TestimonialCard.tsx
import React from "react";
import { Testimonial } from "@/types/testimonial";
import Image from "next/image";

interface Props {
  data: Testimonial;
}

export default function TestimonialCard({ data }: Props) {
  return (
    <div className="relative bg-gray-100 rounded-xl p-10 max-w-4xl mx-auto">
      {/* Left Quote Image */}
      <div className="absolute top-10 left-6">
        <Image src="/quote-left.png" alt="Quote" width={30} height={30} />
      </div>

      {/* Right Quote Image */}
      <div className="absolute top-10 right-6 rotate-180">
        <Image src="/quote-right.png" alt="Quote" width={30} height={30} />
      </div>

      <p className="text-gray-700 italic text-md leading-relaxed  w-180 ml-6 mb-2 whitespace-pre-line wrap-break-word">
        {data.reader_feedback}
      </p>

      <div>
        <h4 className="font-semibold ml-6 text-gray-900 text-md">
          {data.reader_name}
        </h4>

        {data.reader_designation && (
          <p className="text-gray-600 ml-6 text-xs">
            {data.reader_designation}
          </p>
        )}
      </div>
    </div>
  );
}
