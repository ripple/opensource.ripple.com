---
seo:
    description: IOU.sellOffer places a DEX order to sell this IOU via an OfferCreate transaction.
labels:
  - simpleXRPL
  - SDK
---

# iou.sellOffer()

[[Source]](https://github.com/ripple/simpleXRPL/blob/24bdf29e215fd559229e24a9f57505952bfb39f7/src/verticals/iou.ts#L348)

Place an order on the DEX to sell this IOU.

## Signature

```ts
iou.sellOffer(
  params: IOUOfferParams,
  options?: IOUWriteOptions,
): Promise<SubmissionResult<undefined>>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `ticker` | `string` | Yes | The currency code (3-character ISO-4217-style or 40-character hex; other codes are auto-encoded to hex). |
| `amount` | `string` | Yes | The number of units of this IOU to sell, as a decimal string. Must be non-negative, with at most 15 significant digits. |
| `orderType` | `IOUOrderType` | Yes | The order type: `'limit'`, `'market'`, `'fok'`, or `'passive'`. |
| `price` | `IOUOfferPrice` | Yes | What's wanted in return — XRP, an MPT, or another IOU (see below). |
| `domainID` | `string` | No | Restrict the offer to a permissioned domain. Omit for the open DEX. |
| `hybrid` | `boolean` | No | Whether a domain-scoped offer also works the open DEX. Only meaningful with `domainID`; defaults to `true` when `domainID` is set. |
| `offerSequence` | `number` | No | A prior offer sequence to replace. |

`price` (`IOUOfferPrice`) is one of:

| Shape | Description |
| --- | --- |
| `{ currency: 'XRP'; amount: string }` | Priced in XRP. Must be non-negative, with at most 6 decimal places (1 drop, XRP's smallest unit). |
| `{ mptIssuanceId: string; amount: string }` | Priced in an MPT. However, the XRPL DEX doesn't support MPTs yet and will always be rejected. |
| `{ ticker: string; issuer: string; amount: string }` | Priced in another IOU. Must be non-negative, with at most 15 significant digits — the XRPL issued-currency limit. |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<undefined>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

`IOU.sellOffer` attaches no `intent` output; `intent` is `undefined`.

## Underlying XRPL transactor

Builds and submits a single [OfferCreate](https://xrpl.org/docs/references/protocol/transactions/types/offercreate) transaction. Throws an `IntentValidationError` if `price` is MPT-denominated.

## Example

```ts
await client.iou.sellOffer({
  ticker: 'USD',
  amount: '100',
  orderType: 'limit',
  price: { currency: 'XRP', amount: '50' },
})
```
