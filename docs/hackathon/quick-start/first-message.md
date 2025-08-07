# Your First Message

This tutorial demonstrates how to send your first message through OptimumP2P using the proxy setup. We'll provide all the necessary configuration and code directly in this guide.

## Prerequisites

- Docker and Docker Compose installed
- Basic familiarity with terminal/command line
- Text editor for creating configuration files

## Step 1: Set Up the Network

### Step 1a: Create working directory

```bash
mkdir optimump2p-test
```

### Step 1b: Navigate to directory

```bash
cd optimump2p-test
```

### Step 1c: Create docker-compose.yml

Create a `docker-compose.yml` file with the following content:

```yaml
services:
  proxy-1:
    image: 'getoptimum/proxy:latest'
    platform: linux/amd64  
    ports:
      - "8081:8080" # HTTP Port for the proxy
      - "50051:50051" # gRPC Port for the proxy
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
    image: 'getoptimum/proxy:latest'
    platform: linux/amd64
    ports:
      - "8082:8080" # HTTP Port for the proxy
      - "50052:50051" # gRPC Port for the proxy
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
      - BOOTSTRAP_PEERS=/ip4/172.28.0.12/tcp/7070/p2p/${BOOTSTRAP_PEER_ID}
      - OPTIMUM_PORT=7070
      - OPTIMUM_MAX_MSG_SIZE=1048576
      - OPTIMUM_MESH_TARGET=6
      - OPTIMUM_MESH_MIN=3
      - OPTIMUM_MESH_MAX=12
      - OPTIMUM_SHARD_FACTOR=4
      - OPTIMUM_SHARD_MULT=1.5
      - OPTIMUM_THRESHOLD=0.75
    networks:
      optimum-network:
        ipv4_address: 172.28.0.12
    ports:
      - "33221:33212"
      - "7071:7070"
      - "6061:6060"
      - "9091:9090"

  p2pnode-2:
    image: 'getoptimum/p2pnode:latest'
    platform: linux/amd64
    environment:
      - LOG_LEVEL=debug
      - CLUSTER_ID=p2pnode-1
      - NODE_MODE=optimum
      - SIDECAR_PORT=33212
      - API_PORT=9090
      - IDENTITY_DIR=/identity
      - BOOTSTRAP_PEERS=/ip4/172.28.0.12/tcp/7070/p2p/${BOOTSTRAP_PEER_ID}
      - OPTIMUM_PORT=7070
      - OPTIMUM_MAX_MSG_SIZE=1048576
      - OPTIMUM_MESH_TARGET=6
      - OPTIMUM_MESH_MIN=3
      - OPTIMUM_MESH_MAX=12
      - OPTIMUM_SHARD_FACTOR=4
      - OPTIMUM_SHARD_MULT=1.5
      - OPTIMUM_THRESHOLD=0.75
    networks:
      optimum-network:
        ipv4_address: 172.28.0.13
    ports:
      - "33222:33212"
      - "7072:7070"
      - "6062:6060"
      - "9092:9090"

  p2pnode-3:
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
        ipv4_address: 172.28.0.14
    ports:
      - "33223:33212"
      - "7073:7070"
      - "6063:6060"
      - "9093:9090"

  p2pnode-4:
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
        ipv4_address: 172.28.0.15
    ports:
      - "33224:33212"
      - "7074:7070"
      - "6064:6060"
      - "9094:9090"

networks:
  optimum-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16
```

## Step 2: Start the Network

### Step 2a: Generate peer identity

```bash
# Create identity directory if using local setup
mkdir -p identity
```

### Step 2b: Set environment variable

```bash
# Set the bootstrap peer ID environment variable
export BOOTSTRAP_PEER_ID=12D3KooWExample  # This will be generated automatically
```

### Step 2c: Start all services

```bash
docker-compose up -d
```

### Step 2d: Verify services are running

```bash
docker-compose ps
```

You should see containers for:
- proxy-1 (port 8081)
- proxy-2 (port 8082) 
- p2pnode-1, p2pnode-2, p2pnode-3, p2pnode-4

## Step 3: Test Proxy Connectivity

Before we start sending messages, let's make sure the proxy services are working correctly. The proxy provides REST API endpoints for publishing and subscribing to messages.

### Step 3a: Test First Proxy

Test the connection to proxy-1:

```bash
# Test proxy-1 (should return HTTP headers if working)
curl -I http://localhost:8081
```

**Expected output:** You should see HTTP response headers starting with `HTTP/1.1 200 OK` or similar.

### Step 3b: Test Second Proxy

Test the connection to proxy-2:

```bash
# Test proxy-2 (should return HTTP headers if working)
curl -I http://localhost:8082
```

**Expected output:** Similar HTTP response headers, confirming both proxies are running.

**Troubleshooting:** If you get "connection refused" errors, check that your Docker containers are running with `docker-compose ps`.

