---
seo:
    description: Creates or updates an existing `LoanBroker` ledger entry.
labels:
  - Transactions
  - Lending Protocol
---
# LoanBrokerSet
[[Source]](https://github.com/ "Source")

Creates or updates a `LoanBroker` ledger entry, configuring protocol parameters and associating it with a Vault.

Only the owner of the associated vault can initiate this transaction.

_(Requires the [Lending Protocol amendment][] {% not-enabled /%})_

## Example LoanBrokerSet JSON


**TODO: Add real example.**
```json
{
  "TransactionType": "LoanBrokerSet",
  "Account": "rEXAMPLE9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "VaultID": "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
  "LoanBrokerID": "E123F4567890ABCDE123F4567890ABCDEF1234567890ABCDEF1234567890ABCD",
  "Data": "5468697320697320617262697472617279206D657461646174612061626F757420746865206C6F616E62726F6B65722E",
  "ManagementFeeRate": 100,
  "DebtMaximum": 100000,
  "CoverRateMinimum": 1000,
  "CoverRateLiquidation": 500
}
```

## LoanBrokerSet Fields

In addition to the [common fields][], `LoanBrokerSet` transactions use the following fields:

| Field Name           | JSON Type | Internal Type | Required? | Description |
|:-------------------- |:----------|:-------------|:----------|:------------|
| `VaultID`            | String    | Hash256      | Yes       | The ID of the vault that the lending protocol will access liquidity from. |
| `LoanBrokerID`       | String    | Hash256      | No        | The loan broker ID that the transaction is modifying. |
| `Data`               | String    | Blob         | No        | Arbitrary metadata in hex format, limited to 256 bytes. |
| `ManagementFeeRate`  | Number    | UInt16       | No        | The 1/10th basis point fee charged by the lending protocol owner. Valid values range from `0` to `10000`. |
| `DebtMaximum`        | Number    | Number       | No        | The maximum amount the protocol can owe the vault. The default value of `0` means there is no limit to the debt. |
| `CoverRateMinimum`   | Number    | UInt16       | No        | The 1/10th basis point `DebtTotal` that the first-loss capital must cover. Valid values range from `0` to `100000`. |
| `CoverRateLiquidation`| Number   | UInt16       | No        | The 1/10th basis point of minimum required first-loss capital liquidated to cover a loan default. Valid valuesrange from `0` to `100000`. |

## Error Cases

Besides errors that can occur for all transactions, `LoanBrokerSet` transactions can result in the following [transaction result codes][]:

| Error Code                | Description                        |
| :------------------------ | :----------------------------------|
| TBD             | The vault with `VaultID` does not exist. |
| TBD        | The account submitting the transaction doesn't own the associated vault entry. |
| TBD            | Any of the fields are invalid. |
| TBD             | A `LoanBroker` entry with the specified ID does not exist. |
| TBD            | The submitter is attempting to modify fixed fields. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
