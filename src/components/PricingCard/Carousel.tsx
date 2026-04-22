// "use client";

// import React, { useEffect, useCallback, useRef } from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import { getMagazines, } from "@/lib/api/services/magazines";
// import { Magazine } from "@/types";

// const imgUrl = process.env.NEXT_PUBLIC_MAGAZINES_BASE_URL;

// export default function VerticalMagazineCarousel() {
//   const [magazines, setMagazines] = React.useState<Magazine[]>([]);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   const [emblaRef, emblaApi] = useEmblaCarousel({
//     loop: true,
//     align: "start",
//     dragFree: true,
//   });

//   // FETCH (unchanged)
//   useEffect(() => {
//     getMagazines().then((res) => setMagazines(res.data || []));
//   }, []);

//   // AUTOPLAY
//   const startAutoScroll = useCallback(() => {
//     if (!emblaApi) return;

//     intervalRef.current = setInterval(() => {
//       emblaApi.scrollNext();
//     }, 1800); // slightly faster
//   }, [emblaApi]);

//   const stopAutoScroll = useCallback(() => {
//     if (intervalRef.current) clearInterval(intervalRef.current);
//   }, []);

//   useEffect(() => {
//     startAutoScroll();
//     return () => stopAutoScroll();
//   }, [startAutoScroll, stopAutoScroll]);

//   const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
//   const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

//   if (!magazines.length) return null;

//   return (
//     <div
//       className="relative w-full max-w-4xl mx-auto" // 👈 reduced width
//       onMouseEnter={stopAutoScroll}
//       onMouseLeave={startAutoScroll}
//     >
//       {/* Fade edges */}
//       <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent z-10" />
//       <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent z-10" />

//       {/* Carousel */}
//       <div className="overflow-hidden" ref={emblaRef}>
//         <div className="flex gap-3">
//           {magazines.map((post) => (
//             <div
//               key={post.id}
//               className="flex-[0_0_auto] w-40" // 👈 smaller card → ~5 visible
//             >
//               <div className="relative h-64 rounded-xl overflow-hidden shadow-md group cursor-pointer">
//                 <img
//                   src={`${imgUrl}/${post.image}`}
//                   alt={post.title}
//                   className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//                 />

//                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

//                 <div className="absolute bottom-0 p-2 text-white">
//                   <h2 className="text-xs font-semibold leading-tight line-clamp-2">
//                     {post.title}
//                   </h2>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Arrows */}
//       <button
//         onClick={scrollPrev}
//         className="absolute top-1/2 left-1 -translate-y-1/2 z-20 bg-black/50 text-white p-1.5 rounded-full"
//       >
//         ◀
//       </button>

//       <button
//         onClick={scrollNext}
//         className="absolute top-1/2 right-1 -translate-y-1/2 z-20 bg-black/50 text-white p-1.5 rounded-full"
//       >
//         ▶
//       </button>
//     </div>
//   );
// }