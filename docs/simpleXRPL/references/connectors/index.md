---
seo:
    description: A connector is a signing backend in simpleXRPL — LocalSigner, ExternalSigner, RippleCustody, or PalisadeCustody — constructed on its own and bound to the client at initialization.
labels:
  - simpleXRPL
  - SDK
---

# Connectors

A connector is a signing backend: it determines how an operation runs and which custodian holds your account keys. Each is constructed and authenticated on its own, then passed to the client constructed by `simpleXRPL` in a `signers` array. `simpleXRPL` supports these connectors:

- [Local](./local.md)
- [External](./external.md)
- [Ripple Custody](./ripple-custody.md)
- [Palisade](./palisade.md)

Every connector implements the `Custodian` interface. Once constructed, it exposes these fields and methods:


## Fields

| Field | Type | Description |
| --- | --- | --- |
| `kind` | `string` | The backend the connector adapts: `local`, `ripple-custody`, `palisade-custody`, or `external`. |
| `primary` | `object` | The connector's primary account reference. Used when a vertical operation runs without an explicit account. |
| `primary.address` | `string` | The primary account's XRPL r-address. |
| `primary.custodianRef` | `string` or `object`|  _(Optional)_ The connector's opaque native id for the account. A `string` for account-id connectors, or a `{vaultId, walletId}` object for vault-based connectors. Absent for local wallets. |


## Methods

### listAccounts()

List the accounts the connector holds.

#### Signature

```ts
connector.listAccounts(): Promise<Account[]>
```

#### Parameters

`listAccounts` takes no arguments.

#### Returns

Resolves to an array of [Account](../types.md#account) records the connector discovered and can sign for.

#### Example

```ts
const accounts = await connector.listAccounts()

console.log(accounts.map((account) => account.address))
```

