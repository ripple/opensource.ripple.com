---
seo:
    description: IOU.cancelOffer cancels a standing DEX offer placed by the issuer via an OfferCancel transaction.
labels:
  - simpleXRPL
  - SDK
---

# iou.cancelOffer()

[[Source]](https://github.com/ripple/simpleXRPL/blob/24bdf29e215fd559229e24a9f57505952bfb39f7/src/verticals/iou.ts#L364)

Cancel a standing offer placed by this IOU's issuer.

## Signature

```ts
iou.cancelOffer(
  params: IOUCancelOfferParams,
  options?: IOUWriteOptions,
): Promise<SubmissionResult>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `offerSequence` | `number` | Yes | The sequence number of the offer to cancel. |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<{ offerSequence: number }>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `IOU.cancelOffer`, the `intent` echoes:

| Field | Type | Description |
| --- | --- | --- |
| `offerSequence` | `number` | The sequence number of the offer that was canceled. |

## Underlying XRPL transactor

Builds and submits a single [OfferCancel](https://xrpl.org/docs/references/protocol/transactions/types/offercancel) transaction.

## Example

```ts
await client.iou.cancelOffer({
  offerSequence: 42,
})
```
