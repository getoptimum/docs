---
title: When the check fails
description: The four failures Console names, and what actually fixes each one.
---

# When the check fails

A `503` from `/health` immediately after start, with `cl_peers` failing, is expected until the consensus client is peered. Read [Connect your gateway](/signal/connect-your-gateway) before treating that as a fault. The four cases below are the ones that stay broken.

## Gateway not reachable

Nothing is listening on `33212` (your client) or `33213` (the mesh).

```bash
docker ps
curl http://localhost:48123/health
```

Run the curl on the gateway host. From anywhere else, `48123` is refused even when the gateway is fine.

A stream-only gateway does not listen on `33212`. That is not this failure.

## Your client is not peering

The gateway is up and has mesh peers, and `cl_peers` is `0` in `/health`.

The client flag is missing or points somewhere else. Check it against the address you built from `/api/v1/self_info`. If it peered once and then stopped, the gateway restarted without `OPT_DIRECT_CL_PEERS`, so it has nothing to re-dial from. Prysm is the client that re-dials without that variable. The others need it. Lighthouse needs it to connect at all.

## The container exits on a permission error

The log ends on `write identity data: permission denied` after loading JWKS. That reads like a rejected key. It is the identity mounts.

Where SELinux is enforcing (Fedora, RHEL, Rocky, Alma, and derivatives), the container cannot write those directories until they are relabeled. Turn on **Add an SELinux relabel to the identity mounts** beside the start command in Console, and run the new command. The mounts gain a `:z` suffix.

## The peer id changed

The gateway generated a new identity because `$HOME/optimum-gateway/libp2p` and `mump2p` were not mounted. The address you gave the client no longer exists.

Read `/api/v1/self_info` again, update the client, and keep the two volume mounts in the command so the next restart keeps the same peer id.

## Replacing the container

```bash
docker rm -f optimum-gateway
```

Then run the Console command again. Restarting reuses the old environment. Running a second `docker run` with the same name fails before it replaces anything.
