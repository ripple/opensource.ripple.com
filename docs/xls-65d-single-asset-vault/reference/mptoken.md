# MPToken

{% partial file="/docs/_snippets/_single-asset-vault-disclaimer.md" /%}

The `MPToken` object represents the amount of shares held by a depositor. It is created when the account deposits liquidity into the vault and is deleted when a depositor redeems, or transfers, all shares.

## MPToken

The `MPToken`

| **Condition**     | **Transferable**   | **Non-Transferable** |
| ----------------- | ------------------ | -------------------- |
| **Public Vault**  | No Flags           | `lsfMPTAuthorized`   |
| **Private Vault** | `lsfMPTAuthorized` | `lsfMPTAuthorized`   |
