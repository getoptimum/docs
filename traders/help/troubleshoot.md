---
title: Troubleshoot
description: Common connection, compression, authentication, and feed issues across Hyperliquid and Robinhood Chain.
---

# Troubleshoot

Use this table to diagnose handshake refusals, closes, and missing data across all Optimum for Traders feeds.

## Common symptoms

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| **HTTP 400** at connect (`ErrCompressionRequired`) | Client did not offer `permessage-deflate` with `server_no_context_takeover` (15-bit window) | Enable per-message deflate in your WebSocket library, or rebuild `tn-edge-recv` from commit `8d67830` or later |
| **HTTP 401** (or 403) at connect (`ErrKeyRejected`) | Missing key, typo/newline issue, key rotated or revoked, expired plan, feed not active on your account, or connection limit reached | Open **Feeds → My feeds and keys** in [Console](https://console.getoptimum.xyz/), verify the feed is active, and check your key file holds the exact `ofk_` string on one line |
| **HTTP 404** at connect | Wrong URL path | Use `/hl-mbo`, `/hl-tob`, or `/rh` — see [Endpoints](/traders/endpoints) |
| **HTTP 426** at connect | Plain HTTP request instead of a WebSocket upgrade | Connect with a WebSocket client using `wss://` |
| **HTTP 503** at connect | The regional server temporarily has no healthy upstream for that feed | Retry with backoff, or connect to another region (`nrt`, `cmh`, `iad`, `lhr`) |
| `ErrNotSelected` | A proxy or load balancer stripped `Sec-WebSocket-Protocol` | Check intermediate proxies, or test with `Authorization: Bearer <key>` |
| Connection times out | Outbound TCP 443 blocked | Allow outbound TCP 443 to `turbo-{nrt,cmh,iad,lhr}.getoptimum.io` |
| Socket closes with **WS 1001** | The server is draining or being replaced | Reconnect automatically with backoff |
| Socket closes with **WS 1008** | Your key was rotated, revoked, or your plan expired | Check **Feeds → My feeds and keys** and **Account → Billing** in Console |
| `no message for 5s`, then reconnect | Network path stalled (Hyperliquid sends a heartbeat after 1 second of silence) | Check local network health, or fail over to another region |
| No Hyperliquid events printed for a symbol for up to 30 seconds | Instrument definitions repeat on a 30-second cycle, and `hlfeed` waits for a symbol's definition before printing it | Wait up to 30 seconds after connecting; confirm the symbol is a listed perpetual (spot `@N` markets are not carried) |
| No Hyperliquid books printed in `-mode book` for up to 30 seconds | Books need both the first snapshot (15-second cycle) and the instrument definition (30-second cycle) | Wait up to 30 seconds after connecting for `"status":"ready"` |
| `status: "resync"` lines in `hlfeed -mode book` | Frames were lost or the publisher reset an instrument | Normal self-healing; the book becomes `"ready"` again after the next snapshot (up to 15 seconds) |
| Text frame `{"type":"lag",…}` arrives | Your client fell behind the endpoint's send buffer and messages were skipped | Speed up your consumer loop or decouple decoding from socket reads; on MBO, rebuild books from the next snapshot |
| `tn-edge-recv` metrics rise, but multicast consumer sees nothing | Consumer joined the wrong multicast group/port or did not bind to `tn0` | Verify groups and ports against [The feeds](/traders/hyperliquid/), confirm `tn0` is up (`ip link show tn0`), and verify routes |

## Support

If the issue persists, contact your Optimum representative with:

* the regional hostname and feed path you connected to
* the UTC timestamp and exact HTTP status or WebSocket close code
* for `hlfeed` or `tn-edge-recv`, the `stderr` log lines or `/metrics` output (never include your `ofk_` key)
