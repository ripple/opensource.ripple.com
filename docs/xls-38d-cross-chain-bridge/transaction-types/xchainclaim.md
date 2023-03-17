---
html: xchainclaim.html 
parent: transaction-types.html
blurb: Complete a cross-chain transfer of value by claiming the value on the destination chain.
labels:
  - Interoperability
status: not_enabled
---
# XChainClaim

The `XChainClaim` transaction completes a cross-chain transfer of value. It allows a user to claim the value on the destination chain - the equivalent of the value locked on the source chain. A user can only claim the value if they own the cross-chain claim ID associated with the value locked on the source chain (the `Account` field). The user can send the funds to anyone (the `Destination` field). This transaction is only needed if an `OtherChainDestination` isn't specified in the `XChainCommit` transaction, or if something goes wrong with the automatic transfer of funds.

If the transaction succeeds in moving funds, the referenced `XChainOwnedClaimID` ledger object will be destroyed. This prevents transaction replay. If the transaction fails, the `XChainOwnedClaimID` won't be destroyed and the transaction can be re-run with different parameters.


## Example XChainClaim JSON

```json
{
  "Account": "rahDmoXrtPdh7sUdrPjini3gcnTVYjbjjw",
  "Amount": "10000",
  "TransactionType": "XChainClaim",
  "XChainClaimID": "13f",
  "Destination": "rahDmoXrtPdh7sUdrPjini3gcnTVYjbjjw",
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


## XChainClaim Fields

| Field                   | JSON Type         | [Internal Type][] | Required? | Description |
|:------------------------|:------------------|:------------------|:----------|-------------|
| `Amount`                | `Currency Amount` | `AMOUNT`          | Yes       | The amount to claim on the destination chain. This must match the amount attested to on the attestations associated with this `XChainClaimID`. |
| `Destination`           | `string`          | `ACCOUNT`         | Yes       | The destination account on the destination chain. It must exist or the transaction will fail. However, if the transaction fails in this case, the sequence number and collected signatures won't be destroyed, and the transaction can be rerun with a different destination. |
| `DestinationTag`        | `int`             | `UINT32`          | No        | An integer destination tag. |
| `OtherChainDestination` | `string`          | `ACCOUNT`         | Yes       | The destination account on the destination chain. |
| `XChainBridge`          | `XChainBridge`    | `XCHAIN_BRIDGE`   | Yes       | The bridge to use for the transfer. |
| `XChainClaimID`         | `string`          | `UINT64`          | Yes       | The unique integer ID for the cross-chain transfer that was referenced in the corresponding `XChainCommit` transaction. |


<embed src="/docs/xls-38d-cross-chain-bridge/snippets/_xchainbridge-serialization.md" />


<!-- ## Error Cases

In addition to errors that can occur for all transactions, {{currentpage.name}} transactions can result in the following [transaction result codes](transaction-results.html):

| Error Code                    | Description                                  |
|:------------------------------|:---------------------------------------------|
| `temDISABLED`                 | The [NonFungibleTokensV1 amendment][] is not enabled. |
-->
