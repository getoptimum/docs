---
title: Hyperliquid wire format
description: Binary container, 24-byte frame header, message layouts, timing, scaling, order-book rebuild rules, and hlfeed JSON output schema.
---

# Hyperliquid wire format

This reference documents the binary wire format served on `/hl-mbo` (v3.4.0) and `/hl-tob` (v3.3.0), the rules for rebuilding consistent order books, and the JSON lines emitted by `hlfeed`.

All binary integers are little-endian. Signed fields are two's complement. Every message has a fixed layout.

<svg viewBox="0 0 1100 248" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Each frame begins with a 24-byte header containing magic (0x4444 for MBO or 0x445A for TOB), schema version 3, channel, sequence, send timestamp, message count, reset count, and length, followed by one or more messages each starting with a 4-byte header" style="width:100%;height:auto;max-width:1100px;display:block;margin:1.5rem auto;">
  <defs>
    <marker id="hl-wire-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
      <path d="M0,0 L10,5 L0,10 L2.2,5 Z" fill="currentColor" fill-opacity="0.55"></path>
    </marker>
  </defs>
  <line x1="332" y1="124" x2="408" y2="124" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#hl-wire-arrow)"></line>
  <text x="370" y="108" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">24 B</text>
  <line x1="708" y1="124" x2="784" y2="124" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#hl-wire-arrow)"></line>
  <text x="746" y="108" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">4 B + body</text>
  <rect x="24" y="48" width="308" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="178" y="84" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">Frame · max 1232 B</text>
  <text x="178" y="118" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">Frame header</text>
  <text x="178" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">0x4444 MBO · 0x445A TOB</text>
  <text x="178" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">schema 3 · ch · seq · ts</text>
  <rect x="408" y="48" width="300" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="558" y="84" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">Message header</text>
  <text x="558" y="118" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">Type · Len · Flags</text>
  <text x="558" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">walk frame by Len</text>
  <text x="558" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">skip unknown types</text>
  <rect x="784" y="40" width="292" height="168" rx="20" fill="#B87CFF" fill-opacity="0.07" stroke="#B87CFF" stroke-width="2"></rect>
  <text x="930" y="80" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="#B87CFF" style="text-transform:uppercase">Message body</text>
  <text x="930" y="116" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">Fixed layout</text>
  <text x="930" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.78">little-endian integers</text>
  <text x="930" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">scaled by exponents</text>
</svg>

## 1. WebSocket container

On `/hl-mbo` and `/hl-tob`, every data message is a compressed binary WebSocket message (up to about 60 KB; configure your client for at least 1 MiB). A text message is a JSON lag notice (`{"type":"lag",…}`) indicating the server skipped a slow client ahead and missed frames are lost.

Each binary message contains one or more frames packed back to back:

```text
repeat until the end of the message:
  u8   port     0 = mktdata, 1 = refdata, 2 = snapshot
  u16  length   length of the frame that follows, 24 to 1232 (little-endian)
  [length]      one frame (header included)
```

Validate the entire container before processing any frame. If a port is greater than `2`, a length is outside `24..1232`, or an entry extends past the end of the message, discard the whole message.

| Port | Value | Carries |
| --- | --- | --- |
| `mktdata` | `0` | Order events, trades, quotes, batch boundaries, instrument resets, heartbeats, end of session |
| `refdata` | `1` | Instrument definitions and manifest summaries |
| `snapshot` | `2` | Order book snapshots (MBO only) |

## 2. Frame header (24 bytes)

| Offset | Size | Type | Field | Notes |
| --- | --- | --- | --- | --- |
| 0 | 2 | `u16` | Magic | `0x4444` MBO (`44 44`), `0x445A` TOB (`5A 44`) |
| 2 | 1 | `u8` | Schema Version | `3` |
| 3 | 1 | `u8` | Channel ID | `1` native Hyperliquid perps, `2` `trade.xyz` perps |
| 4 | 8 | `u64` | Sequence Number | Per `(channel, port)`, starts at 0 |
| 12 | 8 | `u64` | Send Timestamp | Nanoseconds since Unix epoch (publisher clock in Tokyo) |
| 20 | 1 | `u8` | Message Count | `1` to `255` |
| 21 | 1 | `u8` | Reset Count | Increments when publisher restarts or resets session |
| 22 | 2 | `u16` | Frame Length | Total frame length in bytes, header included (max 1,232) |

