---
seo:
    description: Token.revokeHolder lets an issuer revoke a specific holder's permission to hold an MPT via an MPTokenAuthorize transaction.
labels:
  - simpleXRPL
  - SDK
---

# token.revokeHolder()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/token.ts#L197)

As the issuer, revoke a specific holder's permission to hold this MPT.

## Signature

```ts
token.revokeHolder(
  params: MptHolderParams,
  options?: TokenWriteOptions,
): Promise<SubmissionResult<
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `mptIssuanceId` | `string` | Yes | The MPT issuance id. |
| `holder` | `string` | Yes | The r-address of the holder to revoke. |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<{ mptIssuanceId: string }>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `Token.revokeHolder`, the `intent` echoes:

| Field | Type | Description |
| --- | --- | --- |
| `mptIssuanceId` | `string` | The MPT issuance id the holder was revoked on. |

## Underlying XRPL transactor

Builds and submits a single [MPTokenAuthorize](https://xrpl.org/docs/references/protocol/transactions/types/mptokenauthorize) transaction naming the holder, with the unauthorize flag set.

## Example

```ts
await client.token.revokeHolder({
  mptIssuanceId: '005C...',
  holder: 'rHolder...',
})
```
