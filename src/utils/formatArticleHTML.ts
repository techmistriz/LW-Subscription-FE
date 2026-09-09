import DOMPurify from "dompurify";

function decodeHTMLEntities(value: string): string {
  if (!value) return "";

  // Decode using browser parser
  if (typeof window !== "undefined") {
    const textarea = document.createElement("textarea");

    let result = value;

    // Decode multiple levels:
    // &amp; -> &
    // &amp;amp; -> &
    // &amp;amp;amp; -> &
    for (let i = 0; i < 5; i++) {
      textarea.innerHTML = result;
      const decoded = textarea.value;

      if (decoded === result) {
        break;
      }

      result = decoded;
    }

    return result;
  }

  return value;
}

export function formatArticleHTML(html: string): string {
  if (!html) return "";

  let formattedHTML = html;

  // 1. Decode entities BEFORE sanitizing
  formattedHTML = decodeHTMLEntities(formattedHTML);

  // 2. Convert remaining common entities
  formattedHTML = formattedHTML
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .replace(/&#xA0;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#38;/gi, "&")
    .replace(/&#x26;/gi, "&");

  // 3. Remove inline styles
  formattedHTML = formattedHTML.replace(/\sstyle\s*=\s*(["']).*?\1/gi, "");

  // 4. Remove dangerous event attributes
  formattedHTML = formattedHTML
    .replace(/\son\w+\s*=\s*(["']).*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/vbscript\s*:/gi, "");

  // 5. Normalize line breaks
  formattedHTML = formattedHTML.replace(/\r?\n\s*\r?\n/g, "<br/><br/>");

  // 6. Sanitize
  if (typeof window !== "undefined") {
    formattedHTML = DOMPurify.sanitize(formattedHTML, {
      USE_PROFILES: {
        html: true,
      },

      FORBID_TAGS: [
        "script",
        "iframe",
        "object",
        "embed",
        "form",
        "input",
        "button",
        "textarea",
        "select",
        "style",
        "link",
        "meta",
        "base",
      ],

      FORBID_ATTR: [
        "style",
        "onclick",
        "onload",
        "onerror",
        "onmouseover",
        "onmouseenter",
        "onmouseleave",
        "onfocus",
        "onblur",
      ],
    });
  }

  // 7. Final cleanup of amp entities
  formattedHTML = formattedHTML
    .replace(/&amp;/gi, "&")
    .replace(/&#38;/gi, "&")
    .replace(/&#x26;/gi, "&")
    .trim();

  return formattedHTML;
}

export function stripHTML(html: string): string {
  if (!html) return "";

  if (typeof window === "undefined") {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&amp;/gi, "&")
      .replace(/\s+/g, " ")
      .trim();
  }

  const div = document.createElement("div");
  div.innerHTML = html;

  return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
}
