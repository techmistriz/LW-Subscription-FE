import Image from "next/image";

interface TestimonialProps {
  data: {
    reader_feedback?: string;
    reader_name?: string;
    reader_designation?: string;
  };
}

export default function TestimonialCard({ data }: TestimonialProps) {
  if (!data) return null; // Safety check

  return (
    <div className="relative bg-gray-100 rounded-xl p-10 max-w-4xl mx-auto">
      <div className="absolute top-10 left-6">
        <Image src="/quote-left.png" alt="Quote" width={30} height={30} />
      </div>
      <div className="absolute top-10 right-6 rotate-180">
        <Image src="/quote-right.png" alt="Quote" width={30} height={30} />
      </div>

      <p className="text-gray-700 italic text-md leading-relaxed w-180 ml-6 mb-2 whitespace-pre-line break-words">
        {data.reader_feedback || ""}
      </p>

      <div>
        <h4 className="font-semibold ml-6 text-gray-900 text-md">
          {data.reader_name || "Anonymous"}
        </h4>
        {data.reader_designation && (
          <p className="text-gray-600 ml-6 text-xs">{data.reader_designation}</p>
        )}
      </div>
    </div>
  );
}
