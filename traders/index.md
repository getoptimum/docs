---
title: Optimum for Traders
description: Low-latency Hyperliquid market data and the Robinhood Chain sequencer feed over authenticated WebSocket endpoints.
---

# Optimum for Traders

Optimum for Traders delivers Hyperliquid market data and the Robinhood Chain sequencer feed through one load-balanced WebSocket endpoint in each region. You connect directly with a feed key from [Console](https://console.getoptimum.xyz/). You do not run a node.

<svg viewBox="0 0 1100 248" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Subscribe in Console to get one feed key, open a compressed WebSocket to the nearest regional endpoint, and receive Hyperliquid or Robinhood Chain feeds" style="width:100%;height:auto;max-width:1100px;display:block;margin:1.5rem auto;">
  <defs>
    <marker id="o4t-ov-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
      <path d="M0,0 L10,5 L0,10 L2.2,5 Z" fill="currentColor" fill-opacity="0.55"></path>
    </marker>
  </defs>
  <line x1="332" y1="124" x2="408" y2="124" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#o4t-ov-arrow)"></line>
  <text x="370" y="108" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">ofk_ key</text>
  <line x1="708" y1="124" x2="784" y2="124" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#o4t-ov-arrow)"></line>
  <text x="746" y="108" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">WSS :443</text>
  <rect x="24" y="48" width="308" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="178" y="84" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">Console</text>
  <text x="178" y="118" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">Feed key</text>
  <text x="178" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">Feeds → My feeds and keys</text>
  <text x="178" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">one key for active feeds</text>
  <rect x="408" y="48" width="300" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="558" y="84" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">Regional endpoint</text>
  <text x="558" y="118" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">One URL per feed</text>
  <text x="558" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">nrt, cmh, iad, or lhr</text>
  <text x="558" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">permessage-deflate required</text>
  <rect x="784" y="40" width="292" height="168" rx="20" fill="#B87CFF" fill-opacity="0.07" stroke="#B87CFF" stroke-width="2"></rect>
  <text x="930" y="80" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="#B87CFF" style="text-transform:uppercase">Your client</text>
  <text x="930" y="116" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">Live feeds</text>
  <text x="930" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.78">Hyperliquid MBO &amp; TOB</text>
  <text x="930" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">Robinhood Chain /rh</text>
</svg>

Every regional endpoint reads all of that region's Optimum nodes and forwards the first copy of each message. One connection per feed is enough, and losing a single node does not interrupt your stream.

## Launch feeds

| Chain | Feed | Path | Format | How to consume |
| --- | --- | --- | --- | --- |
| [Hyperliquid](/traders/hyperliquid/) | Full order book (market-by-order) | `/hl-mbo` | Compressed binary frames (v3.4.0) | `hlfeed` CLI, Go client library, your own WebSocket client, or optional local UDP multicast |
| [Hyperliquid](/traders/hyperliquid/) | Top of book and trades | `/hl-tob` | Compressed binary frames (v3.3.0) | `hlfeed` CLI, Go client library, your own WebSocket client, or optional local UDP multicast |
| [Robinhood Chain](/traders/robinhood-chain/) | Sequencer feed | `/rh` | Compressed JSON text frames | Any WebSocket client |

All feeds share the same regional hostnames, TCP port 443, `ofk_` key handshake, and required `permessage-deflate` compression.

## Where to go next

* [Authentication](/traders/authentication) covers getting your feed key in Console, storing it safely, and sending it in the WebSocket handshake.
* [Endpoints](/traders/endpoints) lists every regional host, feed path, compression rule, and status code.
* [Hyperliquid](/traders/hyperliquid/) walks through the feeds, the `hlfeed` CLI, the Go client, optional multicast delivery, and the binary wire format.
* [Robinhood Chain](/traders/robinhood-chain/) walks through connecting to `/rh` and reading sequencer messages.
