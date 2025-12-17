---
seo:
    description: Withdraw assets from a vault by redeeming vault shares on the XRP Ledger.
metadata:
  indexPage: true
labels:
  - Single Asset Vault
---

# Withdraw from a Vault

{% raw-partial file="/docs/_snippets/_lending-sav-disclaimer.md" /%}

This tutorial shows you how to withdraw assets from a [single asset vault](../concepts/single-asset-vault.md). You can withdraw by specifying either how many assets you want to receive or how many shares you want to redeem. The vault burns the necessary shares and transfers the corresponding assets to your account.

_(Requires the [Single Asset Vault amendment][] {% not-enabled /%})_

## Goals

By the end of this tutorial, you will be able to:

- Withdraw assets from a private/public vault.
- Check the vault's state after a successful withdrawal.
- Check the depositor account's state after the withdrawal.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have previously deposited into a vault. See [Deposit into a Vault](./deposit-into-a-vault.md).
- Have an XRP Ledger client library set up in your development environment. This page provides examples for the following:
  - **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js). See [Get Started Using JavaScript](https://xrpl.org/docs/tutorials/javascript/build-apps/get-started?__step=install-node-tag) for setup steps.

## Source Code

You can find the complete source code for this tutorial's examples in the [code samples section of this website's repository](https://github.com/ripple/opensource.ripple.com/tree/main/_code-samples/vaults/).

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

To get started, import the client library and instantiate a client to connect to the XRPL.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/withdraw.js" language="js" from="import xrpl" before="// Get depositor account" /%}
{% /tab %}
{% /tabs %}

Provide the `depositor` account and specify the vault details:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/withdraw.js" language="js" from="// Get depositor account" before="// Get initial vault" /%}
{% /tab %}
{% /tabs %}

### 3. Check initial vault state

Before withdrawing, check the vault's current state to see its total assets and available liquidity.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/withdraw.js" language="js" from="// Get initial vault" before="// Check depositor's share balance" /%}
{% /tab %}
{% /tabs %}

### 4. Check share balance

Verify that the depositor account has vault shares to redeem. If not, the transaction will fail with a `tecINSUFFICIENT_FUNDS` error.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/withdraw.js" language="js" from="// Check depositor's share balance" before="// Prepare VaultWithdraw" /%}
{% /tab %}
{% /tabs %}

### 5. Prepare VaultWithdraw transaction

Create a [VaultWithdraw transaction](../reference/transactions/vaultwithdraw.md) to withdraw assets from the vault.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/withdraw.js" language="js" from="// Prepare VaultWithdraw" before="// Submit VaultWithdraw" /%}
{% /tab %}
{% /tabs %}

The transaction defines the account requesting the withdrawal, the vault's unique identifier (`VaultID`), and the amount to withdraw or redeem. You can specify the `Amount` field in two ways:

- **Asset amount**: When you specify an asset amount, the vault burns the necessary shares to provide that amount.
- **Share amount**: When you specify a share amount, the vault converts those shares into the corresponding asset amount.

While not required, you can provide a `Destination` account to receive the assets; if omitted, assets go to the account specified in the `Account` field.

{% admonition type="info" name="Note" %}
You can withdraw from a vault regardless of whether it's private or public. If you hold vault shares, you can always redeem them, even if your credentials in a private vault's permissioned domain have expired or been revoked. This prevents you from being locked out of your funds.
{% /admonition %}

### 6. Submit VaultWithdraw transaction

Submit the `VaultWithdraw` transaction to the XRP Ledger.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/withdraw.js" language="js" from="// Submit VaultWithdraw " before="// Extract vault state" /%}
{% /tab %}
{% /tabs %}

When the transaction succeeds:

- The vault calculates how many shares need to be burned to provide the requested asset amount.
- The vault transfers the assets from its pseudo-account to the depositor account (or the `Destination` account if specified).

{% admonition type="info" name="Note" %}
Transfer fees are not charged on `VaultWithdraw` transactions.
{% /admonition %}

### 6. Verify withdrawal

After withdrawing, check the vault's state. You can extract this information directly from the transaction metadata.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/withdraw.js" language="js" from="// Extract vault state" before="// Get the depositor's share balance" /%}
{% /tab %}
{% /tabs %}

Then, check the depositor's share balance:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/withdraw.js" language="js" from="// Get the depositor's share balance" before="// Get the depositor's asset balance" /%}
{% /tab %}
{% /tabs %}

Finally, verify the correct asset amount has been received by the depositor account:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/withdraw.js" language="js" from="// Get the depositor's asset balance" before="await client.disconnect" /%}
{% /tab %}
{% /tabs %}

## See Also

**Concepts**:

- [Single Asset Vault](../concepts/single-asset-vault.md)
- [Credentials](https://xrpl.org/docs/concepts/decentralized-storage/credentials)
- [Permissioned Domains](https://xrpl.org/docs/concepts/tokens/decentralized-exchange/permissioned-domains)

**Tutorials**:

- [Create a Single Asset Vault](./create-a-single-asset-vault.md)
- [Deposit into a Vault](./deposit-into-a-vault.md)

**References**:

- [VaultWithdraw transaction](../reference/transactions/vaultwithdraw.md)
- [vault_info method](../reference/api/vault-info.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
