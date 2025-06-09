---
seo:
    description: A channel for asynchronous XRP payments.
labels:
  - Payment Channels
---
# PayChannel

The only substantive changes to this topic are the replacement of "XRP" with "XRP or tokens" or "amount."

There is one new field, `TransferRate`.

| Name                | JSON Type | [Internal Type][] | Required? | Description            |
|:--------------------|:----------|:------------------|:----------|:-----------------------|
| `TransferRate`      | Number    | UInt32            | No        | The fee to charge when users make claims on a payment channel, initially set on the creation of a payment channel and updated on subsequent funding or claim transactions. |

For the full draft topic in context, see [https://xrpl-dev-portal--token-payment-channels-and-escrows.preview.redocly.app/docs/references/protocol/ledger-data/ledger-entry-types/paychannel](https://xrpl-dev-portal--token-payment-channels-and-escrows.preview.redocly.app/docs/references/protocol/ledger-data/ledger-entry-types/paychannel).