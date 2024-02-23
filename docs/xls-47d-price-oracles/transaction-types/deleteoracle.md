---
html: deleteoracle.html 
parent: transaction-types.html
blurb: Delete an existing price oracle.
labels:
  - Oracle
status: not_enabled
---
# DeleteOracle
[[Source]](https://github.com/XRPLF/rippled/blob/bf6f5294a9b83653888600e78da8650896e9d393/src/ripple/app/tx/impl/DeleteOracle.cpp "Source")

<embed src="/snippets/_price-oracles-disclaimer.md" />

Delete an `Oracle` ledger entry.


## Example DeleteOracle JSON

```json
{
  "TransactionType": "DeleteOracle",
  "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
  "OracleDocumentID": 34
}
```


## DeleteOracle Fields

| Field              | JSON Type | Internal Type | Required? | Description |
|--------------------|-----------|---------------|-----------|-------------|
| `Account`          | String    | AccountID     | Yes       | This account must match the account in the `Owner` field of the `Oracle` object. |
| `OracleDocumentID` | String    | UInt32        | Yes       | A unique identifier of the price oracle for the `Account`. |


## Error Cases

Besides errors that can occur for all transactions, `DeleteOracle` transactions can result in the following transaction result codes.

| Error Code    | Description |
|---------------|-------------|
| `tecNO_ENTRY` | The `Oracle` object doesn't exist. |