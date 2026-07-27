---
seo:
    description: Token.unauthorize opts the calling account out of holding an MPT issuance via an MPTokenAuthorize transaction.
labels:
  - simpleXRPL
  - SDK
---

# token.unauthorize()

[[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/token.ts#L169)

Opt the calling account out of holding an MPT issuance. The account's balance must be `0`.

## Signature

```ts
token.unauthorize(
  params: MptAuthorizeParams,
  options?: TokenWriteOptions,
): Promise<SubmissionResult>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `mptIssuanceId` | `string` | Yes | The MPT issuance id to opt out of. |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<{ mptIssuanceId: string }>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `Token.unauthorize`, the `intent` echoes:

| Field | Type | Description |
| --- | --- | --- |
| `mptIssuanceId` | `string` | The MPT issuance id that was deauthorized. |

## Underlying XRPL transactor

Builds and submits a single [MPTokenAuthorize](https://xrpl.org/docs/references/protocol/transactions/types/mptokenauthorize) transaction, with the unauthorize flag set.

## Example

```ts
await client.token.unauthorize({
  mptIssuanceId: '005C...',
})
```
