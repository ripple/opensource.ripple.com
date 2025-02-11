# Vault

{% partial file="/docs/_snippets/_single-asset-vault-disclaimer.md" /%}

A `Vault` object defines the state of a tokenized vault. It contains key details such as available assets, shares, total value, and other relevant information.

`Vault` objects are stored in the ledger and tracked in an Owner Directory owned by the account submitting the `VaultSet` transaction.

Because a `Vault` object cannot hold assets directly, a pseudo-account holds assets on its behalf. This stand-alone account cannot receive funds or send transactions and exists solely to store assets. 

To facilitate `Vault` object lookup from the vault shares, the object is also tracked in the Owner Directory of the `pseudo-account`.

A `Vault` object costs one reserve fee per object created:

- The `Vault` object itself.
- The `MPTokenIssuance` associated with the shares of the Vault.

## Example Vault JSON

```json
{
  "LedgerEntryType": "Vault",
  "LedgerIndex": "E123F4567890ABCDE123F4567890ABCDEF1234567890ABCDEF1234567890ABCD",
  "Flags": "0",
  "PreviousTxnID": "9A8765B4321CDE987654321CDE987654321CDE987654321CDE987654321CDE98",
  "PreviousTxnLgrSeq": 12345678,
  "Sequence": 1,
  "OwnerNode": 2,
  "Owner": "rEXAMPLE9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Account": "rPseudoAcc1234567890abcdef1234567890abcdef",
  "Data": "5468697320697320617262697472617279206D657461646174612061626F757420746865207661756C742E",
  "Asset": {
    "currency": "USD",
    "issuer": "rIssuer1234567890abcdef1234567890abcdef",
    "value": "1000"
  },
  "AssetTotal": 1000000,
  "AssetAvailable": 800000,
  "LossUnrealized": 200000,
  "AssetMaximum": 0,
  "Share": {
    "TokenID": "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
    "Issuer": "rShareIssuer1234567890abcdef1234567890abcdef"
  },
  "ShareTotal": 5000,
  "WithdrawalPolicy": "0x0001"
}
```

## Vault Fields

The `Vault` object contains the followings fields:

| Name                | JSON Type     | Internal Type | Required? | Description                                                                                       |
| :------------------ | :------------ | :------------ | :-------- | ------------------------------------------------------------------------------------------------- |
| `LedgerEntryType`   | String        | UInt16        | Yes       | Ledger object type. The default value is `0x0081`.                                                |
| `LedgerIndex`       | String        | UInt16        | Yes       | The unique identifier of the ledger object.                                                       |
| `Flags`             | String        | UInt32        | Yes       | The ledger object flags. The default value is `0`.                                                |
| `PreviousTxnID`     | String        | Hash256       | Yes       | Identifies the transaction ID that most recently modified this object.                            |
| `PreviousTxnLgrSeq` | Number        | UInt32        | Yes       | The sequence of the ledger that contains the transaction that most recently modified this object. |
| `Sequence`          | Number        | UInt32        | Yes       | The transaction sequence number that created the vault.                                           |
| `Owner`             | String        | AccountID     | Yes       | The account address of the Vault Owner.                                                           |
| `Account`           | String        | AccountID     | Yes       | The address of the Vault's pseudo-account.                                                        |
| `Data`              | String        | Blob          | No        | Arbitrary metadata about the Vault. Limited to 256 bytes.                                         |
| `Asset`             | String/Object | Issue         | Yes       | The asset of the vault. The vault supports XRP, IOU, and MPT.                                     |
| `AssetTotal`        | Number        | Number        | Yes       | The total value of the vault. The default value is `0`.                                           |
| `AssetAvailable`    | Number        | Number        | Yes       | The total value of the vault. The default value is `0`.                                           |
| `AssetAvailable`    | Number        | Number        | Yes       | The asset amount that is available in the vault. The default value is `0`.                        |
| `LossUnrealized`    | Number        | Number        | Yes       | The potential loss amount that is not yet realized, expressed as the vault's asset. The default value is `0`. |
| `AssetMaximum`      | Number        | Number        | No        | The maximum asset amount that can be held in the vault. Zero value 0 indicates there is no cap. The default is `0`. |
| `Share`             | Object        | MPT           | Yes       | The identifier of the share `MPTokenIssuance` object. The default value is `0`.                                             |
| `WithdrawalPolicy`  | String        | UInt8         | Yes       | Indicates the withdrawal strategy used by the vault.                                              |

<!-- Issue - https://xrpl.org/docs/references/protocol/binary-format#issue-fields -->
<!-- AccountID - https://xrpl.org/docs/references/protocol/binary-format/#accountid-fields -->
<!-- MPTokenIssuance - https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens#multi-purpose-tokens -->

## Vault Flags

The `Vault` object supports the following flags:

| Flag Name         | Flag Value | Description                                  |
| :---------------- | :--------- | :------------------------------------------- |
| `lsfVaultPrivate` | `0x0001`   | If set, indicates that the vault is private. |

## Vault ID Format

The key of the `Vault` object is the [`SHA512-Half`](https://xrpl.org/docs/references/protocol/data-types/basic-data-types#hashes) of the following values concatenated in order:

- The `Vault` space key `0x0056` (capital V).
- The [AccountID](https://xrpl.org/docs/references/protocol/binary-format/#accountid-fields) of the account submitting the `VaultSet` transaction (i.e., `VaultOwner`).
- The transaction `Sequence` number. If the transaction used a [Ticket](https://xrpl.org/docs/concepts/accounts/tickets), use the `TicketSequence` value.
