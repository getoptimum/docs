---
title: Readiness
description: The 200-proposal floor Console uses before it will recommend a cutoff, and what the screen shows until then.
---

# Readiness

Before you accept anything, Console states what your history can support.

A cutoff recommendation needs 200 measured proposals, across all your validators, not per key. Until the cycle holds that many, the Adjust step says **Not enough proposals yet for a recommendation**. You can still start Accelerate and upload a configuration. Measurement runs from the moment that configuration takes effect. The recommendation appears once the cycle holds enough.

## Modelled annual gain

The top of step 1 is about the modelled gain: what a later bid cutoff could have captured on blocks you already proposed, held at that rate for a year. It is read from the simulation the terms describe, so before you accept them the screen says **Accept the terms to see your modelled gain**.

The other answers in that place:

| On the screen | What it means |
| --- | --- |
| **Reading your modelled gain** | The window is still being read. |
| **Still gathering evidence** | The model needs 30 days of ingested history and 30 MEV blocks. The line says how far along you are. |
| **No MEV blocks to model yet** | Nothing you proposed in the window took a relay bid, so there is no bid timing to model. |
| **Nothing was left on the table** | No better bid arrived after the one you took, at any measured offset. |
| **Could not model your proposals** | The read failed. Refresh. |

## Before you start

Under **Before you start**, the row **Validator keys registered** has three states. Indices are required to know which slots you propose. The button tells you what is missing rather than failing silently.

![Accelerate, Before you start. Validator keys registered is marked, and its state is Needed.](/console/08-accelerate-before-you-start.png)

| State | On the screen | What to do |
| --- | --- | --- |
| **Needed** | Needed to know which slots you propose. | [Register keys](/signal/register-keys). |
| **Activating** | Indices on record, none active on chain yet. | Wait for the activation queue. Pending validators are not assigned proposal slots, so nothing is measured until they activate. |
| **Done** | `N` of `M` registered indices active on chain. | Nothing. Proposals count as they happen. |

If Console could not read which indices are active, the row stays **Needed** and says **We could not read which of your indices are active on chain, so this is unverified.** Refresh. That is a failed read, not an empty set.

If indices are on record and the recommendation says **Not enough proposals yet for a recommendation**, check this row first. **Activating** means you are waiting on activation, not on proposal luck.

The report’s own charts measure per MEV block: accepted ETH on the bid that was taken, unrealised ETH on bids that arrived later. A per-proposal average is a different number and is labelled that way on the report.
