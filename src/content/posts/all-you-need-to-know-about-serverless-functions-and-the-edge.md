---
author: Darko Bozhinovski
title: 'All you need to know about serverless functions and the edge'
pubDate: 2022-11-25
tags: ['serverless', 'lambda', 'edge computing', 'serverless functions']
description:
  'As much of a misnomer `serverless` is, it is pretty useful, especially when the actual computing happens close to you.'
ogImage: '/taylor-vick-M5tzZtFCOfs-unsplash.jpg'
---

I'm old enough to remember that we used to use telephone landlines to connect to the Internet. Hearing that modem connecting sound still brings a smile and a semi-nostalgic feeling for the good ol' Internet. Back then, it was a simple place. Having a Geocities page was all the rage. So naturally, that was one of my first forays into trying to host something on the web. One of the cornerstones of that lovely old Internet, however, was the fact that it was slow. Loading an image could take minutes. Gifs especially.

Funny enough, running your server and hosting something backendy on it was a much simpler task back then. ISPs were smaller and more receptive to... _eccentrics_ asking for static IP addresses. But, as the Internet got progressively faster in my corner of the world, hosting something yourself became increasingly harder, and static IPs were slowly becoming not a thing if you were on a "resident" connection.

## The commoditized Internet and executing closer to the users

Realistically, it wasn't all bad. Hosting prices were reasonable. You could get a shared PHP server for cheap and run a CMS on it. Things did get trickier when you were after doing something fancier (looking at you, Java), but for the most part, it was fine. Things started getting significantly trickier when the Internet became more widely used. Geography started playing a role. Hosting something in, e.g., Germany meant that you get reasonable speeds in Europe. However, more lag was expected when somebody tried accessing your site from Australia. Things certainly improved with better connections around the planet, but we can't win against physics. There is a cap to what we can do with better cables, and the hard truth is we have to be more thoughtful about how we distribute servers and resources. As developers, we should aim to provide an excellent experience to all application users, regardless of geography. This is where the model known as edge computing comes in. In this context, edge refers to geographical closeness to the user requesting the computation. Naturally, closer exectuion points means faster response times. Faster response times make for a better overall UX.

### Intermission: internet speed

The problem is not all of the planet has progressed with the internet speed at the same pace. Some countries are stuck with 3G-like speeds to this day. Some have it even worse. Yet, I firmly believe we should provide at least a decent basic experience to these users. We don't have to punish them with megabytes of JavaScript for submitting simple forms, but that's a rant for another day.

---

__Concept no. 1: Geography, internet speed, and availability are real problems. Not all of us live in the same spot, and not all have the same Internet access. Executing geographically closer to the user is a good solution to the problem. This approach is also known as "edge computing".__ 

---

## The cloud and SeRVerLeSs computing

![no-cloud](/no-cloud.jpg)

Just to get it out of my system - if we ever named something wrong, that would be "serverless computing". Just as (pictured above) we did 
a horrible job as an industry naming and explaining the cloud, somehow we did a measurably worse job with serverless. Yes, there are servers involved. Perhaps not in the classical sense, as your run-of-the-mill API or CMS. But, servers are still very much in the picture. With that out of my system, why do we even want serverless computing? For one, compared to a classical API (let's take REST as an example), we'd have a server that runs at all times, expecting connections. Real world applications rarely have an equal load / demand throughout the day, so it certainly makes sense to "spin down" our resources to cut costs and be more environmentally aware. I'll defer to [wikipedia's wisdom](https://en.wikipedia.org/wiki/Serverless_computing) here, and quote their definiton:

> Serverless computing is a cloud computing execution model in which the cloud provider allocates machine resources on demand, taking care of the servers on behalf of their customers. "Serverless" is a misnomer in the sense that servers are still used by cloud service providers to execute code for developers. However, developers of serverless applications are not concerned with capacity planning, configuration, management, maintenance, fault tolerance, or scaling of containers, VMs, or physical servers. Serverless computing does not hold resources in volatile memory; computing is rather done in short bursts with the results persisted to storage. When an app is not in use, there are no computing resources allocated to the app. Pricing is based on the actual amount of resources consumed by an application.[1] It can be a form of utility computing.

By this definition, the benefits of running serverless functions opposed to more classical approaches are obvious. In theory, it is a cheaper and more efficient way of using resources. The basic building block (a function) is a simple execution unit that runs when a request reaches the "serverless" provider. Simple is easier to build. Not easier to debug in every case, since most cloud providers give you very specific tools for logging and taking a peek at what's going on inside the serverless thing (container hosted or VM hosted etc.). Those tools aren't always (in my experience at least), but the model is pretty new, so the DX will likely improve over time. 

---

__Concept no. 2: Classical, always up-and-running APIs don't make sense in every case. It's cheaper and more resource-efficient to run code on demand. It also makes senses from an environmental perspective, as less power used often equals less polution. This computing model, when we're running a function on demand is also known as serverless computing.__ 

---

## Serverless computing on the edge

In many ways, these two concepts are a natural fit. Running resource-aware functions geographically closer to the users combines the benefits of both definitions above. It's cheaper, more environmentally friendly while the users get the benefit of fast responses, since the execution happens in the geographically closest place of execution. 

I'll take a real-world scenario I recently had to work on as an example:

Users uploaded pictures that had to be resized, then sent to object storage and shown back to them. The demand for the service was expected to vary wildly throughout the day. The functionality was also reasonably distinct from what the main API of the application did. Going serverless was an obvious choice here since we have a specific, on-demand service that varying amounts of traffic would hit at different times. On top of that, executing the functions near the users would make for fast response times. So it made sense to also distribute these on the edge. The object storage mentioned above was also behind a CDN, meaning that it already benefited from being an edge-optimized solution, so both the upload and download experience were optimized for the minimum amount of request-response cycle times.

I still would recommend going fully serverless for only some scenarios out there. Your humble classical API (regardless of protocol) is still an excellent solution for most problems, and monoliths are significantly easier to reason about. At least when compared to running an application via a "fleet" of serverless functions. This problem is an infrastructure and tooling problem since, in an ideal world, we would be able to get the benefit of developing with the DX of a monolith while being able to deploy in a distributed fashion. As I mentioned above, the domain is still pretty new, and there's a lot of room for improvement. I expect the DX to improve significantly over time.

## Takeaway

Combining edge computing with serverless computation is a natural fit for many scenarios. However, classical APIs and monolithic solutions are still my go-to for the most part. Still, some problems benefit heavily from being solved in a distributed fashion - resource-aware and closer to the users.


_Note:_ This post was written as part of my [DX mentorship](https://www.dxmentorship.com).

