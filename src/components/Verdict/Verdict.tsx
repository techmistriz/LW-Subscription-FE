// components/TestimonialCard.tsx
import React from "react"
import { Testimonial } from "@/types/testimonial"

interface Props {
  data: Testimonial
}

export default function TestimonialCard({ data }: Props) {
  return (
    <div className="relative bg-gray-100 rounded-xl p-10 max-w-4xl mx-auto">
      
      {/* Quote Icon Left */}
      <span className="absolute top-6 left-6 text-red-600 text-5xl font-bold">
        &ldquo;
      </span>

      {/* Quote Icon Right */}
      <span className="absolute bottom-6 right-6 text-red-600 text-5xl font-bold">
        &rdquo;
      </span>

      <p className="text-gray-700 text-lg leading-relaxed mb-8 whitespace-pre-line">
        {data.quote}
      </p>

      <div>
        <h4 className="font-semibold text-gray-900 text-lg">
          {data.author}
        </h4>
        <p className="text-gray-600">
          {data.designation} {data.company && `• ${data.company}`}
        </p>
      </div>
    </div>
  )
}
