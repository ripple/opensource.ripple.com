---
seo:
    description: A MPTokenIssuance object represents a vault share on the ledger.
labels:
  - Multi-purpose Tokens, MPTs, Tokens
  - Single Asset Vault
---

# MPTokenIssuance

[[Source]](https://github.com/Bronek/rippled/blob/vault/include/xrpl/protocol/detail/ledger_entries.macro#L394-L409 "Source")
{% raw-partial file="/docs/_snippets/_lending-sav-disclaimer.md" /%}

The {% code-page-name /%} object represents a vault share on the ledger. An {% code-page-name /%} object is created and deleted together with the `Vault` object.

_(Requires the [Single Asset Vault amendment][] {% not-enabled /%})_

## {% $frontmatter.seo.title %} Fields

There are no changes to the fields in the {% code-page-name /%} object. See [MPTokenIssuance Fields](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/mptokenissuance#mptokenissuance-fields).

## {% $frontmatter.seo.title %} Flags

The following flags are set based on whether the shares are transferable, and if the vault is public or private:

| Condition         | Transferable                                                                           | Non-Transferable    |
| :---------------- | :------------------------------------------------------------------------------------- | :------------------ |
| **Public Vault**  | `lsfMPTCanEscrow` <br> `lsfMPTCanTrade`<br> `lsfMPTCanTransfer`                        | No Flags            |
| **Private Vault** | `lsfMPTCanEscrow`<br> `lsfMPTCanTrade`<br> `lsfMPTCanTransfer`<br> `lsfMPTRequireAuth` | `lsfMPTRequireAuth` |

See [MPTokenIssuance Flags](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/mptokenissuance#mptokenissuance-flags) for all available flags.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
