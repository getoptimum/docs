# Understanding Key Parameters in OptimumP2P

OptimumP2P nodes can operate in **two distinct protocol modes**, configured via:

```sh
NODE_MODE=optimum    # RLNC-enhanced gossip
NODE_MODE=gossipsub  # Standard libp2p gossip
```

Each mode has its own parameter set, with some shared configurations.

We support **two protocol modes** to let developers and researchers compare **performance, reliability, and bandwidth trade-offs** in real-world scenarios — without changing the rest of their infrastructure.

## OptimumP2P (RLNC) Mode — `NODE_MODE=optimum`

OptimumP2P extends the gossip protocol with **Random Linear Network Coding**:

* Messages are split into **shards**
* Shards can be forwarded early once a threshold is reached
* Improves delivery resilience in lossy or high-latency environments

Example Docker service:

```yaml
p2pnode-1:
  image: 'getoptimum/p2pnode:latest'
  environment:
    - NODE_MODE=optimum
    - LOG_LEVEL=debug
    - CLUSTER_ID=p2pnode-1
    - OPTIMUM_PORT=7070
    - OPTIMUM_MAX_MSG_SIZE=1048576
    - OPTIMUM_MESH_TARGET=6
    - OPTIMUM_MESH_MIN=3
    - OPTIMUM_MESH_MAX=12
    - OPTIMUM_SHARD_FACTOR=4
    - OPTIMUM_SHARD_MULT=1.5
    - OPTIMUM_THRESHOLD=0.75
    - BOOTSTRAP_PEERS=/ip4/172.28.0.12/tcp/7070/p2p/${BOOTSTRAP_PEER_ID}
```

### Parameters

| Parameter              | Default       | Purpose                                        |
| ---------------------- | ------------- | ---------------------------------------------- |
| `OPTIMUM_PORT `        | 7070          | TCP port used for RLNC gossip.                 |
| `OPTIMUM_MAX_MSG_SIZE` | 1048576 (1MB) | Max allowed message size (full payload).       |
| `OPTIMUM_MESH_TARGET`  | 6             | Desired peers in mesh.                         |
| `OPTIMUM_MESH_MIN`     | 3             | Minimum peers before adding more.              |
| `OPTIMUM_MESH_MAX`     | 12            | Max peers before pruning.                      |
| `OPTIMUM_SHARD_FACTOR` | 4             | Number of shards per message.                  |
| `OPTIMUM_SHARD_MULT`   | 1.5           | Redundancy multiplier (extra shards).          |
| `OPTIMUM_THRESHOLD`    | 0.75          | Fraction of shards required to forward/decode. |
| `BOOTSTRAP_PEERS`      | (none)        | List of peer multiaddrs to connect at startup. |


## GossipSub Mode — `NODE_MODE=gossipsub`

GossipSub is the **standard libp2p pub/sub** protocol:

* Maintains topic-specific peer meshes
* Exchanges message availability metadata with non-mesh peers
* Widely used for blockchain gossip

Example Docker service:

```yaml
p2pnode-1:
  image: 'getoptimum/p2pnode:latest'
  environment:
    - NODE_MODE=gossipsub
    - LOG_LEVEL=debug
    - CLUSTER_ID=p2pnode-1
    - GOSSIPSUB_PORT=6060
    - GOSSIPSUB_MAX_MSG_SIZE=1048576
    - GOSSIPSUB_MESH_TARGET=6
    - GOSSIPSUB_MESH_MIN=4
    - GOSSIPSUB_MESH_MAX=12
    - BOOTSTRAP_PEERS=/ip4/172.28.0.12/tcp/6060/p2p/${BOOTSTRAP_PEER_ID}
```


### Parameters

