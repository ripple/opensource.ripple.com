---
html: oracle.html
parent: ledger-object-types.html
blurb: The definition and details of an oracle object.
labels:
  - Oracle
status: not_enabled
---
# Oracle
[[Source]](https://github.com/XRPLF/rippled/blob/bf6f5294a9b83653888600e78da8650896e9d393/src/ripple/protocol/impl/LedgerFormats.cpp#L343-L356 "Source")
<!-- TODO: Update source link to merged version when available -->

{% partial file="/snippets/_price-oracles-disclaimer.md" /%}

An `Oracle` ledger entry holds data associated with a single price oracle object.

**Note:** A price oracle object can store information for up to 10 token pairs.


## Example Oracle JSON

```json
{
  "LedgerEntryType": "Oracle",
  "Owner": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
  "Provider": "70726F7669646572",
  "AssetClass": "63757272656E6379",
  "PriceDataSeries": [
    {
      "PriceData": {
        "BaseAsset": "XRP",
        "QuoteAsset": "USD",
        "AssetPrice": 74,
        "Scale": 2,
      }
    },
  ],
  "LastUpdateTime": 743609414,
  "PreviousTxnID": "C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9",
  "PreviousTxnLgrSeq": 56865244
}
```


## Oracle Fields

| Field               | JSON Type | Internal Type | Required? | Description |
|---------------------|-----------|---------------|-----------|-------------|
| `Owner`             | String    | AccountID     | Yes       | The XRPL account with update and delete privileges for the oracle. It's recommended to set up [multi-signing](https://xrpl.org/set-up-multi-signing.html) on this account. |
| `Provider`          | String    | Blob          | Yes       | An arbitrary value that identifies an oracle provider, such as Chainlink, Band, or DIA. This field is a string, up to 256 ASCII hex encoded characters (0x20-0x7E). |
| `PriceDataSeries`   | Array     | Array         | Yes       | An array of up to 10 `PriceData` objects, each representing the price information for a token pair. More than five `PriceData` objects require two owner reserves. |
| `LastUpdateTime`    | Number    | UInt32        | Yes       | The time the data was last updated, represented in Unix time. |
| `URI`               | String    | Blob          | No        | An optional Universal Resource Identifier to reference price data off-chain. This field is limited to 256 bytes. |
| `AssetClass`        | String    | Blob          | Yes       | Describes the type of asset, such as "currency", "commodity", or "index". This field is a string, up to 16 ASCII hex encoded characters (0x20-0x7E). |
| `OwnerNode`         | String    | UInt64        | Yes       | A hint indicating which page of the oracle owner's owner directory links to this entry, in case the directory consists of multiple pages. |
| `PreviousTxnID`     | String    | UInt256       | Yes       | The hash of the previous transaction that modified this entry. |
| `PreviousTxnLgrSeq` | String    | UInt32        | Yes       | The ledger index that this object was most recently modified or created in. |


### PriceData Fields

| Field               | JSON Type | Internal Type | Required? | Description |
|---------------------|-----------|---------------|-----------|-------------|
| `BaseAsset`         | String    | Currency      | Yes       | The primary asset in a trading pair. Any valid identifier, such as a stock symbol, bond CUSIP, or currency code is allowed. For example, in the BTC/USD pair, BTC is the base asset; in 912810RR9/BTC, 912810RR9 is the base asset. |
| `QuoteAsset`        | String    | Currency      | Yes       | The quote asset in a trading pair. The quote asset denotes the price of one unit of the base asset. For example, in the BTC/USD pair, USD is the quote asset; in 912810RR9/BTC, BTC is the quote asset. |
| `AssetPrice`        | Number    | UInt64        | No        | The asset price after applying the `Scale` precision level. It's not included if the last update transaction didn't include the `BaseAsset`/`QuoteAsset` pair. |
| `Scale`             | Number    | UInt8         | No        | The scaling factor to apply to an asset price. For example, if `Scale` is 6 and original price is 0.155, then the scaled price is 155000. Valid scale ranges are 0-10. It's not included if the last update transaction didn't include the `BaseAsset`/`QuoteAsset` pair. |


## Oracle ID Format

The ID of an `Oracle` object is the [SHA-512Half](https://xrpl.org/basic-data-types.html#hashes) of the following values, concatenated in order:

1. The `Oracle` space key (`0x52`)
2. The `Owner` Account ID.
3. The `OracleDocumentID`.


## Currency Internal Format

The `Currency` field type represents a standard currency code, such as XRP, or an arbitrary asset as a 160-bit (40 character) hexadecimal string. This type is generally conformant to the XRPL [currency codes](https://xrpl.org/currency-formats.html#standard-currency-codes) format. Below is a JSON example with `BaseAsset` representing a CUSIP code `912810RR9` as a 160-bit hexadecimal string and `QuoteAsset` representing a standard `USD` currency code:

```json
{
  "PriceData" : {
    "BaseAsset" : "3931323831305252390000000000000000000000",
    "QuoteAsset" : "USD",
    "Scale" : 1,
    "SymbolPrice" : 740
  }
}
```