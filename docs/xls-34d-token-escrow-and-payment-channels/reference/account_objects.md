---
html: account_objects.html
parent: account-methods.html
seo:
    description: Get all ledger objects owned by an account.
labels:
  - Accounts
  - Data Retention
---
# account_objects

The only substantive changes to this reference document is the addition of the `amount` and `transfer_rate` fields:

| `Field`                  | Type             | Required? | Description |
|:-------------------------|:-----------------|:----------|-------------|
| `amount`                 | Object or String | No        | The amount to be delivered by the held payment. |
| `transfer_rate`          | Number           | No        | The fee to charge when users finish an escrow, initially set on the creation of an escrow contract, and updated on subsequent finish transactions. |

For the full draft topic in context, see [https://xrpl-dev-portal--token-payment-channels-and-escrows.preview.redocly.app/docs/references/http-websocket-apis/public-api-methods/account-methods/account_objects](https://xrpl-dev-portal--token-payment-channels-and-escrows.preview.redocly.app/docs/references/http-websocket-apis/public-api-methods/account-methods/account_objects).
