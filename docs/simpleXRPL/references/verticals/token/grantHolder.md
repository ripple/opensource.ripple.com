---
seo:
    description: Token.grantHolder lets an issuer authorize a specific holder to hold an MPT via an MPTokenAuthorize transaction.
labels:
  - simpleXRPL
  - SDK
---

# token.grantHolder()

[[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/token.ts#L183)

As the issuer, grant a specific holder permission to hold this MPT (allow-listing). Use this when the issuance requires authorization.

## Signature

```ts
token.grantHolder(
  params: MptHolderParams,
  options?: TokenWriteOptions,
): Promise<SubmissionResult>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `mptIssuanceId` | `string` | Yes | The MPT issuance id. |
| `holder` | `string` | Yes | The r-address of the holder to grant. |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<{ mptIssuanceId: string }>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `Token.grantHolder`, the `intent` echoes:

| Field | Type | Description |
| --- | --- | --- |
| `mptIssuanceId` | `string` | The MPT issuance id the holder was granted on. |

## Underlying XRPL transactor

Builds and submits a single [MPTokenAuthorize](https://xrpl.org/docs/references/protocol/transactions/types/mptokenauthorize) transaction naming the holder.

## Example

```ts
await client.token.grantHolder({
  mptIssuanceId: '005C...',
  holder: 'rHolder...',
})
```
