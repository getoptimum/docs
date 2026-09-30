---
title: What Accelerate does
description: Bid cutoff recommendations from slots you already proposed. Console does not apply them.
---

# What Accelerate does

Accelerate recommends a MEV-Boost bid cutoff from slots your validators already proposed. The setup screen is **Accelerate**. The report it points at is titled **MEV Cutoff Optimisation**.

Console never writes to your infrastructure. You upload the MEV-Boost configuration you run, read a recommendation, and download a config to deploy yourself. Nothing on this screen changes validator behaviour until you deploy that file.

The steps are:

1. **Start Accelerate** — prerequisites, including the disclaimer.
2. **Recommendation** — your config.
3. **Adjust** — you record the cutoff you will deploy.

Where you land on a return visit follows what is already stored. No acceptance sends you to step 1. Acceptance without a saved config sends you to the recommendation. A saved config sends you to adjust. If the terms change, the previous acceptance no longer counts and you start again.

::: warning TODO
The setup flow is labeled Accelerate. Routes, flags, and some labels still say MumBoost. Which name stays is unanswered, so this site uses the label on each screen.
:::

::: warning TODO
A self-serve account does not have Accelerate in the sidebar. Whether individual accounts should see it is unanswered. If the entry is missing, it is not enabled for this account. There is no alternate URL to use.
:::

::: warning TODO
A modelled or annualised gain is not what Console shows. The figure is measured on slots already proposed. This site does not describe a forecast.
:::
