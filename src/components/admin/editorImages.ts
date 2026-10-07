import { Node } from "@tiptap/react";

// An image with an editable caption: <figure><img><figcaption>…</figcaption></figure>
export const Figure = Node.create({
  name: "figure",
  group: "block",
  content: "inline*",
  draggable: true,
  isolating: true,

  addAttributes() {
    return { src: { default: null }, alt: { default: "" } };
  },

  parseHTML() {
    return [
      {
        tag: "figure",
        getAttrs: (element) => {
          const img = element.querySelector("img");
          return img ? { src: img.getAttribute("src"), alt: img.getAttribute("alt") ?? "" } : false;
        },
        // the caption is the node's text; a figure saved without one gets an empty caption
        contentElement: (element) =>
          (element as HTMLElement).querySelector("figcaption") ?? document.createElement("figcaption"),
      },
      {
        // a bare image, for example one pasted from another page
        tag: "img[src]",
        getAttrs: (element) => ({ src: element.getAttribute("src"), alt: element.getAttribute("alt") ?? "" }),
      },
    ];
  },

  renderHTML({ node }) {
    return ["figure", ["img", { src: node.attrs.src, alt: node.attrs.alt, loading: "lazy" }], ["figcaption", 0]];
  },
});

// Several figures laid out side by side: <div data-gallery="true"><figure>…</figure>…</div>
export const Gallery = Node.create({
  name: "gallery",
  group: "block",
  content: "figure+",
  isolating: true,

  parseHTML() {
    return [{ tag: "div[data-gallery]" }];
  },

  renderHTML() {
    return ["div", { "data-gallery": "true" }, 0];
  },
});
