---
html: mptokenissuancedestroy.html
parent: transaction-types.html
blurb: Remove a Multi-purpose Token from the ledger.
labels:
 - Multi-purpose Tokens, MPTs
---
# MPTokenIssuanceDestroy

<embed src="/snippets/_mpts-disclaimer.md" />

The `MPTokenIssuanceDestroy` transaction is used to remove an `MPTokenIssuance` object from the directory node in which it is being held, effectively removing the token from the ledger ("destroying" it).

If this operation succeeds, the corresponding `MPTokenIssuance` is removed and the owner’s reserve requirement is reduced by one. This operation must fail if there are any holders of the MPT in question.

## Example MPTokenIssuanceDestroy JSON

```json 
{
    "TransactionType": "MPTokenIssuanceDestroy",
    "Fee": 10,
    "MPTokenIssuanceID": "00070C4495F14B0E44F78A264E41713C64B5F89242540EE255534400000000000000"
}
```

## MPTokenIssuanceDestroy Fields

{% include '_snippets/tx-fields-intro.md' %}

| Field               | JSON Type           | [Internal Type][] | Description        |
|:--------------------|:--------------------|:------------------|:-------------------|
| `TransactionType`   | string              | UInt16            | Indicates the new transaction type MPTokenIssuanceDestroy. The integer value is 26 (TODO). |
| `MPTokenIssuanceID` | string              | UInt256           | Identifies the `MPTokenIssuance` object to be removed by the transaction. |
