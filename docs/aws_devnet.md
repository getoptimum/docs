# AWS Optimum Devnet - Transaction Test

This document outlines how to test a traction on AWS based on Hamster's devnet infrastructure

### Initial Steps

You will need to SSH into two nodes: Flexnode-1 and Flexnode-2 

```
ssh flexnode-1
```

and 

```
ssh flexnode-2
```

For more details on the SSH config file for these nodes, please consult this [config file](https://github.com/optimumda/optimum-dotfiles/blob/master/config).


### Flexnode-1

```
cd node1-config
./build/simd keys show optimum1 --address --home ./private/.simapp --keyring-backend test
```

Cosmos address from Flexnode-1

```
cosmos1v8l7ae0x9ca7wh6ksqd4y5wtdyhtwz5r05gyz5
```

Check balance:

```
./build/simd query bank balances cosmos1v8l7ae0x9ca7wh6ksqd4y5wtdyhtwz5r05gyz5 --home ./private/.simapp
```

Will return something like:

```
balances:
- amount: "992999900"
  denom: stake
pagination:
  total: "1"
```

Example of a transaction:

```
./build/simd tx bank send cosmos1v8l7ae0x9ca7wh6ksqd4y5wtdyhtwz5r05gyz5 cosmos1pqerqfr6r2ye5s9aqpdxhdha9ap7cclpsx5euc 100stake --home ./private/.simapp --keyring-backend test --chain-id optimum
```

This is the basic structure for making a transaction. Let's break it down:

- `./build/simd tx bank send`: This is the command to send tokens
- `cosmos1v8l7ae0x9ca7wh6ksqd4y5wtdyhtwz5r05gyz5`: This is the sender's address
- `cosmos1pqerqfr6r2ye5s9aqpdxhdha9ap7cclpsx5euc`: This is the recipient's address
- `100stake`: This is the amount and denomination of tokens to send
- `--home ./private/.simapp`: This specifies the home directory for the node
- `--keyring-backend test`: This specifies to use the test keyring backend
- `--chain-id optimum`: This specifies the chain ID

Response:

```
auth_info:
  fee:
    amount: []
    gas_limit: "200000"
    granter: ""
    payer: ""
  signer_infos: []
  tip: null
body:
  extension_options: []
  memo: ""
  messages:
  - '@type': /cosmos.bank.v1beta1.MsgSend
    amount:
    - amount: "100"
      denom: stake
    from_address: cosmos1v8l7ae0x9ca7wh6ksqd4y5wtdyhtwz5r05gyz5
    to_address: cosmos1pqerqfr6r2ye5s9aqpdxhdha9ap7cclpsx5euc
  non_critical_extension_options: []
  timeout_height: "0"
signatures: []
confirm transaction before signing and broadcasting [y/N]: Y

```

```
auth_info:
  fee:
    amount: []
    gas_limit: "200000"
    granter: ""
    payer: ""
  signer_infos: []
  tip: null
body:
  extension_options: []
  memo: ""
  messages:
  - '@type': /cosmos.bank.v1beta1.MsgSend
    amount:
    - amount: "100"
      denom: stake
    from_address: cosmos1v8l7ae0x9ca7wh6ksqd4y5wtdyhtwz5r05gyz5
    to_address: cosmos1pqerqfr6r2ye5s9aqpdxhdha9ap7cclpsx5euc
  non_critical_extension_options: []
  timeout_height: "0"
signatures: []
confirm transaction before signing and broadcasting [y/N]: Y
code: 0
codespace: ""
data: ""
events: []
gas_used: "0"
gas_wanted: "0"
height: "0"
info: ""
logs: []
raw_log: ""
timestamp: ""
tx: null
txhash: 2BE2B0F165C230FE4FA4E95AEE807BDC81A630DD905B890CEF00A53FFD9EF2B5
```

### Flexnode-2

```
cd node2-config
./build/simd keys show optimum2 --address --home ./private/.simapp --keyring-backend test
```

Cosmos address from Flexnode-2

```
cosmos1pqerqfr6r2ye5s9aqpdxhdha9ap7cclpsx5euc
```

Check balance:

```
./build/simd query bank balances cosmos1pqerqfr6r2ye5s9aqpdxhdha9ap7cclpsx5euc --home ./private/.simapp
```

Will return something like:

```
balances:
- amount: "200"
  denom: stake
pagination:
  total: "1"
```

Example of a transaction:

```
./build/simd tx bank send cosmos1pqerqfr6r2ye5s9aqpdxhdha9ap7cclpsx5euc cosmos1v8l7ae0x9ca7wh6ksqd4y5wtdyhtwz5r05gyz5 50stake --home ./private/.simapp --keyring-backend test --chain-id optimum
```

Response:

```
auth_info:
  fee:
    amount: []
    gas_limit: "200000"
    granter: ""
    payer: ""
  signer_infos: []
  tip: null
body:
  extension_options: []
  memo: ""
  messages:
  - '@type': /cosmos.bank.v1beta1.MsgSend
    amount:
    - amount: "50"
      denom: stake
    from_address: cosmos1pqerqfr6r2ye5s9aqpdxhdha9ap7cclpsx5euc
    to_address: cosmos1v8l7ae0x9ca7wh6ksqd4y5wtdyhtwz5r05gyz5
  non_critical_extension_options: []
  timeout_height: "0"
signatures: []
confirm transaction before signing and broadcasting [y/N]: y
```

```
auth_info:
  fee:
    amount: []
    gas_limit: "200000"
    granter: ""
    payer: ""
  signer_infos: []
  tip: null
body:
  extension_options: []
  memo: ""
  messages:
  - '@type': /cosmos.bank.v1beta1.MsgSend
    amount:
    - amount: "50"
      denom: stake
    from_address: cosmos1pqerqfr6r2ye5s9aqpdxhdha9ap7cclpsx5euc
    to_address: cosmos1v8l7ae0x9ca7wh6ksqd4y5wtdyhtwz5r05gyz5
  non_critical_extension_options: []
  timeout_height: "0"
signatures: []
confirm transaction before signing and broadcasting [y/N]: y
code: 0
codespace: ""
data: ""
events: []
gas_used: "0"
gas_wanted: "0"
height: "0"
info: ""
logs: []
raw_log: ""
timestamp: ""
tx: null
txhash: BA4BF8194D47E21013A50E1A4BD9AE44B6EA281F29F6E5789D6FEB1CEE89B22E
```

### Query Latest Block Height

```
./build/simd status | grep latest_block_height
```

Response

```
{"node_info":{"protocol_version":{"p2p":"8","block":"11","app":"0"},"id":"eeb02ac6d88f9ff156abebec998f202a6d642cc1","listen_addr":"tcp://0.0.0.0:26656","network":"optimum","version":"0.38.9","channels":"40202122233038606100","moniker":"optimum-chain","other":{"tx_index":"on","rpc_address":"tcp://0.0.0.0:26657"}},"sync_info":{"latest_block_hash":"0528D5FFD7B5C5001642DED3CA54E618069DA19810E242451F3919B6413AF31F","latest_app_hash":"285FD8B05DB6E807FCF7DDE230232641797E85EA1375B49DDF00D805689C9A5B","latest_block_height":"356550","latest_block_time":"2024-08-12T02:41:56.742222017Z","earliest_block_hash":"C3B94ECD1B8CADC29ED2ECD3AF2D24AD9C26C73A973EDC15DC4E50B600B168B6","earliest_app_hash":"E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855","earliest_block_height":"1","earliest_block_time":"2024-07-22T08:19:38.70554376Z","catching_up":false},"validator_info":{"address":"B83FF6D09074F0E6AE352B851575F9F08C17A033","pub_key":{"type":"tendermint/PubKeyEd25519","value":"PztM56kZlnpRuvafEqgvsNIINzpZIK6Pv5cqoSjmCnI="},"voting_power":"7"}}
```

```
latest_block_height":"356550"
```

