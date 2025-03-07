---
seo:
    description: Deletes an existing Vault object from the ledger.
labels:
  - Transactions
  - Single Asset Vault
---

# VaultDelete

[[Source]](https://github.com/Bronek/rippled/blob/vault/src/xrpld/app/tx/detail/VaultDelete.cpp "Source")

Permanently deletes an existing `Vault` object from the ledger, removes all associated ledger entries, and returns the owner reserve to the Vault Owner.

Only the Vault Owner can initiate this transaction, and the vault must be completely empty before deletion.

_(Requires the [Single Asset Vault amendment][] {% not-enabled /%})_

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "VaultDelete",
  "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "VaultID": "77D6234D074E505024D39C04C3F262997B773719AB29ACFA83119E4210328776"
}
```

## {% $frontmatter.seo.title %}  Fields

In addition to the [common fields](https://xrpl.org/docs/references/protocol/transactions/common-fields#transaction-common-fields), {% code-page-name /%} transactions use the following fields:

| Field Name         | JSON Type | Internal Type | Required? | Description  |
| :----------------- | :-------- | :------------ | :-------- | :------------|
| `VaultID`          | String    | Hash256       | Yes       | The unique identifier of the vault that needs to be deleted. |

## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} transactions.

## Error Cases

Besides errors that can occur for all transactions, VaultCreate transactions can result in the following [transaction result codes](https://xrpl.org/docs/references/protocol/transactions/transaction-results):

| Error Code                | Description                        |
| :------------------------ | :----------------------------------|
| `tecOBJECT_NOT_FOUND`     | Occurs if the `Vault` object with the provided `VaultID` does not exist on the ledger. |
| `tecNO_PERMISSION`        | Occurs if the account submitting the transaction is not the `Owner` of the vault. |
| `tecHAS_OBLIGATIONS`      | Occurs if the `AssetTotal`, `AssetAvailable`, or the share's `OutstandingAmount` are greater than 0. |
| `tecHAS_OBLIGATIONS`      | Occurs if the `OwnerDirectory` of the vault's `pseudo-account` contains references to any objects other than the vault, shares, or assets. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
