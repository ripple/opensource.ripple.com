---
seo:
    description: Token.listOffers lists the open DEX offers placed by an account. Read-only.
labels:
  - SDKs
---

# token.listOffers()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/token.ts#L89)

List the open DEX offers placed by an account.

## Signature

```ts
token.listOffers(
  params?: TokenListOffersParams,
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
| `data` | `readonly OfferSummary[]` | The shaped open offers. |

#### OfferSummary

Each offer mirrors the `createOffer` / `buyOffer` / `sellOffer` input format, so it's composable back into those write verbs.

| Field | Type | Description |
| --- | --- | --- |
| `offerSequence` | `number` | The offer's sequence number (pass to `cancelOffer`). |
| `amount` | `number` | The quantity of the base asset being traded. |
| `price` | `IOUOfferPrice` | What is paid/received for it, in offer-price form. |
| `orderType` | `'limit' \| 'passive'` | Resting offers are `limit`, or `passive` when the passive flag is set. |
| `type` | `'buy' \| 'sell'` | Whether the offer buys or sells the base asset. |

### Underlying XRPL request

Read-only — no signer is required and nothing is submitted. Queries the ledger with [`account_offers`](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/account-methods/account_offers).

## Example

```ts
const { data } = await client.token.listOffers()

for (const offer of data) {
  console.log(offer.offerSequence, offer.type, offer.amount)
}
```
