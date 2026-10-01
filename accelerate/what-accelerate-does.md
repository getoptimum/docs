---
title: What Accelerate does
description: Bid cutoff recommendations from slots you already proposed, for entity accounts. Console does not apply them.
---

# What Accelerate does

Accelerate recommends a MEV-Boost bid cutoff from slots your validators already proposed. Console never writes to your infrastructure. You upload the MEV-Boost configuration you run, read a recommendation, and download a config to deploy yourself. Nothing on this screen changes validator behaviour until you deploy that file.

## Who can use it

Accelerate is for **entity** accounts. An **individual** account has Signal only. See [Account type](/getting-in/account-type).

A recommendation needs 200 measured proposals ([Readiness](/accelerate/readiness)). An individual operator rarely proposes that many in a window short enough to act on, so the flow is offered to entities.

If you registered as an entity and **Accelerate** is not in the sidebar, it is not enabled for your account yet. Ask [support](/help/support). There is no other URL to use.

## The steps

1. **Start Accelerate** — prerequisites, including the disclaimer.
2. **Recommendation** — your config.
3. **Adjust** — you record the cutoff you will deploy.

Where you land on a return visit follows what is already stored. No acceptance sends you to step 1. Acceptance without a saved config sends you to the recommendation. A saved config sends you to adjust. If the terms change, the previous acceptance no longer counts and you start again.

## What it measures

Every figure is measured on slots you already proposed. Console does not forecast an annual gain.

## Older names on some screens

Accelerate is the product. A few Console labels still use older names for the same thing:

* **MumBoost** — the report entry under **Performance**, and the terms messages.
* **MEV Cutoff Optimisation** — the title of the proposal report.

This site says Accelerate, and quotes those labels where you need to find them on screen.
