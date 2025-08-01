# OptimumP2P Configuration

This page covers all OptimumP2P-specific configuration parameters, their impact on network performance, and how to configure them for different deployment scenarios.

## Configuration Mapping

OptimumP2P configuration can be set via YAML config files or Docker environment variables. The following tables map the configuration fields to their corresponding Docker environment variables:

### RLNC Core Parameters

| Config Field | Environment Variable | Default | Description |
|--------------|---------------------|---------|-------------|
| `rlnc_shard_factor` | `OPTIMUM_SHARD_FACTOR` | `4` | Number of coded shards per message |
| `publisher_shard_multiplier` | `OPTIMUM_SHARD_MULT` | `1.5` | Coded shard multiplier for publishing |
| `forward_shard_threshold` | `OPTIMUM_THRESHOLD` | `0.75` | Fraction needed before forwarding |

### Mesh Topology Parameters

| Config Field | Environment Variable | Default | Description |
|--------------|---------------------|---------|-------------|
| `mesh_degree_target` | `OPTIMUM_MESH_TARGET` | `6` | Target peer connections |
| `mesh_degree_min` | `OPTIMUM_MESH_MIN` | `3` | Min before grafting |
| `mesh_degree_max` | `OPTIMUM_MESH_MAX` | `12` | Max before pruning |

### Protocol Selection

| Config Field | Environment Variable | Default | Description |
|--------------|---------------------|---------|-------------|
| `enable_optimum_p2p` | `NODE_MODE=optimum` | `true` | Enable RLNC protocol |
| `enable_gossipsub` | `NODE_MODE=gossipsub` | `false` | Enable GossipSub baseline |

### Message and Network Settings

| Config Field | Environment Variable | Default | Description |
|--------------|---------------------|---------|-------------|
| `random_message_size_bytes` | `OPTIMUM_MAX_MSG_SIZE` | `1048576` | Max message size (1MB) |
| `app_port` | `API_PORT` | `9090` | HTTP API port |

## RLNC Parameter Details

### Shard Factor (coded shards)

**Parameter**: `OPTIMUM_SHARD_FACTOR`  
**Config Field**: `rlnc_shard_factor`  
**Default**: `4`

Controls how many coded shards each message is divided into for network coding. This is the fundamental parameter that determines RLNC granularity.

**Technical Impact**:
- **Higher values**: More coded shards provide better redundancy and fault tolerance but increase computational overhead
- **Lower values**: Fewer coded shards reduce processing time and bandwidth usage but may reduce fault tolerance
- **Network effect**: Directly affects the minimum number of coded shards needed for message reconstruction

### Publisher Shard Multiplier

**Parameter**: `OPTIMUM_SHARD_MULT`  
**Config Field**: `publisher_shard_multiplier`  
**Default**: `1.5`

Controls redundancy when publishing messages. Total coded shards created = `rlnc_shard_factor × publisher_shard_multiplier`.

**Technical Impact**:
- **Higher values**: More initial coded shards improve delivery guarantees but increase bandwidth usage
- **Lower values**: Fewer coded shards reduce network load but may impact reliability in lossy networks

### Forward Shard Threshold

**Parameter**: `OPTIMUM_THRESHOLD`  
**Config Field**: `forward_shard_threshold`  
**Default**: `0.75`

Determines when nodes forward received coded shards. Nodes forward when they have more than `rlnc_shard_factor × threshold` coded shards.

**Technical Impact**:
- **Higher values** (0.8-0.9): More reliable forwarding, increased latency
- **Lower values** (0.5-0.6): Faster propagation, reduced latency, potential reliability trade-offs

## Docker Configuration Examples

### OptimumP2P Mode (Enhanced)
```yaml
environment:
  - NODE_MODE=optimum
  - OPTIMUM_SHARD_FACTOR=4
  - OPTIMUM_SHARD_MULT=1.5
  - OPTIMUM_THRESHOLD=0.75
  - OPTIMUM_MESH_TARGET=6
  - OPTIMUM_MESH_MIN=3
  - OPTIMUM_MESH_MAX=12
```

### GossipSub Mode (Baseline)
```yaml
environment:
  - NODE_MODE=gossipsub
  - GOSSIPSUB_MESH_TARGET=6
  - GOSSIPSUB_MESH_MIN=4
  - GOSSIPSUB_MESH_MAX=12
```

## Performance Tuning

### High Throughput Setup
Optimized for maximum message throughput:
```yaml
- OPTIMUM_SHARD_FACTOR=8
- OPTIMUM_SHARD_MULT=2.0
- OPTIMUM_THRESHOLD=0.5
- OPTIMUM_MESH_TARGET=8
```

