---
seo:
    description: IOU.list lists every IOU trust line for an account. Read-only.
labels:
  - simpleXRPL
  - SDK
---

# iou.list()

[[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/iou.ts#L119)

List every IOU trust line for an account.

## Signature

```ts
iou.list(
  params?: IOUListParams
): Promise<IOUListResult>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `role` | `'holder' \| 'issuer'` | No | Query as `holder` (default) or `issuer`. |
| `account` | `string` | No | The account whose trust lines to list. Defaults to the primary signer's account. |

## Returns

Resolves to an `IOUListResult`, where `ious[i]` corresponds to `data[i]`:

| Field | Type | Description |
| --- | --- | --- |
| `ious` | `readonly string[]` | The `iouID` of each line, composable into the write verbs. |
| `data` | `readonly IOUTrustLine[]` | The shaped trust lines. See [iou.retrieve](retrieve.md#ioutrustline) for `IOUTrustLine`. |

## Underlying XRPL request

Read-only — no signer is required and nothing is submitted. Queries the ledger with [account_lines](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/account-methods/account_lines).

## Example

```ts
const { data } = await client.iou.list()

for (const line of data) {
  console.log(line.currency, line.balance)
}
```
