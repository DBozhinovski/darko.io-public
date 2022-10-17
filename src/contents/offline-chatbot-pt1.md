---
author: Darko Bozhinovski
title: Building an offline chatbot
datetime: 2018-05-20
slug: 'offline-chatbot-pt1'
tags:
  - 'chatbot'
  - 'offline'
description:
  'Building you an offline chatbot for great good. On the how, why and the possibilities when it comes to building such
  things.'
ogImage: '/lenin-estrada-OI1ToozsKBw-unsplash.jpg'
---

Having a borderline unhealthy obsession with making stuff run offline (my "day job" is partly to blame here), an idea
started keeping me up at night - why not a chatbot? The idea
[turned into a talk](https://www.youtube.com/watch?v=tJLIzsR9QZI) (not English tho) I gave at a local meetup but it
still feels like it deserves a more in-depth treatise on the why and how of building an offline chatbot.

## Why?

I mean, why not? 😎 With [PWAs](https://en.wikipedia.org/wiki/Progressive_Web_Apps) becoming more mainstream, we can
expect to see more "edgy" stuff in the browser, working offline and acting like a desktop app. So if we can have
[various games](https://outweb.io/), [tomato timers](https://tomatoes.work/),
[file sharing](https://onedoes.github.io/snapdrop/) and even [google drive/docs](https://drive.google.com) running
offline, why not a measly chatbot? For whenever you feel like talking to a not-particularly-smart glorified if / else
statement? No? Doesn't matter, read on 😆.

## How?

Take one part [create-react-app](https://github.com/facebook/create-react-app), one part
[compromise.js](http://compromise.cool/) with a sprinkle of react for UI and "brains" on top, et voila - a chatbot
basis. The `create-react-app` bit is not particularly interesting here, so we'll skip that and get into `compromise.js`
a bit before we get into the actually interesting parts.

### 1. Compromise.js

The self-described "modest natural-language processing in javascript" library is in fact a very cool piece of tech. It
may not be the [cleverest nor the fastest](https://github.com/spencermountain/compromise/wiki/Justification) NLP
solution out there, even when it comes to JavaScript land, but it runs in the browser and is perfectly capable of
running offline, as it doesn't depend on any third-party services. Best of all, it weighs around 200kb (which is around
the same size as jQuery, only cooler 😉). With that size, it still manages to be
[84%-86% accurate](https://github.com/spencermountain/compromise/wiki/Accuracy). Effin' amazing.

How it achieves that takes a bit of reading and theory to understand fully, but the gist of it is:

1. 80% of the used English language consists of the
   [top 1000 words](https://github.com/spencermountain/compromise/wiki/Justification#justification).
2. Statistically, the most common word type is a noun, so it makes sense to assume that any word unknown to the library
   is a noun.
3. With some word [stemming / lemmatization](https://en.wikipedia.org/wiki/Stemming), we can reduce the size of the
   dictionary needed for the library to run (word suffixes, for example).
4. And some sentence-level postprocessing on top leads us to the numbers mentioned above.

A thousand-word dictionary is perfectly acceptable for in-browser use, considering modern JS library sizes. A more
in-depth explanation of how compromise works [here](http://compromise.cool/) and
[here](https://github.com/spencermountain/compromise/wiki/How-it-Works). Oh, did I mention it also does plugins and
custom lexicons?

### 2. The "brains" part

Compromise.js sounds great and all, but how does that help us build a chatbot? Well, it doesn't directly, but we'll get
to that. Fundamentally, a chatbot can be described as a program that responds to natural language via request/response
cycles. So, a very dumb and basic chatbot would simply be a "reactive<sup>[1](#1)</sup>" program that can respond to
given strings. Ergo, we need a function that responds to given user input:

```ts
const getReply = (input) => {
  return 'This is your chatbot responding';
};

export default {
  getReply,
};
```

Now, this gives us a one-trick-pony of a chatbot that only knows to return the response above. To make it smarter we'll
"pirate" a page off of Amazon Alexa - we'll organize everything the bot knows into **skills**:

```ts
// The structure of a "bare" skill

const ID = 'skill_identifier_here';

const lexicon = {};

const matchRules = [];

const reply = (input, context) => {};

export default {
  ID,
  lexicon,
  matchRules,
  reply,
};
```

The theory here is that we'll have an index of all of the skills our bot knows, and we'll have a way of looking up the
most appropriate one by using the magic of compromise.js. Now, before we get any further into making the above-mentioned
lookup work, we need a bit more info on what compromise can do to simplify that otherwise tedious task.

When we give input to compromise.js, it's nice enough to tag all
[Parts of Speech](https://github.com/spencermountain/compromise/wiki/Part-of-Speech-Tagging) and give us a tool to
[match](https://github.com/spencermountain/compromise/wiki/Match-Syntax) against them, together with regex, plain words
and our own custom tags if we happen to need them. I mean, if you decide "glue" is a preposition, you can tell
compromise to treat it as such. But just so you know, "glue" is not a preposition. So, with that out of the way, we can
put the lookup part together:

```ts
import skills from './skills/'; // The index for all of our skills

const getReply = (input) => {
  const skillMatch = skills.find((s) => {
    const ruleMatch = s.matchRules.find((r) => nlp(input).normalize().match(r).found);

    if (ruleMatch) {
      return true;
    }
  });

  nlp(input).debug();

  if (skillMatch) {
    const reply = await skillMatch.reply(input, context);
    return reply;
  }
};

export default {
  getReply,
};
```

So, we improved our decision-maker to look for whether an input matches against a skill's match config. The whole
process can be described as:

1. We import all of our skills into the "brain" (line 1)
2. We look through each of a skill's match rules to find what works for the given input (lines 4-12);
3. If we happen to find a skill, we use its `reply` function to return a reply (lines 16-19)
4. Since compromise comes with a nice debugger, we use it to give us more info (line 14)

To make the puzzle complete, let's take a look at a full skill:

```js
import { random } from 'lodash';

const ID = 'greet';

const lexicon = {};

const matchRules = ['(hi|hello|ahoy|greetings|#Expression) bot?'];

const replies = [() => 'Hello human', () => 'Hi there', () => 'Sup?', () => 'Ahoy!'];

const reply = (input, context) => {
  const replyRoll = random(0, replies.length - 1);
  return replies[replyRoll](input, context);
};

export default {
  ID,
  lexicon,
  matchRules,
  reply,
};
```

What the above does, following the bare structure we defined previously is:

1. Define match rules (lines 7-9), giving our "brain" something to match against. So, whenever the brain gets a "hi",
   "hello", "ahoy" or "greetings" as input, that is going to trigger this skill, because compromise's `.match()` matches
   it here. As a last-ditch effort to make it work, whenever compromise recognizes something as an "#Expression" we
   trigger on that too (not ideal, but works surprisingly well).
2. In order not to get too boring with repetition, we randomize stuff a little bit with the "replies" array and pick a
   random one on each trigger (lines 11-18).

With that done, we have a basic bot that's not as dumb as its first iteration. This one can reply to greetings with a
greeting, making it at least somewhat context-sensitive. It's still too dumb for anything more sophisticated, but the
basics are there.

### 3. Improvements

There are some glaringly obvious shortcomings with our bot right now - it doesn't do too much right now, it's not aware
of historical data or context and doesn't do fallback answers when it doesn't match any of the given skills. And I plan
on making it better in part 2 of this thing, very soon 😎. For the impatient, have a look at my example bot from the
talk I mentioned above [here](https://github.com/DBozhinovski/beerjs-bot) or see it live
[here](https://beerbot.darko.io/). That version has a few more tricks up its sleeve, but by the time we're done with
this version of the bot, it will be a lot smarter than the deployed "beerbot" there.

Thanks for reading, and join me in the next installment when we improve the bot's "smarts" significantly.

---

1. <span id="1"></span> Not reactive as used in programming, but reactive as in
   "[readily responsive to a stimulus](https://www.merriam-webster.com/dictionary/reactive)" - although the two feel
   very similar here.
