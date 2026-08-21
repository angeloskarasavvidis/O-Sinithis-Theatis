import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ο Συνήθης Θεατής",
    short_name: "Ο Συνήθης Θεατής",
    start_url: "/",
    display: "standalone",
    icons: [
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
