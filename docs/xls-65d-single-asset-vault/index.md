---
blurb: A single asset vault is an on-chain primitive for aggregating assets from one or more depositors.
labels:
  - Single Asset Vault 
status: not_enabled
---

# Single Asset Vault

A single asset vault is an XRP Ledger primitive that aggregates assets from multiple depositors and makes them available to other on-chain protocols, such as the Lending Protocol (currently in development). A vault asset can be [XRP](https://xrpl.org/docs/introduction/what-is-xrp), a [Fungible Token](https://xrpl.org/docs/concepts/tokens/fungible-tokens), or an [MPT (Multi-Purpose Token)](https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens).

## Concepts

[Single Asset Vault](./concepts/single-asset-vault.md)

## Reference

**Objects**

  - [Vault](./reference/vault.md)
  - [MPTokenIssuance](./reference/mptoken-issuance.md)
  - [MPToken](./reference/mptoken.md)

**Transactions**

  - [VaultCreate](./reference/transactions/vault-create.md)
  - [VaultSet](./reference/transactions/vault-set.md)
  - [VaultDelete](./reference/transactions/vault-delete.md)
  - [VaultDeposit](./reference/transactions/vault-deposit.md)
  - [VaultWithdraw](./reference/transactions/vault-withdraw.md)
  - [VaultClawback](./reference/transactions/vault-clawback.md)
