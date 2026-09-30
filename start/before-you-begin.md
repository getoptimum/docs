---
title: Before you begin
description: What has to be true on the host before you paste the Console command.
---

# Before you begin

Have these before you create the enrollment key. The secret is shown once.

* A host with Docker, beside the beacon node. Stream-only can be any host you control.
* The ports in [Network](/signal/network) open as listed. Telemetry stays on loopback.
* A Console account. [Create one](/getting-in/create-an-account), or sign in if Optimum invited you.
* Persistent directories for the gateway identity: `$HOME/optimum-gateway/libp2p` and `$HOME/optimum-gateway/mump2p`. The container defaults are `/tmp/libp2p` and `/tmp/mump2p`, which do not survive a restart. A new identity means the peer id your client was given no longer exists.

::: warning
Do not start the container with `--network host`. That publishes telemetry, including the peer id and multiaddrs, on every interface. Console publishes `48123` to `127.0.0.1` only.
:::

On Fedora, RHEL, Rocky, and Alma, SELinux is enforcing by default. The identity mounts then fail with `write identity data: permission denied` after the log has already loaded JWKS, which looks like a rejected key. Console has **Add an SELinux relabel to the identity mounts** above the start command. Turn it on before you copy the command. See [When the check fails](/signal/when-the-check-fails).

One enrollment key covers every gateway you run. Each host enrols under its hostname (`OPT_GATEWAY_ID`). Two hosts that share a hostname: the second enrolment is refused with HTTP 409.
