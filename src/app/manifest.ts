import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Plan My Itinerary — AI-Powered Travel Itinerary Generator",
    short_name: "Plan My Itinerary",
    description:
      "AI-powered travel itinerary generator. Create personalised, day-by-day trip plans for any destination in seconds — free and tailored to your style.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#faf7f0",
    theme_color: "#0f1f3d",
    categories: ["travel", "lifestyle", "productivity"],
    icons: [
      {
        src: "/icon1",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon2",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon2",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
