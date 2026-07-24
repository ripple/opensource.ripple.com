---
seo:
    description: Domain.create creates a new permissioned domain via a PermissionedDomainSet transaction.
labels:
  - simpleXRPL
  - SDK
---

# domain.create()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/domain.ts#L70)

Create a new permissioned domain.

## Signature

```ts
domain.create(
  params: DomainCreateParams,
  options?: DomainWriteOptions,
): Promise<SubmissionResult<DomainIntent>>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `credList` | `AcceptedCredential[]` | Yes | The credentials the domain accepts (at least one). |

Each `AcceptedCredential` is:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `issuer` | `string` | Yes | The issuer r-address. |
| `credType` | `string` | Yes | The credential type, as a plain string (hex-encoded on the ledger). |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<DomainIntent>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `Domain.create`, the `intent` (`DomainIntent`) carries:

| Field | Type | Description |
| --- | --- | --- |
| `domainID` | `string` | The id of the newly created domain, discovered from the transaction result. |

## Underlying XRPL transactor

Builds and submits a single [`PermissionedDomainSet`](https://xrpl.org/docs/references/protocol/transactions/types/permissioneddomainset) transaction (with no domain id, creating a new domain).

## Example

```ts
const { intent } = await client.domain.create({
  credList: [{ issuer: 'rIssuer...', credType: 'KYC' }],
})

console.log(intent.domainID)
```
