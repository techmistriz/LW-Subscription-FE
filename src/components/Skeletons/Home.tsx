export default function HomeHeroSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 animate-pulse">
      
      {/* Big Feature */}
      <div className="lg:col-span-7 h-[400px] bg-gray-200 rounded" />

      {/* Middle */}
      <div className="lg:col-span-3 flex flex-col gap-2">
        <div className="h-[195px] bg-gray-200 rounded" />
        <div className="h-[195px] bg-gray-200 rounded" />
      </div>

      {/* Aside */}
      <div className="lg:col-span-2 h-[400px] bg-gray-200 rounded" />
    </div>
  );
}