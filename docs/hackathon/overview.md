# OptimumP2P Quickstart & Developer Guide

This guide walks you through everything you need to **understand**, **deploy**, **run**, and **experiment** with OptimumP2P.
It’s designed for beginners but complete enough for advanced developers to jump in and integrate.

If you want deep technical theory, see the **[OptimumP2P Technical Overview](../learn/overview/p2p.md)** — this guide stays hands-on.


## Table of Contents

1. [What You’ll Build](#-what-youll-build): A high-level look at the system you’ll set up and the end goal. 
2. [Prerequisites](#-prerequisites)  
3. [Installation & Setup](#-installation--setup)  
4. [Deploying the Network](#-deploying-the-network)  
5. [Sending & Receiving Your First Message](#-sending--receiving-your-first-message)  
6. [Multiple Topics & Isolation](#-multiple-topics--isolation)  
7. [Load Testing](#-load-testing)  
8. [Key Parameters Explained](#-key-parameters-explained)  
9. [Monitoring & Debugging](#-monitoring--debugging)  
10. [Cleanup & Reset](#-cleanup--reset)  
11. [FAQ & Glossary](#-faq--glossary)  
12. [Next Steps](#-next-steps)  
13. [More Coming Soon](#-more-coming-soon)


## What You’ll Build

By the end of this guide, you will have:

* A **local OptimumP2P network** with 4 P2P nodes + 2 proxy servers  
* The ability to **send and receive messages in real-time** over gRPC  
* Support for **multiple topics** with complete isolation  
* Tools for **load testing, debugging, and monitoring**

## Prerequisites

Before starting, make sure you have:

* **Docker** ([Install here](https://www.docker.com/products/docker-desktop))
* **Docker Compose** (comes with Docker Desktop)
* **Git** (optional, but recommended)
* **Go 1.24+** ([Install here](https://go.dev/dl/)) — only needed if running the Go client

**Check your setup:**

```bash
docker --version
docker-compose --version
go version
```

## Installation & Setup

### **Create a working directory**

```sh
mkdir optimump2p-hackathon && cd optimump2p-hackathon
```

1. **Prepare identity folder**

The identity folder stores node peer IDs.
