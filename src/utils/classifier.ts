import pkg from "natural";
import { getCollection } from "astro:content";

const blogEntries = await getCollection("posts");
const { TfIdf } = pkg;
const tfIdf = new TfIdf();

blogEntries.forEach((entry) => {
  tfIdf.addDocument(
    `${entry.data.title} ${entry.data.description} ${entry.data.tags
      .map((tag) => tag)
      .join(" ")} ${entry.body}`,
    entry.id
  );
});

const posts = await getCollection("posts");

const postsData = posts.map((entry) => ({
  id: entry.id,
  content: `${entry.data.title} ${entry.data.description} ${entry.data.tags
    .map((tag) => tag)
    .join(" ")} ${entry.body}`,
}));

export const classifier = tfIdf;

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
  let scores: { index: number; score: number; key: string }[] = [];

  tfIdf.tfidfs(documentToCompare, (i, measure, key) => {
    scores.push({ index: i, score: measure, key: key || "" });
  });

  // Sort by highest scores and return top N results
  const topScores = scores
    .filter((entry) => entry.key !== id)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  console.log(topScores);

  // Map the indices to the actual blog entries
  return topScores.map((score) => blogEntries[score.index]);
};
