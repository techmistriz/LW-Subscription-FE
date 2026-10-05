import {
  getLatestMagazines,
  getSingleMagazine,
} from "@/services/magazine.service";
import Link from "next/link";
import { notFound } from "next/navigation";
import RelatedPosts from "./RelatedPosts";
import { stripInlineStyles } from "@/utils/toTitleCase";
import LatestEdition from "@/features/home/components/LatestEdition";
import SafeImage from "@/components/media/SafeImage";
import { siteConfig } from "@/config/site";
import { logger } from "@/lib/logger";

const magazineBaseUrl = siteConfig.magazinesImageBaseUrl || "";

/*----------------- Magazine detail page displaying single magazine edition with related posts -----------------*/
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
      limit: 6,
    });
  } catch (error) {
    logger.error("Failed to fetch magazine:", error);
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
      {/*----------------- Main magazine content -----------------*/}
      <section className="flex justify-center">
        <div className="flex w-full max-w-5xl flex-col items-center gap-3 md:flex-row md:items-start md:gap-8">
          {/*----------------- Magazine cover image -----------------*/}
          <div className="w-full shrink-0 sm:w-80 md:w-72">
            <div className="relative aspect-3/4 w-full">
              <SafeImage
                src={
                  magazine.image
                    ? `${magazineBaseUrl}/${magazine.image}`
                    : undefined
                }
                alt={magazine.title || "Magazine cover"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
          </div>

          {/*----------------- Magazine details -----------------*/}
          <div className="w-full flex-1 space-y-2">
            {magazine.magazine_name && (
              <h1 className="md:text-2xl font-semibold">
                {magazine.magazine_name}
              </h1>
            )}

            <p className="md:text-lg text-sm">{magazine.title}</p>

            <hr className="h-0.5 border-0 bg-gray-300" />

            <p className="text-[#c8050b]">Magazine Details</p>

            {/*----------------- Magazine description -----------------*/}
            <div
              className="prose max-w-none text-sm text-gray-700"
              dangerouslySetInnerHTML={{ __html: safeDescription }}
            />

            {/*----------------- Previous issues link -----------------*/}
            <p>
              Check out our previous issues{" "}
              <Link
                href="/magazines"
                className="text-[#c8050b] underline hover:no-underline"
              >
                here
              </Link>
            </p>

            {/*----------------- Subscribe button -----------------*/}
            <button className="cursor-pointer bg-[#c8050b] px-6 py-2 text-white transition-colors hover:bg-[#333333]">
              <Link href="/subscription">Subscribe now</Link>
            </button>
          </div>
        </div>
      </section>

      {/*----------------- Related content sections -----------------*/}
      <RelatedPosts posts={magazine.posts ?? []} />
      <LatestEdition magazines={latestMagazines} />
    </section>
  );
}
