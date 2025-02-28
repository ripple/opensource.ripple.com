---
seo:
    description: Creates a new vault object in the ledger.
labels:
  - Transactions
  - Single Asset Vault
---

# VaultCreate

[[Source]](https://github.com/XRPLF/rippled/blob/9d619b9dc579c592f0560c1b40fd3c98d7587d23/src/xrpld/app/tx/detail/VaultCreate.cpp "Source")

Creates a new `Vault` ledger entry, an `MPTokenIssuance` ledger entry for the vault’s shares, and an `AccountRoot` for the vault’s [pseudo-account](https://github.com/XRPLF/XRPL-Standards/discussions/191).

Only the Vault Owner can initiate this transaction.

{% admonition type="info" name="Note" %}
Currently, the same account that creates the vault must also create other protocols, though this may change in the future.
{% /admonition %}

_(Requires the [Single Asset Vault amendment][] {% not-enabled /%})_

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "VaultCreate",
  "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "Data": "5468697320697320617262697472617279206D657461646174612061626F757420746865207661756C742E",
  "Asset": {
    "currency": "USD",
    "issuer": "rIssuer1234567890abcdef1234567890abcdef",
    "value": "1000"
  },
  "AssetMaximum": 0,
  "MPTokenMetadata": "5468697320697320617262697472617279206d657461646174612061626f757420746865204d50542073686172652e",
  "WithdrawalPolicy": "0x0001",
  "DomainID": "77D6234D074E505024D39C04C3F262997B773719AB29ACFA83119E4210328776"
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](https://xrpl.org/docs/references/protocol/transactions/common-fields#transaction-common-fields), {% code-page-name /%} transactions use the following fields:

| Field Name         | JSON Type     | [Internal Type][] | Required? |Description        |
|:-------------------|:--------------|:------------------|:----------|:------------------|
| `Data`             | String        | Blob              | No        | Arbitrary vault metadata, in hex format, limited to 256 bytes. |
| `Asset`            | String/Object | Issue             | Yes       | The asset to be held in the vault. This can be XRP, a Fungible Token, or an MPT. If the asset is a Fungible Token, the transaction creates a [trust line](https://xrpl.org/docs/concepts/tokens/fungible-tokens#trust-lines) between the vault's `pseudo-account` and the issuer of the asset. If the asset is an MPT, the transaction creates an `MPToken` object for the vault's `pseudo-account`.  |
| `AssetMaximum`     | Number        | UInt64            | No        | The maximum asset amount that can be held in a vault. |
| `MPTokenMetadata`  | String        | Blob              | No        | Arbitrary metadata about the share `MPToken`, in hex format, limited to 1024 bytes. Use this field if the vault's asset is an MPT. |
| `WithdrawalPolicy` | Number        | UInt8             | No        | Indicates the withdrawal strategy used by the vault. The default value is `0x0001`, mapped to the string `strFirstComeFirstServe`. See [WithdrawalPolicy](#withdrawalpolicy). |
| `DomainID`         | String        | Hash256           | No        | The [PermissionedDomain](https://github.com/XRPLF/XRPL-Standards/blob/master/XLS-0080-permissioned-domains/) object ID associated with the shares of this vault. If provided, the transaction creates a private vault, which restricts access to accounts with [credentials](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0070-credentials) in the specified Permissioned Domain. |

## {% $frontmatter.seo.title %} Flags

{% code-page-name /%} transactions support additional values in the `Flags` field, as follows:

| Flag Name                     | Value        | Description              |
| :---------------------------- | :------------| -------------------------|
| `tfVaultPrivate`              | `0x00010000` | Indicates that the vault is private. This flag can only be set when _creating_ the vault. |
| `tfVaultShareNonTransferable` | `0x00020000` | Indicates the vault share is non-transferable. This flag can only be set when _creating_ the vault. |

## WithdrawalPolicy

A `WithdrawalPolicy` defines the strategy for processing withdrawal requests from a vault. This policy governs how liquidity is removed. Currently, only one strategy is supported:

| Policy Name              | Value    | Description              |
| :----------------------- | :------- | -------------------------|
| `strFirstComeFirstServe` | `0x0001` | Requests are processed on a first-come, first-served basis. With this strategy, a depositor can redeem any amount of assets, provided they hold a sufficient number of shares. |

## Transaction Cost

Since the {% code-page-name /%} transaction creates a new `AccountRoot` object for a vault’s `pseudo-account`, it incurs a higher than usual [transaction cost](https://xrpl.org/docs/concepts/transactions/transaction-cost) to deter ledger spam. Instead of the standard minimum of 0.00001 XRP, {% code-page-name /%} must destroy an [incremental owner reserve](https://xrpl.org/docs/concepts/accounts/reserves#base-reserve-and-owner-reserve), currently 0.2 XRP.

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes](https://xrpl.org/docs/references/protocol/transactions/transaction-results):

| Error Code                | Description                        |
| :------------------------ | :----------------------------------|
| `tecLOCKED`               | Occurs if the asset is an MPT and the `lsfMPTCanTransfer` flag is not set in the `MPTokenIssuance` object, meaning the vault cannot be created with a non-transferable MPT. |
| `tecLOCKED`               | Occurs if the asset is an MPT and the `lsfMPTLocked` flag is not set in the `MPTokenIssuance` object, meaning the asset is locked. |
| `tecFROZEN`               | Occurs if the asset is a Fungible Token and the `lsfGlobalFreeze` flag is set on the `VaultOwner`. This means a vault cannot be created for a frozen asset. |
| `temMALFORMED`            | Occurs when the `tfVaultPrivate` flag is not set, and a `DomainID` is provided, meaning the `VaultOwner` is attempting to create a public vault with a `PermissionedDomain`. |
| `tecNO_ENTRY`             | Occurs if the `PermissionedDomain` object with the provided `DomainID` does not exist. |
| `temMALFORMED`            | Occurs if the `Data` field is larger than 256 bytes.  |
| `tecINSUFFICIENT_RESERVE` | Occurs when there is insufficient `AccountRoot.Balance` for the Owner Reserve. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
