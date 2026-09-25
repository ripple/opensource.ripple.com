---
seo:
    description: Change global reserve and transaction cost settings.
labels:
    - Fees
---
# SetFee
{% source-link path="src/libxrpl/tx/transactors/system/Change.cpp" /%}

A `SetFee` [pseudo-transaction](https://xrpl.org/docs/references/protocol/transactions/pseudo-transaction-types) marks a change in [transaction cost][] or [reserve requirements][reserves] as a result of [fee voting](../concepts/fee-voting.md).

{% admonition type="info" name="Note" %}You cannot send a pseudo-transaction, but you may find one when processing ledgers.{% /admonition %}

## Example {% $frontmatter.seo.title %} JSON

This transaction has two formats, depending on whether the [XRPFees amendment][] was enabled at the time:

{% tabs %}
{% tab label="Current Format" %}
```json
{
    "Account": "rrrrrrrrrrrrrrrrrrrrrhoLvTp",
    "BaseFeeDrops": "10",
    "Fee": "0",
    "LedgerSequence": 92508417,
    "ReserveBaseDrops": "1000000",
    "ReserveIncrementDrops": "200000",
    "Sequence": 0,
    "SigningPubKey": "",
    "TransactionType": "SetFee",
    "date": 786494751,
    "ledger_index": 92508417
}
```
{% /tab %}

{% tab label="Legacy Format" %}
```json
{
    "Account": "rrrrrrrrrrrrrrrrrrrrrhoLvTp",
    "BaseFee": "000000000000000A",
    "Fee": "0",
    "ReferenceFeeUnits": 10,
    "ReserveBase": 20000000,
    "ReserveIncrement": 5000000,
    "Sequence": 0,
    "SigningPubKey": "",
    "TransactionType": "SetFee",
    "date": 439578860,
    "hash": "1C15FEA3E1D50F96B6598607FC773FF1F6E0125F30160144BE0C5CBC52F5151B",
    "ledger_index": 3721729,
}
```
{% /tab %}
{% /tabs %}

{% partial file="/docs/_snippets/pseudo-tx-fields-intro.md" /%}

## {% $frontmatter.seo.title %} Fields

The fields of a SetFee pseudo-transaction depend on whether the [XRPFees amendment][] was enabled at the time. In addition to the [common fields](https://xrpl.org/docs/references/protocol/transactions/pseudo-transaction-types), they can use the following:

{% tabs %}
{% tab label="Current Format" %}
| Field                   | JSON Type | [Internal Type][] | Description     |
|:------------------------|:----------|:------------------|:----------------|
| `BaseFeeDrops`          | String    | Amount            | The charge, in drops of XRP, for the reference transaction. (This is the [transaction cost][] before scaling for load.) |
| `BytecodeSizeLimit`     | Number    | UInt32            | _(Omitted from `SetFee` pseudo-transactions before the SmartEscrow amendment)_ The maximum size, in bytes, of a WASM smart function, such as the `Bytecode` field of a [smart escrow](../concepts/programmability.md). {% amendment-disclaimer name="SmartEscrow" /%} |
| `GasLimit`              | Number    | UInt32            | _(Omitted from `SetFee` pseudo-transactions before the SmartEscrow amendment)_ The maximum amount of gas that can be consumed by [smart functions](../concepts/programmability.md) in a single transaction. Gas is a measure of the resources (including CPU and memory) used by smart function code, defined by the WASM engine. {% amendment-disclaimer name="SmartEscrow" /%} |
| `GasPrice`              | Number    | UInt32            | _(Omitted from `SetFee` pseudo-transactions before the SmartEscrow amendment)_  The cost of gas, in millionths of a drop of XRP per 1 gas. In other words, a value of `1000000` (1 million) means that 1 gas costs 0.000001 decimal XRP. {% amendment-disclaimer name="SmartEscrow" /%} |
| `LedgerSequence`        | Number    | UInt32            | _(Omitted for some historical `SetFee` pseudo-transactions)_ The index of the ledger version where this pseudo-transaction appears. This distinguishes the pseudo-transaction from other occurrences of the same change. |
| `ReserveBaseDrops`      | String    | Amount            | The base reserve, in drops. |
| `ReserveIncrementDrops` | String    | Amount            | The incremental reserve, in drops. |
{% /tab %}

{% tab label="Legacy Format" %}
| Field               | JSON Type | [Internal Type][] | Description     |
|:--------------------|:----------|:------------------|:----------------|
| `BaseFee`           | String    | UInt64            | The charge, in drops of XRP, for the reference transaction, as hex. (This is the [transaction cost][] before scaling for load.) |
| `ReferenceFeeUnits` | Number    | UInt32            | The cost, in fee units, of the reference transaction. |
| `ReserveBase`       | Number    | UInt32            | The base reserve, in drops. |
| `ReserveIncrement`  | Number    | UInt32            | The incremental reserve, in drops |
| `LedgerSequence`    | Number    | UInt32            | _(Omitted for some historical `SetFee` pseudo-transactions)_ The index of the ledger version where this pseudo-transaction appears. This distinguishes the pseudo-transaction from other occurrences of the same change. |
{% /tab %}
{% /tabs %}

{% raw-partial file="/docs/_snippets/setfee_uniqueness_note.md" /%}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
