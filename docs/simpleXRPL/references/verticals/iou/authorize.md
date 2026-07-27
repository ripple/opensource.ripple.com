---
seo:
    description: IOU.authorize authorizes a holder to hold an IOU via a TrustSet transaction with the authorize flag.
labels:
  - simpleXRPL
  - SDK
---

# iou.authorize()

[[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/iou.ts#L152)

Grant authorization for a holder to hold this IOU. Only meaningful when the issuer's account has `asfRequireAuth` set.

{% admonition type="info" name="Note" %}
There is no matching `unauthorize`: the underlying authorize flag is one-way and cannot be cleared once set. To reversibly block a trust line, use [IOU.lock](lock.md) instead.
{% /admonition %}

## Signature

```ts
iou.authorize(
  params: IOUAuthorizeParams,
  options?: IOUWriteOptions,
): Promise<SubmissionResult<IOUAuthorizeIntent>>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `ticker` | `string` | Yes | The currency code (3-character ISO-4217-style or 40-character hex; other codes are auto-encoded to hex). |
| `holder` | `string` | Yes | The holder's r-address being authorized. |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<IOUAuthorizeIntent>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `IOU.authorize`, the `intent` (`IOUAuthorizeIntent`) echoes:

| Field | Type | Description |
| --- | --- | --- |
| `holder` | `string` | The holder's r-address that was authorized. |

## Underlying XRPL transactor

Builds and submits a single [TrustSet](https://xrpl.org/docs/references/protocol/transactions/types/trustset) transaction with the authorize flag set.

## Example

```ts
await client.iou.authorize({
  ticker: 'USD',
  holder: 'rHolder...',
})
```
