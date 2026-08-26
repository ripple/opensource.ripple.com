---
seo:
    description: XRP.sellOffer places a DEX order to sell XRP for an IOU, via an OfferCreate transaction.
labels:
  - simpleXRPL
  - SDK
---

# xrp.sellOffer()

[[Source]](https://github.com/ripple/simpleXRPL/blob/95b977b15f8950c5bc076b25165217869c0b06d3/src/verticals/xrp.ts#L189)

Place an order on the decentralized exchange (DEX) to sell XRP.

XRP is the base asset: `amount` is the XRP being sold, and `price` is the counter-asset wanted in return.

## Signature

```ts
xrp.sellOffer(
  params: XrpOfferParams,
  options?: XrpWriteOptions,
): Promise<SubmissionResult<undefined>>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `amount` | `string` | Yes | The amount of XRP to sell, as a decimal string. Must be non-negative, with at most 6 decimal places (1 drop, XRP's smallest unit). |
| `orderType` | `IOUOrderType` | Yes | The order type: `'limit'`, `'market'`, `'fok'`, or `'passive'`. |
| `price` | `XrpOfferPrice` | Yes | What's wanted in return — an MPT or an IOU (see below). |
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

`XRP.sellOffer` attaches no `intent` output; `intent` is `undefined`.

## Underlying XRPL transactor

Builds and submits a single [OfferCreate](https://xrpl.org/docs/references/protocol/transactions/types/offercreate) transaction, with the XRP leg as `TakerGets` and the price as `TakerPays` (and the `tfSell` flag set). Throws an `IntentValidationError` if `price` is MPT-denominated.

## Example

```ts
// Sell 50 XRP, asking 100 USD for it.
await client.xrp.sellOffer({
  amount: '50',
  orderType: 'limit',
  price: { ticker: 'USD', issuer: 'rIssuer...', amount: '100' },
})
```
