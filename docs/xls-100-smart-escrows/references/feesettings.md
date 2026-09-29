---
seo:
    description: The current base transaction cost and reserve requirements.
labels:
  - Fees
---
# FeeSettings
[[Source]](https://github.com/XRPLF/rippled/blob/a5d238e7d4fa6ef2b539b759d58744d0a1c33c0c/include/xrpl/protocol/detail/ledger_entries.macro#L297-L309 "Source")

The `FeeSettings` entry contains the current base [transaction cost][] and [reserve amounts][reserves] as determined by [fee voting](../concepts/fee-voting.md). Each ledger version contains **at most one** `FeeSettings` entry.

## Example {% $frontmatter.seo.title %} JSON

This ledger entry has two formats, depending on whether the [XRPFees amendment][] was enabled at the time fees were last updated:

{% tabs %}
{% tab label="Current Format" %}
```json
{
  "BaseFeeDrops": "10",
  "BytecodeSizeLimit": 100000,
  "Flags": 0,
  "GasLimit": 1000000,
  "GasPrice": 1000000,
  "LedgerEntryType": "FeeSettings",
  "PreviousTxnID": "FC0F9EF5D2C0D4DC75BCB71B69D6C7864E040C923D7016AF668024225DB00867",
  "PreviousTxnLgrSeq": 107588353,
  "ReserveBaseDrops": "1000000",
  "ReserveIncrementDrops": "200000",
  "index": "4BC50C9B0D8515D3EAAE1E74B29A95804346C491EE1A95BF25E4AAB854A6A651"
}
```
{% /tab %}

{% tab label="Legacy Format" %}
```json
{
   "BaseFee": "000000000000000A",
   "Flags": 0,
   "LedgerEntryType": "FeeSettings",
   "ReferenceFeeUnits": 10,
   "ReserveBase": 20000000,
   "ReserveIncrement": 5000000,
   "index": "4BC50C9B0D8515D3EAAE1E74B29A95804346C491EE1A95BF25E4AAB854A6A651"
}
```
{% /tab %}
{% /tabs %}

## {% $frontmatter.seo.title %} Fields

The fields of the `FeeSettings` ledger entry depend on whether the [XRPFees amendment][] was enabled the last time it was modified. If the last update was before the amendment became enabled, the entry uses the **legacy format**. If it has been updated after the amendment, it uses the **current format**. The fields it can have, in addition to the [common fields](https://xrpl.org/docs/references/protocol/transactions/types/common-fields), are as follows:

{% tabs %}
{% tab label="Current Format" %}
| Name                    | JSON Type | [Internal Type][] | Required? | Description            |
|:------------------------|:----------|:------------------|:----------|:-----------------------|
| `BaseFeeDrops`          | String    | Amount            | Yes       | The [transaction cost][] of the "reference transaction" in drops of XRP. |
| `BytecodeSizeLimit`     | Number    | UInt32            | No        | The maximum size, in bytes, of a WASM smart function, such as the `Bytecode` field of a [smart escrow](../concepts/programmability.md). {% amendment-disclaimer name="SmartEscrow" /%} |
| `GasLimit`              | Number    | UInt32            | No        | The maximum amount of gas that can be consumed by [smart functions](../concepts/programmability.md) in a single transaction. Gas is a measure of the resources (including CPU and memory) used by smart function code, defined by the WASM engine. {% amendment-disclaimer name="SmartEscrow" /%} |
| `GasPrice`              | Number    | UInt32            | No        | The cost of gas, in millionths of a drop of XRP per 1 gas. In other words, a value of `1000000` (1 million) means that 1 gas costs 0.000001 decimal XRP. {% amendment-disclaimer name="SmartEscrow" /%} |
| `ReserveBaseDrops`      | String    | Amount            | Yes       | The [base reserve][reserves] for an account in the XRP Ledger, as drops of XRP. |
| `ReserveIncrementDrops` | String    | Amount            | Yes       | The incremental [owner reserve][reserves] for owning objects, as drops of XRP. |
| `PreviousTxnID`         | String    | UInt256           | No        | The identifying hash of the transaction that most recently modified this entry. {% amendment-disclaimer name="fixPreviousTxnID" /%} |
| `PreviousTxnLgrSeq`     | Number    | UInt32            | No        | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this entry. {% amendment-disclaimer name="fixPreviousTxnID" /%} |

The following fields are added the first time [fee voting][] occurs after the relevant amendment is enabled, and are always present thereafter: `BytecodeSizeLimit`, `GasLimit`, `GasPrice`, `PreviousTxnID`, `PreviousTxnLgrSeq`.
{% /tab %}

{% tab label="Legacy Format" %}
| Name                | JSON Type | [Internal Type][] | Required? | Description            |
|:--------------------|:----------|:------------------|:----------|:-----------------------|
| `BaseFee`           | String    | UInt64            | Yes       | The [transaction cost][] of the "reference transaction" in drops of XRP as hexadecimal. |
| `ReferenceFeeUnits` | Number    | UInt32            | Yes       | The `BaseFee` translated into "fee units". |
| `ReserveBase`       | Number    | UInt32            | Yes       | The [base reserve][reserves] for an account in the XRP Ledger, as drops of XRP. |
| `ReserveIncrement`  | Number    | UInt32            | Yes       | The incremental [owner reserve][reserves] for owning objects, as drops of XRP. |
| `PreviousTxnID`     | String    | UInt256           | No        | The identifying hash of the transaction that most recently modified this entry. {% amendment-disclaimer name="fixPreviousTxnID" /%} |
| `PreviousTxnLgrSeq` | Number    | UInt32            | No        | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this entry. {% amendment-disclaimer name="fixPreviousTxnID" /%} |

{% admonition type="danger" name="Warning" %}The JSON format for this ledger entry type is unusual. The `BaseFee`, `ReserveBase`, and `ReserveIncrement` indicate drops of XRP but ***not*** in the usual format for [specifying XRP][Currency Amount].{% /admonition %}

{% /tab %}
{% /tabs %}


## {% $frontmatter.seo.title %} Flags

There are no flags defined for the {% code-page-name /%} entry.


## FeeSettings ID Format

The ID of the `FeeSettings` entry is the hash of the `FeeSettings` space key (`0x0065`) only. This means that the ID is always:

```
4BC50C9B0D8515D3EAAE1E74B29A95804346C491EE1A95BF25E4AAB854A6A651
```

{% raw-partial file="/docs/_snippets/common-links.md" /%}
