---
seo:
    description: Single Asset Vaults update the batch transaction with an additional error case.
labels:
    - Transaction Sending
status: not_enabled
---
# Updated Transactions
{% raw-partial file="/docs/_snippets/_lending-sav-disclaimer.md" /%}

Single Asset Vaults update the [`batch`](https://xrpl.org/docs/references/protocol/transactions/types/batch) transaction with a new error case.

_(Requires the [Single Asset Vault amendment][] {% not-enabled /%})_

| Error Code         | Description |
|:-------------------|:------------|
| `temINVALID_INNER_BATCH` | You are attempting to submit a vault-related transaction, which is currently disabled. Invalid transactions include: `VaultCreate`, `VaultSet`, `VaultDelete`, `VaultDeposit`, `VaultWithdraw`, and `VaultClawback`. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}