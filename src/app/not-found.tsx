import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f7fb] relative overflow-hidden px-4">

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-size-[50px_50px] opacity-40"></div>

      {/* Content */}
      <div className="relative text-center max-w-xl w-full">

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#333] mb-6">
          ERROR
        </h1>

        {/* 404 */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 text-[80px] sm:text-[120px] md:text-[160px] font-bold text-[#c9060a] leading-none">

          <span>4</span>

          {/* Face */}
          <div className="w-22.5 h-17.5 sm:w-35 sm:h-27.5 md:w-45 md:h-35 rounded-xl sm:rounded-2xl border-[6px] sm:border-8 md:border-10 border-[#c9060a] flex flex-col items-center justify-center">

            {/* Eyes */}
            <div className="flex gap-3 sm:gap-6 mb-2 sm:mb-4">
              <span className="w-2.5 h-2.5 sm:w-4 sm:h-4 bg-[#c9060a] rounded"></span>
              <span className="w-2.5 h-2.5 sm:w-4 sm:h-4 bg-[#c9060a] rounded"></span>
            </div>

            {/* Sad mouth */}
            <div className="w-6 sm:w-10 md:w-12 h-3 sm:h-5 border-b-4 sm:border-b-[5px] md:border-b-[6px] border-[#c9060a] rounded-b-full"></div>
          </div>

          <span>4</span>
        </div>

        {/* Message */}
        <p className="text-gray-600 mt-6 text-sm sm:text-base md:text-lg px-2">
          We can’t seem to find the page you are looking for!
        </p>

        {/* Button */}
        <Link
          href="/"
          className="inline-block mt-6 w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 transition"
        >
          Back to Home Page
        </Link>
      </div>
    </div>
  );
}