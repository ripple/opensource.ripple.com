---
seo:
    description: XRP.buyOffer places a DEX order to acquire XRP, priced in an IOU, via an OfferCreate transaction.
labels:
  - simpleXRPL
  - SDK
---

# xrp.buyOffer()

[[Source]](https://github.com/ripple/simpleXRPL/blob/24bdf29e215fd559229e24a9f57505952bfb39f7/src/verticals/xrp.ts#L174)

Place an order on the decentralized exchange (DEX) to acquire XRP.

XRP is the base asset: `amount` is the XRP being bought, and `price` is the counter-asset paid for it.

## Signature

```ts
xrp.buyOffer(
  params: XrpOfferParams,
  options?: XrpWriteOptions,
): Promise<SubmissionResult<undefined>>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `amount` | `string` | Yes | The amount of XRP to buy, as a decimal string. Must be non-negative, with at most 6 decimal places (1 drop, XRP's smallest unit). |
| `orderType` | `IOUOrderType` | Yes | The order type: `'limit'`, `'market'`, `'fok'`, or `'passive'`. |
| `price` | `XrpOfferPrice` | Yes | What's offered in payment — an MPT or an IOU (see below). |
| `domainID` | `string` | No | Restrict the offer to a permissioned domain. Omit for the open DEX. |
| `hybrid` | `boolean` | No | Whether a domain-scoped offer also works the open DEX. Only meaningful with `domainID`; defaults to `true` when `domainID` is set. |
| `offerSequence` | `number` | No | A prior offer sequence to replace. |

`price` (`XrpOfferPrice`) is one of:

| Shape | Description |
| --- | --- |
| `{ ticker: string; issuer: string; amount: string }` | Priced in an IOU. Must be non-negative, with at most 15 significant digits — the XRPL issued-currency limit. |
| `{ mptIssuanceId: string; amount: string }` | Priced in an MPT. However, the XRPL DEX doesn't support MPTs yet and will always be rejected. |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<undefined>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

`XRP.buyOffer` attaches no `intent` output; `intent` is `undefined`.

## Underlying XRPL transactor

Builds and submits a single [OfferCreate](https://xrpl.org/docs/references/protocol/transactions/types/offercreate) transaction, with the XRP leg as `TakerPays` and the price as `TakerGets`. Throws an `IntentValidationError` if `price` is MPT-denominated.

## Example

```ts
// Buy 50 XRP, paying 100 USD for it.
await client.xrp.buyOffer({
  amount: '50',
  orderType: 'limit',
  price: { ticker: 'USD', issuer: 'rIssuer...', amount: '100' },
})
```
