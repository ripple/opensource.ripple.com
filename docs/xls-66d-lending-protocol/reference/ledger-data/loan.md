---
seo:
    description: A Loan ledger entry represents the terms of a loan between a borrower and loan issuer.
labels:
  - Decentralized Finance
  - Lending Protocol
---

# Loan

A `Loan` ledger entry defines the state of an on-chain loan agreement between a _Loan Broker_ and a _Borrower_. It contains all the details of the loan, such as fees and interest rates. You can create a `Loan` object with the [`LoanSet`](../transactions/loanset.md) transaction.

The `Loan` entry is tracked in an [Owner Directory](https://xrpl.org/directorynode.html) owned by the Borrower. To facilitate `Loan` look up, it is also tracked in the `OwnerDirectory` associated with the Loan Broker.

_(Requires the [Lending Protocol amendment][] {% not-enabled /%})_

## Example Loan JSON

**TODO: Add real example.**
```json
{
  "LedgerEntryType": "Loan",
  "LedgerIndex": "E123F4567890ABCDE123F4567890ABCDEF1234567890ABCDEF1234567890ABCD",
  "Flags": "0",
  "PreviousTxnID": "9A8765B4321CDE987654321CDE987654321CDE987654321CDE987654321CDE98",
  "PreviousTxnLgrSeq": 12345678,
  "Sequence": 1,
  "OwnerNode": 2,
  "LoanBrokerID": "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
  "Borrower": "rEXAMPLE9AbCdEfGhIjKlMnOpQrStUvWxYz",
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
  "NextPaymentDueDate": 1234569990,
  "PaymentsRemaining": 12,
  "AssetsAvailable": 10000
}
```

## Loan Fields

In addition to the [common ledger entry fields][], `Loan` entries have the following fields:

| Name                  | JSON Type | Internal Type | Required? | Description |
| :-------------------- | :-------- | :------------ | :-------- | :-----------|
| `LedgerEntryType`     | String    | UInt16        | Yes       | Ledger object type. |
| `LedgerIndex`         | String    | UInt16        | Yes       | The unique identifier of the ledger object. |
| `Flags`               | String    | UInt32        | No        | Set of bit-flags for this ledger object. |
| `PreviousTxnID`       | String    | Hash256       | Yes       | Identifies the transaction ID that most recently modified this object. |
| `PreviousTxnLgrSeq`   | Number    | UInt32        | Yes       | The sequence of the ledger that contains the transaction that most recently modified this object. |
| `LoanSequence`        | Number    | UInt32        | Yes       | The sequence number of the loan. |
| `OwnerNode`           | Number    | UInt64        | Yes       | Identifies the page where this item is referenced in the owner's directory. |
| `LoanBrokerID`        | String    | Hash256       | Yes       | The ID of the _Loan Broker_ associated with this loan. |
| `Borrower`            | String    | AccountID     | Yes       | The account address of the _Borrower_. |
| `LoanOriginationFee`  | Number    | Number        | Yes       | The nominal fee paid to the _Loan Broker_, taken from the principal loan at creation. |
| `LoanServiceFee`      | Number    | Number        | Yes       | The nominal fee paid to the _Loan Broker_ with each loan payment. |
| `LatePaymentFee`      | Number    | Number        | Yes       | The nominal fee paid to the _Loan Broker_ for each late payment. |
| `FullPaymentFee`      | Number    | Number        | Yes       | The nominal fee paid to the _Loan Broker_ when a full payment is made. **TODO: Confirm if this is supposed to be early payment.** |
| `InterestRate`        | Number    | UInt16        | Yes       | The annualized interest rate of the loan in 1/10th basis points. |
| `LateInterestRate`    | Number    | UInt16        | Yes       | The premium added to the interest rate for late payments in 1/10th basis points. Valid values are from `0` up to `100000` (0% - 100%). |
| `CloseInterestRate` | Number    | UInt16        | Yes       | The interest rate charged for repaying the loan early in 1/10th basis points. Valid values are from `0` up to `100000` (0% - 100%). |
| `OverpaymentInterestRate` | Number | UInt32       | Yes       | The interest rate charged on overpayments in 1/10th basis points. Valid values are between `0` and `100000` inclusive. (0% - 100%) |
| `PrincipalRequested`  | Number    | Number        | Yes       | The principal amount requested by the _Borrower_. |
| `StartDate`           | Number    | UInt32        | Yes       | The timestamp of when the loan started, in [seconds since the Ripple Epoch][]. |
| `PaymentsTotal`       | Number    | UInt32        | Yes       | The total number of payments against the loan. |
| `PaymentInterval`     | Number    | UInt32        | Yes       | The number of seconds between loan payments. |
| `GracePeriod`         | Number    | UInt32        | Yes       | The number of seconds after a payment is due before the loan defaults. |
| `NextPaymentDueDate`  | Number    | UInt32        | Yes       | The timestamp of when the next loan payment is due, [seconds since the Ripple Epoch][]. |
| `PaymentsRemaining`   | Number    | UInt32        | Yes       | The number of payments remaining on the loan. |
| `AssetsAvailable`     | Number    | Number        | Yes       | The amount of assets available in the loan. |

## Loan Flags

`Loan` entries can have the following flags:

| Flag Name      | Hex Value    | Decimal Value | Description                 |
| :------------- | :----------- | :------------ | :---------------------------|
| `lsfDefault`   | `0x0001`     | If set, indicates that the loan is defaulted. |
| `lsfImpaired`  | `0x0002`     | If set, indicates that the loan is impaired. |

## Loan Reserve

`Loan` entries incur one owner reserve from the borrower.

## Loan ID Format

The ID of a `Loan` entry is the [`SHA512-Half`][] of the following values, concatenated in order:

- The `Loan` space key `0x004C`.
- The [AccountID][] of the Borrower account.
- The `LoanBrokerID` of the associated `LoanBroker` object.
- The `Sequence` number of the `LoanSet` transaction. If the transaction used a [Ticket][], the `TicketSequence` value is used instead.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
