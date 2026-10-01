---
title: Your first report
description: What each report waits for, and where it appears.
---

# Your first report

Reports appear under **Performance** in the Console sidebar. Each entry appears only when it is enabled for your account.

| Entry | What it shows | What it waits for |
| --- | --- | --- |
| Gateways | Your gateways as Optimum measures them. | A running gateway. No validator indices needed. |
| Network | Propagation against libp2p for your validators. | 500 or more confirmed validator indices. Per-operator figures show `n/a` until at least 30 paired slots are in the window. |
| Attestations | Attestation outcomes. | Confirmed validator indices. Self-serve accounts do not have this entry. |
| MumBoost | The Accelerate proposal report: proposal performance and MEV capture. MumBoost is the older name still on this entry. See [Where results show](/accelerate/where-results-show). | Proposed slots from active validators. |

**Gateways** is in the main sidebar group, not under **Performance**.

Submitted indices are not confirmed indices. Optimum confirms them first. Until then, **Network** and **Attestations** are empty on purpose. A newly onboarded partner sees the same.

Accelerate waits on proposed slots, not on the 500-index line. See [Readiness](/accelerate/readiness).
