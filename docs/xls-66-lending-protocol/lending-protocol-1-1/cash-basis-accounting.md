# Cash-Basis Accounting

The `LendingProtocolV1_1` amendment changes how a vault recognizes interest income from the loans it funds.

Before the amendment, the lending protocol used a **whole-life** (accrual) model: the moment a loan was originated, the full interest the borrower was scheduled to pay over the life of the loan was recognized as vault income. The vault's books reflected money it hadn't received yet, and that recognition had to be unwound if the borrower stopped paying.

With the amendment, new vaults use **cash-basis** accounting instead: `Vault.AssetsTotal` and `LoanBroker.DebtTotal` track **principal only**, and interest is recognized as income only when a payment actually delivers it.

## What Each Model Recognizes

| | Whole-life (accrual) | Cash-basis |
| :--- | :--- | :--- |
| `Vault.AssetsTotal` | Principal plus all scheduled interest, recognized up front | Principal, plus interest as it's actually paid |
| `LoanBroker.DebtTotal` | Principal plus all scheduled interest | Principal only |
| Interest recognized | At origination, in full | On each payment, as received |

## Accounting Touch Points

The two models differ at four points in a loan's life. In every case the borrower's obligation is unchanged — only the vault's and broker's bookkeeping differs.

### Origination (`LoanSet`)

| | Whole-life (accrual) | Cash-basis |
| :--- | :--- | :--- |
| `AssetsTotal` change | `+ InterestDue` | No change |
| `DebtTotal` change | `+ (Principal + InterestDue)` | `+ Principal` |

### Payment (`LoanPay`)

| | Whole-life (accrual) | Cash-basis |
| :--- | :--- | :--- |
| `AssetsTotal` change | `+ ValueChange` | `+ InterestPaid` |
| `DebtTotal` change | `− ((PrincipalPaid + InterestPaid) − ValueChange)` | `− PrincipalPaid` |

Under cash-basis each payment splits cleanly: the principal portion retires debt, and the interest portion becomes vault income at that moment.

### Impairment and Default (`LoanManage`)

Both impairment and default measure the vault's exposure to a loan. That exposure is what gets booked as `Vault.LossUnrealized` when a loan is impaired (and reversed when it's unimpaired), and it's the default amount when a loan defaults.

| | Whole-life (accrual) | Cash-basis |
| :--- | :--- | :--- |
| Vault exposure | `TotalValueOutstanding − ManagementFeeOutstanding` (principal plus unpaid interest) | `PrincipalOutstanding` |

Because unearned interest was never recognized as income under cash-basis, it isn't part of the loss when a loan goes bad. A default writes off principal the vault actually lent out, not interest it never received.

### The `AssetsMaximum` Check (`LoanSet`)

Under the whole-life model, originating a loan increases `AssetsTotal` by the interest due, so a loan could be rejected with `tecLIMIT_EXCEEDED` for pushing the vault past its `AssetsMaximum`. Under cash-basis, origination doesn't recognize interest into `AssetsTotal` at all, so interest can never trip that limit.

## Which Model a Vault Uses

The model isn't a choice — there's no transaction field to select it. It's fixed for each vault when the vault is created, and it never changes afterward.

The [Vault entry][] carries an `LEVersion` field recording the schema version it was created under:

| `LEVersion` | Name        | Accounting model |
| :---------- | :---------- | :--------------- |
| _(absent)_  | Legacy      | Whole-life (accrual) |
| `1`         | Cash-basis  | Cash-basis |

- Vaults created **before** the [LendingProtocolV1_1 amendment][] activates have no `LEVersion`, which resolves to Legacy.
- Vaults created **after** activation are stamped as cash-basis by the [VaultCreate transaction][], automatically.

Legacy vaults keep whole-life accounting permanently, even after the amendment activates. There's no migration and no way to convert an existing vault, so both models coexist on the ledger indefinitely.

{% admonition type="info" name="Reading a vault's accounting model" %}
Treat an absent `LEVersion` as Legacy — whole-life accounting — rather than as missing data. Any loan against that vault accrues interest into `AssetsTotal` at origination, as it did before the amendment.
{% /admonition %}

## What This Means in Practice

- **Share price tracks realized income.** A vault's `AssetsTotal` no longer rises at the moment a loan is written, so a vault's shares aren't marked up on income that's still only scheduled.
- **Defaults are less disruptive.** There's no recognized interest to reverse, so a default writes down principal only.
- **`DebtTotal` is comparable to principal deployed.** A broker's `DebtTotal` under cash-basis reflects what borrowers actually owe in principal, not principal plus a full term of interest.

## See Also

- [Closed-Ended Vaults](../../xls-65-single-asset-vault/lending-protocol-1-1/closed-ended-vaults.md)
- [Updated Transactions](./updated-transactions.md)
- [Vault entry][]
- [Loan entry][]
- [LoanSet transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
