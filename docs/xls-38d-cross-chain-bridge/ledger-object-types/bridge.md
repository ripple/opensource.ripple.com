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

 _(Added by the in-development Sidechains feature)_ :not_enabled:

A bridge connects and enables value to move efficiently between two blockchains. A bridge connects the XRP Ledger with another blockchain, such as its sidechain, and enables value in the form of XRP and other tokens (IOUs) to move efficiently between the two blockchains.


<!-- 
## Example {{currentpage.name}} JSON

```json

```
-->

## {{currentpage.name}} Fields



A `Bridge` object has these fields:

| Field                            | JSON Type         | [Internal Type][] | Required? | Description     |
|:---------------------------------|:------------------|:------------------|:----------|:----------------|
| `LedgerIndex`                    | `string`          | `HASH256`         | Yes       | The ledger index is a hash of a unique prefix for a bridge object, and the fields in `XChainBridge`. |
| `XChainBridge`                   | `XChainBridge`    | `XCHAIN_BRIDGE`   | Yes       | The bridge that this object correlates to - namely, the door accounts and assets. |
| `XChainBridge.LockingChainDoor`  | `string`          | `ACCOUNT`         | Yes       | The door account on the locking chain. |
| `XChainBridge.LockingChainIssue` | `Issue`           | `ISSUE`           | Yes       | The asset that is locked and unlocked on the locking chain.. |
| `XChainBridge.IssuingChainDoor`  | `string`          | `ACCOUNT`         | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `XChainBridge.IssuingChainIssue` | `Issue`           | `ISSUE`           | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `SignatureReward`                | `Currency Amount` | `AMOUNT`          | Yes       | The total amount, in XRP, to be rewarded for providing a signature for cross-chain transfer or for signing for the cross-chain reward. This amount will be split among the signers. |
| `MinAccountCreateAmount`         | `Currency Amount` | `AMOUNT`          | No        | The minimum amount, in XRP, required for an `XChainAccountCreateCommit` transaction. If this isn't present, the `XChainAccountCreateCommit` transaction will fail. This field can only be present on XRP-XRP bridges. |
| `XChainAccountClaimCount`        | `number`          | `UINT64`          | Yes       | A counter used to order the execution of account create transactions. It is incremented every time a `XChainAccountCreateCommit` transaction is "claimed" on the destination chain. When the "claim" transaction is run on the destination chain, the `XChainAccountClaimCount` must match the value that the `XChainAccountCreateCount` had at the time the `XChainAccountClaimCount` was run on the source chain. This orders the claims so that they run in the same order that the `XChainAccountCreateCommit` transactions ran on the source chain, to prevent transaction replay. |
| `XChainAccountCreateCount`       | `number`          | `UINT64`          | Yes       | A counter used to order the execution of account create transactions. It is incremented every time a successful `XChainAccountCreateCommit` transaction is run for the source chain. |
| `XChainClaimID`                  | `number`          | `UINT64`          | Yes       | The value of the next `XChainClaimID` to be created. |
