# FAQ & Glossary

This section gives you:
- **Quick answers** to common developer questions about OptimumP2P
- A **glossary** of important terms so you can follow discussions and logs without confusion

---

## Frequently Asked Questions (FAQ)

### 1. What’s the difference between **P2P-only** and **Proxy + P2P**?
- **P2P-only** — Clients connect directly to the P2P network over gRPC.
- **Proxy + P2P** — Clients connect to a gateway proxy, which manages subscriptions and publishes to the P2P mesh.  
  *Use Proxy + P2P if:*  
  - You want simplified client integration (especially from web or REST-based clients)  
  - You have multiple P2P nodes and want centralized control  

---

### 2. Do OptimumP2P and GossipSub nodes talk to each other?
No — each runs its own protocol and forms a separate mesh.  
If you want both in the same experiment, you’ll need **separate bootstrap nodes**.

---

### 3. Can I change parameters at runtime?
Most parameters are set at startup. For dynamic changes:
- Use the HTTP API where supported (e.g., topic subscriptions)
- Restart the node for mesh/shard/threshold changes

---

### 4. Why am I seeing duplicate messages?
Possible causes:
- Multiple subscriptions to the same topic from one client
- Threshold too low, causing early forward from multiple peers
- Application logic not deduplicating payloads

---

### 5. How do I test with a real-world loss scenario?
Use Linux traffic control (`tc`) or Docker network emulation:
```bash
tc qdisc add dev eth0 root netem loss 10%
Then observe recovery via RLNC redundancy.

6. What ports should I expose?
Typical defaults:

OptimumP2P protocol: 7070

GossipSub protocol: 6060

gRPC Sidecar API: 33212

HTTP API: 9090
Expose only what your topology requires.

7. Can I run OptimumP2P on the same machine as my app?
Yes. Use:

localhost for API calls

Docker bridge or host networking to connect to other peers

8. What happens if the bootstrap node goes down?
Existing peers remain connected, but:

New peers can’t join until another bootstrap is available

It’s recommended to have multiple bootstrap nodes for redundancy

9. How do I monitor shard decoding?
Check logs for:

bash
Copy
Edit
grep -E "(shard|decode|threshold)" node.log
Or use /metrics Prometheus endpoint for shard counters.

10. Is there a message size limit?
Yes — controlled by:

OPTIMUM_MAX_MSG_SIZE for OptimumP2P

GOSSIPSUB_MAX_MSG_SIZE for GossipSub
Default: 1MB per message.

Glossary
Term	Definition
Topic	A named channel for publishing/subscribing messages
Shard	A coded fragment of a message in RLNC
Threshold	Minimum fraction of shards needed to decode a message
Mesh	Subset of peers directly connected for a given topic
Gossip	Metadata exchange about available messages between non-mesh peers
Bootstrap Node	A known peer used to join the network
PeerID	Unique identifier for a node in the P2P network
RLNC	Random Linear Network Coding — coding method for redundancy & efficiency
Gateway	A proxy between clients and P2P nodes, often used for REST or centralized control
Fanout	Temporary peer set for publishing when not subscribed to a topic
GRAFT / PRUNE	GossipSub control messages to add/remove peers from a mesh
IHAVE / IWANT	GossipSub messages for announcing/requesting message IDs

See Also
04 — Understanding Key Parameters

06 — Monitoring & Debugging

09 — Next Steps

yaml
Copy
Edit
