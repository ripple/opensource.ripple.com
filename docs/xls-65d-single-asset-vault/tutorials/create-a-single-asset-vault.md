---
seo:
    description: Create a single asset vault on the XRP Ledger.
metadata:
  indexPage: true
labels:
  - Single Asset Vault
---

# Create a Single Asset Vault

This tutorial shows you how to create a [single asset vault](../concepts/single-asset-vault.md) on the XRP Ledger. Vaults can only hold a single type of asset, such as XRP, a trust line token, or a Multi-Purpose Token (MPT).

You can create either a:

- **Public vault**: Anyone can deposit assets.
- **Private vault**: Only users with valid [Credentials](https://xrpl.org/docs/concepts/decentralized-storage/credentials) can deposit, managed through [Permissioned Domains](https://xrpl.org/docs/concepts/tokens/decentralized-exchange/permissioned-domains).

The tutorial demonstrates how a financial institution could use a **private vault** to pool lender assets for uncollateralized lending while maintaining regulatory compliance through credential-based access control.

_(Requires the [Single Asset Vault amendment][] {% not-enabled /%})_

## Goals

By the end of this tutorial, you will be able to:

- Create a **private** vault.
- Configure vault parameters such as the asset type, maximum deposit amount, and withdrawal policy.
- Configure whether depositors can transfer their vault shares to other accounts.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
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
{% code-snippet file="/_code-samples/vaults/js/createVault.js" language="js" before="// Create and fund" /%}
{% /tab %}
{% /tabs %}

Next, fund a vault owner account, define the MPT issuance ID for the vault's asset, and provide a permissioned domain ID to control who can deposit into the vault.

{% admonition type="info" name="Note" %}
The vault owner must have enough XRP to meet reserve requirements.
{% /admonition %}

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/createVault.js" language="js" from="// Create and fund" before="// Prepare VaultCreate" /%}
{% /tab %}
{% /tabs %}

The example uses an existing MPT issuance and permissioned domain, but you can also provide your own values. If you want to create a public vault, you don't need to provide the `domainId`.

### 3. Prepare VaultCreate transaction

Create the `VaultCreate` transaction object, and specify the following parameters:

| Field               | Value  |
|:------------------- |:------ |
| `TransactionType`   | The transaction type, in this case `VaultCreate`. |
| `Account`           | The wallet address of the _vault owner_. This will be the only account allowed to update or delete the vault. |
| `Asset`             | The asset type to be held in the vault. This can be XRP, a trust line token, or an MPT. For this example, the asset is an **MPT**. |
| `Flags`             | The flags to enable for the transaction: <ul><li>`tfVaultPrivate`: Create a private vault that requires credentials for deposits. **Omit for public vaults.**</li></ul> See [VaultCreate Flags](../reference/transactions/vaultcreate.md#vaultcreate-flags) for all available flags.|
| `DomainID`          | The ID of the permissioned domain that specifies which credentials are accepted. **Omit for public vaults.** |
| `Data`              | Arbitrary metadata about the vault. Set to the hex-encoded string "Vault metadata". |
| `AssetsMaximum`     | The maximum amount of the asset that the vault can hold. Set to `0` to indicate there is no cap. Use a specific value to limit vault size (for example, for risk management or regulatory compliance). |
| `MPTokenMetadata`   | The hex-encoded metadata for the vault shares. This defines how the shares appear in wallets and explorers (ticker, name, description, icon, etc.). |
| `WithdrawalPolicy`  | Indicates the withdrawal strategy used by the vault. Set to `vaultStrategyFirstComeFirstServe`, the only strategy currently supported, which lets a depositor redeem any amount of assets, provided they hold a sufficient number of shares. |

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/createVault.js" language="js" from="// Prepare VaultCreate" before="// Submit, sign" /%}
{% /tab %}
{% /tabs %}

Vault shares are **transferable** by default, meaning depositors can transfer their shares to other accounts. If you don't want the vault's shares to be transferable, enable the `tfVaultShareNonTransferable` flag.

### 4. Submit VaultCreate transaction

Sign and submit the `VaultCreate` transaction to the XRP Ledger.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/createVault.js" language="js" from="// Submit, sign" before="// Extract vault information" /%}
{% /tab %}
{% /tabs %}

Verify that the transaction succeeded by checking for a `tesSUCCESS` result code.

### 5. Get vault information

Retrieve the vault's information from the transaction result by checking for the `Vault` object in the transaction metadata.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/createVault.js" language="js" from="// Extract vault information" before="// Call vault_info" /%}
{% /tab %}
{% /tabs %}

You can also use the [vault_info](../reference/api/vault-info.md) method to retrieve the vault's details:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/createVault.js" language="js" from="// Call vault_info" /%}
{% /tab %}
{% /tabs %}

This confirms that you have successfully created an empty single asset vault.

## See Also

**Concepts**:
  - [Single Asset Vault](../concepts/single-asset-vault.md)
  - [Credentials](https://xrpl.org/docs/concepts/decentralized-storage/credentials)
  - [Permissioned Domains](https://xrpl.org/docs/concepts/tokens/decentralized-exchange/permissioned-domains)

**Tutorials**:
  - [Issue Credentials](https://xrpl.org/docs/tutorials/javascript/build-apps/credential-issuing-service/)
  - [Create Permissioned Domain](https://xrpl.org/docs/tutorials/javascript/compliance/create-permissioned-domains/)
  - [Deposit Assets into a Vault](../tutorials/deposit-into-a-vault.md)

**References**:
  - [VaultCreate transaction](../reference/transactions/vaultcreate.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
