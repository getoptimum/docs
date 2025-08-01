# mump2p — OptimumP2P CLI Client

**mump2p is the primary client entry point for interacting with OptimumP2P** — a high-performance RLNC-enhanced pubsub protocol. This command-line interface provides the easiest way to publish and subscribe to messages using the OptimumP2P protocol.

**Source:** [https://github.com/getoptimum/mump2p-cli](https://github.com/getoptimum/mump2p-cli)

## Installation

Download the appropriate binary for your system from the [GitHub releases page](https://github.com/getoptimum/mump2p-cli/releases):

- `mump2p-mac` for macOS
- `mump2p-linux` for Linux

Make the binary executable (Mac/Linux):

```sh
chmod +x mump2p-mac
# For convenience, you may want to rename and move to your PATH
mv mump2p-mac /usr/local/bin/mump2p
```

---

## Authentication

### Login

Before you can publish or subscribe to messages, you need to authenticate:

```sh
./mump2p login
```

This will start the device authorization flow:

1. A URL and a code will be displayed in your terminal
2. Open the URL in your browser
3. Enter the code when prompted
4. Complete the authentication process in the browser
5. The CLI will automatically receive and store your authentication token

### Check Authentication Status

To verify your current authentication status:

```sh
./mump2p whoami
```

This will display:

- Your client ID
- Token expiration time
- Token validity status
- Rate limits associated with your account

**Important: After logging in, please share the email ID you used to sign up in the group, so we can activate your access.**

### Refresh Token

If your token is about to expire, you can refresh it:

```sh
./mump2p refresh
```

### Logout

To remove your stored authentication token:

```sh
./mump2p logout
```

---

## Service URLs

The CLI connects to different proxy servers around the world. By default, it uses the first available proxy, but you can specify a different one using the `--service-url` flag.

For a complete list of available proxys and their locations, see: [Available Service URLs](https://github.com/getoptimum/mump2p-cli#available-service-urls) in the README.

**Example using a specific proxy:**
```sh
./mump2p publish --topic=test --message="Hello" --service-url="http://35.221.118.95:8080"
./mump2p subscribe --topic=test --service-url="http://34.142.205.26:8080"
```

---

## Publishing Messages

### Publish a Text Message

To publish a simple text message to a topic:

```sh
./mump2p publish --topic=your-topic-name --message="Your message content"
```

### Publish a File

To publish the contents of a file:

```sh
./mump2p publish --topic=your-topic-name --file=/path/to/your/file.json
```

Rate limits will be automatically applied based on your authentication token.

## Subscribing to Messages

### Basic Subscription

To subscribe to a topic in real-time:

```sh
./mump2p subscribe --topic=your-topic-name
```

This will open a WebSocket connection and display incoming messages in real-time. Press `Ctrl+C` to exit.

### Save Messages to a File

To persist messages to a local file while subscribing:

```sh
./mump2p subscribe --topic=your-topic-name --persist=/path/to/save/
```

If you provide just a directory path, messages will be saved to a file named `messages.log` in that directory.

### Forward Messages to a Webhook

To forward messages to an HTTP webhook:

```sh
./mump2p subscribe --topic=your-topic-name --webhook=https://your-server.com/webhook
```

**Note: The webhook endpoint must be configured to accept POST requests.**

#### Advanced Webhook Options

For more control over webhook behavior:

```sh
./mump2p subscribe --topic=your-topic-name \
  --webhook=https://your-server.com/webhook \
  --webhook-queue-size=200 \
  --webhook-timeout=5
  ```

Options:

- `--webhook-queue-size`: Maximum number of messages to queue before dropping (default: `100`)
- `--webhook-timeout`: Timeout in seconds for each webhook POST request (default: `3`)

### Combine Persistence and Webhook

You can both save messages locally and forward them to a webhook:

```sh
./mump2p subscribe --topic=your-topic-name \
  --persist=/path/to/messages.log \
  --webhook=https://your-server.com/webhook
```

---

## Checking Usage and Limits

To see your current usage statistics and rate limits:

```sh
./mump2p usage
```

This will display:

- Number of publish operations (per hour and per second)
- Data usage (bytes, KB, or MB depending on amount)
- Quota limits
- Time until usage counters reset
- Timestamps of your last publish and subscribe operations

## Tips for Effective Use

1. **Topic Names:** Choose descriptive and unique topic names to avoid message conflicts
2. **Message Size:** Be aware of your maximum message size limit when publishing files
3. **Token Refresh:** For long-running operations, refresh your token before it expires
4. **Persistent Subscriptions:** Use the --persist option when you need a record of messages
5. **Webhook Reliability:** Increase the queue size for high-volume topics to prevent message drops

## Troubleshooting

- **Authentication Errors:** Run mump2p whoami to check token status, and mump2p login to re-authenticate
- **Rate Limit Errors:** Use mump2p usage to check your current usage against limits
- **Connection Issues:** Verify your internet connection and firewall settings
- **Webhook Failures:** Check that your webhook endpoint is accessible and properly configured to accept POST requests

## See Also

- [gRPC Client Examples](./grpc-examples.md) - Direct gRPC integration examples for advanced use cases
- [Proxy + P2P Deployment](../deployment/p2p-with-proxy.md) - Full stack deployment with REST/WebSocket APIs
- [P2P-Only Deployment](../deployment/p2p-only.md) - Direct P2P integration
- [OptimumP2P Configuration](../configuration/optimump2p.md) - Protocol configuration parameters 