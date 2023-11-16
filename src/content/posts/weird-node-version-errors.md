---
author: Darko Bozhinovski
title: "Weird node version errors and how to solve them"
pubDate: 2023-02-01
tags: ["node", "error", "shorts"]
description: "The woes of using two computers for development. On node versions and unfriendly errors."
ogImage: "/etienne-girardet-OA0qcP6GOw0-unsplash.jpg"
---

## Background - the two computers

I use two computers for work - a desktop that doubles as a gaming machine and a laptop that spends most of its hours in my office. Until recently, I believed both devices had the exact same setup, which allowed me to work in (what I thought was) the same environment.

Well, a recent `'ERR_OSSL_EVP_UNSUPPORTED'` convinced me otherwise. The full error is a bit longer and not too Google-friendly:

```bash
Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:71:19)
    at Object.createHash (node:crypto:140:10)
    at module.exports.__webpack_modules__.15660.module.exports (/home/****/node_modules/next/dist/compiled/webpack/bundle4.js:111680:62)
    at NormalModule._initBuildHash (/home/****/node_modules/next/dist/compiled/webpack/bundle4.js:85092:16)
    at handleParseError (/home/****/node_modules/next/dist/compiled/webpack/bundle4.js:85146:10)
    at /home/****/node_modules/next/dist/compiled/webpack/bundle4.js:85178:5
    at /home/****/node_modules/next/dist/compiled/webpack/bundle4.js:85033:12
    at /home/****/node_modules/next/dist/compiled/webpack/bundle4.js:51096:3
    at iterateNormalLoaders (/home/****/node_modules/next/dist/compiled/webpack/bundle4.js:50937:10)
    at Array.<anonymous> (/home/****/node_modules/next/dist/compiled/webpack/bundle4.js:50928:4) {
  opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],
  library: 'digital envelope routines',
  reason: 'unsupported',
  code: 'ERR_OSSL_EVP_UNSUPPORTED'
}
```

A bit of sleuthing later made me conclude that the default node version I have on my laptop is 16, while on my desktop, it's 19. I'm not exactly sure how that happened, but happily enough, the fix is simple - downgrade to an earlier version of node, or better yet, use something like [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) to switch between node versions as needed. On top of that, don't be like me, and make sure to use a [.nvmrc](https://github.com/nvm-sh/nvm#nvmrc) for your project 😉

## Extra credit: the origin of this error

[Node 17](https://nodejs.org/en/blog/release/v17.0.0/#openssl-3-0) switched to OpenSSL 3.0, which opens the way for [QUIC](https://en.wikipedia.org/wiki/QUIC) support. To quote the Node docs on this one:

> While OpenSSL 3.0 APIs should be mostly compatible with those provided by OpenSSL 1.1.1, we do anticipate some ecosystem impact due to tightened restrictions on the allowed algorithms and key sizes.
>
> If you hit an ERR_OSSL_EVP_UNSUPPORTED error in your application with Node.js 17, it’s likely that your application or a module you’re using is attempting to use an algorithm or key size which is no longer allowed by default with OpenSSL 3.0. A command-line option, --openssl-legacy-provider, has been added to revert to the legacy provider as a temporary workaround for these tightened restrictions.

So, as a takeaway - when you hit an error like `'ERR_OSSL_EVP_UNSUPPORTED'` - either change your Node version to an older one or, alternatively, use the `--openssl-legacy-provider` flag when trying to use the Node CLI.
