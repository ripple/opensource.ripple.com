---
html: ammbid.html
parent: transaction-types.html
blurb: Bid on an Automated Market Maker's auction slot, which grants a discounted fee.
labels:
  - AMM
status: not_enabled
---
# AMMBid
[[Source]](https://github.com/XRPLF/rippled/blob/develop/src/ripple/app/tx/impl/AMMBid.cpp "Source")

{% partial file="/snippets/_amm-disclaimer.md" /%}

Bid on an [Automated Market Maker](../automated-market-makers.md)'s (AMM's) auction slot. If you win, you can trade against the AMM at a discounted fee until you are outbid or 24 hours have passed. If you are outbid before 24 hours have passed, you are refunded part of the cost of your bid based on how much time remains.

You bid using the AMM's LP Tokens; the amount of a winning bid is returned to the AMM, decreasing the outstanding balance of LP Tokens.


<!-- ## Example {{currentpage.name}} JSON -->

## Example AMMBid JSON

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
    "AuthAccounts" : [
        {
          "AuthAccount" : {
              "Account" : "rMKXGCbJ5d8LbrqthdG46q3f969MVK2Qeg"
          }
        },
        {
          "AuthAccount" : {
              "Account" : "rBepJuTLFJt3WmtLXYAxSjtBWAeQxVbncv"
          }
        }
    ],
    "BidMax" : {
        "currency" : "039C99CD9AB0B70B32ECDA51EAAE471625608EA2",
        "issuer" : "rE54zDvgnghAoPopCgvtiqWNq3dU5y836S",
        "value" : "100"
    },
    "Fee" : "10",
    "Flags" : 2147483648,
    "Sequence" : 9,
    "TransactionType" : "AMMBid"
}
```


In addition to the common fields, AMMBid transactions use the following fields:

| Field          | JSON Type           | [Internal Type][] | Required? | Description |
|:---------------|:--------------------|:------------------|:----------|:------------|
| `Asset`        | Object              | STIssue           | Yes       | The definition for one of the assets in the AMM's pool. In JSON, this is an object with `currency` and `issuer` fields (omit `issuer` for XRP). |
| `Asset2`       | Object              | STIssue           | Yes       | The definition for the other asset in the AMM's pool. In JSON, this is an object with `currency` and `issuer` fields (omit `issuer` for XRP). |
| `BidMin`       | [Currency Amount][] | Amount            | No        | Pay at least this amount for the slot. Setting this value higher makes it harder for others to outbid you. If omitted, pay the minimum necessary to win the bid. |
| `BidMax`       | [Currency Amount][] | Amount            | No        | Pay at most this amount for the slot. If the cost to win the bid is higher than this amount, the transaction fails. If omitted, pay as much as necessary to win the bid. |
| `AuthAccounts` | Array               | STArray           | No        | A list of up to 4 additional accounts that you allow to trade at the discounted fee. This cannot include the address of the transaction sender. Each of these objects should be an [Auth Account object](#auth-account-objects). |


### Auth Account Objects

Each member of the `AuthAccounts` array must be an object with the following field:

| Field          | JSON Type | [Internal Type][] | Required? | Description |
|:---------------|:----------|:------------------|:----------|:------------|
| `Account`      | String    | AccountID         | Yes       | The address of the account to authorize. |

Like other "inner objects" that can appear in arrays, the JSON representation of each of these objects is wrapped in an object whose only key is the object type, `AuthAccount`.

## Auction Slot Price

If successful, the transaction automatically outbids the previous slot owner and debits the bid price from the sender's LP Tokens. The price to win the auction decreases over time, divided into 20 intervals of 72 minutes each. If the sender does not have enough LP Tokens to win the bid, or the price of the bid is higher than the transaction's `BidMax` value, the transaction fails with a `tecAMM_FAILED_BID` result.

- If the auction slot is currently empty, expired, or in its last interval, the **minimum bid** is **0.001% of the AMM's total LP Tokens balance**.

    **Caution:** This minimum value is a placeholder and may change before the AMM feature becomes finalized.

- Otherwise, the price to outbid the current holder is calculated using the following formula:

        P = B × 1.05 × (1 - t⁶⁰) + M

    - `P` is the price to outbid, in LP Tokens.
    - `B` is the price of the current bid, in LP Tokens.
    - `t` is the fraction of time elapsed in the current 24-hour slot, rounded down to a multiple of 0.05.
    - `M` is the **minimum bid** as defined above.

    There are two special cases for the cost to outbid someone. In the **first interval** after someone wins the bid, the price to outbid them is the minimum bid plus 5% more than the existing bid:

        P = B × 1.05 + M

    In the **last interval** of someone's slot, the cost to outbid someone is only the minimum bid:

        P = M

**Note:** To make sure all servers in the network reach the same results when building a ledger, time measurements are based on the [official close time](https://xrpl.org/ledgers.html#ledger-close-times) of the previous ledger, which is approximate.

## Bid Refunds

When you outbid an active auction slot, the AMM refunds the previous holder part of the price, using this formula:

```text
R = B × (1 - t)
```

- `R` is the amount to refund, in LP Tokens.
- `B` is the price of the previous bid to be refunded, in LP Tokens.
- `t` is the fraction of time elapsed in the current 24-hour slot, rounded down to a multiple of 0.05.

As a special case, during the final (20th) interval of the auction slot, the refunded amount is zero.

**Note:** As with all XRP Ledger times, transaction processing uses the [official close time](https://xrpl.org/ledgers.html#ledger-close-times) of the _previous_ ledger, which can result in a difference of up to about 10 seconds from real time.


## AMM Cases previous holder
Besides errors that can occur for all transactions, AMMBid transactions can result in the following [transaction result codes](https://xrpl.org/transaction-results.html):

| Error Code              | Description                                  |
|:------------------------|:---------------------------------------------|
| `tecAMM_EMPTY`          | The AMM has no assets in its pool. In this state, you can only delete the AMM or fund it with a new deposit. |
| `tecAMM_FAILED`         | This transaction could not win the auction, either because the sender does not hold enough LP Tokens to pay the necessary bid or because the price to win the auction was higher than the transaction's specified `BidMax` value. |
| `tecAMM_INVALID_TOKENS` | The sender of this transaction does not hold enough LP Tokens to meet the slot price. |
| `temBAD_AMM_TOKENS`     | The specified `BidMin` or `BidMax` were not specified as the correct LP Tokens for this AMM. |
| `temDISABLED`           | The AMM feature is not enabled on this network. |
| `temMALFORMED`          | The transaction specified invalid options, such as a list of `AuthAccounts` that is too long. |
| `terNO_ACCOUNT`         | One of the accounts specified in this request do not exist. |
| `terNO_AMM`             | The Automated Market Maker instance for the asset pair in this transaction does not exist. |


[Internal Type]: https://xrpl.org/serialization.html
[Currency Amount]: https://xrpl.org/basic-data-types.html#specifying-currency-amounts