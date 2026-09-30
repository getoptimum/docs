---
title: Recommendation
description: What you accept before a cutoff is shown, and what the number means.
---

# Recommendation

**Start Accelerate** opens **Acknowledge the disclaimer**. You can close it. Staff cannot accept it for you.

The notice says the configuration information is a simulation from current network data, for information only. Optimum does not guarantee a performance outcome. Changes you make on your own infrastructure are your decision, and Optimum is not liable for the outcomes of using that information.

Read the text in the dialog. The copy on this page is a summary so you know what the step is. The dialog is the agreement.

After you accept, **Bid cutoff** asks you to upload the MEV-Boost configuration you actually run. Console compares it with what your proposals show. It still does not change anything on your side.

If you have no file yet, **Download a starter file**. The download is `mev-boost-config.yaml`, with the known mainnet relays and MEV-Boost’s default cutoff. It is a starting point, not a config Console has applied.

Until a file is on record, the report has no cutoff to judge proposals by. The screen says **No configuration uploaded yet**.

The recommendation itself is withheld below 200 measured proposals. The callout is **Not enough proposals yet for a recommendation**. See [Readiness](/accelerate/readiness).

On the report, **Recommended cutoff** is the offset where a later bid was available. The note is ETH per MEV block across the MEV blocks in the window. The callout beside it is **This does not price the risk of waiting**: the figure is uplift that was available at that offset, on blocks already proposed. **No cutoff change indicated** means the window does not support moving it.
