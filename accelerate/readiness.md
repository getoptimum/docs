---
title: Readiness
description: The 200-proposal floor Console uses before it will recommend a cutoff.
---

# Readiness

Before you accept anything, Console states what the current window can support.

A cutoff recommendation needs **200 proposals that carry a failure measurement**, across all your validators, not per key. The panel is **Not enough proposals yet** until that count reaches 200. You can still start Accelerate and upload a configuration. Measurement runs from the moment that configuration takes effect. The recommendation appears once the window holds enough.

When the window is large enough and a later bid was actually available, the panel is **What your proposals show**. The number is **ETH per MEV block**, left on the table in this window, measured against bids that arrived after the one your current cutoff took. The line under it is **Already proposed — not a projection.**

Two other answers, when there is nothing to recommend:

* Proposals were measured, but none of them took a relay bid, so there is no bid curve to read a cutoff from yet.
* Proposals were measured, and no better bid arrived after the one your current cutoff took.

Under **Before you start**, the row **Validator keys active** has three states. Indices are required to know which slots you propose. The button tells you what is missing rather than failing silently.

| State | On the screen | What to do |
| --- | --- | --- |
| **Needed** | Needed to know which slots you propose. | [Register keys](/signal/register-keys). |
| **Activating** | Indices on record, none active on chain yet. | Wait for the activation queue. Pending validators are not assigned proposal slots, so nothing is measured until they activate. |
| **Done** | `N` of `M` registered indices active on chain. | Nothing. Proposals count as they happen. |

While Console is still looking, the row reads **Checking which of your indices are active on chain…**.

If indices are on record and the panel says **Not enough proposals yet**, check this row first. **Activating** means you are waiting on activation, not on proposal luck.

The report’s own charts use the same measurement: accepted ETH on the bid that was taken, unrealised ETH on bids that arrived later, per MEV block. A per-proposal average is a different number and is labelled that way on the report. Do not read the headline ETH-per-MEV-block figure as ETH per proposal.
