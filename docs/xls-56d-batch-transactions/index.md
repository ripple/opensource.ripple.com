---
seo:
  description: Batch allows up to 8 transactions to be submitted as a single unit.
labels:
  - Batch
  - Transactions
status: not_enabled
---
# Batch Transactions

`Batch`  lets you package multiple transactions together and execute them as a single unit. It eliminates the risk of partial completion and unexpected outcomes, giving you a more reliable and predictable experience for complex operations. Up to eight transactions can be submitted in a single batch.

Some potential uses for `Batch` include the following.
- All or nothing: You can mint an NFT and create an offer for it in one transaction. If the offer creation fails, the NFT mint is reverted as well.
- Trying out a few offers: Submit multiple offers with different amounts of slippage, but only one will succeed.
- Platform fees: Package platform fees within the transaction itself, simplifying the process.
- Swaps (multi-account): Trustless token/NFT swaps between multiple accounts.
- Withdrawing accounts (multi-account): Attempt a withdrawal from your checking account, and if that fails, withdraw from your savings account instead.

## Concepts

[Batch Transactions](concepts/batch-transactions.md)

## Reference

[Batch](reference/batch.md)
[Common Fields](reference/common-fields.md)

