---
title: Where results show
description: The Accelerate proposal report Console opens after a cutoff is on file.
---

# Where results show

Open **View the proposal report** on Accelerate, or **Performance** → **MumBoost** in the sidebar. Both open the same Accelerate report. Its title on screen is still **MEV Cutoff Optimisation**. The subtitle says the window measures either performance since your last cutoff adjustment or a window you selected. The window end date is not included.

![The proposal report. MumBoost in the sidebar and the title MEV Cutoff Optimisation are marked.](/console/10-proposal-report.png)

**Optimum · mump2p · Mainnet** above the title names the network. It is not a separate product.

Once the window has proposals, the report shows:

* Proposal count, in slots.
* Accepted ETH and unrealised ETH per MEV block. Offsets count from the bid you took, not from the start of the slot.
* A cutoff curve showing the extra value per MEV block if the cutoff had been later, compared with the bid that was accepted.
* Head votes and failure types by slot.

**No proposals in this window** means none of your validators was assigned a block proposal in that range. Widen the window.

**No report for this window** means the report failed to load. It does not mean you have no proposals. Refresh. If it persists, use [Support](/help/support).

Console stores a configuration only after it confirms you accepted the terms. **Could not check the MumBoost terms** means that check failed. Wait and refresh. **This operator has not accepted the MumBoost terms** means you need to accept them on Accelerate first. Both labels use MumBoost, the older name for Accelerate. See [Older names on some screens](/accelerate/what-accelerate-does#older-names-on-some-screens).

The **MumBoost** entry appears only when it is enabled for your account.
