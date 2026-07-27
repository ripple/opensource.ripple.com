---
seo:
    description: LocalSigner is simpleXRPL's self-custody connector — it holds xrpl wallets in-process and signs locally, for development and testing.
labels:
  - simpleXRPL
  - SDK
---

# Local

 [[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/custodians/local/local-signer.ts#L22)

A local connector holds one or more XRPL accounts in-process and signs operations locally. This connector is intended for development and testing purposes. Since this method doesn't require external authentication, it is constructed synchornously unlike other connectors.

## LocalSigner.fromEnv()

Builds one wallet per `XRPL_*_SEED` environment variable (matching `XRPL_<NAME>_SEED` and a plain `XRPL_SEED`). The primary defaults to the first seed found.

### Signature

```ts
LocalSigner.fromEnv(options?: LocalSignerFromEnvOptions): LocalSigner
```

### Options

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `primary` | `string` | No | The primary account's r-address. Defaults to the first seed in scan order. |
| `env` | `Record<string, string \| undefined>` | No | Environment source to scan — a map of variable names to values. Defaults to `process.env`. |


## LocalSigner.fromSeed()

Builds a single wallet from a seed string.

### Signature

```ts
LocalSigner.fromSeed(seed: string): LocalSigner
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `seed` | `string` | Yes | The wallet seed (the caller's responsibility to source). |


## LocalSigner.create()

Builds from pre-constructed `xrpl` `Wallet` objects.

### Signature

```ts
LocalSigner.create(options: LocalSignerCreateOptions): LocalSigner
```

### Options

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `wallets` | `readonly Wallet[]` | Yes | The xrpl `Wallet` objects this signer holds (at least one), e.g. `[Wallet.fromSeed(seed)]`. |
| `primary` | `string` | No | The primary account's r-address. Defaults to the first wallet. |


## Example

```ts
// One wallet per XRPL_*_SEED in the environment.
const local = LocalSigner.fromEnv()
```
