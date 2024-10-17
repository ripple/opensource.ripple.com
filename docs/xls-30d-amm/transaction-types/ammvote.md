---
html: ammvote.html
parent: transaction-types.html
blurb: Vote on the trading fee for an Automated Market Maker instance.
labels:
  - AMM
status: not_enabled
---
# AMMVote
[[Source]](https://github.com/XRPLF/rippled/blob/develop/src/ripple/app/tx/impl/AMMVote.cpp "Source")

{% partial file="/snippets/_amm-disclaimer.md" /%}

Vote on the trading fee for an [Automated Market Maker](../automated-market-makers.md) instance. Up to 8 accounts can vote in proportion to the amount of the AMM's LP Tokens they hold. Each new vote re-calculates the AMM's trading fee based on a weighted average of the votes.

## Example AMMVote JSON

```json
{
    "Account" : "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
    "Asset" : {
        "currency" : "XRP"
    },
    "Asset2" : {
        "currency" : "TST",
        "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
    },
    "Fee" : "10",
    "Flags" : 2147483648,
    "Sequence" : 8,
    "TradingFee" : 600,
    "TransactionType" : "AMMVote"
}
```

In addition to the common fields, AMMVote transactions use the following fields:


| Field        | JSON Type | [Internal Type][] | Required? | Description |
|:-------------|:----------|:------------------|:----------|:------------|
| `Asset`      | Object    | STIssue           | Yes       | The definition for one of the assets in the AMM's pool. In JSON, this is an object with `currency` and `issuer` fields (omit `issuer` for XRP). |
| `Asset2`     | Object    | STIssue           | Yes       | The definition for the other asset in the AMM's pool. In JSON, this is an object with `currency` and `issuer` fields (omit `issuer` for XRP). |
| `TradingFee` | Number    | UInt16            | Yes       | The proposed fee to vote for, in units of 1/100,000; a value of 1 is equivalent to 0.001%. The maximum value is 1000, indicating a 1% fee. |

## Error Cases

Besides errors that can occur for all transactions, AMMVote transactions can result in the following [transaction result codes](https://xrpl.org/transaction-results.html):

| Error Code              | Description                                  |
|:------------------------|:---------------------------------------------|
| `tecAMM_EMPTY`          | The AMM has no assets in its pool. In this state, you can only delete the AMM or fund it with a new deposit. |
| `tecAMM_INVALID_TOKENS` | The sender cannot vote because they do not hold any of this AMM's LP Tokens. |
| `tecAMM_FAILED_VOTE`    | There are already 8 votes from accounts that hold more LP Tokens than the sender of this transaction. |
| `temBAD_FEE`            | The `TradingFee` from this transaction is not valid. |
| `terNO_AMM`             | The Automated Market Maker instance for the asset pair in this transaction does not exist. |


[Internal Type]: https://xrpl.org/serialization.html
[Currency Amount]: https://xrpl.org/basic-data-types.html#specifying-currency-amounts