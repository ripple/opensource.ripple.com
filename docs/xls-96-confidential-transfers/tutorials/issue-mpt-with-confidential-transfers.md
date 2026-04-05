---
seo:
  description: Issue a Multi-Purpose Token (MPT) with confidential transfers enabled on the XRP Ledger.
metadata:
  indexPage: true
labels:
  - Multi-Purpose Token
  - MPT
  - Token Issuance
  - Confidential Transfers
---
# Issue an MPT with Confidential Transfers

A [Multi-Purpose Token (MPT)](https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens) with [confidential transfers](../concepts/confidential-transfers.md) enabled allows token holders to keep their balances and transaction amounts private using encryption and Zero-Knowledge Proofs (ZKPs).

This tutorial shows you how to issue an MPT with confidential transfers enabled, register encryption keys on-ledger, and mint confidential tokens using a dual-account setup.

## Goals

By the end of this tutorial, you will be able to:

- Generate ElGamal encryption keypairs for confidential transfers.
- Issue an MPT with confidential transfers enabled and register the issuer's and auditor's ElGamal public keys.
- Mint confidential tokens by converting public tokens to confidential balances with auditor encryption for regulatory compliance.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Understand the [confidential transfers concept](../concepts/confidential-transfers.md).
- Have an XRP Ledger client library set up in your development environment. This page provides examples for the following:
  - **Python** with the [xrpl-py library](https://github.com/XRPLF/xrpl-py). See [Get Started Using Python](https://xrpl.org/docs/tutorials/get-started/get-started-python) for setup steps.

## Source Code

You can find the complete source code for this tutorial's example in the [code samples section of this website's repository](https://github.com/XRPLF/opensource.ripple.com/tree/main/_code-samples/confidential-transfers).

## Steps

The example in this tutorial demonstrates how to issue a confidential corporate bond MPT for confidential token distribution.

### 1. Install dependencies

{% tabs %}
{% tab label="Python" %}
From the code sample folder, install dependencies using pip:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
{% /tab %}
{% /tabs %}

### 2. Set up client and accounts

To get started, import the necessary libraries and instantiate a client to connect to the XRPL. This example imports:

{% tabs %}
{% tab label="Python" %}

- `json`: Used for loading and formatting JSON data.
- `xrpl`: Used for XRPL client connection and transaction handling.

{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" before="# Generate accounts" /%}
{% /tab %}
{% /tabs %}

Next, fund the necessary accounts. You'll need three accounts:

- **Issuer**: Creates the MPT issuance and registers encryption keys.
- **Issuer Second Account**: A regular holder account controlled by the issuer that holds confidential tokens.
- **Auditor**: Provides regulatory oversight with independent decryption capability.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="# Generate accounts" before="# Generate ElGamal" /%}
{% /tab %}
{% /tabs %}

<!-- {% admonition type="info" name="Note" %}
The ledger entry that defines an MPT issuance counts as one object towards the issuer's [owner reserve](https://xrpl.org/docs/concepts/accounts/reserves#owner-reserves), so the issuer needs to set aside **0.2 XRP** per MPT issuance.
{% /admonition %} -->

### 3. Generate ElGamal encryption keypairs

For confidential transfers, you need to generate ElGamal keypairs for encryption. These are separate from your XRPL account keys and must be persisted securely.

- **Issuer keypair**: Required to track the total confidential supply (mirror balance).
- **Issuer Second Account keypair**: Required for the secondary account that will hold confidential balances.
- **Auditor keypair**: Enables regulatory oversight with independent decryption capability. This is generally optional, but is included in this example for completeness.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="# Generate ElGamal" before="# Create MPT" /%}
{% /tab %}
{% /tabs %}

{% admonition type="danger" name="Warning" %}
**Store the private keys securely!** If you lose the ElGamal private keys, you **cannot**:

- Decrypt confidential balances.
- Generate ZKPs for transactions.
- Spend or manage confidential tokens.

Once registered on-ledger, ElGamal public keys are **permanently stored** and cannot be changed.
{% /admonition %}

### 4. Create the MPT issuance

To issue an MPT for confidential transfers, prepare an [MPTokenIssuanceCreate transaction](https://xrpl.org/docs/references/protocol/transactions/types/mptokenissuancecreate) with the **Can Privacy** flag enabled.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="# Create MPT Issuance" before="# Submit, sign" /%}
{% /tab %}
{% /tabs %}

Submit the transaction and retrieve the MPT Issuance ID:

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="# Submit, sign" before="# Register ElGamal keys" /%}
{% /tab %}
{% /tabs %}

{% admonition type="warning" name="Caution" %}
Once created, the MPT's privacy setting cannot be changed. If any holder has a non-zero confidential balance, you cannot disable the **Can Privacy** flag. Only enable confidential transfers if you're committed to supporting them long-term.
{% /admonition %}

### 5. Register ElGamal keys on-ledger

