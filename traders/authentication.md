---
title: Authentication
description: Get your Optimum for Traders feed key in Console, store it safely, and send it in the WebSocket handshake.
---

# Authentication

Every feed endpoint requires an `ofk_` feed key from [Console](https://console.getoptimum.xyz/). One key covers every feed active on your organization's account.

<svg viewBox="0 0 1100 248" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pick feeds in Console Store, copy your feed key from My feeds and keys, save it in a mode-600 file, and send bearer.ofk_ on the WebSocket handshake" style="width:100%;height:auto;max-width:1100px;display:block;margin:1.5rem auto;">
  <defs>
    <marker id="auth-flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
      <path d="M0,0 L10,5 L0,10 L2.2,5 Z" fill="currentColor" fill-opacity="0.55"></path>
    </marker>
  </defs>
  <line x1="248" y1="124" x2="296" y2="124" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#auth-flow-arrow)"></line>
  <line x1="524" y1="124" x2="572" y2="124" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#auth-flow-arrow)"></line>
  <line x1="800" y1="124" x2="848" y2="124" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#auth-flow-arrow)"></line>
  <rect x="20" y="48" width="228" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="134" y="84" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">1 · Store</text>
  <text x="134" y="118" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="20" font-weight="400" letter-spacing="-0.4" fill="currentColor">Pick feeds</text>
  <text x="134" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="13" font-weight="500" fill="currentColor" fill-opacity="0.72">Card or crypto</text>
  <text x="134" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="13" font-weight="500" fill="currentColor" fill-opacity="0.55">2–10 connections</text>
  <rect x="296" y="48" width="228" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="410" y="84" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">2 · My feeds</text>
  <text x="410" y="118" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="20" font-weight="400" letter-spacing="-0.4" fill="currentColor">Copy key</text>
  <text x="410" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="13" font-weight="500" fill="currentColor" fill-opacity="0.72">Show, copy, or rotate</text>
  <text x="410" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="13" font-weight="500" fill="currentColor" fill-opacity="0.55">starts with ofk_</text>
  <rect x="572" y="48" width="228" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="686" y="84" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">3 · Host</text>
  <text x="686" y="118" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="20" font-weight="400" letter-spacing="-0.4" fill="currentColor">Save to file</text>
  <text x="686" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="13" font-weight="500" fill="currentColor" fill-opacity="0.72">chmod 600</text>
  <text x="686" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="13" font-weight="500" fill="currentColor" fill-opacity="0.55">one line, no CLI arg</text>
  <rect x="848" y="40" width="232" height="168" rx="20" fill="#B87CFF" fill-opacity="0.07" stroke="#B87CFF" stroke-width="2"></rect>
  <text x="964" y="80" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="#B87CFF" style="text-transform:uppercase">4 · Handshake</text>
  <text x="964" y="116" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="20" font-weight="400" letter-spacing="-0.4" fill="currentColor">Connect</text>
  <text x="964" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="13" font-weight="500" fill="currentColor" fill-opacity="0.78">bearer.ofk_…</text>
  <text x="964" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="13" font-weight="500" fill="currentColor" fill-opacity="0.55">HTTP 101 on success</text>
</svg>

## Get a feed key in Console

1. Sign in to [Console](https://console.getoptimum.xyz/) (or create a self-serve account).
2. Under **Feeds**, open **Store**. Pick the feeds you want and your total live connection count (each plan includes 2 connections, up to 10 total):
    * **Robinhood Chain — Sequencer feed** (grants access to `/rh`)
    * **Hyperliquid — Full order book** (grants access to `/hl-mbo`, carrying both native perpetuals and `trade.xyz` perpetuals)
    * **Hyperliquid — Top of book and trades** (grants access to `/hl-tob`, carrying both native perpetuals and `trade.xyz` perpetuals)
3. Complete checkout by card (24-hour trial, then monthly subscription) or by crypto (one-time prepayment for 1 day, 1 week, or 30 days).
4. Open **Feeds → My feeds and keys**. Once payment confirms, your active feeds and your organization's feed key appear there.
5. Use **Show** or **Copy** to retrieve the `ofk_` key.

Your organization has one feed key that opens every active feed on the account. Manage subscriptions and cancellations under **Account → Billing**.

## Store the key on your host

Keep the key in a file only your user can read. Optimum's command-line tools read the key from a file path and never accept it as a command-line argument, so it stays out of shell history and process listings.

```bash
install -m 600 /dev/null ~/.config/optimum-feed.key
# Paste the ofk_ key from Console into ~/.config/optimum-feed.key on one line
```

Do not send a feed key in email or chat, and do not commit it to source control.

## WebSocket handshake

Send the key on the opening WebSocket upgrade request. The endpoint checks these forms in order:

1. `Sec-WebSocket-Protocol: bearer.<key>` (recommended). The server echoes that exact subprotocol in the HTTP 101 response and selects no other.
2. `Authorization: Bearer <key>`.
3. `?token=<key>` in the query string, only if the key was explicitly issued with query-string access (off by default). Avoid query parameters because URLs are often recorded in proxy logs.

Do not put the key in the URL path. TLS (`wss://`) is required on every endpoint.

## Feed scope and connection limits

* **Feed scope:** A key only opens paths for feeds active on your account. Connecting to `/hl-tob` with a key that only includes `/hl-mbo` is refused with HTTP 401.
* **Connection limit:** Each plan sets a live connection limit per feed (2 included by default, up to 10 total). Limits are counted per relay server; each feed path counts independently.
* **Expiry:** When a subscription or prepaid period ends, access stops and open sockets close.

## Rotating an exposed key

If you suspect a key has been leaked, open **Feeds → My feeds and keys** in Console and click **Rotate**. Console replaces the key immediately, and regional endpoints drop connections using the previous key within seconds.

## Refusals and closes

A refused upgrade returns HTTP 401. All key failures return the same 401 without revealing which check failed:

* missing key
* unknown, rotated, or revoked key
* expired plan or key
* feed not enabled on the key
* connection limit reached
* key sent in `?token=` when query access is disabled

After the connection is open, the key is not re-checked per message, but if it is rotated, revoked, or expires, the server closes the socket with WebSocket close code **1008**. See [Endpoints](/traders/endpoints) for all HTTP and WebSocket status codes.