Reject any frame whose magic does not match the feed, whose Schema Version is not `3`, or whose Frame Length does not equal the container entry length.

## 3. Message header and types

Every message inside a frame starts with a 4-byte header:

| Offset | Size | Type | Field | Notes |
| --- | --- | --- | --- | --- |
| 0 | 1 | `u8` | Message Type | See table below |
| 1 | 1 | `u8` | Message Length | Total message size in bytes, header included |
| 2 | 2 | `u16` | Flags | Bit 0 marks a snapshot message; other bits reserved |

Always advance by `Message Length`:

* Skip any message type you do not recognize using its `Message Length`.
* Allow messages longer than the documented layout (later revisions may append fields); read known fields and ignore trailing bytes.
* Stop walking the frame if `Message Length < 4` or extends past the end of the frame.

Text fields (`char[N]`) are UTF-8 padded with NUL bytes; text ends at the first NUL. Reserved bytes are `0` and must be ignored.

| Type | Message | Bytes | Port | MBO | TOB |
| --- | --- | --- | --- | --- | --- |
| `0x01` | `Heartbeat` | 16 | `mktdata` | yes | yes |
| `0x02` | `InstrumentDefinition` | 130 | `refdata` | yes | yes |
| `0x03` | `Quote` | 60 | `mktdata` | | yes |
| `0x04` | `Trade` | 52 | `mktdata` | yes | yes |
| `0x06` | `EndOfSession` | 12 | `mktdata` | yes | yes |
| `0x07` | `ManifestSummary` | 24 | `refdata` | yes | yes |
| `0x10` | `OrderAdd` | 52 | `mktdata` | yes | |
| `0x11` | `OrderCancel` | 32 | `mktdata` | yes | |
| `0x12` | `OrderExecute` | 56 | `mktdata` | yes | |
| `0x13` | `BatchBoundary` | 16 | `mktdata` | yes | |
| `0x14` | `InstrumentReset` | 28 | `mktdata` | yes | |
| `0x20` | `SnapshotBegin` | 36 | `snapshot` | yes | |
| `0x21` | `SnapshotOrder` | 44 | `snapshot` | yes | |
| `0x22` | `SnapshotEnd` | 20 | `snapshot` | yes | |

### Prices, quantities, and exponents

Prices and quantities are scaled integers: real price = `Price × 10^(Price Exponent)` and real quantity = `Quantity × 10^(Qty Exponent)`. For example, BTC has `Price Exponent = -1` and `Qty Exponent = -5`, so raw price `618250` is `61825.0` and raw quantity `82` is `0.00082`.

