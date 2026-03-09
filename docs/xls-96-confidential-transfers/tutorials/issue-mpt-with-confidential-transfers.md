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

A [Multi-Purpose Token (MPT)](https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens) with [confidential transfers](../concepts/confidential-transfers.md) enabled allows token holders to keep their balances and transaction amounts private using encryption and zero-knowledge proofs.

This tutorial shows you how to issue an MPT with confidential transfers enabled, set up encryption keys, and demonstrate confidential minting using a dual-account setup to obfuscate amounts.

## Goals

By the end of this tutorial, you will be able to:

- Generate ElGamal encryption keypairs for confidential transfers.
- Issue an MPT with confidential transfers enabled and register the issuer's ElGamal public key.
- Use a second holder account, controlled by the issuer, to set up initial confidential token supply.

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

First, import the necessary libraries for working with the XRP Ledger and confidential transfers:

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" before="# Load wallets from file" /%}
{% /tab %}
{% /tabs %}

Next, load your account data, connect to the XRP Ledger network, and create wallet instances:

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="# Load wallets from file" before="print(\"=== ElGamal Key Setup ===\")" /%}
{% /tab %}
{% /tabs %}

{% admonition type="info" name="Note" %}
The ledger entry that defines an MPT issuance counts as one object towards the issuer's [owner reserve](https://xrpl.org/docs/concepts/accounts/reserves#owner-reserves), so the issuer needs to set aside **2 XRP** per MPT issuance.
{% /admonition %}

### 3. Generate and persist ElGamal encryption keypairs

For confidential transfers, you need to generate ElGamal keypairs for encryption. These are separate from your XRPL account keys and must be persisted securely.

- **Issuer keypair**: Required to track the total confidential supply (mirror balance).
- **Holder keypair**: Required for each account that will hold confidential balances.

First, initialize the MPTCrypto library and generate or load the issuer's ElGamal keypair:

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="print(\"=== ElGamal Key Setup ===\")" before="print(\"--- Second Account ElGamal Key ---\")" /%}
{% /tab %}
{% /tabs %}

Then, generate or load the ElGamal keypair for the second account:

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="print(\"--- Second Account ElGamal Key ---\")" before="print(\"=== STEP 1: Creating MPT Issuance ===\")" /%}
{% /tab %}
{% /tabs %}

{% admonition type="danger" name="Critical: Key Persistence" %}
**Store the private keys securely!** If you lose the ElGamal private keys, you **cannot**:
- Decrypt confidential balances
- Generate zero-knowledge proofs for transactions
- Clean up MPTs with confidential balances (you'll get `tecBAD_PROOF` errors)

The tutorial automatically saves keys to `test-wallets.json` for persistence across runs. In production, use a hardware security module (HSM) or secure key management system.
{% /admonition %}

### 4. Submit the MPTokenIssuanceCreate transaction

To issue an MPT with confidential transfers enabled, create an `MPTokenIssuanceCreate` transaction. The most important field is `Flags`, which must include `TF_MPT_CAN_PRIVACY` to enable confidential transfers using ElGamal encryption.

First, prepare the MPT metadata:

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="print(\"--- Prepare MPT Metadata ---\")" before="print(\"--- Create MPTokenIssuanceCreate Transaction ---\")" /%}
{% /tab %}
{% /tabs %}

Next, create the `MPTokenIssuanceCreate` transaction with the `TF_MPT_CAN_PRIVACY` flag:

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="print(\"--- Create MPTokenIssuanceCreate Transaction ---\")" before="print(\"--- Submit Transaction ---\")" /%}
{% /tab %}
{% /tabs %}

Finally, submit the transaction and save the MPT Issuance ID:

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="print(\"--- Submit Transaction ---\")" before="print(\"=== STEP 2: Registering issuer ElGamal key on-ledger ===\")" /%}
{% /tab %}
{% /tabs %}

{% admonition type="warning" name="Warning" %}
Once created, the MPT's privacy setting cannot be changed. If any holder has a non-zero confidential balance, you cannot disable the `TF_MPT_CAN_PRIVACY` flag. Only enable confidential transfers if you're committed to supporting them long-term.
{% /admonition %}

### 5. Submit MPTokenIssuanceSet transaction

