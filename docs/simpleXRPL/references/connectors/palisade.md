---
seo:
    description: PalisadeCustody is simpleXRPL's production connector for Palisade — construction config and required fields for create().
labels:
  - simpleXRPL
  - SDK
---

# Palisade

[[Source]](https://github.com/ripple/simpleXRPL/blob/2e7cf1f85dbecb529e95da97cc1178e0813259d6/src/custodians/palisade/config.ts#L40)

Palisade is a Wallet-as-a-Service. This connector authenticates via OAuth2 client credentials and acts on specific vaults/wallets. See: [Getting started with the API](https://docs.ripple.com/products/wallet/getting-started/getting-started-api) for instructions on creating API credentials to fill in this constructor.

For a full table of Palisade v2 API operations and how `simpleXRPL` uses them, see: [Palisade API — simpleXRPL coverage](https://github.com/ripple/simpleXRPL/blob/main/docs/palisade-api-coverage.md).


## PalisadeCustody.create()

Exchanges the credentials and discovers the org's wallets.

### Signature

```ts
PalisadeCustody.create(config: PalisadeCustodyConfig): Promise<PalisadeCustody>
```

### Config

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `baseUrl` | `string` | Yes | Palisade API base URL (must be HTTPS). |
| `credentials` | `PalisadeCredentials` | Yes | The wallet-read and transactions API credentials. See [Credentials](#credentials). |
| `credentials.wallets` | `object` | Yes | Wallet-read credential — authorizes account discovery (`GET /v2/wallets`). A `{ clientId, clientSecret }` pair. |
| `credentials.transactions` | `object` | Yes | Transactions credential — authorizes signing and submission. A `{ clientId, clientSecret }` pair. |
| `credentials.scoped` | `object` | No | Per-scope credentials for the [`palisade.api`](#palisadeapicall) surface, keyed by Palisade permission scope (e.g. `Policies`, `Webhooks`). See [Credentials](#credentials). |
| `primary` | `PalisadeWalletRef` | Yes | The wallet used when an operation is called without an explicit account. |
| `primary.vaultId` | `string` | Yes | The primary wallet's vault id. |
| `primary.walletId` | `string` | Yes | The primary wallet's id. |
| `allowRawSigning` | `boolean` | No | Allow the raw fallback for transactors/fields Palisade can't map natively. Defaults to `false`. |
| `defaultTimeoutMs` | `number` | No | How long to wait for a native submission to reach a terminal status. |
| `http` | `object` | No | A custom HTTP transport (implements `PalisadeHttpPort`). Defaults to the production fetch port; most callers omit it. |
| `now` | `() => number` | No | Injectable clock for the auth service, returning epoch ms, e.g. `() => Date.now()`. Defaults to `Date.now`. |

{% admonition type="warning" name="Caution" %}
Enabling `allowRawSigning` weakens the custodian's controls. On the raw path the custodian signs an opaque payload rather than a structured operation, so its transaction-level controls (transfer policies, allow-lists, and approval rules keyed to operation semantics) cannot inspect what is being signed. `xrpl.js` protocol validation still runs on every path, so malformed transactions are still rejected; what is lost is the custodian's ability to reason about the transaction's intent.

Leave it off unless a specific transactor requires it, and prefer routing those operations through a signer that models them natively.
{% /admonition %}


### Credentials

Palisade scopes one permission set per credential, so the connector requires **two**: a `wallets` credential for discovery and a `transactions` credential for signing and submission. Requests route between them by HTTP method — reads (`GET`) go on `wallets`, mutations on `transactions`.

`credentials.scoped` adds optional tag-based routing for the [`palisade.api`](#palisadeapicall) escape hatch. Each key is a Palisade permission scope (an operation's OpenAPI tag); every operation in that scope routes to its credential instead of falling back to the method-based pair. Administering policies or webhooks needs this, because those permission sets live on their own credential.

```ts
credentials: {
  wallets: { clientId: '…', clientSecret: '…' },
  transactions: { clientId: '…', clientSecret: '…' },
  scoped: {
    Policies: { clientId: '…', clientSecret: '…' },
  },
}
```


## palisade.api.call()

Call any Palisade v2 operation directly, using the escape hatch for operations the [verticals](../verticals/index.md) don't model first-class (vaults, counterparties, policies, webhooks, balances). Path params, query, body, and the response are all typed from the generated OpenAPI schema.

### Signature

```ts
palisade.api.call(operationId: PalisadeOperationId, args?: PalisadeCallArgs): Promise<Response>
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `operationId` | `PalisadeOperationId` | Yes | The Palisade operationId, e.g. `VaultService_ListGlobalWallets`. Autocompletes to every generated route. |

### Args

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | `object` | No | Path parameters, keyed by placeholder name. Required when the route template has placeholders; a missing one throws before any request is sent. |
| `query` | `object` | No | Query-string parameters. |
| `body` | `object` | No | JSON request body, type-checked against the operation's request schema. |

Throws `SimpleXRPLError` if a required path parameter is missing, and [`PalisadeApiError`](../errors.md) if the API rejects the request.

{% admonition type="info" name="Note" %}
`palisade.api` is a **secondary** surface; prefer a [vertical operation](../verticals/index.md) when one exists. For a tutorial on how to use `palisade.api`, see: [Call Palisade Operations Directly](../../tutorials/call-palisade-operations-directly.md).
{% /admonition %}


## Example

```ts
const palisade = await PalisadeCustody.create({
  baseUrl: 'https://api.sandbox.palisade.co',
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
```
