import pkg from "natural";
import { getCollection } from "astro:content";

const blogEntries = await getCollection("posts");
const { TfIdf } = pkg;
const tfIdf = new TfIdf();

blogEntries.forEach((entry) => {
  tfIdf.addDocument(
    `${entry.data.title} ${entry.data.description} ${entry.data.tags
      .map((tag) => tag)
      .join(" ")}`
  );
});

export const classifier = tfIdf;

export const findRelated = (
  title: string,
  tags: string[],
  description: string,
  topN: number = 5
) => {
  const documentToCompare = title + " " + tags.join(" ") + " " + description;
  let scores: { index: number; score: number }[] = [];

  tfIdf.tfidfs(documentToCompare, (i, measure) => {
    scores.push({ index: i, score: measure });
  });

  // Sort by highest scores and return top N results
  const topScores = scores.sort((a, b) => b.score - a.score).slice(0, topN);

  // Map the indices to the actual blog entries
  return topScores.map((score) => blogEntries[score.index]);
};
