---
html: OracleSet.html 
parent: transaction-types.html
blurb: Create or update an existing price oracle.
labels:
  - Oracle
status: not_enabled
---
# OracleSet
[[Source]](https://github.com/XRPLF/rippled/blob/develop/src/ripple/app/tx/impl/SetOracle.cpp "Source")

{% partial file="/snippets/_price-oracles-disclaimer.md" /%}

Creates a new `Oracle` ledger entry or updates the fields of an existing one, using the Oracle ID.

The oracle provider must complete these steps before submitting this transaction:

1. Create or own the XRPL account in the `Owner` field and have enough XRP to meet the reserve and transaction fee requirements.
2. Publish the XRPL account public key, so it can be used for verification by dApps.
3. Publish a registry of available price oracles with their unique `OracleDocumentID`.


## Example OracleSet JSON

```json
{
  "TransactionType": "OracleSet",
  "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
  "OracleDocumentID": 34,
  "Provider": "70726F7669646572",
  "LastUpdateTime": 743609014,
  "AssetClass": "63757272656E6379",
  "PriceDataSeries": [
    {
      "PriceData": {
        "BaseAsset": "XRP",
        "QuoteAsset": "USD",
        "AssetPrice": 740,
        "Scale": 3
      }
    }
  ]
}
```


## OracleSet Fields

| Field              | JSON Type | Internal Type | Required? | Description |
|--------------------|-----------|---------------|-----------|-------------|
| `Account`          | String    | AccountID     | Yes       | This account must match the account in the `Owner` field of the `Oracle` object. |
| `OracleDocumentID` | Number    | UInt32        | Yes       | A unique identifier of the price oracle for the `Account`. |
| `Provider`         | String    | Blob          | Variable  | An arbitrary value that identifies an oracle provider, such as Chainlink, Band, or DIA. This field is a string, up to 256 ASCII hex encoded characters (0x20-0x7E). This field is required when creating a new `Oracle` ledger entry, but is optional for updates. |
| `URI`              | String    | Blob          | No        | An optional Universal Resource Identifier to reference price data off-chain. This field is limited to 256 bytes. |
| `LastUpdateTime`   | Number    | UInt32        | Yes       | The time the data was last updated, represented in Unix time. |
| `AssetClass`       | String    | Blob          | Variable  | Describes the type of asset, such as "currency", "commodity", or "index". This field is a string, up to 16 ASCII hex encoded characters (0x20-0x7E). This field is required when creating a new `Oracle` ledger entry, but is optional for updates. |
| `PriceDataSeries`  | Array     | Array         | Yes       | An array of up to 10 `PriceData` objects, each representing the price information for a token pair. More than five `PriceData` objects require two owner reserves. |


### PriceData Fields

| Field               | JSON Type | Internal Type | Required? | Description |
|---------------------|-----------|---------------|-----------|-------------|
| `BaseAsset`         | String    | Currency      | Yes       | The primary asset in a trading pair. Any valid identifier, such as a stock symbol, bond CUSIP, or currency code is allowed. For example, in the BTC/USD pair, BTC is the base asset; in 912810RR9/BTC, 912810RR9 is the base asset. |
| `QuoteAsset`        | String    | Currency      | Yes       | The quote asset in a trading pair. The quote asset denotes the price of one unit of the base asset. For example, in the BTC/USD pair, BTC is the base asset; in 912810RR9/BTC, 912810RR9 is the base asset. |
| `AssetPrice`        | Number    | UInt64        | No        | The asset price after applying the `Scale` precision level. |
| `Scale`             | Number    | UInt8         | No        | The scaling factor to apply to an asset price. For example, if `Scale` is 6 and original price is 0.155, then the scaled price is 155000. Valid scale ranges are 0-10. |

`PriceData` objects in the `PriceDataSeries` array are created, updated, or deleted following these rules:

- **Create**: Add a `PriceData` token pair that doesn't exist in the `PriceDataSeries` array.
- **Update**: Include all the fields in a `PriceData` object to update an existing token pair.
- **Delete**: Remove the `AssetPrice` field from a `PriceData` object to completely remove it from the data series.

**Note:** The order of token pairs in the transaction aren't important because each token pair uniquely identifies the location of the `PriceData` object in the `PriceDataSeries`.


## Reserve Requirements

The owner reserve requirement is 1 for one to five `PriceData` objects, and 2 for six to ten `PriceData` objects.


## Error Cases

Besides errors that can occur for all transactions, `OracleSet` transactions can result in the following transaction result codes.

| Error Code                | Description |
|---------------------------|-------------|
| `temARRAY_EMPTY`          | The `PriceDataSeries` has no `PriceData` objects. |
| `tecARRAY_TOO_LARGE`      | The `PriceDataSeries` exceeds the ten `PriceData` objects limit. |
| `tecINVALID_UPDATE_TIME`  | The `Oracle` object has an invalid `LastUpdateTime` value. |
| `tecTOKEN_PAIR_NOT_FOUND` | The token pair you're trying to delete doesn't exist in the `Oracle` object. |
| `tecARRAY_EMPTY`          | The `PriceDataSeries` has no `PriceData` objects. |
| `temARRAY_TOO_LARGE`      | The `PriceDataSeries` exceeds the ten `PriceData` objects limit. |