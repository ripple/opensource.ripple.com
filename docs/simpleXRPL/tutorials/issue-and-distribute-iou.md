---
seo:
    description: "Issue a trust line currency (IOU) and distribute it: bootstrap the issuer and hot wallet, then transfer the currency out."
labels:
  - simpleXRPL
  - SDK
---

# Issue And Distribute An IOU

`issue` bootstraps the issuer and a hot wallet from the environment (the issuer enables rippling and the hot wallet extends a trust line); no value exists until `transfer` sends the currency out. Every verb acts as the issuer, selected via `from`.

```ts
/**
 * Issue and distribute an IOU (trust line currency).
 *
 * `issue` bootstraps the issuer and a hot wallet from the environment
 * (`XRPL_ISSUER_SEED`, `XRPL_HOT_WALLET_SEED`): the issuer enables rippling and
 * the hot wallet extends a trust line. No value exists yet — `transfer` sends
 * the currency out from the issuer. Every verb acts as the issuer, selected via
 * `from` (defaults to the primary signer's account).
 */
import { LocalSigner, SimpleXRPL } from 'simplexrpl'

const client = await SimpleXRPL.init({
  rippledUrl: 'wss://s.altnet.rippletest.net:51233',
  signers: [LocalSigner.fromEnv()],
})

// 1. Issue. Returns the IOU id, e.g. "USD.rIssuer...".
const issued = await client.iou.issue({ ticker: 'USD' })
console.log('issued', issued.intent.iouID)

// 2. Distribute: send 1,000 USD from the issuer to a holder. The holder must
//    already trust the issuer for this currency (the hot wallet set up in step
//    1 does; other holders extend their own trust line first).
await client.iou.transfer({
  ticker: 'USD',
  destination: 'rHolder00000000000000000000000000000',
  amount: 1000,
})

// 3. Optional issuer controls, all scoped to the same currency:
//    - authorize a holder (when the issuer requires authorization)
//    - lock / unlock a holder's line (reversible freeze)
//    - clawback (requires clawback enabled before any trust lines exist)
await client.iou.authorize({
  ticker: 'USD',
  holder: 'rHolder00000000000000000000000000000',
})

// 4. Read it back (no signer required). `retrieve` returns a single shaped
//    trust line for the holder→issuer pair; `list` returns all of an account's
//    lines. Pass `account` to read any address, or omit it for the primary.
//    The issuer is the second half of the iouID ("USD.rIssuer...").
const [, issuer] = issued.intent.iouID.split('.')
const holder = 'rHolder00000000000000000000000000000'

const line = await client.iou.retrieve({
  ticker: 'USD',
  issuer,
  account: holder,
})
console.log('holder balance:', line.data?.balance ?? '0')

const all = await client.iou.list({ account: holder })
console.log('holder trust lines:', all.ious)

await client.disconnect()
```

## See Also

- [iou.issue()](../references/verticals/iou/issue.md)
- [iou.transfer()](../references/verticals/iou/transfer.md)
- [iou.authorize()](../references/verticals/iou/authorize.md)
- [iou.retrieve()](../references/verticals/iou/retrieve.md)
- [iou.list()](../references/verticals/iou/list.md)
