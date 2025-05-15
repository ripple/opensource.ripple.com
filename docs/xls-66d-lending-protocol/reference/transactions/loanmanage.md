---
seo:
    description: Manages the state of a loan, including defaulting, impairing, or unimpairing a loan.
labels:
  - Transactions
  - Lending Protocol
---
# LoanManage
[[Source]](https://github.com/ "Source")

Manages the state of a `Loan` ledger entry, including defaulting, impairing, or unimpairing a loan.

Only the `LoanBroker` entry owner can initiate this transaction.

_(Requires the [Lending Protocol amendment][] {% not-enabled /%})_

## Example LoanManage JSON

**TODO: Add real example.**
```json
{
  "TransactionType": "LoanManage",
  "Account": "rEXAMPLE9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Fee": "12",
  "Flags": 1,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "LoanID": "E123F4567890ABCDE123F4567890ABCDEF1234567890ABCDEF1234567890ABCD"
}
```

## LoanManage Fields

In addition to the [common fields][], `LoanManage` transactions use the following fields:

| Field Name     | JSON Type | Internal Type | Required? | Description |
|:-------------- |:----------|:-------------|:----------|:------------|
| `LoanID`       | String    | Hash256      | Yes       | The ID of the `Loan` ledger entry to manage. |
| `Flags`        | String    | UInt32       | No        | The flag to modify the loan. |

## LoanManage Flags

| Field Name     | Hex Value | Decimal Value | Description |
|:-------------- |:----------|:-------------|:------------|
| `tfDefault` | `0x0001` | `1` | Indicates the loan is defaulted. |
| `tfImpair` | `0x0002` | `2` | Indicates that the loan is impaired. |
| `tfUnimpair` | `0x0003` | `3` | Indicates that the loan is unimpaired. |

## Error Cases

Besides errors that can occur for all transactions, `LoanManage` transactions can result in the following [transaction result codes][]:

| Error Code                | Description                        |
| :------------------------ | :----------------------------------|
| `TBD`             | A `Loan` entry with the specified ID doesn't exist. |
| `TBD`        | The account submitting the transaction is not the `LoanBroker` owner. |
| `TBD`       | The loan is defaulted. Once a loan is defaulted, it can't be modified. |
| `TBD`          | The loan has already been repaid. |
| `TBD`         | The grace period has not passed for default. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
