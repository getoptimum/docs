---
title: FAQ
description: Short answers that point back at the page with the steps.
---

# FAQ

## `/health` returns 503 right after the container starts

Expected if you run validators and the client is not peered yet. `cl_peers`, `cl_health`, and `subscribed_topics` fail until then. [Connect your gateway](/signal/connect-your-gateway).

## `curl` to port 48123 from my laptop is refused

The port is published on `127.0.0.1` of the gateway host. Run it there. [Network](/signal/network).

## The peer id changed after a restart

The identity directories were not mounted. [When the check fails](/signal/when-the-check-fails).

## The second gateway was refused

`OPT_GATEWAY_ID` is the hostname, and it is unique per organisation. [Before you begin](/start/before-you-begin).

## I lost the enrollment key

It cannot be shown again. On Signal, create a one-day key into the command, or mint one on **Keys** → **Enrollment keys** (**Manage gateways** on an invited account). [What Signal does](/signal/what-signal-does).

## I do not see Accelerate

It is not enabled for this account. Self-serve accounts do not have the sidebar entry. [What Accelerate does](/accelerate/what-accelerate-does).

## I do not see a performance report

Each report waits on something different: a running gateway, confirmed indices, or proposed slots. Each entry appears only when it is enabled for your account. [Your first report](/signal/your-first-report).

## Which region do I pick?

::: warning TODO
Console does not ask. [Region](/getting-in/region).
:::

## Can Optimum run the gateway for me?

::: warning TODO
Not from Console. You run the container. [Choose a path](/start/choose-a-path).
:::
