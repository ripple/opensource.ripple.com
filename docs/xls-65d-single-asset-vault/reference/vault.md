---
seo:
    description: A Vault object defines the state of a tokenized vault.
labels:
  - Vault
  - Single Asset Vault
---

# Vault

[[Source]](https://github.com/Bronek/rippled/blob/vault/include/xrpl/protocol/detail/ledger_entries.macro#L465-L486 "Source")

A {% code-page-name /%} object defines the state of a tokenized vault. It contains key details such as available assets, shares, total value, and other relevant information. You can create a {% code-page-name /%} object with the [VaultCreate](./transactions/vaultcreate.md)  transaction.

The {% code-page-name /%} object is tracked in an [Owner Directory](https://xrpl.org/directorynode.html) owned by the Vault Owner account.
Additionally, to facilitate `Vault` object lookup, the object is tracked in the owner directory of the vault's [pseudo-account](../concepts/pseudo-account.md).

_(Requires the [Single Asset Vault amendment][] {% not-enabled /%})_

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
  },
  "AssetsTotal": 1000000,
  "AssetsAvailable": 800000,
  "LossUnrealized": 200000,
  "AssetsMaximum": 0,
  "WithdrawalPolicy": "1"
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common ledger entry fields](https://xrpl.org/docs/references/protocol/ledger-data/common-fields), {% code-page-name /%} entries have the following fields:

| Name                | JSON Type     | Internal Type | Required? | Description      |
| :------------------ | :------------ | :------------ | :-------- | -----------------|
| `LedgerEntryType`   | String        | UInt16        | Yes       | Ledger object type. The default value is `0x0081`. |
| `LedgerIndex`       | String        | UInt16        | Yes       | The unique identifier of the ledger object. |
| `Flags`             | String        | UInt32        | Yes       | Set of bit-flags for this ledger object. |
| `PreviousTxnID`     | String        | Hash256       | Yes       | Identifies the transaction ID that most recently modified this object. |
| `PreviousTxnLgrSeq` | Number        | UInt32        | Yes       | The sequence of the ledger that contains the transaction that most recently modified this object. |
| `Sequence`          | Number        | UInt32        | Yes       | The transaction sequence number that created the vault. |
| `OwnerNode`         | Number        | UInt64        | Yes       | Identifies the page where this item is referenced in the owner's directory. |
| `Owner`             | String        | AccountID     | Yes       | The account address of the Vault Owner. |
| `Account`           | String        | AccountID     | Yes       | The address of the vault's pseudo-account. |
| `Data`              | String        | Blob          | No        | Arbitrary metadata about the vault. Limited to 256 bytes. |
| `Asset`             | Object        | Issue         | Yes       | The asset of the vault. The vault supports XRP, trust line tokens, and MPTs. |
| `AssetsTotal`       | Number        | Number        | Yes       | The total value of the vault. |
| `AssetsAvailable`   | Number        | Number        | Yes       | The asset amount that is available in the vault. |
| `AssetsMaximum`     | Number        | Number        | No        | The maximum asset amount that can be held in the vault. If set to 0, this indicates there is no cap. |
| `LossUnrealized`    | Number        | Number        | Yes       | The potential loss amount that is not yet realized, expressed as the vault's asset. Only a protocol connected to the vault can modify this attribute. |
| `MPTokenIssuanceID` | String        | UInt192       | Yes       | The identifier of the share `MPTokenIssuance` object. |
| `WithdrawalPolicy`  | String        | UInt8         | Yes       | Indicates the withdrawal strategy used by the vault. |
| `Scale`             | Number        | UInt8         | No        | Specifies decimal precision for share calculations. Assets are multiplied by 10<sup>Scale</sup > to convert fractional amounts into whole number shares. For example, with a `Scale` of `6`, depositing 20.3 units creates 20,300,000 shares (20.3 × 10<sup>Scale</sup >). For **trust line tokens** this can be configured at vault creation, and valid values are between 0-18, with the default being `6`. For **XRP** and **MPTs**, this is fixed at `0`. |

### Scaling Factor

The **`Scale`** field enables the vault to accurately represent fractional asset values using integer-only MPT shares, which prevents the loss of value from decimal truncation. It defines a scaling factor, calculated as 10<sup>Scale</sup>, that converts a decimal asset amount into a corresponding whole number of shares.

The scaling factor behavior varies by asset type:

- **Trust line token**: When a vault holds a trust line token, the `Scale` is configurable by the Vault Owner when creating the vault. The value can range from **0** to a maximum of **18**, with a default of **6**. This flexibility allows issuers to set a level of precision appropriate for their specific token.

- **XRP**: When a vault holds XRP, the `Scale` is fixed at **0**. This aligns with XRP's native structure, where one share represents one drop, and one XRP equals 1,000,000 drops. Therefore, a deposit of 10 XRP to an empty vault will result in the issuance of 10,000,000 shares.

- **MPT**: When a vault holds an MPT, its `Scale` is fixed at **0**. This creates a 1-to-1 relationship between deposited MPT units and the shares issued. For example, depositing 10 MPTs to an empty vault issues 10 shares. The value of a single MPT is determined at the issuer's discretion.
  
  {% admonition type="warning" name="Warning" %}
  If an MPT is set to represent a large value, the vault owner and the depositor must be cautious. Since only whole MPT units are used in calculations, any value that is not a multiple of a single MPT's value may be lost due to rounding during a transaction.
  {% /admonition %}

## {% $frontmatter.seo.title %} Flags

{% code-page-name /%}  entries can have the following flags:

| Flag Name         | Flag Value   | Description                 |
| :---------------- | :----------- | :---------------------------|
| `lsfVaultPrivate` | `0x00010000` | If set, indicates that the vault is private. This flag can only be set when _creating_ the vault. |

## Vault ID Format

The ID of a {% code-page-name /%} entry is the [`SHA512-Half`](https://xrpl.org/docs/references/protocol/data-types/basic-data-types#hashes) of the following values, concatenated in order:

- The {% code-page-name /%} space key `0x0056` (capital V).
- The [AccountID](https://xrpl.org/docs/references/protocol/binary-format/#accountid-fields) of the account submitting the transaction (for example, the vault owner) .
- The transaction `Sequence` number. If the transaction used a [Ticket](https://xrpl.org/docs/concepts/accounts/tickets), use the `TicketSequence` value.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
