---
seo:
    description: Account.listOffers lists the open DEX offers placed by an account. Read-only.
labels:
  - simpleXRPL
  - SDK
---

# account.listOffers()

[[Source]](https://github.com/ripple/simpleXRPL/blob/95b977b15f8950c5bc076b25165217869c0b06d3/src/verticals/account.ts#L107)

List the open DEX offers placed by an account.

## Signature

```ts
account.listOffers(
  params?: AccountListOffersParams,
): Promise<ListOffersResult>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `account` | `string` | No | The account whose offers to list. Defaults to the primary signer's account. |

## Returns

Resolves to a `ListOffersResult`:

| Field | Type | Description |
| --- | --- | --- |
| `data` | `readonly OfferSummary[]` | The shaped open offers. |

### OfferSummary

Each offer mirrors the `buyOffer` / `sellOffer` input format, so it's composable back into those write operations.

| Field | Type | Description |
| --- | --- | --- |
| `offerSequence` | `number` | The offer's sequence number (pass to `cancelOffer`). |
| `amount` | `string` | The quantity of the base asset being traded, as a decimal string. |
| `price` | `IOUOfferPrice` | What is paid/received for it, in offer-price form. |
| `orderType` | `'limit' \| 'passive'` | Resting offers are `limit`, or `passive` when the passive flag is set. |
| `type` | `'buy' \| 'sell'` | Whether the offer buys or sells the base asset. |

Amounts stay strings rather than being coerced to `number`: these values compose back into [iou.buyOffer](../iou/buyOffer.md) / [iou.sellOffer](../iou/sellOffer.md), and rounding an exact ledger amount through a double would silently change the order you re-place from a read.

## Underlying XRPL request

Read-only — no signer is required and nothing is submitted. Queries the ledger with [account_offers](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/account-methods/account_offers).

## Example

```ts
const { data } = await client.account.listOffers()

for (const offer of data) {
  console.log(offer.offerSequence, offer.type, offer.amount)
}
```
