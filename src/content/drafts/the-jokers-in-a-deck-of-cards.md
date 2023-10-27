---
author: Darko Bozhinovski
title: "The jokers in a deck of cards - on the ever evolving generalist role"
pubDate: 2023-10-16
tags: ["development", "roles", "generalist", "specialist"]
description: "On the ever evolving generalist/full-stack role and to what extent does it make sense to broaden your skillset."
ogImage: "/nadejda-yanchuk-XlWLXlObh5I-unsplash.jpg"
---

In our industry, there are those that don't feel like we easily fit into a single box. Being one of those people, I've felt somewhat constrained when hired for a "front-end" or a "back-end" role. I've felt more at home at the very vaguely defined "full-stack" role, but those roles can sometimes get a bit overwhelming. While I do enjoy the challenge of learning new things, infra and cloud stuff makes me want to cry. It's me AWS, it's not you.

Now, the benefits of doing the cloudy stuff aren't lost on me - but I prefer setting my own application server, http servers etc. I don't dislike automation, but I like understanding what's going on "under the hood" without having to wade through pages of (usually not great) documentation or getting consultants that point me towards one of the thousand available methods to load balance something. Okay, rant over, back to the topic at hand.

## The conversation that sparked this post

What really inspired me to write this post is the following [LinkedIn exchange](https://www.linkedin.com/feed/update/urn:li:activity:7117142861547999232/):

![My Post](/li-post-darko.png)

and the comment that followed:

![Bojan's post](/li-post-bojan.png)

Bojan's analogy is good and spot on, for multiple reasons. Having a flexible skillset does make you more valuable in the sense that you can jump in at any end of the proverbial stack and fill a role. Does that come with monetary benefits? Debatable, but in my experience it doesn't make that much of a difference. Should it? I could argue that it should, but that's a topic for another post.

"Jokers" feel like a very accurate analogy to what the generalist role usually is - a placeholder card, maybe a trump card depending on the game. Which is exactly what a generalist does - fill in a need or provide insights/big picture ideas to a project.

Being in such a role comes with a set of tradeoffs - some great, some not so much. Let's dig deeper into those.

## The full-stack developer of yore

In the olden days, there was no such thing as stacks. I remember a time when front-end amounted to negotiating with the browser (I haven't forgiven you IE) not to screw up the HTML, CSS and maybe some JS that you neatly packaged into a page via a templating engine. People that called themselves front-end developers invoked a very different set of ideas about what they did than what we do today. More often than not, there were expectations that you'd be able to do some design work, often using Photoshop - we used to have people that did ["slicing"](<https://en.wikipedia.org/wiki/Slicing_(interface_design)>). It totally made sense though. The web was a very different place than what it is today, tech wise. So, if you were into web development, you were called a web developer. No front-end or back-end about it, let alone full-stack.

But a chain of events happened that caused two important things: JavaScript got better as a language and the Web Platform got decent to work with. Naturally, people started doing more and more stuff in the browser - there's no need to ignore the processing power of an entire machine just because you're used to sending stuff from the server. So the front-end started taking on a different meaning than what we previously thought. As a consequence, the role of a front-end developer started being a thing.

Naturally, those that were into web development but still disliked JavaScript (which frankly, was often the default) stuck to the back-end. In effect, the classical web developer turned into what we nowadays think of as a back-end developer. This is, of course, simplified, and probably biased, but to me it feels like a good approximation of the evolution of the web developer role.

That leaves us weirdos that liked both sides of the coin. I grew to love JavaScript and the Web Platform a lot, but I still liked doing back-end stuff. Those lucky few of us that loved going back and forth the stack, came to be know as "full-stack developers".

So naturally, when full-stack started being a role companies hired for, the job descriptions were far from standardized (in many ways, they still are). One company may have expected hard-core Ruby-on-Rails skills with a dash of front-end knowledge. Another would expect somebody that can write a Backbone.js application and a couple of REST routes in PHP. The job descriptions got broader with the advent of React and modern front-end frameworks in general. This was yet another evolution driven by the modernization of the Web Platform and the rise of JavaScript as a language. With more and more complexity thrown on top of an already complex system, naturally, web development got harder to get into and harder to master.

Being spread across the stack got even harder as a result. Considering the speed at which the front-end changes, plus having to stay on top of your back-end skills, it truly requires a lot of effort to stay sharp and employable.

As always, things got more complicated. Enter the cloud.

## And then, the "cloud" happened

Since everything has to be [wEb ScAle](https://www.reddit.com/r/ProgrammerHumor/comments/62rsd0/mongodb_is_web_scale/) these days, and herding servers isn't the most fun experience in the world, we invented this magical thing known as the [cloud](https://en.wikipedia.org/wiki/Cloud_computing). Now, I'm not a cloud skeptic. It has it's uses, but I don't feel like it's the silver bullet that it's often made out to be. It's a tool, and like any tool, it has it's upsides and it's drawbacks. But I digress.

On top of having to know your way across the front and back-end, often there started being expectations of full-stack devs that they knew their way around the cloud. As a sidebar, we also evolved sysadmins to devops, SREs, and infra people, due to the advent of the cloud. So we do have specialized or intersectional roles that deal with the cloud. Regardless, the expectation, explicit or otherwise is often there - a full-stack person should know cloud stuff on top of an already diverse skillset.

Personally, I never liked the idea of having to deal with the cloud. I can and like setting my apps and servers on bare-metal or on VPSs. Yes, it's not super-scalable, but the real question is: does it need to be cloud-scale? Quite often, investing in cloud stuff early in a product's lifecycle just adds complexity on top. But I digress again.

My point is - the full-stack role and the expectations around it got even more complicated.

## The generalist role today and tomorrow

So, what does that all mean for the generalist fulls-stacker today? Depends on the company, but I feel like the expectation are broader than ever. With no sign of slowing down. While I feel like we need to redefine what the full-stack means really, one key thing is that it's a role that's constantly evolving. That constant evolution means that we, as generalists, have to remain flexible and open to learning new things. Personally, I feel like that's a good thing - you never really run the risk of getting bored with your "toys". We all have our limits and ranges of interests (I'm looking at you, cloud), but the flexibility and the ability to jump up and down the stack is what I think will remain key for the generalist of today and tomorrow.

## The elephant in the room - time and focus shifts

My previous points may paint an interesting picture, but we all suffer from one key constraint - time, and more importantly the time we dedicate to being focused on one single task.
