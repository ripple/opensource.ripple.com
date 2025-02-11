---
blurb: Single Asset Vault is an on-chain primitive for aggregating assets from one or more depositors.
labels:
  - Single Asset Vault 
status: not_enabled
---

# Single Asset Vault

A Single Asset Vault lets you to aggregate assets from multiple depositors and makes them available to other on-chain protocols. Vault assets can be either XRP, [Fungible Tokens](https://xrpl.org/docs/concepts/tokens/fungible-tokens), or [MPTs (Multi-Purpose Tokens)](https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens).

Depositors can add or withdraw assets and own shares that reflect their proportional ownership of the vault's assets. Vault shares are represented on-chain by MPTs.

## Concepts

[Single Asset Vault](./concepts/single-asset-vault.md)

## Reference

**Objects**

  - [Vault](./reference/vault.md)
  - [MPTokenIssuance](./reference/mptoken-issuance.md)
  - [MPToken](./reference/mptoken.md)
  - [AccountRoot](./reference/account-root.md)
  - [DirectoryNode](./reference/owner-directory.md)

**Transactions**

  - [VaultCreate](./reference/transactions/vault-create.md)
  - [VaultSet](./reference/transactions/vault-set.md)
  - [VaultDelete](./reference/transactions/vault-delete.md)
  - [VaultDeposit](./reference/transactions/vault-deposit.md)
  - [VaultWithdraw](./reference/transactions/vault-withdraw.md)
  - [VaultClawback](./reference/transactions/vault-clawback.md)

<!-- **RPC Endpoint** -->
<!-- - [ledger_entry]() -->
