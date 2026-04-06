---
title: "The Idiot sets up a local AI"
description: "Why I stopped outsourcing all my inference to the cloud, what I'm running instead, and why having a local model changes how you think about your homelab."
pubDate: 2026-04-06
tags: ["homelab", "ai", "proxmox", "ollama"]
---

There's a version of this post where I tell you that I set up a local AI model for privacy reasons, or because I'm deeply principled about data sovereignty, or because I read a manifesto somewhere. That's not what happened. What happened is I had a spare AMD Ryzen 7 box with 62GB of RAM sitting in my workshop doing not enough, and I thought: *that seems wasteful.*

That's usually how it starts.

---

## What We're Actually Talking About

When most people say "AI" right now, they mean a chat interface backed by a model running on someone else's hardware, in someone else's data center, billed to your credit card. It works fine. It's also a subscription, a dependency, and a black box.

A local inference box is different. It's a machine on your network running an open-weight model — the kind researchers publish and anyone can download — using a tool like [Ollama](https://ollama.com). You send it a prompt, it sends you back a response, and none of that ever leaves your house.

That's it. That's the pitch.

---

## The Hardware

My inference box — I call it CLU2, because I name things — is not exotic:

- **CPU:** AMD Ryzen 7 3700X (8 cores, 16 threads)
- **RAM:** 62GB
- **GPU:** AMD Radeon RX 6700 XT (12GB VRAM)
- **Disk:** ~900GB NVMe

No A100. No H100. Nothing you'd see in a data center. This is workstation-class hardware from a couple of years ago, running Ubuntu 24.04, with Ollama installed in about ten minutes.

The GPU isn't even doing the heavy lifting for most of what I run — the models I use day-to-day fit comfortably in RAM and run on CPU. That's not a flex. It's actually the point: you don't need a $3,000 GPU to get real utility out of a local model.

---

## What Runs on It

Right now CLU2 serves three models:

| Model | Size | What I use it for |
|---|---|---|
| `qwen3:14b` | 9.3GB | General reasoning, code, homelab tasks |
| `qwen2.5:14b` | 9.0GB | Home Assistant conversation agent |
| `qwen2.5:7b` | 4.7GB | Fast, lightweight queries |

Ollama exposes a simple REST API on port 11434. Point anything that speaks OpenAI-compatible endpoints at it and it just works — Open WebUI, Home Assistant, your own scripts, whatever.

---

## Why Bother, If the Cloud Works Fine

Fair question. Here's the honest answer: for a lot of tasks, the cloud *does* work fine. But there are specific places where local changes the equation entirely.

**It's always on, and it's fast on your network.** No rate limits, no API quotas, no latency to a remote endpoint. A request from inside my network hits CLU2 and comes back in seconds. When I'm running automations that fire dozens of times a day, that matters.

**It integrates with everything.** My Home Assistant setup uses CLU2 as its conversation agent — when I ask it to turn off the lights or check the thermostat, that request goes to a model running twenty feet away from me. It understands my house because I've given it context about my house, and that context never leaves my network.

**It handles sensitive context without hesitation.** Infrastructure notes, homelab configs, internal hostnames, personal projects — I can feed a local model full context without thinking twice about what I'm handing to a third party. That's not paranoia. That's just good practice.

**It makes your homelab smarter.** This is the one that surprised me most. Once you have a local model on the network, you start plumbing it into things: automated log analysis, cron jobs that summarize overnight errors and alert you only if something needs attention, dashboards that generate status summaries in plain English. Tasks that used to require either manual review or a fragile regex suddenly have a much better option.

**Cost at scale.** If you're running a lot of inference — automations, agents, integrations — cloud costs add up. CLU2 runs on a machine I already own, on power I'm already paying for. The marginal cost of an additional query is effectively zero.

---

## What It Doesn't Replace

Local models are behind the frontier. `qwen3:14b` is genuinely impressive for its size, but it's not GPT-4o or Claude Sonnet. For tasks that demand the best available reasoning — complex code generation, nuanced writing, hard research problems — I still reach for the cloud.

The mental model I've landed on: local handles the **high-frequency, high-context, low-stakes** work. Cloud handles the **low-frequency, high-stakes** work where you want the best answer you can get.

Both lanes exist. You don't have to pick one.

---

## Getting Started

If you want to replicate this, the minimum viable setup is simpler than you'd expect:

1. Find a machine with at least 16GB RAM (32GB+ preferred). Doesn't have to be dedicated — a NUC, an old workstation, a spare mini PC all work.
2. Install [Ollama](https://ollama.com/download).
3. Run `ollama pull qwen2.5:7b` (or whatever model interests you — the [library](https://ollama.com/library) has options for every hardware tier).
4. Hit `http://localhost:11434` and start sending requests.

If you want a UI, [Open WebUI](https://github.com/open-webui/open-webui) runs in Docker and gives you a ChatGPT-style interface in about five minutes.

That's the floor. Everything else — integrations, automations, agents — is just building on top of it.

---

## The Part Where I Admit the Real Reason

Okay. Fine.

There's something deeply satisfying about having a capable AI model running in a box in your workshop that you built, own, and control. Something that answers to your network and nobody else's terms of service. Something you can inspect, modify, point at your own data, and run at 3 AM during a homelab incident without worrying about hitting a rate limit.

It's the same reason we run our own Plex servers instead of subscribing to streaming services, our own DNS instead of using 8.8.8.8, our own NAS instead of paying for cloud storage. Because we *can*. Because ownership still means something. Because the homelab isn't just about saving money — it's about understanding what you're running and running it yourself.

The local AI is just the next thing in that lineage.

---

*CLU2 has been running continuously since April 2026. It has not once asked me to upgrade to a premium tier.*
