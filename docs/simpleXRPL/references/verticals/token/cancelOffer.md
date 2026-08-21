---
seo:
    description: Token.cancelOffer cancels a standing DEX offer via an OfferCancel transaction.
labels:
  - simpleXRPL
  - SDK
---

# token.cancelOffer()

[[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/token.ts#L336)

Cancel a standing offer.

## Signature

```ts
token.cancelOffer(
  params: CancelOfferParams,
  options?: TokenWriteOptions,
): Promise<SubmissionResult<
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

For `Token.cancelOffer`, the `intent` echoes:

| Field | Type | Description |
| --- | --- | --- |
| `offerSequence` | `number` | The sequence number of the offer that was canceled. |

## Underlying XRPL transactor

Builds and submits a single [OfferCancel](https://xrpl.org/docs/references/protocol/transactions/types/offercancel) transaction.

## Example

```ts
await client.token.cancelOffer({
  offerSequence: 42,
})
```
