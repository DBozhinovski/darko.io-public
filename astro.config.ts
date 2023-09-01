import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import solidJs from "@astrojs/solid-js";
import webmanifest from "astro-webmanifest";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import fs from "node:fs";
import parseFrontmatter from "gray-matter";

const render = (title) => ({
  type: "div",
  props: {
    style: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#111111",
      padding: "55px 70px",
      color: "#FFFFFF",
      fontFamily: "JetBrains Mono",
      fontSize: 64,
    },
    children: [
      {
        type: "svg",
        props: {
          xmlns: "http://www.w3.org/2000/svg",
          width: "32.758",
          height: "48",
          viewBox: "0 0 32.758 48",
          fill: "none",
          children: [
            {
              type: "rect",
              props: {
                x: "0.753",
                y: "39.227",
                fill: "#eeeeee",
                width: "31.47",
                height: "4.938",
              },
            },
            {
              type: "path",
              props: {
                d: `M30.427,11.28c-1.406-2.319-3.333-4.142-5.779-5.464c-2.447-1.32-5.204-1.981-8.269-1.981
              c-3.066,0-5.829,0.661-8.29,1.981C5.627,7.138,3.701,8.96,2.309,11.28c-1.392,2.321-2.089,4.93-2.089,7.826
              c0,2.897,0.696,5.506,2.089,7.825c1.392,2.32,3.318,4.143,5.78,5.464c1.69,0.907,3.526,1.497,5.501,1.781v-6.008
              c-0.677-0.196-1.324-0.466-1.937-0.815c-1.407-0.802-2.51-1.919-3.312-3.353c-0.801-1.435-1.202-3.065-1.202-4.895
              c0-1.828,0.401-3.46,1.202-4.895c0.802-1.435,1.905-2.552,3.312-3.354c1.406-0.801,2.981-1.202,4.725-1.202
              c1.744,0,3.318,0.401,4.725,1.202c1.406,0.802,2.511,1.919,3.313,3.354c0.801,1.435,1.202,3.066,1.202,4.895
              c0,1.829-0.401,3.46-1.202,4.895c-0.802,1.434-1.906,2.551-3.313,3.353c-0.547,0.313-1.12,0.561-1.718,0.753v6.037
              c1.888-0.295,3.644-0.874,5.263-1.748c2.447-1.321,4.373-3.144,5.779-5.464c1.406-2.319,2.11-4.928,2.11-7.825
              C32.537,16.209,31.833,13.601,30.427,11.28z`,
                fill: "#ffffff",
                fillOpacity: "0.75",
              },
            },
          ],
        },
      },
      {
        type: "div",
        props: {
          style: { marginTop: 64 },
          children: title,
        },
      },
      {
        type: "div",
        props: {
          style: { marginTop: 48, fontSize: 24, color: "#eeeeee" },
          children: "Darko's Corner | https://darko.io",
        },
      },
      {
        type: "div",
        props: {
          style: { marginTop: 16, fontSize: 18, color: "#eeeeee" },
          children: "webdev | community | content",
        },
      },
      {
        type: "img",
        props: {
          src: "https://darko.io/b-w-profile.jpg",
          width: "160px",
          height: "160px",
          style: {
            position: "absolute",
            right: 60,
            bottom: 60,
            borderRadius: "9999px",
            transform: "scaleX(-1)",
          },
        },
      },
    ],
  },
});

const og = () => ({
  name: "satori-og",
  hooks: {
    "astro:build:done": async ({ dir, pages }) => {
      try {
        const jetBrainsMono = fs.readFileSync(
          "public/JetBrainsMono-Regular.ttf"
        );

        for (const { pathname } of pages) {
          console.log("pathname", pathname);
          if (pathname && pathname.startsWith("posts/")) {
            console.log(
              "reading",
              `src/content/${pathname.slice(0, pathname.length - 1)}.md`
            );
            const file = fs.readFileSync(
              `src/content/${pathname.slice(0, pathname.length - 1)}.md`
            );

            const { title } = parseFrontmatter(file).data;

            const svg = await satori(render(title), {
              width: 1200,
              height: 630,
              fonts: [
                {
                  name: "JetBrains Mono",
                  data: jetBrainsMono,
                  weight: 400,
                  style: "normal",
                },
              ],
            });

            const resvg = new Resvg(svg, {
              fitTo: {
                mode: "width",
                value: 1200,
              },
            });
            fs.writeFileSync(
              `${dir.pathname}${pathname}og.png`,
              resvg.render().asPng()
            );
          }
        }

        console.log(`\x1b[32mog:\x1b[0m Generated OpenGraph images\n`);
      } catch (e) {
        console.error(e);
        console.log(`\x1b[31mog:\x1b[0m OpenGraph image generation failed\n`);
      }
    },
  },
});

// https://astro.build/config
export default defineConfig({
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
    og(),
  ],
});