After creating the MPT issuance, register the issuer's and auditor's ElGamal public keys on-ledger using the [MPTokenIssuanceSet transaction](https://xrpl.org/docs/references/protocol/transactions/types/mptokenissuanceset). This allows:

- **Issuer**: To decrypt and track all confidential balances (mirror balances).
- **Auditor**: To independently decrypt and verify balances for regulatory compliance.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="# Register ElGamal keys" before="# Send public tokens " /%}
{% /tab %}
{% /tabs %}

### 6. Send public tokens to the second account

To prepare for confidential minting, the issuer sends public tokens to a second account via a [Payment transaction](https://xrpl.org/docs/references/protocol/transactions/types/payment). This dual-account setup separates the issuer's operational account from the account that will hold confidential balances.

First, the second account must authorize the MPT issuance.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="# Send public tokens" before="payment_tx"/%}
{% /tab %}
{% /tabs %}

Then, the issuer sends public tokens to the **second** account.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="payment_tx" before="# Convert public" /%}
{% /tab %}
{% /tabs %}

### 7. Convert to confidential balance

The second account must convert its public token balance to confidential using the [ConfidentialMPTConvert transaction][]. This transaction automatically registers the account's ElGamal public key on-ledger during the conversion.

Before creating the transaction, you need to do the following:

1. Compute the context hash for the Zero-Knowledge Proof.
2. Generate a Schnorr Proof of knowledge for the second account's ElGamal key.
3. Encrypt the amount for the second account (holder), issuer, and auditor.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="# Convert public balance" before="# Manually create" /%}
{% /tab %}
{% /tabs %}

{% admonition type="info" name="Note" %}
The context hash computation requires the account's sequence number before the transaction is submitted. This is why the code fetches the sequence number using an `AccountInfo` request before computing the ZKP. The sequence number is cryptographically bound to the proof to prevent replay attacks, so it cannot be autofilled after the proof is generated.
{% /admonition %}

Then, create and submit the transaction:
{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="# Manually create" before="# Merge inbox to spending balance" /%}
{% /tab %}
{% /tabs %}

{% admonition type="warning" name="Caution" %}
When an auditor key is registered on an MPT issuance, all confidential transactions must include the **auditor encrypted amount**. This ensures the auditor can independently decrypt and verify all confidential balances. Transactions that omit this field will fail with a `tecNO_PERMISSION` error.
{% /admonition %}

### 8. Merge inbox into spending balance

After conversion, tokens arrive in the holder's **inbox** balance. They must be merged into the spending balance via the [ConfidentialMPTMergeInbox transaction][] before they can be used (for example, sent to another account). This is a simple transaction that does not require proofs.

{% tabs %}
{% tab label="Python" %}
The Python SDK has a `prepare_confidential_merge_inbox()` helper function to prepare the transaction.

{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="# Merge inbox" before="# Verify confidential" /%}
{% /tab %}
{% /tabs %}

### 9. Verify confidential balances

Query the holder's `MPToken` object to verify the confidential balances.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="# Verify confidential" before="# Save keys and issuance data for use in other tutorials" /%}
{% /tab %}
{% /tabs %}

The `MPToken` object contains:

- **HolderElGamalPublicKey**: The holder's registered ElGamal public key.
- **ConfidentialBalanceSpending**: Encrypted balance available to spend.
- **ConfidentialBalanceInbox**: Encrypted balance waiting to be merged.
- **IssuerEncryptedBalance**: Encrypted mirror balance.
- **AuditorEncryptedBalance**: Encrypted balance for regulatory oversight.

Only the second account (holder), issuer, and auditor can decrypt their respective encrypted balances using their private keys.

### 10. Save keys for development

The code saves the ElGamal keys and MPT issuance ID to a `confidential-setup.json` file. This allows you to reuse them in other tutorials (such as sending confidential payments or auditing transactions).

{% admonition type="danger" name="Warning" %}
**This is for DEVELOPMENT and TESTING purposes ONLY!**

Never store private keys in plain text files in production environments. In production, use secure key management solutions such as Hardware Security Modules (HSMs), cloud key management services, or encrypted key stores with proper access controls.
{% /admonition %}

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="# Save keys and issuance data for use in other tutorials" /%}
{% /tab %}
{% /tabs %}

## See Also

- **Concepts**:
  - [Confidential Transfers](../concepts/confidential-transfers.md)
  - [Multi-Purpose Tokens (MPT)](https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens)
- **Tutorials**:
  - [Send Confidential Payments](send-confidential-payments.md)
  - [Audit Confidential Balances](audit-confidential-balances.md)
  - [Claw Back Confidential Balances](claw-back-confidential-balances.md)
- **References**:
  - [MPTokenIssuance entry](../references/updated-ledger-entries.md#mptokenissuance)
  - [MPToken entry](../references/updated-ledger-entries.md#mptoken)
  - [MPTokenIssuanceCreate transaction](../references/transactions/updated-transactions.md#mptokenissuancecreate)
  - [MPTokenIssuanceSet transaction](../references/transactions/updated-transactions.md#mptokenissuanceset)
  - [ConfidentialMPTConvert transaction](../references/transactions/confidentialmptconvert.md)
  - [ConfidentialMPTMergeInbox transaction](../references/transactions/confidentialmptmergeinbox.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
