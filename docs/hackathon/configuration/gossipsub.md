# GossipSub Configuration

Understanding GossipSub configuration is essential for optimizing your P2P network performance. This page explains the core GossipSub parameters and how to configure them in Optimum P2P.

## What is GossipSub?

GossipSub is a pubsub protocol designed for decentralized networks that builds on the concept of a "mesh" - a subset of peers that directly exchange messages, plus "gossip" to peers outside the mesh about available messages.

### Key Concepts

- **Mesh**: Direct connections between peers for message forwarding
- **Gossip**: Metadata exchange about available messages with non-mesh peers
- **Fanout**: Temporary connections for publishing when not subscribed to a topic
- **Degree**: The number of peer connections each node maintains

## Core GossipSub Parameters

Based on the [libp2p GossipSub v1.0 specification](https://github.com/libp2p/specs/blob/master/pubsub/gossipsub/gossipsub-v1.0.md#parameters), here are the fundamental parameters:

### Network Topology Parameters

| Parameter | Purpose | Default | Description |
|-----------|---------|---------|-------------|
| `D` | Desired mesh degree | 6 | Target number of peers in topic mesh |
| `D_low` | Lower bound for mesh degree | 4 | Minimum connections before adding peers |
| `D_high` | Upper bound for mesh degree | 12 | Maximum connections before pruning peers |
| `D_lazy` | Gossip emission degree | 6 | Number of peers for gossip emission |

### Timing Parameters

| Parameter | Purpose | Default | Description |
|-----------|---------|---------|-------------|
| `heartbeat_interval` | Mesh maintenance frequency | 1 second | How often to run maintenance |
| `fanout_ttl` | Fanout topic lifetime | 60 seconds | TTL for non-subscribed topic state |
| `seen_ttl` | Message deduplication cache | 2 minutes | How long to remember seen messages |

### Message Cache Parameters

| Parameter | Purpose | Default | Description |
|-----------|---------|---------|-------------|
| `mcache_len` | Message history windows | 5 | Number of history windows to keep |
| `mcache_gossip` | Gossip history windows | 3 | Windows to use for gossip emission |

## Optimum P2P GossipSub Configuration

Optimum P2P implements GossipSub with configurable parameters through environment variables:

### Environment Variables

- **`GOSSIPSUB_PORT`**: Port for GossipSub protocol communication
  - Purpose: Network port for GossipSub peer-to-peer communication
  - Default: `6060`
  - Usage: Internal P2P networking, separate from API ports
  - Example: `GOSSIPSUB_PORT=6060`

- **`GOSSIPSUB_MAX_MSG_SIZE`**: Maximum message size in bytes
  - Purpose: Limits individual message size to prevent memory issues
  - Default: `1048576` (1MB)
  - Usage: Larger values allow bigger payloads but use more memory
  - Example: `GOSSIPSUB_MAX_MSG_SIZE=1048576`

- **`GOSSIPSUB_MESH_TARGET`**: Target number of mesh connections
  - Purpose: Ideal number of direct peer connections (corresponds to `D`)
  - Default: `6`
  - Impact: Higher values increase redundancy but use more bandwidth
  - Example: `GOSSIPSUB_MESH_TARGET=6`

- **`GOSSIPSUB_MESH_MIN`**: Minimum mesh connections
  - Purpose: Lower threshold before attempting to add peers (corresponds to `D_low`)
  - Default: `4`
  - Note: Should be less than `GOSSIPSUB_MESH_TARGET`
  - Example: `GOSSIPSUB_MESH_MIN=4`

- **`GOSSIPSUB_MESH_MAX`**: Maximum mesh connections  
  - Purpose: Upper threshold before pruning excess peers (corresponds to `D_high`)
  - Default: `12`
  - Note: Should be greater than `GOSSIPSUB_MESH_TARGET`
  - Example: `GOSSIPSUB_MESH_MAX=12`

### Configuration Example

```yaml
# docker-compose.yml
services:
  p2pnode-1:
    environment:
      - GOSSIPSUB_PORT=6060
      - GOSSIPSUB_MAX_MSG_SIZE=1048576
      - GOSSIPSUB_MESH_TARGET=6
      - GOSSIPSUB_MESH_MIN=4
      - GOSSIPSUB_MESH_MAX=12
```

## GossipSub vs Optimum Protocol

Optimum P2P runs two protocols simultaneously:

1. **Standard GossipSub**: For baseline pub/sub functionality
2. **Optimum Protocol**: Enhanced with RLNC (Random Linear Network Coding)

Both protocols have their own configuration parameters:

| Aspect | GossipSub | Optimum |
|--------|-----------|---------|
| Purpose | Standard pub/sub mesh | RLNC-enhanced messaging |
| Port | `GOSSIPSUB_PORT` | `OPTIMUM_PORT` |
| Mesh Target | `GOSSIPSUB_MESH_TARGET` | `OPTIMUM_MESH_TARGET` |
| Message Size | `GOSSIPSUB_MAX_MSG_SIZE` | `OPTIMUM_MAX_MSG_SIZE` |

### Control Messages

GossipSub uses four types of control messages:

- **GRAFT**: Add peer to mesh (invite to join topic mesh)
- **PRUNE**: Remove peer from mesh (remove from topic mesh)  
- **IHAVE**: Announce available messages (gossip metadata)
- **IWANT**: Request specific messages (response to IHAVE)


## References

- [libp2p GossipSub v1.0 Specification](https://github.com/libp2p/specs/blob/master/pubsub/gossipsub/gossipsub-v1.0.md)
- [libp2p PubSub Interface](https://github.com/libp2p/specs/blob/master/pubsub/README.md)
- [Optimum P2P Configuration Guide](/docs/hackathon/deployment/p2p-with-gateway.md#p2p-node-configuration) 