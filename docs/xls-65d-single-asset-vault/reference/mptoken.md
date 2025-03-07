---
seo:
    description: A MPToken object represents the amount of shares held by a depositor.
labels:
  - Multi-purpose Tokens, MPTs, Tokens
  - Single Asset Vault
---

# MPToken

[[Source]](https://github.com/Bronek/rippled/blob/vault/include/xrpl/protocol/detail/ledger_entries.macro#L411-L421 "Source")

The {% code-page-name /%} object represents the amount of shares held by a depositor. It is created when the account deposits liquidity into the vault and is deleted when a depositor redeems, or transfers, all shares.

_(Requires the [Single Asset Vault amendment][] {% not-enabled /%})_

## {% $frontmatter.seo.title %} Fields

There are no changes to the fields in the {% code-page-name /%} object. See [MPToken Fields](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/mptoken#mptoken-fields).

## {% $frontmatter.seo.title %} Flags

The following flags are set based on whether the vault is public or private:

| **Condition**     | **Transferable**   | **Non-Transferable** |
| ----------------- | ------------------ | -------------------- |
| **Public Vault**  | No Flags           | `lsfMPTAuthorized`   |
| **Private Vault** | `lsfMPTAuthorized` | `lsfMPTAuthorized`   |

See [MPToken Flags](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/mptoken#mptoken-flags) for all available flags.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
