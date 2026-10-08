---
title: What Accelerate does
description: A bid cutoff for the MEV sidecar you already run, from slots you already proposed. Console does not apply it.
---

# What Accelerate does

Accelerate recommends the bid cutoff for the MEV sidecar you already run, so a proposal can take a better bid without waiting so long that the block is late. The number comes from slots your validators already proposed. You upload the sidecar configuration you run, read the recommendation, and download a config to deploy yourself. Console never writes to your infrastructure. Nothing on this screen changes validator behaviour until you deploy that file.

## Who can use it

Accelerate is for **entity** accounts. An **individual** account has Signal only. See [Account type](/getting-in/account-type).

A recommendation needs 200 measured proposals ([Readiness](/accelerate/readiness)). An individual operator rarely proposes that many in a window short enough to act on, so the flow is offered to entities.

If you registered as an entity and **Accelerate** is not in the sidebar, it is not enabled for your account yet. Ask [support](/help/support). There is no other URL to use.

## The steps

1. **Start Accelerate** — prerequisites, including the disclaimer.
2. **Recommendation** — your config, and the recommended bid cutoff once the window can support one.
3. **Adjust** — you record the cutoff you will deploy, then download the config on file.

Where you land on a return visit follows what is already stored. No acceptance sends you to step 1. Acceptance without a saved config sends you to the recommendation. A saved config sends you to adjust. If the terms change, the previous acceptance no longer counts and you start again.

When a measurement cycle finishes and you have not answered it, **Accelerate** in the sidebar shows **1**, and the screen leads with **Your measurement cycle is complete**. **Review the recommendation** opens step 2. Dismissing hides that notice until the next cycle completes.

## What it measures

Every figure is measured on slots you already proposed. Console does not forecast an annual gain. The figures sit on this screen, under **MEV outcome**. See [Acceleration](/accelerate/where-results-show).

## Older names on some screens

The sidebar entry and the screen heading are **Accelerate**. Results are **MEV outcome** on that screen. There is no **MumBoost** item under **Performance**, and the title **MEV Cutoff Optimisation** is not on this screen.

A direct link to the older report can still show two MumBoost messages: **Could not check the MumBoost terms**, and **This operator has not accepted the MumBoost terms**. Both mean the same check on Accelerate. See [Acceleration](/accelerate/where-results-show).
