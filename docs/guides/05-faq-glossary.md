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

**A:** Use the identity generation script or Makefile command:

```bash
# Using Makefile (recommended)
make generate-identity

# Or using the script directly
./script/generate-identity.sh
```

This generates `./identity/p2p.key` and displays the `BOOTSTRAP_PEER_ID` that you need to add to your `.env` file.

### Container Startup Issues

### Q: Containers fail to start or can't connect to each other

**A:** Common fixes:

1. **Check Docker images**: Use correct versions from your `.env` file (`PROXY_VERSION=v0.0.1-rc16`, `P2P_NODE_VERSION=v0.0.1-rc16` by default)
2. **Network conflicts**: Change subnet in docker-compose if `172.28.0.0/16` conflicts
3. **Port conflicts**: Ensure ports 8081, 8082, 50051, 50052, 33221-33224, 9091-9094, 7071-7074 are available
4. **Platform issues**: Add `platform: linux/amd64` for M1 Macs (already included in docker-compose-optimum.yml)

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
   
   For P2P direct client, see [`grpc_p2p_client/cmd/single/main.go`](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/grpc_p2p_client/cmd/single/main.go)

### Q: Getting "method not found" or protobuf errors

**A:** Use the correct protobuf definitions from [`optimum-dev-setup-guide/docs/guide.md`](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md#api-reference):

* See the [API Reference section](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md#api-reference) for complete protobuf definitions
* All proto files are available in the repository's `grpc_*_client/proto/` directories:
    * [`grpc_proxy_client/proto/proxy_stream.proto`](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/grpc_proxy_client/proto/proxy_stream.proto)
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

1. **Check container logs**: `docker-compose -f docker-compose-optimum.yml logs <service-name>` or `docker logs <container-name>`
2. **Verify network connectivity**: `docker network ls` and `docker network inspect optimum-dev-setup-guide_optimum-network`
3. **Test basic connectivity**: 
   * Proxy: `curl http://localhost:8081/api/v1/health`
   * P2P Node: `curl http://localhost:9091/api/v1/health`
4. **Check authentication**: `mump2p whoami` (if using CLI)
5. **Verify versions**: Check your `.env` file for `PROXY_VERSION` and `P2P_NODE_VERSION` (default: v0.0.1-rc16)
6. **Check service status**: `docker-compose -f docker-compose-optimum.yml ps`

### Getting Help

* **CLI Issues**: [mump2p-cli FAQ](https://github.com/getoptimum/mump2p-cli#faq---common-issues--troubleshooting)
* **Setup Issues**: Check [`optimum-dev-setup-guide/docs/guide.md`](https://github.com/getoptimum/optimum-dev-setup-guide/blob/main/docs/guide.md)
* **Protocol Questions**: See [mump2p Documentation](../learn/overview/p2p.md)
