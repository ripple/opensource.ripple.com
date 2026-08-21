---
seo:
    description: Credential.retrieve reads a single credential by type and issuer. Read-only.
labels:
  - simpleXRPL
  - SDK
---

# credential.retrieve()

[[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/credential.ts#L42)

Retrieve a single credential by type and issuer (point-in-time).

## Signature

```ts
credential.retrieve(
  params: CredentialRetrieveParams,
): Promise<CredentialRetrieveResult>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `credType` | `string` | Yes | The credential type. |
| `issuer` | `string` | Yes | The issuer r-address. |
| `account` | `string` | No | The holder (subject). Defaults to the primary signer's account. |

## Returns

Resolves to a `CredentialRetrieveResult`:

| Field | Type | Description |
| --- | --- | --- |
| `credType` | `string` | The credential type. |
| `issuer` | `string` | The issuer r-address. |
| `holder` | `string` | The holder (subject) r-address. |
| `data` | `CredentialData \| undefined` | The credential snapshot, or `undefined` if none exists. |

### CredentialData

| Field | Type | Description |
| --- | --- | --- |
| `credType` | `string` | The credential type. |
| `issuer` | `string` | The issuer r-address. |
| `holder` | `string` | The holder (subject) r-address. |
| `accepted` | `boolean` | Whether the holder has accepted the credential. |
| `uri` | `string` _(optional)_ | The optional URI (decoded from hex). |
| `expiration` | `number` _(optional)_ | Expiration (seconds since the Ripple epoch), if set. |

## Underlying XRPL request

Read-only — no signer is required and nothing is submitted. Queries the ledger with [ledger_entry](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/ledger-methods/ledger_entry).

## Example

```ts
const { data } = await client.credential.retrieve({
  credType: 'KYC',
  issuer: 'rIssuer...',
})

console.log(data?.accepted)
```
