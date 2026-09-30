---
title: Network
description: The ports Console publishes, and where the rest of the requirements live.
---

# Network

Console publishes three ports. The full host requirements, including outbound access, are in the [gateway network requirements](https://getoptimum.github.io/optimum-gateway/versions/latest/network-requirements).

| Port | Published | What it is |
| --- | --- | --- |
| `33212/tcp` | All interfaces, validator gateways only | What the consensus client dials. Not published for a stream-only gateway: that process does not listen on it. |
| `33213/tcp` | All interfaces | The mesh. |
| `48123/tcp` | `127.0.0.1` only | `/health`, `/metrics`, and `/api/v1/self_info`. |

`/health` from any machine other than the gateway host is refused. That is the bind, not a failed gateway.

Stream-only also publishes the consumer feed to loopback on the gateway host: WebSocket `9600` and gRPC `9601`. Inside the container those listeners bind `0.0.0.0` so the published ports can reach them. They are not published on the host’s other interfaces. A consumer token is required; `stream_require_auth` defaults on.

Outbound, the gateway needs to reach Console’s auth and bootstrap endpoints (`auth.getoptimum.io` and `bootstrap.getoptimum.io` on the production command) and the mesh peers. Use the gateway network page for the firewall list rather than opening ports this page does not name.

::: warning
Leave `48123` on loopback. It answers with this gateway’s peer id and multiaddrs.
:::
