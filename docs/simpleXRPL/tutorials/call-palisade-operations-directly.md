---
seo:
    description: Call the Palisade API directly for any operations simpleXRPL verticals don't expose.
labels:
  - simpleXRPL
  - SDK
---

# Call Palisade Operations Directly

Call any Palisade operation directly, using the `palisade.api` escape hatch.

```ts
/**
 * Call any Palisade operation directly — the `palisade.api` escape hatch.
 *
 * The verticals (`client.xrp`/`iou`/`token`/…) cover the operations simpleXRPL
 * models first-class. For everything else Palisade exposes — vaults,
 * counterparties, policies, webhooks, balances — reach for `palisade.api.call`,
 * a **secondary** surface keyed on the operationId. Path params, query, body,
 * and the response are all typed from the generated OpenAPI schema, so the call
 * autocompletes and type-checks without a hand-written method per resource.
 *
 * Auth routing has two layers. Method-based (the default): reads (`GET`) go on
 * the wallet-read credential, mutations on the transactions one. Tag-based
 * (optional): register a credential per Palisade permission scope under
 * `credentials.scoped` and every operation in that scope routes to it — needed
 * because Palisade scopes one permission set per credential, so policy or
 * webhook administration lives on its own credential.
 */
import { PalisadeCustody } from 'simplexrpl'

// The same two-credential Palisade connector used by the vertical examples,
// plus an optional scoped credential for the `Policies` permission set.
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
    // Tag-based routing: `Policies` operations use this credential regardless of
    // HTTP method. Omit `scoped` entirely to rely on method-based routing.
    scoped: {
      Policies: {
        clientId: process.env.PALISADE_POLICY_CLIENT_ID ?? '',
        clientSecret: process.env.PALISADE_POLICY_CLIENT_SECRET ?? '',
      },
    },
  },
  primary: {
    vaultId: process.env.PALISADE_VAULT_ID ?? '',
    walletId: process.env.PALISADE_WALLET_ID ?? '',
  },
})

// GET with a query param → routed to the wallet-read credential. `wallets` is
// typed as `vaultv2Wallet[] | undefined` straight off the schema.
const listed = await palisade.api.call('VaultService_ListGlobalWallets', {
  query: { pageSize: 50 },
})
console.log('wallets in org:', listed.wallets?.length ?? 0)

// GET with path + query params. Placeholders in `/v2/vaults/{vaultId}/…` are
// filled from `path`; a missing one throws before any request is sent.
const balances = await palisade.api.call('BalanceService_GetWalletBalances', {
  path: {
    vaultId: process.env.PALISADE_VAULT_ID ?? '',
    walletId: process.env.PALISADE_WALLET_ID ?? '',
  },
  query: { currencyCode: 'USD' },
})
console.log('aggregated fiat value:', balances.aggregatedFiatValue)

// POST → routed to the transactions credential. The body is type-checked
// against the operation's request schema (`name` and `details` are required).
const counterparty = await palisade.api.call(
  'CounterpartyService_CreateCounterparty',
  {
    body: {
      name: 'Acme Capital',
      details: { type: 'ORGANIZATION' },
    },
  },
)
console.log('created counterparty:', counterparty)

// A `Policies` operation → routed to the scoped credential registered above
// (not the wallet-read client its GET method would otherwise select).
const limits = await palisade.api.call('PolicyService_ListGlobalWalletLimits')
console.log('global wallet limits:', limits.walletLimits?.length ?? 0)
```

## See Also

- [Palisade connector](../references/connectors/palisade.md)
- [Connector Routing](../references/connectors/connector-routing.md)
- [Verticals](../references/verticals/index.md)
- [Palisade API — simpleXRPL coverage](https://github.com/ripple/simpleXRPL/blob/main/docs/palisade-api-coverage.md)
