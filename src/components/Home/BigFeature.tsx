import Image from "next/image";
import { Post } from "./service";
import Link from "next/link";
const baseUrl = process.env.NEXT_PUBLIC_POSTS_BASE_URL;
export default function BigFeature({ post }: { post?: Post }) {
  if (!post) return null;

  const imageUrl = post.image ? `${baseUrl}/${post.image}` : "/placeholder.jpg";

  return (
    <div
      className="lg:col-span-6 relative overflow-hidden"
      style={{ height: "384px" }}
    >
      <Image
        src={imageUrl}
        alt={post.title || "Post image"}
        fill
        className="object-cover"
        priority={false}
        sizes="(max-width: 1024px) 100vw, 50vw"
      />

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.2) 60%, transparent 100%)",
        }}
      />
      <span className="absolute top-0 left-0 bg-[#c9060a] text-white text-lg px-4 py-1 z-10">
        {post.category?.name}
      </span>

      <div className="absolute bottom-6 left-6 right-6 text-white z-10">
        <Link href={`/${post.slug}`}>
          <h2 className="text-2xl font-semibold leading-snug">{post.title}</h2>
        </Link>
        <p className="text-sm mt-2 opacity-90">{post.publish_date}</p>
        <p className="text-sm mt-1 opacity-80">By {post.author?.name}</p>
      </div>
    </div>
  );
}
