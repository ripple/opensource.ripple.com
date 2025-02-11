# MPTokenIssuance

{% partial file="/docs/_snippets/_single-asset-vault-disclaimer.md" /%}

The `MPTokenIssuance` object represents a vault share on the ledger. An `MPTokenIssuance` object is created and deleted together with the `Vault` object.

## MPTokenIssuance Fields

| Name              | JSON Type | Internal Type | Description                                                                                    |
| :---------------- | :-------- | :------------ | :--------------------------------------------------------------------------------------------- |
| `Issuer`          | String    | AccountID     | The AccountID of the Vault's pseudo-account.                                                   |
| `MaximumAmount`   | String    |               | No limit to the number of shares that can be issued. The default value is `0xFFFFFFFFFFFFFFFF` |
| `TransferFee`     |           |               | The fee paid to transfer the shares. The default value is `0`.                                 |
| `MPTokenMetadata` | String    |               | Arbitrary metadata about the share MPT, in hex format.                                         |

## MPTokenIssuance Flags

The following flags are set based on whether the shares are transferable, and if the vault is public or private:

| Condition         | Transferable                                                                           | Non-Transferable    |
| :---------------- | :------------------------------------------------------------------------------------- | :------------------ |
| **Public Vault**  | `lsfMPTCanEscrow` <br> `lsfMPTCanTrade`<br> `lsfMPTCanTransfer`                        | No Flags            |
| **Private Vault** | `lsfMPTCanEscrow`<br> `lsfMPTCanTrade`<br> `lsfMPTCanTransfer`<br> `lsfMPTRequireAuth` | `lsfMPTRequireAuth` |
