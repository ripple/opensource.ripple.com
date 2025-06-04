---
html: escrowcreate.html
parent: transaction-types.html
seo:
    description: Create an escrowed XRP payment.
labels:
  - Escrow
---

# EscrowCreate

The only change to this topic is the description of the `Amount` field.

| Field            | JSON Type | [Internal Type][] | Description               |
|:-----------------|:----------|:------------------|:--------------------------|
| `Amount`         | Object or String    | Amount            | Amount of XRP or fungible tokens to deduct from the sender's balance and escrow. Once escrowed, the payment can either go to the `Destination` address (after the `FinishAfter` time) or be returned to the sender (after the `CancelAfter` time). |

For the full draft topic in context, see [https://xrpl-dev-portal--token-payment-channels-and-escrows.preview.redocly.app/docs/references/protocol/transactions/types/escrowcreate](https://xrpl-dev-portal--token-payment-channels-and-escrows.preview.redocly.app/docs/references/protocol/transactions/types/escrowcreate).