---
seo:
    description: Token.lock locks an MPT issuance or a specific holder's balance via an MPTokenIssuanceSet transaction.
labels:
  - simpleXRPL
  - SDK
---

# token.lock()

[[Source]](https://github.com/ripple/simpleXRPL/blob/95b977b15f8950c5bc076b25165217869c0b06d3/src/verticals/token.ts#L202)

Lock an MPT issuance, or a specific holder's balance when `holder` is given.

## Signature

```ts
token.lock(
  params: TokenLockParams,
  options?: TokenWriteOptions,
): Promise<SubmissionResult>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `mptIssuanceId` | `string` | Yes | The MPT issuance id. |
| `holder` | `string` | No | A specific holder to lock. Omit to lock the whole issuance. |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<{ mptIssuanceId: string; locked: boolean }>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `Token.lock`, the `intent` carries:

| Field | Type | Description |
| --- | --- | --- |
| `mptIssuanceId` | `string` | The MPT issuance id that was locked. |
| `locked` | `boolean` | The resulting lock state (`true`). |

## Underlying XRPL transactor

Builds and submits a single [MPTokenIssuanceSet](https://xrpl.org/docs/references/protocol/transactions/types/mptokenissuanceset) transaction with the lock flag set.

## Example

```ts
await client.token.lock({
  mptIssuanceId: '005C...',
})
```
