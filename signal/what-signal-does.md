---
title: What Signal does
description: Signal puts a gateway beside your beacon node so your validators receive blocks sooner.
---

# What Signal does

Signal is the gateway beside your beacon node. It receives blocks from the Optimum mesh and hands them to your consensus client, so your validators receive blocks sooner. That is what improves attestation performance.

You set it up in one of two places. Both use the same command.

* **During signup.** The step is **Connect your first gateway**. It creates an enrollment key, shows the start command, the health check, and, if you run validators, the client flag. You can leave it with **I’ll do this later**.
* **Signal in the Console sidebar.** Use this after signup, and for every gateway after the first. It has three steps.

| Step | On the screen | What you do |
| --- | --- | --- |
| Run a gateway | One command | Start the container, then check it is healthy on the host. |
| Peer your client | One setting | Point your consensus client at the gateway, or, for Lighthouse, the gateway at the client. |
| Verify | Check it took | Console confirms the gateway enrolled, reported in, and is sending blocks to the mesh. |

An account that does not run validators skips **Peer your client**.

The pill beside the **Signal** title shows the last check: **Not checked**, **Checking**, **Connected**, **Not connected**, **Unknown**, or **Check failed**.

## Enrollment keys

One enrollment key covers every gateway you run. Each host enrols under its hostname, so hostnames must differ.

On Signal, **Create an enrollment key that lasts a day** puts a new key straight into the command. The key is shown once. After a day, that copy of the command no longer enrols gateways. For a longer-lived key, mint one on **Keys** → **Enrollment keys** (invited operator accounts see **Manage gateways**), where you choose how long it lasts. Export it as `OPT_JOIN_KEY` before running the command.

Next: [Network](/signal/network), then [Connect your gateway](/signal/connect-your-gateway).
