---
seo:
    description: Accept a loan proposed by a loan broker.
labels:
    - Lending Protocol
---
# LoanAccept

Accept a pending loan that a loan broker owner proposed with a [LoanSet transaction][]. When the loan is accepted, the principal (minus any origination fee) is paid to the borrower and the loan's payment schedule begins. For more information, see [Two-Step Loan Creation](./two-step-loan-creation.md).

_(Requires the [LendingProtocolV1_2 amendment][])_

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "LoanAccept",
  "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  "LoanID": "A9D6E4F1B0C3E7A2D5F8B1C4E7A0D3F6B9C2E5A8D1F4B7C0E3A6D9F2B5C8E1A4",
  "Fee": "10",
  "Flags": 0,
  "Sequence": 12
}
```

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field    | JSON Type         | [Internal Type][] | Required? | Description |
| :------- | :---------------- | :---------------- | :-------- | :---------- |
| `LoanID` | String            | Hash256           | Yes       | The ledger entry ID of the pending loan to accept. |

Only the `Borrower` named in the pending loan can send this transaction, and it must be sent before the loan's `StartDate`. If the transaction fails, the loan remains pending and the borrower can try again.

`LoanAccept` performs the same freeze, authorization, and [private loan broker](./private-loan-brokers.md) checks as `LoanSet`, since the borrower's status may have changed after the loan was proposed.

This transaction can't be [delegated](https://xrpl.org/docs/concepts/accounts/permission-delegation).

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes][]:

| Error Code                | Description |
| :------------------------ | :---------- |
| `temDISABLED`             | The `LendingProtocolV1_2` amendment isn't enabled. |
| `temINVALID`              | The `LoanID` is all zeros. |
| `tecNO_ENTRY`             | The loan doesn't exist. |
| `tecNO_PERMISSION`        | The loan isn't pending, or the sender isn't the loan's `Borrower`. |
| `tecEXPIRED`              | <li>The loan's `StartDate` has passed.</li><li>The vault is closed-ended and has entered its _Redemption_ phase.</li><li>The loan broker is private and the borrower's only matching credentials have expired.</li> |
| `tecLIMIT_EXCEEDED`       | Accepting the loan would push the vault past its [fixed-precision size limit](./fixed-precision-vaults.md#size-limit). |
| `tecFROZEN`               | The vault asset is frozen for the borrower, the vault, or the loan broker. |
| `tecLOCKED`               | The vault asset is an MPT that is locked for the borrower, the vault, or the loan broker. |
| `tecNO_AUTH`              | <li>The borrower or loan broker owner isn't authorized to hold the vault asset.</li><li>The loan broker is private and the borrower doesn't hold an accepted credential for its domain.</li> |
| `tecOBJECT_NOT_FOUND`     | The loan broker is private and its permissioned domain no longer exists. |
| `tecINSUFFICIENT_RESERVE` | The borrower doesn't have enough XRP to meet the reserve for the `Loan` entry. |

## See Also

- [Loan entry][]
- [LoanSet transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
