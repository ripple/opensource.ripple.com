---
seo:
    description: IOU.lock freezes a holder's trust line via individual and deep freeze TrustSet transactions.
labels:
  - SDKs
---

# iou.lock()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/iou.ts#L187)

Freeze a holder's ability to send and receive this IOU: an individual freeze followed by a deep freeze.

## Signature

```ts
iou.lock(
  params: IOULockParams,
  options?: IOUWriteOptions,
): Promise<SubmissionResult<IOULockIntent>>
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `ticker` | `string` | Yes | The currency code (3-character ISO-4217-style or 40-character hex; other codes are auto-encoded to hex). |
| `holder` | `string` | Yes | The holder's r-address whose trust line is locked. |

### Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

### Response

Resolves to a `SubmissionResult<IOULockIntent>` (from the final step).

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

#### Response values

For `IOU.lock`, the `intent` (`IOULockIntent`) echoes:

| Field | Type | Description |
| --- | --- | --- |
| `holder` | `string` | The holder's r-address whose trust line was locked. |

### Underlying XRPL transactors

Runs as an ordered, multi-step sequence (no rollback on partial failure):

1. [`TrustSet`](https://xrpl.org/docs/references/protocol/transactions/types/trustset) — sets the individual freeze.
2. [`TrustSet`](https://xrpl.org/docs/references/protocol/transactions/types/trustset) — sets the deep freeze.

Throws a `MultiStepFailureError` if either step fails.

## Example

```ts
await client.iou.lock({
  ticker: 'USD',
  holder: 'rHolder...',
})
```
