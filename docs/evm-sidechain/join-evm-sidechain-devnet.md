---
html: join-evm-sidechain-devnet.html
parent: evm-sidechains.html
blurb: Learn how to join the XRP Ledger EVM Sidechain Devnet.
labels:
  - Development, Interoperability
status: not_enabled
---
# Join the XRPL EVM Sidechain Devnet

{% partial file="/snippets/_evm-sidechain-disclaimer.md" /%}

This tutorial walks you through the steps to join the existing **XRP Ledger EVM Sidechain Devnet**. 

For ease of use, create an alias, `exprd`, to run all commands inside your Docker container.


## XRPL EVM Sidechain Node Hardware Requirements

- Linux/AMD64 operating system.
- 6 or more physical CPU cores.
- At least 600GB of NVME SSD disk storage.
- At least 32GB of RAM.
- At least 100Mbps network bandwidth.


## Pre-requisites

Before proceeding to initialize the node, ensure that the following pre-requisites are installed and running:

* [Docker 19+](https://docs.docker.com/engine/install/)
* Create an alias to run all commands in this tutorial inside a Docker container. You may want to add this to your `.bashrc` or `.zshrc`: 

    ```bash
    alias exrpd="docker run -it --rm -v ~/.exrpd:/root/.exrpd --entrypoint=\"\" peersyst/xrp-evm-blockchain:latest exrpd"
    ```


## Initialize Node

The first task is to initialize the node, which creates the necessary validator and node configuration files. 

1. Initialize the chain parameters using the following command:

    ```bash
    exrpd config chain-id exrp_1440002-1
    ```

2. Create or add a key to your node. Depending on your system, the default keyring may vary. For this tutorial, we use the `test` keyring:
Create a new key:
    ```bash
    exrpd keys add <key_name> --keyring-backend test
    ```

Import an existing private key:
		```bash
		exrpd keys unsafe-import-eth-key <key_name> <private_key>
		```
    Note the `key_name` you enter as you need to reference it in subsequent steps.

    **Note** For more information on a more secure setup for your validator, refer to [cosmos-sdk keys and keyrings](https://docs.cosmos.network/v0.46/run-node/keyring.html) and [validator security](evm-sidechain-validator-security.md).


3. Initialize the node using the following command:

    ```bash
    exrpd init <your_custom_moniker> --chain-id exrp_1440002-1
    ```

    Monikers can contain only ASCII characters. Using Unicode characters renders your node unreachable.

All these commands create your `~/.exrpd` (i.e. `$HOME`) directory with subfolders `config/` and `data/`. In the `config` directory, the most important files for configuration are `app.toml` and `config.toml`.

## Genesis & Seeds

1. Copy the Genesis File.

    Download the `genesis.json` file from here and copy it to the `config` directory: `~/.exrpd/config/genesis.json`. This is a genesis file with the chain-id and genesis accounts balances.

    ```bash
    wget https://raw.githubusercontent.com/Peersyst/xrp-evm-archive/main/poa-devnet/genesis.json -O ~/.exrpd/config/genesis.json
    ```

   {% admonition type="info" name="Attention" %}

   Before jumping to the next item, make sure that the contents of the file `~/.exrpd/config/genesis.json` match the contents of the file [genesis.json](https://raw.githubusercontent.com/Peersyst/xrp-evm-archive/main/poa-devnet/genesis.json).
   
   {% /admonition %}

    Verify the genesis configuration file:

    ```bash
    exrpd validate-genesis
    ```

2. Add Persistent Peer Nodes

    Set the [`persistent_peer`](https://docs.tendermint.com/master/tendermint-core/using-tendermint.html#persistent-peer)s field in `~/.exrpd/config/config.toml` to specify peers with which your node maintains persistent connections. You can retrieve them from the list of available peers on the archive repo ([https://raw.githubusercontent.com/Peersyst/xrp-evm-archive/main/poa-devnet/peers.txt](https://raw.githubusercontent.com/Peersyst/xrp-evm-archive/main/devnet/peers.txt)).

    To get a list of entries from the `peers.txt` file in the `PEERS` variable, run the following command:

    ```bash
    PEERS=`curl -sL https://raw.githubusercontent.com/Peersyst/xrp-evm-archive/main/poa-devnet/peers.txt | sort -R | head -n 10 | awk '{print $1}' | paste -s -d, -`
    ```

    Use `sed` to include them in the configuration. You can also add them manually:

    ```bash
    sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" ~/.exrpd/config/config.toml
    ```
 
   At this point you should have the list of the peers copied to the `persistent_peers` field in the `config.toml` file. You can verify this by running the following command:

   ```bash
   cat ~/.exrpd/config/config.toml | grep persistent_peers
   ```

## Start a Node

 You can start a node container with the following command:

 ```bash
 exrpd start
 ```

 If you would like to run it in Docker's daemon mode, you can use the following command:

  ```bash
 docker run -d --name=node --entrypoint="" --restart=always -v ~/.exrpd:/root/.exrpd peersyst/xrp-evm-blockchain:latest exrpd start
 ```
 If you would like to port forward relevant endpoints (Tendermint RPC, JSON-RPC, WSS) to the host, you can use some or all of the additional arguments in the following command:
 	```bash
	docker run -d --name=node --entrypoint="" -p 8545:8545 -p 8546:8546 -p 26657: 26657 --restart=always -v ~/.exrpd:/root/.exrpd peersyst/xrp-evm-blockchain:latest exrpd start 
	```

 With this docker command, you will be creating a container with the image `peersyst/xrp-evm-blockchain:latest` 
 that will run in background (`-d` flag) which will be named node (`--name=node`) that will be restarted in the case it stops (`--restart=always flag`) 
 and that will have the folder `~/.exrpd`  mounted in the directory `/root/.exrpd` inside the container.

 This command starts the node and begins syncing with the network. You can monitor the progress by watching the logs of the running container
 
  ```bash
 docker logs -f <container_id>
   ```

## Additional Configuration Considerations

	If you would like to monitor your node with external tools such as Prometheus or expose the node to service RPCs, the following changes should be made.

### Expose the Tendermint RPC Endpoint for monitoring
		
		Adjust the configuration to expose the Tendermint RPC Endpoint to the Internet

		```bash
		# Open the node's configuration
		vi ~/.exrpd/config/config.toml
		
		# On line 92, change the value of laddr to expose the endpoint to the internet
		laddr = "tcp://0.0.0.0:26657"

		# Save changes
		:wq
		```

		Once the configuration change is made, stop the node, remove the old container configuration and start again.
		```bash
		# Restart the node
		exrpd restart
		```
		Be sure to confirm that the docker container is correctly exposing port `26657` and that your host machine is exposing port `26657`.

### Expose the JSON-RPC Interface and WSS Interface Ports for RPC utilization
		
		Some users may want to use the nodes for RPC purposes. Adjust the configuration to expose the correct ports for JSON-RPC and WSS
		```bash
		# Open the node's configuration
		vi ~/.exrpd/config/app.toml

		# On line 278, change the value of address to expose the JSON-RPC Endpoint
		address = "0.0.0.0:8545"

		# On line 281, change the value of ws-address to expose the EVM Websocket Endpoint
		ws-address = "0.0.0.0:8546
		```
		
		Once the configuration change is made, stop the node, remove the old container configuration and start again.
		```bash
		# Restart the node
		exrpd restart
		```
		Be sure to confirm that the docker container is correctly exposing ports `8545`, `8546` and that your host machine is exposing port `8545`, `8546`.

## Join the Proof of Authority with your node

Similar to the XRPL mainnet, the Devnet runs in a Proof of Authority consensus mechanism. In order to start signing for new blocks and participate in the network consensus, 
the current validators need to accept your node as a new trusted validator. This democratic process requires the approval of the majority of the current validators.

To begin the process, join the [XRPL EVM Sidechain Discord](https://discord.gg/xrplevm) and select your validator role in the #roles channel. After that, you will need to introduce yourself in the *`#become-a-validator`* channel. Explain who you are and why you want to run a validator. Generally, you will be accepted if you have a real interest in the project, either because you want to use the network for a company, are a recognized member of the community who wants to contribute to its long-term governance, or just have an academic interest.

While doing your introduction, you will need to provide the details that identify your validator.

- **Moniker**: The public name of your validator
- **Validator operator address**: The address of the operator of the node that starts with _ethmvaloper_. Can be obtained by running:
```bash
exrpd keys show <key_name> --keyring <keying_backend> --bech val
```
- **Public key**: The public key of your node. Can be obtained by running:
```bash
exrpd tendermint show-validator
```

After that, a proposal to accept your validator will be voted on over a period of 7 days. During this time, some members may write to you publicly or privately to ask more questions. You can view the process on the [XRPL EVM Sidechain Explorer](https://validators.evm-sidechain.xrpl.org/xrp/proposals).
