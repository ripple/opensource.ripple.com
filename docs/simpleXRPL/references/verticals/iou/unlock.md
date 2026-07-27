---
seo:
    description: IOU.unlock restores a frozen holder's trust line by clearing deep and individual freeze via TrustSet transactions.
labels:
  - simpleXRPL
  - SDK
---

# iou.unlock()

[[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/iou.ts#L209)

Restore a holder's ability to send and receive this IOU: clears the deep freeze, then the individual freeze.

## Signature

```ts
iou.unlock(
  params: IOULockParams,
  options?: IOUWriteOptions,
): Promise<SubmissionResult<IOULockIntent>>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `ticker` | `string` | Yes | The currency code (3-character ISO-4217-style or 40-character hex; other codes are auto-encoded to hex). |
| `holder` | `string` | Yes | The holder's r-address whose trust line is unlocked. |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<IOULockIntent>` (from the final step).

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `IOU.unlock`, the `intent` (`IOULockIntent`) echoes:

| Field | Type | Description |
| --- | --- | --- |
| `holder` | `string` | The holder's r-address whose trust line was unlocked. |

## Underlying XRPL transactors

Runs as an ordered, multi-step sequence (no rollback on partial failure):

1. [TrustSet](https://xrpl.org/docs/references/protocol/transactions/types/trustset) — clears the deep freeze.
2. [TrustSet](https://xrpl.org/docs/references/protocol/transactions/types/trustset) — clears the individual freeze.

Throws a `MultiStepFailureError` if either step fails.

## Example

```ts
await client.iou.unlock({
  ticker: 'USD',
  holder: 'rHolder...',
})
```
