# OptimumP2P

OptimumP2P is a chain-agnostic data propagation protocol that utilizes Random Linear Network Coding (RLNC) to improve the speed, efficiency, and reliability of data dissemination in blockchain networks. It is designed as an enhanced alternative to traditional gossip protocols like GossipSub, offering faster block propagation, reduced bandwidth consumption, and improved fault tolerance.

## The Problem: Blockchain Data Propagation Bottlenecks

In modern blockchain networks, data propagation represents a critical bottleneck affecting transaction throughput, block finality, and overall network performance. When a validator proposes a new block, that block must reach a supermajority of network participants before consensus can be achieved.

Traditional gossip protocols like GossipSub introduce several challenges:
- **High Latency**: Nodes must receive a full message before they can forward it to their peers, leading to cumulative delays across multi-hop paths.
- **Bandwidth Inefficiency**: The same message is often transmitted multiple times over redundant paths, consuming excess bandwidth and increasing operational costs for node operators.
- **Scalability Limits**: As network size and message frequency increase, these protocols can struggle to maintain performance, limiting the practical bounds of block size and block time.

## How OptimumP2P Works: A Network Coding Approach

OptimumP2P addresses these limitations through RLNC, a technique that enables optimal data propagation in distributed networks. Instead of forwarding entire messages, nodes transmit smaller, coded pieces (shards) of the original data.

<div class="theme-aware-image">
  <img src="/static/img/P2P_data_flow_light.png" alt="OptimumP2P Data Flow" class="light-mode-only">
  <img src="/static/img/P2P_data_flow_dark.png" alt="OptimumP2P Data Flow" class="dark-mode-only">
</div>

The data flow involves three main components:
1.  **Validator Node Integration**: OptimumP2P interfaces directly with a blockchain client to access data, such as newly produced blocks or transactions.
2.  **The Optimum Service**: This component is responsible for RLNC encoding. When it receives data, it applies network coding to generate redundant, coded shards.
3.  **Network Propagation**: The coded shards are propagated through the OptimumP2P network. A fallback mechanism to standard gossip protocols can be maintained for reliability and interoperability.

This model operates on a publish-subscribe (pub/sub) basis. Any node can publish data, and interested nodes across the globe can subscribe to receive it. This is well-suited for common Web3 communication patterns, from transaction broadcasting to block attestation.

![OptimumP2P Network Topology](/static/img/img_1.png)

### Random Linear Network Coding (RLNC) Fundamentals

RLNC is the core technology that provides OptimumP2P its performance advantages. The process transforms a single large message into a set of smaller, mathematically-related pieces.

![RLNC Coding and Composability](/static/img/rlnc.png)

**Key Principles:**

- **Encoding**: Original data is divided into `k` pieces. These pieces are then used to generate a larger set of `n` coded shards by creating random linear combinations of the original pieces. The coefficients for these combinations are chosen from a finite field. Any equation generated has a high probability (`1 - 1/q`, where `q` is the field size) of being linearly independent, ensuring its utility.
- **Early Forwarding & Composability**: A key feature of RLNC is that nodes do not need to wait to receive all `k` pieces to contribute to the network. As soon as a node receives a shard, it can be combined with other received shards to create and forward a *new, unique* coded shard (a process called recoding). This continuous "mixing" of information allows data to propagate fluidly and rapidly.
- **Decoding**: A receiver only needs to collect *any* `k` linearly independent shards to reconstruct the original message by solving a system of linear equations. This makes the system highly resilient to packet loss, as the specific shards that arrive do not matter, only the total number of unique shards.

This approach offers several advantages:
- **Lower Latency**: Messages are broken into coded shards, which can be forwarded to the next node before the whole message is received.
- **Loss Tolerance**: Messages can be decoded with any combination of shards, as long as a sufficient number reach the destination.
- **Bandwidth Efficiency**: Sharding and recoding reduce the amount of redundant data transmission, lowering overall bandwidth usage.

### High-Level Architecture

OptimumP2P is composed of several components that work together:

