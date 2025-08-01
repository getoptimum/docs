# gRPC Client Examples

This guide demonstrates how to build and use gRPC clients for direct integration with OptimumP2P networks, covering both P2P-only and Proxy deployment scenarios.

## Overview

OptimumP2P provides two gRPC client integration patterns:

1. **P2P Direct Client** - Connect directly to P2P node sidecar (for P2P-only deployments)
2. **Proxy Client** - Connect through the Proxy service (for Proxy + P2P deployments)

## P2P Direct Client

The P2P direct client connects to individual P2P node sidecar gRPC endpoints for direct protocol interaction.

### Source Code Location

```
optimum-dev-setup-guide/grpc_p2p_client/
├── p2p_client.go          # Main client implementation
├── proto/                 # Protocol buffer definitions
├── grpc/                  # Generated gRPC code
└── go.mod                 # Go module dependencies
```

### Client Features

- Direct gRPC connection to P2P node sidecar
- Real-time message publishing and subscribing
- Message trace collection for both GossipSub and OptimumP2P protocols
- Graceful shutdown handling

### Building the P2P Client

```bash
cd optimum-dev-setup-guide/grpc_p2p_client
go build -o p2p-client ./p2p_client.go
```

### Usage Examples

#### Subscribe to a Topic

```bash
# Basic subscription
./p2p-client -mode=subscribe -topic=test-topic -addr=localhost:33212
```

#### Publish Messages

```bash
# Publish a single message
./p2p-client -mode=publish -topic=test-topic -msg="Hello World" -addr=localhost:33212

# Publish multiple random messages with delay
./p2p-client -mode=publish -topic=test-topic -addr=localhost:33212 \
  -count=100 -sleep=200ms
```

### Using the Convenience Script

The repository includes a helper script for easier usage:

```bash
cd optimum-dev-setup-guide

# Subscribe to topic
./script/p2p_client.sh 127.0.0.1:33221 subscribe test-topic

# Publish a message
./script/p2p_client.sh 127.0.0.1:33221 publish test-topic "Hello World"

# Publish multiple random messages
./script/p2p_client.sh 127.0.0.1:33221 publish test-topic "random" -count=100 -sleep=200ms
```

### P2P Client Configuration

| Parameter | Description | Default | Example |
|-----------|-------------|---------|---------|
| `-addr` | P2P node sidecar gRPC address | `localhost:33212` | `127.0.0.1:33221` |
| `-mode` | Operation mode | `subscribe` | `subscribe`, `publish` |
| `-topic` | Topic name for pub/sub | Required | `test-topic` |
| `-msg` | Message content (publish mode) | `""` | `"Hello World"` |
| `-count` | Number of messages to publish | `1` | `100` |
| `-sleep` | Delay between messages | `1s` | `200ms`, `2s` |

### Message Structure

The P2P client handles messages using this structure:

```go
type P2PMessage struct {
    MessageID    string // Unique identifier for the message
    Topic        string // Topic name where the message was published
    Message      []byte // Actual message data
    SourceNodeID string // ID of the node that sent the message
}
```

### Response Types

The client receives different response types for metrics collection:

- `ResponseType_Message` - Actual message content
- `ResponseType_MessageTraceGossipSub` - GossipSub protocol metrics
- `ResponseType_MessageTraceOptimumP2P` - OptimumP2P protocol metrics
- `ResponseType_Unknown` - Unknown response type

## Proxy Client

The Proxy client connects through the Proxy service, which provides REST API registration and gRPC streaming for message delivery.

### Source Code Location

```
optimum-dev-setup-guide/grpc_proxy_client/
├── proxy_client.go      # Main client implementation
├── proto/                 # Protocol buffer definitions
├── grpc/                  # Generated gRPC code
└── go.mod                 # Go module dependencies
```

### Client Features

- REST API registration with threshold-based subscription
- gRPC streaming for real-time message delivery
- Automatic message publishing with configurable rate
- Load balancing across multiple proxy instances

### Building the Proxy Client

```bash
cd optimum-dev-setup-guide/grpc_proxy_client
go build -o proxy-client ./proxy_client.go
```

### Usage Examples

#### Subscribe Only Mode

```bash
# Basic subscription with threshold
./proxy-client -topic=demo -threshold=0.7 -subscribeOnly=true
```

#### Publish and Subscribe Mode

```bash
# Publish 10 messages with 2-second delay
./proxy-client -topic=demo -threshold=0.5 -count=10 -delay=2s

# High-frequency publishing
./proxy-client -topic=performance -threshold=0.5 -count=1000 -delay=100ms
```

### Using the Convenience Script

```bash
cd optimum-dev-setup-guide

# Subscribe to topic with threshold
./script/proxy_client.sh subscribe demo 0.7

# Publish messages with threshold and count
./script/proxy_client.sh publish demo 0.5 10
```

### Proxy Client Configuration

| Parameter | Description | Default | Example |
|-----------|-------------|---------|---------|
| `-topic` | Topic name for pub/sub | `demo` | `test-topic` |
| `-threshold` | Delivery threshold (0.0 to 1.0) | `0.1` | `0.7` |
| `-subscribeOnly` | Only subscribe, no publishing | `false` | `true` |
| `-count` | Number of messages to publish | `5` | `100` |
| `-delay` | Delay between message publishing | `2s` | `100ms`, `5s` |

### Proxy Endpoints

The Proxy client uses these endpoints:

- **REST API**: `http://localhost:8081` (Proxy 1) / `http://localhost:8082` (Proxy 2)
- **gRPC Stream**: `localhost:50051` (default)

