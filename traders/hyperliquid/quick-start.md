---
title: Hyperliquid quick start
description: Install the hlfeed CLI, connect with your feed key, and stream Hyperliquid market-by-order events, rebuilt order books, or top-of-book quotes as JSON lines.
---

# Hyperliquid quick start

The `hlfeed` command-line tool connects to `/hl-mbo` or `/hl-tob`, negotiates compression and authentication automatically, decodes the binary wire format, and writes one JSON object per line to `stdout` (logs go to `stderr`).

<svg viewBox="0 0 1100 248" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="hlfeed reads your mode-600 key file, opens a compressed WebSocket to the selected metro, and writes JSON lines for events or rebuilt order books to stdout" style="width:100%;height:auto;max-width:1100px;display:block;margin:1.5rem auto;">
  <defs>
    <marker id="hl-cli-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
      <path d="M0,0 L10,5 L0,10 L2.2,5 Z" fill="currentColor" fill-opacity="0.55"></path>
    </marker>
  </defs>
  <line x1="332" y1="124" x2="408" y2="124" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#hl-cli-arrow)"></line>
  <text x="370" y="108" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">-key-file</text>
  <line x1="708" y1="124" x2="784" y2="124" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#hl-cli-arrow)"></line>
  <text x="746" y="108" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">stdout</text>
  <rect x="24" y="48" width="308" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="178" y="84" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">Key file</text>
  <text x="178" y="118" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">~/.config/hlfeed.key</text>
  <text x="178" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">mode 600, one line</text>
  <text x="178" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">copied from Console</text>
  <rect x="408" y="48" width="300" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="558" y="84" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">CLI</text>
  <text x="558" y="118" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">hlfeed</text>
  <text x="558" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">deflate + reorder + decode</text>
  <text x="558" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">nrt · cmh · iad · lhr</text>
  <rect x="784" y="40" width="292" height="168" rx="20" fill="#B87CFF" fill-opacity="0.07" stroke="#B87CFF" stroke-width="2"></rect>
  <text x="930" y="80" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="#B87CFF" style="text-transform:uppercase">JSON lines</text>
  <text x="930" y="116" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">Events or books</text>
  <text x="930" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.78">events: add, cancel, trade, quote</text>
  <text x="930" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">book: top N bid &amp; ask levels</text>
</svg>

## 1. Save your feed key