-   **Gateway Layer**: Provides a standardized API for blockchain clients to interact with the network via HTTP and WebSockets. It handles client connections, topic management, and authentication.
-   **P2P Node Network**: Implements the core RLNC protocol using **[libp2p](https://docs.libp2p.io/)**. It manages peer connections, discovery (via DHT), and protocol negotiation.
-   **Protocol Abstraction**: A layer that allows for dynamic protocol selection, enabling interoperability with nodes that may not be running OptimumP2P by falling back to standard GossipSub.

### High-Level Integration Model

OptimumP2P is designed to integrate with existing blockchain clients without requiring modifications to their core code. A common integration pattern is the **sidecar relay model**.

![OptimumP2P Validator Implementation](/static/img/img_2.png)

In this model, an **Optimum Relay** process runs alongside the validator's standard Consensus Layer (CL) client.
1.  The relay peers directly with the local CL client.
2.  When a proposer needs to publish a new block, its relay forwards the block to the interconnected OptimumP2P network.
3.  Other validators on the network subscribe to block topics. Their local relays receive the block from the OptimumP2P network and deliver it to their own CL clients for attestation.

This architecture allows validators to tap into the high-performance OptimumP2P network for data propagation while maintaining their existing, unmodified client software for all core consensus duties.

## Beyond Just Validators: Ecosystem-Wide Benefits

OptimumP2P is designed as a foundational, general-purpose data propagation layer. Its benefits extend across the entire blockchain ecosystem and it can serve as an enhanced networking stack for any blockchain client, such as those used in Ethereum or as a potential alternative to specialized protocols like Solana's Turbine.



### For L1/L2 Chains and Node Operators
An efficient propagation layer can lead to several advantages for the core network and its operators.
*   **Scalability Improvements**: By addressing propagation bottlenecks, networks can explore opportunities to increase block sizes or shorten block times without negatively impacting decentralization.
*   **Operational Cost Reduction**: Lower bandwidth requirements can translate to reduced operational costs for node operators, particularly for those in bandwidth-constrained environments. This helps maintain network decentralization by keeping participation accessible.

### For Application Developers and End Users
The performance of the base-layer network directly impacts the applications built on top of it.
*   **Enablement of Low-Latency dApps**: A network that supports lower-latency interactions can enable more responsive decentralized applications, including those in gaming or high-frequency DeFi.
*   **Improved User Experience**: The goal is to improve the end-user experience through the potential for faster transaction confirmations and a more stable gas fee environment resulting from eased network congestion.
*   **Enhanced Reliability**: A more predictable network can simplify dApp development by reducing the need for complex retry logic to handle network instability.

### Security Model

OptimumP2P's security model is built upon the robust foundations of **[libp2p](https://docs.libp2p.io/)**. As such, it inherits a comprehensive suite of security features designed for hostile peer-to-peer environments. For a full overview of these protections, refer to the [libp2p security considerations](https://docs.libp2p.io/concepts/security/security-considerations/).

Key inherited security features include:
-   **Authenticated and Encrypted Channels**: All peer-to-peer communication is secured using Noise or TLS, preventing eavesdropping and tampering.
-   **Sybil and Eclipse Attack Mitigation**: The protocol uses libp2p's peer discovery and management systems, which include defenses against an attacker flooding the network with malicious nodes to gain control or isolate honest peers.

**Network Coding-Specific Security: Pollution Attacks**

The primary security challenge unique to network coding is the risk of **pollution attacks**. In such an attack, a malicious actor injects corrupted or invalid coded shards into the network, with the goal of preventing honest nodes from successfully decoding the original message.

OptimumP2P mitigates this risk through a multi-layered approach centered on **source authentication**.
-   The original message data is cryptographically hashed to create a unique identifier.
-   This identifier, along with the publisher's signature, is bound to the data.
-   When a node decodes a message from a set of shards, it can verify the reconstructed data against the publisher's original signature and hash.
If the verification fails, the node knows that at least one of the shards it received was polluted. While identifying the exact malicious shard can be complex, the system can identify the peers who sent the invalid shards and lower their reputation scores, eventually isolating them from the network. This ensures that even though recoding happens at intermediate nodes, the integrity of the data can be verified end-to-end.
