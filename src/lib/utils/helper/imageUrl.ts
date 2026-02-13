export const getImageUrl = (
  image?: string | null,
  baseUrl?: string
): string => {
  if (!image) return "/placeholder.jpg";

  // If already full URL
  if (image.startsWith("http")) {
    return image.replace("http://", "https://");
  }

  if (!baseUrl) {
    console.warn("Base URL is missing for image:", image);
    return "/placeholder.jpg";
  }

  return `${baseUrl.replace(/\/$/, "")}/${image.replace(/^\//, "")}`;
};
