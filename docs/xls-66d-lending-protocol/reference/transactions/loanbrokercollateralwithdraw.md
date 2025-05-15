---
seo:
    description: Withdraws first-loss capital from a `LoanBroker` ledger entry.
labels:
  - Transactions
  - Lending Protocol
---
# LoanBrokerCollateralWithdraw
[[Source]](https://github.com/ "Source")

Withdraws first-loss capital from a `LoanBroker` ledger entry.

Only the owner of the associated `LoanBroker` entry can initiate this transaction.

_(Requires the [Lending Protocol amendment][] {% not-enabled /%})_

## Example LoanBrokerCollateralWithdraw JSON

**TODO: Add real example.**
```json
{
  "TransactionType": "LoanBrokerCollateralWithdraw",
  "Account": "rEXAMPLE9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "LoanBrokerID": "E123F4567890ABCDE123F4567890ABCDEF1234567890ABCDEF1234567890ABCD",
  "Amount": {
    "currency": "USD",
    "issuer": "rIssuer1234567890abcdef1234567890abcdef",
    "value": "1000"
  }
}
```

## LoanBrokerCollateralWithdraw Fields

In addition to the [common fields][], `LoanBrokerCollateralWithdraw` transactions use the following fields:

| Field Name     | JSON Type | Internal Type | Required? | Description |
|:-------------- |:----------|:-------------|:----------|:------------|
| `LoanBrokerID` | String    | Hash256      | Yes       | The ID of the `LoanBroker` ledger entry to withdraw from. |
| `Amount`       | Object    | STAmount     | Yes       | The amount of first-loss capital to withdraw. |

## Error Cases

Besides errors that can occur for all transactions, `LoanBrokerCollateralWithdraw` transactions can result in the following [transaction result codes][]:

| Error Code                | Description                        |
| :------------------------ | :----------------------------------|
| `TBD`             | The `LoanBroker` with the specified ID doesn't exist. |
| `TBD`        | The submitter is not the owner of the associated `LoanBroker` ledger entry. |
| `TBD`       | The submitter is attempting to withdraw an asset that doesn't match the asset of the vault. |
| `TBD`   | There isn't enough first-loss capital available to withdraw. |
| `TBD`               | The `Issuer` of the asset has placed a global freeze, or the `LoanBroker` owner account is frozen. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
