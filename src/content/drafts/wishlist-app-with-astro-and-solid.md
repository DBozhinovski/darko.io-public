---
author: Darko Bozhinovski
title: "Quick-and-useful: Build you a wishilist app with Astro, Solid and Baserow"
pubDate: 2023-11-06
tags: ["astro", "solid", "baserow", "quick-and-useful"]
description: "The first part of a series of posts about building quick and useful apps with Astro. Part 1: A wishlist app."
ogImage: "/wishlist.jpg"
---

<i>This is a part of the [quick-and-useful series](/tags/quick-and-useful) - a series of hands-on guides that teach you how to build small apps using Astro and a mix of other, interesting web technologies. </i>

## Background

Apparently, I'm a "hard person to buy presents for". So, looking for small app ideas, I realized that I building a wishlist app is a two-flies-with-one-swat sort of deal. I get to build a small app that I'll use and I can document the journey for others to learn from. Bonus points for using a mix of web tech I actually love to use.

## The stack

- [Astro](https://astro.build/) - Astro, version 3.x in particular, since it's easily the best thing on the web since organically grown HTML. Fight me.
- [SolidJS](https://www.solidjs.com) - Solid, because it offers a familiar JSX developer experience, and it plays great with Astro.
- [Baserow](https://baserow.io) - Baserow, because it's a spreadsheet-as-a-database tool that's easy to use and has a great API. It's also open-source and self-hostable, which is a big plus in my book.

### Which part does what?

We'll use Astro in static-site generation mode. In a nutshell, that means that our project layout and build tools will be provided by Astro. Once we go through the process of building it, we'll get a nice static site we'll be able to deploy virtually anywhere. If we squint a bit, we can call it our [metaframework]().

Solid will give us a bit dynamicity for loading our list of wishes. Since that will be a component that lives on the client-side, and Astro primarily does server-side rendering, we'll use Solid to fill that "void".

Finally, Baserow will be our database and CMS rolled in one. We do want to edit that list somewhere, right?

## Initializing the app

Assuming you already have Node.js 18+ installed, you can get started by running the following command on your CLI:

```bash
npm create astro@latest wishlist-app
```

Technically, you can omit the `wishlist-app` part, but [Houston, the Astro mascot]() will ask you how to name your project during the setup process. Also, ideally, you'd initiate the project with the empty template with typescript support, on strict, but hey, you do you 😄. This guide should be easy to follow along regardless of where you stand on the types debate.

Since we're still in our CLI, let's `cd` into our project folder add the rest of the dependencies:

```bash
cd wishlist-app
npx astro add solid # press y for all the questions
npx astro add tailwind # optional, but recommended
```

With Astro, Solid and optionally [Tailwind]() installed, we can start the dev server:

```bash
npm run dev
```

Opening [localhost:4321](https://localhost:4321) should show you an empty page at this point. Let's change that.

## Creating a layout

Choosing the `empty` option in the first step gives us a barebones Astro project. Most Astro projects on the web have some notion of a layout, and even though we don't need one for this project, let's add one anyway - for the sakes of standards, if nothing else.

Create a new file in `src/layouts` called `Base.astro` and add the following code:

```jsx
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>My Wishlist</title>
  </head>
  <body>
    <div class="flex flex-col items-center justify-center w-full min-h-screen px-4">
      <slot />
    </div>
  </body>
</html>
```

To those new to Astro, yes, this is just HTML. With the exception of the `Astro` global and the `<slot />` tag, everything else is exactly what you'd expect to see in a run-of-the-mill HTML file.

On to the exceptions:

- The [Astro]() global is an object that contains some useful info and utilities (check the docs for more). In our case `Astro.generator` simply returns the name of the generator we're using, which is `astro`.
- The `<slot />` tag is a special tag that tells Astro where to render the content of a page that uses this layout. In our case, that's the content of the page we'll be editing next.

## The index page

We already have an index page from our initial setup, but let's make it a bit more interesting. Edit the contents of `index.astro` in `src/pages` to the following:

```jsx

---
import Base from '../layouts/Base.astro'; // import the layout we just created

---

<Base>
	<h1 class="text-4xl font-black mb-3 mt-6 text-center">My Wishlist</h1>
	<h2 class="text-2xl font-light mb-12 text-center">Need ideas about what to get me?</h2>

	<div class="flex-grow">
		<div class="list">
			List goes here
    </div>
	</div>
</Base>

```

Next stop: data.

## Setting up Baserow

## Fetching Baserow data

## Our List component

---

## Alternative approaches for a wishlist app using Astro
