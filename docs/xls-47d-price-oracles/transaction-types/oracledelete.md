---
html: oracledelete.html 
parent: transaction-types.html
blurb: Delete an existing price oracle.
labels:
  - Oracle
status: not_enabled
---
# OracleDelete
[[Source]](https://github.com/XRPLF/rippled/blob/develop/src/ripple/app/tx/impl/DeleteOracle.cpp "Source")

<embed src="/snippets/_price-oracles-disclaimer.md" />

Delete an `Oracle` ledger entry.


## Example OracleDelete JSON

```json
{
  "TransactionType": "OracleDelete",
  "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
  "OracleDocumentID": 34
}
```


## OracleDelete Fields

| Field              | JSON Type | Internal Type | Required? | Description |
|--------------------|-----------|---------------|-----------|-------------|
| `Account`          | String    | AccountID     | Yes       | This account must match the account in the `Owner` field of the `Oracle` object. |
| `OracleDocumentID` | String    | UInt32        | Yes       | A unique identifier of the price oracle for the `Account`. |


## Error Cases

Besides errors that can occur for all transactions, `OracleDelete` transactions can result in the following transaction result codes.

| Error Code    | Description |
|---------------|-------------|
| `tecNO_ENTRY` | The `Oracle` object doesn't exist. |