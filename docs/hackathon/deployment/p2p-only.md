# P2P Network Only Deployment

This guide covers deploying a standalone OptimumP2P network without gateway intermediaries. In this configuration, clients connect directly to P2P nodes using gRPC sidecar connections, providing maximum performance and protocol flexibility.


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
- `NODE_MODE`: Set to `optimum` for RLNC-enhanced protocol or `gossipsub` for standard GossipSub
- `CLUSTER_ID`: Unique identifier for the node
- `LOG_LEVEL`: Logging verbosity (`debug`, `info`, `warn`, `error`)

### Port Configuration
- `SIDECAR_PORT`: gRPC sidecar port for client connections (default: 33212)
- `API_PORT`: HTTP API port for metrics and status (default: 9090)
- `OPTIMUM_PORT`: P2P protocol port (default: 7070)

### RLNC Parameters
- `OPTIMUM_MAX_MSG_SIZE`: Maximum message size in bytes (default: 1048576 = 1MB)
- `OPTIMUM_SHARD_FACTOR`: Number of coded shards to generate (default: 4)
- `OPTIMUM_SHARD_MULT`: Redundancy multiplier for shards (default: 1.5)
- `OPTIMUM_THRESHOLD`: Decoding threshold as fraction (default: 0.75)

### Mesh Topology
- `OPTIMUM_MESH_TARGET`: Target number of peers in mesh (default: 6)
- `OPTIMUM_MESH_MIN`: Minimum peers before grafting (default: 3)
- `OPTIMUM_MESH_MAX`: Maximum peers before pruning (default: 12)

### Bootstrap Configuration
- `BOOTSTRAP_PEERS`: Comma-separated list of bootstrap peer addresses
- `IDENTITY_DIR`: Directory for storing peer identity keys

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