---
seo:
    description: Token.createOffer places an offer on the XRP Ledger decentralized exchange via an OfferCreate transaction.
labels:
  - simpleXRPL
  - SDK
---

# token.createOffer()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/token.ts#L299)

Place an offer on the decentralized exchange (DEX).

## Signature

```ts
token.createOffer(
  params: CreateOfferParams,
  options?: TokenWriteOptions,
): Promise<SubmissionResult<undefined>>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `takerGets` | `Amount` | Yes | What the account gives (XRP or IOU — MPT is not DEX-tradeable). |
| `takerPays` | `Amount` | Yes | What the account wants (XRP or IOU). |
| `expiration` | `number` | No | Offer expiration, in seconds since the Ripple epoch. |
| `offerSequence` | `number` | No | A prior offer sequence to replace. |
| `flags` | `OfferFlags` | No | Offer flags (see below). |

The `flags` object accepts:

| Flag | Type | Required | Description |
| --- | --- | --- | --- |
| `passive` | `boolean` | No | Do not consume offers that exactly match. |
| `immediateOrCancel` | `boolean` | No | Consume matching offers immediately; never place the remainder. |
| `fillOrKill` | `boolean` | No | Consume the full amount or cancel entirely. |
| `sell` | `boolean` | No | Interpret the offer as selling `takerGets`. |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<undefined>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

`Token.createOffer` attaches no `intent` output; `intent` is `undefined`.

## Underlying XRPL transactor

Builds and submits a single [OfferCreate](https://xrpl.org/docs/references/protocol/transactions/types/offercreate) transaction. Throws an `IntentValidationError` if either amount is an MPT.

## Example

```ts
await client.token.createOffer({
  takerGets: { asset: XRP_ASSET, value: '10' },
  takerPays: { asset: iou('USD', 'rIssuer...'), value: '5' },
})
```
