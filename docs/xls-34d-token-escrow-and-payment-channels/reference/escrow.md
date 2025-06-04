---
seo:
    description: Contains XRP held for a conditional payment.
labels:
  - Escrow
---
# Escrow

The only substantive change in this document is the addition of the `TransferRate` field.

| Name                | JSON Type | Internal Type     | Required? | Description            |
|:--------------------|:----------|:------------------|:----------|:-----------------------|
| `TransferRate`      | Number    | UInt32            | No        | The fee to charge when users finish an escrow, initially set on the creation of an escrow contract and updated on subsequent finish transactions. |

For the full draft topic in context, see [https://xrpl-dev-portal--token-payment-channels-and-escrows.preview.redocly.app/docs/references/protocol/ledger-data/ledger-entry-types/escrow](https://xrpl-dev-portal--token-payment-channels-and-escrows.preview.redocly.app/docs/references/protocol/ledger-data/ledger-entry-types/escrow).