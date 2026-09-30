---
title: Troubleshoot
description: Where to look first, then the gateway troubleshooting page.
---

# Troubleshoot

Start with the failure you can see:

* Container exits, health curl refused, client not peering, peer id changed: [When the check fails](/signal/when-the-check-fails).
* Health is `503` and you have not peered the client yet: that is expected. [Connect your gateway](/signal/connect-your-gateway).
* Second host refused enrolment: the hostname is already used. [Before you begin](/start/before-you-begin).
* Indices rejected or skipped: [Register keys](/signal/register-keys).
* No Accelerate entry, or no report: [What Accelerate does](/accelerate/what-accelerate-does) and [Your first report](/signal/your-first-report).

Anything past the command Console gave you — config keys, log lines, metric names — is in [Troubleshooting](https://getoptimum.github.io/optimum-gateway/versions/latest/troubleshoot) for gateway `v1.3.2`.
