---
seo:
    description: Place buy and sell orders on the XRP Ledger DEX with the iou vertical, using familiar order types.
labels:
  - simpleXRPL
  - SDK
---

# Place A DEX Order

The `iou` vertical places orders to buy or sell an issued currency, priced in XRP or another IOU. The order type controls how the offer is worked.

```ts
/**
 * Place an order on the DEX.
 *
 * The `iou` vertical places orders to buy or sell an issued currency, priced in
 * XRP or another IOU. Order type controls how the offer is worked.
 *
 * MPTs (the `token` vertical) are deliberately absent here: the MPT DEX
 * amendment is not yet live on-chain, so MPTs cannot be traded on the order
 * book and there is no token-offer verb. All DEX offers go through `iou`.
 */
import { LocalSigner, SimpleXRPL } from 'simplexrpl'

const client = await SimpleXRPL.init({
  xrpldUrl: 'wss://s.altnet.rippletest.net:51233',
  signers: [LocalSigner.fromEnv()],
})

// --- Via the IOU vertical: sell 100 USD for 50 XRP -------------------------
// orderType: 'limit' rests on the book; 'market' = immediate-or-cancel;
// 'fok' = fill-or-kill; 'passive' = rest without crossing.
const sell = await client.iou.sellOffer({
  ticker: 'USD',
  amount: '100',
  orderType: 'limit',
  price: { currency: 'XRP', amount: '50' },
})
console.log('sell offer submitted:', sell.txHash)

// Buy 100 USD, paying in another IOU (EUR):
await client.iou.buyOffer({
  ticker: 'USD',
  amount: '100',
  orderType: 'fok',
  price: {
    ticker: 'EUR',
    issuer: 'rEurIssuer000000000000000000000000',
    amount: '90',
  },
})

// Read your resting offers back (no signer required) — each is shaped with its
// sequence, amount, price, and buy/sell type, ready to compose or cancel.
const mine = await client.account.listOffers()
for (const offer of mine.data) {
  console.log(offer.type, offer.amount, '@', offer.price)
}

// Or read the whole USD order book (both sides), regardless of who placed them:
const book = await client.iou.listOffers({
  ticker: 'USD',
  issuer: 'rIssuer00000000000000000000000000000',
})
console.log('resting USD offers:', book.data.length)

// Cancel a resting offer by its sequence number — here, the first one read back:
if (mine.data.length > 0) {
  await client.iou.cancelOffer({ offerSequence: mine.data[0].offerSequence })
}

await client.disconnect()
```

## See Also

- [iou.buyOffer()](../references/verticals/iou/buyOffer.md)
- [iou.sellOffer()](../references/verticals/iou/sellOffer.md)
- [iou.cancelOffer()](../references/verticals/iou/cancelOffer.md)
- [iou.listOffers()](../references/verticals/iou/listOffers.md)
- [account.listOffers()](../references/verticals/account/listOffers.md)
