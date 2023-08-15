export interface Template {
  url: string;
  img: string;
  title: string;
  description: string;
};
const one: Template = {
  url: "#",
  img: "https://ph-files.imgix.net/36f005a8-e15e-41a8-872e-8a26485232e5.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=64&h=64&fit=crop&dpr=2",
  title: "Color & fonts",
  description: "Colorsandfonts.com is a website that provides a curated collection of color palettes, typography, and fonts for designers. It also includes design inspirations and resources to help designers make informed decisions about their design choices.",
};
const two: Template = {
  url: "#",
  img: "https://ph-files.imgix.net/3c4c725d-7785-4d86-82a1-6e1350d65d90.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=80&h=80&fit=crop&dpr=2",
  title: "Sketch",
  description: "Sketch is a popular vector graphics editor that is specifically designed for UI/UX designers. It provides a wide range of tools and plugins that can be used to create high-fidelity designs and prototypes.",
};
const three: Template = {
  url: "#",
  img: "https://ph-files.imgix.net/3f126ae6-70a4-4d85-bc18-c6fd53b99b8a.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=72&h=72&fit=crop&bg=0fff&dpr=2",
  title: "Adobe Creative Suite",
  description: "The Adobe Creative Suite is a collection of software tools that includes Photoshop, Illustrator, InDesign, and more. These tools are widely used by designers to create and manipulate images, graphics, and other visual elements.",
};
const four: Template = {
  url: "#",
  img: "https://ph-files.imgix.net/db00a7a1-6778-4e51-a953-de5a9a339bc9.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=80&h=80&fit=crop&dpr=2",
  title: "Figma",
  description: "Figma is a web-based design and prototyping tool that is widely used by UI/UX designers. It allows designers to collaborate in real-time and create interactive prototypes that can be shared with stakeholders for feedback.",
};
const five: Template = {
  url: "#",
  img: "https://ph-files.imgix.net/55118d00-9d14-4d9d-956f-debb3dbaf6e8.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=64&h=64&fit=crop&dpr=2",
  title: "Serendipity Theme",
  description: "Serendipity is a theme for the Visual Studio Code editor that features a dark background with bright colors for syntax highlighting. It aims to improve the readability and visual appeal of code by using vibrant colors and consistent formatting.",
};
const six: Template = {
  url: "#",
  img: "https://ph-files.imgix.net/d4cd1074-aacb-46bd-9da3-76c15ba48873.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=80&h=80&fit=crop&bg=0fff&dpr=2",
  title: "Windstatic",
  description: "A set of 161 elements & layouts made with Tailwind CSS and Alpine.js.Skillfully designed with an eye for aesthetics, offering an excellent starting point for your upcoming project.",
};
const seven: Template = {
  url: "#",
  img: "https://ph-files.imgix.net/829bdf09-bf73-4976-ae80-8eb1ec6b455d.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=80&h=80&fit=crop&dpr=2",
  title: "Tailwind CSS",
  description: "Tailwind CSS is a utility-first CSS framework that helps developers create responsive and customizable UIs quickly, without writing custom CSS code. It provides pre-built CSS classes for styling HTML elements.",
};
const eight: Template = {
  url: "#",
  img: "https://ph-files.imgix.net/3f76440f-e5f1-47fd-a07c-9ebad055757b.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=80&h=80&fit=crop&bg=0fff&dpr=2",
  title: "Monoqrom",
  description: "Monoqrom is a quick method to start your design projects in Figma and/or the code version built with Astro and Tailwind CSS.",
};
export const byName = {
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight
};
export const designResources = Object.values(byName);
