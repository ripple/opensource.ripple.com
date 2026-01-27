---
seo:
  description: Create a loan broker on the XRP Ledger.
metadata:
  indexPage: true
labels:
  - Lending Protocol
---

# Create a Loan Broker

This tutorial shows you how to create a [LoanBroker](../reference/ledger-data/loanbroker.md) on the XRP Ledger using a private vault. A loan broker creates and manages loans, and also manages the first-loss capital for a connected single asset vault.

_(Requires the [Lending Protocol amendment][] {% not-enabled /%})_

## Goals

By the end of this tutorial, you will be able to:

- Create a **loan broker** linked to a private single asset vault.
- Configure loan broker parameters, such as a management fee rate.
- Retrieve the loan broker ID and pseudo-account.

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

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoanBroker.js" language="js" before="// This step checks" /%}
{% /tab %}
{% /tabs %}

Next, load the vault owner account and vault ID. The vault owner will also be the loan broker.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoanBroker.js" language="js" from="// This step checks" before="// Prepare LoanBrokerSet" /%}
{% /tab %}
{% /tabs %}

This example uses preconfigured accounts and vault data from the `lendingSetup.js` script, but you can replace `loanBroker` and `vaultID` with your own values.

### 3. Prepare LoanBrokerSet transaction

Create the [LoanBrokerSet transaction](../reference/transactions/loanbrokerset.md) object:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoanBroker.js" language="js" from="// Prepare LoanBrokerSet" before="// Submit, sign" /%}
{% /tab %}
{% /tabs %}

The `ManagementFeeRate` is set in 1/10th basis points. A value of `1000` equals 1% (100 basis points).

### 4. Submit LoanBrokerSet transaction

Sign and submit the `LoanBrokerSet` transaction to the XRP Ledger.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoanBroker.js" language="js" from="// Submit, sign" before="// Extract loan broker" /%}
{% /tab %}
{% /tabs %}

Verify that the transaction succeeded by checking for a `tesSUCCESS` result code.

### 5. Get loan broker information

Retrieve the loan broker's information from the transaction result by checking for the `LoanBroker` entry in the transaction metadata.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoanBroker.js" language="js" from="// Extract loan broker" /%}
{% /tab %}
{% /tabs %}

The loan broker pseudo-account is a special account that holds first-loss capital.

## See Also

**Concepts**:
  - [Lending Protocol](../concepts/lending-protocol.md)
  - [Single Asset Vault](../../xls-65d-single-asset-vault/concepts/single-asset-vault.md)

**Tutorials**:
  - [Create a Single Asset Vault](../../xls-65d-single-asset-vault/tutorials/create-a-single-asset-vault.md)
  - [Deposit and Withdraw First-Loss Capital](../tutorials/deposit-and-withdraw-cover.md)
  - [Create a Loan](../tutorials/create-a-loan.md)

**References**:
  - [LoanBrokerSet transaction](../reference/transactions/loanbrokerset.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
