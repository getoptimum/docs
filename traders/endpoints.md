---
title: Endpoints
description: Regional WebSocket endpoints, feed paths, required compression, failover, and status codes for Optimum for Traders.
---

# Endpoints

Each region has one load-balanced endpoint on TCP port 443. Every server behind it subscribes to all Optimum nodes in that region and forwards the first copy of each message. Connect to the region closest to your host, and pick the path for the feed you want.

<svg viewBox="0 0 1100 248" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Choose the nearest regional endpoint among Tokyo, Ohio, Washington DC, or London, connect to /hl-mbo, /hl-tob, or /rh on port 443, and receive the first deduplicated copy of every message" style="width:100%;height:auto;max-width:1100px;display:block;margin:1.5rem auto;">
  <defs>
    <marker id="ep-o4t-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
      <path d="M0,0 L10,5 L0,10 L2.2,5 Z" fill="currentColor" fill-opacity="0.55"></path>
    </marker>
  </defs>
  <line x1="332" y1="124" x2="408" y2="124" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#ep-o4t-arrow)"></line>
  <text x="370" y="108" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">nearest</text>
  <line x1="708" y1="124" x2="784" y2="124" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#ep-o4t-arrow)"></line>
  <text x="746" y="108" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">first copy</text>
  <rect x="24" y="48" width="308" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="178" y="84" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">Regions</text>
  <text x="178" y="118" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">Four metros</text>
  <text x="178" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">nrt · cmh · iad · lhr</text>
  <text x="178" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">all on TCP 443</text>
  <rect x="408" y="48" width="300" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="558" y="84" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">Feed path</text>
  <text x="558" y="118" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">One URL per feed</text>
  <text x="558" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">/hl-mbo · /hl-tob · /rh</text>
  <text x="558" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">deflate + bearer.ofk_</text>
  <rect x="784" y="40" width="292" height="168" rx="20" fill="#B87CFF" fill-opacity="0.07" stroke="#B87CFF" stroke-width="2"></rect>
  <text x="930" y="80" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="#B87CFF" style="text-transform:uppercase">Delivery</text>
  <text x="930" y="116" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">Deduplicated stream</text>
  <text x="930" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.78">arbitrated across nodes</text>
  <text x="930" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">fail over to another metro</text>
</svg>

## Regions

| Region | Metro code | Location | Hostname |
| --- | --- | --- | --- |
| Tokyo | `nrt` | AWS `ap-northeast-1` | `turbo-nrt.getoptimum.io` |
| Ohio | `cmh` | AWS `us-east-2` | `turbo-cmh.getoptimum.io` |
| Washington, D.C. | `iad` | AWS `us-east-1` | `turbo-iad.getoptimum.io` |
| London | `lhr` | UK (`lhr`) | `turbo-lhr.getoptimum.io` |

All feeds run on TCP port 443 over TLS (`wss://`). If your firewall filters outbound traffic, allowing TCP 443 to these hostnames is enough.

## Feed paths

| Feed | Path | Example (Ohio) |
| --- | --- | --- |
| Hyperliquid full order book (MBO) | `/hl-mbo` | `wss://turbo-cmh.getoptimum.io/hl-mbo` |
| Hyperliquid top of book and trades (TOB) | `/hl-tob` | `wss://turbo-cmh.getoptimum.io/hl-tob` |
| Robinhood Chain sequencer feed | `/rh` | `wss://turbo-cmh.getoptimum.io/rh` |

## Compression is required

Every feed compresses messages on the wire using WebSocket `permessage-deflate` (RFC 7692) with `server_no_context_takeover` and a 15-bit server window:

* Hyperliquid messages compress to roughly one-third of their raw size.
* Robinhood Chain messages compress to roughly 40% of their raw size.

Your WebSocket client must offer `permessage-deflate` and accept `server_no_context_takeover` with a 15-bit window. Most modern libraries do this by default (for example, Python's `websockets`). In Go's `github.com/coder/websocket`, set `CompressionMode: websocket.CompressionNoContextTakeover`. Both `hlfeed` and current builds of `tn-edge-recv` negotiate this automatically.

A client that does not offer compatible compression is refused before the upgrade with **HTTP 400**.

## Failover

Within a region, one URL is enough because every server behind the load balancer reads all of that region's Optimum nodes. For resilience across regions, configure a second region's URL as your fallback (for example, `turbo-iad.getoptimum.io` after `turbo-cmh.getoptimum.io`).

## Status and close codes

| Code | Meaning | What to do |
| --- | --- | --- |
| **HTTP 101** | Upgrade accepted | Read frames; confirm `Sec-WebSocket-Protocol` echoes `bearer.<key>` |
| **HTTP 400** | Compression not offered or incompatible | Enable `permessage-deflate` with `server_no_context_takeover` (15-bit window) |
| **HTTP 401** | Authentication or authorization refused | Verify the key, that the feed is active on your account, and connection limits |
| **HTTP 404** | Unknown feed path | Use `/hl-mbo`, `/hl-tob`, or `/rh` |
| **HTTP 426** | Not a WebSocket upgrade | Connect with a WebSocket client over `wss://` |
| **HTTP 503** | Regional server temporarily lost upstream for this feed | Retry with backoff; you will usually land on a healthy server, or fail over to another region |
| **WS 1001** | Server is draining or being replaced | Reconnect |
| **WS 1008** | Key was rotated, revoked, or expired | Check **Feeds → My feeds and keys** in Console and update your key file |
