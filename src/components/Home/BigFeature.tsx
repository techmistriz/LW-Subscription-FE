import Image from "next/image";
import { Post } from "./service";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_POSTS_BASE_URL;

export default function BigFeature({ post }: { post?: Post }) {
  if (!post) return null;

  const imageUrl = post.image
    ? `${baseUrl}${post.image}`
    : "/placeholder.jpg";

  return (
    <div
      className="lg:col-span-6 relative overflow-hidden"
      style={{ height: "384px" }}
    >
      <Image
        src={imageUrl}
        alt={post.title || "Post image"}
        fill
        priority
        quality={75}
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 600px"
      />

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.4) 60%, transparent 100%)",
        }}
      />

      <Link
        href={`/category/${post?.category?.slug}`}
        className="absolute top-0 left-0 bg-[#c9060a] text-white text-md px-2 py-1 z-10"
      >
        {post.category?.name}
      </Link>

      <div className="absolute bottom-6 left-6 right-6 text-white z-10">
        <Link href={`/${post.slug}`}>
          <h2 className="text-[20px] font-medium leading-7.5 line-clamp-3">
            {post.title}
          </h2>
        </Link>

        <p className="text-sm mt-2 opacity-90">{post.magazine.title}</p>
      </div>
    </div>
  );
}