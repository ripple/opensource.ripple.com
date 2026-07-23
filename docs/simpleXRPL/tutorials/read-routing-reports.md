---
seo:
    description: Ask how a transactor would route for an account — native, raw-signing fallback, local, or rejected — before you submit.
labels:
  - simpleXRPL
  - SDK
---

# Read Routing Reports

Before submitting, you can ask how a given transactor would route for a given account: signed locally, through a custodian’s native operation, via the raw sign-only fallback, or rejected. This lets you (and your reviewers) see exactly what will happen up front.

```ts
/**
 * Call the routing report.
 *
 * Before submitting, you can ask how a given transactor would route for a
 * given account: signed locally, through a custodian's native operation, via
 * the raw sign-only fallback, or rejected. `dispatch` returns that path and
 * `isNativePath` tells you whether it goes through the custodian's own network
 * rather than the shared ledger.
 */
import {
  dispatch,
  isNativePath,
  LocalSigner,
  SignerCapabilityError,
  SimpleXRPL,
} from 'simplexrpl'
import type { SubmissionPath, TransactorType } from 'simplexrpl'

const client = await SimpleXRPL.init({
  rippledUrl: 'wss://s.altnet.rippletest.net:51233',
  signers: [LocalSigner.fromEnv()],
})

// The transactors the SDK's verticals emit.
const TRANSACTORS: TransactorType[] = [
  'Payment',
  'TrustSet',
  'AccountSet',
  'OfferCreate',
  'OfferCancel',
  'Clawback',
  'MPTokenIssuanceCreate',
  'CredentialCreate',
  'PermissionedDomainSet',
]

const account = client.resolveAccount()

// A connector also advertises what it can do directly via `capabilities()`.
const caps = account.signer.capabilities()
console.log(`account ${account.address} (${account.signer.kind})`)
console.log('  raw signing:', caps.allowRaw ? 'enabled' : 'disabled')

for (const transactor of TRANSACTORS) {
  let path: SubmissionPath | 'rejected' = 'rejected'
  try {
    path = dispatch(account, transactor)
  } catch (error) {
    // `dispatch` throws when the custodian can neither natively nor raw-sign
    // the transactor; anything else is unexpected, so rethrow it.
    if (!(error instanceof SignerCapabilityError)) throw error
  }
  const via =
    path === 'rejected'
      ? '(unsupported)'
      : isNativePath(path)
        ? '(custodian network)'
        : '(shared ledger)'
  console.log(`  ${transactor.padEnd(24)} → ${path} ${via}`)
}

await client.disconnect()
```

## See Also

- [Connector Routing](../references/connector-routing.md)
