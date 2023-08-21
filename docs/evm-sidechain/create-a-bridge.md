---
html: create-a-bridge.html
parent: evm-cli.html
blurb: Create a bridge using the EVM CLI.
labels:
  - Development, Interoperability
status: not_enabled
---
# Create a Bridge

<embed src="/snippets/_evm-sidechain-disclaimer.md" />

The `bridge create` command enables you to set up a bridge.


## Create a Config File

Create a JSON config file in this format:

```json
{
    "lockingChain": {
        "type": "evm",
        "url": "https://rpc-evm-sidechain.peersyst.tech",
        "fundingPrivateKey": "****",
        "witnesses": [
            "0x96329A50d10a3F69311E4f4E108672926c51c474"
        ],
        "tokenCode": "USD",
        "tokenAddress": "0x92AE4ba2305F6c64E9715b60CF774784079C463B"
    },
    "issuingChain": {
        "type": "xrp",
        "url": "wss://sidechain-net1.devnet.rippletest.net",
        "fundingPrivateKey": "****",
        "witnesses": [
            "rpSspP5yYyomcSrgsohyKMCnu5oJsTMkYP"
        ]
    },
    "threshold": 1,
    "minRewardAmount": 1,
    "minCreateAmount": 20
}
```


| Key | Value Type | Required | Description | Example |
|-----|------------|----------|-------------|---------|
| lockingChain | object | Yes | The locking chain information. | |
| lockingChain.type | string | Yes | "xrp" or "evm" | `"xrp"` |
| lockingChain.url | string | Yes | The node URL of the locking chain. | `"wss://sidechain-net1.devnet.rippletest.net"` |
| lockingChain.fundingPrivateKey | string | Yes | A private key that has enough balance in the locking chain to pay fees and activate witness accounts. | `"0000000000000000000000000000000000000000000000000000000000000000"` |
| lockingChain.witnesses | array | Yes | A set of locking chain addresses that will be bridge witnesses. | `["rpSspP5yYyomcSrgsohyKMCnu5oJsTMkYP"]` |
| lockingChain.tokenCode | string | Yes | The token code in the locking chain. If the token code is "XRP", the bridge will use the native XRP currency. | `"USD"` |
| lockingChain.tokenAddress | string | No | The token issuer if XRPL, or the token address if EVM. Only required if the token code isn't XRP. | `"rpSspP5yYyomcSrgsohyKMCnu5oJsTMkYP"` |
| lockingChain.safeAddress | string | No | Only used if the locking chain is EVM, and the safe is already activated. | `"0x0000000000000000000000000000000000000000"` |
| issuingChain | object | Yes | The issuing chain information. | |
| issuingChain.type | string | Yes | "xrp" or "evm" | `"evm"` |
| issuingChain.url | string | Yes | The node URL of the locking chain. | `"https://rpc-evm-sidechain.peersyst.tech"` |
| issuingChain.fundingPrivateKey | string | Yes | A private key that has enough balance in the issuing chain to pay fees and activate witness accounts. | `"0000000000000000000000000000000000000000000000000000000000000000"` |
| issuingChain.witnesses | array | Yes | A set of issuing chain addresses that will be bridge witnesses. | `["0x96329A50d10a3F69311E4f4E108672926c51c474"]` |
| issuingChain.safeAddress | string | No | Only used if the issuing chain is EVM, and the safe is already activated. | `"0x0000000000000000000000000000000000000000"` |
| threshold | number | Yes | The amount of witness attestations needed in order to perform one bridge operation. | `1` |
| minRewardAmount | number | Yes | The minimum amount rewarded to the witnesses that perform attestations. | `1` |
| minCreateAmount | number | Yes | The minimum amount needed to perform a create account operation. | `50` |


## Create the Bridge

Run the `bridge create` command:

```bash
evmcli bridge create -c config.json -e $PWD/usd-bridge.json
```
