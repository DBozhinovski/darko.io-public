import pkg from "natural";
import { getCollection } from "astro:content";

const blogEntries = await getCollection("posts");
const { TfIdf } = pkg;
const tfIdf = new TfIdf();

const idMap: { id: string; index: number }[] = [];

blogEntries.forEach((entry, index) => {
  idMap.push({ id: entry.id, index: index });

  tfIdf.addDocument(
    `${entry.data.title} ${entry.data.description} ${entry.data.tags
      .map((tag) => tag)
      .join(" ")} ${entry.body}`
  );
});

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
  let scores: { index: number; score: number }[] = [];

  const indexInMap = idMap.find((entry) => entry.id === id)?.index;

  tfIdf.tfidfs(documentToCompare, (i, measure) => {
    scores.push({ index: i, score: measure });
  });

  // Sort by highest scores and return top N results
  const topScores = scores
    .filter((entry) => entry.index !== indexInMap)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  console.log(topScores);

  // Map the indices to the actual blog entries
  return topScores.map((score) => blogEntries[score.index]);
};
