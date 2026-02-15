import Link from "next/link";
import { Post } from "./service";

export default function AsidePosts({ posts }: { posts: Post[] }) {
  return (
    <aside className="lg:col-span-3 border border-gray-200 p-3 text-sm">
      {posts.map((post) => (
        <div key={post.id}>
          <p className="text-[#c9060a] mt-1">{post.category?.name}</p>
          <Link href={`/${post.slug}`}>
            <p className="text-[#333333] text-md cursor-pointer hover:text-black transition">
              {post.title}
            </p>
          </Link>

          <p className="text-gray-400 text-xs mt-1">{post.publish_date}</p>
          <hr className="mt-2 border-dashed border-gray-200" />
        </div>
      ))}
    </aside>
  );
}