* `Qty Exponent` is `-szDecimals`.
* `Price Exponent` is `-(6 - szDecimals)` (Hyperliquid's maximum perpetual price precision).
* `Tick Size` and `Lot Size` are `1` in those units. Hyperliquid's significant-figure price rule is not encoded.

### Message layouts

All offsets below include the 4-byte message header.

**`Heartbeat` (`0x01`, 16 bytes):**

| Offset | Size | Type | Field |
| --- | --- | --- | --- |
| 4 | 1 | `u8` | Channel ID |
| 5 | 3 | | reserved |
| 8 | 8 | `u64` | Timestamp |

**`InstrumentDefinition` (`0x02`, 130 bytes):**

| Offset | Size | Type | Field | Notes |
| --- | --- | --- | --- | --- |
| 4 | 4 | `u32` | Instrument ID | Asset index within its DEX (`meta` universe); unique per channel |
| 8 | 2 | `u16` | Source ID | `1` native, `7` `trade.xyz` |
| 10 | 64 | `char[64]` | Symbol | Coin name, e.g., `BTC`, `xyz:TSLA` |
| 74 | 8 | `char[8]` | Leg 1 | Base coin without `xyz:` prefix |
| 82 | 8 | `char[8]` | Leg 2 | Quote (`USDC`) |
| 90 | 1 | `u8` | Asset Class | `5` (Perpetual Future) |
| 91 | 1 | `i8` | Price Exponent | |
| 92 | 1 | `i8` | Qty Exponent | |
| 93 | 1 | `u8` | Market Model | `1` (CLOB) |
| 94 | 8 | `i64` | Tick Size | `1` (in price units) |
| 102 | 8 | `u64` | Lot Size | `1` (in quantity units) |
| 110 | 8 | `u64` | Contract Value | `0` |
| 118 | 8 | `u64` | Expiry | `0` |
| 126 | 1 | `u8` | Settle Type | `1` (Cash) |
| 127 | 1 | `u8` | Price Bound | `2` (non-negative) |
| 128 | 2 | `u16` | Manifest Seq | Current manifest sequence |

**`Quote` (`0x03`, 60 bytes, TOB):**

| Offset | Size | Type | Field | Notes |
| --- | --- | --- | --- | --- |
| 4 | 4 | `u32` | Instrument ID | |
| 8 | 2 | `u16` | Source ID | |
| 10 | 1 | `u8` | Update Flags | Bit 0 bid updated, bit 1 ask updated, bit 2 bid gone, bit 3 ask gone |
| 11 | 1 | | reserved | |
| 12 | 8 | `u64` | Source Timestamp | Hyperliquid block time (ns) |
| 20 | 8 | `i64` | Bid Price | `0` when bid is gone |
| 28 | 8 | `u64` | Bid Quantity | `0` when bid is gone |
| 36 | 8 | `i64` | Ask Price | `0` when ask is gone |
| 44 | 8 | `u64` | Ask Quantity | `0` when ask is gone |
| 52 | 2 | `u16` | Bid Source Count | Resting orders at best bid |
| 54 | 2 | `u16` | Ask Source Count | Resting orders at best ask |
| 56 | 4 | `u32` | Venue Update ID | Always `0`; order quotes by Source Timestamp |

**`Trade` (`0x04`, 52 bytes):**

| Offset | Size | Type | Field | Notes |
| --- | --- | --- | --- | --- |
| 4 | 4 | `u32` | Instrument ID | |
| 8 | 2 | `u16` | Source ID | |
| 10 | 1 | `u8` | Aggressor Side | `0` unknown, `1` buy, `2` sell |
| 11 | 1 | `u8` | Trade Flags | `0` |
| 12 | 8 | `u64` | Source Timestamp | Fill time (ns) |
| 20 | 8 | `i64` | Trade Price | |
| 28 | 8 | `u64` | Trade Quantity | |
| 36 | 8 | `u64` | Trade ID | Hyperliquid `tid` |
| 44 | 8 | `u64` | Cumulative Volume | `0` |

**`EndOfSession` (`0x06`, 12 bytes):** `u64 Timestamp` at offset 4. No more data on this channel until `Reset Count` changes.

**`ManifestSummary` (`0x07`, 24 bytes):**

| Offset | Size | Type | Field | Notes |
| --- | --- | --- | --- | --- |
| 4 | 1 | `u8` | Channel ID | |
| 5 | 1 | `u8` | Valid | `1` valid, `0` not yet known or shutting down |
| 6 | 2 | | reserved | |
| 8 | 2 | `u16` | Manifest Seq | Advances when the instrument set changes |
| 10 | 2 | | reserved | |
| 12 | 4 | `u32` | Instrument Count | |
| 16 | 8 | `u64` | Timestamp | |

**`OrderAdd` (`0x10`, 52 bytes, MBO):**

| Offset | Size | Type | Field | Notes |
| --- | --- | --- | --- | --- |
| 4 | 4 | `u32` | Instrument ID | |
| 8 | 2 | `u16` | Source ID | |
| 10 | 1 | `u8` | Side | `0` bid, `1` ask |
| 11 | 1 | `u8` | Order Flags | Bit 0 post-only, 1 reduce-only, 2 hidden, 3 stop (triggered), 4 TWAP child |
| 12 | 4 | `u32` | Per-Instrument Seq | Consecutive per instrument across frames |
| 16 | 8 | `u64` | Order ID | Hyperliquid `oid` |
| 24 | 8 | `u64` | Enter Timestamp | |
| 32 | 8 | `i64` | Price | |
| 40 | 8 | `u64` | Quantity | |
| 48 | 4 | | reserved | |

**`OrderCancel` (`0x11`, 32 bytes, MBO):**

| Offset | Size | Type | Field | Notes |
| --- | --- | --- | --- | --- |
| 4 | 4 | `u32` | Instrument ID | |
| 8 | 2 | `u16` | Source ID | |
| 10 | 1 | `u8` | Reason | `0` unknown, `1` user, `2` venue expiry, `3` self-trade, `4` margin, `5` risk limit, `6` sibling filled, `255` other |
| 11 | 1 | | reserved | |
| 12 | 4 | `u32` | Per-Instrument Seq | |
| 16 | 8 | `u64` | Order ID | |
| 24 | 8 | `u64` | Timestamp | |

**`OrderExecute` (`0x12`, 56 bytes, MBO):**

| Offset | Size | Type | Field | Notes |
| --- | --- | --- | --- | --- |
| 4 | 4 | `u32` | Instrument ID | |
| 8 | 2 | `u16` | Source ID | |
| 10 | 1 | `u8` | Aggressor Side | `0` unknown, `1` buy, `2` sell |
| 11 | 1 | `u8` | Exec Flags | Bit 0 full fill (order removed), bit 1 self-match |
| 12 | 4 | `u32` | Per-Instrument Seq | |
| 16 | 8 | `u64` | Order ID | Maker's resting order |
| 24 | 8 | `u64` | Trade ID | `0` when unknown |
| 32 | 8 | `u64` | Timestamp | |
| 40 | 8 | `i64` | Exec Price | |
| 48 | 8 | `u64` | Exec Quantity | |

**`BatchBoundary` (`0x13`, 16 bytes, MBO):** `u32 Batch ID` (low 32 bits of Hyperliquid block height) at offset 4; `u64 Batch Time` (ns) at offset 8. Books are consistent after each `BatchBoundary`.

**`InstrumentReset` (`0x14`, 28 bytes, MBO):**

| Offset | Size | Type | Field | Notes |
| --- | --- | --- | --- | --- |
| 4 | 4 | `u32` | Instrument ID | |
| 8 | 1 | `u8` | Reason | `0` unspecified, `1` publisher inconsistency, `2` venue resync, `3` upstream gap, `255` other |
| 9 | 3 | | reserved | |
| 12 | 8 | `u64` | New Anchor Seq | `mktdata` Sequence Number; rebuild from snapshot at or after this |
| 20 | 8 | `u64` | Timestamp | |

**`SnapshotBegin` (`0x20`, 36 bytes, MBO snapshot port):**

| Offset | Size | Type | Field | Notes |
| --- | --- | --- | --- | --- |
| 4 | 4 | `u32` | Instrument ID | |
| 8 | 8 | `u64` | Anchor Seq | Last `mktdata` frame included in snapshot |
| 16 | 4 | `u32` | Total Orders | Number of `SnapshotOrder` messages that follow |
| 20 | 4 | `u32` | Snapshot ID | |
| 24 | 4 | `u32` | Last Instrument Seq | Last `Per-Instrument Seq` included |
| 28 | 8 | `u64` | Timestamp | |

**`SnapshotOrder` (`0x21`, 44 bytes, MBO snapshot port):** `u32 Snapshot ID` (4), `u64 Order ID` (8), `u8 Side` (16), `u8 Order Flags` (17), reserved (18–19), `u64 Enter Timestamp` (20), `i64 Price` (28), `u64 Quantity` (36).

**`SnapshotEnd` (`0x22`, 20 bytes, MBO snapshot port):** `u32 Instrument ID` (4), `u64 Anchor Seq` (8), `u32 Snapshot ID` (16).

## 4. Timing

| Event | Cadence |
| --- | --- |
| Market data | After each Hyperliquid block, as soon as the node has the whole block |
| `Heartbeat` | On `mktdata`, after 1 second without other `mktdata` |
| `ManifestSummary` | Every second on `refdata` |
| `InstrumentDefinition` | Every instrument, every 30 seconds on `refdata` |
| MBO snapshot cycle | Every instrument, every 15 seconds on `snapshot` |
| TOB `Quote` refresh | Every instrument, at least every 15 seconds on `mktdata` |
| `EndOfSession` | When the publisher stops cleanly |

## 5. Behavior and order-book rebuild rules

* **Sequence numbers and reordering:** `Sequence Number` counts frames per `(channel, port)` starting from `0`. Drop duplicates (`<=` last seen). Because regional servers arbitrate across multiple nodes, a frame can briefly overtake the previous one; hold it for a few milliseconds (2 ms in `hlfeed` and `tn-edge-recv`) before treating missing sequence numbers as a gap.
* **Session resets:** `Reset Count` changes whenever the publisher restarts. On a change, discard that channel's books, sequence numbers, and open snapshots, and rebuild from the snapshot port (instrument definitions stay valid). Ignore stragglers from an older `Reset Count`.
* **In-place size changes:** Emitted as `OrderCancel` (reason `0`) followed by `OrderAdd` with the same `Order ID` and new quantity.
* **Trades and executions (MBO):** A `Trade` arrives immediately before the first `OrderExecute` with the same `Trade ID`.
* **Unrepresentable prices:** If a best price temporarily cannot be expressed at the instrument's current exponents (for example, right after Hyperliquid changes a coin's size decimals), TOB marks that side as gone until the next `InstrumentDefinition` updates the exponents.
* **Rebuilding MBO books:**
    1. Buffer `OrderAdd`, `OrderCancel`, and `OrderExecute` deltas (along with their frame `Sequence Number`) while an instrument is awaiting a snapshot.
    2. Accept a snapshot only when `SnapshotBegin`, exact `Total Orders` of `SnapshotOrder` with matching `Snapshot ID`, and `SnapshotEnd` all arrive with no lost snapshot-port frames and with `Anchor Seq` at or above the instrument's minimum anchor.
    3. Load the snapshot's orders, set the last applied `Per-Instrument Seq` to `Last Instrument Seq`, and replay buffered deltas whose frame `Sequence Number > Anchor Seq` and `Per-Instrument Seq > Last Instrument Seq` consecutively.
    4. On any lost `mktdata` frame, `Per-Instrument Seq` hole, or `InstrumentReset`, clear affected books and wait for a fresh snapshot anchored at or after the recovery sequence.
    5. Read aggregated book levels only at `BatchBoundary`.

