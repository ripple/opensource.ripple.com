---
seo:
    description: Token.retrieve reads a single MPT issuance by id, with flags and XLS-89 metadata decoded. Read-only.
labels:
  - simpleXRPL
  - SDK
---

# token.retrieve()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/token.ts#L67)

Retrieve a single MPT issuance by id (point-in-time), with flags decoded to booleans and XLS-89 metadata decoded.

## Signature

```ts
token.retrieve(
  params: TokenRetrieveParams,
): Promise<TokenRetrieveResult>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `mptIssuanceId` | `string` | Yes | The MPT issuance id to fetch. |

## Returns

Resolves to a `TokenRetrieveResult`:

| Field | Type | Description |
| --- | --- | --- |
| `tokenID` | `string` | The queried MPT issuance id. |
| `data` | `TokenData \| undefined` | The issuance snapshot, or `undefined` if no such issuance exists. |

### TokenData

| Field | Type | Description |
| --- | --- | --- |
| `tokenID` | `string` | The MPT issuance id. |
| `issuer` | `string` | The issuer r-address. |
| `assetScale` | `number` | Decimal places between display value and base units. |
| `maximumAmount` | `string` _(optional)_ | Maximum issuable amount (base units), if capped. |
| `outstandingAmount` | `string` | Amount currently in circulation (base units). |
| `transferFee` | `number` | Secondary-transfer fee, as a percentage. |
| `flags` | `MptFlags` | Capability flags decoded to booleans: `canLock`, `requireAuth`, `canEscrow`, `canTrade`, `canTransfer`, `canClawback`. |
| `metadata` | `MPTokenMetadata` _(optional)_ | Decoded XLS-89 metadata, if present and well-formed. |

## Underlying XRPL request

Read-only — no signer is required and nothing is submitted. Queries the ledger with [ledger_entry](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/ledger-methods/ledger_entry).

## Example

```ts
const { data } = await client.token.retrieve({
  mptIssuanceId: '005C...',
})

console.log(data?.outstandingAmount)
```
