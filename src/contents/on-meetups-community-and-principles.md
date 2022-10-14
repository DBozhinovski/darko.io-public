---
author: Darko Bozhinovski
title: On meetups, community and principles
datetime: '2022-06-23'
tags:
  - 'Community'
  - 'Meetups'
  - 'BeerJS'
description:
  'The one about how I got started with community stuff, meetups and conferences; On complaining vs. taking action.'
ogImage: '/meetups_post.jpg'
---

[Click here](#the-list-of-lessons-extracted) for the TL;DR; lessons learned 😁

> Sure sucks that we don't have more meetups around here...

... was a sentence that I found myself saying repeatedly - to friends, colleagues and pretty much anyone that had to do
with web development before 2017. I took every opportunity I could to travel abroad and go to meetups and conferences to
scratch that itch. The woes of living in a small country and all that. Even though my country's IT industry was getting
bigger by the day, there weren't many community events, conferences etc. I'm not counting the thinly-veiled PR events
here at all - we've had and have plenty of those. Nothing wrong with them, but it feels dishonest to consider those
"community" in any sense of the word.

I'm not somebody that likes to complain, especially if I can do something about what I'm complaining about. Catching
myself being grumpy about not having more meetups and an actual community, I realized that there are three possible
outcomes of said frustration:

1. Continue complaining - nothing changes.
2. Wait for someone else to do something about it - something maybe changes.
3. Start a meetup myself - preposterous, considering I was thinking of myself as this benchmark introverted nerd. But it
   was the only option that deterministically did away with me being grumpy, so...

Around March 2017, I stumbled upon [BeerJS](https://github.com/beerjs/meta). Being already half-determined to start
something myself, I chose to interpret that as a sign to Just Do It™. I opened an issue and got access to the new repo
for [Skopje](https://github.com/beerjs/skopje) under the BeerJS org. Then it hit me - I have no f\*\*king idea how to
organize a meetup! Where do I start? How do I get people to come? How do I find speakers? 😬

## BeerJS Skopje, Vol. 1

> ... with a little help from my friend(s) ...

For better or worse, most of the people that I consider close, are in the industry. That certainly made things easier -
at least, I'd get somebody to attend. Plus, free beer sure helps, and one of the companies I collaborated with at the
time was more than happy to donate the beer. Which leaves speakers - it wouldn't make much sense to have an event
without someone that does the speaking part, no?

Luckily, I was already working with someone that gave a React talk a while back. So, he agreed to be one of the
speakers, but I was stuck with the idea that one presentation wouldn't be enough. Happily enough, a friend asked one of
their friends who also happens to be a developer to prepare something for the first ever BeerJS in Skopje. He also said
yes! So - beer/sponsorship done, audience sort-of done, speakers done... ah f\*\*k, I need a _venue_ to have this thing
in. At that time, I spent my working days in a co-working space. I casually mentioned that we were trying to find a
place for the event to the owner of the co-working space (shout-out to Daniela and [Coffice](http://coffice.com.mk)),
and she said she'd be happy to host it. On a whim, I picked the 17th of May (2017) as the date to have the event and we
were off to the races.

Meanwhile, I bought a domain and made a website for the event - https://beerjs.mk. Since I'm not big on social media,
again I asked a couple of friends to make some profiles for me. With that, the group behind BeerJS Skopje informally
started taking shape.

**Lesson 1:** Ask for help when it feels like it's overwhelming. Events and meetups are a team sport.

---

The event went pretty well, for a first try. We even recorded the presentations and published them on our
[YouTube](https://www.youtube.com/channel/UCScyJr3W0-BFCrPW1kLcGmQ) channel - even though we had a bunch of technical
issues with sound, choppy video etc. Before the event started, however, I realized that it would be a good idea for the
event to have an "opening" speech of sorts. Plus, somebody had to announce the speakers. I didn't particularly enjoy the
idea of taking the spotlight myself, but nobody else wanted to do it and the idea to have this meetup was ultimately
mine. So, the responsibility was mine and I did all of that quite clumsily (beer helped though 😅).

<figure>
  <img src="/beerjs-vol1-collage.jpg" />
  <figcaption>BeerJS vol. 1</figcaption>
</figure>

**Lesson 2:** Things will go wrong. No amount of planning will guarantee that everything works as planned. Learn and
move along. Embrace the chaos, because it will get chaotic.

## Vol. 2 - Vol. 5

Initially, we had the grand (and very misguided) ambition of having one meetup a month. Realizing that finding speakers
wasn't an easy task, we've got to the conclusion that two a year is probably more realistic. I imagine this doesn't
apply exactly to larger countries, but in our corner of the planet, we're running the risk of having the same 5-6 people
in rotation which could get pretty boring pretty fast. The situation has improved somewhat since, but our speaker pool
is still pretty small.

Luckily, we got a bit of a reputation for being "independent" and "kinda punk". That seems to have helped attract the
kind of people I was hoping to: developers that like to experiment, open-source contributors and developers with
interesting stuff to say. Up until our 4th meetup, I bothered pretty much everybody I know and meet that's in the
industry to either give a speech or point me to somebody that would be into giving speeches about anything tangentially
related to JS. It was at BeerJS Vol. 5 that people started approaching themselves to give speeches; It was via a
company, but I made sure to make it clear that speaking slots weren't for sale (more on that a bit later).

Reputation is one thing but, to give things a more practical tone; On the other side of event planning, we have a bunch
of not-so-fun things that someone has to take care of, for each event (and incidentally, also **Lesson 3**, in the form
of a checklist):

- Speakers - we have two per event on our BeerJS (we'll probably do three shorter ones next time though)
- Venue
- Sponsorships (if any, but someone has to pay for the beer)
- Equipment - projectors, microphones (if needed), etc.
- Welcoming, moderation, opening, closing, speaker announcements... Now, these are optional, but I've found that they
  make for a more natural flow of the whole event. Learn from my mistakes 😉

### On sponsorship and sticking to the spirit of the event

The meta repo for BeerJS clearly states the following, under the
[Rules on Donations](https://github.com/beerjs/meta#rules-on-donations-gentle-suggestions=) examples:

**Do this**

> The Tahoe branch met at a cowork location for free and a local micro brewery would donate beer every month to support
> our efforts. None of those groups ever asked for something in return. They were > supporters of building commmunity.

**Not this**

> A company has agreed to provide beer if it has access to the email addresses for the members of your community. A
> recruiter has offered to buy pizza if you let them use a meetup as a recruitment platform.

I consider myself a very principled person (bordering on stubborn, most would say) and I believe that quality has helped
me keep the event in the "community" spirit and avoid commercializing it. Once people saw we could get a fair amount of
people to an event (current record at 140+), we began getting some fairly unsavory offers ranging from product
placements, to a certain amount of banners visible, being mentioned an X amount of times on stage and so on. Those
things could be easily categorized as commercial and none of us in the Skopje branch are looking to get paid from this.
We think of it as a "by-the-community, for-the-community" event, and we plan on keeping it that way.

Now, there are certainly gray areas with which I've had some trouble personally, but I've grown to accept them as a
necessity. A good example would be the fact that often, companies approach our event with a sponsorship + speaker deal.
In principle, I'm opposed to that. But, speakers aren't easy to find. I compromise by going out of my way to explain
that being a sponsor and providing a speaker are two distinct things, and speaking slots are not for sale. The
presentations still have to be non-commercial, however. We don't allow anyone on stage to give a product promo,
sponsorship or not.

**Lesson 4:** Being principled about the spirit of the event is great and all, but some things aren't as black and white
as some of us would like. Compromise, but not on what the event is.

### On giving a speech at your event

I did a few internal (company) presentations during my career and I realized I don't hate doing presentations 😅. But
for me, giving a presentation at an event that I am involved with organizing feels a bit... dirty.

Still, at BeerJS Vol. 3, I pretty much had my hand twisted into giving one. We had a really hard time finding anyone
willing to give a speech and I was already in the process of preparing one for a project I was working on. As the event
date got closer and closer, we realized we didn't have much choice. To this day, I don't feel too comfortable doing
that, but it had to be done. At least I had someone else from our branch to the opening, closing and speaker
announcements. Plus, I gave a full disclosure at the start of the presentation, for the benefit of having a clear
conscience, if nothing else. In a nutshell, **Lesson 2**.

## Vol. 6

<figure>
  <img src="/beerjs-vol6-collage.jpg" />
  <figcaption>BeerJS vol. 6</figcaption>
</figure>

This brings me to our last, post-pandemic edition of the event. We took some time off from having the event, obviously
not by choice. To me, our BeerJS wouldn't be a good fit for making it an online event. It feels like making it online
isn't in the spirit of what the event should be about, so we chose to take a break instead.

Much like with Vol. 5, a company approached us with the speaker + sponsorship deal, in early 2022, when things seemed
like they would settle down and the restrictions about having events would lighten up. I invited the other speaker
myself, we booked the event and the rest was "business as usual". We were used to it by now, it feels like. Thankfully,
we got a bit more support for social media promo from a bunch of other organizations and companies, and it seemed like
we would at least have a decent turn-out. What we didn't expect was filling the entire venue to the point of it not
being comfortable to have more people in there. I stopped counting at 140 😅. We tried to be as careful as possible,
having a pandemic and all, but people will be people and you can only do so much. Still, in my opinion, we had the best
meetup so far and it seems like interest in the event keeps on growing. We're probably doing something right 😁.

## Closing words

Fact is, we're probably still around because we like doing this. You'll have to find your own motivator, but being
persistent no matter how frustrating it gets (and frustrating it does get), to me, is key to having a meetup that is
considered to be successful. So, just try having fun and if you need any kind of motivation to start your own meetup
(BeerJS or otherwise), consider this post a sign to Just Do It™. If you need any sort of advice or support we can
provide, feel free to contact me at [hello@darko.io](mailto:hello@darko.io) or our BeerJS branch at
[hello@beerjs.mk](mailto:hello@beerjs.mk).

### PS. On social media

I'm probably the worst person to advise on how to promote anything on social media, but I can list the things that we're
doing and seem to be working:

1. Create a page/profile for your event on your social media of choice. We're currently doing Facebook, Twitter,
   Instagram and LinkedIn. We started with just Facebook and Twitter, but we got some feedback that people wanted to see
   us on Instagram and LinkedIn, so we did that too. YMMV.
2. Make sure to create events for each of your meetups, to at least get an idea of how many people would attend. From
   our experience so far, attendance is about 40-50% of the number of people that press "going". But that's just from
   social media.
3. Building some hype helps (so I've learned from people wiser about social media than myself). Make sure to schedule at
   least a few posts per week before the event. Of course, with info and contents relevant to the context of the event
   and the presentations.

---

## The list of lessons, extracted:

**Lesson 1:** Ask for help when it feels like it's overwhelming. Events and meetups are a team sport.

**Lesson 2:** Things will go wrong. No amount of planning will guarantee that everything works as planned. Learn and
move along. Embrace the chaos, because it will get chaotic.

**Lesson 3:** Have a checklist:

- Speakers - we have two per event on our BeerJS (we'll probably do three shorter ones next time though)
- Venue
- Sponsorships (if any, but someone has to pay for the beer)
- Equipment - projectors, microphones (if needed), etc.
- Welcoming, moderation, opening, closing, speaker announcements... Now, these are optional, but I've found that they
  make for a more natural flow of the whole event. Learn from my mistakes 😉

**Lesson 4:** Being principled about the spirit of the event is great and all, but some things aren't as black and white
as some of us would like. Compromise, but not on what the event is.
