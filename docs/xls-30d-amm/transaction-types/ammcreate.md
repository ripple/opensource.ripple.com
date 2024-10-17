---
html: ammcreate.html
parent: transaction-types.html
blurb: Create a new Automated Market Maker for trading a given pair of assets.
labels:
  - AMM
status: not_enabled
---
# AMMCreate
[[Source]](https://github.com/XRPLF/rippled/blob/develop/src/ripple/app/tx/impl/AMMCreate.cpp "Source")

{% partial file="/snippets/_amm-disclaimer.md" /%}

Create a new [Automated Market Maker](../automated-market-makers.md) (AMM) instance for trading a pair of assets ([fungible tokens](https://xrpl.org/tokens.html) or [XRP](https://xrpl.org/xrp.html)).

Creates both an [AMM object](../ledger-object-types/amm.md) and a [special AccountRoot object](https://xrpl.org/accountroot.html#special-amm-accountroot-objects) to represent the AMM. Also transfers ownership of the starting balance of both assets from the sender to the created `AccountRoot` and issues an initial balance of liquidity provider tokens (LP Tokens) from the AMM account to the sender.

**Caution:** When you create the AMM, you should fund it with (approximately) equal-value amounts of each asset. Otherwise, other users can profit at your expense by trading with this AMM ([performing arbitrage](https://www.machow.ski/posts/an_introduction_to_automated_market_makers/#price-arbitrage)). The currency risk that liquidity providers take on increases with the volatility (potential for imbalance) of the asset pair. The higher the trading fee, the more it offsets this risk, so it's best to set the trading fee based on the volatility of the asset pair.


## Example AMMCreate JSON

```json
{
    "Account" : "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
    "Amount" : {
        "currency" : "TST",
        "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
        "value" : "25"
    },
    "Amount2" : "250000000",
    "Fee" : "2000000",
    "Flags" : 2147483648,
    "Sequence" : 6,
    "TradingFee" : 500,
    "TransactionType" : "AMMCreate"
}
```

In addition to the common fields, AMMCreate transactions use the following fields:

| Field        | JSON Type           | [Internal Type][] | Required? | Description |
|:-------------|:--------------------|:------------------|:----------|:------------|
| `Amount`     | [Currency Amount][] | Amount            | Yes       | The first of the two assets to fund this AMM with. This must be a positive amount. |
| `Amount2`    | [Currency Amount][] | Amount            | Yes       | The second of the two assets to fund this AMM with. This must be a positive amount. |
| `TradingFee` | Number              | UInt16            | Yes       | The fee to charge for trades against this AMM instance, in units of 1/100,000; a value of 1 is equivalent to 0.001%. The maximum value is `1000`, indicating a 1% fee. The minimum value is `0`. |

One or both of `Amount` and `Amount2` can be [tokens](https://xrpl.org/tokens.html); at most one of them can be [XRP](https://xrpl.org/xrp.html). They cannot both have the same currency code and issuer. The tokens' issuers must have [Default Ripple](https://xrpl.org/rippling.html#the-default-ripple-flag) enabled. If the Clawback amendment is enabled, those issuers must not have the ability to clawback their tokens. An AMM's LP tokens _can_ be used as one of the assets for another AMM.

## Special Transaction Cost

Since each AMM instance involves an AccountRoot ledger entry, an AMM ledger entry, and a trust line for each token in its pool, an AMMCreate transaction requires a much higher than usual [transaction cost](https://xrpl.org/transaction-cost.html) to deter ledger spam. Instead of the standard minimum of 0.00001 XRP, AMMCreate must destroy at least the incremental owner reserve amount, currently 2 XRP. This is the same special transaction cost as AccountDelete transactions.

## Error Cases

Besides errors that can occur for all transactions, AMMCreate transactions can result in the following [transaction result codes](https://xrpl.org/transaction-results.html):

| Error Code          | Description                                  |
|:--------------------|:---------------------------------------------|
| `tecAMM_INVALID_TOKENS` | Either `Amount` or `Amount2` has a currency code that is the same as this AMM's LP Tokens would use. (This is very unlikely to occur.) |
| `tecDUPLICATE`      | There is already another AMM for this currency pair. |
| `tecFROZEN`         | At least one of the deposit assets (`Amount` or `Amount2`) is currently [frozen](https://xrpl.org/freezes.html). |
| `tecINSUF_RESERVE_LINE` | The sender of this transaction does meet the increased [reserve requirement](https://xrpl.org/reserves.html) of processing this transaction, probably because they need a new trust line to hold the LP Tokens, and they don't have enough XRP to meet the additional owner reserve for a new trust line. |
| `tecNO_AUTH`        | At least one of the deposit assets uses [authorized trust lines](https://xrpl.org/authorized-trust-lines.html) and the sender does not have authorization to hold that asset. |
| `tecNO_LINE`        | The sender does not have a trust line for at least one of the deposit assets. |
| `tecNO_PERMISSION`  | At least one of the deposit assets cannot be used in an AMM. For example, the issuer has enabled Clawback support. |
| `tecUNFUNDED_AMM`   | The sender does not hold enough of the assets specified in `Amount` and `Amount2` to fund the AMM. |
| `terNO_RIPPLE`      | The issuer of at least one of the assets has not enabled the [Default Ripple flag](https://xrpl.org/rippling.html#the-default-ripple-flag). |
| `temAMM_BAD_TOKENS` | The values of `Amount` and `Amount2` are not valid: for example, both refer to the same token. |
| `temBAD_FEE`        | The `TradingFee` value is invalid. It must be zero or a positive integer and cannot be over 1000. |
| `temDISABLED`       | The AMM feature is not enabled on this network. |

[Internal Type]: https://xrpl.org/serialization.html
[Currency Amount]: https://xrpl.org/basic-data-types.html#specifying-currency-amounts