---
author: Darko Bozhinovski
title: Build you a COVID-19 tracker the (fun) hard way
datetime: '2020-04-27'
slug: 'corona-tracker-the-hard-way'
tags:
  - 'pwa'
  - 'offline'
  - 'gatsby'
  - 'jamstack'
description:
  'An adventure in parsing, data massaging, frustration and over-engineering. That just happens to be about COVID-19
  data.'
ogImage: '/isaac-smith-6EnTPvPPL6I-unsplash.jpg'
---

## The short of it - why would you build another one of these?

Well, dear fictional reader, it seemed like everyone and their grandmas built one of these, so I wanted to be one of the
cool kids or something. Bad attempts at humor aside, it looked like an interesting exercise in fetching data,
homogenizing it and presenting it in a manner that worked for me. I started being very annoyed at having to open
multiple (credible?) tabs of sources on the topic at hand. So after a bit of research, I settled on using ECDC, WHO and
Wikipedia as the sources for my tracker app. With the additional self-imposed "limitation" of it being a static web
application (and a PWA), built with Gatsby and hosted on Netlify.

### Prior art

I did some research about how people build these before I began working on it - it seemed that the most popular approach
was to crawl Worldometer, present the results and call it a day. All good and well, but you'd need a server for these
(although, admittedly, in a world of serverless lambdas, even that can be circumvented trivially), and I already agreed
with myself that this is going to be a static one, for no good reason whatsoever. Not because I hate paying for stuff I
use (and the lovely people at Netlify allow all of this for free), but it's more of an "if I don't have to, I won't".
Insert something about being environmentally aware... Okay, f\*\*k it, I'm cheap.

And then, I left the idea to fester in the pit of abandoned project ideas (each of us has one of these, right?), until I
stumbled upon this thing: https://www.reddit.com/r/memes/comments/fkyiph/is_that_you_rona/. And just like that, I had a
logo for the app. That little dog was exactly what I needed to get inspired and start hammering this thing out.

![Is that you Rona?](/rona.jpg)

The final result of the whole adventure can be seen at https://rona.darko.io. What's more interesting is the journey.
Especially WHO's damned PDFs :) Also, the source for it: https://github.com/DBozhinovski/rona.darko.io

## Basic project structure

