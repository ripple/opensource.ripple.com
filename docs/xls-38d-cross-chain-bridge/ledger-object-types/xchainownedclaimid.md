---
html: xchainownedclaimid.html
parent: ledger-object-types.html
blurb: An `XChainOwnedClaimID` object represents *one* cross-chain transfer of value. 
labels:
  - Interoperability
status: not_enabled
---
# XChainClaimID
[[Source]](https://github.com/seelabs/rippled/blob/xchain/src/ripple/protocol/impl/LedgerFormats.cpp#L282-L295 "Source")

 _(Added by the in-development Sidechains feature)_ :not_enabled:

An `XChainOwnedClaimID` object represents *one* cross-chain transfer of value and includes information of the account on the source chain that locks or burns the funds on the source chain.

The `XChainOwnedClaimID` object must be acquired on the destination chain before submitting a `XChainCommit` on the source chain. Its purpose is to prevent transaction replay attacks and is also used as a place to collect attestations from witness servers.

An `XChainCreateClaimID` transaction is used to create a new `XChainOwnedClaimID`. The ledger object is destroyed when the funds are successfully claimed on the destination chain.

<!--
## Example {{currentpage.name}} JSON

```json

```
-->

## {{currentpage.name}} Fields


An `XChainClaimID` object has these fields:

| Field                     | JSON Type         | [Internal Type][] | Required? | Description     |
|:--------------------------|:------------------|:------------------|:----------|:----------------|
| `LedgerIndex`             | `string`          | `HASH256`         | Yes       | The ledger index is a hash of a unique prefix for `XChainOwnedClaimID`s, the actual `XChainClaimID` value, and the fields in `XChainBridge`. |
| `XChainBridge`                   | `XChainBridge`    | `XCHAIN_BRIDGE`   | Yes       | The door accounts and assets of the bridge this object correlates to. |
| `XChainBridge.LockingChainDoor`  | `string`          | `ACCOUNT`         | Yes       | The door account on the locking chain. |
| `XChainBridge.LockingChainIssue` | `Issue`           | `ISSUE`           | Yes       | The asset that is locked and unlocked on the locking chain.. |
| `XChainBridge.IssuingChainDoor`  | `string`          | `ACCOUNT`         | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `XChainBridge.IssuingChainIssue` | `Issue`           | `ISSUE`           | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `OtherChainSource`        | `string`          | `ACCOUNT`         | Yes       | The account that must send the corresponding `XChainCommit` on the source chain. The destination may be specified in the `XChainCommit` transaction, which means that if the `OtherChainSource` isn't specified, another account can try to specify a different destination and steal the funds. This also allows tracking only a single set of signatures, since we know which account will send the `XChainCommit` transaction. |
| `SignatureReward`         | `Currency Amount` | `AMOUNT`          | Yes       | The total amount to pay the witness servers for their signatures. It must be at least the value of `SignatureReward` in the `Bridge` ledger object. |
| `XChainClaimAttestations` | `array`           | `ARRAY`           | Yes       | Attestations collected from the witness servers. This includes the parameters needed to recreate the message that was signed, including the amount, which chain (locking or issuing), optional destination, and reward account for that signature. |
| `XChainClaimID`           | `string`          | `UINT64`          | Yes       | The unique sequence number for a cross-chain transfer. |
