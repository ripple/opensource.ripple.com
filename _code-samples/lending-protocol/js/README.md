# Lending Protocol Examples (JavaScript)

This directory contains JavaScript examples demonstrating how to create a Loan Broker, deposit and withdraw first-loss capital, create a loan, and manage a loan.

## Setup

Install dependencies before running any examples:

```sh
npm i
```

---

## Create a Loan Broker

```sh
node createLoanBroker.js
```

The script should output the LoanBrokerSet transaction, loan broker ID, and loan broker pseudo-account:

```sh
Loan broker/vault owner address: rs6h51Hyqy13pPxy4DobRQDs4tk6Dw1jGf
Vault ID: EC937E5BE10F13AE2998393917EA1F6D899F0D0823A03A5DD302E1168C46BD45

=== Preparing LoanBrokerSet transaction ===

{
  "TransactionType": "LoanBrokerSet",
  "Account": "rs6h51Hyqy13pPxy4DobRQDs4tk6Dw1jGf",
  "VaultID": "EC937E5BE10F13AE2998393917EA1F6D899F0D0823A03A5DD302E1168C46BD45",
  "ManagementFeeRate": 1000
}

=== Submitting LoanBrokerSet transaction ===

Loan broker created successfully!

=== Loan Broker Information ===

LoanBroker ID: 90590BC4B098D5691C21EF1CBDFE01D25A8EB61B41E37B25EDF310BDD6CA6AA4
LoanBroker Psuedo-Account Address: rpqzd6SzkJ8v76hpMSBUD9DbukRMuXcaSt
```

---

## Deposit and Withdraw First-loss Capital

```sh
node coverDepositAndWithdraw.js
```

The script should output the LoanBrokerCoverDeposit, cover balance after the deposit, the LoanBrokerCoverWithdraw transaction, and the cover balance after the withdrawal:

```sh
Loan broker address: rs6h51Hyqy13pPxy4DobRQDs4tk6Dw1jGf
LoanBrokerID: 307DD990128A185AA12220C8250ACAE1D70C1FA008B535C68D892EB143B2345D

=== Preparing LoanBrokerCoverDeposit transaction ===

{
  "TransactionType": "LoanBrokerCoverDeposit",
  "Account": "rs6h51Hyqy13pPxy4DobRQDs4tk6Dw1jGf",
  "LoanBrokerID": "307DD990128A185AA12220C8250ACAE1D70C1FA008B535C68D892EB143B2345D",
  "Amount": "10000000"
}

=== Submitting LoanBrokerCoverDeposit transaction ===

Cover deposit successful!

=== Cover Balance ===

LoanBroker Pseudo-Account: rPU5PcnqpuN6BLPwmXuaxc1XfEv9NPTK3
Cover balance after deposit: 10000000

=== Preparing LoanBrokerCoverWithdraw transaction ===

{
  "TransactionType": "LoanBrokerCoverWithdraw",
  "Account": "rs6h51Hyqy13pPxy4DobRQDs4tk6Dw1jGf",
  "LoanBrokerID": "307DD990128A185AA12220C8250ACAE1D70C1FA008B535C68D892EB143B2345D",
  "Amount": "5000000"
}

=== Submitting LoanBrokerCoverWithdraw transaction ===

Cover withdraw successful!

=== Updated Cover Balance ===

LoanBroker Pseudo-Account: rPU5PcnqpuN6BLPwmXuaxc1XfEv9NPTK3
Cover balance after withdraw: 5000000
```

---

## Create a Loan

```sh
node createLoan.js
```

The script should output the LoanSet transaction, the updated LoanSet transaction with the loan broker signature, the final LoanSet transaction with the borrower signature added, and then the loan information:

