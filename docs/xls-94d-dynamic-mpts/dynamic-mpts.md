---
seo:
    description: Create MPTs with the option of changing specific fields or flags.
labels:
  - Multi-Purpose Tokens (MPTs), MPT
---

# Dynamic Multi-Purpose Tokens

Standard Multi-Purpose Tokens (MPT) become immutable after issuance, but some use cases may require the capability to update the referenced data object after the initial issuance of the MPT. For example, an issuer might need to adjust transfer fees based on market conditions, or update token metadata. Dynamic MPTs address this by allowing issuers to explicitly declare which specific fields and flags can be modified when issuing the token. Fields not marked as mutable during initial issuance remain immutable.

## Creating a Dynamic MPT

When you issue an MPT, you can make it dynamic by declaring some properties as mutable in the `MutableFlags` field in the `MPTokenIssuanceCreate` transaction. This gives you flexibility to adapt your token's properties as your business needs evolve. You must carefully consider which properties should be mutable, as this cannot be changed later. By default, all MPT properties are immutable unless explicitly marked as mutable.

## Modifying a Dynamic MPT

After creating an MPT with mutable properties, you can update those specific fields or flags using the `MPTokenIssuanceSet` transaction. When you use this transaction, you provide new values for the mutable fields, or use a separate set of flags to set or clear the mutable flags. Only the properties you designated as mutable during creation can be modified.

## See Also

- [Dynamic MPT Reference Documentation](./reference.md)
