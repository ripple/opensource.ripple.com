---
seo:
    description: IOU.buyOffer places a DEX order to acquire more of this IOU via an OfferCreate transaction.
labels:
  - simpleXRPL
  - SDK
---

# iou.buyOffer()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/iou.ts#L303)

Place an order on the DEX to acquire more of this IOU.

## Signature

```ts
iou.buyOffer(
  params: IOUOfferParams,
  options?: IOUWriteOptions,
): Promise<SubmissionResult<undefined>>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `ticker` | `string` | Yes | The currency code (3-character ISO-4217-style or 40-character hex; other codes are auto-encoded to hex). |
| `amount` | `number` | Yes | The number of units of this IOU to buy. |
| `orderType` | `IOUOrderType` | Yes | The order type: `'limit'`, `'market'`, `'fok'`, or `'passive'`. |
| `price` | `IOUOfferPrice` | Yes | What's offered in payment — XRP, an MPT, or another IOU (see below). |
| `domainID` | `string` | No | Restrict the offer to a permissioned domain. Omit for the open DEX. |
| `hybrid` | `boolean` | No | Whether a domain-scoped offer also works the open DEX. Only meaningful with `domainID`; defaults to `true` when `domainID` is set. |
| `offerSequence` | `number` | No | A prior offer sequence to replace. |

`price` (`IOUOfferPrice`) is one of:

| Shape | Description |
| --- | --- |
| `{ currency: 'XRP'; amount: number }` | Priced in XRP. |
| `{ mptIssuanceId: string; amount: number }` | Priced in an MPT. |
| `{ ticker: string; issuer: string; amount: number }` | Priced in another IOU. |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<undefined>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

`IOU.buyOffer` attaches no `intent` output; `intent` is `undefined`.

## Underlying XRPL transactor

Builds and submits a single [`OfferCreate`](https://xrpl.org/docs/references/protocol/transactions/types/offercreate) transaction. Throws an `IntentValidationError` if `price` is MPT-denominated.

## Example

```ts
await client.iou.buyOffer({
  ticker: 'USD',
  amount: 100,
  orderType: 'limit',
  price: { currency: 'XRP', amount: 50 },
})
```
