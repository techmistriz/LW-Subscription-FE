export default function HomeHeroSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-pulse">
      {/* TOP GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT BIG CARD */}
        <div className="lg:col-span-6">
          <div className="h-[420px] bg-gray-300 rounded relative overflow-hidden">
            <div className="absolute bottom-6 left-6 space-y-3 w-3/4">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
              <div className="h-8 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-40"></div>
            </div>
          </div>
        </div>

        {/* MIDDLE STACK */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="h-[200px] bg-gray-300 rounded relative">
            <div className="absolute bottom-4 left-4 space-y-2 w-4/5">
              <div className="h-5 bg-gray-200 rounded w-28"></div>
              <div className="h-6 bg-gray-200 rounded w-full"></div>
              <div className="h-6 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>

          <div className="h-[200px] bg-gray-300 rounded relative">
            <div className="absolute bottom-4 left-4 space-y-2 w-4/5">
              <div className="h-5 bg-gray-200 rounded w-24"></div>
              <div className="h-6 bg-gray-200 rounded w-full"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>

        {/* RIGHT LIST */}
        <div className="lg:col-span-3 bg-gray-100 rounded p-4 space-y-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-5 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>

      {/* ADVERTISEMENT */}
      <div className="mt-10 h-24 bg-gray-300 rounded"></div>
    </div>
  );
}
