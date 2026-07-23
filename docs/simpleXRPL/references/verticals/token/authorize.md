---
seo:
    description: Token.authorize opts the calling account in to holding an MPT issuance via an MPTokenAuthorize transaction.
labels:
  - simpleXRPL
  - SDK
---

# token.authorize()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/token.ts#L155)

Opt the calling account in to hold an MPT issuance.

## Signature

```ts
token.authorize(
  params: MptAuthorizeParams,
  options?: TokenWriteOptions,
): Promise<SubmissionResult<
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `mptIssuanceId` | `string` | Yes | The MPT issuance id to opt in to. |

### Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

### Response

Resolves to a `SubmissionResult<{ mptIssuanceId: string }>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

#### Response values

For `Token.authorize`, the `intent` echoes:

| Field | Type | Description |
| --- | --- | --- |
| `mptIssuanceId` | `string` | The MPT issuance id that was authorized. |

### Underlying XRPL transactor

Builds and submits a single [`MPTokenAuthorize`](https://xrpl.org/docs/references/protocol/transactions/types/mptokenauthorize) transaction.

## Example

```ts
await client.token.authorize({
  mptIssuanceId: '005C...',
})
```
