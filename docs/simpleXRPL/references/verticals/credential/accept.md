---
seo:
    description: Credential.accept accepts a credential issued to the calling account via a CredentialAccept transaction.
labels:
  - simpleXRPL
  - SDK
---

# credential.accept()

[[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/credential.ts#L103)

Accept a credential issued to the calling account. The calling account is the holder.

## Signature

```ts
credential.accept(
  params: CredentialAcceptParams,
  options?: CredentialWriteOptions,
): Promise<SubmissionResult>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `credType` | `string` | Yes | The credential type, as a plain string (hex-encoded on the ledger). |
| `issuer` | `string` | Yes | The issuer r-address. |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<{ issuer: string; credType: string }>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `Credential.accept`, the `intent` echoes:

| Field | Type | Description |
| --- | --- | --- |
| `issuer` | `string` | The issuer r-address of the accepted credential. |
| `credType` | `string` | The credential type that was accepted. |

## Underlying XRPL transactor

Builds and submits a single [CredentialAccept](https://xrpl.org/docs/references/protocol/transactions/types/credentialaccept) transaction.

## Example

```ts
await client.credential.accept({
  credType: 'KYC',
  issuer: 'rIssuer...',
})
```
