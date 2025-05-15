---
seo:
    description: Deletes a `LoanBroker` ledger entry.
labels:
  - Transactions
  - Lending Protocol
---
# LoanBrokerDelete
[[Source]](https://github.com/ "Source")

Deletes a `LoanBroker` ledger entry. Only the owner of the `LoanBroker` entry can delete it.

Only the owner of the associated `LoanBroker` can initiate this transaction.

_(Requires the [Lending Protocol amendment][] {% not-enabled /%})_

## Example LoanBrokerDelete JSON

**TODO: Add real example.**
```json
{
  "TransactionType": "LoanBrokerDelete",
  "Account": "rEXAMPLE9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "LoanBrokerID": "E123F4567890ABCDE123F4567890ABCDEF1234567890ABCDEF1234567890ABCD"
}
```

## LoanBrokerDelete Fields

In addition to the [common fields][], `LoanBrokerDelete` transactions use the following fields:

| Field Name     | JSON Type | Internal Type | Required? | Description |
|:-------------- |:----------|:-------------|:----------|:------------|
| `LoanBrokerID` | String    | Hash256      | Yes       | The ID of the `LoanBroker` entry to delete. |

## Error Cases

Besides errors that can occur for all transactions, `LoanBrokerDelete` transactions can result in the following [transaction result codes][]:

| Error Code                | Description                        |
| :------------------------ | :----------------------------------|
| `TBD`             | A `LoanBroker` entry with the specified ID does not exist. |
| `TBD`        | The submitter is not the owner of the `LoanBroker` entry. |
| `TBD`            | The `OwnerCount` field is greater than zero (active loans exist). |
| `TBD`            | `CoverAvailable` is greater than zero (first-loss capital remains). |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
