---
seo:
    description: IOU.issue bootstraps a new trust-line-based IOU between two environment-sourced accounts via AccountSet and TrustSet transactions.
labels:
  - simpleXRPL
  - SDK
---

# iou.issue()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/iou.ts#L83)

Generate a new trust-line-based IOU between two developer-controlled accounts sourced from the environment.

{% admonition type="info" name="Note" %}
Unlike the other IOU verbs, `issue` takes no `options`. It bootstraps both accounts from the environment: it reads `XRPL_ISSUER_SEED` and `XRPL_HOT_WALLET_SEED`, has the issuer enable rippling, then has the hot wallet extend trust up to the maximum limit. No `Payment` runs, so no value exists yet — use [`IOU.transfer`](transfer.md) to send some.
{% /admonition %}

## Signature

```ts
iou.issue(
  params: IOUIssueParams,
): Promise<SubmissionResult<IOUIssueIntent>>
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `ticker` | `string` | Yes | The currency code: a 3-character ISO-4217-style code or a 40-character hex code. Any other code (e.g. a 5-character ticker) is auto-encoded to the 40-character hex form. |

### Response

Resolves to a `SubmissionResult<IOUIssueIntent>` (from the final step).

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

#### Response values

For `IOU.issue`, the `intent` (`IOUIssueIntent`) carries:

| Field | Type | Description |
| --- | --- | --- |
| `iouID` | `string` | The currency code and issuer of the new IOU, e.g. `USD.rIssuer...`. |

### Underlying XRPL transactors

Runs as an ordered, multi-step sequence (no rollback on partial failure):

1. [`AccountSet`](https://xrpl.org/docs/references/protocol/transactions/types/accountset) — the issuer enables rippling (`defaultRipple`).
2. [`TrustSet`](https://xrpl.org/docs/references/protocol/transactions/types/trustset) — the hot wallet extends trust to the issuer, up to the maximum limit.

Throws an `IntentValidationError` if the required seeds aren't set, or a `MultiStepFailureError` if either step fails.

## Example

```ts
const { intent } = await client.iou.issue({
  ticker: 'USD',
})

console.log(intent.iouID)
```
