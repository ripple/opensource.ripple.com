---
html: xchaincreatebridge.html 
parent: transaction-types.html
blurb: Create a bridge between two chains.
labels:
  - Interoperability
status: not_enabled
---
# XChainCreateBridge

{% partial file="/snippets/_xchain-bridges-disclaimer.md" /%}

[[Source]](https://github.com/seelabs/rippled/blob/xbridge/src/ripple/protocol/impl/TxFormats.cpp#L329-L335 "Source")

The `XChainCreateBridge` transaction creates a new `Bridge` ledger object and defines a new cross-chain bridge entrance on the chain that the transaction is submitted on. It includes information about door accounts and assets for the bridge. 

The transaction must be submitted first by the locking chain door account. To set up a valid bridge, door accounts on both chains must submit this transaction, in addition to setting up witness servers.

The complete production-grade setup would also include a `SignerListSet` transaction on the two door accounts for the witnesses’ signing keys, as well as disabling the door accounts’ master key. This ensures that the witness servers are truly in control of the funds.

**Note:** Each door account can only have one bridge. This prevents the creation of duplicate bridges for the same asset, which can cause asset imbalances on either chain.


## Example XChainCreateBridge JSON

```json
{
  "TransactionType": "XChainCreateBridge",
  "Account": "rhWQzvdmhf5vFS35vtKUSUwNZHGT53qQsg",
  "XChainBridge": {
    "LockingChainDoor": "rhWQzvdmhf5vFS35vtKUSUwNZHGT53qQsg",
    "LockingChainIssue": {
      "currency": "XRP"
    },
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": {
      "currency": "XRP"
    }
  },
  "SignatureReward": 200,
  "MinAccountCreateAmount": 1000000
}
```


## XChainCreateBridge Fields

| Field                    | JSON Type         | Internal Type | Required? | Description |
|:-------------------------|:------------------|:------------------|:----------------|:------|
| `MinAccountCreateAmount` | `Currency Amount` | `AMOUNT`          | No        | The minimum amount, in XRP, required for a `XChainAccountCreateCommit` transaction. If this isn't present, the `XChainAccountCreateCommit` transaction will fail. This field can only be present on XRP-XRP bridges. |
| `SignatureReward`        | `Currency Amount` | `AMOUNT`          | Yes       | The total amount to pay the witness servers for their signatures. This amount will be split among the signers. |
| `XChainBridge`           | `XChainBridge`    | `XCHAIN_BRIDGE`   | Yes       | The bridge (door accounts and assets) to create. |


{% partial file="/docs/xls-38d-cross-chain-bridge/snippets/_xchainbridge-serialization.md" /%}


<!-- ## Error Cases

In addition to errors that can occur for all transactions, {{currentpage.name}} transactions can result in the following [transaction result codes](transaction-results.html):

| Error Code                    | Description                                  |
|:------------------------------|:---------------------------------------------|
| `temDISABLED`                 | The [NonFungibleTokensV1 amendment][] is not enabled. |
-->
