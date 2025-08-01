# Your First Message

This tutorial demonstrates how to send your first message through OptimumP2P using the gateway setup. We'll use the actual configuration and scripts from the development setup guide.

## Prerequisites

- Docker and Docker Compose installed
- Basic familiarity with terminal/command line
- Text editor for creating configuration files

## Step 1: Set Up the Network

Create a working directory and use the provided docker-compose configuration:

```bash
mkdir optimump2p-test
cd optimump2p-test
```

Download the complete setup:
```bash
# Clone the development setup repository
git clone https://github.com/getoptimum/optimum-dev-setup-guide.git
cd optimum-dev-setup-guide
```

Or create your own `docker-compose.yml` using the configuration from the [P2P Network with Gateway](../deployment/p2p-with-gateway.md) guide.

## Step 2: Start the Network

Generate the required peer identity:

```bash
# Create identity directory if using local setup
mkdir -p identity

# Set the bootstrap peer ID environment variable
export BOOTSTRAP_PEER_ID=12D3KooWExample  # This will be generated automatically
```

Start all services:

```bash
docker-compose up -d
```

Verify the services are running:

```bash
docker-compose ps
```

You should see containers for:
- gateway-1 (port 8081)
- gateway-2 (port 8082) 
- p2pnode-1, p2pnode-2, p2pnode-3, p2pnode-4

## Step 3: Test Gateway Connectivity

The gateway provides REST API endpoints for publishing and subscribing. Test connectivity:

```bash
# Test gateway-1
curl -I http://localhost:8081

# Test gateway-2
curl -I http://localhost:8082
```

## Step 4: Build the Gateway Client

The repository includes a Go client for interacting with the gateway:

```bash
cd grpc_gateway_client
go build -o gateway-client ./gateway_client.go
```

## Step 5: Subscribe to Messages

In one terminal window, start a subscriber:

```bash
# Subscribe to topic "demo" with threshold 0.7
./script/gateway_client.sh subscribe demo 0.7
```

The subscriber will:
1. Register with the gateway via REST API (`/api/subscribe`)
2. Open a gRPC stream to receive messages
3. Display received messages in the format: `[RECEIVED] Topic: <topic> | Message: <message>`

## Step 6: Publish Messages

In another terminal window, publish messages:

```bash
# Publish 5 messages to topic "demo" with threshold 0.5
./script/gateway_client.sh publish demo 0.5 5
```

The publisher will:
1. Send messages via REST API (`/api/publish`)
2. Display each published message in the format: `[PUBLISH] Message: <message>`

## Step 7: Alternative REST API Usage

You can also interact directly with the REST API using curl:

### Subscribe via REST (requires separate gRPC stream for receiving)
```bash
curl -X POST http://localhost:8081/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "test_client_001",
    "topic": "demo", 
    "threshold": 0.7
  }'
```

### Publish via REST
```bash
curl -X POST http://localhost:8081/api/publish \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "test_client_001",
    "topic": "demo",
    "message": "Hello from REST API"
  }'
```

## Step 8: Multiple Topics

Test topic isolation by using different topic names:

```bash
# Terminal 1: Subscribe to "weather"
./script/gateway_client.sh subscribe weather 0.7

# Terminal 2: Subscribe to "news"  
./script/gateway_client.sh subscribe news 0.7

# Terminal 3: Publish to "weather"
./script/gateway_client.sh publish weather 0.5 3

# Terminal 4: Publish to "news"
./script/gateway_client.sh publish news 0.5 3
```

Each subscriber will only receive messages from their subscribed topic.

## Step 9: Load Testing

Test network performance with higher message volumes:

```bash
# High-frequency publishing (100 messages with 100ms delay)
./gateway-client -topic=performance -threshold=0.5 -count=100 -delay=100ms

# Stress test (1000 messages)
./gateway-client -topic=stress -threshold=0.5 -count=1000 -delay=10ms
```

## Understanding the Parameters

### Threshold
The threshold parameter (0.0 to 1.0) controls RLNC decoding:
- Lower values: Messages decoded with fewer shards (faster, less reliable)
- Higher values: Messages require more shards (slower, more reliable)
- Typical range: 0.5 to 0.8

### Client ID
Each client needs a unique identifier for the gateway to track subscriptions and route messages correctly.

### Topic Names
- Case-sensitive strings
- No special characters recommended
- Use descriptive names (e.g., "chat", "alerts", "data-feed")

## Monitoring and Debugging

### View logs
```bash
# Gateway logs
docker-compose logs -f gateway-1

# P2P node logs
docker-compose logs -f p2pnode-1

# All logs
docker-compose logs -f
```

### Check network connectivity
```bash
# Test P2P node connectivity
docker-compose exec gateway-1 nc -zv p2pnode-1 33212

# View container network
docker network inspect optimum-dev-setup-guide_optimum-network
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
- Review gateway and P2P node logs for errors

### Performance issues
- Monitor container resources: `docker stats`
- Adjust message delay parameters
- Check network bandwidth and latency 