```sh
Loan broker address: rs6h51Hyqy13pPxy4DobRQDs4tk6Dw1jGf
Borrower address: rf1qSTxp8BbCESv5rt6JW1nuqzqdLerkFG
LoanBrokerID: 307DD990128A185AA12220C8250ACAE1D70C1FA008B535C68D892EB143B2345D

=== Preparing LoanSet transaction ===

{
  "TransactionType": "LoanSet",
  "Account": "rs6h51Hyqy13pPxy4DobRQDs4tk6Dw1jGf",
  "Counterparty": "rf1qSTxp8BbCESv5rt6JW1nuqzqdLerkFG",
  "LoanBrokerID": "307DD990128A185AA12220C8250ACAE1D70C1FA008B535C68D892EB143B2345D",
  "PrincipalRequested": "10000000",
  "InterestRate": 500,
  "PaymentTotal": 12,
  "PaymentInterval": 2592000,
  "GracePeriod": 604800,
  "LoanOriginationFee": "100000",
  "LoanServiceFee": "10000",
  "Flags": 0,
  "NetworkID": 3222,
  "Sequence": 1381107,
  "LastLedgerSequence": 1381317,
  "Fee": "2"
}

=== Adding loan broker signature ===

TxnSignature: 7B699CBF92E78872CFED976A39A67EA81969DF5F6A31C0716EA8FA85F1CC4C592A646B924E51B4D782B19382A2E0E32148F4681971C2DA50FDAFEB1B2602AA07
SigningPubKey: ED2F87DCEA30439CE7DB65ECCD0D324AF66DD0FBC936D2DC21A03CBA9F9120D898

Signed loanSetTx for borrower to sign over:
{
  "TransactionType": "LoanSet",
  "NetworkID": 3222,
  "Flags": 0,
  "Sequence": 1381107,
  "LastLedgerSequence": 1381317,
  "PaymentInterval": 2592000,
  "GracePeriod": 604800,
  "PaymentTotal": 12,
  "InterestRate": 500,
  "LoanBrokerID": "307DD990128A185AA12220C8250ACAE1D70C1FA008B535C68D892EB143B2345D",
  "Fee": "2",
  "SigningPubKey": "ED2F87DCEA30439CE7DB65ECCD0D324AF66DD0FBC936D2DC21A03CBA9F9120D898",
  "TxnSignature": "7B699CBF92E78872CFED976A39A67EA81969DF5F6A31C0716EA8FA85F1CC4C592A646B924E51B4D782B19382A2E0E32148F4681971C2DA50FDAFEB1B2602AA07",
  "Account": "rs6h51Hyqy13pPxy4DobRQDs4tk6Dw1jGf",
  "Counterparty": "rf1qSTxp8BbCESv5rt6JW1nuqzqdLerkFG",
  "LoanOriginationFee": "100000",
  "LoanServiceFee": "10000",
  "PrincipalRequested": "10000000"
}

=== Adding borrower signature ===

Borrower TxnSignature: 1EA73F2F46D2635F1783F191DF110EB3712A7F2E7FB34E7AE4FD78B682B1B1A3E50FE9C460CBCA082731BF7DE437070993B9C93872D8F7AB6BB5A41E330C4108
Borrower SigningPubKey: ED5D1B7064CE830A45AFDA8F1DD73515CE1ED63AFE95BC0D98D9FC24822508FDAE

Fully signed LoanSet transaction:
{
  "TransactionType": "LoanSet",
  "NetworkID": 3222,
  "Flags": 0,
  "Sequence": 1381107,
  "LastLedgerSequence": 1381317,
  "PaymentInterval": 2592000,
  "GracePeriod": 604800,
  "PaymentTotal": 12,
  "InterestRate": 500,
  "LoanBrokerID": "307DD990128A185AA12220C8250ACAE1D70C1FA008B535C68D892EB143B2345D",
  "Fee": "2",
  "SigningPubKey": "ED2F87DCEA30439CE7DB65ECCD0D324AF66DD0FBC936D2DC21A03CBA9F9120D898",
  "TxnSignature": "7B699CBF92E78872CFED976A39A67EA81969DF5F6A31C0716EA8FA85F1CC4C592A646B924E51B4D782B19382A2E0E32148F4681971C2DA50FDAFEB1B2602AA07",
  "Account": "rs6h51Hyqy13pPxy4DobRQDs4tk6Dw1jGf",
  "Counterparty": "rf1qSTxp8BbCESv5rt6JW1nuqzqdLerkFG",
  "LoanOriginationFee": "100000",
  "LoanServiceFee": "10000",
  "PrincipalRequested": "10000000",
  "CounterpartySignature": {
    "SigningPubKey": "ED5D1B7064CE830A45AFDA8F1DD73515CE1ED63AFE95BC0D98D9FC24822508FDAE",
    "TxnSignature": "1EA73F2F46D2635F1783F191DF110EB3712A7F2E7FB34E7AE4FD78B682B1B1A3E50FE9C460CBCA082731BF7DE437070993B9C93872D8F7AB6BB5A41E330C4108"
  }
}

=== Submitting signed LoanSet transaction ===

Loan created successfully!

=== Loan Information ===

{
  "Borrower": "rf1qSTxp8BbCESv5rt6JW1nuqzqdLerkFG",
  "GracePeriod": 604800,
  "InterestRate": 500,
  "LoanBrokerID": "307DD990128A185AA12220C8250ACAE1D70C1FA008B535C68D892EB143B2345D",
  "LoanOriginationFee": "100000",
  "LoanSequence": 2,
  "LoanServiceFee": "10000",
  "NextPaymentDueDate": 824249622,
  "PaymentInterval": 2592000,
  "PaymentRemaining": 12,
  "PeriodicPayment": "835561.0375288088",
  "PrincipalOutstanding": "10000000",
  "StartDate": 821657622,
  "TotalValueOutstanding": "10026733"
}
```

