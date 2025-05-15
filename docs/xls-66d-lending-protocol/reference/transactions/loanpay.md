---
seo:
    description: Make a payment on an active loan.
labels:
  - Transactions
  - Lending Protocol
---
# LoanPay
[[Source]](https://github.com/ "Source")

Make a payment on an actie loan.

Payments below the specified minimum amount are rejected, while any funds that exceed the minimum payment are applied to the loan principal.

_(Requires the [Lending Protocol amendment][] {% not-enabled /%})_

## Example LoanPay JSON

**TODO: Add real example.**
```json
{
  "TransactionType": "LoanPay",
  "Account": "rBORROWER9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Fee": "12",
  "Flags": 0,
  "LoanID": "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
  "Amount": 1000,
  "Sequence": 10,
  "LastLedgerSequence": 7108701
}
```

## LoanPay Fields

In addition to the [common fields][], `LoanPay` transactions use the following fields:

| Field Name      | JSON Type | Internal Type | Required? | Description |
|:--------------- |:----------|:-------------|:----------|:------------|
| `LoanID`        | String    | Hash256      | Yes       | The ID of the `Loan` ledger entry to repay. |
| `Amount`        | Number    | Amount       | Yes       | The amount to pay toward the loan. |

## Error Cases

Besides errors that can occur for all transactions, `LoanPay` transactions can result in the following [transaction result codes][]:

| Error Code | Description |
|:-----------|:------------|
| `TBD` | The `Loan` entry with the specified ID doesn't exist or is not active. |
| `TBD` | The account making the payment is not the borrower. |
| `TBD` | The loan is fully paid off already, or the payment amount exceeds the outstanding balance. |
| `TBD` | The _pseudo_account_ of the vault is frozen. |
| `TBD` | The borrower, trustline, or MPToken is frozen. |
| `TBD` | The asset issuer enabled a global freeze. |
| `TBD` | The payment is late and the amount paid isn't enough to cover incurred fees. |
| `TBD` | The payment doesn't meet the periodic payment amount. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
