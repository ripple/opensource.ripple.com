# Transactions

{% partial file="/docs/_snippets/_single-asset-vault-disclaimer.md" /%}

The Single Asset Vault feature adds new transaction types to the ledger:

**Vault Management**
- [VaultCreate](./vault-create.md): Creates a new vault object.
- [VaultSet](./vault-set.md): Updates an existing vault object.
- [VaultDelete](./vault-delete.md): Deletes an existing vault object.

**Asset Management**
- [VaultDeposit](./vault-deposit.md): Deposits a specified number of assets into the vault in exchange for shares.
- [VaultWithdraw](./vault-withdraw.md): Withdraws a specified number of assets from the vault in exchange for shares.

**Compliance**
- [VaultClawback](./vault-clawback.md): Allows the issuer of an IOU or MPT to [claw back](https://xrpl.org/docs/use-cases/tokenization/stablecoin-issuer#clawback) funds from the vault.
