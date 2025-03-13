---
html: vault-clawback.html
parent: transaction-types.html
seo:
    description: Allows the issuer of a Fungible Token or MPT to claw back funds from the vault. 
labels:
  - Transactions
  - Single Asset Vault
---

# VaultClawback

[[Source]](https://github.com/Bronek/rippled/blob/vault/src/xrpld/app/tx/detail/VaultClawback.cpp "Source")

Performs a [Clawback](https://xrpl.org/docs/use-cases/tokenization/stablecoin-issuer#clawback) from the vault, exchanging the shares of an account for assets.

Under the hood, the transaction performs a [VaultWithdraw](./vault-withdraw.md) on behalf of the account from which assets are clawed back, converting its shares into assets and transferring the funds to the asset’s issuing account. Because of this, {% code-page-name /%} must respect any applicable fees or penalties (e.g., unrealized loss).

{% admonition type="warning" name="Warning" %}
Clawbacks cannot be performed on native XRP.
{% /admonition %}

_(Requires the [Single Asset Vault amendment][] {% not-enabled /%})_

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "VaultClawback",
  "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "VaultID": "77D6234D074E505024D39C04C3F262997B773719AB29ACFA83119E4210328776",
  "Holder": "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
  "Amount" : "10000"
}
```

## {% $frontmatter.seo.title %} Fields

| Field Name | JSON Type | Internal Type | Required? | Description |
| :--------- | :-------- | :------------ | :-------- | :---------- |
| `VaultID`  | String    | Hash256       | Yes       | The unique identifier of the vault from which assets are withdrawn. |
| `Holder`   | String    | AccountID     | Yes       | The unique identifier of the account from which to claw back the assets. |
| `Amount`   | Number    | Number        | No        | The asset amount to claw back. When this field is set to 0, the transaction claws back all funds, up to the total shares the `Holder` owns. |

If the requested amount exceeds the vault’s available assets, the transaction claws back only up to the vault's `AssetAvailable` balance. Otherwise, it retrieves the exact asset amount specified in the transaction.

## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} transactions.

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes](https://xrpl.org/docs/references/protocol/transactions/transaction-results):

| Error Code              | Description |
| :---------------------- | :---------- |
| `tecOBJECT_NOT_FOUND`   | Occurs if the `Vault` object with the specified `VaultID` does not exist on the ledger. |
| `tecNO_PERMISSION`      | Occurs if the transaction attempts to claw back `XRP`. |
| `tecNO_PERMISSION`      | Occurs if the asset is a Fungible Token and the transaction is not submitted by the issuing account. |
| `tecNO_PERMISSION`      | Occurs if the deposited asset does not support clawback. |
| `tecWRONG_ASSET`        | Occurs if the asset in the transaction does not match the vault's asset type. |
| `tecINSUFFICIENT_FUNDS` | Occurs if the `MPToken` object for the vault share of the `Holder` account does not exist, or if `MPToken.MPTAmount` is 0. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
