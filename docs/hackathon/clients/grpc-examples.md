# gRPC Client Examples

This guide demonstrates how to build and use gRPC clients for direct integration with OptimumP2P networks, covering both P2P-only and Proxy deployment scenarios.

## Overview

OptimumP2P provides two gRPC client integration patterns:

1. **P2P Direct Client** - Connect directly to P2P node sidecar (for P2P-only deployments)
2. **Proxy Client** - Connect through the Proxy service (for Proxy + P2P deployments)

## P2P Direct Client

The P2P direct client connects to individual P2P node sidecar gRPC endpoints for direct protocol interaction.

### Creating the P2P Client

The P2P client code is provided below. Create the following directory structure:

```
grpc_p2p_client/
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

#### Step 1: Create the directory and initialize Go module

```bash
mkdir grpc_p2p_client
cd grpc_p2p_client
go mod init p2p_client
```

#### Step 2: Add dependencies

```bash
go get google.golang.org/grpc
go get google.golang.org/protobuf
```

#### Step 3: Create protobuf definition

Create `proto/p2p_stream.proto`:

```bash
mkdir proto
```

Create `proto/p2p_stream.proto` with this content:

```protobuf
syntax = "proto3";

package proto;

option go_package = "optimum-gateway/proto;proto";

service CommandStream {
  rpc ListenCommands (stream Request) returns (stream Response) {}
  rpc Health (Void) returns (HealthResponse) {}
  rpc ListTopics(Void) returns (TopicList) {}
}

message Void {}

message HealthResponse {
  bool status = 1;
  string nodeMode = 2;
  float memoryUsed = 3;
  float cpuUsed = 4;
  float diskUsed = 5;
}

enum ResponseType {
  Unknown = 0;
  Message = 1;
  MessageTraceOptimumP2P = 2;
  MessageTraceGossipSub = 3;
}

message Request {
  int32 command = 1;
  bytes data = 2;
  string topic = 3;
}

message Response {
  ResponseType command = 1;
  bytes data = 2;
  bytes metadata = 3;
}

message TopicList {
  repeated string topics = 1;
}
```

#### Step 4: Generate protobuf code

```bash
mkdir grpc
protoc --go_out=grpc --go-grpc_out=grpc proto/p2p_stream.proto
```

#### Step 5: Create the client code

Create `p2p_client.go` with this content:

```go
package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"math"
	"os"
	"os/signal"
	"strings"
	"sync/atomic"
	"syscall"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/keepalive"
	"google.golang.org/grpc/status"

	protobuf "p2p_client/grpc"
)

type P2PMessage struct {
	MessageID    string
	Topic        string
	Message      []byte
	SourceNodeID string
}

type Command int32

const (
	CommandUnknown Command = iota
	CommandPublishData
	CommandSubscribeToTopic
	CommandUnSubscribeToTopic
)

var (
	addr    = flag.String("addr", "localhost:33212", "sidecar gRPC address")
	mode    = flag.String("mode", "subscribe", "mode: subscribe | publish")
	topic   = flag.String("topic", "", "topic name")
	message = flag.String("msg", "", "message data (for publish)")

	count = flag.Int("count", 1, "number of messages to publish (for publish mode)")
	sleep = flag.Duration("sleep", 0, "optional delay between publishes (e.g., 1s, 500ms)")

	keepaliveTime    = flag.Duration("keepalive-interval", 2*time.Minute, "gRPC keepalive ping interval")
	keepaliveTimeout = flag.Duration("keepalive-timeout", 20*time.Second, "gRPC keepalive ping timeout")
)

func main() {
	flag.Parse()
	if *topic == "" {
		log.Fatalf("−topic is required")
	}

	conn, err := grpc.NewClient(*addr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithInitialWindowSize(1024*1024*1024),
		grpc.WithInitialConnWindowSize(1024*1024*1024),
		grpc.WithDefaultCallOptions(
			grpc.MaxCallRecvMsgSize(math.MaxInt),
			grpc.MaxCallSendMsgSize(math.MaxInt),
		),
		grpc.WithKeepaliveParams(keepalive.ClientParameters{
			Time:                *keepaliveTime,
			Timeout:             *keepaliveTimeout,
			PermitWithoutStream: false,
		}))
	if err != nil {
		log.Fatalf("failed to connect to node %v", err)
	}
	defer conn.Close()

	client := protobuf.NewCommandStreamClient(conn)
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	stream, err := client.ListenCommands(ctx)
	if err != nil {
		log.Fatalf("ListenCommands: %v", err)
	}

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-c
		fmt.Println("\nshutting down…")
		cancel()
		os.Exit(0)
	}()

	switch *mode {
	case "subscribe":
		subReq := &protobuf.Request{
			Command: int32(CommandSubscribeToTopic),
			Topic:   *topic,
		}
		if err := stream.Send(subReq); err != nil {
			log.Fatalf("send subscribe: %v", err)
		}
		fmt.Printf("Subscribed to topic %q, waiting for messages…\n", *topic)

		var receivedCount int32
		msgChan := make(chan *protobuf.Response, 10000)

		go func() {
			for {
				resp, err := stream.Recv()
				if err == io.EOF {
					close(msgChan)
					return
				}
				if err != nil {
					if st, ok := status.FromError(err); ok {
						msg := st.Message()
						if strings.Contains(msg, "ENHANCE_YOUR_CALM") || strings.Contains(msg, "too_many_pings") {
							log.Printf("Connection closed due to keepalive ping limit.")
							close(msgChan)
							return
						}
					}
					log.Printf("recv error: %v", err)
					close(msgChan)
					return
				}
				msgChan <- resp
			}
		}()

		for {
			select {
			case <-ctx.Done():
				log.Printf("Context canceled. Total messages received: %d", atomic.LoadInt32(&receivedCount))
				return
			case resp, ok := <-msgChan:
				if !ok {
					log.Printf("Stream closed. Total messages received: %d", atomic.LoadInt32(&receivedCount))
					return
				}
				go func(resp *protobuf.Response) {
					handleResponse(resp, &receivedCount)
				}(resp)
			}
		}

	case "publish":
		if *message == "" && *count == 1 {
			log.Fatalf("−msg is required in publish mode")
		}
		for i := 0; i < *count; i++ {
			var data []byte
			if *count == 1 {
				data = []byte(*message)
			} else {
				randomBytes := make([]byte, 4)
				if _, err := rand.Read(randomBytes); err != nil {
					log.Fatalf("failed to generate random bytes: %v", err)
				}
				randomSuffix := hex.EncodeToString(randomBytes)
				data = []byte(fmt.Sprintf("P2P message %d - %s", i+1, randomSuffix))
			}

			pubReq := &protobuf.Request{
				Command: int32(CommandPublishData),
				Topic:   *topic,
				Data:    data,
			}
			if err := stream.Send(pubReq); err != nil {
				log.Fatalf("send publish: %v", err)
			}
			fmt.Printf("Published %q to %q\n", string(data), *topic)

			if *sleep > 0 {
				time.Sleep(*sleep)
			}
		}

	default:
		log.Fatalf("unknown mode %q", *mode)
	}
}

