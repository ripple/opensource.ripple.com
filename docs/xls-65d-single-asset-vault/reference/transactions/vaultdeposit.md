---
seo:
    description: Deposits a specified number of assets into a vault in exchange for shares.
labels:
  - Transactions
  - Single Asset Vault
---

# VaultDeposit

[[Source]](https://github.com/Bronek/rippled/blob/vault/src/xrpld/app/tx/detail/VaultDeposit.cpp "Source")

Deposits a specified number of assets into a vault in exchange for shares.

For private vaults, the depositor must be authorized to interact with the vault’s shares and have [credentials](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0070-credentials) in the [Permissioned Domain](https://github.com/XRPLF/XRPL-Standards/blob/master/XLS-0080-permissioned-domains/) of the share.

Public vaults require no authorization, and anyone can deposit as long as they meet the asset type requirement and have sufficient funds.

{% admonition type="warning" name="Warning" %}
A depositor cannot deposit assets into the vault if:

- The asset is frozen for the depositor.
- The trust line or the `MPToken` between the `pseudo-account` and the issuer of the vault asset is frozen or locked.
- The vault is private and the depositor's credentials have expired.
{% /admonition %}

If successful, the transaction moves the assets from the depositor's account to the vault's `pseudo-account`, issues the corresponding vault shares, and updates the vault’s balance.

_(Requires the [Single Asset Vault amendment][] {% not-enabled /%})_

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "VaultDeposit",
  "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "VaultID": "77D6234D074E505024D39C04C3F262997B773719AB29ACFA83119E4210328776",
  "Amount" : {
    "currency" : "TST",
    "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
    "value" : "2.5"
  }
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](https://xrpl.org/docs/references/protocol/transactions/common-fields#transaction-common-fields), {% code-page-name /%} transactions use the following fields:

| Field Name              | JSON Type     | Internal Type | Required? | Description         |
| :-----------------------| :------------ | :------------ | :-------- | :-------------------|
| `VaultID`               | String        | Hash256       | Yes       | The unique identifier of the vault to which the asset is deposited. |
| `Amount`                | Object        | Amount        | Yes       | The asset and quantity to be deposited into the vault.|

The deposited asset must match the vault’s designated asset for the transaction to succeed. Depending on the asset type, the following changes occur:

- **XRP**: The vault’s `pseudo-account` balance increases, and the depositor’s balance decreases.
- **Fungible Token**: The [trust line](https://xrpl.org/docs/concepts/tokens/fungible-tokens#trust-lines) balance between the vault's `pseudo-account` and the asset issuer is adjusted.
- **MPT**: The `MPToken.MPTAmount` of both the depositor and the vault's `pseudo-account` is updated.

## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} transactions.

## Transfer Fees

A single asset vault does not apply the [transfer fee](https://xrpl.org/docs/concepts/tokens/transfer-fees) to {% code-page-name /%} transactions. Additionally, whenever a protocol moves assets from or to a vault, the transfer fee isn't charged.

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes](https://xrpl.org/docs/references/protocol/transactions/transaction-results):

| Error Code              | Description                        |
| :---------------------- | :----------------------------------|
| `tecNO_ENTRY`           | Occurs if the `Vault` object with the provided `VaultID` does not exist on the ledger. |
| `tecOBJECT_NOT_FOUND`   | Occurs if a ledger entry specified in the transaction does not exist. |
| `tecWRONG_ASSET`        | Occurs if the asset of the vault does not match the asset being deposited. |
| `tecINSUFFICIENT_FUNDS` | Occurs if the depositor does not have sufficient funds to make a deposit. |
| `tecLIMIT_EXCEEDED`     | Occurs if adding the provided `Amount` to the `AssetsTotal` exceeds the `AssetsMaximum` value. |
| `tecNO_AUTH`            | Occurs if either the vault is private and the depositing account does not have credentials in the share's Permissioned Domain, or the asset is a non-transferable MPT. |
| `tecFROZEN`             | Occurs if either the trust line between the issuer and the depositor is frozen, or the asset is globally frozen.  |
| `tecLOCKED`             | Occurs if either the MPT asset is locked for the depositor, or if the asset is globally locked. |
| `temMALFORMED`          | Occurs if the transaction was not validly formatted. For example, if the `VaultID` is not provided.  |
| `temDISABLED`           | Occurs if the Single Asset Vault amendment is not enabled.  |
| `temBAD_AMOUNT`         | Occurs if the `Amount` field of the transaction is invalid. |


{% raw-partial file="/docs/_snippets/common-links.md" /%}
