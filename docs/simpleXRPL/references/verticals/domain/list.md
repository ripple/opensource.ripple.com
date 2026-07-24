---
seo:
    description: Domain.list lists every permissioned domain owned by an account. Read-only.
labels:
  - simpleXRPL
  - SDK
---

# domain.list()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/domain.ts#L59)

List every permissioned domain owned by an account.

## Signature

```ts
domain.list(
  params?: DomainListParams
): Promise<DomainListResult>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `account` | `string` | No | The owner whose domains to list. Defaults to the primary signer's account. |

## Returns

Resolves to a `DomainListResult`, where `domains[i]` corresponds to `data[i]`:

| Field | Type | Description |
| --- | --- | --- |
| `domains` | `readonly string[]` | The domain id of each owned domain. |
| `data` | `readonly DomainData[]` | The shaped domains. See [`domain.retrieve`](retrieve.md#domaindata) for `DomainData`. |

## Underlying XRPL request

Read-only — no signer is required and nothing is submitted. Queries the ledger with [`account_objects`](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/account-methods/account_objects).

## Example

```ts
const { data } = await client.domain.list()

for (const domain of data) {
  console.log(domain.domainID)
}
```