func handleResponse(resp *protobuf.Response, counter *int32) {
	switch resp.GetCommand() {
	case protobuf.ResponseType_Message:
		var p2pMessage P2PMessage
		if err := json.Unmarshal(resp.GetData(), &p2pMessage); err != nil {
			log.Printf("Error unmarshalling message: %v", err)
			return
		}
		n := atomic.AddInt32(counter, 1)
		fmt.Printf("[%d] Received message: %q\n", n, string(p2pMessage.Message))
	case protobuf.ResponseType_MessageTraceGossipSub:
	case protobuf.ResponseType_MessageTraceOptimumP2P:
	case protobuf.ResponseType_Unknown:
	default:
		log.Println("Unknown response command:", resp.GetCommand())
	}
}
```

#### Step 6: Build the client

```bash
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

### Using a Convenience Script (Optional)

You can create a helper script `p2p_client.sh` for easier usage:

```bash
#!/usr/bin/env bash
set -e

P2P_CLIENT_DIR="./grpc_p2p_client"

cd "$P2P_CLIENT_DIR"

go build -o p2p-client ./p2p_client.go

if [ -z "${1:-}" ]; then
  echo "Usage: $0 <addr> (subscribe <topic>)|(publish <topic> <message|\"random\"> [options])" >&2
  exit 1
fi

ADDR="$1"
shift

case "${1:-}" in
  subscribe)
    TOPIC="$2"
    shift 2
    ./p2p-client -mode=subscribe -topic="$TOPIC" --addr="$ADDR" "$@"
    ;;
  publish)
    TOPIC="$2"
    MESSAGE="$3"
    shift 3
    if [[ "$MESSAGE" == "random" ]]; then
      ./p2p-client -mode=publish -topic="$TOPIC" --addr="$ADDR" "$@"
    else
      ./p2p-client -mode=publish -topic="$TOPIC" -msg="$MESSAGE" --addr="$ADDR" "$@"
    fi
    ;;
  *)
    echo "Usage: $0 <addr> (subscribe <topic>)|(publish <topic> <message> [options])" >&2
    exit 1
    ;;
esac
```

Then use it like:

```bash
# Subscribe to topic
./p2p_client.sh 127.0.0.1:33221 subscribe test-topic

# Publish a message
./p2p_client.sh 127.0.0.1:33221 publish test-topic "Hello World"

# Publish multiple random messages
./p2p_client.sh 127.0.0.1:33221 publish test-topic "random" -count=100 -sleep=200ms
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

### Creating the Proxy Client

The Proxy client code is provided in the [Quick Start Guide](../quick-start/first-message.md#step-4-create-the-proxy-client). Follow those steps to create the complete proxy client with all necessary files.

### Client Features

- REST API registration with threshold-based subscription
- gRPC streaming for real-time message delivery
- Automatic message publishing with configurable rate
- Load balancing across multiple proxy instances

### Building the Proxy Client

Refer to the [Quick Start Guide Steps 4a-4g](../quick-start/first-message.md#step-4-create-the-proxy-client) for complete build instructions.

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

Refer to the [Quick Start Guide](../quick-start/first-message.md) for examples of using the proxy client directly with command-line flags like:

```bash
# Subscribe to topic with threshold
./proxy-client -topic=demo -threshold=0.7 -subscribeOnly

# Publish messages with threshold and count
./proxy-client -topic=demo -threshold=0.5 -count=10
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
./p2p-client -addr=127.0.0.1:33221 -mode=subscribe -topic=perf-test

# Terminal 2: Start GossipSub subscriber  
./p2p-client -addr=127.0.0.1:33222 -mode=subscribe -topic=perf-test

# Terminal 3: Publish test messages
./p2p-client -addr=127.0.0.1:33221 -mode=publish -topic=perf-test -count=1000 -sleep=10ms
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

Both clients use Protocol Buffers for gRPC communication. The definitions are provided in the code sections above:

- P2P Client: See the protobuf definition in the "Building the P2P Client" section
- Proxy Client: See the [Quick Start Guide](../quick-start/first-message.md#step-4d-create-protobuf-definition)

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
protoc --go_out=grpc --go-grpc_out=grpc proto/*.proto
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