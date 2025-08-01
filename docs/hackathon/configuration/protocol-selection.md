# Protocol Selection Guide

The `getoptimum/p2pnode:latest` Docker image supports running two different gossip protocols:

* **OptimumP2P** (`NODE_MODE=optimum`) - RLNC-enhanced gossip protocol (recommended)
* **GossipSub** (`NODE_MODE=gossipsub`) - Standard libp2p gossip protocol for comparison

This guide explains how to configure and deploy each protocol mode.

## Overview

Both protocols use the same Docker image but operate with different:

* **Network ports** - OptimumP2P uses port 7070, GossipSub uses port 6060
* **Configuration parameters** - Each protocol has protocol-specific environment variables
* **Bootstrap peers** - Must match the protocol and port of target nodes
* **Performance characteristics** - OptimumP2P provides enhanced throughput and fault tolerance

## OptimumP2P Mode (Recommended)

### Basic Configuration

```yaml
services:
  p2pnode-optimum:
    image: 'getoptimum/p2pnode:latest'
    environment:
      - NODE_MODE=optimum
      - CLUSTER_ID=my-cluster
      - OPTIMUM_PORT=7070
      - IDENTITY_DIR=/identity
      # Bootstrap peer using OptimumP2P protocol and port
      - BOOTSTRAP_PEERS=/ip4/172.28.0.10/tcp/7070/p2p/${BOOTSTRAP_PEER_ID}
    ports:
      - "7070:7070"  # OptimumP2P protocol port
      - "33212:33212"  # gRPC sidecar port
      - "9090:9090"  # HTTP API port
```

### OptimumP2P Parameters

| Parameter | Environment Variable | Default | Description |
|-----------|---------------------|---------|-------------|
| Listen Port | `OPTIMUM_PORT` | `7070` | P2P protocol listening port |
| Max Message Size | `OPTIMUM_MAX_MSG_SIZE` | `1048576` | Maximum message size (bytes) |
| Mesh Target | `OPTIMUM_MESH_TARGET` | `6` | Target number of mesh peers |
| Mesh Min | `OPTIMUM_MESH_MIN` | `3` | Minimum mesh peers before grafting |
| Mesh Max | `OPTIMUM_MESH_MAX` | `12` | Maximum mesh peers before pruning |
| Shard Factor | `OPTIMUM_SHARD_FACTOR` | `4` | Number of coded shards per message |
| Shard Multiplier | `OPTIMUM_SHARD_MULT` | `1.5` | Publisher shard creation multiplier |
| Forward Threshold | `OPTIMUM_THRESHOLD` | `0.75` | Threshold for forwarding recoded shards |

### Performance Benefits

OptimumP2P provides several advantages over standard GossipSub:

* **Lower Latency** - Coded shards can be forwarded before complete message reception
* **Bandwidth Efficiency** - RLNC reduces redundant data transmission
* **Fault Tolerance** - Messages decode from any sufficient combination of shards
* **Loss Recovery** - Built-in redundancy handles packet loss gracefully

## GossipSub Mode (Baseline)

### Basic Configuration

```yaml
services:
  p2pnode-gossipsub:
    image: 'getoptimum/p2pnode:latest'
    environment:
      - NODE_MODE=gossipsub
      - CLUSTER_ID=my-cluster
      - GOSSIPSUB_PORT=6060
      - IDENTITY_DIR=/identity
      # Bootstrap peer using GossipSub protocol and port
      - BOOTSTRAP_PEERS=/ip4/172.28.0.10/tcp/6060/p2p/${BOOTSTRAP_PEER_ID}
    ports:
      - "6060:6060"  # GossipSub protocol port
      - "33212:33212"  # gRPC sidecar port
      - "9090:9090"  # HTTP API port
```

### GossipSub Parameters

| Parameter | Environment Variable | Default | Description |
|-----------|---------------------|---------|-------------|
| Listen Port | `GOSSIPSUB_PORT` | `6060` | P2P protocol listening port |
| Max Message Size | `GOSSIPSUB_MAX_MSG_SIZE` | `1048576` | Maximum message size (bytes) |
| Mesh Target | `GOSSIPSUB_MESH_TARGET` | `6` | Target number of mesh peers |
| Mesh Min | `GOSSIPSUB_MESH_MIN` | `4` | Minimum mesh peers before grafting |
| Mesh Max | `GOSSIPSUB_MESH_MAX` | `12` | Maximum mesh peers before pruning |

For detailed GossipSub configuration, see **[GossipSub Configuration](./gossipsub.md)**.

## Multi-Protocol Deployment

You can run both protocols simultaneously on the same network for comparison:

