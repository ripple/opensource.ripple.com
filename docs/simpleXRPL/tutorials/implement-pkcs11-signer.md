---
seo:
    description: Implement the ExternalSignerPort seam against a PKCS#11 HSM — you provide the public key and digest signing; the SDK owns the XRPL crypto.
labels:
  - simpleXRPL
  - SDK
---

# Implement A PKCS#11 HSM Signer

For an HSM, you implement the same `ExternalSignerPort` seam against your device: you provide only "give me the public key" and "sign this digest," and the SDK owns the XRPL crypto. HSM setups vary, so this is a reference to adapt rather than a drop-in.

```ts
/**
 * Bring-your-own HSM signer (PKCS#11).
 *
 * simpleXRPL ships an AWS KMS adapter (`simplexrpl/aws-kms`); for an HSM you
 * implement the same `ExternalSignerPort` seam against your device. The SDK owns
 * the XRPL crypto (SHA-512Half digest, low-S normalization, DER encoding); your
 * port only provides "give me the public key" and "sign this digest".
 *
 * As shipped this file is illustrative: the PKCS#11 adapter and its in-process
 * demo HSM at the bottom are commented out. Uncomment them (or wire the `Hsm`
 * interface to your real PKCS#11 binding, e.g. `pkcs11js`) for the snippet to
 * run.
 */
import { ExternalSigner, SimpleXRPL } from 'simplexrpl'
import type { Secp256k1SignerPort } from 'simplexrpl'

import { inMemoryLedger } from './mocks.js'

// === What you write with simpleXRPL ===
// `signer` is your Secp256k1SignerPort backed by the HSM (see the adapter
// below). `client.xrp`, `client.iou`, etc. now sign through the HSM — the
// private key never leaves the device. Build → sign (in the HSM) → submit.
async function transferWithHsm(signer: Secp256k1SignerPort): Promise<void> {
  const custody = await ExternalSigner.create({ signer })
  const client = await SimpleXRPL.init({
    xrpldUrl: 'wss://s.altnet.rippletest.net:51233', // XRPL Testnet
    signers: [custody],
    ledger: inMemoryLedger(), // omit in production to use the live XRPL connection
  })
  const result = await client.xrp.transfer({
    to: client.account.create().address,
    amount: '10',
  })
  console.log(
    `HSM account ${custody.primary.address} signed & submitted ` +
      `(source=${result.source}, hash=${result.txHash})`,
  )
  await client.disconnect()
}

// === Bring-your-own HSM (PKCS#11) — uncomment to run, or wire your device ===
// HSM setups vary (slot, PIN, key label, vendor library), so this is a
// reference to adapt. `demoHsm()` (from ./mocks) is an in-process stand-in so
// the file runs offline; swap it for a real PKCS#11 binding. The SDK owns low-S
// normalization + DER encoding; your port returns the raw `r‖s` scalars.
//
// import type { EcdsaSignature } from 'simplexrpl'
// import { demoHsm } from './mocks.js'
//
// // secp256k1 sizes: 32-byte scalars, 65-byte uncompressed point (0x04‖X‖Y).
// const SCALAR_BYTES = 32
// const POINT_BYTES = 65
// const COMPRESSED_EVEN = 0x02
// const COMPRESSED_ODD = 0x03
// const EVEN = 2
//
// /** The narrow slice of your HSM the signer needs (PKCS#11, ECDSA secp256k1). */
// interface Hsm {
//   // CKA_EC_POINT — DER OCTET STRING wrapping the uncompressed point 0x04‖X‖Y.
//   readonly ecPoint: () => Promise<Uint8Array>
//   // C_Sign with CKM_ECDSA (NOT CKM_ECDSA_SHA256 — the digest is pre-hashed);
//   // returns the raw 64-byte r‖s.
//   readonly signDigest: (digest: Uint8Array) => Promise<Uint8Array>
// }
//
// /** Strip the DER wrapper; the uncompressed point is the trailing 65 bytes. */
// function uncompressedPoint(ecPoint: Uint8Array): Buffer {
//   return Buffer.from(ecPoint).subarray(-POINT_BYTES)
// }
//
// /** An ExternalSignerPort backed by a PKCS#11 HSM. */
// class Pkcs11Signer implements Secp256k1SignerPort {
//   public readonly algorithm = 'secp256k1'
//   public constructor(private readonly hsm: Hsm) {}
//
//   public async publicKey(): Promise<string> {
//     const point = uncompressedPoint(await this.hsm.ecPoint())
//     const x = point.subarray(1, 1 + SCALAR_BYTES)
//     const y = point.subarray(1 + SCALAR_BYTES)
//     const prefix =
//       y[y.length - 1] % EVEN === 0 ? COMPRESSED_EVEN : COMPRESSED_ODD
//     return Buffer.concat([Buffer.from([prefix]), x])
//       .toString('hex')
//       .toUpperCase()
//   }
//
//   public async signDigest(digest: Uint8Array): Promise<EcdsaSignature> {
//     const raw = Buffer.from(await this.hsm.signDigest(digest))
//     return {
//       r: BigInt(`0x${raw.subarray(0, SCALAR_BYTES).toString('hex')}`),
//       s: BigInt(`0x${raw.subarray(SCALAR_BYTES).toString('hex')}`),
//     }
//   }
// }
//
// await transferWithHsm(new Pkcs11Signer(demoHsm()))
```

## See Also

- [account.create()](../references/verticals/account/create.md)
- [xrp.transfer()](../references/verticals/xrp/transfer.md)
