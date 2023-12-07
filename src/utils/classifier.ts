import { getCollection } from "astro:content";

import { findRelated as find, tfIdf } from "astro-relatinator";

const blogEntries = await getCollection("posts");

// const trainingData = blogEntries.map((entry) => ({
//   id: entry.id,
//   content: `${entry.data.title} ${entry.data.description} ${entry.data.tags
//     .map((tag) => tag)
//     .join(" ")} ${entry.body}`,
// }));

// train(trainingData);

export const findRelated = (
  id: string,
  title: string,
  tags: string[],
  description: string,
  body: string,
  topN: number = 5
) => {
  const documentToCompare =
    title + " " + description + " " + tags.join(" ") + body;

  const res = find(documentToCompare, id, topN);

  return res.map((id) => blogEntries.find((entry) => entry.id === id));
};
