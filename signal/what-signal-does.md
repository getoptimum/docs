---
title: What Signal does
description: Signal is the flow that peers your gateway with your beacon node.
---

# What Signal does

Signal is the sidebar entry for the first gateway. The screen is **Connect your first gateway**.

The order on that screen is not numbered a second time. Signup already shows which step of registration you are on.

1. **Start the gateway beside your beacon node** — or, if you do not run validators, **Start the gateway on any host you control**.
2. **Check it is healthy** — `curl` against the gateway host.
3. **Connect your validators** — only if you run validators. You pick the consensus client here. The flag, and which side dials, depend on that client.

Create the enrollment key when you are ready to run the container. Nothing is created until you do. The secret is shown once, inside the command. If you already have an unused key, Console cannot show the secret again: export it as `OPT_JOIN_KEY` and run the command, or mint a new one.

You can skip with **I’ll do this later**. The gateway can be connected from Console afterwards. A failed mint does not change the account; mint again from **Keys** (self-serve) or **Manage gateways** (invited operators and staff).

One key covers every gateway. Run the same command on each host. Hostnames must differ, because the gateway enrols as `OPT_GATEWAY_ID=$(hostname)` and a repeat label is refused.

::: info
Optimum does not see the loopback health check. The check you run is on the gateway host. What Console can see from outside is that a credential exists, the gateway reported in, and its blocks reached the mesh.
:::
