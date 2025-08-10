# Common Experiments

This chapter gives you practical test scenarios to **measure and validate** OptimumP2P’s performance.  
You’ll explore latency, reliability, and throughput under different network conditions — both for **GossipSub** and **OptimumP2P (RLNC)**.

These experiments assume you have:

- A **running network** (Proxy + P2P or Direct P2P).
- **Client access** via gRPC, REST, or CLI.
- The ability to **change parameters** (env vars or config files).
- Basic **monitoring tools** (logs, metrics, Grafana, or Prometheus).

---

## 1. Experiment: Shard Factor Sweep

**Goal:** See how coded shard count affects delivery reliability and CPU usage.

**Setup:**
1. Start your network with these shard factor values:
   - `OPTIMUM_SHARD_FACTOR=2`
   - `OPTIMUM_SHARD_FACTOR=4`
   - `OPTIMUM_SHARD_FACTOR=8`
   - `OPTIMUM_SHARD_FACTOR=16`
2. Keep all other parameters identical.

**Procedure:**
- Publish the same 1MB message to the same topic.
- Introduce artificial packet loss (e.g., `tc netem loss 20%`).
- Measure:
  - Time to first full decode.
  - Percentage of peers that successfully decoded.
  - CPU load on sender and receiver.

**Expected Result:**
- **Low values (2–4)**: Low CPU, but reduced reliability under loss.
- **High values (8–16)**: High reliability, but more CPU and bandwidth.

---

## 2. Experiment: Forward Threshold Tuning

**Goal:** Measure latency vs reliability when forwarding coded shards early.

**Setup:**
- Keep `OPTIMUM_SHARD_FACTOR=8`.
- Test with:
  - `OPTIMUM_THRESHOLD=0.5`
  - `OPTIMUM_THRESHOLD=0.75`
  - `OPTIMUM_THRESHOLD=0.9`

**Procedure:**
- Publish bursts of small messages (50–100KB).
- Measure:
  - End-to-end latency.
  - % of decodes completed at each peer.
  - Total shard traffic on the network.

**Expected Result:**
- **Low threshold (0.5)**: Lower latency, slightly more failed decodes under loss.
- **High threshold (0.9)**: Slower, but highly reliable.

---

## 3. Experiment: Mesh Density Impact

**Goal:** Compare sparse vs dense peer connections.

**Setup:**
- Keep shard factor and threshold constant.
- Change:
  - Sparse mesh: `*_MESH_TARGET=4`
  - Dense mesh: `*_MESH_TARGET=12`

**Procedure:**
- Publish 100 messages to the topic.
- Log:
  - Average peer-to-peer hop count.
  - Message duplication count.
  - Latency from first to last peer.

**Expected Result:**
- Sparse mesh reduces bandwidth, increases hops.
- Dense mesh improves redundancy, may increase duplicates.

---

## 4. Experiment: GossipSub vs OptimumP2P

**Goal:** See if RLNC improves your specific network scenario.

**Setup:**
- Run two identical networks:
  - **GossipSub** — `NODE_MODE=gossipsub`, default mesh params.
  - **OptimumP2P** — `NODE_MODE=optimum`, same mesh params, RLNC enabled.

**Procedure:**
- Publish the same 100 messages to both networks.
- Measure:
  - First-receiver latency.
  - All-receivers latency.
  - Total bytes transmitted.
  - Reliability under induced packet loss.

**Expected Result:**
- OptimumP2P should win on **lossy networks** due to redundancy.
- On perfect links, GossipSub may match latency but use less CPU.

---

## 5. Experiment: Proxy + P2P vs Direct P2P

**Goal:** Understand whether a proxy speeds up or slows down delivery in your use case.

**Setup:**
- Same number of P2P nodes in both deployments.
- One with `gateway` (proxy) in front of clients.
- One where clients connect directly to P2P nodes.

**Procedure:**
- Subscribe 10 clients to the same topic.
- Publish 50 messages from different P2P nodes.
- Measure:
  - Average time from publish to all clients.
  - Total client bandwidth usage.
  - Proxy CPU load (if using gateway).

**Expected Result:**
- Proxy improves aggregation and reduces uplink load from publisher.
- Direct P2P may reduce single-hop latency but increase total traffic.

---

## 6. Experiment: Load Test

**Goal:** Find the throughput limit before degradation.

**Setup:**
- Use a load generator (e.g., `mump2p-cli` in a loop or a custom gRPC publisher).
- Keep parameters constant.

**Procedure:**
- Gradually increase message rate from 10 msg/s to 1,000 msg/s.
- Watch:
  - Message loss rate.
  - Latency growth.
  - Node CPU/memory.

**Expected Result:**
- At some rate, latency spikes and reliability drops.
- Use results to size your cluster for production.

---

## 7. Monitoring Checklist for All Experiments

During each test:
- **Check logs** for errors (`grep error` or `grep shard`).
- **Check metrics**:
  - `peer_count`
  - `message_delivered_total`
  - `shard_decoded_total`
  - `delivery_latency_seconds`
- **Check system health**:
  - CPU / Memory via `docker stats`
  - Network usage via `iftop` or `nload`

---

## Next Step
Move on to [06 — Monitoring & Debugging](06-monitoring-debugging.md) to learn how to interpret metrics and fix issues uncovered during testing.
