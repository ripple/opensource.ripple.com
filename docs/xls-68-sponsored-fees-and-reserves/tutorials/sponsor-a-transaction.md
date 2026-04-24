---
seo:
    description: Co-sign a transaction to cover fees and reserves for another account on the XRPL.
status: not_enabled
---
# Sponsor a Transaction by Co-Signing

This tutorial shows how to use the [co-signed sponsorship flow](../concepts/sponsored-fees-and-reserves.md#how-sponsorship-works), where a sponsor explicitly approves each transaction by co-signing. In this example, a sponsor onboards a new user (sponsee) who has no XRP, and covers the fee and reserve for an [MPTokenAuthorize transaction](https://xrpl.org/docs/references/protocol/transactions/types/mptokenauthorize).

Co-signing is ideal when the sponsor needs to approve each transaction individually, such as for one-off sponsorships or when the sponsor must stay in control of every action. If the sponsor wants to pre-allocate funds so the sponsee can transact independently, use a [pre-funded pool](./sponsor-a-transaction-with-a-pre-funded-pool.md) instead.

{% partial file="/docs/_snippets/_sponsor-disclaimer.md" /%}

_(Requires the [Sponsor amendment][] {% not-enabled /%})_

## Goals

By following this tutorial, you should learn how to:

- Use the co-signing flow to sponsor a transaction for a sponsee.
- Confirm that the sponsor paid the fee and covered the reserve.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an XRP Ledger client library set up in your development environment. This page provides examples for the following:
  - **Python** with the [xrpl-py library](https://github.com/XRPLF/xrpl-py). See [Get Started Using Python](https://xrpl.org/docs/tutorials/get-started/get-started-python) for setup steps.

## Source Code

You can find the complete source code for this tutorial in the [code samples section](https://github.com/ripple/opensource.ripple.com/tree/main/_code-samples/sponsored-fees-and-reserves/py/) of this repository.

## Steps

### 1. Install dependencies

{% tabs %}
{% tab label="Python" %}
From the code sample folder, set up a virtual environment and use `pip` to install dependencies.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
{% /tab %}
{% /tabs %}

### 2. Set up client and fund sponsor account

To get started, import the necessary libraries and instantiate a client to connect to the XRPL. This example imports:

{% tabs %}
{% tab label="Python" %}

- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `json`: Used for formatting JSON data.
- `os`, `subprocess`, and `sys`: Used to run tutorial setup scripts and handle errors.

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_co_signed.py" language="py" before="# Load setup data" /%}
{% /tab %}
{% /tabs %}

Next, fund the sponsor account with some XRP. The sponsee doesn't need to be funded as the sponsor covers all costs.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_co_signed.py" language="py" from="# Load setup data" before="# Sponsor creates the sponsee" /%}

This example uses a preconfigured MPT issuance from the `sponsored_fees_and_reserves_setup.py` script, but you can replace this with your own.
{% /tab %}
{% /tabs %}

### 3. Create the sponsee's account

The sponsee doesn't have an account yet, so the sponsor must create it. To do this, submit a [Payment transaction](https://xrpl.org/docs/references/protocol/transactions/types/payment) with the [tfSponsorCreatedAccount](../references/transactions/updated-transactions.md#payment-flags) flag enabled. Enabling this flag places the base reserve obligation on the sponsor and creates an AccountRoot ledger entry for the sponsee.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_co_signed.py" language="py" from="# Sponsor creates the sponsee" before="# Verify the sponsee" /%}
{% /tab %}
{% /tabs %}

{% admonition type="info" name="Note" %}
The payment amount is set to **1 drop** because a Payment requires a positive amount, but the actual base reserve is covered by the sponsor.
{% /admonition %}

Verify the account was created for the sponsee with the correct sponsor.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_co_signed.py" language="py" from="# Verify the sponsee" before="# Prepare the sponsored" /%}
{% /tab %}
{% /tabs %}

### 4. Prepare the sponsored transaction

Prepare a sponsored transaction where the sponsor covers the fee and reserve. For this example, the sponsee requires sponsorship for an [MPTokenAuthorize transaction](https://xrpl.org/docs/references/protocol/transactions/types/mptokenauthorize) to hold an MPT.

{% admonition type="info" name="Note" %}
While this tutorial demonstrates sponsorship for MPTokenAuthorize, there are many other [sponsorable transactions](../concepts/sponsored-fees-and-reserves.md#enabling-sponsorship-and-covering-costs) available.
{% /admonition %}

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_co_signed.py" language="py" from="# Prepare the sponsored" before="# The sponsee signs" /%}
{% /tab %}
{% /tabs %}

The sponsor flags specify what the sponsor covers. You need both flags because in this scenario the sponsor covers all costs: the fee flag covers the transaction cost, and the reserve flag covers the owner reserve for any ledger objects created by the transaction.

The transaction is autofilled to populate fields like `Sequence`, `Fee`, and `LastLedgerSequence`. This must happen **before** signing because both signatures commit to these exact fields. If autofill happened after signing, it would change the transaction and invalidate the signatures.

{% tabs %}
{% tab label="Python" %}
Sign the transaction as the sponsee first using the `sign()` function, then co-sign as the sponsor with the `sign_as_sponsor()` function.

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_co_signed.py" language="py" from="# The sponsee signs" before="# Submit the sponsored" /%}
{% /tab %}
{% /tabs %}

### 5. Submit sponsored transaction

Submit the sponsored transaction to the network.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_co_signed.py" language="py" from="# Submit the sponsored" before="# Verify the transaction was sponsored" /%}
{% /tab %}
{% /tabs %}

Verify the transaction was sponsored by checking the relevant fields in the result.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_co_signed.py" language="py" from="# Verify the transaction was sponsored" before="# Show who paid what" /%}
{% /tab %}
{% /tabs %}

### 6. Confirm sponsorship details

Inspect the affected `AccountRoot` nodes to confirm the sponsor paid the fee and covered the reserve.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_co_signed.py" language="py" from="# Show who paid what" /%}
{% /tab %}
{% /tabs %}

## See Also

**Concepts**:

- [Sponsored Fees and Reserves](../concepts/sponsored-fees-and-reserves.md)

**Tutorials**:

- [Sponsor a Transaction with a Pre-funded Pool](./sponsor-a-transaction-with-a-pre-funded-pool.md)
- [Transfer a Reserve Sponsorship](./transfer-a-reserve-sponsorship.md)
- [Manage a Sponsorship Pool](./manage-a-sponsorship-pool.md)

**References**:

- [Updated Common Transaction Fields](../references/transactions/updated-common-transaction-fields.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
