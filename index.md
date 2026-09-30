---
title: Introduction to Optimum
description: Optimum delivers Ethereum blocks to your beacon node sooner, and measures your MEV-Boost bid cutoff against your own proposals.
---

# Introduction to Optimum

Your validators can only attest to a block after it reaches your beacon node. When the block arrives late, attestations miss or vote on the wrong head. When you propose, the MEV-Boost bid cutoff sets how long you wait for a better bid. If you wait too long, your block is late. If you cut off too early, you leave value behind.

Optimum works on both.

## What Optimum is

Optimum runs **mump2p**, a peer-to-peer mesh that propagates blocks using network coding. Peers send coded pieces of a block and rebuild it from whichever pieces reach them first, instead of waiting for a full copy. See [mump2p protocol](/docs/learn/overview/p2p) for the details.

You join the mesh by running the **Optimum gateway**, one container on a host beside your beacon node.

```text
Optimum mesh ──► your gateway ──► your beacon node ──► your validator client
                 (you run it)     (unchanged)           (unchanged)
```

The gateway is a peer of your consensus client. It passes blocks to the client and never receives validator keys. Your validator client, keys, and signing setup stay exactly as they are.

## What you get

| | What it does | Where you see it |
| --- | --- | --- |
| **Signal** | The gateway hands your beacon node blocks from the mesh, so your validators receive blocks sooner. That improves attestation performance. | Signal in Console, then the **Network** report |
| **Accelerate** | Reads the slots your validators already proposed and recommends a MEV-Boost bid cutoff. You download the config and deploy it yourself. | Accelerate in Console, then the **MumBoost** report |

Console never changes your infrastructure. You run the gateway and apply any configuration yourself.

## Who it is for

* **Validators and staking providers.** Run a gateway beside each beacon node, then register your validator indices so Console can measure the result.
* **Participants without validators.** Run a stream-only gateway to receive blocks from the mesh and serve them to your own consumers. This is a supported account.

## The path

1. **[Start here](/start/what-optimum-does).** How the pieces fit, which path is yours, and what the host needs.
2. **[Getting in](/getting-in/create-an-account).** Create a Console account and register your organisation.
3. **[Signal](/signal/what-signal-does).** Start the gateway, peer your consensus client, verify it, and register your validator indices.
4. **[Accelerate](/accelerate/what-accelerate-does).** Once enough of your proposals are measured, read the cutoff recommendation and adjust MEV-Boost.

[Open Console](https://console.getoptimum.io/)

Already running a gateway? The versioned manual (every setting, metric, and log line) is the [gateway reference](https://getoptimum.github.io/optimum-gateway/versions/latest/).
