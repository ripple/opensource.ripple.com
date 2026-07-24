---
seo:
    description: IOU.listOffers lists all open offers in the market for an IOU (both sides of the order book). Read-only.
labels:
  - simpleXRPL
  - SDK
---

# iou.listOffers()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/iou.ts#L130)

List all open offers in the market for this IOU (both sides), tagged buy/sell relative to it.

{% admonition type="info" name="Note" %}
Unlike [token.listOffers](../token/listOffers.md) and [account.listOffers](../account/listOffers.md) — which list a single **account's own** resting offers — `iou.listOffers` reads the whole **order book** for the IOU across all accounts.
{% /admonition %}

## Signature

```ts
iou.listOffers(
  params: IOUListOffersParams,
): Promise<ListOffersResult>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `ticker` | `string` | Yes | The IOU currency code to anchor the book on. |
| `issuer` | `string` | Yes | The IOU issuer's r-address. |

## Returns

Resolves to a `ListOffersResult`:

| Field | Type | Description |
| --- | --- | --- |
| `data` | `readonly OfferSummary[]` | The shaped open offers, tagged buy/sell relative to the IOU. See [token.listOffers](../token/listOffers.md#offersummary) for `OfferSummary`. |

## Underlying XRPL request

Read-only — no signer is required and nothing is submitted. Queries both sides of the order book with [book_offers](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/path-and-order-book-methods/book_offers).

## Example

```ts
const { data } = await client.iou.listOffers({
  ticker: 'USD',
  issuer: 'rIssuer...',
})
```
