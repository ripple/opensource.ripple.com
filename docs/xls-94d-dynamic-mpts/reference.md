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
Only a limited set of fields and flags may be declared mutable; all other fields will remain immutable.
{% /admonition %}

### MPTokenIssuanceCreate Mutable Flags

| Flag Name                    | Hex Value    | Decimal Value | Description |
|:-----------------------------|:-------------|:--------------|:------------|
| `tfMPTCanMutateCanLock`      | `0x0002`     | 2             | Indicates the `lsfMPTCanLock` flag can be changed. |
| `tfMPTCanMutateRequireAuth`  | `0x0004`     | 4             | Indicates the `lsfMPTRequireAuth` flag can be changed. |
| `tfMPTCanMutateCanEscrow`    | `0x0008`     | 8             | Indicates the `lsfMPTCanEscrow` flag can be changed. |
| `tfMPTCanMutateCanTrade`     | `0x0010`     | 16            | Indicates the `lsfMPTCanTrade` flag can be changed. |
| `tfMPTCanMutateCanTransfer`  | `0x0020`     | 32            | Indicates the `lsfMPTCanTransfer` flag can be changed. |
| `tfMPTCanMutateCanClawback`  | `0x0040`     | 64            | Indicates the `lsfMPTCanClawback` flag can be changed. |
| `tfMPTCanMutateMetadata`     | `0x00010000` | 65536         | Allows the `MPTokenMetadata` field to be modified. |
| `tfMPTCanMutateTransferFee`  | `0x00020000` | 131072        | Allows the `TransferFee` field to be modified. |

## MPTokenIssuanceSet Transaction Changes

When updating mutable flags, issuers can set or clear any flag that was marked as mutable during the creation of the `MPTokenIssuance` object.

MPTokenIssuanceSet transactions can include the following new fields:

