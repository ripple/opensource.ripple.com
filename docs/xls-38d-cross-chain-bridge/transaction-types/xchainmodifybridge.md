---
html: xchainmodifybridge.html 
parent: transaction-types.html
blurb: Modify the parameters of a bridge.
labels:
  - Interoperability
status: not_enabled
---
# XChainModifyBridge

The `XChainModifyBridge` transaction allows bridge managers to modify the parameters of the bridge. They can only change the `SignatureReward` and the `MinAccountCreateAmount`.

This transaction must be sent by the door account and requires the entities that control the witness servers to coordinate and provide the signatures for this transaction. This coordination happens outside the ledger.

**Note:** You can't modify the signer list for the bridge with this transaction. The signer list is on the door account itself and is changed in the same way signer lists are changed on accounts (via a `SignerListSet` transaction).


## Example {{currentpage.name}} JSON


```json
{
  "TransactionType": "XChainModifyBridge",
  "Account": "rhWQzvdmhf5vFS35vtKUSUwNZHGT53qQsg",
  "XChainBridge": {
    "LockingChainDoor": "rhWQzvdmhf5vFS35vtKUSUwNZHGT53qQsg",
    "LockingChainIssue": "XRP",
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": "XRP"
  },
  "SignatureReward": 200,
  "MinAccountCreateAmount": 1000000
}
```


{% include '_snippets/tx-fields-intro.md' %}

| Field                            | JSON Type         | [Internal Type][] | Required? | Description |
|:---------------------------------|:------------------|:------------------|:----------|-------------|
| `XChainBridge`                   | `XChainBridge`    | `XCHAIN_BRIDGE`   | Yes       | The bridge to modify. |
| `XChainBridge.LockingChainDoor`  | `string`          | `ACCOUNT`         | Yes       | The door account on the locking chain. |
| `XChainBridge.LockingChainIssue` | `Issue`           | `ISSUE`           | Yes       | The asset that is locked and unlocked on the locking chain. |
| `XChainBridge.IssuingChainDoor`  | `string`          | `ACCOUNT`         | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `XChainBridge.IssuingChainIssue` | `Issue`           | `ISSUE`           | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `SignatureReward`                | `Currency Amount` | `AMOUNT`          | No        | The signature reward split between the witnesses for submitting attestations. |
| `MinAccountCreateAmount`         | `Currency Amount` | `AMOUNT`          | No        | The minimum amount, in XRP, required for a `XChainAccountCreateCommit` transaction. If this is not present, the `XChainAccountCreateCommit` transaction will fail. This field can only be present on XRP-XRP bridges. |
| `Flags`                          | `number`          | `UINT32`          | Yes       | Specifies the flags for this transaction. |


## Transaction Flags

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


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
