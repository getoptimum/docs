---
description: Get a quick primer on the constituent components of the Optimum protocol.
---

# Introduction to Optimum

**Optimum** is the world's first decentralized **shared-memory and network-communication** layer for blockchains. It accelerates **low-latency gossip** across geographically distributed nodes to scale data access and reduce network congestion for latency-sensitive dApps.

Powered by [Random Linear Network Coding (RLNC)](./p2p.md#random-linear-network-coding-rlnc-fundamentals) — a cutting-edge data encoding technique developed under the supervision of **Professor Muriel Medard, EECS, MIT**. By applying RLNC to gossip, Optimum reduces redundancy and improves loss tolerance; under standard RLNC models, the dissemination strategy is **provably optimal** for throughput/latency under loss and contention.

**Network & roles.** Optimum runs as a permissionless network of **[flexnodes](#flexnodes)** that anyone can operate alongside existing clients and P2P stacks.

## Products

Builders and operators can adopt **mumP2P** now for measurable latency gains. DeRAM and DeROM are next to unlock low-latency reads/writes.

### mumP2P

RLNC-accelerated, libp2p/gossipsub-compatible pub/sub for fast, resilient propagation of blocks, blobs, and transactions.  
**Get started:** [Overview](../../learn/overview/p2p.md) · [Quickstart](../../guides/01-getting-started-cli.md)

### Optimum DeRAM (Decentralized Random Access Memory)

Decentralized **read-write** memory exposing low-latency shared-state semantics across nodes.  
**Get started:** [Introduction](./deram.md)

### Optimum DeROM (Decentralized Read-Only Memory)

Decentralized **read-only/append-oriented** memory optimized for broadcast and caching.  
**Get started:** [Coming next]

## Flexnodes

A **flexnode** is an operator-run node that participates in Optimum's coded gossip and serves memory requests. Flexnodes:

* encode, decode, and forward RLNC-coded gossip frames;
* maintain bounded coded buffers to recover loss and smooth tail latency;
* serve **DeRAM/DeROM** reads/writes per policy and quotas via stable APIs;
* interoperate with existing clients and libp2p/gossipsub where applicable.

## Start here

* **Try mumP2P (≤5 min):** [Using mump2p-cli](../../guides/01-getting-started-cli.md)
* **Run locally:** [Local Setup with Docker](../../guides/02-getting-started-docker.md)
* **Integrate:** [Publish/Subscribe via Optimum Proxy endpoints](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md#proxy-api)

### Intended users

L1/L2 teams (faster block/blob propagation); validators (lower missed-slot risk → APY/MEV uplift); node operators & builders (lower tail latency); dApp developers (faster inclusion); end users (snappier UX).

