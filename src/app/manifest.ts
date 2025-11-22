import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Spacio",
    short_name: "Spacio",
    description: "Encuentra el ambiente ideal para tí",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#F24F13",
    icons: [
      {
        src: "/images/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