| Parameter                | Default       | Purpose                                        |
| ------------------------ | ------------- | ---------------------------------------------- |
| `GOSSIPSUB_PORT`         | 6060          | TCP port for gossip pub/sub.                   |
| `GOSSIPSUB_MAX_MSG_SIZE` | 1048576 (1MB) | Max allowed message size.                      |
| `GOSSIPSUB_MESH_TARGET`  | 6             | Desired peers in mesh.                         |
| `GOSSIPSUB_MESH_MIN`     | 4             | Minimum peers before adding more.              |
| `GOSSIPSUB_MESH_MAX`     | 12            | Max peers before pruning.                      |
| `BOOTSTRAP_PEERS`        | (none)        | List of peer multiaddrs to connect at startup. |


You can refer to the [GossipSub parameter specification](https://github.com/libp2p/specs/blob/master/pubsub/gossipsub/gossipsub-v1.0.md#parameters) for a detailed explanation of the standard pub/sub settings.


### Shared Parameters (Both `optimum` and `gossipsub` mode)

| Parameter      | Default   | Purpose                                            |
| -------------- | --------- | -------------------------------------------------- |
| `LOG_LEVEL`    | debug     | Log verbosity (debug, info, warn, error).          |
| `CLUSTER_ID`   | (none)    | Logical group name for metrics and identification. |
| `SIDECAR_PORT` | 33212     | gRPC sidecar port for proxy ↔ P2P communication.   |
| `API_PORT`     | 9090      | HTTP API port for node management.                 |
| `IDENTITY_DIR` | /identity | Directory containing node’s private key.           |

## OptimumProxy Configuration Parameters

When using **Proxy + P2P deployment**, the proxy service connects clients to P2P nodes and optionally enforces authentication.

Example Docker service:

```yaml
proxy-1:
  image: 'getoptimum/proxy:latest'
  environment:
    - PROXY_HTTP_PORT=:8080
    - PROXY_GRPC_PORT=:50051
    - CLUSTER_ID=proxy-1
    - ENABLE_AUTH=false
    - LOG_LEVEL=debug
    - P2P_NODES=p2pnode-1:33212,p2pnode-2:33212
```

| Parameter                         | Default | Purpose                                                    |
| --------------------------------- | ------- | ---------------------------------------------------------- |
| `PROXY_HTTP_PORT`                 | :8080   | HTTP API port for clients.                                 |
| `PROXY_GRPC_PORT`                 | :50051  | gRPC API port for clients.                                 |
| `ENABLE_AUTH`                     | false   | Enable Auth0 authentication.                               |
| `AUTH0_DOMAIN` / `AUTH0_AUDIENCE` | (none)  | Auth0 settings (required if `ENABLE_AUTH`=true).           |
| `P2P_NODES`                       | (none)  | Comma-separated list of host:port for sidecar connections. |
| `SUBSCRIBER_THRESHOLD`            | 0.1     | % of connected subscribers needed to forward a message.    |

## Recommended Default Configuration

The following table shows the **production defaults**, which are optimized for typical deployment scenarios:

### For Quick Start (Copy-Paste Ready)

**OptimumP2P Mode (`NODE_MODE=optimum`):**

```yaml
environment:
  - NODE_MODE=optimum
  - LOG_LEVEL=production
  - CLUSTER_ID=my-cluster
  - SIDECAR_PORT=33212
  - API_PORT=8081
  - IDENTITY_DIR=/identity
  - OPTIMUM_PORT=7070
  - OPTIMUM_MAX_MSG_SIZE=1048576
  - OPTIMUM_RANDOM_MSG_SIZE=512
  - OPTIMUM_MESH_TARGET=6
  - OPTIMUM_MESH_MIN=4
  - OPTIMUM_MESH_MAX=12
  - OPTIMUM_SHARD_FACTOR=4
  - OPTIMUM_SHARD_MULT=1.5
  - OPTIMUM_THRESHOLD=0.75
  - BOOTSTRAP_PEERS=""
```

**GossipSub Mode (`NODE_MODE=gossipsub`):**

```yaml
environment:
  - NODE_MODE=gossipsub
  - LOG_LEVEL=production
  - CLUSTER_ID=my-cluster
  - SIDECAR_PORT=33212
  - API_PORT=8081
  - IDENTITY_DIR=/identity
  - GOSSIPSUB_PORT=6060
  - GOSSIPSUB_MAX_MSG_SIZE=1048576
  - GOSSIPSUB_MESH_TARGET=6
  - GOSSIPSUB_MESH_MIN=4
  - GOSSIPSUB_MESH_MAX=12
  - BOOTSTRAP_PEERS=""
```

### Complete Defaults Reference

| Parameter                    | Default Value | Used In Mode | Description                                    |
| ---------------------------- | ------------- | ------------ | ---------------------------------------------- |
| `LOG_LEVEL`                  | production    | Both         | Log verbosity (production/debug/info/warn/error) |
| `CLUSTER_ID`                 | ""            | Both         | Logical group name for metrics                 |
| `NODE_MODE`                  | ""            | Both         | Protocol mode (optimum/gossipsub)             |
| `SIDECAR_PORT`               | 33212         | Both         | gRPC sidecar port                              |
| `API_PORT`                   | 8081          | Both         | HTTP API port                                  |
| `IDENTITY_DIR`               | /tmp          | Both         | Directory for node private key                 |
| `OPTIMUM_PORT`               | 7070          | optimum      | TCP port for RLNC gossip                      |
| `OPTIMUM_MAX_MSG_SIZE`       | 1048576       | optimum      | Max message size (1MB)                         |
| `OPTIMUM_RANDOM_MSG_SIZE`    | 512           | optimum      | Random message size for testing                |
| `OPTIMUM_MESH_TARGET`        | 6             | optimum      | Desired peers in mesh                          |
| `OPTIMUM_MESH_MIN`           | 4             | optimum      | Minimum peers before adding more               |
| `OPTIMUM_MESH_MAX`           | 12            | optimum      | Max peers before pruning                       |
| `OPTIMUM_SHARD_FACTOR`       | 4             | optimum      | Number of shards per message                   |
| `OPTIMUM_SHARD_MULT`         | 1.5           | optimum      | Redundancy multiplier (extra shards)          |
| `OPTIMUM_THRESHOLD`          | 0.75          | optimum      | Forward/decode threshold (75%)                 |
| `GOSSIPSUB_PORT`             | 6060          | gossipsub    | TCP port for standard gossip                   |
| `GOSSIPSUB_MAX_MSG_SIZE`     | 1048576       | gossipsub    | Max message size (1MB)                         |
| `GOSSIPSUB_MESH_TARGET`      | 6             | gossipsub    | Desired peers in mesh                          |
| `GOSSIPSUB_MESH_MIN`         | 4             | gossipsub    | Minimum peers before adding more               |
| `GOSSIPSUB_MESH_MAX`         | 12            | gossipsub    | Max peers before pruning                       |
| `BOOTSTRAP_PEERS`            | []            | Both         | List of peer multiaddrs for bootstrap         |

> **Note:** These are the production defaults used by OptimumP2P nodes. For experimental tuning, see [Common Experiments](./04-experiments.md).

## Parameter Impact in Deployment Modes

<!-- TODO:: take kishori help -->
| Parameter                             | Proxy + P2P | Direct P2P |
| ------------------------------------- | ----------- | ---------- |
| Mesh Size (`*_MESH_TARGET`)           | explainer   | explainer  |
| Shard Factor (`OPTIMUM_SHARD_FACTOR)` | explainer   | explainer  |
| Threshold (`OPTIMUM_THRESHOLD`)       | explainer   | explainer  |
| Max Message Size (`*_MAX_MSG_SIZE`)   | explainer   | explainer  |
| Bootstrap Peers (`BOOTSTRAP_PEERS`)   | explainer   | explainer  |
