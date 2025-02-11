---
html: vault-set.html
parent: transaction-types.html
seo:
    description:  Update an existing vault in the ledger.
labels:
  - Single Asset Vault
---

# VaultSet

The `VaultSet` transaction updates any mutable field in an existing `Vault` ledger object.

## Vault Fields

In addition to the [common fields](https://xrpl.org/docs/references/protocol/transactions/common-fields#transaction-common-fields), `VaultSet` transactions use the following fields:

| Name              | JSON Type | Internal Type | Required? | Description                                                                                                                                                                                                                     |
| :---------------- | :-------- | :------------ | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `TransactionType` | String    | UInt16        | Yes       | The ledger transaction type. Valid types include: `VaultCreate`, `VaultSet`, `Payment`, and more.                                                                                                                               |
| `VaultID`         | String    | Hash256       | Yes       | The ID of the vault that needs to be updated.                                                                                                                                                                                   |
| `Data`            | String    | Blob          | No        | Arbitrary vault metadata, limited to 256 bytes.                                                                                                                                                                                 |
| `AssetMaximum`    | Number    | UInt64        | No        | The maximum asset amount that can be held in a vault. The value cannot be lower than the current `AssetTotal` unless the value is 0.                                                                                            |
| `DomainID`        | String    | Hash256       | No        | The [PermissionedDomain](https://github.com/XRPLF/XRPL-Standards/blob/master/XLS-0080-permissioned-domains/) object ID associated with the shares of this vault. The `DomainID` is only required when creating a private vault. |

If a `DomainID` is provided, the transaction stores it in the `MPTokenIssuance` object, linking the vault’s shares to the associated `PermissionedDomain` object.

## Error Cases

Besides errors that can occur for all transactions, VaultCreate transactions can result in the following [transaction result codes](https://xrpl.org/docs/references/protocol/transactions/transaction-results):

| Error Code            | Description                                                                                                                                                                           |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tecOBJECT_NOT_FOUND` | Occurs if the `Vault` object with the specified `VaultID` does not exist on the ledger.                                                                                               |
| `tecNO_PERMISSION`    | Occurs if the account submitting the transaction is not the `Owner` of the vault.                                                                                                     |
| `temMALFORMED`        | Occurs if the `Data` field is larger than 256 bytes.                                                                                                                                  |
| `tecLIMIT_EXCEEDED`   | Occurs if both `Vault.AssetMaximum` and the transaction's `AssetMaximum` are greater than 0, and the _new_ `AssetMaximum` value is **lower** than the vault's _current_ `AssetTotal`. |
| `tecINVALID_DOMAIN`   | Occurs when the `tfVaultPrivate` flag is not set, and a `DomainID` is provided, meaning the `VaultOwner` is attempting to create a public vault with a `PermissionedDomain`.          |
| `tecNO_ENTRY`         | Occurs if the `PermissionedDomain` object with the provided `DomainID` does not exist.                                                                                                |
| `te`                  | Occurs if the transaction is attempting to modify an immutable field.                                                                                                                 |
| ``                    | Occurs if the transaction does not specify any of the modifiable fields.                                                                                                              |
