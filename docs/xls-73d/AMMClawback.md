# AMMClawback

<!--> Add link to github source after feature is merged into devnet. <-->
[[Source]](https://github.com/XRPLF/rippled/pull/5142 "Source")

{% partial file="/snippets/_ammclawback-disclaimer.md" /%}

Claw back tokens issued by your account that have been deposited into an AMM.

Clawback is disabled by default. To use clawback, you must send an [AccountSet transaction](https://xrpl.org/docs/references/protocol/transactions/types/accountset) to enable the **Allow Trust Line Clawback** setting. An issuer with any existing tokens cannot enable clawback. You can only enable **Allow Trust Line Clawback** if you have a completely empty owner directory, meaning you must do so before you set up any trust lines, offers, escrows, payment channels, checks, or signer lists. After you enable clawback, it cannot reverted: the account permanently gains the ability to claw back issued assets on trust lines.


## Example AMMClawback JSON

```json
{
  "TransactionType": "AMMClawback",
  "Account": "rPdYxU9dNkbzC5Y2h4jLbVJ3rMRrk7WVRL",
  "Holder": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
  "Asset": {
      "currency" : "FOO",
      "issuer" : "rPdYxU9dNkbzC5Y2h4jLbVJ3rMRrk7WVRL"
  },
  "Asset2" : {
      "currency" : "BAR",
      "issuer" : "rHtptZx1yHf6Yv43s1RWffM3XnEYv3XhRg"
  },
  "Amount": {
      "currency" : "FOO",
      "issuer" : "rPdYxU9dNkbzC5Y2h4jLbVJ3rMRrk7WVRL",
      "value" : "1000"
  }
}
```


## AMMClawback Fields

`AMMClawback` transactions use the following fields:

| Field              | JSON Type | [Internal Type](https://xrpl.org/docs/references/protocol/binary-format) | Required | Description |
|:-------------------|:----------|:------------------|:---------|:------------------|
| `Account` | String | AccountID | Yes | The issuer of the asset being clawed back. This field must match the account submitting the transaction. |
| `Asset`   | Object | STIssue   | Yes | Specifies the asset that the issuer wants to claw back from the AMM pool. In JSON, this is an object with `currency` and `issuer` fields. The `issuer` field must match with `Account`. |
| `Asset2`  | Object | STIssue   | Yes | Specifies the other asset in the AMM's pool. In JSON, this is an object with `currency` and `issuer` fields (omit `issuer` for XRP). |
| `Amount`  | [Currency Amount](https://xrpl.org/docs/references/protocol/data-types/basic-data-types#specifying-currency-amounts) | Amount | Yes | The maximum amount to claw back from the AMM account. The `currency` and `issuer` subfields should match the `Asset` subfields. If this field isn't specified, or the `value` subfield exceeds the holder's available tokens in the AMM, all of the holder's tokens will be clawed back. |
| `Holder`  | String | AccountID | Yes | The account holding the asset to be clawed back. |


## AMMClawback Flags

| Flag Name | Hex Value | Decimal Value | Description |
|----------|------------|---------------|-------------|
| `tfClawTwoAssets` | `0x00000001` | 1 | Claw back the specified amount of `Asset`, and the corresponding proportion of `Asset2` from the AMM pool; both assets must be issued by the issuer in the `Account` field. If this flag isn't enabled, the issuer claws back the specified amount of `Asset`, while a corresponding proportion of `Asset2` goes back to the `Holder`. |


## Error Cases

<!--> Get error cases from dev. <-->

Besides errors that can occur for all transactions, `AMMClawback` transactions can result in the following [transaction result codes](https://xrpl.org/docs/references/protocol/transactions/transaction-results):

| Error Code         | Description |
|:-------------------|:------------|
| `temDISABLED`      | Occurs if the [AMMClawback amendment](#) is not enabled. |
| `temBAD_AMOUNT`    | Occurs if the holder's balance in the AMM is 0. |
| `tecNO_LINE`       | Occurs if there is no trust line with the counterparty or that trust line's balance is 0. |
| `tecNO_PERMISSION` | Occurs if you attempt to claw back tokens from an AMM without the `lsfAllowTrustlineClawback` flag enabled, or the `tfClawTwoAssets` flag is enabled when you didn't issue both assets in the AMM. Also occurs if the `Asset` issuer doesn't match `Account`. |
