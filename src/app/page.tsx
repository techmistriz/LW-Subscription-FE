import dynamic from "next/dynamic";
import { Suspense } from "react";

import HomeHeroSkeleton from "@/features/home/components/HomeHeroSkeleton";
import SubscribeBanner from "@/features/auth/components/SubscribeBanner";
import LatestEdition from "@/features/home/components/LatestEdition";
import LatestEditionWithArticles from "@/features/home/components/LatestEditionWithArticles";
import BigFeature from "@/features/home/components/BigFeature";
import { MiddleCards } from "@/features/home/components/MiddleCards";
import AsidePosts from "@/features/home/components/AsidePosts";

import { getHeroPost } from "@/features/home/services/home.service";
import {
  getLatestMagazines,
  latestEdition,
} from "@/lib/api/services/magazines";

export const revalidate = 300;

/*----------------- Lazy load non-critical components -----------------*/
const EditorPicks = dynamic(
  () => import("@/features/editor-picks/components/EditorPicks"),
);

const Advertisement = dynamic(
  () => import("@/features/home/components/Advertisement"),
);

export default async function HomePage() {
  /*----------------- Fetch hero + latest edition in parallel -----------------*/
  const [heroData, latestEditionData] = await Promise.all([
    getHeroPost(),
    latestEdition(),
  ]);

  /*----------------- Latest magazines except current edition -----------------*/
  const latestFive = latestEditionData
    ? await getLatestMagazines({
        skipId: latestEditionData.magazine.id,
        limit: 5,
      })
    : [];

  /*----------------- Hero layout posts -----------------*/
  const firstPost = heroData?.slice(0, 1) || [];
  const middlePosts = heroData?.slice(1, 3) || [];
  const asidePosts = heroData?.slice(3) || [];

  const hasHeroContent =
    firstPost.length > 0 && middlePosts.length > 0 && asidePosts.length > 0;

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-5">
        {hasHeroContent ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
            <BigFeature post={firstPost[0]} />
            <MiddleCards posts={middlePosts} />
            <AsidePosts posts={asidePosts} />
          </div>
        ) : (
          <HomeHeroSkeleton />
        )}
      </section>

      {/* Advertisement */}
      <Suspense fallback={null}>
        <Advertisement />
      </Suspense>

      {/* Editor Picks */}
      <Suspense fallback={null}>
        <EditorPicks />
      </Suspense>

      {/* Subscribe Banner */}
      <SubscribeBanner />

      {/* Latest Issue */}
      {latestEditionData && (
        <section className="max-w-6xl mx-auto px-4 py-10 lg:pb-0">
          <LatestEditionWithArticles
            latestEdition={latestEditionData.magazine}
            posts={latestEditionData.posts}
          />
        </section>
      )}

      {/* Latest Magazines */}
      <LatestEdition magazines={latestFive} />
    </main>
  );
}
