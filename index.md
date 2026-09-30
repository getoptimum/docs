---
title: Introduction to Optimum
description: Optimum delivers Ethereum blocks to your beacon node sooner, and measures your MEV-Boost bid cutoff against your own proposals.
---

# Introduction to Optimum

Your validators can only attest to a block after it reaches your beacon node. When the block arrives late, attestations miss or vote on the wrong head. When you propose, the MEV-Boost bid cutoff sets how long you wait for a better bid. If you wait too long, your block is late. If you cut off too early, you leave value behind.

Optimum works on both.

## What Optimum is

**mump2p** is Optimum's peer-to-peer mesh. It propagates blocks using network coding: peers send coded pieces of a block and rebuild it from whichever pieces arrive first, instead of waiting for a full copy. See [mump2p protocol](/docs/learn/overview/p2p) for the details.

You join the mesh by running the **Optimum gateway**, one container on a host beside your beacon node.

<div class="data-path">

<svg viewBox="0 0 1340 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Data path: Optimum mesh to your gateway (you run it) to your beacon node (unchanged) to your validator client (unchanged)">
  <defs>
    <marker id="path-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
      <path d="M0,0 L10,5 L0,10 L2.2,5 Z" fill="currentColor" fill-opacity="0.55"></path>
    </marker>
  </defs>
  <line x1="272" y1="150" x2="348" y2="150" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#path-arrow)"></line>
  <line x1="652" y1="150" x2="728" y2="150" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#path-arrow)"></line>
  <line x1="992" y1="150" x2="1068" y2="150" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#path-arrow)"></line>
  <path d="M 40,60 L 240,60 A 20,20 0 0 1 260,80 L 260,220 A 20,20 0 0 1 240,240 L 40,240 A 20,20 0 0 1 20,220 L 20,80 A 20,20 0 0 1 40,60 Z" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></path>
  <text x="46" y="98" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55">NETWORK</text>
  <text x="46" y="136" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">Optimum mesh</text>
  <text x="46" y="178" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">Interconnected</text>
  <text x="46" y="200" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">mump2p nodes</text>
  <path d="M 440,50 L 620,50 A 20,20 0 0 1 640,70 L 640,170 A 80,80 0 0 1 560,250 L 380,250 A 20,20 0 0 1 360,230 L 360,130 A 80,80 0 0 1 440,50 Z" fill="#B87CFF" fill-opacity="0.07" stroke="#B87CFF" stroke-width="2"></path>
  <text x="396" y="94" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="#B87CFF">GATEWAY</text>
  <text x="396" y="140" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="28" font-weight="400" letter-spacing="-0.5" fill="currentColor">Your gateway</text>
  <text x="396" y="188" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.6">(you run it)</text>
  <path d="M 760,60 L 960,60 A 20,20 0 0 1 980,80 L 980,220 A 20,20 0 0 1 960,240 L 760,240 A 20,20 0 0 1 740,220 L 740,80 A 20,20 0 0 1 760,60 Z" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></path>
  <text x="766" y="98" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55">CONSENSUS</text>
  <text x="766" y="136" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">Your beacon node</text>
  <text x="766" y="188" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.6">(unchanged)</text>
  <path d="M 1100,60 L 1300,60 A 20,20 0 0 1 1320,80 L 1320,220 A 20,20 0 0 1 1300,240 L 1100,240 A 20,20 0 0 1 1080,220 L 1080,80 A 20,20 0 0 1 1100,60 Z" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></path>
  <text x="1106" y="98" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55">VALIDATOR</text>
  <text x="1106" y="136" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">Your validator client</text>
  <text x="1106" y="188" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.6">(unchanged)</text>
</svg>

</div>

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
