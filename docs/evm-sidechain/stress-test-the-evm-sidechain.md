---
html: stress-test-the-evm-sidechain.html
parent: evm-cli.html
blurb: Stress test the EVM sidechain using the EVM CLI.
labels:
  - Development, Interoperability
status: not_enabled
---
# Stress Test the EVM CLI

{% partial file="/snippets/_evm-sidechain-disclaimer.md" /%}

You can stress test the blockchain using the `blockchain stress` command.

## Generate Wallets

Before you can stress test on the network, you need to create a set of wallets that hold XRP. These accounts are used by the stress script to create transactions in parallel and stress the blockchain.


### Set Up Redis

Redis is used by _[Bull](https://github.com/OptimalBits/bull)_ to manage queues that enable parallel and ordered processing of transactions.

Run this command:

```bash
docker run --name stress-redis -p 6379:6379 -d redis redis-server --maxmemory 4G
```

**Note:** Modify the `--maxmemory` parameter for stress tests with large amounts of transactions.


### Create a Config File

Create a JSON config file in this format:

```json
{
    "evmRpc": "http://78.46.163.92:8545",
    "redisUrl": "redis://127.0.0.1:6379",
    "fundingPrivateKey": "0x804f3e3379c09c9bbeb69eff87252ae86cbbbe2bd4afcdba4150b18b77a7759f",
    "accounts": 100,
    "amountPerAccount": 10
}
```


| Key | Value Type | Required | Description | Example |
|-----|------------|----------|-------------|---------|
| evmRpc | string | Yes | The JSON RPC of the EVM sidechain. | `"http://78.46.163.92:8545"` |
| redisUrl | string | Yes | The redis connection URL. | `"redis://127.0.0.1:6379"` |
| fundingPrivateKey | string | Yes | A private key in the EVM sidechain that has enough balance to fund all the accounts. | `"0000000000000000000000000000000000000000000000000000000000000000"` |
| accounts | number | Yes | The number of accounts to generate. | `100` |
| amountPerAccount | number | Yes | The remaining amount of each account at the end of the test. | `10` |


### Generate Stress Test Wallets

Run this command:

```bash
evmcli blockchain stress generate-wallets -c config.json -e $PWD/stress-config.json
```

A _stress-config.json_ file will be created that contains all the private keys of the generated wallets.


## Stress Run

### Create a Config File

Create a JSON config file in this format:

```json
{
    "evmRpc": "http://78.46.163.92:8545",
    "redisUrl": "redis://127.0.0.1:6379",
    "privateKeys": [
        "0x7acf3e3379c09c9bbeb69eff87252ae86cbbbe2bd4afcdba4150b18b77a7759f"
    ],
    "accounts": 1,
    "txsPerAccount": 100,
    "concurrency": 8
}
```


| Key | Value Type | Required | Description | Example |
|-----|------------|----------|-------------|---------|
| evmRpc | string | Yes | The JSON RPC of the EVM sidechain. | `"http://78.46.163.92:8545"` |
| redisUrl | string | Yes | the redis connection URL. | `"redis://127.0.0.1:6379"` |
| privateKeys | array | Yes | A set of private keys used to broadcast transactions. | `["0000000000000000000000000000000000000000000000000000000000000000"` |
| accounts | number | Yes | The number of accounts to use in the stress run. | `100` |
| txsPerAccount | number | Yes | The number of transactions each account broadcasts. | `10` |
| concurrency | number | Yes | How many threads the stress test script uses. | `8` |

### Run the Stress Test

Run this command:

```bash
evmcli blockchain stress run -c config.json
```