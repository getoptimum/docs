# OptimumP2P

OptimumP2P is a novel gossip algorithm that uses [Random Linear Network Coding (RLNC)](https://x.com/get_optimum/status/1891520664726802439) to enhance message dissemination in peer-to-peer networks. It is built on top of [libp2p](https://docs.libp2p.io/) and serves as an enhanced alternative to traditional gossip protocols like [GossipSub](https://github.com/libp2p/specs/tree/master/pubsub/gossipsub), providing faster data propagation, improved bandwidth efficiency, and better fault tolerance through network coding techniques.

## How OptimumP2P Works

OptimumP2P is a gossip mechanism based on RLNC, also known as Galois Gossip, that builds upon [libp2p](https://docs.libp2p.io/)'s [GossipSub](https://github.com/libp2p/specs/tree/master/pubsub/gossipsub) protocol. Instead of transmitting complete messages between peers, OptimumP2P breaks messages into coded shards that can be independently forwarded and mathematically recombined to reconstruct the original data.

### Node Architecture

OptimumP2P is implemented as a P2P node that enhances traditional gossip protocols with RLNC capabilities. The node maintains:

* **[libp2p](https://docs.libp2p.io/) Host**: The underlying network layer for peer connections
* **Mesh Topology**: Maintains peer connections similar to [GossipSub](https://github.com/libp2p/specs/tree/master/pubsub/gossipsub) with configurable mesh degrees
* **RLNC Parameters**: Configurable parameters for encoding and forwarding behavior (see [Configuration Parameters](#configuration-parameters))

### Random Linear Network Coding (RLNC) Fundamentals

RLNC is the core technology that provides OptimumP2P its performance advantages. The process transforms a single large message into a set of smaller, mathematically-related pieces.

![RLNC Coding and Composability](/static/img/rlnc.png)

**Key Principles:**

* **Encoding**: Original data is divided into `k` pieces. These pieces are then used to generate a larger set of `n` coded shards by creating random linear combinations of the original pieces. The coefficients for these combinations are chosen from a finite field. Any equation generated has a high probability (`1 - 1/q`, where `q` is the field size) of being linearly independent, ensuring its utility.
* **Early Forwarding & Composability**: A key feature of RLNC is that nodes do not need to wait to receive all `k` pieces to contribute to the network. As soon as a node receives a shard, it can be combined with other received shards to create and forward a *new, unique* coded shard (a process called recoding). This continuous "mixing" of information allows data to propagate fluidly and rapidly.
* **Decoding**: A receiver only needs to collect *any* `k` linearly independent shards to reconstruct the original message by solving a system of linear equations. This makes the system highly resilient to packet loss, as the specific shards that arrive do not matter, only the total number of unique shards.

This approach offers several advantages:

* **Lower Latency**: Messages are broken into coded shards, which can be forwarded to the next node before the whole message is received.
* **Loss Tolerance**: Messages can be decoded with any combination of shards, as long as a sufficient number reach the destination.
* **Bandwidth Efficiency**: Sharding and recoding reduce the amount of redundant data transmission, lowering overall bandwidth usage.

### Protocol Operation

When a node publishes a message in OptimumP2P:

1. **Message Preparation**: The original message is prepared for coding by adding length prefixes and padding if necessary
2. **RLNC Encoding**: The message is divided into `k` fragments and encoded using RLNC into multiple shards using configurable parameters:
   * `ShredFactor`: Controls how the data is fragmented  
   * `PublisherShardMultiplier`: Determines how many shards to create initially
3. **Shard Distribution**: The publisher sends different shards to different peers in round-robin fashion

When a node receives a shard:

1. **Validation**: The node checks if the shard provides new degrees of freedom (linearly independent information)
2. **Storage**: Valid shards are added to the node's shard set for that message  
3. **Decoding Attempt**: If the node has collected `k` or more linearly independent shards, it attempts to decode the original message
4. **Forwarding Logic**: 
   * **From Publisher**: Shards received directly from the publisher are forwarded immediately to all mesh peers
   * **From Intermediate Nodes**: If the node has more than a threshold number of shards (`ForwardShardThreshold`), it creates a new recoded shard and forwards it to mesh peers

### Control Messages

OptimumP2P uses control messages similar to [GossipSub](https://github.com/libp2p/specs/tree/master/pubsub/gossipsub) to optimize traffic:

* **IDONTWANT**: Announced when a node has successfully decoded a message, preventing peers from sending more shards for that message
* **IHAVE**: Announces that a node has a complete message and can provide shards to other nodes  
* **IWANT**: Requests additional shards for a message that hasn't been fully decoded
* **GRAFT/PRUNE**: Manages mesh topology similar to [GossipSub](https://github.com/libp2p/specs/tree/master/pubsub/gossipsub)

## Configuration Parameters

OptimumP2P provides several configurable parameters to tune performance for different network conditions and requirements:

### RLNC Encoding Parameters

* **ShredFactor**: Controls how the data is fragmented into pieces before encoding. Higher values provide more granular sharding but increase computational overhead.
* **PublisherShardMultiplier**: Determines how many shards to create initially when publishing a message. Formula: `shards_created = ShredFactor * PublisherShardMultiplier`
* **ForwardShardThreshold**: Sets the threshold for intermediate nodes to create and forward new recoded shards. Nodes forward when they have more than `ShredFactor * ForwardShardThreshold` shards

### Mesh Topology Parameters

* **MeshDegreeTarget**: Target number of peers to maintain in the mesh overlay
* **MeshDegreeMin**: Minimum number of mesh peers before triggering grafting
* **MeshDegreeMax**: Maximum number of mesh peers before triggering pruning

### Performance Tuning

* **RandomMessageSize**: Default message size used for testing and benchmarking (in bytes)

These parameters can be adjusted based on network conditions, bandwidth constraints, and latency requirements to optimize OptimumP2P performance for specific use cases.

## Use Cases

OptimumP2P serves as a foundational, general-purpose data propagation protocol with benefits extending across various blockchain use cases.

### Validators and Node Operators

OptimumP2P supercharges validator and full node performance in bandwidth-constrained and latency-sensitive networks:

* **[Ethereum](https://ethereum.org/)**: Faster mempool propagation, lower uncle rates, and potential integration into both execution and consensus paths
* **[Solana](https://solana.com/)**: Enhances Turbine-style data sharding with fault-tolerant packet loss recovery  
* **[Cosmos](https://cosmos.network/) & IBC networks**: Strengthens interchain relaying with lower-latency packet delivery and cross-zone message reliability

### DeFi Chains

High-frequency trading chains rely on fast, reliable state propagation:

* RLNC-based propagation keeps order books consistent across nodes
* Ensures fairness and synchrony in price discovery
* Reduces centralization pressure around sequencer or indexer nodes

### AI Chains

AI networks are data-intensive and latency-sensitive:

* OptimumP2P enables fast gossiping of model weights, gradients, and other updates
* Supports high-throughput training/inference coordination across distributed nodes
* Reduces straggler nodes and failed task replication due to packet loss

### DePIN Chains 

Decentralized physical infrastructure demands reliable node coordination at scale:

* Improves coordination across GPU/compute/storage nodes
* Ensures higher task completion rate for inferencing workloads
* Supports dynamic node membership with graceful joins/leaves

### Gaming & Social Chains

These chains rely on fast event propagation for user interactions:

* OptimumP2P delivers low-latency, real-time interactions (game state syncs, social updates)
* Improves experience for multiplayer, onchain games and social dApps
* Reduces costs of redundant relay infra through efficient data spreading

## Security Model

OptimumP2P's security model is built upon the robust foundations of **[libp2p](https://docs.libp2p.io/)**. As such, it inherits a comprehensive suite of security features designed for hostile peer-to-peer environments. For a full overview of these protections, refer to the [libp2p security considerations](https://docs.libp2p.io/concepts/security/security-considerations/).

Key inherited security features include:

*   **Authenticated and Encrypted Channels**: All peer-to-peer communication is secured using [Noise](https://noiseprotocol.org/) or [TLS](https://tools.ietf.org/html/rfc8446), preventing eavesdropping and tampering.
*   **Sybil and Eclipse Attack Mitigation**: The protocol uses [libp2p](https://docs.libp2p.io/)'s peer discovery and management systems, which include defenses against an attacker flooding the network with malicious nodes to gain control or isolate honest peers.

### Network Coding-Specific Security: Pollution Attacks

The primary security challenge unique to network coding is the risk of **pollution attacks**. In such an attack, a malicious actor injects corrupted or invalid coded shards into the network, with the goal of preventing honest nodes from successfully decoding the original message.

OptimumP2P mitigates this risk through a multi-layered approach centered on **source authentication**.

*   The original message data is cryptographically hashed to create a unique identifier.
*   This identifier, along with the publisher's signature, is bound to the data.
*   When a node decodes a message from a set of shards, it can verify the reconstructed data against the publisher's original signature and hash.

If the verification fails, the node knows that at least one of the shards it received was polluted. While identifying the exact malicious shard can be complex, the system can identify the peers who sent the invalid shards and lower their reputation scores, eventually isolating them from the network. This ensures that even though recoding happens at intermediate nodes, the integrity of the data can be verified end-to-end.
