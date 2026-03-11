---
seo:
    description: Manage a pre-funded sponsorship pool on the XRPL.
status: not_enabled
---
# Manage a Sponsorship Pool

This tutorial shows you how to manage a pre-funded sponsorship pool using the [SponsorshipSet transaction][].

{% partial file="/docs/_snippets/_sponsor-disclaimer.md" /%}

_(Requires the [Sponsor amendment][] {% not-enabled /%})_

## Goals

By following this tutorial, you should learn how to:

- Update a pool to adjust the fee allocation and reserve slots.
- Delete a pool to reclaim the remaining funds for the sponsor.

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

### 2. Set up client and fund accounts

To get started, import the necessary libraries and instantiate a client to connect to the XRPL. The example imports:

{% tabs %}
{% tab label="Python" %}

- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `json`: Used for formatting JSON data.
- `os`, `subprocess`, and `sys`: Used to run tutorial setup scripts and handle errors.

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" before="# Load setup data" /%}
{% /tab %}
{% /tabs %}

Next, fund both the sponsor and sponsee accounts.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Load setup data" before="# Create a sponsorship pool" /%}
{% /tab %}
{% /tabs %}

This example uses an MPT issuance from the `sponsored_fees_and_reserves_setup.py` script, but you can replace it with your own.

### 3. Create a sponsorship pool

Create a sponsorship pool that the sponsee can draw from for fees and reserves using the [SponsorshipSet transaction][].

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Create a sponsorship pool" before="# Use the sponsorship pool" /%}
{% /tab %}
{% /tabs %}

### 4. Use the sponsorship pool

Use the pool to sponsor an [MPTokenAuthorize transaction](https://xrpl.org/docs/references/protocol/transactions/types/mptokenauthorize). This consumes part of the pool's fee allocation, for the transaction fee, and one of its reserve slots for the new `MPToken` object.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Use the sponsorship pool" before="# Update the sponsorship pool" /%}
{% /tab %}
{% /tabs %}

### 5. Update the sponsorship pool

You can update an existing pool by submitting another `SponsorshipSet` transaction with new values. This example tops up the fee allocation and increases the number of reserve slots.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Update the sponsorship pool" before="# Check sponsor balance before deletion" /%}
{% /tab %}
{% /tabs %}

### 6. Delete the sponsorship pool

Before deleting, check the sponsor's balance so you can compare it after the deletion to see the funds returned.

Submit a [SponsorshipSet transaction](../references/transactions/sponsorshipset.md) with the `tfDeleteObject` flag to delete the Sponsorship ledger entry.

{% admonition type="success" name="Tip" %}
Either the sponsor or the sponsee can delete a sponsorship pool. The sponsee can submit the transaction by setting the `CounterpartySponsor` field to the sponsor's address. In both cases, the remaining funds are returned to the sponsor.
{% /admonition %}

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Check sponsor balance before deletion" before="# Verify the Sponsorship object was deleted" /%}
{% /tab %}
{% /tabs %}

Check the transaction metadata to confirm the Sponsorship object was deleted. Then compare the sponsor's balance before and after to see the remaining pool funds returned. Note that the delete transaction itself has a fee, which is separate from the pool refund.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Verify the Sponsorship object was deleted" /%}
{% /tab %}
{% /tabs %}

{% admonition type="info" name="Note" %}
Deleting a sponsorship pool does not revoke sponsorship on objects that already consumed reserve slots from the pool. Those objects remain sponsored until the sponsorship is explicitly ended using a [SponsorshipTransfer transaction][] with the `tfSponsorshipEnd` flag.
{% /admonition %}

## See Also

**Concepts**:

- [Sponsored Fees and Reserves](../concepts/sponsored-fees-and-reserves.md)

**Tutorials**:

- [Sponsor a Transaction by Co-Signing](./sponsor-a-transaction.md)
- [Sponsor a Transaction with a Pre-funded Pool](./sponsor-a-transaction-with-a-pre-funded-pool.md)
- [Transfer a Reserve Sponsorship](./transfer-a-reserve-sponsorship.md)

**References**:

- [SponsorshipSet transaction][]
- [Sponsorship ledger entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
