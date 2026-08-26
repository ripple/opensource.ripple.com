---
seo:
    description: IOU.transfer sends issued-currency value to a destination account via a Payment transaction.
labels:
  - simpleXRPL
  - SDK
---

# iou.transfer()

[[Source]](https://github.com/ripple/simpleXRPL/blob/95b977b15f8950c5bc076b25165217869c0b06d3/src/verticals/iou.ts#L300)

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
| `to` | `string` | Yes | The destination r-address. |
| `amount` | `string` | Yes | The amount to send, as a decimal string (e.g. `'10'`, `'0.25'`). Must be non-negative, with at most 15 significant digits. |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<IOUTransferIntent>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `IOU.transfer`, the `intent` (`IOUTransferIntent`) echoes:

| Field | Type | Description |
| --- | --- | --- |
| `to` | `string` | Destination r-address. |
| `amount` | `string` | Amount sent. |

## Underlying XRPL transactor

Builds and submits a single [Payment](https://xrpl.org/docs/references/protocol/transactions/types/payment) transaction.

## Example

```ts
await client.iou.transfer({
  ticker: 'USD',
  to: 'rHolder...',
  amount: '100',
})
```
