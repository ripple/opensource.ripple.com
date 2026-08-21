---
seo:
    description: Set up a permissioned domain that restricts participation to credential holders, then scope DEX offers to it.
labels:
  - simpleXRPL
  - SDK
---

# Create A Permissioned Domain

A permissioned domain restricts who can participate based on the credentials they hold. Create the domain with the credentials it accepts, then scope DEX offers to it with `domainID`.

```ts
/**
 * Set up a permissioned domain and trade inside it.
 *
 * A permissioned domain restricts who can participate based on the credentials
 * they hold. Create the domain with the credentials it accepts, then scope DEX
 * offers to it with `domainID`.
 */
import { LocalSigner, SimpleXRPL } from 'simplexrpl'

const client = await SimpleXRPL.init({
  xrpldUrl: 'wss://s.altnet.rippletest.net:51233',
  signers: [LocalSigner.fromEnv()],
})

// 1. Create the domain, listing the credentials it accepts (issuer + type).
const domain = await client.domain.create({
  credList: [
    { issuer: 'rKycIssuer0000000000000000000000000', credType: 'KYC' },
    { issuer: 'rAccreditation000000000000000000000', credType: 'ACCREDITED' },
  ],
})
const domainID = domain.intent.domainID
console.log('permissioned domain:', domainID)

// 2. Update the accepted credentials later if the policy changes.
await client.domain.setCredentials({
  domain: domainID,
  credList: [
    { issuer: 'rKycIssuer0000000000000000000000000', credType: 'KYC' },
  ],
})

// 3. Place a domain-scoped DEX offer. With `domainID` set, the offer defaults
//    to hybrid (also crosses the open DEX) unless `hybrid: false` is passed.
await client.iou.sellOffer({
  ticker: 'USD',
  amount: '100',
  orderType: 'limit',
  price: { currency: 'XRP', amount: '50' },
  domainID,
  hybrid: false, // permissioned-only: do not touch the open DEX
})

// 4. Read it back (no signer required). `retrieve` resolves a domain by id and
//    returns its owner and accepted-credential list (decoded from hex); `list`
//    returns every domain owned by an account (defaults to the primary).
const read = await client.domain.retrieve({ domainID })
console.log('accepts:', read.data?.credList)

const owned = await client.domain.list()
console.log('owned domains:', owned.domains)

await client.disconnect()
```

## See Also

- [domain.create()](../references/verticals/domain/create.md)
- [domain.setCredentials()](../references/verticals/domain/setCredentials.md)
- [domain.retrieve()](../references/verticals/domain/retrieve.md)
- [domain.list()](../references/verticals/domain/list.md)
- [iou.sellOffer()](../references/verticals/iou/sellOffer.md)
