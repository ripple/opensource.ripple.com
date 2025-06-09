---
html: account_channels.html
parent: account-methods.html
seo:
    description: Get a list of payment channels where the account is the source of the channel.
labels:
  - Payment Channels
---
# account_channels

The only substantive change to this topic is the addition of the `amount`, `balance`, and `transfer_rate` fields:

| Field                 | Type                 | Required? | Description |
|:----------------------|:---------------------|:----------|-------------|
| `amount`              | Object or String     | No        | The total amount allocated to this channel. |
| `balance`             | Object or String     | No        | The total amount paid out from this channel, as of the ledger version used. (You can calculate the amount left in the channel by subtracting `balance` from `amount`). |
| `transfer_rate`       | Number               | No        | The fee to charge when users make claims on a payment channel, initially set on the creation of a payment channel and updated on subsequent funding or claim transactions. |

For the full draft topic in context, see [https://xrpl-dev-portal--token-payment-channels-and-escrows.preview.redocly.app/docs/references/http-websocket-apis/public-api-methods/account-methods/account_channels](https://xrpl-dev-portal--token-payment-channels-and-escrows.preview.redocly.app/docs/references/http-websocket-apis/public-api-methods/account-methods/account_channels)