| Field            | JSON Type           | [Internal Type][] | Required? | Description |
|:-----------------|:--------------------|:------------------|:----------|-------------|
| `MPTokenMetadata`| String              | Blob              | No        | New metadata to replace the existing value. Setting an empty value removes the field. Only valid if `lsfMPTCanMutateMetadata` was set when creating the `MPTokenIssuance` object. |
| `TransferFee`    | Number              | UInt16            | No        | The new transfer fee value. Setting this to zero removes the field. Only valid if `lsfMPTCanMutateTransferFee` was set when creating the `MPTokenIssuance` object. See [Transfer Fee Rules](#transfer-fee-rules). |
| `MutableFlags`   | Number              | UInt32            | No        | Set or clear flags that were marked as mutable when creating the `MPTokenIssuance` object. See [MPTokenIssuanceSet Mutable Flags](#mptokenissuanceset-mutable-flags). |

### MPTokenIssuanceSet Mutable Flags

| Flag Name                 | Hex Value    | Decimal Value | Description |
|:--------------------------|:-------------|:--------------|:------------|
| `tfMPTSetCanLock`         | `0x0001`     | 1             | Sets the `lsfMPTCanLock` flag. Enables the token to be locked both individually and globally. |
| `tfMPTClearCanLock`       | `0x0002`     | 2             | Clears the `lsfMPTCanLock` flag. Disables both individual and global locking of the token. |
| `tfMPTSetRequireAuth`     | `0x0004`     | 4             | Sets the `lsfMPTRequireAuth` flag. Requires individual holders to be authorized. |
| `tfMPTClearRequireAuth`   | `0x0008`     | 8             | Clears the `lsfMPTRequireAuth` flag. Holders are not required to be authorized. |
| `tfMPTSetCanEscrow`       | `0x0010`     | 16            | Sets the `lsfMPTCanEscrow` flag. Allows holders to place balances into escrow. |
| `tfMPTClearCanEscrow`     | `0x0020`     | 32            | Clears the `lsfMPTCanEscrow` flag. Disallows holders from placing balances into escrow. |
| `tfMPTSetCanTrade`        | `0x0040`     | 64            | Sets the `lsfMPTCanTrade` flag. Allows holders to trade balances on the XRPL DEX. |
| `tfMPTClearCanTrade`      | `0x0080`     | 128           | Clears the `lsfMPTCanTrade` flag. Disallows holders from trading balances on the XRPL DEX. |
| `tfMPTSetCanTransfer`     | `0x0100`     | 256           | Sets the `lsfMPTCanTransfer` flag. Allows tokens to be transferred to non-issuer accounts. |
| `tfMPTClearCanTransfer`   | `0x0200`     | 512           | Clears the `lsfMPTCanTransfer` flag. Disallows transfers to non-issuer accounts. Note that when `lsfMPTCanTransfer` is cleared, the `TransferFee` field is automatically removed. |
| `tfMPTSetCanClawback`     | `0x0400`     | 1024          | Sets the `lsfMPTCanClawback` flag. Enables the issuer to claw back tokens. |
| `tfMPTClearCanClawback`   | `0x0800`     | 2048          | Clears the `lsfMPTCanClawback` flag. The token cannot be clawed back. |

{% admonition type="info" name="Note" %}
Setting and clearing the same flag simultaneously will be rejected. For example, you cannot provide both `tfMPTSetCanLock` and `tfMPTClearCanLock`.
{% /admonition %}

### Transfer Fee Rules

The ability to modify the `TransferFee` depends on two flags:

- `lsfMPTCanTransfer`: must already be set to allow any non-zero `TransferFee`.
- `lsfMPTCanMutateTransferFee`: must be set at creation of the MPT issuance to allow any modification of the `TransferFee` field.

{% admonition type="info" name="Note" %}
`lsfMPTCanTransfer` can be modified through `tfMPTSetCanTransfer` or `tfMPTClearCanTransfer` if `lsfMPTCanMutateCanTransfer` is set.
{% /admonition %}

Because these flags overlap in function, the rules break down as follows:

| `lsfMPTCanTransfer` | TransferFee Value   | `lsfMPTCanMutateTransferFee` | Result | Description |
|:------------------- |:------------------- |:---------------------------- |:------ |:----------- |
| Not Set             | Zero                | Set                          | ✅     | Removes the `TransferFee` field. |
| Not Set             | Zero                | Not Set                      | ❌     | Not allowed to modify `TransferFee`. |
| Not Set             | Non-zero            | Set/Not Set                  | ❌     | Always invalid regardless of mutability. |
| Set                 | Non-zero            | Set                          | ✅     | Modifies the `TransferFee` field. |
| Set                 | Non-zero            | Not Set                      | ❌     | Not allowed to modify `TransferFee`. |
| Set                 | Zero                | Set                          | ✅     | Removes the `TransferFee` field. |
| Set                 | Zero                | Not Set                      | ❌     | Not allowed to modify `TransferFee`. |

## MPTokenIssuance Entry Changes

MPTokenIssuance ledger entries can include the following new field:

| Field            | JSON Type           | [Internal Type][] | Required? | Description |
|:-----------------|:--------------------|:------------------|:----------|-------------|
| `MutableFlags`   | Number              | UInt32            | No        | Indicates which fields or flags of this token issuance can be modified after creation. See [MPTokenIssuance Mutable Flags](#mptokenissuance-mutable-flags). |

### MPTokenIssuance Mutable Flags

| Flag Name                        | Hex Value    | Decimal Value | Description |
|:---------------------------------|:-------------|:--------------|:------------|
| `lsfMPTCanMutateCanLock`         | `0x0002`     | 2             | Indicates the `lsfMPTCanLock` flag can be changed. |
| `lsfMPTCanMutateRequireAuth`     | `0x0004`     | 4             | Indicates the `lsfMPTRequireAuth` flag can be changed. |
| `lsfMPTCanMutateCanEscrow`       | `0x0008`     | 8             | Indicates the `lsfMPTCanEscrow` flag can be changed. |
| `lsfMPTCanMutateCanTrade`        | `0x0010`     | 16            | Indicates the `lsfMPTCanTrade` flag can be changed. |
| `lsfMPTCanMutateCanTransfer`     | `0x0020`     | 32            | Indicates the `lsfMPTCanTransfer` flag can be changed. |
| `lsfMPTCanMutateCanClawback`     | `0x0040`     | 64            | Indicates the `lsfMPTCanClawback` flag can be changed. |
| `lsfMPTCanMutateMetadata`        | `0x00010000` | 65536         | Allows the `MPTokenMetadata` field to be modified. |
| `lsfMPTCanMutateTransferFee`     | `0x00020000` | 131072        | Allows the `TransferFee` field to be modified. |

<!-- ## Amendment Information

| Amendment    | DynamicMPT |
|:-------------|:------------|
| Amendment ID | `` 
| Status       | In Development |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No | -->

{% raw-partial file="/docs/_snippets/common-links.md" /%}
