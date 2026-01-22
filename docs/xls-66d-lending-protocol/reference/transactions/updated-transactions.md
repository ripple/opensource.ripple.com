---
seo:
    description: The Lending Protocol updates the batch transaction with an additional error case.
labels:
    - Transaction Sending
status: not_enabled
---
# Updated Transactions

The Lending Protocol updates the [`batch`](https://xrpl.org/docs/references/protocol/transactions/types/batch) transaction with a new error case.

_(Requires the [Lending Protocol amendment][] {% not-enabled /%})_

| Error Code         | Description |
|:-------------------|:------------|
| `temINVALID_INNER_BATCH` | You are attempting to submit a lending protocol-related transaction, which is currently disabled. Invalid transactions include: `LoanBrokerCoverClawback`, `LoanBrokerCoverDeposit`, `LoanBrokerCoverWithdraw`, `LoanBrokerDelete`, `LoanBrokerSet`, `LoanDelete`, `LoanManage`, `LoanPay`, `LoanSet` |

{% raw-partial file="/docs/_snippets/common-links.md" /%}