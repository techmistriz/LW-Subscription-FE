import { images } from "@/config/images";

export const getImageUrl = (
  image?: string | null,
  baseUrl?: string,
): string => {
  if (!image) return images.placeholder";

  /*----------------- If already full URL -----------------*/
  if (image.startsWith("http")) {
    return image.replace("http://", "https://");
  }

  if (!baseUrl) {
    console.warn("Base URL is missing for image:", image);
    return images.placeholder;
  }

  return `${baseUrl.replace(/\/$/, "")}/${image.replace(/^\//, "")}`;
};
