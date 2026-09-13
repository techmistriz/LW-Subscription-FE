export default function VerifyEmailSkeleton() {
  return (
    <div className="w-full max-w-lg animate-pulse">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
        <div className="px-6 py-10 sm:px-10 sm:py-12">
          <div className="flex flex-col items-center text-center">
            {/* Top Icon Circle Placeholder */}
            <div className="mb-6 h-20 w-20 rounded-full bg-gray-200" />

            {/* Subtitle / Category Placeholder */}
            <div className="mb-3 h-3 w-32 rounded bg-gray-200" />

            {/* Main Heading Placeholder */}
            <div className="mb-4 h-7 w-64 rounded-md bg-gray-200" />

            {/* Paragraph Line 1 & Line 2 Placeholders */}
            <div className="mb-2 h-4 w-80 max-w-full rounded bg-gray-200" />
            <div className="mb-8 h-4 w-56 max-w-full rounded bg-gray-200" />

            {/* Action Button Placeholder */}
            <div className="h-11 w-full rounded-lg bg-gray-200" />
          </div>
        </div>

        {/* Bottom Accent Line Placeholder */}
        <div className="h-1 bg-gray-200" />
      </div>
    </div>
  );
}
