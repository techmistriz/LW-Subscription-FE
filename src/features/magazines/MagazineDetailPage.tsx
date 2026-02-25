import {
  getLatestMagazines,
  getSingleMagazine,
} from "@/lib/api/services/magazines";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import RelatedPosts from "./RelatedPosts";
import { stripInlineStyles } from "@/lib/utils/helper/toTitleCase";
import LatestEdition from "@/components/LatestEdition/LatestEdition";

const magazineBaseUrl = process.env.NEXT_PUBLIC_MAGAZINES_BASE_URL || "";

/**
 * Magazine detail page displaying single magazine edition with related posts
 */
type Props = {
  params: { slug: string };
};
export default async function MagazineDetailPage({ params }: Props) {
  const { slug } = await params;

  let magazine;
  let latestMagazines = [];

  try {
    magazine = await getSingleMagazine(slug);
    latestMagazines = await getLatestMagazines({
      skipId: magazine.id,
      limit: 5,
    });
  } catch (error) {
    console.error("Failed to fetch magazine:", error);
    notFound();
  }

  if (!magazine?.title) {
    notFound();
  }

  const safeDescription =
    magazine.description && magazine.description.trim()
      ? stripInlineStyles(magazine.description)
      : "<p>Description not available.</p>";

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* Main magazine content */}
      <section className="flex justify-center">
        <div className="flex flex-col md:flex-row gap-8 items-center max-w-5xl w-full">
          {/* Magazine cover image */}
          <div className="w-full sm:w-80 md:w-72 shrink-0">
            <div className="relative w-full aspect-3/4">
              <Image
                src={
                  magazine.image
                    ? `${magazineBaseUrl}/${magazine.image}`
                    : "/placeholder.jpg"
                }
                alt={magazine.title || "Magazine cover"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
          </div>

          {/* Magazine details */}
          <div className="space-y-2 -mt-18 flex-1">
            {magazine.magazine_name && (
              <h1 className="font-semibold text-2xl">
                {magazine.magazine_name}
              </h1>
            )}
            <p className=" border-gray-300 text-lg">{magazine.title}</p>
            <hr className="h-0.5 bg-gray-300 border-0" />

            <p className="text-[#c9060a]">Magazine Details</p>

            {/* Magazine description */}
            <div
              className="prose max-w-none text-gray-700 text-sm"
              dangerouslySetInnerHTML={{ __html: safeDescription }}
            />

            {/* Previous issues link */}
            <p>
              Check out our previous issues{" "}
              <Link
                href="/magazines"
                className="text-[#c9060a] underline hover:no-underline"
              >
                here
              </Link>
            </p>

            {/* Subscribe button */}
            <button className="bg-[#c9060a] hover:bg-[#333333] text-white px-6 py-2 cursor-pointer transition-colors">
              <Link href="/register">Subscribe now</Link>
            </button>
          </div>
        </div>
      </section>

      {/* Related content sections */}
      <RelatedPosts posts={magazine.posts} />
      <LatestEdition magazines={latestMagazines} />
    </section>
  );
}
