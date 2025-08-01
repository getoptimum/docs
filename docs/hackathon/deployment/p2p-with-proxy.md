# P2P Network with Proxy Deployment

This guide covers deploying OptimumP2P with proxy services that provide HTTP/WebSocket/gRPC APIs for client applications. The proxy acts as a bridge between traditional client-server applications and the OptimumP2P network.


### Component Responsibilities

**Proxy Layer:**
- Protocol translation (HTTP/WebSocket/gRPC ↔ libp2p)
- Client session management
- Load balancing across P2P nodes
- Rate limiting and authentication
- API versioning and compatibility

**P2P Network Layer:**
- RLNC message encoding/decoding
- Mesh topology maintenance
- Peer discovery and routing
- Message propagation via GossipSub
- Network resilience and fault tolerance


## Deployment Configuration

Complete setup with proxies and P2P nodes:

```yaml
services:
  proxy-1:
    image: 'getoptimum/gateway:latest'
    platform: linux/amd64
    ports:
      - "8081:8080"   # HTTP/WebSocket
      - "50051:50051" # gRPC
    environment:
      - PROXY_PORT=:8080
      - CLUSTER_ID=proxy-1
      - ENABLE_AUTH=false
      - LOG_LEVEL=debug
      - P2P_NODES=p2pnode-1:33212,p2pnode-2:33212,p2pnode-3:33212,p2pnode-4:33212
    networks:
      optimum-network:
        ipv4_address: 172.28.0.10
    depends_on:
      - p2pnode-1
      - p2pnode-2
      - p2pnode-3
      - p2pnode-4

  proxy-2:
    image: 'getoptimum/gateway:latest'
    platform: linux/amd64
    ports:
      - "8082:8080"
      - "50052:50051"
    environment:
      - PROXY_PORT=:8080
      - CLUSTER_ID=proxy-2
      - ENABLE_AUTH=false
      - LOG_LEVEL=debug
      - P2P_NODES=p2pnode-1:33212,p2pnode-2:33212,p2pnode-3:33212,p2pnode-4:33212
    networks:
      optimum-network:
        ipv4_address: 172.28.0.11
    depends_on:
      - p2pnode-1
      - p2pnode-2
      - p2pnode-3
      - p2pnode-4

  p2pnode-1:
    image: 'getoptimum/p2pnode:latest'
    platform: linux/amd64
    volumes:
      - ./identity:/identity
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
      - "33221:33212"
      - "7071:7070"
      - "9091:9090"

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

  p2pnode-3:
    image: 'getoptimum/p2pnode:latest'
    platform: linux/amd64
    environment:
      - LOG_LEVEL=debug
      - CLUSTER_ID=p2pnode-3
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
        ipv4_address: 172.28.0.14
    ports:
      - "33223:33212"
      - "7073:7070"
      - "9093:9090"

  p2pnode-4:
    image: 'getoptimum/p2pnode:latest'
    platform: linux/amd64
    environment:
      - LOG_LEVEL=debug
      - CLUSTER_ID=p2pnode-4
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
        ipv4_address: 172.28.0.15
    ports:
      - "33224:33212"
      - "7074:7070"
      - "9094:9090"

networks:
  optimum-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16
```

## P2P Node Environment Variables

### Core P2P Configuration

- **`CLUSTER_ID`**: Unique identifier for each P2P node
  - Purpose: Distinguishes nodes in logs, metrics, and network topology
  - Usage: Should be unique across all P2P nodes in deployment
  - Format: Alphanumeric string, typically `p2pnode-1`, `p2pnode-2`, etc.
  - Required: Yes, no default value

- **`NODE_MODE`**: P2P protocol implementation mode
  - Purpose: Selects the underlying pub/sub protocol
  - Values: `optimum` (RLNC-enhanced) or `gossipsub` (standard libp2p)
  - Default: `optimum`
  - Usage: Use `optimum` for better performance with RLNC coding
  - Note: All nodes in network should use same mode for compatibility

- **`SIDECAR_PORT`**: gRPC bidirectional communication port
  - Purpose: Port where proxys and clients connect to interact with P2P node
  - Default: `33212`
  - Range: Any available port (1024-65535)
  - Usage: Must be accessible from proxy containers for internal communication
  - Network: Used for internal container-to-container communication

