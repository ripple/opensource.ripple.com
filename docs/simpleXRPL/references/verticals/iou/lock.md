---
seo:
    description: IOU.lock freezes a holder's trust line via individual and deep freeze TrustSet transactions.
labels:
  - simpleXRPL
  - SDK
---

# iou.lock()

[[Source]](https://github.com/ripple/simpleXRPL/blob/95b977b15f8950c5bc076b25165217869c0b06d3/src/verticals/iou.ts#L220)

Freeze a holder's ability to send and receive this IOU: an individual freeze followed by a deep freeze.

## Signature

```ts
iou.lock(
  params: IOULockParams,
  options?: IOUWriteOptions,
): Promise<SubmissionResult<IOULockIntent>>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `ticker` | `string` | Yes | The currency code (3-character ISO-4217-style or 40-character hex; other codes are auto-encoded to hex). |
| `holder` | `string` | Yes | The holder's r-address whose trust line is locked. |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<IOULockIntent>` (from the final step).

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `IOU.lock`, the `intent` (`IOULockIntent`) echoes:

| Field | Type | Description |
| --- | --- | --- |
| `holder` | `string` | The holder's r-address whose trust line was locked. |

## Underlying XRPL transactors

Runs as an ordered, multi-step sequence (no rollback on partial failure):

1. [TrustSet](https://xrpl.org/docs/references/protocol/transactions/types/trustset) — sets the individual freeze.
2. [TrustSet](https://xrpl.org/docs/references/protocol/transactions/types/trustset) — sets the deep freeze.

Throws a `MultiStepFailureError` if either step fails.

## Example

```ts
await client.iou.lock({
  ticker: 'USD',
  holder: 'rHolder...',
})
```