### REST API Integration

The client first registers via REST API before establishing gRPC streaming:

```bash
# Example REST API call for subscription
curl -X POST http://localhost:8081/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "test_client_001",
    "topic": "demo",
    "threshold": 0.7
  }'
```

## Performance Comparison Usage

Both clients support metrics collection for comparing GossipSub vs OptimumP2P performance:

### P2P Direct Client Metrics

The P2P client receives protocol-specific trace messages:

```go
switch resp.GetCommand() {
case protobuf.ResponseType_MessageTraceGossipSub:
    // GossipSub protocol metrics
case protobuf.ResponseType_MessageTraceOptimumP2P:
    // OptimumP2P protocol metrics
}
```

### Proxy Client Metrics

The Proxy client provides simpler message delivery metrics suitable for application-level performance testing.

### Example Performance Test

```bash
# Terminal 1: Start OptimumP2P subscriber
./script/p2p_client.sh 127.0.0.1:33221 subscribe perf-test

# Terminal 2: Start GossipSub subscriber  
./script/p2p_client.sh 127.0.0.1:33222 subscribe perf-test

# Terminal 3: Publish test messages
./script/p2p_client.sh 127.0.0.1:33221 publish perf-test "random" -count=1000 -sleep=10ms
```

## Integration Examples

### Go Application Integration

```go
package main

import (
    "context"
    "log"
    "math"
    "google.golang.org/grpc"
    "google.golang.org/grpc/credentials/insecure"
    protobuf "p2p_client/grpc"
)

func main() {
    // Connect to P2P node
    conn, err := grpc.NewClient("localhost:33212",
        grpc.WithTransportCredentials(insecure.NewCredentials()),
        grpc.WithDefaultCallOptions(
            grpc.MaxCallRecvMsgSize(math.MaxInt),
            grpc.MaxCallSendMsgSize(math.MaxInt),
        ))
    if err != nil {
        log.Fatal(err)
    }
    defer conn.Close()

    client := protobuf.NewCommandStreamClient(conn)
    stream, err := client.ListenCommands(context.Background())
    if err != nil {
        log.Fatal(err)
    }

    // Subscribe to topic
    subReq := &protobuf.Request{
        Command: 2, // CommandSubscribeToTopic
        Topic:   "my-topic",
    }
    
    if err := stream.Send(subReq); err != nil {
        log.Fatal(err)
    }

    // Listen for messages
    for {
        resp, err := stream.Recv()
        if err != nil {
            log.Fatal(err)
        }
        // Handle response...
    }
}
```

### Protocol Buffer Definitions

Both clients use Protocol Buffers for gRPC communication. The definitions are available in:

- P2P Client: `optimum-dev-setup-guide/grpc_p2p_client/proto/p2p_stream.proto`
- Proxy Client: `optimum-dev-setup-guide/grpc_proxy_client/proto/proxy_stream.proto`

## Troubleshooting

### Connection Issues

#### Error: `connection refused`

```
failed to connect to node dial tcp 127.0.0.1:33212: connect: connection refused
```

**Solutions:**
- Verify P2P nodes are running: `docker-compose ps`
- Check port mapping in docker-compose.yml
- Ensure correct sidecar port (typically 33212)

### Message Delivery Issues

#### No messages received

**Troubleshooting:**
1. Verify topic names match exactly between publisher and subscriber
2. Check P2P node logs: `docker-compose logs p2pnode-1`
3. Ensure nodes are properly connected in mesh topology
4. Verify protocol mode consistency (all nodes using same protocol)

#### Partial message delivery

**For Proxy Client:**
- Adjust threshold parameter (lower values = faster delivery, less reliability)
- Check proxy connectivity to P2P nodes

**For P2P Client:**
- Verify direct connection to healthy P2P node
- Check RLNC configuration parameters

### Build Issues

#### Proto generation errors

```bash
# Regenerate gRPC code if needed
cd grpc_p2p_client
protoc --go_out=. --go-grpc_out=. proto/*.proto
```

#### Module dependency issues

```bash
# Update Go modules
go mod tidy
go mod download
```

## Advanced Usage

### Long-Running Subscriptions

For production deployments, consider:

1. **Connection monitoring**: Implement reconnection logic for network failures
2. **Message persistence**: Store received messages for reliability
3. **Load balancing**: Connect to multiple P2P nodes for redundancy
4. **Metrics collection**: Track message delivery rates and latency

### Custom Message Formats

Both clients support custom message formats. Modify the message structure in:

- P2P Client: `P2PMessage` struct in `p2p_client.go`
- Proxy Client: Message handling in `proxy_client.go`

### Integration with Other Languages

The Protocol Buffer definitions can be used to generate client code for other languages:

```bash
# Python
protoc --python_out=. --grpc_python_out=. proto/*.proto

# JavaScript/Node.js
protoc --js_out=import_style=commonjs:. --grpc-web_out=import_style=commonjs,mode=grpcwebtext:. proto/*.proto

# Java
protoc --java_out=. --grpc-java_out=. proto/*.proto
```

## See Also

- [mump2p CLI Guide](./mump2p-cli.md) - Command-line client for OptimumP2P
- [P2P-Only Deployment](../deployment/p2p-only.md) - Setting up P2P nodes without proxy
- [Proxy + P2P Deployment](../deployment/p2p-with-proxy.md) - Full stack with proxy services
- [OptimumP2P Configuration](../configuration/optimump2p.md) - Protocol configuration parameters
- [GossipSub Configuration](../configuration/gossipsub.md) - Baseline protocol configuration 