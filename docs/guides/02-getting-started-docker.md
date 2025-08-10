# Getting Started with Docker (Local Deployment)

Running **OptimumP2P** locally with Docker gives you **full control** over configuration, topology, and experiments.  
You can run the network in two primary ways:

1. **OptimumProxy + OptimumP2P** — Clients connect to an **Optimum Proxy**, which manages P2P connections for them.
2. **Direct OptimumP2P** — Clients connect directly to **OptimumP2P nodes** (each node must run the gRPC API).

While the [mump2p-cli (Hosted Proxy)](./01-getting-started-cli.md) lets you get started instantly,  
local deployment offers:

* **Custom Configuration** — Tune thresholds, shard factors, and mesh sizes.
* **Full Control** — Decide how many nodes, their topology, and resource allocation.
* **Private Testing** — Run in isolated networks without using public proxies.
* **Advanced Experiments** — Simulate network conditions, failure scenarios, and scaling.

## 1. Requirements

* **Docker**  
* **Docker Compose**
* **Go v1.24+**  
* At least **2 GB free RAM** for running multiple nodes locally  

## 2. Components

| Component       | Purpose | Docker Images |
|-----------------|---------|---------------|
| **OptimumP2P Node** | RLNC-enabled mesh peer, encodes/decodes message shards, handles peer discovery and subscriptions. Optional gRPC API for direct clients. | `getoptimum/p2pnode:latest` |
| **Optimum Proxy**   | Bridges clients and the mesh, manages subscriptions, shard reassembly, threshold logic, and node selection. | `getoptimum/proxy:latest` |


## Architecture Overview

### **Option A — OptimumProxy + OptimumP2P** (recommended)

<!-- TODO:: diagram -->
```plaintext
[Client (CLI / gRPC)] → [Optimum Proxy] → [OptimumP2P Mesh]
```

* Simplifies client configuration — only the Proxy address is needed.
* Proxy handles shard reassembly, threshold logic, and node selection.
* Easier scaling and centralized policy control.

### 2. Option B — Direct OptimumP2P (advanced/low-latency)

<!-- TODO:: diagram -->
```plaintext
[Client (gRPC)] → [OptimumP2P Node] ↔ [OptimumP2P Mesh]
```

* Fewer network hops = potentially lower latency.
* Clients must know node addresses and manage failover.
* Best for specialized or performance-critical workloads.

This guide covers:

* Setting up Docker Compose for both approach.
* Running and verifying the network.
* Connecting via CLI (`mump2p-cli`) or `gRPC clients` (Go examples included).
* Adjusting key parameters for your environment.



## 2. Key Components

### **OptimumP2P Node**

* Participates in the RLNC-enabled mesh.
* Encodes/decodes message shards.
* Handles peer discovery and topic subscriptions.
* Optional: exposes a gRPC API for **Direct P2P** clients.

### **Optimum Proxy**

* Accepts gRPC or WebSocket connections from clients.
* Publishes/subscribes to P2P topics on behalf of connected clients.
* Handles authentication, filtering, and threshold logic.
* Shields clients from knowing internal P2P node details.

---

## 3. Deployment Options

### **Option A — Proxy + P2P** (Recommended)

**Architecture:**
[Client (CLI / gRPC)] → [Gateway (Proxy)] → [P2P Mesh]

yaml
Copy
Edit

* Clients **do not** need to know about individual P2P nodes.
* The gateway manages which nodes to use per topic.
* Easier to scale and secure.

---

### **Option B — Direct P2P** (Advanced)

**Architecture:**
[Client (gRPC)] → [P2P Node] ↔ [P2P Mesh]

yaml
Copy
Edit

* Clients connect directly to a node’s gRPC API.
* Lower hop count, but requires more client configuration.
* Each client must know at least one node’s IP/port.

---

## 4. Example Docker Compose Setup

### **Proxy + P2P Mode**

```yaml
version: "3.8"

services:
  gateway:
    image: optimum-gateway:latest
    environment:
      - OPTIMUM_THRESHOLD=0.7
      - OPTIMUM_SHARD_FACTOR=8
      - MESH_TARGET=12
      - NODE_DISCOVERY=true
    ports:
      - "8081:8081"  # gRPC/WebSocket API
    depends_on:
      - node1
      - node2

  node1:
    image: optimum-p2p-node:latest
    environment:
      - NODE_ID=node1
      - MESH_TARGET=12

  node2:
    image: optimum-p2p-node:latest
    environment:
      - NODE_ID=node2
      - MESH_TARGET=12
Direct P2P Mode
yaml
Copy
Edit
version: "3.8"

services:
  node1:
    image: optimum-p2p-node:latest
    environment:
      - NODE_ID=node1
      - MESH_TARGET=12
    ports:
      - "50051:50051"  # gRPC API for direct clients

  node2:
    image: optimum-p2p-node:latest
    environment:
      - NODE_ID=node2
      - MESH_TARGET=12
5. Starting the Network
bash
Copy
Edit
docker compose up -d
Check running containers:

bash
Copy
Edit
docker compose ps
Verify gateway health (Proxy mode):

bash
Copy
Edit
curl http://localhost:8081/api/v1/health
6. Connecting a Client
You can connect via CLI or via gRPC client code.

Using mump2p-cli
Proxy mode:
bash
Copy
Edit
./mump2p subscribe --topic=demo --proxy=http://localhost:8081
./mump2p publish --topic=demo --message="Hello from Proxy mode" --proxy=http://localhost:8081
Direct P2P mode:
bash
Copy
Edit
./mump2p subscribe --topic=demo --proxy=grpc://localhost:50051
./mump2p publish --topic=demo --message="Hello from Direct P2P" --proxy=grpc://localhost:50051
Using a gRPC Client (Go Example)
Proxy connection:
bash
Copy
Edit
go run proxy_client.go --subscribe --topic=demo --proxy=localhost:8081
Direct node connection:
bash
Copy
Edit
go run p2p_client.go --subscribe --topic=demo --node=localhost:50051
Notes:

proxy_client.go → Connects to Optimum Gateway.

p2p_client.go → Connects directly to a P2P node.

7. Configuration Parameters
Parameter	Description
OPTIMUM_THRESHOLD	Decoding threshold (0.0–1.0).
OPTIMUM_SHARD_FACTOR	Number of shards generated per message.
MESH_TARGET	Target number of peers per topic mesh.
NODE_DISCOVERY	Whether the gateway auto-discovers P2P nodes.

Edit in docker-compose.yml before starting.

8. Stopping the Network
bash
Copy
Edit
docker compose down
Remove volumes and images:

bash
Copy
Edit
docker compose down -v --rmi all
9. Next Step
Once your network is running, continue to 04 — Understanding Key Parameters to tune thresholds, shard counts, and mesh size for your workload.

pgsql
Copy
Edit

---

This keeps both **Proxy + P2P** and **Direct P2P** side-by-side,  
and explicitly shows **CLI** and **Go gRPC client** commands for each mode.  
