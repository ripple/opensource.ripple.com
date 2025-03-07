---
seo:
    description: Modifies a single asset vault that you own.
labels:
  - Transactions
  - Single Asset Vault
---

# VaultSet

[[Source]](https://github.com/Bronek/rippled/blob/vault/src/xrpld/app/tx/detail/VaultSet.cpp "Source")

Modifies a single asset vault that you own.
This transaction allows the Vault Owner to update certain mutable fields, including vault metadata and the maximum asset amount.

{% admonition type="warning" name="Warning" %}
Once a vault is created, its public or private status is permanent and cannot be changed. The [tfVaultPrivate](../vault.md#vault-flags) flag determines this status, and once set, it cannot be updated.
{% /admonition %}

_(Requires the [Single Asset Vault amendment][] {% not-enabled /%})_

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "VaultSet",
  "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "VaultID": "77D6234D074E505024D39C04C3F262997B773719AB29ACFA83119E4210328776",
  "Data": "5468697320697320617262697472617279206D657461646174612061626F757420746865207661756C742E",
  "AssetMaximum": 5,
  "DomainID": "77D6234D074E505024D39C04C3F262997B773719AB29ACFA83119E4210328776"
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](https://xrpl.org/docs/references/protocol/transactions/common-fields#transaction-common-fields), {% code-page-name /%} transactions use the following fields:

| Field Name        | JSON Type | Internal Type | Required? | Description         |
| :---------------- | :-------- | :------------ | :-------- | :-------------------|
| `VaultID`         | String    | Hash256       | Yes       | The unique identifier of the vault that needs to be updated. |
| `Data`            | String    | Blob          | No        | Arbitrary vault metadata, limited to 256 bytes. |
| `AssetMaximum`    | Number    | UInt64        | No        | The maximum asset amount that can be held in a vault. The value cannot be lower than the current `AssetTotal`, unless the value is 0. |
| `DomainID`        | String    | Hash256       | No        | The [PermissionedDomain](https://github.com/XRPLF/XRPL-Standards/blob/master/XLS-0080-permissioned-domains/) object ID associated with the shares of this vault. The `DomainID` is only required when updating a private vault. |

## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} transactions.

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes](https://xrpl.org/docs/references/protocol/transactions/transaction-results):

| Error Code            | Description                           |
| :-------------------- | :-------------------------------------|
| `tecOBJECT_NOT_FOUND` | Occurs if the `Vault` object with the specified `VaultID` does not exist on the ledger. |
| `tecNO_PERMISSION`    | Occurs if the account submitting the transaction is not the `Owner` of the vault. |
| `temMALFORMED`        | Occurs if the `Data` field is larger than 256 bytes. |
| `tecLIMIT_EXCEEDED`   | Occurs if the _new_ `AssetMaximum` value is **lower** than the vault's _current_ `AssetTotal`. |
| `temDISABLED`         | Occurs if the Permissioned Domains amendment is disabled and a `DomainID` is provided. |
| `tecINVALID_DOMAIN`   | Occurs if a transaction attempts to set `DomainID` on a public vault. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
