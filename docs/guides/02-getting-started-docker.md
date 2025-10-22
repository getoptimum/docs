# Getting Started with Docker (Local Deployment)

Running **Optimum Network** locally with Docker gives you **full control** over configuration, topology, and experiments.  
You can run the network in two primary ways:

**1. OptimumProxy + mump2p** — Clients connect to an **Optimum Proxy**, which manages P2P connections for them.

![OptimumProxy + mump2p Architecture](../../static/img/docker_1.png)

* Simplifies client configuration — only the Proxy address is needed.
* Proxy handles shard reassembly, threshold logic, and node selection automatically.
* Easier scaling and centralized policy control.

**2. Direct mump2p** — Clients connect directly to **mump2p nodes** (each node must run the gRPC API).

![Direct mump2p Architecture](../../static/img/docker_2.png)

* Fewer network hops = potentially lower latency.
* Clients must know node addresses and manage failover logic.
* Best for specialized or performance-critical workloads.


While the [mump2p-cli (Hosted Proxy)](./01-getting-started-cli.md) lets you get started instantly,  
local deployment offers:

* **Custom Configuration** — Tune thresholds, shard factors, and mesh sizes.
* **Full Control** — Decide how many nodes, their topology, and resource allocation.
* **Private Testing** — Run in isolated networks without using public proxies.
* **Advanced Experiments** — Simulate network conditions, failure scenarios, and scaling.

## Which mode should I use?

Choose the deployment mode that best fits your use case:

| **Mode A: Proxy + mump2p** | **Mode B: Direct mump2p** |
|---|---|
| **One endpoint** — simpler client config | **Lowest latency** — fewer network hops |
| **Policy control** — rate limiting, auth | **Direct control** — no proxy overhead |
| **Auto failover** — proxy handles node selection | **Manual failover** — clients manage addresses |

**Quick Decision:**

