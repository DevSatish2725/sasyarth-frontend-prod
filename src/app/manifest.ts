import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sasyarth",
    short_name: "Sasyarth",

    description:
      "Discover trusted local sellers and fresh produce near you.",

    start_url: "/",

    display: "standalone",

    background_color: "#FFFDF7",

    theme_color: "#159447",

    orientation: "portrait",

    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },

      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },

      {
        src: "/icons/icon-512x512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}