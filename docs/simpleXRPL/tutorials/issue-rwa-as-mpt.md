---
seo:
    description: Issue a Real-World Asset as a Multi-Purpose Token (MPT) through Ripple Custody, with XLS-89 metadata validated before submission.
labels:
  - simpleXRPL
  - SDK
---

# Issue An RWA As An MPT

Real-World Assets are issued as Multi-Purpose Tokens (MPTs) via the `token` vertical. Here the issuer is a Ripple Custody account, so Custody signs and submits the issuance as one governed action, with XLS-89 metadata validated before submission.

```ts
/**
 * Issue a Real-World Asset (RWA) through Ripple Custody.
 *
 * RWAs are issued as Multi-Purpose Tokens (MPTs) via the `token` vertical.
 * Metadata follows the XLS-89 standard and is validated before submission
 * (`asset_class: 'rwa'` requires an `asset_subclass`). Here the issuer is a
 * Ripple Custody account: Custody signs and submits the issuance as one
 * governed action, subject to the domain's approval policy.
 */
import { RippleCustody, SimpleXRPL } from 'simplexrpl'

// The Custody-held issuer account; Custody governs every write it signs.
const ISSUER_ADDRESS = process.env.RIPPLE_CUSTODY_PRIMARY ?? ''

// Config (gateway, token endpoint, domain, intent-author key) comes from
// `RIPPLE_CUSTODY_*` environment variables via `fromEnv`.
const custody = await RippleCustody.fromEnv({ primary: ISSUER_ADDRESS })

const client = await SimpleXRPL.init({
  rippledUrl: 'wss://s.altnet.rippletest.net:51233', // XRPL Testnet
  signers: [custody],
})

const result = await client.token.issue(
  {
    metadata: {
      ticker: 'TBILL',
      name: 'Acme 3-Month T-Bill',
      icon: 'https://acme.example/tbill.png',
      asset_class: 'rwa',
      asset_subclass: 'treasury',
      issuer_name: 'Acme Capital',
    },
    // 2 decimal places of display precision.
    assetScale: 2,
    // 0.5% fee on secondary transfers.
    transferFee: 0.5,
    // Keep the issuer able to claw back (compliance); other capabilities on.
    flags: { canClawback: true, canTransfer: true },
  },
  // Issue as the Custody account. Omit `from` to use the primary signer.
  { from: ISSUER_ADDRESS },
)

// `MPTokenIssuanceCreate` is native to Ripple Custody, so this returns once the
// governed action reaches a terminal state — or throws `IntentPendingError` if
// it's still awaiting approval past the timeout.
console.log('issued MPT:', result.intent.mptIssuanceId)

// Read the issuance back (no signer required): flags are decoded to booleans,
// the transfer fee to a percentage, and XLS-89 metadata is parsed.
const token = await client.token.retrieve({
  mptIssuanceId: result.intent.mptIssuanceId,
})
console.log('transfer fee (%):', token.data?.transferFee)
console.log('can claw back:', token.data?.flags.canClawback)
console.log('metadata:', token.data?.metadata?.name)

await client.disconnect()
```

## See Also

- [`token.issue()`](../references/verticals/token/issue.md)
- [`token.retrieve()`](../references/verticals/token/retrieve.md)
