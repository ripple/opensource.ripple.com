---
seo:
    description: IOU.transfer sends issued-currency value to a destination account via a Payment transaction.
labels:
  - simpleXRPL
  - SDK
---

# iou.transfer()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/iou.ts#L267)

Send a specified amount of this IOU to a destination account.

## Signature

```ts
iou.transfer(
  params: IOUTransferParams,
  options?: IOUWriteOptions,
): Promise<SubmissionResult<IOUTransferIntent>>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `ticker` | `string` | Yes | The currency code (3-character ISO-4217-style or 40-character hex; other codes are auto-encoded to hex). |
| `destination` | `string` | Yes | The destination r-address. |
| `amount` | `number` | Yes | The amount to send. |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<IOUTransferIntent>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `IOU.transfer`, the `intent` (`IOUTransferIntent`) echoes:

| Field | Type | Description |
| --- | --- | --- |
| `destination` | `string` | Destination r-address. |
| `amount` | `number` | Amount sent. |

## Underlying XRPL transactor

Builds and submits a single [`Payment`](https://xrpl.org/docs/references/protocol/transactions/types/payment) transaction.

## Example

```ts
await client.iou.transfer({
  ticker: 'USD',
  destination: 'rHolder...',
  amount: 100,
})
```
