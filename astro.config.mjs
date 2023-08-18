import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import solidJs from "@astrojs/solid-js";
import webmanifest from "astro-webmanifest";

// https://astro.build/config
export default defineConfig({
  experimental: {
    viewTransitions: true,
  },
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "css-variables",
    },
  },
  shikiConfig: {
    wrap: true,
    skipInline: false,
    drafts: true,
  },
  site: "https://darko.io",
  integrations: [
    tailwind(),
    sitemap(),
    mdx(),
    solidJs(),
    webmanifest({
      /**
       * required
       **/
      name: "Darko's Corner",

      /**
       * optional
       **/
      icon: "src/assets/favicon.svg", // source for favicon & icons

      short_name: "Darko's Corner",
      description:
        "Darko's Corner is a blog about web development, community, content creation and much more!",
      start_url: "/",
      theme_color: "#121212",
      background_color: "#FFE9E5",
      display: "standalone",
    }),
  ],
});
