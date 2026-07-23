---
seo:
    description: Token.list lists the MPTs an account holds or issued. Read-only.
labels:
  - simpleXRPL
  - SDK
---

# token.list()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/token.ts#L79)

List the MPTs an account holds (default) or issued.

## Signature

```ts
token.list(
  params?: TokenListParams
): Promise<TokenListResult>
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `role` | `'holder' \| 'issuer'` | No | List tokens the account holds (default) or issued. |
| `account` | `string` | No | The account to query. Defaults to the primary signer's account. |

### Response

Resolves to a `TokenListResult`, where `tokens[i]` corresponds to `data[i]`:

| Field | Type | Description |
| --- | --- | --- |
| `tokens` | `readonly string[]` | The MPT issuance id of each token. |
| `data` | `readonly TokenListEntry[]` | The shaped entries. |

#### TokenListEntry

| Field | Type | Description |
| --- | --- | --- |
| `tokenID` | `string` | The MPT issuance id. |
| `balance` | `string` _(optional)_ | The account's balance (present for `role: 'holder'`). |
| `issuance` | `TokenData` _(optional)_ | The full issuance snapshot (present for `role: 'issuer'`). See [`token.retrieve`](retrieve.md#tokendata) for `TokenData`. |

### Underlying XRPL request

Read-only — no signer is required and nothing is submitted. Queries the ledger with [`account_objects`](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/account-methods/account_objects).

## Example

```ts
const { data } = await client.token.list({ role: 'holder' })

for (const entry of data) {
  console.log(entry.tokenID, entry.balance)
}
```
