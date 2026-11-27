---
title: Multicast receiver (optional)
description: Optional Linux receiver (tn-edge-recv) that re-emits Hyperliquid WebSocket frames unmodified as local UDP multicast on tn0.
---

# Multicast receiver (optional)

::: info Optional integration path
You do **not** need this receiver to access the Hyperliquid feeds. Your `ofk_` key opens `/hl-mbo` and `/hl-tob` directly using [`hlfeed`](/traders/hyperliquid/quick-start) or the [client library](/traders/hyperliquid/client-library). Use `tn-edge-recv` only if your downstream consumers expect local UDP multicast datagrams on a Linux host.
:::

`tn-edge-recv` connects to `/hl-mbo`, `/hl-tob`, or both over compressed WebSockets, inflates each message, reorders out-of-order frames, drops duplicates, and re-emits every binary frame unmodified as UDP multicast on a local dummy interface (`tn0`).

<svg viewBox="0 0 1100 248" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Optional local multicast delivery: regional WebSocket feeds connect to tn-edge-recv on your Linux host, which inflates and re-emits unmodified frames as UDP multicast on tn0" style="width:100%;height:auto;max-width:1100px;display:block;margin:1.5rem auto;">
  <defs>
    <marker id="hl-mcast-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
      <path d="M0,0 L10,5 L0,10 L2.2,5 Z" fill="currentColor" fill-opacity="0.55"></path>
    </marker>
  </defs>
  <line x1="332" y1="124" x2="408" y2="124" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#hl-mcast-arrow)"></line>
  <text x="370" y="108" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">WSS deflate</text>
  <line x1="708" y1="124" x2="784" y2="124" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.25" marker-end="url(#hl-mcast-arrow)"></line>
  <text x="746" y="108" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.7" style="text-transform:uppercase">UDP mcast</text>
  <rect x="24" y="48" width="308" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="178" y="84" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">Regional endpoint</text>
  <text x="178" y="118" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">/hl-mbo &amp; /hl-tob</text>
  <text x="178" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">primary + failover metro</text>
  <text x="178" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">bearer.ofk_</text>
  <rect x="408" y="48" width="300" height="152" rx="20" fill="currentColor" fill-opacity="0.035" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.25"></rect>
  <text x="558" y="84" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="currentColor" fill-opacity="0.55" style="text-transform:uppercase">Optional · Linux host</text>
  <text x="558" y="118" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">tn-edge-recv</text>
  <text x="558" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.72">inflate, reorder, dedup</text>
  <text x="558" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">metrics 127.0.0.1:9311</text>
  <rect x="784" y="40" width="292" height="168" rx="20" fill="#B87CFF" fill-opacity="0.07" stroke="#B87CFF" stroke-width="2"></rect>
  <text x="930" y="80" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.1" fill="#B87CFF" style="text-transform:uppercase">Local interface · tn0</text>
  <text x="930" y="116" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.5" fill="currentColor">Multicast consumer</text>
  <text x="930" y="150" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.78">233.84.178.27–30</text>
  <text x="930" y="172" text-anchor="middle" font-family="Geist, ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="500" fill="currentColor" fill-opacity="0.55">unmodified binary frames</text>
</svg>

## 1. Get the receiver

Contact your Optimum representative for access to the `getoptimum/turbonet-hyperliquid` repository or for a prebuilt Linux binary of `tn-edge-recv` (built from commit `8d67830` or later) together with `scripts/tn0-setup.sh`.

If you build from source (requires Go 1.27.3 or later):

```bash
git clone https://github.com/getoptimum/turbonet-hyperliquid.git
cd turbonet-hyperliquid
make client
export PATH="$PWD/bin:$PATH"
```

Builds earlier than commit `8d67830` do not offer `permessage-deflate` compression and are refused by the endpoints with HTTP 400.

## 2. Create the `tn0` interface

Run `scripts/tn0-setup.sh` once as root on your Linux host:

```bash
sudo scripts/tn0-setup.sh
```

The script creates a dummy interface named `tn0` and replaces the host's routes for `233.84.178.0/24` and `239.84.179.0/24` with routes to `tn0`. The four Hyperliquid feeds use `233.84.178.0/24` only. Consumers that join without specifying an interface follow those routes, so check for conflicts with existing multicast traffic before running the script.

To remove the interface and routes later:

```bash
sudo scripts/tn0-setup.sh --remove
```

## 3. Start `tn-edge-recv`

Save your `ofk_` key from Console into a mode-600 file such as `~/hl.key`.

Market-by-order only (the default feeds):

```bash
tn-edge-recv -key-file ~/hl.key \
  -url wss://turbo-cmh.getoptimum.io/hl-mbo
```

Top-of-book only:

```bash
tn-edge-recv -feeds hyper-hl-tob,hyper-xyz-tob -key-file-tob ~/hl.key \
  -url-tob wss://turbo-cmh.getoptimum.io/hl-tob
```

Both feed groups in one process (pass the same key file twice when your account's key includes both feeds):

```bash
tn-edge-recv -feeds hyper-hl-mbo,hyper-xyz-mbo,hyper-hl-tob,hyper-xyz-tob \
  -key-file ~/hl.key -key-file-tob ~/hl.key \
  -url wss://turbo-cmh.getoptimum.io/hl-mbo \
  -url-tob wss://turbo-cmh.getoptimum.io/hl-tob
```

Replace `cmh` with your nearest metro (`nrt`, `cmh`, `iad`, or `lhr`). To configure cross-region failover, repeat `-url` or `-url-tob` with a second region (for example, `-url wss://turbo-iad.getoptimum.io/hl-mbo`). `tn-edge-recv` tries URLs in order and fails over after a dropped session or 5 seconds of silence. It holds out-of-order frames for up to 2 ms (`-reorder-wait`) so frames arrive on `tn0` in sequence order.

## 4. Consume and verify

Point your multicast consumer at the groups and ports listed on [The feeds](/traders/hyperliquid/), bound to `tn0`.

In another terminal on the same host, inspect the Prometheus metrics endpoint (`127.0.0.1:9311/metrics` by default; change with `-metrics` or set empty to disable):

```bash
curl -fsS http://127.0.0.1:9311/metrics | grep '^tnrecv_'
```

| Metric | What to watch |
| --- | --- |
| `tnrecv_connected{url}` | `1` for the active endpoint of each feed group you started |
| `tnrecv_last_message_age_seconds{feed}` | Seconds since the last message (`hl-mbo`, `hl-tob`); normally under 1 second, fails over at 5 |
| `tnrecv_frames_total`, `tnrecv_bytes_total` | Frames and bytes per feed and port; should increase continuously |
| `tnrecv_reconnects_total` | Reconnect and failover count |

Allow up to 30 seconds for instrument definitions and 15 seconds for a full MBO snapshot cycle or TOB quote refresh. If metrics increase but your consumer sees nothing, check that it joined the right multicast groups and ports on `tn0`.