- **`API_PORT`**: HTTP monitoring and management API port
  - Purpose: Exposes REST endpoints for health checks, node state, and metrics
  - Default: `8081` for proxy, `9090` for P2P nodes (varies by component)
  - Endpoints: `/api/v1/health`, `/api/v1/node-state`, `/api/v1/version`
  - Usage: Used for operational monitoring and debugging

### Network Discovery Configuration

- **`IDENTITY_DIR`**: Node cryptographic identity directory
  - Purpose: Directory containing node's P2P identity key (p2p.key)
  - Default: `/identity`
  - Usage: Only needed for bootstrap nodes, other nodes auto-generate identity
  - Security: Contains private key material, should be properly secured

- **`BOOTSTRAP_PEERS`**: Initial peer discovery addresses
  - Purpose: List of known peers for joining the mesh network
  - Format: `/ip4/<ip>/tcp/<port>/p2p/<peer-id>`
  - Example: `/ip4/172.28.0.12/tcp/7070/p2p/12D3KooW...`
  - Usage: New nodes use these to discover and join the network
  - Multiple: Can specify multiple peers separated by commas

### OptimumP2P Protocol Configuration

- **`OPTIMUM_PORT`**: P2P protocol communication port
  - Purpose: Port for peer-to-peer communication between nodes
  - Default: `7070`
  - Range: Any available port, commonly 7070-7080
  - Usage: Must be accessible between all P2P nodes in the mesh
  - Network: Used for inter-node OptimumP2P protocol communication

- **`OPTIMUM_MAX_MSG_SIZE`**: Maximum message size in bytes
  - Purpose: Limits individual message size to prevent memory issues
  - Default: `1048576` (1MB)
  - Usage: Larger values allow bigger payloads but use more memory/bandwidth

### RLNC (Random Linear Network Coding) Configuration

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
  - Impact: Higher values increase redundancy and fault tolerance but use more resources
  - Scaling: Adjust based on network size and reliability requirements

- **`OPTIMUM_MESH_MIN`**: Minimum mesh peer connections
  - Purpose: Minimum connections before attempting to add more peers
  - Default: `4` 
  - Note: Should be less than `MESH_TARGET`
  - Impact: Lower values reduce fault tolerance, higher values increase resource usage
  - Usage: Prevents network partitioning by maintaining minimum connectivity

- **`OPTIMUM_MESH_MAX`**: Maximum mesh peer connections
  - Purpose: Maximum connections before pruning excess peers
  - Default: `12` 
  - Note: Should be greater than `MESH_TARGET`
  - Impact: Prevents resource exhaustion while maintaining network connectivity
  - Usage: Sets upper bound to control memory and bandwidth usage

### Configuration Notes

All parameter values can be adjusted based on specific use case requirements. When modifying parameters:

- Higher OPTIMUM_THRESHOLD values improve reliability but increase latency
- Higher OPTIMUM_MESH_TARGET values improve fault tolerance but use more resources  
- Higher OPTIMUM_SHARD_FACTOR values improve redundancy but increase bandwidth usage
- OPTIMUM_MESH_MIN should be less than OPTIMUM_MESH_TARGET
- OPTIMUM_MESH_MAX should be greater than OPTIMUM_MESH_TARGET

## Proxy Configuration

### Environment Variables

- **`PROXY_PORT`**: HTTP/WebSocket server port (default: `:8080`)
  - Purpose: Defines the port where the proxy listens for client connections
  - Usage: Internal container port for REST API and WebSocket connections
  - Example: `:8080`, `:3000`, `:8081`
  - Note: External port mapping is configured separately in docker-compose ports section

- **`CLUSTER_ID`**: Unique proxy identifier 
  - Purpose: Distinguishes between multiple proxy instances in logs, metrics, and monitoring
  - Usage: Should be unique across all proxy instances in your deployment
  - Format: Alphanumeric string, no spaces
  - Example: `proxy-1`, `proxy-primary`, `proxy-us-east`
  - Required: Yes, no default value

