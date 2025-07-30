# P2P Network with Gateway Deployment

This guide covers deploying OptimumP2P with gateway services that provide HTTP/WebSocket/gRPC APIs for client applications. The gateway acts as a bridge between traditional client-server applications and the OptimumP2P network.


### Component Responsibilities

**Gateway Layer:**
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

Complete setup with gateways and P2P nodes:

```yaml
services:
  gateway-1:
    image: 'getoptimum/gateway:latest'
    platform: linux/amd64
    ports:
      - "8081:8080"   # HTTP/WebSocket
      - "50051:50051" # gRPC
    environment:
      - GATEWAY_PORT=:8080
      - CLUSTER_ID=gateway-1
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

  gateway-2:
    image: 'getoptimum/gateway:latest'
    platform: linux/amd64
    ports:
      - "8082:8080"
      - "50052:50051"
    environment:
      - GATEWAY_PORT=:8080
      - CLUSTER_ID=gateway-2
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

## Gateway Configuration

### Environment Variables
- `GATEWAY_PORT`: HTTP/WebSocket server port (default: :8080)
- `CLUSTER_ID`: Unique gateway identifier
- `ENABLE_AUTH`: Enable Auth0 authentication (true/false)
- `P2P_NODES`: Comma-separated list of P2P node sidecar addresses
- `LOG_LEVEL`: Logging verbosity

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
- `GET /health` - Gateway health check
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
client := pb.NewGatewayStreamClient(conn)
stream, err := client.Stream(context.Background())
```

## Load Balancing

Deploy multiple gateways for high availability:
- Gateway 1: `localhost:8081` (HTTP), `localhost:50051` (gRPC)
- Gateway 2: `localhost:8082` (HTTP), `localhost:50052` (gRPC)

Use a load balancer (nginx, HAProxy) to distribute traffic:
```nginx
upstream gateway_backend {
    server localhost:8081;
    server localhost:8082;
}

server {
    listen 80;
    location / {
        proxy_pass http://gateway_backend;
    }
}
```

## Monitoring

### Gateway Metrics
- Gateway 1: http://localhost:8081/metrics
- Gateway 2: http://localhost:8082/metrics

### P2P Node Status
- Node 1: http://localhost:9091
- Node 2: http://localhost:9092
- Node 3: http://localhost:9093
- Node 4: http://localhost:9094

## Scaling Considerations

### Gateway Scaling
Gateways are stateless and can be scaled horizontally:
- Add more gateway instances
- Use connection pooling for P2P node connections
- Implement circuit breakers for fault tolerance

### P2P Network Scaling
Scale the P2P network by adding more nodes:
- Maintain OPTIMUM_MESH_TARGET ratio to network size
- Consider network topology and latency
- Monitor mesh formation and message propagation

## Troubleshooting

### Gateway Connection Issues
```bash
# Check gateway logs
docker-compose logs gateway-1

# Test P2P node connectivity
docker-compose exec gateway-1 nc -zv p2pnode-1 33212
```

### Message Delivery Issues
```bash
# Check message flow
docker-compose logs -f | grep -E "(publish|subscribe|message)"

# Verify P2P mesh status
curl http://localhost:9091/debug/peers
```

### Performance Issues
```bash
# Monitor gateway metrics
curl http://localhost:8081/metrics

# Check resource usage
docker stats
``` 