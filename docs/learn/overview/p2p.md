# Introduction to OptimumP2P

OptimumP2P is a performant message-passing (aka gossipping) library that allows
nodes in any network to quickly communicate with each other in a Publish-Subscribe
protocol. OptimumP2P is optimized for high speed, low latency, and low bandwidth.
The system is built on well-established algorithms for gossipping, but with the
innovative approach of using Random Linear Network Coding (RLNC), a cutting-edge
network coding technology developed at the Massachusetts Institute of Technology
(MIT).

## Message-passing systems

Gossipping is a widely-used mechanism of disseminating information across a set
of peers that are not necessarily known to each other. Such protocols are used
in both Web2 and Web3 networks. In the Web3 domain, gossip is especially used to
propagate transactions and blocks as they are created.

Gossip is one of the most performance-critical aspects of a Web3 system. As an
example, slow propagation could lead to a validator's proposed blocks not being
included in the history of the ledger, thus risking the stability of the network
and the validator's block rewards. Similarly, being slow to receive new transactions
could affect the profitability of MEV optimizers, intent solvers, etc.

Thus, faster message dissemination is critical to participants in a Web3 protocol,
and to the overall health of the network itself.

## RLNC and Gossip

Today's Gossip protocols are good at eventual delivery of messages, but suffer
from:

* Long time-to-delivery (latency), since a message needs to be fully received by
  a peer before it can be forwarded onwards.
* Wasted bandwidth, since a peer may receive multiple copies of the same message,
  thus using several times more bandwidth than necessary.

The use of RLNC improves on both of these weaknesses. With RLNC, peers don't
transmit entire messages at a time, but smaller shards that are coded pieces of
the bigger message. Each shard is unique, and it does not matter which shards a
peer receives -- so long as they receive a set number of shards, they can decode the message.

This means that:

* Peers start forwarding useful information as soon as they have received the
  first shard.
* Any redundant information a peer receives is significantly smaller in size
  (e.g. 1/32nd the size of the original message), and therefore, bandwidth usage
  is significantly lower.
