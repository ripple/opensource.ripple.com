---
seo:
    description: Install simpleXRPL, initialize the client, connect a custodian, and run your first XRP Ledger operation.
labels:
  - simpleXRPL
  - SDK
---

# Get Started

This guide takes you from install to your first on-ledger operation in three steps: **initialize the client**, **set up a custodian**, and **run a vertical operation**. The examples target the XRPL Testnet with a local signer so you can run them as-is, then swap in a production custodian when you're ready.

## Prerequisites

- **Node.js >= 20.19.** simpleXRPL is Node-targeted and not intended to run in the browser.
- Install the package:

```sh
npm install simplexrpl
```

## 1. Initialize the client

`SimpleXRPL.init(...)` is the single entry point — you never construct the client with `new`. It binds one or more already-authenticated signing backends (the **connectors**) to a network and builds the account index.

```ts
import { LocalSigner, SimpleXRPL } from 'simplexrpl'

const client = await SimpleXRPL.init({
  // Point at a rippled endpoint. `faucetUrl` is only used on test networks
  // (by `client.account.fund`).
  rippledUrl: 'wss://s.altnet.rippletest.net:51233',
  faucetUrl: 'https://faucet.altnet.rippletest.net/accounts',

  // Bind one or more connectors. Here, a single local-signing backend that
  // reads its seeds from the environment (`XRPL_*_SEED`).
  signers: [LocalSigner.fromEnv()],
})

// ... use the client ...

await client.disconnect()
```

- **`primarySigner`** is the default backend for verbs called without an explicit account. It defaults to `signers[0]`, so you only set it when you bind more than one connector.
- With **no `signers`**, the client is read-only: reads work, but write verbs throw `NoSignerError` until a signer is added.
- Bind an account at runtime (for example, a freshly created wallet) with `client.registerLocalAccount(seed)`.

See [Initialize the client](tutorials/inititialize-clients.md) for the full walkthrough, and [Client and initialization](references/index.md#client-and-initialization) for the configuration reference.

## 2. Set up a custodian

The **connector** determines how operations run and who holds the keys. simpleXRPL ships three, each constructed and authenticated on its own, then handed to `init`:

- **`LocalSigner`** — self-custody; keys held in-process. For development and testing.
- **`RippleCustody`** — routes through Ripple Custody. For production.
- **`PalisadeCustody`** — routes through Palisade. For production.

The local signer in Step 1 is enough for development. For production, construct a custodian connector and bind it instead of (or alongside) the local one:

```ts
import {
  LocalSigner,
  PalisadeCustody,
  RippleCustody,
  SimpleXRPL,
} from 'simplexrpl'

// Ripple Custody — authenticates with an intent-author key and operates within
// one Custody domain. `fromEnv` reads the `RIPPLE_CUSTODY_*` variables.
const rippleCustody = await RippleCustody.fromEnv({
  primary: process.env.RIPPLE_CUSTODY_PRIMARY ?? '',
})

// Palisade — authenticates via OAuth client credentials and acts on a
// specific vault/wallet.
const palisade = await PalisadeCustody.create({
  baseUrl: 'https://api.sandbox.palisade.co',
  clientId: process.env.PALISADE_CLIENT_ID ?? '',
  clientSecret: process.env.PALISADE_CLIENT_SECRET ?? '',
  primary: {
    vaultId: process.env.PALISADE_VAULT_ID ?? '',
    walletId: process.env.PALISADE_WALLET_ID ?? '',
  },
  // Enable the raw sign-only fallback for transactors the custodian has no
  // native operation for. Off by default.
  allowRawSigning: false,
})

const client = await SimpleXRPL.init({
  rippledUrl: 'wss://s.altnet.rippletest.net:51233',
  signers: [rippleCustody, palisade, LocalSigner.fromEnv()],
  primarySigner: rippleCustody,
})
```

Read credentials from your environment or secrets manager — never hard-code keys. Once bound, every vertical verb works the same regardless of which connector owns the account: the SDK routes each write to the custodian that holds it.

{% admonition type="info" name="Note" %}
Whether an operation runs through a custodian's **native** path or the **raw-signing fallback** is decided per operation; the fallback is off by default and enabled per connector via `allowRawSigning`. See [Operation Execution](index.md#operation-execution) and the [Connector Routing](references/connector-routing.md) table.
{% /admonition %}

See [Connect to custodians](tutorials/connect-custodians.md) for the full per-connector setup.

## 3. Run a vertical operation

Operations are grouped into domain-specific **verticals** — `xrp`, `token`, `iou`, `credential`, `domain`, and `account` — reached off the client. Each verb reads as business intent rather than protocol mechanics. Here's the simplest one, a native XRP payment:

```ts
const result = await client.xrp.transfer({
  to: 'rDestination...',
  amount: '10',
})

console.log(result.txHash)
```

- A write verb uses the **primary account** by default; target a different bound account by passing `from` in the options.
- Every write resolves to a `SubmissionResult` carrying the transaction hash, the backend's response, and a typed `intent` output. See [Results and handles](references/index.md#results-and-handles).
- **Reads** (such as `client.account.retrieve()`) need no signer and submit nothing.

{% admonition type="success" name="Tip" %}
On a test network, create and fund an account first with [`account.create()`](references/verticals/account/create.md) and [`account.fund()`](references/verticals/account/fund.md), then use its address as the source or destination.
{% /admonition %}

## Next steps

- **Tutorials** — end-to-end workflows: [Issue an RWA as an MPT](tutorials/issue-rwa-as-mpt.md), [Issue and distribute an IOU](tutorials/issue-and-distribute-iou.md), [Place a DEX order](tutorials/place-dex-order.md), and more.
- **Reference** — every vertical, method, connector, and type: [Reference](references/index.md).
- **Concepts** — what simpleXRPL is and why: [What is simpleXRPL](index.md).
