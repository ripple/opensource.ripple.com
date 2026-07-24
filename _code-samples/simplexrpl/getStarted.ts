/**
 * simpleXRPL — Get Started walkthrough. Config is read from the environment
 * (never hard-code keys); endpoints target the XRPL Testnet.
 */
import {
  dispatch,
  isNativePath,
  LocalSigner,
  PalisadeCustody,
  RippleCustody,
  SignerCapabilityError,
  SimpleXRPL,
} from 'simplexrpl'
import type { Custodian, SubmissionPath, TransactorType } from 'simplexrpl'

// --- Initialize the client ---
// `SimpleXRPL.init(...)` is the only entry point — it binds already-authenticated
// connectors to a network and builds the account index. A single local signer
// (seeds from `XRPL_*_SEED`) is enough to run against the Testnet today.
const client = await SimpleXRPL.init({
  // Point at a rippled endpoint. `faucetUrl` is only used on test networks
  // (by `client.account.fund`).
  rippledUrl: 'wss://s.altnet.rippletest.net:51233',
  faucetUrl: 'https://faucet.altnet.rippletest.net/accounts',
  signers: [LocalSigner.fromEnv()],
  // `primarySigner` is the default backend for verbs called without an explicit
  // account; it defaults to `signers[0]`, so it's optional with a single signer.
})

// --- Discover your accounts ---
// Connectors discover their accounts at init; the client merges them into one
// index keyed by r-address.
for (const [address, account] of client.accounts) {
  console.log(address, '→', account.signer.kind)
}

// Resolve the account a verb would act on (no argument → the primary account).
const primary = client.resolveAccount()
console.log('primary:', primary.address)

// Read an account's on-chain state — a read, so no signer is required.
const state = await client.account.retrieve()
console.log('balance (XRP):', state.data.xrpBalance, '| sequence:', state.data.sequence)

// --- Check how operations route ---
// Before submitting, ask how each transactor would route for an account: signed
// locally, a custodian's native operation, the raw sign-only fallback, or rejected.
const TRANSACTORS: TransactorType[] = [
  'Payment',
  'TrustSet',
  'OfferCreate',
  'MPTokenIssuanceCreate',
  'CredentialCreate',
  'PermissionedDomainSet',
]
for (const transactor of TRANSACTORS) {
  let path: SubmissionPath | 'rejected' = 'rejected'
  try {
    path = dispatch(primary, transactor)
  } catch (error) {
    // `dispatch` throws when the connector can neither natively nor raw-sign it.
    if (!(error instanceof SignerCapabilityError)) throw error
  }
  const via =
    path === 'rejected'
      ? '(unsupported)'
      : isNativePath(path)
        ? '(custodian network)'
        : '(shared ledger)'
  console.log(`${transactor.padEnd(24)} → ${path} ${via}`)
}

// --- Send a payment ---
// Verbs use the primary account by default; target another bound account with `from`.
const result = await client.xrp.transfer({
  to: 'rDestination00000000000000000000000',
  amount: '10',
})
console.log('submitted:', result.txHash)

await client.disconnect()

// --- Connect a custodian (production) ---
// For production, construct each custodian connector on its own and pass them to
// `SimpleXRPL.init`'s `signers` in place of (or alongside) the local signer above,
// e.g. `signers: await connectCustodians(), primarySigner: /* your custodian */`.
export async function connectCustodians(): Promise<Custodian[]> {
  // Palisade — OAuth client credentials, acting on a specific vault/wallet.
  const palisade = await PalisadeCustody.create({
    baseUrl: 'https://api.sandbox.palisade.co',
    clientId: process.env.PALISADE_CLIENT_ID ?? '',
    clientSecret: process.env.PALISADE_CLIENT_SECRET ?? '',
    primary: {
      vaultId: process.env.PALISADE_VAULT_ID ?? '',
      walletId: process.env.PALISADE_WALLET_ID ?? '',
    },
    // Enable the raw sign-only fallback for transactors Palisade has no native
    // operation for. Off by default.
    allowRawSigning: false,
  })

  // Ripple Custody — an intent-author key exchanged for a token; one Custody
  // domain. `fromEnv` reads the `RIPPLE_CUSTODY_*` variables.
  const rippleCustody = await RippleCustody.fromEnv({
    primary: process.env.RIPPLE_CUSTODY_PRIMARY ?? '',
  })

  return [palisade, rippleCustody, LocalSigner.fromEnv()]
}
