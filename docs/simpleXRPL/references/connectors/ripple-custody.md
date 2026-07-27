---
seo:
    description: RippleCustody is simpleXRPL's production connector for Ripple Custody — construction options and required fields for create() and fromEnv().
labels:
  - simpleXRPL
  - SDK
---

# Ripple Custody

[[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/custodians/ripple/construction.ts#L30)

Ripple Custody authenticates with an intent-author key exchanged for a token. A Custody deployment is per-tenant, so its gateway and token URLs point at the instance provisioned for you.


## RippleCustody.create()

Construct with every value passed explicitly.

### Signature

```ts
RippleCustody.create(options: RippleCustodyOptions): Promise<RippleCustody>
```

### Options

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `gatewayUrl` | `string` | Yes | The Custody gateway base URL. |
| `auth` | `RippleCustodyAuthOptions` | Yes | Intent-author credentials and token endpoint. |
| `auth.signingKey` | `string` | Yes | Intent-author private key: PEM contents, or a path to a `.pem` file. |
| `auth.tokenUrl` | `string` | Yes | The Custody token endpoint URL. |
| `auth.publicKey` | `string` | No | Matching public key, base64 SPKI DER. Derived from `signingKey` if omitted. |
| `domainId` | `string` | Yes | The Custody domain this custodian operates in. |
| `primary` | `string` | Yes | The primary account's r-address; validated against the discovered set. |
| `allowRawSigning` | `boolean` | No | Enable the raw-signing fallback. Defaults to `false`. |
| `defaultFee` | `FeeIntent` | No | Fee tier: `{ priority?: 'low' \| 'medium' \| 'high' }`. Backends that can't honor the tier auto-price and warn. Defaults to `low`. |
| `defaultDryRun` | `boolean` | No | Pre-flight every write through Custody's dry-run. Defaults to `false`. |
| `defaultTimeoutMs` | `number` | No | How long `submitAndWait` polls before throwing `IntentPendingError`. |
| `http` | `CustodyHttpPort` | No | Advanced: a custom HTTP transport, shape `{ send: (request) => Promise<response> }`. Defaults to the production fetch port; most callers omit it. |


## RippleCustody.fromEnv()

Reads the endpoints, credentials, and domain from environment variables.

### Signature

```ts
RippleCustody.fromEnv(options: RippleCustodyFromEnvOptions): Promise<RippleCustody>
```

### Options

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `primary` | `string` | Yes | The primary account's r-address; validated against the discovered set. |
| `allowRawSigning` | `boolean` | No | Enable the raw-signing fallback. Defaults to `false`. |
| `defaultFee` | `FeeIntent` | No | Fee tier: `{ priority?: 'low' \| 'medium' \| 'high' }`. Backends that can't honor the tier auto-price and warn. Defaults to `low`. |
| `defaultDryRun` | `boolean` | No | Pre-flight every write through Custody's dry-run. Defaults to `false`. |
| `defaultTimeoutMs` | `number` | No | How long `submitAndWait` polls before throwing `IntentPendingError`. |
| `env` | `object` | No | The source the `RIPPLE_CUSTODY_*` environment variables are read from, as a map of names to values. Defaults to `process.env`. |
| `http` | `object` | No | A custom HTTP transport (implements `CustodyHttpPort`). Defaults to the production fetch port; most callers omit it. |

{% admonition type="info" name="Note" %}
`env` requires these keys:
- `RIPPLE_CUSTODY_GATEWAY_URL`
- `RIPPLE_CUSTODY_AUTH_SIGNING_KEY`
- `RIPPLE_CUSTODY_AUTH_TOKEN_URL`
- `RIPPLE_CUSTODY_AUTH_PUBLIC_KEY` (optional)
- `RIPPLE_CUSTODY_DOMAIN_ID`
{% /admonition %}


## Example

```ts
const rippleCustody = await RippleCustody.fromEnv({
  primary: process.env.RIPPLE_CUSTODY_PRIMARY ?? '',
})
```
