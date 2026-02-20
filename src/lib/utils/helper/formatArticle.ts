export function formatArticleHTML(html: string) {
  if (!html) return "";

  return (
    html
      // Remove inline styles
      .replace(/style="[^"]*"/g, "")
      // Convert double line breaks to paragraph spacing
      .replace(/\r\n\r\n/g, "<br/><br/>")
  );
}