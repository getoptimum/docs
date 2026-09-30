---
title: Kubernetes
description: Pointer to the gateway Helm guide.
---

# Kubernetes

Console’s connect step is a `docker run`. The same gateway runs under Helm. Ports, the enrollment key, telemetry on loopback, and the identity volumes still apply: a pod that does not persist the libp2p and mump2p data gets a new peer id on restart.

The chart and values are in [Kubernetes (Helm)](https://getoptimum.github.io/optimum-gateway/versions/latest/kubernetes).
