# What is OptimumP2P

OptimumP2P is a performant message-passing (gossiping) protocol for fast, bandwidth-efficient data propagation in decentralized networks. It is optimized for high speed, low latency, and low bandwidth usage. OptimumP2P leverages Random Linear Network Coding (RLNC), a network coding technique developed at MIT, to address the limitations of traditional gossip protocols.

## Message-Passing Systems and Motivation

Gossip protocols are widely used to disseminate information across peer-to-peer networks, including Web3 systems. In blockchain networks, gossip is critical for propagating transactions and blocks. Slow propagation can result in missed block rewards for validators and reduced profitability for MEV optimizers. Efficient message dissemination is essential for network health and participant incentives.

## Limitations of Traditional Gossip

* High latency: Peers must receive full messages before forwarding.
* Bandwidth waste: Peers may receive multiple redundant copies of the same message.

## RLNC and OptimumP2P

* Reduced latency: Forwarding starts with the first shard.
* Bandwidth efficiency: Redundant data is minimized.
* Fault tolerance: Any sufficient subset of shards enables decoding.

## Performance Characteristics

* **Latency**: Testnet results show 50%+ reduction in propagation latency compared to Gossipsub.
* **Bandwidth**: RLNC reduces redundant transmissions, achieving sub-linear bandwidth growth as the network scales.
* **Fault tolerance**: The protocol is resilient to packet loss and node churn; partial data is sufficient for message recovery.
* **Scalability**: Efficient for both L1 and L2 chains, and supports high throughput under load.

## Summary

OptimumP2P is a high-performance, developer-friendly protocol for fast, reliable, and bandwidth-efficient data propagation in decentralized networks. By leveraging RLNC, it addresses the limitations of traditional gossip, providing measurable improvements in latency, bandwidth usage, and fault tolerance. The protocol is designed for easy integration, broad compatibility, and robust security, making it suitable for validators, chains, and applications seeking to optimize network performance.
