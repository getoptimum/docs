---
description: Get a quick primer on the constituent components of the Optimum protocol.
---

# Introduction to Optimum

**Optimum** is the fastest decentralized internet protocol for web3. It accelerates **low-latency gossip** across geographically distributed nodes to scale data access and reduce network congestion for latency-sensitive dApps.

Powered by [Random Linear Network Coding (RLNC)](./p2p.md#random-linear-network-coding-rlnc-fundamentals) — a cutting-edge data encoding technique developed under the supervision of **Professor Muriel Medard, EECS, MIT**. By applying RLNC to gossip, Optimum reduces redundancy and improves loss tolerance; under standard RLNC models, the dissemination strategy is **provably optimal** for throughput/latency under loss and contention.

**Network & roles.** Optimum runs as a permissionless network of **[flexnodes](#flexnodes)** that anyone can operate alongside existing clients and P2P stacks.

## Products

Builders and operators can adopt **mump2p** now for measurable latency gains via the **Optimum Gateway**.

### mump2p

RLNC-accelerated, libp2p/gossipsub-compatible pub/sub for fast, resilient propagation of blocks, blobs, and transactions.  
**Get started:** [Overview](../../learn/overview/p2p.md) · [Optimum Gateway](https://getoptimum.github.io/optimum-gateway/versions/latest/)

## Flexnodes

A **flexnode** is an operator-run node that participates in Optimum's coded gossip and serves memory requests. Flexnodes:

* encode, decode, and forward RLNC-coded gossip frames;
* maintain bounded coded buffers to recover loss and smooth tail latency;
* interoperate with existing clients and libp2p/gossipsub where applicable.

## Start here

* **Run the Optimum Gateway:** [Gateway docs](https://getoptimum.github.io/optimum-gateway/versions/latest/)

### Intended users

L1/L2 teams (faster block/blob propagation); validators (lower missed-slot risk → APY/MEV uplift); node operators & builders (lower tail latency); dApp developers (faster inclusion); end users (snappier UX).

