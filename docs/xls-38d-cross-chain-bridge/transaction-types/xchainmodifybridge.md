---
html: xchainmodifybridge.html 
parent: transaction-types.html
blurb: Modify the parameters of a bridge.
labels:
  - Interoperability
status: not_enabled
---
# XChainModifyBridge

{% partial file="/snippets/_xchain-bridges-disclaimer.md" /%}

[[Source]](https://github.com/seelabs/rippled/blob/xbridge/src/ripple/protocol/impl/TxFormats.cpp#L338-L344 "Source")

The `XChainModifyBridge` transaction allows bridge managers to modify the parameters of the bridge. They can only change the `SignatureReward` and the `MinAccountCreateAmount`.

This transaction must be sent by the door account and requires the entities that control the witness servers to coordinate and provide the signatures for this transaction. This coordination happens outside the ledger.

**Note:** You can't modify the signer list for the bridge with this transaction. The signer list is on the door account itself and is changed in the same way signer lists are changed on accounts (via a `SignerListSet` transaction).


## Example XChainModifyBridge JSON

```json
{
  "TransactionType": "XChainModifyBridge",
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


## XChainModifyBridge Fields

| Field                    | JSON Type         | Internal Type | Required? | Description |
|:-------------------------|:------------------|:------------------|:----------|-------------|
| `Flags`                  | `number`          | `UINT32`          | Yes       | Specifies the flags for this transaction. |
| `MinAccountCreateAmount` | `Currency Amount` | `AMOUNT`          | No        | The minimum amount, in XRP, required for a `XChainAccountCreateCommit` transaction. If this is not present, the `XChainAccountCreateCommit` transaction will fail. This field can only be present on XRP-XRP bridges. |
| `SignatureReward`        | `Currency Amount` | `AMOUNT`          | No        | The signature reward split between the witnesses for submitting attestations. |
| `XChainBridge`           | `XChainBridge`    | `XCHAIN_BRIDGE`   | Yes       | The bridge to modify. |


{% partial file="/docs/xls-38d-cross-chain-bridge/snippets/_xchainbridge-serialization.md" /%}


### Transaction Flags

In addition to the universal transaction flags that are applicable to all transactions, you can specify this flag:

| Flag Name                    | Flag Value   | Description |
|------------------------------|--------------|-------------|
| `tfClearAccountCreateAmount` | `0x00010000` | Clears the `MinAccountCreateAmount` of the bridge. |


<!-- ## Error Cases

In addition to errors that can occur for all transactions, {{currentpage.name}} transactions can result in the following [transaction result codes](transaction-results.html):

| Error Code                    | Description                                  |
|:------------------------------|:---------------------------------------------|
| `temDISABLED`                 | The [NonFungibleTokensV1 amendment][] is not enabled. |
-->
