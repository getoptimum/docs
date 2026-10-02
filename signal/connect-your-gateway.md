---
title: Connect your gateway
description: The production command Console shows, and how each consensus client is wired.
---

# Connect your gateway

This page covers **Run a gateway** and **Peer your client** on Signal, and the same commands in the signup step **Connect your first gateway**.

Copy the command from Console. If you just created the key, it is already in the command. Otherwise the command reads `$OPT_JOIN_KEY`, so export the key first. The command also carries the cluster id the key was minted for. The block below is the production shape, so you can read it. If Console shows a different `OPT_GATEWAY_CLUSTER_ID`, use that one. A mismatch authenticates and then fails every mesh handshake.

The image Console hands out for production is `v1.3.2`. `-config ""` is required. The flag defaults to `config/app_conf.yml`, which is not in the image, and the process exits before it reads any environment variable.

Do not add `OPT_CHAIN_ID`. This release does not read it. The chain comes from the enrollment key.

Set `OPT_REMOTE_BOOTSTRAP_URL` whenever you set `OPT_REMOTE_AUTH_URL`. The bootstrap URL otherwise defaults to production, so an auth URL pointed at another environment enrols in one place and peers in another.

Both telemetry variables are required. `OPT_ENABLE_TELEMETRY` without `OPT_REMOTE_PUSH_ENABLE` builds a local registry and does not push. `OPT_REMOTE_PUSH_ENABLE` without telemetry is refused at startup. `/health` answers either way, but two of its checks stay empty until telemetry is enabled.

## Validator gateway

```bash
mkdir -p "$HOME/optimum-gateway/libp2p" "$HOME/optimum-gateway/mump2p" && \
docker run -d --name optimum-gateway \
  -p 33212:33212/tcp \
  -p 33213:33213/tcp \
  -p 127.0.0.1:48123:48123/tcp \
  -e OPT_JOIN_KEY="$OPT_JOIN_KEY" \
  -e OPT_REMOTE_AUTH_URL=https://auth.getoptimum.io \
  -e OPT_REMOTE_BOOTSTRAP_URL=https://bootstrap.getoptimum.io \
  -e OPT_GATEWAY_CLUSTER_ID=optimum_ethereum_mainnet_v0_1 \
  -e OPT_GATEWAY_ID=$(hostname) \
  -e OPT_ENABLE_TELEMETRY=true \
  -e OPT_REMOTE_PUSH_ENABLE=true \
  -v "$HOME/optimum-gateway/libp2p":/tmp/libp2p \
  -v "$HOME/optimum-gateway/mump2p":/tmp/mump2p \
  docker.io/getoptimum/gateway:v1.3.2 -config ""
```

On an SELinux host, add `:z` after each container path. That is what Console’s SELinux option does. `:z` is shared, so a second gateway on the same host can use its own subdirectory under the same parent.

```bash
-v "$HOME/optimum-gateway/libp2p":/tmp/libp2p:z \
-v "$HOME/optimum-gateway/mump2p":/tmp/mump2p:z \
```

## Stream-only

No beacon node, so `33212` is not published. `OPT_STREAM_ONLY` requires `OPT_STREAM_ENABLE`; the gateway will not start with only one of them.

```bash
mkdir -p "$HOME/optimum-gateway/libp2p" "$HOME/optimum-gateway/mump2p" && \
docker run -d --name optimum-gateway \
  -p 33213:33213/tcp \
  -p 127.0.0.1:48123:48123/tcp \
  -p 127.0.0.1:9600:9600/tcp \
  -p 127.0.0.1:9601:9601/tcp \
  -e OPT_JOIN_KEY="$OPT_JOIN_KEY" \
  -e OPT_REMOTE_AUTH_URL=https://auth.getoptimum.io \
  -e OPT_REMOTE_BOOTSTRAP_URL=https://bootstrap.getoptimum.io \
  -e OPT_GATEWAY_CLUSTER_ID=optimum_ethereum_mainnet_v0_1 \
  -e OPT_GATEWAY_ID=$(hostname) \
  -e OPT_ENABLE_TELEMETRY=true \
  -e OPT_REMOTE_PUSH_ENABLE=true \
  -e OPT_STREAM_ENABLE=true \
  -e OPT_STREAM_ONLY=true \
  -e OPT_STREAM_ADDR=0.0.0.0:9600 \
  -e OPT_STREAM_GRPC_ADDR=0.0.0.0:9601 \
  -v "$HOME/optimum-gateway/libp2p":/tmp/libp2p \
  -v "$HOME/optimum-gateway/mump2p":/tmp/mump2p \
  docker.io/getoptimum/gateway:v1.3.2 -config ""
```

