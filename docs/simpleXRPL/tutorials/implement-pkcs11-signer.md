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
 * implement the same `ExternalSignerPort` seam against your device. HSM setups
 * vary (slot, PIN, key label, vendor library), so this is a reference to adapt
 * rather than a drop-in — the SDK owns the XRPL crypto (SHA-512Half digest,
 * low-S normalization, DER encoding); you only provide "give me the public key"
 * and "sign this digest".
 *
 * Wire the `Hsm` interface below to your PKCS#11 binding (e.g. `pkcs11js` or
 * `graphene-lib`); the exact calls are noted per method.
 */
import { secp256k1 } from '@noble/curves/secp256k1'
import { ExternalSigner, SimpleXRPL } from 'simplexrpl'
import type { EcdsaSignature, Secp256k1SignerPort } from 'simplexrpl'

import { inMemoryLedger } from './mocks.js'

/** secp256k1 sizes: 32-byte scalars, 65-byte uncompressed point (0x04‖X‖Y). */
const SCALAR_BYTES = 32
const POINT_BYTES = 65
const COMPRESSED_EVEN = 0x02
const COMPRESSED_ODD = 0x03
const EVEN = 2

/**
 * The narrow slice of your HSM the signer needs. Implement it with your PKCS#11
 * binding against an ECDSA secp256k1 key.
 */
interface Hsm {
  /**
   * The key's public point. In PKCS#11: `C_GetAttributeValue(session,
   * pubKeyHandle, [CKA_EC_POINT])` — a DER OCTET STRING wrapping the
   * uncompressed point (`0x04‖X‖Y`).
   */
  readonly ecPoint: () => Promise<Uint8Array>

  /**
   * Sign a 32-byte digest and return the raw 64-byte `r‖s`. In PKCS#11:
   * `C_SignInit(session, { mechanism: CKM_ECDSA }, privKeyHandle)` then
   * `C_Sign(session, digest)`.
   *
   * IMPORTANT: use `CKM_ECDSA` (signs the digest as-is), NOT `CKM_ECDSA_SHA256`
   * — XRPL's digest is SHA-512Half, and letting the HSM re-hash would corrupt
   * the signature.
   */
  readonly signDigest: (digest: Uint8Array) => Promise<Uint8Array>
}

/**
 * Strip the DER OCTET STRING wrapper `CKA_EC_POINT` uses; the uncompressed
 * point is the trailing 65 bytes.
 *
 * @param ecPoint - The raw `CKA_EC_POINT` attribute value.
 * @returns The uncompressed point (`0x04‖X‖Y`).
 */
function uncompressedPoint(ecPoint: Uint8Array): Buffer {
  return Buffer.from(ecPoint).subarray(-POINT_BYTES)
}

/** An {@link Secp256k1SignerPort} backed by a PKCS#11 HSM. */
class Pkcs11Signer implements Secp256k1SignerPort {
  public readonly algorithm = 'secp256k1'

  public constructor(private readonly hsm: Hsm) {}

  /**
   * Compress the HSM's public point to XRPL's 33-byte hex form.
   *
   * @returns The compressed public key hex.
   */
  public async publicKey(): Promise<string> {
    const point = uncompressedPoint(await this.hsm.ecPoint())
    const x = point.subarray(1, 1 + SCALAR_BYTES)
    const y = point.subarray(1 + SCALAR_BYTES)
    const prefix =
      y[y.length - 1] % EVEN === 0 ? COMPRESSED_EVEN : COMPRESSED_ODD
    return Buffer.concat([Buffer.from([prefix]), x])
      .toString('hex')
      .toUpperCase()
  }

  /**
   * Split the HSM's raw `r‖s` signature into scalars; the SDK normalizes to
   * low-S and DER-encodes.
   *
   * @param digest - The 32-byte digest to sign.
   * @returns The signature scalars.
   */
  public async signDigest(digest: Uint8Array): Promise<EcdsaSignature> {
    const raw = Buffer.from(await this.hsm.signDigest(digest))
    return {
      r: BigInt(`0x${raw.subarray(0, SCALAR_BYTES).toString('hex')}`),
      s: BigInt(`0x${raw.subarray(SCALAR_BYTES).toString('hex')}`),
    }
  }
}

// DEMO ONLY: an in-process key standing in for the HSM so this file runs
// end to end. Your real `Hsm` calls PKCS#11 (see the notes above) and returns
// the same shapes — a DER-wrapped `CKA_EC_POINT` and a raw `r‖s` — so nothing
// downstream changes.
function demoHsm(privHex: string): Hsm {
  const priv = Buffer.from(privHex, 'hex')
  return {
    ecPoint: async (): Promise<Uint8Array> =>
      secp256k1.getPublicKey(priv, false), // 65-byte 0x04‖X‖Y
    signDigest: async (digest: Uint8Array): Promise<Uint8Array> =>
      secp256k1.sign(digest, priv).toCompactRawBytes(), // raw r‖s
  }
}

const hsm = demoHsm(
  'c9537c5a2f3f7e1d4b6a8c0e2f4d6b8a1c3e5f7091b3d5f7a9c1e3050709b0d0f',
)
const custody = await ExternalSigner.create({ signer: new Pkcs11Signer(hsm) })
const client = await SimpleXRPL.init({
  rippledUrl: 'wss://s.altnet.rippletest.net:51233', // XRPL Testnet
  signers: [custody],
  ledger: inMemoryLedger(), // omit in production to use the live XRPL connection
})

// `client.xrp`, `client.iou`, etc. now sign through the HSM — the private key
// never leaves the device. Build → sign (in the HSM) → submit:
const destination = client.account.create().address
const result = await client.xrp.transfer({ to: destination, amount: '10' })
console.log(
  `HSM account ${custody.primary.address} signed & submitted ` +
    `(source=${result.source}, hash=${result.txHash})`,
)
await client.disconnect()
```

## See Also

- [account.create()](../references/verticals/account/create.md)
- [xrp.transfer()](../references/verticals/xrp/transfer.md)
