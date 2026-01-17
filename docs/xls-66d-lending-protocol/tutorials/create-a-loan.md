---
seo:
  description: Create a loan on the XRP Ledger using the Lending Protocol.
metadata:
  indexPage: true
labels:
  - Lending Protocol
---

# Create a Loan

{% raw-partial file="/docs/_snippets/_lending-sav-disclaimer.md" /%}

This tutorial shows you how to create a [Loan](../reference/ledger-data/loan.md) on the XRP Ledger. A loan requires signatures from both the loan broker and the borrower to be created.

This tutorial demonstrates how a loan broker and a borrower can cosign the terms of a loan and create that loan on the XRPL.

_(Requires the [Lending Protocol amendment][] {% not-enabled /%})_

## Goals

By the end of this tutorial, you will be able to:

- Create a **LoanSet transaction** with loan terms.
- Sign and add the loan broker's signature to the transaction.
- Sign and add the borrower's signature to the transaction.
- Submit the cosigned transaction to create a loan.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an XRP Ledger client library set up in your development environment. This page provides examples for the following:
  - **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js). See [Get Started Using JavaScript](https://xrpl.org/docs/tutorials/javascript/build-apps/get-started?__step=install-node-tag) for setup steps.

## Source Code

You can find the complete source code for this tutorial's examples in the [code samples section of this website's repository](https://github.com/ripple/opensource.ripple.com/tree/main/_code-samples/lending-protocol/).

## Steps

### 1. Install dependencies

{% tabs %}
{% tab label="JavaScript" %}
From the code sample folder, use npm to install dependencies:

```bash
npm install xrpl
```

{% /tab %}
{% /tabs %}

### 2. Set up client and accounts

To get started, import the necessary libraries and instantiate a client to connect to the XRPL. This example imports:
- `xrpl`: Used for XRPL client connection and transaction handling.
- `fs` and `child_process`: Used to run tutorial set up scripts.
- `ripple-keypairs` and `ripple-binary-codec`: Used to generate borrower's signature.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoan.js" language="js" before="// This step checks" /%}
{% /tab %}
{% /tabs %}

Next, load the loan broker account, borrower account, and loan broker ID.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoan.js" language="js" from="// This step checks" before="// Prepare LoanSet" /%}
{% /tab %}
{% /tabs %}

This example uses preconfigured accounts and loan broker data from the `lendingSetup.js` script, but you can replace `loanBroker`, `borrower`, and `loanBrokerID` with your own values.

### 3. Prepare LoanSet transaction

Create the [LoanSet transaction](../reference/transactions/loanset.md) object with the loan terms:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoan.js" language="js" from="// Prepare LoanSet" before="// Loan broker signs first" /%}
{% /tab %}
{% /tabs %}

The `Account` field is the loan broker, and the `Counterparty` field is the borrower. These fields can be swapped, but determine the signing order: the `Account` signs first, and the `Counterparty` signs second.

The loan terms include:
- `PrincipalRequested`: The amount of XRP (in drops) requested by the borrower.
- `InterestRate`: The annualized interest rate in 1/10th basis points (500 = 0.5%).
- `PaymentTotal`: The number of payments to be made.
- `PaymentInterval`: The number of seconds between payments (2592000 = 30 days).
- `GracePeriod`: The number of seconds after a missed payment before the loan can be defaulted (604800 = 7 days).
- `LoanOriginationFee`: A one-time fee charged when the loan is created.
- `LoanServiceFee`: A fee charged with every loan payment.

### 4. Add loan broker signature

The loan broker (the `Account`) signs the transaction first:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoan.js" language="js" from="// Loan broker signs first" before="// Borrower signs second" /%}
{% /tab %}
{% /tabs %}

The loan broker adds their `TxnSignature` and `SigningPubKey` to the `LoanSet` transaction object.

### 5. Add borrower signature

The borrower (the `Counterparty`) signs the transaction second:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoan.js" language="js" from="// Borrower signs second" before="// Submit and wait" /%}
{% /tab %}
{% /tabs %}

Add the borrower's signature as a `CounterpartySignature` object, which includes the borrower's `TxnSignature` and `SigningPubKey`.

{% admonition type="info" name="Note" %}
The `xrpl.js` library's `Wallet.sign()` method doesn't support signing over already-signed transactions. This example uses the `ripple-keypairs` and `ripple-binary-codec` libraries to create the borrower's signature.
{% /admonition %}

### 6. Submit LoanSet transaction

Sign and submit the fully signed `LoanSet` transaction to the XRP Ledger.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoan.js" language="js" from="// Submit and wait" before="// Extract loan information" /%}
{% /tab %}
{% /tabs %}

Verify that the transaction succeeded by checking for a `tesSUCCESS` result code.

### 7. Get loan information

Retrieve the loan's information from the transaction result by checking for the `Loan` entry in the transaction metadata.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoan.js" language="js" from="// Extract loan information" /%}
{% /tab %}
{% /tabs %}

## See Also

**Concepts**:
  - [Lending Protocol](../concepts/lending-protocol.md)

**Tutorials**:
  - [Create a Loan Broker](../tutorials/create-a-loan-broker.md)
  - [Manage a Loan](../tutorials/manage-a-loan.md)

**References**:
  - [LoanSet transaction](../reference/transactions/loanset.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
