---
html: xchainaccountcreatecommit.html
parent: transaction-types.html
blurb: Create an account on one of the chains that the bridge connects. This account serves as the bridge entrance for that chain.
labels:
  - Interoperability
status: not_enabled
---
# XChainAccountCreateCommit

{% partial file="/snippets/_xchain-bridges-disclaimer.md" /%}

[[Source]](https://github.com/seelabs/rippled/blob/xbridge/src/ripple/protocol/impl/TxFormats.cpp#L414-L421 "Source")

This transaction can only be used for XRP-XRP bridges.

The `XChainAccountCreateCommit` transaction creates a new account on one of the chains a bridge connects, which serves as the bridge entrance for that chain.

**Warning:** This transaction should only be executed if the witness attestations will be reliably delivered to the destination chain. If the signatures aren't delivered, then account creation will be blocked until attestations are received. This can be used maliciously; to disable this transaction on XRP-XRP bridges, the bridge's `MinAccountCreateAmount` shouldn't be present.


## Example XChainAccountCreateCommit JSON

```json
{
  "Account": "rwEqJ2UaQHe7jihxGqmx6J4xdbGiiyMaGa",
  "Destination": "rD323VyRjgzzhY4bFpo44rmyh2neB5d8Mo",
  "TransactionType": "XChainAccountCreateCommit",
  "Amount": "20000000",
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


## XChainAccountCreateCommit Fields

| Field             | JSON Type         | Internal Type | Required? | Description |
|:------------------|:------------------|:------------------|:----------| :-----------|
| `Amount`          | `Currency Amount` | `AMOUNT`          | Yes       | The amount, in XRP, to use for account creation. This must be greater than or equal to the `MinAccountCreateAmount` specified in the `Bridge` ledger object. |
| `Destination`     | `string`          | `ACCOUNT`         | Yes       | The destination account on the destination chain. |
| `SignatureReward` | `Currency Amount` | `AMOUNT`          | No        | The amount, in XRP, to be used to reward the witness servers for providing signatures. This must match the amount on the `Bridge` ledger object. |
| `XChainBridge`    | `XChainBridge`    | `XCHAIN_BRIDGE`   | Yes       | The bridge to create accounts for. |


{% partial file="/docs/xls-38d-cross-chain-bridge/snippets/_xchainbridge-serialization.md" /%}

<!-- ## Error Cases

In addition to errors that can occur for all transactions, {{currentpage.name}} transactions can result in the following [transaction result codes](transaction-results.html):

| Error Code                    | Description                                  |
|:------------------------------|:---------------------------------------------|
| `temDISABLED`                 | The [NonFungibleTokensV1 amendment][] is not enabled. |
-->
