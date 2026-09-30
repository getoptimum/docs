---
title: Register keys
description: How validator indices are submitted, and what Console does with them before they count.
---

# Register keys

The screen is **Validator indices to connect**. The signup rail calls the step **Register keys**.

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

**Skip for now** writes nothing. You can return from the signup link.

After a successful submit, the note on the screen is: submitted, and confirmed before they appear in any report.

You can add more later from the console. Self-serve accounts find ongoing key management under **Keys**. Invited operators see **Manage gateways** and, when it is enabled, **Activate validators**.