## Step 4: Create the Proxy Client

Let's create a Go client application that makes it easy to interact with the proxy.

### Step 4a: Create client directory

```bash
mkdir grpc_proxy_client
cd grpc_proxy_client
```

### Step 4b: Initialize Go module

```bash
go mod init proxy_client
```

### Step 4c: Add dependencies

```bash
go get google.golang.org/grpc
go get google.golang.org/protobuf
```

### Step 4d: Create protobuf definition

Create a `proto/proxy_stream.proto` file:

```bash
mkdir proto
```

Create `proto/proxy_stream.proto` with this content:

```protobuf
syntax = "proto3";

package proto;

option go_package = "optimum-proxy/proto;proto";

service ProxyStream {
  rpc ClientStream (stream ProxyMessage) returns (stream ProxyMessage);
}

message ProxyMessage {
  string client_id = 1;
  bytes message = 2;
  string topic = 3;
  string message_id = 4;
  string type = 5; 
}
```

### Step 4e: Generate protobuf code

```bash
mkdir grpc
protoc --go_out=grpc --go-grpc_out=grpc proto/proxy_stream.proto
```

### Step 4f: Create the client code

Create `proxy_client.go` with this content:

```go
package main

import (
	"bytes"
	"context"
	crand "crypto/rand"
	"encoding/hex"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"math"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"time"

	protobuf "proxy_client/grpc"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/keepalive"
)

const (
	proxyREST        = "http://localhost:8081"
	proxyGRPC        = "localhost:50051"
	defaultTopic     = "demo"
	defaultThreshold = 0.1
	defaultMsgCount  = 5
	defaultDelay     = 2 * time.Second
)

var (
	topic         = flag.String("topic", defaultTopic, "topic name")
	threshold     = flag.Float64("threshold", defaultThreshold, "delivery threshold (0.0 to 1.0)")
	subscribeOnly = flag.Bool("subscribeOnly", false, "only subscribe and receive messages (no publishing)")
	messageCount  = flag.Int("count", defaultMsgCount, "number of messages to publish")
	messageDelay  = flag.Duration("delay", defaultDelay, "delay between message publishing")

	keepaliveTime    = flag.Duration("keepalive-interval", 2*time.Minute, "gRPC keepalive interval")
	keepaliveTimeout = flag.Duration("keepalive-timeout", 20*time.Second, "gRPC keepalive timeout")

	words = []string{"hello", "ping", "update", "broadcast", "status", "message", "event", "data", "note"}
)

func main() {
	flag.Parse()

	clientID := generateClientID()
	log.Printf("[INFO] Client ID: %s | Topic: %s | Threshold: %.2f", clientID, *topic, *threshold)

	if err := subscribe(clientID, *topic, *threshold); err != nil {
		log.Fatalf("subscribe error: %v", err)
	}

	conn, err := grpc.NewClient(proxyGRPC,
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
		}),
	)
	if err != nil {
		log.Fatalf("gRPC connection failed: %v", err)
	}
	defer conn.Close()

	client := protobuf.NewProxyStreamClient(conn)
	stream, err := client.ClientStream(context.Background())
	if err != nil {
		log.Fatalf("stream open failed: %v", err)
	}

	if err := stream.Send(&protobuf.ProxyMessage{ClientId: clientID}); err != nil {
		log.Fatalf("client ID send failed: %v", err)
	}

	go func() {
		for {
			resp, err := stream.Recv()
			if err == io.EOF {
				log.Println("[CLOSED] gRPC stream closed by server")
				return
			}
			if err != nil {
				log.Printf("[ERROR] stream receive: %v", err)
				return
			}
			log.Printf("[RECEIVED] Topic: %s | Message: %s", resp.Topic, string(resp.Message))
		}
	}()

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	go func() {
		<-c
		log.Println("[INTERRUPTED] shutting down...")
		os.Exit(0)
	}()

	if *subscribeOnly {
		select {}
	}

	for i := 0; i < *messageCount; i++ {
		msg := generateRandomMessage()
		log.Printf("[PUBLISH] Message: %s", msg)
		if err := publishMessage(clientID, *topic, msg); err != nil {
			log.Printf("[ERROR] publish failed: %v", err)
		}
		time.Sleep(*messageDelay)
	}

	time.Sleep(3 * time.Second)
}

func subscribe(clientID, topic string, threshold float64) error {
	body := map[string]interface{}{
		"client_id": clientID,
		"topic":     topic,
		"threshold": threshold,
	}
	data, _ := json.Marshal(body)
	resp, err := http.Post(proxyREST+"/api/subscribe", "application/json", bytes.NewReader(data))
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	io.Copy(io.Discard, resp.Body)
	return nil
}

func publishMessage(clientID, topic, msg string) error {
	body := map[string]interface{}{
		"client_id": clientID,
		"topic":     topic,
		"message":   msg,
	}
	data, _ := json.Marshal(body)
	resp, err := http.Post(proxyREST+"/api/publish", "application/json", bytes.NewReader(data))
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	io.Copy(io.Discard, resp.Body)
	return nil
}

func generateClientID() string {
	b := make([]byte, 4)
	_, _ = crand.Read(b)
	return "client_" + hex.EncodeToString(b)
}

func generateRandomMessage() string {
	return fmt.Sprintf("%s @ %s", words[rand.Intn(len(words))], time.Now().Format("15:04:05"))
}
```

