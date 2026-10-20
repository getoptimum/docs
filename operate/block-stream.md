---
title: Block stream
description: The consumer feed, and where its reference lives.
---

# Block stream

A stream-only gateway serves blocks to your consumers. It is the path for an account that does not run validators. See [Choose a path](/start/choose-a-path).

On the gateway host the feed is `ws://127.0.0.1:9600` and gRPC `127.0.0.1:9601`. Mint a consumer token under **Keys** → **Stream consumers**.

Protocol, authentication, and client usage: [Consumer block stream](https://getoptimum.github.io/optimum-gateway/versions/latest/block-stream).

“Block stream” is the name of that gateway feature. It is not a separate Optimum product.
