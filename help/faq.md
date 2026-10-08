---
title: FAQ
description: Short answers that point back at the page with the steps.
---

# FAQ

## `/health` returns 503 right after the container starts

Expected if you run validators and the client is not peered yet. `cl_peers`, `cl_health`, and `subscribed_topics` fail until then. For whether the gateway reached Optimum, trust **Verify** on Signal rather than this status. [Connect your gateway](/signal/connect-your-gateway).

## `curl` to port 48123 from my laptop is refused

The port is published on `127.0.0.1` of the gateway host. Run it there. [Network](/signal/network).

## The peer id changed after a restart

The identity directories were not mounted. [When the check fails](/signal/when-the-check-fails).

## The second gateway was refused

`OPT_GATEWAY_ID` is the hostname, and it is unique per organisation. [Before you begin](/start/before-you-begin).

## I lost the enrollment key

It cannot be shown again. On Signal, create a one-day key into the command, or mint one on **Keys** → **Enrollment keys** (**Manage gateways** on an invited account). Gateways that already enrolled are not affected. [Why enrollment keys](/signal/what-signal-does#why-enrollment-keys).

## Which enrollment key should I use?

The one from signup lasts 14 days. The one from Signal lasts a day. For a fleet rolled out over weeks, mint one on **Enrollment keys** and set **Valid for (days)**. [Why enrollment keys](/signal/what-signal-does#why-enrollment-keys).

## I do not see Accelerate

Accelerate is for entity accounts. An individual account has Signal only. If you registered as an entity and the entry is missing, it is not enabled for your account yet: ask [support](/help/support). [What Accelerate does](/accelerate/what-accelerate-does).

## I do not see a performance report

Each report waits on something different: a running gateway, confirmed indices, or proposed slots. Each entry appears only when it is enabled for your account. [Your first report](/signal/your-first-report).

## Which region do I pick?

None. Console does not ask for a region. Run the gateway on a host that can reach your beacon node and can open the ports in [Network](/signal/network).

## Can Optimum run the gateway for me?

No. Optimum does not host gateways. You run the container. [Choose a path](/start/choose-a-path).
