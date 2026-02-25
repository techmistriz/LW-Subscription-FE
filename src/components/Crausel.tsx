"use client";

import { Magazine } from "@/types";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Navigation } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css";
import "swiper/css/effect-coverflow";

type Props = {
  magazines: Magazine[];
};

export default function SubscriptionCarousel({ magazines }: Props) {
  if (!magazines.length) return null;

  return (
 <div className="py-20 bg-white">
  <h2 className="text-3xl font-bold text-center mb-12">
    Experience the Best
  </h2>

  <div className="relative max-w-4xl mx-auto">
    
    {/* Custom Arrows */}
    <div className="custom-prev absolute left-[-60px] top-1/2 -translate-y-1/2 z-10 cursor-pointer">
      <div className="w-12 h-12 flex ml-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-red-600 hover:text-white transition">
        ←
      </div>
    </div>

    <div className="custom-next absolute right-[-60px] top-1/2 -translate-y-1/2 z-10 cursor-pointer">
      <div className="w-12 h-12 flex items-center justify-center mr-10 rounded-full bg-white shadow-lg hover:bg-red-600 hover:text-white transition">
        →
      </div>
    </div>

    <Swiper
      effect="coverflow"
      centeredSlides={true}
      slidesPerView="auto"
      loop={true}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      navigation={{
        nextEl: ".custom-next",
        prevEl: ".custom-prev",
      }}
      coverflowEffect={{
        rotate: 30,
        stretch: 0,
        depth: 150,
        modifier: 1,
        slideShadows: true,
      }}
      modules={[EffectCoverflow, Autoplay, Navigation]}
      className="w-full"
    >
        {magazines.map((mag) => (
          <SwiperSlide
            key={mag.id}
            className="!w-[230px] !h-[390px] relative"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl">
              <Image
                src={`${process.env.NEXT_PUBLIC_MAGAZINES_BASE_URL}/${mag.image}`}
                alt={mag.title}
                fill
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    </div>
  );
}