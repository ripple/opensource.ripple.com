---
seo:
    description: IOU.listOffers lists all open offers in the market for an IOU (both sides of the order book). Read-only.
labels:
  - simpleXRPL
  - SDK
---

# iou.listOffers()

[[Source]](https://github.com/ripple/simpleXRPL/blob/24bdf29e215fd559229e24a9f57505952bfb39f7/src/verticals/iou.ts#L161)

List all open offers in the market for this IOU (both sides), tagged buy/sell relative to it.

{% admonition type="info" name="Note" %}
Unlike [account.listOffers](../account/listOffers.md) — which lists a single **account's own** resting offers — `iou.listOffers` reads the whole **order book** for the IOU across all accounts.
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
| `data` | `readonly OfferSummary[]` | The shaped open offers, tagged buy/sell relative to the IOU. See [account.listOffers](../account/listOffers.md#offersummary) for `OfferSummary`. |

## Underlying XRPL request

Read-only — no signer is required and nothing is submitted. Queries both sides of the order book with [book_offers](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/path-and-order-book-methods/book_offers).

## Example

```ts
const { data } = await client.iou.listOffers({
  ticker: 'USD',
  issuer: 'rIssuer...',
})
```
