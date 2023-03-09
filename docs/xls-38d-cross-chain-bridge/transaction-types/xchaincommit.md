---
html: xchaincommit.html 
parent: transaction-types.html
blurb: Initiate a cross-chain transfer of value.
labels:
  - Interoperability
status: not_enabled
---
# XChainCommit

The `XChainCommit` is the second step in a cross-chain transfer. It puts assets into trust on the locking chain so that they can be wrapped on the issuing chain, or burns wrapped assets on the issuing chain so that they can be returned on the locking chain.


## Example XChainCommit JSON

```json
{
  "Account": "rMTi57fNy2UkUb4RcdoUeJm7gjxVQvxzUo",
  "TransactionType": "XChainCommit",
  "XChainBridge": {
    "LockingChainDoor": "rMAXACCrp3Y8PpswXcg3bKggHX76V3F8M4",
    "LockingChainIssue": {
      "currency": "XRP"
    },
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": {
      "currency": "XRP"
    }
  },
  "Amount": "10000",
  "XChainClaimID": "13f"
}
```


## XChainCommit Fields

| Field                            | JSON Type         | [Internal Type][] | Description |
|:---------------------------------|:------------------|:------------------|:------------|
| `Amount`                         | `Currency Amount` | `AMOUNT`          | Yes       | The asset to commit, and the quantity. This must match the door account's `LockingChainIssue` (if on the locking chain) or the door account's `IssuingChainIssue` (if on the issuing chain). |
| `OtherChainDestination`          | `string`          | `ACCOUNT`         | No        | The destination account on the destination chain. If this is not specified, the account that submitted the `XChainCreateClaimID` transaction on the destination chain will need to submit a `XChainClaim` transaction to claim the funds. |
| `XChainBridge`                   | `XChainBridge`    | `XCHAIN_BRIDGE`   | Yes       | The bridge to use to transfer funds. |
| `XChainBridge.IssuingChainDoor`  | `string`          | `ACCOUNT`         | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `XChainBridge.IssuingChainIssue` | `Issue`           | `ISSUE`           | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `XChainBridge.LockingChainDoor`  | `string`          | `ACCOUNT`         | Yes       | The door account on the locking chain. |
| `XChainBridge.LockingChainIssue` | `Issue`           | `ISSUE`           | Yes       | The asset that is locked and unlocked on the locking chain. |
| `XChainClaimID`                  | `string`          | `UINT64`          | Yes       |  The unique integer ID for a cross-chain transfer. This must be acquired on the destination chain (via a `XChainCreateClaimID` transaction) and checked from a validated ledger before submitting this transaction. If an incorrect sequence number is specified, the funds will be lost. |


<!-- ## Error Cases

In addition to errors that can occur for all transactions, {{currentpage.name}} transactions can result in the following [transaction result codes](transaction-results.html):

| Error Code                    | Description                                  |
|:------------------------------|:---------------------------------------------|
| `temDISABLED`                 | The [NonFungibleTokensV1 amendment][] is not enabled. |
-->
