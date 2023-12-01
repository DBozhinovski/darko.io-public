---
author: Darko Bozhinovski
title: "Quick-and-useful: A DIY, self-hosted Linktree and Linkinbio clone with Astro and TinaCMS"
pubDate: 2023-12-01
tags: ["astro", "tinacms", "quick-and-useful"]
description: "Quick-and-useful, part 2: A self-hosted Linktree and Linkinbio clone based on Astro with a user-friendly edit interface."
ogImage: "/ltree.png"
---

<i>This is a part of the [quick-and-useful series](/tags/quick-and-useful) - a series of hands-on guides that teach you how to build small apps using Astro and a mix of other interesting web technologies. </i>

## Background

As much as I dislike the many "walled gardens" of the modern web, most of us, present company included, often use them. Whether it's peer pressure, my-family-is-there, or just plain convenience, we all have our reasons. Still, we managed to devise some interesting escape hatches. Two good examples are [Linktree](https://linktr.ee/) and [Linkinbio](https://linkin.bio/). They are simple yet effective, allowing you to have a single link in your social media profiles that leads to a page with links to your other profiles, projects, etc.

Simple ideas are often easy to replicate. So, in this post, we'll build a self-hosted Linktree _and_ Linkinbio clone rolled in one.

## The stack

Since this is a series of posts about Astro, we'll use it as the foundation of our app in static-site generation mode. We'll also use [TinaCMS](https://tinacms.org/) to provide a user-friendly editing interface. Beyond that, a bit of [Tailwind](https://tailwindcss.com/) for styling... and that's it.

### Why TinaCMS?

I'll admit I started this experiment with a much bigger scope - I wanted to build a complete multi-user clone of the products mentioned above, with a database, authentication, etc. But that made me realize that such a post would be too long and likely have to be split into multiple parts. In my book, that doesn't qualify as "quick-and-useful".

With problem spaces like this, having a visual editor that allows you to edit the content more visually feels better. I started looking into headless CMSs, but most don't match this use case. Then I remembered that [TinaCMS](https://tinacms.org/) is a thing - a CMS that piggy-backs on top of your git repo. In a sense, you can think of it as a more user-friendly and visual interface for markdown files that live on GitHub (or any of the other Gits\* for that matter).

[TinaCMS](https://tinacms.org/) comes with a cloud version - which translates to never having to touch your code once you're happy with the look and feel. Tina manages your GitHub repo's contents, which, in turn, is used to generate your site on each content change. Which can also be automated via one of the hundreds of static-site hosting services out there.

As I further developed this application, I realized that TinaCMS plays nicely with the Astro content collections API. If you'd instead stick with plain ol' markdown, you can do that too.

## Initializing the app

Assuming you already have Node.js 18+ installed, you can get started by running the following command on your CLI:

```bash
npm create astro@latest astro-ltree
```

[As with the previous installment](/posts/wishlist-app-with-astro-and-solid#initializing-the-app), pick and choose your preferred options.

### Initializing TinaCMS

Once the app is initialized, we can install TinaCMS:

```bash
npx @tinacms/cli@latest init
```

This will ask you a few questions about your project. Since these steps are well documented on the [official Astro docs](https://docs.astro.build/en/guides/cms/tina-cms/), I won't go into details here. Have a look at the link for more information (but you can probably get away with just following the prompts on the screen).

_Note:_ TinaCMS also has a similar guide about [integrating with Astro](https://tina.io/docs/frameworks/astro/).

Once the process is done, you should have a `tina` folder in your project root with a config file inside. This is where we'll define our content model.

One additional piece that's useful to underline here is the changes to `package.json.` Since TinaCMS is its own thing, we'd have to run it parallel with Astro. So, the `dev` and `start` scripts change from:

```json
...
"scripts": {
  "dev": "astro dev",
  "start": "astro dev",
  ...
},
...
```

To this:

```json
...
"scripts": {
    "dev": "tinacms dev -c \"astro dev\"",
    "start": "tinacms dev -c \"astro dev\"",
    ...
}
...

```

With those in place, we can get started with modeling our data!

## Modeling the data

After some thought and experimentation, I decided to go with four collections:

1. `Bio` - the "collection" that will hold the app's owner's name, bio, and avatar.
2. `Posts` - a list of posts linking to a post in a walled garden of your choice.
3. `Links` - a list of links to be displayed on the page (your blog, projects, etc.)
4. `Socials` - links to your social media profiles.

As I mentioned, we have two copies of these collections to define - one for TinaCMS and one for Astro. The former is defined in `tinacms/config.ts` and the latter in `src/content/config.ts` to ensure we can properly use the Astro content collections API.

### The configs

Since the schema is a bit verbose on both ends, I'll split each collection into sections.

_Note:_ I've changed the path for each of Tina's collections to `src/content` to ensure we can use the Astro content collections API.

#### The `bio` collection

In Tina:

```ts
...
{
  name: "bio", // schema name
  label: "Bio", // label that appears in the form
  path: "src/content/bio", // path to the file where the data is stored
  fields: [
    // the form fields as they appear in the CMS
    {
      name: "name",
      type: "string",
      label: "Name",
      required: true,
      isTitle: true,
    },
    {
      name: "biodescription",
      type: "rich-text",
      label: "Bio",
      required: true,
      isBody: true,
    },
    {
      name: "avatar",
      type: "image",
      label: "Avatar",
      required: true,
    },
  ],
},
...
}
```

More on data modeling in TinaCMS [here](https://tina.io/docs/schema/).

In Astro:

```ts
const bioCollection = defineCollection({
  schema: z.object({
    name: z.string(),
    avatar: z.string(),
  }),
});
```

More on Astro content collections [here](https://docs.astro.build/en/guides/content-collections/).

To the keen observer - you probably noticed the `biodescription` field in the TinaCMS schema and its absence in the Astro schema. This is because setting the `isBody` flag on a field in TinaCMS makes it the body text of the resulting markdown file. Astro handles that automatically, so we don't need to define it explicitly in the schema.

#### The `links` collection

In Tina:

```ts
{
  ...
  name: "link",
  label: "Links",
  path: "src/content/links",
  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      isTitle: true,
      required: true,
    },
    {
      type: "string",
      name: "url",
      label: "URL",
      required: true,
    },
    {
      type: "number",
      name: "order",
      label: "Order",
      required: true,
    },
  ],
  ...
}
```

In Astro:

```ts
const linksCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    url: z.string(),
    order: z.number(),
  }),
});
```

In this case, we have a 1:1 parity between the two schemas - we do not need a body, as links are just that - a title, a URL, and the order value determining where they are rendered.

#### The `socials` collection

In Tina:

```ts
{
  ...
  {
    name: "socials",
    label: "Socials",
    path: "src/content/socials",
    fields: [
      {
        type: "string",
        name: "title",
        label: "Title",
        isTitle: true,
        required: true,
      },
      {
        type: "string",
        name: "url",
        label: "URL",
        required: true,
      },
      {
        type: "number",
        name: "order",
        label: "Order",
        required: true,
      },
      {
        type: "string",
        name: "icon",
        label: "Icon",
        required: true,
        list: true,
        ui: {
          component: "select",
        },
        options: [
          "github",
          "twitter",
          "linkedin",
          "instagram",
          "facebook",
          "youtube",
          "twitch",
          "tiktok",
          "snapchat",
          "reddit",
          "pinterest",
          "medium",
          "dev",
          "dribbble",
          "behance",
          "codepen",
          "producthunt",
          "discord",
          "slack",
          "whatsapp",
          "telegram",
          "email",
        ],
      },
    ],
  },
  ...
}
```

...Holy verbosity, Batman! 😱
Well, yes, but if we'd like a nice UI for the social media icons, we need to define them as options. There are probably smarter ways to achieve this. PRs open 😉

In Astro:

```ts
const socialsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    url: z.string(),
    order: z.number(),
    icon: z
      .array(
        z.enum([
          "github",
          "twitter",
          "linkedin",
          "instagram",
          "facebook",
          "youtube",
          "twitch",
          "tiktok",
          "snapchat",
          "reddit",
          "pinterest",
          "medium",
          "dev",
          "dribbble",
          "behance",
          "codepen",
          "producthunt",
          "discord",
          "slack",
          "whatsapp",
          "telegram",
          "email",
        ])
      )
      .length(1),
  }),
});
```

Again, we have a 1:1 parity between the two schemas. The only difference is that we have to define the `icon` field as an array of length 1 to ensure we can use it as a string in the template (and render the appropriate icon).

### The result

Both files are a bit verbose, so I won't paste them here. You can find them in the GitHub repo for the app:

1. [tina/config.ts](https://github.com/DBozhinovski/astro-ltree/blob/master/tina/config.ts)
2. [src/content/config.ts](https://github.com/DBozhinovski/astro-ltree/blob/master/src/content/config.ts)

If you go to http://localhost:4321/admin/index.html, you should see something like this:

<div
  class="embed-responsive embed-responsive-16by9 relative w-full overflow-hidden"
>
  <figure>
    <video controls>
      <source src="/tinacms_demo.webm" />
    </video>
  </figure>
  <section>TinaCMS demo</section>
</div>

We have our data modeled and our collections configured to be consumed by Astro and edited by TinaCMS. Now, we need to render them.

## Rendering the pages

Since both concepts we're trying to replicate are single-page apps, which are pretty minimal, we'll do the same - have one page to serve as our "Linktree" and another one to serve us our "Linkinbio".

### The `index` page (aka Linktree)

Since we went through the trouble of neatly modeling our data in separate collections, we can use the Astro content collections API to fetch the data and render it in the template.

Linktree pages are usually a combination of a picture, name, maybe a short bio, a list of links, and some social media icons (which are also links):

```astro
---
import { getCollection } from "astro:content";
import SocialIcon from "../components/SocialIcon.astro";

// Fetch bio, links and socials
const bio = await getCollection("bio");
const links = await getCollection("links");
const socials = await getCollection("socials");

// Get the first item from bio, since that's our profile
const profile = bio[0];

// Render the contents of the bio body (the description)
const { Content } = await profile.render();
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>LTree | {profile.data.name}</title>
  </head>
  <body>
    <main class="flex flex-col items-center justify-center p-4 pt-10">
      <!-- Top section: image, name, description  -->
      <img src={profile.data.avatar} alt="avatar" class="w-32 h-32 rounded-full" />
      <h1 class="text-2xl mt-4">{profile.data.name}</h1>
      <section class="text-sm max-w-[400px]">
        <Content />
      </section>
      <!-- Navigation to get us around -->
      <nav>
        <ul class="flex divide-x divide-blue-700 p-2">
          <li class="text-lg"><a class="block px-2 text-blue-500" href="/">Links</a></li>
          <li class="text-lg"><a class="block px-2 text-blue-500" href="/postlinks">Posts</a></li>
        </ul>
      </nav>
      <!-- Mid section: links -->
      <ul class="flex flex-col gap-y-4 pt-10 min-w-[400px]">
        {
          links.sort((a, b) => {
            if (a.data.order < b.data.order) {
              return -1;
            }
            if (a.data.order > b.data.order) {
              return 1;
            }
            return 0;
          }).map((link) => (
            <li class="border border-black border-2 w-full text-center p-4 text-xl font-semibold">
              <a href={link.data.url} class="block">
                {link.data.title}
              </a>
            </li>
          ))
        }
      </ul>
      <!-- Bottom section: socials -->
      <ul class="flex gap-4 items-center justify-center flex-wrap pt-10">
        {
          socials.sort((a, b) => {
            if (a.data.order < b.data.order) {
              return -1;
            }
            if (a.data.order > b.data.order) {
              return 1;
            }
            return 0;
          }).map((social) => (
            <li class="border border-black border-2 rounded-full">
              <a href={social.data.url} class="block p-4">
                // This is an Astro component that renders the appropriate icon we picked from the list -> https://github.com/DBozhinovski/astro-ltree/blob/master/src/components/SocialIcon.astro
                <SocialIcon id={social.data.icon[0]}>
              </a>
            </li>
          ))
        }
      </ul>
    </main>
  </body>
</html>
```

### The `postlinks` page (aka Linkinbio)

Linkinbio pages usually combine a picture, a name, and a list of posts that link somewhere. Again, our initial data modeling effort pays off:

```astro
---
import { getCollection } from "astro:content";
import SocialIcon from "../components/SocialIcon.astro";

// Fetch bio, socials and posts
const bio = await getCollection("bio");
const socials = await getCollection("socials");
const posts = await getCollection("posts");

// Get the first item from bio, since that's our profile
const profile = bio[0];
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>LTree | {profile.data.name}</title>
  </head>
  <body>
    <main class="flex flex-col items-center justify-center p-4 pt-10">
      <!-- Top section: image and name  -->
      <img src={profile.data.avatar} alt="avatar" class="w-32 h-32 rounded-full" />
      <h1 class="text-2xl mt-4">{profile.data.name}</h1>
      <!-- Navigation to get us around -->
      <nav>
        <ul class="flex divide-x divide-blue-700 p-2">
          <li class="text-lg"><a class="block px-2 text-blue-500" href="/">Links</a></li>
          <li class="text-lg"><a class="block px-2 text-blue-500" href="/postlinks">Posts</a></li>
        </ul>
      </nav>
      <!-- Socials -->
      <ul class="flex gap-4 items-center justify-center flex-wrap pt-10">
        {
          socials.sort((a, b) => {
            if (a.data.order < b.data.order) {
              return -1;
            }
            if (a.data.order > b.data.order) {
              return 1;
            }
            return 0;
          }).map((social) => (
            <li class="border border-black border-2 rounded-full">
              <a href={social.data.url} class="block p-4">
                // This is an Astro component that renders the appropriate icon we picked from the list -> https://github.com/DBozhinovski/astro-ltree/blob/master/src/components/SocialIcon.astro
                <SocialIcon id={social.data.icon[0]}>
              </a>
            </li>
          ))
        }
      </ul>
      <ul class="grid grid-cols-3 gap-1 pt-20 max-w-[640px] w-full">
        {
          // Finally, posts:
          posts.sort((a, b) => {
            if (a.data.date < b.data.date) {
              return 1;
            }
            if (a.data.date > b.data.date) {
              return -1;
            }

            return 0;
          }).map((p) =>
            <li>
              <a href={p.data.url}>
                <img src={p.data.image} alt={p.data.title} class="aspect-square col-span-1 object-cover" />
              </a>
            </li>
          )
        }
      </ul>
    </main>
  </body>
</html>
```

With those two pages in place, you should be able to see something like [this](https://ltree.darko.io).

## TinaCMS in production

By now, we have a working app (which you're welcome to [clone and adapt](https://github.com/DBozhinovski/astro-ltree/tree/master)), but the ultimate goal is to have a user-friendly, visual way to edit the content. TinaCMS is currently running in local mode, but we can deploy our project, configure Tina Cloud, and have a nice UI to edit the content.

Since the process is well documented, I'll leave some links and go over the steps briefly. The full docs are [here](https://tina.io/docs/tina-cloud/overview/).

The steps, in the order I did them:

1. Deploy the app to a static site host of your choice (my copy is running on Cloudflare Pages).
2. Create a Tina Cloud [account](https://app.tina.io/) and a [new project](https://tina.io/docs/tina-cloud/dashboard/projects/).
3. Run `npx @tinacms/cli init backend`, and follow the instructions for the key and the token.
4. Adapt the `tinacms/config.ts` file to use the [.env variables](https://tina.io/docs/tina-cloud/overview/#ensure-clientid-and-token-are-passed-to-the-config).
5. Change the `build` script in `package.json` to `tinacms build && astro check && astro build`.

### Bonus step - TypeScript error

If you decide to use TypeScript when initializing the app, you'll likely get a whole load of `undefined` errors when running the full `build` script. Funny enough, this one's on Astro, not TinaCMS. The reason is that TypeScript tries to type-check the auto-generated TinaCMS scripts in public. I'll admit, some swearing was involved, but luckily, the fix was pretty simple - add `"exclude": ["public/**"]` to your `tsconfig.json` file.

Finally, once you deploy these changes and they're up and running, you should see TinaCMS running at `/admin/index.html` on your deployed app. With that, we have a fully functional Linktree and Linkinbio clone with a user-friendly editing interface. So, goal achieved, I guess 🤔

But why stop there? This does seem like a good candidate for an Astro theme, doesn't it?

## The Astro theme

Astro themes aren't a complicated idea. Basically, if we pull out the me-specific parts of the app, we get a generic template, which we can reuse. With the approach we took, that means:

1. Keep the data mapping, but remove the data (sans some placeholders).
2. Document how this theme can be deployed and customized.

And, well, that's it. You can find the resulting theme [here](https://github.com/DBozhinovski/astro-theme-ltree/tree/master).

## Possible improvements

We can always make things better, right? Here are some future ideas for the Astro theme I'd like to explore:

- Theming support (yup, theming an Astro theme): One of the cool things about apps like Linktree and Linkinbio is that you can customize the look and feel via a set of themes and possibly some configs we can pass to the pages.
- Video backgrounds: I've seen some pretty cool Linktree pages with video backgrounds, and it's totally doable with our stack.
- Publishing automation: Tina comes with an API. Maybe we can automate the linkinbio part? 🤔

## Takeaway

This was a fun little experiment that produced a useful result. I have a copy running at https://ltree.darko.io as my personal "router" for the various walled gardens of the web. If you'd like one of your own, you can follow the steps above or just [use the theme](https://github.com/DBozhinovski/astro-theme-ltree/tree/master) and customize it to your liking.

As always, if you have any questions, comments, or suggestions, feel free to reach out on [Twitter](https://twitter.com/dbozhinovski). Until next time, happy hacking! 🚀
