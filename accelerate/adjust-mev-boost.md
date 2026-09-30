---
title: Adjust MEV-Boost
description: Download the config and deploy it yourself. Console does not push it.
---

# Adjust MEV-Boost

Upload first. The editor reads the file you are running.

**Bid cutoff** is `timeout_get_header_ms`: the last moment a getHeader bid is accepted, in milliseconds into the slot. A later cutoff can take a higher bid. Set late enough, the proposal misses the slot.

The late-in-slot deadline is `late_in_slot_time_ms`. The cutoff cannot sit on or past it; Console keeps the cutoff at least 1 ms earlier.

Move the cutoff, then **DOWNLOAD CONFIG**. The file is `mev-boost-config.yaml`. The screen says **Export the new config and deploy it — nothing here reaches your infrastructure.** Deploy that file on your MEV-Boost the way you already deploy config. Optimum has no write access to it.

**Configuration matches the file you uploaded** means you have not moved the cutoff since the upload. **Unsaved changes to the cutoff** means the editor and the file you uploaded differ; download before you deploy, or the node is still on the old value.

After a config is stored, **Results** on the Accelerate screen says the terms are accepted and a configuration is on file. **View the proposal report** opens the measurement. What changed after you deployed is on that report, not on the upload panel. See [Where results show](/accelerate/where-results-show).
