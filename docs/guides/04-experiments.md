# Common Experiments

Once your OptimumP2P network is running (see [Parameters](./03-parameters.md)), you can try different experiments to understand **performance, reliability, and scaling behavior**.

> **Before You Begin:**  
> Make sure you’ve read:
>
> * [Node Modes & Config Parameters](./03-parameters.md) — to understand what each env var controls.
> * [mump2p CLI](./01-getting-started-cli.md) and [gRPC Client Setup](./02-getting-started-docker.md) — for sending and receiving test messages.

Each experiment below lists the **goal**, a quick **how-to**, and **what to observe**.  

You can run them using:

* **mump2p CLI** (see [CLI Guide](./01-getting-started-cli.md))
* **gRPC client** (with `MessageTraceGossipSub` or `MessageTraceOptimumP2P` for protocol metrics)



## 1. Shard Factor Sweep

**Goal:** See how the number of coded shards affects reliability and CPU usage in `NODE_MODE=optimum`.

**How:**

* Vary `OPTIMUM_SHARD_FACTOR` (e.g., 2, 4, 8, 16).
* Keep all other parameters the same.
* Publish the same message in each run.

**Observe:**

* Delivery success rate.
* Decode latency.
* CPU load.


## 2. Forward Threshold Tuning

**Goal:** Measure latency vs reliability trade-off when forwarding coded shards early.

**How:**

* Fix `OPTIMUM_SHARD_FACTOR=8`.
* Test `OPTIMUM_THRESHOLD` at 0.5, 0.75, 0.9.
* Publish bursts of small messages.

**Observe:**

* End-to-end latency.
* Percentage of successful decodes.


## 3. Mesh Density Impact

**Goal:** Compare performance with sparse vs dense peer meshes.

**How:**

* Change `*_MESH_TARGET` (e.g., 4 vs 12).
* Run the same publish/subscribe test.

**Observe:**

* Average hop count.
* Delivery latency.
* Duplicate message rate.


## 4. GossipSub vs OptimumP2P

**Goal:** Compare standard libp2p gossip to RLNC-enhanced gossip in the same environment.

**How:**

* Run one cluster with `NODE_MODE=gossipsub`.
* Run another with `NODE_MODE=optimum`.
* Publish the same workload.

**Observe:**

* First-receiver latency.
* All-receivers latency.
* Bandwidth usage.
* Loss resilience.


## 5. Proxy + P2P vs Direct P2P

**Goal:** See if using OptimumProxy improves delivery for your setup.

**How:**

* Deploy once with Proxy in front of P2P nodes.
* Deploy once with clients connecting directly to nodes.
* Run the same test in both setups.

**Observe:**

* Client receive time.
* Bandwidth usage.
* Proxy CPU load.


## 6. Load Test

**Goal:** Find the throughput limit of your network.

**How:**

* Gradually increase message rate (e.g., 10 → 1,000 msg/s).
* Use multiple publishers if needed.

**Observe:**

* Latency growth.
* Message loss rate.
* Node CPU/memory usage.


> **Tip:** Enable protocol traces in the gRPC client to get hop-by-hop delivery info:
>
> * `MessageTraceGossipSub` for GossipSub mode.
> * `MessageTraceOptimumP2P` for OptimumP2P mode.

TODO:: github ref, and cite the gRPC client part.
For metrics collection guidance, see [github sample implementations](github.com).
