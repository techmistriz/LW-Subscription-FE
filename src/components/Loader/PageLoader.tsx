"use client";

interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({
  message = "Loading...",
}: PageLoaderProps) {
  return (
    <section className="bg-white mt-20   flex items-center justify-center">
      <div className="text-center ">
        <div className="animate-spin rounded-full h-12   w-12 border-b-2 border-[#c9060a] mx-auto my-auto " />
        <p className="text-gray-500 text-lg">{message}</p>
      </div>
    </section>
  );
}
