---
title: Robinhood Chain quick start
description: Connect to the Robinhood Chain sequencer feed (/rh) with your Console feed key and print live sequencer messages.
---

# Robinhood Chain quick start

Open one compressed WebSocket to `/rh`, send your `ofk_` feed key from [Console](https://console.getoptimum.xyz/), and read JSON sequencer messages.

<svg viewBox="0 0 1100 248" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Read your ofk_ key from a mode-600 file, open a compressed WebSocket to wss://turbo-cmh.getoptimum.io/rh, and parse each JSON text frame" style="width:100%;height:auto;max-width:1100px;display:block;margin:1.5rem auto;">
  <defs>
    <marker id="rh-qs-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
      <path d="M0,0 L10,5 L0,10 L2.2,5 Z" fill="currentColor" fill-opacity="0.55"></path>
    </marker>
  </defs>
  <line x1="332" y1="124" x2="408" y2="124" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#rh-qs-arrow)"></line>
  <text x="370" y="108" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">connect</text>
  <line x1="708" y1="124" x2="784" y2="124" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#rh-qs-arrow)"></line>
  <text x="746" y="108" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">json.loads</text>
  <rect x="24" y="48" width="308" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="178" y="84" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">Key file</text>
  <text x="178" y="118" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">~/rh.key</text>
  <text x="178" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">mode 600, one line</text>
  <text x="178" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">copied from Console</text>
  <rect x="408" y="48" width="300" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="558" y="84" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">Regional endpoint</text>
  <text x="558" y="118" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">wss://…/rh</text>
  <text x="558" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">bearer.ofk_ subprotocol</text>
  <text x="558" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">permessage-deflate on</text>
  <rect x="784" y="40" width="292" height="168" rx="20" fill="#B87CFF" fill-opacity="0.07" stroke="#B87CFF" stroke-width="2"></rect>
  <text x="930" y="80" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="#B87CFF" style="text-transform:uppercase">Text frames</text>
  <text x="930" y="116" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">Payload or lag</text>
  <text x="930" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.78">version: 1, messages[]</text>
  <text x="930" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">or {"type":"lag",…}</text>
</svg>

## 1. Save your feed key

Ensure **Robinhood Chain — Sequencer feed** is active on your account under **Feeds → My feeds and keys** in [Console](https://console.getoptimum.xyz/) (see [Authentication](/traders/authentication)), then save the `ofk_` key to a mode-600 file:

```bash
install -m 600 /dev/null ~/rh.key
# Paste the ofk_ key from Console into ~/rh.key on one line
```

## 2. Connect and read frames

Pick the regional hostname closest to your host (`turbo-nrt`, `turbo-cmh`, `turbo-iad`, or `turbo-lhr` — see [Endpoints](/traders/endpoints)).

This Python example uses `websockets` (`pip install websockets`), which negotiates `permessage-deflate` automatically and inflates each compressed text frame:

```python
import asyncio
import json
import os
import websockets

URL = "wss://turbo-cmh.getoptimum.io/rh"
KEY = open(os.path.expanduser("~/rh.key")).read().strip()

async def main():
    async with websockets.connect(
        URL,
        subprotocols=[f"bearer.{KEY}"],
        max_size=None,
    ) as ws:
        print("selected:", ws.subprotocol is not None)
        async for raw in ws:
            msg = json.loads(raw)
            if msg.get("type") == "lag":
                print("skipped ahead:", msg)
                continue
            for entry in msg.get("messages", []):
                print(entry["sequenceNumber"], entry["blockHash"])

asyncio.run(main())
```

Swap `cmh` for `nrt`, `iad`, or `lhr` to connect to a different region.

## Example output

Within a second, sequence numbers begin counting up several times per second:

```text
selected: True
124102839 0xc69e263ceb4cfa0c69998dd2eeb6d2371cdad0333a76df28d19b7e78c963296b
124102840 0x9284bc77aa6ee2d124a86e63b395fcd8e93f407c7fb45350d0d188df20b313b2
124102841 0xfe11abd98bcd6d356820caceae9301cdcfcb0c9700916cf117f3de7f861420fd
```

Each raw text frame is one JSON object in the official sequencer format:

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

## Next steps

* [Messages](/traders/robinhood-chain/messages) explains every payload field, lag notices, and reconnect codes.
* [Troubleshoot](/traders/help/troubleshoot) covers HTTP 400/401/503 errors and close codes 1001 and 1008.
