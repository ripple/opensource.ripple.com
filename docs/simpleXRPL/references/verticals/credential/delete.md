---
seo:
    description: Credential.delete deletes an on-ledger credential, as either its issuer or its holder, via a CredentialDelete transaction.
labels:
  - simpleXRPL
  - SDK
---

# credential.delete()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/credential.ts#L133)

Delete a credential, as either its issuer or its holder.

## Signature

```ts
credential.delete(
  params: CredentialDeleteParams,
  options?: CredentialWriteOptions,
): Promise<SubmissionResult<
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `credType` | `string` | Yes | The credential type, as a plain string (hex-encoded on the ledger). |
| `holder` | `string` | No | The holder r-address. Set this when deleting as the issuer. |
| `issuer` | `string` | No | The issuer r-address. Set this when deleting as the holder. |

### Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

### Response

Resolves to a `SubmissionResult<{ credType: string }>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

#### Response values

For `Credential.delete`, the `intent` echoes:

| Field | Type | Description |
| --- | --- | --- |
| `credType` | `string` | The credential type that was deleted. |

### Underlying XRPL transactor

Builds and submits a single [`CredentialDelete`](https://xrpl.org/docs/references/protocol/transactions/types/credentialdelete) transaction.

## Example

```ts
await client.credential.delete({
  credType: 'KYC',
  issuer: 'rIssuer...',
})
```
