"use client";

import { FaLinkedinIn, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface Props {
  title?: string;
}

export default function SocialShare({ title = "" }: Props) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const socialIcons = [
    {
      Icon: FaLinkedinIn,
      label: "LinkedIn",
      color: "#0A66C2",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl,
      )}`,
    },
    {
      Icon: FaFacebookF,
      label: "Facebook",
      color: "#1877F2",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl,
      )}`,
    },
    {
      Icon: FaXTwitter,
      label: "X",
      color: "#000000",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl,
      )}&text=${encodeURIComponent(title)}`,
    },
    {
      Icon: FaWhatsapp,
      label: "WhatsApp",
      color: "#25D366",
      size: 20,
      href: `https://wa.me/?text=${encodeURIComponent(
        `${title} - ${shareUrl}`,
      )}`,
    },
  ];

  return (
    <div className="flex gap-2">
      {socialIcons.map(({ Icon, label, href, color, size = 18 }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          className="
      group
      flex h-8 w-8 items-center justify-center
      rounded-md
      border border-gray-200
      bg-white/10
      backdrop-blur-md
      shadow-[0_4px_10px_rgba(0,0,0,0.08)]
      transition-all duration-300
      hover:-translate-y-1
      hover:border-[#c8050b]
      hover:shadow-[0_0_0_3px_rgba(201,6,10,0.15),0_8px_20px_rgba(201,6,10,0.12)]
    "
        >
          <Icon
            size={size}
            style={{ color }}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </a>
      ))}
    </div>
  );
}
