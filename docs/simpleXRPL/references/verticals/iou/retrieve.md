---
seo:
    description: IOU.retrieve reads a single IOU trust line between an account and an issuer. Read-only.
labels:
  - simpleXRPL
  - SDK
---

# iou.retrieve()

[[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/iou.ts#L109)

Read a single IOU trust line (point-in-time).

## Signature

```ts
iou.retrieve(
  params: IOURetrieveParams
): Promise<IOURetrieveResult>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `ticker` | `string` | Yes | The currency code (3-character ISO-4217-style or 40-character hex; other codes are auto-encoded to hex). |
| `issuer` | `string` | Yes | The IOU issuer's r-address. |
| `account` | `string` | No | The holder account to read from. Defaults to the primary signer's account. |

## Returns

Resolves to an `IOURetrieveResult`:

| Field | Type | Description |
| --- | --- | --- |
| `iouID` | `string` | Currency code and issuer, e.g. `USD.rIssuer...` — pass to the write verbs. |
| `data` | `IOUTrustLine \| undefined` | The point-in-time trust line snapshot, or `undefined` if no line exists. |

### IOUTrustLine

| Field | Type | Description |
| --- | --- | --- |
| `currency` | `string` | The currency ticker (hex codes decoded to ASCII where printable). |
| `peer` | `string` | The counterparty r-address (the issuer, when querying as `holder`). |
| `balance` | `string` | The trust line balance, from the queried account's perspective. |
| `limit` | `string` | The queried account's trust limit. |
| `limitPeer` | `string` | The counterparty's trust limit. |
| `noRipple` | `boolean` | Whether rippling is disabled on this line. |
| `frozen` | `boolean` | Whether the queried account has frozen this line. |
| `authorized` | `boolean` | Whether the line is authorized (issuer authorized the holder). |

## Underlying XRPL request

Read-only — no signer is required and nothing is submitted. Queries the ledger with [account_lines](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/account-methods/account_lines).

## Example

```ts
const { data } = await client.iou.retrieve({
  ticker: 'USD',
  issuer: 'rIssuer...',
})

console.log(data?.balance)
```
