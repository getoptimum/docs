---
description: Get a quick primer on the constituent components of the Optimum protocol.
---

# Introduction to Optimum

Optimum is a highly-effective (low-latency, high-throughput), scalable, and secure
decentralized shared memory (deRAM) solution. In essence, it introduces an atomic
read/write memory designed for the Web3 environment, addressing the unique
challenges posed by asynchronous communication, high node churn, decentralized
decision-making, and the presence of potentially malicious nodes.

Achieving a reliable shared memory object in this setting requires careful
attention to reducing latency, enhancing fault tolerance, minimizing bandwidth
and storage costs, ensuring high throughput, and maintaining non-blocking,
high-availability performance.

Our approach leverages Random Linear Network Codes (RLNC), selected for their
flexible structure, which helps avoid costly distributed synchronization
primitives. This flexibility contributes to improved durability, reduced
bandwidth usage, and enhanced fault tolerance within a distributed storage
framework.

Our system is implemented as a network of functionally homogeneous nodes, termed
Flexnodes, which collectively provide decentralized storage and communication
services. External clients can interact with any Flexnode to perform read/write
operations, using this system both for data storage and as a communication
socket within the network.
