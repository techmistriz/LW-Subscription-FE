"use client";

import { Facebook, Twitter, Linkedin, Share2, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  title: string;
}

export default function SocialShare({ title }: Props) {
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);



  // const handleShare = async () => {
  //   if (!shareUrl) return;

  //   try {
  //     if (navigator.share) {
  //       await navigator.share({
  //         title,
  //         url: shareUrl,
  //       });
  //     } else {
  //       await navigator.clipboard.writeText(shareUrl);
  //       alert("Link copied!");
  //     }
  //   } catch (error) {
  //     console.error("Share failed:", error);
  //   }
  // };

  const handleWhatsAppShare = () => {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = `${title} - ${url}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, "_blank");
};

  return (
    <div className="flex gap-2">
      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareUrl
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-6 h-6 bg-[#0A66C2]  text-white flex items-center justify-center cursor-pointer hover:bg-[#c9060a]"
      >
        <Linkedin size={16} />
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-6 h-6 bg-[#1877F2] text-white flex items-center justify-center cursor-pointer hover:bg-[#c9060a]"
      >
        <Facebook size={16} />
      </a>

      {/* Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareUrl
        )}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-6 h-6 bg-[#1DA1F2] text-white flex items-center justify-center cursor-pointer hover:bg-[#c9060a]"
      >
        <Twitter size={16} />
      </a>

      {/* Native Share
      <button
        onClick={handleShare}
        className="w-6 h-6 bg-gray-500 text-white flex items-center justify-center cursor-pointer hover:bg-[#c9060a]"
      >
        <Share2 size={16} />
      </button> */}

      {/* whatsapp */}
     <button
  onClick={handleWhatsAppShare}
  className="w-6 h-6 bg-[#25D366] text-white flex items-center justify-center cursor-pointer hover:bg-[#1ebe5d]"
>
  <MessageCircle size={16} />
</button>
    </div>
  );
}