---
seo:
    description: Delete a `Loan` ledger entry.
labels:
  - Transactions
  - Lending Protocol
---
# LoanDelete
[[Source]](https://github.com/ "Source")

Deletes a `Loan` ledger entry.

Only the loan broker or borrower can initiate this transaction.

_(Requires the [Lending Protocol amendment][] {% not-enabled /%})_

## Example LoanDelete JSON

**TODO: Add real example.**
```json
{
  "TransactionType": "LoanDelete",
  "Account": "rEXAMPLE9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "LoanID": "E123F4567890ABCDE123F4567890ABCDEF1234567890ABCDEF1234567890ABCD"
}
```

## LoanDelete Fields

In addition to the [common fields][], `LoanDelete` transactions use the following fields:

| Field Name     | JSON Type | Internal Type | Required? | Description |
|:-------------- |:----------|:-------------|:----------|:------------|
| `LoanID`       | String    | Hash256      | Yes       | The ID of the `Loan` ledger entry to delete. |

## Error Cases

Besides errors that can occur for all transactions, `LoanDelete` transactions can result in the following [transaction result codes][]:

| Error Code                | Description                        |
| :------------------------ | :----------------------------------|
| `TBD`             | A `Loan` entry with the specified ID does not exist. |
| `TBD`        | The account submitting the transaction isn't the loan broker or borrower. |
| `TBD`          | The loan still has payments remaining.. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
