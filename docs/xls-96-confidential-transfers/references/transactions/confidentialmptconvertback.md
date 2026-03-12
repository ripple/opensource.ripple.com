---
seo:
    description: Convert a confidential MPT balance into a public one.
labels:
  - Multi-Purpose Tokens, MPTs, Tokens
  - Confidential Transfers
---
# ConfidentialMPTConvertBack

[[Source]](https://github.com/XRPLF/rippled/blob/eeb0d15ea97ed506c65406635edf301eff62a6fd/src/libxrpl/tx/transactors/token/ConfidentialMPTConvertBack.cpp "Source")

Convert your confidential MPT balance back to a public balance. This debits the confidential spending balance and credits the public balance with the plaintext amount. For the issuer's _second account_, this returns confidential supply to the issuer account reserve.

_(Requires the [ConfidentialTransfers amendment][] {% not-enabled /%})_

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "ConfidentialMPTConvertBack",
  "Account": "rUserAccount...",
  "MPTokenIssuanceID": "610F33...",
  "MPTAmount": 500,
  "HolderEncryptedAmount": "AD3F...",
  "IssuerEncryptedAmount": "BC2E...",
  "AuditorEncryptedAmount": "C1A9...",
  "BlindingFactor": "12AB...",
  "ZKProof": "ABCD...",
  "BalanceCommitment": "038A...",
  "Fee": "12",
  "Sequence": 2470665,
  "Flags": 2147483648
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](https://xrpl.org/docs/references/protocol/transactions/common-fields#transaction-common-fields), {% code-page-name /%} transactions use the following fields:

| Field                     | JSON Type | [Internal Type][] | Required? | Description |
|:------------------------- |:--------- |:----------------- |:--------- |:------------|
| `MPTokenIssuanceID`       | String    | UInt192           | Yes       | The unique identifier for the MPT issuance. |
| `MPTAmount`               | String    | UInt64            | Yes       | The plaintext amount to credit to the public balance. |
| `HolderEncryptedAmount`   | String    | Blob              | Yes       | 66-byte Ciphertext to be subtracted from the holder's `sfConfidentialBalanceSpending`. |
| `IssuerEncryptedAmount`   | String    | Blob              | Yes       | 66-byte Ciphertext to be subtracted from the issuer's mirror balance. |
| `AuditorEncryptedAmount`  | String    | Blob              | No        | 66-byte Ciphertext for the auditor. Required if `sfAuditorElGamalPublicKey` is present on the issuance. |
| `BlindingFactor`          | String    | Blob              | Yes       | The 32-byte scalar value used to encrypt the amount. Used by validators to verify the ciphertexts match the plaintext `MPTAmount`. |
| `ZKProof`                 | String    | Blob              | Yes       | A bundle containing the Pedersen Linkage Proof (linking the ElGamal balance to the commitment) and the Range Proof. |
| `BalanceCommitment`       | String    | Blob              | Yes       | A 33-byte cryptographic commitment to the user's confidential spending balance. |

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code              | Description |
|:----------------------- |:----------- |
| `temDISABLED`           | The ConfidentialTransfer is not enabled. |
| `temMALFORMED`          | The account is the Issuer, or the `BlindingFactor` is not exactly 32 bytes. |
| `temBAD_CIPHERTEXT`     | Ciphertext lengths or formats are invalid. |
| `temBAD_AMOUNT`         | `MPTAmount` is zero or greater than the maximum allowable supply. |
| `tecOBJECT_NOT_FOUND`   | The `MPToken` or `MPTokenIssuance` does not exist. |
| `tecNO_PERMISSION`      | One of the following occurred:<ul><li>The issuance does not have the **Can Privacy** flag.</li><li>The user's `MPToken` is missing the `ConfidentialBalanceSpending` or `HolderElGamalPublicKey` fields.</li><li>The issuance has `AuditorElGamalPublicKey` set but the transaction does not include `AuditorEncryptedAmount`.</li></ul> |
| `tecINSUFFICIENT_FUNDS` | The global `sfConfidentialOutstandingAmount` is less than the requested `MPTAmount`, or the user's confidential balance is insufficient. |
| `tecBAD_PROOF`          | One of the following occurred:<ul><li>The `BlindingFactor` fails to verify the integrity of the ciphertexts.</li><li>The `ZKProof` fails the Pedersen Linkage check (proving the commitment matches the on-ledger balance).</li><li>The `ZKProof` fails the Range Proof (proving the remaining balance is non-negative).</li></ul> |
| `terFROZEN`             | The account or issuance is frozen. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
