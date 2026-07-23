---
seo:
    description: Account.listOffers lists the open DEX offers placed by an account. Read-only.
labels:
  - SDKs
---

# account.listOffers()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/account.ts#L105)

List the open DEX offers placed by an account.

## Signature

```ts
account.listOffers(
  params?: AccountListOffersParams,
): Promise<ListOffersResult>
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `account` | `string` | No | The account whose offers to list. Defaults to the primary signer's account. |

### Response

Resolves to a `ListOffersResult`:

| Field | Type | Description |
| --- | --- | --- |
| `data` | `readonly OfferSummary[]` | The shaped open offers. See [`token.listOffers`](../token/listOffers.md#offersummary) for `OfferSummary`. |

### Underlying XRPL request

Read-only — no signer is required and nothing is submitted. Queries the ledger with [`account_offers`](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/account-methods/account_offers).

## Example

```ts
const { data } = await client.account.listOffers()

for (const offer of data) {
  console.log(offer.offerSequence, offer.type, offer.amount)
}
```
