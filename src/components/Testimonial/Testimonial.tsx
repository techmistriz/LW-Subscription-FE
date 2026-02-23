import Image from "next/image";

interface TestimonialProps {
  data: {
    reader_feedback?: string;
    reader_name?: string;
    reader_designation?: string;
    text_alignment?: "left" | "right"; // new field
  };
}

export default function TestimonialCard({ data }: TestimonialProps) {
  if (!data) return null;

  // Text alignment classes
  const textAlignClass =
    data.text_alignment === "right" ? "text-right" : "text-left";

  return (
    <div className="relative bg-gray-100 rounded-xl p-6 sm:p-8 md:p-10 max-w-4xl mx-auto">
      {/* Left Quote */}
      <div className="absolute top-4 sm:top-6 md:top-10 left-4 sm:left-6 md:left-6 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
        <Image
          src="/quote-left.png"
          alt="Quote"
          fill
          className="object-contain"
        />
      </div>

      {/* Right Quote */}
      <div className="absolute top-4 sm:top-6 md:top-10 right-4 sm:right-6 md:right-6 rotate-180 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
        <Image
          src="/quote-right.png"
          alt="Quote"
          fill
          className="object-contain"
        />
      </div>

      {/* Feedback Text */}
      <p
        className={`italic w-175 mx-auto text-sm sm:text-md md:text-sm leading-relaxed mb-2 whitespace-pre-line wrap-break-word ${textAlignClass}`}
      >
        {data.reader_feedback || ""}
      </p>

      {/* Author */}
      <div className={textAlignClass}>
        <h4 className="font-semibold mx-7 text-gray-900 text-sm sm:text-md md:text-[16px]">
          {data.reader_name || "Anonymous"}
        </h4>
        {data.reader_designation && (
          <p className="text-gray-600 mx-7 text-xs sm:text-sm md:text-xs">
            {data.reader_designation}
          </p>
        )}
      </div>
    </div>
  );
}