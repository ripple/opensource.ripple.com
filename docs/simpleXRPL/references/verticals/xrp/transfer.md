---
seo:
    description: XRP.transfer sends native XRP from one account to another via a Payment transaction.
labels:
  - simpleXRPL
  - SDK
---

# xrp.transfer()

[[Source]](https://github.com/ripple/simpleXRPL/blob/95b977b15f8950c5bc076b25165217869c0b06d3/src/verticals/xrp.ts#L144)

Send native XRP from one account to another.

## Signature

```ts
xrp.transfer(
  params: XrpTransferParams,
  options?: XrpTransferOptions,
): Promise<SubmissionResult<XrpTransferIntent>>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `to` | `string` | Yes | Destination account XRPL address. |
| `amount` | `string` | Yes | Amount to send, as a decimal string in XRP (e.g. `'10'`, `'0.25'`). Must be non-negative, with at most 6 decimal places (1 drop, XRP's smallest unit). |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<XrpTransferIntent>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `XRP.transfer`, the `intent` (`XrpTransferIntent`) carries:

| Field | Type | Description |
| --- | --- | --- |
| `to` | `string` | Destination r-address. |
| `amount` | `string` | Amount sent, in XRP. |

## Underlying XRPL transactor

Builds and submits a single [Payment](https://xrpl.org/docs/references/protocol/transactions/types/payment) transaction.

## Example

```ts
const result = await client.xrp.transfer({
  to: 'rDestination...',
  amount: '10',
})

console.log(result.txHash)
```
