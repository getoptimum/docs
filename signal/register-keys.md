---
title: Register keys
description: How validator indices are submitted, and what Console does with them before they count.
---

# Register keys

Self-serve accounts submit indices on **Activate validators** in the console sidebar. The page shows two counts, **Confirmed** and **Awaiting confirmation**, above the form **Validator indices to connect**. Signal's step 2 is called **Register keys**.

Indices are how Console knows which slots you proposed. They are confirmed by Optimum before they appear in a report. Submitting them does not make them active.

Paste decimal validator indices, or upload a CSV (one per line, or comma separated).

| Result | What it means |
| --- | --- |
| Indices submitted | Accepted into the queue. |
| Stake once confirmed | `submitted × 32` ETH. That is the protocol’s stake per index, not a balance Console looked up. |
| Could not be read as an index | BLS public keys and anything that is not a decimal index were skipped. Contact support if you only have keys. |
| Already claimed | Not submitted. Contact support if they are yours. |
| Not found on the beacon node | Check the indices and submit again. |
| Were not submitted | This account has reached its limit for validator lookups. Contact support to register the rest. A retry does not raise the limit. |
| Could not be checked just now | The beacon node did not answer. Nothing is wrong with those indices. Submit them again in a few minutes. |

## What you submitted

After a submit, **What you submitted** lists every index from that paste or file, each tagged with its outcome. Hover a tag for the reason.

| Tag | Meaning |
| --- | --- |
| **submitted** | Waiting for Optimum to confirm it. |
| **not found** | The beacon node does not know this index. Check it and submit again. |
| **already claimed** | Another operator holds this index. Contact support if it is yours. |
| **not checked** | The beacon node did not answer for this index. Submitting again may work. |
| **no lookups left** | The account ran out of lookups before this index. The limit is for the life of the account, so a retry will not help. |

The list covers your latest submit only. It is built from what you just sent, so Console still never reads your registered indices back to you.

After a successful submit, the note on the screen is: submitted, and confirmed before they appear in any report. **Submit these too** sends another batch.

Signal's **Register keys** step shows how many indices are on record, and **Register indices** opens **Activate validators**. That page is where the paste and the CSV upload sit.

To add more later, use **Activate validators** again, or ask support. Invited operator accounts with a set that keeps changing use [Keysync](/keysync/). The bulk screens are on [Onboard in bulk](/signal/onboard-in-bulk). **Gateways & keys** holds gateway keys, not validator indices.

Accelerate counts only indices that are active on chain. An index still in the activation queue is on record and proposes nothing yet. See [Readiness](/accelerate/readiness).
