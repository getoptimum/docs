---
title: Troubleshoot
description: The failures operators hit, what each one means, and the fix.
---

# Troubleshoot

Start with the failure you can see. For the four failures Console names under Verify, see [When the check fails](/signal/when-the-check-fails).

## Signing in and signup

**Signup shows a 404, or there is no Create account tab.** Self-serve signup is closed. [Create an account](/getting-in/create-an-account#when-signup-is-closed).

**No operator account linked to your user.** Registration did not finish. Use **Finish setting up your account** if it is there, or ask [support](/help/support). [No organisation linked](/getting-in/create-an-account#no-organisation-linked).

## Starting the container

**`Conflict. The container name "/optimum-gateway" is already in use`.** An earlier container still holds the name, running or stopped. Remove it and run the command again:

```bash
docker rm -f optimum-gateway
```

This is safe. The peer id and the enrollment credential live in `$HOME/optimum-gateway` on the host, not in the container. The same applies whenever you change an `-e` value: a restart keeps the old environment.

**The container exits on `write identity data: permission denied`.** SELinux is enforcing on the host. Turn on **Add an SELinux relabel to the identity mounts** and run the new command. [When the check fails](/signal/when-the-check-fails#the-container-exits-on-a-permission-error).

**The container exits on `unable to load config`.** `-config ""` is missing from the end of the command. Copy the whole command again.

## Enrollment

**Enrollment fails with `401`.** The key is unknown, expired, used up, or revoked. Optimum returns the same `401` for all four on purpose, so it reads like a typo. Check the key on **Enrollment keys**: the card shows the expiry date and **enrollments used**, and a revoked key is no longer listed. A key from Signal lasts one day. During signup, the same case shows **This key can no longer be used**. Mint a new key and run the command again. [Which key lifetime](/signal/what-signal-does#which-key-lifetime).

**A second host is refused with `409`.** Another gateway in your organisation already enrolled under that hostname. Give the host a unique hostname. [Onboard in bulk](/signal/onboard-in-bulk).

**A rebuilt host is refused with `409`.** The host lost `$HOME/optimum-gateway`, so it generated a new identity, and the old credential under its hostname is still live. Restore the directory if you have it. Otherwise revoke the old gateway key under **Manage gateways** → **Gateway** (self-serve accounts: ask [support](/help/support)), then start it again.

**Signup says Still waiting.** Nothing has enrolled with the key yet, and the page stopped checking. The key stays valid. Run the command, and Console picks the gateway up when it connects.

## Health and Verify

**`/health` says `degraded` right after start.** For a validator gateway, expected until your consensus client is peered: `cl_peers`, `cl_health`, and `subscribed_topics` fail until then. For a stream-only gateway, it clears once the first block arrives. Use **Verify** on Signal to confirm the gateway reached Optimum. [Connect your gateway](/signal/connect-your-gateway#check-it-is-healthy).

**A stream-only gateway stays `degraded` with `cl_peers` failing.** It was started with the beacon-node command from Signal. Replace it with the [stream-only command](/signal/connect-your-gateway#stream-only).

**`curl` to port `48123` is refused from another machine.** Telemetry is published on the gateway host's loopback only. Run it on that host.

**Verify passes, and you are not sure it is the new gateway.** Verify checks every gateway in your organisation together. It shows counts, such as **Yes, 3** enrolled, not names. If another gateway is already healthy, the rows can pass before the new one reports. Confirm the new host with `curl http://localhost:48123/health` on that host. [When the check fails](/signal/when-the-check-fails#verify).

**The peer id changed after a restart.** The identity directories were not mounted. [The peer id changed](/signal/when-the-check-fails#the-peer-id-changed).

## Validators and reports

**Indices rejected or skipped.** [Register keys](/signal/register-keys).

**A report is empty.** Each one waits for something different: a running gateway, confirmed indices, or proposed slots. [Your first report](/signal/your-first-report).

## Accelerate

**No Accelerate entry.** Accelerate is for entity accounts. An individual account has Signal only. An entity account without the entry: ask [support](/help/support). [Who can use it](/accelerate/what-accelerate-does#who-can-use-it).

**Validator keys active says Activating.** Your indices are on record and none is active on chain yet. Pending validators are not assigned proposals, so nothing is measured until they activate. [Readiness](/accelerate/readiness).

**Not enough proposals yet.** The recommendation needs 200 measured proposals across your validators. [Readiness](/accelerate/readiness).

## Past the Console command

Config keys, log lines, and metric names are in [Troubleshooting](https://getoptimum.github.io/optimum-gateway/versions/latest/troubleshoot) for gateway `v1.3.2`.
