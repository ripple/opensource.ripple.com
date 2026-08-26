---
seo:
    description: Token.clawback reclaims a holder's MPT balance back to the issuer via a Clawback transaction.
labels:
  - simpleXRPL
  - SDK
---

# token.clawback()

[[Source]](https://github.com/ripple/simpleXRPL/blob/95b977b15f8950c5bc076b25165217869c0b06d3/src/verticals/token.ts#L311)

Reclaim a holder's MPT balance back to the issuer.

{% admonition type="info" name="Note" %}
Requires the issuance to have been created with `canClawback`, the SDK's default in [token.issue](issue.md). The flag is fixed at issuance and cannot be added later.
{% /admonition %}

## Signature

```ts
token.clawback(
  params: TokenClawbackParams,
  options?: TokenWriteOptions,
): Promise<SubmissionResult<{ holder: string; amount: string }>>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `holder` | `string` | Yes | The holder's r-address to claw the balance back from. |
| `amount` | `Amount` | Yes | The MPT amount to claw back; its asset must be an MPT (build it with `mpt()`). |

{% raw-partial file="/docs/_snippets/simplexrpl-amount.md" /%}

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<{ holder: string; amount: string }>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `Token.clawback`, the `intent` echoes:

| Field | Type | Description |
| --- | --- | --- |
| `holder` | `string` | The holder's r-address clawed back from. |
| `amount` | `string` | The amount clawed back, as a decimal string. |

## Underlying XRPL transactor

Builds and submits a single [Clawback](https://xrpl.org/docs/references/protocol/transactions/types/clawback) transaction. Throws an `IntentValidationError` if `amount`'s asset is not an MPT. Use [iou.clawback](../iou/clawback.md) for issued currencies.

## Example

```ts
await client.token.clawback({
  holder: 'rHolder...',
  amount: { asset: mpt('005C...'), value: '100' },
})
```
