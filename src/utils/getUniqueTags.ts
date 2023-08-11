import slug from "slug";
import type { MarkdownInstance } from "astro";
import type { Frontmatter } from "../types";

const getUniqueTags = (posts: any[]) => {
  let tags: string[] = [];
  const filteredPosts = posts.filter(({ frontmatter }) => !frontmatter.draft);
  filteredPosts.forEach((post) => {
    tags = [...tags, ...post.frontmatter.tags]
      .map((tag) => slug(tag))
      .filter(
        (value: string, index: number, self: string[]) =>
          self.indexOf(value) === index
      );
  });
  return tags;
};

export default getUniqueTags;
