---
seo:
    title: Updated Transactions
    description: The Lending Protocol V1.1 amendment restricts when LoanSet can originate a loan against a closed-ended vault.
labels:
    - Transactions
    - Lending Protocol
    - Single Asset Vault
status: not_enabled
---

# Updated Transactions

The [LendingProtocolV1_1 amendment][] updates one existing transaction to support [closed-ended vaults](../../xls-65-single-asset-vault/lending-protocol-1-1/closed-ended-vaults.md).

_(Requires the [LendingProtocolV1_1 amendment][] {% not-enabled /%})_

## LoanSet

A loan can only be originated against a closed-ended vault during its **Investment** phase, and only if the loan matures before the vault does. Specifically, the loan's final scheduled payment must fall strictly before the vault's `RedemptionDate`:

```text
StartDate + (PaymentInterval × PaymentTotal) < RedemptionDate
```

This means the maximum term of a new loan shrinks as the vault approaches its `RedemptionDate`. A vault with three months left in its Investment phase can't originate a twelve-month loan.

Loans against an open-ended vault are unaffected.

### New Error Cases

| Error Code         | Description |
| :----------------- | :---------- |
| `tecTOO_SOON`      | The vault is closed-ended and is still in its Subscription phase. |
| `tecEXPIRED`       | The vault is closed-ended and has entered its Redemption phase. |
| `tecNO_PERMISSION` | The vault is closed-ended and the loan's final scheduled payment falls on or after the vault's `RedemptionDate`. |

## See Also

- [Closed-Ended Vaults](../../xls-65-single-asset-vault/lending-protocol-1-1/closed-ended-vaults.md)
- [Updated Transactions (Single Asset Vault)](../../xls-65-single-asset-vault/lending-protocol-1-1/updated-transactions.md)
- [Updated Ledger Entries](../../xls-65-single-asset-vault/lending-protocol-1-1/updated-ledger-entries.md)
- [LoanSet transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
