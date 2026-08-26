---
seo:
    description: This tutorial demonstrates how to connect to a custodian (Palisade and Ripple Custody).
labels:
  - simpleXRPL
  - SDK
---

# Connect to a Custodian

This tutorial demonstrates how to connect to a custodian (Palisade and Ripple Custody).

```ts
/**
 * Custodian-specific connections.
 *
 * Each connector is constructed and authenticated independently, then passed to
 * `SimpleXRPL.init`. Once bound, every vertical operation works the same regardless
 * of which connector owns the acting account — the SDK routes each write to the
 * custodian that holds the account.
 *
 * Config is read from the environment / your secrets manager so this drops
 * straight into your app — never hard-code credentials or keys. Endpoints below
 * point at the sandbox / testnet; swap them for production when you go live.
 */
import {
  LocalSigner,
  PalisadeCustody,
  RippleCustody,
  SimpleXRPL,
} from 'simplexrpl'

// --- Palisade (Wallet-as-a-Service) ---------------------------------------

// Palisade authenticates via OAuth client credentials and acts on a specific
// vault/wallet. `create` exchanges credentials and discovers the org's wallets.
const palisade = await PalisadeCustody.create({
  baseUrl: 'https://api.sandbox.palisade.co', // sandbox (TESTNET data)
  // Palisade scopes one permission set per credential, so a full setup needs
  // two: a wallet-read credential (account discovery) and a transactions one.
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
  // Enable the raw sign-only fallback for transactors Palisade has no native
  // operation for. Off by default.
  allowRawSigning: false,
})

// --- Ripple Custody -------------------------------------------------------

// Ripple Custody authenticates with an intent-author key (PEM contents or a
// path to a `.pem`) exchanged for a token, and operates within one Custody
// domain. Unlike Palisade — which has one shared, public sandbox URL — a
// Custody deployment is per-tenant: its gateway/token URLs point at the
// instance Ripple provisions for you (sandbox or production), so they belong
// in config rather than hard-coded. `fromEnv` reads every `RIPPLE_CUSTODY_*`
// variable for exactly this reason:
const rippleCustody = await RippleCustody.fromEnv({
  primary: process.env.RIPPLE_CUSTODY_PRIMARY_ADDRESS ?? '',
})

// The explicit form, if you configure it yourself rather than via the env:
// const rippleCustody = await RippleCustody.create({
//   gatewayUrl: process.env.RIPPLE_CUSTODY_GATEWAY_URL ?? '',
//   auth: {
//     signingKey: process.env.RIPPLE_CUSTODY_AUTH_SIGNING_KEY ?? '',
//     tokenUrl: process.env.RIPPLE_CUSTODY_AUTH_TOKEN_URL ?? '',
//   },
//   domainId: process.env.RIPPLE_CUSTODY_DOMAIN_ID ?? '',
//   primary: process.env.RIPPLE_CUSTODY_PRIMARY_ADDRESS ?? '',
// })

// --- Local signing (self-custody; keys held in-process) -------------------
// For self-custodied accounts. `fromEnv` scans the environment for seeds.
const local = LocalSigner.fromEnv()

// --- Bind the connectors --------------------------------------------------

const client = await SimpleXRPL.init({
  xrpldUrl: 'wss://s.altnet.rippletest.net:51233', // XRPL Testnet
  signers: [palisade, rippleCustody, local],
  // The default backend for operations called without an explicit `from`.
  primarySigner: rippleCustody,
})

console.log('connected with', client.signers.length, 'connectors')
await client.disconnect()
```

## See Also

- [Connectors](../references/connectors/index.md)
- [Palisade connector](../references/connectors/palisade.md)
- [Ripple Custody connector](../references/connectors/ripple-custody.md)
- [Local connector](../references/connectors/local.md)
- [SimpleXRPL.init()](../references/client.md#simplexrplinit)
- [Connector Routing](../references/connectors/connector-routing.md)
