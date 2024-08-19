# AWS Devnet Node Deployment Steps

1.Install Dependencies

Install the following dependencies on Flexnode 1 and Flexnode 2 respectively
* Go (version 1.19+)
* Make
* Git

2. Clone the Cosmos SDK source code

```shell
git clone https://github.com/cosmos/cosmos-sdk
cd cosmos-sdk
git checkout v0.58.0
```

3. Compile and install

```shell
make build

#Flexnode 1
mkdir -p ~/node1-config
mv ./build   ~/node1-config
cd ~/node1-config
#Flexnode 2
mkdir -p ~/node2-config
mv ./build   ~/node2-config
cd ~/node2-config
```
4. Initialize Node
* Flexnode 1 initialization
```shell
./build/simd init node1  --home ./private/.simapp  --chain-id optimum
```
*  Flexnode 2 initialization
```shell
./build/simd init node2 --home ./private/.simapp  --chain-id optimum
```
5. Create keys and generate Genesis account
* Flexnode 1
```shell
./build/simd keys add optimum1 --home ./private/.simapp  --keyring-backend test
```
* Flexnode 2
```shell
./build/simd keys add optimum2 --home ./private/.simapp  --keyring-backend test
```
6. Add Genesis account for Flexnode 1 and allocate initial funds

```shell
./build/simd genesis add-genesis-account optimum1 1000000000stake --home ./private/.simapp  --keyring-backend test
```
7. Generate and configure the Genesis file

* Flexnode 1
```shell
./build/simd genesis gentx optimum1 7000000stake --home ./private/.simapp  --keyring-backend test  --chain-id optimum
./build/simd genesis collect-gentxs --home ./private/.simapp
```
* Flexnode 2

    Copy the genesis.json file of Flexnode 1 and configure it to Flexnode 2
```shell
#genesis.json file location：
./private/.simapp/config
```

8. Configure config.toml
* Get Node ID
  
  Run the following command on each of the two nodes to obtain the node ID:
```shell
./build/simd tendermint show-node-id --home private/.simapp/
```

* Flexnode 1 configuration

    In ~/node1-config/private/.simapp/config/config.toml, set the following:

```shell
[p2p].persistent_peers = "node2_id@node2_ip:26656"
```

* Flexnode 2 configuration

  In ~/node2-config/private/.simapp/config/config.toml, set the following:

```shell
[p2p].persistent_peers = "node1_id@node1_ip:26656"
```

* Modify the monitoring configuration

  Modify config.toml of Flexnode 1 and Flexnode 2

```shell
  //Change false in the file to true
  prometheus = true
```
9. Start the node

Execute the following commands on both nodes respectively：

```shell
mkdir ~/start-node/logs
cd ~/start-node
mkdir logs
vim start.sh
```
  start.sh file contents：
```shell
#!/bin/bash

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

SIMD_PATH="$HOME/cosmos-sdk/build/simd"
HOME_DIR="$HOME/cosmos-sdk/private/.simapp"
LOG_FILE="$PWD/logs/node_$TIMESTAMP.log"

nohup $SIMD_PATH start --home $HOME_DIR > $LOG_FILE 2>&1 &

echo "Node is starting... Logs are being written to $LOG_FILE"
```
After saving the file, execute the following:
```shell
chmod +x start.sh
```
start node

```shell
./start.sh
```

## Prometheus&Grafana

1. Deploy node-exporter on Flexnode 1 and Flexnode 2

Execute the following command on the node server

```shell
cd node_exporter/
docker compose up -d
```

2. Deploy prometheus&Grafana

Operation on the prometheus server

```shell
cd prometheus_grafana

#start prometheus&Grafana
docker compose up -d

#stop prometheus&Grafana
docker compose down
```
Modify prometheus configuration:
You can modify the data source configuration

```shell
vim prometheus.yml

#restart prometheus
docker compose restart prometheus
```
Modify alarm configuration and alarm rules:

```shell
vim  alertmanager.yml

vim rule_files/alerts.yml 

#restart alertmanager
docker compose restart alertmanager
```

Monitoring address:

http://44.223.178.112:3000/login

username/password: *redacted*