- **`ENABLE_AUTH`**: Enable Auth0 JWT authentication (true/false)
  - Purpose: Controls whether API requests require JWT authentication
  - Usage: Set to `false` for development/testing, `true` for production
  - Values: `true` (requires valid JWT tokens) or `false` (open access)
  - Default: `false`
  - Note: When `true`, requires additional Auth0 configuration (AUTH0_DOMAIN, AUTH0_AUDIENCE)

- **`P2P_NODES`**: Comma-separated list of P2P node gRPC sidecar addresses
  - Purpose: Defines which P2P nodes the proxy can connect to for message routing
  - Format: `hostname:port,hostname:port,...`
  - Usage: Proxy load-balances requests across these nodes for high availability
  - Port: Should match SIDECAR_PORT of P2P nodes (typically 33212)
  - Example: `p2pnode-1:33212,p2pnode-2:33212,p2pnode-3:33212`
  - Behavior: Proxy attempts to connect to all listed nodes and routes to healthy ones

- **`LOG_LEVEL`**: Logging verbosity level
  - Purpose: Controls the amount and detail of log output
  - Values: `debug`, `info`, `warn`, `error`
  - Default: `info`
  - Usage Guide:
    - `debug`: Most verbose, includes request/response details, connection events (development)
    - `info`: Standard production level with operational information
    - `warn`: Only warnings and errors (quiet production)
    - `error`: Only error messages (minimal logging)
  - Performance: Higher verbosity may impact performance and storage

### Authentication (Optional)
For production deployments, enable authentication:
```yaml
environment:
  - ENABLE_AUTH=true
  - AUTH0_DOMAIN=your-domain.auth0.com
  - AUTH0_AUDIENCE=your-api-audience
```

## API Endpoints

### HTTP REST API
- `POST /publish` - Publish message to topic
- `GET /health` - Proxy health check
- `GET /metrics` - Prometheus metrics

### WebSocket API
- `ws://localhost:8081/ws` - WebSocket connection for real-time messaging

### gRPC API
- `localhost:50051` - Bidirectional streaming service

## Starting the Network

1. Generate peer identity:
```bash
mkdir -p identity
export BOOTSTRAP_PEER_ID=$(docker run --rm -v $(pwd)/identity:/identity getoptimum/p2pnode:latest generate-key --output-peer-id)
```

2. Start all services:
```bash
docker-compose up -d
```

3. Verify services:
```bash
docker-compose ps
curl http://localhost:8081/health
```

## Client Examples

### HTTP REST
```bash
curl -X POST http://localhost:8081/publish \
  -H "Content-Type: application/json" \
  -d '{"topic": "test", "data": "Hello OptimumP2P"}'
```

### WebSocket (JavaScript)
```javascript
const ws = new WebSocket('ws://localhost:8081/ws');
ws.onopen = () => {
    ws.send(JSON.stringify({
        type: 'subscribe',
        topic: 'test'
    }));
};
```

### gRPC (Go)
```go
conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
client := pb.NewProxyStreamClient(conn)
stream, err := client.Stream(context.Background())
```

## Monitoring

### Proxy Metrics
- Proxy 1: http://localhost:8081/metrics
- Proxy 2: http://localhost:8082/metrics

### P2P Node Status
- Node 1: http://localhost:9091
- Node 2: http://localhost:9092
- Node 3: http://localhost:9093
- Node 4: http://localhost:9094

## Scaling Considerations

Scale the P2P network by adding more nodes:
- Maintain OPTIMUM_MESH_TARGET ratio to network size
- Consider network topology and latency
- Monitor mesh formation and message propagation

## Troubleshooting

### Proxy Connection Issues
```bash
# Check proxy logs
docker-compose logs proxy-1

# Test P2P node connectivity
docker-compose exec proxy-1 nc -zv p2pnode-1 33212
```

### Message Delivery Issues
```bash
# Check message flow
docker-compose logs -f | grep -E "(publish|subscribe|message)"

# Verify P2P mesh status
curl http://localhost:9091/debug/peers
```

## See Also

- [GossipSub Configuration Guide](/docs/hackathon/configuration/gossipsub.md) - Detailed explanation of underlying pub/sub protocol parameters
- [P2P-Only Deployment](/docs/hackathon/deployment/p2p-only.md) - Alternative deployment without proxys
- [First Message Tutorial](/docs/hackathon/quick-start/first-message.md) - Step-by-step getting started guide
