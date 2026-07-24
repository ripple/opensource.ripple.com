---
seo:
    description: RippleCustody is simpleXRPL's production connector for Ripple Custody — construction options and required fields for create() and fromEnv().
labels:
  - simpleXRPL
  - SDK
---

# Ripple Custody

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/custodians/ripple/construction.ts#L30)

`RippleCustody` routes through Ripple Custody, operating within one Custody domain. It authenticates with an intent-author key exchanged for a token. A Custody deployment is per-tenant, so its gateway and token URLs point at the instance provisioned for you.

## RippleCustody.create()

```ts
RippleCustody.create(options: RippleCustodyOptions): Promise<RippleCustody>
```

Construct with every value passed explicitly.

### Parameters

`options` (`RippleCustodyOptions`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `gatewayUrl` | `string` | Yes | The Custody gateway base URL. |
| `auth` | `object` | Yes | Intent-author credentials and token endpoint. |
| `auth.signingKey` | `string` | Yes | Intent-author private key: PEM contents, or a path to a `.pem` file. |
| `auth.tokenUrl` | `string` | Yes | The Custody token endpoint URL. |
| `auth.publicKey` | `string` | No | Matching public key, base64 SPKI DER. Derived from `signingKey` if omitted. |
| `domainId` | `string` | Yes | The Custody domain this custodian operates in. |
| `primary` | `string` | Yes | The primary account's r-address; validated against the discovered set. |
| `allowRawSigning` | `boolean` | No | Enable the raw-signing fallback. Defaults to `false`. |
| `defaultFee` | `object` | No | Fee tier: `{ priority?: 'low' \| 'medium' \| 'high' }`. Backends that can't honor the tier auto-price and warn. Defaults to `low`. |
| `defaultDryRun` | `boolean` | No | Pre-flight every write through Custody's dry-run. Defaults to `false`. |
| `defaultTimeoutMs` | `number` | No | How long `submitAndWait` polls before throwing `IntentPendingError`. |
| `http` | `object` | No | Advanced: a custom HTTP transport (implements `CustodyHttpPort`). Defaults to the production fetch port; most callers omit it. |

## RippleCustody.fromEnv()

```ts
RippleCustody.fromEnv(options: RippleCustodyFromEnvOptions): Promise<RippleCustody>
```

Reads the endpoints, credentials, and domain from environment variables — `RIPPLE_CUSTODY_GATEWAY_URL`, `RIPPLE_CUSTODY_AUTH_SIGNING_KEY`, `RIPPLE_CUSTODY_AUTH_TOKEN_URL`, `RIPPLE_CUSTODY_AUTH_PUBLIC_KEY` (optional), and `RIPPLE_CUSTODY_DOMAIN_ID` — then applies these options:

### Parameters

`options` (`RippleCustodyFromEnvOptions`):

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `primary` | `string` | Yes | The primary account's r-address; validated against the discovered set. |
| `allowRawSigning` | `boolean` | No | Enable the raw-signing fallback. Defaults to `false`. |
| `defaultFee` | `object` | No | Fee tier: `{ priority?: 'low' \| 'medium' \| 'high' }`. Backends that can't honor the tier auto-price and warn. Defaults to `low`. |
| `defaultDryRun` | `boolean` | No | Pre-flight every write through Custody's dry-run. Defaults to `false`. |
| `defaultTimeoutMs` | `number` | No | How long `submitAndWait` polls before throwing `IntentPendingError`. |
| `env` | `object` | No | Environment source to scan — a map of variable names to values. Defaults to `process.env`. |
| `http` | `object` | No | Advanced: a custom HTTP transport (implements `CustodyHttpPort`). Defaults to the production fetch port; most callers omit it. |

## Example

```ts
const rippleCustody = await RippleCustody.fromEnv({
  primary: process.env.RIPPLE_CUSTODY_PRIMARY ?? '',
})
```
