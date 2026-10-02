---
title: What Signal does
description: Signal puts a gateway beside your beacon node so your validators receive blocks sooner.
---

# What Signal does

Signal is the gateway beside your beacon node. It receives blocks from the Optimum mesh and hands them to your consensus client, so your validators receive blocks sooner. That is what improves attestation performance.

You set it up in one of two places.

* **During signup.** The step is **Connect your first gateway**. It creates an enrollment key, shows the start command, the health check, and, if you run validators, the client flag. If you answered no to **Do you run validators?**, the command is the stream-only one. Console watches for the gateway and shows **Gateway connected** once it enrols. You can leave it with **I’ll do this later**.
* **Signal in the Console sidebar.** Use this after signup, and for every gateway after the first. It has three steps.

| Step | On the screen | What you do |
| --- | --- | --- |
| Run a gateway | One command | Start the container beside your beacon node. |
| Peer your client | One setting | Point your consensus client at the gateway, or, for Lighthouse, the gateway at the client. |
| Verify | Check it took | Console confirms the gateway enrolled, reported in, and is sending blocks to the mesh. |

![Signal, Run a gateway. The one-day enrollment key and the SELinux switch are marked.](/console/03-signal-run-gateway.png)

Copy the command from this screen. It already carries the hosts for the environment you are signed into. Turn on the SELinux switch before you copy it when the host enforces SELinux.

An account that does not run validators skips **Peer your client**. The command on Signal is still the beacon-node one, so for another stream-only gateway use the [stream-only command](/signal/connect-your-gateway#stream-only).

**Verify** is the check to trust. It reads what Optimum sees from outside your host. The `curl /health` command beside the start command answers one thing Verify cannot: whether your consensus client is peered. Its first word is often `degraded` until that is done. See [When the check fails](/signal/when-the-check-fails).

The pill beside the **Signal** title shows the last check: **Not checked**, **Checking**, **Connected**, **Not connected**, **Unknown**, or **Check failed**.

## Why enrollment keys

A gateway does not need a secret of its own handed to it. You give every host the same enrollment key (`OPT_JOIN_KEY`, `ojk_…`). On first start, each gateway creates its own keypair, enrols with Optimum, and keeps the credential it gets back in `$HOME/optimum-gateway/mump2p`. From then on it uses that credential, not the enrollment key.

That is what makes a fleet manageable:

* **One key for many hosts.** Run the same command on every host. Each enrolls under its own hostname (`OPT_GATEWAY_ID`), so hostnames must differ. A repeat is refused with HTTP 409.
* **Nothing to rotate on the hosts.** The key only lets new gateways in. When it expires or you revoke it, gateways that already enrolled keep running.
* **A short window if it leaks.** The key's lifetime is how long a copied command can still add gateways to your organisation.
* **The network and cluster come from the key.** A gateway cannot pick its own.

Each key admits up to 1,000 gateways, and your organisation is capped at 1,000 live gateway credentials. A gateway that keeps its credential across restarts spends nothing. Losing the identity directory spends another enrollment.

## Which key lifetime

| Where you get it | Lasts | Use it for |
| --- | --- | --- |
| Signup, **Connect your first gateway** | 14 days | The first gateway, when the person signing up is not the person on the host. |
| Signal, **Create an enrollment key that lasts a day** | 1 day | A command you are about to paste. It goes straight into the command. |
| **Keys** → **Enrollment keys** (**Manage gateways** on an invited account), **Generate enrollment key** | You choose in **Valid for (days)**, up to 365 | A rollout across many hosts or over several weeks. |

![Manage gateways, Enrollment keys. Generate enrollment key is marked.](/console/06-enrollment-keys.png)

Every key is shown once. Export it as `OPT_JOIN_KEY` before running the command, unless Console already put it in. The key list shows **enrollments used** and the expiry date.

Revoking an enrollment key stops new gateways only. To cut off one gateway that already enrolled, revoke that gateway's own key under **Manage gateways** → **Gateway**. Self-serve accounts do not have that tab; ask [support](/help/support).

Next: [Network](/signal/network), then [Connect your gateway](/signal/connect-your-gateway).
