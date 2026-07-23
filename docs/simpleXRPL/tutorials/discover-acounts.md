---
seo:
    description: List and resolve the accounts each custodian discovered, and re-discover at runtime, from the single account index init builds.
labels:
  - simpleXRPL
  - SDK
---

# Discover Accounts

Custodians discover their accounts at construction, and `init` merges them into one index keyed by r-address. List them per-connector or across the whole client, resolve a specific account, and re-discover at runtime.

```ts
/**
 * Account discovery.
 *
 * Custodians discover their accounts at construction; `init` merges them into a
 * single index keyed by r-address. You can list them per-connector or across
 * the whole client, resolve a specific account, and re-discover at runtime.
 */
import { LocalSigner, SimpleXRPL } from 'simplexrpl'

const client = await SimpleXRPL.init({
  rippledUrl: 'wss://s.altnet.rippletest.net:51233',
  signers: [LocalSigner.fromEnv()],
})

// 1. Every account the client knows, across all connectors (r-address → account).
for (const [address, account] of client.accounts) {
  console.log(address, '→', account.signer.kind)
}

// 2. Per-connector discovery: ask a single custodian what it owns.
for (const signer of client.signers) {
  const owned = await signer.listAccounts()
  console.log(signer.kind, 'owns', owned.length, 'account(s)')
}

// 3. Resolve the account a verb would act on. With no argument, the primary
//    signer's primary account; or pass an r-address / a { signer } selector.
const primary = client.resolveAccount()
console.log('primary:', primary.address)
const specific = client.resolveAccount('rSomeKnownAddress0000000000000000000')
console.log('resolved:', specific.address)

// 4. Re-discover after upstream changes (e.g. a new custodian wallet).
await client.refreshAccounts()

// 5. Read an account's on-chain state (no signer required). With no argument it
//    reads the primary signer's account; pass an r-address to read any account.
const state = await client.account.retrieve()
console.log('primary balance (XRP):', state.data.xrpBalance)
console.log(
  'sequence:',
  state.data.sequence,
  'owner objects:',
  state.data.ownerCount,
)

await client.disconnect()
```

## See Also

- [`account.retrieve()`](../references/verticals/account/retrieve.md)
- [Client and initialization](../references/index.md#client-and-initialization)
