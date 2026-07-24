---
seo:
    description: Implement the ExternalSignerPort seam end to end with a mock signer, and switch between secp256k1 and ed25519.
labels:
  - simpleXRPL
  - SDK
---

# Implement An External Signer

The `ExternalSignerPort` seam lets you plug in your own signer. This sample implements it with an in-process key so it actually signs and submits against a mock ledger, and shows how to switch between the secp256k1 and ed25519 schemes. In production you swap the mock for a KMS or HSM signer — nothing else changes.

```ts
/**
 * External signing end to end, with a mock signer — and switching algorithms.
 *
 * The `ExternalSignerPort` seam covers both XRPL signature schemes. This sample
 * implements it with an in-process key (via `@noble/curves`) so it actually
 * signs and "submits" a transaction against a mock ledger — handy for local
 * tests. In production you swap the mock for a KMS or HSM signer; nothing else
 * changes.
 *
 * secp256k1 vs ed25519 is just a different port implementation — pick whichever
 * your signer's key uses. The SDK routes the crypto accordingly (secp256k1:
 * SHA-512Half digest → low-S → DER; ed25519: sign the message directly).
 */
import { ed25519 } from '@noble/curves/ed25519'
import { secp256k1 } from '@noble/curves/secp256k1'
import { ExternalSigner, SimpleXRPL } from 'simplexrpl'
import type { Ed25519SignerPort, Secp256k1SignerPort } from 'simplexrpl'

import { inMemoryLedger } from './mocks.js'

// --- Mock signers (in-process keys — for local testing only) ---------------

/**
 * A mock secp256k1 signer. A real one delegates the digest to a KMS/HSM.
 *
 * @param privHex - The 32-byte private key hex (test only).
 * @returns The port.
 */
function mockSecp256k1(privHex: string): Secp256k1SignerPort {
  const priv = Buffer.from(privHex, 'hex')
  return {
    algorithm: 'secp256k1',
    publicKey: async (): Promise<string> =>
      Buffer.from(secp256k1.getPublicKey(priv, true))
        .toString('hex')
        .toUpperCase(),
    signDigest: async (digest: Uint8Array) => {
      const sig = secp256k1.sign(digest, priv)
      return { r: sig.r, s: sig.s }
    },
  }
}

/**
 * A mock ed25519 signer. XRPL prefixes the public key with `ED`.
 *
 * @param privHex - The 32-byte private key hex (test only).
 * @returns The port.
 */
function mockEd25519(privHex: string): Ed25519SignerPort {
  const priv = Buffer.from(privHex, 'hex')
  return {
    algorithm: 'ed25519',
    publicKey: async (): Promise<string> =>
      `ED${Buffer.from(ed25519.getPublicKey(priv)).toString('hex')}`.toUpperCase(),
    signMessage: async (message: Uint8Array): Promise<Uint8Array> =>
      ed25519.sign(message, priv),
  }
}

/**
 * Bind a signer, then build + sign + submit a real transfer through it.
 *
 * @param signer - The external signer port (either algorithm).
 * @param label - A label for the log line.
 */
async function signAndSubmit(
  signer: Secp256k1SignerPort | Ed25519SignerPort,
  label: string,
): Promise<void> {
  const custody = await ExternalSigner.create({ signer })
  const client = await SimpleXRPL.init({
    rippledUrl: 'wss://s.altnet.rippletest.net:51233',
    signers: [custody],
    ledger: inMemoryLedger(),
  })
  const result = await client.xrp.transfer({
    to: client.account.create().address,
    amount: '10',
  })
  console.log(
    `${label}: account ${custody.primary.address} signed & submitted ` +
      `(source=${result.source}, hash=${result.txHash})`,
  )
  await client.disconnect()
}

// Switch algorithms by swapping the port — the pipeline is identical.
await signAndSubmit(
  mockSecp256k1(
    'c9537c5a2f3f7e1d4b6a8c0e2f4d6b8a1c3e5f7091b3d5f7a9c1e3050709b0d0f',
  ),
  'secp256k1',
)
await signAndSubmit(
  mockEd25519(
    '9d61b19deffebc3a6c1f6b2d7e5f8a0b1c2d3e4f5061728394a5b6c7d8e9f001',
  ),
  'ed25519',
)
```

## See Also

- [account.create()](../references/verticals/account/create.md)
- [xrp.transfer()](../references/verticals/xrp/transfer.md)
