---
title: MEV sidecar configuration
description: Record the cutoff you set on MEV-Boost or Commit-Boost, then download the config on file. Console does not push it.
---

# MEV sidecar configuration

The cutoff you deploy lives in the MEV sidecar beside your beacon node. Two implementations are in use.

* **MEV-Boost.** Console’s download is `mev-boost-config.yaml`. The cutoff in that file is `timeout_get_header_ms`. Deploy the file the way you already deploy MEV-Boost config.
* **Commit-Boost.** Console does not write a Commit-Boost file. Take the same cutoff, in milliseconds into the slot, and set it in the Commit-Boost config you already deploy.

Optimum has no write access to either sidecar.

**Bid cutoff** is `timeout_get_header_ms`: the last moment a getHeader bid is accepted, in milliseconds into the slot. A later cutoff can take a higher bid. Set late enough, the proposal misses the slot. That name is the MEV-Boost flag. On Commit-Boost, use the cutoff field in the config you already run.

The late-in-slot deadline is `late_in_slot_time_ms`. The cutoff cannot sit on or past it. Console keeps the cutoff at least 1 ms earlier.

From the recommendation, **I am ready to adjust** opens **Record your change**. The line under the heading is **Set them on your own infrastructure, then tell us what you set.**

Type **Cutoff you have set** and **Late in slot you have set**, then **Confirm change**. That records what you deployed. It does not deploy it.

![Accelerate, Adjust. Cutoff you have set, Confirm change, and Download config are marked.](/console/09-accelerate-adjust.png)

**Recap of the params on file** is the values currently recorded, not the recommendation. **Download config** saves that recorded file as `mev-boost-config.yaml`. The note under the recap says `late_in_slot_time_ms` is on file but is not a mev-boost flag, so it is not in the file. `--min-bid` and `--relay-check` are not stored, and they are unchanged.

Deploy that file on MEV-Boost the way you already deploy config. On Commit-Boost, copy the cutoff into the config that sidecar already uses.

**Review cutoff**, on the banner after a cutoff is recorded, opens the editor instead of the typed form. **I have adjusted my cutoff** records the sliders. **Back to results** leaves the editor. In that editor, **Configuration matches the file you uploaded** means you have not moved the cutoff since the upload. **Unsaved changes to the cutoff** means the editor and the file you uploaded differ. The editor says **Export the new config and deploy it — nothing here reaches your infrastructure.**

What changed after you deployed is under **MEV outcome** on this screen, not on the upload panel. See [Acceleration](/accelerate/where-results-show).
