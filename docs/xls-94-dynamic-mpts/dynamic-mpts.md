---
seo:
    description: Create MPTs with the option of changing specific fields or flags.
labels:
  - Multi-Purpose Tokens (MPTs), MPT
---

# Dynamic Multi-Purpose Tokens

Multi-Purpose Tokens (MPT) become immutable after issuance, but some use cases may require the capability to update an MPT's properties after its initial issuance.

The Dynamic MPT amendment extends Multi-Purpose Tokens by allowing issuers to set specific properties as mutable when creating an MPT issuance. This enables some properties to be updated later as business needs evolve. For example, an issuer might need to adjust transfer fees based on market conditions, or update token metadata. Issuers can achieve this by explicitly declaring which specific fields and flags can be modified when they issue the MPT. Fields not marked as mutable during initial issuance remain immutable.

_(Requires the [DynamicMPT amendment][] {% not-enabled /%})_

## Creating a Dynamic MPT

When you issue an MPT, you can declare selected fields and MPT issuance flags as mutable in the `MutableFlags` field of the `MPTokenIssuanceCreate` transaction. Field mutability supports operational updates such as _metadata_ changes and _transfer fee_ adjustments without requiring a new issuance. All other fields and flags must remain immutable.

## Modifying a Dynamic MPT

After creating an MPT with mutable properties, you can update those specific fields or enable mutable MPT issuance flags using the `MPTokenIssuanceSet` transaction. You provide new values for mutable fields, or use a separate set of flags to enable mutable MPT issuance flags.

Mutable MPT issuance flags are intentionally **one-way**: if the corresponding mutability flag was set during creation, the issuer may later enable the MPT issuance flag through `MPTokenIssuanceSet`, but once enabled, that flag cannot be disabled.

## Security Considerations

Mutability is opt-in and strictly bounded by the issuer's original declaration:

- A field or MPT issuance flag can only be changed if it was explicitly declared mutable during `MPTokenIssuanceCreate`.
- Only the issuer of the `MPTokenIssuance` can use `MPTokenIssuanceSet` to modify mutable fields or enable mutable MPT issuance flags.
- Mutable MPT issuance flags are one-way and cannot be disabled through `MPTokenIssuanceSet` after they are enabled. This prevents an issuer from weakening issuance behavior after participants may have relied on the enabled flag.

## See Also

- [Dynamic MPT Reference Documentation](./reference.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
