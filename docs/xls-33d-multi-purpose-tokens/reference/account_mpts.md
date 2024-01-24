---
html: mpts_by_issuer.html
parent: mpt-methods.html
blurb: Get MPTokenIssuances for a given account and ledger.
labels:
  - Accounts
  - XRP
---

# account_mpts

Returns all MPT balances held by a given account and ledger.

## Request Format

*Websocket*

```json
{
  "command": "account_mpts",
  "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "account_mpts",
  "params": [
    {
      "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "ledger_index": "validated"
    }
  ]
}
```

The request contains the following parameters:

| Field          | Type                 | Required? | Description |
|:---------------|:---------------------|:----------|-------------|
| `account`      | string               | Yes       | The account to query. |
| `ledger_index` | string or number (positive integer) | No | The ledger index of the max ledger to use, or a shortcut string to choose a ledger automatically. You must specify either `ledger_index` or `ledger_hash`. |
| `ledger_hash`  | string               | No        | A 20-byte hex string for the max ledger version to use. You must specify either `ledger_index` or `ledger_hash`. |
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
        "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "mpts": [
           {
             "MPTokenIssuanceID": "00070C4495F14B0E44F78A264E41713C64B5F89242540EE255534400000000000000",
             "Flags": 83659,
             "MPTAmount": "1000",
             "LockedAmount": "0"
           }
        ],
        "validated": true
    }
}
```

### Response Fields

The response follows the [standard format][], with the result containing the following fields:

| Field                  | Type    | Description                               |
|:-----------------------|:--------|:------------------------------------------|
| `mpts`                 | array   | An array of `MPToken` objects owned by the specified account. Includes all fields in the underlying object. |
| `marker`               | string  | Used to continue your query where it left off in paginating. |

