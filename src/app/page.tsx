import BannerSubscribe from "./(auth)/subscribe/bannerForm";
import LatestEdition from "./components/LatestEdition/LatestEdition";
import LatestIssueWithArticles from "./components/LatestEdition/LatestIssueWithArticles";
import EditorPicks from "./components/EditorPick's/EditorPicks";
import BigFeature from "./components/Home/BigFeature";
import { MiddleCards } from "./components/Home/MiddleCards";
import AsidePosts from "./components/Home/AsidePosts";

export const dynamic = "force-dynamic";

import {
  get1LatestPost,
  get2LatestPost,
  get4LatestPost,
} from "./components/Home/service";

import {
  getLatestMagazines,
  getLatestSingleMagazines,
} from "@/lib/api/magazines";

import { getPosts } from "@/lib/api/posts"; // ✅ ADD THIS

export default async function HomePage() {
  const latestPosts = await get1LatestPost();
  const latest2Posts = await get2LatestPost();
  const latest4Post = await get4LatestPost();

  // ✅ 1️⃣ Latest single magazine
  const latestSingle = await getLatestSingleMagazines();

  // ✅ 2️⃣ Latest five excluding single
  const latestFive = await getLatestMagazines({
    skipId: latestSingle?.id,
    limit: 5,
  });

  // ✅ 3️⃣ Fetch related articles
  let articles: any[] = [];

  if (latestSingle?.id) {
    const postsResponse = await getPosts({
      magazine_id: Number(latestSingle.id),
      limit: 3,
    });

    articles = Array.isArray(postsResponse)
      ? postsResponse
      : (postsResponse?.data ?? []);
  }

  return (
    <main className="bg-white">
      <section className="max-w-6xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
          <BigFeature post={latestPosts} />
          <MiddleCards posts={latest2Posts} />
          <AsidePosts posts={latest4Post} />
        </div>
      </section>

      {/* Advertisement */}
      <section className="max-w-6xl mx-auto px-4 my-8">
        <div className="h-20 bg-[#F8F8F8] text-xl text-[#333333] sm:text-2xl flex items-center justify-center">
          Advertisement
        </div>
      </section>

      <EditorPicks />
      <BannerSubscribe />

      {/* Latest Issue Section */}
      <section className="max-w-6xl mx-auto px-4 py-10">
{latestSingle && (
  <LatestIssueWithArticles
    magazine={latestSingle}
    articles={articles}
  />
)}
      </section>

      {/* Latest Editions Grid */}
      <LatestEdition magazines={latestFive} />
    </main>
  );
}
