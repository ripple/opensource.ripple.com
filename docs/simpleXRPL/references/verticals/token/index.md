---
seo:
    description: The Token vertical in simpleXRPL issues and manages Multi-Purpose Tokens (MPTs) and places DEX offers.
labels:
  - SDKs
---

# Token

The `Token` vertical issues and manages [Multi-Purpose Tokens (MPTs)](https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens) and places offers on the decentralized exchange.

| Method | Description |
| --- | --- |
| [issue](issue.md) | Create a new MPT issuance. |
| [transfer](transfer.md) | Send MPT units to another account. |
| [authorize](authorize.md) | Opt the calling account in to holding a token. |
| [unauthorize](unauthorize.md) | Opt the calling account out of holding a token. |
| [grantHolder](grantHolder.md) | Issuer authorizes a specific holder (allow-listing). |
| [revokeHolder](revokeHolder.md) | Issuer revokes a specific holder's permission. |
| [lock](lock.md) | Lock a token issuance, or a specific holder's balance. |
| [unlock](unlock.md) | Unlock a token issuance, or a specific holder's balance. |
| [destroy](destroy.md) | Destroy an MPT issuance. |
| [createOffer](createOffer.md) | Place an offer on the DEX. |
| [cancelOffer](cancelOffer.md) | Cancel a standing offer. |
| [retrieve](retrieve.md) | Read a single MPT issuance by id. |
| [list](list.md) | List the MPTs an account holds or issued. |
| [listOffers](listOffers.md) | List the DEX offers placed by an account. |
