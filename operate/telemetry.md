---
title: Telemetry
description: The loopback health port, and where metrics are documented.
---

# Telemetry

Console enables telemetry and remote push in the start command. Both variables are required. See [Connect your gateway](/signal/connect-your-gateway).

On the gateway host:

```bash
curl http://localhost:48123/health
curl -s http://localhost:48123/api/v1/self_info
```

`/metrics` is on the same port and is not served until telemetry is enabled. Do not publish `48123` beyond loopback.

What each series means, and how the panels are calculated:

* [Metrics and Grafana](https://getoptimum.github.io/optimum-gateway/versions/latest/telemetry)
* [Metrics reference](https://getoptimum.github.io/optimum-gateway/versions/latest/metrics)
* [Metrics methodology](https://getoptimum.github.io/optimum-gateway/versions/latest/metrics-methodology)
