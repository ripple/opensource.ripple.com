---
html: bridge.html
parent: ledger-object-types.html
blurb: A `bridge` object represents a single cross-chain bridge that connects and enables value to move efficiently between two blockchains. 
labels:
  - Interoperability
status: not_enabled
---
# Bridge
[[Source]](https://github.com/seelabs/rippled/blob/xchain/src/ripple/protocol/impl/LedgerFormats.cpp#L265-L279 "Source")

A bridge connects and enables value to move efficiently between two blockchains. A bridge connects the XRP Ledger with another blockchain, such as its sidechain, and enables value in the form of XRP and other tokens (IOUs) to move efficiently between the two blockchains.


## Example Bridge JSON

```json
{
  "Account": "r3nCVTbZGGYoWvZ58BcxDmiMUU7ChMa1eC",
  "Flags": 0,
  "LedgerEntryType": "Bridge",
  "MinAccountCreateAmount": "2000000000",
  "OwnerNode": "0",
  "PreviousTxnID": "67A8A1B36C1B97BE3AAB6B19CB3A3069034877DE917FD1A71919EAE7548E5636",
  "PreviousTxnLgrSeq": 102,
  "SignatureReward": "204",
  "XChainAccountClaimCount": "0",
  "XChainAccountCreateCount": "0",
  "XChainBridge": {
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": {
      "currency": "XRP"
    },
    "LockingChainDoor": "r3nCVTbZGGYoWvZ58BcxDmiMUU7ChMa1eC",
    "LockingChainIssue": {
      "currency": "XRP"
    }
  },
  "XChainClaimID": "1",
  "index": "9F2C9E23343852036AFD323025A8506018ABF9D4DBAA746D61BF1CFB5C297D10"
}
```


## Bridge Fields

| Field                      | JSON Type         | [Internal Type][] | Required? | Description |
|:---------------------------|:------------------|:------------------|:----------|:------------|
| `LedgerIndex`              | `string`          | `HASH256`         | Yes       | The ledger index is a hash of a unique prefix for a bridge object, and the fields in `XChainBridge`. |
| `MinAccountCreateAmount`   | `Currency Amount` | `AMOUNT`          | No        | The minimum amount, in XRP, required for an `XChainAccountCreateCommit` transaction. If this isn't present, the `XChainAccountCreateCommit` transaction will fail. This field can only be present on XRP-XRP bridges. |
| `SignatureReward`          | `Currency Amount` | `AMOUNT`          | Yes       | The total amount, in XRP, to be rewarded for providing a signature for cross-chain transfer or for signing for the cross-chain reward. This amount will be split among the signers. |
| `XChainAccountClaimCount`  | `number`          | `UINT64`          | Yes       | A counter used to order the execution of account create transactions. It is incremented every time a `XChainAccountCreateCommit` transaction is "claimed" on the destination chain. When the "claim" transaction is run on the destination chain, the `XChainAccountClaimCount` must match the value that the `XChainAccountCreateCount` had at the time the `XChainAccountClaimCount` was run on the source chain. This orders the claims so that they run in the same order that the `XChainAccountCreateCommit` transactions ran on the source chain, to prevent transaction replay. |
| `XChainAccountCreateCount` | `number`          | `UINT64`          | Yes       | A counter used to order the execution of account create transactions. It is incremented every time a successful `XChainAccountCreateCommit` transaction is run for the source chain. |
| `XChainBridge`             | `XChainBridge`    | `XCHAIN_BRIDGE`   | Yes       | The door accounts and assets of the bridge this object correlates to. |
| `XChainClaimID`            | `number`          | `UINT64`          | Yes       | The value of the next `XChainClaimID` to be created. |

<embed src="/docs/xls-38d-cross-chain-bridge/snippets/_xchainbridge-serialization.md" />