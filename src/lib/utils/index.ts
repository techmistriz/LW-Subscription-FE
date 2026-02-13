export const toTitleCase = (text: string) =>
  text
    .replace(/-/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());


   export  const toCategoryTitle = (slug: string) =>
  slug.replace(/-/g, " ").toUpperCase();

export    const getYearFromDate = (date: string) => {
  const match = date.match(/\b(20\d{2})\b/);
  return match ? match[1] : null;
};


export function stripInlineStyles(html: string) {
  return html.replace(/style="[^"]*"/g, "");
}



