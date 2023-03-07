---
html: xchainownedcreateaccountclaimid.html
parent: ledger-object-types.html
blurb: The `XChainOwnedCreateAccountClaimID` ledger object is used to collect attestations for creating an account via a cross-chain transfer. 
labels:
  - Interoperability
status: not_enabled
---
# XChainOwnedCreateAccountClaimID
[[Source]](https://github.com/seelabs/rippled/blob/xchain/src/ripple/protocol/impl/LedgerFormats.cpp#L297-L308 "Source")

 _(Added by the in-development Sidechains feature)_ :not_enabled:

The `XChainOwnedCreateAccountClaimID` ledger object is used to collect attestations for creating an account via a cross-chain transfer.

It is created when an `XChainAddAccountCreateAttestation` transaction adds a signature attesting to a `XChainAccountCreateCommit` transaction and the `XChainAccountCreateCount` is greater than or equal to the current `XChainAccountClaimCount` on the `Bridge` ledger object.

The ledger object is destroyed when all the attestations have been received and the funds have transferred to the new account.

<!--
## Example {{currentpage.name}} JSON

```json

```
-->

## {{currentpage.name}} Fields


An `XChainOwnedCreateAccountClaimID` object has these fields:

| Field                             | JSON Type      | [Internal Type][] | Required? | Description     |
|:----------------------------------|:---------------|:------------------|:----------|:----------------|
| `LedgerIndex`                     | `string`       | `HASH256`         | Yes       | The ledger index is a hash of a unique prefix for `XChainOwnedClaimID`s, the actual `XChainClaimID` value, and the fields in `XChainBridge`. |
| `XChainBridge`                   | `XChainBridge`    | `XCHAIN_BRIDGE`   | Yes       | The door accounts and assets of the bridge this object correlates to. |
| `XChainBridge.LockingChainDoor`  | `string`          | `ACCOUNT`         | Yes       | The door account on the locking chain. |
| `XChainBridge.LockingChainIssue` | `Issue`           | `ISSUE`           | Yes       | The asset that is locked and unlocked on the locking chain.. |
| `XChainBridge.IssuingChainDoor`  | `string`          | `ACCOUNT`         | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `XChainBridge.IssuingChainIssue` | `Issue`           | `ISSUE`           | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `XChainAccountCreateCount`        | `number`       | `UINT64`          | Yes       | An integer that determines the order that accounts created through cross-chain transfers must be performed. Smaller numbers must execute before larger numbers. |
| `XChainCreateAccountAttestations` | `array`        | `ARRAY`           | Yes       | Attestations collected from the witness servers. This includes the parameters needed to recreate the message that was signed, including the amount, destination, signature reward amount, and reward account for that signature. With the exception of the reward account, all signatures must sign the message created with common parameters. |
