# Closed-Ended Vaults

The [LendingProtocolV1_1][] amendment introduces a new _closed-ended vault_ to single asset vaults. Unlike an open-ended vault, which allows depositors to deposit and withdraw at any time, a closed-ended vault has a defined lifecycle:

1. **Subscription**: The fundraising window. Depositors can deposit and withdraw assets freely.
2. **Investment**: The lockup period. Assets in the vault are now fixed and can be deployed in loans. Deposits and withdrawals are blocked during this time.
3. **Redemption**: The wind down. Loans have matured and been repaid, no new loans can be created, and depositors can withdraw their share of the proceeds.

The move from one stage to the next happens automatically at set dates that are chosen when the vault is created and can't be changed afterwards. Since the schedule is fixed and public, everyone involved knows when the fundraising window closes, how long their assets are committed, and when they can expect to be repaid.

`LendingProtocolV1_1` restricts all loans to closed-ended vaults only. The following table outlines which transactions are permitted for open-ended vaults and the three phases of closed-ended vaults:

| Transaction     | Open-ended | Subscription | Investment | Redemption |
| --------------- | :--------: | :----------: | :--------: | :--------: |
| `VaultDeposit`  | ✅         | ✅           | ❌         | ❌         |
| `VaultWithdraw` | ✅         | ✅           | ❌         | ✅         |
| `VaultClawback` | ✅         | ✅           | ✅         | ✅         |
| `LoanBrokerSet` | ❌         | ✅           | ✅         | ✅         |
| `LoanSet`       | ✅         | ❌           | ✅         | ❌         |
| `LoanPay`       | ✅         | ✅           | ✅         | ✅         |
| `LoanManage`    | ✅         | ✅           | ✅         | ✅         |
| `LoanDelete`    | ✅         | ✅           | ✅         | ✅         |

{% admonition type="info" name="Note" %}
`LoanBrokerSet` is restricted on open-ended vaults, however the other loan-related transactions are intentionally enabled so you can manage any loans that are created after `LendingProtocol` is enabled and before `LendingProtocolV1_1` adds the loan broker restriction.
{% /admonition %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
