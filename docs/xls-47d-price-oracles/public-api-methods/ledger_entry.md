---
html: ledger_entry.html
parent: ledger-methods.html
blurb: Get info about an Oracle instance.
status: not_enabled
labels:
  - Oracle
---
# ledger_entry
[[Source]](https://github.com/XRPLF/rippled/blob/bf6f5294a9b83653888600e78da8650896e9d393/src/ripple/rpc/handlers/LedgerEntry.cpp#L602-L646 "Source")

<embed src="/snippets/_price-oracles-disclaimer.md" />

You can use the existing `ledger_entry` method to retrieve an `Oracle` instance.


## Request Format

An example of the request format:

```json
{
  "method": "ledger_entry",
  "params" : [
    {
      "oracle" : {
        "account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
        "oracle_document_id":  34,
      },
      "ledger_index": "validated"
    }
  ]
}
```

The request contains the following parameters:

| Field                       | Type   | Required? | Description |
|-----------------------------|--------|-----------|-------------|
| `oracle`                    | Object | Yes       | The oracle identifier. |
| `oracle.account`            | String | Yes       | The XRPL account that controls the `Oracle` object. |
| `oracle.oracle_document_id` | Number | Yes       | A unique identifier of the price oracle for the `Account`. The Oracle Document ID is maintained by the Oracle Provider. |


## Response Format

An example of the response format:

```json
{
  "index" : "CF2C20122022DE908C4F521A96DC2C1E5EFFD1EFD47AA244E9EE9A442451162E",
  "ledger_current_index" : 23,
  "node" : {
    "Flags" : 0,
    "LastUpdateTime" : 743609014,
    "LedgerEntryType" : "Oracle",
    "Owner" : "rp847ow9WcPmnNpVHMQV5A4BF6vaL9Abm6",
    "AssetClass" : "63757272656E6379",
    "Provider": "70726F7669646572",
    "PreviousTxnID" : "6F120537D0D212FEA6E11A0DCC5410AFCA95BD98D451D046832E6C4C4398164D",
    "PreviousTxnLgrSeq" : 22,
    "PriceDataSeries": [
      {
        "PriceData": {
          "QuoteAsset" : {
             "currency" : "USD"
          },
          "BaseAsset" : {
             "currency" : "XRP"
          },
          "Scale" : 1,
          "AssetPrice" : "740",
        }
      }
    ],
    "index" : "CF2C20122022DE908C4F521A96DC2C1E5EFFD1EFD47AA244E9EE9A442451162E"
  },
  "status" : "success",
  "validated" : true
}
```

The response follows the [standard format](https://xrpl.org/response-formatting.html), with a successful result containing the following fields:

| Field               | Type   | Description |
|---------------------|--------|-------------|
| `LastUpdateTime`    | Number | The time the data was last updated, represented in Unix time. |
| `Owner`             | String | The XRPL account with update and delete privileges for the oracle. |
| `AssetClass`        | String | Describes the type of asset, such as "currency", "commodity", or "index". |
| `Provider`          | String | The oracle provider, such as Chainlink, Band, or DIA. |
| `PreviousTxnID`     | String | The hash of the previous transaction that modified this entry. |
| `PreviousTxnLgrSeq` | String | The ledger index that this object was most recently modified or created in. |
| `PriceDataSeries`   | Array  | An array of up to 10 `PriceData` objects. |


### PriceData Object

| Field                 | Type   | Description |
|-----------------------|--------|-------------|
| `BaseAsset`           | Object | The primary asset in a trading pair. |
| `BaseAsset.currency`  | String | The base asset currency code, conformant to the XRPL [currency codes](https://xrpl.org/currency-formats.html#standard-currency-codes) format. |
| `QuoteAsset`          | Object | The quote asset in a trading pair. The quote asset denotes the price of one unit of the base asset. |
| `QuoteAsset.currency` | String | The quote asset currency code, conformant to the XRPL [currency codes](https://xrpl.org/currency-formats.html#standard-currency-codes) format. |
| `AssetPrice`          | String | The asset price after applying the `Scale` precision level. This field isn't included if the last update transaction didn't include the `BaseAsset`/`QuoteAsset` pair. |
| `Scale`               | Number | The scaling factor to apply to an asset price. For example, if `Scale` is 6 and original price is 0.155, then the scaled price is 155000. This field isn't included if the last update transaction didn't include the `BaseAsset`/`QuoteAsset` pair. |

**Note:** Token pairs that appear without `AssetPrice` and `Scale` signify the price is outdated.