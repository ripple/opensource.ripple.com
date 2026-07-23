---
seo:
    description: Initialize the simpleXRPL client with SimpleXRPL.init — bind connectors to a network and build the account index.
labels:
  - SDKs
---

# Initialize The Client

`SimpleXRPL.init(...)` is the single entry point: it binds already-authenticated connectors to a network and builds the account index. The client is never constructed with `new`.

```ts
/**
 * Initialization: choosing a network, connectors, and binding accounts.
 *
 * `SimpleXRPL.init(...)` is the only entry point — it binds pre-constructed,
 * already-authenticated custodians (the "connectors") to a network and builds
 * the account index. The client is never constructed with `new`.
 */
import { LocalSigner, SimpleXRPL } from 'simplexrpl'

// 1. Choose a network by pointing at a rippled endpoint. `faucetUrl` is only
//    used on test networks (for `client.account.fund`).
const client = await SimpleXRPL.init({
  rippledUrl: 'wss://s.altnet.rippletest.net:51233',
  faucetUrl: 'https://faucet.altnet.rippletest.net/accounts',

  // 2. Choose your connector(s). Each custodian is constructed and
  //    authenticated on its own, then handed to `init`. Here we bind a single
  //    local-signing backend that reads its seeds from the environment.
  signers: [LocalSigner.fromEnv()],

  // 3. `primarySigner` is the default backend for verbs called without an
  //    explicit account. Defaults to `signers[0]`, so this line is optional.
  // primarySigner: someSigner,
})

// With no `signers`, the client is read-only: reads work, but write verbs throw
// `NoSignerError` until a signer is added.

// 4. Bind (register) an account at runtime — e.g. a freshly created wallet —
//    so verbs can act on it immediately. Returns the registered account.
const seed = process.env.NEW_ACCOUNT_SEED
if (seed !== undefined) {
  const account = client.registerLocalAccount(seed)
  console.log('registered', account.address)
}

// 5. Verbs default to the primary account; target any bound account with `from`.
await client.xrp.transfer({
  to: 'rDestination00000000000000000000000',
  amount: '10',
})

await client.disconnect()
```

## See Also

- [Client and initialization](../references/index.md#client-and-initialization)
- [`xrp.transfer()`](../references/verticals/xrp/transfer.md)
