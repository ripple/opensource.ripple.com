---
seo:
    description: Credential.list lists the credentials an account holds or issued. Read-only.
labels:
  - simpleXRPL
  - SDK
---

# credential.list()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/credential.ts#L54)

List credentials an account holds (default) or issued.

## Signature

```ts
credential.list(
  params?: CredentialListParams,
): Promise<CredentialListResult>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `role` | `'holder' \| 'issuer'` | No | Query as `holder` (default) or `issuer`. |
| `account` | `string` | No | The account whose credentials to list. Defaults to the primary signer's account. |

## Returns

Resolves to a `CredentialListResult`, where `credentials[i]` corresponds to `data[i]`:

| Field | Type | Description |
| --- | --- | --- |
| `credentials` | `readonly CredentialRef[]` | The identifier of each credential (`credType`, `issuer`, `holder`). |
| `data` | `readonly CredentialData[]` | The shaped credentials. See [`credential.retrieve`](retrieve.md#credentialdata) for `CredentialData`. |

## Underlying XRPL request

Read-only — no signer is required and nothing is submitted. Queries the ledger with [`account_objects`](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/account-methods/account_objects).

## Example

```ts
const { data } = await client.credential.list({ role: 'holder' })

for (const cred of data) {
  console.log(cred.credType, cred.accepted)
}
```
