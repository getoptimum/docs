---
title: Your first report
description: What each figure waits for, and where it appears.
---

# Your first report

The first figures are on the Signal home, not on a separate screen. Each card waits for something different, and a card that is still waiting says so.

| Card | What it shows | What it waits for |
| --- | --- | --- |
| Blocks received earlier | Mean lead per slot, once there is a figure. | A week of paired slots. Per-operator figures stay **Pending** until at least 30 paired slots are in the window. |
| Attestation accuracy | Correct and timely head votes. | 500 or more indices on record, then the weekly report. Below 500 the card says how many it needs. |
| Gateways online | How many gateways Optimum saw recently. | A gateway that reported in during the last ten minutes. No validator indices needed. |
| Indices measured | How many indices are on record. | Indices you submitted. The count is derived on-chain. |

**Weekly reports are running** appears once 500 or more indices are on record. **View gains** opens the attestation report. Below 500, the same band says there are too few duties in a week to separate a real change from noise.

**Attestations** and **Network** under **Performance** are those same reports in full. Each entry appears only when it is enabled for your account. Self-serve accounts do not get **Attestations**.

Submitted indices are not confirmed indices. Optimum confirms them first. Until then the accuracy card stays **Pending** on purpose.

**Accelerate** is in the main sidebar, not under **Performance**. Its proposal figures are on the Accelerate screen, under **MEV outcome**. See [Acceleration](/accelerate/where-results-show). Accelerate waits on proposed slots, not on the 500-index line. See [Readiness](/accelerate/readiness).
