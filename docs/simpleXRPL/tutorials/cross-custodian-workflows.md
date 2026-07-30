---
seo:
    description: Drive accounts held by different custodians from a single client, using per-call routing or an ordered multi-step sequence.
labels:
  - simpleXRPL
  - SDK
---

# Run A Workflow Across Custodians

A single client can drive accounts held by different connectors. Sequence work across them either with per-call `from` routing (the common case) or with `runMultiStep`, which commits an ordered (transaction, account) sequence — steps that can target different custodians — from one call site.

```ts
/**
 * Run a workflow across two custodians.
 *
 * A single client can drive accounts held by different connectors: each vertical
 * operation routes automatically to the custodian that owns the account it acts on —
 * named via `from`, or the primary signer by default.
 */
import { PalisadeCustody, RippleCustody, SimpleXRPL } from 'simplexrpl'

// A common institutional split: the issuer is held in Ripple Custody (governed
// approvals), the distribution/hot wallet in Palisade. One client drives both.
// Config comes from the environment / your secrets manager.
const custody = await RippleCustody.fromEnv({
  primary: process.env.RIPPLE_CUSTODY_PRIMARY ?? '',
})
const palisade = await PalisadeCustody.create({
  baseUrl: 'https://api.sandbox.palisade.co', // sandbox (TESTNET data)
  // Two credentials: a wallet-read one (discovery) and a transactions one.
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
  signers: [custody, palisade],
})

// The distribution/hot wallet on the Palisade connector.
const hotWallet = client.resolveAccount(palisade.primary.address)

// Each operation targets a different custodian. Issue an IOU as the Custody issuer
// (the primary signer), then pay out from the Palisade hot wallet via `from` —
// the client routes each call to the connector that owns the account.
await client.iou.issue({ ticker: 'USD' })
await client.xrp.transfer(
  { to: 'rBeneficiary00000000000000000000000', amount: '25' },
  { from: hotWallet.address },
)

await client.disconnect()
```

## See Also

- [iou.issue()](../references/verticals/iou/issue.md)
- [xrp.transfer()](../references/verticals/xrp/transfer.md)
