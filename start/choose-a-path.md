---
title: Choose a path
description: Validators, stream-only, and what Console does not offer yet.
---

# Choose a path

Console asks **Do you run validators?** during registration. The answer changes the command and which steps you see.

## You run validators

The gateway runs beside the beacon node. You peer the consensus client, then register validator indices. Signal is the sidebar entry for that.

Accelerate is a later step. It needs registered keys and enough proposed slots to measure. It is not part of connecting the gateway.

## You do not run validators

This is a supported account. The gateway takes blocks from the mesh and serves them to your own consumers. It does not peer a beacon node, and Console does not ask for validator indices.

The container is started with `OPT_STREAM_ENABLE` and `OPT_STREAM_ONLY`. The libp2p port is not published. The feed, once healthy, is on the gateway host at `ws://127.0.0.1:9600` and gRPC `127.0.0.1:9601`. Both want a consumer token, minted under **Keys** → **Stream consumers** (invited operator accounts see that screen as **Manage gateways**).

## Obol and other distributed validator setups

The gateway still sits beside the beacon node those validators use. Charon and the validator client do not change.

For an Obol Charon Distributed Validator Node (CDVN), use the [Optimum Gateway overlay for Obol CDVN](https://getoptimum.github.io/optimum-hop/integration/obol/). It adds the gateway as an opt-in Docker Compose overlay on the `dvnode` network, dials the beacon node from the gateway side, and turns off by removing the overlay from `COMPOSE_FILE`.

::: warning
The overlay was written before Console enrolment. It uses an API key (`OPT_API_KEY=ogw_live_...`), pins `GATEWAY_VERSION=v1.1.1`, writes a mounted `app_conf.yml`, and its sample targets Hoodi. Console hands out an enrollment key (`OPT_JOIN_KEY`) and `v1.3.2`, run with `-config ""`. Ask [support](/help/support) which credential and version to use in the overlay before you mix the two.
:::

## A gateway Optimum hosts for you

::: warning TODO
Console only hands you a container to run yourself. Hosted gateways are not a screen in Console, so this site does not describe one.
:::
