---
title: "An Idiot's AI Fixed My Homelab at 3 AM (While I Was Asleep)"
description: "My Proxmox HA cluster went haywire at 3 AM. I sent one Telegram message. My AI assistant figured out the root cause, untangled the HA state machine, and had everything running again before I finished my coffee."
pubDate: 2026-04-08
tags: ["homelab", "proxmox", "ai", "automation"]
---

At 3:04 AM on a Wednesday, my Proxmox HA cluster watchdog rebooted my primary node, fenced six containers, and then spent four hours trying — and failing — to migrate them to nodes that couldn't host them.

I didn't know any of this was happening. I was asleep.

By 8:15 AM, I had one Telegram message from my AI assistant and Plex was back up.

Here's what actually went down.

---

## The Setup

I run a three-node Proxmox cluster in my workshop. One node is the workhorse: Plex, Sonarr, Radarr, SABnzbd, Lidarr, and a Pi-hole replica all live there on local NVMe storage.

I also run RAM, an OpenClaw-based AI assistant that monitors the cluster with a watchdog script every 45 minutes, sends Telegram alerts, and handles recovery tasks when I ask it to. RAM runs on a separate node — which matters, because when the primary went down, I still had a brain online.

---

## What Triggered It

At **02:59:53 UTC**, my UniFi Cloud Gateway Fiber auto-updated its controller firmware from 10.1.89 to 10.2.105. I didn't schedule this. UniFi just decided to do it.

The post-upgrade config reprovision cycle briefly disrupted L2 on the managed switch fabric — just long enough to drop Corosync heartbeats between the primary node and the rest of the cluster.

Corosync's default token timeout is 5 seconds. That's designed for enterprise networks that don't randomly bounce their switch stack. My homelab is not that.

At **03:04:12 UTC**, the primary node lost quorum.  
At **03:04:54 UTC**, the Proxmox HA watchdog fired and rebooted it — which is exactly the right thing to do when a node loses quorum. Fencing prevents split-brain.  
At **03:05:37 UTC**, it came back up completely clean.

That should have been the end of it.

---

## The Part Where HA Made It Worse

Proxmox HA saw the primary node's CTs go down and did what it's configured to do: try to relocate them to healthy nodes. The problem is that the primary node's containers run on `nvme-lvm` and `local-lvm` — node-local storage that physically cannot be migrated to the other nodes. The HA manager doesn't know this until it tries.

So it tried. Every 10 seconds. For four hours.

```
TASK ERROR: storage 'nvme-lvm' is not available on node 'node2'
TASK ERROR: storage 'nvme-lvm' is not available on node 'node2'
TASK ERROR: storage 'nvme-lvm' is not available on node 'node2'
```

The primary was up. The containers could have started. But HA had fenced them and owned their configs, and it was going to keep trying until something changed or someone intervened.

That someone was me — eventually. At **8:15 AM**, I picked up my phone and sent one message to RAM on Telegram:

> *"Can you determine why Plex is down?"*

No context. No error logs. No hint that the cluster had been on fire for five hours.

---

## "Can you determine why Plex is down?"

RAM had the nightly Proxmox log drain from 3 AM — which had run right as the chaos was starting — and full knowledge of the cluster inventory. That one question was enough. It went to work.

**Step 1: Diagnosis**

RAM pulled the cluster resource state and identified the problem immediately — six CTs in `error` state on the wrong nodes, stuck in relocation loops, storage not available. It confirmed the primary node itself was healthy.

```
CT (plex): status=error, node=node2, storage nvme-lvm unavailable
CT (sonarr): status=error, node=node2, storage nvme-lvm unavailable
[...]
```

**Step 2: Break the Loop**

To get CTs out of HA's relocation loop, you have to disable HA on them, then remove them entirely from HA management. RAM did this via the Proxmox API for all six containers.

**Step 3: Clean Up the Mess**

HA had written CT configs to the other nodes during its failed migration attempts. Proxmox's cluster filesystem (pmxcfs) has a constraint: you can't create a CT config for a VMID if one already exists anywhere in the cluster. RAM had to delete the orphaned configs from the wrong nodes before re-writing them back to the primary.

This is the kind of thing that's easy to get wrong if you don't know about the pmxcfs constraint. Deleting a CT config from the wrong node first would have made things worse.

**Step 4: Restore and Harden**

With clean configs back on the primary, RAM started all six containers directly. Everything came up. Plex served video. Then it made two hardening changes:

1. **`max_relocate=0`** on all primary node CTs — HA will now *stop* containers on failover instead of attempting doomed migrations. This is the correct behavior when your storage is node-local.

2. **Corosync token timeout: 5000ms → 20000ms** — Doubled the heartbeat window, giving the cluster ~200 seconds of tolerance before declaring a node dead. Reloaded live across all three nodes without a restart.

Both changes were applied, documented, and logged before I'd finished my first cup of coffee.

---

## What I Actually Had to Do

Send a message. That's it.

RAM handled the diagnosis, the HA state machine untangling, the config file surgery, the restores, and the hardening. It also figured out why it happened (UCG Fiber auto-update), documented the root cause chain with timestamps, and flagged it in my memory files for future reference.

The whole recovery took about 20 minutes from first message to Plex streaming.

---

## Takeaways

**For Proxmox users:**
- Set `max_relocate=0` on any CT backed by node-local storage. There is no point in HA trying to migrate something that can't be migrated.
- Tune your Corosync token timeout if you're on a homelab network with managed switches. 5 seconds is too tight. 20 seconds gives you real tolerance.
- UniFi auto-updates are dangerous for cluster stability. Disable them or schedule them in a maintenance window.

**For homelab AI assistant skeptics:**
- The value isn't that AI does things you couldn't do. It's that it does them at 3 AM, without sleep deprivation errors, in 20 minutes instead of an hour.
- Context matters enormously. RAM had cluster inventory, watchdog history, and infrastructure knowledge baked in. A generic ChatGPT prompt would not have gotten there as fast.

**For me:**
- My previous RAM instance died because of LVM thin pool instability. The one before that died from inode corruption. This one fixed a major outage while I slept and then hardened the cluster against the next one.

The disc holds everything it is. It does not lie.

---

*RAM is an AI assistant running on OpenClaw inside my Proxmox cluster. This blog covers the homelab builds, failures, and occasionally-cursed infrastructure that lives in my workshop.*
