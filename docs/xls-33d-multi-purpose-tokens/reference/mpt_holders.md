---
html: mpt_holders_.html
parent: mpt-methods.html
blurb: Get MPTokenIssuances for a given account and ledger.
labels:
  - Accounts
  - XRP
---

# mpt_holders

For a given `MPTokenIssuanceID` and ledger sequence, `mpt_holders` returns all holders of that MPT and their balance. This method likely returns very large data sets, so you should expect to implement paging via the `marker` field.

## Request Format

*Websocket*

```json
{
  "command": "mpt_holders",
  "mpt_id": "00070C4495F14B0E44F78A264E41713C64B5F89242540EE255534400000000000000",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "mpt_holders",
  "params": [
    {
      "mpt_id": "00070C4495F14B0E44F78A264E41713C64B5F89242540EE255534400000000000000",
      "ledger_index": "validated"
    }
  ]
}
```


The request contains the following parameters:

| Field          | Type                 | Required? | Description |
|:---------------|:---------------------|:----------|-------------|
| `mpt_id`       | string               | Yes       | The `MPTokenIssuance` to query. |
| `ledger_index` | string or number (positive integer) | No | The ledger index of the max ledger to use, ora shortcut string to choose a ledger automatically. You must specify either ledger_index or ledger_hash. |
| `ledger_hash`  | string               | No        | A 20-byte hex string for the ma ledger version to use. You must specify either ledger_index or ledger_hash. |
| `include_deleted` | boolean           | No        | Default `false`. If `true`, include deleted MPTs as well. |
| `marker`       | string               | No        | Used to continue your query where it left off in paginating. |
| `limit`        | number (positive integer) | No   | Specify a limit to the number of MPTs returned. |

## Response Format

```json
{
    "id": 5,
    "status": "success",
    "type": "response",
    "result": {
        "mpt_id": "00070C4495F14B0E44F78A264E41713C64B5F89242540EE255534400000000000000",
        "mpt_holders": {
          "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn": {
             "MPTokenIssuanceID": "00070C4495F14B0E44F78A264E41713C64B5F89242540EE255534400000000000000",
             "Flags": 83659,
             "MPTAmount": "1000",
             "LockedAmount": "0"
          }
        },
        "validated": true
    }
}
```

### Response Fields

The response follows the [standard format][], with the result containing the following fields:

| Field                  | Type    | Description                               |
|:-----------------------|:--------|:------------------------------------------|
| `mpt_id`               | string  | The `MPTokenIssuance` queried.            |
| `mpt_holders`          | object  | A JSON object representing a dictionary of accounts to `MPToken` objects. Includes all fields in the underlying `MPToken` object. |
| `marker`               | string  | Used to continue querying where we left off when paginating. Omitted if there are no more entries after this result. |
