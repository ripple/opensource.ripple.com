---
seo:
    description: Credential.issue issues an on-ledger credential to a destination account via a CredentialCreate transaction.
labels:
  - simpleXRPL
  - SDK
---

# credential.issue()

[[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/credential.ts#L67)

Issue a credential to a destination account. The calling account is the issuer.

## Signature

```ts
credential.issue(
  params: CredentialIssueParams,
  options?: CredentialWriteOptions,
): Promise<SubmissionResult>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `destination` | `string` | Yes | The destination (holder) r-address the credential is about. |
| `credType` | `string` | Yes | The credential type, as a plain string (hex-encoded on the ledger). |
| `expiration` | `number` | No | Expiration, in seconds since the Ripple epoch. |
| `URI` | `string` | No | An optional URI, as a plain string (hex-encoded on the ledger). |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<{ destination: string; credType: string }>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `Credential.issue`, the `intent` echoes:

| Field | Type | Description |
| --- | --- | --- |
| `destination` | `string` | The destination (holder) r-address the credential was issued to. |
| `credType` | `string` | The credential type that was issued. |

## Underlying XRPL transactor

Builds and submits a single [CredentialCreate](https://xrpl.org/docs/references/protocol/transactions/types/credentialcreate) transaction.

## Example

```ts
await client.credential.issue({
  destination: 'rHolder...',
  credType: 'KYC',
})
```
