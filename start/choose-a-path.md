---
title: Choose a path
description: Validators or stream-only, individual or entity.
---

# Choose a path

Two answers during registration decide what you see. **How do you take part?** is Individual or Entity. **Do you run validators?** is Yes or No.

Optimum does not host gateways. Every path below is a container you run on your own host.

## You run validators

The gateway runs beside the beacon node. You peer the consensus client, then register validator indices. Signal is the sidebar entry for that.

Accelerate is a later step, for entity accounts only. It needs active validators and enough proposed slots to measure. It is not part of connecting the gateway. See [Account type](/getting-in/account-type).

## You do not run validators

This is a supported account. The gateway takes blocks from the mesh and serves them to your own consumers. It does not peer a beacon node, and Console does not ask for validator indices.

The signup step gives you the stream-only command. On Signal, **Set up another gateway** then **1b** offers **Stream only**, and that is the command to copy. **Peer with my consensus client** is the beacon-node command. Starting a stream-only gateway with that one leaves `/health` failing the consensus-client checks. See the [stream-only command](/signal/connect-your-gateway#stream-only).

The container is started with `OPT_STREAM_ENABLE` and `OPT_STREAM_ONLY`. The libp2p port is not published. The feed, once healthy, is on the gateway host at `ws://127.0.0.1:9600` and gRPC `127.0.0.1:9601`. Both want a consumer token, minted under **Gateways & keys** → **Stream consumers**.
