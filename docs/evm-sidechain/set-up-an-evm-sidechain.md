---
html: set-up-an-evm-sidechain.html
parent: evm-cli.html
blurb: Set up an EVM sidechain using the EVM CLI.
labels:
  - Development, Interoperability
status: not_enabled
---
# Set Up an EVM Sidechain

<embed src="/snippets/_evm-sidechain-disclaimer.md" />

You can set up an EVM sidechain using the `blockchain create` command.

## Create a Config File

Create a JSON config file in this format:

```json
{
    "chainId": "1440002",
    "nodes": 3,
    "extraAccounts": [],
    "safe": {
        "owners": [
            "0x96329A50d10a3F69311E4f4E108672926c51c474"
        ],
        "quorum": 1
    }
}
```


| Key | Value Type | Required | Description | Example |
|-----|------------|----------|-------------|---------|
| chainId | string | Yes | The chain ID of the EVM sidechain. | `1440001` |
| nodes | number <br /> array | Yes | The amount and configuration of nodes. | `3` <br /> `[{name: "node-0", host: "node-0.peersyst.tech"}]` |
| nodes[].name | string | Yes | The public name of the node. | `"node-0"` |
| nodes[].host | string | Yes | The node host IP or DNS. | `"node-0.peersyst.tech"` |
| extraAccounts | array | Yes | A set of accounts with reserve balances in the genesis. | `[{ address: "0x0000000000000000000000000000000000000000", balance: 500 }]` |
| extraAccounts[].address | string | Yes | Addresses of the reserve accounts. | `"0x0000000000000000000000000000000000000000"` |
| extraAccounts[].balance | number | Yes | The amount reserved. | `500` |
| genesisConfig | object | No | General genesis paramater configuration. | |
| genesisConfig.bondingTimeInSeconds | number | No | The number of seconds needed to unbound PoA power. | `172800` |
| genesisConfig.minDeposit | string | No | The minimum deposit for a governance proposal. | `"1000000000000000000axrp"` |
| safe | object | Yes | Configuration of the safe contract that holds all the issuing XRP. | |
| safe.owners | array | Yes | The safe owner addresses. | `["0x0000000000000000000000000000000000000000"]` |
| safe.quorum | number | Yes | The number of signatures required to run an operation in the safe. | `1` |


## Create the Blockchain

**Note:** By default, all node keys are created using the test keyring. If you want to deploy the network, you need to use the file keyring with a password to encrypt the node keys. Specify the `PASSWORD` env variable:

    ```bash
    export PASSWORD=mysupersecurepassword
    ```

Run the `blockchain create` command and specify where to export all the blockchain data.

```bash
evmcli blockchain create -c create-config.json -e $PWD/data
```


## Run the Network Locally

The `blockchain create` command creates a _docker-compose.yml_ file that you can use to run the network locally. Run this command inside your exported data folder:

```bash
docker-compose up -d
```
