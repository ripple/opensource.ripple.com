---
seo:
    description: The Confidential Transfers amendment updates the MPTokenIssuance and MPToken ledger entries for confidential balances and transfers.
labels:
  - Multi-Purpose Tokens, MPTs, Tokens
  - Confidential Transfers
---
# Updated Ledger Entries

The Confidential Transfers amendment updates two existing ledger entry types to support confidential balances and transfers:

- [MPTokenIssuance](#mptokenissuance) - Adds fields for issuer and auditor public keys, and tracks total confidential supply.
- [MPToken](#mptoken) - Adds fields for holder public keys and encrypted confidential balances.

_(Requires the [ConfidentialTransfers amendment][] {% not-enabled /%})_

## MPTokenIssuance

### MPTokenIssuance Fields

In addition to the existing [MPTokenIssuance fields](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/mptokenissuance#mptokenissuance-fields), confidential MPTokenIssuance entries support:

| Name                            | JSON Type           | [Internal Type][] | Required?   | Description |
|:------------------------------- |:------------------- |:----------------- |:----------- |:----------- |
| `IssuerElGamalPublicKey`        | String              | Blob              | No          | A 33-byte compressed ElGamal public key for the issuer. |
| `AuditorElGamalPublicKey`       | String              | Blob              | No          | A 33-byte compressed ElGamal public key for an optional on-chain auditor. |
| `ConfidentialOutstandingAmount` | Number              | UInt64            | No          | The total amount of this token that is currently held in confidential balances. |

### MPTokenIssuance Flags

In addition to the existing [MPTokenIssuance flags](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/mptokenissuance#mptokenissuance-flags), confidential MPTokenIssuance entries support:

| Flag Name                    | Hex Value    | Decimal Value | Description |
| :--------------------------- |:------------ |:------------  |:------------|
| `lsfMPTCanPrivacy`           | `0x00000080` | 128           |If enabled, indicates that confidential transfers and conversions are enabled for this token issuance. |
| `lsfMPTCannotMutatePrivacy` | `0x00040000` | 262144        |If enabled, the **Can Privacy** flag cannot be changed after the token is issued, permanently locking the confidentiality setting. |

## MPToken

### MPToken Fields

In addition to the existing [MPToken fields](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/mptoken#mptoken-fields), confidential MPToken entries support:

| Name                          | JSON Type            | [Internal Type][] | Required?  | Description  |
|:----------------------------- |:-------------------- |:----------------- |:---------- |:------------ |
| `HolderElGamalPublicKey`      | String               | Blob              | No         | The holder's ElGamal public key for confidential balances. Present when the holder has a confidential balance. |
| `ConfidentialBalanceInbox`    | String               | Blob              | No         | Encrypted inbox balance that receives incoming confidential transfers. Before it can be spent, the holder must merge it into their spending balance using the [ConfidentialMPTMergeInbox transaction][]. Present when the holder has a confidential balance. |
| `ConfidentialBalanceSpending` | String               | Blob              | No         | Encrypted spending balance used to generate proofs for outgoing transactions. Present when the holder has a confidential balance. |
| `ConfidentialBalanceVersion`  | Number               | UInt32            | No         | Version number that increments each time the spending balance changes. This version is cryptographically bound to ZKPs in outgoing transactions to prevent replay attacks and ensure proof validity. If the version changes between proof generation and submission, the transaction will fail. |
| `IssuerEncryptedBalance`      | String               | Blob              | No         | Copy of the holder's total confidential balance encrypted for the issuer to audit supply. Present when the holder has a confidential balance. |
| `AuditorEncryptedBalance`     | String               | Blob              | No         | The holder's total confidential balance encrypted under the auditor's key for independent auditing. Only present if an auditor is configured. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
