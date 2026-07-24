---
seo:
    description: PalisadeCustody is simpleXRPL's production connector for Palisade — construction config and required fields for create().
labels:
  - simpleXRPL
  - SDK
---

# Palisade

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/custodians/palisade/config.ts#L10)

Palisade is a Wallet-as-a-Service. This connector authenticates via OAuth2 client credentials and acts on specific vaults/wallets.


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
| `clientId` | `string` | Yes | OAuth2 client-credentials id. |
| `clientSecret` | `string` | Yes | OAuth2 client-credentials secret (held in memory only). |
| `primary` | `PalisadeWalletRef` | Yes | The wallet used when a verb is called without an explicit account. |
| `primary.vaultId` | `string` | Yes | The primary wallet's vault id. |
| `primary.walletId` | `string` | Yes | The primary wallet's id. |
| `allowRawSigning` | `boolean` | No | Allow the raw fallback for transactors/fields Palisade can't map. Defaults to `false`. |
| `defaultTimeoutMs` | `number` | No | How long to wait for a native submission to reach a terminal status. |
| `http` | `PalisadeHttpPort` | No | Advanced: a custom HTTP transport, shape `{ send: (request) => Promise<response> }`. Defaults to the production fetch port; most callers omit it. |
| `now` | `() => number` | No | Injectable clock for the auth service, returning epoch ms, e.g. `() => Date.now()`. Defaults to `Date.now`. |


## Example

```ts
const palisade = await PalisadeCustody.create({
  baseUrl: 'https://api.sandbox.palisade.co',
  clientId: process.env.PALISADE_CLIENT_ID ?? '',
  clientSecret: process.env.PALISADE_CLIENT_SECRET ?? '',
  primary: {
    vaultId: process.env.PALISADE_VAULT_ID ?? '',
    walletId: process.env.PALISADE_WALLET_ID ?? '',
  },
})
```
