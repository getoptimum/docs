---
title: What Optimum does
description: The gateway, Signal, and Accelerate, in the words Console uses.
---

# What Optimum does

You run one container, the Optimum gateway, on a host that can reach your beacon node. The gateway enrols with an enrollment key from Console, joins the mesh, and your consensus client peers it. That peering is **Signal**.

**Accelerate** is separate. It reads slots your validators already proposed and recommends a bid cutoff, so a proposal can take a better bid without waiting so long that the block is late. You apply that cutoff on the MEV sidecar you already run, MEV-Boost or Commit-Boost. Console does not change your infrastructure.

Both live in [Console](https://console.getoptimum.io/). This site is the runbook. Versioned gateway reference (install details, every setting, metrics) stays at [getoptimum.github.io/optimum-gateway](https://getoptimum.github.io/optimum-gateway/versions/latest/).

::: info
There is no Optimum-hosted multiaddr to point a client at. The client peers the gateway you started beside it. The peer id comes from that gateway.
:::
