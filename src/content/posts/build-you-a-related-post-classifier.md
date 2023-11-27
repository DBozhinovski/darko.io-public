---
author: Darko Bozhinovski
title: "Build you a related post classifier for Astro"
pubDate: 2023-11-17
tags: ["astro", "nlp"]
description: "A step-by-step guide on how to build a related post classifier for Astro using `natural` and the content collection API. And a package to make it easier."
ogImage: "/nino-maghradze-0f8P-Y4Ib5U-unsplash.jpg"
---

Those "what to read next" sections are a great way to keep your readers engaged meaningfully. That's assuming you have a way of finding which posts are related to the one they're currently reading. One of the earliest ways I remember seeing this done was via direct post tags comparison - if the current post has the same tag as another post, they're considered related. Additionally, more matching tags mean higher similarity. This approach is simple and works well enough - but tags can be misspelled (guilty 🤚) or written differently (e.g., `javascript` vs. `js`, and guilty 🤚 once more). So, it's not perfect. CMSs usually give you a better UX for this, but if you're a markdown diehard like me, you're out of luck. Or are you?

## Motivation

My "corner of the internet" lacked a related posts section, and as usual, my first reflex was trying to find something off the shelf. After a couple of tries, I realized nothing was suitable for this particular use case - a static site for which the related post classification must happen at build time.

One approach would be to use a third-party service (plenty of those out there), but I'm a bit allergic to external dependencies for relatively simple problem spaces (I mean, c'mon, it's a blog, not a rocket ship). So, I decided to build my own.

## The approach

Luckily, I've been doing a lot of [NLP](https://en.wikipedia.org/wiki/Natural_language_processing) work in some of my previous projects, which came in handy. Determining whether a post relates to another (or a group of others) is a classification problem. However, "classification," in the practical sense, is an umbrella term for many different approaches and algorithms (mathematical formulas, really). Most of my previous work revolved around [Bayesian classifiers](https://en.wikipedia.org/wiki/Naive_Bayes_classifier), which didn't seem to fit the bill here.

