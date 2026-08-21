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
 * External signing end to end — and switching algorithms.
 *
 * The `ExternalSignerPort` seam covers both XRPL signature schemes; the SDK
 * routes the crypto by algorithm (secp256k1: SHA-512Half digest → low-S → DER;
 * ed25519: sign the message directly). The procedure below is identical for
 * either — you just pass a different port.
 *
 * As shipped this file is illustrative: the in-process demo signers at the
 * bottom are commented out. Uncomment them (or plug in your own KMS/HSM-backed
 * `ExternalSignerPort`) for the snippet to run.
 */
import { ExternalSigner, SimpleXRPL } from 'simplexrpl'
import type {
  Ed25519SignerPort,
  LedgerPort,
  Secp256k1SignerPort,
  SubmitResponse,
  Transaction,
  TxResponse,
} from 'simplexrpl'

// === What you write with simpleXRPL ===
// Bind your external signer, then build → sign → submit. The pipeline is the
// same whether the signer is secp256k1 or ed25519.
async function signAndSubmit(
  signer: Secp256k1SignerPort | Ed25519SignerPort,
  label: string,
): Promise<void> {
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
    `${label}: account ${custody.primary.address} signed & submitted ` +
      `(source=${result.source}, hash=${result.txHash})`,
  )
  await client.disconnect()
}

// === Test scaffolding — NOT production code ===
// In a real app you omit `ledger` from `SimpleXRPL.init` and the SDK uses the
// live XRPL connection. This in-memory stand-in lets the example run offline:
// it fills the network fields and reports a successful submission without
// touching a network.

/** An in-memory `LedgerPort`: accepts any signed blob and reports success. */
function inMemoryLedger(): LedgerPort {
  return {
    autofill: async (tx: Transaction): Promise<Transaction> => ({
      ...tx,
      Sequence: 1,
      Fee: '12',
      LastLedgerSequence: 100,
    }),
    submit: async (): Promise<SubmitResponse> =>
      ({ result: {} }) as unknown as SubmitResponse,
    submitAndWait: async (): Promise<TxResponse> =>
      ({
        result: { hash: 'MOCKHASH', meta: { TransactionResult: 'tesSUCCESS' } },
      }) as unknown as TxResponse,
    request: async <T>(): Promise<T> => ({}) as T,
  }
}

// === Demo signers — uncomment to run, or replace with your own KMS/HSM ===
// These use in-process keys via `@noble/curves` so the file runs offline; a
// real port delegates the digest/message to your KMS or HSM. Switch algorithms
// by swapping the port — `signAndSubmit` above doesn't change.
//
// import { ed25519 } from '@noble/curves/ed25519'
// import { secp256k1 } from '@noble/curves/secp256k1'
//
// function mockSecp256k1(privHex: string): Secp256k1SignerPort {
//   const priv = Buffer.from(privHex, 'hex')
//   return {
//     algorithm: 'secp256k1',
//     publicKey: async (): Promise<string> =>
//       Buffer.from(secp256k1.getPublicKey(priv, true))
//         .toString('hex')
//         .toUpperCase(),
//     signDigest: async (digest: Uint8Array) => {
//       const sig = secp256k1.sign(digest, priv)
//       return { r: sig.r, s: sig.s }
//     },
//   }
// }
//
// function mockEd25519(privHex: string): Ed25519SignerPort {
//   const priv = Buffer.from(privHex, 'hex')
//   return {
//     algorithm: 'ed25519',
//     publicKey: async (): Promise<string> =>
//       `ED${Buffer.from(ed25519.getPublicKey(priv)).toString('hex')}`.toUpperCase(),
//     signMessage: async (message: Uint8Array): Promise<Uint8Array> =>
//       ed25519.sign(message, priv),
//   }
// }
//
// await signAndSubmit(
//   mockSecp256k1(
//     'c9537c5a2f3f7e1d4b6a8c0e2f4d6b8a1c3e5f7091b3d5f7a9c1e3050709b0d0f',
//   ),
//   'secp256k1',
// )
// await signAndSubmit(
//   mockEd25519(
//     '9d61b19deffebc3a6c1f6b2d7e5f8a0b1c2d3e4f5061728394a5b6c7d8e9f001',
//   ),
//   'ed25519',
// )
```

## See Also

- [account.create()](../references/verticals/account/create.md)
- [xrp.transfer()](../references/verticals/xrp/transfer.md)
