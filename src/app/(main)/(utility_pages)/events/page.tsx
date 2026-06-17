import { events } from "@/data/event";
import Image from "next/image";
import Link from "next/link";

export default function EventsPage() {
  return (
    <section className="py-8 bg-white min-h-screen">
      <div className="text-center max-w-4xl mx-auto mb-6 px-4">
        <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-[#c9060a] border border-red-100">
          LEXWITNESS EVENTS
        </span>

        {/* <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-[#333]">
          Explore Our Events
        </h1> */}

        <div className="w-16 h-0.5 bg-[#c9060a] mx-auto mt-4"></div>

        <p className="mt-2 text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Industry-leading legal summits connecting professionals, policymakers,
          and business leaders.
        </p>
      </div>
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="group bg-white border border-gray-300 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Accent Line */}
            <div className="h-[3px] bg-[#c9060a]" />

            <div className="p-5">
              {/* Logo */}
              <div className="h-24 flex items-center justify-center mb-5">
                <Image
                  src={event.logo}
                  alt={event.title}
                  width={160}
                  height={70}
                  className="object-contain transition duration-300"
                />
              </div>

              {/* Title */}
              <h2 className="text-lg font-semibold text-[#333] leading-snug min-h-[52px]">
                {event.title}
              </h2>

              {/* Description */}
              <p className="mt-3 text-sm text-gray-600 leading-6 min-h-[72px] line-clamp-2">
                {event.description}
              </p>

              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <Link
                  href={event.website}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#c9060a] hover:gap-3 transition-all"
                >
                  Visit Event
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
