---
seo:
    description: Sign transactions with a secp256k1 key held in AWS KMS using the simplexrpl/aws-kms adapter; the private key never leaves KMS.
labels:
  - simpleXRPL
  - SDK
---

# Sign With AWS KMS

`simpleXRPL` ships an [AWS KMS](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html) adapter as a subpath import (`simplexrpl/aws-kms`). The private key stays in KMS and never enters the process — the SDK hands KMS a digest and assembles the signature.

```ts
/**
 * Sign with a key held in AWS KMS.
 *
 * simpleXRPL ships an AWS KMS adapter as a subpath import. The private key
 * stays in KMS and never enters the process: the SDK hands KMS a digest and
 * assembles the signature. Requires the optional peer dependency
 * `@aws-sdk/client-kms` and an `ECC_SECG_P256K1` (secp256k1) KMS key.
 *
 * Credentials come from the standard AWS chain (env vars, shared profile, or an
 * instance/role). This drops into your app once those and the key id are set.
 */
import { AwsKmsSigner } from 'simplexrpl/aws-kms'
import { ExternalSigner, SimpleXRPL } from 'simplexrpl'

// The KMS-backed signer. Its XRPL account is derived from the key's public key.
const signer = AwsKmsSigner.create({
  keyId: process.env.AWS_KMS_KEY_ID ?? '',
  region: process.env.AWS_REGION ?? 'us-east-1',
})
const custody = await ExternalSigner.create({ signer })

const client = await SimpleXRPL.init({
  xrpldUrl: 'wss://s.altnet.rippletest.net:51233', // XRPL Testnet
  signers: [custody],
})

// The KMS account signs like any other connector — build, sign (in KMS), submit.
// Replace with a real, funded destination r-address.
const result = await client.xrp.transfer({
  to: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',
  amount: '10',
})
console.log('submitted via KMS-held key:', result.txHash)

await client.disconnect()
```

## See Also

- [xrp.transfer()](../references/verticals/xrp/transfer.md)
