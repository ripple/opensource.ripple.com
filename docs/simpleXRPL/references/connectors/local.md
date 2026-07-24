---
seo:
    description: LocalSigner is simpleXRPL's self-custody connector — it holds xrpl wallets in-process and signs locally, for development and testing.
labels:
  - simpleXRPL
  - SDK
---

# Local

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/custodians/local/local-signer.ts#L22)

`LocalSigner` is self-custody: it holds one or more `xrpl` wallets in-process and signs locally. For development and testing. It is constructed synchronously — no authentication, so unlike the custodial connectors its constructors are not `async`.

## LocalSigner.fromEnv()

```ts
LocalSigner.fromEnv(options?: LocalSignerFromEnvOptions): LocalSigner
```

Builds one wallet per `XRPL_*_SEED` environment variable (matching `XRPL_<NAME>_SEED` and a plain `XRPL_SEED`) — one wallet per match. The primary defaults to the first seed found.

### Parameters

`options` (`LocalSignerFromEnvOptions`) is optional:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `primary` | `string` | No | The primary account's r-address. Defaults to the first seed in scan order. |
| `env` | `object` | No | Environment source to scan — a map of variable names to values. Defaults to `process.env`. |

## LocalSigner.fromSeed()

```ts
LocalSigner.fromSeed(seed: string): LocalSigner
```

Builds a single wallet from a seed string.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `seed` | `string` | Yes | The wallet seed (the caller's responsibility to source). |

## LocalSigner.create()

```ts
LocalSigner.create(options: LocalSignerCreateOptions): LocalSigner
```

Builds from pre-constructed `xrpl` `Wallet` objects.

### Parameters

`options` (`LocalSignerCreateOptions`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `wallets` | `array` | Yes | The xrpl `Wallet` objects this signer holds (at least one). |
| `primary` | `string` | No | The primary account's r-address. Defaults to the first wallet. |

## Example

```ts
// One wallet per XRPL_*_SEED in the environment.
const local = LocalSigner.fromEnv()
```
