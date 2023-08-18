import type { SocialsObject } from "./types";

export const SITE = {
  website: "https://darko.io/",
  author: "Darko Bozhinovski",
  desc: "Darko's Corner",
  title: "Darko's Corner",
  ogImage: "default-og.png",
  lightAndDarkMode: true,
  postPerPage: 5,
};

export const LOGO_IMAGE = {
  enable: true,
  svg: true,
  width: 46,
  height: 46,
};

export const SOCIALS: SocialsObject = [
  {
    name: "Github",
    href: "https://github.com/DBozhinovski",
    active: true,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/d_bozhinovski",
    active: true,
  },
  {
    name: "Linkedin",
    href: "https://www.linkedin.com/in/darkobozhinovski/",
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:hello@darko.io",
    active: true,
  },
];
