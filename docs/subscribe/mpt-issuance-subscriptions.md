---
seo:
    description: Subscribe to Multi-Purpose Token (MPT) issuance updates to monitor transactions affecting specific MPTs.
labels:
  - Tokens
  - Multi-Purpose Tokens
---
# MPT Issuance Subscriptions

The `subscribe` and `unsubscribe` RPC methods have been updated to support monitoring transactions related to Multi-Purpose Token (MPT) issuances. This allows clients to receive real-time notifications about transactions affecting specific MPTs without the need for client-side filtering.

## Subscribe to MPT Issuances

To subscribe to MPT issuance updates, include the `mpt_issuances` field in your `subscribe` request:

| Field            | Type  | Required? | Description |
|:-----------------|:------|:----------|:------------|
| `mpt_issuances`  | Array | No        | Array with unique MPTIssuanceIDs of the MPTs to monitor for validated transactions. The server sends a `mptTransaction` type message whenever a transaction affects at least one of these MPTs. Each MPTIssuanceID must be a 48-character (192-bit) hexadecimal string. |

{% admonition type="info" name="Note" %}
The `mpt_issuances` field only monitors validated transactions. For proposed (unconfirmed) transactions, use the general `transactions_proposed` stream and filter client-side.
{% /admonition %}

### Request Example

```json
{
  "id": "Example subscribe to MPT issuances",
  "command": "subscribe",
  "mpt_issuances": [
    "0000000152E7CD364F869E832EDB806C4A7AD8B3D0C151C5",
    "0003E3B486D3DACD8BB468AB33793B9626BD894A92AB3AB4"
  ]
}
```

## Unsubscribe from MPT Issuances

To stop receiving MPT issuance updates, include the `mpt_issuances` field in your `unsubscribe` request.

| Field            | Type  | Required? | Description |
|:-----------------|:------|:----------|:------------|
| `mpt_issuances`  | Array | No        | Array with unique MPTIssuanceIDs of the MPTs to stop receiving updates for. (This only stops those messages if you previously subscribed to those MPTs specifically. You cannot use this to filter MPTs out of the general transactions stream.) |

### Unsubscribe Request Example

```json
{
  "id": "Example unsubscribe from MPT issuances",
  "command": "unsubscribe",
  "mpt_issuances": [
    "0000000152E7CD364F869E832EDB806C4A7AD8B3D0C151C5"
  ]
}
```
