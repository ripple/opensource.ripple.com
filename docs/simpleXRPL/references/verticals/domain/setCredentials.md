---
seo:
    description: Domain.setCredentials updates the accepted credentials of an existing permissioned domain via a PermissionedDomainSet transaction.
labels:
  - simpleXRPL
  - SDK
---

# domain.setCredentials()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/domain.ts#L96)

Update the accepted credentials of an existing permissioned domain.

## Signature

```ts
domain.setCredentials(
  params: DomainSetCredentialsParams,
  options?: DomainWriteOptions,
): Promise<SubmissionResult<DomainIntent>>
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `domain` | `string` | Yes | The domain id to update. |
| `credList` | `AcceptedCredential[]` | Yes | The credentials the domain accepts (at least one). |

Each `AcceptedCredential` is:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `issuer` | `string` | Yes | The issuer r-address. |
| `credType` | `string` | Yes | The credential type, as a plain string (hex-encoded on the ledger). |

### Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

### Response

Resolves to a `SubmissionResult<DomainIntent>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

#### Response values

For `Domain.setCredentials`, the `intent` (`DomainIntent`) echoes:

| Field | Type | Description |
| --- | --- | --- |
| `domainID` | `string` | The domain id that was updated. |

### Underlying XRPL transactor

Builds and submits a single [`PermissionedDomainSet`](https://xrpl.org/docs/references/protocol/transactions/types/permissioneddomainset) transaction naming the existing domain id.

## Example

```ts
await client.domain.setCredentials({
  domain: 'A1B2...',
  credList: [{ issuer: 'rIssuer...', credType: 'KYC' }],
})
```
