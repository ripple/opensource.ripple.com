---
html: bootstrap-a-local-environment.html
parent: evm-cli.html
blurb: You can create a local environment to quickly develop on a local chain.
labels:
  - Development, Interoperability
status: not_enabled
---
# Bootstrap a Local Environment

<embed src="/snippets/_evm-sidechain-disclaimer.md" />

The `boostrap` command enables you to create a local development environment. This environment consists of:

- A blockchain configured with nodes and extra accounts.
- An XRP bridge with witnesses configured.
- An EVM explorer that enables you to monitor the network and transactions.


1. Create a JSON config file in this format:

    ```json
    {
        "blockchain": {
            "chainId": "1440002",
            "nodes": 3
        },
        "bridge": {
            "xrplRpc": "wss://sidechain-net1.devnet.rippletest.net",
            "xrplSeed": "***",
            "minCreateAmount": 50,
            "minRewardAmount": 1,
            "quorum": 1,
            "witnesses": [
                {
                    "type": "local",
                    "evmAddress": "0x96329A50d10a3F69311E4f4E108672926c51c474",
                    "evmPrivateKey": "***",
                    "xrpAddress": "rpSspP5yYyomcSrgsohyKMCnu5oJsTMkYP",
                    "xrpPrivateKey": "****"
                }
            ]
        },
        "explorer": {
            "disable": false
        }
    }
    ```

2. Specify where to export all the environment data.

    ```bash
    evmcli blockchain bootstrap -c bootstrap-config.json -e $PWD/data
    ```

3. Run the environment locally from inside the exported data folder.

    ```bash
    docker-compose up -d
    ```