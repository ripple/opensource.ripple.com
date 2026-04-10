---
seo: 
  description: A Sponsorship object represents a sponsoring relationship between two accounts.
labels:
  - Fees
  - Accounts
  - Sponsorship
status: not_enabled
---
# Sponsorship

[[Source]](https://github.com/tequdev/rippled/blob/sponsor/include/xrpl/protocol/detail/ledger_entries.macro#L611-L624 "Source")

A {% code-page-name /%} ledger entry represents a sponsoring relationship between a sponsor and a sponsee. This allows sponsors to _pre-fund_ sponsees, if they so desire.

{% admonition type="info" name="Note" %}
This object does not need to be created in order to sponsor accounts. It is an offered convenience, so that sponsors do not have to co-sign every sponsored transaction if they don't want to, especially for transaction fees. It also allows sponsors to set a maximum balance even if they still want to co-sign transactions.
{% /admonition %}

_(Requires the [Sponsor amendment][] {% not-enabled /%})_

## Example JSON

```json
{
  "LedgerEntryType": "Sponsorship",
  "Flags": 0,
  "Owner": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXpf",
  "Sponsee": "rfkDkFai4jUfCvAJiZ5Vm7XvvWjYvDqeYo",
  "FeeAmount": "1000000",
  "MaxFee": "1000",
  "ReserveCount": 5,
  "OwnerNode": "0000000000000000",
  "SponseeNode": "0000000000000000",
  "PreviousTxnID": "1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF",
  "PreviousTxnLgrSeq": 12345678
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common ledger entry fields](./updated-ledger-entries.md#common-ledger-entry-updates#common-ledger-entry-fields), a {% code-page-name /%} entry has the following fields:

| Field Name          | JSON Type | [Internal Type][] | Required? | Description |
| :------------------ | :-------- | :---------------- | :-------- | :---------- |
| `FeeAmount`         | String    | Amount            | No        | The remaining amount of XRP that the sponsor has provided for the sponsee to use for transaction fees. |
| `MaxFee`            | String    | Amount            | No        | The maximum fee per transaction that the sponsor will cover. This field helps prevent excessive draining of the pre-funded fee pool. If the sponsee submits a transaction with a fee exceeding this value, the transaction fails. |
| `Owner`             | String    | AccountID         | Yes       | The address of the sponsor account. This account pays the reserve for this object. |
| `OwnerNode`         | String    | UInt64            | Yes       | A hint indicating which page of the sponsor's owner directory links to this object, in case the directory consists of multiple pages. |
| `PreviousTxnID`     | String    | Hash256           | Yes       | The identifying hash of the transaction that most recently modified this entry. |
| `PreviousTxnLgrSeq` | Number    | UInt32            | Yes       | The [ledger index](https://xrpl.org/docs/references/protocol/data-types/basic-data-types#ledger-index) of the ledger that contains the transaction that most recently modified this object. |
| `ReserveCount`      | Number    | UInt32            | No        | The remaining number of owner reserves the sponsor has pre-funded for the sponsee. |
| `Sponsee`           | String    | AccountID         | Yes       | The address of the sponsee account associated with this relationship. |
| `SponseeNode`       | String    | UInt64            | Yes       | A hint indicating which page of the sponsee's owner directory links to this object, in case the directory consists of multiple pages. |

## {% $frontmatter.seo.title %} Flags

A {% code-page-name /%} entry can have the following flags:

| Flag Name                             | Flag Value   | Description |
| :------------------------------------ | :----------- | :---------- |
| `lsfSponsorshipRequireSignForFee`     | `0x00010000` | If enabled, every transaction that uses this sponsorship for fees requires a signature from the sponsor. If disabled, no signature is necessary, as the existence of the {% code-page-name /%} object is sufficient. |
| `lsfSponsorshipRequireSignForReserve` | `0x00020000` | If enabled, every transaction that uses this sponsorship for reserves requires a signature from the sponsor. If disabled, no signature is necessary, as the existence of the {% code-page-name /%} object is sufficient. |

## Deleting a Sponsorship Object

Either the sponsor or the sponsee can delete a {% code-page-name /%} object using the [SponsorshipSet transaction][] with the `tfDeleteObject` flag enabled.

{% admonition type="warning" name="Warning" %}
The {% code-page-name /%} object is a [deletion blocker](https://xrpl.org/docs/concepts/accounts/deleting-accounts#requirements). A sponsor cannot delete their account until all their {% code-page-name /%} objects are removed.
{% /admonition %}

## Sponsorship ID Format

The ID of a {% code-page-name /%} entry is the [SHA-512Half](https://xrpl.org/docs/references/protocol/data-types/basic-data-types#hashes) of the following values, concatenated in order:

1. The Sponsorship space key (`0x003E`)
2. The AccountID of the sponsor (`Owner` field)
3. The AccountID of the `Sponsee`

{% raw-partial file="/docs/_snippets/common-links.md" /%}
