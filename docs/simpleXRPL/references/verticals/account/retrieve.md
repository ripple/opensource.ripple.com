---
seo:
    description: Account.retrieve reads an account's on-chain state — balance, sequence, owner count, and flags. Read-only.
labels:
  - simpleXRPL
  - SDK
---

# account.retrieve()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/account.ts#L93)

Read an account's on-chain state — XRP balance, sequence, owner count, and flags.

## Signature

```ts
account.retrieve(
  params?: AccountRetrieveParams,
): Promise<AccountRetrieveResult>
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `account` | `string` | No | The account to read. Defaults to the primary signer's account. |

### Response

Resolves to an `AccountRetrieveResult`:

| Field | Type | Description |
| --- | --- | --- |
| `data` | `AccountData` | The point-in-time account snapshot. |

#### AccountData

| Field | Type | Description |
| --- | --- | --- |
| `address` | `string` | The account's r-address. |
| `xrpBalance` | `string` | The XRP balance (converted from drops). |
| `sequence` | `number` | The account sequence number. |
| `ownerCount` | `number` | The number of owned ledger objects (drives the reserve). |
| `flags` | `Readonly<Record<string, boolean>>` | Account flags as booleans, as reported by `account_flags`. |

### Underlying XRPL request

Read-only — no signer is required and nothing is submitted. Queries the ledger with [`account_info`](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/account-methods/account_info) (flags are resolved via `account_flags`).

## Example

```ts
const { data } = await client.account.retrieve()

console.log(data.xrpBalance)
```