After creating the MPT issuance, register the issuer's ElGamal public key on-ledger using an `MPTokenIssuanceSet` transaction. This allows other accounts to encrypt confidential amounts for the issuer.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="print(\"=== STEP 2: Registering issuer ElGamal key on-ledger ===\")" before="print(\"=== STEP 3: Sending public tokens to second account ===\")" /%}
{% /tab %}
{% /tabs %}

A `tesSUCCESS` result indicates that the ElGamal public key was registered successfully.

{% admonition type="warning" name="Warning" %}
Once registered on-ledger, ElGamal public keys are **permanently locked**. You cannot update them, even with `MPTokenIssuanceSet`. Generate and test keys carefully before registering them on-ledger.
{% /admonition %}

### 6. Send public tokens to the second issuer account

To obfuscate the initial token distribution, use a dual-account setup where the issuer sends public tokens to a second account, which then converts them to confidential balances. This prevents observers from seeing the exact amount initially minted.

The process involves:

1. The second account authorizes the MPT issuance (creates an MPToken ledger object)
2. The issuer sends public tokens to the second account
3. The second account converts these to confidential balances (next step)

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="print(\"=== STEP 3: Sending public tokens to second account ===\")" before="print(\"=== STEP 4: Converting public balance to confidential ===\")" /%}
{% /tab %}
{% /tabs %}

{% admonition type="info" name="Note" %}
This dual-account approach is a best practice for confidential minting. Without it, observers could see the exact amount minted by watching the issuer's public transactions.
{% /admonition %}

### 7. Convert public tokens to confidential balances

The second account converts its public tokens to confidential balances using a `ConfidentialMPTConvert` transaction. This transaction also registers the holder's ElGamal public key on-ledger.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="print(\"=== STEP 4: Converting public balance to confidential ===\")" before="print(\"=== STEP 5: Merging inbox to spending balance ===\")" /%}
{% /tab %}
{% /tabs %}

The `prepare_confidential_convert` helper automatically:
- Retrieves the issuer's public key from the ledger
- Encrypts the amount for both the holder and the issuer
- Generates a Schnorr proof of knowledge for the holder's ElGamal key
- Creates the properly formatted transaction

### 8. Merge inbox to spending balance

After conversion, tokens arrive in the holder's "inbox" balance. They must be merged into the spending balance before they can be used.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="print(\"=== STEP 5: Merging inbox to spending balance ===\")" before="print(\"=== STEP 6: Issuer second account balances ===\\n\")" /%}
{% /tab %}
{% /tabs %}

This is a simple transaction that requires no zero-knowledge proofs.

### 9. Verify confidential balances

Query the holder's MPToken object to verify the confidential balances.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue-mpt-confidential.py" language="py" from="print(\"=== STEP 6: Issuer second account balances ===\\n\")" /%}
{% /tab %}
{% /tabs %}

The MPToken object contains:
- **MPTAmount**: Public (visible) balance
- **ConfidentialBalanceSpending**: Encrypted balance available to spend
- **ConfidentialBalanceInbox**: Encrypted balance waiting to be merged

Only the holder with the ElGamal private key can decrypt these confidential balances.

## Next Steps

Now that you have created an MPT with confidential transfers and demonstrated confidential minting, you can:

- **Send confidential payments**: Use `ConfidentialMPTSend` to transfer tokens while keeping amounts private.
- **Monitor confidential supply**: Query the `ConfidentialOutstandingAmount` field on the MPTokenIssuance to track total confidential supply.
- **Implement auditor support**: Once `xrpl-py` adds support for auditor encrypted amounts, configure an auditor for regulatory compliance.

## See Also

- **Concepts**:
  - [Confidential Transfers](../concepts/confidential-transfers.md)
  - [Multi-Purpose Tokens (MPT)](https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens)
- **References**:
  - [MPTokenIssuance entry](../references/updated-ledger-entries.md#mptokenissuance)
  - [MPToken entry](../references/updated-ledger-entries.md#mptoken)
  - [MPTokenIssuanceCreate transaction](../references/transactions/updated-transactions.md#mptokenissuancecreate)
  - [MPTokenIssuanceSet transaction](../references/transactions/updated-transactions.md#mptokenissuanceset)
  - [ConfidentialMPTConvert transaction](../references/transactions/confidentialmptconvert.md)
  - [ConfidentialMPTMergeInbox transaction](../references/transactions/confidentialmptmergeinbox.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
