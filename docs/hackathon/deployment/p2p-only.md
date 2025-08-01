# P2P Network Only Deployment

This guide covers deploying a standalone OptimumP2P network without proxy intermediaries. In this configuration, clients connect directly to P2P nodes using gRPC sidecar connections, providing maximum performance and protocol flexibility.


### Network Topology

The P2P network forms a mesh topology where each node maintains connections to a subset of peers based on the configured mesh parameters:

- **Mesh Target (`OPTIMUM_MESH_TARGET`)**: Ideal number of peers per topic
- **Mesh Range (`OPTIMUM_MESH_MIN` to `OPTIMUM_MESH_MAX`)**: Acceptable peer count bounds
- **Bootstrap Nodes**: Initial discovery points for new nodes joining the network


## Deployment Configuration

```yaml
services:
  p2pnode-1:
    image: 'getoptimum/p2pnode:latest'
    platform: linux/amd64
    environment:
      - LOG_LEVEL=debug
      - CLUSTER_ID=p2pnode-1
      - NODE_MODE=optimum
      - SIDECAR_PORT=33212
      - API_PORT=9090
      - IDENTITY_DIR=/identity
      - OPTIMUM_PORT=7070
      - OPTIMUM_MAX_MSG_SIZE=1048576
      - OPTIMUM_MESH_TARGET=6
      - OPTIMUM_MESH_MIN=3
      - OPTIMUM_MESH_MAX=12
      - OPTIMUM_SHARD_FACTOR=4
      - OPTIMUM_SHARD_MULT=1.5
      - OPTIMUM_THRESHOLD=0.75
      - BOOTSTRAP_PEERS=/ip4/172.28.0.12/tcp/7070/p2p/${BOOTSTRAP_PEER_ID}
    networks:
      optimum-network:
        ipv4_address: 172.28.0.12
    ports:
      - "33221:33212"  # gRPC sidecar
      - "7071:7070"    # OptimumP2P
      - "9091:9090"    # API
    volumes:
      - ./identity:/identity

  p2pnode-2:
    image: 'getoptimum/p2pnode:latest'
    platform: linux/amd64
    environment:
      - LOG_LEVEL=debug
      - CLUSTER_ID=p2pnode-2
      - NODE_MODE=optimum
      - SIDECAR_PORT=33212
      - API_PORT=9090
      - IDENTITY_DIR=/identity
      - OPTIMUM_PORT=7070
      - OPTIMUM_MAX_MSG_SIZE=1048576
      - OPTIMUM_MESH_TARGET=6
      - OPTIMUM_MESH_MIN=3
      - OPTIMUM_MESH_MAX=12
      - OPTIMUM_SHARD_FACTOR=4
      - OPTIMUM_SHARD_MULT=1.5
      - OPTIMUM_THRESHOLD=0.75
      - BOOTSTRAP_PEERS=/ip4/172.28.0.12/tcp/7070/p2p/${BOOTSTRAP_PEER_ID}
    networks:
      optimum-network:
        ipv4_address: 172.28.0.13
    ports:
      - "33222:33212"
      - "7072:7070"
      - "9092:9090"

networks:
  optimum-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16
```

## Environment Variables

### Core Configuration

- **`NODE_MODE`**: P2P protocol implementation mode
  - Purpose: Selects the underlying pub/sub protocol
  - Values: `optimum` (RLNC-enhanced) or `gossipsub` (standard libp2p)
  - Default: `optimum`
  - Usage: Use `optimum` for better performance with RLNC coding
  - Note: All nodes in network should use same mode for compatibility

- **`CLUSTER_ID`**: Unique identifier for each P2P node
  - Purpose: Distinguishes nodes in logs, metrics, and network topology
  - Usage: Should be unique across all P2P nodes in deployment
  - Format: Alphanumeric string, typically `p2pnode-1`, `p2pnode-2`, etc.
  - Required: Yes, no default value

- **`LOG_LEVEL`**: Logging verbosity level
  - Purpose: Controls the amount and detail of log output
  - Values: `debug`, `info`, `warn`, `error`
  - Default: `info`
  - Usage Guide:
    - `debug`: Most verbose, includes detailed P2P protocol events (development)
    - `info`: Standard level with operational information
    - `warn`: Only warnings and errors (quiet operation)
    - `error`: Only error messages (minimal logging)

### Port Configuration

- **`SIDECAR_PORT`**: gRPC bidirectional communication port
  - Purpose: Port where clients connect directly to interact with P2P node
  - Default: `33212`
  - Range: Any available port
  - Usage: Must be accessible from client applications for direct P2P access
  - Network: Used for client-to-node gRPC communication

- **`API_PORT`**: HTTP monitoring and management API port
  - Purpose: Exposes REST endpoints for health checks, node state, and metrics
  - Default: `9090`
  - Range: Any available port
  - Endpoints: `/api/v1/health`, `/api/v1/node-state`, `/api/v1/version`
  - Usage: Used for operational monitoring and debugging

- **`OPTIMUM_PORT`**: P2P protocol communication port
  - Purpose: Port for peer-to-peer communication between nodes
  - Default: `7070`
  - Range: Any available port
  - Usage: Must be accessible between all P2P nodes in the mesh
  - Network: Used for inter-node OptimumP2P protocol communication

### RLNC Parameters

- **`OPTIMUM_MAX_MSG_SIZE`**: Maximum message size in bytes
  - Purpose: Limits individual message size to prevent memory issues
  - Default: `1048576` (1MB)
  - Usage: Larger values allow bigger payloads but use more memory/bandwidth
  

