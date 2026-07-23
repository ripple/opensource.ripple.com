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
 * A single client can drive accounts held by different connectors. Two ways to
 * sequence work across them:
 *
 *   1. Vertical verbs with `from` — each call routes to the custodian that owns
 *      the named account. Best for the common case.
 *   2. `runMultiStep` — commits an ordered (transaction, account) sequence step
 *      by step (no rollback), where steps can target different custodians. Best
 *      when the order matters and you want one call site.
 */
import {
  PalisadeCustody,
  RippleCustody,
  runMultiStep,
  SimpleXRPL,
} from 'simplexrpl'
import type { Transaction } from 'simplexrpl'

// A common institutional split: the issuer is held in Ripple Custody (governed
// approvals), the distribution/hot wallet in Palisade. One client drives both.
// Config comes from the environment / your secrets manager.
const custody = await RippleCustody.fromEnv({
  primary: process.env.RIPPLE_CUSTODY_PRIMARY ?? '',
})
const palisade = await PalisadeCustody.create({
  baseUrl: 'https://api.sandbox.palisade.co', // sandbox (TESTNET data)
  clientId: process.env.PALISADE_CLIENT_ID ?? '',
  clientSecret: process.env.PALISADE_CLIENT_SECRET ?? '',
  primary: {
    vaultId: process.env.PALISADE_VAULT_ID ?? '',
    walletId: process.env.PALISADE_WALLET_ID ?? '',
  },
})

const client = await SimpleXRPL.init({
  rippledUrl: 'wss://s.altnet.rippletest.net:51233', // XRPL Testnet
  signers: [custody, palisade],
})

// One account on each connector.
const issuer = client.resolveAccount(custody.primary.address)
const hotWallet = client.resolveAccount(palisade.primary.address)

// --- Approach 1: vertical verbs, each targeting a different custodian ------
// Issue an IOU as the Custody issuer, then pay out from the Palisade wallet.
await client.iou.issue({ ticker: 'USD' })
await client.xrp.transfer(
  { to: 'rBeneficiary00000000000000000000000', amount: '25' },
  { from: hotWallet.address },
)

// --- Approach 2: an ordered multi-step workflow across both ----------------
const stepOne: Transaction = {
  TransactionType: 'Payment',
  Account: issuer.address,
  Destination: 'rBeneficiary00000000000000000000000',
  Amount: '1000000',
}
const stepTwo: Transaction = {
  TransactionType: 'Payment',
  Account: hotWallet.address,
  Destination: 'rBeneficiary00000000000000000000000',
  Amount: '2000000',
}

// Step 1 signs on Ripple Custody, step 2 on Palisade — each routed
// automatically to the connector that owns the account.
const results = await runMultiStep(client, [
  { transaction: stepOne, account: issuer },
  { transaction: stepTwo, account: hotWallet },
])
console.log(`workflow committed ${results.length} steps`)

await client.disconnect()
```

## See Also

- [`iou.issue()`](../references/verticals/iou/issue.md)
- [`xrp.transfer()`](../references/verticals/xrp/transfer.md)
