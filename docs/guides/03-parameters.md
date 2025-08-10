# Understanding Key Parameters


OptimumP2P supports **two gossip protocols**:

1. **GossipSub** — the standard libp2p pub/sub protocol.
2. **OptimumP2P (RLNC)** — an enhanced gossip protocol using Random Linear Network Coding for faster, more resilient message propagation.

Both protocols share similar topology concepts but differ in message encoding, redundancy, and forwarding logic.  
This chapter explains:

- Core gossip concepts.
- All tunable parameters for **both** protocols.
- How these parameters behave in **Proxy + P2P** vs **Direct P2P** modes.
- Pre-built tuning profiles.
- How to validate and experiment with changes.

---

## 1. Core Concepts

| Term       | Description |
|------------|-------------|
| **Mesh**   | The set of peers directly connected for a topic. |
| **Gossip** | Metadata exchange (who has what) with non-mesh peers. |
| **Fanout** | Temporary publishing links for unsubscribed topics. |
| **Degree** | Target number of mesh peers per topic. |
| **Shard**  | A coded fragment of a message (OptimumP2P only). |
| **Threshold** | Fraction of shards required to reconstruct a message (OptimumP2P only). |

---

## 2. Side-by-Side Parameters

### 2.1 Topology Parameters

| Setting | GossipSub Env Var | OptimumP2P Env Var | Default (GSub) | Default (Optimum) | Purpose |
|---------|------------------|--------------------|----------------|-------------------|---------|
| Mesh Target | `GOSSIPSUB_MESH_TARGET` | `OPTIMUM_MESH_TARGET` | 6 | 6 | Target peer connections per topic. |
| Mesh Min | `GOSSIPSUB_MESH_MIN` | `OPTIMUM_MESH_MIN` | 4 | 3 | Min peers before adding new ones. |
| Mesh Max | `GOSSIPSUB_MESH_MAX` | `OPTIMUM_MESH_MAX` | 12 | 12 | Max peers before pruning. |

---

### 2.2 Message Size & Ports

| Setting | GossipSub Env Var | OptimumP2P Env Var | Default | Purpose |
|---------|------------------|--------------------|---------|---------|
| Protocol Port | `GOSSIPSUB_PORT` | `OPTIMUM_PORT` | 6060 (GSub) / 7070 (Optimum) | P2P gossip communication port. |
| Max Message Size (bytes) | `GOSSIPSUB_MAX_MSG_SIZE` | `OPTIMUM_MAX_MSG_SIZE` | 1,048,576 (1MB) | Limit to prevent excessive memory usage. |

---

### 2.3 RLNC-Specific Parameters (OptimumP2P Only)

| Setting | Env Var | Default | Purpose |
|---------|---------|---------|---------|
| Shard Factor | `OPTIMUM_SHARD_FACTOR` | 4 | Number of coded shards per message. |
| Publisher Shard Multiplier | `OPTIMUM_SHARD_MULT` | 1.5 | Multiplies shard count when publishing for redundancy. |
| Forward Threshold | `OPTIMUM_THRESHOLD` | 0.75 | Fraction of shards needed before forwarding. |

---

### 2.4 Timing (GossipSub Only)

| Setting | Env Var | Default | Purpose |
|---------|---------|---------|---------|
| Heartbeat Interval | *(config file only)* | 1s | How often mesh maintenance runs. |
| Fanout TTL | *(config file only)* | 60s | Lifetime of fanout state. |
| Seen TTL | *(config file only)* | 120s | Duration to remember seen messages. |

---

## 3. Parameter Impact by Deployment Mode

| Parameter | Proxy + P2P | Direct P2P |
|-----------|-------------|------------|
| Mesh Target | Proxy benefits from denser mesh for faster shard aggregation; minor client effect. | Client performance depends entirely on connected node’s mesh density. |
| Shard Factor | Higher improves redundancy for proxy distribution; affects uplink load to proxy. | Client receives all shards directly; high values may saturate slow links. |
| Threshold | Proxy can forward early once threshold met; low thresholds speed delivery. | Client must wait to receive threshold shards; low values reduce latency but risk decode failures. |
| Max Message Size | Large values okay if proxy does decoding; in direct mode may strain client memory. | Client must handle full payload; keep conservative if on limited hardware. |

---

## 4. Tuning Profiles

### Low Latency
```yaml
# OptimumP2P
OPTIMUM_SHARD_FACTOR=4
OPTIMUM_SHARD_MULT=1.2
OPTIMUM_THRESHOLD=0.6
OPTIMUM_MESH_TARGET=6