- **`OPTIMUM_SHARD_FACTOR`**: Number of coded shards per message
  - Purpose: Controls how many pieces each message is split into for RLNC
  - Default: `4`
  - Impact: Higher values increase redundancy and fault tolerance but use more bandwidth
  - Note: Must be non-zero to enable RLNC functionality

- **`OPTIMUM_SHARD_MULT`**: Shard size redundancy multiplier
  - Purpose: Controls redundancy factor for error recovery
  - Default: `1.5` 
  - Impact: Higher values improve error recovery but increase bandwidth usage
  - Note: Values >1.0 add redundancy (e.g., 1.5 = 50% redundancy)
  

- **`OPTIMUM_THRESHOLD`**: Forward/decode threshold ratio
  - Purpose: Fraction of shards needed before forwarding or decoding message
  - Default: `0.75` (75%)
  - Validation: Must be between 0 and 1 (exclusive of 0, inclusive of 1)
  - Impact: Critical for network performance tuning
  - Note: Lower values reduce latency but may reduce reliability; higher values improve reliability but increase latency

### Mesh Topology Configuration

- **`OPTIMUM_MESH_TARGET`**: Target number of peer connections
  - Purpose: Ideal number of peers each node connects to in the mesh
  - Default: `6`
  - Range: 3-50 (typically 4-12 for most deployments)
  - Impact: Higher values increase redundancy and fault tolerance but use more resources


- **`OPTIMUM_MESH_MIN`**: Minimum mesh peer connections
  - Purpose: Minimum connections before attempting to add more peers
  - Default: `4` 
  - Note: Should be less than MESH_TARGET
  - Impact: Lower values reduce fault tolerance, higher values increase resource usage
  - Usage: Prevents network partitioning by maintaining minimum connectivity

- **`OPTIMUM_MESH_MAX`**: Maximum mesh peer connections
  - Purpose: Maximum connections before pruning excess peers
  - Default: `12` 
  - Note: Should be greater than MESH_TARGET
  - Impact: Prevents resource exhaustion while maintaining network connectivity
  - Usage: Sets upper bound to control memory and bandwidth usage

### Bootstrap and Identity Configuration

- **`BOOTSTRAP_PEERS`**: Initial peer discovery addresses
  - Purpose: List of known peers for joining the mesh network
  - Format: `/ip4/<ip>/tcp/<port>/p2p/<peer-id>`
  - Example: `/ip4/172.28.0.12/tcp/7070/p2p/12D3KooW...`
  - Usage: New nodes use these to discover and join the network
  - Multiple: Can specify multiple peers separated by commas
  - Note: At least one bootstrap peer must be accessible for network joining

- **`IDENTITY_DIR`**: Node cryptographic identity directory
  - Purpose: Directory containing node's P2P identity key (p2p.key)
  - Default: `/identity`
  - Usage: Only needed for bootstrap nodes, other nodes auto-generate identity
  - Security: Contains private key material, should be properly secured
  - Permissions: Ensure proper file permissions (600) for security

### Configuration Notes

All parameter values can be adjusted based on specific use case requirements. TWhen modifying parameters:

- Higher OPTIMUM_THRESHOLD values improve reliability but increase latency
- Higher OPTIMUM_MESH_TARGET values improve fault tolerance but use more resources
- Higher OPTIMUM_SHARD_FACTOR values improve redundancy but increase bandwidth usage
- OPTIMUM_MESH_MIN should be less than OPTIMUM_MESH_TARGET
- OPTIMUM_MESH_MAX should be greater than OPTIMUM_MESH_TARGET

## Starting the Network

1. Generate peer identity (optional, will auto-generate if not present):
```bash
# Create identity directory
mkdir -p identity

# Generate peer key
docker run --rm -v $(pwd)/identity:/identity getoptimum/p2pnode:latest generate-key
```

2. Set bootstrap peer ID:
```bash
export BOOTSTRAP_PEER_ID=$(docker run --rm -v $(pwd)/identity:/identity getoptimum/p2pnode:latest peer-id)
```

3. Start the network:
```bash
docker-compose up -d
```

4. Verify nodes are running:
```bash
docker-compose ps
docker-compose logs p2pnode-1
```

## Client Connection

Clients connect directly to P2P nodes via gRPC sidecar:

```go
conn, err := grpc.Dial("localhost:33221", grpc.WithInsecure())
if err != nil {
    log.Fatal(err)
}
client := pb.NewP2PStreamClient(conn)
```

## Network Scaling

To add more nodes, replicate the service definition with:
- Unique `CLUSTER_ID`
- Unique IP address in the network
- Unique port mappings
- Same `BOOTSTRAP_PEERS` configuration

## Monitoring

Access node metrics and status:
- Node 1: http://localhost:9091
- Node 2: http://localhost:9092

## Troubleshooting

### Peer Discovery Issues
Check bootstrap peer configuration and network connectivity:
```bash
docker-compose exec p2pnode-1 ping p2pnode-2
docker-compose logs p2pnode-1 | grep "bootstrap"
```

### Mesh Formation
Verify peers are discovering each other:
```bash
curl http://localhost:9091/debug/peers
```

### Message Flow
Check message propagation in logs:
```bash
docker-compose logs -f | grep "message"
```

## See Also

- [GossipSub Configuration Guide](/docs/hackathon/configuration/gossipsub.md) - Detailed explanation of underlying pub/sub protocol parameters
- [P2P with Proxy Deployment](/docs/hackathon/deployment/p2p-with-proxy.md) - Alternative deployment with proxy layer
- [First Message Tutorial](/docs/hackathon/quick-start/first-message.md) - Step-by-step getting started guide 