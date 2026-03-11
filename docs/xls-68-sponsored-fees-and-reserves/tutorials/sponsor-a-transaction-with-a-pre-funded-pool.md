---
seo:
    description: Create a sponsorship pool that allows a sponsee to submit sponsored transactions without requiring the sponsor to co-sign each one.
status: not_enabled
---
# Sponsor a Transaction with a Pre-funded Pool

This tutorial shows how to use the [pre-funded sponsorship flow](../concepts/sponsored-fees-and-reserves.md#how-sponsorship-works), where a sponsor allocates XRP upfront for a sponsee to draw from for fees and reserves. In this example, a sponsor onboards a new user (sponsee) who has no XRP, and sets up a pre-funded pool that the sponsee can use for transaction fees and reserves.

A pre-funded pool is best when the sponsor wants the sponsee to transact independently, such as for ongoing or batch operations where the sponsor doesn't need to approve each transaction. If the sponsor needs to approve every transaction individually, use [co-signing](./sponsor-a-transaction.md) instead.

{% partial file="/docs/_snippets/_sponsor-disclaimer.md" /%}

_(Requires the [Sponsor amendment][] {% not-enabled /%})_

## Goals

By following this tutorial, you should learn how to:

- Create a pre-funded sponsorship pool.
- Use the pool to sponsor a transaction.

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

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_pre_funded.py" language="py" before="# Load setup data" /%}
{% /tab %}
{% /tabs %}

Next, fund the sponsor account with some XRP. The sponsee doesn't need to be funded as the sponsor covers all costs.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_pre_funded.py" language="py" from="# Load setup data" before="# Sponsor creates the sponsee" /%}

This example uses a preconfigured MPT issuance from the `sponsored_fees_and_reserves_setup.py` script, but you can replace this with your own.
{% /tab %}
{% /tabs %}

### 3. Create the sponsee's account

The sponsee doesn't have an account yet, so the sponsor must create it. To do this, submit a [Payment transaction](https://xrpl.org/docs/references/protocol/transactions/types/payment) with the [tfSponsorCreatedAccount](../references/transactions/updated-transactions.md#payment-flags) flag enabled. This places the base reserve obligation on the sponsor and creates an AccountRoot ledger entry for the sponsee.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_pre_funded.py" language="py" from="# Sponsor creates the sponsee" before="# Verify the sponsee" /%}
{% /tab %}
{% /tabs %}

{% admonition type="info" name="Note" %}
The payment amount is set to **1 drop** because a Payment requires a positive amount, but the actual base reserve is covered by the sponsor.
{% /admonition %}

Check the transaction result to confirm the account was created with the correct sponsor.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_pre_funded.py" language="py" from="# Verify the sponsee" before="# Create the Sponsorship object" /%}
{% /tab %}
{% /tabs %}

### 4. Create a pre-funded pool

Prepare a [SponsorshipSet transaction](../references/transactions/sponsorshipset.md) to pre-fund a pool of XRP that the sponsee can use to cover transaction fees and reserves.

Set the _fee amount_ to the XRP (in drops) allocated for fees, and the _reserve count_ to the number of ledger objects the sponsor covers reserves for.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_pre_funded.py" language="py" from="# Create the Sponsorship object" before="# Submit the SponsorshipSet" /%}
{% /tab %}
{% /tabs %}

The SponsorshipSet transaction requires either a `Sponsee` or `CounterpartySponsor` field, but not both. In this example, the sponsor is the `Account` because they are the one creating and funding the pool, so the `Sponsee` field identifies who can use it. If instead the sponsee wanted to initiate or modify the arrangement, they would be the `Account` and use `CounterpartySponsor` to identify the sponsor.

Submit the SponsorshipSet transaction to the network and verify that it succeeded.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_pre_funded.py" language="py" from="# Submit the SponsorshipSet" before="# Use the pool to submit" /%}
{% /tab %}
{% /tabs %}

{% admonition type="success" name="Tip" %}
By default, the sponsee can draw from the pool without the sponsor's approval. If you want the sponsor to approve each transaction that uses the pool, enable the `tfSponsorshipSetRequireSignForFee` and `tfSponsorshipSetRequireSignForReserve` flags.

This is different from the [co-signing flow](./sponsor-a-transaction.md), as the pool still handles the funding, but the sponsor must sign off on each usage. For example, a business could pre-fund a pool for a partner but require approval before each withdrawal to maintain oversight over how the funds are used.
{% /admonition %}

### 5. Use the pool to submit a sponsored transaction

The sponsee can now use the pool to submit sponsored transactions. In this example, the sponsee submits an [MPTokenAuthorize transaction](https://xrpl.org/docs/references/protocol/transactions/types/mptokenauthorize) to hold an MPT.

{% admonition type="info" name="Note" %}
While this tutorial demonstrates sponsorship for MPTokenAuthorize, there are many other [sponsorable transactions](../concepts/sponsored-fees-and-reserves.md#enabling-sponsorship-and-covering-costs) available.
{% /admonition %}

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_pre_funded.py" language="py" from="# Use the pool to submit" before="# Verify the transaction was sponsored" /%}
{% /tab %}
{% /tabs %}

The sponsor flags indicate what the sponsor will cover; in this case the fee and reserve. No signature is needed from the sponsor as the pool authorizes the usage automatically.

Verify the transaction was sponsored by checking the relevant fields in the result.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_pre_funded.py" language="py" from="# Verify the transaction was sponsored" before="# Show who paid what" /%}
{% /tab %}
{% /tabs %}

### 6. Confirm sponsorship details

Inspect the affected `AccountRoot` nodes to confirm the sponsor paid the fee and covered the reserve.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_pre_funded.py" language="py" from="# Show who paid what" /%}
{% /tab %}
{% /tabs %}

## See Also

**Concepts**:

- [Sponsored Fees and Reserves](../concepts/sponsored-fees-and-reserves.md)

**Tutorials**:

- [Sponsor a Transaction by Co-Signing](./sponsor-a-transaction.md)
- [Transfer a Reserve Sponsorship](./transfer-a-reserve-sponsorship.md)
- [Manage a Sponsorship Pool](./manage-a-sponsorship-pool.md)

**References**:

- [Sponsorship ledger entry][]
- [SponsorshipSet transaction][]
- [Updated Common Transaction Fields](../references/transactions/updated-common-transaction-fields.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
