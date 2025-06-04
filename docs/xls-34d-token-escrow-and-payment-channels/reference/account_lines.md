---
html: account_lines.html
parent: account-methods.html
seo:
    description: Get info about an account's trust lines.
labels:
  - Tokens
---
# account_lines

The only substantive change to this reference topic is the addition of the `locked_balance` and `lock_count` fields:

| Field            | Type                 | Required? | Description |
|:-----------------|:---------------------|:----------|:------------|
| `locked_balance` | Object              | No         | The total amount locked in payment channels or escrow. |
| `lock_count` | Number | UInt32         | No         | the total number of lock balances on a RippleState ledger object. |

For the full draft topic in context, see [https://xrpl-dev-portal--token-payment-channels-and-escrows.preview.redocly.app/docs/references/http-websocket-apis/public-api-methods/account-methods/account_lines](https://xrpl-dev-portal--token-payment-channels-and-escrows.preview.redocly.app/docs/references/http-websocket-apis/public-api-methods/account-methods/account_lines).