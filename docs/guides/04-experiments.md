# Common Experiments

Once your Optimum Network is running (see [Parameters](./03-parameters.md)), you can try different experiments to understand **performance, reliability, and scaling behavior**.

> **Before You Begin:**  
> Make sure you’ve read:
>
> * [Node Modes & Config Parameters](./03-parameters.md) — to understand what each env var controls.
> * [mump2p CLI](./01-getting-started-cli.md) and [gRPC Client Setup](./02-getting-started-docker.md) — for sending and receiving test messages.

Each experiment below lists the **goal**, a quick **how-to**, and **what to observe**.  

You can run them using:

* **mump2p CLI** (see [CLI Guide](./01-getting-started-cli.md))
* **gRPC P2P client** (trace collection is automatic when subscribing - see [Trace Collection](#metrics-collection))



## 1. GossipSub vs mump2p

**Goal:** Compare standard libp2p gossip to RLNC-enhanced gossip to confirm mump2p is faster.

**How:**

* Run one cluster with `NODE_MODE=gossipsub`.
* Run another with `NODE_MODE=optimum`.
* Publish the same workload to both networks.

**Observe:**

* **Delivery latency** (primary metric - mump2p should be faster)
* **Bandwidth usage** (mump2p should use less)
* **Success rate** (both should deliver messages successfully)

**Expected Result:** mump2p should show lower latency and bandwidth usage.


## 2. Shard Factor Sweep

**Goal:** Find the optimal number of coded shards for your message size and network.

**How:**

* Test range: `OPTIMUM_SHARD_FACTOR` = 2, 4, 8, 16, 32, 64 (powers of 2 recommended).
* Keep all other parameters the same.
* Test with 1MB messages.

**Observe:**

* **Delivery latency** (primary metric)
* **Success rate** (messages should still deliver)

**Expected Result:** For 1MB messages, shard factors 4-8 typically provide the best balance of performance and reliability. Too few shards (≤2) cause delivery failures, while too many shards (≥32) increase latency due to overhead. Start with shard factor 4-8 and tune based on your network conditions.


## 3. Forward Threshold Tuning

**Goal:** Find the optimal threshold for forwarding coded shards early.

**How:**

* Fix `OPTIMUM_SHARD_FACTOR=8`.
* Test `OPTIMUM_THRESHOLD` at 0.5, 0.7, 0.9, 1.0.
* Publish small messages in a 20-30 node network.

**Observe:**

* **Delivery latency** (primary metric)
* **Bandwidth usage** (threshold=1.0 should use most bandwidth)

**Expected Result:** Threshold 0.7 provides optimal performance for small networks - delivering 100% success rate with lowest latency. Thresholds below 0.6 may cause delivery failures, while values above 0.8 can reduce success rate and increase latency.


## 4. Mesh Density Impact

**Goal:** Compare mump2p vs GossipSub with different mesh sizes.

**How:**

* Test both `NODE_MODE=gossipsub` and `NODE_MODE=optimum`.
* For GossipSub: try `GOSSIPSUB_MESH_TARGET` = 4, 6, 8.
* For mump2p: try `OPTIMUM_MESH_TARGET` = 6, 12, 18.
* Run the same publish/subscribe test.

**Observe:**

* **Delivery latency** (primary metric)
* **Bandwidth usage**

**Expected Result:** mump2p should perform better with higher mesh targets (around 12) while GossipSub optimal around 6.





## 5. Load Test

**Goal:** Find when mump2p vs GossipSub starts to fail under stress.

**How:**

* Test both `NODE_MODE=gossipsub` and `NODE_MODE=optimum`.
* Vary **message size** (1KB → 10MB) and **message frequency** (1 → 1000 msg/s).
* Use multiple publishers if needed.

**Observe:**

* **When delivery starts to fail** (primary metric)
* **Delivery rate degradation**

**Expected Result:** mump2p should handle higher stress levels before failing compared to GossipSub.


> **Tip:** Trace collection is automatic when using the gRPC P2P client. Simply subscribe to a topic and trace events will be automatically parsed and displayed. See [Trace Collection](#metrics-collection) for details.

## Metrics Collection

For comprehensive metrics collection during experiments, use the gRPC P2P client with trace handling:

**[P2P Client with Metrics Collection](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md#collecting-trace-data-for-experiments)**

**[Complete Code](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/grpc_p2p_client/cmd/single/main.go)**

The client automatically captures and displays trace events when you subscribe:

* **GossipSub traces**: Peer routing, message delivery status, hop counts, latency
* **mump2p traces**: Shard encoding/decoding, reconstruction efficiency, redundancy metrics  
* **Message-level data**: Delivery success rates, end-to-end latency, bandwidth usage

**Usage:**

```bash
# Subscribe to a topic - trace events are automatically collected and displayed
./grpc_p2p_client/p2p-client -mode=subscribe -topic=your-topic --addr=127.0.0.1:33221
```

Trace parsing is implemented in `grpc_p2p_client/shared/utils.go` and handles both `ResponseType_MessageTraceGossipSub` and `ResponseType_MessageTraceMumP2P` automatically.

For multi-node experiments with trace data collection, use the multi-subscribe client:

```bash
./grpc_p2p_client/p2p-multi-subscribe -topic=test-topic -ipfile=ips.txt -output-data=data.tsv -output-trace=trace.tsv
```

See the [dev setup guide](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md#multi-node-client-tools) for more details on multi-node client tools.
