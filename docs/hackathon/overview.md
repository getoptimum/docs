# OptimumP2P Network Configuration Guide

This guide helps you install, run, and experiment with OptimumP2P — a next-generation gossip protocol built for Web3 networks. 
Whether you’re a hacker, builder, or researcher, this guide will walk you through:

* Setup and deployment
* Messaging and client integration
* Configuration and tuning
* Performance testing
* Debugging and troubleshooting

Start with the [OptimumP2P Technical Overview](../learn/overview/p2p.md) — a primer on how RLNC-based gossip works.

---

## 📚 Table of Contents

<details>
<summary><strong>Expand to view all sections</strong></summary>

- [OptimumP2P Network Configuration Guide](#optimump2p-network-configuration-guide)
  - [📚 Table of Contents](#-table-of-contents)
  - [Quick Start](#quick-start)
    - [1. Install Dependencies](#1-install-dependencies)
    - [2. Send Your First Message](#2-send-your-first-message)
  - [Deployment Options](#deployment-options)
    - [OptimumP2P Nodes](#optimump2p-nodes)
    - [Proxy + OptimumP2P Nodes (Recommended)](#proxy--optimump2p-nodes-recommended)
  - [Client Integration](#client-integration)
    - [CLI](#cli)
    - [App Integration](#app-integration)
  - [Configuration](#configuration)
  - [Performance \& Comparison](#performance--comparison)
  - [Docker Images Used](#docker-images-used)
  - [Architecture Deep Dive](#architecture-deep-dive)

</details>

---

## Quick Start

Get a local OptimumP2P network running in minutes:

### 1. [Install Dependencies](./quick-start/installation.md)

* Docker + Docker Compose  
* Git (optional)  
* Go (for client dev)

### 2. [Send Your First Message](./quick-start/first-message.md)

* Start 4 P2P nodes + 2 proxy  
* Subscribe to a topic  
* Publish messages via REST/gRPC  
* Receive live decoded messages

---

## Deployment Options

Choose a setup depending on your use case:

### OptimumP2P Nodes

Deploys just the gossip layer (lightweight, direct node-to-node).  
[Guide →](./deployment/p2p-only.md)

### Proxy + OptimumP2P Nodes (Recommended)

Adds REST and gRPC APIs for clients, UIs, testing.  
[Guide →](./deployment/p2p-with-proxy.md)

---

## Client Integration

### CLI

* **[mump2p-cli](./clients/mump2p-cli.md)** — Simple tool to test publish/subscribe

### App Integration

* **[gRPC Examples](./clients/grpc-examples.md)** — Full Go clients using bi-directional streaming

Use these to build chat apps, multiplayer games, decentralized sensors, or MEV relays.

---


## Configuration

Fine-tune OptimumP2P for your use case:

* **[Protocol Selection](./configuration/protocol-selection.md)** - Switch between OptimumP2P and GossipSub modes
* **[OptimumP2P Configuration](./configuration/optimump2p.md)** - RLNC parameters, mesh topology, and performance tuning  
* **[GossipSub Configuration](./configuration/gossipsub.md)** - Standard GossipSub parameters for comparison

## Performance & Comparison

Benchmark and compare OptimumP2P:

* **[Metrics Collection](./clients/)** - Understanding performance metrics
* **[OptimumP2P vs GossipSub](./clients/)** - Performance comparison methodology

## Docker Images Used

The hackathon uses these pre-built Docker images:

* **`getoptimum/p2pnode:latest`** - Core P2P node with OptimumP2P protocol
* **`getoptimum/proxy:latest`** - Proxy service for client APIs

Both images support protocol switching:

* `NODE_MODE=optimum` - RLNC-enhanced OptimumP2P (recommended)
* `NODE_MODE=gossipsub` - Standard GossipSub for comparison

See **[Protocol Selection](./configuration/protocol-selection.md)** for detailed configuration and deployment examples.

## Architecture Deep Dive

For developers and integrators:

* **[OptimumP2P Technical Overview](../learn/overview/p2p.md)** - Complete technical specification

---

**Ready to get started?** Begin with **[Installation](./quick-start/installation.md)** or dive into the **[Technical Overview](../learn/overview/p2p.md)**. 
