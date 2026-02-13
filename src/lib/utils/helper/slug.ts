

export const slugify = (text?: string): string => {
  if (!text) return "";

  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .normalize("NFD") // remove accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") // remove duplicate dashes
    .replace(/^-+|-+$/g, ""); // remove leading/trailing dash
};
