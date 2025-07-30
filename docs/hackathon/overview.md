# OptimumP2P Hackathon Documentation

This documentation provides technical guidance for building applications on OptimumP2P, a high-performance peer-to-peer messaging protocol that uses Random Linear Network Coding (RLNC) for efficient message propagation.

## Documentation Structure

### Quick Start
- [Installation & Setup](./quick-start/installation.md)
- [First Message Example](./quick-start/first-message.md)

### Deployment Options
- [P2P Network Only](./deployment/p2p-only.md) - Direct P2P mesh setup
- [P2P Network with Gateway](./deployment/p2p-with-gateway.md) - Gateway-enabled setup for client applications

### Client Development
- [WebSocket Client](./clients/websocket.md) - Real-time applications using WebSocket API
- [gRPC Stream Client](./clients/grpc.md) - High-performance bidirectional streaming
- [mump2p-cli](./clients/cli.md) - Command-line interface usage

### Configuration
- [Network Parameters](./configuration/network-params.md) - Mesh topology and RLNC settings
- [Docker Environment Variables](./configuration/docker-vars.md) - Complete environment variable reference
- [Performance Tuning](./configuration/tuning.md) - Optimization guidelines

## Technical Features

- RLNC-enhanced message propagation with reduced bandwidth usage
- libp2p-based networking with built-in security and peer discovery
- Dual access modes: direct P2P and gateway-mediated
- Multiple client interfaces: WebSocket, gRPC, CLI
- Configurable network parameters for different deployment scenarios

## Reference Documentation

- [OptimumP2P Technical Overview](../learn/overview/p2p.md)
- [libp2p Specifications](https://github.com/libp2p/specs)
- [GossipSub Protocol](https://github.com/libp2p/specs/blob/master/pubsub/gossipsub/README.md)


## Support

- [Troubleshooting Guide](./troubleshooting.md)
- [Frequently Asked Questions](./faq.md)

Begin with the [Installation & Setup](./quick-start/installation.md) guide to start development. 