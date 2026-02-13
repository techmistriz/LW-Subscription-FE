export const getImageUrl = (image?: string | null) => {
  if (!image) return "/placeholder.png";

  // If API already gives full URL
  if (image.startsWith("http")) {
    return image.replace("http://", "https://");
  }

  const base = process.env.NEXT_PUBLIC_MAGAZINES_BASE_URL;
  
  if (!base) {
    console.error("❌ NEXT_PUBLIC_MAGAZINES_BASE_URL is undefined");
    return "/placeholder.png";
  }

  // ✅ FIXED: Proper path construction
  return `${base}/${image}`;
};
