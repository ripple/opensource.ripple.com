---
html: xchaincreateclaimid.html 
parent: transaction-types.html
blurb: Create a cross-chain claim ID that is used for a cross-chain transfer.
labels:
  - Interoperability
status: not_enabled
---
# XChainCreateClaimID

<embed src="/snippets/_xchain-bridges-disclaimer.md" />

The `XChainCreateClaimID` transaction creates a new cross-chain claim ID that is used for a cross-chain transfer. A cross-chain claim ID represents *one* cross-chain transfer of value. 

This transaction is the first step of a cross-chain transfer of value and is submitted on the destination chain, not the source chain. 

It also includes the account on the source chain that locks or burns the funds on the source chain.


## Example XChainCreateClaimID JSON

```json
{
  "Account": "rahDmoXrtPdh7sUdrPjini3gcnTVYjbjjw",
  "OtherChainSource": "rMTi57fNy2UkUb4RcdoUeJm7gjxVQvxzUo",
  "TransactionType": "XChainCreateClaimID",
  "SignatureReward": "100",
  "XChainBridge": {
    "LockingChainDoor": "rMAXACCrp3Y8PpswXcg3bKggHX76V3F8M4",
    "LockingChainIssue": {
      "currency": "XRP"
    },
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": {
      "currency": "XRP"
    }
  }
}
```


## XChainCreateClaimID Fields

| Field              | JSON Type         | Internal Type | Required? | Description |
|:-------------------|:------------------|:------------------|:----------|-------------|
| `OtherChainSource` | `string`          | `ACCOUNT`         | Yes       | The account that must send the `XChainCommit` transaction on the source chain.
| `SignatureReward`  | `string`          | `ACCOUNT`         | Yes       | The amount, in XRP, to reward the witness servers for providing signatures. This must match the amount on the `Bridge` ledger object.
| `XChainBridge`     | `XChainBridge`    | `XCHAIN_BRIDGE`   | Yes       | The bridge to create the claim ID for. |


<embed src="/docs/xls-38d-cross-chain-bridge/snippets/_xchainbridge-serialization.md" />


<!-- ## Error Cases

In addition to errors that can occur for all transactions, {{currentpage.name}} transactions can result in the following [transaction result codes](transaction-results.html):

| Error Code                    | Description                                  |
|:------------------------------|:---------------------------------------------|
| `temDISABLED`                 | The [NonFungibleTokensV1 amendment][] is not enabled. |
-->
