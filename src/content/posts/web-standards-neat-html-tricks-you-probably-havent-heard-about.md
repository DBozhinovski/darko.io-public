---
title: "Web standards: neat HTML tricks you probably haven’t heard about."
author: Darko Bozhinovski
pubDate: 2023-11-15
tags: ["html", "web standards", "web development"]
description: "A blog post remix of a recent presentation I gave at the WP meetup Skopje - some cool and lesser-known HTML tricks you might not know about."
ogImage: "/adventure-island.jpg"
---

## Background

No matter on what end of the stack you are as a web developer, most of our work is sent to the browser as HTML, CSS, and JavaScript. Whether you're in React land, writing WordPress themes, or using Ruby on Rails (or whatever else), the end result is always the same: HTML, CSS, and JavaScript.

The web platform has evolved considerably in recent years. However, I don't think we're keeping up with the standards as much as we should. We tend to over-rely on frameworks and libraries, forgetting that the platform itself has a lot to offer.

This article (remixed from a [presentation](https://www.canva.com/design/DAFz_DUurLk/l2tSoMAbRshBuAVN7sk_Ug/view)) aims to showcase some really cool and lesser-known HTML tricks that you might not know about. Let's dive in.

_Rules:_ I'll use as little JavaScript and CSS as possible. Partially as an exploration and partly to show that it's possible to go far with just HTML.

---

- [⚡ Live demo](https://neat-html-tricks-demo.pages.dev)
- [👀 Presentation](https://www.canva.com/design/DAFz_DUurLk/l2tSoMAbRshBuAVN7sk_Ug/view)
- [💻 Source](https://github.com/DBozhinovski/neat-html-tricks-demo/tree/master)

---

## 1. The humble `<a>` tag

Most of you probably already know that `<a>` links pages. Surprising, I know. The real complexity, however, lies in its `href` attribute. It can do a lot more than just point to a page. So, by example, in order of reverse obscurity (most known/used at the top, source: me):

1. `href="https://example.com"` - the most common use case, points to a URL. Clicking it takes you to a new page unless you add `target="_blank"` to open it in a new tab.
2. `href=#anchor` - points to an anchor on the same page. Useful for long pages with a table of contents.
3. `href="mailto:user@example.com"` - opens the default mail client with a new email to the specified address. You can also add a subject and body as query parameters to the URL: `?subject=Hello&body=How are you?`
4. `href="tel:123456789"` and `href="sms:123456789` - opens the default phone or SMS app with the specified number. Useful for mobile devices.
5. `href="javascript:alert('Hello world!')"` - executes the specified JavaScript code. Useful for bookmarklets and other hacks. Also, it is not a particularly great idea for maintainability 😉
6. `href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA"` - embeds a base64 encoded image. Useful for small icons and other images that you don't want to make a separate request for. Also, it's a good hack if you need to embed something to be downloaded on the fly (but keep it small; see `blob:` for larger amounts of data). Fun fact - you can also use these for images directly in an `<img>` tag.
7. `href="blob:https://example.com/1234-5678-9101"` - 'embeds' a blob. This is useful for videos and other larger media. It is also a good hack if you need to embed something that can be downloaded on the fly.
8. `href="geo:42.123456,-71.123456"` - opens the default maps app with the specified coordinates.
9. Various protocol (deep/intent) links:
   1. `href="magnet:?xt=urn:btih:123456789"` - opens the default torrent client with the specified magnet link.
   2. `href="slack://channel?team=123456789&id=123456789"` - opens the Slack app with the specified channel.
   3. `href="twitter://user?screen_name=darko_bozhinovski"` - opens the Twitter app with the specified user.
   4. ...and so on, most mobile apps and some desktop apps support this. Useful for deep linking to apps.

**Note:** It's also worth noting that `<a>` comes with a `download` attribute, which makes the browser download the linked resource instead of trying to navigate to it (resulting in a no-op). It is helpful to have in the toolbox for the `blob:` and `data:` protocols.

### Summary

We can't discuss the `<a>` tag in-depth without associating it with URLs. URLs can take many shapes and sizes and modify the tag's behavior in relation to the OS or the browser it runs on.

- Demo: https://neat-html-tricks-demo.pages.dev/links/
- Source: https://github.com/DBozhinovski/neat-html-tricks-demo/blob/master/src/pages/links.astro

## 2. The `<button>` tag's hidden superpowers

Next stop - the equally deceivingly simple `<button>` tag. It's a button, right? It can submit forms and do some fancy stuff with some JavaScript thrown into the mix... Well, yes, but it can do a bit more than just that.

With JavaScript out of the picture, we can split the button tag into two categories by where it's located:

### Buttons inside a form

1. A `type="button"` attribute will make it not submit the form. Useful for buttons that do something else, like opening a modal, clearing the form, saving progress without submission, etc.
2. A `type="reset"` attribute will make it reset the form. Useful for clearing the form.
3. `formaction="https://example.com"` overrides the `action` attribute on the form and submits the form to the specified URL. It helps submit forms to different URLs; in some cases, you need multiple submit buttons on the same form that do other things.
4. `formmethod="post"` (or `get` or `dialog`) overrides the `method` attribute on the form and submits the form with the specified method. Useful for submitting forms with different methods. More on `dialog` in a bit 😉
5. There's a second and older method of submitting the form with multiple buttons - giving the button a `name` and a `value` attribute. That way, the server can still get a hint of which button was pressed.

### Buttons outside a form

1. `form="form-id"` attribute will make it submit the specified form. Useful for submitting forms from outside the form itself.

### Summary

We can think of buttons and forms as the "write" counterpart of `<a>` tags. Without JavaScript in the picture, the only way to "write" to the server is through forms. Consequently, when we think of buttons, we should consider them in the context of forms. Put another way, if `<a>` is `GET,` then `<button>` together with `<form>` is `POST.`

- Demo: https://neat-html-tricks-demo.pages.dev/buttons/
- Source: https://github.com/DBozhinovski/neat-html-tricks-demo/blob/master/src/pages/buttons.astro

## 3. The `<details>` and `<summary>` tags - the JS-free accordion (of sorts)

The `<details>` and `<summary>` tags are a great way to create an accordion-like behavior without JavaScript. These two have been around for a while, but I'm still seeing a lot of projects using JavaScript for something that the web platform supports out of the box.

```html
<details>
  <summary>This is the title</summary>
  Full details are here
</details>
```

Both tags are stylable and customizable to cover a lot of use cases.

### Summary

The `<details>` and `<summary>` tags are a great way to create an accordion-like behavior without JavaScript.

- Demo: https://neat-html-tricks-demo.pages.dev/details/
- Source: https://github.com/DBozhinovski/neat-html-tricks-demo/blob/master/src/pages/details.astro

## 4. The `<dialog>` tag - the JS-free modal

The `<dialog>` tag is a great way to create a modal without JavaScript (mostly). There's a catch - we can only open it with JavaScript or resort to some CSS hacks. However, we can close it without JavaScript by using a `<form>` tag inside the dialog, which is already pretty neat.

### The primary dialog tag

```html
<dialog>I'm not visible</dialog>
```

In this example, the dialog cannot be seen by the user. It needs an extra attribute to make it visible:

```html
<dialog open>Now I'm visible</dialog>
```

**Note:** The `open` attribute works precisely the same as the `open` attribute on `<details>`.

### Opening and closing

We're able to close the dialog without JavaScript by using a `<form>` tag inside the dialog:

```html
<dialog open>
  <p>I'm a dialog. Close me using the button below.</p>
  <form method="dialog">
    <button>Close</button>
  </form>
</dialog>
```

That leaves us with the question of how to open the dialog. We currently don't have an HTML-only way of opening dialogs. There are some CSS hacks to make it work, however:

```html
<html>
  <style>
    dialog {
      display: block;
    }

    dialog:not(:target):not([open]) {
      display: none;
    }
  </style>
  <body>
    <p>
      <a href="#dialog">Open dialog</a>
    </p>

    <dialog id="dialog">
      <h2>Dialog</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <a href="#!">Close</a>
    </dialog>
  </body>
</html>
```

As to whether this is worth it, as opposed to the three JavaScript methods that modals come with:

```js
dialog.showModal(); // shows dialog as modal
dialog.show(); // shows dialog as non-modal
dialog.close(); // closes the dialog
```

...is up to you to decide.

However, if a user has JavaScript disabled, you can still modify the HTML you return from the server to make the dialog visible by changing the presence of the `open` attribute. It could be better, but it's a possibility.

### Summary

The `<dialog>` tag is a great way to create a modal with a small amount of JavaScript.

Additionally, it's worth noting that a Popover API is in the works, which will make it even easier to create more modals without relying on JavaScript.

- Demo: https://neat-html-tricks-demo.pages.dev/dialog/
- Source: https://github.com/DBozhinovski/neat-html-tricks-demo/blob/master/src/pages/dialog.astro

## 5. HTML-only lazy loading

One of the cheapest performance wins you can get is lazy loading images, videos, or iframes. It's a great way to improve your site's perceived performance without JavaScript.

```html
<img src="pic.png" loading="lazy" alt="Image description here" />
```

This works because the browser will only load the image when it's in the viewport. So, if an image is in the markup, but you still need to scroll to it, it won't be loaded, thus saving traffic and improving performance. In addition to images, the `loading=lazy` attribute also works on `<iframe>` and `<video>` tags.

There's a catch, however. While `loading=lazy` is a hint to the browser, it is not a guarantee. The browser may load the image via a set of given internal heuristics. [Details here](https://web.dev/articles/browser-level-image-lazy-loading).

While on the topic of performance, it's worth noting that you can also improve the story in a couple of other ways:

- Add a `<link rel="preload">` tag in the `<head>` of your document to preload resources that are needed for the initial render of the page (e.g. fonts).
- Add a `type="module"` attribute to your `<script>` tags to make them load asynchronously and avoid blocking the initial render of the page.
- Inline the [CSS critical rendering path](https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path) so that it loads in a single run with the HTML.

### Summary

Lazy loading is a great way to improve your site's perceived performance, and the best part is that you can do most of it without JavaScript.

- Demo: https://neat-html-tricks-demo.pages.dev/lazy/
- Source: https://github.com/DBozhinovski/neat-html-tricks-demo/blob/master/src/pages/lazy.astro

## 6. The `<template />` and `<slot />` tags - the components of the web

The `<template />` and `<slot />` combo are easily one of the web platform's most complex and powerful features. They're the building blocks of Web Components. Currently, there's no way of using them without JavaScript, but then again, no UI library or framework out there is.

### The `<template />` tag

By itself, the `<template />` tag offers a way to define some reusable markup. It's not visible to the user by itself, but it can be cloned and inserted into the DOM.

```html
<template id="my-component">
  <li>
    <h1>title</h1>
    <p>description</p>
  </li>
</template>
```

This is intended to be used by cloning it and inserting it into the DOM.

```js
const template = document.getElementById("custom-component");
const clone = template.content.cloneNode(true); // true means deep clone

clone.querySelector("h1").textContent = "My title";
clone.querySelector("p").textContent = "My description";

document.body.appendChild(clone);
```

That's useful, but the true power of the `<template />` tag comes when combined with the `<slot />` tag.

### The `<slot />` tag and an intro to Web Components

Taking the previous example a step further, we can define our own custom tags and use the `<slot />` tag to define where the content should be inserted. So, let's say we want to build a custom component that takes a title and a description as props and renders them as `h2` and `p`, respectively; on top of that, it can render any child tags inside it.

Let's start backwards, from the component usage, and build from there:

```html
<wp-meetup-component
  title="First Web Component"
  description="This is my first web component"
>
  <p>And this is a child tag</p>
</wp-meetup-component>
```

One way to achieve this is to define this template first:

```html
<template id="wp-meetup-component">
  <style>
    .component {
      border: 1px solid #ddd;
      padding: 10px;
      border-radius: 5px;
    }

    h2 {
      color: #333;
    }

    p {
      color: #666;
    }
  </style>
  <div class="component">
    <h2 id="title">Default Title</h2>
    <p id="description">Default description.</p>
    <!-- the slot tag is where the child tag contents will be inserted -->
    <slot></slot>
  </div>
</template>
```

```js
//This is the component definition in JS land - it's a class by default
class WPMeetupComponent extends HTMLElement {
  static get observedAttributes() {
    return ["title", "description"]; // these are the attributes we want to observe and add via props
  }

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" }); // create a shadow root
    const template = document.getElementById("wp-meetup-component"); // get the template
    const instance = template.content.cloneNode(true); // clone the template
    shadowRoot.appendChild(instance); // append the template to the shadow root

    this.titleElement = shadowRoot.querySelector("#title"); // get the title element
    this.descriptionElement = shadowRoot.querySelector("#description"); // get the description element
  }

  connectedCallback() {
    this.updateTitle(this.getAttribute("title")); // update the title
    this.updateDescription(this.getAttribute("description")); // update the description
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "title") {
      this.updateTitle(newValue); // update the title
    } else if (name === "description") {
      this.updateDescription(newValue); // update the description
    }
  }

  updateTitle(value) {
    this.titleElement.textContent = value; // update the title element
  }

  updateDescription(value) {
    this.descriptionElement.textContent = value; // update the description element
  }
}
```

Next up, we have to tell the browser that we want to use this component. We do that by calling `customElements.define`:

```js
customElements.define("wp-meetup-component", WPMeetupComponent);
```

Finally, we can use the component in our HTML, as we already specified in the example above:

```html
<wp-meetup-component
  title="First Web Component"
  description="This is my first web component"
>
  <p>And this is a child tag</p>
</wp-meetup-component>
```

Of course, we can reuse the component as many times as we want, just like any other HTML tag.

### Summary

Using the `<template />` and `<slot />` tags, we can build our own custom components and reusable markup. These are the building blocks of Web Components. Currently, there's no way of using them without JavaScript, but it might be possible in the future.

- Demos:
  - https://neat-html-tricks-demo.pages.dev/web-components/
  - https://neat-html-tricks-demo.pages.dev/web-components-full/
- Sources:
  - https://github.com/DBozhinovski/neat-html-tricks-demo/blob/master/src/pages/web-components.astro
  - https://github.com/DBozhinovski/neat-html-tricks-demo/blob/master/src/pages/web-components-full.html

## Takeaways

The web platform has a lot to offer. While web frameworks and libraries make a difference in productivity and ease of use, we shouldn't forget about the platform it all runs on. It's worth keeping up with the standards and using them to our advantage instead of fighting them.
