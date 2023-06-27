---
html: evm-cli.html
parent: get-started-evm-sidechain.html
blurb: The XRPL EVM sidechain CLI enables network setup, bridge creation, transaction execution, and more.
labels:
  - Development, Interoperability
status: not_enabled
---
# EVM CLI

<embed src="/snippets/_evm-sidechain-disclaimer.md" />

The command line tool for the XRPL EVM sidechain enables developers and operators to set up networks, create bridges, execute transactions, and more.

## Prerequisites

- Docker
- Docker Compose
- Node (LTS)

Install the CLI with npm:

```bash
npm install -g @peersyst/xrpl-evm-sidechain-cli
```

## Bootstrap a Network

1. Create a network configuration JSON file. Modify the following example to fit your needs:
   
   ```JSON
   {
    "blockchain": { // Blockchain related configuration
        "chainId": "1440003", // ChainId of the sidechain
        "nodes": 2, // How many nodes will exist in the network
        "nodes": [ // Specific configuration of the nodes of the network
            {
                "name": "validator-0", // Node name
                "host": "validator-0", // Node host name (if you are going to host it externally) 
            }
        ],
		"extraAccounts": [ // Array of extra accounts that will have initial balance
            {
                "address": "0x68f727c3cd7aeB5a04acB864B770f5aa193676Bd",
                "balance": 10
            }
        ]
    },
    "bridge": { // Bridge configuration
        "xrplRpc": "wss://sidechain-net1.devnet.rippletest.net", // XRPL Mainchain RPC
        "xrplSeed": "******", // XRPL Mainchain seed with funds to create bridge account and witnesses
        "minCreateAmount": 50, // Bridge min create amount
        "minRewardAmount": 1, // Bridge min reward amount
        "quorum": 1, // Bridge quorum
        "witnesses": [{
            "type": "aws", // Signer type (only AWS supported for now)
            "evmAddress": "0x96329A50d10a3F69311E4f4E108672926c51c474", // Witness EVM address
            "xrpAddress": "rpSspP5yYyomcSrgsohyKMCnu5oJsTMkYP", // Witness XRP address
            "region": "eu-west-1", // AWS KMS Region
            "accessKey": "******", // AWS Access Key
            "secretAccessKey": "****", // AWS Secret access Key
            "keyId": "****" // AWS KMS Key Id
        }]

    },
    "explorer": { // Explorer related configuration 
        "disable": false // Disable the explorer
    }
   }
   ```

2. Run the creation command with the configuration JSON file.
   
   ```bash
   evmcli create --configPath ./config.json --export-path ./data
   ```

3. Run these commands to start the components:
   
   ```bash
   cd ./data
   docker-compose up -d
   ```

4. (Optional) If you enabled the local network explorer in the JSON config file, you can view it at [http://localhost](http://localhost).


## Create a Bridge

1. Create a bridge configuration JSON file. Modify the following example to fit your needs:
   
   ```JSON
   {
    "lockingChain": { // Locking chain related configuration
        "type": "xrp", // Type of the locking chain (can be either xrp or evm)
        "url": "wss://sidechain-net1.devnet.rippletest.net", // Node url of this chain
        "tokenCode": "JPY", // Token code. Use XRP for the native bridge
        "tokenIssuer": "r353SQJb8PLhHtgo9DZ1uFmxhFjrpM3uDE", // Token issuer for XRP or token address for EVM. Empty for native XRP
        "fundingPrivateKey": "****", // Private key with balance on this chain
        "witnesses": ["rpSspP5yYyomcSrgsohyKMCnu5oJsTMkYP"] // Witness array
    },
    "issuingChain": { // Issuing chain related configuration
        "type": "evm", // Type of the locking chain (can be either xrp or evm)
        "url": "https://rpc-evm-sidechain.peersyst.tech", // Node url of this chain
        "fundingPrivateKey": "****", // Private key with balance on this chain
        "witnesses": ["0x96329A50d10a3F69311E4f4E108672926c51c474"] // Witness array
    },
    "threshold": 1, // Bridge attestation threshold
    "minRewardAmount": 1, // Minimum reward amount of the bridge
    "minCreateAmount": 50 // Minimum create amount of the bridge
   }
   ```

2. Run the creation command with the configuration JSON file.
   
   ```bash
   evmcli create bridge --configPath ./config.json --export ./bridge-data.json
   ```

   > **Note:** The CLI exports a file with all the information on the bridge, which can be used with other bridge scripts.
