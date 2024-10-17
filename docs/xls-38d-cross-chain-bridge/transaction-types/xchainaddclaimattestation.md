---
html: xchainaddclaimattestation.html 
parent: transaction-types.html
blurb: Submit proof (attestation) to the destination chain that an event that happened on the source chain.
labels:
  - Interoperability
status: not_enabled
---
# XChainAddClaimAttestation

{% partial file="/snippets/_xchain-bridges-disclaimer.md" /%}

[[Source]](https://github.com/seelabs/rippled/blob/xbridge/src/ripple/protocol/impl/TxFormats.cpp#L377-L392 "Source")

The `XChainAddClaimAttestation` transaction provides proof from a witness server, attesting to an `XChainCommit` transaction. 

The signature must be from one of the keys on the door's signer list at the time the signature was provided. However, if the signature list changes between the time the signature was submitted and the quorum is reached, the new signature set is used and some of the currently collected signatures may be removed.

Any account can submit signatures.

**Note:** The reward is only sent to accounts that have keys on the current list. A quorum of signers need to agree on the `SignatureReward`, the same way they need to agree on the other data. A single witness server can't provide an incorrect value for this in an attempt to collect a larger reward.


## Example XChainAddClaimAttestation JSON

```json
{
  "TransactionType": "XChainAddClaimAttestation",
  "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  "XChainAttestationBatch": {
    "XChainBridge": {
      "IssuingChainDoor": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
      "IssuingChainIssue": {
        "currency": "XRP"
      },
      "LockingChainDoor": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
      "LockingChainIssue": {
        "currency": "XRP"
      }
    },
    "XChainClaimAttestationBatch" : [
      {
        "XChainClaimAttestationBatchElement" : {
          "Account" : "rnJmYAiqEVngtnb5ckRroXLtCbWC7CRUBx",
          "Amount" : "100000000",
          "AttestationSignerAccount" : "rnJmYAiqEVngtnb5ckRroXLtCbWC7CRUBx",
          "Destination" : "r9A8UyNpW3X46FUc6P7JZqgn6WgAPjBwPg",
          "PublicKey" : "03DAB289CA36FF377F3F4304C7A7203FDE5EDCBFC209F430F6A4355361425526D0",
          "Signature" : "616263",
          "WasLockingChainSend" : 1,
          "XChainClaimID" : "0000000000000000"
        }
      }
    ],
    "XChainCreateAccountAttestationBatch": [
      {
        "XChainCreateAccountAttestationBatchElement": {
          "Account": "rnJmYAiqEVngtnb5ckRroXLtCbWC7CRUBx",
          "Amount": "1000000000",
          "AttestationSignerAccount": "rEziJZmeZzsJvGVUmpUTey7qxQLKYxaK9f",
          "Destination": "rKT9gDkaedAosiHyHZTjyZs2HvXpzuiGmC",
          "PublicKey": "03ADB44CA8E56F78A0096825E5667C450ABD5C24C34E027BC1AAF7E5BD114CB5B5",
          "Signature": "3044022036C8B90F85E8073C465F00625248A72D4714600F98EBBADBAD3B7ED226109A3A02204C5A0AE12D169CF790F66541F3DB59C289E0D9CA7511FDFE352BB601F667A26",
          "SignatureReward": "1000000",
          "WasLockingChainSend": 1,
          "XChainAccountCreateCount": "0000000000000001"
        }
      }
    ]
  }
}
```


## XChainAddClaimAttestation Fields

| Field                      | JSON Type         | Internal Type | Required? | Description |
|:---------------------------|:------------------|:------------------|:----------|-------------|
| `Amount`                   | `Currency Amount` | `AMOUNT`          | Yes       | The amount committed by the `XChainCommit` transaction on the source chain. |
| `AttestationRewardAccount` | `string`          | `ACCOUNT`         | Yes       | The account that should receive this signer's share of the `SignatureReward`. |
| `AttestationSignerAccount` | `string`          | `ACCOUNT`         | Yes       | The account on the door account's signer list that is signing the transaction. |
| `Destination`              | `string`          | `ACCOUNT`         | No        | The destination account for the funds on the destination chain (taken from the `XChainCommit` transaction).
| `OtherChainSource`         | `string`          | `ACCOUNT`         | Yes       | The account on the source chain that submitted the `XChainCommit` transaction that triggered the event associated with the attestation.
| `PublicKey`                | `string`          | `BLOB`            | Yes       | The public key used to verify the attestation signature. |
| `Signature`                | `string`          | `BLOB`            | Yes       | The signature attesting to the event on the other chain. |
| `WasLockingChainSend`      | `number`          | `UINT8`           | Yes       | A boolean representing the chain where the event occurred. |
| `XChainBridge`             | `XChainBridge`    | `XCHAIN_BRIDGE`   | Yes       | The bridge to use to transfer funds. |
| `XChainClaimID`            | `string`          | `UINT64`          | Yes       | The `XChainClaimID` associated with the transfer, which was included in the `XChainCommit` transaction. |


{% partial file="/docs/xls-38d-cross-chain-bridge/snippets/_xchainbridge-serialization.md" /%}


<!-- ## Error Cases

In addition to errors that can occur for all transactions, {{currentpage.name}} transactions can result in the following [transaction result codes](transaction-results.html):

| Error Code                    | Description                                  |
|:------------------------------|:---------------------------------------------|
| `temDISABLED`                 | The [NonFungibleTokensV1 amendment][] is not enabled. |
-->
