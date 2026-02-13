import Link from "next/link";
import Image from "next/image";
import { Magazine } from "@/lib/types.ts";


const magazineBaseUrl =
  process.env.NEXT_PUBLIC_MAGAZINES_BASE_URL || "";

type Props = {
  magazines: Magazine[];
};

export default function LatestEdition({ magazines }: Props) {
  if (!magazines?.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 my-10">
      {/* Section header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl text-[#333333] font-semibold tracking-wide">
          LATEST EDITIONS
        </h2>
        <div className="w-14 h-1.5 bg-[#c9060a] mx-auto mt-1"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {magazines.map((magazine) => (
          <Link
            key={magazine.id}
            href={`/magazines/${magazine.slug}`}
            className="bg-[#F8F8F8] border shadow-md border-gray-300 flex flex-col items-center transition-all hover:shadow-gray-400 hover:shadow-md cursor-pointer"
          >
            <div className="relative w-full aspect-3/4">
              <Image
                src={
                  magazine.image
                    ? `${magazineBaseUrl}/${magazine.image}`
                    : "/placeholder.jpg"
                }
                alt={magazine.title ?? "Magazine cover"}
                fill
                className="object-cover"
              />
            </div>

            <div className="px-3 py-3 text-center">
              <h3 className="text-sm font-medium leading-snug">
                {magazine.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center items-center mt-8">
        <Link
          href="/magazines"
          className="bg-[#c9060a] border border-white text-white text-lg px-6 py-2 hover:bg-[#a00508] transition-colors"
        >
          View All Editions
        </Link>
      </div>
    </section>
  );
}
