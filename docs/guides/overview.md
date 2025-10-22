# Quick Start

This developer guide is your complete reference for installing, configuring, and operating **Optimum Network**.

This guide walks you through everything you need to **understand**, **deploy**, **run**, and **experiment** with Optimum Network. It's designed for beginners but complete enough for advanced developers to jump in and integrate.

Whether you are an application developer, systems engineer, or hackathon participant, this guide will help you:

1. **Install and run** Optimum Network in different environments
2. **Connect clients** via gRPC, REST, or CLI
3. **Tune parameters** for performance or reliability
4. **Run experiments** to validate system behavior
5. **Monitor and debug** your deployment

## Start Building

Choose your path to get started with Optimum Network:

### **Try mump2p (≤5 min)**

**[Using mump2p-cli](01-getting-started-cli.md)** — Connect to hosted proxy, no setup required

* One-command installation
* Instant messaging with hosted infrastructure
* Perfect for testing and prototyping

### **Run Locally**

**[Local Setup with Docker](02-getting-started-docker.md)** — Full control over configuration

* Complete local network deployment
* Experiment with different parameters
* Compare mump2p vs GossipSub performance

### **Understanding & Experimenting**

Essential for hackathon success:

* **[Understanding Key Parameters](03-parameters.md)** — Tune thresholds, shards, and mesh settings
* **[Common Experiments](04-experiments.md)** — Test performance under different conditions
* **[FAQ](05-faq-glossary.md)** — Quick answers and debugging help


## What This Guide Covers

This guide is organized into self-contained sections:

1. **[Using mump2p-cli](01-getting-started-cli.md)** — Connect to hosted proxy with no setup required.
2. **[Local Setup with Docker](02-getting-started-docker.md)** — Run your own local proxy and P2P nodes for full control.
3. **[Understanding Key Parameters](03-parameters.md)** — Tune thresholds, shards, and mesh settings for your workload.
4. **[Common Experiments](04-experiments.md)** — Test performance and reliability under different conditions.
5. **[FAQ](05-faq-glossary.md)** — Quick answers and debugging help.


## Who This Guide Is For

* **Application developers** who want to integrate fast, resilient messaging.
* **Infrastructure engineers** deploying distributed systems.
* **Hackathon teams** experimenting with real-time messaging.
* **Researchers** testing RLNC in real-world scenarios.


## Key Concepts

Before diving deep, familiarize yourself with these terms and how they relate to Optimum Network's architecture:

| Term         | Description |
|--------------|-------------|
| **Topic**    | A named channel for publishing and subscribing to messages. Peers in the same topic exchange messages relevant only to that topic. |
| **Message**  | The original data you publish to a topic (e.g., text, JSON, binary). |
| **Shard**    | A coded fragment of a message produced by RLNC (Random Linear Network Coding). Shards allow messages to be reconstructed even if some are lost. |
| **Threshold**| The fraction of shards required to successfully decode a message. For example, a threshold of 0.7 means only 70% of shards are needed. |
| **RLNC**     | Random Linear Network Coding — a technique that mixes message fragments mathematically for redundancy and efficiency. |
| **Mesh**     | The set of directly connected peers in a topic. The mesh topology affects redundancy, latency, and fault tolerance. |
| **Bootstrap Node** | A known peer address used to join the P2P network and discover other peers. |
| **Optimum Proxy** | Bridge nodes between clients and the P2P mesh. It manages subscriptions, publications, and threshold logic on behalf of clients. |
| **Direct P2P Mode** | Clients connect directly to P2P nodes via gRPC without going through a proxy. This can reduce latency but requires more configuration. |
| **Mesh Parameters** | Settings such as `MESH_TARGET` that define how many peers a node tries to keep in its topic mesh. |
| **Fanout**   | A temporary set of peers a publisher sends messages to when it is not part of the topic mesh. |
| **Control Messages** | Special messages like GRAFT, PRUNE, IHAVE, IWANT used for GossipSub mesh management. mump2p integrates similar control flows for RLNC. |
| **Node Discovery** | The process by which proxies or nodes automatically learn about other nodes to connect to. |
| **gRPC API** | The RPC interface provided by either a P2P node or a proxy for client communication. |

For more technical details, see the **[mump2p Technical Overview](../learn/overview/p2p.md)**.

