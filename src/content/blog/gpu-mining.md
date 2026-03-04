---
title: "The Idiot tries GPU Mining"
description: "What started as a mild curiosity with spare hardware turned into a deeper look at Ethereum mining."
pubDate: 2019-06-01
tags: ["hardware", "crypto"]
---

What started as a mild curiosity with spare hardware turned into a deeper look at the world of mining Ethereum.

In early 2018, work and school had pulled me away from PC gaming. Rather than let the hardware sit idle, I decided to put it to work.

> *Note: This is a quick-and-dirty account of my experience. No sponsored links.*

## Why Ethereum?

At the time, the [r/ethermining](https://www.reddit.com/r/ethermining) community was active and helpful — exactly what you want when you're troubleshooting at 2am. Ethereum was also considered the second most valuable coin after Bitcoin, and I figured it had legs.

## What You Need

1. **A capable GPU** — Nvidia GTX 1070/1080 or AMD Radeon RX 480 or better
2. **A cryptocurrency wallet** — a [hardware wallet](https://shop.ledger.com/products/ledger-nano-s) is recommended (buy direct from the vendor). [Coinbase](https://www.coinbase.com/) works for a software wallet.
3. **A mining pool** — solo mining isn't profitable at hobby scale. [Ethermine](https://www.ethermine.org/) was the most profitable pool at the time according to [Poolwatch.io](https://www.poolwatch.io).

## Building the Rig

I started with a single GTX 1080. Over the course of a year, I picked up 5 additional GTX 1070s by watching Craigslist, Letgo, and [r/minerswap](https://www.reddit.com/r/minerswap) — never paid more than $280 per card. Buying new cards kills your ROI timeline. Be patient.

More cards meant more supporting hardware. In addition to my existing CPU, memory, and 750W PSU, I added:

- [6 GPU Open Air Mining Frame](https://www.amazon.com/gp/product/B079MBYRK2)
- [ASUS B250 Mining Expert Motherboard](https://www.amazon.com/B250-MINING-EXPERT-Motherboard-Cryptocurrency)
- [5× 120mm Case Fans](https://www.amazon.com/ARCTIC-F12-PWM-PST-Technology/dp/B00NTUJTAK)
- [Additional 750W PSU](https://www.amazon.com/Corsair-Bronze-Certified-Modular-CP-9020102-NA/dp/B01B72W0A2/)
- [6-Pack PCIe Risers](https://www.amazon.com/gp/product/B06Y239M26)

## The OS

I started on Windows with [Ethminer](https://github.com/ethereum-mining/ethminer/releases), but Windows loves to interrupt with updates at the worst possible times. I switched to [HiveOS](https://hiveos.farm/) and never looked back. It's a mining-focused Linux distro with a clean web dashboard showing all hardware stats at a glance.

For getting HiveOS set up properly, I recommend [Seth's HiveOS Tutorial](https://www.youtube.com/playlist?list=PLoGp16oCL0A-dP3-A31koTCWxK_iOH9Qa).

## Heat & Placement

Properly tuned GPUs still run hot. Put the rig somewhere well-ventilated and away from living spaces. On the upside: during winter, it makes a surprisingly effective space heater.

## On Profitability

Two schools of thought:

- **Sell as you go** — liquidate a portion of earnings to offset hardware and electricity costs
- **HODL** — eat the costs upfront and bet on appreciation

I HODL, but keep an eye on the ETH/USD rate. Your call.
