---
seo:
    description: The simpleXRPL client is the runtime entry point — SimpleXRPL.init() builds it, and it exposes the verticals, the discovered accounts, and the ledger connection lifecycle.
labels:
  - simpleXRPL
  - SDK
---

# Client

[[Source]](https://github.com/ripple/simpleXRPL/blob/2e7cf1f85dbecb529e95da97cc1178e0813259d6/src/client/client.ts#L43)

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


## Example

```ts
import { SimpleXRPL, LocalSigner } from 'simplexrpl'

const client = await SimpleXRPL.init({
  xrpldUrl: 'wss://s.altnet.rippletest.net:51233', // XRPL Testnet
  signers: [LocalSigner.fromEnv()],
})

await client.disconnect()
```
