---
html: mpts_by_issuer.html
parent: mpt-methods.html
blurb: Get MPTokenIssuances for a given account and ledger.
labels:
  - Accounts
  - XRP
---

# mpts_by_issuer

Returns all `MPTokenIssuances` created by a given account and ledger, including any deleted `MPTokenIssuances`. Deleted `MPTokenIssuances` might have the same ID as new `MPTokenIssuances`.

## Request Format

*Websocket*

```json
{
  "command": "mpts_by_isssuer",
  "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "ledger_index": "validated",
  "include_deleted": true
}
```

*JSON-RPC*

```json
{
  "method": "mpts_by_issuer",
  "params": [
    {
      "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "ledger_index": "validated",
      "include_deleted": true
    }
  ]
}
```
The request contains the following parameters:

| `Field`        | Type                 | Required? | Description |
|:---------------|:---------------------|:----------|-------------|
| `issuer`       | string               | Yes       | The MPT issuer to query. |
| `ledger_index` | string or number (positive integer) | No | The ledger index of the max ledger to use, ora shortcut string to choose a ledger automatically. You must specify either ledger_index or ledger_hash. |
| `ledger_hash`  | string               | No        | A 20-byte hex string for the ma ledger version to use. You must specify either ledger_index or ledger_hash. |
| `include_deleted` | boolean           | No        | Default `false`. If `true`, include deleted MPTs as well. |
| `marker`       | string               | No        | Used to continue your query where it left off in paginating. |
| `limit`        | number (positive integer) | No   | Specify a limit to the number of MPTs returned. |

## Response Format

### Sample Response

An example of a successful response:

```json
{
    "id": 5,
    "status": "success",
    "type": "response",
    "result": {
        "mpt_issuances": [
           {
             "MPTokenIssuanceID": "00070C4495F14B0E44F78A264E41713C64B5F89242540EE255534400000000000000",
             "Flags": 83659,
             "Issuer": ......,
             "AssetScale": .....,
             "MaximumAmount": .....,
             "OutstandingAmount": ....,
             "LockedAmount": .....,
             "TransferFee": .....,
             "MPTokenMetadata": ....,
             "ledger_index": 11231
           }
        ],
        "validated": true
    }
}
```

### Response Fields

The response follows the [standard format][], with the result containing the following fields:

| `Field`                | Type    | Description                               |
|:-----------------------|:--------|:------------------------------------------|
| `mpt_issuances`        | array   | An array of `MPTokenIssuance` objects created by the specified account. Includes all fields in the existing underlying object, `ledger_index` for the index at which this MPT was last modified. For a deleted object, only `MPTokenIssuanceID` and `deleted_ledger_index` for the index at which this MPT was deleted are shown. |
| `marker`               | string  | Used to continue querying where we left off when paginating. Omitted if there are no more entries after this result. |
