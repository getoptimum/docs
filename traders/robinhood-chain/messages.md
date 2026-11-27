---
title: Robinhood Chain messages
description: Compressed JSON text frames, official sequencer payload fields, lag notices, and reconnect behavior on /rh.
---

# Robinhood Chain messages

A `/rh` WebSocket delivers two kinds of JSON text frames: a compressed sequencer payload or an uncompressed lag notice.

<svg viewBox="0 0 1100 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A /rh WebSocket delivers either a compressed text frame carrying one JSON sequencer message or an uncompressed text frame carrying a lag notice" style="width:100%;height:auto;max-width:1100px;display:block;margin:1.5rem auto;">
  <defs>
    <marker id="rh-msg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
      <path d="M0,0 L10,5 L0,10 L2.2,5 Z" fill="currentColor" fill-opacity="0.55"></path>
    </marker>
  </defs>
  <line x1="352" y1="146" x2="548" y2="94" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#rh-msg-arrow)"></line>
  <text x="430" y="102" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">deflated text</text>
  <line x1="352" y1="194" x2="548" y2="246" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#rh-msg-arrow)"></line>
  <text x="430" y="238" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">text notice</text>
  <rect x="24" y="94" width="328" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="188" y="130" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">This connection</text>
  <text x="188" y="164" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">Read JSON frames</text>
  <text x="188" y="196" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">wss://turbo-&lt;metro&gt;.getoptimum.io/rh</text>
  <text x="188" y="218" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">each sequenceNumber once</text>
  <rect x="548" y="24" width="528" height="140" rx="20" fill="#B87CFF" fill-opacity="0.07" stroke="#B87CFF" stroke-width="2"></rect>
  <text x="812" y="64" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="#B87CFF" style="text-transform:uppercase">Sequencer payload</text>
  <text x="812" y="98" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">version: 1, messages[]</text>
  <text x="812" y="130" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.78">official Robinhood Chain sequencer JSON</text>
  <rect x="548" y="176" width="528" height="140" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="812" y="216" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">Lag notice</text>
  <text x="812" y="250" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">{"type": "lag", …}</text>
  <text x="812" y="282" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">sent when a slow client was skipped ahead</text>
</svg>

## Sequencer payload

Each feed update is a WebSocket **text** frame compressed on the wire with `permessage-deflate` (to about 40% of its raw size). Your WebSocket library inflates it automatically before handing you the JSON string. A decoder written for the official feed (`wss://feed.mainnet.chain.robinhood.com`) works unchanged.

Live example from `/rh`:

```json
{
  "version": 1,
  "messages": [
    {
      "sequenceNumber": 124102841,
      "message": {
        "message": {
          "header": {
            "kind": 3,
            "sender": "0xa4b000000000000000000073657175656e636572",
            "blockNumber": 26505223,
            "timestamp": 1795766614,
            "requestId": null,
            "baseFeeL1": 0
          },
          "l2Msg": "BAL4koISN4JF7IMPQkCEAnGcQIMPpjuU4DP0vT18z1N6L5VOzcjrEhjjt6aApLa1XyUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOKrMABoMysNb19BRUffmUai63F9l6TwrPKDIH9KXofCCQDP9OyoEqw+l+BOgbktNjNQfkS1PBKpuUC6uhhYWyjn9F/Hmo/"
        },
        "delayedMessagesRead": 472570
      },
      "blockHash": "0xfe11abd98bcd6d356820caceae9301cdcfcb0c9700916cf117f3de7f861420fd",
      "signatureV2": "/V1Bh619Y/70UAK6QnoUzGhEyPd2+z//SMr6b4fdxsFykYhMwVyzUjmXa+20yVs9XUXzk/2a58dFT7G5IzNTiwA=",
      "blockMetadata": null
    }
  ]
}
```

* `version` is `1`.
* `messages` holds one sequencer entry per frame, so each `sequenceNumber` arrives once.
* `sequenceNumber`, `blockNumber`, `timestamp`, `kind`, `baseFeeL1`, and `delayedMessagesRead` are integers.
* `sender`, `l2Msg`, `blockHash`, and `signatureV2` are strings. Treat `l2Msg` as an opaque base64-encoded string.
* `requestId` and `blockMetadata` can be `null`; allow `null` when decoding.
* This is the sequencer feed as published: it does not carry execution receipts, logs, status, or gas used.

## Lag notice

If your client falls too far behind the server's broadcast buffer, the endpoint skips your connection ahead to the newest message and sends an uncompressed JSON text notice in place of the missed ones:

```json
{"type":"lag","feed_id":0,"from_seq":10420,"to_seq":10485,"missed":65}
```

Check `msg.get("type") == "lag"` before reading `messages`. The `from_seq`, `to_seq`, and `missed` counters track the regional endpoint's own broadcast sequence numbers, not Robinhood Chain `sequenceNumber` values.

## Connection behavior

* **Compression required:** Clients must offer `permessage-deflate` and accept `server_no_context_takeover` with a 15-bit server window. Clients that do not are refused with **HTTP 400**.
* **Client writes ignored:** `/rh` is read-only; frames you write on the socket are ignored.
* **Reconnect codes:** A close with code **1001** means the server is draining or being replaced — reconnect automatically. A close with code **1008** means your key was rotated, revoked, or expired — check **Feeds → My feeds and keys** in [Console](https://console.getoptimum.xyz/).
* **Regional failover:** If one region returns **HTTP 503** or drops repeatedly, fail over to another metro (`nrt`, `cmh`, `iad`, `lhr`).
