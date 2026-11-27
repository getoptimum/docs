---
title: Client library and direct WebSocket
description: Consume Hyperliquid feeds in Go using client, wire, and book packages, or connect directly with any WebSocket library.
---

# Client library and direct WebSocket

To decode Hyperliquid feeds inside your own process without local multicast, use the Go library (`github.com/getoptimum/hyperliquid-feed`) or connect directly with any WebSocket client that supports `permessage-deflate`.

Each binary WebSocket message is a container holding one or more frames packed back to back. Each frame is prefixed by a 1-byte port and a 2-byte little-endian length.

<svg viewBox="0 0 1100 248" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A compressed binary WebSocket message unpacks into container entries of 1-byte port and 2-byte length, each followed by one binary frame of up to 1232 bytes" style="width:100%;height:auto;max-width:1100px;display:block;margin:1.5rem auto;">
  <defs>
    <marker id="hl-cont-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
      <path d="M0,0 L10,5 L0,10 L2.2,5 Z" fill="currentColor" fill-opacity="0.55"></path>
    </marker>
  </defs>
  <line x1="332" y1="124" x2="408" y2="124" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#hl-cont-arrow)"></line>
  <text x="370" y="108" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">inflate</text>
  <line x1="708" y1="124" x2="784" y2="124" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#hl-cont-arrow)"></line>
  <text x="746" y="108" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">split</text>
  <rect x="24" y="48" width="308" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="178" y="84" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">WebSocket message</text>
  <text x="178" y="118" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">Binary frame</text>
  <text x="178" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">permessage-deflate</text>
  <text x="178" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">text frame = lag notice</text>
  <rect x="408" y="48" width="300" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="558" y="84" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">Container entry</text>
  <text x="558" y="118" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">u8 port + u16 len</text>
  <text x="558" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">0 mkt · 1 ref · 2 snap</text>
  <text x="558" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">len 24..1232 (LE)</text>
  <rect x="784" y="40" width="292" height="168" rx="20" fill="#B87CFF" fill-opacity="0.07" stroke="#B87CFF" stroke-width="2"></rect>
  <text x="930" y="80" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="#B87CFF" style="text-transform:uppercase">Your handler</text>
  <text x="930" y="116" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">Decoded frames</text>
  <text x="930" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.78">24-byte header + msgs</text>
  <text x="930" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">0x4444 MBO · 0x445A TOB</text>
</svg>

## Go client library

`github.com/getoptimum/hyperliquid-feed` exports three packages:

* `client` — connects with `bearer.<key>` and `permessage-deflate`, reconnects with backoff, reorders out-of-order frames (`ReorderWait` 2 ms default), and drops duplicates.
* `wire` — parses containers, frames, and every message type, and formats scaled prices and quantities with `wire.Scale`.
* `book` — rebuilds order books from MBO snapshots and deltas and exposes aggregated price levels via `Instrument.Levels(depth)`.

```go
package main

import (
	"context"
	"log"
	"os"

	"github.com/getoptimum/hyperliquid-feed/book"
	"github.com/getoptimum/hyperliquid-feed/client"
	"github.com/getoptimum/hyperliquid-feed/wire"
)

func main() {
	key, err := client.ReadKeyFile(os.ExpandEnv("$HOME/.config/hlfeed.key"))
	if err != nil {
		log.Fatal(err)
	}
	url, err := client.Endpoint("cmh", "mbo")
	if err != nil {
		log.Fatal(err)
	}
	books := book.New(myListener{}) // implements book.Listener
	err = client.Subscribe(context.Background(), client.Options{
		URL: url,
		Key: key,
		OnFrame: func(port wire.Port, frame []byte) error {
			_ = books.Frame(port, frame) // malformed frame returns an error and is skipped
			return nil
		},
	})
	if err != nil {
		log.Fatal(err)
	}
}
```

### Key behaviors of `client.Subscribe`

* **Automatic reconnect:** Reconnects with exponential backoff on network drops, HTTP 503, or 5 seconds of silence.
* **Fatal handshake errors return immediately:** `ErrCompressionRequired` (HTTP 400), `ErrKeyRejected` (HTTP 401/403), `ErrNotSelected` (subprotocol stripped), and `ErrInvalidKey` do not loop.
* **Frame buffer lifetime:** The `frame` slice passed to `OnFrame` is only valid during the callback; copy it if you retain it across calls.
* **Reading consistent books:** Read `Instrument.Levels(depth)` inside `Listener.Boundary`, at the end of each Hyperliquid block, rather than mid-block.
* **Manual decoding:** Call `wire.ParseFrame` (MBO) or `wire.ParseFrameAs(wire.MagicTOB, frame)`, then iterate with `wire.NextMessage` and the `wire.Decode*` functions.

## Connecting with your own WebSocket client

You can connect from any language without installing the Go library:

1. Open a TLS WebSocket to `wss://turbo-<metro>.getoptimum.io/hl-mbo` or `/hl-tob`.
2. Offer `Sec-WebSocket-Protocol: bearer.<key>` and `permessage-deflate` with `server_no_context_takeover` (15-bit server window). Allow messages up to at least 1 MiB.
3. For each binary message, validate and split the 3-byte container header (`u8 port`, `u16 LE length`) across the entire payload before delivering any frame.
4. For each frame, parse the 24-byte little-endian header and walk its messages using [Wire format](/traders/hyperliquid/wire-format).

Minimal Python inspector (`pip install websockets`):

```python
import asyncio, os, struct, websockets

URL = "wss://turbo-cmh.getoptimum.io/hl-mbo"
KEY = open(os.path.expanduser("~/.config/hlfeed.key")).read().strip()
PORTS = {0: "mktdata", 1: "refdata", 2: "snapshot"}
MAGICS = {0x4444: "MBO", 0x445A: "TOB"}

async def main():
    async with websockets.connect(
        URL, subprotocols=[f"bearer.{KEY}"], max_size=1 << 20
    ) as ws:
        async for raw in ws:
            if isinstance(raw, str):
                print("lag notice:", raw)
                continue
            off = 0
            while off + 3 <= len(raw):
                port = raw[off]
                length = raw[off + 1] | (raw[off + 2] << 8)
                off += 3
                frame = raw[off : off + length]
                off += length
                magic, schema, channel, seq = struct.unpack_from("<HBBQ", frame, 0)
                print(PORTS.get(port, port), MAGICS.get(magic, hex(magic)), f"ch={channel} seq={seq} len={length}")

asyncio.run(main())
```

Typical output from a live MBO session:

```text
snapshot MBO ch=1 seq=272444249 len=1204
mktdata MBO ch=2 seq=106146577 len=1220
mktdata MBO ch=1 seq=130731372 len=1220
```

Decoded by `wire`, an `OrderAdd` or `Quote` yields fields matching the JSON schema in [Wire format](/traders/hyperliquid/wire-format):

```json
{"type":"add","channel":1,"symbol":"BTC","instrument_id":0,"seq":89415997,"order_id":617843541613,"side":"bid","price":"61825.0","qty":"0.00082","flags":1,"ts":1795766670388000000}
```
