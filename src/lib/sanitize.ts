import sanitizeHtml from "sanitize-html";

// Server-side sanitising of post HTML. The browser uses DOMPurify for the same job.
export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      div: ["data-gallery"], // marks a row of images written in the editor
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}
