"use client";

import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface Props {
  title: string;
}

export default function SocialShare({ title }: Props) {
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";
  return (
 <div className="flex gap-1">
  {/* LinkedIn */}
  <a
    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="
      w-10 h-6
      flex items-center justify-center
      border border-[#0A66C2]
      text-[#0A66C2]
      bg-white
      shadow-sm
      transition-all duration-300 ease-in
      hover:bg-[#0A66C2]
      hover:text-white
      hover:shadow-lg
      active:translate-y-0
    "
  >
    <svg
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.78v2.22h.07c.66-1.25 2.27-2.57 4.68-2.57 5 0 5.92 3.28 5.92 7.55V24h-5v-7.92c0-1.89-.03-4.33-2.63-4.33-2.63 0-3.03 2.05-3.03 4.17V24h-5V8z" />
    </svg>
  </a>

  {/* Facebook */}
  <a
    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="
      w-10 h-6
      flex items-center justify-center
      border border-[#1877F2]
      text-[#1877F2]
      bg-white
      shadow-sm
      transition-all duration-300 ease-in
      hover:bg-[#1877F2]
      hover:text-white
      hover:shadow-lg
      active:translate-y-0
    "
  >
    <FaFacebookF className="w-4 h-4" />
  </a>

  {/* Twitter/X */}
  <a
    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(title)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="
      w-10 h-6
      flex items-center justify-center
      border border-[#000000]
      text-[#000000]
      bg-white
      shadow-sm
      transition-all duration-300 ease-in
      hover:bg-[#000000]
      hover:text-white
      hover:shadow-lg
      active:translate-y-0
    "
  >
    <FaXTwitter className="w-4 h-4" />
  </a>

  {/* WhatsApp */}
  <a
    href={`https://wa.me/?text=${encodeURIComponent(`${title} - ${shareUrl}`)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="
      w-10 h-6
      flex items-center justify-center
      border border-[#25D366]
      text-[#25D366]
      bg-white
      shadow-sm
      transition-all duration-300 ease-in
      hover:bg-[#25D366]
      hover:text-white
      hover:shadow-lg
      active:translate-y-0
    "
  >
    <svg
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M.057 24l1.687-6.163a11.907 11.907 0 01-1.62-6.126C.124 5.355 5.48 0 12.057 0c3.2 0 6.2 1.25 8.457 3.508a11.894 11.894 0 013.5 8.49c-.003 6.578-5.358 11.933-11.936 11.933a11.89 11.89 0 01-6.19-1.652L.057 24zm6.597-3.807c1.733.995 3.38 1.591 5.403 1.592 5.448 0 9.888-4.441 9.891-9.892.002-2.64-1.03-5.12-2.893-6.987-1.86-1.868-4.337-2.897-6.877-2.895-5.447 0-9.888 4.44-9.891 9.884-.001 2.352.785 4.635 2.22 6.414l-.999 3.648 3.66-.966zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.296-.149-1.758-.868-2.03-.967-.272-.099-.47-.149-.669.15-.198.297-.767.966-.94 1.162-.173.198-.347.223-.644.074-.296-.149-1.248-.46-2.378-1.463-.879-.784-1.472-1.749-1.646-2.046-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413z" />
    </svg>
  </a>
</div>

  );
}

