---
title: Onboard in bulk
description: Many gateways from one enrollment key, and many validators at once.
---

# Onboard in bulk

## Many gateways

You do not need one key per host. One enrollment key enrols the whole fleet. See [Why enrollment keys](/signal/what-signal-does#why-enrollment-keys).

1. Mint a key that outlasts the rollout: **Keys** → **Enrollment keys** (**Manage gateways** on an invited account) → **Generate enrollment key**. Set **Valid for (days)** to cover the time until the last host is started. The secret is shown once. Store it where your deployment tooling reads secrets.
2. Copy the start command from Signal. It reads the key from `$OPT_JOIN_KEY` unless you had Console put a key in it.
3. On each host, export `OPT_JOIN_KEY` and run that same command.
4. Peer each gateway with the beacon node beside it. Every gateway has its own peer id. [Connect your gateway](/signal/connect-your-gateway).
5. Open Signal and **Run check**. Verify covers every gateway in your organisation together: **Gateway enrolled** shows how many, such as **Yes, 3**. It does not name them, so check each new host with `curl http://localhost:48123/health` on that host.

Hostnames must differ. The command sets `OPT_GATEWAY_ID=$(hostname)`, and a second gateway under a hostname that is already enrolled is refused with HTTP 409. Hosts built from one image often share a hostname, so set it per host first.

Keep each host's `$HOME/optimum-gateway` directories. A gateway that keeps them re-uses its credential and spends nothing on restart. One that loses them enrols again, spends another of the key's enrollments, and is refused under the same hostname until the old credential is revoked.

On Kubernetes, store the key in a Secret, inject it as `OPT_JOIN_KEY`, and give each pod a unique `OPT_GATEWAY_ID`, such as the pod name. Keep the identity PVC: an `emptyDir` is lost whenever the pod is replaced, and every replacement enrols again. The chart's own values still describe the older API key path. See [Fleet enrollment (join key)](https://getoptimum.github.io/optimum-gateway/versions/latest/kubernetes#fleet-enrollment-join-key) in the gateway Helm guide.

## Many validators

Validator indices are how Console knows which slots you propose. Three ways to submit them in bulk:

| Where | How | Who has it |
| --- | --- | --- |
| Signup, **Register keys** | **Paste indices** or **Upload CSV**: decimal indices, one per line or comma separated. Optimum confirms them before they count. | Every account that answered yes to **Do you run validators?** |
| **Activate validators** → **Manage validators** | **Add**, **Remove**, or **Replace** your set. **Paste** or **Upload CSV**. A line is an index, an index and its BLS key, or a BLS key. **Replace** shows the net change before it applies. | Invited operator accounts, when the screen is enabled. |
| **Keep your validators in sync automatically**, on **Activate validators** | Generate an operator API key under **Manage API keys**, then run [optimum-keysync](https://github.com/getoptimum/optimum-keysync) on a schedule. It reconciles your set against `POST /api/v1/validator-keys/batch` every run. | Invited operator accounts. |

Console never lists your indices back to you. **Activate validators** shows counts and a history of changes only.

Self-serve accounts add indices after signup by returning from the signup link or asking [support](/help/support). See [Register keys](/signal/register-keys).
