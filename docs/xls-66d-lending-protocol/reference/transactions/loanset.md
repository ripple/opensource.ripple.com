---
seo:
    description: Creates a new `Loan` ledger entry to represent a loan agreement between a Loan Broker and Borrower.
labels:
  - Transactions
  - Lending Protocol
---
# LoanSet
[[Source]](https://github.com/ "Source")

Creates a new `Loan` ledger entry, representing a loan agreement between a _Loan Broker_ and _Borrower_.

The `LoanSet` transaction is a mutual agreement between the _Loan Broker_ and _Borrower_, and must be signe by both parties. The multi-signature flow is as follows:

1. The borrower creates a new transaction with the preagreed terms of the loan and signs the transaction.
2. The lender signs over all signing fields, including the signature of the borrower.

_(Requires the [Lending Protocol amendment][] {% not-enabled /%})_

## Example LoanSet JSON

**TODO: Add real example.**
```json
{
  "TransactionType": "LoanSet",
  "Account": "rEXAMPLE9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "LoanBrokerID": "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
  "Borrower": "rBORROWER9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Data": "5468697320697320617262697472617279206D657461646174612061626F757420746865206C6F616E2E",
  "LoanOriginationFee": 100,
  "LoanServiceFee": 10,
  "LatePaymentFee": 5,
  "FullPaymentFee": 20,
  "InterestRate": 500,
  "LateInterestRate": 1000,
  "ClosingInterestRate": 200,
  "PrincipalRequested": 10000,
  "StartDate": 1234567890,
  "PaymentsTotal": 12,
  "PaymentInterval": 2592000,
  "GracePeriod": 604800,
  "Lender": {
    "SigningPubKey": "...",
    "Signature": "..."
  }
}
```

## LoanSet Fields

In addition to the [common fields][], `LoanSet` transactions use the following fields:

| Field Name           | JSON Type | Internal Type | Required? | Description |
|:-------------------- |:----------|:-------------|:----------|:------------|
| `LoanBrokerID`         | String    | Hash256      | Yes       | The ID of the `LoanBroker` ledger entry. |
| `Flags`                | String    | UInt32       | No        | Flags for the loan. |
| `Data`                 | String    | Blob         | No        | Arbitrary metadata in hex format (max 256 bytes). |
| `Borrower`             | String    | AccountID    | Yes       | The account address of the borrower. |
| `LoanOriginationFee`   | Number    | Number       | No        | The fee paid to the `LoanBroker` owner when the loan is created. |
| `LoanServiceFee`       | Number    | Number       | No        | The fee paid to the `LoanBroker` owner with each loan payment. |
| `LatePaymentFee`       | Number    | Number       | No        | The fee paid to the `LoanBroker` owner for late payments. |
| `FullPaymentFee`       | Number    | Number       | No        | The fee paid to the `LoanBroker` owner for early full repayment. |
| `InterestRate`         | Number    | UInt16       | No        | The annualized interest rate of the loan in basis points. |
| `LateInterestRate`     | Number    | UInt16       | No        | The premium (in basis points) added to the interest rate for late payments. Valid values range from `0` to `10000` (0% - 100%). |
| `ClosingInterestRate`  | Number    | UInt16       | No        | The fee charged for making early loan repayments (in bps). Valid values range from `0` to `100000` (0% - 100%). |
| `PrincipalRequested`   | Number    | Number       | Yes       | The principal loan amount requested by the borrower. |
| `StartDate`            | Number    | UInt32       | Yes       | The timestamp of when the loan started, in [seconds since the Ripple Epoch][]. |
| `PaymentsTotal`        | Number    | UInt32       | No        | The total number of payments to be made against the loan. |
| `PaymentInterval`      | Number    | UInt32       | No        | The number of seconds between loan payments. |
| `GracePeriod`          | Number    | UInt32       | No        | The number of seconds after the loan's payment due date when it can be defaulted. |
| `Lender`               | Object    | STObject     | Yes       | An inneer object that contains the signature of the lender. |

### Lender Fields

An inner object that contains the signatures of the lender of the transaction. The object contains the following fields:

| Field Name           | JSON Type | Internal Type | Required? | Description |
|:-------------------- |:----------|:-------------|:----------|:------------|
| `SigningPubKey` | String | STBlob | Yes | The public key used to verify the validity of the signature. |
| `Signature` | String | STBlob | Yes | The signature over all signing fields, including the `Signature` of the borrower. |
| `Signers` | List | STArray | An array of transaction signatures from the owners of the `LoanBroker` ledger entry. |

The final transaction must include either `Signature` or `Signers`.

## Error Cases

Besides errors that can occur for all transactions, `LoanSet` transactions can result in the following [transaction result codes][]:

| Error Code                | Description                        |
| :------------------------ | :----------------------------------|
| `TBD`             | The `LoanBroker` entry with the specified ID doesn't exist. |
| `TBD`        | The account submitting the transaction is not the `LoanBroker` owner. |
| `TBD`               | The `Issuer` of the asset enabled a global freeze on the asset. |
| `TBD`        | Lender signatures are invalid. |
| `TBD`            | Either `tfDefault`, `tfImpair`, or `tfUnimpair` flags are set. |
| `TBD`          | The borrower account doesn't exist. |
| `TBD`               | The trustline or MPToken between the borrower and the asset issuer is frozen. |
| `TBD`              | The borrower isn't authorized to hold the loan asset. |
| `TBD`            | `PaymentInterval` is less than 60 seconds, or `GracePeriod` is greater than `PaymentInterval`, or `StartDate` before the current time. |
| `TBD`  | There are insufficient assets in the vault. |
| `TBD`           | The loan broker has exceeded the debt maximum. |
| `TBD`   | There is insufficient first-loss capital. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
