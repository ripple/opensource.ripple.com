---
seo:
    description: Deposits first-loss capital into a `LoanBroker` ledger entry.
labels:
  - Transactions
  - Lending Protocol
---
# LoanBrokerCollateralDeposit
[[Source]](https://github.com/ "Source")

Deposits first-loss capital into a `LoanBroker` ledger entry to provide protection for vault depositors.

Only the owner of the associated `LoanBroker` entry can initiate this transaction.

_(Requires the [Lending Protocol amendment][] {% not-enabled /%})_

## Example LoanBrokerCollateralDeposit JSON

**TODO: Add real example.**
```json
{
  "TransactionType": "LoanBrokerCollateralDeposit",
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

## LoanBrokerCollateralDeposit Fields

In addition to the [common fields][], `LoanBrokerCollateralDeposit` transactions use the following fields:

| Field Name     | JSON Type | Internal Type | Required? | Description |
|:-------------- |:----------|:-------------|:----------|:------------|
| `LoanBrokerID` | String    | Hash256      | Yes       | The ID of the `LoanBroker` ledger entry to deposit to. |
| `Amount`       | Object    | STAmount     | Yes       | The amount of first-loss capital to deposit. |

## Error Cases

Besides errors that can occur for all transactions, `LoanBrokerCollateralDeposit` transactions can result in the following [transaction result codes][]:

| Error Code                | Description                        |
| :------------------------ | :----------------------------------|
| `TBD`             | The `LoanBroker` entry with the specified ID doesn't exist. |
| `TBD`        | The submitter is not the owner of the associated `LoanBroker` entry. |
| `TBD`       | The asset doesn't match the assets in the vault. |
| `TBD`   | The submitter doesn't have sufficient funds for the deposit. |
| `TBD`               | The `Issuer` of the asset has placed a global freeze, or the `LoanBroker` owner account is frozen. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
