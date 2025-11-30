---
title: "PatriotCTF 2025 - Where's Legally Distinct Waldo Four (OSINT)"
date: 2025-11-27
slug: /writeups/patriotctf-2025-waldo-four/
excerpt: OSINT walkthrough for the fourth Waldo challenge
author: Andrew Liu
---

**PatriotCTF 2025**

I participated with my club team tjcsc in PatriotCTF 2025, and we got 54th overall!

**Challenge:** Where’s Legally Distinct Waldo Four

**Category:** OSINT

**Flag:** ``pctf{krug_hall}``

**Note:** I got first blood on the challenge 5 minutes into the CTF! Cool stuff.

![Provided challenge image](./waldo4-000.png)

So, here is the provided image:

![Initial search result](./waldo4-001.png)

Looks hard, but not really. There are still some things we can use to help us find where this was taken from. Since the past three challenges have all been places in the university campus, I assumed this one was as well. Let’s look around in Google Maps and see what we can find.

![Matching the angle 1](./waldo4-002.png)

This building looks similar. Let’s try and match the angle:

![Matching the angle 2](./waldo4-003.png)

![Determining capture building](./waldo4-004.png)

The features match pretty well. So, let’s go back and see what building this image could have been taken from.

![Success confirmation](./waldo4-005.png)

Krug Hall? Let’s try that… Done! ``pctf{krug_hall}``. First wave OSINT full cleared. That was pretty easy!

I full cleared the first wave OSINT in about 51 minutes after the competition started. They were very light and fun challenges.
