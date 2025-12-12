---
seo:
    description: Deposit assets into a vault and receive vault shares on the XRP Ledger.
metadata:
  indexPage: true
labels:
  - Single Asset Vault
---

# Deposit into a Vault

This tutorial shows you how to deposit assets into a [single asset vault](../concepts/single-asset-vault.md). The example demonstrates depositing into a private vault with credential-based access control, however you can easily use the same code to deposit into a public vault.

When you deposit into a vault, you receive shares that represent your proportional ownership of the vault's assets. For example, in an institutional lending context, depositing into a vault allows you to pool your assets with other depositors to participate in larger lending markets.

_(Requires the [Single Asset Vault amendment][] {% not-enabled /%})_

## Goals

By the end of this tutorial, you will be able to:

- Deposit assets into a private/public vault.
- Check the depositing account's share balance and the vault's state after a successful deposit.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have access to an existing vault. See [Create a Single Asset Vault](./create-a-single-asset-vault.md).
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
{% code-snippet file="/_code-samples/vaults/js/deposit.js" language="js" from="import xrpl" before="const depositor" /%}
{% /tab %}
{% /tabs %}

Provide the depositing account and specify the vault details. The depositor must have a balance of the vault's asset to deposit.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/deposit.js" language="js" from="depositor =" before="// Get initial vault" /%}
{% /tab %}
{% /tabs %}

{% admonition type="info" name="Note" %}
This example uses an existing private vault, so the depositor must have valid [Credentials](https://xrpl.org/docs/concepts/decentralized-storage/credentials) in the vault's [Permissioned Domain](https://xrpl.org/docs/concepts/tokens/decentralized-exchange/permissioned-domains) before depositing.

If you wish to deposit in a different vault, you can replace the relevant values with your own.
{% /admonition %}

### 3. Check initial vault state

Use the [vault_info](../reference/api/vault-info.md) API method to retrieve the vault's current state, including its total value and available liquidity.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/deposit.js" language="js" from="// Get initial vault" before="// Check depositor's asset balance" /%}
{% /tab %}
{% /tabs %}

### 4. Check depositor's asset balance

Before depositing, verify that the depositor has sufficient balance of the vault's asset. If the depositor doesn't have enough funds, the transaction will fail with a `tecINSUFFICIENT_FUNDS` error.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/deposit.js" language="js" from="// Check depositor's asset balance" before="// Prepare VaultDeposit" /%}
{% /tab %}
{% /tabs %}

### 5. Deposit assets into the vault

Create a `VaultDeposit` transaction object to deposit assets into the vault. The transaction requires:

| Field               | Value  |
|:------------------- |:------ |
| `TransactionType`   | The transaction type. In this case `VaultDeposit`. |
| `Account`           | The wallet address of the depositing account. This account must hold sufficient balance of the vault's asset. |
| `VaultID`           | The unique identifier of the vault. |
| `Amount`            | The asset amount to deposit into the vault. The asset must match the vault's asset, otherwise the transaction will fail with a `tecWRONG_ASSET` error. |

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/deposit.js" language="js" from="// Prepare VaultDeposit" before="// Submit VaultDeposit" /%}
{% /tab %}
{% /tabs %}

Then, submit the transaction and wait for it to be validated on the ledger:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/deposit.js" language="js" from="// Submit VaultDeposit" before="// Extract vault state" /%}
{% /tab %}
{% /tabs %}

When depositing into a private vault, the transaction verifies that the depositor has valid credentials in the vault's permissioned domain. Without valid credentials, the `VaultDeposit` transaction fails with a `tecNO_AUTH` error.

If the transaction succeeds, the vault:

- Transfers the assets from the depositing account to the vault's pseudo-account.
- Issues vault shares to the depositor.

{% admonition type="info" name="Note" %}
Transfer fees are not charged on `VaultDeposit` transactions.
{% /admonition %}

### 6. Verify deposit and check share balance

After depositing, verify the vault's updated state. You can extract this information directly from the transaction metadata without making additional API calls:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/deposit.js" language="js" from="// Extract vault state" before="// Get the depositor's" /%}
{% /tab %}
{% /tabs %}

Finally, check that the depositing account has received the shares.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/deposit.js" language="js" from="// Get the depositor's" /%}
{% /tab %}
{% /tabs %}

The code checks for both `ModifiedNode` and `CreatedNode` because on the first deposit, a new MPToken entry is created for the depositor's shares (`CreatedNode`). On subsequent deposits, the depositor's existing share balance is updated (`ModifiedNode`).

## See Also

**Concepts**:
  - [Single Asset Vault](../concepts/single-asset-vault.md)
  - [Credentials](https://xrpl.org/docs/concepts/decentralized-storage/credentials)
  - [Permissioned Domains](https://xrpl.org/docs/concepts/tokens/decentralized-exchange/permissioned-domains)

**Tutorials**:
  - [Create a Single Asset Vault](./create-a-single-asset-vault.md)
  - [Withdraw from a Vault](./withdraw-from-a-vault.md)

**References**:
  - [VaultDeposit transaction](../reference/transactions/vaultdeposit.md)
  - [vault_info method](../reference/api/vault-info.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
