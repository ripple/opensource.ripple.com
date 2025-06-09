---
seo:
    description: This entry represents a trust line, tracking the net balance of tokens between them.
labels:
  - Tokens
---
# RippleState

The only change to this topic is the addition of two new fields:

| Name                | JSON Type | [Internal Type][] | Required? | Description |
|:--------------------|:----------|:--------------|:----------|:------------|
| `LockCount`         | Object or String | Amount | No     | The total number of lock balances on a `RippleState` ledger object. |
| `LockedBalance`     | Object or String | Amount | No     | The total number of locked tokens on a `RippleState` ledger object. |

For the full draft topic in context, see [https://xrpl-dev-portal--token-payment-channels-and-escrows.preview.redocly.app/docs/references/protocol/ledger-data/ledger-entry-types/ripplestate](https://xrpl-dev-portal--token-payment-channels-and-escrows.preview.redocly.app/docs/references/protocol/ledger-data/ledger-entry-types/ripplestate).
