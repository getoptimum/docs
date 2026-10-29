---
title: What Accelerate does
description: A bid cutoff for the MEV sidecar you already run, from slots you already proposed. Console does not apply it.
---

# What Accelerate does

Under the **Accelerate** heading, the screen reads **Accepting bids closer to your deadline captures more MEV. Accelerate measures what that would have been worth on the blocks you propose, and recommends a cutoff from your own slots.**

Accelerate recommends the bid cutoff for the MEV sidecar you already run, so a proposal can take a better bid without waiting so long that the block is late. The number comes from slots your validators already proposed. You upload the sidecar configuration you run, read the recommendation, and download a config to deploy yourself. Console never writes to your infrastructure. Nothing on this screen changes validator behavior until you deploy that file.

## Who can use it

The sidebar shows **Accelerate** when Optimum has enabled it for your organization and you have at least 200 active validators on mainnet. It is offered to **entity** accounts, which is who reaches that number. Registering as an entity does not enable it. An individual account with at least 200 active validators on mainnet can be enabled the same way. See [Account type](/getting-in/account-type).

A cutoff recommendation, once you are on the screen, still needs 200 measured proposals. [Readiness](/accelerate/readiness).

If **Accelerate** is not in the sidebar, your organization is not enabled or it has fewer than 200 active validators on mainnet. Below that number the entry stays hidden. Otherwise ask [support](/help/support). There is no other URL to use.

## The steps

1. **Start Accelerate** — prerequisites, including the disclaimer.
2. **Recommendation** — your config, and the recommended bid cutoff once the window can support one.
3. **Adjust** — you set the cutoff on the sliders, download the config for MEV-Boost or Commit-Boost, and record what you deployed.

Where you land on a return visit follows what is already stored. No acceptance sends you to step 1. Acceptance without a saved config sends you to the recommendation. A saved config sends you to adjust. If the terms change, the previous acceptance no longer counts and you start again.

When a measurement cycle finishes and you have not answered it, **Accelerate** in the sidebar shows **1**, and the screen leads with **Your measurement cycle is complete**. **Review the recommendation** opens step 2. Dismissing hides that notice until the next cycle completes.

## What it measures

Every figure is measured on slots you already proposed. The figures sit on this screen, under **MEV outcome**. See [Acceleration](/accelerate/where-results-show).

Before you accept the terms, the top of the screen says **Accept the terms to see your modeled gain**. After you accept, that place shows the annual figure: what a later bid cutoff could have captured on the slots you propose, from the simulation the terms describe. See [Readiness](/accelerate/readiness#modeled-annual-gain).

## Older names on some screens

The sidebar entry and the screen heading are **Accelerate**. Results are **MEV outcome** on that screen. There is no **MumBoost** item under **Performance**, and the title **MEV Cutoff Optimization** is not on this screen.

A direct link to the older report can still show two MumBoost messages: **Could not check the MumBoost terms**, and **This operator has not accepted the MumBoost terms**. Both mean the same check on Accelerate. See [Acceleration](/accelerate/where-results-show).