### Low Latency Setup
Optimized for minimum delivery latency:
```yaml
- OPTIMUM_SHARD_FACTOR=4
- OPTIMUM_SHARD_MULT=1.2
- OPTIMUM_THRESHOLD=0.6
- OPTIMUM_MESH_TARGET=6
```

### High Reliability Setup
Optimized for maximum fault tolerance:
```yaml
- OPTIMUM_SHARD_FACTOR=16
- OPTIMUM_SHARD_MULT=2.5
- OPTIMUM_THRESHOLD=0.8
- OPTIMUM_MESH_TARGET=10
```

## Configuration File Format

Sample YAML configuration matching the actual config structure:

```yaml
# === General App Settings ===
app_port: 23422
cluster_id: "production_cluster"
file_storage_directory: /tmp
silent_mode_enabled: false

# === Protocol Settings ===
enable_gossipsub: false
enable_optimum_p2p: true

# === PubSub Mesh Settings ===
mesh_degree_target: 6
mesh_degree_min: 5
mesh_degree_max: 12
rlnc_shard_factor: 32  # number of coded shards each message is divided into

# === Message Generation ===
random_message_size_bytes: 3145728  # 3MB
publisher_shard_multiplier: 1.5     # coded shards multiplier for publishing
forward_shard_threshold: 0.75       # forward threshold for coded shards

# === Bootstrap Nodes ===
bootstrap_nodes_optimum_p2p:
  - /ip4/127.0.0.1/tcp/10000/p2p/12D3KooWExample

bootstrap_nodes_gossipsub:
  - /ip4/127.0.0.1/tcp/10000/p2p/12D3KooWExample
```

## Protocol Mode Switching

OptimumP2P supports running both protocols for comparison:

**OptimumP2P Mode** (`NODE_MODE=optimum`):
- Uses RLNC with coded shards for enhanced propagation
- Provides early forwarding capabilities
- Better bandwidth efficiency through network coding
- Enhanced fault tolerance via coded shard redundancy

**GossipSub Mode** (`NODE_MODE=gossipsub`):
- Standard libp2p GossipSub implementation
- Direct message forwarding without coding
- Lower computational overhead
- Baseline for performance comparison

## Monitoring Configuration

Verify your configuration is applied correctly:

```bash
# Check applied configuration
curl http://localhost:9090/config

# Monitor mesh formation and peer connections
curl http://localhost:9090/debug/peers

# Check protocol mode in logs
docker logs p2pnode-1 | grep -E "(optimum|gossipsub|coded.*shard)"

# Monitor coded shard processing
docker logs p2pnode-1 | grep -E "(shard|forward|decode)"
```

## Configuration Constraints

**Enforced by code**:
- `mesh_degree_min <= mesh_degree_target <= mesh_degree_max`
- `random_message_size_bytes > 0`
- `cluster_id` must not be empty or "sample_cluster"

**Recommended best practices**:
- `forward_shard_threshold` between 0.0 and 1.0 (values outside this range may cause unexpected behavior)
- `rlnc_shard_factor > 0` (value of 0 disables RLNC functionality)
- `publisher_shard_multiplier >= 1.0` (values < 1.0 reduce redundancy)

## Complete Docker Compose Example

```yaml
services:
  p2pnode-1:
    image: getoptimum/p2pnode:latest
    environment:
      # Protocol selection
      - NODE_MODE=optimum
      - CLUSTER_ID=p2pnode-1
      
      # RLNC coded shard parameters
      - OPTIMUM_SHARD_FACTOR=4
      - OPTIMUM_SHARD_MULT=1.5
      - OPTIMUM_THRESHOLD=0.75
      
      # Mesh topology
      - OPTIMUM_MESH_TARGET=6
      - OPTIMUM_MESH_MIN=3
      - OPTIMUM_MESH_MAX=12
      
      # Network settings
      - OPTIMUM_PORT=7070
      - OPTIMUM_MAX_MSG_SIZE=1048576
      - SIDECAR_PORT=33212
      - API_PORT=9090
      
      # Bootstrap configuration
      - BOOTSTRAP_PEERS=/ip4/172.28.0.12/tcp/7070/p2p/${BOOTSTRAP_PEER_ID}
```

## See Also

- **[GossipSub Configuration](./gossipsub.md)** - Standard protocol parameters for comparison
- **[P2P-Only Deployment](../deployment/p2p-only.md)** - Complete setup with configuration
- **[Gateway + P2P Deployment](../deployment/p2p-with-gateway.md)** - Full stack configuration
- **[OptimumP2P Technical Overview](../../learn/overview/p2p.md)** - Protocol fundamentals and RLNC details 