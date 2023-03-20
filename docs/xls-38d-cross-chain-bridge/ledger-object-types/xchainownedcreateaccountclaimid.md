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

<embed src="/snippets/_xchain-bridges-disclaimer.md" />

The `XChainOwnedCreateAccountClaimID` ledger object is used to collect attestations for creating an account via a cross-chain transfer.

It is created when an `XChainAddAccountCreateAttestation` transaction adds a signature attesting to a `XChainAccountCreateCommit` transaction and the `XChainAccountCreateCount` is greater than or equal to the current `XChainAccountClaimCount` on the `Bridge` ledger object.

The ledger object is destroyed when all the attestations have been received and the funds have transferred to the new account.


## Example XChainOwnedCreateAccountClaimID JSON

```json
{
  "LedgerEntryType": "XChainOwnedCreateAccountClaimID",
  "LedgerIndex": "3381B033039174A1EE73B6F0794FAD416C8FF1E1937365D49FB5151E3B3025B2",
  "NewFields": {
    "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "XChainAccountCreateCount": "2",
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
    "XChainCreateAccountAttestations": [
      {
        "XChainCreateAccountProofSig": {
          "Amount": "2000000000",
          "AttestationRewardAccount": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es",
          "AttestationSignerAccount": "rpWLegmW9WrFBzHUj7brhQNZzrxgLj9oxw",
          "Destination": "rJMfWNVbyjcCtds8kpoEjEbYQ41J5B6MUd",
          "PublicKey": "EDF7C3F9C80C102AF6D241752B37356E91ED454F26A35C567CF6F8477960F66614",
          "SignatureReward": "204",
          "WasLockingChainSend": 1
        }
      }
    ]
  }
}
```


## XChainOwnedCreateAccountClaimID Fields

| Field                             | JSON Type      | [Internal Type][] | Required? | Description |
|:----------------------------------|:---------------|:------------------|:----------|:------------|
| `LedgerIndex`                     | `string`       | `HASH256`         | Yes       | The ledger index is a hash of a unique prefix for `XChainOwnedClaimID`s, the actual `XChainClaimID` value, and the fields in `XChainBridge`. |
| `XChainAccountCreateCount`        | `number`       | `UINT64`          | Yes       | An integer that determines the order that accounts created through cross-chain transfers must be performed. Smaller numbers must execute before larger numbers. |
| `XChainBridge`                    | `XChainBridge` | `XCHAIN_BRIDGE`   | Yes       | The door accounts and assets of the bridge this object correlates to. |
| `XChainCreateAccountAttestations` | `array`        | `ARRAY`           | Yes       | Attestations collected from the witness servers. This includes the parameters needed to recreate the message that was signed, including the amount, destination, signature reward amount, and reward account for that signature. With the exception of the reward account, all signatures must sign the message created with common parameters. |


### XChainBridge Fields

| Field               | JSON Type | [Internal Type][] | Required? | Description     |
|:--------------------|:----------|:------------------|:----------|:----------------|
| `IssuingChainDoor`  | `string`  | `ACCOUNT`         | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `IssuingChainIssue` | `Issue`   | `ISSUE`           | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `LockingChainDoor`  | `string`  | `ACCOUNT`         | Yes       | The door account on the locking chain. |
| `LockingChainIssue` | `Issue`   | `ISSUE`           | Yes       | The asset that is locked and unlocked on the locking chain. |
