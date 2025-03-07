---
seo:
    description: Redeem vault shares for assets.
labels:
  - Transactions
  - Single Asset Vault
---

# VaultWithdraw

[[Source]](https://github.com/Bronek/rippled/blob/vault/src/xrpld/app/tx/detail/VaultWithdraw.cpp "Source")

Redeem vault shares for assets. The number of shares burned or assets received depends on the [exchange rate](../../concepts/single-asset-vault.md#exchange-algorithm), which adjusts based on the vault’s total assets and any [unrealized losses](../../concepts/single-asset-vault.md#paper-loss-unrealized-loss).

{% admonition type="info" name="Note" %}
The `VaultWithdraw` transaction does not respect the Permissioned Domain rules. In other words, any account that holds the shares of the vault can redeem them. This is to avoid a situation where a depositor deposits assets to a private vault to then have their access revoked by invalidating their credentials, and thus losing access to their funds.
{% /admonition %}

_(Requires the [Single Asset Vault amendment][] {% not-enabled /%})_

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "VaultWithdraw",
  "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "VaultID": "77D6234D074E505024D39C04C3F262997B773719AB29ACFA83119E4210328776",
  "Amount" : "10000",
  "Destination": "ruazs5h1qEsqpke88pcqnaseXdm6od2xc"
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](https://xrpl.org/docs/references/protocol/transactions/common-fields#transaction-common-fields), {% code-page-name /%} transactions use the following fields:

| Field Name              | JSON Type     | Internal Type | Required? | Description         |
| :-----------------------| :------------ | :------------ | :-------- | :-------------------|
| `VaultID`               | String        | Hash256       | Yes       | The unique identifier of the vault to which the assets are deposited. |
| `Amount`                | Number        | STAmount      | Yes       | The exact amount of vault asset to withdraw or vault share to redeem. |
| `Destination`           | String        | AccountID     | No        | An account to receive the assets. This account must be able to receive the vault asset or the transaction fails.                   |

There are two ways to specify the transaction `Amount` field:

| Specify Assets | Specify Shares |
|:-------------- |:---------------|
|<ul><li>If the `Amount` field specifies an **asset amount** (e.g., 100 XRP), the transaction burns the necessary number of shares to provide the requested amount.</li><li>If the vault has an **unrealized loss**, withdrawing the same amount of assets requires burning more shares.</li></ul> | <ul><li>If the `Amount` field specifies a **share amount** (e.g., 500 vault shares), the transaction converts those shares into the corresponding amount of assets.</li><li>If the vault has an **unrealized loss**, each share is worth less, meaning fewer assets are received.</li></ul> |

## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} transactions.

## Transfer Fees

A single asset vault does not apply the [transfer fee](https://xrpl.org/docs/concepts/tokens/transfer-fees) to {% code-page-name /%} transactions. Additionally, whenever a protocol moves assets from or to a vault, the Transfer Fee must not be charged.

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes](https://xrpl.org/docs/references/protocol/transactions/transaction-results):

| Error Code              | Description                        |
| :---------------------- | :----------------------------------|
| `tecOBJECT_NOT_FOUND`   | Occurs if the `Vault` object with the provided `VaultID` does not exist on the ledger. |
| `tecFROZEN`             | Occurs if the asset is a Fungible Token and the `lsfGlobalFreeze` flag is set on the issuing account, meaning the asset is frozen. |
| `tecFROZEN`             | Occurs if the asset is a Fungible Token and the `lsfHighFreeze` or `lsfLowFreeze` flag is set on the trust line between the asset issuer and `AccountRoot` of the `AccountID` or `Destination`. |
| `tecWRONG_ASSET`        | Occurs if the unit of `Amount` is not a share of the vault. |
| `tecWRONG_ASSET`        | Occurs if the unit of `Amount` is not the asset of the vault. |
| `tecINSUFFICIENT_FUNDS` | Occurs if there is insufficient liquidity in the vault to fill the request. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