## 6. `hlfeed` JSON lines reference

`hlfeed` writes one JSON object per line to `stdout`. Prices and quantities are exact decimal strings (parse as decimals, not floats). `order_id` and `trade_id` are unsigned 64-bit integers and can exceed `2^53` (use a 64-bit / `BigInt`-aware JSON parser).

Live examples from `/hl-mbo` and `/hl-tob`:

```json
{"type":"instrument","channel":1,"symbol":"BTC","instrument_id":0,"leg1":"BTC","leg2":"USDC","price_exponent":-1,"qty_exponent":-5,"tick_size":"0.1","lot_size":"0.00001"}
{"type":"add","channel":1,"symbol":"BTC","instrument_id":0,"seq":89415997,"order_id":617843541613,"side":"bid","price":"61825.0","qty":"0.00082","flags":1,"ts":1795766670388000000}
{"type":"cancel","channel":1,"symbol":"BTC","instrument_id":0,"seq":89416026,"order_id":617843526243,"reason":1,"ts":1795766670388587330}
{"type":"trade","channel":1,"symbol":"BTC","instrument_id":0,"trade_id":580851382306592,"price":"61826.0","qty":"0.08087","aggressor":"buy","ts":1795766670757000000}
{"type":"block","channel":1,"block":1236449051,"ts":1795766658001015192}
{"type":"quote","channel":1,"symbol":"BTC","instrument_id":0,"bid":{"price":"61826.0","qty":"5.67775","orders":25},"ask":{"price":"61827.0","qty":"4.64579","orders":25},"ts":1795766640300790162}
{"type":"status","channel":1,"symbol":"BTC","instrument_id":0,"status":"ready"}
{"type":"book","channel":1,"symbol":"BTC","instrument_id":0,"block":1236448393,"ts":1795766610393166865,"bids":[{"price":"61814.0","qty":"0.12955","orders":1},{"price":"61812.0","qty":"0.16178","orders":1},{"price":"61808.0","qty":"0.25223","orders":1}],"asks":[{"price":"61815.0","qty":"3.14458","orders":14},{"price":"61816.0","qty":"3.76925","orders":9},{"price":"61817.0","qty":"5.48907","orders":18}]}
```

Additional event types emitted by `hlfeed`:

* `execute` (MBO): `channel`, `symbol`, `instrument_id`, `seq`, `order_id`, `trade_id`, `price`, `qty`, `aggressor` (`"buy"`, `"sell"`, `"unknown"`), `full_fill` (`bool`), `ts`.
* `reset` (MBO): `channel`, `symbol`, `instrument_id`, `reason`, `ts`.
* `status` (`-mode book`): `"ready"` (book consistent), `"resync"` (rebuilding from next snapshot), or channel-wide `"channel_reset"` (no `symbol` or `instrument_id`).
