# Dynamic MPT Reference

The Dynamic MPT amendment does not create any new data types, but it modifies several transactions and the `MPTokenIssuance` ledger entry.

- **Transactions:**
    - [MPTokenIssuanceCreate](#mptokenissuancecreate-transaction-changes) - A new `MutableFlags` field is added to specify which fields or flags are mutable after issuance.
    - [MPTokenIssuanceSet](#mptokenissuanceset-transaction-changes) - New fields have been added to update mutable metadata, transfer fees, and flags.
- **Ledger Entries:**
    - [MPTokenIssuance](#mptokenissuance-entry-changes) - A new `MutableFlags` field is added to store mutability settings.

## MPTokenIssuanceCreate Transaction Changes

To allow future changes to specific fields or flags of a token, issuers must clearly specify which ones should be mutable when creating the `MPTokenIssuance` object.

MPTokenIssuanceCreate transactions can include the following new field:

| Field            | JSON Type           | [Internal Type][] | Required? | Description |
|:-----------------|:--------------------|:------------------|:----------|-------------|
| `MutableFlags`   | Number              | UInt32            | No        | Indicates specific fields or flags that are mutable after issuance. This is a bitwise combination of flags that determine mutability. See [MPTokenIssuanceCreate Mutable Flags](#mptokenissuancecreate-mutable-flags) |

{% admonition type="warning" name="Warning" %}
Only the specified fields and flags may be declared mutable; all other fields remain immutable.
{% /admonition %}

### MPTokenIssuanceCreate Mutable Flags

The following flags are stored in the `MutableFlags` field, which is separate from the `Flags` field of the `MPTokenIssuanceCreate` transaction:

| Flag Name                    | Hex Value    | Decimal Value | Description |
|:-----------------------------|:-------------|:--------------|:------------|
| `tmfMPTCanMutateCanLock`      | `0x00000002` | 2             | If enabled, the MPT's **Can Lock** flag, which gives the issuer the power to lock/unlock holders' balances, can change. |
| `tmfMPTCanMutateRequireAuth`  | `0x00000004` | 4             | If enabled, the MPT's **Require Auth** flag, which indicates that individual holders must be authorized, can change. |
| `tmfMPTCanMutateCanEscrow`    | `0x00000008` | 8             | If enabled, the MPT's **Can Escrow** flag, which indicates that the token can be placed in escrow, can change. |
| `tmfMPTCanMutateCanTrade`     | `0x00000010` | 16            | If enabled, the MPT's **Can Trade** flag, which indicates that individual holders can trade their balances using the XRP Ledger DEX or AMM, can change. |
| `tmfMPTCanMutateCanTransfer`  | `0x00000020` | 32            | If enabled, the MPT's **Can Transfer** flag, which indicates that tokens held by non-issuers can be transferred to other accounts, can change. |
| `tmfMPTCanMutateCanClawback`  | `0x00000040` | 64            | If enabled, the MPT's **Can Clawback** flag, which indicates that the issuer can claw back value from individual holders, can change. |
| `tmfMPTCanMutateMetadata`     | `0x00010000` | 65536         | If enabled, the `MPTokenMetadata` field, which stores additional information about the token, can change. |
| `tmfMPTCanMutateTransferFee`  | `0x00020000` | 131072        | If enabled, the `TransferFee` field, which determines the fee percentage charged on transfers between users, can change. |

## MPTokenIssuanceSet Transaction Changes

When updating mutable flags, issuers can set or clear any flag that was marked as mutable during the creation of the `MPTokenIssuance` object.

MPTokenIssuanceSet transactions can include the following new fields:

| Field            | JSON Type           | [Internal Type][] | Required? | Description |
|:-----------------|:--------------------|:------------------|:----------|-------------|
| `MPTokenMetadata`| String              | Blob              | No        | New metadata to replace the existing value. Setting an empty value removes the field. Only valid if `lsmfMPTCanMutateMetadata` was set when creating the `MPTokenIssuance` object. |
| `TransferFee`    | Number              | UInt16            | No        | The new transfer fee value. Setting this to zero removes the field. Only valid if `lsmfMPTCanMutateTransferFee` was enabled when creating the `MPTokenIssuance` object. See [Transfer Fee Rules](#transfer-fee-rules). |
| `MutableFlags`   | Number              | UInt32            | No        | Set or clear flags that were marked as mutable when creating the `MPTokenIssuance` object. See [MPTokenIssuanceSet Mutable Flags](#mptokenissuanceset-mutable-flags). |

### MPTokenIssuanceSet Mutable Flags

The following flags are stored in the `MutableFlags` field, which is separate from the `Flags` field of the `MPTokenIssuanceSet` transaction:

| Flag Name                 | Hex Value    | Decimal Value | Description |
|:--------------------------|:-------------|:--------------|:------------|
| `tmfMPTSetCanLock`         | `0x00000001` | 1             | Enables the MPT's **Can Lock** flag, which allows the token to be locked both individually and globally. |
| `tmfMPTClearCanLock`       | `0x00000002` | 2             | Disables the MPT's **Can Lock** flag, which prevents both individual and global locking of the token. |
| `tmfMPTSetRequireAuth`     | `0x00000004` | 4             | Enables the MPT's **RequireAuth** flag, which requires individual holders to be authorized to hold the token. |
| `tmfMPTClearRequireAuth`   | `0x00000008` | 8             | Disables the MPT's **RequireAuth** flag, which means holders don't need to be authorized to hold the token. |
| `tmfMPTSetCanEscrow`       | `0x00000010` | 16            | Enables the MPT's **Can Escrow** flag, which allows holders to place balances into escrow. |
| `tmfMPTClearCanEscrow`     | `0x00000020` | 32            | Disables the MPT's **Can Escrow** flag, which means holders can't place balances into escrow. |
| `tmfMPTSetCanTrade`        | `0x00000040` | 64            | Enables the MPT's **Can Trade** flag, which allows holders to trade balances on the XRPL DEX. |
| `tmfMPTClearCanTrade`      | `0x00000080` | 128           | Disables the MPT's **CanTrade** flag, which stops holders from trading balances on the XRPL DEX. |
| `tmfMPTSetCanTransfer`     | `0x00000100` | 256           | Enables the MPT's **CanTransfer** flag, which allows tokens to be transferred to non-issuer accounts. |
| `tmfMPTClearCanTransfer`   | `0x00000200` | 512           | Disables the MPT's **CanTransfer** flag, which means transfers to non-issuer accounts are not allowed. Note that when `CanTransfer` is disabled, the `TransferFee` field is automatically removed. |
| `tmfMPTSetCanClawback`     | `0x00000400` | 1024          | Enables the MPT's **Can Clawback** flag, which allows the issuer to claw back tokens. |
| `tmfMPTClearCanClawback`   | `0x00000800` | 2048          | Disables the MPT's **Can Clawback** flag, which means the token cannot be clawed back. |

{% admonition type="info" name="Note" %}
Enabling and disabling the same flag simultaneously will be rejected. For example, you cannot provide both `tmfMPTSetCanLock` and `tmfMPTClearCanLock`.
{% /admonition %}

### Transfer Fee Rules

The ability to modify the `TransferFee` depends on two flags:

- `lsfMPTCanTransfer`: must already be enabled to allow any non-zero `TransferFee`.
- `lsmfMPTCanMutateTransferFee`: must be enabled at creation of the MPT issuance to allow any modification of the `TransferFee` field.

{% admonition type="info" name="Note" %}
If the MPT's transfer fee and **Can Transfer** flag are both mutable, you can enable **Can Transfer** first, then modify the transfer fee.
{% /admonition %}

Because these flags overlap in function, the rules break down as follows:

| Can Transfer Flag | Transfer Fee Value | Can Mutate Transfer Fee | Result | Description |
|:----------------- |:-------------------|:------------------------|:-------|:------------|
| Disabled          | Zero               | Mutable                 | ✅     | Removes the `TransferFee` field. |
| Disabled          | Zero               | Static                  | ❌     | Not allowed to modify `TransferFee`. |
| Disabled          | Non-zero           | Mutable/Static          | ❌     | Always invalid regardless of mutability. |
| Enabled           | Non-zero           | Mutable                 | ✅     | Modifies the `TransferFee` field. |
| Enabled           | Non-zero           | Static                  | ❌     | Not allowed to modify `TransferFee`. |
| Enabled           | Zero               | Mutable                 | ✅     | Removes the `TransferFee` field. |
| Enabled           | Zero               | Static                  | ❌     | Not allowed to modify `TransferFee`. |

## MPTokenIssuance Entry Changes

MPTokenIssuance ledger entries can include the following new field:

| Field            | JSON Type           | [Internal Type][] | Required? | Description |
|:-----------------|:--------------------|:------------------|:----------|-------------|
| `MutableFlags`   | Number              | UInt32            | No        | Indicates which fields or flags of this token issuance can be modified after creation. See [MPTokenIssuance Mutable Flags](#mptokenissuance-mutable-flags). |

### MPTokenIssuance Mutable Flags

The following flags are stored in the `MutableFlags` field, which is separate from the `Flags` field of the `MPTokenIssuance` ledger entry:

| Flag Name                        | Hex Value    | Decimal Value | Description |
|:---------------------------------|:-------------|:--------------|:------------|
| `lsmfMPTCanMutateCanLock`         | `0x00000002` | 2             | Indicates the **Can Lock** flag can be changed. |
| `lsmfMPTCanMutateRequireAuth`     | `0x00000004` | 4             | Indicates the **Require Auth** flag can be changed. |
| `lsmfMPTCanMutateCanEscrow`       | `0x00000008` | 8             | Indicates the **Can Escrow** flag can be changed. |
| `lsmfMPTCanMutateCanTrade`        | `0x00000010` | 16            | Indicates the **Can Trade** flag can be changed. |
| `lsmfMPTCanMutateCanTransfer`     | `0x00000020` | 32            | Indicates the **Can Transfer** flag can be changed. |
| `lsmfMPTCanMutateCanClawback`     | `0x00000040` | 64            | Indicates the **Can Clawback** flag can be changed. |
| `lsmfMPTCanMutateMetadata`        | `0x00010000` | 65536         | Allows the `MPTokenMetadata` field to be modified. |
| `lsmfMPTCanMutateTransferFee`     | `0x00020000` | 131072        | Allows the `TransferFee` field to be modified. |

<!-- ## Amendment Information

| Amendment    | DynamicMPT |
|:-------------|:------------|
| Amendment ID | `` 
| Status       | In Development |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No | -->

{% raw-partial file="/docs/_snippets/common-links.md" /%}
