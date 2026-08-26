---
seo:
    description: XRP.cancelOffer cancels a standing DEX offer placed by the acting account via an OfferCancel transaction.
labels:
  - simpleXRPL
  - SDK
---

# xrp.cancelOffer()

[[Source]](https://github.com/ripple/simpleXRPL/blob/95b977b15f8950c5bc076b25165217869c0b06d3/src/verticals/xrp.ts#L205)

Cancel a standing offer placed by the acting account.

{% admonition type="info" name="Note" %}
`OfferCancel` names only a sequence number, so this cancels any offer the acting account owns — not just XRP-denominated ones. [iou.cancelOffer](../iou/cancelOffer.md) is the same operation reached through the IOU vertical.
{% /admonition %}

## Signature

```ts
xrp.cancelOffer(
  params: XrpCancelOfferParams,
  options?: XrpWriteOptions,
): Promise<SubmissionResult<{ offerSequence: number }>>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `offerSequence` | `number` | Yes | The sequence number of the offer to cancel. |

Read a sequence number back with [account.listOffers](../account/listOffers.md).

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<{ offerSequence: number }>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `XRP.cancelOffer`, the `intent` echoes:

| Field | Type | Description |
| --- | --- | --- |
| `offerSequence` | `number` | The sequence number of the offer that was canceled. |

## Underlying XRPL transactor

Builds and submits a single [OfferCancel](https://xrpl.org/docs/references/protocol/transactions/types/offercancel) transaction.

## Example

```ts
await client.xrp.cancelOffer({
  offerSequence: 42,
})
```
