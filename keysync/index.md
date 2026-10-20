---
title: Sync validator keys
description: Reconcile the validators you run with the set Console has, on a schedule.
---

# Sync validator keys

Keysync compares the validators you list with the set Console has, then applies the difference. It comes after [Register keys](/signal/register-keys) in the operator setup. Invited operator accounts start it from **Activate validators**, under **Keep your validators in sync automatically**. The same step is on [Onboard in bulk](/signal/onboard-in-bulk).

A one-off change stays in Console. **Add**, **Remove**, and **Replace** on **Manage validators** cover that. Keysync is for a set that keeps moving. Run it from cron, a systemd timer, or a Kubernetes CronJob. The [repository](https://github.com/getoptimum/optimum-keysync) has those templates. The install name is `optimum-keysync`.

## What you need

Generate an operator API key under **Manage API keys**. That key is `KEYSYNC_API_KEY`, and it is the only secret. Revoking it in Console takes effect on the next run.

Point keysync at a file of the validators you run:

* A JSON file of index, chain, and key needs no beacon node.
* A list of indices, or a list of BLS keys, needs a beacon node that answers `/eth/v1/beacon/states/head/validators`.

`KEYSYNC_API_URL`, `KEYSYNC_AUTH_URL`, `KEYSYNC_NETWORK`, and `KEYSYNC_CHAIN_ID` default to Console, auth, and Ethereum mainnet. Set them only when Optimum gives you another environment. For Hoodi, set `KEYSYNC_NETWORK` and `KEYSYNC_CHAIN_ID` together.

## Run it

Install with `pip install optimum-keysync`.

`keysync diff` prints the planned adds and removes and writes nothing. `keysync sync` does the same until you pass `--apply`. A later run with the same input reports nothing to do.

A run refuses to remove more than 10 validators unless you raise `--max-deletes`. That stops a bad input file from clearing the set.

When the indices are on record, read [Your first report](/signal/your-first-report). If you have not enrolled a gateway yet, start at [What Optimum does](/start/what-optimum-does).
