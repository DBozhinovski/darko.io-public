---
author: Darko Bozhinovski
title: "Building an offline chatbot, part 2"
pubDate: 2018-08-20
tags: ["chatbot", "offline"]
description:
  "Building you an offline chatbot for great good. On the how, why and possibilities when it comes to building such
  things. Part 2."
ogImage: "/alex-knight-2EJCSULRwC8-unsplash.jpg"
---

[Last time](/posts/offline-chatbot-pt1), we got down the basics of making a chatbot that runs offline but can only greet us.
This time around, we'll get to making it a tad smarter and teaching it a couple of tricks. To make that happen, first,
we'll take a step back and have a short look at the project structure since I realized I completely omitted that last
time. We won't get into the finer points of `create-react-app` of course, but some context is always helpful.
[Github link](https://github.com/DBozhinovski/beerjs-bot/) for reference, it helps to follow along :).

## Project structure

I'll try to keep this as brief as possible, focusing on the really important bits.

### 1. Dependencies

Aside from the already mentioned [compromise.js](http://compromise.cool/), there are a bunch of other dependencies that
are used for the bot's skills, namely (in no particular order):

1. [wikijs](https://github.com/dijs/wiki) - The "Hail Mary", a last-ditch effort to give the user some sort of response.
   Wikijs is a browser-friendly wrapper for any MediaWiki thingie out there.
2. [lodash](https://lodash.com/) - Needs no particular introduction, but I should note that I only use just stuff like
   `get`/`set`/`random` for simplicity. We can omit those and use homegrown functions instead, but that's not the point
   here.
3. [moment](https://momentjs.com/) - For all of our time-related needs. Used to determine time, format it in a friendly
   manner etc.
4. [weather-man](https://github.com/bhdouglass/weather-man) - Another browser-friendly library, that allows us to query
   [OpenWeatherMap](https://github.com/bhdouglass/weather-man) for local weather (although I should note, you need an
   [API key from OWM](https://openweathermap.org/api) to make this work).

Besides these, you'll find the usual suspects in any `create-react-app` out there, plus some utilities that aren't too
important for the bot itself.

### 2. Bot files

Now, on to the fun part. I touched upon some of these in the previous article, but we'll dig a bit further this time
around.

### 2.1. `/src/Bot.js`

Expanding on what we went over last time, first we get into the functionality this file exports - `getReply`:

```js
const getReply = async (input) => {
  // As mentioned previously - locate a rule that matches the input NLP analysis
  const skillMatch = skills.find((s) => {
    const ruleMatch = s.matchRules.find(
      (r) => nlp(input).normalize().match(r).found
    );

    // If we find one, return that;
    // Not ideal, but will get to this later.
    if (ruleMatch) {
      return true;
    }
  });

  // Show us some debuggin info;
  console.log(nlp(input).debug());
  if (skillMatch) {
    // Keep some historical data of what we matched -
    // we can use that later to make some fancier improvements.
    const topicHistory = get(context, "topics") || [];
    topicHistory.push(skillMatch.ID);
    // Also keep a "context" - or what we're currently talking about.
    // For clarity, context is a JSON object that contains a list of
    // matched topics, plus some metadata for the topics themselves.
    set(context, "topics", topicHistory);
    // Trigger the reply function of the matched skill (see below for details).
    const reply = await skillMatch.reply(input, context);
    // Pass that on for showing it to the DOM.
    return reply;
  } else {
    // If we get no match, return something generic plus the help command,
    // to help the user continue the conversation.
    return { mode: "text", value: "Beep Boop! (type help)" };
  }
};
```

The rest of that [file](https://github.com/DBozhinovski/beerjs-bot/blob/master/src/Bot.js) is some code that determines
context (the one we should start with at boot), plus some dependency imports, so I'll skip those as they are pretty
self-explanatory.

### 2.2. `/src/skills/*`

As mentioned in the previous installment, a skill is something that the bot can do/has a way of "understanding" and
replying to. So, let's take a closer look at the "greet" skill from last time, although expanded a bit:

```js
// The skill's ID - mostly for "bookkeeping"
const ID = "greet";

// A custom lexicon, which this particular skill doesn't use
const lexicon = {};

// What input triggers this response;
// These are similar to regex, with some extra stuff included.
// More here: https://github.com/spencermountain/compromise/wiki/Match-Syntax
const matchRules = ["(hi|hello|ahoy|greetings|#Expression) bot?"];

// A list of potential replies, from which we pick at random;
// Done this way in order not to get too boring ;)
const replies = [
  // This one is a bit special:
  // It tries to determine whether we already know the user.
  (input, ctx) => {
    return {
      mode: "text",
      // If it happens to find a name, stored by the "intro" skill,
      // it uses that name to greet the user.
      // More here: https://github.com/DBozhinovski/beerjs-bot/blob/master/src/skills/intro.js
      value: get(ctx, "intro.name")
        ? `Hello ${ctx.intro.name.split(" ")[0]}.`
        : `Beep boop, I'm a dumb bot. Who are you?`,
    };
  },
  () => ({ mode: "text", value: "Hi there." }),
  () => ({ mode: "text", value: "What's up?" }),
  // Another difference over last time:
  // Using react components to return images in addition to text;
  // Makes thins a bit fancier and more interactive.
  // Determined by the 'mode' param, which can take the
  // values of 'img' or 'text'.
  () => ({
    mode: "img",
    value: "https://media.giphy.com/media/FBeSx3itXlUQw/giphy.gif",
  }),
  () => ({
    mode: "img",
    value: "https://media.giphy.com/media/BVStb13YiR5Qs/giphy.gif",
  }),
];

// The reply function, triggered when the "brain" matches this skill (see above)
const reply = (input, context) => {
  const timesMatched = get(context, "greet.matched", 0);
  // Set the context data
  set(context, "greet.matched", timesMatched + 1);

  // Write the context data to keep it after a browser reload
  localStorage.setItem("bjs-bot-context", JSON.stringify(context));

  // Get a random reply
  const replyRoll = random(0, replies.length - 1);

  return replies[replyRoll](input, context);
};
```

Except for having more code in there, the one major difference from last time is the response mode. Having images in
addition to text feels like a good choice to make things a bit more interesting, as opposed to using just text.

Using the above pattern, we can build any skill we can think of. Of course, there's a point at which the matching system
will start being weird and inaccurate, due to the potential for overlaps in the matching syntax. It's not too simple
keeping track of more than 10 skills and expecting reliable results (I imagine). We will address that later, however,
using something that starts with Bayes, and ends with classifier :).

### 2.3. The rest of it

To clarify some of the GUI / state code, I'll briefly go over how it all ties together:

1. `/src/index.js` simply renders the `App` component into the DOM.
2. `/src/App.js` loads some CSS, and renders the basic layout into the DOM plus the `Chat` component, which is the
   "meat" here.
3. `/src/Chat.js` is the big one - it manages the state of the application, renders the `Input` and `History`
   components, handles input submission, takes care of starting the bot and finally, is in charge of enabling/disabling
   the `Input`` (when the bot is producing a reply with that fancy typing animation ;)).
4. `/src/Input.js` is a simple presentational component that loads some CSS and renders the input on the screen. Its
   state and behavior are dictated by `Chat.js`.
5. `/src/History.js` is also a "dumb" presentational component that handles the chat history, but with a nasty hack -
   since I'm using react-typed in there, I have to somehow hide the blinking cursor when the bot finishes its message.
   Without getting into too much detail over the issue, this component is in charge of rendering text or images that
   come from the `Chat` component's state above.

## Building a new skill, step by step

Now, smarts are a relative thing when building an automated reply machine such as this one. Its smarts are pretty much
contained in the amount and diversity of replies it can provide. We have a diversity of replies nailed down somewhat, by
picking a random one on each input. But the real smarts are determined by the diversity of topics they can cover. The
bot currently can do the following "tricks":

1. `/src/skills/general.js` uses wikipedia to try and find an answer to an input that doesn't trigger any other
   response.
2. `/src/skills/greet.js` greets the user. It can also greet them by name if it's already saved by the intro skill.
3. `/src/skills/name.js` replies with the Bots name (tries to be a smartass in the process).
4. `/src/skills/roll.js` can roll a dice for the user.
5. `/src/skills/time.js` tells you the current time and can be a bit sassy if you keep on asking for the time.
6. `/src/skills/util.js` contains the easter egg and system responses.
7. `/src/skills/weather.js` can tell you the current weather. Currently hardcoded to my hometown, but can be easily
   changed by asking for geolocation from the browser or changing the LAT/LON values to your location.

Now, let's teach it something new.

### Making the bot tell (dad) jokes

The internet is full of joke databases, but to preserve the bot's sassy character, we'll make it only tell dad jokes -
the cringier, the better. Naturally, there already is a
[database for that sort of thing that also happens to have a very nice API](https://icanhazdadjoke.com). And that's
exactly what we're going to use for the skill.

On to the code part itself (`/src/skills/dadjoke.js`):

```js
// The ID of the skill
const ID = "dadjoke";

// No custon lexicon / overrides
const lexicon = {};

// We compress a couple of sentences that ask for a joke
const matchRules = ["(know|tell)? (any|me)? a? (joke|jokes)"];

const reply = async (input, context) => {
  // We fetch a random dadjoke in plaintext,
  // identifying as beerbot (just being a good internet citizen)
  const reply = await fetch("https://icanhazdadjoke.com/", {
    headers: {
      Accept: "text/plain",
      "User-Agent": "beerbot",
    },
  });

  // "Unpack" the joke from the fetch using text
  // (since we requested it in plaintext)
  const joke = await reply.text();

  // Return the joke for rendering on screen
  return {
    mode: "text",
    value: joke,
  };
};

export default {
  ID,
  lexicon,
  matchRules,
  reply,
};
```

While this is great and makes the bot smarter and perhaps funnier, it makes something painfully obvious - the
objectively crappy matching algorithm :). One example that comes to mind is typing "what is a joke?" or something along
those lines. That will trigger the newly built joke skill and that's not the appropriate one for this scenario. The more
appropriate one would be a general skill, which will ask Wikipedia for an answer to the question and provide a
meaningful response.

## Improvements

There are a ton of smaller things that can be improved, but the big one is, as mentioned above, the matching algorithm.
Since we're trying to keep this offline and reasonably fast a
[Naive Bayes Classifier](https://en.wikipedia.org/wiki/Naive_Bayes_classifier) comes to mind as a quick and relatively
easy solution to the matching problem. There happens to be a very nice,
[browser-friendly library](https://github.com/ttezel/bayes) out there to address this, and we'll use that in part three
to make the bot behave a lot smarter.

Thanks for reading and join me in part 3, where we'll get into some more interesting stuff that will (hopefully) make
for a smarter chatbot.
