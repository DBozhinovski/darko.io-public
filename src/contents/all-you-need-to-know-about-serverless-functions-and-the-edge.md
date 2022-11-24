---
author: Darko Bozhinovski
title: All you need to know about serverless functions and the edge
datetime: '2022-11-25'
slug: 'all-you-need-to-know-about-serverless-functions-and-the-edge'
tags:
  - 'lambda'
  - 'edge computing'
  - 'serverless functions'
description:
  'As much of a misnomer `serverless` is, it is pretty useful. Especially when the actual computing happens close to you.'
ogImage: '/taylor-vick-M5tzZtFCOfs-unsplash.jpg'
draft: true
---

I'm old enough to remember that we used to use telephone landlines to connect to the internet. Hearing that modem connecting sound still brings a smile to my face and a semi-nostalgic feeling for the good ol' internet. Back then, it was a simple place. Having a geocities page was all the rage. Naturally, that was one of my first forays into trying to host something on the web. One of the cornerstones of that lovely old interenet however, was the fact that it was slow. Loading an image could take minutes. Gifs especially.

Funny enough, running your own server and hosting something backendy on it was a much simpler task back then. ISP's were smaller and more receptive to weirdos asking for static IP addresses. But, as the internet got progressively faster in my corner of the world, hosting something yourself became increasingly harder and static IPs were slowly becoming not a thing if you were on a "resident" connection.

## The commoditized internet

Realistically, it wasn't all bad. Hosting prices weren't too high. You could get a shared PHP server for pretty cheap, and run a CMS on it or something such. Things did get trickier when you were after doing something fancier (looking at you, Java), but for the most part it was fine. Things started to get significantly trickier when the internet started becoming more widely used. Geography started playing a role. Hosting something in e.g. Germany meant that you get reasonable speeds in Europe. However, when somebody would try accessing your site from let's say Australia, more lag was expected. Things certainly got better with better connections around the planet, but we can't win against physics. There is a cap to what we can do with better cables, and the hard truth is we just have to be smarter about how we distribute servers and resources. As developers, we should aim for providing a good experience to all application's users, regardless of geography.

### Intermission: internet speed

Problem is, not all of the planet progressed with the internet speed at the same pace. Some countries are stuck with 3G-like speeds to this day. Some have it even worse. Yet, I firmly believe that we should provide at least a decent basic experience to these users. We don't have to punish them with megabytes of JavaScript for submitting simple forms, but that's a rant for another day.

---

__Problem no. 1: geography and interenet speed and availability are a real problem. Not all of us live in the same spot and not all of use have the same access to the internet.__ 

---



_Note:_ This post was written as part of my [DX mentorship](https://www.dxmentorship.com).

