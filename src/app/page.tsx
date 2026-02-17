import dynamic from "next/dynamic";

import HomeHeroSkeleton from "@/components/Home/HomeHeroSkeleton";
import SubscribeBanner from "@/components/Auth/SubscribeBanner";
import LatestEdition from "@/components/LatestEdition/LatestEdition";
import LatestIssueWithArticles from "@/components/LatestEdition/LatestIssueWithArticles";
import BigFeature from "@/components/Home/BigFeature";
import { MiddleCards } from "@/components/Home/MiddleCards";
import AsidePosts from "@/components/Home/AsidePosts";

import {
  get1LatestPost,
  get2LatestPost,
  get4LatestPost,
} from "@/components/Home/service";

import {
  getLatestMagazines,
  getLatestSingleMagazines,
} from "@/lib/api/services/magazines";

import { getPosts } from "@/lib/api/services/posts";

export const revalidate = 60;

// Lazy load non-critical components
const EditorPicks = dynamic(
  () => import("@/components/EditorPick's/EditorPicks"),
);

const Advertisement = dynamic(
  () => import("@/components/HomeAdvertisment/advertisement"),
);

export default async function HomePage() {
  //  Parallel initial fetch
  const [latestPosts, latest2Posts, latest4Post, latestSingle] =
    await Promise.all([
      get1LatestPost(),
      get2LatestPost(),
      get4LatestPost(),
      getLatestSingleMagazines(),
    ]);

  // Run remaining requests in parallel (if possible)
  const [latestFive, postsResponse] = await Promise.all([
    getLatestMagazines({
      skipId: latestSingle?.id,
      limit: 5,
    }),
    latestSingle?.id
      ? getPosts({
          magazine_id: Number(latestSingle.id),
          limit: 3,
        })
      : Promise.resolve([]),
  ]);

  const articles = Array.isArray(postsResponse)
    ? postsResponse
    : (postsResponse?.data ?? []);

  return (
    <main className="bg-white">
      {/* Top Section */}
      {/* <section className="max-w-6xl mx-auto px-4 pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
          <BigFeature post={latestPosts} />
          <MiddleCards posts={latest2Posts} />
          <AsidePosts posts={latest4Post} />
        </div>
      </section> */}

      <section className="max-w-6xl mx-auto px-4 pt-5">
        {latestPosts && latest2Posts?.length && latest4Post?.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
            <BigFeature post={latestPosts} />
            <MiddleCards posts={latest2Posts} />
            <AsidePosts posts={latest4Post} />
          </div>
        ) : (
          <HomeHeroSkeleton />
        )}
      </section>

      {/* Advertisement */}
      <Advertisement />

      {/* Editor Picks */}
      <EditorPicks />

      {/* Subscribe Banner */}
      <SubscribeBanner />

      {/* Latest Issue */}
      {latestSingle && (
        <section className="max-w-6xl mx-auto px-4 py-10">
          <LatestIssueWithArticles
            magazine={latestSingle}
            articles={articles}
          />
        </section>
      )}

      {/* Latest Editions */}
      <LatestEdition magazines={latestFive} />
    </main>
  );
}
