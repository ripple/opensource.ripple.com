---
seo:
    description: RippleCustody is simpleXRPL's production connector for Ripple Custody — construction options and required fields for create() and fromEnv().
labels:
  - simpleXRPL
  - SDK
---

# Ripple Custody

[[Source]](https://github.com/ripple/simpleXRPL/blob/2e7cf1f85dbecb529e95da97cc1178e0813259d6/src/custodians/ripple/construction.ts#L37)

Ripple Custody authenticates with an intent-author key exchanged for a token. A Custody deployment is per-tenant, so its gateway and token URLs point at the instance provisioned for you. See: [Generate a key pair and register a public key](https://docs.ripple.com/products/custody/identity-and-access/authentication/generate-api-keys-and-register) for instructions on creating API credentials to fill in this constructor.


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
| `auth.signingKey` | `string` | Yes | Intent-author private key, as PEM contents. |
| `auth.tokenUrl` | `string` | Yes | The Custody token endpoint URL. |
| `auth.publicKey` | `string` | No | Matching public key, base64 SPKI DER. Derived from `signingKey` if omitted. |
| `auth.clientId` | `string` | No | The OIDC client id to authenticate as. Defaults to `customer_api`. |
| `domainId` | `string` | Yes | The Custody domain this custodian operates in. |
| `primary` | `string` | Yes | The primary account's r-address; validated against the discovered set. |
| `allowRawSigning` | `boolean` | No | Enable the raw-signing fallback. Defaults to `false`. |
| `defaultFee` | [`FeeIntent`](../types.md#feeintent) | No | House fee intent — a priority tier and/or a `maxFeeDrops` cap. Backends that can't honor the tier auto-price and warn. Defaults to `low`. |
| `defaultDryRun` | `boolean` | No | Pre-flight every write through Custody's dry-run. Defaults to `false`. |
| `defaultTimeoutMs` | `number` | No | How long `submitAndWait` polls before throwing `IntentPendingError`. |
| `http` | `CustodyHttpPort` | No | Advanced: a custom HTTP transport, shape `{ send: (request) => Promise<response> }`. Defaults to the production fetch port; most callers omit it. |

{% admonition type="warning" name="Caution" %}
Enabling `allowRawSigning` weakens the custodian's controls. On the raw path the custodian signs an opaque payload rather than a structured operation, so its transaction-level controls (transfer policies, allow-lists, and approval rules keyed to operation semantics) cannot inspect what is being signed. Ripple Custody types this payload `Unsafe`. `xrpl.js` protocol validation still runs on every path, so malformed transactions are still rejected; what is lost is the custodian's ability to reason about the transaction's intent.

Leave it off unless a specific transactor requires it, and prefer routing those operations through a signer that models them natively.
{% /admonition %}


## RippleCustody.fromEnv()

Reads the endpoints, credentials, and domain from environment variables.

The `env` requires these keys:
- `RIPPLE_CUSTODY_GATEWAY_URL`
- `RIPPLE_CUSTODY_AUTH_SIGNING_KEY`
- `RIPPLE_CUSTODY_AUTH_TOKEN_URL`
- `RIPPLE_CUSTODY_AUTH_PUBLIC_KEY` (optional)
- `RIPPLE_CUSTODY_AUTH_CLIENT_ID` (optional)
- `RIPPLE_CUSTODY_DOMAIN_ID`

### Signature

```ts
RippleCustody.fromEnv(options: RippleCustodyFromEnvOptions): Promise<RippleCustody>
```

### Options

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `primary` | `string` | Yes | The primary account's r-address; validated against the discovered set. |
| `allowRawSigning` | `boolean` | No | Enable the raw-signing fallback. Defaults to `false`. |
| `defaultFee` | [`FeeIntent`](../types.md#feeintent) | No | House fee intent — a priority tier and/or a `maxFeeDrops` cap. Backends that can't honor the tier auto-price and warn. Defaults to `low`. |
| `defaultDryRun` | `boolean` | No | Pre-flight every write through Custody's dry-run. Defaults to `false`. |
| `defaultTimeoutMs` | `number` | No | How long `submitAndWait` polls before throwing `IntentPendingError`. |
| `env` | `object` | No | The source the `RIPPLE_CUSTODY_*` environment variables are read from, as a map of names to values. Defaults to `process.env`. |
| `http` | `object` | No | A custom HTTP transport (implements `CustodyHttpPort`). Defaults to the production fetch port; most callers omit it. |

{% admonition type="warning" name="Caution" %}
Enabling `allowRawSigning` weakens the custodian's controls. On the raw path the custodian signs an opaque payload rather than a structured operation, so its transaction-level controls (transfer policies, allow-lists, and approval rules keyed to operation semantics) cannot inspect what is being signed. Ripple Custody types this payload `Unsafe`. `xrpl.js` protocol validation still runs on every path, so malformed transactions are still rejected; what is lost is the custodian's ability to reason about the transaction's intent.

Leave it off unless a specific transactor requires it, and prefer routing those operations through a signer that models them natively.
{% /admonition %}

### Resolving the signing key

`fromEnv()` accepts `RIPPLE_CUSTODY_AUTH_SIGNING_KEY` in three forms, chosen by what the value starts with:

| Value starts with | Resolved as |
| --- | --- |
| `-----BEGIN` | Literal PEM contents. |
| `arn:aws:secretsmanager:` | An AWS Secrets Manager secret ARN — the secret is fetched and parsed. |
| anything else | A path to a `.pem` file on disk, read at startup. |

For the Secrets Manager path, the secret's value must be a JSON object (not a raw PEM string) with these fields:

| Field | Required | Description |
| --- | --- | --- |
| `private_key` | Yes | The intent-author private key, PEM contents. |
| `user_alias` | Yes | The Custody user this keypair belongs to. Validated as present so an incomplete secret fails fast. |
| `public_key` | No | The matching public key. Used when `RIPPLE_CUSTODY_AUTH_PUBLIC_KEY` is not set. |

The AWS client is constructed with no explicit credentials, so it uses the default AWS SDK credential provider chain: environment variables, a shared profile, or the runtime's IAM role. Resolution throws `SimpleXRPLError` if the secret is empty, isn't valid JSON, or is missing `private_key` or `user_alias`.


## Example

```ts
const rippleCustody = await RippleCustody.fromEnv({
  primary: process.env.RIPPLE_CUSTODY_PRIMARY ?? '',
})
```
