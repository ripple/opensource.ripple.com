---
seo:
    description: Token.lock locks an MPT issuance or a specific holder's balance via an MPTokenIssuanceSet transaction.
labels:
  - SDKs
---

# token.lock()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/token.ts#L211)

Lock an MPT issuance, or a specific holder's balance when `holder` is given.

## Signature

```ts
token.lock(
  params: MptLockParams,
  options?: TokenWriteOptions,
): Promise<SubmissionResult<
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `mptIssuanceId` | `string` | Yes | The MPT issuance id. |
| `holder` | `string` | No | A specific holder to lock. Omit to lock the whole issuance. |

### Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

### Response

Resolves to a `SubmissionResult<{ mptIssuanceId: string; locked: boolean }>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

#### Response values

For `Token.lock`, the `intent` carries:

| Field | Type | Description |
| --- | --- | --- |
| `mptIssuanceId` | `string` | The MPT issuance id that was locked. |
| `locked` | `boolean` | The resulting lock state (`true`). |

### Underlying XRPL transactor

Builds and submits a single [`MPTokenIssuanceSet`](https://xrpl.org/docs/references/protocol/transactions/types/mptokenissuanceset) transaction with the lock flag set.

## Example

```ts
await client.token.lock({
  mptIssuanceId: '005C...',
})
```
