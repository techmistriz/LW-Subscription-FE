"use client";

interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({
  message = "Loading...",
}: PageLoaderProps) {
  return (
    <section className="bg-white mt-20 flex items-center justify-center">
      <div className="text-center pb-20 mb-10">
        <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 border-t-[#c9060a] mx-auto" />

        <p className="text-gray-500 text-sm mt-3">{message}</p>
      </div>
    </section>
  );
}