### Step 4g: Build the client

```bash
go build -o proxy-client ./proxy_client.go
```

## Step 5: Subscribe to Messages

Now we'll set up a message subscriber. This is like tuning into a radio station - once subscribed, you'll receive all messages published to that topic.

### Step 5a: Open a New Terminal

Open a **new terminal window** and navigate to your project directory:

```bash
# Make sure you're in the right directory
cd optimump2p-test
```

### Step 5b: Start the Subscriber

In this terminal, start listening for messages:

```bash
# Subscribe to topic "demo" with threshold 0.7
./proxy-client -topic=demo -threshold=0.7 -subscribeOnly
```

**What this command does:**
- `subscribe`: Tells the client to listen for messages
- `demo`: The topic name we're subscribing to
- `0.7`: The threshold value (higher = more reliable message reconstruction)

### Step 5c: Understand the Subscriber Output

The subscriber will:
1. **Register** with the proxy via REST API (`/api/subscribe`)
2. **Open** a gRPC stream to receive messages in real-time
3. **Display** received messages in the format: `[RECEIVED] Topic: <topic> | Message: <message>`

**Keep this terminal open** - it will show incoming messages as they arrive.

## Step 6: Publish Messages

Now let's send some messages! We'll use a second terminal to publish messages while watching them appear in the subscriber terminal.

### Step 6a: Open Another Terminal

Open a **second new terminal window** and navigate to your project directory:

```bash
# Navigate to the project directory
cd optimump2p-test
```

### Step 6b: Send Messages

Publish messages to the same topic:

```bash
# Publish 5 messages to topic "demo" with threshold 0.5
./proxy-client -topic=demo -threshold=0.5 -count=5
```