---

## Manage a Loan

```sh
node loanManage.js
```

The script should output the initial status of the loan, the LoanManage transaction, and the updated loan status and grace period after impairment. The script will countdown the grace period before outputting another LoanManage transaction, and then the final flags on the loan.

```sh
Loan broker address: rs6h51Hyqy13pPxy4DobRQDs4tk6Dw1jGf
LoanID: DB6381C9C3844625035C574A1EEE4560BE9EDFC95B3522FF8EBD2A9B9BDA0689

=== Loan Status ===

Total Amount Owed: 10.00411 XRP.
Payment Due Date: 2/12/2026, 2:04:10 PM

=== Preparing LoanManage transaction to impair loan ===

{
  "TransactionType": "LoanManage",
  "Account": "rs6h51Hyqy13pPxy4DobRQDs4tk6Dw1jGf",
  "LoanID": "DB6381C9C3844625035C574A1EEE4560BE9EDFC95B3522FF8EBD2A9B9BDA0689",
  "Flags": 131072
}

=== Submitting LoanManage impairment transaction ===

Loan impaired successfully!
New Payment Due Date: 1/13/2026, 2:55:50 PM
Grace Period: 60 seconds

=== Countdown until loan can be defaulted ===

Grace period expired. Loan can now be defaulted.

=== Preparing LoanManage transaction to default loan ===

{
  "TransactionType": "LoanManage",
  "Account": "rs6h51Hyqy13pPxy4DobRQDs4tk6Dw1jGf",
  "LoanID": "DB6381C9C3844625035C574A1EEE4560BE9EDFC95B3522FF8EBD2A9B9BDA0689",
  "Flags": 65536
}

=== Submitting LoanManage default transaction ===

Loan defaulted successfully!

=== Checking final loan status ===

Final loan flags (parsed): {"tfLoanDefault":true,"tfLoanImpair":true}
```

## Pay a Loan

```sh
node loanPay.js
```

The script should output the amount required to totally pay off a loan, the LoanPay transaction, the amount due after the payment, the LoanDelete transaction, and then the status of the loan ledger entry:

```sh
Borrower address: rGRTerFGNXAtkDHJBAnJsnu5aqD3ZLv3yb
LoanID: A582738F380324487FDBE9C49E8D73AADFF5138882CA33EF7E387B53FB27579A

=== Loan Status ===

Amount Owed: 10.00411 XRP
Loan Service Fee: 0.01 XRP
Total Payment Due (including fees): 10.01411 XRP

=== Preparing LoanPay transaction ===

{
  "TransactionType": "LoanPay",
  "Account": "rGRTerFGNXAtkDHJBAnJsnu5aqD3ZLv3yb",
  "LoanID": "A582738F380324487FDBE9C49E8D73AADFF5138882CA33EF7E387B53FB27579A",
  "Amount": "10014110"
}

=== Submitting LoanPay transaction ===

Loan paid successfully!

=== Loan Status After Payment ===

Outstanding Loan Balance: Loan fully paid off!

=== Preparing LoanDelete transaction ===

{
  "TransactionType": "LoanDelete",
  "Account": "rGRTerFGNXAtkDHJBAnJsnu5aqD3ZLv3yb",
  "LoanID": "A582738F380324487FDBE9C49E8D73AADFF5138882CA33EF7E387B53FB27579A"
}

=== Submitting LoanDelete transaction ===

Loan deleted successfully!

=== Verifying Loan Deletion ===

Loan has been successfully removed from the XRP Ledger!
```
