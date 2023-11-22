---
author: Darko Bozhinovski
title: "Build you a related post classifier for Astro"
pubDate: 2023-11-17
tags: ["astro", "nlp"]
description: "A step-by-step guide on how to build a related post classifier for Astro using `natural` and the content collection API. And a package to make it easier."
ogImage: "/nino-maghradze-0f8P-Y4Ib5U-unsplash.jpg"
---

Those "what to read next" sections are a great way to keep your readers engaged in a meaningful way. That's, of course, assuming you have a way of finding which posts are related to the one they're currently reading. One of the earliest ways I remember seeing this done was via direct post tags comparison - if the current post has the same tag as another post, then they're considered related. Additionally, more matching tags mean higher similarity. This approach is simple and works well enough - but tags can be misspelled (guilty 🤚), or written in different ways (e.g., `javascript` vs. `js`, and guilty 🤚 once more). So, it's not perfect. CMSs usually give you a better UX for this, but if you're a markdown diehard like me, you're out of luck. Or are you?

## Motivation

My "corner of the internet" was lacking a related posts section, and as usual, my first reflex was to try to find something off-the-shelf. After a couple of tries, I realized there was nothing suitable for this particular use case - a static-site for which the related post classification has to happen at build time.

One approach would be to use a third-party service (plenty of those out there), but I'll admit I'm a bit allergic to external dependencies for relatively simple problem spaces (I mean c'mon, it's a blog, not a rocket ship). So, I decided to build my own.

## The approach

Luckily, I've been doing a lot of [NLP](https://en.wikipedia.org/wiki/Natural_language_processing) work in some of my previous projects, so that certainly came in handy. Determining whether a post is related to another (or a group of others) is a classification problem. However, "classification", in the practical sense is an umbrella term for a lot of different approaches and algorithms (mathematical formulas, really). Most of my previous work revolved around [Bayesian classifiers](https://en.wikipedia.org/wiki/Naive_Bayes_classifier), and that didn't really seem to fit the bill here.

As with most things these days, my first stop was ChatGPT. Helpful as ~always~ usual, ChatGPT mentioned a technique called [TF-IDF](https://en.wikipedia.org/wiki/Tf%E2%80%93idf). I've used it briefly before, but I never had the need to get deep into it. But it did sound like a great fit for this problem.

### TF-IDF?

TF-IDF stands for "Term Frequency - Inverse Document Frequency". It's a technique that's used to determine how important a word is to a document in a collection of documents. Let's break the components of TF-IDF down:

- **TF (Term Frequency)** - how often a word appears in a document. The more often, the more important it is to that document. The idea is to understand the importance of a word within that specific document.
- **IDF (Inverse Document Frequency)** - how important a word is to a collection of documents. The more often a word appears in a collection of documents, the less important it is to a specific document. The logic here is that if a word appears in many documents, it’s not a unique identifier of a particular document's topic. So a bit beyond eliminating the obvious stuff like stop words (e.g., "the", "a", "and", etc.).
- **TF-IDF** - the product of TF and IDF; The higher the TF-IDF score, the more important a word is to a document in a collection of documents.

But measuring on the level of words wouldn't provide the results we want - we want to measure the similarity of entire articles. However, most of the libraries that implement TF-IDF also have a way to measure a group of space-separated words. So, we can (ab)use that to our advantage. In effect, if we concatenate the title, description, tags and content of a post, we can get a TF-IDF score for that post. Then, we can compare that score to the scores of other posts to determine which ones are related.

While pulling off your own TF-IDF implementation is certainly possible, it's not [trivial](https://github.com/NaturalNode/natural/blob/master/lib/natural/tfidf/tfidf.js). Luckily, there are plenty of libraries that implement it. I went with [natural](https://naturalnode.github.io/natural/), but I imagine you could use any other library that implements TF-IDF with similar options.

## The implementation

The ultimate goal is a function that takes a post and returns a list of N related posts. However, we do have to tell the TF-IDF implementation about our documents first (train it, if you will). In practice that involves three steps:

1. Fetch all of our posts together with their metadata.
2. Train the TF-IDF on our documents (posts).
3. Expose a function that returns the N most related posts for a given post (the post we give as input).

### 1. Fetching the posts

The first step is to fetch all of our posts. I'm using Astro, so I can use the [content collection API](https://docs.astro.build/en/guides/content-collections/) to do that. The API returns an array of objects, each of which represents a post. Each post has a `title`, `description`, `tags` and `content` property.

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