* **Want simpler setup and client code?** → **[Start with Mode A](#5-mode-a--optimumproxy--mump2p-recommended)**  
* **Need maximum performance and control?** → **[Jump to Mode B](#6-mode-b--direct-mump2p-advanced--lower-latency)**

## 1. Before You Start

### Requirements

* **[Docker](https://docs.docker.com/engine/install/)** — Container runtime for running Optimum Network components
* **[Docker Compose](https://docs.docker.com/compose/install/)** — Tool for defining multi-container applications  
* **[Go v1.24+](https://golang.org/dl/)** — Required for building custom gRPC clients
* At least **2 GB free RAM** for running multiple nodes locally

> **Quick Docker Install:**
> 
> * **Linux**: `curl -fsSL https://get.docker.com | sh`
> * **macOS**: [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
> * **Windows**: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)  

### Components

| Component           | Purpose                                                                                                                                 | Docker Images               |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| **mump2p Node** | RLNC-enabled mesh peer, encodes/decodes message shards, handles peer discovery and subscriptions. Optional gRPC API for direct clients. | `getoptimum/p2pnode:v0.0.1-rc2` |
| **Optimum Proxy**   | Bridges clients and the mesh, manages subscriptions, shard reassembly, threshold logic, and node selection.                             | `getoptimum/proxy:v0.0.1-rc3`   |



### Directory layout

Create a clean working folder:

```sh
mkdir -p ~/optimum-local/{proxy-p2p,direct-p2p,identity}
cd ~/optimum-local
```

We’ll keep identity in `./identity` folder so you can reuse keys across restarts.



## 2. Pick Your Mode

| Recommended mode              | Why                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| **OptimumProxy + mump2p** | One endpoint for clients, proxy handles matching, decoding thresholds, fanout, and policy |
| **Direct mump2p**         | Fewer hops, you control connection/retry logic and node selection                         |


## 3. Environment Configuration

Before starting, create your `.env` file:

```bash
cp .env.example .env
```

Edit with your values:

```bash
BOOTSTRAP_PEER_ID=<your-generated-peer-id>
CLUSTER_ID=my-cluster
PROXY_VERSION=v0.0.1-rc7
P2P_NODE_VERSION=v0.0.1-rc6
```

> **Complete Guide:** [Environment configuration](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md#environment-variables-env)

## 4. Generate a Bootstrap Identity

Generate P2P identity for node discovery:

```bash
make generate-identity
```

This creates `./identity/p2p.key` with your unique Peer ID.

> **Complete Guide:** [Identity generation and Makefile commands](https://github.com/getoptimum/optimum-dev-setup-guide#quick-start) - all make commands, direct binary usage

## 5. Mode A — OptimumProxy + mump2p (Recommended)

### Docker Compose Setup

**Key points:**

* Use `.env` variables for versions and cluster ID
* Network uses static IPs for deterministic bootstrap addresses
* Bootstrap node (p2pnode-1) needs identity volume mount
* Production setup uses 2 proxies and 4 P2P nodes

**Simplified example:**

```yaml
services:
  proxy-1:
    image: 'getoptimum/proxy:${PROXY_VERSION-latest}'
    environment:
      - CLUSTER_ID=${CLUSTER_ID}
      - P2P_NODES=p2pnode-1:33212,p2pnode-2:33212
    ports:
      - "8081:8080"
      - "50051:50051"

  p2pnode-1:
    image: 'getoptimum/p2pnode:${P2P_NODE_VERSION-latest}'
    volumes:
      - ./identity:/identity
    environment:
      - CLUSTER_ID=${CLUSTER_ID}
      - NODE_MODE=optimum
      - IDENTITY_DIR=/identity
```

> **Complete Docker Compose:**
>
> * [Full configuration with 2 proxies + 4 nodes](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docker-compose-optimum.yml)
> * [All environment variables](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md#p2p-node-variables)

### Start the Network

```sh
export BOOTSTRAP_PEER_ID=<your-peer-id>
docker compose up -d
```

### Verify Health

```sh
# Check containers
docker compose ps

# Test endpoints
curl http://localhost:8081/api/v1/health  # Proxy
curl http://localhost:9091/api/v1/health  # P2P node
```

> **Complete Testing Guide:** [Health checks and validation](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md#3-verification)

### Send & receive (Proxy mode) using mump2p-cli

If you haven't already installed `mump2p-cli`, see the [**Getting Started with mump2p-cli**](./01-getting-started-cli.md) chapter.

**Subscribe:**

```sh
./mump2p subscribe --topic=demo --service-url=http://localhost:8081
```

**Publish (in a new terminal):**

```sh
./mump2p publish --topic=demo --message="Hello via Proxy" --service-url=http://localhost:8081
```

You should see your subscriber print the message immediately.


### Use Proxy via REST API (Optional)

**Basic commands:**

```sh
# Publish
curl -X POST http://localhost:8081/api/v1/publish \
  -H "Content-Type: application/json" \
  -d '{"client_id":"test","topic":"demo","message":"Hello"}'

# Subscribe
curl -X POST http://localhost:8081/api/v1/subscribe \
  -H "Content-Type: application/json" \
  -d '{"client_id":"test","topic":"demo","threshold":0.1}'

# WebSocket
wscat -c "ws://localhost:8081/api/v1/ws?client_id=test"
```

> **Complete API Reference:** [Proxy REST and WebSocket API](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md#proxy-rest-api) - parameters, rate limits, authentication

### Use Proxy via gRPC (Optional)

For gRPC bidirectional streaming (higher performance than WebSocket):

> **Complete Implementation:**
>
> * [Proxy gRPC Client Source](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/grpc_proxy_client/proxy_client.go)
> * [Setup and Usage Guide](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md#grpc-proxy-client-implementation)
> * REST subscription + gRPC streaming + flow control settings

## 6. Mode B — Direct mump2p (Advanced / Lower Latency)

In this mode, clients connect directly to node sidecar gRPC (no proxy).

### Docker Compose Setup

**Simplified example:**

```yaml
services:
  p2pnode-1:
    image: 'getoptimum/p2pnode:${P2P_NODE_VERSION-latest}'
    volumes:
      - ./identity:/identity
    environment:
      - CLUSTER_ID=${CLUSTER_ID}
      - NODE_MODE=optimum
      - IDENTITY_DIR=/identity
    ports:
      - "33221:33212"
```

> **Complete Docker Compose:** [Full configuration for direct P2P mode](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docker-compose-optimum.yml)

### Start and Verify

```sh
export BOOTSTRAP_PEER_ID=<your-peer-id>
docker compose up -d
curl http://localhost:9091/api/v1/health
```

### Use P2P Client Directly

Connect using the P2P client with trace handling and metrics:

```bash
# Subscribe
./p2p-client -mode=subscribe -topic=testtopic --addr=127.0.0.1:33221

# Publish
./p2p-client -mode=publish -topic=testtopic -msg="Hello" --addr=127.0.0.1:33222
```

> **Complete Implementation:**
>
> * [P2P Client Source](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/grpc_p2p_client/p2p_client.go)
> * [Usage Guide with Makefile commands](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md#using-p2p-nodes-directly-optional--no-proxy)
> * [Message format explanation](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md#understanding-message-output-format)

For all configuration variables, see the [Parameters Section](./03-parameters.md).

## Troubleshooting

### "Connection refused" from client

* Ensure you’re pointing to the host-mapped ports (e.g., 33221, 8081).
* Run docker compose ps and confirm port bindings.
* Firewalls: allow inbound localhost traffic.

### Proxy can’t reach nodes

* Inside the proxy container, resolve and ping node hosts:

```sh
docker compose exec proxy sh -lc 'nc -zv p2pnode-1 33212'
```

* Make sure `P2P_NODES` hostnames match the `service names` in compose.

### Port conflicts

* Change host mappings in ports: (e.g., 33223:33212, 9093:9090, 7073:7070).

### Protocol mismatch

* All nodes in a mesh must use the same NODE_MODE (optimum or gossipsub).

### Stop and Clean

Stop:

```sh
docker compose down
```

Full reset (containers, volumes, images created by this compose file):

```sh
docker compose down -v --rmi local
```
