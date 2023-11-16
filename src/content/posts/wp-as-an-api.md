---
author: Darko Bozhinovski
title: "Astro.js and WordPress as an API"
pubDate: 2022-12-27
tags: ["astro", "wordpress", "headless cms"]
description: "Using WordPress as a headless CMS and an API via Astro.js. Exactly as cool as it sounds."
ogImage: "/evgeni-tcherkasski-BfBhwJ4qafo-unsplash.webp"
---

As a big fan of [JAMStack](https://jamstack.org), I'm always trying to find a way to ~shoehorn~ use it in my projects. Of course, it doesn't make sense for every project out there, but you'd find it very hard to persuade me that it won't work for ~80% (source: me) of what we're doing as web developers nowadays.

One such project is an interesting case. A small business based on WordPress, which grew and evolved, needed something app-like and custom-built for their signed-up users. Despite WordPress's large ecosystem, they couldn't get away with plugins. The app they wanted to be built is a perfect fit for something front-end heavy, but the limitations and requirements of the project limited the framework choice. The requirements in broad strokes (since I can't get into detail, this is still being worked on):

- We have a generic blog + store WordPress site, which we need to port to something more app-like.
- The blog of the generic store still needs to remain, well, a blog.
- WooCommerce, which is their e-commerce solution, also has to continue working.
- The existing user records need to be kept intact.
- They are used to the WordPress admin. So they should still be able to continue using the admin part.
- Performance is important.

While there are hundreds of options out there that would easily fit the bill, I went with Astro. I like it; it keeps things simple but doesn't necessarily limit you. If we imagine a spectrum between a website and a web app, Astro neatly fits in the middle, with the potential to go in any direction. So, onwards with the plan.

For our demo and as a starting point, we'll cover two things: fetching posts via graphql and fetching woocommerce products via a client library.

## 0. Setup

To replicate the setup of the app, we'll need the following:

### 0.1. WordPress via Docker

Using the official [WordPress docker image](https://hub.docker.com/_/wordpress/) (with the copied example using docker compose), we have the following config:

```yaml
version: "3.1"

services:
  wordpress:
    image: wordpress
    restart: always
    ports:
      - 8081:80
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: exampleuser
      WORDPRESS_DB_PASSWORD: examplepass
      WORDPRESS_DB_NAME: exampledb
    volumes:
      - wordpress:/var/www/html

  db:
    image: mysql:5.7
    restart: always
    environment:
      MYSQL_DATABASE: exampledb
      MYSQL_USER: exampleuser
      MYSQL_PASSWORD: examplepass
      MYSQL_RANDOM_ROOT_PASSWORD: "1"
    volumes:
      - db:/var/lib/mysql

volumes:
  wordpress:
  db:
```

The only change I made from the original example is the port mapping; the `stack.yml` config in the above page maps port 8080 to 80, while I'm mapping 8081 to 80.

Running `docker-compose -f stack.yml up` gives us a WordPress instance running on port 8081. To finalize the installation, you'll also need to do the initial setup by opening http://localhost:8081 in your browser and following the instructions on the screen.

### 0.2. Add some plugins in the WP admin

Once everything is set up, navigate to https://localhost:8081/wp-admin, and log in using the credentials you chose in step [0.1](#01-wordpress-via-docker).

Once logged in, click on `Plugins` in the sidebar, followed by a click on `Add New`.

1. Search for "WooCommerce", install and configure the plugin. Any kind of dummy data will suffice, this is just for learning purposes.
2. Search for WpGraphQL, install and configure the plugin.
3. Search for FakerPress, install and configure the plugin.

---

<div
  class="embed-responsive embed-responsive-16by9 relative w-full overflow-hidden"
>
  <figure>
    <video controls>
      <source src="/wp-plugins-install.webm" />
      <source src="/wp-plugins-install.mp4" />
    </video>
  </figure>
  <section>The WordPress plugins we need</section>
</div>

---

Once that's done, let's move on to generating some data.

### 0.3. Generate some dummy data for posts and products

In the admin menu, find `FakerPress in the sidebar`, hover over it, and in the menu, click on `Posts`.

Generate some posts and products using the config inputs on the page (there are many options there). For my instance, I chose to generate 50 posts (see the `Post Type` field) and 1000 products. Generation takes a while (hint: look at the bottom of the page for status updates). Once that's done, we have not one, but two working APIs pre-filled with some data.

---

<div
  class="embed-responsive embed-responsive-16by9 relative w-full overflow-hidden"
>
  <figure>
    <video controls>
      <source src="/wp-fakerpress.webm" />
      <source src="/wp-fakerpress.mp4" />
    </video>
  </figure>
  <section>Fakerpress usage</section>
</div>

---

Let's move on to how we can fetch this data from the outside.

## 1. WordPress can be an treated as an API

WordPress comes with an API. This is why we can also treat WordPress as a headless CMS. Thanks to the vast WordPress ecosystem, we have things like WPGraphQL in addition to the WP REST API (which works but is somewhat more complex to deal with). GraphQL might not be everybody's cup of tea, but it always beats making X requests to get associated records for a resource.

So, let's review everything we need to fetch the data relevant to the problem statement above.

### 1.1. We need to read blog posts

We installed WPGraphQL above. So, we'll use graphql to fetch the posts we need:

```graphql
query fetchPosts($length: Int) {
  posts(first: $length, where: { orderby: { field: DATE, order: DESC } }) {
    # fetch $length posts, order them by DATE in a DESCending order
    nodes {
      # from every record get the following fields:
      id
      title
      date
      slug
      excerpt
      author {
        # some fields are read from other tables, fetch their relevant data too:
        node {
          name
          avatar {
            url
          }
        }
      }
      categories {
        edges {
          node {
            id
            name
          }
        }
      }
      content
      featuredImage {
        node {
          mediaItemUrl
        }
      }
    }
  }
}
```

_Note:_ If you're new to GraphQL, you can find more about it here: https://graphql.org

Find the complete example, wrapped in a TypeScript functions, here: https://github.com/DBozhinovski/wp-as-an-api/blob/master/src/utils/wpPosts.ts

## 2. WooCommerce also has an API (but a client library is simpler)

WooCommerce has a REST API, which we could use. Still, the idea is to keep this simple. GraphQL or a client library is a more straightforward solution than using the REST API directly.

While a plugin supports GraphQL for WooCommerce, it has yet to be published and is in active development. It can be uploaded to the WordPress admin, but it only covered some of what I wanted it to. Still, I found an excellent client library, written in TypeScript, that does what I had in mind for this demo. The library can be found at https://github.com/Yuri-Lima/woocommerce-rest-api-ts-lib.

To use the library, we'll need to install it first:

```bash
npm i woocommerce-rest-ts-api
```

Following installation, we'll need to configure it:

```ts
import WooCommerceRestApi from "woocommerce-rest-ts-api";

const api = new WooCommerceRestApi({
  url: "http://localhost:8081", // Or wherever you chose to install it.
  consumerKey: "ck_****************************", // Your WooCommerce key, see below
  consumerSecret: "cs_**************************", // Your WooCommerce secret, see below
  version: "wc/v3",
  queryStringAuth: false,
});
```

---

**Security note:** Avoid embedding keys and secrets directly into code. Use env variables instead.

---

### 2.1. Consumer key and secret

To be able to use the WooCommerce API, we need to obtain the API key and secret from our admin panel.

---

<div
  class="embed-responsive embed-responsive-16by9 relative w-full overflow-hidden"
>
  <figure>
    <video controls>
      <source src="/wp-woocommerce-api-keys.webm" />
      <source src="/wp-woocommerce-api-keys.mp4" />
    </video>
  </figure>
  <section>Generating WooCommerce API keys</section>
</div>

---

Navigate to https://localhost:8081/wp-admin one more, hover over `WooCommerce` in the sidebar, and click on `Settings` from the menu. Next, go to the `Advanced` tab, click on `REST API` and finally click on the `Add key` button. Give the new key / secret combo a memorable name, and finally, click on the `Generate API key` button.

---

**Tip:** To write to the WooCommerce API, you'll also need to set permissions to Read/Write in the `Permissions` dropdown menu.

---

Finally, for simplicity, we can create a helper function that makes fetching WooCommerce products easier:

```ts
// Using `api` as defined in the code snippet above
export async function getProducts({ perPage = 20 }: { perPage: number }) {
  const products = await api.get("products", {
    per_page: perPage,
  });

  console.log("Total of pages:", products.headers["x-wp-totalpages"]);
  console.log("Total of items:", products.headers["x-wp-total"]);

  return products.data;
}
```

Find the complete example here: https://github.com/DBozhinovski/wp-as-an-api/blob/master/src/utils/woocommerce.ts

## 3. Consuming data via Astro

For our final step, let's look at how we can consume data in Astro.

By default, Astro pages are either statically generated or server-side rendered. That means we can fetch all of the data ahead of runtime, and we won't have to make any requests on the client side:

```astro

---
import Container from "@components/container.astro";
import Postlist from "@components/postlist.astro";
import Layout from "@layouts/Layout.astro";

// The fetchPosts function we described above
import { fetchPosts } from '../utils/wpPosts';

// We fetch 10 posts for the front page, via the standard fetch API, but on the server
const wpPosts = await fetchPosts({ length: 10 });
const postContents = await wpPosts.json();

---

<Layout title="">
  <Container>
    <main>
      <div class="grid gap-10 lg:gap-10 md:grid-cols-2">
        <!-- We iterate over the results, and render them in an Astro component -->
        {
          postContents.data.posts.nodes
            .slice(0, 2)
            .map((post) => (
              <Postlist post={post} aspect="landscape" preloadImage={true} />
            ))
        }
      </div>
      <div class="grid gap-10 mt-10 lg:gap-10 md:grid-cols-2 xl:grid-cols-3">
        {
          postContents.data.posts.nodes
            .slice(2)
            .map((post) => <Postlist post={post} aspect="square" />)
        }
      </div>
    </main>
  </Container>
</Layout>



```

## Takeaway

WordPress has perfectly good APIs for most of its core offerings. Most notably, there are APIs for both WordPress and WooCommerce. So, if you are "stuck" with WordPress, you can always use it that way. It sure beats "throwing away the baby with the bathwater" and re-writing an entire system.

Using center-stack solutions such as Astro (or any JAMStack solutions, really) makes for an easy and clear upgrade/migration path for these scenarios.

For a working example, have a look at the demo app at https://github.com/DBozhinovski/wp-as-an-api.
