---
seo:
    description: Domain.retrieve reads a permissioned domain by id. Read-only.
labels:
  - simpleXRPL
  - SDK
---

# domain.retrieve()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/domain.ts#L47)

Retrieve a permissioned domain by id (point-in-time).

## Signature

```ts
domain.retrieve(
  params: DomainRetrieveParams,
): Promise<DomainRetrieveResult>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `domainID` | `string` | Yes | The domain id to fetch. |

## Returns

Resolves to a `DomainRetrieveResult`:

| Field | Type | Description |
| --- | --- | --- |
| `domainID` | `string` | The queried domain id. |
| `data` | `DomainData \| undefined` | The domain snapshot, or `undefined` if no such domain exists. |

### DomainData

| Field | Type | Description |
| --- | --- | --- |
| `domainID` | `string` | The domain's on-chain id. |
| `owner` | `string` | The owning account's r-address. |
| `credList` | `readonly AcceptedCredential[]` | The credentials the domain accepts (each `{ issuer, credType }`, credential types decoded from hex). |

## Underlying XRPL request

Read-only — no signer is required and nothing is submitted. Queries the ledger with [ledger_entry](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/ledger-methods/ledger_entry).

## Example

```ts
const { data } = await client.domain.retrieve({
  domainID: 'A1B2...',
})

console.log(data?.owner)
```
