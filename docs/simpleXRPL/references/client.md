---
seo:
    description: The simpleXRPL client is the runtime entry point — SimpleXRPL.init() builds it, and it exposes the verticals, the discovered accounts, and the ledger connection lifecycle.
labels:
  - simpleXRPL
  - SDK
---

# Client

[[Source]](https://github.com/ripple/simpleXRPL/blob/95b977b15f8950c5bc076b25165217869c0b06d3/src/client/client.ts#L70)

`SimpleXRPL.init()` is `simpleXRPL`'s entry point, and it resolves to a **`SimpleXRPLClient`** — the runtime client. The client binds your pre-constructed [connectors](./connectors/index.md) to a network, discovers the accounts they hold, and exposes the [verticals](./verticals/index.md) you call to build operations. Its network connection and connector configuration are fixed for its lifetime.

A client constructed with no signers is still fully usable for reads; every write operation throws `NoSignerError` until a connector owns the target account.


## SimpleXRPL.init()

Bind connectors to a network and discover their accounts. Resolves to a `SimpleXRPLClient`.

### Signature

```ts
SimpleXRPL.init(config: SimpleXRPLConfig): Promise<SimpleXRPLClient>
```

### Config

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `xrpldUrl` | `string` | Yes | The xrpld endpoint (`ws(s)://` or `http(s)://`). |
| `faucetUrl` | `string` | No | Faucet endpoint, used on test networks only. |
| `signers` | `array` | No | The pre-constructed connectors (a `Custodian[]`). Omit for a no-signer client that can still read the ledger; write operations then throw `NoSignerError` until a signer is added. |
| `primarySigner` | `object` | No | The default connector for operations called without an explicit account. Defaults to the first entry in `signers`. |
| `ledger` | `object` | No | Advanced: the ledger connection used for reads, autofill, and Local/raw submission. Defaults to a connection built from `xrpldUrl`; inject a fake in tests. |


## SimpleXRPLClient

### Properties

Read-only members of the `SimpleXRPLClient` that `SimpleXRPL.init()` returns, set at construction.

| Property | Type | Description |
| --- | --- | --- |
| `network` | `object` | The network the client is bound to — a `NetworkInfo` with `xrpldUrl` (and `faucetUrl` on test networks). |
| `signers` | `array` | The registered connectors, 0 or more (a `Custodian[]`). |
| `primarySigner` | `object` | The default connector, used when an operation is called without an explicit account. `undefined` on a no-signer client. |
| `accounts` | `object` | Every discovered account as a read-only map keyed by r-address (`ReadonlyMap<string, Account>`). See [`Account`](types.md#account). |
| `ledger` | `object` | The shared ledger connection for reads, autofill, and Local/raw submission. Created lazily from `network.xrpldUrl` when none was injected. |
| `intent` | `object` | Read-only inspector for custodian governance intents. See [Intent Inspector](intent-inspector.md). |
| `pollMptIssuanceId` | `function` | Poll until the MPT issuance linked to an intent id is confirmed, then return its issuance ID: `(intentId: string) => Promise<string>`. `undefined` unless a Ripple Custody signer is configured. |


### connect()

Open the ledger connection.

```ts
SimpleXRPLClient.connect(): Promise<void>
```

### disconnect()

Close the ledger connection and release its resources.

```ts
SimpleXRPLClient.disconnect(): Promise<void>
```

### refreshAccounts()

Re-discover every connector's accounts and rebuild the account index. New accounts become addressable; accounts removed upstream are gone on the next lookup. Throws `AmbiguousAccountError` if an r-address is claimed by two connectors.

```ts
SimpleXRPLClient.refreshAccounts(): Promise<void>
```

### primaryAddress()

The primary connector's account address, or `undefined` on a no-signer client. Reads default to this; it never throws, so queries work without a signer.

```ts
SimpleXRPLClient.primaryAddress(): string | undefined
```

### resolveAccount()

Resolve an [AccountSelector](types.md#accountselector) to the full [Account](types.md#account) record — the r-address paired with the connector that signs for it. This is the same resolution every write performs on its `from` option, exposed so you can inspect or reuse the result: pass the returned account's `signer` to another call, or read its `custodianRef` and `ledgerId`.

Called with no selector, it returns the primary connector's primary account. Unlike [primaryAddress()](#primaryaddress), it throws rather than returning `undefined`.

```ts
SimpleXRPLClient.resolveAccount(selector?: AccountSelector): Account
```

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `selector` | `AccountSelector` | No | An r-address, an object `{ address }`, or `{ signer, account? }`. Defaults to the primary connector's primary account. |

Throws `NoSignerError` if no selector is given and the client has no signers, or `AccountNotFoundError` if the address isn't registered — or if an explicit `{ signer, account }` names an account that signer doesn't own.

```ts
// The primary account, whichever connector owns it.
const primary = client.resolveAccount()

// A specific address, resolved to the connector that holds it.
const hotWallet = client.resolveAccount('rHotWallet...')
console.log(hotWallet.signer.kind)
```


## Example

```ts
import { SimpleXRPL, LocalSigner } from 'simplexrpl'

const client = await SimpleXRPL.init({
  xrpldUrl: 'wss://s.altnet.rippletest.net:51233', // XRPL Testnet
  signers: [LocalSigner.fromEnv()],
})

await client.disconnect()
```