```yaml
version: '3.8'
services:
  # OptimumP2P bootstrap node
  p2pnode-optimum-bootstrap:
    image: 'getoptimum/p2pnode:latest'
    environment:
      - NODE_MODE=optimum
      - CLUSTER_ID=comparison-test
      - OPTIMUM_PORT=7070
      - IDENTITY_DIR=/identity
    ports:
      - "7070:7070"
      - "33212:33212"
      - "9090:9090"
    networks:
      test-network:
        ipv4_address: 172.28.0.10

  # GossipSub bootstrap node  
  p2pnode-gossipsub-bootstrap:
    image: 'getoptimum/p2pnode:latest'
    environment:
      - NODE_MODE=gossipsub
      - CLUSTER_ID=comparison-test
      - GOSSIPSUB_PORT=6060
      - IDENTITY_DIR=/identity
    ports:
      - "6060:6060"
      - "33213:33212"
      - "9091:9090"
    networks:
      test-network:
        ipv4_address: 172.28.0.11

  # OptimumP2P peer
  p2pnode-optimum-peer:
    image: 'getoptimum/p2pnode:latest'
    environment:
      - NODE_MODE=optimum
      - CLUSTER_ID=comparison-test
      - OPTIMUM_PORT=7070
      - BOOTSTRAP_PEERS=/ip4/172.28.0.10/tcp/7070/p2p/${OPTIMUM_BOOTSTRAP_PEER_ID}
    networks:
      test-network:
        ipv4_address: 172.28.0.12

  # GossipSub peer
  p2pnode-gossipsub-peer:
    image: 'getoptimum/p2pnode:latest'
    environment:
      - NODE_MODE=gossipsub
      - CLUSTER_ID=comparison-test
      - GOSSIPSUB_PORT=6060
      - BOOTSTRAP_PEERS=/ip4/172.28.0.11/tcp/6060/p2p/${GOSSIPSUB_BOOTSTRAP_PEER_ID}
    networks:
      test-network:
        ipv4_address: 172.28.0.13

networks:
  test-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16
```

## Validation and Troubleshooting

### Valid NODE_MODE Values

The p2pnode validates `NODE_MODE` at startup. Valid values are:

* `optimum` - Enables OptimumP2P with RLNC
* `gossipsub` - Enables standard GossipSub

Invalid values will cause the container to exit with a fatal error.

### Common Configuration Issues

**Port Conflicts**
```bash
# Ensure correct port mapping for each protocol
# OptimumP2P: 7070
# GossipSub: 6060
```

**Bootstrap Peer Mismatches**
```bash
# OptimumP2P nodes must bootstrap to OptimumP2P peers on port 7070
BOOTSTRAP_PEERS=/ip4/172.28.0.10/tcp/7070/p2p/${PEER_ID}

# GossipSub nodes must bootstrap to GossipSub peers on port 6060  
BOOTSTRAP_PEERS=/ip4/172.28.0.10/tcp/6060/p2p/${PEER_ID}
```

**Protocol Isolation**
* OptimumP2P and GossipSub nodes cannot directly communicate
* Each protocol forms its own mesh network
* Use separate bootstrap nodes for each protocol

### Health Checks

Both protocols expose the same health check endpoints:

```bash
# Check node status
curl http://localhost:9090/health

# Check peer connections
curl http://localhost:9090/peers

# Check protocol-specific metrics
curl http://localhost:9090/metrics
```

## Configuration Experimentation

### OptimumP2P Parameter Testing

OptimumP2P's RLNC implementation provides several parameters that significantly impact network behavior:

**Shard Factor Experimentation**
```yaml
# Test different sharding approaches
OPTIMUM_SHARD_FACTOR=2    # Minimal sharding
OPTIMUM_SHARD_FACTOR=4    # Default configuration  
OPTIMUM_SHARD_FACTOR=8    # High redundancy
```

**Forward Threshold Testing**
```yaml
# Test forwarding behavior
OPTIMUM_THRESHOLD=0.5     # Aggressive forwarding
OPTIMUM_THRESHOLD=0.75    # Default behavior
OPTIMUM_THRESHOLD=0.9     # Conservative forwarding
```

**Mesh Density Configuration**
```yaml
# Test network connectivity
OPTIMUM_MESH_TARGET=4     # Sparse mesh
OPTIMUM_MESH_TARGET=8     # Dense mesh
OPTIMUM_MESH_TARGET=12    # Maximum connectivity
```

### Protocol Comparison Setup

To observe protocol differences, deploy both modes with identical network topology:

```yaml
# OptimumP2P network
services:
  optimum-network:
    environment:
      - NODE_MODE=optimum
      - OPTIMUM_SHARD_FACTOR=4
      - OPTIMUM_MESH_TARGET=6

# GossipSub network  
  gossipsub-network:
    environment:
      - NODE_MODE=gossipsub
      - GOSSIPSUB_MESH_TARGET=6
```


---

**Next Steps:**
* **[OptimumP2P Configuration](./optimump2p.md)** - Detailed RLNC parameter tuning
* **[GossipSub Configuration](./gossipsub.md)** - Standard gossip parameters
* **[Client Integration](../clients/)** - Connect applications to either protocol 