---
html: join-evm-sidechain-devnet.html
parent: evm-sidechains.html
blurb: Learn how to join the XRP Ledger EVM Sidechain Devnet.
labels:
  - Development, Interoperability
status: not_enabled
---
# Join the XRPL EVM Sidechain Devnet

<embed src="/snippets/_evm-sidechain-disclaimer.md" />

This tutorial walks you through the steps to join the existing **XRP Ledger EVM Sidechain Devnet**. 

For ease of use, create an alias, `exprd`, to run all commands inside your Docker container.


## XRPL EVM Sidechain Node Hardware Requirements

- Linux/AMD64 operating system.
- 4 or more physical CPU cores.
- At least 500GB of NVME SSD disk storage.
- At least 32GB of RAM.
- At least 100Mbps network bandwidth.


## Pre-requisites

Before proceeding to initialize the node, ensure that the following pre-requisites are installed and running:

* Docker 19+
* Create an alias to run all commands in this tutorial inside a Docker container: 

    ```bash
    alias exrpd="docker run -it --rm -v ~/.exrpd:/root/.exrpd --entrypoint=\"\" peersyst/xrp-evm-blockchain:latest exrpd"
    ```

## Initialize Node

The first task is to initialize the node, which creates the necessary validator and node configuration files. 

1. Initialize the chain parameters using the following command:

    ```bash
    exrpd config chain-id exrp_1440002-1
    ```

2. Create or add a key to your node. For this tutorial, we use the `test` keyring:

    ```bash
    exrpd keys add <key_name> --keyring-backend test
    ```

    Note the `key_name` you enter as you need to reference it in subsequent steps.

    **Note** For more information on a more secure setup for your validator, refer to [cosmos-sdk keys and keyrings](https://docs.cosmos.network/v0.46/run-node/keyring.html) and [validator security](evm-sidechain-validator-security.md).


3. Initialize the node using the following command:

    ```bash
    exrpd init <your_custom_moniker> --chain-id exrp_1440002-1
    ```

    Monikers can contain only ASCII characters. Using Unicode characters renders your node unreachable.

All these commands create your `~/.exrpd` (i.e `$HOME`) directory with subfolders `config/` and `data/`. In the `config` directory, the most important files for configuration are `app.toml` and `config.toml`.

## Genesis & Seeds

1. Copy the Genesis File.

    Download the `genesis.json` file from here and copy it to the `config` directory: `~/.exrpd/config/genesis.json`. This is a genesis file with the chain-id and genesis accounts balances.

    ```bash
    wget https://raw.githubusercontent.com/Peersyst/xrp-evm-archive/main/poa-devnet/genesis.json -O ~/.exrpd/config/genesis.json
    ```

   :::attention Attention

   Before jumping to the next item, make sure that the contents of the file `~/.exrpd/config/genesis.json` match the contents of the file [genesis.json](https://raw.githubusercontent.com/Peersyst/xrp-evm-archive/main/poa-devnet/genesis.json).

   :::

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

 If you would like to run it in Docker's deamon mode, you can use the following command:

  ```bash
 docker run -d --name=node --entrypoint="" --restart=always -v ~/.exrpd:/root/.exrpd peersyst/xrp-evm-blockchain:latest exrpd start
 ``` 

 With this docker command, you will be creating a container with the image `peersyst/xrp-evm-blockchain:latest` 
 that will run in background (`-d` flag) which will be named node (`--name=node`) that will be restarted in the case it stops (`--restart=always flag`) 
 and that will have the folder `~/.exrpd`  mounted in the directory `/root/.exrpd` inside the container.

 This command starts the node and begins syncing with the network. You can monitor the progress by watching the logs of the running container
 
  ```bash
 docker logs -f <container_id>
   ```

## Join the Proof of Authority with your node

Similar to the XRPL mainnet, the Devnet runs in a Proof of Authority consensus mechanism. In order to start signing for new blocks and participate in the network consensus, 
the current validators need to accept your node as a new trusted validator. This democratic process requires the approval of the majority of the current validators.

To begin the process, join the [XRPL EVM Sidechain Discord](https://discord.gg/xrplevm) and introduce yourself in the *`#intros`* channel. Explain who you are and why you want to run a validator. Generally, you will be accepted if you have a real interest in the project, either because you want to use the network for a company, are a recognized member of the community who wants to contribute to its long-term governance, or just have an academic interest.

A proposal to accept your validator will be voted on over a period of 2 days. During this time, some members may write to you publicly or privately to ask more questions. You can view the process on the [XRPL EVM Sidechain Explorer](https://validators.evm-sidechain.xrpl.org/xrp/proposals).


### Bond the authority points to your validator

**Warning:** Before proceeding with this step, ensure that:
 - The current validators have accepted your node as a new trusted validator. 
 - You're running the node container and your node is fully synced with the network.

Create a Devnet validator node with this command:

```bash
exrpd tx staking create-validator \
  --amount=1000000apoa \
  --pubkey=$(exrpd tendermint show-validator) \
  --moniker=<public_name_of_your_node> \
  --chain-id="exrp_1440002-1" \
  --commission-rate="0.00" \
  --commission-max-rate="0.00" \
  --commission-max-change-rate="0.00" \
  --min-self-delegation="1000000" \
  --gas="300000" \
  --gas-prices="7axrp" \
  --keyring-backend=<your_keyring> \
  --from=<your_key>
```