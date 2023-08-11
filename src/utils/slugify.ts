import slug from "slug";
import type { Frontmatter } from "src/types";

const slugify = (frontmatter: Frontmatter) =>
  frontmatter.slug ? slug(frontmatter.slug) : slug(frontmatter.title);

export const slufigyAll = (arr: string[]) => arr.map((str) => slug(str));

export default slugify;
