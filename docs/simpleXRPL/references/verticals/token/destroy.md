---
seo:
    description: Token.destroy destroys an MPT issuance via an MPTokenIssuanceDestroy transaction.
labels:
  - simpleXRPL
  - SDK
---

# token.destroy()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/token.ts#L239)

Destroy an MPT issuance. Only succeeds when no tokens are outstanding.

## Signature

```ts
token.destroy(
  params: MptDestroyParams,
  options?: TokenWriteOptions,
): Promise<SubmissionResult<
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `mptIssuanceId` | `string` | Yes | The MPT issuance id to destroy. |

### Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

### Response

Resolves to a `SubmissionResult<{ mptIssuanceId: string }>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

#### Response values

For `Token.destroy`, the `intent` echoes:

| Field | Type | Description |
| --- | --- | --- |
| `mptIssuanceId` | `string` | The MPT issuance id that was destroyed. |

### Underlying XRPL transactor

Builds and submits a single [`MPTokenIssuanceDestroy`](https://xrpl.org/docs/references/protocol/transactions/types/mptokenissuancedestroy) transaction.

## Example

```ts
await client.token.destroy({
  mptIssuanceId: '005C...',
})
```
