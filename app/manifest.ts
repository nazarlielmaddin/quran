import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Quran Sanctuary",
    short_name: "Quran",
    description: "Qur'an dinlə, düşün və sakitlik tap.",
    start_url: "./",
    scope: "./",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#08080b",
    theme_color: "#08080b",
    lang: "az",
    icons: [
      {
        src: "./icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "./icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
