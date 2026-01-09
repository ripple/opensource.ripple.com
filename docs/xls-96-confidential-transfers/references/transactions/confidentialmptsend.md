---
seo:
    description: Send MPT tokens to another account while keeping the transfer amount hidden.
labels:
  - Multi-Purpose Tokens, MPTs, Tokens
  - Confidential Transfers
---
# ConfidentialMPTSend

[[Source]](https://github.com/XRPLF/rippled/blob/ripple/confidential-transfer/src/xrpld/app/tx/detail/ConfidentialMPTSend.cpp "Source")

Send MPT tokens to another account while keeping the transfer amount hidden. The transferred amount is credited to the receiver's confidential inbox balance to avoid proof staleness. The receiver can later merge these funds into the spending balance via the [ConfidentialMPTMergeInbox transaction][].

Confidential sends respect the same authorization requirements as standard MPT payments, including Deposit Authorization and Credential requirements.

_(Requires the [ConfidentialTransfers amendment][] {% not-enabled /%})_

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "ConfidentialMPTSend",
  "Account": "rSenderAccount...",
  "Destination": "rReceiverAccount...",
  "MPTokenIssuanceID": "610F33B8EBF7EC795F822A454FB852156AEFE50BE0CB8326338A81CD74801864",
  "SenderEncryptedAmount": "AD3F...",
  "DestinationEncryptedAmount": "DF4E...",
  "IssuerEncryptedAmount": "BC2E...",
  "ZKProof": "84af...",
  "AmountCommitment": "038A...",
  "BalanceCommitment": "02F1...",
  "Fee": "12",
  "Sequence": 2470665,
  "Flags": 2147483648
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](https://xrpl.org/docs/references/protocol/transactions/common-fields#transaction-common-fields), {% code-page-name /%} transactions use the following fields:

| Field                     | JSON Type | [Internal Type][] | Required? | Description |
|:------------------------- |:--------- |:----------------- |:--------- |:------------|
| `Destination`             | String    | AccountID         | Yes       | The receiver's account. |
| `MPTokenIssuanceID`       | String    | UInt192           | Yes       | Identifier of the MPT issuance being transferred. |
| `SenderEncryptedAmount`   | String    | Blob              | Yes       | Ciphertext used to homomorphically debit the sender's spending balance. |
| `DestinationEncryptedAmount` | String | Blob              | Yes       | Ciphertext credited to the receiver's inbox balance. |
| `IssuerEncryptedAmount`   | String    | Blob              | Yes       | Ciphertext used to update the issuer mirror balance. |
| `ZKProof`                 | String    | Blob              | Yes       | ZKP bundle establishing equality, linkage, and range sufficiency. |
| `AmountCommitment`        | String    | Blob              | Yes       | A cryptographic commitment to the amount being transferred. |
| `BalanceCommitment`       | String    | Blob              | Yes       | A cryptographic commitment to the user's confidential spending balance. |
| `AuditorEncryptedAmount`  | String    | Blob              | No        | Ciphertext for the auditor. Required if `sfAuditorElGamalPublicKey` is present on the issuance. |
| `CredentialIDs`           | Array     | Vector256         | No        | Array of Credential IDs. If present, the transaction can only succeed if the sender is authorized by credentials that match these IDs. |

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code              | Description |
|:----------------------- |:----------- |
| `temDISABLED`           | The ConfidentialTransfer amendment is not enabled. |
| `temMALFORMED`          | The sender is the issuer, or the account attempts to send to itself. |
| `temBAD_CIPHERTEXT`     | The `AuditorEncryptedAmount`, if present, has invalid length or represents an invalid elliptic curve point. |
| `tecNO_TARGET`          | The destination account does not exist. |
| `tecNO_AUTH`            | The issuance does not have the **Can Transfer** flag enabled. |
| `tecNO_PERMISSION`      | The transaction lacks required permissions. This can occur if:<ul><li>The issuance does not have the **Can Privacy** flag enabled.</li><li>One of the participating accounts lacks a registered ElGamal public key or required confidential fields.</li><li>The destination account has Deposit Authorization enabled and the sender is not preauthorized.</li><li>The destination account requires credentials, but the transaction does not include valid matching credentials in the `CredentialIDs` field.</li></ul> |
| `tecNO_ENTRY`           | A credential ID specified in `CredentialIDs` does not exist on the ledger. |
| `tecEXPIRED`            | A credential specified in `CredentialIDs` has expired. |
| `terFROZEN`             | Either the sender or receiver's balance is currently frozen. |
| `tecBAD_PROOF`          | The provided Zero-Knowledge Proof fails to verify equality or range constraints. This can occur if the proof was generated with an outdated `ConfidentialBalanceVersion`. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
