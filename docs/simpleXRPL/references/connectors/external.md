---
seo:
    description: ExternalSigner is simpleXRPL's connector for keys held in a KMS or HSM. It signs through a caller-supplied port so the private key never enters the process.
labels:
  - simpleXRPL
  - SDK
---

# External

[[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/custodians/external/external-signer.ts#L40)

An external connector signs with a key held by a KMS (AWS, GCP) or an HSM (PKCS#11, CloudHSM). The SDK owns the rest of the business operation lifecycle.

`simpleXRPL` ships an AWS KMS adapter; for any other provider you must implement the port yourself.


## ExternalSigner.create()

Fetches the signer's public key and resolves the account it acts as.

### Signature

```ts
ExternalSigner.create(options: ExternalSignerOptions): Promise<ExternalSigner>
```

### Options

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `signer` | `object` | Yes | The KMS/HSM-backed signer for one key. Implements [ExternalSignerPort](#externalsignerport). |
| `address` | `string` | No | The XRPL address to act as. Defaults to the address derived from the signer's public key. |


## ExternalSignerPort

The signing seam to implement, defined by the `algorithm` field. 

### Secp256k1SignerPort

For secp256k1 keys (e.g., AWS KMS, most PKCS#11 HSMs).

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `algorithm` | `string` | Yes | Must be `secp256k1`. |
| `publicKey` | `function` | Yes | An async function, no arguments, returning the public key as an XRPL-format compressed hex string (33 bytes, `02`/`03` prefix). Signature: `() => Promise<string>`. |
| `signDigest` | `function` | Yes | An async function that takes a 32-byte digest (XRPL's SHA-512Half of the signing data, as a byte array) and returns the raw signature scalars — an object `{ r, s }` where each is a `bigint`. The SDK normalizes to low-S and DER-encodes before attaching the signature. Signature: `(digest: Uint8Array) => Promise<{ r: bigint, s: bigint }>`. |

### Ed25519SignerPort

For ed25519 keys (e.g., GCP KMS, some HSMs).

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `algorithm` | `string` | Yes | Must be `ed25519`. |
| `publicKey` | `function` | Yes | An async function, no arguments, returning the public key as an XRPL-format hex string (33 bytes: the `ED` prefix followed by the 32-byte raw key). Signature: `() => Promise<string>`. |
| `signMessage` | `function` | Yes | An async function that takes the message bytes (a byte array) and returns the raw 64-byte signature (a byte array). ed25519 hashes internally, so there is no pre-digest and no low-S step. Signature: `(message: Uint8Array) => Promise<Uint8Array>`. |


## AWS KMS adapter

`simpleXRPL` ships a secp256k1 port for AWS KMS, imported from the `simplexrpl/aws-kms` subpath. It requires the peer dependency `@aws-sdk/client-kms` and an `ECC_SECG_P256K1` (secp256k1) KMS key. Credentials come from the standard AWS chain.

### Signature

```ts
AwsKmsSigner.create(options: AwsKmsSignerOptions): AwsKmsSigner
```

### Options

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `keyId` | `string` | Yes | The KMS key id or ARN. Must be an `ECC_SECG_P256K1` (secp256k1) key. |
| `client` | `object` | No | A pre-built AWS KMS client — a `KMSClient` from `@aws-sdk/client-kms`. Provide this, or `region` to construct the default. |
| `region` | `string` | No | AWS region, used to construct the default client when `client` is omitted. |


## Example

```ts
// Sign with a key held in AWS KMS — the private key never leaves KMS.
import { AwsKmsSigner } from 'simplexrpl/aws-kms'
import { ExternalSigner } from 'simplexrpl'

const signer = AwsKmsSigner.create({
  keyId: process.env.AWS_KMS_KEY_ID ?? '',
  region: process.env.AWS_REGION ?? 'us-east-1',
})

// The XRPL account is derived from the key's public key.
const external = await ExternalSigner.create({ signer })
```
