---
seo:
    description: Draw funds from an active loan.
labels:
  - Transactions
  - Lending Protocol
---
# LoanDraw
[[Source]](https://github.com/XRPLF/rippled/blob/ximinez/lending-XLS-66/src/xrpld/app/tx/detail/LoanDraw.cpp "Source")

Draws funds from an active loan. Only the loan borrower can submit this transaction.

_(Requires the [Lending Protocol amendment][] {% not-enabled /%})_

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "LoanDraw",
  "Account": "rBORROWER9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Fee": "12",
  "Flags": 0,
  "LoanID": "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
  "Amount": 1000,
  "Sequence": 9,
  "LastLedgerSequence": 7108700
}
```


## {% $frontmatter.seo.title %} Fields

In addition to the [common fields][], {% code-page-name /%} transactions use the following fields:

| Field Name      | JSON Type | Internal Type | Required? | Description |
|:--------------- |:----------|:-------------|:----------|:------------|
| `LoanID`        | String    | Hash256      | Yes       | The ID of the `Loan` ledger entry to draw from. |
| `Amount`        | Number    | Amount       | Yes       | The amount to draw from the loan. |


## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code                | Description |
|:--------------------------|:------------|
| `temINVALID`              | The `LoanID` field is missing or set to zero. |
| `temBAD_AMOUNT`           | The `Amount` field must specify a positive value. |
| `tecNO_ENTRY`             | The loan specified by `LoanID` doesn't exist. |
| `tecNO_PERMISSION`        | The account attempting to draw funds isn't the borrower for the specified loan<br>- The loan can't be drawn from because it's impaired or defaulted<br>- Repayments are overdue and additional funds can't be drawn until payments are made. |
| `tecTOO_SOON`             | The loan hasn't started yet. |
| `tecWRONG_ASSET`          | The specified asset in `Amount` doesn't match the asset from the loan's vault. |
| `tecINSUFFICIENT_FUNDS`   | The requested draw amount is greater than the assets available in the loan. |
| `tecFROZEN`               | The borrower's account is deep-frozen or the loan broker's pseudo-account is frozen. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
