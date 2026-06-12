---
seo:
    description: Create MPTs with the option of changing specific fields or flags.
labels:
  - Multi-Purpose Tokens (MPTs), MPT
---
# Dynamic MPT Reference

The Dynamic MPT amendment does not create any new data types, but it modifies several transactions and the `MPTokenIssuance` ledger entry.

- **Transactions:**
    - [MPTokenIssuanceCreate](#mptokenissuancecreate-transaction-changes) - The new `MutableFlags` field specifies which fields or flags are mutable after issuance.
    - [MPTokenIssuanceSet](#mptokenissuanceset-transaction-changes) - Several new fields let you update mutable metadata and transfer fees, and enable MPT issuance flags that were declared mutable.
- **Ledger Entries:**
    - [MPTokenIssuance](#mptokenissuance-entry-changes) - The new `MutableFlags` field stores mutability settings.

_(Requires the [DynamicMPT amendment][] {% not-enabled /%})_

## MPTokenIssuanceCreate Transaction Changes

To allow future changes to specific fields or flags of a token, issuers must clearly specify which ones should be mutable when creating the `MPTokenIssuance` object.

### Example JSON

This example creates an MPT issuance with mutable metadata:

```json
{
  "TransactionType": "MPTokenIssuanceCreate",
  "Account": "rNFta7UKwcoiCpxEYbhH2v92numE3cceB6",
  "AssetScale": 4,
  "TransferFee": 0,
  "MaximumAmount": "50000000",
  "MutableFlags": 65536, // tmfMPTCanMutateMetadata
  "MPTokenMetadata": "464F4F",
  "Fee": "12",
  "Flags": 122,
  "Sequence": 99536574
}
```

### MPTokenIssuanceCreate Fields

MPTokenIssuanceCreate transactions can include the following new field:

| Field            | JSON Type           | [Internal Type][] | Required? | Description |
|:-----------------|:--------------------|:------------------|:----------|-------------|
| `MutableFlags`   | Number              | UInt32            | No        | A bitwise combination of flags indicating which fields may be modified after issuance, and which MPT issuance flags may be enabled after issuance. See [MPTokenIssuanceCreate Mutable Flags](#mptokenissuancecreate-mutable-flags). |

{% admonition type="warning" name="Warning" %}
Only the specified fields and flags may be declared mutable; all other fields remain immutable.
{% /admonition %}

### MPTokenIssuanceCreate Mutable Flags

The following flags are stored in the `MutableFlags` field, which is separate from the `Flags` field of the `MPTokenIssuanceCreate` transaction. MPT issuance flags that are declared mutable are one-way: they can be enabled after issuance via `MPTokenIssuanceSet`, but once enabled they cannot be disabled. Mutable fields (`MPTokenMetadata` and `TransferFee`) can always be modified.

| Flag Name                     | Hex Value    | Decimal Value | Description |
|:----------------------------- |:-------------|:--------------|:------------|
| `tmfMPTCanEnableCanLock`      | `0x00000002` | 2             | If enabled, the MPT's **Can Lock** flag, which gives the issuer the power to lock/unlock holders' balances, can be enabled after issuance. |
| `tmfMPTCanEnableRequireAuth`  | `0x00000004` | 4             | If enabled, the MPT's **Require Auth** flag, which indicates that individual holders must be authorized, can be enabled after issuance. |
| `tmfMPTCanEnableCanEscrow`    | `0x00000008` | 8             | If enabled, the MPT's **Can Escrow** flag, which indicates that the token can be placed in escrow, can be enabled after issuance. |
| `tmfMPTCanEnableCanTrade`     | `0x00000010` | 16            | If enabled, the MPT's **Can Trade** flag, which indicates that individual holders can trade their balances using the XRP Ledger DEX or AMM, can be enabled after issuance. |
| `tmfMPTCanEnableCanTransfer`  | `0x00000020` | 32            | If enabled, the MPT's **Can Transfer** flag, which indicates that tokens held by non-issuers can be transferred to other accounts, can be enabled after issuance. |
| `tmfMPTCanEnableCanClawback`  | `0x00000040` | 64            | If enabled, the MPT's **Can Clawback** flag, which indicates that the issuer can claw back value from individual holders, can be enabled after issuance. |
| `tmfMPTCanMutateMetadata`     | `0x00010000` | 65536         | If enabled, the `MPTokenMetadata` field, which stores additional information about the token, can be modified. |
| `tmfMPTCanMutateTransferFee`  | `0x00020000` | 131072        | If enabled, the `TransferFee` field, which determines the fee percentage charged on transfers between users, can be modified. |

### Error Cases

The following failure conditions have been added to the `MPTokenIssuanceCreate` transaction:

| Error Code         | Description |
|:-------------------|:------------|
| `temDISABLED`      | The `MutableFlags` field is present but the DynamicMPT amendment is not enabled. |
| `temINVALID_FLAG`  | The `MutableFlags` field contains an invalid value. |

## MPTokenIssuanceSet Transaction Changes

When updating mutable fields, issuers can change the field value to any allowed value. When enabling MPT issuance flags that were declared mutable, issuers can only enable them; mutable flags are one-way and cannot be disabled by `MPTokenIssuanceSet` once enabled.

### Example JSON

This example updates the MPT metadata:

```json
{
  "TransactionType": "MPTokenIssuanceSet",
  "Account": "rNFta7UKwcoiCpxEYbhH2v92numE3cceB6",
  "MPTokenIssuanceID": "05EECEBE97A7D635DE2393068691A015FED5A89AD203F5AA",
  "MPTokenMetadata": "575C5C", // Updated metadata from `464F4F` to `575C5C`
  "Fee": "10",
  "Flags": 1,
  "Sequence": 99536577
}
```

### MPTokenIssuanceSet Fields

MPTokenIssuanceSet transactions can include the following new fields:

| Field            | JSON Type           | [Internal Type][] | Required? | Description |
|:-----------------|:--------------------|:------------------|:----------|-------------|
| `MPTokenMetadata`| String              | Blob              | No        | New metadata to replace the existing value. Setting an empty value removes the field. Only valid if `lsmfMPTCanMutateMetadata` was set when creating the `MPTokenIssuance` object. |
| `TransferFee`    | Number              | UInt16            | No        | The new transfer fee value. Setting this to zero removes the field. Only valid if `lsmfMPTCanMutateTransferFee` was enabled when creating the `MPTokenIssuance` object. See [Transfer Fee Rules](#transfer-fee-rules). |
| `MutableFlags`   | Number              | UInt32            | No        | Enable MPT issuance flags that were declared mutable when creating the `MPTokenIssuance` object. See [MPTokenIssuanceSet Mutable Flags](#mptokenissuanceset-mutable-flags). |

### MPTokenIssuanceSet Mutable Flags

The following flags are stored in the `MutableFlags` field, which is separate from the `Flags` field of the `MPTokenIssuanceSet` transaction. All of these flags are one-way: each one only enables an MPT issuance flag that was declared mutable at creation. Once enabled, the underlying MPT issuance flag cannot be disabled by `MPTokenIssuanceSet`.

| Flag Name                  | Hex Value    | Decimal Value | Description |
|:-------------------------- |:-------------|:--------------|:------------|
| `tmfMPTSetCanLock`         | `0x00000001` | 1             | Enables the MPT's **Can Lock** flag, which allows the token to be locked both individually and globally. Once enabled, this flag cannot be disabled. |
| `tmfMPTSetRequireAuth`     | `0x00000002` | 2             | Enables the MPT's **RequireAuth** flag, which requires individual holders to be authorized to hold the token. Once enabled, this flag cannot be disabled. |
| `tmfMPTSetCanEscrow`       | `0x00000004` | 4             | Enables the MPT's **Can Escrow** flag, which allows holders to place balances into escrow. Once enabled, this flag cannot be disabled. |
| `tmfMPTSetCanTrade`        | `0x00000008` | 8             | Enables the MPT's **Can Trade** flag, which allows holders to trade balances on the XRPL DEX. Once enabled, this flag cannot be disabled. |
| `tmfMPTSetCanTransfer`     | `0x00000010` | 16            | Enables the MPT's **Can Transfer** flag, which allows tokens to be transferred to non-issuer accounts. Once enabled, this flag cannot be disabled. |
| `tmfMPTSetCanClawback`     | `0x00000020` | 32            | Enables the MPT's **Can Clawback** flag, which allows the issuer to claw back tokens. Once enabled, this flag cannot be disabled. |

{% admonition type="success" name="Tip" %}
Re-setting an MPT issuance flag that is already enabled is valid and has no additional effect.
{% /admonition %}

### Transfer Fee Rules

The ability to modify the `TransferFee` depends on two flags:

- `lsfMPTCanTransfer`: must already be enabled to allow any non-zero `TransferFee`. Note that this flag can be enabled through `tmfMPTSetCanTransfer` if `lsmfMPTCanEnableCanTransfer` is set. Once enabled, it cannot be disabled.
- `lsmfMPTCanMutateTransferFee`: must be enabled at creation of the MPT issuance to allow any modification of the `TransferFee` field.

{% admonition type="info" name="Note" %}
If the MPT's transfer fee and **Can Transfer** flag are both mutable, you can enable **Can Transfer** first, then modify the transfer fee in a second transaction.
{% /admonition %}

The following table describes how setting a zero or non-zero transfer fee through the `MPTokenIssuanceSet` transaction behaves, based on the existing state of the `MPTokenIssuance` object on-ledger. The first two columns represent the ledger state (`lsfMPTCanTransfer` and `lsmfMPTCanMutateTransferFee`), while the third column represents the `TransferFee` value being set in the transaction.

| Can Transfer | Can Mutate Transfer Fee | Transfer Fee Value | Result | Description |
|:-------------|:------------------------|:-------------------|:-------|:------------|
| Disabled     | Enabled                 | Zero               | ✅     | Removes the `TransferFee` field. |
| Disabled     | Disabled                | Zero               | ❌     | Not allowed to modify `TransferFee`. |
| Disabled     | Enabled/Disabled        | Non-zero           | ❌     | Always invalid regardless of mutability. |
| Enabled      | Enabled                 | Non-zero           | ✅     | Modifies the `TransferFee` field. |
| Enabled      | Disabled                | Non-zero           | ❌     | Not allowed to modify `TransferFee`. |
| Enabled      | Enabled                 | Zero               | ✅     | Removes the `TransferFee` field. |
| Enabled      | Disabled                | Zero               | ❌     | Not allowed to modify `TransferFee`. |

### Error Cases

The following failure conditions have been added to the `MPTokenIssuanceSet` transaction:

| Error Code            | Description |
|:----------------------|:------------|
| `tecNO_PERMISSION`    | The sender does not have permission to modify the specified field or flag. For example:<ul><li>The `MutableFlags` field attempts to modify a flag that was not declared as mutable during creation.</li><li>The `MPTokenMetadata` field is provided but `lsmfMPTCanMutateMetadata` was not set during creation.</li><li>The `TransferFee` field is provided but `lsmfMPTCanMutateTransferFee` was not set during creation.</li><li>A non-zero `TransferFee` is specified but `lsfMPTCanTransfer` is not currently enabled on the issuance.</li></ul> |
| `temDISABLED`         | The `MutableFlags`, `MPTokenMetadata`, or `TransferFee` is present but the DynamicMPT amendment is not enabled. |
| `temBAD_TRANSFER_FEE` | The `TransferFee` exceeds the maximum allowed value of 50,000. |
| `temINVALID_FLAG`     | The `MutableFlags` field contains an invalid value, including `0`. |
| `temMALFORMED`        | The transaction is malformed. For example:<ul><li>The `Holder` field is provided when mutating the MPT issuance.</li><li>The `Flags` field is set when mutation fields (`MutableFlags`, `MPTokenMetadata`, or `TransferFee`) are present.</li><li>The `MPTokenMetadata` field exceeds the maximum length of 1024 bytes.</li></ul> |

## MPTokenIssuance Entry Changes

MPTokenIssuance ledger entries can include the following new field:

| Field            | JSON Type           | [Internal Type][] | Required? | Description |
|:-----------------|:--------------------|:------------------|:----------|-------------|
| `MutableFlags`   | Number              | UInt32            | No        | Indicates which fields of this token issuance can be modified after creation, and which MPT issuance flags can be enabled after creation. See [MPTokenIssuance Mutable Flags](#mptokenissuance-mutable-flags). |

### MPTokenIssuance Mutable Flags

The following flags are stored in the `MutableFlags` field, which is separate from the `Flags` field of the `MPTokenIssuance` ledger entry:

| Flag Name                         | Hex Value    | Decimal Value | Description |
|:--------------------------------- |:-------------|:--------------|:------------|
| `lsmfMPTCanEnableCanLock`         | `0x00000002` | 2             | Allows the **Can Lock** flag to be enabled after issuance. |
| `lsmfMPTCanEnableRequireAuth`     | `0x00000004` | 4             | Allows the **Require Auth** flag to be enabled after issuance. |
| `lsmfMPTCanEnableCanEscrow`       | `0x00000008` | 8             | Allows the **Can Escrow** flag to be enabled after issuance. |
| `lsmfMPTCanEnableCanTrade`        | `0x00000010` | 16            | Allows the **Can Trade** flag to be enabled after issuance. |
| `lsmfMPTCanEnableCanTransfer`     | `0x00000020` | 32            | Allows the **Can Transfer** flag to be enabled after issuance. |
| `lsmfMPTCanEnableCanClawback`     | `0x00000040` | 64            | Allows the **Can Clawback** flag to be enabled after issuance. |
| `lsmfMPTCanMutateMetadata`        | `0x00010000` | 65536         | Allows the `MPTokenMetadata` field to be modified. |
| `lsmfMPTCanMutateTransferFee`     | `0x00020000` | 131072        | Allows the `TransferFee` field to be modified. |

## Amendment Information

| Amendment                             | DynamicMPT |
|:------------------------------------- |:---------- |
| Amendment ID                          | `58E92F338758479C06084E1B6BA366BAD8F75E5329A7F0EEAFFFDA51E5106B7F` |
| Status                                | In Development |
| Default Vote (Latest stable release)  | No |
| Pre-amendment functionality retired?  | No |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
