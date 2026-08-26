---
seo:
    description: Drive accounts held by different custodians from a single client, routing each operation to the connector that owns the account.
labels:
  - simpleXRPL
  - SDK
---

# Run A Workflow Across Custodians

A single client can drive accounts held by different connectors. Each vertical operation routes to the connector that owns the account it acts on — named per call with `from`, or the primary signer by default — so a workflow spanning custodians is just an ordered sequence of ordinary operation calls.

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
  primary: process.env.RIPPLE_CUSTODY_PRIMARY_ADDRESS ?? '',
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

// Each step targets a different custodian, and the client routes each call to
// the connector that owns the acting account. Issue a USD IOU with the Custody
// account as issuer (the primary signer, default `from`) and the Palisade wallet
// as the holder that extends trust — a genuinely cross-custodian issuance, since
// `issue` sequences AccountSet (issuer) → TrustSet (holder) → Payment (issuer).
// Naming `holder` is what selects this path; omitting it would instead bootstrap
// both accounts from the local `XRPL_ISSUER_SEED` / `XRPL_HOT_WALLET_SEED` seeds.
await client.iou.issue({
  ticker: 'USD',
  holder: hotWallet.address,
  amount: '1000',
})

// Then pay out from the Palisade hot wallet via `from`.
await client.xrp.transfer(
  { to: 'rBeneficiary00000000000000000000000', amount: '25' },
  { from: hotWallet.address },
)

await client.disconnect()
```

## See Also

- [iou.issue()](../references/verticals/iou/issue.md)
- [xrp.transfer()](../references/verticals/xrp/transfer.md)
