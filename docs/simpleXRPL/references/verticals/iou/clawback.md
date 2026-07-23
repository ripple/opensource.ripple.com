---
seo:
    description: IOU.clawback reclaims a holder's balance back to the issuer via a Clawback transaction.
labels:
  - simpleXRPL
  - SDK
---

# iou.clawback()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/iou.ts#L234)

Reclaim a holder's balance back to the issuer.

{% admonition type="info" name="Note" %}
Verifies the issuer has `asfAllowTrustLineClawback` enabled first (a ledger read), throwing a clear error if not. That flag can only be enabled before the issuer owns any trust lines, offers, or other ledger objects, which this SDK does not itself pre-check.
{% /admonition %}

## Signature

```ts
iou.clawback(
  params: IOUClawbackParams,
  options?: IOUWriteOptions,
): Promise<SubmissionResult<IOUClawbackIntent>>
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `ticker` | `string` | Yes | The currency code (3-character ISO-4217-style or 40-character hex; other codes are auto-encoded to hex). |
| `holder` | `string` | Yes | The holder's r-address to claw the currency back from. |
| `amount` | `number` | Yes | The amount to claw back. |

### Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

### Response

Resolves to a `SubmissionResult<IOUClawbackIntent>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

#### Response values

For `IOU.clawback`, the `intent` (`IOUClawbackIntent`) echoes:

| Field | Type | Description |
| --- | --- | --- |
| `holder` | `string` | The holder's r-address clawed back from. |
| `amount` | `number` | The amount clawed back. |

### Underlying XRPL transactor

Builds and submits a single [`Clawback`](https://xrpl.org/docs/references/protocol/transactions/types/clawback) transaction.

## Example

```ts
await client.iou.clawback({
  ticker: 'USD',
  holder: 'rHolder...',
  amount: 50,
})
```