As with most things these days, my first stop was ChatGPT. Helpful as ~always~ usual, ChatGPT mentioned a technique called [TF-IDF](https://en.wikipedia.org/wiki/Tf%E2%80%93idf). I've used it briefly before, but I never had the need to get deep into it. But it did sound like an excellent fit for this problem.

### TF-IDF?

TF-IDF stands for "Term Frequency - Inverse Document Frequency." It's a technique used to determine how important a word is to a document in a collection of documents. Let's break the components of TF-IDF down:

- **TF (Term Frequency)** - how often a word appears in a document. The more often, the more important it is to that document. The idea is to understand the importance of a word within that specific document.
- **IDF (Inverse Document Frequency)** - how important a word is to a collection of documents. The more often a word appears in a collection of documents, the less important it is to a specific document. The logic here is that if a word appears in many documents, it’s not a unique identifier of a particular document's topic. So a bit beyond eliminating the obvious stuff like stop words (e.g., "the", "a", "and", etc.).
- **TF-IDF** - the product of TF and IDF; The higher the TF-IDF score, the more important a word is to a document in a collection of documents.

But measuring on the level of words wouldn't provide the results we want - we want to measure the similarity of entire articles. However, most of the libraries that implement TF-IDF also have a way to measure a group of space-separated words. So, we can (ab)use that to our advantage. In effect, if we concatenate a post's title, description, tags, and content, we can get a TF-IDF score for that post. Then, we can compare that score to the scores of other posts to determine which ones are related.

While pulling off your own TF-IDF implementation is certainly possible, it's not [trivial](https://github.com/NaturalNode/natural/blob/master/lib/natural/tfidf/tfidf.js). Luckily, there are plenty of libraries that implement it. I went with [natural](https://naturalnode.github.io/natural/), but I imagine you could use any other library that implements TF-IDF with similar options.

## The implementation

The ultimate goal is a function that takes a post and returns a list of N-related posts. However, we do have to tell the TF-IDF implementation about our documents first (train it, if you will). In practice, that involves three steps:

1. Fetch all of our posts together with their metadata.
2. Train the TF-IDF on our documents (posts).
3. Expose a function that returns the N most related posts for a given post (the post we give as input).

### 1. Fetching the posts

The first step is to fetch all of our posts. I'm using Astro, so I can use the [content collection API](https://docs.astro.build/en/guides/content-collections/). The API returns an array of objects, each representing a post. Each post has a `title`, `description`, `tags` and `content` property.

```ts
// Using the collections API...
import { getCollection } from "astro:content";

// ... we can fetch all of our posts
// plus, top-level await 🔥
const blogEntries = await getCollection("posts");
```

### 2. Training the TF-IDF

With all of our documents (posts) fetched, we can train the TF-IDF.

```ts
import natural from "natural";
import { getCollection } from "astro:content";

const blogEntries = await getCollection("posts");
// We instantiate the TF-IDF from natural
const { TfIdf } = pkg;
const tfIdf = new TfIdf();

// We add each document, together with its metadata to the TF-IDF
blogEntries.forEach((entry) => {
  tfIdf.addDocument(
    `${entry.data.title} ${entry.data.description} ${entry.data.tags
      .map((tag) => tag)
      .join(" ")} ${entry.body}`
  );
});
```

### 3. Exposing the related posts function

With fetching and training done, all that's left is to expose a function that takes a post and returns the N most related posts. The function will take the post's `id`, `title`, `description`, `tags` and `body` as input, as those were the data we trained the TF-IDF on.

We'll use the same logic as before - concatenate the post's metadata and body and then use the TF-IDF to get the scores for each document. Then, we'll sort the scores in descending order and return the top N posts.

```ts
export const findRelated = (
  title: string,
  tags: string[],
  description: string,
  body: string,
  topN: number = 5
) => {
  // Concatenate the post's metadata and body
  const documentToCompare =
    title + " " + description + " " + tags.join(" ") + body;
  let scores: { index: number; score: number }[] = [];

  // Get the TF-IDF scores for each document
  tfIdf.tfidfs(documentToCompare, (i, measure) => {
    scores.push({ index: i, score: measure });
  });

  // Sort by highest scores and return top N results
  const topScores = scores.sort((a, b) => b.score - a.score).slice(0, topN);

  // Map the indices to the actual blog entries obtained from the collections API
  return topScores.map((score) => blogEntries[score.index]);
};
```

With that exposed, we can now use it in our Astro components. In my case, that looks something like this:

```astro
---
import { findRelated } from "../utils/classifier";

// ...


// Let's say we want the top 3 related posts
const related = findRelated(id, frontmatter.title, frontmatter.tags, frontmatter.description, body, 3) || [];


// ...
---

<div>
{
  related.map((post) => (
    <RelatedPost
      url={"/posts/" + post.slug}
      title={post.data.title}
      description={post.data.description}
      alt={post.data.title}
      pubDate={post.data.pubDate.toString().slice(0, 10)}
      author={post.data.author}
      image={post.data.ogImage}
    />
  ))
}
</div>


```

### The bug 🐛

The results were as expected, with one glaring oversight - the first post matched is the post we're currently on. The reason is simple - we're concatenating the post's metadata and body and then comparing that to the same post.

We can work around this easily - if we want the top 3 posts, we can fetch the top 4 instead and discard the first one. But that's a bit of a hack, and I set out to solve this properly. So, we'll have to devise a way of identifying the post we're on and excluding it from the results.

Luckily, the collections API gives us a unique `id` for each post. Conversely, the `addDocument` method of the TF-IDF accepts a second argument - a unique identifier for the document. So, we can use the post's `id` as the second argument to `addDocument`, and then use it to exclude the post from the results:

```ts
...
blogEntries.forEach((entry) => {
  tfIdf.addDocument(
    `${entry.data.title} ${entry.data.description} ${entry.data.tags
      .map((tag) => tag)
      .join(" ")} ${entry.body}`,
    entry.id // <-- the post's id
  );
});
...

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

  tfIdf.tfidfs(documentToCompare, (i, measure, key) => { // <-- the key is the post's id
    scores.push({ index: i, score: measure, key: key || "" }); // <-- we store it in the scores array
  });

  const topScores = scores
    .filter((entry) => entry.key !== id) // <-- exclude the current post
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return topScores.map((score) => blogEntries[score.index]);
};
```

Finally, the complete implementation:

```ts
import natural from "natural";
import { getCollection } from "astro:content";

const blogEntries = await getCollection("posts");
const { TfIdf } = natural;
const tfIdf = new TfIdf();

blogEntries.forEach((entry) => {
  tfIdf.addDocument(
    `${entry.data.title} ${entry.data.description} ${entry.data.tags
      .map((tag) => tag)
      .join(" ")} ${entry.body}`,
    entry.id
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
  let scores: { index: number; score: number; key: string }[] = [];

  tfIdf.tfidfs(documentToCompare, (i, measure, key) => {
    scores.push({ index: i, score: measure, key: key || "" });
  });

  const topScores = scores
    .filter((entry) => entry.key !== id)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return topScores.map((score) => blogEntries[score.index]);
};
```

This is already good enough to copy, paste, slightly adapt, and use in your Astro project. But this does sound like a good package for npm, doesn't it?

## The package

So, step 1 would abstract the classifier away from the Astro-specific code. Thus, the only hard dependency of the package would be `natural`.

Since the functionality is not too complex, we can keep all of it in a single file, which will expose two functions: `train` and `findRelated`. The `train` function will take an array of strings with ids and train the TF-IDF on them. The `findRelated` function will take a string and an id (to exclude the one we're trying to find matches for) and return the N most related strings from the collection.

**Note:** I'm using the generic "string" term here since the classifier is trained on concatenated strings, regardless of whether they're blog posts.

```ts
import natural from "natural";

const { TfIdf } = natural;
const tfIdf = new TfIdf();

interface Document {
  id: string;
  content: string;
}

export const train = (documents: Document[]) => {
  documents.forEach((document) => {
    tfIdf.addDocument(document.content, document.id);
  });
};

export const findRelated = (
  documentToCompare: string,
  id: string,
  topN: number = 5
) => {
  const scores: { index: number; score: number; key: string }[] = [];

  tfIdf.tfidfs(documentToCompare, (i, measure, key) => {
    scores.push({ index: i, score: measure, key: key || "" });
  });

  const topScores = scores
    .filter((entry) => entry.key !== id)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return topScores.map((score) => score.key);
};
```

The code listed above ended up being published as the [relatinator](https://github.com/DBozhinovski/relatinator) package. It's a bit rough around the edges (i.e., DO NOT USE IT IN PRODUCTION yet), but I'm working on it. I would also like to take a moment to vent about the hellscape that is NPM packaging and publishing. It's 2023, we can do better people. I planned on publishing this piece last week, but fighting tooling, bundling, npm, and all the other stuff took way longer than I expected. But I digress.

## The bottom line

I'm happy with the results. The classifier works well enough for my use case, and it's a great way to learn about TF-IDF and NLP in general. The package is still a work in progress - natural isn't tree-shakeable, types don't seem to be visible when importing, and a ton of other stuff that I'm already working on. If you'd like something quick and dirty, you can copy-paste the code from the article and adapt it to your needs.

For a demo, you are probably already seeing it - the related posts section at the bottom of this page. Have a look, click around, and let me know what you think.

I hope you found this useful. If you have any questions, feel free to reach out on [Twitter](https://twitter.com/dbozhinovski). Until next time, happy hacking!
