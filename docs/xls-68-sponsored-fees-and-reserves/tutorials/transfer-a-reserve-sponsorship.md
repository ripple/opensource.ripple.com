---
seo:
    description: Create, reassign, or end a reserve sponsorship.
status: not_enabled
---
# Transfer a Reserve Sponsorship

This tutorial shows how to use the [SponsorshipTransfer transaction][] to manage reserve sponsorship on a ledger object (for example, an `MPToken`). SponsorshipTransfer also supports account-level sponsorship.

The tutorial covers three scenarios:

- **Create**: Add sponsorship to an existing unsponsored object.
- **Reassign**: Transfer sponsorship from one sponsor to another.
- **End**: Remove sponsorship so the sponsee takes over the reserve obligation.

{% partial file="/docs/_snippets/_sponsor-disclaimer.md" /%}

_(Requires the [Sponsor amendment][] {% not-enabled /%})_

## Goals

By following this tutorial, you should learn how to:

- Create a reserve sponsorship on an existing unsponsored ledger object.
- Reassign a reserve sponsorship from one sponsor to another.
- End a reserve sponsorship so the sponsee covers its own reserve.

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

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_sponsorship.py" language="py" before="# Load setup data" /%}
{% /tab %}
{% /tabs %}

Next, fund three accounts:

- **Sponsor A**: The original sponsor
- **Sponsor B**: The new sponsor
- **Sponsee**: The account being sponsored

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_sponsorship.py" language="py" from="# Load setup data" before="# Submit an unsponsored MPTokenAuthorize transaction" /%}
{% /tab %}
{% /tabs %}

This example uses a preconfigured MPT issuance from the `sponsored_fees_and_reserves_setup.py` script, but you can replace it with your own.

### 3. Submit an unsponsored transaction

Submit an [MPTokenAuthorize transaction](https://xrpl.org/docs/references/protocol/transactions/types/mptokenauthorize) without any sponsorship. This creates an `MPToken` object whose reserve is currently covered by the sponsee.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_sponsorship.py" language="py" from="# Submit an unsponsored MPTokenAuthorize transaction" before="# Create a reserve sponsorship" /%}
{% /tab %}
{% /tabs %}

### 4. Create a reserve sponsorship

Now that the sponsee has an existing unsponsored object, you can add sponsorship to it by submitting a [SponsorshipTransfer transaction][] with the `tfSponsorshipCreate` flag, the ID of the ledger object, and the sponsor's address.

The new sponsor can either co-sign the transaction or use a [pre-funded sponsorship pool](./sponsor-a-transaction-with-a-pre-funded-pool.md). This example uses co-signing.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_sponsorship.py" language="py" from="# Create a reserve sponsorship" before="# Verify the sponsorship was created" /%}
{% /tab %}
{% /tabs %}

Check the transaction metadata to confirm the MPToken's `Sponsor` field is set to Sponsor A.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_sponsorship.py" language="py" from="# Verify the sponsorship was created" before="# Reassign the reserve sponsorship" /%}
{% /tab %}
{% /tabs %}

### 5. Reassign the reserve sponsorship

Over time, a sponsor may want to recoup their reserves. The sponsee can transfer the sponsorship to a new sponsor so the original sponsor is released from the obligation.

To reassign a reserve sponsorship, submit a [SponsorshipTransfer transaction][] with the `tfSponsorshipReassign` flag, the ID of the ledger object, and the new sponsor's address. As with creating a sponsorship, the new sponsor can either co-sign the transaction or use a [pre-funded sponsorship pool](./sponsor-a-transaction-with-a-pre-funded-pool.md). This example uses co-signing.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_sponsorship.py" language="py" from="# Reassign the reserve sponsorship" before="# Verify the sponsorship was reassigned" /%}
{% /tab %}
{% /tabs %}

Check the transaction metadata to confirm the MPToken's `Sponsor` field now points to Sponsor B.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_sponsorship.py" language="py" from="# Verify the sponsorship was reassigned" before="# End the reserve sponsorship" /%}
{% /tab %}
{% /tabs %}

### 6. End the reserve sponsorship

A sponsee may want to take on the reserve burden themselves, or a sponsor may want to recoup the reserve when no new sponsor is available. Either party can end the sponsorship at any time. For this example, the sponsee ends the sponsorship.

To end a reserve sponsorship, submit a [SponsorshipTransfer transaction][] with the `tfSponsorshipEnd` flag and the ID of the ledger object.

{% admonition type="warning" name="Warning" %}
The sponsee must have enough XRP to cover the reserve.
{% /admonition %}

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_sponsorship.py" language="py" from="# End the reserve sponsorship" before="# Verify the sponsorship was ended" /%}
{% /tab %}
{% /tabs %}

Check the transaction metadata to confirm the sponsorship has ended.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_sponsorship.py" language="py" from="# Verify the sponsorship was ended" /%}
{% /tab %}
{% /tabs %}

The sponsee is now responsible for covering the reserve obligation.

{% admonition type="info" name="What happens when a sponsored object is deleted" %}
When a sponsored ledger object (such as an MPToken) is deleted, the reserve obligation is automatically released. The sponsor's `SponsoringOwnerCount` decreases and the reserve is freed back to the sponsor. You don't need to end the sponsorship first.
{% /admonition %}

## See Also

**Concepts**:

- [Sponsored Fees and Reserves](../concepts/sponsored-fees-and-reserves.md)

**Tutorials**:

- [Sponsor a Transaction by Co-Signing](./sponsor-a-transaction.md)
- [Sponsor a Transaction with a Pre-funded Pool](./sponsor-a-transaction-with-a-pre-funded-pool.md)
- [Manage a Sponsorship Pool](./manage-a-sponsorship-pool.md)

**References**:

- [SponsorshipTransfer transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
