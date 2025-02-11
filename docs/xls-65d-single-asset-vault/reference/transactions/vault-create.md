---
html: vault-create.html
parent: transaction-types.html
seo:
    description:  Creates a new vault in the ledger.
labels:
  - Single Asset Vault
---

# VaultCreate

A VaultCreate transaction creates a `Vault` and an `MPTokenIssuance` ledger object for the vault shares.
The transaction also creates a new `AccountRoot` object for the vault's [pseudo-account](https://github.com/XRPLF/XRPL-Standards/discussions/191), and sets the `PseudoOwner` field to the [VaultID](../vault.md#vault-id-format).

{% admonition type="info" name="Note" %}
Since the transaction creates an `AccountRoot` object for the vault's `pseudo-account`, it must destroy one [incremental owner reserve](https://xrpl.org/docs/concepts/accounts/reserves#base-reserve-and-owner-reserve) amount. This is required because on the XRP Ledger each ledger object owned by an account increases its reserve requirement.
{% /admonition %}

## Vault Fields

In addition to the [common fields](https://xrpl.org/docs/references/protocol/transactions/common-fields#transaction-common-fields), `VaultCreate` transactions use the following fields:

| Name                                    | JSON Type     | Internal Type | Required? | Description                                                                                         |
| :-------------------------------------- | :------------ | :------------ | :-------- | --------------------------------------------------------------------------------------------------- |
| `TransactionType`                       | String        | UInt16        | Yes       | The ledger transaction type. Valid types include: `VaultCreate`, `VaultSet`, `Payment`, and more.   |
| `Flags`                                 | Number        | UInt32        | Yes       | Specifies the flags for the vault.                                                                  |
| `Data`                                  | String        | Blob          | No        | Arbitrary vault metadata, limited to 256 bytes.                                                     |
| `Asset`                                 | String/Object | Issue         | Yes       | The asset (XRP, IOU or MPT) of the vault.                                                           |
| `AssetMaximum`                          | Number        | UInt64        | No        | The maximum asset amount that can be held in a vault.                                               |
| `MPTokenMetadata`                       | String        | Blob          | No        | Arbitrary metadata about the share MPT, in hex format, limited to 1024 bytes.                       |
| [`WithdrawalPolicy`](#withdrawalpolicy) | Number        | UInt8         | No        | Indicates the withdrawal strategy used by the vault. The default value is `strFirstComeFirstServe`. |
| `DomainID`                              | String        | Hash256       | No        | The [PermissionedDomain](https://github.com/XRPLF/XRPL-Standards/blob/master/XLS-0080-permissioned-domains/) object ID associated with the shares of this vault. The `DomainID` is only required when creating a private vault. |

If a `DomainID` is provided, the transaction stores it in the `MPTokenIssuance` object, linking the vault’s shares to the associated `PermissionedDomain` object.

Depending on the vault’s asset type, the transaction performs the following actions:

- **IOU**: The transaction creates a `RippleState` object between the `pseudo-account` and the Issuer `AccountRoot`.
- **MPT**: The transaction creates an `MPToken` object for the `pseudo-account`.

## Vault Flags

The `VaultCreate` transaction supports the following flags:

| Flag Name                     | Value    | Description                                                                                         |
| :---------------------------- | :------- | --------------------------------------------------------------------------------------------------- |
| `tfVaultPrivate`              | `0x0001` | Indicates that the vault is private. This flag can only be set when _creating_ the vault.           |
| `tfVaultShareNonTransferable` | `0x0002` | Indicates the vault share is non-transferable. This flag can only be set when _creating_ the vault. |

## WithdrawalPolicy

A `WithdrawalPolicy` defines the strategy used for processing withdrawal requests. The following values are supported:

| Name                     | Value    | Description                                                                                                          |
| :----------------------- | :------- | -------------------------------------------------------------------------------------------------------------------- |
| `strFirstComeFirstServe` | `0x0001` | Requests are processed on a first-come-first-serve basis. With this option, a depositor can redeem any amount of assets provided they have a sufficient number of shares. |

## Error Cases

Besides errors that can occur for all transactions, VaultCreate transactions can result in the following [transaction result codes](https://xrpl.org/docs/references/protocol/transactions/transaction-results):

| Error Code                | Description                                                                                                                                                                                                         |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tecLOCKED`               | Occurs if the asset is an MPT and the `lsfMPTCanTransfer` flag is not set in the `MPTokenIssuance` object, meaning the vault cannot be                                         created with a non-transferable MPT. |
| `tecLOCKED`               | Occurs if the asset is an MPT and the `lsfMPTLocked` flag is not set in the `MPTokenIssuance` object, meaning the asset is locked.                                                                                  |
| `tecFROZEN`               | Occurs if the asset is an IOU and the `lsfGlobalFreeze` flag is set on the `VaultOwner`. This means a vault cannot be created for a frozen asset.                                                                   |
| `temMALFORMED`            | Occurs when the `tfVaultPrivate` flag is not set, and a `DomainID` is provided, meaning the `VaultOwner` is attempting to create a public vault with a `PermissionedDomain`.                                        |
| `tecNO_ENTRY`             | Occurs if the `PermissionedDomain` object with the provided `DomainID` does not exist.                                                                                                                              |
| `temMALFORMED`            | Occurs if the `Data` field is larger than 256 bytes.                                                                                                                                                                |
| `tecINSUFFICIENT_RESERVE` | Occurs when there is insufficient `AccountRoot.Balance` for the Owner Reserve.                                                                                                                                      |
