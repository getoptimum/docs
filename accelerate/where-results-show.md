---
title: Where results show
description: The report screen Console opens after a cutoff is on file.
---

# Where results show

The report is under **Performance**. Its title is **MEV Cutoff Optimisation**. The subtitle is either measured proposal performance since the last cutoff adjustment, or measured proposal performance over the selected window. The window end is exclusive.

Optimum · mump2p · Mainnet is the eyebrow on that screen. It is the network label, not a second product.

What you can read there, once the window has proposals:

* Proposal count, in slots.
* Accepted ETH, and unrealised ETH, per MEV block. Offsets are measured from the bid you took, not from slot start.
* A cutoff curve: additional value per MEV block had the cutoff been this late, against the bid that was actually accepted.
* Head votes and failure types by slot.

**No proposals in this window** means this operator was not assigned a block proposal in that range. Widen the window.

**No report for this window** is a failed load, not an empty fleet. Refresh. If it persists, use [Support](/help/support).

A configuration cannot be stored if Console cannot confirm the terms. **Could not check the MumBoost terms** means the check failed open-ended: wait and refresh. **This operator has not accepted the MumBoost terms** means accept them on Accelerate first. Those two labels still say MumBoost. See the naming note on [What Accelerate does](/accelerate/what-accelerate-does).

::: warning TODO
Self-serve accounts do not get this Performance entry. The report exists for organisations where it is enabled.
:::
