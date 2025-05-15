---
seo:
    description: Draw funds from an active loan.
labels:
  - Transactions
  - Lending Protocol
---
# LoanDraw
[[Source]](https://github.com/ "Source")

Draws funds from an active loan.

Only the loan borrower can submit this transaction.

_(Requires the [Lending Protocol amendment][] {% not-enabled /%})_

## Example LoanDraw JSON

**TODO: Add real example.**
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

## LoanDraw Fields

In addition to the [common fields][], `LoanDraw` transactions use the following fields:

| Field Name      | JSON Type | Internal Type | Required? | Description |
|:--------------- |:----------|:-------------|:----------|:------------|
| `LoanID`        | String    | Hash256      | Yes       | The ID of the `Loan` ledger entry to draw from. |
| `Amount`        | Number    | Amount       | Yes       | The amount to draw from the loan. |

## Error Cases

Besides errors that can occur for all transactions, `LoanDraw` transactions can result in the following [transaction result codes][]:

| Error Code | Description |
|:-----------|:------------|
| `TBD` | The loan hasn't started yet. |
| `TBD` | The `Loan` entry with the specified ID doesn't exist or is not active. |
| `TBD` | The account submitting the transaction is not the borrower. |
| `TBD` | The loan is impaired or defaulted. |
| `TBD` | There are insufficient assets available in the loan. |
| `TBD` | The account or asset is frozen. |
| `TBD` | The borrower missed a payment. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
