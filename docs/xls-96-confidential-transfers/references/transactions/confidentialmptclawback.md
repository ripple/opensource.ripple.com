---
seo:
    description: Claw back a holder's entire confidential balance, removing it from circulation.
labels:
  - Multi-Purpose Tokens, MPTs, Tokens
  - Confidential Transfers
---
# ConfidentialMPTClawback

[[Source]](https://github.com/XRPLF/rippled/blob/eeb0d15ea97ed506c65406635edf301eff62a6fd/src/libxrpl/tx/transactors/token/ConfidentialMPTClawback.cpp "Source")

Claw back a holder's _entire_ confidential balance (inbox and spending), removing it from circulation.

Unlike a regular [Clawback](https://xrpl.org/docs/references/protocol/transactions/types/clawback), confidential balances are encrypted, so the issuer must provide the plaintext total amount to claw back and a Zero-Knowledge Proof (ZKP) validating the amount.

_(Requires the [ConfidentialTransfers amendment][] {% not-enabled /%})_

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "ConfidentialMPTClawback",
  "Account": "rIssuerAccount...",
  "Holder": "rMaliciousHolder...",
  "MPTokenIssuanceID": "610F33B8EBF7EC795F822A454FB852156AEFE50BE0CB8326338A81CD74801864",
  "MPTAmount": "1000",
  "ZKProof": "a1b2...",
  "Fee": "12",
  "Sequence": 2470665,
  "Flags": 2147483648
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](https://xrpl.org/docs/references/protocol/transactions/common-fields#transaction-common-fields), {% code-page-name /%} transactions use the following fields:

| Field                     | JSON Type | [Internal Type][] | Required? | Description |
|:------------------------- |:--------- |:----------------- |:--------- |:------------|
| `Holder`                  | String    | AccountID         | Yes       | The account from which funds are being clawed back. |
| `MPTokenIssuanceID`       | String    | UInt192           | Yes       | The unique identifier for the MPT issuance. |
| `MPTAmount`               | String    | UInt64            | Yes       | The plaintext total amount being removed. |
| `ZKProof`                 | String    | Blob              | Yes       | A 64-byte compact Clawback sigma proof that proves the issuer's on-ledger encrypted balance mirror (`sfIssuerEncryptedBalance`) encrypts the plaintext `MPTAmount`. |

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code              | Description |
|:----------------------- |:----------- |
| `temDISABLED`           | The ConfidentialTransfer amendment is not enabled. |
| `temMALFORMED`          | The transaction is malformed. This can occur if:<ul><li>The `Account` is not the issuer of the `MPTokenIssuanceID`.</li><li>The `Account` is attempting to claw back from itself.</li><li>The `ZKProof` length is incorrect.</li></ul> |
| `temBAD_AMOUNT`         | `MPTAmount` is zero or exceeds the maximum limits. |
| `tecNO_TARGET`          | The `Holder` account does not exist. |
| `tecOBJECT_NOT_FOUND`   | The `MPTokenIssuance` or the holder's `MPToken` object does not exist. |
| `tecNO_PERMISSION`      | The transaction lacks the required permissions. This can occur if:<ul><li>The issuance does not have the **Can Clawback** flag set.</li><li>The issuance is missing the `sfIssuerEncryptionKey`.</li><li>The holder's `MPToken` is missing the `sfIssuerEncryptedBalance`.</li></ul> |
| `tecINSUFFICIENT_FUNDS` | The `MPTAmount` exceeds the global `sfConfidentialOutstandingAmount`. |
| `tecBAD_PROOF`          | The ZKP fails to prove that the `sfIssuerEncryptedBalance` (the mirror balance) encrypts the plaintext `MPTAmount`. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
