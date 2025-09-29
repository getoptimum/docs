# Frequently Asked Questions (FAQs)

## CLI Issues

For all CLI-related problems (authentication, installation, rate limits, connection issues), please refer to the comprehensive FAQ in the CLI repository:

**👉 [mump2p CLI FAQ & Troubleshooting](https://github.com/getoptimum/mump2p-cli#faq---common-issues--troubleshooting)**

It includes detailed troubleshooting for:

* Authentication and login problems
* Installation issues across different operating systems  
* Rate limiting and usage issues
* Service URL and connectivity problems
* Common syntax and usage errors

## Docker Setup Issues

### Identity Generation Problems

### Q: `docker run ... generate-key` command doesn't work

**A:** Use the identity generation script instead:

```bash
curl -sSL https://raw.githubusercontent.com/getoptimum/optimum-dev-setup-guide/main/script/generate-identity.sh | bash
```

This generates `p2p.key` and exports `BOOTSTRAP_PEER_ID` automatically.

### Container Startup Issues

### Q: Containers fail to start or can't connect to each other

**A:** Common fixes:

1. **Check Docker images**: Use correct versions (`getoptimum/proxy:v0.0.1-rc3`, `getoptimum/p2pnode:v0.0.1-rc2`)
2. **Network conflicts**: Change subnet in docker-compose if `172.28.0.0/16` conflicts
3. **Port conflicts**: Ensure ports 8080, 8081, 33221, 9091, 7071 are available
4. **Platform issues**: Add `platform: linux/amd64` for M1 Macs

### Q: "Connection refused" when clients try to connect

**A:** Verify:

* Containers are running: `docker ps`
* Ports are properly mapped in docker-compose
* No firewall blocking connections
* Using correct service URLs (localhost:8080 for proxy, localhost:33221 for direct P2P)


## gRPC Client Issues

### Q: gRPC client gets "connection refused" or timeout errors

**A:** Check:

1. **Containers are running**: `docker ps` to verify proxy and p2pnode containers are up
2. **Correct ports**: Proxy gRPC on `localhost:50051`, P2P sidecar on `localhost:33221`
3. **Use latest client examples**: Reference [`optimum-dev-setup-guide/docs/guide.md#grpc-proxy-client-implementation`](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md#grpc-proxy-client-implementation)

   **[Complete Code](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/grpc_proxy_client/proxy_client.go)**

### Q: Getting "method not found" or protobuf errors

**A:** Use the correct protobuf definitions from [`optimum-dev-setup-guide/docs/guide.md`](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md#api-reference):

* See the [API Reference section](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md#api-reference) for complete protobuf definitions
* All proto files are available in the repository's `grpc_*_client/proto/` directories:
    * [`grpc_proxy_client/proto/gateway_stream.proto`](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/grpc_proxy_client/proto/gateway_stream.proto)
    * [`grpc_p2p_client/proto/p2p_stream.proto`](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/grpc_p2p_client/proto/p2p_stream.proto)



## Development Issues

### Q: Go client code compilation errors

**A:** Use the exact Go versions and dependencies from [`optimum-dev-setup-guide/docs/guide.md`](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md#client-tools):

* See the [Client Tools section](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md#client-tools) for complete examples
* All go.mod files and dependencies are available in the repository's `grpc_*_client/` directories:
    * [`grpc_proxy_client/go.mod`](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/grpc_proxy_client/go.mod)
    * [`grpc_p2p_client/go.mod`](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/grpc_p2p_client/go.mod)

### Q: Code examples don't work as expected

**A:** All examples are tested against [`optimum-dev-setup-guide/docs/guide.md`](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md). Check:

1. Environment variables are set correctly  
2. Docker containers are running
3. Using the latest example code from the repository

## General Troubleshooting

### First Steps

When something doesn't work:

1. **Check container logs**: `docker logs <container-name>`
2. **Verify network connectivity**: `docker network ls` and `docker network inspect`
3. **Test basic connectivity**: `curl http://localhost:8080/health`
4. **Check authentication**: `mump2p whoami`
5. **Verify versions**: Use latest CLI and Docker images

### Getting Help

* **CLI Issues**: [mump2p-cli FAQ](https://github.com/getoptimum/mump2p-cli#faq---common-issues--troubleshooting)
* **Setup Issues**: Check [`optimum-dev-setup-guide/docs/guide.md`](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md)
* **Protocol Questions**: See [mumP2P Documentation](./p2p.md)
