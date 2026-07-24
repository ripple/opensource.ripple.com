---
seo:
    description: Token.unlock unlocks an MPT issuance or a specific holder's balance via an MPTokenIssuanceSet transaction.
labels:
  - simpleXRPL
  - SDK
---

# token.unlock()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/token.ts#L225)

Unlock a previously locked MPT issuance, or a specific holder's balance when `holder` is given.

## Signature

```ts
token.unlock(
  params: MptLockParams,
  options?: TokenWriteOptions,
): Promise<SubmissionResult<
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `mptIssuanceId` | `string` | Yes | The MPT issuance id. |
| `holder` | `string` | No | A specific holder to unlock. Omit to unlock the whole issuance. |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<{ mptIssuanceId: string; locked: boolean }>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `Token.unlock`, the `intent` carries:

| Field | Type | Description |
| --- | --- | --- |
| `mptIssuanceId` | `string` | The MPT issuance id that was unlocked. |
| `locked` | `boolean` | The resulting lock state (`false`). |

## Underlying XRPL transactor

Builds and submits a single [`MPTokenIssuanceSet`](https://xrpl.org/docs/references/protocol/transactions/types/mptokenissuanceset) transaction with the unlock flag set.

## Example

```ts
await client.token.unlock({
  mptIssuanceId: '005C...',
})
```
