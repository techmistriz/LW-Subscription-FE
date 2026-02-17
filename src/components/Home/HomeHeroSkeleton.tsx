export default function HomeHeroSkeleton() {
  return (
    <section className="max-w-6xl mx-auto px-4 pt-5 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
        
        {/* Big Feature Skeleton */}
        <div className="lg:col-span-7 h-[420px] bg-gray-300 rounded-md" />

        {/* Middle Cards Skeleton */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <div className="h-[205px] bg-gray-300 rounded-md" />
          <div className="h-[205px] bg-gray-300 rounded-md" />
        </div>

        {/* Aside Posts Skeleton */}
        <div className="lg:col-span-2 border border-gray-200 p-3 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 bg-gray-300 rounded" />
              <div className="h-4 w-full bg-gray-300 rounded" />
              <div className="h-3 w-24 bg-gray-300 rounded" />
              <div className="h-px bg-gray-200 mt-2" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