**What this command does:**
- `publish`: Tells the client to send messages
- `demo`: The topic name (must match the subscriber's topic)
- `0.5`: The threshold for message encoding
- `5`: Number of messages to send

### Step 6c: Watch the Results

The publisher will:
1. **Send** messages via REST API (`/api/publish`)
2. **Display** each published message in the format: `[PUBLISH] Message: <message>`

**In your subscriber terminal** (from Step 5), you should see the messages being received in real-time.

### Step 6d: Verify Message Flow

Check that:
- The **publisher terminal** shows: `[PUBLISH] Message: Message 1`, `[PUBLISH] Message: 2`, etc.
- The **subscriber terminal** shows: `[RECEIVED] Topic: demo | Message: Message 1`, etc.

This confirms that messages are flowing correctly through the OptimumP2P network!

## Step 7: Alternative REST API Usage

You can also interact directly with the REST API using curl:

```bash
curl -X POST http://localhost:8081/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "test_client_001",
    "topic": "demo", 
    "threshold": 0.7
  }'
```

**What this does:**
- **POST request** to the subscription endpoint
- **client_id**: Unique identifier for your client
- **topic**: The topic you want to subscribe to
- **threshold**: Message reliability setting

**Important note:** This only registers the subscription. To actually receive messages, you'd need to separately open a gRPC stream (which the script handles automatically).

### Step 7c: Publish via REST API

Send a message using a direct HTTP request:

```bash
curl -X POST http://localhost:8081/api/publish \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "test_client_001",
    "topic": "demo",
    "message": "Hello from REST API"
  }'
```

**What this does:**
- **POST request** to the publish endpoint
- **client_id**: Same client ID as used for subscription
- **topic**: Must match your subscription topic
- **message**: The actual message content to send

### Step 7d: Test the REST API

To see this working:

1. **Keep your subscriber running** from Step 5 (if still open)
2. **Run the publish curl command** from Step 7c
3. **Check your subscriber terminal** - you should see: `[RECEIVED] Topic: demo | Message: Hello from REST API`

This demonstrates that REST API publishing works with script-based subscribing (and vice versa).

## Step 8: Multiple Topics

OptimumP2P supports multiple topics running simultaneously. This means different applications or message types can be isolated from each other. Let's test this feature by setting up multiple subscribers and publishers.

### Step 8a: Open Multiple Terminal Windows

You'll need **4 separate terminal windows** for this test. Each terminal should be in your project directory:

```bash
# In each new terminal, navigate to your project directory
cd optimump2p-test
```

### Step 8b: Set Up First Topic Subscriber

In **Terminal 1**, subscribe to the "weather" topic:

```bash
# This will listen for weather-related messages
./proxy-client -topic=weather -threshold=0.7 -subscribeOnly
```

**What this does:** Creates a subscriber that will only receive messages published to the "weather" topic.

### Step 8c: Set Up Second Topic Subscriber

In **Terminal 2**, subscribe to the "news" topic:

```bash
# This will listen for news-related messages  
./proxy-client -topic=news -threshold=0.7 -subscribeOnly
```

**What this does:** Creates a second subscriber for a completely different topic. This subscriber won't see weather messages.

### Step 8d: Publish to Weather Topic

In **Terminal 3**, publish messages to the weather topic:

```bash
# Send 3 weather messages
./proxy-client -topic=weather -threshold=0.5 -count=3
```

**Expected result:** Only Terminal 1 (weather subscriber) should show these messages. Terminal 2 (news subscriber) should remain quiet.

### Step 8e: Publish to News Topic

In **Terminal 4**, publish messages to the news topic:

```bash
# Send 3 news messages
./proxy-client -topic=news -threshold=0.5 -count=3
```

**Expected result:** Only Terminal 2 (news subscriber) should show these messages. Terminal 1 (weather subscriber) should not see them.

### Step 8f: Verify Topic Isolation

Check that each subscriber only received messages from their subscribed topic:

- **Terminal 1** should show: `[RECEIVED] Topic: weather | Message: ...`
- **Terminal 2** should show: `[RECEIVED] Topic: news | Message: ...`

This demonstrates that topics are completely isolated from each other.

## Step 9: Load Testing

Now let's test how the network handles high message volumes. This helps you understand the performance characteristics of OptimumP2P.

### Step 9a: Prepare for Load Testing

First, make sure you have a subscriber running to see the messages:

```bash
# In a new terminal, subscribe to the performance topic
./proxy-client -topic=performance -threshold=0.7 -subscribeOnly
```

### Step 9b: Medium Load Test

Start with a moderate load test:

```bash
# Send 100 messages with 100ms delay between each
./proxy-client -topic=performance -threshold=0.5 -count=100 -delay=100ms
```

**What this does:** Sends 100 messages over about 10 seconds (100ms × 100 = 10 seconds).

### Step 9c: High Load Test

For a more intensive test:

```bash
# Send 1000 messages with 10ms delay (very fast)
./proxy-client -topic=stress -threshold=0.5 -count=1000 -delay=10ms
```

**What this does:** Sends 1000 messages over about 10 seconds (10ms × 1000 = 10 seconds).

**Note:** Make sure to set up a subscriber for the "stress" topic if you want to see these messages being received.

## Understanding the Parameters

### Threshold
The threshold parameter (0.0 to 1.0) controls RLNC decoding:
- Lower values: Messages decoded with fewer shards (faster, less reliable)
- Higher values: Messages require more shards (slower, more reliable)
- Typical range: 0.5 to 0.8

### Client ID
Each client needs a unique identifier for the proxy to track subscriptions and route messages correctly.

### Topic Names
- Case-sensitive strings
- No special characters recommended
- Use descriptive names (e.g., "chat", "alerts", "data-feed")

## Monitoring and Debugging

### View logs
```bash
# Proxy logs
docker-compose logs -f proxy-1

# P2P node logs
docker-compose logs -f p2pnode-1

# All logs
docker-compose logs -f
```

### Check network connectivity
```bash
# Test P2P node connectivity
docker-compose exec proxy-1 nc -zv p2pnode-1 33212

# View container network
docker network inspect optimump2p-test_optimum-network
```

## Cleanup

Stop and remove all containers:

```bash
docker-compose down

# Remove volumes and images (optional)
docker-compose down -v --rmi all
```

## Next Steps

Now that you've successfully sent messages through OptimumP2P:

1. **Build custom clients**: Explore the [mump2p-cli](../clients/mump2p-cli.md) or [gRPC Client Examples](../clients/grpc-examples.md)
2. **Optimize configuration**: Learn about [OptimumP2P Configuration](../configuration/optimump2p.md)
3. **Compare protocols**: Review [GossipSub Configuration](../configuration/gossipsub.md)

## Troubleshooting

### Build failures
- Ensure Go is installed: `go version`
- Check module dependencies: `go mod tidy`

### Connection issues
- Verify Docker containers are running: `docker-compose ps`
- Check port availability: `netstat -an | grep 8081`
- Review firewall settings

### Message delivery issues
- Verify topic names match exactly
- Check threshold values are between 0.0 and 1.0
- Review proxy and P2P node logs for errors

### Performance issues
- Monitor container resources: `docker stats`
- Adjust message delay parameters
- Check network bandwidth and latency 