I began with a very basic Gatsby starter - [greater gatsby](https://github.com/rbutera/greater-gatsby). This is a lovely
starter which I cannot recommend enough. It's pretty easy to work with, very lightweight and comes with some awesome
tools out of the box. However, it's minimal in the sense that it doesn't impose a lot of opinions on how you should
build your project. Not too many bells and whistles, but a lot of tools to help you build things fast, assuming you
enjoy the stack. TypeScript, PostCSS, TailwindCSS, Styled Components would be the highlights for me.

Aside from that, the structure isn't too interesting:

- `gatsby-config`, `gatsby-node`, `gatsby-browser` and `gatsby-ssr` help Gatsby do its magic and make use of the plugins
  that come with the starter (more on those below).
- `src` contains the "client-side" code:
  - `components` hold all of the React components the applications use
  - `images` contain, well, images.
  - `pages` also contain components in a sense, but these are rendered by Gatsby directly as static web pages. So
    essentially, the "important" part of what the user sees on screen.
  - `templates` hold templates, usually markdown, but not always. In the case of Rona, it holds two types of templates:
    - `post.tsx` which renders the `.mdx` pages inside the `pages` directory. You can think of `.mdx` as a markdown with
      benefits. [React benefits, that is](https://mdxjs.com/).
    - `report.tsx` renders per-country reports for COVID-19 status worldwide. I would like to give a huge shout-out to
      ECDC for providing the data in the format they do. It's an example of well-formatted and easily accessible data
      that opens some very interesting possibilities for applications such as Rona.
- `scrapers` contain build-time scrapers for fetching data from their respective sources:
  - `wikipedia` scrapes Wikipedia, the old-fashioned way
  - `who` does some pretty unholy things (which I will get into), but I didn't have a choice. And I wanted the data bad.

## Fetching the data and making Gatsby use it

As you may, or may not know dear fictional reader, Gatsby uses GraphQL in a very interesting way to make any piece of
data accessible in any part of the code you may want to have it in. As with UNIX's "everything is a file" mantra when it
comes to Gatsby "everything is GraphQL" describes it pretty close, I think. Want local files on your pages? GraphQL.
Want markdown frontmatter data (or even body data) on your pages? GraphQL. Want any sort of data anywhere? Use GraphQL.
There's a plugin for everything under the sun, and even if there isn't, it's pretty simple to write one with some basic
Node.js knowledge.

So, on to individual sources and how I managed to use them in Gatsby.

### 1. ECDC

This one was pretty simple. The data is formatted as JSON, and on top of that, with a timestamp, with day-by-day changes
of status (file found [here](https://opendata.ecdc.europa.eu/covid19/casedistribution/json/)). Again, thanks to the good
folks that format the data the way they do, it was a simple matter of:

#### Dependencies

As I mentioned above, there's a plugin for everything. Fetching a remote (JSON) file included:

```bash
npm install gatsby-source-remote-file
```

Followed by adding the plugin to the `gatsby-config` file:

#### Configuration

```js
...
{
  resolve: 'gatsby-source-remote-file',
  options: {
    // The source for the ECDC JSON data
    url: 'https://opendata.ecdc.europa.eu/covid19/casedistribution/json/',
    // the "name" by which we find the fetched data
    name: 'ecdcStats'
  },
},
...
```

This, of course, is handled automatically in the background, letting us use the data directly (since it's fetched at
build time).

#### Code

Most of the magic in Gatsby happens at build time (not that it can't happen at runtime), and it happens in the
`gatsby-node` file, which serves as the central point for handling data, generating GraphQL and pages.

There are two interesting functions `gatsby-node` functions in the context of Rona:

1. `onCreateNode` - gets called whenever a node is created. It allows us to extend or transform the data before it goes
   into GraphQL.
2. `sourceNodes` - gets called only once (if defined in `gatsby-node`, different rules apply for plugins), after all,
   other sources nodes have finished their node creation. We're using these to fetch WHO and Wikipedia data (details
   below).
3. `createPages` - called whenever you need to programmatically create pages. We'll be using this later when we create
   per-country reports. With fancy charts, of course.

So, in a nutshell:

> `onCreateNode`, `sourceNodes` -> do things to data
>
> `createPages` -> show said data programatacially

---

The code in question, for the ECDC data in particular:

```js
// Note this is an async function:
exports.onCreateNode = async ({
  node,
  loadNodeContent,
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) => {
  // We check whether the data node is named "ecdcStats";
  // This is the same name we gave
  // the data in gatsby-config.js
  // If not, we ignore it.
  if (node.name !== 'ecdcStats') {
    return;
  }
  try {
    // We read the data using loadNodeContent
    const nodeContent = await loadNodeContent(node);
    // We parse the data, since it's given in JSON
    const ecdcData = JSON.parse(nodeContent.trim());

    // Additionally, we write it to a file;
    // As to why, continue reading ;)
    // Also, ignore the double trim; It's useless.
    // Also, I accept PRs ;)
    fs.writeFile('public/ecdc.json', nodeContent.trim(), (err) => {
      if (err) console.err(err);
    });

    // For each ECDC record we create a new data node
    // that can be used inside Gatsby pages.
    // You can check the Gatsby docs for details on
    // the nodes themselves.
    ecdcData.records.forEach((country, idx) => {
      // Generate the node id (it needs one)
      const childId = createNodeId(`${node.id}${idx}`);
      // Generate an object for the country data node:
      const countryNode = {
        ...country,
        dateReported: (() => {
          const d = new Date();
          d.setDate(country.day);
          d.setMonth(country.month - 1);
          d.setFullYear(country.year);

          return d;
        })(), // Add an actual parsed date
        countryId: idx,
        sourceInstanceName: node.name,
        id: childId,
        children: [],
        parent: node.id,
        internal: {
          type: 'ECDCCountry',
          contentDigest: createContentDigest(country),
        },
      };
      // Finally, create the node in GraphQL.
      createNode(countryNode);
    });
  } catch (error) {
    // So error, such handling, wow.
    console.error(error);
  }
};
```

After that, the data is accessible inside Gatsby's GraphQL, ready to be queried and used inside the pages. A query would
look something like:

```graphql
query EcdcDataQuery {
  allEcdcCountry {
    nodes {
      cases
      countriesAndTerritories
      deaths
      countryId
      countryterritoryCode
      dateReported
    }
  }
}
```

Which, returns an object like:

```js
{
  allEcdcCountry: {
    nodes: [
      ...
      {
        cases: <numberOfCases>
        countriesAndTerritories: <countryName>
        deaths: <numberOfDeaths>
        countryId: <countryId>
        countryterritoryCode: <countryCode>
        dateReported: <dateOfReport>
      }
      ...
    ]
  }
}
```

> To sum this part up: `onCreateNode` gives us the data from the remote file.

> Using a GraphQL query as shown above, we can use that data inside a page.

### 2. Wikipedia

If we have to sort getting data by how difficult it is, Wikipedia comes second. It's not too hard by itself - if you
have some DOM API chops, you can do this pretty easily. But I cannot for the life of me figure out why it keeps on
selecting `thead`, when I only want the `tbody` :(. Any hints?

A bit of history here: My first try involved using cheerio. While I'm not jQuery hater (in fact, I like the API design
quite a bit), I never had luck with cheerio. I've had 4 different projects that had problems suitable for cheerio - and
I initially tried using it, ultimately going frustrated AF and deciding on using something more "low-level", such as
JSDOM. It's not you cheerio, it's me.

Oh, and the page in question: https://en.wikipedia.org/wiki/Template:2019%E2%80%9320_coronavirus_pandemic_data As you
can see, there's a table on the right, which is exactly what we're after. A few DOM selector queries and the data is
ours.

#### Dependencies

There are two new dependencies here: axios and jsdom.

```bash
npm install axios jsdom
```

> Note: if you happen to worry about bundle size - fear not. These stay in build time. We only use them on the build
> machine, which in the case of Rona, is graciously provided by Netlify. They happen to be awesome, btw.

#### Code

While we don't change any configuration, we have some changes in `gatsby-node`, and our first scraper:

```js
// gatsby-node.js

// Import the wikipedia scraper
const wikiParser = require('./scrapers/wikipedia');

// sourceNodes also takes an async function
exports.sourceNodes = async ({ actions, createContentDigest }) => {
  // Let it do its magic; We pass actions
  // and createContentDigest on to it.
  // We'll get into their function below.
  await wikiParser(actions, createContentDigest);
};
```

And on to our first scraper - `wikipedia.js`, residing in the `scrapers` directory:

```js
// wikipedia.js
const axios = require('axios');
const fs = require('fs');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

// actions -> allows us to access createNode (described above)
// createContentDigest -> A digest “Hash”, or short digital summary, of the content of this node
const scrapeWikipedia = async (actions, createContentDigest) => {
  const { createNode } = actions;
  const outFile = {};

  // First off, we fetch the page via axios
  const res = await axios.get('https://en.wikipedia.org/wiki/Template:2019%E2%80%9320_coronavirus_pandemic_data');

  // We send the response to JSDOM
  // The runScripts part isn't needed. I forgot about it,
  // and left it in there. Part of the above-mentioned frustration
  // related to thead and tbody.
  const dom = new JSDOM(res.data, { runScripts: 'dangerously' });

  // Get all tr (table rows), make an array out of them
  // Uses a plain ol' DOM selector - it would work identically
  // as running it in the console with the linked wikipedia page open.
  const tbodyTr = Array.from(dom.window.document.body.querySelectorAll('#thetable tbody tr:not(.sortbottom)'));

  // For simpler formatting to JSON, I made an array of things
  // that are interesting to get (keys in the JSON)
  // and things that we don't care about (false).
  const table = [false, 'name', 'cases', 'deaths', 'recovered', false];
  // Same for the header table, which gives us the total
  // cases. Saves some CPU time on our side :)
  const totalTable = [false, 'cases', 'deaths', 'recovered', false];

  // We iterate over each row...
  tbodyTr.forEach((tr, i) => {
    const cData = {};
    // ... Ignoring the first one, since it's the table header and we don't really need that...
    if (i === 0) return;

    // ... The one at index 1 is the sum of all cases / deaths / recovered numbers,
    if (i === 1) {
      // So we clean that up a bit and add it to an object...
      Array.from(tr.children)
        .filter((c) => c.textContent)
        .forEach((c, i) => {
          if (totalTable[i]) {
            cData[totalTable[i]] = parseInt(c.textContent.replace(/\D/g, ''), 10) || 0;
          }
        });

      // ... which we use to create a GraphQL node.
      const wikiTotalNode = {
        id: `wnode-total`,
        parent: '__SOURCE__',
        internal: {
          type: 'WikiCountryTotal',
          contentDigest: createContentDigest(cData),
        },
        children: [],
        ...cData,
      };

      // Oh, and we also add it to a file. Details a bit further down ;)
      outFile.total = cData;
      // And we create the node at last.
      createNode(wikiTotalNode);

      return;
    }

    // Same process for the rest of the table rows - we extract the data from the crawled table
    // Add them to a JSON object
    // And finally, create a node out of them.
    Array.from(tr.children).forEach((c, i) => {
      if (table[i]) {
        cData[table[i]] = c.textContent.replace(/\[.*\]|\(.*\)|\n|,/g, '').trim();
        if (table[i] !== 'name') {
          cData[table[i]] = parseInt(cData[table[i]].replace(/\D/g, ''), 10) || 0;
        }
      }
    });

    const wikiCountryNode = {
      id: `wnode-${i}`,
      parent: '__SOURCE__',
      internal: {
        type: 'WikiCountry',
        contentDigest: createContentDigest(cData),
      },
      children: [],
      ...cData,
    };

    outFile[cData.name] = cData;

    createNode(wikiCountryNode);
  });

  // Dump the file data to an actual file, and we're done.
  fs.writeFile('public/wikipedia.json', JSON.stringify(outFile), (err) => {
    if (err) console.err(err);
  });
};

module.exports = scrapeWikipedia;
```

> In summary for this section: we crawl the wikipedia (table template) page for COVID data and create a `sourceNode` for
> wikipedia, which crawls the page described above and creates GraphQL nodes from the table rows we extract using the
> DOM selector API.

### 3. WHO

I'm no stranger to parsing weird formats, but seriously, f\*\*k parsing PDF files. You get some plain text (if you're
lucky). Have fun. Pausing the rant for a second here, WHO provides a daily report of the current worldwide situation
according to their metrics. Each of those reports is, well, a PDF file, with a similar structure. There is a per-country
table with stats in the files. Which happens to be useless if you want to access the data for anything else than just
reading the PDF.

I thought about giving up on WHO, but I often have more stubbornness than sense for these kinds of problems.

So, the reports are located at: https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports. It's
pretty easy to get the latest one, by using similar methods to what we did with Wikipedia and DOM selectors.

#### Attempt 1 [failed]: Parsing via a classifier

My first attempt involved being a smart\*\*s, and trying to trick the file into giving up its data.

The idea was:

1. Split the textual data into files (using `.split('\n')`)
2. Run each line through https://github.com/axa-group/nlp.js, and filter the lines that are data from the ones that are
   gibberish (in the context of being able to use the data for an application):

The second step also involved "positive" and "negative" examples:

```js
// Positive example - we want to keep lines like these, since they are data
[
  'China 82631 86 3321 7 Local transmission 0',
  'Papua New Guinea 1 0 0 0 Imported cases only 11',
  'New Zealand 647 47 1 0 Local transmission 0',
  'Northern Mariana Islands (Commonwealth of the) 2 0 0 0 Under investigation 3',
  'The United Kingdom 25154 3009 1789 381 Local transmission 0',
  'Austria 10182 564 128 20 Local transmission 0',
  'Liechtenstein 68 4 0 0 Under investigation 0',
];
```

... and negative ones:

```js
// Negative example - we filter these out, as they aren't the data we're after
[
  'Numbers include both domestic and repatriated case',
  'Case classifications arebased on WHO case definitionsfor COVID-19.',
  'Due to differences in reporting methods, retrospective data consolidation, and reporting delays, the number of new cases maynotalways',
  'All public health measures to stop disease spread can be balanced with adaptive strategies to encourage community ',
  'connection within families and communities. Measures for the general public include introducing flexible work',
  'Figure 1. Countries, territories or areas with reported confirmed cases of COVID-19, 1 April2020',
  '▪ Module 3: Repurposing an existing building into a SARI treatment centre ',
  'installations for SARI facilities is currently under development. ',
  'new ',
  'Transmission ',
  'Northern Mariana ',
  'the) ',
];
```

Full solution attempt here, for the curious:
https://github.com/DBozhinovski/rona.darko.io/commit/978b76b7bff601c300ad714573d09d6ea3b263be#diff-4291a39b6fd48c54e4d3c0a5bab8241b

While it was mostly okay, it failed for a couple of reasons. Due to how it was formatted, some of the country names were
split into multiple lines. And I happened to use those pesky `\n` to split the text into lines. Which of course,
resulted in valid data being filtered out. Not to mention having a bunch of false positives and false negatives, which
could have been solved by adding more examples to the arrays above, but I realized that it slowly became whack-a-mole
that probably couldn't be solved reliably. Not to mention it was incredibly slow. Not that it mattered too much, since
it only happened at build time, but still. So I went on to some darker, less holy methods.

#### Attempt 2 [seems to be working for now]: Parsing via ungodly incantations (regex)

#### Dependencies

We only need crawler-request, which allows us to fetch a PDF file from somewhere and get its text data (if it has one).

```bash
npm install crawler-request
```

#### Code

First off, we make some changes to `gatsby-node`:

```js
// gatsby-node.js

const wikiParser = require('./scrapers/wikipedia');
// Similar to what we did with the wikipedia scraper
// we import the who one
const whoParser = require('./scrapers/who');

exports.sourceNodes = async ({ actions, createContentDigest }) => {
  await wikiParser(actions, createContentDigest);
  // And let it run
  await whoParser(actions, createContentDigest);
};
```

...And off to the nasty:

```js
// who.js
const axios = require('axios');
// As I was writing the post, I realized that I kept using cheerio for this scraper. Oh well.
const cheerio = require('cheerio');
const crawler = require('crawler-request');
const fs = require('fs');

// We can see the same arguments as in wikipedia, so nothing too interesting there
const scrapeWHO = async (actions, createContentDigest) => {
  const { createNode } = actions;
  const outFile = {};

  // We grab the latest report URL
  const latestRep = await axios.get(
    'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports',
  );
  const $ = cheerio.load(latestRep.data);

  // Add the WHO URL root to it
  const WHORoot = 'https://www.who.int';
  const latestReportURL = `${WHORoot}${$('#PageContent_C006_Col01 div>p a').first().attr('href')}`;

  const latestReportDateText = latestReportURL.split('situation-reports/')[1].split('-')[0];
  // Get the date of the report
  const latestReportDate = new Date();
  latestReportDate.setDate(parseInt(latestReportDateText.slice(6, 8), 10));
  latestReportDate.setMonth(parseInt(latestReportDateText.slice(4, 6), 10) - 1);
  latestReportDate.setFullYear(parseInt(latestReportDateText.slice(0, 4), 10));

  // And finally, fetch the file
  const pdfRes = await crawler(latestReportURL);

  // Nasty no. 1: The report, unti now, has a single table that we care about.
  // It always starts with the "Table 1." text, so we split on that.
  const tableSplitUp = pdfRes.text.split('Table 1.');

  // Since we don't care about what's above that line, we only take the one below (at index 1)
  // And split again on "Numbers include both domestic and repatriated cases"
  // because that's the text that's always at the end of the data we care about.
  // Both pieces of text, for the above and below split seem to be unique in the file.
  const tableSplitDown = tableSplitUp[1].split('Numbers include both domestic and repatriated cases');

  // Again, we split at the heder text, because the data we actually care about starts after "reported case"
  // which at the time of writing wasn't unique in the file - but was unique to the chunk we split.
  const headerSplit = tableSplitDown[0].split('reported case');

  // This one gave me quite the headache. Turns out, the good people at WHO decided to put one of the
  // transmission classification in new lines, which obviously broke it. So first, I had to replace it with
  // its single-line equivalent, and then split on `/\d+ \n/g`.
  // That was, to my knowledge the only reliable way to split the lines the way I liked.
  // Each line ends up with a number (days since last reported case), followed by a new line.
  const lines = headerSplit[1].replace(/\s+Community\s+Transmission\s+/g, ' Community Transmission ').split(/\d+ \n/g);
  const last = lines.length - 1;

  // We iterate over each of the lines
  lines.forEach((l, i) => {
    // And remove rogue \n character remaining (found in some country names) and normalize them.
    const newLinesRemoved = l.replace(/\n/g, '');
    // Some of the lines happen to be "splitters", with region names in them.
    // We fully remove those, since they aren't really data.
    const tNamesRemoved = newLinesRemoved
      .replace(
        /European Region|Western Pacific Region|Territories\*\*|South-East Asia Region|Eastern Mediterranean Region|Region of the Americas|African Region/g,
        '',
      )
      .trim();
    // There are also some special characters leading to footnotes - we also don't want those.
    const specCharsRemoved = tNamesRemoved.replace(/\[.*\]/g, '');

    // The country name is all the characters up until the first number.
    const name = specCharsRemoved.split(/ \d/)[0];
    // Whats left are the numerical stats we care about.
    const [confirmed, confirmedNew, totalDeaths, newDeaths] = specCharsRemoved.split(' ').filter((w) => w.match(/\d/g));

    // Finally, we put those into an object.
    const parsedData = {
      name,
      confirmed,
      confirmedNew,
      totalDeaths,
      newDeaths,
      latestReportDate,
    };

    if (i === last) {
      // Write them to an object that will be dumped to a file
      outFile.total = {
        confirmed,
        confirmedNew,
        totalDeaths,
        newDeaths,
      };

      // The last node contains the total data, so we treat it as a separate, "special" node.
      const WHOTotalNode = {
        id: `WHO-total`,
        parent: '__SOURCE__',
        internal: {
          type: 'WHOTotal',
          contentDigest: createContentDigest(parsedData),
        },
        children: [],
        confirmed,
        confirmedNew,
        totalDeaths,
        newDeaths,
        latestReportDate,
      };

      createNode(WHOTotalNode);
    } else {
      outFile[name] = {
        confirmed,
        confirmedNew,
        totalDeaths,
        newDeaths,
      };

      // Otherwise, we create a GraphQL node for the country in question.
      const WHOCountryNode = {
        id: `WHO-${i}`,
        parent: '__SOURCE__',
        internal: {
          type: 'WHOCountry',
          contentDigest: createContentDigest(parsedData),
        },
        children: [],
        ...parsedData,
      };

      createNode(WHOCountryNode);
    }
  });

  // Dump to file, and our torment comes to an end.
  fs.writeFile('public/who.json', JSON.stringify(outFile), (err) => {
    if (err) console.err(err);
  });
};

module.exports = scrapeWHO;
```

> In summary to fetching WHO data - in terms of Gatsby, it's not too different from Wikipedia. In terms of how it got
> scraped, with the amount of regex used and the way I used it, I'd like to take a shower immediately.

---

## Showing the data on the screen

My "marvelous" UI design skills aside, the pages themselves are pretty simple. I'll skip the layout / CSS in favor of
the more interesting bits:

### index.tsx

The landing page has can show two pieces of data - global statistics, and local statistics, based on geolocation (if the
user allows us access to it). As an aside, we're not being creepy here - no data sent to Google, no trackers, no
analytics or any of that shadiness. We simply ping [OpenStreetMap](https://nominatim.openstreetmap.org/reverse) for a
country name for the given coordinates, and that's that. Details at:
https://github.com/DBozhinovski/rona.darko.io/blob/master/src/components/LocalStats.tsx

If we don't get geolocation, we simply give the user a link for a manual search. What may be a bit more interesting here
is the GraphQL query:

```graphql
query HomePageQuery {
  allEcdcCountry {
    nodes {
      cases
      countriesAndTerritories
      deaths
      countryId
      countryterritoryCode
      dateReported
    }
  }
  allWhoCountry {
    nodes {
      confirmed
      confirmedNew
      name
      newDeaths
      totalDeaths
    }
  }
  allWhoTotal {
    nodes {
      confirmed
      confirmedNew
      newDeaths
      totalDeaths
      latestReportDate
    }
  }
  allWikiCountry {
    nodes {
      cases
      deaths
      name
      recovered
    }
  }
  allWikiCountryTotal {
    nodes {
      cases
      deaths
      recovered
    }
  }
  allLastScraped {
    nodes {
      date
      month
      year
    }
  }
}
```

Essentially, this is the whole data we generated during our build step described in the sections above. We can use a
similar query on any page we'd like, which is just a testament to Gatsby's flexibility. After a bit of data
normalization (https://github.com/DBozhinovski/rona.darko.io/blob/master/src/pages/index.tsx#L29-L59), we send the data
to be rendered by their respective components - `GlobalStats` and `LocalStats`. These use a simple table component
(https://github.com/DBozhinovski/rona.darko.io/blob/a7bfa257bf481dd85aef295c0a21514caf0d90c9/src/components/DataTable.tsx)
to render the given data.

### manual-search.tsx

While the data is pretty much the same as in index.tsx, there is an extra bit here that may be interesting:

https://github.com/DBozhinovski/rona.darko.io/blob/a7bfa257bf481dd85aef295c0a21514caf0d90c9/src/pages/manual-search.tsx#L85

```js
const wikiSearch = new Fuse(wikiData, { keys: ['name'], threshold: 0.2, minMatchCharLength: 3 });
const ecdcSearch = new Fuse(Object.keys(ecdcTotal), { threshold: 0.2, minMatchCharLength: 3 });
const whoSearch = new Fuse(Object.keys(whoData), { threshold: 0.2, minMatchCharLength: 3 });
```

This allows us for flexible, super fast local country search. All thanks to fuse.js.

### about.mdx and datasets.mdx

These two are dead-simple markdown pages, for which there is some rendering config in the full source of `gatsby-node`.
However, `datasets.mdx` contains links to those JSON dumps we did in the build step. What those do is grab the parsed /
formatted data, dump it into a JSON file that gets served by gatsby, and is fully accessible for use. The point was - to
be a good internet citizen and try making a nasty task easier, if possible. So, please, help yourself to the parsed data
if you have an idea and need the data to build something. I'm happy to share :)

If you happen to use it, just let me know you did so ([my Twitter](https://twitter.com/d_bozhinovski)). I'd love to see
what comes out of it :)

### Templates

The post template isn't too interesting. It simply takes a `.mdx` file and renders it on a page. I'm using this one for
the `about` and `datasets` pages above.

However the `report.tsx` template is more interesting. What it does is it gets the data for a given country, and renders
some line charts for the statistics for a given country, all thanks to the lovely dataset provided by
[ECDC](https://opendata.ecdc.europa.eu/covid19/casedistribution/json/).

These pages are automatically generated from the data. So, on to the how of it:

```js
// gatsby-node.js

// We use createPages here to generate pages from data programatically
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // We fetch the data we generated using `onCreateNode` via GraphQL
  const result = await graphql(`
    query {
      allEcdcCountry {
        edges {
          node {
            cases
            countriesAndTerritories
            deaths
            countryId
            countryterritoryCode
            dateReported
          }
        }
      }
    }
  `);

  // We group the countries first, because they come in a flat array, and we want per-country separation
  // for the reports
  const groups = result.data.allEcdcCountry.edges.reduce((acc, r) => {
    const report = r.node;

    if (acc[report.countryterritoryCode]) {
      acc[report.countryterritoryCode].push(report);
    } else {
      acc[report.countryterritoryCode] = [report];
    }

    return acc;
  }, {});

  // For every group in the object,
  // we generate a page with a path that contains the country code
  // (for uniqueness)
  Object.keys(groups).forEach((k) => {
    createPage({
      path: `/reports/${k}/`,
      component: require.resolve(`./src/templates/report.tsx`),
      context: {
        countryData: groups[k],
        name: groups[k][0].countriesAndTerritories,
      },
    });
  });
};
```

That takes care of the generation part. I wanted to show some line charts for the statistics, so after some research, I
decided to use [react-charts](https://react-charts.js.org/). So on to the template:

```tsx
import React from 'react';
import styled from 'styled-components';
import tw from 'tailwind.macro';
import { Chart } from 'react-charts';
import { format, parseISO, set } from 'date-fns';

import Layout from '../components/layout';
import SEO from '../components/seo';

// Some styled components with tailwind, nothing to see here
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 2em;
  align-items: center;
  width: 100vw;

  div {
    padding: 2em 0;
  }
`;

const Title = styled.div`
  ${tw`text-center text-2xl`}
`;

const SubTitle = styled.div`
  ${tw`text-center text-l`}
`;

const Report = styled.div`
  ${tw`flex flex-col items-center justify-center`}
`;

const ReportItem = styled.div`
  ${tw`p-0 m-0`}
`;

// A custom Tooltip component, since react-charts didn't give me the
// tooltip title I wanted out of the box
const Tooltip = ({ getStyle, primaryAxis, datum }) => {
  const data = React.useMemo(
    () =>
      datum
        ? [
            {
              data: datum.group.map((d) => ({
                primary: d.series.label,
                secondary: d.secondary,
                color: getStyle(d).fill,
              })),
            },
          ]
        : [],
    [datum, getStyle],
  );

  return datum ? (
    <div
      style={{
        color: 'white',
        pointerEvents: 'none',
      }}
    >
      <h3
        style={{
          display: 'block',
          textAlign: 'center',
        }}
      >
        {/* Tooltip title in question */}
        {format(datum.primary, 'dd MMMM yyyy')}
      </h3>
      <div
        style={{
          display: 'flex',
          padding: '2em',
        }}
      >
        <ul>
          {/* On hover, simply show me the numbers for the day I'm hovering over */}
          {data[0].data.map((dat) => {
            return (
              <li>
                {dat.primary}: {dat.secondary}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  ) : null;
};

// The actual template:
export default ({ pageContext }) => {
  // pageContext gives us the data we sent from
  const { name, countryData } = pageContext;

  // we define the axes, according to how react-chart tells us to
  const axes = React.useMemo(
    () => [
      { primary: true, type: 'utc', position: 'bottom' },
      { type: 'linear', position: 'left' },
    ],
    [],
  );

  // we sort the data on date, because sometimes it isn't provided in that order
  const sorted = countryData
    .map((r) => {
      r.dateReported = set(parseISO(r.dateReported), { minutes: 0, seconds: 0, milliseconds: 0 });
      return r;
    })
    .sort((a, b) => a.dateReported.getTime() - b.dateReported.getTime());

  // we format the data according to how reac-chart wants it, with x being the report date and y being the cases and deaths for the day.
  const chartData = React.useMemo(
    () => [
      { label: 'Cases', data: sorted.map((r) => ({ x: r.dateReported, y: parseInt(r.cases, 10) })) },
      { label: 'Deaths', data: sorted.map((r) => ({ x: r.dateReported, y: parseInt(r.deaths, 10) })) },
    ],
    [],
  );

  // same goes for the total data (basically the full numbers summed up), with some additional operations (summing up to index).
  const totalChartData = React.useMemo(
    () => [
      {
        label: 'Cases',
        data: sorted.map((r, i) => {
          let total = parseInt(r.cases, 10);
          if (i > 0) {
            for (let j = 0; j < i; j++) {
              total += parseInt(sorted[j].cases, 10);
            }
          }

          return {
            x: r.dateReported,
            y: total,
          };
        }),
      },
      {
        label: 'Deaths',
        data: sorted.map((r, i) => {
          let total = parseInt(r.deaths, 10);
          if (i > 0) {
            for (let j = 0; j < i; j++) {
              total += parseInt(sorted[j].deaths, 10);
            }
          }

          return {
            x: r.dateReported,
            y: total,
          };
        }),
      },
    ],
    [],
  );

  // Memo the tooltip, because react-chart says so
  const tooltip = React.useMemo(
    () => ({
      render: ({ datum, primaryAxis, getStyle }) => {
        return <Tooltip {...{ getStyle, primaryAxis, datum }} />;
      },
    }),
    [],
  );

  // Finally, render the thing:
  return (
    <Layout>
      <SEO title={`Detailed report for ${name.split('_').join(' ')}`} />
      <Container>
        <Title>
          Per-day report for <b>{name.split('_').join(' ')}</b> <br />
          (as reported by ECDC)
        </Title>
        <div
          style={{
            maxWidth: '900px',
            width: '100%',
            height: '300px',
          }}
        >
          {/* per-day reporter cases chart */}
          <Chart data={chartData} axes={axes} tooltip={tooltip} />
        </div>
        <SubTitle>Case / death reports per day</SubTitle>

        <div
          style={{
            maxWidth: '900px',
            width: '100%',
            height: '300px',
          }}
        >
          {/* total cases in time chart */}
          <Chart data={totalChartData} axes={axes} tooltip={tooltip} />
        </div>
        {/* Total numbers in the last 24 hourse: */}
        <SubTitle>Total case / death reports per day</SubTitle>
        <Report>
          <h3>Last 24 hours</h3>
          <p>Cases: {sorted[sorted.length - 1].cases}</p>
          <p>Deaths: {sorted[sorted.length - 1].deaths}</p>
          <ReportItem></ReportItem>
          <ReportItem></ReportItem>
        </Report>
      </Container>
    </Layout>
  );
};
```

> In summary - we render a bunch of pages, some static, some markdown generated and a bunch of reports from JSON using
> at tsx template.

## But, what about updating?

I'm glad you ask, dear fictional reader! Since this is a static page, meaning unless something overwrites it, it stays
the same. There is no server or API to speak of. So, automation to the rescue!

1. You can trigger a rebuild using a webhook, which the good folk at Netlify provide. And by the magic of gatsby, the
   data will get refreshed to the latest available from the sources on rebuild.
2. We need something to trigger said webhook.

I happen to have an [n8n](https://n8n.io/) installation running for some of my home automation needs, so I simply added
an additional workflow that triggers every day at 16:00, sends a request to the webhook and the page gets refreshed.
It's not live, but it seems to be good enough - most sources update their numbers once a day, so it's never too late
with data.

## Summary

Thanks for joining me on this data-wrangling adventure! I hope you find something useful in these words and maybe find
some use for the data that this little project provides :)

Huge thanks to Gatsby, Netlify and the greater-gatsby starter.
