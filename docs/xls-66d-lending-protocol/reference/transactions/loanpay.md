---
seo:
    description: Make a payment on an active loan.
labels:
  - Transactions
  - Lending Protocol
---
# LoanPay
[[Source]](https://github.com/XRPLF/rippled/blob/ximinez/lending-XLS-66/src/xrpld/app/tx/detail/LoanPay.cpp "Source")

Makes a payment on an active loan. Only the borrower on the loan can make payments, and payments must meet the minimum amount required for that period.

_(Requires the [Lending Protocol amendment][] {% not-enabled /%})_

## Example {% $frontmatter.seo.title %} JSON

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


## {% $frontmatter.seo.title %} Fields

In addition to the [common fields][], {% code-page-name /%} transactions use the following fields:

| Field Name      | JSON Type | Internal Type | Required? | Description |
|:--------------- |:----------|:-------------|:----------|:------------|
| `LoanID`        | String    | Hash256      | Yes       | The ID of the `Loan` ledger entry to repay. |
| `Amount`        | Number    | Amount       | Yes       | The amount to pay toward the loan. |


## {% $frontmatter.seo.title %} Flags

Transactions of the {% code-page-name /%} type support additional values in the [`flags` field], as follows:

| Flag Name | Hex Value | Decimal Value | Description |
|:----------|:----------|:--------------|:------------|
| `tfLoanOverpayment` | `0x00010000` | 65536 | Indicates that the remaining payment amount should be treated as an overpayment. |


## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code | Description |
|:-----------|:------------|
| `temINVALID` | The `LoanID` field is missing or set to zero. |
| `temBAD_AMOUNT` | The `Amount` field must specify a positive value. |
| `tecNO_ENTRY` | The loan specified by `LoanID` doesn't exist. |
| `tecNO_PERMISSION` | The account submitting the transaction isn't the borrower on the loan. |
| `tecTOO_SOON` | The loan hasn't started yet. |
| `tecKILLED` | The loan is already fully paid. |
| `tecWRONG_ASSET` | The asset specified by `Amount` doesn't match the asset of the loan. |
| `tecFROZEN` | The borrower's account is frozen for the specified asset, or the loan broker's pseudo-account is deep-frozen and can't receive funds. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
