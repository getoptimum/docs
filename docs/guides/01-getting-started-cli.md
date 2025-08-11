# Getting Started with mump2p CLI

The `mump2p` CLI is the quickest way to interact with [OptimumP2P](https://github.com/getoptimum/optimum-p2p) without running your own infrastructure.

In the next 5 minutes, you’ll have:

* A working CLI
* Your first published message
* A subscription feeding you live data



The `mump2p` CLI is your shortcut into `OptimumP2P` — a high-performance, RLNC-enhanced peer-to-peer network.

Instead of:

* Manually locating and connecting to active OptimumP2P nodes
* Handling low-level peer discovery and connection logic
* Managing complex network and encoding configurations

The `mump2p` CLI connects you directly to  our hosted `optimum-proxy` (available in multiple regions) and start sending or receiving messages instantly.
It connects to an `optimum-proxy` and lets you publish and subscribe to real-time topics — with authentication, usage tracking, and advanced delivery options.


## Why Optimum Proxy?

OptimumP2P is a **peer-to-peer network** where nodes exchange messages over a `RLNC-enhanced` pubsub mesh.  
If you connect directly to a P2P node, you need to:

* Know node IP/port.
* Handle peer discovery.
* Many more complex configuration operations.

The **Optimum Proxy** removes that complexity:

* Acts as your **single point of entry**.
* Maintains connections to multiple OptimumP2P nodes.
* Reassembles messages from shards using RLNC.
* Enforces thresholds and applies filters.
* Tracks usage and applies fair rate limits.

With `mump2p`, you connect only to the proxy — it does the rest.

## Why Authentication?

Authentication in `mump2p-cli` is not just about logging in, it enables:

* **Access Control**: Only authorized users can publish/subscribe to protected topics.
* **Rate Limits**: Prevents spam and ensures fair use.
* **Usage Tracking**: Monitor your publish/subscription stats.
* **Account Linking**: Associate activity with your user or team.
<!-- TODO:: will add more info here soon -->
Without authentication, you can only use **open/public topics** with strict limits.

## How It Fits into the Network
<!-- TODO:: use an image here -->
```plaintext
┌──────────────┐      ┌────────────────┐      ┌─────────────────────────────┐
│ mump2p CLI   │───▶  │ Optimum Proxy  │───▶  │     OptimumP2P Network      │
└──────────────┘      └────────────────┘      └─────────────┬───────────────┘
                                                           /   │   \
                                                          /    │    \
                                                 ┌────────▼─┐  │  ┌──────────┐
                                                 │ P1:Tokyo │──┼──│P2:Singapore│
                                                 └─────┬────┘  │  └──────┬─────┘
                                                       │       │         │
                                                 ┌─────▼────┐  │  ┌──────▼─────┐
                                                 │P3:Frankf │──┼──│P4:New York │
                                                 └──────────┘  │  └────────────┘
                                                               │
                                                         ┌─────▼─────┐
                                                         │P5:Sydney  │
                                                         └─────┬─────┘
                                                               │
                                                        ┌──────▼──────┐
                                                        │ Other Peers │
                                                        └─────────────┘
```

* CLI talks to the Proxy via gRPC/WebSocket.
* Proxy connects to the P2P Mesh (multiple nodes across regions).
* Mesh uses RLNC for efficient message delivery and reconstruction.
* Your client receives fully decoded messages in real-time.


## 1. Download the CLI

Always grab the latest release from GitHub:

### Linux

```sh
LATEST=$(curl -s https://api.github.com/repos/getoptimum/mump2p-cli/releases/latest | grep "tag_name" | cut -d '"' -f 4)
curl -L -o mump2p https://github.com/getoptimum/mump2p-cli/releases/download/$LATEST/mump2p-linux
chmod +x mump2p

```

### macOS

```bash
LATEST=$(curl -s https://api.github.com/repos/getoptimum/mump2p-cli/releases/latest | grep "tag_name" | cut -d '"' -f 4)
curl -L -o mump2p https://github.com/getoptimum/mump2p-cli/releases/download/$LATEST/mump2p-darwin
chmod +x mump2p
```

You can visit [mump2p-cli release page](https://github.com/getoptimum/mump2p-cli/releases) for the latest version.

---

### 2. Authenticate

*mump2p-cli currently usage [auth0](https://auth0.com/) to manage authentication/authorization*.

Login via device authorization flow:

```sh
./mump2p login
```

1. CLI shows a URL and a code.
2. Open the URL in your browser.
3. Enter the code to complete authentication.
4. CLI stores a JWT for future requests.

#### Check status

```sh
./mump2p whoami
```

You will see the response in terminal as following:

```sh
Authentication Status:
----------------------
Client ID: USER_CLIENT_ID
Expires: 11 Aug 25 19:12 CEST
Valid for: 24h0m0s
Is Active:  true

Rate Limits:
------------
Publish Rate:  2000 per hour
Publish Rate:  12 per second
Max Message Size:  10.00 MB
Daily Quota:       10240.00 MB
```

<!-- TODO:: correct contact way -->
**Important: By default `Is Active` is `false`. Contact us to activate your account.**


#### Other auth commands

```sh
./mump2p refresh   # Refresh token
./mump2p logout    # Logout
```

### 3. Choose a Proxy Location

**Available Service URLs:**
<!-- TODO:: map to dns -->

| Location            | URL                 |
| ------------------- | ------------------- |
| **Tokyo (Default)** | 34.146.222.111:8080 |
| **Tokyo**           | 35.221.118.95:8080  |
| **Singapore**       | 34.142.205.26:8080  |


Use a custom location

```sh
--service-url="http://34.142.205.26:8080"
```

---

### 4. Subscribe to a Topic

#### Basic subscription

```sh
./mump2p subscribe --topic=demo
```

#### Save messages locally

```sh
./mump2p subscribe --topic=demo --persist=/path/to/
```

#### Forward to webhook

```sh
./mump2p subscribe --topic=demo --webhook=https://your-server.com/webhook
```

---

### 5. Publish a Message

#### Text

```sh
./mump2p publish --topic=demo --message="Hello from CLI!"
```

#### File

```sh
./mump2p publish --topic=demo --file=/path/to/file.json
```

#### With threshold

```sh
./mump2p publish --topic=demo --message="High reliability" --threshold=0.9
```

---

### 6. Check Usage & Limits

```sh
./mump2p usage
```

output:

```sh
  Publish (hour):     0 / 2000
  Publish (second):   0 / 12
  Data Used:          0.0000 MB / 10240.0000 MB
  Next Reset:         11 Aug 25 21:10 CEST (24h0m0s from now)
  Last Publish:       02 Jul 25 21:54 +0300
  ```

Shows:

* Publish count (per hour/day)
* Quota usage
* Time until reset
* Token expiry

---

### 7. Common Issues

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

### 8. Important Tips

* Use descriptive topic names per team.
* Keep `whoami` and `usage` handy.
* For high-volume topics, increase webhook queue size.
* Start with hosted proxy, then try local deployment for full control.

---

#### Important Links

* [mump2p CLI Source Code](https://github.com/getoptimum/mump2p-cli)
* [Developer Guide](https://github.com/getoptimum/mump2p-cli/blob/main/docs/guide.md)
* [Release Page](https://github.com/getoptimum/mump2p-cli/releases)
* [Available Service URLs](https://github.com/getoptimum/mump2p-cli?tab=readme-ov-file#3-service-url--connectivity-issues)