Copy your `ofk_` key from **Feeds → My feeds and keys** in [Console](https://console.getoptimum.xyz/) (see [Authentication](/traders/authentication)) and save it in a mode-600 file:

```bash
install -m 600 /dev/null ~/.config/hlfeed.key
$EDITOR ~/.config/hlfeed.key   # paste the ofk_ key on one line
```

## 2. Install `hlfeed`

Requires Go 1.27.3 or later:

```bash
go install github.com/getoptimum/hyperliquid-feed/cmd/hlfeed@latest
```

## 3. Stream market-by-order events

Pick the metro nearest your host (`nrt`, `cmh`, `iad`, or `lhr`):

```bash
hlfeed -feed mbo -metro cmh -key-file ~/.config/hlfeed.key -symbols BTC,ETH
```

`stderr` logs connection status and tells you while `hlfeed` waits for instrument definitions (which repeat every 30 seconds):

```text
level=INFO msg=subscribing url=wss://turbo-cmh.getoptimum.io/hl-mbo mode=events
level=INFO msg=connected url=wss://turbo-cmh.getoptimum.io/hl-mbo
level=INFO msg="skipping messages until instrument definitions arrive (up to 30 s)"
```

On `stdout`, `block` lines arrive immediately; once definitions land, order events and trades stream as one JSON object per line:

```json
{"type":"block","channel":1,"block":1236449051,"ts":1795766658001015192}
{"type":"instrument","channel":1,"symbol":"BTC","instrument_id":0,"leg1":"BTC","leg2":"USDC","price_exponent":-1,"qty_exponent":-5,"tick_size":"0.1","lot_size":"0.00001"}
{"type":"add","channel":1,"symbol":"BTC","instrument_id":0,"seq":89415997,"order_id":617843541613,"side":"bid","price":"61825.0","qty":"0.00082","flags":1,"ts":1795766670388000000}
{"type":"cancel","channel":1,"symbol":"BTC","instrument_id":0,"seq":89416026,"order_id":617843526243,"reason":1,"ts":1795766670388587330}
{"type":"trade","channel":1,"symbol":"BTC","instrument_id":0,"trade_id":580851382306592,"price":"61826.0","qty":"0.08087","aggressor":"buy","ts":1795766670757000000}
```

## 4. Stream rebuilt order books

Use `-mode book` (MBO only) to rebuild full order books from snapshots and deltas and print the top `-depth` price levels per side after every block that changed the instrument:

```bash
hlfeed -feed mbo -metro cmh -key-file ~/.config/hlfeed.key -mode book -symbols BTC -depth 3
```

Allow up to 30 seconds for both the first snapshot (15-second cycle) and the instrument definition (30-second cycle). Once ready, `hlfeed` emits a `status` line followed by a `book` line on each changing block:

```json
{"type":"status","channel":1,"symbol":"BTC","instrument_id":0,"status":"ready"}
{"type":"book","channel":1,"symbol":"BTC","instrument_id":0,"block":1236448393,"ts":1795766610393166865,"bids":[{"price":"61814.0","qty":"0.12955","orders":1},{"price":"61812.0","qty":"0.16178","orders":1},{"price":"61808.0","qty":"0.25223","orders":1}],"asks":[{"price":"61815.0","qty":"3.14458","orders":14},{"price":"61816.0","qty":"3.76925","orders":9},{"price":"61817.0","qty":"5.48907","orders":18}]}
```

## 5. Stream top-of-book quotes

If your plan includes top of book (`/hl-tob`), switch `-feed` to `tob`:

```bash
hlfeed -feed tob -metro cmh -key-file ~/.config/hlfeed.key -symbols BTC
```

Example output once the instrument definition arrives:

```json
{"type":"instrument","channel":1,"symbol":"BTC","instrument_id":0,"leg1":"BTC","leg2":"USDC","price_exponent":-1,"qty_exponent":-5,"tick_size":"0.1","lot_size":"0.00001"}
{"type":"quote","channel":1,"symbol":"BTC","instrument_id":0,"bid":{"price":"61826.0","qty":"5.67775","orders":25},"ask":{"price":"61827.0","qty":"4.64579","orders":25},"ts":1795766640300790162}
{"type":"trade","channel":1,"symbol":"BTC","instrument_id":0,"trade_id":660144337127107,"price":"61829.0","qty":"0.02588","aggressor":"sell","ts":1795766640974000000}
```

## Flags reference

| Flag | Default | Description |
| --- | --- | --- |
| `-feed` | `mbo` | `mbo` (market-by-order) or `tob` (top-of-book) |
| `-metro` | *(required)* | Regional metro: `nrt`, `cmh`, `iad`, or `lhr` |
| `-key-file` | *(required)* | Path to a file containing your `ofk_` key on one line |
| `-mode` | `events` | `events` (every decoded message) or `book` (rebuilt books, MBO only) |
| `-depth` | `10` | Price levels per side in `-mode book` |
| `-symbols` | *(all)* | Comma-separated symbols to print, such as `BTC,ETH` or `xyz:TSLA` |

When you stop `hlfeed` with Ctrl-C, it prints a summary line to `stderr` with message, frame, malformed, notice, late-frame, and reconnect counts.

## Next steps

* [Client library](/traders/hyperliquid/client-library) shows how to consume frames in Go or from your own WebSocket client.
* [Wire format](/traders/hyperliquid/wire-format) documents every binary message layout and JSON line type.
* [Troubleshoot](/traders/help/troubleshoot) covers HTTP 400/401/503 errors and startup timing.
