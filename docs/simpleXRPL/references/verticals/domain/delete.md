---
seo:
    description: Domain.delete deletes a permissioned domain via a PermissionedDomainDelete transaction.
labels:
  - simpleXRPL
  - SDK
---

# domain.delete()

[[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/domain.ts#L123)

Delete a permissioned domain.

## Signature

```ts
domain.delete(
  params: DomainDeleteParams,
  options?: DomainWriteOptions,
): Promise<SubmissionResult<DomainIntent>>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `domain` | `string` | Yes | The domain id to delete. |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<DomainIntent>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `Domain.delete`, the `intent` (`DomainIntent`) echoes:

| Field | Type | Description |
| --- | --- | --- |
| `domainID` | `string` | The domain id that was deleted. |

## Underlying XRPL transactor

Builds and submits a single [PermissionedDomainDelete](https://xrpl.org/docs/references/protocol/transactions/types/permissioneddomaindelete) transaction.

## Example

```ts
await client.domain.delete({
  domain: 'A1B2...',
})
```