Changing any `-e` means replacing the container, not restarting it. A restart keeps the old environment. Re-running without removing it fails because the name is taken.

```bash
docker rm -f optimum-gateway
```

Then run the command again. The identity volumes are what keep the peer id.

## Check it is healthy

On the gateway host:

```bash
curl http://localhost:48123/health
```

A healthy gateway answers `200` with `"status": "healthy"`. Anything else answers `503`, with `"status": "degraded"` and a `failing` list.

For a stream-only gateway, give it a moment: the mesh checks do not pass until the first block arrives. `cl_peers`, `cl_health`, and `subscribed_topics` are skipped, not failed, so having no consensus client does not by itself make this degraded.

If you run validators, expect `503` until the client is peered. The mesh checks clear once the first block arrives. `cl_peers`, `cl_health`, and `subscribed_topics` stay failing until the client step below is done. That `503` is the check working.

## Connect your validators

Pick the client in Console. Four clients dial the gateway. Lighthouse is wired the other way: the gateway dials the node.

![Signal, Peer your client. Prysm, Lighthouse, Teku, Nimbus, and Lodestar are marked.](/console/04-signal-peer-client.png)

### Prysm, Teku, Nimbus, Lodestar

On the gateway host:

```bash
curl -s http://localhost:48123/api/v1/self_info
```

Take `peer_id` from the reply. Build the address yourself:

```text
/ip4/<host>/tcp/33212/p2p/<peer id>
```

`<host>` is an address your consensus client can reach this machine on. Do not take the first entry of `libp2p.multiaddrs`. That list mixes the container’s private addresses, which change when the container is recreated, with the host’s public address. The first entry is often a container address your client cannot use.

Add this on the beacon node. `<gateway ip>` is that reachable host, and `<gateway peer id>` is `peer_id`.

| Client | Flag | Also |
| --- | --- | --- |
| Prysm | `--peer=/ip4/<gateway ip>/tcp/33212/p2p/<gateway peer id>` | Prysm v7.1.8 or later. Do not set `OPT_DIRECT_CL_PEERS`. Prysm re-dials on its own. There is no `--p2p-static-peers`. |
| Teku | `--p2p-direct-peers=/ip4/<gateway ip>/tcp/33212/p2p/<gateway peer id>` | Set `--p2p-static-peers` to the same address. Static alone gets pruned. Teku v26.6.0 or later (minimum v26.4.0). |
| Nimbus | `--direct-peer=/ip4/<gateway ip>/tcp/33212/p2p/<gateway peer id>` | Use a stable `--netkey-file`, not a random key. Nimbus requires one for a direct peer. |
| Lodestar | `--directPeers=/ip4/<gateway ip>/tcp/33212/p2p/<gateway peer id>` | Not `--bootnodes`. That is discovery. `--directPeers` is the mesh peer that is kept. |

Teku, Nimbus, and Lodestar also need the gateway to be told about the node, or the link does not come back after the gateway restarts. The peering itself forms without that variable: the gateway marks a client that connects as a direct peer. It does not remember that peer across its own restart, and these clients may not re-dial. Add this to the start command, then replace the container:

```bash
-e OPT_DIRECT_CL_PEERS=/ip4/<your node ip>/tcp/<its p2p port>/p2p/<its peer id>
```

Use an address the gateway can reach. `127.0.0.1` from inside the container is the container.

::: warning
Once `OPT_DIRECT_CL_PEERS` is set, port `33212` is an allowlist. Any consensus client that is not named is disconnected. Name every client that should reach this gateway.
:::

### Lighthouse

Lighthouse has no single flag for this. Wire it on the gateway. The lookup runs on the Lighthouse host, and Lighthouse does not enable HTTP unless you pass `--http`:

```bash
curl -s http://localhost:5052/eth/v1/node/identity
```

Read `data.p2p_addresses`. Pick an address the gateway can reach, not the first entry. The first is often `127.0.0.1`.

```bash
-e OPT_DIRECT_CL_PEERS=/ip4/<your node ip>/tcp/<its p2p port>/p2p/<its peer id>
```

Add that to the start command and replace the container. For Lighthouse this variable is the connection, not only the restart case: nothing on the node points at the gateway, so the gateway is the side that dials. The allowlist warning above applies.

Lighthouse v8 needs extra PeerDAS flags. Those are in the [gateway quick start](https://getoptimum.github.io/optimum-gateway/versions/latest/quick-start), not on this page.

`--libp2p-addresses` is deprecated in favour of `--boot-nodes`, and `--trusted-peers` takes a peer id. Console does not use that pair. Use `OPT_DIRECT_CL_PEERS` as above.
