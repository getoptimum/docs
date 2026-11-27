---
title: Hyperliquid feeds
description: Hyperliquid full order book (market-by-order) and top-of-book market data feeds for native and trade.xyz perpetuals.
---

# Hyperliquid feeds

Optimum for Traders delivers four Hyperliquid market data feeds behind two WebSocket paths: full order book (`/hl-mbo`) and top of book (`/hl-tob`). Each path carries both Hyperliquid native perpetuals and `trade.xyz` perpetuals.

<svg viewBox="0 0 1100 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="One feed key opens two Hyperliquid paths: /hl-mbo for market-by-order on native and xyz perpetuals, and /hl-tob for top-of-book quotes and trades on native and xyz perpetuals" style="width:100%;height:auto;max-width:1100px;display:block;margin:1.5rem auto;">
  <defs>
    <marker id="hl-paths-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
      <path d="M0,0 L10,5 L0,10 L2.2,5 Z" fill="currentColor" fill-opacity="0.55"></path>
    </marker>
  </defs>
  <line x1="352" y1="136" x2="548" y2="90" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#hl-paths-arrow)"></line>
  <text x="444" y="96" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">/hl-mbo</text>
  <line x1="352" y1="184" x2="548" y2="230" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#hl-paths-arrow)"></line>
  <text x="444" y="226" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">/hl-tob</text>
  <rect x="24" y="84" width="328" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="188" y="120" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">Same regional endpoint</text>
  <text x="188" y="154" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">One feed key</text>
  <text x="188" y="186" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">wss://turbo-&lt;metro&gt;.getoptimum.io</text>
  <text x="188" y="208" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">two sockets if both plans are active</text>
  <rect x="548" y="20" width="528" height="132" rx="20" fill="#B87CFF" fill-opacity="0.07" stroke="#B87CFF" stroke-width="2"></rect>
  <text x="812" y="56" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="#B87CFF" style="text-transform:uppercase">Full order book · /hl-mbo</text>
  <text x="812" y="90" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">hyper-hl-mbo &amp; hyper-xyz-mbo</text>
  <text x="812" y="122" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.78">every add, cancel, execute, trade, and 15 s book snapshot</text>
  <rect x="548" y="168" width="528" height="132" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="812" y="204" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">Top of book · /hl-tob</text>
  <text x="812" y="238" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">hyper-hl-tob &amp; hyper-xyz-tob</text>
  <text x="812" y="270" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">best bid and offer after each block, plus trades</text>
</svg>

## The feeds

| Feed code | WebSocket path | Contents | Format | Channel | Source ID | Multicast group (optional) | Multicast ports |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `hyper-hl-mbo` | `/hl-mbo` | Hyperliquid native perps, every order | Market-by-order v3.4.0 | 1 | 1 | `233.84.178.28` | 20010 mktdata, 20011 refdata, 20012 snapshot |
| `hyper-xyz-mbo` | `/hl-mbo` | `trade.xyz` perps (`xyz:` coins), every order | Market-by-order v3.4.0 | 2 | 7 | `233.84.178.30` | 20110 mktdata, 20111 refdata, 20112 snapshot |
| `hyper-hl-tob` | `/hl-tob` | Hyperliquid native perps, best bid and ask | Top-of-book v3.3.0 | 1 | 1 | `233.84.178.27` | 20000 mktdata, 20001 refdata |
| `hyper-xyz-tob` | `/hl-tob` | `trade.xyz` perps (`xyz:` coins), best bid and ask | Top-of-book v3.3.0 | 2 | 7 | `233.84.178.29` | 20100 mktdata, 20101 refdata |

Spot (`@N`) markets and other builder DEXes are not carried.

In [Console](https://console.getoptimum.xyz/), subscribing to **Hyperliquid — Full order book** grants access to `/hl-mbo` (both `hyper-hl-mbo` and `hyper-xyz-mbo`), and **Hyperliquid — Top of book and trades** grants access to `/hl-tob` (both `hyper-hl-tob` and `hyper-xyz-tob`).

## What the feeds carry

The feeds are built from an Optimum Hyperliquid node in Tokyo. Every order event Hyperliquid's chain produces is published block by block, as soon as the node has the complete block.

* **Instruments:** Every listed perpetual on Hyperliquid's native exchange (`hyper-hl-*`), and every listed perpetual on `trade.xyz`, whose coin names start with `xyz:` (`hyper-xyz-*`). Delisted coins are omitted. When a coin is listed or delisted, the instrument set changes and the `Manifest Seq` in `ManifestSummary` advances.
* **Full order book (`/hl-mbo`):** Carries every resting order: an `OrderAdd` when an order rests on the book, an `OrderCancel` when it leaves without trading, and an `OrderExecute` for each fill against it, each with Hyperliquid's order ID. Each trade also produces one `Trade`. A `BatchBoundary` closes each Hyperliquid block. Because the format has no modify message, an in-place size change is sent as `OrderCancel` (reason `0`, Unknown) followed by `OrderAdd` with the same order ID and the new size. The snapshot port sends every instrument's full book in a 15-second cycle so a new subscriber (or one that lost a frame) can build or repair its books.
* **Top of book (`/hl-tob`):** Sends, after each Hyperliquid block, one `Quote` for every instrument whose best bid or ask changed (price, size, or order count), with both sides in full. Each trade produces one `Trade` on the same port. There is no snapshot port: an instrument's first `Quote` is its complete state, and every instrument is resent at least every 15 seconds.
* **Not sent:** Liquidation annotations (`Liquidation`, `0x08`). A liquidation's fills still arrive as ordinary executions and trades.

## Ways to consume

Your `ofk_` key is all you need to access the feeds. Pick whichever integration fits your stack:

1. **[Quick start (`hlfeed` CLI)](/traders/hyperliquid/quick-start):** Fastest way to verify your key and stream JSON lines or rebuilt order books in a terminal.
2. **[Client library and custom WebSocket](/traders/hyperliquid/client-library):** Embed the Go `client`, `wire`, and `book` packages in your own process, or connect directly with any WebSocket client.
3. **[Multicast receiver](/traders/hyperliquid/multicast-receiver):** Optional Linux daemon (`tn-edge-recv`) that re-emits unmodified frames as local UDP multicast on `tn0`.
4. **[Wire format](/traders/hyperliquid/wire-format):** Complete binary and JSON-line reference for building a decoder in any language.
