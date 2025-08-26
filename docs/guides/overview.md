# Overview

This developer guide is your complete reference for installing, configuring, and operating **OptimumP2P**.

This guide walks you through everything you need to **understand**, **deploy**, **run**, and **experiment** with OptimumP2P.
It’s designed for beginners but complete enough for advanced developers to jump in and integrate.

If you want deep technical theory, see the **[OptimumP2P Technical Overview](../learn/overview/p2p.md)** — this guide stays hands-on.

Whether you are an application developer, or a systems engineer or a hackathon participant, this guide will help you:

1. **Install and run** OptimumP2P in different environments.
2. **Connect clients** via gRPC, REST, or CLI.
3. **Tune parameters** for performance or reliability.
4. **Run experiments** to validate system behavior.
5. **Monitor and debug** your deployment.

## Key Concepts

Before diving in, you should be familiar with these terms and how they relate to OptimumP2P’s architecture:

| Term         | Description |
|--------------|-------------|
| **Topic**    | A named channel for publishing and subscribing to messages. Peers in the same topic exchange messages relevant only to that topic. |
| **Message**  | The original data you publish to a topic (e.g., text, JSON, binary). |
| **Shard**    | A coded fragment of a message produced by RLNC (Random Linear Network Coding). Shards allow messages to be reconstructed even if some are lost. |
| **Threshold**| The fraction of shards required to successfully decode a message. For example, a threshold of 0.7 means only 70% of shards are needed. |
| **RLNC**     | Random Linear Network Coding — a technique that mixes message fragments mathematically for redundancy and efficiency. |
| **Mesh**     | The set of directly connected peers in a topic. The mesh topology affects redundancy, latency, and fault tolerance. |
| **Bootstrap Node** | A known peer address used to join the P2P network. Without one, a new node cannot discover other peers. |
| **Optimum Proxy** | A bridge between clients and the P2P mesh. It manages subscriptions, publications, and threshold logic on behalf of clients. |
| **Direct P2P Mode** | Clients connect directly to P2P nodes via gRPC without going through a proxy. This can reduce latency but requires more configuration. |
| **Mesh Parameters** | Settings such as `MESH_TARGET` that define how many peers a node tries to keep in its topic mesh. |
| **Fanout**   | A temporary set of peers a publisher sends messages to when it is not part of the topic mesh. |
| **Control Messages** | Special messages like GRAFT, PRUNE, IHAVE, IWANT used for GossipSub mesh management. OptimumP2P integrates similar control flows for RLNC. |
| **Node Discovery** | The process by which proxies or nodes automatically learn about other nodes to connect to. |
| **gRPC API** | The RPC interface provided by either a P2P node or a proxy for client communication. |

---


## What This Guide Covers

This guide is organized into self-contained chapters:

1. **[Getting Started with CLI](01-getting-started-cli.md)** — Use `mump2p-cli` to connect to a hosted Optimum Proxy with no setup required.
2. **[Getting Started with Docker](02-getting-started-docker.md)** — Run your own local proxy and P2P nodes for full control.
3. **[Understanding Key Parameters](03-parameters.md)** — Tune thresholds, shards, and mesh settings for your workload.
4. **[Common Experiments](04-experiments.md)** — Test performance and reliability under different conditions.
5. **[FAQ & Glossary](05-faq-glossary.md)** — Quick answers and key term definitions.



## Who This Guide Is For

* **Application developers** who want to integrate fast, resilient messaging.
* **Infrastructure engineers** deploying distributed systems.
* **Hackathon teams** experimenting with real-time messaging.
* **Researchers** testing RLNC in real-world scenarios.

