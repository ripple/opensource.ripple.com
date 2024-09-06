---
html: mptokenissuanceset.html
parent: transaction-types.html
blurb: Set mutable properties for an MPT.
labels:
 - Multi-purpose Tokens, MPTs
---
# MPTokenIssuanceSet

<embed src="/snippets/_mpts-disclaimer.md" />

Use this transaction to update a mutable property for a Multi-purpose Token.

## Example

```json 
{
      "TransactionType": "MPTokenIssuanceSet",
      "Fee": 10,
      "MPTokenIssuanceID": "00070C4495F14B0E44F78A264E41713C64B5F89242540EE255534400000000000000",
      "Flags": 1
}
```

## MPTokenIssuanceSet Fields

{% include '_snippets/tx-fields-intro.md' %}

| Field              | JSON Type           | [Internal Type][] | Description        |
|:-------------------|:--------------------|:------------------|:-------------------|
| `TransactionType`  | object              | UInt16            | Indicates the new transaction type `MPTokenIssuanceSet`. The integer value is 28 (TODO). |
| `MPTokenIssuanceID`| string              | UInt256           | The `MPTokenIssuance` identifier. |
| `MPTokenHolder`    | string              | AccountID         | (Optional) XRPL Address of an individual token holder balance to lock/unlock. If omitted, this transaction applies to all any accounts holding MPTs. |
| `Flag`             | string               | UInt64           | Specifies flags for this transaction. See [MPTokenIssuanceSet Flags](#mptokenissuanceset-flags). |

### MPTokenIssuanceSet Flags

Transactions of the `MPTokenIssuanceSet` type support additional values in the `Flags` field, as follows:

| Flag Name          | Hex Value    | Decimal Value | Description                   |
|:-------------------|:-------------|:--------------|:------------------------------|
| `tfMPTLock`        | `0x0001`     | 1             | If set, indicates that all MPT balances for this asset should be locked. |
| `tfMPTUnlock`      | `0x0002`     | 2             | If set, indicates that all MPT balances for this asset should be unlocked. |
