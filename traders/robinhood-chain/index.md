---
title: Robinhood Chain overview
description: Low-latency Robinhood Chain sequencer feed (/rh) delivered over compressed WebSocket endpoints in four regions.
---

# Robinhood Chain

The Robinhood Chain sequencer feed (`/rh`) delivers the official sequencer feed (`wss://feed.mainnet.chain.robinhood.com`) through Optimum's regional WebSocket endpoints. Optimum reads the official feed in Salt Lake City and Dallas and carries every block to each region, so you receive the first copy of each block once. You connect directly with any WebSocket client and do not run a Robinhood Chain node.

<svg viewBox="0 0 1100 248" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Optimum reads the official Robinhood Chain sequencer feed, delivers the first copy to regional /rh endpoints, and sends compressed JSON text frames to your WebSocket client" style="width:100%;height:auto;max-width:1100px;display:block;margin:1.5rem auto;">
  <defs>
    <marker id="rh-ov-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
      <path d="M0,0 L10,5 L0,10 L2.2,5 Z" fill="currentColor" fill-opacity="0.55"></path>
    </marker>
  </defs>
  <line x1="332" y1="124" x2="408" y2="124" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#rh-ov-arrow)"></line>
  <text x="370" y="108" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">first copy</text>
  <line x1="708" y1="124" x2="784" y2="124" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#rh-ov-arrow)"></line>
  <text x="746" y="108" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">WSS /rh</text>
  <rect x="24" y="48" width="308" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="178" y="84" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">Source</text>
  <text x="178" y="118" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">Official sequencer</text>
  <text x="178" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">Salt Lake City &amp; Dallas</text>
  <text x="178" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">exact official JSON format</text>
  <rect x="408" y="48" width="300" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="558" y="84" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">Optimum endpoint</text>
  <text x="558" y="118" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">Regional /rh</text>
  <text x="558" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">nrt · cmh · iad · lhr</text>
  <text x="558" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">bearer.ofk_ + deflate</text>
  <rect x="784" y="40" width="292" height="168" rx="20" fill="#B87CFF" fill-opacity="0.07" stroke="#B87CFF" stroke-width="2"></rect>
  <text x="930" y="80" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="#B87CFF" style="text-transform:uppercase">Your client</text>
  <text x="930" y="116" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">Sequencer JSON</text>
  <text x="930" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.78">one text frame per block</text>
  <text x="930" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">drop-in official decoder</text>
</svg>

## About Robinhood Chain

[Robinhood Chain](https://docs.robinhood.com/chain/) is a permissionless, Ethereum-compatible Layer 2 built on Arbitrum that uses ETH as its gas token. Transaction ordering is first-come, first-served at the sequencer: paying a higher fee does not move a transaction ahead of one that arrived earlier.

Mainnet chain ID is `4663`. Network details, the public RPC, and wallet setup live in [Connecting to Robinhood Chain](https://docs.robinhood.com/chain/connecting/).

Optimum's `/rh` endpoint delivers the sequencer feed as published, with no execution results (no transaction receipts, logs, status, or gas used). It is not a JSON-RPC endpoint and you do not point a node's RPC config at it.

## Where to go next

* [Quick start](/traders/robinhood-chain/quick-start) connects to `/rh` and prints live sequence numbers and JSON.
* [Messages](/traders/robinhood-chain/messages) documents the compressed JSON text payload, lag notices, and reconnect behavior.
* [Authentication](/traders/authentication) and [Endpoints](/traders/endpoints) cover Console feed keys, regions, and status codes.
