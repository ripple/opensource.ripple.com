---
seo:
    description: A PermissionedDomain ledger entry represents a Permissioned Domain, which is used to limit access to other features.
labels:
  - Compliance
  - Permissioned Domains
---
# PermissionedDomain
[[Source]](https://github.com/XRPLF/rippled/blob/3d02580c0944ea5a878b8824d0e6d45714a4ceb4/include/xrpl/protocol/detail/ledger_entries.macro#L451-L461 "Source")

A `PermissionedDomain` ledger entry describes a single [Permissioned Domain](./index.md) instance. You can create a Permissioned Domain by sending a [PermissionedDomainSet transaction][].

_(Requires the PermissionedDomains amendment.)_

## Example {% $frontmatter.seo.title %} JSON

```json
{
    // TODO
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common ledger entry fields](https://xrpl.org/docs/references/protocol/ledger-data/common-fields), {% code-page-name /%} entries have the following fields:

| Field                 | JSON Type            | [Internal Type][] | Required? | Description  |
|:----------------------|:----------|:------------------|:----------|--------------|
| `AcceptedCredentials` | Array                | Array             | Yes       | A list of 1 to 10 [**Accepted Credentials objects**](#accepted-credentials-objects) that grant access to this Domain. The array is stored sorted by issuer. |
| `Owner`               | String - [Address][] | AccountID         | Yes       | The address of the account that owns this Domain. |
| `OwnerNode`           | String               | UInt64            | Yes       | A hint indicating which page of the owner directory links to this entry, in case the directory consists of multiple pages. |
| `PreviousTxnID`       | String - [Hash][]    | Hash256           | Yes       | The identifying hash of the transaction that most recently modified this entry. |
| `PreviousTxnLgrSeq`   | Number               | UInt32            | Yes       | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |
| `Sequence`            | Number               | UInt32            | Yes       | The `Sequence` value of the transaction that created this entry. |

{% partial file="/docs/_snippets/accepted-credentials-objects /%}


## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} entries.


## {% $frontmatter.seo.title %} Reserve

Each {% code-page-name /%} entry counts as 1 item toward its owner's reserve requirement.

A {% code-page-name /%} entry is a deletion blocker, meaning an account cannot be deleted if it owns any {% code-page-name /%} entries.


## {% $frontmatter.seo.title %} ID Format

The ID of a {% code-page-name /%} entry is the [SHA-512Half][] of the following values, concatenated in order:

1. The {% code-page-name /%} space key (`0x0082`)
0. The AccountID of the {% code-page-name /%}'s owner
0. The Sequence number of the transaction that created the {% code-page-name /%}


{% raw-partial file="/docs/_snippets/common-links.md" /%}
