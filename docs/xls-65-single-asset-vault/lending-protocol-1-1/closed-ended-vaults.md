# Closed-Ended Vaults

The `LendingProtocolV1_1` amendment introduces a new **closed-ended vault** to single asset vaults. Unlike an open-ended vault, which allows depositors to deposit and withdraw at any time, a closed-ended vault has a defined lifecycle:

1. **Subscription**: The fundraising window. Depositors can deposit and withdraw assets freely.
2. **Investment**: The lockup period. Assets in the vault are now fixed and can be deployed in loans. Deposits and withdrawals are blocked during this time.
3. **Redemption**: The wind down. Loans have matured and been repaid, no new loans can be created, and depositors can withdraw their share of the proceeds.

The move from one stage to the next happens automatically at set dates that are chosen when the vault is created and can't be changed afterwards. Since the schedule is fixed and public, everyone involved knows when the fundraising window closes, how long their assets are committed, and when they can expect to be repaid.

<!-- {% amendment-disclaimer name="SingleAssetVault" /%} -->

The following table outlines which transactions are permitted during the three phases:

| Transaction     | Open-ended | Subscription | Investment | Redemption |
| --------------- | :--------: | :----------: | :--------: | :--------: |
| `VaultDeposit`  | ✅         | ✅           | ❌         | ❌         |
| `VaultWithdraw` | ✅         | ✅           | ❌         | ✅         |
| `VaultClawback` | ✅         | ✅           | ✅         | ✅         |
| `LoanSet`       | ✅         | ❌           | ✅         | ❌         |
| `LoanPay`       | ✅         | ✅           | ✅         | ✅         |
| `LoanManage`    | ✅         | ✅           | ✅         | ✅         |
| `LoanDelete`    | ✅         | ✅           | ✅         | ✅         |
