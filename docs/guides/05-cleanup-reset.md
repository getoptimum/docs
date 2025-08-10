# Cleanup & Reset and Important Commands

## Overview

After running tests, experiments, or demos with OptimumP2P, you’ll often want to clean up your environment to:

- Free up system resources
- Avoid stale peers, topics, and bootstrap states
- Start fresh for new tests
- Reset configuration without leftover data

This page covers:

1. **Stopping Containers**
2. **Removing Local Data**
3. **Resetting Identity & State**
4. **Cleaning up Networks**
5. **Preparing for a Fresh Deployment**

---

## 1. Stopping Containers

### Stop All Running Containers
If you’re running with Docker Compose:
```bash
docker compose down
If you’re running containers individually:

bash
Copy
Edit
docker stop $(docker ps -q --filter "ancestor=getoptimum/p2pnode:latest")
2. Removing Local Data
OptimumP2P stores persistent state such as:

Identity keys (libp2p peer ID)

Topic subscription cache

RLNC shard cache

Message history

Prometheus WAL (if used)

If you mounted a local directory (e.g. /tmp/p2pnode-data):

bash
Copy
Edit
rm -rf /tmp/p2pnode-data
If you used Docker volumes:

bash
Copy
Edit
docker volume ls
docker volume rm <volume_name>
3. Resetting Identity & State
Each node’s identity determines its PeerID.
If you want a node to appear as a brand new peer in the network, delete its identity directory.

Example:

bash
Copy
Edit
rm -rf ~/.optimum/identity
Or if using Docker Compose:

yaml
Copy
Edit
services:
  p2pnode:
    volumes:
      - ./identity:/identity
To reset:

bash
Copy
Edit
rm -rf ./identity/*
4. Cleaning up Networks
Docker may keep custom bridge networks around, which can cause conflicts when re-deploying.

List networks:

bash
Copy
Edit
docker network ls
Remove unused networks:

bash
Copy
Edit
docker network prune
Warning: This removes all unused networks, not just OptimumP2P ones.

5. Preparing for a Fresh Deployment
When restarting a clean environment:

Remove all containers

bash
Copy
Edit
docker compose down --volumes --remove-orphans
Delete local data directories

bash
Copy
Edit
rm -rf ./data
Re-generate configuration

Update docker-compose.yml if needed

Change CLUSTER_ID to avoid collision with old peers

Reset bootstrap peers if you want a new network

Restart deployment

bash
Copy
Edit
docker compose up -d
6. Special Cases
Resetting Only the Gateway
If you want to keep the P2P network intact but reset the gateway:

bash
Copy
Edit
docker compose stop gateway
docker compose rm -f gateway
rm -rf ./gateway-data
docker compose up -d gateway
Resetting Only a Single Node
bash
Copy
Edit
docker stop p2pnode-2
docker rm p2pnode-2
rm -rf ./p2pnode-2-data
docker compose up -d p2pnode-2
7. Verification After Reset
After restarting:

Check health:

bash
Copy
Edit
curl http://localhost:9090/health
List peers:

bash
Copy
Edit
curl http://localhost:9090/peers
List topics:

bash
Copy
Edit
curl http://localhost:9090/topics
A fresh node should:

Have 0 topics initially

Connect to only configured bootstrap peers

Have a new PeerID if identity was reset

Quick Reset Command (nuclear option)
If you want to remove everything related to OptimumP2P from Docker in one go:

bash
Copy
Edit
docker compose down --volumes --remove-orphans && \
docker system prune -af --volumes && \
rm -rf ./data ./identity ./gateway-data
⚠️ Warning: This will delete all Docker images, containers, volumes, and networks not currently in use.