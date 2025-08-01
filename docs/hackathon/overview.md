# OptimumP2P Hackathon Guide

Welcome to the OptimumP2P hackathon documentation. This guide provides everything you need to deploy, configure, and integrate OptimumP2P - a novel RLNC-enhanced gossip algorithm for high-performance peer-to-peer networks.

## What is OptimumP2P?

OptimumP2P is a novel gossip algorithm that uses [Random Linear Network Coding (RLNC)](https://x.com/get_optimum/status/1891520664726802439) to enhance traditional gossip protocols like [GossipSub](https://github.com/libp2p/specs/tree/master/pubsub/gossipsub). For a comprehensive technical overview, see **[OptimumP2P Technical Overview](../learn/overview/p2p.md)**.

## Quick Start

Get OptimumP2P running in under 5 minutes:

1. **[Installation](./quick-start/installation.md)** - Set up Docker and dependencies

2. **[First Message](./quick-start/first-message.md)** - Publish and receive your first message

## Deployment Options

Choose your deployment strategy:

### P2P Network Only

* **[P2P-Only Deployment](./deployment/p2p-only.md)** - Deploy just the P2P nodes for direct integration

### Gateway + P2P Network  

* **[Gateway + P2P Deployment](./deployment/p2p-with-gateway.md)** - Full stack with REST/WebSocket APIs

## Client Integration

Connect to OptimumP2P using various client methods:

* **[mump2p-cli](./clients/)** - Command-line client for testing and automation

* **[gRPC Clients](./clients/)** - Direct gRPC integration examples

* **[REST/WebSocket APIs](./clients/)** - Gateway-based client integration

## Configuration

Fine-tune OptimumP2P for your use case:

* **[OptimumP2P Configuration](./configuration/optimump2p.md)** - RLNC parameters, mesh topology, and performance tuning  

* **[GossipSub Configuration](./configuration/gossipsub.md)** - Standard GossipSub parameters for comparison

## Performance & Comparison

Benchmark and compare OptimumP2P:

* **[Metrics Collection](./clients/)** - Understanding performance metrics

* **[OptimumP2P vs GossipSub](./clients/)** - Performance comparison methodology

## Docker Images Used

The hackathon uses these pre-built Docker images:

* **`getoptimum/p2pnode:latest`** - Core P2P node with OptimumP2P protocol

* **`getoptimum/gateway:latest`** - Gateway service for client APIs

Both images support protocol switching:

* `NODE_MODE=optimum` - RLNC-enhanced OptimumP2P (recommended)

* `NODE_MODE=gossipsub` - Standard GossipSub for comparison

## Architecture Deep Dive

For developers and integrators:

* **[OptimumP2P Technical Overview](../learn/overview/p2p.md)** - Complete technical specification

---

**Ready to get started?** Begin with **[Installation](./quick-start/installation.md)** or dive into the **[Technical Overview](../learn/overview/p2p.md)**. 

