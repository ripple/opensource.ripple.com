---
seo:
    description: "Issue a trust line currency (IOU) and distribute it: bootstrap the issuer and hot wallet, then transfer the currency out."
labels:
  - simpleXRPL
  - SDK
---

# Issue And Distribute An IOU

`issue` bootstraps the issuer and a hot wallet from the environment (the issuer enables rippling and the hot wallet extends a trust line). No value exists until `transfer` sends the currency out. Every verb acts as the issuer, selected via `from`. The XRP Ledger supports two token standards (MPT and trust line tokens). MPTs have been designed for greater efficiency and ease of use based on lessons learned from trust line tokens, however there are some cases where you may prefer trust line tokens. See: [Which Fungible Token Type to Use](https://xrpl.org/docs/concepts/tokens/fungible-tokens#which-fungible-token-type-to-use).

```ts
/**
 * Issue and distribute an IOU (trust-line currency) with Palisade-held accounts.
 *
 * `issue` sets up the trust line: the issuer enables rippling (`AccountSet`) and
 * the hot wallet extends trust (`TrustSet`). Both are Palisade wallets here —
 * pass the hot wallet via `holder`, and the issuer defaults to the primary
 * signer. No value exists yet — `transfer` sends the currency out. Every
 * operation acts as the issuer, selected via `from` (default: the primary).
 */
import { PalisadeCustody, SimpleXRPL } from 'simplexrpl'

// The issuer wallet, held in Palisade (the primary signer). Palisade needs two
// credentials: a wallet-read one (discovery) and a transactions one (signing).
const palisade = await PalisadeCustody.create({
  baseUrl: 'https://api.sandbox.palisade.co', // sandbox (TESTNET data)
  credentials: {
    wallets: {
      clientId: process.env.PALISADE_WALLETS_CLIENT_ID ?? '',
      clientSecret: process.env.PALISADE_WALLETS_CLIENT_SECRET ?? '',
    },
    transactions: {
      clientId: process.env.PALISADE_TX_CLIENT_ID ?? '',
      clientSecret: process.env.PALISADE_TX_CLIENT_SECRET ?? '',
    },
  },
  primary: {
    vaultId: process.env.PALISADE_VAULT_ID ?? '',
    walletId: process.env.PALISADE_WALLET_ID ?? '',
  },
})

const client = await SimpleXRPL.init({
  xrpldUrl: 'wss://s.altnet.rippletest.net:51233', // XRPL Testnet
  signers: [palisade],
})

// The hot wallet: a second Palisade wallet in the same org. It extends trust to
// the issuer, and both accounts are signed by Palisade.
const hotWallet = process.env.PALISADE_HOLDER_ADDRESS ?? ''

// 1. Issue and distribute in one call: AccountSet on the issuer (the primary), a
//    max-limit TrustSet on the hot wallet, then a Payment of 1,000 USD to it.
//    Amounts are decimal strings, so they reach the ledger exactly.
//    Omit `amount` to set the trust line up now and distribute later in tranches
//    via `client.iou.transfer(...)`. Other holders extend their own trust line first.
const issued = await client.iou.issue({
  ticker: 'USD',
  holder: hotWallet,
  amount: '1000',
})
console.log('issued', issued.intent.iouID, 'distributed', issued.intent.amount)

// 2. Read it back (no signer required): the hot wallet's shaped USD trust line.
//    The issuer is the second half of the iouID ("USD.rIssuer...").
const [, issuer] = issued.intent.iouID.split('.')
const line = await client.iou.retrieve({
  ticker: 'USD',
  issuer,
  account: hotWallet,
})
console.log('hot wallet balance:', line.data?.balance ?? '0')

await client.disconnect()
```

## See Also

- [iou.issue()](../references/verticals/iou/issue.md)
- [iou.transfer()](../references/verticals/iou/transfer.md)
- [iou.authorize()](../references/verticals/iou/authorize.md)
- [iou.retrieve()](../references/verticals/iou/retrieve.md)
- [iou.list()](../references/verticals/iou/list.md)
