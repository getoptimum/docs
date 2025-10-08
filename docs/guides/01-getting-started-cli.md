# Getting Started with mump2p CLI

The `mump2p` CLI is the quickest way to interact with [Optimum Network](https://github.com/getoptimum/optimum-p2p) without running your own infrastructure.

In the next 5 minutes, you'll have:

* A working CLI
* Your first published message
* A subscription feeding you live data

The `mump2p` CLI is your shortcut into `Optimum Network` — a high-performance, RLNC-enhanced peer-to-peer network.

Instead of:

* Manually locating and connecting to active Optimum Network nodes
* Handling low-level peer discovery and connection logic
* Managing complex network and encoding configurations

The `mump2p` CLI connects you directly to our hosted `optimum-proxy` (available in multiple regions) and start sending or receiving messages instantly.
It connects to an `optimum-proxy` and lets you publish and subscribe to real-time topics — with authentication, usage tracking, and advanced delivery options.

## Why Optimum Proxy?

Optimum Network is a **peer-to-peer network** where nodes exchange messages over a `RLNC-enhanced` pubsub mesh.  
If you connect directly to a P2P node, you need to:

* Know node IP/port.
* Handle peer discovery.
* Many more complex configuration operations.

The **Optimum Proxies** removes that complexity:

* Acts as **points of entry**.
* Maintains connections to multiple Optimum Network nodes.
* Enforces thresholds and applies filters.
* Tracks usage and applies fair rate limits.

With `mump2p`, you connect only to the proxy — it does the rest.

## Why Authentication?

Authentication in `mump2p-cli` is not just about logging in, it enables:

* **Access Control**: Only authorized users can publish/subscribe to protected topics.
* **Rate Limits**: Prevents spam and ensures fair use.
* **Usage Tracking**: Monitor your publish/subscription stats.
* **Account Linking**: Associate activity with your user or team.

## How It Fits into the Network

![mump2p CLI Architecture](../../static/img/mump2p.png)

* CLI talks to the Proxy via HTTP/WebSocket or gRPC.
* Proxy connects to the P2P Mesh (multiple nodes across regions).
* Mesh uses RLNC for efficient message delivery and reconstruction.
* Your client receives fully decoded messages in real-time.

## 1. Install mump2p CLI

### Quick Install (One Command)

```bash
curl -sSL https://raw.githubusercontent.com/getoptimum/mump2p-cli/main/install.sh | bash
```

This automatically:

* Detects your OS (Linux/macOS)
* Downloads the latest release
* Sets correct permissions  
* Verifies installation works

### Manual Install

If you prefer manual installation:

| OS | Command |
|---|---|
| **Linux** | `curl -L -o mump2p https://github.com/getoptimum/mump2p-cli/releases/latest/download/mump2p-linux && chmod +x mump2p` |
| **macOS** | `curl -L -o mump2p https://github.com/getoptimum/mump2p-cli/releases/latest/download/mump2p-mac && chmod +x mump2p` |

### Verify Installation

```bash
./mump2p version
```

> Always use the latest version from [mump2p-cli releases](https://github.com/getoptimum/mump2p-cli/releases)

### 2. Authenticate

Login via device authorization flow:

```sh
./mump2p login
```

**Output:**

```bash
Initiating authentication...

To complete authentication:
1. Visit: https://your-auth-domain.auth0.com/activate?user_code=XXXX-XXXX
2. Or go to https://your-auth-domain.auth0.com/activate and enter code: XXXX-XXXX
3. This code expires in 15 minutes

Waiting for you to complete authentication in the browser...

✅ Successfully authenticated
Token expires at: 18 Aug 25 13:15 IST
```

1. CLI shows a URL and a code.
2. Open the URL in your browser.
3. Enter the code to complete authentication.
4. CLI stores a JWT for future requests.

#### Check status

```sh
./mump2p whoami
```

**Output:**

```bash
Authentication Status:
----------------------
Client ID: google-oauth2|100677750055416883405
Expires: 18 Aug 25 13:15 IST
Valid for: 24h0m0s
Is Active:  true

Rate Limits:
------------
Publish Rate:  1000 per hour
Publish Rate:  8 per second
Max Message Size:  4.00 MB
Daily Quota:       5120.00 MB
```

**Important: By default `Is Active` is `false`. Contact us to activate your account.**

#### Other auth commands

```sh
./mump2p refresh   # Refresh token
./mump2p logout    # Logout
```

#### Development Mode (No Authentication)

For testing without authentication:

```sh
./mump2p --disable-auth --client-id="test-client" publish --topic=demo --message="Hello" --service-url="http://34.146.222.111:8080"
./mump2p --disable-auth --client-id="test-client" subscribe --topic=demo --service-url="http://34.146.222.111:8080"
```

> **Complete Guide:** [Development mode documentation](https://github.com/getoptimum/mump2p-cli/blob/main/docs/guide.md#developmenttesting-mode) - covers all flags, usage, and examples

#### Custom Authentication Path

For production deployments or custom storage locations:

```sh
./mump2p --auth-path /opt/mump2p/auth/token.yml login
# Or use environment variable
export MUMP2P_AUTH_PATH="/opt/mump2p/auth/token.yml"
```

> **Complete Guide:** [Custom auth path documentation](https://github.com/getoptimum/mump2p-cli/blob/main/docs/guide.md#custom-authentication-file-location) - use cases, security, deployment

**Refresh Output:**

```bash
Current token status:
Expires at: 18 Aug 25 13:15 IST
Valid for:  23h56m0s
Refreshing token...
✅ Token refreshed successfully
New expiration: 18 Aug 25 13:19 IST
Valid for:      24h0m0s
```

**Logout Output:**

```bash
✅ Successfully logged out
```

### 3. Choose a Proxy Location

**Available Service URLs:**

| Location            | URL                 |
| ------------------- | ------------------- |
| **Tokyo (Default)** | 34.146.222.111:8080 |
| **Tokyo**           | 35.221.118.95:8080  |
| **Singapore**       | 34.142.205.26:8080  |

Use a custom location

```sh
--service-url="http://34.142.205.26:8080"
```


### 4. Subscribe to a Topic

#### Basic subscription

```sh
./mump2p subscribe --topic=demo
```

**Output:**

```bash
claims is &{google-oauth2|100677750055416883405 2025-08-17 13:15:07 +0530 IST 2025-08-18 13:15:07 +0530 IST true 4194304 1000 8 5368709120 google-oauth2|100677750055416883405 1755416706719}
claims is google-oauth2|100677750055416883405
Sending HTTP POST subscription request...
HTTP POST subscription successful: {"status":"subscribed","topic":"demo"}
Opening WebSocket connection...
Listening for messages on topic 'demo'... Press Ctrl+C to exit
```

#### Save messages locally

```sh
./mump2p subscribe --topic=demo --persist=/path/to/
```

**Output:**

```bash
Persisting data to: /path/to/messages.log
claims is &{google-oauth2|100677750055416883405 2025-08-17 13:15:07 +0530 IST 2025-08-18 13:15:07 +0530 IST true 4194304 1000 8 5368709120 google-oauth2|100677750055416883405 1755416706719}
claims is google-oauth2|100677750055416883405
Sending HTTP POST subscription request...
HTTP POST subscription successful: {"status":"subscribed","topic":"demo"}
Opening WebSocket connection...
Listening for messages on topic 'demo'... Press Ctrl+C to exit
```

**Persisted message format:**

```bash
[2025-08-17T13:19:08+05:30] Testing persistence!
```

#### Forward to webhook

Basic webhook forwarding:

```sh
./mump2p subscribe --topic=demo --webhook=https://your-server.com/webhook
```

**Webhook with custom schema templates:**

```sh
# Discord
./mump2p subscribe --topic=alerts --webhook="https://discord.com/api/webhooks/..." --webhook-schema='{"content":"{{.Message}}"}'

# Slack
./mump2p subscribe --topic=notifications --webhook="https://hooks.slack.com/services/..." --webhook-schema='{"text":"{{.Message}}"}'

# Custom JSON with metadata
./mump2p subscribe --topic=logs --webhook="https://your-server.com/webhook" --webhook-schema='{"message":"{{.Message}}","timestamp":"{{.Timestamp}}","topic":"{{.Topic}}"}'
```

> **Complete Guide:** [Webhook formatting documentation](https://github.com/getoptimum/mump2p-cli/blob/main/docs/guide.md#webhook-formatting) - Discord, Slack, Telegram templates, variables, queue options

#### gRPC Subscription

For high-performance streaming, use gRPC mode:

```sh
./mump2p subscribe --topic=demo --grpc
```

**Output:**

```bash
claims is &{google-oauth2|100677750055416883405 2025-08-21 16:01:29 +0530 IST 2025-08-22 16:01:29 +0530 IST true 4194304 1000 8 5368709120 google-oauth2|100677750055416883405 1755772288994}
claims is google-oauth2|100677750055416883405
Sending HTTP POST subscription request...
HTTP POST subscription successful: {"client":"google-oauth2|100677750055416883405","status":"subscribed"}
Listening for messages on topic 'demo' via gRPC... Press Ctrl+C to exit
```


### 5. Publish a Message

#### Text

```sh
./mump2p publish --topic=demo --message="Hello from CLI!"
```

**Output:**

```bash
✅ Published inline message
{"status":"published","topic":"demo"}
```

#### File

```sh
./mump2p publish --topic=demo --file=/path/to/file.json
```

**Output:**

```bash
✅ Published sample-data.json
{"status":"published","topic":"demo"}
```

#### gRPC Publishing

For high-performance publishing, use gRPC mode:

```sh
./mump2p publish --topic=demo --message="Hello via gRPC!" --grpc
```

**Output:**

```bash
✅ Published via gRPC inline message
```

#### With threshold

```sh
./mump2p publish --topic=demo --message="High reliability" --threshold=0.9
```


### 6. Check Usage & Limits

```sh
./mump2p usage
```

**Output:**

```bash
  Publish (hour):     0 / 1000
  Publish (second):   0 / 8
  Data Used:          0.0000 MB / 5120.0000 MB
  Next Reset:         18 Aug 25 13:15 IST (24h0m0s from now)
  Last Publish:       07 Aug 25 06:33 -0700
```

Shows:

* Publish count (per hour/day)
* Quota usage
* Time until reset
* Token expiry


### 7. List Active Topics

Check which topics you're currently subscribed to:

```sh
./mump2p list-topics
```

> **Complete Guide:** [List topics documentation](https://github.com/getoptimum/mump2p-cli/blob/main/docs/guide.md#list-your-active-topics) - multi-proxy support, output format


### 8. Check Proxy Health

Monitor the health and system metrics of the proxy server:

```sh
./mump2p health
```

**Output:**

```bash
Proxy Health Status:
-------------------
Status:      ok
Memory Used: 7.06%
CPU Used:    0.30%
Disk Used:   44.91%
```

#### Check specific proxy

```sh
./mump2p health --service-url="http://35.221.118.95:8080"
```


### 9. Debug Mode

The `--debug` flag provides detailed timing and proxy information for troubleshooting and performance analysis.

**What it shows:**

* Message timestamps (send/receive times in nanoseconds)
* Proxy IP addresses (source and destination)
* Message metadata (size, hash, protocol)
* Sequential message numbering

**Basic usage:**

```sh
# Debug publish operations
./mump2p --debug publish --topic=test-topic --message='Hello World'

# Debug subscribe operations
./mump2p --debug subscribe --topic=test-topic

# Debug with gRPC
./mump2p --debug publish --topic=test-topic --message='Hello World' --grpc
./mump2p --debug subscribe --topic=test-topic --grpc
```

**Example output:**

Publish:

```text
Publish: sender_info:34.146.222.111, [send_time, size]:[1757606701424811000, 2010] topic:test-topic msg_hash:4bbac12f protocol:HTTP
```

Subscribe:

```text
Recv: [1] receiver_addr:34.146.222.111 [recv_time, size]:[1757606701424811000, 2082] sender_addr:34.146.222.111 [send_time, size]:[1757606700160514000, 2009] topic:test-topic hash:8da69366 protocol:WebSocket
```

**Understanding the output:**

* `[1]` - Message sequence number
* `[send_time, size]` - Unix timestamp (nanoseconds) and message size
* `msg_hash/hash` - First 8 characters of SHA256 hash for tracking
* Calculate latency: `recv_time - send_time`

> **Complete Guide:** [Debug mode documentation](https://github.com/getoptimum/mump2p-cli/blob/main/docs/guide.md#debug-mode) - blast testing, load testing, performance analysis


### 10. Common Issues

#### Unauthorized

```sh
Error: your account is inactive
```

→ Contact admin to activate account.

#### Rate limit exceeded

```sh
Error: per-hour limit reached
```

→ Wait until reset or request higher tier.

#### Connection refused

```sh
Error: HTTP publish failed: dial tcp ...
```

→ Proxy not reachable. Check --service-url.

#### Topic not assigned

```sh
Error: publish error: topic not assigned
```

→ Topic needs to be subscribed to first or doesn't exist.

#### Missing message or file

```sh
Error: either --message or --file must be provided
```

→ Provide either --message or --file parameter.

#### Conflicting parameters

```sh
Error: only one of --message or --file should be used at a time
```

→ Use only one of --message or --file, not both.

#### Authentication required

```sh
Error: authentication required: token has expired, please login again
```

→ Run `./mump2p login` to authenticate.


### 11. Important Tips

* Use descriptive topic names per team.
* Keep `whoami` and `usage` handy.
* For high-volume topics, increase webhook queue size.
* Start with hosted proxy, then try local deployment for full control.
* Subscribe to a topic before publishing to it.
* Use the `--service-url` flag to connect to different gateways for better performance.
* Use `--grpc` flag for high-performance streaming and publishing.
* Monitor proxy health with `./mump2p health` for troubleshooting.
* Use `--debug` flag for performance monitoring and troubleshooting.
* Check active topics with `./mump2p list-topics` to manage subscriptions.

## Complete Documentation

* **[Complete User Guide](https://github.com/getoptimum/mump2p-cli/blob/main/docs/guide.md)** - Advanced features, authentication, webhooks, debug mode
* **[CLI Repository](https://github.com/getoptimum/mump2p-cli)** - Source code and documentation
* **[FAQ & Troubleshooting](https://github.com/getoptimum/mump2p-cli#faq---common-issues--troubleshooting)** - Common issues and solutions
* **[Latest Releases](https://github.com/getoptimum/mump2p-cli/releases)** - Download latest version
